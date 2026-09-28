# Presente 1 — Mapas Mentales de la Biblia

Análise do PDF do concorrente (molde) e especificação da nossa versão dentro do app "La Biblia Interior".

- Arquivo analisado: `D:\1 youtube auto\Apps - Daniel asafh\entregaveis front\regalo 1 - mapas-mentales.pdf` (7,3 MB)
- Método: as 51 páginas foram lidas por inteiro (texto extraído com PyMuPDF). Renderizei e inspecionei visualmente 14 páginas representativas de todos os layouts (1, 2, 3, 5, 8, 12, 19, 23, 30, 36, 38, 40, 42, 47, 51). Os tamanhos de fonte foram medidos no próprio PDF, página por página.
- Data: 2026-09-28

---

## 1. O que é

### 1.1 Ficha técnica

| Item | Valor |
|---|---|
| Páginas | **51** (45 de conteúdo + 6 capas de bloco) |
| Formato | 810×1440 pt = **1080×1920 px, formato de story do Instagram** (metadado: "Mapas mentales (1080 x 1920 px)") |
| Origem | Feito no Canva, juntado no iLovePDF. Autor no metadado: "Be Ambitious". Marca d'água e links para **@institutolapalabra** (6 capas com link para o Instagram de terceiros) |
| Navegação | Não há sumário, marcadores (outline vazio) nem números de página. Os únicos 6 links levam para fora do produto (Instagram) |
| Texto | Vetorial (pesquisável), mas a ordem de leitura interna está embaralhada (o leitor de tela lê as caixas fora de ordem) |

**Conclusão central:** não é um produto pensado como "mapas mentais da Bíblia". É um **carrossel de Instagram reaproveitado** de outra marca, exportado como PDF.

### 1.2 Estrutura (6 blocos)

| Bloco | Páginas | Conteúdo |
|---|---|---|
| Panorama general de la Biblia | 1–6 | Estrutura dos 66 livros · Linha do tempo · Gêneros literários · Os pactos · Plano de redenção |
| Doctrinas bíblicas esenciales | 7–17 | Salvação (soteriologia) · Trindade · Justificação · Regeneração · Santificação · Graça vs. obras · Arrependimento · Bíblia como Palavra · Juízo final · Espírito Santo |
| Tópicos de vida cristiana | 18–28 | Fruto do Espírito · Armadura de Deus · Oração eficaz · Discipulado · Fé prática · Combate espiritual · Vida em comunidade · Generosidade · Perseverança · Santidade no cotidiano |
| Personajes bíblicos | 29–34 | Moisés · Davi · Ester · Paulo · Jesus |
| Jesucristo: centro de las Escrituras | 35–40 | Profecias no AT · Cumprimento no NT · Milagres · Parábolas · Morte, ressurreição e volta |
| Libros individuales resumidos | 41–51 | **Só 10 livros:** Gênesis, Êxodo, Salmos, Provérbios, Isaías, Mateus, João, Atos, Romanos, Apocalipse |

### 1.3 Os 4 layouts usados (o que cada "mapa" contém)

| Tipo | Páginas | Como é | É mapa mental? |
|---|---|---|---|
| **A. Radial com pranchetas** | 2–6, 36–40 | Uma imagem central (livros, pergaminho, alianças, estrela, cruz, Jesus) e 4 a 6 "pranchetas" lilás ligadas por setas tracejadas. Cada prancheta tem título + 3 a 6 linhas de texto | Parcialmente. É 1 nível só (centro → caixas), sem sub-ramos |
| **B. Fluxo em zigue-zague** | 8–17 | 6 caixas brancas com etiqueta colorida, ligadas por setas pretas curvas que alternam esquerda/direita. Uma ilustração num canto | Não. É um fluxograma linear de 6 passos |
| **C. Cartão + ilustração** | 19–34 | Parágrafo de introdução + 3 caixas + clipart grande (uva, árvore, lâmpada, Jesus, Moisés) | Não. É um infográfico. A ilustração ocupa cerca de 40% da página |
| **D. Livro** | 42–51 | Resumo do livro em negrito à direita + 4 caixas empilhadas à esquerda, cada uma com referência de capítulos, e clipart | Não. É uma lista de 4 tópicos |

- **Ramos por mapa:** sempre 4 a 6, e sempre 1 nível só. Não há sub-ramo, conexão entre mapas nem nó "folha".
- **Cores:** cada página tem uma cor de destaque (turquesa, amarelo, vermelho, roxo, laranja, azul, verde) sobre fundo branco com rabiscos decorativos. **A cor não significa nada**: não codifica testamento, gênero nem tema, e muda de página para página sem lógica.
- **Ilustrações:** clipart de estilos misturados na mesma peça (cartoon, foto realista, dourado metalizado, aquarela). Jesus aparece em pelo menos 3 estilos diferentes.

### 1.4 Qualidade visual e legibilidade no celular

Os tamanhos de fonte foram medidos no PDF e convertidos para um celular comum (390 px de largura, página ajustada à tela):

| Uso | Tamanho no PDF | **No celular** | Páginas |
|---|---|---|---|
| Texto das caixas (tipos A) | 15 pt | **7,2 px** | 2–6, 36–40 (10 págs) |
| Texto das caixas (tipos B, C, D) | 19 pt | **9,1 px** | 8–17, 19–34, 42–51 (35 págs) |
| Etiquetas das caixas | 24–30 pt | 11,6–14,4 px | todas |
| Títulos | 44–77 pt | 21–37 px | todas |

