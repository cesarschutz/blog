# Rodada 2 do redesenho: controle

**Fonte primária:** `retorno-cesar.md` (o texto do Cesar, sem edição). Este arquivo resume, numera e
distribui os pedidos dele pelos protótipos. **Em caso de dúvida, vale o texto dele.** Quem constrói
um protótipo lê os dois.

## Como é feito

- **Base de todos os protótipos novos: o blog atual** (`origin/main` 07731b1, com os livros realistas
  da D57 e os recursos da D58), na ordem de preferência do Cesar: 1) atual, 2) 02 Noturno, 3) 01
  Grade, 4) 09 Biblioteca. "A ideia é melhorarmos e não piorarmos."
- **Cada protótipo é uma cópia isolada do blog atual** em `redesenho/novos/NN-nome/`, com a sua porta.
  O blog de verdade (`src/` da raiz) não é tocado.
- **Os 10 modelos da rodada 1 ficam como estão**, em <http://127.0.0.1:4400>.
- **Agentes:**

  | Tarefa | Agente | Modelo e esforço |
  |---|---|---|
  | Preparar as cópias, a busca e a conferência | `redesenho-base` | Sonnet 5.5, alto |
  | Construir um protótipo | `redesenho-construtor` | Opus 5.5, alto |
  | Prompt do 06 para o dev-note | `redesenho-documentador` | Sonnet 5.5, alto |
  | Conferir, quando precisar | `redesenho-conferente` | Sonnet 5.5, médio |

- **Ritmo:** três protótipos ao mesmo tempo (11, 12 e 13) e depois dois (14 e 15). O Cesar pediu
  equilíbrio entre demora, gasto e qualidade.

## Obrigatórios em todos os protótipos (o que o Cesar marcou como "tem que ter")

| # | Pedido |
|---|---|
| O1 | **Não mexer no conteúdo dos posts:** texto, caneta (marcações), lousas, figuras, desenhos e as regras de desenho continuam como são. |
| O2 | **Atalhos do artigo** (passar de post, espaço etc.) e a **ficha dos atalhos** abrindo como hoje. |
| O3 | **A caneta que passa lá em cima** (o progresso da leitura no fio do cabeçalho). |
| O4 | **A marca d'água com o desenho do livro, grande**, no post. |
| O5 | **Filtrar uma tag por livro** (estar numa tag e ver só os posts dela num livro). |
| O6 | **Os livros como estão desenhados** (a capa dura realista da D57) e a **caidinha para a frente**, alternando os livros. |
| O7 | **A luz de fundo que acompanha o mouse** (a do 02). |
| O8 | **O brilho no livro ao passar o mouse, em toda tela que tem livro**, e o livro que segue o mouse (o 02). |
| O9 | **O lustre com a cordinha para trocar o tema**, com o balanço no hover (o 02). A animação de hoje, um tema abrindo e o outro fechando, também é de que ele gosta. |
| O10 | **Séries separadas das categorias**, em telas próprias: vão existir mais séries e mais livros. |
| O11 | **O extra do 06** (ver abaixo), feito de um jeito diferente em cada protótipo. |

## O que ele gosta no atual (manter o espírito)

| # | Onde | Pedido |
|---|---|---|
| A1 | Home | **A abertura focada nos livros** (os livros vão para onde ficam). |
| A2 | Home | **A prateleira de livros.** |
| A3 | Home | **Cards e lista, valorizando as imagens nos dois.** |
| A4 | Home | **O caderno "cs"** que abre e fecha, grande e pequeno no cabeçalho, com o riscado embaixo; no hover, ele abre um pouco. Ele gosta dos detalhes. |
| A5 | Home | **Abrir o livro grande e folheá-lo** (o livro ampliado). |
| A6 | Artigos | **Filtrar pela estante de livros**, com lista e cards como na home. |
| A7 | Categorias | **Os livros grandes**, a animação dos cards (se não houver cards, algo assim com os livros) e o giro do livro no hover. |
| A8 | Livro | **Trocar de livro com animação**, guardando o antigo e pegando o novo. |
| A9 | Livro | **Abrir o livro grande e folhear.** |
| A10 | Tags | **Os ícones, com movimento no hover**, os livros pequenos mostrando em que livros a tag está e a entrada dos cards. |
| A11 | Tag | **O ícone como marca d'água.** |
| A12 | Post | **A imagem grande**, o livro do post, o **post-it "Neste artigo"** com os títulos e o anterior/próximo. |
| A13 | Geral | **A abertura das outras páginas** (o caderno fecha e voa até o cabeçalho; "a união da animação com como a tela fica"). |
| A14 | Geral | **A troca de tema** abrindo e fechando. |
| A15 | Geral | **O rodapé com impressão de profissionalismo.** |
| A16 | Busca | **No hover dos resultados, a caneta ao lado e o efeito da pintura.** |

