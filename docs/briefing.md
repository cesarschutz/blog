# Briefing — novo blog de Cesar Schutz

Este documento é a fonte das decisões de produto e design do novo blog. Ele foi fechado
com o Cesar depois de várias rodadas de protótipo. Não reabra decisões marcadas como
**decidido** sem perguntar; tudo o que estiver marcado como **a decidir por você** é seu
para propor, justificar e registrar em `docs/decisoes.md`.

Referências visuais e de comportamento, abertas no navegador (arquivos locais, sem build):

- `docs/referencias/prototipo-estilo-desenho.html`: estilo das ilustrações. **O escolhido é
  a aba "A + C"** (ver seção 6). É o único protótipo da Fase 0 que ainda vale.
- Superados, em `docs/historico/`: o de home e artigo (`prototipos/prototipo-home-e-artigo.html`; o
  layout mudou na D26 e de novo na D61), o das lousas (`referencias/prototipo-lousas.html`, a aba
  "Invertida, canetinha": o quadro escuro, que saiu do site na D84) e o das "Folhas claras"
  (`referencias/prototipo-mais-vida.html`, D26, trocado pelo "papel e luz" da D61).

Os protótipos mostram aparência e comportamento aprovados. São referência, não código para
copiar: reescreva com a arquitetura certa, acessível e performática. Onde este briefing e um
protótipo divergirem, vale o briefing.

**O redesenho está no ar (D61, 02/10/2026).** Depois de quatro rodadas de protótipos (D55), o Cesar
mandou publicar a versão final: **papel, tinta, latão e luz**. Ela troca a camada visual das seções 4 e
5 (as "Folhas claras", o cabeçalho, o rodapé, a abertura, as trocas de página, a fileira da home, Tags
e a página do livro). Não mudam:

- a estrutura (posts em livros com tags, o filtro por livro na tag, Categorias com os livros grandes);
- as rotas;
- os livros;
- a caneta;
- os desenhos dos posts.

O que vale para o visual está na seção "Papel e luz (D61)" do `DESIGN.md`, e o detalhe, em
`docs/redesenho/rodada-4/`. As cores dos dois temas são as de antes (D62). Na faxina da D84
(05/10/2026), as seções 4 e 5 abaixo passaram a dizer o que vale hoje, com a home da D84, e o que era só
história (a estante com a gaveta, a pilha lateral, as folhas de 14px) saiu daqui: o detalhe fica nas
decisões de cada época, no `docs/decisoes.md`. Se ainda sobrar alguma divergência, vale a D61.

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
  redirecionam: `/about/` → `/` (D33), `/projects/` → `/`, `/categories/Carreira/` → `/categories/` e
  `/tags/Pagamentos/` → `/tags/Cobrança/` (D78).

## 3. Stack e desempenho

**Decidido**
- Site estático, publicado no GitHub Pages por GitHub Actions, sem backend.
- Fontes servidas pelo próprio site (`@fontsource`), nunca Google Fonts em produção.
- JavaScript só onde há interação (estante, busca, lousas, animações dos posts, apresentação,
  alternância lista/cards, tema). Página de artigo sem esses componentes deve funcionar sem JS.
- Respeitar `prefers-reduced-motion` em toda animação: com ele ligado, tudo aparece no
  estado final, sem prender a tela.

**A decidir por você** (proponha na Fase 0 e registre em `docs/decisoes.md`)
- Framework. O blog atual usa Astro 7 com Expressive Code e MDX; trocar só se houver ganho
  real. Critérios: desempenho, componentes interativos dentro do Markdown, blocos de código
  com diff, facilidade de manutenção pelo próprio Claude Code.
- Busca. Requisitos: ignora acentos; frase exata primeiro, depois todas as palavras;
  relevância título > tags > descrição > corpo; aceita `#tag`; link compartilhável `/?q=termo`;
  atalhos ⌘K e Ctrl+K (o "/" saiu na D52, B06: em muitos teclados é a mesma tecla do "?" dos atalhos
  do artigo); o índice só é baixado quando a busca abre; continua rápida com
  centenas de posts. Compare o índice próprio do blog atual com uma alternativa como o
  Pagefind (índice em fragmentos): meça com os 26 posts reais e com uns 500 posts sintéticos
  (tamanho baixado e tempo até o primeiro resultado) e escolha com números. Resultado sem o termo
  sai; sem nenhum exato, mostra só os parecidos, com "Nada exato para …" (D37).
- Metas: Lighthouse ≥ 95 em desempenho, acessibilidade, boas práticas e SEO na home e num
  artigo, no celular.

## 4. Sistema visual (decidido)

> **D61 (02/10/2026):** o visual agora é "papel, tinta, latão e luz" (seção "Papel e luz (D61)" do
> `DESIGN.md`, que vence esta seção onde divergirem).

Da "A. Folhas claras" (D26, de 24/09/2026 à D61; o protótipo está em
`docs/historico/referencias/prototipo-mais-vida.html`) ficaram o azul-tinta em tudo que é clicável, a
fonte sem serifa na interface e os desenhos em painéis tingidos pela categoria. A D61 trocou as folhas
de cartão por papel (folha, ficha de catálogo e papel colado), pôs a luz de latão sobre os livros e
refez as trocas de página. Estrutura, conteúdo, rotas e comportamento seguem as seções 5 a 7.

### 4.1 Tipografia
- Títulos: **Besley** 700. O nome na abertura da home e a marca do cabeçalho continuam em 800.
  Texto: **Literata** (com eixo `opsz`). Código: **JetBrains Mono**.
- Interface: **IBM Plex Sans** (400, 500 e 600), servida pelo próprio site: menu, busca, datas,
  tempo de leitura, categoria, tags, botões, trilha, sumário e legendas. As fichas de catálogo da D61
  têm a tira em mono (JetBrains Mono).
- Livros (capas, lombadas e contracapas; os títulos da lateral, D30, saíram com ela na D61): **Bitter**
  e **Newsreader** itálico (com o eixo de tamanho óptico, D32), servidas pelo próprio site, pela regra
  de `docs/capas/CAPAS.md`.
- Artigo: corpo 18,5px, entrelinha 1,72. **O texto ocupa a folha do corpo**, com margem pequena dos
  lados, na mesma largura do código, das tabelas, das lousas e da apresentação (D46, pedido do
  Cesar; antes, uma coluna de 720px no meio, D39); no celular, o corpo não fica num cartão.
  Números em estilo antigo (`oldstyle-nums`) no texto corrido.
- Sem fonte de "letra de mão" em lugar nenhum, inclusive nos desenhos e nas lousas. **Exceção
  decidida (D48):** as notas escritas à caneta nos artigos usam a **Caveat** (600), auto-hospedada e
  carregada só nos posts que têm nota.

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
- Tema e modo: o site **sempre abre no claro e com os artigos em cards** (D52, C01; antes, o tema
  seguia o sistema, D33). O botão do cabeçalho alterna direto entre claro e escuro, sem menu (D39):
  desde a D61, é o lustre com a cordinha, e **o tema é a luz** (puxar a cordinha apaga a lâmpada e a
  sala escurece; puxar de novo acende; no lugar do círculo da D42 e da lua e do sol da D49). A escolha
  do leitor (tema e/ou o modo Lista/Cards) fica guardada no navegador e vale
  por **3 dias** a partir da última troca de qualquer uma das duas (`localStorage`, D52; antes,
  `sessionStorage`, só durante a aba); passado esse prazo, o script anti-piscada do `<head>` apaga a
  escolha antes da primeira pintura e tudo volta ao padrão. Trocar o tema só muda as cores: nenhum
  tamanho depende do tema, e a página não sai do lugar.
