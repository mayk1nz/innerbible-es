// The 66 books of the Bible (the ones every Christian Bible shares), in canonical order.
// `id` is the OSIS code used by the open datasets (cross references, dates) and by the
// files in public/biblia/<id>.json (Reina-Valera 1909, public domain).

export interface BibleBook {
  id: string
  nombre: string
  /** Short form for references ("Gn 22:8"). */
  abrev: string
  testamento: 'AT' | 'NT'
  capitulos: number
}

export const BOOKS: BibleBook[] = [
  { id: 'Gen', nombre: 'Génesis', abrev: 'Gn', testamento: 'AT', capitulos: 50 },
  { id: 'Exod', nombre: 'Éxodo', abrev: 'Éx', testamento: 'AT', capitulos: 40 },
  { id: 'Lev', nombre: 'Levítico', abrev: 'Lv', testamento: 'AT', capitulos: 27 },
  { id: 'Num', nombre: 'Números', abrev: 'Nm', testamento: 'AT', capitulos: 36 },
  { id: 'Deut', nombre: 'Deuteronomio', abrev: 'Dt', testamento: 'AT', capitulos: 34 },
  { id: 'Josh', nombre: 'Josué', abrev: 'Jos', testamento: 'AT', capitulos: 24 },
  { id: 'Judg', nombre: 'Jueces', abrev: 'Jue', testamento: 'AT', capitulos: 21 },
  { id: 'Ruth', nombre: 'Rut', abrev: 'Rt', testamento: 'AT', capitulos: 4 },
  { id: '1Sam', nombre: '1 Samuel', abrev: '1 S', testamento: 'AT', capitulos: 31 },
  { id: '2Sam', nombre: '2 Samuel', abrev: '2 S', testamento: 'AT', capitulos: 24 },
  { id: '1Kgs', nombre: '1 Reyes', abrev: '1 R', testamento: 'AT', capitulos: 22 },
  { id: '2Kgs', nombre: '2 Reyes', abrev: '2 R', testamento: 'AT', capitulos: 25 },
  { id: '1Chr', nombre: '1 Crónicas', abrev: '1 Cr', testamento: 'AT', capitulos: 29 },
  { id: '2Chr', nombre: '2 Crónicas', abrev: '2 Cr', testamento: 'AT', capitulos: 36 },
  { id: 'Ezra', nombre: 'Esdras', abrev: 'Esd', testamento: 'AT', capitulos: 10 },
  { id: 'Neh', nombre: 'Nehemías', abrev: 'Neh', testamento: 'AT', capitulos: 13 },
  { id: 'Esth', nombre: 'Ester', abrev: 'Est', testamento: 'AT', capitulos: 10 },
  { id: 'Job', nombre: 'Job', abrev: 'Job', testamento: 'AT', capitulos: 42 },
  { id: 'Ps', nombre: 'Salmos', abrev: 'Sal', testamento: 'AT', capitulos: 150 },
  { id: 'Prov', nombre: 'Proverbios', abrev: 'Pr', testamento: 'AT', capitulos: 31 },
  { id: 'Eccl', nombre: 'Eclesiastés', abrev: 'Ec', testamento: 'AT', capitulos: 12 },
  { id: 'Song', nombre: 'Cantares', abrev: 'Cnt', testamento: 'AT', capitulos: 8 },
  { id: 'Isa', nombre: 'Isaías', abrev: 'Is', testamento: 'AT', capitulos: 66 },
  { id: 'Jer', nombre: 'Jeremías', abrev: 'Jer', testamento: 'AT', capitulos: 52 },
  { id: 'Lam', nombre: 'Lamentaciones', abrev: 'Lm', testamento: 'AT', capitulos: 5 },
  { id: 'Ezek', nombre: 'Ezequiel', abrev: 'Ez', testamento: 'AT', capitulos: 48 },
  { id: 'Dan', nombre: 'Daniel', abrev: 'Dn', testamento: 'AT', capitulos: 12 },
  { id: 'Hos', nombre: 'Oseas', abrev: 'Os', testamento: 'AT', capitulos: 14 },
  { id: 'Joel', nombre: 'Joel', abrev: 'Jl', testamento: 'AT', capitulos: 3 },
  { id: 'Amos', nombre: 'Amós', abrev: 'Am', testamento: 'AT', capitulos: 9 },
  { id: 'Obad', nombre: 'Abdías', abrev: 'Abd', testamento: 'AT', capitulos: 1 },
  { id: 'Jonah', nombre: 'Jonás', abrev: 'Jon', testamento: 'AT', capitulos: 4 },
  { id: 'Mic', nombre: 'Miqueas', abrev: 'Mi', testamento: 'AT', capitulos: 7 },
  { id: 'Nah', nombre: 'Nahúm', abrev: 'Nah', testamento: 'AT', capitulos: 3 },
  { id: 'Hab', nombre: 'Habacuc', abrev: 'Hab', testamento: 'AT', capitulos: 3 },
  { id: 'Zeph', nombre: 'Sofonías', abrev: 'Sof', testamento: 'AT', capitulos: 3 },
  { id: 'Hag', nombre: 'Hageo', abrev: 'Hag', testamento: 'AT', capitulos: 2 },
  { id: 'Zech', nombre: 'Zacarías', abrev: 'Zac', testamento: 'AT', capitulos: 14 },
  { id: 'Mal', nombre: 'Malaquías', abrev: 'Mal', testamento: 'AT', capitulos: 4 },
  { id: 'Matt', nombre: 'Mateo', abrev: 'Mt', testamento: 'NT', capitulos: 28 },
  { id: 'Mark', nombre: 'Marcos', abrev: 'Mc', testamento: 'NT', capitulos: 16 },
  { id: 'Luke', nombre: 'Lucas', abrev: 'Lc', testamento: 'NT', capitulos: 24 },
  { id: 'John', nombre: 'Juan', abrev: 'Jn', testamento: 'NT', capitulos: 21 },
  { id: 'Acts', nombre: 'Hechos', abrev: 'Hch', testamento: 'NT', capitulos: 28 },
  { id: 'Rom', nombre: 'Romanos', abrev: 'Ro', testamento: 'NT', capitulos: 16 },
  { id: '1Cor', nombre: '1 Corintios', abrev: '1 Co', testamento: 'NT', capitulos: 16 },
  { id: '2Cor', nombre: '2 Corintios', abrev: '2 Co', testamento: 'NT', capitulos: 13 },
  { id: 'Gal', nombre: 'Gálatas', abrev: 'Gá', testamento: 'NT', capitulos: 6 },
  { id: 'Eph', nombre: 'Efesios', abrev: 'Ef', testamento: 'NT', capitulos: 6 },
  { id: 'Phil', nombre: 'Filipenses', abrev: 'Fil', testamento: 'NT', capitulos: 4 },
  { id: 'Col', nombre: 'Colosenses', abrev: 'Col', testamento: 'NT', capitulos: 4 },
  { id: '1Thess', nombre: '1 Tesalonicenses', abrev: '1 Ts', testamento: 'NT', capitulos: 5 },
  { id: '2Thess', nombre: '2 Tesalonicenses', abrev: '2 Ts', testamento: 'NT', capitulos: 3 },
  { id: '1Tim', nombre: '1 Timoteo', abrev: '1 Ti', testamento: 'NT', capitulos: 6 },
  { id: '2Tim', nombre: '2 Timoteo', abrev: '2 Ti', testamento: 'NT', capitulos: 4 },
  { id: 'Titus', nombre: 'Tito', abrev: 'Tit', testamento: 'NT', capitulos: 3 },
  { id: 'Phlm', nombre: 'Filemón', abrev: 'Flm', testamento: 'NT', capitulos: 1 },
  { id: 'Heb', nombre: 'Hebreos', abrev: 'He', testamento: 'NT', capitulos: 13 },
  { id: 'Jas', nombre: 'Santiago', abrev: 'Stg', testamento: 'NT', capitulos: 5 },
  { id: '1Pet', nombre: '1 Pedro', abrev: '1 P', testamento: 'NT', capitulos: 5 },
  { id: '2Pet', nombre: '2 Pedro', abrev: '2 P', testamento: 'NT', capitulos: 3 },
  { id: '1John', nombre: '1 Juan', abrev: '1 Jn', testamento: 'NT', capitulos: 5 },
  { id: '2John', nombre: '2 Juan', abrev: '2 Jn', testamento: 'NT', capitulos: 1 },
  { id: '3John', nombre: '3 Juan', abrev: '3 Jn', testamento: 'NT', capitulos: 1 },
  { id: 'Jude', nombre: 'Judas', abrev: 'Jud', testamento: 'NT', capitulos: 1 },
  { id: 'Rev', nombre: 'Apocalipsis', abrev: 'Ap', testamento: 'NT', capitulos: 22 },
]

/** Case-insensitive: page addresses are lowercase ("/biblia/1kgs/12"), ids are OSIS ("1Kgs"). */
export function bookById(id: string): BibleBook | undefined {
  const key = id.toLowerCase()
  return BOOKS.find((b) => b.id.toLowerCase() === key)
}

/** A book's verses: capitulos[c - 1][v - 1]. Loaded from public/biblia (cached by the browser). */
export interface BookText {
  id: string
  capitulos: string[][]
}

const cache = new Map<string, Promise<BookText>>()

export function loadBook(id: string): Promise<BookText> {
  let p = cache.get(id)
  if (!p) {
    p = fetch(`/biblia/${id}.json`).then((r) => {
      if (!r.ok) throw new Error(String(r.status))
      return r.json() as Promise<BookText>
    })
    p.catch(() => cache.delete(id))
    cache.set(id, p)
  }
  return p
}

export function chapterHref(bookId: string, chapter: number, verse?: number): string {
  return `/biblia/${bookId.toLowerCase()}/${chapter}${verse ? `#v${verse}` : ''}`
}

export const BIBLE_VERSION = 'Reina-Valera 1909'
