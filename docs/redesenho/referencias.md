# Referências do redesenho (D55)

O que se aproveita de cada site que o Cesar indicou. Cada site foi aberto por um agente próprio
(`redesenho-pesquisador`, Playwright headless). As capturas ficam em
`.astro/depuracao/redesenho/referencias/<site>/`, fora do git: são imagens de sites de terceiros,
só para estudo.

**Regra de uso:** reaproveita-se a técnica, não o código. Código de licença aberta só entra reescrito
e com a licença anotada. Código sem origem clara não entra.

## Situação

| Site | Status | Licença do código | Serve mais a |
|---|---|---|---|
| microkit.co | aberto | MIT (Henrique Barone, 2026); parte adaptada de exports do Webflow → reescrever | todos (tema), 01, 02, 05, 06, 08 |
| animejs.com | aberto (parcial, pausa) | anime.js MIT; a cena da home (three.js, shaders) e as fontes não → só a técnica | 04 (principal), 03, 05, 07 |
| kobra.systems | aberto | **proprietária** (venda de licença; os grátis são "Personal use only") → só a técnica, reescrita do zero | busca, filtro, copiar, tema (todos); 03, 04, 06, 10 |
| ui.soralabs.studio | aberto (parcial, pausa) | MIT (© 2026 A. Senaviev); trechos do Animate UI com Commons Clause → reescrever a técnica | troca de página (01, 05, 07), filtro, links (05, 10) |
| fontshare.com | aberto (parcial, pausa) | ITF FFL v2.0: uso comercial e no próprio servidor ok; **proibido subsetar/converter**; commitar os `.woff2` em repositório público é zona cinzenta → decisão do Cesar | tipografia de todos |
| hugeicons.com | aberto (parcial, pausa) | Stroke Rounded grátis é MIT (pacote `@hugeicons/core-free-icons`); os outros estilos são Pro (não commitar) | ícones de todos |
| uiable.com | aberto (parcial, pausa) | grátis MIT; Pro proprietário (cursores, abas animadas) → só a técnica | tema, cards, cursores (02, 04, 07, 10), filtro |
| kinetics.colorion.co | aberto | "MIT" só declarada no rodapé; o repositório não tem LICENSE → reescrever | 08, aberturas de todos, 02, 06, 10 |
| skyscanner.design (Backpack) | aberto (parcial, pausa) | não conferida (o `backpack-web` deve ser Apache-2.0, a verificar); fontes e logo com termos próprios | método de tokens, movimento e estados de todos |

## microkit.co

É uma biblioteca de 49 microinterações para copiar (React, CSS e Tailwind, distribuída pelo registro
do shadcn). Quase tudo é CSS (`transition` e `@keyframes`) e respeita `prefers-reduced-motion`.

1. **Troca de tema em diagonal.**
   - `startViewTransition`, e o `::view-transition-new(root)` anima um `clip-path: polygon()` de uma
     linha diagonal até cobrir a tela: 0,7 s, `cubic-bezier(.4,0,.2,1)`.
   - O `old` fica parado, e o `data-theme-to` no `<html>` escolhe o sentido.
   - Serve a todos os modelos, com destaque para 01, 03 e 06.
2. **Rótulo que rola letra a letra.**
   - Cada letra tem duas cópias numa célula com `overflow: hidden`: a de cima sai a -125%, a de baixo
     entra de +125%.
   - Atraso de índice × 34 ms, 0,45 s por letra, `cubic-bezier(.16,1,.3,1)`.
   - `aria-label` no botão e `aria-hidden` nas letras.
   - Serve a menu, "Ler o artigo" e nomes de livro (01, 05, 06, 08).
3. **Abas com sublinhado que desliza.**
   - A barra de 3px anda por `translateX` (0,75 s, `cubic-bezier(.22,1,.36,1)`).
   - O conteúdo novo entra com opacidade e `translateX(-5px)` (0,65 s).
   - Serve ao filtro por livro (01, 03, 06, 10).
4. **Trilho do item ativo.** Uma barra de 2px desliza até o item ativo (0,3 s). No original anima
   `top` e `height`; aqui, `translateY` e `scaleY`. Serve ao sumário (02, 06, 09).
5. **Botão que processa e confirma.** O rótulo novo entra com `translateY(6px)` e desfoque de 2px
   (0,32 s), com `aria-busy` e `aria-live`. Serve ao "Copiar → Copiado" (02, 04, 06).
