# Capas, lombadas e estante

Este é o padrão visual dos livros do blog. As categorias são livros de uma coleção no estilo "edição de estudo". As séries são revistas técnicas. Tudo é montado em HTML e CSS com SVG inline, nunca como imagem pronta.

As imagens em `referencia/` são o alvo visual:

- `capas.png`: as oito capas das categorias.
- `lombada-e-capa.png`: a lombada colada à capa, para a animação de girar.
- `estante.png`: as lombadas em pé, com a série depois do aparador.
- `lateral.png`: as lombadas deitadas na lateral do site (Séries e Categorias), em tamanho real e ampliadas.
- `serie.png`: a capa e a lombada da série Atualizações do Java.

## Arquivos

- `livros.json`: dados de cada livro e da série. O campo `artigos` é só um exemplo, porque no site o número vem da contagem real de posts.
- `cores.js`: dá a `tinta` (texto sobre a cor do livro) e o `destaque` (a cor do livro escurecida até ter contraste sobre o papel). Use sempre ele, nunca cores fixas.
- `desenhos/<slug>.svg`: o desenho da parte clara da capa, já posicionado (viewBox `0 300 480 420`).
- `icones/<slug>.svg`: o ícone das lombadas (viewBox 120 × 160).
- `serie/xicara.svg`: o emblema da série Atualizações do Java.
- `grao.svg`: textura de grão de papel, em ladrilho de 180px, por cima de tudo.

Nos SVGs, o traço usa `currentColor`. Os preenchimentos usam `var(--capa-papel)` nos desenhos, `var(--lombada-cor)` nos ícones e `var(--serie-papel)` no emblema. Coloque os SVGs inline, porque com `<img>` a cor não é herdada. Eles são decorativos (`aria-hidden`). Títulos e números são sempre texto de verdade.

O papel é `#f2ede2`, e o texto comum sobre ele é `#1f1c18`. As fontes são Bitter (600, 700 e 800) e Newsreader itálico (400 e 500).

## O número

O número nas lombadas e na página de cada livro é o total de artigos da categoria ou da série, calculado pelos posts. Sem artigos, o número não aparece. O "VOLUME 01" da capa é outra coisa: é a posição do livro na coleção.

## Os livros

| Vol. | Título | Cor | Destaque | Título na capa | Frase | Instrumento |
|---|---|---|---|---|---|---|
| 01 | Arquitetura de Software | `#2d4b46` | `#2d4b46` | 73px | As decisões caras de desfazer. | arco e pedra angular |
| 02 | Desenvolvimento de Software | `#7a4430` | `#7a4430` | 50px | O ofício dentro de cada serviço. | paquímetro medindo uma peça |
| 03 | Dados | `#5f4662` | `#5f4662` | 108px | Onde o dado mora e por onde ele anda. | gaveta de fichas |
| 04 | IA | `#6e2f45` | `#6e2f45` | 108px | Software feito com IA e software que usa IA. | autômato escritor |
| 05 | Segurança | `#606a37` | `#606a37` | 82px | Quem pode o quê e como provar. | carta lacrada e sinete |
| 06 | DevOps | `#465976` | `#465976` | 108px | O caminho do commit até a produção. | guindaste de porto |
| 07 | SRE | `#c4a050` | `#836100` | 108px | O que mantém a produção de pé. | farol |
| 08 | Carreira | `#9a7650` | `#7f5b36` | 104px | O lado humano de construir software. | compasso |

## Capa de categoria (referência de 480 × 720px)

No site, declare `container-type: inline-size` na capa e escreva cada medida como `calc(N * 100cqw / 480)`, para tudo escalar junto.

