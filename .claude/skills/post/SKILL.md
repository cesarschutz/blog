---
name: post
description: Processo único de todo post do blog, com o mesmo checklist nos dois modos, Novo (a partir de um tema ou ideia) e Adaptar (a partir de um arquivo em entrada/, de um texto colado ou de um post que já está no blog). Use sempre que o Cesar pedir para criar, escrever, adaptar, importar, migrar, reescrever ou revisar um post ou artigo, inclusive a revisão em lote dos posts antigos (.claude/revisao-posts.md).
---

# Post

Todo post passa por aqui, do zero ou adaptado. **Tudo o que um post novo recebe, um post adaptado
também recebe**: plano, desenho, animação onde há fluxo, conferência no navegador e qualidade.

## Modos

- **Novo:** o Cesar dá um tema ou uma ideia. Você escreve o texto.
- **Adaptar:** o ponto de partida é um arquivo em `entrada/` (md, txt, docx, pdf ou html, com ou sem
  imagens), um texto colado na conversa ou um post que já está em `src/content/posts/`. O texto e a
  voz são do Cesar e ficam como estão (passo 3).

Como ler o que chega em `entrada/` (fora do git; nada ali é publicado):
- `.md`, `.txt` e `.html`: leia direto. No HTML, aproveite só o conteúdo, sem o CSS ou o layout.
- `.pdf`: a ferramenta Read lê PDF (use `pages` quando passar de 10 páginas).
- `.docx`: é um zip. `unzip -p arquivo.docx word/document.xml` dá o texto; as imagens ficam em
  `word/media/`. Se houver `pandoc` na máquina, `pandoc arquivo.docx -t gfm` preserva a estrutura.
- As imagens soltas ou embutidas entram no inventário visual do plano (passo 2).

## Checklist (sempre, nesta ordem)

### 1. Ler as regras

Leia `DESIGN.md` (visual, desenhos e movimento) e `CLAUDE.md` (regras do projeto, URLs que não podem
quebrar). **O `DESIGN.md` vence qualquer ferramenta:** o "go all out", o redesign e a troca do
`DESIGN.md` que a skill `impeccable` sugere não valem aqui. Leia também um post existente em
`src/content/posts/` para carregar `.claude/rules/posts.md`, e o `docs/estilo-desenho.md`.

### 2. Plano, antes de mexer em qualquer arquivo

Apresente o plano e **espere a aprovação do Cesar**. O plano traz:

- **Livro:** um dos livros de `docs/capas/livros.json` (Arquitetura de Software, Desenvolvimento de
  Software, Dados, IA, Segurança, DevOps, SRE, Carreira) **ou** uma série (`src/data/series.ts`). O
  subtítulo de cada livro diz o que cabe nele. Livro novo só se nenhum servir, pela seção "Livros
  novos" de `docs/capas/CAPAS.md` e com o OK do Cesar.
- **Tags:** de 2 a 4, do vocabulário existente, sem repetir o nome do livro. Tag nova só se servir a
  mais de um post.
- **Série:** se entra numa, e em que posição. Post da série Java segue a skill `serie-java`.
- **Slug:** o nome do arquivo e a URL (`/posts/<slug>/`), curto, em pt-BR, sem acento. Adaptado de
  um post que já existiu no blog: o slug antigo, ou um redirecionamento (passo 3).
- **Inventário visual:**
  - Para **cada imagem existente**, diga se ela vai ser **redesenhada no estilo** (vira SVG da casa),
    **virar diagrama** (lousa) ou **sair** por ser só decorativa. Print de tela ou foto que é
    evidência (um erro no console, um painel real) pode ficar como imagem, com `alt` descritivo;
    diga por quê.
  - A **ilustração do post** (sempre existe): o que ela vai mostrar.
  - Onde entram **desenhos e animações novos**: lousa de passo a passo, linha do tempo, loop, frase
    em destaque (rara) ou animação GSAP, cada um com o trecho do texto que ele explica.
