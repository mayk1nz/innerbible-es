// Plan de Lectura en 365 Días (regalo 4): the whole Bible in the Estudio's chronological
// order, split into 365 days of similar reading time. Generated, never typed by hand.
//   node content-src/plan-365/build-plan-365.mjs
// Order: the passages of the Estudio's master table, lesson by lesson (introduction and
// conclusion skipped); each chapter enters the first time a lesson reads it.
// Weight: the words of each chapter in the RV1909 of the app (public/biblia).
// Split: dynamic programming into exactly 365 contiguous days, balancing the minutes
// and preferring to cut where a lesson ends. The build fails unless all 1,189 chapters
// appear exactly once.
// Writes lib/content/plan365.ts.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(HERE, '..', '..')
const DAYS = 365
const WORDS_PER_MIN = 150
const MAX_UNITS = 9

const maestra = JSON.parse(fs.readFileSync(path.join(ROOT, 'content-src', 'estudio', 'maestra.json'), 'utf8'))
const bookCache = new Map()
const book = (id) => {
  if (!bookCache.has(id)) bookCache.set(id, JSON.parse(fs.readFileSync(path.join(ROOT, 'public', 'biblia', `${id}.json`), 'utf8')).capitulos)
  return bookCache.get(id)
}
const NAMES = {}
for (const line of fs.readFileSync(path.join(ROOT, 'lib', 'biblia.ts'), 'utf8').matchAll(/\{ id: '([^']+)', nombre: '([^']+)'/g)) NAMES[line[1]] = line[2]
const ORDER = Object.keys(NAMES)

// 1) Chapters in story order.
const units = []
const seen = new Set()
for (const l of maestra.lecciones) {
  if (l.formato === 'marco') continue
  for (const p of l.pasajes) {
    const [a, b] = p.split('-')
    const [bk, c1] = a.split('.')
    const [bk2, c2] = (b ?? a).split('.')
    if (bk !== bk2) throw new Error(`pasaje entre livros: ${p}`)
    for (let c = Number(c1); c <= Number(c2); c++) {
      const key = `${bk}.${c}`
      if (seen.has(key)) continue
      seen.add(key)
      const words = book(bk)[c - 1].join(' ').split(/\s+/).length
      units.push({ book: bk, chapter: c, words, lesson: l.id, era: l.seccion })
    }
  }
}
const total = ORDER.reduce((n, id) => n + book(id).length, 0)
if (units.length !== total) {
  const missing = ORDER.flatMap((id) => book(id).map((_, i) => `${id}.${i + 1}`)).filter((k) => !seen.has(k))
  throw new Error(`${units.length} capítulos na ordem, a Bíblia tem ${total}. Faltam: ${missing.slice(0, 20).join(', ')}`)
}

// 2) Split into 365 days (min sum of squared deviation from the mean + small penalties).
const n = units.length
const prefix = [0]
for (const u of units) prefix.push(prefix[prefix.length - 1] + u.words)
const mean = prefix[n] / DAYS
function dayCost(i, j) {
  // units i..j-1
  const w = prefix[j] - prefix[i]
  let cost = (w - mean) ** 2
  const books = new Set()
  for (let k = i; k < j; k++) books.add(units[k].book)
  if (books.size > 2) cost += (mean * 0.35) ** 2
  // Prefer ending the day where a lesson ends (the day then maps to one lesson).
  if (j < n && units[j].lesson === units[j - 1].lesson) cost += (mean * 0.12) ** 2
  if (w > mean * 1.6 && j - i > 1) cost += (mean * 2) ** 2
  return cost
}
const INF = Number.POSITIVE_INFINITY
const best = Array.from({ length: DAYS + 1 }, () => new Float64Array(n + 1).fill(INF))
const cut = Array.from({ length: DAYS + 1 }, () => new Int32Array(n + 1).fill(-1))
best[0][0] = 0
for (let d = 1; d <= DAYS; d++) {
  // Each remaining day needs at least one unit.
  const lo = d
  const hi = n - (DAYS - d)
  for (let j = lo; j <= hi; j++) {
    for (let k = 1; k <= MAX_UNITS && j - k >= d - 1; k++) {
      const prev = best[d - 1][j - k]
      if (prev === INF) continue
      const c = prev + dayCost(j - k, j)
      if (c < best[d][j]) {
        best[d][j] = c
        cut[d][j] = j - k
      }
    }
  }
}
if (best[DAYS][n] === INF) throw new Error('sem partição possível (aumente MAX_UNITS)')
const bounds = []
for (let d = DAYS, j = n; d > 0; d--) {
  const i = cut[d][j]
  bounds.unshift([i, j])
  j = i
}

// 3) Assemble the days.
function refOf(group) {
  const name = NAMES[group.book]
  const chapters = book(group.book).length
  if (chapters === 1) return name
  return group.from === group.to ? `${name} ${group.from}` : `${name} ${group.from}–${group.to}`
}
const days = bounds.map(([i, j], d) => {
  const us = units.slice(i, j)
  const groups = []
  for (const u of us) {
    const g = groups[groups.length - 1]
    if (g && g.book === u.book && g.to === u.chapter - 1) g.to = u.chapter
    else groups.push({ book: u.book, from: u.chapter, to: u.chapter })
  }
  const words = us.reduce((a, u) => a + u.words, 0)
  // The lesson with most of the day's reading.
  const byLesson = new Map()
  for (const u of us) byLesson.set(u.lesson, (byLesson.get(u.lesson) ?? 0) + u.words)
  const lesson = [...byLesson.entries()].sort((a, b) => b[1] - a[1])[0][0]
  const era = us.find((u) => u.lesson === lesson).era
  return {
    dia: d + 1,
    ref: groups.map(refOf).join(' · '),
    lecturas: groups.map((g) => [g.book, g.from, g.to]),
    minutos: Math.max(1, Math.round(words / WORDS_PER_MIN)),
    leccion: lesson,
    era,
  }
})

// 4) Checks + report.
const covered = days.flatMap((d) => d.lecturas.flatMap(([b, f, t]) => Array.from({ length: t - f + 1 }, (_, k) => `${b}.${f + k}`)))
if (covered.length !== total || new Set(covered).size !== total) throw new Error('cobertura errada')
const mins = days.map((d) => d.minutos).sort((a, b) => a - b)
console.log(`365 dias · ${total} capítulos · minutos por dia: mín ${mins[0]}, mediana ${mins[182]}, máx ${mins[364]}`)
console.log('mais longos:', [...days].sort((a, b) => b.minutos - a.minutos).slice(0, 5).map((d) => `Día ${d.dia} ${d.ref} (${d.minutos} min)`).join(' | '))
console.log('exemplos:', [1, 2, 60, 150, 250, 300, 365].map((n) => `Día ${n}: ${days[n - 1].ref}`).join(' | '))

fs.writeFileSync(
  path.join(ROOT, 'lib', 'content', 'plan365.ts'),
  `// Generated by content-src/plan-365/build-plan-365.mjs — do not edit by hand.\n` +
    `// Each day: what is read ([OSIS book, from chapter, to chapter]), minutes, and the Estudio lesson it belongs to.\n\n` +
    `export interface DiaPlan365 { dia: number; ref: string; lecturas: [string, number, number][]; minutos: number; leccion: string; era: string }\n\n` +
    `export const PLAN_365: DiaPlan365[] = ${JSON.stringify(days)}\n`,
)
console.log('lib/content/plan365.ts escrito')
