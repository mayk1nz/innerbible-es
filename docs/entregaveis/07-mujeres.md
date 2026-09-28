# Presente 7 — «Mujeres Virtuosas de la Biblia»

> Análise do molde do concorrente + especificação da nossa versão dentro do app La Biblia Interior.
> Fonte analisada: `D:\1 youtube auto\Apps - Daniel asafh\entregaveis front\regalo 7 - mujeres-virtuosas.pdf` (lido na íntegra, 13 páginas).
> Destino no app: produto `mujeres-virtuosas` em `lib/catalog.ts` (hoje `sections: pendingGuide()`, paleta `ROSE`, ícone `heart`, oferta `front`).
> Regra de ouro: o PDF é só referência de **tema**. Nenhuma frase, título de ficha, epíteto ou imagem dele entra no app. Todo o texto é nosso.

---

## 1. O que é (o molde do concorrente)

### 1.1 Ficha técnica

| Item | Valor |
|---|---|
| Páginas | **13** (capa + introdução + 10 fichas + conclusão) |
| Formato | Retrato 900 × 1600 pt (proporção 9:16, "tela de celular"), gerado com pdf-lib + Ghostscript, set/2025 |
| Volume de texto | **menos de 1.000 palavras no total** (cada ficha tem ~60–80 palavras) |
| Versão bíblica | Nenhuma. Só referências; **nenhum versículo é citado por extenso** |
| Idioma | Espanhol traduzido às pressas: a **capa está em português** ("Mulheres virtuosas", repetido como título e subtítulo) e a imagem da introdução mostra um livro com "Stories of Biblical Women" **em inglês** |

### 1.2 Lista completa, na ordem do PDF

| Pág. | Ficha | Pasajes clave citados |
|---|---|---|
| 1 | Capa — "Mulheres virtuosas" (em português) | — |
| 2 | Introducción (objetivo + importância das mulheres na Bíblia) | — |
| 3 | Eva | Gn 1:26-31; Gn 3:1-24 |
| 4 | Sara | Gn 12:1-7; Gn 21:1-7; Hb 11:11-12 |
| 5 | Débora | Jz 4:1-16; Jz 5:1-31 |
| 6 | Rut | Rt 1; Rt 2; Rt 4:13-17 |
| 7 | Ester | Et 1:1-22; Et 4:12-16; Et 7:1-10 |
| 8 | Ana (mãe de Samuel) | 1 Sm 1:9-20; 1 Sm 2:1-10 |
| 9 | María, madre de Jesús | Lc 1:26-38; Mt 1:18-25; Jo 2:1-11 |
| 10 | Marta y María (dupla) | Lc 10:38-42; Jo 11:1-44 |
| 11 | Priscila | At 18:1-3; At 18:24-28; Rm 16:3-5 |
| 12 | La Mujer Virtuosa de Proverbios 31 (não é uma pessoa, é um poema) | Pv 31:10-31 |
| 13 | Conclusión (resumo + "desafío para los lectores") | — |

Na prática: **10 fichas = 9 mulheres históricas + 1 dupla + 1 retrato poético** (11 mulheres nomeadas).

### 1.3 Campos de cada ficha

Todas as fichas têm exatamente a mesma estrutura, mínima:

1. **Nome + epíteto** ("Sara – Fe y Paciencia").
2. **Pasajes clave** (2–3 referências, sem texto).
3. **Virtudes** (2–3 frases curtas em caixas/bullets).
4. **Lección y Aplicación** (1 frase genérica).

Não existem: história narrada, contexto/época, significado do nome, versículo por extenso, oração, perguntas, aplicação concreta, conteúdo infantil, ligação com Jesus ou com a linha do tempo.

### 1.4 Visual

- Topo de cada página: **faixa com pintura gerada por IA** (~25% da altura), estilo óleo renascentista, figuras de aparência europeia, tons vinho/azul/dourado.
- Fundo creme liso; títulos em **serifa bordô**; subtítulo "Virtudes:" em bordô; caixas com borda ou fundo **lilás**; texto corrido em cinza pequeno.
- O layout das caixas varia de página para página (bullets / 2 caixas empilhadas / 2 colunas) sem motivo, o que parece desleixo.
- **~40–50% de cada página fica em branco** (a metade inferior está vazia em todas as fichas).
- Fonte do corpo muito pequena para a tela de celular — **ruim para idosos**.
- Bonito à primeira vista, mas "página de apresentação", não material de estudo.

---

## 2. Falhas e brechas

### 2.1 Erros e descuidos

