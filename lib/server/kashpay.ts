import 'server-only'
import { createHmac, timingSafeEqual } from 'node:crypto'
import type { OfferId } from '../catalog'

// Reading KashPay webhooks. KashPay has no public documentation of the payload, so the
// parser looks for the fields by name anywhere in it (e-mail, product name, dates) and
// every event is stored raw first — nothing is lost if a field turns out to be elsewhere.

type Json = null | boolean | number | string | Json[] | { [key: string]: Json }

/**
 * Product name in KashPay → what it unlocks (most specific first). The annual plan
 * ("…Anual…") opens the three offers for a year.
 */
const PRODUCT_RULES: { match: RegExp; offers: OfferId[]; days?: number }[] = [
  { match: /anual|annual|12 meses/i, offers: ['front', 'upsell1', 'upsell2'], days: 366 },
  { match: /palabras del se(n|ñ)or|hacedores/i, offers: ['upsell2'] },
  { match: /audio/i, offers: ['upsell1'] },
  // The front is "Estudio Cronológico de la Biblia" in KashPay (also accept the app's name).
  { match: /(resumen|estudio) cronol(o|ó)gico|cronolog(i|í)a b(i|í)blica|la biblia interior/i, offers: ['front'] },
]

function walk(node: Json, visit: (key: string, value: Json, path: string) => void, path = ''): void {
  if (Array.isArray(node)) node.forEach((v, i) => walk(v, visit, `${path}[${i}]`))
  else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      visit(k.toLowerCase(), v, `${path}.${k.toLowerCase()}`)
      walk(v, visit, `${path}.${k.toLowerCase()}`)
    }
  }
}

export interface ParsedEvent {
  event: string
  email: string | null
  product: string | null
  /** Offers this product opens (empty = not one of ours). */
  offers: OfferId[]
  /** How long a payment opens them when the event carries no date (default: a month). */
  days: number
  periodEnd: string | null
}

export function parseEvent(payload: Json): ParsedEvent {
  const root = payload && typeof payload === 'object' && !Array.isArray(payload) ? payload : {}
  const event = typeof root.event === 'string' ? root.event : typeof root.type === 'string' ? root.type : ''
  let email: string | null = null
  const productNames: string[] = []
  let periodEnd: string | null = null

  walk(payload, (key, value, path) => {
    if (typeof value !== 'string') return
    if (!email && key.includes('email') && /@/.test(value) && !/seller|merchant|producer|owner/.test(path)) email = value.trim().toLowerCase()
    if ((key === 'name' || key === 'title' || key.includes('product_name') || key === 'productname') && /product|item|offer|plan/.test(path)) productNames.push(value)
    if (!periodEnd && /(current_period_end|period_end|next_billing|next_charge|next_payment|expires_at|expiration)/.test(key) && !Number.isNaN(Date.parse(value))) periodEnd = new Date(value).toISOString()
  })

  // Fallback: a product name anywhere in the payload.
  const haystack = productNames.length ? productNames.join(' | ') : JSON.stringify(payload)
  const rule = PRODUCT_RULES.find((r) => r.match.test(haystack))
  return { event, email, product: productNames[0] ?? null, offers: rule?.offers ?? [], days: rule?.days ?? 31, periodEnd }
}

/**
 * Signature check. The header name and format are not documented, so: any header
 * containing "signature" is compared with an HMAC-SHA256 of the raw body (hex, base64,
 * with or without "sha256="). null = nothing to check (no header or no secret).
 */
export function checkSignature(rawBody: string, headers: Record<string, string>): boolean | null {
  const secret = process.env.KASHPAY_WEBHOOK_SECRET
  const header = Object.entries(headers).find(([k]) => k.includes('signature'))?.[1]
  if (!secret || !header) return null
  const given = header.replace(/^sha256=/i, '').trim()
  const mac = createHmac('sha256', secret).update(rawBody)
  const digest = mac.digest()
  for (const candidate of [digest.toString('hex'), digest.toString('base64'), digest.toString('base64url')]) {
    const a = Buffer.from(candidate)
    const b = Buffer.from(given)
    if (a.length === b.length && timingSafeEqual(a, b)) return true
  }
  return false
}
