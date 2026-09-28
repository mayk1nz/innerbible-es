'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Icon, type IconName } from '../icons'
import { Segmented } from '../ui'
import { Bloque, LEVEL_KEY, Quiz, RefLink, readLevel, type Nivel } from './EstudioLesson'
import { GUIA_LECCIONES } from '@/lib/content/guias'
import type { Bloque as BloqueGuia, GuiaLeccion } from '@/lib/content/guias/types'
import { ESTUDIO_LECCIONES } from '@/lib/content/estudio/maestra'
import { lessonHref } from '@/lib/progress'

// A lesson of a gift guide (Mandamientos, Milagros, Mujeres Virtuosas, Biografías): the
// same two levels and look as the Estudio, built from the guide's blocks.

function useGuiaLeccion(key: string): GuiaLeccion | null | undefined {
  const [loaded, setLoaded] = useState<{ key: string; leccion: GuiaLeccion | null } | null>(null)
  useEffect(() => {
    const load = GUIA_LECCIONES[key]
    let alive = true
    ;(load ? load() : Promise.resolve(null))
      .then((leccion) => alive && setLoaded({ key, leccion }))
      .catch(() => alive && setLoaded({ key, leccion: null }))
    return () => {
      alive = false
    }
  }, [key])
  return loaded?.key === key ? loaded.leccion : undefined
}

export function GuiaLesson({ guia, lessonId, scale }: { guia: string; lessonId: string; scale: number }) {
  const l = useGuiaLeccion(`${guia}/${lessonId}`)
  const [nivel, setNivel] = useState<Nivel>(readLevel)
  const choose = (n: Nivel) => {
    setNivel(n)
    try {
      window.localStorage.setItem(LEVEL_KEY, n)
    } catch {
      // remembered only for this visit
    }
  }

  if (l === undefined) {
    return (
      <div aria-busy className="animate-pulse space-y-3 rounded-3xl border border-line bg-surface-2 px-5 py-6">
        <div className="h-5 w-1/2 rounded bg-line-soft" />
        <div className="h-4 rounded bg-line-soft" />
        <div className="h-24 rounded-2xl bg-gold-soft/50" />
      </div>
    )
  }
  if (l === null) {
    return (
      <div className="rounded-3xl border border-dashed border-line bg-surface-2 px-6 py-8 text-center">
        <Icon name="feather" className="mx-auto size-8 text-gold" />
        <p className="mt-3 font-serif text-[19px] font-semibold text-ink">En preparación</p>
        <p className="mx-auto mt-1.5 max-w-xs text-[15.5px] leading-relaxed text-muted">Estamos escribiendo esta parte. Muy pronto la encontrarás aquí.</p>
      </div>
    )
  }

  return (
    <div style={{ fontSize: `${scale}rem` }}>
      {l.etiquetas && l.etiquetas.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2 text-[0.85em]">
          {l.etiquetas.map((e) => (
            <span key={e} className="rounded-full border border-line bg-surface px-3 py-1.5 text-ink">
              {e}
            </span>
          ))}
        </div>
      )}

      <Segmented
        label="Nivel de lectura"
        value={nivel}
        onChange={choose}
        options={[
          { value: 'minuto', label: 'En 1 minuto' },
          { value: 'completo', label: 'Completo' },
        ]}
      />

      <div className="animate-rise mt-4 space-y-4">
        <ol className="space-y-3 rounded-3xl border border-line bg-surface-2 p-5 shadow-card">
          {l.enUnMinuto.map((frase, i) => (
            <li key={i} className="flex gap-3 font-serif text-[1.08em] leading-relaxed text-ink">
              <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-primary font-sans text-[0.8em] font-bold text-gold-bright">{i + 1}</span>
              {frase}
            </li>
          ))}
        </ol>

        {l.versiculo && (
          <figure className="rounded-2xl bg-gold-soft/60 px-5 py-4">
            <blockquote className="font-serif text-[1.15em] italic leading-relaxed text-ink">«{l.versiculo.texto}»</blockquote>
            <figcaption className="mt-2 text-[0.85em]">
              <RefLink refText={l.versiculo.referencia} />
            </figcaption>
          </figure>
        )}

        {nivel === 'minuto' ? (
          <button
            type="button"
            onClick={() => choose('completo')}
            className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-primary px-5 text-[1em] font-semibold text-primary transition hover:bg-surface-hover"
          >
            <Icon name="book" className="size-5" />
            Ver todo
          </button>
        ) : (
          <>
            {l.bloques.map((b, i) => (
              <BloqueView key={i} b={b} />
            ))}
            {(l.estudio?.length || l.buscar) && <Links l={l} />}
            {l.quiz && <Quiz preguntas={l.quiz} />}
          </>
        )}
      </div>
    </div>
  )
}

