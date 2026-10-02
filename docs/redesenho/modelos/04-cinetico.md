# 04 · Cinético

Direção do modelo 04 do redesenho (D55). Quem constrói segue este arquivo, o
`docs/redesenho/README.md` e a API da base (`docs/redesenho/base.md`).

## Ideia

O modelo inspirado no **animejs.com**, que o Cesar achou "sensacional". O site é uma **máquina de
movimento**: formas geométricas nas **cores dos 8 livros** (a paleta do blog que já existe) montam,
desmontam e reagem ao mouse com mola. Tem grades de pontos em cascata, timelines que se entregam à
rolagem, texto que entra por letra e livros que se arrastam e voltam com inércia. É divertido e
enérgico, mas **o texto do artigo continua calmo**: o movimento mora na moldura (home, Categorias,
tags, cabeçalho e transições), nunca em cima da leitura.

Técnica: **anime.js v4** (MIT, aprovado pelo Cesar só para este modelo), carregado sob demanda.

## Cara

**Cores (tokens do modelo).**

| Token | Escuro (principal) | Claro | Uso |
|---|---|---|---|
| fundo | `#1F1E1D` | `#E4E0DA` | fundo (cinza quente, como o do animejs; no claro, o papel deles) |
| superficie | `#292826` | `#EFECE7` | cards |
| texto | `#F4F1EC` | `#1E1D1B` | texto |
| texto-2 | `#A8A39B` | `#5E5A54` | metadados |
| filete | texto a 10% | texto a 14% | filetes de 1px |
| acento | `#FF4B4B` | `#D92D2D` | o ponto vermelho: ativo, foco, o "." depois dos títulos (como no animejs) |

- **As cores dos livros** vêm de `src/livros/cores.js` / `livros.json`. Cada livro tem uma escala de 4
  passos, gerada por `color-mix()`: a cor pura, a cor a 60%, a cor a 25% e a cor a 10% sobre o fundo.
  Os passos claros viram fundo de hover, chip e aviso.
- **Um link herda a escala do livro dele** pelo atributo, sem JS (por exemplo,
  `[data-livro="dados"] { --c1: …; --c2: … }`).
- Os livros e as ilustrações entram como estão (ilhas).

**Tipografia.**

- **Excon** (Fontshare, variável 100 a 900) nos títulos: geométrica, forte, 700 a 800, apertada
  (-0,03em), com entrelinha de 0,9 nos grandes.
- **Author** (Fontshare, variável 200 a 700, com itálico) no texto do artigo e na interface, com
  1,0625rem em 1,7.
- **Tabular** (Fontshare) ou JetBrains Mono (raiz) nos rótulos pequenos e no código, em caixa normal
  (nada de caixa alta).
- Os títulos terminam com um **ponto vermelho** (o `.` na cor de acento), como no animejs.

**Forma.** Cantos de .125 a .75rem, filetes de 1px e nenhuma sombra. As formas decorativas são
círculos, quadrados, triângulos, arcos e pontos nas cores dos livros.

**Ícones.** Geométricos e cheios (preenchidos), grade de 24px, desenho próprio. No hover, eles
"quicam": `scale` de 1 a 1,15 e volta, com mola (0,45 s).

**Marca "cs".** Três formas (um círculo, um quadrado e um triângulo) nas cores de três livros, com
"cs" ao lado. No hover, as formas trocam de lugar em mola, uma rodada.

## Páginas

**Cabeçalho.**

- A marca, a navegação (Artigos, Categorias e Tags), a busca e o tema. Sob o item atual, um ponto
  vermelho.
- No hover de um item, o **texto rola** (a cópia de baixo sobe, `splitText` com `clone: 'bottom'`).
- No celular, o menu abre como uma grade de formas que se expandem a partir do botão.

**Home.**

- **O motor:** o topo é um palco onde a abertura acontece. Depois dela, ficam:
  - um anel de marcas finas;
  - arcos nas cores dos livros;
  - o nome "Cesar Schutz" grande, com o ponto vermelho;
  - a apresentação.
