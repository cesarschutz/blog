# Base comum do redesenho (D55)

A fundação sobre a qual os 10 modelos são construídos: `redesenho/`, um projeto Astro próprio que
lê os posts, os livros e as ilustrações de `../src` sem alterar nada lá. Este documento é para quem
vai construir um modelo. O pedido e as regras estão em `docs/redesenho/README.md`; o processo, na
skill `redesenho`.

Estado do trabalho: **pronta** (30/09/2026). A primeira seção diz o que foi verificado e o que fica de risco; o
resto descreve a API, conferida contra o navegador.

## Estado em 30/09/2026: pronta

### O que foi feito e conferido

- **Projeto Astro** em `redesenho/` com o mesmo pipeline de Markdown do blog, `astro check` com 0 erros e
  `astro build` completo (122 páginas, 26 MB em `redesenho/dist`; só o aviso benigno `use astro:head-inject`
  dos três `.mdx`).
- **`src/comum/`**, sem visual próprio: `modelos`, `url`, `formatos`, `dados`, `ilhas.css`, `ilhas-tokens`,
  `Cabeca`, `DefinicoesIlhas`, `tema`, `movimento`, `filtro`, `busca`, `codigo`, `caneta`, `Prosa.astro`,
  `prosa-base.css`, `Livro3D`, `Capa`, `Lombada`, `Ilustracao`, `IconeTag`.
- **Molde `00-base`** (`src/modelos/00-base/`, `src/pages/00-base/`): home, artigos (`.md` e `.mdx`),
  Categorias, livro, série, Tags, tag e `/00-base/amostra/`. Todas respondem 200, sem erro no console.
- **Endpoints**: `/busca.json`, `/livros/<slug>.svg|.json`, `/livros/marca/<slug>.svg` e
  `/posts/<slug>/apresentacao.pdf` (o PDF do "Baixar PDF", com a pasta dos slides ajustada).
- **`scripts/conferir.mjs`**, **`scripts/fontshare.mjs`** e **`scripts/comparar.mjs`** (veja abaixo).
- **Conferência do `00-base`** (`npm run conferir -- 00-base`, completa, 191 s): **0 quebra, 0 errado, 5 aviso**.
  Os avisos são quadros longos com a CPU 4× mais lenta, todos no carregamento da página (o maior, 140 ms, no
  artigo MDX com lousas; a troca de página tem 58 ms e a rolagem do artigo, 55 ms). Sem salto de layout, sem
  animação de layout, sem rolagem lateral em 390, 768 e 1440px nos dois temas. As aberturas levam ~0,72 s
  (home) e ~0,37 s (outras), o pulo por tecla leva 59 ms, a troca de página usa View Transition sem abertura,
  e a troca de tema leva ~0,6 s. Foi essa conferência que achou (e a base corrigiu) o cabeçalho do 00-base
  estourando no celular, os links entre posts dando 404 e o PDF da apresentação.
- **Comparação por pixel com o blog** (`npm run comparar`, dois temas, 138 casos): livros 3D (fixo e fluido),
  capas planas, lombadas e ilustrações de card **idênticos** (diferença máxima de 1 a 2 níveis por canal;
  no máximo 0,15% dos pixels acima do limiar no ícone da lombada, serrilhado de traço fino). Ilustração do topo (as 6 primeiras da
  amostra): 4 idênticas em cada tema. **Duas diferem**, `jackson-filtros-mascarando-cartao` e `java-29`
  (~0,5% dos pixels): só o espaçamento dos glifos do texto mono girado dentro do desenho (o texto fica cerca de
  meio pixel mais largo na base). Estilo computado igual, causa não achada. Ficou como risco.
- Duas correções na base saíram da comparação: a proporção da ilha do recorte médio agora é a do blog (3/2, de
  `PROPORCOES`, e não a do viewBox, 637×424) e o `.ilha-miolo` devolve o idioma (`-webkit-locale`) que o
  `all: initial` zerava.

### Riscos e decisões para o orquestrador

- **Fontes do Fontshare num repositório público.** A licença ITF FFL permite servir no site, mas proíbe
  redistribuir por repositório. `redesenho/src/fontes/**/*.woff2` **não está no `.gitignore`** (a base não edita
  a configuração da raiz): sugestão, incluir `redesenho/src/fontes/**/*.woff2` no `.gitignore`. O
  `fontshare.mjs` baixa os arquivos como vêm, sem subsetar nem converter. A Switzer variável já estava na pasta
  (mesmos nomes do script); rodei `fontshare -- switzer 1 2` só para gerar o `fontes.css` e o `fontes.json`.
  O caminho de download foi testado contra um servidor local de mentira, e a API real, com `--simular`;
  nenhum arquivo novo foi baixado da rede.
- **Isolamento das ilhas** por PostCSS e peso de seletor (`:not(#_)`), e não por `@layer`: decisão a confirmar
  (o Expressive Code e o CSS dos modelos ficariam fora das camadas).
- **Dev do blog temporário** na 4322 (`--ignore-lock`) só para comparar; parado no fim.
- **Fora da base, de propósito**: a apresentação do NotebookLM só tem os slides rolando de lado e o link do PDF
  (os botões `hidden` e o contador são JS do blog). As notas laterais abrem no lugar (`:target`); um modelo
  com coluna de margem posiciona a nota ao lado. O posicionamento das notas escritas da caneta existe em
  `comum/caneta.ts`.
- **Navegadores**: o modo fluido do livro usa `round()` do CSS e a troca de tema usa os tipos da View Transition
  (Chrome 125+; sem eles, a troca é direta). A conferência usa o Chrome da máquina.
- **Ordem do CSS**: `ilhas.css` chega antes de `livro.css`; regra nova nele que precise vencer o CSS do blog
  leva `.ilha-livro >` a mais no seletor.
- Nos quadros longos de carregamento (avisos da conferência), a parte do modelo é a abertura; o restante é
  o HTML e o JS da página. Cada modelo tem de medir o dele.

### Comparar com o blog

`npm --prefix redesenho run comparar -- [--tema light|dark] [--so livros|ilustracoes] [--slug parte]`, com o
blog no ar em outra porta (`fnm exec --using=24 npx astro dev --host 127.0.0.1 --port 4322 --ignore-lock`,
na raiz do blog; pare depois pelo PID). Para cada peça, abre a página do blog e a `/00-base/amostra/`, esconde
todo o resto sobre magenta, põe a peça em posição de pixel inteiro (`position: fixed`), fotografa e compara com o
`sharp`. Casos: livro 3D 300px (fixo e fluido), capa 480, lombada 220 (com o `--u` da base no blog), card e
topo de cada ilustração. O relatório e, para cada diferença, o par e o mapa ficam em
`.astro/depuracao/redesenho/comparacao/`. Sai com 1 se algum caso diferir.

