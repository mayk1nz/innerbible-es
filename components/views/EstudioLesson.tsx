'use client'

import Link from 'next/link'
import { useEffect, useState, type ReactNode } from 'react'
import { EstudioAudio } from '../EstudioAudio'
import { Icon, type IconName } from '../icons'
import { Segmented } from '../ui'
import { bookById, chapterHref } from '@/lib/biblia'
import GLOSARIO from '@/lib/content/estudio/glosario.json'
import { loadLeccion } from '@/lib/content/estudio/lecciones'
import type { Leccion, PreguntaQuiz } from '@/lib/content/estudio/types'
import { parseRef } from '@/lib/estudio-ref'

// One lesson of the Estudio Cronológico, in two levels: "En 1 minuto" (the default: three
// sentences, the key verse, before and after) and "Estudio completo" (everything, in the
// order a study flows). Every reference opens the Bible inside the app.

export const LEVEL_KEY = 'ib-es-estudio-nivel'
export type Nivel = 'minuto' | 'completo'

export function readLevel(): Nivel {
  try {
    return window.localStorage.getItem(LEVEL_KEY) === 'completo' ? 'completo' : 'minuto'
  } catch {
    return 'minuto'
  }
}

/** Loads the written lesson; null = not written yet, undefined = loading. */
function useLeccion(id: string): Leccion | null | undefined {
  const [loaded, setLoaded] = useState<{ id: string; leccion: Leccion | null } | null>(null)
  useEffect(() => {
    let alive = true
    loadLeccion(id)
      .then((leccion) => alive && setLoaded({ id, leccion }))
      .catch(() => alive && setLoaded({ id, leccion: null }))
    return () => {
      alive = false
    }
  }, [id])
  return loaded?.id === id ? loaded.leccion : undefined
}

/** "Génesis 22:8" → a link into the in-app Bible (plain text if it can't be read). */
export function RefLink({ refText, className = '' }: { refText: string; className?: string }) {
  const r = parseRef(refText)
  if (!r) return <span className={className}>{refText}</span>
  return (
    <Link href={chapterHref(r.book.id, r.chapter, r.from)} className={`font-semibold text-primary underline decoration-gold/50 underline-offset-4 hover:decoration-gold ${className}`}>
      {refText}
    </Link>
  )
}

const CERTEZA: Record<string, string> = { aprox: 'fecha aproximada', debatida: 'fecha debatida', incierta: 'fecha incierta' }

export function EstudioLesson({ lessonId, scale }: { lessonId: string; scale: number }) {
  const l = useLeccion(lessonId)
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
        <div className="h-4 w-11/12 rounded bg-line-soft" />
        <div className="h-24 rounded-2xl bg-gold-soft/50" />
      </div>
    )
  }
  if (l === null) {
    return (
      <div className="rounded-3xl border border-dashed border-line bg-surface-2 px-6 py-8 text-center">
        <Icon name="feather" className="mx-auto size-8 text-gold" />
        <p className="mt-3 font-serif text-[19px] font-semibold text-ink">Lección en preparación</p>
        <p className="mx-auto mt-1.5 max-w-xs text-[15.5px] leading-relaxed text-muted">
          Estamos escribiendo esta parte de la historia. Mientras tanto, puedes leer el pasaje en la Biblia o seguir el hilo con tu Guía de Estudio.
        </p>
      </div>
    )
  }

  return (
    <div style={{ fontSize: `${scale}rem` }}>
      {/* When and where, always visible. */}
      <div className="mb-4 flex flex-wrap gap-2 text-[0.85em]">
        {l.fecha && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-ink" title={l.fecha.nota}>
            <Icon name="calendar" className="size-4 text-gold" />
            {l.fecha.texto}
            <span className="text-muted">· {CERTEZA[l.fecha.certeza]}</span>
          </span>
        )}
        {l.lugar?.nombre && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-ink">
            <Icon name="map" className="size-4 text-gold" />
            {l.lugar.nombre}
          </span>
        )}
      </div>

      <EstudioAudio lessonId={lessonId} />

      <Segmented
        label="Nivel de lectura"
        value={nivel}
        onChange={choose}
        options={[
          { value: 'minuto', label: 'En 1 minuto' },
          { value: 'completo', label: 'Estudio completo' },
        ]}
      />

      {nivel === 'minuto' ? <Minuto l={l} onMore={() => choose('completo')} /> : <Completo l={l} />}
    </div>
  )
}

