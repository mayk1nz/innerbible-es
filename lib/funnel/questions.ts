import type { IconName } from '@/components/icons'

// The owner's quiz, question for question, with its illustrations (public/funil/assets).
//
// Images: a question `image` shows above the title. Options with images render as a
// two-column grid of picture cards, or — with `thumbs` — as a list with a small
// picture on the left (for small illustrations such as the scroll and the book).

const A = (file: string) => `/funil/assets/${file}`

export interface ProfileQuestion {
  kind: 'profile'
  id: string
  eyebrow?: string
  title: string
  hint?: string
  multi?: boolean
  image?: string
  /** Option images as small thumbnails in a list, instead of a picture grid. */
  thumbs?: boolean
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
}

export const INTRO = {
  title: '¿Cuánto conoces la Palabra?',
  text: 'Haz este test rápido y descubre cuál es tu nivel de conocimiento sobre las escrituras.',
  gift: '¡Al final recibirás tres regalos!',
  image: A('5932855a6aea.jpg'),
  button: 'Empezar el test',
}

export const TEST_INTRO = {
  title: '¡Ahora pongamos a prueba tu conocimiento sobre la Palabra de Dios!',
  text: 'Responde las siguientes preguntas.',
  image: A('427bcc431455.jpg'),
  button: 'Comenzar',
}

export const ANALYSIS_IMAGE = A('9663a02b6178.jpg')

export const PROFILE: ProfileQuestion[] = [
  {
    kind: 'profile',
    id: 'conexion',
    eyebrow: 'Antes, queremos saber un poco más sobre ti.',
    title: '¿Cuál es la forma en que más sueles conectarte con la Palabra de Dios?',
    options: [
      { label: 'Lecturas, videos o predicaciones', image: A('0ba2f5618e0f.jpg') },
      { label: 'Leyendo la Biblia / devocional', image: A('ab8f47db12c3.jpg') },
      { label: 'Cultos y reuniones', image: A('e3c8133b3c68.jpg') },
      { label: 'No estoy logrando conectarme con Dios', image: A('0d1f6e8b4e4c.jpg') },
    ],
  },
  {
    kind: 'profile',
    id: 'dificultad',
    title: '¿Qué parte de la Biblia te resulta difícil de entender?',
    image: A('da5eeb04f639.jpg'),
    thumbs: true,
    options: [
      { label: 'Antiguo Testamento', image: A('ad0185192c2b.png') },
      { label: 'Nuevo Testamento', image: A('392de206fdde.png') },
    ],
  },
  {
    kind: 'profile',
    id: 'sentimiento',
    title: '¿Cómo te sientes al intentar entender la Biblia en su totalidad?',
    options: [
      { label: 'Ya lo intenté varias veces y me rendí', image: A('86967420bc64.jpg') },
      { label: 'Intento pero no lo consigo de ninguna manera', image: A('dfbf4286b0d4.jpg') },
      { label: 'A veces confundido/a, pero la entiendo', image: A('98219e64b88d.jpg') },
      { label: 'Tranquilo/a, pero siento que puedo mejorar', image: A('a25afd282159.jpg') },
    ],
  },
  {
    kind: 'profile',
    id: 'freno',
    title: '¿Cuál es el mayor desafío que enfrentas cuando intentas leer la Biblia?',
    hint: 'Puedes seleccionar más de uno si es el caso',
    image: A('1f42a824330b.jpg'),
    multi: true,
    options: [
      { label: 'No sé por dónde empezar' },
      { label: 'Tengo dificultad para entender' },
      { label: 'Falta de planificación y organización' },
      { label: 'Siento que la lectura lleva mucho tiempo' },
      { label: 'Siento la falta de un material que me ayude en la lectura' },
    ],
  },
  {
    kind: 'profile',
    id: 'completa',
    title: '¿Has logrado leer toda la Biblia?',
    image: A('c419e8e9d0c6.jpg'),
    options: [
      { label: 'Sí, ya lo logré', icon: 'check' },
      { label: 'No, todavía no lo logré', icon: 'x' },
    ],
  },
  {
    kind: 'profile',
    id: 'genero',
    title: 'Usted es:',
    options: [
      { label: 'Cristiano', image: A('660ce8f8a425.jpg') },
      { label: 'Cristiana', image: A('dca1f1f0ae30.jpg') },
    ],
  },
  {
    kind: 'profile',
    id: 'edad',
    title: '¿Cuál es su edad?',
    options: [
      { label: '18 a 34', image: A('1624ba59a944.jpg') },
      { label: '35 a 44', image: A('9d1ca84b491d.jpg') },
      { label: '45 a 54', image: A('b835e63aadc4.jpg') },
      { label: '55+', image: A('125dddb9bd91.jpg') },
    ],
  },
]

