'use client'

import { Fragment, useEffect, useRef, useState, type FormEvent } from 'react'
import { Icon } from '../icons'
import { PageHeader } from '../PageHeader'
import { buttonClass } from '../ui'
import { CONSEJERO } from '@/lib/config'
import { PAIN_EXAMPLES, TOPIC_GROUPS } from '@/lib/consejero/topics'
import { useAppState } from '@/lib/store'
import { formatUsd } from '@/lib/funnel/config'

// Tu Consejero Bíblico. Members with Palabras del Señor (upsell 2) talk with it every
// day; everyone else gets one free question a day, examples of the biggest pains and
// the half-price offer with their own countdown. Everything comes from /api/consejero
// (the conversation is kept on the server, for the member only).

interface Message {
  role: 'user' | 'assistant'
  content: string
  crisis?: boolean
}

interface Status {
  member: boolean
  limit: number
  used: number
  offerStartedAt: string | null
  messages: Message[]
}

export function ConsejeroView() {
  const { session } = useAppState()
  const [status, setStatus] = useState<Status | 'loading' | 'error'>('loading')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let alive = true
    fetch('/api/consejero', { cache: 'no-store' })
      .then(async (res) => {
        if (!res.ok) throw new Error(String(res.status))
        const data = (await res.json()) as Status
        if (alive) setStatus(data)
      })
      .catch(() => alive && setStatus('error'))
    return () => {
      alive = false
    }
  }, [attempt])

  if (status === 'loading') {
    return (
      <div aria-busy className="animate-pulse space-y-4">
        <div className="h-44 rounded-[28px] bg-primary/80" />
        <div className="h-6 w-2/3 rounded bg-line-soft" />
        <div className="grid grid-cols-2 gap-2.5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-2xl bg-surface" />
          ))}
        </div>
      </div>
    )
  }
  if (status === 'error') {
    return (
      <>
        <PageHeader title="Tu Consejero Bíblico" />
        <div className="rounded-3xl border border-line bg-surface p-6 text-center">
          <p className="text-[16px] text-text">No pudimos abrir tu Consejero. Revisa tu conexión.</p>
          <button type="button" onClick={() => { setStatus('loading'); setAttempt((a) => a + 1) }} className={`${buttonClass.secondary} mt-4`}>
            Intentar de nuevo
          </button>
        </div>
      </>
    )
  }

  const name = session?.name ?? ''
  if (status.member) return <Chat status={status} name={name} mode="member" />
  return <LockedConsejero status={status} name={name} />
}

// ─── Pieces ─────────────────────────────────────────────────────────

/** "a **b** c" → a <strong>b</strong> c, paragraph by paragraph. */
function Answer({ text }: { text: string }) {
  return (
    <>
      {text
        .split(/\n{2,}/)
        .filter((p) => p.trim())
        .map((p, i) => (
          <p key={i} className={i ? 'mt-2.5' : ''}>
            {p.split('**').map((part, j) => (
              <Fragment key={j}>{j % 2 ? <strong className="font-semibold">{part}</strong> : part}</Fragment>
            ))}
          </p>
        ))}
    </>
  )
}

function CrisisCard() {
  return (
    <div role="alert" className="mt-3 rounded-2xl border-2 border-danger/40 bg-[#fbeceb] p-4 text-[15px] leading-relaxed text-ink">
      <p className="flex items-center gap-2 font-semibold text-danger">
        <Icon name="phone" className="size-5" />
        No estás sin ayuda. Habla hoy con alguien:
      </p>
      <ul className="mt-2 space-y-1">
        <li>
          <strong>Emergencias:</strong> el número de emergencias de tu país (911 en muchos países)
        </li>
        <li>
          <strong>Estados Unidos:</strong> 988 (marca 2 para español)
        </li>
        <li>
          <strong>México:</strong> Línea de la Vida 800 911 2000
        </li>
        <li>
          <strong>Argentina:</strong> 135 · <strong>Chile:</strong> *4141 · <strong>España:</strong> 024
        </li>
      </ul>
      <p className="mt-2">También puedes llamar ahora a una persona de confianza, a tu pastor o a tu sacerdote.</p>
    </div>
  )
}