- O próprio app define como mínimo de leitura cerca de 16 px (`text-[15.5px]`, e `fontScale` de 0.9 a 1.4). No PDF, **100% do conteúdo explicativo fica abaixo de 10 px**. Para o público 45+ e para idosos, **todas as 45 páginas de conteúdo exigem zoom com pinça, caixa por caixa**. Crianças pequenas não conseguem ler.
- Fundo branco puro: ofusca à noite e não segue o modo escuro do app.
- O visual é "fofo" e colorido, bom para postagem, mas **não tem nada da nossa identidade** (pergaminho, serifa, capa escura com brilho dourado).

---

## 2. Falhas e brechas

### 2.1 Cobertura (a maior falha)
1. **Só 10 dos 66 livros (15%).** Faltam 56, entre eles: Levítico, Números, Deuteronômio, **todos os históricos** (Josué → Ester), Jó, Eclesiastes, Cantares, Jeremias, Lamentações, Ezequiel, Daniel, **os 12 profetas menores**, Marcos, Lucas e **20 das 21 cartas**. O nosso catálogo promete "Cada libro en una sola imagen", e o molde nem chega perto disso.
2. **Cada livro recebe sempre 4 caixas**, qualquer que seja o tamanho. Salmos (150 capítulos) tem 4 caixas. Em Gênesis, "Génesis 12–50" (39 capítulos: Abraão, Isaque, Jacó e José) vira **uma caixa só**, e Caim e Abel, Babel, Jacó e a história de José não aparecem como ramos.
3. Os livros não trazem ficha (autor, época, lugar, personagens), versículo-chave, "onde Jesus aparece", aplicação nem conexões com outros livros.

### 2.2 Erros de texto e de revisão
4. **Restos de português** (a tradução foi feita a partir de um material brasileiro): "GÊNESIS / Gênesis" (p. 42), "ÊXODO / Êxodo" (p. 43), "PROVÉRBIOS" (p. 45), "la oração madura" (p. 21), "no es em vão" (p. 27), "onde está à la diestra del Padre" (p. 40).
5. **Títulos cortados:** "LOS PATRIARCAS DE ISRAE" (p. 42) e "RECONOCIMIENT / O APOSTÓLICO" (p. 37).
6. **Citações entre aspas que não são literais e misturam versões, sem indicar qual:**
   - Miquéias 5:2, "pequeña entre los clanes de Judá" (p. 36): não é o texto da RVR1960.
   - 1 João 5:14 (p. 21) e João 13:35, "si tenéis amor los unos por los otros" (p. 25): paráfrases.
   - "Vayan y hagan discípulos" (p. 22) está em estilo NVI, e "Sed santos" (p. 28) em estilo RVR.
7. **Simplificação histórica que induz a erro:** "Después de 70 años, regresan con Zorobabel, Esdras y Nehemías" (p. 3). Foram retornos em ondas separadas por cerca de 90 anos.
8. "Pentateuco … Escritos por Moisés" é afirmado como fato. O nosso próprio app usa, com mais cuidado, "Tradicionalmente atribuido a Moisés".

### 2.3 Estrutura e leitura
9. **Sequências desenhadas em círculo.** A linha do tempo (p. 3) e o plano de redenção (p. 6) são histórias com ordem, mas estão dispostos em radial, com setas tracejadas saindo do centro e sem números. O leitor não sabe por onde começar. **A linha do tempo não tem nenhuma data.**
10. A p. 2 põe "Nuevo Testamento" no mesmo nível de "Pentateuco" ou "Profetas Menores" (mistura níveis) e não divide o NT (Evangelhos / Atos / cartas de Paulo / cartas gerais / Apocalipse).
11. Não há explicação de **como usar**, índice, busca nem ligação entre páginas. O PDF de 7,3 MB é lento no celular e cai na pasta de downloads, onde se perde.

### 2.4 Tom, ecumenismo e público
12. **O bloco de doutrinas é confessional (evangélico/reformado)**, apresentado como se fosse "a" doutrina bíblica: "Pacto de las Obras" (p. 5), "únicamente por la fe … no por obras" (p. 8, 10, 13), "Ninguna tradición u opinión puede estar por encima de ella" e "Inerrancia" (p. 15). Para o público católico (metade do nosso), isso contradiz o ensino da própria igreja. Não chega a ser um ataque, mas **exclui** esse público, o que vai contra a nossa regra ecumênica.
13. "Estructura de los **66** libros" ignora que as Bíblias católicas têm 73 livros. Não há nenhuma nota a respeito.
14. **Imagens inadequadas:**
    - Uma serpente verde realista em destaque na página da salvação (p. 8): assusta crianças e contradiz a mensagem.
    - Alianças de casamento como símbolo dos pactos bíblicos (p. 5).
    - Uma tábua cuneiforme como ícone de Gênesis (p. 42).
15. **Não há versão para crianças.** O vocabulário é técnico: "soteriología", "escatológicas", "muerte sustitutiva", "regeneración".
16. **Sobreposição com outros presentes** do nosso pacote: "Personajes" repete Biografías, "Milagros de Jesús" repete os 43 Milagros e "Mandamientos" repete os 10 Mandamientos. No molde, cada peça é isolada. No app, esse conteúdo deve **ligar** para o outro presente, e não duplicar.
17. **Risco jurídico/marca:** as imagens são clipart do Canva e o conteúdo é de terceiros (@institutolapalabra). Não reaproveitar nenhuma imagem nem frase.

---

## 3. O que deveria estar lá e não está (priorizado)

**P0 — sem isto o presente não cumpre a promessa**
1. **Os 66 livros**, um mapa por livro, na mesma ordem cronológica do Estudio, cada um **ligado à sua lição**.
2. Legível num celular de 360 px **sem pinça**: texto ≥ 17 px na escala 1, respeitando o `fontScale` do app (até 1.4).
3. **Ordem de leitura explícita**: ramos numerados 1 → 6, na ordem da narrativa.
4. Um "Cómo usar este mapa" de 3 passos, com ícones, no primeiro acesso.
5. Espanhol limpo, uma só versão bíblica declarada (RVR1960 em citações curtas, ou RV1909) e referências verificadas.
6. Neutralidade ecumênica: nada de disputa doutrinária entre igrejas.

