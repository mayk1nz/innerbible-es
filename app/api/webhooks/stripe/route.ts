import { notifyAdmins } from '@/lib/server/admin-alerts'
import { db, t } from '@/lib/server/db'
import { vidForEmail } from '@/lib/server/funnel'
import { alertKeyOf, declineMessage, flattenStripeEvent, verifyStripeSignature } from '@/lib/server/stripe'

// Stripe webhook of the owner's account (KashPay charges through it). Every event is
// verified (Stripe-Signature, STRIPE_WEBHOOK_SECRET, 5 minutes of tolerance), flattened
// into stripe_events (reason, card country, outcome…) and tied to the funnel visitor by
// e-mail. A failed payment pushes one alert to the admins' devices (one per payment).
// Without the secret configured every event is refused.
//
// Events to enable in Stripe: payment_intent.succeeded, payment_intent.payment_failed,
// charge.succeeded, charge.failed, invoice.paid, invoice.payment_failed,
// customer.subscription.created, customer.subscription.deleted.

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim().split(/\s+/)[0]
  if (!secret) return Response.json({ error: 'not-configured' }, { status: 503 })

  const raw = await request.text()
  if (raw.length > 512 * 1024) return Response.json({ error: 'too-large' }, { status: 413 })
  if (!verifyStripeSignature(raw, request.headers.get('stripe-signature'), secret)) {
    return Response.json({ error: 'invalid-signature' }, { status: 400 })
  }

  let event: Record<string, unknown>
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('shape')
    event = parsed as Record<string, unknown>
  } catch {
    return Response.json({ error: 'invalid-json' }, { status: 400 })
  }

  const row = flattenStripeEvent(event)
  if (!row) return Response.json({ received: true, ignored: true })

  try {
    // E-mail: the event's own fields; else an earlier event of the same customer; else the
    // KashPay order paid with this payment intent / subscription.
    if (!row.email && row.customer_id) {
      const { data } = await db().from(t('stripe_events')).select('email').eq('customer_id', row.customer_id).not('email', 'is', null).limit(1).maybeSingle()
      row.email = (data?.email as string | undefined) ?? null
    }
    if (!row.email && (row.payment_intent || row.subscription_id)) {
      const column = row.payment_intent ? 'payload->data->payment_details->>id' : 'payload->data->subscription->>id'
      const { data } = await db()
        .from(t('kashpay_events'))
        .select('email')
        .eq(column, row.payment_intent ?? row.subscription_id)
        .not('email', 'is', null)
        .limit(1)
        .maybeSingle()
      row.email = (data?.email as string | undefined) ?? null
    }
  } catch {
    // enrichment is best effort
  }

  const vid = await vidForEmail(row.email)
  const alertKey = alertKeyOf(row)
  const data = event.data as { object?: unknown } | undefined

  const { error } = await db()
    .from(t('stripe_events'))
    .insert({ ...row, vid, alert_key: alertKey, payload: data?.object ?? null })
  if (error) {
    if (error.code === '23505') return Response.json({ received: true, duplicate: true })
    console.error('stripe-webhook: could not store event', error.code ?? '')
    // 500 → Stripe retries later; nothing is lost.
    return Response.json({ error: 'store' }, { status: 500 })
  }

  let alert: { title: string; body: string; result: string; dry: boolean } | null = null
  if (alertKey) {
    const message = declineMessage(row)
    // One push per payment: the first failure event of this payment claims the key.
    const { error: claimError } = await db().from(t('stripe_alerts')).insert({ key: alertKey, stripe_event_id: row.stripe_event_id, ...message })
    if (!claimError) {
      try {
        const sent = await notifyAdmins({ ...message, url: '/admin/funil', tag: `pago-${alertKey}` })
        await db().from(t('stripe_alerts')).update({ dry: sent.dry, result: sent.result }).eq('key', alertKey)
        alert = { ...message, result: sent.result, dry: sent.dry }
      } catch {
        await db().from(t('stripe_alerts')).update({ result: 'push failed' }).eq('key', alertKey)
      }
    }
  }

  return Response.json({ received: true, ...(alert?.dry ? { alert } : {}) })
}

/** Lets a browser (or Stripe's URL check) see the endpoint is alive. */
export async function GET() {
  return Response.json({ ok: true, endpoint: 'stripe-webhook', configured: Boolean(process.env.STRIPE_WEBHOOK_SECRET?.trim()) })
}
