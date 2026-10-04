# 06 · Terminal

Direção do modelo 06 do redesenho (D55). Quem constrói segue este arquivo, o
`docs/redesenho/README.md` e a API da base (`docs/redesenho/base.md`).

## Ideia

O blog como um **editor de código elegante**: o ambiente de trabalho de quem escreve os artigos.
Tem painéis, abas, uma barra de status, uma **paleta de comandos** como navegação principal, caminhos
de arquivo e o cursor que pisca. **Não** é um terminal verde de filme: é o refinamento de um bom
editor moderno, com uma paleta própria em grafite e âmbar, tipografia mono de qualidade e o texto dos
artigos numa sans legível, porque ler um artigo inteiro em mono cansa.

Serve a este blog porque o leitor é desenvolvedor e porque o conteúdo é código. A navegação por
teclado é de primeira classe.

## Cara

**Cores (tokens do modelo).**

| Token | Escuro (principal) | Claro ("editor claro") | Uso |
|---|---|---|---|
| fundo | `#16171A` | `#F6F5F2` | área do editor |
| painel | `#1C1D21` | `#EDECE7` | barra lateral, abas inativas, status |
| painel-2 | `#23252A` | `#E3E1DA` | seleção de linha, hover |
| texto | `#E6E3DC` | `#1D1E21` | texto |
| texto-2 | `#8E8A82` | `#6A675F` | comentários, metadados, números de linha |
| filete | texto a 9% | texto a 12% | divisões dos painéis |
| ambar | `#F2B45A` | `#A8610B` | o acento: cursor, aba ativa, seleção, foco |
| verde | `#8FC98A` | `#3E7B39` | o "+" do diff, sucesso |
| vermelho | `#E7837A` | `#B4382D` | o "-" do diff, erro |

As cores dos livros aparecem como a **cor da "pasta"** de cada livro na árvore de arquivos e no chip
do caminho.

**Tipografia.**

- **Tabular** (Fontshare, mono sem serifa, variável 300 a 700 e itálico) na interface: árvore,
  abas, status, caminhos, paleta, metadados e títulos das listas.
- **RX100** (Fontshare, mono condensada) nos rótulos pequenos e na barra de status.
- **Bespoke Sans** (Fontshare, variável) no **texto do artigo**, em 1,0625rem com 1,7 de
  entrelinha e medida de 70 caracteres. Os títulos do artigo ficam em Tabular 600, precedidos por
  `#`, `##` e `###` em texto-2, como Markdown.
- **Código** em JetBrains Mono (raiz), com ligaduras desligadas.

**Forma.** Painéis retos separados por filetes de 1px, cantos de 6px nos componentes flutuantes
(paleta, dicas) e nenhuma sombra, a não ser a da paleta: uma sombra curta e escura só no escuro.

**Ícones.** Desenho próprio no estilo dos ícones de editor, com traço de 1,5px e ponta quadrada:
pasta, arquivo `.md`, lupa, ramo do git, sol e lua, copiar, visto e fechar (×). No hover, eles
mudam de cor para o âmbar, sem movimento, e um detalhe mínimo: a pasta **abre** (a tampa gira 20°).

**Marca "cs".** `cs@blog:~$` com o cursor em bloco piscando ao lado (o cursor pisca 3 vezes e para,
nada de piscar para sempre). No hover, o cursor volta a piscar uma vez.

## Páginas

**Moldura de editor** (todas as páginas, ≥1024px):

- **Barra de título** fina no topo: a marca, o caminho atual (`~/blog/livros/dados/bloqueio-otimista.md`)
  como migalhas clicáveis e, à direita, "⌘K Comandos" e o tema.
- **Barra lateral** (a árvore de arquivos) à esquerda, recolhível com `⌘B` ou o botão:
  - `artigos/`;
  - `livros/`, com uma pasta por livro, na cor dele, e os artigos dentro;
  - `revistas/java/`;
  - `tags/`.

  A página atual fica destacada.
- **Abas** no alto da área do editor: a página atual e as **últimas 4 páginas visitadas** nesta sessão
  (`sessionStorage`), com um × para fechar. Clicar numa aba navega.