**P1 — o que nos torna claramente melhores**
7. Ficha do livro (autor tradicional, época, capítulos, lugares, personagens), **coerente com a lição do Estudio** (mesma data, mesmo autor).
8. Versículo-chave, "Jesús en este libro", "Para tu vida" (1 ou 2 passos práticos).
9. **Mapa dos mapas** (panorama): os 66 livros agrupados por gênero, e cada um abre o seu mapa.
10. **Linha do tempo linear e com datas aproximadas**, com cada época ligada aos seus livros.
11. **Modo niños** (frases de até 15 palavras e um mini-jogo de 3 perguntas) e **modo letra grande / paso a paso** (um ramo por tela, com botão "Siguiente").
12. Progresso: "Mapa visto" conta pontos e sequência (reaproveita `completeLesson`).

**P2 — diferenciais**
13. Narração em áudio de cada ramo (para idosos com vista cansada).
14. "Guardar como imagen" (PNG gerado dos dados, com a marca do app) para compartilhar no WhatsApp. É o nosso canal de indicação.
15. Conexões entre livros (por exemplo, a árvore da vida em Gênesis 2 e em Apocalipse 22) e com os outros presentes (Biografías, Mujeres Virtuosas, 43 Milagros).
16. Uma nota respeitosa sobre os livros deuterocanônicos (Bíblias católicas), com uma decisão do dono sobre incluir 7 mapas extras (ver §4.9).

---

## 4. A nossa versão no app (especificação)

### 4.1 Princípio
Nada de imagem estática nem de PDF. Cada mapa é **um arquivo JSON de dados**, renderizado em HTML+SVG com a identidade do app. Com isso, o texto cresce com o `fontScale`, funciona em modo claro e escuro, é lido por leitor de tela na ordem certa, funciona offline (PWA) e é corrigido editando uma linha.

### 4.2 Onde fica no catálogo (`lib/catalog.ts`)
O produto `mapas-mentales` hoje é `pendingGuide()`. Ele passaria a ter:

| Seção | Lições |
|---|---|
| `como-usar` | "Cómo usar los mapas" (texto curto + demonstração animada) |
| `panorama` | Mapa de la Biblia (mapa dos mapas) · Línea del tiempo · Géneros literarios · Los pactos de Dios · La historia de la salvación · Jesús en toda la Biblia |
| `antiguo-testamento` | 39 mapas, **na ordem de `OLD_TESTAMENT`** |
| `nuevo-testamento` | 27 mapas, na ordem de `NEW_TESTAMENT` |

Proposta de tipo (espelha o padrão `plan` que já existe):

```ts
// Lesson
mapa?: { id: string }            // lib/content/mapas/<id>.json, carregado só ao abrir (como loadPlanDay)
```

Com isso, o `LessonView` ganha um ramo novo, "se `lesson.mapa`, renderiza `<MindMapView>`", e mantém `CompletionCard`, `ReflectionBox` e `SharedReflections`. Assim, sequência, pontos e reflexões funcionam sem código especial.

> **Achado lateral no nosso catálogo:** `OLD_TESTAMENT` tem 37 entradas e **não contém 2 Reyes, Joel, 1 Reyes 12–22 nem 2 Crónicas 10–36**. Os mapas de 2 Reis e de Joel ficariam sem lição para ligar, e o Estudio não cumpre "los 66 libros". É preciso decidir isso antes da produção.

### 4.3 Modelo de dados (TypeScript = contrato do JSON)

```ts
export type MapaTipo = 'libro' | 'tema'
export type Testamento = 'AT' | 'NT'
export type GrupoLibro =
  | 'pentateuco' | 'historicos' | 'poeticos' | 'profetas-mayores' | 'profetas-menores'
  | 'evangelios' | 'hechos' | 'cartas-pablo' | 'cartas-generales' | 'apocalipsis'
export type RamaColor = 'warm' | 'amber' | 'dawn' | 'olive' | 'rose' | 'dusk' // = paletas das capas
export type HojaTipo = 'evento' | 'persona' | 'lugar' | 'ensenanza' | 'promesa'
export type Version = 'RVR1960' | 'RV1909'

export interface Cita {
  texto: string          // literal, máx. 25 palavras (RVR1960 = citação curta)
  referencia: string     // "Génesis 1:1" — nome do livro por extenso, sempre
  version: Version
}

export interface Hoja {
  id: string             // único dentro do mapa, kebab-case
  titulo: string         // máx. 5 palavras
  texto: string          // máx. 30 palavras, texto próprio
  textoNino?: string     // máx. 15 palavras, vocabulário infantil
  referencia: string     // "Génesis 6–9" ou "Génesis 22:1-14"
  tipo: HojaTipo
}

export interface Rama {
  id: string
  orden: number          // 1..6 — ordem de leitura, aparece como número no mapa
  titulo: string         // máx. 4 palavras
  capitulos: string      // "1–2"
  color: RamaColor
  icono: string          // nome de ícone existente em components/icons.tsx (validado)
  resumen: string        // máx. 30 palavras
  resumenNino: string    // máx. 15 palavras
  cita?: Cita
  hojas: Hoja[]          // 2 a 4
}

export interface Conexion {
  tipo: 'mapa' | 'leccion'
  id: string             // id do mapa, ou "productId/lessonId"
  motivo: string         // máx. 20 palavras
}

export interface Pregunta {           // mini-jogo do modo niños
  pregunta: string
  opciones: [string, string, string]
  correcta: 0 | 1 | 2
  referencia: string
}

export interface MapaMental {
  id: string                     // = slug usado em /leccion/mapas-mentales/<id>
  version: number                // sobe a cada revisão publicada
  tipo: MapaTipo
  titulo: string
  subtitulo: string              // máx. 6 palavras
  testamento?: Testamento        // só tipo 'libro'
  grupo?: GrupoLibro
  capitulos?: number
  lecciones: { productId: string; lessonId: string }[]  // validado contra o catálogo
  ficha?: {
    autor: string                // igual ao LessonContent.autor da lição (validado quando existir)
    epoca: string
    lugares: string[]
    personajes: string[]
  }
  centro: { texto: string; textoNino: string }   // a ideia do livro em 1 frase (≤ 12 palavras)
  versiculoClave: Cita
  ramas: Rama[]                  // 4 a 6
  cristo: { texto: string; referencias: string[] } // "Jesús en este libro" — máx. 45 palavras
  paraTuVida: string[]           // 1 a 3 passos, máx. 20 palavras cada
  preguntas: Pregunta[]          // 3
  conexiones: Conexion[]         // 0 a 4
  revision: { estado: 'borrador' | 'revisado' | 'aprobado'; revisadoPor?: string; fecha: string }
}
```

