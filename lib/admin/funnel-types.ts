// Shape of GET /api/admin/funil (server → /admin/funil). Types only.

export type RangeKey = 'today' | '7d' | '30d'

export interface Kpi {
  entrances: number
  quiz_complete: number
  checkout: number
  sales: number
  front_sales: number
  revenue_cents: number
  stripe_ok: number
  stripe_failed: number
}

export type Chain = Record<'s1' | 's2' | 's3' | 's4' | 's5' | 's6' | 's7' | 's8' | 's9' | 's10' | 's11' | 's12', number>

export type Branches = Record<
  | 'up1_acc' | 'up1_dec' | 'up1_paid' | 'down1_view' | 'down1_acc' | 'down1_dec' | 'down1_paid'
  | 'up2_acc' | 'up2_dec' | 'up2_paid' | 'down2_view' | 'down2_acc' | 'down2_dec' | 'down2_paid',
  number
>

export interface GroupRow {
  entrances: number
  quiz_complete: number
  checkout: number
  paid: number
  revenue: number
}

export interface Report {
  chain: Chain
  branches: Branches
  revenue_cents: number
  buyers: number
  raw: Record<string, number>
  by_origin: (GroupRow & { src: string; camp: string })[]
  by_country: (GroupRow & { country: string })[]
  vsl: { page: string; views: number; plays: number; p25: number; p50: number; p75: number; p100: number; reveal: number }[]
  quiz_steps: { step: number; step_name: string | null; actors: number }[]
  stripe: {
    payments: number
    approved: number
    failed: number
    recovered: number
    by_reason: { reason: string; n: number }[]
    by_card_country: { country: string; n: number }[]
    by_reason_country: { reason: string; country: string; n: number }[]
    invoices_paid: number
    invoices_failed: number
    subs_created: number
    subs_deleted: number
  }
  kashpay: { paid: number; failed: number; refunded: number; renewed: number; canceled: number }
}

export interface TimelineItem {
  at: string
  kind: 'event' | 'stripe' | 'kashpay'
  name: string
  detail: string
  tone?: 'good' | 'bad' | 'neutral'
}

export interface Journey {
  vid: string
  email: string | null
  first_seen: string
  last_seen: string
  source: string | null
  campaign: string | null
  country: string | null
  device: string | null
  landing: string | null
  referrer: string | null
  items: TimelineItem[]
}

export interface StripeFailure {
  at: string
  type: string
  email: string | null
  amount: number | null
  currency: string | null
  reason: string | null
  message: string | null
  card_country: string | null
  card_brand: string | null
  risk_level: string | null
  network_status: string | null
}

export interface FunnelResponse {
  now: string
  range: { key: RangeKey; from: string; to: string }
  kpis: Record<'today' | 'd7' | 'd30', Kpi>
  report: Report
  sources: { source: string; campaigns: string[] }[]
  stripe_recent: StripeFailure[]
  feed: Journey[]
}
