// Sales funnel settings: checkout links, prices, Pixel and the VSL of each page.
// All public values (they end up in the browser anyway), set on Vercel so they can
// change without a code change. See .env.example.
//
// Pages, in order (each its own URL, so every step shows up on its own in the stats):
//   /quiz → KashPay checkout (front) → /upsell ─accept→ /palabras-del-senor
//                                           └decline→ /upsell-downsell → /palabras-del-senor
//   /palabras-del-senor ─accept→ /bienvenido
//                       └decline→ /palabras-del-senor-downsell → /bienvenido
// After an accepted one-click, KashPay itself redirects to the next page (set the
// redirect of each upsell in KashPay); declining is a plain link on our pages.

/** Empty or missing variable → fallback. (An empty string must not become 0.) */
function num(raw: string | undefined, fallback: number): number {
  if (raw === undefined || raw.trim() === '') return fallback
  const n = Number(raw.replace(',', '.'))
  return Number.isFinite(n) && n >= 0 ? n : fallback
}

export interface VslConfig {
  /** VTurb player id, e.g. "vid-64f0c0…" (from the embed code). Empty → no video. */
  playerId: string
  /** VTurb player script URL (from the embed code). */
  scriptUrl: string
  /** Second of the video at which the offer appears. 0 → shown at once. */
  delaySeconds: number
}

export interface OneClickOffer {
  /** KashPay one-click upsell link (checkout.kashpay.com.br/u/…). */
  checkoutUrl: string
  price: number
  /** Crossed-out price (downsells: the upsell price). 0 → none. */
  priceFrom: number
  video: VslConfig
}

const noVideo = (id?: string, script?: string, delay?: string): VslConfig => ({
  playerId: id || '',
  scriptUrl: script || '',
  delaySeconds: num(delay, 0),
})

export const FUNNEL = {
  pixelId: process.env.NEXT_PUBLIC_FUNNEL_PIXEL_ID || '1734156964506551',
  currency: 'USD',
  front: {
    checkoutUrl: process.env.NEXT_PUBLIC_CHECKOUT_FRONT_URL || 'https://checkout.kashpay.com.br/checkout/checkout-1790282470977',
    /** Monthly subscription. */
    price: num(process.env.NEXT_PUBLIC_PRICE_FRONT, 17.9),
    /** Crossed-out "was" price. 0 → no anchor shown (never invent one). */
    priceFrom: num(process.env.NEXT_PUBLIC_PRICE_FRONT_FROM, 188),
    // Owner's VTurb player "Resumen Cronológico de la Biblia". The offer appears at
    // 10:15 (615 s), when the video reaches the price.
    video: {
      playerId: process.env.NEXT_PUBLIC_VTURB_FRONT_ID || 'vid-6ab58aff91c2cea332a2396c',
      scriptUrl:
        process.env.NEXT_PUBLIC_VTURB_FRONT_SCRIPT ||
        'https://scripts.converteai.net/90eef771-3dd8-46c8-b5b3-3c5b48ea076b/players/6ab58aff91c2cea332a2396c/v4/player.js',
      delaySeconds: num(process.env.NEXT_PUBLIC_VTURB_FRONT_DELAY, 615),
    } satisfies VslConfig,
  },
  /** Upsell 1 — Resumen Cronológico en Audio. */
  up1: {
    // Link of the "Upsell 1" step of the KashPay flow "palabra". The link belongs to the
    // step: whatever product/price is chosen in that step is what gets charged — it
    // is "Cronología Bíblica En Audio" at US$4,90/month (it was "20 parábolas", US$37).
    checkoutUrl: process.env.NEXT_PUBLIC_KASHPAY_UP1_URL || 'https://checkout.kashpay.com.br/u/3b7c5fb39b1a3127',
    price: num(process.env.NEXT_PUBLIC_PRICE_UP1, 4.9),
    priceFrom: 0,
    video: noVideo(process.env.NEXT_PUBLIC_VTURB_UP1_ID, process.env.NEXT_PUBLIC_VTURB_UP1_SCRIPT, process.env.NEXT_PUBLIC_VTURB_UP1_DELAY),
  } satisfies OneClickOffer,
  /** Downsell of upsell 1 — the audio at half price. */
  down1: {
    // Downsell step of "Upsell 1" in the KashPay flow.
    checkoutUrl: process.env.NEXT_PUBLIC_KASHPAY_DOWN1_URL || 'https://checkout.kashpay.com.br/u/73fdbe235dce3d10',
    price: num(process.env.NEXT_PUBLIC_PRICE_DOWN1, 2.45),
    priceFrom: num(process.env.NEXT_PUBLIC_PRICE_UP1, 4.9),
    video: noVideo(),
  } satisfies OneClickOffer,
  /** Upsell 2 — Palabras del Señor. */
  up2: {
    // Second step of the same flow: must be "Palabras del Señor" at US$27 (it was
    // "Devocional en Familia", US$49).
    checkoutUrl: process.env.NEXT_PUBLIC_KASHPAY_UP2_URL || 'https://checkout.kashpay.com.br/u/df227ca0ddefadfe',
    // Monthly subscription, as set in the KashPay step.
    price: num(process.env.NEXT_PUBLIC_PRICE_UP2, 9.9),
    priceFrom: 0,
    video: noVideo(process.env.NEXT_PUBLIC_VTURB_UP2_ID, process.env.NEXT_PUBLIC_VTURB_UP2_SCRIPT, process.env.NEXT_PUBLIC_VTURB_UP2_DELAY),
  } satisfies OneClickOffer,
  /** Downsell of upsell 2 — about half price, monthly. */
  down2: {
    // Downsell step of "Upsell 2" in the KashPay flow.
    checkoutUrl: process.env.NEXT_PUBLIC_KASHPAY_DOWN2_URL || 'https://checkout.kashpay.com.br/u/b5a5b4606ae0bcfa',
    price: num(process.env.NEXT_PUBLIC_PRICE_DOWN2, 4.95),
    priceFrom: num(process.env.NEXT_PUBLIC_PRICE_UP2, 9.9),
    video: noVideo(),
  } satisfies OneClickOffer,
} as const

export type OneClickStep = 'up1' | 'down1' | 'up2' | 'down2'

export function formatUsd(value: number): string {
  return `US$ ${value.toFixed(2)}`
}
