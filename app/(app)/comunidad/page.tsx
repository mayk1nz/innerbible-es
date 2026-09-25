import { Suspense } from 'react'
import { CommunityView } from '@/components/views/CommunityView'

export const metadata = { title: 'Comunidad' }

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CommunityView />
    </Suspense>
  )
}
