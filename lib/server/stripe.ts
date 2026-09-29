import 'server-only'
import { createHmac, timingSafeEqual } from 'node:crypto'

// Reading Stripe webhooks (KashPay charges through the owner's own Stripe account, so
// Stripe sees every card attempt — including the declines KashPay only reports as
// "failed"). No Stripe SDK: the signature check and the fields we keep are small.

type Obj = { [key: string]: unknown }

const isObj = (v: unknown): v is Obj => Boolean(v) && typeof v === 'object' && !Array.isArray(v)
const str = (v: unknown): string | null => (typeof v === 'string' && v ? v : null)
const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null)
/** An id field that may be a string or an expanded object with an id. */
const idOf = (v: unknown): string | null => str(v) ?? (isObj(v) ? str(v.id) : null)

/**
 * Stripe-Signature: "t=<unix>,v1=<hex>[,v1=…]". Valid when one v1 equals
 * HMAC-SHA256(secret, "<t>.<raw body>") and t is within `toleranceS` of now.
 */
export function verifyStripeSignature(rawBody: string, header: string | null, secret: string, toleranceS = 300, nowS = Math.floor(Date.now() / 1000)): boolean {
  if (!header || !secret) return false
  let timestamp: number | null = null
  const signatures: string[] = []
  for (const part of header.split(',')) {
    const i = part.indexOf('=')
    if (i < 0) continue
    const key = part.slice(0, i).trim()
    const value = part.slice(i + 1).trim()
    if (key === 't' && /^\d{1,12}$/.test(value)) timestamp = Number(value)
    else if (key === 'v1' && /^[0-9a-f]{64}$/i.test(value)) signatures.push(value.toLowerCase())
  }
  if (timestamp === null || !signatures.length) return false
  if (Math.abs(nowS - timestamp) > toleranceS) return false
  const expected = Buffer.from(createHmac('sha256', secret).update(`${timestamp}.${rawBody}`, 'utf8').digest('hex'))
  return signatures.some((s) => {
    const given = Buffer.from(s)
    return given.length === expected.length && timingSafeEqual(given, expected)
  })
}

export const STRIPE_TYPES = [
  'payment_intent.succeeded',
  'payment_intent.payment_failed',
  'charge.succeeded',
  'charge.failed',
  'invoice.paid',
  'invoice.payment_failed',
  'customer.subscription.created',
  'customer.subscription.deleted',
] as const

export const FAILURE_TYPES = new Set(['payment_intent.payment_failed', 'charge.failed', 'invoice.payment_failed'])

export interface StripeRow {
  stripe_event_id: string
  type: string
  livemode: boolean | null
  event_created: string | null
  object_id: string | null
  payment_intent: string | null
  charge_id: string | null
  invoice_id: string | null
  customer_id: string | null
  subscription_id: string | null
  email: string | null
  amount: number | null
  currency: string | null
  status: string | null
  decline_code: string | null
  failure_code: string | null
  failure_message: string | null
  card_country: string | null
  card_brand: string | null
  card_funding: string | null
  outcome_reason: string | null
  outcome_risk_level: string | null
  outcome_network_status: string | null
  outcome_type: string | null
}

function emailIn(...candidates: unknown[]): string | null {
  for (const c of candidates) {
    const e = str(c)
    if (e && e.includes('@')) return e.trim().toLowerCase()
  }
  return null
}

