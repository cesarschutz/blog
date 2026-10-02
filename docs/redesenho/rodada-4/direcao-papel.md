# Rodada 4, item 5: tudo que ainda é card vira papel

Direção de arte (Fable, 02/10/2026) para o pedido 5 do `retorno-cesar-3.md`: "não faz sentido ser
painel se tudo é papel". Vale para a `21-final` (`redesenho/novos/21-final/`, porta 4421). As capturas
desta sessão estão em `.astro/depuracao/redesenho/r4/papel/` (nome, tema e largura no arquivo).

## 1. A regra geral

O site tem hoje dois mundos convivendo: o que ele aprovou é papel (as fichas de catálogo dos artigos, o
papel colado com fita de "Artigos recentes", de Lista/Cards e da paginação, o post-it "Neste artigo", a
ficha "Do livro", a ficha de empréstimo do rodapé, a cartolina atrás da ilustração, as fichas pautadas
de Tags, a ficha de consulta da busca). O resto ainda é o card da base: a `.folha` de `base.css` (raio
14px, borda `--rule`, sombra difusa de 30px) e o `.painel` (raio 10px). O que denuncia o card é a
soma de três coisas: canto redondo grande, borda cinza em volta e sombra difusa que flutua. Papel é o
contrário: canto quase reto, sem borda desenhada (a borda é a própria sombra curta da espessura do
papel) e deitado sobre a mesa.

### A família: três papéis, e só três

| Papel | O que é | Onde se usa |
|---|---|---|
| **Folha** | A folha grande de leitura, deitada na mesa. Lisa, sem pauta, sem fita, reta. | Topo do post, texto do post, topo de Todos os artigos e da tag, nuvem de Tags, 404, o "vazio" de um livro sem artigos, a folha do sumário no celular |
| **Ficha de catálogo** | A ficha dos artigos, que ele já aprovou: a tira em mono (`Vol. 03 · ficha 2 · nº 024`) sobre o fio de 2px na cor do livro, o papel por baixo. Pode levar uma fita no alto quando é "a ficha de uma coisa só" (como a "Do livro"). | Cards de artigo (já é), anterior e próximo (já é), **painel do livro**, **topo da série**, **cards de Livros**, **card de Séries**, **as seis edições da série Java** |
| **Papel colado** | O papel pequeno preso à página com fita (o `.papel-colado` + `.fita-adesiva` de `base.css`), girado um nada. | Etiqueta de recentes, Lista/Cards, paginação, "Do livro" (já são), **"Comece por aqui"** da série Java, **as pílulas de tag** (sem fita, ver a tabela) |

### Os números da família (iguais em todas as superfícies novas)

- **Canto:** 2px nas folhas e nos papéis colados; 6px nas fichas de catálogo (o `--raio-ficha` do
  `Cartao.astro`, que ele já aprovou). Nunca 10px ou 14px.
- **Borda:** nenhuma linha `--rule` em volta. No escuro, só o anel de 1px com a tinta a 7% que o
  `.papel-colado` já tem, porque sem ele o papel escuro some no fundo marrom.
- **Sombra:** a do `.papel-colado`: `0 1px 1px` (sombra quente a 16%) + `0 2px 4px -1px` (a 22%).
  No escuro, a versão escura do mesmo (50% e 60%). As folhas grandes usam a mesma sombra: papel sobre
  papel não flutua. Some a `--sombra-folha` de 30px dessas superfícies.
- **Textura:** o grão do site (`--grao`, o SVG que o `TopoArtigo` e o `Rodape` já usam), em ladrilho de
  180px, por cima do `--paper-hi`. É o único grão permitido; nenhuma textura em imagem.
- **Pauta:** só onde já existe (ficha de empréstimo, fichas de Tags, busca, "Do livro"). Nenhuma
  superfície nova ganha pauta: pauta sob texto corrido ou sob um desenho vira ruído.
- **Fita:** a `.fita-adesiva` (64×20px) ou a `.fita` da ficha colada (78×22px, pontas picotadas), as
  duas já existentes. Entra só onde a tabela diz. Uma fita por papel pequeno, duas (cantos) só na
  paginação e no "Do livro", como hoje.
- **Giro:** só nos papéis colados pequenos, entre −0,6° e −1°, como os que existem. Folhas grandes e
  fichas em grade: 0°. Um bloco de leitura torto cansa, e uma grade de fichas tortas vira álbum.
- **Tema escuro:** o papel é o `--paper-hi` escuro; a fita, a variante escura já definida em
  `ficha-do-livro.css` (véu a 21%); o fio da cor do livro não muda com o tema (D39); o grão fica.

