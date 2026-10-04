# 08 · Tipo Vivo

Direção do modelo 08 do redesenho (D55). Quem constrói segue este arquivo, o
`docs/redesenho/README.md` e a API da base (`docs/redesenho/base.md`).

## Ideia

**A tipografia é o desenho.** Os títulos são feitos de letras vivas: fontes variáveis cujos eixos
(peso, largura e tamanho óptico) respondem ao mouse, à rolagem e ao estado, como um cartaz tipográfico
que respira. Blocos de **cor chapada**, tirados das cores dos livros, dão estrutura, com texto enorme
por cima. O resto é sóbrio: o texto do artigo é quieto e legível, e o espetáculo fica nos títulos, nas
listas e nas transições.

Serve a este blog porque traz personalidade forte com só um ingrediente (a letra), e porque cada
livro ganha um "cartaz" próprio com a cor dele.

## Cara

**Cores (tokens do modelo).**

| Token | Claro (principal) | Escuro | Uso |
|---|---|---|---|
| fundo | `#F4F1EA` | `#131210` | fundo |
| texto | `#141210` | `#F2EEE6` | texto, títulos |
| texto-2 | `#5F5A51` | `#A39D93` | metadados |
| filete | texto a 14% | texto a 16% | filetes |
| bloco | a cor do livro da página | a mesma | os **blocos de cor chapada** (fundos de seção, cartazes, hover) |
| sobre-bloco | o `tinta` do livro (de `cores.js`) | o mesmo | texto sobre o bloco |

Nas páginas gerais (home, tags), os blocos alternam as cores dos livros. Na página de um livro ou de
um artigo, o bloco é a cor dele.

**Tipografia.**

- **Bricolage Grotesque** (Fontsource, `@fontsource-variable/bricolage-grotesque`: eixos `wght` 200
  a 800, `wdth` 75 a 100 e `opsz` 12 a 96, se o pacote trouxer os eixos completos; **confira**) nos
  títulos, no menu e nas listas. É **a letra viva**.
- **Literata** (já instalada na raiz, com `opsz`) no texto do artigo, em 1,125rem com 1,7 de
  entrelinha e medida de 66 caracteres. É calma.
- **JetBrains Mono** (raiz) no código e nos números pequenos.
- **Escala extrema:** o nome na home em até ~20vw, os títulos das páginas em ~9vw e os nomes dos
  livros em Categorias em ~7vw. O corpo é normal.

**Forma.** Blocos retangulares de cor chapada, sem cantos arredondados e sem sombras. A composição
fica em diagonais e sobreposições de texto enorme cortado pelas bordas.

**Ícones.** Quase todos são **tipográficos**: setas como caracteres (→ ↗ ←) na própria Bricolage, que
ganham peso no hover; o tema como "Aa" que troca de peso. O que não for caractere (lupa), com traço de
1,5px, que acompanha o peso.

**Marca "cs".** "cs" na Bricolage 800 largura 75, com a cor de um livro atrás. No hover, as letras
passam de 800 a 200 e voltam (onda, 0,6 s).

## Páginas

**Cabeçalho.**

- Fixo e alto o bastante para a marca.
- O menu em Bricolage (Artigos, Categorias, Tags); no hover, cada item **engorda** (`wght` de 400 a
  800) com o "texto fantasma" reservando a largura, para nada empurrar o vizinho.
- À direita, a busca e o tema (Aa).
- Ao rolar, o menu **se comprime** (`wdth` de 100 a 75, ligado à rolagem, só nos poucos itens do
  menu).

**Home.**

- **O cartaz:** "Cesar Schutz" enorme, em duas linhas, cortando a borda direita da tela, sobre um
  bloco de cor chapada.
  - **As letras respondem ao cursor:** cada letra do nome ganha peso e largura conforme a distância
    ao cursor (as perto do mouse ficam 800 e largas; as longe, 250 e estreitas), com lerp e parada.
  - O `font-variation-settings` só é escrito nas letras que mudaram de valor, e só enquanto o mouse se
    move sobre o cartaz.
- **A coleção:** os 8 livros e a revista como livros 3D médios, numa fileira sobre um bloco de cor que
  **troca de cor** conforme o mouse passa sobre cada livro (a cor do livro sob o mouse, transição de
  0,4 s).
