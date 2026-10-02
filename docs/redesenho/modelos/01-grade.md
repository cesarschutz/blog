# 01 · Grade

Direção do modelo 01 do redesenho (D55). Quem constrói segue este arquivo, o
`docs/redesenho/README.md` e a API da base (`docs/redesenho/base.md`).

## Ideia

O blog como um sistema tipográfico suíço: uma grade de 12 colunas que se vê, hierarquia por tamanho e
peso, números em tudo e movimento mecânico e exato (máscaras, varreduras, odômetros e linhas que se
desenham em velocidade constante). O preto e o branco ficam com o texto, e **um vermelho-sinal** marca
o que está ativo, sob o mouse ou em foco. As únicas outras cores são as dos livros, e é por isso que
eles saltam da página.

Serve a este blog porque é o visual da clareza e da precisão, que é o assunto de um arquiteto de
soluções. A leitura continua em primeiro lugar.

## Cara

**Cores (tokens do modelo).** O contraste de texto fica em no mínimo 4,5:1. O vermelho só aparece em
texto grande ou em peça que não é texto (traços, marcadores, fundos de hover com texto branco).

| Token | Claro | Escuro | Uso |
|---|---|---|---|
| papel | `#F3F1EC` | `#0F0F0E` | fundo |
| tinta | `#111110` | `#EDEAE3` | texto, blocos, a cortina |
| tinta-2 | `#5B5A56` | `#A3A09A` | texto secundário, metadados |
| filete | tinta a 14% | tinta a 16% | filetes de 1px |
| guia | tinta a 5% | tinta a 6% | as colunas da grade em repouso |
| sinal | `#E0301E` | `#FF5140` | o vermelho: ativo, hover, foco, progresso |
| sobre-sinal | `#FFFFFF` | `#0F0F0E` | texto sobre o vermelho |

Os valores são o ponto de partida: ajuste o que precisar para o contraste, sem mudar a ideia (papel
quente, tinta quase preta, um vermelho só). Os livros e as ilustrações usam as cores deles (ilhas da
base).

**Tipografia.**

- **Switzer** (Fontshare), a grotesca suíça da ITF, em tudo o que é título, texto e interface.
  Variável, se houver; senão, os pesos 400, 500, 600 e 700 (e o itálico 400 para o texto).
- **JetBrains Mono** (já está no `node_modules` da raiz, `@fontsource-variable/jetbrains-mono`) para
  números, índices, metadados e código. Números tabulares.
- **Escala**, tudo em `clamp()` fluido:

  | Peça | Tamanho | Peso | Espaçamento entre letras | Entrelinha |
  |---|---|---|---|---|
  | display da home | de ~4rem a 11rem, ~11vw | 700 | -0,045em | 0,86 |
  | H1 das páginas | de 2,6rem a 5,5rem | 700 | -0,035em | — |
  | H2 do artigo | 1,9rem | 650 | — | — |
  | texto do artigo | 1,125rem (18px) no computador e 1,0625rem no celular | — | — | 1,62 |
  | metadados | 0,8125rem em mono | — | — | — |

  Títulos com `text-wrap: balance`, texto com `text-wrap: pretty`.

**Grade.**

- 12 colunas, com calhas de 24px e margens de 40px, até 1440px. No celular, 4 colunas, calhas de 16px
  e margens de 20px.
- Tudo encaixa nas colunas.
- As **guias** das colunas ficam sempre à vista, muito fracas (token guia), como um fundo em
  `repeating-linear-gradient`.

**Forma.** Raio zero, filetes de 1px, blocos chapados, sem sombra e sem textura.

**Ícones.**

- Desenho próprio, geométrico, com traço de 1,5px, ponta reta e grade de 20px.
- O conjunto: seta, seta diagonal, lupa, meio círculo (tema), menu de duas linhas, fechar, dois
  quadrados (copiar), visto, elo, RSS, GitHub, LinkedIn, `#`, livro, relógio, calendário, `</>` e
  filtro.
- **No hover, o ícone se mexe como máquina:** a seta atravessa e volta por trás, a lupa gira 90° e o
  meio círculo gira 180°. Nada de mola.

**Marca "cs".**

- Um quadrado preto (tinta) com "cs" em Switzer 700, minúsculo e encostado no canto de baixo à
  esquerda, como etiqueta de cartaz suíço, seguido de "Cesar Schutz" em Switzer 600.