Regras do validador (`scripts/validate-mapas.mjs`, a rodar no build):
- Limites de palavras.
- 4 a 6 ramos e 2 a 4 folhas por ramo.
- `orden` contínuo, começando em 1.
- Ícone existente.
- `lecciones` e `conexiones` existentes no catálogo e nos mapas.
- Referências válidas: o livro existe e capítulo/versículo estão dentro dos limites, conferidos numa tabela de versículos por capítulo.
- Em `Cita` com `RV1909`, o texto é comparado automaticamente com o texto público da RV1909.
- `ficha.autor` e `ficha.epoca` iguais aos da lição, quando ela existir.
- Nenhum caractere de português (ê, ã, õ, ç) nos textos.

### 4.4 Exemplo completo: Génesis (texto próprio, em espanhol)

As citações são curtas, da RVR1960. Ficha e versículo-chave coincidem com `lib/content/sample.ts`.

```json
{
  "id": "genesis",
  "version": 1,
  "tipo": "libro",
  "titulo": "Génesis",
  "subtitulo": "El libro de los comienzos",
  "testamento": "AT",
  "grupo": "pentateuco",
  "capitulos": 50,
  "lecciones": [
    { "productId": "cronologico", "lessonId": "genesis" },
    { "productId": "cronologico-audio", "lessonId": "genesis" }
  ],
  "ficha": {
    "autor": "Tradicionalmente atribuido a Moisés",
    "epoca": "De la creación hasta la muerte de José (c. 1805 a. C.)",
    "lugares": ["El huerto del Edén", "Ur y Harán, en Mesopotamia", "Canaán", "Egipto"],
    "personajes": ["Adán y Eva", "Noé", "Abraham y Sara", "Isaac y Rebeca", "Jacob", "José"]
  },
  "centro": {
    "texto": "Dios crea todo bueno y no abandona a quienes se alejan",
    "textoNino": "Dios hizo todo con amor y siempre cuida de nosotros"
  },
  "versiculoClave": {
    "texto": "En el principio creó Dios los cielos y la tierra.",
    "referencia": "Génesis 1:1",
    "version": "RVR1960"
  },
  "ramas": [
    {
      "id": "creacion",
      "orden": 1,
      "titulo": "Dios crea el mundo",
      "capitulos": "1–2",
      "color": "warm",
      "icono": "sparkles",
      "resumen": "Con su palabra, Dios ordena el universo en seis días y descansa el séptimo. Forma al hombre y a la mujer a su imagen y les confía la tierra.",
      "resumenNino": "Dios hizo la luz, el mar, los animales y a las personas.",
      "cita": {
        "texto": "Y vio Dios todo lo que había hecho, y he aquí que era bueno en gran manera.",
        "referencia": "Génesis 1:31",
        "version": "RVR1960"
      },
      "hojas": [
        {
          "id": "seis-dias",
          "titulo": "Seis días y un descanso",
          "texto": "Día tras día, Dios separa la luz de las tinieblas, las aguas de la tierra y llena todo de vida. El séptimo día lo bendice y descansa.",
          "textoNino": "En seis días Dios hizo todo. El séptimo día descansó.",
          "referencia": "Génesis 1:1–2:3",
          "tipo": "evento"
        },
        {
          "id": "imagen-de-dios",
          "titulo": "Hechos a su imagen",
          "texto": "El ser humano no es un accidente: Dios lo forma con cuidado, le da aliento de vida y lo llama a cuidar la creación junto a Él.",
          "textoNino": "Dios nos hizo parecidos a Él para ser sus amigos.",
          "referencia": "Génesis 1:26-28; 2:7",
          "tipo": "ensenanza"
        },
        {
          "id": "eden",
          "titulo": "El huerto del Edén",
          "texto": "Dios planta un huerto para Adán y Eva, con el árbol de la vida en medio. Allí viven en paz con Dios y entre ellos.",
          "textoNino": "Adán y Eva vivían en un jardín precioso con Dios.",
          "referencia": "Génesis 2:8-25",
          "tipo": "lugar"
        }
      ]
    },
    {
      "id": "caida",
      "orden": 2,
      "titulo": "El pecado entra",
      "capitulos": "3–5",
      "color": "rose",
      "icono": "alert",
      "resumen": "Adán y Eva desconfían de Dios y desobedecen. La comunión se rompe y el mal se extiende, pero Dios sale a buscarlos y anuncia una esperanza.",
      "resumenNino": "Adán y Eva desobedecieron, pero Dios no dejó de amarlos.",
      "cita": {
        "texto": "Mas Jehová Dios llamó al hombre, y le dijo: ¿Dónde estás tú?",
        "referencia": "Génesis 3:9",
        "version": "RVR1960"
      },
      "hojas": [
        {
          "id": "desobediencia",
          "titulo": "La desobediencia",
          "texto": "La serpiente siembra la duda y comen del árbol prohibido. Aparecen la vergüenza, el miedo y la tendencia a culpar a otros.",
          "textoNino": "Comieron la fruta que Dios les pidió no comer.",
          "referencia": "Génesis 3:1-13",
          "tipo": "evento"
        },
        {
          "id": "primera-promesa",
          "titulo": "Una promesa de victoria",
          "texto": "Dios anuncia que un descendiente de la mujer vencerá a la serpiente. Los cristianos ven aquí el primer anuncio del Salvador.",
          "textoNino": "Dios prometió que un día vendría alguien a salvarnos.",
          "referencia": "Génesis 3:15",
          "tipo": "promesa"
        },
        {
          "id": "cain-abel",
          "titulo": "Caín y Abel",
          "texto": "La envidia lleva a Caín a matar a su hermano. Aun así, Dios le habla, lo confronta y lo protege.",
          "textoNino": "Caín se enojó con su hermano Abel. Dios le habló con amor.",
          "referencia": "Génesis 4:1-16",
          "tipo": "persona"
        }
      ]
    },
    {
      "id": "noe",
      "orden": 3,
      "titulo": "Noé y el diluvio",
      "capitulos": "6–11",
      "color": "dawn",
      "icono": "globe",
      "resumen": "La violencia llena la tierra. Dios salva a Noé, a su familia y a los animales en el arca, y después hace un pacto con toda la creación.",
      "resumenNino": "Noé construyó un barco enorme y Dios lo cuidó en el diluvio.",
      "cita": {
        "texto": "Pero Noé halló gracia ante los ojos de Jehová.",
        "referencia": "Génesis 6:8",
        "version": "RVR1960"
      },
      "hojas": [
        {
          "id": "arca",
          "titulo": "El arca",
          "texto": "Noé obedece y construye el arca siguiendo las instrucciones de Dios, aunque aún no hay señales de lluvia.",
          "textoNino": "Noé hizo el arca porque confió en Dios.",
          "referencia": "Génesis 6:9–7:24",
          "tipo": "evento"
        },
        {
          "id": "arco-iris",
          "titulo": "El arco iris",
          "texto": "Al bajar las aguas, Dios promete no volver a destruir la tierra con un diluvio, y pone el arco en las nubes como señal.",
          "textoNino": "El arco iris nos recuerda que Dios cumple sus promesas.",
          "referencia": "Génesis 8:1–9:17",
          "tipo": "promesa"
        },
        {
          "id": "babel",
          "titulo": "La torre de Babel",
          "texto": "Los hombres quieren hacerse un nombre construyendo una torre hasta el cielo. Dios confunde su lengua y los dispersa por la tierra.",
          "textoNino": "Quisieron hacer una torre hasta el cielo sin Dios.",
          "referencia": "Génesis 11:1-9",
          "tipo": "evento"
        }
      ]
    },
    {
      "id": "abraham",
      "orden": 4,
      "titulo": "Abraham, el amigo de Dios",
      "capitulos": "12–25",
      "color": "amber",
      "icono": "star",
      "resumen": "Dios llama a Abraham a dejar su tierra y le promete una familia, una tierra y bendición para todos los pueblos. Abraham cree y camina con Él.",
      "resumenNino": "Dios le prometió a Abraham una familia tan grande como las estrellas.",
      "cita": {
        "texto": "Y creyó a Jehová, y le fue contado por justicia.",
        "referencia": "Génesis 15:6",
        "version": "RVR1960"
      },
      "hojas": [
        {
          "id": "llamado",
          "titulo": "El llamado",
          "texto": "Ya mayor, Abraham sale de Harán sin saber adónde va, confiando solo en la palabra de Dios.",
          "textoNino": "Abraham dejó su casa porque Dios se lo pidió.",
          "referencia": "Génesis 12:1-9",
          "tipo": "evento"
        },
        {
          "id": "isaac-nace",
          "titulo": "El hijo de la promesa",
          "texto": "Sara y Abraham, muy ancianos, reciben a Isaac. Para Dios no hay nada imposible.",
          "textoNino": "Dios les dio un bebé cuando ya eran abuelitos.",
          "referencia": "Génesis 18:1-15; 21:1-7",
          "tipo": "promesa"
        },
        {
          "id": "moriah",
          "titulo": "En el monte Moriah",
          "texto": "Dios prueba la fe de Abraham y detiene su mano. Él mismo provee un carnero en lugar de Isaac.",
          "textoNino": "Dios cuidó de Isaac y dio un cordero en su lugar.",
          "referencia": "Génesis 22:1-19",
          "tipo": "evento"
        }
      ]
    },
    {
      "id": "jacob",
      "orden": 5,
      "titulo": "Isaac y Jacob",
      "capitulos": "25–36",
      "color": "olive",
      "icono": "users",
      "resumen": "La promesa pasa a Isaac y luego a Jacob, un hombre astuto y lleno de conflictos. Dios lo encuentra, lo transforma y le da un nombre nuevo: Israel.",
      "resumenNino": "Jacob hizo cosas mal, pero Dios lo cambió y le dio un nombre nuevo.",
      "cita": {
        "texto": "He aquí, yo estoy contigo, y te guardaré por dondequiera que fueres",
        "referencia": "Génesis 28:15",
        "version": "RVR1960"
      },
      "hojas": [
        {
          "id": "esau",
          "titulo": "Dos hermanos rivales",
          "texto": "Jacob obtiene la primogenitura y la bendición de Esaú con engaños, y tiene que huir de casa.",
          "textoNino": "Jacob engañó a su hermano y tuvo que irse lejos.",
          "referencia": "Génesis 25:19-34; 27",
          "tipo": "persona"
        },
        {
          "id": "betel",
          "titulo": "La escalera de Betel",
          "texto": "Solo y en camino, Jacob sueña con una escalera entre la tierra y el cielo. Dios le renueva la promesa de Abraham.",
          "textoNino": "Jacob soñó con una escalera que llegaba al cielo.",
          "referencia": "Génesis 28:10-22",
          "tipo": "lugar"
        },
        {
          "id": "israel",
          "titulo": "Un nombre nuevo",
          "texto": "Jacob lucha toda la noche y pide ser bendecido. Recibe el nombre de Israel, y después se reconcilia con Esaú.",
          "textoNino": "Dios llamó a Jacob «Israel» y él hizo las paces con su hermano.",
          "referencia": "Génesis 32:22–33:17",
          "tipo": "evento"
        }
      ]
    },
    {
      "id": "jose",
      "orden": 6,
      "titulo": "José en Egipto",
      "capitulos": "37–50",
      "color": "dusk",
      "icono": "heart",
      "resumen": "Vendido por sus hermanos, José pasa por la esclavitud y la cárcel. Dios lo levanta en Egipto, y él perdona y salva a su familia del hambre.",
      "resumenNino": "Los hermanos de José fueron malos con él, pero José los perdonó.",
      "cita": {
        "texto": "Vosotros pensasteis mal contra mí, mas Dios lo encaminó a bien",
        "referencia": "Génesis 50:20",
        "version": "RVR1960"
      },
      "hojas": [
        {
          "id": "vendido",
          "titulo": "Vendido por envidia",
          "texto": "José, el hijo preferido de Jacob, cuenta sus sueños. Sus hermanos, celosos, lo venden a unos mercaderes que van a Egipto.",
          "textoNino": "Sus hermanos tuvieron celos y lo vendieron.",
          "referencia": "Génesis 37",
          "tipo": "evento"
        },
        {
          "id": "faraon",
          "titulo": "De la cárcel al palacio",
          "texto": "Fiel incluso siendo tratado injustamente, José interpreta los sueños del faraón y prepara a Egipto para siete años de hambre.",
          "textoNino": "Dios ayudó a José a entender los sueños del rey.",
          "referencia": "Génesis 39–41",
          "tipo": "persona"
        },
        {
          "id": "perdon",
          "titulo": "El perdón",
          "texto": "Cuando sus hermanos llegan a pedir alimento, José se da a conocer llorando, los abraza y lleva a toda la familia a Egipto.",
          "textoNino": "José abrazó a sus hermanos y los perdonó.",
          "referencia": "Génesis 42–47",
          "tipo": "ensenanza"
        },
        {
          "id": "bendiciones",
          "titulo": "Una familia bendecida",
          "texto": "Jacob bendice a sus doce hijos antes de morir. Allí nacen las doce tribus de Israel, y la historia sigue en Éxodo.",
          "textoNino": "Jacob tuvo doce hijos y los bendijo a todos.",
          "referencia": "Génesis 49–50",
          "tipo": "promesa"
        }
      ]
    }
  ],
  "cristo": {
    "texto": "Génesis anuncia a Jesús desde el principio: el descendiente que vence al mal, la bendición prometida a todos los pueblos por medio de Abraham y el cordero que Dios provee. Y José, rechazado y luego exaltado, perdona y salva.",
    "referencias": ["Génesis 3:15", "Génesis 12:3", "Génesis 22:8", "Gálatas 3:8", "Juan 1:29"]
  },
  "paraTuVida": [
    "Cuando te equivoques, no te escondas: Dios te sigue buscando como buscó a Adán.",
    "Piensa en alguien a quien te cuesta perdonar y ora hoy por esa persona, como hizo José."
  ],
  "preguntas": [
    {
      "pregunta": "¿Qué señal puso Dios en las nubes después del diluvio?",
      "opciones": ["Una estrella", "Un arco iris", "Una paloma"],
      "correcta": 1,
      "referencia": "Génesis 9:13"
    },
    {
      "pregunta": "¿Qué nombre nuevo le dio Dios a Jacob?",
      "opciones": ["Israel", "Abraham", "Moisés"],
      "correcta": 0,
      "referencia": "Génesis 32:28"
    },
    {
      "pregunta": "¿Qué hizo José cuando volvió a ver a sus hermanos?",
      "opciones": ["Los castigó", "Se escondió", "Los perdonó"],
      "correcta": 2,
      "referencia": "Génesis 45:1-15"
    }
  ],
  "conexiones": [
    { "tipo": "mapa", "id": "exodo", "motivo": "La familia de Jacob crece en Egipto; allí empieza el Éxodo." },
    { "tipo": "mapa", "id": "apocalipsis", "motivo": "El árbol de la vida del Edén vuelve a aparecer al final de la Biblia." },
    { "tipo": "mapa", "id": "job", "motivo": "En el Estudio Cronológico, Job se lee justo después de Génesis." }
  ],
  "revision": { "estado": "borrador", "fecha": "2026-09-28" }
}
```

