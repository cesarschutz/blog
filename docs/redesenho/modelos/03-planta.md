# 03 · Planta

Direção do modelo 03 do redesenho (D55). Quem constrói segue este arquivo, o
`docs/redesenho/README.md` e a API da base (`docs/redesenho/base.md`).

## Ideia

O blog como **prancha de desenho técnico**: o caderno de um arquiteto de soluções. Tem papel
milimetrado, carimbo de prancha, cotas, chamadas numeradas, linhas de construção e hachuras. **Tudo é
medido e anotado:** passar o mouse num card faz aparecerem as cotas dele (com a medida real, em px);
o cursor é uma mira com réguas nas bordas; a abertura *plota* a prancha traço a traço. É técnico, mas
elegante, como um desenho de arquitetura bem acabado. Não é um "tema hacker".

Serve a este blog porque é o ofício do autor desenhado: sistemas, medidas e decisões anotadas.

## Cara

**Cores (tokens do modelo).** Texto com contraste de pelo menos 4,5:1.

| Token | Escuro (principal, "cianotipia") | Claro ("papel vegetal") | Uso |
|---|---|---|---|
| prancha | `#0E2A47` | `#F1F4F2` | fundo |
| prancha-2 | `#123357` | `#E7ECEA` | painéis, carimbo |
| traco | `#DCE9F5` | `#1C3A5E` | texto e traço principal |
| traco-2 | `#8FB0CF` | `#4F6B87` | texto secundário, cotas |
| malha | traco a 7% | traco a 8% | a malha milimetrada (1 linha a cada 8px, e uma mais forte a cada 40px) |
| construcao | traco a 22% | traco a 25% | linhas de construção, tracejadas |
| marca | `#FFB547` | `#C2410C` | o destaque: cota ativa, item atual, foco (a caneta de revisão do desenhista) |

No claro, é um desenho a nanquim azul sobre papel vegetal levemente esverdeado. No escuro, uma
cianotipia (blueprint). Os livros e as ilustrações entram como estão (ilhas), cada um num "quadro de
detalhe" com borda de traço e rótulo.

**Tipografia.**

- **Supreme** (Fontshare, variável 100 a 800) nos títulos: construída e de traço uniforme, como letra
  de normógrafo.
- **Bespoke Sans** (Fontshare, variável) no texto do artigo: humanista e legível, 1,0625rem em 1,68.
- **Tabular** (Fontshare, mono sem serifa) nas cotas, no carimbo, nos números e no código de
  interface. Código dos posts em JetBrains Mono (raiz).
- Os títulos em caixa normal, com espaçamento levemente aberto (+0,01em). Nada de caixa alta.

**Forma.**

- Cantos vivos, traço de 1px e tracejado de construção (`6 4`).
- **Marcas de registro** (cruz "+") nos cantos dos painéis.
- Hachura a 45° em fundo de destaque (um padrão SVG parado).

**Ícones.** Símbolos técnicos próprios, traço de 1,25px e ponta quadrada:

- lupa como círculo com mira;
- tema como a meia-lua de um corte (símbolo de seção);
- seta de chamada;
- marcador de nível;
- elo como corrente de cota.

No hover, o ícone é "redesenhado": o traço se apaga e se desenha de novo por `stroke-dashoffset`
(0,35 s).

**Marca "cs".** O "cs" dentro de um **carimbo de prancha** pequeno: um retângulo dividido com
"cs" / "fl. 01". No hover, as linhas do carimbo se redesenham.

## Páginas

**Cabeçalho.** Uma faixa fina com a marca, a navegação como **abas de prancha** ("A1 Artigos",
"A2 Categorias", "A3 Tags") e, à direita, a busca e o tema. **Réguas** graduadas nas bordas de cima e
da esquerda da página, com uma marca a cada 10px e o número a cada 100px, em Tabular pequeno. Elas só
aparecem com mouse, ≥1024px.

**Carimbo** (rodapé de toda página): um carimbo de prancha de verdade, com projeto "blog", autor
"Cesar Schutz", folha (o nome da página), escala "1:1", data (o dia de hoje em pt-BR) e revisão "R0".
É o rodapé do site.

