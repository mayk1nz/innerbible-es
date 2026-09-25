'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { AudioPlayer } from '../AudioPlayer'
import { LockedProduct } from '../cards'
import { Icon, type IconName } from '../icons'
import { PageHeader } from '../PageHeader'
import { Avatar, FontScaleControl, buttonClass } from '../ui'
import type { Lesson } from '@/lib/catalog'
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
  if (!isOwned(ref.product, s.owned)) return <LockedProduct product={ref.product} email={s.session?.email} />
  // Keyed per lesson so drafts and the "just completed" moment never leak between lessons.
  return <LessonReader key={`${productId}/${lessonId}`} lessonRef={ref} state={s} />
}

function LessonReader({ lessonRef, state: s }: { lessonRef: LessonRef; state: AppState }) {
  const { product, section, lesson, index, total, prev, next } = lessonRef
  const key = lessonKey(product.id, lesson.id)
  const today = useToday()
  const stats = useMemo(() => computeStats(s, today), [s, today])
  const done = Boolean(s.completed[key])
  const [celebrate, setCelebrate] = useState(false)
  // Plan days open one at a time; a day not open yet shows when it opens instead.
  const status = planDayStatus(product.id, section, lesson.id, s.completed, today)
  const waiting = status === 'locked' || status === 'tomorrow'
  const dayN = section.lessons.findIndex((l) => l.id === lesson.id) + 1
  const nextStatus = next ? planDayStatus(product.id, section, next.id, s.completed, today) : null
  const nextInPlan = Boolean(section.plan && next && section.lessons.some((l) => l.id === next.id))

  useEffect(() => {
    if (!waiting) setLastLesson(key)
  }, [key, waiting])

  if (waiting) {
    return (
      <>
        <PageHeader back={`/modulo/${product.id}`} eyebrow={section.tab ?? section.title} title={lesson.title} />
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
      <PageHeader back={`/modulo/${product.id}`} eyebrow={section.title} title={lesson.title} />

      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="text-[14.5px] leading-snug text-muted">
          {section.plan ? section.title : product.title}
          <br />
          {section.plan ? `Día ${dayN} de ${section.lessons.length}` : `Lección ${index + 1} de ${total}`}
        </p>
        <FontScaleControl scale={s.fontScale} />
      </div>

      {lesson.format === 'audio' && (
        <div className="mb-5">
          <AudioPlayer
            src={lesson.audioSrc}
            positionKey={key}
            onEnded={() => {
              if (!done) {
                completeLesson(key)
                setCelebrate(true)
              }
            }}
          />
        </div>
      )}

      <LessonBody lesson={lesson} scale={s.fontScale} />

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

      <ReflectionBox lessonKey={key} existing={s.reflections[key]} />
      <SharedReflections lessonKey={key} mine={s.reflections[key]} myPosts={s.posts} myName={s.session?.name ?? 'Tú'} />

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

function LessonBody({ lesson, scale }: { lesson: Lesson; scale: number }) {
  const c = lesson.content
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
          <blockquote className="font-serif text-[1.18em] italic leading-relaxed text-ink">«{c.versiculo.texto}»</blockquote>
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
          <p className="mt-1.5 font-serif text-[1.05em] leading-relaxed">{c.tarea}</p>
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

function ReflectionBox({ lessonKey: key, existing }: { lessonKey: string; existing?: Reflection }) {
  const [text, setText] = useState(existing?.text ?? '')
  const [shared, setShared] = useState(existing?.shared ?? true)
  const [saved, setSaved] = useState(false)
  const dirty = text.trim() !== (existing?.text ?? '') || shared !== (existing?.shared ?? true)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    saveReflection(key, text, shared)
    setSaved(true)
  }

  return (
    <section className="mt-10" aria-labelledby="reflexion-titulo">
      <h2 id="reflexion-titulo" className="font-serif text-[22px] font-semibold text-ink">
        Tu reflexión
      </h2>
      <p className="mt-1 text-[15.5px] leading-snug text-muted">¿Qué entendiste de este resumen? ¿Qué te habló al corazón?</p>
      <form onSubmit={submit} className="mt-3.5 rounded-3xl border border-line bg-surface p-4">
        <label htmlFor="reflexion" className="sr-only">
          Tu reflexión
        </label>
        <textarea
          id="reflexion"
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            setSaved(false)
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
              setSaved(false)
            }}
            className="size-5 accent-primary"
          />
          Compartir con los hermanos
        </label>
        <button type="submit" disabled={!dirty || !text.trim()} className={`${buttonClass.secondary} mt-2`}>
          {existing ? 'Actualizar reflexión' : 'Guardar reflexión'}
          {!existing && <span className="text-[13px] font-semibold text-gold">+{POINTS.reflection} pts</span>}
        </button>
        {saved && !dirty && (
          <p role="status" className="mt-2.5 text-center text-[14.5px] font-medium text-success">
            {shared ? 'Guardada y compartida con los hermanos.' : 'Guardada solo para ti.'}
          </p>
        )}
      </form>
    </section>
  )
}

// Shared reflections and wall posts about this lesson, in one conversation: a post
// tagged "Génesis" on the Comunidad wall shows up here too, so the lesson and the
// community feed each other instead of living in separate tabs.
function SharedReflections({
  lessonKey: key,
  mine,
  myPosts,
  myName,
}: {
  lessonKey: string
  mine?: Reflection
  myPosts: UserPost[]
  myName: string
}) {
  const minute = useNowMinute()
  const ago = (at: number) => (minute ? Math.max(0, minute - Math.floor(at / 60_000)) : 0)
  const items = [
    ...(mine?.shared ? [{ author: myName, text: mine.text, ago: ago(mine.at), me: true }] : []),
    ...myPosts.filter((p) => p.lessonKey === key).map((p) => ({ author: myName, text: p.text, ago: ago(p.at), me: true })),
    ...(SEED_REFLECTIONS[key] ?? []).map((r) => ({ author: r.author, text: r.text, ago: r.ageMin, me: false })),
    ...SEED_POSTS.filter((p) => p.lessonKey === key).map((p) => ({ author: p.author, text: p.text, ago: p.ageMin, me: false })),
  ].sort((a, b) => a.ago - b.ago)

  return (
    <section className="mt-10" aria-labelledby="hermanos-titulo">
      <h2 id="hermanos-titulo" className="font-serif text-[22px] font-semibold text-ink">
        Lo que entendieron los hermanos
      </h2>
      {items.length === 0 ? (
        <p className="mt-3 rounded-2xl border border-dashed border-line px-5 py-6 text-center text-[15.5px] leading-relaxed text-muted">
          Todavía nadie compartió una reflexión aquí. Sé el primero.
        </p>
      ) : (
        <ul className="mt-3.5 space-y-3">
          {items.map((r) => (
            <li key={`${r.author}-${r.ago}-${r.text.slice(0, 24)}`} className="rounded-2xl border border-line bg-surface p-4">
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
              <p className="mt-2.5 font-serif text-[16.5px] leading-relaxed text-text">{r.text}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
