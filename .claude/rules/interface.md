---
paths:
  - "src/components/**"
  - "src/layouts/**"
  - "src/pages/**"
  - "src/styles/**"
  - "src/scripts/**"
  - "src/lib/**"
---

# Arquivos de interface

Antes de mexer no visual ou no movimento, leia o `DESIGN.md` (vence qualquer ferramenta, inclusive o
Impeccable) e, para uma animação que já existe, `docs/movimento.md`.

## Regras

- Cores só por tokens CSS (`var(--ink)`, `var(--cat)`…), de `src/styles/tokens.ts`. Nada de hex solto
  em componente ou SVG.
- Ícone novo de interface: função em `src/lib/traco.ts`, na caneta preta, nunca SVG solto (D52, C04).
  A caneta preta desenha; a azul marca (estado: seção e página atuais, marcações da D48). A caneta da
  leitura (barra do topo e sumário) usa a cor do livro: a página do post põe a cor no `--caneta` desses
  blocos (D58). Logo de ferramenta não é ícone de interface: fica em `src/marcas/` (skill `figura`).
- Toda animação respeita `prefers-reduced-motion`: com ele ligado, tudo aparece no estado final, sem
  prender a tela. Anime `transform` e `opacity` (e `stroke-dashoffset` nos traços desenhados), nunca
  `filter` no livro 3D (`DESIGN.md`, Movimento).
- Não pode parecer feito por IA: nada de fonte genérica, gradiente decorativo, sombra genérica em
  tudo, animação de entrada em cada seção, rótulo em caixa alta ou emoji.
- **JavaScript só onde há interação.** A lista do que tem JS hoje:
  - estante, gaveta, busca, lousas, apresentação, lista/cards, menu de tema, filtro por livro, livro
    ampliado, o nome de transição do livro do painel e o menu do celular (D29, D33, D46);
  - o desenho do destaque da home (D41) e o lugar das notas da caneta (D48);
  - o gesto de copiar, os contadores que rolam e a rasura e a sugestão da 404 (D49);
  - os atalhos de teclado do artigo e o livro da pilha que voa até o topo (D50);
  - a troca de página por folhas (`troca.js` no `<head>`), a abertura em toda página, o desfile de
    Categorias e o desenho do topo do artigo (D51);
  - a ficha dos atalhos, o hover do livro ampliado (o `:hover` nativo se perde na pilha 3D), a
    preferência de tema e de modo válida por 3 dias (o script anti-piscada do `<head>`), o aceno dos
    dois cadernos no fim da abertura da home, a caneta que escreve o fio do cabeçalho quando a página
    demora, a assinatura da home e a fumaça da caneca no hover (D52);
  - a `Lousa` (play, arrasto, rolagem horizontal, passos, a caneta), a `Animacao` (a timeline GSAP de
    cada animação, carregada sob demanda), a `Figura` (só um observador que liga os detalhes que se
    mexem enquanto ela está na tela; o movimento é CSS) e a capa viva (`capa-viva.ts`: o evento vai
    até o fim mesmo que o mouse saia) (D58);
  - o aviso "Arraste para o lado" das tabelas (`artigo.ts`: um observador mede se a tabela passa da
    moldura e põe o aviso; quem rola a tabela e quem mostra o aviso, até 700px, é o CSS) (D70);
  - do visual "papel e luz" (D61):
    - a luz: a lâmpada da troca de tema, a luz do mouse, os abajures e a onda e o brilho dos livros
      (`lampada.ts`, `luz.ts`, `livro-vivo.ts`, `estante-moderna.ts`);
    - as páginas: a cortina e as chegadas da troca de página (`troca.js`), as fichas que caem e o
      fichário de Tags (`fichas-caem.ts`, `fichario.ts`) e a entrada ao rolar (`revelar.ts`,
      `embaralha.ts`);
    - a cordinha do rodapé, a aba "topo" e o voo do livro da home até a página dele;
    - a doca da fileira da home: com o mouse, o livro sob ele cresce, e os vizinhos menos (`doca.ts`, D78);
    - o computador (`src/computador/`, carregado sob demanda a partir do primeiro hover, foco ou
      toque no ícone).

  Artigo sem esses componentes funciona sem JS (as marcações da caneta são estáticas). Peça nova com
  JS entra nesta lista.