6. **Luz que segue o cursor.** `--cursor-x/y` gravados no `pointermove` e uma bolinha que cresce de
   .55 a 1 (0,3 s). Com `transform`, não `left/top`. Serve ao 02 Noturno.
7. **Preenchimento que sobe.** Uma camada sobe por `clip-path` ou `scaleY` (0,38 a 0,52 s,
   expo-out), e o texto troca de cor (0,28 s). Serve a botões e cards de livro (01, 07).
8. **Sublinhado que se desenha do centro** (`scaleX`, 1 s, `cubic-bezier(.165,.84,.44,1)`). Serve aos
   links do texto (05, 10).
9. **Seta que troca de lugar com o ícone** (0,52 s, expo-out). Serve a "Ler mais" e a "Próximo".
10. **Número de arrastar.**
    - Pointer capture, 2px por passo, com Shift ×10 e Alt ×0,1, e uma batida de 0,26 s nos limites.
    - Serve aos eixos do 08 e ao tamanho da letra no modo leitura.

**A home deles:**

- a única entrada é o comando de instalação escrito letra a letra: 33 letras, 18 ms entre elas, 0,45 s
  cada, de `translateY(125%)` a 0;
- não há "aparece subindo" por rolagem;
- no hover de um cartão, o nome no comando é reescrito.

**Evitar:**

- fundo WebGL em tela cheia;
- animar layout (`width`, `height`, `left/top`, `grid-template-columns`);
- desfoque em área grande;
- brilho em laço contínuo;
- a estética de vitrine de SaaS (laranja saturado, pílulas brilhantes).

## kinetics.colorion.co

São 153 microinterações com "mola" (CSS, React e prompt), num Astro estático em grafite e âmbar.
**Não é um site de tipografia cinética:** só uns 13 efeitos são de texto, e o topo não tem entrada
animada.

**Curvas que valem para todos:**

| Nome | Curva | Comportamento |
|---|---|---|
| `--spring` | `cubic-bezier(.34,1.56,.64,1)` | passa 9,8% do fim e volta |
| `--glide` | `cubic-bezier(.16,1,.3,1)` | faz 90% do caminho em 33% do tempo |
| (percurso deliberado) | `cubic-bezier(.65,0,.35,1)` | sai e chega devagar |

- As durações vão de 0,2 a 0,5 s.
- A mola de verdade (k=320, c=24) só existe em JS. Em CSS, equivale (≈0,42 s) a
  `linear(0,.08,.24,.44,.63,.78,.89,.98,1.03,1.05,1.06,1.05,1.04,1.03,1.02,1.01,1.01,1,1)`.

1. **Letras que sobem de uma máscara.**
   - Cada letra vai de `translateY(110%)` a 0 dentro de `overflow: hidden`, em 0,5 s com `--spring`,
     40 ms por letra (use `--i`, não `nth-child`).
   - Divida com `Intl.Segmenter` por causa dos acentos, com `aria-label` no pai e `aria-hidden` nas
     letras.
   - Serve ao 08 e às aberturas (01, 05, 10).
2. **Peso variável.**
   - Anima `font-variation-settings` (`wght` 200→800), o que custa um layout por quadro: medido
     ~0,5 ms por quadro num parágrafo, e o vizinho anda 18px.
   - O **"texto fantasma"** (uma cópia invisível no peso máximo, na mesma célula da grade) reserva a
     largura e zera o deslocamento.
   - Só em títulos e rótulos curtos. Serve ao 08.
3. **Indicador único que salta.**
   - O JS mede com `getBoundingClientRect` só no evento e grava `--x --y --w --h`.
   - O indicador anda por `translate`, com `--spring` em 0,48 s (custo ≈ zero).
   - Serve ao filtro por livro, ao menu e a Categorias (01, 03, 04, 06).
4. **Cortina de `clip-path`.**
   - `inset(0 100% 0 0)` → `inset(0)` em 0,5 s com `--glide`.
   - Numa paleta, `inset(0 0 100% 0 round 15px)`, com os itens em cascata.
   - Serve às trocas de página, à paleta do 06 e à busca.
5. **Sublinhado que se desenha.** Um `::after` com `scaleX` (0,4 s), com a origem invertida na
   saída. Serve aos links do artigo e ao menu (01, 05, 10).
6. **Decodificar (scramble).**
   - Símbolos `!<>-_/[]{}=+*^?#` a cada 35 ms, em mono, ~1,2 s para 9 letras.
   - É o mais caro (reescreve o texto a cada passo). Só em rótulo curto, com `aria-label`.
   - Serve ao 08, ao 06 e à abertura do 10.
