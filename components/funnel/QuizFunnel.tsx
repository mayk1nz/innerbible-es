'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react'
import { VturbPlayer } from './VturbPlayer'
import { Icon } from '../icons'
import { BrandMark, buttonClass } from '../ui'
import { APP } from '@/lib/config'
import { FUNNEL, formatUsd } from '@/lib/funnel/config'
import { PROFILE, TEST, type ProfileQuestion, type TestQuestion } from '@/lib/funnel/questions'
import { initPixel, trackCheckout, trackViewContent, withAttribution } from '@/lib/funnel/tracking'

// 22 steps, in the order of the funnel it is modelled on:
//   0 intro · 1–7 profile · 8 test intro · 9–18 test · 19 analysis · 20 result · 21 video
// The browser Back button walks back through the steps. Answers stay in memory only.

const TEST_INTRO = 1 + PROFILE.length
const FIRST_TEST = TEST_INTRO + 1
const ANALYSIS = FIRST_TEST + TEST.length
const RESULT = ANALYSIS + 1
const VIDEO = RESULT + 1
const TOTAL = VIDEO + 1
const ANALYSIS_MS = 4500
const PRODUCT_ID = 'resumen-cronologico'

type ProfileAnswers = Record<string, number[]>

export function QuizFunnel() {
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState<ProfileAnswers>({})
  const [test, setTest] = useState<number[]>([])
  const [picked, setPicked] = useState<number | null>(null)
  const heading = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    initPixel()
    try {
      window.history.replaceState({ quizStep: 0 }, '')
    } catch {
      // history unavailable: Back simply leaves the page
    }
    const onPop = (e: PopStateEvent) => {
      const s = (e.state as { quizStep?: number } | null)?.quizStep
      setPicked(null)
      setStep(typeof s === 'number' && s >= 0 && s < TOTAL ? s : 0)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
    if (step > 0) heading.current?.focus({ preventScroll: true })
  }, [step])

  const go = useCallback((next: number) => {
    setPicked(null)
    setStep(next)
    try {
      window.history.pushState({ quizStep: next }, '')
    } catch {
      // ignore
    }
  }, [])

  const answerProfile = (q: ProfileQuestion, choice: number) => {
    if (picked !== null) return
    setPicked(choice)
    setProfile((p) => ({ ...p, [q.id]: [choice] }))
    window.setTimeout(() => go(step + 1), 220)
  }

  const answerTest = (index: number, choice: number) => {
    if (picked !== null) return
    setPicked(choice)
    setTest((t) => {
      const next = [...t]
      next[index] = choice
      return next
    })
    window.setTimeout(() => go(step + 1), 260)
  }

  // Stable, so the analysis timer is not restarted by unrelated re-renders.
  const toResult = useCallback(() => go(RESULT), [go])

  const inProfile = step >= 1 && step <= PROFILE.length
  const inTest = step >= FIRST_TEST && step < ANALYSIS
  const showProgress = step > 0 && step < VIDEO

  return (
    <div className="mx-auto min-h-dvh w-full max-w-[480px] px-5 pb-16 pt-[max(env(safe-area-inset-top),20px)]">
      <header className="mb-6">
        <div className="flex items-center justify-center gap-2.5">
          <BrandMark />
          <span className="font-serif text-[19px] font-semibold text-ink">{APP.name}</span>
        </div>
        {showProgress && (
          <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-line-soft" aria-hidden>
            <div className="h-full rounded-full bg-gold-bright transition-[width] duration-500" style={{ width: `${Math.round(((step + 1) / TOTAL) * 100)}%` }} />
          </div>
        )}
      </header>

      <main key={step} className="animate-rise">
        {step === 0 && <Intro onStart={() => go(1)} />}

        {inProfile && (
          <ProfileStep
            q={PROFILE[step - 1]}
            headingRef={heading}
            picked={picked}
            multiValue={profile[PROFILE[step - 1].id] ?? []}
            onPick={(c) => answerProfile(PROFILE[step - 1], c)}
            onMulti={(values) => setProfile((p) => ({ ...p, [PROFILE[step - 1].id]: values }))}
            onContinue={() => go(step + 1)}
          />
        )}

        {step === TEST_INTRO && (
          <Interstitial headingRef={heading} onStart={() => go(FIRST_TEST)} />
        )}

        {inTest && (
          <TestStep
            q={TEST[step - FIRST_TEST]}
            number={step - FIRST_TEST + 1}
            headingRef={heading}
            picked={picked}
            onPick={(c) => answerTest(step - FIRST_TEST, c)}
          />
        )}

        {step === ANALYSIS && <Analysis headingRef={heading} onDone={toResult} />}

        {step === RESULT && <Result headingRef={heading} profile={profile} test={test} onNext={() => go(VIDEO)} />}

        {step === VIDEO && <VideoOffer headingRef={heading} />}
      </main>
    </div>
  )
}

