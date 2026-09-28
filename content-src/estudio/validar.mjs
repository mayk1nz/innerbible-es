// Validator of the Estudio Cronológico content.
//
//   node content-src/estudio/validar.mjs                      → master table + glossary + characters + every lesson
//   node content-src/estudio/validar.mjs --maestra            → only master table, glossary and characters
//   node content-src/estudio/validar.mjs lecciones/x.json …   → only these lessons (a folder = every .json in it)
//   node content-src/estudio/validar.mjs --texto "Génesis 22:8"   → exact RV1909 text (modernized accents)
//   node content-src/estudio/validar.mjs --xrefs genesis-12-50 20 → real cross-references of a lesson (≥ 20 votes)
//
// A lesson fails when a field is missing, a limit is exceeded (words per field, words per
// sentence, number of items), a reference does not exist in the RV1909, the key verse is not
// the exact RV1909 text (with modernized accents), a "conexión" is not a real OpenBible
// cross-reference of the lesson, the date differs from the master table, or a banned word
// appears. Warnings do not fail, but a reviewer must read them.
//
// Limits and enums come from lib/content/estudio/types.ts (Node strips the types).
// Data (not versioned): raw/SpaRV.json (RV1909, public domain) and raw/cross_references.txt
// (OpenBible.info, CC-BY).

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

// types.ts lives in a package without "type": "module"; Node parses it fine but warns. Silence only that.
const emitWarning = process.emitWarning
process.emitWarning = (w, ...rest) => {
  if (String(w).includes('MODULE_TYPELESS_PACKAGE_JSON') || rest.some((r) => r === 'MODULE_TYPELESS_PACKAGE_JSON' || r?.code === 'MODULE_TYPELESS_PACKAGE_JSON') || /Module type of file/.test(String(w))) return
  return emitWarning.call(process, w, ...rest)
}
const { LIMITES, SECCIONES, CERTEZAS, FORMATOS, NIVELES_QUIZ, ERAS } = await import('../../lib/content/estudio/types.ts')
process.emitWarning = emitWarning

const HERE = path.dirname(fileURLToPath(import.meta.url))
const RAW = path.join(HERE, 'raw')

// ─── Books: OSIS id, Spanish name, name in SpaRV.json ──────────────

export const BOOKS = [
  ['Gen', 'Génesis', 'Genesis'], ['Exod', 'Éxodo', 'Exodus'], ['Lev', 'Levítico', 'Leviticus'], ['Num', 'Números', 'Numbers'],
  ['Deut', 'Deuteronomio', 'Deuteronomy'], ['Josh', 'Josué', 'Joshua'], ['Judg', 'Jueces', 'Judges'], ['Ruth', 'Rut', 'Ruth'],
  ['1Sam', '1 Samuel', 'I Samuel'], ['2Sam', '2 Samuel', 'II Samuel'], ['1Kgs', '1 Reyes', 'I Kings'], ['2Kgs', '2 Reyes', 'II Kings'],
  ['1Chr', '1 Crónicas', 'I Chronicles'], ['2Chr', '2 Crónicas', 'II Chronicles'], ['Ezra', 'Esdras', 'Ezra'], ['Neh', 'Nehemías', 'Nehemiah'],
  ['Esth', 'Ester', 'Esther'], ['Job', 'Job', 'Job'], ['Ps', 'Salmos', 'Psalms'], ['Prov', 'Proverbios', 'Proverbs'],
  ['Eccl', 'Eclesiastés', 'Ecclesiastes'], ['Song', 'Cantares', 'Song of Solomon'], ['Isa', 'Isaías', 'Isaiah'], ['Jer', 'Jeremías', 'Jeremiah'],
  ['Lam', 'Lamentaciones', 'Lamentations'], ['Ezek', 'Ezequiel', 'Ezekiel'], ['Dan', 'Daniel', 'Daniel'], ['Hos', 'Oseas', 'Hosea'],
  ['Joel', 'Joel', 'Joel'], ['Amos', 'Amós', 'Amos'], ['Obad', 'Abdías', 'Obadiah'], ['Jonah', 'Jonás', 'Jonah'], ['Mic', 'Miqueas', 'Micah'],
  ['Nah', 'Nahúm', 'Nahum'], ['Hab', 'Habacuc', 'Habakkuk'], ['Zeph', 'Sofonías', 'Zephaniah'], ['Hag', 'Hageo', 'Haggai'],
  ['Zech', 'Zacarías', 'Zechariah'], ['Mal', 'Malaquías', 'Malachi'],
  ['Matt', 'Mateo', 'Matthew'], ['Mark', 'Marcos', 'Mark'], ['Luke', 'Lucas', 'Luke'], ['John', 'Juan', 'John'], ['Acts', 'Hechos', 'Acts'],
  ['Rom', 'Romanos', 'Romans'], ['1Cor', '1 Corintios', 'I Corinthians'], ['2Cor', '2 Corintios', 'II Corinthians'], ['Gal', 'Gálatas', 'Galatians'],
  ['Eph', 'Efesios', 'Ephesians'], ['Phil', 'Filipenses', 'Philippians'], ['Col', 'Colosenses', 'Colossians'],
  ['1Thess', '1 Tesalonicenses', 'I Thessalonians'], ['2Thess', '2 Tesalonicenses', 'II Thessalonians'], ['1Tim', '1 Timoteo', 'I Timothy'],
  ['2Tim', '2 Timoteo', 'II Timothy'], ['Titus', 'Tito', 'Titus'], ['Phlm', 'Filemón', 'Philemon'], ['Heb', 'Hebreos', 'Hebrews'],
  ['Jas', 'Santiago', 'James'], ['1Pet', '1 Pedro', 'I Peter'], ['2Pet', '2 Pedro', 'II Peter'], ['1John', '1 Juan', 'I John'],
  ['2John', '2 Juan', 'II John'], ['3John', '3 Juan', 'III John'], ['Jude', 'Judas', 'Jude'], ['Rev', 'Apocalipsis', 'Revelation of John'],
].map(([osis, es, rv], i) => ({ osis, es, rv, n: i + 1, nt: i >= 39 }))