7. **Contador.** rAF por 1,4 s, curva `1-(1-p)^3`, com `tabular-nums`, uma vez, quando 50% entra na
   tela. Serve a todos.
8. **Seguir com parada (lerp).**
   - O rAF só roda enquanto o cursor se move ou o valor não chegou (<0,3px), 0,18 por quadro, via
     `transform`.
   - Serve à ilustração que segue o cursor (10) e à luz do 02, com variáveis num `radial-gradient`.
9. **Folha que vira.** `rotateY(-130deg)` com origem na esquerda, `perspective: 1000px`, 0,6 s e
   `backface-visibility: hidden`. Serve ao anterior/próximo e à troca de página do 05.
10. **Faixa corrida com máscara.** `mask-image` com 12% de esmaecer nas pontas e `translateX(0 → -50%)`
    em 14 s. Serve à faixa de tags do 07.
11. **Menu e modal.**
    - O menu entra de `translateY(-6px) scale(.98)` com `--spring` em 0,3 s.
    - O modal sobe 14px com `scale(.97)` em 0,32 s.
    - Esc fecha e devolve o foco.

**Evitar:**

- ~200 animações infinitas ao mesmo tempo (a página deles gasta até 0,78 s de CPU por segundo, com a
  CPU 4× mais lenta);
- rAF sem parada;
- JS que ignora o movimento reduzido;
- texto invisível até o hover;
- animar `left`, `top` ou `width`;
- glitch, separação cromática, neon, aurora, brilho corrido e letterpress (cara de template);
- a cascata de `translateY` em cada bloco;
- fonte com `swap` sem métrica de reserva (o título deles pula ~65px ao trocar a fonte).

## kobra.systems

Vende componentes React, Tailwind e Motion (mais de 90, dos quais 10 grátis). O visual é quente e
contido. Todo hover leva 0,15 s com `cubic-bezier(.23,1,.32,1)`, e o capricho está nos **estados**.
Não há abertura nem troca de página. **A licença é proprietária:** daqui só se tira a técnica, escrita
do zero.

**O campo OTP, estado por estado:**

1. **Um anel só, que viaja.**
   - Um único anel de 3px vai de casa em casa por mola (~0,3 s).
   - Aparece esmaecendo (0,2 s) e se estica sobre o trecho colado (~0,42 s).
   - Fica vermelho no erro e volta à primeira casa.
   - No blog, com `translate` e `scaleX`.
2. **O dígito que chega.**
   - Chega com `translateY(6px) rotateX(-35deg)`, origem embaixo e `perspective: 240px`.
   - Mola de 0,3 s com ~1,5% de passada, convertida em `linear()` e rodando por WAAPI.
   - Sem o desfoque do original.
3. **Onda de "processando":** a opacidade de cada casa cai a 28% em onda, da esquerda para a direita
   (1,15 s, 70 ms entre as casas).
4. **Erro:**
   - o campo treme (+6, −6 e +4px, 0,28 s);
   - o anel fica vermelho e o campo se limpa;
   - a mensagem entra com opacidade e `translateX(-8px)`.
5. **Sucesso:** um anel varre as casas (0,34 s, 48 ms entre elas), e cada casa pula 8px, com
   amortecimento (0,42 s).
6. **Colar:** uma varredura que apaga (0,4 s, 45 ms entre as casas), e o anel se estica.

**Como isso vira blog:**

| Estado | Busca | Chips do filtro por livro | Copiar código | Tema |
|---|---|---|---|---|
| anel | um marcador só desliza entre os resultados | uma pílula desliza e se estica | — | pílula entre claro e escuro |
| dígito | "12 resultados" troca como o dígito | a contagem troca | ícone e "Copiado" | sol e lua trocam |
| onda | a busca em andamento | a lista trocando de livro | — | — |
| erro | "Nada para x" entra como a mensagem | filtro sem posts | falha ao copiar | — |
| sucesso | o anel varre os achados | o chip ativo pulsa uma vez | o botão pula 3 a 4px | o botão pula uma vez |

**Outros componentes:**

- **Pílula com rótulo invertido.**
  - Uma segunda camada de rótulos claros é recortada por `clip-path`, junto com a pílula, e o texto
    inverte exatamente sob ela (0,25 s, `cubic-bezier(.22,1,.36,1)`).
  - Serve ao filtro e ao tema (01, 05, 06, 10).
