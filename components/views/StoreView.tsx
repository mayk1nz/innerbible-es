'use client'

import Link from 'next/link'
import { OfferCard } from '../cards'
import { PageHeader } from '../PageHeader'
import { EmptyState, buttonClass } from '../ui'
import { OFFERS } from '@/lib/catalog'
import { useAppState } from '@/lib/store'

export function StoreView() {
  const s = useAppState()
  const pending = OFFERS.filter((o) => o.id !== 'front' && !s.owned.includes(o.id))

  return (
    <>
      <PageHeader title="Tienda" subtitle="Amplía tu biblioteca con lo que aún no tienes" />
      {pending.length === 0 ? (
        <EmptyState
          icon="gift"
          title="Ya tienes toda la biblioteca"
          text="No hay nada más por desbloquear. Sigue tu recorrido y comparte lo que aprendes con los hermanos."
          action={
            <Link href="/leer" className={buttonClass.primary}>
              Ir a leer
            </Link>
          }
        />
      ) : (
        <div className="space-y-6">
          {pending.map((o) => (
            <OfferCard key={o.id} offer={o} email={s.session?.email} />
          ))}
        </div>
      )}
    </>
  )
}
