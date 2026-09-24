# Capas, lombadas e estante

Este é o padrão visual dos livros do blog. Cada categoria é um livro de uma coleção numerada. De um livro para outro mudam só a cor, os textos, o desenho e o número de artigos. Tudo é montado em HTML e CSS com SVG inline, nunca como imagem pronta.

As imagens em `referencia/` são o alvo visual:

- `capas.png`: as oito capas.
- `estante.png`: as lombadas em pé na prateleira.
- `lateral.png`: as lombadas deitadas na lateral do site, em tamanho real e ampliadas.
- `lombada-e-capa.png`: a lombada colada à capa, para a animação de girar.

## Arquivos

- `livros.json`: dados de cada livro e da série. O campo `artigos` é só um exemplo, porque no site o número vem da contagem real de posts.
- `cores.js`: calcula todas as cores a partir da cor principal (`faixa`, `tinta`, `tintaFaixa`, `numeral`). Use sempre ele, nunca cores fixas.
- `desenhos/<slug>.svg`: o desenho da faixa da capa, já posicionado no espaço da faixa (viewBox `0 332 480 388`).
- `icones/<slug>.svg`: o ícone das lombadas (viewBox 120 × 160), com só os traços principais.
- `grao.svg`: textura de grão de papel, em ladrilho de 180px.

Nos SVGs, o traço usa `currentColor` e os preenchimentos usam `var(--capa-faixa)` (capa) ou `var(--lombada-cor)` (ícone). Coloque os SVGs inline, porque com `<img>` a cor não é herdada. Eles são decorativos (`aria-hidden`). Títulos, subtítulos e números são sempre texto de verdade.

## O número

O número que aparece nas lombadas e na página de cada livro é o total de artigos da categoria ou da série, calculado pelos posts. Sem artigos, o número não aparece. O "01" a "08" grande da capa é outra coisa: é o volume da coleção.

## Os livros

| Vol. | Título | Cor | Título na capa | Instrumento | Elemento fantasma |
|---|---|---|---|---|---|
| 01 | Arquitetura de Software | `#2d4b46` | 72px | arco e pedra angular | o encaixe vazio da pedra angular |
| 02 | Desenvolvimento de Software | `#7a4430` | 49px | paquímetro medindo uma peça | a cota da medida esperada (o teste) |
| 03 | Dados | `#5f4662` | 136px | gaveta de fichas | a próxima ficha, ainda vazia |
| 04 | IA | `#6e2f45` | 136px | autômato escritor | a próxima palavra, ainda não escrita |
| 05 | Segurança | `#606a37` | 81px | carta lacrada e sinete | o gesto do sinete carimbando |
| 06 | DevOps | `#465976` | 113px | guindaste de porto | o lugar onde o contêiner vai pousar |
| 07 | SRE | `#c4a050` | 136px | farol | o feixe do outro lado |
| 08 | Carreira | `#9a7650` | 102px | compasso | o resto do círculo por traçar |

## Capa (referência de 480 × 720px)

No site, declare `container-type: inline-size` na capa e escreva cada medida como `calc(N * 100cqw / 480)`, para tudo escalar junto.

- **Forma:** cantos de 2px do lado da lombada e 4px do lado aberto. Sombra `0 1px 1px rgba(0,0,0,.3), 0 20px 44px rgba(0,0,0,.38)`.
- **Cores:** a área de cima (y 0 a 332) tem a cor do livro. A faixa (y 332 a 720) tem a cor `faixa`.
- **Grão:** `grao.svg` por cima de tudo.
- **Dobra:** um gradiente de 16px na borda esquerda, de `rgba(0,0,0,.16)` a transparente. Por cima dele, dois fios de 1px em x=13 (`rgba(0,0,0,.28)`) e x=14 (`rgba(255,255,255,.10)`).
- **Autor:** "Cesar Schutz", em Bitter 600 15px, em x=44 e y=42, na `tinta`.
- **Numeral do volume:** Bitter 800 76px, letter-spacing −0.04em, alinhado à direita a 36px da borda, em y=22, na cor `numeral` (tom sobre tom).
- **Título:** Bitter 800 com letter-spacing −0.03em, sem quebra automática. O corpo é o que faz a linha mais longa ocupar 396px, com teto de 136px. Os valores já calculados estão na tabela. A entrelinha é igual ao corpo em títulos de uma linha e 0,97 do corpo em títulos de duas linhas. Títulos com "de Software" quebram antes do "de".
- **Subtítulo:** Newsreader itálico 19/26px, com no máximo 340px de largura, `text-wrap: balance` e opacidade de 0,88, 14px abaixo do título. Cabe em duas linhas.
- **Bloco de título e subtítulo:** começa em x=44, é alinhado pela base e termina em y=302, ou seja, 30px acima da faixa.
- **Desenho:** o SVG de `desenhos/` ocupa a faixa inteira. O traço usa `tintaFaixa` e `--capa-faixa` recebe a cor `faixa`.
- **Assinatura:** "blog.cesarschutz.com.br", centralizado em y=697, em Bitter 600 10px, letter-spacing 0.14em, na `tintaFaixa` com opacidade de 0,5.

## Lombada em pé (estante)

A ordem, de cima para baixo, é: ícone, título e número. O ícone e o número giram como o texto, então a lombada deitada é exatamente essa mesma lombada rotacionada.

