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

/** Offers + the saved name + whether the member is on the annual plan. */
export async function memberInfo(email: string): Promise<{ owned: OfferId[]; name: string; annual: boolean }> {
  const e = normalizeEmail(email)
  const [owned, member, annualRows] = await Promise.all([
    ownedOffers(e),
    db().from('members').select('name').eq('email', e).maybeSingle(),
    db().from('entitlements').select('product, status, current_period_end').eq('email', e).ilike('product', '%anual%'),
  ])
  const now = Date.now()
  const annual = (annualRows.data ?? []).some(
    (r) => r.status !== 'refunded' && (!r.current_period_end || new Date(r.current_period_end).getTime() > now),
  )
  return { owned, name: member.data?.name ?? '', annual }
}

/** Records the login; keeps a name the member already chose. */
export async function touchMember(email: string, name: string): Promise<void> {
  const e = normalizeEmail(email)
  const { data } = await db().from('members').select('name').eq('email', e).maybeSingle()
  await db()
    .from('members')
    .upsert({ email: e, name: data?.name || name, last_login_at: new Date().toISOString() }, { onConflict: 'email' })
}
