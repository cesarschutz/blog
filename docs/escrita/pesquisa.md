# Escrita dos posts: a pesquisa da D71

De 02/10/2026. O Cesar leu o post dos mods ("Quanto custou cada agente? — Do CLAUDE.md ao mod no Claude
Code") e não gostou: o título não diz do que o post trata, a abertura já sai falando do exemplo (o
cockpit) e o texto está em primeira pessoa. Pediu uma pesquisa sobre título, resumo, TL;DR e post em
partes, e a leitura dos outros posts, para as regras novas. As regras estão na skill `post` (seções
"Escrita" e "Post em partes"); aqui ficam as fontes e o que a leitura dos posts mostrou.

Duas pesquisas na web (agentes Sonnet), com as páginas abertas e conferidas. O que veio só de resumo de
busca está marcado.

## O que as fontes dizem

### Título

| Regra | Fonte |
|---|---|
| O título tem de fazer sentido sozinho: ele aparece fora de contexto na busca, em listas e em links | [NN/g, microcontent](https://www.nngroup.com/articles/microcontent-how-to-write-headlines-page-titles-and-subject-lines/); [NN/g, headings](https://www.nngroup.com/articles/headings-pickup-lines/); [GOV.UK, clear titles](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/writing-guidelines/clear-titles/) |
| O termo principal no começo; numa lista, o leitor vê cerca de 11 caracteres (duas palavras) de cada item | [NN/g, first 2 words](https://www.nngroup.com/articles/first-2-words-a-signal-for-scanning/); [Microsoft, headings](https://learn.microsoft.com/en-us/style-guide/scannable-content/headings) |
| Específico, com fato ou informação; nada genérico | [NN/g, headings](https://www.nngroup.com/articles/headings-pickup-lines/) |
| Sem trocadilho, metáfora, humor ou linguagem da moda | [NN/g, UX writing](https://www.nngroup.com/articles/ux-writing-faqs/); [Google, tone](https://developers.google.com/style/tone) |
| Sem isca: o título não promete o que o texto não entrega | [NN/g, microcontent](https://www.nngroup.com/articles/microcontent-how-to-write-headlines-page-titles-and-subject-lines/); [Google, helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) |
| Título em pergunta: o GOV.UK desaconselha (a frase veio do resumo da página A a Z, sem a conferência literal) | [GOV.UK, A to Z](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/style-guides/a-to-z-style-guide/) |
| Os termos que o público procura, sem nome interno nem sigla sem explicação | [GOV.UK, clear titles](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/writing-guidelines/clear-titles/); [NN/g, UX writing](https://www.nngroup.com/articles/ux-writing-faqs/) |
| Com título e subtítulo, fica claro qual é o principal | [Google, title links](https://developers.google.com/search/docs/appearance/title-link) |

Números: de 40 a 60 caracteres (NN/g) e 65 com espaços (GOV.UK). O Google não dá limite: corta pela
largura da tela. Daí a regra do blog: o que importa nos primeiros 60, alvo de ~65, teto de 85.

O GOV.UK e a Microsoft desaconselham travessão e hífen em título. O blog mantém o " — " porque ele é a
divisão entre o assunto e o complemento em todo o site (D26 em diante); a regra compensa exigindo que o
assunto feche sozinho.

### Descrição

- Para que serve: um resumo curto e relevante da página, único por página, sem fila de palavras-chave
  ([Google, snippets](https://developers.google.com/search/docs/appearance/snippet)). O Google pode
  ignorá-la e montar o trecho com o texto da página.
- Tamanho: o Google não dá número; o GOV.UK dá 160 caracteres com espaços, e manda pôr o ponto principal
  nesses 160 ([GOV.UK, summaries](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/writing-guidelines/summaries/)).
  Nenhuma fonte recomenda os ~200 que o blog usava.
- Frase com verbo, em linguagem comum, com ponto final, usando o mínimo de palavras do título (GOV.UK).

### TL;DR

- O resumo no alto ajuda o leitor a decidir se o texto é para ele; no fim, quase ninguém chega
  ([NN/g, long-form](https://www.nngroup.com/articles/formatting-long-form-content/)).
- Lista curta, do mais importante para o menos (pirâmide invertida,
  [NN/g](https://www.nngroup.com/articles/inverted-pyramid/)).
- "De 3 a 5 pontos" e "cada ponto é uma conclusão, não um índice" são escolhas do blog: nenhuma fonte
  primária diz isso com essas palavras. O princípio vem da pirâmide invertida (o leitor pode parar em
  qualquer ponto e sair com o principal).

### Abertura

- O mais importante primeiro, inclusive a conclusão ([NN/g, inverted pyramid](https://www.nngroup.com/articles/inverted-pyramid/)).
- A introdução diz o que a página cobre, deixa julgar a relevância e cita os pré-requisitos
  ([MDN, writing style](https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Writing_style_guide)).
- Termo de especialista é explicado na primeira vez ([GOV.UK, clear language](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/writing-guidelines/clear-language/)).
- Quanto se lê: no máximo 28% das palavras de uma página, mais provável 20% ([NN/g](https://www.nngroup.com/articles/how-little-do-users-read/),
  estudo de 2008: vale como tendência).
- O teste do lide (tirar um bom título só do primeiro parágrafo) é atribuído ao manual da Folha; veio de
  fonte secundária, sem o manual aberto.

### Voz

- Google e Microsoft pedem a segunda pessoa ("you") e a voz ativa; a Microsoft manda usar a primeira do
  singular com parcimônia e evitar o "we" ([Google, person](https://developers.google.com/style/person),
  [Google, voice](https://developers.google.com/style/voice),
  [Microsoft, person](https://learn.microsoft.com/en-us/style-guide/grammar/person)).
- O MDN sugere reescrever para tirar o pronome, com a coisa como sujeito.
- Esses guias são de documentação. Nenhum fala de post de blog narrado pelo autor: tirar a primeira
  pessoa é escolha de estilo do Cesar, compatível com eles.

### Post em partes

| Regra | Fonte |
|---|---|
| Dividir quando são assuntos distintos; o tamanho sozinho não é motivo | [NN/g, in-page links](https://www.nngroup.com/articles/in-page-links-content-navigation/); [Google, helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) |
| Cortar por necessidade do leitor: a explicação separada da tarefa prática | [Diátaxis](https://diataxis.fr/) |
| Cada página se sustenta sozinha (o leitor chega pela busca) | [Google, pagination](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading) |
| Título único e descritivo por página; descrição única | [Google, title links](https://developers.google.com/search/docs/appearance/title-link); [Google, snippets](https://developers.google.com/search/docs/appearance/snippet) |
| `rel=next/prev` não é mais usado pelo Google; cada parte com URL e canonical próprios e links comuns entre elas | [Google, pagination](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading); [Google, Article](https://developers.google.com/search/docs/appearance/structured-data/article) |
| Não há dado estruturado oficial para série | [Google, Article](https://developers.google.com/search/docs/appearance/structured-data/article) |

Como os blogs de engenharia fazem (páginas abertas):

| Blog | Títulos | Como ligam as partes |
|---|---|---|
| [Cloudflare](https://blog.cloudflare.com/quicksilver-v2-evolution-of-a-globally-distributed-key-value-store-part-1/) | "Quicksilver v2: evolution of a globally distributed key-value store (Part 1)" e "(Part 2)" | a parte 1 anuncia a seguinte; a parte 2 tem uma recapitulação e o link da 1; uma semana entre as duas |
| [Cloudflare](https://blog.cloudflare.com/helping-to-build-cloudflare-part-2/) | "Helping To Build Cloudflare, Part 2: The Most Difficult Two Weeks" | no alto, "This is part 2 of a six part series", com o link; no fim, a lista das partes |
| [AWS](https://aws.amazon.com/blogs/architecture/disaster-recovery-dr-architecture-on-aws-part-i-strategies-for-recovery-in-the-cloud/) | "Disaster Recovery (DR) Architecture on AWS, Part I: Strategies for Recovery in the Cloud" | a lista das quatro partes com link; a parte II recapitula em uma frase |
| [AWS](https://aws.amazon.com/blogs/architecture/eclipse-dataspace-components-on-aws-data-sharing-fundamentals/) | três títulos descritivos, sem "Part N" | a introdução diz que é a parte N de 3 e resume as outras; publicadas no mesmo dia |
| [Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/stripe) | "Inside Stripe's Engineering Culture - Part 1" | a parte 1 diz o que a 2 cobre, com link; seis semanas entre as duas |

Publicar juntas ou com intervalo: nenhuma fonte primária dá regra; os exemplos fazem dos dois jeitos. O
blog publica juntas, para os links valerem desde o primeiro dia.

## O que a leitura dos 29 posts mostrou

- **Títulos:** quase todos já seguem "Assunto — complemento" com o nome da tecnologia na frente ("AOP no
  Spring — …", "JWT — …", "Kubernetes CronJob — …"). O dos mods era o único em pergunta e o único com o
  assunto no complemento. Dois passam do teto de 85 caracteres (Java 25, com 94, e criptografia, com
  86) e um chega perto (CronJob ou endpoint + fila, com 84).
- **Descrições:** as 29 passam de 160 caracteres, e cinco passam de 200. Várias são uma fila de termos
  separados por vírgula, sem verbo.
- **Abertura:** a maioria diz o problema e emenda um "Este post mostra…" no primeiro parágrafo, que é o
  padrão a manter. Fora dele: o dos mods (abria por uma pergunta e um print), o de criptografia (abre por
  uma cena, "Outro dia, revisando…") e o de data lake (pergunta no primeiro parágrafo).
- **Primeira pessoa:** rara nos posts antigos (uma ou duas ocorrências em cinco deles); no dos mods eram
  16 linhas.
- **TL;DR:** só o post dos mods tinha (o campo é da D63). Os pontos eram conclusões, mas o primeiro era
  uma lista de peças, e não o que a coisa é.

Os posts antigos não são corrigidos por esta decisão. O levantamento sai de `npm run escrita`, sem
argumento.
