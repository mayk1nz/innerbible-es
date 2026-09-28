# Presente 6 — "Los 43 Milagros de Jesús"

*Análise feita em 28/09/2026. Molde: `Apps - Daniel asafh/entregaveis front/regalo 6 - Los-43-Milagros-de-Jesus.pdf` (34 MB, 44 páginas). Texto extraído com PyMuPDF. As 44 páginas foram lidas integralmente e as ilustrações foram vistas numa prancha de contato. No app, o produto é `milagros-jesus` em `lib/catalog.ts`, hoje com `pendingGuide()`.*

> Regra de direitos autorais: o PDF serve **só** como referência de tema e formato. Nenhuma frase, título de entrada, "Significado" nem ilustração dele entra no app. Todo o texto abaixo é nosso.

---

## 1. O que é

### Formato físico
- **44 páginas** em formato vertical 900×1600 (9:16, tamanho de "story"). São 1 capa e 43 páginas, uma para cada milagre. Não tem índice, página de introdução nem conclusão, os números de página não aparecem e o PDF não tem marcadores/TOC.
- **34 MB**, porque cada página traz 3 imagens (um fundo 2400×1600, uma textura e a ilustração). Pesa muito para quem baixa com dados móveis na América Latina.
- Metadados: gerado com `pdf-lib` em 31/08/2025, sem título nem autor.

### Visual
- **Capa:** foto de banco de imagens de uma Bíblia aberta em tons azulados, título em azul-petróleo com o emoji "📘" dentro do título.
- **Página de milagre:** uma ilustração IA no topo (≈25% da altura), o título numerado em azul-petróleo com serifa, o bloco "**Referencia:**", depois o texto e "👉 **Significado:**". Cerca de **50% da página fica em branco**. A letra é pequena para a tela do celular (corpo ≈ 14 px numa página de 1600 px).
- **Ilustrações:** fotorrealistas, em tons azul/cinza, com um Jesus de rosto diferente a cada página. Há **anacronismos e imagens impróprias** (lista na seção 2).

### Campos por milagre
Só **3 campos**: `Título` · `Referencia` (colada sem quebra no início da narrativa) · `Significado` (1–2 frases). Não traz local, época, categoria, versículo citado, aplicação, oração nem versão infantil.

O tamanho do texto **cai ao longo do arquivo**: a entrada 1 tem ≈ 609 caracteres e a 40 tem ≈ 188. Da metade para o fim a "história" é uma frase só (ex.: nº 29: "Diez fueron sanados, pero solo uno regresó para agradecer").

### Lista coberta (numeração do PDF)
| # | Entrada do PDF | Referência dada | Observação |
|---|---|---|---|
| 1 | Agua en vino | Jn 2:1-11 | ok |
| 2 | Hijo del oficial del rey | Jn 4:46-54 | ok |
| 3 | "Pesca milagrosa en Capernaúm" | Lc 5:1-11 | o lugar é o lago de Genesaret (Lc 5:1), não Cafarnaum |
| 4 | Espíritu inmundo en Capernaum | Mc 1:21-28; Lc 4:31-37 | ok (grafia de Cafarnaum inconsistente com o nº 3) |
| 5 | Suegra de Pedro | Mt/Mc/Lc | ok |
| 6 | Muchos enfermos y endemoniados | Mt 8:16-17 e par. | **resumo**, não é um milagre individual |
| 7 | Leproso | Mt/Mc/Lc | ok |
| 8 | Paralítico en Capernaúm | Mt/Mc/Lc | ok |
| 9 | Siervo del centurión | Mt 8; Lc 7 | ok |
| 10 | Hijo de la viuda de Naín | Lc 7:11-17 | ok |
| 11 | "Acalmando la tormenta" | Mt/Mc/Lc | "acalmar" é portunhol (em espanhol: *calmar*) |
| 12 | Endemoniado gadareno | Mt/Mc/Lc | ok |
| 13 | Mujer con flujo de sangre | Mt/Mc/Lc | ok |
| 14 | Hija de Jairo | Mt/Mc/Lc | ok |
| 15 | Dos ciegos | Mt 9:27-31 | ok |
| 16 | Mudo endemoniado | Mt 9:32-34 | ok |
| 17 | Paralítico de Betesda | Jn 5:1-15 | ok |
| 18 | Cinco mil | 4 evangelhos | ok |
| 19 | Camina sobre el mar | Mt/Mc/Jn | ok |
| 20 | Hija de la cananea | Mt 15; Mc 7 | ok |
| 21 | Cuatro mil | Mt 15; Mc 8 | ok |
| 22 | Ciego en Betsaida | Mc 8:22-26 | ok |
| 23 | Joven poseído | Mt/Mc/Lc | ok |
| 24 | Moneda en el pez | Mt 17:24-27 | ok |
| 25 | Ciego de nacimiento | Jn 9 | ok |
| 26 | Mujer encorvada | Lc 13:10-17 | ok |
| 27 | Hidropesía | Lc 14:1-6 | ok |
| 28 | Lázaro | Jn 11 | ok |
| 29 | Diez leprosos | Lc 17:11-19 | ok |
| 30 | Dos ciegos cerca de Jericó | Mt 20:29-34 | mesmo episódio que 31 e 38 |
| 31 | Bartimeo | Mc 10:46-52 | **duplicado** do mesmo episódio (Jericó) |
| 32 | "Resurrección de un hijo en Capernaum" | "Relatos en tradiciones paralelas" | **INVENTADO**, não existe nos evangelhos |
| 33 | Higuera estéril | Mt 21; Mc 11 | ok (fora de ordem) |
| 34 | Siervo del sumo sacerdote (Malco) | Lc 22:50-51; Jn 18:10-11 | só Lucas narra a cura; faltam Mt 26:51 e Mc 14:47 |
| 35 | Segunda pesca | Jn 21:1-14 | pós-ressurreição, mas vem **antes** da ressurreição (nº 43) |
| 36 | "Liberación de una joven endemoniada" | "Tradición en algunos evangelios paralelos" | **INVENTADO/vago**. Talvez uma confusão com Atos 16:16-18 (Paulo, não Jesus) ou uma duplicata do nº 20 |
| 37 | Sordomudo | Mc 7:31-37 | fora de ordem (deveria vir antes do nº 21) |
| 38 | Ciego en Jericó | Lc 18:35-43 | **duplicado** (3º registro de Jericó) |
| 39 | Endemoniado ciego y mudo | Mt 12:22-23 | fora de ordem; falta o paralelo Lc 11:14 |
| 40 | "Ciego en etapas" | Mc 8:22-26 | **duplicata exata** do nº 22 |
| 41 | Resurrección de santos | Mt 27:51-53 | não é um milagre feito por Jesus durante o ministério. Ilustração imprópria |
| 42 | Sanaciones en el templo | Mt 21:14 | **resumo**; cronologicamente anterior ao nº 34 |
| 43 | Resurrección de Jesús | 4 evangelhos | é o grande sinal, mas não um "milagre feito por Jesus" no mesmo sentido |

