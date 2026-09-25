// Brand, prices and external links. Anything a non-developer may want to change
// lives here or in the environment (.env.example), never inside a component.

export const APP = {
  name: 'La Biblia Interior',
  tagline: 'Toda la historia de la Biblia, en orden y en comunidad',
  supportEmail: 'contact@innerbible.app',
} as const

export const WHATSAPP_URL = process.env.NEXT_PUBLIC_WHATSAPP_URL || ''

/** KashPay checkout links (Stripe underneath). Empty → the button reads "Disponible pronto". */
export const CHECKOUT_URLS: Record<'upsell1' | 'upsell2', string> = {
  upsell1: process.env.NEXT_PUBLIC_CHECKOUT_UPSELL1_URL || '',
  upsell2: process.env.NEXT_PUBLIC_CHECKOUT_UPSELL2_URL || '',
}

/** Price labels exactly as they should read in the Tienda. Empty → no price line. */
export const OFFER_PRICES: Record<'upsell1' | 'upsell2', string> = {
  upsell1: process.env.NEXT_PUBLIC_PRICE_UPSELL1 || '',
  upsell2: process.env.NEXT_PUBLIC_PRICE_UPSELL2 || '',
}

// Accounts that see every offer unlocked (the owner). Kept as hashes (cyrb53 of the
// lowercase e-mail) so the addresses never appear in the site's public code.
// Temporary, until access comes from the KashPay purchases on the backend.
const FULL_ACCESS = new Set(['1re1mulvdxk'])

function cyrb53(text: string): string {
  let h1 = 0xdeadbeef
  let h2 = 0x41c6ce57
  for (let i = 0; i < text.length; i++) {
    const ch = text.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507)
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507)
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36)
}

export function hasFullAccess(email: string): boolean {
  return FULL_ACCESS.has(cyrb53(email.trim().toLowerCase()))
}

/** Tu Consejero Bíblico (included in upsell 2, Palabras del Señor). */
export const CONSEJERO = {
  dailyLimit: 30,
  /** In-app offer for members without upsell 2: half price for life, for a limited time. */
  offerDays: 15,
  fullPrice: 9.9,
  discountPrice: 4.95,
  /** KashPay checkout "Palabras del Señor 50%" (US$ 4,95/mes): a normal checkout, not a /u/ link. */
  checkoutUrl: process.env.NEXT_PUBLIC_CHECKOUT_CONSEJERO_URL || 'https://checkout.kashpay.com.br/checkout/checkout-1790363235240',
  /** Full-price checkout (US$ 9,90/mes), used once the member's 15 days are over. Empty → "Disponible pronto". */
  fullCheckoutUrl: process.env.NEXT_PUBLIC_CHECKOUT_UPSELL2_URL || '',
} as const

/** What each action is worth. Shown to members, so keep it simple. */
export const POINTS = { lesson: 10, reflection: 5, post: 3 } as const

/** Demo panel (unlock offers, reset progress): always in dev, opt-in on a deployed build. */
export const DEMO_MODE =
  process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_DEMO_MODE === '1'
