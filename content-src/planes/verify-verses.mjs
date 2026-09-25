// Checks every verse of a plan against the official Reina-Valera 1960 text
// (bolls.life, RV1960) and writes the exact text back. Usage:
//   node verify-verses.mjs <days.json> [--fix]
// Reports: reference that could not be parsed, verse not found, text that differs.
import fs from 'node:fs'

const BOOKS = [
  'Génesis', 'Éxodo', 'Levítico', 'Números', 'Deuteronomio', 'Josué', 'Jueces', 'Rut', '1 Samuel', '2 Samuel',
  '1 Reyes', '2 Reyes', '1 Crónicas', '2 Crónicas', 'Esdras', 'Nehemías', 'Ester', 'Job', 'Salmos', 'Proverbios',
  'Eclesiastés', 'Cantares', 'Isaías', 'Jeremías', 'Lamentaciones', 'Ezequiel', 'Daniel', 'Oseas', 'Joel', 'Amós',
  'Abdías', 'Jonás', 'Miqueas', 'Nahúm', 'Habacuc', 'Sofonías', 'Hageo', 'Zacarías', 'Malaquías',
  'Mateo', 'Marcos', 'Lucas', 'Juan', 'Hechos', 'Romanos', '1 Corintios', '2 Corintios', 'Gálatas', 'Efesios',
  'Filipenses', 'Colosenses', '1 Tesalonicenses', '2 Tesalonicenses', '1 Timoteo', '2 Timoteo', 'Tito', 'Filemón',
  'Hebreos', 'Santiago', '1 Pedro', '2 Pedro', '1 Juan', '2 Juan', '3 Juan', 'Judas', 'Apocalipsis',
]
const plain = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
const INDEX = new Map(BOOKS.map((b, i) => [plain(b), i + 1]))
INDEX.set('salmo', 19); INDEX.set('cantar de los cantares', 22); INDEX.set('hechos de los apostoles', 44)

function parse(ref) {
  const m = ref.trim().match(/^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/)
  if (!m) return null
  const book = INDEX.get(plain(m[1]))
  if (!book) return null
  const from = Number(m[3])
  const to = m[4] ? Number(m[4]) : from
  return { book, chapter: Number(m[2]), from, to }
}

const cache = new Map()
async function chapter(book, ch) {
  const key = `${book}/${ch}`
  if (!cache.has(key)) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const r = await fetch(`https://bolls.life/get-text/RV1960/${book}/${ch}/`)
        if (r.ok) { cache.set(key, await r.json()); break }
      } catch { /* retry */ }
      await new Promise((r) => setTimeout(r, 800))
    }
  }
  return cache.get(key) ?? []
}

const clean = (t) => t.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
const loose = (t) => plain(t).replace(/[^a-zñ0-9 ]/g, '').replace(/\s+/g, ' ').trim()

const file = process.argv[2]
const fix = process.argv.includes('--fix')
const days = JSON.parse(fs.readFileSync(file, 'utf8'))
let changed = 0
const problems = []
for (const d of days) {
  const ref = d.versiculo?.referencia ?? ''
  const p = parse(ref)
  if (!p) { problems.push(`Día ${d.day}: referencia no reconocida "${ref}"`); continue }
  const verses = await chapter(p.book, p.chapter)
  const picked = verses.filter((v) => v.verse >= p.from && v.verse <= p.to)
  if (picked.length !== p.to - p.from + 1) { problems.push(`Día ${d.day}: no encontrado ${ref}`); continue }
  const official = clean(picked.map((v) => v.text).join(' '))
  if (loose(official) !== loose(d.versiculo.texto)) {
    const distance = levenshtein(loose(official), loose(d.versiculo.texto))
    // The online text has its own typos ("vecon él"): a tiny difference keeps the
    // writer's wording and is only reported; a real difference takes the official text.
    if (distance <= 3) {
      problems.push(`Día ${d.day} (${ref}) diferencia mínima (${distance}), se mantiene el texto escrito:\n   escrito: ${d.versiculo.texto}\n   fuente:  ${official}`)
    } else {
      changed++
      problems.push(`Día ${d.day} (${ref}) ${fix ? 'CORREGIDO' : 'difiere'}:\n   escrito: ${d.versiculo.texto}\n   RVR1960: ${official}`)
      if (fix) d.versiculo.texto = official
    }
  }
}

function levenshtein(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0]
    row[0] = i
    for (let j = 1; j <= b.length; j++) {
      const tmp = row[j]
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1))
      prev = tmp
    }
  }
  return row[b.length]
}
if (fix) fs.writeFileSync(file, JSON.stringify(days, null, 2) + '\n')
console.log(`${file}: ${days.length} días, ${changed} textos ${fix ? 'corregidos' : 'distintos'} del RVR1960, ${problems.length} avisos`)
for (const p of problems) console.log(' - ' + p)
