'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { DealBadge } from './Deal'
import { Icon } from './icons'
import { RefLink } from './views/EstudioLesson'
import type { Lesson } from '@/lib/catalog'
import { GUIAS_ESCUCHA } from '@/lib/content/escucha'
import type { GuiaEscucha } from '@/lib/content/escucha/types'
import { ESTUDIO_LECCIONES } from '@/lib/content/estudio/maestra'
import { lessonHref } from '@/lib/progress'
import { useAppState } from '@/lib/store'

// Guía de escucha (upsell 1): under each audio of the Resumen en Audio, what to keep from it.
// The secret gift's listening plan plays the same files: there the guide shows locked, one
// tap from the offer.

/** The Resumen en Audio lesson id an audio lesson plays ("genesis"), or null. */
export function escuchaId(productId: string, lesson: Lesson): string | null {
  if (productId === 'cronologico-audio') return lesson.id
  return lesson.audioFile?.match(/^cronologico-audio\/(.+)\.mp3$/)?.[1] ?? null
}

function useGuia(id: string): GuiaEscucha | null | undefined {
  const [loaded, setLoaded] = useState<{ id: string; g: GuiaEscucha | null } | null>(null)
  useEffect(() => {
    const load = GUIAS_ESCUCHA[id]
    let alive = true
    ;(load ? load() : Promise.resolve(null))
      .then((g) => alive && setLoaded({ id, g }))
      .catch(() => alive && setLoaded({ id, g: null }))
    return () => {
      alive = false
    }
  }, [id])
  return loaded?.id === id ? loaded.g : undefined
}

export function EscuchaGuide({ id }: { id: string }) {
  const { owned } = useAppState()
  const g = useGuia(id)
  if (!g) return null

  if (!owned.includes('upsell1')) {
    return (
      <Link href="/modulo/cronologico-audio" className="mt-4 block rounded-3xl border border-gold/40 bg-gold-soft/40 p-4 transition hover:bg-gold-soft/70">
        <span className="flex flex-wrap items-center gap-2">
          <Icon name="lock" className="size-4 text-gold" />
          <span className="font-serif text-[17px] font-semibold text-ink">Guía de escucha</span>
          <DealBadge offer="upsell1" />
        </span>
        <span className="mt-2 block select-none text-[15px] leading-relaxed text-text blur-[3px]" aria-hidden>
          {g.puntos[0]}
        </span>
        <span className="mt-2 block text-[14.5px] leading-snug text-muted">Los puntos clave, un versículo, una pregunta y una oración para cada audio. Incluida en el Resumen en Audio.</span>
      </Link>
    )
  }

  const estudio = (g.estudio ?? []).map((sid) => ESTUDIO_LECCIONES.find((l) => l.id === sid)).filter((l) => l !== undefined)
  return (
    <section aria-labelledby="guia-escucha" className="mt-4 space-y-3 rounded-3xl border border-line bg-surface p-5 shadow-card">
      <h2 id="guia-escucha" className="flex items-center gap-2 font-serif text-[19px] font-semibold text-ink">
        <Icon name="headphones" className="size-5 text-gold" />
        Guía de escucha
      </h2>
      <ol className="space-y-2.5">
        {g.puntos.map((p, i) => (
          <li key={i} className="flex gap-3 text-[16px] leading-relaxed text-ink">
            <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-primary text-[12.5px] font-bold text-gold-bright">{i + 1}</span>
            {p}
          </li>
        ))}
      </ol>
      <figure className="rounded-2xl bg-gold-soft/60 px-4 py-3">
        <blockquote className="font-serif text-[16.5px] italic leading-relaxed text-ink">«{g.versiculo.texto}»</blockquote>
        <figcaption className="mt-1.5 text-[14px]">
          <RefLink refText={g.versiculo.referencia} />
        </figcaption>
      </figure>
      <p className="text-[16px] leading-relaxed text-ink">
        <span className="font-semibold">Para pensar: </span>
        {g.pregunta}
      </p>
      <p className="rounded-2xl bg-surface-2 px-4 py-3 font-serif text-[16px] italic leading-relaxed text-ink">{g.oracion}</p>
      {estudio.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {estudio.map((l) => (
            <Link key={l.id} href={lessonHref('cronologico', l.id)} className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-line bg-surface-2 px-3.5 text-[14px] font-medium text-ink hover:bg-gold-soft">
              <Icon name="book" className="size-4 text-gold" />
              Leer en el Estudio: {l.titulo}
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
