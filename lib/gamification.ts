import type { RankingResponse } from './community'
import { SEED_MEMBERS } from './community-seed'
import { addDays, weekStart } from './dates'
import type { AppState } from './store'

// Streak = consecutive local days with at least one lesson marked as read. A day
// without reading yet (today) does not break it: the streak still counts from
// yesterday until midnight, so the member always has "today" to keep it alive.
//
// Points reset every Monday in the ranking, so a newcomer can reach the top in their
// first week; the all-time total stays on the profile.

export interface Stats {
  streak: number
  best: number
  weekPoints: number
  totalPoints: number
  lessonsDone: number
  doneToday: boolean
}

export function streakFrom(days: ReadonlySet<string>, today: string): number {
  let cursor = days.has(today) ? today : addDays(today, -1)
  let count = 0
  while (days.has(cursor)) {
    count += 1
    cursor = addDays(cursor, -1)
  }
  return count
}

export function bestStreak(days: ReadonlySet<string>): number {
  let best = 0
  let run = 0
  let prev = ''
  for (const day of [...days].sort()) {
    run = prev && addDays(prev, 1) === day ? run + 1 : 1
    best = Math.max(best, run)
    prev = day
  }
  return best
}

export function computeStats(s: AppState, today: string): Stats {
  // Days with a lesson done (an event taken back still counts: that day there was activity).
  const days = new Set([...Object.values(s.completed).map((c) => c.day), ...s.points.filter((p) => p.kind === 'lesson').map((p) => p.day)])
  const monday = today ? weekStart(today) : ''
  const sum = (from: string) =>
    s.points.reduce((total, p) => (from === '' || p.day >= from ? total + p.pts : total), 0)
  return {
    streak: today ? streakFrom(days, today) : 0,
    best: bestStreak(days),
    weekPoints: monday ? sum(monday) : 0,
    totalPoints: sum(''),
    lessonsDone: Object.keys(s.completed).length,
    doneToday: today ? days.has(today) : false,
  }
}

export type RankMode = 'semana' | 'racha'

export interface RankRow {
  name: string
  weekPoints: number
  streak: number
  rank: number
  me: boolean
}

type Entry = Omit<RankRow, 'rank'>

function byMode(mode: RankMode) {
  return (a: Entry, b: Entry) =>
    mode === 'semana'
      ? b.weekPoints - a.weekPoints || b.streak - a.streak || Number(b.me) - Number(a.me)
      : b.streak - a.streak || b.weekPoints - a.weekPoints || Number(b.me) - Number(a.me)
}

/** The ranking with the example members only (offline, or before the server answers). */
export function leaderboard(mode: RankMode, me: { name: string; weekPoints: number; streak: number }): RankRow[] {
  const rows: Entry[] = [...SEED_MEMBERS.map((m) => ({ ...m, me: false })), { ...me, me: true }]
  rows.sort(byMode(mode))
  return rows.map((r, i) => ({ ...r, rank: i + 1 }))
}

/**
 * The real ranking from the server (top real members + the member's own place among
 * them) mixed with the example members while the Comunidad is small (`board.seeds`).
 * The member's own numbers come from this device, which is never behind the server.
 */
export function mergedLeaderboard(
  mode: RankMode,
  board: RankingResponse,
  me: { name: string; weekPoints: number; streak: number },
): RankRow[] {
  const others: Entry[] = board.rows.filter((r) => !r.me).map((r) => ({ name: r.name, weekPoints: r.weekPoints, streak: r.streak, me: false }))
  const rows: Entry[] = [...others, ...(board.seeds ? SEED_MEMBERS.map((m) => ({ ...m, me: false })) : []), { ...me, me: true }]
  rows.sort(byMode(mode))
  // Real members between the top shown and the member (not sent by the server) are still above them.
  const hidden = board.me
    ? board.rows.some((r) => r.me) ? 0 : Math.max(0, board.me.rank - 1 - others.length)
    : Math.max(0, board.total - others.length)
  const mine = rows.findIndex((r) => r.me)
  return rows.map((r, i) => ({ ...r, rank: i + 1 + (i >= mine ? hidden : 0) }))
}
