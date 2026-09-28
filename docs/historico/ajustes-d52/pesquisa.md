# Pesquisa da D52 (GSAP e outras referências)

Agente de Pesquisa, 27/09/2026. Pedido do Cesar: usar o showcase do GSAP e outras referências (animação,
desenho, desempenho) para não reinventar a roda e ter ideias antes de decidir. Este arquivo tem o que
foi visto, com a fonte, e **recomendações curtas por item**. As propostas visuais estão em HTML:

- [sugestoes/c04-caneta.html](sugestoes/c04-caneta.html): a caneta como identidade (C04), com o
  "carregando" do B14 no fim;
- [sugestoes/c05-papelaria.html](sugestoes/c05-papelaria.html): a papelaria de estudo (C05), com a cola
  dos atalhos do B06.

Para abrir as duas: servir a **raiz do projeto** (as fontes vêm do `node_modules`):
`python3 -m http.server 8791 --bind 127.0.0.1` e abrir
`http://127.0.0.1:8791/docs/historico/ajustes-d52/sugestoes/c04-caneta.html`. Conferidas em 320, 390, 1280 e
1440px, nos dois temas, sem rolagem lateral e sem erro no console. Os traços saem das mesmas funções
de `src/lib/traco.ts` (copiadas na página), com a mesma semente por texto.

## 1. O que foi visto

### GSAP (o que o projeto já tem)

- **Tudo gratuito desde a 3.13** (30/04/2025, depois da compra pela Webflow): SplitText, MorphSVG,
  DrawSVG, Flip, CustomEase, CustomBounce, CustomWiggle, MotionPath, Physics2D, Inertia etc. entraram
  no pacote `gsap` do npm. O projeto já usa o **3.15.0**, com todos em `node_modules/gsap/dist`. A
  licença ("Standard No Charge") permite uso em qualquer site; só proíbe ferramentas que concorram com
  a Webflow. (Fontes 1, 2.)
- **Showcase** (gsap.com/showcase): quase tudo é portfólio de agência (A24, Illoca, Unseen, Revelatio),
  com ScrollTrigger, SplitText e WebGL pesados. Serve de **técnica**, não de tom: o tom do blog ("calmo,
  artesanal, preciso") não está lá. Os mais próximos do tema: **Codapress Publishing** (editora técnica;
  listada com DrawSVG, Draggable e Inertia), **What if Orwell had a website** (DrawSVG e SplitText) e
  **Infinite Digital Scrapbook** (Observer, metáfora de álbum). O Demo Hub tem um **Card stack**. (3, 4.)
- **DrawSVG**: o valor descreve o **estado final** ("0% 100%" = traço inteiro); anima
  `stroke-dasharray`/`stroke-dashoffset`; `"live"` recalcula em tela que muda; no Firefox o traço pode
  parar um nada antes (usar 102%); `<rect>` erra no Safari do iOS (usar `<path>`); não afeta `<use>`.
  (5.)
- **Flip**: `getState` → mudar o DOM → `Flip.from`; opções `absolute`, `nested`, `scale`, `fade`,
  `onEnter`/`onLeave`, `Flip.fit`; **não faz 3D**. (6.)
- **CustomEase / CustomBounce / CustomWiggle**: curva por caminho SVG; `CustomBounce.create(id,
  { strength, squash, endAtStart })` gera o quique e o achatamento; criar as curvas uma vez, no início.
  (7, 8.)
- **MotionPath**: `path` (pontos), `curviness` (1), `autoRotate`, `alignOrigin`: dá o **arco** que um
  objeto jogado faz, sem montar a curva à mão. (9.)
- **O salto no fim de um tween**: com `force3D: "auto"` (o padrão), o GSAP anima em `translate3d` e, no
  último quadro, **volta para 2D** para liberar a GPU; a troca de camada dá um salto de 1px ou muda o
  serrilhado. `force3D: true` evita; `expo.out` tem a cauda em subpixel e parece "assentar tremendo".
  (10.)

### View Transitions (a troca de página por folhas)

