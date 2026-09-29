import { ensureDailyWord } from '@/lib/server/daily-word'
import { db, t } from '@/lib/server/db'
import { sendScheduled } from '@/lib/server/push'
import { rankingAlerts } from '@/lib/server/ranking-alerts'

// The hourly jobs, run every hour by Supabase (pg_cron + pg_net, migration 006) and once
// a day by Vercel Cron (vercel.json) as a fallback:
//   - the Palabra del día on the wall (created on the first run of each day; lib/server/daily-word.ts)
//   - the reminders: each device gets its morning and its night reminder in its own time
//     zone, once a day each (lib/server/push.ts), so calling this more often never sends more
//   - "someone passed you in the ranking" (lib/server/ranking-alerts.ts, at most 1 a day)
// Accepted callers: Vercel Cron (Authorization: Bearer CRON_SECRET) or Supabase
// (x-cron-key = app_config.cron_key).

export const dynamic = 'force-dynamic'
export const maxDuration = 60

async function allowed(request: Request): Promise<boolean> {
  const secret = process.env.CRON_SECRET
  if (secret && request.headers.get('authorization') === `Bearer ${secret}`) return true
  const key = request.headers.get('x-cron-key')
  if (key) {
    const { data } = await db().from(t('app_config')).select('value').eq('key', 'cron_key').maybeSingle()
    if (data?.value && data.value === key) return true
  }
  // No secret configured anywhere: open (sending is idempotent per day).
  return !secret && !key
}

/** One job failing never stops the others (and its error never reaches the response). */
async function run<T>(name: string, job: () => Promise<T>): Promise<T | { error: string }> {
  try {
    return await job()
  } catch (e) {
    console.error(`cron: ${name} failed`, e instanceof Error ? e.message : (e as { message?: string })?.message ?? e)
    return { error: 'failed' }
  }
}

export async function GET(request: Request) {
  if (!(await allowed(request))) return Response.json({ error: 'unauthorized' }, { status: 401 })
  // ?dry=1&at=<ISO date>: a rehearsal of what would happen at that moment (nothing is sent or saved).
  // ?only=palabra|recordatorio|ranking: just that job.
  const url = new URL(request.url)
  const at = url.searchParams.get('at')
  const when = at && !Number.isNaN(Date.parse(at)) ? new Date(at) : new Date()
  const dry = url.searchParams.get('dry') === '1'
  const only = url.searchParams.get('only')
  const palabra = !only || only === 'palabra' ? await run('palabra', () => ensureDailyWord(when, dry)) : undefined
  const reminders = !only || only === 'recordatorio' ? await run('recordatorio', () => sendScheduled(when, dry)) : {}
  const ranking = !only || only === 'ranking' ? await run('ranking', () => rankingAlerts(when, dry)) : undefined
  return Response.json({ ok: true, ...reminders, ...(palabra ? { palabra } : {}), ...(ranking ? { ranking } : {}) })
}
