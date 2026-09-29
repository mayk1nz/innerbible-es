import 'server-only'
import { POINTS } from '../config'
import { ownedOffers } from './access'
import { db, t } from './db'
import { sendPush, type Reminder } from './push'
import { realBoard, sortBoard, type RealMember } from './ranking'
import { localNow } from './reminders'

// "🏃 Rosa E. te pasó en el ranking": every hour the cron compares the real weekly
// ranking (real members only — never the example ones) with where everyone stood at the
// previous run (ranking_snapshots). A member with at least 1 point this week who went
// down because another real member passed them gets one push, at most once a day, and
// only between 9h and 21h where they are. Passes outside those hours are not told later
// (by then the news may no longer be true).

const HOURS = { from: 9, to: 21 }

interface Snapshot {
  email: string
  week: string
  rank: number
  points: number
  notified_day: string | null
}

export interface RankingAlertPreview {
  to: string
  local: string
  status: 'send' | 'fuera-de-hora' | 'ya-avisado-hoy' | 'sin-dispositivo' | 'sin-compra'
  reminder: Reminder
}

const mask = (email: string) => email.replace(/^(.{2}).*(@.*)$/, '$1…$2')

export function passedMessage(passer: RealMember, me: RealMember): Reminder {
  const missing = passer.weekPoints - me.weekPoints + 1
  return {
    title: `🏃 ${passer.name} te pasó en el ranking`,
    body: `Te ${missing === 1 ? 'falta 1 punto' : `faltan ${missing} puntos`} para recuperar tu puesto. Una lección suma ${POINTS.lesson}.`,
    url: '/comunidad?tab=constancia',
  }
}

async function snapshots(): Promise<Map<string, Snapshot>> {
  const out = new Map<string, Snapshot>()
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db().from(t('ranking_snapshots')).select('email, week, rank, points, notified_day').order('email').range(from, from + 999)
    if (error) throw error
    for (const r of (data ?? []) as Snapshot[]) out.set(r.email, r)
    if (!data || data.length < 1000) return out
  }
}

export async function rankingAlerts(now = new Date(), dry = false): Promise<{ passed: number; sent: number; skipped: number; preview?: RankingAlertPreview[] }> {
  const board = await realBoard(now, true)
  const sorted = sortBoard(board.ranked, 'semana')
  const before = await snapshots()

  // Who went down because someone passed them.
  const alerts: { member: RealMember; passer: RealMember }[] = []
  sorted.forEach((x, i) => {
    const s = before.get(x.email)
    if (!s || s.week !== x.week || x.weekPoints < 1 || i + 1 <= s.rank) return
    const passers = sorted.slice(0, i).filter((y) => {
      if (y.weekPoints <= x.weekPoints) return false
      const sy = before.get(y.email)
      // Not in the last snapshot of this week = was not ranked then = was behind.
      return !sy || sy.week !== y.week || sy.rank > s.rank
    })
    // The closest one above: the one to catch.
    if (passers.length) alerts.push({ member: x, passer: passers[passers.length - 1] })
  })

  const emails = alerts.map((a) => a.member.email)
  const subsResult = emails.length
    ? await db().from(t('push_subscriptions')).select('endpoint, email, p256dh, auth, tz').in('email', emails)
    : { data: [], error: null }
  if (subsResult.error) throw subsResult.error
  const subs = (subsResult.data ?? []) as { endpoint: string; email: string; p256dh: string; auth: string; tz: string | null }[]

  let sent = 0
  let skipped = 0
  const notified = new Map<string, string>()
  const preview: RankingAlertPreview[] = []
  for (const { member, passer } of alerts) {
    const devices = subs.filter((s) => s.email === member.email)
    const local = localNow(devices.find((d) => d.tz)?.tz ?? null, now)
    const reminder = passedMessage(passer, member)
    let status: RankingAlertPreview['status'] = 'send'
    if (!devices.length) status = 'sin-dispositivo'
    else if (before.get(member.email)?.notified_day === local.day) status = 'ya-avisado-hoy'
    else if (local.hour < HOURS.from || local.hour >= HOURS.to) status = 'fuera-de-hora'
    else if (!(await ownedOffers(member.email)).length) status = 'sin-compra'
    if (dry) {
      preview.push({ to: mask(member.email), local: `${local.day} ${local.hour}h`, status, reminder })
      continue
    }
    if (status !== 'send') {
      skipped++
      continue
    }
    let ok = false
    for (const d of devices) if ((await sendPush(d, reminder)) === 'sent') ok = true
    if (ok) {
      sent++
      notified.set(member.email, local.day)
    } else skipped++
  }

  // Where everyone stands now, for the next run.
  if (!dry && sorted.length) {
    const at = new Date().toISOString()
    const rows = sorted.map((m, i) => ({
      email: m.email,
      week: m.week,
      rank: i + 1,
      points: m.weekPoints,
      updated_at: at,
      ...(notified.has(m.email) ? { notified_day: notified.get(m.email) } : {}),
    }))
    // Rows with and without notified_day go in separate calls (one upsert = one set of columns).
    const withDay = rows.filter((r) => 'notified_day' in r)
    const rest = rows.filter((r) => !('notified_day' in r))
    for (const group of [withDay, rest]) {
      for (let i = 0; i < group.length; i += 500) {
        const { error } = await db().from(t('ranking_snapshots')).upsert(group.slice(i, i + 500), { onConflict: 'email' })
        if (error) throw error
      }
    }
  }
  return { passed: alerts.length, sent, skipped, ...(dry ? { preview } : {}) }
}
