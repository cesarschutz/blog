# Protótipos da Fase 0 superados

- `prototipo-mais-vida.html`: o ajuste visual sobre o site pronto, com a variação **"A. Folhas claras"**
  escolhida em 24/09/2026 (D26). Valeu até a D61, quando o "papel e luz" do redesenho virou o site.
- `prototipo-lousas.html`: as lousas dos diagramas, com a aba **"Invertida, canetinha"** escolhida na
  Fase 0: o quadro escuro, o contrário da página. A lousa passou ao estilo das figuras na D59, e o quadro
  escuro ficou só na `LousaTempo` e na `LousaLoop`, que saíram do site na D84 (nenhum post as usava desde
  04/10/2026).

O de estilo dos desenhos ("A + C") continua valendo, em `docs/referencias/`.

Abaixo, o texto do quadro escuro como estava no `docs/estilo-desenho.md` até a faxina da D84, com os
valores do desenho. As cores e o `LOUSA` continuam em `src/styles/tokens.ts` (para o `npm run
contraste`); o reflexo, o tremor mais leve (`#tremor-lousa`) e a hachura (`#hachura-lousa`) saíram do
código.

## O quadro antigo, como estava no `docs/estilo-desenho.md`

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
