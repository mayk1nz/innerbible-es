import 'server-only'
import fs from 'node:fs'
import path from 'node:path'
import { BOOKS, bookById, type BibleBook } from '../biblia'
import { formatRef, type Ref } from '../estudio-ref'

// "Tu Guía de Estudio": the chain of passages connected to what the member is studying,
// in the order they happened. The links come from open data (OpenBible.info cross
// references, built on the Treasury of Scripture Knowledge); the order from the year of
// each chapter; the text is Reina-Valera 1909. The AI only writes the explanations.

type XrefIndex = Record<string, [number, number, number][]>
type YearIndex = Record<string, number>

let xrefs: XrefIndex | null = null
let years: YearIndex | null = null
const books = new Map<string, string[][]>()

const DATA = path.join(process.cwd(), 'lib', 'server', 'estudio-data')
const BIBLE = path.join(process.cwd(), 'public', 'biblia')

function data() {
  xrefs ??= JSON.parse(fs.readFileSync(path.join(DATA, 'xrefs.json'), 'utf8')) as XrefIndex
  years ??= JSON.parse(fs.readFileSync(path.join(DATA, 'years.json'), 'utf8')) as YearIndex
  return { xrefs, years }
}

function bookText(id: string): string[][] {
  let t = books.get(id)
  if (!t) {
    t = (JSON.parse(fs.readFileSync(path.join(BIBLE, `${id}.json`), 'utf8')) as { capitulos: string[][] }).capitulos
    books.set(id, t)
  }
  return t
}

// ─── Verse numbers ─────────────────────────────────────────────────
// book (1–66) * 1_000_000 + chapter * 1_000 + verse, as in build-indice.mjs.

const bookNo = (b: BibleBook) => BOOKS.indexOf(b) + 1
const toInt = (b: BibleBook, c: number, v: number) => bookNo(b) * 1_000_000 + c * 1_000 + v
function fromInt(n: number): { book: BibleBook; chapter: number; verse: number } {
  return { book: BOOKS[Math.floor(n / 1_000_000) - 1], chapter: Math.floor((n % 1_000_000) / 1_000), verse: n % 1_000 }
}

export interface ChainLink {
  /** "Génesis 22:8". */
  ref: string
  bookId: string
  chapter: number
  from: number
  to: number
  /** Approximate year, only to order the chain (negative = a.C.). */
  year: number
  text: string
  /** The passage the member searched for. */
  origin?: boolean
}

function passage(bookId: string, chapter: number, from: number, to: number): string {
  const verses = bookText(bookId)[chapter - 1] ?? []
  return verses.slice(from - 1, to).join(' ')
}

function link(n: number, end: number, origin = false): ChainLink | null {
  const a = fromInt(n)
  if (!a.book) return null
  // A range inside the same chapter, capped so a card stays readable.
  const b = end ? fromInt(end) : a
  const to = b.book === a.book && b.chapter === a.chapter ? Math.min(b.verse, a.verse + 3) : a.verse
  const text = passage(a.book.id, a.chapter, a.verse, to)
  if (!text) return null
  return {
    ref: formatRef({ book: a.book, chapter: a.chapter, from: a.verse, to }),
    bookId: a.book.id,
    chapter: a.chapter,
    from: a.verse,
    to,
    year: data().years[String(Math.floor(n / 1_000))] ?? 0,
    text,
    origin,
  }
}

/** Canonical position, to break ties between passages of the same year. */
const canon = (l: ChainLink) => toInt(bookById(l.bookId)!, l.chapter, l.from)

export function sortChain(links: ChainLink[], order: 'cronologico' | 'canonico' = 'cronologico'): ChainLink[] {
  return [...links].sort((a, b) => (order === 'cronologico' ? a.year - b.year || canon(a) - canon(b) : canon(a) - canon(b)))
}

/**
 * The chain for a reference: the strongest links out of the verse (or out of every verse
 * of the chapter), one passage per chapter so the chain walks through the whole Bible.
 */
export function chainForRef(ref: Ref, max = 14): ChainLink[] {
  const { xrefs } = data()
  const count = bookText(ref.book.id)[ref.chapter - 1]?.length ?? 0
  const from = ref.from ?? 1
  const to = ref.to ?? count
  const sources: number[] = []
  for (let v = from; v <= to; v++) sources.push(toInt(ref.book, ref.chapter, v))

  // Score every target: votes add up when several verses of the passage point to it.
  const score = new Map<number, { votes: number; end: number }>()
  const outVotes = new Map<number, number>()
  for (const s of sources) {
    for (const [t, e, votes] of xrefs[String(s)] ?? []) {
      if (Math.floor(t / 1_000) === Math.floor(s / 1_000)) continue // same chapter: not a cross-study
      const cur = score.get(t)
      score.set(t, { votes: (cur?.votes ?? 0) + votes, end: cur?.end || e })
      outVotes.set(s, (outVotes.get(s) ?? 0) + votes)
    }
  }
  // One passage per chapter (the best one), then the strongest ones.
  const bestPerChapter = new Map<number, [number, { votes: number; end: number }]>()
  for (const [t, v] of score) {
    const ch = Math.floor(t / 1_000)
    const cur = bestPerChapter.get(ch)
    if (!cur || v.votes > cur[1].votes) bestPerChapter.set(ch, [t, v])
  }
  const picked = [...bestPerChapter.values()].sort((a, b) => b[1].votes - a[1].votes).slice(0, max)

  // The origin: the verse asked for, or the chapter's most connected verse.
  const originVerse = ref.from ? toInt(ref.book, ref.chapter, ref.from) : [...outVotes.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? sources[0]
  const origin = ref.from
    ? link(originVerse, ref.to && ref.to !== ref.from ? toInt(ref.book, ref.chapter, ref.to) : 0, true)
    : link(originVerse, 0, true)

  const links = picked.map(([t, v]) => link(t, v.end)).filter((l): l is ChainLink => Boolean(l))
  return sortChain(origin ? [origin, ...links] : links)
}

/** The chain around several starting passages (a topic or a person), merged and ordered. */
export function chainForRefs(refs: Ref[], max = 16): ChainLink[] {
  const seen = new Set<number>()
  const out: ChainLink[] = []
  // First the anchors themselves, then their strongest links, until the chain is full.
  const anchors = refs.map((r) => link(toInt(r.book, r.chapter, r.from ?? 1), r.to && r.from && r.to !== r.from ? toInt(r.book, r.chapter, r.to) : 0, true))
  for (const a of anchors) {
    if (!a) continue
    const ch = Math.floor(canon(a) / 1_000)
    if (seen.has(ch)) continue
    seen.add(ch)
    out.push(a)
  }
  for (const r of refs) {
    if (out.length >= max) break
    for (const l of chainForRef(r, 4)) {
      if (l.origin) continue
      const ch = Math.floor(canon(l) / 1_000)
      if (seen.has(ch) || out.length >= max) continue
      seen.add(ch)
      out.push(l)
    }
  }
  return sortChain(out)
}

/** A reference the AI proposed, checked against the real Bible (no invented verses). */
export function validRef(r: Ref): boolean {
  const verses = bookText(r.book.id)[r.chapter - 1]
  if (!verses) return false
  return !r.from || (r.from >= 1 && r.from <= verses.length && (!r.to || r.to <= verses.length))
}
