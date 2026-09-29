import type { IconName } from '@/components/icons'

// The owner's quiz, question for question, with its own illustrations (public/funil/quiz).
//
// Images: a question `image` shows above the title. Options with images render as a
// two-column grid of picture cards, or — with `thumbs` — as a list with a small
// picture on the left (for small illustrations such as the scroll and the book).

const A = (file: string) => `/funil/quiz/${file}`

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
  image: A('intro-rollo.webp'),
  button: 'Empezar el test',
}

export const TEST_INTRO = {
  title: '¡Ahora pongamos a prueba tu conocimiento sobre la Palabra de Dios!',
  text: 'Responde las siguientes preguntas.',
  image: A('inicio-test.webp'),
  button: 'Comenzar',
}

export const ANALYSIS_IMAGE = A('analisis.webp')

export const PROFILE: ProfileQuestion[] = [
  {
    kind: 'profile',
    id: 'conexion',
    eyebrow: 'Antes, queremos saber un poco más sobre ti.',
    title: '¿Cuál es la forma en que más sueles conectarte con la Palabra de Dios?',
    options: [
      { label: 'Lecturas, videos o predicaciones', image: A('conexion-videos.webp') },
      { label: 'Leyendo la Biblia / devocional', image: A('conexion-biblia.webp') },
      { label: 'Cultos y reuniones', image: A('conexion-culto.webp') },
      { label: 'No estoy logrando conectarme con Dios', image: A('conexion-distante.webp') },
    ],
  },
  {
    kind: 'profile',
    id: 'dificultad',
    title: '¿Qué parte de la Biblia te resulta difícil de entender?',
    image: A('dificultad.webp'),
    thumbs: true,
    options: [
      { label: 'Antiguo Testamento', image: A('antiguo-testamento.webp') },
      { label: 'Nuevo Testamento', image: A('nuevo-testamento.webp') },
    ],
  },
  {
    kind: 'profile',
    id: 'sentimiento',
    title: '¿Cómo te sientes al intentar entender la Biblia en su totalidad?',
    options: [
      { label: 'Ya lo intenté varias veces y me rendí', image: A('sentimiento-me-rendi.webp') },
      { label: 'Intento pero no lo consigo de ninguna manera', image: A('sentimiento-frustrada.webp') },
      { label: 'A veces confundido/a, pero la entiendo', image: A('sentimiento-confundido.webp') },
      { label: 'Tranquilo/a, pero siento que puedo mejorar', image: A('sentimiento-tranquila.webp') },
    ],
  },
  {
    kind: 'profile',
    id: 'freno',
    title: '¿Cuál es el mayor desafío que enfrentas cuando intentas leer la Biblia?',
    hint: 'Puedes seleccionar más de uno si es el caso',
    image: A('desafio-lectura.webp'),
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
    image: A('biblia-completa.webp'),
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
      { label: 'Cristiano', image: A('cristiano.webp') },
      { label: 'Cristiana', image: A('cristiana.webp') },
    ],
  },
  {
    kind: 'profile',
    id: 'edad',
    title: '¿Cuál es su edad?',
    options: [
      { label: '18 a 34', image: A('edad-18-34.webp') },
      { label: '35 a 44', image: A('edad-35-44.webp') },
      { label: '45 a 54', image: A('edad-45-54.webp') },
      { label: '55+', image: A('edad-55.webp') },
    ],
  },
]

