// Demo community shown while the app has no backend. Every name and text here is
// invented — nothing comes from real members of any app. Replaced by the database.

export interface SeedComment {
  author: string
  text: string
  ageMin: number
}

export interface SeedPost {
  id: string
  author: string
  text: string
  ageMin: number
  likes: number
  lessonKey?: string
  comments: SeedComment[]
}

export interface SeedMember {
  name: string
  weekPoints: number
  streak: number
}

export interface SeedReflection {
  author: string
  text: string
  ageMin: number
}

export const SEED_POSTS: SeedPost[] = [
  {
    id: 'seed-1',
    author: 'Rosa Elena Quispe',
    text: 'Terminé Génesis hoy. Leerlo en orden cambia todo: la promesa a Abraham se entiende de otra forma.',
    ageMin: 42,
    likes: 12,
    lessonKey: 'cronologico/genesis',
    comments: [{ author: 'Javier Herrera', text: 'Amén. A mí me pasó lo mismo con Éxodo.', ageMin: 20 }],
  },
  {
    id: 'seed-2',
    author: 'Javier Herrera',
    text: 'Voy por el día 9 de racha. Escuchar el audio camino al trabajo me está ayudando muchísimo.',
    ageMin: 190,
    likes: 8,
    comments: [],
  },
  {
    id: 'seed-3',
    author: 'Lucía Fernández',
    text: 'No sabía que Job se ubica tan temprano en la historia. ¿Alguien más se sorprendió?',
    ageMin: 610,
    likes: 15,
    lessonKey: 'cronologico/job',
    comments: [
      { author: 'Tomás Aguilar', text: 'Sí, yo tampoco. Cambia cómo lo leo.', ageMin: 540 },
      { author: 'Beatriz Salazar', text: '¡Me pasó igual!', ageMin: 500 },
    ],
  },
  {
    id: 'seed-4',
    author: 'Tomás Aguilar',
    text: 'Pido oración por mi familia. Estamos pasando un tiempo difícil, pero confiamos en Él.',
    ageMin: 1500,
    likes: 23,
    comments: [{ author: 'Carmen Ríos', text: 'Orando por ustedes, hermano.', ageMin: 1400 }],
  },
  {
    id: 'seed-5',
    author: 'Beatriz Salazar',
    text: 'Hoy entendí que la Biblia no son historias sueltas: es una sola historia que apunta a Jesús.',
    ageMin: 2900,
    likes: 21,
    comments: [],
  },
  {
    id: 'seed-6',
    author: 'Gabriela Núñez',
    text: 'Empecé con mi hija las actividades para niños. Le encantaron.',
    ageMin: 4300,
    likes: 9,
    comments: [],
  },
]

export const SEED_MEMBERS: SeedMember[] = [
  { name: 'Beatriz Salazar', weekPoints: 180, streak: 21 },
  { name: 'Javier Herrera', weekPoints: 150, streak: 9 },
  { name: 'Rosa Elena Quispe', weekPoints: 140, streak: 14 },
  { name: 'Carmen Ríos', weekPoints: 120, streak: 30 },
  { name: 'Lucía Fernández', weekPoints: 95, streak: 5 },
  { name: 'Andrés Morales', weekPoints: 80, streak: 12 },
  { name: 'Tomás Aguilar', weekPoints: 60, streak: 3 },
  { name: 'Gabriela Núñez', weekPoints: 55, streak: 4 },
  { name: 'Esteban Ruiz', weekPoints: 40, streak: 2 },
  { name: 'Mariela Castro', weekPoints: 30, streak: 6 },
  { name: 'Samuel Paredes', weekPoints: 25, streak: 1 },
  { name: 'Isabel Montoya', weekPoints: 15, streak: 1 },
]

export const SEED_REFLECTIONS: Record<string, SeedReflection[]> = {
  'cronologico/genesis': [
    { author: 'Carmen Ríos', text: 'Nunca había visto que la promesa a Abraham ya apuntaba a Jesús. Leerlo en orden me ayudó mucho.', ageMin: 180 },
    { author: 'Andrés Morales', text: 'La historia de José me tocó hoy. Lo que parecía el final era parte del plan.', ageMin: 1300 },
  ],
  'cronologico/comienza-aqui': [
    { author: 'Mariela Castro', text: 'Le pedí a Dios constancia. Quiero terminar este recorrido.', ageMin: 3000 },
  ],
}
