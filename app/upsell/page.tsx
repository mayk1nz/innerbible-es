import { KashPayScript } from '@/components/funnel/KashPayScript'
import { OneClickPage } from '@/components/funnel/OneClickPage'

export const metadata = { title: 'Un aviso importante sobre tu pedido', robots: { index: false, follow: false } }

export default function Page() {
  return (
    <>
      <KashPayScript />
      <OneClickPage step="up1" />
    </>
  )
}
