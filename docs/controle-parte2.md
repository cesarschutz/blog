# Controle dos ajustes, parte 2 (26/09/2026)

Pedido do Cesar em 26/09/2026, a parte mais difícil. **Fica só local, sem commit**, para ele validar
antes. Cada item é marcado quando fica pronto e conferido no navegador.

## 1. A marca "cs"

- [x] Nos dois lugares (cabeçalho e abertura da home): o "c" um pouco mais para cima e o "s" um pouco
      mais para baixo, ocupando melhor a capa.
- [x] Sem a fitinha vermelha embaixo do livro.
- [x] Na abertura da home: o livro maior, com "Cesar" e "Schutz" um embaixo do outro ao lado dele, e o
      "blog" mantido. Pode ser um desenho novo, profissional e no estilo do site.

## 2. A estante ao passar o mouse

- [x] Hoje, o livro sobe e os vizinhos tombam para os lados, por cima dos outros livros. Deixar
      realista (sem livro atravessando livro) ou, se não der, só subir. Na home e no filtro dos
      artigos e das tags.

## 3. A entrada no site

- [x] Uma abertura curta ao entrar (carregando e depois o site aparecendo, como em clevante.cz), com
      os livros e/ou as folhas dos artigos. No celular, mais simples, mas com a abertura.

## 4. Transições e movimento do site todo (GSAP)

- [x] Revisar a troca de qualquer página para qualquer outra (hoje cada uma é de um jeito; o livro que
      some por cima de tudo ao ir de uma categoria para um artigo).
- [x] Revisar as rolagens e as animações (ex.: a gaveta da home abre e o conteúdo de baixo some de
      repente; ele deveria descer enquanto a gaveta abre).
- [x] Tudo com `prefers-reduced-motion` e mais leve no celular.

## 5. Ideias de fora (agentes sem contexto)

- [ ] Cinco agentes, sem o contexto desta conversa, olham o site já com as mudanças acima e o
      showcase do GSAP e propõem melhorias. Cada ideia vira um protótipo HTML em
      `docs/prototipos/ideias/` (até uns 20), com texto e imagens de mentira, para o Cesar ver e
      decidir. Entre elas, as folhas dos artigos voando e se encaixando (a imagem que ele mandou).

## Anotações

- **1 (D47):** o gerador `scripts/marca.mjs` põe o "c" 5,4 acima e o "s" 5,4 abaixo do centro (na
  escala da capa de 40 × 52), com as letras um pouco maiores; a fita saiu (do desenho, do CSS e do
  token `--marca-fita`), e o favicon e o ícone do iPhone foram regerados. Na abertura, o livro tem a
  altura das duas linhas do nome, "Cesar" / "Schutz" empilhados e o "blog" depois do sobrenome; o
  livro grande abre ao passar o mouse, como o do cabeçalho.
- **2 (D47):** deu para ficar realista: o livro só desliza para cima (16px), os dois vizinhos sobem
  2px pelo atrito, um pouco depois, e nada inclina (o topo inclinado entrava no livro ao lado). Ao
  sair, desce e assenta com um quique curto. As espiadinhas da estante em repouso também só sobem.

- **3 (D47):** `src/components/Abertura.astro`. Folha de papel com o livro "cs" e o fio escrito pela
  caneta, com a contagem até 100; depois o livro voa até o livro grande da abertura (no celular, até o
  do cabeçalho), a folha sobe e o site chega por partes (destaque, folha da abertura, nome linha a
  linha, livros descendo para a prateleira um a um, cabeçalho). Só na primeira visita da sessão, só na
  home, sem movimento reduzido. Para ver de novo: abra numa aba anônima ou limpe o `sessionStorage`.
- **4 (D47):** troca de página igual em todo o site (cabeçalho parado, a folha antiga sai, a nova
  chega subindo; livros que voam entre as páginas; o desenho da lista vira o topo do post; o livro sem
  par sai junto com a folha); a gaveta cresce e recolhe (o conteúdo de baixo desce junto); o livro
  ampliado sai do livro de origem e volta para ele; o filtro dos artigos troca com os artigos chegando
  em sequência; rolagem suave no sumário. Com movimento reduzido, tudo direto.
- O nome na marca fica **"Cesar Schutz"**, sem acento, como em todo o site (no pedido estava
  "César Schütz"; parece correção do teclado).
