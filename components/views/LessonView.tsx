'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { AudioPlayer } from '../AudioPlayer'
import { EstudioLesson } from './EstudioLesson'
import { GuiaLesson } from './GuiaLesson'
import { MindMapView } from './MindMapView'
import { NinosStory } from '../ninos/NinosStory'
import { ReadingDay } from './ReadingDay'
import { AudioPromo, LockedProduct } from '../cards'
import { ListeningDay } from '../ListeningDay'
import { EscuchaGuide, escuchaId } from '../EscuchaGuide'
import { Icon, type IconName } from '../icons'
import { PageHeader } from '../PageHeader'
import { Avatar, FontScaleControl, buttonClass } from '../ui'
import type { Lesson, LessonContent, Product, Section } from '@/lib/catalog'
import { loadPlanDay } from '@/lib/content/plans/load'
import { trackFor } from '@/lib/player'
import { minutesSince, type CommunityPost } from '@/lib/community'
import { fetchLessonItems, shareReflection } from '@/lib/community-client'
import { SEED_POSTS, SEED_REFLECTIONS } from '@/lib/community-seed'
import { POINTS } from '@/lib/config'
import { computeStats } from '@/lib/gamification'
import { findLesson, isOwned, lessonHref, lessonKey, planDayStatus, type LessonRef } from '@/lib/progress'
import {
  completeLesson,
  saveReflection,
  setLastLesson,
  uncompleteLesson,
  useAppState,
  useNowMinute,
  useToday,
  type AppState,
  type Reflection,
  type UserPost,
} from '@/lib/store'
import { plural, timeAgo } from '@/lib/text'

export function LessonView({ productId, lessonId }: { productId: string; lessonId: string }) {
  const s = useAppState()
  const ref = findLesson(productId, lessonId)
  if (!ref) return null
  if (!isOwned(ref.product, s.owned)) return <LockedProduct product={ref.product} />
  // Keyed per lesson so drafts and the "just completed" moment never leak between lessons.
  return <LessonReader key={`${productId}/${lessonId}`} lessonRef={ref} state={s} />
}

