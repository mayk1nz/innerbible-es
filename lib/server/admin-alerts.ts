import 'server-only'
import { adminEmails } from '../config'
import { db, t } from './db'
import { sendPush } from './push'

// Real-time push to the owner's devices (push_subscriptions of the ADMIN_EMAILS: sign in
// to the app with one of them and turn notifications on in Perfil).
// ADMIN_PUSH_DRY=1 → rehearsal: nothing is sent, the result says what would have been.

export interface AlertResult {
  dry: boolean
  devices: number
  sent: number
  result: string
}

export async function notifyAdmins(message: { title: string; body: string; url: string; tag?: string }): Promise<AlertResult> {
  const dry = process.env.ADMIN_PUSH_DRY === '1'
  const emails = adminEmails()
  const { data, error } = await db().from(t('push_subscriptions')).select('endpoint, p256dh, auth, email').in('email', emails)
  if (error) return { dry, devices: 0, sent: 0, result: 'devices lookup failed' }
  const subs = data ?? []
  if (dry) return { dry, devices: subs.length, sent: 0, result: `dry run: ${subs.length} device(s) would get it` }
  if (!subs.length) return { dry, devices: 0, sent: 0, result: 'no admin device with notifications on' }
  let sent = 0
  for (const s of subs) {
    try {
      if ((await sendPush(s, { ...message }, 60 * 60 * 24)) === 'sent') sent++
    } catch {
      // one device failing never stops the others
    }
  }
  return { dry, devices: subs.length, sent, result: `sent ${sent}/${subs.length}` }
}