export const BOOK_BY_OSIS = new Map(BOOKS.map((b) => [b.osis, b]))
export const plain = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
const BOOK_BY_ES = new Map(BOOKS.map((b) => [plain(b.es), b]))
for (const [alias, osis] of [['salmo', 'Ps'], ['cantar de los cantares', 'Song'], ['hechos de los apostoles', 'Acts']]) BOOK_BY_ES.set(alias, BOOK_BY_OSIS.get(osis))

// ─── The RV1909 text ────────────────────────────────────────────────

let bible = null
/** chapters[osis] = array of chapters, each an array of verse texts (index 0 = verse 1). */
export function loadBible() {
  if (bible) return bible
  const rv = JSON.parse(fs.readFileSync(path.join(RAW, 'SpaRV.json'), 'utf8'))
  const byName = new Map(rv.books.map((b) => [b.name, b]))
  const chapters = {}
  let ord = 0
  const ordinal = {} // `${osis}.${c}.${v}` → running index, to test overlaps
  for (const b of BOOKS) {
    const src = byName.get(b.rv)
    if (!src) throw new Error(`SpaRV.json: falta el libro ${b.rv}`)
    chapters[b.osis] = src.chapters.map((c) => c.verses.map((v) => v.text.replace(/\s+/g, ' ').trim()))
    chapters[b.osis].forEach((vs, ci) => vs.forEach((_, vi) => { ordinal[`${b.osis}.${ci + 1}.${vi + 1}`] = ++ord }))
  }
  bible = { chapters, ordinal }
  return bible
}

export const lastVerse = (osis, c) => loadBible().chapters[osis]?.[c - 1]?.length ?? 0
export const chapterCount = (osis) => loadBible().chapters[osis]?.length ?? 0

/** Modernized accents: isolated á é ó ú → a e o u; monosyllables that lost the accent; capitals of chapter openings. */
// "crió" (= creó), "fió", "guió" keep the accent on purpose: without it ("crio") they read as another word.
const MONO = { 'fué': 'fue', 'fuí': 'fui', 'dió': 'dio', 'vió': 'vio', 'dí': 'di', 'ví': 'vi', 'pié': 'pie', 'piés': 'pies', 'tí': 'ti', 'há': 'ha', 'hé': 'he' }
export function modernizar(text, { inicioCapitulo = false } = {}) {
  let t = text.replace(/(^|[^\p{L}])([áéóúÁÉÓÚ])(?=[^\p{L}]|$)/gu, (_, pre, ch) => pre + ch.normalize('NFD')[0])
  t = t.replace(/\p{L}+/gu, (w) => {
    const m = MONO[w.toLowerCase()]
    if (!m) return w
    return w[0] === w[0].toUpperCase() ? m[0].toUpperCase() + m.slice(1) : m
  })
  if (inicioCapitulo) {
    // "Y ACONTECIÓ después…" → "Y aconteció después…"; "EMPERO Jehová…" → "Empero Jehová…"
    t = t.replace(/^((?:\p{Lu}+[\s,;:]+)*\p{Lu}{2,})(?=[\s,;:.]|$)/u, (run) => run[0] + run.slice(1).toLowerCase())
    // Psalms carry their title inside verse 1: "Salmo de David. JEHOVÁ es mi pastor" → "… Jehová es mi pastor".
    t = t.replace(/(?<=[.:]\s)\p{Lu}{2,}(?=[\s,;:.]|$)/gu, (w) => w[0] + w.slice(1).toLowerCase())
  }
  return t
}

/** Exact modernized RV1909 text of a parsed range. */
export function textoDe(range) {
  const { chapters } = loadBible()
  const out = []
  for (const [osis, c, v] of versesOf(range)) out.push(modernizar(chapters[osis][c - 1][v - 1], { inicioCapitulo: v === 1 }))
  return out.join(' ')
}

/** Yields [osis, chapter, verse] for every verse of a range {b, c1, v1, c2, v2} (b2 optional). */
export function* versesOf(r) {
  const { chapters } = loadBible()
  const startBook = BOOK_BY_OSIS.get(r.b).n
  const endBook = BOOK_BY_OSIS.get(r.b2 ?? r.b).n
  for (let bn = startBook; bn <= endBook; bn++) {
    const osis = BOOKS[bn - 1].osis
    const chs = chapters[osis]
    const cFrom = bn === startBook ? r.c1 : 1
    const cTo = bn === endBook ? r.c2 : chs.length
    for (let c = cFrom; c <= cTo; c++) {
      const vFrom = bn === startBook && c === r.c1 ? r.v1 : 1
      const vTo = bn === endBook && c === r.c2 ? r.v2 : chs[c - 1].length
      for (let v = vFrom; v <= vTo; v++) yield [osis, c, v]
    }
  }
}

const exists = (osis, c, v) => v >= 1 && v <= lastVerse(osis, c)

/** "Gen.12.1-Gen.50.26" | "Gen.22.8" | "Gen.22" → range or an error string. */
export function parseOsis(p) {
  const one = (s) => {
    const m = String(s).match(/^([1-3]?[A-Z][a-z]+)\.(\d+)(?:\.(\d+))?$/)
    if (!m || !BOOK_BY_OSIS.has(m[1])) return null
    return { b: m[1], c: Number(m[2]), v: m[3] ? Number(m[3]) : null }
  }
  const [a, z] = String(p).split('-')
  const s = one(a)
  const e = z ? one(z) : s
  if (!s || !e) return `formato OSIS inválido: "${p}"`
  const r = { b: s.b, b2: e.b, c1: s.c, v1: s.v ?? 1, c2: e.c, v2: e.v ?? lastVerse(e.b, e.c) }
  if (!exists(r.b, r.c1, r.v1)) return `no existe en la RV1909: ${a}`
  if (!exists(r.b2, r.c2, r.v2)) return `no existe en la RV1909: ${z ?? a}`
  const { ordinal } = loadBible()
  if (ordinal[`${r.b}.${r.c1}.${r.v1}`] > ordinal[`${r.b2}.${r.c2}.${r.v2}`]) return `rango invertido: "${p}"`
  return r
}

