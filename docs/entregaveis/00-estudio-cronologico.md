# Estudio Cronológico de la Biblia: análise do molde e especificação da nossa versão

*Análise feita em 28/09/2026 sobre `Produto Principal - resumen-cronologico.pdf` (8,7 MB). Li o texto das 158 páginas por extração (PyMuPDF) e renderizei 20 páginas-chave para analisar o visual. Não copiar nenhum trecho deste PDF para o app: tudo o que ele diz aqui aparece só como evidência da análise.*

---

## 0. Resumo executivo

- O molde é um **"slide-book" vertical de 158 páginas** (formato 9:16), com **65 entradas** (37 no AT e 28 no NT), cerca de **26,5 mil palavras** no total e uma média de **~370 palavras por livro**. É curto, bonito e superficial.
- **Ele não cobre os 66 livros**, embora prometa. Faltam **2 Reis** e **Joel** inteiros, **1 Reis 12–22** e **2 Crônicas 10–36**. Também não existe lição sobre a **Paixão, a morte e a ressurreição de Jesus**: o bloco "Ministério" termina na entrada triunfal, e "Hechos" já começa com a ascensão. Elias, Eliseu, Ezequias, Josias e a queda de Samaria ficam fora da história.
- Há **erros de produção graves**: páginas inteiras em **português** (resumo de Daniel, capa de Cantares), um placeholder **"Erro ao fazer upload da imagem"** aparecendo em duas páginas, lixo de fonte em devanágari no meio de Oseias, e um índice que não bate com o conteúdo (Cantares listado duas vezes, Joel e 2 Reis com "página" mas sem conteúdo, nenhum link clicável).
- Há **erros de conteúdo**: José "consideró **desposarla** discretamente" (o sentido fica invertido: ele pensava em deixá-la), Jesus "a ser **bautizado** como Jesús" (calco do português "batizado" = nomeado) e Romanos 11 fala da "aparente **Muerte** de muchos judíos". Datas polêmicas (criação em 4000 a.C., êxodo em 1446 a.C.) aparecem como fato, sem aviso. O campo "Fecha" mistura data dos fatos com data de escrita.
- **Acessibilidade ruim.** No celular, o corpo do texto fica com cerca de 7–9 px equivalentes, a menos que o leitor dê zoom. As frases têm em média 25 palavras (192 passam de 35) e há vocabulário difícil ("apoteosis", "prerrogativa", "longanimidad"). O NT tem estilo inflado: "inquebrantable" aparece 29 vezes, "crucial" 22 e "vibrante" 20. As versões bíblicas se misturam sem crédito (RVR1960 e NVI).
- **Nossa versão:** cerca de **90 lições** em 11 eras. Os livros divididos viram "trilhos da história" (Reis+Crônicas lidos em paralelo), com os profetas **encaixados no reinado em que falaram**. Cada lição tem dois níveis ("En 1 minuto" e "Estudio completo"), 18 campos com limite de tamanho, quiz de 3 perguntas, "Siguiente en la historia" e ligação direta com a busca de estudo cruzado.
- **Volume:** cerca de **125 mil palavras editoriais** (≈ 5× o molde), mais ~90 cadeias curadas para a busca. A produção fica em **1 lote de fundação + 10 lotes de redação + 1 lote transversal**, com 4 revisores automáticos por lote.

---

## 1. O que é o molde

### 1.1 Ficha técnica

| Item | Valor |
|---|---|
| Páginas | **158** (capa 384×600 pt; miolo 900×1600 pt, vertical 9:16, pensado para tela de celular) |
| Produtor | Exportado/comprimido no iLovePDF; sem metadados. O placeholder "Erro ao fazer upload da imagem" indica uma ferramenta de slides com interface em português (tipo Gamma/Canva) |
| Marca | "El Instituto de la Palabra" (logo: livro aberto com cruz, "PALABRA · INSTITUTO") |
| Texto | ~26.500 palavras. AT ≈ 11.500, NT ≈ 12.700, o resto é introdução e linha do tempo |
| Por livro | 2 páginas (ficha + resumo). Mínimo 219, média 372, máximo 657 palavras |
| Links | **0** (índice não clicável, sem sumário/TOC no PDF) |
| Versões bíblicas | Misturadas e sem crédito: RVR1960 ("Jehová", "vosotros") e NVI (Jr 29:11, Ef 2:8-9, Ez 36:26, Pv 1:7, Mt 5:17 com "ustedes") |

### 1.2 Estrutura completa, na ordem

| Págs. | Seção | Conteúdo |
|---|---|---|
| 1 | Capa | Ver 1.5 |
| 2 | "Comience aquí" | Propósito + os 5 campos de cada resumo + promessa de "máximo dos páginas", linha do tempo e "portadas de cada libro" |
| 3–12 | "Línea del tiempo" | Abertura + 9 telas de eras: Creación y Patriarcas (4000–1804), Esclavitud y Éxodo (1446–1406), Conquista y Jueces (1406–1050), Reino Unido (1050–930), Reino Dividido (930–586), Exilio (605–539), Regreso (538–430), Intertestamentario (430–5), Cronología del NT |
| 13–22 | Bloco "¿Por qué AT y NT?" | Etimologia de "testamento", o que cada Testamento registra (4 itens), "Conexión entre ambos", Promesa→Cumplimiento→Redención, características (Lei/História/Poesia/Profecia; Evangelhos/História/Epístolas/Apocalipse), "Cronología Bíblica Simplificada" em 7 faixas, "Cumplimiento de Profecías" (5 pares AT→NT), "Un solo libro" |
| 23–25 | Índice AT (3 partes) | 40 itens numerados com datas. **Não corresponde ao conteúdo** (ver 2.1) |
| 26–99 | AT | 37 entradas × 2 páginas |
| 100–101 | Índice NT | Itens 41–68 |
| 102–157 | NT | 28 entradas × 2 páginas |
| 158 | Conclusión | "Del Génesis al Apocalipsis": AT → NT → Consumação, e um convite final |

**Ordem real das entradas do AT (conteúdo):** Génesis · Job · Éxodo · Levítico · Números · Deuteronomio · Josué · Jueces · Rut · 1 Samuel · 2 Samuel · 1 Crónicas · Salmos · Proverbios · Eclesiastés · Cantares · **1 Reyes 1–11** · **2 Crónicas 1–9** · Jonás · Amós · Oseas · Isaías · Miqueas · Nahúm · Sofonías · Habacuc · Jeremías · Lamentaciones · Abdías · Ezequiel · Daniel · Esdras · Hageo · Zacarías · Ester · Nehemías · Malaquías (37).

**Ordem do NT:** Lucas 1–2 · Mateo 1–2 · Marcos 1 · Juan 1 · El ministerio de Jesús (armonía) · Hechos · Santiago · Gálatas · 1 Tes · 2 Tes · 1 Cor · 2 Cor · Romanos · Efesios · Filipenses · Colosenses · Filemón · 1 Timoteo · Tito · 2 Timoteo · 1 Pedro · 2 Pedro · Hebreos · Judas · 1 Juan · 2 Juan · 3 Juan · Apocalipsis (28).

