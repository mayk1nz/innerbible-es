import { KashPayScript } from '@/components/funnel/KashPayScript'
import { OneClickPage } from '@/components/funnel/OneClickPage'

export const metadata = { title: 'Solo falta una cosa', robots: { index: false, follow: false } }

export default function Page() {
  return (
    <>
      <KashPayScript />
      <OneClickPage step="up2" />
    </>
  )
}