/** "¿Sobre qué quieres conversar?": groups first, then ready-to-send first sentences. */
function TopicPicker({ onPick, title = '¿Sobre qué quieres conversar?' }: { onPick: (text: string) => void; title?: string }) {
  const [open, setOpen] = useState<string | null>(null)
  const group = TOPIC_GROUPS.find((g) => g.id === open)
  return (
    <section aria-label="Temas para conversar" className="mt-6">
      <h2 className="font-serif text-[20px] font-semibold text-ink">{title}</h2>
      <div className="mt-3 grid grid-cols-2 gap-2.5">
        {TOPIC_GROUPS.map((g) => {
          const active = g.id === open
          return (
            <button
              key={g.id}
              type="button"
              aria-expanded={active}
              onClick={() => setOpen(active ? null : g.id)}
              className={`flex min-h-16 items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition ${
                active ? 'border-primary bg-primary text-white shadow-card' : 'border-line bg-surface text-ink hover:bg-surface-hover'
              }`}
            >
              <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${active ? 'bg-white/15 text-gold-bright' : 'bg-gold-soft text-gold'}`}>
                <Icon name={g.icon} className="size-5" />
              </span>
              <span className="text-[15px] font-semibold leading-tight">{g.label}</span>
            </button>
          )
        })}
      </div>
      {group && (
        <ul className="animate-rise mt-3 space-y-2">
          {group.starters.map((s) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => onPick(s)}
                className="flex min-h-12 w-full items-center gap-3 rounded-2xl border border-line bg-surface-2 px-4 py-3 text-left text-[15.5px] text-ink transition hover:bg-surface-hover"
              >
                <span className="flex-1">{s}</span>
                <Icon name="send" className="size-4 shrink-0 text-primary" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-4 text-center text-[14px] text-muted">O escríbelo con tus propias palabras aquí abajo.</p>
    </section>
  )
}

// ─── The conversation ─────────────────────────────────────────────

function Chat({ status, name, mode }: { status: Status; name: string; mode: 'member' | 'free' }) {
  const [messages, setMessages] = useState<Message[]>(status.messages)
  const [used, setUsed] = useState(status.used)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const left = Math.max(0, status.limit - used)
  const free = mode === 'free'

  useEffect(() => {
    if (messages.length) endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

  const send = async (text: string) => {
    const question = text.trim()
    if (!question || busy || left === 0) return
    const before = messages
    setInput('')
    setNotice(null)
    setBusy(true)
    const withQuestion: Message[] = [...before, { role: 'user', content: question }]
    setMessages([...withQuestion, { role: 'assistant', content: '' }])

    try {
      const res = await fetch('/api/consejero', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: question }),
      })
      if (!res.ok || !res.body) {
        const code = ((await res.json().catch(() => ({}))) as { error?: string }).error
        throw new Error(code ?? 'upstream')
      }
      setUsed((u) => u + 1)
      const crisis = res.headers.get('x-crisis') === '1'
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let answer = ''
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        answer += decoder.decode(value, { stream: true })
        setMessages([...withQuestion, { role: 'assistant', content: answer, crisis }])
      }
    } catch (err) {
      // Nothing was answered: give the question back.
      const code = err instanceof Error ? err.message : ''
      setMessages(before)
      if (code === 'limit' || code === 'free-used') {
        setUsed(status.limit)
      } else {
        setInput(question)
      }
      setNotice(
        code === 'limit'
          ? `Llegaste a las ${status.limit} conversaciones de hoy. ¡Te espero mañana!`
          : code === 'free-used'
            ? 'Ya usaste tu consulta gratuita de hoy. Vuelve mañana, o desbloquea tu Consejero para conversar cada día.'
            : code === 'not-configured'
              ? 'El Consejero todavía no está conectado. Vuelve en un rato.'
              : code === 'no-session'
                ? 'Tu sesión terminó. Vuelve a entrar con tu correo.'
                : 'No pude responder ahora. Revisa tu conexión e inténtalo de nuevo en un momento.',
      )
    } finally {
      setBusy(false)
    }
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    void send(input)
  }

  const reset = async () => {
    if (!window.confirm('¿Borrar toda tu conversación con el Consejero? No se puede deshacer.')) return
    const res = await fetch('/api/consejero', { method: 'DELETE' }).catch(() => null)
    if (res?.ok) setMessages([])
  }

  const empty = messages.length === 0

  return (
    <>
      {free ? (
        <div className="rounded-3xl border border-line bg-surface p-4">
          <p className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-gold">
            <Icon name="gift" className="size-4" />
            Tu consulta gratuita de hoy
          </p>
          <p className="mt-1 text-[15px] leading-snug text-text">
            {left > 0 ? 'Pruébalo ahora: cuéntale lo que llevas en el corazón. Tienes 1 consulta gratis cada día.' : 'Ya usaste la de hoy. Mañana tendrás otra.'}
          </p>
        </div>
      ) : empty ? (
        <div className="relative overflow-hidden rounded-[28px] bg-primary px-5 pb-6 pt-5 text-white shadow-float">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: 'radial-gradient(90% 70% at 85% 0%, rgba(224,172,74,.35), transparent 60%)' }}
          />
          <div className="relative">
            <span className="grid size-12 place-items-center rounded-2xl bg-white/10 text-gold-bright">
              <Icon name="chatCross" className="size-6" />
            </span>
            <h1 className="mt-4 font-serif text-[27px] font-semibold leading-tight">Hola{name ? `, ${name}` : ''}</h1>
            <p className="mt-1.5 text-[16px] leading-relaxed text-white/85">
              Soy tu Consejero Bíblico. Cuéntame lo que llevas en el corazón y buscaremos juntos luz en la Palabra de Dios.
            </p>
          </div>
        </div>
      ) : (
        <PageHeader title="Tu Consejero Bíblico" subtitle="Consuelo y dirección en la Palabra" />
      )}

      {empty && left > 0 && <TopicPicker onPick={(t) => void send(t)} title={free ? '¿Sobre qué quieres preguntar?' : undefined} />}

      <div className="mt-4 space-y-4">
        {messages.map((m, i) =>
          m.role === 'user' ? (
            <div key={i} className="ml-auto max-w-[85%] whitespace-pre-wrap rounded-3xl rounded-tr-md bg-primary px-4 py-3 text-[16px] leading-relaxed text-white">
              {m.content}
            </div>
          ) : (
            <div key={i} className="flex gap-2.5">
              <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-full bg-primary text-gold-bright" aria-hidden>
                <Icon name="chatCross" className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="rounded-3xl rounded-tl-md border border-line bg-surface px-4 py-3 font-serif text-[16.5px] leading-relaxed text-ink">
                  {m.content ? <Answer text={m.content} /> : <span className="animate-pulse text-muted">Buscando luz en la Palabra…</span>}
                </div>
                {m.crisis && <CrisisCard />}
              </div>
            </div>
          ),
        )}
        <div ref={endRef} />
      </div>

      {notice && (
        <p role="status" className="mt-4 rounded-2xl bg-gold-soft/60 px-4 py-3 text-center text-[15px] text-ink">
          {notice}
        </p>
      )}

      {(left > 0 || !free) && (
        <form
          onSubmit={submit}
          className="sticky z-30 mt-5 rounded-3xl border border-line bg-surface p-2 shadow-card"
          style={{ bottom: 'calc(max(env(safe-area-inset-bottom), 12px) + 88px)' }}
        >
          <div className="flex items-end gap-2">
            <label htmlFor="consejero-input" className="sr-only">
              Escribe tu mensaje
            </label>
            <textarea
              id="consejero-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  void send(input)
                }
              }}
              rows={1}
              maxLength={1500}
              disabled={left === 0}
              placeholder={left === 0 ? 'Llegaste al límite de hoy. ¡Hasta mañana!' : 'Escribe lo que sientes…'}
              className="max-h-36 min-h-12 flex-1 resize-none bg-transparent px-3 py-3 text-[16px] leading-snug text-ink placeholder:text-muted focus:outline-none"
            />
            <button
              type="submit"
              disabled={busy || !input.trim() || left === 0}
              aria-label="Enviar"
              className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary text-white transition disabled:opacity-40"
            >
              <Icon name="send" className="size-5" />
            </button>
          </div>
          <div className="flex items-center justify-between px-3 pb-1 pt-1 text-[12.5px] text-muted">
            <span>{free ? (left ? '1 consulta gratis hoy' : 'Consulta de hoy usada') : `${left} de ${status.limit} conversaciones hoy`}</span>
            {!empty && !free && (
              <button type="button" onClick={() => void reset()} className="font-semibold text-primary underline-offset-4 hover:underline">
                Borrar conversación
              </button>
            )}
          </div>
        </form>
      )}

      <p className="mt-3 text-center text-[13px] leading-snug text-muted">
        Tu Consejero usa inteligencia artificial para ayudarte a buscar luz en la Biblia. No reemplaza a tu pastor, a tu sacerdote ni a un profesional. Tu conversación es privada: solo tú la ves.
      </p>
    </>
  )
}

// ─── For members without Palabras del Señor ───────────────────────

function useNow(): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(t)
  }, [])
  return now
}

function Countdown({ deadline, now }: { deadline: number; now: number }) {
  const ms = Math.max(0, deadline - now)
  const days = Math.floor(ms / 86_400_000)
  const pad = (n: number) => String(n).padStart(2, '0')
  const h = pad(Math.floor((ms % 86_400_000) / 3_600_000))
  const m = pad(Math.floor((ms % 3_600_000) / 60_000))
  const sec = pad(Math.floor((ms % 60_000) / 1000))
  return (
    <div className="mt-3 flex items-center justify-center gap-2 font-sans tabular-nums" aria-label={`Termina en ${days} días`}>
      {[
        [String(days), days === 1 ? 'día' : 'días'],
        [h, 'h'],
        [m, 'min'],
        [sec, 's'],
      ].map(([v, unit]) => (
        <span key={unit} className="min-w-14 rounded-xl bg-white/10 px-2 py-1.5 text-center">
          <span className="block text-[22px] font-bold leading-none">{v}</span>
          <span className="mt-1 block text-[11px] uppercase tracking-wide text-white/70">{unit}</span>
        </span>
      ))}
    </div>
  )
}

/** The biggest pains, each with the start of a real-style answer, cut at the lock. */
function PainExamples() {
  const [id, setId] = useState(PAIN_EXAMPLES[0].id)
  const ex = PAIN_EXAMPLES.find((p) => p.id === id) ?? PAIN_EXAMPLES[0]
  return (
    <section aria-label="Ejemplos de conversación" className="mt-8">
      <h2 className="font-serif text-[20px] font-semibold text-ink">Así te acompaña cada día</h2>
      <p className="mt-1 text-[15px] leading-relaxed text-muted">Toca un tema y mira un ejemplo:</p>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {PAIN_EXAMPLES.map((p) => {
          const active = p.id === ex.id
          return (
            <button
              key={p.id}
              type="button"
              aria-pressed={active}
              onClick={() => setId(p.id)}
              className={`flex min-h-[74px] flex-col items-center justify-center gap-1.5 rounded-2xl border px-1 py-2 text-center transition ${
                active ? 'border-primary bg-primary text-white shadow-card' : 'border-line bg-surface text-ink hover:bg-surface-hover'
              }`}
            >
              <Icon name={p.icon} className={`size-5 ${active ? 'text-gold-bright' : 'text-gold'}`} />
              <span className="text-[12.5px] font-semibold leading-tight">{p.label}</span>
            </button>
          )
        })}
      </div>
      <div key={ex.id} className="animate-rise relative mt-4 overflow-hidden rounded-3xl border border-line bg-surface-2 p-4">
        <div className="ml-auto max-w-[85%] rounded-3xl rounded-tr-md bg-primary px-4 py-3 text-[15.5px] leading-relaxed text-white">{ex.question}</div>
        <div className="mt-3 flex gap-2.5">
          <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-full bg-primary text-gold-bright" aria-hidden>
            <Icon name="chatCross" className="size-4" />
          </span>
          <div className="rounded-3xl rounded-tl-md border border-line bg-surface px-4 py-3 font-serif text-[16px] leading-relaxed text-ink">{ex.answer}</div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface-2 to-transparent" />
        <span className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-primary px-3 py-1.5 text-[13px] font-semibold text-white">
          <Icon name="lock" className="size-3.5" />
          Continúa con tu Consejero
        </span>
      </div>
    </section>
  )
}

function LockedConsejero({ status, name }: { status: Status; name: string }) {
  const now = useNow()
  const started = status.offerStartedAt ? Date.parse(status.offerStartedAt) : now
  const deadline = started + CONSEJERO.offerDays * 86_400_000
  const active = now < deadline
  const price = active ? CONSEJERO.discountPrice : CONSEJERO.fullPrice
  // The 50% checkout only while the member's own 15 days last; then the full price.
  const checkout = active ? CONSEJERO.checkoutUrl : CONSEJERO.fullCheckoutUrl
  const includes = [
    'Tu Consejero Bíblico: hasta 30 conversaciones al día',
    'Tres planes de 90 días, con una minitarea y pasos prácticos para cada día',
    'La Guía Palabras del Señor',
    'Biblioteca «Caminando con Gigantes»',
  ]

  return (
    <>
      <PageHeader title="Tu Consejero Bíblico" subtitle="Consuelo y dirección en la Palabra, a cualquier hora" />

      <Chat status={status} name={name} mode="free" />

      <PainExamples />

      <div className="mt-6 rounded-3xl bg-primary p-5 text-center text-white shadow-float">
        {active ? (
          <>
            <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-gold-bright">Solo para ti · 50% de descuento de por vida</p>
            <Countdown deadline={deadline} now={now} />
          </>
        ) : (
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-gold-bright">Palabras del Señor</p>
        )}
        <p className="mt-4 font-serif text-[20px] font-semibold">Tu Consejero + 3 planes de 90 días</p>
        <p className="mt-1 text-[15px] text-white/80">
          {active && (
            <>
              <span className="line-through">{formatUsd(CONSEJERO.fullPrice)}</span>{' '}
            </>
          )}
          <strong className="text-[22px] text-white">{formatUsd(price)}</strong> al mes
        </p>
        {checkout ? (
          <a
            href={checkout}
            className="mt-4 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gold-bright px-5 text-[17px] font-semibold text-primary shadow-card transition hover:brightness-105 active:scale-[0.99]"
          >
            Quiero mi Consejero
            <Icon name="arrowRight" className="size-5" />
          </a>
        ) : (
          <button type="button" disabled className={`${buttonClass.primary} mt-4 bg-white/20`}>
            Disponible muy pronto
          </button>
        )}
        {active && (
          <p className="mt-3 text-[13px] leading-snug text-white/75">
            Pagas {formatUsd(CONSEJERO.discountPrice)} al mes mientras mantengas tu suscripción. Cuando termine el plazo, el precio vuelve a {formatUsd(CONSEJERO.fullPrice)}.
          </p>
        )}
        <p className="mt-2 text-[13px] text-white/75">Compra con el mismo correo de tu cuenta y se activa solo.</p>
      </div>

      <div className="mt-5 rounded-3xl border border-line bg-surface p-5">
        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-gold">Incluye</p>
        <ul className="mt-3 space-y-2.5">
          {includes.map((item) => (
            <li key={item} className="flex gap-2.5 text-[15.5px] leading-snug text-ink">
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-success-soft text-success">
                <Icon name="check" className="size-3.5" strokeWidth={2.6} />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
