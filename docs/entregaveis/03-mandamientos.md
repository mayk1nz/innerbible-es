# Presente 3 — "10 Mandamientos Explicados"

Análise do molde do concorrente e especificação da nossa versão dentro do app **La Biblia Interior**.

- **Arquivo analisado:** `D:\1 youtube auto\Apps - Daniel asafh\entregaveis front\regalo 3 - 10 mandamentos.pdf`, lido por inteiro (13 páginas, texto extraído e páginas renderizadas).
- **Onde isso entra no app:** produto `mandamientos` em `lib/catalog.ts` (hoje são 10 lições vazias, geradas a partir de `COMMANDMENTS`). O leitor é o `components/views/LessonView.tsx`.
- **Regra de ouro:** o PDF serve só de referência de tema. **Nenhuma frase dele pode ser reaproveitada**, nem parafraseada de perto. Tudo o que está na seção 4 foi escrito do zero.

---

## 1. O que é

| Item | Descrição |
|---|---|
| Formato | PDF de 13 páginas em **900×1600 px (9:16)**. É um **carrossel de Instagram reaproveitado**: a página 1 diz literalmente *"A lo largo de este carrusel…"*. Metadados: montado com pdf-lib e Ghostscript em 27/11/2025. |
| Volume de texto | Cerca de **1.700 palavras** no total, umas 130 a 150 por mandamento. |
| Estrutura | p1 capa com título e parágrafo · p2 introdução · p3–p12 um mandamento por página · p13 conclusão. Não tem índice, número de página nem sumário. |
| Campos por mandamento | Os mesmos 4 em todas as páginas: (1) título "El X Mandamiento"; (2) versículo entre aspas com a referência de Êxodo 20; (3) **"Explicación Teológica"** em 1 parágrafo; (4) **"Significado y Aplicación"** com 2 bullets. O 2º bullet é sempre "Aplicación Cotidiana" e contém **só perguntas retóricas**. |
| Numeração | **Só a evangélica/reformada**: 2º = imagens (Ex 20:4-6) e 10º = "No codiciarás" num bloco único. A numeração católica não aparece nem é mencionada. |
| Fonte bíblica | Só Êxodo 20. As citações misturam traduções sem dizer qual é (ver 2.2). |
| Visual | Imagem de IA no topo, ocupando 13 a 17% da página, e embaixo um fundo off-white com textura. Títulos em serifa, cada página numa cor diferente (teal, laranja, carmim, azul, verde, roxo, rosa, dourado). O texto é pequeno e fica no terço inferior, deixando **~40% da página em branco** entre a imagem e o título. |

---

## 2. Falhas e brechas

### 2.1 Ecumenismo e numeração (mais grave para o nosso público)
1. **Ignora os católicos**, que são a maioria do público latino. Segue só a numeração reformada, então o "Quinto" do PDF é o 4º do catequista católico, o "Sexto" é o 5º, e assim por diante. Uma avó católica que aprendeu "el cuarto: honrarás a tu padre y a tu madre" vai achar que o material está errado.
2. **O 2º mandamento toma partido.** O texto diz que a verdadeira adoração *"prescinde de cualquier representación visible"* e que não se deve buscar formas físicas. Isso vai contra a prática católica e ortodoxa (imagens, crucifixo) e contra muitos evangélicos, que usam cruz, vitrais e ilustrações infantis. **É também exagero bíblico**: o próprio Deus mandou fazer querubins sobre a arca (Ex 25:18) e a serpente de bronze (Nm 21:8). O foco do texto é *"no te inclinarás a ellas, ni las honrarás"* (v. 5), ou seja, a **adoração**.
3. **A imagem da página 4** é uma fileira de estátuas douradas sendo golpeadas. Um católico pode ler isso como ataque às imagens de santos, o que fere a regra "nunca atacar instituições".
4. **O 10º foi cortado para só "No codiciarás."** Some justamente a lista (mulher do próximo, casa, servos…), que é o que explica por que a tradição católica divide esse versículo em 9º e 10º.
5. **O 4º não fala de domingo nem de sábado.** Fala em "descanso sabático" sem explicar que a maioria dos cristãos celebra o domingo (dia da ressurreição) nem que Jesus disse *"el día de reposo fue hecho por causa del hombre"* (Mc 2:27). Deixa o leitor confuso ou culpado.