function Versiculo({ l }: { l: Leccion }) {
  return (
    <figure className="rounded-2xl bg-gold-soft/60 px-5 py-4">
      <blockquote className="font-serif text-[1.15em] italic leading-relaxed text-ink">«{l.versiculo.texto}»</blockquote>
      <figcaption className="mt-2 text-[0.85em]">
        <RefLink refText={l.versiculo.referencia} />
      </figcaption>
    </figure>
  )
}

function Minuto({ l, onMore }: { l: Leccion; onMore: () => void }) {
  return (
    <div className="animate-rise mt-4 space-y-4">
      <ol className="space-y-3 rounded-3xl border border-line bg-surface-2 p-5 shadow-card">
        {l.enUnMinuto.map((frase, i) => (
          <li key={i} className="flex gap-3 font-serif text-[1.08em] leading-relaxed text-ink">
            <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-primary font-sans text-[0.8em] font-bold text-gold-bright">{i + 1}</span>
            {frase}
          </li>
        ))}
      </ol>
      <Versiculo l={l} />
      <AntesDespues l={l} />
      <button
        type="button"
        onClick={onMore}
        className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-primary px-5 text-[1em] font-semibold text-primary transition hover:bg-surface-hover"
      >
        <Icon name="book" className="size-5" />
        Ver el estudio completo
      </button>
    </div>
  )
}

function AntesDespues({ l }: { l: Leccion }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {(
        [
          ['arrowLeft', 'Antes', l.antes],
          ['arrowRight', 'Lo que viene', l.despues],
        ] as [IconName, string, string][]
      ).map(([icon, label, text]) => (
        <div key={label} className="rounded-2xl border border-line bg-surface p-4">
          <p className="flex items-center gap-1.5 text-[0.78em] font-semibold uppercase tracking-[0.08em] text-gold">
            <Icon name={icon} className="size-4" />
            {label}
          </p>
          <p className="mt-1.5 leading-snug text-ink">{text}</p>
        </div>
      ))}
    </div>
  )
}

export function Bloque({ icon, title, children, tone = 'plain' }: { icon: IconName; title: string; children: ReactNode; tone?: 'plain' | 'navy' | 'gold' }) {
  const box = tone === 'navy' ? 'bg-primary text-white shadow-float' : tone === 'gold' ? 'bg-gold-soft/60 text-ink' : 'border border-line bg-surface text-ink shadow-card'
  return (
    <section className={`rounded-3xl p-5 ${box}`}>
      <h2 className={`flex items-center gap-2 font-serif text-[1.2em] font-semibold ${tone === 'navy' ? 'text-white' : 'text-ink'}`}>
        <Icon name={icon} className={`size-5 ${tone === 'navy' ? 'text-gold-bright' : 'text-gold'}`} />
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  )
}