### A contagem: qual critério dá 43?
**Nenhum critério coerente.** As contagens clássicas de milagres individuais realizados por Jesus nos evangelhos ficam entre **~35 e ~37**, conforme se contem ou não a Transfiguração, a cura de Malco, Jo 18:6 etc. Por evangelho: **Mateus 20, Marcos 18, Lucas 20, João 8** (7 "sinais" + a pesca de Jo 21). A alimentação dos 5 mil é o único milagre antes da Páscoa que aparece nos quatro.

A conta que chega a 43 no PDF é esta:

| Composição do "43" do concorrente | Qtde. |
|---|---|
| Milagros individuais distintos (dos 35 clássicos, só **falta a mão ressequida**) | 34 |
| Resumos de muitas curas contados como milagre (nº 6, 42) | +2 |
| O episódio de Jericó contado 3× (nº 30, 31, 38) | +2 |
| Duplicata literal (nº 40 = nº 22) | +1 |
| Entradas inventadas, sem base bíblica (nº 32, 36) | +2 |
| Sinais que não são milagres de Jesus no ministério (nº 41 santos, nº 43 ressurreição) | +2 |
| **Total** | **43** |

Ou seja, o número 43 foi atingido com enchimento. **9 das 43 entradas (21%)** são duplicatas, resumos ou invenções.

---

## 2. Falhas e brechas

### Graves (credibilidade e fé)
1. **Dois milagres inventados** (nº 32 e nº 36). A "referência" é "Relatos en tradiciones paralelas" / "Tradición en algunos evangelios paralelos", fórmulas que não apontam para nenhum texto. Um pastor, um catequista ou um avô que conhece a Bíblia percebe na hora, e isso destrói a confiança no produto inteiro.
2. **Duplicatas:** o nº 40 repete o 22 com as mesmas referências. O episódio de Jericó aparece 3 vezes (nº 30/31/38) como se fossem 3 milagres, quando é **um** episódio contado por 3 evangelistas (Mateus fala em dois cegos, Marcos e Lucas em um, e Marcos dá o nome de Bartimeu). O PDF perde a chance de explicar isso de forma simples.
3. **Omissão importante:** falta a **mão ressequida** (Mt 12:9-14; Mc 3:1-6; Lc 6:6-11), que está nos três sinóticos.
4. **Ilustrações com anacronismos e imagens impróprias**, o que é grave num público com crianças e idosos:
   - nº 8: o paralítico está numa **cadeira de rodas moderna**;
   - nº 10: **caixão branco moderno** e homens de **terno**;
   - nº 5, 14, 32 e 36: **quarto de hospital/quarto moderno** e roupas atuais;
   - nº 27: o homem com hidropisia aparece como **obeso, de camisa polo**. Hidropisia é inchaço por retenção de líquido, e a imagem pode ofender;
   - nº 39: um homem de camisa social e um **demônio com chifres**; nº 16: uma sombra monstruosa. Ambas assustam crianças;
   - nº 41: **fantasmas** sobre Jerusalém, com a **Cúpula da Rocha** (construída em 691 d.C.), o que é anacronismo e ainda gera uma leitura inter-religiosa desnecessária;
   - em todas as páginas o rosto de Jesus muda.
5. **Tom:** alguns "Significados" puxam para o confronto ou para a culpa. O nº 27 diz "la compasión es superior a las tradiciones rígidas", o nº 33 fala em "juicio de una religiosidad sin frutos" e o nº 29 diz "muestra la ingratitud humana". Isso viola a regra da casa (amor de Cristo, nunca atacar instituições). O nº 14 diz "Para Cristo, la muerte es solo sueño", uma formulação teologicamente frouxa.

