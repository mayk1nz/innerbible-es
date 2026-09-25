'use client'

import { useRef, useState } from 'react'
import { Icon } from './icons'
import type { CoverStyle } from '@/lib/catalog'
import { getAppState, saveAudioPosition } from '@/lib/store'

// Speed, ±15 s, and the position remembered per lesson — the three things the
// reference audio player lacks and a 30-minute narration needs. Reaching the end
// marks the lesson as read. A file that is not uploaded yet (404) shows "en preparación".

const RATES = [1, 1.25, 1.5, 2, 0.75]

function clock(sec: number): string {
  const safe = Number.isFinite(sec) && sec > 0 ? sec : 0
  const m = Math.floor(safe / 60)
  const s = Math.floor(safe % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

function Disc({ cover, title, spinning }: { cover?: CoverStyle; title: string; spinning: boolean }) {
  const bg = cover
    ? `radial-gradient(120% 75% at 50% -5%, ${cover.glow} 0%, transparent 60%), linear-gradient(180deg, ${cover.from} 0%, ${cover.to} 100%)`
    : undefined
  return (
    <div className="mx-auto grid size-44 place-items-center rounded-full border-[6px] border-gold-soft bg-primary shadow-float" style={bg ? { backgroundImage: bg } : undefined}>
      <div className={`flex flex-col items-center gap-2 px-6 text-center ${spinning ? 'animate-pulse' : ''}`}>
        <Icon name="headphones" className="size-8 text-gold-bright" />
        <span className="line-clamp-2 font-serif text-[15px] font-semibold uppercase leading-tight tracking-wide text-[#fbf1dc]">{title}</span>
      </div>
    </div>
  )
}

export function AudioPlayer({
  src,
  positionKey,
  onEnded,
  title,
  subtitle,
  cover,
}: {
  src?: string
  positionKey: string
  onEnded?: () => void
  title: string
  subtitle?: string
  cover?: CoverStyle
}) {
  const audio = useRef<HTMLAudioElement>(null)
  const lastSaved = useRef(0)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [rate, setRate] = useState(1)
  const [missing, setMissing] = useState(false)

  if (!src || missing) {
    return (
      <div className="rounded-3xl border border-line bg-surface p-5 text-center shadow-card">
        <Disc cover={cover} title={title} spinning={false} />
        <p className="mt-4 font-serif text-[20px] font-semibold text-ink">{title}</p>
        <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-gold-soft/70 px-3 py-1 text-[14px] font-medium text-ink">
          <Icon name="headphones" className="size-4 text-gold" />
          Audio en preparación
        </p>
        <p className="mx-auto mt-2 max-w-xs text-[14.5px] leading-snug text-muted">Muy pronto podrás escuchar esta lección aquí.</p>
      </div>
    )
  }

  const toggle = () => {
    const el = audio.current
    if (!el) return
    if (el.paused) void el.play().catch(() => {})
    else el.pause()
  }

  const seekBy = (delta: number) => {
    const el = audio.current
    if (!el) return
    const end = Number.isFinite(el.duration) ? el.duration : el.currentTime + delta
    el.currentTime = Math.min(Math.max(0, el.currentTime + delta), end)
  }

  const cycleRate = () => {
    const next = RATES[(RATES.indexOf(rate) + 1) % RATES.length]
    setRate(next)
    if (audio.current) audio.current.playbackRate = next
  }

  return (
    <div className="rounded-3xl border border-line bg-surface px-5 pb-5 pt-4 shadow-card">
      <audio
        ref={audio}
        src={src}
        preload="metadata"
        onError={() => setMissing(true)}
        onLoadedMetadata={(e) => {
          const el = e.currentTarget
          setDuration(el.duration)
          el.playbackRate = rate
          const saved = getAppState().audioPos[positionKey]
          if (saved && saved < el.duration - 5) {
            el.currentTime = saved
            setTime(saved)
          }
        }}
        onTimeUpdate={(e) => {
          const t = e.currentTarget.currentTime
          setTime(t)
          if (Math.abs(t - lastSaved.current) >= 5) {
            lastSaved.current = t
            saveAudioPosition(positionKey, t)
          }
        }}
        onPlay={() => setPlaying(true)}
        onPause={(e) => {
          setPlaying(false)
          saveAudioPosition(positionKey, e.currentTarget.currentTime)
        }}
        onEnded={() => {
          setPlaying(false)
          saveAudioPosition(positionKey, 0)
          onEnded?.()
        }}
      />
      <div className="flex justify-start">
        <button
          type="button"
          onClick={cycleRate}
          aria-label={`Velocidad ${rate}x`}
          className="min-w-14 rounded-full border border-gold/50 bg-gold-soft/60 px-3 py-1.5 text-[13.5px] font-bold text-gold transition hover:bg-gold-soft"
        >
          {rate}×
        </button>
      </div>
      <div className="mt-1">
        <Disc cover={cover} title={title} spinning={playing} />
      </div>
      <p className="mt-4 text-center font-serif text-[21px] font-semibold leading-snug text-ink">{title}</p>
      {subtitle && <p className="mt-0.5 text-center text-[14.5px] text-muted">{subtitle}</p>}

      <input
        type="range"
        min={0}
        max={duration || 0}
        step={1}
        value={Math.min(time, duration || 0)}
        onChange={(e) => {
          const v = Number(e.target.value)
          if (audio.current) audio.current.currentTime = v
          setTime(v)
        }}
        aria-label="Posición del audio"
        className="mt-4 w-full accent-gold"
      />
      <div className="mt-1 flex justify-between text-xs tabular-nums text-muted">
        <span>{clock(time)}</span>
        <span>-{clock(Math.max(0, duration - time))}</span>
      </div>
      <div className="mt-3 flex items-center justify-center gap-5">
        <button type="button" onClick={() => seekBy(-15)} aria-label="Retroceder 15 segundos" className="grid size-12 place-items-center rounded-full text-ink hover:bg-surface-hover">
          <Icon name="rewind" className="size-6" />
        </button>
        <button type="button" onClick={toggle} aria-label={playing ? 'Pausar' : 'Reproducir'} className="grid size-[72px] place-items-center rounded-full bg-primary text-gold-bright shadow-float transition active:scale-95">
          <Icon name={playing ? 'pause' : 'play'} className="size-8" />
        </button>
        <button type="button" onClick={() => seekBy(15)} aria-label="Adelantar 15 segundos" className="grid size-12 place-items-center rounded-full text-ink hover:bg-surface-hover">
          <Icon name="forward" className="size-6" />
        </button>
      </div>
    </div>
  )
}