- **Fundo e forma:** fundo no papel, cantos de 1px do lado da lombada e 3px do lado aberto, sombra `0 1px 1px rgba(0,0,0,.22), 0 18px 40px rgba(0,0,0,.24)`.
- **Bloco de cor:** de y 0 a 300, largura inteira, na cor do livro.
- **Linha do topo:** em y=34, de x=38 a 442. "VOLUME 01" à esquerda e "CESAR SCHUTZ" à direita, em Bitter 700 12px, letter-spacing 0.2em, na `tinta` com opacidade de 0,9.
- **Título:** Bitter 800 com letter-spacing −0.03em, sem quebra automática, na `tinta`. Fica num bloco a partir de x=36, com 420px de largura, alinhado pela base em y=278. O corpo é o que faz a linha mais longa ocupar 404px, com teto de 108px (valores na tabela). A entrelinha é igual ao corpo em títulos de uma linha e 0,97 do corpo em títulos de duas linhas. Títulos com "de Software" quebram antes do "de".
- **Frase:** em x=38 e y=324, com 404px de largura, em Newsreader itálico 24/31px, `text-wrap: balance`, na tinta do papel. É só a frase depois dos dois-pontos do subtítulo. Os temas não aparecem na capa.
- **Desenho:** o SVG de `desenhos/` ocupa a parte clara. O objeto fica centralizado na área de x 36 a 444 e de y 384 a 678, apoiado na base. O traço usa o `destaque`, e `--capa-papel` recebe o papel.
- **Assinatura:** "BLOG.CESARSCHUTZ.COM.BR", centralizado em y=694, em Bitter 600 10px, letter-spacing 0.14em, opacidade de 0,55.

## Lombada de categoria em pé (estante)

A ordem, de cima para baixo, é: ícone, título e número. O ícone e o número giram como o texto, então a lombada deitada é a mesma lombada rotacionada.

- **Medidas:** alturas e larguras em `livros.json`. A largura é cerca de um quarto da altura.
- **Duas partes:** em cima, a cor do livro. Embaixo, o papel, com 400px de altura medidos da base em todos os livros, para que a divisão forme uma linha contínua na estante. Na animação de girar, quando a lombada assume a altura da capa, o bloco de cor passa a ter 300 de 720, alinhado com a capa.
- **Forma e volume:** cantos de 3px em cima e 1px embaixo, sombra `0 1px 0 rgba(0,0,0,.18), 5px 0 12px rgba(0,0,0,.1)`, grão, e um gradiente horizontal que escurece as bordas e clareia o meio (`rgba(0,0,0,.22) 0%, rgba(0,0,0,.03) 12%, rgba(255,255,255,.08) 42%, rgba(0,0,0,.06) 86%, rgba(0,0,0,.26) 100%`).
- **Ícone:** o SVG de `icones/` girado 90° no sentido horário (`transform: rotate(90deg)`), centralizado no bloco de cor, com cerca de 22px de margem lateral e 32px acima e abaixo. O traço usa a `tinta`, e `--lombada-cor` recebe a cor do livro.
- **Título:** 26px abaixo da divisão, em `writing-mode: vertical-rl`, Bitter 800 30/33px, letter-spacing −0.01em, no `destaque`. Cada linha do título vira uma coluna.
- **Número:** 26px acima da base, em `vertical-rl`, Bitter 700 28px, no `destaque`.

## Estante

- **Livros e prateleira:** livros em pé com 6px entre eles, sobre uma prateleira de 14px em `#b5bab4` com borda inferior de 6px em `#9ba19b`.
- **Livro inclinado:** o último livro da coleção fica inclinado 6°, girando pelo canto de baixo do lado direito, com o topo apoiado no alto do aparador.
- **Aparador:** uma barra de 12 × 470px (gradiente `#6f7775`, `#9aa19f`, `#7a8280`) com base de 48 × 9px. Ele separa as categorias das séries, que vêm depois dele.

## Lombada de categoria deitada (lateral, tamanho real)

