'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { BenefitList } from '../Deal'
import { Icon } from '../icons'
import { PageHeader } from '../PageHeader'
import { buttonClass } from '../ui'
import { PRODUCTS, type OfferId } from '@/lib/catalog'
import { ANUAL, APP } from '@/lib/config'
import { DEALS } from '@/lib/deals'
import { formatUsd } from '@/lib/funnel/config'
import { useAppState } from '@/lib/store'

// The annual plan (everything for a year), sold only inside the app. The savings are
// computed from the real monthly prices — never an invented "before" price.

const MONTHLY_TOTAL = ANUAL.monthly.front + ANUAL.monthly.upsell1 + ANUAL.monthly.upsell2
const YEAR_MONTHLY = Math.round(MONTHLY_TOTAL * 12 * 100) / 100
const SAVED = Math.round((YEAR_MONTHLY - ANUAL.price) * 100) / 100
const SAVED_PCT = Math.round((SAVED / YEAR_MONTHLY) * 100)
const PER_MONTH = Math.round((ANUAL.price / 12) * 100) / 100
/** Whole months of the front alone that already cost more than the whole year. */
const FRONT_MONTHS = Math.ceil(ANUAL.price / ANUAL.monthly.front)

export function hasEverything(owned: readonly OfferId[]): boolean {
  return owned.includes('upsell1') && owned.includes('upsell2')
}

const DISMISS_KEY = 'ib-es-anual-bar'

/** The slim bar on top of every tab, for members who don't have everything yet. */
export function AnualBar() {
  const { owned } = useAppState()
  const pathname = usePathname() || ''
  const [hidden, setHidden] = useState(() => {
    try {
      return Number(window.localStorage.getItem(DISMISS_KEY)) > Date.now()
    } catch {
      return false
    }
  })
  // Not on the offer page itself, and not while reading a lesson.
  if (hidden || hasEverything(owned) || pathname === '/anual' || pathname.startsWith('/leccion/')) return null

  const dismiss = () => {
    try {
      // Back in three days.
      window.localStorage.setItem(DISMISS_KEY, String(Date.now() + 3 * 86_400_000))
    } catch {
      // storage blocked: it just comes back next visit
    }
    setHidden(true)
  }

  return (
    <div className="mb-4 flex items-center gap-2 rounded-2xl bg-primary py-2 pl-3 pr-1.5 text-white shadow-card">
      <Icon name="sparkles" className="size-5 shrink-0 text-gold-bright" />
      <Link href="/anual" className="min-w-0 flex-1 text-[14px] leading-snug">
        <strong className="font-semibold">Todo {APP.name}</strong> por {formatUsd(ANUAL.price)} al año ·{' '}
        <span className="font-semibold text-gold-bright underline underline-offset-2">ahorra {SAVED_PCT}%</span>
      </Link>
      <button type="button" onClick={dismiss} aria-label="Ocultar por ahora" className="grid size-9 shrink-0 place-items-center rounded-full text-white/70 hover:bg-white/10 hover:text-white">
        <Icon name="x" className="size-4" />
      </button>
    </div>
  )
}

/** Card at the top of the Tienda. */
export function AnualCard() {
  const { owned } = useAppState()
  if (hasEverything(owned)) return null
  return (
    <Link href="/anual" className="relative block overflow-hidden rounded-3xl bg-primary p-5 text-white shadow-float">
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'radial-gradient(90% 70% at 90% 0%, rgba(224,172,74,.35), transparent 60%)' }} />
      <div className="relative">
        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-gold-bright">Plan anual · todo incluido</p>
        <p className="mt-1 font-serif text-[22px] font-semibold leading-snug">Todo {APP.name} por {formatUsd(ANUAL.price)} al año</p>
        <p className="mt-1 text-[15px] text-white/80">
          Ahorras {formatUsd(SAVED)} frente a pagar todo mes a mes.
        </p>
        <span className="mt-3 inline-flex items-center gap-1.5 text-[15px] font-semibold text-gold-bright">
          Ver la oferta
          <Icon name="arrowRight" className="size-4" />
        </span>
      </div>
    </Link>
  )
}

