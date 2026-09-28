// Writes content-src/guias/palabras-senor/indice.json: the Guía Palabras del Señor, 104 real
// situations in 13 parts (docs/entregaveis/09-palabras-del-senor.md), plus the opening and
// the closing. Ids come from the titles.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const slug = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/^cuando\s+/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .split('-')
    .slice(0, 8)
    .join('-')

const PARTES = [
  ['perdon-y-heridas', 'Perdón y heridas', [
    'Cuando no puedo perdonar a quien me hirió', 'Cuando no logro perdonarme a mí mismo', 'Cuando me piden perdón y no sé si creerles',
    'Cuando necesito pedir perdón', 'Cuando el rencor vuelve una y otra vez', 'Cuando me traiciona alguien cercano',
    'Cuando cargo heridas de mi infancia', 'Cuando me hirieron en la iglesia',
  ]],
  ['emociones', 'Emociones', [
    'Cuando la ira me domina', 'Cuando la ansiedad no me deja en paz', 'Cuando vivo con miedo', 'Cuando la tristeza no se va',
    'Cuando creo que tengo depresión', 'Cuando estoy agotado por dentro', 'Cuando siento envidia', 'Cuando los celos me quitan la paz',
  ]],
  ['identidad', 'Identidad y autoestima', [
    'Cuando no me gusta quien soy', 'Cuando me siento incapaz', 'Cuando me comparo con los demás', 'Cuando me rechazan o me abandonan',
    'Cuando cometo el mismo error otra vez', 'Cuando me siento vacío', 'Cuando me siento solo', 'Cuando necesito que todos me aprueben',
  ]],
  ['pareja', 'Matrimonio y pareja', [
    'Cuando peleamos todo el tiempo', 'Cuando el amor parece enfriarse', 'Cuando mi pareja no comparte mi fe',
    'Cuando hubo infidelidad', 'Cuando el dinero nos divide', 'Cuando busco pareja y quiero elegir bien',
    'Cuando estoy soltero y espero', 'Cuando la tentación amenaza mi matrimonio',
  ]],
  ['familia', 'Hijos y familia', [
    'Cuando mi hijo se aleja o se rebela', 'Cuando quiero enseñar la fe a mis hijos', 'Cuando mis padres son difíciles',
    'Cuando mi familia no entiende mi fe', 'Cuando hay peleas constantes en casa', 'Cuando necesito poner límites',
    'Cuando cuido a mis padres ancianos', 'Cuando vivo lejos de mi familia',
  ]],
  ['amistades', 'Amistades y convivencia', [
    'Cuando una amistad me aleja de Dios', 'Cuando tengo que confrontar a alguien', 'Cuando siento que me utilizan',
    'Cuando hablan mal de mí', 'Cuando soy yo quien habla mal de otros', 'Cuando convivo con alguien difícil',
    'Cuando me cuesta hacer amigos', 'Cuando las redes sociales me roban la paz',
  ]],
  ['trabajo', 'Trabajo y propósito', [
    'Cuando odio mi trabajo', 'Cuando mi jefe es injusto', 'Cuando pierdo el trabajo', 'Cuando fracaso en lo que emprendo',
    'Cuando no sé cuál es mi propósito', 'Cuando me siento estancado', 'Cuando tengo miedo de volver a intentarlo',
    'Cuando me piden hacer algo incorrecto',
  ]],
  ['dinero', 'Dinero y provisión', [
    'Cuando el dinero no alcanza', 'Cuando vivo endeudado', 'Cuando temo por mi futuro económico', 'Cuando me va bien y me alejo de Dios',
    'Cuando no sé administrar lo que tengo', 'Cuando quiero dar pero tengo poco', 'Cuando me tienta el dinero fácil',
    'Cuando nunca me parece suficiente',
  ]],
  ['decisiones', 'Decisiones y dirección', [
    'Cuando tengo que tomar una decisión importante', 'Cuando no sé qué camino elegir', 'Cuando una puerta se cierra',
    'Cuando me toca esperar', 'Cuando pienso en mudarme o emigrar', 'Cuando quiero empezar algo nuevo',
    'Cuando recibo consejos que se contradicen', 'Cuando me presionan para decidir ya',
  ]],
  ['fe', 'Fe y vida espiritual', [
    'Cuando oro y parece que Dios no responde', 'Cuando mi fe está débil', 'Cuando me siento lejos de Dios',
    'Cuando solo oro en los problemas', 'Cuando tengo dudas sobre Dios', 'Cuando no tengo tiempo para Dios',
    'Cuando me cuesta leer la Biblia', 'Cuando me canso del camino cristiano',
  ]],
  ['tentacion', 'Tentación y hábitos', [
    'Cuando lucho con un pecado oculto', 'Cuando caigo siempre en la misma tentación', 'Cuando me siento sucio por dentro',
    'Cuando justifico lo que sé que está mal', 'Cuando una adicción me domina', 'Cuando pierdo el control con la comida o las compras',
    'Cuando la pereza me gana', 'Cuando me descubro mintiendo',
  ]],
  ['dolor', 'Dolor, enfermedad y pérdida', [
    'Cuando muere alguien que amo', 'Cuando estoy enfermo hace mucho tiempo', 'Cuando alguien que amo está enfermo',
    'Cuando perdí un embarazo', 'Cuando envejezco y me siento inútil', 'Cuando sufro una injusticia',
    'Cuando sufro y no entiendo por qué', 'Cuando pienso que ya no hay salida',
  ]],
  ['hacedor', 'Vivir como hacedor de la Palabra', [
    'Cuando sé lo correcto pero no lo hago', 'Cuando sigo actuando como antes', 'Cuando me siento hipócrita',
    'Cuando se burlan de mi fe', 'Cuando me da vergüenza mi fe', 'Cuando quiero servir y no sé cómo',
    'Cuando quiero hablar de Jesús sin pelear', 'Cuando quiero una fe verdadera',
  ]],
]

const secciones = [
  { id: 'comienza-aqui', titulo: 'Comienza aquí', lecciones: [{ id: 'como-usar-esta-guia', titulo: 'Cómo usar esta guía', subtitulo: 'Siete pasos para vivir la Palabra' }] },
  ...PARTES.map(([id, titulo, sits]) => ({ id, titulo, lecciones: sits.map((t) => ({ id: slug(t), titulo: t })) })),
  { id: 'cierre', titulo: 'Cierre', lecciones: [{ id: 'hacedores-de-la-palabra', titulo: 'Hacedores de la Palabra', subtitulo: 'Quien oye entiende; quien practica se transforma' }] },
]

const ids = secciones.flatMap((s) => s.lecciones.map((l) => l.id))
const dup = ids.filter((x, i) => ids.indexOf(x) !== i)
if (dup.length) throw new Error('ids repetidos: ' + dup.join(', '))
const n = PARTES.reduce((a, p) => a + p[2].length, 0)
if (n !== 104) throw new Error(`${n} situações (esperava 104)`)
fs.writeFileSync(path.join(HERE, 'indice.json'), JSON.stringify({ guia: 'palabras-senor', secciones }, null, 2) + '\n')
console.log(`indice.json: ${n} situações em ${PARTES.length} partes (+ abertura e fechamento)`)
