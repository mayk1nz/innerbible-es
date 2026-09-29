'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { Icon } from '../icons'
import { RankItem, RankSkeleton, useLeaderboard } from '../Leaderboard'
import { PageHeader } from '../PageHeader'
import { Avatar, EmptyState, Segmented } from '../ui'
import { minutesSince, type CommunityComment, type CommunityPost } from '@/lib/community'
import {
  createComment,
  createPost,
  deletePost,
  errorText,
  fetchComments,
  fetchFeed,
  setAmen,
} from '@/lib/community-client'
import { SEED_POSTS, type SeedComment } from '@/lib/community-seed'
import { POINTS, TEAM_AUTHOR } from '@/lib/config'
import { computeStats, type RankMode } from '@/lib/gamification'
import { findLessonByKey, lessonHref } from '@/lib/progress'
import { addComment, addPost, removePost, toggleLike, useAppState, useNowMinute, useToday, type PostComment } from '@/lib/store'
import { timeAgo } from '@/lib/text'

type Tab = 'muro' | 'constancia'

export function CommunityView() {
  const params = useSearchParams()
  const [tab, setTab] = useState<Tab>(params.get('tab') === 'constancia' ? 'constancia' : 'muro')
  return (
    <>
      <PageHeader title="Comunidad" subtitle="Comparte tu recorrido y aprende con otros hermanos" />
      <Segmented
        label="Secciones de la comunidad"
        value={tab}
        onChange={setTab}
        options={[
          { value: 'muro', label: 'Muro' },
          { value: 'constancia', label: 'Constancia' },
        ]}
      />
      <div className="mt-5">{tab === 'muro' ? <Wall /> : <Standing />}</div>
    </>
  )
}

// ─── Muro ──────────────────────────────────────────────────────────
// The real posts come from the server (/api/comunidad) and are seen by every member.
// While the Comunidad is small (feed.seeds) the example posts show too, mixed by age;
// their "amén" and comments stay on this device.

interface FeedState {
  status: 'loading' | 'ok' | 'error'
  posts: CommunityPost[]
  daily: CommunityPost | null
  next: string | null
  seeds: boolean
  more: 'idle' | 'loading' | 'error'
}

const EMPTY_FEED: FeedState = { status: 'loading', posts: [], daily: null, next: null, seeds: true, more: 'idle' }

type WallItem =
  | { src: 'real'; ago: number; post: CommunityPost }
  | { src: 'seed'; ago: number; id: string; author: string; text: string; lessonKey: string | null; baseLikes: number; seedComments: SeedComment[]; mine: boolean }