### O que nunca fazer

Madeira, cortiça, alfinete, textura em imagem, cor fora dos tokens (`color-mix` de token vale), canto
redondo de card (≥ 8px, fora o 6px da ficha), sombra difusa de card, pauta sob texto de leitura, fita em
folha grande, giro em grade, filtro animado. Nenhuma superfície pode mudar a largura do texto do post
(948px a 1440) nem a altura das linhas.

## 2. A tabela por superfície

A coluna "hoje" aponta a captura; "arquivo" é onde a peça mora na `21-final/src/`.

| # | Superfície | Hoje (captura) | Vira | O que se vê | Arquivo |
|---|---|---|---|---|---|
| S1 | **Painel da página do livro** (e o da série) | `livro-dados-claro-1440.png`, `livro-dados-topo-escuro-1440.png`, `serie-java-topo-claro-1440.png`: card de 14px, borda, sombra difusa; os livros em cima no nicho | **Ficha de catálogo do livro, colada com fita** | A folha fica onde está, canto 6px, sem borda, sombra curta. No alto, a tira em mono do catálogo, `Volume 03 · 2 fichas · o último em 2026` (na série, `Série 01 · 7 edições`), nº à direita (`nº 03`), sobre o fio de 2px na cor do livro, de ponta a ponta; o "Livros / Volume 03" de hoje sai, porque a tira já diz isso. Uma fita centrada no alto, a mesma da "Do livro" (78×22, −2,4°), cruzando a borda de cima. Grão. Giro 0 (o livro 3D e as etiquetas de tag são posicionados em cima dela). A 390, igual, com a fita menor (64×20). Escuro: fio igual, fita a 21%. É a "Do livro" em tamanho grande: ele a aprovou e pediu "ficha, talvez com fita" aqui. | `components/TopoLivro.astro` (`.topo-livro.folha`) |
| S2 | **Topo do post** (ilustração, título, autor) | `post-topo-claro-1440.png`, `post-topo-escuro-1440.png`, `post-topo-claro-390.png`: card de 14px com a cartolina dentro | **Folha de rosto com a tira da ficha** | Folha lisa, canto 2px, sem borda, sombra curta, grão. No alto, antes da cartolina, a mesma tira mono do card desse artigo (`Vol. 01 · ficha 2 · nº 018`) sobre o fio de 2px na cor do livro: a página do artigo é a ficha dele aberta. A cartolina, o título e a largura do texto não mudam. Sem fita, sem pauta, sem giro. | `components/TopoArtigo.astro` (`.topo-folha`) |
| S3 | **Texto do post** | `post-meio-claro-1440.png`, `post-meio-escuro-1440.png`: card branco de 14px | **Folha** (a página do livro) | Canto 2px, sem borda, sombra curta, grão; nada mais. É a superfície de leitura: nenhuma pauta, nenhuma margem vermelha, nenhuma fita. A largura do texto (948px a 1440) e o espaçamento não mudam um pixel. | `pages/posts/[slug].astro` (`.artigo-folha`), `styles/artigo.css` |
| S4 | **Sumário no celular** ("Neste artigo" dobrado, 390) | `post-topo-claro-390.png`: barra branca em card | **Post-it** | A mesma cor e o mesmo papel do post-it do desktop (`--post-it`), canto 2px (o `clip-path` passa de `round 14px` para `round 2px`), sombra curta. A folha que abre mantém o comportamento. | `components/Sumario.astro` (`.folha-celular`) |
| S5 | **Topo de Todos os artigos** | `archive-topo-claro-1440.png`, `archive-topo-escuro-1440.png`: card de 14px com título, filtros e os livros | **Folha** | Canto 2px, sem borda, sombra curta, grão. Os livros continuam em pé sobre ela, o nicho igual. Sem fita, sem tira. A 390, igual. | `components/ListaFiltrada.astro` (`.topo-filtrado.folha`) |
| S6 | **Topo da tag** | `tag-spring-topo-claro-1440.png`, `tag-spring-topo-escuro-1440.png` | **Folha**, igual à S5 | Mesma peça da S5 (é o mesmo componente); a marca d'água do ícone fica. | `components/ListaFiltrada.astro` |
| S7 | **Pílulas de tag** ("Por assunto", "Aparece junto com", em volta do livro, no pé do post) | `archive-topo-claro-1440.png` (filtros), `livro-dados-claro-1440.png` (em volta do livro), `post-fim-claro-1440.png` (pé do post): pílulas de 999px com borda | **Etiqueta de papel** (papel colado pequeno, sem fita) | Canto 2px, sem borda, fundo `--paper-hi`, sombra `0 1px 1px` (16%), mesmo tamanho e mesma tipografia (34px de altura, 14px). Giro 0 (há muitas juntas). Hover como hoje: a tinta azul toma a etiqueta. Escuro: o anel de 1px a 7%. As que estão em volta do livro 3D continuam ancoradas onde estão. Pílulas que não são tag (Compartilhar: "Copiar link", "LinkedIn", "WhatsApp", "Mais opções"; o "Buscar" do 404; o "Fechar" da busca) viram a mesma etiqueta, para não sobrar pílula no site. | `components/PilulaTag.astro`, `styles/base.css` (`.pilula`), `components/CartaoCompartilhamento.astro` |
| S8 | **Nuvem de Tags** | `tags-topo-claro-1440.png`, `tags-topo-escuro-1440.png`: card de 14px ao lado do fichário de aço | **Folha** | Canto 2px, sem borda, sombra curta, grão. As palavras não mudam (tamanho pelo uso, ícones, contagens). Sem pauta: as palavras têm tamanhos diferentes e a pauta brigaria com elas. Ao lado do aço do fichário, a folha deitada lê como a ficha que saiu da gaveta. A 390, igual, com o fichário embaixo. | `components/NuvemTags.astro` (`.nuvem-tags.folha`) |
| S9 | **Cards de Livros** | `livros-topo-claro-1440.png`, `livros-topo-escuro-1440.png`: card de 14px, palco tingido dentro, "Volume 01" solto em cima do nome | **Ficha de catálogo** (como as dos artigos) | Canto 6px, sem borda, sombra curta. A tira em mono no alto, `Volume 01 · 6 artigos` à esquerda e `o último em 2026` à direita (`Ainda sem artigos` quando vazio), sobre o fio de 2px na cor do livro; o "Volume 01" e a linha "6 artigos · o último em 2026" de hoje saem, porque a tira já os diz. O palco com o livro e o abajur fica, mas com o canto do palco em 4px, não 10px. Hover: a pintura da cor do livro subindo, como hoje. Giro 0 (grade de 4). | `components/GradeLivros.astro` (`.cartao-livro.folha`, `.palco.painel`) |
| S10 | **Card de Séries** (a série única, deitada) | `series-topo-claro-1440.png`: card de 14px com o palco e a lista de edições | **Ficha de catálogo** | Canto 6px, sem borda, sombra curta. A tira no alto, `Série 01 · 7 edições` e `nº S01`, sobre o fio laranja da série; o "Série · 7 edições" de hoje sai. Palco com canto 4px. A lista numerada das edições fica como está. | `pages/series/index.astro` (`.destaque-serie.folha`) |
| S11 | **"Comece por aqui"** (série Java) | `serie-java-topo-claro-1440.png`: caixa laranja-pálida com borda e canto 10px | **Papel colado** | Papel `--paper-hi`, canto 2px, sombra curta, girado −0,5°, uma `.fita-adesiva` no canto de cima à esquerda (como a etiqueta de recentes). O "Comece por aqui" em laranja da série fica como rótulo; o fundo tingido sai (a cor fica no rótulo e no fio: um fio de 2px laranja na borda de cima, por baixo da fita). É um bilhete preso na página dizendo por onde começar. | `pages/series/java.astro` (`.guia.folha`) |
| S12 | **As seis edições da série Java** (29, 25, 21…) | `serie-java-claro-1440.png`: cards de 14px, o "29" tracejado | **Ficha de catálogo** | Canto 6px, sem borda, sombra curta. A tira no alto, `Coleção Java · ed. 7` e `nº 025`, exatamente como a ficha desse post na home e em Todos os artigos (`home-claro-1440.png`, primeira da segunda fileira), sobre o fio laranja. O número grande, o selo "LTS" e o rodapé ficam. A próxima LTS (29) troca o contorno tracejado da caixa por um fio tracejado só na tira (2px, traço 4/3). | `pages/series/java.astro` (`.versao.folha`) |
| S13 | **404** | `404-claro-1440.png`, `404-topo-escuro-1440.png`: card de 14px com a estante | **Folha** | Canto 2px, sem borda, sombra curta, grão. O "Buscar" vira etiqueta (S7). | `pages/404.astro` (`.folha.caixa`) |
| S14 | **"Vazio" de um livro sem artigos** (IA, Carreira) | não fotografado | **Folha** | Mesma regra da S3. | `pages/categories/[categoria].astro` (`.folha.vazio`) |
| S15 | **O `.folha` e o `.painel` da base** | `styles/base.css` 213–231 | **Trocam de valores** | `--raio-folha` passa a 2px, a `border` sai, `--sombra-folha` passa à sombra curta do `.papel-colado`; `--raio-painel` passa a 4px. Qualquer `.folha` esquecida já nasce papel. O `--sombra-folha-alta` fica só para o que levanta de verdade (a busca aberta, a gaveta). | `styles/base.css` |

