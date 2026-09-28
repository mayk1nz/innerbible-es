# Pesquisa: Biblia Thompson → "Estudio Cronológico" (La Biblia Interior)

*Pesquisa feita em 28/09/2026. Links verificados por fetch/HEAD na mesma data.*

## 1. Como funciona a Thompson Chain-Reference

**Origem.** Criada por Frank Charles Thompson (a partir de 1890), 1ª edição em 1908. Kirkbride Bible Co. publicou a obra por décadas. Em 03/12/2020 a HarperCollins Christian Publishing comprou os ativos, e hoje ela sai pela Zondervan (KJV/NKJV/ESV). Em espanhol é a **"Biblia de referencia Thompson – con versículos en cadena temática"** (RVR1960), edição em espanhol de 1987 (Kirkbride), distribuída pela **Editorial Vida**.

**Números (inglês e espanhol):** ~**100.000** referências na margem, **8.000 temas** no índice alfabético e **~4.000–4.200 cadeias numeradas** no índice numérico. O texto em espanhol diz: "concatena 100.000 versículos… formando más de 4.000 cadenas temáticas… más de 8.000 temas".

**Mecânica da cadeia:**
- Ao lado de cada versículo, a margem traz: **número-piloto** (o número do tema) + nome do tema + **próxima referência** (o "elo seguinte").
- O primeiro elo de cada cadeia aparece no início dela. Seguindo "próximo, próximo…" você percorre a Bíblia em **ordem canônica** até o último elo.
- Atalho: procurar o número-piloto no **Índice Numérico / "Condensed Cyclopedia of Topics and Texts"** (chamado de "Text Cyclopedia" nas edições antigas), no fim do volume. Lá cada cadeia vem completa: algumas com os versículos impressos, outras só com as referências, além de cadeias que não aparecem na margem e de "temas relacionados".
- Tem também: análise e esboço de cada livro (*Outline Studies*), estudos de personagens (Noé, Davi, Salomão…), **Harmonia dos Evangelhos**, **Suplemento Arqueológico**, calendário hebraico, mapas, concordância e "Bible Readings" (leituras temáticas).

**Exemplos concretos citados em fontes públicas** (servem só de ilustração, **não** entram no app):
1. **Sl 23:1**: a margem traz "*3266 God's Sheep, 74:1*". O piloto 3266 leva à cadeia completa, e o próximo elo é Sl 74:1.
2. **Cadeia 3264 "Christ as Shepherd"** (partindo da margem de 1Pe 5:4): Sl 23:1-2 → Sl 80:1 → Ct 1:7 → Is 40:11 → Jr 31:10 → Ez 34:11,23,24 → Zc 13:7 → Jo 10:2,11,14; 17:12 → Hb 13:20 → 1Pe 2:25; 5:4 → Ap 7:17.
3. **"Lamb of God / Cordero de Dios"**: Is 53:7 → Jo 1:29 → 1Co 5:7 → 1Pe 1:19 → Ap 5:6; 7:9; 12:11; 13:8; 14:1; 17:14; 19:9; 21:22. Também a cadeia 124 "Amalek", com 7 passagens (exemplo da Wikipedia).

**Por que o leitor acha difícil:**
- É um "software manual": a pessoa vai e volta entre a margem, o índice e o fim do livro. Num fórum, um leitor escreveu "*I have one. I don't get it*".
- A busca é por **número**, não pela dúvida do leitor. É preciso adivinhar o nome que Thompson deu ao tema.
- A ordem é canônica, não cronológica, e não há explicação de *por que* um elo liga ao outro.
- A letra é minúscula, as cadeias são longas e alguns temas faltam (um revisor comenta que não há quase nada sobre Milênio/Arrebatamento).

## 2. Direitos autorais e dados legais

**Thompson é protegido.** O texto, a seleção e numeração das cadeias, os esboços e os estudos são obra/compilação com copyright (Kirkbride → HarperCollins; a edição em espanhol é da Vida/HarperCollins). **Não copiar cadeias, números, nomes de temas nem textos.** Na busca apareceram PDFs piratas (pdfcoffee, dokumen.pub), e **não devem ser usados nem linkados**. O exemplar no archive.org é só para empréstimo.

**Fontes reutilizáveis (verificadas):**

