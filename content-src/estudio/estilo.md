# Guía de estilo — Estudio Cronológico de la Biblia

Para quienes redactan y revisan las lecciones de **La Biblia Interior**. Todo lo que dice esta guía lo comprueba (en parte) el validador:

```
node content-src/estudio/validar.mjs lecciones/mi-leccion.json   # 0 errores para entregar
node content-src/estudio/validar.mjs --texto "Génesis 22:8"      # texto exacto RV1909 para citar
node content-src/estudio/validar.mjs --xrefs genesis-12-50 20    # referencias cruzadas reales de la lección
```

Materiales de cada redactor: `maestra.json` (orden, pasajes y fechas: **no se tocan**), esta guía, `lib/content/estudio/types.ts` (campos y límites), las dos lecciones modelo (`lecciones/genesis-12-50.json` y `lecciones/pasion-y-muerte.json`), `glosario.json`, `personajes.json`, el texto RV1909 de los pasajes y sus referencias cruzadas. **Nada más.**

---

## 1. Para quién escribimos

Una abuela de 75 años que lee sin prisa, un padre cansado después del trabajo y un niño de 9 años sentado al lado de su madre. Católicos y evangélicos de toda América Latina. Todos deben entender **a la primera lectura**, sin diccionario.

La voz es la de un amigo que conoce bien la Biblia y la ama: cálida, clara, sin sermón y sin exhibir erudición. Todo se dice desde el amor de Cristo.

## 2. Reglas de redacción

| Regla | Detalle |
|---|---|
| **Frases cortas** | Máximo **20 palabras** por frase, en todos los campos (error del validador). Ideal: 10–14. Una idea por frase. |
| **Voz activa** | «Dios llama a Abram», no «Abram es llamado por Dios». |
| **Presente narrativo** | En `resumen` y `enUnMinuto`, contamos en presente: «Jesús ora en Getsemaní». Da vida al relato y simplifica los verbos. |
| **Tú** | Hablamos de **tú**, como todo el app. Nunca «usted». Plural: «ustedes». |
| **Vocabulario de 6.º grado** | Palabras de uso diario. Una palabra difícil necesaria (pacto, expiación, Sanedrín) va al campo `glosario` y debe existir en `glosario.json`. |
| **Legibilidad** | INFLESZ ≥ 65 («bastante fácil»); apunta a ≥ 75. El validador lo calcula. Las lecciones modelo dan 83 y 78. |
| **Concreto antes que abstracto** | Personas, lugares, gestos. «José llora y abraza a sus hermanos» antes que «la reconciliación familiar». |
| **Sin relleno** | Cada frase dice algo nuevo. Nada de «es importante destacar», «cabe señalar», «en este sentido». |
| **Números** | En letras hasta diez y cuando suenan mejor («setenta y cinco años»); en cifras para años y capítulos. |
| **Nombres** | Grafía moderna de la RVR1960 en nuestro texto: Jonatán, Ezequías, Betsabé, Senaquerib. La grafía de la RV1909 (Jonathán, Ezechîas) solo aparece dentro de citas. El apóstol y la carta: **Santiago** (la RV1909 dice «Jacobo»). |
| **Dios** | En nuestro texto: «Dios», «el Señor», «el Padre». **«Jehová» solo dentro de una cita** de la RV1909 (error del validador). Pronombres en minúscula, como en la RV1909 y la RVR1960 («Jesús lo mira»). |

### Palabras por reemplazar

| En vez de… | Escribe… |
|---|---|
| acontecimiento, suceso | hecho, lo que pasó |
| posteriormente | después |
| no obstante, sin embargo | pero, aun así |
| mediante | con, por medio de |
| por consiguiente | por eso |
| manifestar | mostrar |
| acontecer | pasar |
| prefigurar, tipología | anunciar, ser una imagen de, anticipo |
| vicario, sustitutivo | en lugar de |
| soberanía divina | Dios gobierna todo |
| escatológico | del final de los tiempos |
| teofanía | Dios se aparece |
| exégesis, hermenéutica | explicar, leer bien |
| paradigma, apoteosis | (no se usan) |