// ─── Steps ─────────────────────────────────────────────────────────

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="pt-4 text-center">
      <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-gold">Test bíblico · 2 minutos</p>
      <h1 className="mt-3 font-serif text-[34px] font-semibold leading-[1.1] text-balance text-ink">¿Cuánto conoces la Palabra de Dios?</h1>
      <p className="mx-auto mt-4 max-w-sm text-[17px] leading-relaxed text-text">
        Responde unas preguntas rápidas y descubre tu nivel — y qué te falta para entender la Biblia de principio a fin.
      </p>
      <div className="mx-auto mt-7 flex max-w-sm items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3.5 text-left">
        <Icon name="gift" className="size-6 shrink-0 text-gold" />
        <p className="text-[15.5px] leading-snug text-ink">Al final verás tu resultado y un regalo para tu lectura.</p>
      </div>
      <button type="button" onClick={onStart} className={`${buttonClass.primary} mt-7 min-h-14 text-[17px]`}>
        Empezar el test
        <Icon name="arrowRight" className="size-5 text-gold-bright" />
      </button>
      <p className="mt-3 text-[14px] text-muted">Tus respuestas no se comparten con nadie.</p>
    </div>
  )
}

type HeadingRef = RefObject<HTMLHeadingElement | null>

function Title({ headingRef, children, hint }: { headingRef: HeadingRef; children: ReactNode; hint?: string }) {
  return (
    <div className="mb-6 text-center">
      <h1 ref={headingRef} tabIndex={-1} className="font-serif text-[26px] font-semibold leading-[1.2] text-balance text-ink focus:outline-none focus-visible:outline-none">
        {children}
      </h1>
      {hint && <p className="mt-2 text-[15.5px] text-muted">{hint}</p>}
    </div>
  )
}

function Option({
  label,
  selected,
  onClick,
  leading,
  multi = false,
}: {
  label: string
  selected: boolean
  onClick: () => void
  leading?: ReactNode
  multi?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex min-h-16 w-full items-center gap-3.5 rounded-2xl border-2 px-4 py-3.5 text-left transition active:scale-[0.99] ${
        selected ? 'border-primary bg-[#e8ecf3]' : 'border-line bg-surface hover:border-[#cdb888] hover:bg-surface-hover'
      }`}
    >
      {leading}
      <span className="min-w-0 flex-1 text-[17px] font-medium leading-snug text-ink">{label}</span>
      {multi && (
        <span className={`grid size-6 shrink-0 place-items-center rounded-md border-2 ${selected ? 'border-primary bg-primary text-white' : 'border-[#b9a57c] bg-surface-2'}`}>
          {selected && <Icon name="check" className="size-4" strokeWidth={3} />}
        </span>
      )}
    </button>
  )
}

/** Picture card for options that come with an image (e.g. age, gender, Bible scenes). */
function ImageOption({
  label,
  image,
  selected,
  onClick,
  badge,
  multi = false,
}: {
  label: string
  image: string
  selected: boolean
  onClick: () => void
  badge?: string
  multi?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`relative flex flex-col overflow-hidden rounded-2xl border-2 text-left transition active:scale-[0.99] ${
        selected ? 'border-primary bg-[#e8ecf3]' : 'border-line bg-surface hover:border-[#cdb888]'
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- local static files, sized by CSS */}
      <img src={image} alt="" loading="eager" className="aspect-square w-full object-cover" />
      <span className="flex min-h-14 items-center gap-2 px-3 py-2.5">
        {badge && (
          <span className={`grid size-7 shrink-0 place-items-center rounded-full text-[13px] font-bold ${selected ? 'bg-primary text-white' : 'bg-gold-soft text-ink'}`}>{badge}</span>
        )}
        <span className="text-[15.5px] font-medium leading-snug text-ink">{label}</span>
      </span>
      {multi && selected && (
        <span className="absolute right-2 top-2 grid size-7 place-items-center rounded-md bg-primary text-white">
          <Icon name="check" className="size-4" strokeWidth={3} />
        </span>
      )}
    </button>
  )
}

