'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Icon } from '../icons'
import { Segmented } from '../ui'
import { JuegoView } from './Juegos'
import { NINOS_HISTORIAS } from '@/lib/content/ninos'
import type { Banda, HistoriaNinos } from '@/lib/content/ninos/types'
import { ESTUDIO_LECCIONES } from '@/lib/content/estudio/maestra'
import { lessonHref } from '@/lib/progress'

// One story of the children's corner: choose the age, listen to the story scene by scene
// (the phone reads it aloud), play, keep the verse in the heart, print a page — and a tab
// for parents and grandparents with what to talk about.

const BANDA_KEY = 'ib-es-ninos-edad'
const BANDAS_UI: { value: Banda; label: string }[] = [
  { value: '3-5', label: '3–5 años' },
  { value: '6-8', label: '6–8 años' },
  { value: '9-12', label: '9–12 años' },
]

function readBanda(): Banda {
  try {
    const v = window.localStorage.getItem(BANDA_KEY)
    return v === '3-5' || v === '9-12' ? v : '6-8'
  } catch {
    return '6-8'
  }
}

export function useHistoria(id: string): HistoriaNinos | null | undefined {
  const [loaded, setLoaded] = useState<{ id: string; h: HistoriaNinos | null } | null>(null)
  useEffect(() => {
    const load = NINOS_HISTORIAS[id]
    let alive = true
    ;(load ? load() : Promise.resolve(null))
      .then((h) => alive && setLoaded({ id, h }))
      .catch(() => alive && setLoaded({ id, h: null }))
    return () => {
      alive = false
    }
  }, [id])
  return loaded?.id === id ? loaded.h : undefined
}

/** Reads a text aloud with the phone's own Spanish voice (no audio files needed). */
function speak(text: string, onEnd?: () => void): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  const voices = window.speechSynthesis.getVoices()
  u.voice = voices.find((v) => /es[-_](419|MX|US|CO|AR)/i.test(v.lang)) ?? voices.find((v) => v.lang.toLowerCase().startsWith('es')) ?? null
  u.lang = u.voice?.lang ?? 'es-MX'
  u.rate = 0.92
  u.onend = () => onEnd?.()
  window.speechSynthesis.speak(u)
  return true
}

export function NinosStory({ id, scale, onPlayed }: { id: string; scale: number; onPlayed?: () => void }) {
  const h = useHistoria(id)
  const [banda, setBanda] = useState<Banda>(readBanda)
  const [quien, setQuien] = useState<'ninos' | 'padres'>('ninos')
  const [escena, setEscena] = useState(0)
  const [leyendo, setLeyendo] = useState(false)
  const [otro, setOtro] = useState(false)

  useEffect(() => () => window.speechSynthesis?.cancel(), [])

  if (h === undefined) return <div aria-busy className="h-72 animate-pulse rounded-3xl bg-surface-2" />
  if (h === null) {
    return (
      <div className="rounded-3xl border border-dashed border-line bg-surface-2 px-6 py-8 text-center">
        <Icon name="gift" className="mx-auto size-8 text-gold" />
        <p className="mt-3 font-serif text-[19px] font-semibold text-ink">Historia en preparación</p>
        <p className="mx-auto mt-1.5 max-w-xs text-[15.5px] leading-relaxed text-muted">Estamos preparando esta historia para los más pequeños. Muy pronto estará aquí.</p>
      </div>
    )
  }

  const chooseBanda = (b: Banda) => {
    setBanda(b)
    try {
      window.localStorage.setItem(BANDA_KEY, b)
    } catch {
      // only for this visit
    }
  }
  const e = h.escenas[escena]
  const leer = (from: number) => {
    setLeyendo(true)
    setEscena(from)
    const ok = speak(h.escenas[from].texto[banda], () => {
      if (from + 1 < h.escenas.length) leer(from + 1)
      else setLeyendo(false)
    })
    if (!ok) setLeyendo(false)
  }
  const parar = () => {
    window.speechSynthesis?.cancel()
    setLeyendo(false)
  }
  const verso = h.versiculo[banda]
  const img = e.img ?? h.imagen
  const estudio = ESTUDIO_LECCIONES.find((l) => l.id === h.estudio)

  return (
    <div style={{ fontSize: `${scale}rem` }} className="space-y-4">
      <Segmented label="¿Para quién?" value={quien} onChange={setQuien} options={[{ value: 'ninos', label: 'Para los niños' }, { value: 'padres', label: 'Papás y abuelos' }]} />

      {quien === 'ninos' ? (
        <>
          <Segmented label="Edad" value={banda} onChange={chooseBanda} options={BANDAS_UI} />

          {/* The story, one scene at a time. */}
          <section aria-label="La historia" className="overflow-hidden rounded-3xl border border-line bg-surface shadow-card">
            <div
              className={`relative grid place-items-center ${img ? 'aspect-video' : 'h-40'}`}
              style={{ backgroundImage: 'radial-gradient(120% 75% at 50% -5%, rgba(214,220,140,.32) 0%, transparent 60%), linear-gradient(180deg, #28291a 0%, #0b0c07 100%)' }}
            >
              {img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img.src} alt={img.alt} className="absolute inset-0 size-full object-cover" />
              ) : (
                <div className="text-center">
                  <Icon name="book" className="mx-auto size-9 text-gold-bright" />
                  <p className="mt-2 px-6 font-serif text-[1.2em] font-semibold text-[#fbf1dc]">{h.titulo}</p>
                </div>
              )}
              <span className="absolute bottom-2 right-3 rounded-full bg-black/40 px-2.5 py-1 text-[0.8em] font-semibold text-white">
                {escena + 1} / {h.escenas.length}
              </span>
            </div>
            <div className="p-5">
              <p key={`${escena}-${banda}`} className="animate-rise font-serif text-[1.3em] leading-relaxed text-ink">
                {e.texto[banda]}
              </p>
              <div className="mt-5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEscena(Math.max(0, escena - 1))}
                  disabled={escena === 0}
                  aria-label="Escena anterior"
                  className="grid size-14 place-items-center rounded-2xl border border-line text-ink disabled:opacity-30"
                >
                  <Icon name="arrowLeft" className="size-6" />
                </button>
                <button
                  type="button"
                  onClick={() => (leyendo ? parar() : leer(escena))}
                  className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-gold-bright text-[1.05em] font-semibold text-primary"
                >
                  <Icon name={leyendo ? 'pause' : 'headphones'} className="size-5" />
                  {leyendo ? 'Pausar' : 'Escuchar'}
                </button>
                <button
                  type="button"
                  onClick={() => setEscena(Math.min(h.escenas.length - 1, escena + 1))}
                  disabled={escena === h.escenas.length - 1}
                  aria-label="Escena siguiente"
                  className="grid size-14 place-items-center rounded-2xl bg-primary text-white disabled:opacity-30"
                >
                  <Icon name="arrowRight" className="size-6" />
                </button>
              </div>
            </div>
          </section>

          <figure className="rounded-3xl bg-gold-soft/70 p-5 text-center">
            <p className="text-[0.8em] font-bold uppercase tracking-[0.08em] text-gold">Guarda en tu corazón</p>
            <blockquote className="mt-2 font-serif text-[1.3em] font-semibold leading-snug text-ink">«{verso.texto}»</blockquote>
            <figcaption className="mt-2 text-[0.85em] text-muted">
              {verso.referencia}
              {verso.fuente === 'adaptado' ? ' (adaptado)' : ''}
            </figcaption>
          </figure>

          {h.juegos[0] && <JuegoView key={`${banda}-0`} juego={h.juegos[0]} banda={banda} estampa={h.estampa} onDone={onPlayed} />}
          {h.juegos[1] &&
            (otro ? (
              <JuegoView key={`${banda}-1`} juego={h.juegos[1]} banda={banda} estampa={h.estampa} />
            ) : (
              <button type="button" onClick={() => setOtro(true)} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-primary font-semibold text-primary">
                <Icon name="star" className="size-5" />
                ¡Otro juego!
              </button>
            ))}

          <Link
            href={`/ninos/${h.id}/imprimir?edad=${banda}`}
            className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-line bg-surface font-semibold text-ink shadow-card"
          >
            <Icon name="download" className="size-5 text-gold" />
            Hoja para imprimir
          </Link>
        </>
      ) : (
        <Padres h={h} estudio={estudio} />
      )}
    </div>
  )
}

