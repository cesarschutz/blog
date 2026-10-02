---
name: lousa
description: Monta os diagramas na lousa com o componente Lousa (D58), nos dois usos, passos (a caneta monta uma sequência, com a lista numerada embaixo) e comparação (duas linhas no mesmo tempo), e a frase em destaque, em posts .mdx. A LousaTempo e a LousaLoop ficam só nos posts antigos. Use quando o post tiver uma sequência em que a ordem importa, ou antes e depois (com e sem) ao longo do tempo.
---

# Lousa

Componente `src/components/Lousa.astro` (D58), com o desenho **no estilo das figuras** (D59: o painel
do livro, o traço da casa, os tons, os selos e os logos de `figura.css`) e uma **canetinha colorida**
que desenha na cor do que faz. Estilo em `lousa-nova.css` (mais `figura.css` e `desenho.css`); motor em
`src/scripts/lousa.ts` e `src/lib/lousa-tempo.ts`. O estilo (cores, traço, caneta) está em
`docs/estilo-desenho.md`; os tempos, em `docs/movimento.md`. **Modelo:**
`src/lousas/jackson-filtros-mascarando-cartao/passos.svg` (passos); as comparações dos posts
`criptografia-em-repouso-e-em-transito` (`tls.svg`) e `cronjob-vs-endpoint-sqs`.

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
| `controles` | **em prova (D65):** `"marca-texto"`, `"caderno"` ou `"post-it"` troca os controles de baixo por uma das três opções do protótipo (`/prototipos/controles/`), com o desenho e os controles num cartão só. Até o Cesar escolher, cada post fica com a opção que recebeu na prova (lista na D65) e post novo fica sem `controles` |

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
- **Até 700px, como as figuras** (D59): o desenho fica com 720px e rola de lado dentro do painel, com
  a linha "Arraste o desenho para o lado…" embaixo (só aí). Nessa largura o dedo e a rolagem de lado
  são do painel; o tempo anda pelo play, pela faixa e pelos passos (o mouse ainda arrasta o tempo).
- **Nada ao lado do controle e nenhuma frase embaixo:** a lousa nunca muda de tamanho.
- **Passos:** a lista numerada embaixo acende o passo da vez (cor do livro). Um marcador desliza pela
  lista até o passo sob o mouse ou o foco, como na busca. O clique num passo leva a lousa até ele, com
  tudo o que a linha diz já desenhado; o mouse sozinho não mexe na lousa.
- **A canetinha** (D59) aparece sempre que algo está sendo desenhado (play, arrasto, rolagem,
  controle), na ponta do traço ou do texto, com movimento de mão (na escrita, sobe e desce a cada
  letra; no traço, balança; pintando, corre no meio da caixa). A ponta, o anel e a tampa ficam na cor
  do que ela faz: o traço (`stroke`), o texto (`fill`) ou o tom que está pintando (`--tom`), lida na
  hora pelo script. Uma caneta por lugar, até três ao mesmo tempo.
- Fora da tela, pausa; volta a tocar se tocava. Na impressão, o desenho inteiro.
- **Sem JS:** o desenho completo, sem controles, e a lista dos passos. **No RSS:** o rótulo e um link
  para o post.
- **Movimento reduzido:** a lousa começa no desenho completo (como sempre), sem caneta, e o marcador
  dos passos vai direto. O play continua disponível.
- **Acessibilidade:** controle e passos pelo teclado, com foco visível; o conteúdo do diagrama também
  existe em texto (a lista dos passos, ou o estado no controle).

## O desenho (`src/lousas/<slug>/<nome>.svg`), no estilo das figuras (D59)

A lousa é uma figura que se desenha: **as mesmas classes, tons, selos e logos das figuras** (skill
`figura`, `figura.css`), com os atributos de tempo. Leia a seção das figuras em
`docs/estilo-desenho.md` antes de desenhar. O componente recusa (erro no build) lousa sem o grupo
`<g class="tinta">`.

- Raiz só com `xmlns` e `viewBox="0 0 1100 H"`: **largura 1100** (a canetinha é dimensionada para
  ela; `H` de 600 a 820). **Sem `aria-label`** (o rótulo vem do `rotulo=`), sem `id`, `<defs>`,
  `<style>`, `style=` nem cor fixa.
- **Traços dentro de `<g class="tinta">`** (o grupo que treme); **todo `<text>` fora dele**.
- **Tons com o mesmo significado das figuras do post** (o mesmo ator, a mesma cor em todas as figuras,
  animações e lousas do post); vermelho só para erro, limite, recusa, ilegível. O que não é ator fica
  sem tom (tinta).
- **Caixa de um ator:** num `<g class="tom-x">`, a sombra (`hachura` deslocada +8 +8, ou `cor` com
  `transform="translate(7 6)"`), depois `lavado`, depois `linha` (o mesmo retângulo).
- **Texto nas classes das figuras e nunca menor:** `titulo-caixa` (27), `texto-caixa` (21), `codigo`
  (25), `nota-pequena` (20), `valor-eixo` (19); no tom com `texto-tom`, dentro do grupo do tom. No
  celular a lousa tem 720px e rola de lado: com essas fontes, nada fica abaixo de 10px na tela.
- **Passos:** um selo numerado por passo (`<circle class="selo" r="17">` + `<text
  class="selo-texto">N</text>`, no tom do passo, fora do `.tinta`), que aparece no início do passo,
  perto do que ele desenha. Liga o desenho à lista embaixo.