function Completo({ l }: { l: Leccion }) {
  const glosario = l.glosario.map((id) => (GLOSARIO as { id: string; termino: string; definicion: string }[]).find((g) => g.id === id)).filter(Boolean) as { id: string; termino: string; definicion: string }[]
  return (
    <div className="animate-rise mt-4 space-y-4">
      <Versiculo l={l} />

      {l.personajes.length > 0 && (
        <Bloque icon="users" title="Personajes">
          <ul className="divide-y divide-line-soft">
            {l.personajes.map((p) => (
              <li key={p.id} className="py-2.5 first:pt-0 last:pb-0">
                <span className="font-semibold text-ink">{p.nombre}</span>
                <span className="text-text"> — {p.linea}</span>
              </li>
            ))}
          </ul>
        </Bloque>
      )}

      {l.eventos.length > 0 && (
        <Bloque icon="calendar" title="Lo que pasó, en orden">
          <ol className="relative space-y-3 before:absolute before:bottom-2 before:left-[11px] before:top-2 before:w-0.5 before:bg-line">
            {l.eventos.map((e, i) => (
              <li key={i} className="relative flex gap-3">
                <span className="relative mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-primary text-[0.7em] font-bold text-gold-bright">{i + 1}</span>
                <span className="leading-snug">
                  <span className="text-ink">{e.texto}</span>
                  <br />
                  <RefLink refText={e.ref} className="text-[0.88em]" />
                </span>
              </li>
            ))}
          </ol>
        </Bloque>
      )}

      <Bloque icon="book" title="La historia">
        <div className="space-y-4">
          {l.resumen.map((m) => (
            <div key={m.subtitulo}>
              <h3 className="font-sans text-[0.8em] font-bold uppercase tracking-[0.08em] text-gold">{m.subtitulo}</h3>
              <p className="mt-1 font-serif text-[1.06em] leading-[1.75] text-text">{m.texto}</p>
            </div>
          ))}
        </div>
      </Bloque>

      {l.otraMirada && l.otraMirada.length > 0 && (
        <Bloque icon="search" title="Otra mirada">
          <ul className="space-y-2.5">
            {l.otraMirada.map((o) => (
              <li key={o.libro} className="leading-snug">
                <span className="font-semibold text-ink">{bookById(o.libro)?.nombre ?? o.libro}:</span> <span className="text-text">{o.texto}</span>
              </li>
            ))}
          </ul>
        </Bloque>
      )}

      <Bloque icon="sparkles" title="Jesús en esta parte de la historia" tone="navy">
        <p className="leading-relaxed text-white/90">{l.jesusAqui.texto}</p>
        <p className="mt-3 flex flex-wrap gap-2">
          {l.jesusAqui.refs.map((r) => {
            const p = parseRef(r)
            return p ? (
              <Link key={r} href={chapterHref(p.book.id, p.chapter, p.from)} className="inline-flex min-h-10 items-center rounded-full bg-white/10 px-3.5 text-[0.88em] font-semibold text-gold-bright hover:bg-white/15">
                {r}
              </Link>
            ) : (
              <span key={r}>{r}</span>
            )
          })}
        </p>
      </Bloque>

      <Bloque icon="globe" title="Mientras tanto en el mundo">
        <p className="leading-relaxed text-text">{l.mundo}</p>
      </Bloque>

      <AntesDespues l={l} />

      {l.conexiones.length > 0 && (
        <Bloque icon="external" title="Conexiones en otros libros">
          <ul className="space-y-3">
            {l.conexiones.map((c) => (
              <li key={c.ref} className="leading-snug">
                <RefLink refText={c.ref} />
                <span className="text-text"> — {c.motivo}</span>
              </li>
            ))}
          </ul>
          <Link
            href={`/estudio?q=${encodeURIComponent(l.versiculo.referencia)}`}
            className="mt-4 flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-[0.95em] font-semibold text-white"
          >
            <Icon name="sparkles" className="size-5 text-gold-bright" />
            Sigue el hilo con tu Guía de Estudio
          </Link>
        </Bloque>
      )}

      <Bloque icon="heart" title="Para tu vida" tone="gold">
        <p className="leading-relaxed text-ink">{l.paraTuVida.aplicacion}</p>
        <p className="mt-2 font-semibold leading-relaxed text-ink">{l.paraTuVida.pregunta}</p>
        <p className="mt-4 text-[0.78em] font-semibold uppercase tracking-[0.08em] text-gold">Oración</p>
        <p className="mt-1 font-serif italic leading-relaxed text-ink">{l.meditar}</p>
      </Bloque>

      <Bloque icon="gift" title="Para los niños">
        <p className="leading-relaxed text-ink">{l.ninos.pregunta}</p>
        <p className="mt-2 leading-relaxed text-text">
          {l.ninos.actividad}
        </p>
      </Bloque>

      {glosario.length > 0 && <Glosario terms={glosario} />}

      {l.notaEcumenica && (
        <p className="rounded-2xl border border-line-soft bg-surface-2 p-4 text-[0.9em] leading-relaxed text-text">
          <span className="font-semibold text-ink">Nota: </span>
          {l.notaEcumenica}
        </p>
      )}

      <Bloque icon="book" title="Lee en la Biblia">
        <p className="text-[0.9em] text-muted">Unos {l.leer.minutos} minutos de lectura. Toca un capítulo para abrirlo.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {l.leer.capitulos.map((c) => {
            const [id, ch] = c.split('.')
            const b = bookById(id)
            return b ? (
              <Link key={c} href={chapterHref(b.id, Number(ch))} className="inline-flex min-h-11 items-center rounded-full border border-line bg-surface-2 px-4 text-[0.9em] font-semibold text-ink hover:bg-gold-soft">
                {b.nombre} {ch}
              </Link>
            ) : null
          })}
        </div>
      </Bloque>

      <Quiz preguntas={l.quiz} />
    </div>
  )
}

