import type { Metadata } from 'next'
import { PrintSheet } from '@/components/ninos/PrintSheet'

export const metadata: Metadata = { title: 'Hoja para imprimir' }

type Props = { params: Promise<{ id: string }> }

export default async function Page({ params }: Props) {
  const { id } = await params
  return <PrintSheet id={id} />
}