- `pageswap` e `pagereveal` precisam estar num script clássico do `<head>` (o `troca.js` já está);
  tipos por `vt.types`; **o Chrome pula a transição se a navegação passar de 4s**; `blocking="render"`
  só medindo o custo. (11.)
- **Ordem de pintura dos grupos**: primeiro os nomes que existiam na página antiga, na ordem dela;
  depois os que só existem na nova. O grupo `root` (a página nova ao vivo) é o primeiro, então **tudo o
  que tem nome na página antiga (`sai-N`) é pintado por cima da página nova**. Muda-se com `z-index`
  nos `::view-transition-group`, e `view-transition-class` permite mirar vários de uma vez. (12.)

### Movimento (princípios com número)

- **Material, "fade through"**: a saída some **antes** e a entrada chega depois, crescendo de 92% para
  100%; a divisão é de uns 30% do tempo para a saída e 70% para a entrada, com um instante em que os
  dois estão fracos, para não dar "visão dupla". (13.)
- **Emil Kowalski**: `ease-out` para entrar e sair; menos de 300 ms na interface; **não animar ação
  disparada pelo teclado** (repetida, a animação fica lenta). Interromper deve ser possível. (14.)
- **Molas** (Josh Comeau): o amortecimento crítico chega sem oscilar ("buttery"); a mola pouco
  amortecida quica. Para "pousar sem tremer", amortecimento crítico ou um quique só. (15.)
- **Tempo de resposta** (Nielsen): até 0,1s parece instantâneo, até 1s não precisa de aviso, acima de
  1s pede sinal de que está trabalhando. Convenção comum: só mostrar o indicador depois de 300 a 600
  ms e, uma vez mostrado, manter por um mínimo, para não piscar. (16, 17.)

### Desempenho

- **Speculation Rules** (Chrome/Edge): `prefetch` e `prerender` por regras JSON no HTML, sem
  biblioteca; `eagerness` `moderate` = 200 ms de mouse em cima ou o toque; no máximo 2 especulações
  por interação (a mais velha sai); desligado com economia de dados, bateria fraca ou pouca memória.
  `document.prerendering` e `prerenderingchange` para adiar o que não deve rodar escondido. Funciona com
  as View Transitions. (18.)
- **Astro**: `prefetch` (padrão `hover`) e o `experimental.clientPrerender`, que troca o prefetch por
  Speculation Rules. O prefetch do Astro injeta um script em toda página. (19.)
- **Adaptação ao aparelho**: `navigator.deviceMemory`, `hardwareConcurrency`,
  `connection.effectiveType` e `saveData` (web.dev, 2019); são sinais fracos (núcleos não dizem
  velocidade; só Chromium). Melhor **medir**: a **Long Animation Frames API** (Chrome 123+) diz quais
  quadros passaram de 50 ms e quanto a tela ficou presa (`blockingDuration`). (20, 21.)

### Desenho à mão

- **Rough Notation** (a referência das "marcações animadas"): sublinhado, caixa, círculo, marca-texto,
  riscado, colchetes; 800 ms e **2 passadas** por padrão; grupo que anima em ordem. Usa Rough.js (o site
  não usa; D35). Vale a ideia das **duas passadas levemente diferentes** para um traço parecer de caneta.
  (22.)
- **perfect-freehand** (Steve Ruiz, o do tldraw): o traço vira um **contorno preenchido** com a
  largura variando pela pressão/velocidade e as pontas afinando. É o que dá cara de caneta de verdade
  num traço grande.
- **Animar traço de largura variável**: o contorno preenchido não se "desenha" com dash; a técnica é
  uma **máscara** com um traço grosso pelo meio, animado com DrawSVG ou `stroke-dashoffset`. O
  `clip-path` não serve (usa o preenchimento, ignora o traço). (23, 24.)

### Marcas e papelaria

- **GitHub** proíbe modificar o logo (cor, forma, combinação) e aceita o preto; **LinkedIn** idem para o
  [in], com as variantes de cor fornecidas. Os ícones de hoje (`src/lib/icones.ts`) são os contornos do
  Lucide, não os oficiais. (25, 26.)
