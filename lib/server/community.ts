import 'server-only'
import { displayName, type CommunityComment, type CommunityPost, type PostKind } from '../community'
import { ownedOffers, normalizeEmail } from './access'
import { db, t } from './db'
import { sessionEmail } from './session'

// Shared pieces of the Comunidad routes (app/api/comunidad/**). Every route needs a
// session; writing (posts, reflections, comments, likes) needs an active purchase.
// Database errors are logged here and never reach the member.

export const json = (body: unknown, status = 200) => Response.json(body, { status })
export const unavailable = (where: string, e: unknown) => {
  console.error(`comunidad: ${where}`, e instanceof Error ? e.message : (e as { message?: string })?.message ?? e)
  return json({ error: 'unavailable' }, 503)
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
export const isUuid = (v: unknown): v is string => typeof v === 'string' && UUID.test(v)

/** "cronologico/genesis-1-11": a product and a lesson, plain slugs. */
const LESSON_KEY = /^[a-z0-9]+(?:-[a-z0-9]+)*\/[a-z0-9]+(?:-[a-z0-9]+)*$/
export const isLessonKey = (v: unknown): v is string => typeof v === 'string' && v.length <= 120 && LESSON_KEY.test(v)

/** Trimmed, control characters out, at most two blank lines in a row. */
export function cleanText(raw: unknown): string {
  if (typeof raw !== 'string') return ''
  return raw
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/** The signed-in e-mail (normalized), or null. */
export async function viewer(): Promise<string | null> {
  const email = await sessionEmail()
  return email ? normalizeEmail(email) : null
}

/** Only members with an active purchase write in the Comunidad. */
export async function canWrite(email: string): Promise<boolean> {
  return (await ownedOffers(email)).length > 0
}

/** The name this member's posts carry ("Rosa E."). */
export async function authorOf(email: string): Promise<string> {
  const { data } = await db().from(t('members')).select('name').eq('email', email).maybeSingle()
  return displayName(data?.name)
}

/** How many rows this member wrote in the last 24 hours. */
export async function writtenToday(table: 'community_posts' | 'community_comments', email: string, kind?: PostKind): Promise<number> {
  let q = db()
    .from(t(table))
    .select('id', { count: 'exact', head: true })
    .eq('email', email)
    .gte('created_at', new Date(Date.now() - 86_400_000).toISOString())
  if (kind) q = q.eq('kind', kind)
  const { count, error } = await q
  if (error) throw error
  return count ?? 0
}

export interface PostRow {
  id: string
  email: string | null
  author: string
  kind: PostKind
  text: string
  lesson_key: string | null
  created_at: string
}

export const POST_COLUMNS = 'id, email, author, kind, text, lesson_key, created_at'

/** Rows → what the app gets: counts, "I liked it", "it's mine" — never the e-mails. */
export async function withCounts(rows: PostRow[], email: string): Promise<CommunityPost[]> {
  if (!rows.length) return []
  const { data, error } = await db().rpc(t('community_counts'), { p_ids: rows.map((r) => r.id), p_email: email })
  if (error) throw error
  const counts = new Map(((data ?? []) as { post_id: string; likes: number; comments: number; liked: boolean }[]).map((c) => [c.post_id, c]))
  return rows.map((r) => {
    const c = counts.get(r.id)
    return {
      id: r.id,
      author: r.author,
      kind: r.kind,
      text: r.text,
      lessonKey: r.lesson_key,
      createdAt: r.created_at,
      likes: Number(c?.likes ?? 0),
      comments: Number(c?.comments ?? 0),
      liked: Boolean(c?.liked),
      mine: r.email !== null && r.email === email,
    }
  })
}

export interface CommentRow {
  id: string
  email: string
  author: string
  text: string
  created_at: string
}

export function toComment(r: CommentRow, email: string): CommunityComment {
  return { id: r.id, author: r.author, text: r.text, createdAt: r.created_at, mine: r.email === email }
}
