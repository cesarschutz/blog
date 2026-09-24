---
name: lousa
description: Monta os diagramas de explicação na lousa (passo a passo com a rolagem, linha do tempo de arrastar, animação curta em loop) e a frase em destaque, em posts .mdx. Use quando o post tiver fluxo, sequência, antes e depois ou linha do tempo para explicar.
---

# Lousa

Pronta na Fase 5. Referência completa: `src/content/posts/cobranca-duplicada-no-retry.mdx`, com os
desenhos em `src/lousas/cobranca-duplicada-no-retry/`. O estilo (cores, traço, caneta) está em
`docs/estilo-desenho.md`; o motor, em `src/scripts/lousa.ts` e `src/lib/lousa-tempo.ts`.

## Quando usar

Sempre que houver fluxo, sequência, antes e depois ou linha do tempo. Post simples fica sem lousa.
A frase em destaque é rara: use só de vez em quando.

## Os três componentes (briefing §7)

1. **Passo a passo com a rolagem.**
   - O texto rola à esquerda, em parágrafos. A lousa fica fixa à direita e avança um passo por
     parágrafo, com o parágrafo atual em destaque.
   - No celular, a lousa fica fixa no topo (até ~40% da altura) e os parágrafos passam por baixo, em
     cartões. Se o desenho não couber legível, vira quadros parados, um por passo, junto de cada parágrafo.
2. **Linha do tempo de arrastar.**
   - Controle deslizante com botão play/pausa à esquerda. A reprodução percorre tudo em ~7 s, para
     1,5 s no resultado e recomeça.
   - Responde a arrastar sobre o desenho e à roda do mouse, com ou sem Shift. Nas pontas, a roda
     volta a rolar a página.
   - Qualquer gesto manual pausa a reprodução.
   - O texto do estado atual fica num `aria-live`.
3. **Animação curta em loop.**
   - Dura poucos segundos, com uma barra de tempo por baixo marcando início, eventos e fim.
   - Botões Recomeçar e Pausar.
   - Pausa perceptível no fim, antes de reiniciar.

Há ainda a **frase em destaque**: uma citação cujas palavras acendem com a rolagem.

## Comportamento comum

- **A caneta desenha.** Fica na ponta do traço, escreve os textos da esquerda para a direita e
  assume a cor do que desenha. Se a rolagem para, a caneta para. Se a pessoa rola para cima, o desenho se apaga.
- O cenário inicial (rótulos e caixas) pode já estar desenhado.
- **`prefers-reduced-motion`:** estado final, sem caneta, com todos os passos visíveis. Nada prende a tela.
- **Sem JavaScript:** a lousa mostra o desenho completo, parado, como no estado final.
- **Vários desenhos na página:** os ids de que o componente precisar (por exemplo, `clipPath` da
  escrita) são gerados por instância e nunca ficam no arquivo do desenho.
- **Acessibilidade:** controles por teclado, com foco visível. O conteúdo do diagrama também existe
  em texto: os parágrafos do passo a passo e o `aria-live` da linha do tempo.
- Usa a mesma geometria e as mesmas convenções da ilustração (hachura, linha fantasma), mas com o estilo da lousa.

## Uso no post

Post com lousa é `.mdx`. Importe os componentes logo depois do frontmatter:

```mdx
import LousaPassos from "../../components/LousaPassos.astro";
import Passo from "../../components/Passo.astro";
import LousaTempo from "../../components/LousaTempo.astro";
import LousaLoop from "../../components/LousaLoop.astro";
import FraseDestaque from "../../components/FraseDestaque.astro";
```

```mdx
<LousaPassos desenho="<slug>/passos" rotulo="Diagrama: o que o desenho mostra.">
  <Passo>Primeiro parágrafo, com `código` e **negrito** se precisar.</Passo>
  <Passo>Segundo parágrafo.</Passo>
</LousaPassos>

<LousaTempo desenho="<slug>/tempo" rotulo="…" estados={[{ de: 0, texto: "Antes do pedido" }, { de: 0.5, texto: "…" }]} />

<LousaLoop desenho="<slug>/loop" rotulo="…" duracao={5.2} legenda="…"
  marcas={[{ em: 0.47, rotulo: "a resposta se perde" }]} parado={0.9} />

<FraseDestaque texto="Uma frase curta, que merece ser lida duas vezes." />
```

- Cada `<Passo>` em **uma linha só** (senão o MDX abre um parágrafo dentro do outro).
- `rotulo` diz o que o desenho mostra; é o texto dos leitores de tela e do RSS.
- `parado` (loop) é o instante do quadro parado, sem JS ou com movimento reduzido; nos outros, o fim.
- A cor de destaque vem sozinha da categoria do post.
- No RSS, as lousas viram o rótulo com um link para o post, e os passos entram como parágrafos.
- **Títulos de seção migrados não mudam** ao virar MDX (as âncoras dependem deles, D7).

## O desenho (`src/lousas/<slug>/<nome>.svg`)

Raiz só com `xmlns` e `viewBox` (560×430 é a referência). Traços dentro de `<g class="traco">`
(o único grupo que treme); textos fora dele.

| Classe | Uso |
|---|---|
| `traco` | grupo dos traços (caneta, 2,7) |
| `fino` | divisórias de tabela, detalhes (1,5) |
| `guia` | base de uma linha do tempo (fina e apagada) |
| `destaque` | traço ou texto na cor de destaque (a caneta assume essa cor) |
| `fantasma`, `tracejado` | o que não chega ao destino; o reenvio |
| `hachura` | sombra: cópia da caixa deslocada, antes dela |
| `cheio` | forma preenchida com a tinta (ou o destaque, com `destaque`) |
| `secundario`, `codigo` | texto menor e atenuado; código em mono |

Quando cada parte aparece fica no próprio elemento, com `t` em passos no passo a passo (0 a N, um
por parágrafo) e de 0 a 1 na linha do tempo e no loop:

| Atributo | Efeito |
|---|---|
| `data-traco="a b"` | traça de a até b, com a caneta na ponta (não em tracejado) |
| `data-escrita="a b"` | escreve o texto da esquerda para a direita |
| `data-revela="a b"` | descobre da esquerda para a direita (tracejados, grupos); `data-de="direita"` inverte |
| `data-aparece="a b"` / `data-some="a b"` | opacidade de 0 a 1 / de 1 a 0 |
| `data-esmaece="a b v"` | de 1 até v (para o que sai de cena, como o adquirente que não é chamado) |
| `data-desloca="a b dx dy"` | anda (dx, dy); use num `<g>` sem transform próprio |

Sem atributo, a parte já está no quadro desde o início. Pontas de seta usam `data-aparece` curto
no fim do traço (0,02).

## Validar e conferir

```sh
fnm exec --using=24 node scripts/desenho/validar.mjs <slug>   # classes e atributos de tempo
```

Depois, olhe a lousa no navegador nos dois temas e com 390px, e um quadro de cada passo: o que
entra não pode cobrir o que já está escrito, e os textos não podem sair da caixa.
