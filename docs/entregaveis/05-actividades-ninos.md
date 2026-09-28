# Presente 5 — Actividades Bíblicas para Niños

> Análise do PDF do concorrente (molde) + especificação da nossa versão dentro do app.
> Arquivo analisado: `Apps - Daniel asafh/entregaveis front/regalo 5 - Actividades Biblicas para Ninos.pdf`
> Produto no app: `lib/catalog.ts` → `id: 'actividades-ninos'` (hoje `pendingGuide()`, sem conteúdo).
> Data da análise: 2026-09-28. Todas as 92 páginas foram percorridas (texto extraído + miniaturas de todas as páginas).

---

## 0. Resumo em 6 linhas

- O molde é uma **apostila escolar de alfabetização** (4–7 anos) com 92 páginas A4, **3 histórias apenas** (Samuel, Buen Samaritano, Nacimiento de Jesús), cada uma com o **mesmo template de ~27 fichas**.
- É uma **tradução automática do português**, com dezenas de palavras em PT deixadas no meio ("SINO", "Reis", "JOGO DA MEMÓRIA", "VIVIA UMA JOVEM CHAMADA MARIA", "C_R_Ç__"), rótulos absurdos ("MANTECA" para o burro, "CAMA Y DESAYUNO" para o bebê) e exercícios fonéticos que **não funcionam em espanhol**.
- Tem **erros bíblicos** (igreja com cruz e "padre Elí" em 1 Samuel; "un sacerdote y otro sacerdote" no Samaritano; nomes dos reis magos apresentados como texto bíblico; magos no estábulo).
- **Zero** orientação para pais, faixa etária, versículo, gabarito, oração ou aplicação. Só funciona impresso, com tesoura e cola.
- Nossa versão: **"Rincón de los niños"** — 52 histórias em ordem cronológica (1 por semana do ano; MVP de 12), cada uma com história narrada em 3 níveis de idade, 1 mini-jogo tocável no celular, 1 PDF imprimível gerado, versículo para memorizar e guia "Cómo conversarlo" para pais/avós.
- Tudo sai de **um único JSON por história** + **12 componentes de jogo reutilizáveis** (6 no MVP) + um guia de estilo de ilustração único gerado com IA e revisado à mão.

---

## 1. O que é

### 1.1 Ficha técnica

| Item | Molde |
|---|---|
| Páginas | 92, A4 retrato (596×842 pt), sem capa geral, sem índice, sem introdução, sem créditos |
| Tamanho | 30 MB (quase tudo imagem raster; gerado no iLovePDF) |
| Público declarado | Nenhum. Cabeçalho "NOMBRE / DATOS" em toda ficha → formato de **folha de escola/escola dominical**, não de família |
| Faixa etária real (inferida) | 4–7 anos (Educação Infantil / 1º ano): sílabas, som inicial, letra cursiva, contar até ~10, sequência de múltiplos de 3 |
| Histórias | **3**: Samuel el siervo de Dios (p. 1–31), El Buen Samaritano (p. 32–61), Nacimiento de Jesús (p. 62–92). Sem ordem cronológica, sem ligação entre elas |
| Idioma | Espanhol traduzido automaticamente do português (ver 2.1) |

### 1.2 Estrutura de cada "Secuencia didáctica" (o mesmo template 3 vezes)

| # | Ficha | Samuel | Samaritano | Natal | O que a criança faz |
|---|---|---|---|---|---|
| 1 | Capa ilustrada | p.1 | p.32 | p.62 | — |
| 2 | História + "Explicación" (texto corrido, 150–280 palavras) | p.2–3 | p.33–34 | p.63–64 | Adulto lê |
| 3 | Banco de palabras (6–9 cartões imagem + palavra) | p.4 | p.35 | p.65 | Vocabulário |
| 4 | Tarjetas (imagem · MAIÚSCULA · minúscula · silhueta) | p.5 | p.36 | p.66 | Recortar e associar (sem instrução) |
| 5 | Separar sílabas + "Dibuja un personaje" | p.6 | p.37 | p.67 | Escrever / desenhar |
| 6 | Rompecabezas (figura em 5 tiras) + "Pegar aquí" | p.7–8 | p.38–39 | p.68–69 | Recortar e colar |
| 7 | Pintar (desenho de contorno) | p.9 | p.40 | p.70 | Colorir |
| 8 | Completo (completar a metade da figura) | p.10 | p.41 | p.71 | Simetria |
| 9 | Camino (labirinto) | p.11 | p.42 | p.72 | Traçar |
| 10 | Encierra imágenes con el mismo sonido | p.12 | p.43 | p.73 | Consciência fonológica |
| 11 | Localiza la imagen que no se repite | p.13 | p.44 | p.74 | Atenção visual |
| 12 | "CINCO" (2 fichas, 1 imagem + 4 imagens, sem instrução) | p.14–15 | p.45–46 | p.75–76 | Indeterminado |
| 13 | Cortar dictado (rótulos para recortar e colar sob imagens) | — | p.47 | p.77 | Leitura |
| 14 | ¿Qué letra falta? (2 fichas) | p.16–17 | p.48 | p.78–79 | Vogais |
| 15 | Pinta un cuadrado por cada sílaba (2 fichas) | p.18–19 | p.49–50 | p.80–81 | Contar sílabas |
| 16 | Desglose en sílabas y letras | p.20 | p.51 | p.82 | Escrita |
| 17 | Escritura espontánea (2 fichas, 8 imagens) | p.21–22 | p.52–53 | p.83–84 | Escrever o nome |
| 18 | Cuenta las palabras | p.23 | p.54 | p.85 | Contar palavras numa frase |
| 19 | Cálculo (contar figuras numa cena) | p.24 | p.55 | p.86 | Matemática |
| 20 | Intruso (achar o diferente em cada fila) | p.25 | p.56 | p.87 | Atenção visual |
| 21 | ¿Qué número falta? (múltiplos de 3 até 66) | p.26 | p.57 | p.88 | Matemática (nível 2º ano) |
| 22 | Letra cursiva (caligrafia) | p.27–28 | p.58 | p.89 | Caligrafia |
| 23 | Sopa de letras (6 palavras, grade ~20×16) | p.29 | p.59 | p.90 | Busca de palavras |
| 24 | Tres en raya (tabuleiro + 10 peças recortáveis) | p.30 | p.60 | p.91 | Jogo da velha |
| 25 | Juego de memoria (16 cartas recortáveis) | p.31 | p.61 | p.92 | Memória |

**Distribuição real:** das ~28 fichas por história, só 2 páginas são a história; ~20 são exercícios de alfabetização/matemática genéricos em que o tema bíblico é apenas "decoração" (a mesma ficha funcionaria com qualquer tema).

### 1.3 Estilo das ilustrações