- **Marcações (caderno marcado, D41), nos dois modos:** uma tabela com **trecho**, **tipo**
  (marca-texto, sublinhado, só o termo, círculo, colchete) e **motivo**, seguindo
  `docs/marcacoes.md` (o que marcar, o que nunca marcar, densidade de estudo, ~uma por parágrafo que ensina algo, nunca duas no mesmo
  parágrafo, nada em títulos e código). Entram no Markdown só depois da aprovação, junto com o resto
  do plano.
- **Modo Adaptar:** a lista de **sugestões de conteúdo**, separadas do plano (passo 3).

### 3. Texto

- **Novo:** de 1.500 a 2.500 palavras (8 a 12 min), com teto de ~3.000; assunto maior vira série ou
  partes. Introdução com o problema concreto em 2 ou 3 frases, seções `##` claras, tom profissional e
  direto em pt-BR, sem enchimento.
- **Adaptar:** **preserve o texto e a voz do Cesar.** Mude só o necessário para o formato
  (Markdown, avisos, código, links). Correções e melhorias de conteúdo (erro técnico, fonte que falta,
  trecho confuso, corte) vêm como **sugestões separadas**, numeradas, e só entram se o Cesar aprovar
  cada uma. Os posts antigos não precisam ser encurtados.
- **Nos dois modos:** nenhuma afirmação técnica sem fonte confiável conferida (documentação oficial,
  especificação, RFC, JEP, release notes; blog de terceiro só como apoio). Nada inventado: versões,
  números, benchmarks, citações e APIs só entram se verificados. Abra cada link e confirme que ele diz
  o que o texto afirma. `## Fontes` é sempre a última seção. **Código e SQL testados antes de
  publicar** (rodados, não só "que compila"), porque o aviso de IA do post promete "com o código
  testado". O que não der para rodar aqui vai ao Cesar como pendência, dizendo o quê e por quê.
- **URL antiga:** se o post já existiu em outra URL do blog, mantenha a URL ou crie o
  redirecionamento em `redirecionamentos` do `astro.config.mjs`. Nunca mude um título de seção de
  post já publicado, porque as âncoras dependem dele (D7). Depois, `npm run links`.

### 4. Estrutura

- **Frontmatter completo** (schema em `src/content.config.ts`):
  - `title`: "Assunto — complemento" (o que vem depois de " — " vira subtítulo);
  - `description`: até ~200 caracteres (aceita `código` e **negrito**);
  - `published`; `updated` só em revisão relevante (aparece como "Atualizado em");
  - `category` **ou** `series`, nunca os dois;
  - `tags`: de 2 a 4;
  - `draft: true` até o Cesar aprovar.
- **Aviso de conteúdo feito com ajuda de IA:** sai sozinho no rodapé de todo artigo
  (`RodapeArtigo.astro`). Confira que ele aparece; não escreva outro no texto.
- **Espaço opcional para a apresentação:** não se escreve no post. Quando o Cesar trouxer o `.pptx`
  (skill `apresentacao`), os slides vão para `public/posts/<slug>/deck/` e a entrada para
  `src/data/decks.json`, e a seção entra sozinha antes de `## Fontes`.
