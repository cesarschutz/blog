# 09 · Biblioteca

Direção do modelo 09 do redesenho (D55). Quem constrói segue este arquivo, o
`docs/redesenho/README.md` e a API da base (`docs/redesenho/base.md`).

## Ideia

Uma **biblioteca de verdade, em 3D feito só com CSS**: madeira, papel, a luz quente de uma luminária
de mesa. Os livros são **objetos** numa estante em perspectiva. A home é a estante vista de frente, e
a navegação é uma **câmera** que anda pela sala: chega perto de uma prateleira, tira um livro e o
abre sobre a mesa. É o modelo que leva ao extremo o que o Cesar mais gosta, **os livros grandes**,
com a sensação física de pegá-los.

Por ser o mais pesado dos dez, tem limites claros: CSS 3D (`transform-style: preserve-3d`) com
poucas camadas, sem WebGL, sem sombra dinâmica e com uma versão 2.5D no celular.

## Cara

**Cores (tokens do modelo).**

| Token | Claro ("sala de dia") | Escuro (principal, "à luz da luminária") | Uso |
|---|---|---|---|
| parede | `#E9E1D3` | `#1B1512` | fundo da sala |
| madeira | `#8A5A3B` | `#5A3A26` | estante, mesa (com veio em gradiente parado) |
| madeira-clara | `#B07A52` | `#7A5236` | bordas das tábuas, destaques |
| papel | `#F6F0E4` | `#EFE6D6` | fichas, páginas, painéis de leitura |
| tinta | `#241C16` | `#241C16` sobre o papel e `#EDE3D2` sobre a parede | texto |
| tinta-2 | `#6D6053` | `#A89886` | metadados |
| luz | `#FFE3B0` | `#FFD08A` | a luz da luminária: halo parado e o brilho do hover |
| latao | `#B8913F` | `#C9A24C` | plaquinhas, puxadores do fichário, foco |

**Tipografia.**

- **Zodiak** (Fontshare, já baixada no 02) nos títulos grandes. No 09 ela entra como **placa
  gravada**: 500 a 700, com espaçamento aberto de +0,02em, em caixa normal.
- **Rowan** (Fontshare, variável 300 a 700) no texto do artigo, cerca de 10% maior que o normal
  (1,1875rem) e com 1,7 de entrelinha, sobre o papel.
- **Tabular** (Fontshare, já baixada) nas fichas do catálogo, nos números de chamada ("QA76.9 · 028")
  e nas datas.
- Código em JetBrains Mono (raiz).

**Forma.**

- A sala tem profundidade: parede ao fundo, estante com tábuas em perspectiva e mesa em primeiro
  plano.
- Os painéis de leitura são **folhas de papel sobre a mesa**, com um canto levemente virado.
- Plaquinhas de latão com os nomes (um retângulo com borda e um gradiente parado).

**Ícones.** Objetos pequenos de desenho próprio, com traço de 1,5px: lupa de leitura, luminária
(tema), ficha, marcador de página (voltar ao topo), pena (copiar), chave (link). No hover, o objeto
se inclina um pouco (6°), como se fosse pego.

**Marca "cs".** Um **ex-libris**, o carimbo de livro com "cs" dentro de uma moldura oval ornamentada
simples. No hover, o carimbo é "batido": escala .94 e volta, com uma leve mancha de tinta que aparece
e some.

## Páginas

**A sala (base de todas as páginas):**

- `perspective` no contêiner, com o ponto de fuga no centro, um pouco acima.
- A estante ao fundo, na home e em Categorias; a mesa em primeiro plano, no artigo e na página do
  livro.
- A **luminária** no canto de cima, com um halo de luz parado (gradiente radial) que ilumina a área de
  leitura.
- **O cabeçalho** é uma plaquinha de latão na estante, com "Biblioteca de Cesar Schutz", e a
  navegação em Zodiak pequeno ("Estantes", "Catálogo", "Leitura").