function Wall() {
  const s = useAppState()
  const minute = useNowMinute()
  const me = s.session?.name ?? 'Tú'
  const [feed, setFeed] = useState<FeedState>(EMPTY_FEED)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let alive = true
    void fetchFeed().then((r) => {
      if (!alive) return
      setFeed(r.ok ? { status: 'ok', posts: r.posts, daily: r.daily, next: r.next, seeds: r.seeds, more: 'idle' } : { ...EMPTY_FEED, status: 'error' })
    })
    return () => {
      alive = false
    }
  }, [attempt])

  const retry = () => {
    setFeed(EMPTY_FEED)
    setAttempt((n) => n + 1)
  }

  const loadMore = async () => {
    if (!feed.next || feed.more === 'loading') return
    setFeed((f) => ({ ...f, more: 'loading' }))
    const r = await fetchFeed(feed.next)
    setFeed((f) =>
      r.ok
        ? { ...f, posts: [...f.posts, ...r.posts.filter((p) => !f.posts.some((q) => q.id === p.id))], next: r.next, more: 'idle' }
        : { ...f, more: 'error' },
    )
  }

  const replace = (post: CommunityPost) =>
    setFeed((f) => ({ ...f, posts: f.posts.map((p) => (p.id === post.id ? post : p)), daily: f.daily?.id === post.id ? post : f.daily }))
  const drop = (id: string) => {
    removePost(id)
    setFeed((f) => ({ ...f, posts: f.posts.filter((p) => p.id !== id) }))
  }
  const posted = (post: CommunityPost) => setFeed((f) => ({ ...f, posts: [post, ...f.posts.filter((p) => p.id !== post.id)] }))

  const items = useMemo<WallItem[]>(() => {
    const real: WallItem[] = feed.posts
      .filter((p) => p.id !== feed.daily?.id)
      .map((p) => ({ src: 'real', ago: minutesSince(p.createdAt, minute), post: p }))
    // Posts written before the Comunidad was real: only their author ever saw them.
    const legacy: WallItem[] = s.posts
      .filter((p) => p.id.startsWith('post_'))
      .map((p) => ({
        src: 'seed',
        id: p.id,
        author: me,
        text: p.text,
        ago: minute ? Math.max(0, minute - Math.floor(p.at / 60_000)) : 0,
        baseLikes: 0,
        lessonKey: p.lessonKey,
        seedComments: [],
        mine: true,
      }))
    const showSeeds = feed.status !== 'ok' || feed.seeds
    // With more real pages to load, an example post older than the last real one waits for them.
    const oldest = feed.next && real.length ? real[real.length - 1].ago : Infinity
    const seeds: WallItem[] = showSeeds
      ? SEED_POSTS.filter((p) => p.ageMin <= oldest).map((p) => ({
          src: 'seed',
          id: p.id,
          author: p.author,
          text: p.text,
          ago: p.ageMin,
          baseLikes: p.likes,
          lessonKey: p.lessonKey ?? null,
          seedComments: p.comments,
          mine: false,
        }))
      : []
    return [...real, ...legacy, ...seeds].sort((a, b) => a.ago - b.ago)
  }, [feed, s.posts, minute, me])

  return (
    <>
      {feed.daily && (
        <ul aria-label="Palabra del día">
          <RealPostCard post={feed.daily} minute={minute} onChange={replace} onDelete={drop} />
        </ul>
      )}
      <div className={feed.daily ? 'mt-4' : ''}>
        <Composer name={me} lastLesson={s.lastLesson} onPosted={posted} />
      </div>

      {feed.status === 'error' && (
        <div role="alert" className="mt-4 flex items-center gap-3 rounded-2xl border border-line bg-surface-2 px-4 py-3">
          <Icon name="alert" className="size-5 shrink-0 text-muted" />
          <p className="min-w-0 flex-1 text-[15px] leading-snug text-text">No pudimos cargar el muro de los hermanos.</p>
          <button type="button" onClick={retry} className="inline-flex min-h-11 shrink-0 items-center rounded-full px-3 text-[15px] font-semibold text-primary hover:bg-surface-hover">
            Reintentar
          </button>
        </div>
      )}

      {feed.status === 'loading' ? (
        <ul className="mt-5 space-y-4" aria-busy="true" aria-label="Cargando el muro">
          {[0, 1, 2].map((i) => (
            <li key={i} className="animate-pulse rounded-3xl border border-line bg-surface p-4">
              <div className="flex items-center gap-3">
                <span className="size-11 rounded-full bg-line-soft" />
                <span className="h-3.5 w-32 rounded-full bg-line-soft" />
              </div>
              <span className="mt-4 block h-3.5 w-full rounded-full bg-line-soft" />
              <span className="mt-2 block h-3.5 w-3/4 rounded-full bg-line-soft" />
            </li>
          ))}
        </ul>
      ) : items.length === 0 ? (
        <div className="mt-5">
          <EmptyState icon="users" title="Todavía no hay publicaciones" text="Comparte lo que Dios te habló hoy y anima a los hermanos." />
        </div>
      ) : (
        <ul className="mt-5 space-y-4">
          {items.map((item) =>
            item.src === 'real' ? (
              <RealPostCard key={item.post.id} post={item.post} minute={minute} onChange={replace} onDelete={drop} />
            ) : (
              <LocalPostCard key={item.id} item={item} liked={Boolean(s.likes[item.id])} comments={s.comments[item.id] ?? []} minute={minute} />
            ),
          )}
        </ul>
      )}

      {feed.status === 'ok' && feed.next && (
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={feed.more === 'loading'}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-surface px-5 text-[15px] font-semibold text-ink transition hover:bg-surface-hover disabled:opacity-60"
          >
            {feed.more === 'loading' ? 'Cargando…' : 'Ver publicaciones anteriores'}
          </button>
          {feed.more === 'error' && (
            <p role="alert" className="mt-2 text-[14.5px] text-muted">
              No pudimos cargar más. Inténtalo de nuevo.
            </p>
          )}
        </div>
      )}
    </>
  )
}

