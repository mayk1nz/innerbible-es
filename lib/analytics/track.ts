// First-party funnel telemetry, browser side. Safe to import from any client
// component; `track()` never throws and never blocks the page.
//
//   track('quiz_view', { step: 3, name: 'perfil:edad' })
//
// Events are queued and sent in batches to POST /api/events with navigator.sendBeacon
// (survives navigations, e.g. the click that opens the checkout). Every batch carries:
//   vid  browser id: cookie ib_vid (1 year, first party, read by the server at login)
//        mirrored in localStorage, so either one restores the other
//   sid  session: new after 30 minutes without events
//   a    first-touch attribution (utm_*, fbclid, external referrer, entry page), kept
//        in localStorage from the first arrival on
// The Meta Pixel (lib/funnel/tracking.ts) is separate and unchanged.

import { ATTR_KEYS, VID_COOKIE, VID_RE, SID_RE, cleanProps, type Attribution, type ClientEventName } from './events'

const ENDPOINT = '/api/events'
const LS_VID = 'ib-vid'
const LS_SESSION = 'ib-session'
const LS_ATTR = 'ib-attr'
const SESSION_MS = 30 * 60 * 1000
const YEAR_S = 365 * 24 * 60 * 60
const FLUSH_MS = 1200
const MAX_BATCH = 20

interface Queued {
  n: ClientEventName
  id: string
  t: number
  p: Record<string, string | number | boolean | null>
  path: string
}

let vidMemo: string | null = null
let attrMemo: Attribution | null = null
let sessionMemo: { id: string; last: number } | null = null
let queue: Queued[] = []
let timer: ReturnType<typeof setTimeout> | null = null
let listening = false

function randomBase36(length: number): string {
  const bytes = new Uint8Array(length)
  try {
    crypto.getRandomValues(bytes)
  } catch {
    for (let i = 0; i < length; i++) bytes[i] = Math.floor(Math.random() * 256)
  }
  let out = ''
  for (const b of bytes) out += (b % 36).toString(36)
  return out
}

function uuid(): string {
  try {
    if (typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  } catch {
    // insecure context: fall through
  }
  const h = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16))
  h[12] = '4'
  h[16] = ((parseInt(h[16], 16) & 0x3) | 0x8).toString(16)
  const s = h.join('')
  return `${s.slice(0, 8)}-${s.slice(8, 12)}-${s.slice(12, 16)}-${s.slice(16, 20)}-${s.slice(20)}`
}

function lsGet(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function lsSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    // private mode / blocked storage: memory only
  }
}

function readCookie(name: string): string | null {
  try {
    const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))
    return m ? decodeURIComponent(m[1]) : null
  } catch {
    return null
  }
}

