'use client'

import { useMemo, useState } from 'react'
import { Icon } from '../icons'
import type { Banda, Juego } from '@/lib/content/ninos/types'
import { crearSopa, limpiar } from '@/lib/ninos-sopa'

// The games of the children's corner. Made for small fingers and small hearts: big
// targets, one thing at a time, a mistake is only "¡Casi! Intenta otra vez", and every
// game ends in a celebration.

function shuffle<T>(list: T[]): T[] {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function Casi() {
  return (
    <p role="status" className="animate-rise mt-3 flex items-center justify-center gap-2 rounded-2xl bg-gold-soft/70 px-4 py-2.5 text-center text-[1.05em] font-semibold text-ink">
      <Icon name="heart" className="size-5 text-gold" />
      ¡Casi! Intenta otra vez
    </p>
  )
}

export function Celebracion({ estampa, onAgain }: { estampa: string; onAgain: () => void }) {
  return (
    <div role="status" className="animate-pop rounded-3xl bg-primary p-6 text-center text-white shadow-float">
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-gold-bright text-primary">
        <Icon name="star" className="size-8" />
      </span>
      <p className="mt-3 font-serif text-[1.5em] font-semibold">¡Lo lograste!</p>
      <p className="mt-1 text-white/85">Ganaste la estampa «{estampa}».</p>
      <button type="button" onClick={onAgain} className="mt-4 min-h-12 rounded-full border border-white/30 px-5 font-semibold hover:bg-white/10">
        Jugar otra vez
      </button>
    </div>
  )
}

export function JuegoView({ juego, banda, estampa, onDone }: { juego: Juego; banda: Banda; estampa: string; onDone?: () => void }) {
  const [round, setRound] = useState(0)
  const [done, setDone] = useState(false)
  const finish = () => {
    setDone(true)
    onDone?.()
  }
  return (
    <section aria-label="Juego" className="rounded-3xl border border-line bg-surface p-5 shadow-card">
      <p className="font-serif text-[1.25em] font-semibold leading-snug text-ink">{juego.enunciado}</p>
      <div className="mt-4">
        {done ? (
          <Celebracion
            estampa={estampa}
            onAgain={() => {
              setDone(false)
              setRound((r) => r + 1)
            }}
          />
        ) : juego.tipo === 'ordenar' ? (
          <Ordenar key={round} items={juego.niveles[banda].items} onDone={finish} />
        ) : juego.tipo === 'quiz' ? (
          <Quiz key={round} preguntas={juego.niveles[banda].preguntas} onDone={finish} />
        ) : juego.tipo === 'memoria' ? (
          <Memoria key={round} pares={juego.niveles[banda].pares} onDone={finish} />
        ) : juego.tipo === 'verdadero-falso' ? (
          <VerdaderoFalso key={round} frases={juego.niveles[banda].frases} onDone={finish} />
        ) : (
          <SopaJuego key={round} {...juego.niveles[banda]} onDone={finish} />
        )}
      </div>
    </section>
  )
}

/** Tap the moments of the story in the order they happened. */
function Ordenar({ items, onDone }: { items: string[]; onDone: () => void }) {
  const [cards] = useState(() => shuffle(items.map((texto, i) => ({ texto, i }))))
  const [next, setNext] = useState(0)
  const [miss, setMiss] = useState<number | null>(null)
  const tap = (i: number) => {
    if (i < next) return
    if (i === next) {
      setMiss(null)
      if (next + 1 === items.length) onDone()
      else setNext(next + 1)
    } else setMiss(i)
  }
  return (
    <div>
      <p className="mb-3 text-[0.95em] text-muted">Toca lo que pasó primero, después lo segundo…</p>
      <div className="grid gap-2.5">
        {cards.map((c) => {
          const placed = c.i < next
          return (
            <button
              key={c.i}
              type="button"
              onClick={() => tap(c.i)}
              disabled={placed}
              className={`flex min-h-14 items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-[1.05em] transition active:scale-[0.98] ${
                placed ? 'border-success bg-success-soft text-ink' : miss === c.i ? 'border-gold bg-gold-soft/60 text-ink' : 'border-line bg-surface-2 text-ink hover:border-primary'
              }`}
            >
              <span className={`grid size-9 shrink-0 place-items-center rounded-full text-[0.9em] font-bold ${placed ? 'bg-success text-white' : 'bg-line-soft text-muted'}`}>
                {placed ? c.i + 1 : '?'}
              </span>
              {c.texto}
            </button>
          )
        })}
      </div>
      {miss !== null && <Casi />}
    </div>
  )
}

function Quiz({ preguntas, onDone }: { preguntas: { texto: string; opciones: string[]; correcta: number; explicacion?: string }[]; onDone: () => void }) {
  const [i, setI] = useState(0)
  const [ok, setOk] = useState(false)
  const [miss, setMiss] = useState(false)
  const p = preguntas[i]
  return (
    <div>
      <p className="text-[0.85em] font-semibold text-muted">
        Pregunta {i + 1} de {preguntas.length}
      </p>
      <p className="mt-1 text-[1.15em] font-semibold leading-snug text-ink">{p.texto}</p>
      <div className="mt-3 grid gap-2.5">
        {p.opciones.map((o, j) => (
          <button
            key={j}
            type="button"
            disabled={ok}
            onClick={() => {
              if (j === p.correcta) {
                setOk(true)
                setMiss(false)
              } else setMiss(true)
            }}
            className={`min-h-14 rounded-2xl border-2 px-4 py-3 text-left text-[1.05em] transition active:scale-[0.98] ${
              ok && j === p.correcta ? 'border-success bg-success-soft font-semibold text-ink' : 'border-line bg-surface-2 text-ink hover:border-primary'
            }`}
          >
            {o}
          </button>
        ))}
      </div>
      {miss && !ok && <Casi />}
      {ok && (
        <div className="animate-rise mt-3">
          <p className="rounded-2xl bg-success-soft px-4 py-2.5 text-[1em] text-ink">
            <strong>¡Muy bien!</strong> {p.explicacion}
          </p>
          <button
            type="button"
            onClick={() => {
              if (i + 1 === preguntas.length) onDone()
              else {
                setI(i + 1)
                setOk(false)
              }
            }}
            className="mt-3 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-[1.05em] font-semibold text-white"
          >
            {i + 1 === preguntas.length ? 'Terminar' : 'Siguiente'}
            <Icon name="arrowRight" className="size-5 text-gold-bright" />
          </button>
        </div>
      )}
    </div>
  )
}

function Memoria({ pares, onDone }: { pares: [string, string][]; onDone: () => void }) {
  const [cards] = useState(() => shuffle(pares.flatMap(([a, b], i) => [{ texto: a, par: i }, { texto: b, par: i }])))
  const [open, setOpen] = useState<number[]>([])
  const [found, setFound] = useState<Set<number>>(() => new Set())
  const flip = (k: number) => {
    if (open.includes(k) || found.has(cards[k].par) || open.length === 2) return
    const now = [...open, k]
    setOpen(now)
    if (now.length === 2) {
      const [a, b] = now
      if (cards[a].par === cards[b].par) {
        const f = new Set(found).add(cards[a].par)
        setFound(f)
        setOpen([])
        if (f.size === pares.length) window.setTimeout(onDone, 500)
      } else window.setTimeout(() => setOpen([]), 900)
    }
  }
  return (
    <div>
      <p className="mb-3 text-[0.95em] text-muted">Toca dos cartas: encuentra las que van juntas.</p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {cards.map((c, k) => {
          const visible = open.includes(k) || found.has(c.par)
          return (
            <button
              key={k}
              type="button"
              onClick={() => flip(k)}
              aria-label={visible ? c.texto : 'Carta boca abajo'}
              className={`grid min-h-20 place-items-center rounded-2xl border-2 p-2 text-center text-[0.95em] font-semibold leading-tight transition ${
                found.has(c.par) ? 'border-success bg-success-soft text-ink' : visible ? 'border-primary bg-surface-2 text-ink' : 'border-primary bg-primary text-gold-bright'
              }`}
            >
              {visible ? c.texto : <Icon name="star" className="size-6" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function VerdaderoFalso({ frases, onDone }: { frases: { texto: string; verdadera: boolean; porque: string }[]; onDone: () => void }) {
  const [i, setI] = useState(0)
  const [answered, setAnswered] = useState<boolean | null>(null)
  const f = frases[i]
  const right = answered !== null && answered === f.verdadera
  return (
    <div>
      <p className="text-[0.85em] font-semibold text-muted">
        {i + 1} de {frases.length}
      </p>
      <p className="mt-1 rounded-2xl bg-surface-2 p-4 text-[1.15em] leading-snug text-ink">{f.texto}</p>
      {!right && (
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          {[true, false].map((v) => (
            <button
              key={String(v)}
              type="button"
              onClick={() => setAnswered(v)}
              className={`min-h-16 rounded-2xl text-[1.1em] font-bold text-white transition active:scale-[0.97] ${v ? 'bg-success' : 'bg-primary'}`}
            >
              {v ? 'Verdadero' : 'Falso'}
            </button>
          ))}
        </div>
      )}
      {answered !== null && !right && <Casi />}
      {right && (
        <div className="animate-rise mt-3">
          <p className="rounded-2xl bg-success-soft px-4 py-2.5 text-ink">
            <strong>¡Muy bien!</strong> {f.porque}
          </p>
          <button
            type="button"
            onClick={() => {
              if (i + 1 === frases.length) onDone()
              else {
                setI(i + 1)
                setAnswered(null)
              }
            }}
            className="mt-3 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary font-semibold text-white"
          >
            {i + 1 === frases.length ? 'Terminar' : 'Siguiente'}
            <Icon name="arrowRight" className="size-5 text-gold-bright" />
          </button>
        </div>
      )}
    </div>
  )
}

/** Tap the first letter and then the last letter of a word. */
function SopaJuego({ tamano, palabras, diagonales, seed, onDone }: { tamano: number; palabras: string[]; diagonales: boolean; seed: number; onDone: () => void }) {
  const sopa = useMemo(() => crearSopa(tamano, palabras, diagonales, seed), [tamano, palabras, diagonales, seed])
  const [start, setStart] = useState<[number, number] | null>(null)
  const [found, setFound] = useState<string[]>([])
  const [miss, setMiss] = useState(false)
  const inFound = (r: number, c: number) => sopa.colocadas.some((w) => found.includes(w.palabra) && w.celdas.some(([a, b]) => a === r && b === c))
  const tap = (r: number, c: number) => {
    if (!start) {
      setStart([r, c])
      setMiss(false)
      return
    }
    const hit = sopa.colocadas.find((w) => {
      const first = w.celdas[0]
      const last = w.celdas[w.celdas.length - 1]
      const same = (p: [number, number], q: [number, number]) => p[0] === q[0] && p[1] === q[1]
      return !found.includes(w.palabra) && ((same(first, start) && same(last, [r, c])) || (same(last, start) && same(first, [r, c])))
    })
    setStart(null)
    if (hit) {
      const f = [...found, hit.palabra]
      setFound(f)
      if (f.length === sopa.colocadas.length) window.setTimeout(onDone, 400)
    } else setMiss(true)
  }
  return (
    <div>
      <p className="mb-3 text-[0.95em] text-muted">Toca la primera letra de una palabra y después la última.</p>
      <div className="mx-auto grid max-w-sm gap-1" style={{ gridTemplateColumns: `repeat(${tamano}, minmax(0, 1fr))` }}>
        {sopa.grid.map((row, r) =>
          row.map((l, c) => {
            const sel = start && start[0] === r && start[1] === c
            return (
              <button
                key={`${r}-${c}`}
                type="button"
                onClick={() => tap(r, c)}
                aria-label={`Letra ${l}`}
                className={`grid aspect-square min-h-9 place-items-center rounded-lg font-sans text-[1em] font-bold transition ${
                  sel ? 'bg-primary text-gold-bright' : inFound(r, c) ? 'bg-success text-white' : 'bg-surface-2 text-ink hover:bg-gold-soft'
                }`}
              >
                {l}
              </button>
            )
          }),
        )}
      </div>
      {miss && <Casi />}
      <ul className="mt-4 flex flex-wrap gap-2">
        {sopa.colocadas.map((w) => (
          <li key={w.palabra} className={`rounded-full px-3 py-1.5 text-[0.9em] font-semibold ${found.includes(w.palabra) ? 'bg-success-soft text-success line-through' : 'bg-gold-soft/60 text-ink'}`}>
            {limpiar(w.palabra)}
          </li>
        ))}
      </ul>
    </div>
  )
}
