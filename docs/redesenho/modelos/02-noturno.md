# 02 · Noturno

Direção do modelo 02 do redesenho (D55). Quem constrói segue este arquivo, o
`docs/redesenho/README.md` e a API da base (`docs/redesenho/base.md`).

## Ideia

Uma sala de leitura à noite, **onde a luz é a interface**. A página fica na penumbra, e o cursor leva
uma luz morna que acende bordas, filetes e textura por onde passa. Os livros ficam num palco, cada um
sob o seu foco. O movimento é de luz, não de coisas: acender, apagar, varrer um feixe. Tudo é lento e
macio, e nada pula.

Serve a este blog porque põe o foco (literal) no que se lê. É calmo, elegante e diferente de tudo o
que a Grade é: escuro, com serifa, macio, em luz e em profundidade.

## Cara

**Cores (tokens do modelo).** Texto com contraste de pelo menos 4,5:1. A luz é um tom âmbar morno,
usado em fundo, brilho e traço, nunca em texto pequeno sobre o escuro sem conferir o contraste.

| Token | Escuro (principal) | Claro ("tarde nublada") | Uso |
|---|---|---|---|
| fundo | `#0B0C10` | `#EEEBE5` | a sala |
| superficie | `#12141A` | `#F7F5F1` | painéis, cards |
| elevada | `#1A1D25` | `#FFFFFF` | busca, menus |
| texto | `#E7E2D8` | `#1B1915` | texto |
| texto-2 | `#9A958C` | `#5F5A52` | metadados |
| filete | texto a 10% | texto a 12% | filetes de 1px |
| luz | `#FFCF8A` | `#B8741F` | a luz do cursor, focos, ativo |
| luz-suave | luz a 14% | luz a 12% | halos e fundos de hover |

No claro, a luz vira **sombra morna**: o cursor escurece de leve e aquece a superfície onde passa, e
os focos viram manchas de sol pela janela. É a mesma ideia com o sinal trocado, com a mesma
delicadeza. Os livros e as ilustrações usam as cores deles (ilhas da base).

**Textura.** Grão de filme muito fino e **parado** (um SVG de ruído em `background`, opacidade ~4%),
só no fundo. Sem animação de grão.

**Tipografia (Fontshare, licença ITF FFL; baixar com `npm --prefix redesenho run fontshare`).**

- **Zodiak** (variável 100 a 900 e itálico) nos títulos: fina e de alto contraste, 300 a 400 nos
  grandes e o itálico nos complementos.
- **Sentient** (variável 200 a 700 e itálico) no texto do artigo e na interface: 1,125rem em 1,72
  de entrelinha, medida de ~66 caracteres, texto claro sobre escuro com peso 380 a 400 (no escuro,
  a letra parece mais grossa).
- **JetBrains Mono** (raiz) no código e nos números pequenos.
- **Escala:**

  | Peça | Tamanho | Peso |
  |---|---|---|
  | nome na home | até ~7rem | Zodiak 300, entrelinha 0,95 |
  | H1 | de 2,4rem a 4,6rem | Zodiak 350 |
  | H2 | 1,7rem | Zodiak 400 |
  | metadados | 0,8125rem | Sentient 450, `tnum` |

**Forma.** Cantos de 14px nos painéis e 999px nas pílulas. Profundidade por luz, e não por sombra
preta: no escuro, a elevação é uma superfície mais clara com uma borda de luz a 8%.

**Ícones.** Traço de 1,25px, pontas redondas, grade de 24px, desenho próprio. No hover, o ícone
"acende": o traço vai do texto-2 à luz, com um halo de 6px por `opacity` de um pseudo-elemento.

**Marca "cs".** Um "cs" em Zodiak itálico dentro de um círculo fino. No hover, uma luz passa por
dentro do círculo, da esquerda para a direita, como o reflexo num vidro.

## Páginas

**Cabeçalho** (todas as páginas).

- Fixo, com fundo da sala a 80% e `backdrop-filter` leve só nele (um elemento, sem animar o
  desfoque).
- A marca à esquerda, a navegação ("Artigos", "Categorias", "Tags") no meio e, à direita, a busca e a
  **cordinha do abajur** (a troca de tema, abaixo).