| Dado | Fonte / URL | Licença | Tamanho / formato |
|---|---|---|---|
| **Referências cruzadas** (base TSK + votos da comunidade) | OpenBible.info – https://a.openbible.info/data/cross-references.zip | **CC-BY** (atribuir openbible.info) | ZIP de 1,9 MB → `cross_references.txt` de 8,3 MB, TSV `From Verse / To Verse / Votes`, **344.799 linhas**, IDs OSIS (`Gen.22.8`). Versão de 21/09/2026 |
| TSK original | CrossWire, módulo `TSK` (v1.4) | **Domínio público** | 2,7 MB (SWORD), ~500 mil refs |
| Mesmas refs já em SQL/JSON | github.com/scrollmapper/bible_databases | MIT (repo) + CC-BY (dados OpenBible) | MySQL/SQLite/CSV/JSON |
| **Nave's Topical Bible** | CrossWire, módulo `Nave` (v3.0) | **Domínio público** | 20.000+ temas/subtemas, ~100 mil refs |
| **Torrey's New Topical Textbook** | CrossWire, módulo `Torrey`; CCEL (ccel.org/ccel/torrey/ttt) | **Domínio público** | 628 temas, 20.000+ refs |
| Nave + Torrey + TSK em JSON pronto | HF `OpenChristianDataOrg/open-christian-data` (config `topical_reference`); GitHub eve-coda/open-christian-data | **Dataset CC0** (o código é CC BY-NC, então usar só os dados) | JSONL, 5.945 temas (índice unificado de 5.745) |
| **Cronologia** | Theographic – github.com/robertrouse/theographic-bible-metadata | **CC BY-SA 4.0** | `verses.json` 37 MB com **`yearNum` por versículo** (ex.: Gn 22:8 = −1872). `events.json` 1,7 MB com **450 eventos** (`startDate`, `sortKey`, versículos). Também `people.json` 5 MB, `places.json` 2,4 MB e `easton.json` |
| **RV1909** (espanhol, completo) | CrossWire `SpaRV` (PD); eBible `spaRV1909` (USFM/USFX/SWORD, PD); JSON: https://raw.githubusercontent.com/scrollmapper/bible_databases/master/formats/json/SpaRV.json | **Domínio público** | JSON de 8,2 MB |

**Observações importantes:**
- **Share-alike do Theographic.** Só entra a data (yearNum/sortKey). Guardar isso numa tabela separada e dar crédito "Theographic, CC BY-SA 4.0". Qualquer *dataset derivado* que for publicado herda o BY-SA. O código do app não é afetado.
- **getbible.net marca "valera (1909)" como "Copyrighted; permission granted to CrossWire".** CrossWire e eBible dizem "Public Domain" (publicado em 1909). Usar eBible/CrossWire como fonte e citá-los.
- **Índice temático em espanhol de domínio público: não encontrei nenhum** utilizável. A solução é traduzir os nomes de tema de Nave/Torrey para espanhol (tradução nossa, com IA + revisão) e acrescentar sinônimos ("fe", "creer", "confianza").
- **RVR1960** é © Sociedades Bíblicas en América Latina 1960, renovado em 1988 pela SBU, e a marca é registrada. Regra pública da Sociedad Bíblica Chilena para uso **não comercial** sem permissão: até **500 versículos**, no máximo 50% de um livro e no máximo 25% da obra, com "(RVR 1960)" + nota de copyright. **Uso comercial exige permissão escrita.** Como o app é pago, há dois caminhos: (a) texto completo em **RV1909** e RVR1960 só em citações curtas (1–2 versículos por card, com o aviso); ou (b) pedir licença à SBU/Sociedad Bíblica local antes de exibir capítulos em RVR1960.
- Planos cronológicos de leitura no GitHub (ex.: khornberg/readingplans) **não têm licença** e derivam de planos de editoras. Evitar e usar o `yearNum` do Theographic.

## 3. Desenho recomendado para o app

### Modelo de dados (Supabase/Postgres)
```
verses(osis PK, book, ch, v, text_rv1909, year_num, canon_idx)
xrefs(from_osis, to_start, to_end, votes)                  -- OpenBible, filtrar votes >= 3
topics(id, slug, name_es, name_en, source[nave|torrey], aliases_es text[])
topic_refs(topic_id, osis_start, osis_end, subtopic_es)
events(id, title_es, start_year, sort_key)                  -- Theographic (tabela separada, BY-SA)
event_verses(event_id, osis)
people(id, name_es, aliases_es[])  person_verses(person_id, osis)
chains(id, seed_type[passage|topic|person], seed_key, lang, version, created_at)
chain_links(chain_id, pos, osis_start, osis_end, sort_year, canon_idx,
            era_es, title_es, study_es, link_reason_es, question_es, status)
```
A relação é passagem ↔ tema (topic_refs), passagem ↔ passagem (xrefs), passagem ↔ tempo (year_num/events) e cadeia = lista ordenada de passagens.

### Como a busca vira cadeia
1. **Entender o texto digitado.** Primeiro, um parser de referência espanhola ("Génesis 22", "Gn 22:8", "1 Jn", "Apoc."). Se não for referência, busca fuzzy (`unaccent` + `pg_trgm`) em `topics.aliases_es` e `people`: "fe" → Faith, "cordero de Dios" → Lamb of God, "Abraham" → pessoa. Se nada casar, fallback de embeddings ou pedir à IA que mapeie para 1–3 temas existentes.
2. **Juntar candidatos.**
   - *Passagem* (Gn 22): todos os xrefs dos versículos do capítulo com votos ≥ 3, agrupados em faixas vizinhas, mais os temas Nave que contêm esses versículos. Score = soma dos votos + bônus de tema compartilhado.
   - *Tema* ("fe"): refs Nave+Torrey do tema, ranqueadas pela "centralidade" (quantos votos de xref recebem).
   - *Pessoa*: `person_verses` + eventos.