- **Categorias = livros de uma coleção numerada, no estilo "edição de estudo"; séries = revistas
  técnicas** (D30, D32). A regra visual de capas, lombadas, estante, livros e séries novos está em
  **`docs/capas/CAPAS.md`**, com as imagens de referência em `docs/capas/referencia/`. Os dados de
  cada livro e de cada série (volume, título, frase, subtítulo, cor, medidas; na série, as edições e
  a tarja) ficam em `src/livros/livros.json` e todas as cores saem de `src/livros/cores.js` (a cor
  do livro, a tinta sobre ela, o destaque sobre o papel, o papel e a tinta do papel). A cor principal também é a da categoria no site: chip, barra de leitura e palco dos
  desenhos. No tema escuro, o destaque dos desenhos usa a cor misturada com 42% de branco.

| Vol. | Categoria | Cor | Instrumento na capa |
|---|---|---|---|
| 01 | Arquitetura de Software | `#2d4f77` | prancheta com a planta e a régua-tê |
| 02 | Dados | `#5b457f` | tabulador de Hollerith |
| 03 | Desenvolvimento de Software | `#82555a` | tear de Jacquard |
| 04 | DevOps | `#92a6c2` | estação de tubo pneumático |
| 05 | Frontend | `#433123` | prensa tipográfica Albion |
| 06 | Fundamentos | `#26626a` | telégrafo de Morse |
| 07 | IA | `#5d4128` | o Turco, autômato enxadrista de Kempelen |
| 08 | Integração e Eventos | `#71a49d` | mesa telefônica manual |
| 09 | Pagamentos | `#4f6f57` | caixa registradora |
| 10 | Segurança | `#7c322b` | fechadura detectora de Chubb |
| 11 | Sistemas Distribuídos | `#253461` | relógios de Huygens |
| 12 | SRE | `#b59353` | regulador centrífugo de Watt |
| 13 | Testes | `#39404d` | fio de prumo |

Categoria nova = livro novo, pela seção "Livros novos" do `CAPAS.md` (desenho, ícone, volume). Todo
livro aparece na coleção da home, em Categorias e na fileira do alto da página do livro, mesmo sem
artigos; o número de artigos, não.

