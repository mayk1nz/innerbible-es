'use client'

import { Fragment, useEffect, useRef, useState, type FormEvent } from 'react'
import { Icon } from '../icons'
import { PageHeader } from '../PageHeader'
import { buttonClass } from '../ui'
import { CONSEJERO } from '@/lib/config'
import { useAppState, useToday } from '@/lib/store'
import { formatUsd } from '@/lib/funnel/config'

// Tu Consejero Bíblico. Members with Palabras del Señor (upsell 2) talk with it; the
// rest see what it is, an example conversation and the half-price offer with its
// countdown. The answers come from /api/consejero (DeepSeek + the app's own texts).

interface Message {
  role: 'user' | 'assistant'
  content: string
  crisis?: boolean
}

interface Saved {
  day: string
  used: number
  messages: Message[]
}

const CHAT_KEY = 'ib-es-consejero'
const OFFER_KEY = 'ib-es-consejero-oferta'
const MAX_SAVED = 40

const SUGGESTIONS = ['Me siento con ansiedad', 'Tuve una pelea en casa', 'Me cuesta perdonar', 'No entiendo un pasaje', 'Quiero orar por alguien']

function load(): Saved {
  try {
    const raw = window.localStorage.getItem(CHAT_KEY)
    if (raw) {
      const s = JSON.parse(raw) as Saved
      if (Array.isArray(s.messages)) return s
    }
  } catch {
    // unreadable: start fresh
  }
  return { day: '', used: 0, messages: [] }
}

function save(s: Saved) {
  try {
    window.localStorage.setItem(CHAT_KEY, JSON.stringify({ ...s, messages: s.messages.slice(-MAX_SAVED) }))
  } catch {
    // storage full or blocked: the conversation just isn't kept
  }
}

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

export function ConsejeroView() {
  const s = useAppState()
  if (!s.owned.includes('upsell2')) return <LockedConsejero />
  return <Chat email={s.session?.email ?? ''} name={s.session?.name ?? ''} />
}

// ─── The conversation ─────────────────────────────────────────────

function Chat({ email, name }: { email: string; name: string }) {
  const today = useToday()
  // Rendered only in the browser (AppShell waits for the session), so storage is readable here.
  const [saved, setSaved] = useState<Saved>(() => load())
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const used = saved.day === today ? saved.used : 0
  const left = Math.max(0, CONSEJERO.dailyLimit - used)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [saved.messages])

  const send = async (text: string) => {
    const question = text.trim()
    if (!question || busy || left === 0) return
    setInput('')
    setNotice(null)
    setBusy(true)
    const history: Message[] = [...saved.messages, { role: 'user', content: question }]
    let current: Saved = { day: today, used: used + 1, messages: [...history, { role: 'assistant', content: '' }] }
    setSaved(current)

    try {
      const res = await fetch('/api/consejero', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, messages: history.map(({ role, content }) => ({ role, content })) }),
      })
      if (!res.ok || !res.body) {
        const code = ((await res.json().catch(() => ({}))) as { error?: string }).error
        throw new Error(code ?? 'upstream')
      }
      const crisis = res.headers.get('x-crisis') === '1'
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let answer = ''
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        answer += decoder.decode(value, { stream: true })
        current = { ...current, messages: [...history, { role: 'assistant', content: answer, crisis }] }
        setSaved(current)
      }
      save(current)
    } catch (err) {
      // Nothing was answered: give the question back and don't count it.
      const code = err instanceof Error ? err.message : ''
      setSaved({ ...saved })
      setInput(question)
      setNotice(
        code === 'locked'
          ? 'Tu Consejero se está preparando y muy pronto podrás conversar aquí.'
          : code === 'not-configured'
            ? 'El Consejero todavía no está conectado. Vuelve en un rato.'
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

  const reset = () => {
    const fresh = { day: saved.day, used: saved.used, messages: [] }
    setSaved(fresh)
    save(fresh)
  }

  return (
    <>
      <PageHeader title="Tu Consejero Bíblico" subtitle="Consuelo y dirección en la Palabra, a cualquier hora" />

      <div className="space-y-3">
        <div className="max-w-[88%] rounded-3xl rounded-tl-md border border-line bg-surface px-4 py-3 text-[16px] leading-relaxed text-ink">
          Hola{name ? `, ${name}` : ''}. Estoy aquí para acompañarte con la Palabra de Dios. ¿Qué hay en tu corazón hoy?
        </div>

        {saved.messages.map((m, i) =>
          m.role === 'user' ? (
            <div key={i} className="ml-auto max-w-[85%] whitespace-pre-wrap rounded-3xl rounded-tr-md bg-primary px-4 py-3 text-[16px] leading-relaxed text-white">
              {m.content}
            </div>
          ) : (
            <div key={i}>
              <div className="max-w-[92%] rounded-3xl rounded-tl-md border border-line bg-surface px-4 py-3 font-serif text-[16.5px] leading-relaxed text-ink">
                {m.content ? <Answer text={m.content} /> : <span className="animate-pulse text-muted">Escribiendo…</span>}
              </div>
              {m.crisis && <CrisisCard />}
            </div>
          ),
        )}
        <div ref={endRef} />
      </div>

      {saved.messages.length === 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {SUGGESTIONS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => void send(t)}
              className="rounded-full border border-line bg-surface px-4 py-2 text-[14.5px] font-medium text-ink transition hover:bg-surface-hover"
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {notice && (
        <p role="status" className="mt-4 rounded-2xl bg-gold-soft/60 px-4 py-3 text-center text-[15px] text-ink">
          {notice}
        </p>
      )}

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
          <span>
            {left} de {CONSEJERO.dailyLimit} conversaciones hoy
          </span>
          {saved.messages.length > 0 && (
            <button type="button" onClick={reset} className="font-semibold text-primary underline-offset-4 hover:underline">
              Nueva conversación
            </button>
          )}
        </div>
      </form>

      <p className="mt-3 text-center text-[13px] leading-snug text-muted">
        Tu Consejero usa inteligencia artificial para ayudarte a buscar luz en la Biblia. No reemplaza a tu pastor, a tu sacerdote ni a un profesional.
      </p>
    </>
  )
}

// ─── For members without Palabras del Señor ───────────────────────

function useOfferDeadline(): number {
  // The member's own 15 days start the first time they see the offer.
  // TODO(backend): keep this date on the server, so it can't be restarted.
  const [start] = useState(() => {
    try {
      const saved = Number(window.localStorage.getItem(OFFER_KEY))
      if (saved > 0) return saved
      const now = Date.now()
      window.localStorage.setItem(OFFER_KEY, String(now))
      return now
    } catch {
      return Date.now()
    }
  })
  return start + CONSEJERO.offerDays * 86_400_000
}

function useNow(): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(t)
  }, [])
  return now
}

