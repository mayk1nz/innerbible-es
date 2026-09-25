'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import { VturbPlayer } from './VturbPlayer'
import { BrandMark, buttonClass } from '../ui'
import { APP } from '@/lib/config'
import { FUNNEL, formatUsd } from '@/lib/funnel/config'
import { initPixel, trackCheckout, withAttribution } from '@/lib/funnel/tracking'

// One-click upsell after the main purchase. KashPay's upsell processor charges the
// card from the purchase that brought the buyer here; this page never sees payment
// data and never decides whether a payment happened — KashPay does, and redirects.

declare global {
  interface Window {
    acceptUpsell?: (url: string) => Promise<unknown>
  }
}

const PROCESSOR = 'https://checkout.kashpay.com.br/scripts/upsell-processor.js'

let processor: Promise<void> | null = null

function loadProcessor(): Promise<void> {
  if (typeof window.acceptUpsell === 'function') return Promise.resolve()
  if (processor) return processor
  processor = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    const timer = window.setTimeout(() => reject(new Error('timeout')), 15_000)
    script.src = PROCESSOR
    script.async = true
    script.onload = () => {
      window.clearTimeout(timer)
      if (typeof window.acceptUpsell === 'function') resolve()
      else reject(new Error('unavailable'))
    }
    script.onerror = () => {
      window.clearTimeout(timer)
      reject(new Error('load-failed'))
    }
    document.head.appendChild(script)
  }).catch((err: unknown) => {
    processor = null
    throw err
  })
  return processor
}

/** Only KashPay one-click links (https://checkout.kashpay.com.br/u/…) are accepted. */
function validUpsellUrl(raw: string): string | null {
  try {
    const url = new URL(raw)
    if (url.protocol !== 'https:' || url.hostname !== 'checkout.kashpay.com.br' || !url.pathname.startsWith('/u/')) return null
    return url.href
  } catch {
    return null
  }
}

const COPY = {
  up1: {
    product: 'resumen-cronologico-audio',
    eyebrow: '¡Espera! Tu pedido aún no está completo',
    title: 'Escucha toda la historia de la Biblia',
    text: 'Añade el Resumen Cronológico en Audio y recorre toda la Biblia en orden mientras caminas, conduces o descansas.',
    accept: 'Sí, quiero añadir el audio',
    decline: 'No, gracias. Continuar sin el audio',
    next: '/up2',
  },
  up2: {
    product: 'guia-hacedores',
    eyebrow: 'Un último paso',
    title: 'De entender la Palabra a vivirla',
    text: 'La Guía Hacedores de la Palabra: más de 100 situaciones reales de la vida con la respuesta bíblica aplicada paso a paso.',
    accept: 'Sí, quiero la guía',
    decline: 'No, gracias. Ir a mi acceso',
    next: '/bienvenido',
  },
} as const

const subscribeNothing = () => () => {}

export function UpsellPage({ offer }: { offer: 'up1' | 'up2' }) {
  const copy = COPY[offer]
  const config = FUNNEL[offer]
  const search = useSyncExternalStore(subscribeNothing, () => window.location.search, () => '')
  const [revealed, setRevealed] = useState(false)
  const reveal = useCallback(() => setRevealed(true), [])
  const [state, setState] = useState<'idle' | 'working' | 'sent' | 'error'>('idle')
  const checkout = validUpsellUrl(config.checkoutUrl)
  const available = Boolean(checkout) && config.price > 0

  useEffect(() => {
    initPixel()
  }, [])

  const accept = async () => {
    if (!checkout || state === 'working' || state === 'sent') return
    setState('working')
    trackCheckout(copy.product, config.price)
    try {
      await loadProcessor()
    } catch {
      setState('error')
      return
    }
    // Once the payment request is sent, never retry automatically: the gateway owns
    // the result and the redirect that follows it.
    setState('sent')
    try {
      await window.acceptUpsell?.(withAttribution(checkout, search))
    } catch {
      // KashPay reports the outcome on its own confirmation.
    }
  }

  return (
    <div className="mx-auto min-h-dvh w-full max-w-[480px] px-5 pb-16 pt-[max(env(safe-area-inset-top),20px)]">
      <header className="mb-6 flex items-center justify-center gap-2.5">
        <BrandMark />
        <span className="font-serif text-[19px] font-semibold text-ink">{APP.name}</span>
      </header>

      <p className="text-center text-[13px] font-semibold uppercase tracking-[0.1em] text-flame">{copy.eyebrow}</p>
      <h1 className="mt-2 text-center font-serif text-[28px] font-semibold leading-tight text-balance text-ink">{copy.title}</h1>
      <p className="mx-auto mt-3 max-w-sm text-center text-[16.5px] leading-relaxed text-text">{copy.text}</p>

      <div className="mt-6">
        <VturbPlayer video={config.video} onReveal={reveal} />
      </div>

      {revealed && (
        <div className="animate-rise mt-6 rounded-3xl border-2 border-gold-bright bg-surface p-5 text-center shadow-card">
          {available ? (
            <>
              <p className="font-serif text-[34px] font-bold text-ink">{formatUsd(config.price)}</p>
              <button
                type="button"
                onClick={accept}
                disabled={state === 'working' || state === 'sent'}
                aria-busy={state === 'working'}
                className={`${buttonClass.primary} mt-3 min-h-14 text-[17px]`}
              >
                {state === 'working' ? 'Conectando con el pago…' : state === 'sent' ? 'Procesando tu pedido…' : copy.accept}
              </button>
              <p className="mt-3 text-[14px] leading-snug text-muted">
                Se añade a tu compra con el mismo método de pago, sin volver a escribir tus datos.
              </p>
              {state === 'error' && (
                <p role="alert" className="mt-3 text-[14.5px] font-medium text-danger">
                  No pudimos conectar con el pago. No se cobró nada: inténtalo de nuevo en un momento.
                </p>
              )}
              {state === 'sent' && (
                <p role="status" className="mt-3 text-[14.5px] text-text">
                  Si esta página no cambia en unos segundos, revisa tu correo de confirmación antes de intentarlo otra vez.
                </p>
              )}
            </>
          ) : (
            <p className="text-[15.5px] text-text">Esta oferta no está disponible en este momento.</p>
          )}
        </div>
      )}

      <Link href={`${copy.next}${search}`} className="mt-5 block py-3 text-center text-[15px] text-muted underline underline-offset-4 hover:text-ink">
        {copy.decline}
      </Link>
    </div>
  )
}