- **Comparação:** um rótulo por linha à esquerda (o que é cada linha); o que acontece no mesmo
  instante fica na mesma posição horizontal nas duas linhas.
- **Logos** onde ajudam (`<g data-marca="postgresql" transform="translate(x y) scale(s)"/>`), como nas
  figuras.

Quando cada parte aparece fica no próprio elemento, com os tempos na escala do desenho (de 0 a N; o
componente estica a escala até o fim; o `de` de cada passo vezes o fim é a fronteira dele):

| Atributo | Efeito |
|---|---|
| `data-traco="a b"` | traça o contorno de a até b, com a canetinha na ponta (não em tracejado) |
| `data-escrita="a b"` | escreve o texto da esquerda para a direita, com a canetinha seguindo |
| `data-revela="a b"` | descobre da esquerda para a direita: **pinta** o `lavado` de uma caixa ou uma barra (a canetinha corre no meio, no tom), e mostra tracejados; `data-de="direita"` inverte |
| `data-aparece="a b"` / `data-some="a b"` | opacidade de 0 a 1 / de 1 a 0 |
| `data-esmaece="a b v"` | de 1 até v (para o que sai de cena) |
| `data-desloca="a b dx dy"` | anda (dx, dy); use num `<g>` sem transform próprio |

Sem atributo, a parte já está no quadro desde o início ("o professor montou o quadro antes da aula").

### Como desenhar para a canetinha

- **O quadro final precisa estar completo e legível:** é o que aparece antes do play, sem JS e na
  impressão.
- **Desenhe, não só faça aparecer.** Caixa: `data-traco` no contorno (`linha`), depois `data-revela`
  no `lavado` (a canetinha pinta no tom) e, por fim, a sombra com `data-aparece` curto. Pontas de seta:
  `data-aparece` curto (0,02) no fim do traço.
- **Texto com `data-escrita`**, para a canetinha escrever. Um texto por vez.
- **Cada parte dentro do seu passo:** nenhuma parte começa num passo e termina no seguinte (o clique
  no passo mostraria a parte pela metade), e todo passo desenha alguma coisa. O `revisar.mjs` acusa.
- **Um lugar por vez.** A caneta nunca escreve em dois lugares: partes que se sobrepõem no tempo
  ganham canetas diferentes (até três). Prefira encadear os tempos (um termina, o outro começa). Na
  comparação, as duas linhas andam juntas, uma caneta por linha, como um cursor do tempo.
- **Pouco texto trocando.** O que foi escrito não some: se mudou, trace um risco por cima
  (`data-traco`) e escreva o novo embaixo. `data-some` só para o que sai de cena de verdade.
- **Mais desenho que texto**, num ritmo que dá para ler: cada passo com tempo para ser visto antes do
  seguinte. Pouca coisa se mexendo também vale (só o ponto principal).

## O que não fazer

- Lousa comandada pela rolagem da página (saiu na D46 e não volta).
- `LousaLoop` ou `LousaTempo` em post novo (a D58 tirou dos posts novos); desenho novo no estilo
  antigo do quadro (`<g class="traco">`, `destaque`, `secundario`, `fino`): a D59 trocou pelo das
  figuras.
- Frase ou texto de estado ao lado do controle ou embaixo da lousa (ela mudaria de tamanho); a única
  linha embaixo é a de rolar, só até 700px.
- Fonte menor que a das classes das figuras para caber mais coisa (no celular vira ilegível).
- Uma caneta escrevendo em dois lugares; mais de três partes sendo feitas ao mesmo tempo; parte
  atravessando a fronteira de um passo.
- Apagar o que já foi escrito para escrever outra coisa no lugar.
- `data-traco` em linha tracejada ou fantasma (o traçado usa o tracejado; use `data-revela`).
- `aria-label`, `id`, `<defs>`, cor fixa ou `style=` no arquivo.
- Lousa solta, sem o texto dizendo o que ela mostra; lousa e figura (ou frase em destaque) dizendo a
  mesma coisa.

## Validar, revisar e conferir (obrigatório antes de mostrar ao Cesar)

```sh
fnm exec --using=24 node scripts/desenho/validar.mjs <slug>                      # classes e atributos de tempo
fnm exec --using=24 node scripts/desenho/revisar.mjs <slug> --base http://127.0.0.1:4322   # bugs e fotos
```

O `revisar.mjs` (D59) acusa texto encostado, cortado ou pequeno (no fim e no fim de cada passo, em 1280
e 390px), parte que atravessa a fronteira de um passo, passo vazio, duas canetas no mesmo lugar no
play e erro no console, e tira as fotos em `.astro/revisar/<slug>/`: a lousa no fim de cada passo,
três instantes do play, o escuro e 390px. **Olhe todas as fotos** e confira o que o script não vê
(checklist da skill `figura`, "Revisão"): a canetinha na cor do que desenha; o passo mostrando só o
que a linha da lista diz; o desenho contando o que o texto conta; os tons iguais aos das figuras do
post. Corrija e rode de novo até sair limpo; só então mostre. Um instante avulso:
`node scripts/foto.mjs <url> <saida.png> --seletor ".lousa-nova" --altura 1500 --arrastar 0.4`.

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
- Os desenhos deles ficam no estilo antigo do quadro (`<g class="traco">`, `fino`, `guia`,
  `destaque`, `fantasma`, `tracejado`, `hachura`, `cheio`, `secundario`, `codigo`, em `lousa.css`),
  com os mesmos atributos de tempo. Ao revisar o post, a lousa é redesenhada no estilo das figuras.