function Glosario({ terms }: { terms: { id: string; termino: string; definicion: string }[] }) {
  const [open, setOpen] = useState<string | null>(null)
  return (
    <Bloque icon="search" title="Palabras de esta lección">
      <div className="flex flex-wrap gap-2">
        {terms.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-expanded={open === t.id}
            onClick={() => setOpen(open === t.id ? null : t.id)}
            className={`min-h-11 rounded-full border px-4 text-[0.9em] font-semibold transition ${open === t.id ? 'border-primary bg-primary text-white' : 'border-line bg-surface-2 text-ink hover:bg-gold-soft'}`}
          >
            {t.termino}
          </button>
        ))}
      </div>
      {open && (
        <p role="status" className="animate-rise mt-3 rounded-2xl bg-gold-soft/60 p-3.5 leading-relaxed text-ink">
          <span className="font-semibold">{terms.find((t) => t.id === open)?.termino}:</span> {terms.find((t) => t.id === open)?.definicion}
        </p>
      )}
    </Bloque>
  )
}

export function Quiz({ preguntas }: { preguntas: Pick<PreguntaQuiz, 'pregunta' | 'opciones' | 'correcta' | 'explicacion'>[] }) {
  const [answers, setAnswers] = useState<(number | null)[]>(() => preguntas.map(() => null))
  const right = answers.filter((a, i) => a === preguntas[i].correcta).length
  const done = answers.every((a) => a !== null)
  return (
    <Bloque icon="star" title="Repaso: 3 preguntas">
      <ol className="space-y-5">
        {preguntas.map((p, i) => {
          const a = answers[i]
          return (
            <li key={i}>
              <p className="font-semibold leading-snug text-ink">
                {i + 1}. {p.pregunta}
              </p>
              <div className="mt-2.5 grid gap-2" role="group" aria-label={`Opciones de la pregunta ${i + 1}`}>
                {p.opciones.map((o, j) => {
                  const chosen = a === j
                  const correct = j === p.correcta
                  const state = a === null ? 'idle' : correct ? 'right' : chosen ? 'wrong' : 'off'
                  return (
                    <button
                      key={j}
                      type="button"
                      disabled={a !== null}
                      onClick={() => setAnswers((prev) => prev.map((x, k) => (k === i ? j : x)))}
                      className={`flex min-h-12 items-center justify-between gap-2 rounded-2xl border px-4 py-2.5 text-left text-[0.95em] transition ${
                        state === 'right'
                          ? 'border-success bg-success-soft font-semibold text-ink'
                          : state === 'wrong'
                            ? 'border-danger/60 bg-danger/10 text-ink'
                            : state === 'off'
                              ? 'border-line bg-surface-2 text-muted'
                              : 'border-line bg-surface-2 text-ink hover:bg-gold-soft'
                      }`}
                    >
                      {o}
                      {state === 'right' && <Icon name="check" className="size-5 shrink-0 text-success" strokeWidth={2.6} label="Correcta" />}
                      {state === 'wrong' && <Icon name="x" className="size-5 shrink-0 text-danger" label="Incorrecta" />}
                    </button>
                  )
                })}
              </div>
              {a !== null && <p className="animate-rise mt-2 text-[0.9em] leading-relaxed text-text">{p.explicacion}</p>}
            </li>
          )
        })}
      </ol>
      {done && (
        <p role="status" className="animate-rise mt-5 rounded-2xl bg-primary p-4 text-center font-semibold text-white">
          {right === preguntas.length ? '¡Excelente! Acertaste las 3.' : `Acertaste ${right} de ${preguntas.length}. ¡Lo importante es aprender!`}
        </p>
      )}
    </Bloque>
  )
}