## Estrutura e comandos

```
redesenho/
  package.json  tsconfig.json  astro.config.mjs
  config/postcss-ilhas.mjs      o isolamento do CSS do blog (veja "Isolamento")
  scripts/                      conferir.mjs, fontshare.mjs e comparar.mjs
  src/
    content.config.ts           a coleção do blog
    comum/                      a base (sem visual próprio)
    modelos/00-base/            o molde
    fontes/<slug>/                as fontes do Fontshare (fontshare.mjs)
    pages/                      as rotas: index, 00-base/, livros/, posts/[slug]/apresentacao.pdf, busca.json
```

Todos os comandos rodam da raiz do blog, com o Node 24. O `astro`, o Playwright e o resto vêm do
`node_modules` da raiz.

| O quê | Comando |
|---|---|
| Subir (segundo plano, 4400) | `fnm exec --using=24 npm --prefix redesenho run dev` |
| Estado / logs / parar | `… run status`, `… run logs`, `… run stop` |
| Build | `… run build` (122 páginas em `redesenho/dist`) |
| Preview (4401, segundo plano) | `… run preview` e `… run stop:preview` |
| Tipos | `… run check` |
| Conferir um modelo | `… run conferir -- <modelo> [--base URL] [--rapido] [--sem-filmes] [--sem-perf] [--hover "seletor"]` |
| Baixar uma fonte do Fontshare | `… run fontshare -- <slug> <estilos…> [--simular]` |
| Comparar livros e ilustrações com o blog | `… run comparar` |

(O `…` é `fnm exec --using=24 npm --prefix redesenho`.) O `dev` usa `astro dev --background`: o comando
volta na hora, o servidor fica vivo e o estado mora em `redesenho/.astro/dev.json` e `dev.log`. Mudar o
`astro.config.mjs` reinicia o servidor sozinho.

A porta 4400 é dos protótipos. O dev do blog (4321 ou 4322) não se toca; para comparar, suba um
segundo dev do blog noutra porta com `--ignore-lock`.

## Dados (`src/comum/dados.ts`, só servidor)

Montado sobre `src/lib/posts.ts`, `src/lib/estante.ts` e `src/lib/tags-svg.ts` do blog: os mesmos
posts, livros e ordem.

- `artigos()`, `artigo(slug)`, `vizinhos(slug)` (anterior e próximo, sempre na ordem cronológica global),
  `maisRecente()`. Um `Artigo` traz `slug`, `entrada` (para `render(a.entrada)`), `titulo` (o assunto),
  `complemento`, `tituloCompleto`, `descricao` (texto), `descricaoHtml`, `publicado`, `atualizado`, `tags`,
  `livro` (o id), `livroSlug`, `livroNome`, `ehSerie`, `cor`, `minutos`, `codigo` e `ilustracao`.
- `livros()`, `categorias()`, `series()`, `livro(chave)`, `livroDoArtigo(a)`, `artigosDoLivro(chave)`. Um
  `LivroDados` é o `Livro` do blog mais `slugUrl`, `artigos`, `total`, `ultimo`, `primeiro` e
  `rotuloDoVolume`. São 8 categorias (IA e Carreira ainda sem artigos) e a revista da série Java.
- `tags()`, `tag(nome)`, `artigosDaTag(nome)`, `tagsJuntas(nome, limite)`, `tagsDoLivro(chave, limite)`.
  Uma `TagDados` traz `nome`, `slug` (o do ícone), `total`, `artigos`, `livros` (cada um com a contagem
  da tag nele) e `ultimo`.
- Formatos (`formatos.ts`, também no navegador): `dataCurta` ("10 set 2026"), `dataLonga`,
  `mesEAno`, `dataIso`, `tempoDeLeitura(min)`, `plural`, `contagemDeArtigos`,
  `tituloEmDuasPartes(titulo)` (`{ assunto, complemento }`), `mdEmLinha`, `semMd`.
- `tituloHtml(a)`: o título com `.titulo-principal` e `.titulo-sub` (e o travessão em `.sr`), para
  `set:html`. **O modelo estiliza as três classes.**

## Rotas (`src/comum/url.ts`)

`rotas("01-grade")` devolve as rotas do modelo: `home()`, `post(slug)`, `categorias()`,
`categoria(nome)` (nome cru, codificado), `serie(chave)`, `livro(l)` (a categoria ou a série),
`tags()` e `tag(nome, { livro })` (com `?livro=<slug>`). `slugDoLivro(id)` e `comLivro(url, livro)`.

**Nunca** use `resumo.url`, `urlRotulo`, `livro.href` nem `urlTag()` do blog nas páginas de um modelo:
eles apontam para as rotas do blog, sem o prefixo.

As rotas de cada modelo repetem as do blog debaixo do prefixo: `/NN-nome/`, `/posts/<slug>/`,
`/categories/`, `/categories/<Nome>/`, `/series/<chave>/`, `/tags/` e `/tags/<Nome>/`.

## Livros

Componentes em `src/comum/`. Cada um é uma **ilha** (veja "Isolamento"): o desenho é o do blog, pelos
componentes do blog (`LivroEmPe` → `Livro3D` → `Capa` e `MioloLombada`), e o CSS do modelo não o altera.

- `<Livro3D livro altura folhas giro inclinacao transicao class style />`. `altura` é um número (px,
  medidas idênticas às do blog) ou uma medida CSS (`"clamp(300px, 40vw, 520px)"`, o modo fluido). O
  padrão é 420. Os livros grandes dos modelos têm de 300 a 600px.
- `<Capa livro largura />` (padrão 320px; número ou medida CSS). A capa plana, 480 × 720.
- `<Lombada livro altura numero />` (padrão 240px). A lombada em pé, proporcional ao livro. `numero`
  troca o número do pé (a página da tag usa o da tag). Para link e hover, envolva no seu `<a>`.
- A revista (série Java) sai pelos mesmos componentes: `Capa` desenha a capa da revista.

**O ângulo do livro 3D.** As custom properties do envoltório `.ilha-livro` (ou de qualquer ancestral):

| Propriedade | O que faz | Padrão |
|---|---|---|
| `--livro-giro` | giro em torno do eixo vertical (0deg mostra a capa de frente; 90deg, a lombada) | `38deg` (o do blog) |
| `--livro-inclinacao` | inclina para frente ou para trás | `0deg` |
| `--livro-perspectiva` | a distância da perspectiva | 4,7 vezes a altura |
| `--livro-giro-duracao`, `--livro-giro-curva` | a transição do giro | `0.6s`, a curva do blog (`0s` desliga) |

