# macOS 27 "Golden Gate" para o computador (C): relatório de pesquisa

Data: 01/10/2026. Origem de cada valor: **[A]** visto no site da Apple (texto ou imagem), **[H]** Human
Interface Guidelines, **[VS]** repositório microsoft/vscode (MIT), **[M]** medido por mim em pixels nas
imagens da Apple, **[E]** estimativa de quem conhece o macOS (a Apple não publica; o construtor ajusta de
olho). A Apple **não publica medidas em pixels** do macOS: a HIG dá regras, não números.

## 0. Status e licenças

- **O macOS 27 "Golden Gate" existe** em https://www.apple.com/macos/ [A]. Tema da página: Siri AI, Apple
  Intelligence e "design enhancements": **Liquid Glass refinado** ("refração mais uniforme e contraste
  melhor", um **controle deslizante** do "ultraclaro ao totalmente tingido"), **barras de ferramentas
  uniformes, barras laterais de ponta a ponta, formas de janela e ícones da barra de menus atualizados**.
  A página não descreve Dock, Finder, Preview nem Terminal.
- Fórum MacRumors (não oficial): o raio de janela padrão do Golden Gate seria ~20 pt, contra 26 pt no Tahoe
  (macOS 26) em janelas com barra de ferramentas e ~10 pt nos anteriores. Tratar como [E].
- **Livre de uso:** cores (fatos), medidas, estrutura, comportamento, a técnica de `backdrop-filter`, o
  código e os temas do VS Code (MIT; conferir o aviso de copyright se copiar o JSON), `font-family: system-ui`.
- **Não copiar:** papéis de parede, ícones de apps, a maçã e o logo, a fonte SF Pro/SF Mono (uso só pela
  pilha `system-ui, -apple-system` e `ui-monospace, "SF Mono"`, que no Mac mostram a SF de verdade e fora
  dele caem na fonte do sistema; **não** empacotar o arquivo da SF), as imagens da Apple (as capturas em
  `.astro/depuracao/` são só referência, não vão para o site). Desenhar tudo nosso, parecido.
- Dentro do site, o texto "macOS" e o nome "Finder", "Terminal" e "Pré-Visualização" são nomes de apps
  de terceiros: usar como rótulos funcionais é ok, mas sem logo/ícone da Apple. Sugestão: o menu da maçã
  vira um símbolo nosso (círculo/folha), e a barra diz "Computador" ou o nome do blog.

## 1. Sistema

### 1.1 Área de trabalho
- Papel de parede do Golden Gate [A, M]: fundo **creme/areia** (`#a08268` no meio, mais claro no topo
  esquerdo) com **grandes curvas brancas luminosas e sombras marrom-escuras** (`#665042`) em S, como seda
  ou duna. Original nosso: dois temas, claro (areia `#d9c7b0` → `#a08268`, curva clara) e escuro
  (carvão `#1c1a1f` → marrom `#3a2e28`, curva fosca). Fazer com **SVG inline** (2–3 paths com
  `linearGradient` e `filter` desfocado, `feGaussianBlur` 30–60 px estático) ou só `radial-gradient`s
  empilhados; uma vez só, sem animar. Não usar imagem da Apple.
- Painel do MacBook Pro: a tela tem **notch** (entalhe da câmera) no centro do topo [A]: retângulo preto,
  ~ 200×32 pt no 14", cantos inferiores arredondados (~10 px), centrado na barra de menus. Moldura do
  notebook: preta `#0b0b0c`, borda de tela ~10 px, raio externo ~ 18 px, base de alumínio `#c9ccd0`
  (prata) ou grafite `#2b2c2f` (preto espacial: a Apple usa preto na foto) [A, E].
- Proporção 16:10 (3024×1964 no 14"). O `<div>` do computador usa `aspect-ratio: 3024 / 1964`; trabalhar em
  unidades de `cqw` (container query) para tudo escalar: ex.: 1 pt = `calc(100cqw / 1512)`.

### 1.2 Barra de menus
- Altura **24 pt** (no MacBook com notch ~ 32 pt) [E]; **transparente com desfoque mínimo**: no Golden Gate
  e no Tahoe ela é praticamente sem fundo, o texto flutua sobre o papel de parede [A: imagem mostra texto
  branco direto no papel escuro]. Texto: SF **13 px / 500**, `letter-spacing: 0`; nome do app em **700**.
- Ordem [H]: ícone da maçã · **NomeDoApp** (negrito) · Arquivo · Editar · Formatar · Visualizar · (específicos
  do app) · Janela · Ajuda. À direita: "extras" (bateria, Wi-Fi, Centro de Controle, busca, data e hora
  "qua 1 out 14:32").
- Espaçamento horizontal entre itens ~ 14 px de padding; item ativo: pílula `rgba(255,255,255,.18)` (claro:
  `rgba(0,0,0,.1)`), raio 5 px, 150 ms.
- Cor do texto adapta ao papel de parede (claro ou escuro): usar `color` por tema + `text-shadow: 0 0 1px
  rgba(0,0,0,.2)` leve. Nosso Sistema: `background: transparent` em cima do papel, ou
  `rgba(255,255,255,.12)` + `backdrop-filter: blur(20px) saturate(1.6)` no modo "mais legível".
- Menu aberto: painel Liquid Glass (ver 1.5) com raio **10–12 px**, padding 6 px, itens de 24 px de altura,
  raio 6 px, item sob o mouse com fundo **`#0a60ff`/acento do sistema** e texto branco (instantâneo, sem
  transição), atalhos à direita em cinza 55%; separador 1 px `rgba(0,0,0,.1)` com margem 4 px 12 px. Abre
  **sem animação de entrada** (menus no macOS aparecem na hora e somem em ~120 ms de fade) [E].
- Comportamento: clicar abre; com um aberto, passar o mouse nos outros troca na hora; Esc fecha; setas
  navegam. O menu do app muda com o app em foco (isso vende o realismo: Terminal, Finder etc. têm menus
  próprios, ainda que a maioria dos itens fique desativada `opacity .4`).

### 1.3 Dock
- **Vidro flutuante**: fundo `rgba(255,255,255,.22)` (escuro: `rgba(30,30,30,.35)`), `backdrop-filter:
  blur(24px) saturate(1.8)`, borda `1px solid rgba(255,255,255,.35)` mais um brilho interno
  `inset 0 1px 0 rgba(255,255,255,.45)`, sombra `0 8px 30px rgba(0,0,0,.28)`. Raio ~ **26–28 px** (cápsula
  arredondada, não pílula total) [A foto, E]. Flutua ~ 6–8 px acima da borda inferior.
- Ícones: **48–52 px** em repouso (no 14", ~ 50 pt; no site: `calc(100cqw * 50 / 1512)`), espaçamento 6–8 px,
  padding do dock 6 px; ícones são squircles (raio ~ 22%, `border-radius: 22%` ou `clip-path` com superelipse
  aproximada) com gradiente leve e uma sombra interna fina.
- **Ampliação no hover** (técnica de "magnificação"): em `pointermove` sobre o dock, para cada ícone calcular
  a distância horizontal `d` ao ponteiro e `scale = 1 + 0.75 * max(0, 1 - d/ 110px)^2` (pico ~ 1.75× a 1.9×,
  vizinhos em curva suave, raio de influência ~ 2,5 ícones), aplicar **só `transform: scale()`** com
  `transform-origin: bottom center`. O dock em si cresce em largura: usar o espaço reservado `margin` ou
  deixar os ícones com `transform` + `translateX` acumulado para empurrar vizinhos (calcular o `translateX`
  cumulativo no mesmo laço, evitando mexer em layout). Suavização: `requestAnimationFrame` com lerp
  (`current += (target - current) * 0.25`) em vez de `transition`, ou GSAP `quickTo` (duração 0.25 s,
  `power3.out`). Ao sair, volta em ~ 250 ms. Rótulo (tooltip): vidro escuro `rgba(40,40,40,.85)`, 13 px, raio
  7 px, 6 px acima do ícone, aparece em 100 ms.
- **Ponto do app aberto:** bolinha de **4 px**, `rgba(255,255,255,.75)` (escuro) / `rgba(0,0,0,.6)` (claro),
  centrada **3–4 px abaixo** do ícone, dentro do dock.
- **Pulo ao abrir:** ícone sobe ~ 18–22 px e volta, 2–3 vezes, duração ~ 0.5 s por pulo, `ease-out` para
  cima e `ease-in` para baixo (`gsap` ou `@keyframes` só com `translateY`). Termina com o ponto aceso.
- Separador entre apps e pastas/lixeira: linha vertical 1 px `rgba(255,255,255,.3)`, altura 85% do ícone,
  margem 6 px. Lixeira e "pasta Downloads" à direita do separador.
- Minimizadas vão para a direita do separador como miniatura da janela (com o mini ícone do app no canto).

### 1.4 Janelas (as comuns, as da Apple)
- **Raio**: ~ **20 pt** no Golden Gate [E, fórum]; ~ 26 pt no Tahoe com barra de ferramentas; 10 pt nos
  anteriores. Recomendação: variável `--raio-janela: 20px` (o Cesar vê "parecido" mesmo; 26 também é ok com
  barra de ferramentas grande). No Finder/Pré-Visualização o raio acompanha o vidro da barra (concêntrico).
- **Botões de semáforo** (3): diâmetro **12 px**, espaçamento entre centros **20 px** (gap 8), margem esquerda
  **13 px** e topo ~ 13 px (janela comum). Cores ativas: vermelho `#ff5f57` (borda `#e0443e`), amarelo
  `#febc2e` (`#dea123`), verde `#28c840` (`#1aab29`). **Janela inativa:** os três ficam cinza `#ceced0`
  (escuro `#595959`) sem cor, e a janela perde sombra forte e vibrancy (a HIG fala exatamente isso: ativa tem
  cor; inativa é cinza e "mais longe") [H]. Ao passar o mouse **no grupo**, os três mostram glifos: × (fechar),
  − (minimizar), ⤢ duas setas diagonais (verde; no Tahoe abre menu de "Mosaico" após 1 s). Glifo cor
  `rgba(0,0,0,.55)`, 8 px. Visual Tahoe/Golden Gate: botões mais planos, borda interna de 1 px translúcida,
  sem gradiente.
- **Barra de título/ferramentas:** janela de documento tem 28 pt de barra (título centrado 13 px / 600,
  `color: rgba(0,0,0,.85)`); janelas com barra de ferramentas (Finder, Preview) têm ~ 52 pt de altura, com
  **botões em cápsulas de vidro** (Liquid Glass) de 28–32 px de altura e raio total, ícone 16 px, espaçamento
  entre grupos 10 px [A: imagem mostra grupos de botões em pílulas translúcidas com divisórias finas].
- **Barra lateral:** no Golden Gate vai **de ponta a ponta** (do topo à base da janela, os semáforos ficam
  sobre ela) [A], vidro fosco `rgba(235,232,228,.72)` + `blur(28px) saturate(1.6)` (escuro
  `rgba(40,38,36,.6)`), medido na imagem ~ `#c7c2bc`. Item selecionado: pílula de raio 8 px, fundo
  `rgba(0,0,0,.09)` (medido ~ `#d5d3d4`; escuro `rgba(255,255,255,.12)`), ícone no azul de acento.
  Títulos de seção ("Favoritos") 11 px, `rgba(0,0,0,.45)`, 600.
- **Conteúdo:** claro `#ffffff`/lista `#f9f9f9`, linha selecionada neutra `#dadada` (janela inativa/sem acento)
  ou azul `#0a60ff` (ativa, texto branco). Escuro: `#1e1e1e` / `#262626`.
- **Sombra da janela:** ativa `0 22px 70px 4px rgba(0,0,0,.35), 0 0 0 .5px rgba(0,0,0,.3)`; inativa `0 10px
  30px rgba(0,0,0,.2)`. Borda de 1 px `rgba(255,255,255,.35)` por dentro no escuro (`inset`).
- **Ações:**
  - Arrastar: pela barra de título (`pointerdown` + `setPointerCapture`, atualizando `transform:
    translate3d`; limitar para a barra de título nunca sair da tela e a barra de menus).
  - Redimensionar: 8 alças invisíveis (bordas 6 px, cantos 12 px), atualizar `width/height` só durante o
    arrasto (aceitável: um elemento só) ou `transform: scale` não serve (distorce texto). Mínimo 360×240.
  - Foco: `pointerdown` em qualquer ponto traz à frente (`z-index` incremental) e torna ativa.
  - Duplo clique na barra: zoom (cresce até a área útil, menos o Dock) com 250 ms.
  - Verde: tela cheia do computador (animação de ~ 600 ms) ou zoom; simples = zoom.
- **Abrir:** `scale(.9) → 1` + `opacity 0 → 1`, **250 ms**, curva `cubic-bezier(.2, .9, .3, 1.15)` (leve
  overshoot), a partir do ícone do Dock (`transform-origin` no centro do ícone) se quiser o tom "lançar".
  **Fechar:** `scale(1 → .94)` + `opacity → 0`, **150 ms**, `ease-in`.
- **Minimizar, efeito Gênio:** a janela é "sugada" para o ícone do Dock: em 0,5–0,7 s ela se afunila (fica
  como um funil, estreita embaixo) e voa até a posição do ícone do app, onde vira miniatura; reabrir é o
  inverso. **Como fazer sem pesar:** (a) versão fiel, **`clip-path: polygon()`** animado em 10–20 pontos que
  vão da forma retangular a um quadrilátero estreito, mais `transform: translate/scale` para a posição,
  `ease-in-out` 600 ms; conteúdo continua dentro (barato; só compositor). (b) mais barata e quase igual: dividir
  a janela em ~ 8–12 faixas horizontais (`clip-path: inset(...)` em cópias), cada uma com `translateX` e
  `scaleX` crescentes e atraso escalonado de 15 ms (parece curva de gênio). Recomendo a (a) com a janela
  fotografada em `<canvas>` (html-to-canvas) **não**: pesa e quebra o conteúdo; use o próprio DOM.
- **Escala (alternativa, mais barata):** `transform: translate(Δx,Δy) scale(.08)` + `opacity .0` até o
  ícone, **350–450 ms**, `cubic-bezier(.5, 0, .2, 1)`, `transform-origin` no ponto do ícone. Zero custo de
  layout. Usar como `prefers-reduced-motion` (ou só um fade de 120 ms).
- **Zoom nos atalhos:** Cmd+M minimiza, Cmd+W fecha, Cmd+Q sai do app, Cmd+Tab alterna (trocador de apps
  com ícones grandes em vidro, 100 ms de fade).
- **Janela do Mission Control / Exposé:** opcional; não vale o custo.

### 1.5 Liquid Glass em CSS (como aproximar)
- Material "regular" [H]: desfoca e ajusta luminosidade do fundo; o "claro/clear" é muito mais transparente
  e só vai sobre mídia, com camada de escurecer 35% se o fundo é claro [H]. O que a Apple pede: **não usar
  vidro no conteúdo**, só em controles e navegação (barra, barra lateral, dock, menus, botões flutuantes) [H].
- Receita barata: `background: rgba(255,255,255,.34); backdrop-filter: blur(18px) saturate(1.7)
  brightness(1.05); border: 1px solid rgba(255,255,255,.55); box-shadow: inset 0 1px 0 rgba(255,255,255,.7),
  inset 0 -1px 0 rgba(255,255,255,.18), 0 8px 24px rgba(0,0,0,.14)`; escuro: `rgba(40,40,44,.38)`, borda
  `rgba(255,255,255,.14)`. Refração real (distorção) só com SVG `feDisplacementMap` em `backdrop-filter`,
  que só Chrome aceita: **evitar** (pesa e quebra no Safari/Firefox).
- **Custo:** `backdrop-filter` é caro em áreas grandes (a janela inteira). Limitar a: barra de menus (opcional),
  Dock, barra lateral e barra de ferramentas da janela ativa; janela **inativa** perde o blur (fica `background`
  sólido) e isso também economiza. Raio de blur ≤ 24 px; nada de animar `backdrop-filter` nem a área
  com ele (animar `transform` da janela inteira, ok).
- Slider "ultraclaro ↔ tingido" [A]: variável `--vidro: 0..1` que mexe na opacidade do fundo (0,12 a 0,7).
  Dá para oferecer um controle pequeno em "Ajustes" do computador (extra, com baixo custo).
- Controles e foco: realce de foco do macOS é um **anel azul de 3 px** `rgba(10,132,255,.5)` com 1 px sólido
  `#0a84ff`.

### 1.6 Tipografia e cores do sistema
- `font-family: system-ui, -apple-system, "SF Pro Text", "Helvetica Neue", sans-serif`; mono:
  `ui-monospace, "SF Mono", Menlo, monospace`. Em Mac mostra a SF verdadeira; fora dele, o Plex Sans do
  blog (que já é carregado) é uma boa queda: `font-family: system-ui, -apple-system, "IBM Plex Sans"`.
- Tamanhos: menus e rótulos 13 px; legendas 11 px; títulos de janela 13 px/600; Finder lista 13 px.
  `-webkit-font-smoothing: antialiased`.
- Acento (azul do sistema): `#0a60ff` claro / `#0a84ff` escuro; vermelho `#ff453a`, verde `#32d74b`, amarelo
  `#ffd60a`, cinza `#8e8e93` (rótulos secundário `rgba(60,60,67,.6)`; separador `rgba(60,60,67,.29)`) [E,
  valores semânticos publicados pela Apple para iOS/macOS].

## 2. Finder

- **Janela com barra lateral de ponta a ponta** (Golden Gate [A]) e **barra de ferramentas uniforme**
  (altura ~ 52 px), com semáforos sobre a barra lateral. Barra de ferramentas: setas ‹ › (grupo em cápsula),
  título da pasta ao lado (negrito 15 px, com pasta pequena), à direita: visualizações (ícones/lista/colunas/
  galeria: grupo segmentado com o selecionado em cápsula branca), agrupar, ações (…), compartilhar, etiquetas,
  busca (campo cápsula 28 px). Cada cápsula: vidro (1.5), 28 px de altura, ícone 15 px 1.2 de traço.
- **Barra lateral:** seções "Favoritos" (AirDrop, Recentes, Aplicativos, Mesa, Documentos, Downloads),
  "iCloud", "Locais", "Etiquetas" (11 px cinza; ícones 16 px **azul de acento**; item de 28 px de altura, raio
  8 px, 8 px de espaçamento). No nosso caso: **Favoritos = Livros** (uma pasta por categoria), "Posts em PDF",
  "Recentes". Pastas de livros com ícone de pasta azul-claro (desenho nosso, achatado, `#5ac8fa`→`#1d9bf0`
  como vem no macOS, sem cópia do ícone) ou a **capa em miniatura** do livro.
- **Visualização em ícones:** grade com ícones de 64 px (pasta/arquivo) e nome embaixo, 12 px, centrado, 2 linhas,
  ellipsis. Selecionado: ícone ganha fundo `rgba(0,0,0,.1)` raio 6 px; o nome vira pílula azul `#0a60ff`
  com texto branco. Passar o mouse **não** muda nada (o Finder não tem hover em itens).
- **Lista:** linhas de **22 px**, listradas alternadas (`#fff`/`#f5f5f5`; escuro `#1e1e1e`/`#242424`),
  colunas Nome, Data de modificação, Tamanho, Tipo (cabeçalho 12 px, cinza 50%, com setinha de ordenação).
  Seleção = azul `#0a60ff` (ativa) ou `#dadada` (janela inativa). Setas do teclado navegam; Enter/duplo clique
  abre (pasta navega, PDF abre na Pré-Visualização), Espaço = Quick Look (abre painel de visualização rápida
  com o PDF/imagem, 200 ms `scale(.96→1)`), Cmd+↑ sobe.
- **Colunas:** colunas de 200 px, divisor 1 px, seta › à direita em pastas, painel de **prévia** à direita
  (ícone grande 128 px + nome + tipo + tamanho + "Mais…").
- **Barra de caminho** na base (altura 22 px): Livro › Pasta; **barra de status** ("12 itens, 245 GB
  disponíveis" 11 px, cinza). A HIG cita exatamente esta "bottom bar" do Finder [H].
- Arrastar um arquivo para uma pasta, soltar com realce de pílula azul; para o MVP, só abrir.

## 3. Pré-Visualização (Preview)

- **Janela com barra lateral de miniaturas** à esquerda: largura ~ **160–180 px**, vidro fosco da barra
  lateral, miniaturas de página com sombra `0 1px 3px rgba(0,0,0,.3)` e borda de 1 px `rgba(0,0,0,.15)`,
  número da página abaixo (11 px). Página atual: contorno azul de **3 px** `#0a60ff` com raio 3 px e o
  número em pílula azul. Cada miniatura tem ~ 110 px de largura (proporção A4 ≈ 1:1,414), espaço 14 px.
- **Barra de ferramentas:** à esquerda botão de barra lateral (⊟ com seta), título "NomePost.pdf" + subtítulo
  "Página 2 de 12"; no centro-direita: zoom − + (grupo), Compartilhar, **Marcação** (caneta), busca. Todos
  em cápsula de vidro como no Finder. Barra de marcação ao clicar (opcional; ignorar).
- **Área do documento:** fundo cinza **`#ececec`** (escuro `#2a2a2a`), páginas brancas centralizadas com
  sombra `0 2px 12px rgba(0,0,0,.25)`, espaçamento vertical 12 px, rolagem contínua. Zoom padrão "ajustar à
  largura".
- **Comportamento:** clicar na miniatura leva à página (`scrollIntoView`, `behavior: smooth`, 300 ms); a
  miniatura atual segue a rolagem (`IntersectionObserver`). Zoom por botões e Cmd +/−. Imagens (o livro e a
  ilustração do post) abrem na mesma janela sem a barra lateral ou com 1 miniatura.
- **Como no site:** páginas como `<img>` WebP (o projeto já tem os slides do deck, `public/posts/<slug>/deck/`)
  em `loading="lazy"`; PDF real só com `<a download>`. **Não usar PDF.js** (peso e licença Apache, mas é
  desnecessário): imagens bastam.

## 4. Terminal

- **Perfil padrão "Básico"** (Terminal.app moderno) [E]: claro: fundo `#ffffff`, texto `#000000`, cursor
  bloco `#000`/seleção `#b4d5fe`; escuro (segue o tema do sistema): fundo `#1e1e1e`, texto `#ffffff`, cursor
  `#bfbfbf`... (o perfil "Pro" é preto `#000` com texto `#f2f2f2`). Fonte **SF Mono Regular 11 pt** (≈ 13 px,
  `ui-monospace, "SF Mono", Menlo`), altura de linha 1.2 (~ 16 px), tamanho padrão **80×24** colunas.
- **Barra de título:** vidro **translúcido** (a janela do Terminal é a janela com leve transparência, `0.9`
  opacidade no Pro; no Básico, opaca) com semáforos, título centrado "usuário — -zsh — 80×24" (13 px, com
  ícone de pasta pequena à esquerda do nome do diretório), `rgba(0,0,0,.85)`. Sem barra de ferramentas.
- **Prompt zsh:** `cesar@MacBook-Pro ~ %` (formato `%n@%m %~ %#`), cor do texto padrão (sem cores no Básico),
  `ls` colorido só com `-G`. Cursor: **bloco** piscante (1 s, `steps(1)`, só quando janela ativa; na inativa
  vira contorno vazado).
- Comportamento: primeira linha "Last login: qua 1 out 14:30:12 on ttys000"; `help` lista os comandos do
  falso shell (`cd`, `ls`, `tree`, `cat`, `open`, `clear`, `pwd`, `whoami`, `date`, `echo`, `history`, `man`);
  setas ↑/↓ histórico, Tab completa, Ctrl+C aborta e imprime `^C`, Ctrl+L limpa; `open <livro>` abre o Finder
  naquela pasta; `open arquivo.pdf` abre a Pré-Visualização. Seleção de texto com o mouse (fundo azul).
- **Estilo Quake (de cima para baixo): não existe no Terminal.app de fábrica.** Confirmado: o Terminal da
  Apple não tem modo "dropdown" [pesquisa web]; o iTerm2 tem a "Hotkey Window" e o Ghostty o "Quick Terminal";
  o antigo TotalTerminal (plugin) era o jeito no Terminal.app. Então, como o Cesar já pensou (C5), vira
  **um modo do nosso app** ("Terminal, modo suspenso", tecla `` Ctrl+` ``): painel de largura total, 40% da
  altura da tela do computador, desce com `translateY(-100% → 0)` em **200 ms** `cubic-bezier(.2,.8,.2,1)`,
  fundo `rgba(30,30,30,.88)` + `blur(20px)`, sem semáforos, alça de arrasto de 6 px embaixo, borda inferior
  1 px `rgba(255,255,255,.15)`. Sobe em 150 ms.

## 5. VS Code (IDE)

Valores de [VS] (extensions/theme-defaults/themes/dark_modern.json e light_modern.json, MIT; texto e a
estrutura da interface conferidos em code.visualstudio.com/docs/getstarted/userinterface).

### 5.1 Estrutura e medidas (padrão do VS Code)
- **Barra de título** 35 px (na janela do Mac o VS Code usa a barra nativa com semáforos; aqui ocupe 36 px:
  semáforos à esquerda, **título central** "arquivo — projeto — Visual Studio Code"; à direita os botões de
  layout 22 px, opcionais). **Barra de atividades** à esquerda, **48 px** de largura, ícones 24 px, item
  48×48, indicador ativo: barra de **2 px** à esquerda em azul. **Barra lateral** (Explorer) **~ 240 px**
  (resizable 170–500), título "EXPLORER" 11 px caixa alta (aqui a regra do blog proíbe rótulo em caixa alta:
  usar "Explorer" normal), linhas de **22 px**, recuo 8 px por nível, seta de pasta 16 px,
  ícones de arquivo 16 px. **Abas** altura **35 px**, largura mínima ~ 120 px, rótulo 13 px, "×" 16 px
  que aparece no hover (e fixo na ativa), borda direita 1 px, aba ativa com **topo de 1 px** `activeBorderTop`
  e fundo igual ao do editor. **Migalhas** (breadcrumbs) **22 px**: `src › pages › index.ts › main`, 12 px,
  cinza. **Editor**: JetBrains Mono / `Menlo, Monaco, "Courier New", monospace` 14 px (o blog tem JetBrains
  Mono: usar), altura de linha **~ 19–20 px (1.4)**, números de linha 14 px em cinza, calha 50–60 px.
  **Minimapa** à direita, **~ 60–90 px**: o texto desenhado como barrinhas (usar `<canvas>` uma vez ou CSS com
  `linear-gradient`), deslizador `rgba(121,121,121,.2)`. **Painel** (terminal) embaixo com abas
  Problemas/Saída/Terminal (opcional). **Barra de status** **22 px** de altura, 12 px; em Dark/Light Modern
  ela tem a **mesma cor do fundo** (não é azul) com **item remoto azul** à esquerda (`><` 22×22) [VS].
- **Interação:** clicar na pasta expande/recolhe (seta gira 90°, **sem animação** ou 120 ms); clicar arquivo
  abre em aba (preview em itálico; duplo clique fixa); aba fecha com × ou Cmd+W; arrastar abas reordena;
  Cmd+P abre o seletor (modal de 600 px no topo, raio 6, sombra `0 0 8px 2px #000000a8`/escuro, `0 0 8px 2px
  #00000040`... [E]). Foco: anel `focusBorder` de 1 px interno.

### 5.2 Dark Modern [VS]
- `foreground` / `editor.foreground` `#CCCCCC`; `editor.background` **`#1F1F1F`**; `activityBar.background`
  **`#181818`**, `activityBar.foreground` `#D7D7D7`, `inactiveForeground` `#868686`, `activityBar.border`
  `#2B2B2B`; `sideBar.background` `#181818`, `sideBar.border` `#2B2B2B`; `tab.activeBackground` `#1F1F1F`,
  `tab.inactiveBackground` `#181818`, `tab.activeForeground` `#FFFFFF`, `tab.inactiveForeground` `#9D9D9D`,
  `tab.border` `#2B2B2B`, **`tab.activeBorderTop` `#0078D4`**; `editorGroupHeader.tabsBackground` `#181818`;
  `titleBar.activeBackground` `#181818`, `titleBar.activeForeground` `#CCCCCC`; `statusBar.background`
  `#181818`, `statusBar.foreground` `#CCCCCC`, `statusBar.border` `#2B2B2B`, `statusBarItem.remoteBackground`
  `#0078D4`; `panel.background` `#181818`, `panel.border` `#2B2B2B`; `editorWidget.background` `#202020`;
  `input.background` `#313131`; `badge.background` `#616161`; `descriptionForeground` `#9D9D9D`;
  `editorLineNumber.foreground` `#6E7681`, `...activeForeground` `#CCCCCC`; `focusBorder` `#0078D4`;
  `button.background` `#0078D4`; `textLink.foreground` `#4DAAFC`; `tab.hoverBackground` `#1F1F1F`;
  `list.hover`/seleção: `#2A2D2E` / `#37373D` (da base Dark+) [E].
- **Sintaxe (Dark+)**: comentário `#6A9955`, palavra-chave `#569CD6`, controle (if/for/return/import)
  `#C586C0`, string `#CE9178`, número `#B5CEA8`, função `#DCDCAA`, tipo/classe `#4EC9B0`, variável/propriedade
  `#9CDCFE`, operador/pontuação `#D4D4D4`, tag HTML `#569CD6`, atributo `#9CDCFE`, regex `#D16969`, inválido
  `#F44747`.

### 5.3 Light Modern [VS]
- `foreground` `#3B3B3B`; `editor.background` **`#FFFFFF`**; `activityBar.background` **`#F8F8F8`**,
  `activityBar.foreground` `#1F1F1F`, `inactiveForeground` `#616161`, `activityBar.border` `#E5E5E5`;
  `sideBar.background` `#F8F8F8`, `sideBar.border` `#E5E5E5`; `tab.activeBackground` `#FFFFFF`,
  `tab.inactiveBackground` `#F8F8F8`, `tab.inactiveForeground` `#616161`, `tab.border` `#E5E5E5`,
  **`tab.activeBorderTop` `#005FB8`**, `tab.hoverBackground` `#FFFFFF`; `titleBar.activeBackground` `#F8F8F8`,
  `titleBar.activeForeground` `#1E1E1E`; `statusBar.background` `#F8F8F8`, `statusBar.foreground` `#3B3B3B`,
  `statusBar.border` `#E5E5E5`, `statusBarItem.remoteBackground` `#005FB8`; `panel.background` `#F8F8F8`,
  `panel.border` `#E5E5E5`; `list.activeSelectionBackground` `#E8E8E8`, `list.hoverBackground` `#F2F2F2`;
  `editorLineNumber.foreground` `#6E7681`, `...activeForeground` `#171184`; `editorIndentGuide.background1`
  `#D3D3D3`; `editorWidget.background` `#F8F8F8`; `focusBorder` `#005FB8`; `button.background` `#005FB8`.
- **Sintaxe (Light+)** [E, valores padrão públicos]: comentário `#008000`, palavra-chave `#0000FF`, controle
  `#AF00DB`, string `#A31515`, número `#098658`, função `#795E26`, tipo `#267F99`, variável `#001080`, tag
  `#800000`, atributo `#E50000`.

### 5.4 Ícones e licença
- Ícones do VS Code (Codicons) são **MIT/CC-BY-4.0** e podem ser usados com crédito; mesmo assim, desenhar os
  nossos em SVG (já há `src/lib/traco`) e manter 16 px, traço 1.2. Ícones de arquivo (Seti) são MIT. Código e
  temas do VS Code: MIT. O logo "Visual Studio Code" é marca da Microsoft: **não usar**; rótulo "Editor".

## 6. Comportamento geral: o que cabe em CSS/JS leve e o que evitar

| Peça | Faça | Evite |
|---|---|---|
| Janelas | `transform: translate3d` para mover; `z-index` por foco; abrir/fechar com `transform` + `opacity`; `will-change` só durante o arrasto | animar `width/height/top/left` fora do redimensionar; sombra grande animada |
| Vidro | `backdrop-filter` só no Dock, barra lateral, barra de ferramentas e menu; blur ≤ 24 px; janela inativa sem blur | `backdrop-filter` na janela inteira, em listas longas, animado, ou SVG de refração |
| Dock | magnificação com `transform: scale` + `rAF` só enquanto o ponteiro está sobre o Dock (para o laço ao sair); 10–12 ícones | recalcular layout (`width`) por frame; filtros nos ícones |
| Gênio | `clip-path` + `transform` na janela viva | canvas/screenshot da janela; mexer em `mesh` de WebGL |
| Papel de parede | SVG/gradiente estático; blur estático | vídeo, shader, parallax contínuo |
| Terminal | `<div>` com linhas; cursor com `steps(1)` | `requestAnimationFrame` contínuo; xterm.js (peso) |
| Editor | HTML pré-realçado (o Expressive Code/Shiki do projeto) em `<pre>`; minimapa em um `<canvas>` desenhado uma vez | Monaco/CodeMirror (centenas de KB) |
| PDF | páginas como imagens WebP (já temos os slides do deck) | PDF.js |
| Sempre | `prefers-reduced-motion`: sem Gênio nem pulo do Dock, só fade de 120 ms, ponto do app aberto fica | atrasos longos, animação por quadro no que não é visto (parar tudo com `IntersectionObserver` quando o computador sai da tela) |

## 7. Pontos de realismo que mais "vendem" (do que mais para o que menos)

1. A **barra de menus** que muda com o app em foco e o relógio.
2. **Semáforos cinza** na janela inativa e janela ativa com sombra grande.
3. **Dock** em vidro com **magnificação** e ponto de app aberto.
4. **Vidro** na barra lateral e nas cápsulas da barra de ferramentas.
5. **Papel de parede** areia com curvas e **notch** no topo.
6. **Gênio** ao minimizar (e a escala em movimento reduzido).
7. Quick Look no Finder (Espaço) e o menu da maçã/Ajustes com o controle de vidro.

## 8. Capturas (referência, não vão para o site)

Em `/Users/cesar.schutz/Downloads/blog/.astro/depuracao/redesenho/r3/macos/`:
- `apple-macos-00.png` a `apple-macos-08.png`: a página apple.com/macos (rolagem em 1440×900); `-06` mostra a
  seção "Every little detail" com o vidro dos botões e o Mail do Golden Gate.
- `hero_macbook__d6o4ngynokom.jpg`: MacBook Pro, o papel de parede e o Dock (pequenos).
- `search__gca3sckqsxym.jpg`: janela do Mail com barra lateral de ponta a ponta, semáforos, notch, barra de
  menus transparente: a melhor imagem do sistema.
- `liquid_glass__bf6kssw93vrm.jpg`: cápsulas de Liquid Glass da barra de ferramentas.
- `mac__16rdvryuvv6e.jpg`, `siri_app__bf82k75xd8z6.jpg`, `type__beeb42vb1tpu.jpg`, `safari__wwqti2pesg22.jpg`:
  detalhes de interface (visuais da Apple Intelligence).
O Finder, a Pré-Visualização e o Terminal **não aparecem** no site do macOS 27; os valores vêm do
conhecimento do sistema [E]. Se o Cesar tiver um Mac com o Golden Gate (ou prévia), uma captura
de tela real de cada app melhora muito as medidas: o construtor deve pedir.

## 9. Fontes

- https://www.apple.com/macos/ (macOS 27 Golden Gate)
- https://developer.apple.com/design/human-interface-guidelines/windows, /the-menu-bar, /materials
- https://code.visualstudio.com/docs/getstarted/userinterface
- https://github.com/microsoft/vscode/tree/main/extensions/theme-defaults/themes (MIT)
- https://lapcatsoftware.com/articles/2026/3/1.html e o tópico do MacRumors sobre raios de janela
  (não oficiais)