| # | Onde | Problema |
|---|---|---|
| E1 | Capa | Título em **português** ("Mulheres virtuosas") num produto em espanhol; o subtítulo repete o título (placeholder esquecido). |
| E2 | Introdução | Imagem com texto em **inglês** ("Stories of Biblical Women"). |
| E3 | Ordem | Não é cronológica nem por livro: **Ester (c. 480 a.C., pós-exílio) aparece antes de Ana (c. 1100 a.C.)**. Num presente que acompanha um *Estudio Cronológico*, isso contradiz o produto principal. |
| E4 | Eva | Lista como "virtude" "*su decisión y los desafíos que enfrentó en el Edén*" e a lição elogia "*la capacidad de Eva de elegir, incluso frente a la tentación*". Soa como se a desobediência fosse virtude. Omite o que o texto dá de esperança: a promessa de Gn 3:15, o "*he adquirido varón con la ayuda de Jehová*" (Gn 4:1) e Set (Gn 4:25). |
| E5 | Sara | "*Fe inquebrantable*": idealiza. O texto mostra Sara rindo (Gn 18:12) e entregando Agar a Abraão (Gn 16). Hb 11:11 honra sua fé **apesar** disso — a mensagem de graça se perde. Gn 12:1-7 praticamente não fala dela (só v. 5); falta Gn 18. |
| E6 | Ester | Cita **Ester 1** inteiro, que é sobre a rainha **Vasti**, não sobre Ester; falta o cap. 2 (como ela chega ao palácio) e a frase central de 4:14 ("*para esta hora*") não é destacada. |
| E7 | Ana | "*Fe en Dios para atender a sus deseos*" — enquadramento de "Deus atende meus desejos" (vizinho da teologia da prosperidade). O cântico de Ana (1 Sm 2), que é teologia pura (Deus levanta o pobre do pó), é citado mas não explorado. |
| E8 | María | A "virtude" "*acompañando a Jesús hasta la cruz*" não tem referência (falta Jo 19:25-27). Faltam o Magnificat (Lc 1:46-55), Lc 2:19 e At 1:14. A palavra "*sumisión*" sem contexto pode soar mal para leitoras de hoje. |
| E9 | Rut | "*La fidelidad a Dios nos lleva a ser bendecidos*" — retribuição simplista ("seja fiel → ganhe bênção"). Omite o essencial: Rut é **estrangeira (moabita)**, Booz é o **redentor (go'el)**, e dela vem Davi e **Jesus** (Mt 1:5). |
| E10 | Marta y María | Dupla que tende a reduzir Marta a "a que errou". Omite a **confissão de fé de Marta** (Jo 11:27), uma das mais fortes dos evangelhos, e a unção de Betânia (Jo 12:1-8). |
| E11 | Provérbios 31 | Apresentado como "*modelo para todas las mujeres*" — vira **lista de exigências** e gera culpa. Não explica que é um poema acróstico (cada verso começa com uma letra do alfabeto hebraico), dito pela mãe do rei Lemuel (Pv 31:1). Perde a ponte mais bonita: **Rut é a única mulher chamada "mujer virtuosa" na narrativa** (Rt 3:11). |
| E12 | Geral | Nenhum versículo por extenso, nenhuma versão bíblica indicada, nenhuma fonte. |

### 2.2 Brechas de conteúdo

- **Só 11 mulheres.** Faltam praticamente todas as que o público latino conhece da pregação e da catequese: Agar, Rebeca, Raquel, Lea, Jocabed, as parteiras Sifrá e Fuá, Miriam, Rahab, Jael, Noemí, Abigail, a viúva de Sarepta, a sunamita, a menina escrava da casa de Naamã, Hulda, Elisabete, Ana a profetisa, a samaritana, a mulher do fluxo de sangue, a cananeia, a pecadora perdoada (Lc 7), a viúva das duas moedas, Joana e Susana, María Magdalena, Tabita/Dorcas, Lídia, Rode, Febe, Loide e Eunice.
- **Zero conteúdo pós-ressurreição de peso**: María Magdalena — a primeira testemunha do Cristo ressuscitado (Jo 20:11-18) — não aparece.
- **Só uma mulher do livro de Atos/cartas** (Priscila). A igreja primitiva está cheia de mulheres nomeadas (Rm 16 cita várias).
- **Nenhuma mulher idosa como protagonista** (Noemí, Isabel, Ana a profetisa, Loide a avó) — justamente para um público que inclui idosos.
- **Nenhuma história de menina** (a serva de Naamã, Rode) — para um público que inclui crianças.
- **Nenhuma mulher "de fora"** (Agar, Rahab, Rut como estrangeira, a samaritana, a cananeia) — tema fortíssimo para latino-americanos migrantes.

### 2.3 Brechas de abordagem

- **Moralismo**: cada ficha termina em "seja assim" ("*ser una líder valiente*", "*modelo para todas las mujeres*"). Nada diz o que **Deus fez** — o centro da história é a virtude dela, não a graça dele.
- **Personagens de gesso**: só qualidades, nenhuma luta. As mulheres da Bíblia riem de Deus, murmuram, choram, manipulam, se afanam — e Deus age mesmo assim. Isso é o que consola.
- **Aplicação vazia** para a mulher de hoje: nada sobre viuvez, infertilidade, cuidar de pais idosos, migração, luto, solidão, trabalho, liderar em casa e na igreja, criar filhos na fé.
- **Nada para homens e jovens**, apesar de a própria introdução dizer "*y a los hombres*".
- **Nada para grupos/células**, que é onde esse tipo de material mais é usado nas igrejas (grupos de mulheres, "sociedad femenil", círculos bíblicos, pastoral familiar).
- **Nada para crianças.**
- **Nenhuma ligação com Jesus** nas fichas do AT (Rahab e Rut estão na genealogia de Mt 1; Ana canta o que María cantará em Lc 1).

---

## 3. O que deveria estar lá e não está (priorizado)

| Prioridade | Item | Por quê |
|---|---|---|
| P0 | **História narrada** de cada mulher em linguagem simples | Quem não conhece a história não aprende nada com o PDF. |
| P0 | **Ordem cronológica** alinhada ao Estudio Cronológico + época aproximada | É a identidade do nosso produto principal. |
| P0 | **Versículo-chave por extenso** (RVR1960 curto ou RV1909) | Idosos e novos convertidos não abrem a referência. |
| P0 | **Mulheres essenciais faltando**: Agar, Rebeca, Raquel, Lea, Jocabed, Miriam, Rahab, Noemí, Abigail, Elisabet, Ana la profetisa, samaritana, María Magdalena, Tabita, Lidia, Febe | Sem elas o presente parece incompleto para qualquer leitora de igreja. |
| P0 | **"Lo que Dios hizo a través de ella"** (cristocêntrico, não moralista) | Corrige o erro de fundo do concorrente. |
| P1 | **"Para tu vida hoy"** concreto (situações reais; útil também para homens e jovens) | Aplicação que serve de verdade. |
| P1 | **Reflexão em grupo** (perguntas + dinâmica + oração) | Transforma o presente em material de célula — gera uso recorrente e indicação. |
| P1 | **Para niños** (relato curto + pergunta + atividade + versículo para memorizar) | Público familiar; conecta com o presente "Actividades Bíblicas para Niños". |
| P1 | **Oração curta** | Fecha cada ficha em devoção. |
| P1 | **"En 1 minuto"** (resumo para idosos e para áudio) | Acessibilidade e leitura rápida. |
| P2 | **Significado do nome** (honesto: "incierto" quando for incerto) | Detalhe muito querido pelo público. |
| P2 | **"¿Sabías que…?"** — separar texto bíblico de tradição popular (ex.: o texto não diz que Magdalena era prostituta nem que a samaritana era) | Credibilidade e ecumenismo sem polêmica. |
| P2 | **Ficha-ponte "Las mujeres en la genealogía de Jesús"** (Tamar, Rahab, Rut, Betsabé, María — Mt 1) | Costura AT→NT; mostra a graça em histórias difíceis. |
| P2 | **Tags por situação de vida** (viudez, espera, migración, duelo, liderazgo, maternidad…) | Permite achar "a mulher certa" para o momento; pode alimentar o Consejero Bíblico. |
| P3 | Ilustração própria por ficha na identidade do app | Ver 4.6. |

---

## 4. Nossa versão no app (especificação)

### 4.1 Conceito

**«Mujeres Virtuosas de la Biblia — 40 mujeres de fe, en el orden de la historia»**

Reenquadramento editorial (vai no "Comienza aquí"): em hebraico, "mujer virtuosa" (*eshet jáyil*) é "mulher de valor, de força". Estas mulheres não foram perfeitas: algumas riram, murmuraram, se afanaram ou tiveram medo. **O valor delas veio de caminhar com Deus — e Deus fez grandes coisas através de vidas comuns.** Cada ficha termina apontando para Cristo, não para um "você tem que ser assim".

Fronteira com outros presentes (evitar conteúdo duplicado):
- **Biografías de los Apóstoles y Personajes** (front): não repetir as mulheres; lá, só um link "Ver en Mujeres Virtuosas".
- **Caminando con Gigantes** (upsell2): foco em grandes figuras masculinas/femininas em formato biblioteca; se incluir mulheres, reusar a ficha daqui em versão resumida, nunca texto diferente para a mesma pessoa.
- **Los 43 Milagros de Jesús**: a mulher do fluxo, a cananeia e a sogra de Pedro aparecem lá como milagre; aqui o foco é a fé da mulher. Link cruzado.
- **Actividades para Niños**: o bloco "Para niños" daqui pode alimentar atividades de lá.

### 4.2 Lista final em ordem cronológica (41 fichas + 2 lições de abertura)

Estrutura de seções = períodos do Estudio Cronológico. `Enlace` = id da lição em `cronologico` (slug gerado por `slugify(title)` em `lib/catalog.ts`).

**Sección 0 — Introducción**

| # | Lição | Obs. |
|---|---|---|
| 0.1 | Comienza aquí | O que significa "virtuosa", como usar, versão bíblica, nota ecumênica |
| 0.2 | Cómo usar esta guía en grupo | Guia da líder: roteiro de 45 min, cuidados com temas sensíveis, crianças |

**Sección 1 — Los comienzos y los patriarcas** (Génesis)

| # | Ficha | Época aprox. | Pasajes principales | Enlace | Lote |
|---|---|---|---|---|---|
| 1 | Eva, la madre de todos los vivientes | Los orígenes | Gn 2–4 | `genesis` | 1 |
| 2 | Sara, la que se rió y vio la promesa | c. 2000 a.C. | Gn 12; 16–18; 21; Hb 11:11 | `genesis` | 1 |
| 3 | Agar, la que fue vista por Dios | c. 2000 a.C. | Gn 16; 21:8-21 | `genesis` | 1 |
| 4 | Rebeca | c. 1950 a.C. | Gn 24; 25:19-28; 27 | `genesis` | 2 |
| 5 | Lea | c. 1900 a.C. | Gn 29:16-35; 49:31 | `genesis` | 2 |
| 6 | Raquel | c. 1900 a.C. | Gn 29–31; 35:16-20; Jer 31:15 | `genesis` | 2 |

**Sección 2 — Egipto y el desierto** (Éxodo–Números)

| # | Ficha | Época | Pasajes | Enlace | Lote |
|---|---|---|---|---|---|
| 7 | Sifra y Fúa, las parteras valientes | c. 1500 a.C. | Éx 1:15-21 | `exodo` | 2 |
| 8 | Jocabed, la madre que confió el cesto | c. 1525 a.C. | Éx 2:1-10; 6:20; Hb 11:23 | `exodo` | 2 |
| 9 | Miriam, la que cantó junto al mar | c. 1446 a.C. | Éx 2:4-8; 15:20-21; Nm 12; Mi 6:4 | `exodo` | 1 |
| 10 | Las hijas de Zelofehad | c. 1406 a.C. | Nm 27:1-11; 36; Jos 17:3-6 | `numeros` | 3 |

**Sección 3 — La tierra prometida y los jueces** (Josué–Rut–1 Samuel)

| # | Ficha | Época | Pasajes | Enlace | Lote |
|---|---|---|---|---|---|
| 11 | Rahab, la del cordón de grana | c. 1406 a.C. | Jos 2; 6:22-25; Hb 11:31; Stg 2:25; Mt 1:5 | `josue` | 1 |
| 12 | Débora (y Jael), madre en Israel | Período de los jueces | Jue 4–5 | `jueces` | 1 |
| 13 | Noemí, de la amargura a la alegría | Período de los jueces | Rt 1; 4:13-17 | `rut` | 1 |
| 14 | Rut, la extranjera fiel | Período de los jueces | Rt 1–4; Mt 1:5 | `rut` | 1 |
| 15 | Ana, la que derramó su alma | c. 1100 a.C. | 1 S 1:1–2:11; 2:19-21 | `1-samuel` | 1 |

**Sección 4 — Reyes y profetas**

| # | Ficha | Época | Pasajes | Enlace | Lote |
|---|---|---|---|---|---|
| 16 | Abigail, la que detuvo una venganza | c. 1015 a.C. | 1 S 25 | `1-samuel` | 2 |
| 17 | La viuda de Sarepta | c. 860 a.C. | 1 R 17:8-24; Lc 4:25-26 | ⚠ sem lição (ver 4.5) | 2 |
| 18 | La sunamita | c. 850 a.C. | 2 R 4:8-37; 8:1-6 | ⚠ sem lição | 2 |
| 19 | La niña de la casa de Naamán | c. 850 a.C. | 2 R 5:1-19 | ⚠ sem lição | 3 |
| 20 | Hulda, la profetisa del rey Josías | 622 a.C. | 2 R 22:14-20; 2 Cr 34:22-28 | ⚠ sem lição | 3 |

**Sección 5 — Exilio y regreso**

| # | Ficha | Época | Pasajes | Enlace | Lote |
|---|---|---|---|---|---|
| 21 | Ester, para esta hora | c. 480 a.C. | Est 2; 4; 5; 7; 8; 9:26-32 | `ester` | 1 |

**Sección 6 — Los evangelios**

| # | Ficha | Época | Pasajes | Enlace | Lote |
|---|---|---|---|---|---|
| 22 | Elisabet, la que esperó hasta la vejez | c. 6-5 a.C. | Lc 1:5-25, 39-45, 57-66 | `lucas-1-2` | 2 |
| 23 | María, la madre de Jesús | c. 6 a.C. – 30 d.C. | Lc 1:26-56; 2; Jn 2:1-11; 19:25-27; Hch 1:14 | `lucas-1-2` | 1 |
| 24 | Ana, la profetisa del templo | c. 5 a.C. | Lc 2:36-38 | `lucas-1-2` | 2 |
| 25 | La mujer samaritana | c. 27-28 d.C. | Jn 4:1-42 | `el-ministerio-de-jesus-una-armonia-de-los-evangelios` | 2 |
| 26 | La mujer que tocó su manto | Ministerio de Jesús | Mr 5:25-34; Lc 8:43-48 | idem | 3 |
| 27 | La mujer perdonada que ungió sus pies | Ministerio de Jesús | Lc 7:36-50 | idem | 3 |
| 28 | Juana, Susana y las que servían a Jesús | Ministerio de Jesús | Lc 8:1-3; 24:10 | idem | 3 |
| 29 | La mujer cananea, la fe que insistió | Ministerio de Jesús | Mt 15:21-28; Mr 7:24-30 | idem | 3 |
| 30 | Marta de Betania | Ministerio de Jesús | Lc 10:38-42; Jn 11:17-27; 12:2 | idem | 1 |
| 31 | María de Betania | Ministerio de Jesús | Lc 10:39-42; Jn 11:28-33; 12:1-8 | idem | 1 |
| 32 | La viuda de las dos blancas | Última semana | Mr 12:41-44; Lc 21:1-4 | idem | 3 |
| 33 | María Magdalena, primera testigo | c. 30 d.C. | Lc 8:2; Jn 19:25; 20:1-18 | idem | 1 |

**Sección 7 — La iglesia naciente** (Hechos y cartas)

| # | Ficha | Época | Pasajes | Enlace | Lote |
|---|---|---|---|---|---|
| 34 | Tabita (Dorcas), manos llenas de bien | c. 38 d.C. | Hch 9:36-42 | `hechos-de-los-apostoles` | 2 |
| 35 | Rode, la muchacha que oyó llamar | c. 44 d.C. | Hch 12:12-17 | `hechos-de-los-apostoles` | 3 |
| 36 | Lidia, un corazón abierto | c. 50 d.C. | Hch 16:13-15, 40 | `hechos-de-los-apostoles` | 2 |
| 37 | Priscila, con Aquila al servicio del Evangelio | c. 50-60 d.C. | Hch 18; Ro 16:3-5; 1 Co 16:19; 2 Ti 4:19 | `hechos-de-los-apostoles` | 1 |
| 38 | Febe, la que llevó la carta a los Romanos | c. 57 d.C. | Ro 16:1-2 | `romanos` | 3 |
| 39 | Loida y Eunice, la fe de abuela a nieto | c. 50-65 d.C. | 2 Ti 1:5; 3:14-15; Hch 16:1 | `2-timoteo` | 3 |

**Sección 8 — Para cerrar**

| # | Ficha | Pasajes | Enlace | Lote |
|---|---|---|---|---|
| 40 | Las mujeres en la genealogía de Jesús (Tamar, Rahab, Rut, Betsabé, María) | Mt 1:1-16 | `mateo-1-2` | 3 |
| 41 | La mujer virtuosa de Proverbios 31: un retrato, no una lista | Pv 31:10-31; Rt 3:11 | `proverbios` | 1 |

Ficam **de fora de propósito** (explicar no "Comienza aquí" que não são "modelos", mas podem aparecer em "¿Sabías que…?"): Betsabé e Tamar como fichas próprias (só na ficha 40), Mical, Dalila, Jezabel, Safira, a mulher de Ló. Também **fora**: Judite e Susana (Dn 13), porque estão só no cânon católico — mantemos o cânon comum a católicos e evangélicos, sem comentar a diferença.

### 4.3 Campos de cada ficha

| Campo (id sugerido) | Conteúdo | Tamanho |
|---|---|---|
| `nombre` + `significado` | Nome em espanhol + significado. Se incerto, escrever "significado incierto" — **nunca inventar** | 1 linha |
| `epoca` | Período + data aproximada ("c.") coerente com o Estudio Cronológico | 1 linha |
| `pasajes` | Referências completas para ler a história inteira | 1 linha |
| `enUnMinuto` | Quem foi, o que viveu, o que Deus fez — em linguagem de conversa; também serve de roteiro de áudio | 60–90 palavras |
| `historia` | A história narrada, fiel ao texto, em 4–6 parágrafos curtos, sem acrescentar detalhes que a Bíblia não dá | 350–500 palavras |
| `virtud` | {título, texto} — a qualidade que a marca, **mostrada na história** (não adjetivo solto), com honestidade sobre as lutas dela | 60–100 palavras |
| `diosHizo` | O que Deus fez através dela + o fio até Jesus | 80–120 palavras |
| `paraTuVida` | 3–4 aplicações concretas por situação de vida; ao menos 1 serve para homens e 1 para jovens; linguagem de convite, nunca de cobrança | 120–180 palavras |
| `versiculo` | {texto, referencia} — RVR1960 curto ou RV1909 | 1 versículo |
| `oracion` | Oração em primeira pessoa, simples, que um idoso ou uma criança possa repetir | 40–70 palavras |
| `grupo` | {rompehielo, preguntas[4], dinamica, cierre} — para células e grupos de mulheres, ~45 min | 120–180 palavras |
| `ninos` | {relato (5–7 frases), pregunta, actividad, memoriza} — idade 5–10 | 100–150 palavras |
| `sabiasQue` (opcional) | Curiosidade ou distinção texto × tradição popular, sem polêmica | 40–70 palavras |
| `notaLider` (opcional) | Cuidados com temas sensíveis (violência, sexualidade, luto) e como adaptar | 30–60 palavras |
| `etiquetas` | Situações de vida: `espera`, `viudez`, `migracion`, `duelo`, `familia`, `liderazgo`, `oracion`, `servicio`, `valentia`, `rechazo`, `vejez`, `juventud` | 2–4 tags |
| `enlaces` | {cronologico: lessonId, relacionadas: fichaId[]} | — |

Total por ficha: **~1.100–1.500 palavras**.

Proposta de tipo (só especificação — o `LessonContent` atual não comporta esses campos; o ideal é um tipo próprio carregado sob demanda, como já se faz com os planos em `lib/content/plans`):

```ts
interface MujerContent {
  nombre: string; significado: string; epoca: string; pasajes: string
  enUnMinuto: string
  historia: string[]
  virtud: { titulo: string; texto: string }
  diosHizo: string
  paraTuVida: string[]
  versiculo: { texto: string; referencia: string; version: 'RVR1960' | 'RV1909' }
  oracion: string
  grupo: { rompehielo: string; preguntas: string[]; dinamica: string; cierre: string }
  ninos: { relato: string; pregunta: string; actividad: string; memoriza: string }
  sabiasQue?: string
  notaLider?: string
  etiquetas: string[]
  enlaces: { cronologico?: string; relacionadas?: string[] }
}
```

Ordem de exibição na tela: cabeçalho (nome, significado, época) → **En 1 minuto** (com botão de áudio) → Su historia → Su virtud → Lo que Dios hizo a través de ella → Para tu vida hoy → Versículo (card destacado) → Oración → abas ou acordeões recolhidos: **En grupo** · **Para niños** · **¿Sabías que…?** → "Lee esta historia en el Estudio Cronológico →" → marcar como leída.

### 4.4 Diretrizes editoriais

- **Tom**: amor de Cristo, acolhedor, sem ataque a instituição nenhuma. Nada de "a igreja tal ensina errado".
- **Anti-moralismo**: toda ficha passa pelo teste "o herói desta ficha é Deus?". Proibido terminar com "sé como ella". Preferir "Dios también puede…", "Quizás hoy tú…".
- **Honestidade**: mostrar lutas (Sara ri, Rebeca engana, Miriam murmura, Marta se afana) sem julgar; a graça aparece justamente aí.
- **Aplicação ampla**: mulher adulta, idosa, homem, jovem, criança. Situações latino-americanas reais: migração, cuidar de sogra/pais idosos, mães solo, viuvez, desemprego, família dividida pela fé.
- **María, madre de Jesús**: somente o que a Bíblia diz, com respeito e ternura. Usar Lc 1:28, 1:38, 1:42, 1:48 ("*desde ahora me dirán bienaventurada todas las generaciones*"), 2:19, Jn 2:5, 19:25-27, Hch 1:14. **Não** afirmar nem negar dogmas (Imaculada Conceição, Assunção, virgindade perpétua) e **não** tocar no tema "irmãos de Jesus". Chamá-la "María, la madre de Jesús"; evitar tanto títulos devocionais próprios de uma tradição quanto qualquer tom de minimização.
- **Liderança feminina** (Débora, Hulda, Febe "diaconisa" em RVR1960, Priscila ensinando Apolo): narrar o que o texto diz, sem entrar no debate de ordenação.
- **Temas sensíveis**: Rahab (prostituição e mentira), Jael (violência), Tamar e Betsabé (ficha 40), a pecadora de Lc 7. Para adultos: com delicadeza. Para crianças: adaptar ou omitir detalhe (sinalizar em `notaLider`).
- **Texto × tradição**: o texto não diz que María Magdalena era prostituta, nem que a samaritana era, nem que o fruto era maçã. Dizer isso com leveza no "¿Sabías que…?", sem ironizar quem aprendeu diferente.
- **Nomes**: grafia RVR1960 (Rahab, Jocabed, Zelofehad, Hulda, Tabita, Febe, Loida, Eunice).
- **Bíblia**: citações curtas RVR1960 (com a nota de copyright da SBU no "Comienza aquí") ou RV1909 (domínio público). Nunca parafrasear dentro de aspas.
- **Originalidade**: não usar títulos, epítetos ou frases do PDF concorrente (ex.: evitar "La Líder Valiente", "Fe y Paciencia", "Servicio y Escucha" como título).

### 4.5 Ligação com o Estudio Cronológico

1. **De cá para lá**: cada ficha tem o botão "Lee esta historia en el Estudio Cronológico" → `enlaces.cronologico`.
2. **De lá para cá**: na lição do cronológico (ex.: `rut`), um card "Mujeres de este libro" com as fichas daquele período (ex.: Noemí, Rut). Isso faz o presente trabalhar para a retenção do produto principal.
3. **Linha do tempo**: as fichas podem aparecer como pontos na lição "Línea de tiempo".
4. **Achado lateral (fora do escopo, mas afeta o link)**: a lista `OLD_TESTAMENT` em `lib/catalog.ts` **não tem lição para 1 Reyes 12–22, 2 Reyes nem 2 Crónicas 10–36** (vai de "1 Reyes 1-11"/"2 Crónicas 1-9" direto para os profetas). As fichas 17–20 (Sarepta, sunamita, menina de Naamã, Hulda) ficam sem destino. Resolver no cronológico (recomendado) ou, provisoriamente, apontar para "Línea de tiempo".

### 4.6 Visual (identidade do app, não do concorrente)

- Capa do produto já existe (`ROSE`, "Mujeres / Virtuosas de la Biblia", ícone `heart`). Manter.
- Leitor: mesmo leitor das demais lições (fundo escuro terroso, brilho quente), **fonte grande e ajustável**, cartões com cantos suaves; versículo em card de destaque; "En grupo" e "Para niños" como blocos recolhíveis com ícone.
- Ilustração por ficha **opcional** (lote posterior): estilo único para as 41, figuras com aparência do Oriente Médio antigo, sem texto dentro da imagem, sem iconografia de uma tradição específica (nem ícone bizantino, nem estilo "santinho"). Sem ilustração, usar um selo tipográfico com a inicial + ícone temático (cesto, cântaro, espigas, lâmpada…).
- Selo de período (cor da seção) e as etiquetas de situação de vida como chips — permitem o filtro "Busco una historia para… (viudez, espera, migración…)".

### 4.7 Ficha completa de exemplo (texto original, pronto para o app)

---

#### Rut, la extranjera fiel

**Nombre:** Rut — significado incierto; tradicionalmente se ha entendido como "amiga" o "compañera".
**Época:** En los días en que gobernaban los jueces (antes del rey Saúl).
**Para leer la historia completa:** Rut 1–4; Mateo 1:5.

**En 1 minuto**
Rut era de Moab, un pueblo vecino de Israel. Se casó con un israelita que había llegado a su tierra huyendo del hambre, y quedó viuda muy joven. Su suegra, Noemí, también lo había perdido todo y decidió volver a Belén. Rut pudo quedarse con los suyos, pero eligió acompañarla y confiar en el Dios de Israel. En Belén trabajó en el campo para sostenerlas a las dos, y allí Dios la encontró por medio de Booz. De Rut nació el abuelo del rey David… y, siglos después, de esa misma familia nació Jesús.

**Su historia**
Hubo hambre en Belén —que significa "casa de pan"— y una familia salió a buscar sustento en Moab: Elimelec, su esposa Noemí y sus dos hijos. Allí los hijos se casaron con dos mujeres moabitas, Orfa y Rut. Pero en pocos años murieron Elimelec y sus dos hijos. Quedaron tres viudas, sin tierra, sin hijos y sin nadie que las protegiera.

Cuando Noemí supo que Dios había vuelto a dar pan a su pueblo, decidió regresar. Con cariño les pidió a sus nueras que se quedaran en su tierra y rehicieran su vida. Orfa, llorando, se despidió. Rut, en cambio, se aferró a ella y le dijo unas palabras que se han repetido por generaciones: a donde tú vayas, iré yo; tu pueblo será mi pueblo, y tu Dios será mi Dios.

Llegaron a Belén al comienzo de la cosecha de la cebada. La ley de Dios mandaba dejar las orillas del campo para los pobres y los extranjeros (Levítico 19:9-10), y Rut salió a recoger espigas detrás de los segadores. "Y aconteció" —dice el texto— que el campo era de Booz, un pariente de Elimelec. Booz había oído de la bondad de Rut con su suegra; la protegió, le dio agua y pan, y pidió en secreto a sus trabajadores que dejaran caer espigas a propósito para ella.

Noemí vio en todo eso la mano de Dios. En Israel, un pariente cercano podía "redimir" a una familia en ruina: recuperar su tierra y darle descendencia. Siguiendo el consejo de Noemí, Rut le pidió a Booz, con respeto y valentía, que asumiera ese papel. Booz aceptó y, delante de los ancianos de la ciudad, a la puerta, lo hizo todo de manera honrada y pública.

Booz y Rut se casaron, y Dios les dio un hijo, Obed. Las mujeres de Belén rodearon a Noemí y le dijeron que esa nuera que la amaba valía para ella más que siete hijos. La mujer que había vuelto diciendo "llamadme Mara" (amarga) tenía ahora un nieto en los brazos. Obed fue padre de Isaí, e Isaí fue padre del rey David.

**Su virtud: una lealtad que ama**
La Biblia usa una palabra hebrea muy rica para lo que Rut vivió: *jésed*, un amor fiel que se queda cuando sería más fácil irse. Rut no tenía obligación de acompañar a Noemí; lo hizo por amor. Y ese amor no fue solo un sentimiento: se levantó temprano, trabajó bajo el sol, obedeció consejos y se atrevió a pedir ayuda. Booz lo resumió así: "toda la gente de mi pueblo sabe que eres mujer virtuosa" (Rut 3:11). Es la única mujer de la Biblia a quien la historia llama así por su nombre.

**Lo que Dios hizo a través de ella**
El libro de Rut casi no tiene milagros visibles; Dios actúa en lo cotidiano: una cosecha, un campo "casual", un pariente generoso, una ley pensada para los pobres. A través de una extranjera viuda, Dios devolvió la alegría a Noemí, dio a Israel la familia de su rey David y preparó el camino de Jesús: Mateo la nombra en la genealogía del Mesías (Mateo 1:5). Booz, el pariente que redime por amor, nos hace pensar en Cristo, que nos rescata sin que podamos pagarle. Y Rut nos recuerda que en la familia de Dios nadie es "de afuera": hay lugar bajo sus alas para todo el que viene a refugiarse.

**Para tu vida hoy**
- **Si cuidas de un familiar mayor** —una suegra, tu madre, tu padre—: lo que haces en silencio, sin aplausos, no es invisible para Dios. Rut también cuidaba sin saber cómo terminaría la historia.
- **Si tuviste que dejar tu tierra**: empezar de cero en un lugar donde eres "la extranjera" duele. Dios conoce ese camino y sabe abrir puertas en campos que no son tuyos.
- **Si estás de luto**: el libro empieza con tres tumbas y termina con una cuna. No apresura el dolor de Noemí, pero muestra que Dios sigue escribiendo.
- **Para los hombres**: Booz muestra cómo es un hombre de Dios: generoso con lo que tiene, protector sin aprovecharse, honesto aun cuando podía tomar un atajo.
- **Para los jóvenes**: Rut no heredó la fe; la eligió. Tu fe también puede ser una decisión tuya, no solo la costumbre de tu casa.

**Versículo para guardar**
> «Tu pueblo será mi pueblo, y tu Dios mi Dios.»
> — Rut 1:16 (RVR1960)

**Oración**
Señor, gracias porque cuidas de mí aun en los días de pérdida. Dame un amor fiel como el de Rut, para quedarme junto a quienes me necesitan. Cuando me sienta extranjero o sin lugar, recuérdame que bajo tus alas tengo refugio. Y enséñame a ver tu mano en las cosas pequeñas de cada día. En el nombre de Jesús, amén.

**Para compartir en grupo** (unos 45 minutos)
- *Para romper el hielo:* ¿Quién ha sido para ti una "Rut" o una "Noemí": alguien que se quedó a tu lado cuando todo se vino abajo?
- *Preguntas:*
  1. Orfa y Rut amaban a Noemí, pero tomaron decisiones distintas. ¿Qué crees que pesó en el corazón de Rut?
  2. Noemí dijo "llamadme Mara". ¿Es posible hablarle a Dios con sinceridad sobre la amargura sin dejar de caminar con Él?
  3. ¿Dónde ves la mano de Dios en los detalles "casuales" de esta historia? ¿Y en tu propia vida?
  4. ¿Quién es hoy "la extranjera" en tu barrio o en tu iglesia, y cómo podrían dejarle "espigas" a propósito?
- *Dinámica:* Cada participante escribe en un papel el nombre de alguien a quien cuida o que la cuidó, y el grupo ora por esas personas.
- *Cierre:* Leer juntas Rut 1:16-17 y orar por quienes están lejos de su tierra.

**Para niños**
*La historia:* Rut vivía en Moab. Un día se fue a vivir con su suegra Noemí a Belén, porque la quería mucho y no quería dejarla sola. Allí no tenían comida, así que Rut fue a un campo a juntar las espigas que quedaban en el suelo. El dueño del campo, Booz, era un hombre bueno: les pidió a sus ayudantes que dejaran caer espigas a propósito para ella. Después Booz y Rut se casaron y tuvieron un bebé llamado Obed. ¡Y muchos años más tarde, en esa misma familia, nació Jesús!
*Pregunta:* ¿A quién puedes ayudar tú esta semana, como Rut ayudó a Noemí?
*Actividad:* Dibuja un campo de trigo y, en cada espiga, escribe el nombre de una persona a la que quieres ayudar.
*Para memorizar:* «Tu Dios será mi Dios» (Rut 1:16).

**¿Sabías que…?**
Rut es una de las pocas mujeres nombradas en la genealogía de Jesús en el Evangelio de Mateo. Y el libro de Rut se lee tradicionalmente en la fiesta de la cosecha (Pentecostés judío), porque toda su historia ocurre entre la siega de la cebada y la del trigo.

*Nota para quien guía:* La escena de la era (Rut 3) es un pedido formal de protección y redención según las costumbres de la época, no una escena de seducción. Con niños, basta decir que Rut le pidió a Booz que cuidara de su familia.

**Etiquetas:** migración · viudez · familia · duelo
**Enlaces:** Estudio Cronológico → `rut` · Ver también: Noemí (13), Rahab (11), Las mujeres en la genealogía de Jesús (40)

---

### 4.8 Volume e lotes

| Lote | Fichas | Conteúdo | Palavras aprox. |
|---|---|---|---|
| **Lote 1 — Lançamento** (paridade + essenciais) | 16 + 2 intro | Eva, Sara, Agar, Miriam, Rahab, Débora (y Jael), Noemí, Rut, Ana, Ester, María, Marta, María de Betania, María Magdalena, Priscila, Proverbios 31 + "Comienza aquí" + "Cómo usar en grupo" | ~22.000 |
| **Lote 2** | 13 | Rebeca, Lea, Raquel, Sifra y Fúa, Jocabed, Abigail, viuda de Sarepta, sunamita, Elisabet, Ana la profetisa, samaritana, Tabita, Lidia | ~17.000 |
| **Lote 3** | 12 | Hijas de Zelofehad, niña de Naamán, Hulda, mujer del manto, mujer perdonada, Juana y Susana, cananea, viuda de las blancas, Rode, Febe, Loida y Eunice, genealogía de Jesús | ~15.000 |
| **Total** | **41 fichas + 2 lições** | | **~54.000 palavras** (o concorrente tem <1.000) |

Extras opcionais depois dos lotes: áudio do "En 1 minuto" (41 × ~40 s, via TTS da voz do app) e ilustrações (41).

Só o Lote 1 já cobre **100% das mulheres do concorrente** (com Marta e María separadas) e acrescenta 6 essenciais.

---

## 5. Checklist de produção

1. Aprovar a lista final de 41 fichas e a divisão em lotes (seção 4.2), incluindo as exclusões (Judite/Susana deuterocanônicas; Betsabé/Tamar só na ficha 40).
2. Definir a versão bíblica por citação (RVR1960 curta ou RV1909) e redigir a nota de copyright da RVR1960 para o "Comienza aquí".
3. Decidir onde vive o conteúdo: tipo próprio `MujerContent` carregado sob demanda (recomendado) ou extensão do `LessonContent`.
4. Substituir `pendingGuide()` do produto `mujeres-virtuosas` pelas 9 seções (Introducción + 7 períodos + Para cerrar), com ids estáveis (`slugify` do nome).
5. Escrever "Comienza aquí" (o que é *eshet jáyil*, como usar, nota ecumênica, versão bíblica) e "Cómo usar esta guía en grupo".
6. Redigir o Lote 1 (16 fichas) seguindo o molde da ficha de Rut (4.7) e as diretrizes (4.4).
7. Revisão bíblica de cada ficha: toda afirmação conferida com o texto; nada acrescentado que a Bíblia não diga; datas coerentes com o Estudio Cronológico.
8. Revisão de citações: conferir palavra por palavra cada versículo entre aspas contra a RVR1960/RV1909.
9. Revisão ecumênica: ficha de María e fichas com liderança feminina lidas por um revisor católico e um evangélico; nenhuma afirmação dogmática nem ataque.
10. Revisão anti-moralismo: o "herói" de cada ficha é Deus; nenhuma ficha termina em "sé como ella"; "Para tu vida hoy" tem ao menos 1 aplicação para homens e 1 para jovens.
11. Revisão infantil: blocos "Para niños" sem detalhes impróprios; `notaLider` preenchida nas fichas sensíveis (Rahab, Débora/Jael, mulher perdonada, genealogia).
12. Revisão de originalidade: nenhum título, epíteto ou frase do PDF concorrente; nenhuma imagem dele.
13. Revisão de acessibilidade: "En 1 minuto" ≤ 90 palavras; frases curtas; leitura confortável com fonte grande.
14. Implementar a tela da ficha (ordem de blocos da 4.3, versículo em card, "En grupo"/"Para niños"/"¿Sabías que…?" recolhíveis, botão "Lee esta historia en el Estudio Cronológico").
15. Implementar o link reverso no cronológico ("Mujeres de este libro").
16. Resolver o buraco de 1 Reyes 12–22 / 2 Reyes / 2 Crónicas 10–36 no cronológico (ou link provisório para "Línea de tiempo") antes de publicar as fichas 17–20.
17. Implementar etiquetas e o filtro "Busco una historia para…".
18. Adicionar links cruzados com "Biografías", "Los 43 Milagros de Jesús" e "Actividades para Niños"; garantir que nenhuma mulher tenha dois textos diferentes no app.
19. Testar no celular (tela pequena, fonte ampliada, modo leitura), marcar como lida, progresso e racha.
20. Publicar Lote 1; repetir passos 6–13 para Lotes 2 e 3.
21. (Opcional) Gerar áudios do "En 1 minuto" e ilustrações no estilo definido em 4.6.
22. Atualizar a copy da página de vendas / Tienda quando o total de fichas estiver publicado ("41 mujeres de fe, con guía para grupos y para niños").