> Os textos de `cita` precisam ser conferidos palavra por palavra com uma RVR1960 impressa antes de ir para `aprobado` (checklist, item 12). Os ícones `sparkles`, `alert`, `globe`, `star`, `users` e `heart` já existem em `components/icons.tsx`. Para os 66 livros serão necessários cerca de 12 ícones temáticos novos (árvore, arca/onda, torre, tenda, coroa, pergaminho, pomba, cordeiro, montanha, templo, estrada, trombeta), no mesmo traço.

### 4.5 Como é a tela (celular, 360–430 px)

Ordem vertical da tela `/leccion/mapas-mentales/genesis`:

1. **PageHeader** + `FontScaleControl` (já existem) + um seletor de modo pequeno: **Normal · Letra grande · Niños**.
2. **Nó central = uma "mini capa"**: um cartão escuro com o degradê `from/to` e o `glow` dourado do `CoverStyle`, o título em serifa (Literata) em dourado e a frase `centro.texto`. Abaixo dele, a ficha (reaproveita `Fact`) e o versículo-chave (reaproveita o `figure` em pergaminho do `LessonBody`).
3. **Árvore vertical (vista padrão)**:
   - Um "tronco" dourado de 2 px desce do nó central. Cada ramo é um cartão ligado a ele por um conector curto.
   - O cartão tem um **número grande** (1–6, ordem de leitura), um ícone, o título em serifa, o chip "Cap. 1–2" e o resumo. A borda esquerda leva a cor do ramo.
   - **Toque** → o cartão se expande (acordeão, `aria-expanded`) e mostra as folhas como subcartões, cada uma com o chip de referência e a `cita` em itálico no fundo `gold-soft`.
   - É semântico (`ol > li`): o leitor de tela lê 1 → 6, que é o contrário do PDF.
