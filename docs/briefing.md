# Briefing — novo blog de Cesar Schutz

Este documento é a fonte das decisões de produto e design do novo blog. Ele foi fechado
com o Cesar depois de várias rodadas de protótipo. Não reabra decisões marcadas como
**decidido** sem perguntar; tudo o que estiver marcado como **a decidir por você** é seu
para propor, justificar e registrar em `docs/decisoes.md`.

Referências visuais e de comportamento, abertas no navegador (arquivos locais, sem build):

- `docs/referencias/prototipo-home-e-artigo.html`: home (estante, destaque, lista e cards,
  tags, busca) e página de artigo completa (abas no topo alternam as duas páginas)
- `docs/referencias/prototipo-lousas.html`: as lousas dos diagramas. **A escolhida é a aba
  "Invertida, canetinha"** (ver seção 7)
- `docs/referencias/prototipo-estilo-desenho.html`: estilo das ilustrações. **O escolhido é
  a aba "A + C"** (ver seção 6)
- `docs/referencias/prototipo-mais-vida.html`: ajuste visual sobre o site pronto. **A escolhida
  é a variação "A. Folhas claras"** (ver seção 4, aprovada em 24/09/2026)

Os protótipos mostram aparência e comportamento aprovados. São referência, não código para
copiar: reescreva com a arquitetura certa, acessível e performática. Onde este briefing e um
protótipo divergirem, vale o briefing.

---

## 1. O que é o blog

- Blog técnico pessoal de **Cesar Schutz**, arquiteto de soluções. Idioma **pt-BR**.
  Endereço: `https://blog.cesarschutz.com.br` (GitHub Pages do repositório `cesarschutz/blog`,
  D34); o blog antigo continua em `https://cesarschutz.com.br`.
- É **só um blog**: artigos, categorias, tags, séries, busca e RSS. Sai tudo o que existe
  hoje além disso: página de projetos, card de identidade com números, ícones animados. Voltaram na
  D33, a pedido do Cesar: a **foto** do autor (na assinatura do topo de cada artigo) e as frases de
  autores num post-it, que saíram de novo na D39. Não há página Sobre por enquanto (D33: o Cesar
  escreve depois); `/about/` leva à home.
- Os textos são escritos com apoio de IA e revisados pelo Cesar. Isso aparece no fim de cada
  post (seção 5.3).
- Aparência: editorial, de livro técnico bem diagramado. Não pode parecer feito por IA:
  nada de fontes genéricas, gradientes decorativos, cards com sombra genérica em tudo,
  animação de entrada em cada seção, rótulos em caixa alta, emojis.

## 2. Pontos de partida

- **Blog atual** (somente leitura): `https://github.com/cesarschutz/cesarschutz.github.io`.
  Clone em uma pasta irmã (`../blog-atual`) e **nunca** escreva nela. Leia o `CLAUDE.md`
  de lá antes de começar: ele tem regras valiosas que continuam valendo (fluxo de post,
  revisão contra fontes, série do Java, apresentações do NotebookLM, armadilhas do
  ambiente). Porte o que continuar fazendo sentido; não copie o que este briefing muda.
- **Pasta do projeto**: esta pasta, **fora do iCloud**. O blog atual documenta que
  `~/Documents` sincronizado pelo iCloud gera cópias "arquivo 2", ressuscita arquivos e
  deixa `node_modules` lento. Se perceber que está dentro de uma pasta sincronizada, avise
  antes de instalar dependências.
- **URLs existentes não podem quebrar**: `/posts/<slug>/`, `/archive/`, `/categories/<nome>/`,
  `/tags/<nome>/`, `/series/`, `/java/` (hoje redireciona para `/series/java/`, D32), `/rss.xml`, e os redirecionamentos da série Java
  (`/posts/java-NN/` → `/posts/java-<LTS>/#java-NN`). Páginas que deixam de existir
  redirecionam: `/about/` → `/` (D33), `/projects/` → `/`.

## 3. Stack e desempenho

**Decidido**
- Site estático, publicado no GitHub Pages por GitHub Actions, sem backend.
- Fontes servidas pelo próprio site (`@fontsource`), nunca Google Fonts em produção.
- JavaScript só onde há interação (estante, busca, lousas, apresentação, alternância
  lista/cards, tema). Página de artigo sem esses componentes deve funcionar sem JS.
- Respeitar `prefers-reduced-motion` em toda animação: com ele ligado, tudo aparece no
  estado final, sem prender a tela.

**A decidir por você** (proponha na Fase 0 e registre em `docs/decisoes.md`)
- Framework. O blog atual usa Astro 7 com Expressive Code e MDX; trocar só se houver ganho
  real. Critérios: desempenho, componentes interativos dentro do Markdown, blocos de código
  com diff, facilidade de manutenção pelo próprio Claude Code.
- Busca. Requisitos: ignora acentos; frase exata primeiro, depois todas as palavras;
  relevância título > tags > descrição > corpo; aceita `#tag`; link compartilhável `/?q=termo`;
  atalhos ⌘K, Ctrl+K e `/`; o índice só é baixado quando a busca abre; continua rápida com
  centenas de posts. Compare o índice próprio do blog atual com uma alternativa como o
  Pagefind (índice em fragmentos): meça com os 26 posts reais e com uns 500 posts sintéticos
  (tamanho baixado e tempo até o primeiro resultado) e escolha com números. Resultado sem o termo
  sai; sem nenhum exato, mostra só os parecidos, com "Nada exato para …" (D37).
