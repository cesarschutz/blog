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
- [x] **C04.** _(agente Caneta; 1881e62, a32985a, 8b38e51, b054b9a, aa8c961, 43fa97d)_ A caneta como identidade: o traço de caneta (o do menu do cabeçalho), também em
      **preto**, em lugares escolhidos (menu, GitHub e LinkedIn, botão de tema e busca redesenhados
      sem perder a animação, data e tempo de leitura com os ícones, a caneca, a marca "cs", o "Cesar
      Schutz" da home…). Nada no rodapé.

## Revisão de acabamento das animações (depois do C04)

Um agente gravou as dez cenas da D52 juntas (Chrome headless, 1440 e 390, claro e escuro) e achou 14
problemas ([diagnosticos/revisao-animacoes.md](diagnosticos/revisao-animacoes.md)). Um commit por
correção ("D52 revisão N").

- [x] 1. Pilha no celular: a lombada puxada alarga a página e a transição aborta (corte seco). (9cccaf4, c30dc21)
- [x] 2. Trocas gerais: 85 a 135ms de página vazia entre a saída e a chegada (lê como piscada). (7e0806b)
- [x] 3. Anterior com a página no fim: o rodapé nítido por cima do título do artigo novo. (aaa9579)
- [x] 4. Sumário: a seção atual em peso 600 quebra a linha e a lista salta ~11px. (49616bb)
- [x] 5. O aceno vinha antes do desenho do destaque (pegava a miniatura escondida da lista). (46a06c7)
- [x] 6. Livro ampliado: pisca ao abrir e fica um quadro vazio ao fechar. (7f1e450)
- [x] 7. CPU lenta: a página congela ~1,1s sem a caneta de carregando e vem a coreografia inteira. (83b6f0f)
- [x] 8. Próximo e anterior: o painel do desenho fica vazio por 0,5 a 0,65s. (abea3f9)
- [x] 9. Próximo: a lateral velha e a nova juntas a ~50% no mesmo lugar. (519cfaf)
- [x] 10. Pilha na tela grande: o painel do topo fica um retângulo vazio por ~1,1s. (d1217d2, 20be2a5, 67b6a11)
- [x] 11. Visor ao fechar: o diagrama do visor e o da página juntos por ~0,1s. (2de479a)
- [x] 12. Abertura no escuro: o fio da caneta quase não aparece. (4545e75)
- [x] 13. Carregando: a caneta some de uma vez antes de as folhas caírem. (aa21d4e)
- [x] 14. Abertura com o caderno: o voo em linha reta cruza "Cesar Schutz". (5d6dd1f)

- [x] 15. Pilha no celular, agora que anima: a lombada deitada esticada até o livro do topo cruza a
      capa como uma faixa por ~0,15s. (ace7907)
- De quebra (67b6a11): voltar pelo histórico depois da troca pela pilha trazia a pilha **vazia** (o
  `clearProps: "all"` do `pageshow` apagava o estilo das lombadas).

Relatórios: [revisao-sumario-abertura.md](diagnosticos/revisao-sumario-abertura.md),
[revisao-pilha-livro.md](diagnosticos/revisao-pilha-livro.md), [revisao-trocas.md](diagnosticos/revisao-trocas.md).

## Antes do último

- [x] Conferir que tudo acima foi commitado (`git status --untracked-files=all` limpo, sem " 2"). Em
      27/09/2026, 22h20: árvore limpa, nenhum arquivo com " 2"; `npm run check` 0 erros, `npm run
      contraste` 0 falhas, `npm run build -- --force` e `npm run links` (86 páginas, nada quebrado);
      preview da 4323 reiniciado com o build. O remoto recebeu pushes às 18h43 e 22h11 (fora desta
      sessão; nenhum agente deu push); o registro da revisão (f1f4c4c) e este controle ficaram locais.

## C05 (o último)

- [x] **C05.** _(commitado pelo Cesar em 28/09/2026, da57524)_ Identidade do site com papelaria, caderno, anotação, estudo (post-it, fichário,
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

- **C04** (seis lotes): a regra **a caneta preta desenha; a azul marca** (o preto é o `--ink`, que no
  escuro vira a tinta clara; o azul fica no estado: seção e página atuais, a caneta da leitura, as
  marcações da D48). Todo traço novo sai de `src/lib/traco.ts`, gerado no build, sem filtro e sem `id`.
  (1, 1881e62) calendário, relógio e `</>` à mão, na tinta a 78%, parados; o "código-fonte" preso ao
  tempo de leitura, só o ícone abaixo de 340px de linha (o título do card voltou a alinhar). (2,
  a32985a) o traço do hover do menu em preto a 55%; GitHub e LinkedIn com as marcas oficiais em preto
  (as regras das duas proíbem redesenhar) e o círculo à mão preto no hover; o colchete da lista e o
  círculo da paginação também pretos. (3, 8b38e51) o botão de tema com o contorno a lápis e a lua e o
  sol à caneta, com a mesma animação (MorphSVG, DrawSVG, o círculo da D42, o botão na primeira
  pintura). (4, b054b9a) a busca com o contorno à mão a lápis que escurece no hover e a lupa à caneta
  (o Flip e o ⌘K seguem); o botão do menu do celular com os dois traços que se cruzam no X; abaixo de
  360px, marca a 16px e botões a 36px (o "blog" não encosta mais na busca). (5, aa8c961) a assinatura:
  um traço de largura variável embaixo de "Schutz", escrito em 0,9s depois do aceno dos cadernos, ou
  já pronto sem a abertura; um traço curto embaixo do "blog" no hover da marca do cabeçalho. (6,
  43fa97d) a caneca das ilustrações da série Java: no hover, a fumaça sobe e some e uma nova se
  escreve (classe `fumaca`). Sem caneta nova: rodapé, texto, código, botões cheios, tags, livros e a
  revista. [diagnosticos/C04.md](diagnosticos/C04.md).

## Para o Cesar decidir

Decidi tudo para não parar; estas escolhas podem voltar atrás com pouco trabalho.

1. **Ícones das tags (B11):** as 20 metáforas (as mais discutíveis: semáforo de ferrovia para
   Concorrência, moedor de café para JVM, espeto de notas para AOP, âncora para LTS) e o giro de −8° da
   marca d'água na página da tag (a das categorias não gira). Folha de conferência em `/amostra/tags/`.
2. **GitHub e LinkedIn (C04):** ficaram as marcas oficiais em preto, com o círculo à caneta no hover. O
   desenho à mão que você sugeriu contraria as regras de marca das duas (risco baixo num blog pessoal).
3. **Caneta preta além do pedido (C04):** o colchete da lista e o círculo da paginação passaram a
   preto (podem voltar ao azul); o rodapé ficou com o traço azul da D49 (manter, preto ou tirar).
4. **Detalhes do C04:** o visto dentro do calendário (pode ler como "feito"; a alternativa é o
   calendário sem marca); o traço curto embaixo do "blog" no hover da marca (opcional); a assinatura
   embaixo de "Schutz" entra ~5s depois de abrir a home, e no celular não existe (a home não mostra o
   nome grande).
5. **Home (C02):** a primeira página tem 11 artigos (o destaque vale dois lugares, para a grade fechar
   em 1, 2, 3 e 4 colunas); `/2/` e `/3/` sem destaque. Muda a D27 ("12 por página, como no blog
   atual"); as URLs são as mesmas.
6. **Aceno dos cadernos (B13):** com o destaque abaixo da dobra (tela baixa, celular), o aceno vem logo
   depois da estante, sem esperar o leitor rolar até o desenho.
7. **Preferência de 3 dias (C01):** conta a partir da última troca, e tema e modo têm o mesmo relógio.
8. **Ficha dos atalhos (B06):** aparece ao lado do sumário a partir de 1300px; a 1280px fica no meio,
   com o véu (a regra do celular).
9. **Tempos longos (D51, revisão):** o desfile de Categorias leva ~3,3s toda vez; a troca geral só
   termina de pousar em 1,6 a 1,9s; o papel da abertura com o caderno saiu ~0,25s mais tarde (revisão 14).
10. **Caderno no escuro (A01):** a contracapa verde do caderno da abertura quase some no fundo escuro;
    sugestão: um contorno leve, como o da marca.
11. **Peso das páginas (B14):** 160 a 440 KB abertos, pelos SVGs embutidos; merece um item próprio. O
    `prerender` das regras de especulação ficou para depois.
12. **Campo `codigo` (C03):** o nome evita confundir com as "Fontes" (referências) e as fontes
    tipográficas. Por enquanto só o post do Jackson tem.

**C05 (sem commit; detalhes na seção seguinte):**

13. **Aprovar ou não a papelaria** (post-it, ficha do volume com clipe, cola dos atalhos, vistos à
    mão). Tudo está só na árvore de trabalho; nada foi commitado.
14. **Caveat fora das notas** (estende a D48): os quatro títulos curtos à mão ("Neste artigo", "Do
    livro", "Da série", "Atalhos do teclado"), num subconjunto próprio de 10,6 KB, pré-carregado em toda
    página de artigo. Alternativa: os títulos voltam para a Besley e a papelaria fica só no papel.
15. **O amarelo do post-it:** claro `#FFF1BE` (o marca-texto a 52% sobre a folha) e escuro `#39372D`
    (âmbar apagado, ajustado a olho: a mistura pura dava um oliva frio). Mais pálido (42%, a proposta
    da pesquisa) ou mais forte?
16. **A cola dos atalhos perdeu o sublinhado azul animado do título (B06):** no lugar, a linha vermelha
    do cabeçalho da ficha, parada. Pode voltar, mas ficam duas linhas embaixo do título.
17. **A ficha no fim do artigo** (abaixo de 1300px, e a ficha da lateral): a ficha inteira continua
    sendo o link; na folha larga ela fica do tamanho de um cartão de anterior/próximo (metade), e não
    mais de lado a lado. Ao passar o mouse, o livro gira (sem subir 4px, como antes: agora ele está
    preso numa foto).
18. **Ficou de fora (pode entrar depois, com o seu OK):** carimbo "fontes conferidas em …" (pede um
    campo novo no frontmatter e a conferência feita post a post; sem isso, o carimbo mentiria); abas de
    fichário nos anos (o B07 já pôs "Por ano" no topo, e com dois anos as abas não ajudam); a busca como
    gaveta de ficheiro (mexe no Flip da D44 sem ganho claro de uso).

## C05: o que foi feito (sem commit)

Agente Papelaria, 27/09/2026. **Nada commitado** (nem `git add`): tudo está só na árvore de trabalho.
Não mexi em `docs/decisoes.md`, `docs/estado.md`, `DESIGN.md`, `docs/briefing.md` nem `CLAUDE.md`.

**A ideia:** poucos objetos de papelaria, cada um num lugar só e com uma função (a metáfora explica, não
enfeita), todos em volta da leitura do artigo, onde o blog é mais "caderno de estudo". A caneta azul
marca (o estado da leitura) e a preta desenha (C04). O resto do site não mudou: livros, código, capas,
rodapé e listas ficaram como estavam.

### O que mudou

1. **O "Neste artigo" virou um post-it** (lateral, ≥ 1300px; `Sumario.astro`). Um amarelo só
   (`--post-it`), sem borda, cantos quase retos, colado em cima e com a borda de baixo levantada (a
   sombra só embaixo, `--sombra-post-it`), torto 0,7° — o único papel torto do site. O título "Neste
   artigo" à mão, na caneta azul (Caveat 600, 26px), fica preso no alto do post-it quando a lista rola
   (tela baixa, artigo com muitas seções). Os itens continuam em IBM Plex; o fio, os vistos, o ponto e o
   sublinhado da seção atual seguem na caneta azul (B05). No amarelo: o fio de base, o anel das seções,
   a divisória e a barra de rolagem passaram a tinta transparente (a `--rule` sumia no amarelo), e
   "NN% lido", os minutos e "Atalhos ?" subiram de `--ink-3` para `--ink-2` (contraste de texto). Por
   quê: é a ideia do Cesar; o sumário deixa de ser "painel de app" e vira o lembrete colado ao lado do
   texto (onde estou, o que já li).
2. **Os vistos à mão** (`vistoDeCaneta` em `traco.ts`): cada seção tem o seu (semente pelo nome), com o
   canto vivo e a perna longa embarrigada, no post-it e na folha do sumário do celular e do tablet (o
   "detalhe discreto" permitido ali; a folha continua folha, com o título em Besley). O traço apagado
   passou a `stroke-dasharray: 1 2` (com "1", a ponta redonda deixava um pingo no começo).
3. **O painel "Do livro" virou a ficha do volume** (lateral; `Sumario.astro`): uma ficha de fichário,
   à caneta preta — "Do livro" (ou "Da série") à mão sobre a **linha vermelha** do cabeçalho; a foto do
   livro (o painel tingido de sempre, com o livro 3D grande, que gira no hover e se amplia pela lupa)
   presa por um **clipe desenhado à caneta** (`clipeDeCaneta` em `traco.ts`: quatro pernas e três
   voltas, com o tremor da mão); e embaixo, na **pauta azul**, os dados **datilografados** em JetBrains
   Mono ("Volume 02 · 6 artigos", de `dadosDoLivro`), o nome e "Ver o livro". A pauta acompanha as linhas
   do texto (24px), com as letras assentadas no fio. O livro e a lupa não mudaram (D39, D46); o anel de
   foco do link fica por dentro da ficha (a ficha corta o de fora). Tela baixa: o livro encolhe a 80%
   (≤ 820px de altura, como antes) e a 70% (≤ 760px, novo), para o post-it caber.
4. **A mesma ficha no fim do artigo** (abaixo de 1300px; `RodapeArtigo.astro`), deitada: título à mão,
   foto com clipe à esquerda, dados na pauta à direita. Dentro da folha do artigo, sem sombra
   (DESIGN.md: caixa dentro de folha não leva sombra). A ficha inteira é o link (borda azul-tinta no
   hover, o livro gira, a seta anda); o livro 3D continua voando para a página do livro no clique. Na
   folha larga (contêiner ≥ 880px), a ficha fica do tamanho de um cartão de anterior/próximo, logo
   abaixo, em vez de uma faixa pautada vazia de lado a lado. No celular estreito (≤ 400px), o livro a
   76% e o nome a 19px; os dados só quebram no ponto ("Volume 02 ·" / "6 artigos").
5. **A cola dos atalhos conversa com a ficha** (`Atalhos.astro`, B06): cantos de 3px, "Atalhos do
   teclado" à mão (preto) sobre a linha vermelha, e cada atalho numa linha azul da pauta, de uma borda à
   outra. Saiu o sublinhado azul animado do título (com a linha vermelha, ficavam duas linhas); o resto
   do B06 (sair de trás do post-it, o meio com o véu, foco, Esc, "Desligar") não mudou.
6. **Tokens novos** (`tokens.ts`, claro e escuro): `--post-it` (`#FFF1BE` / `#39372D`), `--pauta`
   (`#D4DFF3` / `#2C3746`: a caneta a 18% sobre a folha) e `--pauta-cabeca` (`#D6A192` / `#7A594F`: o
   Cuidado a 50%). A sombra do post-it por variável, com a versão escura (`base.css`).
7. **A letra dos títulos à mão** (`src/data/mao.ts`, `src/lib/mao.ts`, `scripts/caveat-titulos.mjs`,
   `src/assets/caveat-titulos.woff`): a Caveat 600 num **subconjunto só com as 18 letras dos quatro
   títulos**, com as alternativas de contexto (`calt`), família própria ("Caveat Titulos", para não se
   misturar com a Caveat das notas), `font-display: swap`, declarada e pré-carregada só nas páginas de
   artigo (e na `/amostra/markdown/` do dev). O script corta a fonte com o `hb-subset` (HarfBuzz, do
   Homebrew, que já vem com o poppler da marca), abrindo e fechando o WOFF só com o zlib do Node; nenhuma
   biblioteca instalada. O tipo `TituloAMao` faz o `astro check` recusar um título fora da lista.
8. **Medição do sublinhado** (`artigo.ts`): com o post-it torto, as caixas da tela desciam o traço uns
   2px no fim das linhas longas; mede-se com ele reto, na mesma tarefa (sem pintar).
9. **Contraste** (`scripts/contraste.mjs`): pares novos — `--ink`, `--ink-2`, `--acento` e `--caneta`
   sobre o post-it (texto, 4,5:1, obrigatório; o menor é `--ink-2`, 5,73:1 no claro e 5,40:1 no escuro),
   a caneta como traço (3:1), o anel das seções (aviso) e a pauta e a linha do cabeçalho (decorativas,
   só avisam). `npm run contraste`: 0 falhas; os 5 alertas são os de antes.

### Custo

- **Fonte:** 10,6 KB (10.616 bytes, WOFF) por visita, em cache depois, só em páginas de artigo — contra
  51 KB da Caveat inteira no latim. Os posts com nota escrita (D48) baixam os dois arquivos (51 + 10,6
  KB). Sem o `calt`, o subconjunto cairia para ~4 KB, com letras repetidas iguais ("Atalhos do teclado"
  tem quatro "a" e três "o").
- **HTML:** uns 2,7 KB a mais por artigo, sem compressão (os vistos à mão, ~1,6 KB contra ~0,5 KB dos
  vistos iguais de antes, e os dois clipes, ~1,6 KB).
- **Movimento:** nenhum novo. Nada anima na entrada; o post-it, a ficha e o clipe são parados. Com
  movimento reduzido, nada muda.

### O que decidi não fazer (e por quê)

- **Carimbo "fontes conferidas":** só com texto verdadeiro. Não há um campo com a data da conferência
  das fontes nem a garantia de que ela foi feita em todos os posts; um carimbo com a data de publicação
  repetiria o topo do artigo. Fica como proposta (campo novo no frontmatter).
- **Abas de fichário nos anos:** o B07 já pôs "Por ano" (com a contagem) no topo de "Todos os artigos";
  com dois anos, as abas repetiriam o índice sem ajudar a navegar.
- **Busca como gaveta de ficheiro:** mexe na busca que nasce do campo (D44, Flip) sem ganho claro de
  uso; ficha de catálogo em cada resultado viraria ruído numa lista.
- **Post-it no celular:** a folha do sumário que desce do cabeçalho continua folha (pedido); só os
  vistos à mão.
- **Fichamento das fontes** (o "## Fontes" como ficha pautada): pensado, não feito — as listas de
  fontes variam muito (parágrafos, grupos em negrito, dezenas de linhas nos guias do Java) e a pauta
  atrás de links longos ficaria pesada.
- Nada de textura, fita, alfinete, café, papel rasgado, quadriculado, máquina digitando ou envelope no
  RSS; livros, código e rodapé intocados.

### Como conferi

MCP `chrome-devtools`, aba própria (`isolatedContext: "papelaria"`, fechada no fim), no dev da 4322:
Jackson (sumário longo, código-fonte), cobrança duplicada (sumário curto, com notas da caneta: as duas
Caveats carregam, cada uma no seu lugar), `java-21` (série: "Da série", "Série · 7 edições"), CronJob e
SIGTERM, a 320, 390, 768, 1280, 1300 × 700, 1440 e 1600px, claro e escuro. Sem rolagem lateral em
nenhuma (a largura do documento é a da janela menos a barra), console sem erros nem aviso de
pré-carregamento, foco visível no link da ficha (por dentro) e na ficha do fim, desenhos com
`aria-hidden` (clipe, vistos, foto do fim), a lupa abre e fecha o livro ampliado, anterior/próximo e a
cola (ao lado do post-it e no meio, com véu) funcionando; um trace da troca "próximo" sem salto do
post-it. `fnm exec --using=24 npm run check`: 0 erros; `npm run contraste`: 0 falhas; um `astro build`
num diretório à parte (apagado depois) confirmou o arquivo da fonte com hash em `/_astro/`. O preview da
4323 não foi tocado (precisa de rebuild para mostrar o C05).

### Arquivos

- Novos: `scripts/caveat-titulos.mjs`, `src/assets/caveat-titulos.woff`, `src/data/mao.ts`,
  `src/lib/mao.ts`.
- Alterados: `src/components/Sumario.astro`, `src/components/RodapeArtigo.astro`,
  `src/components/Atalhos.astro`, `src/lib/traco.ts`, `src/styles/tokens.ts`, `src/styles/base.css`
  (`--font-mao`, `--sombra-post-it`), `src/scripts/artigo.ts` (medição do sublinhado),
  `src/pages/posts/[slug].astro` e `src/pages/[amostra]/markdown.astro` (a fonte), `scripts/contraste.mjs`.

### Para registrar (se o Cesar aprovar)

- `DESIGN.md`: os tokens `post-it`, `pauta`, `pauta-cabeca` no YAML e em Colors; a Caveat dos títulos à
  mão em Typography (estende a D48); em Shapes, a ficha (3px) e o post-it (2px, único torto, 0,7°); em
  Components, o post-it, a ficha do volume e o clipe; em Movimento, a cola sem o sublinhado animado.
- `CLAUDE.md`: `src/assets/` e `src/data/mao.ts` no mapa das pastas; `node scripts/caveat-titulos.mjs`
  nos comandos (título à mão novo = rodar o script); a Caveat nas fontes da stack.
- `docs/decisoes.md`: o C05 na D52 (ou uma D53), com as alternativas acima.
- Aviso do hook do Impeccable ao editar `artigo.ts`: "imagem sem src" na linha do visor (`<img alt="">`
  criada vazia e preenchida pelo script) — falso positivo de antes do C05; não gravei exceção.