4. **"Ver mapa completo" (vista panorâmica)**:
   - Um SVG radial gerado dos mesmos dados (centro + 6 ramos em ângulos iguais, **só títulos e números**), em fundo pergaminho ou noturno.
   - Zoom com **botões grandes + / −** (idoso não faz pinça) e também com pinça. Tocar num ramo fecha a vista e abre esse ramo na árvore.
   - Em tablet ou desktop (≥ 768 px), a vista radial passa a ser a padrão, com as folhas visíveis.
5. **"Jesús en Génesis"**: cartão navy (`bg-primary`), igual à "Minitarea".
6. **"Para tu vida"**: lista numerada (reaproveita o estilo de `practica`).
7. **Botões de ligação**:
   - "Leer el resumen de Génesis" → `/leccion/cronologico/genesis`.
   - "Escuchar" → `cronologico-audio/genesis`. Se não for dono do áudio, aparece o cartão bloqueado do `LockedProduct` (é vitrine do upsell 1).
8. **Conexões** em chips ("Sigue en Éxodo →").
9. `CompletionCard` ("Marcar mapa como visto" +pts), `ReflectionBox` e `SharedReflections` (já existem).

**Ligação de volta:** o `LessonView` do `cronologico` mostra, logo depois do resumo, o cartão "Ver el mapa mental de Génesis" (busca por `lecciones[]`).