### Lista negra (el validador las rechaza)

`vibrante · inquebrantable · crucial · sublime · tapiz · apoteosis · prerrogativa · longanimidad · paradigma · aprehender · dilucidar · conminar · intrínseco · desvelar · vehemente · entrelazar · epistolar · magistral · trascendental · fascinante · impactante · resiliencia · empoderar · sinergia · épico · majestuoso · insondable · sin lugar a dudas · cabe destacar · es importante señalar · cabe señalar · un recordatorio / poderoso recordatorio · medio hermano · hermanastro · papista · romanista · secta · hereje / herejía · falsa iglesia · religión falsa · años de silencio · 4004 · 4000 a.C.`

**Vigilar** (aviso; casi siempre sobran): glorioso, profundamente, verdaderamente, asombroso, increíble, «no es solo… es», «más que un», «testimonio de», «en el corazón de», judaizante, protestante, iglesia romana.

Las palabras dentro de una cita bíblica entre «» no cuentan: si la RV1909 dice «Verdaderamente», se cita tal cual.

## 3. Cómo citar la Biblia

1. **Solo Reina-Valera 1909** (dominio público). Ninguna otra versión en el texto: ni RVR1960, ni NVI, ni NTV, ni la Biblia de Jerusalén. El campo opcional `versiculo.rvr1960` queda **vacío** hasta que el dueño decida sobre la licencia.
2. **Acentuación modernizada, y nada más.** Se cambia solo esto:
   - `á é ó ú` sueltas (preposición y conjunciones) → `a e o u`: «dió á su Hijo» → «dio a su Hijo».
   - Monosílabos que perdieron la tilde: fué → fue, fuí → fui, dió → dio, vió → vio, dí → di, ví → vi, pié(s) → pie(s), tí → ti.
   - Mayúsculas de comienzo de capítulo: «EMPERO Jehová» → «Empero Jehová»; «Salmo de David. JEHOVÁ es…» → «… Jehová es…».
   - **Todo lo demás se respeta**: «vosotros», «bendijeren», «contóselo», «crió» (= creó), «Jehová», la puntuación antigua. No se «mejora» el texto.
   - No escribas el versículo a mano: cópialo de `--texto`. El validador compara letra por letra.
3. **Versículo clave (`versiculo`)**: uno o dos versículos completos (≤ 40 palabras), del corazón de la lección y, si es posible, dentro de sus `pasajes`. En los Salmos, el título forma parte del versículo 1 en esta edición («Salmo de David. …»): mejor elegir otro versículo o citarlo entero.
4. **Citas dentro de nuestro texto**: entre comillas latinas «», literales de la RV1909 modernizada. Un fragmento corto basta: «Vete de tu tierra», «Consumado es». Las citas de 4 palabras o más se comprueban contra la RV1909 (aviso si no aparecen).
5. **Formato de referencia**: nombre completo del libro + capítulo:versículo, con guion.
   - `Génesis 22:8` · `Génesis 22:1-14` · `Lucas 22:39-23:56` · `Salmos 23` (capítulo entero) · `1 Reyes 18:36-39`.
   - Salmos: «Salmos 22:1» o «Salmo 22:1» (los dos valen). Cantar de los Cantares: «Cantares».
   - Sin abreviaturas (nada de «Gn», «Mt», «1 R»). En `rotulo` y títulos de rango se usa raya: «Génesis 12–50».
   - La versificación es la de la RV1909 de nuestros datos (coincide con la de la KJV): Joel tiene 3 capítulos, Malaquías 4.
6. **Pasajes y capítulos para leer** van en OSIS (`Gen.12.1-Gen.50.26`, `Gen.22`), nunca en español.

## 4. Cómo escribir las fechas

