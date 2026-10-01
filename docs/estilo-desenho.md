# Estilo das ilustrações, das figuras e das lousas

Este arquivo guarda **só o estilo**. O Cesar pode trocá-lo sem mexer nas regras técnicas (skill
`desenho`) nem na regra do que desenhar. Os valores marcados como "de partida" vêm dos protótipos
aprovados e podem ser afinados na Fase 5:

- `docs/referencias/prototipo-estilo-desenho.html`, aba "A + C";
- `docs/referencias/prototipo-lousas.html`, aba "Invertida, canetinha".

Onde protótipo e briefing divergirem, vale o briefing.

## Ilustrações dos posts: estilo "A + C"

- **Traço de caneta** com leve tremor de mão (filtro SVG global de deslocamento), terminais e
  junções arredondados. Desenho **de frente**, sem perspectiva isométrica.
- **Hachura** a 45° para sombras e volume.
- **Linha fantasma** (traço e ponto) para o que não acontece, para alternativas e para estados anteriores.
- **Uma cor só**, a da categoria do post, aplicada como preenchimento levemente fora do registro
  (deslocado alguns pixels do contorno). O resto é tinta (`--ink`). No tema escuro, o destaque usa a
  cor da categoria misturada com 42% de branco. (Vale para a capa; as figuras têm tons, abaixo.)
- **Sem fundo próprio.** O SVG não pinta fundo, e as áreas preenchidas usam a cor da superfície
  onde ele aparece (`var(--fig-bg, var(--paper))`). Assim funciona igual nos dois temas e dentro
  dos slides.
- **Palco (D26).** No site, todo desenho fica num painel tingido pela cor da categoria (classe
  `.painel`): a cor misturada à superfície, com 11% no tema claro e 20% no escuro. O painel define
  `--fig-bg`, então as áreas preenchidas ficam na mesma cor dele. Dentro de uma folha, o painel tem
  raio de 10px; encostado na borda da folha (topo do artigo, card), o canto vem da folha.
- **Espessura do traço definida pelo CSS** conforme o tamanho em que o desenho aparece: mais grossa
  na miniatura, mais fina no topo do artigo. No painel, 20% mais grossa, para não sumir no fundo de cor.
- **Anotações** em Literata itálica, com linha de chamada, só nos recortes grandes. Somem no celular
  e nas miniaturas.
- **Proibido:** cores fixas no SVG, degradês, sombras, `<image>`, fontes de letra de mão, emojis e
  texto demais.

### Valores de partida (protótipo "A + C")

| Elemento | Valor |
|---|---|
| Tremor | `feTurbulence` `fractalNoise` com `baseFrequency` 0.018, `numOctaves` 2 e `seed` 7, seguido de `feDisplacementMap` com `scale` 4 (canais R e G). Aplicado só no grupo dos traços, para os textos ficarem nítidos |
| Hachura | Linhas a 45°, a cada 7 unidades, traço 1 na cor da tinta, opacidade .75. Funciona como sombra: uma cópia da forma deslocada para baixo e para a direita (+14 em objetos grandes, +7 em caixas) |
| Linha fantasma | `stroke-dasharray: 24 8 4 8 4 8` (um traço longo e dois pontos), traço 2,4 |
| Cor fora do registro | Cópia da forma deslocada `translate(7 6)`, por baixo do contorno. A cor é 78% do destaque misturado com a superfície (era 62% até a D26) |
| Espessura (unidades do desenho) | 3 no topo do artigo, 3,6 em cards e destaque, 7 na miniatura quadrada; no painel, ×1,2 (`--traco-no-painel`): 3,6, 4,3 e 8,4 |
| Painel (palco) | `color-mix(in oklab, cor da categoria 11%, superfície)` no claro e 20% no escuro; raio de 10px |
| Anotações | Literata itálica: 25 na linha principal (`--ink`) e 20 no complemento (`--ink-2`). Linha de chamada curva em `--ink-2`, com traço 1,8 |
| Carimbo | Contorno na cor de destaque e texto em Besley 800 |

Na D30, Observabilidade virou o livro SRE (`#c4a050`); a observação abaixo vale para ele.