### 2.2 Erros de texto bíblico
6. **Traduções misturadas sem aviso.** Ex 20:7 aparece como *"el nombre del Señor, tu Dios"*, mas a RVR1960 diz *"de Jehová tu Dios"*. Ex 20:15 aparece como *"No robarás"* (RVR1960: *"No hurtarás"*) e Ex 20:16 como *"No darás falso testimonio contra tu prójimo"* (RVR1960: *"No hablarás contra tu prójimo falso testimonio"*). Fica parecendo citação exata de uma Bíblia que não existe.
7. **A referência não bate com a citação.** "(Éxodo 20:4-6)" e "(Éxodo 20:8-11)" vêm acompanhados só do primeiro versículo.
8. **O 5º perdeu a promessa** (*"para que tus días se alarguen…"*), que é o ponto que Paulo destaca: *"el primer mandamiento con promesa"* (Ef 6:2).
9. **Falta o prólogo (Ex 20:2)**: *"Yo soy Jehová tu Dios, que te saqué de la tierra de Egipto"*. Sem ele os mandamentos viram lista de regras. Com ele, a graça vem antes da lei: Deus primeiro liberta e depois ensina a viver livre. A conclusão do PDF até afirma que os mandamentos não salvam, mas nunca mostra isso no texto.
10. **Não há nenhum paralelo com Deuteronômio 5.** Ficam de fora a segunda razão do descanso (Dt 5:15: "fuiste siervo en Egipto", o descanso também para servos e estrangeiros), a ordem invertida da cobiça (Dt 5:21 põe "la mujer de tu prójimo" antes e usa outro verbo para os bens) e o "como Jehová tu Dios te ha mandado".
11. **Sobreposição confusa:** o 8º ("No robarás") inclui "la mentira y el engaño", que é matéria do 9º.

### 2.3 Jesus ausente
12. **A palavra "Jesus" não aparece nenhuma vez.** "Cristo" aparece uma única vez, na última frase. Não há Mt 22:37-40 / Mc 12:29-31 (o grande mandamento), Rm 13:8-10 (o amor cumpre a lei), Mt 5:17-28 (Jesus aprofunda o "no matarás" e o "no adulterarás"), Mt 19:17-19 (o jovem rico) nem Jo 19:26-27 (Jesus cuidando da mãe na cruz).
13. **Não existe a ideia das duas tábuas** (amor a Deus / amor ao próximo), que é a chave pedagógica mais simples que há.
14. **Nada sobre graça quando falhamos** (1 Jo 1:9). Um material sobre mandamentos sem isso gera culpa, o oposto do tom "amor de Cristo".

### 2.4 Aplicação prática
15. **A "Aplicação Cotidiana" é só pergunta.** Em 10 páginas não há um único exemplo concreto do tipo "hoje, faça X". O leitor termina sem saber o que fazer.
16. **Não tem desafio, checklist, quiz, oração, versículo para memorizar nem versículos relacionados.**
17. **Nenhuma sensibilidade pastoral.** O 5º manda honrar "todas las figuras de autoridad" sem dizer que honrar não é aceitar abuso. O 7º não fala com solteiros, viúvos ou quem foi traído. O 6º toca em "ira y odio" sem acolher quem está sofrendo.

### 2.5 Linguagem (idosos e crianças)
18. **Vocabulário acadêmico:** "usufructuar", "intrínsecamente", "prescinde", "deferencia", "inmensurable", "permeadas", "trascendiendo", "instituidor". Tem frase com mais de 40 palavras.
19. **Fórmulas repetidas e vazias:** "Este mandamiento fundamental…" aparece 4 vezes, e "nos invita a una profunda reflexión" várias vezes.
20. **Palavras-chave sem explicação:** codiciar, adulterio, falso testimonio, en vano, santificar, prójimo. Uma criança não entende nenhuma delas.
21. **Nada para crianças**, embora o público inclua famílias.