### 4.6 Modos
- **Letra grande / paso a paso** (automático quando `fontScale ≥ 1.2`, ou pelo seletor):
  - Um ramo por tela, já aberto, com botões grandes "Anterior / Siguiente rama" (≥ 56 px).
  - Esconde a vista radial e os chips secundários. Texto do corpo ≥ 22 px e contraste AA garantido pelos tokens.
- **Niños**:
  - Troca `resumen/texto` por `resumenNino/textoNino`, com ícones 1,5× maiores e referências em cinza discreto.
  - No fim, o jogo "¿Te acuerdas?" (3 perguntas, toque na resposta, confete com `animate-pop`).
  - Sem imagens assustadoras: só ícones de traço, nada de serpente realista.
- **Escuro**: automático pelos tokens `:root[data-theme='dark']`. As cores dos ramos precisam de uma variante clara e outra escura, as duas AA.
- **Áudio (P2)**: botão "Escuchar este mapa". Primeiro com `speechSynthesis` (es-419); depois, narração gravada pelo mesmo pipeline do áudio do Estudio.

### 4.7 Regras de redação (vão no prompt de todos os agentes)
- Texto 100% próprio. **Não abrir o PDF do concorrente na fase de escrita**, para não contaminar o texto.
- Espanhol neutro latino-americano e "tú". Frases curtas: uma ideia por frase.
- Tom de amor de Cristo. **Proibido**:
  - termos de disputa confessional (sola fide, pacto de obras, inerrância, "tradición" como algo negativo, Maria/santos em tom polêmico);
  - qualquer crítica a igreja ou instituição.
- Autor e data sempre "tradicionalmente atribuido" / "c.", **iguais aos da lição do Estudio**.
- Citação: no máximo 25 palavras e literal (RVR1960), ou RV1909 quando o texto for mais longo.
- Referência com o nome do livro por extenso ("Génesis 1:1", não "Gn 1:1"), para idosos e crianças.

### 4.8 Volume de produção

| Item | Quantidade |
|---|---|
| Mapas de livro | 66 |
| Mapas de panorama/tema | 6 (Mapa de la Biblia, Línea del tiempo, Géneros, Pactos, Historia de la salvación, Jesús en toda la Biblia) |
| **Total** | **72 mapas** (+7 deuterocanônicos se aprovados) |
| Palavras por mapa | cerca de 1.000 (adulto + criança + ficha + perguntas) → **cerca de 72 mil palavras** |
| Referências a verificar | cerca de 25 por mapa → **cerca de 1.800** |
| Citações literais a conferir | cerca de 7 por mapa → **cerca de 500** |
| Perguntas do modo criança | 216 |
| Ícones novos | cerca de 12 |

**Divisão entre agentes:**

