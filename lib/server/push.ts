import 'server-only'
import webpush from 'web-push'
import { PUSH_PUBLIC_KEY } from '../config'
import { db, t } from './db'

// Web push: the daily reminder. The private key lives in the database (app_config),
// the public one in the code (lib/config) — it's public by design.

let ready = false

async function setup(): Promise<void> {
  if (ready) return
  const { data } = await db().from(t('app_config')).select('value').eq('key', 'vapid_private_key').single()
  if (!data?.value) throw new Error('push private key missing')
  webpush.setVapidDetails('mailto:contact@innerbible.app', PUSH_PUBLIC_KEY, data.value)
  ready = true
}

export interface PushSub {
  endpoint: string
  keys: { p256dh: string; auth: string }
}

export async function saveSubscription(email: string, sub: PushSub, tz?: string): Promise<void> {
  await db()
    .from(t('push_subscriptions'))
    .upsert({ endpoint: sub.endpoint, email, p256dh: sub.keys.p256dh, auth: sub.keys.auth, ...(tz ? { tz } : {}) }, { onConflict: 'endpoint' })
}

interface SubRow {
  endpoint: string
  email: string
  p256dh: string
  auth: string
  tz: string | null
  morning_day: string | null
  night_day: string | null
  week_day: string | null
  milestone: number
}

/**
 * The hourly run: every device whose local time is now morning or night gets that
 * reminder once a day, written for its member (reminders.ts). Devices that no longer
 * exist (404/410) are removed.
 */
export async function sendScheduled(now = new Date(), dry = false): Promise<{ sent: number; removed: number; failed: number; skipped: number; preview?: { email: string; slot: string; local: string; reminder: Reminder }[] }> {
  await setup()
  const { data } = await db()
    .from(t('push_subscriptions'))
    .select('endpoint, email, p256dh, auth, tz, morning_day, night_day, week_day, milestone')
    .limit(20000)
  const subs = (data ?? []) as SubRow[]
  const { localNow, slotAt, memberContexts, morningMessage, nightMessage, milestoneFor } = await import('./reminders')
  const due = subs
    .map((s) => ({ s, local: localNow(s.tz, now) }))
    .map((x) => ({ ...x, slot: slotAt(x.local.hour) }))
    .filter((x) => x.slot && (x.slot === 'morning' ? x.s.morning_day : x.s.night_day) !== x.local.day)
  const localDayOf = new Map(due.map((x) => [x.s.email, x.local.day]))
  const contexts = await memberContexts([...localDayOf.keys()], (email) => localDayOf.get(email) ?? now.toISOString().slice(0, 10))
  let sent = 0
  let removed = 0
  let failed = 0
  let skipped = 0
  const preview: { email: string; slot: string; local: string; reminder: Reminder }[] = []
  for (const { s, local, slot } of due) {
    const c = contexts.get(s.email)
    // Only members with an active purchase.
    if (!c || !c.owned.length) {
      skipped++
      continue
    }
    const celebrated = c.streak < s.milestone ? 0 : s.milestone
    const milestone = slot === 'night' ? milestoneFor(c.streak, celebrated) : null
    const weekly = slot === 'night' && local.sunday && s.week_day !== local.day
    const reminder = slot === 'morning' ? morningMessage(c, local.day) : nightMessage(c, local.day, weekly, milestone)
    // Rehearsal: what would be sent, nothing sent or saved.
    if (dry) {
      preview.push({ email: s.email.replace(/^(.{2}).*(@.*)$/, '$1…$2'), slot: slot ?? '', local: ` ${local.hour}h`, reminder })
      continue
    }
    try {
      await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, JSON.stringify(reminder), { TTL: 60 * 60 * 3 })
      await db()
        .from(t('push_subscriptions'))
        .update({
          ...(slot === 'morning' ? { morning_day: local.day } : { night_day: local.day }),
          ...(weekly ? { week_day: local.day } : {}),
          milestone: milestone ?? celebrated,
          last_sent_day: local.day,
        })
        .eq('endpoint', s.endpoint)
      sent++
    } catch (e) {
      const code = (e as { statusCode?: number }).statusCode
      if (code === 404 || code === 410) {
        await db().from(t('push_subscriptions')).delete().eq('endpoint', s.endpoint)
        removed++
      } else failed++
    }
  }
  return { sent, removed, failed, skipped, ...(dry ? { preview } : {}) }
}

export async function removeSubscription(email: string, endpoint: string): Promise<void> {
  await db().from(t('push_subscriptions')).delete().eq('endpoint', endpoint).eq('email', email)
}

export interface Reminder {
  title: string
  body: string
  url: string
}

/**
 * Sends `reminder` once today to every subscribed device that hasn't had one yet.
 * Devices that no longer exist (the browser says 404/410) are removed.
 */
export async function sendDailyReminders(pick: (email: string) => Reminder): Promise<{ sent: number; removed: number; failed: number }> {
  await setup()
  const today = new Date().toISOString().slice(0, 10)
  const { data } = await db()
    .from(t('push_subscriptions'))
    .select('endpoint, email, p256dh, auth, last_sent_day')
    .or(`last_sent_day.is.null,last_sent_day.lt.${today}`)
    .limit(5000)
  let sent = 0
  let removed = 0
  let failed = 0
  for (const s of data ?? []) {
    try {
      await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, JSON.stringify(pick(s.email)), { TTL: 60 * 60 * 12 })
      await db().from(t('push_subscriptions')).update({ last_sent_day: today }).eq('endpoint', s.endpoint)
      sent++
    } catch (e) {
      const code = (e as { statusCode?: number }).statusCode
      if (code === 404 || code === 410) {
        await db().from(t('push_subscriptions')).delete().eq('endpoint', s.endpoint)
        removed++
      } else failed++
    }
  }
  return { sent, removed, failed }
}