/** "Génesis 22:8" | "Génesis 22:1-14" | "Génesis 22:1-23:4" | "Génesis 22" | "Génesis 12-50" → range or an error string. */
export function parseRefEs(ref) {
  const m = String(ref).trim().match(/^((?:[1-3] )?[\p{L} ]+?)\s+(\d[\d:\-–]*)$/u)
  if (!m) return `referencia no reconocida: "${ref}"`
  const book = BOOK_BY_ES.get(plain(m[1]))
  if (!book) return `libro no reconocido: "${m[1]}" en "${ref}"`
  const b = book.osis
  const rest = m[2].replace('–', '-')
  let r
  let mm
  if ((mm = rest.match(/^(\d+):(\d+)$/))) r = { b, c1: +mm[1], v1: +mm[2], c2: +mm[1], v2: +mm[2] }
  else if ((mm = rest.match(/^(\d+):(\d+)-(\d+)$/))) r = { b, c1: +mm[1], v1: +mm[2], c2: +mm[1], v2: +mm[3] }
  else if ((mm = rest.match(/^(\d+):(\d+)-(\d+):(\d+)$/))) r = { b, c1: +mm[1], v1: +mm[2], c2: +mm[3], v2: +mm[4] }
  else if ((mm = rest.match(/^(\d+)$/))) r = { b, c1: +mm[1], v1: 1, c2: +mm[1], v2: lastVerse(b, +mm[1]) }
  else if ((mm = rest.match(/^(\d+)-(\d+)$/))) r = { b, c1: +mm[1], v1: 1, c2: +mm[2], v2: lastVerse(b, +mm[2]) }
  else return `referencia no reconocida: "${ref}"`
  if (!exists(b, r.c1, r.v1) || !exists(b, r.c2, r.v2)) return `no existe en la RV1909: "${ref}"`
  if (r.c1 > r.c2 || (r.c1 === r.c2 && r.v1 > r.v2)) return `rango invertido: "${ref}"`
  return r
}

export const osisToEs = (osis) => BOOK_BY_OSIS.get(osis)?.es ?? osis

function ordinalSet(ranges) {
  const { ordinal } = loadBible()
  const set = new Set()
  for (const r of ranges) for (const [o, c, v] of versesOf(r)) set.add(ordinal[`${o}.${c}.${v}`])
  return set
}
const inside = (range, set) => {
  const { ordinal } = loadBible()
  for (const [o, c, v] of versesOf(range)) if (!set.has(ordinal[`${o}.${c}.${v}`])) return false
  return true
}
const overlaps = (range, set) => {
  const { ordinal } = loadBible()
  for (const [o, c, v] of versesOf(range)) if (set.has(ordinal[`${o}.${c}.${v}`])) return true
  return false
}

// ─── OpenBible cross-references ─────────────────────────────────────

let xrefs = null
function loadXrefs() {
  if (xrefs) return xrefs
  const file = path.join(RAW, 'cross_references.txt')
  const { ordinal } = loadBible()
  xrefs = []
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const [f, t, votes] = line.trim().split('\t')
    if (!t || f === 'From Verse') continue
    const from = ordinal[f]
    const [a, z] = t.split('-')
    const t1 = ordinal[a]
    const t2 = z ? ordinal[z] : t1
    if (from && t1 && t2) xrefs.push([from, t1, t2, Number(votes)])
  }
  return xrefs
}

/** Best OpenBible link between a range and a set of verse ordinals (either direction), or null. */
function xrefBetween(range, lessonSet) {
  const target = ordinalSet([range])
  let best = null
  for (const [from, t1, t2, votes] of loadXrefs()) {
    let hit = false
    if (lessonSet.has(from)) for (let o = t1; o <= t2 && !hit; o++) hit = target.has(o)
    if (!hit && target.has(from)) for (let o = t1; o <= t2 && !hit; o++) hit = lessonSet.has(o)
    if (hit && (!best || votes > best)) best = votes
  }
  return best
}

// ─── Text measures ──────────────────────────────────────────────────

export const palabras = (s) => String(s ?? '').split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length