- **NN/g sobre skeuomorfismo**: a metáfora física ajuda quando explica o uso; textura e realismo só de
  enfeite pesam e envelhecem. Tognazzini: usar do objeto real o que é útil e deixar os defeitos. (27.)
- **Stripe Press** (livros como objetos, cada um com identidade na mesma coleção) e o **jardim** de
  Maggie Appleton (notas com estágios, ilustração à mão) confirmam a direção do blog: o objeto vale
  pela organização que ele dá, não pelo enfeite. (28, 29.)

## 2. Recomendações por item

### A02 · Cartões novos aparecem antes de os antigos sumirem

O que o `troca.js` faz hoje: as folhas novas começam em 0,2s (85 ms entre elas); as antigas caem por
480 ms (cascata de até 160 ms) e só somem entre 180 e 380 ms. E, pela ordem de pintura das View
Transitions, **as antigas (`sai-N`, com nome) ficam por cima da página nova**: por uns 300 ms, os
cartões novos nascem *embaixo* dos velhos que caem. É isso que se vê.

1. **Saída antes da entrada** ("fade through"): as antigas saem em 320 a 360 ms, com aceleração
   (`cubic-bezier(.5,0,.75,0)`), a opacidade indo a zero entre 60 e 240 ms, cascata de no máximo
   100 ms. As novas começam **só quando a última antiga passou de 60% do caminho** (na prática, t0 de
   0,26 a 0,3s em vez de 0,2s). A troca continua perto de 1,3s.
2. Se quiser manter um pouco de sobreposição (continuidade), **nomear as folhas que chegam**
   (`chega-N`, classe `chega`) e subir o grupo delas (`::view-transition-group(*.chega) { z-index: 2 }`):
   aí as novas passam por cima das que caem, nunca por baixo. Mais trabalho; a opção 1 resolve.
3. Na tag (desfile de 60 ms), a mesma regra: calcular o t0 pelo fim da saída, não fixo.
4. Conferir quadro a quadro (memória "animacao-quadro-a-quadro"): nenhum quadro com cartão novo e
   cartão velho visíveis no mesmo lugar.

### A03 · Artigo → próximo deixa um pedaço da folha antiga

A folha antiga (rolada para baixo) cobre do cabeçalho até o fim da tela; a nova chega com a página no
topo, uns 30 px abaixo do cabeçalho, e a antiga só some entre 600 e 800 ms. Nesse tempo, a faixa entre
o cabeçalho e a folha nova mostra a antiga.

1. **A folha de baixo cede enquanto a nova é pousada**: desde o início, a antiga desce 10 px, encolhe
   para 98,5% e some entre 150 e 520 ms, antes de a nova pousar (700 ms). Parece a folha de baixo sendo
   empurrada, e não sobra nada.
2. Alternativa mais exata: recortar a antiga para o retângulo final da nova (`clip-path: inset(<topo da
   nova>px 0 0 0)` no `::view-transition-old(artigo-velho)`), crescendo nos primeiros 250 ms.
3. O "voltar" funciona porque a antiga sai da frente; o "avançar" precisa da mesma garantia: **no
   instante em que a nova pousa, a antiga já é zero**.

### B06 · Painel de atalhos

1. Manter o **popover** de hoje (fecha com Esc e clique fora, fica na camada de cima).
2. **Tela grande**: a cola **nasce do próprio "Atalhos ?"**, como a busca nasce do campo (D44):
   ancorada ao botão (CSS anchor positioning, Baseline desde janeiro de 2026 com o Firefox 147 e o
   Safari 26; com `@supports (anchor-name: --a)` e, sem suporte, posição calculada por
   `getBoundingClientRect`), abrindo para a direita e cobrindo só a borda do texto, **sem véu**.
   Entrada em 0,16 a 0,18s (sobe 6 a 8 px, de 97% a 100%, origem no canto do botão), saída em 0,12s.
   É ação de teclado: rápida (Emil).
