import { db } from '@/lib/server/db'
import { checkSignature, parseEvent } from '@/lib/server/kashpay'

// KashPay webhook. Every event is stored raw first (kashpay_events), then applied to
// the member's access (entitlements):
//   order.paid · subscription.created · subscription.renewed → active until the paid date
//   subscription.failed → past_due (access continues until the paid date + grace)
//   subscription.canceled → canceled (access until the end of what was paid)
//   order.refunded · order.chargeback → refunded (closed at once)
// Other events (created, awaiting payment, abandoned, failed) are only stored.

export const dynamic = 'force-dynamic'

const MONTH_MS = 31 * 86_400_000

const STATUS: Record<string, 'active' | 'past_due' | 'canceled' | 'refunded'> = {
  'order.paid': 'active',
  'subscription.created': 'active',
  'subscription.renewed': 'active',
  'subscription.failed': 'past_due',
  'subscription.canceled': 'canceled',
  'order.refunded': 'refunded',
  'order.chargeback': 'refunded',
}

export async function POST(request: Request) {
  const raw = await request.text()
  const headers: Record<string, string> = {}
  request.headers.forEach((value, key) => {
    if (key !== 'cookie' && key !== 'authorization') headers[key] = value
  })
  let payload: unknown
  try {
    payload = JSON.parse(raw)
  } catch {
    payload = { raw }
  }

  const parsed = parseEvent(payload as Parameters<typeof parseEvent>[0])
  const signatureOk = checkSignature(raw, headers)
  const status = STATUS[parsed.event]

  let note = ''
  if (!status) note = 'stored only'
  else if (signatureOk === false) note = 'signature mismatch: not applied'
  else if (!parsed.email) note = 'no e-mail found: not applied'
  else if (!parsed.offer) note = 'unknown product: not applied'

  const { data: stored, error: storeError } = await db()
    .from('kashpay_events')
    .insert({ event: parsed.event || null, email: parsed.email, product: parsed.product, headers, payload, signature_ok: signatureOk, note: note || null })
    .select('id')
    .single()
  if (storeError) {
    console.error('kashpay-webhook: could not store event', storeError.message)
    // 500 → KashPay retries later; nothing is lost.
    return Response.json({ ok: false }, { status: 500 })
  }

  if (!note && status && parsed.email && parsed.offer) {
    const periodEnd =
      status === 'active' ? (parsed.periodEnd ?? new Date(Date.now() + MONTH_MS).toISOString()) : parsed.periodEnd
    const row: Record<string, unknown> = {
      email: parsed.email,
      offer: parsed.offer,
      status,
      product: parsed.product,
      source: 'kashpay',
      updated_at: new Date().toISOString(),
    }
    // Keep the known paid-until date when the event doesn't bring one; a cancellation
    // or failure for someone with no row yet must not open anything (end = now).
    if (periodEnd) row.current_period_end = periodEnd
    else {
      const { data: existing } = await db().from('entitlements').select('email').eq('email', parsed.email).eq('offer', parsed.offer).maybeSingle()
      if (!existing) row.current_period_end = new Date().toISOString()
    }
    const { error } = await db().from('entitlements').upsert(row, { onConflict: 'email,offer' })
    await db()
      .from('kashpay_events')
      .update({ processed: !error, note: error ? `apply failed: ${error.message}` : `applied: ${parsed.offer} ${status}` })
      .eq('id', stored.id)
  }

  return Response.json({ ok: true })
}

/** Lets a browser (or KashPay's URL check) see the endpoint is alive. */
export async function GET() {
  return Response.json({ ok: true, endpoint: 'kashpay-webhook' })
}