/** Sentences of a text; "c.", "a.C.", "d.C." and "etc." do not end a sentence. */
export function frases(s) {
  const t = String(s ?? '')
    .replace(/\ba\.C\./g, 'aC').replace(/\bd\.C\./g, 'dC').replace(/\bc\.\s/g, 'c ').replace(/\betc\.(?=\s+\p{Ll})/gu, 'etc')
  return t.split(/(?<=[.!?…»”"])\s+(?=[¿¡«“"(]?[\p{Lu}\d])/u).map((x) => x.trim()).filter(Boolean)
}

function silabas(word) {
  const w = plain(word).replace(/[^a-zñü]/g, '')
  const orig = word.toLowerCase()
  if (!w) return 1
  // Weak vowels with an accent (í, ú) break a diphthong: mark them before stripping accents.
  const marked = orig.replace(/[^a-záéíóúüñ]/g, '').replace(/í/g, 'I').replace(/ú/g, 'U').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const groups = marked.match(/[aeiouüIU]+/g) ?? []
  let n = 0
  for (const g of groups) {
    n += 1
    for (let i = 1; i < g.length; i++) {
      const a = g[i - 1]
      const b = g[i]
      const strong = (x) => 'aeoIU'.includes(x)
      if (strong(a) && strong(b)) n += 1
    }
  }
  return Math.max(1, n)
}

/** INFLESZ (Szigriszt-Pazos): ≥ 65 = "bastante fácil"; ≥ 80 = "muy fácil". */
export function inflesz(texts) {
  const all = texts.join(' ')
  const ws = all.split(/\s+/).filter((w) => /\p{L}/u.test(w))
  const sy = ws.reduce((n, w) => n + silabas(w), 0)
  const fr = Math.max(1, texts.reduce((n, t) => n + frases(t).length, 0))
  return Math.round((206.835 - 62.3 * (sy / Math.max(1, ws.length)) - ws.length / fr) * 10) / 10
}

// ─── Banned words and tone ──────────────────────────────────────────

// Errors: the inflated vocabulary of the template, AI tics and denominational attacks.
const PROHIBIDAS = [
  'vibrante', 'inquebrantable', 'crucial', 'sublime', 'tapiz', 'apoteosis', 'prerrogativa', 'longanimidad', 'paradigma',
  'aprehender', 'dilucidar', 'conmin', 'intrínsec', 'desvel', 'vehemente', 'entrelaz', 'epistolar', 'magistral',
  'trascendental', 'fascinante', 'impactante', 'resiliencia', 'empoder', 'sinergia', 'épic', 'majestuos', 'insondable',
  'sin lugar a dudas', 'cabe destacar', 'es importante señalar', 'cabe señalar', 'poderoso recordatorio', 'un recordatorio',
  'medio hermano', 'hermanastro', 'papista', 'romanista', 'secta', 'herej', 'hereje', 'falsa iglesia', 'religión falsa',
  'años de silencio', '4004', '4000 a.c',
]
// Warnings: often fine, often filler. A reviewer decides.
const VIGILAR = ['glorios', 'profundamente', 'verdaderamente', 'asombros', 'increíble', 'no es solo', 'no solo', 'más que un', 'testimonio de', 'en el corazón de', 'usted ', 'judaizante', 'los judíos mataron', 'protestante', 'iglesia romana']

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
/** Stem match at the start of a word ("herej" catches "herejía", not "insectos"). */
const hasStem = (t, w) => new RegExp(`(^|[^a-zñ0-9])${esc(plain(w))}`).test(t)

// Scripture quotes go between «». They are checked against the RV1909, not against our style rules.
const QUOTE = /«([^»]*)»/g
let fullText = null
const flat = (s) => plain(s).replace(/[^a-zñ0-9 ]/g, ' ').replace(/\s+/g, ' ').trim()
function enLaBiblia(q) {
  if (!fullText) fullText = ' ' + flat(Object.values(loadBible().chapters).flat(2).map((v) => modernizar(v)).join(' ')) + ' '
  return fullText.includes(' ' + flat(q) + ' ')
}

function tono(texto, donde, out) {
  const propio = String(texto).replace(QUOTE, ' ')
  const t = plain(propio)
  for (const w of PROHIBIDAS) if (hasStem(t, w)) out.errores.push(`${donde}: palabra prohibida "${w}"`)
  for (const w of VIGILAR) if (hasStem(t, w.trim())) out.avisos.push(`${donde}: revisar "${w.trim()}"`)
  if (/jehov[aá]/i.test(propio)) out.errores.push(`${donde}: "Jehová" solo dentro de una cita de la RV1909; en nuestro texto, "Dios" o "el Señor"`)
  // A quote of 4+ words must be literal RV1909 (modernized accents); shorter ones may be names or phrases.
  for (const [, q] of String(texto).matchAll(QUOTE)) if (palabras(q) >= 4 && !enLaBiblia(q)) out.avisos.push(`${donde}: la cita «${q}» no aparece literal en la RV1909`)
}

// ─── Lesson validation ──────────────────────────────────────────────

const readJson = (f) => JSON.parse(fs.readFileSync(f, 'utf8'))
const isStr = (x) => typeof x === 'string' && x.trim().length > 0

function checkFecha(f, donde, out, lim = LIMITES.fecha) {
  if (!f || typeof f !== 'object') return out.errores.push(`${donde}: falta`)
  if (!isStr(f.texto)) out.errores.push(`${donde}.texto: falta`)
  else if (palabras(f.texto) > lim.texto) out.errores.push(`${donde}.texto: ${palabras(f.texto)} palabras (máx. ${lim.texto})`)
  if (!CERTEZAS.includes(f.certeza)) out.errores.push(`${donde}.certeza: debe ser ${CERTEZAS.join(' | ')}`)
  for (const k of ['desde', 'hasta']) if (!(f[k] === null || Number.isInteger(f[k])) || f[k] === 0) out.errores.push(`${donde}.${k}: año entero ≠ 0 o null`)
  if (Number.isInteger(f.desde) && Number.isInteger(f.hasta) && f.desde > f.hasta) out.errores.push(`${donde}: desde > hasta`)
  if ((f.desde === null || f.hasta === null) && f.certeza !== 'incierta') out.errores.push(`${donde}: sin año solo con certeza "incierta"`)
  if (f.nota !== undefined && palabras(f.nota) > LIMITES.fecha.nota) out.errores.push(`${donde}.nota: ${palabras(f.nota)} palabras (máx. ${LIMITES.fecha.nota})`)
  if (f.certeza !== 'aprox' && !isStr(f.nota)) out.avisos.push(`${donde}: fecha ${f.certeza} sin nota que lo explique`)
}

/** Every prose field: [path, text, word limit | null]. */
function prosa(lesson) {
  const L = LIMITES
  const items = []
  const add = (p, t, max = null) => items.push([p, t, max])
  lesson.enUnMinuto?.forEach((t, i) => add(`enUnMinuto[${i}]`, t))
  if (lesson.fecha?.nota) add('fecha.nota', lesson.fecha.nota)
  if (lesson.fechaEscrito?.nota) add('fechaEscrito.nota', lesson.fechaEscrito.nota)
  if (lesson.autor) { add('autor.texto', lesson.autor.texto, L.autor.texto); if (lesson.autor.nota) add('autor.nota', lesson.autor.nota, L.autor.nota) }
  lesson.personajes?.forEach((p, i) => add(`personajes[${i}].linea`, p.linea, L.personajes.linea))
  lesson.eventos?.forEach((e, i) => add(`eventos[${i}].texto`, e.texto, L.eventos.texto))
  lesson.resumen?.forEach((m, i) => { add(`resumen[${i}].subtitulo`, m.subtitulo, L.resumen.subtitulo); add(`resumen[${i}].texto`, m.texto, L.resumen.texto) })
  if (lesson.jesusAqui) add('jesusAqui.texto', lesson.jesusAqui.texto, L.jesusAqui.texto)
  add('mundo', lesson.mundo, L.mundo)
  add('antes', lesson.antes, L.antesDespues)
  add('despues', lesson.despues, L.antesDespues)
  lesson.conexiones?.forEach((c, i) => add(`conexiones[${i}].motivo`, c.motivo, L.conexiones.motivo))
  if (lesson.paraTuVida) { add('paraTuVida.aplicacion', lesson.paraTuVida.aplicacion); add('paraTuVida.pregunta', lesson.paraTuVida.pregunta) }
  add('meditar', lesson.meditar, L.meditar)
  if (lesson.ninos) { add('ninos.pregunta', lesson.ninos.pregunta, L.ninos); add('ninos.actividad', lesson.ninos.actividad, L.ninos) }
  lesson.quiz?.forEach((q, i) => {
    add(`quiz[${i}].pregunta`, q.pregunta, L.quiz.pregunta)
    q.opciones?.forEach((o, j) => add(`quiz[${i}].opciones[${j}]`, o, L.quiz.opcion))
    add(`quiz[${i}].explicacion`, q.explicacion, L.quiz.explicacion)
  })
  lesson.otraMirada?.forEach((o, i) => add(`otraMirada[${i}].texto`, o.texto, L.otraMirada.texto))
  if (lesson.notaEcumenica) add('notaEcumenica', lesson.notaEcumenica, L.notaEcumenica)
  return items
}

const CITA = /((?:[1-3] )?(?:Génesis|Éxodo|Levítico|Números|Deuteronomio|Josué|Jueces|Rut|Samuel|Reyes|Crónicas|Esdras|Nehemías|Ester|Job|Salmos?|Proverbios|Eclesiastés|Cantares|Isaías|Jeremías|Lamentaciones|Ezequiel|Daniel|Oseas|Joel|Amós|Abdías|Jonás|Miqueas|Nahúm|Habacuc|Sofonías|Hageo|Zacarías|Malaquías|Mateo|Marcos|Lucas|Juan|Hechos|Romanos|Corintios|Gálatas|Efesios|Filipenses|Colosenses|Tesalonicenses|Timoteo|Tito|Filemón|Hebreos|Santiago|Pedro|Judas|Apocalipsis) \d+:\d+(?:[-–]\d+(?::\d+)?)?)/g

export function validarLeccion(lesson, ctx) {
  const out = { errores: [], avisos: [], info: [] }
  const E = (m) => out.errores.push(m)
  const W = (m) => out.avisos.push(m)
  const L = LIMITES
  const m = ctx.maestra.lecciones.find((x) => x.id === lesson.id)
  if (!m) { E(`id "${lesson.id}" no está en maestra.json`); return out }
  const marco = m.formato === 'marco'

  // Same identity and dates as the master table.
  for (const k of ['orden', 'seccion', 'formato', 'titulo']) if (lesson[k] !== m[k]) E(`${k}: "${lesson[k]}" ≠ maestra "${m[k]}"`)
  for (const k of ['pasajes', 'libros', 'fecha']) if (JSON.stringify(lesson[k]) !== JSON.stringify(m[k])) E(`${k}: distinto de maestra.json (cópialo tal cual)`)

  const pasajes = (lesson.pasajes ?? []).map(parseOsis)
  pasajes.forEach((r, i) => { if (typeof r === 'string') E(`pasajes[${i}]: ${r}`) })
  const lessonSet = ordinalSet(pasajes.filter((r) => typeof r !== 'string'))
  if (lesson.fecha) checkFecha(lesson.fecha, 'fecha', out)
  if (lesson.fechaEscrito) checkFecha(lesson.fechaEscrito, 'fechaEscrito', out)
  if (lesson.libros?.length && (!lesson.autor || !lesson.fechaEscrito)) W('abre la ficha de un libro: conviene traer autor y fechaEscrito')

  // Level 1.
  if (!Array.isArray(lesson.enUnMinuto) || lesson.enUnMinuto.length !== L.enUnMinuto.frases) E(`enUnMinuto: deben ser ${L.enUnMinuto.frases} frases`)
  else {
    const total = lesson.enUnMinuto.reduce((n, t) => n + palabras(t), 0)
    if (total > L.enUnMinuto.total) E(`enUnMinuto: ${total} palabras (máx. ${L.enUnMinuto.total})`)
    lesson.enUnMinuto.forEach((t, i) => { if (frases(t).length !== 1) E(`enUnMinuto[${i}]: una sola frase por elemento`) })
  }

  // Key verse: exact RV1909.
  const v = lesson.versiculo
  if (!v || !isStr(v.texto) || !isStr(v.referencia)) E('versiculo: faltan texto/referencia')
  else {
    if (v.version !== 'RV1909') E('versiculo.version: debe ser "RV1909"')
    if (palabras(v.texto) > L.versiculo) E(`versiculo: ${palabras(v.texto)} palabras (máx. ${L.versiculo})`)
    const r = parseRefEs(v.referencia)
    if (typeof r === 'string') E(`versiculo.referencia: ${r}`)
    else {
      const oficial = textoDe(r)
      if (oficial !== v.texto.trim()) {
        if (oficial.toLowerCase() === v.texto.trim().toLowerCase()) W(`versiculo: difiere solo en mayúsculas de la RV1909 modernizada:\n      RV1909: ${oficial}`)
        else E(`versiculo: no es el texto exacto de la RV1909 (acentuación modernizada):\n      escrito: ${v.texto}\n      RV1909:  ${oficial}`)
      }
      if (!inside(r, lessonSet)) W(`versiculo: ${v.referencia} está fuera de los pasajes de la lección`)
    }
    if (v.rvr1960 !== undefined && palabras(v.rvr1960) > L.versiculo) E('versiculo.rvr1960: demasiado largo')
  }

  if (!lesson.lugar || !isStr(lesson.lugar.nombre)) E('lugar.nombre: falta')
  else {
    if (palabras(lesson.lugar.nombre) > L.lugar) E(`lugar.nombre: máx. ${L.lugar} palabras`)
    if (!SECCIONES.includes(lesson.lugar.mapa)) E(`lugar.mapa: debe ser el id de una era (${ERAS.join(', ')})`)
  }

  const count = (arr, name, { min, max }) => {
    if (!Array.isArray(arr)) return E(`${name}: falta`), false
    if (arr.length < min || arr.length > max) E(`${name}: ${arr.length} elementos (entre ${min} y ${max})`)
    return true
  }

  if (!marco || lesson.personajes?.length) {
    if (count(lesson.personajes, 'personajes', L.personajes))
      for (const p of lesson.personajes) {
        const g = ctx.personajes.get(p.id)
        if (!g) E(`personajes: "${p.id}" no está en personajes.json`)
        else if (!g.lecciones.includes(lesson.id)) W(`personajes: "${p.id}" no lista esta lección en personajes.json`)
        if (!isStr(p.nombre) || !isStr(p.linea)) E(`personajes "${p.id}": faltan nombre/linea`)
      }
  }
  if (!marco || lesson.eventos?.length) {
    if (count(lesson.eventos, 'eventos', L.eventos))
      lesson.eventos.forEach((e, i) => {
        const r = parseRefEs(e.ref ?? '')
        if (typeof r === 'string') E(`eventos[${i}].ref: ${r}`)
        else if (!inside(r, lessonSet)) E(`eventos[${i}].ref: ${e.ref} está fuera de los pasajes de la lección`)
      })
  }

  if (count(lesson.resumen, 'resumen', L.resumen)) {
    const total = lesson.resumen.reduce((n, x) => n + palabras(x.texto), 0)
    const [lo, hi] = L.resumen.total[m.formato]
    if (total < lo || total > hi) E(`resumen: ${total} palabras en total (entre ${lo} y ${hi} para formato "${m.formato}")`)
    out.info.push(`resumen: ${total} palabras`)
  }

  if (!lesson.jesusAqui || !isStr(lesson.jesusAqui.texto)) E('jesusAqui.texto: falta')
  else if (count(lesson.jesusAqui.refs, 'jesusAqui.refs', L.jesusAqui.refs)) {
    const rs = lesson.jesusAqui.refs.map(parseRefEs)
    rs.forEach((r, i) => { if (typeof r === 'string') E(`jesusAqui.refs[${i}]: ${r}`) })
    const at = !BOOK_BY_OSIS.get(parseOsis(lesson.pasajes?.[0] ?? '')?.b ?? 'Gen')?.nt
    if (at && !marco && !rs.some((r) => typeof r !== 'string' && BOOK_BY_OSIS.get(r.b).nt)) E('jesusAqui.refs: una lección del AT necesita al menos una referencia del NT')
  }

  for (const k of ['mundo', 'antes', 'despues', 'meditar']) if (!isStr(lesson[k])) E(`${k}: falta`)

  if (count(lesson.conexiones, 'conexiones', L.conexiones))
    lesson.conexiones.forEach((c, i) => {
      const r = parseRefEs(c.ref ?? '')
      if (typeof r === 'string') return E(`conexiones[${i}].ref: ${r}`)
      if (!isStr(c.motivo)) E(`conexiones[${i}].motivo: falta`)
      const votes = xrefBetween(r, lessonSet)
      if (votes === null) E(`conexiones[${i}]: ${c.ref} no es una referencia cruzada de OpenBible para esta lección`)
      else out.info.push(`conexión ${c.ref}: OpenBible, ${votes} votos`)
    })

  if (count(lesson.glosario, 'glosario', L.glosario)) {
    const texto = plain(prosa(lesson).map(([, t]) => t).join(' '))
    for (const id of lesson.glosario) {
      const g = ctx.glosario.get(id)
      if (!g) { E(`glosario: "${id}" no está en glosario.json`); continue }
      const raiz = plain(g.termino).split(/[\s(]/)[0]
      if (!texto.includes(raiz.slice(0, Math.max(4, raiz.length - 2)))) W(`glosario: "${g.termino}" no aparece en el texto de la lección`)
    }
  }

  if (!lesson.paraTuVida || !isStr(lesson.paraTuVida.aplicacion) || !isStr(lesson.paraTuVida.pregunta)) E('paraTuVida: faltan aplicacion/pregunta')
  else {
    const n = palabras(lesson.paraTuVida.aplicacion) + palabras(lesson.paraTuVida.pregunta)
    if (n > L.paraTuVida) E(`paraTuVida: ${n} palabras (máx. ${L.paraTuVida})`)
    if (!lesson.paraTuVida.pregunta.trim().endsWith('?')) E('paraTuVida.pregunta: debe ser una pregunta (¿…?)')
  }

  if (!marco || lesson.ninos) {
    if (!lesson.ninos || !isStr(lesson.ninos.pregunta) || !isStr(lesson.ninos.actividad)) E('ninos: faltan pregunta/actividad')
  }

  if (!marco || lesson.quiz) {
    if (!Array.isArray(lesson.quiz) || lesson.quiz.length !== L.quiz.preguntas) E(`quiz: deben ser ${L.quiz.preguntas} preguntas`)
    else {
      const niveles = lesson.quiz.map((q) => q.nivel).sort().join(',')
      if (niveles !== [...NIVELES_QUIZ].sort().join(',')) E(`quiz: una pregunta de cada nivel (${NIVELES_QUIZ.join(', ')})`)
      lesson.quiz.forEach((q, i) => {
        if (!Array.isArray(q.opciones) || q.opciones.length !== L.quiz.opciones) E(`quiz[${i}]: ${L.quiz.opciones} opciones`)
        else if (new Set(q.opciones.map(plain)).size !== q.opciones.length) E(`quiz[${i}]: opciones repetidas`)
        if (![0, 1, 2].includes(q.correcta)) E(`quiz[${i}].correcta: 0, 1 o 2`)
        if (!isStr(q.pregunta) || !q.pregunta.trim().endsWith('?')) E(`quiz[${i}].pregunta: debe ser una pregunta (¿…?)`)
      })
      const pos = lesson.quiz.map((q) => q.correcta)
      if (new Set(pos).size === 1) W('quiz: la respuesta correcta está siempre en la misma posición')
    }
  }

  if (!lesson.leer || !Array.isArray(lesson.leer.capitulos) || !lesson.leer.capitulos.length) E('leer.capitulos: falta')
  else {
    let ws = 0
    for (const c of lesson.leer.capitulos) {
      const r = parseOsis(c)
      if (typeof r === 'string') { E(`leer.capitulos: ${r}`); continue }
      if (!/^[1-3]?[A-Z][a-z]+\.\d+$/.test(c)) E(`leer.capitulos: usa capítulos enteros ("Gen.22"), no "${c}"`)
      if (!overlaps(r, lessonSet)) E(`leer.capitulos: ${c} está fuera de los pasajes de la lección`)
      ws += palabras(textoDe(r))
    }
    const calc = Math.max(1, Math.round(ws / L.palabrasPorMinuto))
    if (!Number.isInteger(lesson.leer.minutos) || Math.abs(lesson.leer.minutos - calc) > Math.max(2, calc * 0.25))
      E(`leer.minutos: ${lesson.leer.minutos}; a ${L.palabrasPorMinuto} palabras/min son ~${calc} min (${ws} palabras)`)
  }

  if (lesson.otraMirada !== undefined) {
    if (!Array.isArray(lesson.otraMirada) || lesson.otraMirada.length > L.otraMirada.max) E(`otraMirada: máx. ${L.otraMirada.max}`)
    else lesson.otraMirada.forEach((o, i) => { if (!BOOK_BY_OSIS.has(o.libro)) E(`otraMirada[${i}].libro: id OSIS ("Matt", "1Chr"), no "${o.libro}"`) })
  }
  if (count(lesson.temas, 'temas', L.temas)) lesson.temas.forEach((t) => { if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(t)) E(`temas: "${t}" no es un slug`) })
  if (count(lesson.cadenas, 'cadenas', L.cadenas)) lesson.cadenas.forEach((t) => { if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(t)) E(`cadenas: "${t}" no es un slug`) })

  // Every prose field: word limit, sentence length, banned words, references quoted inside the text.
  const textos = prosa(lesson)
  for (const [p, t, max] of textos) {
    if (!isStr(t)) { E(`${p}: falta`); continue }
    if (max !== null && palabras(t) > max) E(`${p}: ${palabras(t)} palabras (máx. ${max})`)
    for (const f of frases(t)) if (palabras(f) > L.fraseMax) E(`${p}: frase de ${palabras(f)} palabras (máx. ${L.fraseMax}): "${f}"`)
    tono(t, p, out)
    for (const [cita] of t.matchAll(CITA)) { const r = parseRefEs(cita); if (typeof r === 'string') E(`${p}: ${r}`) }
  }
  for (const [p, t] of [['titulo', lesson.titulo], ['lugar.nombre', lesson.lugar?.nombre], ['fecha.texto', lesson.fecha?.texto]]) if (t) tono(t, p, out)
  const words = textos.reduce((n, [, t]) => n + palabras(t), 0)
  const idx = inflesz(textos.filter(([p]) => !p.includes('opciones')).map(([, t]) => t))
  out.info.push(`${words} palabras nuestras · INFLESZ ${idx}`)
  if (idx < 65) W(`legibilidad INFLESZ ${idx} (< 65, "bastante fácil")`)
  return out
}