### Estruturais
6. **A ordem só é cronológica até o nº 31.** Depois vira salada: o 37 (sordomudo) e o 39 (ciego-mudo) pertencem à Galileia, o 35 (Jo 21, pós-ressurreição) vem antes do 43 (ressurreição) e o 42 (templo, Domingo de Ramos) vem depois do 34 (Getsêmani).
7. **Paralelos incompletos:** o nº 3 não liga com Mt 4:18-22 / Mc 1:16-20 (o chamado), o nº 34 omite Mt 26:51 e Mc 14:47 e o nº 39 omite Lc 11:14. Em nenhum lugar o PDF diz *quais* evangelhos trazem o relato, nem que um relato é exclusivo.
8. **Falta o "sinal":** nada explica a ideia de *señal* em João (o milagre que aponta para quem Jesus é), nem os ecos do Antigo Testamento (Eliseu e os pães, Salmos 107 e a tempestade, Isaías 35 e os cegos, Elias e o filho da viúva).
9. **Sem aplicação:** o "Significado" é uma frase doutrinária. Não diz ao leitor o que fazer hoje, não traz oração, pergunta nem tarefa.
10. **Sem contexto:** não há onde, quando, quem eram os personagens (centurião, leproso, sinagoga, sábado) nem por que aquilo era escandaloso ou maravilhoso naquela cultura.
11. **Não serve para crianças nem para idosos:** o texto é denso nas primeiras páginas e seco nas últimas, a letra é pequena e não há versão infantil, glossário nem áudio.
12. **Não navega:** num PDF de 44 páginas sem índice e sem links, achar "o milagre de Lázaro" exige rolar tudo.
13. **Espanhol com cara de tradução do português:** "Acalmando", "se preocupa **con** cada detalle" (o correto é *por*), "Cura/Curación" alternados, "Capernaúm/Capernaum" alternados.
14. **Nenhum versículo citado.** A pessoa não lê a Palavra dentro do presente, só uma referência solta.

---

## 3. O que deveria estar lá e não está (priorizado)

| Prioridade | Item | Por quê |
|---|---|---|
| **P0** | Lista **correta**: sem invenções nem duplicatas, e com a mão ressequida | fidelidade bíblica é inegociável |
| **P0** | **Critério declarado do "43"** (lição "¿Por qué 43?") | o título é promessa de venda. Cumpri-lo honestamente é o que nos diferencia |
| **P0** | **Ordem cronológica** (harmonia dos evangelhos) com período/ano do ministério | é a identidade do produto principal (Estudio Cronológico) |
| **P0** | **Referências em todos os evangelhos** com selo Mt · Mc · Lc · Jn e o aviso "solo lo cuenta Lucas" | estudo sério e fácil de conferir |
| **P0** | **Versículo-chave** citado (RVR1960 curto, ou RV1909) | a pessoa lê a Palavra, não só o resumo |
| **P0** | **Tom**: amor de Cristo, sem ataques nem promessas de cura. Nas libertações e curas, uma linha pastoral sobre médico/tratamento | segurança pastoral e da marca |
| **P1** | "¿Qué revela de Jesús?" (o sinal) + "¿Qué significa para ti hoy?" + oração curta | é o salto de valor em relação ao PDF |
| **P1** | **Bloco para crianças** (2 frases + pergunta) | usar em família e em escola dominical/catequese |
| **P1** | **Onde e quando** + **mapa** com pinos numerados | concretude e memória visual |
| **P1** | **Categorias** e filtro (curas, libertação, ressurreições, natureza/provisão, jornadas de muitas curas, sinais na vida de Jesus) | encontrar rápido: "quero ler as curas de cegos" |
| **P1** | **Ligação com o Estudio Cronológico** e botão "Estudiar en cadena" (busca de estudo cruzado) | faz o presente puxar o uso do produto principal |
| **P2** | "Palabras difíciles" (glossário inline: lepra, sinagoga, sábado, centurión, fariseo, maestresala) | idosos e iniciantes |
| **P2** | "Eco del Antiguo Testamento" (1–3 referências) | profundidade e porta para a busca cruzada |
| **P2** | "¿Sabías que…?" (1 dado cultural) | encanto e memorização |
| **P2** | Ilustração própria **sem anacronismos**: nas libertações, mostrar a pessoa **restaurada**, nunca o demônio | crianças e idosos |
| **P3** | Áudio de cada lição (reusar o pipeline TTS do produto de áudio) | idosos e baixa visão |
| **P3** | Cartão compartilhável (versículo + título) para WhatsApp | viralidade orgânica |

---

## 4. Nossa versão no app (especificação)

### 4.1 Critério do "43" (mantém o título, com honestidade)
**43 = 35 milagres individuais feitos por Jesus + 3 jornadas de muitas curas + 5 grandes sinais na vida de Jesus.**
Isso é explicado numa lição introdutória ("¿Por qué 43?"), em espanhol simples: *"Los evangelios cuentan unos 35 milagros de Jesús con detalle. Aquí están todos, en el orden en que sucedieron, junto con tres días en que Jesús sanó a multitudes y cinco grandes señales de su vida, de la Transfiguración a la Ascensión. Juan dice que Jesús hizo muchas más (Juan 20:30; 21:25)."*

| Categoria (chip + cor) | Qtde. |
|---|---|
| Curaciones | 17 |
| Liberaciones | 6 |
| Resurrecciones | 3 |
| Naturaleza y provisión | 9 |
| Jornadas de muchas sanaciones | 3 |
| Señales en la vida de Jesús | 5 |
| **Total** | **43** |

### 4.2 Lista final em ordem cronológica aproximada
Harmonia tradicional (sequência de Marcos/Lucas para a Galileia, com João intercalado nas festas). A datação segue a cronologia **c. 27–30 d.C.**, a mesma dos dados Theographic que o Estudio já usa (`content-src/estudio/raw/theographic-events.json`). Na tela, mostrar **"Año 1/2/3 del ministerio"** e a nota "fechas aproximadas; otra cronología frecuente las sitúa en 30–33 d.C.".

**Sección A · Los comienzos (Año 1, c. 27)**
| # | Milagro (título no app) | Mt | Mc | Lc | Jn | Lugar | Cat. |
|---|---|---|---|---|---|---|---|
| 1 | El agua que se volvió vino (Bodas de Caná) | – | – | – | 2:1-11 | Caná | Naturaleza |
| 2 | El hijo del oficial del rey | – | – | – | 4:46-54 | Caná → Capernaúm | Curación |