- **Artigos:** uma **lista tipográfica enorme**. Cada artigo é uma linha com o título na Bricolage, em
  ~3rem, e a data e o livro à direita, pequenos.
  - No hover, **o título engorda e alarga** (`wght` 300 → 750, `wdth` 85 → 100, 0,45 s) e um bloco
    com a cor do livro dele **sobe por trás** da linha (`clip-path` de baixo para cima), com o texto
    passando para a tinta do livro.
  - A ilustração do post aparece à direita, recortada, dentro do bloco.
  - **As linhas mudam com a rolagem:** cada título vai de `wght` 300 a 600 conforme atravessa o
    centro da tela (`animation-timeline: view()`, animando `font-variation-settings` só na Bricolage
    dos títulos).

**Artigo.**

- **O cartaz do artigo:** um bloco na cor do livro, na largura toda, com o **título enorme** (~7vw)
  em Bricolage.
  - O título **se comprime** (`wdth` 100 → 75, `wght` 700 → 500) conforme a página rola para fora do
    cartaz, como se a letra se afastasse.
  - O complemento em Literata itálico e os metadados em mono pequeno.
- **A ilustração** abaixo do cartaz, num painel.
- **O texto** em Literata, calmo.
  - **Os H2** em Bricolage: ao entrar na tela, cada H2 "respira" uma vez (`wght` 300 → 700 → 600,
    1 s).
  - O código em bloco com a borda da cor do livro.
- **O fim:** "Próximo" e "Anterior" como dois cartazes pequenos, com os títulos que engordam no hover.

**Categorias.**

- **Os nomes dos livros enormes, em lista:** cada linha é o nome do livro em ~7vw na Bricolage, com
  o número do volume e a contagem ao lado.
- **No hover numa linha:**
  - o nome engorda e alarga;
  - um bloco da cor do livro sobe por trás;
  - **o livro 3D grande entra** do lado direito (~380px de altura), girando de 60° para 24° e
    deslizando 40px (0,5 s);
  - os outros nomes afinam para `wght` 250.
- **No celular,** cada linha mostra o livro 3D médio embaixo do nome, sem hover.

**Página do livro.**

- **O cartaz do livro:** um bloco com a cor dele na tela toda, com o **nome enorme** cortado pelas
  bordas e o **livro 3D enorme** (até 70vh) por cima, girando devagar com a rolagem (`rotateY` de 30°
  a 10°).
- A descrição em Literata, sobre o bloco, na tinta do livro.
- Embaixo, os artigos do livro na lista tipográfica da home.

**Tags.** **Uma nuvem de palavras em pesos:** as tags como palavras enormes, com o **peso e a largura
proporcionais à contagem** (as mais usadas, 800 e largas; as raras, 200 e estreitas), fluindo como um
texto corrido. No hover, a palavra engorda até o máximo e as outras afinam.

**Tag.**

- "#Spring" no cartaz, com o bloco na cor do livro mais frequente da tag.
- **O filtro por livro são palavras que engordam:** os nomes dos livros presentes numa linha
  ("Todos · Arquitetura de Software · Dados · DevOps · SRE"). O ativo fica em 800, com a cor do livro
  sublinhando; os outros ficam em 300. No clique, o anterior afina e o novo engorda (0,4 s).
- A lista tipográfica.

## Os três momentos

**1. A abertura da home: o nome se forma.** Até ~2,4 s; clique, tecla ou rodinha pulam.

| Tempo | O que acontece |
|---|---|
| 0 a 0,8 s | "Cesar Schutz" aparece **comprimido e fino** (`wdth` 75, `wght` 200) e **se expande letra por letra**, da esquerda para a direita (`wght` até 800 e `wdth` até 100, com 35 ms entre as letras, cada uma em 0,6 s, `cubic-bezier(.16,1,.3,1)`); as letras sobem de uma máscara ao mesmo tempo |
| 0,6 a 1,4 s | uma **onda de peso** passa pelo nome, com as letras engordando e voltando a 700 em sequência, uma vez |
| 1,0 a 1,6 s | o bloco de cor chapada sobe por trás do nome (`clip-path` de baixo para cima) e o texto passa para a tinta do livro |
| 1,4 a 2,4 s | os títulos da lista entram **afinando**: cada título chega em `wght` 800 e afina até o peso de repouso, com 50 ms entre eles; só os que estão à vista |

**2. A abertura das outras páginas.**

- O título da página chega em `wdth` 75 e `wght` 200 e **se expande** até o repouso (0,8 s), letra por
  letra.
- O bloco de cor sobe por trás.
- ~1,2 s.

**3. A troca de página: o título vira o próximo.**

- **O título da página atual se transforma no título da próxima, no mesmo lugar:** o antigo afina e
  comprime (`wght` 200, `wdth` 75) e some por opacidade; o novo nasce comprimido e se expande.
