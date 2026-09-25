import { UpsellPage } from '@/components/funnel/UpsellPage'

export const metadata = { title: 'Tu pedido aún no está completo', robots: { index: false, follow: false } }

export default function Page() {
  return <UpsellPage offer="up1" />
}
