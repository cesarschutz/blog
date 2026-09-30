---
name: lousa
description: Monta os diagramas na lousa com o componente Lousa (D58), nos dois usos, passos (a caneta monta uma sequência, com a lista numerada embaixo) e comparação (duas linhas no mesmo tempo), e a frase em destaque, em posts .mdx. A LousaTempo e a LousaLoop ficam só nos posts antigos. Use quando o post tiver uma sequência em que a ordem importa, ou antes e depois (com e sem) ao longo do tempo.
---

# Lousa

Componente `src/components/Lousa.astro` (D58), com o estilo em `lousa.css` e `lousa-nova.css` e o
motor em `src/scripts/lousa.ts` e `src/lib/lousa-tempo.ts`. O estilo (cores, traço, caneta) está em
`docs/estilo-desenho.md`; os tempos, em `docs/movimento.md`. Exemplos nos posts
`criptografia-em-repouso-e-em-transito.mdx`, `jackson-filtros-mascarando-cartao.mdx` e
`cronjob-vs-endpoint-sqs.mdx`, com os desenhos em `src/lousas/<slug>/`.

## Quando usar

- **Passos:** uma sequência em que a ordem importa (o pedido passa pelo hash e cai numa partição; o
  rebalance do grupo).
- **Comparação:** a mesma coisa em duas linhas no mesmo tempo (sem × com, antes × depois).
- Para o sistema funcionando, uma fila enchendo ou um gráfico se formando no tempo, a lousa não é o
  recurso: use a animação com play (skill `figura`). Para um desenho que não muda, a figura.
- Post simples fica sem lousa. **Todo desenho é apresentado no texto**: antes da lousa, o texto diz
  o que ela mostra e o que olhar nela (e, nos passos, que o play monta tudo e o clique num passo leva
  a lousa até ele). Nem todo post tem lousa.
- A frase em destaque é rara: no máximo uma por post.

## Uso no post

Post com lousa é `.mdx`. Importe logo depois do frontmatter:

```mdx
import Lousa from "../../components/Lousa.astro";
import FraseDestaque from "../../components/FraseDestaque.astro";
```

```mdx
<Lousa
  desenho="<slug>/passos"
  rotulo="Lousa: o item com a chave loja#42 passa pela função de hash e cai na P3…"
  passos={[
    { de: 0, texto: "O item chega com a chave de partição `loja#42`." },
    { de: 0.2, texto: "O DynamoDB passa a chave por uma função de hash." },
  ]}
/>

<Lousa
  desenho="<slug>/comparacao"
  rotulo="Lousa comparando o mesmo tráfego: sem sufixo… com sufixo…"
  duracao={10}
  estados={[
    { de: 0, texto: "O tráfego começa: a mesma sequência nas duas linhas" },
    { de: 0.53, texto: "Sem sufixo, a P3 passa do limite" },
  ]}
/>

