// One format for the gifts written as lessons ("fichas"): 10 Mandamientos, 43 Milagros,
// Mujeres Virtuosas, Biografías. Each file content-src/guias/<guia>/lecciones/<id>.json is a
// GuiaLeccion; the app shows every guide with the same reader (levels "En 1 minuto" and
// "Completo", blocks, quiz), so all of them look and behave alike.
//
// Erasable TypeScript only (types + `as const`): the validator imports LIMITES_GUIA directly.

export const GUIAS = ['mandamientos', 'milagros-jesus', 'mujeres-virtuosas', 'biografias'] as const
export type GuiaId = (typeof GUIAS)[number]

export const LIMITES_GUIA = {
  /** Words per sentence in every text we write. */
  fraseMax: 22,
  titulo: 10,
  subtitulo: 14,
  etiquetas: { max: 4, palabras: 8 },
  enUnMinuto: { min: 2, max: 3, total: 70 },
  versiculo: 45,
  bloques: { min: 3, max: 12 },
  parrafo: 90,
  item: 40,
  destacado: 90,
  oracion: 45,
  nota: 60,
  quiz: { preguntas: 3, opciones: 3, pregunta: 18, opcion: 10, explicacion: 25 },
  /** Total words we write in one lesson. */
  total: { min: 350, max: 1700 },
} as const

export interface Versiculo {
  /** Exact Reina-Valera 1909 text (modernized accents), as in public/biblia. */
  texto: string
  /** "Juan 2:11" or "Juan 2:1-11". */
  referencia: string
}

export type Bloque =
  /** Running text: the story, the meaning. */
  | { tipo: 'texto'; titulo: string; parrafos: string[] }
  /** Bullet points. */
  | { tipo: 'lista'; titulo: string; items: string[] }
  /** Numbered steps (practice for the week, a sequence of events). */
  | { tipo: 'pasos'; titulo: string; items: string[] }
  /** Bible references, each one opens the in-app Bible. */
  | { tipo: 'referencias'; titulo: string; items: { ref: string; nota?: string }[] }
  /** A card that stands out: "Jesús en esta historia", "Para tu vida hoy". */
  | { tipo: 'destacado'; titulo: string; texto: string; tono?: 'navy' | 'gold' }
  /** A short first-person prayer. */
  | { tipo: 'oracion'; texto: string }
  /** For children (read by an adult): a question and, optionally, an activity. */
  | { tipo: 'ninos'; texto: string; actividad?: string }
  /** What the Bible says vs what tradition tells (biographies), both respectfully. */
  | { tipo: 'biblia-tradicion'; biblia: string[]; tradicion: string[] }
  /** A neutral note (ecumenical, dating, numbering). */
  | { tipo: 'nota'; texto: string }
  /** For groups (cells, women's groups): questions to talk about. */
  | { tipo: 'grupo'; titulo: string; items: string[] }

export interface PreguntaGuia {
  pregunta: string
  opciones: [string, string, string]
  correcta: 0 | 1 | 2
  explicacion: string
}

export interface GuiaLeccion {
  id: string
  titulo: string
  /** Second line: "Ruth, la moabita", "Evangélico: 5.º · Católico: 4.º". */
  subtitulo?: string
  /** Small chips: era, place, category. */
  etiquetas?: string[]
  /** Level 1: 2–3 sentences. */
  enUnMinuto: string[]
  versiculo?: Versiculo
  bloques: Bloque[]
  quiz?: [PreguntaGuia, PreguntaGuia, PreguntaGuia]
  /** Related lessons of the Estudio Cronológico (ids from maestra.json). */
  estudio?: string[]
  /** What "Sigue el hilo" searches in the Guía de Estudio ("Rut", "Juan 2:1-11"). */
  buscar?: string
}

/** content-src/guias/<guia>/indice.json: the sections and the order of the lessons. */
export interface GuiaIndice {
  guia: GuiaId
  secciones: { id: string; titulo: string; lecciones: { id: string; titulo: string; subtitulo?: string }[] }[]
}
