'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ProductTile } from '../cards'
import { Icon } from '../icons'
import { PageHeader } from '../PageHeader'
import { EmptyState, SearchInput, SectionTitle } from '../ui'
import { OFFERS, PRODUCTS, type OfferId } from '@/lib/catalog'
import { lessonHref, lessonKey, searchLessons } from '@/lib/progress'
import { useAppState } from '@/lib/store'

// Leer = the whole library, in two tabs so it never turns into one endless list:
// the recorridos (the courses) and the guides, grouped by the purchase that brings them.

type Tab = 'recorridos' | 'guias'

const GUIDE_GROUP: Record<OfferId, string> = {
  front: 'Regalos de tu compra',
  upsell1: 'Incluido en el Audio Premium',
  upsell2: 'Incluido en Palabras del Señor',
}

export function LibraryView() {
  const s = useAppState()
  const [query, setQuery] = useState('')
  // The members area renders only in the browser (AppShell waits for the session), so
  // the address can be read here: /leer?tab=guias opens on the guides.
  const [tab, setTab] = useState<Tab>(() => (new URLSearchParams(window.location.search).get('tab') === 'guias' ? 'guias' : 'recorridos'))
  const hits = useMemo(() => searchLessons(query, s.owned), [query, s.owned])
  const searching = query.trim().length >= 2
  const recorridos = PRODUCTS.filter((p) => p.kind === 'recorrido')
  const groups = OFFERS.map((o) => ({ offer: o, products: PRODUCTS.filter((p) => p.kind !== 'recorrido' && p.offer === o.id) })).filter(
    (g) => g.products.length > 0,
  )

  return (
    <>
      <PageHeader title="Leer" subtitle="Toda tu biblioteca en un solo lugar" />
      <SearchInput value={query} onChange={setQuery} placeholder="Busca un libro, un tema…" label="Buscar en la biblioteca" />

      {searching ? (
        <section aria-label="Resultados de búsqueda" className="mt-5">
          {hits.length === 0 ? (
            <EmptyState icon="search" title="Sin resultados" text="Prueba con el nombre de un libro, como «Rut» o «Hechos»." />
          ) : (
            <ul className="space-y-2.5">
              {hits.map((h) => {
                const done = Boolean(s.completed[lessonKey(h.product.id, h.lesson.id)])
                return (
                  <li key={`${h.product.id}/${h.lesson.id}`}>
                    <Link href={lessonHref(h.product.id, h.lesson.id)} className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3.5 transition hover:bg-surface-hover">
                      <span className="min-w-0 flex-1">
                        <span className="block font-serif text-[16.5px] leading-snug text-ink">{h.lesson.title}</span>
                        <span className="mt-0.5 block text-[14px] text-muted">{h.product.title}</span>
                      </span>
                      {!h.owned && <Icon name="lock" className="size-4.5 text-gold" label="Bloqueado" />}
                      {h.owned && done && <Icon name="check" className="size-5 text-success" strokeWidth={2.4} label="Leída" />}
                      <Icon name="chevronRight" className="size-5 text-muted" />
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      ) : (
        <>
          <div role="tablist" aria-label="Secciones de la biblioteca" className="mt-5 grid grid-cols-2 gap-1 rounded-2xl border border-line bg-surface p-1">
            {(
              [
                ['recorridos', 'Recorridos'],
                ['guias', 'Guías'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                id={`tab-${id}`}
                aria-selected={tab === id}
                aria-controls={`panel-${id}`}
                onClick={() => setTab(id)}
                className={`min-h-11 rounded-xl text-[15.5px] font-semibold transition ${tab === id ? 'bg-primary text-white shadow-card' : 'text-text hover:text-ink'}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
            {tab === 'recorridos' ? (
              <div className="mt-5 grid grid-cols-2 gap-3.5">
                {recorridos.map((p) => (
                  <ProductTile key={p.id} product={p} state={s} />
                ))}
              </div>
            ) : (
              groups.map((g) => (
                <section key={g.offer.id} aria-label={GUIDE_GROUP[g.offer.id]}>
                  <SectionTitle>{GUIDE_GROUP[g.offer.id]}</SectionTitle>
                  <div className="grid grid-cols-2 gap-3.5">
                    {g.products.map((p) => (
                      <ProductTile key={p.id} product={p} state={s} />
                    ))}
                  </div>
                </section>
              ))
            )}
          </div>
        </>
      )}
    </>
  )
}