**Home.**

- **Planta geral:** o nome "Cesar Schutz" em Supreme grande, com uma cota horizontal embaixo
  medindo a largura dele em px ("← 842 px →").
- A apresentação como **nota de projeto**, numerada: "1. Publico aqui o que ando estudando…".
- **A coleção como "Detalhe A":** os 8 livros e a revista, livros 3D numa fileira dentro de um quadro
  de detalhe tracejado, cada um com uma chamada numerada (bolinha com o número) ligada por uma linha de
  chamada ao nome dele.
- **Artigos:** cards como **pranchas pequenas**, 3 por linha no computador. Cada uma tem:
  - a ilustração no quadro de detalhe;
  - o título em Supreme;
  - um mini-carimbo com o livro, a data e a leitura;
  - as marcas de registro nos cantos.

**Artigo.**

- Carimbo no topo (livro, data, leitura e folha "028"). O título em Supreme e o complemento em Bespoke
  Sans itálico. A ilustração no "Detalhe 1", com o rótulo embaixo ("DET. 1 — <título>", em Tabular e
  caixa normal).
- Texto em coluna de ~68 caracteres.
- **Títulos** com um símbolo de corte (círculo dividido, com o número da seção em cima e a folha
  embaixo).
- **Notas laterais** como chamadas na margem.
- **Código** num quadro com cabeçalho "ESPEC." (em Tabular e caixa normal: "Espec. · java").
- **Sumário** à esquerda (≥1280px), como a "lista de folhas" de um projeto, com a seção atual marcada.

**Categorias.**

- **Prancha de detalhes:** 4 quadros de detalhe por linha (2 no tablet, 1 no celular), cada um com o
  livro 3D **grande** (~340px em 1440) e **cotas** à volta: a altura do livro de um lado, a largura
  embaixo, com setas e o valor ("Vol. 01", "7 artigos" nas chamadas).
- O nome do livro e a descrição embaixo, no rótulo do detalhe.

**Página do livro.**

- **"Detalhe A — Arquitetura de Software":** o livro **enorme** à esquerda, com linhas de construção
  saindo dele (as projeções, tracejadas) e chamadas numeradas apontando para o título, o volume e a
  contagem.
- À direita, a descrição, as tags e a **lista de artigos** como a "lista de folhas" do volume
  (fl. 01, fl. 02…).
- Embaixo, os outros volumes em lombadas, como uma legenda.

**Tags.** A "legenda" do projeto: uma tabela de símbolos, com o ícone da tag, o nome e a contagem, em
3 colunas, com filetes.

**Tag.**

- "#Spring" em Supreme e a nota "9 artigos em 5 livros".
- **O filtro por livro são as camadas do CAD:** um painel "Camadas" com uma linha por livro presente
  (um quadradinho de visibilidade, a cor do livro, o nome e a contagem).
  - Desligar uma camada faz os artigos dela virarem **contorno tracejado apagado** e irem para o fim
    (FLIP).
  - "Isolar" (o clique no nome) deixa só aquela camada.
  - É o filtro por livro com a cara do modelo: a camada isolada é o `?livro=`.
- A lista, nas pranchas pequenas.

## Os três momentos

**1. A abertura da home: a prancha é plotada.** Até ~2,5 s; clique, tecla ou rodinha pulam.

| Tempo | O que acontece |
|---|---|
| 0 a 0,4 s | a malha milimetrada aparece por esmaecimento, primeiro as linhas fortes e depois as finas |
| 0,2 a 1,0 s | as margens e o carimbo se desenham (traços por `stroke-dashoffset`, em velocidade constante, `linear`, como um plotter) |
| 0,6 a 1,4 s | o nome é "plotado": um traço de contorno percorre as letras (SVG do contorno ou `clip-path` que varre da esquerda para a direita), e o preenchimento entra atrás |
| 1,0 a 2,0 s | os livros: primeiro o contorno de cada livro se desenha (um retângulo tracejado do tamanho dele) e o livro aparece dentro do contorno, um de cada vez, com 70 ms entre eles; as chamadas numeradas se desenham em seguida |
| 1,8 a 2,4 s | a cota do nome se abre das pontas para o centro e o número conta até a largura real |