- **La fecha de cada lección viene de `maestra.json` y se copia tal cual.** Si crees que está mal, avisa al editor; no la cambies en la lección.
- Toda fecha lleva **«c.»** (circa) o un sello de certeza: `aprox` (aproximada), `debatida` (hay dos o más propuestas serias) o `incierta` (la Biblia no da datos).
- Formato: `c. 2100–1800 a.C.`, `c. 30 o 33 d.C.`, `Escrita c. 57 d.C.`. Raya (–) entre años, sin punto de miles, «a.C.» y «d.C.» sin espacios internos. Siglos en romanos: «siglo IX a.C.». No existe el año 0.
- **Hechos o escritura**: en la historia, la fecha es cuándo pasó; en las cartas, cuándo se escribió («Escrita c. 55 d.C.»). `fechaDe` en la tabla lo indica.
- Fechas discutidas con una línea honesta y sin polémica:
  - Creación y diluvio: **sin fecha**. «La Biblia no fecha la creación». Nunca 4004 ni 4000 a.C. como dato.
  - Éxodo: «c. 1446 o c. 1270 a.C.» (ordenamos con la primera).
  - Job, Joel, Abdías: «fecha incierta» + la propuesta principal.
  - La cruz: «c. 30 o 33 d.C.».
- En el cuerpo del texto, mejor fechas relativas: «unos cuatrocientos años después», «en tiempos del rey Josías».

## 5. Reglas ecuménicas y de tono

**Principio:** nada que un católico o un evangélico serio rechace. Revelamos las capas profundas del texto **por amor a Cristo**, sin confrontar a nadie.

1. **Nunca atacar** a una iglesia, denominación, tradición o institución, tampoco al pueblo judío. No hay «religión muerta», «tradiciones de hombres» aplicadas a iglesias de hoy, ni «falsa doctrina».
2. **Describir, no juzgar.** Donde católicos y evangélicos difieren de verdad, una `notaEcumenica` neutral (≤ 40 palabras) que diga qué hace cada uno, sin decir quién tiene razón. Temas típicos: el canon (73 / 66 libros), las partes griegas de Ester y Daniel, los «hermanos del Señor», los libros deuterocanónicos en «Entre los Testamentos».
3. **Nombres que unen.** «Pacto» en el texto (el glosario explica «alianza»); «la Cena del Señor (Eucaristía, Santa Cena)»; «la Iglesia» = todos los que siguen a Jesús.
4. **Biblia y tradición, separadas.** Lo que dice el texto: «Juan 19:26 dice…». Lo que dice la tradición: «la tradición atribuye este Evangelio a Juan». Nunca presentes una tradición como dato bíblico, ni la niegues.
5. **María** con respeto y ateniéndose al texto: madre de Jesús, mujer de fe, presente en la cruz y en Pentecostés. Ni títulos dogmáticos ni frases que los nieguen.
6. **El pueblo judío.** Nunca «los judíos mataron a Jesús». Nombra a los responsables concretos (los jefes de los sacerdotes, Pilato, los soldados) y recuerda que Jesús entregó su vida por los pecados de **todos**. Los fariseos no son caricatura: Nicodemo y Gamaliel también eran fariseos. El Antiguo Testamento no está «superado»: se **cumple** en Cristo.
7. **Lecturas diversas.** Apocalipsis, el milenio, el fin de los tiempos, creación y ciencia: di lo que todos comparten («Cristo vence») y añade «hay varias maneras de leerlo».
8. **Sin moralismo.** La gracia va primero: Dios salva y después enseña a vivir. No «Dios te ama si obedeces».
9. **Temas duros con delicadeza** (Isaac en Moriah, la cruz, la violencia en Jueces): lo que pasó, sin detalles crudos, siempre con la luz de Dios. Pensemos en el niño de 9 años.

### Ejemplos ecuménicos

| Evitar | Escribir |
|---|---|
| «Judas, medio hermano de Jesús, escribió esta carta.» | «El autor se llama a sí mismo "hermano de Jacobo" (Judas 1).» |
| «Los católicos añadieron libros a la Biblia.» | «Las Biblias católicas incluyen siete libros más del Antiguo Testamento; las evangélicas, no.» |
| «Durante 400 años de silencio, Dios no habló.» | «Después de Malaquías no aparecen nuevos profetas en la Biblia hebrea. Las Biblias católicas incluyen libros de esta época, como los Macabeos.» |
| «Jesús vino a acabar con la religión.» | «Jesús nos invita a una relación viva con el Padre.» |
| «La Santa Cena es solo un símbolo.» / «La Eucaristía es…» (dogma) | «Jesús dejó la Cena del Señor para que lo recordemos. Las iglesias la celebran con distintos nombres.» |

