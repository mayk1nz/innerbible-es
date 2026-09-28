'use client'

import Link from 'next/link'
import { DealBadge } from './Deal'
import { Icon } from './icons'
import { productById } from '@/lib/catalog'
import { playTrack, toggle, trackFor, usePlayer } from '@/lib/player'
import { isOwned } from '@/lib/progress'
import { useAppState } from '@/lib/store'

// In each Estudio lesson: the same part of the story in the Resumen en Audio (upsell 1).
// Members who have it play it here (the mini player carries on across the app); the
// rest see it locked, one tap from the offer.

/** Estudio lesson → the audios (by title) that tell the same part of the story. */
const AUDIOS: Record<string, string[]> = {
  'comienza-aqui': ['Comienza aquí'],
  'antiguo-y-nuevo': ['¿Por qué la Biblia se divide en Antiguo y Nuevo Testamento?'],
  'genesis-1-11': ['Génesis'],
  'genesis-12-50': ['Génesis'],
  job: ['Job'],
  exodo: ['Éxodo'],
  levitico: ['Levítico'],
  numeros: ['Números'],
  deuteronomio: ['Deuteronomio'],
  josue: ['Josué'],
  jueces: ['Jueces'],
  rut: ['Rut'],
  '1-samuel': ['1 Samuel'],
  '2-samuel': ['2 Samuel', '1 Crónicas'],
  salmos: ['Salmos'],
  salomon: ['1 Reyes 1-11', '2 Crónicas 1-9'],
  proverbios: ['Proverbios'],
  cantares: ['Cantares de Salomón'],
  eclesiastes: ['Eclesiastés'],
  jonas: ['Jonás'],
  amos: ['Amós'],
  oseas: ['Oseas'],
  isaias: ['Isaías'],
  miqueas: ['Miqueas'],
  nahum: ['Nahúm'],
  sofonias: ['Sofonías'],
  jeremias: ['Jeremías'],
  habacuc: ['Habacuc'],
  lamentaciones: ['Lamentaciones'],
  abdias: ['Abdías'],
  ezequiel: ['Ezequiel'],
  daniel: ['Daniel'],
  'esdras-1-6': ['Esdras'],
  hageo: ['Hageo'],
  zacarias: ['Zacarías'],
  ester: ['Ester'],
  'esdras-7-10': ['Esdras'],
  nehemias: ['Nehemías'],
  cronicas: ['1 Crónicas'],
  malaquias: ['Malaquías'],
  'el-verbo': ['Juan 1'],
  anuncios: ['Lucas 1-2', 'Mateo 1-2'],
  nacimiento: ['Lucas 1-2', 'Mateo 1-2'],
  'inicio-ministerio': ['Marcos 1', 'Juan 1'],
  'galilea-ensenanzas': ['El ministerio de Jesús: una armonía de los evangelios'],
  'galilea-milagros': ['El ministerio de Jesús: una armonía de los evangelios'],
  'camino-a-jerusalen': ['El ministerio de Jesús: una armonía de los evangelios'],
  'ultima-semana': ['El ministerio de Jesús: una armonía de los evangelios'],
  'pasion-y-muerte': ['El ministerio de Jesús: una armonía de los evangelios'],
  resurreccion: ['El ministerio de Jesús: una armonía de los evangelios'],
  'hechos-1-7': ['Hechos de los Apóstoles'],
  'hechos-8-12': ['Hechos de los Apóstoles'],
  'hechos-13-14': ['Hechos de los Apóstoles'],
  'hechos-15-18': ['Hechos de los Apóstoles'],
  'hechos-18-20': ['Hechos de los Apóstoles'],
  'hechos-21-28': ['Hechos de los Apóstoles'],
  santiago: ['Santiago'],
  galatas: ['Gálatas'],
  '1-tesalonicenses': ['1 Tesalonicenses'],
  '2-tesalonicenses': ['2 Tesalonicenses'],
  '1-corintios': ['1 Corintios'],
  '2-corintios': ['2 Corintios'],
  romanos: ['Romanos'],
  efesios: ['Efesios'],
  filipenses: ['Filipenses'],
  colosenses: ['Colosenses'],
  filemon: ['Filemón'],
  '1-timoteo': ['1 Timoteo'],
  tito: ['Tito'],
  '2-timoteo': ['2 Timoteo'],
  '1-pedro': ['1 Pedro'],
  '2-pedro': ['2 Pedro'],
  hebreos: ['Hebreos'],
  judas: ['Judas'],
  '1-juan': ['1 Juan'],
  '2-juan': ['2 Juan'],
  '3-juan': ['3 Juan'],
  apocalipsis: ['Apocalipsis'],
  conclusion: ['Conclusión: del Génesis al Apocalipsis'],
}

const AUDIO_ID = 'cronologico-audio'

export function EstudioAudio({ lessonId }: { lessonId: string }) {
  const s = useAppState()
  const p = usePlayer()
  const product = productById(AUDIO_ID)
  if (!product) return null
  const all = product.sections.flatMap((sec) => sec.lessons)
  const audios = (AUDIOS[lessonId] ?? []).map((title) => all.find((l) => l.title === title)).filter((l) => l !== undefined)

  if (!isOwned(product, s.owned)) {
    return (
      <Link
        href={`/modulo/${AUDIO_ID}`}
        className="mb-4 flex items-center gap-3.5 rounded-2xl border border-gold/40 bg-gold-soft/50 p-3.5 text-[16px] transition hover:bg-gold-soft active:scale-[0.99]"
      >
        <span className="relative grid size-11 shrink-0 place-items-center rounded-full bg-primary text-gold-bright">
          <Icon name="headphones" className="size-5" />
          <span className="absolute -bottom-0.5 -right-0.5 grid size-5 place-items-center rounded-full bg-surface text-gold shadow-card">
            <Icon name="lock" className="size-3" />
          </span>
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-ink">{audios.length ? 'Escucha esta historia en audio' : 'Escucha toda la historia en audio'}</span>
            <DealBadge offer="upsell1" />
          </span>
          <span className="mt-0.5 block text-[14px] leading-snug text-muted">
            {audios.length ? `En el Resumen Cronológico en Audio: ${audios.map((a) => a.title).join(' y ')}.` : 'El Resumen Cronológico en Audio, de la creación al Apocalipsis.'}
          </span>
        </span>
        <Icon name="chevronRight" className="size-5 shrink-0 text-muted" />
      </Link>
    )
  }

  if (!audios.length) return null
  return (
    <div className="mb-4 space-y-2">
      {audios.map((lesson) => {
        const track = trackFor(product, lesson)
        if (!track) return null
        const current = p.track?.key === track.key
        const playing = current && p.playing
        return (
          <button
            key={lesson.id}
            type="button"
            onClick={() => (current ? toggle() : playTrack(track))}
            aria-label={playing ? `Pausar el audio ${lesson.title}` : `Escuchar el audio ${lesson.title}`}
            className="flex w-full items-center gap-3.5 rounded-2xl border border-line bg-surface p-3.5 text-left text-[16px] transition hover:bg-surface-hover active:scale-[0.99]"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-gold-bright">
              <Icon name={playing ? 'pause' : 'play'} className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-ink">{playing ? 'Escuchando' : 'Escuchar en audio'}</span>
              <span className="block text-[14px] text-muted">{lesson.title}</span>
            </span>
            <Icon name="headphones" className="size-5 shrink-0 text-gold" />
          </button>
        )
      })}
    </div>
  )
}