### 2.6 Visual e acessibilidade
22. **Imagens de IA com texto falso em inglês** ("SACRED NAME", "WOVEN TRUST", tábuas com "THE COMMANDMENTS" ilegível) e hebraico inventado na conclusão. Um produto em espanhol com texto falso em inglês passa amadorismo.
23. **Um arco-íris de cores**, uma por página, sem identidade. O subtítulo da conclusão está em lilás claro sobre off-white, com contraste insuficiente.
24. **Texto pequeno numa página enorme.** No celular, precisa dar zoom, o que é ruim para idosos.
25. **Camada de texto quebrada:** travessões viraram "4" e "3" ("dioses" 4 como el dinero… éxito4), o que atrapalha copiar e colar e leitores de tela.
26. **Sem índice, sem navegação, sem progresso.** É um PDF estático.

---

## 3. O que deveria estar lá e não está (priorizado)

**P0 — sem isso não publica**
1. **Numeração dupla, católica e evangélica, em toda lição**, com uma explicação curta e respeitosa de por que existem as duas. O texto bíblico é o mesmo, só muda a divisão.
2. **Texto bíblico completo e correto** de cada mandamento, com a tradução identificada.
3. **Jesus em cada lição:** como Ele viveu ou ensinou aquele mandamento. Mais uma **síntese final "El gran mandamiento"** (Mt 22:37-40).
4. **Prólogo da graça (Ex 20:2)** na introdução: Deus liberta primeiro, depois orienta.
5. **Linguagem simples:** frases curtas, "tú", nenhuma palavra difícil sem explicação.
6. **Aplicação concreta:** exemplos reais de casa, trabalho, WhatsApp, família e vizinhança, separados por fase da vida (criança, jovem, adulto, idoso).
7. **Tratamento neutro do tema "imagens" (lição 2) e do dia do Senhor (lição 4)**, sem tomar partido.
8. **Caixa pastoral "Si esto te toca de cerca"** nas lições sensíveis (5 pais difíceis, 6 raiva/autolesão, 7 infidelidade), sempre com graça e um encaminhamento seguro.

**P1 — o que faz a nossa versão ser claramente melhor**

9. Seção **para crianças** em cada lição, com explicação e uma atividade.
10. **Reto de la semana** com checklist de 7 dias.
11. **Quiz** de 3 perguntas por lição e um quiz final de 10.
12. **Comparação Êxodo 20 × Deuteronômio 5** onde houver diferença relevante (lições 4, 5 e 10, e na introdução).
13. **Versículos relacionados** (4 a 6 por lição, com referência e frase curta).
14. **Glossário simples** ("¿Qué quiere decir…?") dentro da lição.
15. **Oração curta** e **"Para meditar"** no fim de cada lição.
16. **Graça quando falhamos:** um fechamento com 1 Jo 1:9 na síntese final.

**P2 — diferenciais**

17. **Memorização:** "Los 10 en tus manos", uma frase curta por dedo, mão esquerda = amor a Deus e mão direita = amor ao próximo. A distribuição 4+6 / 3+7 varia por tradição, então o jogo diz isso.
18. **Áudio** de cada lição (o app já suporta o formato `audio`), pensado para idosos.
19. **Cartão para compartilhar ou imprimir** com os 10 mandamentos em forma curta nas duas numerações.
20. **Modo família:** roteiro de 10 minutos para ler com filhos ou netos.
21. **Preferência de numeração** (Ambas / Católica / Evangélica) salva no perfil.

---

## 4. Nossa versão no app (especificação)

### 4.1 Estrutura (3 seções, 14 lições)

A regra que resolve a numeração: **as 10 lições seguem a ordem do texto bíblico (Ex 20:3-17) e têm títulos temáticos, não números.** Cada lição mostra um **selo duplo** com o número em cada tradição. Assim ninguém se sente corrigido.

