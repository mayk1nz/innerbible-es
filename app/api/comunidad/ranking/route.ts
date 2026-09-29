import type { RankingResponse } from '@/lib/community'
import { json, unavailable, viewer } from '@/lib/server/community'
import { realBoard, sortBoard, toRow } from '@/lib/server/ranking'

// The real ranking of the Comunidad.
//   GET ?mode=semana|racha → RankingResponse: the top 20 real members, the asking member's
//   own row, how many real members are ranked, and whether the example members still show.

export const dynamic = 'force-dynamic'

const TOP = 20

export async function GET(request: Request) {
  const email = await viewer()
  if (!email) return json({ error: 'no-session' }, 401)
  const mode = new URL(request.url).searchParams.get('mode') === 'racha' ? 'racha' : 'semana'
  try {
    const board = await realBoard()
    const sorted = sortBoard(board.ranked, mode)
    const mine = sorted.findIndex((m) => m.email === email)
    const body: RankingResponse = {
      mode,
      rows: sorted.slice(0, TOP).map((m, i) => toRow(m, i + 1, email)),
      me: mine >= 0 ? toRow(sorted[mine], mine + 1, email) : null,
      total: sorted.length,
      seeds: board.seeds,
    }
    return json(body)
  } catch (e) {
    return unavailable('ranking', e)
  }
}