function Composer({ name, lastLesson, onPosted }: { name: string; lastLesson: string | null; onPosted: (post: CommunityPost) => void }) {
  const [text, setText] = useState('')
  const [linked, setLinked] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const lesson = lastLesson ? findLessonByKey(lastLesson) : null

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!text.trim() || busy) return
    setBusy(true)
    setError('')
    const lessonKey = linked && lastLesson ? lastLesson : null
    const r = await createPost(text, lessonKey)
    setBusy(false)
    if (!r.ok) {
      setError(errorText(r.error))
      return
    }
    addPost(r.post.text, lessonKey, r.post.id)
    onPosted(r.post)
    setText('')
    setLinked(false)
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-line bg-surface p-4 shadow-card">
      <div className="flex gap-3">
        <Avatar name={name} primary />
        <label htmlFor="nuevo-post" className="sr-only">
          Escribe una publicación
        </label>
        <textarea
          id="nuevo-post"
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            setError('')
          }}
          rows={3}
          maxLength={1500}
          placeholder="¿Qué te habló Dios hoy?"
          className="min-w-0 flex-1 resize-none rounded-2xl border border-line bg-surface-2 px-4 py-3 text-[16px] leading-relaxed text-ink placeholder:text-muted focus:border-primary focus:outline-none"
        />
      </div>
      {lesson && (
        <label className="mt-3 flex min-h-11 items-center gap-3 text-[15px] text-text">
          <input type="checkbox" checked={linked} onChange={(e) => setLinked(e.target.checked)} className="size-5 accent-primary" />
          <span>
            Sobre la lección <strong className="text-ink">{lesson.lesson.title}</strong>
          </span>
        </label>
      )}
      {error && (
        <p role="alert" className="mt-3 text-[14.5px] leading-snug text-danger">
          {error}
        </p>
      )}
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-[13.5px] text-muted">+{POINTS.post} pts al publicar · lo ven todos los hermanos</span>
        <button
          type="submit"
          disabled={!text.trim() || busy}
          className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-primary px-5 text-[15.5px] font-semibold text-white transition hover:bg-primary-hover disabled:opacity-45"
        >
          <Icon name="send" className="size-[18px]" />
          {busy ? 'Publicando…' : 'Publicar'}
        </button>
      </div>
    </form>
  )
}

