'use client'

import { useCallback, useEffect, useState, type ReactNode } from 'react'
import type { Chain, FunnelResponse, Journey, Kpi, RangeKey, Report } from '@/lib/admin/funnel-types'

// /admin/funil: the owner's view of the whole funnel, refreshed every 15 seconds.
// Portuguese on purpose (the owner's language); the app itself stays in Spanish.

const REFRESH_MS = 15_000
const TZ = 'America/Sao_Paulo'

const RANGES: { key: RangeKey; label: string }[] = [
  { key: 'today', label: 'Hoje' },
  { key: '7d', label: '7 dias' },
  { key: '30d', label: '30 dias' },
]

const CHAIN: { key: keyof Chain; label: string }[] = [
  { key: 's1', label: 'Abriram o quiz' },
  { key: 's2', label: 'Começaram o quiz' },
  { key: 's3', label: 'Concluíram o quiz' },
  { key: 's4', label: 'Viram a página da oferta' },
  { key: 's5', label: 'Assistiram a VSL até a oferta' },
  { key: 's6', label: 'Clicaram no checkout' },
  { key: 's7', label: 'Pagaram o front' },
  { key: 's8', label: 'Viram o upsell 1 (Audio)' },
  { key: 's9', label: 'Viram o upsell 2 (Palabras)' },
  { key: 's10', label: 'Chegaram ao Bienvenido' },
  { key: 's11', label: 'Entraram no app (login)' },
  { key: 's12', label: 'Concluíram a 1ª lição' },
]

const EVENT_LABEL: Record<string, string> = {
  quiz: 'Quiz',
  quiz_start: 'Começou o quiz',
  quiz_complete: 'Concluiu o quiz',
  offer_view: 'Página da oferta',
  vsl_play: 'Deu play na VSL',
  vsl_progress: 'VSL',
  offer_reveal: 'Oferta apareceu',
  checkout_click: 'Clique no checkout',
  upsell_view: 'Viu',
  upsell_reveal: 'Botões apareceram',
  upsell_accept_click: 'Clicou SIM',
  upsell_decline_click: 'Clicou NÃO',
  upsell_no_purchase: 'Clicou SIM sem compra (sem ks)',
  welcome_view: 'Bienvenido',
  login_success: 'Login no app',
  app_first_open: 'Abriu o app',
  first_lesson_done: '1ª lição',
  purchase: 'Compra aprovada',
  purchase_failed: 'Compra recusada',
}

const pct = (a: number, b: number): string => (b > 0 ? `${Math.round((a / b) * 1000) / 10}%` : '–')
const usd = (cents: number): string => `US$ ${(cents / 100).toFixed(2).replace('.', ',')}`

function when(iso: string, withDay = true): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const opts: Intl.DateTimeFormatOptions = withDay
    ? { timeZone: TZ, day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }
    : { timeZone: TZ, hour: '2-digit', minute: '2-digit', second: '2-digit' }
  return new Intl.DateTimeFormat('pt-BR', opts).format(d)
}

function Card({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-4 shadow-card sm:p-5">
      <h2 className="font-serif text-[18px] font-semibold text-ink">{title}</h2>
      {hint && <p className="mt-0.5 text-[12.5px] leading-snug text-muted">{hint}</p>}
      <div className="mt-3">{children}</div>
    </section>
  )
}

function Bar({ value, max, tone = 'gold' }: { value: number; max: number; tone?: 'gold' | 'good' | 'bad' }) {
  const w = max > 0 ? Math.max(value > 0 ? 2 : 0, Math.round((value / max) * 100)) : 0
  const color = tone === 'good' ? 'bg-success' : tone === 'bad' ? 'bg-danger' : 'bg-gold-bright'
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-line-soft" aria-hidden>
      <div className={`h-full rounded-full ${color}`} style={{ width: `${w}%` }} />
    </div>
  )
}