- No celular, a marca, a cordinha e o botão de menu, que abre um painel na superfície elevada com os
  itens em Zodiak grande.

**Home.**

- **O palco:** no topo, "Cesar Schutz" em Zodiak fino e a apresentação de hoje em Sentient itálico.
  Abaixo, os 8 livros e a revista em **livros 3D** sobre uma "tábua" de luz: uma linha clara com um
  reflexo suave embaixo de cada livro, feito com um gradiente parado.
- **Artigos:** cards grandes, 2 por linha no computador. A ilustração do post fica num painel escuro
  com o palco tingido da cor do livro, como hoje nas ilhas. Embaixo, o assunto em Zodiak, o
  complemento em Sentient itálico, o livro e a data. O primeiro artigo é o destaque, na largura
  toda.
- No celular, uma coluna, e os livros numa fileira que rola na horizontal.

**Artigo.**

- **Topo:** o livro do artigo pequeno, à esquerda do título, "iluminado", e o título em Zodiak com o
  complemento em itálico.
- **Ilustração:** larga, num painel com cantos de 14px.
- **Texto** numa coluna de ~66 caracteres. O sumário flutua à direita (≥1280px), na superfície, e a
  seção atual fica "acesa" (texto na luz, com um ponto de luz à esquerda).
- **Código:** blocos na superfície, com borda de luz a 8%.
- **Fim:** anterior e próximo como dois cards com a ilustração do outro post, "apagados", que acendem
  no hover.

**Categorias.**

- "Categorias" em Zodiak e a frase de hoje.
- **O palco escuro:** uma fileira de 4 por linha (2 no tablet, 1 no celular), cada livro 3D **grande**
  (~360px de altura em 1440) sob **um foco próprio**: um cone de luz em gradiente radial parado acima
  dele e o reflexo no chão.
- Embaixo de cada livro, o título, a descrição e a contagem.

**Página do livro.**

- **O livro enorme** (até ~70vh), sob um cone de luz, com **poeira no feixe**: 12 a 16 partículas
  pequenas subindo devagar, só com `transform` e `opacity`, desligadas com movimento reduzido e fora
  da tela.
- Ao lado: o volume, o título em Zodiak, a descrição, os números e as tags do livro.
- Embaixo, os artigos do livro nos mesmos cards da home.
- Embaixo de tudo, os outros livros numa fileira, apagados, que acendem no hover.

**Tags.** Um céu de tags: as tags espalhadas em texto, com o tamanho pela contagem, em Sentient. No
hover, a tag acende e as outras escurecem um pouco.

**Tag.**

- "#Spring" em Zodiak, "9 artigos em 5 livros" e "Aparece junto com".
- **O filtro por livro são interruptores de luz:** uma fileira de "lâmpadas", uma por livro presente
  (a capinha plana do livro, ~48px, dentro de um círculo). A acesa tem um halo morno e o nome embaixo
  na luz.
- "Todos" é um interruptor à parte.
- A lista, nos cards.

## Os três momentos

**1. A abertura da home** (ao chegar de fora ou recarregar).

- Até ~2,5 s. Clique, tecla ou rodinha pulam para o fim.

| Tempo | O que acontece |
|---|---|
| 0 a 0,3 s | escuro total |
| 0,3 a 1,5 s | **um feixe de luz** atravessa o palco da esquerda para a direita (um gradiente elíptico largo que anda por `transform`, sobre uma máscara); cada livro "acende" quando o feixe passa por ele (opacidade de 0 a 1, com um brilho de borda que some em 0,6 s) |
| 1,2 a 1,9 s | o nome aparece como uma lâmpada que esquenta: a opacidade em dois degraus suaves (0 → .6 → 1), **sem piscar** |
| 1,6 a 2,4 s | a luz ambiente sobe: o cabeçalho, a apresentação e os cards chegam por opacidade, com 60 ms entre eles |

- No celular, ~1,8 s, com o feixe mais curto.

**2. A abertura das outras páginas.**

- A página nasce escura, e **a luz acende a partir do título**: uma máscara circular cresce do centro
  do título até cobrir a tela (`clip-path: circle()`, 0,9 s, `cubic-bezier(.2,.7,.2,1)`).
