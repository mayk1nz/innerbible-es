import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ChapterReader } from '@/components/views/BibleView'
import { bookById } from '@/lib/biblia'

type Props = { params: Promise<{ libro: string; capitulo: string }> }

function parse(libro: string, capitulo: string) {
  const book = bookById(libro)
  const chapter = Number(capitulo)
  return book && Number.isInteger(chapter) && chapter >= 1 && chapter <= book.capitulos ? { book, chapter } : null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { libro, capitulo } = await params
  const p = parse(libro, capitulo)
  return { title: p ? `${p.book.nombre} ${p.chapter}` : 'La Biblia' }
}

export default async function Page({ params }: Props) {
  const { libro, capitulo } = await params
  const p = parse(libro, capitulo)
  if (!p) notFound()
  return <ChapterReader key={`${p.book.id}/${p.chapter}`} bookId={p.book.id} chapter={p.chapter} />
}
