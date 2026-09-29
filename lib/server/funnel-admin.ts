import 'server-only'
import type { FunnelResponse, Journey, Kpi, RangeKey, Report, StripeFailure, TimelineItem } from '../admin/funnel-types'
import { db, t } from './db'
import { formatMoney } from './stripe'

// Everything /admin/funil shows, in one read: KPIs (today / 7 d / 30 d), the report of
// the chosen range (SQL: funnel_report), the source list, the last Stripe declines and
// the live feed of the latest journeys (visitor → events → payments).

const TZ = 'America/Sao_Paulo'
const DAY_MS = 86_400_000

/** Midnight of today in the owner's time zone (Brazil: UTC-3, no DST since 2019). */
export function startOfToday(now = new Date()): Date {
  const day = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now)
  return new Date(`${day}T00:00:00-03:00`)
}

export function rangeOf(key: RangeKey, now = new Date()): { from: Date; to: Date } {
  const today = startOfToday(now)
  const days = key === 'today' ? 0 : key === '7d' ? 6 : 29
  return { from: new Date(today.getTime() - days * DAY_MS), to: new Date(now.getTime() + 60_000) }
}

type Row = Record<string, unknown>
const s = (v: unknown): string => (typeof v === 'string' ? v : typeof v === 'number' || typeof v === 'boolean' ? String(v) : '')
const n = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null)

/** A price in dollars (props.price) → "US$ 11,90". */
const usd = (v: unknown): string => (typeof v === 'number' && Number.isFinite(v) ? `US$ ${v.toFixed(2).replace('.', ',')}` : '')

function eventDetail(name: string, p: Row): string {
  switch (name) {
    case 'quiz_view':
      return s(p.name)
    case 'quiz_answer':
      return `${s(p.q)} = ${s(p.choice)}`
    case 'quiz_complete':
      return `acertou ${s(p.score)}/${s(p.total)}`
    case 'vsl_play':
      return `${s(p.page)}`
    case 'vsl_progress':
      return `${s(p.page)} ${s(p.pct)}% (${s(p.sec)} s)`
    case 'offer_view':
    case 'offer_reveal':
      return s(p.page)
    case 'checkout_click':
      return usd(p.price)
    case 'upsell_view':
      return `${s(p.step)}${p.from_purchase === true ? ' · veio da compra' : ' · sem ks'}`
    case 'upsell_reveal':
    case 'upsell_no_purchase':
    case 'upsell_decline_click':
      return s(p.step)
    case 'upsell_accept_click':
      return `${s(p.step)} · ${usd(p.price)}`
    case 'purchase':
    case 'purchase_failed':
      return `${s(p.offer)} · ${formatMoney(n(p.amount_cents), s(p.currency) || 'USD')}`
    case 'first_lesson_done':
      return s(p.lesson)
    default:
      return ''
  }
}

const screens = (k: number) => `${k} ${k === 1 ? 'tela' : 'telas'}`

/** Consecutive quiz screens and answers become one line: "até test:4 · 9 telas". */
function compressQuiz(items: TimelineItem[]): TimelineItem[] {
  const out: TimelineItem[] = []
  let count = 0
  for (const it of items) {
    const quiz = it.kind === 'event' && (it.name === 'quiz_view' || it.name === 'quiz_answer')
    const last = out[out.length - 1]
    if (quiz && last && last.name === 'quiz') {
      if (it.name === 'quiz_view') {
        count += 1
        last.detail = `até ${it.detail} · ${screens(count)}`
      }
      continue
    }
    if (quiz) {
      count = it.name === 'quiz_view' ? 1 : 0
      out.push({ ...it, name: 'quiz', detail: it.name === 'quiz_view' ? `até ${it.detail} · ${screens(1)}` : it.detail })
      continue
    }
    out.push(it)
  }
  return out
}