- Mistura de **4 estilos incompatíveis**: (a) clipart "chibi" aquarelado (cabeçorra, olhos pequenos) para personagens; (b) ícones flat genéricos (coração, estrela, sino, sol, lua, envelope, flor, coroa, lâmpada); (c) clipart vetorial de outro autor (Maria com auréola, reis magos, presépio em fundo azul-noite realista na capa do Natal); (d) desenhos de contorno de banco de imagens para colorir (menina de uniforme escolar, vaca de desenho animado, burro).
- Personagens sem consistência: "DIOS" é ilustrado como Jesus numa história do AT; "Samuel" (menino) aparece como um homem barbudo igual ao Jesus; Elí parece "Deus velhinho".
- Origem provável: bancos de clipart/Freepik/Canva sem licença clara → **risco de direitos** que confirma a regra de nunca reaproveitar nada.
- Layout monótono: moldura cinza, título em caixa alta preta, tudo em branco — pensado para impressão, não para tela.

---

## 2. Falhas e brechas

### 2.1 Tradução automática do português (grave — destrói a credibilidade)

| Evidência | Página | O que deveria ser |
|---|---|---|
| "DATOS" no cabeçalho | todas | "FECHA" (é "DATA" em PT) |
| "C_R_Ç__", "CR__NÇ_S" (Ç não existe em espanhol) | 16, 17, 48, 78 | corazón, niños |
| "_GR_J_", "P_V_", "S_N_", "M_LH_R", "_NV_L_P_", "L__", "B__", "P_MB_", "_V_LH_", "M_NJ_D__R_" | 16–17, 48, 78–79 | Palavras **portuguesas** (igreja, povo, sino, mulher, envelope, lua, boi, pomba, ovelha, manjedoura) — a criança hispana não consegue completar |
| "SINO" (sino = campana) na sopa de letras | 29 | CAMPANA |
| "JOGO DA MEMÓRIA" | 92 | Juego de memoria |
| "VIVIA UMA JOVEM CHAMADA MARIA", "AMARADEUSACIMADETUDO", "APARÁBOLADOBOMSAMARITANO" | 85, 54 | Frases em PT (e sem espaços!) num exercício de "contar palavras" |
| "Reis" | 89 | Reyes |
| "OX" (inglês) | 77 | buey |
| "MANTECA" como rótulo do **burro** | 35, 36, 51, 59 | burro / asno |
| "CAMA Y DESAYUNO" como rótulo do **bebê** | 16, 78 | bebé |
| "NUEVO TESTAMENTO" sob a imagem do céu noturno | 78 | noche |
| "ESTABLE" | 65, 90 | establo |
| "estrell", "PINTA / R", "COMPLET / O", "NOMB / RE" | 28, 40, 41, várias | Palavras cortadas pelo layout |
| "Explicación: A historia hac er nacimiento de eso qué sería reconocido…" | 64 | Frase ilegível |
| "Encierra las imágenes que comienzan con el mismo sonido que MARÍA": janela, macarrão, **morango**, pirâmide, sorvete, tijolo, martelo, pera, maçã | 73 | As imagens foram escolhidas pelos nomes em PT; em espanhol "morango" = *fresa* → o exercício dá resposta errada |
| Título "CINCO" com 1 imagem à esquerda e 4 à direita, sem enunciado | 14–15, 45–46, 75–76 | Impossível saber a tarefa (resto de tradução) |
| "Cortar dictado": rótulos "LIBRO DE LA / CORONA", "CAMINO / DE JESÚS", "LÁMPARA / DE CASA" | 47, 77 | Rótulos quebrados em dois cartões; não casam com as 8 imagens |

### 2.2 Erros bíblicos, anacronismos e tom

| Problema | Página | Correção |
|---|---|---|
| Samuel é levado "a la **iglesia**"; imagem de igreja **com cruz**; "el **padre** Elí" | 2, 4–7 | Casa do Senhor / santuário em Siló; Elí era **sacerdote** (1 Sm 1:9, 1:24) — ~1100 a.C., sem cruz nem igreja |
| Ana (mãe de Samuel) nem é nomeada ("una mujer muy religiosa") | 2 | Ana é a protagonista de 1 Sm 1 — ótima personagem para meninas e mães |
| Deus chama Samuel "de novo" uma vez | 2 | Deus chama **4 vezes** (1 Sm 3:4–10) — o detalhe mais gostoso para crianças |
| Samuel "advierte a la gente sobre lo que les espera" | 3 | Reduz o profeta a adivinho; o foco é **escutar a Deus** |
| "Un sacerdote **y otro sacerdote**" | 34 | Um sacerdote e um **levita** (Lc 10:31–32) |
| Jesus "respondió" o mandamento; "entrar en el Reino de los Cielos" | 33 | Jesus pergunta e o doutor da lei responde; a pergunta era sobre a **vida eterna** (Lc 10:25–27) |
| "Un viaje de dos días enteros" | 33 | Inventado (Jerusalém–Jericó ≈ 27 km) |
| Final: Jesus diz «El que tenga compasión, haga lo mismo» | 34 | O doutor responde "el que usó de misericordia"; Jesus diz "Ve, y haz tú lo mismo" (Lc 10:37) |
| Capa do Samaritano com **sangue no rosto** do ferido | 32 | Inadequado para 3–5 anos; usar curativo/atadura |
| "Los tres reyes magos — Melchor, Baltasar y Gaspar" como se fosse texto bíblico | 64 | Mt 2 não dá número nem nomes; é **tradição** (querida pelos católicos) — dizer "la tradición los llama…" |
| Magos chegam **ao estábulo** | 64 | Mt 2:11 fala de uma **casa** (tempo depois) |
| "Sabían que esa noche nacería un ser especial", "este **ser iluminado**" | 64 | Inventado + vocabulário esotérico |
| Natal sem nenhuma referência bíblica | 63–64 | Lc 1:26–38; 2:1–20; Mt 2:1–12 |
| "DIOS" = figura de Jesus numa história do AT | 4, 5 | Confunde a criança; evangélicos rejeitam imagem de Deus Pai. Representar Deus por **luz/voz** |
| "Pintar" de Samuel = menina moderna de uniforme; "Completo" do Samaritano = carinha sorridente; "Pintar" do Natal = vaca de desenho animado | 9, 41, 70 | Nada a ver com a história |
| "Letra cursiva": "estrella" ao lado do samaritano e "samaritana" ao lado da estrela | 58 | Imagem e palavra trocadas |

### 2.3 Falhas pedagógicas e de produto