function Table({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
  if (!rows.length) return <p className="text-[13.5px] text-muted">Nada neste período.</p>
  // Wide tables scroll inside their card on a phone; small ones always fit.
  const wide = head.length > 4
  return (
    <div className="-mx-1 overflow-x-auto">
      <table className={`w-full border-collapse text-[13px] tabular-nums ${wide ? 'min-w-[340px]' : ''}`}>
        <thead>
          <tr className="text-left text-[11.5px] uppercase tracking-[0.04em] text-muted">
            {head.map((h, i) => (
              <th key={h} className={`px-1 pb-1.5 font-semibold ${i ? 'text-right' : ''}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-line-soft">
              {r.map((c, j) => (
                <td key={j} className={`px-1 py-1.5 ${j ? 'whitespace-nowrap text-right text-ink' : 'text-text'}`}>
                  {j ? c : <span className={`block ${wide ? 'max-w-[130px] truncate sm:max-w-[220px]' : 'leading-snug'}`} title={String(c)}>{c}</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function KpiStrip({ kpis }: { kpis: FunnelResponse['kpis'] }) {
  const cols: { k: 'today' | 'd7' | 'd30'; label: string }[] = [
    { k: 'today', label: 'Hoje' },
    { k: 'd7', label: '7 dias' },
    { k: 'd30', label: '30 dias' },
  ]
  const money = (cents: number) => (cents / 100).toFixed(2).replace('.', ',')
  const rows: { label: string; get: (k: Kpi) => string; strong?: boolean }[] = [
    { label: 'Entradas', get: (k) => String(k.entrances) },
    { label: 'Quiz concluído', get: (k) => String(k.quiz_complete) },
    { label: 'Checkout (cliques)', get: (k) => String(k.checkout) },
    { label: 'Vendas front', get: (k) => String(k.front_sales), strong: true },
    { label: 'Vendas (todas)', get: (k) => String(k.sales) },
    { label: 'Receita US$', get: (k) => money(k.revenue_cents), strong: true },
    { label: 'Stripe aprovados', get: (k) => String(k.stripe_ok) },
    { label: 'Stripe recusados', get: (k) => String(k.stripe_failed) },
  ]
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
      <table className="w-full border-collapse text-[13.5px] tabular-nums">
        <thead>
          <tr className="bg-surface-2 text-[11.5px] uppercase tracking-[0.05em] text-muted">
            <th className="px-2 py-2 text-left font-semibold sm:px-3">&nbsp;</th>
            {cols.map((c) => (
              <th key={c.k} className="whitespace-nowrap px-2 py-2 text-right font-semibold sm:px-3">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-t border-line-soft">
              <td className="px-2 py-2 leading-tight text-text sm:px-3">{r.label}</td>
              {cols.map((c) => (
                <td key={c.k} className={`whitespace-nowrap px-2 py-2 text-right sm:px-3 ${r.strong ? 'font-semibold text-ink' : 'text-ink'}`}>
                  {r.get(kpis[c.k])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function FunnelSteps({ chain }: { chain: Chain }) {
  const top = chain.s1
  return (
    <ol className="space-y-2.5">
      {CHAIN.map((step, i) => {
        const value = chain[step.key]
        const prev = i ? chain[CHAIN[i - 1].key] : value
        return (
          <li key={step.key}>
            <div className="flex items-baseline justify-between gap-3 text-[14px]">
              <span className="min-w-0 text-text">
                <span className="mr-1.5 text-[12px] font-semibold text-muted">{i + 1}.</span>
                {step.label}
              </span>
              <span className="shrink-0 tabular-nums">
                <strong className="font-semibold text-ink">{value}</strong>
                {i > 0 && <span className={`ml-2 text-[12.5px] ${prev > 0 && value / prev < 0.3 ? 'text-danger' : 'text-muted'}`}>{pct(value, prev)} da anterior</span>}
              </span>
            </div>
            <div className="mt-1">
              <Bar value={value} max={top} tone={step.key === 's7' ? 'good' : 'gold'} />
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function Upsells({ report }: { report: Report }) {
  const b = report.branches
  const c = report.chain
  const block = (title: string, seen: number, acc: number, paid: number, dec: number, dView: number, dAcc: number, dPaid: number, dDec: number) => (
    <div className="rounded-xl bg-surface-2 p-3">
      <p className="text-[14px] font-semibold text-ink">
        {title} <span className="font-normal text-muted">· {seen} viram</span>
      </p>
      <Table
        head={['', 'pessoas', '% viu']}
        rows={[
          ['Clicaram SIM', acc, pct(acc, seen)],
          ['Pagamento aprovado', paid, pct(paid, seen)],
          ['Clicaram NÃO', dec, pct(dec, seen)],
          ['→ Viram o downsell', dView, pct(dView, seen)],
          ['→ SIM no downsell', dAcc, pct(dAcc, dView)],
          ['→ Downsell aprovado', dPaid, pct(dPaid, dView)],
          ['→ NÃO no downsell', dDec, pct(dDec, dView)],
        ]}
      />
    </div>
  )
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {block('Upsell 1 · Resumen en Audio', c.s8, b.up1_acc, b.up1_paid, b.up1_dec, b.down1_view, b.down1_acc, b.down1_paid, b.down1_dec)}
      {block('Upsell 2 · Palabras del Señor', c.s9, b.up2_acc, b.up2_paid, b.up2_dec, b.down2_view, b.down2_acc, b.down2_paid, b.down2_dec)}
    </div>
  )
}

const PAGE_LABEL: Record<string, string> = { front: 'Front (quiz)', up1: 'Upsell 1', up2: 'Upsell 2' }

function Journeys({ feed }: { feed: Journey[] }) {
  if (!feed.length) return <p className="text-[13.5px] text-muted">Nenhum visitante ainda.</p>
  return (
    <ul className="space-y-3">
      {feed.map((j) => (
        <li key={j.vid} className="rounded-xl border border-line-soft bg-surface-2 p-3">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
            <p className="min-w-0 truncate text-[14px] font-semibold text-ink">{j.email ?? `visitante ${j.vid.slice(1, 7)}`}</p>
            <p className="text-[12px] text-muted">visto {when(j.last_seen)}</p>
          </div>
          <p className="mt-0.5 text-[12.5px] leading-snug text-muted">
            {[j.source ? `${j.source}${j.campaign ? ` / ${j.campaign}` : ''}` : '(direto)', j.country, j.device, j.landing, j.referrer ? `ref ${j.referrer.replace(/^https?:\/\//, '')}` : '']
              .filter(Boolean)
              .join(' · ')}
          </p>
          <ol className="mt-2 space-y-1 border-l-2 border-line pl-3">
            {j.items.map((it, i) => (
              <li key={i} className="text-[13px] leading-snug">
                <span className="mr-1.5 tabular-nums text-muted">{when(it.at)}</span>
                <span className={`font-medium ${it.tone === 'good' ? 'text-success' : it.tone === 'bad' ? 'text-danger' : 'text-ink'}`}>
                  {it.kind === 'stripe' ? `Stripe ${it.name}` : it.kind === 'kashpay' ? `KashPay ${it.name}` : EVENT_LABEL[it.name] ?? it.name}
                </span>
                {it.detail && <span className="text-text"> · {it.detail}</span>}
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ul>
  )
}

export function FunnelDashboard() {
  const [range, setRange] = useState<RangeKey>('7d')
  const [source, setSource] = useState('all')
  const [campaign, setCampaign] = useState('all')
  const [data, setData] = useState<FunnelResponse | null>(null)
  const [error, setError] = useState(false)
  const [loadedAt, setLoadedAt] = useState<string | null>(null)

  const load = useCallback(async () => {
    const params = new URLSearchParams({ range, source, campaign })
    try {
      const res = await fetch(`/api/admin/funil?${params}`, { cache: 'no-store' })
      if (!res.ok) throw new Error(String(res.status))
      setData((await res.json()) as FunnelResponse)
      setError(false)
      setLoadedAt(new Date().toISOString())
    } catch {
      setError(true)
    }
  }, [range, source, campaign])

  useEffect(() => {
    const first = window.setTimeout(() => void load(), 0)
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') void load()
    }, REFRESH_MS)
    return () => {
      window.clearTimeout(first)
      window.clearInterval(timer)
    }
  }, [load])

  const campaigns = data?.sources.find((s) => s.source === source)?.campaigns ?? []
  const r = data?.report
  const stripeTotal = r ? r.stripe.approved + r.stripe.failed + r.stripe.recovered : 0

  return (
    <div className="mx-auto w-full max-w-[980px] px-4 pb-16 pt-[max(env(safe-area-inset-top),20px)]">
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="font-serif text-[26px] font-semibold leading-tight text-ink">Funil · La Biblia Interior</h1>
          <p className="mt-0.5 flex items-center gap-2 text-[12.5px] text-muted">
            <span className={`inline-block size-2 rounded-full ${error ? 'bg-danger' : 'animate-pulse bg-success'}`} aria-hidden />
            {error ? 'Sem conexão · tentando de novo' : loadedAt ? `Ao vivo · atualizado ${when(loadedAt, false)} · a cada 15 s` : 'Carregando…'}
          </p>
        </div>
      </header>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div className="flex rounded-xl border border-line bg-surface p-1" role="tablist" aria-label="Período">
          {RANGES.map((x) => (
            <button
              key={x.key}
              type="button"
              role="tab"
              aria-selected={range === x.key}
              onClick={() => setRange(x.key)}
              className={`rounded-lg px-3 py-1.5 text-[13.5px] font-semibold ${range === x.key ? 'bg-primary text-white' : 'text-text hover:bg-surface-hover'}`}
            >
              {x.label}
            </button>
          ))}
        </div>
        <select
          aria-label="Origem"
          value={source}
          onChange={(e) => {
            setSource(e.target.value)
            setCampaign('all')
          }}
          className="min-w-0 max-w-[170px] rounded-xl border border-line bg-surface px-2.5 py-2 text-[13.5px] text-ink"
        >
          <option value="all">Todas as origens</option>
          {data?.sources.map((s) => (
            <option key={s.source} value={s.source}>
              {s.source}
            </option>
          ))}
        </select>
        {source !== 'all' && campaigns.length > 0 && (
          <select aria-label="Campanha" value={campaign} onChange={(e) => setCampaign(e.target.value)} className="min-w-0 max-w-[170px] rounded-xl border border-line bg-surface px-2.5 py-2 text-[13.5px] text-ink">
            <option value="all">Todas as campanhas</option>
            {campaigns.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}
      </div>

      {!data ? (
        <p className="mt-10 text-center text-[14px] text-muted">{error ? 'Não foi possível carregar os dados.' : 'Carregando…'}</p>
      ) : (
        <div className="mt-4 space-y-4">
          <KpiStrip kpis={data.kpis} />

          {r && (
            <>
              <div className="grid gap-4 lg:grid-cols-2">
                <Card title="Funil sequencial" hint="Cada etapa conta quem passou também por todas as anteriores (mesma pessoa, juntando aparelhos pelo e-mail). Pagou o front = compra aprovada na KashPay ou chegou ao upsell com o ks da compra.">
                  <FunnelSteps chain={r.chain} />
                  <p className="mt-3 text-[12.5px] text-muted">
                    Receita das pessoas do período: <strong className="text-ink">{usd(r.revenue_cents)}</strong> · compradores {r.buyers} · KashPay: {r.kashpay.paid} pagos, {r.kashpay.failed} recusados, {r.kashpay.refunded} reembolsos
                  </p>
                </Card>
                <Card title="Upsells e downsells" hint="Clique = intenção; aprovado = pedido pago na KashPay.">
                  <Upsells report={r} />
                </Card>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <Card title="Retenção da VSL" hint="Play = tocou com som (não a prévia muda). Oferta = chegou ao segundo em que o botão aparece.">
                  <Table
                    head={['Página', 'viram', 'play', '25%', '50%', '75%', '100%', 'oferta']}
                    rows={r.vsl.map((v) => [PAGE_LABEL[v.page] ?? v.page, v.views, v.plays, v.p25, v.p50, v.p75, v.p100, v.reveal])}
                  />
                </Card>
                <Card title="Quiz, etapa por etapa" hint="Quantas pessoas chegaram a cada tela do quiz.">
                  {r.quiz_steps.length ? (
                    <ol className="space-y-1.5">
                      {r.quiz_steps.map((q) => (
                        <li key={q.step} className="grid grid-cols-[110px_1fr_36px] items-center gap-2 text-[12.5px]">
                          <span className="truncate text-text">{q.step_name ?? q.step}</span>
                          <Bar value={q.actors} max={r.quiz_steps[0]?.actors ?? 0} />
                          <span className="text-right tabular-nums text-ink">{q.actors}</span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-[13.5px] text-muted">Nada neste período.</p>
                  )}
                </Card>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <Card title="Por origem" hint="Primeiro toque (utm_source / utm_campaign) de cada pessoa.">
                  <Table
                    head={['Origem / campanha', 'entradas', 'quiz ok', 'checkout', 'pagaram', 'receita']}
                    rows={r.by_origin.map((o) => [`${o.src} / ${o.camp}`, o.entrances, o.quiz_complete, o.checkout, o.paid, usd(o.revenue)])}
                  />
                </Card>
                <Card title="Por país" hint="País da primeira visita (IP).">
                  <Table head={['País', 'entradas', 'quiz ok', 'checkout', 'pagaram', 'receita']} rows={r.by_country.map((c) => [c.country, c.entrances, c.quiz_complete, c.checkout, c.paid, usd(c.revenue)])} />
                </Card>
              </div>

              <Card title="Stripe: aprovações e recusas" hint="Todas as tentativas de cartão na sua conta Stripe (a KashPay cobra por ela), no período. Não segue o filtro de origem.">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-surface-2 p-3">
                    <p className="text-[12px] uppercase tracking-[0.05em] text-muted">Taxa de aprovação</p>
                    <p className="font-serif text-[28px] font-semibold text-ink">{pct(r.stripe.approved + r.stripe.recovered, stripeTotal)}</p>
                    <p className="text-[12.5px] text-muted">
                      {r.stripe.approved + r.stripe.recovered} aprovados de {stripeTotal} pagamentos · {r.stripe.recovered} aprovados depois de recusa
                    </p>
                  </div>
                  <div className="rounded-xl bg-surface-2 p-3">
                    <p className="mb-1 text-[12px] uppercase tracking-[0.05em] text-muted">Recusas por motivo</p>
                    <Table head={['Motivo', 'n']} rows={r.stripe.by_reason.map((x) => [x.reason, x.n])} />
                  </div>
                  <div className="rounded-xl bg-surface-2 p-3">
                    <p className="mb-1 text-[12px] uppercase tracking-[0.05em] text-muted">Recusas por país do cartão</p>
                    <Table head={['País', 'n']} rows={r.stripe.by_card_country.map((x) => [x.country, x.n])} />
                  </div>
                </div>
                <p className="mt-3 text-[12.5px] text-muted">
                  Assinaturas criadas {r.stripe.subs_created} · canceladas {r.stripe.subs_deleted} · faturas pagas {r.stripe.invoices_paid} · faturas recusadas {r.stripe.invoices_failed}
                </p>
                {data.stripe_recent.length > 0 && (
                  <div className="mt-3">
                    <p className="mb-1 text-[12px] uppercase tracking-[0.05em] text-muted">Últimas recusas</p>
                    <ul className="space-y-1.5">
                      {data.stripe_recent.map((f, i) => (
                        <li key={i} className="text-[13px] leading-snug">
                          <span className="tabular-nums text-muted">{when(f.at)}</span> <span className="font-medium text-danger">{f.reason ?? 'recusado'}</span>
                          <span className="text-text">
                            {' '}
                            · {f.email ?? 'sem e-mail'} · {f.amount !== null ? `${(f.amount / 100).toFixed(2).replace('.', ',')} ${f.currency ?? ''}` : ''}
                            {f.card_country ? ` · cartão ${f.card_country}${f.card_brand ? ` ${f.card_brand}` : ''}` : ''}
                            {f.risk_level ? ` · risco ${f.risk_level}` : ''}
                          </span>
                          {f.message && <span className="block text-[12px] text-muted">{f.message}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            </>
          )}

          <Card title="Ao vivo: últimas jornadas" hint="Os 20 visitantes vistos por último, com os eventos do funil e os pagamentos (Stripe / KashPay) do e-mail deles.">
            <Journeys feed={data.feed} />
          </Card>
        </div>
      )}
    </div>
  )
}
