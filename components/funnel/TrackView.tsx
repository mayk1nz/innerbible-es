'use client'

import { useEffect } from 'react'
import { track } from '@/lib/analytics/track'
import type { ClientEventName } from '@/lib/analytics/events'

/** Records one telemetry event when a (server-rendered) page opens. Renders nothing. */
export function TrackView({ name }: { name: ClientEventName }) {
  useEffect(() => {
    track(name, { from_purchase: new URLSearchParams(window.location.search).has('ks') })
  }, [name])
  return null
}
