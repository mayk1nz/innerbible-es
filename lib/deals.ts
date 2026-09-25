import type { OfferId } from './catalog'

// The in-app offers for what a member has not bought yet: 50% off for life during the
// member's own first 15 days (the clock starts on their first login and is kept on the
// server, so it is the same on every device), then the normal price. Every price and
// link lives here; the Tienda, the locked pages and the Consejero all read from it.

export type UpsellId = Exclude<OfferId, 'front'>

export interface Deal {
  fullPrice: number
  discountPrice: number
  /** KashPay checkout at 50% (normal checkout, not a /u/ one-click link). Empty → "Disponible muy pronto". */
  discountUrl: string
  /** KashPay checkout at the full price, once the 15 days are over. */
  fullUrl: string
  /** Everything the member receives, in the order it is sold. */
  benefits: string[]
  note?: string
}

export const DEAL_DAYS = 15

export const DEALS: Record<UpsellId, Deal> = {
  upsell1: {
    fullPrice: 4.9,
    discountPrice: 2.45,
    discountUrl: process.env.NEXT_PUBLIC_CHECKOUT_UPSELL1_DISCOUNT_URL || '',
    fullUrl: process.env.NEXT_PUBLIC_CHECKOUT_UPSELL1_URL || '',
    benefits: [
      '67 audios: la introducción y toda la historia bíblica narrada en orden cronológico',
      'Antiguo Testamento: 37 audios, de Génesis a Malaquías',
      'Nuevo Testamento: 28 audios, de los evangelios al Apocalipsis',
      'Escucha mientras caminas, conduces, trabajas o descansas',
      'Velocidad ajustable, de 0.75x a 2x, y botones para adelantar o volver 15 segundos',
      'Continúa exactamente donde lo dejaste, en cada audio',
      'Cada audio escuchado suma puntos y mantiene tu racha',
    ],
  },
  upsell2: {
    fullPrice: 9.9,
    discountPrice: 4.95,
    discountUrl: process.env.NEXT_PUBLIC_CHECKOUT_CONSEJERO_URL || 'https://checkout.kashpay.com.br/checkout/checkout-1790363235240',
    fullUrl: process.env.NEXT_PUBLIC_CHECKOUT_UPSELL2_URL || 'https://checkout.kashpay.com.br/checkout/checkout-1790361317561',
    benefits: [
      'Tu Consejero Bíblico: hasta 30 conversaciones al día, con técnicas y pasos prácticos para lo que estás viviendo',
      'Plan de 90 días de Transformación Espiritual',
      'Plan de 90 días para aprender a vivir según la filosofía de Jesús',
      'Plan de 90 días para cambiar tu mentalidad y convertirte en un verdadero cristiano',
      '270 días en total: cada uno con una lectura, un versículo, una minitarea y pasos prácticos',
      'La Guía Palabras del Señor: qué dice la Biblia frente a cada situación de la vida',
      'Biblioteca «Caminando con Gigantes»: los grandes hombres y mujeres de la fe',
    ],
    note: 'Garantía incondicional de 30 días.',
  },
}

export interface DealState {
  /** Still inside the member's 15 days. */
  active: boolean
  deadline: number
  price: number
  url: string
}

/** `now` 0 (server / before hydration) counts as "just started". */
export function dealState(offer: UpsellId, offerStartedAt: string | null, now: number): DealState {
  const deal = DEALS[offer]
  const started = offerStartedAt ? Date.parse(offerStartedAt) : now || Date.now()
  const deadline = started + DEAL_DAYS * 86_400_000
  const inWindow = !now || now < deadline
  // Only the full-price link exists: sell at full price rather than show a 50% nobody can buy.
  const active = inWindow && !(deal.fullUrl && !deal.discountUrl)
  return { active, deadline, price: active ? deal.discountPrice : deal.fullPrice, url: active ? deal.discountUrl : deal.fullUrl }
}

/** Pre-fill the member's e-mail: access is granted by the purchase e-mail. */
export function withEmail(url: string, email?: string): string {
  if (!url || !email) return url
  return `${url}${url.includes('?') ? '&' : '?'}email=${encodeURIComponent(email)}`
}
