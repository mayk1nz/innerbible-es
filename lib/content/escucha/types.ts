// Guía de escucha (upsell 1, Resumen en Audio): under each audio, what to keep from it.
// One file content-src/escucha/guias/<audio id>.json per audio; content-src/escucha/build-escucha.mjs
// validates them and publishes lib/content/escucha/<id>.json.
//
// Erasable TypeScript only (types + `as const`): the validator imports LIMITES_ESCUCHA directly.

export const LIMITES_ESCUCHA = {
  /** Words per sentence in every text we write. */
  fraseMax: 22,
  /** The three points: what the audio told, in plain words. */
  puntos: { cantidad: 3, palabras: 35 },
  versiculo: 45,
  pregunta: 25,
  oracion: 45,
} as const

export interface GuiaEscucha {
  /** The audio lesson id in the Resumen en Audio ("genesis", "1-reyes-1-11"). */
  id: string
  /** Three key points of the audio. */
  puntos: [string, string, string]
  /** A verse to keep: exact Reina-Valera 1909 text (modernized accents), as in public/biblia. */
  versiculo: { texto: string; referencia: string }
  /** One question to think about. */
  pregunta: string
  /** A short first-person prayer. */
  oracion: string
  /** Estudio Cronológico lessons that tell the same part (maestra ids), to read more. */
  estudio?: string[]
}