- GSAP só carregado sob demanda (`src/scripts/gsap.ts`), nunca no layout.
- **Nome acessível (D69, D73):** link ou botão com texto na tela não leva `aria-label` que não contenha
  esse texto. O nome vem do conteúdo: o enfeite fica com `aria-hidden="true"` e o que falta na tela
  entra num `<span class="sr">` (`base.css`). O texto que dá o nome nunca fica em `display: none` nem
  dentro de `content-visibility: hidden`: nos dois casos ele sai do nome. É o que a auditoria
  `label-content-name-mismatch` do Lighthouse confere (texto com `aria-hidden` conta, porque está na
  tela).

## Livros

- A regra visual é `docs/capas/CAPAS.md`; os dados e as cores, `src/livros/livros.json` e
  `src/livros/cores.js`; desenhos, ícones e emblemas em `src/livros/` entram inline por
  `src/lib/livros-svg.ts`. O desenho grande da capa e o emblema da revista só carregam quando o livro
  abre na gaveta (`/livros/<slug>.svg`).
- Os componentes são `Capa`, `MioloLombada` (a lombada, em pé e, girada, deitada no `PainelHome`),
  `Estante` (também no modo "filtro" do arquivo e das tags), `Gaveta`, `Livro3D`, `LivroEmPe`,
  `TopoLivro` e `GradeLivros`, e, da D61, `Colecao` (a fileira da home), `FileiraTopo` (o alto da
  página do livro), `PontoDeLuz` e `Luz` (abajures e luz): altere esses, sem criar outros em
  paralelo. As peças paradas da D57 são imagens: `FotoDoLivro` (o livro deitado da ficha "Do livro", com as etiquetas em SVG por cima)
  e `LivroEmBranco` (o livro aberto do livro sem artigos e da busca sem resultado), de
  `node scripts/livros/fotos.mjs` (`src/lib/fotos.ts`). `LivroAmpliado` copia o
  livro 3D para o visor e monta nele as páginas de dentro, de `/livros/<slug>.json` (D49).
- As peças usam os **papéis de cor** de `livro.css` (`--cima`, `--baixo`, `--revista-*`), nunca as
  cores cruas `--livro-*`. Os livros **não mudam com o tema** (D39).
- **O livro 3D é de capa dura** (D57, `CAPAS.md`, "Livro 3D: capa dura"): placas de papelão
  (`--papelao`), seixa (`--seixa`), lombada em facetas (a arte no meio, `FACETAS` em `Livro3D.astro`),
  o alto com o cabeceado (SVG deitado) e a sombra no chão (`.chao`). A vista de um pouco acima fica em
  `.livro-3d-vista` (rotateX), **fora** do giro: quem anima (GSAP, trocas de página, livro ampliado) mexe
  só no `rotateY` do `.livro-3d`; o livro ampliado, ao abrir, só endireita a vista por `--aberto`. Para pôr o livro sobre uma lombada (o voo da gaveta e da pilha), meça
  a `.face-lombada` na tela com o livro a 90°, nunca calcule pela caixa.
- **Estante e pilha com volume** (D57): a prateleira é um espaço 3D só (`preserve-3d`), com o olho um
  pouco acima dos livros; cada lombada tem a cabeça e os lados (`.lado`) em 3D. Opacidade ou `filter`
  numa lombada achatam esse 3D (a cabeça e os lados somem) e deixam a tábua aparecer através dela: para
  apagar um livro, use o véu `--apagado` (estante.css). Não use `--veu` como nome local: é o token do
  visor.
- O número das lombadas, da capa da revista e da página do livro é o total de artigos, contado pelos
  posts (some quando é zero); o "VOLUME 01" é a posição na coleção.
- A marca "cs" (`src/lib/marca.ts`, `favicon.*`, `apple-touch-icon.png`) sai de
  `node scripts/marca.mjs`. Não edite à mão.

## Armadilhas

- O cabeçalho é fixo (D31): peça nova com `position: sticky` ou âncora que role até o topo precisa
  descontar `--altura-topo` (base.css), senão fica escondida atrás dele.