- **No hover,** o quadrado é varrido de vermelho de baixo para cima e o "cs" sobe 2px.

## Páginas

**Cabeçalho** (todas as páginas).

- **Computador:**
  - uma linha na grade, fixa no topo, com filete embaixo;
  - a marca nas colunas 1 a 3;
  - no meio, a navegação numerada em mono e Switzer: "01 Artigos" (âncora da lista da home), "02
    Categorias" e "03 Tags";
  - à direita, a busca (retângulo de filete com "Buscar" e a tecla ⌘K) e o botão de tema;
  - ao rolar, o cabeçalho encolhe de 72 para 56px por animação ligada à rolagem, só com CSS.
- **Celular:**
  - a marca à esquerda e, à direita, o tema e o botão de menu (duas linhas);
  - o menu abre um painel de tinta em tela cheia, com os itens enormes (Switzer 700, ~3rem) e
    numerados, que entram por máscara um depois do outro.

**Home.**

- **Topo:**
  - "Cesar Schutz" em display, atravessando a grade;
  - embaixo, uma linha com a apresentação de hoje ("Publico aqui o que ando estudando…") nas colunas 1
    a 4;
  - os três números da coleção em odômetro nas colunas 6 a 8: artigos, livros e tags;
  - "Último artigo" com o título e a data nas colunas 9 a 12.
- **A coleção:** os 8 livros e a revista Java lado a lado, numa fileira que ocupa as 12 colunas. Cada
  um é um **livro 3D** de tamanho médio (~220px de altura no computador), com "Vol. 01" em mono em
  cima. É a estante deste modelo.
- **Artigos:** um **índice**, uma tabela tipográfica com uma linha por artigo.
  - As colunas são: número (028 a 001, em mono), título (o assunto em 600 e o complemento em 400, na
    tinta-2), livro (quadrado na cor do livro e o nome), data e tempo.
  - As colunas 10 a 12 guardam uma **célula de pré-visualização**, fixa ao rolar, que mostra a
    ilustração do artigo sob o mouse (ou em foco). Sem mouse, mostra a do primeiro.
- **Celular:** o nome em duas linhas, os números em duas colunas e os livros numa fileira que rola na
  horizontal, com encaixe. O índice vira linhas empilhadas (número, título e metadados), sem a
  pré-visualização.

**Artigo.**

- **Topo:**
  - uma linha em mono com o quadrado do livro, "Vol. 01 · Arquitetura de Software" (link) e o número
    do artigo;
  - o título em H1 display (o assunto) e o complemento numa segunda linha, mais leve, na tinta-2;
  - os metadados em mono: data, tempo de leitura, tags e o link do código, quando houver.
- **Ilustração:** larga, nas colunas 1 a 12, dentro de um quadro de filete, com a legenda "Fig. 1 —
  <título>" em mono embaixo.
- **Colunas do texto:**
  - o texto nas colunas 4 a 9 (medida de ~680px);
  - à esquerda, nas colunas 1 a 3, o **sumário fixo**, com as seções numeradas (1, 2, 3…) e uma linha
    vertical vermelha de progresso ao lado;
  - à direita, nas colunas 10 a 12, as notas laterais e, no alto, o livro 3D pequeno do artigo, com
    link para o livro.
- **Títulos H2** numerados por contador CSS ("2 — Título"), com o número em mono na margem.
- **Fim:** anterior e próximo como dois blocos grandes de 6 colunas, depois as tags e o livro.
- **Celular:** uma coluna. O sumário vira um botão "Seções" que abre um painel, e as notas laterais
  entram no fluxo.

**Categorias.**

- "Categorias" em H1 display e a linha "Cada categoria é um livro da coleção.".
- Uma grade de células separadas por filetes, sem caixas: 4 por linha no computador, 2 no tablet e 1
  no celular.
- **Cada célula:**
  - "Vol. 01" em mono em cima, à esquerda, e "7 artigos" à direita;
  - o **livro 3D grande** no meio (~340px de altura em 1440px);
  - embaixo, o título (Switzer 700, ~1,75rem), a descrição e a data do último artigo.

**Página do livro.**

- **Tela dividida:**
  - nas colunas 1 a 5, o **livro 3D enorme** (até ~72vh), fixo ao rolar;
  - nas colunas 6 a 12, "Vol. 01", o título em H1 display, a descrição, os números (artigos e último)
    e as tags do livro;
  - por fim, o índice dos artigos do livro, no mesmo formato da home.