- **Barra de status** embaixo: o ramo `main`, o livro atual, "UTF-8", o tempo de leitura e a posição
  no artigo ("Ln 120, 42%"). Tudo em RX100.
- **No celular,** só a barra de título (com o botão da árvore, que abre como gaveta) e a barra de
  status. Sem abas.

**Home** (`~/blog/README.md`):

- Um README renderizado: "# Cesar Schutz", a apresentação de hoje e **uma saída de comando**:
  `$ ls livros/` lista os livros com a contagem, mostrados como livros 3D numa fileira.
- Em seguida, `$ git log --oneline` lista os artigos, um por linha: o hash curto (os 7 primeiros
  caracteres de um hash do slug), a data, o livro (chip colorido) e o título. Cada linha é um link.
  O primeiro artigo aparece expandido, com a ilustração.

**Artigo** (`~/blog/livros/dados/bloqueio-otimista.md`):

- O arquivo aberto, com **números de linha** discretos na margem esquerda (um a cada bloco, não por
  linha visual).
- O cabeçalho do arquivo como **front matter**:

  ```text
  ---
  title: …
  livro: …
  tags: […]
  ---
  ```

  em Tabular, com as chaves em texto-2 e os valores clicáveis.
- A ilustração em painel.
- O texto em Bespoke Sans, com os títulos em Tabular e o `##` na frente.
- O **sumário à direita** como o "outline" do editor, com a seção atual destacada.
- **Fim:** "anterior e próximo" como `← cd ../anterior` e `cd ./próximo →`.

**Categorias** (`~/blog/livros/`): **`tree livros/`**.

- À esquerda, a árvore em Tabular, com as linhas `├──` e `└──` desenhadas.
- À direita, um **painel de pré-visualização** com o livro 3D **grande** (~420px de altura em 1440) do
  livro sob o foco ou o mouse.
- Embaixo do livro, as informações (volume, descrição, contagem e último) e um botão
  `abrir livro →`.
- A pré-visualização troca com o hover e com as setas do teclado.
- No celular, a árvore com os livros 3D médios intercalados.

**Página do livro** (`~/blog/livros/dados/`):

- Dividida em dois painéis.
- À esquerda, o **livro enorme** fixo ao rolar.
- À direita, o `README.md` do livro (título, descrição e tags) e `ls -la` com os artigos: linhas com
  permissões falsas `-rw-r--r--`, o tamanho (em minutos de leitura, "12min"), a data e o nome
  (título).

**Tags** (`~/blog/tags/`): um **`grep -c`**, com as tags e as contagens alinhadas em colunas, e uma
barra de caracteres `█` proporcional à contagem, em âmbar a 50%.

**Tag** (`~/blog/tags/spring`):

- `$ grep -rl "#spring" livros/`, com "9 resultados em 5 livros".
- **O filtro por livro são flags de linha de comando:** uma linha de comando editável visualmente,
  `$ grep --tag spring --livro=<todos|dados|…>`. Os livros presentes aparecem como **chips de flag**
  (`--livro=dados`) que ligam e desligam (um de cada vez), e o comando no alto se reescreve (a parte
  do livro é "digitada" de novo).
- A lista mostra o que entrou e saiu **como um diff**: as linhas que saem ficam vermelhas com `-` e
  somem; as que entram aparecem verdes com `+` e depois voltam à cor normal.

## Os três momentos

**1. A abertura da home: o boot.** Até ~2,4 s; qualquer tecla ou clique pula, e a abertura mostra
"pressione qualquer tecla para pular" em texto-2.

| Tempo | O que acontece |
|---|---|
| 0 a 0,5 s | a moldura do editor se monta: a barra lateral desliza da esquerda (`translateX`), a barra de status sobe e a barra de título desce, com 60 ms entre elas |
| 0,4 a 1,2 s | no painel central, o prompt `cs@blog:~$` aparece e o comando `ls livros/` é **digitado** (35 ms por caractere, com uma pequena variação aleatória) |
| 1,2 a 1,9 s | a saída aparece linha a linha (40 ms): primeiro os nomes e, logo depois, os livros 3D saltam para a fileira, um a um, cada um com um "encaixe" de 2px |
| 1,9 a 2,4 s | `git log --oneline` é digitado em alta velocidade (15 ms por caractere) e a lista de artigos rola para dentro, como saída de terminal |