**2. A abertura das outras páginas.** O **carimbo desliza** para o canto (0,4 s). O título é plotado
(a varredura por `clip-path`, 0,6 s) e o conteúdo entra de cima para baixo como se o plotter
imprimisse faixa por faixa (`clip-path` em degraus, 0,6 s). ~1,3 s.

**3. A troca de página: a janela de zoom do CAD.**

- No clique, um **retângulo de seleção** tracejado nasce no elemento clicado (o card ou o link, com a
  medida dele) e cresce até a tela inteira (0,4 s). A página antiga esmaece por trás.
- A página nova aparece dentro do retângulo, que "assenta" na margem da prancha (0,35 s).
- Técnica: View Transitions entre documentos. O retângulo do clique vai no `sessionStorage` (x, y, w,
  h), e o `::view-transition-new(root)` anima um `clip-path: inset()` do retângulo até a tela.
- Voltando pelo histórico, o zoom é o inverso (encolhe até o centro).

## Categorias: o desfile e os livros grandes

**O desfile (as pranchas saem da pilha).** Toca sempre que Categorias aparece.

- Primeiro, as marcas de registro dos quadros aparecem.
- Depois, os quadros se desenham (as bordas por `stroke-dashoffset`, 0,4 s, com 70 ms entre eles), e
  o livro aparece dentro de cada um.
- Por fim, **as cotas se abrem** (as linhas crescem das pontas e os números contam).
- Total de ~1,6 s.

**Hover num quadro:**

- as cotas ganham a cor de marca e os números "remedem" (rolam);
- aparece uma chamada extra "Abrir detalhe →";
- o livro gira de 38° para 24°.

## Filtro da tag

- Camada desligada: o card vira contorno tracejado (a opacidade do conteúdo cai a 0 e o tracejado
  aparece, 0,3 s) e depois desce para o fim da lista (FLIP, 0,45 s).
- Isolar: todas as outras camadas se desligam em cascata (40 ms).
- O total ("9 de 9 folhas") conta até o valor novo.

## Troca de tema

**De cianotipia a vegetal** (View Transition): o tema novo "revela" a prancha como um papel
fotossensível. Uma **faixa de luz** larga e reta varre a tela de cima para baixo (`clip-path`,
0,65 s), com uma linha de construção tracejada na borda da faixa. No hover do botão, o símbolo de corte
gira 90°.

## Catálogo de detalhes

Todos também com o foco do teclado. Movimento de plotter: `linear` nos traços que se desenham e
`cubic-bezier(.3,.7,.2,1)` no resto.

1. **Cotas no hover** (os cards de artigo e os quadros de Categorias): linhas de cota se desenham em
   volta do card (a de cima e a da direita), com setas nas pontas e a medida real em px no meio (lida
   uma vez no `pointerenter`, com `getBoundingClientRect`). 0,3 s. Somem ao sair (0,2 s).
2. **Cursor em mira** (≥1024px, com mouse): o cursor nativo continua, e **duas linhas de construção**
   finas atravessam a tela na posição do cursor. Nas réguas das bordas, uma marca indica a posição, e
   um rótulo mostra "x 824 · y 312" no canto de baixo. Tudo por `transform`, com rAF só enquanto o
   mouse se move. Some ao parar por 2 s e ao sair da janela.
3. **Cursor magnético nos botões:** sobre um botão ou link de interface, as linhas da mira se prendem
   às bordas do alvo, enquadrando-o (0,2 s).
4. **Links do texto:** sublinhado tracejado de construção; no hover, ele vira sólido na cor de marca,
   desenhando-se da esquerda (0,25 s).
5. **Menu (abas da prancha):** no hover, a aba ganha a borda de cima desenhada. A aba atual fica com
   a borda de marca, que desliza para a aba nova na troca de página.
