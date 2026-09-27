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

- [x] **A01.** _(agente Abertura; bc01200)_ O caderno da abertura das outras telas abre **branco por dentro**: deixar como no
      protótipo (`docs/prototipos/animacoes/`), papel creme com pauta de caderno. O mesmo no caderno da
      marca quando abre na home (o grande do painel e o pequeno do cabeçalho, no hover): miolo creme e
      pautado, profissional.
- [x] **A02.** _(agente Trocas; 5e42b33)_ Troca de tela "mesa de cards": os cartões da página nova aparecem **antes** de os da
      antiga sumirem (mais evidente de uma tag para outra, mas acontece em outras trocas). Resolver.
- [x] **A03.** _(agente Trocas; 6912291)_ Artigo → próximo (rolado para baixo): a folha antiga some devagar e fica um pedaço dela
      em cima que a nova não cobre. Voltar (anterior) está bom. Melhorar o avançar.
- [x] **A04.** _(agente Livros e visor; 776f8dd)_ No escuro, as imagens ficam **brancas** ao abrir (visor). Arrumar.

## B. Ajustes que o Cesar identificou (e bugs que eu achar)

- [x] **B01.** _(agente Pilha; 2463a34)_ Categorias: ao trocar de livro, depois que o livro novo vai para o lugar, a tela treme.
- [x] **B02.** _(agente Simples; 3774b8f, bc72023)_ Livro ampliado: "Ler o artigo" e "Abrir o próximo livro" com o ponteiro de link e
      sublinhado no hover, como na primeira página; "Ver o livro inteiro" com o sublinhado mais forte
      no hover.
- [x] **B03.** _(agente Simples; c039c64, 08f5032)_ Anterior / próximo (teclado e botões) em **ordem cronológica global**, a mesma de
      "Todos os artigos", sem importar o livro.
- [x] **B04.** _(agente Artigo; f5d4fac)_ "Neste artigo" chega marcado (risco, "V" e a última seção selecionada): sempre chegar
      zerado.
- [x] **B05.** _(agente Artigo; 8048648)_ "Neste artigo" sem o marca-texto na cor do livro: a caneta azul do cabeçalho (o traço
      do progresso no fio), a linha lateral dos "V" em azul e a seção atual **sublinhada à caneta
      azul**, como o traço do menu (Categorias, Séries…). Menos cor do livro repetida.
- [x] **B06.** _(agente Artigo; 2788f33)_ "?" abre a busca (em qualquer tela): a busca só com ⌘K / Ctrl+K; "?" só abre os
      atalhos, e só no artigo. O painel de atalhos está feio: no celular, pode ser centrado com o
      fundo escurecido; na tela grande, uma entrada elegante (sem cobrir tudo).
- [x] **B07.** _(agente Listas; 6353c1d)_ "Todos os artigos": muito espaço vazio no painel com os livros ao lado do texto; em
      tela menor (livros embaixo do texto), pior. Repensar essa tela.
- [x] **B08.** _(agente Livros e visor; 975885c)_ Livros de lado (3D): uma **linha branca** entre a capa e a lombada. Arrumar em todos.
- [x] **B09.** _(agente Pilha; 2463a34)_ Troca de livro em Categorias: a animação toda mais profissional, fluida e realista,
      principalmente o fim (o livro novo no lugar, sem tremer). Junto com o B01.
- [x] **B10.** _(agente Trocas; 59eab79)_ De `/categories/` para uma categoria e de volta: a animação do livro está feia.
      Melhorar ou tirar.
- [x] **B11.** _(agente Listas; e6fd634)_ Tags: cartões mais bonitos; **um ícone por tag**, no padrão dos desenhos das capas, com
      o processo para tag nova já pedindo o ícone; na página de uma tag, o ícone grande como marca
      d'água no painel do topo, que hoje está mal aproveitado (como o de "Todos os artigos").
- [x] **B12.** _(agente Abertura; e950bfc)_ Abertura da home: com o mouse sobre a estante, aparecem as legendas dos livros (as do
      hover da home). Na abertura, não.
- [x] **B13.** _(agente Abertura; 3ac42db, c6addd8)_ Fim da abertura da home: depois do desenho do destaque, o caderno do cabeçalho e o
      caderno grande abrem um pouco e fecham, **os dois juntos** (como no hover), uma vez.
