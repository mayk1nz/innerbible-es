import type { Metadata } from 'next'
import { QuizFunnel } from '@/components/funnel/QuizFunnel'

export const metadata: Metadata = {
  title: { absolute: '¿Cuánto conoces la Palabra de Dios? · Test bíblico' },
  description: 'Responde unas preguntas rápidas y descubre tu nivel de conocimiento bíblico.',
  // Ad landing page: the ads bring the traffic, search engines do not need it.
  robots: { index: false, follow: false },
}

export default function Page() {
  return <QuizFunnel />
}
