// Word search for the children's corner. Deterministic: the same seed gives the same grid,
// so the page printed at home matches the one on the phone (and its answer key).

export interface Colocada {
  palabra: string
  /** Cells [row, col] from the first letter to the last. */
  celdas: [number, number][]
}

export interface Sopa {
  grid: string[][]
  colocadas: Colocada[]
}

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Upper case, no accents (Ñ kept): what goes in the grid. */
export function limpiar(palabra: string): string {
  return palabra
    .toUpperCase()
    .replace(/Ñ/g, '\u0000')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\u0000/g, 'Ñ')
    .replace(/[^A-ZÑ]/g, '')
}

const LETRAS = 'AAABCDEEEFGHIIIJLLMNNOOOPQRRSSTTUUVYZÑ'

export function crearSopa(tamano: number, palabras: string[], diagonales: boolean, seed: number): Sopa {
  const rand = mulberry32(seed)
  const dirs: [number, number][] = diagonales ? [[0, 1], [1, 0], [1, 1]] : [[0, 1], [1, 0]]
  const grid: string[][] = Array.from({ length: tamano }, () => Array.from({ length: tamano }, () => ''))
  const colocadas: Colocada[] = []
  // Longest words first: they are the hardest to place.
  for (const original of [...palabras].sort((a, b) => limpiar(b).length - limpiar(a).length)) {
    const p = limpiar(original)
    if (!p || p.length > tamano) continue
    let placed = false
    for (let intento = 0; intento < 400 && !placed; intento++) {
      const [dr, dc] = dirs[Math.floor(rand() * dirs.length)]
      const r0 = Math.floor(rand() * (tamano - dr * (p.length - 1)))
      const c0 = Math.floor(rand() * (tamano - dc * (p.length - 1)))
      const celdas: [number, number][] = []
      let ok = true
      for (let i = 0; i < p.length; i++) {
        const r = r0 + dr * i
        const c = c0 + dc * i
        const cur = grid[r][c]
        if (cur && cur !== p[i]) {
          ok = false
          break
        }
        celdas.push([r, c])
      }
      if (!ok) continue
      celdas.forEach(([r, c], i) => (grid[r][c] = p[i]))
      colocadas.push({ palabra: original, celdas })
      placed = true
    }
  }
  for (const row of grid) for (let c = 0; c < row.length; c++) if (!row[c]) row[c] = LETRAS[Math.floor(rand() * LETRAS.length)]
  return { grid, colocadas }
}