- O bloco de cor troca de cor (a cor do destino) por um `clip-path` que sobe.
- Técnica: View Transitions, com o título de cada página com o mesmo `view-transition-name` (o
  "cartaz"). A antiga e a nova ficam como imagens, então a compressão da antiga é feita por `scaleX`
  na imagem (`::view-transition-old(cartaz)`), e a nova se expande de verdade no `pagereveal`
  (`font-variation-settings` no elemento real, depois da transição).
- ~0,8 s.

## Categorias: o desfile e os livros grandes

**O desfile: a onda de peso.** Toca sempre que Categorias aparece.

- Os nomes dos livros entram **de baixo, por máscara**, um por vez (70 ms), e cada um, ao chegar,
  passa por uma **onda de peso**: engorda até 800 e volta a 400 (0,7 s).
- O **primeiro livro 3D** entra do lado direito, mostrando o volume 1 grande, até o mouse passar em
  outro nome.
- ~1,4 s.

O hover está descrito em "Categorias", acima.

## Filtro da tag

- A palavra do livro escolhido engorda (`wght` 300 → 800) e o sublinhado na cor dele se desenha; a
  anterior afina.
- A lista: os títulos que saem **afinam até 100** e somem (0,3 s); os que ficam sobem (FLIP); os que
  entram chegam em 800 e afinam até o repouso.
- O total conta até o valor novo.

## Troca de tema

"Aa": ao clicar, **todo o texto grande da página afina até 100** (0,25 s), o tema troca (View
Transition por opacidade) e o texto volta a engordar até o repouso (0,35 s). No hover, o "Aa" alterna
entre 200 e 800.

## Catálogo de detalhes

Todos também com o foco do teclado (sem o cursor, o foco faz o efeito de hover completo).

1. **Nome da home que responde ao cursor:** peso e largura de cada letra pela distância ao mouse (veja
   acima).
2. **Menu que engorda** no hover, com o texto fantasma; o item atual fica em 800 o tempo todo.
3. **Menu que se comprime** com a rolagem.
4. **Linha de artigo:** o título engorda e alarga, o bloco de cor sobe e a ilustração aparece (veja
   acima).
5. **Títulos que mudam de peso com a rolagem** na lista.
6. **Coleção da home:** o bloco de fundo troca para a cor do livro sob o mouse.
7. **Busca:**
   - a lupa abre um campo **enorme**, na largura toda sob o cabeçalho, com o texto digitado em
     Bricolage 3rem;
   - a cada letra digitada, a letra nova chega em 800 e afina até 500 (0,3 s);
   - os resultados na lista tipográfica, com o termo em 800;
   - com as setas, o resultado ativo engorda.
8. **Tema "Aa":** o texto afina, o tema troca e o texto engorda (veja acima).
9. **Links do texto:** sublinhado de 2px na cor do livro; no hover, o **peso do próprio link sobe**
   (Literata `wght` 400 → 600, com o texto fantasma para não empurrar a linha, só em links curtos) e o
   sublinhado engrossa para 3px.
10. **H2 do artigo:** a respiração ao entrar na tela; no hover, um "#" em Bricolage 800 aparece à
    esquerda, e o clique copia o link ("copiado" chega em 800 e afina).
11. **Progresso:** o **número da porcentagem** grande no canto de baixo ("42%") em Bricolage, com o peso
    subindo com a leitura (0% em 200, 100% em 800), só com CSS (`animation-timeline: scroll()` na
    variação e um `@property` para o número).
12. **Copiar código:** "Copiar" engorda no hover; no clique, vira "Copiado" em 800, que afina até 400
    em 1,6 s.
13. **Anterior e próximo:** os títulos dos cartazes engordam e alargam no hover.
14. **Voltar ao topo:** "↑" em Bricolage; no hover, a seta vai de 200 a 800.
15. **Categorias:** os nomes engordam, o livro entra e os outros afinam (veja acima).
16. **Página do livro:** o livro gira com a rolagem.
17. **Nuvem de tags em pesos:** a palavra engorda e as outras afinam.
18. **Palavras do filtro que engordam.**
19. **Seleção de texto:** a cor do livro da página a 30%.
20. **Foco pelo teclado:** sublinhado grosso de 3px na cor do texto, com 4px de afastamento, e o peso
    do elemento sobe como no hover.
21. **Rodapé:** "Cesar Schutz" em Bricolage enorme, com uma **onda de peso contínua muito lenta**
    (**só** quando o rodapé está na tela e **para** depois de 3 ciclos; nada em laço infinito).

