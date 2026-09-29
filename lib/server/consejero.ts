import 'server-only'
import { CONSEJERO } from '../config'
import { ownedOffers } from './access'
import { db, t } from './db'

// Who may talk with the Consejero today, and the conversation kept for each member.
// Members with Palabras del Señor: 30 messages a day. Everyone else signed in: 1 free
// question a day. Days are counted in UTC.

export interface ConsejeroStatus {
  member: boolean
  limit: number
  used: number
  /** When this member's 50%-off window started (non-members only). */
  offerStartedAt: string | null
}

export const today = () => new Date().toISOString().slice(0, 10)

export async function consejeroStatus(email: string): Promise<ConsejeroStatus> {
  const [owned, usage] = await Promise.all([
    ownedOffers(email),
    db().from(t('consejero_usage')).select('count').eq('email', email).eq('day', today()).maybeSingle(),
  ])
  const member = owned.includes('upsell2')
  let offerStartedAt: string | null = null
  if (!member) {
    const { data } = await db().from(t('members')).select('offer_started_at').eq('email', email).maybeSingle()
    offerStartedAt = data?.offer_started_at ?? null
    if (!offerStartedAt) {
      // The personal 15 days start the first time the offer is shown — once, on the server.
      offerStartedAt = new Date().toISOString()
      await db().from(t('members')).upsert({ email, offer_started_at: offerStartedAt }, { onConflict: 'email' })
    }
  }
  return { member, limit: member ? CONSEJERO.dailyLimit : 1, used: usage.data?.count ?? 0, offerStartedAt }
}

export async function countMessage(email: string): Promise<void> {
  await db().rpc(t('consejero_count'), { p_email: email, p_day: today() })
}

export interface StoredMessage {
  role: 'user' | 'assistant'
  content: string
  crisis: boolean
  created_at: string
}

/** The last `limit` messages of one conversation, oldest first. */
export async function recentMessages(email: string, conversationId: string, limit: number): Promise<StoredMessage[]> {
  const { data } = await db()
    .from(t('consejero_messages'))
    .select('role, content, crisis, created_at')
    .eq('email', email)
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(limit)
  return ((data ?? []) as StoredMessage[]).reverse()
}

export interface ConversationSummary {
  id: string
  /** The member's first question, shortened. */
  title: string
  updatedAt: string
  /** Questions asked in it. */
  questions: number
}

/** The member's conversations, most recent first (built from their questions). */
export async function listConversations(email: string): Promise<ConversationSummary[]> {
  const { data } = await db()
    .from(t('consejero_messages'))
    .select('conversation_id, content, created_at')
    .eq('email', email)
    .eq('role', 'user')
    .not('conversation_id', 'is', null)
    .order('created_at', { ascending: true })
    .limit(2000)
  const byId = new Map<string, ConversationSummary>()
  for (const row of (data ?? []) as { conversation_id: string; content: string; created_at: string }[]) {
    const c = byId.get(row.conversation_id)
    if (c) {
      c.updatedAt = row.created_at
      c.questions++
    } else {
      const title = row.content.replace(/\s+/g, ' ').trim()
      byId.set(row.conversation_id, { id: row.conversation_id, title: title.length > 90 ? `${title.slice(0, 88)}…` : title, updatedAt: row.created_at, questions: 1 })
    }
  }
  return [...byId.values()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export async function saveMessage(email: string, conversationId: string, role: 'user' | 'assistant', content: string, crisis = false): Promise<void> {
  await db().from(t('consejero_messages')).insert({ email, conversation_id: conversationId, role, content, crisis })
}

/** Deletes one conversation, or all of them. */
export async function clearMessages(email: string, conversationId?: string): Promise<void> {
  const q = db().from(t('consejero_messages')).delete().eq('email', email)
  await (conversationId ? q.eq('conversation_id', conversationId) : q)
}