**Home = a estante.**

- **A estante vista de frente:** 2 a 3 tábuas, cada uma com livros em pé mostrando as lombadas
  (os componentes de lombada da base, na **altura real grande**, ~260px).
  - Os livros das categorias e a revista ficam na tábua de cima.
  - Nas tábuas de baixo, os **artigos como livrinhos**: lombadas finas com o título escrito na vertical
    (um elemento próprio do modelo, com a cor do livro do artigo, desenhado só com CSS, **não** o
    desenho dos livros do blog).
- **Hover num livro:** ele **sai da estante** em 3D (`translateZ` de 40px, com a cabeça inclinada
  para a frente), mostrando a cabeça das páginas.
- **Clique:** a câmera chega perto (a transição) e o livro abre.
- **Na frente da estante,** na mesa, fica a **ficha de apresentação**: "Publico aqui…", num cartão de
  papel.
- **No celular:** as lombadas numa fileira que rola na horizontal, com encaixe, sem a câmera 3D. As
  lombadas finas dos artigos viram uma lista de fichas.

**Artigo = o livro aberto sobre a mesa.**

- A vista vem de cima, levemente inclinada: a mesa de madeira e, sobre ela, **a folha de leitura**
  (papel), com a ilustração no topo como uma gravura colada.
- O texto na folha em Rowan, com os títulos em Zodiak.
- **Na margem da mesa:**
  - o livro de origem, fechado;
  - uma **ficha do catálogo** com o livro, as tags, a data e a leitura;
  - um **marcador de página** (fita) que desce acompanhando a leitura (o progresso).
- A inclinação da folha (`rotateX` de 4°) desaparece ao rolar: a folha fica plana depois dos
  primeiros 200px, para a leitura ser normal. Só o topo tem perspectiva.
- **Anterior e próximo** são duas fichas na mesa.

**Categorias = a parede de estantes.**

- A estante inteira com **os livros de frente, grandes** (livros 3D de ~340px, com a capa à vista,
  como numa vitrine de livraria), um por nicho, cada um com a plaquinha de latão embaixo (o nome e a
  contagem).
- 4 por linha e 2 linhas; no celular, 1 por tela.

**Página do livro = o livro tirado da estante.**

- O **livro enorme** na mesa, sob a luminária, em 3D, com o giro controlável: **arrastar gira** (só
  com mouse, com inércia leve e voltando devagar).
- Ao lado, sobre a mesa, **a gaveta do fichário** desse livro, aberta, com uma **ficha por artigo**
  em pé: o título, a data e os minutos em Tabular. O hover numa ficha a **levanta** 12px, como se
  fosse puxada.

**Catálogo (Tags) = o fichário.** Um **móvel de fichário** com gavetinhas, uma por letra (A, B, C…),
com puxadores de latão. A gaveta com as tags daquela letra fica aberta e mostra as fichas (a tag e a
contagem). Clicar numa gaveta a **abre** (`translateZ` para fora, 0,4 s) e fecha a anterior.

**Tag = uma gaveta aberta.**

- "Spring" na plaquinha da gaveta e "9 fichas em 5 livros".
- **O filtro por livro são as divisórias da gaveta:** separadores de ficha, altos e coloridos, com a
  cor e o nome de cada livro presente (como os separadores de um fichário real). Clicar num separador
  **levanta ele e as fichas atrás dele** (as do livro) e abaixa as outras (`translateY`, 0,35 s). O
  "Todos" levanta todas.
- A lista abaixo mostra as fichas levantadas.

## Os três momentos

**1. A abertura da home: entrando na biblioteca.** Até ~2,6 s; clique, tecla ou rodinha pulam.