## Técnica

- **Fontes:**
  - instale só em `redesenho/` (Fontsource aprovado) com
    `fnm exec --using=24 npm install --prefix redesenho @fontsource-variable/bricolage-grotesque`,
    depois de ler o `package.json` dele;
  - verifique se o pacote traz **os eixos `wdth` e `opsz`** (em geral há um arquivo `full.css` ou
    `wdth.css`). Se não trouxer a largura, troque por `@fontsource-variable/fraunces` (tem `opsz`,
    `wght`, `SOFT` e `WONK`) ou `@fontsource-variable/roboto-flex`, e relate a troca.
- **Custo:** animar `font-variation-settings` força layout. Por isso:
  - **Só nos títulos e rótulos curtos**, nunca no texto corrido.
  - **Texto fantasma** (a cópia invisível no peso e na largura máximos, na mesma célula da grade)
    reserva o espaço: o vizinho nunca anda.
  - O cursor sobre o nome: rAF só enquanto se move, escrevendo só as letras que mudaram, com
    `contain: layout` no contêiner do nome.
  - Os efeitos ligados à rolagem por `animation-timeline`, sem JS.
- **Medir** com a CPU 4× mais lenta: o cursor sobre o nome e a rolagem da lista não podem gerar
  quadros acima de 50 ms repetidos. Se gerarem, reduza o número de letras vivas (por palavra em vez
  de por letra).
- **Movimento reduzido:** todos os pesos no repouso, sem onda, sem resposta ao cursor e sem variação
  com a rolagem.

## Referências usadas

`docs/redesenho/referencias.md`:

- o peso variável e o texto fantasma do kinetics;
- as letras que sobem de uma máscara do kinetics;
- o número de arrastar do microkit (ideia para os eixos);
- a tipografia multieixo do Fontsource (a pesquisa do Fontshare apontou que lá só há peso).

## O que não fazer (para não virar outro modelo)

- **Letras:** nada de letras que embaralham (Índice) nem de digitação (Terminal).
- **Luz:** nada de luz ou grão (Noturno).
- **Formas:** nada de formas geométricas coloridas (Cinético): aqui a cor vem em blocos chapados.
- **Serifa:** nada de serifa de display (Revista).
- **Texto do artigo:** nada de efeito no texto corrido.

## Retorno do Cesar

(vazio)

## Estado da construção (30/09/2026)

**Construído, para conferência.** As 7 rotas em `redesenho/src/pages/08-tipo-vivo/`, o modelo em
`redesenho/src/modelos/08-tipo-vivo/`. `astro check` com 0 erro; `conferir -- 08-tipo-vivo --hover ".v-linha, .v-cat"`
com 0 quebra, 1 errado (quadro de 201 ms no carregamento do artigo MDX com lousas, com a CPU 4×; medido à mão,
113 ms) e 5 avisos (carregamento e troca de página).

- **Fonte:** `@fontsource-variable/bricolage-grotesque@5.3.0` (sem scripts nem dependências, OFL-1.1), com os três
  eixos (`wght` 200–800, `wdth` 75–100, `opsz` 12–96). A instância padrão do arquivo é 800. Só há ↑ e ↓: as outras
  setas são o ↑ girado. Literata e JetBrains Mono vêm da raiz (Literata pré-carregada).
- **Decisões de técnica que valem ao ajustar:**
  - os eixos saem de `--peso`/`--larg`, propriedades registradas **sem herança**: a regra que muda o peso tem de
    estar no mesmo elemento que usa `var(--peso)`;
  - cada palavra e cada letra animada é uma célula com o próprio fantasma, alinhada ao início: nada anda ao
    lado (sem salto de layout na abertura, no cursor e na onda do rodapé);
  - o peso dos títulos da lista vai de 220 a 500 com a rolagem (a Bricolage é pesada no tamanho grande), 760
    no hover; em repouso (movimento reduzido), 360;
  - as ilhas (livros, ilustrações) zeram `visibility` (`all: initial`): a ilustração da linha e o "#" dos H2
    se escondem por `clip-path`, e os livros inativos do painel de Categorias por `display: none` (com
    `@starting-style` na entrada);
  - o progresso do artigo é o da leitura do texto (`view-timeline` no corpo), e se recolhe depois dele.
- **Medido com a CPU 4×:** o cursor sobre o nome (146 movimentos em 2,5 s) sem quadro acima de 50 ms (o maior
  ~21 ms); a rolagem da lista (133 quadros) sem quadro acima de 50 ms (o maior ~23 ms).
