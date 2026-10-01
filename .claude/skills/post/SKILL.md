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

Leia `DESIGN.md` (visual, desenhos e as regras de movimento; o detalhe de cada animação está em
`docs/movimento.md`) e `CLAUDE.md` (regras do projeto, URLs que não podem
quebrar). **O `DESIGN.md` vence qualquer ferramenta:** o "go all out", o redesign e a troca do
`DESIGN.md` que a skill `impeccable` sugere não valem aqui. Leia também um post existente em
`src/content/posts/` para carregar `.claude/rules/posts.md`, e o `docs/estilo-desenho.md`.

### 2. Plano, antes de mexer em qualquer arquivo

Apresente o plano e **espere a aprovação do Cesar**. O plano traz:

- **Livro:** um dos livros de `src/livros/livros.json` (Arquitetura de Software, Desenvolvimento de
  Software, Dados, IA, Segurança, DevOps, SRE, Carreira) **ou** uma série (`src/data/series.ts`). O
  subtítulo de cada livro diz o que cabe nele. Livro novo só se nenhum servir, pela seção "Livros
  novos" de `docs/capas/CAPAS.md` e com o OK do Cesar.
- **Tags:** de 2 a 4, do vocabulário existente, sem repetir o nome do livro. Tag nova só se servir a
  mais de um post, e **com o ícone dela** (D52): proponha o objeto que a representa (a metáfora, nunca
  o logotipo de uma marca) junto com a tag.
- **Série:** se entra numa, e em que posição. Post da série Java segue a skill `serie-java`.
- **Slug:** o nome do arquivo e a URL (`/posts/<slug>/`), curto, em pt-BR, sem acento. Adaptado de
  um post que já existiu no blog: o slug antigo, ou um redirecionamento (passo 3).