- **Copiar que vira ✓:** as duas folhas viram círculo e o visto se desenha, por quatro animações WAAPI
  de 0,2 s num SVG com máscara. Serve a todos.
- **Menu em giro 3D:** `perspective(600px)`, inclinado a partir do lado do gatilho, com `scale` de .9 a
  1 (0,3 s). Serve aos menus (04, 05, 06).
- **Paleta de comandos:**
  - o diálogo entra com `scale(.96)` e sobe 4px (0,25 s);
  - um chip de contexto sobre o campo ("Livro: Java") e a tecla Esc à direita;
  - entrar num submenu "afunda" o diálogo.
  - Serve ao 06.
- **Leque em arco:** as cartas giram num arco e esmaecem nas pontas. Serve a Categorias com os livros
  grandes (04, 07, 09).
- **Chip de citação que abre um cartão** (fonte, resumo e data, ~0,3 s). Serve às notas laterais e
  referências do artigo (10).
- **Modo "Inspect":** réguas em px sobre o componente. É a ideia das cotas do 03 Planta.

**Evitar:**

- `hue-rotate` e desfoque em laço;
- partículas em canvas;
- animar `grid-template-rows`, `box-shadow` ou `width`;
- som.

## skyscanner.design (Backpack)

É a documentação do design system da Skyscanner, sem animação própria. O valor está no **método**.
Pesquisa parcial: com a pausa, não foram filmados o hover e a busca ao vivo, nem conferida a licença.

1. **Tokens em três camadas**, ligadas por `var()` com reserva:
   - os primitivos (privados);
   - os semânticos, por função;
   - os de componente, só onde há estado.

   O tema escuro redefine os mesmos nomes em `:root[data-theme="dark"]`. Os tokens "sobre escuro" e
   "sobre claro" não mudam com o tema (é o caso dos livros). **Adotar nos 10 modelos** os mesmos
   ~28 nomes semânticos, cada modelo com os seus valores:
   - fundo: padrão e contraste;
   - superfície: padrão, elevada, sutil e destaque;
   - texto: primário, secundário, invertido, desabilitado, erro, sobre escuro e sobre claro;
   - linha: padrão e sutil;
   - acento;
   - véu.
2. **Elevação por camada:** fundo, superfície e elevada. No claro, a elevação vem da sombra; no
   escuro, de uma superfície mais clara. O hover de um card é um `::after` com a sombra grande, por
   `opacity` (0,2 s).
3. **Escala de movimento:**

   | Token | Duração | Uso |
   |---|---|---|
   | xs | 50 ms | |
   | sm | 200 ms | hover, esmaecer e dica |
   | base | 400 ms | painel e véu |

   - Mais distância pede mais tempo. A entrada padrão é de 0,24 s, de `translateY(12px) scale(.98)`.
   - Só três curvas: `(.2,0,0,1)` para entrada, `(.5,0,0,1)` para painel e `(.4,0,.2,1)`.
   - Adotar `--dur-xs/sm/base` e duas curvas com nome em cada modelo.
4. **Movimento reduzido por componente:**
   - cada bloco tem o próprio `@media (prefers-reduced-motion: reduce)`, com o estado final escrito;
   - alguns trocam o movimento por esmaecer (0,2 s);
   - nada de parallax nem de piscar.
5. **Estados enxutos:**
   - Botão: repouso; hover escurece (o pressionado é igual ao hover); carregando mantém a largura;
     desabilitado.
   - Chip do filtro: desligado com borda de 1px; o hover escurece a borda; ligado é preenchido.
   - O hover só vale em aparelho com ponteiro, com `:hover:not(:active)`.
6. **Foco:**
   - um estilo global, `:focus-visible` com contorno de 2px e afastamento de 2px;
   - sobre fundo escuro ou imagem, um anel duplo;
   - alvo mínimo de 24×24px;
   - contraste de 4,5:1 para texto abaixo de 24px e 3:1 para o grande;
   - linha de 45 a 75 caracteres.
7. **Link sublinhado que recolhe no hover:** `background-size` do sublinhado em 0,2 s. Serve aos 01,
   05 e 10.
8. **Escalas curtas com regra de uso:**
   - espaço em degraus de 4px (4, 8, 16, 24, 32, 40, 64, 96);
   - raio "boneca russa" (quem contém tem raio maior);
   - bordas só de 1 e 2px;
   - a entrelinha diminui conforme o corpo cresce.