- Metas: Lighthouse ≥ 95 em desempenho, acessibilidade, boas práticas e SEO na home e num
  artigo, no celular.

## 4. Sistema visual (decidido)

Desde 24/09/2026 vale a variação **"A. Folhas claras"** de `docs/referencias/prototipo-mais-vida.html`
(D26): o conteúdo em folhas claras sobre um fundo quente, azul-tinta em tudo que é clicável, uma
fonte sem serifa na interface e os desenhos em painéis tingidos pela categoria. É uma mudança só da
camada visual: estrutura, conteúdo, rotas e comportamento seguem as seções 5 a 7.

### 4.1 Tipografia
- Títulos: **Besley** 700. O nome na abertura da home e a marca do cabeçalho continuam em 800.
  Texto: **Literata** (com eixo `opsz`). Código: **JetBrains Mono**.
- Interface: **IBM Plex Sans** (400, 500 e 600), servida pelo próprio site: menu, busca, datas,
  tempo de leitura, categoria, tags, botões, trilha, sumário, legendas e o aviso curto de IA da home.
- Livros (capas, lombadas e os títulos Séries e Categorias da lateral, D30): **Bitter** e
  **Newsreader** itálico (com o eixo de tamanho óptico, D32), servidas pelo próprio site, pela regra de `docs/capas/CAPAS.md`.
- Artigo: corpo 18,5px, entrelinha 1,72, coluna de texto com no máximo 720px, uns 72 caracteres
  (D39; era 760px desde a D33 e 680px antes). Código, tabelas, diagramas, lousas e a apresentação
  usam a largura toda do cartão (até 1000px); no celular, o corpo não fica num cartão.
  Números em estilo antigo (`oldstyle-nums`) no texto corrido.
- Sem fonte de "letra de mão" em lugar nenhum, inclusive nos desenhos e nas lousas.

### 4.2 Cores (tokens em variáveis CSS)
| Token | Claro | Escuro |
|---|---|---|
| `--paper` (fundo) | `#F1F0EB` | `#111618` |
| `--paper-hi` (superfície das folhas) | `#FFFFFE` | `#1A2124` |
| `--well` (código, cabeçalho de tabela) | `#F5F5F4` | `#21282A` |
| `--ink` | `#1A2124` | `#E7E9E4` |
| `--ink-2` | `#57605E` | `#A9B0AC` |
| `--ink-3` | `#868D8A` | `#7F8884` |
| `--rule` (borda) | `#E2E0D8` | `#2A3336` |
| `--acento` (azul-tinta, o que é clicável) | `#2549B8` | `#93AEFF` |
| `--sobre-acento` (texto sobre o azul) | `#FFFFFF` | `#0D1530` |
| aviso Nota | `#3F5878` | `#9DB3D4` |
| aviso Dica / linha adicionada | `#2F6B4F` | `#86C3A2` |
| aviso Importante | `#654262` | `#C7A3C2` |
| aviso Atenção | `#9A6B12` | `#E0B560` |
| aviso Cuidado / linha removida | `#A3432A` | `#E7957C` |

- `--well` não veio do protótipo: é a superfície com 4% de tinta, para código em linha, cabeçalho
  de tabela e o fundo dos blocos de código, que ficam sobre a folha.
- Tema: o site **sempre abre no tema do sistema** (D33). O botão do cabeçalho alterna direto entre
  claro e escuro (lua ou sol, sem menu, D39), e a escolha vale até fechar o site (`sessionStorage`),
  com script anti-piscada no `<head>`. Trocar o tema só muda as cores: nenhum tamanho depende do
  tema, e a página não sai do lugar. A troca se espalha em círculo a partir do botão (D42).
- **Categorias = livros de uma coleção numerada, no estilo "edição de estudo"; séries = revistas
  técnicas** (D30, D32). A regra visual de capas, lombadas, estante, livros e séries novos está em
  **`docs/capas/CAPAS.md`**, com as imagens de referência em `docs/capas/referencia/`. Os dados de
  cada livro e de cada série (volume, título, frase, subtítulo, cor, medidas; na série, as edições e
  a tarja) ficam em `docs/capas/livros.json` e todas as cores saem de `docs/capas/cores.js` (a cor
  do livro, a tinta sobre ela, o destaque sobre o papel, o papel e a tinta do papel). A cor principal também é a da categoria no site: chip, barra de leitura e palco dos
  desenhos. No tema escuro, o destaque dos desenhos usa a cor misturada com 42% de branco.

| Vol. | Categoria | Cor | Instrumento na capa |
|---|---|---|---|
| 01 | Arquitetura de Software | `#2d4b46` | arco e pedra angular |
| 02 | Desenvolvimento de Software | `#7a4430` | paquímetro |
| 03 | Dados | `#5f4662` | gaveta de fichas |
| 04 | IA | `#6e2f45` | autômato escritor |
| 05 | Segurança | `#606a37` | carta lacrada e sinete |
| 06 | DevOps | `#465976` | guindaste de porto |
| 07 | SRE | `#c4a050` | farol |
| 08 | Carreira | `#9a7650` | compasso |