- O título já está aceso desde o começo, como se a lâmpada fosse ele.
- ~1,1 s.

**3. A troca de página** (navegando dentro do modelo).

- **Apagar e acender.** A página antiga escurece das bordas para o **ponto do clique** (uma vinheta
  que fecha até um círculo de ~80px, 0,35 s). Por um instante (0,08 s) só o ponto de luz fica. A
  página nova acende a partir do mesmo ponto (o círculo cresce até cobrir, 0,5 s).
- **Técnica:** View Transitions entre documentos. O ponto do clique vai no `sessionStorage` (na
  página antiga, no `pageswap` ou no clique), e o `::view-transition-old(root)` e o `-new(root)` são
  animados com `clip-path: circle()`. Reponha o `mix-blend-mode: plus-lighter`, se usar as animações
  padrão.
- **Voltando pelo histórico** (sem ponto), a luz vem do centro da tela.

## Categorias: o desfile e os livros grandes

**O desfile ("acender os focos")** toca sempre que Categorias aparece.

- Os focos acendem um a um, da esquerda para a direita e de cima para baixo, com 110 ms entre eles.
- Cada foco é um cone de luz que surge por opacidade (0,5 s) e o livro sob ele, que aparece com
  opacidade e `scale(.98 → 1)` (0,6 s).
- O reflexo no chão aparece por último. Total de ~1,6 s.

**No hover de um livro:**

- ele gira em 3D seguindo o mouse (`rotateY` de ±14° e `rotateX` de ±6°, por variáveis no `pointermove`
  com lerp e parada, só com `transform`);
- um **reflexo de luz** atravessa a capa, numa faixa clara diagonal, em camada por cima, com
  `translateX` e opacidade até 12%, **sem mudar o desenho**;
- o foco dele fica mais forte e os outros baixam a 70%.
- Com o teclado, o foco faz o mesmo sem a inclinação.

## Filtro da tag

- No clique numa lâmpada, ela "acende": o halo cresce de 0 a 1 em 0,35 s, e a anterior apaga.
- Os artigos que saem **apagam** (opacidade a 0 e 1% de escala, 0,25 s) e depois deixam o lugar (FLIP
  com `transform`, 0,4 s). Os que entram acendem com 50 ms entre eles.
- O total conta até o número novo.
- Usa os eventos `filtro:antes` e `filtro:depois` da base.

## Troca de tema: a cordinha do abajur

- No cabeçalho, uma **cordinha** fina pendurada de um pequeno abajur (desenho próprio). No hover, ela
  balança como um pêndulo (uma vez, amortecido, 0,9 s, só `rotate`).
- **Clique ou arraste para baixo e solte:** a cordinha estica, volta com mola e o tema troca.
  - Indo para o claro, a luz se espalha em círculo a partir do abajur (View Transition, 0,6 s).
  - Indo para o escuro, a sala escurece de fora para dentro, até o abajur.
- Com o teclado, Enter ou Espaço no botão da cordinha fazem o mesmo. O rótulo acessível é "Acender
  a luz" ou "Apagar a luz".

## Catálogo de detalhes

Todos também com o foco do teclado. Curva padrão `cubic-bezier(.2,.7,.2,1)`. Hover assimétrico: entra
em 0,25 s e sai em 0,5 s, como a luz que demora a apagar.

1. **A luz do cursor:**
   - um disco de luz de ~420px, muito suave, segue o cursor sobre o fundo (um elemento fixo com
     `radial-gradient`, movido por `transform` com lerp e parada);
   - some quando o mouse sai da janela e fica desligado com toque ou movimento reduzido.
2. **Bordas que acendem:** nos cards, uma borda de 1px de luz acende só perto do cursor (uma máscara
   radial com `--x/--y` no card sob o mouse; os outros cards não recalculam).
3. **Card de artigo:**
   - no hover, a borda acende, a ilustração ganha +4% de brilho numa camada e o título vai à luz;
   - uma seta fina entra da esquerda.
4. **Menu:** no hover, o item acende (o texto vai à luz) e um ponto de luz de 4px aparece embaixo. O
   item atual fica aceso, e o ponto desliza para o item novo na troca de página.
