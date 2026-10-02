# Direção de arte da rodada 4 (a versão final)

Diretor: Fable 5.1, 01/10/2026. Fonte: `retorno-cesar.md` e `controle.md` desta rodada. Toda afirmação
sobre o que existe vem de captura desta sessão, em `.astro/depuracao/redesenho/r4/direcao/` (citada pelo
nome do arquivo). O que não vi está na seção 5.

Quem lê isto é o construtor (Opus). Cada peça traz o objetivo, o que se vê e se sente, e os números que
definem o resultado. Como fazer é com o construtor, dentro das regras do redesenho
(`.claude/rules/redesenho.md`). Quando um pedido do Cesar e esta direção divergirem, vale o Cesar.

---

## 0. Decisões de partida

### O protótipo final parte da cópia 18

`redesenho/novos/21-final` nasce de `redesenho/novos/18-estante-moderna/`. Motivos, vistos: o 18 já tem
os abajures de latão em cima dos livros em todo lugar em que ele os pediu (home: `18-livros-claro.png`;
Livros: `18-categorias-claro.png`; filtro de Todos os artigos, com a luz acesa sobre o lugar do livro
tirado: `18-artigos-filtro-escuro-depois.png`; fileira de cima da página do livro, que encolhe ao rolar
com as luzes: `18-livro-seguranca-topo.png` e `-rolado.png`), a abertura com a estante que se monta
(`folha-18-abertura.png`), as lombadas na fileira em tela estreita (`18-home-390.png`,
`18-home-768-colecao.png`) e a gaveta na home (`18-gaveta.png`). As outras linhas entram como peças.

### O que "não vamos ter essas partes de madeira" significa

Ele disse isso ao escolher a home do nome grande (17, 18, 20) em vez das homes de parede (16) e de
biblioteca (19), cujas estruturas são madeira: a tábua com suportes e a mesa do 16
(`16-home-claro.png`), a estante, o balcão e o fichário do 19 (`19-home-escuro.png`, `19-tags.png`). A
leitura: **não há superfície grande de madeira em nenhuma página** (nem parede, nem mesa, nem balcão,
nem estante com laterais). O que fica de "marcenaria" é só o que ele elogiou pelo nome: os abajures de
latão e a cordinha. Em consequência:

- a cara geral é papel, tinta, latão e luz, sobre o fundo claro do 20 e o escuro marrom do 19;
- a prateleira fina do 18 (`zoom-18-prateleira-claro.png`) é madeira e sai do protótipo; ela volta só
  como uma das variantes da amostra dos livros (seção 2, V4), em laca escura, não em madeira;
- as gavetas de letras de Tags (P19-2) ficam, mas o móvel deixa de ser de madeira: vira um fichário de
  aço esmaltado com puxadores e porta-etiquetas de latão (seção 1, P19-2); a versão de madeira do 19 vai
  para a amostra D3;
- o rodapé ganha uma superfície que não é madeira (seção 3, R1).

### A cara (G1, G4, G5)

- **Claro: a paleta do 20** (`redesenho/novos/20-noturno/src/styles/tokens.ts`, bloco `claro`): papel
  `#EFEAE2`, folha `#FFFDF9`, tinta `#1B1A18`, azul `#2549B8`. É o papel quente de `20-home-claro.png`.
- **Escuro: a paleta do 19** (`19-biblioteca/src/styles/tokens.ts`, bloco `escuro`): papel `#1C1814`,
  folha `#25201B`, tinta `#EEE6D8`, azul `#93AEFF`. É o marrom de `19-home-escuro.png`, sem os tokens de
  madeira. Preto e azul vão para a amostra D2 (seção 3).
- **Latão e luz: os do 18** (`18-estante-moderna/src/styles/tokens.ts`): `latao #B08D57`, `latao-luz
  #E9D2A2`, `latao-escuro #6E532E`, mais `luz-quente`, `sombra-quente`, `halo-quente`, `luz-mouse` e
  `ponto-luz` da base. A cor do livro, a caneta azul e os tons das figuras não mudam (D58).

---

## 1. A versão final, item por item

### Geral

| # | O que entra | De onde (arquivos) | Como fica |
|---|---|---|---|
| G1 | A home do nome grande | 18 (a cópia de partida) | O caderno "cs", "Cesar Schutz" em Besley 800 na largura do conteúdo, o texto, os três números que rodam, "Último artigo", "A coleção" com a fileira, "Artigos recentes". Nada muda fora do que está abaixo. |
| G2, G6, P17-2, P18-1, P20-1, P20-2 | O chão dos livros da home: **o nicho afundado** (seção 2, V1), com o abajur de latão do 18 pendurado mais alto e o cone de luz à vista | 20: `src/components/Colecao.astro` (bloco "linha 20: o palco", a base do nicho) e os `.ponto-palco`; 18: `src/styles/estante-moderna.css` (o desenho do abajur: braço e cúpula de latão) | Os livros dentro de um rebaixo da página, com a parede do fundo mais escura e a borda da frente à vista. Resolve o "voar" do 17 sem estante. As outras seis formas ficam na amostra D1. |
| G3 | Os abajures em cima dos livros | 18 | Em toda fileira de livros 3D ou de lombadas: home, Livros (cards), filtro de Todos os artigos, fileira de cima da página do livro. Um por livro; abaixo de 700px, um a cada dois (como o 18 já faz). |
| G4 | Fundo claro do 20 | 20: `tokens.ts` | Seção 0. |
| G5 | Escuro marrom do 19 | 19: `tokens.ts` | Seção 0; preto e azul na amostra D2. |

