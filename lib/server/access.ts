import 'server-only'
import type { OfferId } from '../catalog'
import { hasFullAccess } from '../config'
import { db } from './db'

// What an e-mail can open, from the entitlements the KashPay webhook keeps up to date.
// Subscriptions stay open until the paid period ends, plus a few days of grace for a
// renewal that is late (card retries); a refund or chargeback closes them at once.

const ALL: OfferId[] = ['front', 'upsell1', 'upsell2']
const GRACE_MS = 3 * 86_400_000

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export async function ownedOffers(email: string): Promise<OfferId[]> {
  if (hasFullAccess(email)) return [...ALL]
  const { data, error } = await db()
    .from('entitlements')
    .select('offer, status, current_period_end')
    .eq('email', normalizeEmail(email))
  if (error) throw error
  const now = Date.now()
  const owned = (data ?? [])
    .filter((e) => e.status !== 'refunded')
    .filter((e) => !e.current_period_end || new Date(e.current_period_end).getTime() + GRACE_MS > now)
    .map((e) => e.offer as OfferId)
  // Anyone who bought an upsell necessarily bought the main product.
  if (owned.length && !owned.includes('front')) owned.push('front')
  return ALL.filter((o) => owned.includes(o))
}

export async function touchMember(email: string, name: string): Promise<void> {
  await db()
    .from('members')
    .upsert({ email: normalizeEmail(email), name, last_login_at: new Date().toISOString() }, { onConflict: 'email' })
}