- **A coleção:** os 8 livros e a revista, livros 3D numa fileira. **Dá para arrastá-los**: soltos,
  eles voltam para o lugar com mola, e o arremesso conta.
- **Artigos:** uma grade de cards (3 por linha no computador). Cada card é a ilustração no palco
  tingido da cor do livro, o título em Excon, o livro com a cor dele e a data. Um "chip" de forma (o
  círculo ou o quadrado) na cor do livro marca o canto.
- **Grade de pontos de fundo:** atrás da seção de artigos, uma grade de pontos (~12×8, **DOM ou
  canvas 2D pequeno**) que **ondula a partir do cursor** (`stagger` com `grid` e `from` na posição do
  mouse). A onda só dispara quando o mouse entra numa célula nova (com limite de 1 a cada 120 ms), e
  nada roda em laço.

**Artigo.**

- **Topo:** o título em Excon com o ponto vermelho, o livro 3D pequeno ao lado e uma faixa fina de
  formas nas cores do livro.
- **Texto** em coluna de ~68 caracteres, sem animação no texto.
- **A barra-guia** (a ideia do animejs): um cartão fixo no canto de baixo à direita, com uma régua de
  ~60 marcas representando o artigo.
  - Um cursor vermelho que **se arrasta** (`createDraggable`) leva a leitura até aquele ponto.
  - Um cursor-fantasma segue o mouse sobre a régua (`createAnimatable`), e o clique salta.
  - As marcas dos H2 ficam mais altas, e passar o mouse mostra o nome da seção.
  - No celular, ela vira uma régua fina no rodapé, sem o fantasma.
- **Código** em superfície, com a borda à esquerda na cor do livro.

**Categorias.**

- "Categorias." e a frase de hoje.
- Uma grade de 4 por linha (2 e 1 nas telas menores). Cada célula tem o livro 3D **grande** (~340px
  em 1440), o nome, a descrição e a contagem, sobre uma **forma grande** na cor do livro (o círculo,
  o arco ou o quadrado, a 10% a 25%) atrás do livro.

**Página do livro.**

- **O livro enorme** no centro, com as **tags do livro orbitando** em volta: chips que giram devagar
  numa elipse. Eles param no hover e com movimento reduzido, e o ritmo cai fora da tela (a animação
  pausa).
- Arrastar o livro inclina e gira (`createDraggable` no ângulo, com mola ao soltar).
- Embaixo, os artigos do livro nos cards da home.

**Tags.** Uma **nuvem de bolhas**: cada tag é uma pílula na cor do livro em que ela mais aparece, com
o tamanho pela contagem. As bolhas entram do centro em cascata (`stagger` com `from: 'center'`). No
hover, a bolha cresce com mola e as vizinhas se afastam 4px.

**Tag.**

- "#Spring." e "9 artigos em 5 livros".
- **O filtro por livro são chips que quicam**: um chip por livro, com a forma e a cor dele. O ativo
  fica preenchido e os outros, contornados.
- A lista, nos cards.

## Os três momentos

**1. A abertura da home: a "montagem".** É uma timeline mestra, como a do animejs. Até ~2,6 s;
clique, tecla ou rodinha pulam.

| Tempo | O que acontece |
|---|---|
| 0 a 0,65 s | ~60 marcas finas desenham um **anel** no sentido horário, cada uma acendendo e caindo a .4 como cometa (`stagger([0, 500], {ease: 'outIn(2)'})`) |
| 0,6 a 1,4 s | **8 arcos nas cores dos livros** entram girando, cada um de um ponto do anel, e assentam |
| 0,9 a 1,9 s | uma **grade de pontos** 9×9 cresce do centro (`scale [0, 4, 1]`, `stagger(60, {grid, from: 'center'})`) e se dissolve |
| 1,4 a 2,2 s | "Cesar Schutz" entra **por letra** (`x ['.35em', 0]` e opacidade, `outQuint`, `stagger(25)`), e o ponto vermelho cai por último, com mola |
| 1,9 a 2,6 s | os livros entram na fileira com mola, a partir do centro (`stagger(50, {from: 'center'})`), e depois o cabeçalho e a apresentação |

