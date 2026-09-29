'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Icon, type IconName } from '../icons'
import { Segmented } from '../ui'
import { Bloque, Quiz, RefLink } from './EstudioLesson'
import { ESTUDIO_LECCIONES } from '@/lib/content/estudio/maestra'
import { MAPAS_SECCIONES, loadMapa } from '@/lib/content/mapas'
import type { ColorRama, MapaMental, TipoHoja } from '@/lib/content/mapas/types'
import { lessonHref } from '@/lib/progress'

// A mind map of one book (or a theme) of the Bible, drawn by the app — not an image:
// the idea in the centre, 4–6 numbered branches that open with a tap, and the leaves
// with their references. Text grows with the reading size; "Para niños" swaps in the
// simpler sentences.

const COLOR: Record<ColorRama, string> = {
  warm: '#b98a3e',
  amber: '#c56f2b',
  dawn: '#4d77a3',
  olive: '#788636',
  rose: '#b35d56',
  dusk: '#7a5fa6',
}
const HOJA_ICON: Record<TipoHoja, IconName> = { evento: 'calendar', persona: 'user', lugar: 'map', ensenanza: 'book', promesa: 'star' }
const MODE_KEY = 'ib-es-mapas-modo'

function useMapa(id: string): MapaMental | null | undefined {
  const [loaded, setLoaded] = useState<{ id: string; mapa: MapaMental | null } | null>(null)
  useEffect(() => {
    let alive = true
    loadMapa(id)
      .then((mapa) => alive && setLoaded({ id, mapa }))
      .catch(() => alive && setLoaded({ id, mapa: null }))
    return () => {
      alive = false
    }
  }, [id])
  return loaded?.id === id ? loaded.mapa : undefined
}

function readMode(): 'normal' | 'ninos' {
  try {
    return window.localStorage.getItem(MODE_KEY) === 'ninos' ? 'ninos' : 'normal'
  } catch {
    return 'normal'
  }
}

