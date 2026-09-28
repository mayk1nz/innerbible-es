'use client'

import Link from 'next/link'
import { Fragment, useEffect, useRef, useState, type FormEvent } from 'react'
import { Answer } from '../RichText'
import { Icon, type IconName } from '../icons'
import { PageHeader } from '../PageHeader'
import { Segmented } from '../ui'
import { chapterHref } from '@/lib/biblia'
import { eraOf } from '@/lib/estudio-era'
import type { Estudio, EstudioLink } from '@/lib/estudio-types'

// Tu Guía de Estudio (regalo 8): the member writes what they are studying — a passage, a
// person, a topic — and gets the chain of connected passages in the order of the story,
// each with a short explanation, and can ask the guide anything along the way.
// Made for everyone: one big search box, examples to tap, one passage per card.

const EXAMPLES = ['Génesis 22', 'Juan 3:16', 'El Cordero de Dios', 'La fe', 'Abraham', 'Isaías 53', 'El Espíritu Santo', 'La creación']
const RECENT_KEY = 'ib-es-estudio-recientes'

function readRecent(): string[] {
  try {
    const v = JSON.parse(window.localStorage.getItem(RECENT_KEY) ?? '[]') as unknown
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string').slice(0, 6) : []
  } catch {
    return []
  }
}

function saveRecent(q: string): string[] {
  const next = [q, ...readRecent().filter((x) => x.toLowerCase() !== q.toLowerCase())].slice(0, 6)
  try {
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next))
  } catch {
    // storage blocked: no history, nothing else changes
  }
  return next
}

type State = { status: 'idle' } | { status: 'loading'; q: string } | { status: 'error'; q: string; message: string } | { status: 'done'; estudio: Estudio }

const ERRORS: Record<string, string> = {
  'no-results': 'No encontramos pasajes para eso. Prueba con un libro y capítulo («Génesis 22»), un personaje («Moisés») o un tema («el perdón»).',
  limit: 'Llegaste al límite de estudios de hoy. Mañana puedes seguir; lo que ya estudiaste sigue aquí.',
  upstream: 'No pudimos preparar el estudio ahora. Inténtalo de nuevo en un momento.',
  'no-session': 'Tu sesión terminó. Vuelve a entrar con tu correo.',
}

export function EstudioView() {
  // /estudio?q=… (from a lesson's "Sigue el hilo", or a shared link) starts right away.
  const [arrivalQ] = useState(() => new URLSearchParams(window.location.search).get('q')?.trim() || '')
  const [input, setInput] = useState(arrivalQ)
  const [state, setState] = useState<State>(arrivalQ ? { status: 'loading', q: arrivalQ } : { status: 'idle' })
  const [recent, setRecent] = useState<string[]>(readRecent)
  const [order, setOrder] = useState<'historia' | 'biblia'>('historia')
  const topRef = useRef<HTMLDivElement>(null)

  const search = (raw: string) => {
    const q = raw.trim()
    if (q.length < 2) return
    setInput(q)
    setState({ status: 'loading', q })
    const url = new URL(window.location.href)
    url.searchParams.set('q', q)
    window.history.replaceState(null, '', url)
    void load(q)
  }

  async function load(q: string) {
    try {
      const res = await fetch(`/api/estudio?q=${encodeURIComponent(q)}`, { cache: 'no-store' })
      const body = (await res.json().catch(() => ({}))) as Estudio & { error?: string }
      if (!res.ok || body.error) throw new Error(body.error ?? 'upstream')
      setRecent(saveRecent(q))
      setOrder('historia')
      setState({ status: 'done', estudio: body })
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } catch (err) {
      const code = err instanceof Error ? err.message : 'upstream'
      setState({ status: 'error', q, message: ERRORS[code] ?? ERRORS.upstream })
    }
  }

  useEffect(() => {
    if (arrivalQ.length >= 2) void load(arrivalQ)
    // Only on arrival.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    search(input)
  }

  return (
    <>
      <PageHeader back="/leer" title="Tu Guía de Estudio" subtitle="Escribe lo que estás estudiando y sigue el hilo por toda la Biblia" />

      <form onSubmit={submit} role="search" className="rounded-3xl border border-line bg-surface p-2 shadow-card">
        <label htmlFor="estudio-q" className="sr-only">
          ¿Qué estás estudiando?
        </label>
        <div className="flex items-center gap-2">
          <Icon name="search" className="ml-2.5 size-5 shrink-0 text-muted" />
          <input
            id="estudio-q"
            type="search"
            enterKeyHint="search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ej.: Génesis 22, Abraham, la fe…"
            maxLength={120}
            className="min-h-13 min-w-0 flex-1 bg-transparent text-[17px] text-ink placeholder:text-muted focus:outline-none"
          />
          <button
            type="submit"
            disabled={state.status === 'loading' || input.trim().length < 2}
            className="grid min-h-12 shrink-0 place-items-center rounded-2xl bg-primary px-5 text-[16px] font-semibold text-white transition disabled:opacity-40"
          >
            Buscar
          </button>
        </div>
      </form>

      {state.status === 'idle' && <Welcome onPick={(q) => search(q)} recent={recent} />}

      <div ref={topRef} className="scroll-mt-4" />
      {state.status === 'loading' && <Loading q={state.q} />}
      {state.status === 'error' && (
        <div role="alert" className="mt-6 rounded-3xl border border-line bg-surface-2 p-5 text-center">
          <p className="text-[16px] leading-relaxed text-ink">{state.message}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {EXAMPLES.slice(0, 4).map((q) => (
              <Chip key={q} label={q} onClick={() => search(q)} />
            ))}
          </div>
        </div>
      )}
      {state.status === 'done' && (
        <Result estudio={state.estudio} order={order} setOrder={setOrder} onSearch={(q) => search(q)} />
      )}
    </>
  )
}

function Chip({ label, onClick, icon }: { label: string; onClick: () => void; icon?: IconName }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line bg-surface px-4 text-[15px] font-medium text-ink transition hover:bg-surface-hover active:scale-[0.98]"
    >
      {icon && <Icon name={icon} className="size-4 text-gold" />}
      {label}
    </button>
  )
}