3. **Abaixo de 1300px** (sem a lateral): a mesma cola no canto de baixo à esquerda.
4. **Celular/tablet**: centrada, com `::backdrop` no `--veu` a uns 40% (popover tem backdrop), de 96%
   a 100% em 0,2s; tocar no véu fecha. Num celular sem teclado os atalhos não servem: manter o botão só
   com `(hover: hover) and (pointer: fine)`.
5. Conteúdo: juntar **⌘K Buscar** à lista (o "?" deixa de abrir a busca, então a cola é onde se
   aprende o ⌘K). Foco: aberta pelo teclado, o foco vai para a cola (título com `tabindex="-1"`) e volta
   ao botão ao fechar.
6. Visual: a cola como **ficha pautada** (C05). Ver `c05-papelaria.html`, "B06: a cola dos atalhos".

### B09 (e B01) · Guardar um livro na pilha e puxar outro

1. **Um dono por propriedade**: uma timeline só; nenhuma `transition` de CSS no mesmo elemento que o
   GSAP anima (as duas brigam e o fim treme); `overwrite: "auto"` nos tweens do mouse.
2. **O tremor do fim** costuma ser um destes, na ordem de probabilidade:
   - a **passagem para a View Transition** com o livro num subpixel diferente do lugar final (o
     instantâneo e o elemento real não batem): arredondar o fim para pixels inteiros (`snap: "x,y"`)
     e animar **para zero a partir do deslocamento** (Flip.from), não para uma posição medida;
   - o **`force3D: "auto"`** voltando para 2D no último quadro: usar `force3D: true` nos tweens do livro
     e limpar com `clearProps` no mesmo quadro em que a página troca;
   - o **baque de 1 px** sobreposto ao início da VT: terminar o baque antes;
   - cauda de `expo.out`: trocar por `power3.out`.
3. **Realismo**:
   - *guardar*: arco (x com `power2.inOut`, y subindo com `sine.out` e descendo com `power2.in`, ou
     MotionPath com `curviness` perto de 1); o giro **atrasa** 10 a 15% e termina 5 a 10% depois da
     posição (continuidade); pouso por gravidade e **um** quique de até 1,5 px (CustomBounce com
     `strength` 0,15 a 0,2); a pilha embaixo afunda 0,5 a 1 px e volta em 80 ms (é o que vende o peso);
   - *puxar*: atrito estático, 60 a 80 ms "presos" andando 1 a 2 px, depois desliza (`power2.in`); o
     tombo do bloco de cima já existe e está certo;
   - *pôr em pé*: girar 90° **pela quina de apoio** (`transformOrigin` na aresta que toca a mesa),
     0,35 a 0,45s `power2.inOut`, passando 1 a 1,5° e voltando sem oscilar (CustomEase com um
     "overshoot" só; amortecimento crítico);
   - começar a puxar quando o guardado está 80% pousado (150 ms de sobreposição): fluido, não em fila.
4. Só `transform`/`opacity`; `will-change` só nos dois livros, só durante; sombra como elemento
   separado, por opacidade.

### B14 · Rede e CPU lentas

1. **Buscar antes**: Speculation Rules no `<head>` (JSON, não é JavaScript nem biblioteca):
   `prefetch` com `eagerness: "moderate"` para os links internos, fora `/rss.xml`, `/og/*` e PDFs.
   Tira a espera da rede do clique no Chrome e no Edge; os outros ignoram. Preferir isso ao `prefetch`
   do Astro, que põe um script em toda página. **Prerender, não agora**: roda os scripts da página
   escondida (abertura, estante em repouso, GSAP ocioso) e exigiria `document.prerendering` em cada um.
2. **"Carregando" à caneta**: se a navegação não trocar a página em **400 ms**, a caneta preta rabisca
   sobre o fio do cabeçalho (onde a caneta da leitura já corre, D45) até o `pageswap`; fica pelo menos
   **300 ms**; um limite de segurança desliga. Começa no clique de link interno (ou no evento
   `navigate` da Navigation API). Com movimento reduzido, um traço parado. Sem spinner. Demonstração no
   fim de `c04-caneta.html`.
