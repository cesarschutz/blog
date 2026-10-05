---
name: post
description: Processo único de todo post do blog, com o mesmo checklist nos dois modos, Novo (a partir de um tema ou ideia) e Adaptar (a partir de um arquivo em entrada/, de um texto colado ou de um post que já está no blog). Use sempre que o Cesar pedir para criar, escrever, adaptar, importar, migrar, reescrever ou revisar um post ou artigo, inclusive a revisão em lote dos posts antigos (.claude/revisao-posts.md).
---

# Post

Todo post passa por aqui, do zero ou adaptado. **Tudo o que um post novo recebe, um post adaptado
também recebe**: plano, desenho, figura em passos onde há fluxo, conferência no navegador e qualidade.

> **Lembrete (D63):** no primeiro post feito com os formatos novos (o TL;DR do detalhado, o infográfico
> do resumo e os links ao longo do texto), ao entregar, peça ao Cesar para olhar como ficou e dizer o
> que ajustar. Depois que ele olhar, registre os ajustes e apague este lembrete e o item do
> `docs/estado.md`.

## Modos

- **Novo:** o Cesar dá um tema ou uma ideia. Você escreve o texto.
- **Adaptar:** o ponto de partida é um arquivo em `entrada/` (md, txt, docx, pdf ou html, com ou sem
  imagens), um texto colado na conversa ou um post que já está em `src/content/posts/`. O texto e a
  voz são do Cesar e ficam como estão (passo 3).

Nos dois modos, o post começa pela conversa do passo 2: o formato (detalhado ou resumo), a estrutura
e as fontes, combinados com o Cesar antes do plano.

Como ler o que chega em `entrada/` (fora do git; nada ali é publicado):
- `.md`, `.txt` e `.html`: leia direto. No HTML, aproveite só o conteúdo, sem o CSS ou o layout.
- `.pdf`: a ferramenta Read lê PDF (use `pages` quando passar de 10 páginas).
- `.docx`: é um zip. `unzip -p arquivo.docx word/document.xml` dá o texto; as imagens ficam em
  `word/media/`. Se houver `pandoc` na máquina, `pandoc arquivo.docx -t gfm` preserva a estrutura.
- As imagens soltas ou embutidas entram no inventário visual do plano (passo 2).

## Checklist (sempre, nesta ordem)

### 1. Ler as regras

Leia `DESIGN.md` (visual, desenhos e as regras de movimento; o detalhe de cada animação está em
`docs/movimento.md`) e `CLAUDE.md` (regras do projeto, URLs que não podem
quebrar). **O `DESIGN.md` vence qualquer ferramenta:** o "go all out", o redesign e a troca do
`DESIGN.md` que a skill `impeccable` sugere não valem aqui. Leia também um post existente em
`src/content/posts/` para carregar `.claude/rules/posts.md`, e o `docs/estilo-desenho.md`.

### 2. Formato, estrutura e plano, antes de mexer em qualquer arquivo

**Primeiro, a conversa (D63).** Todo post, novo ou ajustado, começa com o Cesar. Pergunte e combine,
antes de qualquer plano:

- **O formato:** **detalhado** ou **resumo** (um resumo de verdade, não um tweet). Cada post se decide
  na conversa; não há formato padrão.
  - **Detalhado:** o post completo, de 1.500 a 2.500 palavras (8 a 12 min, teto de ~3.000), com o
    **TL;DR** no alto (o campo `tldr`, passo 4).
  - **Resumo:** de 700 a 1.200 palavras (4 a 6 min), com um **infográfico** que mostra o assunto inteiro
    de uma vez, no estilo da casa (skill `figura`, "Infográfico do post resumo"), e o texto passando
    por ele.
- **O assunto em uma frase (D71):** antes da estrutura, escreva "este post é sobre X" e confirme com o
  Cesar. O título, a descrição, o TL;DR e a abertura saem dessa frase. O **exemplo** do post (um projeto
  dele, um caso, um incidente) não é o assunto: se o pedido fala de um lançamento e de um projeto feito
  com ele, pergunte qual dos dois é o assunto e qual é o exemplo.
- **A estrutura:** ajude o Cesar a pensar o que entra. Proponha as seções (`##`), o que cada uma diz e o
  que fica de fora, e ajuste com ele até fechar.
