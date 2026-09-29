'use client'

import { useEffect, useId, useRef } from 'react'
import { preload } from 'react-dom'
import { Icon } from '../icons'
import type { VslConfig } from '@/lib/funnel/config'
import { track } from '@/lib/analytics/track'

type SmartPlayer = HTMLElement & {
  displayHiddenElements?: (seconds: number, selectors: string[], options: { persist: boolean }) => void
  // Read-only state of VTurb's v4 player (checked in a real player, 2026-09).
  currentTime?: number
  duration?: number
  paused?: boolean
  /** True while the muted autoplay preview runs, before the viewer taps to watch. */
  inSmartAutoPlay?: boolean
}

const MILESTONES = [25, 50, 75, 100] as const

/**
 * Telemetry of a VSL: `vsl_play` when the viewer really starts it (not the muted
 * autoplay preview) and `vsl_progress` at 25/50/75/100% of its length. VTurb v4 exposes
 * its state as properties on the element, so it is read once a second (no private API).
 */
function watchProgress(player: SmartPlayer, page: string): () => void {
  let played = false
  const sent = new Set<number>()
  const timer = window.setInterval(() => {
    try {
      if (player.paused !== false || player.inSmartAutoPlay !== false) return
      const current = Number(player.currentTime) || 0
      const duration = Number(player.duration) || 0
      if (!played) {
        played = true
        track('vsl_play', { page, sec: Math.round(current) })
      }
      if (duration <= 0) return
      const pct = (current / duration) * 100
      for (const m of MILESTONES) {
        if (!sent.has(m) && (pct >= m || (m === 100 && pct >= 98))) {
          sent.add(m)
          track('vsl_progress', { page, pct: m, sec: Math.round(current), duration: Math.round(duration) })
        }
      }
    } catch {
      // the player changed shape: telemetry just stops
    }
  }, 1000)
  return () => window.clearInterval(timer)
}

// Mounts a VTurb smartplayer from the owner's own account and tells the page when the
// offer may appear. VTurb's delay API reveals a hidden sentinel at `delaySeconds` (and
// remembers it for returning viewers); a MutationObserver turns that into `onReveal`,
// so the offer itself stays ordinary React state.
//
// No player configured, or the script fails to load → the offer is revealed at once:
// a broken video must never hide the buy button.

export function VturbPlayer({ video, onReveal, page }: { video: VslConfig; onReveal: () => void; page?: string }) {
  const mount = useRef<HTMLDivElement>(null)
  const sentinel = useRef<HTMLSpanElement>(null)
  const sentinelId = `offer-gate-${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const configured = Boolean(video.playerId && video.scriptUrl)
  // VTurb's "Optimize Player Loading Speed": start downloading the player script as
  // early as possible (React emits the <link rel="preload"> once, in <head>).
  if (configured) preload(video.scriptUrl, { as: 'script' })

  useEffect(() => {
    if (!configured || video.delaySeconds <= 0) onReveal()
  }, [configured, video.delaySeconds, onReveal])

  useEffect(() => {
    const host = mount.current
    const gate = sentinel.current
    if (!configured || !host || !gate) return

    const player = document.createElement('vturb-smartplayer') as SmartPlayer
    player.id = video.playerId
    player.style.cssText = 'display:block;margin:0 auto;width:100%;max-width:400px;'
    // VTurb's placeholder: the video's own box (portrait, 134%) before the script loads,
    // so the page does not jump when the player appears.
    const box = document.createElement('div')
    box.className = 'vturb-player-placeholder'
    box.style.cssText = 'position:relative;width:100%;padding:134.07407407407408% 0 0;z-index:0;background-color:black;'
    player.appendChild(box)
    const onReady = () => {
      if (video.delaySeconds > 0) player.displayHiddenElements?.(video.delaySeconds, [`#${sentinelId}`], { persist: true })
    }
    player.addEventListener('player:ready', onReady)
    host.appendChild(player)
    const stopWatching = page ? watchProgress(player, page) : () => {}

    const observer = new MutationObserver(() => {
      if (gate.style.display && gate.style.display !== 'none') onReveal()
    })
    observer.observe(gate, { attributes: true, attributeFilter: ['style'] })

    if (!document.querySelector(`script[data-vturb="${video.playerId}"]`)) {
      const script = document.createElement('script')
      script.src = video.scriptUrl
      script.async = true
      script.dataset.vturb = video.playerId
      script.addEventListener('error', onReveal)
      document.head.appendChild(script)
    }

    return () => {
      stopWatching()
      observer.disconnect()
      player.removeEventListener('player:ready', onReady)
      player.remove()
    }
  }, [configured, video.playerId, video.scriptUrl, video.delaySeconds, sentinelId, onReveal, page])

  return (
    <div>
      {configured ? (
        <div ref={mount} className="mx-auto max-w-[400px] overflow-hidden rounded-2xl bg-black shadow-card" />
      ) : (
        <div className="grid aspect-[9/16] max-h-[520px] w-full place-items-center rounded-2xl bg-[#0c0a07] text-center text-[#fbf1dc]">
          <div className="px-6">
            <Icon name="play" className="mx-auto size-12 text-gold-bright" />
            <p className="mt-3 font-serif text-lg">Video en preparación</p>
          </div>
        </div>
      )}
      <span ref={sentinel} id={sentinelId} style={{ display: 'none' }} aria-hidden />
    </div>
  )
}