function writeVidCookie(vid: string): void {
  try {
    const secure = location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${VID_COOKIE}=${vid}; Max-Age=${YEAR_S}; Path=/; SameSite=Lax${secure}`
  } catch {
    // cookies blocked
  }
}

/** This browser's id (created on first use). Null only on the server. */
export function getVid(): string | null {
  if (typeof window === 'undefined') return null
  if (vidMemo) return vidMemo
  const fromCookie = readCookie(VID_COOKIE)
  const fromStorage = lsGet(LS_VID)
  const vid = fromCookie && VID_RE.test(fromCookie) ? fromCookie : fromStorage && VID_RE.test(fromStorage) ? fromStorage : `v${randomBase36(21)}`
  if (vid !== fromCookie) writeVidCookie(vid)
  if (vid !== fromStorage) lsSet(LS_VID, vid)
  vidMemo = vid
  return vid
}

function sessionId(now: number): string {
  if (!sessionMemo) {
    try {
      const saved = JSON.parse(lsGet(LS_SESSION) || 'null') as { id?: unknown; last?: unknown } | null
      if (saved && typeof saved.id === 'string' && SID_RE.test(saved.id) && typeof saved.last === 'number') sessionMemo = { id: saved.id, last: saved.last }
    } catch {
      sessionMemo = null
    }
  }
  if (!sessionMemo || now - sessionMemo.last > SESSION_MS) sessionMemo = { id: `s${randomBase36(11)}`, last: now }
  else sessionMemo.last = now
  lsSet(LS_SESSION, JSON.stringify(sessionMemo))
  return sessionMemo.id
}

/** First arrival of this browser (kept once; later arrivals never overwrite it). */
export function getAttribution(): Attribution {
  if (attrMemo) return attrMemo
  try {
    const saved = JSON.parse(lsGet(LS_ATTR) || 'null') as Attribution | null
    if (saved && typeof saved === 'object' && typeof saved.landing === 'string') {
      attrMemo = saved
      return saved
    }
  } catch {
    // corrupt: rebuild below
  }
  const attr: Attribution = {}
  try {
    const params = new URLSearchParams(location.search)
    for (const key of ATTR_KEYS) {
      const v = params.get(key)
      if (v) attr[key] = v.slice(0, key === 'fbclid' ? 300 : 150)
    }
    if (document.referrer) {
      const ref = new URL(document.referrer)
      if (ref.host !== location.host) attr.referrer = `${ref.origin}${ref.pathname}`.slice(0, 300)
    }
    // Entry page without KashPay's ks or other long tokens: path + campaign keys only.
    attr.landing = location.pathname.slice(0, 200)
  } catch {
    attr.landing = '/'
  }
  attrMemo = attr
  lsSet(LS_ATTR, JSON.stringify(attr))
  return attr
}

function send(body: string): void {
  try {
    if (typeof navigator.sendBeacon === 'function' && navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'text/plain;charset=UTF-8' }))) return
  } catch {
    // fall back to fetch
  }
  try {
    void fetch(ENDPOINT, { method: 'POST', body, keepalive: true, credentials: 'same-origin', headers: { 'content-type': 'text/plain;charset=UTF-8' } }).catch(() => {})
  } catch {
    // never surfaces
  }
}

/** Sends what is queued now. Call it right before leaving the page. */
export function flush(): void {
  try {
    if (timer) clearTimeout(timer)
    timer = null
    while (queue.length) {
      const batch = queue.slice(0, MAX_BATCH)
      queue = queue.slice(MAX_BATCH)
      const vid = getVid()
      if (!vid) return
      send(JSON.stringify({ v: 1, vid, sid: sessionId(Date.now()), a: getAttribution(), s: Date.now(), e: batch }))
    }
  } catch {
    queue = []
  }
}

function listen(): void {
  if (listening) return
  listening = true
  window.addEventListener('pagehide', flush)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush()
  })
}

export function track(name: ClientEventName, props?: Record<string, string | number | boolean | null | undefined>): void {
  try {
    if (typeof window === 'undefined') return
    listen()
    getVid()
    getAttribution()
    const clean = cleanProps(props ?? {})
    queue.push({ n: name, id: uuid(), t: Date.now(), p: clean ?? {}, path: location.pathname.slice(0, 200) })
    if (queue.length >= MAX_BATCH) flush()
    else if (!timer) timer = setTimeout(flush, FLUSH_MS)
  } catch {
    // telemetry must never break the page
  }
}

/** track() once per browser for `key` (e.g. the first lesson of an account). */
export function trackOnce(key: string, name: ClientEventName, props?: Record<string, string | number | boolean | null | undefined>): void {
  try {
    const flag = `ib-evt:${key}`
    if (lsGet(flag)) return
    lsSet(flag, '1')
    track(name, props)
  } catch {
    // ignore
  }
}

const ATTRIBUTION_PARAM = /^(utm_(source|medium|campaign|content|term|id)|src|sck|xcod|fbclid|gclid|ttclid)$/

/**
 * The KashPay checkout link with the visitor's campaign parameters (from the current
 * URL, else the first arrival) and the browser id, so the webhook's `data.tracking` can
 * tie the order back to this visitor. The id goes in `sck` (or `src` when the link or the
 * visitor already has a `sck`). Never overrides a parameter the link already has; any
 * failure returns the link untouched.
 */
export function checkoutUrl(target: string): string {
  try {
    const url = new URL(target)
    if (url.protocol !== 'https:') return target
    new URLSearchParams(location.search).forEach((value, key) => {
      if (ATTRIBUTION_PARAM.test(key) && !url.searchParams.has(key)) url.searchParams.set(key, value)
    })
    const attr = getAttribution()
    for (const key of ATTR_KEYS) {
      if (key === 'fbclid') continue
      const v = attr[key]
      if (v && !url.searchParams.has(key)) url.searchParams.set(key, v)
    }
    const vid = getVid()
    if (vid) {
      const slot = ['sck', 'src'].find((k) => !url.searchParams.has(k))
      if (slot) url.searchParams.set(slot, vid)
    }
    return url.href
  } catch {
    return target
  }
}