> Nossa lista atual em `lib/catalog.ts` (OLD_TESTAMENT / NEW_TESTAMENT) é **cópia exata dessa ordem**. Por isso herda as mesmas lacunas: sem 2 Reyes, sem Joel, Reis/Crônicas pela metade e sem Paixão/Ressurreição.

### 1.3 O que cada entrada de livro contém

**Página A, a "portada/ficha"** (layout dividido: ilustração numa faixa vertical + ficha):
1. **Título** do livro em maiúsculas, na cor de destaque daquele livro
2. **Fecha de los acontecimientos**
3. **Autor tradicionalmente atribuido**
4. **Período** (em frase)
5. **Personajes principales** (lista corrida)
6. **Versículo clave** (referência + texto)

**Página B, o "resumen":**
7. Parágrafo de abertura (contexto)
8. De 3 a 6 **blocos com subtítulo** (numerados 1–6 ou "01–06", em cartões, colunas ou "escada"). Variações por livro: as 5 ofertas (Levítico), o ciclo dos juízes (Juízes), contrastes sábio/néscio (Provérbios), capítulo a capítulo (Lamentações), 4 cards com foto (Daniel), "obras da carne × fruto do Espírito" (Gálatas)
9. **Frase-moral final** ("X nos recuerda que…"), que é a única "aplicação" do material

No NT, a partir de Lucas, a ficha **perde os rótulos** e vira prosa ("La autoría de este evangelio se atribuye…"). Em várias entradas somem "Período" ou "Personajes" (1 Tes, 2 Cor, Efesios, Filemón, 1 Juan…) e a padronização se quebra.

**Não existe** em nenhuma entrada: mapa, "onde Cristo aparece", conexões com outros livros, glossário, perguntas, aplicação prática concreta, capítulos para ler, nível resumido, conteúdo infantil ou áudio.

### 1.4 Linha do tempo e extras

- **Linha do tempo (págs. 4–12):** cada era é uma tela com um banner ilustrado no topo (~1/6 da página), título roxo com o intervalo de anos e uma linha vertical roxa com pontos, onde os eventos alternam entre a esquerda e a direita (título em negrito + 1 linha). São 4 a 8 eventos por era, poucos com datas.
- **Extras:** "Cronología Bíblica Simplificada" (7 faixas), "Cumplimiento de Profecías" (5 profecias em duas colunas AT/NT, com a frase "más de 300 profecías" sem fonte) e o esquema "Promesa → Cumplimiento → Redención". Não há mapas, genealogias, tabela de reis, glossário, bibliografia nem plano de leitura.

### 1.5 Identidade visual (para reproduzir a *temática*, não o arquivo)