1. **Só 3 histórias** em 92 páginas — volume inflado por repetição do mesmo template; após a 1ª sequência a criança já "viu tudo".
2. **Atividades desconectadas da história** (~70% das fichas): sino, envelope, lâmpada, coração, sol, lua, flor — nenhum aparece na história de Samuel. Colorir, labirinto, intruso, tres en raya e cálculo não ensinam nada bíblico.
3. **Faixa etária não indicada** e **sem progressão**: nada para 8–12 anos (que precisam de desafio), e muitas fichas exigem leitura de enunciado por quem ainda não lê.
4. **Sem instruções para pais/professores**: nenhum objetivo, nenhum "como aplicar", nenhuma pergunta de conversa, nenhuma oração.
5. **Sem gabarito** (sopa de letras, qué número falta, intruso, cálculo, localiza la imagen).
6. **Sem versículo para memorizar**, sem aplicação à vida da criança, sem ligação com o produto principal (o Estudio Cronológico).
7. **Página quebrada**: "¿Qué número falta?" do Samaritano com números sobrepostos (23/7, 33/9, 49/5, 14/28) — p.57. "Letra cursiva" com só 2 de 4 linhas preenchidas.
8. **Exercícios fonéticos que não funcionam em espanhol** (sílabas e letras contadas sobre palavras portuguesas; caixas em número fixo).
9. **Só imprimível**, 30 MB, exige tesoura, cola e **tinta colorida** (páginas com fundo azul-noite inteiro, p.88). No celular — onde a família latino-americana está — é inutilizável.
10. **Nada interativo, nada em áudio**, nada que a criança faça sozinha ou com os avós à distância.
11. **Sem identidade**: não tem marca, capa geral, índice nem tom de voz; parece material baixado da internet.
12. **Ecumenismo acidental**: mistura símbolos confessionais (cruz em cena do AT, auréolas, "padre") sem critério.

---

## 3. O que deveria estar lá e não está (priorizado)

**P0 — sem isso o presente não se sustenta**
1. Espanhol nativo latino-americano, revisado por humano (zero resquício de PT).
2. Fidelidade bíblica com referência em cada história + revisão teológica e ecumênica (católicos e evangélicos).
3. Muito mais histórias, **em ordem cronológica**, espelhando o Estudio Cronológico (é o diferencial do produto principal).
4. Cada atividade **ligada à história** (usa personagens, objetos e fatos dela).
5. **Faixa etária explícita** (3–5, 6–8, 9–12) com dificuldade adaptada.
6. **Guia para pais/avós**: objetivo, 3 perguntas, oração curta, gesto da semana.
7. **Versículo para memorizar** adaptado à idade.
8. **Jogável no celular** (tocar/arrastar), sem tesoura.

**P1 — o que torna "muito melhor e mais fácil"**
9. História **narrada em áudio** (a criança de 4 anos não lê; o avô cansado também agradece).
10. Instruções faladas nos jogos (botão de alto-falante no enunciado) — não depender de leitura.
11. **Imprimível gerado** a partir do mesmo conteúdo, em preto e branco, com gabarito, Carta e A4.
12. Recompensa leve: estampa colecionável por história + progresso visível ("Mi álbum").
13. Ligação com o Estudio: "Para los grandes: lee esta historia en el Estudio Cronológico".

**P2 — encanto e retenção**
14. Perfis de crianças ("¿Quién juega hoy?"), progresso por criança.
15. Leitura acompanhada (palavra destacada enquanto o áudio toca).
16. Modo "Noche de familia" (história + jogo + oração em 15 min, para projetar na TV).
17. Trilhas temáticas (Navidad, Semana Santa) destacadas no calendário litúrgico comum.

---

## 4. Nossa versão no app — "Rincón de los niños"

### 4.1 Conceito

> **"La Biblia contada en familia, una historia por semana."** 52 historias en orden cronológico, desde la Creación hasta el cielo nuevo. Cada una: escuchar (3 min) → jugar (3–5 min) → conversar (5 min) → imprimir si quieren.

Princípios:
- **Celular primeiro**, uma mão, alvos de toque ≥ 48 px, sem cronômetro para 3–5 anos, funciona offline (service worker já existe em `public/sw.js`).
- **Um adulto + uma criança**: o app fala com a criança (voz, cores) e, numa aba separada, com o adulto.
- **Nunca punir**: erro = "¡Casi! Intenta otra vez", sem X vermelho; sempre termina em celebração.
- **Ecumênico por construção**: texto bíblico fiel, tradições marcadas como tradição, sem símbolos confessionais nas cenas do AT, Deus Pai representado por luz/voz, "el Señor" (não "Jehová").
- **Tom de amor de Cristo**: temas duros (dilúvio, cruz, Golias) contados com sobriedade, foco em cuidado e promessa, nunca medo.
- **Privacidade infantil**: nenhum dado da criança sai do aparelho (apenas nome/apelido e faixa em `localStorage`), sem links externos, sem anúncios.

### 4.2 Encaixe na arquitetura atual

- `lib/catalog.ts`: o produto `actividades-ninos` deixa de usar `pendingGuide()` e passa a ter **seções por etapa** (abaixo), e cada lição vira uma história.
- Novo formato: `LessonFormat = 'texto' | 'audio' | 'actividad'` e, como já é feito com `plan`, um campo `ninos?: { id: string }` que aponta para o JSON carregado sob demanda (`lib/content/ninos/<id>.ts`, igual a `lib/content/plans/*`).
- Progresso/sequência/pontos: concluir o jogo = lição feita → entra no streak e na pontuação sem caso especial.
- Áudio: mesmo padrão do `cronologico-audio` — `/api/audio/actividades-ninos/<id>-<banda>` → bucket `audios`, arquivo `actividades-ninos/<id>-<banda>.mp3`.
- Imagens: `public/ninos/<id>/*.webp` (cenas) e `public/ninos/sprites/*.webp` (itens reutilizáveis); SVG de colorir em `public/ninos/<id>/colorear.svg`.
- Rotas sugeridas: `/(app)/ninos` (álbum + trilha), `/(app)/ninos/[id]` (história), `/(app)/ninos/[id]/jugar`, `/(app)/ninos/[id]/imprimir` (página print-optimized), `/(app)/ninos/[id]/padres`.
- Identidade: reaproveitar tokens de `app/globals.css` (creme `#f8f3e8`, ouro `#e0ac4a`, azul `#1b2d4b`, Literata para títulos, Figtree para botões) com uma **camada "infantil"**: cantos mais redondos, tipografia 20–24 px, cores de acento mais saturadas só dentro do Rincón. Capa do produto já existe (`OLIVE`, ícone `gift`).

### 4.3 As 52 histórias (ordem cronológica, 1 por semana)

Seções = etapas. ★ = MVP (12 histórias, 1 por mês; inclui as 3 do molde para superá-lo diretamente). "Estudio" = lição do Resumen Cronológico ligada.