## O que ele gostou nos modelos (para encaixar onde fizer sentido)

| # | De | Pedido |
|---|---|---|
| G1 | 01 | **Melhor aproveitamento da tela**, o "Cesar Schutz" grande, os números (28 artigos, 9 livros, 20 tags) e o cabeçalho que muda em tela pequena. |
| G2 | 01, 02 | **Livros lado a lado. Em tela pequena, nada de rolagem lateral:** os livros vão virando e ficam só com a lombada à vista, um do lado do outro, como na home atual. É uma animação ligada à largura da tela. |
| G3 | 01 | **"Cesar Schutz" gigante cortado ao meio no rodapé**, com uma respiração discreta de peso (do 08, sem ficar fino demais). |
| G4 | 01 | **Hover em Categorias pinta a célula da cor do livro** ("muito melhor" que só girar), nos dois temas. |
| G5 | 01 | **Os artigos girando ao entrar na página do livro**, e a página que "monta" ao entrar. |
| G6 | 01, 08 | **O livro bem grande na página do livro.** "Grandão, só o livro, e os posts abaixo" (08). |
| G7 | atual, 01 | **A pilha do lado esquerdo perde espaço.** Levar os livros para cima, como a estante da home, em cima do card do livro; ao rolar, eles diminuem. O livro grande fica embaixo da pilha, e a animação põe o livro na pilha e abre o novo grandão. |
| G8 | 01 | **Na tag em lista, em tela grande:** a imagem à esquerda e o livro à direita (ou o livro numa coluna). Em todo lugar, valorizar as imagens; a lista nunca fica sem imagem. |
| G9 | 01, 02 | **No post:** o índice de seções **abaixo da imagem**, com a imagem ocupando a largura; o cabeçalho do post **abaixo** da imagem, não ao lado. **O texto não pode ficar estreito demais.** |
| G10 | 01 | **A troca de página com a cortina** (o claro ou o escuro passando com o nome do destino) **e depois a página montando** com animação. |
| G11 | 01, 05 | **A busca maior, abrindo para baixo do cabeçalho.** |
| G12 | 02 | **A abertura do 02**, "elegante". |
| G13 | 02 | **Cards grandes com pouco texto**, valorizando a imagem, mas **4 por linha** como hoje. **Card é o padrão na primeira vez**; a escolha é lembrada. A lista fica como a atual, com mais texto. Os cards têm os **ícones** de data e tempo e as tags. |
| G14 | 02 | **O destaque com a imagem à esquerda.** |
| G15 | 02 | **A luz em cima do livro**, no hover ou fixa (em Categorias), e o fundo atrás dos livros. |
| G16 | 02 | **A nuvem de tags:** as palavras com o tamanho pela contagem (até um máximo), **com os ícones**. |
| G17 | 02 | **No post, o livro em cima ficou elegante**, mas deve ser o **livro de lado com as etiquetas** que já existe. |
| G18 | 03 | **O rodapé com uma ficha** (autor e dados). A troca de página dele, "simples, mas elegante". |
| G19 | 04 | **As tags do livro em volta do livro.** Melhor: arrumadas e próximas, porque um livro pode ter muitas tags. O clique na tag do livro **já abre a tag filtrada por aquele livro** (hoje não abre). |
| G20 | 04 | **A animação do menu no hover** (o texto que rola). O post "clean, elegante". |
| G21 | 05 | **Categorias revelando as coisas ao rolar** (como o site da Apple). |
| G22 | 05 | **O filtro da tag como um fichário de separadores**, mas que funcione com muitos livros. |
| G23 | 05 | **Anterior e próximo com a imagem do post**, menor que no 05. |
| G24 | 06 | **A página de todos os livros como o `tree`** (o painel de pré-visualização), mostrando também **a imagem do post sob o mouse**. |
| G25 | 09 | **A estante**, que é o modelo que mais combina com o atual. Mas **não pode ter todos os artigos**: são cada vez mais. |
| G26 | 09 | **Fichas** (como nos "recém-catalogados") para os artigos, em card e em lista. |
| G27 | 09 | **As gavetas com as letras** na página de Tags, com uma opção "Todas" que abre todas. As tags como fichas, mas com a vida do atual: o ícone valorizado, três artigos e "ver todos". |
| G28 | 09 | **O post como uma folha grande:** dentro da folha, a imagem e o cabeçalho e, embaixo, o livro **como um adesivo colado no papel** e o índice (o de hoje). Com as cantoneiras da imagem. |
| G29 | 09 | **O modo escuro não tão escuro.** |
| G30 | 09 | **A ficha de empréstimo no rodapé, com o carimbo da data de hoje** e a animação do carimbo, **com os ícones animados** do GitHub, do LinkedIn e do RSS. A cordinha do voltar ao topo, e a setinha de subir sempre à mão no post. |
| G31 | 10 | **O texto que aparece embaralhando e assenta.** |