- [x] **B14.** _(agente Trocas; 2d4bbb6)_ Lentidão (rede, CPU, memória): deixar o site fluido e evitar engasgos; um carregando,
      ou algo do tipo, quando for demorar.

## C. Novidades

- [x] **C01.** _(agente Simples; 10912bc, f1a592d)_ Primeira visita: tema **claro** e artigos em **cards**. A escolha do leitor fica
      guardada no navegador por **3 dias**; depois disso, volta ao padrão (claro e cards).
- [x] **C02.** _(agente Home; ef241f1)_ Destaque da home: em cards, **um cartão maior ocupando duas colunas** sempre que houver
      pelo menos duas lado a lado; com uma coluna só, o primeiro cartão em destaque; em lista (tela
      grande e pequena), destaque no primeiro da lista.
- [x] **C03.** _(agente Home; 3dcad52)_ Código-fonte dos artigos (repositório `cesarschutz/blog-exemplos`): mostrar que o
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

- **A01** (bc01200): o miolo do caderno vira um desenho só (`src/lib/caderno.ts`), papel dos livros com
  pauta na página inteira (token `--caderno-pauta`, igual nos dois temas), na marca do cabeçalho, na
  grande da home e no caderno da abertura. No cabeçalho, metade das linhas (senão vira escada cinza).
  Relatório: [diagnosticos/A01.md](diagnosticos/A01.md).
- **B12** (e950bfc): durante a abertura a estante não responde ao mouse nem ao foco, e o clique nela
  pula a abertura; a estante viva só começa no `cs:aberto`. De quebra: o fim da abertura piscava (a
  opacidade dos livros saía antes do `data-abertura`). [diagnosticos/B12.md](diagnosticos/B12.md).
- **B13** (3ac42db, c6addd8): `cs:desenhou` no fim do desenho do destaque; os dois cadernos ganham a
  classe `acena` (o mesmo movimento do hover) juntos, uma vez. Se o destaque estiver abaixo da dobra
  quando a estante assenta (tela baixa, celular), o aceno vem logo depois da estante, sem esperar o
  leitor rolar. [diagnosticos/B13.md](diagnosticos/B13.md).

- **B04** (f5d4fac): a medição do sumário ia pelo `getBoundingClientRect` durante a chegada das folhas
  (pequenas e no alto, em perspectiva), e todo título parecia lido ("Fontes" virava a atual). Agora pelo
  layout (`offsetTop`); o visto só vale para a seção que foi a atual por 0,6s e ficou para trás; o
  bfcache zera. [diagnosticos/B04.md](diagnosticos/B04.md).
- **B05** (8048648): o progresso inteiro em `--caneta` (fio do cabeçalho, ponta, trilho, vistos, ponto
  atual); a seção atual sublinhada à mão pelo `tracoDeCaneta` do menu (um traço por linha, escrito e
  apagado para a direita); a barra de porcentagem saiu ("NN% lido" e os minutos ficam); saiu o
  `SUMARIO_MARCA`. De quebra: o nome das seções voltou aos 14px. [diagnosticos/B05.md](diagnosticos/B05.md).
- **B06** (2788f33): a causa era o atalho "/" da busca (no ABNT2, "/" e "?" são a mesma tecla). A busca
  só com ⌘K / Ctrl+K; o "?" só no artigo. A ficha dos atalhos: na tela grande (≥ 1300px), uma ficha
  pautada sai de trás da folha do sumário e pousa ao lado, sem escurecer; abaixo disso, no meio com o
  véu. Popover com papel de diálogo, foco, Esc, "Desligar". [diagnosticos/B06.md](diagnosticos/B06.md).

- **B02** (3774b8f): o `:hover` nativo se perdia nas folhas empilhadas em 3D (o mesmo motivo do clique,
  D50). Um `mousemove` no palco usa o mesmo `linkNoPonto` do clique e põe `.sob-o-mouse` no link certo,
  com `cursor: pointer`; "Ver o livro inteiro" ganha o sublinhado mais grosso. [diagnosticos/B02.md](diagnosticos/B02.md).
