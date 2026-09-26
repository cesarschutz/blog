# Controle dos ajustes, parte 1 (26/09/2026)

Pedido do Cesar em 26/09/2026. Cada item é marcado quando fica pronto e conferido no navegador.
Esta parte termina com commit e push na `main` (publica o site, com as D42 a D45 junto). Decisões
das dúvidas, respondidas antes de começar:

- "A caneta que desenha enquanto rola o texto" é a **lousa de passos**; a caneta do fio do
  cabeçalho (D45) fica.
- Na página de uma série, com uma série só, a pilha fica **vazia com um texto curto**.
- Push de tudo, junto com as D42 a D45.

## Home

- [x] 1. Lista de artigos: o texto vai até perto da imagem, sem o vão branco (home, arquivo, tags,
      categoria, série, onde houver lista).
- [x] 2. O livro aberto (ampliado) de lado, como o livro da gaveta da home (38°), em todo lugar.

## Categorias (`/categories/`)

- [x] 1. Livros mais de lado, como na gaveta da home e no livro ampliado.
- [x] 2. Sem a capa que segue o mouse: volta o efeito de antes (o cartão sobe e o livro gira um pouco).

## Uma categoria (`/categories/<Nome>/`)

- [x] 1. Painel da esquerda só com os livros das categorias (sem séries e sem tags; o assinar fica).
- [x] 2. O livro grande do topo mais de lado e com o efeito antigo (sem seguir o mouse).
- [x] 3. O livro ampliado abre igual ao da home.
- [x] 4. A pilha lateral com livros menos gordos.
- [x] 5. Troca de livro na pilha: o livro aberto volta para o topo da pilha, o escolhido é puxado e
      os de cima caem no lugar dele (também nas séries).

## Séries (`/series/`)

- [x] 1. O livro do Java mais de lado e com o efeito antigo.

## Uma série (`/series/java/`)

- [x] 1. Lateral só com séries, com a mesma animação de tirar e pôr o livro; pilha vazia com texto
      enquanto houver uma série só; sem a rolagem lateral que aparece hoje.

## Tela pequena

- [x] 1. Cabeçalho sempre visível (não some ao rolar); Artigos, Categorias, Séries e Tags num botão
      de menu que abre as opções.

## Post

- [x] 1. Sem a lousa de passos (a caneta que desenha enquanto o texto rola): trocar pelas outras
      duas (vídeo curto e linha do tempo de arrastar). **Posts que tinham (2):**
      `cobranca-duplicada-no-retry` ("Chave de idempotência", seção 3) e
      `jackson-filtros-mascarando-cartao` ("Filtros de serialização no Jackson", seção 3). Nos dois,
      virou a linha do tempo de arrastar (com play), com um estado por passo e os passos numa lista
      logo abaixo. O componente foi apagado do projeto.
- [x] 2. "Neste artigo" no topo, a capa do post alinhada com o texto de baixo (os dois painéis da
      mesma largura).
- [x] 3. Texto com a largura do código: margens pequenas nas laterais.
- [x] 4. Painel do topo: o texto aproveita a largura, sem laterais vazias.
- [x] 5. Embaixo do "Neste artigo", o livro grande de lado (como o da gaveta da home); no celular,
      no fim do artigo, fica como está.

## Fechamento

- [x] `npm run check` (0 erros), build, `npm run links` (nada quebrado), `npm run contraste` (0 falhas),
      validador dos desenhos (31 de 31).
- [x] Conferência no navegador (chrome-devtools): desktop 1440 e 1200px, 390px, claro e escuro; a
      troca na pilha medida quadro a quadro. Movimento reduzido conferido no código (o navegador
      de teste não emula a preferência).
- [x] `docs/decisoes.md` (D46), `docs/briefing.md`, `DESIGN.md`, `docs/estado.md`, `CLAUDE.md` e as
      skills `lousa` e `post` atualizados.
- [ ] Commit e push.
