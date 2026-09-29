import 'server-only'
import { createHash, randomUUID } from 'node:crypto'
import { UUID_RE, VID_COOKIE, VID_RE, cleanValue, findVid, type Attribution, type Props, type ServerEventName } from '../analytics/events'
import { db, t } from './db'

// Server side of the funnel telemetry: visitors, vid ↔ e-mail links and the events only
// the server can know (purchase, login). Every exported function swallows its own errors
// and logs without the database message's details reaching any client.

function log(where: string, err: unknown): void {
  const e = err as { code?: string; message?: string } | null
  console.error(`[funnel] ${where}`, e?.code ?? '', (e?.message ?? String(err)).slice(0, 200))
}

/** The browser id cookie of a request (null when missing or malformed). */
export function vidFromRequest(request: Request): string | null {
  const m = (request.headers.get('cookie') ?? '').match(new RegExp(`(?:^|;\\s*)${VID_COOKIE}=([^;]+)`))
  const vid = m?.[1]?.trim() ?? ''
  return VID_RE.test(vid) ? vid : null
}

/** ISO country of the request (Vercel edge header), e.g. "MX". */
export function countryOf(headers: Headers): string | null {
  const c = (headers.get('x-vercel-ip-country') ?? '').trim().toUpperCase()
  return /^[A-Z]{2}$/.test(c) ? c : null
}

/** "mobile·ios", "desktop·windows"… from the user agent. */
export function deviceOf(ua: string | null): string | null {
  if (!ua) return null
  const s = ua.toLowerCase()
  if (/bot|crawler|spider|headless|lighthouse|facebookexternalhit/.test(s)) return 'bot'
  const os = /iphone|ipad|ipod/.test(s) ? 'ios' : /android/.test(s) ? 'android' : /windows/.test(s) ? 'windows' : /mac os x|macintosh/.test(s) ? 'mac' : /linux|cros/.test(s) ? 'linux' : 'other'
  const kind = /ipad|tablet/.test(s) || (/android/.test(s) && !/mobile/.test(s)) ? 'tablet' : /mobi|iphone|ipod|android/.test(s) ? 'mobile' : 'desktop'
  return `${kind}·${os}`
}

/**
 * A salted hash of the client IP, only to rate-limit (never stored). The salt changes
 * every day, so the key can't be tied back to an address later.
 */
export function ipKey(headers: Headers): string {
  const ip = (headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || headers.get('x-real-ip') || 'unknown'
  const day = new Date().toISOString().slice(0, 10)
  const salt = process.env.SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || 'ib'
  return createHash('sha256').update(`${salt.slice(0, 16)}|${day}|${ip}`).digest('hex').slice(0, 20)
}

// In-memory sliding window per instance (best effort: serverless instances don't share it).
const buckets = new Map<string, { start: number; requests: number; events: number }>()

export function rateLimited(key: string, events: number, limits = { requests: 40, events: 300, windowMs: 60_000 }): boolean {
  const now = Date.now()
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (now - b.start > limits.windowMs) buckets.delete(k)
  }
  let b = buckets.get(key)
  if (!b || now - b.start > limits.windowMs) {
    b = { start: now, requests: 0, events: 0 }
    buckets.set(key, b)
  }
  b.requests += 1
  b.events += events
  return b.requests > limits.requests || b.events > limits.events
}

/** Deterministic uuid from a key, so a webhook retried twice records one event. */
export function eventUuid(key?: string): string {
  if (key && UUID_RE.test(key)) return key.toLowerCase()
  if (!key) return randomUUID()
  const h = createHash('sha256').update(`ib-funnel:${key}`).digest('hex').slice(0, 32).split('')
  h[12] = '5'
  h[16] = ((parseInt(h[16], 16) & 0x3) | 0x8).toString(16)
  const s = h.join('')
  return `${s.slice(0, 8)}-${s.slice(8, 12)}-${s.slice(12, 16)}-${s.slice(16, 20)}-${s.slice(20, 32)}`
}

export async function touchVisitor(vid: string, attr: Attribution, country: string | null, device: string | null): Promise<void> {
  try {
    const { error } = await db().rpc(t('funnel_touch'), { p_vid: vid, p_attr: attr, p_country: country, p_device: device })
    if (error) log('touch', error)
  } catch (e) {
    log('touch', e)
  }
}

/** vid ↔ e-mail (the first e-mail linked to a browser stays). */
export async function linkVisitor(vid: string | null, email: string | null, source: 'kashpay' | 'login' | 'session' | 'stripe'): Promise<void> {
  if (!vid || !VID_RE.test(vid) || !email || !email.includes('@')) return
  try {
    const { error } = await db().rpc(t('funnel_link'), { p_vid: vid, p_email: email.trim().toLowerCase(), p_source: source })
    if (error) log('link', error)
  } catch (e) {
    log('link', e)
  }
}

/** The most recently seen browser of an e-mail. */
export async function vidForEmail(email: string | null): Promise<string | null> {
  if (!email) return null
  try {
    const { data, error } = await db()
      .from(t('funnel_visitors'))
      .select('vid')
      .eq('email', email.trim().toLowerCase())
      .order('last_seen', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (error) log('vidForEmail', error)
    return (data?.vid as string | undefined) ?? null
  } catch (e) {
    log('vidForEmail', e)
    return null
  }
}

/** First-touch source/campaign of a visitor (stored on server events for the filters). */
async function attributionOf(vid: string | null): Promise<{ utm_source: string | null; utm_campaign: string | null; country: string | null }> {
  const none = { utm_source: null, utm_campaign: null, country: null }
  if (!vid) return none
  const { data } = await db().from(t('funnel_visitors')).select('utm_source, utm_campaign, country').eq('vid', vid).maybeSingle()
  return data ? { utm_source: data.utm_source ?? null, utm_campaign: data.utm_campaign ?? null, country: data.country ?? null } : none
}

export async function recordServerEvent(input: {
  name: ServerEventName
  vid?: string | null
  email?: string | null
  props?: Props
  /** Stable key (e.g. "kashpay:paid:<order id>") → one row even if the webhook repeats. */
  key?: string
  path?: string
  country?: string | null
  device?: string | null
}): Promise<void> {
  try {
    const vid = input.vid && VID_RE.test(input.vid) ? input.vid : null
    const email = input.email ? input.email.trim().toLowerCase() : null
    if (!vid && !email) return
    const attr = await attributionOf(vid)
    const { error } = await db()
      .from(t('funnel_events'))
      .upsert(
        {
          event_id: eventUuid(input.key),
          vid,
          name: input.name,
          props: input.props ?? {},
          path: cleanValue(input.path, 200) ?? null,
          email,
          country: input.country ?? attr.country,
          device: input.device ?? null,
          utm_source: attr.utm_source,
          utm_campaign: attr.utm_campaign,
        },
        { onConflict: 'event_id', ignoreDuplicates: true },
      )
    if (error) log(`event ${input.name}`, error)
  } catch (e) {
    log(`event ${input.name}`, e)
  }
}

/** The browser id carried by a KashPay `data.tracking` object (sck / src / any field). */
export function vidFromTracking(tracking: unknown): string | null {
  if (!tracking || typeof tracking !== 'object' || Array.isArray(tracking)) return null
  const obj = tracking as Record<string, unknown>
  for (const key of ['sck', 'src', 'utm_term', 'utm_content', 'ref', 'vtid']) {
    const vid = findVid(obj[key])
    if (vid) return vid
  }
  for (const value of Object.values(obj)) {
    const vid = findVid(value)
    if (vid) return vid
  }
  return null
}
