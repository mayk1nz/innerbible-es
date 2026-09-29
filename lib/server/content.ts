import 'server-only'
import fs from 'node:fs'
import path from 'node:path'
import { PRODUCTS, type LessonContent, type OfferId } from '../catalog'
import type { PlanId } from '../content/plans/titles'

// The paid texts, read from disk on the server. The content builds (content-src/**/build-*)
// publish them to content-private/, outside the app's JavaScript, so they only reach a
// member through /api/content (which checks the purchase) or server code (the Consejero).
//
//   content-private/estudio/<lesson>.json        Estudio Cronológico
//   content-private/guias/<guia>/<lesson>.json   gift guides + Palabras del Señor
//   content-private/mapas/<id>.json              Mapas Mentales
//   content-private/ninos/<id>.json              Rincón de los niños
//   content-private/escucha/<audio>.json         Guía de escucha (Resumen en Audio)
//   content-private/planes/<plan>.json           the 90 days of a plan (day n = [n - 1])

const ROOT = path.join(process.cwd(), 'content-private')

export const CONTENT_KINDS = ['estudio', 'guias', 'mapas', 'ninos', 'escucha', 'planes'] as const
export type ContentKind = (typeof CONTENT_KINDS)[number]

/** The Resumen en Audio: its listening guides belong to it (upsell 1), wherever the audio plays. */
const ESCUCHA_PRODUCT = 'cronologico-audio'

let offers: Map<string, Set<OfferId>> | null = null

/** "<kind>/<id…>" of every text in the catalog → the offers that open it. */
function offerIndex(): Map<string, Set<OfferId>> {
  if (offers) return offers
  const map = new Map<string, Set<OfferId>>()
  const add = (key: string, offer: OfferId) => {
    const set = map.get(key) ?? new Set<OfferId>()
    set.add(offer)
    map.set(key, set)
  }
  for (const p of PRODUCTS) {
    for (const s of p.sections) {
      for (const l of s.lessons) {
        if (l.estudio) add(`estudio/${l.id}`, p.offer)
        if (l.guia) add(`guias/${l.guia}/${l.id}`, p.offer)
        if (l.mapa) add(`mapas/${l.id}`, p.offer)
        if (l.ninos) add(`ninos/${l.id}`, p.offer)
        if (l.plan) add(`planes/${l.plan.id}/${l.plan.day}`, p.offer)
        if (p.id === ESCUCHA_PRODUCT && l.format === 'audio' && !l.escucha) add(`escucha/${l.id}`, p.offer)
      }
    }
  }
  offers = map
  return map
}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const DAY = /^[1-9]\d{0,2}$/

export interface ContentTarget {
  kind: ContentKind
  id: string[]
  /** Any of these offers opens it. */
  offers: Set<OfferId>
}

/**
 * The text a request names, or null when it is not one of the catalog's texts. Every
 * part must be a plain slug (no dots, slashes or anything else), so a request can never
 * point outside content-private.
 */
export function contentTarget(kind: string, id: string[]): ContentTarget | null {
  if (!(CONTENT_KINDS as readonly string[]).includes(kind)) return null
  const k = kind as ContentKind
  const expected = k === 'guias' || k === 'planes' ? 2 : 1
  if (id.length !== expected) return null
  const ok = id.every((part, i) => (k === 'planes' && i === 1 ? DAY.test(part) : SLUG.test(part)))
  if (!ok) return null
  const set = offerIndex().get(`${k}/${id.join('/')}`)
  return set ? { kind: k, id, offers: set } : null
}

const cache = new Map<string, unknown>()

/** A JSON file under content-private, or null when it does not exist. */
function readJson(parts: string[]): unknown {
  const file = path.join(ROOT, ...parts)
  if (!file.startsWith(ROOT + path.sep)) return null
  if (cache.has(file)) return cache.get(file)
  let value: unknown
  try {
    value = JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') return null
    throw e
  }
  // In development the builds may rewrite the files while the server runs.
  if (process.env.NODE_ENV === 'production') cache.set(file, value)
  return value
}

/** The 90 days of a plan (day n = [n - 1]); empty if the plan is not published. */
export function planDays(plan: PlanId): LessonContent[] {
  const days = readJson(['planes', `${plan}.json`])
  return Array.isArray(days) ? (days as LessonContent[]) : []
}

/** The text of a target (see contentTarget), or null when it is not written yet. */
export function readContent(target: ContentTarget): unknown {
  const [a, b] = target.id
  if (target.kind === 'planes') return planDays(a as PlanId)[Number(b) - 1] ?? null
  if (target.kind === 'guias') return readJson(['guias', a, `${b}.json`])
  return readJson([target.kind, `${a}.json`])
}