function QuestionImage({ src }: { src?: string }) {
  if (!src) return null
  // eslint-disable-next-line @next/next/no-img-element -- local static file
  return <img src={src} alt="" className="mb-5 aspect-[16/9] w-full rounded-2xl object-cover shadow-card" />
}

function ProfileStep({
  q,
  headingRef,
  picked,
  multiValue,
  onPick,
  onMulti,
  onContinue,
}: {
  q: ProfileQuestion
  headingRef: HeadingRef
  picked: number | null
  multiValue: number[]
  onPick: (choice: number) => void
  onMulti: (values: number[]) => void
  onContinue: () => void
}) {
  const pick = (i: number) => {
    if (!q.multi) {
      onPick(i)
      return
    }
    onMulti(multiValue.includes(i) ? multiValue.filter((v) => v !== i) : [...multiValue, i])
  }
  const pictures = q.options.every((o) => o.image)

  return (
    <>
      <QuestionImage src={q.image} />
      <Title headingRef={headingRef} hint={q.hint}>
        {q.title}
      </Title>
      {pictures ? (
        <div className="grid grid-cols-2 gap-3">
          {q.options.map((o, i) => (
            <ImageOption
              key={o.label}
              label={o.label}
              image={o.image ?? ''}
              multi={q.multi}
              selected={q.multi ? multiValue.includes(i) : picked === i}
              onClick={() => pick(i)}
            />
          ))}
        </div>
      ) : (
      <div className="space-y-3">
        {q.options.map((o, i) => {
          const selected = q.multi ? multiValue.includes(i) : picked === i
          return (
            <Option
              key={o.label}
              label={o.label}
              multi={q.multi}
              selected={selected}
              leading={
                o.icon ? (
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold-soft text-gold">
                    <Icon name={o.icon} className="size-5" />
                  </span>
                ) : undefined
              }
              onClick={() => pick(i)}
            />
          )
        })}
      </div>
      )}
      {q.multi && (
        <button type="button" onClick={onContinue} disabled={multiValue.length === 0} className={`${buttonClass.primary} mt-6`}>
          Continuar
        </button>
      )}
    </>
  )
}

function Interstitial({ headingRef, onStart }: { headingRef: HeadingRef; onStart: () => void }) {
  return (
    <div className="pt-6 text-center">
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-gold-soft text-gold">
        <Icon name="book" className="size-8" />
      </span>
      <h1 ref={headingRef} tabIndex={-1} className="mt-5 font-serif text-[28px] font-semibold leading-tight text-balance text-ink focus:outline-none focus-visible:outline-none">
        Ahora, pongamos a prueba lo que sabes
      </h1>
      <p className="mx-auto mt-3 max-w-sm text-[17px] leading-relaxed text-text">
        {TEST.length} preguntas rápidas sobre la Biblia. Sin presión: el resultado es solo para ti.
      </p>
      <button type="button" onClick={onStart} className={`${buttonClass.primary} mt-8 min-h-14 text-[17px]`}>
        Comenzar
      </button>
    </div>
  )
}

const LETTERS = ['A', 'B', 'C', 'D']