**Capa (a peça que "vende"):**
- Fundo **escuro e dramático**: nuvens de tempestade em marrom-carvão e preto-azulado, com um **feixe vertical de luz dourada** descendo do alto ao centro ("luz do céu"). Na base, silhuetas de **ruínas e cidade antiga** (colunas, muralhas, palmeiras) em névoa sépia.
- No topo, o logo pequeno (livro aberto + cruz) em branco/dourado, com uma linha fina dourada e um ornamento central em losango.
- Título em 3 linhas, **serifa clássica em caixa-alta branca com brilho (glow) suave**: "RESUMEN / CRONOLÓGICO / DE LA". Depois a palavra-chave **"BIBLIA" gigante numa sans condensada pesada em amarelo-ouro** (≈ #E8B92E), ocupando toda a largura. A assinatura "EL INSTITUTO DE LA PALABRA" vem em serif pequena (Radley) branca.
- Sensação: épico, "revelação", luz vencendo a escuridão.

**Miolo:**
- Fundo **cinza-gelo quase branco com textura muito sutil** (≈ #F3F2EF). **Não é pergaminho**: o "pergaminho" é desejo nosso, e o app já tem essa paleta (`--color-bg #f8f3e8`, `--color-surface #f3e9d3`, ouro `#8a5f0c`/`#e0ac4a`).
- Tipografia: títulos em **Petrona Bold** (serif humanista, caixa-alta nos nomes dos livros, com tracking leve). Corpo em **Bitter** Regular/Bold/Medium (slab-serif), cor #272525. A capa usa Radley e há uma PP Mori (sans) residual.
- **Cor de destaque diferente em cada livro**, com cerca de 12 cores sem lógica de era: roxo #B05EF1/#5E208E (Génesis, "Comience aquí"), teal #268DA6 (índices, Jueces), **amarelo #F9D933 sobre branco** (Éxodo, contraste reprovado), azul #5E98F1 (Daniel, Efesios), laranja #FFA44F, verdes #0D9488/#5CC97B/#059669, vermelho #E11D48, marrom-oliva #995515 (Cantares).
- Componentes: cartões arredondados de borda fina colorida com barra lateral grossa ("Comience aquí"); passos numerados em pílulas brancas ligados por linha cinza vertical (Éxodo); cartões em escada (ciclo de Juízes); grades de 2 colunas; citações com barra vertical à esquerda; callout roxo claro com ícone de nota; setas-chevron azuis empilhadas (Conclusão).
- Ilustrações: **geradas por IA, com estilos inconsistentes**. Há galáxia e oceano de luz (Génesis), pintura sacra hiper-realista (natividade), art nouveau estilo Mucha com casal se beijando (Cantares), fotos cinematográficas escuras (Daniel) e paisagens-fantasia "matte painting" (linha do tempo). A faixa ilustrada ocupa ~38% da largura na ficha e alterna entre esquerda e direita.

**O que reproduzir no app:** capa escura + feixe dourado + serif clara com glow + palavra-chave em ouro. Miolo em pergaminho (nossas variáveis atuais) com Literata como serif, que já está no `app/layout.tsx`. **Uma** cor de acento (ouro/tinta) e uma **cor por era** (11 tons terrosos, todos com contraste AA sobre o pergaminho), no lugar de uma cor aleatória por livro. Ilustrações num **estilo único** (por exemplo, gravura/xilogravura aquarelada ou pintura a óleo suave), sem cenas sensuais, porque o público inclui crianças.

---

## 2. Falhas e brechas do molde

### 2.1 Livros faltando ou pela metade (o mais grave)

| Problema | Evidência | Impacto |
|---|---|---|
| **2 Reis ausente** | Aparece no índice (item 16, "853–586") mas não tem conteúdo | Elias (fim), Eliseu, Jeú, a queda de Samaria (722), Ezequias, Josias e a queda de Jerusalém (586) somem. É o "esqueleto" que dá sentido aos profetas |
| **Joel ausente** | Índice item 18 ("835–796"), sem conteúdo | Falta o texto de Pentecostes (Jl 2:28 → At 2) |
| **1 Reis 12–22 ausente** | Só existe "1 Reyes 1–11" | Divisão do reino, Jeroboão, Acabe, Jezabel, **Elias no Carmelo** |
| **2 Crônicas 10–36 ausente** | Só existe "2 Crónicas 1–9" | Reformas de Ezequias e Josias, decreto de Ciro (2Cr 36:22-23) |
| **Evangelhos só pelo cap. 1–2** | Lucas 1–2, Mateo 1–2, Marcos 1, Juan 1 + um bloco "armonía" | Nenhum evangelho tem ficha própria (quem escreveu, para quem, por quê, quando) |
| **Sem Paixão, morte e ressurreição** | A "armonía" termina na entrada triunfal; Hechos começa na ascensão | O centro da fé cristã não tem lição. Só aparece como um bullet na linha do tempo (pág. 12) |
| **1 Crônicas mal posicionado** | No conteúdo vem depois de 2 Samuel; no índice está em "539–516 AC" | Contradição interna. O leitor não sabe se Crônicas é "história de Davi" ou "livro pós-exílio" (é os dois, e isso precisa ser explicado) |
| **Índice ≠ conteúdo** | Cantares aparece 2× (itens 12 e 40); Salmos como item 39 ("1440–430") mas no conteúdo vem após 1 Crónicas com "1050–500"; Abdías no índice em 848 a.C., no conteúdo em 586; a "pág." é o número do item, não a página | Credibilidade zero para quem confere |

### 2.2 Erros de produção visíveis

- **Daniel (pág. 87), resumo inteiro em português** ("Daniel, um jovem levado ao exílio na Babilônia…", "A Fornalha Ardente", "A Cova dos Leões").
- **Cantares (pág. 56), ficha inteira em português** ("CANTARES DE SALOMÃO", "Data dos acontecimentos", "Personagens", "Verso-chave", "As muitas águas não poderiam apagar o amor"), com uma nota de rodapé órfã "lo¹".
- **"Erro ao fazer upload da imagem"** visível em Efesios (pág. 129) e 2 Timoteo (pág. 141), com caixa cinza vazia.
- **Oseias (pág. 67):** "restaurar el ɝरलेशनɡशप" (a palavra "relationship" saiu numa fonte devanágari).
- Rótulos em outras línguas: "Apostasia", "Opression" (Juízes); "Abbarcando" (Ministério); "Josué 1:9 — 'No te mandé yo?'" sem o "¿".
- Concordância: "el precioso sangre" (Efesios), "la tercera viaje misionera" (Romanos), "La mensaje" (Nahúm, Judas), "Una énfasis" (Proverbios), "Tradicionalmente atribuida a un autor desconocido" (Hebreus).
- 2 Timoteo termina abruptamente, sem fechamento. É o único resumo sem a frase final.

### 2.3 Erros históricos, bíblicos e teológicos

| Onde | O que diz (paráfrase) | Problema |
|---|---|---|
| Mateo 1–2 | José "consideró **desposarla** discretamente" | **Inverte o sentido.** Mt 1:19 diz que ele pensou em *deixá-la* em segredo |
| Mateo 1–2 | o filho "a ser **bautizado** como Jesús" | Calco do PT "batizado" (= nomeado). Em espanhol soa como batismo |
| Romanos 11 | "la aparente **Muerte** de muchos judíos" | Erro de tradução (o sentido é a *incredulidade/rejeição*). Soa ofensivo e é teologicamente errado |
| Jueces | Samuel como personagem de Juízes | Samuel aparece em 1 Samuel |
| Linha do tempo / Génesis | "Creación 4000 a.C." como dado | Data de Ussher. Nem a Igreja Católica nem boa parte dos evangélicos a adotam. Precisa de aviso ("fecha tradicional; la Biblia no da una fecha") |
| Éxodo | 1446 a.C. sem alternativa | A "data longa" é defensável, mas há a datação no séc. XIII (c. 1270). Sem aviso |
| Job | "2000–1800 a.C." | A data dos fatos é desconhecida e a da escrita é muito discutida. Falta "fecha incierta" |
| Campo "Fecha" | Mistura data dos fatos (Génesis), data de composição (Salmos 1050–500, Proverbios 970–700) e data de escrita (todas as epístolas) | O leitor não sabe o que está datando. Salmos diz "desde Moisés" mas data a partir de 1050 |
| Ordem do NT | 2 Timoteo (67) antes de 1 Pedro (64) e 2 Pedro (66) | Pelas próprias datas do molde, a ordem não é cronológica |
| Datas índice × conteúdo | Habacuc 612–606 × 620; Jeremías 626–586 × 627–580; Judas 68–70 × 65–80; Esdras 458 × 538–456 | Inconsistência em série |
| Esdras | Um bloco único 538–456 posto antes de Ester | Esd 7–10 acontece **depois** de Ester (458 a.C.). O certo é dividir Esdras 1–6 / 7–10 |
| Intertestamentário | "400 años de silencio profético" + só "Dominio persa/griego/romano" | Omite macabeus e hasmoneus (a origem da festa de Hanucá, citada em Jo 10:22), fariseus, saduceus e sinagoga. Para **católicos**, esse período tem Escritura (1–2 Macabeus, Sabedoria, Eclesiástico…). "Silencio" é um enquadramento protestante |
| Ester | "sin que Su nombre sea mencionado" | Vale só para o texto hebraico. Nas Bíblias católicas, os acréscimos gregos de Ester nomeiam Deus. Falta nota |
| Judas | "medio hermano de Jesús" | Toma partido. Para católicos, os "hermanos del Señor" são parentes próximos. O neutro é "llamado 'hermano del Señor' (cf. Mt 13:55; Gál 1:19)" |
| Levítico | "la presencia de Dios depende de la obediencia" | Formulação legalista, que ignora a graça que já está no próprio Levítico (expiação) |
| Hebreos / Gálatas | "jamás cambiar… por la transitoria sombra de la ley", "judaizantes" sem explicação | Risco de tom anti-judaico. Pede redação cuidadosa e explicativa |
| "Más de 300 profecías" | Número apresentado como fato | Não tem fonte e a contagem varia muito. Usar "muchas profecías" |
| Apocalipsis | Bestas identificadas ("poder político opresor", "falso profeta") | Aceitável, mas sem dizer que há várias leituras (e o público é ecumênico) |

### 2.4 Falta de contexto e de ligação entre livros

- Os profetas aparecem **soltos**: o leitor lê Amós e Oseias sem ter lido o reino de Jeroboão II (que está no 2 Reis inexistente). Nahúm cita Jonas, mas não há "link" entre eles.
- Não há "o que aconteceu antes / o que vem depois", nem "este livro é citado em…". A promessa da introdução ("una única trama") não é demonstrada em nenhuma página.
- Nenhum contexto mundial: Egito, Assíria, Babilônia, Pérsia, Grécia e Roma são nomes sem mapa nem explicação.
- Os reis de Israel e Judá (40+) não têm tabela, e ninguém consegue se situar nos profetas sem ela.

### 2.5 Partes confusas

- A ficha do NT virou prosa rebuscada: "desfilan personajes… en este tapiz profético", "joya epistolar", "cuyas vidas se entrelazan con un propósito mayor".
- A linha do tempo mistura níveis (evento/pessoa/livro) e quase não traz datas. Na pág. 4, "Descendencia y diluvio (Noé)" aparece como subtítulo de "Caín y Abel".
- Crônicas "paralelo" sem explicar o que é um paralelo. 1 Reyes 1–11 e 2 Crónicas 1–9 contam **a mesma história em duas lições seguidas**, e o leitor sente repetição.

### 2.6 Pouca aplicação prática

A única aplicação é uma frase-moral genérica no fim ("X nos recuerda que…"). Faltam uma pergunta pessoal, um passo concreto, uma oração e uma conexão com a vida de hoje (família, trabalho, sofrimento, perdão).

### 2.7 Acessibilidade

- **Tamanho de letra:** o corpo tem 15–21 pt numa página de 900 de largura. Num celular de 360–390 px isso vira **~6–9 px** sem zoom, ilegível para idosos. O PDF "vertical para celular" é, na prática, um slide reduzido.
- **Contraste:** título amarelo #F9D933 sobre fundo quase branco (Éxodo, entre outros) fica muito abaixo de 3:1.
- **Linguagem:** média de **25 palavras por frase**, **192 frases com mais de 35 palavras**. Há palavras eruditas: "apoteosis", "prerrogativa", "longanimidad", "paradigmas", "aprehender", "dilucidar", "conminando", "intrínsecamente", "desvela". Também há tiques de IA: "inquebrantable" (29×), "glorios-" (23×), "crucial" (22×), "vibrante" (20×), "vehemente" (13×), "sublime" (10×). O AT tem prosa simples e o NT está visivelmente inflado, então o nível de leitura é desigual.
- Não há áudio, texto alternativo nem modo de leitura. O índice não é clicável e não existe busca.

### 2.8 Tom

Não há ataque a igrejas ou instituições, o que é ponto positivo. Mas o molde é **implicitamente evangélico** e isso exclui metade do público: fala em "66 livros", "400 años de silencio" e "medio hermano", e não traz nenhuma nota sobre a Bíblia católica (73 livros). Para um produto vendido a católicos e evangélicos latino-americanos, precisamos de **notas ecumênicas curtas e neutras**, sem polemizar e sem esconder.

### 2.9 Direitos autorais (lição para nós)

O molde cita RVR1960 (©) e **NVI** (© Biblica) sem crédito. Nós usamos **RV1909** (domínio público) no texto completo e **RVR1960 só em citação curta**: no máximo 1 versículo por card, com a nota "(RVR 1960) © Sociedades Bíblicas en América Latina", conforme `docs/pesquisa-thompson.md`. **NVI nunca.**

---

## 3. O que deveria estar lá e não está (priorizado)

**P0: sem isto o produto não cumpre a promessa**
1. **Os 66 livros completos**: 2 Reis, Joel, 1 Reis 12–22, 2 Crônicas 10–36 e uma ficha própria de cada Evangelho.
2. **Paixão, morte, ressurreição e ascensão**: de 2 a 3 lições próprias.
3. **"En 1 minuto"**: resumo em 3 frases para quem tem pouco tempo (idoso cansado, mãe com filho no colo).
4. **"Qué leer en tu Biblia"**: os capítulos exatos de cada lição, com tempo estimado e leitura RV1909 dentro do app.
5. **"Antes y después"**: o que veio antes, o que vem depois e o botão "Siguiente en la historia". É isso que transforma resumos soltos em *uma história*.
6. **Data honesta**: separar "Cuándo pasó" de "Cuándo se escribió", com o selo "fecha aproximada/debatida" e uma linha de explicação.
7. **Linguagem fácil**: frases de até 20 palavras, vocabulário de 6º ano e nenhuma palavra difícil sem explicação.

**P1: diferenciais que o molde não tem**
8. **"Jesús en este libro"**: onde Cristo aparece, com promessa, figura ou citação no NT e 1–2 referências.
9. **Personagens principais com 1 linha cada** (quem é e por que importa), ligados a uma ficha global de personagens.
10. **Linha de eventos-chave em ordem** (3–6 eventos, com referência).
11. **Mapa da época**: um mapa por era (11), com o lugar de cada lição marcado.
12. **"Mientras tanto en el mundo"**: contexto mundial em 1–2 frases (as pirâmides já eram antigas, Assíria domina, Roma governa…).
13. **Tabela dos reis** de Israel e Judá com os profetas de cada reinado (1 tela interativa).
14. **Glossário** de palavras difíceis (pacto, expiação, profeta, gentio, circuncisão, tabernáculo, Messias…), em tooltip dentro do texto.
15. **"Para tu vida"**: 1 aplicação concreta + 1 pergunta pessoal + 1 oração curta. Substitui o "para meditar" genérico.
16. **Quiz de 3 perguntas** com explicação da resposta.
17. **"Para los niños"**: uma pergunta simples e uma mini-atividade (desenhar, contar, representar). Liga com o bônus "Actividades Bíblicas para Niños".
18. **Conexões com a busca de estudo cruzado**: 1–2 "cadeias" sugeridas por lição ("Sigue el hilo: el Cordero").

**P2: acabamento**
19. **Áudio** de cada lição (o produto upsell1 já prevê).
20. **Nota ecumênica** onde houver diferença real (canon, Ester/Daniel gregos, "hermanos del Señor", período intertestamentário), sempre neutra.
21. **Anexo "Los libros deuterocanónicos"**: 7 mini-fichas descritivas (Tobías, Judit, 1–2 Macabeos, Sabiduría, Eclesiástico, Baruc), sem entrar no debate, apenas "se encuentran en las Biblias católicas". **Decisão do dono.**
22. **Genealogia visual** (Adão → Abraão → Davi → Jesus) e "Profecia → Cumprimento" ampliado (20 pares com referência).
23. **Certificado/medalha** ao concluir cada era e o estudo todo (motivação e streak já existem no app).

---

## 4. Nossa versão: especificação do "Estudio Cronológico"

### 4.1 Princípios

1. **Uma história, não 66 resumos.** A unidade é a *lição* (um passo da história). O *livro* é uma ficha que aparece na primeira lição em que ele entra.
2. **Livros históricos formam o trilho** e **profetas e escritos se penduram no ponto em que falaram**. Livros paralelos (Samuel/Reis × Crônicas; os Evangelhos) são lidos **juntos** na mesma lição, com uma aba "Otra mirada: Crónicas".
3. **Dois níveis sempre:** *En 1 minuto* e *Estudio completo*.
4. **Toda data tem grau de certeza** e toda afirmação discutível ganha uma nota de 1 linha.
5. **Texto nosso**, RV1909 para leitura e RVR1960 ≤ 1 versículo por card.
6. **Tom de amor de Cristo**, ecumênico, sem atacar instituições (memória do projeto: "Christ Love Tone").

### 4.2 Seções (produto `cronologico`)

| # | Seção (tab) | Lições |
|---|---|---|
| 0 | **Introducción** | Comienza aquí · Cómo usar este estudio (niveles, marcar, quiz) · La gran historia en 11 eras (linha do tempo interativa) · ¿Por qué Antiguo y Nuevo Testamento? · Tu Biblia: católica y evangélica (nota ecumênica: 66/73 livros, versões) |
| 1 | Los comienzos | Génesis 1–11 |
| 2 | Los patriarcas | Génesis 12–50 · Job |
| 3 | Éxodo y desierto | Éxodo · Levítico · Números · Deuteronomio |
| 4 | Conquista y jueces | Josué · Jueces · Rut |
| 5 | El reino unido | 1 Samuel · 2 Samuel (+1 Cró 10–29) · Salmos · 1 Reyes 1–11 (+2 Cró 1–9) · Proverbios · Cantares · Eclesiastés |
| 6 | El reino dividido | ver a ordem detalhada abaixo (17 lições) |
| 7 | El exilio | Ezequiel · Daniel |
| 8 | El regreso | Esdras 1–6 · Hageo · Zacarías · Ester · Esdras 7–10 · Nehemías · 1 y 2 Crónicas (el libro) · Malaquías |
| 9 | Entre los Testamentos | Persia, Grecia, los Macabeos, Roma (+ anexo deuterocanónicos, se aprovado) |
| 10 | Jesús | 10 lições (abaixo) |
| 11 | La Iglesia | 28 lições (abaixo) + Conclusión |
| — | Herramientas (fixo) | Índice por libro (66, abre a 1ª lição) · Mapa por era · Reyes y profetas · Glosario · Personajes · **Búsqueda de estudio cruzado** |

### 4.3 Ordem cronológica completa (≈ 90 lições; cobre os 66 livros)

Datas: faixa tradicional + certeza (A = aproximada, D = debatida, I = incerta). Os livros aparecem por nome; "+" indica leitura paralela na mesma lição.

**Introducción (5):** I1 Comienza aquí · I2 Cómo usar · I3 Las 11 eras · I4 AT y NT · I5 Tu Biblia (católica/evangélica)

**AT (46 lições):**

| # | Lição | Datas (certeza) | Nota de decisão |
|---|---|---|---|
| 1 | Génesis 1–11: Los comienzos | sem data (I) | "La Biblia no da una fecha para la creación". Nada de 4000 a.C. |
| 2 | Génesis 12–50: Abraham, Isaac, Jacob, José | c. 2100–1800 a.C. (D) | |
| 3 | Job | fatos: época patriarcal (I); escrita: incerta | Posto aqui pela ambientação, com a nota |
| 4 | Éxodo | c. 1446 ou c. 1270 a.C. (D) | Mostrar as duas datas numa linha |
| 5 | Levítico | 1 ano no Sinai (D) | |
| 6 | Números | 40 anos no deserto (D) | Salmo 90 citado como "oração de Moisés" |
| 7 | Deuteronomio | fim dos 40 anos (D) | |
| 8 | Josué | c. 1400–1370 ou 1230–1200 (D) | |
| 9 | Jueces | c. 1370–1050 (D) | Explicar o ciclo em 5 passos |
| 10 | Rut | época dos juízes, c. 1100 (A) | |
| 11 | 1 Samuel | c. 1100–1010 (A) | |
| 12 | 2 Samuel + 1 Crónicas 10–29 | c. 1010–970 (A) | Aba "Otra mirada: Crónicas" |
| 13 | Salmos | c. 1400–450; maior parte na época de Davi (A) | Colocado no reinado de Davi, com a "cronologia dos Salmos" (Moisés → exílio) em 1 tela |
| 14 | 1 Reyes 1–11 + 2 Crónicas 1–9 | c. 970–930 (A) | Uma lição só, não duas como no molde |
| 15 | Proverbios | Salomão + acréscimos até Ezequias (A) | |
| 16 | Cantares | Salomão (A) | Ilustração **não** sensual |
| 17 | Eclesiastés | tradição: velhice de Salomão (D) | |
| 18 | 1 Reyes 12–22 + 2 Cró 10–20: El reino se divide; Elías | 930–850 (A) | **Nova** |
| 19 | Joel | data incerta: séc. IX ou pós-exílio (I) | **Nova**. Posto aqui com a nota; conexão com At 2 |
| 20 | 2 Reyes 1–14 + 2 Cró 21–25: Eliseo y los reyes | 850–790 (A) | **Nova** |
| 21 | Jonás | c. 780–760 (A) | |
| 22 | Amós | c. 760 (A) | |
| 23 | Oseas | c. 755–715 (A) | |
| 24 | 2 Reyes 15–17 + 2 Cró 26–28: Cae Samaria | 750–722 (A) | **Nova** |
| 25 | Isaías | c. 740–680 (A); caps. 40–66 olham para o exílio | Nota curta sobre a estrutura do livro, sem debate acadêmico |
| 26 | Miqueas | c. 735–700 (A) | |
| 27 | 2 Reyes 18–21 + 2 Cró 29–33: Ezequías y Manasés | 715–640 (A) | **Nova** |
| 28 | Nahúm | c. 660–612 (A) | Link com Jonás |
| 29 | 2 Reyes 22–23 + 2 Cró 34–35: Josías encuentra la Ley | 640–609 (A) | **Nova** |
| 30 | Sofonías | c. 630 (A) | |
| 31 | Jeremías | 627–580 (A) | |
| 32 | Habacuc | c. 610–600 (A) | |
| 33 | 2 Reyes 24–25 + 2 Cró 36: Cae Jerusalén | 609–586 (A) | **Nova** |
| 34 | Lamentaciones | 586 (A) | |
| 35 | Abdías | c. 586 (D, alternativa séc. IX) | |
| 36 | Ezequiel | 593–571 (A) | |
| 37 | Daniel | 605–c. 535 (A) | Nota ecumênica: Dn 3:24-90 e 13–14 nas Bíblias católicas |
| 38 | Esdras 1–6: Vuelven a casa | 538–516 (A) | Decreto de Ciro (2 Cr 36:22-23 como ponte) |
| 39 | Hageo | 520 (A) | |
| 40 | Zacarías | 520–c. 480 (A) | |
| 41 | Ester | 483–473 (A) | Nota: acréscimos gregos nas Bíblias católicas |
| 42 | Esdras 7–10: Esdras enseña la Ley | 458 (A) | |
| 43 | Nehemías | 445–c. 430 (A) | |
| 44 | 1 y 2 Crónicas: la historia contada otra vez | escrita c. 450–400 (A) | Ficha dos dois livros: por que recontar a história para quem voltou do exílio |
| 45 | Malaquías | c. 430 (A) | |
| 46 | Entre los Testamentos | 430–5 a.C. | Persia → Alejandro → Macabeos/Hanukkah → Roma, fariseus/saduceus, sinagoga, Septuaginta. Sem "silencio"; frase neutra sobre os deuterocanônicos |

**NT (38 lições + conclusão):**

| # | Lição | Datas | Livros cuja ficha abre aqui |
|---|---|---|---|
| 47 | Juan 1:1-18: El Verbo antes de todo | "antes del tiempo" | **Juan** (escrito c. 90) |
| 48 | Lucas 1 + Mateo 1: Los anuncios | c. 6–5 a.C. | **Lucas**, **Mateo** |
| 49 | Lucas 2 + Mateo 2: Nace Jesús; su niñez | c. 6–4 a.C. (A) | |
| 50 | Comienza el ministerio (Mc 1; Mt 3–4; Lc 3–4; Jn 1:19–4) | c. 27–28 d.C. (A) | **Marcos** |
| 51 | Galilea I: lo que Jesús enseñó (Sermón del Monte, parábolas) | c. 28–29 | |
| 52 | Galilea II: milagros y los Doce | c. 28–29 | liga ao bônus "43 Milagros" |
| 53 | Camino a Jerusalén (Lc 9–19; Jn 7–11) | c. 29–30 | |
| 54 | La última semana: entrada, templo, última cena | c. 30 ou 33 (D) | |
| 55 | Pasión y muerte en la cruz | c. 30/33 | **Nova** |
| 56 | Resurrección, apariciones y ascensión | c. 30/33 | **Nova** |
| 57 | Hechos 1–7: Nace la Iglesia | 30–35 | **Hechos** |
| 58 | Hechos 8–12: Samaria, Pablo, Cornelio | 35–44 | |
| 59 | Santiago | c. 45–49 (D) | |
| 60 | Hechos 13–14: primer viaje | 46–48 | |
| 61 | Gálatas | c. 48–49 (D) | |
| 62 | Hechos 15–18: concilio y segundo viaje | 49–52 | |
| 63 | 1 Tesalonicenses | c. 50–51 | |
| 64 | 2 Tesalonicenses | c. 51 | |
| 65 | Hechos 19–20: tercer viaje, Éfeso | 53–57 | |
| 66 | 1 Corintios | c. 54–55 | |
| 67 | 2 Corintios | c. 55–56 | |
| 68 | Romanos | c. 57 | |
| 69 | Hechos 21–28: preso hasta Roma | 57–62 | |
| 70 | Efesios | c. 60–62 | |
| 71 | Colosenses | c. 60–62 | |
| 72 | Filemón | c. 60–62 | |
| 73 | Filipenses | c. 61–62 | |
| 74 | 1 Timoteo | c. 62–64 | |
| 75 | Tito | c. 62–64 | |
| 76 | 1 Pedro | c. 62–64 | |
| 77 | 2 Timoteo | c. 64–67 | |
| 78 | 2 Pedro | c. 65–67 | |
| 79 | Hebreos | antes de 70 (A) | autor: "desconocido; la tradición pensó en Pablo, otros en Bernabé o Apolos" |
| 80 | Judas | c. 65–80 (D) | "Judas, hermano de Santiago" (Jd 1), sem "medio hermano" |
| 81 | 1 Juan | c. 85–95 | |
| 82 | 2 Juan | c. 85–95 | |
| 83 | 3 Juan | c. 85–95 | |
| 84 | Apocalipsis | c. 95 (D, alternativa c. 68) | nota: "hay varias maneras de leerlo; todas coinciden en que Cristo vence" |
| 85 | Conclusión: del Génesis al Apocalipsis | | |

Com 5 de introdução, **90 lições**. Os 66 livros têm ficha; a coluna "Datas" do NT é data de **escrita** para as cartas e data dos **fatos** para Evangelhos e Atos, sempre rotulada.

> **Livros divididos/sobrepostos: regra geral.** (a) Se a divisão melhora a ordem da história (Gênesis, Reis, Esdras, Atos), divide. (b) Se dois livros contam o mesmo fato (Samuel/Reis × Crônicas; os 4 Evangelhos), **junta numa lição** e mostra o paralelo em aba, com "qué añade cada uno". (c) A ficha do livro abre na primeira lição em que ele aparece e continua acessível pelo Índice por libro. (d) Profetas entram logo depois da lição histórica do reinado em que atuaram. Salmos e Provérbios entram onde nasceu o núcleo de cada coleção, com nota de que foram reunidos ao longo de séculos.

### 4.4 Campos de cada lição (modelo de dados e limites)

Proposta de extensão de `LessonContent` em `lib/catalog.ts` (os nomes são sugestão; os limites valem como regra editorial e como validação por schema):

| Campo | Nível | Conteúdo | Limite |
|---|---|---|---|
| `titulo` | ambos | Nome do passo da história ("Dios llama a Abraham") | ≤ 8 palavras |
| `era` | ambos | 1 das 11 eras (cor e mapa) | enum |
| `pasajes` | ambos | Faixas bíblicas da lição, em OSIS (`Gen.12.1-Gen.50.26`) | 1–6 faixas |
| `libros` | — | Livros cuja ficha abre aqui | ids |
| `enUnMinuto` | 1 min | **3 frases**: o que acontece, o ponto-chave e o que Deus revela | ≤ 60 palavras no total, frases ≤ 20 |
| `versiculo` | ambos | Texto **RV1909** + referência; `rvr1960` opcional (1 versículo) | ≤ 40 palavras |
| `fecha` | completo | `{ texto, desde, hasta, certeza: 'aprox'\|'debatida'\|'incierta', nota? }` com os anos numéricos negativos para a.C. | texto ≤ 12 palavras; nota ≤ 30 |
| `fechaEscrito` | ficha livro | Quando o livro foi escrito, com a mesma estrutura | ≤ 12 palavras |
| `autor` | ficha livro | "Tradicionalmente…" + nota se debatido | ≤ 15 + nota ≤ 25 |
| `lugar` | completo | Lugar principal + id do mapa | ≤ 6 palavras |
| `personajes` | completo | Nome + 1 linha (quem é e por que importa) + id global | 3–7 itens, ≤ 12 palavras cada |
| `eventos` | completo | Eventos-chave em ordem, com referência | 3–6 itens, ≤ 10 palavras cada |
| `resumen` | completo | 3–6 "momentos": subtítulo + texto | subtítulo ≤ 5; texto ≤ 60; **total 220–380** (livros curtos: 120–200) |
| `jesusAqui` | completo | "Jesús en esta parte de la historia": promessa, figura ou cumprimento + 1–2 refs NT | ≤ 60 palavras |
| `mundo` | completo | "Mientras tanto en el mundo…" | ≤ 40 palavras |
| `antes` / `despues` | ambos | O que veio antes e o que vem agora (alimenta "Siguiente en la historia") | ≤ 20 palavras cada |
| `conexiones` | completo | Ecos em outros livros: ref + motivo | 2–4 itens, ≤ 15 palavras cada |
| `glosario` | completo | ids de termos do glossário global usados no texto (tooltip) | 2–5 |
| `paraTuVida` | completo | 1 aplicação concreta + 1 pergunta pessoal | ≤ 40 palavras no total |
| `meditar` | ambos | (mantém o campo atual) oração curta de 1ª pessoa | ≤ 30 palavras |
| `ninos` | completo | `{ pregunta, actividad }` | ≤ 20 palavras cada |
| `quiz` | ambos | 3 perguntas × 3 opções + explicação da certa (1 fácil, 1 média, 1 de "conexão") | pergunta ≤ 18; opção ≤ 8; explicação ≤ 20 |
| `leer` | ambos | Capítulos para ler na RV1909 + minutos estimados | — |
| `notaEcumenica` | opcional | Diferença católica/evangélica, neutra | ≤ 40 palavras |
| `temas` | — | 3–6 slugs de tema para a busca cruzada | slugs do índice de temas |
| `cadenas` | ambos | 1–2 cadeias sugeridas ("Sigue el hilo") | ids de `chains` |
| `audio` | — | TTS da versão "estudio completo" | — |

**Ficha do livro** (66 registros, separada da lição): `nombre`, `grupo` (Ley/Historia/Poesía/Profetas/Evangelios/Hechos/Cartas/Profecía), `fechaEscrito`, `autor`, `destinatarios` (NT), `proposito` (≤ 30 palavras), `estructura` (3–6 partes com capítulos, ≤ 8 palavras cada), `capitulos` (número), `lecciones` (ids em que aparece).

**Regras de redação (valem para todos os redatores):** frase ≤ 20 palavras; voz ativa; "usted" nas instruções e "tú" nas perguntas pessoais (definir um, o app hoje usa "tú": **manter "tú"**); nomes na grafia RV1909/RVR1960 (Jehová só dentro de citação; no texto nosso, "Dios"/"el Señor"); nenhuma palavra fora do glossário acima do vocabulário do 6º ano; nada de "vibrante/inquebrantable/crucial/sublime/tapiz"; toda data com "c." ou selo; nunca mencionar denominações de forma crítica; nunca copiar nem parafrasear de perto o PDF-molde.

### 4.5 Níveis de leitura

| Nível | Mostra | Tempo | Para quem |
|---|---|---|---|
| **En 1 minuto** (padrão ao abrir) | título, era, `enUnMinuto`, versículo, `antes/despues`, botão "Ver estudio completo" | ~1 min | idoso cansado, leitura diária rápida, crianças com os pais |
| **Estudio completo** | tudo, em blocos recolhíveis e nesta ordem: ficha → personagens → eventos → resumo → Jesús aquí → mundo → conexões → Para tu vida → niños → quiz | 6–10 min | estudo pessoal ou em grupo |
| **Lee la Biblia** | texto RV1909 dos `pasajes`, com letra grande e botão "escuchar" | 10–40 min | quem quer ir à fonte |

Controles globais: tamanho de letra (A−/A+, mínimo 18 px no corpo), modo escuro (já existe) e "leer en voz alta".

### 4.6 Elementos interativos

1. **Marcar como leída** (já existe em `lib/progress.ts`): marca ao terminar o nível 1 **ou** o quiz.
2. **Quiz de 3 perguntas**: feedback imediato com a explicação. Errar não bloqueia. Acertar 3/3 dá uma estrela na lição.
3. **"Siguiente en la historia →"**: rodapé fixo com o título da próxima lição e o `antes/despues`. Também "← Anterior".
4. **Linha do tempo interativa**: faixa horizontal por era, com "Estás aquí" mostrando a lição atual. Tocar numa era leva à 1ª lição dela.
5. **Mapa da era**: pin do `lugar` da lição.
6. **Tooltips do glossário**: palavra sublinhada pontilhada; ao tocar, abre uma folha com a definição.
7. **Personagem**: ao tocar, abre a ficha global (em que lições aparece). Integra com o bônus "Biografías".
8. **Progresso por era** + medalha ao concluir cada era, e um certificado no fim.
9. **"Sigue el hilo"** (ligação com a busca, ver 4.7).

### 4.7 Ligação com a busca de estudo cruzado

- **Da lição para a busca:** cada lição mostra 1–2 chips "Sigue el hilo: *el Cordero* · *el pacto*" (`cadenas`). O toque abre a cadeia já **posicionada no elo desta lição** ("Eslabón 4 de 14 — estás aquí"). Os `temas` da lição alimentam "Temas relacionados".
- **Da busca para a lição:** cada elo da cadeia (`chain_links`) guarda o `lesson_id` onde aquela passagem cai (derivado de `pasajes`). O card do elo ganha "Ver en la historia", que abre a lição no nível 1. O `sort_year` do elo vem do mesmo `fecha.desde` da lição, **uma única fonte de datas** (tabela mestre, lote 0) para lições e cadeias. Isso evita que a busca diga uma data e a lição outra.
- **Semeadura:** as ~90 cadeias curadas (1 por lição, a partir do versículo-chave) são as primeiras geradas e revisadas. As demais seguem o pipeline automático de `docs/pesquisa-thompson.md` (OpenBible + Nave/Torrey + Theographic + DeepSeek), em cache.
- **Bloco "Conexiones"** da lição = os 2–4 elos de maior peso da cadeia principal, com o motivo reescrito pelo redator.

### 4.8 Quanto texto precisamos produzir

| Item | Qtde | Palavras/un. | Total |
|---|---|---|---|
| Lições completas (todos os campos) | 85 | ~1.150 (1 min 100 · ficha 60 · personagens 60 · eventos 45 · resumo 300 · Jesús 55 · mundo 35 · antes/depois 35 · conexões 50 · Para tu vida + meditar 65 · niños 35 · quiz 190 · nota/leer 25) | ~98.000 |
| Introdução e conclusão | 6 | ~600 | ~3.600 |
| Fichas de livro | 66 | ~130 | ~8.600 |
| Abertura de era (texto + mapa + legendas) | 11 | ~250 | ~2.750 |
| Glossário | ~250 termos | ~20 | ~5.000 |
| Personagens globais | ~220 | ~25 | ~5.500 |
| Tabela reis e profetas, profecias → cumprimento, genealogia | 3 telas | — | ~2.000 |
| **Total editorial** | | | **≈ 125.000 palavras** (≈ 4,7× o molde) |
| Cadeias curadas (semente da busca) | ~90 | ~900 (intro + 15 elos × ~55) | ~80.000, geradas por pipeline e **revisadas** |
| Anexo deuterocanônicos (se aprovado) | 7 | ~250 | ~1.750 |

Áudio: ~98 mil palavras ≈ 11–12 h de narração a 140 ppm, só para o "estudio completo". O nível 1 dá cerca de 1 h.

### 4.9 Divisão da produção entre agentes redatores

**Lote 0: Fundação (1 agente sênior + revisão humana do dono). Bloqueia todos os outros.**
- Tabela-mestra das 90 lições: id, título, era, `pasajes` OSIS, `fecha{desde,hasta,certeza}`, livros cuja ficha abre, próxima/anterior.
- Guia de estilo (4.4) + lista negra de palavras + 10 exemplos "antes/depois".
- Schema JSON/TS com validação dos limites.
- Glossário-semente (~120 termos) e personagens-semente (~120).
- **2 lições-modelo** escritas e aprovadas pelo dono: *Génesis 12–50* (narrativa do AT) e *Pasión y muerte* (NT, tema sensível). Todo o resto imita essas duas.

**Lotes de redação (podem rodar em paralelo depois do Lote 0; ~10–12 mil palavras cada):**

| Lote | Lições | Qtde |
|---|---|---|
| L1 | Introdução I1–I5 + Génesis 1–11, Génesis 12–50 (já modelo), Job | 8 |
| L2 | Éxodo, Levítico, Números, Deuteronomio, Josué, Jueces, Rut | 7 |
| L3 | 1 Samuel, 2 Samuel+1Cró, Salmos, 1 Reyes 1–11+2Cró, Proverbios, Cantares, Eclesiastés | 7 |
| L4 | 1 Reyes 12–22, Joel, 2 Reyes 1–14, Jonás, Amós, Oseas, 2 Reyes 15–17 | 7 |
| L5 | Isaías, Miqueas, 2 Reyes 18–21, Nahúm, 2 Reyes 22–23, Sofonías, Jeremías, Habacuc, 2 Reyes 24–25, Lamentaciones, Abdías | 11 |
| L6 | Ezequiel, Daniel, Esdras 1–6, Hageo, Zacarías, Ester, Esdras 7–10, Nehemías, 1–2 Crónicas, Malaquías, Entre los Testamentos | 11 |
| L7 | Jesús: lições 47–56 | 10 |
| L8 | Hechos 1–7, 8–12, Santiago, Hechos 13–14, Gálatas, Hechos 15–18, 1 Tes, 2 Tes, Hechos 19–20 | 9 |
| L9 | 1 Cor, 2 Cor, Romanos, Hechos 21–28, Efesios, Colosenses, Filemón, Filipenses | 8 |
| L10 | 1 Tim, Tito, 1 Pe, 2 Tim, 2 Pe, Hebreos, Judas, 1–3 Juan, Apocalipsis, Conclusión | 12 |

Cada redator recebe: tabela-mestra, guia, schema, as 2 lições-modelo, o texto RV1909 dos `pasajes` e as xrefs OpenBible desses capítulos, para que os campos "conexiones" e "Jesús aquí" venham de dados reais.

**Revisão por lote (agentes em sequência, reprovar volta ao redator):**
1. **Verificador de fatos:** toda referência existe na RV1909; datas iguais às da tabela-mestra; nomes e números conferidos com o texto bíblico; zero afirmação sem apoio.
2. **Revisor teológico-ecumênico:** nada que um católico ou evangélico sério rejeite; notas neutras; tom de amor de Cristo; nenhum ataque a instituição; cuidado com o judaísmo.
3. **Revisor de leitura fácil:** frases ≤ 20 palavras, índice Fernández-Huerta/INFLESZ ≥ 65 ("bastante fácil"), lista negra, glossário aplicado.
4. **Revisor anti-cópia:** comparação por n-gramas com o texto do PDF-molde (similaridade de trigramas < 5% por lição) e com RVR1960/NVI (nenhuma citação longa).

**Lote 11: Transversal (depois de todos):** costura de `antes/despues` e "Siguiente"; glossário e personagens finais (deduplicar); fichas dos 66 livros; conferência dos quizzes (sem respostas ambíguas); geração das ~90 cadeias curadas + revisão; roteiro de áudio.

---

## 5. Checklist de produção

1. Dono decide: (a) tratamento "tú"; (b) incluir ou não o anexo deuterocanônico; (c) usar RVR1960 curta nos cards ou só RV1909.
2. Baixar RV1909 (eBible/CrossWire, domínio público) e carregar na tabela `verses` com OSIS.
3. Montar a **tabela-mestra** das 90 lições (id, título, era, `pasajes`, datas com certeza, livros, anterior/próxima), com uma única fonte de datas para lições e busca.
4. Escrever o **guia de estilo** + lista negra de palavras + regras ecumênicas + regras de direitos autorais.
5. Estender `LessonContent` (`lib/catalog.ts`) com os campos de 4.4 e criar o schema de validação dos limites.
6. Criar os registros das **66 fichas de livro** (estrutura vazia) e o índice por livro.
7. Redigir e aprovar as **2 lições-modelo** (Génesis 12–50 e Pasión y muerte).
8. Glossário-semente (~120) e personagens-semente (~120).
9. Rodar os lotes **L1–L10** em paralelo, cada um com os 4 revisores (fatos, teológico-ecumênico, leitura fácil, anti-cópia).
10. Corrigir as reprovações até 100% das lições passarem no schema e nos revisores.
11. **Lote 11:** costurar anterior/próxima, fechar glossário e personagens, completar as fichas dos 66 livros, conferir os quizzes.
12. Substituir `OLD_TESTAMENT`/`NEW_TESTAMENT` em `lib/catalog.ts` pela nova ordem de 90 lições em 11 seções (+ Introdução). Aplicar a mesma lista ao produto de áudio `cronologico-audio`.
13. Renomear o produto para **"Estudio Cronológico de la Biblia"** (título, capa, `OFFERS.front`, textos de venda) e atualizar "Los 66 libros…" para refletir o novo conteúdo.
14. Construir a UI da lição: nível 1 como padrão, "Ver estudio completo", blocos recolhíveis, tooltips de glossário, quiz, "Siguiente en la historia", controle de letra (corpo ≥ 18 px).
15. Linha do tempo interativa das 11 eras com "Estás aquí".
16. 11 mapas por era (arte própria ou base de domínio público) com os pins dos `lugar`.
17. Tela "Reyes y profetas" e tela "Profecía → Cumplimiento" (20 pares).
18. Identidade visual: capa escura com feixe dourado + serif com glow + palavra-chave em ouro; 11 cores de era com contraste AA sobre o pergaminho; ilustrações num único estilo (1 por era + 1 por lição, opcional), sem cenas sensuais.
19. Gerar as ~90 **cadeias curadas** (pipeline de `pesquisa-thompson.md`), revisar e ligar `chain_links.lesson_id`; chips "Sigue el hilo" nas lições.
20. Crédito de fontes: RV1909 (domínio público), RVR1960 (nota ©), OpenBible (CC-BY), Theographic (CC BY-SA, só datas, em tabela separada).
21. Gerar o áudio (TTS) do "estudio completo" e do nível 1; subir no bucket `audios/<produto>/<lição>.mp3`.
22. QA com 3 perfis reais: uma pessoa de 70+ anos (letra, clareza), uma criança de 9–11 anos com um adulto (nível 1 + "niños" + quiz), e um católico e um evangélico praticantes (tom e notas ecumênicas).
23. Revisão final do dono em 10 lições sorteadas + todas as lições marcadas como sensíveis (Gênesis 1–11, Pasión, Apocalipsis, Entre los Testamentos, Ester, Daniel, Judas).
24. Publicar e medir: taxa de "marcar como leída", uso do nível completo × 1 minuto, acertos no quiz, cliques em "Sigue el hilo". Ajustar as lições com maior abandono.
