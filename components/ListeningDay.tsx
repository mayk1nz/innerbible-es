'use client'

import { Icon } from './icons'
import type { Product } from '@/lib/catalog'
import { playDay, toggle, trackFor, usePlayer, type Track } from '@/lib/player'
import { useAppState } from '@/lib/store'

// A day of the full listening plan (Resumen en Audio): the day's audios, in order. Playing
// one starts the app's player, which goes on to the next audio by itself.

export function ListeningDay({ product, ids, repaso, dayKey }: { product: Product; ids: string[]; repaso: boolean; dayKey: string }) {
  const p = usePlayer()
  const { completed } = useAppState()
  const all = product.sections.flatMap((sec) => sec.lessons)
  const audios = ids.map((id) => all.find((l) => l.id === id && l.audioSrc)).filter((l) => l !== undefined)
  const tracks = audios.map((l) => trackFor(product, l)).filter((t): t is Track => t !== null)
  // Start where the member left off: the first audio of the day not heard yet.
  const firstOpen = Math.max(0, tracks.findIndex((t) => !completed[t.key]))
  const first = tracks[firstOpen] ?? null

  return (
    <section aria-label="Los audios de hoy" className="space-y-3">
      <p className="text-[16px] leading-relaxed text-text">
        {repaso
          ? 'Hoy es día de repaso: vuelve a escuchar lo de los últimos días, sin prisa. Lo que se escucha dos veces se queda en el corazón.'
          : audios.length > 1
            ? `Hoy escuchas ${audios.length} audios. Al terminar uno, el siguiente empieza solo, y al terminar el último, tu día queda completo.`
            : 'Hoy escuchas un audio. Al terminarlo, tu día queda completo.'}
      </p>

      {first && !audios.some((l) => p.track?.lessonId === l.id) && (
        <button
          type="button"
          onClick={() => playDay(tracks, firstOpen, dayKey)}
          className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-[16px] font-semibold text-white shadow-card transition hover:brightness-110 active:scale-[0.99]"
        >
          <Icon name="play" className="size-5 text-gold-bright" />
          {repaso ? 'Empezar el repaso' : firstOpen > 0 ? 'Seguir escuchando' : 'Empezar a escuchar'}
        </button>
      )}

      <ol className="space-y-2">
        {audios.map((lesson, i) => {
          const track = trackFor(product, lesson)
          if (!track) return null
          const current = p.track?.key === track.key
          const playing = current && p.playing
          return (
            <li key={lesson.id}>
              <button
                type="button"
                onClick={() => (current ? toggle() : playDay(tracks, i, dayKey))}
                aria-label={playing ? `Pausar ${lesson.title}` : `Escuchar ${lesson.title}`}
                className={`flex w-full items-center gap-3.5 rounded-2xl border p-3.5 text-left transition active:scale-[0.99] ${
                  current ? 'border-primary bg-surface-2' : 'border-line bg-surface hover:bg-surface-hover'
                }`}
              >
                <span className={`grid size-11 shrink-0 place-items-center rounded-full ${current ? 'bg-primary text-gold-bright' : 'bg-gold-soft text-ink'}`}>
                  {current ? (
                    <Icon name={playing ? 'pause' : 'play'} className="size-5" />
                  ) : completed[track.key] ? (
                    <Icon name="check" className="size-5 text-success" strokeWidth={2.6} label="Escuchado" />
                  ) : (
                    <span className="text-[14px] font-semibold tabular-nums">{i + 1}</span>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-serif text-[16.5px] leading-snug text-ink">{lesson.title}</span>
                  {current && <span className="block text-[13.5px] text-muted">{playing ? 'Sonando ahora' : 'En pausa'}</span>}
                </span>
                <Icon name="headphones" className="size-5 shrink-0 text-gold" />
              </button>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