function LessonReader({ lessonRef, state: s }: { lessonRef: LessonRef; state: AppState }) {
  const { product, section, lesson, index, total } = lessonRef
  // Previous/next stay on the same track: never from the audios into a plan's Day 1, or
  // from the end of one plan into another.
  const sameTrack = (l: Lesson | null): Lesson | null => {
    const r = l ? findLesson(product.id, l.id) : null
    return r && (r.section === section || (!r.section.plan && !section.plan && r.section.tab === section.tab)) ? r.lesson : null
  }
  const prev = sameTrack(lessonRef.prev)
  const next = sameTrack(lessonRef.next)
  const key = lessonKey(product.id, lesson.id)
  const today = useToday()
  const stats = useMemo(() => computeStats(s, today), [s, today])
  const done = Boolean(s.completed[key])
  const [celebrate, setCelebrate] = useState(false)
  // Bumped when the member's reflection reaches the server, so the hermanos' list reloads.
  const [reflectionsVersion, setReflectionsVersion] = useState(0)
  // Plan days open one at a time; a day not open yet shows when it opens instead.
  const status = planDayStatus(product.id, section, lesson.id, s.completed, today)
  const waiting = status === 'locked' || status === 'tomorrow'
  const dayN = section.lessons.findIndex((l) => l.id === lesson.id) + 1
  const nextStatus = next ? planDayStatus(product.id, section, next.id, s.completed, today) : null
  const nextInPlan = Boolean(section.plan && next && section.lessons.some((l) => l.id === next.id))
  const track = lesson.format === 'audio' ? trackFor(product, lesson) : null

  useEffect(() => {
    if (!waiting) setLastLesson(key)
  }, [key, waiting])

  if (waiting) {
    return (
      <>
        <PageHeader back={`/modulo/${product.id}`} eyebrow={`${section.tab ?? section.title} · ${lesson.title}`} title={lesson.subtitle ?? lesson.title} />
        <div className="rounded-3xl border border-line bg-surface p-6 text-center shadow-card">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-gold-soft text-gold">
            <Icon name={status === 'tomorrow' ? 'calendar' : 'lock'} className="size-7" />
          </span>
          <p className="mt-4 font-serif text-[21px] font-semibold text-ink">
            {status === 'tomorrow' ? `El Día ${dayN} se abre mañana` : `Primero, el Día ${dayN - 1}`}
          </p>
          <p className="mx-auto mt-2 max-w-xs text-[15.5px] leading-relaxed text-muted">
            {status === 'tomorrow'
              ? 'Ya hiciste el paso de hoy. Un día a la vez: vuelve mañana para seguir.'
              : `Este plan se hace un día a la vez. Completa el Día ${dayN - 1} para avanzar.`}
          </p>
          <Link href={`/modulo/${product.id}`} className={`${buttonClass.secondary} mt-5`}>
            Volver al plan
          </Link>
        </div>
      </>
    )
  }

  const toggle = () => {
    if (done) {
      uncompleteLesson(key)
      setCelebrate(false)
    } else {
      completeLesson(key)
      setCelebrate(true)
    }
  }

  return (
    <>
      <PageHeader
        back={`/modulo/${product.id}`}
        eyebrow={section.plan ? `${section.tab ?? section.title} · ${lesson.title}` : section.title}
        title={lesson.subtitle ?? lesson.title}
      />

      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="text-[14.5px] leading-snug text-muted">
          {section.plan ? section.title : lesson.rotulo ?? product.title}
          <br />
          {section.plan ? `Día ${dayN} de ${section.lessons.length}` : lesson.lectura ? `Día ${lesson.lectura.dia} de ${total}` : tabPosition(product, section, lesson.id) ?? `Lección ${index + 1} de ${total}`}
        </p>
        <FontScaleControl scale={s.fontScale} />
      </div>

      {track && (
        <div className="mb-5">
          <AudioPlayer track={track} cover={product.cover} />
          {escuchaId(product.id, lesson) && <EscuchaGuide id={escuchaId(product.id, lesson) ?? ''} />}
          {product.id === 'plan-escucha' && <AudioPromo owned={s.owned} />}
        </div>
      )}

      {lesson.escucha ? (
        <ListeningDay product={product} ids={lesson.escucha} repaso={Boolean(lesson.subtitle?.startsWith('Repaso'))} dayKey={key} />
      ) : lesson.lectura ? (
        <ReadingDay dia={lesson.lectura} />
      ) : lesson.ninos ? (
        <NinosStory id={lesson.id} scale={s.fontScale} onPlayed={() => completeLesson(key)} />
      ) : lesson.mapa ? (
        <MindMapView mapId={lesson.id} scale={s.fontScale} />
      ) : lesson.guia ? (
        <GuiaLesson guia={lesson.guia} lessonId={lesson.id} scale={s.fontScale} />
      ) : lesson.estudio ? (
        <EstudioLesson lessonId={lesson.id} scale={s.fontScale} />
      ) : (
        // An audio lesson is the audio; its text shows only when there is one.
        (lesson.format !== 'audio' || lesson.content) && <LessonBody lesson={lesson} scale={s.fontScale} />
      )}

      <CompletionCard
        done={done}
        celebrate={celebrate}
        streak={stats.streak}
        onToggle={toggle}
        isPlanDay={Boolean(section.plan)}
        next={
          next && !(nextInPlan && nextStatus !== 'open' && nextStatus !== 'done')
            ? { href: lessonHref(product.id, next.id), title: next.title }
            : null
        }
        opensTomorrow={nextInPlan && nextStatus === 'tomorrow' ? next?.title ?? null : null}
      />

      {!lesson.ninos && (
        <>
          <ReflectionBox lessonKey={key} existing={s.reflections[key]} onSynced={() => setReflectionsVersion((n) => n + 1)} />
          <SharedReflections lessonKey={key} mine={s.reflections[key]} myPosts={s.posts} myName={s.session?.name ?? 'Tú'} version={reflectionsVersion} />
        </>
      )}

      <nav aria-label="Otras lecciones" className="mt-10 grid grid-cols-2 gap-3">
        {prev ? (
          <Link href={lessonHref(product.id, prev.id)} className="rounded-2xl border border-line bg-surface p-3.5 transition hover:bg-surface-hover">
            <span className="flex items-center gap-1 text-[13.5px] text-muted">
              <Icon name="arrowLeft" className="size-4" />
              Anterior
            </span>
            <span className="mt-1 line-clamp-2 block font-serif text-[15.5px] leading-snug text-ink">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={lessonHref(product.id, next.id)} className="rounded-2xl border border-line bg-surface p-3.5 text-right transition hover:bg-surface-hover">
            <span className="flex items-center justify-end gap-1 text-[13.5px] text-muted">
              Siguiente
              <Icon name="arrowRight" className="size-4" />
            </span>
            <span className="mt-1 line-clamp-2 block font-serif text-[15.5px] leading-snug text-ink">{next.title}</span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </>
  )
}

function Fact({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-surface text-gold">
        <Icon name={icon} className="size-[18px]" />
      </span>
      <div className="min-w-0">
        <p className="text-[0.78em] font-semibold uppercase tracking-[0.07em] text-muted">{label}</p>
        <p className="mt-0.5 leading-snug text-ink">{value}</p>
      </div>
    </div>
  )
}

/** A task written as "Intro: 1) … 2) … 3) …" shows its steps as a numbered list. */
function TaskText({ text }: { text: string }) {
  const parts = text.split(/\s(?=\d\)\s)/)
  if (parts.length < 3) return <p className="mt-1.5 font-serif text-[1.05em] leading-relaxed">{text}</p>
  const [intro, ...steps] = parts
  return (
    <div className="mt-1.5 font-serif text-[1.05em] leading-relaxed">
      <p>{intro}</p>
      <ol className="mt-2 space-y-1.5">
        {steps.map((step, i) => (
          <li key={step} className="flex gap-2.5">
            <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-gold-bright font-sans text-[0.75em] font-bold text-primary">{i + 1}</span>
            <span>{step.replace(/^\d\)\s*/, '').replace(/;\s*$/, '')}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

/** The lesson's text: inline in the catalog, or — for plan days — fetched when opened. */
function useLessonContent(lesson: Lesson): { content?: LessonContent; loading: boolean } {
  const planId = lesson.plan?.id
  const planDay = lesson.plan?.day ?? 0
  const key = planId ? `${planId}/${planDay}` : ''
  const [loaded, setLoaded] = useState<{ key: string; content: LessonContent | null } | null>(null)

  useEffect(() => {
    if (!planId) return
    let alive = true
    loadPlanDay(planId, planDay)
      .then((content) => alive && setLoaded({ key: `${planId}/${planDay}`, content }))
      .catch(() => alive && setLoaded({ key: `${planId}/${planDay}`, content: null }))
    return () => {
      alive = false
    }
  }, [planId, planDay])

  if (!planId) return { content: lesson.content, loading: false }
  if (loaded?.key !== key) return { loading: true }
  return { content: loaded.content ?? undefined, loading: false }
}

function LessonBody({ lesson, scale }: { lesson: Lesson; scale: number }) {
  const { content: c, loading } = useLessonContent(lesson)
  if (loading) {
    return (
      <div aria-busy className="animate-pulse space-y-3 rounded-3xl border border-line bg-surface-2 px-5 py-6">
        <div className="h-16 rounded-2xl bg-gold-soft/50" />
        <div className="h-4 rounded bg-line-soft" />
        <div className="h-4 w-11/12 rounded bg-line-soft" />
        <div className="h-4 w-4/5 rounded bg-line-soft" />
      </div>
    )
  }
  if (!c) {
    return (
      <div className="rounded-3xl border border-dashed border-line bg-surface-2 px-6 py-8 text-center">
        <Icon name="feather" className="mx-auto size-8 text-gold" />
        <p className="mt-3 font-serif text-[19px] font-semibold text-ink">Contenido en preparación</p>
        <p className="mx-auto mt-1.5 max-w-xs text-[15.5px] leading-relaxed text-muted">Muy pronto encontrarás aquí esta lección.</p>
      </div>
    )
  }
  return (
    <article className="rounded-3xl border border-line bg-surface-2 px-5 py-6 shadow-card" style={{ fontSize: `${scale}rem` }}>
      {(c.fecha || c.autor || c.periodo) && (
        <div className="grid gap-3.5 border-b border-line-soft pb-5 text-[0.98em]">
          {c.fecha && <Fact icon="calendar" label="Fecha aproximada" value={c.fecha} />}
          {c.autor && <Fact icon="feather" label="Autor" value={c.autor} />}
          {c.periodo && <Fact icon="users" label="Período y personajes" value={c.periodo} />}
        </div>
      )}
      {c.versiculo && (
        <figure className="my-6 rounded-2xl bg-gold-soft/50 px-5 py-4">
          <blockquote className="font-serif text-[1.18em] italic leading-relaxed text-ink">«{c.versiculo.texto.trim().replace(/[;:,]$/, '')}»</blockquote>
          <figcaption className="mt-2 text-[0.85em] font-semibold text-gold">{c.versiculo.referencia}</figcaption>
        </figure>
      )}
      {c.resumen && (
        <div className="space-y-4 font-serif text-[1.08em] leading-[1.75] text-text">
          {c.resumen.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
      )}
      {c.tarea && (
        <div className="mt-6 rounded-2xl bg-primary px-5 py-4 text-white">
          <p className="text-[0.8em] font-semibold uppercase tracking-[0.08em] text-gold-bright">Minitarea de hoy</p>
          <TaskText text={c.tarea} />
        </div>
      )}
      {c.practica && c.practica.length > 0 && (
        <div className="mt-4 rounded-2xl border border-line-soft bg-surface p-4">
          <p className="text-[0.8em] font-semibold uppercase tracking-[0.08em] text-gold">Para poner en práctica</p>
          <ol className="mt-2 space-y-2">
            {c.practica.map((step, i) => (
              <li key={step} className="flex gap-3 leading-relaxed text-ink">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-gold-soft text-[0.8em] font-bold text-ink">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}
      {c.meditar && (
        <div className="mt-6 rounded-2xl border border-line-soft bg-surface p-4">
          <p className="text-[0.8em] font-semibold uppercase tracking-[0.08em] text-gold">Para meditar</p>
          <p className="mt-1.5 font-serif text-[1.05em] leading-relaxed text-ink">{c.meditar}</p>
        </div>
      )}
    </article>
  )
}

function CompletionCard({
  done,
  celebrate,
  streak,
  onToggle,
  next,
  isPlanDay,
  opensTomorrow,
}: {
  done: boolean
  celebrate: boolean
  streak: number
  onToggle: () => void
  next: { href: string; title: string } | null
  isPlanDay: boolean
  /** Title of the next plan day when it only opens tomorrow. */
  opensTomorrow: string | null
}) {
  if (!done) {
    return (
      <div className="mt-6">
        <button type="button" onClick={onToggle} className={buttonClass.primary}>
          <Icon name="check" className="size-5" strokeWidth={2.6} />
          {isPlanDay ? 'Completar el día' : 'Marcar como leída'}
          <span className="rounded-full bg-white/15 px-2 py-0.5 text-[13px] font-semibold">+{POINTS.lesson} pts</span>
        </button>
        <p className="mt-2 text-center text-[14px] text-muted">Suma puntos y mantiene tu racha.</p>
      </div>
    )
  }
  return (
    <div role="status" className={`mt-6 rounded-3xl border border-success/25 bg-success-soft p-5 ${celebrate ? 'animate-rise' : ''}`}>
      <div className="flex items-center gap-3.5">
        <span className={`grid size-12 shrink-0 place-items-center rounded-full bg-success text-white ${celebrate ? 'animate-pop' : ''}`}>
          <Icon name="check" className="size-6" strokeWidth={2.8} />
        </span>
        <div>
          <p className="font-serif text-[19px] font-semibold text-ink">{isPlanDay ? 'Día completado' : 'Lección completada'}</p>
          <p className="text-[15px] text-text">
            {streak > 0 ? (
              <>
                Racha de <strong>{plural(streak, 'día', 'días')}</strong>
              </>
            ) : (
              '¡Bien hecho!'
            )}
            {celebrate && ` · +${POINTS.lesson} puntos`}
          </p>
        </div>
      </div>
      {next && (
        <Link href={next.href} className={`${buttonClass.primary} mt-4`}>
          Siguiente: {next.title}
          <Icon name="arrowRight" className="size-5 shrink-0 text-gold-bright" />
        </Link>
      )}
      {opensTomorrow && (
        <p className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-surface-2 p-3 text-center text-[15px] text-ink">
          <Icon name="calendar" className="size-5 shrink-0 text-gold" />
          El {opensTomorrow} se abre mañana. ¡Te esperamos!
        </p>
      )}
      <button type="button" onClick={onToggle} className="mt-3 w-full py-1 text-center text-[14px] font-medium text-muted underline underline-offset-4 hover:text-ink">
        {isPlanDay ? 'Desmarcar día' : 'Desmarcar lección'}
      </button>
    </div>
  )
}

/**
 * In a product whose tab holds several sections (the Palabras del Señor guide), the
 * position counts that tab only — "Situación 97 de 106", not the 376 of guide + plans.
 */
function tabPosition(product: Product, section: Section, lessonId: string): string | null {
  if (!section.tab) return null
  const group = product.sections.filter((sec) => sec.tab === section.tab).flatMap((sec) => sec.lessons)
  if (group.length < 2) return null
  const n = group.findIndex((l) => l.id === lessonId) + 1
  return `${product.id === 'hacedores' ? 'Situación' : product.id === 'cronologico-audio' ? 'Audio' : 'Lección'} ${n} de ${group.length}`
}

/** Guides about personal struggles: reflections stay private unless the member chooses to share. */
const PRIVATE_BY_DEFAULT = new Set(['hacedores', 'caminando-gigantes'])

/** Reflections saved before the Comunidad was real never reached the server: sent once when seen. */
const SHARED_BEFORE_REAL_COMMUNITY = Date.UTC(2026, 9, 1)

function ReflectionBox({ lessonKey: key, existing, onSynced }: { lessonKey: string; existing?: Reflection; onSynced: () => void }) {
  const [text, setText] = useState(existing?.text ?? '')
  const [shared, setShared] = useState(existing?.shared ?? !PRIVATE_BY_DEFAULT.has(key.split('/')[0]))
  const [sync, setSync] = useState<'idle' | 'saving' | 'ok' | 'error'>('idle')
  const [savedAs, setSavedAs] = useState<{ shared: boolean; removed: boolean }>({ shared: false, removed: false })
  const dirty = text.trim() !== (existing?.text ?? '') || shared !== (existing?.shared ?? true)

  // The server copy is what the hermanos see: shared → published there, otherwise removed.
  const publish = async (clean: string, share: boolean) => {
    setSync('saving')
    setSavedAs({ shared: share && Boolean(clean), removed: !clean })
    const r = await shareReflection(key, clean, share && Boolean(clean))
    setSync(r.ok ? 'ok' : 'error')
    if (r.ok) onSynced()
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const clean = text.trim()
    saveReflection(key, clean, shared)
    void publish(clean, shared)
  }

  const clean = text.trim()
  return (
    <section className="mt-10" aria-labelledby="reflexion-titulo">
      <h2 id="reflexion-titulo" className="font-serif text-[22px] font-semibold text-ink">
        Tu reflexión
      </h2>
      <p className="mt-1 text-[15.5px] leading-snug text-muted">¿Qué entendiste de esta lección? ¿Qué te habló al corazón?</p>
      <form onSubmit={submit} className="mt-3.5 rounded-3xl border border-line bg-surface p-4">
        <label htmlFor="reflexion" className="sr-only">
          Tu reflexión
        </label>
        <textarea
          id="reflexion"
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            setSync('idle')
          }}
          rows={4}
          maxLength={1200}
          placeholder="Escribe con tus palabras…"
          className="w-full resize-y rounded-2xl border border-line bg-surface-2 px-4 py-3 text-[16px] leading-relaxed text-ink placeholder:text-muted focus:border-primary focus:outline-none"
        />
        <label className="mt-3 flex min-h-11 items-center gap-3 text-[15.5px] text-text">
          <input
            type="checkbox"
            checked={shared}
            onChange={(e) => {
              setShared(e.target.checked)
              setSync('idle')
            }}
            className="size-5 accent-primary"
          />
          Compartir con los hermanos
        </label>
        <button type="submit" disabled={!dirty || (!clean && !existing) || sync === 'saving'} className={`${buttonClass.secondary} mt-2`}>
          {existing && !clean ? 'Borrar reflexión' : existing ? 'Actualizar reflexión' : 'Guardar reflexión'}
          {!existing && <span className="text-[13px] font-semibold text-gold">+{POINTS.reflection} pts</span>}
        </button>
        {sync === 'saving' && (
          <p role="status" className="mt-2.5 text-center text-[14.5px] font-medium text-muted">
            Guardando…
          </p>
        )}
        {sync === 'ok' && !dirty && (
          <p role="status" className="mt-2.5 text-center text-[14.5px] font-medium text-success">
            {savedAs.removed ? 'Reflexión borrada.' : savedAs.shared ? 'Guardada y compartida con los hermanos.' : 'Guardada solo para ti.'}
          </p>
        )}
        {sync === 'error' && !dirty && (
          <p role="alert" className="mt-2.5 text-center text-[14.5px] leading-snug text-danger">
            {savedAs.shared ? 'Guardada en tu dispositivo, pero no pudimos compartirla ahora.' : 'Guardada en tu dispositivo, pero no pudimos actualizar la Comunidad.'}{' '}
            <button type="button" onClick={() => void publish(clean, shared)} className="font-semibold text-primary underline underline-offset-4">
              Intentar de nuevo
            </button>
          </p>
        )}
      </form>
    </section>
  )
}

interface HermanoItem {
  key: string
  author: string
  text: string
  ago: number
  me: boolean
}

// Shared reflections and wall posts about this lesson, in one conversation: a post
// tagged "Génesis" on the Comunidad wall shows up here too, so the lesson and the
// community feed each other instead of living in separate tabs. The real ones come from
// the server; the example ones show while the Comunidad is small.
function SharedReflections({
  lessonKey: key,
  mine,
  myPosts,
  myName,
  version,
}: {
  lessonKey: string
  mine?: Reflection
  myPosts: UserPost[]
  myName: string
  version: number
}) {
  const minute = useNowMinute()
  const [remote, setRemote] = useState<{ status: 'loading' | 'ok' | 'error'; items: CommunityPost[]; seeds: boolean }>({ status: 'loading', items: [], seeds: true })
  const [attempt, setAttempt] = useState(0)
  const mineRef = useRef(mine)
  useEffect(() => {
    mineRef.current = mine
  }, [mine])

  useEffect(() => {
    let alive = true
    void (async () => {
      let r = await fetchLessonItems(key)
      const m = mineRef.current
      // A reflection shared before the Comunidad was real: publish it now, once.
      if (r.ok && m?.shared && m.text && m.at < SHARED_BEFORE_REAL_COMMUNITY && !r.items.some((i) => i.mine && i.kind === 'reflection')) {
        const sent = await shareReflection(key, m.text, true)
        if (sent.ok) r = await fetchLessonItems(key)
      }
      if (!alive) return
      setRemote(r.ok ? { status: 'ok', items: r.items, seeds: r.seeds } : { status: 'error', items: [], seeds: true })
    })()
    return () => {
      alive = false
    }
  }, [key, version, attempt])

  const ago = (at: number) => (minute ? Math.max(0, minute - Math.floor(at / 60_000)) : 0)
  const serverHasMine = remote.items.some((i) => i.mine && i.kind === 'reflection')
  const showSeeds = remote.status !== 'ok' || remote.seeds
  const items: HermanoItem[] = [
    ...remote.items.map((p) => ({ key: p.id, author: p.author, text: p.text, ago: minutesSince(p.createdAt, minute), me: p.mine })),
    // Not on the server yet (offline, or still sending): the member still sees their own.
    ...(mine?.shared && !serverHasMine && remote.status !== 'loading' ? [{ key: 'mine', author: myName, text: mine.text, ago: ago(mine.at), me: true }] : []),
    ...myPosts
      .filter((p) => p.lessonKey === key && p.id.startsWith('post_'))
      .map((p) => ({ key: p.id, author: myName, text: p.text, ago: ago(p.at), me: true })),
    ...(showSeeds
      ? [
          ...(SEED_REFLECTIONS[key] ?? []).map((r) => ({ key: `seed-${r.author}-${r.ageMin}`, author: r.author, text: r.text, ago: r.ageMin, me: false })),
          ...SEED_POSTS.filter((p) => p.lessonKey === key).map((p) => ({ key: p.id, author: p.author, text: p.text, ago: p.ageMin, me: false })),
        ]
      : []),
  ].sort((a, b) => a.ago - b.ago)

  return (
    <section className="mt-10" aria-labelledby="hermanos-titulo" aria-busy={remote.status === 'loading'}>
      <h2 id="hermanos-titulo" className="font-serif text-[22px] font-semibold text-ink">
        Lo que entendieron los hermanos
      </h2>
      {remote.status === 'error' && (
        <p role="alert" className="mt-3 text-[14.5px] leading-snug text-muted">
          No pudimos cargar las reflexiones de los hermanos.{' '}
          <button
            type="button"
            onClick={() => {
              setRemote((r) => ({ ...r, status: 'loading' }))
              setAttempt((n) => n + 1)
            }}
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Reintentar
          </button>
        </p>
      )}
      {remote.status === 'loading' && items.length === 0 ? (
        <div className="mt-3.5 animate-pulse rounded-2xl border border-line bg-surface p-4">
          <div className="flex items-center gap-3">
            <span className="size-9 rounded-full bg-line-soft" />
            <span className="h-3.5 w-28 rounded-full bg-line-soft" />
          </div>
          <span className="mt-3 block h-3.5 w-full rounded-full bg-line-soft" />
        </div>
      ) : items.length === 0 ? (
        <p className="mt-3 rounded-2xl border border-dashed border-line px-5 py-6 text-center text-[15.5px] leading-relaxed text-muted">
          Todavía nadie compartió una reflexión aquí. Sé el primero.
        </p>
      ) : (
        <ul className="mt-3.5 space-y-3">
          {items.map((r) => (
            <li key={r.key} className="rounded-2xl border border-line bg-surface p-4">
              <div className="flex items-center gap-3">
                <Avatar name={r.author} size="sm" primary={r.me} />
                <div className="min-w-0">
                  <p className="text-[15.5px] font-semibold text-ink">
                    {r.author}
                    {r.me && <span className="font-normal text-muted"> · tú</span>}
                  </p>
                  <p className="text-[13.5px] text-muted">{timeAgo(r.ago)}</p>
                </div>
              </div>
              <p className="mt-2.5 whitespace-pre-line break-words font-serif text-[16.5px] leading-relaxed text-text">{r.text}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