**Sección B · El gran ministerio en Galilea (Año 2, c. 28)**
| # | Milagro | Mt | Mc | Lc | Jn | Lugar | Cat. |
|---|---|---|---|---|---|---|---|
| 3 | La primera pesca milagrosa | (4:18-22)* | (1:16-20)* | 5:1-11 | – | Lago de Genesaret | Naturaleza |
| 4 | El hombre de la sinagoga de Capernaúm | – | 1:21-28 | 4:31-37 | – | Capernaúm | Liberación |
| 5 | La suegra de Pedro | 8:14-15 | 1:29-31 | 4:38-39 | – | Capernaúm | Curación |
| 6 | Al caer la tarde, sanaba a todos | 8:16-17 | 1:32-34 | 4:40-41 | – | Capernaúm | Jornada |
| 7 | El leproso: «Quiero, sé limpio» | 8:1-4 | 1:40-45 | 5:12-16 | – | Galilea | Curación |
| 8 | El paralítico que bajaron por el techo | 9:1-8 | 2:1-12 | 5:17-26 | – | Capernaúm | Curación |
| 9 | El paralítico del estanque de Betesda | – | – | – | 5:1-15 | Jerusalén | Curación |
| 10 | El hombre de la mano seca | 12:9-14 | 3:1-6 | 6:6-11 | – | Galilea (sinagoga) | Curación |
| 11 | El siervo del centurión | 8:5-13 | – | 7:1-10 | – | Capernaúm | Curación |
| 12 | El hijo de la viuda de Naín | – | – | 7:11-17 | – | Naín | Resurrección |
| 13 | El hombre que no veía ni hablaba | 12:22-23 | – | 11:14 | – | Galilea | Liberación |
| 14 | Jesús calma la tempestad | 8:23-27 | 4:35-41 | 8:22-25 | – | Mar de Galilea | Naturaleza |
| 15 | El hombre de Gadara | 8:28-34 | 5:1-20 | 8:26-39 | – | Gadara/Gerasa | Liberación |
| 16 | La mujer que tocó su manto | 9:20-22 | 5:25-34 | 8:43-48 | – | Capernaúm | Curación |
| 17 | La hija de Jairo: «Talita cumi» | 9:18-19, 23-26 | 5:21-24, 35-43 | 8:40-42, 49-56 | – | Capernaúm | Resurrección |
| 18 | Dos ciegos que lo seguían | 9:27-31 | – | – | – | Capernaúm | Curación |
| 19 | El mudo que volvió a hablar | 9:32-34 | – | – | – | Capernaúm | Liberación |

\* O chamado dos pescadores aparece como contexto paralelo. A pesca em si só está em Lucas (mostrar "solo lo cuenta Lucas").

**Sección C · Panes, mar y tierras vecinas (Año 3, c. 29)**
| # | Milagro | Mt | Mc | Lc | Jn | Lugar | Cat. |
|---|---|---|---|---|---|---|---|
| 20 | Cinco panes y dos peces (los cinco mil) | 14:13-21 | 6:30-44 | 9:10-17 | 6:1-14 | Cerca de Betsaida | Naturaleza |
| 21 | Jesús camina sobre el agua | 14:22-33 | 6:45-52 | – | 6:16-21 | Mar de Galilea | Naturaleza |
| 22 | En Genesaret, tocaban su manto | 14:34-36 | 6:53-56 | – | – | Genesaret | Jornada |
| 23 | La fe de la mujer cananea | 15:21-28 | 7:24-30 | – | – | Región de Tiro y Sidón | Liberación |
| 24 | «Efata»: el sordo que hablaba mal | – | 7:31-37 | – | – | Decápolis | Curación |
| 25 | Siete panes (los cuatro mil) | 15:32-39 | 8:1-10 | – | – | Decápolis | Naturaleza |
| 26 | El ciego de Betsaida, poco a poco | – | 8:22-26 | – | – | Betsaida | Curación |
| 27 | La Transfiguración | 17:1-8 | 9:2-8 | 9:28-36 | – | Un monte alto (trad. Tabor o Hermón) | Señal |
| 28 | El muchacho que el padre trajo | 17:14-20 | 9:14-29 | 9:37-43 | – | Al pie del monte | Liberación |
| 29 | La moneda en la boca del pez | 17:24-27 | – | – | – | Capernaúm | Naturaleza |

**Sección D · Camino a Jerusalén (Año 3, c. 29–30)**
| # | Milagro | Mt | Mc | Lc | Jn | Lugar | Cat. |
|---|---|---|---|---|---|---|---|
| 30 | El ciego de nacimiento | – | – | – | 9:1-41 | Jerusalén (Siloé) | Curación |
| 31 | La mujer encorvada | – | – | 13:10-17 | – | Una sinagoga, camino a Jerusalén | Curación |
| 32 | El hombre hinchado (hidropesía) | – | – | 14:1-6 | – | Casa de un fariseo | Curación |
| 33 | Lázaro, ¡sal fuera! | – | – | – | 11:1-44 | Betania | Resurrección |
| 34 | Los diez leprosos (y el que volvió) | – | – | 17:11-19 | – | Entre Samaria y Galilea | Curación |
| 35 | Bartimeo y los ciegos de Jericó | 20:29-34 | 10:46-52 | 18:35-43 | – | Jericó | Curación |

