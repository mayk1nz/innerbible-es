'use client'

import { useMemo } from 'react'
import { Avatar } from './ui'
import { useRanking } from '@/lib/community-client'
import { leaderboard, mergedLeaderboard, type RankMode, type RankRow } from '@/lib/gamification'
import { plural } from '@/lib/text'

const MEDALS: Record<number, string> = { 1: '#e0ac4a', 2: '#c9c3b5', 3: '#c98d58' }

export function RankItem({ row, mode }: { row: RankRow; mode: RankMode }) {
  const medal = MEDALS[row.rank]
  const value = mode === 'semana' ? `${row.weekPoints} pts` : plural(row.streak, 'día', 'días')
  const detail = mode === 'semana' ? `Racha de ${plural(row.streak, 'día', 'días')}` : `${row.weekPoints} pts esta semana`
  return (
    <li
      className={`flex items-center gap-3 rounded-2xl border px-3.5 py-3 ${row.me ? 'border-primary/40 bg-primary/10' : 'border-line bg-surface'}`}
      aria-current={row.me ? 'true' : undefined}
    >
      <span
        className="grid size-8 shrink-0 place-items-center rounded-full text-[14px] font-bold tabular-nums"
        style={medal ? { background: medal, color: '#35260f' } : { color: 'var(--color-muted)' }}
      >
        {row.rank}
      </span>
      <Avatar name={row.name} size="sm" primary={row.me} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15.5px] font-semibold text-ink">
          {row.me ? 'Tú' : row.name}
        </span>
        <span className="block text-[13px] text-muted">{detail}</span>
      </span>
      <span className="shrink-0 font-serif text-[17px] font-semibold tabular-nums text-ink">{value}</span>
    </li>
  )
}

/** Placeholder rows while the ranking loads (same height as the real ones). */
export function RankSkeleton({ count }: { count: number }) {
  return (
    <ol className="space-y-2" aria-busy="true" aria-label="Cargando el ranking">
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="flex h-[66px] animate-pulse items-center gap-3 rounded-2xl border border-line bg-surface px-3.5">
          <span className="size-8 rounded-full bg-line-soft" />
          <span className="size-9 rounded-full bg-line-soft" />
          <span className="h-3.5 flex-1 rounded-full bg-line-soft" />
        </li>
      ))}
    </ol>
  )
}

/**
 * The ranking the member sees: the real one from the server (with the example members
 * while the Comunidad is small); offline, the example members and the member only.
 */
export function useLeaderboard(
  mode: RankMode,
  me: { name: string; weekPoints: number; streak: number },
): { rows: RankRow[]; status: 'loading' | 'ok' | 'offline'; total: number } {
  const { status, data } = useRanking(mode)
  const { name, weekPoints, streak } = me
  return useMemo(() => {
    const mine = { name, weekPoints, streak }
    if (status === 'ok' && data) return { rows: mergedLeaderboard(mode, data, mine), status: 'ok' as const, total: data.total }
    return { rows: leaderboard(mode, mine), status: status === 'loading' ? ('loading' as const) : ('offline' as const), total: 0 }
  }, [status, data, mode, name, weekPoints, streak])
}