3. **CPU**: medir em vez de adivinhar. Observar `long-animation-frame` nas primeiras trocas; com dois
   quadros de `blockingDuration` acima de 100 ms, gravar `cs-leve` na sessão e, dali em diante, usar a
   troca simples (a folha que sobe 18 px), sem 3D, sem máscara nos textos, sem a estante em repouso.
   Os sinais do aparelho (`deviceMemory` ≤ 4, `saveData`) podem ligar o modo leve já na entrada.
4. Adiar o que não é da chegada: GSAP ocioso, contadores e estante viva só depois do `cs:chegou` e de
   um `requestIdleCallback`.
5. `content-visibility: auto` com `contain-intrinsic-size` nas listas longas (arquivo, tags) e nas
   seções do artigo abaixo da dobra.
6. Não usar `blocking="render"`; o Chrome já pula a troca acima de 4s.

### C04 · A caneta como identidade

Regra proposta: **a caneta preta desenha; a azul marca.** O preto (`--ink`) é o traço de quem
desenhou a página (ícones, assinatura, fumaça, o rascunho do mouse); o azul-tinta segue como estado e
navegação (D49) e o azul de caneta, nas marcações do texto (D48).

| Onde | Proposta | Por quê |
| --- | --- | --- |
| Menu | Seção atual segue azul; o traço leve do **hover passa a preto** (55%) | A presença mais frequente do preto, sem mudar comportamento |
| GitHub e LinkedIn | **Marcas oficiais em preto**; a caneta fica no círculo azul do hover (D49) | As duas marcas proíbem redesenhar; ambas aceitam preto |
| Tema | Contorno do botão como círculo à mão (a 32%); lua e sol à caneta; a animação da D49 continua | O botão é o ícone mais visto depois do menu |
| Busca | Lupa à caneta, **pílula mantida** (a variação "linha de caderno" deixa o campo menos óbvio) | Identidade sem perder o "isto é um campo" |
| Data e tempo de leitura | Calendário com argolas e relógio à caneta, na tinta 2, **parados** | Aparecem dezenas de vezes por tela: nada anima em lista |
| "Cesar Schutz" da home | **Assinatura**: um traço de largura variável sob o sobrenome, escrito uma vez no fim da abertura | O único traço grande do site; identidade, não enfeite |
| Marca "cs" | O livro não se risca; opcional: traço curto sob o "blog" no hover | A marca já tem o gesto dela (D33) |
| Caneca (série Java) | No hover, a fumaça sobe e some pelo alto e a nova se escreve de baixo, uma vez | A caneca já é desenho de caneta |
| Rodapé, texto, botões cheios, tags, livros, código | **Nada** | Pedido do Cesar e excesso: o traço perde força se estiver em tudo |

Como fazer bem feito:

1. **Uma fonte de traço só**: cada desenho novo é uma função em `src/lib/traco.ts` (semente pelo texto,
   Catmull-Rom, sem filtro), gerada no build; nada de SVG solto.
2. **Tremor pelo tamanho**: em ícone de 16 a 22 px, até 0,4 unidade numa caixa de 24 (mais que isso lê
   como borrão); na assinatura, até 1,5. Espessura: ícones 1,6 a 1,7; menu 2,2 (atual) e 1,4
   (rascunho).
3. **Largura variável só no traço grande** (assinatura): contorno preenchido (a técnica do
   perfect-freehand) revelado por **máscara** com traço grosso animado por DrawSVG. No site, sem `id`
   fixo (máscara em CSS ou id gerado).
4. **Traço esticado** (`preserveAspectRatio="none"` + `non-scaling-stroke`): revelar por `clip-path`,
   como o menu já faz; o dash muda com a escala. Traço em caixa fixa: `pathLength="1"` e
   `stroke-dasharray: 1 2` (o vão maior evita o ponto da ponta redonda, como o círculo da D49).
