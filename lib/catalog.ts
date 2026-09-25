import type { IconName } from '@/components/icons'
import { WHATSAPP_URL } from './config'
import { COMIENZA_AQUI, GENESIS, TRANSFORMACION_DIA_1 } from './content/sample'
import { slugify } from './text'

// Every product in the app, in the order the member sees it. A product is a list of
// sections, a section is a list of lessons — the same shape for the chronological
// summary, the audio version and every bonus guide, so progress, checklist, streak
// and reflections work everywhere without special cases.
//
// `offer` is what unlocks a product: 'front' is the main purchase, 'upsell1' the audio
// version, 'upsell2' the Palabras del Señor guide (formerly "Hacedores de la Palabra",
// id kept) plus the bonuses its sales page lists. The other 9 bonuses come with
// 'front' ("+ 9 regalos especiales") — to move one, change that one field.

export type OfferId = 'front' | 'upsell1' | 'upsell2'
export type ProductKind = 'recorrido' | 'guia' | 'enlace'
export type LessonFormat = 'texto' | 'audio'

export interface LessonContent {
  fecha?: string
  autor?: string
  periodo?: string
  versiculo?: { texto: string; referencia: string }
  resumen?: string[]
  meditar?: string
  /** Plans: the small task of the day. */
  tarea?: string
  /** Plans: concrete steps to put the day's reading into practice. */
  practica?: string[]
}

export interface Lesson {
  id: string
  title: string
  format: LessonFormat
  audioSrc?: string
  content?: LessonContent
}

export interface Section {
  id: string
  title: string
  /** Label of the section's tab, when the product shows its sections as tabs. */
  tab?: string
  /**
   * A day-by-day plan: one day at a time — the next day opens the day after the
   * previous one was done (see planDayStatus in lib/progress.ts).
   */
  plan?: { goal: string }
  lessons: Lesson[]
}

export interface CoverStyle {
  from: string
  to: string
  glow: string
  lines: string[]
  highlight: string
  icon: IconName
}

export interface Product {
  id: string
  title: string
  short: string
  description: string
  kind: ProductKind
  offer: OfferId
  cover: CoverStyle
  sections: Section[]
  /** Only for kind 'enlace' (e.g. the WhatsApp group). */
  url?: string
  /** Show the sections as tabs (e.g. Palabras del Señor: the guide + its plans). */
  tabs?: boolean
}

export interface Offer {
  id: OfferId
  title: string
  /** How the offer is named in a short line: "Incluido en {short}". */
  short: string
  pitch: string
  /** Product whose cover represents the offer in the Tienda. */
  productId: string
}

// ─── Content that already exists, keyed by lesson id ───────────────

const SAMPLE_CONTENT: Record<string, LessonContent> = {
  'comienza-aqui': COMIENZA_AQUI,
  genesis: GENESIS,
  'transformacion-dia-1': TRANSFORMACION_DIA_1,
}

function lessons(titles: string[], format: LessonFormat): Lesson[] {
  return titles.map((title) => {
    const id = slugify(title)
    return { id, title, format, content: SAMPLE_CONTENT[id] }
  })
}

function numberedDays(count: number, format: LessonFormat): Lesson[] {
  return Array.from({ length: count }, (_, i) => ({ id: `dia-${i + 1}`, title: `Día ${i + 1}`, format }))
}

/** Days of a plan inside a product with several plans: ids carry the plan, so they never clash. */
function planDays(planId: string, count: number): Lesson[] {
  return Array.from({ length: count }, (_, i) => {
    const id = `${planId}-dia-${i + 1}`
    return { id, title: `Día ${i + 1}`, format: 'texto' as const, content: SAMPLE_CONTENT[id] }
  })
}

/** Guides whose inner structure is still to be defined: one entry to open them. */
function pendingGuide(format: LessonFormat = 'texto'): Section[] {
  return [{ id: 'contenido', title: 'Contenido', lessons: lessons(['Comienza aquí'], format) }]
}

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

function yearPlan(): Section[] {
  let day = 0
  return MONTHS.map((month, i) => ({
    id: slugify(month),
    title: month,
    lessons: Array.from({ length: MONTH_DAYS[i] }, () => {
      day += 1
      return { id: `dia-${day}`, title: `Día ${day}`, format: 'texto' as const }
    }),
  }))
}