9. **Âncora do título:** o `#` entra com `translateX(4px → 0)` em 0,1 s e sai em 0,2 s (a saída mais
   lenta que a entrada). O sumário fixo tem um trilho de 1px e a barra do item ativo.

**Evitar:**

- `transition: all` (anima layout sem querer);
- `scroll-behavior: smooth` incondicional;
- visual de produto de viagem.

## animejs.com

A home é uma cena 3D fixa (three.js, CSS3D e 5 canvas) de um "motor" que a rolagem monta e desmonta:

- **Cara:** fundo cinza quente `#252423`, que troca para papel `#dad5d0` nas seções claras; texto
  `#f6f4f2`.
- **Tipografia:** DINish variável (largura 125, 700 a 800, entrelinha .85) e uma mono em caixa alta na
  interface.
- **Detalhes:** filetes de 1px, cantos de .125 a .75rem, sem sombra.
- **Cor:** 17 matizes em 8 passos, com o passo 1 vivo e os passos 6 a 8 quase fundo.
- É o anime.js 4.5.0 em produção.

**A abertura, filmada** (ms depois de a página ficar pronta):

| ms | O que acontece |
|---|---|
| 0 a 650 | 193 marcas de 1×10px desenham um anel no sentido horário, e cada uma acende e cai a .4 como cometa: `stagger([0,500], {ease:'outIn(2)'})` |
| 0 a 4000 | o fundo vai do preto ao cinza |
| 680 a 1750 | 6 arcos coloridos piscam, com atrasos aleatórios |
| 1150 a 3000 | uma grade de 13×13 pontos cresce do centro: `scale [0,4,1]` com `stagger(100, {grid, from:'center'})` |
| 1870 | o título entra letra por letra: `x ['.35em',0]`, 1 s, `outQuint`, `stagger(25)` |
| 2530 | o subtítulo por palavras e o cabeçalho, por último |

- **O truque central:** uma timeline mestra de 3 s toca em 4 s por um objeto-proxy (`animate(proxy,
  {currentTime:[…], onUpdate: () => tl.seek(…)})`).
- Depois, **a mesma timeline passa para a rolagem** (`autoplay: onScroll({sync:.9})`). Se o leitor
  rolar cedo, a rolagem assume.
- A rolagem é a nativa, nunca sequestrada.

**Ideias:**

1. **Abertura em "montagem" para o 04:** anel de marcas, arcos nas cores dos livros, grade de pontos
   do centro, o título por letra e o cabeçalho por último, numa timeline só. Com ~60 marcas, fica leve.
2. **Timeline mestra com proxy entregue à rolagem** (04, 05, 07).
3. **Cor por atributo do link, sem JS:** `a[href*="/categories/Dados"] { --cor-1..8: … }`, e o link
   herda a escala do livro. Os passos claros viram fundo de hover e de chip.
4. **Hover assimétrico** (todos): entra na hora (`transition-duration: 0s` no `:hover`) e sai em .1 a
   .5 s; a seta do link anda .125rem em .125 s.
5. **Barra-guia do artigo** (04, 06, 03):
   - um cartão fixo no canto, com uma régua de 65 marcas e um cursor que se arrasta
     (`createDraggable`);
   - um cursor-fantasma segue o mouse (`createAnimatable` e `utils.snap(1/65)`);
   - o clique salta para aquele ponto do texto.
6. **Texto dividido** com `splitText(h, {words:{wrap:'clip'}, chars:{wrap:'clip'}})` e `y ['75%','0%']`.
   No hover de um link, `clone:'bottom'` e `y '-100%'` fazem o texto "rolar".
7. **Grade que entra do centro:** `stagger(x, {grid: true, from: 'center'})`, que lê as posições reais
   e serve a uma grade responsiva de livros (04, 07).
8. **Arrastar com mola** (stiffness 120, damping 6, `containerFriction .5`): puxar um livro e soltar
   com encaixe (04).
9. **Demo que entra com mola e pausa fora da tela** (`onEnter` / `onLeave`). Bom para as lousas.
10. **Cotas que se desenham na rolagem** (`svg.createDrawable`, `draw ['0 0','0 1']`, 0,25 s, stagger
    10) sobre um desenho em contorno no papel claro (03).
11. **Troca de fundo por seção**, com `onScroll` e `enter/leave` (02, 03).

**A API do v4.5** (conferida na documentação; importar de `animejs` ou dos subcaminhos):