| # no app | Lição (título temático) | Texto | Evangélica / ortodoxa | Católica / luterana (fórmula catequética) |
|---|---|---|---|---|
| — | **Seção "Antes de empezar"** | | | |
| I1 | Comienza aquí: un Dios que primero libera | Ex 19–20:2; Ex 34:28; Dt 5 | — | — |
| I2 | ¿Por qué hay dos maneras de contarlos? | Ex 20 / Dt 5 | tabela completa | tabela completa |
| — | **Seção "Los Diez Mandamientos"** | | | |
| 1 | Solo Dios en el primer lugar | Ex 20:3 | 1.º | 1.º (Amarás a Dios sobre todas las cosas) |
| 2 | Adorar solo a Dios | Ex 20:4-6 | 2.º | Parte del 1.º |
| 3 | El nombre de Dios es santo | Ex 20:7 | 3.º | 2.º |
| 4 | Un día para Dios y para descansar | Ex 20:8-11; Dt 5:12-15 | 4.º | 3.º (Santificarás las fiestas) |
| 5 | Honra a tu padre y a tu madre | Ex 20:12; Dt 5:16 | 5.º | 4.º |
| 6 | Cuidar la vida | Ex 20:13 | 6.º | 5.º |
| 7 | Fidelidad y pureza | Ex 20:14 | 7.º | 6.º (No cometerás actos impuros) |
| 8 | Lo que es de otro, es de otro | Ex 20:15 | 8.º | 7.º (No robarás) |
| 9 | Hablar con la verdad | Ex 20:16 | 9.º | 8.º (No dirás falso testimonio ni mentirás) |
| 10 | Un corazón contento | Ex 20:17; Dt 5:21 | 10.º | 9.º (deseos impuros) y 10.º (bienes ajenos), em **duas subseções** dentro da lição |
| — | **Seção "El gran mandamiento"** | | | |
| S1 | Amar a Dios y amar al prójimo | Mt 22:36-40; Mc 12:29-31; Rm 13:8-10; Jer 31:33; 1 Jo 5:3; 1 Jo 1:9 | — | — |
| S2 | Repaso final (quiz de 10 + "Los 10 en tus manos") | — | — | — |

**Texto da lição I2 (resumo do que ela precisa dizer):**
- O texto de Deus é o mesmo para todos. A Bíblia fala em "diez palabras" (Ex 34:28), mas não numera.
- Os cristãos agruparam os versículos de formas diferentes. Católicos e luteranos seguem Santo Agostinho: juntam "dioses ajenos" e "imagen" e separam a cobiça em dois, como Dt 5:21 sugere. Evangélicos e ortodoxos separam "imagen" e juntam a cobiça. O judaísmo conta "Yo soy Jehová tu Dios" como a primeira palavra.
- **"Ninguna manera quita ni agrega nada a lo que Dios dijo."**
- Termina com uma tabela lado a lado, sem juízo de valor.

**Lição 2 (imagens), linha editorial:** o foco é *"no te inclinarás a ellas"*: nada criado ocupa o lugar de Deus, e Deus não cabe num objeto. O exemplo bíblico é o bezerro de ouro (Ex 32). O "hoje" são os ídolos do coração: dinheiro, celular, aprovação, fama. Uma única frase respeitosa: *"Los cristianos de distintas tradiciones viven de maneras diferentes el uso de imágenes y símbolos en la fe; todos coinciden en que la adoración pertenece solo a Dios."* **Proibido:** imagem de estátuas quebradas, qualquer menção a santos como idolatria ou crítica a práticas de qualquer igreja.

**Lição 4, linha editorial:** as duas razões do descanso (criação em Ex 20:11, libertação em Dt 5:15), Mc 2:27 e o domingo como dia da ressurreição para a maioria dos cristãos (Hch 20:7; Ap 1:10, "el día del Señor"). O foco prático é separar tempo para Deus, para a família e para o descanso, e deixar outros descansarem (quem trabalha para nós).

### 4.2 Campos de cada lição

