# 05 · Revista

Direção do modelo 05 do redesenho (D55). Quem constrói segue este arquivo, o
`docs/redesenho/README.md` e a API da base (`docs/redesenho/base.md`).

## Ideia

O blog como uma **revista de luxo**: cada visita é uma edição, a home é a **capa**, cada artigo é uma
matéria com diagramação de revista impressa e cada livro é um caderno especial. A tipografia manda:
serifa Didone enorme, capitulares, olhos (citações grandes), legendas e fólios. O movimento é
**cinematográfico e editorial**: imagens que se revelam por cortina, títulos que sobem linha a linha
e a **página que vira** na troca de tela.

Serve a este blog porque ele já trata as séries como "revista técnica". Aqui o conceito é o site
inteiro, com cara de publicação e não de produto.

## Cara

**Cores (tokens do modelo).**

| Token | Claro (principal, papel couché) | Escuro ("edição noturna") | Uso |
|---|---|---|---|
| papel | `#FBF9F4` | `#141312` | fundo |
| papel-2 | `#F1EDE4` | `#1C1B19` | faixas, boxes |
| tinta | `#141312` | `#F3EFE7` | texto, títulos |
| tinta-2 | `#6A655D` | `#A7A198` | legendas, chapéus |
| filete | tinta a 16% | tinta a 18% | filetes |
| cor-da-edicao | a cor do livro do artigo em destaque na capa | a mesma | chapéus, capitulares e o número da edição |

Não há acento fixo: **cada página pega a cor do livro dela** (o artigo, o livro, a capa). A home usa
a do artigo de capa. Assim a revista muda de cor a cada edição. As capitulares, os chapéus e o fólio
usam essa cor.

**Tipografia.**

- **Boska** (Fontshare, variável 200 a 900; Didone de alto contraste) nos títulos. Os grandes vão em
  200 a 300; os subtítulos, em itálico. É o grande gesto do modelo.
- **Gambetta** (Fontshare, variável 300 a 700, com itálico) no texto do artigo, em 1,1875rem
  (19px) com 1,68 de entrelinha. Justificado **não**; alinhado à esquerda com hifenização
  (`hyphens: auto`, `lang="pt-BR"`).
- **Synonym** (Fontshare) nas legendas, nos chapéus, no fólio e na interface, pequena e com
  `letter-spacing` levemente aberto, em caixa normal.
- Código em JetBrains Mono (raiz).
- **Detalhes tipográficos:**
  - **capitular** de 3 linhas no primeiro parágrafo (Boska, na cor da edição, com `initial-letter`
    quando houver suporte e reserva por `float`);
  - aspas tipográficas;
  - numerais estilo antigo no texto;
  - `text-wrap: balance` nos títulos.

**Forma.** Filetes finos, colunas e margens generosas, sem cantos arredondados e sem sombras. As
imagens (ilustrações) **sangram**: vão até a borda da tela nos destaques.

**Ícones.** Poucos, de traço fino (1px), elegantes. A seta é longa, com uma ponta pequena. No hover, a
seta se estica (a haste cresce, `scaleX`) e a ponta anda junto.

**Marca "cs".** Um **logotipo de revista** ("Cesar Schutz" em Boska, largo, com o "cs" em itálico
entre filetes) e, embaixo, "Edição nº 28 · setembro de 2026" em Synonym, com o número de posts como
número da edição e o mês do último post. No hover, os filetes se afastam 2px.

## Páginas

**Cabeçalho.** Uma **faixa de expediente** fina com o logotipo pequeno à esquerda, as "Seções"
(Artigos, Categorias, Tags) no centro e, à direita, a busca e o tema. Na capa (home), o cabeçalho
fica escondido até a capa rolar para fora (a capa tem o logotipo grande).

**Home = a capa.**