- **A timeline se entrega à rolagem**, como no animejs: se o leitor rolar durante a abertura, a
  rolagem assume o tempo. Depois do fim, o anel e os arcos seguem ligados à rolagem do topo (giram um
  pouco ao rolar), com `onScroll` e `sync`.

**2. A abertura das outras páginas.**

- Uma forma na cor do livro da página (ou no acento, nas páginas gerais) aparece no canto de cima: um
  círculo que vira quadrado e que vira a faixa do topo (`svg.morphTo`, 0,7 s).
- O título entra por letra, com o ponto vermelho quicando no fim.
- O resto chega em cascata pela grade (`stagger` com `grid: true`, a partir de cima). ~1,4 s.

**3. A troca de página: a explosão de formas.**

- No clique, **círculos nas cores dos livros** (8 a 12, de tamanhos variados) explodem do ponto do
  clique e cobrem a tela (`scale` com mola e atrasos `stagger` aleatórios, 0,45 s).
- A página nova aparece por baixo, e os círculos se recolhem para o mesmo ponto, deixando-a limpa
  (0,4 s).
- Técnica: o ponto vai no `sessionStorage`; a página nova nasce com os círculos cobrindo (pela classe
  do `<head>`) e os recolhe no `pagereveal`. A página antiga faz a explosão antes do snapshot (a View
  Transition capta a antiga com os círculos já crescendo), ou a explosão acontece toda na página nova,
  sobre a imagem antiga. Escolha a que ficar mais fluida.

## Categorias: o desfile e os livros grandes

**O desfile.** Toca sempre que Categorias aparece.

- As formas de fundo entram primeiro, cada uma se desenhando ou crescendo com mola.
- Depois, os livros **entram do centro da grade para fora** (`stagger(70, {grid: true, from:
  'center'})`), vindo de baixo com mola e um leve giro que assenta.
- Por fim, o texto por palavras. ~1,5 s.

**Hover numa célula:**

- o livro **inclina seguindo o mouse** com mola (`createAnimatable` nos ângulos);
- a forma de fundo gira 12° e cresce 6%.

**Arrastar:** os livros de Categorias também se arrastam e voltam com mola. O clique (sem arrastar)
abre o livro.

## Filtro da tag

- No clique, o chip **quica** (`scale` de 1 a 0,92 e a 1,06, com mola) e se preenche. O anterior se
  esvazia.
- Os cards que saem encolhem para o centro deles e somem (0,25 s). Os que ficam deslizam para as
  novas posições (FLIP com mola; `createLayout` não, porque anima tamanho). Os que entram crescem do
  centro em cascata.
- O total conta até o valor novo (`utils` e rAF, `round`).

## Troca de tema

Uma **forma** (um círculo na cor de um livro sorteado) nasce do botão e cresce até cobrir a tela,
com mola (View Transition, `clip-path: circle()`, ~0,6 s, com um leve passar do ponto e voltar). O
ícone do botão é um círculo que vira meia-lua com `morphTo`.

## Catálogo de detalhes

Todos também com o foco do teclado (sem arrastar). Mola padrão: `spring({bounce: .35, duration: 450})`,
ou o `linear()` equivalente em CSS para o que for só CSS.

1. **Menu:** o texto rola no hover (a cópia de baixo sobe) e o ponto vermelho do item atual pula
   para o item novo na troca de página.
2. **Marca:** as três formas trocam de lugar com mola, uma rodada.
3. **Grade de pontos:** ondula a partir do cursor, na seção de artigos.
4. **Livros arrastáveis** na home, em Categorias e na página do livro, voltando com mola e inércia.
5. **Card de artigo:** no hover, o chip de forma do canto gira 90° e cresce, a ilustração sobe 4px e o
   título ganha o ponto vermelho no fim, que entra quicando.
