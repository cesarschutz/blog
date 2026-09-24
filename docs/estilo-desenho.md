# Estilo das ilustrações e das lousas

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
  cor da categoria misturada com 42% de branco.
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

## Lousas dos diagramas: "Invertida, canetinha"

A lousa é sempre o **contrário da página**:

| | Página clara: lousa de vidro escura | Página escura: quadro branco suavizado |
|---|---|---|
| Fundo | `#15191C`, com reflexo diagonal sutil | `#CFD5D1` (nunca branco puro, para não ofuscar) |
| Borda | 1px `#2C3438` | 3px `#8F989D` (alumínio) |
| Caneta | clara, `#F4F6F5` | escura, `#16212B` |
| Destaque | `color-mix(in oklab, cor, #9ff5dc 55%)` | `color-mix(in oklab, cor, #0b6f58 35%)` |

- Traço de **canetinha** nas duas (sem giz), com leve tremor. Os rótulos usam a mesma Literata
  itálica do blog, sem letra de mão.
- **A caneta aparece desenhando.** Enquanto uma seta é traçada, a caneta fica na ponta do traço e
  acompanha o desenho. Os textos são escritos da esquerda para a direita, com a caneta seguindo. A
  caneta assume a cor do que está desenhando (a cor de destaque, nos destaques).
- Se a rolagem para, a caneta para. Se a pessoa rola para cima, o desenho se apaga.
- Os rótulos e as caixas iniciais do cenário podem já estar desenhados ("o professor montou o quadro
  antes da aula").
- **Frase em destaque** (recurso raro): uma citação cujas palavras acendem com a rolagem.
- Com `prefers-reduced-motion`: desenho completo, sem caneta e com todos os passos visíveis.

### Valores de partida (protótipo "Invertida, canetinha")

| Elemento | Valor |
|---|---|
| Reflexo no vidro | `linear-gradient(118deg, rgba(255,255,255,.07) 0%, rgba(255,255,255,.015) 26%, transparent 27%)`: corte seco, como vidro |
| Reflexo no quadro | `linear-gradient(118deg, rgba(255,255,255,.28) 0%, transparent 30%)`: suave |
| Tremor | Mais leve que o da ilustração: `baseFrequency` 0.02, `numOctaves` 2, `scale` 2, só nos traços |
| Espessura | 2,7 em caixas e setas e 1,5 nas divisórias de tabela (viewBox de referência 560×430) |
| Hachura | A mesma de 7×7 a 45°, com a tinta a 22% (vidro) ou 30% (quadro) e traço 1,2 |
| Rótulos | Literata itálica 17. Secundários em 13,5, com a tinta atenuada. Código em mono 12, sem itálico |
| Caneta | Marcador simples girado −52° (mão direita), com sombra leve como no protótipo. Some quando nada está sendo traçado |

Contraste dos destaques (conferido por `npm run contraste`, 24/09/2026):
- Na lousa de vidro, todos passam sem ajuste (traço e texto de 6,2 a 10,3:1).
- No quadro branco, o destaque puro de Observabilidade daria 2,34:1. Por isso o destaque leva um
  pouco da caneta: 20% no traço (todos passam de 3:1; o pior é 3,22:1) e 45% no texto (todos passam
  de 4,5:1; o pior é 4,82:1). Os valores ficam em `LOUSA` (`src/styles/tokens.ts`).
