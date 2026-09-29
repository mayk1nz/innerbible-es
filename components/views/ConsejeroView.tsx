'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { BenefitList, DealBox } from '../Deal'
import { Answer } from '../RichText'
import { Icon } from '../icons'
import { PageHeader } from '../PageHeader'
import { buttonClass } from '../ui'
import { PAIN_EXAMPLES, TOPIC_GROUPS } from '@/lib/consejero/topics'
import { DEALS } from '@/lib/deals'
import { useAppState } from '@/lib/store'

// Tu Consejero Bíblico. Members with Palabras del Señor (upsell 2) talk with it every
// day; everyone else gets one free question a day, examples of the biggest pains and
// the half-price offer with their own countdown. Everything comes from /api/consejero
// (the conversation is kept on the server, for the member only).

interface Message {
  role: 'user' | 'assistant'
  content: string
  crisis?: boolean
}

interface Conversation {
  id: string
  title: string
  updatedAt: string
  questions: number
}

interface Status {
  member: boolean
  limit: number
  used: number
  offerStartedAt: string | null
  /** The member's conversations, most recent first. */
  conversations: Conversation[]
  /** The conversation on screen (null: a new one). */
  conversationId: string | null
  messages: Message[]
}

/** "Hoy", "Ayer", "Hace 3 días" or the date. */
function when(iso: string): string {
  const days = Math.floor((Date.now() - Date.parse(iso)) / 86_400_000)
  if (days <= 0) return 'Hoy'
  if (days === 1) return 'Ayer'
  if (days < 7) return `Hace ${days} días`
  return new Date(iso).toLocaleDateString('es', { day: 'numeric', month: 'short' })
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

function CrisisCard() {
  return (
    <div role="alert" className="mt-3 rounded-2xl border-2 border-danger/40 bg-danger/10 p-4 text-[15px] leading-relaxed text-ink">
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
  const [conversationId, setConversationId] = useState<string | null>(status.conversationId)
  const [conversations, setConversations] = useState<Conversation[]>(status.conversations ?? [])
  const [tab, setTab] = useState<'chat' | 'historial'>('chat')
  const [opening, setOpening] = useState<string | null>(null)
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
        body: JSON.stringify({ message: question, conversationId }),
      })
      if (!res.ok || !res.body) {
        const code = ((await res.json().catch(() => ({}))) as { error?: string }).error
        throw new Error(code ?? 'upstream')
      }
      setUsed((u) => u + 1)
      // A new conversation gets its id from the server; the history list follows along.
      const id = res.headers.get('x-conversation') ?? conversationId
      if (id) {
        setConversationId(id)
        const now = new Date().toISOString()
        setConversations((list) => {
          const found = list.find((c) => c.id === id)
          const entry = found ? { ...found, updatedAt: now, questions: found.questions + 1 } : { id, title: question.length > 90 ? `${question.slice(0, 88)}…` : question, updatedAt: now, questions: 1 }
          return [entry, ...list.filter((c) => c.id !== id)]
        })
      }
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

  /** "Nueva conversación": the one on screen stays in the history. */
  const startNew = () => {
    setMessages([])
    setConversationId(null)
    setNotice(null)
    setTab('chat')
  }

  const open = async (id: string) => {
    if (id === conversationId) return setTab('chat')
    setOpening(id)
    const res = await fetch(`/api/consejero?c=${id}`, { cache: 'no-store' }).catch(() => null)
    const data = res?.ok ? ((await res.json()) as Status) : null
    setOpening(null)
    if (!data) return setNotice('No pude abrir esa conversación. Inténtalo de nuevo.')
    setMessages(data.messages)
    setConversationId(data.conversationId)
    setNotice(null)
    setTab('chat')
  }

  const remove = async (id: string) => {
    if (!window.confirm('¿Borrar esta conversación? No se puede deshacer.')) return
    const res = await fetch(`/api/consejero?c=${id}`, { method: 'DELETE' }).catch(() => null)
    if (!res?.ok) return
    setConversations((list) => list.filter((c) => c.id !== id))
    if (id === conversationId) startNew()
  }

  const empty = messages.length === 0
  const others = conversations.filter((c) => c.id !== conversationId)

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

      {(conversations.length > 0 || !empty) && (
        <div className="mt-4 flex items-center gap-2">
          <div role="tablist" aria-label="Tu Consejero" className="grid flex-1 grid-cols-2 gap-1 rounded-2xl border border-line bg-surface p-1">
            {(
              [
                ['chat', 'Conversación'],
                ['historial', `Historial${others.length ? ` (${others.length})` : ''}`],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
                className={`min-h-11 rounded-xl text-[15px] font-semibold transition ${tab === id ? 'bg-primary text-white shadow-card' : 'text-text hover:text-ink'}`}
              >
                {label}
              </button>
            ))}
          </div>
          {tab === 'chat' && !empty && !busy && (
            <button
              type="button"
              onClick={startNew}
              aria-label="Nueva conversación"
              title="Nueva conversación: esta queda guardada en tu historial"
              className="grid size-12 shrink-0 place-items-center rounded-2xl border border-line bg-surface text-primary shadow-card transition hover:bg-surface-hover"
            >
              <Icon name="plus" className="size-5" />
            </button>
          )}
        </div>
      )}

      {tab === 'historial' ? (
        <History conversations={others} opening={opening} onOpen={(id) => void open(id)} onRemove={(id) => void remove(id)} onNew={startNew} />
      ) : (
        <>
      {!empty && conversations.length > 0 && (
        <p className="mt-3 text-center text-[13.5px] leading-snug text-muted">
          Sigue preguntando sobre este tema aquí. Para hablar de otra cosa, toca <strong className="font-semibold text-ink">+</strong> y esta conversación queda en tu historial.
        </p>
      )}

      {empty && left > 0 && <TopicPicker onPick={(t) => void send(t)} title={free ? '¿Sobre qué quieres preguntar?' : undefined} />}

      <div className="mt-4 space-y-4">
        {messages.map((m, i) =>
          m.role === 'user' ? (
            <div key={i} className="ml-auto w-fit max-w-[85%] whitespace-pre-wrap rounded-3xl rounded-tr-md bg-primary px-4 py-3 text-[16px] leading-relaxed text-white">
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
            {!empty && !free && conversationId && (
              <button type="button" onClick={() => void remove(conversationId)} className="font-semibold text-primary underline-offset-4 hover:underline">
                Borrar conversación
              </button>
            )}
          </div>
        </form>
      )}
        </>
      )}

      <p className="mt-3 text-center text-[13px] leading-snug text-muted">
        Tu Consejero usa inteligencia artificial para ayudarte a buscar luz en la Biblia. No reemplaza a tu pastor, a tu sacerdote ni a un profesional. Tu conversación es privada: solo tú la ves.
      </p>
    </>
  )
}