<FraseDestaque texto="Uma frase curta, que merece ser lida duas vezes." />
```

| Prop | O que é |
|---|---|
| `desenho` | `"<slug>/<nome>"`, o arquivo `src/lousas/<slug>/<nome>.svg` |
| `rotulo` | o que a lousa mostra, em uma ou duas frases: o texto do leitor de tela e do RSS |
| `passos` | a sequência (`{ de, texto }`, `de` de 0 a 1, em ordem): vira a lista numerada embaixo; o texto aceita `código` e `**negrito**` |
| `estados` | a comparação (`{ de, texto }`): só vão para o leitor de tela (o `aria-valuetext` do controle) |
| `duracao` | uma volta do play, em segundos (padrão 7) |

Use `passos` **ou** `estados`, nunca os dois. `de` é o instante em que o passo (ou o estado) começa;
o fim de um passo é o `de` do seguinte. No controle, cada `de` vira uma marca (numerada, nos passos).
A cor de destaque vem sozinha do livro do post. **Títulos de seção migrados não mudam** ao virar MDX
(as âncoras dependem deles, D7).

## Comportamento

- **Aparece completa e parada**, sem nenhum passo aceso. O play começa do início (ou continua de onde
  a pessoa pausou), chega ao fim, **para 5 s** e recomeça, até ser pausado.
- O tempo anda com o play, o **arrasto sobre o desenho**, a **rolagem horizontal** sobre ela (o
  trackpad de lado, ou Shift com a roda) e o controle deslizante (as setas vão de um passo ou estado ao
  vizinho). Qualquer gesto pausa. **A rolagem da página nunca mexe na lousa** (D46). No toque, o
  arrasto só começa com um movimento de lado; o dedo que sobe ou desce rola a página.
- **Nada ao lado do controle e nenhuma frase embaixo:** a lousa nunca muda de tamanho.
- **Passos:** a lista numerada embaixo acende o passo da vez (cor do livro). Um marcador desliza pela
  lista até o passo sob o mouse ou o foco, como na busca. O clique num passo leva a lousa até ele, com
  tudo o que a linha diz já desenhado; o mouse sozinho não mexe na lousa.
- **A caneta** aparece sempre que algo está sendo desenhado (play, arrasto, rolagem, controle), na
  ponta do traço ou do texto, na cor do que desenha, com movimento de mão (na escrita, sobe e desce a
  cada letra; no traço, balança). Uma caneta por lugar, até três ao mesmo tempo.
- Fora da tela, pausa; volta a tocar se tocava. Na impressão, o desenho inteiro.
- **Sem JS:** o desenho completo, sem controles, e a lista dos passos. **No RSS:** o rótulo e um link
  para o post.
- **Movimento reduzido:** a lousa começa no desenho completo (como sempre), sem caneta, e o marcador
  dos passos vai direto. O play continua disponível.
- **Acessibilidade:** controle e passos pelo teclado, com foco visível; o conteúdo do diagrama também
  existe em texto (a lista dos passos, ou o estado no controle).

## O desenho (`src/lousas/<slug>/<nome>.svg`)

Raiz só com `xmlns` e `viewBox`, **sem `aria-label`** (o rótulo vem do `rotulo=`), sem `id` nem
`<defs>` (os recortes da escrita ganham id na hora, por instância). Traços dentro de
`<g class="traco">` (o único grupo que treme); textos fora dele.

| Classe | Uso |
|---|---|
| `traco` | grupo dos traços (caneta, 2,7) |
| `fino` | divisórias de tabela, detalhes, contornos de blocos pequenos (1,5) |
| `guia` | base de uma linha do tempo (fina e apagada) |
| `destaque` | traço ou texto na cor de destaque (a caneta assume essa cor) |
| `fantasma`, `tracejado` | o que não chega ao destino; o reenvio; o limite |
| `hachura` | sombra: cópia da caixa deslocada, antes dela |
| `cheio` | forma preenchida com a tinta (ou o destaque, com `destaque`) |
| `secundario`, `codigo` | texto menor e atenuado; código em mono |

Quando cada parte aparece fica no próprio elemento, com os tempos de 0 a 1 (podem ir de 0 a N: o
componente estica a escala até o fim; com 0 a 1, os tempos batem com os `de` dos passos):

| Atributo | Efeito |
|---|---|
| `data-traco="a b"` | traça de a até b, com a caneta na ponta (não em tracejado) |
| `data-escrita="a b"` | escreve o texto da esquerda para a direita, com a caneta seguindo |
| `data-revela="a b"` | descobre da esquerda para a direita (tracejados, grupos); `data-de="direita"` inverte |
| `data-aparece="a b"` / `data-some="a b"` | opacidade de 0 a 1 / de 1 a 0 |
| `data-esmaece="a b v"` | de 1 até v (para o que sai de cena) |
| `data-desloca="a b dx dy"` | anda (dx, dy); use num `<g>` sem transform próprio |

Sem atributo, a parte já está no quadro desde o início ("o professor montou o quadro antes da aula").

### Como desenhar para a caneta

- **O quadro final precisa estar completo e legível:** é o que aparece antes do play, sem JS e na
  impressão.
- **Desenhe, não só faça aparecer.** Onde a lousa desenha (caixas, blocos, barras), ponha
  `data-traco` no contorno e deixe o preenchimento aparecer logo depois, curto:
  `<rect … class="fino" data-traco="0.04 0.09"/>` e, por cima, `<rect … class="cheio"
  data-aparece="0.09 0.1"/>`. Pontas de seta: `data-aparece` curto (0,02) no fim do traço.
- **Texto com `data-escrita`**, para a caneta escrever. Um texto por vez.
- **Um lugar por vez.** A caneta nunca escreve em dois lugares: partes que se sobrepõem no tempo
  ganham canetas diferentes (até três). Prefira encadear os tempos (um termina, o outro começa). Na
  comparação, as duas linhas andam juntas, uma caneta por linha, como um cursor do tempo.
- **Pouco texto trocando.** O que foi escrito não some: se mudou, trace um risco por cima
  (`data-traco`) e escreva o novo embaixo. `data-some` só para o que sai de cena de verdade.
- **Mais desenho que texto**, num ritmo que dá para ler: cada passo com tempo para ser visto antes do
  seguinte. Pouca coisa se mexendo também vale (só o ponto principal).
- Na comparação, os **rótulos do desenho** dizem o que é cada linha ("sem sufixo", "com sufixo");
  os estados não aparecem na tela.
- Usa a mesma geometria e as mesmas convenções da capa (hachura, linha fantasma), com o estilo da
  lousa.

## O que não fazer

- Lousa comandada pela rolagem da página (saiu na D46 e não volta).
- `LousaLoop` ou `LousaTempo` em post novo (a D58 tirou dos posts novos).
- Frase ou texto de estado ao lado do controle ou embaixo da lousa (ela mudaria de tamanho).
- Uma caneta escrevendo em dois lugares; mais de três partes sendo feitas ao mesmo tempo.
- Apagar o que já foi escrito para escrever outra coisa no lugar.
- `data-traco` em linha tracejada ou fantasma (o traçado usa o tracejado; use `data-revela`).
- `aria-label`, `id`, `<defs>`, cor fixa ou `style=` no arquivo.
- Lousa solta, sem o texto dizendo o que ela mostra; lousa e figura (ou frase em destaque) dizendo a
  mesma coisa.

## Validar e conferir

```sh
fnm exec --using=24 node scripts/desenho/validar.mjs <slug>   # classes e atributos de tempo
```

Depois de ajustar os tempos, abra `/amostra/lousas/?lousa=<slug>/<nome>` (só no dev): cada marca vira
um quadro parado com o instante. Confira ali, nos dois temas (`&tema=escuro`) e com 390px, que nada
entra por cima do que já está escrito e que os textos não saem da caixa; use `&quadros=todos` quando a
folha amostrar. Uma parte a meio caminho aparece inteira no quadro (o quadro parado só esconde o que
ainda não começou). Por fim, no post, pelo navegador: o play inteiro (a caneta nunca em dois lugares,
os 5 s no fim), o arrasto, o clique e o mouse nos passos, os dois temas, 390px e movimento reduzido.
Para uma foto de um instante: `node scripts/foto.mjs <url> <saida.png> --seletor
".lousa-nova" --arrastar 0.4` (com `--tema escuro`, `--largura 390`).

## Legado: `LousaTempo` e `LousaLoop` (só nos posts antigos)

Os posts publicados antes da D58 usam estes dois até serem revistos pela skill `post` (modo Adaptar),
quando a `LousaTempo` vira `Lousa` (passos ou comparação) e a `LousaLoop` vira lousa de passos ou
animação com play. Não use em post novo.

```mdx
<LousaTempo desenho="<slug>/tempo" rotulo="…" estados={[{ de: 0, texto: "Antes do pedido" }, { de: 0.5, texto: "…" }]} />

<LousaLoop desenho="<slug>/loop" rotulo="…" duracao={5.2} legenda="…"
  marcas={[{ em: 0.47, rotulo: "a resposta se perde" }]} parado={0.9} />
```

- `LousaTempo`: controle deslizante com play (~7 s, para 1,5 s no resultado e recomeça), arrastar e a
  roda do mouse; o texto do estado atual fica na mesma célula da grade para todos os estados (a altura
  não muda) e num `aria-live`.
- `LousaLoop`: anda sozinha quando aparece na tela, com barra de tempo, Recomeçar e Pausar, e uma pausa
  no fim; `parado` é o instante do quadro parado (sem JS e com movimento reduzido).
- Os desenhos usam as mesmas classes e os mesmos atributos de tempo da `Lousa`.
