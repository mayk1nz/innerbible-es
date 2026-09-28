// Builds the data behind "Tu Guía de Estudio" (cross-study chains) into lib/server/estudio-data:
//   xrefs.json  — for every verse with links: [[target, targetEnd, votes], …] (OpenBible.info, CC-BY)
//   years.json  — approximate year of each chapter (median of the Theographic verse years, CC BY-SA)
// Verses are integers: book (1–66) * 1_000_000 + chapter * 1_000 + verse.
// Usage: node content-src/estudio/build-indice.mjs   (after fetch-data.mjs)
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const RAW = path.join(HERE, 'raw')
const OUT = path.join(HERE, '..', '..', 'lib', 'server', 'estudio-data')
fs.mkdirSync(OUT, { recursive: true })

const IDS = ['Gen', 'Exod', 'Lev', 'Num', 'Deut', 'Josh', 'Judg', 'Ruth', '1Sam', '2Sam', '1Kgs', '2Kgs', '1Chr', '2Chr', 'Ezra', 'Neh', 'Esth', 'Job', 'Ps', 'Prov', 'Eccl', 'Song', 'Isa', 'Jer', 'Lam', 'Ezek', 'Dan', 'Hos', 'Joel', 'Amos', 'Obad', 'Jonah', 'Mic', 'Nah', 'Hab', 'Zeph', 'Hag', 'Zech', 'Mal', 'Matt', 'Mark', 'Luke', 'John', 'Acts', 'Rom', '1Cor', '2Cor', 'Gal', 'Eph', 'Phil', 'Col', '1Thess', '2Thess', '1Tim', '2Tim', 'Titus', 'Phlm', 'Heb', 'Jas', '1Pet', '2Pet', '1John', '2John', '3John', 'Jude', 'Rev']
const BOOK = new Map(IDS.map((id, i) => [id, i + 1]))

function verseInt(osis) {
  const [b, c, v] = osis.split('.')
  const n = BOOK.get(b)
  if (!n || !c) return null
  return n * 1_000_000 + Number(c) * 1_000 + Number(v || 1)
}

// ─── Cross references ──────────────────────────────────────────────
const MIN_VOTES = 3 // below this the link is usually weak or disputed
if (!fs.existsSync(path.join(RAW, 'cross_references.txt'))) execSync(`tar -xf "${path.join(RAW, 'cross-references.zip')}" -C "${RAW}"`)
const lines = fs.readFileSync(path.join(RAW, 'cross_references.txt'), 'utf8').split('\n').slice(1)
const xrefs = {}
let kept = 0
for (const line of lines) {
  const [from, to, votesRaw] = line.split('\t')
  const votes = Number(votesRaw)
  if (!from || !to || !(votes >= MIN_VOTES)) continue
  const a = verseInt(from)
  const [t1, t2] = to.split('-')
  const b = verseInt(t1)
  const e = t2 ? verseInt(t2) : 0
  if (!a || !b) continue
  ;(xrefs[a] ??= []).push(e && e !== b ? [b, e, votes] : [b, 0, votes])
  kept++
}
for (const k of Object.keys(xrefs)) xrefs[k].sort((x, y) => y[2] - x[2])
fs.writeFileSync(path.join(OUT, 'xrefs.json'), JSON.stringify(xrefs))

// ─── Years per chapter ─────────────────────────────────────────────
const verses = JSON.parse(fs.readFileSync(path.join(RAW, 'theographic-verses.json'), 'utf8'))
const byChapter = {}
for (const v of verses) {
  const y = v.fields?.yearNum
  const n = v.fields?.osisRef ? verseInt(v.fields.osisRef) : null
  if (n == null || typeof y !== 'number') continue
  ;(byChapter[Math.floor(n / 1000)] ??= []).push(y)
}
const years = {}
for (const [ch, ys] of Object.entries(byChapter)) {
  ys.sort((a, b) => a - b)
  years[ch] = ys[Math.floor(ys.length / 2)]
}
// Gaps: a chapter without a year takes the nearest chapter of the same book (only used
// to order a chain; the dates people see come from the Estudio's master table).
const BOOK_DEFAULT = { Hag: -520 }
const bible = JSON.parse(fs.readFileSync(path.join(RAW, 'SpaRV.json'), 'utf8'))
bible.books.forEach((b, i) => {
  const n = i + 1
  const chapters = b.chapters.length
  for (let c = 1; c <= chapters; c++) {
    const key = n * 1000 + c
    if (years[key] != null) continue
    let found = null
    for (let d = 1; d < chapters && found == null; d++) found = years[n * 1000 + c - d] ?? years[n * 1000 + c + d] ?? null
    years[key] = found ?? BOOK_DEFAULT[IDS[i]] ?? 0
  }
})
fs.writeFileSync(path.join(OUT, 'years.json'), JSON.stringify(years))

const size = (f) => (fs.statSync(path.join(OUT, f)).size / 1e6).toFixed(1)
console.log(`xrefs: ${kept} ligações (votos ≥ ${MIN_VOTES}) em ${Object.keys(xrefs).length} versículos, ${size('xrefs.json')} MB`)
console.log(`years: ${Object.keys(years).length} capítulos com ano, ${size('years.json')} MB`)
console.log('Gen 22 →', years[1022], '| John 1 →', years[43001], '| Rev 5 →', years[66005])
