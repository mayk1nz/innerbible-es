// Funnel telemetry definitions shared by the browser (lib/analytics/track.ts) and the
// server (/api/events, webhooks). No server or browser-only imports here.

/** Browser id: "v" + 21 base-36 characters. Cookie (1 year, readable by the server) + localStorage. */
export const VID_COOKIE = 'ib_vid'
export const VID_RE = /^v[0-9a-z]{21}$/
/** Session: "s" + 11 base-36 characters, renewed after 30 minutes without events. */
export const SID_RE = /^s[0-9a-z]{11}$/
export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** Events the browser may send. Anything else is dropped by /api/events. */
export const CLIENT_EVENTS = [
  'quiz_view',
  'quiz_start',
  'quiz_answer',
  'quiz_complete',
  'offer_view',
  'vsl_play',
  'vsl_progress',
  'offer_reveal',
  'checkout_click',
  'upsell_view',
  'upsell_reveal',
  'upsell_accept_click',
  'upsell_decline_click',
  'upsell_no_purchase',
  'welcome_view',
  'app_first_open',
  'first_lesson_done',
] as const
export type ClientEventName = (typeof CLIENT_EVENTS)[number]

/** Written only by the server (webhooks, login): never accepted from the browser. */
export const SERVER_EVENTS = ['purchase', 'purchase_failed', 'login_success'] as const
export type ServerEventName = (typeof SERVER_EVENTS)[number]

export function isClientEvent(value: unknown): value is ClientEventName {
  return typeof value === 'string' && (CLIENT_EVENTS as readonly string[]).includes(value)
}

export const LIMITS = {
  /** Whole request body. */
  bodyBytes: 16 * 1024,
  /** Events per request. */
  events: 25,
  /** Keys per event's props. */
  props: 12,
  key: 32,
  string: 120,
} as const

export const ATTR_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'] as const
export type AttrKey = (typeof ATTR_KEYS)[number]

/** First arrival of a browser: campaign parameters, external referrer and entry page. */
export type Attribution = Partial<Record<AttrKey, string>> & { referrer?: string; landing?: string }

export type PropValue = string | number | boolean | null
export type Props = Record<string, PropValue>

/** Trims, drops control characters and caps the length. Undefined when empty or not a string. */
export function cleanValue(raw: unknown, max: number = LIMITS.string): string | undefined {
  if (typeof raw !== 'string') return undefined
  let out = ''
  for (const ch of raw) {
    const code = ch.charCodeAt(0)
    if (code >= 32 && code !== 127) out += ch
  }
  out = out.trim().slice(0, max)
  return out || undefined
}

/** Primitive values under short keys only; null when the shape is wrong. */
export function cleanProps(raw: unknown): Props | null {
  if (raw === undefined || raw === null) return {}
  if (typeof raw !== 'object' || Array.isArray(raw)) return null
  const out: Props = {}
  let n = 0
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!/^[a-z][a-z0-9_]{0,31}$/i.test(key)) return null
    if (++n > LIMITS.props) return null
    if (value === undefined) continue
    if (value === null || typeof value === 'boolean') out[key] = value
    else if (typeof value === 'number') {
      if (!Number.isFinite(value)) return null
      out[key] = Math.round(value * 1000) / 1000
    } else if (typeof value === 'string') out[key] = cleanValue(value) ?? ''
    else return null
  }
  return out
}

export function cleanAttribution(raw: unknown): Attribution {
  const out: Attribution = {}
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return out
  const obj = raw as Record<string, unknown>
  for (const key of ATTR_KEYS) {
    const v = cleanValue(obj[key], key === 'fbclid' ? 300 : 150)
    if (v) out[key] = v
  }
  const referrer = cleanValue(obj.referrer, 300)
  if (referrer) out.referrer = referrer
  const landing = cleanValue(obj.landing, 300)
  if (landing && landing.startsWith('/')) out.landing = landing
  return out
}

/**
 * The browser id inside a gateway's tracking field. The checkout link carries it in
 * `sck` (or `src` when `sck` is taken), alone or next to other values.
 */
export function findVid(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const m = /(?:^|[^0-9a-z])(v[0-9a-z]{21})(?![0-9a-z])/.exec(value)
  return m ? m[1] : null
}