// ─── Chronological order (as listed in the reference app) ──────────

const INTRO = ['Comienza aquí', 'Línea de tiempo', '¿Por qué la Biblia se divide en Antiguo y Nuevo Testamento?']

const OLD_TESTAMENT = [
  'Génesis', 'Job', 'Éxodo', 'Levítico', 'Números', 'Deuteronomio', 'Josué', 'Jueces', 'Rut',
  '1 Samuel', '2 Samuel', '1 Crónicas', 'Salmos', 'Proverbios', 'Eclesiastés', 'Cantares de Salomón',
  '1 Reyes 1-11', '2 Crónicas 1-9', 'Jonás', 'Amós', 'Oseas', 'Isaías', 'Miqueas', 'Nahúm', 'Sofonías',
  'Habacuc', 'Jeremías', 'Lamentaciones', 'Abdías', 'Ezequiel', 'Daniel', 'Esdras', 'Hageo', 'Zacarías',
  'Ester', 'Nehemías', 'Malaquías',
]

const NEW_TESTAMENT = [
  'Lucas 1-2', 'Mateo 1-2', 'Marcos 1', 'Juan 1', 'El ministerio de Jesús: una armonía de los evangelios',
  'Hechos de los Apóstoles', 'Santiago', 'Gálatas', '1 Tesalonicenses', '2 Tesalonicenses', '1 Corintios',
  '2 Corintios', 'Romanos', 'Efesios', 'Filipenses', 'Colosenses', 'Filemón', '1 Timoteo', 'Tito',
  '2 Timoteo', '1 Pedro', '2 Pedro', 'Hebreos', 'Judas', '1 Juan', '2 Juan', '3 Juan', 'Apocalipsis',
]

const COMMANDMENTS = [
  'No tendrás dioses ajenos', 'No te harás imagen', 'No tomarás el nombre de Dios en vano',
  'Acuérdate del día de reposo', 'Honra a tu padre y a tu madre', 'No matarás', 'No cometerás adulterio',
  'No hurtarás', 'No hablarás falso testimonio', 'No codiciarás',
]

// ─── Cover palettes: dark earthy grounds, one warm glow each ───────

const WARM = { from: '#2b2418', to: '#0c0a07', glow: 'rgba(255, 210, 130, 0.42)' }
const AMBER = { from: '#3b2512', to: '#110a05', glow: 'rgba(255, 176, 90, 0.45)' }
const DAWN = { from: '#22303b', to: '#0a1016', glow: 'rgba(170, 205, 255, 0.35)' }
const OLIVE = { from: '#28291a', to: '#0b0c07', glow: 'rgba(214, 220, 140, 0.32)' }
const ROSE = { from: '#35211f', to: '#100908', glow: 'rgba(255, 170, 150, 0.32)' }
const DUSK = { from: '#2a2233', to: '#0d0a12', glow: 'rgba(210, 180, 255, 0.30)' }