5. **Marca:** um reflexo passa por dentro do círculo (0,7 s).
6. **Busca:**
   - o campo acende a borda no foco, e ⌘K abre a janela na superfície elevada, que acende do centro
     (opacidade e `scale(.98 → 1)`, 0,3 s);
   - os resultados acendem um a um (40 ms);
   - com as setas, um halo desliza entre eles;
   - o termo aparece na luz no título.
7. **Cordinha do tema:** o balanço no hover e o puxão no clique (veja acima).
8. **Links do texto:** sublinhado fino no texto-2; no hover, ele se enche de luz da esquerda para a
   direita (0,3 s) e a letra esquenta levemente (a cor vai ao texto com um tom da luz).
9. **H2 do artigo:** no hover, um pequeno ponto de luz aparece à esquerda e o clique copia o link; um
   aviso "Link copiado" acende e apaga (1,4 s).
10. **Sumário:** a seção atual acesa, com o ponto de luz à esquerda deslizando entre as seções (trilho
    com `translateY`).
11. **Progresso:** um filete de luz no topo, com uma **brasa** na ponta (um ponto mais claro), ligado à
    rolagem (só CSS).
12. **Copiar código:** o ícone acende, e no clique vira um visto que "queima" em luz e volta a apagar
    em 1,6 s. O rótulo "Copiado" acende junto.
13. **Anterior e próximo:** os cards apagados acendem no hover (a ilustração vai de 55% a 100% de
    opacidade em 0,4 s).
14. **Voltar ao topo:** um círculo pequeno com uma seta. No hover, a seta sobe como uma fagulha e
    volta.
15. **Livro na fileira da home:** no hover, o foco dele acende e o livro gira 6° na direção do mouse.
16. **Livros da página do livro:** a poeira no feixe e os outros livros que acendem no hover.
17. **Céu de tags:** a tag sob o mouse acende e as outras baixam para 60%.
18. **Pílulas das tags no artigo:** a borda acende no hover.
19. **Seleção de texto:** fundo de luz a 30% e texto no texto.
20. **Foco pelo teclado:** anel de luz de 2px com halo de 4px a 30%, com cantos que acompanham o
    elemento.
21. **Rodapé:** "Boa leitura." em Zodiak itálico e uma lamparina pequena que acende no hover das redes.
22. **Imagem de erro ou vazia** (filtro sem posts): "Nada aceso aqui." em Zodiak itálico.

## Técnica

- **CSS** para os hovers (`opacity`, `transform`), as máscaras e o progresso por rolagem.
- **JS pequeno** para a luz do cursor (rAF só enquanto se move), as bordas que acendem (`--x/--y` só
  no card sob o mouse), a inclinação dos livros e a cordinha. Tudo com parada e desligado sem mouse
  fino.
- **GSAP sob demanda** só se precisar da mola da cordinha. Uma mola em `linear()` (veja as referências)
  resolve sem biblioteca.
- **View Transitions** para a troca de página e de tema.
- **Nada de animar `filter`** (brilho, desfoque) em áreas grandes: o brilho é uma camada com opacidade.
  O `backdrop-filter` fica só no cabeçalho, parado.
- **Riscos:** o gradiente radial que segue o cursor repinta a área dele. Mantenha-o num elemento
  próprio, com `will-change: transform`, e meça com a CPU 4× mais lenta.

## Referências usadas

`docs/redesenho/referencias.md`:

- a luz que segue o cursor do microkit e o lerp com parada do kinetics;
- o card que inclina com brilho do soralabs e do uiable;
- o tema em círculo do uiable;
- a elevação por superfície no escuro do Backpack;
- as fontes Zodiak e Sentient, do Fontshare.

## O que não fazer (para não virar outro modelo)

- **Grade e números:** nada de grade à vista nem de números de índice (Grade).
- **Formas:** nada de formas coloridas nem de mola exagerada (Cinético).
- **Espaço:** nada de sala em 3D nem de câmera (Biblioteca). Aqui o 3D é só do livro, e a luz é que
  cria o espaço.
- **Movimento de texto:** nada de texto que embaralha ou que se digita (Terminal e Índice).
- **Luz:** nada de neon, brilho saturado ou gradiente colorido. A luz é uma só, morna.

## Retorno do Cesar

(vazio)