/** The frame every post shares: author, lesson, text, amén and comments. */
function PostFrame({
  id,
  author,
  mine,
  team,
  reflection,
  ago,
  lessonKey,
  text,
  likes,
  liked,
  onLike,
  commentCount,
  open,
  onToggle,
  menu,
  children,
}: {
  id: string
  author: string
  mine: boolean
  team?: boolean
  reflection?: boolean
  ago: number
  lessonKey: string | null
  text: string
  likes: number
  liked: boolean
  onLike: () => void
  commentCount: number
  open: boolean
  onToggle: () => void
  menu?: ReactNode
  children?: ReactNode
}) {
  const lesson = lessonKey ? findLessonByKey(lessonKey) : null
  return (
    <article
      aria-labelledby={`autor-${id}`}
      className={`rounded-3xl border p-4 shadow-card ${team ? 'border-gold/50 bg-gold-soft/35' : 'border-line bg-surface'}`}
    >
      {team && (
        <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[12.5px] font-semibold uppercase tracking-[0.06em] text-gold-bright">
          <Icon name="sparkles" className="size-3.5" />
          Palabra del día
        </p>
      )}
      <div className="flex items-center gap-3">
        {team ? (
          <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-gold-bright">
            <Icon name="book" className="size-5" />
          </span>
        ) : (
          <Avatar name={author} primary={mine} />
        )}
        <div className="min-w-0 flex-1">
          <p id={`autor-${id}`} className="truncate text-[16px] font-semibold text-ink">
            {author}
            {mine && <span className="font-normal text-muted"> · tú</span>}
            {team && (
              <span className="ml-1.5 inline-flex translate-y-[-1px] items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 align-middle text-[12px] font-semibold text-primary">
                <Icon name="check" className="size-3" strokeWidth={3} />
                Equipo
              </span>
            )}
          </p>
          <p className="text-[13.5px] text-muted">
            {timeAgo(ago)}
            {reflection && ' · Reflexión'}
          </p>
        </div>
        {menu}
      </div>

      {lesson && (
        <Link
          href={lessonHref(lesson.product.id, lesson.lesson.id)}
          className="mt-3 inline-flex max-w-full items-center gap-1.5 rounded-full bg-gold-soft/70 px-3 py-1.5 text-[13.5px] font-semibold text-ink transition hover:bg-gold-soft"
        >
          <Icon name="book" className="size-4 shrink-0" />
          <span className="truncate">{lesson.lesson.title}</span>
        </Link>
      )}

      <p className="mt-3 whitespace-pre-line break-words font-serif text-[17px] leading-relaxed text-text">{text}</p>

      <div className="mt-3 flex items-center gap-2 border-t border-line-soft pt-2">
        <button
          type="button"
          onClick={onLike}
          aria-pressed={liked}
          aria-label={liked ? `Quitar amén (${likes})` : `Decir amén (${likes})`}
          className={`inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-[15px] font-semibold transition hover:bg-surface-hover ${liked ? 'text-danger' : 'text-muted'}`}
        >
          <Icon name="heart" className="size-5" filled={liked} />
          <span className="tabular-nums" aria-hidden>
            {likes}
          </span>
        </button>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`comentarios-${id}`}
          className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-[15px] font-semibold text-muted transition hover:bg-surface-hover"
        >
          <Icon name="message" className="size-5" />
          <span className="tabular-nums">{commentCount}</span>
          <span className="sr-only">{commentCount === 1 ? 'comentario' : 'comentarios'}</span>
        </button>
      </div>

      {open && (
        <div id={`comentarios-${id}`} className="mt-2 space-y-3 border-t border-line-soft pt-3">
          {children}
        </div>
      )}
    </article>
  )
}

function CommentBubble({ author, text, ago, mine }: { author: string; text: string; ago: number; mine?: boolean }) {
  return (
    <div className="flex gap-2.5">
      <Avatar name={author} size="sm" primary={mine} />
      <div className="min-w-0 flex-1 rounded-2xl bg-surface-2 px-3.5 py-2.5">
        <p className="text-[14px] font-semibold text-ink">
          {author}
          {mine && <span className="font-normal text-muted"> · tú</span>} <span className="font-normal text-muted">· {timeAgo(ago)}</span>
        </p>
        <p className="mt-0.5 whitespace-pre-line break-words text-[15.5px] leading-snug text-text">{text}</p>
      </div>
    </div>
  )
}

function CommentForm({ id, busy, onSend }: { id: string; busy?: boolean; onSend: (text: string) => Promise<boolean> | boolean }) {
  const [draft, setDraft] = useState('')
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!draft.trim() || busy) return
    if (await onSend(draft)) setDraft('')
  }
  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      <label htmlFor={`comentario-${id}`} className="sr-only">
        Escribe un comentario
      </label>
      <input
        id={`comentario-${id}`}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        maxLength={800}
        placeholder="Escribe un comentario…"
        className="min-h-11 min-w-0 flex-1 rounded-full border border-line bg-surface-2 px-4 text-[16px] text-ink placeholder:text-muted focus:border-primary focus:outline-none"
      />
      <button type="submit" disabled={!draft.trim() || busy} aria-label="Enviar comentario" className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-white disabled:opacity-45">
        <Icon name="send" className="size-[18px]" />
      </button>
    </form>
  )
}