- **Embaixo,** as 8 lombadas numa fileira para pular de livro, com o livro atual marcado pelo quadrado
  vermelho.
- **Celular:** o livro em cima (~50vh, sem ficar fixo) e o resto embaixo.

**Tags.** Um índice alfabético em 3 colunas, com as letras grandes (A, B, C…) como marcos. Cada tag
mostra o `#`, o nome e a contagem em mono.

**Tag.**

- "#Spring" em H1 display e "9 artigos em 5 livros" em mono.
- A linha "Aparece junto com" e as tags relacionadas.
- **O filtro por livro:**
  - uma barra segmentada com "Todos" e um segmento por livro presente, cada um com uma capinha plana
    (~44px de altura), o nome e a contagem;
  - o segmento ativo fica invertido (tinta, com o texto no papel), e um indicador vermelho de 4px
    desliza embaixo dele.
- A lista no formato do índice.

## Os três momentos

**1. A abertura da home** (ao chegar de fora ou recarregar).

- Até ~2,4 s. Clique, tecla ou rodinha pulam para o fim.

| Tempo | O que acontece |
|---|---|
| 0 a 0,5 s | as 12 guias das colunas se desenham de cima para baixo sobre o papel vazio (1px, `scaleY`, 25 ms entre elas, da esquerda para a direita), e um filete horizontal corre na linha de base do nome |
| 0,3 a 1,1 s | "Cesar Schutz" sobe por máscara, linha a linha (`translateY` de 100% para 0, 0,7 s, `cubic-bezier(.16,1,.3,1)`) |
| 0,7 a 1,5 s | os três números rolam como odômetro até o valor |
| 0,9 a 1,7 s | os livros entram na fileira de baixo para cima, um de cada vez (Vol. 01 primeiro, 60 ms entre eles, curva expo sem quicar) |
| 1,3 a 2,0 s | as guias voltam à força de repouso, e o índice entra por uma varredura de cima para baixo (`clip-path`) |

- No celular, 4 guias e ~1,8 s no total.

**2. A abertura das outras páginas** (ao chegar de fora ou recarregar).

| Tempo | O que acontece |
|---|---|
| 0 a 0,45 s | um filete vermelho atravessa o topo (`scaleX`) |
| 0,15 a 0,65 s | o número da página (o do artigo, ou 02 e 03 nas seções) rola como odômetro no canto |
| 0,3 a 0,9 s | o título sobe por máscara (0,6 s, expo) |
| a partir de 0,7 s | o resto entra por uma varredura de cima para baixo |

- ~1,4 s no total.

**3. A troca de página** (navegando dentro do modelo).

- **A cortina:**
  - um painel de tinta entra pela direita cobrindo a página antiga (~0,38 s,
    `cubic-bezier(.7,0,.3,1)`), com o **nome do destino** em Switzer 700 enorme, no papel ("Categorias",
    "#Spring" ou o assunto do artigo);
  - depois a cortina sai pela esquerda e revela a página nova (~0,42 s);
  - a troca inteira dura ~0,8 s.
- **Técnica sugerida,** sem interceptar cliques:
  - a página nova nasce com a cortina no DOM, com nome de View Transition próprio;
  - na fase da View Transition, `::view-transition-new(cortina)` entra por `clip-path` sobre a imagem
    da página antiga, com a raiz nova escondida;
  - quando a transição termina, a cortina real sai por `clip-path`;
  - repor o `plus-lighter` se mexer nas animações padrão.
- **Voltando pelo histórico,** a cortina vem da esquerda.
- **Categorias:** o desfile toca quando a cortina sai.

## Categorias: o desfile e os livros grandes

**O desfile** toca sempre que a página de Categorias aparece, vindo de fora ou pela cortina.

- Primeiro, os filetes da grade se desenham: os horizontais da esquerda para a direita e os verticais
  de cima para baixo, 0,4 s.
- Depois as células se revelam **coluna por coluna**, por uma varredura vertical (`clip-path`), com
  80 ms entre as colunas.
- Dentro de cada célula, o livro sobe 24px e assenta vindo de 44° até os 38° de repouso, e o texto
  sobe por máscara.
- Total de ~1,3 s. No celular, célula por célula, com 60 ms entre elas.

**Hover numa célula:**

- a célula é pintada com a **cor do livro** de baixo para cima (`clip-path`, 0,42 s), e os textos
  passam para a tinta do livro;