### Animações

| # | O que entra | De onde | Como fica |
|---|---|---|---|
| A1 | A entrada da home do 18, em ordem, com o nome do 20 | 18: `src/components/Abertura.astro`, `src/scripts/estante-viva.ts` (a onda), `src/scripts/livro-vivo.ts` (o brilho, `csLivroVivo.onda`); 20: `src/components/Abertura.astro`, passo 3 ("a luz chega ao nome"), o `::after` que desliza −46,43% | Ver "A1 em detalhe", abaixo. |
| A2 | A entrada nas outras páginas | base (o caderno que voa) | Como está. |
| A3 | A cortina azul com o nome e, depois dela, a animação do blog de hoje | base: cortina (`troca.js`); 11: `src/pages/categories/index.astro` (o desfile de Livros: pilha à direita com "Volume 02 · nome" grande à esquerda, `folha-11-livros.png`), `src/scripts/troca.js` (as fichas de Tags jogadas do alto à direita, tortas, que se arrumam na grade, `folha-11-tags.png` t600 a t1300; e a montagem das folhas das listas, `folha-11-artigos.png`) | Ver "A3 em detalhe". |

**A1 em detalhe.** Hoje no 18 (`folha-18-abertura.png`, `folha-18-abertura-fim.png`): o fio da
prateleira se risca (0,25s), a tábua aparece (0,7s), os livros chegam um a um com "Volume 02", "Volume
08", "E a revista" embaixo (1,1s a 2,1s), a fileira desce para o lugar e a página aparece em volta
(2,6s a 3,2s), os números rodam, e **a onda (sobe e desce) e o brilho acontecem juntos** (t3600 os
livros 1 e 2 estão no alto; t4200 o brilho já passa por SRE e Carreira enquanto a onda termina). Ele
pediu "primeiro subir e descer os livros e depois o brilho apenas" e o nome entrando "da direita para a
esquerda depois que aparece os livros". A sequência final:

1. 0 a 0,3s: o fio do chão do nicho se risca da esquerda para a direita (o mesmo risco de hoje).
2. 0,3 a 0,7s: o nicho se abre: a parede do fundo escurece e a sombra do teto cresce (é "o buraco"
   aparecendo). Nada de livro ainda.
3. 0,7 a 2,2s: os livros chegam um a um, como hoje, com as legendas "Volume NN" e "E a revista".
4. 2,2 a 2,7s: a fileira desce para o lugar dela na página; a página aparece em volta (caderno, texto,
   números a zero, "A coleção", "Artigos recentes").
5. 2,5 a 2,95s: **o nome gigante entra da direita para a esquerda**, como no 20
   (`folha-20-nome.png`: a frente desfocada descobre "tz" a t1350 e chega ao "C" a t1450): a mesma
   frente de luz com borda desfocada, mas em 0,45s (o nome é maior e merece ser visto). No claro a
   frente é de sombra quente clareando, não de luz âmbar sobre preto. Os três números começam a rodar
   quando a frente passa por eles (2,8s), não no fim.
6. 2,9 a 3,4s: os abajures acendem um a um da esquerda para a direita (60ms entre eles, a curva de
   incandescente da área 2 da rodada 3), e cada cone aparece com a lâmpada.
7. 3,4 a 4,1s: **só a onda**: cada livro faz a mola do hover (sobe 6px e volta, 0,55s), 75ms entre
   eles. Nenhum brilho enquanto a onda corre.
8. 4,1 a 5,0s: **só o brilho**: a faixa de luz de cima para baixo percorre a fileira (1,2s no total,
   60ms entre livros), com os livros parados.
9. Total: 5,0s. Com movimento reduzido: tudo no estado final, luzes acesas, sem nada se mexendo.

**A3 em detalhe.** A cortina é a de hoje (sobe em 0,38s, segura, sai pelo alto até ~1s; azul-tinta com
texto claro no claro, papel com texto azul no escuro). O que muda é o que acontece por baixo dela:

- **Tags:** as fichas que estão acima da dobra chegam **jogadas do alto à direita, tortas**, como no
  blog de hoje (`folha-11-tags.png`: a t600 estão espalhadas e giradas, a t1300 na grade); o ponto de
  partida que a `troca.js` da r3-base já usa para cards (`translate(10% da largura, −16% da altura)
  rotate(−4° a −2°) scale(0,84)`) é o mesmo gesto e serve de referência. Começam a 0,5s (ainda
  cobertas pela cortina) e assentam até 1,4s depois do clique. As fichas abaixo da dobra **caem de cima** quando entram na tela, como no 19
  (`folha-19-tags-chegada.png`, rolado t150 a t400), e as fichas de uma gaveta aberta também caem
  (`folha-19-gavetas.png`). Decisão em uma linha: o pedido "principalmente tag" é a chegada, e o
  "gostei muito dos cards caindo" é a rolagem e a gaveta; cada um fica no seu momento e os dois existem.