- **Medidas:** comprimento, espessura e deslocamento em `livros.json`. O volume 1 fica embaixo da pilha, cada livro levemente deslocado, com uma prateleira embaixo (5px em `#b5bab4` e 2px em `#9ba19b`).
- **Ponta de cor:** a ponta esquerda, com 1,32 vez a espessura, tem a cor do livro. O ícone fica em pé, sem giro, na `tinta`, com 5px de margem nas laterais e 4px em cima e embaixo. Nesse tamanho, as espessuras de traço são 0,9 e 0,6px.
- **Corpo:** o resto do livro é o papel. O título começa 9px depois da ponta, em Bitter 800 com 0,43 da espessura (títulos de duas linhas usam 0,33 da espessura, com entrelinha 1,05), no `destaque`. O número fica alinhado à direita, 10px antes do fim, em Bitter 700 com 0,4 da espessura, no `destaque`.
- **Volume:** gradiente vertical `rgba(0,0,0,.14) 0%, rgba(255,255,255,.08) 38%, rgba(255,255,255,.02) 62%, rgba(0,0,0,.16) 100%`, mais o grão.

## Séries: revista técnica

As séries têm formato de revista, para nunca serem confundidas com as categorias: cada post é uma edição. De uma série para outra mudam a cor de destaque, o título, o emblema, o número de capa, a lista de edições e a tarja (os dados estão em `livros.json`).

**Capa (480 × 720):**

- **Papel e faixa:** papel com grão e cantos quase retos. Uma faixa de 14px no destaque atravessa o topo.
- **Cabeçalho:** `tituloPrincipal` em Bitter 800 64/64px, letter-spacing −0.03em, em x=36 e y=40, na tinta do papel. Logo abaixo, em x=38 e y=104, o `complemento` em Newsreader itálico 500, 44/48px, no destaque.
- **Linha de dados:** em y=168, com 408px de largura, fio de 2px em cima e 1px embaixo, 8px de respiro. "SÉRIE 01", "CESAR SCHUTZ" e "7 EDIÇÕES", em Bitter 700 12px com letter-spacing 0.16em.
- **Número de capa:** o `rotuloDoNumero` em Newsreader itálico 18px em y=232. Logo abaixo, o `numeroDeCapa` enorme, em Bitter 800 250/250px, letter-spacing −0.06em, no destaque, em x=26 e y=238.
- **Lista de edições:** à direita do número, em x=300, y=262, com 144px de largura. Cada linha tem fio em cima, o nome em Bitter 600 17px e uma nota em Newsreader itálico 15px à direita ("arquivo" ou "edição atual"). A edição atual fica em Bitter 800, no destaque.
- **Tarja:** opcional, é o material especial da série. Uma faixa escura de largura inteira, em y=498, com 78px de altura, na tinta do papel, com uma barra de 10px no destaque à esquerda. O `guia.titulo` vai em Bitter 800 25/28px no papel, e a `guia.linha` em Newsreader itálico 19/24px em `#e9a27a` (o destaque clareado). À direita, uma seta num círculo de 36px com borda de 2px no destaque.
- **Rodapé:** o emblema na tinta do papel, na área de x 36 a 150 e de y 588 a 694. Ao lado, em x=172 e y=598, o `subtitulo` em Newsreader itálico 20/27px, com 272px de largura. Embaixo dele, em y=668, "BLOG.CESARSCHUTZ.COM.BR" em 10px.

**Lombada em pé:**

- **Base:** papel, fina (80px de largura na estante), com a faixa de 14px no destaque no topo.
- **Conteúdo:** o emblema girado 90°, o título na vertical em Bitter 800 26px, com o complemento em Newsreader itálico no destaque, e o número no pé em Bitter 800 26px, no destaque.

**Lombada deitada:**

- **Base:** papel com uma barra no destaque na ponta esquerda, com 0,28 da espessura.
- **Conteúdo:** o emblema em pé, o título em Bitter 800 com 0,42 da espessura e o complemento em itálico no destaque, separados por 0,24em. O número fica à direita, no destaque.

## Livros novos

- **Categoria:** escolha um instrumento de ofício que represente a categoria inteira e desenhe no estilo do projeto, com traço de 1,8, 1,2 e 0,7px, leve tremor, hachura nas sombras e um único elemento fantasma tracejado. Gere o ícone da lombada com só os traços principais. A frase segue o molde do subtítulo, e o volume é o próximo número.
- **Série:** use o formato revista. Defina a cor de destaque, o título (palavra principal e complemento em itálico), o emblema no mesmo traço, o número de capa, a lista de edições e, se houver material especial, a tarja.