**Sección E · La última semana y la victoria (c. 30)**
| # | Milagro | Mt | Mc | Lc | Jn | Lugar | Cat. |
|---|---|---|---|---|---|---|---|
| 36 | La higuera sin fruto | 21:18-22 | 11:12-14, 20-25 | – | – | Camino de Betania a Jerusalén | Naturaleza |
| 37 | Ciegos y cojos en el templo | 21:14 | – | – | – | Templo de Jerusalén | Jornada |
| 38 | «Yo soy»: los soldados caen en tierra | – | – | – | 18:4-6 | Getsemaní | Señal |
| 39 | La oreja de Malco | 26:51-54 | 14:47 | 22:49-51 | 18:10-11 | Getsemaní | Curación |
| 40 | Señales en la cruz (tinieblas, velo, terremoto) | 27:45-54 | 15:33-39 | 23:44-48 | – | Gólgota | Señal |
| 41 | ¡Ha resucitado! | 28:1-10 | 16:1-8 | 24:1-12 | 20:1-18 | Sepulcro, Jerusalén | Señal |
| 42 | La segunda pesca: 153 peces | – | – | – | 21:1-14 | Mar de Tiberíades | Naturaleza |
| 43 | La Ascensión | – | (16:19) | 24:50-53 | – | Betania / Monte de los Olivos | Señal |

Notas de conteúdo:
- **Nº 39:** só Lucas narra a **cura**. Mateus, Marcos e João contam o golpe (João dá o nome, Malco). Mostrar assim, com as referências em cinza para "também menciona".
- **Nº 40** absorve Mt 27:51-53 (os santos que ressuscitaram), narrado com sobriedade e **sem fantasmas**.
- **Nº 43:** o complemento natural é Hechos 1:9-11. Mc 16:19 aparece entre parênteses (final longo de Marcos) sem entrar em polêmica textual.
- **Nº 35:** transformar a diferença entre os relatos em pedagogia: *"Mateo recuerda a dos ciegos; Marcos y Lucas se fijan en uno, y Marcos nos da su nombre: Bartimeo. Es como cuando tres testigos cuentan el mismo hecho, cada uno desde donde estaba."*
- **Nº 28 (epilepsia):** incluir a linha pastoral *"No toda enfermedad tiene un origen espiritual. Orar y buscar ayuda médica van juntos."* A mesma regra vale para todas as curas: **nunca prometer cura**.
- **Selo "Señal de Juan":** nº 1, 2, 9, 20, 21, 30 e 33 são os 7 sinais de João (o nº 42 é o epílogo). Um selo discreto permite a trilha "Las 7 señales de Juan".

Lições extras (não contam no 43):
- **0a Comienza aquí**: como usar, os ícones e o modo família.
- **0b ¿Por qué 43?**: o critério.
- **0c ¿Qué es un milagro? ¿Qué es una señal?**: 1 página simples.
- **0d Mapa de los milagros**: o mapa interativo geral.
- **Final · "Muchas otras señales"**: Juan 20:30-31, um convite e a ponte para o Estudio.

### 4.3 Campos de cada lição
Proposta de dados, hoje sem código. O `LessonContent` atual só tem `fecha/autor/periodo/versiculo/resumen/meditar/tarea/practica`, então precisa de um bloco opcional `milagro`:

```ts
milagro?: {
  numero: number                 // 1..43
  categoria: 'curacion' | 'liberacion' | 'resurreccion' | 'naturaleza' | 'jornada' | 'senal'
  senalDeJuan?: number           // 1..7
  seccion: 'comienzos' | 'galilea' | 'tierras-vecinas' | 'camino-jerusalen' | 'ultima-semana'
  donde: { texto: string; lugarId: string; aproximado?: boolean }   // "Caná de Galilea"
  cuando: { texto: string; anioMinisterio: 1 | 2 | 3; sortKey: number }
  referencias: { mt?: string; mc?: string; lc?: string; jn?: string; otras?: string[]; nota?: string }
  // reusa versiculo (RVR1960 ≤ 2 vv.) e resumen (= "La historia")
  palabrasDificiles?: { palabra: string; significado: string }[]
  revela: string[]               // "¿Qué revela de Jesús?" 2–3 itens
  paraTi: string                 // "¿Qué significa para ti hoy?" 80–120 palavras
  // reusa tarea (1 passo concreto) e meditar
  oracion: string                // 40–60 palavras, termina em "Amén."
  ninos: { frases: [string, string]; pregunta: string }
  sabiasQue?: string
  ecoAT?: string[]               // 1–3 refs do AT (e 1 do NT, se couber)
  conexiones: { estudioLessonIds: string[]; semillaCadena: string; temas: string[]; anterior?: number; siguiente?: number }
  ilustracion: string            // /milagros/<id>.webp
}
```

**Ordem na tela** (mobile, reusa `LessonView` e a escala de fonte que já existe):
1. Ilustração + chip de categoria + "Milagro 1 de 43".
2. **Dónde · Cuándo · Dónde leerlo** (os `Fact` atuais), com os selos **Mt Mc Lc Jn** (os ausentes em cinza) e a frase "Solo lo cuenta Juan" quando for o caso.
3. Versículo-chave (a figura dourada atual).
4. **La historia** (`resumen`), 180–240 palavras, com as palavras difíceis sublinhadas e um toque que abre a definição.
5. **¿Qué revela de Jesús?**
6. **¿Qué significa para ti hoy?** + tarefa do dia (o card `tarea` atual).
7. **Oración** (card com botão "Orar en voz alta", via TTS, opcional).
8. **Para los niños**: 2 frases + pergunta, com ícone próprio e fonte maior. Um interruptor **"Leer en familia"** leva esse bloco para o topo.
9. ¿Sabías que…? · Eco del Antiguo Testamento.
10. **Mini-mapa** com o pino deste milagre.
11. Rodapé de conexões: "En el Estudio Cronológico →" · "Estudiar en cadena →" · "← Milagro anterior | Siguiente milagro →".
12. CompletionCard (marcar como lida, sequência de dias), igual às outras lições.