`--livro-giro` e `--livro-inclinacao` são registradas (`@property`), então animam por `transition`, por
`@keyframes` e por GSAP. Um `transition` no `.cartao:hover { --livro-giro: 12deg }` já funciona, porque
a transição está no `.livro-3d`. Para gestos contínuos (mouse, rolagem), escreva `--giro` (e
`--inclinacao`) direto no `.livro-3d` com JS: são registradas **sem herança**, e mudar uma delas
recalcula só esse elemento, e não os traços do desenho. As props `giro` e `inclinacao` do componente só
escrevem o valor inicial no envoltório.

A estrutura: `.ilha-livro > .ilha-miolo > .livro-em-pe (ou .livro-fluido) > .livro-3d-caixa > .livro-3d`,
com `.livro-3d` girando (`transform: rotateX(var(--inclinacao)) rotateY(var(--giro))`).

Não ponha `filter`, `mix-blend-mode`, `clip-path`, `mask` nem `overflow` diferente de `visible` **em
elementos dentro do livro** (achatam o 3D). No envoltório `.ilha-livro` e acima, pode.

`view-transition-name`: o padrão é nenhum. Dois livros com o mesmo nome numa página cancelam a
transição. `transicao="fixa"` dá o id do livro como nome (único por página).

## Ilustrações

`<Ilustracao slug recorte cor tamanho anotacoes decorativa inteira palco class style />`

- `recorte`: `"largo"` (1100 × 468, o topo do artigo no computador, com `anotacoes`), `"medio"` (3:2, o
  card e o topo no celular), `"quadrado"` e `"og"`. A ilha tem a proporção do recorte (`aspect-ratio`) e
  ocupa a largura do lugar onde entra.
- `tamanho`: a espessura do traço, `"topo"` (padrão), `"cartao"` ou `"miniatura"`.
- `palco`: o palco tingido pela cor do livro (o `.painel` do blog). Sem ele, as áreas cheias do desenho
  usam `--fig-bg` (ou o papel do blog): ponha `--fig-bg` no envoltório com a cor da superfície do modelo.
  O raio do palco é `--ilha-raio` (padrão 10px; no card e no topo do blog é 0).
- A página precisa de `<DefinicoesIlhas />` logo depois de `<body>` (o filtro do tremor e a hachura).
- Os dois temas vêm sozinhos (a tinta e o papel são os tokens do blog).
- A fumaça da caneca (série Java) sobe ao passar o mouse na ilha ou num ancestral com `data-fumaca`.
- Post sem ilustração: o componente não desenha nada (`artigo.ilustracao` diz se tem).

## Ícones das tags

`<IconeTag nome tamanho />` (servidor) e `iconeDaTag(nome, { classe, tamanho })` (`icones-tags.ts`, o
SVG em texto, para `set:html`). O ícone herda a cor do texto. Ganchos de CSS: `--traco-tag` (1.3px),
`--papel-da-tag` (a cor da superfície onde ele fica; o padrão é `Canvas`, então **defina**) e
`--tamanho-da-tag` (32px). Tag sem ícone quebra o build.

## Isolamento

O CSS do blog (`livro.css`, `desenho.css`, `lousa.css`) foi escrito para uma página só. Sem cuidado, o
CSS do livro pegaria classes do modelo (`.capa`, `.lupa`, `.controles`) e o do modelo (`.card p`,
`.card svg`) venceria o do livro. A base resolve sem editar nada em `src/`:

1. `config/postcss-ilhas.mjs` reescreve os seletores desses três arquivos: tudo passa a valer só dentro
   de `.ilha-miolo` (as lousas: dentro das raízes delas) e ganha o peso de um id (`:not(#_)`). As classes
   de um modelo não o vencem.
2. Cada componente cria duas caixas: `.ilha` (o envoltório, do modelo: posição, `transform`, `filter`,
   `opacity`, hover, grid) e `.ilha-miolo` (a fronteira: `all: initial`, a base tipográfica do `body` do
   blog e os tokens do blog nos dois temas).
3. Os tokens do blog (`src/styles/tokens.ts`) valem só no miolo e nas raízes `.lousa-tempo`,
   `.lousa-loop` e `.frase-destaque` (`ilhas-tokens.ts`, embutido no `<head>` pela `Cabeca`). Os `--ink`,
   `--paper` etc. do modelo continuam sendo os do modelo, fora das ilhas.

Nas lousas, a figura mantém as regras dela (o modelo pode dar margem), e a frase em destaque ganha o peso
de id. Para deixar a lousa com a cara do modelo, sobreponha os tokens dela na raiz
(`.prosa .frase-destaque { --ink: var(--tinta-do-modelo) }`).

O que o modelo **não** deve fazer: estilizar `svg`, `p`, `span` ou `div` por elemento dentro de uma
ilha, ou pôr `!important` em algo que alcance o miolo.

## Tema (`src/comum/tema.ts`, cliente)

O tema é sempre `html[data-theme="light"|"dark"]`, posto antes da primeira pintura por `tema-head.js`
(a `Cabeca` embute): `localStorage["redesenho-tema"]` ou, sem escolha, o sistema. O `color-scheme` do
`<html>` acompanha, e `html[data-js]` marca que há JS. Sem o atributo (sem JS), o tema é o claro.

- `temaAtual()`, `definirTema(t, origem)`, `alternarTema(origem)`, `aoMudarTema(fn)`.
- Todo `<button data-tema-alternar>` funciona ao importar o módulo e mantém `aria-pressed`.
- A troca anima por `document.startViewTransition`. O módulo só prepara o terreno; a animação é do
  modelo. Durante a troca há, no `<html>`, `--tema-x` e `--tema-y` (o centro da origem, em px),
  `--tema-r0`, `--tema-raio` (o raio que cobre a tela), a classe `trocando-tema` e
  `data-tema-para="dark|light"`, e os tipos da View Transition `tema` e `tema-escuro` ou `tema-claro`.
  O evento `tema:mudou` (em `window`) sai depois de aplicado. O `00-base` tem o círculo de exemplo em
  `base.css`. Sem View Transitions, ou com movimento reduzido, a troca é direta.

## Movimento e as aberturas (`src/comum/movimento.ts`, cliente)

O contrato do `data-abertura`. O script de `movimento-head.js` (embutido pela `Cabeca`) decide antes da
primeira pintura:

- `html[data-abertura="home"]`: abertura da página inicial do modelo (`/NN-nome/`);
- `html[data-abertura="pagina"]`: abertura de qualquer outra página do modelo;
- sem o atributo: a página aparece como está.