- o livro gira de 38° para 24° (0,5 s);
- a contagem rola como odômetro.

**Página do livro:**

- o livro enorme e fixo gira devagar conforme a lista rola, de 38° para ~16°, por animação ligada à
  rolagem (CSS, `animation-timeline: scroll()`, com `@supports`);
- no hover, ele volta a 30°.

## Filtro da tag

- **No clique:**
  - o indicador vermelho desliza até o segmento escolhido (FLIP, 0,3 s, expo);
  - o segmento se inverte por varredura;
  - as contagens e o total rolam como odômetro.
- **A lista:**
  - as linhas que saem são cortadas de cima para baixo (`clip-path`, 0,2 s);
  - as que ficam sobem para o lugar (FLIP com `transform`, 0,32 s);
  - as que entram se revelam por varredura, com 30 ms entre elas.
- Usa os eventos `filtro:antes` e `filtro:depois` da base.

## Troca de tema

Uma **varredura reta**, não um círculo: o tema novo cobre a página como uma parede vertical que corre
a partir da coluna do botão até as bordas (`clip-path` na View Transition, 0,5 s,
`cubic-bezier(.7,0,.2,1)`). No hover, o ícone de meio círculo gira 180° (0,36 s).

## Catálogo de detalhes

Todos também com o foco do teclado. Curva padrão: `cubic-bezier(.16,1,.3,1)` para entradas e
`cubic-bezier(.7,0,.3,1)` para varreduras.

1. **Menu:**
   - no hover, um sublinhado vermelho de 2px varre da esquerda (0,22 s) e, ao sair, termina de passar
     e some pela direita (0,16 s);
   - o número do item fica vermelho.
2. **Item atual do menu:**
   - um quadradinho vermelho de 6px fica antes do número;
   - na troca de página, ele desliza até o item novo (View Transition `marcador-menu`, 0,4 s).
3. **Marca:** o quadrado é varrido de vermelho de baixo para cima (0,26 s), e o "cs" sobe 2px.
4. **Busca no cabeçalho:**
   - no hover, o retângulo se inverte por varredura;
   - ao usar ⌘K, a tecla afunda 1px por 120 ms.
5. **Busca aberta:**
   - um painel desce do cabeçalho por `clip-path` (0,32 s) e mostra resultados numerados em mono;
   - o termo aparece sublinhado de vermelho no título do resultado;
   - com as setas, um marcador vermelho salta entre os resultados (0,16 s);
   - Esc fecha;
   - usa o `buscar()` da base.
6. **Tema:** o meio círculo gira 180° no hover e, no clique, vem a varredura reta.
7. **Odômetros:** os números da coleção e das células rolam ao entrar na tela e sempre que mudam, com
   cada algarismo numa fita.
8. **Linha do índice:**
   - no hover, uma barra vermelha de 3px cresce sob o número (`scaleX`, 0,24 s), o título anda 8px para
     a direita e uma seta → entra no fim da linha;
   - ao sair, tudo volta em 0,18 s.
9. **Pré-visualização da home:** a ilustração nova varre por cima da anterior, de baixo para cima
   (0,3 s), e a legenda em mono troca junto.
10. **Livro da fileira da home:**
    - no hover, sobe 8px e mostra embaixo "Vol. 01 · 7 artigos" por máscara;
    - os vizinhos não se mexem.
11. **Célula de Categorias:** a cor do livro sobe, o livro gira e o número rola (veja acima).
12. **Filtro:** o indicador desliza, o segmento se inverte e a lista se reorganiza (veja acima).
13. **Links do texto:** sublinhado de 1px na tinta; no hover, vira vermelho de 2px, varrendo da
    esquerda (`background-size`, 0,2 s).
14. **H2 do artigo:**
    - no hover, aparece um `#` na margem, e o clique copia o link da seção;
    - o rótulo "Link copiado" rola letra por letra (12 ms entre elas) e some em 1,2 s.
15. **Sumário:**
    - a seção atual ganha o quadradinho vermelho e o número vermelho;
    - a linha vertical de progresso preenche por animação ligada à rolagem, só com CSS;
    - o clique leva à seção descontando o cabeçalho.
16. **Progresso no topo:** 2px vermelhos, `scaleX` ligado à rolagem, só com CSS.
17. **Copiar código:**
    - no hover, o quadrado de trás dos dois se desloca 2px;
    - no clique, o ícone vira visto e o rótulo rola para "Copiado";
    - tudo volta em 1,6 s.
