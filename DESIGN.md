---
version: alpha
name: Blog de Cesar Schutz, Folhas claras
description: >-
  Blog técnico em pt-BR. Fundo claro e quente, conteúdo em folhas brancas, azul-tinta no que é
  clicável e categorias como livros de uma coleção. Os valores de cor espelham src/styles/tokens.ts
  (interface) e docs/capas (livros); quem muda um valor muda os dois.
colors:
  # Interface, tema claro (tokens.ts, claro)
  primary: "#2549B8"
  on-primary: "#FFFFFF"
  neutral: "#F1F0EB"
  surface: "#FFFFFE"
  on-surface: "#1A2124"
  on-surface-variant: "#57605E"
  ink-3: "#868D8A"
  rule: "#E2E0D8"
  well: "#F5F5F4"
  aviso-nota: "#3F5878"
  aviso-dica: "#2F6B4F"
  aviso-importante: "#654262"
  aviso-atencao: "#9A6B12"
  aviso-cuidado: "#A3432A"
  quadro: "#FFFFFF"
  tabua: "#B5BAB4"
  tabua-borda: "#9BA19B"
  aparador: "#7A8280"
  aparador-luz: "#9AA19F"
  aparador-fundo: "#6F7775"
  lousa: "#15191C"
  lousa-borda: "#2C3438"
  lousa-caneta: "#F4F6F5"
  lousa-mistura: "#9FF5DC"
  marca: "#2D4B46"
  marca-letra: "#F2EDE2"
  marca-fita: "#C24D1C"
  veu: "#0C0F11"
  veu-tinta: "#EEF1EE"
  caneta: "#1F4FB5"
  marca-texto: "#FFE27A"
  # Interface, tema escuro (tokens.ts, escuro)
  primary-escuro: "#93AEFF"
  on-primary-escuro: "#0D1530"
  neutral-escuro: "#111618"
  surface-escuro: "#1A2124"
  on-surface-escuro: "#E7E9E4"
  on-surface-variant-escuro: "#A9B0AC"
  ink-3-escuro: "#7F8884"
  rule-escuro: "#2A3336"
  well-escuro: "#21282A"
  lousa-escuro: "#CFD5D1"
  lousa-borda-escuro: "#8F989D"
  lousa-caneta-escuro: "#16212B"
  lousa-mistura-escuro: "#0B6F58"
  caneta-escuro: "#8FA8FF"
  marca-texto-escuro: "#FFD65A" # a 30% sobre a folha (rgba(255, 214, 90, .30))
  # Livros (docs/capas/livros.json e cores.js): a cor principal de cada categoria
  arquitetura-de-software: "#2d4b46"
  desenvolvimento-de-software: "#7a4430"
  dados: "#5f4662"
  ia: "#6e2f45"
  seguranca: "#606a37"
  devops: "#465976"
  sre: "#c4a050"
  sre-destaque: "#836100"
  carreira: "#9a7650"
  carreira-destaque: "#7f5b36"
  carreira-texto: "#816342"
  livro-papel: "#f2ede2"
  livro-tinta-papel: "#1f1c18"
  livro-tinta-clara: "#efe8d8"
  livro-tinta-escura: "#29251b"
  # Séries (revista técnica)
  serie-java: "#c24d1c"
  serie-java-clara: "#e9a27a"
  serie-java-texto: "#b8481a"
typography:
  display-nome:
    fontFamily: Besley
    fontSize: 64px
    fontWeight: 800
    lineHeight: 1
    letterSpacing: -0.02em
  headline-artigo:
    fontFamily: Besley
    fontSize: 50px
    fontWeight: 700
    lineHeight: 1.06
    letterSpacing: -0.014em
  headline-secao:
    fontFamily: Besley
    fontSize: 30px
    fontWeight: 700
    lineHeight: 1.2
  headline-sm:
    fontFamily: Besley
    fontSize: 21px
    fontWeight: 700
    lineHeight: 1.3
  body-artigo:
    fontFamily: Literata
    fontSize: 18.5px
    fontWeight: 400
    lineHeight: 1.72
    fontFeature: '"onum" 1'
  body-md:
    fontFamily: Literata
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.6
  anotacao:
    fontFamily: Literata
    fontSize: 25px
    fontWeight: 400
    lineHeight: 1.2
  label-lg:
    fontFamily: IBM Plex Sans
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.4
  label-md:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.4
  label-sm:
    fontFamily: IBM Plex Sans
    fontSize: 12.5px
    fontWeight: 500
    lineHeight: 1.3
  code:
    fontFamily: JetBrains Mono
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.6
  capa-titulo:
    fontFamily: Bitter
    fontSize: 108px
    fontWeight: 800
    lineHeight: 1
    letterSpacing: -0.03em
  capa-rotulo:
    fontFamily: Bitter
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 0.2em
  capa-frase:
    fontFamily: Newsreader
    fontSize: 24px
    fontWeight: 400
    lineHeight: 1.29
  lombada-titulo:
    fontFamily: Bitter
    fontSize: 30px
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: -0.01em
rounded:
  none: 0px
  marcador: 2px
  capa-lombada: 1px
  capa-aberta: 3px
  painel: 10px
  folha: 14px
  full: 9999px
spacing:
  gutter-min: 16px
  gutter-max: 32px
  largura: 1320px
  coluna: 720px
  altura-topo: 60px
  altura-topo-celular: 104px
  estante-entre-livros: 6px