**Regras de redação** (herdadas do `content-src/planes/BRIEF.md`):
- espanhol latino neutro, "tú", frases com menos de 20 palavras e nível de leitura de ~6º ano;
- nada de medo, culpa ou ataque a igrejas/tradições;
- não prometer cura nem prosperidade;
- nas libertações, focar na pessoa restaurada;
- os temas sensíveis para católicos e evangélicos (María em Caná, "hermanos de Jesús", Pedro casado) são narrados só com o que o texto diz, sem comentário confessional.

### 4.4 Mapa
- **Base:** um SVG estático e leve (sem biblioteca de mapas, funciona offline) com Galileia, Samaria, Judeia, Decápolis, Tiro/Sidão, o mar da Galileia e o Jordão, mais um **inset de Jerusalém** (Betesda, Siloé, Templo, Getsêmani, Gólgota, sepulcro, monte das Oliveiras, Betânia).
- **Coordenadas:** vêm de `content-src/estudio/raw/theographic-places.json` (campos `openBibleLat/Long`, dados OpenBible, CC-BY, com crédito). Já existem lá Caná, Cafarnaum, Naim, Betsaida, Genesaret, Tiro, Sidom, Decápolis, Jericó, Betânia, Betfagé, Tabor, Hermom, Tiberíades e o mar da Galileia.
  - Falta **Gadara/Gerasa**. Pôr manualmente na margem oriental do lago (região de Kursi) com a marca "lugar aproximado".
  - Em Jerusalém, **Betesda, Siloé, Getsêmani e Gólgota têm a mesma coordenada genérica**, então a posição no inset tem de ser manual.
  - Caná, Betsaida, o monte da Transfiguração e Gadara levam a marca "aproximado". Caná tem dois sítios propostos (Kafr Kanna e Khirbet Qana).
- **Pinos numerados**, com a cor da categoria. Um toque abre o card do milagre e "Leer".
- **Filtros:** por categoria, por seção/ano e "Las 7 señales de Juan". Um modo "Recorrido" mostra os pinos acendendo em ordem cronológica, o que ajuda a entender que Jesus andava a pé.
- Na lição: mini-mapa com um pino e a frase de distância ("a unos 30 km de Nazaret, un día de camino").

### 4.5 Ligação com o Estudio Cronológico e a busca de estudo cruzado
- **Estudio Cronológico:** cada milagre aponta para a lição do NT correspondente em `lib/catalog.ts` ("Juan 1", "Marcos 1", "El ministerio de Jesús: una armonía de los evangelios"). Na linha do tempo do Estudio, os 43 aparecem como **marcadores** ordenados pelo `sortKey` Theographic (os eventos-milagre já existem em `theographic-events.json`: "Water to Wine", "Healing a Withered Hand", "Lazarus Raised…").
- **Busca de estudo cruzado** (desenho em `docs/pesquisa-thompson.md`):
  - cada milagre é uma **semente de passagem** (`semillaCadena: "Juan 2:1-11"`);
  - o botão "Estudiar en cadena" abre a cadeia pré-gerada: xrefs OpenBible com votos ≥ 3 + temas Nave/Torrey, em ordem cronológica;
  - os nomes populares entram em `topics.aliases_es`/busca ("bodas de Caná", "los cinco mil", "Lázaro", "Bartimeo", "la mujer del flujo de sangre", "Talita cumi", "Efata");
  - os campos `ecoAT` servem de elos "curados à mão" que o gerador precisa incluir.
- **Pré-gerar 43 cadeias** na mesma rodada do cache do Estudio.

### 4.6 Visual e ilustrações
- Manter a identidade do app: a capa atual (`DUSK`, ícone `sparkles`, destaque "43"), os tokens `gold/ink/surface`, a serifa do leitor e a escala de fonte.
- **43 ilustrações próprias**, com um estilo único (pintura suave e quente, luz de fim de tarde, coerente com as paletas terrosas do catálogo) e o **mesmo Jesus** em todas (ficha de personagem fixa).
- **Guard-rails do prompt de imagem:**
  - séc. I na Galileia/Judeia: roupas, casas de pedra/barro, lamparinas, esteiras, sem objetos modernos;
  - **nenhum demônio visível**: mostrar o momento *depois*, a pessoa em paz;
  - nenhum cadáver em primeiro plano;
  - pessoas com doença representadas com dignidade;
  - nenhum edifício posterior ao séc. I;
  - sem texto na imagem.
- WebP ≤ 120 KB por imagem, 1200×675. O presente inteiro fica abaixo de 6 MB, contra 34 MB do PDF.

### 4.7 Lição completa de exemplo (texto nosso)