// ─── Master table, glossary, characters ─────────────────────────────

export function validarMaestra(ctx) {
  const out = { errores: [], avisos: [], info: [] }
  const E = (m) => out.errores.push(m)
  const W = (m) => out.avisos.push(m)
  const { maestra } = ctx
  const eras = new Set(maestra.eras.map((e) => e.id))
  for (const s of SECCIONES) if (!eras.has(s)) E(`eras: falta "${s}"`)
  const ids = new Set()
  const libros = new Map()
  const { chapters } = loadBible()
  const covered = new Set()
  maestra.lecciones.forEach((l, i) => {
    const d = `lección ${l.orden} "${l.id}"`
    if (ids.has(l.id)) E(`${d}: id repetido`)
    ids.add(l.id)
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(l.id)) E(`${d}: id no es un slug`)
    if (l.orden !== i + 1) E(`${d}: orden debería ser ${i + 1}`)
    if (!SECCIONES.includes(l.seccion)) E(`${d}: seccion "${l.seccion}"`)
    if (!FORMATOS.includes(l.formato)) E(`${d}: formato "${l.formato}"`)
    if (palabras(l.titulo) > LIMITES.maestra.titulo) E(`${d}: título de ${palabras(l.titulo)} palabras`)
    tono(l.titulo, `${d} titulo`, out)
    if (l.anterior !== (maestra.lecciones[i - 1]?.id ?? null)) E(`${d}: anterior incorrecto`)
    if (l.siguiente !== (maestra.lecciones[i + 1]?.id ?? null)) E(`${d}: siguiente incorrecto`)
    if (l.pasajes.length < LIMITES.pasajes.min || l.pasajes.length > LIMITES.pasajes.max) E(`${d}: ${l.pasajes.length} pasajes`)
    for (const p of l.pasajes) {
      const r = parseOsis(p)
      if (typeof r === 'string') E(`${d}: ${r}`)
      else for (const [o, c] of versesOf(r)) covered.add(`${o}.${c}`)
    }
    if (l.fecha === null) { if (l.formato !== 'marco') E(`${d}: fecha null solo en introducción/conclusión`) }
    else {
      checkFecha(l.fecha, `${d} fecha`, out)
      if (!['hechos', 'escritura'].includes(l.fechaDe)) E(`${d}: fechaDe debe ser "hechos" o "escritura"`)
    }
    for (const b of l.libros) {
      if (!BOOK_BY_OSIS.has(b)) E(`${d}: libro "${b}"`)
      if (libros.has(b)) E(`${d}: la ficha de ${b} ya abre en ${libros.get(b)}`)
      libros.set(b, l.id)
    }
  })
  for (const b of BOOKS) if (!libros.has(b.osis)) E(`libros: ${b.osis} (${b.es}) no abre en ninguna lección`)
  const missing = []
  for (const b of BOOKS) chapters[b.osis].forEach((_, ci) => { if (!covered.has(`${b.osis}.${ci + 1}`)) missing.push(`${b.osis}.${ci + 1}`) })
  if (missing.length) E(`capítulos sin lección (${missing.length}): ${missing.slice(0, 30).join(', ')}${missing.length > 30 ? '…' : ''}`)
  const total = Object.values(chapters).reduce((n, c) => n + c.length, 0)
  out.info.push(`${maestra.lecciones.length} lecciones · ${covered.size}/${total} capítulos cubiertos · ${libros.size}/66 fichas de libro`)
  const porSeccion = SECCIONES.map((s) => `${s} ${maestra.lecciones.filter((l) => l.seccion === s).length}`)
  out.info.push(porSeccion.join(' · '))
  // Dates should not go backwards by more than a century inside the story (profets and letters overlap a little).
  maestra.lecciones.reduce((prev, l) => {
    if (l.fecha?.desde != null && prev?.fecha?.desde != null && l.fecha.desde < prev.fecha.desde - 100) W(`${l.id}: su fecha (${l.fecha.desde}) va muy atrás respecto de ${prev.id} (${prev.fecha.desde})`)
    return l.fecha?.desde != null ? l : prev
  }, null)

  // Glossary.
  const gids = new Set()
  for (const g of ctx.glosarioList) {
    if (gids.has(g.id)) E(`glosario: id repetido "${g.id}"`)
    gids.add(g.id)
    if (!isStr(g.termino) || !isStr(g.definicion)) E(`glosario "${g.id}": faltan termino/definicion`)
    else {
      if (palabras(g.definicion) > LIMITES.glosarioDefinicion) E(`glosario "${g.id}": definición de ${palabras(g.definicion)} palabras`)
      for (const f of frases(g.definicion)) if (palabras(f) > LIMITES.fraseMax) E(`glosario "${g.id}": frase larga`)
      tono(g.definicion, `glosario "${g.id}"`, out)
    }
  }
  out.info.push(`glosario: ${gids.size} términos`)

  // Characters.
  const pids = new Set()
  const allText = plain(Object.values(chapters).flat(2).join(' '))
  for (const p of ctx.personajesList) {
    if (pids.has(p.id)) E(`personajes: id repetido "${p.id}"`)
    pids.add(p.id)
    if (!isStr(p.nombre) || !isStr(p.linea)) E(`personaje "${p.id}": faltan nombre/linea`)
    else {
      if (palabras(p.linea) > LIMITES.personajeLinea) E(`personaje "${p.id}": línea de ${palabras(p.linea)} palabras`)
      tono(p.linea, `personaje "${p.id}"`, out)
      // Our spelling may be the modern one (RVR1960); then `rv1909` gives the old spelling.
      const first = plain(p.rv1909 ?? p.nombre).split(/[\s,(/-]/)[0]
      if (!allText.includes(first)) W(`personaje "${p.id}": "${p.rv1909 ?? p.nombre}" no aparece así en la RV1909 (añade "rv1909")`)
    }
    if (!Array.isArray(p.lecciones) || !p.lecciones.length) E(`personaje "${p.id}": sin lecciones`)
    else for (const id of p.lecciones) if (!ids.has(id)) E(`personaje "${p.id}": lección "${id}" no existe`)
  }
  out.info.push(`personajes: ${pids.size}`)
  return out
}

