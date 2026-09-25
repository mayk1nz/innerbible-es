'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, type FormEvent } from 'react'
import { Icon } from '../icons'
import { BrandMark, buttonClass } from '../ui'
import { APP, DEMO_MODE } from '@/lib/config'
import { setMember, useAppState, useHydrated, type ServerMember } from '@/lib/store'
import { nameFromEmail } from '@/lib/text'

// Two steps: the purchase email, then a 6-digit code sent to it. The reference app
// lets anyone in who types a buyer's email; the code closes that door and stops
// shared logins, at the cost of one extra step.
//
// For now the code step is OFF: no e-mail with a code is sent yet, so asking for one
// would leave real buyers waiting for a message that never arrives. The backend will
// send and verify the code (turn SEND_CODE on) and refuse e-mails without a purchase.
const SEND_CODE = false

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function LoginForm() {
  const router = useRouter()
  const hydrated = useHydrated()
  const { session } = useAppState()
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (hydrated && session) router.replace('/inicio')
  }, [hydrated, session, router])

  const submitEmail = async (e: FormEvent) => {
    e.preventDefault()
    if (busy) return
    const clean = email.trim().toLowerCase()
    if (!EMAIL_RE.test(clean)) {
      setError('Revisa tu correo: parece incompleto.')
      return
    }
    setEmail(clean)
    setError(null)
    if (SEND_CODE) {
      setStep('code')
      return
    }
    setBusy(true)
    try {
      const name = nameFromEmail(clean)
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: clean, name }),
      })
      if (res.status === 403) {
        setError('No encontramos una compra con este correo. Usa el mismo correo con el que compraste o escríbenos y te ayudamos.')
        return
      }
      if (!res.ok) throw new Error(String(res.status))
      setMember(clean, name, (await res.json()) as ServerMember)
      router.replace('/inicio')
    } catch {
      setError('No pudimos conectar. Revisa tu internet e inténtalo de nuevo.')
    } finally {
      setBusy(false)
    }
  }

  const submitCode = (e: FormEvent) => {
    e.preventDefault()
    if (!/^\d{6}$/.test(code)) {
      setError('El código tiene 6 números.')
      return
    }
    // TODO(SEND_CODE): verify the code on the server (it would return the owned offers).
    setMember(email, nameFromEmail(email), { owned: ['front'] })
    router.replace('/inicio')
  }

  const inputClass =
    'min-w-0 flex-1 bg-transparent py-3.5 text-[17px] text-ink placeholder:text-muted focus:outline-none'

  return (
    <main className="grid min-h-dvh place-items-center px-5 py-10">
      <div className="w-full max-w-[400px] rounded-[28px] border border-line bg-surface px-6 py-8 shadow-card">
        <div className="flex flex-col items-center text-center">
          <BrandMark size="lg" />
          <h1 className="mt-5 font-serif text-[28px] font-semibold leading-tight text-ink">{APP.name}</h1>
          <p className="mt-1.5 text-[16px] leading-snug text-muted">
            {step === 'email' ? 'Entra con el correo de tu compra' : 'Revisa tu correo'}
          </p>
        </div>

        {step === 'email' ? (
          <form onSubmit={submitEmail} className="mt-7" noValidate>
            <label htmlFor="email" className="mb-2 block text-[15px] font-semibold text-ink">
              Correo electrónico
            </label>
            <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface-2 px-4 focus-within:border-primary">
              <Icon name="mail" className="size-5 shrink-0 text-muted" />
              <input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError(null)
                }}
                placeholder="tu@correo.com"
                className={inputClass}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'login-error' : 'login-help'}
              />
            </div>
            {error && (
              <p id="login-error" role="alert" className="mt-2 text-[14.5px] font-medium text-danger">
                {error}
              </p>
            )}
            <button type="submit" disabled={busy} aria-busy={busy} className={`${buttonClass.primary} mt-4`}>
              {busy ? 'Entrando…' : 'Continuar'}
            </button>
            <p id="login-help" className="mt-4 text-center text-[14.5px] leading-relaxed text-muted">
              Usa el mismo correo con el que hiciste tu compra.{SEND_CODE && ' Te enviaremos un código para entrar.'}
            </p>
          </form>
        ) : (
          <form onSubmit={submitCode} className="mt-7" noValidate>
            <p className="text-center text-[15.5px] leading-relaxed text-text">
              Enviamos un código de 6 números a<br />
              <strong className="text-ink">{email}</strong>
            </p>
            <label htmlFor="code" className="sr-only">
              Código de 6 números
            </label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(e) => {
                setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                setError(null)
              }}
              placeholder="000000"
              className="mt-4 w-full rounded-2xl border border-line bg-surface-2 py-3.5 text-center font-serif text-[30px] tracking-[0.4em] text-ink placeholder:text-line focus:border-primary focus:outline-none"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'code-error' : undefined}
            />
            {error && (
              <p id="code-error" role="alert" className="mt-2 text-center text-[14.5px] font-medium text-danger">
                {error}
              </p>
            )}
            <button type="submit" className={`${buttonClass.primary} mt-4`}>
              Entrar
            </button>
            <button
              type="button"
              onClick={() => {
                setStep('email')
                setCode('')
                setError(null)
              }}
              className={`${buttonClass.ghost} mt-2`}
            >
              Usar otro correo
            </button>
            {DEMO_MODE && (
              <p className="mt-3 rounded-xl bg-gold-soft/60 px-3 py-2 text-center text-[13.5px] text-ink">
                Modo demostración: cualquier código de 6 números funciona.
              </p>
            )}
          </form>
        )}

        <p className="mt-6 border-t border-line-soft pt-5 text-center text-[14px] text-muted">
          ¿Problemas para entrar?{' '}
          <a href={`mailto:${APP.supportEmail}`} className="font-semibold text-primary underline-offset-4 hover:underline">
            Escríbenos
          </a>
        </p>
      </div>
    </main>
  )
}
