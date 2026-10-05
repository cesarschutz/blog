# Rodada D84: a home dos livros, a revisão geral e a faxina do código

Pedido do Cesar em 04/10/2026 (branch `claude/blog-review-home-improvements-ca8691`, a partir da `main`
em `16c0491`; dev na porta 4380). Ordem: a home primeiro (o foco), depois a revisão das telas, publicar,
a faxina do código e dos documentos, testar de novo, publicar de novo e a conferência final deste
controle. Sem parar para perguntar; o que for dele decidir vai para o fim.

Legenda: `[x]` feito e conferido, `[~]` em andamento, `[ ]` falta, `[-]` não se aplica (com o motivo).

## 0. Preparação

- [x] Branch a partir da `main` (`16c0491`), dev em <http://127.0.0.1:4380>
- [x] Fotos do antes (home e página de um livro, 1440 e 390px; o protótipo de 9 livros, porta 4421)
- [x] Este controle criado e mantido em dia

## 1. A home (o foco)

- [x] 1.1 Pesquisa: como mostrar muitos livros na tela larga e no celular (estantes, lojas, carrosséis,
      o protótipo de 9 livros), e por que a página de um livro fica melhor
- [x] 1.2 A forma escolhida, com o motivo, registrada como D84 (`docs/decisoes.md`, briefing, `DESIGN.md`,
      `docs/movimento.md`, `.claude/rules/interface.md`, `CLAUDE.md`)
- [x] 1.3 A coleção valorizada: livros grandes, como eram com 9 (e como na página de um livro)
- [x] 1.4 Tela pequena: resolvida sem o giro até a lombada que o Cesar não gostou
- [x] 1.5 Sai a linha entre o nome e os livros (a frase, os números Artigos/Livros/Tags e o último
      artigo): os livros sobem e os artigos vêm logo depois
- [x] 1.6 O nome gigante um pouco menor
- [x] 1.7 O "blog" cinza do cabeçalho na home como carimbo: inclinado, um pouco por cima do Z, sem tirar
      o nome do lugar (o cabeçalho fica como está)
- [x] 1.8 Rodapé no celular: "Cesar Schutz" numa linha só, cortado pela metade como na tela larga
- [x] 1.9 A abertura da home (a estante que se monta) e a viagem do livro até a página dele funcionam
      com a forma nova
- [x] 1.10 Doca (mouse), abajures, teclado e foco, leitor de tela, movimento reduzido e sem JS
- [x] 1.11 Conferida em 320, 390, 768, 1024, 1280, 1440, 1600 e 1920px, claro e escuro, sem rolagem
      lateral nem erro de console
- [x] 1.12 O que ficou sem uso com a mudança saiu (odômetro dos números, estilos da linha, o modo
      "home" do `Colecao.astro`); `TEXTOS.apresentacao` e o resto vão na faxina (item 4)

## 2. Revisão geral das telas (bugs, animação, desenho, detalhe)

- [x] 2.1 Varredura por agentes, página a página: home e `/2/`, livro (`/categories/<Nome>/`),
      `/categories/`, `/archive/` (e o filtro), `/tags/` e uma tag, `/series/` e `/series/java/`,
      `/capas/`, busca, 404, posts `.md` e `.mdx`, o computador, o cabeçalho, o menu e o rodapé
- [x] 2.2 Animações: abertura, cortina e troca de página, livros (doca, livro vivo, viagem), lousas,
      figuras em passos, capa viva, rodapé
- [x] 2.3 Desenhos: capas dos posts, figuras, lousas, livros, ícones das tags
- [x] 2.4 Detalhes: alinhamento, cortes, quebras, contraste, foco, textos
- [x] 2.5 Cada achado conferido por um segundo agente antes de corrigir (sem falso positivo)
- [x] 2.6 Correções feitas e reconferidas no navegador

## 3. Publicar (primeira vez)

- [ ] 3.1 `check`, `build`, `links`, `contraste`, `validar.mjs`, testes `frontend-*`, `conferir` em
      alguns posts
- [ ] 3.2 Registro: `docs/decisoes.md` (D84), `docs/estado.md`, `docs/briefing.md` e `DESIGN.md` no que
      mudou
- [ ] 3.3 Commits, `git fetch`, junção cuidadosa com a `origin/main` (outras sessões), push na `main`
- [ ] 3.4 Deploy conferido e o site no ar olhado

## 4. Faxina do código-fonte e dos documentos

- [ ] 4.1 Inventário: arquivos sem uso, CSS e funções mortas, scripts de uma vez só, cópias, documentos
      superados ou repetidos
- [ ] 4.2 Apagar, juntar e refatorar sem mudar o comportamento
- [ ] 4.3 Regras e documentos (`CLAUDE.md`, `.claude/`, `DESIGN.md`, `docs/`) enxutos e sem contradição,
      sem perder regra
- [ ] 4.4 Testes de novo: `check`, `build`, `links`, `frontend-*`, `conferir` e as fotos de antes e
      depois comparadas
- [ ] 4.5 Publicar de novo

## 5. Entrega final

- [ ] 5.1 Este controle revisto item a item
- [ ] 5.2 As perguntas que ficaram para o Cesar, curtas, no fim
- [ ] 5.3 Worktrees e branches que podem ser apagadas (sem apagar)

## Achados e correções

### A home (item 1)

- Medido: com 14 livros numa fileira, cada livro ficava com ~116px de altura na tela larga e ~20px de
  lombada no celular; com 9, eram 214px. Pesquisa (NN/g, Baymard), mapa do código e 17 maquetes por CSS
  injetado; a forma escolhida e as descartadas estão na D84.