O atributo só existe ao **recarregar** ou ao **chegar de fora do modelo** (link de outro site, endereço
digitado, a lista dos modelos, outro modelo), sem movimento reduzido e com JS. Navegar entre páginas do
mesmo modelo é a troca de página (View Transition), sem abertura. Uma **trava de 4s** tira o atributo
sozinha e o CSS do modelo esconde só o que o script vai mostrar, então nada fica escondido se o script
falhar. Ao acabar (o modelo, o leitor pulando ou a trava), sai o evento `abertura:fim` em `window`
(`detail: { tipo, motivo }`).

- `reduzido()`, `chegouDeFora()` (o valor de quando a página abriu), `aberturaAtiva()`,
  `encerrarAbertura()`.
- `aoAbrir(({ tipo, sinal, pular }) => …)`: toca a abertura se ela deve tocar, deixa o leitor pular
  (clique, toque ou tecla, menos Tab e atalhos com Ctrl, Cmd ou Alt; o `sinal` aborta e a animação vai ao
  fim) e encerra sozinha quando a promessa resolve. A rolagem nunca é presa.
- `carregarGsap(["Flip", "SplitText"])`: o GSAP sob demanda, com os plugins pedidos registrados
  (ScrollTrigger, ScrollToPlugin, Flip, Draggable, InertiaPlugin, Observer, SplitText, DrawSVGPlugin,
  MorphSVGPlugin, MotionPathPlugin, TextPlugin, ScrambleTextPlugin, CustomEase, CustomBounce,
  CustomWiggle, Physics2DPlugin, PhysicsPropsPlugin). O ScrollSmoother fica de fora: sequestra a rolagem.

## Filtro por livro (`src/comum/filtro.ts`, cliente)

Funciona ao importar, em todo `[data-filtro]`. O contrato do HTML: os controles são
`[data-filtro-livro="<slug>"]` com `aria-pressed` (o valor vazio limpa), os itens são
`[data-livro="<slug>"]`, e `[data-filtro-status]` e `[data-filtro-vazio]` são opcionais. O slug é o de
`artigo.livroSlug` ("dados", "java"). Clicar mostra só o livro; clicar de novo limpa. O `?livro=` é lido
ao abrir e escrito com `replaceState`. Sem JS, tudo aparece (esconda os controles sem `html[data-js]`).

Os eventos saem no `[data-filtro]` e sobem:

- `filtro:antes` (cancelável), antes de mexer no DOM. `detail: { livro, anterior, visiveis, ocultos,
  inicial, aplicar }`. Hora de guardar o estado de um FLIP. Se o ouvinte chamar `preventDefault()`, o
  filtro não aplica sozinho: chame `detail.aplicar()` depois da animação de saída.
- `filtro:depois`, com `hidden`, `aria-pressed` e a URL já certos. Hora do FLIP e da entrada.

O escopo ganha `data-filtro-atual="<slug>"` enquanto há filtro.

## Busca (`src/comum/busca.ts` e `/busca.json`)

`buscar(termo, { limite })` baixa `/busca.json` uma vez e procura sem acento e sem diferença de caixa em
título, subtítulo, descrição em texto, tags e nome do livro; todo termo precisa aparecer, e `#Tag`
filtra pela tag. `destacar(texto, termo)` devolve o HTML com `<mark>`. As URLs dos achados são do modelo
(`rotas(modelo).post(slug)`). O endpoint é `src/pages/busca.json.ts`.

## O código dos posts (`src/comum/codigo.ts`, cliente)

Importe para o botão Copiar ganhar a classe `copiado` por 1,6s depois de copiar (o Expressive Code avisa
por um nó `.feedback` novo em `.copy`). No blog isso é o gesto do site (`copiado.ts`); os modelos fazem o
deles em `.expressive-code .copy button.copiado`.

## Os tokens que o conteúdo dos posts exige do modelo

O Expressive Code é configurado igual ao do blog e lê CSS do modelo. Defina em `:root`, nos dois temas:

- `--rule`, `--ink`, `--paper`, `--font-codigo` e `--font-ui`: a borda, os textos e as fontes do bloco
  (`styleOverrides` em `astro.config.mjs`);
- `--paper-hi`, `--ink-2` e `--acento`: o botão Copiar (`pluginCopiar`, em `src/lib/codigo.ts`);
- `--cor`: a cor do livro do artigo, num ancestral do texto (as lousas usam). O `00-base` a põe no
  `<article>` (`style="--cor:${artigo.cor}"`).

As cores do código em si (o realce de sintaxe) vêm do tema do blog, claro e escuro, pelo
`html[data-theme]`; para um modelo cujo tema claro não é claro, sobreponha as variáveis `--ec-*` na
`.expressive-code` (o bloco usa `--ec-*` do Expressive Code).

## A prosa do artigo (`Prosa.astro` e `prosa-base.css`)

Todo modelo renderiza o texto do post assim (o `00-base` faz igual):

```astro
import Prosa from "@comum/Prosa.astro";
import "@comum/prosa-base.css";        // ou @import "../../comum/prosa-base.css" no CSS do modelo
const { Content } = await render(a.entrada);
<Prosa modelo="01-grade"><Content /></Prosa>
```

- `Prosa` põe `<div class="prosa" data-corpo>` em volta e **reescreve no servidor** os links do Markdown para
  o blog (`/posts/<slug>/`, `/series/…`, `/tags/…`, `/categories/…`) para o prefixo do modelo. Sem ele, todo link
  de um post para outro dá 404. Arquivos (`.pdf`, `.svg`) e links externos ficam como estão.
- `prosa-base.css` é a prosa neutra: parágrafos, títulos, listas, citação, imagens (o diagrama antigo num quadro,
  invertido no escuro), tabelas, `details`, KaTeX, respiro do código, Copiar, avisos, notas laterais e a caneta
  inteira (posições, tamanhos e traços dos `svg.caneta-svg`). Tudo em `.prosa`. Lê `--ink`, `--ink-2`, `--paper`,
  `--paper-hi`, `--well`, `--rule`, `--acento`, `--font-titulo`, `--aviso-*`, `--marca-texto` e `--caneta`, e os
  ganchos `--prosa-corpo`, `--prosa-entrelinha`, `--coluna`, `--raio-painel`, `--quadro`, `--link-tinta` e
  `--folga-ancora`. O modelo importa o arquivo e sobrepõe o que quiser (`.prosa h2 { … }`), ou não importa e
  escreve o dele (aí todo `svg.caneta-svg` precisa de CSS, veja abaixo).