Categoria nova = livro novo, pela seção "Livros novos" do `CAPAS.md` (desenho, ícone, volume). Todo
livro aparece na estante e na lateral, mesmo sem artigos; o número de artigos, não.

- **Capa de categoria** (D32): em cima, o bloco na cor do livro com "VOLUME 0N", "CESAR SCHUTZ" e o
  título grande; embaixo, o papel claro só com a frase do livro e o desenho grande, no destaque.
- **Série "Atualizações do Java"** (D32): revista técnica, cada post uma edição. Papel com faixa no
  destaque `#c24d1c`, "Atualizações" e *do Java* em itálico, linha de dados (série, autor e o total
  de edições contado pelos posts), o "25" da última edição com a lista das edições ao lado, a tarja
  escura do **guia de atualização** e, no pé, a xícara e o subtítulo. Série nova segue o mesmo
  formato, com a própria cor de destaque, emblema, número de capa, edições e tarja.

### 4.3 Folhas, painéis e interação
- **Folhas**: o conteúdo principal fica em superfícies (`--paper-hi`) com borda fina (`--rule`),
  raio de 14px e sombra leve sobre o fundo: a abertura da home (texto e estante, com a gaveta do
  livro aberto), o destaque, a lista de artigos (uma folha só), cada card, o topo do artigo
  (desenho e título), o corpo do artigo e o sumário. Painéis e caixas dentro delas: raio de 10px.
  As páginas de apoio seguem a mesma linguagem (listas e cards em folhas).
- **Sombra das folhas**: no claro, `0 1px 2px rgba(40,38,30,.04), 0 10px 28px -18px
  rgba(40,38,30,.28)`; ao passar o mouse, `0 2px 4px rgba(40,38,30,.05), 0 18px 36px -18px
  rgba(40,38,30,.35)`. No escuro, `0 12px 30px -18px rgba(0,0,0,.8)`; ao passar o mouse,
  `0 18px 36px -16px rgba(0,0,0,.9)`.
- **Azul-tinta** (`--acento`) em tudo que é clicável: item ativo do menu, links no texto, botão
  "Ler artigo" (pílula com seta, texto em `--sobre-acento`), seletor Lista/Cards, item atual do
  sumário (texto e barra), título do card ou da linha ao passar o mouse, foco. As cores das
  categorias continuam nos livros, nos chips e nos desenhos.
- **Desenhos com palco**: cada ilustração fica num painel tingido pela cor da categoria
  (`color-mix` da cor com 11% sobre a superfície no claro, 20% no escuro). As áreas preenchidas do
  desenho usam a mesma cor do painel, o traço fica um pouco mais grosso (×1,2) e o preenchimento de
  destaque, mais forte (78% da cor). Valores em `docs/estilo-desenho.md`.
- **Marca** (D33): o livro "cs" (capa do Volume 01 com a fita laranja da série), "Cesar Schutz" e
  "blog" em itálico, no cabeçalho, no rodapé, grande na abertura da home e no ícone do navegador.
- **Acabamento**: busca como campo (ícone, "Buscar" e ⌘K), GitHub e LinkedIn só com os ícones e o
  botão de tema (claro ou escuro, D39; o som dos livros saiu) no cabeçalho;
  destaque com a descrição do post, tags em pílulas e "Ler artigo"; cards que sobem 4px ao passar o
  mouse (parados com `prefers-reduced-motion`); linhas da lista com fundo leve ao passar o mouse;
  chip de categoria com quadradinho da cor e nome tingido (no claro, a cor com 34% de tinta, para o
  dourado do SRE passar de 4,5:1; no escuro, com 50% de branco).
- **Artigo**: o corpo é lido sobre a folha; em telas ≥ 1300px, o sumário fica à esquerda, numa
  folha própria e fixa, com a barra de quanto já foi lido embaixo ("19% lido").
- **Largura**: a mesma do blog atual, conteúdo de até 1320px e margem lateral de 16 a 32px.

## 5. Páginas

### 5.1 Home
Referência: aba "Home" do protótipo.
- **Cabeçalho** (D31): **fixo no alto** enquanto a página rola, com o fundo da página levemente
  translúcido e um fio embaixo que aparece depois de rolar. A marca à esquerda (D33); à direita
  **Artigos, Categorias, Séries e Tags**, a busca como campo (com ⌘K; só o ícone até 1100px), os ícones
  do GitHub e do LinkedIn e o botão de tema (§4.3, D39). O RSS saiu do menu (fica no painel lateral e no
  rodapé). Até 860px, duas linhas: marca, busca, perfis (somem abaixo de 520px) e tema numa; o
  menu na outra. A altura dele (`--altura-topo`) é descontada pelas âncoras, pelo sumário do
  artigo, pelo painel lateral e pelas lousas fixas. Até 860px, ele some ao rolar para baixo e volta
  ao rolar para cima (D38).