export function MindMapView({ mapId, scale }: { mapId: string; scale: number }) {
  const m = useMapa(mapId)
  const [mode, setMode] = useState<'normal' | 'ninos'>(readMode)
  const [open, setOpen] = useState<Set<number>>(() => new Set())
  const kids = mode === 'ninos'
  const choose = (v: 'normal' | 'ninos') => {
    setMode(v)
    try {
      window.localStorage.setItem(MODE_KEY, v)
    } catch {
      // remembered only for this visit
    }
  }

  if (m === undefined) {
    return <div aria-busy className="h-72 animate-pulse rounded-3xl bg-surface-2" />
  }
  if (m === null) {
    return (
      <div className="rounded-3xl border border-dashed border-line bg-surface-2 px-6 py-8 text-center">
        <Icon name="map" className="mx-auto size-8 text-gold" />
        <p className="mt-3 font-serif text-[19px] font-semibold text-ink">Mapa en preparación</p>
        <p className="mx-auto mt-1.5 max-w-xs text-[15.5px] leading-relaxed text-muted">Estamos dibujando este mapa. Muy pronto lo encontrarás aquí.</p>
      </div>
    )
  }

  const all = open.size === m.ramas.length
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  const estudio = m.estudio.map((id) => ESTUDIO_LECCIONES.find((l) => l.id === id)).filter((x): x is NonNullable<typeof x> => Boolean(x))
  const titleOf = (id: string) => MAPAS_SECCIONES.flatMap((s) => s.mapas).find((x) => x.id === id)?.titulo ?? id

  return (
    <div style={{ fontSize: `${scale}rem` }} className="space-y-4">
      <Segmented
        label="Modo del mapa"
        value={mode}
        onChange={choose}
        options={[
          { value: 'normal', label: 'Mapa' },
          { value: 'ninos', label: 'Para niños' },
        ]}
      />

      {/* The centre of the map. */}
      <div className="relative overflow-hidden rounded-3xl bg-primary px-5 py-6 text-center text-white shadow-float">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'radial-gradient(80% 70% at 50% 0%, rgba(224,172,74,.35), transparent 65%)' }} />
        <div className="relative">
          <p className="text-[0.8em] font-semibold uppercase tracking-[0.1em] text-gold-bright">{m.subtitulo}</p>
          <p className="mt-2 font-serif text-[1.35em] font-semibold leading-snug">{kids ? m.centro.textoNino : m.centro.texto}</p>
        </div>
      </div>

      {!kids && (
        <figure className="rounded-2xl bg-gold-soft/60 px-5 py-4">
          <blockquote className="font-serif text-[1.08em] italic leading-relaxed text-ink">«{m.versiculo.texto}»</blockquote>
          <figcaption className="mt-2 text-[0.85em]">
            <RefLink refText={m.versiculo.referencia} />
          </figcaption>
        </figure>
      )}

      <div className="flex items-center justify-between">
        <p className="text-[0.85em] text-muted">Toca cada rama para abrirla.</p>
        <button
          type="button"
          onClick={() => setOpen(all ? new Set() : new Set(m.ramas.map((_, i) => i)))}
          className="min-h-11 rounded-full border border-line bg-surface px-4 text-[0.85em] font-semibold text-primary"
        >
          {all ? 'Cerrar todo' : 'Abrir todo'}
        </button>
      </div>

      {/* The branches, joined to the centre by a line. */}
      <ol className="relative space-y-3 pl-5 before:absolute before:bottom-6 before:left-[9px] before:top-0 before:w-0.5 before:bg-line">
        {m.ramas.map((r, i) => {
          const isOpen = open.has(i)
          const color = COLOR[r.color]
          return (
            <li key={i} className="relative">
              <span aria-hidden className="absolute -left-5 top-7 h-0.5 w-5" style={{ background: color }} />
              <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-card">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => toggle(i)}
                  className="flex w-full items-start gap-3 p-4 text-left transition hover:bg-surface-hover"
                  style={{ borderLeft: `6px solid ${color}` }}
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-full font-sans text-[0.9em] font-bold text-white" style={{ background: color }}>
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-serif text-[1.12em] font-semibold leading-snug text-ink">{r.titulo}</span>
                    {r.capitulos && <span className="block text-[0.82em] text-muted">Capítulos {r.capitulos}</span>}
                    <span className="mt-1 block leading-snug text-text">{kids ? r.resumenNino : r.resumen}</span>
                  </span>
                  <Icon name="chevronDown" className={`mt-1 size-5 shrink-0 text-muted transition ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <ul className="animate-rise space-y-2 border-t border-line-soft bg-surface-2 p-3">
                    {r.hojas.map((h, j) => (
                      <li key={j} className="flex gap-3 rounded-2xl bg-surface p-3">
                        <span className="grid size-8 shrink-0 place-items-center rounded-xl" style={{ background: `${color}22`, color }}>
                          <Icon name={HOJA_ICON[h.tipo]} className="size-4" />
                        </span>
                        <span className="min-w-0">
                          <span className="block font-semibold leading-snug text-ink">{h.titulo}</span>
                          <span className="mt-0.5 block leading-snug text-text">{kids && h.textoNino ? h.textoNino : h.texto}</span>
                          <RefLink refText={h.referencia} className="mt-1 inline-block text-[0.85em]" />
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          )
        })}
      </ol>

      <Bloque icon="sparkles" title="Jesús en este libro" tone="navy">
        <p className="leading-relaxed text-white/90">{m.cristo.texto}</p>
        <p className="mt-3 flex flex-wrap gap-2">
          {m.cristo.referencias.map((r) => (
            <span key={r} className="rounded-full bg-white/10 px-3 py-1.5 text-[0.85em] font-semibold text-gold-bright">
              {r}
            </span>
          ))}
        </p>
      </Bloque>

      <Bloque icon="heart" title="Para tu vida" tone="gold">
        <ol className="space-y-2">
          {m.paraTuVida.map((p, i) => (
            <li key={i} className="flex gap-3 leading-snug text-ink">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-[0.75em] font-bold text-gold-bright">{i + 1}</span>
              {p}
            </li>
          ))}
        </ol>
      </Bloque>

      <Quiz preguntas={m.preguntas} />

      {(estudio.length > 0 || (m.conexiones?.length ?? 0) > 0) && (
        <Bloque icon="calendar" title="Sigue estudiando">
          <ul className="space-y-2">
            {estudio.map((e) => (
              <li key={e.id}>
                <Link href={lessonHref('cronologico', e.id)} className="flex min-h-12 items-center justify-between gap-2 rounded-2xl border border-line bg-surface-2 px-4 py-2.5 transition hover:bg-surface-hover">
                  <span className="min-w-0">
                    <span className="block font-semibold leading-snug text-ink">{e.titulo}</span>
                    <span className="block text-[0.85em] text-muted">Estudio Cronológico · {e.rotulo}</span>
                  </span>
                  <Icon name="chevronRight" className="size-5 shrink-0 text-muted" />
                </Link>
              </li>
            ))}
            {(m.conexiones ?? []).map((c) => (
              <li key={c.id}>
                <Link href={lessonHref('mapas-mentales', c.id)} className="flex min-h-12 items-center justify-between gap-2 rounded-2xl border border-line bg-surface-2 px-4 py-2.5 transition hover:bg-surface-hover">
                  <span className="min-w-0">
                    <span className="block font-semibold leading-snug text-ink">Mapa: {titleOf(c.id)}</span>
                    <span className="block text-[0.85em] text-muted">{c.motivo}</span>
                  </span>
                  <Icon name="chevronRight" className="size-5 shrink-0 text-muted" />
                </Link>
              </li>
            ))}
          </ul>
        </Bloque>
      )}
    </div>
  )
}