| Tempo | O que acontece |
|---|---|
| 0 a 0,4 s | a sala escura; a **luminária acende** (o halo aparece por opacidade em dois degraus, 0,4 s) |
| 0,3 a 1,6 s | **a câmera avança pelo corredor:** a sala inteira vem de `translateZ(-600px)` e levemente girada (`rotateY` de 6°) até a posição de repouso (1,3 s, `cubic-bezier(.2,.7,.2,1)`), só com `transform` no contêiner da cena |
| 1,0 a 2,2 s | **os livros deslizam para as tábuas:** cada livro da tábua de cima entra de lado (de `translateX(-30px)` e `rotateY` de 20° até a posição), empurrando o anterior de leve, com 70 ms entre eles; os livrinhos dos artigos entram depois, mais rápidos (25 ms) |
| 2,0 a 2,6 s | a ficha de apresentação desliza sobre a mesa e a plaquinha do cabeçalho aparece |

**2. A abertura das outras páginas: tirar o livro e abrir.**

- **No artigo:** o livro de origem aparece fechado na mesa e **abre** (a capa gira pela lombada, de 0 a
  -160°, 0,7 s). A folha de leitura desliza de dentro dele para o centro (0,5 s).
- **Nas outras páginas:** a luminária acende e a cena assenta vindo de um leve `translateZ`.
- ~1,4 s.

**3. A troca de página: a câmera anda.**

- **Da estante para um livro ou artigo:** a câmera **aproxima-se** do elemento clicado. A cena antiga
  faz `scale` e `translate` na direção dele, até ele ocupar a tela, e a página nova entra por opacidade
  no fim (0,7 s).
- **Entre páginas do mesmo nível** (menu): a câmera **desliza** para o lado, com a antiga saindo para a
  esquerda e girando 8° e a nova entrando da direita (0,6 s).
- **Voltando pelo histórico,** a câmera se afasta (o inverso).
- Técnica: View Transitions entre documentos. A origem do clique (x, y) vai no `sessionStorage`, e o
  `::view-transition-old(root)` é animado em direção a ela.

## Categorias: o desfile e os livros grandes

**O desfile: os livros são colocados nos nichos.** Toca sempre que Categorias aparece.

- **A estante aparece primeiro:** as tábuas, com uma leve luz passando.
- **Cada livro entra na frente do seu nicho** vindo de trás (`translateZ` de -120px e `rotateY` de
  -40°, girando para mostrar a capa de frente), com 90 ms entre eles.
- **Por último, as plaquinhas de latão** brilham uma vez (um reflexo que passa).
- ~1,6 s.

**Hover num nicho:**

- o livro **avança** 30px em Z e gira de 20° para 8° (quase de frente);
- a luz da luminária parece cair nele (um halo parado atrás dele aparece por opacidade);
- os vizinhos recuam 8px.

**Clique:** a câmera chega perto, e o livro vai para a mesa da página dele.

## Filtro da tag

Os separadores sobem e descem (veja acima). As fichas do livro escolhido **sobem** 18px e ficam
nítidas; as outras **afundam** na gaveta (descem e esmaecem até 30%). A lista abaixo reorganiza por
FLIP. O total conta até o valor novo.

## Troca de tema

**Apagar e acender a luminária:** clicar na luminária do cabeçalho **puxa a correntinha** (o
puxador desce 6px e volta) e a sala muda. Indo para o escuro, a luz da sala se apaga das bordas para
o centro e fica só o halo da luminária; indo para o claro, a luz do dia entra pelas bordas (View
Transition, `clip-path` de elipse, 0,7 s).

## Catálogo de detalhes

Todos também com o foco do teclado (sem arrastar). Movimento de objetos físicos:
`cubic-bezier(.2,.8,.2,1)`, de 0,3 a 0,6 s, sem mola exagerada.

1. **Livro que sai da estante** no hover (home e Categorias), com a cabeça das páginas à vista.
2. **Livrinhos dos artigos:** no hover, a lombada fina inclina 8° para fora e o título aparece
   inteiro numa **ficha** que sai de trás dela.
3. **Plaquinhas de latão:** um reflexo passa por elas no hover (uma faixa clara com `translateX`,
   0,6 s).