A conferir na Fase 5: o destaque de Observabilidade (`#C39A3E`) dá 2,24:1 sobre o papel claro. Isso
basta para uma mancha de cor, mas não para traço fino nem texto. O protótipo de desenho testou
`#9C7A26`, mas a tabela do briefing manda `#C39A3E`, e ela vale até decisão contrária. No escuro, os
destaques com 42% de branco passam em todas as categorias (5,1 a 9,8:1).

## Capa viva (D58)

- **Um detalhe só**, que conta algo do assunto (o vapor que sobe, o ponteiro que gira, o envelope que
  desliza), se mexe quando o mouse passa pelo topo do artigo, pelo card ou pelo item da lista. O resto
  da capa fica parado. É a fumaça da caneca da série Java (D52, C04) levada para toda capa.
- **Evento:** acontece e volta sozinho, em até 1,3 s, e vai até o fim mesmo que o mouse saia no
  meio. Balança (pendurado pelo alto), pulsa, pisca (duas vezes), sobe (sobe e some, volta de baixo),
  treme, escreve (o traço se escreve de novo) e enche (de baixo para cima).
- **Estado:** muda e fica enquanto o mouse está em cima: gira (120°) ou desliza (22 unidades para a
  direita; para outra direção, o grupo de fora gira). Ao tirar o mouse, volta animado, um pouco mais
  rápido que a ida. **Nada pula de volta.**
- Só `transform`, `opacity` e `stroke-dashoffset`. Com movimento reduzido, nada se mexe.
- Classes e onde pôr: skill `desenho`. Tempos: `docs/movimento.md`.

## Figuras dos posts: diagramas e gráficos coloridos (D58)

- **O traço é o da capa** (tremor, hachura, linha fantasma, `papel`, a cor fora do registro), no
  painel do livro. O que muda é a cor: **cada ator, lado ou papel ganha um tom**, e o mesmo ator tem o
  mesmo tom em todas as figuras do post. A cor ajuda a memorizar quem faz o quê.
- **Tons** (`--diag-*`, tabela abaixo). Vermelho é para erro, limite, recusa e o que dá errado, nunca
  para um ator comum.
- **Lavado:** o fundo das caixas é o tom bem claro sobre o painel, com a tinta por cima passando de
  4,5:1.
- **Cor fora do registro no tom:** a mesma cópia deslocada da capa, agora no tom do ator. A hachura
  continua na tinta.
- **Traço no tom** nas setas de um fluxo e no contorno de destaque; o contorno das caixas, na tinta.
- **Selo:** a bolinha cheia no tom, com o número do passo, quando a figura conta uma ordem.
- **Textos:** o nome da caixa em Besley 700; o complemento em Literata itálica; números dos eixos em
  IBM Plex Sans, com algarismos tabulares. Letra mínima de 20 unidades (19 nos valores dos eixos),
  porque no celular a figura fica com 720px e rola de lado dentro do quadro.
- **Legenda que destaca:** a legenda embaixo (uma frase) diz como ler as cores; uma legenda de cores
  dentro da figura só com 4 tons ou mais. Com o mouse numa cor da legenda, ou no próprio componente,
  só aquele ator fica aceso: as outras cores e o que não tem cor apagam, menos a referência de todas as
  cores (o cabeçalho de uma tabela, num `<g class="referencia">`, e os eixos), que fica inteira (D59).
- **Setas à mão** (a ponta é um traço), nunca a ponta pronta do SVG. Nada cruza texto: as setas
  desviam das caixas e dos rótulos.
- **Gráficos:** eixo na tinta, grade pontilhada e apagada, a série num tom, a área lavada, o limite
  tracejado no vermelho e uma anotação com chamada apontando o que importa. Números plausíveis e
  coerentes com o texto, eixos com unidade.
- **Detalhes que se mexem** (opcional): leves, sem mudar a imagem, na ordem em que as coisas
  acontecem. Um ponto que percorre cada seta na vez dela (`pacote`), pontinhos correndo sem parar
  (`fluxo`), um tracejado andando (`formiga`), um pulso, um piscar, um giro, um balanço, um vai e
  vem. Em quantas setas fizer sentido, não só uma. Um gráfico também pode ter (um ponto pulsando no
  pico, um cursor correndo na série). Só andam com a figura na tela; com movimento reduzido, param.