6. **Busca:**
   - ⌘K abre um painel que cresce do botão com mola;
   - os resultados entram por `stagger`;
   - com as setas, um marcador (a forma do livro do resultado) salta com mola;
   - o termo buscado aparece com o fundo na cor do livro a 25%.
7. **Tema:** o ícone muda de forma com `morphTo`, e a forma cobre a tela.
8. **Links do texto:** sublinhado de 2px na cor do livro do post a 60%; no hover, a cor pura e uma
   pequena onda no sublinhado (um SVG com `morphTo` de reta para onda e volta, uma vez).
9. **H2 do artigo:** no hover, uma forma pequena (a do livro) aparece à esquerda girando, e o clique
   copia o link; "Copiado" entra por letra.
10. **Barra-guia do artigo:** arrastar, cursor-fantasma e clique para saltar (veja acima).
11. **Copiar código:** o ícone quica e vira visto por `morphTo`; "Copiado" entra por letra.
12. **Anterior e próximo:** cards; no hover, a seta atravessa e volta por trás (`clone`), e a forma
    do livro gira.
13. **Voltar ao topo:** um círculo; no hover, ele quica; no clique, sobe até sumir e volta embaixo.
14. **Nuvem de tags:** as bolhas crescem com mola no hover, e as vizinhas se afastam.
15. **Tags orbitando** na página do livro: param no hover da órbita, e o chip sob o mouse cresce.
16. **Pílulas das tags no artigo:** no hover, a forma da pílula (arredondada) se estica 6% com mola.
17. **Progresso:** uma faixa fina no topo, com as cores dos livros em sequência, ligada à rolagem
    (CSS).
18. **Seleção de texto:** fundo na cor do livro do post a 35%.
19. **Foco pelo teclado:** anel de 2px no acento, com 3px de afastamento, que entra com uma pequena
    mola de escala (CSS).
20. **Rodapé:** "Feito com movimento." e um pequeno anel de marcas que se desenha quando o rodapé
    entra na tela (uma vez).
21. **Página vazia ou filtro sem posts:** três formas caem e empilham, com "Nada por aqui." ao lado.

## Técnica

- **anime.js v4:** instale só em `redesenho/`, depois de ler o `package.json` do pacote (nada de
  `postinstall` ou de rede):
  `fnm exec --using=24 npm install --prefix redesenho animejs`.
  - Importe só os módulos usados, dos subcaminhos (`animejs/animation`, `animejs/timeline`,
    `animejs/utils`, `animejs/draggable`, `animejs/text`, `animejs/svg`, `animejs/events`,
    `animejs/animatable`, `animejs/scope`).
  - Carregue **sob demanda** (`import()` quando a página pede): a página sem interação não baixa nada.
  - Confira na versão instalada o nome da mola (`spring`) e dos outros métodos.
- **Movimento reduzido:** `createScope({ mediaQueries: { reduce: '(prefers-reduced-motion: reduce)' } })`
  e, com ele ligado, tudo no estado final, sem arrasto com inércia, sem órbita e sem onda.
- **Peso:** nada de rAF em laço. A onda de pontos só dispara no movimento. A órbita pausa fora da
  tela (`onScroll` ou IntersectionObserver) e com a aba escondida (o `engine` já pausa).
- **Nada de WebGL** (a cena do animejs pesa ~1 MB; aqui não).
- Se o arrasto dos livros conflitar com o link, o clique só navega quando o deslocamento for menor que
  5px.

## Referências usadas

`docs/redesenho/referencias.md`, seção animejs.com (a abertura filmada, a API, a barra-guia, a cor
por atributo e o hover assimétrico), mais:

- a pílula e o foco do kinetics e do kobra;
- as fontes Excon, Author e Tabular, do Fontshare.

## O que não fazer (para não virar outro modelo)

- **Superfícies:** nada de luz e sombra, nem de grão (Noturno).
- **Desenho técnico:** nada de cotas ou malha técnica (Planta).
- **Leitura:** nada de animação no texto do artigo, nem de efeito em cada parágrafo.
- **Cor:** nada de cores fora da paleta dos livros e do vermelho de acento.

## Retorno do Cesar

(vazio)
