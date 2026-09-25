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