const ICON: Record<BloqueGuia['tipo'], IconName> = {
  texto: 'book',
  lista: 'check',
  pasos: 'star',
  referencias: 'external',
  destacado: 'sparkles',
  oracion: 'heart',
  ninos: 'gift',
  'biblia-tradicion': 'search',
  nota: 'feather',
  grupo: 'users',
}

function BloqueView({ b }: { b: BloqueGuia }) {
  switch (b.tipo) {
    case 'texto':
      return (
        <Bloque icon={ICON.texto} title={b.titulo}>
          <div className="space-y-3">
            {b.parrafos.map((p, i) => (
              <p key={i} className="font-serif text-[1.06em] leading-[1.75] text-text">
                {p}
              </p>
            ))}
          </div>
        </Bloque>
      )
    case 'lista':
    case 'grupo':
      return (
        <Bloque icon={ICON[b.tipo]} title={b.titulo} tone={b.tipo === 'grupo' ? 'gold' : 'plain'}>
          <ul className="space-y-2.5">
            {b.items.map((it, i) => (
              <li key={i} className="flex gap-2.5 leading-snug text-ink">
                <span className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                {it}
              </li>
            ))}
          </ul>
        </Bloque>
      )
    case 'pasos':
      return (
        <Bloque icon={ICON.pasos} title={b.titulo}>
          <ol className="space-y-2.5">
            {b.items.map((it, i) => (
              <li key={i} className="flex gap-3 leading-snug text-ink">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-[0.75em] font-bold text-gold-bright">{i + 1}</span>
                {it}
              </li>
            ))}
          </ol>
        </Bloque>
      )
    case 'referencias':
      return (
        <Bloque icon={ICON.referencias} title={b.titulo}>
          <ul className="space-y-2.5">
            {b.items.map((it) => (
              <li key={it.ref} className="leading-snug">
                <RefLink refText={it.ref} />
                {it.nota && <span className="text-text"> — {it.nota}</span>}
              </li>
            ))}
          </ul>
        </Bloque>
      )
    case 'destacado':
      return (
        <Bloque icon={ICON.destacado} title={b.titulo} tone={b.tono === 'gold' ? 'gold' : 'navy'}>
          <p className={`leading-relaxed ${b.tono === 'gold' ? 'text-ink' : 'text-white/90'}`}>{b.texto}</p>
        </Bloque>
      )
    case 'oracion':
      return (
        <Bloque icon={ICON.oracion} title="Oración" tone="gold">
          <p className="font-serif italic leading-relaxed text-ink">{b.texto}</p>
        </Bloque>
      )
    case 'ninos':
      return (
        <Bloque icon={ICON.ninos} title="Para los niños">
          <p className="leading-relaxed text-ink">{b.texto}</p>
          {b.actividad && (
            <p className="mt-2 leading-relaxed text-text">
              {b.actividad}
            </p>
          )}
        </Bloque>
      )
    case 'biblia-tradicion':
      return (
        <Bloque icon={ICON['biblia-tradicion']} title="Lo que dice la Biblia y lo que cuenta la tradición">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-surface-2 p-4">
              <p className="flex items-center gap-1.5 text-[0.8em] font-bold uppercase tracking-[0.08em] text-primary">
                <Icon name="book" className="size-4" />
                La Biblia dice
              </p>
              <ul className="mt-2 space-y-1.5 text-[0.95em] leading-snug text-ink">
                {b.biblia.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </div>
            {b.tradicion.length > 0 && (
              <div className="rounded-2xl border border-dashed border-line p-4">
                <p className="flex items-center gap-1.5 text-[0.8em] font-bold uppercase tracking-[0.08em] text-gold">
                  <Icon name="feather" className="size-4" />
                  La tradición cuenta
                </p>
                <ul className="mt-2 space-y-1.5 text-[0.95em] leading-snug text-text">
                  {b.tradicion.map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Bloque>
      )
    case 'nota':
      return (
        <p className="rounded-2xl border border-line-soft bg-surface-2 p-4 text-[0.9em] leading-relaxed text-text">
          <span className="font-semibold text-ink">Nota: </span>
          {b.texto}
        </p>
      )
  }
}

function Links({ l }: { l: GuiaLeccion }) {
  const estudio = (l.estudio ?? []).map((id) => ESTUDIO_LECCIONES.find((x) => x.id === id)).filter((x): x is NonNullable<typeof x> => Boolean(x))
  return (
    <Bloque icon="calendar" title="En la historia de la Biblia">
      {estudio.length > 0 && (
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
        </ul>
      )}
      {l.buscar && (
        <Link
          href={`/estudio?q=${encodeURIComponent(l.buscar)}`}
          className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-[0.95em] font-semibold text-white"
        >
          <Icon name="sparkles" className="size-5 text-gold-bright" />
          Sigue el hilo con tu Guía de Estudio
        </Link>
      )}
    </Bloque>
  )
}