| Função | O que faz |
|---|---|
| `animate` | anima alvos; `waapi.animate` é a versão de 3 KB que roda no compositor |
| `createTimeline().label().add(alvo, params, pos)` | sequência; `pos` aceita `'<'`, `'<<'`, `'+=100'` e `'<<+=250'` |
| `stagger(v, {from, grid, axis, ease, reversed})` | atrasos em cascata |
| `createDraggable` | arrastar, com `snap`, `container`, `containerFriction`, `onSettle`… |
| `onScroll({target, enter, leave, sync, onEnter, onLeave})` | liga à rolagem |
| `splitText(alvo, {lines, words, chars, accessible})` | divide o texto; há também `scrambleText()` |
| `svg.createDrawable`, `svg.morphTo`, `svg.createMotionPath` | traço, morph e trajeto em SVG |
| `createAnimatable(alvo, {x: 500})` | seguir o cursor sem recriar animações |
| `createScope({mediaQueries: {reduce: '(prefers-reduced-motion)'}})` | escopo com o movimento reduzido |

- A mola da documentação 4.5 é `spring({bounce, duration})` ou `spring({mass, stiffness, damping})`.
  O `createSpring` da home pode ser um nome antigo: conferir no pacote.
- A curva padrão é `out(2)`, 1 s.

**Evitar:**

- a cena WebGL inteira (~1 MB de JS, 1.548 nós, canvas redesenhados a cada quadro, rAF que nunca
  para);
- o `createLayout`, que anima `width` e `height`;
- 4 s de abertura atrasando a leitura;
- `outline: none`.

## fontshare.com

É o catálogo da ITF: 64 famílias próprias (licença ITF FFL) e 36 OFL (cópias de fontes do Google). Nas
64 da ITF, o único eixo variável é o peso. Todas as propostas abaixo foram testadas no testador do
site com texto em português (acentos e aspas corretos).

| Modelo | Título | Texto do artigo | Apoio e código |
|---|---|---|---|
| 01 Grade | Switzer 600 a 800 (variável 100 a 900) | Switzer 400 | Tabular |
| 02 Noturno | Zodiak 300 a 500 e itálico | Sentient (variável 200 a 700, com itálico) | JetBrains Mono |
| 03 Planta | Supreme (construída, traço uniforme) | Bespoke Sans ou Synonym | Tabular nas cotas e no carimbo |
| 04 Cinético | Excon (variável 100 a 900) | Author (200 a 700, com itálico) | Tabular |
| 05 Revista | Boska (Didone, 200 a 900) ou Melodrama | Gambetta (300 a 700, em 19 a 20px) | Synonym nas legendas |
| 06 Terminal | Tabular (mono sem serifa, 300 a 700, com itálico) | Bespoke Sans ou Rowan | RX100 (mono condensada) nos rótulos |
| 07 Galeria | Erode itálico (300 a 700) | Bespoke Serif (300 a 800) | Switzer ou Supreme nas etiquetas |
| 08 Tipo Vivo | Fontsource multieixo (Anybody, Bricolage Grotesque, Fraunces ou Recursive) e/ou Cabinet Grotesk | Literata (já instalada, com `opsz`) | JetBrains Mono |
| 09 Biblioteca | Zodiak ou Aktura na placa | Rowan (300 a 700, cerca de 10% maior) | Tabular nas fichas |
| 10 Índice | Recia (300 a 700) em tudo | Recia | numerais `tnum`, `onum` e zero cortado |

- **Batidas, evitar como fonte principal:** Satoshi, General Sans, Clash Display, Cabinet Grotesk e
  Chillax.
- As fontes do Fontshare têm um mestre só, sem `opsz`. Para texto pequeno, a Literata e a Newsreader
  (Fontsource) são melhores.
- **Licença (ITF FFL v2.0, 17/08/2026):**
  - pode servir pelo próprio servidor, em uso comercial ("You may self-host…");
  - **proíbe subsetar, converter ou renomear:** use os `.woff2` oficiais como vêm;
  - **proíbe redistribuir por repositório público:** commitar os `.woff2` num repositório público é
    zona cinzenta (pergunta aberta para o Cesar, em "Onde paramos" do README);
  - o botão "Proceed" do site é o aceite da licença e não foi clicado.
- **Como baixar:**
  - CSS: `https://api.fontshare.com/v2/css?f[]=<slug>@<estilos>&display=swap`, em que `1` é a variável
    e `2` a variável itálica; nas estáticas, o peso, e o itálico é o peso + 1 (401);
  - o catálogo em JSON (`/v2/fonts?limit=100`) traz os eixos e os arquivos;
  - slugs: `switzer`, `zodiak`, `boska`, `sentient`, `gambetta`, `bespoke-serif`, `bespoke-sans`,
    `rowan`, `recia`, `erode`, `neco`, `author`, `synonym`, `supreme`, `tabular`, `excon`,
    `cabinet-grotesk`, `melodrama`, `aktura`, `rx-100`.