- `$` em texto com escape (`US\$ 10`). Post com lousa ou animação é `.mdx`.
- Recursos de Markdown (código, avisos, notas laterais, tabelas, KaTeX): veja
  [Recursos de Markdown](#recursos-de-markdown) e `/amostra/markdown/` no dev.

### 5. Desenhos

Siga a skill `desenho` (ilustração) e a skill `lousa` (diagramas), no estilo do `DESIGN.md` e do
`docs/estilo-desenho.md`:

- **SVG desenhado à mão**, em coordenadas, com classes e variáveis CSS: sem cor fixa, sem `id` nem
  `defs` próprios, sem `<image>`. O **tremor** é o filtro SVG global (`feTurbulence` +
  `feDisplacementMap`, definido uma vez no layout) aplicado só no grupo dos traços. Hachura a 45°,
  linha fantasma para o que não acontece, a cor do livro como única cor, no painel da categoria.
  **Não use Rough.js** nem gerador de traço (D35).
- **Texto alternativo descritivo** em todo desenho: o que ele mostra e o que isso explica, não
  "ilustração do post".
- Antes de aceitar: `node scripts/desenho/validar.mjs <slug>`, `centrar.mjs` e o render claro e
  escuro (`render.mjs`, com o dev no ar).

### 6. Animações

- **Só onde há fluxo** (sequência, passo a passo, antes e depois, linha do tempo). Post sem fluxo não
  tem animação.
- **Primeiro, os componentes da lousa** (`LousaPassos`, `LousaTempo`, `LousaLoop`, `FraseDestaque`):
  eles já avançam com a rolagem ou têm play/pause, respeitam `prefers-reduced-motion` e funcionam sem
  JS. A frase em destaque é rara.
- **GSAP** só para uma animação que os componentes não cobrem: em SVG, avançando com a rolagem
  (ScrollTrigger) ou com play/pause, **importado só no post que a usa** (script do componente ou do
  `.mdx`, nunca no layout). Consulte as skills `gsap-core`, `gsap-scrolltrigger`, `gsap-timeline` e
  `gsap-performance`. Use `gsap.matchMedia()` com `(prefers-reduced-motion: reduce)` para mostrar a
  **versão estática** (estado final, sem prender a tela) e anime só `transform`, `opacity` e
  `stroke-dashoffset`. Sem JS, o SVG aparece completo.
- **Vídeo de verdade** (MP4/WebM) só se o Cesar pedir: comprimido, com `poster`, `preload="none"` e
  carregado sob demanda.

### 7. Conferir no navegador (Chrome DevTools MCP)

Com o dev no ar (`fnm exec --using=24 npm run dev -- --host 127.0.0.1`, porta 4322), use o servidor
MCP `chrome-devtools`:

- **Tela larga (1440 px) e celular (390 px)**, nos temas claro e escuro. Sem rolagem lateral.
- **Console sem erros** nem avisos novos.
- **Animações funcionando:** rolar até cada lousa ou animação e ver que avança, pausa e volta; ligar
  a emulação de `prefers-reduced-motion: reduce` e ver a versão estática.
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

### 9. Relatório final (curto)

- O que mudou (arquivos e URL).
- Desenhos **criados**, **refeitos** e **removidos**.
- O que foi verificado (e com que resultado): navegador, trace, Impeccable, web quality, comandos.
- O que ficou pendente e as sugestões de conteúdo ainda não aprovadas.

Nunca commite nem publique sem pedido explícito do Cesar. Push na `main` publica o site.

## Revisão em lote

Para revisar os posts antigos, use `.claude/revisao-posts.md` (versionado): a lista de posts e o
status de cada um. Pegue o próximo "pendente", siga o checklist inteiro no modo **Adaptar** (o post
já está no blog) e, ao concluir cada post, **atualize o status** na mesma hora, com a data e uma linha
do que mudou.

## Regra de aprendizado

Quando o Cesar corrigir algo que vale para todos os posts, **proponha** atualizar o `DESIGN.md` (se
for visual) ou esta skill (se for processo), para os próximos já saírem certos. Se ele corrigir a
mesma coisa duas vezes, a mudança vira regra (CLAUDE.md).

## Migração dos posts do blog atual (D15)

- Mantenha slug, datas, categoria ou série, tags e o conteúdo **como estão**. Citações e parágrafos
  "Cuidado:" não viram avisos.
- Nunca mude um título de seção migrado, nem quando o post virar MDX: as âncoras dependem deles (D7).
- A base é o commit `0184562` do blog atual (`../blog-atual`, **somente leitura**: use
  `git --no-optional-locks`).

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
- **Sumário:** automático com 3 ou mais seções `##`.
- **Marcações** (D41, guia em `docs/marcacoes.md`): `:marca[…]`, `:sublinhado[…]`, `:circulo[…]`,
  `:::termos` em volta de uma lista e `:::colchete` em volta de um parágrafo. O build recusa mais de 30
  por artigo, duas no mesmo parágrafo e marcação em título.