- **Abertura** (D33): a identidade (a marca e a apresentação do blog atual, "Publico aqui o que ando
  estudando — …") e a **estante**. A partir de 1360px, identidade à esquerda e estante à direita;
  até 1359px, a estante desce para baixo do texto, no centro; até 640px, a marca grande sai (fica a
  do cabeçalho; ela continua como o h1 para leitor de tela), para a abertura ficar mais curta (D38).
  A linha sobre IA saiu da abertura (fica no fim de cada artigo). O post-it das frases de autores
  saiu do blog (D39).
- **Estante** (D30, pela regra de `docs/capas/CAPAS.md`):
  - Um livro por categoria, na ordem dos volumes, com as alturas e larguras de `livros.json`. A
    lombada tem o ícone do livro (girado) no bloco de cor de cima e, no papel de baixo, o título na
    vertical e o número de artigos, no destaque (D32); a divisão forma uma linha contínua
    atravessando a estante. Sem artigos, o número não aparece.
  - Depois das categorias, um **aparador de livros** e as **séries**, finas como revistas: papel com
    a faixa no destaque no topo, o emblema, o título com o complemento em itálico e o número.
  - O último livro da coleção fica inclinado 6°, apoiado no alto do aparador, **parado** (D35: ele
    tombava na primeira visita da sessão, e isso saiu porque na home nenhum livro cai).
  - Ao passar o mouse, a lombada sobe alguns pixels.
  - Na home, a lombada abre a gaveta; a capa aberta dentro dela leva à página do livro, e a lupa
    amplia (D38). Nas outras páginas, a lombada leva ao livro.
  - **Abrir um livro** (D40, "tirar da estante e abrir"): o livro sobe e o lugar dele fica
    escurecido; um livro 3D sai da posição da lombada e vem para a gaveta, abaixo da estante,
    girando até 18°; a capa abre e o livro desliza para centralizar as duas páginas: no verso da
    capa, a assinatura do blog; na página da direita, os **artigos mais recentes** (6 por página;
    com mais, "Próximas ▸" vira a folha e mostra os seguintes, e "◂ Anteriores" volta), com
    "Ver todos os N artigos" (o arquivo filtrado pelo livro) e "Ver o livro". **Guardar o livro**,
    Esc ou um clique no lugar escurecido fazem o caminho de volta, 1,5× mais rápido; **trocar de
    livro** fecha o atual antes de abrir o próximo. No celular, o livro aberto cabe na largura da
    tela. O sumário com filtro da gaveta antiga saiu (a lista inteira fica na página do livro).
  - No celular, as lombadas diminuem para caber todas na largura.
- **Destaque** (só na primeira página): o post mais recente, com a ilustração (o painel acompanha a
  altura do texto; até 960px, vai para cima), categoria, data e tempo de leitura com os ícones, o
  **título inteiro**, a descrição e as tags (D33). O post em destaque **não se repete** na lista abaixo.
- **Artigos recentes**: alternância **Lista / Cards** (guardada no navegador; a troca esmaece uma
  forma e traz a outra, D42), no formato do blog
  atual (D27). Em cima, categoria, data e tempo de leitura com relógio; o **título inteiro**, grande;
  a **descrição completa** (fonte da interface); até 4 tags em `#tag` (fonte de código), que levam à
  página da tag (D38). O item inteiro é clicável.
  Lista: miniatura quadrada da ilustração à direita (104 a 148px; 84px no celular, sem as tags).
  Cards: grade de até 3 colunas, com a ilustração em 3:2 no topo e as tags no pé do card.
  Mesmo formato de lista nas páginas de categoria, tag e série; o arquivo por ano continua compacto.
- **Paginação**: 12 artigos por página, como no blog atual: `/`, `/2/`, `/3/`… Embaixo da lista,
  "Anteriores", os números (a atual em azul-tinta) e "Mais artigos"; no celular, só os dois botões.
  Da página 2 em diante, só a lista ("Artigos — página N", em h1) e a paginação. O destaque nunca
  entra na lista.
- **Painel lateral** (D28), à esquerda da lista em telas ≥ 1100px e depois dela nas menores, em todas
  as páginas da home, no lugar da antiga nuvem de tags no pé. Inspirado na barra lateral do blog
  atual, numa folha que **fica parada enquanto a lista rola** (como no antigo; em tela baixa, rola por
  dentro):
  - **Séries** e **Categorias** como **pilhas de livros deitados** (D30, D32, `CAPAS.md`): a mesma
    lombada da estante, girada 90° (D39), com o ícone na ponta esquerda, o título e o número; o
    deslocamento de `livros.json`; o volume 1 embaixo; todos retos; a pilha sobre uma prateleira da cor da estante. A pilha escala com a largura da lateral.
    Ao passar o mouse, o livro sai 14px da pilha e volta com um balanço; o livro da página atual é puxado na chegada e fica 10px para fora, escurecido (D40; sem movimento com `prefers-reduced-motion`).
  - **Tags**: as 10 mais usadas em pílulas (o clique leva à página da tag, D33) e "Todas as
    tags →".
  - "Assinar via RSS" no pé.
  - Cada livro de categoria leva à página do livro (§5.2, D29), com a transição do livro. Os chips de
    categoria da lista, dos cards e do destaque também levam à página da categoria (D33); na home, só
    as lombadas da estante abrem a gaveta.
    O de série ainda leva à página que já existia; as telas de série e de tag serão pensadas depois.
- Sem animação de entrada nas seções.

### 5.2 Páginas de apoio
Todos os artigos (`/archive/`), categoria, tag, série (ordem de leitura) e `/series/java/`
(página especial da série; porte do blog atual; `/java/` redireciona, D32). Mesma linguagem visual, sem inventar
componentes novos.

**Todos os artigos** e **tag** (D33): no formato da lista da home, com Lista / Cards; o arquivo
agrupado por ano, sem a coluna de datas. No topo, numa folha, uma **estante de filtro** com os livros
que têm artigos na página (e o número deles): clicar num livro mostra só os artigos dele
(`?livro=<slug>` na URL). Para não confundir com a lombada que leva ao livro (D38): o rótulo "Filtrar
por livro" acima da estante, a lombada escolhida um pouco acima da prateleira e as outras
escurecidas (sem contorno azul, D39), "Limpar filtro" e as
lombadas como botões com `aria-pressed`; sem JavaScript, a estante de filtro não aparece. A tag
mostra também as tags que aparecem junto com ela.

**Categorias** (`/categories/`, D31) e **Séries** (`/series/`, D31): os livros lado a lado, grandes,
abertos quase de frente como o livro do topo da página de cada um, cada um num cartão (folha) com o
livro num painel tingido pela cor dele, "Volume 0N" (ou "Série"), o nome, o subtítulo e a contagem.
Ao passar o mouse, o cartão sobe, a capa acompanha o mouse com uma luz suave e entreabre, mostrando
as páginas (D40; no toque, o primeiro toque entreabre e o segundo abre); ao clicar, o livro voa até o
topo da página dele. Em Categorias, os oito volumes. Em Séries, enquanto houver uma série só, um
**destaque largo** (D39): a revista, o nome, a descrição, as edições em ordem de leitura (número,
título e ano) e "Começar pelo guia" (a primeira edição), com "Ver a série".

**Tags** (`/tags/`, D39): cada tag numa folha, das mais usadas às menos usadas, com a contagem, os
quadradinhos dos livros em que ela aparece e os três artigos mais recentes, com "Todos os N".

**Série "Atualizações do Java"** (`/series/java/`, D31, D32): como a página de categoria, com o painel lateral à
esquerda (o livro da série fora da pilha) e o livro da série aberto no topo, com os números das LTS;
depois, o guia e as versões, como antes.

**Categoria** (`/categories/<Nome>/`, D29):
- O painel lateral da home à esquerda (parado enquanto a página rola; depois do conteúdo no celular).
  O livro desta categoria continua na pilha, escurecido (D39).
- Todo livro tem página, mesmo sem artigos ("Este livro ainda não tem artigos.").
- No topo, uma folha com o **livro aberto** num painel tingido pela cor da categoria: o mesmo livro
  3D da gaveta, quase de frente (D39), com a capa da coleção (D30). Ao lado: "Categorias" (trilha), o
  nome grande (Besley 800, do tamanho que couber numa linha), o subtítulo do livro, a contagem com o
  quadradinho da cor e as 6 tags mais usadas na categoria.
- Embaixo, "Artigos" com a contagem e a alternância Lista / Cards, no mesmo formato da home (D27),
  sem paginação.
- **Transição**: ao clicar num livro do painel, ele sai da pilha e vira o livro em pé do topo da
  página nova (View Transitions entre documentos). Entre duas categorias, o livro antigo volta para
  a pilha enquanto o novo sobe. Só o livro se move; o resto da página troca na hora. Sem suporte do
  navegador, ou com `prefers-reduced-motion`, a página só abre.

### 5.3 Artigo
Referência: aba "Artigo" do protótipo.
- **Topo**: a ilustração vem **antes do título** (recorte largo no computador, 3:2 no celular),
  depois trilha "Artigos › Categoria" (ou "Séries › Nome"), o **título inteiro** e a **descrição**,
  como no blog atual (D33), e a assinatura: foto e nome do autor, data com o calendário,
  "Atualizado em" quando houver e o tempo de leitura com o relógio. A marca d'água do livro saiu do
  topo (D39): fica no fim do artigo, atrás de "anterior / próximo", e no topo das páginas de
  categoria e de série, grande e bem suave, cortada pela borda da folha.
- **Título**: aparece inteiro, como no `title` do frontmatter, no topo, nas listas, nos cards e na
  navegação. A divisão em título e subtítulo pelo " — " fica só na imagem de compartilhamento (D33).
- **Barra de progresso de leitura**: faixa de 3px no topo, na cor da categoria.
- **Sumário**: em telas ≥ 1300px, à esquerda do texto, numa folha própria e fixa; recolhível no
  início do texto nas menores. Só aparece com 3 ou mais seções. No lateral (D33), um trilho: um ponto
  em cada seção, sem número (D36; o "3. " do título sai do nome, nas duas variantes), o fio das lidas, o ponto atual e a barra de porcentagem na cor do livro do post (D39), as
  subseções da atual abertas, e a atual sempre à vista. Embaixo, a barra fina com "19% lido" e o tempo
  que falta (em fonte de código), que soma à barra do topo; só com JS. Embaixo da folha do sumário, o **"Do livro" compacto** (D39):
  a capa pequena, o nome e "Ver o livro"; com ele, o cartão do fim do artigo some no desktop.
- **Notas laterais**: notas de rodapé do Markdown viram notas na margem direita da folha do corpo
  quando ela tem espaço (a folha, e não a tela, decide, D33) e abrem no lugar, ao tocar no número,
  nas outras.
- **Avisos** (inspirados nos admonitions da documentação do Spring), cinco tipos com ícone
  de traço e cor própria, fundo levemente tingido, borda fina (nada de borda grossa à
  esquerda): **Nota, Dica, Importante, Atenção, Cuidado**. Sintaxe no Markdown estilo
  GitHub (`> [!NOTA]`, `> [!DICA]`, `> [!IMPORTANTE]`, `> [!ATENCAO]`, `> [!CUIDADO]`,
  aceitando também os nomes em inglês). Uso com moderação: aviso é conteúdo, não enfeite.
- **Código**: como o blog atual (Expressive Code): nome do arquivo no topo, linguagem, botão
  Copiar, linhas destacadas, números de linha opcionais, seções recolhíveis e **diff**
  (`ins`/`del`) com fundo tingido e `+`/`−` na margem. "Copiar" leva a versão final, sem as
  linhas removidas. Tema de cores feito com os tokens do blog nos dois temas.
- **Lousas** (seção 7) sempre que houver fluxo ou sequência a explicar.
- **Apresentação** (quando existir): seção logo antes de "Fontes", com o título
  "Apresentação" e sem frase de apoio. Carrossel com setas e contador, tela cheia (galeria
  com ←/→) e botão **Baixar PDF**.
- **Fontes**: sempre a última seção.
- **Rodapé do post**, nesta ordem: tags; "Compartilhar" (copiar link, LinkedIn, WhatsApp e o
  compartilhar nativo quando existir; no celular, com o do sistema, só ele, D38); **aviso sobre IA** num bloco com o ícone de
  nota (era o de atenção até a D37, que fechava a leitura como um alarme), com o texto atual:
  "Artigo escrito com apoio de IA, revisado pelo autor, com o código testado. Ainda assim pode
  conter imprecisões: confirme nas fontes citadas e na documentação oficial antes de aplicar."
  (sem o "Saiba mais" desde a D33); o cartão **"Do livro"** (o livro 3D da categoria ou a revista da
  série, que leva à página do livro; no desktop com o sumário lateral, ele fica embaixo do sumário,
  D39); depois a navegação **Artigo anterior / Próximo artigo** (ou anterior/próxima dentro da
  série), com o título inteiro. Sem bloco de "artigos relacionados".
- Botão "voltar ao topo" depois de uma tela de rolagem. Comentários (Giscus) e estatísticas
  (GoatCounter) continuam opcionais e desligados.
- Imagens do corpo abrem num visor sobre a página escurecida (D33), com fechar, setas e contador na
  apresentação. Tabelas rolam na horizontal no celular.
  Matemática com KaTeX, carregado só em posts que usam.

### 5.4 SEO e distribuição
JSON-LD (`BlogPosting` nos posts, `WebSite` na home), sitemap com `lastmod`, RSS com texto
completo dos posts recentes, canonical, Open Graph e Twitter. **Imagem de compartilhamento**
PNG 1200×630 gerada no build: título e subtítulo à esquerda, ilustração do post à direita (no
painel tingido da §4.3), nome do blog e categoria.

## 6. Ilustrações dos posts (decidido: estilo "A + C")

Cada post tem **uma ilustração** (SVG), desenhada sobre algo concreto do artigo (no exemplo
de idempotência: a chave com a etiqueta `abc-123` sobre o comprovante, com a segunda cobrança
em linha fantasma). Todos os lugares usam **recortes da mesma ilustração**; não existem mais
os quatro arquivos por post do blog atual.

A **regra de estilo** fica num arquivo separado, `docs/estilo-desenho.md`, para o Cesar poder
trocar o estilo sem mexer na regra do que desenhar. Conteúdo inicial desse arquivo:

- Traço de caneta com leve tremor de mão (filtro SVG global de deslocamento), terminais
  arredondados, desenho **de frente** (nada de perspectiva isométrica).
- **Hachura** a 45° para sombras e volume; **linha fantasma** (traço e ponto) para o que não
  acontece, alternativas e estados anteriores.
- **Uma cor só**, a da categoria do post, aplicada como preenchimento levemente fora do
  registro (deslocado alguns pixels do contorno). O resto em tinta.
- **Sem fundo próprio**: o SVG não pinta fundo; as áreas preenchidas usam a cor da superfície
  onde ele aparece (`var(--fig-bg, var(--paper))`), então funciona igual nos dois temas e dentro
  dos slides. No site, essa superfície é o painel tingido pela categoria (§4.3).
- **Espessura do traço definida pelo CSS conforme o tamanho em que o desenho aparece**
  (mais grossa na miniatura, mais fina no topo do artigo).
- Anotações em Literata itálica com linha de chamada, só nos recortes grandes; somem no
  celular e nas miniaturas.
- Proibido: cores fixas no SVG, degradês, sombras, `<image>`, fontes de letra de mão,
  emojis, texto demais.

**Regras técnicas** (ficam na skill de desenho, não no arquivo de estilo):
- SVG usa só classes e variáveis CSS. Filtros e padrões (tremor, hachura) ficam definidos
  **uma vez** no layout; o desenho não declara `id` nem `<defs>` próprios (vários desenhos
  convivem na mesma página e ids colidiriam).
- A ilustração declara seus recortes, com uma área segura central que sobrevive a todos:
  topo do artigo largo (~2,35:1), 3:2 (destaque, cards, topo no celular), 1:1 (miniatura da
  lista) e a área usada na imagem de compartilhamento.
- `alt` descritivo: o que o desenho mostra, em uma frase.
- Scripts de validação no espírito dos do blog atual (`check-cover.mjs`, `render-cover.mjs`):
  um que valida as regras acima e outro que renderiza todos os recortes, claro e escuro, num
  PNG só, para conferência visual antes de aceitar o desenho.

## 7. Lousas: diagramas que explicam (decidido)

Os diagramas de explicação dentro do post aparecem numa **lousa**. A lousa é sempre o
**contrário da página**:
- Página no tema claro: **lousa de vidro escura** (`#15191C`, reflexo diagonal sutil, borda
  `#2C3438`), traço de caneta clara (`#F4F6F5`), destaque na cor da categoria clareada
  (`color-mix(in oklab, cor, #9ff5dc 55%)`).
- Página no tema escuro: **quadro branco suavizado** (`#CFD5D1`, borda de alumínio
  `#8F989D`), caneta escura (`#16212B`), destaque na cor da categoria escurecida
  (`color-mix(in oklab, cor, #0b6f58 35%)`). Nunca branco puro, para não ofuscar.
- Traço de **canetinha** nas duas (sem giz), com leve tremor. Rótulos na mesma Literata
  itálica do blog; nada de letra de mão.
- **A caneta aparece desenhando**: enquanto uma seta é traçada, a caneta fica na ponta do
  traço e acompanha o desenho; textos são escritos da esquerda para a direita com a caneta
  seguindo. A caneta assume a cor do que está desenhando (cor da categoria nos destaques).
  Parou de rolar, a caneta para; rolou para cima, o desenho se apaga.
- Os rótulos e caixas iniciais do cenário podem já estar desenhados ("o professor montou o
  quadro antes da aula").

Três componentes, todos na lousa, com a mesma linguagem:

1. **Passo a passo** (D39): na tela de 1024px ou mais, sem movimento reduzido, com a rolagem: a
   lousa fica fixa à direita e avança um passo por parágrafo; os parágrafos ficam a uns 40% da
   tela um do outro, todos à vista, o atual inteiro e os outros esmaecidos, sem trecho vazio grande.
   No celular, no tablet e com movimento reduzido, sem rolagem guiada: a lousa em cima, o texto do
   passo atual embaixo e "◀ 2 de 5 ▶" com pontos, aceitando deslizar o dedo na lousa. Sem JS, o
   desenho completo e todos os passos.
2. **Linha do tempo de arrastar**: comparação que avança no tempo (ex.: "com e sem a chave").
   Controle deslizante + **botão play/pausa** à esquerda (percorre em ~7 s, para 1,5 s no
   resultado e recomeça). Também responde a arrastar sobre o desenho e à roda do mouse (com
   ou sem Shift); nas pontas, a roda volta a rolar a página. Qualquer gesto manual pausa a
   reprodução. Texto do estado atual com `aria-live`.
3. **Animação curta em loop**: poucos segundos, com **barra de tempo** por baixo (marcas de
   início, eventos e fim), botões **Recomeçar** e **Pausar**, e uma pausa perceptível no fim
   antes de reiniciar.

Existe também um recurso raro, a **frase em destaque**: uma citação cujas palavras acendem
com a rolagem. Use no máximo de vez em quando; o Cesar pode removê-la.

## 8. Conteúdo

### 8.1 Migração
- Migre os **26 posts** do blog atual mantendo slug, datas, categoria/série, tags e o
  conteúdo. Mantenha os recursos de Markdown que eles usam (código com `ins`/`del`, títulos
  de arquivo, KaTeX, `<details>`, tabelas).
- Série Java: porte o cadastro e as regras específicas do `CLAUDE.md` atual (um post por LTS,
  esqueleto fixo, redirecionamentos das versões intermediárias, página `/java/`).
- Apresentações existentes (`public/posts/<slug>/deck/*.webp` e `src/data/decks.json`):
  migre como estão.
- Diagramas antigos dentro dos posts (`public/posts/<slug>/*.svg`, fundo branco fixo):
  na migração, mostre-os num quadro claro para não brigar com o tema escuro; redesenhá-los
  como lousa é uma fase posterior, post a post.
- Ilustrações novas para os 26 posts: fase própria, em lotes, cada lote conferido com o
  render antes de seguir.

### 8.2 Regras de todo post novo (vão para a skill de post e para uma regra por caminho)
- **Tamanho**: posts mais curtos que os de hoje. Meta de **1.500 a 2.500 palavras**
  (8 a 12 min de leitura), teto de ~3.000. Assunto maior vira **série** ou é dividido em
  partes. Sem enchimento. Os posts existentes não precisam ser encurtados.
- **Veracidade**: nenhuma afirmação técnica sem fonte confiável e conferida (documentação
  oficial, especificações, JEPs, RFCs, release notes). Nada inventado: versões, números,
  benchmarks, citações e APIs só se verificados. Se não der para confirmar, diga isso no
  texto ou tire. Código e SQL testados (rodados) antes de publicar, e que façam sentido
  (25/09/2026, D35); exemplo grande linka o código completo.
  Links conferidos. **`## Fontes`** no fim, sempre.
- **Estrutura**: introdução com o problema concreto em 2 ou 3 frases; seções `##` claras;
  pelo menos **uma lousa** quando houver fluxo, sequência, antes/depois ou linha do tempo
  (post simples fica sem); avisos só quando ajudam; diff quando mostrar antes e depois.
- **Frontmatter**: `title` (aparece inteiro; o " — " só divide a imagem de compartilhamento),
  `description` até ~200 caracteres,
  `published`, `updated` opcional, `category` **ou** `series`, `tags` (2 a 4, reaproveitando o
  vocabulário existente, sem repetir nome de categoria), `draft`.
- **Categoria**: encaixe numa existente; se nenhuma servir de verdade, pode criar uma nova
  dentro do escopo do blog, com cor distinta, e avise o Cesar.
- **Fluxo** (vale para post do zero e para texto que o Cesar traz pronto): classificar →
  escrever ou melhorar → revisar contra fontes → desenhar ilustração e lousas → validar
  (build, claro e escuro, celular) → mostrar ao Cesar. **Nunca** commitar nem publicar sem
  pedido explícito dele.

### 8.3 Apresentação do NotebookLM
- O Cesar gera a apresentação no NotebookLM e traz o **PowerPoint** (.pptx). Os slides vêm
  como imagens inteiras dentro do arquivo: extraia na ordem, converta para WebP (como o
  `scripts/deck-to-web.mjs` atual faz) e **gere no build um PDF a partir dessas imagens**
  para o botão "Baixar PDF". Proponha a biblioteca antes de instalar.
- Antes de aceitar o material, confira erros de texto e código nas imagens (o NotebookLM
  já errou palavras e nomes); se houver erro, peça para gerar de novo. Um deck por artigo.
  Os slides não substituem o texto.

## 9. Como organizar o conhecimento do projeto (para retomar em qualquer sessão)

Siga a recomendação da documentação do Claude Code: `CLAUDE.md` curto, procedimentos em
skills (carregadas sob demanda) e regras por caminho em `.claude/rules/`. Importar arquivos
com `@` organiza, mas não economiza contexto; o que economiza é skill e regra com `paths`.

- `CLAUDE.md` (**menos de 150 linhas**): o que é o projeto, stack, comandos, mapa das pastas,
  regras que valem sempre (pt-BR, não commitar sem pedido, não mexer em `../blog-atual`,
  movimento reduzido, tokens em vez de cores fixas), e a instrução:
  **"Ao começar uma sessão, leia `docs/estado.md`. Ao terminar um bloco de trabalho,
  atualize-o."** Aponte para as skills e para os docs; não copie o conteúdo deles.
- `docs/estado.md` (**até ~60 linhas**): fase atual, o que está pronto, próximos passos,
  perguntas abertas para o Cesar. É um painel, não um diário: o que ficou pronto sai daqui.
- `docs/decisoes.md`: registro curto de decisões (data, decisão, motivo, alternativas).
- `docs/estilo-desenho.md`: o estilo das ilustrações e das lousas (seções 6 e 7).
- `docs/briefing.md`: este arquivo.
- Skills em `.claude/skills/<nome>/SKILL.md` (com `name` e `description` no frontmatter),
  por exemplo: `post` (fluxo completo e checklist da seção 8.2; era `novo-post` até a D35), `desenho` (regras
  técnicas da seção 6, lendo `docs/estilo-desenho.md`, e os scripts de validação), `lousa`
  (como montar os três componentes da seção 7), `apresentacao` (seção 8.3), `serie-java`.
- Regras em `.claude/rules/` com `paths`: uma para os arquivos de post (tamanho, fontes,
  frontmatter) e uma para os arquivos de desenho (aponta para o estilo e para a skill).
- Quando o Cesar corrigir a mesma coisa duas vezes, isso vira regra no lugar certo.

## 10. Fases

Trabalhe por fases. **No fim de cada fase, pare**: mostre o que foi feito, como ver
(`npm run dev` e as páginas para abrir), o que ficou pendente, e espere o Cesar aprovar
antes de seguir. Atualize `docs/estado.md` ao fechar cada fase.

0. **Preparação**: ler este briefing, as referências e o `CLAUDE.md` do blog atual; clonar o
   blog atual em `../blog-atual`; propor stack e plano de busca com critérios; criar
   `CLAUDE.md`, `docs/estado.md`, `docs/decisoes.md`, `docs/estilo-desenho.md`, as skills e as
   regras (esqueleto, completados ao longo das fases). Listar dúvidas.
1. **Base**: projeto, tokens, fontes, layout, cabeçalho, rodapé, tema com anti-piscada,
   página `/sobre/` mínima, deploy de pré-visualização configurado (sem trocar o domínio).
2. **Conteúdo e rotas**: migração dos 26 posts, esquema do frontmatter, categorias, tags,
   séries, `/java/`, todos os artigos, redirecionamentos, RSS, sitemap, JSON-LD, busca.
3. **Home**: estante completa, destaque, lista e cards, tags.
4. **Artigo**: topo, sumário, notas laterais, avisos, código, barra de leitura,
   compartilhar, aviso de IA, navegação, apresentação, lightbox.
5. **Desenho e lousas**: definições globais, recortes, imagem de compartilhamento, scripts de
   validação e render, os três componentes de lousa e a frase em destaque. Recriar o artigo
   de idempotência com ilustração e lousas como post de referência.
6. **Ilustrações dos posts existentes**, em lotes conferidos.
7. **Qualidade e publicação**: Lighthouse, acessibilidade (teclado, foco visível, contraste,
   leitores de tela), `astro check` (ou equivalente) sem erros, revisão visual claro/escuro e
   celular, links. Plano para apontar o domínio para o novo site, **executado só com o
   OK do Cesar**.