> **Milagro 1 de 43 · Naturaleza y provisión · Primera señal de Juan**
> ## El agua que se volvió vino
> *Las bodas de Caná*
>
> **📍 Dónde:** Caná de Galilea, una aldea en las colinas, cerca de Nazaret. *(Lugar aproximado: hoy se proponen dos sitios, Kafr Kanna y Khirbet Qana.)*
> **🗓️ Cuándo:** al comienzo del ministerio de Jesús, pocos días después de llamar a sus primeros discípulos. Año 1 (c. 27 d. C., fecha aproximada).
> **📖 Dónde leerlo:** Juan 2:1-11 · `Mt –` `Mc –` `Lc –` **`Jn ✓`** · *Solo lo cuenta Juan.*
>
> > «Este principio de señales hizo Jesús en Caná de Galilea, y manifestó su gloria; y sus discípulos creyeron en él.»
> > — Juan 2:11 (RVR1960)
>
> ### La historia
> Jesús, su madre María y sus primeros discípulos fueron invitados a una boda en Caná. En aquel tiempo, una boda era una fiesta grande que podía durar varios días, y el pueblo entero participaba. Si faltaba comida o bebida, la familia de los novios pasaba mucha vergüenza.
>
> En medio de la fiesta, se acabó el vino. María se dio cuenta y se lo dijo a Jesús con pocas palabras: «No tienen vino». Jesús le respondió que todavía no había llegado su hora. Pero María, confiada, les dijo a los que servían: «Haced todo lo que os dijere».
>
> Allí había seis tinajas grandes de piedra, que se usaban para el agua de los lavados religiosos. Jesús pidió que las llenaran de agua, y los sirvientes las llenaron hasta el borde. Después les dijo: «Saquen un poco y llévenlo al encargado de la fiesta».
>
> El encargado lo probó, y ya no era agua: era vino, ¡y del mejor! Sin saber de dónde había salido, llamó al novio y le dijo: «Todos sirven primero el vino bueno, pero tú guardaste el mejor para el final». Los sirvientes sí sabían lo que había pasado. Y los discípulos creyeron en Jesús.
>
> **Palabras difíciles** — *Tinaja:* vasija muy grande para guardar agua. *Encargado de la fiesta* (en la Biblia, «maestresala»): quien organizaba la comida y la bebida del banquete. *«Mujer»:* cuando Jesús llama así a su madre no es una falta de respeto; era una forma digna de hablar, y la usa también desde la cruz (Juan 19:26).
>
> ### ¿Qué revela de Jesús?
> - **Que le importan las personas sencillas.** No dejó que una familia pasara vergüenza en el día más feliz de su vida.
> - **Que la creación le obedece.** Sin ceremonias ni espectáculo, el agua se convirtió en vino.
> - **Que es generoso.** No dio lo justo: dio muchísimo, y lo mejor.
> - **Que sus milagros son «señales».** Juan no los llama solo prodigios: son señales que apuntan a quién es Jesús. Esta primera señal «manifestó su gloria».
>
> ### ¿Qué significa para ti hoy?
> Tal vez en tu vida también «se acabó el vino»: las fuerzas, la paciencia, la alegría o el dinero del mes. Esta historia te enseña dos pasos sencillos. Primero, hacer lo que hizo María: llevarle a Jesús lo que falta, tal como es, en pocas palabras. Segundo, hacer lo que hicieron los sirvientes: obedecer en lo pequeño que sí está en tus manos, aunque todavía no entiendas cómo terminará. Ellos solo llenaron tinajas con agua; lo demás lo hizo Jesús. Él no siempre responde como imaginamos, ni cuando lo esperamos, pero nunca es indiferente a lo que te falta.
>
> **Para hoy:** escribe en una frase qué se te ha acabado y díselo a Jesús con las palabras de María: «Señor, no tengo…».
>
> ### Oración
> Señor Jesús, tú viste la necesidad de una familia en plena fiesta y no la dejaste sola. Hoy pongo delante de ti lo que me falta. Ayúdame a hacer lo que tú me digas en las cosas pequeñas de cada día, y a confiar en que tú sabes guardar lo mejor. Amén.
>
> ### 👧 Para los niños
> En una boda se acabó el vino y la fiesta se iba a poner triste. Jesús convirtió el agua de seis tinajas enormes en el vino más rico, porque a Él le importan las personas.
> **Pregunta:** Los sirvientes ayudaron llenando las tinajas con agua. ¿Qué cosa pequeña puedes hacer tú hoy para ayudar en tu casa?
>
> ### ¿Sabías que…?
> En cada tinaja cabían «dos o tres cántaros» (Juan 2:6), es decir, entre 80 y 120 litros. ¡En total, unos 500 a 700 litros de vino! Además, Natanael, uno de los primeros discípulos, era de Caná (Juan 21:2).
>
> ### Eco del Antiguo Testamento
> - **Génesis 41:55**: en tiempo de hambre, el faraón le dice al pueblo: «Id a José, y haced lo que él os dijere». En Caná, María dice casi lo mismo señalando a Jesús.
> - **Isaías 25:6** y **Amós 9:13**: los profetas anunciaron que, cuando Dios restaurara todo, habría fiesta y vino en abundancia.
> - Y al final de la Biblia, **Apocalipsis 19:9** habla de «la cena de las bodas del Cordero».
>
> **🗺️ En el mapa:** pin 1, Caná (a unos 8–14 km de Nazaret, según el sitio).
> **Sigue leyendo:** En el Estudio Cronológico → *Juan 1* (el llamado de los primeros discípulos) · *El ministerio de Jesús: una armonía de los evangelios* · **Estudiar en cadena:** Juan 2:1-11 · temas «señales», «gozo», «bodas».
> **Siguiente milagro →** 2 · El hijo del oficial del rey *(otra vez en Caná, Juan 4:46)*

*Contagem:* a história tem ≈ 215 palavras e a lição inteira ≈ 750, dentro da meta. O versículo-chave (RVR1960) é o único trecho literal longo. As falas «No tienen vino» e «Haced todo lo que os dijere» são citações de meia linha. Se o texto integral da perícope aparecer num botão "Leer el pasaje completo", usar **RV1909** (domínio público, arquivo `SpaRV.json` já no repo) com a ortografia modernizada (á→a, fué→fue).

*Nota ecumênica (interna):* o texto apresenta María como quem **percebe a necessidade, a leva a Jesus e aponta para Ele**. É uma leitura que católicos (María atenta e intercessora) e evangélicos ("haced todo lo que Él os diga") reconhecem como sua.

