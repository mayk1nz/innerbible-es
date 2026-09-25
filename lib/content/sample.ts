import type { LessonContent } from '../catalog'

// Sample content so the reader can be judged with real text in it. The final copy
// comes from the owner; replacing these two objects is all it takes.

export const COMIENZA_AQUI: LessonContent = {
  resumen: [
    'Bienvenido. Este recorrido te lleva por toda la historia bíblica en el orden en que sucedió, desde «En el principio» hasta la promesa de un cielo nuevo y una tierra nueva.',
    'Cada resumen tiene siempre la misma estructura, para que sepas dónde estás: la fecha aproximada de los acontecimientos, el autor tradicionalmente atribuido, el período y los personajes principales, un versículo clave y un resumen claro y fiel al texto.',
    'Cada lectura toma pocos minutos. Al terminar, márcala como leída: así ves tu avance, mantienes tu racha y sabes siempre por dónde continuar.',
    'Nuestro deseo es que, al final del camino, veas la Biblia como una sola historia: el plan de Dios para rescatar a la humanidad por medio de Jesucristo.',
  ],
  meditar: 'Antes de empezar, dile a Dios con tus propias palabras qué esperas encontrar en este recorrido.',
}

export const GENESIS: LessonContent = {
  fecha: 'De la creación hasta la muerte de José (c. 1805 a. C.)',
  autor: 'Tradicionalmente atribuido a Moisés',
  periodo: 'Los orígenes y los patriarcas: Adán y Eva, Noé, Abraham, Isaac, Jacob y José',
  versiculo: { texto: 'En el principio creó Dios los cielos y la tierra.', referencia: 'Génesis 1:1' },
  resumen: [
    'Génesis es el libro de los comienzos. Dios crea el universo con su palabra y forma al ser humano a su imagen, para vivir en comunión con Él.',
    'La desobediencia de Adán y Eva rompe esa comunión, y el pecado se extiende por la humanidad hasta el diluvio. Aun así, Dios preserva a Noé y a su familia y renueva su pacto con la creación.',
    'Después, Dios llama a Abraham y le promete una descendencia, una tierra y una bendición para todas las familias de la tierra. Esa promesa pasa a Isaac y a Jacob, a quien Dios llama Israel.',
    'El libro termina con José en Egipto: vendido por sus hermanos, levantado por Dios y usado para salvar a su familia del hambre. Lo que otros planearon para mal, Dios lo encaminó para bien.',
  ],
  meditar: '¿En qué parte de tu historia necesitas creer, como José, que Dios puede encaminar las cosas para bien?',
}

/** A plan day (Palabras del Señor): reading, small task of the day, practical steps. */
export const TRANSFORMACION_DIA_1: LessonContent = {
  versiculo: { texto: 'Crea en mí, oh Dios, un corazón limpio, y renueva un espíritu recto dentro de mí.', referencia: 'Salmo 51:10' },
  resumen: [
    'Toda transformación verdadera empieza en el corazón. David escribió este salmo después de fallar, y no le pidió a Dios que lo hiciera perfecto: le pidió un corazón nuevo.',
    'Estos 90 días no se tratan de esforzarte más, sino de abrirle a Dios, día a día, cada rincón de tu vida. Él es quien renueva; a ti te toca estar dispuesto.',
  ],
  tarea: 'Escribe en una hoja tres áreas de tu vida que quieres poner en las manos de Dios durante estos 90 días.',
  practica: [
    'Lee el Salmo 51 completo, despacio y en voz baja.',
    'Dedica cinco minutos de silencio a hablar con Dios sobre esas tres áreas.',
    'Guarda la hoja en un lugar seguro: la volverás a leer en el Día 90.',
  ],
  meditar: '¿Qué parte de tu corazón quieres que Dios renueve primero?',
}
