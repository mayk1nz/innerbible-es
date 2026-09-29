import { hasOffensiveWords } from '@/lib/profanity'
import type { FeedResponse } from '@/lib/community'
import { COMMUNITY_LIMITS } from '@/lib/config'
import { db, t } from '@/lib/server/db'
import {
  POST_COLUMNS,
  authorOf,
  canWrite,
  cleanText,
  isLessonKey,
  isUuid,
  json,
  unavailable,
  viewer,
  withCounts,
  writtenToday,
  type PostRow,
} from '@/lib/server/community'
import { realBoard } from '@/lib/server/ranking'

// The wall: every member's posts and shared reflections, and the team's Palabra del día.
//   GET  ?cursor=&limit=  → FeedResponse (newest first; `next` for the following page)
//   POST { text, lessonKey? } → { post }   (10 a day, 1500 characters)

export const dynamic = 'force-dynamic'

const PAGE = 20

function readCursor(raw: string | null): { at: string; id: string } | null {
  if (!raw) return null
  try {
    const [at, id] = Buffer.from(raw, 'base64url').toString().split('|')
    return at && !Number.isNaN(Date.parse(at)) && isUuid(id) ? { at, id } : null
  } catch {
    return null
  }
}

export async function GET(request: Request) {
  const email = await viewer()
  if (!email) return json({ error: 'no-session' }, 401)
  const url = new URL(request.url)
  const cursor = readCursor(url.searchParams.get('cursor'))
  const limit = Math.min(PAGE, Math.max(1, Number(url.searchParams.get('limit')) || PAGE))
  try {
    let q = db().from(t('community_posts')).select(POST_COLUMNS).eq('hidden', false)
    if (cursor) q = q.or(`created_at.lt."${cursor.at}",and(created_at.eq."${cursor.at}",id.lt.${cursor.id})`)
    const [page, daily, board] = await Promise.all([
      q.order('created_at', { ascending: false }).order('id', { ascending: false }).limit(limit + 1),
      cursor
        ? Promise.resolve({ data: [] as PostRow[], error: null })
        : db().from(t('community_posts')).select(POST_COLUMNS).eq('kind', 'daily').eq('hidden', false).order('day', { ascending: false }).limit(1),
      realBoard(),
    ])
    if (page.error) throw page.error
    if (daily.error) throw daily.error
    const rows = (page.data ?? []) as PostRow[]
    const more = rows.length > limit
    const shown = rows.slice(0, limit)
    const dailyRow = ((daily.data ?? []) as PostRow[])[0] ?? null
    const posts = await withCounts(dailyRow && !shown.some((r) => r.id === dailyRow.id) ? [...shown, dailyRow] : shown, email)
    const last = shown[shown.length - 1]
    const body: FeedResponse = {
      posts: posts.filter((p) => shown.some((r) => r.id === p.id)),
      daily: dailyRow ? posts.find((p) => p.id === dailyRow.id) ?? null : null,
      next: more && last ? Buffer.from(`${last.created_at}|${last.id}`).toString('base64url') : null,
      seeds: board.seeds,
    }
    return json(body)
  } catch (e) {
    return unavailable('feed', e)
  }
}

export async function POST(request: Request) {
  const email = await viewer()
  if (!email) return json({ error: 'no-session' }, 401)
  const body = (await request.json().catch(() => ({}))) as { text?: unknown; lessonKey?: unknown }
  const text = cleanText(body.text)
  if (!text) return json({ error: 'empty' }, 400)
  if (text.length > COMMUNITY_LIMITS.postChars) return json({ error: 'too-long' }, 400)
  if (hasOffensiveWords(text)) return json({ error: 'offensive' }, 400)
  const lessonKey = isLessonKey(body.lessonKey) ? body.lessonKey : null
  try {
    if (!(await canWrite(email))) return json({ error: 'no-purchase' }, 403)
    if ((await writtenToday('community_posts', email, 'post')) >= COMMUNITY_LIMITS.postsPerDay) return json({ error: 'limit' }, 429)
    const author = await authorOf(email)
    const { data, error } = await db()
      .from(t('community_posts'))
      .insert({ email, author, kind: 'post', text, lesson_key: lessonKey })
      .select(POST_COLUMNS)
      .single()
    if (error) throw error
    const [post] = await withCounts([data as PostRow], email)
    return json({ post }, 201)
  } catch (e) {
    return unavailable('create post', e)
  }
}