- `ColecaoHome.astro` (novo): prateleiras de capas; 7 por prateleira a partir de 900px, 5 de 600 a 899px,
  4 abaixo de 600px (a estante sangra a margem). Um abajur e o livro por lugar, a lâmina de vidro no
  primeiro lugar de cada prateleira, quebras por forma geradas no servidor. Sem nomes embaixo (14
  paradas de teclado em vez de 28).
- `Colecao.astro`: ficou só a fileira do alto da página do livro (saiu o modo "home", os nomes, a
  gaveta, o giro de capa).
- `doca.ts`: por prateleira, aumento de 1,14× (era 1,5×), `z-index` na `.tomba` (o lugar que abre a
  prateleira leva a lâmina, que passaria por cima dos outros livros).
- `Abertura.astro`: a caneta risca a lâmina de cada prateleira (0,12s a mais por prateleira), os livros
  (`.tomba`) entram deslizando com as lâminas e os abajures já no lugar; o "blog" carimba depois da
  assinatura; saiu o odômetro.
- `[...page].astro`: sem a linha (frase, números, último artigo) e sem o script do odômetro; o nome em
  1/8,9 da largura útil (até 168px) e 1/5,6 no celular.
- `Marca.astro`: o "blog" da gigante virou o carimbo (absoluto, −13°, sobre o canto do Z, contorno da
  cor do papel).
- `Rodape.astro`: o nome numa linha só abaixo de 900px, de borda a borda.
- Conferido: 320 a 1920px nos dois temas (sem rolagem lateral, sem erro de console), sem JavaScript, o
  teclado, a abertura quadro a quadro (1440 e 390px), a doca nas duas prateleiras, a viagem até a página
  do livro e a volta pelo histórico; `npm run check` com 0 erros.



### A revisão geral (item 2)

Sete grupos no site publicado (cada lote conferido por um segundo agente: 78 achados, 75 confirmados, 74
corrigidos) e dois agentes na home nova, no dev (13 achados). Corrigido e conferido no navegador:

- **Livros e As capas:** o "+N" das tags no celular preso à fileira e por cima dos vizinhos (`TopoLivro`); o
  título longo da página do livro em 320px (piso de 24px); a tira das fichas quebra em vez de cortar com
  reticências, e a dos cards de livro só com o ano (`catalogo.css`, `GradeLivros`); a ficha do desfile abaixo
  do cabeçalho (`categories/index.astro`); os ícones e o tracejado de As capas clareados no escuro e a seta do
  link presa à palavra, com o aviso de nova aba (`capas.astro`); a folha atrás da fileira do topo opaca logo
  que ela passa sobre o painel (`FileiraTopo`).
- **Listas, tags, busca, 404 e RSS:** a ordem dos posts da mesma data e os vizinhos (`posts.ts`); a tira do
  artigo fora do índice da busca (`TopoArtigo`); a busca que volta ao botão que a abriu e o texto com
  reticências em 320px (`Busca`); a 404 numa coluna até 1480px, sem o botão de busca sem JS e sem a rasura com
  movimento reduzido (`404.astro`); as figuras e figuras em passos como texto e link no RSS, e o `srcset`
  absoluto (`Figura`, `FiguraPassos`, `rss.xml.ts`); o pé da estante de filtro no celular e as pílulas na
  linha do rótulo (`ListaFiltrada`); a orelha das fichas de Tags (`FichasTags`); a rolagem do fichário sem
  esconder a gaveta (`fichario.ts`).
- **Posts:** o menu do celular sem JS numa linha e a trava de rolagem com ele aberto, o respiro no foco da
  seção (`Cabecalho`); a caneta da leitura com contraste no claro (`posts/[slug].astro`); a frase em destaque
  (`lousa.css`); o contador, o código e o foco da figura em passos (`figura-passos.css`, `marca-texto.css`,
  `figura-passos.ts`); as figuras entre 701 e 870px pela largura delas (`figura.css`); o texto no tom sobre as
  caixas lavadas (`figura.css`); o rótulo apertado do CronJob (`abordagem-b.svg`); o aviso das tabelas largas
  em qualquer largura (`prosa.css`, `artigo.ts`); a estimativa dos blocos de código (o salto por âncora) e o
  Copiar no toque (`prosa.css`); "MessageAttributes" e o card dos vizinhos (`formato.ts`, `Vizinhos`); a trilha
  em 320px (`TopoArtigo`); os textos sobre a cor das capas e os carimbos (`desenho.css`, `java.mjs`, duas
  capas, `validar.mjs`, skill `desenho`).
- **Animações e moldura:** a cortina que partia a palavra (`Base.astro`, `suave.css`); o rodapé que esmaece na
  troca por folhas (`troca.js`, `base.css`); a aba "topo" fora da subida pedida (`AbaTopo`, `Rodape`); o anel
  da cordinha no feltro (`Rodape`); o livro ampliado com o foco nas pontas e a legenda inteira
  (`LivroAmpliado`); a faixa da barra com o visor aberto (`visor.css`); o computador fora da folha do sumário,
  sem o atalho que não abria, com o `history`, o Esc, o Leia-me e o entalhe certos (`src/computador/`).
- **A home nova:** a caneta riscando uma lâmina por vez, o carimbo sem o tique, a estante que espera inteira, o
  Tab que pula a abertura (`Abertura`); o foco por cima dos vizinhos, as prateleiras alinhadas, o teto do
  tamanho nas formas de 5 e 4 e o respiro sob "A coleção" (`ColecaoHome`, `[...page].astro`); o voo a partir
  da pose da doca (`doca.ts`); o hit test do ícone adiado enquanto a estante acende (`icone.ts`).

## Perguntas para o Cesar

(no fim da rodada, também no `docs/estado.md`)

