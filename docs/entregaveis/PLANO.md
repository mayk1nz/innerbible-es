# Plano de produção — entregáveis do front (Estudio Cronológico + 8 presentes)

Base: as 8 análises nesta pasta (00 a 07) e `docs/pesquisa-thompson.md`.
Regra geral: **texto 100% nosso** (nada copiado dos PDFs-molde), mesma temática e identidade do app,
leitura fácil para criança e idoso, tom de amor de Cristo, ecumênico.

## Decisões adotadas (padrão — o dono pode mudar)

| Tema | Decisão |
|---|---|
| Tratamento | **tú** (o app inteiro já usa) |
| Bíblia | **Texto completo em Reina-Valera 1909** (domínio público), com acentuação modernizada ("á su Hijo" → "a su Hijo"). Conteúdo novo cita só RV1909. RVR1960 exige licença comercial: os planos de 90 dias e o Consejero ainda citam RVR1960 → migrar ou pedir licença (pendente do dono). |
| Livros | Os **66 livros comuns** a todas as Bíblias + uma nota respeitosa para católicos (sem anexo deuterocanônico por ora). |
| Uma pessoa = uma ficha | Biografías guarda as fichas de personagens; Mujeres Virtuosas as das mulheres; **Caminando con Gigantes** (upsell 2) fica com estudos longos e aprofundados de poucos personagens — nada se repete. |
| Datas | Uma **única tabela-mestra de datas** para o Estudio, a busca, as biografias, os milagres e o plano 365. Toda data com "c." e grau de certeza. |
| Números de venda | Mantemos "43 Milagros" com critério declarado (35 milagres + 3 jornadas de curas + 5 grandes sinais). |
| Ordem do front | Estudio + 8 presentes: 1 Mapas · 2 Biografías · 3 Mandamientos · 4 Plan 365 · 5 Niños · 6 43 Milagros · 7 Mujeres · 8 Guía de Estudio con IA. |

## O que os moldes têm de pior (e nós resolvemos)

| Entregável | Molde | Nossa versão |
|---|---|---|
| **Estudio Cronológico** | 65 entradas, faltam 2 Reyes, Joel, metade de 1 Reyes/2 Crónicas, paixão e ressurreição; trechos em português; "Erro ao fazer upload"; datas como fato | **~90 lições em 11 eras**, cobre os 66 livros, Reis+Crônicas juntos, profetas no reinado em que falaram, 10 lições sobre Jesus; níveis "En 1 minuto" e "Estudio completo"; quiz; "Siguiente en la historia"; "Sigue el hilo" → busca cruzada |
| 1 Mapas mentales | carrossel do Instagram de outra marca, 10 de 66 livros, letra de 7 px | **72 mapas** (66 livros + 6 panorama) navegáveis por toque, modo letra grande e modo niños |
| 2 Biografías | 19 fichas, confunde Felipe/Felipe e os Santiagos, tradição como fato | **57 fichas** + "Quién es quién" + linha do tempo; Biblia × tradición separadas |
| 3 Mandamientos | carrossel, só numeração evangélica, Jesus não aparece | **14 lições** com selo duplo (evangélico/católico), Jesus e o grande mandamento, prática semanal, crianças |
| 4 Plan 365 | em português, cobre 72% da Bíblia, acaba no dia 255, dias com 46 capítulos | **365 dias gerados por algoritmo**, 100% dos 1.189 capítulos, ~15 min/dia, ordem cronológica, leitura aberta no app, modo 2 anos, retomar sem culpa |
| 5 Niños | 3 histórias, tradução automática do português, "iglesia" no tempo de Samuel | **"Rincón de los niños"**: 52 histórias (1ª leva 12), áudio, 3 idades, 6 mini-jogos no celular, folha para imprimir com gabarito, guia para pais/avós |
| 6 43 Milagros | 2 milagres inventados, 1 duplicado, anacronismos | **43 com critério**, ordem cronológica, todos os evangelhos, mapa, "qué revela de Jesús", família |
| 7 Mujeres | 10 fichas, erros (Ester 1 = Vasti), moralismo | **41 fichas** em 7 períodos, história + aplicação + grupos + crianças |
| 8 Guía IA | — (novo) | **Busca de estudo cruzado**: digita "Génesis 22", "Abraham", "la fe" → cadeia de passagens em ordem cronológica com explicação curta; dados livres (OpenBible 344 mil ligações + Theographic + RV1909) + DeepSeek |

## Fases (a ordem de execução)

**F0 — Fundação (em andamento).** Bloqueia o resto.
1. Bíblia RV1909 dentro do app (66 livros, 1.189 capítulos) + leitor com letra grande. ✅ dados baixados
2. Tabela-mestra das ~90 lições (ids, eras, passagens, datas com certeza) — a espinha de tudo.
3. Guia de estilo + lista negra de palavras + schema com limites + glossário e personagens-semente.
4. **2 lições-modelo** (Génesis 12–50 e Pasión y muerte) → **o dono aprova** antes de produzir o resto.

**F1 — O coração do front.**
5. Estudio Cronológico: 10 lotes de redação em paralelo + 4 revisores automáticos (fatos, teologia/ecumenismo, leitura fácil, anti-cópia).
6. Guía de Estudio con IA (presente 8): motor de cadeias + ~90 cadeias curadas + tela de busca.

**F2 — Presentes que saem rápido da base.**
7. Plan 365 (gerado da tabela-mestra). 8. 10 Mandamientos (14 lições). 9. 43 Milagros.

**F3 — Pessoas e mapas.** 10. Biografías (57). 11. Mujeres (41). 12. Mapas mentales (72, componente interativo).

**F4 — Crianças.** 13. Motor dos 6 mini-jogos + primeiras 12 histórias + ilustrações (precisa escolher a ferramenta de imagem com licença comercial).

**F5 — Upsells** (Audio e Palabras del Señor) — depois do front, como combinado.

## Interface (skills ui-ux-pro-max + frontend-design)
- Mesma identidade: capa escura com brilho dourado, serif (Literata), pergaminho, navy.
- Mínimo 18 px no corpo das lições, alvos de toque ≥ 44 px, contraste 4.5:1, modo escuro testado.
- Nível 1 ("En 1 minuto") aberto por padrão; o resto em blocos recolhíveis (revelação progressiva).
- Animação só com sentido (150–300 ms, transform/opacity, respeita "reduzir movimento").
- Ícones SVG (nada de emoji), um CTA principal por tela, navegação "Anterior / Siguiente en la historia".
