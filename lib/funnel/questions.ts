import type { IconName } from '@/components/icons'

// The quiz, in order. Same shape as the proven funnel — a few profile questions, a
// short Bible test, analysis, result, video — written from scratch. The test mixes
// well-known facts with two "what came first?" questions: those are exactly what the
// chronological summary solves, so the result can point at a real gap.

// Images are optional everywhere. Put the file in /public/quiz/ and reference it as
// "/quiz/nombre.webp": a question `image` shows above the title; when the options of
// a question have images they render as a two-column grid of picture cards.
// Only reference files that exist — a missing file shows as a broken picture.

export interface ProfileQuestion {
  kind: 'profile'
  id: string
  title: string
  hint?: string
  multi?: boolean
  image?: string
  options: { label: string; icon?: IconName; image?: string }[]
}

export interface TestQuestion {
  kind: 'test'
  id: string
  title: string
  image?: string
  options: string[]
  /** One per option, same order. Omit for text-only options. */
  optionImages?: string[]
  correct: number
  /** Questions about the order of events: reported separately in the result. */
  chronology?: boolean
}

export const PROFILE: ProfileQuestion[] = [
  {
    kind: 'profile',
    id: 'conexion',
    title: '¿Cómo te conectas más con la Palabra de Dios?',
    options: [
      { label: 'Escuchando prédicas y videos', icon: 'headphones' },
      { label: 'Leyendo la Biblia o un devocional', icon: 'book' },
      { label: 'En el culto y en las reuniones', icon: 'users' },
      { label: 'Últimamente me cuesta conectarme', icon: 'heart' },
    ],
  },
  {
    kind: 'profile',
    id: 'dificultad',
    title: '¿Qué parte de la Biblia te cuesta más entender?',
    options: [{ label: 'El Antiguo Testamento' }, { label: 'El Nuevo Testamento' }, { label: 'Las dos por igual' }],
  },
  {
    kind: 'profile',
    id: 'sentimiento',
    title: 'Cuando intentas entender la Biblia como un todo, ¿cómo te sientes?',
    options: [
      { label: 'Lo intenté varias veces y lo dejé' },
      { label: 'Me esfuerzo, pero no logro unir las partes' },
      { label: 'A veces me pierdo, pero voy entendiendo' },
      { label: 'Bien, aunque sé que puedo profundizar más' },
    ],
  },
  {
    kind: 'profile',
    id: 'freno',
    title: '¿Qué es lo que más te frena al leer la Biblia?',
    hint: 'Puedes elegir más de una',
    multi: true,
    options: [
      { label: 'No sé por dónde empezar' },
      { label: 'Me cuesta entender lo que leo' },
      { label: 'No logro ser constante' },
      { label: 'Siento que me falta tiempo' },
      { label: 'Me falta una guía que me acompañe' },
    ],
  },
  {
    kind: 'profile',
    id: 'completa',
    title: '¿Ya leíste la Biblia completa?',
    options: [{ label: 'Sí, de principio a fin' }, { label: 'Todavía no' }],
  },
  {
    kind: 'profile',
    id: 'genero',
    title: 'Para conocerte mejor: eres…',
    options: [{ label: 'Hombre' }, { label: 'Mujer' }],
  },
  {
    kind: 'profile',
    id: 'edad',
    title: '¿Cuántos años tienes?',
    options: [{ label: '18 a 34' }, { label: '35 a 44' }, { label: '45 a 54' }, { label: '55 o más' }],
  },
]

export const TEST: TestQuestion[] = [
  { kind: 'test', id: 't1', title: '¿Quién construyó el arca por mandato de Dios?', options: ['Abraham', 'Noé', 'Moisés', 'Jonás'], correct: 1 },
  { kind: 'test', id: 't2', title: '¿En qué ciudad nació Jesús?', options: ['Nazaret', 'Jerusalén', 'Belén', 'Capernaúm'], correct: 2 },
  { kind: 'test', id: 't3', title: '¿Qué ocurrió primero?', options: ['La salida de Egipto', 'El diluvio', 'El reinado de David', 'El exilio en Babilonia'], correct: 1, chronology: true },
  { kind: 'test', id: 't4', title: '¿Quién fue arrojado al foso de los leones?', options: ['José', 'Daniel', 'Elías', 'Pablo'], correct: 1 },
  { kind: 'test', id: 't5', title: '¿Qué apóstol negó a Jesús tres veces?', options: ['Juan', 'Judas', 'Pedro', 'Tomás'], correct: 2 },
  { kind: 'test', id: 't6', title: '¿Qué mar abrió Dios para que el pueblo de Israel lo cruzara?', options: ['El Mar Muerto', 'El Mar Rojo', 'El Mar de Galilea', 'El Mar Mediterráneo'], correct: 1 },
  { kind: 'test', id: 't7', title: '¿Quién vivió primero?', options: ['Moisés', 'David', 'Abraham', 'Elías'], correct: 2, chronology: true },
  { kind: 'test', id: 't8', title: '¿Cuántos libros tiene el Nuevo Testamento?', options: ['12', '27', '39', '66'], correct: 1 },
  { kind: 'test', id: 't9', title: '¿Quién escribió la mayor parte de los Salmos?', options: ['Salomón', 'Moisés', 'David', 'Asaf'], correct: 2 },
  { kind: 'test', id: 't10', title: '¿Qué rey le pidió a Dios sabiduría para gobernar?', options: ['Saúl', 'Salomón', 'Ezequías', 'Josías'], correct: 1 },
]
