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
- [~] 1.12 O que ficou sem uso com a mudança saiu (odômetro dos números, estilos da linha, o modo
      "home" do `Colecao.astro`); `TEXTOS.apresentacao` e o resto vão na faxina (item 4)

## 2. Revisão geral das telas (bugs, animação, desenho, detalhe)

- [ ] 2.1 Varredura por agentes, página a página: home e `/2/`, livro (`/categories/<Nome>/`),
      `/categories/`, `/archive/` (e o filtro), `/tags/` e uma tag, `/series/` e `/series/java/`,
      `/capas/`, busca, 404, posts `.md` e `.mdx`, o computador, o cabeçalho, o menu e o rodapé
- [ ] 2.2 Animações: abertura, cortina e troca de página, livros (doca, livro vivo, viagem), lousas,
      figuras em passos, capa viva, rodapé
- [ ] 2.3 Desenhos: capas dos posts, figuras, lousas, livros, ícones das tags
- [ ] 2.4 Detalhes: alinhamento, cortes, quebras, contraste, foco, textos
- [ ] 2.5 Cada achado conferido por um segundo agente antes de corrigir (sem falso positivo)
- [ ] 2.6 Correções feitas e reconferidas no navegador

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

## Perguntas para o Cesar

(preenchido no fim)