function Welcome({ onPick, recent }: { onPick: (q: string) => void; recent: string[] }) {
  const steps: [IconName, string, string][] = [
    ['search', 'Escribe', 'Un pasaje («Génesis 22»), un personaje («Moisés») o un tema («el perdón»).'],
    ['calendar', 'Sigue la historia', 'Te mostramos los pasajes que se conectan, en el orden en que sucedieron.'],
    ['message', 'Pregunta', 'Si algo no se entiende, pregúntale a tu guía al final del estudio.'],
  ]
  return (
    <div className="animate-rise">
      {recent.length > 0 && (
        <section aria-label="Tus estudios recientes" className="mt-6">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-gold">Estudiaste hace poco</h2>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {recent.map((q) => (
              <Chip key={q} label={q} icon="clock" onClick={() => onPick(q)} />
            ))}
          </div>
        </section>
      )}
      <section aria-label="Ejemplos" className="mt-6">
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-gold">Prueba con</h2>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {EXAMPLES.map((q) => (
            <Chip key={q} label={q} onClick={() => onPick(q)} />
          ))}
        </div>
      </section>
      <section aria-label="Cómo funciona" className="mt-8 rounded-3xl border border-line bg-surface-2 p-5">
        <h2 className="font-serif text-[19px] font-semibold text-ink">Cómo funciona</h2>
        <ol className="mt-3.5 space-y-3.5">
          {steps.map(([icon, title, text], i) => (
            <li key={title} className="flex gap-3.5">
              <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary text-gold-bright">
                <Icon name={icon} className="size-5" />
              </span>
              <span>
                <span className="block text-[16px] font-semibold text-ink">
                  {i + 1}. {title}
                </span>
                <span className="block text-[15px] leading-snug text-muted">{text}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}

function Loading({ q }: { q: string }) {
  return (
    <div aria-busy role="status" className="mt-6">
      <p className="mb-4 flex items-center gap-2 text-[15.5px] text-muted">
        <Icon name="sparkles" className="size-5 animate-pulse text-gold" />
        Buscando los pasajes conectados con «{q}»…
      </p>
      <div className="animate-pulse space-y-3">
        <div className="h-28 rounded-3xl bg-primary/80" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-32 rounded-3xl border border-line bg-surface" />
        ))}
      </div>
    </div>
  )
}