4. **Ex-libris (marca):** o carimbo é batido.
5. **Busca** (a lupa de leitura):
   - ⌘K abre **a ficha de consulta**, um cartão de papel que sobe da mesa (`translateY` e um leve
     `rotateX`, 0,35 s);
   - os resultados vêm como fichas empilhadas, com o número de chamada em Tabular;
   - com as setas, a ficha ativa se levanta.
6. **Tema:** a correntinha da luminária (veja acima).
7. **Links do texto:** sublinhado em tinta a 40%; no hover, ele vira **grifo a lápis** (um traço
   irregular em SVG, desenhado da esquerda para a direita, 0,35 s).
8. **Títulos do artigo:** no hover, um pequeno "§" aparece na margem; o clique copia o link, com
   "Anotado" escrito ao lado.
9. **Marcador de página (progresso):** uma fita de tecido na cor do livro desce pela margem da folha,
   acompanhando a leitura, só com CSS.
10. **Copiar código:** a pena "escreve" (inclina e volta) e o rótulo vira "Copiado".
11. **Fichas de anterior e próximo:** levantam 8px no hover e inclinam 2°.
12. **Voltar ao topo:** o marcador de página; no hover, a fita balança.
13. **Livro na página do livro:** arrastar gira, com inércia leve.
14. **Fichas do fichário:** levantam no hover.
15. **Gavetinhas do catálogo:** abrem e fecham.
16. **Separadores da tag:** sobem e descem.
17. **A folha de leitura:** a inclinação do topo se desfaz com a rolagem.
18. **Seleção de texto:** a luz da luminária a 40%.
19. **Foco pelo teclado:** contorno de 2px em latão, com 3px de afastamento.
20. **Rodapé:** a **ficha do empréstimo** ("Emprestado a: você · Devolver quando quiser") com os
    contatos, carimbada com a data de hoje. O carimbo é batido quando o rodapé entra na tela.

## Técnica

- **3D só com CSS:**
  - `perspective` num contêiner da cena e `transform-style: preserve-3d` **só onde precisa** (a
    estante e o livro em foco);
  - os livros usam os componentes 3D da base (o giro por `--livro-giro`);
  - nada de sombra dinâmica: a sombra é uma camada com opacidade.
- **Camadas:** limite o número de elementos 3D em cena. Os livrinhos dos artigos são planos
  (`translateZ` só no hover). Use `content-visibility` nas tábuas fora da tela.
- **Celular** (abaixo de 900px) e movimento reduzido: sem câmera nem cena 3D (tudo plano, o 2.5D com
  leve inclinação só nos livros) e sem arrastar.
- **Medir com a CPU 4× mais lenta:** a entrada da câmera, o hover nos livros e a troca de página. É o
  risco deste modelo. Se pesar, simplifique a cena (menos livrinhos, sem as tábuas de baixo 3D).
- **GSAP sob demanda** (Draggable e Inertia, já instalados na raiz) para arrastar o livro. O resto com
  CSS e Web Animations.

## Referências usadas

`docs/redesenho/referencias.md`:

- o card que inclina e o leque em arco do kobra e do uiable;
- a folha que vira do kinetics;
- as fontes Zodiak, Rowan e Tabular, do Fontshare.

A estante atual do blog (`docs/movimento.md`) fica só como referência de física, para **não
repetir**: aqui é uma sala, não uma estante sobre papel.

## O que não fazer (para não virar outro modelo)

- **Luz:** a luz da luminária é parada. Nada de luz seguindo o cursor (Noturno).
- **Galeria:** nada de parede branca de galeria nem de rolagem horizontal da sala (Galeria).
- **Formas:** nada de mola exagerada nem de formas coloridas (Cinético).
- **Revista:** nada de viradas de página de revista na troca de tela (Revista). Aqui é a câmera que
  anda.

## Retorno do Cesar

(vazio)
