'use client'

import { useEffect, useState } from 'react'
import { Icon } from './icons'
import { enablePush, pushState, type PushState } from '@/lib/push-client'

// On Home, for whoever has not turned the reminders on: one tap to get a reminder each
// morning and each night, in their own time. Dismissed, it comes back a week later.
// On an iPhone the app must be installed first (Apple's rule): it says so.

const DISMISS_KEY = 'ib-notify-dismissed'
const WEEK = 7 * 86_400_000

function dismissedRecently(): boolean {
  try {
    const at = Number(window.localStorage.getItem(DISMISS_KEY) || 0)
    return Date.now() - at < WEEK
  } catch {
    return false
  }
}

export function NotifyPrompt() {
  const [state, setState] = useState<PushState | 'loading' | 'hidden'>('loading')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let alive = true
    if (dismissedRecently()) {
      queueMicrotask(() => alive && setState('hidden'))
      return
    }
    pushState()
      .then((s) => alive && setState(s))
      .catch(() => alive && setState('hidden'))
    return () => {
      alive = false
    }
  }, [])

  if (state !== 'off' && state !== 'install-first') return null

  const dismiss = () => {
    try {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()))
    } catch {
      // private mode: hidden for this visit only
    }
    setState('hidden')
  }

  const turnOn = async () => {
    setBusy(true)
    try {
      setState(await enablePush())
    } catch {
      setState('hidden')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative mt-3 rounded-3xl border border-gold/40 bg-gold-soft/50 p-4">
      <button type="button" onClick={dismiss} aria-label="Ahora no" className="absolute right-2 top-2 grid size-9 place-items-center rounded-full text-muted hover:bg-surface-hover">
        <Icon name="x" className="size-4" />
      </button>
      <p className="flex items-center gap-2 pr-8 font-serif text-[17px] font-semibold text-ink">
        <Icon name="bell" className="size-5 text-gold" />
        ¿Te acompaño cada día?
      </p>
      <p className="mt-1 text-[15px] leading-snug text-text">
        {state === 'install-first'
          ? 'En iPhone, los recordatorios llegan cuando la app está en tu pantalla de inicio. Instálala desde tu Perfil y actívalos ahí.'
          : 'Te aviso por la mañana con tu paso del día y por la noche para no perder tu racha. En tu horario, y puedes apagarlo cuando quieras.'}
      </p>
      {state === 'off' && (
        <button
          type="button"
          onClick={() => void turnOn()}
          disabled={busy}
          className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-[15.5px] font-semibold text-white shadow-card transition hover:brightness-110 disabled:opacity-60"
        >
          <Icon name="bell" className="size-5 text-gold-bright" />
          Sí, recuérdame
        </button>
      )}
    </div>
  )
}