Proposta de extensão de `LessonContent`, só para referência (não alterei nenhum código). Os campos existentes são reaproveitados quando possível: `versiculo`, `resumen`, `tarea`, `practica`, `meditar`.

```ts
interface MandamientoContent extends LessonContent {
  numeracion: { evangelica: string; catolica: string }          // selo duplo no topo
  texto: { exodo: Cita; deuteronomio?: Cita; diferencia?: string } // RV1909 (ou RVR1960 curto); diferencia = 1 frase quando Dt 5 muda algo
  simple: string                  // "Qué significa en palabras simples" (≤ 60 palavras, frases ≤ 15 palavras)
  glosario?: { palabra: string; significado: string }[]
  contexto: string[]              // 2 parágrafos: Sinaí/Israel + por que isso importava
  jesus: string[]                 // "Cómo Jesús lo vivió y lo enseñó" (2–3 parágrafos, com referências)
  diaADia: { quien: 'niños' | 'jóvenes' | 'adultos' | 'mayores' | 'todos'; texto: string }[] // exemplos concretos
  cuidado?: string                // caixa pastoral "Si esto te toca de cerca"
  reto: { titulo: string; dias: string[] }   // 7 itens → checklist semanal
  relacionados: Cita[]            // 4–6
  ninos: { explicacion: string; actividad: { titulo: string; pasos: string[] } }
  oracion: string
  // meditar (existente)
  quiz: { pregunta: string; opciones: string[]; correcta: number; porque: string }[] // 3
}
type Cita = { texto: string; referencia: string; version: 'RV1909' | 'RVR1960' }
```

**Ordem de exibição no leitor:** selo duplo → texto bíblico (bloco dourado já existente) → "En palabras simples" → glossário (chips tocáveis) → contexto → Jesús → "En tu día a día" (abas ou cartões por fase da vida) → caixa pastoral → reto (checklist) → relacionados (recolhível) → **Para los niños** (cartão de cor própria, ícone) → oração → para meditar → quiz → "Marcar como leída" (fluxo atual).

### 4.3 Elementos interativos
- **Checklist semanal:** 7 caixinhas por lição, salvas por lição. Enquanto não houver backend, usar `localStorage` com guarda de `typeof window`. Ao completar as 7, aparece um selo "Reto cumplido".
- **Quiz:** 3 perguntas de múltipla escolha por lição, com feedback imediato e gentil ("¡Muy bien!" / "Casi. Mira: …"), sem nota punitiva. Na S2, 10 perguntas e um certificado simples para compartilhar.
- **Glossário tocável:** palavra sublinhada que abre um balão com a definição.
- **"Los 10 en tus manos"** (S2): ilustração de duas mãos, cada dedo com a forma curta. Tocar um dedo abre a lição.
- **Acessibilidade:** usar o `scale` de fonte já existente no `LessonView`, alvos de toque ≥ 44 px, contraste AA, botão "Escuchar" quando o áudio existir.
- **Visual:** manter a identidade do app (capa `OLIVE`, ícone `star`, tokens `gold`, `surface`, `ink`, fonte serifada no corpo). **Nada de imagens de IA com texto.** Se houver ilustração, só ícones ou ilustrações sem letras, e nenhuma imagem de estátua ou imagem religiosa sendo destruída.

### 4.4 Lição completa de exemplo (Lição 5), escrita do zero

> Textos bíblicos: Êxodo 20:12 em **RV1909** (domínio público). Esta versão está com a ortografia modernizada "a" (a 1909 original grafa "á"); **conferir palavra por palavra contra um arquivo RV1909 antes de publicar**. Os demais versículos são **RVR1960**, conferidos na bolls.life (mesma fonte do `content-src/planes/verify-verses.mjs`).

---

**Honra a tu padre y a tu madre**

`5.º mandamiento en la tradición evangélica · 4.º en la tradición católica`

**La Palabra**
> «Honra a tu padre y a tu madre, porque tus días se alarguen en la tierra que Jehová tu Dios te da.»
> — Éxodo 20:12 (Reina-Valera 1909)