- **Interações do site que servem:**
  - no hover do card, o contorno passa a tinta sólida (um `::after` de 0 a 1) e os controles
    aparecem, em 0,15 s, só com opacidade e cor (01, 03, 10);
  - o menu abre numa camada preta sob o cabeçalho, com os links enormes;
  - a barra de filtros fica fixa e compacta ao rolar;
  - um controle de peso e tamanho com o número ao lado (08, 06).

## hugeicons.com

**A URL pedida não tem ícones animados:** é a *categoria* "Animation" (ícones sobre animação), com
imagens WebP estáticas. Não há filme de ícone animando.

- **Licença:**
  - o estilo grátis (Stroke Rounded, mais de 6.000 ícones) é MIT, no pacote
    `@hugeicons/core-free-icons` (sem dependências);
  - pode copiar o SVG e pôr inline, com o aviso MIT num arquivo de créditos;
  - os outros 9 estilos são Pro, e não podem ir para repositório público;
  - instalar o pacote pede o OK do Cesar; a alternativa é copiar os ~20 caminhos.
- **Ícones de que o blog precisa** (nomes do pacote grátis, ~7 KB juntos): `search-01`, `sun-03`,
  `moon-02`, `menu-01`, `cancel-01`, `arrow-right-01`, `arrow-down-01`, `arrow-up-right-01`, `copy-01`,
  `tick-02`, `link-01`, `rss`, `github`, `linkedin-01`, `tag-01`, `book-01`, `clock-01`,
  `calendar-01`, `source-code` e `filter`.
- **Um conjunto, dez caras só por CSS** (os traços são `currentColor`):

  | Modelo | Como o traço fica |
  |---|---|
  | 01 e 06 | traço 2 com ponta quadrada |
  | 03 | traço 1 tracejado |
  | 02 | camada suave por opacidade |
  | 04 | preenchimento na cor do livro |
  | 05, 07 e 10 | traço de 1 a 1,25 |
  | 08 | a espessura do traço acompanha o peso da fonte |

- **Gestos de hover** (~0,28 s, `cubic-bezier(.2,.8,.2,1)`, só no compositor):

  | Ícone | Gesto |
  |---|---|
  | seta | anda 3px |
  | link externo | anda na diagonal |
  | chevron | gira 180° |
  | tag | balança -16° pelo furo (17,5; 6,5), com mola |
  | código | os colchetes se afastam 1,5px |
  | elo | as argolas se afastam 1px |
  | relógio | o ponteiro dá uma volta em 0,8 s |
  | RSS | os arcos acendem em sequência (90 ms) |

- **Sol e lua:** dois grupos com `rotate(±80deg) scale(.4)` e opacidade, com a origem em 12px 12px.
- **Copiar → visto:** o visto com `pathLength="1"` e o `stroke-dashoffset` de 1 a 0 (~0,35 s). Com a
  ponta redonda, esconder por opacidade até o traço começar.
- **Menu → fechar:** as linhas de cima e de baixo giram ±45° e andam ±7px, e a do meio encolhe e some.
- **Ícone que se desenha ao entrar:** `pathLength="1"`, ~0,9 s, com atraso por caminho (03, 05).
- **Evitar:**
  - pop-up que empurra o layout;
  - tema escuro por `filter: invert` em imagens;
  - foco sem desenho próprio.

## uiable.com

É uma loja de componentes React: os grátis são MIT e os Pro, proprietários. Não há abertura nem troca
de página (a troca mostra só esqueletos piscando).

1. **Tema em círculo a partir do clique:**
   - `startViewTransition` e `documentElement.animate({clipPath: ['circle(0 at X Y)', 'circle(R at X Y)']},
     {duration: 500, pseudoElement: '::view-transition-new(root)'})`;
   - R é a distância até o canto mais longe.
2. **Card com seta e elevação:** no hover, o card sobe 2px, a borda vai a 40% do acento, a sombra
   entra por um pseudo-elemento com opacidade e uma seta entra de -4px (0,3 s, `(.4,0,.2,1)`).
   Serve aos 01, 05 e 10.