- **Livros:** o desfile do blog de hoje (`folha-11-livros.png`): os cards se empilham à direita, girados,
  enquanto o volume e o nome do livro aparecem grandes à esquerda, um por livro, e no fim a pilha se
  espalha na grade. Hoje ele leva 3,4s depois do clique sem cortina; aqui o desfile começa a 0,5s, por
  baixo da cortina, e tudo está assentado até 3,5s depois do clique (a 2,5s da cortina sair). O que
  estiver abaixo da dobra assenta direto.
- **Listas e qualquer outra tela** (Todos os artigos, a tag, a série, a página do livro, home vinda por
  dentro): a montagem das folhas do blog de hoje (`folha-11-artigos.png`: as folhas chegam do fundo e
  da direita, levemente giradas, e pousam em ~1,2s), começando a 0,5s. É a `troca.js` do 11 com o tempo
  de pouso de hoje. A gaveta do livro, a troca de livro na fileira, a paginação e Lista/Cards não têm
  cortina (como está).

### Rodapé

| # | O que entra | De onde | Como fica |
|---|---|---|---|
| R1 | Uma superfície sob a ficha, sem madeira: **o tampo de feltro verde** (seção 3, D5-A) | 19: `src/components/Rodape.astro` (a composição ficha-sobre-tampo com o nome atrás, `19-rodape.png`) | A ficha de empréstimo deitada sobre uma faixa de feltro na cor do caderno da marca, na largura toda; o nome gigante na página, atrás, cortado pela borda de cima do feltro com 58% das maiúsculas à vista. As outras três superfícies ficam na amostra D5. |
| R2 | A cordinha do 19 para subir | 19: `src/components/Rodape.astro` (`.cordinha`, `.cordinha-fio`, `.cordinha-pingente`, `.cordinha-texto`, o script no mesmo arquivo) | Pendurada à direita do rodapé, do alto do feltro, com o pingente de latão e "Puxe para subir" no hover (`19-rodape-hover.png`). **Saem a bolinha com a seta** (`VoltarTopo.astro`, que no 19 ainda coexiste com a cordinha: `19-rodape.png`, canto inferior direito) **e a fita de subir da ficha** (o marcador verde sob a ficha, `18-rodape.png`). A cordinha é o único jeito de subir. Hover: balanço de pêndulo que decai (14°, −7°, 3°, −1°, 1,2s). Clique: a cordinha estica 10px (0,12s), solta, e a página sobe. A 390 ela existe, mais curta (60px de fio), na borda direita do feltro. |

### Por protótipo

| # | O que entra | De onde | Como fica |
|---|---|---|---|
| P16-1 | "Artigos recentes" como papel colado, e o botão Lista/Cards parecido | 16: `src/styles/parede.css` (`.etiqueta`, `.fita-adesiva`), `src/components/Recentes.astro` (a etiqueta, `16-recentes-zoom.png`) | A etiqueta de papel (folha, sombra curta de 2px, girada −0,6°) com a fita adesiva semitransparente no canto de cima à esquerda, colada direto no papel da página (sem cortiça, sem alfinete). O título e "28 artigos publicados" dentro dela. **Lista/Cards vira uma tira de papel igual**, colada com uma fita no canto de cima à direita, com as duas opções e o disco azul-tinta deslizando entre elas (a `tinta` de hoje). |
| P16-2 | Paginação como papel: **um papel com tudo** | 16: `src/components/Paginacao.astro` (`16-paginacao-zoom.png`) | O papel com 1, 2, 3 e "Mais artigos", colado com fita nos dois cantos de cima (no 16 são alfinetes; aqui é fita, porque não há cortiça). O disco azul na página atual. "Um papel por botão" vai para a amostra D4. |
| P16-3 | As letras do menu girando no hover | base (T12, `16-menu-hover-t110.png`) | Como está. |
| P16-4 | Em Livros, o abajur como na home | 18: `src/pages/categories/index.astro` e `estante-moderna.css` (`18-categorias-claro.png`) | O abajur de latão em cima de cada livro do card; o cone acende forte no hover junto com a pintura do card (`18-categorias-escuro-hover.png`). |
| P16-5 | Página do livro: a fileira no alto que encolhe ao rolar; as tags em volta do livro | base e 18 (`18-livro-seguranca-topo.png`, `-rolado.png`) | Como no 18, com o chão trocado: a fileira de cima fica num nicho raso (seção 2, V1, "no topo"), que encolhe junto com a chapa. |
| P16-6 | A tela de todas as tags da cortiça | 16: `src/pages/tags/index.astro` | Só na amostra D3 (a final é o fichário, P19-2). |
| P16-7 | Cards centrados quando há menos de 4 | base (`19-livro-dados-deste2.png`, `18-artigos-filtro-depois.png`) | Como está, em livros e em tags. |
| P16-8 | Cards aparecendo ao rolar | base (`revelar.ts`) | Como está. |
| P16-9 | Post: grande em cima, "Neste artigo" embaixo; os cards do post como ficha | base; 16: `16-post-fim.png` (o anterior e próximo numa folha lisa) | O anterior e próximo viram **fichas** como os cards do site: a tira de cima em mono ("Vol. 05 · ficha 1 · nº 027") sobre o fio da cor do livro, a ilustração à esquerda, o texto à direita. "Como hoje" e "papel colado" vão para a amostra D6. |
| P17-1 | O traço sob "A coleção" e "Artigos recentes" | 17: `src/components/TracoTitulo.astro`, o uso em `Recentes.astro` e `Colecao.astro` (`folha-17-traco.png`: o traço se escreve entre 120 e 320ms ao entrar na tela) | Nos dois títulos da home, uma vez, 0,34s. Só na home. |
| P18-2 | O abajur em Todos os artigos e em Livros | 18 (`18-artigos-filtro-antes.png`) | Como está, sobre a estante de filtro de lombadas; o chão da estante vira o nicho raso (seção 2). |
| P18-3 | A luz do livro tirado fica acesa | 18: `estante-moderna.css` (as regras `[aria-pressed="true"]` → `.ponto-luz-cone`), `18-artigos-filtro-escuro-depois.png` | Como está. **Vale também para a home e para o topo da página do livro:** quando o livro vai para a gaveta ou para o painel, o abajur do lugar vazio fica aceso sobre o contorno tracejado. |
| P19-2 | Gavetas de letras na vertical, ao lado da nuvem | 19: `src/components/Movel.astro`, `src/scripts/fichario.ts`, `src/scripts/fichas-caem.ts` (`19-tags.png`, `folha-19-gavetas.png`: clicar em G puxa a gaveta e a ficha do Gradle cai) | Em ≥ 1000px, a nuvem de palavras à esquerda (ocupa o que sobra) e o fichário em pé à direita, com a mesma altura da nuvem: 3 colunas × 9 linhas (A a Z e "Todas" na última), gavetas de 52×34px, frente com porta-etiqueta e puxador de latão. **Material: aço esmaltado**, na cor da tinta a 85% sobre o papel no claro (um cinza-grafite quente) e na folha escura no escuro, com a etiqueta de papel e a letra em mono; letras sem tag com a gaveta apagada. Comportamento do 19: a gaveta sai 18px com sombra (0,4s), as fichas da letra caem; "Todas" puxa em cascata (40ms) e mostra todas com as letras dividindo a linha. Abaixo de 1000px: embaixo da nuvem, na horizontal, 9 × 3, como está. A versão de madeira do 19 vai para a amostra D3. |
| P19-3 | "Deste livro também" com as tags como papel | 19: o estilo das fichas pequenas em `src/pages/categories/[categoria].astro` e `src/styles/biblioteca.css` (`19-livro-dados-deste2.png`: papel branco, ícone, "#Trade-offs", "5 artigos no blog") | Como no 19. |
| P19-4 | Os cards caindo de cima para baixo | 19/base: `fichas-caem.ts` | Na rolagem e nas gavetas de Tags (A3). |
| P20-2 | A luz da home mais longe do livro, com os raios à vista | 20: `.ponto-palco` em `Colecao.astro` (cone de 44°, `zoom-20-palco-claro.png`, `-escuro.png`) | O abajur do 18 pendurado na altura dos pontos do 20 (seção 2, V1): corpo de latão, cone longo. |