## O que ele não quer

| # | Não quer |
|---|---|
| N1 | **Vermelho** como cor de destaque. |
| N2 | **A troca de página colorida e piscando** (a do 04). |
| N3 | **Cores demais**, "meio afeminado" (o 04). |
| N4 | **Texto do artigo fino demais** ou em coluna estreita demais. |
| N5 | **Telas "mortas"**, simples demais (o 09). |
| N6 | **Telas poluídas**, cheias de linhas (o 03). |
| N7 | **Rolagem lateral de livros** no celular. |
| N8 | **A imagem num lugar só**, trocando ali (a pré-visualização fixa do 01). |
| N9 | **Aumentar a imagem do post no hover** (o 10). |
| N10 | **Nome em peso fino demais** (o 08). |
| N11 | **Nada que não cresça:** os livros, as séries, as tags e os posts vão aumentar. A estante com todos os artigos e as abas de fichário fixas não servem. |
| N12 | O 07 Galeria inteiro. |

## O extra do 06 (O11): o computador ou o terminal

Um elemento **sempre visível** em todas as telas, num canto, que **abre um "computador"** para ver os
livros como arquivos. O foco desta rodada é **como se acessa e a animação de abrir e de sair**. O que
aparece dentro pode ser simples e melhora depois.

Dentro, o mínimo é:

- a árvore ou as pastas dos livros e das séries, com os posts;
- **no hover de um post, a imagem dele** (e o livro);
- abrir o post no formato do protótipo.

Cada protótipo faz de um jeito: terminal, `.md`, vim, pasta do Mac ou PDF.

## Os cinco protótipos