| Fase | Agentes | Entrega |
|---|---|---|
| 0. Fundação | 1 agente "arquiteto" | Tipos TS, JSON Schema, validador, tabela de versículos por capítulo, carregador `loadMapa()`. **Gênesis aprovado pelo dono como padrão-ouro** |
| 1. Redação (em paralelo) | 8 agentes redatores, cerca de 9 mapas cada | (1) Pentateuco + Jó = 6 · (2) Josué → Ester = 12 · (3) Poéticos (4) + Panorama (6) = 10 · (4) Isaías, Jeremias, Lamentações, Ezequiel, Daniel + Jonas, Amós, Oséias = 8 · (5) os 9 profetas menores restantes · (6) 4 Evangelhos + Atos = 5 · (7) 13 cartas de Paulo · (8) Hebreus, Tiago, 1–2 Pedro, 1–3 João, Judas, Apocalipse = 9. Cada um recebe o padrão-ouro, as regras do §4.7, os ids do catálogo e as lições existentes do Estudio |
| 2. Revisão (cruzada) | 2 agentes revisores | (a) **Bíblico-factual**: roda o validador, confere cada referência e citação, coerência com a lição. (b) **Tom/ecumenismo/criança**: checklist confessional, legibilidade do texto infantil, vocabulário |
| 3. Front | 1 agente front + 1 agente QA | `MindMapView` (árvore + SVG radial + modos + jogo), integração no catálogo e no `LessonView`, cartão de volta na lição. QA em 360 px, `fontScale` 1.4, modo escuro, leitor de tela, Android de entrada |

Estimativa: fase 0 em meio dia · fase 1 em 1 dia (em paralelo) · fase 2 em 1 dia · fase 3 em 2 a 3 dias, que pode correr em paralelo com a 1 e a 2 usando o Gênesis como dado de teste.

### 4.9 Decisões pendentes do dono
1. **2 Reyes e Joel** (e o restante de 1 Reis/2 Crônicas): completar o Estudio ou ligar esses mapas a outra lição?
2. **Deuterocanônicos:** incluir 7 mapas numa seção "Libros de las Biblias católicas"? Se sim, as citações terão de vir de uma tradução de domínio público que os contenha, porque RVR1960 e RV1909 não os trazem.
3. O bloco de "doutrinas" do concorrente **não entra**: é o ponto de maior risco ecumênico e já é coberto pelas lições. Confirmar.
4. Mudar o `short` do produto de "Cada libro en una sola imagen" para algo verdadeiro com a nova forma, por exemplo "Cada libro en un mapa que se toca y se entiende".

---

## 5. Checklist de produção

1. [ ] Dono decide os itens do §4.9 (2 Reis/Joel, deuterocanônicos, sem doutrinas, novo `short`).
2. [ ] Criar os tipos `MapaMental` em `lib/content/mapas/types.ts` e o campo `mapa?: { id }` em `Lesson`.
3. [ ] Criar a tabela de livros → capítulos → versículos e o `scripts/validate-mapas.mjs` com todas as regras do §4.3, rodando no build.
4. [ ] Criar `loadMapa(id)` com import dinâmico (padrão de `loadPlanDay`).
5. [ ] Publicar `genesis.json` (§4.4), conferir as citações na RVR1960 impressa e obter a aprovação do dono → padrão-ouro.
6. [ ] Escrever o guia de redação (§4.7) + os limites de palavras num único prompt-base para os redatores.
7. [ ] Desenhar os cerca de 12 ícones temáticos novos no traço de `components/icons.tsx`.
8. [ ] Definir as 6 cores de ramo (claro/escuro), derivadas das paletas `WARM…DUSK`, e validar contraste AA.
9. [ ] Lançar os 8 redatores (§4.8), um JSON por mapa, com estado `borrador`.
10. [ ] Rodar o validador em todos os JSON. Zero erros é condição para ir à revisão.
11. [ ] Revisor factual: cada referência e cada ficha conferida contra a Bíblia e contra a lição do Estudio.
12. [ ] Revisor factual: cada `cita` conferida literalmente (RVR1960 ≤ 25 palavras, ou RV1909).
13. [ ] Revisor de tom: checklist ecumênico, sem ataque, sem polêmica confessional, e texto infantil com frases ≤ 15 palavras e sem termos técnicos.
14. [ ] Busca automática por restos de português (ê, ã, õ, ç, "você", "não", "em") em todos os textos.
15. [ ] Front: `MindMapView` com o nó central em estilo capa, a árvore vertical numerada e o acordeão acessível.
16. [ ] Front: vista panorâmica SVG gerada dos dados, com botões + / − e pinça.
17. [ ] Front: modos Letra grande (paso a paso) e Niños (textos infantis + jogo de 3 perguntas).
18. [ ] Front: "Jesús en este libro", "Para tu vida", conexões, botões para a lição e o áudio (com `LockedProduct` para quem não tem).
19. [ ] Front: reaproveitar `CompletionCard` ("Mapa visto"), `ReflectionBox` e `SharedReflections`.
20. [ ] Front: cartão "Ver el mapa mental" dentro das lições do `cronologico` (ligação de volta).
21. [ ] Catálogo: trocar o `pendingGuide()` de `mapas-mentales` pelas seções `como-usar`, `panorama`, `antiguo-testamento` e `nuevo-testamento` na ordem cronológica.
22. [ ] Tela "Cómo usar los mapas" (3 passos com ícones), exibida no primeiro acesso.
23. [ ] QA em 360 px e 430 px: nenhum texto de corpo abaixo de 17 px na escala 1, nenhuma rolagem horizontal, alvos de toque ≥ 48 px.
24. [ ] QA com `fontScale` 1.4, modo escuro, leitor de tela (ordem 1 → 6) e Android de entrada (sem travar ao expandir).
25. [ ] QA offline: os mapas abrem sem rede depois do primeiro acesso (cache PWA).
26. [ ] Teste com 2 idosos e 2 crianças reais: conseguem abrir um mapa, achar o ramo 3 e voltar para a lição sem ajuda?
27. [ ] (P2) "Guardar como imagen" (PNG gerado do SVG, com a marca do app) para compartilhar no WhatsApp.
28. [ ] (P2) Narração "Escuchar este mapa".
29. [ ] Marcar todos os JSON como `aprobado` e publicar.