### O que fica como está, por já ser papel

Fichas de catálogo dos artigos (`Cartao.astro`, inclusive o destaque com o carimbo "Novo"), anterior e
próximo com a fita (`Vizinhos.astro`), "Do livro" (`LivroDoArtigo.astro`, `Sumario.astro`), post-it
"Neste artigo" no desktop, etiqueta de recentes e Lista/Cards (`Recentes.astro`, `SeletorModo.astro`),
paginação (`Paginacao.astro`), ficha de empréstimo (`Rodape.astro`), as fichas pautadas de Tags
(`FichasTags.astro`), "Deste livro também" (`categories/[categoria].astro`, aprovado em P19-3), a
cartolina do topo do post e a ficha de consulta da busca (`Busca.astro`: pauta azul e linha vermelha,
`busca-claro-1440.png`). Na busca, só conferir que o canto da caixa é 6px, não 14 (há um `6px` e um
`4px` no arquivo; não medi o quadro externo).

### O que não entra nesta rodada

Os quadros de dentro do artigo (`Figura`, `Lousa`, `Aviso`, o Expressive Code) seguem o `DESIGN.md` do
blog e são iguais ao site no ar: mexer neles é decisão do blog, não do redesenho. O computador, o Finder
e a gaveta não são card nem papel.