5. DrawSVG só onde há sequência (tema, assinatura); o resto em CSS.
6. **Movimento reduzido**: todo traço aparece pronto; a fumaça fica parada.

### C05 · Papelaria de estudo

**Quatro objetos, um lugar cada**, e cada um com função (NN/g: metáfora que explica, não enfeite):

| Objeto | Onde | O que diz |
| --- | --- | --- |
| **Post-it** (caneta azul) | "Neste artigo", na lateral (≥ 1300px) | Onde estou, o que já li |
| **Ficha pautada com clipe** (caneta preta) | O painel do livro, embaixo do post-it | De que livro é: a ficha do volume, com a capa presa pelo clipe; dados datilografados em JetBrains Mono |
| **A cola** (outra ficha) | Atalhos do teclado (B06) | O cartão de consulta que se puxa quando precisa |
| **Carimbo** "conferidas em <data>" | Ao lado de "Fontes", no fim do artigo | O rigor com fontes, à vista; tinta de almofada (cor de Nota), sem animação |
| Abas de fichário (opcional) | "Todos os artigos", junto do B07 | Os anos como divisórias: navegar por ano |

Detalhes que fazem ficar profissional:

- **Só o post-it gira** (0,7°) e só a borda de baixo dele levanta; fichas, folhas e cards ficam retos.
- **À mão, só os títulos curtos** ("Neste artigo", "Do livro", "Atalhos do teclado"), o visto e o
  sublinhado da seção atual. Itens, datas e corpo seguem em IBM Plex e Literata. Isso **estende a
  Caveat** para fora das notas dos artigos (D48): precisa do OK do Cesar.
- **Um amarelo só**, o do marca-texto (novo token `--post-it`: 42% do `--marca-texto` sobre a folha no
  claro; 11% no escuro, um papel âmbar apagado). Pauta azul e cabeçalho vermelho das fichas por tokens
  (`--pauta`, `--pauta-cabeca`), com a pauta acompanhando as linhas do texto.
- **No celular**, o sumário que desce do cabeçalho continua folha: o post-it é da lateral.
- A "máquina de escrever" entra só como a mono datilografada da ficha, sem fonte nova e sem efeito de
  digitação.

**Não fazer**: textura de papel ou madeira; letra de mão em itens ou texto; tudo torto; post-its de
várias cores; fita adesiva, alfinete, mancha de café, papel rasgado; efeito de máquina digitando;
quadriculado de fundo; envelope no RSS (RSS não é e-mail; e o rodapé fica de fora).

## 3. Para o Cesar decidir

1. **GitHub e LinkedIn**: marcas oficiais em preto (recomendado; seguem as regras das duas) ou os
   desenhos à mão que ele pediu (contrariam as regras de marca; risco baixo num blog pessoal).
2. **Caveat fora das notas** (C05): os três títulos à mão estendem a D48.
3. **Assinatura sob "Schutz"** e o **traço no "blog" da marca** (C04): a assinatura é a peça mais
   forte da proposta; o traço no "blog" é opcional.
4. **Speculation Rules** (B14): é um mecanismo novo no `<head>`, sem biblioteca; vale registrar como
   decisão.
5. **Carimbo das fontes**: pede um campo novo no frontmatter (a data da conferência das fontes).

## 4. Para registrar (sessão principal)

- Pesquisa feita; nenhuma alteração em código do site. Arquivos: este, `sugestoes/c04-caneta.html` e
  `sugestoes/c05-papelaria.html`.
- O hook do Impeccable apontou nas duas páginas "fonte fora do DESIGN.md" (IBM Plex Sans, lido como
  "plex sans", e Caveat, que o DESIGN.md só cita no texto da D48), texto pequeno nas capas em miniatura
  e um recorte proposital (o palco da cola). São páginas de sugestão, fora do site; nada foi ignorado
  no `.impeccable`.

## 5. Fontes