| # | Historia | Referencia | Etapa | Estudio |
|---|---|---|---|---|
| 1 ★ | Dios crea el mundo | Gn 1–2 | Los comienzos | Génesis |
| 2 | El jardín y la primera desobediencia | Gn 3 | Los comienzos | Génesis |
| 3 ★ | Noé y el arca | Gn 6–9 | Los comienzos | Génesis |
| 4 | La torre de Babel | Gn 11 | Los comienzos | Génesis |
| 5 ★ | Abraham cuenta las estrellas | Gn 12; 15 | Los patriarcas | Génesis |
| 6 | Sara ríe: nace Isaac | Gn 18; 21 | Los patriarcas | Génesis |
| 7 | La escalera de Jacob | Gn 28 | Los patriarcas | Génesis |
| 8 | José y su túnica de colores | Gn 37 | Los patriarcas | Génesis |
| 9 ★ | José perdona a sus hermanos | Gn 42–45 | Los patriarcas | Génesis |
| 10 | Job confía en Dios | Job 1–2; 42 | Los patriarcas | Job |
| 11 | Moisés en la canasta | Éx 2 | Moisés y el desierto | Éxodo |
| 12 | La zarza que ardía | Éx 3 | Moisés y el desierto | Éxodo |
| 13 ★ | El paso del mar Rojo | Éx 14 | Moisés y el desierto | Éxodo |
| 14 | Pan del cielo: el maná | Éx 16 | Moisés y el desierto | Éxodo |
| 15 | Los Diez Mandamientos | Éx 20 | Moisés y el desierto | Éxodo (+ produto 10 Mandamientos) |
| 16 | Las murallas de Jericó | Jos 6 | La tierra prometida | Josué |
| 17 | Gedeón y los 300 | Jue 6–7 | La tierra prometida | Jueces |
| 18 | Rut, la amiga fiel | Rut 1–4 | La tierra prometida | Rut |
| 19 | Ana ora y Dios escucha | 1 Sm 1 | Jueces y reyes | 1 Samuel |
| 20 ★ | «Habla, Señor»: Dios llama a Samuel | 1 Sm 3 | Jueces y reyes | 1 Samuel |
| 21 | David, el pastorcito | 1 Sm 16; Sal 23 | Jueces y reyes | 1 Samuel / Salmos |
| 22 ★ | David y Goliat | 1 Sm 17 | Jueces y reyes | 1 Samuel |
| 23 | Salomón pide sabiduría | 1 R 3 | Jueces y reyes | 1 Reyes 1-11 |
| 24 | Elías y la viuda de Sarepta | 1 R 17 | Los profetas | 1 Reyes |
| 25 ★ | Jonás y el gran pez | Jon 1–4 | Los profetas | Jonás |
| 26 | Naamán y la niña valiente | 2 R 5 | Los profetas | — |
| 27 ★ | Daniel y los leones | Dn 6 | Exilio y regreso | Daniel |
| 28 | La reina Ester | Est 4–8 | Exilio y regreso | Ester |
| 29 | Nehemías reconstruye la muralla | Neh 2–6 | Exilio y regreso | Nehemías |
| 30 | El ángel visita a María | Lc 1:26–38 | Jesús nace | Lucas 1-2 |
| 31 ★ | Jesús nace en Belén | Lc 2:1–7 | Jesús nace | Lucas 1-2 |
| 32 | Los pastores y los ángeles | Lc 2:8–20 | Jesús nace | Lucas 1-2 |
| 33 | Los magos siguen la estrella | Mt 2:1–12 | Jesús nace | Mateo 1-2 |
| 34 | Jesús, a los 12 años, en el templo | Lc 2:41–52 | Jesús nace | Lucas 1-2 |
| 35 | El bautismo de Jesús | Mc 1:9–11 | Jesús enseña y sana | Marcos 1 |
| 36 | Pescadores de personas | Lc 5:1–11 | Jesús enseña y sana | Ministerio de Jesús |
| 37 | Agua hecha vino en Caná | Jn 2:1–11 | Jesús enseña y sana | Juan 1 / Ministerio (+ 43 Milagros) |
| 38 | Jesús calma la tormenta | Mc 4:35–41 | Jesús enseña y sana | Ministerio |
| 39 | La casa sobre la roca | Mt 7:24–27 | Jesús enseña y sana | Ministerio |
| 40 | El niño de los panes y los peces | Jn 6:1–14 | Jesús enseña y sana | Ministerio |
| 41 ★ | El buen samaritano | Lc 10:25–37 | Jesús enseña y sana | Ministerio |
| 42 | La oveja perdida | Lc 15:3–7 | Jesús enseña y sana | Ministerio |
| 43 | El padre que corre a abrazar | Lc 15:11–32 | Jesús enseña y sana | Ministerio |
| 44 | Jesús bendice a los niños | Mc 10:13–16 | Jesús enseña y sana | Ministerio |
| 45 | Bartimeo vuelve a ver | Mc 10:46–52 | Jesús enseña y sana | Ministerio |
| 46 | Zaqueo baja del árbol | Lc 19:1–10 | Jesús enseña y sana | Ministerio |
| 47 | Jesús entra en Jerusalén | Mt 21:1–11 | Pascua | Ministerio |
| 48 | La última cena: Jesús lava los pies | Jn 13:1–17 | Pascua | Ministerio |
| 49 ★ | La cruz y la tumba vacía | Lc 23–24 | Pascua | Ministerio |
| 50 | Pentecostés: llega el Espíritu Santo | Hch 2 | La Iglesia nace | Hechos |
| 51 | Pablo y Silas cantan en la cárcel | Hch 16:16–34 | La Iglesia nace | Hechos |
| 52 | Un cielo nuevo y una tierra nueva | Ap 21:1–5 | La Iglesia nace | Apocalipsis |

Notas: a ordem acompanha a do `catalog.ts` (Job depois de Gênesis, evangelhos harmonizados). Histórias 31–33 e 47–49 podem ser destacadas em dezembro e na Semana Santa (trilha sazonal, P2).

### 4.4 Anatomia de uma história (telas)

1. **Portada** — ilustração, título, referência, "10 min", seletor de idade (lembra a última escolha): *Semillitas* 3–5 · *Exploradores* 6–8 · *Detectives de la Biblia* 9–12.
2. **Escucha la historia** — 5 cenas deslizáveis (ilustração grande + texto curto). Texto por faixa: 3–5 ≈ 80–110 palavras no total, frases de ≤ 10 palavras, onomatopeias; 6–8 ≈ 180–230; 9–12 ≈ 260–320 com uma referência bíblica citada. Botão ▶ narra (TTS voz latino-americana neutra, pausas entre cenas; troca de cena automática pelas marcações de tempo).
3. **¡A jugar!** — 1 mini-jogo principal, mesma mecânica, dificuldade por faixa. Termina com celebração + estampa.
4. **Guarda en tu corazón** — versículo por faixa: 3–5 = frase-chave de 4–8 palavras ("Dios cumple sus promesas"); 6–8 = versículo adaptado marcado "(adaptado)"; 9–12 = texto da Reina-Valera 1960 (mesma tradução usada no resto do app) + mini-jogo "Arma el versículo" opcional.
5. **Para imprimir** — botão "Descargar hoja para imprimir" (2–4 páginas, P&B).
6. **Para papás y abuelos** (aba do adulto) — objetivo em 1 frase, "si pregunta…" (tema delicado), **3 perguntas** (recordar · sentir · vivir), oração de 1–2 linhas, gesto da semana, link "Lee más en el Estudio Cronológico".

### 4.5 Mini-jogos: componentes reutilizáveis

