import { ownedOffers } from '@/lib/server/access'
import { endSession, sessionEmail } from '@/lib/server/session'

// Who is signed in on this device and what they can open right now (a new purchase,
// a cancellation or a refund shows up here on the next visit).

export const dynamic = 'force-dynamic'

export async function GET() {
  const email = await sessionEmail()
  if (!email) return Response.json({ error: 'no-session' }, { status: 401 })
  const owned = await ownedOffers(email)
  return Response.json({ email, owned })
}

/** Sign out on this device. */
export async function DELETE() {
  await endSession()
  return Response.json({ ok: true })
}