18. **Notas laterais:** ao passar o mouse pelo número no texto, a nota na margem ganha uma barra
    vermelha à esquerda, e vice-versa.
19. **Anterior e próximo:**
    - no hover, o bloco se inverte (tinta) por varredura a partir do lado da seta (0,32 s);
    - a seta avança 6px.
20. **Voltar ao topo:**
    - um quadrado com ↑ aparece depois de uma tela de rolagem (ligado à rolagem);
    - no hover, a seta sai por cima e volta por baixo (0,36 s).
21. **Tecla G:**
    - liga e desliga a grade por cima da página, com as 12 colunas vermelhas translúcidas descendo em
      cascata (25 ms entre elas);
    - um aviso discreto em mono ("Grade: ligada") aparece no canto;
    - o detalhe para quem gosta de grade.
22. **Seleção de texto:** fundo vermelho e texto no sobre-sinal.
23. **Tags em pílula:**
    - o `#` fica em mono;
    - no hover, a pílula se inverte por varredura (0,18 s).
24. **Rodapé:**
    - "Cesar Schutz" em display gigante, cortado pela borda de baixo da página (só a metade de cima à
      vista), com as redes e o RSS em cima;
    - no hover das redes, a seta ↗ anda na diagonal.
25. **Foco do teclado:** contorno quadrado vermelho de 2px, sem raio, com 3px de afastamento, em tudo.
26. **Cursor:** o padrão do sistema. A precisão está na página, não no cursor.

## Técnica

- **Hovers:** CSS (`transition` em `transform`, `clip-path`, `background-size` e `opacity`).
- **Ligado à rolagem:** progresso, cabeçalho que encolhe, voltar ao topo e livro da página do livro,
  com `animation-timeline: scroll()` e `view()`, protegidos por `@supports` (sem suporte, fica
  parado).
- **Aberturas, desfile, filtro (FLIP) e odômetros:** Web Animations API, sem biblioteca. O GSAP só
  entra se o construtor provar que precisa (ex.: `SplitText`), e aí sob demanda.
- **Troca de página e de tema:** View Transitions.
- **As guias em repouso** são um fundo em `repeating-linear-gradient`. As guias que se desenham na
  abertura são 12 elementos de 1px animados por `scaleY`, que depois saem do DOM.
- **Fontes:** Switzer baixada pelo `npm --prefix redesenho run fontshare -- switzer …` (confira se há
  versão variável) e JetBrains Mono da raiz.

## Referências usadas

A preencher depois da pesquisa: `docs/redesenho/referencias.md`. Base histórica: os cartazes de Josef
Müller-Brockmann e a grade tipográfica suíça.

## O que não fazer (para não virar outro modelo)

- **Cursor:** nada de cursor personalizado, nem de ilustração que segue o cursor (Galeria, Índice e
  Noturno).
- **Letra:** nada de serifa de display (Revista), nem de fonte variável animada (Tipo Vivo).
- **Movimento:** nada de mola nem de quique (Cinético). Aqui tudo é exato.
- **Superfície:** nada de raio, sombra, textura ou luz (Noturno e Biblioteca).
- **Metáfora:** nada de terminal nem de desenho técnico com cotas (Terminal e Planta).

## Retorno do Cesar

(vazio)

## Estado da construção (29/09/2026)

A construção foi pausada a pedido do Cesar logo depois da leitura e do planejamento. **Nenhum código do
modelo foi escrito ainda:** `redesenho/src/modelos/01-grade/` e `redesenho/src/pages/01-grade/` não
existem.

**Fontes baixadas.** A Switzer da Fontshare tem versão variável (peso 100 a 900, normal e itálico), e é
ela que entra, baixada à mão porque o `scripts/fontshare.mjs` da base ainda não existia:

- `redesenho/src/fontes/switzer/Switzer-Variable.woff2` (43 KB);
- `redesenho/src/fontes/switzer/Switzer-VariableItalic.woff2` (33 KB).

Falta escrever o `@font-face` (no CSS do modelo). A JetBrains Mono vem de
`@fontsource-variable/jetbrains-mono`, que o `ilhas.css` da base já importa.

**Arquivos criados:** só as duas fontes acima e esta seção.

### Por página