---

## 2. Os livros parados na home (amostra D1)

O problema, nas palavras dele e nas capturas: sem nada embaixo os livros voam (`17-livros-claro.png`:
só sombras no papel, e os nomes soltos embaixo); com estante fica estranho (`18-livros-claro.png`: a
tábua marrom lisa com "Vol. 01" pintado nela, e no escuro ela quase some, `18-livros-escuro.png`); o
afundado do 20 ele gostou (`20-livros-claro.png` e `-escuro.png`: a faixa mais escura com o trilho em
cima, o chão mais claro e a frente embaixo) e, na home, preferiu a luz do 20 (os pontos pendurados no
trilho a 84px acima dos livros, cone de 44° que desce até o chão: `zoom-20-palco-escuro.png`) à do 18
(a cúpula encostada no alto do livro, cone curto e quase invisível no claro:
`zoom-18-prateleira-claro.png`).

Todas as variantes têm o **abajur de latão do 18** (braço curto e cúpula) acima de cada livro. Em todas,
o hover do livro é o da base (mola, segue o mouse, brilho) e o cone do abajur daquele livro sobe de
força em 0,4s. A amostra é `/amostras/livros-home/`: as sete fileiras reais, em sequência, com o título
"A coleção" e o hover funcionando, um botão de tema e, abaixo de cada fileira, a mesma variante como
ela fica no topo da página do livro (a 60%, encolhida) e no filtro de lombadas; a página é responsiva,
então a 390 cada variante mostra o estado de lombadas.

Medidas de referência: a fileira da home tem nove lugares, livros de 214px de alto a 1440, o vão de
24px antes da série; abaixo de 1100px os livros giram para lombada (como o 18 e o 20 já fazem,
`18-home-390.png`, `20-home-390.png`).

### V1. Nicho (a escolhida)

**Ideia:** a fileira dentro de um rebaixo cortado na página, como um nicho de parede: os livros têm
chão, teto e fundo, e nada é móvel.