Todos vivem dentro de um `<ActivityShell>` comum: enunciado com botão de alto-falante, barra de progresso, "Intentar de nuevo", "¡Lo lograste!" (confete leve + som opcional), vibração curta (`navigator.vibrate` quando existir), respeita `prefers-reduced-motion`, retorna `onComplete({ aciertos, intentos, ms })`. Nenhum jogo depende de biblioteca externa (drag com Pointer Events; tudo em React + CSS).

| # | Componente | Mecânica no celular | 3–5 | 6–8 | 9–12 | MVP |
|---|---|---|---|---|---|---|
| 1 | `OrdenarEscenas` | Arrastar cartões (ou tocar dois para trocar) até a ordem certa | 3 imagens | 5 imagens | 6 cartões com frase | Sim |
| 2 | `QuizImagenes` | Pergunta falada + 2–4 respostas em imagem ou texto | 3 perguntas, 2 imagens | 5 perg., 3 opções | 6 perg., 4 opções, texto | Sim |
| 3 | `Memoria` | Virar cartas e achar pares | 6 cartas imagem=imagem | 12 cartas imagem=palavra | 16 cartas personagem=frase dita | Sim |
| 4 | `Colorear` | Tocar numa região do SVG preenche com a cor escolhida (sem pincel livre); salvar PNG | 8–12 regiões, 6 cores | 20–30 regiões | 40+ regiões + "colorir por número" | Sim |
| 5 | `SopaLetras` | Deslizar o dedo sobre a grade; palavra achada fica marcada | — | 6×6, 4 palavras, só → e ↓ | 10×10, 8 palavras, diagonais | Sim |
| 6 | `VerdaderoFalso` | Dois botões grandes (ou swipe) + "¿Por qué?" explicado após responder | 3 frases faladas | 6 frases | 8 frases com referência | Sim |
| 7 | `Emparejar` | Arrastar A até B (Noé→arca, David→honda, Zaqueo→árbol) | 3 pares | 5 pares | 6 pares com versículo | P1 |
| 8 | `BuscaEnEscena` | Tocar 5 itens escondidos numa ilustração (hotspots) | 3 itens grandes | 5 itens | 7 itens pequenos | P1 |
| 9 | `ArmaVersiculo` | Blocos de palavras para montar o versículo; a cada acerto esconde palavras (memorização progressiva) | — | 4–6 blocos | 8–12 blocos | P1 |
| 10 | `Laberinto` | Arrastar o dedo do personagem ao destino (gerado por seed) | 5×5 | 8×8 | 12×12 | P1 |
| 11 | `Rompecabezas` | Encaixar peças da ilustração da história | 4 peças | 9 peças | 16 peças | P2 |
| 12 | `CuentaYToca` | Contar itens na cena e tocar o número | até 5 | até 10 | — | P2 |

Regras de dificuldade ficam **no JSON** (não no código): o mesmo componente recebe `niveles['3-5'|'6-8'|'9-12']`. Geradores determinísticos (sopa de letras, labirinto) usam `seed` para que a tela e o PDF mostrem a mesma grade e o gabarito bata.

### 4.6 Imprimível gerado (não PDF estático)

- Rota `/ninos/[id]/imprimir?edad=6-8&papel=carta` renderiza HTML com CSS `@page` (Carta 8,5×11 como padrão — é o tamanho comum no México, Colômbia etc.; A4 opcional) → botão "Descargar / Imprimir" chama `window.print()` (no Android e iOS abre "Salvar como PDF"). Zero dependência; se um dia quisermos PDF de servidor, o mesmo HTML vai para Puppeteer.
- Sempre **preto e branco, traço limpo, sem fundos chapados** (economia de tinta).
- Conteúdo padrão (2–4 páginas): (1) atividade principal imprimível do tipo definido no JSON (colorir o mesmo SVG, sopa de letras com a mesma seed, labirinto, tiras para recortar e ordenar); (2) cartão do versículo recortável "para la nevera"; (3) "Dibuja o escribe tu oración"; (4) **gabarito + as 3 perguntas para o adulto**.
- Cabeçalho com "Nombre" e "Fecha" (corrigindo o "DATOS" do molde), marca La Biblia Interior discreta no rodapé.

### 4.7 Modelo de dados

Tipos (proposta para `lib/content/ninos/types.ts`):

```ts
export type Banda = '3-5' | '6-8' | '9-12'
type PorBanda<T> = Partial<Record<Banda, T>>

export interface Imagen { src: string; alt: string }

export interface Escena {
  id: string
  img: Imagen
  texto: PorBanda<string>
  /** Segundo em que a cena começa no áudio de cada faixa (troca automática de cena). */
  audioInicio?: PorBanda<number>
}

export type Juego =
  | { tipo: 'ordenar'; enunciado: string; niveles: PorBanda<{ items: { id: string; img?: Imagen; texto?: string }[] }> }
  | { tipo: 'quiz'; enunciado: string; niveles: PorBanda<{ preguntas: { texto: string; opciones: { texto?: string; img?: Imagen; correcta?: boolean }[]; explicacion?: string }[] }> }
  | { tipo: 'memoria'; enunciado: string; niveles: PorBanda<{ pares: { a: { texto?: string; img?: Imagen }; b: { texto?: string; img?: Imagen } }[] }> }
  | { tipo: 'colorear'; enunciado: string; svg: string; niveles: PorBanda<{ paleta: string[] }> }
  | { tipo: 'sopa'; enunciado: string; niveles: PorBanda<{ tamano: number; palabras: string[]; diagonales: boolean; seed: number }> }
  | { tipo: 'verdadero-falso'; enunciado: string; niveles: PorBanda<{ frases: { texto: string; verdadera: boolean; porque: string }[] }> }
  // emparejar | busca-en-escena | arma-versiculo | laberinto | rompecabezas | cuenta-y-toca seguem o mesmo padrão

export interface HistoriaNinos {
  id: string
  orden: number
  titulo: string
  referencia: string
  testamento: 'AT' | 'NT'
  etapa: string
  estudio?: { productId: 'cronologico'; lessonId: string }
  minutos: number
  portada: Imagen
  escenas: Escena[]
  audio: PorBanda<string>
  vocabulario: { palabra: string; img: Imagen; definicion: string }[]
  versiculo: PorBanda<{ texto: string; referencia: string; fuente: 'RVR1960' | 'adaptado' }>
  juego: Juego
  imprimible: { principal: 'colorear' | 'sopa' | 'laberinto' | 'ordenar-recortar'; porBanda?: PorBanda<'colorear' | 'sopa' | 'laberinto' | 'ordenar-recortar'>; extras: ('versiculo-tarjeta' | 'mi-oracion' | 'respuestas')[] }
  padres: {
    objetivo: string
    siPregunta?: { pregunta: string; respuesta: string }[]
    preguntas: { recordar: string; sentir: string; vivir: string }
    oracion: string
    gesto: string
  }
  estampa: Imagen & { nombre: string }
  revision: { teologica: string; ecumenica: boolean; fecha: string }
}
```

