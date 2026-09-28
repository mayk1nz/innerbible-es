import type { Metadata } from 'next'
import { BibleIndex } from '@/components/views/BibleView'

export const metadata: Metadata = { title: 'La Biblia' }

export default function Page() {
  return <BibleIndex />
}