**O que se vê.** Uma caixa recuada na largura do conteúdo, cantos de 3px. A parede do fundo é mais
escura que a página (claro: o papel com 9% de tinta, `#DCD7CF`; escuro: o papel com 45% de preto,
`#0F0C0A`). No alto, a sombra do teto desce 48px (sombra quente de 18% a 0); nas laterais, 28px (10% a
0); as pontas são fechadas, não desvanecidas (é um buraco, não um palco). O chão é uma faixa de 14px um
nada mais clara que a parede (4% de folha). A borda da frente é um friso de 10px abaixo do chão, na cor
da parede com 10% de tinta a mais no claro e 30% de preto a mais no escuro, com um fio de luz de 1px no
alto (folha a 70% no claro; luz quente a 18% no escuro) e 3px de sombra quente (22%) logo abaixo do
fio. Do alto do nicho ao alto dos livros há 84px (o teto); nele ficam os abajures e, em mono pequeno, os
rótulos "Vol. 01" como no 20. Os nomes dos livros ficam fora, abaixo do friso. Os abajures saem da parede
do fundo a 70px acima do alto dos livros, cúpula virada para baixo; o cone tem 44° e chega ao chão,
onde pousa uma poça de luz elíptica de 1,3× a largura do livro e 10px de alto. Repouso: cone a 0,2 e poça
a 10% no claro; 0,35 e 28% no escuro. Hover: 0,55 e 25% no claro; 0,9 e 45% no escuro. A sombra quente
de cada livro cai no chão do nicho, nos dois temas.

**Números:** profundidade visual dada por teto 84px + sombra 48px + friso 10px; espessura do friso
10px; chão 14px; cantos 3px; parede 9% de tinta (claro) e 45% de preto (escuro).

**Comportamento.** Lombadas (< 1100px): o nicho estreita até as lombadas mais 24px de cada lado, o
teto cai para 40px, o cone encurta, um abajur a cada dois livros abaixo de 700px. Gaveta: o livro sai do
buraco para a frente (cresce até 1,1 ao passar o friso) e desce para a gaveta abaixo do nicho (0,9s,
`power3.inOut`); o lugar fica tracejado na parede do fundo e **o abajur dele fica aceso** (P18-3). No
topo da página do livro: o nicho raso do 20 (teto 46px, chão 12px, friso 12px) atrás da chapa, encolhendo
a 60% ao rolar; o lugar do livro aberto tracejado e aceso. No filtro de Todos os artigos: um nicho curto
do tamanho da estante de lombadas, com os abajures do 18. Abertura: a sequência A1 (o fio se risca, o
nicho se abre, os livros chegam).