- **Inventário visual** (regras dos desenhos no passo 5):
  - Para **cada imagem existente**, diga se ela vai ser **redesenhada no estilo** (vira SVG da casa:
    figura, lousa ou animação), virar **print como evidência** (`Evidencia`, só se prova algo do texto
    e dá para garantir que está certo) ou **sair** por ser só decorativa; diga por quê.
  - A **capa** (sempre existe): o que ela vai mostrar e o **detalhe da capa viva** (o que se mexe no
    hover e com qual classe `mexe-*`).
  - Cada recurso escolhido pela tabela [Qual recurso para qual conteúdo](#qual-recurso-para-qual-conteúdo),
    com o trecho do texto que ele explica e o que o texto vai dizer para apresentá-lo: **figura**
    (diagrama ou gráfico colorido, parado ou com detalhe que se mexe; os tons de cada ator),
    **lousa** (de passos ou de comparação), **animação com play**, **frase em destaque** (rara),
    **print** (o que prova e de onde; tela com login, peça ao Cesar).
  - Os **ícones das ferramentas**: quais, onde no texto (primeira menção e mais adiante) e em quais
    desenhos, e se algum logo precisa ser desenhado (os que existem estão em `src/marcas/`).
  - Nem todo post tem todos os tipos: proponha só o que o assunto pede.
- **Caneta (D48):** as marcações **não entram no plano**. Elas são a última etapa (passo 9), pela
  skill `caneta`, depois que texto, desenhos e animações estiverem prontos e aprovados.
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
  - `codigo` (D52), **só quando o artigo tem código-fonte publicado** no repositório de exemplos do
    Cesar (`https://github.com/cesarschutz/blog-exemplos`, uma pasta por artigo, com o nome do slug):
    o endereço da pasta, com `https://`, por exemplo
    `codigo: https://github.com/cesarschutz/blog-exemplos/tree/main/jackson-filtros-mascarando-cartao`.
    Pergunte ao Cesar se o código do post vai para lá; se for, abra o link e confira que a pasta existe
    e é a do artigo antes de preencher. Com o campo, o topo do artigo mostra "Código deste artigo no
    GitHub" e o artigo ganha o sinal de código-fonte nas listas, nos cards, na gaveta, no anterior /
    próximo, no livro ampliado e na busca. Não repita o link no texto (a não ser que ele explique uma
    parte específica do código). Sem código publicado, o campo fica de fora;
  - `draft: true` até o Cesar aprovar.
- **Aviso de conteúdo feito com ajuda de IA:** sai sozinho no rodapé de todo artigo
  (`RodapeArtigo.astro`). Confira que ele aparece; não escreva outro no texto.
- **Espaço opcional para a apresentação:** não se escreve no post. Quando o Cesar trouxer o `.pptx`
  (skill `apresentacao`), os slides vão para `public/posts/<slug>/deck/` e a entrada para
  `src/data/decks.json`, e a seção entra sozinha antes de `## Fontes`.
- `$` em texto com escape (`US\$ 10`). Post com lousa, figura, animação, ícone de ferramenta ou print
  é `.mdx`.
- Recursos de Markdown (código, avisos, notas laterais, tabelas, KaTeX): veja
  [Recursos de Markdown](#recursos-de-markdown) e `/amostra/markdown/` no dev.

### 5. Desenhos

Siga a skill `desenho` (a capa e a capa viva), a skill `figura` (figuras coloridas, animação com
play, logos das ferramentas e print) e a skill `lousa` (lousas de passos e de comparação), no estilo
do `DESIGN.md` e do `docs/estilo-desenho.md`.

**Regras dos desenhos (D58):**
- **Todo desenho conversa com o texto.** O texto apresenta o desenho e diz o que olhar nele (o que é
  cada cor, a ordem dos números, o que o play mostra). Nada de imagem solta que o leitor não entende.
- **Nem todo post tem todos os tipos.** Entra o que o assunto pede e o que fica bom: um post pode ter
  só a capa e um gráfico; outro, uma lousa e uma animação.
- **Ícones das ferramentas sempre que couberem**, no texto e dentro dos desenhos (a xícara do Java na
  caixa do app), espalhados pelo post e não só no começo, sem poluir. No texto, o ícone leva à página
  mais específica (a do Java 21, não a do Java).
- **Print** só quando prova algo do texto e dá para garantir que está certo. Tela que pede login
  (console da AWS, painéis internos): peça ao Cesar, ele tira o print. Sempre com o `Evidencia`.

Técnica:
- **SVG desenhado à mão**, em coordenadas, com classes e variáveis CSS: sem cor fixa, sem `id` nem
  `defs` próprios, sem `<image>`. O **tremor** é o filtro SVG global (`feTurbulence` +
  `feDisplacementMap`, definido uma vez no layout) aplicado só no grupo dos traços. Hachura a 45°,
  linha fantasma para o que não acontece. Na **capa**, a cor do livro como única cor, no painel da
  categoria; nas **figuras**, um tom por ator (`tom-*`), o mesmo em todas as figuras do post.
  **Não use Rough.js** nem gerador de traço (D35).
- **Texto alternativo descritivo** em todo desenho: o que ele mostra e o que isso explica, não
  "ilustração do post". Na lousa, o `rotulo=`; no print, o `alt` diz o que a imagem prova.
- Antes de aceitar: `node scripts/desenho/validar.mjs <slug>` (capa, lousas, figuras e animações;
  `validar.mjs marcas` para os logos), `centrar.mjs` e o render claro e escuro da capa (`render.mjs`,
  com o dev no ar).
- **Revisão de todo desenho terminado, antes de mostrar ao Cesar (D59):** `node
  scripts/desenho/revisar.mjs <slug> --base <dev>` até sair limpo (ou com cada aviso explicado), e as
  fotos dele olhadas uma a uma pelo checklist da skill `figura` ("Validar, revisar e conferir"), que
  traz também a tabela dos bugs que já aconteceram. Vale para capa, figura, animação, lousa, logo e
  print, e de novo depois de cada ajuste.
- **Tag nova:** o ícone dela, pela seção "Tags" do `docs/capas/CAPAS.md` (o desenho em
  `scripts/desenho/tags.mjs`, gravado em `src/livros/tags/<slug>.svg` e conferido em `/amostra/tags/`
  ao lado dos outros, nos dois temas). Sem ele, o build quebra.

### 6. Animações

Quem manda no movimento (D58): a **capa** só mexe um detalhe no hover (`mexe-*`, skill `desenho`); a
**figura** fica parada ou tem detalhes que se mexem sozinhos sem mudar a imagem (skill `figura`); na
**lousa**, o leitor comanda o tempo (skill `lousa`); a **animação com play** muda a imagem e o leitor
só dá play e pausa (skill `figura`). Nenhum desenho é comandado pela rolagem da página (D46).

- **Só onde há fluxo** (sequência, passo a passo, antes e depois, o sistema funcionando). Post sem
  fluxo fica com a capa viva e, se ajudar, figuras paradas.
- **Sequência em que a ordem importa, ou comparação no tempo:** a `Lousa` (passos ou comparação). A
  frase em destaque (`FraseDestaque`) é rara.
- **O que a lousa não cobre** (uma fila enchendo, um gráfico se formando, um algoritmo rodando): a
  `Animacao`, com o SVG do quadro final e o `.ts` que monta a timeline GSAP (skill `figura`), de 6 a
  12 s por volta. Consulte as skills `gsap-core`, `gsap-timeline` e `gsap-performance`. O componente já
  carrega o GSAP sob demanda, abre tocando na tela (nunca com movimento reduzido) e mostra o quadro
  final sem JS; anime só `transform`, `opacity` e `stroke-dashoffset`, fora do grupo que treme.
- **Pouco texto trocando** nas lousas e nas animações: o que foi escrito não some; se mudou, risca e
  escreve o novo embaixo. Mais desenho que texto, num ritmo que dá para ler. Pouca animação também
  vale (às vezes só o ponto principal se mexe).
- **`LousaLoop` e `LousaTempo` não entram em post novo** (D58). Ao revisar um post antigo (modo
  Adaptar), a `LousaTempo` vira `Lousa` e a `LousaLoop` vira lousa de passos ou animação com play.
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
  cada lousa, o play inteiro (5 s no fim), o arrasto e os passos (mouse e clique); a animação abrindo
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

## Qual recurso para qual conteúdo

Escolha pelo papel do trecho, não para enfeitar. Post sem fluxo não tem animação; a maioria dos
trechos fica só no texto. Nem todo post tem todos os recursos, e todo desenho é apresentado no texto.

| O trecho é… | Recurso | Onde está |
|---|---|---|
| o assunto do post inteiro | a capa (sempre, uma por post), com o detalhe da capa viva | skill `desenho` |
| quem fala com quem, a arquitetura, os papéis | figura colorida (`Figura`), um tom por ator, selos se há ordem, detalhes que se mexem se ajudarem | skill `figura` |
| um número, uma curva, o que o leitor veria no painel | gráfico (`Figura`), com eixos, unidade, o limite e a anotação | skill `figura` |
| uma sequência em que a ordem importa | lousa de passos (`Lousa` com `passos`), com a lista numerada embaixo | skill `lousa` |
| antes e depois, ou "com e sem", ao longo do tempo | lousa de comparação (`Lousa` com `estados`), duas linhas | skill `lousa` |
| o sistema funcionando, algo que enche, esvazia ou se forma no tempo | animação com play (`Animacao`) | skill `figura` |
| a ferramenta de que o post fala | o ícone no texto (`Ferramenta`) e dentro dos desenhos (`data-marca`) | skill `figura` |
| a prova de um número ou de um comportamento (documentação oficial, erro, painel) | print (`Evidencia`); com login, o Cesar tira | skill `figura` |
| uma frase que resume o post e merece ser lida duas vezes (rara) | `FraseDestaque` | skill `lousa` |
| alerta, dica ou ressalva fora do fluxo do texto | aviso (`> [!DICA]`, `NOTA`, `IMPORTANTE`, `ATENCAO`, `CUIDADO`) | Recursos de Markdown |
| um comentário curto ao lado do parágrafo | nota lateral (`texto[^chave]`) | Recursos de Markdown |
| dado para consultar (parâmetros, comparação) | tabela | Recursos de Markdown |
| detalhe que a maioria pula | `<details>` com `<summary>` | Recursos de Markdown |
| o que um arquiteto marcaria lendo | caneta (34 tipos, marca-texto no máximo 3) | skill `caneta`, só no fim |

Não use dois recursos para a mesma ideia (a lousa e a frase dizendo a mesma coisa, a figura e a
animação mostrando o mesmo quadro, ou a caneta marcando um aviso).

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
- **Caneta** (D48, D56, guia em `docs/marcacoes.md`, skill `caneta`): os 34 tipos de marcação em
  diretivas (`:marca[…]`, `:ondulado[…]`, `:::colchete`…) e nos atributos da cerca de código
  (`anotar`, `linhas`, `numeros`, `riscar`). Sem teto de total; o build recusa mais de 3 marca-textos,
  mais de 5 do mesmo tipo, duas no mesmo parágrafo e marcação em título. Catálogo no dev: `/amostra/caneta/`.