/** Past conversations: open one to keep talking about that topic, or delete it. */
function History({
  conversations,
  opening,
  onOpen,
  onRemove,
  onNew,
}: {
  conversations: Conversation[]
  opening: string | null
  onOpen: (id: string) => void
  onRemove: (id: string) => void
  onNew: () => void
}) {
  if (conversations.length === 0) {
    return (
      <div className="mt-5 rounded-3xl border border-dashed border-line bg-surface-2 px-6 py-8 text-center">
        <Icon name="chatCross" className="mx-auto size-8 text-gold" />
        <p className="mt-3 font-serif text-[18px] font-semibold text-ink">Tu historial está vacío</p>
        <p className="mx-auto mt-1.5 max-w-xs text-[15px] leading-relaxed text-muted">Cuando empieces una conversación nueva, la anterior quedará guardada aquí para que puedas volver a ella.</p>
      </div>
    )
  }
  return (
    <>
      <ul className="mt-4 space-y-2.5">
        {conversations.map((c) => (
          <li key={c.id} className="flex items-stretch overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
            <button type="button" onClick={() => onOpen(c.id)} className="flex min-h-16 min-w-0 flex-1 items-center gap-3 px-4 py-3 text-left transition hover:bg-surface-hover">
              <span className="min-w-0 flex-1">
                <span className="line-clamp-2 block font-serif text-[16px] leading-snug text-ink">{c.title}</span>
                <span className="mt-1 block text-[13px] text-muted">
                  {when(c.updatedAt)} · {c.questions === 1 ? '1 pregunta' : `${c.questions} preguntas`}
                </span>
              </span>
              {opening === c.id ? <span className="text-[13px] text-muted">Abriendo…</span> : <Icon name="chevronRight" className="size-5 shrink-0 text-muted" />}
            </button>
            <button
              type="button"
              onClick={() => onRemove(c.id)}
              aria-label={`Borrar la conversación «${c.title}»`}
              className="grid w-12 shrink-0 place-items-center border-l border-line-soft text-muted transition hover:bg-surface-hover hover:text-ink"
            >
              <Icon name="trash" className="size-4.5" />
            </button>
          </li>
        ))}
      </ul>
      <button type="button" onClick={onNew} className={`${buttonClass.secondary} mt-4`}>
        <Icon name="plus" className="size-5" />
        Nueva conversación
      </button>
    </>
  )
}

// ─── For members without Palabras del Señor ───────────────────────

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
        <div className="ml-auto w-fit max-w-[85%] rounded-3xl rounded-tr-md bg-primary px-4 py-3 text-[15.5px] leading-relaxed text-white">{ex.question}</div>
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
  return (
    <>
      <PageHeader title="Tu Consejero Bíblico" subtitle="Consuelo y dirección en la Palabra, a cualquier hora" />

      <Chat status={status} name={name} mode="free" />

      <PainExamples />

      <div className="mt-6">
        <DealBox offer="upsell2" title="Tu Consejero + 3 planes de 90 días" cta="Quiero mi Consejero" />
      </div>

      <div className="mt-5 rounded-3xl border border-line bg-surface p-5">
        <BenefitList items={DEALS.upsell2.benefits} label="Incluye" />
      </div>
    </>
  )
}