async function loadFeed(source: string | null): Promise<Journey[]> {
  let q = db()
    .from(t('funnel_visitors'))
    .select('vid, email, first_seen, last_seen, utm_source, utm_campaign, country, device, landing_path, referrer')
    .order('last_seen', { ascending: false })
    .limit(20)
  if (source && source !== 'all') q = source === '(direto)' ? q.is('utm_source', null) : q.eq('utm_source', source)
  const { data: visitors, error } = await q
  if (error) throw error
  const list = (visitors ?? []) as Row[]
  if (!list.length) return []
  const vids = list.map((v) => s(v.vid))
  const emails = [...new Set(list.map((v) => s(v.email)).filter(Boolean))]

  const [byVid, byEmail, stripe, kashpay] = await Promise.all([
    db().from(t('funnel_events')).select('vid, email, name, props, created_at').in('vid', vids).order('created_at', { ascending: false }).order('id', { ascending: false }).limit(2000),
    emails.length
      ? db().from(t('funnel_events')).select('vid, email, name, props, created_at').is('vid', null).in('email', emails).order('created_at', { ascending: false }).order('id', { ascending: false }).limit(300)
      : Promise.resolve({ data: [] as Row[], error: null }),
    emails.length
      ? db()
          .from(t('stripe_events'))
          .select('email, type, amount, currency, status, decline_code, outcome_reason, failure_code, card_country, event_created, received_at')
          .in('email', emails)
          .order('received_at', { ascending: false })
          .limit(300)
      : Promise.resolve({ data: [] as Row[], error: null }),
    emails.length
      ? db().from(t('kashpay_events')).select('email, event, product, received_at').in('email', emails).order('received_at', { ascending: false }).limit(300)
      : Promise.resolve({ data: [] as Row[], error: null }),
  ])
  for (const r of [byVid, byEmail, stripe, kashpay]) if (r.error) throw r.error

  // Oldest first, so events with the same timestamp keep the order they were recorded in (the sort below is stable).
  const events = [...((byVid.data ?? []) as Row[]).reverse(), ...((byEmail.data ?? []) as Row[]).reverse()]
  return list.map((v) => {
    const vid = s(v.vid)
    const email = s(v.email) || null
    const items: TimelineItem[] = []
    for (const e of events) {
      if (e.vid ? e.vid !== vid : !email || e.email !== email) continue
      const name = s(e.name)
      const props = (e.props && typeof e.props === 'object' ? e.props : {}) as Row
      items.push({
        at: s(e.created_at),
        kind: 'event',
        name,
        detail: eventDetail(name, props),
        tone: name === 'purchase' ? 'good' : name === 'purchase_failed' ? 'bad' : 'neutral',
      })
    }
    if (email) {
      for (const r of (stripe.data ?? []) as Row[]) {
        if (r.email !== email) continue
        const type = s(r.type)
        const failed = /failed/.test(type)
        const reason = s(r.decline_code) || s(r.outcome_reason) || s(r.failure_code)
        items.push({
          at: s(r.event_created) || s(r.received_at),
          kind: 'stripe',
          name: type,
          detail: [formatMoney(n(r.amount), s(r.currency) || null), failed ? reason : s(r.status), s(r.card_country) ? `cartão ${s(r.card_country)}` : ''].filter(Boolean).join(' · '),
          tone: failed ? 'bad' : /succeeded|paid/.test(type) ? 'good' : 'neutral',
        })
      }
      for (const r of (kashpay.data ?? []) as Row[]) {
        if (r.email !== email) continue
        const event = s(r.event)
        items.push({
          at: s(r.received_at),
          kind: 'kashpay',
          name: event,
          detail: s(r.product),
          tone: event === 'order.paid' || event.startsWith('subscription.renewed') ? 'good' : /failed|refunded|chargeback|canceled/.test(event) ? 'bad' : 'neutral',
        })
      }
    }
    items.sort((a, b) => a.at.localeCompare(b.at))
    return {
      vid,
      email,
      first_seen: s(v.first_seen),
      last_seen: s(v.last_seen),
      source: s(v.utm_source) || null,
      campaign: s(v.utm_campaign) || null,
      country: s(v.country) || null,
      device: s(v.device) || null,
      landing: s(v.landing_path) || null,
      referrer: s(v.referrer) || null,
      items: compressQuiz(items).slice(-80),
    }
  })
}

async function loadSources(): Promise<{ source: string; campaigns: string[] }[]> {
  const since = new Date(Date.now() - 90 * DAY_MS).toISOString()
  const { data, error } = await db().from(t('funnel_visitors')).select('utm_source, utm_campaign').gte('first_seen', since).limit(5000)
  if (error) throw error
  const map = new Map<string, Set<string>>()
  for (const r of (data ?? []) as Row[]) {
    const src = s(r.utm_source) || '(direto)'
    if (!map.has(src)) map.set(src, new Set())
    if (s(r.utm_campaign)) map.get(src)?.add(s(r.utm_campaign))
  }
  return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([source, c]) => ({ source, campaigns: [...c].sort() }))
}

async function loadStripeRecent(from: Date): Promise<StripeFailure[]> {
  const { data, error } = await db()
    .from(t('stripe_events'))
    .select('type, email, amount, currency, decline_code, outcome_reason, failure_code, failure_message, card_country, card_brand, outcome_risk_level, outcome_network_status, event_created, received_at')
    .in('type', ['payment_intent.payment_failed', 'charge.failed', 'invoice.payment_failed'])
    .gte('received_at', from.toISOString())
    .order('received_at', { ascending: false })
    .limit(20)
  if (error) throw error
  return ((data ?? []) as Row[]).map((r) => ({
    at: s(r.event_created) || s(r.received_at),
    type: s(r.type),
    email: s(r.email) || null,
    amount: n(r.amount),
    currency: s(r.currency) || null,
    reason: s(r.decline_code) || s(r.outcome_reason) || s(r.failure_code) || null,
    message: s(r.failure_message) || null,
    card_country: s(r.card_country) || null,
    card_brand: s(r.card_brand) || null,
    risk_level: s(r.outcome_risk_level) || null,
    network_status: s(r.outcome_network_status) || null,
  }))
}

export async function loadFunnel(key: RangeKey, source: string | null, campaign: string | null): Promise<FunnelResponse> {
  const now = new Date()
  const { from, to } = rangeOf(key, now)
  const [kpis, report, sources, stripeRecent, feed] = await Promise.all([
    db().rpc(t('funnel_kpis'), { p_today: startOfToday(now).toISOString() }),
    db().rpc(t('funnel_report'), { p_from: from.toISOString(), p_to: to.toISOString(), p_source: source, p_campaign: campaign }),
    loadSources(),
    loadStripeRecent(from),
    loadFeed(source),
  ])
  if (kpis.error) throw kpis.error
  if (report.error) throw report.error
  return {
    now: now.toISOString(),
    range: { key, from: from.toISOString(), to: to.toISOString() },
    kpis: kpis.data as Record<'today' | 'd7' | 'd30', Kpi>,
    report: report.data as Report,
    sources,
    stripe_recent: stripeRecent,
    feed,
  }
}