**2. A abertura das outras páginas: abrir o arquivo.**

- O caminho do arquivo é digitado na barra de título.
- A aba nova desliza da direita.
- O conteúdo "carrega" de cima para baixo: os números de linha aparecem primeiro, e o texto preenche
  as linhas com `clip-path` em degraus (`steps(12)`).
- ~1,2 s.

**3. A troca de página: o comando.**

- No clique, o destino aparece como um **comando** na barra de título: `cd ~/blog/livros/dados` ou
  `open bloqueio-otimista.md`, digitado rápido (a 12 ms por caractere, ~0,25 s).
- O conteúdo antigo **rola para cima** e sai, como saída de terminal (`translateY(-40px)` e opacidade,
  0,25 s). O novo entra de baixo.
- A barra lateral, as abas e o status **ficam parados** (View Transition com nomes próprios); só a
  aba nova se acende e o marcador da árvore desliza até o arquivo novo.
- Técnica: View Transitions. O comando é escrito na página nova, no `pagereveal`, sobre a barra de
  título já com o nome de transição.

## Categorias: o desfile e os livros grandes

**O desfile: `tree` se expande.** Toca sempre que Categorias aparece.

- As linhas da árvore aparecem de cima para baixo (35 ms), com os traços `├──` se desenhando (a
  largura por `clip-path`).
- Cada pasta de livro "abre" (o ícone gira a tampa).
- No painel da direita, **os livros passam como slides**: cada livro aparece por 90 ms na
  pré-visualização, do 1 ao 8, como alguém apertando a seta para baixo, e para no primeiro.
- ~1,5 s.

**Hover ou seta numa linha:**

- a linha ganha o fundo de seleção (painel-2) com uma barra âmbar de 2px à esquerda;
- a pré-visualização troca de livro: o livro atual sai deslizando para cima e esmaecendo, e o novo
  entra de baixo girando de 30° para 24° (0,35 s);
- as informações embaixo trocam por "digitação" rápida.

## Troca de tema

É um **comando de tema**: ao clicar no botão (ou escolher "Tema: claro" na paleta), a barra de status
mostra `> tema claro` e o tema novo **varre como a mudança de tema do editor**, uma cortina que desce
de cima para baixo em faixas de 8 degraus (`clip-path` com `steps(8)`, 0,5 s), como uma tela
redesenhada linha a linha.

## Catálogo de detalhes

Todos pensados primeiro para o teclado. Curvas curtas: 0,12 a 0,25 s, com `cubic-bezier(.2,.8,.2,1)`.

1. **Paleta de comandos (⌘K / Ctrl K / `>`):**
   - abre no centro, na parte de cima (`scale(.96)` e `translateY(-4px)` para o lugar, 0,18 s), com um
     **chip de contexto** no campo ("Livro: Dados", quando na página de um livro, removível com
     Backspace);
   - os grupos: "Artigos", "Livros", "Tags" e "Comandos" (Tema claro/escuro, Recolher a barra
     lateral, Ir para o topo, Copiar o link da página);
   - a busca é difusa, com as letras que casaram em âmbar;
   - um **marcador único** desliza entre os itens com as setas (`translateY`, 0,12 s);
   - Enter abre, Esc fecha;
   - entrar num grupo "afunda" a paleta (escala .98 e volta).
2. **Cursor que pisca:** no prompt da home e na busca, um cursor em bloco pisca 3 vezes e para (nada
   de laço infinito).
3. **Árvore de arquivos:** no hover, a linha é selecionada; no clique numa pasta, ela abre e fecha
   (os filhos entram por `clip-path`, a tampa gira); ↑, ↓, → e ← navegam, como no editor.
4. **Abas:** no hover, o × aparece; clicar no × fecha a aba (ela encolhe para a esquerda, 0,15 s, e
   as outras deslizam para o lugar, com FLIP); `⌃Tab` troca de aba.
