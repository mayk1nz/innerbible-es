'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { AudioPromo, LockedProduct } from '../cards'
import { Cover } from '../Cover'
import { Icon } from '../icons'
import { PageHeader } from '../PageHeader'
import { EmptyState, ProgressBar, SearchInput, buttonClass } from '../ui'
import { productById, type Lesson, type Product, type Section } from '@/lib/catalog'
import { allLessons, currentPlanDay, isOwned, lessonHref, lessonKey, nextLesson, planDayStatus, productProgress } from '@/lib/progress'
import { toggleLesson, useAppState, useToday, type AppState } from '@/lib/store'
import { normalize, plural } from '@/lib/text'

export function ModuleView({ productId }: { productId: string }) {
  const s = useAppState()
  const product = productById(productId)
  if (!product) return null
  if (!isOwned(product, s.owned)) return <LockedProduct product={product} />
  if (product.kind === 'enlace') return <LinkProduct product={product} />
  if (product.kind === 'herramienta') return <ToolProduct product={product} />
  if (product.tabs) return <TabbedModule product={product} completed={s.completed} lastLesson={s.lastLesson} />
  return (
    <>
      <ModuleContent product={product} completed={s.completed} />
      {product.id === 'plan-escucha' && <AudioPromo owned={s.owned} />}
    </>
  )
}

// ─── Products with tabs (Palabras del Señor: the guide + its 90-day plans) ────

/** Sections that share a `tab` label form one tab (the guide's parts); the others, one each. */
function tabGroups(sections: Section[]): { id: string; label: string; sections: Section[] }[] {
  const groups: { id: string; label: string; sections: Section[] }[] = []
  for (const sec of sections) {
    const label = sec.tab ?? sec.title
    const group = groups.find((g) => g.label === label)
    if (group) group.sections.push(sec)
    else groups.push({ id: sec.id, label, sections: [sec] })
  }
  return groups
}