- **B03** (c039c64): posts de série usavam a ordem de leitura da série (`getPostsDaSerie`), e não a data.
  Agora anterior e próximo vêm sempre de `getResumos()`, a mesma ordem de `/archive/`; o rodapé perdeu
  o rótulo "na série". [diagnosticos/B03.md](diagnosticos/B03.md).
- **C01** (10912bc): padrão claro e cards (o tema não segue mais o sistema); a escolha do leitor (tema e
  modo) fica no `localStorage` com a data da última troca (`cs-prefs-quando`); passados 3 dias, o script
  do `<head>` apaga as chaves antes da primeira pintura. [diagnosticos/C01.md](diagnosticos/C01.md).

- **C02** (ef241f1): o bloco "Em destaque" saiu; o mais recente é o primeiro item de "Artigos recentes",
  só em `/`. Em cards com duas colunas ou mais, ocupa duas (desenho largo anotado, título de 26 a 32px);
  numa coluna, o cartão com "Mais recente" (traço de caneta embaixo) e título maior; em lista, o
  primeiro item maior (desenho 3:2 à direita; em cima no celular). O desenho que se desenha (D41) roda
  uma vez, na forma à vista. **Paginação (muda a D27):** 12 lugares por página e o destaque vale dois,
  então `/` tem 11 posts, `/2/` 12 e `/3/` 4 (as URLs são as mesmas). [diagnosticos/C02.md](diagnosticos/C02.md).
- **C03** (3dcad52): campo `codigo` no frontmatter (URL https, opcional; "fonte" já é o `## Fontes` e as
  tipografias), preenchido no post do Jackson. No topo do artigo, "Código deste artigo no GitHub" com o
  ícone `</>`; em cards, lista e destaque, o sinal `</>` "código-fonte" na linha da data; só o ícone na
  gaveta e em anterior / próximo; na busca, "código-fonte" na linha do resultado; no livro ampliado,
  "Código no GitHub ↗". Skill `post` atualizada. [diagnosticos/C03.md](diagnosticos/C03.md).

- **B01 e B09** (2463a34): a tremida eram cinco coisas somadas: a troca da pilha caía na transição
  padrão do `base.css` (a página nova subia 18px e a antiga 6px, a tela duplicada por meio segundo); o
  giro do palco por CSS brigando com o GSAP; as fontes da página nova ainda não prontas no
  `pagereveal`; a pilha da página antiga diferente da nova em 1 a 8px (atrito, arredondamento, hover);
  e as imagens do livro esmaecendo uma na outra. Agora é uma sequência só (~2,3s, antes ~3,7s): o
  aberto gira até a lombada e voa num arco até a pilha; o escolhido é puxado e, com o embalo, segue até
  o palco, fica em pé e gira; o livro 3D voa numa camada própria com sombra; a página antiga já toma a
  cor e o texto do livro novo; a nova abre a 70% do giro e o continua (tipo `pilha`, sem deslocar a
  raiz, esperando as fontes). A página do livro é buscada quando o mouse para 90ms sobre ele. No
  celular e no tablet, a troca de antes. [diagnosticos/B01-B09.md](diagnosticos/B01-B09.md).

- **A04** (776f8dd): os diagramas antigos ficam escuros por um filtro da prosa (D39), que o visor não
  tinha (e o quadro dele é sempre branco). No escuro, o visor aplica a mesma inversão, com a sombra
  dentro do filtro (`drop-shadow` depois da inversão); e o visor esmaece ao fechar (0,18s).
  [diagnosticos/A04.md](diagnosticos/A04.md).
- **B08** (975885c): duas falhas de montagem do `Livro3D`: a capa fica 0,6px à frente da lombada e as
  duas só se encostavam (fresta); e o miolo começava no plano da lombada, e a borda clara da página
  vazava nas emendas. A lombada passa 1,5px por baixo da capa (`::before`), o miolo começa 1px para
  dentro (`--recuo-miolo`) e o verso da capa passa 1px da dobradiça. Vale para todos os livros de lado.
  [diagnosticos/B08.md](diagnosticos/B08.md).