- `import "@comum/caneta"` mede as notas escritas da caneta (acima da palavra, ou depois, se não couberem).
  As marcas de margem da caneta ficam dentro do parágrafo (com recuo); com respiro de 30px à esquerda do texto,
  ponha `class="prosa-margem-fora"` na `.prosa`.
- As notas laterais abrem no lugar, por `:target` ou pela classe `.aberta`.

## O HTML que os plugins geram no artigo

O modelo estiliza. (Conferido na saída do dev, no post `cobranca-duplicada-no-retry`.)

- **Títulos**: `h2`, `h3` com `id` no estilo github-slugger (com acento). Sem link de âncora.
- **Avisos** (`> [!DICA]`): `aside.aviso[data-aviso="nota|dica|importante|atencao|cuidado"][aria-label]`
  com um `svg` (ícone, 24 × 24) e `div.aviso-corpo`; o rótulo é `strong.aviso-rotulo` no primeiro parágrafo.
- **Notas laterais** (`[^1]`): `sup.ref-nota > a[data-ref-nota][href="#nota-1"]` e, logo depois,
  `span.nota-lateral#nota-1[role="note"]` com `span.numero-nota` e o texto.
- **Tabelas**: `div.tabela[role="region"][tabindex="0"][aria-label="Tabela: …"] > table`; o código em
  linha ganha `<wbr>` depois de cada ponto.
- **Código** (Expressive Code), o HTML real, abreviado:

  ```html
  <div class="expressive-code">
    <link rel="stylesheet" href="/_astro/ec.<hash>.css"/><script type="module" src="/_astro/ec.<hash>.js"></script>
    <figure class="frame has-title" style="--linhas:11">
      <figcaption class="header"><span class="title">cobranca.sql</span> <span class="linguagem">SQL</span></figcaption>
      <pre data-language="sql"><code>
        <div class="ec-line"><div class="code"><span style="--0:#2549B8;--1:#93AEFF">CREATE</span>…</div></div>
        …
      </code></pre>
      <div class="copy"><div aria-live="polite"></div>
        <button title="Copiar" data-copied="Copiado" data-code="…" class="gesto-copiar"><svg…/><span class="rotulo-rola" aria-hidden="true"></span></button>
      </div>
    </figure>
  </div>
  ```

  `.frame` ganha `has-title`, `is-terminal` ou `sem-titulo`. As cores do código são as variáveis `--0` (claro) e
  `--1` (escuro) de cada `span`, que o CSS do Expressive Code escolhe pelo `html[data-theme]`. O botão Copiar só
  aparece com o mouse ou o foco no bloco; `@comum/codigo` põe `.copiado` nele por 1,6 s. `--linhas` alimenta o
  `content-visibility: auto` do bloco (o bloco fora da tela não é desenhado: numa foto de página inteira, force
  `.frame { content-visibility: visible }`).
- **KaTeX**: `span.katex` e `span.katex-display`; o CSS é `/katex/katex.min.css` (a `Cabeca` liga com `katex`).
  Se `public/katex/` não existir, rode `npm run predev` na raiz.
- **Imagens** de diagramas antigos: `img[src$=".svg"]`, com fundo branco embutido.
- **Caneta**: `mark.caneta-marca`; `span.caneta` com `caneta-circulo` (e `longo`), `caneta-ondulado`,
  `caneta-duplo`, `caneta-caixa`, `caneta-liga`, `caneta-nota` (com `span.caneta-alvo` e
  `span.caneta-escrita.caneta-nota-texto`), `caneta-riscado` (com `s` e `span.caneta-correcao`) e
  `caneta-sinal`; em volta de parágrafo, `div.caneta-margem` com `caneta-colchete`, `caneta-asterisco`,
  `caneta-exclamacao` ou `caneta-pergunta`, e `div.caneta-comentario`; em listas, `caneta-caixas`,
  `caneta-certo-errado`, `caneta-passos` e `div.caneta-chave`; no código, `caneta-codigo-circulo`,
  `caneta-linhas-barra` e `caneta-nota-codigo`. Os traços são `svg.caneta-svg` decorativos, e `span.caneta-sr`
  traz o sentido para o leitor de tela. **Todo `svg.caneta-svg` precisa de CSS** (`position: absolute` e
  tamanho), senão cresce como um SVG solto. A letra à mão (Caveat) só é declarada nos posts com nota escrita
  (`caneta` na `Cabeca`).
- **Frase em destaque** (`FraseDestaque`, MDX): `blockquote.frase-destaque[data-frase-destaque] > p >
  span.palavra…` (uma por palavra). Acende com a rolagem (classe `animada`, pelo script do blog).
- **Lousas** (`LousaTempo`, `LousaLoop`, MDX), vêm com CSS e script próprios (ilhas):

  ```html
  <figure class="lousa-tempo" data-lousa-tempo data-estados='[{"de":0,"texto":"1 de 5 · …"},…]' data-pagefind-ignore>
    <div class="lousa area"><svg role="img" aria-label="Diagrama: …" viewBox="0 0 560 430"><g class="traco">…</g></svg></div>
    <div class="controles" hidden>  <!-- o script do blog mostra -->
      <button class="tocar" aria-pressed="false" aria-label="Reproduzir">…</button>
      <input type="range" min="0" max="1000" step="1" value="0">
      <span class="estado"><span class="atual" aria-live="polite">1 de 5 · …</span><span class="reserva" aria-hidden="true">…</span>…</span>
    </div>
    <figcaption hidden><span class="legenda-mouse">…</span><span class="legenda-toque">…</span></figcaption>
  </figure>

  <figure class="lousa-loop" data-lousa-loop data-duracao="5.2" data-parado="0.9" data-pagefind-ignore>
    <div class="lousa"><svg>…</svg></div>
    <div class="barra-tempo" aria-hidden="true"><span class="preenchido"></span><span class="marca" style="left:47%"></span><span class="rotulo-marca">a resposta se perde</span>…</div>
    <div class="controles-loop"><figcaption>…</figcaption>
      <span class="botoes" hidden><button class="botao" data-recomecar>Recomeçar</button><button class="botao" data-pausar aria-pressed="false">Pausar</button></span></div>
  </figure>
  ```

  Sem JS a lousa mostra o desenho no fim, sem controles. O modelo pode dar margem à figura (`.prosa
  .lousa-tempo { margin-block: … }`) e trocar os tokens dela na raiz (`.prosa .frase-destaque { --ink: … }`).
- **Apresentação** (NotebookLM, só nos posts com deck): `section.apresentacao > ul.slides` (rola de lado, com
  scroll-snap) e `.barra-slides` com o link "Baixar PDF" (`/posts/<slug>/apresentacao.pdf`, que a base serve).