function Padres({ h, estudio }: { h: HistoriaNinos; estudio?: { id: string; titulo: string; rotulo: string } }) {
  const p = h.padres
  return (
    <div className="space-y-4">
      <section className="rounded-3xl bg-primary p-5 text-white shadow-float">
        <p className="text-[0.8em] font-bold uppercase tracking-[0.08em] text-gold-bright">Lo que queremos que descubra</p>
        <p className="mt-2 leading-relaxed text-white/90">{p.objetivo}</p>
      </section>
      <section className="rounded-3xl border border-line bg-surface p-5 shadow-card">
        <h2 className="font-serif text-[1.2em] font-semibold text-ink">Tres preguntas para conversar</h2>
        <ol className="mt-3 space-y-3">
          {(
            [
              ['Recordar', p.preguntas.recordar],
              ['Sentir', p.preguntas.sentir],
              ['Vivir', p.preguntas.vivir],
            ] as const
          ).map(([k, q], i) => (
            <li key={k} className="flex gap-3">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-gold-soft text-[0.8em] font-bold text-ink">{i + 1}</span>
              <span className="leading-snug text-ink">
                <span className="font-semibold">{k}: </span>
                {q}
              </span>
            </li>
          ))}
        </ol>
      </section>
      {p.siPregunta && p.siPregunta.length > 0 && (
        <section className="rounded-3xl border border-line bg-surface-2 p-5">
          <h2 className="font-serif text-[1.2em] font-semibold text-ink">Si pregunta…</h2>
          {p.siPregunta.map((s) => (
            <div key={s.pregunta} className="mt-3">
              <p className="font-semibold text-ink">«{s.pregunta}»</p>
              <p className="mt-1 leading-relaxed text-text">{s.respuesta}</p>
            </div>
          ))}
        </section>
      )}
      <section className="rounded-3xl bg-gold-soft/60 p-5">
        <p className="text-[0.8em] font-bold uppercase tracking-[0.08em] text-gold">Oración para hacer juntos</p>
        <p className="mt-1.5 font-serif italic leading-relaxed text-ink">{p.oracion}</p>
        <p className="mt-4 text-[0.8em] font-bold uppercase tracking-[0.08em] text-gold">Esta semana</p>
        <p className="mt-1.5 leading-relaxed text-ink">{p.gesto}</p>
      </section>
      {estudio && (
        <Link href={lessonHref('cronologico', estudio.id)} className="flex min-h-14 items-center justify-between gap-2 rounded-2xl border border-line bg-surface px-4 py-3">
          <span>
            <span className="block font-semibold text-ink">Lee más en el Estudio Cronológico</span>
            <span className="block text-[0.85em] text-muted">
              {estudio.titulo} · {estudio.rotulo}
            </span>
          </span>
          <Icon name="chevronRight" className="size-5 text-muted" />
        </Link>
      )}
    </div>
  )
}
