import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { FunnelDashboard } from '@/components/admin/FunnelDashboard'
import { isAdminEmail } from '@/lib/config'
import { sessionEmail } from '@/lib/server/session'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Funil', robots: { index: false, follow: false } }

// The owner's funnel panel. Only for ADMIN_EMAILS signed in to the app: anyone else gets
// the ordinary 404 page.
export default async function Page() {
  let email: string | null = null
  try {
    email = await sessionEmail()
  } catch {
    email = null
  }
  if (!isAdminEmail(email)) notFound()
  return <FunnelDashboard />
}
