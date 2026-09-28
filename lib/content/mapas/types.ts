// Mapas Mentales de la Biblia (regalo 1): one JSON per map (content-src/mapas/mapas/<id>.json),
// drawn by the app as a tree you open with a tap (not an image), with a mode for children.
// Erasable TypeScript only: the validator imports LIMITES_MAPA directly.

export const COLORES_RAMA = ['warm', 'amber', 'dawn', 'olive', 'rose', 'dusk'] as const
export type ColorRama = (typeof COLORES_RAMA)[number]

export const TIPOS_HOJA = ['evento', 'persona', 'lugar', 'ensenanza', 'promesa'] as const
export type TipoHoja = (typeof TIPOS_HOJA)[number]

export const LIMITES_MAPA = {
  fraseMax: 22,
  titulo: 6,
  subtitulo: 8,
  centro: 14,
  centroNino: 12,
  ramas: { min: 4, max: 6, titulo: 5, resumen: 32, resumenNino: 16 },
  hojas: { min: 2, max: 4, titulo: 6, texto: 32, textoNino: 16 },
  versiculo: 45,
  cristo: 50,
  paraTuVida: { min: 1, max: 3, paso: 22 },
  preguntas: 3,
} as const

export interface Hoja {
  titulo: string
  texto: string
  textoNino?: string
  /** "Génesis 6–9" or "Génesis 22:1-14". */
  referencia: string
  tipo: TipoHoja
}

export interface Rama {
  titulo: string
  /** Chapters of the book this branch covers: "1–11". Empty for theme maps. */
  capitulos: string
  color: ColorRama
  resumen: string
  resumenNino: string
  hojas: Hoja[]
}

export interface MapaMental {
  id: string
  tipo: 'libro' | 'tema'
  titulo: string
  subtitulo: string
  /** OSIS id for book maps ("Gen"). */
  libro?: string
  centro: { texto: string; textoNino: string }
  /** Exact RV1909 text (modernized accents). */
  versiculo: { texto: string; referencia: string }
  ramas: Rama[]
  cristo: { texto: string; referencias: string[] }
  paraTuVida: string[]
  preguntas: { pregunta: string; opciones: [string, string, string]; correcta: 0 | 1 | 2; explicacion: string }[]
  /** Estudio lessons where this book or theme is told (maestra ids). */
  estudio: string[]
  /** Other maps to open next (map ids). */
  conexiones?: { id: string; motivo: string }[]
}

/** content-src/mapas/indice.json */
export interface MapasIndice {
  secciones: { id: string; titulo: string; mapas: { id: string; titulo: string; subtitulo?: string }[] }[]
}