5. **Migalhas do caminho:** cada pedaço vira sublinhado no hover, e o clique navega.
6. **Barra de status:** "Ln 120, 42%" atualiza com a rolagem, o **ramo** mostra o livro, e o clique
   no livro abre a paleta com "Livro: …".
7. **Linhas do `git log`:** no hover, a linha é selecionada e o hash fica âmbar; uma dica ("abrir ↵")
   aparece à direita.
8. **Links do texto:** sublinhado pontilhado; no hover, ele fica sólido e âmbar, e aparece uma dica
   com o caminho de destino (`→ livros/sre/w3c-trace-context.md`) depois de 400 ms.
9. **Títulos do artigo:** o `##` na frente fica âmbar no hover, e o clique copia o link (`copiado` na
   barra de status por 1,5 s).
10. **Outline (sumário):** a seção atual ganha a barra âmbar, que **desliza** entre os itens (um trilho
    com `translateY`).
11. **Copiar código:** o botão `copiar` no cabeçalho do bloco; no clique, vira `copiado ✓` em verde, e
    a barra de status mostra `✓ 23 linhas copiadas`.
12. **Blocos de código:** números de linha discretos; no hover de uma linha, ela ganha o fundo de
    seleção (bom para ler código).
13. **Anterior e próximo:** `cd ../` e `cd ./`; no hover, o comando é "digitado" de novo, rápido.
14. **Voltar ao topo:** `gg ↑` no canto, e a tecla `g` duas vezes também sobe (como no vim); aparece
    uma dica ao pressionar `g` uma vez.
15. **Atalhos:** `?` abre uma folha de atalhos no estilo do editor (⌘K, ⌘B, gg, G, /, j/k para descer e
    subir no artigo).
16. **Diff do filtro:** as linhas que saem, vermelhas com `-`; as que entram, verdes com `+` (veja
    acima).
17. **Barra de `█` das tags:** cresce da esquerda ao entrar na tela (`scaleX`, uma vez).
18. **Livro da fileira da home:** no hover, uma dica flutuante no estilo do editor ("dados/ · 2
    artigos") e o livro sobe 4px.
19. **Seleção de texto:** a cor de seleção do editor (âmbar a 25%).
20. **Foco pelo teclado:** contorno âmbar de 1px mais um halo de 3px a 25%, cantos de 4px.
21. **Rodapé:** um "terminal integrado" recolhido, com `$ echo "obrigado por ler"`, que se abre ao
    clicar (a altura por `clip-path`) e mostra os links (GitHub, LinkedIn, RSS) como saída de comando.

## Técnica

- **Digitação:** um utilitário que escreve texto caractere a caractere com `setTimeout` curto, sempre
  com `aria-label` com o texto inteiro e o texto real já no HTML (o efeito só esconde e revela). Com
  movimento reduzido, o texto aparece pronto.
- **Paleta:** `<dialog>` com busca difusa própria (sem biblioteca), sobre o `/busca.json` da base e as
  listas de livros e tags.
- **Moldura parada nas trocas:** `view-transition-name` na barra lateral, nas abas, no título e no
  status.
- **Atalhos de teclado:** nunca quando o foco está num campo; e a folha de atalhos permite
  desligá-los (WCAG 2.1.4).
- Nada de laço infinito: o cursor pisca por um tempo limitado.

## Referências usadas

`docs/redesenho/referencias.md`:

- a paleta de comandos do kobra (chip de contexto, afundar) e do uiable;
- o indicador que salta do kinetics;
- a "decodificação" (usada de leve nos títulos) do kinetics;
- o trilho do item ativo do microkit;
- as fontes Tabular, RX100 e Bespoke Sans, do Fontshare.

## O que não fazer (para não virar outro modelo)

- **Terminal de filme:** nada de verde fosforescente, varredura de CRT, texto "hacker" ou brilho
  (clichê).
- **Mono no texto longo:** o artigo é em Bespoke Sans.
- **Grade:** nada de grade à vista nem de números de índice grandes (Grade).
- **Mola:** nada de formas ou mola (Cinético).
- **Desenho técnico:** nada de cotas (Planta).

## Retorno do Cesar

(vazio)
