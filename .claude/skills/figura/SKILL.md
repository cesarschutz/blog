---
name: figura
description: Desenha as figuras do corpo do post (D58) - diagramas e gráficos coloridos (componente Figura), com detalhes que se mexem; a figura em passos (FiguraPassos, D67), o formato de toda sequência, comparação no tempo ou sistema funcionando, que o leitor monta passo a passo; os logos das ferramentas (src/marcas, Ferramenta no texto, data-marca nas figuras); o print como evidência (Evidencia) e a tela de aplicativo como print, claro e escuro pelo tema do site (Tela, D86); e a animação com play (Animacao), em prova nas páginas de teste. Use ao criar, corrigir ou conferir qualquer desenho do corpo de um post que não seja a capa (skill desenho) nem uma lousa (skill lousa).
---

# Figura (diagramas, gráficos, figura em passos, logos, print, tela de aplicativo e animação com play)

**Antes de desenhar, leia `docs/estilo-desenho.md`** (a seção das figuras) e o `DESIGN.md`. Os
tempos estão em `docs/movimento.md`. Classes em `src/styles/figura.css` (mais as da capa, de
`desenho.css`); leitura dos arquivos em `src/lib/figuras.ts`. Exemplos nos posts
`jackson-filtros-mascarando-cartao.mdx` (figura, figura em passos, print e ícones),
`cronjob-vs-endpoint-sqs.mdx` (figuras com legenda e figura em passos), `dns-tipos-de-registro.mdx`
(o modelo mais novo de figura em passos), `criptografia-em-repouso-e-em-transito.mdx` e
`claude-code-csr-lens.mdx` (as telas de aplicativo, D86).

## Regras de todo desenho do corpo

- **Todo desenho conversa com o texto.** O texto apresenta o desenho e diz o que olhar nele (o que é
  cada cor, a ordem dos números, o que o ponto que corre mostra). Nada de imagem solta.
- **Nem todo post tem todos os tipos.** Entra o que o assunto pede e o que fica bom: um post pode ter
  só a capa e um gráfico; outro, duas figuras paradas e uma figura em passos.
- **Quem manda no movimento:** a figura fica parada, ou com detalhes que se mexem sozinhos **sem mudar
  a imagem**; na figura em passos, o leitor monta a figura passo a passo e nada anda sozinho. Nas
  páginas em prova (D67), a animação com play **muda a imagem** (o leitor só dá play e pausa) e a lousa
  (skill `lousa`) é comandada pelo leitor.
- **Ícones das ferramentas** sempre que couberem, no texto e dentro dos desenhos, espalhados pelo post
  e não só no começo, sem poluir.
- **Print** só quando prova algo do texto e dá para garantir que está certo.
- **Tela de aplicativo é print, nunca desenho (D86):** a tela de um app (um painel, uma aba, uma linha
  de status) entra como print do próprio projeto, numa versão clara e numa escura, pelo componente
  `Tela`, e a que aparece segue o tema do site. O desenho da casa fica para os diagramas (quem fala com
  quem, a sequência, a comparação).

## Componentes no post

Post com qualquer um deles é `.mdx`. Imports logo depois do frontmatter:

```mdx
import Figura from "../../components/Figura.astro";
import FiguraPassos from "../../components/FiguraPassos.astro";
import Ferramenta from "../../components/Ferramenta.astro";
import Evidencia from "../../components/Evidencia.astro";
import documentacao from "../../evidencias/<slug>/documentacao.png";
import Tela from "../../components/Tela.astro";
import visaoClaro from "../../evidencias/<slug>/visao-geral-claro.svg";
import visaoEscuro from "../../evidencias/<slug>/visao-geral-escuro.svg";
```

```mdx
<Figura figura="<slug>/caminho" legenda="Cada cor é um papel: o app (azul), a escrita com sufixo (verde)…" />

<FiguraPassos figura="<slug>/chuva-em-passos" estilo="marca-texto" fim="segmentos" passos={["…", "…"]} legenda="…" />

Numa Black Friday, a tabela do <Ferramenta nome="dynamodb" href="https://aws.amazon.com/dynamodb/">Amazon DynamoDB</Ferramenta>…

<Evidencia imagem={documentacao} alt="…" fonte="https://docs.aws.amazon.com/…" legenda="Documentação do DynamoDB, boas práticas para a chave de partição" />

<Tela claro={visaoClaro} escuro={visaoEscuro} alt="…" fonte="https://github.com/…/README#1-visão-geral" legenda="A Visão geral, no quarto turno da sessão de exemplo" />
```

`legenda` é uma linha embaixo, dizendo como ler a figura (numa figura colorida, o que é cada cor).

## Figura: diagramas e gráficos (`Figura`)