## Fontes do Fontshare (`scripts/fontshare.mjs`)

`npm --prefix redesenho run fontshare -- <slug> <estilos…> [--simular]` baixa o `.woff2` da API
(`https://api.fontshare.com/v2/css?f[]=<slug>@<estilos>`) para `redesenho/src/fontes/<slug>/` e escreve o
`fontes.css` (um `@font-face` por arquivo, `font-display: swap`) e o `fontes.json` (o registro da pasta).

- Estilos das variáveis: `1` (normal) e `2` (itálico). Das estáticas: o peso (`400 700`), e o itálico é o peso
  + 1 (`401 701`).
- Nomes: `Switzer-Variable.woff2`, `Switzer-VariableItalic.woff2`, `Satoshi-400.woff2`,
  `Satoshi-400Italic.woff2`. Arquivo que já existe não é baixado de novo.
- **Nunca subsete, converta nem edite** o arquivo (licença ITF FFL). Nada de `.woff2` no git (veja "Riscos").
- No CSS do modelo: `@import "../../fontes/<slug>/fontes.css";`. `--simular` mostra o que baixaria.

## Conferência automática (`scripts/conferir.mjs`)

`npm --prefix redesenho run conferir -- <modelo>` (Playwright, Chrome da máquina; ~3 min; `--rapido` leva ~80 s,
só 390 e 1440px, tema claro, sem filmes nem performance). Sai com 1 se houver "quebra" ou "errado". A saída
fica em `.astro/depuracao/redesenho/<modelo>/conferencia/`: `relatorio.md` e `.json`, `capturas/`,
`folha-de-contato.png` e `filmes/`.

- **Páginas**: home, artigo `.md`, artigo `.mdx` com lousa, Categorias, um livro, Tags e uma tag (a que passa
  por mais livros), descobertas por `/busca.json`; 390, 768 e 1440px × claro e escuro, cada uma num contexto
  novo. Confere console, rede, resposta 4xx/5xx, rolagem lateral (com os culpados), `alt`, fontes, livros e
  ilustrações com tamanho, o que segue invisível depois de rolar e os links internos.
- **Movimento reduzido**: sem `data-abertura` e nada invisível. **Sem JS**: texto presente e nada escondido.
- **Chegadas**: a abertura da home e a das outras páginas (armadas só ao chegar de fora, acabam em até ~2,5 s,
  `abertura:fim`, pulo por tecla, voltam ao recarregar) e a troca de página (sem abertura, com View
  Transition). Filmes: quadros do screencast de 0 a 3 s e uma tira (`filmes/tira-*.png`).
- **Tema**: clica em `[data-tema-alternar]`, confere a troca, a animação (`trocando-tema`), o `localStorage` e
  que a página seguinte já nasce no tema (sem piscar). **Filtro**: cada `[data-filtro-livro]` mostra só o
  livro, escreve `?livro=`, marca `aria-pressed` e limpa; abrir a URL com `?livro=` já vem filtrada.
- **Performance com a CPU 4×**: quadros longos (mais de 50 ms) na abertura + carregamento, na troca de página,
  no hover dos cards (o seletor padrão é `.cartao-livro, .card, .cartao, [data-card], [data-cartao], .estante
  a, .item a`; mude com `--hover "seletor"`), na rolagem do artigo e na troca de tema; salto de layout; e
  animação que mexe em propriedade de layout (WAAPI e `style`; os pseudo-elementos da View Transition não
  contam). Três ou mais quadros longos, ou um acima de 200 ms, é "errado"; menos, "aviso".

Com `--raiz`, o mesmo script confere uma cópia do blog atual (veja "Rodada 2: cópias do blog atual", abaixo).

Um modelo novo cumpre o contrato para a conferência funcionar: `Cabeca` no `<head>`, `[data-tema-alternar]`
no botão do tema, `[data-filtro]`/`[data-filtro-livro]`/`[data-livro]` na tag, `aoAbrir()` nas aberturas e um
link visível para Categorias na home (a troca de página).

## Criar um modelo (passo a passo)

1. **Copie o molde.** `src/modelos/00-base/` para `src/modelos/NN-nome/` e `src/pages/00-base/` para
   `src/pages/NN-nome/`. Troque `"00-base"` por `"NN-nome"` em todo `rotas(...)`, na `Cabeca` (`modelo=`), em
   `Prosa` (`modelo=`) e nos `import` relativos (`../../../modelos/00-base/…`).
2. **Tokens e fontes.** No CSS do modelo (`base.css` dele), defina nos dois temas (`:root` e
   `html[data-theme="dark"]`) os tokens da seção "Os tokens que o conteúdo dos posts exige", as fontes
   (`@import "../../fontes/<slug>/fontes.css"` ou Fontsource) e `--altura-topo` (a âncora dos títulos). Sem
   `data-theme` (sem JS), o tema é o claro.
3. **Layout e páginas.** Mexa em `Layout.astro` (cabeçalho, rodapé, menu, botão de tema com
   `data-tema-alternar`), nas páginas e nos componentes. Livros e ilustrações vêm de `Livro3D`, `Capa`,
   `Lombada` e `Ilustracao`; o ícone da tag, de `IconeTag`; o texto do post, de `Prosa`. `<DefinicoesIlhas />`
   logo depois de `<body>`, `import "@comum/tema"` e `import "@comum/codigo"` (e `caneta`, se o modelo
   posiciona as notas) no script do layout.
4. **Prosa.** Importe `prosa-base.css` e sobreponha; ou escreva a sua (avisos, tabelas, notas, caneta, código,
   citação, imagens). Confira no `cobranca-duplicada-no-retry` (lousas, frase, caneta) e no
   `bloqueio-otimista-e-pessimista`.
5. **As três chegadas.** Abertura da home e das outras páginas com `aoAbrir(({ tipo, sinal }) => …)` (esconda só
   o que o script mostra: `html[data-abertura] .alvo { opacity: 0 }`), e a troca de página com
   `@view-transition { navigation: auto }` e os `::view-transition-*`. Troca de tema pelas variáveis
   `--tema-x/-y/-raio` (o exemplo está no `base.css` do molde).
6. **Filtro por livro** na tag: `data-filtro` no escopo, `data-filtro-livro` nos controles, `data-livro` nos
   itens; o `filtro.ts` cuida do resto e emite `filtro:antes`/`filtro:depois` para o FLIP.
7. **Registre** o modelo em `src/comum/modelos.ts` (`status`) e rode `npm --prefix redesenho run conferir --
   NN-nome`. Para a igualdade dos livros e das ilustrações, `comparar` (só muda se a base mudar).

## Armadilhas encontradas

