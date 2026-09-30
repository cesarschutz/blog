---
name: figura
description: Desenha as figuras do corpo do post (D58) - diagramas e gráficos coloridos (componente Figura), com detalhes que se mexem; a animação com play (Animacao, com o SVG do quadro final e o .ts que monta a timeline GSAP); os logos das ferramentas (src/marcas, Ferramenta no texto, data-marca nas figuras); e o print como evidência (Evidencia). Use ao criar, corrigir ou conferir qualquer desenho do corpo de um post que não seja a capa (skill desenho) nem uma lousa (skill lousa).
---

# Figura (diagramas, gráficos, animação com play, logos e print)

**Antes de desenhar, leia `docs/estilo-desenho.md`** (a seção das figuras) e o `DESIGN.md`. Os
tempos estão em `docs/movimento.md`. Classes em `src/styles/figura.css` (mais as da capa, de
`desenho.css`); leitura dos arquivos em `src/lib/figuras.ts`. Exemplos nos posts
`jackson-filtros-mascarando-cartao.mdx` (figura, animação com play, print e ícones),
`cronjob-vs-endpoint-sqs.mdx` (figuras com legenda) e `criptografia-em-repouso-e-em-transito.mdx`.

## Regras de todo desenho do corpo

- **Todo desenho conversa com o texto.** O texto apresenta o desenho e diz o que olhar nele (o que é
  cada cor, a ordem dos números, o que o ponto que corre mostra). Nada de imagem solta.
- **Nem todo post tem todos os tipos.** Entra o que o assunto pede e o que fica bom: um post pode ter
  só a capa e um gráfico; outro, uma lousa e uma animação.
- **Quem manda no movimento:** a figura fica parada, ou com detalhes que se mexem sozinhos **sem mudar
  a imagem**; a animação com play **muda a imagem** (o sistema funcionando), e o leitor só dá play e
  pausa; a lousa (skill `lousa`) é comandada pelo leitor.
- **Ícones das ferramentas** sempre que couberem, no texto e dentro dos desenhos, espalhados pelo post
  e não só no começo, sem poluir.
- **Print** só quando prova algo do texto e dá para garantir que está certo.

## Componentes no post

Post com qualquer um deles é `.mdx`. Imports logo depois do frontmatter:

```mdx
import Figura from "../../components/Figura.astro";
import Animacao from "../../components/Animacao.astro";
import Ferramenta from "../../components/Ferramenta.astro";
import Evidencia from "../../components/Evidencia.astro";
import documentacao from "../../evidencias/<slug>/documentacao.png";
```

```mdx
<Figura figura="<slug>/caminho" legenda="Cada cor é um papel: o app (azul), a escrita com sufixo (verde)…" />

<Animacao animacao="<slug>/chuva" legenda="Sem sufixo, quase todas as escritas caem na P3…" />

Numa Black Friday, a tabela do <Ferramenta nome="dynamodb" href="https://aws.amazon.com/dynamodb/">Amazon DynamoDB</Ferramenta>…

<Evidencia imagem={documentacao} alt="…" fonte="https://docs.aws.amazon.com/…" legenda="Documentação do DynamoDB, boas práticas para a chave de partição" />
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
  destaque. Com menos tons, a `legenda=` embaixo basta.
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

## Animação com play (`Animacao`)

Para o que as lousas não cobrem: o sistema funcionando, uma fila enchendo e esvaziando, um algoritmo
rodando, um gráfico se preenchendo ao longo do tempo, um contador que sobe. Pouca animação também vale:
às vezes só o ponto principal se mexe.

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
- O componente cuida do resto: abre tocando quando aparece na tela (nunca com movimento reduzido),
  pausa fora dela, o anel em volta do botão mostra a volta e pulsa nos 5 s do fim, o botão de recomeçar
  e o clique na imagem dão play ou pausa. O GSAP vem sob demanda (`src/scripts/gsap.ts`). No RSS, a
  animação não aparece.

## Logos das ferramentas (`src/marcas/`, `Ferramenta`, `data-marca`)

Antes de desenhar um logo, veja se ele já existe em `src/marcas/` (hoje: api-gateway, aws, dynamodb,
java, kafka, kubernetes, opentelemetry, postgresql, redis, sns, sqs, step-functions). Só de ferramenta
ou produto de que o post fala.

- `src/marcas/<nome>.svg`, `viewBox="0 0 100 100"`, **sem `aria-label`** (o nome vem escrito ao lado),
  o desenho dentro de `<g class="tinta …">` (o tremor é desligado nos logos), o texto fora dele.
- Desenhado à mão no traço da casa, **reconhecível, sem copiar o arquivo oficial**: a forma que todo
  mundo conhece, simplificada, com os tons (AWS: "aws" com `marca-texto` e o sorriso em âmbar;
  Kubernetes: o heptágono azul com o leme; Java: a xícara). Traços finos: no tamanho da letra, traço
  grosso vira mancha preta.
- **Numa figura ou animação:** um marcador, trocado pelo logo no build, no lugar que identifica a peça
  (a xícara na caixa do app, o logo da AWS na caixa da nuvem):
  `<g data-marca="aws" transform="translate(x y) scale(s)"/>`.
- **No texto:** `<Ferramenta nome="java" href="https://openjdk.org/projects/jdk/21/">Java</Ferramenta>`,
  do tamanho da letra, antes do nome. Na primeira menção e de novo mais adiante no post (não só no
  começo), nunca em toda menção. O `href` é um easter egg: abre em outra aba a página **mais
  específica** (a do DynamoDB, não a da AWS; a do Java 21, não a do Java), sem mudar o cursor, fora do
  Tab e do leitor de tela.
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

## Validar e conferir

```sh
fnm exec --using=24 node scripts/desenho/validar.mjs <slug>    # capa, lousas, figuras e animações do post
fnm exec --using=24 node scripts/desenho/validar.mjs marcas    # os logos
fnm exec --using=24 node scripts/foto.mjs <url> <saida.png> --seletor ".figura" [--indice n] [--tema escuro] [--largura 390]
fnm exec --using=24 node scripts/foto.mjs <url> <saida.png> --seletor ".figura" --hover ".legenda" --esperar 600
fnm exec --using=24 node scripts/foto.mjs <url> <saida.png> --seletor ".animacao" --esperar 4000   # um instante da animação
fnm exec --using=24 npm run conferir -- <slug>                 # 320–1600px, dois temas, console, rolagem, alt
```

O `foto.mjs` também aceita `--movimento-reduzido`, `--clicar`, `--inteira` e `--antes` (veja o
cabeçalho do script). O `npm run contraste` confere os tons (`--diag-*`), inclusive sobre o painel de
cada livro.

Olhe cada figura a olho, nos dois temas e em 390px: nada cruza texto, letra legível, o destaque da
legenda, os detalhes na ordem do fluxo. Na animação, assista a uma volta inteira: dá para ler cada
coisa, nada some do que foi escrito, o quadro final bate com o arquivo, e com movimento reduzido ela
não abre tocando. Figura com detalhes ou animação passa pelo trace de performance com CPU 4× (skill
`post`, passo 7).
