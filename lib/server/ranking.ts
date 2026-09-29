import 'server-only'
import { displayName, type ServerRankRow } from '../community'
import { REAL_MEMBERS_TO_HIDE_SEEDS } from '../config'
import { computeStats, type RankMode } from '../gamification'
import type { AppState } from '../store'
import { db, t } from './db'
import { localNow } from './reminders'

// The real ranking: every member's points of the week (since their Monday) and streak,
// computed from the progress the app keeps on the server (member_progress), each in the
// member's own time zone (the one their phone sent with the reminders; Mexico City when
// unknown). Used by /api/comunidad/ranking and by the hourly "someone passed you" push.

export interface RealMember {
  email: string
  name: string
  weekPoints: number
  streak: number
  /** Monday of the member's current week ("YYYY-MM-DD"). */
  week: string
}

export interface RealBoard {
  /** Members with points this week or a streak alive. */
  ranked: RealMember[]
  /** Real members with any progress at all (decides whether the example members show). */
  withProgress: number
  seeds: boolean
}

const PAGE = 1000
const TTL_MS = 30_000

/** Every row of a table, page by page (PostgREST returns at most 1000 at a time). */
async function allRows<T>(table: string, columns: string): Promise<T[]> {
  const out: T[] = []
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await db().from(t(table)).select(columns).order('email').range(from, from + PAGE - 1)
    if (error) throw new Error(`${table}: ${error.message}`)
    out.push(...((data ?? []) as T[]))
    if (!data || data.length < PAGE) return out
  }
}

function mondayOf(day: string): string {
  const d = new Date(`${day}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7))
  return d.toISOString().slice(0, 10)
}

let cache: { at: number; board: RealBoard } | null = null

export async function realBoard(now = new Date(), fresh = false): Promise<RealBoard> {
  if (!fresh && cache && Date.now() - cache.at < TTL_MS) return cache.board
  type ProgressRow = { email: string; completed: AppState['completed'] | null; points: AppState['points'] | null }
  const [progress, members, subs] = await Promise.all([
    // Only what the ranking needs (not the reflections or the audio positions).
    allRows<ProgressRow>('member_progress', 'email, completed:data->completed, points:data->points'),
    allRows<{ email: string; name: string | null }>('members', 'email, name'),
    allRows<{ email: string; tz: string | null }>('push_subscriptions', 'email, tz'),
  ])
  const names = new Map(members.map((m) => [m.email, m.name]))
  const zones = new Map<string, string>()
  for (const s of subs) if (s.tz && !zones.has(s.email)) zones.set(s.email, s.tz)
  let withProgress = 0
  const ranked: RealMember[] = []
  for (const row of progress) {
    const completed = row.completed && typeof row.completed === 'object' ? row.completed : {}
    const points = Array.isArray(row.points) ? row.points : []
    if (!Object.keys(completed).length && !points.length) continue
    withProgress++
    const today = localNow(zones.get(row.email) ?? null, now).day
    const stats = computeStats({ completed, points } as AppState, today)
    if (stats.weekPoints <= 0 && stats.streak <= 0) continue
    ranked.push({ email: row.email, name: displayName(names.get(row.email)), weekPoints: stats.weekPoints, streak: stats.streak, week: mondayOf(today) })
  }
  const board = { ranked, withProgress, seeds: withProgress < REAL_MEMBERS_TO_HIDE_SEEDS }
  cache = { at: Date.now(), board }
  return board
}

/** Real members in ranking order (ties: the other measure, then a stable order). */
export function sortBoard(members: RealMember[], mode: RankMode): RealMember[] {
  return [...members].sort((a, b) =>
    mode === 'semana'
      ? b.weekPoints - a.weekPoints || b.streak - a.streak || a.email.localeCompare(b.email)
      : b.streak - a.streak || b.weekPoints - a.weekPoints || a.email.localeCompare(b.email),
  )
}

export function toRow(m: RealMember, rank: number, email: string | null): ServerRankRow {
  return { name: m.name, weekPoints: m.weekPoints, streak: m.streak, rank, me: m.email === email }
}
