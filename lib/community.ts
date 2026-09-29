// What the Comunidad endpoints (/api/comunidad/**) send to the app. Shared by the
// server routes and the client, so both sides agree on the shapes.

export type PostKind = 'post' | 'reflection' | 'daily'

export interface CommunityPost {
  id: string
  author: string
  kind: PostKind
  text: string
  lessonKey: string | null
  /** ISO date-time. */
  createdAt: string
  likes: number
  comments: number
  liked: boolean
  /** Written by the member who is asking. */
  mine: boolean
}

export interface CommunityComment {
  id: string
  author: string
  text: string
  createdAt: string
  mine: boolean
}

export interface FeedResponse {
  posts: CommunityPost[]
  /** The latest Palabra del día (first page only). */
  daily: CommunityPost | null
  /** Pass back as ?cursor= for the next page; null at the end. */
  next: string | null
  /** Show the example members/posts too (fewer real members than REAL_MEMBERS_TO_HIDE_SEEDS). */
  seeds: boolean
}

export interface ServerRankRow {
  name: string
  weekPoints: number
  streak: number
  rank: number
  me: boolean
}

export interface RankingResponse {
  mode: 'semana' | 'racha'
  /** Top real members (already ranked among real members only). */
  rows: ServerRankRow[]
  /** The asking member's row among real members (null: no progress yet). */
  me: ServerRankRow | null
  /** Real members in the ranking. */
  total: number
  seeds: boolean
}

/**
 * The name other members see: first name + the initial of the next word ("Rosa Elena
 * Quispe" → "Rosa E.", "Javier Herrera" → "Javier H."); empty → "Hermano/a".
 */
export function displayName(full: string | null | undefined): string {
  const words = (full ?? '').replace(/[^\p{L}\p{M}' -]/gu, ' ').trim().split(/\s+/).filter(Boolean)
  if (!words.length) return 'Hermano/a'
  const first = words[0].slice(0, 24)
  const name = first.charAt(0).toUpperCase() + first.slice(1)
  return words.length > 1 ? `${name} ${words[1].charAt(0).toUpperCase()}.` : name
}

/** Minutes since an ISO date-time (0 when `minute` is not known yet). */
export function minutesSince(iso: string, minute: number): number {
  const t = Date.parse(iso)
  return minute && !Number.isNaN(t) ? Math.max(0, minute - Math.floor(t / 60_000)) : 0
}
