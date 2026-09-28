// Schema of the "Estudio Cronológico de la Biblia".
//
// One source of truth for three consumers:
//   - the app (types for the lesson reader, the book cards and the master table);
//   - the writers (every limit below is an editorial rule, see content-src/estudio/estilo.md);
//   - the validator (content-src/estudio/validar.mjs imports LIMITES and the enums from here,
//     so a limit changes in one place only).
//
// This file must stay "erasable TypeScript" (types, interfaces and `as const` objects only,
// no enums or namespaces): Node runs it directly when the validator imports it.

// ─── Enums ──────────────────────────────────────────────────────────

/** Sections of the study, in order: the 11 eras plus the introduction and the conclusion. */
export const SECCIONES = [
  'introduccion',
  'comienzos',
  'patriarcas',
  'exodo',
  'conquista',
  'reino-unido',
  'reino-dividido',
  'exilio',
  'regreso',
  'entre-testamentos',
  'jesus',
  'iglesia',
  'conclusion',
] as const
export type SeccionId = (typeof SECCIONES)[number]

/** The 11 eras proper (sections that have a map and a color). */
export const ERAS = SECCIONES.filter((s) => s !== 'introduccion' && s !== 'conclusion') as Exclude<SeccionId, 'introduccion' | 'conclusion'>[]
export type EraId = Exclude<SeccionId, 'introduccion' | 'conclusion'>

export const CERTEZAS = ['aprox', 'debatida', 'incierta'] as const
export type Certeza = (typeof CERTEZAS)[number]

/**
 * How much text a lesson carries.
 * - completo: the normal lesson (resumen 220–380 words).
 * - breve: books of 1–3 chapters (resumen 120–200 words).
 * - marco: introduction and conclusion (no characters/events/quiz required).
 */
export const FORMATOS = ['completo', 'breve', 'marco'] as const
export type FormatoLeccion = (typeof FORMATOS)[number]

export const NIVELES_QUIZ = ['facil', 'media', 'conexion'] as const
export type NivelQuiz = (typeof NIVELES_QUIZ)[number]

export const GRUPOS_LIBRO = ['ley', 'historia', 'poesia', 'profetas', 'evangelios', 'hechos', 'cartas', 'profecia'] as const
export type GrupoLibro = (typeof GRUPOS_LIBRO)[number]

// ─── Limits (words unless the name says otherwise) ─────────────────

export const LIMITES = {
  /** Every sentence we write, in every field. */
  fraseMax: 20,
  titulo: 8,
  pasajes: { min: 1, max: 6 },
  enUnMinuto: { frases: 3, total: 60 },
  versiculo: 40,
  fecha: { texto: 12, nota: 30 },
  autor: { texto: 15, nota: 25 },
  lugar: 6,
  personajes: { min: 3, max: 7, linea: 12 },
  eventos: { min: 3, max: 6, texto: 10 },
  resumen: {
    min: 3,
    max: 6,
    subtitulo: 5,
    texto: 60,
    total: { completo: [220, 380], breve: [120, 200], marco: [80, 380] } as Record<FormatoLeccion, [number, number]>,
  },
  jesusAqui: { texto: 60, refs: { min: 1, max: 2 } },
  mundo: 40,
  antesDespues: 20,
  conexiones: { min: 2, max: 4, motivo: 15 },
  glosario: { min: 2, max: 5 },
  paraTuVida: 40,
  meditar: 30,
  ninos: 20,
  quiz: { preguntas: 3, opciones: 3, pregunta: 18, opcion: 8, explicacion: 20 },
  notaEcumenica: 40,
  otraMirada: { max: 4, texto: 30 },
  temas: { min: 3, max: 6 },
  cadenas: { min: 1, max: 2 },
  /** Reading speed used to estimate `leer.minutos` (words of RV1909 per minute). */
  palabrasPorMinuto: 140,
  /** Master table, glossary and characters. */
  maestra: { titulo: 8 },
  glosarioDefinicion: 20,
  personajeLinea: 12,
  libro: { proposito: 30, estructura: { min: 3, max: 6, parte: 8 } },
} as const

// ─── Shared pieces ──────────────────────────────────────────────────

/**
 * A date with its degree of certainty. Years are numbers: negative = a.C., positive = d.C.
 * (there is no year 0). `desde`/`hasta` are null only when the Bible gives no date at all
 * (creation, "before time"); then `certeza` is 'incierta' and `texto` says so.
 */
export interface Fecha {
  /** What the reader sees: "c. 2100–1800 a.C." (≤ 12 words). */
  texto: string
  desde: number | null
  hasta: number | null
  certeza: Certeza
  /** One line when the date is debated or needs context (≤ 30 words). */
  nota?: string
}

/** A range of verses in OSIS: "Gen.12.1-Gen.50.26" or a single verse "Gen.22.8". */
export type PasajeOsis = string

/** A reference as the reader sees it: "Génesis 22:8", "Juan 19:28-30", "Salmos 22". */
export type ReferenciaEs = string

// ─── Master table (content-src/estudio/maestra.json) ───────────────

export interface Era {
  id: SeccionId
  /** 'era' = one of the 11 eras; 'marco' = introduction or conclusion. */
  tipo: 'era' | 'marco'
  titulo: string
  /** Date range as the reader sees it, or null for the frame sections. */
  fechas: string | null
  desde: number | null
  hasta: number | null
  /** One sentence that sums up the era. */
  frase: string
}