- **Logos das ferramentas:** desenhados à mão no traço da casa, a forma que todo mundo conhece,
  simplificada, com os tons (AWS: "aws" e o sorriso em âmbar; Kubernetes: o heptágono azul com o leme;
  Java: a xícara). Sem tremor e sem copiar o arquivo oficial. Dentro das figuras, no lugar que
  identifica a peça (a xícara na caixa do app, o logo da AWS na caixa da nuvem).
- **Animação com play:** o mesmo desenho, e o quadro final é o desenho parado. O que se move fica
  fora do grupo que treme. O que foi escrito não some: se mudou, um traço firme risca e o novo vem
  embaixo. Mais desenho que texto.

### Tons das figuras

| Tom | Classe | Token | Claro |
|---|---|---|---|
| azul | `tom-azul` | `--diag-azul` | `#2F5FB3` |
| verde | `tom-verde` | `--diag-verde` | `#25734E` |
| âmbar | `tom-ambar` | `--diag-ambar` | `#955A0A` |
| vermelho (só erro, limite, recusa) | `tom-vermelho` | `--diag-vermelho` | `#B23A2C` |
| roxo | `tom-roxo` | `--diag-roxo` | `#7C4FAB` |
| petróleo | `tom-petroleo` | `--diag-petroleo` | `#1A6F7A` |

No escuro, cada tom leva 42% de branco (`--branco-no-escuro`), como a cor do livro. Todos passam de
4,5:1 como texto sobre a folha e sobre o painel de todos os livros, nos dois temas, e a tinta (as duas)
passa de 4,5:1 sobre o lavado (`npm run contraste`).

**O escuro dos desenhos do corpo** (D60, valores em `DESENHO` e nos tokens `painel-desenho` e
`tinta-desenho*` de `tokens.ts`): as figuras, as animações e as lousas ficam num painel próprio, um
pouco acima da folha e mais neutro (`#232B2E` com 10% da cor do livro; no claro, a folha com 11%, como
sempre). O lavado mistura o **tom puro** (sem o branco do escuro) a 45% sobre esse painel, para a caixa
ter cor sem clarear demais (com o tom clareado a 30%, as caixas viravam marrom, oliva e cinza). A tinta
fica um pouco menos branca (`#CDD3CD`; a secundária, `#BCC3BE`), para o traço não brilhar; a cópia fora
do registro cai para 62% do tom e a sombra hachurada para 35%. No claro, o lavado é 16% do tom, a cópia
78%, a sombra 75%, e a tinta secundária dos desenhos é um pouco mais escura que o `--ink-2`
(`#50595A`), para passar de 4,5:1 sobre o lavado. A capa não muda: segue o painel de sempre, na cor do
livro.

## Lousas: a figura que se desenha (D59)

Desde 30/09/2026, a `Lousa` usa **o mesmo estilo das figuras** (a seção acima): o painel do livro, o
traço da casa com tremor, as caixas com o fundo lavado no tom e a sombra de hachura, os seis tons com o
mesmo significado das figuras do post, os selos numerados e os logos. O que muda é o tempo: a lousa se
desenha diante do leitor, e quem desenha é uma **canetinha colorida**. O quadro escuro com o canetão
ficou só nas lousas antigas (abaixo), porque brigava com as figuras coloridas no mesmo post.

- **A canetinha:** ponta de feltro, cone de plástico claro, corpo fino levemente tingido e a tampa no
  fundo, com contorno de tinta, como os desenhos. A ponta, o anel e a tampa ficam **na cor do que ela
  está fazendo**: o traço (`stroke`), o texto (`fill`) ou o tom que está pintando. Girada −52° (mão
  direita), com sombra leve; feita para o desenho de 1100 de largura (o script ajusta a escala).
- **Como ela desenha:** traça o contorno da caixa (`data-traco`), **pinta** o fundo lavado
  (`data-revela`, a canetinha corre no meio da caixa, no tom) e escreve os textos (`data-escrita`). A
  sombra e as pontas de seta aparecem curtas no fim.
- **Com mão** (D58): escrevendo, a ponta sobe e desce a cada letra e a mão gira um pouco; no traço,
  ela balança de leve; pintando, corre com um balanço leve. Nunca anda reta de um lado para o outro.