## 3. Critérios de aceite

1. Nenhuma superfície do site, fora os quadros de dentro do artigo, tem canto ≥ 8px, borda `--rule` em
   volta nem a sombra de 30px: a conferência percorre home, `/archive/`, `/categories/`,
   `/categories/Dados/`, `/categories/IA/`, `/tags/`, `/tags/Spring/`, `/series/`, `/series/java/`,
   um post e o 404, nos dois temas, a 390 e 1440, e lê o `border-radius`, a `border` e o
   `box-shadow` calculados de cada `.folha`, `.painel`, `.pilula` e `.cartao`.
2. A tira de catálogo aparece no painel do livro, no topo da série, no topo do post, nos cards de
   Livros, no card de Séries e nas seis edições Java, com a mesma fonte e o mesmo tamanho da tira dos
   cards de artigo (mono 11,5px, `9px 14px 8px`, fio de 2px na cor do livro ou da série).
3. Fita só onde a tabela manda (S1 e S11, além das que já existem). Nenhuma fita em S2, S3, S5, S6,
   S8, S9, S10, S12, S13.
4. O texto do post mede 948px de largura a 1440 antes e depois; a altura da página do post não varia
   mais de 8px (só a tira nova no topo).
5. No escuro, cada papel novo tem o anel de 1px a 7% e a sombra escura do `.papel-colado`; a fita é a
   variante escura; o fio da cor do livro é o mesmo do claro.
6. Nenhuma pílula de 999px sobra no site (busca de `border-radius: 999px` fora o disco azul de
   Lista/Cards e da paginação, que são discos de tinta, não papel).
7. Movimento: nada novo anima; os hovers que existiam (pintura do livro, tinta azul da etiqueta,
   levantar 2px da ficha) continuam, com `prefers-reduced-motion` respeitado.
8. Sem console, sem rolagem lateral, `astro check` 0 erros.

## 4. O que não verifiquei

- Não fotografei `/categories/IA/` (o "vazio", S14) nem a página de um post no escuro a 390.
- Não medi o canto externo da caixa da busca nem o da gaveta; a tabela só pede que fiquem em 6px.
- Não disparei os hovers nesta sessão (a pintura dos cards de Livros, a tinta das pílulas): a direção
  manda mantê-los como estão, por isso não dependem de medida nova.
- Os textos das tiras novas (`2 fichas`, `nº S01`, `o último em 2026`) são proposta minha; o
  construtor deve usar os dados que o componente já tem e nunca inventar número.
- O grão (`--grao`) é um SVG em data URI gerado pelo projeto, não uma imagem fotográfica; tratei-o como
  permitido por já ser o grão do site. Se o Cesar considerar "textura em imagem", ele sai e o papel
  fica liso.