Arquivo `src/figuras/<slug>/<nome>.svg`. Qualquer desenho que não muda: diagrama, gráfico, esquema.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700"
  aria-label="Diagrama do caminho com sufixo, em cinco passos numerados: o app grava o pedido; …">
```

- `viewBox` com **1200 de largura** (a altura que precisar). `aria-label` com uma ou duas frases que
  contam o que a figura mostra: é o texto para quem não vê. Nada de `id`, `<defs>`, `style`, cor fixa,
  `marker` nem `<image>`; só `data-marca` e `data-parte` como atributos `data-`.
- Traços dentro de `<g class="tinta">` (o grupo que treme); **texto sempre fora dele**. O que se move
  também fica fora (o tremor refaria o filtro a cada quadro).
- **Tons:** cada ator, lado ou papel ganha um tom, o mesmo em todas as figuras do post. Vermelho é para
  erro, limite, recusa e o que dá errado; nunca para um ator comum.
- **Setas desenhadas à mão** (a ponta é um `path`). Nada cruza texto: setas desviam das caixas e dos
  rótulos.
- **Selos** numerados quando a figura conta uma ordem; o texto diz "na ordem dos números".
- **Legenda de cores dentro da figura** só com 4 tons ou mais, cada item num `<g class="legenda
  tom-x">`; com o mouse numa cor (na legenda ou no componente), as outras apagam e aquele ator fica em
  destaque. Com menos tons, a `legenda=` embaixo basta. Numa figura com legenda (D59):
  - **com o mouse numa cor, só ela fica acesa**: as outras cores **e o que não tem cor** apagam;
  - **tudo o que é de um ator vai no grupo do tom dele**: a caixa, o título, o complemento embaixo do
    título, o ícone e o logo (senão, metade acende e metade apaga);
  - **a referência de todas as cores** (o cabeçalho de uma tabela, com os ícones e os logos dele) vai
    inteira num `<g class="referencia">` e fica acesa; os eixos dos gráficos (`eixo`, `grade`,
    `valor-eixo`, `titulo-eixo`) também;
  - **logo solto** (fora do grupo do ator) leva o tom do ator no marcador: `<g data-marca="sqs"
    class="tom-roxo" …/>`;
  - **detalhe que se mexe nunca anima `opacity`** (o destaque é `opacity`, e a animação venceria):
    `pisca` e `pacote` usam `fill-opacity` e `stroke-opacity`.
- **Letra mínima:** `nota-pequena` (20) e `valor-eixo` (19). Até 700px, a figura fica com 720px e rola
  de lado dentro do quadro, com o aviso "Arraste para o lado".
- Não use `anotacao` em figura (ela só aparece no recorte largo da capa).
- **Gráfico:** números plausíveis e coerentes com o texto (ou de fonte), eixos com unidade, a linha do
  limite quando existir e uma anotação com chamada apontando o que importa.

| Classe | Uso |
|---|---|
| `tom-azul`, `tom-verde`, `tom-ambar`, `tom-vermelho`, `tom-roxo`, `tom-petroleo` | o tom, num `<g>` ou numa forma; o que está dentro usa o tom |
| `lavado` | fundo da caixa: o tom bem claro |
| `cor` | a cópia fora do registro (`transform="translate(7 6)"`, antes do contorno), no tom |
| `linha-tom`, `cheio-tom` | traço no tom (setas de um fluxo, contorno de destaque); forma cheia no tom |
| `texto-tom` | texto no tom (rótulo do ator, número) |
| `selo` + `selo-texto` | bolinha cheia no tom com o número do passo |
| `carimbo` | contorno no tom |
| `linha`, `papel`, `hachura`, `fantasma` | como na capa (contorno na tinta, superfície, sombra, o que não acontece) |
| `titulo-caixa`, `texto-caixa` | nome da caixa (Besley 700, 27); complemento (Literata itálica, 21) |
| `rotulo`, `nota`, `nota-pequena`, `codigo`, `chamada` | textos e linha de chamada, como na capa |
| `eixo`, `grade`, `serie`, `area`, `limite`, `ponto` | gráfico: eixo na tinta, grade pontilhada, série e área no tom, limite tracejado vermelho, ponto |
| `valor-eixo`, `titulo-eixo` | números dos eixos (IBM Plex Sans, 19); título do eixo (Literata itálica, 22) |
| `traco-tom`, `risco` | fora do `.tinta`: traço no tom; o traço firme que corta um texto que deixou de valer |
| `marca-texto` | o nome escrito de um logo que é só letra (o "aws") |

### Detalhes que se mexem (opcional)

Não mudam a imagem: dão vida ao que já está lá. Na **ordem em que as coisas acontecem**, e em quantas
linhas fizer sentido, não só uma. Ficam **fora do `.tinta`**, só andam com a figura na tela e param
com movimento reduzido (a figura com um deles ganha o observador sozinha).