function Countdown({ deadline }: { deadline: number }) {
  const now = useNow()
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

function LockedConsejero() {
  const deadline = useOfferDeadline()
  const now = useNow()
  const active = now < deadline
  const price = active ? CONSEJERO.discountPrice : CONSEJERO.fullPrice
  const includes = [
    'Tu Consejero Bíblico: hasta 30 conversaciones al día',
    'Tres planes de 90 días, con una minitarea y pasos prácticos para cada día',
    'La Guía Palabras del Señor',
    'Biblioteca «Caminando con Gigantes»',
  ]

  return (
    <>
      <PageHeader title="Tu Consejero Bíblico" subtitle="Consuelo y dirección en la Palabra, a cualquier hora" />

      {/* An example of what a conversation looks like. */}
      <div className="relative overflow-hidden rounded-3xl border border-line bg-surface-2 p-4" aria-label="Ejemplo de conversación">
        <div className="ml-auto max-w-[85%] rounded-3xl rounded-tr-md bg-primary px-4 py-3 text-[15.5px] leading-relaxed text-white">
          Estoy muy ansiosa por las deudas y no puedo dormir.
        </div>
        <div className="mt-3 max-w-[92%] rounded-3xl rounded-tl-md border border-line bg-surface px-4 py-3 font-serif text-[16px] leading-relaxed text-ink">
          Gracias por contármelo. Cuando las cuentas no cierran, la mente no descansa, y es muy humano sentirse así. La Palabra dice: «Echando toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros» (1 Pedro 5:7). Esta noche, antes de dormir, escribe en una hoja cada deuda y…
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface-2 to-transparent" />
        <span className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[13px] font-semibold text-white">
          <Icon name="lock" className="size-3.5" />
          Parte de Palabras del Señor
        </span>
      </div>

      <div className="mt-5 rounded-3xl bg-primary p-5 text-center text-white shadow-float">
        {active ? (
          <>
            <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-gold-bright">Solo para ti · 50% de descuento de por vida</p>
            <Countdown deadline={deadline} />
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
        {CONSEJERO.checkoutUrl ? (
          <a href={CONSEJERO.checkoutUrl} className={`${buttonClass.primary} mt-4 bg-gold-bright text-primary hover:bg-gold-bright`}>
            Quiero mi Consejero
            <Icon name="arrowRight" className="size-5" />
          </a>
        ) : (
          <button type="button" disabled className={`${buttonClass.primary} mt-4 bg-white/20`}>
            Disponible muy pronto
          </button>
        )}
        {active && <p className="mt-3 text-[13px] leading-snug text-white/75">Pagas {formatUsd(CONSEJERO.discountPrice)} al mes mientras mantengas tu suscripción. Cuando termine el plazo, el precio vuelve a {formatUsd(CONSEJERO.fullPrice)}.</p>}
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