- **Uma caneta por lugar** (D58): uma caneta nunca escreve em dois lugares. Quando duas partes são
  feitas ao mesmo tempo, cada uma tem a sua (até três); melhor ainda, desenhe um lugar por vez. Na
  comparação, uma caneta por linha, como um cursor do tempo.
- **Passos com selos:** cada passo tem o selo numerado no tom dele, perto do que ele desenha, ligando o
  desenho à lista embaixo. **Comparação:** um rótulo por linha, e o que acontece no mesmo instante fica
  na mesma posição horizontal.
- A canetinha aparece sempre que algo está sendo desenhado (play, arrasto, rolagem horizontal sobre a
  lousa, controle) e some quando para; voltou no tempo, o desenho se apaga até ali. A rolagem da
  página não mexe na lousa (D46).
- **Pouco texto trocando** (D58): o que foi escrito não some; se mudou, risca e escreve o novo
  embaixo. O quadro final (o que aparece antes do play) fica completo e legível.
- Os rótulos e as caixas iniciais do cenário podem já estar desenhados ("o professor montou o quadro
  antes da aula").
- **Medidas:** `viewBox` com 1100 de largura; as fontes das figuras, nunca menores (no celular a lousa
  tem 720px e rola de lado dentro do painel, como as figuras).
- **Frase em destaque** (recurso raro): uma citação cujas palavras acendem com a rolagem.
- Com `prefers-reduced-motion`: desenho completo, sem caneta e com todos os passos visíveis.

## O quadro antigo: "Invertida, canetinha" (só `LousaTempo` e `LousaLoop`, nos posts antigos)

Vale só até o post ser revisto pela skill `post`, quando a lousa é redesenhada no estilo acima. A
lousa antiga é sempre o **contrário da página**:

| | Página clara: lousa de vidro escura | Página escura: quadro branco suavizado |
|---|---|---|
| Fundo | `#15191C`, com reflexo diagonal sutil | `#CFD5D1` (nunca branco puro, para não ofuscar) |
| Borda | 1px `#2C3438` | 3px `#8F989D` (alumínio) |
| Caneta | clara, `#F4F6F5` | escura, `#16212B` |
| Destaque | `color-mix(in oklab, cor, #9ff5dc 55%)` | `color-mix(in oklab, cor, #0b6f58 35%)` |

- Traço de canetão nas duas (sem giz), com leve tremor; o marcador simples desenha, na cor do traço
  (a de destaque, nos destaques). Os rótulos usam a mesma Literata itálica do blog. O resto (a mão,
  uma caneta por lugar, pouco texto trocando) é igual ao da lousa nova.

### Valores de partida (protótipo "Invertida, canetinha")

| Elemento | Valor |
|---|---|
| Reflexo no vidro | `linear-gradient(118deg, rgba(255,255,255,.07) 0%, rgba(255,255,255,.015) 26%, transparent 27%)`: corte seco, como vidro |
| Reflexo no quadro | `linear-gradient(118deg, rgba(255,255,255,.28) 0%, transparent 30%)`: suave |
| Tremor | Mais leve que o da ilustração: `baseFrequency` 0.02, `numOctaves` 2, `scale` 2, só nos traços |
| Espessura | 2,7 em caixas e setas e 1,5 nas divisórias de tabela (viewBox de referência 560×430) |
| Hachura | A mesma de 7×7 a 45°, com a tinta a 22% (vidro) ou 30% (quadro) e traço 1,2 |
| Rótulos | Literata itálica 17. Secundários em 13,5, com a tinta atenuada. Código em mono 12, sem itálico |
| Caneta | Marcador simples girado −52° (mão direita), com sombra leve como no protótipo. Some quando nada está sendo traçado. Balança até 4° no traço e 6° na escrita, com a ponta subindo e descendo 22% da altura do texto a cada letra (D58) |

Contraste dos destaques (conferido por `npm run contraste`, 24/09/2026):
- Na lousa de vidro, todos passam sem ajuste (traço e texto de 6,2 a 10,3:1).
- No quadro branco, o destaque puro de Observabilidade daria 2,34:1. Por isso o destaque leva um
  pouco da caneta: 20% no traço (todos passam de 3:1; o pior é 3,22:1) e 45% no texto (todos passam
  de 4,5:1; o pior é 4,82:1). Os valores ficam em `LOUSA` (`src/styles/tokens.ts`).
