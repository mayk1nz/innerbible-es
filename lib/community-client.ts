'use client'

import { useEffect, useState } from 'react'
import type { CommunityComment, CommunityPost, FeedResponse, RankingResponse } from './community'
import type { RankMode } from './gamification'

// The app's side of the real Comunidad (/api/comunidad/**). Every call resolves — never
// throws — to { ok: true, … } or { ok: false, error }, so the screens can show a calm
// message when the member is offline or the server is busy.

export type Result<T> = ({ ok: true } & T) | { ok: false; error: string }

async function call<T>(url: string, init?: RequestInit): Promise<Result<T>> {
  try {
    const res = await fetch(url, {
      cache: 'no-store',
      ...init,
      headers: init?.body ? { 'content-type': 'application/json' } : undefined,
    })
    const body = (await res.json().catch(() => ({}))) as T & { error?: string }
    if (!res.ok) return { ok: false, error: body.error ?? `http-${res.status}` }
    return { ok: true, ...body }
  } catch {
    return { ok: false, error: 'offline' }
  }
}

const send = (method: string, body?: unknown): RequestInit => ({ method, ...(body === undefined ? {} : { body: JSON.stringify(body) }) })

export const fetchFeed = (cursor?: string | null) =>
  call<FeedResponse>(`/api/comunidad${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''}`)

export const createPost = (text: string, lessonKey: string | null) =>
  call<{ post: CommunityPost }>('/api/comunidad', send('POST', { text, lessonKey }))

export const deletePost = (id: string) => call<{ ok: true }>(`/api/comunidad/${id}`, send('DELETE'))

export const setAmen = (id: string, liked: boolean) =>
  call<{ likes: number; liked: boolean }>(`/api/comunidad/${id}/amen`, send(liked ? 'PUT' : 'DELETE'))

export const fetchComments = (id: string) => call<{ comments: CommunityComment[] }>(`/api/comunidad/${id}/comentarios`)

export const createComment = (id: string, text: string) =>
  call<{ comment: CommunityComment }>(`/api/comunidad/${id}/comentarios`, send('POST', { text }))

export const fetchLessonItems = (lessonKey: string) =>
  call<{ items: CommunityPost[]; seeds: boolean }>(`/api/comunidad/reflexion?lesson=${encodeURIComponent(lessonKey)}`)

/** Publishes the member's reflection on a lesson (shared) or takes it down (not shared / empty). */
export const shareReflection = (lessonKey: string, text: string, shared: boolean) =>
  call<{ shared: boolean }>('/api/comunidad/reflexion', send('PUT', { lesson: lessonKey, text, shared }))

/** What the member will read for a failed action. */
export function errorText(error: string): string {
  if (error === 'offline') return 'Sin conexión. Revisa tu internet e inténtalo de nuevo.'
  if (error === 'limit') return 'Llegaste al límite de hoy. Mañana puedes seguir compartiendo.'
  if (error === 'no-purchase') return 'Para publicar necesitas un acceso activo.'
  if (error === 'no-session') return 'Tu sesión terminó. Vuelve a entrar para publicar.'
  if (error === 'too-long') return 'El texto es demasiado largo.'
  return 'No pudimos completar esto ahora. Inténtalo de nuevo en un momento.'
}

// ─── Ranking ───────────────────────────────────────────────────────

type RankState = { data: RankingResponse | null; error: boolean }
/** Last answer per mode: shown at once when the member comes back, then refreshed. */
const rankCache = new Map<RankMode, RankState>()

export function useRanking(mode: RankMode): { status: 'loading' | 'ok' | 'error'; data: RankingResponse | null } {
  const [results, setResults] = useState<Partial<Record<RankMode, RankState>>>({})
  useEffect(() => {
    let alive = true
    void call<RankingResponse>(`/api/comunidad/ranking?mode=${mode}`).then((r) => {
      const state: RankState = r.ok ? { data: r, error: false } : { data: rankCache.get(mode)?.data ?? null, error: !rankCache.get(mode)?.data }
      if (r.ok) rankCache.set(mode, state)
      if (alive) setResults((prev) => ({ ...prev, [mode]: state }))
    })
    return () => {
      alive = false
    }
  }, [mode])
  const r = results[mode] ?? rankCache.get(mode)
  if (!r) return { status: 'loading', data: null }
  return r.error || !r.data ? { status: 'error', data: null } : { status: 'ok', data: r.data }
}