// ─── CLI ────────────────────────────────────────────────────────────

export function contexto() {
  const maestra = readJson(path.join(HERE, 'maestra.json'))
  const glosarioList = fs.existsSync(path.join(HERE, 'glosario.json')) ? readJson(path.join(HERE, 'glosario.json')) : []
  const personajesList = fs.existsSync(path.join(HERE, 'personajes.json')) ? readJson(path.join(HERE, 'personajes.json')) : []
  return {
    maestra,
    glosarioList,
    personajesList,
    glosario: new Map(glosarioList.map((g) => [g.id, g])),
    personajes: new Map(personajesList.map((p) => [p.id, p])),
  }
}

function report(name, out) {
  const ok = out.errores.length === 0
  console.log(`\n${ok ? 'OK   ' : 'ERROR'} ${name}  (${out.errores.length} errores, ${out.avisos.length} avisos)`)
  for (const i of out.info) console.log(`   · ${i}`)
  for (const e of out.errores) console.log(`   ✗ ${e}`)
  for (const w of out.avisos) console.log(`   ! ${w}`)
  return ok
}

/** Spanish reference of a verse ordinal range ("Juan 1:29", "Hechos 3:25-26"). */
function refEs(o1, o2) {
  const { ordinal } = loadBible()
  if (!refEs.back) { refEs.back = []; for (const [k, n] of Object.entries(ordinal)) refEs.back[n] = k }
  const [b1, c1, v1] = refEs.back[o1].split('.')
  const [b2, c2, v2] = refEs.back[o2].split('.')
  const es = osisToEs(b1)
  if (o1 === o2) return `${es} ${c1}:${v1}`
  if (b1 === b2 && c1 === c2) return `${es} ${c1}:${v1}-${v2}`
  return b1 === b2 ? `${es} ${c1}:${v1}-${c2}:${v2}` : `${es} ${c1}:${v1}`
}

