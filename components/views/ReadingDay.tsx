'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Icon } from '../icons'
import { bookById, chapterHref } from '@/lib/biblia'
import { LECCIONES_ESCRITAS, loadLeccion } from '@/lib/content/estudio/lecciones'
import { ESTUDIO_LECCIONES } from '@/lib/content/estudio/maestra'
import type { DiaPlan365 } from '@/lib/content/plan365'
import { lessonHref } from '@/lib/progress'

// One day of the 365-day plan: what to read today (each chapter opens the in-app Bible,
// which flows on to the next chapter), and the part of the story it belongs to — the
// Estudio lesson — so the reading never feels like loose texts.

export function ReadingDay({ dia }: { dia: DiaPlan365 }) {
  const leccion = ESTUDIO_LECCIONES.find((l) => l.id === dia.leccion)
  const [first] = dia.lecturas
  const minuto = useFirstSentence(dia.leccion)

  return (
    <div className="space-y-4">
      <section className="rounded-3xl bg-primary p-5 text-white shadow-float">
        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-gold-bright">Tu lectura de hoy · ≈ {dia.minutos} min</p>
        <p className="mt-1.5 font-serif text-[23px] font-semibold leading-snug">{dia.ref}</p>
        {first && (
          <Link
            href={chapterHref(first[0], first[1])}
            className="mt-4 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gold-bright px-5 text-[17px] font-semibold text-primary shadow-card transition active:scale-[0.99]"
          >
            <Icon name="book" className="size-5" />
            Empezar a leer
          </Link>
        )}
        <p className="mt-3 text-center text-[13.5px] text-white/75">Al terminar un capítulo, «Siguiente» te lleva al próximo.</p>
      </section>

      <section className="rounded-3xl border border-line bg-surface p-5 shadow-card">
        <h2 className="font-serif text-[18px] font-semibold text-ink">Capítulos de hoy</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {dia.lecturas.flatMap(([b, from, to]) =>
            Array.from({ length: to - from + 1 }, (_, k) => {
              const c = from + k
              const book = bookById(b)
              return (
                <Link
                  key={`${b}.${c}`}
                  href={chapterHref(b, c)}
                  className="inline-flex min-h-11 items-center rounded-full border border-line bg-surface-2 px-4 text-[15px] font-semibold text-ink transition hover:bg-gold-soft"
                >
                  {book?.capitulos === 1 ? book.nombre : `${book?.nombre} ${c}`}
                </Link>
              )
            }),
          )}
        </div>
      </section>

      {leccion && (
        <Link href={lessonHref('cronologico', leccion.id)} className="block rounded-3xl border border-line bg-surface-2 p-5 transition hover:bg-surface-hover">
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-gold">Antes de leer: en qué parte de la historia estás</p>
          <p className="mt-1.5 font-serif text-[18px] font-semibold leading-snug text-ink">{leccion.titulo}</p>
          {minuto && <p className="mt-1.5 text-[15.5px] leading-relaxed text-text">{minuto}</p>}
          <p className="mt-3 inline-flex items-center gap-1.5 text-[15px] font-semibold text-primary">
            Ver la lección del Estudio
            <Icon name="arrowRight" className="size-4" />
          </p>
        </Link>
      )}
    </div>
  )
}

/** The first "En 1 minuto" sentence of the lesson, once it is written. */
function useFirstSentence(id: string): string | null {
  const [value, setValue] = useState<{ id: string; text: string | null } | null>(null)
  useEffect(() => {
    if (!LECCIONES_ESCRITAS.has(id)) return
    let alive = true
    loadLeccion(id)
      .then((l) => alive && setValue({ id, text: l?.enUnMinuto[0] ?? null }))
      .catch(() => alive && setValue({ id, text: null }))
    return () => {
      alive = false
    }
  }, [id])
  return value?.id === id ? value.text : null
}