export const TEST: TestQuestion[] = [
  {
    kind: 'test',
    id: 't1',
    title: '¿Quién derrotó a un gigante usando una honda y una piedra?',
    options: ['Josué', 'Moisés', 'David', 'Sansón'],
    optionImages: [A('098950509c58.webp'), A('0e261719ce9c.webp'), A('bbf14f60abf9.webp'), A('7dcd52bc8aed.webp')],
    correct: 2,
  },
  {
    kind: 'test',
    id: 't2',
    title: '¿Qué escena muestra a María, José y un bebé en un pesebre?',
    image: A('2c6873e4b0f1.jpg'),
    options: ['La Transfiguración', 'La Natividad', 'La Anunciación', 'La Última Cena'],
    correct: 1,
  },
  {
    kind: 'test',
    id: 't3',
    title: '¿Qué batalla fue ganada por 300 hombres usando trompetas y antorchas?',
    options: ['La rebelión de Absalón', 'La batalla de Jericó', 'La conquista de Canaán', 'La batalla de Madián'],
    optionImages: [A('50ccc33bce10.webp'), A('b55f79d6c2c8.jpg'), A('a39a0b61be97.jpg'), A('1af3b904dc36.jpg')],
    correct: 3,
  },
  {
    kind: 'test',
    id: 't4',
    title: '¿Qué evento muestra los muros de una ciudad cayendo tras siete días de marcha?',
    image: A('dc99fc4f82be.jpg'),
    options: ['La fundación de Jerusalén', 'La destrucción de Sodoma', 'La caída de Babilonia', 'La batalla de Jericó'],
    correct: 3,
  },
  {
    kind: 'test',
    id: 't5',
    title: '¿Qué promesa de Dios se simboliza con un arcoíris en el cielo?',
    image: A('1ddd10d66bab.jpg'),
    options: ['El éxodo de Egipto', 'La creación', 'La venida de Jesús', 'El Pacto con Noé'],
    correct: 3,
  },
  {
    kind: 'test',
    id: 't6',
    title: '¿Qué profeta subió al cielo en un carro de fuego?',
    options: ['Elías', 'Ezequiel', 'Jeremías', 'Isaías'],
    optionImages: [A('dba0b06b71b5.webp'), A('874ee62f147e.webp'), A('a1b858db99d5.webp'), A('7ded05a5e1ba.webp')],
    correct: 0,
  },
  {
    kind: 'test',
    id: 't7',
    title: '¿Qué profeta tuvo la visión de un valle de huesos secos que revivían?',
    options: ['Oseas', 'Ezequiel', 'Daniel', 'Isaías'],
    optionImages: [A('c085d547d210.webp'), A('874ee62f147e.webp'), A('e2e9061b85b9.webp'), A('7ded05a5e1ba.webp')],
    correct: 1,
  },
  {
    kind: 'test',
    id: 't8',
    title: '¿Qué rey quemó un rollo con la profecía de Jeremías?',
    options: ['Josías', 'Manasés', 'Sedequías', 'Joacim'],
    optionImages: [A('5296c8a9b95f.webp'), A('6ad8082f2a1e.webp'), A('e6d9e81400fb.webp'), A('419521e1f991.webp')],
    correct: 3,
  },
  {
    kind: 'test',
    id: 't9',
    title: '¿Qué personaje es conocido por su túnica de colores y por interpretar los sueños del faraón?',
    image: A('5c790905fc1d.jpg'),
    options: ['José', 'Eliseo', 'Moisés', 'Daniel'],
    correct: 0,
  },
  {
    kind: 'test',
    id: 't10',
    title: '¿Cuál fue el martirio del primer cristiano en el libro de los Hechos?',
    options: ['La decapitación de Juan el Bautista', 'El apedreamiento de Esteban', 'La muerte de Jacobo', 'La muerte de Pedro'],
    optionImages: [A('3a8c11fab85f.jpg'), A('277ab8c877ff.jpg'), A('1fc30b6ec0a3.jpg'), A('8026eff08f78.jpg')],
    correct: 1,
  },
]

export const RESULT = {
  eyebrow: 'Resultados de tu Desafío Bíblico',
  image: A('91c1c80705ec.jpg'),
  productImage: A('c014d152c355.webp'),
  high: [
    '¡Felicidades, estás en el camino correcto!',
    'Parece que conoces bastante sobre la Biblia, pero siempre hay algo nuevo por aprender.',
    'Con un poco más de profundidad, puedes alcanzar aún más claridad y comprensión.',
  ],
  low: [
    'Cada pregunta es una oportunidad para aprender.',
    'El universo de la Biblia es vasto y complejo, y puede ser difícil memorizar todos los detalles.',
    'Con el camino correcto, puedes alcanzar mucha más claridad y comprensión.',
  ],
  goodNews: '¿La buena noticia?',
  pitch: [
    'Entender la Biblia no tiene por qué ser una tarea difícil.',
    'La verdadera transformación ocurre cuando logras absorber las enseñanzas de Dios con simplicidad e intención.',
    'Y yo descubrí la forma más simple de hacerlo.',
  ],
  product: 'El nombre es Resumen Cronológico de la Biblia',
  button: 'Haga clic para descubrir cómo recibirlo',
}

export const OFFER = {
  title: 'Mira el video a continuación para descubrir el secreto para entender la Biblia.',
  headline: '¡Recibe ahora!',
  product: 'Resumen Cronológico',
  extra: '+ 9 regalos especiales',
  button: 'Haz clic aquí para asegurar tu material',
  bullets: ['Acceso inmediato', 'Garantía de 30 días'],
  perMonth: '/mes',
}

/**
 * Payment info under the button. The front is a MONTHLY subscription, so this must
 * never say "pago único" / "sin cuotas mensuales" (the owner's old image said so).
 */
export const PAYMENT_NOTE = {
  badge: '¡Acceso inmediato!',
  plan: 'Suscripción mensual',
  calm: '¡No te preocupes!',
  convert:
    'El valor se convertirá automáticamente a la moneda de tu país al hacer clic en «Haz clic aquí para asegurar tu material». Además, puedes pagar con métodos de pago locales en tu país.',
}