/** Writers' helper: the strongest OpenBible links from a lesson to verses outside it. */
function listarXrefs(id, ctx, min) {
  const m = ctx.maestra.lecciones.find((l) => l.id === id)
  if (!m) return console.log(`No existe la lección "${id}" en maestra.json`)
  const set = ordinalSet(m.pasajes.map(parseOsis))
  const rows = loadXrefs().filter(([from, t1]) => set.has(from) && !set.has(t1)).filter((r) => r[3] >= min).sort((a, b) => b[3] - a[3])
  console.log(`${m.titulo} — ${rows.length} referencias cruzadas con ${min}+ votos (OpenBible.info, CC-BY)\n`)
  const nt = (o) => BOOK_BY_OSIS.get(refEs.back?.[o]?.split('.')[0] ?? 'Gen')?.nt
  for (const [from, t1, t2, votes] of rows.slice(0, 60)) {
    refEs(from, from)
    console.log(`${String(votes).padStart(4)}  ${refEs(from, from).padEnd(22)} → ${refEs(t1, t2)}${nt(t1) ? '  [NT]' : ''}`)
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const args = process.argv.slice(2)
  // Helpers for writers:
  //   --texto "Génesis 22:8"        exact RV1909 text with modernized accents (to paste in `versiculo`)
  //   --xrefs genesis-12-50 [20]    strongest real cross-references of a lesson (for `conexiones` and `jesusAqui`)
  if (args[0] === '--texto') {
    for (const r of args.slice(1)) { const p = parseRefEs(r); console.log(typeof p === 'string' ? p : `${r}: ${textoDe(p)}`) }
    process.exit(0)
  }
  if (args[0] === '--xrefs') { listarXrefs(args[1], contexto(), Number(args[2] ?? 20)); process.exit(0) }
  const ctx = contexto()
  let ok = true
  const onlyMaestra = args.includes('--maestra')
  let files = args.filter((a) => !a.startsWith('--'))
  if (!files.length || onlyMaestra) ok = report('maestra.json + glosario.json + personajes.json', validarMaestra(ctx)) && ok
  if (!files.length && !onlyMaestra) files = [path.join(HERE, 'lecciones')]
  const expand = (f) => {
    const p = path.isAbsolute(f) ? f : fs.existsSync(f) ? path.resolve(f) : path.join(HERE, f)
    if (!fs.existsSync(p)) return []
    return fs.statSync(p).isDirectory() ? fs.readdirSync(p).filter((x) => x.endsWith('.json')).map((x) => path.join(p, x)) : [p]
  }
  for (const f of onlyMaestra ? [] : files.flatMap(expand)) {
    let lesson
    try { lesson = readJson(f) } catch (e) { ok = report(path.basename(f), { errores: [`JSON inválido: ${e.message}`], avisos: [], info: [] }) && ok; continue }
    ok = report(path.basename(f), validarLeccion(lesson, ctx)) && ok
  }
  process.exit(ok ? 0 : 1)
}