/** The fields we keep from one event (unknown shapes just leave columns empty). */
export function flattenStripeEvent(event: Obj): StripeRow | null {
  const id = str(event.id)
  const type = str(event.type)
  const data = isObj(event.data) ? event.data : null
  const o = data && isObj(data.object) ? data.object : null
  if (!id || !type || !o) return null
  const created = num(event.created)

  const row: StripeRow = {
    stripe_event_id: id,
    type,
    livemode: typeof event.livemode === 'boolean' ? event.livemode : null,
    event_created: created ? new Date(created * 1000).toISOString() : null,
    object_id: str(o.id),
    payment_intent: null,
    charge_id: null,
    invoice_id: null,
    customer_id: idOf(o.customer),
    subscription_id: null,
    email: null,
    amount: null,
    currency: str(o.currency)?.toUpperCase() ?? null,
    status: str(o.status),
    decline_code: null,
    failure_code: null,
    failure_message: null,
    card_country: null,
    card_brand: null,
    card_funding: null,
    outcome_reason: null,
    outcome_risk_level: null,
    outcome_network_status: null,
    outcome_type: null,
  }

  const card = (pm: unknown) => {
    const c = isObj(pm) && isObj(pm.card) ? pm.card : null
    if (!c) return
    row.card_country ??= str(c.country)?.toUpperCase() ?? null
    row.card_brand ??= str(c.brand)
    row.card_funding ??= str(c.funding)
  }

  if (type.startsWith('payment_intent.')) {
    row.payment_intent = str(o.id)
    row.amount = num(o.amount)
    row.charge_id = idOf(o.latest_charge)
    const err = isObj(o.last_payment_error) ? o.last_payment_error : null
    const pm = err && isObj(err.payment_method) ? err.payment_method : null
    if (err) {
      row.decline_code = str(err.decline_code)
      row.failure_code = str(err.code)
      row.failure_message = str(err.message)
      row.charge_id = idOf(err.charge) ?? row.charge_id
      card(pm)
    }
    row.email = emailIn(o.receipt_email, pm && isObj(pm.billing_details) ? pm.billing_details.email : null)
    row.invoice_id = idOf(o.invoice)
  } else if (type.startsWith('charge.')) {
    row.charge_id = str(o.id)
    row.payment_intent = idOf(o.payment_intent)
    row.invoice_id = idOf(o.invoice)
    row.amount = num(o.amount)
    row.failure_code = str(o.failure_code)
    row.failure_message = str(o.failure_message)
    const outcome = isObj(o.outcome) ? o.outcome : null
    if (outcome) {
      row.outcome_reason = str(outcome.reason)
      row.outcome_risk_level = str(outcome.risk_level)
      row.outcome_network_status = str(outcome.network_status)
      row.outcome_type = str(outcome.type)
    }
    const details = isObj(o.payment_method_details) ? o.payment_method_details : null
    card(details)
    row.email = emailIn(isObj(o.billing_details) ? o.billing_details.email : null, o.receipt_email)
  } else if (type.startsWith('invoice.')) {
    row.invoice_id = str(o.id)
    row.amount = num(type === 'invoice.paid' ? o.amount_paid : o.amount_due)
    row.charge_id = idOf(o.charge)
    row.payment_intent = idOf(o.payment_intent)
    // Newer API versions: the payment lives in invoice.payments.data[].payment.
    const payments = isObj(o.payments) && Array.isArray(o.payments.data) ? o.payments.data : []
    for (const p of payments) {
      const payment = isObj(p) && isObj(p.payment) ? p.payment : null
      if (payment) {
        row.payment_intent ??= idOf(payment.payment_intent)
        row.charge_id ??= idOf(payment.charge)
      }
    }
    row.subscription_id = idOf(o.subscription) ?? (isObj(o.parent) && isObj(o.parent.subscription_details) ? idOf(o.parent.subscription_details.subscription) : null)
    row.email = emailIn(o.customer_email)
  } else if (type.startsWith('customer.subscription.')) {
    row.subscription_id = str(o.id)
    const items = isObj(o.items) && Array.isArray(o.items.data) ? o.items.data : []
    const first = items.find(isObj)
    const price = first && isObj(first.price) ? first.price : null
    row.amount = price ? num(price.unit_amount) : null
    row.currency = (price ? str(price.currency) : null)?.toUpperCase() ?? row.currency
    const cancel = isObj(o.cancellation_details) ? o.cancellation_details : null
    if (cancel) row.failure_code = str(cancel.reason)
  }
  return row
}

/** One alert per payment: the payment intent when known (retries of a card share it). */
export function alertKeyOf(row: StripeRow): string | null {
  if (!FAILURE_TYPES.has(row.type)) return null
  if (row.type === 'invoice.payment_failed') return row.payment_intent ?? row.charge_id
  return row.payment_intent ?? row.charge_id ?? row.object_id
}

const ZERO_DECIMAL = new Set(['BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA', 'PYG', 'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF'])
const SYMBOL: Record<string, string> = { USD: 'US$', BRL: 'R$', EUR: '€', MXN: 'MX$', GBP: '£' }

/** 1190 USD → "US$ 11,90" (Spanish decimal comma). */
export function formatMoney(amount: number | null, currency: string | null): string {
  if (amount === null) return ''
  const cur = (currency ?? 'USD').toUpperCase()
  const value = ZERO_DECIMAL.has(cur) ? String(amount) : (amount / 100).toFixed(2).replace('.', ',')
  return `${SYMBOL[cur] ?? cur} ${value}`
}

/** "maykseat05@gmail.com" → "ma…@gmail.com" */
export function maskEmail(email: string | null): string {
  if (!email) return 'sin e-mail'
  const [user, domain] = email.split('@')
  return `${user.slice(0, 2)}…@${domain ?? ''}`
}

/** The declined-payment push: «💳 Pago rechazado — US$ 11,90» / «ma…@gmail.com · currency_not_supported · tarjeta BR». */
export function declineMessage(row: StripeRow): { title: string; body: string } {
  const money = formatMoney(row.amount, row.currency)
  const reason = row.decline_code ?? row.outcome_reason ?? row.failure_code ?? 'motivo desconocido'
  const parts = [maskEmail(row.email), reason]
  if (row.card_country) parts.push(`tarjeta ${row.card_country}`)
  return { title: `💳 Pago rechazado${money ? ` — ${money}` : ''}`, body: parts.join(' · ') }
}
