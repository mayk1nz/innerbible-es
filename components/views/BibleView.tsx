'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Icon } from '../icons'
import { PageHeader } from '../PageHeader'
import { FontScaleControl, buttonClass } from '../ui'
import { BIBLE_VERSION, BOOKS, bookById, chapterHref, loadBook, type BibleBook, type BookText } from '@/lib/biblia'
import { useAppState } from '@/lib/store'

// The whole Bible (Reina-Valera 1909, public domain) inside the app: an index of the
// 66 books → chapters, and a reader made for long reading: big type, verse numbers
// that stay out of the way, previous/next chapter, and "continue where you left off".

const LAST_KEY = 'ib-es-biblia-last'

function readLast(): { book: string; chapter: number } | null {
  try {
    const raw = window.localStorage.getItem(LAST_KEY)
    const v = raw ? (JSON.parse(raw) as { book?: unknown; chapter?: unknown }) : null
    return v && typeof v.book === 'string' && typeof v.chapter === 'number' && bookById(v.book) ? { book: v.book, chapter: v.chapter } : null
  } catch {
    return null
  }
}

function saveLast(book: string, chapter: number) {
  try {
    window.localStorage.setItem(LAST_KEY, JSON.stringify({ book, chapter }))
  } catch {
    // storage blocked: the index simply won't offer "continue"
  }
}

// ─── Index ─────────────────────────────────────────────────────────

export function BibleIndex() {
  const [open, setOpen] = useState<string | null>(null)
  const [last] = useState(readLast)
  const lastBook = last ? bookById(last.book) : undefined

  return (
    <>
      <PageHeader back="/leer" title="La Biblia" subtitle={`Los 66 libros · ${BIBLE_VERSION}`} />

      {last && lastBook && (
        <Link
          href={chapterHref(last.book, last.chapter)}
          className="mb-6 flex items-center gap-3.5 rounded-3xl bg-primary p-4 text-white shadow-float transition active:scale-[0.99]"
        >
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-gold-bright">
            <Icon name="book" className="size-6" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[13px] font-semibold uppercase tracking-[0.08em] text-gold-bright">Continuar leyendo</span>
            <span className="block font-serif text-[19px] font-semibold">
              {lastBook.nombre} {last.chapter}
            </span>
          </span>
          <Icon name="arrowRight" className="size-5 text-gold-bright" />
        </Link>
      )}

      {(['AT', 'NT'] as const).map((t) => (
        <section key={t} aria-labelledby={`t-${t}`} className="mb-8">
          <h2 id={`t-${t}`} className="mb-3 font-serif text-[21px] font-semibold text-ink">
            {t === 'AT' ? 'Antiguo Testamento' : 'Nuevo Testamento'}
          </h2>
          <ul className="grid grid-cols-2 gap-2">
            {BOOKS.filter((b) => b.testamento === t).map((b) => (
              <BookItem key={b.id} book={b} open={open === b.id} onToggle={() => setOpen(open === b.id ? null : b.id)} />
            ))}
          </ul>
        </section>
      ))}
    </>
  )
}

