// Reina-Valera 1909 (public domain) → public/biblia/<OSIS>.json, one file per book:
//   { id, capitulos: [["verse 1", "verse 2", …], …] }
// Spelling modernized only where it is pure orthography (no word changes):
//   - the old accented one-letter words "á é ó ú" → "a e o u"  ("dado á su Hijo" → "dado a su Hijo")
//   - the small-caps first word of a chapter ("EN el principio") → "En el principio"
// Usage: node content-src/estudio/build-biblia.mjs
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(HERE, '..', '..')
const OUT = path.join(ROOT, 'public', 'biblia')
const src = JSON.parse(fs.readFileSync(path.join(HERE, 'raw', 'SpaRV.json'), 'utf8'))

// Same order as lib/biblia.ts (canonical); the source names are English.
const IDS = ['Gen', 'Exod', 'Lev', 'Num', 'Deut', 'Josh', 'Judg', 'Ruth', '1Sam', '2Sam', '1Kgs', '2Kgs', '1Chr', '2Chr', 'Ezra', 'Neh', 'Esth', 'Job', 'Ps', 'Prov', 'Eccl', 'Song', 'Isa', 'Jer', 'Lam', 'Ezek', 'Dan', 'Hos', 'Joel', 'Amos', 'Obad', 'Jonah', 'Mic', 'Nah', 'Hab', 'Zeph', 'Hag', 'Zech', 'Mal', 'Matt', 'Mark', 'Luke', 'John', 'Acts', 'Rom', '1Cor', '2Cor', 'Gal', 'Eph', 'Phil', 'Col', '1Thess', '2Thess', '1Tim', '2Tim', 'Titus', 'Phlm', 'Heb', 'Jas', '1Pet', '2Pet', '1John', '2John', '3John', 'Jude', 'Rev']
if (src.books.length !== 66) throw new Error(`esperava 66 livros, veio ${src.books.length}`)

export function modernize(text, firstOfChapter) {
  // NFC first: some accents come as a separate combining mark.
  let t = text.normalize('NFC').replace(/\s+/g, ' ').trim()
  // Capitals first, so the accent rules below also see those words in lowercase.
  // Small caps at the start of a chapter: "Y ACONTECIÓ" / "EN el principio".
  if (firstOfChapter) {
    t = t.replace(/^((?:[A-ZÁÉÍÓÚÑÜ]\s)?)([A-ZÁÉÍÓÚÑÜ]{2,})(?=[\s,;:.]|$)/, (_m, pre, w) => pre + (pre ? w.toLowerCase() : w.charAt(0) + w.slice(1).toLowerCase()))
  }
  // A verse that opens with a word in capitals ("HUBO en los días…").
  t = t.replace(/^([A-ZÁÉÍÓÚÑÜ])([A-ZÁÉÍÓÚÑÜ]+)(?= \p{Ll})/u, (_m, a, rest) => a + rest.toLowerCase())
  // The divine name printed in capitals ("JEHOVÁ") reads as shouting on a phone.
  t = t.replace(/JEHOVÁ/g, 'Jehová')
  // One-letter accented words (preposition "á", conjunctions "é", "ó", "ú").
  t = t.replace(/(^|[\s(¿¡«"'])([áéóú])(?=[\s,.;:!?)»"']|$)/g, (_m, pre, v) => pre + { á: 'a', é: 'e', ó: 'o', ú: 'u' }[v])
  t = t.replace(/(^|[\s(¿¡«"'])([ÁÉÓÚ])(?=\s)/g, (_m, pre, v) => pre + { Á: 'A', É: 'E', Ó: 'O', Ú: 'U' }[v])
  // Old accents on monosyllables, dropped by the modern rules (same words, same meaning).
  const MONO = { fué: 'fue', Fué: 'Fue', fuí: 'fui', Fuí: 'Fui', dió: 'dio', Dió: 'Dio', vió: 'vio', Vió: 'Vio' }
  t = t.replace(/(?<![\p{L}])(fué|Fué|fuí|Fuí|dió|Dió|vió|Vió)(?![\p{L}])/gu, (w) => MONO[w])
  t = t.replace(/(?<![\p{L}])([Ff])uése(?![\p{L}])/gu, '$1uese')
  // Preterite + one enclitic ("volvióse", "dióle"): a plain llana word today → no accent.
  t = t.replace(/(?<![\p{L}])(\p{L}+)ó(se|le|les|lo|la|los|las|me|te|nos)(?![\p{L}])/gu, '$1o$2')
  return t
}

fs.mkdirSync(OUT, { recursive: true })
let verses = 0
let bytes = 0
/** Typing errors of the source dataset, checked against the 1909 printing: "<id> <ch>:<v>" → [wrong, right]. */
const TYPOS = {
  '2Chr 7:14': ['sobre los cuales ni nombre', 'sobre los cuales mi nombre'],
}

src.books.forEach((book, i) => {
  const id = IDS[i]
  const capitulos = book.chapters.map((ch, c) =>
    ch.verses.map((v, j) => {
      const fix = TYPOS[`${id} ${c + 1}:${j + 1}`]
      return modernize(fix ? v.text.replace(fix[0], fix[1]) : v.text, j === 0)
    }),
  )
  verses += capitulos.reduce((n, c) => n + c.length, 0)
  const json = JSON.stringify({ id, capitulos })
  bytes += json.length
  fs.writeFileSync(path.join(OUT, `${id}.json`), json)
})
console.log(`66 livros, ${verses} versículos, ${(bytes / 1e6).toFixed(1)} MB em public/biblia`)