export const PRODUCTS: Product[] = [
  {
    id: 'cronologico',
    title: 'Resumen Cronológico de la Biblia',
    short: 'Los 66 libros en el orden en que sucedieron los acontecimientos, de forma visual y sencilla.',
    description: 'Recorre toda la historia bíblica en orden cronológico, desde la creación hasta la promesa de un cielo nuevo y una tierra nueva. Cada resumen trae la fecha aproximada, el autor, los personajes, un versículo clave y una explicación clara y fiel al texto.',
    kind: 'recorrido',
    offer: 'front',
    cover: { ...WARM, lines: ['Resumen', 'Cronológico', 'de la'], highlight: 'Biblia', icon: 'book' },
    sections: [
      { id: 'introduccion', title: 'Introducción', lessons: lessons(INTRO, 'texto') },
      { id: 'antiguo-testamento', title: 'Antiguo Testamento', lessons: lessons(['Índice del Antiguo Testamento', ...OLD_TESTAMENT], 'texto') },
      { id: 'nuevo-testamento', title: 'Nuevo Testamento', lessons: lessons(['Índice del Nuevo Testamento', ...NEW_TESTAMENT], 'texto') },
    ],
  },
  {
    id: 'cronologico-audio',
    title: 'Resumen Cronológico en Audio',
    short: 'Toda la historia bíblica narrada en orden, para escuchar mientras caminas, conduces o descansas.',
    description: 'La misma historia, en audio. Cada libro narrado en orden cronológico, con velocidad ajustable y la posición guardada para que continúes exactamente donde lo dejaste.',
    kind: 'recorrido',
    offer: 'upsell1',
    cover: { ...AMBER, lines: ['Resumen', 'Cronológico', 'en'], highlight: 'Audio', icon: 'headphones' },
    sections: [
      { id: 'introduccion', title: 'Introducción', lessons: lessons(['Comienza aquí', '¿Por qué la Biblia se divide en Antiguo y Nuevo Testamento?'], 'audio') },
      { id: 'antiguo-testamento', title: 'Antiguo Testamento', lessons: lessons(OLD_TESTAMENT, 'audio') },
      { id: 'nuevo-testamento', title: 'Nuevo Testamento', lessons: lessons(NEW_TESTAMENT, 'audio') },
    ],
  },
  {
    id: 'hacedores',
    title: 'Palabras del Señor',
    short: 'La guía práctica y tres planes de 90 días para vivir la Palabra, un día a la vez.',
    description: 'No es un libro teórico ni un devocional genérico. Es una guía práctica: frente a cada situación real de la vida, qué dice la Biblia y cómo aplicarlo, paso a paso. Y tres planes de 90 días, con una lectura, una minitarea y medidas prácticas para cada día.',
    kind: 'recorrido',
    offer: 'upsell2',
    cover: { ...DAWN, lines: ['Palabras', 'del'], highlight: 'Señor', icon: 'feather' },
    tabs: true,
    sections: [
      { id: 'guia', title: 'Guía Palabras del Señor', tab: 'Guía', lessons: lessons(['Cómo usar esta guía'], 'texto') },
      {
        id: 'transformacion',
        title: 'Plan de 90 días de Transformación Espiritual',
        tab: 'Transformación',
        plan: { goal: 'Renovar tu relación con Dios, un paso cada día.' },
        lessons: planDays('transformacion', 90),
      },
      {
        id: 'vivir-como-jesus',
        title: 'Plan de 90 días para aprender a vivir según la filosofía de Jesús',
        tab: 'Vivir como Jesús',
        plan: { goal: 'Llevar sus enseñanzas a tu día a día, paso a paso.' },
        lessons: planDays('vivir-como-jesus', 90),
      },
      {
        id: 'nueva-mentalidad',
        title: 'Plan de 90 días para cambiar tu mentalidad y convertirte en un verdadero cristiano',
        tab: 'Nueva mentalidad',
        plan: { goal: 'Renovar tu manera de pensar a la luz de la Palabra.' },
        lessons: planDays('nueva-mentalidad', 90),
      },
    ],
  },
  {
    id: 'plan-escucha',
    title: 'Plan de Escucha · 30 Días',
    short: 'Un audio por día durante un mes.',
    description: 'Treinta días para escuchar la Palabra con constancia, un paso por día.',
    kind: 'guia',
    offer: 'front',
    cover: { ...AMBER, lines: ['Plan de', 'Escucha'], highlight: '30 días', icon: 'headphones' },
    sections: [{ id: 'dias', title: '30 días', lessons: numberedDays(30, 'audio') }],
  },
  {
    id: 'caminando-gigantes',
    title: 'Biblioteca «Caminando con Gigantes»',
    short: 'Los grandes hombres y mujeres de la fe.',
    description: 'Una biblioteca con las vidas de quienes caminaron con Dios antes que nosotros.',
    kind: 'guia',
    offer: 'upsell2',
    cover: { ...OLIVE, lines: ['Caminando', 'con'], highlight: 'Gigantes', icon: 'users' },
    sections: pendingGuide(),
  },
  {
    id: 'mapas-mentales',
    title: 'Mapas Mentales de la Biblia',
    short: 'Cada libro en una sola imagen.',
    description: 'Mapas visuales para entender y recordar cada libro de un vistazo.',
    kind: 'guia',
    offer: 'front',
    cover: { ...DAWN, lines: ['Mentales'], highlight: 'Mapas', icon: 'map' },
    sections: pendingGuide(),
  },
  {
    id: 'biografias',
    title: 'Biografías de los Apóstoles y Personajes',
    short: 'Quiénes fueron y qué nos enseñan hoy.',
    description: 'La vida de los apóstoles y de los personajes clave de la Biblia.',
    kind: 'guia',
    offer: 'front',
    cover: { ...WARM, lines: ['Apóstoles y', 'personajes'], highlight: 'Biografías', icon: 'user' },
    sections: pendingGuide(),
  },
  {
    id: 'mandamientos',
    title: '10 Mandamientos Explicados',
    short: 'Cada mandamiento, su sentido y cómo vivirlo hoy.',
    description: 'Los Diez Mandamientos, uno por uno, explicados a la luz de toda la Escritura.',
    kind: 'guia',
    offer: 'front',
    cover: { ...OLIVE, lines: ['Mandamientos', 'explicados'], highlight: '10', icon: 'star' },
    sections: [{ id: 'mandamientos', title: 'Los Diez Mandamientos', lessons: lessons(COMMANDMENTS, 'texto') }],
  },
  {
    id: 'plan-365',
    title: 'Plan de Lectura de la Biblia en 365 Días',
    short: 'Toda la Biblia en un año, una porción por día.',
    description: 'Lee la Biblia completa en un año con una porción diaria, organizada por mes.',
    kind: 'guia',
    offer: 'front',
    cover: { ...WARM, lines: ['Plan de', 'lectura'], highlight: '365', icon: 'calendar' },
    sections: yearPlan(),
  },
  {
    id: 'mujeres-virtuosas',
    title: 'Mujeres Virtuosas de la Biblia',
    short: 'Mujeres de fe y lo que su historia nos enseña.',
    description: 'Las mujeres de la Biblia que marcaron la historia de la fe.',
    kind: 'guia',
    offer: 'front',
    cover: { ...ROSE, lines: ['Virtuosas', 'de la Biblia'], highlight: 'Mujeres', icon: 'heart' },
    sections: pendingGuide(),
  },
  {
    id: 'milagros-jesus',
    title: 'Los 43 Milagros de Jesús',
    short: 'Cada milagro y lo que revela de Él.',
    description: 'Los milagros de Jesús en los evangelios y lo que cada uno revela de Él.',
    kind: 'guia',
    offer: 'front',
    cover: { ...DUSK, lines: ['Milagros', 'de Jesús'], highlight: '43', icon: 'sparkles' },
    sections: pendingGuide(),
  },
  {
    id: 'actividades-ninos',
    title: 'Actividades Bíblicas para Niños',
    short: 'Para aprender la Biblia en familia.',
    description: 'Actividades para que los más pequeños conozcan las historias bíblicas jugando.',
    kind: 'guia',
    offer: 'front',
    cover: { ...OLIVE, lines: ['Actividades', 'bíblicas'], highlight: 'Niños', icon: 'gift' },
    sections: pendingGuide(),
  },
  {
    id: 'comunidad-whatsapp',
    title: 'Comunidad en WhatsApp',
    short: 'Oración y estudio junto a otros hermanos.',
    description: 'Únete al grupo de WhatsApp para orar, compartir y estudiar junto a otros hermanos.',
    kind: 'enlace',
    offer: 'front',
    cover: { ...DAWN, lines: ['en WhatsApp'], highlight: 'Comunidad', icon: 'message' },
    sections: [],
    url: WHATSAPP_URL,
  },
]

export const OFFERS: Offer[] = [
  {
    id: 'front',
    title: 'Resumen Cronológico de la Biblia',
    short: 'tu compra',
    pitch: 'Los 66 libros en orden cronológico y 9 regalos especiales.',
    productId: 'cronologico',
  },
  {
    id: 'upsell1',
    title: 'Resumen Cronológico en Audio',
    short: 'Audio Premium',
    pitch: 'Escucha toda la historia bíblica en orden mientras caminas, conduces o descansas.',
    productId: 'cronologico-audio',
  },
  {
    id: 'upsell2',
    title: 'Palabras del Señor',
    short: 'Palabras del Señor',
    pitch: 'Más de 100 situaciones reales de la vida con la respuesta bíblica aplicada paso a paso.',
    productId: 'hacedores',
  },
]

export function productById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}

export function offerById(id: OfferId): Offer {
  return OFFERS.find((o) => o.id === id) ?? OFFERS[0]
}