- A coleção do blog lê `./src/content/posts` relativo à raiz do projeto. Como a raiz aqui é `redesenho/`,
  `astro.config.mjs` põe `PASTA_POSTS` absoluto antes de o Astro carregar a coleção.
- As rotas de post falham inteiras (500) se um CSS importado no frontmatter não existir. O log
  (`… run logs`) diz qual.
- `livro.css` usa `:root`, `data-livro-gira` e `.lupa`, que só fazem sentido no blog: o PostCSS os
  reescreve ou remove. Selector novo no CSS do blog que a base não conheça sai com aviso no terminal
  (`[redesenho:ilhas] … seletor sem tratamento`).
- O dev do blog pode não estar no ar quando você precisar comparar. Suba um temporário com
  `--ignore-lock` noutra porta e pare depois.
- O macOS não diferencia maiúsculas nos caminhos e o Linux do CI diferencia; nomes de arquivo novos
  seguem o caso exato dos imports.

## Espelho do blog

`astro.config.mjs` copia os plugins de Markdown, o Expressive Code e a lista de plugins de
`../astro.config.mjs`, e `dados.ts` lê os módulos do blog. Se o blog mudar algo em `astro.config.mjs`
(plugins, Expressive Code, `markdown`), repita aqui. Mudou `src/styles/tokens.ts`? As ilhas seguem sozinhas
(`ilhas-tokens.ts` lê `cssDosTokens()`); se o formato daquela função mudar, `ilhas-tokens.ts` avisa no
build.

## Rodada 2: cópias do blog atual

Cinco pontos de partida para a segunda rodada de protótipos (`docs/redesenho/rodada-2/`). Cada um é uma
**cópia isolada do blog atual** (com os livros realistas da D57 e os recursos visuais da D58), com servidor
próprio. Diferente dos modelos da base, **não usam `redesenho/src/comum`**: é o blog inteiro (`src/` e
`public/` copiados), e o modelo nasce editando a cópia. As rotas são as do blog, sem prefixo.

### Estrutura

```
redesenho/novos/
  11-atual-cards/    4411     12-papelaria/   4412     13-luz/            4413
  14-grade-suave/    4414     15-estante-viva/ 4415
  <cópia>/
    astro.config.mjs   o da raiz, com a porta, o host, o `site`, a pasta dos posts absoluta,
                       o `fs.allow` da raiz do blog e o plugin do Pagefind no dev (veja "Armadilhas")
    package.json       mínimo (`type: module`, privado): dev, stop, status, logs, build, preview, check
    tsconfig.json      o da raiz
    src/               cópia de ../../../src (o que cada protótipo edita)
    public/            cópia de ../../../public, com o katex/ e o pagefind/
```

Os binários (`astro`, `pagefind`) e as dependências vêm do `node_modules` da raiz do blog: o Node os acha
subindo a partir da cópia. Não há `npm install` em lugar nenhum. A raiz do blog não enxerga as cópias
(`tsconfig.json` exclui `redesenho`), então `npm run check` e o build da raiz não mudam. Cada cópia tem a
própria `.astro/` (estado do dev, cache de conteúdo), fora do git.

### Comandos

Da raiz do blog, com o Node 24 e **a partir da pasta da cópia** (o `PASTA_POSTS` do config é absoluto, mas o
PDF da apresentação e o Astro leem relativo ao `cwd`):

```bash
cd redesenho/novos/11-atual-cards && fnm exec --using=24 npm run dev      # sobe em segundo plano (4411)
cd redesenho/novos/11-atual-cards && fnm exec --using=24 npm run status
cd redesenho/novos/11-atual-cards && fnm exec --using=24 npm run logs
cd redesenho/novos/11-atual-cards && fnm exec --using=24 npm run stop
```

Para subir ou parar as cinco de uma vez:

```bash
for n in 11-atual-cards 12-papelaria 13-luz 14-grade-suave 15-estante-viva; do
  (cd "redesenho/novos/$n" && fnm exec --using=24 npm run dev); done      # troque `dev` por `stop`/`status`
```

`npm run build` gera `dist/` da cópia (fora do git); `npm run preview` serve na porta do dev + 100 (4511 a
4515). Mexer no `astro.config.mjs` da cópia reinicia o servidor sozinho. A página inicial dos protótipos
(`http://127.0.0.1:4400/`) lista as cinco, com o endereço de cada uma (`url` em `src/comum/modelos.ts`).

### Base da rodada 3

`redesenho/novos/r3-base/` (porta **4430**, preview 4530) é a cópia do `14-grade-suave` (a de partida da
rodada 3, número 30 em `modelos.ts`), com o `astro.config.mjs` na 4430 e o tipo JSDoc do Pagefind corrigido
(o `astro check` não reclama dele). Mesma estrutura e mesmos comandos das outras cópias, a partir de
`redesenho/novos/r3-base` (`fnm exec --using=24 npm run dev`).

### A busca

A busca do blog usa o Pagefind, cujo índice só existe depois do build. Por isso:

1. Rode **uma vez** o build do blog na raiz (`fnm exec --using=24 npm run build`): o `postbuild` gera as
   imagens OG (Chrome) e o índice em `dist/pagefind/` (`dist/` está no `.gitignore`).
2. Copie `dist/pagefind/` para o `public/pagefind/` de cada cópia:
   `for n in 11-atual-cards 12-papelaria 13-luz 14-grade-suave 15-estante-viva; do rm -rf "redesenho/novos/$n/public/pagefind"; cp -R dist/pagefind "redesenho/novos/$n/public/pagefind"; done`
3. Abra a busca no dev (o botão do cabeçalho) e procure, por exemplo, `retry`: aparecem 8 resultados.

O índice é uma **foto dos posts de quando o build rodou**. Se os posts mudarem, refaça os passos 1 e 2. O
índice só enxerga as páginas do blog original (os links dos resultados valem em qualquer cópia, pois as
rotas são as mesmas).

### Conferência com `--raiz`

O `scripts/conferir.mjs` aceita `--raiz`: tira o prefixo do modelo (usa as rotas do blog) e troca o contrato
da base pelo do blog. O `<modelo>` serve só para a pasta de saída
(`.astro/depuracao/redesenho/<modelo>/conferencia/`).

```bash
npm --prefix redesenho run conferir -- 11-atual-cards --raiz --base http://127.0.0.1:4411 [--rapido]
```