> Cuando Moisés lo repite, cuarenta años después, agrega: «como Jehová tu Dios te ha mandado… y para que te vaya bien» (Deuteronomio 5:16, RVR1960).

**Qué significa en palabras simples**
Dios te pide tratar a tu papá y a tu mamá como personas valiosas. Honrar es escucharlos, agradecerles, respetarlos y cuidarlos, sobre todo cuando se hacen mayores. Y Dios une este mandamiento a una promesa: donde hay honra, la vida va mejor.

**¿Qué quiere decir…?**
- *Honrar:* dar a alguien el valor que tiene. La palabra hebrea tiene la idea de "dar peso", tomar en serio.
- *Que tus días se alarguen:* que tu vida sea larga y buena.

**Un poco de contexto**
Con este mandamiento, la lista cambia de dirección. Los primeros hablan de cómo amar a Dios; desde aquí, de cómo amar a las personas. Y la primera persona que Dios pone delante de nosotros no es un rey ni un sacerdote: es la familia. En casa aprendemos a amar, y también ahí se nota primero cuando no amamos.

En el Israel antiguo no había jubilación ni asilos. Cuando un padre o una madre envejecía, dependía de sus hijos para comer, tener techo y compañía. Por eso "honrar" nunca fue solo una palabra bonita: incluía cuidar de verdad. Siglos después, el apóstol Pablo recordó que este es «el primer mandamiento con promesa» (Efesios 6:2).

**Cómo Jesús lo vivió y lo enseñó**
Jesús, el Hijo de Dios, creció en una casa sencilla de Nazaret. Lucas cuenta que, siendo niño, volvió con José y María «y estaba sujeto a ellos» (Lucas 2:51). El Señor del cielo aprendió a obedecer en una carpintería.

Un día le mostraron que algunas personas decían: "Este dinero ya se lo ofrecí a Dios", y así dejaban de ayudar a sus padres. Jesús respondió citando este mandamiento (Marcos 7:10-12). Para Él, ninguna excusa, ni siquiera una que suena muy espiritual, reemplaza el cuidado de los padres.

Y en la cruz, con dolor y casi sin aire, Jesús pensó en su madre. Miró a Juan y le dijo: «He ahí tu madre. Y desde aquella hora el discípulo la recibió en su casa» (Juan 19:27). Hasta el último momento, Jesús honró a María.

**En tu día a día**
- **Si eres niño o niña:** obedece a la primera, sin rezongar. Di "gracias" por la comida. Cuando te corrijan, respira y responde con respeto.
- **Si eres joven:** cuéntales algo de tu día aunque no te pregunten. Si no estás de acuerdo con ellos, dilo con calma y sin burlas. No hables mal de tus padres en las redes ni en los chats.
- **Si tus padres ya son mayores:** llama por teléfono, y no solo en su cumpleaños. Acompáñalos al médico. Ten paciencia cuando repitan la misma historia: escúchala otra vez como si fuera la primera. Pregúntales qué necesitan, en vez de decidir por ellos.
- **Si tus padres ya partieron:** también puedes honrarlos. Da gracias a Dios por lo bueno que te dejaron, cuenta sus historias a tus hijos y nietos, y vive los valores buenos que te enseñaron.
- **Si tú eres papá, mamá, abuelo o abuela:** la Biblia también te habla a ti: «Padres, no exasperéis a vuestros hijos, para que no se desalienten» (Colosenses 3:21). La honra se aprende viéndola: trata a tus propios padres, o a su memoria, como te gustaría que te traten.
- **Para todos:** honra también a quienes te cuidaron como padres: abuelos, tíos, padrinos, padres adoptivos, maestros.

**Si esto te toca de cerca**
Quizás tu historia con tu papá o tu mamá tiene heridas: abandono, gritos, golpes. Honrar **no** significa aprobar el mal ni aceptar que te sigan lastimando. Puedes poner límites sanos y buscar ayuda. A veces honrar es simplemente no hablar con odio, orar por ellos y dejar que Dios, con el tiempo, sane lo que tú no puedes. Si hoy estás en peligro, habla con alguien de confianza o pide ayuda a las autoridades de tu país. Dios es «padre de huérfanos» (Salmos 68:5) y te ve.