1. GSAP 3.13 (tudo gratuito): <https://gsap.com/blog/3-13/>
2. Webflow, "GSAP becomes free": <https://webflow.com/blog/gsap-becomes-free>; licença:
   <https://gsap.com/community/standard-license/>
3. GSAP Showcase: <https://gsap.com/showcase/> (Codapress <https://codapress.co.uk/>, Orwell
   <https://orwell.byholm.co/>, Scrapbook <https://chungsunglau.co.uk/>)
4. GSAP Demo Hub: <https://demos.gsap.com/> (Card stack: <https://demos.gsap.com/demo/card-stack/>)
5. DrawSVGPlugin: <https://gsap.com/docs/v3/Plugins/DrawSVGPlugin/>
6. Flip: <https://gsap.com/docs/v3/Plugins/Flip/>
7. CustomEase: <https://gsap.com/docs/v3/Eases/CustomEase/>
8. CustomBounce: <https://gsap.com/docs/v3/Eases/CustomBounce/>
9. MotionPathPlugin: <https://gsap.com/docs/v3/Plugins/MotionPathPlugin/>
10. force3D e o salto no fim: <https://gsap.com/docs/v3/GSAP/CorePlugins/CSS/>,
    <https://gsap.com/docs/v3/GSAP/gsap.config()/>,
    <https://gsap.com/community/forums/topic/16005-micro-jumps-antialiasing-at-the-end-of-tweens/>,
    <https://gsap.com/community/forums/topic/25331-weird-jump-at-end-of-tween-with-expoout-ease/>
11. Cross-document View Transitions: <https://developer.chrome.com/docs/web-platform/view-transitions/cross-document>
12. Ordem de pintura dos grupos (CSSWG #8941):
    <https://lists.w3.org/Archives/Public/public-css-archive/2023Jun/0519.html>; z-index e grupos:
    <https://www.nicchan.me/blog/view-transitions-and-stacking-context/>;
    `view-transition-class`: <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/view-transition-class>
13. Material, sistema de movimento (fade through): <https://m2.material.io/design/motion/the-motion-system.html>;
    tempos: <https://blog.stylingandroid.com/material-motion-fade-through/>
14. Emil Kowalski, "Great animations": <https://emilkowal.ski/ui/great-animations>
15. Josh Comeau, molas: <https://www.joshwcomeau.com/animation/a-friendly-introduction-to-spring-physics/>
16. Nielsen, limites de resposta: <https://www.nngroup.com/articles/response-times-3-important-limits/>;
    indicadores: <https://www.nngroup.com/articles/progress-indicators/>
17. Atrasar o indicador: <https://mitchgavan.com/delay-loading-spinners-appearance/>
18. Speculation Rules / prerender: <https://developer.chrome.com/docs/web-platform/prerender-pages>
19. Astro prefetch: <https://docs.astro.build/en/guides/prefetch/>; client prerender:
    <https://docs.astro.build/en/reference/experimental-flags/client-prerender/>
20. Adaptive loading: <https://web.dev/adaptive-loading-cds-2019/>
21. Long Animation Frames: <https://developer.chrome.com/docs/web-platform/long-animation-frames>
22. Rough Notation: <https://roughnotation.com/>, <https://github.com/rough-stuff/rough-notation>
23. Caligrafia com máscara: <https://css-tricks.com/animate-calligraphy-with-svg/>
24. Traço irregular animado: <https://css-tricks.com/how-to-get-handwriting-animation-with-irregular-svg-strokes/>
25. GitHub, logo: <https://brand.github.com/foundations/logo>, <https://github.com/logos>
26. LinkedIn, [in]: <https://brand.linkedin.com/in-logo>, <https://brand.linkedin.com/policies>
27. NN/g, skeuomorfismo: <https://www.nngroup.com/articles/skeuomorphism/>
28. Stripe Press: <https://press.stripe.com/>
29. Maggie Appleton, jardim: <https://maggieappleton.com/garden>
30. CSS anchor positioning (Baseline 2026): <https://www.oddbird.net/2025/10/13/anchor-position-area-update/>,
    <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position-anchor>