- **Uma parte ou duas (D71):** se a estrutura passa do teto do formato e tem dois assuntos que se
  sustentam sozinhos (o conceito e a prática, o fundamento e o caso), proponha dividir em dois posts,
  pela seção [Post em partes](#post-em-partes-d71).
- **As fontes:** pergunte se ele já estudou o assunto. Se ele trouxer links, o post se baseia neles:
  abra e leia cada um antes de escrever, e diga o que eles não cobrem. Se não trouxer, você busca fontes
  confiáveis (documentação oficial, especificação, RFC, JEP, release notes, o livro ou o artigo de quem
  criou a coisa; blog de terceiro só como apoio) e as mostra junto com a estrutura.
- **Ajustar um post que já existe:** a mesma conversa. O campo `formato` diz o que foi combinado da
  outra vez (os posts de antes da D63 não têm o campo e são detalhados).

**Depois, o plano.** Apresente o plano e **espere a aprovação do Cesar**. O plano traz:

- **Formato e estrutura:** o que foi combinado na conversa, com as fontes de cada seção.
- **Título, descrição e abertura (D71):** o título proposto (com duas alternativas), a `description` e a
  primeira frase do post, pelas regras de [Escrita](#escrita-título-descrição-tldr-abertura-e-voz-d71).
  O Cesar aprova o título antes de o texto ser escrito.
- **Livro:** um dos livros de `src/livros/livros.json` **ou** uma série (`src/data/series.ts`). O
  subtítulo de cada livro diz o que cabe nele, e a casa do post é o que ele ensina (o exemplo, como a
  cobrança num post de idempotência, vira tag).
- **A coleção ainda serve? (D78)** Em todo post, pense se os livros continuam bons com ele. O normal é
  não mudar nada, e aí basta dizer "a coleção serve". Mas avise o Cesar e sugira, com o motivo e as
  opções, quando:
  - o post **não cabe bem em nenhum livro** (um post de carreira, que não tem livro desde a D78):
    criar um livro, ou o livro mais próximo e por que ele serve;
  - o post mostra que **um livro ficaria melhor dividido** (um livro que junta assuntos que já têm
    posts suficientes para andar sozinhos);
  - **um nome deixou de servir** (um post de arquitetura corporativa pediria um livro novo ou trocar
    "Arquitetura de Software" por "Arquitetura", mais genérico);
  - **dois livros se sobrepõem** e o post poderia morar nos dois.

  Só sugestão: nada muda sem o OK do Cesar. Livro novo ou renomeado segue a seção "Livros novos" de
  `docs/capas/CAPAS.md` (desenho, ícone, cor, volume em ordem alfabética) e não pode quebrar URL
  (`/categories/<Nome>/` antigo redireciona). Vale também para as tags (abaixo).
- **Tags:** de 2 a 4, do vocabulário existente, sem repetir o nome do livro. Tag nova só se servir a
  mais de um post, e **com o ícone dela** (D52): proponha o objeto que a representa (a metáfora, nunca
  o logotipo de uma marca) junto com a tag.
- **Série:** se entra numa, e em que posição. Post da série Java segue a skill `serie-java`.
- **Slug:** o nome do arquivo e a URL (`/posts/<slug>/`), curto, em pt-BR, sem acento. Adaptado de
  um post que já existiu no blog: o slug antigo, ou um redirecionamento (passo 3).
- **Inventário visual** (regras dos desenhos no passo 5):
  - Para **cada imagem existente**, diga se ela vai ser **redesenhada no estilo** (vira SVG da casa:
    figura ou figura em passos), virar **print como evidência** (`Evidencia`, só se prova algo do texto
    e dá para garantir que está certo) ou **sair** por ser só decorativa; diga por quê.
  - A **capa** (sempre existe): o que ela vai mostrar e o **detalhe da capa viva** (o que se mexe no
    hover e com qual classe `mexe-*`).
  - Cada recurso escolhido pela tabela [Qual recurso para qual conteúdo](#qual-recurso-para-qual-conteúdo),
    com o trecho do texto que ele explica e o que o texto vai dizer para apresentá-lo: **figura**
    (diagrama ou gráfico colorido, parado ou com detalhe que se mexe; os tons de cada ator),
    **figura em passos** (de sequência ou de comparação, D67), **frase em destaque** (rara),
    **print** (o que prova e de onde; tela com login, peça ao Cesar).
  - Os **ícones das ferramentas**: quais, onde no texto (primeira menção e mais adiante) e em quais
    desenhos, e se algum logo precisa ser desenhado (os que existem estão em `src/marcas/`).
  - Nem todo post tem todos os tipos: proponha só o que o assunto pede.
- **Caneta (D48):** as marcações **não entram no plano**. Elas são a última etapa (passo 9), pela
  skill `caneta`, depois que texto, desenhos e animações estiverem prontos e aprovados.
- **Modo Adaptar:** a lista de **sugestões de conteúdo**, separadas do plano (passo 3).

### 3. Texto

- **Novo:** no tamanho do formato combinado (passo 2): detalhado, de 1.500 a 2.500 palavras (8 a 12
  min, teto de ~3.000; assunto maior vira [post em partes](#post-em-partes-d71)); resumo, de 700 a 1.200
  (4 a 6 min). Seções `##` claras, tom profissional e direto em pt-BR, sem enchimento. O título, a
  descrição, o TL;DR, a abertura e a voz seguem a seção
  [Escrita](#escrita-título-descrição-tldr-abertura-e-voz-d71).
- **Adaptar:** **preserve o texto e o jeito de escrever do Cesar.** Mude só o necessário para o formato
  (Markdown, avisos, código, links) e para as regras de [Escrita](#escrita-título-descrição-tldr-abertura-e-voz-d71)
  (título, descrição, abertura e a primeira pessoa, que sai). Correções e melhorias de conteúdo (erro técnico, fonte que falta,
  trecho confuso, corte) vêm como **sugestões separadas**, numeradas, e só entram se o Cesar aprovar
  cada uma. Os posts antigos não precisam ser encurtados.
- **Nos dois modos:** nenhuma afirmação técnica sem fonte confiável conferida (documentação oficial,
  especificação, RFC, JEP, release notes; blog de terceiro só como apoio). Nada inventado: versões,
  números, benchmarks, citações e APIs só entram se verificados. Abra cada link e confirme que ele diz
  o que o texto afirma. `## Fontes` é sempre a última seção. **Código e SQL testados antes de
  publicar** (rodados, não só "que compila"), porque o aviso de IA do post promete "com o código
  testado". O que não der para rodar aqui vai ao Cesar como pendência, dizendo o quê e por quê.
- **Links ao longo do texto (D63):** cada fonte entra **onde o texto fala do que ela diz**, com o link nas
  palavras do assunto (nunca "aqui" ou "neste link"), apontando para a página mais específica (a seção,
  a âncora), e também em `## Fontes`, no fim. No máximo dois links por parágrafo, para o texto continuar
  lendo bem. A ferramenta que já tem o ícone (`Ferramenta`) não precisa de outro link no mesmo lugar.
- **URL antiga:** se o post já existiu em outra URL do blog, mantenha a URL ou crie o
  redirecionamento em `redirecionamentos` do `astro.config.mjs`. Nunca mude um título de seção de
  post já publicado, porque as âncoras dependem dele (D7). Depois, `npm run links`.

### 4. Estrutura

Antes de seguir, rode `fnm exec --using=24 npm run escrita -- <slug>` (D71): ele confere o título, a
descrição, o TL;DR, a abertura e a primeira pessoa, e precisa terminar sem problema (o aviso que sobrar
vai explicado no relatório).

- **Frontmatter completo** (schema em `src/content.config.ts`):
  - `title`: "Assunto — complemento" (o que vem depois de " — " vira subtítulo). O assunto, sozinho,
    tem de dizer do que o post trata (regras em [Escrita](#escrita-título-descrição-tldr-abertura-e-voz-d71));
  - `description`: uma ou duas frases, com o essencial nos primeiros 160 caracteres (aceita `código` e
    **negrito**);
  - `published`; `updated` só em revisão relevante (aparece como "Atualizado em");
  - `category` **ou** `series`, nunca os dois;
  - `tags`: de 2 a 4;
  - `codigo` (D52), **só quando o artigo tem código-fonte publicado** no repositório de exemplos do
    Cesar (`https://github.com/cesarschutz/blog-exemplos`, uma pasta por artigo, com o nome do slug):
    o endereço da pasta, com `https://`, por exemplo
    `codigo: https://github.com/cesarschutz/blog-exemplos/tree/main/jackson-filtros-mascarando-cartao`.
    Pergunte ao Cesar se o código do post vai para lá; se for, abra o link e confira que a pasta existe
    e é a do artigo antes de preencher. Com o campo, o topo do artigo mostra "Código deste artigo no
    GitHub" e o artigo ganha o sinal de código-fonte nas listas, nos cards, no anterior / próximo, no
    livro ampliado e na busca. Não repita o link no texto (a não ser que ele explique uma
    parte específica do código). Sem código publicado, o campo fica de fora;
  - `formato` (D63): `detalhado` ou `resumo`, o que foi combinado no passo 2;
  - `tldr` (D63), no detalhado: de 3 a 5 pontos (o esquema aceita de 2 a 6), cada um uma conclusão que
    se entende sozinha, com o que o leitor leva do post (regras em
    [Escrita](#escrita-título-descrição-tldr-abertura-e-voz-d71)); aceitam `código`, **negrito** e links. **Cada
    ponto entre aspas**: com ": " no meio, o YAML lê o ponto como objeto e o build recusa. Aparece
    fechado no alto do texto, e o leitor clica para abrir (`Tldr.astro`). No resumo, não entra: o
    infográfico faz esse papel;
  - `draft: true` até o Cesar aprovar.
- **Aviso de conteúdo feito com ajuda de IA:** sai sozinho no rodapé de todo artigo
  (`RodapeArtigo.astro`). Confira que ele aparece; não escreva outro no texto.
- **Espaço opcional para a apresentação:** não se escreve no post. Quando o Cesar trouxer o `.pptx`
  (skill `apresentacao`), os slides vão para `public/posts/<slug>/deck/` e a entrada para
  `src/data/decks.json`, e a seção entra sozinha antes de `## Fontes`.
- `$` em texto com escape (`US\$ 10`). Post com figura, figura em passos, frase em destaque, ícone de
  ferramenta ou print é `.mdx`.
- Recursos de Markdown (código, avisos, notas laterais, tabelas, KaTeX): veja
  [Recursos de Markdown](#recursos-de-markdown) e `/amostra/markdown/` no dev.

### 5. Desenhos

Siga a skill `desenho` (a capa e a capa viva) e a skill `figura` (figuras coloridas, figura em passos,
logos das ferramentas e print), no estilo do `DESIGN.md` e do `docs/estilo-desenho.md`. O que vale para
todo desenho (o texto que apresenta o desenho, o texto alternativo, nada de gerador de traço, o
validador, a revisão da D59 antes de mostrar ao Cesar e a regra de marca dos logos) está em
`.claude/rules/desenho.md`, que carrega ao abrir um desenho; as regras do corpo do post (tons, ícones das
ferramentas, print) e o checklist da revisão, na skill `figura`. Do post, aqui:

- **Post resumo (D63):** o infográfico é o desenho principal, logo depois da introdução: uma figura
  grande que mostra o assunto inteiro de uma vez (a ideia dos guias do ByteByteGo, no nosso estilo),
  pela seção "Infográfico do post resumo" da skill `figura`. O texto passa por ele, quadro a quadro.
- **Tag nova:** o ícone dela, pela seção "Tags" do `docs/capas/CAPAS.md` (o desenho em
  `scripts/desenho/tags.mjs`, gravado em `src/livros/tags/<slug>.svg` e conferido em `/amostra/tags/`
  ao lado dos outros, nos dois temas). Sem ele, o build quebra.

### 6. Animações

Quem manda no movimento (D58): a **capa** só mexe um detalhe no hover (`mexe-*`, skill `desenho`); a
**figura** fica parada ou tem detalhes que se mexem sozinhos sem mudar a imagem (skill `figura`); na
**figura em passos**, o leitor monta a figura passo a passo e nada anda sozinho (skill `figura`, D67).
Nenhum desenho é comandado pela rolagem da página (D46).

- **Só onde há fluxo** (sequência, passo a passo, antes e depois, o sistema funcionando). Post sem
  fluxo fica com a capa viva e, se ajudar, figuras paradas.
- **Sequência em que a ordem importa, comparação no tempo ou o sistema funcionando:** a figura em passos
  (`FiguraPassos`, com `estilo="marca-texto"` e `fim="segmentos"`, skill `figura`), como em todos os
  posts com passos desde 02/10/2026. A frase em destaque (`FraseDestaque`, skill `lousa`) é rara.
- **Em prova (D67):** a `Lousa` (o leitor comanda o tempo, skill `lousa`) e a `Animacao` (a imagem muda
  com play e pausa, skill `figura`) continuam no código, mas só nas páginas de prova (`/animacoes-test/`);
  post novo não usa, até o Cesar fechar a D67.
- **Pouco por passo:** o que entrou não some, nada é riscado nem trocado; mais desenho que texto, num
  ritmo que dá para ler (as regras numeradas estão na skill `figura`, "Figura em passos").
- **Vídeo de verdade** (MP4/WebM) só se o Cesar pedir: comprimido, com `poster`, `preload="none"` e
  carregado sob demanda.

### 7. Conferir no navegador (Chrome DevTools MCP)

Antes de olhar à mão, rode `fnm exec --using=24 npm run conferir -- <slug> --capturas` (dev no ar;
`--base http://127.0.0.1:4323` para o preview). Ele cobre 320 a 1600px nos dois temas, rolagem
lateral, console, rede, `alt` e as marcas da caneta, e precisa terminar com "Tudo ok". O trace de
performance e as animações continuam à mão, pelo `chrome-devtools`:

Com o dev no ar (`fnm exec --using=24 npm run dev -- --host 127.0.0.1`, porta 4322), use o servidor
MCP `chrome-devtools`:

- **Tela larga (1440 px) e celular (390 px)**, nos temas claro e escuro. Sem rolagem lateral.
- **Console sem erros** nem avisos novos.
- **Animações funcionando:** a capa viva no topo, no card e na lista (tirar o mouse no meio não pode
  pular); os detalhes das figuras andando só na tela, na ordem do fluxo, e o destaque da legenda; em
  cada figura em passos, "Passo a passo", Próximo, Anterior, o clique num passo da lista, os traços de
  fim e a figura inteira no último passo (no celular, o quadro rola até o que entrou). Numa lousa ou
  animação das páginas em prova: o play inteiro (5 s no fim), o arrasto e os passos; a animação abrindo
  sozinha, o anel, recomeçar e o clique que pausa. Com `prefers-reduced-motion: reduce`, nada se mexe
  sozinho e tudo aparece no quadro final.
- **Trace de performance** da página do post, com CPU 4× no celular. Olhe o **custo do filtro de
  tremor** (`feTurbulence`/`feDisplacementMap` aparece como "Paint"/"Rasterize" longo),
  principalmente em desenho animado: a animação precisa ficar perto de 60 quadros por segundo, sem
  tarefa longa. Se pesar, reduza a área filtrada ou grave o tremor na geometria (plano B do
  `DESIGN.md`).

### 8. Qualidade

- **Impeccable:** rode `/impeccable polish` no post (a página do artigo e os componentes novos) e o
  detector, `.claude/skills/impeccable/scripts/impeccable detect <arquivos do post>`, até **zero
  achados**. O Impeccable é revisor; a correção segue o `DESIGN.md`. Achado que contradiz uma decisão
  do `DESIGN.md` vira exceção registrada (`impeccable hooks ignore-value … --reason "Cesar decidiu:
  …"`), nunca uma mudança de estilo.
- **Web quality:** rode a skill `web-quality-audit` na página do post (performance, acessibilidade,
  SEO e boas práticas) e corrija o que aparecer.
- **Projeto:** `npm run check` com 0 erros, `npm run build`, `npm run links` (0 quebrados) e
  `npm run contraste` (0 falhas), sempre com `fnm exec --using=24`.
- **Fotos dos livros (D57):** o número de artigos da lombada está na foto do livro deitado. Post novo
  (ou o primeiro de um livro vazio): `node scripts/livros/fotos.mjs` com o dev no ar; o build avisa
  "[fotos dos livros]" quando uma foto ficou para trás. As etiquetas se ajustam sozinhas.

### 9. Caneta (a última etapa)

Com o texto, os desenhos e as animações prontos e aprovados, chame a skill **`caneta`** (a passada de
caneta, D48): ela lê o guia `docs/marcacoes.md` inteiro, propõe as marcações (trecho, tipo e motivo)
para o Cesar aprovar, aplica, testa em 320, 390, 768, 1280 e 1600px nos dois temas e entrega o
relatório. Nada de marcação antes disso.

### 10. Relatório final (curto)

- O que mudou (arquivos e URL).
- Desenhos **criados**, **refeitos** e **removidos**.
- O que foi verificado (e com que resultado): navegador, trace, Impeccable, web quality, comandos.
- As marcações da caneta (o relatório da skill `caneta`).
- O que ficou pendente e as sugestões de conteúdo ainda não aprovadas.
- O resultado do `npm run escrita -- <slug>` (D71) e, se o post tem partes, a conferência dos links
  entre elas.
- A pergunta da regra de aprendizado (D68) para cada pedido ou reclamação do Cesar nesta rodada: vira
  regra para os próximos posts?

Commit e publicação, só com o pedido do Cesar (`CLAUDE.md`).

## Escrita: título, descrição, TL;DR, abertura e voz (D71)

Regras do Cesar de 02/10/2026, depois de ler o post dos mods ("Quanto custou cada agente?"), com a
pesquisa em `docs/escrita/pesquisa.md`. Valem para todo post novo e para o que for ajustado; os posts
antigos não precisam ser corrigidos. O `npm run escrita -- <slug>` confere o que dá para conferir sozinho.

**O teste de tudo:** quem lê só o título (numa busca, numa lista, num link colado) sabe do que o post
trata? Quem lê só o título e a descrição sabe se o post é para ele? Quem lê só o primeiro parágrafo
sabe o assunto?

### Título

O título aparece sozinho na busca, no RSS, no link compartilhado e na aba do navegador, e a parte de
antes do " — " aparece sozinha em algumas listas do site (as fichas da página de Tags, por exemplo).

- **O assunto vem antes do travessão e fecha sozinho.** Ele dá nome à coisa de que o post trata, com o
  termo que o leitor procuraria: a tecnologia ou o produto e o tema ("Mods do Claude Code", "Bloqueio
  otimista e pessimista", "Kubernetes CronJob"). Depois do travessão vem o recorte: o que o post cobre
  do assunto ("o que são e as peças que vieram antes", "concorrência, retries e tempo máximo de execução").
- **O termo principal fica nas primeiras palavras.** Numa lista, o leitor vê as duas primeiras palavras
  de cada item.
- **É uma afirmação do assunto, nunca um gancho.** Sem pergunta ("Quanto custou cada agente?"), sem
  trocadilho, metáfora ou mistério, sem promessa ("tudo sobre", "o guia definitivo"), sem "como eu fiz".
- **Sem nome que só o Cesar conhece.** O nome de um projeto dele, de um sistema interno ou de uma sigla
  pouco conhecida só entra junto do que a coisa é ("o csr-cockpit, um mod de exemplo"), e nunca como o
  assunto.
- **O título é do assunto do post, não do exemplo.** Se o post explica um recurso e usa um projeto como
  exemplo, o título fala do recurso.
- **Tamanho:** o assunto com até ~45 caracteres; o título inteiro perto de 65 (o que a busca costuma
  mostrar), com teto de 85. O que importa tem de estar nos primeiros 60.
- **Só a primeira palavra e os nomes próprios em maiúscula**, sem ponto final e sem o tipo de texto no
  título ("post sobre", "artigo").
- Proponha o título com duas alternativas no plano; o Cesar escolhe. O título de um post publicado pode
  mudar (a URL é o slug); o título de **seção** não muda (D7).

| Não | Sim | O que mudou |
|---|---|---|
| Quanto custou cada agente? — Do CLAUDE.md ao mod no Claude Code | Mods do Claude Code — o que são e as peças que vieram antes | o assunto na frente, sem pergunta, sem o exemplo no título |
| O dia em que o deploy derrubou o lote | Kubernetes CronJob — concorrência, retries e tempo máximo de execução | o nome da coisa no lugar da história |
| JWT por dentro | JWT — a estrutura e o significado de cada campo | o recorte dito, sem metáfora |

### Descrição (`description`)

Aparece no card, na busca do site e como o resumo que a busca do Google costuma mostrar.

- Uma ou duas frases com verbo, terminadas em ponto, que dizem **o que o post cobre** e deixam o leitor
  decidir se é para ele. Podem começar por "Como…", "O que…", "Por que…".
- **O essencial nos primeiros 160 caracteres** (é o que a busca mostra); o teto é 200.
- Não repete o título: usa as palavras que não couberam nele. Não é uma fila de palavras-chave separadas
  por vírgula, nem começa por "Neste post".
- Cada post tem a sua; duas partes do mesmo assunto têm descrições diferentes.

### TL;DR (`tldr`, no detalhado)

- De 3 a 5 pontos, do mais importante para o menos. O primeiro diz o que a coisa é.
- **Cada ponto é uma conclusão** que se entende sem o texto ("O mod roda dentro do Claude Code e desenha
  na interface"), nunca um item de índice ("O post mostra o que é um mod").
- Uma ou duas frases por ponto, até ~40 palavras. Nada que o texto não diga.
- Em post com partes, o último ponto aponta para a outra parte.

### Abertura

- **O primeiro parágrafo diz o assunto e por que ele importa**, com o termo do título: o que é a coisa,
  o que mudou ou qual é o problema, em 2 ou 3 frases. Dele dá para tirar um bom título.
- **O segundo diz o que o post cobre e para quem** ("Este post explica…"), e o que ele não é.
- **O exemplo, o caso e a história vêm depois.** O post não abre por uma pergunta ao leitor, por uma
  cena ("Outro dia, revisando…"), por um print nem pelo projeto que serve de exemplo.
- Termo que o leitor pode não conhecer é explicado na primeira vez em que aparece.
- A imagem ou o desenho de abertura vem depois desses dois parágrafos.

### Voz

- **Nunca a primeira pessoa do singular**: nada de "eu", "criei", "testei", "fiz", "publiquei",
  "aprendi", "meu repositório". Também não "nós" nem "a gente".
- No lugar, nesta ordem de preferência:
  - **o sujeito é a coisa**: a ferramenta, o post, o exemplo, o teste ("O teste dispara os eventos", "Este
    post explica", "O csr-cockpit tem 15 testes");
  - **o infinitivo ou o imperativo** para o que se faz ("Para testar um mod, rode…", "Instale só…");
  - **"você"** quando é o leitor quem age ("o programa que você abre no terminal").
- Voz ativa. A passiva só quando quem fez não importa ("Os mods foram lançados em 01/10/2026").
- **O que foi rodado ou medido vira fato com data**, sem narrador: "Em 02/10/2026, os 15 testes passaram
  na versão 2.1.287", ou o carimbo da caneta. O que não foi conferido é dito do mesmo jeito: "No
  aplicativo de desktop, o painel ainda não foi conferido".
- O projeto do Cesar é citado pelo nome ("o repositório claude-code-kit"), não pela posse.
- Vale para os títulos de seção, as legendas, os `alt`, os passos das figuras em passos e as notas da caneta.

| Não | Sim |
|---|---|
| Testei o cockpit em três camadas | Um mod se testa em três camadas |
| No mesmo dia publiquei um mod | A parte 2 mostra um mod pronto |
| O que eu demorei a entender | As confusões mais comuns |
| Eu leio essa tabela como uma escada | A tabela pode ser lida como uma escada |
| Vou continuar colocando coisas lá | O repositório vai continuar recebendo peças |

### Títulos de seção

- Descritivos, com o assunto na frente, no mesmo padrão do título: quem lê só o sumário entende o
  caminho do post.
- Sem primeira pessoa e sem gancho. Pergunta só quando é a pergunta que o leitor faria com essas
  palavras ("`volatile boolean` ou `AtomicBoolean`?").

## Post em partes (D71)

Um assunto que não cabe num post vira dois posts ligados: a parte 1 e a parte 2. Não é uma série (a
série é uma revista da coleção, com capa e página própria, pelo `CAPAS.md`): são dois artigos comuns,
no mesmo livro, que apontam um para o outro. Com três partes ou mais, converse com o Cesar: pode ser o
caso de uma série.

**Quando dividir** (as duas condições juntas):
- o texto passa do teto do formato (~3.000 palavras no detalhado) depois de enxuto;
- e há **dois assuntos que se sustentam sozinhos**: em geral o conceito e a prática (o que é e de onde
  vem; um caso de ponta a ponta), ou o fundamento e a operação.

**Quando não dividir:** só pelo tamanho; quando a parte 2 não se entende sem a 1 (aí o caminho é
cortar texto); quando o corte cairia no meio de um raciocínio.

**Como fica cada parte:**
- **Um post inteiro:** slug, título, descrição, TL;DR, capa, tags e `## Fontes` próprios, no tamanho de
  um post normal (cada parte dentro do formato). O mesmo livro e, em geral, as mesmas tags.
- **Título:** cada parte tem o **assunto diferente** antes do travessão, descrevendo o que ela cobre, e
  "(parte N de M)" no fim do complemento: "Mods do Claude Code — o que são e as peças que vieram antes
  (parte 1 de 2)" e "Um mod do Claude Code na prática — instalação, testes e limites (parte 2 de
  2)". Nunca "X, parte 2" com o mesmo assunto nas duas.
- **O aviso da parte:** logo depois da abertura, `> [!NOTA] Parte N de M`, com o link da outra parte
  e uma frase do que ela cobre.
- **A parte 2 se lê sozinha:** o aviso dela traz a recapitulação em duas ou três frases (o que é a
  coisa, o que a parte 1 explicou), para quem chega direto pela busca.
- **A parte 1 termina apontando a 2**, numa seção curta que diz o que vem lá. O último ponto do TL;DR de
  cada parte aponta a outra.
- **Os termos e os exemplos são os mesmos** nas duas (os mesmos nomes, os mesmos tons nos desenhos), e
  o que é definido na parte 1 ganha uma frase na primeira vez em que aparece na parte 2.
- **A capa** das duas é da mesma família (o mesmo objeto, visto de dois jeitos).

**Publicação:**
- As partes saem **juntas**, com os links já valendo (`npm run links`). Se a parte 2 não estiver pronta,
  a parte 1 não promete data nem aponta link.
- A parte 2 é a mais nova. Saindo no mesmo dia, ela leva uma hora posterior no `published`
  (`published: 2026-10-02T12:00:00Z`; a parte 1 fica só com a data), porque com a mesma data o desempate
  é o slug e a ordem da home e o número da ficha se desencontram. Confira a ordem na home, na página do
  livro, no número da ficha de cada parte e no "anterior / próximo".
- **Post já publicado que vira a parte 1:** mantém o slug e a URL. Os títulos das seções que ficam não
  mudam; as âncoras das seções que foram para a parte 2 deixam de existir, e isso vai no relatório.
- Rode o `npm run escrita` nas duas, o `conferir` nas duas e as fotos dos livros (o livro ganha um artigo).

## Revisão em lote

Para revisar os posts antigos, use `.claude/revisao-posts.md` (versionado): a lista de posts e o
status de cada um. Pegue o próximo "pendente", siga o checklist inteiro no modo **Adaptar** (o post
já está no blog) e, ao concluir cada post, **atualize o status** na mesma hora, com a data e uma linha
do que mudou.

## Regra de aprendizado (D68)

Todo pedido ou reclamação do Cesar sobre um post (texto, estrutura, desenho, animação, caneta,
qualquer coisa), depois de feito, **termina com uma pergunta**: se aquilo vira regra para os próximos
posts. Uma linha por pedido, dizendo o que viraria regra e onde ela ficaria (esta skill, `figura`,
`lousa`, `desenho`, `caneta`, `DESIGN.md`, `docs/estilo-desenho.md`, `docs/marcacoes.md` ou
`.claude/rules/`).

- Pergunte sempre, mesmo quando o pedido parecer só daquele post: quem decide é ele.
- **Sim:** registre na hora, no lugar certo, com a data (e no `docs/decisoes.md`, se for decisão).
- **Não:** vale só para aquele post, e a mesma pergunta não volta.
- Se ele corrigir a mesma coisa duas vezes, vira regra de qualquer jeito (CLAUDE.md).

## Posts migrados do blog atual (D15)

A migração terminou (os 26 posts antigos, nas Fases 1 a 7, a partir do commit `0184562` do blog atual;
a `docs/virada.md` usa esse commit para achar o que saiu depois). Na revisão de um deles, slug, datas e
títulos de seção não mudam, nem quando o post vira MDX (as âncoras dependem deles, D7); categoria ou
série, tags e conteúdo só mudam com o OK do Cesar (modo Adaptar); citações e parágrafos "Cuidado:" não
viram avisos. O blog antigo, se houver um clone, é somente leitura (`CLAUDE.md`).

## Qual recurso para qual conteúdo

Escolha pelo papel do trecho, não para enfeitar. Post sem fluxo não tem animação; a maioria dos
trechos fica só no texto. Nem todo post tem todos os recursos, e todo desenho é apresentado no texto.

| O trecho é… | Recurso | Onde está |
|---|---|---|
| o assunto do post inteiro | a capa (sempre, uma por post), com o detalhe da capa viva | skill `desenho` |
| o post detalhado em 30 segundos | o TL;DR (campo `tldr`), fechado no alto do texto | passo 4 |
| um assunto que não cabe num post, com conceito e prática | duas partes, cada uma um post inteiro | Post em partes |
| o assunto inteiro numa imagem (post resumo) | o infográfico (`Figura`), logo depois da introdução | skill `figura` |
| quem fala com quem, a arquitetura, os papéis | figura colorida (`Figura`), um tom por ator, selos se há ordem, detalhes que se mexem se ajudarem | skill `figura` |
| um número, uma curva, o que o leitor veria no painel | gráfico (`Figura`), com eixos, unidade, o limite e a anotação | skill `figura` |
| uma sequência em que a ordem importa | figura em passos (`FiguraPassos`), com a lista numerada embaixo; a lousa de passos (`Lousa`) fica em prova (D67) | skill `figura` |
| antes e depois, ou "com e sem", ao longo do tempo | figura em passos de comparação (duas metades ou duas raias, D67); a lousa de comparação fica em prova | skill `figura` |
| o sistema funcionando, algo que enche, esvazia ou se forma no tempo | figura em passos (um objeto que passa por etapas) ou figura com detalhes que se mexem; a animação com play (`Animacao`) fica em prova (D67) | skill `figura` |
| a ferramenta de que o post fala | o ícone no texto (`Ferramenta`) e dentro dos desenhos (`data-marca`) | skill `figura` |
| a prova de um número ou de um comportamento (documentação oficial, erro, painel) | print (`Evidencia`); com login, o Cesar tira | skill `figura` |
| uma frase que resume o post e merece ser lida duas vezes (rara) | `FraseDestaque` | skill `lousa` |
| alerta, dica ou ressalva fora do fluxo do texto | aviso (`> [!DICA]`, `NOTA`, `IMPORTANTE`, `ATENCAO`, `CUIDADO`) | Recursos de Markdown |
| um comentário curto ao lado do parágrafo | nota lateral (`texto[^chave]`) | Recursos de Markdown |
| dado para consultar (parâmetros, comparação) | tabela | Recursos de Markdown |
| detalhe que a maioria pula | `<details>` com `<summary>` | Recursos de Markdown |
| o que um arquiteto marcaria lendo | caneta (34 tipos, marca-texto no máximo 3) | skill `caneta`, só no fim |

Não use dois recursos para a mesma ideia (a figura em passos e a frase dizendo a mesma coisa, a figura
parada e a em passos mostrando o mesmo quadro, ou a caneta marcando um aviso).

## Recursos de Markdown

Todos aparecem juntos em `src/amostra/recursos.md`, que o dev mostra em `/amostra/markdown/`.

- **Código** (Expressive Code): `title="Arquivo.java"`, linhas marcadas `{3-5}`, diff com
  `ins={4-7}` e `del={1-3}` (o Copiar leva só a versão final), `showLineNumbers` e `collapse={1-10}`.
- **Avisos:** citação que começa com o marcador, sozinho na primeira linha (`> [!DICA]`). Marcadores:
  `NOTA`, `DICA`, `IMPORTANTE`, `ATENCAO` (ou `ATENÇÃO`) e `CUIDADO`, ou os equivalentes em inglês.
  Texto depois do marcador troca o rótulo. Citação sem marcador continua citação.
- **Notas laterais:** nota de rodapé comum (`texto[^chave]`). Só parágrafos.
- `<details>` com `<summary>`, tabelas e KaTeX (`$…$`, `$$…$$`; `$` de texto escapado).
- **Imagens:** `alt` descritivo; abrem no visor ao clicar.
- **TL;DR** (D63): vem do frontmatter (`tldr`), não do texto; o dev mostra um em `/amostra/markdown/`.
- **Sumário:** automático com 3 ou mais seções `##`.
- **Caneta** (D48, D56, guia em `docs/marcacoes.md`, skill `caneta`): os 34 tipos de marcação em
  diretivas (`:marca[…]`, `:ondulado[…]`, `:::colchete`…) e nos atributos da cerca de código
  (`anotar`, `linhas`, `numeros`, `riscar`). Sem teto de total; o build recusa mais de 3 marca-textos,
  mais de 5 do mesmo tipo, duas no mesmo parágrafo e marcação em título. Catálogo no dev: `/amostra/caneta/`.