**A coleção de 13 livros (D78, decidida em 01/10/2026 e aplicada em 04/10/2026, a pedido do Cesar):**
a tabela acima, com os **volumes em ordem alfabética** (livro novo entra na sua posição e os seguintes
mudam de número). Carreira saiu (não tinha post; `/categories/Carreira/` redireciona para
`/categories/`); os livros de antes mantêm o nome; os 13 têm desenhos, cores, frases e textos novos. Os
desenhos seguem um princípio só, **"O mesmo problema, um século antes"**: cada livro leva a máquina ou
o instrumento que fazia, antes do software, o trabalho do assunto, entre o século XVII e 1890, todos
no mesmo ponto de vista e com um único fantasma tracejado, que é a máquina no instante do trabalho
(regra em `CAPAS.md`; o motivo de cada objeto e de cada cor, em `docs/prototipos/colecoes/final/`).
A tag Pagamentos virou **Cobrança**, porque Pagamentos virou livro (`/tags/Pagamentos/` redireciona
para `/tags/Cobrança/`). Ao planejar um post, o Claude confere se a coleção ainda serve e avisa o
Cesar quando valer criar, dividir ou renomear um livro (skill `post`). **A coleção da home é uma
estante de prateleiras de capas** (D84, 04/10/2026; antes, a opção 1 da D78, "os livros estão muito de
lado", numa fileira só): os livros ficam sempre de capa (giro de 26°) e grandes, e quem muda com a
largura é o número de livros por prateleira: 7 a partir de 900px (7 + 7, até 214px de altura), 5 de 600
a 899px (5 + 5 + 4) e 4 abaixo de 600px (4 + 4 + 3 + 3, na largura da tela). Nunca lombada nem rolagem
lateral na home, e sem nomes embaixo (a capa diz o nome). A fileira do alto da página do livro não mudou.
Com o mouse, o livro sob ele cresce como no Dock do Mac (na prateleira dele), e todos os abajures ficam
sempre acesos. **A
contracapa** (a ideia 1 do Cesar, 04/10/2026): no livro ampliado (a lupa do livro grande), o botão "Virar o
livro" gira o livro e mostra o verso, impresso na cor do livro como uma contracapa de verdade: a frase, o que
o livro abrange e a capa em poucas linhas, com o link sobre a máquina. **As capas** (`/capas/`, "Capas" no
cabeçalho): a página com cada livro grande e, ao lado, a história da máquina da capa (o que ela é, a relação
com o livro e o que o tracejado mostra), com o link sobre ela. A cor do livro não tem texto.

- **Capa de categoria** (D32): em cima, o bloco na cor do livro com "VOLUME 0N", "CESAR SCHUTZ" e o
  título grande; embaixo, o papel claro só com a frase do livro e o desenho grande, no destaque.
- **Série "Atualizações do Java"** (D32): revista técnica, cada post uma edição. Papel com faixa no
  destaque `#c24d1c`, "Atualizações" e *do Java* em itálico, linha de dados (série, autor e o total
  de edições contado pelos posts), o "25" da última edição com a lista das edições ao lado, a tarja
  escura do **guia de atualização** e, no pé, a xícara e o subtítulo. Série nova segue o mesmo
  formato, com a própria cor de destaque, emblema, número de capa, edições e tarja.

### 4.3 Folhas, painéis e interação
- **Papel** (D61): o conteúdo principal fica em papel sobre o fundo (`--paper-hi` sobre `--paper`),
  em três formas só: a folha lisa (canto de 2px, sem borda, a sombra curta da espessura do papel e o
  grão), a ficha de catálogo (canto de 6px, a tira em mono sobre o fio de 2px na cor do livro) e o papel
  colado com fita. Painéis e caixas dentro do artigo: raio de 10px. Medidas e sombras (`--sombra-folha`,
  `--sombra-folha-alta`) no `DESIGN.md` ("Papel e luz" e "Elevation & Depth"); as folhas de 14px com
  borda e a sombra de cartão das "Folhas claras" (D26) saíram na D61.
- **Azul-tinta** (`--acento`) em tudo que é clicável: item ativo do menu, links no texto, o botão
  principal (`.botao-primario`: a etiqueta de papel com seta, texto em `--sobre-acento`, como o
  "Começar pelo guia" de Séries), seletor Lista/Cards, item atual do sumário, título do card ou da
  linha ao passar o mouse, foco. As cores das categorias continuam nos livros, nos chips e nos
  desenhos.
- **A caneta preta desenha; a azul marca** (D52, C04): o preto (a tinta de sempre) é o traço de quem
  fez a página — ícones, contornos e o rascunho do mouse; o azul continua só no estado (o que é
  clicável e as marcações do texto). A caneta da leitura do artigo usa a cor do livro (D58). Na
  abertura da home, a assinatura embaixo de "Cesar Schutz" é o **único traço grande do site**.
- **Desenhos com palco**: cada ilustração fica num painel tingido pela cor da categoria
  (`color-mix` da cor com 11% sobre a superfície no claro, 20% no escuro). As áreas preenchidas do
  desenho usam a mesma cor do painel, o traço fica um pouco mais grosso (×1,2) e o preenchimento de
  destaque, mais forte (78% da cor). Valores em `docs/estilo-desenho.md`.
- **Marca** (D33): o livro "cs" (capa do Volume 01, sem a fita desde a D47), "Cesar Schutz" e
  "blog" em itálico, no cabeçalho, no rodapé, grande na abertura da home e no ícone do navegador.
  **Pendente (D78):** a marca continua no verde `#2D4B46`, a cor da Arquitetura de Software antes da
  coleção de 13. Com a Arquitetura azul (`#2d4f77`) e os volumes em ordem alfabética (o Volume 01 muda
  se entrar um livro antes dela), o Cesar ainda vai decidir se a marca acompanha o azul.
- **Acabamento**: busca como campo (ícone, "Buscar" e ⌘K), GitHub e LinkedIn só com os ícones e o
  lustre do tema (D39, D61; o som dos livros saiu) no cabeçalho; cards que sobem 4px ao passar o
  mouse (parados com `prefers-reduced-motion`); itens da lista (cada um uma ficha própria desde a D61)
  que sobem 2px, com o colchete à caneta na margem ao passar o mouse (D49);
  chip de categoria com quadradinho da cor e nome tingido (no claro, a cor com 34% de tinta, para o
  dourado do SRE passar de 4,5:1; no escuro, com 50% de branco).
- **Artigo**: o corpo é lido sobre a folha; em telas ≥ 1300px, o sumário fica à esquerda, numa
  folha própria e fixa, com "NN% lido" e os minutos que faltam embaixo (§5.3).
- **Largura**: a mesma do blog atual, conteúdo de até 1320px e margem lateral de 16 a 32px.

## 5. Páginas

### 5.1 Home
**Hoje (D61, D84):** no alto, o nome gigante; logo abaixo, "A coleção" em prateleiras de capas; depois,
"Artigos recentes" (o primeiro é o destaque) e a paginação. A frase de apresentação, os números (Artigos,
Livros, Tags) e o último artigo saíram na D84. O visual de cada peça está no `DESIGN.md` ("Papel e luz"),
e o movimento, no `docs/movimento.md`. A home de antes (a estante com a gaveta, D43 e D49; o painel lateral
com a pilha, D28 e D46) fica no `docs/decisoes.md`.
- **Cabeçalho** (D31): **fixo no alto** enquanto a página rola, com o fundo da página levemente
  translúcido e um **fio embaixo sempre à vista** (D44), que ganha uma sombra suave depois de rolar. A
  marca à esquerda (D33); à direita **Artigos, Livros, Séries, Tags e Capas** ("Livros" leva a
  `/categories/`, D61; "Capas", a `/capas/`, D78), a busca como campo (com ⌘K; só o ícone até 1100px), os
  ícones do GitHub e do LinkedIn e o lustre do tema (§4.2). A seção atual é sublinhada por um traço de
  caneta, que desliza de um item para o outro na troca de página (D49). O RSS saiu do menu (fica no
  rodapé). Até 860px (D46), **sempre à vista** e numa linha só: a marca, a busca (só o ícone), o tema
  e o **botão de menu** (dois traços que viram um X), que abre as seções numa folha que desce do
  cabeçalho, cada uma com uma nota curta ("Os livros da coleção"), e o GitHub e o LinkedIn embaixo, com
  um véu sobre a página, que fica parada enquanto o menu está aberto (D84). A altura dele
  (`--altura-topo`, 60px) é descontada pelas âncoras e pelo sumário do artigo. (Até a D46, ele sumia ao
  rolar, D38.)
- **O nome gigante** (D61, D84): o caderno "cs" e "Cesar Schutz" numa linha (até 700px, em duas), com
  1/8,9 da largura útil (até 168px; no celular, 1/5,6), a assinatura à caneta embaixo de "Schutz" (o
  único traço grande do site, §4.3) e o "blog" do cabeçalho como **carimbo**: solto do nome (o nome não
  sai do lugar), inclinado −13°, um pouco por cima do canto do Z. É o h1 da home. A linha sobre IA saiu
  da abertura (fica no fim de cada artigo), e o post-it das frases de autores saiu do blog (D39).
- **A abertura** (D51; refeita na D61 e na D84): toca **ao chegar de fora e ao recarregar**, nunca com
  movimento reduzido, e um clique ou uma tecla pulam para o fim. Na home, uma folha de papel cobre a
  página, a caneta risca a lâmina de vidro de cada prateleira, os livros chegam um a um pela direita com
  a contagem ("Volume 01"… "Série"), os cadernos acenam, a estante desce para o lugar, o nome entra da
  direita, a assinatura se escreve e o "blog" carimba; depois, as luzes acendem uma a uma, vem a onda de
  molas e, por fim, o brilho. Nas outras páginas, o caderno "cs" carrega, abre e fecha e pousa na marca
  do cabeçalho, e as folhas da página chegam do fundo (`Abertura.astro`). Por dentro do site, vale a
  troca de página: a cortina azul com o nome do destino (D61) e, por baixo dela, a chegada das folhas
  (D51, `troca.js`).
- **A coleção** (D84; a regra dos livros em `docs/capas/CAPAS.md`): as prateleiras de capas da §4.2 (7, 5
  ou 4 livros por prateleira, sempre de capa e grandes, sem lombada, sem rolagem lateral e sem nomes
  embaixo), cada livro com o seu abajur sempre aceso e cada prateleira com a sua lâmina de vidro; a série
  é a última, depois de um vão maior. Com o mouse, a doca (D78): o livro sob ele cresce 1,14×, e os
  vizinhos da mesma prateleira, menos. O clique num livro abre a página dele, e o livro voa até o lugar
  dele lá. Sem JS, cada capa é um link.
- **A estante de lombadas** (D30, D49; `Estante.astro`) saiu da home no redesenho (D61) e ficou no
  filtro por livro e na 404: a descrição está na §5.2.
- **Destaque** (D52, C02; só na primeira página): deixou de ser um bloco à parte ("Em destaque", com
  o botão "Ler artigo") e passou a ser o **primeiro card ou item de "Artigos recentes"**. Em cards
  com duas colunas ou mais, ele ocupa o lugar de dois (o recorte largo e anotado do topo do artigo,
  título de 26 a 32px); com uma coluna, o card de sempre, com o rótulo "Mais recente" (traço de
  caneta embaixo, sem letra de mão) e o título maior; em lista, o item maior, com o desenho em 3:2 à
  direita. O desenho que se desenha (D41) roda uma vez por página, na forma à vista.
- **Artigos recentes**: alternância **Lista / Cards** (guardada no navegador; a troca esmaece uma
  forma e traz a outra, D42, e o azul escorre de um botão para o outro, D49), no formato do blog
  atual (D27). Em cima, categoria (o chip leva à página do livro, D33), data e tempo de leitura com
  relógio (e, quando o post tem repositório de exemplos, o sinal `</>` "código-fonte", D52, C03); o
  **título inteiro**, grande;
  a **descrição completa** (fonte da interface); até 4 tags em `#tag` (fonte de código), que levam à
  página da tag (D38). O item inteiro é clicável.
  Lista: miniatura quadrada da ilustração à direita (104 a 148px; 84px no celular, sem as tags).
  Cards: grade de até 3 colunas, com a ilustração em 3:2 no topo e as tags no pé do card.
  Mesmo formato de lista nas páginas de categoria, tag e série; o arquivo por ano continua compacto.
- **Paginação**: **12 lugares por página** (na primeira, o destaque ocupa dois: 11 artigos; D52,
  C02; antes, 12 artigos fora da conta do destaque), como no blog atual: `/`, `/2/`, `/3/`… Embaixo da
  lista, "Anteriores", os números (a atual em azul-tinta; nas outras, a caneta circula o número ao
  passar o mouse, D49) e "Mais artigos"; no celular, só os dois botões.
  Da página 2 em diante, só a lista ("Artigos — página N", em h1) e a paginação, sem destaque.
- Sem animação de entrada nas seções.

### 5.2 Páginas de apoio
Todos os artigos (`/archive/`), categoria, tag, série (ordem de leitura) e `/series/java/`
(página especial da série; porte do blog atual; `/java/` redireciona, D32). Mesma linguagem visual, sem inventar
componentes novos.

**Todos os artigos** e **tag** (D33): no formato da lista da home, com Lista / Cards; o arquivo
agrupado por ano, sem a coluna de datas. No topo, uma composição apoiada no pé da folha (D52, B07,
no lugar do texto centrado de antes): título e descrição no alto à esquerda; no pé, as três entradas
do acervo — os índices **por assunto** (as tags mais usadas, com a contagem) e **por ano** (com a
contagem, que roda como contador ao filtrar, D49), e a **estante de filtro**, com os livros que têm
artigos na página (e o número deles): clicar num livro mostra só os artigos dele (`?livro=<slug>` na
URL). Para não confundir com a lombada que leva ao livro (D38): o rótulo "Filtrar por livro" (ou "Só
\<livro\>") no pé da estante, a lombada escolhida um pouco acima da prateleira e as outras
escurecidas (sem contorno azul, D39), "Limpar filtro" no mesmo pé e as
lombadas como botões com `aria-pressed`; sem JavaScript, a estante de filtro não aparece. A tag
mostra também as tags que aparecem junto com ela, e tem um **ícone próprio** (D52, B11: um objeto de
ofício desenhado à mão, nunca logotipo, no traço dos ícones das lombadas), como marca d'água no topo
da página; os cartões de `/tags/` levam o mesmo ícone e uma estante em miniatura dos livros de onde
vêm os artigos dela. Tag nova pede o ícone, pela seção "Tags" do `docs/capas/CAPAS.md`. As lombadas
da estante de filtro (e as da 404) são as da coleção (o ícone no bloco de cor, o título na vertical e o
número de artigos, D30, D32), em pé sobre a lâmina de vidro, com a série depois de um vão (D61; o
aparador cinza e o último livro inclinado saíram). Ao passar o mouse (ou com o foco), a lombada tomba
um nada para a frente, pela borda de baixo, e mostra a cabeça (a estante de verdade, D49, em que nada
flutua), com o nome e a contagem embaixo; a estante não se mexe sozinha com a página parada.

**Categorias** (`/categories/`, D31; "Livros" no menu desde a D61) e **Séries** (`/series/`, D31): os
livros lado a lado, grandes, abertos em três quartos como o livro do topo da página de cada um, cada um
numa ficha de catálogo (D61) com o livro num painel tingido pela cor dele, a tira em mono ("Volume 01 ·
6 artigos", e os anos), o nome e o subtítulo. Ao passar o mouse, a ficha sobe e se pinta da cor do
livro, o abajur acende e o livro gira com mola para o leitor (o livro vivo, D61); ao clicar, o livro voa
até o topo da página dele. Em Categorias, os 13 volumes, que chegam de outra página no desfile (D51).
Em Séries, enquanto houver uma série só, um **destaque largo** (D39): a revista, o nome, a descrição,
as edições em ordem de leitura (número, título e ano) e "Começar pelo guia" (a primeira edição), com
"Ver a série".

**Tags** (`/tags/`, D39; refeita na D61): no alto, a nuvem (cada tag do tamanho da contagem, com o
ícone) e, ao lado, o fichário de aço com uma gaveta por letra (puxar uma letra mostra só as fichas
dela; "Todas" mostra todas). Embaixo, todas as tags como fichas de fichário, de A a Z, cada uma com a
contagem, a estante em miniatura dos livros em que ela aparece, o ícone e os três artigos mais
recentes, com "Todos os N".

**Série "Atualizações do Java"** (`/series/java/`, D31, D32): como a página de um livro (abaixo; sem a
fileira do alto enquanto houver uma série só, D62), com o livro da série no painel e os números das LTS;
depois, o guia e as versões, como antes.

**A página de um livro** (`/categories/<Nome>/`, D29; refeita na D61, rodada 3, área 4):
- No alto, a fileira com os livros da coleção (sem as séries, D62), na lâmina de vidro e com um abajur
  sobre cada livro; o lugar do livro desta página fica vazio, tracejado e aceso. A partir de 861px ela
  gruda sob o cabeçalho e encolhe ao rolar; nas telas estreitas, os livros giram até a lombada para
  caber, sem rolagem lateral. Clicar em outro livro troca de livro: o grande volta para o vão e o
  escolhido desce para o painel.
- Embaixo dela, o painel do livro, uma ficha de catálogo colada com fita: a tira em mono (o volume e a
  contagem), o nome grande, a frase do livro e os vizinhos de estante como links de texto; à direita, o
  **livro aberto**, grande, com a capa da coleção (D30) e as tags mais usadas em volta (no máximo seis
  à vista, e "+N" para as outras), cada uma levando à tag já filtrada por este livro. A marca d'água do
  desenho fica no canto de cima.
- A lupa no canto do livro abre o **livro ampliado** (D49): a capa gira pela lombada e, dentro, estão a
  guarda com o ex-libris, o sumário, uma página por artigo (com o link para ele), o fim do volume e o
  próximo livro da coleção. Arrastar, os botões, as setas ou um clique na página viram as folhas.
  Fechado, "Virar o livro" mostra a contracapa (D78, §4.2).
- Todo livro tem página, mesmo sem artigos: uma folha centrada com o livro aberto em branco (D57).
- Embaixo, os artigos com a alternância Lista / Cards, no mesmo formato da home (D27), sem paginação;
  com 1 a 3 artigos, a linha fica centrada, e com 1 ou 2 entra "Deste livro também:" com as três tags
  mais usadas do livro.
- O painel lateral com a pilha de livros deitados e a troca de livro pela pilha (D28, D46, D49) saíram na
  D61: a fileira do alto faz esse papel.

**Página não encontrada** (404, D49): a folha com o erro de um lado e a estante de lombadas do outro
(numa coluna só até 1480px, D84; os livros continuam no lugar, cada lombada leva ao livro). A caneta
rasura o endereço pedido e, quando ele se parece com o de um artigo, de um livro ou de uma tag, a página
sugere "Talvez seja este:". Embaixo, "Todos os artigos", "Página inicial" e a busca.

### 5.3 Artigo
Referência: aba "Artigo" do protótipo.
- **Topo**: a ilustração vem **antes do título** (recorte largo no computador, 3:2 no celular),
  depois trilha "Artigos › Categoria" (ou "Séries › Nome"), o **título inteiro** e a **descrição**,
  como no blog atual (D33), e a assinatura: foto e nome do autor, data com o calendário,
  "Atualizado em" quando houver e o tempo de leitura com o relógio. Quando o post tem código de
  exemplo publicado (campo `codigo` no frontmatter, D52, C03), a pílula "Código deste artigo no
  GitHub" entra na linha da assinatura, à direita (no celular, na linha dela). A marca d'água do
  livro fica no canto de baixo do painel do título (D50; no fim do artigo, D39, ela ficava atrás de
  "anterior / próximo"), como no topo das páginas de categoria e de série: grande e bem suave,
  cortada pela borda da folha.
- **Título** (D44): na lista, nos cards (em todas as páginas), no destaque e no topo do artigo, o
  título "Assunto — complemento" aparece em duas partes: o assunto como sempre, e o complemento na
  linha de baixo, sem o travessão, na fonte do texto, sem negrito, em `--ink-2`, a dois terços do
  tamanho do título (no topo do artigo, 0,56), nunca abaixo de 17px (maior que o resumo). O texto
  continua o original (o travessão fica escondido para leitor de tela e busca). No anterior / próximo
  (fichas de catálogo desde a D61), também em duas partes; na busca, o título segue inteiro, numa linha.
- **Barra de progresso de leitura** (D45): um traço de 2px sobre o fio embaixo do cabeçalho, na
  **cor do livro** (D58; de D52, B05, até a D58, a caneta azul), escrito por uma **caneta** pequena
  (22px, corpo na cor do papel, ponta na cor do livro) que vai na ponta dele; a caneta aparece depois
  que a leitura começa. No escuro, a cor leva 42% de branco. O cabeçalho fica sempre à vista, também
  no celular (D46).
- **Sumário**: em telas ≥ 1300px, à esquerda do texto, numa folha própria e fixa; recolhível no
  início do texto nas menores. Só aparece com 3 ou mais seções. No lateral (D33), um trilho: um ponto
  em cada seção, sem número (D36; o "3. " do título sai do nome, nas duas variantes); o fio, os
  vistos, o ponto atual, o sublinhado da seção atual e o título do post-it são da **cor do livro**
  (D58; de D52, B05, até a D58, a caneta azul; o marca-texto não volta), com as subseções da atual
  abertas e a atual sempre à vista. Uma
  seção só ganha o visto depois de ter sido a atual por 0,6s ou mais e ter ficado para trás; toda
  entrada (link, troca de página, recarga, `#título`, histórico) começa **sem nenhum visto** (D52,
  B04; antes, tudo antes da atual vinha marcado). Embaixo, "NN% lido" e o tempo que falta (em fonte
  de código; os minutos rodam como contador, D49; sem a barra de porcentagem de antes, D52, B05). A
  coluna da esquerda começa
  **no topo da página, ao lado da ilustração** (D46), e a folha do topo e a do corpo têm a mesma
  largura, com o texto na mesma margem. Embaixo do sumário, **a ficha "Do livro"** (D46, C05;
  D57): a foto do livro deitado, com a fita e uma etiqueta por artigo (a deste, amarela), o nome e "Ver
  o livro". Com ela, a ficha do fim do artigo some no desktop; no celular, fica no fim do artigo.
- **Atalhos de teclado** (D50): Espaço leva à próxima seção e Shift + Espaço à anterior (depois da
  última, o Espaço rola a página como sempre); T volta ao topo (o botão do canto); ← e → abrem o
  artigo anterior e o próximo; "?" mostra a lista (D52, B06: com ou sem Shift; nunca a busca, que
  abre só com ⌘K/Ctrl+K, sem o "/" de antes). Um "Atalhos ?" discreto embaixo do progresso do
  sumário lateral (só com mouse e teclado) abre uma ficha com a lista: com a lateral, ela sai de
  trás da folha do sumário e pousa ao lado, sem escurecer a página; sem ela, no meio da tela, com a
  página escurecida (D52, B06, redesenho do cartão da D50). Desligar os atalhos desliga também o
  "?". Quietos com o foco num campo, botão, bloco de código ou lousa, e com um diálogo aberto.
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
  linhas removidas, e diz "Copiado" no próprio botão, com o visto da caneta (D49). Tema de cores feito
  com os tokens do blog nos dois temas. A barra do bloco tem sempre a mesma altura, com ou sem título.
- **Desenhos do artigo** (seções 6 e 7, D58): a capa, as figuras coloridas, a figura em passos (D67,
  em prova), os ícones das ferramentas e o print como evidência, cada um só onde o assunto pede e
  sempre apresentado no texto. A lousa e a animação com play (D58) não estão em nenhum post desde
  04/10/2026 (§7).
- **Caneta do caderno** (D48, decidido; substitui o caderno marcado da D41): o texto vem marcado à
  caneta, **estático**, como se tivesse sido riscado antes de publicar (sem animação). Caneta **azul
  fixa** em todos os livros (#1F4FB5 no claro, #8FA8FF no escuro), que **nunca pinta o texto**: só os
  riscos, círculos, caixas, setas e notas à mão ficam azuis, e as notas não parecem link.
  **Marca-texto amarelo** (#FFE27A; no escuro, rgba(255, 214, 90, .30)), no máximo três vezes por
  post. **34 tipos** (D56), cada um com um papel (catálogo no dev, `/amostra/caneta/`; guia vivo em
  `docs/marcacoes.md`, com os critérios, os limites, as regras de tela e os "Ajustes do Cesar"): sem
  teto de total, o post bem marcado, como um arquiteto experiente marcaria, nunca duas marcações no
  mesmo parágrafo. A pintura
  dos termos das listas saiu; no lugar, a caixa à mão. É a **última etapa** de todo post (skill
  `caneta`), com a proposta (trecho, tipo, motivo) aprovada pelo Cesar antes de aplicar.
- **Apresentação** (quando existir): seção logo antes de "Fontes", com o título
  "Apresentação" e sem frase de apoio. Carrossel com setas e contador, tela cheia (galeria
  com ←/→) e botão **Baixar PDF**.
- **Fontes**: sempre a última seção.
- **Rodapé do post**, nesta ordem: tags; "Compartilhar" (copiar link, LinkedIn, WhatsApp e o
  compartilhar nativo quando existir; no celular, com o do sistema, só ele, D38); **aviso sobre IA** num bloco com o ícone de
  nota (era o de atenção até a D37, que fechava a leitura como um alarme), com o texto atual:
  "Artigo escrito com apoio de IA, revisado pelo autor, com o código testado. Ainda assim pode
  conter imprecisões: confirme nas fontes citadas e na documentação oficial antes de aplicar."
  (sem o "Saiba mais" desde a D33); a ficha **"Do livro"** (a foto do livro deitado da categoria
  ou da série, D57, que leva à página do livro; no desktop com o sumário lateral, ela fica embaixo do
  sumário, D39); depois a navegação **Artigo anterior / Próximo artigo**, sempre na ordem cronológica de
  "Todos os artigos" (D52, B03; antes, dentro de uma série valia a ordem de leitura, que podia
  divergir da data), como fichas de catálogo com fita (D61), com a ilustração, o título e o
  complemento; ao passar o mouse, a ficha sobe, a seta anda para onde se vai e o detalhe da capa viva
  se mexe. Sem bloco de "artigos relacionados". Os links do texto ganham a tinta azul por
  baixo ao passar o mouse (D49).
- **Voltar ao topo, em toda página longa** (D49), não só no artigo: desde a D61, a cordinha de latão
  do rodapé ("Puxe para subir") e, em página longa, a aba de fichário "topo" na borda direita, que
  some quando a cordinha aparece (a bolinha com a seta saiu). O sumário acompanha a leitura (D49): fio de tinta, visto nas seções lidas e a seção atual
  sublinhada à mão (D52, B05), na cor do livro (D58); abaixo de 1300px, o cabeçalho mostra "N de M · seção" e abre o sumário numa folha.
  Comentários (Giscus) e estatísticas (GoatCounter) continuam opcionais e desligados.
- Imagens do corpo abrem num visor sobre a página escurecida (D33), com fechar, setas e contador na
  apresentação; o print como evidência não abre no visor: o clique leva à página de onde ele veio
  (D58). Tabelas rolam na horizontal no celular, dentro da moldura: a coluna de texto tem um piso de
  11em, para não encolher até uma palavra por linha, e a tabela que passa da tela ganha o aviso
  "Arraste para o lado" (D70).
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
  registro (deslocado alguns pixels do contorno). O resto em tinta. (Vale para a capa; as figuras
  do corpo têm tons, §7.2.)
- **Sem fundo próprio**: o SVG não pinta fundo; as áreas preenchidas usam a cor da superfície
  onde ele aparece (`var(--fig-bg, var(--paper))`), então funciona igual nos dois temas e dentro
  dos slides. No site, essa superfície é o painel tingido pela categoria (§4.3).
- **Espessura do traço definida pelo CSS conforme o tamanho em que o desenho aparece**
  (mais grossa na miniatura, mais fina no topo do artigo).
- Anotações em Literata itálica com linha de chamada, só nos recortes grandes; somem no
  celular e nas miniaturas.
- Proibido: cores fixas no SVG, degradês, sombras, `<image>`, fontes de letra de mão,
  emojis, texto demais.

**Capa viva** (D58): a capa continua parada, mas **um detalhe só**, que conta algo do assunto, se
mexe quando o mouse passa pelo topo do artigo, pelo card ou pelo item da lista (como a fumaça da
caneca da série Java, D52). Evento (acontece e volta sozinho, em até 1,3 s) ou estado (muda, fica
enquanto o mouse está em cima e volta animado, sem pular). Com movimento reduzido, nada se mexe.
Classes e tempos em `docs/estilo-desenho.md` e na skill `desenho`.

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

## 7. Lousas e figuras: os desenhos que explicam (decidido)

Os desenhos do corpo do post são de três tipos além da capa (D58), cada um com um dono do
movimento: a **figura** (parada, ou com detalhes que se mexem sozinhos sem mudar a imagem), a
**lousa** (o leitor comanda o tempo) e a **animação com play** (a imagem muda; o leitor só dá play e
pausa). Nem todo post tem todos: entra o que o assunto pede e o que fica bom. **Todo desenho conversa
com o texto**: o texto o apresenta e diz o que olhar nele; nada de imagem solta.

**Em prova (D67, desde 02/10/2026):** a **figura em passos**, um formato só no lugar da lousa de passos,
da de comparação e da animação com play: a figura abre inteira e o leitor a monta passo a passo; cada
passo soma, nada some e nada anda sozinho (regras na skill `figura`; a prova em `/animacoes-test-2/`, e
o estilo dos controles, o marca-texto, escolhido em 04/10/2026, em `/animacoes-test-3/`). É um fato,
não uma decisão: hoje todos os posts com uma peça que acontece em ordem usam a figura em passos, e
nenhum usa a lousa nem a animação com play. Até o Cesar fechar a D67, post novo segue essa prática (a
figura em passos, como os posts de DNS e do You should know; regras no `CLAUDE.md` e na skill `figura`),
e as regras da lousa abaixo valem para as páginas em prova.

### 7.1 A lousa

**No estilo das figuras (D59, 30/09/2026):** a lousa usa o painel do livro, o traço da casa, os tons
com o mesmo significado das figuras do post, os selos numerados nos passos e os logos (§7.2), e quem
desenha é uma **canetinha colorida**, na cor do que está fazendo (o traço, o texto ou o tom que pinta):
contorna a caixa, pinta o fundo e escreve. O comportamento abaixo (play, passos, comparação, a mão,
uma caneta por lugar) continua o mesmo. Até 700px, como as figuras, o desenho fica com 720px e rola de
lado no painel; aí o tempo anda pelo play, pela faixa e pelos passos. O quadro escuro de antes, o
"contrário da página" (o vidro escuro no claro e o quadro branco suavizado no escuro, a aba "Invertida,
canetinha" de `docs/historico/referencias/prototipo-lousas.html`), saiu do site na D84 com a `LousaTempo`
e a `LousaLoop`.

Como a lousa desenha:
- Traço de **canetinha** (sem giz), com leve tremor. Rótulos na mesma Literata itálica do blog;
  nada de letra de mão.
- **A caneta aparece desenhando**: enquanto uma seta é traçada, a caneta fica na ponta do
  traço e acompanha o desenho; textos são escritos da esquerda para a direita com a caneta
  seguindo. A caneta assume a cor do que está desenhando (cor da categoria nos destaques). Ela
  aparece sempre que algo está sendo desenhado (play, arrasto, rolagem horizontal, controle), com
  movimento de mão, e é **uma por lugar** (até três ao mesmo tempo; melhor ainda, um lugar por vez).
  Parou, a caneta some; voltou no tempo, o desenho se apaga até ali (D58).
- Os rótulos e caixas iniciais do cenário podem já estar desenhados ("o professor montou o
  quadro antes da aula").

**Um componente, `Lousa`, com dois usos** (D58; na Fase 0 eram três componentes, e depois da D46,
dois):

1. **Passos**: a caneta monta uma sequência em que a ordem importa. A lista numerada dos passos fica
   logo abaixo e acende o passo da vez, na cor do livro; o clique num passo leva a lousa até ele, com
   tudo o que a linha diz já desenhado.
2. **Comparação**: duas linhas, uma em cima da outra, avançando no mesmo tempo (sem × com, antes ×
   depois). Os rótulos do desenho dizem o que é cada linha; o texto de cada estado vai só para o
   leitor de tela.

Nos dois: a lousa aparece com o desenho **completo e parado**. O **play** começa do início, chega ao
fim, espera 5 s e recomeça, até ser pausado; o controle deslizante, o arrasto sobre o desenho e a
rolagem horizontal sobre ela (trackpad de lado, ou Shift com a roda) também mexem no tempo, e
qualquer gesto pausa. A rolagem da página nunca mexe na lousa (o passo a passo com a rolagem saiu na
D46, a pedido do Cesar: "a caneta desenhando enquanto o texto rola ficou ruim"). **Nada ao lado do
controle** e nenhuma frase embaixo: a lousa nunca muda de tamanho. Fora da tela, pausa. Sem JS, o
desenho completo e a lista dos passos.

A **animação curta em loop** (`LousaLoop`, o "videozinho") saiu dos posts novos na D58 (o que ela
mostrava vira lousa de passos ou animação com play), e ela e a `LousaTempo` (a linha do tempo de
arrastar) saíram do site na D84: desde 04/10/2026, nenhum post as usava.

Existe também um recurso raro, a **frase em destaque**: uma citação cujas palavras acendem
com a rolagem. Use no máximo de vez em quando; o Cesar pode removê-la.

### 7.2 Figuras, animações, ícones e print (D58)

- **Figura** (diagrama, gráfico ou qualquer outro desenho): o traço da capa, no painel do livro, mas
  **colorida**: cada ator, lado ou papel ganha um tom, o mesmo em todas as figuras do post, para a
  cor ajudar a memorizar. Seis tons (azul, verde, âmbar, vermelho, roxo, petróleo), com 4,5:1 nos
  dois temas; o vermelho é só para erro, limite e recusa. Passos numerados com selos quando há
  ordem; legenda de cores que destaca um ator com o mouse. Pode ter **detalhes que se mexem**
  sozinhos, leves e na ordem do que acontece (um ponto correndo pela seta, um tracejado andando, um
  pulso), que só andam com a figura na tela. No celular, a figura mantém a letra legível e rola de
  lado dentro do quadro. Gráfico com números plausíveis e coerentes com o texto (ou de fonte), eixos
  com unidade e o limite, quando houver.
- **Animação com play**: para o que a lousa não cobre (o sistema funcionando, uma fila enchendo, um
  gráfico se formando no tempo). O desenho parado é o quadro final; abre tocando quando aparece na
  tela (nunca com movimento reduzido); um anel em volta do botão mostra o andamento da volta, há um
  botão para recomeçar, e o clique na imagem pausa. De 6 a 12 s por volta, 5 s parada no fim. Pouco
  texto trocando: o que foi escrito não some; se mudou, é riscado e o novo vem embaixo. Pouca animação
  também vale (só o ponto principal se mexendo).
- **Ícones das ferramentas**: os logos das ferramentas de que o post fala, **só como a regra de marca
  do dono permite** (D64, registro em `src/marcas/regras.json`, conferido na política oficial): o
  redesenho à mão no traço da casa só onde a política deixa (hoje, o Kubernetes); onde ela pede o
  arquivo oficial, ele sem alteração; onde não permite, só o nome em texto e, no desenho, um ícone
  genérico da casa (banco, fila, tópico, aplicação, servidor). No texto, antes do nome, na primeira
  menção e espalhados pelo post (não só no começo), sem poluir; o ícone é um link discreto para a
  página mais específica da ferramenta. Não confundir com os ícones das tags, que nunca são logotipo
  (D52).
- **Print como evidência**: só quando prova algo que o texto diz e dá para garantir que está certo
  (a documentação oficial dizendo o número citado, um erro, um painel). Tela que pede login (console
  da AWS, painéis internos): o Cesar tira o print. Com borda, uma linha embaixo dizendo o que é e de
  onde veio, e o clique abre a página de origem em outra aba. O print largo, de letra miúda (a tela de
  um terminal), rola de lado no celular em vez de encolher, e pode começar pela parte que importa
  (D66). Uma tela que o próprio Cesar desenhou, com os textos e os números de uma sessão real, entra
  como print parado (o quadro final do desenho), com a legenda dizendo que é desenho (D66).

Regras técnicas, classes e tempos: skill `figura`, `docs/estilo-desenho.md` e `docs/movimento.md`.

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
- **Formato** (D63): todo post, novo ou ajustado, começa por uma conversa com o Cesar, que decide
  com Claude o formato, a estrutura e as fontes:
  - **detalhado**: de **1.500 a 2.500 palavras** (8 a 12 min de leitura), teto de ~3.000, com o
    **TL;DR** fechado no alto do texto (o leitor clica para abrir);
  - **resumo** (um resumo de verdade, não tão curto): de **700 a 1.200 palavras** (4 a 6 min), com um
    **infográfico** que mostra o assunto inteiro (a ideia dos guias do ByteByteGo, desenhada no estilo
    da casa, com detalhes e ícones);
  - a **estrutura** (as seções e o que entra em cada uma) é combinada antes de escrever;
  - as **fontes**: se o Cesar já estudou o assunto, ele dá os links e o post se baseia neles; se não,
    Claude busca fontes confiáveis.

  Assunto maior vira **post em partes** (D71): dois posts ligados, parte 1 e parte 2, quando o texto
  passa do teto e tem dois temas que se sustentam sozinhos (em geral o conceito e a prática). Cada
  parte é um post inteiro, com título próprio e "(parte N de M)" no fim, o aviso da parte logo depois
  da abertura, com o link da outra, e a parte 2 com uma recapitulação para quem chega direto. Saem
  juntas. Três partes ou mais: conversar, pode ser série. Sem enchimento. Os posts existentes não
  precisam ser encurtados.
- **Escrita** (D71, pedido do Cesar depois do post dos mods; o detalhe está na skill `post`):
  - **Título:** "Assunto — complemento". O assunto, sozinho, tem de dizer do que o post trata, porque o
    título aparece sozinho na busca, em listas e em links: o nome da tecnologia e o tema na frente,
    sem pergunta, trocadilho, gancho nem nome que só o Cesar conhece. O título é do assunto do post,
    não do exemplo.
  - **Descrição:** uma ou duas frases com verbo, com o essencial nos primeiros 160 caracteres.
  - **TL;DR:** cada ponto é uma conclusão que se entende sozinha, do mais importante para o menos.
  - **Abertura:** o primeiro parágrafo diz o assunto e por que importa; o segundo, o que o post cobre e
    para quem. O exemplo, a história e a imagem vêm depois.
  - **Voz:** nunca a primeira pessoa ("eu criei", "testei", "fiz"). O sujeito é a coisa, ou o
    infinitivo ("para testar…"), ou "você". O que foi rodado ou medido vira fato com data.
- **Veracidade**: nenhuma afirmação técnica sem fonte confiável e conferida (documentação
  oficial, especificações, JEPs, RFCs, release notes). Nada inventado: versões, números,
  benchmarks, citações e APIs só se verificados. Se não der para confirmar, diga isso no
  texto ou tire. Código e SQL testados (rodados) antes de publicar, e que façam sentido
  (25/09/2026, D35); exemplo grande linka o código completo.
  Links conferidos. **`## Fontes`** no fim, sempre, e os links também **ao longo do texto**, onde o
  assunto da fonte aparece (D63).
- **Estrutura**: a abertura pelas regras da escrita (D71); seções `##` claras, com título
  descritivo; avisos só quando ajudam; diff quando mostrar antes e depois.
- **Desenhos** (D58, §7): uma lousa, uma figura ou uma animação quando houver fluxo, sequência,
  antes e depois ou um sistema funcionando (post simples fica só com a capa; a figura em passos da
  D67, em prova, é a que os posts usam hoje para o que acontece em ordem). **Nem todo post tem
  todos os tipos**: entra o que o assunto pede e o que fica bom (um post pode ter só a capa e um
  gráfico; outro, uma lousa e uma animação). **Todo desenho é explicado no texto**, que diz o que
  olhar nele. Ícones das ferramentas sempre que couberem, no texto e nos desenhos, sem poluir.
  **Print** só o que prova algo do texto e dá para garantir; tela com login é o Cesar quem tira.
- **Frontmatter**: `title` (o " — " divide o assunto e o complemento, que vira subtítulo; D71),
  `description` com o essencial nos primeiros 160 caracteres (teto de 200),
  `published`, `updated` opcional, `category` **ou** `series`, `tags` (2 a 4, reaproveitando o
  vocabulário existente, sem repetir nome de categoria), `draft`, `codigo` (D52, C03: URL `https://`
  do repositório de exemplos, opcional; só quando o post tem código publicado numa pasta própria em
  `cesarschutz/blog-exemplos`), `formato` (`detalhado` ou `resumo`, D63) e `tldr` (os pontos do TL;DR,
  no detalhado).
- **Categoria**: encaixe numa existente; se nenhuma servir de verdade, pode criar uma nova
  dentro do escopo do blog, com cor distinta, e avise o Cesar.
- **Fluxo** (vale para post do zero e para texto que o Cesar traz pronto): classificar →
  escrever ou melhorar → revisar contra fontes → desenhar a capa e os desenhos do corpo → validar
  (build, claro e escuro, celular) → mostrar ao Cesar → **passada de caneta** (skill `caneta`, D48),
  com a proposta aprovada por ele. **Nunca** commitar nem publicar sem
  pedido explícito dele.

### 8.3 Apresentações
- **No estilo do blog** (D74): quando o Cesar pede a apresentação de um post (PPT, slides, deck), ela
  sai em `.pptx` (e PDF) com os desenhos, os prints e as marcações da caneta do próprio post e as notas
  do apresentador (skill `apresentacao`, modo Criar, e `scripts/slides/`; o que sai fica em `saida/`,
  fora do git). Ela também entra no post, na seção "Apresentação", pelo `npm run apresentacao -- <slug>
  --pdf` (D77).
- **Do NotebookLM** (o modo de antes, que continua valendo): o Cesar gera a apresentação no NotebookLM
  e traz o **PowerPoint** (.pptx). Os slides vêm como imagens inteiras dentro do arquivo: eles são
  extraídos na ordem e convertidos para WebP (`npm run apresentacao -- <slug> --pptx <arquivo>`), e o
  build **gera um PDF a partir dessas imagens** para o botão "Baixar PDF" (D9).
- Antes de aceitar o material, confira erros de texto e código nas imagens (o NotebookLM
  já errou palavras e nomes); se houver erro, peça para gerar de novo. Um deck por artigo.
  Os slides não substituem o texto.

## 9. Como organizar o conhecimento do projeto (para retomar em qualquer sessão)

Siga a recomendação da documentação do Claude Code: `CLAUDE.md` curto, procedimentos em
skills (carregadas sob demanda) e regras por caminho em `.claude/rules/`. Importar arquivos
com `@` organiza, mas não economiza contexto; o que economiza é skill e regra com `paths`.

- `CLAUDE.md` (**curto, com ponteiros**; a meta da Fase 0 era menos de 150 linhas, e ele passou disso:
  enxugar mais ou mudar a meta é com o Cesar, pergunta no `docs/estado.md`): o que é o projeto, stack,
  comandos, mapa das pastas, regras que valem sempre (pt-BR, não commitar sem pedido, não mexer em
  `../blog-atual`, movimento reduzido, tokens em vez de cores fixas), e a instrução:
  **"Ao começar uma sessão, leia `docs/estado.md`. Ao terminar um bloco de trabalho,
  atualize-o."** Aponte para as skills e para os docs; não copie o conteúdo deles.
- `docs/estado.md` (**curto**; a meta da Fase 0 era até ~60 linhas, e o que mais ocupa hoje são as
  perguntas abertas): fase atual, como ver, um resumo do que existe, próximos passos, perguntas abertas
  para o Cesar e riscos. É um painel, não um diário: o que ficou pronto sai daqui (o detalhe fica no
  `docs/decisoes.md`).
- `docs/decisoes.md`: registro curto de decisões (data, decisão, motivo, alternativas).
- `docs/estilo-desenho.md`: o estilo das ilustrações, das figuras e das lousas (seções 6 e 7).
- `docs/movimento.md`: o detalhe de cada animação (as regras ficam no `DESIGN.md`).
- `docs/mapa.md`: o mapa das pastas e as armadilhas do ambiente que aparecem de vez em quando (D84).
- `docs/marcacoes.md`: o guia vivo da caneta do caderno (D48).
- `docs/briefing.md`: este arquivo.
- Skills em `.claude/skills/<nome>/SKILL.md` (com `name` e `description` no frontmatter):
  `post` (fluxo completo e checklist da seção 8.2; era `novo-post` até a D35), `desenho` (regras
  técnicas da seção 6, lendo `docs/estilo-desenho.md`, e os scripts de validação), `lousa`
  (a lousa da seção 7.1), `figura` (figuras, figura em passos, animação com play, ícones e print da
  seção 7.2, D58, D67), `caneta` (a passada de caneta, D48), `apresentacao` (seção 8.3: o NotebookLM e
  o modo Criar, D74), `redesenho` (os modelos de visual novo, D55) e `serie-java`. A lista completa,
  com as de terceiros, está no `CLAUDE.md`.
- Regras em `.claude/rules/` com `paths`: uma para os arquivos de post (tamanho, fontes,
  frontmatter), uma para os de desenho (aponta para o estilo e para a skill), uma para os de interface
  (componentes, estilos, scripts e páginas) e uma para os protótipos do redesenho.
- Quando o Cesar corrigir a mesma coisa duas vezes, isso vira regra no lugar certo.

## 10. Fases

As fases 0 a 7 do começo do projeto (da preparação à publicação) terminaram: D1 a D25, com o blog
publicado na D34. O roteiro de cada uma está em `docs/historico/fases-do-briefing.md`. Continua valendo
o que elas mandavam: ao fim de cada bloco de trabalho, mostrar o que foi feito, como ver e o que ficou
pendente (com o `docs/estado.md` em dia); e o domínio principal só muda com o OK do Cesar
(`docs/virada.md`).