export interface EntradaMaestra {
  /** Stable slug. Never change it after launch: progress and chains point to it. */
  id: string
  /** Position in the story, 1..N. */
  orden: number
  seccion: SeccionId
  titulo: string
  /** Short label of what is read: "Génesis 12–50", "2 Reyes 18–21 + 2 Crónicas 29–33". */
  rotulo: string
  formato: FormatoLeccion
  pasajes: PasajeOsis[]
  /** OSIS ids of the books whose card opens in this lesson (each of the 66 appears once). */
  libros: string[]
  /** null only for the introduction and the conclusion. */
  fecha: Fecha | null
  /** Whether `fecha` dates the events (history, gospels, Acts) or the writing (letters). */
  fechaDe: 'hechos' | 'escritura' | null
  anterior: string | null
  siguiente: string | null
}

export interface Maestra {
  version: number
  fuentes: string[]
  eras: Era[]
  lecciones: EntradaMaestra[]
}

// ─── Lesson (content-src/estudio/lecciones/<id>.json) ──────────────

export interface Versiculo {
  /** Exact RV1909 text with modernized accents ("á su Hijo" → "a su Hijo"). */
  texto: string
  referencia: ReferenciaEs
  version: 'RV1909'
  /** Optional RVR1960 text of the same verse (1 verse max, shown with its © note). */
  rvr1960?: string
}

export interface PersonajeEnLeccion {
  /** id in content-src/estudio/personajes.json */
  id: string
  nombre: string
  /** Who they are and why they matter here (≤ 12 words). */
  linea: string
}

export interface Evento {
  texto: string
  ref: ReferenciaEs
}

export interface Momento {
  subtitulo: string
  texto: string
}

export interface Conexion {
  /** Must be a real cross-reference (OpenBible) of a verse of the lesson. */
  ref: ReferenciaEs
  motivo: string
}

export interface PreguntaQuiz {
  pregunta: string
  opciones: [string, string, string]
  /** Index of the right option (0, 1 or 2). */
  correcta: 0 | 1 | 2
  explicacion: string
  /** One of each per lesson: an easy one, a medium one and a "connection" one. */
  nivel: NivelQuiz
}

export interface Leccion {
  id: string
  orden: number
  seccion: SeccionId
  formato: FormatoLeccion
  titulo: string
  pasajes: PasajeOsis[]
  libros: string[]

  /** Level 1: exactly 3 sentences — what happens, the key point, what God reveals. */
  enUnMinuto: [string, string, string]
  versiculo: Versiculo
  /** Copied from the master table, never rewritten by hand. */
  fecha: Fecha | null
  /** For lessons that open a book: when it was written. */
  fechaEscrito?: Fecha
  autor?: { texto: string; nota?: string }
  lugar: { nombre: string; mapa: SeccionId }

  personajes: PersonajeEnLeccion[]
  eventos: Evento[]
  resumen: Momento[]
  /** "Jesús en esta parte de la historia": promise, figure or fulfilment + 1–2 refs. */
  jesusAqui: { texto: string; refs: ReferenciaEs[] }
  /** "Mientras tanto en el mundo…" */
  mundo: string
  antes: string
  despues: string
  conexiones: Conexion[]
  /** ids in content-src/estudio/glosario.json */
  glosario: string[]
  paraTuVida: { aplicacion: string; pregunta: string }
  /** A short first-person prayer. */
  meditar: string
  ninos: { pregunta: string; actividad: string }
  quiz: [PreguntaQuiz, PreguntaQuiz, PreguntaQuiz]
  /** Key chapters to read in RV1909 (OSIS "Gen.22") and the estimated minutes. */
  leer: { capitulos: string[]; minutos: number }
  /** "Otra mirada": what each parallel book adds (Samuel × Crónicas, the four Gospels). */
  otraMirada?: { /** OSIS id of the parallel book ("Matt", "1Chr"). */ libro: string; texto: string }[]
  notaEcumenica?: string
  /** 3–6 theme slugs for the cross-study search. */
  temas: string[]
  /** 1–2 chain ids for "Sigue el hilo". */
  cadenas: string[]
}

// ─── Book card (66 records, separate from the lessons) ─────────────

export interface FichaLibro {
  /** OSIS id: "Gen", "1Kgs", "Rev". */
  id: string
  nombre: string
  testamento: 'AT' | 'NT'
  grupo: GrupoLibro
  capitulos: number
  fechaEscrito: Fecha
  autor: { texto: string; nota?: string }
  /** New Testament: who received it. */
  destinatarios?: string
  /** ≤ 30 words. */
  proposito: string
  /** 3–6 parts, each ≤ 8 words, with its chapters ("1–11"). */
  estructura: { parte: string; capitulos: string }[]
  /** Lesson ids where the book is read; the first one opens the card. */
  lecciones: string[]
}

// ─── Glossary and characters (seeds) ────────────────────────────────

export interface TerminoGlosario {
  id: string
  termino: string
  /** ≤ 20 words, for a lay reader. */
  definicion: string
}

export interface PersonajeGlobal {
  id: string
  /** Modern spelling (RVR1960): "Jonatán", "Ezequías". */
  nombre: string
  /** Spelling in the RV1909 text when it differs ("Jonathán", "Ezechîas"), for search and the reader. */
  rv1909?: string
  /** ≤ 12 words. */
  linea: string
  /** Lesson ids where the character appears, in story order. */
  lecciones: string[]
}