**Reto de la semana** (marca cada día)
1. Da gracias en voz alta a tu papá o a tu mamá (o a quien te crio) por algo concreto.
2. Llama o visita a uno de ellos, o escríbele un mensaje de voz.
3. Haz una tarea de la casa sin que te lo pidan.
4. Escucha una historia de su vida y hazle una pregunta sobre ella.
5. Ora por tus padres por su nombre. Si ya partieron, da gracias por ellos.
6. Pide perdón por una palabra o actitud que no fue respetuosa.
7. Escribe una nota o dibujo que diga "Te honro porque…" y entrégala o guárdala en tu Biblia.

**Versículos para seguir leyendo**
- «Hijos, obedeced en el Señor a vuestros padres, porque esto es justo.» — Efesios 6:1
- «Oye a tu padre, a aquel que te engendró; y cuando tu madre envejeciere, no la menosprecies.» — Proverbios 23:22
- «Y descendió con ellos, y volvió a Nazaret, y estaba sujeto a ellos.» — Lucas 2:51
- «Aprendan éstos primero a ser piadosos para con su propia familia, y a recompensar a sus padres.» — 1 Timoteo 5:4
- «Honra a tu padre y a tu madre; y, Amarás a tu prójimo como a ti mismo.» — Mateo 19:19
- «Y vosotros, padres, no provoquéis a ira a vuestros hijos.» — Efesios 6:4

**Para los niños**
*Explicación:* ¿Sabías que Jesús también fue niño? Vivía con su mamá María y con José, y los obedecía. Dios te regaló una familia para cuidarte. Honrar a tus papás es decirles "te quiero" con tus acciones: obedecer, ayudar y dar gracias. ¡Y Dios promete que eso te hace bien! (Si alguien en casa te hace daño, cuéntaselo a un adulto de confianza. Eso no es desobedecer.)

*Actividad: "El frasco de los gracias"*
1. Busca un frasco o una cajita y decórala.
2. Cada día de esta semana, escribe o dibuja en un papelito algo que tu papá, tu mamá o quien te cuida hizo por ti.
3. El domingo, entrégales el frasco y lean juntos los papelitos.
4. Terminen con una oración: "Gracias, Dios, por mi familia".

**Oración**
Señor Jesús, Tú honraste a María y a José en lo pequeño de cada día. Enséñame a honrar a mis padres con palabras suaves y manos que ayudan. Sana lo que está herido en mi familia y bendice a los que me dieron la vida y a los que me cuidaron. Amén.

**Para meditar**
¿Qué es una cosa buena que recibiste de tus padres, o de quien te crio, y que nunca les agradeciste?

**Pequeño quiz**
1. ¿Qué promesa acompaña este mandamiento?
   a) Que tendrás mucho dinero · **b) Que tus días se alarguen y te vaya bien** · c) Que nunca tendrás problemas
   *Por qué:* Éxodo 20:12 y Deuteronomio 5:16 prometen una vida larga y buena.
2. ¿A quién le encargó Jesús cuidar de su madre desde la cruz?
   a) A Pedro · **b) A Juan** · c) A José
   *Por qué:* «He ahí tu madre… el discípulo la recibió en su casa» (Juan 19:27).
3. Honrar a los padres significa…
   a) Aceptar que te sigan lastimando · **b) Respetarlos, agradecerles y cuidarlos** · c) Estar de acuerdo con todo lo que digan
   *Por qué:* Honrar es dar valor. No significa aprobar el mal.

---

### 4.5 Estimativa de volume