- **Medidas:** as alturas e larguras estão em `livros.json`. A largura é cerca de um quarto da altura, e as alturas variam para parecer uma estante de verdade.
- **Faixa:** tem 362px de altura, medidos da base, em todos os livros. Assim a divisão de cor forma uma linha contínua atravessando a estante. Em cima fica a cor do livro, e embaixo a `faixa`.
- **Forma:** cantos de 4px em cima e 2px embaixo, com sombra `0 1px 0 rgba(0,0,0,.25), 5px 0 12px rgba(0,0,0,.13)` e o grão por cima.
- **Volume:** um gradiente horizontal que escurece as bordas e clareia o meio (`rgba(0,0,0,.24) 0%, rgba(0,0,0,.04) 11%, rgba(255,255,255,.08) 40%, rgba(255,255,255,.03) 64%, rgba(0,0,0,.08) 88%, rgba(0,0,0,.28) 100%`), mais dois vincos de 1px em `rgba(0,0,0,.24)`, a 7px de cada borda.
- **Ícone:** o SVG de `icones/` girado 90° no sentido horário (`transform: rotate(90deg)`), centralizado na área de cima, com cerca de 22px de margem lateral e 32px de margem acima e abaixo. O traço usa `tinta` e `--lombada-cor` recebe a cor do livro.
- **Título:** 26px abaixo da divisão, em `writing-mode: vertical-rl` (lido de cima para baixo). Bitter 800 32/36px, letter-spacing −0.01em, na `tintaFaixa`. Cada linha do título vira uma coluna.
- **Número:** 26px acima da base, também em `vertical-rl`, em Bitter 600 28px, na `tintaFaixa` com opacidade de 0,85.
- **Animação de girar:** quando a lombada gira para virar a capa, ela assume a altura da capa. A faixa passa para 388 de 720, alinhada com a divisão da capa.

## Estante

- **Livros e prateleira:** os livros ficam em pé com 6px entre eles, sobre uma prateleira de 14px em `#b5bab4`, com borda inferior de 6px em `#9ba19b`.
- **Livro inclinado:** o último livro da coleção fica inclinado 6°, girando pelo canto de baixo do lado direito, com o topo apoiado no alto do aparador.
- **Aparador:** uma barra de 12 × 470px (gradiente `#6f7775`, `#9aa19f`, `#7a8280`) com base de 48 × 9px. Ele separa as categorias das séries.

## Lombada deitada (lateral do site, tamanho real)

É a lombada em pé rotacionada, com uma diferença: a ponta com o ícone é curta, para caber na lateral.

- **Medidas:** comprimento, espessura e deslocamento de cada livro estão em `livros.json`. Os livros com título de duas linhas são um pouco mais grossos.
- **Pilha:** o volume 1 fica embaixo. Cada livro tem um pequeno deslocamento horizontal, e há uma prateleira sob a pilha (5px em `#b5bab4` e 2px em `#9ba19b`).
- **Ponta do ícone:** a ponta esquerda, com 1,32 vez a espessura, tem a cor do livro. O ícone fica em pé, sem giro, na `tinta`, com 5px de margem nas laterais e 4px em cima e embaixo. O resto do livro tem a cor `faixa`.
- **Título:** 9px depois da ponta, em Bitter 800 com 0,43 da espessura (títulos de duas linhas usam 0,33 da espessura, com entrelinha 1,05), na `tintaFaixa`.
- **Número:** alinhado à direita, 10px antes do fim, em Bitter 600 com 0,4 da espessura e opacidade de 0,85.
- **Volume:** um gradiente vertical (`rgba(0,0,0,.22) 0%, rgba(255,255,255,.07) 38%, rgba(255,255,255,.02) 62%, rgba(0,0,0,.26) 100%`) e vincos de 1px a 3,5px do topo e a 4,5px da base. Cantos de 2px na ponta do ícone e 3px na outra ponta.

## Livros de série

Os livros de série não seguem a paleta das categorias. Cada série pode ter a sua particularidade.

- **Cores:** fundo `#2b2320` com grão, tinta dourada `#d8b25e` e fita marcadora `#a3372b`.
- **Em pé:** título em Newsreader itálico 36px na vertical, fios duplos dourados no alto e no pé, o número girado como o texto e a fita saindo 34px acima do topo, com corte em V.
- **Deitada:** fios duplos dourados verticais a 9px e 13px de cada ponta, título em itálico com 0,5 da espessura, o número à direita e a fita saindo pela ponta direita.

## Livros novos

- **Desenho:** siga o arquivo de estilo dos desenhos do projeto. Escolha um instrumento de ofício que represente a categoria inteira, não uma tecnologia só.
- **Composição:** use o mesmo traço (espessuras de 1,8, 1,2 e 0,7px, com leve tremor e hachura nas sombras) e um único elemento fantasma tracejado. O objeto ocupa a área de x 44 a 436 e de y 360 a 678 da capa, centralizado e apoiado na base.
- **Ícone:** é o mesmo desenho, só com os traços principais, sem hachura e sem fantasma.
- **Subtítulo:** segue o molde "quatro temas: uma frase curta" e cabe em duas linhas.
- **Volume:** o próximo número da coleção. O corpo do título segue a mesma regra de preencher 396px, com teto de 136px.