**Por que esta:** é a única forma que ele descreveu com emoção ("parece que afunda o site com os livros
pra dentro"), resolve o voar sem móvel nenhum (o chão existe porque o buraco existe), não tem madeira, e
já dá o lugar natural para a luz "mais longe do livro, com os raios à vista": o teto do nicho.

### V2. Prateleira de vidro

**Ideia:** a forma limpa do 17 com um apoio que quase não existe: uma lâmina de vidro fumê.

**O que se vê.** Sob os livros, uma lâmina de 6px, translúcida (claro: tinta a 10% com um fio de folha
a 80% na aresta de cima; escuro: folha a 18% com fio de luz quente a 30%), 1,5% mais larga que a
fileira, sem suportes. Na página, 24px abaixo da lâmina, uma sombra difusa (sombra quente 14%, raio
24px). Abaixo da lâmina, o reflexo dos livros a 10%, cortado em 40px. Abajures saindo da página a 70px
acima dos livros, cone 44°. **Números:** espessura 6px; sombra 24px a 14%; reflexo 40px a 10%.

**Comportamento.** Lombadas: a lâmina encolhe para a largura delas. Gaveta: o livro desce atravessando a
lâmina (ela fica por cima dele por 0,2s, com o reflexo sumindo). Topo: a mesma lâmina a 60%. Filtro: a
lâmina curta. Abertura: o fio que se risca é a aresta da lâmina.

### V3. Chão de luz

**Ideia:** nenhum objeto; o que segura os livros é a luz dos abajures pousando no papel.

**O que se vê.** A fileira do 17 (só livros e sombras quentes), com os abajures a 84px acima, cones de
44° que descem até a linha dos pés dos livros e terminam numa poça de luz elíptica no papel (1,4× a
largura do livro, 12px de alto, 14% no claro e 32% no escuro). As nove poças, encostadas, formam uma
faixa de chão iluminado; um fio de sombra quente de 1px passa pela base da fileira inteira e some nas
pontas (gradiente de 120px). Nada embaixo dos nomes. **Números:** poça 12px a 14%/32%; fio 1px.

**Comportamento.** Lombadas: um abajur a cada dois, poças maiores (2 lombadas). Gaveta: a poça do lugar
vazio fica acesa. Topo e filtro: igual, a 60%. Abertura: o fio da base se risca e as poças acendem com
os abajures. Risco conhecido: no claro a poça a 14% é discreta; se ela sumir a olho nu, sobe para 18%.

### V4. Prateleira moderna refeita, em laca

**Ideia:** a estante do 18 "mais bonita e elegante", sem madeira: uma prateleira flutuante de laca
escura.

**O que se vê.** Uma lâmina de 10px (não 16), na cor da tinta a 90% no claro e da folha mais 30% de
preto no escuro, com a face de cima de 2px mais clara (reflexo da luz: folha a 25%) e a aresta da frente
chanfrada (1px de fio claro, 1px de sombra). Sem rótulos pintados nela (os "Vol." vão para cima dos
livros). Sombra projetada na página 20px abaixo (sombra quente 18%, raio 28px), mais escura perto da
lâmina. Reflexo dos livros na face de cima a 8%, 14px. Abajures de parede a 70px acima dos livros, cone
44°. **Números:** espessura 10px; sombra 28px a 18%; reflexo 14px a 8%.

**Comportamento.** Como o 18: lombadas com a lâmina encolhendo; gaveta deixando o vão com a luz acesa;
topo a 60%; filtro curto; abertura com o fio que vira lâmina.

### V5. Nicho com lâmina

**Ideia:** o nicho (V1) com a lâmina de laca (V4) como chão, para quem quer o buraco e a prateleira.

**O que se vê.** A caixa recuada de V1 (parede, teto, sombras, abajures no teto), mas o chão é a lâmina
de V4 saindo 6px para fora do friso, como uma prateleira embutida; o friso de V1 some (a lâmina é a
frente). Os livros ficam 4px mais para a frente que em V1. **Números:** os de V1 mais a lâmina de 10px
e a saliência de 6px.

**Comportamento.** Como V1; na gaveta o livro desliza pela lâmina.

### V6. Trilho de luz

**Ideia:** o palco do 20 reduzido ao essencial: só o trilho de latão e as luzes; o chão é a luz (V3).

**O que se vê.** Um trilho de latão de 3px na largura da fileira, a 84px acima dos livros, com os
abajures do 18 pendurados nele (a cúpula para baixo, o braço virado para o trilho), cones de 44° até o
papel e as poças de V3. Sem parede, sem chão, sem friso; os nomes embaixo como no 17. **Números:**
trilho 3px; poças de V3.

**Comportamento.** Lombadas: o trilho encolhe junto. Gaveta e topo: como V3. Abertura: o trilho se risca
no lugar do fio do chão, e os abajures acendem nele.

### V7. Degrau

**Ideia:** o contrário do nicho: a página sobe um degrau e os livros ficam em cima dele.

**O que se vê.** Um pedestal da própria página, na largura do conteúdo, 16px de alto, com a face da
frente mais escura (papel com 8% de tinta no claro; folha com 20% de preto no escuro) e a face de cima
um nada mais clara que a página (folha a 40%), com o fio de luz na aresta. A sombra quente dos livros
cai na face de cima; o pedestal projeta 6px de sombra na página. Abajures de parede a 70px acima, cone
44°. **Números:** altura 16px; faces de 8% e 40%; sombra 6px.

**Comportamento.** Lombadas: o degrau encolhe para elas. Gaveta: o livro desce do degrau para a gaveta.
Topo: degrau de 10px a 60%. Abertura: a aresta se risca e o degrau "sobe" (cresce de 0 a 16px em 0,4s)
antes dos livros.

---

## 3. As outras amostras e as sugestões

Cada amostra é uma página em `/amostras/<nome>/` do 21-final, com as formas lado a lado ou em
sequência, com componentes de verdade (hover, clique e tema funcionando), um rótulo "A", "B", "C" em
cada forma, e a marca "no protótipo" na que foi para o protótipo. Onde há "antes", ele é o 18 como
está.

| Amostra | Compara | No protótipo | Por quê |
|---|---|---|---|
| D1 `/amostras/livros-home/` | V1 a V7 da seção 2 | V1 Nicho | Seção 2. |
| D2 `/amostras/escuro/` | A marrom (19: `#1C1814` / `#25201B` / `#EEE6D8`); B preto (20: `#0E1114` / `#171B1F` / `#ECE7DE`); C azul-tinta de noite (`#10151F` / `#171D29` / `#E7E9E4`, o azul da cortina apagado a 90%). Cada uma mostra o cabeçalho da home, a fileira no nicho com os abajures acesos, dois cards e a ficha do rodapé; um botão troca a paleta sem recarregar | A marrom | Ele a elogiou ("o marrom") e os abajures de latão e a luz quente combinam com ela sem brigar (`19-home-escuro.png`); preto e azul são hipóteses dele ("deve ficar legal"). |
| D3 `/amostras/tags/` | A fichário vertical de aço ao lado da nuvem (protótipo); B o mesmo fichário em madeira, como no 19 (`19-tags.png`); C a cortiça do 16 com as fichas presas por alfinetes (`16-tags.png`). Embaixo, duas chegadas com um botão "ver de novo": D as fichas jogadas do alto (o atual) e E as fichas caindo (19) | A, com a chegada D na página e a queda E na rolagem e nas gavetas | P19-2 é o pedido mais detalhado dele ("na vertical no lado do card"); o aço tira a madeira sem tirar as gavetas; D e E juntas atendem "principalmente tag" e "gostei muito dos cards caindo" (seção 1, A3). |
| D4 `/amostras/paginacao/` | A um papel com tudo (protótipo); B um papel por botão (quadradinhos de 36px colados cada um com a sua fita, "Mais artigos" num papel mais largo); e, ao lado, "Artigos recentes" e Lista/Cards: antes (o 18, título solto e pílula) e depois (etiqueta e tira de papel coladas) | A | É o que existe e já convenceu (`16-paginacao-zoom.png`); B é a alternativa que ele mesmo descreveu. |
| D5 `/amostras/rodape/` | A tampo de feltro verde (protótipo); B nicho afundado; C tampo de tinta; D balcão de pedra. Cada uma com a ficha, o nome gigante atrás e a cordinha, nos dois temas | A | Abaixo. |
| D6 `/amostras/post/` | A como hoje (a folha lisa do 16, `16-post-fim.png`); B ficha de catálogo (protótipo); C papel colado com fita. O par anterior e próximo e a ficha "Do livro" de cada forma | B | Os cards do site já são fichas (área 10 da rodada 3); o par do fim do post ser ficha também fecha o conjunto. |
| S `/amostras/sugestoes/` | As três sugestões abaixo, cada uma com antes e depois | nenhuma (ele decide) | Pedido dele: "fez de um jeito mas tem outro que ficaria legal". |

### R1. O rodapé sem madeira (D5)

O que ele gostou (`16-recentes-zoom-rodape.png`, `19-rodape.png`): uma faixa escura e forte na largura
toda, a ficha deitada em cima, o nome gigante na página atrás, cortado pela borda de cima da faixa, e a
cordinha pendurada. O que o incomoda nas outras (`18-rodape.png`): a ficha flutuando sobre o nome, sem
chão. As quatro superfícies, todas de 220px de altura a 1440, na largura toda, com a ficha a 48px da
borda de cima, girada −1°, e a cordinha presa à borda de cima à direita:

- **A. Tampo de feltro verde (a escolhida).** Um feltro na cor da capa do caderno "cs" da marca (o
  verde do token da marca, escurecido 20% no claro e 35% no escuro), com textura de fibra fina (ruído de
  2px, sem imagem), uma bainha de 1px mais clara a 6px da borda e a borda de cima com 2px de sombra
  quente. É o tampo de mesa de leitura de biblioteca: verde, latão (cordinha e abajures) e papel. Por
  quê: dá a faixa escura e o corte do nome que ele gostou, não é madeira, e usa um verde que o site já
  tem (a marca), sem cor nova.
- **B. Nicho afundado.** O mesmo rebaixo de V1: a página desce um degrau (parede com 9% de tinta, sombra
  do teto de 48px), a ficha dentro dele e o nome em cima, cortado pelo friso. Coerente com a home, mas
  a faixa é suave e pode voltar a parecer "incompleto".
- **C. Tampo de tinta.** A faixa na cor da cortina (`#1B2A5E` no claro; no escuro `#0F1830`), lisa, com
  a ficha branca em cima. Forte e ligada à cortina que ele adora; no escuro marrom, o azul briga um
  pouco.
- **D. Balcão de pedra.** Um tampo de pedra cinza-quente (tinta a 14% no claro; folha a 60% no escuro)
  com 12px de espessura à vista na aresta de cima, veio discreto por gradiente, a ficha em cima. Moderno,
  frio; o latão sobre pedra fica elegante, mas afasta do caderno.

### Sugestões (S)

1. **Carimbo "Novo" no card Mais recente.** O carimbo da ficha de empréstimo (19: `src/scripts/carimbo.ts`,
   `19-rodape.png`: "Biblioteca C.S. · 1 out 2026") batido no canto de cima à direita do destaque da
   home, com "Novo · 29 set", em azul de almofada, girado −8°, caindo de escala 1,25 a 1 em 0,18s
   quando o card entra. Só no post mais recente, só na home.
2. **A penumbra do nicho no escuro.** No tema escuro, um clarão âmbar fraco (luz quente a 6%, raio de
   360px) em volta do nicho, parado, como se os abajures iluminassem a parede em volta; o resto da home
   continua na meia-luz. Antes: `20-livros-escuro.png` (as luzes só dentro do palco). No claro, nada.
3. **A placa de latão no friso do nicho.** "8 livros e uma série · Ver os livros", que hoje é um texto
   solto à direita do título (`18-livros-claro.png`), vira uma plaquinha de latão gravada (26px de alto,
   texto em mono na tinta escura do latão) presa no friso do nicho, à direita; "Ver os livros" continua
   link. Fecha a família latão: abajur, cordinha, placa.

---

## 4. Critérios de aceite da versão final

Verificáveis por captura ou comportamento, nos dois temas, a 390 e a 1440, com e sem movimento
reduzido. O conferente registra sim ou não.

Protótipo (21-final, porta 4421):

1. A paleta clara é a do 20 e a escura é a marrom do 19; nenhum token de madeira (`--madeira*`) é usado
   em página nenhuma; nenhuma superfície de madeira aparece.
2. Home: os livros estão dentro do nicho (parede mais escura, sombra do teto, friso da frente), com um
   abajur de latão por livro no teto, cone de 44° chegando ao chão e poça de luz; o cone sobe no hover
   do livro; a 390 e a 768 a fileira está em lombadas dentro do nicho estreito, com um abajur a cada dois
   livros abaixo de 700px.
3. Entrada da home, chegando de fora: fio, nicho abrindo, livros um a um com as legendas, fileira
   descendo, **o nome entrando da direita para a esquerda** depois dos livros, abajures acendendo um a
   um, **a onda sozinha e só depois o brilho sozinho** (em nenhum quadro os dois juntos), tudo em até
   5,0s; números rodando durante a entrada do nome. Com movimento reduzido: página inteira e parada,
   luzes acesas.
4. Gaveta na home: o livro sai do nicho para a gaveta; o lugar fica tracejado com o abajur aceso; Esc
   guarda; console limpo.
5. "A coleção" e "Artigos recentes" têm o traço de caneta que se escreve uma vez ao entrar na tela.
6. "Artigos recentes" é uma etiqueta de papel com fita; Lista/Cards é uma tira de papel com fita; a
   paginação é um papel com fita nos dois cantos; nenhum alfinete e nenhuma cortiça no site.
7. Navegação interna: a cortina de hoje e, depois dela, em Tags as fichas acima da dobra chegam jogadas
   do alto à direita e assentam até 1,4s do clique; em Livros o desfile (pilha à direita com o nome
   grande à esquerda, depois a grade) assenta até 3,5s do clique; nas listas e demais páginas as folhas
   pousam até 1,7s do clique. Chegar de fora: sem cortina, com a abertura (a da home ou o caderno).
8. Tags a 1440: a nuvem à esquerda e o fichário em pé à direita, 3 × 9, aço com latão, mesma altura da
   nuvem; clicar numa letra puxa a gaveta e as fichas da letra caem; "Todas" em cascata com as letras
   dividindo a linha; a 390 o fichário fica embaixo, horizontal. As fichas abaixo da dobra caem ao rolar.
9. Livros: abajur em cada card, cone forte no hover, card pintado; cards centrados com menos de 4.
10. Todos os artigos: a estante de filtro com um abajur por lombada sobre um nicho raso; tirar um livro
    deixa a luz dele acesa (nos dois temas, visível em captura).
11. Página do livro: a fileira de cima no nicho raso, encolhendo ao rolar com os abajures; o lugar do
    livro aberto tracejado e aceso; as tags em volta do livro; com 1 ou 2 artigos, "Deste livro também"
    com as tags como papel do 19.
12. Post: 948px de coluna a 1440; "Neste artigo" e "Do livro" fixos; o anterior e próximo como fichas
    com a tira "Vol. · ficha · nº" e a ilustração; texto, caneta, lousas e figuras idênticos ao blog.
13. Rodapé em toda página: o feltro verde na largura toda, a ficha de empréstimo em cima (−1°), o nome
    gigante atrás com 58% das maiúsculas à vista acima do feltro, respirando; a cordinha à direita com
    "Puxe para subir" no hover, o balanço e o puxão que sobe a página; **nenhuma bolinha com seta e
    nenhuma fita de subir na ficha**; a 390 a cordinha curta na borda direita.
14. O menu gira no hover; os cards e as listas abaixo da dobra aparecem ao rolar; o computador como na
    rodada 3 (ícone que afunda, entrar e sair).
15. Sem rolagem lateral a 320, 390 e 1440; console limpo em todas as páginas e na gaveta; `astro check`
    com 0 erros; com movimento reduzido nada se mexe sozinho.

Amostras (cada uma é uma página que abre, funciona nos dois temas e a 390, e tem os rótulos A, B, C e a
marca "no protótipo"):

16. `/amostras/livros-home/`: as sete variantes em sequência, cada uma com a fileira real (hover, abajur
    acendendo), o "topo encolhido" e o "filtro" embaixo, e a 390 em lombadas; V1 marcada.
17. `/amostras/escuro/`: marrom, preto e azul trocáveis sem recarregar, com cabeçalho, nicho, cards e
    ficha; marrom marcada.
18. `/amostras/tags/`: fichário de aço, fichário de madeira e cortiça lado a lado, funcionando (gaveta
    puxa, fichas caem); as duas chegadas com "ver de novo".
19. `/amostras/paginacao/`: um papel e um papel por botão, mais antes e depois de "Artigos recentes" e
    Lista/Cards.
20. `/amostras/rodape/`: feltro, nicho, tinta e pedra, cada um com ficha, nome e cordinha nos dois temas.
21. `/amostras/post/`: como hoje, ficha e papel colado, para o anterior e próximo e para "Do livro".
22. `/amostras/sugestoes/`: carimbo "Novo", penumbra do nicho (só no escuro) e placa de latão, com
    antes e depois.

---

## 5. O que não verifiquei

- A luz acesa sobre o livro tirado no filtro de Todos os artigos **no tema claro** (vi com clareza só
  no escuro, `18-artigos-filtro-escuro-depois.png`; no claro, `18-artigos-filtro-depois.png`, o
  abajur está lá e não distingui se aceso).
- O balanço da cordinha do 19 no hover (vi o rótulo "Puxe para subir", `19-rodape-hover.png`; o
  pêndulo não isolei) e o puxão no clique.
- "Todas" do fichário do 19 em cascata (vi só a gaveta G: `folha-19-gavetas.png`).
- A sobreposição exata da onda e do brilho no 18: vi quadros a cada 300ms (`folha-18-abertura-fim.png`);
  a direção é sequencial, o construtor mede.
- Onde exatamente vive, na `troca.js` do 11, a chegada das fichas de Tags jogadas do alto (vi o
  comportamento, `folha-11-tags.png`; não achei o trecho por busca de texto).
- O "Deste livro também" da base (18) por inteiro (`18-livro-dados-deste.png` corta antes); vi o do 19.
- As luzes sobre as lombadas do 18 a 768 (`18-home-768-colecao.png`: não distingui os abajures).
- O 16 e o 17 no escuro, o post das linhas nesta rodada, e qualquer desempenho (CPU 4×) das peças novas.
- Se o verde da marca, escurecido, passa no `npm run contraste` como fundo da ficha: a ficha é branca
  sobre o feltro, então o texto dela não depende dele; conferir só a cordinha e "Puxe para subir".