function TestStep({
  q,
  number,
  headingRef,
  picked,
  onPick,
}: {
  q: TestQuestion
  number: number
  headingRef: HeadingRef
  picked: number | null
  onPick: (choice: number) => void
}) {
  return (
    <>
      <p className="mb-2 text-center text-[14px] font-semibold uppercase tracking-[0.08em] text-gold">
        Pregunta {number} de {TEST.length}
      </p>
      <QuestionImage src={q.image} />
      <Title headingRef={headingRef}>{q.title}</Title>
      {q.optionImages && q.optionImages.length === q.options.length ? (
        <div className="grid grid-cols-2 gap-3">
          {q.options.map((label, i) => (
            <ImageOption
              key={label}
              label={label}
              image={q.optionImages?.[i] ?? ''}
              badge={LETTERS[i]}
              selected={picked === i}
              onClick={() => onPick(i)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {q.options.map((label, i) => (
            <Option
              key={label}
              label={label}
              selected={picked === i}
              onClick={() => onPick(i)}
              leading={
                <span className={`grid size-9 shrink-0 place-items-center rounded-full text-[15px] font-bold ${picked === i ? 'bg-primary text-white' : 'bg-gold-soft text-ink'}`}>
                  {LETTERS[i]}
                </span>
              }
            />
          ))}
        </div>
      )}
    </>
  )
}

const ANALYSIS_LINES = ['Revisando tus respuestas', 'Comparando con tu perfil de lectura', 'Preparando tu resultado']

function Analysis({ headingRef, onDone }: { headingRef: HeadingRef; onDone: () => void }) {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const started = Date.now()
    const tick = window.setInterval(() => {
      setPct(Math.min(100, Math.round(((Date.now() - started) / ANALYSIS_MS) * 100)))
    }, 60)
    const done = window.setTimeout(onDone, ANALYSIS_MS + 150)
    return () => {
      window.clearInterval(tick)
      window.clearTimeout(done)
    }
  }, [onDone])

  return (
    <div className="pt-10 text-center">
      <h1 ref={headingRef} tabIndex={-1} className="font-serif text-[27px] font-semibold text-ink focus:outline-none focus-visible:outline-none">
        Analizando tus respuestas…
      </h1>
      <p className="mt-6 font-serif text-[48px] font-semibold tabular-nums text-ink" aria-live="polite">
        {pct}%
      </p>
      <div className="mx-auto mt-3 h-2.5 max-w-xs overflow-hidden rounded-full bg-line-soft" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
        <div className="h-full rounded-full bg-gold-bright" style={{ width: `${pct}%` }} />
      </div>
      <ul className="mx-auto mt-8 max-w-xs space-y-3 text-left">
        {ANALYSIS_LINES.map((line, i) => {
          const done = pct >= ((i + 1) / ANALYSIS_LINES.length) * 100 - 1
          return (
            <li key={line} className="flex items-center gap-3 text-[16px]">
              <span className={`grid size-6 shrink-0 place-items-center rounded-full ${done ? 'bg-success text-white' : 'border-2 border-line'}`}>
                {done && <Icon name="check" className="size-3.5" strokeWidth={3} />}
              </span>
              <span className={done ? 'text-ink' : 'text-muted'}>{line}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function insights(profile: ProfileAnswers): string[] {
  const out: string[] = []
  const has = (id: string, v: number) => (profile[id] ?? []).includes(v)
  if (has('dificultad', 0)) out.push('Te cuesta el Antiguo Testamento: es donde la historia más se pierde cuando se lee sin un orden.')
  if (has('dificultad', 1)) out.push('Te cuesta el Nuevo Testamento: entender lo que vino antes lo aclara muchísimo.')
  if (has('dificultad', 2)) out.push('Te cuestan las dos partes: el problema no eres tú, es leerlas como piezas sueltas.')
  if (has('freno', 0)) out.push('No sabes por dónde empezar: necesitas un punto de partida y un camino claro.')
  if (has('freno', 2)) out.push('Te cuesta ser constante: con lecturas cortas, un paso por día, es posible.')
  if (has('freno', 3)) out.push('Sientes que te falta tiempo: pocos minutos al día bastan si el camino está ordenado.')
  if (has('completa', 1)) out.push('Todavía no leíste la Biblia completa, y puedes hacerlo este año.')
  return out.slice(0, 3)
}

function Result({ headingRef, profile, test, onNext }: { headingRef: HeadingRef; profile: ProfileAnswers; test: number[]; onNext: () => void }) {
  const score = TEST.reduce((sum, q, i) => sum + (test[i] === q.correct ? 1 : 0), 0)
  const chrono = TEST.filter((q) => q.chronology)
  const chronoScore = TEST.reduce((sum, q, i) => sum + (q.chronology && test[i] === q.correct ? 1 : 0), 0)
  const lines = useMemo(() => insights(profile), [profile])
  const verdict =
    score >= 9 ? '¡Excelente! Conoces muy bien la Palabra.' : score >= 6 ? '¡Muy bien! Tienes una buena base.' : 'Buen comienzo: hay mucho por descubrir.'

  return (
    <>
      <p className="text-center text-[13px] font-semibold uppercase tracking-[0.1em] text-gold">Tu resultado</p>
      <h1 ref={headingRef} tabIndex={-1} className="mt-2 text-center font-serif text-[28px] font-semibold leading-tight text-ink focus:outline-none focus-visible:outline-none">
        Acertaste {score} de {TEST.length} preguntas
      </h1>
      <p className="mt-2 text-center text-[17px] text-text">{verdict}</p>

      <div className="mt-6 rounded-3xl border border-line bg-surface p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[16px] font-semibold text-ink">Preguntas de orden de los hechos</p>
          <p className="font-serif text-[22px] font-semibold tabular-nums text-ink">
            {chronoScore}/{chrono.length}
          </p>
        </div>
        <p className="mt-2 text-[15.5px] leading-relaxed text-text">
          Saber en qué orden sucedió cada cosa es lo que une toda la historia bíblica. Es lo que más cuesta cuando se lee por partes.
        </p>
      </div>

      {lines.length > 0 && (
        <div className="mt-4 rounded-3xl border border-line bg-surface-2 p-5">
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-gold">Lo que nos contaste</p>
          <ul className="mt-3 space-y-3">
            {lines.map((l) => (
              <li key={l} className="flex gap-3 text-[16px] leading-snug text-ink">
                <Icon name="check" className="mt-0.5 size-5 shrink-0 text-success" strokeWidth={2.4} />
                {l}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button type="button" onClick={onNext} className={`${buttonClass.primary} mt-7 min-h-14 text-[17px]`}>
        Ver mi siguiente paso
        <Icon name="arrowRight" className="size-5 text-gold-bright" />
      </button>
    </>
  )
}

function VideoOffer({ headingRef }: { headingRef: HeadingRef }) {
  const [revealed, setRevealed] = useState(false)
  const reveal = useCallback(() => setRevealed(true), [])
  const offer = FUNNEL.front

  useEffect(() => {
    trackViewContent(PRODUCT_ID, offer.price)
  }, [offer.price])

  const buy = () => {
    trackCheckout(PRODUCT_ID, offer.price)
    window.location.href = withAttribution(offer.checkoutUrl, window.location.search)
  }

  return (
    <>
      <h1 ref={headingRef} tabIndex={-1} className="mb-5 text-center font-serif text-[25px] font-semibold leading-tight text-balance text-ink focus:outline-none focus-visible:outline-none">
        Mira este video: la forma más simple de entender la Biblia de principio a fin
      </h1>
      <VturbPlayer video={offer.video} onReveal={reveal} />

      {revealed && (
        <div className="animate-rise mt-6 rounded-3xl border-2 border-gold-bright bg-surface p-5 text-center shadow-card">
          <p className="font-serif text-[22px] font-semibold text-ink">Resumen Cronológico de la Biblia</p>
          <p className="mt-1 text-[15.5px] text-text">Acceso inmediato en la app, con todos los bonos</p>
          <p className="mt-4">
            {offer.priceFrom > offer.price && (
              <span className="mr-2 text-[18px] text-muted line-through">{formatUsd(offer.priceFrom)}</span>
            )}
            <span className="font-serif text-[36px] font-bold text-ink">{formatUsd(offer.price)}</span>
          </p>
          <button type="button" onClick={buy} className={`${buttonClass.primary} mt-4 min-h-14 text-[17px]`}>
            Quiero mi material
            <Icon name="arrowRight" className="size-5 text-gold-bright" />
          </button>
          <p className="mt-3 text-[14px] text-muted">Pago seguro. Recibes el acceso en tu correo.</p>
        </div>
      )}
    </>
  )
}