| Classe | O que faz |
|---|---|
| `pacote` + `etapa-1` … `etapa-7` | um ponto só percorre a linha na vez da etapa dele (1,2 s por etapa, ciclo de 8,4 s); a mesma etapa anda junta; o `path` precisa de `pathLength="1"` |
| `fluxo` | pontinhos correndo pela linha, sem parar |
| `formiga` | tracejado andando pela linha |
| `pulsa`, `pisca`, `gira`, `balanca`, `anda` | pulso, piscar, giro, balanço, vai e vem de lado |

```svg
<path d="M296 125 H386" pathLength="1" class="pacote etapa-1"/>
<path d="M736 125 H826" pathLength="1" class="pacote etapa-2"/>
```

O `pacote` vai numa cópia da seta, por cima dela e fora do `.tinta`, dentro do `<g>` do tom. Um gráfico
também pode ter detalhe: um ponto pulsando no pico, um cursor correndo na série. Se todas as linhas
acontecem ao mesmo tempo de verdade (mensagens e heartbeats), podem andar juntas.

## Infográfico do post resumo (D63)

O post resumo tem um desenho principal: o **infográfico**, uma `Figura` grande que mostra o assunto
inteiro de uma vez, logo depois da introdução. A ideia vem dos guias visuais do ByteByteGo
(<https://bytebytego.com/guides/>): um "pôster" em que o leitor entende o assunto olhando, e o texto
explica o que ele está vendo.

- **Referência, nunca cópia:** antes de desenhar, abra os guias do ByteByteGo sobre o mesmo assunto (ou
  um vizinho) e veja como eles dividem o pôster: os quadros, a ordem, o que vira ícone, o que vira
  número. Use isso como ideia de composição. O desenho, o texto, as cores e o traço são sempre os da
  casa (`docs/estilo-desenho.md` e esta skill): nada de copiar desenho, texto ou layout de lá.
- **Composição:** de 3 a 6 quadros, cada um com um título curto (2 a 4 palavras) e uma ideia só. Entra o
  que o assunto pede, entre:
  - o que é (uma frase e o desenho do conceito);
  - quem participa (os atores numerados, cada um com o ícone ou o logo e o tom dele);
  - como funciona (o fluxo principal, com setas e selos numerados);
  - as variações ou a comparação (os tipos, quando usar cada um);
  - o que levar (o cuidado principal ou a regra de bolso).
- **Detalhes e ícones sempre:** cada ator com o seu ícone (o logo da ferramenta por `data-marca`, ou um
  objeto desenhado à mão) e as caixas com o detalhe que diz o que elas são (a fila com as mensagens, o
  banco com as linhas, o cadeado fechado ou aberto). Nada de caixa só com o nome.
- **Medidas:** `viewBox` com 1200 de largura e a altura que precisar (em geral de 1200 a 1800), no
  máximo duas colunas de quadros e texto com 18 unidades ou mais: no computador a figura fica com uns
  950px; no celular, com 720px, rolando de lado (o `revisar.mjs` acusa o texto abaixo de 10px na
  tela). Cada quadro num `<g data-parte>`, separado do outro por um fio fino ou pelo espaço, sem
  moldura pesada.
- **Tons:** um por ator, os mesmos em todas as figuras do post, com a legenda de cores dentro da figura
  (quase sempre são 4 tons ou mais). Detalhes que se mexem só se ajudarem (o pacote que anda no fluxo),
  no máximo um ou dois.
- **O texto conversa com ele:** a introdução apresenta o infográfico, e cada seção passa por um quadro,
  na ordem dos números ("o quadro 2 mostra…"). O `aria-label` conta o pôster inteiro, quadro a quadro.

## Referências aprovadas pelo Cesar (30/09/2026)

Use como régua de qualidade antes de entregar uma figura ou animação:

- **Animação `src/animacoes/jackson-filtros-mascarando-cartao/dois-caminhos`** ("essa animação ficou
  TOP"; no post, desde a D67, é a figura em passos `dois-caminhos-em-passos`, e a animação segue na
  `/animacoes-test/`): o mesmo objeto (o cartão) vai por dois caminhos; no caminho errado, o que chega ao log fica
  vermelho e é riscado; no certo, o cartão atravessa o filtro, a peça vermelha (o CVV) cai e a fita
  verde (a máscara) entra. A cor de cada peça diz o que ela é, o movimento mostra a regra acontecendo,
  e a frase embaixo resume o que se viu.
- **Figuras de sequência `src/figuras/cronjob-vs-endpoint-sqs/gatilho-dispara-duas-vezes` e
  `sem-resposta-para-perder`** ("muito legal"): diagramas de sequência com os pacotes andando pelas
  setas na ordem em que as coisas acontecem.

## Figura em passos (`FiguraPassos`, D67, em prova)

**O formato de hoje:** desde 02/10/2026, a pedido do Cesar, todas as peças de passos dos posts são
figuras em passos (12 peças em 7 posts; a última lousa, a da instalação do csr-cockpit, saiu em
04/10/2026), e post novo com sequência, comparação no tempo ou o sistema funcionando usa este formato.
A D67 continua **em prova** no registro: quando o Cesar fechar, ele vira a `Figura` com `passos`, as
props `estilo` e `fim` saem (o que hoje se escolhe nelas vira o padrão), e a `Lousa`, a `Animacao` e as
páginas de prova saem do ar. O porquê está em `docs/figura-em-passos/`: a pesquisa (aprendizagem
multimídia, informação que some, small multiples) e a auditoria das 10 peças animadas de 02/10/2026,
com o que cada uma tinha de difícil.

É uma figura parada comum, que o leitor pode montar passo a passo:
- **abre inteira,** com os selos numerados e a lista dos passos embaixo;
- **"Passo a passo"** volta à base, e o leitor avança com Próximo e Anterior (ou clica num passo);
- **cada passo só soma:** o que entrou fica, os anteriores esmaecem um pouco e um ponto percorre a
  seta da mensagem uma vez;
- **no último passo,** a figura volta inteira. Nada anda sozinho, nada repete, nada some.

```mdx
import FiguraPassos from "../../components/FiguraPassos.astro";

<FiguraPassos
  figura="<slug>/<nome>"
  estilo="marca-texto"
  fim="segmentos"
  passos={["O app pede a cobrança, com a chave.", "…"]}
  legenda="…"
/>
```

| Prop | O que é |
|---|---|
| `figura` | `"<slug>/<nome>"`, o arquivo `src/figuras/<slug>/<nome>.svg` |
| `passos` | um texto por passo, na ordem dos selos do desenho (aceita `código` e `**negrito**`); o número tem de bater com o maior `data-passo` do desenho, senão o build quebra |
| `legenda` | uma linha embaixo, dizendo como ler a figura (o que é cada cor) |
| `estilo` | o desenho dos controles: sempre `"marca-texto"` (a escolha do Cesar, 04/10/2026: os traços de progresso são riscos de marca-texto, o passo da vez fica grifado na lista e o Próximo vem sublinhado). `lapis` e `fita` só na `/animacoes-test-3/` |
| `fim` | o aviso de que o passo terminou de entrar: sempre `"segmentos"` (um traço por passo embaixo da figura, como os stories; 02/10/2026). `botao`, `anel`, `selo` e `grifo` só na `/animacoes-test-2/` |

Arquivo em `src/figuras/<slug>/<nome>.svg`, com as regras das figuras (acima) e mais estas:

1. **A peça inteira se explica sozinha**, como uma figura parada: ela é a primeira coisa que o leitor vê.
2. **Uma ideia por peça,** que caiba numa frase. A consequência pode ser o último passo; duas histórias
   independentes viram duas peças.
3. **Base é o que o leitor já sabe** (sem `data-passo`, à vista desde o começo): os atores, no máximo 4,
   com nome, cor e logo genérico; as raias e o eixo; numa comparação, o trecho igual nos dois lados.
4. **Cada passo só soma** (`data-passo="n"`, dentro e fora do `.tinta`). Nada some, nada é riscado,
   nada muda de lugar, nenhum texto é trocado. Mudança de estado é uma nota nova ao lado (ou um
   histórico, "100 → 90 → 80", cada valor escrito uma vez).
5. **Um lugar muda por vez.** Numa comparação, um passo mexe num lado só: primeiro a diferença de A,
   depois a de B.
6. **Pouco por passo:** até 4 partes novas (uma seta com o rótulo dela é uma parte; uma nota com o
   texto, outra) e até 3 tempos (`etapa-1` a `etapa-3`, um segundo cada), quando uma coisa leva à outra.
7. **De 3 a 6 passos**, e o texto de cada um com até 15 palavras, dizendo só o que se vê. Método,
   comando ou jargão só se estiver no desenho; termo novo ganha uma explicação curta no próprio desenho.
8. **Selos na ordem de leitura** (de cima para baixo, da esquerda para a direita), com o mesmo número
   da lista. No diagrama de sequência, na margem esquerda (`cx="42"`), na altura do passo.
9. **Dicionário de símbolos, o mesmo em todo o blog:** ✓ verde é deu certo; ✕ vermelho é falhou, foi
   recusado ou se perdeu; tracejado (`fantasma`) é o que não aconteceu, e só isso (resposta é seta
   firme, no tom de quem responde); nada riscado. Vermelho nunca é um ator. O cabeçalho dos atores é a
   legenda das cores.
10. **Termina numa faixa de desfecho:** o resultado numa frase (numa comparação, uma por lado).
11. **Rótulos curtos no desenho** (até 4 palavras); a frase completa fica na lista.
12. **Movimento só o do motor:** a entrada do passo (0,4 s), os tempos e o ponto no `.trajeto` (cópia
    da seta, sem a ponta, `pathLength="1"`, fora do `.tinta`, no grupo do tom e do tempo dela). Nada de
    relógio girando, envelope voando ou objeto que anda e some.
13. **No celular,** a figura fica com 720 px e rola de lado, e o motor rola o quadro até o que entrou:
    o conteúdo novo de um passo cabe em cerca de 600 unidades de largura.

**Layouts:**
- **Fluxo entre atores:** diagrama de sequência. Atores no alto (caixas de 230 × 88), linhas de vida
  (`grade`), o tempo descendo, setas no tom de quem envia, nota de estado sobre a linha de vida do dono.
  Modelo: `src/figuras/cobranca-duplicada-no-retry/chave-em-passos.svg`.
- **Comparação:** duas metades lado a lado, alinhadas (small multiples), cada uma com título e faixa de
  desfecho; numa linha do tempo, duas raias com o mesmo eixo.
- **Um objeto que passa por etapas** (um JSON montado campo a campo): o objeto na base, e cada passo
  soma a seta, o resultado e o selo.

**Aviso de que o passo terminou:** o motor (`src/scripts/figura-passos.ts`) marca a entrada do passo
(`data-entrando`, com a duração em `--duracao-passo`) e o fim (`.passo-terminou`); o `fim=` decide como
isso aparece (acima, na tabela).

Conferir: `node scripts/desenho/validar.mjs <slug>` (aceita `data-passo` e `trajeto` e confere o
trajeto) e as fotos de cada passo, a figura inteira primeiro, em 1280 e 390, no claro e no escuro. O
componente quebra o build se o número de passos do desenho não bater com o da lista.

## Animação com play (`Animacao`, em prova, D67)

**Em prova:** nenhum post usa (desde 02/10/2026 as três dos posts viraram figuras em passos); as peças
de `src/animacoes/` só aparecem na `/animacoes-test/`, até o Cesar fechar a D67. Post novo usa a figura
em passos. As regras abaixo valem para mexer nessas peças.

Para o que as lousas não cobrem: o sistema funcionando, uma fila enchendo e esvaziando, um algoritmo
rodando, um gráfico se preenchendo ao longo do tempo, um contador que sobe. Pouca animação também vale:
às vezes só o ponto principal se mexe. Consulte as skills `gsap-core`, `gsap-timeline` e
`gsap-performance`.

Dois arquivos em `src/animacoes/<slug>/`:

- `<nome>.svg`: o **quadro final**, completo e parado, com as mesmas regras e classes da figura. É o
  que aparece antes do play, sem JS e na impressão. O que some no fim fica no SVG com `opacity="0"`.
  As peças que se movem têm `data-parte="<nome>"` (vários elementos podem ter o mesmo) e ficam fora do
  `.tinta`.
- `<nome>.ts`: o movimento.

```ts
import type { GSAP } from "../../scripts/gsap";

export default function montar(gsap: GSAP, svg: SVGSVGElement) {
  const parte = (nome: string) => [...svg.querySelectorAll<SVGElement>(`[data-parte="${nome}"]`)];
  const tl = gsap.timeline({ paused: true });
  // set, from, fromTo e to, terminando exatamente no quadro do arquivo
  return tl;
}
```

- A timeline **termina exatamente no quadro do arquivo**; o componente repete com 5 s de pausa no fim
  (não ponha `repeat` nem espera final).
- Anime só `x`, `y`, `scale`, `rotation`, `opacity` e `strokeDashoffset` (com `transformOrigin` quando
  precisar).
- **De 6 a 12 s por volta**, sem pressa: cada coisa que aparece fica tempo bastante para ser lida.
- **Pouco texto trocando:** o que foi escrito não some. Para escrever um texto, cubra-o com um
  retângulo `papel` (`data-parte="tampa-…"`) e encolha a tampa da esquerda para a direita
  (`scaleX` de 1 a 0, `transformOrigin: "100% 50%"`). Se mudou, um `risco` (`pathLength="1"`, de
  `strokeDashoffset` 1 a 0) corta o texto velho, e o novo é escrito embaixo. Mais desenho que texto.
- **Controles em prova (D65):** `controles="marca-texto" | "caderno" | "post-it"` troca os botões e a
  frase de baixo por uma das três opções do protótipo (`/prototipos/controles/`), num cartão só com o
  desenho. Só aparece na `/animacoes-test/` e na `/prototipos/controles/`; nenhum post usa. Se a D67
  for aprovada, a D65 perde o objeto (a figura em passos tem um controle só) e este item sai.
- O componente cuida do resto: abre tocando quando aparece na tela (nunca com movimento reduzido),
  pausa fora dela, o anel em volta do botão mostra a volta e pulsa nos 5 s do fim, o botão de recomeçar
  e o clique na imagem dão play ou pausa. O GSAP vem sob demanda (`src/scripts/gsap.ts`). No RSS, a
  animação não aparece.

## Logos das ferramentas (`src/marcas/`, `Ferramenta`, `data-marca`)

**Todo logo passa pela regra de marca do dono (D64).** O registro é `src/marcas/regras.json`: para cada
marca, o que a política oficial dela permite no texto e no diagrama, com as fontes, a data da
conferência e as condições. O código obedece ao registro (`src/lib/figuras.ts`): logo sem registro, ou
com "nao", **quebra o build** com o motivo; e o `validar.mjs marcas` recusa redesenho de marca que não
permite redesenhar.

| No registro | O que fazer |
|---|---|
| `redesenho` | pode desenhar à mão no traço da casa (`src/marcas/<nome>.svg`) |
| `oficial` | só o arquivo oficial, **sem nenhuma alteração** (`src/marcas/oficiais/<nome>.svg`, baixado da fonte com o OK do Cesar); entra como imagem, sem o traço nem as cores da casa |
| `nao` | não usar o logo: só o nome em texto (e, no desenho, um ícone genérico) |

**Antes de usar um logo:**
1. Procure a marca em `src/marcas/regras.json`. Se está lá e permite o uso (no texto ou no diagrama,
   conforme o caso), use direto: a conferência vale para sempre, até alguém refazer.
2. Se não está, **confira antes de desenhar**: leia a política oficial do dono (trademark guidelines,
   brand guidelines, a licença dos arquivos do logo) e registre a marca com `texto`, `diagrama`,
   `condicoes`, `fontes`, `conferido` (a data) e `certeza`. Na dúvida, "nao" até ter certeza ou
   permissão escrita. Uso nominativo (o nome em texto) é sempre permitido.
3. Não permite? **Ícone genérico da casa**, que não é marca de ninguém e está sempre liberado: `banco`
   (cilindro), `fila` (envelopes num tubo), `topico` (um envelope para vários), `aplicacao` (janela com
   código), `servidor` (gavetas de rack). Ícone genérico novo entra no registro como "ícone genérico do
   blog", e nunca imita o logo ou o ícone de produto de alguém.

Situação em 02/10/2026: só o **Kubernetes** pode ser redesenhado (uso não comercial). AWS e os ícones dos
serviços dela, Java (a xícara), Spring e Redis: só o nome. MongoDB, PostgreSQL e Kafka: só o arquivo
oficial no texto, nada no diagrama. OpenTelemetry: só o arquivo oficial. O mascote Duke, do Java (licença
BSD), pode ser redesenhado, mas ainda não entrou.

- `src/marcas/<nome>.svg`, `viewBox="0 0 100 100"`, **sem `aria-label`** (o nome vem escrito ao lado),
  o desenho dentro de `<g class="tinta …">` (o tremor é desligado nos logos), o texto fora dele. Traços
  finos: no tamanho da letra, traço grosso vira mancha preta.
- **Numa figura ou animação:** um marcador, trocado pelo logo (ou pelo ícone genérico) no build, no lugar
  que identifica a peça: `<g data-marca="kubernetes" transform="translate(x y) scale(s)"/>`.
- **No texto:** `<Ferramenta nome="kubernetes" href="https://kubernetes.io/…">Kubernetes</Ferramenta>`,
  do tamanho da letra, antes do nome. Na primeira menção e de novo mais adiante no post (não só no
  começo), nunca em toda menção. O `href` é um easter egg: abre em outra aba a página **mais
  específica**, sem mudar o cursor, fora do Tab e do leitor de tela.
- Não confundir com os ícones das tags (`src/livros/tags/`, D52), que são objetos de ofício e nunca
  logotipo.

## Print como evidência (`Evidencia`)

Uma imagem que prova algo que o texto diz: a documentação oficial dizendo o número citado, um erro, um
painel.

- **Só o que faz sentido e dá para garantir que está certo.** Tela que pede login (console da AWS,
  painéis internos): peça ao Cesar, ele tira o print. Nunca invente nem monte a tela.
- Página pública: `node scripts/foto.mjs <url> src/evidencias/<slug>/<nome>.png --seletor
  "main" --pronto domcontentloaded` (Chrome próprio, sem MCP). **Sem aceitar cookies:** recuse o
  aviso, ou fotografe só o conteúdo com `--seletor`.
- PNG em `src/evidencias/<slug>/`, importado no `.mdx` (`../../evidencias/<slug>/<nome>.png`).
- `alt`: o que a imagem prova, não "print da página". `fonte`: o endereço exato da página
  fotografada (o clique abre ela em outra aba). `legenda`: o que é, curto ("Documentação do
  DynamoDB, boas práticas para a chave de partição"); o site sai sozinho depois dela.
- O componente põe a borda (o print branco não se confunde com a folha) e não abre no visor.
- **Print largo, de letra miúda** (a tela de um terminal, D66): a prop `larga`. Até 700px a imagem
  fica com 720px e rola de lado dentro da moldura, com o aviso "Arraste para o lado", como as figuras.
  Sem ela, o print encolhe com a tela e a letra some no celular. Fotografe com o triplo da resolução
  (`--escala 3`): o print largo ocupa a coluna inteira do texto e precisa das fontes maiores.
- **O que importa está à direita** (o painel ao lado da conversa): junto com `larga`, a prop `foco`,
  a fração da largura, contada da direita, que tem de caber na tela do celular (`foco={0.535}`). O
  print começa por essa parte, do tamanho em que ela cabe, e o resto fica rolando para a esquerda.
- **Tela de aplicativo** (D86): nunca pelo `Evidencia` com uma foto só, nem desenhada no estilo do
  blog; é o componente `Tela`, abaixo. (A regra da D66, o desenho da tela como print parado em PNG, não
  vale mais.)

## Tela de aplicativo (`Tela`, D86)

A tela de um aplicativo (um painel, uma aba, um detalhe, a linha de status) entra no post como
**print do próprio projeto**, nas duas versões, clara e escura, e a que aparece segue o tema do site
(o botão claro/escuro, não o do sistema). **Nunca como desenho da casa**: a tela desenhada é uma
segunda versão do app, que envelhece e diverge; o desenho fica para os diagramas. Regra do Cesar de
06/10/2026, nas partes 2 e 3 do post dos mods (`claude-code-csr-lens.mdx` e
`claude-code-csr-lens-agentes.mdx`).

- **As imagens:** `src/evidencias/<slug>/<nome>-claro.svg` e `<nome>-escuro.svg` (SVG ou PNG), as
  mesmas que o projeto usa na documentação dele (as do CSR Lens vêm de `docs/arte/telas/` do
  `claude-code-kit`, sem as bolinhas numeradas do README). Nunca invente nem monte a tela; se o projeto
  não tem a versão escura, peça ao Cesar.
- **No post:** `<Tela claro={…} escuro={…} alt="…" fonte="…" legenda="…" />`. O `alt` descreve o que a
  tela mostra, com os nomes e os números que estão nela (não "print da aba"); a `fonte` é a seção da
  documentação do projeto que explica a tela (o clique na imagem e o link da legenda levam a ela); a
  `legenda` diz o que é, curto. Opcionais: `largura` (largura máxima, para uma tela estreita) e
  `celular` (a largura na coluna estreita; o padrão é 720px, como o print largo; a linha de resumo, uma
  faixa de 36px de altura, fica com a largura natural para a letra se ler).
- **O texto apresenta a tela e diz o que olhar nela**, com os números do cenário ("a tela abaixo é a
  sessão de exemplo no quarto turno: 52% do contexto, US$ 2,74…"), e aponta a seção da documentação
  que a aprofunda ("em detalhe no README"), sem passar de dois links por parágrafo. Nada de tela solta.
- **O componente cuida do resto:** a moldura do print (`Evidencia`), as duas imagens no HTML com
  `loading="lazy"` (a do outro tema fica escondida até o tema mudar), a rolagem de lado na coluna
  estreita (menos de 764px, como as figuras desde a D84), com o aviso "Arraste para o lado", e, no RSS,
  só a versão clara com a legenda e o link.
- **Conferir:** `npm run conferir -- <slug> --capturas` e as capturas de 1280 (claro e escuro) e 390: a
  tela clara no tema claro, a escura no escuro, e nada estourando a largura no celular.

## Validar, revisar e conferir (obrigatório antes de mostrar ao Cesar)

Todo desenho terminado (figura, figura em passos, capa, logo, print; nas páginas em prova, animação e
lousa) passa por esta revisão **antes** de ir para o Cesar. Desenho entregue com bug que a revisão
pegaria é falha do processo.

```sh
fnm exec --using=24 node scripts/desenho/validar.mjs <slug>    # capa, lousas, figuras e animações do post
fnm exec --using=24 node scripts/desenho/validar.mjs marcas    # os logos
fnm exec --using=24 node scripts/desenho/revisar.mjs <slug> --base http://127.0.0.1:4322   # bugs e fotos (D59)
fnm exec --using=24 npm run conferir -- <slug>                 # 320–1600px, dois temas, console, rolagem, alt
```

O **`revisar.mjs`** acusa sozinho (e sai 1): texto encostado, cortado na borda ou com menos de 10px na
tela (em 1280 e 390px, no fim, em cada passo da lousa e em instantes da animação); na figura com
legenda, o que não apaga e o que apaga errado com o mouse em cada cor, e animação que mexe em
`opacity`; na lousa, parte que atravessa a fronteira de um passo, passo vazio e duas canetas no mesmo
lugar; print sem alt, legenda ou link; ícone no texto sem link; erro no console ou página que não abre.
Ele dá **aviso** (que precisa ser olhado e explicado) para texto sem tom colado num texto com tom. E
tira as fotos em `.astro/revisar/<slug>/`: cada desenho em 1280 claro e escuro e em 390, cada cor da
legenda com o mouse, a lousa em cada passo e no play, a animação em quatro instantes.

**Olhe todas as fotos** e confira o que o script não vê:

1. O desenho conta o que o texto conta, e o texto apresenta o desenho e diz o que olhar nele.
2. Cada ator com a mesma cor em todas as figuras do post (paradas e em passos); vermelho só para erro.
3. Com o mouse em cada cor: só aquele ator fica aceso; o resto apaga, e a referência (`.referencia`,
   eixos) fica inteira acesa, sem metade apagada (o logo apagado e o ícone ao lado aceso é bug).
4. Nada cruza texto; seta não passa por cima de rótulo; nada encosta na borda do painel.
5. No escuro, tudo legível (tons, lavados, logos); em 390px, a figura rola de lado e a letra se lê.
6. Figura em passos: a figura inteira se explica sozinha; cada passo só soma e mostra só o que a linha
   da lista diz; os selos batem com a lista; em 390px, o quadro rola até o que entrou.
7. Nas páginas em prova: a animação (uma volta inteira dá para ler; nada some do que foi escrito; o
   quadro final bate com o arquivo; com movimento reduzido, não abre tocando) e a lousa (cada passo
   mostra só o que a linha da lista diz; a canetinha na cor do que desenha; nas comparações, as duas
   linhas no mesmo instante).
8. Detalhes que se mexem na ordem do que acontece; a figura com detalhes ou animação passa pelo trace
   de performance com CPU 4× (skill `post`, passo 7).

Corrija, rode de novo e só entregue com o `revisar.mjs` limpo (ou com cada aviso explicado). Para um
instante avulso: `node scripts/foto.mjs <url> <saida.png> --seletor ".figura" [--indice n] [--hover
".legenda.tom-azul"] [--tema escuro] [--largura 390] --altura 1500` (o `--altura` grande evita o
cabeçalho fixo por cima da foto). O `npm run contraste` confere os tons (`--diag-*`), inclusive sobre
o painel de cada livro.

### Bugs que já aconteceram (não repetir)

| Bug | Causa | Regra |
|---|---|---|
| Com o mouse numa cor, o retângulo que pisca de outra cor não apagava | `pisca` e `pacote` animavam `opacity`, e a animação vence o destaque | detalhe que se mexe usa `fill-opacity`/`stroke-opacity` |
| "Os dois juntos" ficava sempre aceso | rótulo de duas cores sem tom nenhum | rótulo de mais de um ator leva os tons de todos (`class="tom-petroleo tom-ambar"`) |
| Logos de outros componentes ficavam acesos (CronJob) | logo solto, fora do grupo do ator, sem tom | o marcador do logo leva o tom do ator |
| Cabeçalho pela metade: logos apagavam e o disco e a rede ficavam acesos; "TLS" ficava aceso com "Em trânsito" apagado (criptografia) | logos sem tom apagavam e desenhos sem tom não; o complemento da linha ficou fora do grupo do tom | a referência vai inteira num `<g class="referencia">`; tudo de um ator no grupo dele |
| "Banco", notas e "mesmo banco" (CronJob) e a "Resposta da API" (Jackson) ficavam acesos com qualquer cor; a moldura do "JSON do log" acesa e o texto apagado | o que não tinha cor nunca apagava | o que não tem cor apaga junto (D59); a caixa e o texto de um ator no mesmo tom |
| Uma caneta escrevendo em dois lugares (lousa) | duas partes do mesmo lugar no mesmo instante | uma caneta por lugar, até três; o `revisar.mjs` acusa |
| O detalhe da capa pulava de volta ao tirar o mouse | animação de evento cortada no `:hover` | evento vai até o fim (`.mexendo`); estado volta animado |
| Na animação com play, um risco ou um anel aparecia de uma vez no meio do tempo, em vez de se desenhar (o Jackson) | com `pathLength="1"`, o GSAP arredonda o `strokeDashoffset` para 1 ou 0 (`autoRound`) | todo `strokeDashoffset` animado leva `autoRound: false` |