## 6. Cómo NO copiar el molde (ni a nadie)

- **No abras el PDF del molde mientras escribes.** Los hechos son de la Biblia; las palabras son nuestras.
- No copies ni parafrasees de cerca comentarios, Biblias de estudio, la Thompson, notas de la RVR1960 o la NVI, ni Wikipedia. Los datos (fechas, lugares) son libres; la redacción no.
- No imites sus fórmulas: nada de terminar con «X nos recuerda que…», ni de títulos como «Un tapiz de…», ni de listas de «lecciones que aprendemos».
- No uses nombres ni números de cadenas de la Thompson: nuestras `cadenas` son propias.
- El revisor anti-copia compara trigramas: menos del 5 % en común con el molde por lección, y ninguna cita larga de versiones con derechos.

## 7. Campo por campo

Límites exactos en `LIMITES` (`lib/content/estudio/types.ts`).

| Campo | Qué es | Límite | Consejo |
|---|---|---|---|
| `enUnMinuto` | 3 frases: **qué pasa · lo esencial · qué revela de Dios** | 3 frases, ≤ 60 palabras | Si solo lee esto, ¿entiende la lección? |
| `versiculo` | Texto RV1909 + referencia | ≤ 40 palabras | Copiar de `--texto`. |
| `fecha` | Copia de la tabla maestra | — | No se edita. |
| `fechaEscrito`, `autor` | Solo si la lección abre la ficha de un libro | ≤ 12 / ≤ 15 (+ nota ≤ 25) | «Tradicionalmente…» cuando es tradición. |
| `lugar` | Lugar principal + mapa (id de la era) | ≤ 6 palabras | «Canaán y Egipto». |
| `personajes` | Quién es y por qué importa **aquí** | 3–7, ≤ 12 palabras | El `id` debe existir en `personajes.json`; si falta, añádelo allí con sus lecciones. |
| `eventos` | Hechos clave en orden, con referencia | 3–6, ≤ 10 palabras | La referencia debe estar dentro de los pasajes. |
| `resumen` | 3–6 momentos: subtítulo + texto | subtítulo ≤ 5, texto ≤ 60, total 220–380 (breve: 120–200) | Cuenta la historia en orden; cada momento termina con algo que empuja al siguiente. |
| `otraMirada` | Qué añade cada libro paralelo (Samuel/Reyes × Crónicas, los Evangelios) | ≤ 4, ≤ 30 palabras | `libro` en OSIS («Matt»). |
| `jesusAqui` | Promesa, figura o cumplimiento + 1–2 referencias | ≤ 60 palabras | En el AT, al menos una referencia del NT. Sin forzar alegorías. |
| `mundo` | «Mientras tanto en el mundo…» | ≤ 40 palabras | Un dato histórico seguro, no una curiosidad dudosa. |
| `antes` / `despues` | Lo que vino antes / lo que viene | ≤ 20 cada uno | Deben encajar con la lección vecina. |
| `conexiones` | Ecos reales en otros libros | 2–4, motivo ≤ 15 | Solo de `--xrefs` (OpenBible); el validador lo exige. Motivo con palabras nuestras. |
| `glosario` | ids de términos usados en el texto | 2–5 | El término debe aparecer en la lección. |
| `paraTuVida` | 1 acción concreta + 1 pregunta personal | ≤ 40 palabras en total | Acción que se pueda hacer esta semana. |
| `meditar` | Oración breve en primera persona | ≤ 30 palabras | Termina en «Amén.» |
| `ninos` | Pregunta + actividad sencilla | ≤ 20 cada una | Dibujar, contar, representar; con materiales de casa. |
| `quiz` | 3 preguntas: fácil, media y de conexión | pregunta ≤ 18, opción ≤ 8, explicación ≤ 20 | Respuesta que se deduce de la lección; distractores creíbles; sin «todas las anteriores»; cambia la posición de la correcta. |
| `leer` | 2–7 capítulos clave (OSIS) + minutos | minutos a 140 palabras/min | El validador calcula los minutos. |
| `notaEcumenica` | Diferencia real, neutral | ≤ 40 palabras | Solo cuando hace falta. |
| `temas` | 3–6 slugs | kebab-case | Reutiliza los existentes: fe, promesa, pacto, perdon, providencia, cruz, amor-de-dios, cordero, sufrimiento, profecia-cumplida, oracion, obediencia, esperanza, reino-de-dios, espiritu-santo, familia, sabiduria, arrepentimiento, gracia, resurreccion. |
| `cadenas` | 1–2 hilos de «Sigue el hilo» | kebab-case | Ej.: el-cordero, la-promesa-a-abraham, el-siervo-sufriente, el-rey-de-david, el-templo, el-pacto-nuevo, el-espiritu, el-pastor. Propón nuevas si hace falta; el lote transversal las unifica. |

