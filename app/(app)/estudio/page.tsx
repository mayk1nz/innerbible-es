import type { Metadata } from 'next'
import { EstudioView } from '@/components/views/EstudioView'

export const metadata: Metadata = { title: 'Tu Guía de Estudio' }

export default function Page() {
  return <EstudioView />
}
