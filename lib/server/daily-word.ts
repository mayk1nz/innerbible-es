import 'server-only'
import { TEAM_AUTHOR } from '../config'
import type { Leccion } from '../content/estudio/types'
import { PLAN_365 } from '../content/plan365'
import { contentTarget, readContent } from './content'
import { db, t } from './db'
import { localNow } from './reminders'

// The "Palabra del día": one post a day on the wall, signed by the team, written from our
// own content (no AI). The day of the year picks the day of the 365-day plan, whose
// Estudio lesson gives the verse, one sentence of "En 1 minuto" and the "Para tu vida"
// question. The hourly cron creates it on its first run of the day (one per day: the
// database refuses a second one).

/** The day of the Palabra is the day in this zone (most members are in the Americas). */
const REFERENCE_TZ = 'America/Mexico_City'

export interface DailyWord {
  day: string
  lessonKey: string
  text: string
}

function dayOfYear(day: string): number {
  const [y, m, d] = day.split('-').map(Number)
  return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(y, 0, 1)) / 86_400_000) + 1
}

/** The Palabra of a day ("YYYY-MM-DD"), or null if its lesson is not published. */
export function dailyWordFor(day: string): DailyWord | null {
  // 31 December of a leap year repeats day 365.
  const plan = PLAN_365[Math.min(PLAN_365.length, dayOfYear(day)) - 1]
  if (!plan) return null
  const target = contentTarget('estudio', [plan.leccion])
  const lesson = target ? (readContent(target) as Leccion | null) : null
  if (!lesson?.versiculo?.texto || !lesson.paraTuVida?.pregunta) return null
  const sentences = (lesson.enUnMinuto ?? []).filter(Boolean)
  // The same lesson spans several days of the plan: each day takes another of its sentences.
  const sentence = sentences.length ? sentences[(plan.dia - 1) % sentences.length] : ''
  const verse = lesson.versiculo.texto.trim().replace(/^[«"]|[»"]$/g, '')
  const text = [`«${verse}»\n— ${lesson.versiculo.referencia}`, sentence, `💬 ${lesson.paraTuVida.pregunta.trim()}`].filter(Boolean).join('\n\n')
  return { day, lessonKey: `cronologico/${plan.leccion}`, text }
}

/** Creates today's Palabra once. `dry`: only says what it would publish. */
export async function ensureDailyWord(now = new Date(), dry = false): Promise<{ day: string; created: boolean; exists: boolean; preview?: { author: string; text: string; lessonKey: string } }> {
  const day = localNow(REFERENCE_TZ, now).day
  const { data: found, error } = await db().from(t('community_posts')).select('id').eq('kind', 'daily').eq('day', day).maybeSingle()
  if (error) throw error
  const word = found ? null : dailyWordFor(day)
  if (dry) {
    const w = word ?? dailyWordFor(day)
    return { day, created: false, exists: Boolean(found), ...(w ? { preview: { author: TEAM_AUTHOR, text: w.text, lessonKey: w.lessonKey } } : {}) }
  }
  if (found) return { day, created: false, exists: true }
  if (!word) return { day, created: false, exists: false }
  const { error: insertError } = await db()
    .from(t('community_posts'))
    .insert({ email: null, author: TEAM_AUTHOR, kind: 'daily', text: word.text, lesson_key: word.lessonKey, day })
  // Another run got there first: it exists, which is what we wanted.
  if (insertError?.code === '23505') return { day, created: false, exists: true }
  if (insertError) throw insertError
  return { day, created: true, exists: true }
}