- O CSS com escopo do Astro põe um atributo em **cada parte** do seletor, e isso soma especificidade:
  `.menu button span` (três partes) vence `.menu .chave` (duas), mesmo vindo antes. Estado de um
  elemento dentro de outro (aria-checked, aria-current) precisa de um seletor pelo menos tão longo
  quanto o da regra de base (D33).
- Em `.astro`, uma quebra de linha colada a um elemento embutido (antes ou depois) some por inteiro:
  "mim e" + `<strong>` vira "mim ea". Mantenha o elemento na mesma linha das palavras vizinhas.
- Instalar dependência com o dev no ar faz o Vite reiniciar, e componentes editados nesse meio-tempo
  podem ficar com o CSS velho: salve-os de novo (um `touch` basta). O mesmo acontece quando um script
  reescreve o arquivo inteiro (Write ou `writeFileSync`): se o CSS novo não aparecer, `touch` no
  arquivo ou reinicie o dev antes de concluir que a regra está errada.
- No primeiro quadro de uma página nova (View Transition entre documentos), nenhuma fonte está
  carregada (`document.fonts` todas `unloaded` no `pagereveal`): título, capas e menu aparecem na
  fonte de reserva por um instante. No GSAP, `power2` é uma curva cúbica (`power1` é a quadrática), o
  que muda a conta ao emendar uma curva na outra (D52, B01 e B09).
- O Chrome não pinta um elemento com `view-transition-name` dentro de um pai com opacidade 0: ele só
  aparece de repente quando o pai volta a 1. Para animar o elemento chegando, tire o nome dele (ou do
  pai) enquanto a opacidade estiver em zero, e devolva depois (D52).
- **Animação ligada à rolagem** (`animation-timeline: scroll()` ou `view()`): escreva nas propriedades
  separadas (`animation-name`, `animation-timing-function`, `animation-fill-mode`, `animation-timeline`,
  `animation-range`), nunca o atalho `animation` com a timeline depois. O minificador do build (Lightning
  CSS) junta os dois num atalho só, com a timeline dentro, e o Chrome descarta a declaração: funciona no
  dev e some no site publicado (D62).
- **Fundo recortado por `clip-path` engana o medidor de contraste** (D72): o axe (Lighthouse) monta os
  fundos pelas caixas dos elementos e não enxerga o recorte. Uma caixa com fundo de cor só pode cobrir o
  texto que ela pinta de verdade; se o recorte esconde o fundo sobre outro texto, a `color-contrast`
  reprova esse texto (o "Lista" do seletor de modo, nota 96). Pseudo-elemento não resolve: o axe desiste
  de medir e deixa o texto sem conferência. E a caixa recortada fica em pixels inteiros, com folga em
  volta do recorte: o Chrome pinta a caixa em pixels inteiros, e uma caixa com fração come a borda dele.
- O `clearProps: "all"` do GSAP apaga o `style` inline **inteiro** do elemento, inclusive o que não
  foi o próprio GSAP quem pôs ali (cores e medidas em variáveis CSS escritas no HTML): passe a lista
  das propriedades que a animação mexeu, nunca `"all"` num elemento com estilo próprio (D52, revisão
  10b).
- O `.sr` (`base.css`) é `position: absolute`. Dentro de um lugar com `perspective` (os livros 3D), ele
  se prende a esse lugar e o Chrome muda a suavização do livro em alguns pixels: o elemento que leva o
  `.sr` precisa de `position: relative` (o `a.tomba` da `Colecao`, D73).

## Conferir

- Pelo MCP `chrome-devtools`, numa aba de contexto isolado (o Cesar usa as mesmas abas), nunca o
  `claude-in-chrome`. Larguras de 320 a 1600px, os dois temas, console limpo, sem rolagem lateral.
- Tremor, piscada ou efeito errado em animação: trace com screenshots e os quadros analisados um a um
  (congelar a View Transition engana).
- Depois de cada mudança visível: `npm run build` e reiniciar o preview na 4323, e pedir ao Cesar um
  Cmd+Shift+R (o dev guarda plugin antigo).
- Lixo de depuração vai para `.astro/depuracao/` e sai quando a rodada fecha.