| Bloco | Palavras por lição | Lições | Total |
|---|---|---|---|
| Introdução (I1, I2 com tabela) | ~550 | 2 | ~1.100 |
| Lição completa (a de exemplo tem ~1.150) | 1.000 a 1.250 | 10 | ~11.000 a 12.500 (a lição 10 é maior por ter 2 subseções) |
| Síntese "El gran mandamiento" | ~900 | 1 | ~900 |
| Repaso final (quiz 10 + mãos) | ~500 | 1 | ~500 |
| **Total** | | **14** | **~13.500 a 15.000 palavras** (8 a 9 vezes o PDF) |

Além disso: 33 perguntas de quiz, 70 itens de reto, ~55 versículos relacionados, 10 atividades infantis e ~30 verbetes de glossário. A leitura leva de 6 a 8 minutos por lição, e o reto semanal dá um percurso de ~10 semanas se usado assim.

---

## 5. Checklist de produção

1. Fechar a decisão editorial: **ordem do texto + títulos temáticos + selo duplo** (tabela 4.1) e o texto da lição I2.
2. Conseguir um **arquivo-fonte confiável da RV1909** (domínio público) e extrair Ex 20:2-17 e Dt 5:6-21. A RVR1960 já é verificável via bolls.life.
3. Escrever o **guia de estilo** do presente: "tú", frases de no máximo 20 palavras (15 em "palabras simples"), glossário obrigatório para termos difíceis, lista de palavras proibidas (usufructuar, intrínseco, prescindir, deferencia…), e nenhuma frase sobre práticas de outras igrejas.
4. Escrever I1 e I2 (prólogo da graça, Sinai, tábuas, Dt 5, as duas numerações).
5. Escrever as lições 1 a 10 seguindo o modelo da 4.4, com atenção redobrada à 2 (imagens), 4 (dia do Senhor), 7 (versão infantil adequada à idade) e 10 (duas subseções).
6. Escrever S1 "El gran mandamiento" (Mt 22:37-40, Rm 13:8-10, Jer 31:33, 1 Jo 5:3) com fechamento de graça (1 Jo 1:9) e S2 (quiz final + "Los 10 en tus manos").
7. Rodar a **verificação automática dos versículos** (adaptar `content-src/planes/verify-verses.mjs` para os campos `texto`, `relacionados` e `quiz`) e corrigir as divergências.
8. **Revisão teológica dupla:** um leitor católico e um evangélico conferem cada lição. Critério: "¿alguien de tu iglesia se sentiría atacado o corregido?".
9. **Teste de legibilidade:** ler 2 lições com uma pessoa de 70+ e uma criança de 8 a 10 anos, anotar onde travam e simplificar.
10. **Revisão anti-plágio:** comparar com o PDF do concorrente e garantir que nenhuma frase ou estrutura de frase foi reaproveitada.
11. Definir o tipo `MandamientoContent` e criar `lib/content/mandamientos.ts`, com carregamento sob demanda como os planos (`loadPlanDay`).
12. Atualizar `lib/catalog.ts` no produto `mandamientos`: 3 seções (Antes de empezar / Los Diez / El gran mandamiento) e novos títulos (os ids mudam via `slugify`; tudo bem, porque ainda não há progresso salvo nessas lições).
13. Estender o `LessonView`: selo duplo, glossário tocável, cartões "En tu día a día" por fase da vida, caixa pastoral, cartão infantil e oração, respeitando o `scale` de fonte.
14. Implementar o **checklist semanal** (7 itens, persistido por lição, selo ao completar).
15. Implementar o **quiz** (3 por lição + 10 finais, feedback gentil, certificado compartilhável).
16. Implementar **"Los 10 en tus manos"** com ilustração própria, sem texto dentro da imagem.
17. Revisar o visual: capa `OLIVE` e ícone `star`, contraste AA, alvos de 44 px, nenhuma imagem com texto gerado por IA e nenhuma imagem de estátua ou imagem religiosa destruída.
18. (P2) Gravar ou gerar o **áudio** de cada lição e criar o **cartão imprimível** dos 10 mandamentos nas duas numerações.
19. QA no celular (Android básico + iPhone): fonte grande, rolagem, checklist e quiz persistindo, modo offline/PWA.
20. Leitura final completa por uma pessoa que não participou da produção e aprovação para publicar.