**Exemplo completo — Noé (história 3):**

```json
{
  "id": "noe",
  "orden": 3,
  "titulo": "Noé y el arca",
  "referencia": "Génesis 6–9",
  "testamento": "AT",
  "etapa": "Los comienzos",
  "estudio": { "productId": "cronologico", "lessonId": "genesis" },
  "minutos": 10,
  "portada": { "src": "/ninos/noe/portada.webp", "alt": "Noé sonríe junto al arca de madera mientras una fila de animales sube por la rampa" },
  "escenas": [
    {
      "id": "dios-habla",
      "img": { "src": "/ninos/noe/1-dios-habla.webp", "alt": "Noé mira al cielo iluminado por una luz cálida" },
      "texto": {
        "3-5": "Noé amaba a Dios. Un día, Dios le dijo: «Construye un barco muy, muy grande: un arca».",
        "6-8": "Hace muchísimo tiempo, la gente se había olvidado de Dios y se hacía daño. Pero Noé era diferente: amaba a Dios y lo escuchaba. Un día, Dios le dijo: «Viene una gran inundación. Construye un arca, un barco enorme, para salvar a tu familia y a los animales».",
        "9-12": "La tierra se había llenado de violencia, y eso entristecía el corazón de Dios. En medio de todo, Noé caminaba con Dios (Génesis 6:9). Dios le confió un plan: construir un arca de madera, más larga que una cancha de fútbol y alta como un edificio de cuatro pisos, para proteger a su familia y a los animales del diluvio."
      },
      "audioInicio": { "3-5": 0, "6-8": 0, "9-12": 0 }
    },
    {
      "id": "construyen",
      "img": { "src": "/ninos/noe/2-construyen.webp", "alt": "Noé y sus tres hijos martillan tablas bajo un cielo despejado" },
      "texto": {
        "3-5": "Noé y su familia trabajaron mucho. ¡Toc, toc, toc! Y el arca quedó lista.",
        "6-8": "Noé obedeció, aunque todavía no llovía. Con sus hijos Sem, Cam y Jafet cortó madera, martilló y cubrió el arca con brea para que no entrara el agua.",
        "9-12": "Noé hizo «conforme a todo lo que Dios le mandó» (Génesis 6:22), aunque no se veía ni una nube. Confiar en Dios, a veces, es hacer lo correcto antes de ver el resultado."
      },
      "audioInicio": { "3-5": 9.5, "6-8": 21, "9-12": 27 }
    },
    {
      "id": "animales",
      "img": { "src": "/ninos/noe/3-animales.webp", "alt": "Parejas de leones, jirafas, elefantes y patos entran al arca" },
      "texto": {
        "3-5": "Llegaron los animales de dos en dos: ¡leones, jirafas, elefantes y patitos! Y Dios cerró la puerta.",
        "6-8": "Llegaron los animales: una pareja de cada especie. Noé, su esposa, sus hijos y las esposas de sus hijos también entraron: ¡ocho personas! Y el Señor mismo cerró la puerta del arca.",
        "9-12": "Entraron parejas de todos los animales —y de algunos, siete parejas (Génesis 7:2)—, junto con las ocho personas de la familia. Entonces el Señor cerró la puerta (Génesis 7:16): Dios mismo cuidaba a los que estaban dentro."
      },
      "audioInicio": { "3-5": 16, "6-8": 34, "9-12": 44 }
    },
    {
      "id": "lluvia-paloma",
      "img": { "src": "/ninos/noe/4-lluvia-paloma.webp", "alt": "El arca flota tranquila sobre el agua; una paloma vuela con una ramita de olivo" },
      "texto": {
        "3-5": "Llovió y llovió… ¡cuarenta días y cuarenta noches! Pero dentro del arca todos estaban seguros. Un día, una palomita trajo una hojita verde.",
        "6-8": "Llovió cuarenta días y cuarenta noches. El agua lo cubrió todo, pero el arca flotaba y dentro estaban a salvo. Después, Noé soltó una paloma. Una tarde volvió con una hoja de olivo en el pico: ¡ya había tierra seca!",
        "9-12": "Fueron cuarenta días de lluvia y muchos meses sobre el agua. Cuando el arca se detuvo sobre los montes de Ararat, Noé envió un cuervo y después una paloma. La segunda vez, la paloma regresó con una hoja de olivo: la tierra volvía a respirar (Génesis 8:11)."
      },
      "audioInicio": { "3-5": 24, "6-8": 47, "9-12": 63 }
    },
    {
      "id": "arcoiris",
      "img": { "src": "/ninos/noe/5-arcoiris.webp", "alt": "La familia de Noé, fuera del arca, mira un gran arcoíris" },
      "texto": {
        "3-5": "Todos salieron del arca. «¡Gracias, Dios!», dijo Noé. Y en el cielo apareció un arcoíris: Dios cumple sus promesas.",
        "6-8": "Al salir, lo primero que hizo Noé fue dar gracias a Dios. Entonces Dios puso un arcoíris en las nubes y prometió: «Nunca más un diluvio destruirá la tierra». Cada vez que veas un arcoíris, recuerda: Dios cumple lo que promete.",
        "9-12": "Noé construyó un altar y adoró a Dios. Dios hizo un pacto —una promesa solemne— con Noé, con sus descendientes y con todos los seres vivos, y puso el arcoíris como señal (Génesis 9:12-17). La historia no termina en el agua: termina en una promesa de vida."
      },
      "audioInicio": { "3-5": 35, "6-8": 65, "9-12": 86 }
    }
  ],
  "audio": {
    "3-5": "/api/audio/actividades-ninos/noe-3-5",
    "6-8": "/api/audio/actividades-ninos/noe-6-8",
    "9-12": "/api/audio/actividades-ninos/noe-9-12"
  },
  "vocabulario": [
    { "palabra": "arca", "img": { "src": "/ninos/sprites/arca.webp", "alt": "Arca de madera" }, "definicion": "Un barco grande de madera, como una casa que flota." },
    { "palabra": "paloma", "img": { "src": "/ninos/sprites/paloma.webp", "alt": "Paloma blanca" }, "definicion": "Un ave blanca; en esta historia trajo la buena noticia." },
    { "palabra": "olivo", "img": { "src": "/ninos/sprites/rama-olivo.webp", "alt": "Rama de olivo" }, "definicion": "Un árbol de hojas verdes y plateadas." },
    { "palabra": "promesa", "img": { "src": "/ninos/sprites/arcoiris.webp", "alt": "Arcoíris" }, "definicion": "Cuando alguien dice «lo haré» y lo cumple." }
  ],
  "versiculo": {
    "3-5": { "texto": "Dios cumple sus promesas.", "referencia": "Génesis 9:13-15", "fuente": "adaptado" },
    "6-8": { "texto": "Pondré mi arcoíris en las nubes: será la señal de mi promesa.", "referencia": "Génesis 9:13", "fuente": "adaptado" },
    "9-12": { "texto": "Mi arco he puesto en las nubes, el cual será por señal del pacto entre mí y la tierra.", "referencia": "Génesis 9:13", "fuente": "RVR1960" }
  },
  "juego": {
    "tipo": "ordenar",
    "enunciado": "¿Qué pasó primero? Pon la historia en orden.",
    "niveles": {
      "3-5": { "items": [
        { "id": "construyen", "img": { "src": "/ninos/noe/2-construyen.webp", "alt": "Construyen el arca" } },
        { "id": "animales", "img": { "src": "/ninos/noe/3-animales.webp", "alt": "Entran los animales" } },
        { "id": "arcoiris", "img": { "src": "/ninos/noe/5-arcoiris.webp", "alt": "El arcoíris" } }
      ] },
      "6-8": { "items": [
        { "id": "dios-habla", "img": { "src": "/ninos/noe/1-dios-habla.webp", "alt": "Dios habla con Noé" } },
        { "id": "construyen", "img": { "src": "/ninos/noe/2-construyen.webp", "alt": "Construyen el arca" } },
        { "id": "animales", "img": { "src": "/ninos/noe/3-animales.webp", "alt": "Entran los animales" } },
        { "id": "lluvia-paloma", "img": { "src": "/ninos/noe/4-lluvia-paloma.webp", "alt": "La lluvia y la paloma" } },
        { "id": "arcoiris", "img": { "src": "/ninos/noe/5-arcoiris.webp", "alt": "El arcoíris" } }
      ] },
      "9-12": { "items": [
        { "id": "a", "texto": "Dios le pide a Noé construir un arca." },
        { "id": "b", "texto": "Noé obedece aunque no se ve ninguna nube." },
        { "id": "c", "texto": "El Señor cierra la puerta del arca." },
        { "id": "d", "texto": "El arca se detiene sobre los montes de Ararat." },
        { "id": "e", "texto": "La paloma regresa con una hoja de olivo." },
        { "id": "f", "texto": "Dios pone el arcoíris como señal de su pacto." }
      ] }
    }
  },
  "imprimible": {
    "principal": "colorear",
    "porBanda": { "9-12": "sopa" },
    "extras": ["versiculo-tarjeta", "mi-oracion", "respuestas"]
  },
  "padres": {
    "objetivo": "Que el niño descubra que Dios cuida a los que confían en Él y siempre cumple sus promesas.",
    "siPregunta": [
      {
        "pregunta": "¿Y las personas que no entraron en el arca?",
        "respuesta": "Responde con calma y sin asustar: «A Dios le dolía mucho el mal que había en el mundo. Por eso hizo una promesa: nunca más un diluvio. Dios quiere salvar, y por eso después nos envió a Jesús». No hace falta dar más detalles a los más pequeños."
      }
    ],
    "preguntas": {
      "recordar": "¿Qué traía la paloma en el pico cuando volvió al arca?",
      "sentir": "¿Cómo crees que se sentía Noé construyendo un barco sin ver lluvia? ¿Alguna vez hiciste algo bueno aunque nadie entendiera por qué?",
      "vivir": "Dios cumple sus promesas. ¿Qué promesa pequeña podemos cumplir nosotros esta semana en casa?"
    },
    "oracion": "Gracias, Dios, porque nos cuidas y siempre cumples tus promesas. Ayúdanos a cumplir las nuestras. Amén.",
    "gesto": "Esta semana, cada vez que vean un arcoíris (o dibujen uno), digan juntos: «Dios cumple sus promesas»."
  },
  "estampa": { "src": "/ninos/estampas/noe.webp", "alt": "Estampa: arcoíris sobre el arca", "nombre": "El arcoíris de la promesa" },
  "revision": { "teologica": "pendiente", "ecumenica": false, "fecha": "" }
}
```

