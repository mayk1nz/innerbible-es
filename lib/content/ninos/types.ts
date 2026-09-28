// Rincón de los niños (regalo 5): one Bible story per file (content-src/ninos/historias/<id>.json),
// told for three ages, with one game playable on the phone, a page to print and a guide
// for parents and grandparents. Images are optional: without them the app draws a cover.
// Erasable TypeScript only: the validator imports LIMITES_NINOS directly.

export const BANDAS = ['3-5', '6-8', '9-12'] as const
export type Banda = (typeof BANDAS)[number]
export type PorBanda<T> = Record<Banda, T>

export const LIMITES_NINOS = {
  titulo: 8,
  escenas: { min: 4, max: 6 },
  /** Words per scene text, per age. */
  escena: { '3-5': 30, '6-8': 60, '9-12': 80 } as Record<Banda, number>,
  /** Words per sentence, per age. */
  frase: { '3-5': 12, '6-8': 18, '9-12': 22 } as Record<Banda, number>,
  versiculo: 30,
  padres: { objetivo: 30, pregunta: 30, oracion: 40, gesto: 35, respuesta: 60 },
} as const

export interface Imagen {
  src: string
  alt: string
}

export interface Escena {
  id: string
  /** Optional illustration (public/ninos/<id>/…). */
  img?: Imagen
  texto: PorBanda<string>
}

export type Juego =
  | { tipo: 'ordenar'; enunciado: string; niveles: PorBanda<{ items: string[] }> }
  | { tipo: 'quiz'; enunciado: string; niveles: PorBanda<{ preguntas: { texto: string; opciones: string[]; correcta: number; explicacion?: string }[] }> }
  | { tipo: 'memoria'; enunciado: string; niveles: PorBanda<{ pares: [string, string][] }> }
  | { tipo: 'verdadero-falso'; enunciado: string; niveles: PorBanda<{ frases: { texto: string; verdadera: boolean; porque: string }[] }> }
  | { tipo: 'sopa'; enunciado: string; niveles: PorBanda<{ tamano: number; palabras: string[]; diagonales: boolean; seed: number }> }

export interface HistoriaNinos {
  id: string
  titulo: string
  /** "Génesis 6–9". */
  referencia: string
  /** Estudio Cronológico lesson for the grown-ups (maestra id). */
  estudio: string
  minutos: number
  /** The story's illustration (public/ninos/<id>.webp), set by build-ninos when the file exists. */
  imagen?: { src: string; alt: string }
  escenas: Escena[]
  /** Age 3–5 and 6–8: short, adapted sentence marked "(adaptado)"; 9–12: exact RV1909. */
  versiculo: PorBanda<{ texto: string; referencia: string; fuente: 'RV1909' | 'adaptado' }>
  /** Two games: the first is the main one, the second is optional ("otro juego"). */
  juegos: Juego[]
  padres: {
    objetivo: string
    siPregunta?: { pregunta: string; respuesta: string }[]
    preguntas: { recordar: string; sentir: string; vivir: string }
    oracion: string
    gesto: string
  }
  /** Name of the sticker earned at the end ("El arcoíris de la promesa"). */
  estampa: string
}

/** content-src/ninos/indice.json */
export interface NinosIndice {
  secciones: { id: string; titulo: string; historias: { id: string; titulo: string; referencia: string }[] }[]
}
