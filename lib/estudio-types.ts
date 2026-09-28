// What /api/estudio returns: a chain of connected passages, in the order of the story.

export interface EstudioLink {
  ref: string
  bookId: string
  chapter: number
  from: number
  to: number
  /** Approximate year (negative = a.C.): only to place the passage in its era. */
  year: number
  text: string
  /** The passage the member searched for. */
  origin?: boolean
  /** Why this passage belongs in the chain (written by the AI). */
  porque?: string
}

export interface Estudio {
  q: string
  titulo: string
  intro: string
  kind: 'ref' | 'tema'
  links: EstudioLink[]
}