(Os tempos de `audioInicio` acima são ilustrativos; na produção saem do alinhamento Whisper do áudio gerado — o mesmo processo já usado no pipeline de vídeos.)

### 4.8 Ilustrações: como produzir com estilo consistente

**Direção de arte ("Biblia de estampas")** — um documento de 2 páginas que vale para todas as imagens:
- Estilo: ilustração infantil **acuarela suave + contorno fino marrom**, formas arredondadas, proporção de cabeça 1:4 (fofo, mas não "cabeçorra" chibi — nos diferencia do molde), texturas de papel leves.
- Paleta ancorada no app: creme `#f8f3e8`, ocre/ouro `#e0ac4a`, terracota `#c2410c`, azul-noite `#1b2d4b`, verde-oliva; céus claros; noite em azul suave (nunca preto chapado).
- **Rigor histórico-cultural**: roupas e casas do antigo Oriente Médio, pele morena, Jesus judeu do século I (não loiro), nada moderno nos cenários.
- **Regras ecumênicas**: sem auréolas, sem cruz/igreja em cenas do AT, Deus Pai sempre como luz quente/raios/voz (nunca figura humana), Maria com manto azul simples e expressão serena (respeitoso para católicos, neutro para evangélicos), anjos sem asas "de boneco" exageradas.
- **Regras de segurança infantil**: sem sangue (curativo/atadura), sem armas em cena de ataque (Golias: a pedrinha e a funda, o gigante de costas/caindo sem ferimento), dilúvio sem pessoas se afogando, cruz mostrada de longe/silhueta ao amanhecer para 3–5.

**Pipeline**
1. **Model sheets** dos ~45 personagens recorrentes (Noé, Abraham, Sara, José, Moisés, Davi, Samuel menino/adulto, Maria, José, Jesus menino/adulto, Pedro, Zaqueu…): frente, 3/4, perfil, 3 expressões. Aprovadas uma vez, viram referência de todas as cenas.
2. **Geração** com modelo que aceita imagens de referência para manter o personagem (ex.: Gemini 2.5 Flash Image, GPT-image-1 ou FLUX.1 Kontext): prompt-template fixo (estilo + paleta + regras) + referência do personagem + descrição da cena. 3–4 variações por cena, escolher 1.
3. **Sprites** (arca, paloma, funda, pães…) gerados isolados, fundo removido, 512 px WebP transparente — reutilizados entre histórias e jogos.
4. **Páginas de colorir**: gerar versão "line art limpa" da mesma cena → vetorizar (vtracer/potrace) → limpar no Inkscape/Illustrator em **regiões fechadas** (necessário para o `Colorear` preencher por toque) → SVG < 60 KB.
5. **Estampas** do álbum: 1 por história, moldura redonda padrão.
6. **Revisão humana** com checklist (anatomia, mãos, texto parasita na imagem, anacronismos, regras ecumênicas e de segurança) + retoque.

**Licença e direitos**
- Nunca usar como referência/entrada imagens do concorrente nem de bancos de clipart; nunca pedir "no estilo de [artista/marca]".
- Usar apenas modelos cujos termos cedem ao usuário o uso comercial das saídas (Google, OpenAI e FLUX Pro via API cedem hoje — **reconferir os termos vigentes na data da produção**).
- Saída de IA pura pode não ser protegível por direito autoral; o retoque humano, a composição e a coleção como um todo reforçam nossa titularidade. O risco relevante é o de **infringir** — mitigado pelas duas regras acima.
- Manter `docs/entregaveis/ninos-ilustraciones.csv` (arquivo, modelo, data, prompt, seed, quem revisou) como trilha de auditoria.

