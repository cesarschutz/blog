# Controle dos ajustes da D52 (27/09/2026)

Pedido do Cesar em 27/09/2026 (três folhas amarelas). Os itens estão **na ordem do pedido**. Cada
item fica pronto, é conferido no navegador (MCP `chrome-devtools`, aba própria), **commitado sozinho**
e marcado aqui com o hash do commit. **Sem push** (push na `main` publica o site, D34).

Regras de trabalho (minhas e dos agentes): [regras.md](regras.md). Diagnósticos dos agentes:
[diagnosticos/](diagnosticos/). Pesquisa (GSAP e outros): [pesquisa.md](pesquisa.md). Sugestões em
HTML: [sugestoes/](sugestoes/).

Modo combinado: **não parar para perguntar**; decidir pelo melhor e, no fim, listar o que o Cesar
ainda precisa definir ("Para o Cesar decidir", no fim deste arquivo).

Legenda: `[ ]` a fazer · `[~]` em andamento · `[x]` pronto e commitado (hash).

## A. Ajustes das últimas animações (D51)

- [ ] **A01.** O caderno da abertura das outras telas abre **branco por dentro**: deixar como no
      protótipo (`docs/prototipos/animacoes/`), papel creme com pauta de caderno. O mesmo no caderno da
      marca quando abre na home (o grande do painel e o pequeno do cabeçalho, no hover): miolo creme e
      pautado, profissional.
- [ ] **A02.** Troca de tela "mesa de cards": os cartões da página nova aparecem **antes** de os da
      antiga sumirem (mais evidente de uma tag para outra, mas acontece em outras trocas). Resolver.
- [ ] **A03.** Artigo → próximo (rolado para baixo): a folha antiga some devagar e fica um pedaço dela
      em cima que a nova não cobre. Voltar (anterior) está bom. Melhorar o avançar.
- [ ] **A04.** No escuro, as imagens ficam **brancas** ao abrir (visor). Arrumar.

## B. Ajustes que o Cesar identificou (e bugs que eu achar)

- [ ] **B01.** Categorias: ao trocar de livro, depois que o livro novo vai para o lugar, a tela treme.
- [ ] **B02.** Livro ampliado: "Ler o artigo" e "Abrir o próximo livro" com o ponteiro de link e
      sublinhado no hover, como na primeira página; "Ver o livro inteiro" com o sublinhado mais forte
      no hover.
- [ ] **B03.** Anterior / próximo (teclado e botões) em **ordem cronológica global**, a mesma de
      "Todos os artigos", sem importar o livro.
- [ ] **B04.** "Neste artigo" chega marcado (risco, "V" e a última seção selecionada): sempre chegar
      zerado.
- [ ] **B05.** "Neste artigo" sem o marca-texto na cor do livro: a caneta azul do cabeçalho (o traço
      do progresso no fio), a linha lateral dos "V" em azul e a seção atual **sublinhada à caneta
      azul**, como o traço do menu (Categorias, Séries…). Menos cor do livro repetida.
- [ ] **B06.** "?" abre a busca (em qualquer tela): a busca só com ⌘K / Ctrl+K; "?" só abre os
      atalhos, e só no artigo. O painel de atalhos está feio: no celular, pode ser centrado com o
      fundo escurecido; na tela grande, uma entrada elegante (sem cobrir tudo).
- [ ] **B07.** "Todos os artigos": muito espaço vazio no painel com os livros ao lado do texto; em
      tela menor (livros embaixo do texto), pior. Repensar essa tela.
- [ ] **B08.** Livros de lado (3D): uma **linha branca** entre a capa e a lombada. Arrumar em todos.
- [ ] **B09.** Troca de livro em Categorias: a animação toda mais profissional, fluida e realista,
      principalmente o fim (o livro novo no lugar, sem tremer). Junto com o B01.
- [ ] **B10.** De `/categories/` para uma categoria e de volta: a animação do livro está feia.
      Melhorar ou tirar.
- [ ] **B11.** Tags: cartões mais bonitos; **um ícone por tag**, no padrão dos desenhos das capas, com
      o processo para tag nova já pedindo o ícone; na página de uma tag, o ícone grande como marca
      d'água no painel do topo, que hoje está mal aproveitado (como o de "Todos os artigos").
- [ ] **B12.** Abertura da home: com o mouse sobre a estante, aparecem as legendas dos livros (as do
      hover da home). Na abertura, não.
- [ ] **B13.** Fim da abertura da home: depois do desenho do destaque, o caderno do cabeçalho e o
      caderno grande abrem um pouco e fecham, **os dois juntos** (como no hover), uma vez.
- [ ] **B14.** Lentidão (rede, CPU, memória): deixar o site fluido e evitar engasgos; um carregando,
      ou algo do tipo, quando for demorar.

## C. Novidades

- [ ] **C01.** Primeira visita: tema **claro** e artigos em **cards**. A escolha do leitor fica
      guardada no navegador por **3 dias**; depois disso, volta ao padrão (claro e cards).
- [ ] **C02.** Destaque da home: em cards, **um cartão maior ocupando duas colunas** sempre que houver
      pelo menos duas lado a lado; com uma coluna só, o primeiro cartão em destaque; em lista (tela
      grande e pequena), destaque no primeiro da lista.
- [ ] **C03.** Código-fonte dos artigos (repositório `cesarschutz/blog-exemplos`): mostrar que o
      artigo tem fonte em todo lugar onde ele aparece (cards e lista, com elegância) e o link no
      painel do topo do artigo. Hoje: o do Jackson
      (`https://github.com/cesarschutz/blog-exemplos/tree/main/jackson-filtros-mascarando-cartao`).
- [ ] **C04.** A caneta como identidade: o traço de caneta (o do menu do cabeçalho), também em
      **preto**, em lugares escolhidos (menu, GitHub e LinkedIn, botão de tema e busca redesenhados
      sem perder a animação, data e tempo de leitura com os ícones, a caneca, a marca "cs", o "Cesar
      Schutz" da home…). Nada no rodapé.

## Antes do último

- [ ] Conferir que tudo acima foi commitado (`git status --untracked-files=all` limpo, sem " 2").

## C05 (o último, **sem commit**)

- [ ] **C05.** Identidade do site com papelaria, caderno, anotação, estudo (post-it, fichário,
      ficha, envelope, máquina de escrever…), sem poluir e profissional. Ideia do Cesar: o painel
      "Neste artigo" e o painel do livro embaixo dele como post-its, escritos à caneta (azul e preta).
      **Não commitar**: o Cesar avalia antes. A lista do que foi feito vai no fim deste arquivo.

## Registro por item

(Cada item ganha aqui, ao fechar: causa ou decisão, o que mudou, como foi conferido e o commit.)

## Para o Cesar decidir

(Preenchido no fim.)

## C05: o que foi feito (sem commit)

(Preenchido no fim.)
