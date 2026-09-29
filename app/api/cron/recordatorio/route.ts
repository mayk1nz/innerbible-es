import { db, t } from '@/lib/server/db'
import { sendScheduled } from '@/lib/server/push'

// The reminders, run every hour by Supabase (pg_cron + pg_net, migration 006) and once a
// day by Vercel Cron (vercel.json) as a fallback. Each device gets its morning and its
// night reminder in its own time zone, once a day each (lib/server/push.ts), so calling
// this more often never sends more.
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

export async function GET(request: Request) {
  if (!(await allowed(request))) return Response.json({ error: 'unauthorized' }, { status: 401 })
  // ?dry=1&at=<ISO date>: a rehearsal of what would be sent at that moment (nothing is sent).
  const url = new URL(request.url)
  const at = url.searchParams.get('at')
  const when = at && !Number.isNaN(Date.parse(at)) ? new Date(at) : new Date()
  const result = await sendScheduled(when, url.searchParams.get('dry') === '1')
  return Response.json({ ok: true, ...result })
}