## 8. Diez ejemplos «antes → después»

1. **Frase inflada**
   - Antes: «En este vibrante relato desfilan personajes cuyas vidas se entrelazan con un propósito mayor que revela la inquebrantable fidelidad divina.»
   - Después: «Dios es fiel de padres a hijos. Lo vemos en Abraham, en Isaac y en Jacob.»
2. **Voz pasiva**
   - Antes: «La promesa fue recibida por Abraham y posteriormente fue transmitida a su descendencia.»
   - Después: «Abraham recibe la promesa y la pasa a sus hijos.»
3. **Palabra difícil sin ayuda**
   - Antes: «El holocausto prefigura la expiación vicaria de Cristo.»
   - Después: «En el altar, un animal moría en lugar del culpable. Esa imagen nos ayuda a entender la cruz.»
4. **Fecha como dato**
   - Antes: «La creación ocurrió en el año 4000 a.C.»
   - Después: «La Biblia no da una fecha para la creación.»
5. **Fecha discutida sin aviso**
   - Antes: «Israel salió de Egipto en 1446 a.C.»
   - Después: «Israel salió de Egipto c. 1446 a.C. Otros estudiosos proponen c. 1270 a.C.»
6. **Culpa colectiva**
   - Antes: «Los judíos mataron a Jesús.»
   - Después: «Los jefes de los sacerdotes lo acusaron y Pilato lo entregó. Jesús dio su vida por los pecados de todos.»
7. **Moralismo**
   - Antes: «Levítico enseña que la presencia de Dios depende de nuestra obediencia.»
   - Después: «Levítico muestra que Dios quiere vivir con su pueblo. Por eso le da un camino para el perdón.»
8. **Final genérico**
   - Antes: «Este libro nos recuerda que Dios es fiel.»
   - Después: «Esta semana, cuando algo salga mal, repite: "Dios lo encaminó a bien" (Génesis 50:20).» (En el JSON, la cita va entre «».)
9. **Usted y tono de sermón**
   - Antes: «Usted debe reflexionar seriamente sobre su condición espiritual.»
   - Después: «¿En qué parte de tu vida necesitas volver a confiar en Dios?»
10. **Calco y sentido cambiado**
    - Antes: «José decidió casarse con María discretamente.» (Mateo 1:19 dice lo contrario)
    - Después: «José pensó dejar a María en secreto. Un ángel le dijo que no tuviera miedo.»

## 9. Antes de entregar

1. `node content-src/estudio/validar.mjs lecciones/<id>.json` → **0 errores**. Lee cada aviso y resuélvelo o justifícalo.
2. Relee cada afirmación con el texto RV1909 de los pasajes abierto: nombres, números, quién dijo qué, en qué orden.
3. Lee la lección en voz alta. Si una frase te hace tomar aire dos veces, córtala.
4. Pregúntate: ¿la entendería mi abuela? ¿La disfrutaría un niño con sus padres? ¿La firmarían juntos un sacerdote católico y un pastor evangélico?
5. Si añadiste personajes o términos, están en `personajes.json` / `glosario.json` y el validador de la tabla (`--maestra`) da 0 errores.