/** A post from the server: amén, comments and deleting go to the server. */
function RealPostCard({
  post,
  minute,
  onChange,
  onDelete,
}: {
  post: CommunityPost
  minute: number
  onChange: (post: CommunityPost) => void
  onDelete: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [comments, setComments] = useState<{ status: 'idle' | 'loading' | 'ok' | 'error'; list: CommunityComment[] }>({ status: 'idle', list: [] })
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const loadComments = async () => {
    setComments((c) => ({ ...c, status: 'loading' }))
    const r = await fetchComments(post.id)
    setComments(r.ok ? { status: 'ok', list: r.comments } : { status: 'error', list: [] })
    if (r.ok && r.comments.length !== post.comments) onChange({ ...post, comments: r.comments.length })
  }

  const toggle = () => {
    const next = !open
    setOpen(next)
    if (next && comments.status !== 'ok') void loadComments()
  }

  const like = async () => {
    const liked = !post.liked
    // At once on screen; back as it was if the server says no.
    onChange({ ...post, liked, likes: Math.max(0, post.likes + (liked ? 1 : -1)) })
    setError('')
    const r = await setAmen(post.id, liked)
    if (r.ok) onChange({ ...post, liked: r.liked, likes: r.likes })
    else {
      onChange(post)
      setError(errorText(r.error))
    }
  }

  const send = async (text: string) => {
    setSending(true)
    setError('')
    const r = await createComment(post.id, text)
    setSending(false)
    if (!r.ok) {
      setError(errorText(r.error))
      return false
    }
    setComments((c) => ({ status: 'ok', list: [...c.list, r.comment] }))
    onChange({ ...post, comments: post.comments + 1 })
    return true
  }

  const remove = async () => {
    setDeleting(true)
    const r = await deletePost(post.id)
    setDeleting(false)
    if (r.ok || r.error === 'not-found') onDelete(post.id)
    else setError(errorText(r.error))
    setConfirming(false)
  }

  const team = post.kind === 'daily'
  return (
    <li className="list-none">
      <PostFrame
        id={post.id}
        author={team ? TEAM_AUTHOR : post.author}
        mine={post.mine}
        team={team}
        reflection={post.kind === 'reflection'}
        ago={minutesSince(post.createdAt, minute)}
        lessonKey={post.lessonKey}
        text={post.text}
        likes={post.likes}
        liked={post.liked}
        onLike={like}
        commentCount={post.comments}
        open={open}
        onToggle={toggle}
        menu={
          post.mine && !team ? (
            <button
              type="button"
              onClick={() => setConfirming((v) => !v)}
              aria-expanded={confirming}
              aria-label="Eliminar publicación"
              className="grid size-11 shrink-0 place-items-center rounded-full text-muted transition hover:bg-surface-hover"
            >
              <Icon name="trash" className="size-5" />
            </button>
          ) : undefined
        }
      >
        {comments.status === 'loading' && (
          <p className="text-[14.5px] text-muted" aria-busy="true">
            Cargando comentarios…
          </p>
        )}
        {comments.status === 'error' && (
          <p role="alert" className="text-[14.5px] text-muted">
            No pudimos cargar los comentarios.{' '}
            <button type="button" onClick={loadComments} className="font-semibold text-primary underline-offset-4 hover:underline">
              Reintentar
            </button>
          </p>
        )}
        {comments.status === 'ok' && comments.list.length === 0 && <p className="text-[14.5px] text-muted">Sé el primero en comentar.</p>}
        {comments.list.map((c) => (
          <CommentBubble key={c.id} author={c.author} text={c.text} ago={minutesSince(c.createdAt, minute)} mine={c.mine} />
        ))}
        <CommentForm id={post.id} busy={sending} onSend={send} />
      </PostFrame>
      {confirming && (
        <div role="alertdialog" aria-label="Confirmar eliminación" className="mt-2 flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-surface-2 px-4 py-3">
          <p className="min-w-0 flex-1 text-[15px] text-text">¿Eliminar esta publicación?</p>
          <button type="button" onClick={() => setConfirming(false)} className="inline-flex min-h-11 items-center rounded-full px-4 text-[15px] font-semibold text-muted hover:bg-surface-hover">
            Cancelar
          </button>
          <button type="button" onClick={remove} disabled={deleting} className="inline-flex min-h-11 items-center rounded-full bg-danger px-4 text-[15px] font-semibold text-white disabled:opacity-60">
            {deleting ? 'Eliminando…' : 'Eliminar'}
          </button>
        </div>
      )}
      {error && (
        <p role="alert" className="mt-2 px-2 text-[14.5px] text-danger">
          {error}
        </p>
      )}
    </li>
  )
}

/** An example post (or an old post that never left this device): amén and comments stay here. */
function LocalPostCard({
  item,
  liked,
  comments,
  minute,
}: {
  item: Extract<WallItem, { src: 'seed' }>
  liked: boolean
  comments: PostComment[]
  minute: number
}) {
  const [open, setOpen] = useState(false)
  const thread = [
    ...item.seedComments.map((c) => ({ key: `${c.author}-${c.ageMin}`, author: c.author, text: c.text, ago: c.ageMin, mine: false })),
    ...comments.map((c) => ({ key: c.id, author: c.author, text: c.text, ago: minute ? Math.max(0, minute - Math.floor(c.at / 60_000)) : 0, mine: true })),
  ]
  return (
    <li className="list-none">
      <PostFrame
        id={item.id}
        author={item.author}
        mine={item.mine}
        ago={item.ago}
        lessonKey={item.lessonKey}
        text={item.text}
        likes={item.baseLikes + (liked ? 1 : 0)}
        liked={liked}
        onLike={() => toggleLike(item.id)}
        commentCount={thread.length}
        open={open}
        onToggle={() => setOpen((v) => !v)}
      >
        {thread.map((c) => (
          <CommentBubble key={c.key} author={c.author} text={c.text} ago={c.ago} mine={c.mine} />
        ))}
        <CommentForm
          id={item.id}
          onSend={(text) => {
            addComment(item.id, text)
            return true
          }}
        />
      </PostFrame>
    </li>
  )
}

// ─── Constancia (ranking) ──────────────────────────────────────────

function Standing() {
  const s = useAppState()
  const today = useToday()
  const stats = useMemo(() => computeStats(s, today), [s, today])
  const [mode, setMode] = useState<RankMode>('semana')
  const name = s.session?.name ?? 'Tú'
  const board = useLeaderboard(mode, { name, weekPoints: stats.weekPoints, streak: stats.streak })
  const rows = board.rows
  const me = rows.find((r) => r.me)

  return (
    <>
      <Segmented
        label="Tipo de ranking"
        value={mode}
        onChange={setMode}
        options={[
          { value: 'semana', label: 'Puntos de la semana' },
          { value: 'racha', label: 'Racha' },
        ]}
      />
      {board.status === 'loading' ? (
        <div className="mt-4">
          <RankSkeleton count={6} />
        </div>
      ) : (
        <>
          {board.status === 'offline' && (
            <p role="status" className="mt-4 rounded-2xl border border-line bg-surface-2 px-4 py-3 text-[14.5px] leading-snug text-muted">
              Sin conexión: mostramos tu puesto con los datos de este dispositivo.
            </p>
          )}
          <ol className="mt-4 space-y-2">
            {rows.slice(0, 10).map((row) => (
              <RankItem key={`${row.name}-${row.rank}`} row={row} mode={mode} />
            ))}
          </ol>
          {me && me.rank > 10 && (
            <>
              <p className="py-2 text-center text-muted" aria-hidden>
                · · ·
              </p>
              <ol>
                <RankItem row={me} mode={mode} />
              </ol>
            </>
          )}
        </>
      )}

      <div className="mt-6 rounded-3xl border border-line bg-surface p-5">
        <p className="font-serif text-[18px] font-semibold text-ink">Cómo se suman puntos</p>
        <ul className="mt-3 space-y-2 text-[15.5px] text-text">
          <li className="flex justify-between gap-3"><span>Lección leída</span><strong className="text-ink">+{POINTS.lesson}</strong></li>
          <li className="flex justify-between gap-3"><span>Reflexión escrita</span><strong className="text-ink">+{POINTS.reflection}</strong></li>
          <li className="flex justify-between gap-3"><span>Publicación en el muro</span><strong className="text-ink">+{POINTS.post}</strong></li>
        </ul>
        <p className="mt-4 text-[14.5px] leading-relaxed text-muted">
          La racha cuenta los días seguidos en que lees al menos un resumen. El ranking de la semana vuelve a cero cada lunes, para que cualquiera pueda llegar arriba.
        </p>
      </div>
    </>
  )
}