| # | Nome | Porta | Base e mistura | O extra |
|---|---|---|---|---|
| 11 | Atual em cards | 4411 | **O atual quase intacto, com os cards de hoje** (o pedido "faça um a mais com cards como é hoje"). Mais: O7, O8, O9, O10, G2, G4, G7, G13 (com os cards de hoje), G19, G23, G30, G3. | **Terminal em tela cheia, no estilo do 06:** o botão `>_` num canto; abre crescendo do botão; dentro, a árvore, a pré-visualização do livro e a imagem do post no hover; abrir o post como `.md`, com números de linha. |
| 12 | Papelaria viva | 4412 | **O atual com a biblioteca do 09, mas vivo** (N5). Mais: G26 (fichas em card e em lista), G27 (gavetas das tags, com "Todas"), G28 (o post em folha com o adesivo do livro e o índice), G29, G30, O7, O8, O9, G15. | **Ir para o computador:** um computador pequeno desenhado na mesa ou no canto; no clique, a câmera vai até ele (zoom na tela) e a tela vira a área de trabalho, com uma janela de pastas (livros) e os posts como **PDF** num visualizador de páginas. "Sair do computador" faz o caminho de volta. |
| 13 | Luz | 4413 | **O atual com a linguagem de luz do 02.** Mais: G12 (a abertura elegante, sobre a estante), G13 (cards grandes, 4 por linha, com ícones), G14, G15, G16, G17, G9, O7, O8, O9, G2. | **Vim:** o ícone do Vim num canto; abre uma janela de terminal que cresce do ícone; dentro, um vim com a árvore (NERDTree: livros e posts), a imagem do post no hover, o post como buffer com números de linha e a linha de status; `:q` fecha com animação. |
| 14 | Grade suave | 4414 | **O atual com o espaço e a tipografia grande do 01, nas fontes e no azul-tinta do atual (sem vermelho).** Mais: G1, G2, G3, G4, G5, G6, G7, G8, G9, G10 (a cortina com o nome e a montagem), G11, G20. | **Pasta do Mac (Finder):** um ícone de pasta fixo num canto, como um Dock mínimo; abre com o efeito "gênio" (escala a partir do ícone) numa janela de Finder em colunas: livros, depois posts, depois a pré-visualização com a imagem do post e o livro; abrir o post o mostra no "Pré-Visualização", como **PDF** (páginas brancas com sombra). |
| 15 | Estante viva | 4415 | **O atual com os livros em primeiro plano.** Mais: G6 ("grandão, só o livro e os posts abaixo"), G19 (as tags arrumadas em volta do livro, levando à tag filtrada), G21 (a revelação ao rolar em Categorias), G22 (um fichário que escala), G23, G31 (os títulos que embaralham e assentam), O6, A5, A9, G24 (a página de todos os livros como `tree`, com a imagem do post). | **Terminal que desce do topo** (estilo Quake): a tecla `` ` `` ou o botão sempre visível; ocupa meia tela, com comandos simulados (`ls`, `tree`, `cat`, `open`); `open <post>` abre o post como `.md` em tela cheia. |

**Nomes** (o Cesar pediu ideias): o 11 e o 13 usam "Livros" e "Séries". O 12 usa "Estante" e
"Coleções". O 14 e o 15 usam "Livros" e "Séries". Assim ele compara.

## Status

| # | Status | Endereço |
|---|---|---|
| 11 | pronto (30/09) | http://127.0.0.1:4411/ |
| 12 | pronto (01/10) | http://127.0.0.1:4412/ |
| 13 | pronto (30/09) | http://127.0.0.1:4413/ |
| 14 | pronto (01/10) | http://127.0.0.1:4414/ |
| 15 | pronto (01/10) | http://127.0.0.1:4415/ |
| prompt do 06 | pronto | `docs/historico/prompt-06-terminal-dev-note.md` |

## Pronto quer dizer (cada protótipo)

- Os obrigatórios O1 a O11 estão funcionando, conferidos um a um, e os pedidos da linha dele também.
- Nada da lista "não quer".
- Os dois temas, de 390 a 1440px, sem rolagem lateral e sem erro no console.
- O conteúdo dos posts está idêntico ao do blog (O1).
- A conferência (`conferir --raiz`) não mostra nada pior que a régua do atual.
- O relatório traz o que experimentar e cita os números (O e G) de cada item feito.

## Fechamento da rodada 2 (01/10/2026)

**Os cinco estão prontos e conferidos:** sem quebra, nos dois temas, de 390 a 1440px. Próximo passo:
o Cesar olha e diz o que fica (o retorno dele vai num `retorno-cesar-2.md`, no mesmo formato).

**Observações para a próxima rodada:**

- **Desempenho com a CPU 4×.** As conferências oscilaram muito com os cinco servidores e os agentes
  rodando juntos. Medidos lado a lado com a 11 (o atual), todos ficaram no mesmo patamar. Antes de
  escolher, repetir com a máquina livre.
- **Troca de tema pelo lustre.** No 14 e no 15, ela deu de 1 a 3 quadros de ~60 ms, contra nenhum no
  atual.
- **Animação de layout.** A que a conferência aponta (abertura e sumário) vem do blog atual, não dos
  protótipos.
- **O fichário do 15** precisa de acabamento (abas encavaladas e um nome cortado).
- **O `astro check` das cópias** acusa um erro antigo no `astro.config.mjs` (o tipo do Pagefind); a
  11 já o corrigiu.