| Página | Pronto | Falta |
|---|---|---|
| Home | nada | tudo: topo com o nome, os três odômetros e o último artigo; a fileira dos 9 livros 3D; o índice com a pré-visualização fixa |
| Artigo | nada | tudo: topo, figura com legenda, sumário fixo, texto nas colunas 4 a 9, notas e livro pequeno na margem, H2 numerados, anterior e próximo |
| Categorias | nada | tudo: a grade de células com os livros grandes, o desfile e o hover |
| Livro (categoria e série) | nada | tudo: a tela dividida com o livro fixo que gira com a rolagem, o índice e as lombadas |
| Tags | nada | tudo: o índice alfabético em 3 colunas |
| Tag | nada | tudo: o título, as relacionadas, a barra segmentada do filtro e a lista |

### Os três momentos

- Abertura da home: não feita.
- Abertura das outras páginas: não feita.
- Cortina (troca de página): não feita.

### Catálogo de detalhes

Os 26 itens estão por fazer.

### O que ficou decidido no planejamento (para a próxima sessão não refazer a leitura)

- **Estrutura:**
  - um `Layout.astro` do modelo com a `Cabeca` da base, `<DefinicoesIlhas />`, o cabeçalho, o rodapé,
    a busca, o menu do celular e a cortina;
  - as páginas em `src/pages/01-grade/`: `index`, `posts/[slug]`, `categories/index`,
    `categories/[categoria]`, `series/[serie]` (a revista Java, porque `rotas().livro()` aponta para
    ela), `tags/index` e `tags/[tag]`.
- **Tokens:** além dos da direção, o `:root` do modelo precisa definir os nomes que o Expressive Code e
  o `caneta.css` do blog leem fora das ilhas: `--ink`, `--ink-2`, `--paper`, `--paper-hi`, `--rule`,
  `--acento`, `--font-ui`, `--font-codigo`, `--caneta` e `--marca-texto`.
- **Conteúdo do post:**
  - as marcas da caneta (3 posts) usam o `@blog/styles/caneta.css`, com a classe `.prose` no corpo e o
    `canetaNoLugar()` de `@blog/scripts/caneta`;
  - o Copiar já vem do Expressive Code com as duas folhas e o visto (`.gesto-copiar`, `.tras`,
    `.frente`, `.visto`, `.rotulo-rola`); o gancho de "copiado" é o `@comum/codigo`;
  - as notas laterais saem como `span.nota-lateral` logo depois de `sup.ref-nota`. No computador,
    `float` na margem direita; no celular, abrem no lugar (`:target` sem JS, classe com JS);
  - o sumário vem de `secoesDoSumario()` (`@blog/lib/posts`).
- **Cortina:**
  - o script embutido fica no `<head>` (`pagereveal`) e liga `html.cortina` só na navegação dentro do
    modelo com View Transition;
  - o `view-transition-name: cortina` só vale com essa classe;
  - `::view-transition-new(cortina)` entra por `clip-path`, a raiz nova fica escondida e a velha, parada;
  - no fim, a cortina real sai por `clip-path` (WAAPI);
  - no histórico, entra o tipo `volta`;
  - o cabeçalho fica acima da cortina, para o marcador do menu deslizar (`marcador-menu`).
- **Tema:** varredura horizontal a partir de `--tema-x` (posto pela base) no `::view-transition-new(root)`,
  com os outros nomes de transição desligados durante `.trocando-tema`.
- **Rolagem:**
  - o cabeçalho encolhe por `transform`: o cabeçalho sobe 16px e o miolo desce 8px, sem mudar a altura;
  - o livro da página do livro gira por uma propriedade registrada do modelo (`--grade-giro`),
    animada pela rolagem, para o hover poder pôr 30° por cima.
- **Odômetro:** fitas de algarismos com o valor final já no HTML (sem JS, o número certo). O hover da
  célula dá uma volta inteira, com a fita de 0 a 9 duas vezes.
- **Pré-visualização da home:** as ilustrações em `<template>`, clonadas sob demanda (28 SVGs vivos
  pesariam).
- **Categorias:** as 8 categorias em 2 fileiras de 4; a revista Java numa célula larga, numa fileira
  "Séries" embaixo.
- **Pendências da base** percebidas até aqui:
  - `/busca.json` ainda dava 404;
  - `scripts/fontshare.mjs`, `scripts/conferir.mjs`, `docs/redesenho/base.md` e o molde `00-base` ainda
    estavam vazios.