3. **Cursor com rótulo por contexto** (Pro):
   - um ponto de 12px segue o mouse e, sobre `data-cursor-context`, vira uma pílula com ícone e texto
     ("Ler", "Abrir livro", "Arrastar");
   - mantendo o cursor nativo, com `scale`, não `width`;
   - serve aos 02, 04, 07 e 10.
4. **Cursor magnético** (Pro): um anel segue com mola e, sobre um link, vira o retângulo do alvo com
   uma folga de 20px. Serve aos 03 (mira ou cota) e 06.
5. **Pílula que desliza nas abas,** com mola leve (passa ~5px e volta, ~0,35 s); o ícone sobe 2px.
   Serve ao filtro por livro (01, 04, 06).
6. **Paleta ⌘K:** véu, painel compacto, grupos com título, setas e Esc (0,1 a 0,15 s). Serve aos 06,
   02 e 01.
7. **Preenchimento que varre o botão:** um `scaleX(0 → 1)` a partir da esquerda (0,3 s), com o rótulo
   andando 4px.
8. **Esmaecer das pontas de rolagem sem JS:**
   - uma `mask-image` com as pontas animadas por `animation-timeline: scroll(self inline)`;
   - a ponta só aparece quando há o que rolar;
   - serve às fileiras de livros e tags no celular, ao código e ao sumário (todos).
9. **Card de livro que inclina em 3D seguindo o mouse** (07, 09).
10. **Foco em dois anéis:** borda de 1px na cor do anel e um halo de 3px a 50%.
11. **Cruzes "+" nos cantos das seções e linhas verticais** servem ao 03 e ao 01.

**Evitar:**

- o visual de "SaaS shadcn" (Inter, azul, cards brancos);
- a borda de gradiente girando;
- faíscas de cursor;
- faixa corrida o tempo todo (180 rAF/s com a página parada);
- `cursor: none` sem alternativa;
- `outline: none`;
- hex solto.

## ui.soralabs.studio

É um registro de componentes React animados para "copiar e colar" (com Motion, GSAP e Tailwind). O
código dos componentes não carregou, então as técnicas vêm da documentação e da medição no DOM.

1. **Troca de página inclinada e deslizante** (View Transitions, só CSS, filmada):
   - a página que sai encolhe a 80%, escurece, inclina -10°, desce 20% e vai para a esquerda;
   - a nova entra 0,25 s depois, por um `clip-path: polygon` que parte do canto de baixo à direita,
     com `translate(100%, 20%) → 0`;
   - o cabeçalho fica parado, com nome próprio;
   - lá dura 1,6 s; num blog, 0,7 a 0,9 s;
   - serve aos 05, 07 e 01.
2. **Uma pílula só que desliza entre os itens** (~0,3 s, mola), também com o foco do teclado. Serve
   ao menu, ao filtro, a Categorias e à busca.
3. **Sublinhado desenhado à mão:** um SVG se traça no hover e se apaga ao sair; com movimento
   reduzido, fica parado. Só nos links do texto (05, 10).
4. **Rótulo que segue o cursor:** uma pílula ("ler") surge sobre o alvo com um estouro elástico e um
   giro, e assenta reta em ~0,7 s. Só com ponteiro fino, `aria-hidden` (07, 10).
5. **Letra por letra no hover:** 0,5 s, `cubic-bezier(.165,.84,.44,1)`, 10 ms por índice (as letras
   divididas no build, sem JS). No máximo um ou dois por tela (01, 06, 08).
6. **Foco numa linha, o resto esmaece:** com `:has()`, só com opacidade em lista longa. Serve às
   listas de posts.
7. **Mola sem JS:** o Motion converte a mola em `linear(…)`. O acordeão mede 0,4 s com
   `cubic-bezier(.16,1,.3,1)`.
8. **Revelação por máscara:** as linhas do título sobem de trás de `overflow: hidden`, uma vez (01,
   05).
9. **Cortina "dither" 1-bit em WebGL** (a troca de página do próprio site). Fica só como inspiração
   para 02 e 06, imitada com `mask` em `steps()`.
10. **Desfoque progressivo sob o cabeçalho fixo:** 4 a 6 camadas de `backdrop-filter` com máscara. É
    caro.
11. **Card que inclina com brilho:** só em poucos cards, como os livros de Categorias.

**Evitar:**

- efeitos de vitrine (partículas, neblina, carrossel de logos);
- texto que aparece por palavra com desfoque em toda seção;
- WebGL;
- as vitrines deles que ignoram o movimento reduzido.
