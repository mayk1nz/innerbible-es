import { BOOKS, type BibleBook } from './biblia'
import { normalize } from './text'

// Reads a Bible reference the way people type it: "Génesis 22", "gen 22:8", "Jn 3 16",
// "1 reyes 19", "1re 19:4-8", "Salmo 23". Returns null when the text is not a reference
// (then the search treats it as a topic or a person).

export interface Ref {
  book: BibleBook
  chapter: number
  /** Verse range inside the chapter; absent = the whole chapter. */
  from?: number
  to?: number
}

// Extra ways to write a book (besides its name and abbreviation).
const ALIASES: Record<string, string> = {
  genesis: 'Gen', gen: 'Gen', gn: 'Gen', exodo: 'Exod', ex: 'Exod', levitico: 'Lev', lv: 'Lev', numeros: 'Num', num: 'Num', nm: 'Num',
  deuteronomio: 'Deut', deut: 'Deut', dt: 'Deut', josue: 'Josh', jos: 'Josh', jueces: 'Judg', jue: 'Judg', rut: 'Ruth', ruth: 'Ruth',
  '1samuel': '1Sam', '1sam': '1Sam', '1s': '1Sam', '2samuel': '2Sam', '2sam': '2Sam', '2s': '2Sam', '1reyes': '1Kgs', '1re': '1Kgs', '1r': '1Kgs',
  '2reyes': '2Kgs', '2re': '2Kgs', '2r': '2Kgs', '1cronicas': '1Chr', '1cr': '1Chr', '2cronicas': '2Chr', '2cr': '2Chr', esdras: 'Ezra', esd: 'Ezra',
  nehemias: 'Neh', neh: 'Neh', ester: 'Esth', est: 'Esth', job: 'Job', salmos: 'Ps', salmo: 'Ps', sal: 'Ps', sl: 'Ps', proverbios: 'Prov', prov: 'Prov', pr: 'Prov',
  eclesiastes: 'Eccl', ecl: 'Eccl', ec: 'Eccl', cantares: 'Song', cantar: 'Song', cantardeloscantares: 'Song', cnt: 'Song', isaias: 'Isa', is: 'Isa',
  jeremias: 'Jer', jer: 'Jer', lamentaciones: 'Lam', lm: 'Lam', ezequiel: 'Ezek', ez: 'Ezek', daniel: 'Dan', dn: 'Dan', oseas: 'Hos', os: 'Hos',
  joel: 'Joel', jl: 'Joel', amos: 'Amos', am: 'Amos', abdias: 'Obad', abd: 'Obad', jonas: 'Jonah', jon: 'Jonah', miqueas: 'Mic', mi: 'Mic',
  nahum: 'Nah', nah: 'Nah', habacuc: 'Hab', hab: 'Hab', sofonias: 'Zeph', sof: 'Zeph', hageo: 'Hag', hag: 'Hag', zacarias: 'Zech', zac: 'Zech',
  malaquias: 'Mal', mal: 'Mal', mateo: 'Matt', mt: 'Matt', marcos: 'Mark', mc: 'Mark', mr: 'Mark', lucas: 'Luke', lc: 'Luke', juan: 'John', jn: 'John',
  hechos: 'Acts', hch: 'Acts', hech: 'Acts', romanos: 'Rom', rom: 'Rom', ro: 'Rom', '1corintios': '1Cor', '1co': '1Cor', '1cor': '1Cor',
  '2corintios': '2Cor', '2co': '2Cor', '2cor': '2Cor', galatas: 'Gal', gal: 'Gal', ga: 'Gal', efesios: 'Eph', ef: 'Eph', filipenses: 'Phil', fil: 'Phil', flp: 'Phil',
  colosenses: 'Col', col: 'Col', '1tesalonicenses': '1Thess', '1ts': '1Thess', '1tes': '1Thess', '2tesalonicenses': '2Thess', '2ts': '2Thess', '2tes': '2Thess',
  '1timoteo': '1Tim', '1ti': '1Tim', '1tim': '1Tim', '2timoteo': '2Tim', '2ti': '2Tim', '2tim': '2Tim', tito: 'Titus', tit: 'Titus', filemon: 'Phlm', flm: 'Phlm',
  hebreos: 'Heb', heb: 'Heb', he: 'Heb', santiago: 'Jas', stg: 'Jas', sant: 'Jas', '1pedro': '1Pet', '1p': '1Pet', '1pe': '1Pet', '2pedro': '2Pet', '2p': '2Pet', '2pe': '2Pet',
  '1juan': '1John', '1jn': '1John', '2juan': '2John', '2jn': '2John', '3juan': '3John', '3jn': '3John', judas: 'Jude', jud: 'Jude', apocalipsis: 'Rev', ap: 'Rev', apoc: 'Rev',
}

const byKey = new Map<string, BibleBook>()
for (const b of BOOKS) {
  byKey.set(normalize(b.nombre).replace(/\s+/g, ''), b)
  byKey.set(normalize(b.abrev).replace(/\s+/g, ''), b)
}
for (const [k, id] of Object.entries(ALIASES)) {
  const b = BOOKS.find((x) => x.id === id)
  if (b) byKey.set(k, b)
}

export function parseRef(input: string): Ref | null {
  // "primera de juan" / "i juan" / "1a juan" → "1juan"
  const q = normalize(input)
    .replace(/^(primera|primer|1a|1ra|i)\s+(de\s+)?/, '1')
    .replace(/^(segunda|segundo|2a|2da|ii)\s+(de\s+)?/, '2')
    .replace(/^(tercera|tercer|3a|3ra|iii)\s+(de\s+)?/, '3')
  const m = q.match(/^([123]?\s*[a-zñ]+(?:\s+(?:de\s+los\s+)?[a-zñ]+)?)\.?\s*(\d{1,3})(?:\s*[:.,\s]\s*(\d{1,3})(?:\s*-\s*(\d{1,3}))?)?$/)
  if (!m) return null
  const book = byKey.get(m[1].replace(/\s+/g, ''))
  if (!book) return null
  const chapter = Number(m[2])
  if (chapter < 1 || chapter > book.capitulos) return null
  const from = m[3] ? Number(m[3]) : undefined
  const to = m[4] ? Number(m[4]) : from
  return { book, chapter, from, to: to && from && to >= from ? to : from }
}

/** "Génesis 22:8" / "Génesis 22:6-8" / "Génesis 22". */
export function formatRef(r: { book: BibleBook; chapter: number; from?: number; to?: number }): string {
  if (!r.from) return `${r.book.nombre} ${r.chapter}`
  return `${r.book.nombre} ${r.chapter}:${r.from}${r.to && r.to !== r.from ? `-${r.to}` : ''}`
}