6. **Marca/carimbo:** as linhas do carimbo se redesenham no hover.
7. **Busca:**
   - abre como um **quadro de detalhe** que se desenha a partir do campo (borda por
     `stroke-dashoffset`, 0,3 s);
   - os resultados vêm numerados como uma lista de folhas;
   - com as setas, a chamada (bolinha com o número) salta de um resultado para o outro.
8. **Tema:** o símbolo de corte gira 90° no hover, e a revelação da faixa vem no clique.
9. **Títulos do artigo:** no hover, o símbolo de corte se redesenha, e o clique copia o link, com a
   chamada "copiado" desenhada ao lado (1,2 s).
10. **Sumário (lista de folhas):** a seção atual ganha uma seta de chamada que desliza entre os itens.
11. **Progresso:** uma **régua** vertical na margem direita do artigo, com a marca de nível descendo
    conforme a rolagem (só CSS) e a porcentagem em Tabular.
12. **Copiar código:** o ícone se redesenha, e no clique vira um visto desenhado; o rótulo passa a
    "copiado", em Tabular.
13. **Anterior e próximo:** duas pranchas pequenas; no hover, as cotas aparecem e a seta de chamada
    se estica.
14. **Voltar ao topo:** o marcador de nível (triângulo sobre uma linha); no hover, ele sobe um degrau
    e volta.
15. **Livro na fileira da home:** no hover, a chamada numerada dele se destaca (a bolinha na cor de
    marca), a linha de chamada se redesenha e o livro sobe 6px.
16. **Página do livro:** as projeções tracejadas saem do livro ao carregar, e no hover das chamadas o
    ponto do livro que ela aponta é destacado por um pequeno círculo.
17. **Legenda de tags:** no hover, o símbolo (ícone) da tag se redesenha e a linha inteira ganha a
    hachura suave.
18. **Pílulas das tags:** as marcas de registro nos cantos aparecem no hover.
19. **Carimbo do rodapé:** passar o mouse pelo campo "data" mostra a data da última revisão do post
    (no artigo) ou do blog, por `title` e numa pequena chamada.
20. **Seleção de texto:** fundo em hachura da cor de marca a 30%.
21. **Foco pelo teclado:** um retângulo tracejado de marca com 3px de afastamento e marcas de registro
    nos cantos.
22. **Esc em qualquer painel:** o painel se "apaga" (o traço volta pelo `stroke-dashoffset`, 0,2 s).

## Técnica

- **Traços que se desenham:** SVG com `pathLength="1"` e `stroke-dashoffset` (só pinta a caixa do
  próprio SVG).
- **Cotas** num SVG sobreposto, posicionado por `transform`, com a medida calculada uma vez no
  `pointerenter`, nunca a cada quadro.
- **Mira:** duas linhas fixas (`position: fixed`, 1px) movidas por `transform`, com rAF só enquanto há
  movimento.
- **Malha milimetrada:** `repeating-linear-gradient` parado no fundo.
- **Hachura:** um `pattern` SVG em `background`, parado.
- **GSAP** só se precisar de sequência longa na abertura (sob demanda); a Web Animations API costuma
  bastar.

## Referências usadas

`docs/redesenho/referencias.md`:

- o modo "Inspect" do kobra (réguas em px);
- as cotas que se desenham na rolagem do animejs;
- as cruzes "+" nos cantos do uiable;
- o cursor magnético do uiable;
- as fontes Supreme, Bespoke Sans e Tabular, do Fontshare;
- o método de tokens do Backpack.

## O que não fazer (para não virar outro modelo)

- **Grade:** nada de grade de colunas nem de índice numerado em tabela (Grade). Aqui a malha é
  milimetrada, e o que se numera são as chamadas e as folhas.
- **Luz:** nada de luz, brilho ou grão (Noturno).
- **Terminal:** nada de terminal nem de texto digitado (Terminal).
- **Mola:** nada de mola ou quique (Cinético). O movimento é de plotter: constante e preciso.

## Retorno do Cesar

(vazio)