export const TEST: TestQuestion[] = [
  {
    kind: 'test',
    id: 't1',
    title: '¿Quién derrotó a un gigante usando una honda y una piedra?',
    options: ['Josué', 'Moisés', 'David', 'Sansón'],
    optionImages: [A('t1-josue.webp'), A('t1-moises.webp'), A('t1-david.webp'), A('t1-sanson.webp')],
    correct: 2,
  },
  {
    kind: 'test',
    id: 't2',
    title: '¿Qué escena muestra a María, José y un bebé en un pesebre?',
    image: A('t2-natividad.webp'),
    options: ['La Transfiguración', 'La Natividad', 'La Anunciación', 'La Última Cena'],
    correct: 1,
  },
  {
    kind: 'test',
    id: 't3',
    title: '¿Qué batalla fue ganada por 300 hombres usando trompetas y antorchas?',
    options: ['La rebelión de Absalón', 'La batalla de Jericó', 'La conquista de Canaán', 'La batalla de Madián'],
    optionImages: [A('t3-absalon.webp'), A('t3-jerico.webp'), A('t3-canaan.webp'), A('t3-madian.webp')],
    correct: 3,
  },
  {
    kind: 'test',
    id: 't4',
    title: '¿Qué evento muestra los muros de una ciudad cayendo tras siete días de marcha?',
    image: A('t4-muros-jerico.webp'),
    options: ['La fundación de Jerusalén', 'La destrucción de Sodoma', 'La caída de Babilonia', 'La batalla de Jericó'],
    correct: 3,
  },
  {
    kind: 'test',
    id: 't5',
    title: '¿Qué promesa de Dios se simboliza con un arcoíris en el cielo?',
    image: A('t5-arcoiris-noe.webp'),
    options: ['El éxodo de Egipto', 'La creación', 'La venida de Jesús', 'El Pacto con Noé'],
    correct: 3,
  },
  {
    kind: 'test',
    id: 't6',
    title: '¿Qué profeta subió al cielo en un carro de fuego?',
    options: ['Elías', 'Ezequiel', 'Jeremías', 'Isaías'],
    optionImages: [A('t6-elias.webp'), A('profeta-ezequiel.webp'), A('t6-jeremias.webp'), A('profeta-isaias.webp')],
    correct: 0,
  },
  {
    kind: 'test',
    id: 't7',
    title: '¿Qué profeta tuvo la visión de un valle de huesos secos que revivían?',
    options: ['Oseas', 'Ezequiel', 'Daniel', 'Isaías'],
    optionImages: [A('t7-oseas.webp'), A('profeta-ezequiel.webp'), A('t7-daniel.webp'), A('profeta-isaias.webp')],
    correct: 1,
  },
  {
    kind: 'test',
    id: 't8',
    title: '¿Qué rey quemó un rollo con la profecía de Jeremías?',
    options: ['Josías', 'Manasés', 'Sedequías', 'Joacim'],
    optionImages: [A('t8-josias.webp'), A('t8-manases.webp'), A('t8-sedequias.webp'), A('t8-joacim.webp')],
    correct: 3,
  },
  {
    kind: 'test',
    id: 't9',
    title: '¿Qué personaje es conocido por su túnica de colores y por interpretar los sueños del faraón?',
    image: A('t9-jose.webp'),
    options: ['José', 'Eliseo', 'Moisés', 'Daniel'],
    correct: 0,
  },
  {
    kind: 'test',
    id: 't10',
    title: '¿Cuál fue el martirio del primer cristiano en el libro de los Hechos?',
    options: ['La decapitación de Juan el Bautista', 'El apedreamiento de Esteban', 'La muerte de Jacobo', 'La muerte de Pedro'],
    optionImages: [A('t10-juan-bautista.webp'), A('t10-esteban.webp'), A('t10-jacobo.webp'), A('t10-pedro.webp')],
    correct: 1,
  },
]

export const RESULT = {
  eyebrow: 'Resultados de tu Desafío Bíblico',
  image: A('resultado.webp'),
  productImage: A('producto.webp'),
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
  product: 'El nombre es Estudio Cronológico de la Biblia',
  button: 'Haga clic para descubrir cómo recibirlo',
}

export const OFFER = {
  title: 'Mira el video a continuación para descubrir el secreto para entender la Biblia.',
  headline: '¡Recibe ahora!',
  product: 'Estudio Cronológico de la Biblia',
  extra: '+ 8 regalos especiales y un regalo secreto',
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