function BookItem({ book, open, onToggle }: { book: BibleBook; open: boolean; onToggle: () => void }) {
  // One-chapter books open straight away.
  if (book.capitulos === 1) {
    return (
      <li>
        <Link href={chapterHref(book.id, 1)} className="flex min-h-13 flex-col items-start justify-center rounded-2xl border border-line bg-surface px-4 py-2.5 text-ink transition hover:bg-surface-hover">
          <span className="font-serif text-[16px] leading-tight">{book.nombre}</span>
          <span className="mt-0.5 text-[12.5px] text-muted">1 capítulo</span>
        </Link>
      </li>
    )
  }
  return (
    <li className={open ? 'col-span-2' : undefined}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={`flex min-h-13 w-full flex-col items-start justify-center rounded-2xl border px-4 py-2.5 text-left transition ${
          open ? 'border-primary bg-primary text-white' : 'border-line bg-surface text-ink hover:bg-surface-hover'
        }`}
      >
        <span className="font-serif text-[16px] leading-tight">{book.nombre}</span>
        <span className={`mt-0.5 text-[12.5px] ${open ? 'text-white/75' : 'text-muted'}`}>{book.capitulos} capítulos</span>
      </button>
      {open && (
        <div className="animate-rise mt-2 grid grid-cols-6 gap-1.5 rounded-2xl border border-line bg-surface-2 p-2.5">
          {Array.from({ length: book.capitulos }, (_, i) => (
            <Link
              key={i}
              href={chapterHref(book.id, i + 1)}
              aria-label={`${book.nombre} capítulo ${i + 1}`}
              className="grid aspect-square min-h-11 place-items-center rounded-xl bg-surface text-[15px] font-semibold tabular-nums text-ink transition hover:bg-gold-soft"
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </li>
  )
}

// ─── Reader ────────────────────────────────────────────────────────

export function ChapterReader({ bookId, chapter }: { bookId: string; chapter: number }) {
  const book = bookById(bookId)
  const { fontScale } = useAppState()
  const [loaded, setLoaded] = useState<{ id: string; text: BookText | null } | null>(null)
  const [picker, setPicker] = useState(false)

  const id = book?.id ?? bookId
  useEffect(() => {
    let alive = true
    loadBook(id)
      .then((text) => alive && setLoaded({ id, text }))
      .catch(() => alive && setLoaded({ id, text: null }))
    return () => {
      alive = false
    }
  }, [id])

  useEffect(() => {
    saveLast(id, chapter)
  }, [id, chapter])

  const verses = loaded?.id === id ? loaded.text?.capitulos[chapter - 1] : undefined
  const failed = loaded?.id === id && !loaded.text

  // Arriving with #v12 (from a lesson or the study search): mark that verse and bring it into view.
  const [marked] = useState(() => Number(/^#v(\d+)$/.exec(window.location.hash)?.[1] ?? 0))
  useEffect(() => {
    if (verses && marked) document.getElementById(`v${marked}`)?.scrollIntoView({ block: 'center' })
  }, [verses, marked])

  if (!book) return null
  const index = BOOKS.findIndex((b) => b.id === book.id)
  const prev = chapter > 1 ? { id: book.id, c: chapter - 1 } : index > 0 ? { id: BOOKS[index - 1].id, c: BOOKS[index - 1].capitulos } : null
  const next = chapter < book.capitulos ? { id: book.id, c: chapter + 1 } : index < BOOKS.length - 1 ? { id: BOOKS[index + 1].id, c: 1 } : null
  const label = (p: { id: string; c: number }) => `${bookById(p.id)?.nombre} ${p.c}`

  return (
    <>
      <PageHeader back="/biblia" eyebrow={BIBLE_VERSION} title={`${book.nombre} ${chapter}`} />

      <div className="mb-5 flex items-center justify-between gap-3">
        <button type="button" onClick={() => setPicker((p) => !p)} aria-expanded={picker} className="flex min-h-11 items-center gap-1.5 rounded-full border border-line bg-surface px-4 text-[15px] font-semibold text-ink">
          Capítulos
          <Icon name="chevronDown" className={`size-4 transition ${picker ? 'rotate-180' : ''}`} />
        </button>
        <FontScaleControl scale={fontScale} />
      </div>

      {picker && (
        <div className="animate-rise mb-5 grid grid-cols-6 gap-1.5 rounded-2xl border border-line bg-surface-2 p-2.5">
          {Array.from({ length: book.capitulos }, (_, i) => (
            <Link
              key={i}
              href={chapterHref(book.id, i + 1)}
              onClick={() => setPicker(false)}
              aria-current={i + 1 === chapter ? 'page' : undefined}
              className={`grid aspect-square min-h-11 place-items-center rounded-xl text-[15px] font-semibold tabular-nums transition ${
                i + 1 === chapter ? 'bg-primary text-white' : 'bg-surface text-ink hover:bg-gold-soft'
              }`}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}

      <article className="rounded-3xl border border-line bg-surface-2 px-5 py-6 shadow-card" style={{ fontSize: `${fontScale * 1.08}rem` }}>
        {failed ? (
          <p className="text-center text-[16px] text-muted">No pudimos abrir este capítulo. Revisa tu conexión e inténtalo de nuevo.</p>
        ) : !verses ? (
          <div aria-busy className="animate-pulse space-y-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 rounded bg-line-soft" style={{ width: `${92 - i * 6}%` }} />
            ))}
          </div>
        ) : (
          // One verse per line: easy to follow with the finger and to find "verse 8".
          <ol className="space-y-2.5 font-serif leading-[1.7] text-ink">
            {verses.map((v, i) =>
              // 18 slots are empty where the RV1909 numbers a passage differently (the text
              // is in the neighbouring verse, e.g. Job 38:39–41 = 39:1–3): nothing to show.
              !v.trim() ? null : (
              <li
                key={i}
                id={`v${i + 1}`}
                className={`flex scroll-mt-24 gap-2.5 rounded-xl ${i + 1 === marked ? '-mx-2 bg-gold-soft px-2 py-1.5' : ''}`}
              >
                <span className="w-6 shrink-0 select-none pt-[0.2em] text-right font-sans text-[0.7em] font-bold tabular-nums text-gold">{i + 1}</span>
                <span className="min-w-0">{v}</span>
              </li>
            ))}
          </ol>
        )}
      </article>

      <nav aria-label="Otros capítulos" className="mt-6 grid grid-cols-2 gap-3">
        {prev ? (
          <Link href={chapterHref(prev.id, prev.c)} className={buttonClass.secondary}>
            <Icon name="arrowLeft" className="size-5" />
            {label(prev)}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={chapterHref(next.id, next.c)} className={buttonClass.primary}>
            {label(next)}
            <Icon name="arrowRight" className="size-5 text-gold-bright" />
          </Link>
        ) : (
          <span />
        )}
      </nav>
      <p className="mt-4 text-center text-[13px] text-muted">Texto bíblico: {BIBLE_VERSION} (dominio público).</p>
    </>
  )
}