- **Primeira dobra: a capa.** O logotipo grande no topo ("Cesar Schutz" em Boska, largura total), a
  data da edição e a **matéria de capa** (o artigo mais recente):
  - a ilustração dele grande, sangrando à direita;
  - o título em Boska enorme sobre ela;
  - **chamadas de capa** (3 a 4 artigos seguintes) em Boska itálico menor, espalhadas como numa capa
    de revista, cada uma com o livro dela em chapéu.
- **Ao rolar, "Nesta edição":** um **sumário** de revista, com os artigos em duas colunas, número de
  página (o número do artigo, "p. 28"), chapéu com o livro, título em Boska e linha fina. Os
  destaques vêm com a ilustração. É um **layout assimétrico**: um grande, dois médios, uma lista.
- **"A coleção":** os livros como "cadernos especiais", numa faixa de capas planas lado a lado (as
  capas inteiras, de frente, ~260px de altura), com o título do caderno embaixo.

**Artigo = a matéria.**

- **Abertura da matéria:** chapéu (o livro, na cor), o título em Boska enorme (200 a 300) quebrado
  com equilíbrio e o complemento como **linha fina** em Gambetta itálico. O crédito "Por Cesar
  Schutz · 12 min de leitura · 25 set 2026" em Synonym.
- **A ilustração sangrando** na largura toda, logo depois, com a legenda em Synonym.
- **O texto:**
  - numa coluna de ~64 caracteres, com a capitular;
  - os H2 em Boska itálico, com um filete curto na cor da edição acima;
  - os **olhos**: a frase em destaque e os avisos viram citações grandes em Boska itálico, com aspas
    enormes na cor da edição, saindo da coluna para a margem (≥1100px);
  - as notas laterais, na margem, em Synonym pequeno;
  - o código em box com fundo no papel-2 e fonte menor.
- **Fim da matéria:** um sinal de fim (■ na cor da edição), a "bio" curta do autor, as tags como
  "Assuntos" e **"Leia também"** com a próxima e a anterior, como chamadas de revista.
- **Fólio:** no canto de baixo da tela, "Cesar Schutz · Edição nº 28 · p. 27", com a página atual
  (a seção atual do artigo), atualizado com a rolagem.

**Categorias = os cadernos especiais.**

- "Cadernos" em Boska enorme e a frase de hoje.
- Uma grade assimétrica de capas: os livros 3D **grandes** (~360px em 1440), cada um com um
  **fundo de cor chapada do livro a 12%**, o nome em Boska, a descrição em Gambetta itálico e a
  contagem ("6 matérias").
- A revista Java entra como "a revista da casa", num bloco próprio.

**Página do livro = o caderno especial.**

- **Capa de caderno:** o livro 3D **enorme** à esquerda, sobre o fundo da cor dele (um bloco chapado
  que ocupa meia tela e sangra), e à direita "Caderno especial" em chapéu, o título em Boska enorme e
  a descrição.
- **"Neste caderno":** o sumário das matérias do livro, no formato da home.

**Tags = o índice remissivo.** Como o índice do fim de um livro: as tags em ordem alfabética, em duas
colunas, com os números das "páginas" (os artigos) ao lado, em Synonym (`Spring ··· 12, 14, 16, 17…`).
No hover, a linha pontilhada se enche.

**Tag.**

- "Spring" em Boska e "9 matérias em 5 cadernos".
- **O filtro por livro são abas de caderno:** abas com a mini capa (plana, ~56px) e o nome de cada
  livro, como os separadores coloridos de um fichário.
- A lista no formato do sumário.

## Os três momentos

**1. A abertura da home: a capa é impressa.** Até ~2,5 s; clique, tecla ou rodinha pulam.

| Tempo | O que acontece |
|---|---|
| 0 a 0,6 s | o papel; o logotipo "Cesar Schutz" **sobe por máscara** (as letras em Boska 200, com `translateY` de 100% para 0, 0,8 s, `cubic-bezier(.16,1,.3,1)`, 30 ms por letra) |
| 0,4 a 1,3 s | a ilustração da capa se revela por **cortina**: um `clip-path: inset()` que se abre da direita para a esquerda (0,9 s), com a imagem vindo de 108% para 100% de escala por dentro, como uma câmera que se afasta |
| 0,9 a 1,7 s | o título da matéria de capa sobe **linha a linha** (máscara por linha, 0,7 s, 90 ms entre as linhas) |
| 1,3 a 2,1 s | as chamadas de capa entram uma a uma (opacidade e 12px, 60 ms entre elas); a data da edição por último |
| 2,0 a 2,5 s | um filete na cor da edição se desenha embaixo do logotipo |