3. **Cortar em 12–20 elos**, sem repetir o mesmo capítulo e garantindo AT + NT.
4. **Ordenar cronologicamente** por `year_num` (Theographic). O fallback é a ordem canônica, e salmos/profetas usam a data do evento ou do autor. Um seletor "Cronológico | Canónico" deixa o usuário trocar. As eras vêm do ano: Patriarcas, Éxodo, Jueces, Reino, Exilio, Jesús, Iglesia.

Prova com dados reais: em Gn 22:8 o OpenBible já liga **Jo 1:36 (15 votos), Jo 1:29 (13), Ap 5:12 (9), Ap 13:8 (6), 1Pe 1:19-20 (3)**. É a cadeia "Cordero", construída legalmente sem Thompson.

### IA (DeepSeek) escrevendo o estudo
- **Entrada:** a lista *fechada* de elos já ordenada, com o texto RV1909 de cada um + o tema. **Saída em JSON** por elo: `title_es` (≤ 8 palavras), `study_es` (2–3 frases), `link_reason_es` (como este elo continua o anterior) e `question_es` (reflexão). Mais um `intro_es` da cadeia.
- **Travas:**
  - Validar por schema.
  - Rejeitar qualquer referência que não esteja na lista (anti-alucinação).
  - Temperature baixa.
  - Não reproduzir texto RVR1960 além de 1 versículo.
  - Tom "amor de Cristo", ecumênico para protestantes e católicos: sem atacar instituições nem denominações.
  - Prompt proíbe mencionar ou imitar Thompson.
- **Custo e velocidade:** pré-gerar e guardar em cache (`chains`) os 1.189 capítulos + ~300 temas/pessoas mais buscados. Buscas novas geram sob demanda (1 chamada, ~15 elos) e ficam salvas. Versionar (`version`) para regenerar quando o prompt mudar.

### Tela no celular
1. **Buscar:** um único campo "¿Qué estás estudiando?" com chips de exemplo (Génesis 22 · la fe · Abraham · el Cordero de Dios).
2. **Cadeia:** timeline vertical com faixas de era. Cada card mostra referência + título + 1 linha, com o contador "Eslabón 3 de 14" e o botão "Cronológico/Canónico".
3. **Toque no card:** abre uma folha com o texto da passagem (RV1909 completo, ou versículo-chave RVR1960 com o aviso), o estudo curto, "¿Por qué conecta?" e a pergunta.
4. **Rodapé fixo:** "← Anterior | **Siguiente en la cadena →**", com swipe lateral. No fim, "Temas relacionados" gera uma nova cadeia a partir de outro tema.
5. **Extras:** guardar a cadeia, retomar de onde parou, compartilhar como imagem.

Resumo prático: **OpenBible xrefs + Nave/Torrey (temas) + Theographic (datas) + RV1909 (texto) + DeepSeek (explicações)** entregam a "experiência Thompson" (buscar → cadeia → próximo elo) de forma mais simples, em ordem cronológica e sem violar copyright.

## Fontes
- Wikipedia – Thompson Chain-Reference Bible: https://en.wikipedia.org/wiki/Thompson_Chain-Reference_Bible
- Olive Tree Blog (exemplo tema 1409): https://www.olivetree.com/blog/thompson-chain-reference-study-bible/
- Resenha com a cadeia 3264: https://leejaredgarcia.com/2021/07/11/thompson-chain-reference-bible-a-review/
- Bible Buying Guide: https://biblebuyingguide.com/thompson-chain-reference/
- Fórum Baptist Board ("I don't get it"): https://www.baptistboard.com/threads/how-do-you-use-a-thompson-chain-reference-bible.97813/
- Thompson "Lamb of God" (EGW Writings): https://m.egwwritings.org/en/book/14181.2023788
- Blue Letter Bible – Special Bible Readings (Thompson): https://www.blueletterbible.org/study/thompson/specread.cfm
- Biblia de referencia Thompson (WorldCat): https://search.worldcat.org/title/22492420 · Amazon (Vida): https://www.amazon.com/dp/B0B5GG9KWS
- OpenBible cross references: https://www.openbible.info/labs/cross-references/ · https://a.openbible.info/data/cross-references.zip
- CrossWire TSK / Nave / SpaRV: https://www.crosswire.org/sword/modules/ModInfo.jsp?modName=TSK · https://www.crosswire.org/sword/modules/ModInfo.jsp?modName=Nave · https://www.crosswire.org/sword/modules/ModInfo.jsp?modName=SpaRV
- Torrey (CCEL): https://ccel.org/ccel/torrey/ttt
- Open Christian Data: https://github.com/eve-coda/open-christian-data · https://huggingface.co/datasets/OpenChristianDataOrg/open-christian-data
- Nave's (status do download): https://navestopicalbible.org/
- Theographic: https://github.com/robertrouse/theographic-bible-metadata
- scrollmapper bible_databases: https://github.com/scrollmapper/bible_databases
- eBible RV1909: https://ebible.org/find/details.php?id=spaRV1909
- getbible translations: https://api.getbible.net/v2/translations.json
- Permissões RVR1960 (Sociedad Bíblica Chilena): https://www.sbch.cl/sitio/multimedia/permisos-de-uso/