### 4.9 Estimativa de volume

| Item | MVP (12) | Completo (52) |
|---|---|---|
| Textos de história (5 cenas × 3 faixas) | ~7.500 palavras | ~32.000 palavras |
| Guias para pais + perguntas + jogos (dados) | ~4.000 palavras | ~17.000 palavras |
| Áudios (3 por história, 0,7–2,5 min) | 36 arquivos ≈ 55 min | 156 arquivos ≈ 4 h |
| Ilustrações de cena (capa + 5) | 72 | 312 |
| Sprites reutilizáveis | ~90 | ~300 |
| SVG para colorir | 12 | 52 |
| Estampas | 12 | 52 |
| Model sheets de personagens | ~15 | ~45 |
| Componentes de jogo | 6 | 12 |
| JSON por história | ~10 KB | ~520 KB total (carregado sob demanda) |

**Esforço aproximado:** desenvolvimento (shell, 6 jogos, telas, imprimível, álbum, integração ao catálogo) 10–14 dias; +6 jogos P1/P2 mais 6–8 dias. Conteúdo com IA + revisão teológica/ecumênica ≈ 3 h por história; ilustrações ≈ 2–3 h por história (mais ~1 semana para os model sheets). MVP de 12 histórias ≈ 3 semanas de uma pessoa em conteúdo/arte em paralelo ao dev. Custo de geração de imagem na ordem de dezenas a poucas centenas de dólares para as ~1.500–2.000 gerações do conjunto completo; TTS pelo pool já existente.

### 4.10 Comparação direta

| | Molde | Rincón de los niños |
|---|---|---|
| Histórias | 3, fora de ordem | 52 cronológicas (MVP 12, incluindo as 3 do molde) |
| Idioma | Tradução automática PT→ES com erros | Espanhol latino nativo revisado |
| Fidelidade bíblica | Erros e invenções | Referência por cena + revisão teológica e ecumênica |
| Idade | Não indicada (~4–7) | 3 faixas com texto, jogo e versículo próprios |
| Formato | Só impressão, tesoura e cola, 30 MB | Jogável no celular + PDF P&B gerado |
| Áudio | Não | História narrada + enunciados falados |
| Pais/avós | Nada | Objetivo, "si pregunta…", 3 perguntas, oração, gesto |
| Versículo | Não | Sim, por faixa |
| Gabarito | Não | Automático no jogo e no PDF |
| Ligação com o produto principal | Nenhuma | Cada história aponta para a lição do Estudio |

---

## 5. Checklist de produção

**Fase A — Fundamentos**
1. Aprovar a lista das 52 histórias e as 12 do MVP (seção 4.3) com o time.
2. Escrever o guia editorial infantil (tom de amor de Cristo, regras ecumênicas, temas delicados, comprimento por faixa, política de versículos RVR1960 × adaptado) e **conferir a política de citação da Reina-Valera 1960** das Sociedades Bíblicas Unidas para uso no app e nos PDFs (incluir a nota de copyright exigida).
3. Escrever a "Biblia de estampas" (direção de arte) e gerar 3 cenas-piloto até aprovar o estilo.
4. Produzir e aprovar os model sheets dos personagens do MVP (~15).
5. Congelar o schema `HistoriaNinos` (seção 4.7) em `lib/content/ninos/types.ts`.

**Fase B — Engenharia**
6. Estender `LessonFormat` com `'actividad'` e `Lesson` com `ninos?: { id }`; trocar `pendingGuide()` do `actividades-ninos` por seções por etapa.
7. Loader sob demanda de `lib/content/ninos/<id>.ts` (mesmo padrão dos planos).
8. Telas: Portada → Escucha → Juega → Versículo → Imprimir → Padres; seletor de faixa persistido em `localStorage` (com try/catch).
9. Player de história com troca de cena por `audioInicio` reaproveitando `AudioPlayer`/rota `/api/audio`.
10. `ActivityShell` (enunciado com áudio, progresso, retry, celebração, vibração, reduced-motion).
11. Componentes MVP: `OrdenarEscenas`, `QuizImagenes`, `Memoria`, `Colorear`, `SopaLetras` (gerador com seed + gabarito), `VerdaderoFalso`.
12. Rota `/ninos/[id]/imprimir` com CSS `@page` Carta/A4, P&B, gabarito e página do adulto; testar "Salvar como PDF" no Android Chrome e iOS Safari.
13. Álbum de estampas + integração com progresso/sequência/pontos existentes.
14. Cache offline (service worker) das histórias abertas: JSON, imagens e áudio.
15. Acessibilidade: `alt` em toda imagem, alvos ≥ 48 px, contraste AA, operação por toque sem arrastar (alternativa "tocar para trocar").

**Fase C — Conteúdo do MVP (repetir por história)**
16. Rascunho do JSON com IA a partir do texto bíblico (5 cenas × 3 faixas, jogo, versículo, guia dos pais).
17. Revisão bíblica: cada afirmação conferida com a referência; tradições marcadas como tradição.
18. Revisão ecumênica (um leitor católico e um evangélico) e de tom infantil.
19. Revisão de espanhol latino neutro por nativo (evitar regionalismos fortes).
20. Gerar ilustrações (capa + 5 cenas), sprites novos, SVG de colorir e estampa; revisar com o checklist visual; registrar no CSV de licenças.
21. Gerar os 3 áudios (TTS), alinhar com Whisper e preencher `audioInicio`; subir para `audios/actividades-ninos/`.
22. Testar a história completa no celular nas 3 faixas + imprimir o PDF de verdade.
23. Marcar `revision.teologica`, `revision.ecumenica` e `fecha` no JSON.

**Fase D — Validação e lançamento**
24. Teste com 5–8 famílias reais (pelo menos uma com avós e uma com criança de 3–4 anos): tempo por história, onde travam, se o adulto usou as perguntas.
25. Ajustar dificuldade dos níveis conforme o teste.
26. Atualizar `short`/`description` do produto no catálogo e a copy do funil para "52 historias en orden cronológico, para jugar en el celular y conversar en familia".
27. Lançar com as 12 do MVP e comunicar o calendário ("una historia nueva cada semana").
28. Produzir as 40 restantes em lotes de 4 por semana, com os jogos P1 (`Emparejar`, `BuscaEnEscena`, `ArmaVersiculo`, `Laberinto`) entrando a partir do lote 2.
29. P2: perfis de crianças, leitura acompanhada, modo "Noche de familia", trilhas de Navidad e Semana Santa, `Rompecabezas` e `CuentaYToca`.
30. Revisão trimestral: métricas de conclusão por história/jogo, correções reportadas pela comunidade, reconferência dos termos de licença dos modelos de imagem.