function TabbedModule({ product, completed, lastLesson }: { product: Product; completed: AppState['completed']; lastLesson: string | null }) {
  const groups = useMemo(() => tabGroups(product.sections), [product])
  // Open on the tab of the lesson read last, if it belongs to this product.
  const [tab, setTab] = useState(() => {
    const lastId = lastLesson?.startsWith(`${product.id}/`) ? lastLesson.slice(product.id.length + 1) : null
    return groups.find((g) => g.sections.some((sec) => sec.lessons.some((l) => l.id === lastId)))?.id ?? groups[0]?.id
  })
  const group = groups.find((g) => g.id === tab) ?? groups[0]
  if (!group) return null
  const section = group.sections[0]

  return (
    <>
      <PageHeader back="/leer" title={product.title} />
      {/* A grid, not a sideways-scrolling row: every section stays visible (with a mouse
          there is no way to tell that a row scrolls). */}
      <div role="tablist" aria-label={`Secciones de ${product.title}`} className="grid grid-cols-2 gap-2">
        {groups.map((g) => {
          const active = g.id === group.id
          const first = g.sections[0]
          const count = g.sections.reduce((a, sec) => a + sec.lessons.length, 0)
          return (
            <button
              key={g.id}
              type="button"
              role="tab"
              id={`tab-${g.id}`}
              aria-selected={active}
              aria-controls={`panel-${g.id}`}
              onClick={() => setTab(g.id)}
              className={`flex min-h-14 flex-col items-center justify-center rounded-2xl border px-3 py-2 text-center transition ${
                active ? 'border-primary bg-primary text-white shadow-card' : 'border-line bg-surface text-ink hover:bg-surface-hover'
              }`}
            >
              <span className="text-[15px] font-semibold leading-tight">{g.label}</span>
              <span className={`mt-0.5 text-[12.5px] ${active ? 'text-white/75' : 'text-muted'}`}>
                {first.plan ? `Plan de ${first.lessons.length} días` : count > 1 ? `${count} situaciones` : 'La guía'}
              </span>
            </button>
          )
        })}
      </div>
      <div role="tabpanel" id={`panel-${group.id}`} aria-labelledby={`tab-${group.id}`} className="mt-5">
        {section.plan ? (
          <PlanPanel product={product} section={section} completed={completed} />
        ) : group.sections.length > 1 ? (
          <GuideParts product={product} sections={group.sections} completed={completed} />
        ) : (
          <>
            <h2 className="mb-3 font-serif text-[20px] font-semibold text-ink">{section.title}</h2>
            <ul className="space-y-2.5">
              {section.lessons.map((lesson, i) => (
                <LessonRow key={lesson.id} product={product} lesson={lesson} n={i + 1} done={Boolean(completed[lessonKey(product.id, lesson.id)])} />
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  )
}

/** A guide in parts inside a tab (Palabras del Señor): search, then the parts, one open at a time. */
function GuideParts({ product, sections, completed }: { product: Product; sections: Section[]; completed: AppState['completed'] }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<string | null>(sections[0]?.id ?? null)
  const q = normalize(query)
  const numbers = useMemo(() => new Map(sections.flatMap((sec) => sec.lessons).map((l, i) => [l.id, i + 1])), [sections])
  const visible = sections.map((sec) => ({ sec, lessons: q ? sec.lessons.filter((l) => normalize(l.title).includes(q)) : sec.lessons }))
  const nothing = q.length > 0 && visible.every((v) => v.lessons.length === 0)

  return (
    <>
      <SearchInput value={query} onChange={setQuery} placeholder="¿Qué estás viviendo? Ej.: perdón, deudas" label="Buscar una situación" />
      {nothing && (
        <div className="mt-4">
          <EmptyState icon="search" title="Sin resultados" text="Prueba con otra palabra, como «miedo», «familia» o «trabajo»." />
        </div>
      )}
      <div className="mt-3">
        {visible.map(({ sec, lessons }) => {
          if (q && lessons.length === 0) return null
          const isOpen = q.length > 0 || open === sec.id
          const done = sec.lessons.filter((l) => completed[lessonKey(product.id, l.id)]).length
          return (
            <section key={sec.id} className="border-b border-line-soft last:border-b-0">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : sec.id)}
                aria-expanded={isOpen}
                className="flex min-h-14 w-full items-center justify-between gap-3 py-3 text-left"
              >
                <span className="font-serif text-[19px] font-semibold text-ink">{sec.title}</span>
                <span className="flex shrink-0 items-center gap-2 text-[14px] tabular-nums text-muted">
                  {done}/{sec.lessons.length}
                  <Icon name="chevronDown" className={`size-5 transition ${isOpen ? 'rotate-180' : ''}`} />
                </span>
              </button>
              {isOpen && (
                <ul className="space-y-2.5 pb-5">
                  {lessons.map((lesson) => (
                    <LessonRow key={lesson.id} product={product} lesson={lesson} n={numbers.get(lesson.id) ?? 0} done={Boolean(completed[lessonKey(product.id, lesson.id)])} />
                  ))}
                </ul>
              )}
            </section>
          )
        })}
      </div>
    </>
  )
}

function PlanPanel({ product, section, completed }: { product: Product; section: Section; completed: AppState['completed'] }) {
  const today = useToday()
  const total = section.lessons.length
  const done = section.lessons.filter((l) => completed[lessonKey(product.id, l.id)]).length
  const pct = total ? Math.round((done / total) * 100) : 0
  const current = currentPlanDay(product.id, section, completed, today)

  return (
    <>
      <div className="rounded-3xl border border-line bg-surface p-5 shadow-card">
        <h2 className="font-serif text-[20px] font-semibold leading-snug text-ink">{section.title}</h2>
        {section.plan && <p className="mt-1 text-[15.5px] leading-snug text-muted">{section.plan.goal}</p>}
        <div className="mt-4 flex items-baseline justify-between gap-3">
          <p className="text-[15.5px] text-text">
            <strong className="text-ink">{done}</strong> de {total} días
          </p>
          <p className="font-serif text-[24px] font-semibold tabular-nums text-ink">{pct}%</p>
        </div>
        <div className="mt-2">
          <ProgressBar value={pct} label={`Progreso de ${section.title}`} />
        </div>
        {!current ? (
          <p className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-success-soft p-3 text-[15.5px] font-semibold text-success">
            <Icon name="trophy" className="size-5" />
            ¡Completaste los {total} días!
          </p>
        ) : current.status === 'open' ? (
          <Link href={lessonHref(product.id, current.lesson.id)} className={`${buttonClass.primary} mt-4`}>
            {done ? `Hacer el Día ${current.n}` : 'Empezar el Día 1'}
            {current.lesson.subtitle ? `: ${current.lesson.subtitle}` : ''}
            <Icon name="arrowRight" className="size-5 shrink-0 text-gold-bright" />
          </Link>
        ) : (
          <p className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-gold-soft/60 p-3 text-center text-[15.5px] font-medium text-ink">
            <Icon name="check" className="size-5 shrink-0 text-success" strokeWidth={2.6} />
            Día de hoy completado. El Día {current.n} se abre mañana.
          </p>
        )}
      </div>

      <ol className="mt-5 grid grid-cols-6 gap-2" aria-label={`Días de ${section.title}`}>
        {section.lessons.map((lesson, i) => {
          const status = planDayStatus(product.id, section, lesson.id, completed, today) ?? 'open'
          const n = i + 1
          if (status === 'done' || status === 'open') {
            return (
              <li key={lesson.id}>
                <Link
                  href={lessonHref(product.id, lesson.id)}
                  aria-label={`Día ${n}${status === 'done' ? ', completado' : ', disponible'}`}
                  className={`grid aspect-square place-items-center rounded-xl text-[14px] font-semibold tabular-nums transition ${
                    status === 'done' ? 'bg-success text-white' : 'bg-primary text-white ring-2 ring-gold-bright ring-offset-2 ring-offset-bg'
                  }`}
                >
                  {status === 'done' ? <Icon name="check" className="size-4" strokeWidth={3} /> : n}
                </Link>
              </li>
            )
          }
          return (
            <li key={lesson.id}>
              <span
                aria-label={`Día ${n}, ${status === 'tomorrow' ? 'se abre mañana' : 'bloqueado'}`}
                className="grid aspect-square place-items-center rounded-xl border border-line-soft bg-surface text-[13.5px] tabular-nums text-muted"
              >
                {n}
              </span>
            </li>
          )
        })}
      </ol>
      <p className="mt-3 text-center text-[14px] text-muted">Un día a la vez: cada día se abre al día siguiente de completar el anterior.</p>
    </>
  )
}

/** A tool inside the app (e.g. the study AI): what it does, and the way in once it is ready. */
function ToolProduct({ product }: { product: Product }) {
  return (
    <>
      <PageHeader back="/leer" title={product.title} />
      <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-card">
        <Cover cover={product.cover} size="banner" />
        <div className="p-5">
          <p className="text-[16.5px] leading-relaxed text-text">{product.description}</p>
          {product.href && TOOLS_READY.has(product.id) ? (
            <Link href={product.href} className={`${buttonClass.primary} mt-5`}>
              <Icon name="sparkles" className="size-5 text-gold-bright" />
              Abrir
            </Link>
          ) : (
            <p className="mt-5 flex items-center gap-2 rounded-2xl bg-gold-soft/60 p-4 text-[15.5px] text-ink">
              <Icon name="clock" className="size-5 shrink-0 text-gold" />
              Estamos preparando esta herramienta. Muy pronto la encontrarás aquí.
            </p>
          )}
        </div>
      </div>
    </>
  )
}

/** Tools whose page already exists (add the id when it goes live). */
const TOOLS_READY = new Set<string>(['guia-ia'])

function LinkProduct({ product }: { product: Product }) {
  return (
    <>
      <PageHeader back="/leer" title={product.title} />
      <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-card">
        <Cover cover={product.cover} size="hero" />
        <div className="p-5">
          <p className="text-[16.5px] leading-relaxed text-text">{product.description}</p>
          {product.url ? (
            <a href={product.url} target="_blank" rel="noopener noreferrer" className={`${buttonClass.primary} mt-5`}>
              <Icon name="message" className="size-5" />
              Entrar al grupo
            </a>
          ) : (
            <p className="mt-5 rounded-2xl bg-gold-soft/60 p-4 text-[15.5px] text-ink">El enlace del grupo aparecerá aquí muy pronto.</p>
          )}
        </div>
      </div>
    </>
  )
}

function LessonRow({ product, lesson, n, done }: { product: Product; lesson: Lesson; n: number; done: boolean }) {
  const key = lessonKey(product.id, lesson.id)
  return (
    <li className="flex items-stretch overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
      {/* The checklist: one tap marks the lesson without opening it. */}
      <button
        type="button"
        onClick={() => toggleLesson(key)}
        aria-pressed={done}
        aria-label={done ? `Desmarcar «${lesson.title}»` : `Marcar «${lesson.title}» como leída`}
        className="grid w-14 shrink-0 place-items-center border-r border-line-soft transition hover:bg-surface-hover"
      >
        <span className={`grid size-7 place-items-center rounded-full border-2 transition ${done ? 'animate-pop border-success bg-success text-white' : 'border-[#b9a57c] bg-surface-2'}`}>
          {done && <Icon name="check" className="size-4" strokeWidth={3} />}
        </span>
      </button>
      <Link href={lessonHref(product.id, lesson.id)} className="flex min-h-16 min-w-0 flex-1 items-center gap-3 px-4 py-3 transition hover:bg-surface-hover">
        <span className="w-7 shrink-0 text-[13px] font-semibold tabular-nums text-muted">{String(n).padStart(2, '0')}</span>
        <span className="min-w-0 flex-1">
          <span className={`block font-serif text-[16.5px] leading-snug ${done ? 'text-muted' : 'text-ink'}`}>{lesson.title}</span>
          {lesson.rotulo && <span className="mt-0.5 block text-[13.5px] leading-snug text-muted">{lesson.rotulo}</span>}
        </span>
        {lesson.format === 'audio' && <Icon name="headphones" className="size-4.5 shrink-0 text-gold" label="Audio" />}
        <Icon name="chevronRight" className="size-5 shrink-0 text-muted" />
      </Link>
    </li>
  )
}

/** Inside the Estudio Cronológico: the way into the study AI that comes with it. */
function StudyGuideCard() {
  return (
    <Link
      href="/estudio"
      className="mt-3 flex items-center gap-3.5 rounded-3xl bg-primary p-4 text-white shadow-card transition hover:brightness-110 active:scale-[0.99]"
    >
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-gold-bright">
        <Icon name="sparkles" className="size-6" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-serif text-[17px] font-semibold leading-snug">Tu Guía de Estudio con IA</span>
        <span className="mt-0.5 block text-[14px] leading-snug text-white/75">Escribe un pasaje, un personaje o un tema y ve todos los pasajes conectados, en orden.</span>
      </span>
      <Icon name="chevronRight" className="size-5 shrink-0 text-gold-bright" />
    </Link>
  )
}

function ModuleContent({ product, completed }: { product: Product; completed: AppState['completed'] }) {
  const progress = productProgress(product, completed)
  const next = nextLesson(product, completed)
  // Chronological number of each lesson: the order is the product's whole point.
  const numbers = useMemo(() => new Map(allLessons(product).map((l, i) => [l.id, i + 1])), [product])
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<Set<string>>(() => new Set([next?.section.id ?? product.sections[0]?.id ?? '']))
  const q = normalize(query)
  const single = product.sections.length === 1

  const toggleSection = (id: string) =>
    setOpen((prev) => {
      const nextOpen = new Set(prev)
      if (nextOpen.has(id)) nextOpen.delete(id)
      else nextOpen.add(id)
      return nextOpen
    })

  const visible = product.sections.map((section) => ({
    section,
    lessons: q ? section.lessons.filter((l) => normalize(l.title).includes(q)) : section.lessons,
  }))
  const nothingFound = q.length > 0 && visible.every((v) => v.lessons.length === 0)

  return (
    <>
      <PageHeader back="/leer" title={product.title} />

      <div className="rounded-3xl border border-line bg-surface p-5 shadow-card">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-[15.5px] text-text">
            <strong className="text-ink">{progress.done}</strong> de {plural(progress.total, 'lección', 'lecciones')}
          </p>
          <p className="font-serif text-[26px] font-semibold tabular-nums text-ink">{progress.pct}%</p>
        </div>
        <div className="mt-2.5">
          <ProgressBar value={progress.pct} label={`Progreso de ${product.title}`} />
        </div>
        {next ? (
          <Link href={lessonHref(product.id, next.lesson.id)} className={`${buttonClass.primary} mt-4`}>
            {progress.done ? 'Continuar' : 'Empezar'}: {next.lesson.title}
            <Icon name="arrowRight" className="size-5 shrink-0 text-gold-bright" />
          </Link>
        ) : (
          <p className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-success-soft p-3 text-[15.5px] font-semibold text-success">
            <Icon name="trophy" className="size-5" />
            ¡Completaste este recorrido!
          </p>
        )}
      </div>

      {product.id === 'cronologico' && <StudyGuideCard />}

      {progress.total > 8 && (
        <div className="mt-5">
          <SearchInput value={query} onChange={setQuery} placeholder="¿Qué estás buscando?" label={`Buscar en ${product.title}`} />
        </div>
      )}

      <div className="mt-3">
        {nothingFound && (
          <div className="mt-4">
            <EmptyState icon="search" title="Sin resultados" text="Prueba con otro nombre o revisa la ortografía." />
          </div>
        )}
        {visible.map(({ section, lessons }) => {
          if (q && lessons.length === 0) return null
          const isOpen = single || q.length > 0 || open.has(section.id)
          const done = section.lessons.filter((l) => completed[lessonKey(product.id, l.id)]).length
          return (
            <section key={section.id} className="border-b border-line-soft last:border-b-0">
              {!single && (
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  aria-expanded={isOpen}
                  className="flex min-h-14 w-full items-center justify-between gap-3 py-3 text-left"
                >
                  <span className="font-serif text-[19px] font-semibold text-ink">{section.title}</span>
                  <span className="flex shrink-0 items-center gap-2 text-[14px] tabular-nums text-muted">
                    {done}/{section.lessons.length}
                    <Icon name="chevronDown" className={`size-5 transition ${isOpen ? 'rotate-180' : ''}`} />
                  </span>
                </button>
              )}
              {isOpen && (
                <ul className={`space-y-2.5 pb-5 ${single ? 'pt-2' : ''}`}>
                  {lessons.map((lesson) => (
                    <LessonRow
                      key={lesson.id}
                      product={product}
                      lesson={lesson}
                      n={numbers.get(lesson.id) ?? 0}
                      done={Boolean(completed[lessonKey(product.id, lesson.id)])}
                    />
                  ))}
                </ul>
              )}
            </section>
          )
        })}
      </div>
    </>
  )
}