### 4.8 Volume e lotes
| Item | Estimativa |
|---|---|
| Lições de milagre | 43 × ~650–750 palavras ≈ **29–32 mil palavras** |
| Lições extras (0a–0d + final) | 5 × ~350 ≈ 1,8 mil |
| Blocos infantis | 43 (já incluídos acima) |
| Versículos-chave RVR1960 | 43 (1–2 vv. cada, bem abaixo do limite de uso) |
| Ilustrações | 43 + 1 capa + 5 cabeçalhos de seção (opcional) |
| Mapa | 1 SVG base + inset de Jerusalém + ~30 lugares |
| Cadeias de estudo cruzado | 43 pré-geradas |

**Lotes** (mesmo pipeline dos planos: `content-src/milagros/outline.json` → JSON por lote → `verify-verses.mjs` → build para `lib/content/milagros.ts`, carregado sob demanda como `loadPlanDay`):
- **Lote 0:** outline dos 43 (títulos, referências, lugar, `sortKey`, categoria), lições 0a–0d e piloto nº 1 (já escrito acima). Aprovação do dono.
- **Lote 1:** nº 2–12 (os comienzos + a primeira metade da Galileia).
- **Lote 2:** nº 13–22.
- **Lote 3:** nº 23–33.
- **Lote 4:** nº 34–43 + a lição final.
- Em paralelo: as ilustrações por lote, o mapa (depois do Lote 0, porque só precisa do outline) e as cadeias (depois de cada lote).

---

## 5. Checklist de produção

1. Aprovar o critério **35 + 3 + 5 = 43** e a lista da seção 4.2 com o dono. Se ele preferir, a alternativa é trocar o título para "Los milagros de Jesús", mas **não recomendo**, porque o 43 está nas páginas de venda e nos e-mails (`docs/emails-kashpay.md`).
2. Criar `content-src/milagros/BRIEF.md`, derivado do BRIEF dos planos, com as regras de tom, o nível de leitura, as proibições (prometer cura, atacar instituições, demônios gráficos) e o formato JSON da seção 4.3.
3. Criar `content-src/milagros/outline.json` com os 43 itens: `numero, titulo, categoria, seccion, referencias{mt,mc,lc,jn}, lugarId, aproximado, sortKey, senalDeJuan, estudioLessonIds`.
4. Conferir cada referência do outline contra o texto (RV1909 local ou bolls.life RV1960), incluindo os limites dos versículos e os paralelos.
5. Montar a tabela de lugares a partir do `theographic-places.json` e acrescentar à mão Gadara/Gerasa e as posições do inset de Jerusalém. Marcar "aproximado" em Caná, Betsaida, no monte da Transfiguração e em Gadara.
6. Estender o tipo `LessonContent` com o bloco opcional `milagro` (seção 4.3) sem quebrar os outros produtos.
7. Adaptar o `LessonView`: selos Mt/Mc/Lc/Jn, "Palabras difíciles" com toque, cards "¿Qué revela…?", "Para ti hoy", "Oración", "Para los niños", o interruptor "Leer en familia", o mini-mapa e o rodapé de conexões.
8. Trocar `pendingGuide()` do `milagros-jesus` em `lib/catalog.ts` por: "Comienza aquí" (0a–0d) + 5 seções (A–E) + "Final". Atualizar `short`/`description` para mencionar a ordem cronológica, o mapa e a versão para crianças.
9. Escrever o **Lote 0**: as lições 0a–0d e o piloto nº 1, já pronto na seção 4.7, convertido para JSON. Revisão do dono.
10. Gerar os Lotes 1–4. Em cada lote: rodar `verify-verses.mjs` (texto RVR1960 exato, no máximo 2 vv.), checar o tamanho (a história com 180–240 palavras, o bloco infantil com até 35 palavras + pergunta) e fazer a revisão de tom.
11. **Revisão teológica dupla** por amostragem: um leitor católico e um evangélico, focados em María, Pedro, os "hermanos", as libertações, a Transfiguração e a Ascensão.
12. **Teste de leitura** com uma criança de 8–10 anos (o bloco infantil) e uma pessoa de mais de 65 anos (a navegação e a fonte), anotando onde travam.
13. Produzir as 43 ilustrações com a ficha fixa de Jesus e os guard-rails da seção 4.6. Checagem visual de cada imagem para anacronismos e demônios, e compressão para WebP ≤ 120 KB.
14. Desenhar o SVG do mapa + o inset de Jerusalém, os pinos por categoria, os filtros e o modo "Recorrido". Pôr o crédito OpenBible/Theographic na tela "Acerca de".
15. Ligar ao Estudio Cronológico: os `estudioLessonIds` em cada milagre e os 43 marcadores na linha do tempo do Estudio via `sortKey`.
16. Ligar à busca cruzada: aliases_es dos 43 nomes populares, `semillaCadena` por milagre, pré-geração das 43 cadeias e os `ecoAT` como elos obrigatórios.
17. Criar a trilha "Las 7 señales de Juan" (um filtro/coleção com os nº 1, 2, 9, 20, 21, 30 e 33).
18. QA no celular: fonte em 3 escalas, modo escuro, offline (imagens e mapa em cache), marcar como lida, sequência de dias e navegação anterior/próximo em todas as 43 lições.
19. (Opcional P3) Áudio TTS de cada lição com o mesmo pipeline do Resumen en Audio, e um cartão compartilhável para WhatsApp.
20. Checagem final de direitos: nenhuma frase ou imagem do PDF do concorrente, as citações RVR1960 dentro do limite curto com o aviso de copyright, e o crédito das fontes (RV1909 domínio público, OpenBible CC-BY, Theographic CC BY-SA em tabela separada).