export function AnualView() {
  const { owned, session } = useAppState()
  const everything = hasEverything(owned)
  const rows = [
    { label: 'Resumen Cronológico de la Biblia + 9 regalos', price: ANUAL.monthly.front },
    { label: 'Resumen Cronológico en Audio', price: ANUAL.monthly.upsell1 },
    { label: 'Palabras del Señor + Tu Consejero Bíblico', price: ANUAL.monthly.upsell2 },
  ]
  const gifts = PRODUCTS.filter((p) => p.offer === 'front' && p.id !== 'cronologico')
  const groups = [
    {
      title: 'Resumen Cronológico de la Biblia',
      items: [
        'Los 66 libros de la Biblia en el orden en que sucedieron los acontecimientos',
        'Cada resumen con fecha aproximada, autor, personajes, versículo clave y explicación clara',
        'Progreso, racha, puntos y reflexiones compartidas con los hermanos',
      ],
    },
    { title: `Los ${gifts.length} regalos`, items: gifts.map((p) => p.title) },
    { title: 'Resumen Cronológico en Audio', items: DEALS.upsell1.benefits },
    { title: 'Palabras del Señor', items: DEALS.upsell2.benefits },
    { title: 'Y además', items: ['Todo lo nuevo que agreguemos durante tu año, sin pagar más'] },
  ]
  const checkout = ANUAL.checkoutUrl && session?.email ? `${ANUAL.checkoutUrl}${ANUAL.checkoutUrl.includes('?') ? '&' : '?'}email=${encodeURIComponent(session.email)}` : ANUAL.checkoutUrl

  return (
    <>
      <PageHeader back="/tienda" title="Plan anual" subtitle="Todo lo que ofrecemos, un año entero" />

      <div className="relative overflow-hidden rounded-[28px] bg-primary px-5 pb-6 pt-5 text-center text-white shadow-float">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'radial-gradient(90% 70% at 50% 0%, rgba(224,172,74,.4), transparent 60%)' }} />
        <div className="relative">
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-gold-bright">Todo {APP.name}</p>
          <p className="mt-3 font-serif text-[46px] font-bold leading-none">{formatUsd(ANUAL.price)}</p>
          <p className="mt-1 text-[15px] text-white/80">por 12 meses · equivale a {formatUsd(PER_MONTH)} al mes</p>
          <p className="mx-auto mt-4 inline-block rounded-full bg-gold-bright px-4 py-1.5 text-[14px] font-bold text-primary">
            Ahorras {formatUsd(SAVED)} ({SAVED_PCT}%)
          </p>
        </div>
      </div>

      <section aria-label="Cuánto cuesta mes a mes" className="mt-6 rounded-3xl border border-line bg-surface p-5">
        <h2 className="font-serif text-[19px] font-semibold text-ink">Si pagaras todo mes a mes</h2>
        <ul className="mt-3 divide-y divide-line-soft">
          {rows.map((r) => (
            <li key={r.label} className="flex items-baseline justify-between gap-3 py-2.5 text-[15.5px]">
              <span className="text-ink">{r.label}</span>
              <span className="shrink-0 tabular-nums text-text">{formatUsd(r.price)}/mes</span>
            </li>
          ))}
          <li className="flex items-baseline justify-between gap-3 py-2.5 text-[15.5px] font-semibold">
            <span className="text-ink">Total en 12 meses</span>
            <span className="shrink-0 tabular-nums text-danger line-through">{formatUsd(YEAR_MONTHLY)}</span>
          </li>
          <li className="flex items-baseline justify-between gap-3 py-2.5 text-[16.5px] font-bold">
            <span className="text-ink">Con el plan anual</span>
            <span className="shrink-0 tabular-nums text-success">{formatUsd(ANUAL.price)}</span>
          </li>
        </ul>
        <p className="mt-3 rounded-2xl bg-gold-soft/60 px-4 py-3 text-[14.5px] leading-snug text-ink">
          Es menos de lo que pagarías en {FRONT_MONTHS} meses solo del Resumen Cronológico.
        </p>
      </section>

      <section aria-label="Qué incluye" className="mt-5 rounded-3xl border border-line bg-surface p-5">
        <h2 className="font-serif text-[19px] font-semibold text-ink">Incluye todo</h2>
        <div className="mt-4 space-y-5">
          {groups.map((g) => (
            <BenefitList key={g.title} label={g.title} items={g.items} />
          ))}
        </div>
      </section>

      <div className="mt-6">
        {everything ? (
          <p className="rounded-2xl bg-success-soft p-4 text-center text-[15.5px] font-semibold text-success">Ya tienes acceso a todo. ¡Gracias por caminar con nosotros!</p>
        ) : checkout ? (
          <a href={checkout} className={`${buttonClass.primary} min-h-14 text-[17px]`}>
            Quiero el plan anual
            <Icon name="arrowRight" className="size-5 text-gold-bright" />
          </a>
        ) : (
          <button type="button" disabled className={buttonClass.primary}>
            Disponible muy pronto
          </button>
        )}
        <p className="mt-3 text-center text-[14px] leading-snug text-muted">
          Compra con el mismo correo de tu cuenta y todo se activa solo. Si hoy pagas una suscripción mensual, escríbenos a {APP.supportEmail} y la cancelamos para que no pagues dos veces.
        </p>
      </div>
    </>
  )
}
