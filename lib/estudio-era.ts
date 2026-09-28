// The period of the Bible's story a year falls in — what the chain shows next to each
// passage (instead of an exact year, which is often debated). Same eras as the Estudio.

export interface Era {
  id: string
  nombre: string
}

const ERAS: { hasta: number; era: Era }[] = [
  { hasta: -2100, era: { id: 'comienzos', nombre: 'Los comienzos' } },
  { hasta: -1520, era: { id: 'patriarcas', nombre: 'Los patriarcas' } },
  { hasta: -1406, era: { id: 'exodo', nombre: 'Éxodo y desierto' } },
  { hasta: -1051, era: { id: 'conquista', nombre: 'Conquista y jueces' } },
  { hasta: -931, era: { id: 'reino-unido', nombre: 'El reino unido' } },
  { hasta: -587, era: { id: 'reino-dividido', nombre: 'El reino dividido' } },
  { hasta: -539, era: { id: 'exilio', nombre: 'El exilio' } },
  { hasta: -400, era: { id: 'regreso', nombre: 'El regreso' } },
  { hasta: -6, era: { id: 'entre-testamentos', nombre: 'Entre los Testamentos' } },
  { hasta: 33, era: { id: 'jesus', nombre: 'Jesús' } },
  { hasta: 9999, era: { id: 'iglesia', nombre: 'La Iglesia' } },
]

export function eraOf(year: number, bookId?: string): Era {
  // Job's story is set among the patriarchs even when its dating is uncertain.
  if (bookId === 'Job') return ERAS[1].era
  return (ERAS.find((e) => year <= e.hasta) ?? ERAS[ERAS.length - 1]).era
}
