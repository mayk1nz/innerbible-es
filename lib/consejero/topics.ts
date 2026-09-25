import type { IconName } from '@/components/icons'

// What people most often bring to the Consejero: grouped starters for members, and
// example answers (written by us, Reina-Valera 1960) for those who don't have it yet.

export interface TopicGroup {
  id: string
  label: string
  icon: IconName
  starters: string[]
}

export const TOPIC_GROUPS: TopicGroup[] = [
  {
    id: 'emociones',
    label: 'Lo que siento',
    icon: 'heart',
    starters: ['Me siento con mucha ansiedad', 'Estoy triste y sin ánimo', 'Tengo miedo del futuro', 'Me siento sola, me siento solo'],
  },
  {
    id: 'familia',
    label: 'Familia y relaciones',
    icon: 'users',
    starters: ['Tuve una pelea en casa', 'Me preocupan mis hijos', 'Mi matrimonio pasa por una crisis', 'Me cuesta perdonar a alguien'],
  },
  {
    id: 'fe',
    label: 'Mi fe',
    icon: 'book',
    starters: ['Siento a Dios lejos', 'No entiendo un pasaje de la Biblia', 'Tengo dudas de fe', 'Quiero aprender a orar mejor'],
  },
  {
    id: 'trabajo',
    label: 'Trabajo y dinero',
    icon: 'calendar',
    starters: ['Tengo deudas y no duermo', 'Perdí mi trabajo', 'Estoy agotado del trabajo', 'Quiero administrar mejor lo que tengo'],
  },
  {
    id: 'duelo',
    label: 'Pérdidas y duelo',
    icon: 'feather',
    starters: ['Perdí a alguien que amo', 'Recibí un diagnóstico difícil', 'Terminó una relación importante'],
  },
  {
    id: 'orar',
    label: 'Orar juntos',
    icon: 'sparkles',
    starters: ['Ora conmigo por mi familia', 'Quiero dar gracias a Dios', 'Una oración para dormir en paz'],
  },
]

export interface PainExample {
  id: string
  label: string
  icon: IconName
  question: string
  answer: string
}

/** Shown to members without Palabras del Señor: a taste of a real answer, cut before the end. */
export const PAIN_EXAMPLES: PainExample[] = [
  {
    id: 'ansiedad',
    label: 'Ansiedad',
    icon: 'heart',
    question: 'Estoy muy ansiosa por las deudas y no puedo dormir.',
    answer:
      'Gracias por contármelo. Cuando las cuentas no cierran, la mente no descansa, y es muy humano sentirse así. La Palabra dice: «Así que, no os afanéis por el día de mañana, porque el día de mañana traerá su afán. Basta a cada día su propio mal» (Mateo 6:34). Esta noche, antes de dormir, escribe en una hoja cada deuda y…',
  },
  {
    id: 'tristeza',
    label: 'Tristeza',
    icon: 'feather',
    question: 'Hace semanas que me siento triste y sin ganas de nada.',
    answer:
      'Lo que describes pesa mucho, y no es falta de fe. Dios no se aleja de quien está así: «Cercano está Jehová a los quebrantados de corazón; y salva a los contritos de espíritu» (Salmos 34:18). Cuando la tristeza dura tanto, hablar con un profesional o con tu pastor también es una forma en que Dios te cuida. Hoy te propongo un paso muy pequeño…',
  },
  {
    id: 'soledad',
    label: 'Soledad',
    icon: 'users',
    question: 'Me siento sola, como si a nadie le importara.',
    answer:
      'Esa sensación duele de verdad, y me alegra que la digas en voz alta. Dios te habla directamente a ti: «Y Jehová va delante de ti; él estará contigo, no te dejará, ni te desamparará; no temas ni te intimides» (Deuteronomio 31:8). Hoy puedes dar un paso: piensa en una persona a la que…',
  },
  {
    id: 'miedo',
    label: 'Miedo al futuro',
    icon: 'star',
    question: 'Perdí mi trabajo y tengo miedo de lo que viene.',
    answer:
      'Perder el trabajo sacude todo: la economía, los planes y hasta cómo nos vemos. Tu miedo es comprensible. Escucha esta promesa: «No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo; siempre te ayudaré, siempre te sustentaré con la diestra de mi justicia» (Isaías 41:10). Para hoy…',
  },
  {
    id: 'familia',
    label: 'Peleas en casa',
    icon: 'home',
    question: 'Discutí con mi hijo y le grité. Me siento fatal.',
    answer:
      'Que te duela es buena señal: te importa tu hijo y quieres hacerlo mejor. La Biblia da una clave sencilla: «La blanda respuesta quita la ira; mas la palabra áspera hace subir el furor» (Proverbios 15:1). No se trata de no fallar nunca, sino de volver. Esta noche podrías acercarte a él y decirle…',
  },
  {
    id: 'perdon',
    label: 'Perdonar',
    icon: 'sparkles',
    question: 'Me cuesta perdonar a mi hermano, me traicionó.',
    answer:
      'La traición de alguien cercano hiere profundo, y no es fácil soltarla. Perdonar no es decir que lo que pasó estuvo bien, ni volver a exponerte a más daño. Jesús lo enseñó así: «Y cuando estéis orando, perdonad, si tenéis algo contra alguno, para que también vuestro Padre que está en los cielos os perdone a vosotros vuestras ofensas» (Marcos 11:25). Un primer paso puede ser…',
  },
  {
    id: 'duelo',
    label: 'Duelo',
    icon: 'flame',
    question: 'Mi mamá murió hace un mes y no sé cómo seguir.',
    answer:
      'Lo siento mucho. Un mes es muy poco, y el amor que le tienes sigue ahí, por eso duele tanto. Jesús mismo lo dijo: «Bienaventurados los que lloran, porque ellos recibirán consolación» (Mateo 5:4). Llorar no es falta de fe; es amor. No tienes que atravesar esto sin compañía: tu comunidad de fe…',
  },
  {
    id: 'fe',
    label: 'Dios lejos',
    icon: 'book',
    question: 'Siento a Dios lejos y ya no tengo ganas de orar.',
    answer:
      'Les pasa a muchas personas que aman a Dios, incluso a grandes hombres y mujeres de la Biblia. La buena noticia es que el camino de vuelta es corto: «Acercaos a Dios, y él se acercará a vosotros» (Santiago 4:8). No hace falta una oración larga ni bonita. Hoy prueba esto: una sola frase, sincera…',
  },
]