function Result({
  estudio,
  order,
  setOrder,
  onSearch,
}: {
  estudio: Estudio
  order: 'historia' | 'biblia'
  setOrder: (o: 'historia' | 'biblia') => void
  onSearch: (q: string) => void
}) {
  const links =
    order === 'historia'
      ? estudio.links
      : [...estudio.links].sort((a, b) => canon(a) - canon(b))
  const eras = links.map((l) => eraOf(l.year, l.bookId).nombre)

  return (
    <div className="mt-6">
      <div className="relative overflow-hidden rounded-3xl bg-primary p-5 text-white shadow-float">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'radial-gradient(90% 70% at 90% 0%, rgba(224,172,74,.35), transparent 60%)' }} />
        <div className="relative">
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-gold-bright">
            Cadena de estudio · {estudio.links.length} pasajes
          </p>
          <h2 className="mt-1.5 font-serif text-[25px] font-semibold leading-tight">{estudio.titulo}</h2>
          {estudio.intro && <p className="mt-2 text-[15.5px] leading-relaxed text-white/85">{estudio.intro}</p>}
        </div>
      </div>

      <div className="mt-4">
        <Segmented
          label="Orden de los pasajes"
          value={order}
          onChange={setOrder}
          options={[
            { value: 'historia', label: 'Orden de la historia' },
            { value: 'biblia', label: 'Orden de la Biblia' },
          ]}
        />
      </div>

      <ol className="relative mt-5 space-y-4 before:absolute before:bottom-4 before:left-[15px] before:top-4 before:w-0.5 before:bg-line" aria-label="Pasajes de la cadena">
        {links.map((l, i) => {
          const era = eras[i]
          // In story order, a label wherever a new era begins.
          const showEra = order === 'historia' && (i === 0 || era !== eras[i - 1])
          return (
            <Fragment key={`${l.ref}-${i}`}>
              {showEra && (
                <li aria-hidden className="relative pl-10 pt-1">
                  <span className="absolute left-[9px] top-2 size-3.5 rounded-full bg-gold" />
                  <p className="text-[12.5px] font-bold uppercase tracking-[0.1em] text-gold">{era}</p>
                </li>
              )}
              <li className="animate-rise relative pl-10" style={{ animationDelay: `${Math.min(i, 10) * 40}ms` }}>
                <span
                  aria-hidden
                  className={`absolute left-[7px] top-5 size-[18px] rounded-full border-2 ${l.origin ? 'border-gold-bright bg-gold-bright' : 'border-primary bg-bg'}`}
                />
                <LinkCard link={l} n={i + 1} total={links.length} />
              </li>
            </Fragment>
          )
        })}
      </ol>

      <GuideBox key={estudio.q} estudio={estudio} />

      <div className="mt-8 text-center">
        <p className="text-[14.5px] text-muted">¿Quieres seguir otro hilo?</p>
        <div className="mt-2.5 flex flex-wrap justify-center gap-2">
          {EXAMPLES.filter((q) => q !== estudio.q)
            .slice(0, 4)
            .map((q) => (
              <Chip key={q} label={q} onClick={() => onSearch(q)} />
            ))}
        </div>
      </div>
      <p className="mt-6 text-center text-[12.5px] leading-snug text-muted">
        Conexiones: OpenBible.info (Treasury of Scripture Knowledge). Épocas: Theographic. Texto: Reina-Valera 1909.
      </p>
    </div>
  )
}

const BOOK_ORDER = ['Gen', 'Exod', 'Lev', 'Num', 'Deut', 'Josh', 'Judg', 'Ruth', '1Sam', '2Sam', '1Kgs', '2Kgs', '1Chr', '2Chr', 'Ezra', 'Neh', 'Esth', 'Job', 'Ps', 'Prov', 'Eccl', 'Song', 'Isa', 'Jer', 'Lam', 'Ezek', 'Dan', 'Hos', 'Joel', 'Amos', 'Obad', 'Jonah', 'Mic', 'Nah', 'Hab', 'Zeph', 'Hag', 'Zech', 'Mal', 'Matt', 'Mark', 'Luke', 'John', 'Acts', 'Rom', '1Cor', '2Cor', 'Gal', 'Eph', 'Phil', 'Col', '1Thess', '2Thess', '1Tim', '2Tim', 'Titus', 'Phlm', 'Heb', 'Jas', '1Pet', '2Pet', '1John', '2John', '3John', 'Jude', 'Rev']
const canon = (l: EstudioLink) => (BOOK_ORDER.indexOf(l.bookId) + 1) * 1_000_000 + l.chapter * 1_000 + l.from