components:
  pagina:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
  pagina-escuro:
    backgroundColor: "{colors.neutral-escuro}"
    textColor: "{colors.on-surface-escuro}"
  folha:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.folha}"
    typography: "{typography.body-md}"
  folha-escuro:
    backgroundColor: "{colors.surface-escuro}"
    textColor: "{colors.on-surface-escuro}"
  texto-secundario:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface-variant}"
    typography: "{typography.label-md}"
  texto-secundario-escuro:
    backgroundColor: "{colors.surface-escuro}"
    textColor: "{colors.on-surface-variant-escuro}"
  texto-decorativo:
    textColor: "{colors.ink-3}"
  texto-decorativo-escuro:
    textColor: "{colors.ink-3-escuro}"
  fio:
    backgroundColor: "{colors.rule}"
    height: 1px
  fio-escuro:
    backgroundColor: "{colors.rule-escuro}"
    height: 1px
  artigo-titulo:
    textColor: "{colors.on-surface}"
    typography: "{typography.headline-artigo}"
  artigo-corpo:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-artigo}"
    width: 720px
  codigo:
    backgroundColor: "{colors.well}"
    textColor: "{colors.on-surface}"
    typography: "{typography.code}"
    rounded: "{rounded.painel}"
  codigo-escuro:
    backgroundColor: "{colors.well-escuro}"
    textColor: "{colors.on-surface-escuro}"
  link:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
  link-escuro:
    backgroundColor: "{colors.surface-escuro}"
    textColor: "{colors.primary-escuro}"
  botao-ler-artigo:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.full}"
    padding: 10px
  botao-ler-artigo-escuro:
    backgroundColor: "{colors.primary-escuro}"
    textColor: "{colors.on-primary-escuro}"
  painel-desenho:
    backgroundColor: "color-mix(in oklab, #2d4b46 11%, #FFFFFE)"
    rounded: "{rounded.painel}"
  aviso-nota:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.aviso-nota}"
  aviso-dica:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.aviso-dica}"
  aviso-importante:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.aviso-importante}"
  aviso-atencao:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.aviso-atencao}"
  aviso-cuidado:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.aviso-cuidado}"
  moldura-diagrama-antigo:
    backgroundColor: "{colors.quadro}"
  lousa:
    backgroundColor: "{colors.lousa}"
    textColor: "{colors.lousa-caneta}"
    typography: "{typography.anotacao}"
  lousa-borda:
    backgroundColor: "{colors.lousa-borda}"
  lousa-mistura:
    backgroundColor: "{colors.lousa-mistura}"
  lousa-escuro:
    backgroundColor: "{colors.lousa-escuro}"
    textColor: "{colors.lousa-caneta-escuro}"
  lousa-borda-escuro:
    backgroundColor: "{colors.lousa-borda-escuro}"
  lousa-mistura-escuro:
    backgroundColor: "{colors.lousa-mistura-escuro}"
  prateleira:
    backgroundColor: "{colors.tabua}"
    height: 14px
  prateleira-borda:
    backgroundColor: "{colors.tabua-borda}"
    height: 6px
  aparador:
    backgroundColor: "{colors.aparador}"
    width: 12px
  aparador-luz:
    backgroundColor: "{colors.aparador-luz}"
  aparador-fundo:
    backgroundColor: "{colors.aparador-fundo}"
  marca:
    backgroundColor: "{colors.marca}"
    textColor: "{colors.marca-letra}"
  marca-fita:
    backgroundColor: "{colors.marca-fita}"
  veu:
    backgroundColor: "{colors.veu}"
    textColor: "{colors.veu-tinta}"
  capa-arquitetura-de-software:
    backgroundColor: "{colors.arquitetura-de-software}"
    textColor: "{colors.livro-tinta-clara}"
    typography: "{typography.capa-titulo}"
  capa-desenvolvimento-de-software:
    backgroundColor: "{colors.desenvolvimento-de-software}"
    textColor: "{colors.livro-tinta-clara}"
  capa-dados:
    backgroundColor: "{colors.dados}"
    textColor: "{colors.livro-tinta-clara}"
  capa-ia:
    backgroundColor: "{colors.ia}"
    textColor: "{colors.livro-tinta-clara}"
  capa-seguranca:
    backgroundColor: "{colors.seguranca}"
    textColor: "{colors.livro-tinta-clara}"
  capa-devops:
    backgroundColor: "{colors.devops}"
    textColor: "{colors.livro-tinta-clara}"
  capa-sre:
    backgroundColor: "{colors.sre}"
    textColor: "{colors.livro-tinta-escura}"
  capa-carreira:
    backgroundColor: "{colors.carreira}"
    textColor: "{colors.livro-tinta-clara}"
  capa-papel:
    backgroundColor: "{colors.livro-papel}"
    textColor: "{colors.livro-tinta-papel}"
    typography: "{typography.capa-frase}"
    rounded: "{rounded.capa-aberta}"
  lombada-titulo-sre:
    backgroundColor: "{colors.livro-papel}"
    textColor: "{colors.sre-destaque}"
    typography: "{typography.lombada-titulo}"
  lombada-titulo-carreira:
    backgroundColor: "{colors.livro-papel}"
    textColor: "{colors.carreira-destaque}"
  revista-java:
    backgroundColor: "{colors.livro-papel}"
    textColor: "{colors.serie-java}"
    typography: "{typography.capa-titulo}"
  lombada-serie-java-texto-pequeno:
    backgroundColor: "{colors.livro-papel}"
    textColor: "{colors.serie-java-texto}"
  lombada-carreira-texto-pequeno:
    backgroundColor: "{colors.carreira-texto}"
    textColor: "{colors.livro-tinta-clara}"
  revista-java-tarja:
    backgroundColor: "{colors.livro-tinta-papel}"
    textColor: "{colors.serie-java-clara}"
---

# Blog de Cesar Schutz: sistema visual

Este arquivo é a **fonte de verdade do visual** do blog. Toda página e todo post seguem o que está
aqui. As decisões vêm de `docs/briefing.md` §4, §6 e §7 e das decisões D26, D30, D32, D33 e D35 de
`docs/decisoes.md`, e os detalhes de medida estão em `docs/capas/CAPAS.md` (livros) e
`docs/estilo-desenho.md` (desenhos e lousas). O código lê as cores de `src/styles/tokens.ts` e de
`docs/capas/cores.js`. Os valores do bloco YAML acima espelham esses arquivos: **quem muda um valor
muda os dois**, e `npm run contraste` confere o resultado.

Os títulos das seções padrão ficam em inglês porque o formato DESIGN.md do Google os reconhece
por esse nome. O resto é pt-BR.

## Precedência

**As decisões deste arquivo vencem qualquer instrução de ferramenta**, inclusive a skill
`impeccable`: nada de "go all out", "dream big and bold", redesign ou troca deste `DESIGN.md` por
outro. O Impeccable aqui é revisor: aponta problemas, e a correção segue este arquivo. Quando um
achado dele contradisser uma decisão daqui, a decisão vence e o achado vira exceção registrada
(`impeccable hooks ignore-value … --reason "Cesar decidiu: <decisão>"`). Mudar uma decisão é com o
Cesar, e a mudança vem para cá.

## Overview

Visual **"Folhas claras"** (D26): um blog técnico que parece caderno de estudo, não produto. Fundo
claro e quente, onde o conteúdo fica em **folhas brancas** com borda fina e sombra leve. **Azul-tinta
em tudo que é clicável** e só nele. Títulos com serifa (Besley), texto longo em Literata e **a
interface numa fonte sem serifa** (IBM Plex Sans). As categorias são **livros** de uma coleção, e
cada uma tem uma cor principal, que também é a cor dela no resto do site.