| | Base (sem `--raiz`) | Blog (`--raiz`) |
|---|---|---|
| Páginas | descobertas em `/busca.json` | as do pedido (`bloqueio-otimista-e-pessimista`, `cobranca-duplicada-no-retry`, Arquitetura de Software, tag Spring), conferidas pelo `/rss.xml` |
| Botão do tema | `[data-tema-alternar]`, `redesenho-tema` | `[data-botao-tema]`, `cs-theme` |
| Escuro | `colorScheme` do navegador | o blog nasce sempre claro (D52, C01): a conferência grava `cs-theme=dark` antes da página |
| Abertura | `data-abertura` "home" / "pagina", `abertura:fim` | "estante" (home) / "caderno" (outras), `cs:aberto` (sem o motivo); limite 3,8 s |
| Filtro por livro | `[data-filtro-livro="<slug>"]`, itens `[data-livro]` | `button[data-filtro="livro-<slug>"]`, itens `li[data-livro]`, `?livro=<slug>` |
| Hover (padrão) | `.cartao-livro, .card, .cartao, …` | `.cartao-livro, .cartao, .lombada-visual` |
| Rolagem lateral | `scrollWidth > clientWidth` | só se o leitor consegue rolar de lado (o blog tem `overflow-x: clip` no `<html>`; a abertura estica o `scrollWidth` por um instante) |

Os falsos positivos do blog (`.chegou`, o "chegou ao fim" do sumário, e `.ficha-desfile`, peça da abertura de
Categorias) ficam de fora do "segue invisível". O resultado da 11 (o blog sem mudança) é a **régua do
"atual"**: o que a cópia 11 acusa é o que o blog já tem; só o que passar disso vem do protótipo. O
resumo está abaixo.

### A régua do "atual" (conferência completa da 11, 30/09/2026, 359 s)

`npm --prefix redesenho run conferir -- 11-atual-cards --raiz --base http://127.0.0.1:4411`: **1 quebra, 3
errado, 3 aviso**, sem erro no console, sem requisição quebrada, sem imagem sem `alt`, sem fonte que falhe,
sem link interno quebrado, sem rolagem lateral estável (390, 768 e 1440px, claro e escuro), com movimento
reduzido e sem JS a página nasce pronta. O que a 11 acusa é o que o blog já tem; o protótipo só responde
pelo que passar disso.

- **Aberturas** (`data-abertura`): home "estante" em 3,07 s (1440px) e 2,80 s (390px); as outras páginas,
  "caderno", em 2,45 a 2,47 s. A tecla pula em ~0,1 s; recarregar a home arma a estante de novo.
- **Troca de página**: View Transition, sem abertura. **Tema**: a troca leva ~0,6 s, grava `cs-theme` e a
  página seguinte já nasce escura. **Filtro por livro** na tag Spring: os 5 livros filtram, escrevem `?livro=`
  e limpam; a URL com `?livro=` já abre filtrada.
- **Performance com a CPU 4× mais lenta**: abertura + carregamento da home com 3 quadros acima de 50 ms
  (o maior, 219 ms: "errado" pelo limiar de 200 ms), do artigo MDX com 2 (206 ms: "errado"), de Categorias
  com 2 (158 ms: aviso); troca de página, 1 quadro de 119 ms; rolagem do artigo, 1 de 53 ms; hover nos
  cards e troca de tema, nenhum. CLS no máximo 0,003.
- **Animação de layout** (errado): a abertura anima `width`, `height`, `top` e `left` por `style` (a estante e
  o caderno que voa), e o sumário do artigo anima `width` e `grid-template-rows` (WAAPI). É o estado do blog:
  se o protótipo quiser a régua da base ("só transform, opacity e clip-path"), tem de trocar isso.
- **Rolagem lateral**: nada estável. Por ~0,6 s depois da abertura, a página aceita rolar de lado (até 117px em
  `/tags/` a 768px, as folhas ainda chegando); a conferência espera 1,3 s antes de medir. Sobrou 1 caso de 1px
  em Categorias a 390px escuro, que não repete sozinho (ficou como "quebra" do relatório).
- **Imagens iguais ao blog**: a home, os dois posts, Categorias, o livro, a série, Tags e a tag Spring da 4411
  saem **pixel a pixel iguais** à raiz (dev na 4322, movimento reduzido, 1440px claro e escuro e 390px claro:
  0 pixels acima do limiar, com uma exceção de 309 pixels, 0,014%, no livro Arquitetura a 390px).

### Armadilhas

- **Fontes com 403 (`/@fs/…/node_modules/@fontsource-variable/…`).** O Vite só serve arquivos de fora da raiz
  do projeto se a pasta estiver em `server.fs.allow`; o `node_modules` fica na raiz do blog, três pastas
  acima da cópia. O `astro.config.mjs` da cópia põe a raiz do blog em `fs.allow`. Sem isso, as fontes não
  carregam e o console enche de erro.
- **Busca com erro 500 no dev (`/pagefind/pagefind.js`).** O Vite recusa um `.js` de `public/` importado por
  `import()` ("should not be imported from source code"). A cópia leva um plugin no `astro.config.mjs`
  (`pagefindNoDev`) que serve `public/pagefind/` direto, antes do Vite. No build não é preciso.
- **Pasta dos posts.** A coleção lê `PASTA_POSTS` (padrão `./src/content/posts`, relativo ao `cwd`). O config
  da cópia a põe absoluta (`import.meta.url`), então vale subir de qualquer pasta; mesmo assim, suba **de
  dentro da cópia**, que é o que o `npm run dev` faz.
- **KaTeX.** O `predev` e o `prebuild` da raiz copiam o KaTeX para `public/katex/`; a cópia já leva essa pasta
  (copiada de `public/`), e o `package.json` mínimo não tem `predev`. Se o `public/` da raiz perder o
  `katex/`, rode `npm run predev` **na raiz** e copie de novo.
- **Rotas dos posts e livros (`/livros/<slug>.svg|.json`)** vêm do próprio `src/pages` copiado. Os arquivos
  `og/`, `rss.xml` e o sitemap também existem, mas o `postbuild` (imagens OG, Pagefind) **não** roda nas
  cópias: `/og/<slug>.png` só existe no `dist/` da raiz.
- **Git.** `src/` e `public/` das cinco cópias entram em `git status` (cerca de 8 MB cada) e
  `public/pagefind/` não é ignorado (`public/katex/` já é). Sugestão para o `.gitignore` da raiz (não editei
  a configuração): `redesenho/novos/*/public/pagefind/`, e decidir se as cópias vão para o repositório ou se
  ficam locais (`redesenho/novos/`).
- **Dev da raiz.** A 4322 (`--ignore-lock`) só é preciso para comparar com o blog; a conferência `--raiz` não
  precisa dele.
- **Largura do dev.** O primeiro acesso a cada rota é lento (o Vite compila); a conferência esquenta as
  rotas antes de medir.