function LinkCard({ link, n, total }: { link: EstudioLink; n: number; total: number }) {
  return (
    <article className={`rounded-3xl border bg-surface p-4 shadow-card ${link.origin ? 'border-gold-bright ring-2 ring-gold-bright/40' : 'border-line'}`}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-serif text-[18px] font-semibold text-ink">{link.ref}</h3>
        {link.origin ? (
          <span className="shrink-0 rounded-full bg-gold-soft px-2.5 py-1 text-[12px] font-bold text-ink">Punto de partida</span>
        ) : (
          <span className="shrink-0 text-[12.5px] tabular-nums text-muted">
            {n} de {total}
          </span>
        )}
      </div>
      <blockquote className="mt-2 border-l-2 border-gold/60 pl-3 font-serif text-[16.5px] italic leading-relaxed text-text">«{link.text}»</blockquote>
      {link.porque && <p className="mt-3 text-[15.5px] leading-relaxed text-ink">{link.porque}</p>}
      <Link
        href={chapterHref(link.bookId, link.chapter, link.from)}
        className="mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line px-4 text-[14.5px] font-semibold text-primary transition hover:bg-surface-hover"
      >
        <Icon name="book" className="size-4" />
        Leer el capítulo
      </Link>
    </article>
  )
}

const QUESTIONS = ['¿Qué pasó antes de esto?', '¿Cómo se relaciona con Jesús?', '¿Qué significa para mi vida hoy?']

function GuideBox({ estudio }: { estudio: Estudio }) {
  const [input, setInput] = useState('')
  const [answer, setAnswer] = useState('')
  const [asked, setAsked] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const context = `${estudio.titulo}: ${estudio.links.map((l) => l.ref).join(', ')}`

  const ask = async (text: string) => {
    const pregunta = text.trim()
    if (!pregunta || busy) return
    setBusy(true)
    setError(null)
    setAnswer('')
    setAsked(pregunta)
    setInput('')
    try {
      const res = await fetch('/api/estudio', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ pregunta, estudio: context }),
      })
      if (!res.ok || !res.body) {
        const code = ((await res.json().catch(() => ({}))) as { error?: string }).error ?? 'upstream'
        throw new Error(code)
      }
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let text = ''
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        text += decoder.decode(value, { stream: true })
        setAnswer(text)
      }
    } catch (err) {
      const code = err instanceof Error ? err.message : 'upstream'
      setError(ERRORS[code] ?? ERRORS.upstream)
      setInput(pregunta)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section aria-labelledby="guia-titulo" className="mt-8 rounded-3xl border border-line bg-surface-2 p-5">
      <div className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary text-gold-bright">
          <Icon name="sparkles" className="size-5" />
        </span>
        <div>
          <h2 id="guia-titulo" className="font-serif text-[19px] font-semibold text-ink">
            Pregúntale a tu guía
          </h2>
          <p className="text-[14.5px] leading-snug text-muted">Lo que no entendiste, el contexto, qué significa hoy.</p>
        </div>
      </div>

      {!asked && (
        <div className="mt-4 flex flex-col gap-2">
          {QUESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => void ask(q)}
              className="flex min-h-12 items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-4 text-left text-[15.5px] text-ink transition hover:bg-surface-hover"
            >
              {q}
              <Icon name="send" className="size-4 shrink-0 text-primary" />
            </button>
          ))}
        </div>
      )}

      {asked && (
        <div className="mt-4 space-y-3">
          <div className="ml-auto w-fit max-w-[85%] rounded-3xl rounded-tr-md bg-primary px-4 py-2.5 text-[15.5px] text-white">{asked}</div>
          <div className="rounded-3xl rounded-tl-md border border-line bg-surface px-4 py-3 font-serif text-[16.5px] leading-relaxed text-ink" aria-live="polite">
            {answer ? <Answer text={answer} /> : <span className="animate-pulse text-muted">Tu guía está preparando la respuesta…</span>}
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-3 rounded-2xl bg-gold-soft/60 px-4 py-3 text-[15px] text-ink">
          {error}
        </p>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          void ask(input)
        }}
        className="mt-4 flex items-end gap-2 rounded-2xl border border-line bg-surface p-1.5"
      >
        <label htmlFor="guia-input" className="sr-only">
          Escribe tu pregunta
        </label>
        <textarea
          id="guia-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              void ask(input)
            }
          }}
          rows={1}
          maxLength={800}
          placeholder={asked ? 'Haz otra pregunta…' : 'Escribe tu pregunta…'}
          className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-3 py-2.5 text-[16px] text-ink placeholder:text-muted focus:outline-none"
        />
        <button type="submit" disabled={busy || !input.trim()} aria-label="Enviar pregunta" className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-white transition disabled:opacity-40">
          <Icon name="send" className="size-5" />
        </button>
      </form>
    </section>
  )
}