- **B07** (6353c1d): o texto ficava centrado ao lado de uma estante alta, boiando no vazio; abaixo de
  860px, a estante descia sem nada ao lado. Agora o painel é uma composição apoiada no pé da folha:
  título e descrição no alto à esquerda; embaixo, na altura da tábua, "Por assunto" (as 4 tags mais
  usadas e "Todas as tags") e "Por ano" (âncoras dos anos, com a contagem que rola com o filtro); a
  estante de filtro à direita, com "Só <livro>" e "Limpar filtro" embaixo da tábua. Altura do painel:
  380 → 324px (1280), 533 → 278px (768), ~500 → 359px (390). [diagnosticos/B07.md](diagnosticos/B07.md).
- **B11** (e6fd634): 20 ícones de tag (`docs/capas/tags/<slug>.svg`) no traço dos ícones das lombadas,
  objetos do dia a dia e nunca logotipo (broto para Spring, moedor de café para JVM, âncora para LTS,
  semáforo de ferrovia para Concorrência, leme de 8 raios para Kubernetes, nuvem para AWS…), com a
  forma escrita à mão em coordenadas (`scripts/desenho/tags.mjs` só põe o tremor da caneta). Sem
  ícone, o build falha com o caminho e a regra (`src/lib/tags-svg.ts`); processo de tag nova no
  `CAPAS.md`, na skill `post` e no `CLAUDE.md`. Cartões de `/tags/` com o ícone (gira 6° no hover) e
  uma estante em miniatura dos livros de onde vêm os artigos. Topo da tag como o do B07, com o ícone
  grande em marca d'água. `PilulaTag.astro` com ícone nas tags vizinhas, "Por assunto", topo do livro e
  fim do artigo. Folha de conferência em `/amostra/tags/`. [diagnosticos/B11.md](diagnosticos/B11.md).

- **A02** (5e42b33): três coisas somadas: as folhas novas começavam no `pagereveal` e a queda das
  antigas só no `vt.ready`; a queda demorava a sair do lugar (cubic-in de 0,48s, cascata de 0,16s); e o
  esmaecer das antigas era tardio. Agora a saída some toda em 0,3s (quad-in 0,38s, cascata 0,06s), a
  chegada do fundo começa em 0,26s e tudo anda no relógio do `vt.ready` (também o `cs:pousou` e o
  desfile de Categorias). [diagnosticos/A02.md](diagnosticos/A02.md).
- **A03** (6912291): a imagem do artigo atual ficava inteira até 0,6s e, rolada, aparecia acima do topo
  do novo. Agora ela esmaece e afunda 10px entre 0,14s e 0,4s, embaixo da folha que chega, e some antes
  do pouso. [diagnosticos/A03.md](diagnosticos/A03.md).
- **B10** (59eab79): melhorado em vez de tirado. O hover vira o livro do cartão a 24° e o do topo está a
  38° (as duas imagens se sobrepunham); a folha de destino partia da opacidade 0 (o Chrome não pinta
  nada dentro dela); e o `limparNomes` zerava a classe `livro`. Agora, com o mesmo livro nas duas
  pontas (classe `mesmo`), voa só a imagem nova, que continua o giro do hover até o de parado em 0,75s.
  [diagnosticos/B10.md](diagnosticos/B10.md).
- **B14** (2d4bbb6): medido com Slow 4G e CPU 4× no build: do clique ao começo da troca, ~580ms numa tag
  e ~900ms num artigo. Regras de especulação (`prefetch`, `moderate`) no `<head>`: com o ponteiro 0,4s
  sobre o link, ~180ms e ~440ms. Se a página nova passa de 0,2s, a caneta azul escreve o fio do
  cabeçalho, cada vez mais devagar (carregando). Chegada curta (~0,4s) quando a espera passou de 1s,
  quando uma troca anterior engasgou (`cs-troca-leve` na sessão) ou com até 2 GB de memória. O desfile
  de Categorias espera o GSAP no máximo 1,8s. De fora: o peso das páginas (160 a 440 KB, pelos SVGs
  embutidos) pede um item próprio; `prerender` fica para depois. [diagnosticos/B14.md](diagnosticos/B14.md).

## Para o Cesar decidir

(Preenchido no fim.)

## C05: o que foi feito (sem commit)

(Preenchido no fim.)