**2. A abertura das outras páginas: a matéria abre.**

- O chapéu aparece.
- O título sobe linha a linha.
- A ilustração se revela por cortina de cima para baixo.
- A linha fina e o crédito por último.
- ~1,4 s.

**3. A troca de página: a página vira.**

- A página antiga **vira pela lombada** (a borda esquerda): `rotateY` de 0 a -100° com `perspective:
  1800px`, e uma sombra de dobra que escurece a página enquanto ela gira (um gradiente numa camada, só
  opacidade). 0,75 s, `cubic-bezier(.65,0,.35,1)`.
- A nova aparece por baixo, já no lugar.
- Técnica: View Transitions. O `::view-transition-old(root)` com a animação de virar (origem na
  esquerda, `backface-visibility: hidden`) e o `::view-transition-new(root)` parado por baixo (com
  `animation: none` e `z-index` abaixo).
- Voltando pelo histórico, a página vira ao contrário: a nova entra girando de volta da esquerda.
- Na troca **dentro do artigo** (anterior e próximo), a virada é mais rápida (0,6 s).

## Categorias: o desfile e os livros grandes

**O desfile: os cadernos são espalhados na mesa e se alinham.** Toca sempre que Categorias aparece.

- As capas (os livros 3D) começam empilhadas no centro, levemente giradas (-8° a 8°, como revistas
  jogadas na mesa).
- Elas "deslizam" até o lugar na grade, cada uma assentando o giro (0,9 s, 70 ms entre elas,
  `cubic-bezier(.2,.8,.2,1)`), com os fundos de cor chapada se abrindo por cortina atrás delas.
- ~1,6 s.

**Hover num caderno:**

- o livro gira de 38° para 22° e sobe 6px;
- o fundo de cor chapada cresce de 12% para 20% de cor;
- o nome ganha o sublinhado fino da cor, desenhado da esquerda.

## Filtro da tag

- **As abas de caderno:** a aba escolhida "sobe" 6px e ganha a cor do livro na borda de cima; a
  anterior desce.
- A lista sai por cortina (as linhas se fecham por `clip-path` de baixo para cima, 0,25 s) e a nova
  entra linha a linha (máscara, 50 ms entre elas).
- O "9 matérias" conta até o valor novo.

## Troca de tema

"Edição noturna": **uma folha do papel novo vira sobre a página**, com a mesma virada da troca de
página, mas no sentido vertical, de cima para baixo (`rotateX`, origem no topo, 0,7 s). No hover, o
ícone (uma meia-lua fina) gira 15°.

## Catálogo de detalhes

Todos também com o foco do teclado. Curva padrão `cubic-bezier(.16,1,.3,1)` para as revelações e
`cubic-bezier(.65,0,.35,1)` para as viradas.

1. **Rótulo "Ler" que segue o cursor** sobre as imagens (as ilustrações da capa, do sumário e dos
   cadernos):
   - uma pílula na tinta com "Ler a matéria" aparece presa ao cursor, com leve atraso (lerp com
     parada), e cresce com uma pequena mola;
   - com o cursor nativo mantido;
   - some ao sair da imagem.
2. **Imagem em moldura:** no hover, a ilustração faz um zoom lento dentro da moldura (de 100% para
   104%, 1,2 s).
3. **Títulos do sumário:** no hover, um **marca-texto largo** na cor da edição a 20% se estende por
   trás do título, da esquerda para a direita (`background-size`, 0,45 s).