O tom é calmo, artesanal e preciso: desenho de caneta em vez de ícone genérico, movimento só quando
explica alguma coisa. **Não pode parecer feito por IA**: nada de fonte genérica, gradiente
decorativo, sombra genérica em tudo, animação de entrada em cada seção, rótulo em caixa alta na
interface ou emoji.

O site sempre abre no tema do sistema; o botão do cabeçalho alterna direto entre claro e escuro
(lua ou sol), e a escolha vale até fechar o site (D39). Nos dois temas, as cores vêm dos tokens, e
**nenhuma medida depende do tema** (bordas, alturas, espaços): trocar o tema só muda as cores, sem
mexer na página. O site não tem som.

## Colors

**Interface (tokens de `src/styles/tokens.ts`).**

- **Papel da página (`neutral`, #F1F0EB):** o fundo claro quente sobre o qual as folhas ficam.
- **Folha (`surface`, #FFFFFE):** a superfície de todo conteúdo principal.
- **Tinta (`on-surface`, #1A2124):** texto e traço dos desenhos. **Tinta 2 (#57605E)** para
  metadados e legendas; **tinta 3 (#868D8A)** só para texto grande ou decorativo, e só sobre a folha.
- **Fio (`rule`, #E2E0D8):** bordas das folhas e divisórias.
- **Poço (`well`, #F5F5F4):** código e cabeçalho de tabela, a folha com 4% de tinta.
- **Azul-tinta (`primary`, #2549B8; #93AEFF no escuro):** a única cor de interação. Links de texto,
  item ativo do menu, botão "Ler artigo", seletor Lista/Cards, item atual da paginação e
  foco. A navegação do cabeçalho e do rodapé, as pílulas e os botões secundários ficam na tinta e só
  ganham o azul ao passar o mouse. Não serve de decoração.
- **Avisos:** Nota, Dica (também a linha adicionada no diff), Importante, Atenção e Cuidado (também
  a linha removida): fio fino na cor do aviso e fundo só levemente tingido (briefing §5.3), nunca a
  caixa pintada da cor inteira.
- **Lousa:** sempre o contrário da página. No tema claro é vidro escuro (#15191C) com caneta clara;
  no escuro, quadro branco suavizado (#CFD5D1, nunca branco puro) com caneta escura.
- **Marca e véu** (D33): o livro "cs" e o fundo do visor de imagens.
- **Caneta do caderno** (D48, `caneta`, #1F4FB5; #8FA8FF no escuro): o azul de caneta das marcações
  dos artigos, **igual em todos os livros**. Não é cor de interação: fica só nos traços (riscos,
  círculos, caixas, setas, marcas de margem) e nas notas à mão, **nunca no texto marcado**, que
  continua na cor normal, para não se confundir com os links (azul-tinta). As notas à mão não têm
  sublinhado nem cara de link. Passa de 4,5:1 sobre a folha, o fundo e o código nos dois temas.
- **Marca-texto** (D48, `marca-texto`, #FFE27A; no escuro, o mesmo amarelo a 30% sobre a folha):
  amarelo clássico, igual em todos os livros, com o texto sempre em `on-surface` por cima (12,75:1
  no claro, 5,92:1 no escuro). Chama muita atenção: no máximo uma ou duas vezes por post.

**Livros (cor principal de cada categoria, `docs/capas/livros.json`).** A mesma cor pinta a capa, a
lombada, o chip da categoria (quadradinho e nome tingido), a barra de leitura e o **painel dos
desenhos** dos posts da categoria:

| Vol. | Categoria | Cor | Tinta sobre a cor | Destaque sobre o papel |
|---|---|---|---|---|
| 01 | Arquitetura de Software | #2d4b46 | clara | #2d4b46 |
| 02 | Desenvolvimento de Software | #7a4430 | clara | #7a4430 |
| 03 | Dados | #5f4662 | clara | #5f4662 |
| 04 | IA | #6e2f45 | clara | #6e2f45 |
| 05 | Segurança | #606a37 | clara | #606a37 |
| 06 | DevOps | #465976 | clara | #465976 |
| 07 | SRE | #c4a050 | escura | #836100 |
| 08 | Carreira | #9a7650 | clara | #7f5b36 |

A tinta e o destaque saem sempre de `coresDoLivro()` (`docs/capas/cores.js`), nunca de um valor
fixo. No tema escuro, o destaque dos desenhos leva 42% de branco. **Os livros não mudam com o tema**
(D39): pelos papéis de cor (`--cima`, `--baixo`), a categoria tem sempre o papel em cima e a cor do
livro embaixo, e a série (revista) é sempre papel claro. **Cor só por token**:
nenhum hex solto em componente ou SVG.

**Lousa, mistura:** `lousa-mistura` não é cor de texto, só entra na mistura do destaque da lousa
(55% no vidro, 35% no quadro, com a caneta por cima; `LOUSA` em `tokens.ts`).

**Contraste da Carreira e da série: exceção decidida (D35).** O texto claro sobre a cor da Carreira
(#9a7650) dá 3,39:1, e o laranja da série sobre o papel (#c24d1c), 4,11:1. As duas cores continuam
**nas capas e nos títulos grandes** (acima de 3:1, o mínimo do WCAG para texto grande), e o linter
avisa sobre `capa-carreira` e `revista-java` por isso: são avisos esperados. **Texto pequeno
nessas cores sempre usa a variante escura:** `carreira-texto` (#816342, 4,53:1 com a tinta clara)
atrás de texto pequeno da Carreira e `serie-java-texto` (#b8481a, 4,52:1 sobre o papel) como texto
pequeno da série. Hoje isso vale para as lombadas, em pé e deitadas (`corTexto` e `destaqueTexto` em
`docs/capas/livros.json`, papéis `--livro-cor-texto` e `--livro-destaque-texto`), e o
`npm run contraste` falha se alguma lombada ficar abaixo de 4,5:1. Livro novo com cor abaixo de
4,5:1 ganha a variante do mesmo jeito.

## Typography

- **Títulos:** Besley 700. O nome na abertura da home e a marca, 800.
- **Texto:** Literata, com o eixo `opsz`. No artigo, 18,5px com entrelinha 1,72 numa coluna de até
  720px (uns 72 caracteres, D39), com números em estilo antigo (`oldstyle-nums`).
- **Interface:** IBM Plex Sans 400, 500 e 600, em menu, busca, datas, tempo de leitura, categoria,
  tags, botões, trilha, sumário e legendas. Rótulos em caixa normal, sem caixa alta.
- **Títulos que acompanham a tela** usam `clamp`, e os valores do meio não entram na rampa: o h1 das
  páginas de lista e da 404 vai de 34 a 52px; o do artigo, até os 50px de
  `headline-artigo`; o título de cada artigo na lista, de 21 a 25px (D27).
- **Código:** JetBrains Mono, pelo Expressive Code. Na barra do bloco, o título à esquerda e a
  linguagem numa etiqueta (pílula fina, IBM Plex Sans) à direita (D39). Sem título, a barra tem a
  mesma altura, com a etiqueta no meio dela (D49). O Copiar é uma pílula de papel com as duas folhas
  do ícone; ao copiar, vira "✓ Copiado" (D49).
- **Quebras (D39):** títulos com `text-wrap: balance`, o travessão preso à palavra seguinte e, no
  celular, o h1 do artigo encolhe com a tela (até 24px) para o pedaço mais longo caber sem quebrar
  no meio. Código em linha (texto, tabelas, sumário) quebra depois dos pontos (`<wbr>`), nunca no
  meio do nome; nas tabelas, o que não couber faz a tabela rolar.
- **Livros:** Bitter (600, 700 e 800) e Newsreader itálico, só nas capas, nas lombadas e nos
  títulos da lateral. A caixa alta com espaçamento largo ("VOLUME 01", "CESAR SCHUTZ",
  "BLOG.CESARSCHUTZ.COM.BR") existe só aqui, como tipografia de livro.
- **Anotações dos desenhos e rótulos das lousas:** Literata itálica. **Nunca letra de mão.**
- **Notas da caneta do caderno** (D48): **Caveat 600**, a única letra de mão do blog, só nas notas
  escritas à caneta dos artigos (nota na margem, correção, pergunta, chave, números circulados,
  anotações no código e comentário do autor). Auto-hospedada (`@fontsource/caveat`, um peso só,
  51 KB no latim) e declarada só nos posts que têm nota escrita. Tamanho: 1,2em do texto (1,3em na
  correção e nas notas do código, que é menor), sem sublinhado.
- Todas as fontes são servidas pelo próprio site (`@fontsource`). Nunca Google Fonts nem CDN.

## Layout

Conteúdo de até 1320px, com margem lateral de 16 a 32px (`clamp`). O cabeçalho é fixo, e toda
âncora ou peça `sticky` desconta `--altura-topo` (60px, também no celular, D46). No artigo, o texto
ocupa a folha do corpo, com margem pequena (`--margem-folha`, de 22 a 46px), na mesma largura do
código, das tabelas, dos diagramas, das lousas e da apresentação (D46); o topo (ilustração e título)
tem a mesma largura e a mesma margem. No
celular, o corpo do artigo não fica num cartão: o texto usa a largura da página, com a margem normal.
A partir de 1300px, a coluna da esquerda começa no topo da página: o sumário numa folha própria e fixa,
com a barra "NN% lido" embaixo; o fio das seções lidas, o ponto atual e a barra usam **a cor do
livro do post** (o destaque do livro; no escuro, com 42% de branco), e embaixo da folha do sumário
fica **o livro do artigo, grande e de lado** (D46), num painel tingido, com a lupa, o nome e "Ver o livro".
**O sumário acompanha a leitura (D49):** um fio de tinta à mão desce pelo trilho até a altura lida;
cada seção lida ganha um visto desenhado no marco; a seção atual fica com o marca-texto na cor do
livro (`--sumario-marca-*`, no `tokens.ts`; contraste no `npm run contraste`). Abaixo de 1300px, o
cabeçalho mostra "N de M · seção" no lugar da marca e abre o sumário numa folha que desce dele, com
as cores do livro. Toda página tem o **voltar ao topo** depois de uma tela de rolagem
(`VoltarTopo.astro`, no `Base.astro`). A home é paginada de 12 em 12. A estante tem 6px entre os livros.
Nada pode rolar para o lado em 390px nem em 320px. O sumário nunca rola para o lado. Toda área que
rola por dentro (sumário, código, tabelas, gaveta, busca, painel) usa a **barra fina** do site, na
tinta do tema com 24% (40% ao passar o mouse), por `scrollbar-width`, `scrollbar-color` e
`::-webkit-scrollbar` (`base.css`, D39).

## Elevation & Depth

A profundidade é de **papel sobre mesa**, e não de cartão flutuante. As folhas têm sombra baixa e
difusa, que sobe um pouco quando o mouse passa:

- claro: `0 1px 2px rgba(40,38,30,.04), 0 10px 28px -18px rgba(40,38,30,.28)`; ao passar o mouse,
  `0 2px 4px rgba(40,38,30,.05), 0 18px 36px -18px rgba(40,38,30,.35)`;
- escuro: `0 12px 30px -18px rgba(0,0,0,.8)`; ao passar o mouse, `0 18px 36px -16px rgba(0,0,0,.9)`.

Os livros têm volume próprio (sombra, grão e o gradiente da lombada, pelo `CAPAS.md`). Painéis,
caixas e desenhos dentro de uma folha **não** levam sombra.

## Shapes

Folhas com raio de 14px e painéis e caixas dentro delas com 10px (aviso, tabela, `<details>`, nota
lateral, bloco de código, resultado da busca, item de menu). Marcadores e detalhes em linha (código em linha, `kbd`, quadradinho
do chip, destaque da busca) ficam entre 2 e 4px. Um painel encostado na borda da
folha herda o canto dela. A pílula (botão "Ler artigo", tags) é totalmente arredondada. As capas
têm 1px de raio do lado da lombada e 3px do lado aberto, e as revistas têm cantos quase retos.

## Components

- **Folha:** superfície, fio, raio de 14px e sombra leve. Abertura da home, destaque, lista, cada
  card, topo do artigo, corpo do artigo e sumário.
- **Painel do desenho:** a cor da categoria misturada à superfície, 11% no claro e 20% no escuro
  (o exemplo do YAML usa Arquitetura). Ele define `--fig-bg`, e as áreas preenchidas do desenho usam
  essa mesma cor.
- **Chip de categoria:** quadradinho na cor do livro e nome tingido (34% de tinta no claro, 50% de
  branco no escuro). Leva à página da categoria.
- **Botão "Ler artigo":** pílula azul-tinta com seta, texto em `on-primary`.
- **Marca d'água do livro** (D39): o desenho da capa (ou o emblema da revista), grande, na cor do
  livro com 10% de opacidade, cortado pela borda da folha, no topo das páginas de categoria e de
  série e no canto de baixo do painel do título do artigo (D50; menor no celular). Entra como máscara
  (`/livros/marca/<slug>.svg`, `MarcaDagua.astro`), sem repetir o desenho no HTML.
- **Diagramas antigos** (SVG com fundo branco, `public/posts/`): num quadro claro no tema claro e,
  no escuro, na versão escura feita por filtro (luz invertida e matiz de volta, D39), nunca um bloco
  branco na página escura.
- **Caneta do caderno** (D48; guia em `docs/marcacoes.md`, catálogo em
  `docs/prototipos/caneta-do-caderno.html` e, no dev, `/amostra/caneta/`): 20 tipos de marcação,
  todos **estáticos** (já vêm feitos, como se o texto tivesse sido riscado antes de publicar). Traço
  à mão de 1,9px na `caneta`, com as pontas redondas, em SVG decorativo (`aria-hidden`); notas em
  Caveat; marca-texto amarelo cobrindo de 18% a 94% da linha. Medidas (`src/styles/caneta.css`):
  - **Margem:** colchete, asterisco, exclamação e interrogação ficam no respiro da folha, 1,45rem à
    esquerda do texto, quando a folha tem ao menos 30px de margem (tela ≥ 940px); abaixo disso, o
    parágrafo marcado recua 1,6rem e a marca fica no recuo. Certo e errado e números circulados
    usam o recuo da própria lista (1,9em). Nada corta nem cria rolagem lateral.
  - **Notas acima da palavra** (nota na margem, riscado com correção): a palavra abre 1,3em de
    espaço na própria linha, e a nota fica ali, 0,25em abaixo do topo e inclinada 2° pelo meio, sem
    cobrir a linha de cima. Quando a nota passaria da margem direita, ela termina sobre a palavra, com
    a seta virada (`src/scripts/caneta.ts`); se ainda não couber, e sempre no celular (≤ 640px), vai
    logo depois da palavra.
  - **Círculo:** a folga cresce com o trecho (0,2em + 6,5% de cada lado); acima de 12 caracteres, o
    círculo se cruza no alto, para não cortar as primeiras letras.
  - **Seta ligando:** o trecho abre 0,75em acima da própria linha, e o arco fica na parte de baixo desse
    respiro, com as pontas descendo até as letras (longe da linha de cima, não parece sublinhá-la).
  - **Celular:** a folha do artigo passa 12px do texto de cada lado (dentro da margem de 16px), sem
    mudar o texto de lugar, para os traços de uma palavra que abre a linha não serem cortados.
  - **Código:** a nota fica ao lado da linha quando cabe e embaixo dela (com "↑", parada na esquerda
    do bloco) quando a linha é longa e sempre no celular, para a rolagem do bloco não cortá-la.
  - Na impressão, tudo aparece; em alto contraste, os traços seguem a cor do texto.
- **Aviso de conteúdo feito com ajuda de IA:** no fim do artigo, antes do cartão "Do livro", num bloco
  levemente tingido (a cor de Atenção) com o ícone de Nota, sem "Saiba mais" (D33, D37).

### Livros das categorias: "edição de estudo"

Todos seguem o mesmo padrão de coleção (capa e lombada iguais para todos, mudando só cor, título,
frase e desenho; medidas em `docs/capas/CAPAS.md`):

- **Capa:** no alto, o **papel** com "VOLUME 0N", "CESAR SCHUTZ" e o **título grande** (Bitter 800,
  até 108px) no destaque. Embaixo, **a cor do livro só com a frase** (Newsreader itálico) e o
  **desenho do instrumento de ofício, o maior possível**, na tinta (D39; a referência de
  `docs/capas` tem os papéis ao contrário, com as mesmas medidas). **Sem lista de
  temas.** No pé, a assinatura **BLOG.CESARSCHUTZ.COM.BR**.
- **Lombada:** ícone no papel de cima, título na vertical e número de artigos na cor do livro, com a
  divisão à mesma altura em todos, formando uma linha contínua na estante. **É uma lombada só em
  todo lugar** (D39): a pilha lateral usa a mesma, girada 90° e **mais fina** (a espessura a 62% da
  escala do comprimento, D46), com o título e o número em corpo próprio, de uns 10px.
- **Livro escolhido:** o da página atual na pilha e os não escolhidos do filtro aparecem
  **escurecidos** (opacidade 0,4 e metade da saturação), nunca com contorno azul. A exceção é o livro
  que foi para a gaveta da home (D43): ele sai da estante, e o lugar dele fica **vazio**. O foco do teclado é um anel fino e discreto.
- **Livro 3D em todo lugar** (gaveta, grade de categorias e séries, topo da página do livro, livro
  do artigo e livro ampliado): **de lado, a 38° da frente**, com a lombada bem à vista (`GIRO` em
  `lib/livro-3d.ts`, D46; era 18° fora da gaveta). A perspectiva acompanha a altura do livro
  (4,7 vezes, a da gaveta), para o pequeno e o grande terem a mesma cara.
- O número nas lombadas é o total de artigos, contado pelos posts (some quando é zero). O
  "VOLUME 0N" é a posição na coleção.

### Séries: "revista técnica"

As séries também são livros, mas no formato **revista técnica**, para nunca se confundirem com as
categorias: cada post é uma edição. Hoje só existe **Atualizações do Java** (destaque #c24d1c):
faixa no topo, "Atualizações" e *do Java* em itálico, linha de dados, o número da última edição
enorme com a lista das edições ao lado e a **tarja escura que destaca o guia de atualização** ("do
Java 8 ao 25, passo a passo"), com a xícara e o subtítulo no pé. Uma série nova usa o mesmo formato,
com cor, emblema, edições e tarja próprias.

### Desenhos dos posts

Cada post tem uma ilustração, e os diagramas seguem o mesmo traço:

- **Traço de caneta com leve tremor**, em papel liso: sem textura de fundo, sem perspectiva
  isométrica, terminais e junções arredondados.
- **Hachura a 45°** nas sombras e no volume.
- **Linha fantasma** (traço e ponto, `24 8 4 8 4 8`) para o que não acontece, alternativas e estados
  anteriores.
- **A cor do livro como única cor**, num preenchimento levemente fora do registro. O resto é tinta.
- **Painel tingido pela cor da categoria** como palco. O SVG não pinta fundo.
- Anotações em Literata itálica, só nos recortes grandes.
- **Texto alternativo descritivo** em todo desenho: o que ele mostra e o que isso explica.

**Técnica (D11, D35):** SVG **desenhado à mão**, em coordenadas, com classes e variáveis CSS (sem
`id`, sem `defs` próprios e sem cor fixa). O tremor é o filtro SVG global `feTurbulence`
(`fractalNoise`, `baseFrequency` 0.018, `numOctaves` 2, `seed` 7) seguido de `feDisplacementMap`
(`scale` 4), aplicado só no grupo dos traços, para os textos ficarem nítidos. Nas lousas, o tremor é
mais leve (`baseFrequency` 0.02, `scale` 2). O Rough.js não é usado. Regras técnicas, recortes e
validação: skill `desenho` e `node scripts/desenho/validar.mjs`. **Custo:** o filtro é refeito a
cada quadro enquanto o traço se move, então todo desenho animado passa por um trace de performance
(CPU 4×) antes de ser aceito. Se pesar, o plano B é gravar o tremor na geometria, no build.

### Movimento

**Que ferramenta anima o quê (regra do site todo, 25/09/2026):**

- **CSS** para estados simples: hover, foco, aparecer e sumir.
- **View Transitions** para as transições entre páginas: as nativas do navegador, entre documentos
  (`@view-transition` em `base.css`, D29), sem biblioteca e sem o `<ClientRouter />` do Astro, para
  a página continuar funcionando sem JavaScript.
- **GSAP** para sequências, animações ligadas à rolagem e objetos interativos (abrir, fechar e girar
  os livros, por exemplo), carregado só nos componentes que usam, nunca no pacote de todas as
  páginas. Quando for carregado sob demanda, o download começa um pouco antes do uso (ao passar o
  mouse, ao tocar, ao receber o foco do teclado ou quando a página ficar ociosa), para a primeira
  animação não atrasar.
- **Trocar uma animação que já existe por GSAP** exige, antes, um trace de performance (antes e
  depois, no MCP `chrome-devtools`) e o ganho concreto medido, mostrados ao Cesar. A troca só entra
  com a aprovação dele.

- **Livros em movimento (D40), com GSAP carregado sob demanda** (`src/scripts/gsap.ts`: baixado ao
  passar o mouse, tocar, receber o foco ou com a página ociosa). Só transformações e opacidade, nunca
  `filter` no livro 3D; o foco do teclado faz o mesmo que o mouse; Esc fecha; com movimento reduzido,
  tudo no estado final.
  - **A estante de verdade (D49, `estante-gesto.ts`):** **nada flutua**: o livro ou está apoiado na
    prateleira, ou está na mão. A prateleira tem perspectiva (o olho a 45% da altura, 1400 de
    distância na estante cheia, proporcional nas menores), e cada lombada tem a **cabeça** (o topo das
    páginas, `.cabeca`), que só aparece quando o livro tomba para a frente.
  - **O toque na cabeça** (home e filtro, só com mouse; D49, no lugar da subida de 16px da D47): o
    livro sob o mouse tomba **5°** para a frente pela borda de baixo (0,3s, `power2.out`) e cai de
    volta em pé ao sair (0,3s, `power2.in`); os vizinhos não se mexem. Embaixo, a legenda com o nome e
    a contagem (`estante-viva.ts`). O foco do teclado faz o mesmo.
  - **Estante em repouso** (só a home): depois de 3s sem mouse, toque, tecla ou rolagem, com a estante
    ao menos metade visível e a aba ativa, a cada 4 a 7s um livro sorteado é tocado na cabeça (7°, 0,55s),
    espera 0,5s e cai de volta, assentando. Qualquer interação para tudo e devolve o livro ao lugar.
    Desligada com movimento reduzido.
  - **Tirar da estante** (a gaveta da home, `Gaveta.astro`, D43, D49): no clique, toque ou Enter, o
    livro tomba pela cabeça **dentro do próprio vão** (24°, 0,28s, `power2.out`; a inclinada se
    endireita junto) e só então **vem para a frente** (a profundidade inteira do livro, voltando a 6°,
    0,32s, `power2.inOut`), um nada erguido para o pé não passar da tábua. Aí o **vizinho da direita**,
    sem apoio, **tomba até encostar no outro** (o ângulo sai da geometria das lombadas; acelera como
    queda, bate e assenta); não tombam a inclinada, o primeiro da fileira nem a série sozinha. Na
    frente dos outros, o livro 3D da gaveta toma o lugar da lombada (mesma altura e largura) e anda
    até a gaveta girando até **38°** da frente (0,9s, `power3.inOut`), **fechado**, com a lombada bem
    à vista; a gaveta cresce enquanto isso. Ao pousar, o sumário ao lado aparece subindo 8px (0,35s) e
    a lupa, por opacidade. No celular, tudo 20% mais rápido.
  - **Guardar** (Fechar livro, Esc ou a mesma lombada): o livro 3D volta até a frente do lugar dele
    girando de volta para a lombada (0,6s), **entra na prateleira empurrando o vizinho** de volta
    (0,4s; o vizinho sai do encosto sem quicar) e assenta (1px); a inclinada volta a se apoiar no
    aparador. **Trocar de livro guarda o aberto antes de tirar o outro.**
  - **Puxar pela cabeça** (só com mouse, Draggable e InertiaPlugin): arrastar a cabeça para baixo
    tomba o livro até 30°; a partir de 22°, ele se solta, vem para a frente e segue o mouse. Solto
    abaixo da prateleira (a velocidade do arremesso conta), vai para a gaveta; solto no ar, volta para
    o lugar; sem chegar a 22°, cai de volta em pé. Só clicar faz o gesto inteiro sozinho.
  - Com **movimento reduzido**, o livro aparece na gaveta, o lugar dele fica vazio e o vizinho já
    aparece tombado; guardar devolve tudo na hora.
  - **A pilha com peso** (a pilha lateral, D46, D49): ao passar o mouse (ou com o foco), o livro sai
    8px (0,3s, `power2.out`) e o bloco de cima vai junto 1,5px pelo atrito (0,4s); volta sem mola
    (0,32s, `power3.out`). O livro aberto no topo não está na pilha, e a pilha guarda em cima o espaço
    dele (`--folga`). Ao clicar, **primeiro o aberto é guardado**: vira de lado (0,3s, `power2.in`),
    voa até a pilha deitando-se (0,7s, `power3.inOut`), desce por gravidade (0,22s, `power2.in`),
    afunda 1px e para; **depois o escolhido é puxado** (até sair inteiro, `power2.in`, 0,12 a 0,54s),
    com o bloco de cima indo junto 3px, tombando sobre a quina quando a ponta do puxado passa do centro
    de massa dele (até 25°) e caindo no lugar com um baque de 1px. Aí a página nova abre, e a View
    Transition leva só o puxado até o topo. Com mouse, dá para puxar devagar (Draggable): solto depois
    da metade, sai; antes, volta perdendo velocidade. No celular, 20% mais rápido e sem arrasto.
  - **Livro que gira** (D46, `data-livro-gira`, só CSS): na grade de categorias e séries, no topo da
    página do livro, no destaque de Séries e no livro do artigo, o livro vira de 38° para 24° ao
    passar o mouse (0,5s). A capa que seguia o mouse, com a luz e a capa entreaberta (`capa-viva.ts`,
    D40), saiu na D46.
  - **O livro que abre** (o livro ampliado, D49, no lugar do giro com embalo): a capa gira pela
    lombada (0,95s, `power2.inOut`; no celular, 0,71s) e, ao pousar, bate e volta um nada (0,07s e
    0,12s); o livro vira de 38° para de frente enquanto abre, e a lombada vai para o meio. A folha é
    leve: vira em 0,75s (`sine.inOut`), com a metade de fora até 24° atrás da de dentro (a folha curva
    no meio da virada e chega reta) e uma sombra de até 22% no meio do caminho. Arrastar segue o dedo
    e, ao soltar, a inércia leva a folha até aberta ou fechada (0,25 a 0,7s; a capa, até 0,9s), sem
    passar do fim. Fechar o visor com o livro aberto: as folhas voltam juntas e a capa por cima
    (0,6s), e só então o livro volta para o de origem. No celular, as folhas viram retas e a vista
    corre para a página da vez (0,45s). As páginas não mudam com o tema (papel e tinta de papel).
- **Caneta do caderno (D48):** **não anima.** As marcações já vêm feitas (a animação por rolagem do
  caderno marcado da D41, com ScrollTrigger e DrawSVG, saiu).
- **O desenho do destaque da home** (D41, só ali): ao entrar na tela, os traços aparecem em sequência
  com DrawSVG (1,1s cada, sequência de até ~1,2s), depois a cor, a hachura (0,6s) e os textos (0,4s);
  tracejados só por opacidade.
- **Marca "cs"** (D41, D47, só CSS): no hover ou foco, a capa entreabre 38° sobre as páginas (0,5s). A
  fita saiu na D47; o "c" fica acima e o "s" abaixo, em degrau.
- **Abertura do site** (D51, `Abertura.astro`, GSAP; protótipos 01 e 02 de
  `docs/prototipos/animacoes/`): toca **ao chegar de fora e ao recarregar** (o script do `<head>`
  decide), sem movimento reduzido; um clique ou tecla pula. Na home, **a estante se monta (A3)**: a
  caneta risca um fio só onde vai ficar a tábua (o caminho é refeito em pixels, sem `vector-effect`), o
  fio vira a tábua, os livros entram da direita um a um (Volume 01 primeiro, 75 ms entre eles,
  inclinados pelo atrito e assentando) com a contagem da coleção embaixo, a estante volta para a folha e
  o papel esmaece (0,55s). Nas outras páginas, **o caderno "cs"** carrega (caneta e contagem até 100),
  abre e fecha (a capa tem frente e verso) e pousa na marca do cabeçalho; o papel esmaece e as folhas da
  página chegam do fundo (em Categorias, com o desfile e a pilha). Durante ela, as transições de CSS
  ficam desligadas.
- **Troca de página por folhas** (D51, `src/scripts/troca.js`, embutido no `<head>`; View Transitions
  entre documentos animadas pela Web Animations API, sem biblioteca; protótipo 03, "cai da mesa",
  texto fora): o cabeçalho parado e o traço do menu deslizando; as folhas à vista da página antiga caem
  da mesa (600 ms, de baixo para cima, 45 ms entre elas, giro de até 7°) e os textos soltos sobem 10px
  e somem (200 ms); as da nova chegam do fundo em perspectiva e pousam (1s, `cubic-bezier(.25,1,.5,1)`,
  85 ms entre elas, a partir de 0,2s); textos novos sobem por uma máscara. Voltando pelo histórico, as
  novas vêm da frente. Livros com par nas duas páginas voam (só o livro viaja, protótipo 07); a folha
  deles só esmaece. Artigo anterior e próximo: **na pilha** (protótipo 06). Categorias: **desfile e
  pilha** (protótipo 04, script da página). Tag: **desfile direto** (60 ms). O desenho do topo do
  artigo se desenha **depois de pousar** (protótipo 08, a sequência do C1). A troca de livro pela pilha e
  a navegação com um diálogo aberto usam a folha de antes (a antiga sobe 6px e some, a nova sobe 18px).
- **Gaveta** (D47): cresce (0,8s) com o conteúdo de baixo descendo junto; recolhe ao fechar; na troca
  de livro, vai da altura de um para a do outro (0,55s).
- **Livro ampliado** (D47): cresce do livro de origem (0,7s, `power3.inOut`) e volta para ele ao fechar
  (0,55s), girando de volta a 38°, com o véu clareando.
- **Filtro por livro** (D47): a lista esmaece (0,18s) e os primeiros artigos chegam subindo (0,42s,
  40ms entre eles). O total e o de cada ano rodam como contador já no clique (D49, `contador.ts`):
  cada algarismo numa fita (0,55s, `power3.out`, as dezenas 0,05s depois), e a coluna que sobra fecha
  a largura (0,4s).
- **Sem lousa de passos** (D46): a lousa que a caneta desenha enquanto o texto rola saiu. Nos posts,
  só a linha do tempo de arrastar e a animação curta em loop.
- **Diagrama que avança com a rolagem só em posts que explicam um fluxo** (passo a passo, linha do
  tempo, antes e depois). Em outros casos, desenho parado. Animações novas desse tipo usam GSAP em
  SVG, carregado só no post que as usa. Com play/pause quando não seguem a rolagem.
- **Frase em destaque** (palavras que acendem com a rolagem): recurso raro dos posts, usado só de
  vez em quando.
- **Na home, só coisas discretas:** um livro que tomba um nada para a frente ao passar o mouse, a
  gaveta com o livro tirado da estante (clicar nele o amplia; "Ver o livro" leva à página dele, D43).
- **Cabeçalho no celular** (até 860px, D46): sempre à vista. O botão de menu abre as seções numa
  folha que desce do cabeçalho por `clip-path` (0,46s), com os itens chegando em sequência (8px, 50ms
  entre eles) e um véu de 32% sobre a página; fecha mais rápido (0,34s). **Nenhum livro cai** (o tombo do livro
  inclinado saiu na D35) e **nenhum texto muda de cor**. Sem animação de entrada nas seções.
- **Troca de tema** (D42, D44): indo para o escuro, o escuro se espalha em círculo a partir do botão
  (0,55s); voltando ao claro, o escuro se fecha de fora para dentro até sumir no botão (a mesma curva,
  ao contrário). View Transition do próprio documento (tipos "tema" e "tema-fecha", `trocarTema` em
  `tema.ts`); a página inteira vira de uma vez (os livros perdem o nome de transição durante a troca).
  O botão fica por cima do círculo, e o ícone anima (D49, reabre a D44): indo para o escuro, a lua se
  enche até virar o miolo do sol (MorphSVG, 0,4s, `power2.inOut`) e os raios giram de -30° a 0° e se
  escrevem de dentro para fora (DrawSVG, 0,22s, 0,03s entre eles); voltando ao claro, os raios
  recolhem (0,15s) e a lua é "mordida" de volta. No hover, o sol gira 22° e a lua balança 14° (0,5s).
  A faixa de luz da estante em repouso saiu (D44).
- **A caneta que navega** (D49, `traco.css`, `src/lib/traco.ts`): a seção atual do menu é sublinhada
  por um traço de caneta (2,2px, azul-tinta), torto de um jeito próprio em cada item e sempre igual;
  na troca de página, ele desliza de um item para o outro (View Transition `traco-do-menu`, 0,42s);
  sem par, se escreve (0,38s) ou some pela direita (0,2s). O mouse escreve um traço leve (1,5px, 50%)
  da esquerda para a direita (0,32s) e, ao sair, ele termina de passar e some pela direita (0,22s). Os
  links do rodapé usam o mesmo traço leve. No celular, o traço da seção atual se escreve quando a
  folha do menu termina de descer. A lupa inclina 14° no hover, a tecla ⌘K afunda 1,5px por 120ms
  quando é usada e o campo dá um toque (98,5% para 100%) quando a busca nasce dele. No rodapé, os
  arcos do RSS se escrevem a partir do ponto, um depois do outro (0,18s cada).
- **Caneta da leitura** (D45, `BarraLeitura.astro`): o traço do progresso corre sobre o fio do
  cabeçalho e a caneta acompanha a ponta, ligada à rolagem (sem animação própria; só a caneta aparece
  por opacidade, 0,2s). No celular, o traço acompanha o cabeçalho que some e volta (`top`, 0,25s).
- **A busca nasce do campo** (D44, `Busca.astro`, GSAP com Flip sob demanda): com clique, ⌘K,
  Ctrl+K ou "/", a janela cresce a partir do campo do cabeçalho (no celular, do ícone) em 0,5s
  (`power3.out`), o conteúdo aparece depois de 0,2s e o véu escurece junto (`@starting-style`). Os
  resultados entram em sequência (0,3s, `stagger` 0,035s) e o termo buscado ganha um marca-texto que
  se estica em 0,45s, também no título do resultado. Esc, "Fechar" ou clique fora encolhem a janela
  de volta para o campo (0,35s, `power2.in`), e o foco volta para ele. Um marcador só (o fundo e o
  fio azul) desliza até o resultado da vez com as setas, o foco e o mouse (0,28s, `power3.out`, D49).
  Sem resultado, o termo ganha a ondinha de revisor na cor de Cuidado (0,45s) e a saída chega depois.
- **A 404** (D49): a folha da abertura da home, com o erro e a estante; a caneta rasura o endereço
  (0,35s e 0,25s, 0,3s depois de abrir) e, quando dá, a sugestão chega depois (0,3s).
- **Os minutos que faltam** (D49, sumário): rodam como contador quando mudam (0,4s); no fim, "faltam
  1 min" sobe e some e "chegou ao fim" sobe de baixo (0,3s).
- **O artigo de perto** (D49, protótipo E3, só CSS e Web Animations): nos links do texto, a tinta
  azul sobe de baixo até 42% da linha (0,3s, `--link-tinta`); o Copiar do código e o "Copiar link"
  fazem o mesmo gesto (a folha da frente do ícone desliza sobre a de trás em 0,16s, ou os elos se
  juntam; o visto da caneta em 0,3s; o rótulo rola letra por letra, 12ms entre elas, e a largura
  acompanha em 0,35s; em 1,6s, tudo volta); em anterior e próximo, a seta abre o próprio espaço
  (0,3s) e o canto de fora dobra (a orelha, 0,26s); o voltar ao topo entra subindo 14px e assenta
  (0,4s, a curva do back.out em `linear()`), sai em 0,25s e, no clique, a seta sai por cima e volta
  por baixo (0,44s).
- **Troca Lista / Cards** (D42): a forma atual esmaece (0,12s) e a nova aparece subindo 8px (0,22s),
  com a Web Animations API (`SeletorModo`). Sem Flip e sem cascata nos cards. O azul do botão ativo
  é uma tinta só que escorre de um botão para o outro (D49): a borda da frente corre (0,2s,
  `power2.in`) e a de trás alcança (0,28s, `power3.out`); o texto troca de cor no meio (0,16s).
- **A caneta que marca** (D49, com mouse ou foco; `traco.css`): no hover de um artigo da lista, um
  colchete na margem esquerda se escreve de cima para baixo (0,34s) e, ao sair, some por baixo (0,2s);
  nos números da paginação e no GitHub e no LinkedIn do cabeçalho, um círculo à mão (uma volta e 8%,
  0,42s, `power2.inOut`) que some pela ponta ao sair (0,2s). As setas de "Anteriores" e "Mais
  artigos" avançam 3px no hover e, no clique, saem pela frente e voltam por trás (0,32s).
- Toda animação respeita `prefers-reduced-motion`: tudo aparece no estado final, sem prender a
  tela.
- Vídeo (MP4/WebM) só quando o Cesar pedir: comprimido, com poster e carregado sob demanda.

## Do's and Don'ts

- Faça: azul-tinta só no que é clicável; a cor da categoria só nos livros, chips, barra de leitura e
  desenhos.
- Faça: todo conteúdo em folha; desenhos sempre no painel da categoria.
- Faça: cores por token (`var(--ink)`, `var(--cat)`, papéis `--cima`/`--baixo` nos livros).
- Faça: conferir os dois temas, a largura de 390px e `prefers-reduced-motion`.
- Não faça: gradiente decorativo, sombra em painel ou caixa, animação de entrada, emoji, caixa alta
  na interface, fonte de letra de mão (a exceção é a Caveat das notas da caneta, D48), fonte de CDN.
- Não faça: pintar o texto marcado na cor da caneta, ou marcar em rodízio de tipos (a caneta segue o
  guia `docs/marcacoes.md`).
- Não faça: mais de uma cor num desenho, fundo pintado no SVG, `<image>` dentro de ilustração.
- Não faça: livro caindo ou texto mudando de cor na home.
- Não faça: seguir uma sugestão de ferramenta (Impeccable ou outra) que contradiga este arquivo.