4. **Menu (Seções):** no hover, o item ganha um sublinhado fino que se desenha do centro para as
   pontas (`scaleX`), e o atual fica em itálico.
5. **Logotipo:** os filetes se afastam 2px no hover, e o "cs" inclina de itálico para reto e volta.
6. **Busca:**
   - ⌘K abre um **painel de índice**: a página escurece, e um painel de papel desce do topo;
   - os resultados vêm como um sumário, com o número da página e o chapéu;
   - o termo aparece com o marca-texto;
   - com as setas, uma seta longa à esquerda indica o resultado.
7. **Tema:** a folha que vira de cima para baixo.
8. **Links do texto:** sublinhado fino na cor da edição; no hover, ele se redesenha como um traço
   desenhado à mão (um SVG de traço levemente torto, desenhado por `stroke-dashoffset`, 0,35 s).
9. **Capitular:** ao chegar ao primeiro parágrafo, ela se "imprime" (revela por máscara de baixo
   para cima, uma vez).
10. **Olhos (citações grandes):** as aspas enormes entram girando levemente (de -8° a 0°) e a frase
    sobe linha a linha, ao entrar na tela, uma vez.
11. **H2:** no hover, o filete curto acima se estica até a largura do título, e o clique copia o link,
    com "Link copiado" em itálico ao lado.
12. **Fólio:** "p. 27" rola como o número de uma página quando a seção muda.
13. **Progresso:** um filete fino na cor da edição no topo, ligado à rolagem, só com CSS.
14. **Copiar código:** discreto, com "Copiar" em Synonym; no clique, "Copiado" em itálico, com um
    pequeno ■ na cor.
15. **Leia também** (anterior e próximo): chamadas com a ilustração; no hover, a imagem faz o zoom
    lento e a seta longa se estica.
16. **Voltar ao topo:** "Voltar à capa ↑" em Synonym, com a seta que sobe e volta.
17. **Índice remissivo:** a linha pontilhada se enche no hover.
18. **Cadernos:** o livro gira e o fundo cresce (veja acima).
19. **Abas de caderno:** a aba sobe (veja acima).
20. **Seleção de texto:** a cor da edição a 25%.
21. **Foco pelo teclado:** um filete de 2px na tinta embaixo do elemento, com 3px de afastamento, e um
    contorno fino nos botões.
22. **Rodapé = o expediente:** "Expediente" em Boska, com o editor, a edição, o mês e os contatos em
    Synonym, em colunas, como numa revista.

## Técnica

- **Revelações por cortina e máscara:** `clip-path` e `overflow: hidden` com `translateY`.
- **Viradas:** transformações 3D nas View Transitions; a sombra da dobra é uma camada com opacidade.
- **Rótulo que segue o cursor:** rAF só enquanto se move, com `transform`.
- **Títulos por linha:** divida as linhas no cliente, depois das fontes carregarem (`document.fonts.ready`),
  e recalcule no `resize`, com debounce; ou use `splitText` do GSAP, sob demanda.
- **Cor da edição:** uma variável na página, lida do livro do post.
- **Capitular:** `initial-letter: 3`, com `@supports`, e reserva por `float`.

## Referências usadas

`docs/redesenho/referencias.md`:

- a folha que vira do kinetics;
- a troca inclinada e deslizante do soralabs (inspiração da virada);
- o rótulo que segue o cursor do uiable e do soralabs;
- a revelação por máscara do soralabs;
- o sublinhado desenhado à mão do soralabs;
- as fontes Boska, Gambetta e Synonym, do Fontshare.

## O que não fazer (para não virar outro modelo)

- **Sem serifa:** nada de grotesca sem serifa como fonte principal (Grade).
- **Luz e textura:** nada de luz ou grão (Noturno).
- **Mola:** nada de formas coloridas nem de mola exagerada (Cinético).
- **Rolagem:** nada de rolagem horizontal (Galeria).
- **Texto do artigo:** o artigo é para ler. Os efeitos ficam na abertura, nos olhos e na capitular.

## Retorno do Cesar

(vazio)
