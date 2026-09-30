# Movimento do site: o detalhe de cada animação

Este arquivo guarda o detalhe de cada animação: durações, curvas, ordem e as correções de cada
revisão. As regras gerais de movimento estão no `DESIGN.md` (seção Movimento), que vence em caso de
dúvida. Animação nova ou mudada: a regra vai para lá, o detalhe vem para cá.

## Abertura

- **Abertura do site** (D51, `Abertura.astro`, GSAP; protótipos 01 e 02 de
  `docs/prototipos/animacoes/`): toca **ao chegar de fora e ao recarregar** (o script do `<head>`
  decide), sem movimento reduzido; um clique ou tecla pula. Na home, **a estante se monta (A3)**: a
  caneta risca um fio só onde vai ficar a tábua, na cor `--ink-2` enquanto é traço — a cor da borda
  da tábua quase sumia no escuro (D52, revisão 12) —; o caminho é refeito em pixels, sem
  `vector-effect`, e o fio passa para `--tabua` ao virar a tábua; os livros entram da direita um a
  um (Volume 01 primeiro, 75 ms entre eles, inclinados pelo atrito e assentando) com a contagem da
  coleção embaixo, a estante volta para a folha e o papel esmaece (0,55s). Nas outras páginas, **o
  caderno "cs"** carrega (caneta e contagem até 100), abre e fecha (a capa tem frente e verso) e
  **voa em arco** até pousar na marca do cabeçalho, subindo por baixo dela e inclinando para o lado
  do voo — em linha reta, ele cortava por cima de "Cesar Schutz" (D52, revisão 14); o papel só
  esmaece depois que o caderno passou pelo título, e a marca de verdade entra quando o papel acaba
  de sumir; as folhas da página chegam do fundo (em Categorias, com o desfile e a pilha). Durante
  ela, as transições de CSS ficam desligadas, e a estante não responde ao mouse nem ao foco (sem
  tombar, sem legenda, sem gaveta): o clique nela pula a abertura, em vez de navegar (D52, B12).

## Troca de página

- **Troca de página por folhas** (D51, `src/scripts/troca.js`, embutido no `<head>`; View
  Transitions entre documentos animadas pela Web Animations API, sem biblioteca; protótipo 03, "cai
  da mesa", texto fora): o cabeçalho parado e o traço do menu deslizando; **a mesa fica limpa antes
  de a nova chegar** (D52, A02): as folhas à vista da página antiga caem da mesa em 0,38s (cascata
  de 0,06s, de baixo para cima, acelerando desde o começo; a que tinha o livro que voa, primeiro) e
  começam a esmaecer 80ms depois de começar a cair, sumindo ainda em queda; os textos soltos sobem
  10px e somem (200 ms). As da nova já começam o voo em 0,04s, ainda transparentes, mas só aparecem
  a partir de 0,24s — com as antigas quase sumidas —, com a opacidade em 170ms, ease-out (D52,
  revisão 2: antes, a opacidade começava junto com o voo, linear em 280ms, e sobrava 0,1 a 0,2s de
  mesa vazia no meio); pousam em 1s (`cubic-bezier(.25,1,.5,1)`, 85 ms entre elas, pela posição na
  tela, e a última no máximo 0,5s depois da primeira; textos novos sobem por uma máscara; a troca
  inteira, ~1,6s, ~0,2s mais curta que antes). Voltando pelo histórico, as novas vêm da frente; da
  memória do navegador (bfcache), sem troca. Livros à vista com par nas duas páginas voam por cima
  das folhas (só o livro viaja, protótipo 07), sem esmaecer de uma imagem na outra; a folha de
  destino só esmaece. Quando as duas pontas têm o mesmo livro 3D (D52, B10, ex.: Categorias ↔ a
  página do livro), voa só a imagem nova, que continua o giro de onde estava (do hover para o
  parado) até o giro de parado (0,75s, pegar e pousar); nunca duas imagens do livro ao mesmo tempo.
  Em Categorias, o livro chega no desfile, sem voar. Artigo anterior e próximo: **na pilha**
  (protótipo 06); o atual esmaece e afunda 10px sob a folha nova, entre 0,14s e 0,4s, e some antes
  do pouso dela (D52, A03); o rodapé do site sai em 90ms, ease-out, não em 200ms (D52, revisão 3:
  senão fica nítido por cima do título novo, com a página rolada até o fim); a lateral nova (com o
  livro dela) só entra em 220ms, quando a antiga já está quase fora (D52, revisão 9); o desenho do
  topo do artigo começa com a folha quase pousada — em 420ms no próximo e 300ms no anterior
  (`cs:pousou`, D52, revisão 8) —, em vez de esperar o fim da troca. Categorias: **desfile e pilha**
  (protótipo 04, script da página; o desfile espera o GSAP por no máximo 1,8s, D52, B14). Tag:
  **desfile direto** (60 ms). O desenho do topo do artigo se desenha **depois de pousar** (protótipo
  08, a sequência do C1, ~2,1s), a partir de 60% da chegada da folha dele. A troca de livro pela
  pilha e a navegação com um diálogo aberto usam a folha de antes (a antiga sobe 6px e some, a nova
  sobe 18px).
- **Carregando, quando a página demora** (D52, B14): regras de especulação do navegador
  (`speculationrules`, JSON no `<head>`, sem biblioteca) pré-carregam o HTML dos links ao parar o
  ponteiro sobre eles (0,2s) ou ao toque. Se a página nova ainda assim não vem em 0,2s desde o
  clique, a caneta azul da leitura escreve um traço no fio do cabeçalho, cada vez mais devagar, até
  ela chegar; nunca um spinner. A caneta tem nome de transição próprio e esmaece em 0,2s ao sumir
  (D52, revisão 13; antes, ela ficava na raiz antiga, que a troca por folhas esconde de uma vez).
  Quando a espera passou de 0,7s (antes, 1s; D52, revisão 7), quando o aparelho não deu conta de uma
  troca anterior nesta visita ou com pouca memória, a chegada é curta: as folhas antigas só somem,
  as novas sobem 12px e aparecem juntas, e o livro voa mais rápido (sem o desfile, em Categorias).
  Se uma troca desta visita levou mais de 0,3s entre a resposta e a primeira pintura (CPU ou rede
  lentas), a seguinte já mostra a caneta **no clique**, sem esmaecer e com um traço começado, em vez
  de deixar a tela parada sem sinal nenhum (D52, revisão 7).

## Estante e gaveta

Regras comuns dos livros em movimento (D40: GSAP sob demanda, só transformações e opacidade,
o foco do teclado igual ao mouse, Esc fecha, movimento reduzido): `DESIGN.md`, Movimento.

- **A estante de verdade (D49, `estante-gesto.ts`):** **nada flutua**: o livro ou está apoiado na
  prateleira, ou está na mão. A prateleira tem perspectiva (o olho a 45% da altura, 1400 de
  distância na estante cheia, proporcional nas menores), e cada lombada tem a **cabeça** (o topo das
  páginas, `.cabeca`), que só aparece quando o livro tomba para a frente.
- **O toque na cabeça** (home e filtro, só com mouse; D49, no lugar da subida de 16px da D47): o
  livro sob o mouse tomba **5°** para a frente pela borda de baixo (0,3s, `power2.out`) e cai de
  volta em pé ao sair (0,3s, `power2.in`); os vizinhos não se mexem. Embaixo, a legenda com o nome e
  a contagem (`estante-viva.ts`). O foco do teclado faz o mesmo.
- **Estante em repouso** (só a home): depois de 3s sem mouse, toque, tecla ou rolagem, com a estante
  ao menos metade visível e a aba ativa, a cada 4 a 7s um livro sorteado é tocado na cabeça (7°,
  0,55s), espera 0,5s e cai de volta, assentando. Qualquer interação para tudo e devolve o livro ao
  lugar. Desligada com movimento reduzido.
- **Tirar da estante** (a gaveta da home, `Gaveta.astro`, D43, D49): no clique, toque ou Enter, o
  livro tomba pela cabeça **dentro do próprio vão** (24°, 0,28s, `power2.out`; a inclinada se
  endireita junto) e só então **vem para a frente** (a profundidade inteira do livro, voltando a 6°,
  0,32s, `power2.inOut`), um nada erguido para o pé não passar da tábua. Aí o **vizinho da
  direita**, sem apoio, **tomba até encostar no outro** (o ângulo sai da geometria das lombadas;
  acelera como queda, bate e assenta); não tombam a inclinada, o primeiro da fileira nem a série
  sozinha. Na frente dos outros, o livro 3D da gaveta toma o lugar da lombada (mesma altura e
  largura) e anda até a gaveta girando até **38°** da frente (0,9s, `power3.inOut`), **fechado**,
  com a lombada bem à vista; a gaveta cresce enquanto isso. Ao pousar, o sumário ao lado aparece
  subindo 8px (0,35s) e a lupa, por opacidade. No celular, tudo 20% mais rápido.
- **Guardar** (Fechar livro, Esc ou a mesma lombada): o livro 3D volta até a frente do lugar dele
  girando de volta para a lombada (0,6s), **entra na prateleira empurrando o vizinho** de volta
  (0,4s; o vizinho sai do encosto sem quicar) e assenta (1px); a inclinada volta a se apoiar no
  aparador. **Trocar de livro guarda o aberto antes de tirar o outro.**
- **Puxar pela cabeça** (só com mouse, Draggable e InertiaPlugin): arrastar a cabeça para baixo
  tomba o livro até 30°; a partir de 22°, ele se solta, vem para a frente e segue o mouse. Solto
  abaixo da prateleira (a velocidade do arremesso conta), vai para a gaveta; solto no ar, volta para
  o lugar; sem chegar a 22°, cai de volta em pé. Só clicar faz o gesto inteiro sozinho.
- Com **movimento reduzido**, o livro aparece na gaveta, o lugar dele fica vazio e o vizinho já
  aparece tombado; guardar devolve tudo na hora.
- **Gaveta** (D47): cresce (0,8s) com o conteúdo de baixo descendo junto; recolhe ao fechar; na
  troca de livro, vai da altura de um para a do outro (0,55s).

## Pilha

- **A pilha com peso** (a pilha lateral, D46, D49): ao passar o mouse (ou com o foco), o livro sai
  8px (0,3s, `power2.out`) e o bloco de cima vai junto 1,5px pelo atrito (0,4s); volta sem mola
  (0,32s, `power3.out`). O livro aberto no topo não está na pilha, e a pilha guarda em cima o espaço
  dele (`--folga`). Ao clicar, **primeiro o aberto é guardado**: vira de lado (0,3s, `power2.in`),
  voa até a pilha deitando-se (0,7s, `power3.inOut`), desce por gravidade (0,22s, `power2.in`),
  afunda 1px e para; **depois o escolhido é puxado** (até sair inteiro, `power2.in`, 0,12 a 0,54s),
  com o bloco de cima indo junto 3px, tombando sobre a quina quando a ponta do puxado passa do
  centro de massa dele (até 25°) e caindo no lugar com um baque de 1px. Aí a página nova abre, e a
  View Transition leva só o puxado até o topo. Com mouse, dá para puxar devagar (Draggable): solto
  depois da metade, sai; antes, volta perdendo velocidade. No celular, 20% mais rápido e sem
  arrasto. **Revisto na D52 (B01, B09):** a troca por trás de Categorias virou uma sequência só
  (~2,3s, antes ~3,7s): o aberto gira até a lombada e voa num arco até a pilha, deitando-se no
  caminho; o escolhido é puxado e, com o embalo do puxão, segue em arco até o palco, ficando em pé e
  girando ainda na descida; o livro no ar é o livro 3D inteiro, numa camada própria, com sombra que
  cresce com a altura e some no pouso; a página antiga já toma a cor, o texto e a pilha da nova
  antes de abrir; o GSAP que gira `.livro-3d` desliga antes a transição CSS do palco
  (`[data-livro-gira]`). No celular e no tablet (sem o voo, com o topo fora da tela), o painel corta
  a lombada puxada na borda da folha (`.painel-home { overflow-x: clip }` abaixo de 1100px, D52,
  revisão 1: sem isso, o documento alargava no fim do puxão e a View Transition entre páginas era
  abortada); a lombada guardada só leva o nome de transição quando há voo — sem ele, ela sai com a
  pilha e o livro chega com a própria folha, sem o morph lombada → livro em pé (D52, revisão 15).

## Livro que gira e livro ampliado

- **Livro que gira** (D46, `data-livro-gira`, só CSS): na grade de categorias e séries, no topo da
  página do livro e no destaque de Séries, o livro vira de 38° para 24° ao passar o mouse (0,5s). Na
  ficha "Do livro" do artigo, o livro é uma foto parada desde a D57. A capa que seguia o mouse, com a luz e a capa entreaberta (`capa-viva.ts`,
  D40), saiu na D46.
- **O livro que abre** (o livro ampliado, D49, no lugar do giro com embalo): a capa gira pela
  lombada (0,95s, `power2.inOut`; no celular, 0,71s) e, ao pousar, bate e volta um nada (0,07s e
  0,12s); o livro vira de 38° para de frente enquanto abre, e a lombada vai para o meio. Junto, a
  vista de um pouco acima (D57) se endireita (`--aberto`, de 0 a 1 com a capa): aberto, ele fica de
  frente, sem o alto à mostra, com a sombra do chão saindo e, no último quinto da abertura, a guarda
  da contracapa chegando atrás das folhas da direita (as duas capas passam o miolo). A folha é
  leve: vira em 0,75s (`sine.inOut`), com a metade de fora até 24° atrás da de dentro (a folha curva
  no meio da virada e chega reta) e uma sombra de até 22% no meio do caminho. Arrastar segue o dedo
  e, ao soltar, a inércia leva a folha até aberta ou fechada (0,25 a 0,7s; a capa, até 0,9s), sem
  passar do fim. Fechar o visor com o livro aberto: as folhas voltam juntas e a capa por cima
  (0,6s), e só então o livro volta para o de origem. No celular, as folhas viram retas e a vista
  corre para a página da vez (0,45s). O diálogo em si não esmaece ao abrir nem ao fechar — só o véu;
  o livro de origem (painel ou lombada) só some quando a cópia grande já está por cima dele, e só
  reaparece um instante antes de o diálogo fechar, para não haver um quadro vazio nem uma piscada
  (D52, revisão 6). As páginas não mudam com o tema (papel e tinta de papel).
- **Livro ampliado** (D47): cresce do livro de origem (0,7s, `power3.inOut`) e volta para ele ao
  fechar (0,55s), girando de volta a 38°, com o véu clareando.

## Home: destaque e assinatura

- **O desenho do destaque da home** (D41, só ali): ao entrar na tela, os traços aparecem em
  sequência com DrawSVG (1,1s cada, sequência de até ~1,2s), depois a cor, a hachura (0,6s) e os
  textos (0,4s); tracejados só por opacidade. Desde a D52 (C02), o destaque é o primeiro card ou
  item de "Artigos recentes" (não um bloco à parte): o desenho corre uma vez por página, na forma à
  vista (cards ou lista), e a outra forma já aparece pronta ao trocar.
- **A assinatura** (D52, C04, `src/lib/traco.ts`, `assinaturaDeCaneta`): na home, embaixo de
  "Schutz", um traço de largura variável (contorno preenchido; entra fino, engrossa no meio e sobe
  afinando no fim) — o único traço grande do site, identidade e não enfeite. Com a abertura, espera
  escondido e é escrito da esquerda para a direita em 0,9s, depois que os cadernos terminam de
  acenar (B13); sem a abertura (andando pelo site), já está pronto; com movimento reduzido, aparece
  pronto. No celular (390px), a home não mostra o nome grande, então não há assinatura ali.

## Cabeçalho, marca e tema

- **Marca "cs"** (D41, D47, só CSS): no hover ou foco, a capa entreabre 38° sobre as páginas (0,5s),
  mostrando o miolo creme e pautado do caderno (D52, A01: papel `--marca-letra` com a pauta
  `--caderno-pauta`, igual nos dois temas). A fita saiu na D47; o "c" fica acima e o "s" abaixo, em
  degrau. **O aceno do fim da abertura** (D52, B13): depois que o desenho do destaque termina
  (`cs:desenhou`), o caderno do cabeçalho e o caderno grande da abertura abrem e fecham juntos, uma
  vez, com a mesma curva do hover (a classe `acena`); o que estiver sob o mouse continua aberto. Sem
  desenho no destaque, o aceno vem 0,4s depois do fim da abertura. **No hover do cabeçalho** (D52,
  C04), junto com a capa que entreabre, um traço curto de caneta preta passa embaixo do "blog" (só
  ali; o livro não se risca).
- **Cabeçalho no celular** (até 860px, D46): sempre à vista. O botão de menu abre as seções numa
  folha que desce do cabeçalho por `clip-path` (0,46s), com os itens chegando em sequência (8px,
  50ms entre eles) e um véu de 32% sobre a página; fecha mais rápido (0,34s). **Nenhum livro cai**
  (o tombo do livro inclinado saiu na D35) e **nenhum texto muda de cor**. Sem animação de entrada
  nas seções.
- **Troca de tema** (D42, D44): indo para o escuro, o escuro se espalha em círculo a partir do botão
  (0,55s); voltando ao claro, o escuro se fecha de fora para dentro até sumir no botão (a mesma
  curva, ao contrário). View Transition do próprio documento (tipos "tema" e "tema-fecha",
  `trocarTema` em `tema.ts`); a página inteira vira de uma vez (os livros perdem o nome de transição
  durante a troca). O botão fica por cima do círculo, e o ícone anima (D49, reabre a D44): indo para
  o escuro, a lua se enche até virar o miolo do sol (MorphSVG, 0,4s, `power2.inOut`) e os raios
  giram de -30° a 0° e se escrevem de dentro para fora (DrawSVG, 0,22s, 0,03s entre eles); voltando
  ao claro, os raios recolhem (0,15s) e a lua é "mordida" de volta. No hover, o sol gira 22° e a lua
  balança 14° (0,5s). A faixa de luz da estante em repouso saiu (D44). **Desde a D52 (C04):** o
  botão perdeu a borda de CSS (um contorno a lápis no lugar dela) e a lua e o sol são desenhos da
  caneta preta (`luaDeCaneta`, `solDeCaneta`, `traco.ts`); a lua passou a correr no sentido do miolo
  (sem o rabisco fino do meio) e o círculo do hover fica desenhado durante a troca, em vez de se
  apagar e se escrever de novo.
- **A caneta que navega** (D49, `traco.css`, `src/lib/traco.ts`): a seção atual do menu é sublinhada
  por um traço de caneta (2,2px, azul-tinta), torto de um jeito próprio em cada item e sempre igual;
  na troca de página, ele desliza de um item para o outro (View Transition `traco-do-menu`, 0,42s);
  sem par, se escreve (0,38s) ou some pela direita (0,2s). No menu do cabeçalho, o mouse escreve um
  traço leve **preto** (1,5px, 55%, D52, C04) da esquerda para a direita (0,32s) e, ao sair, ele
  termina de passar e some pela direita (0,22s); os links do rodapé continuam com o mesmo traço leve
  **azul**, como antes da D52 (ali é a navegação de sempre, não a caneta nova). No celular, o traço
  da seção atual se escreve quando a folha do menu termina de descer. A lupa inclina 14° no hover, a
  tecla ⌘K afunda 1,5px por 120ms quando é usada e o campo dá um toque (98,5% para 100%) quando a
  busca nasce dele. No rodapé, os arcos do RSS se escrevem a partir do ponto, um depois do outro
  (0,18s cada).
- **Caneta da leitura** (D45, `BarraLeitura.astro`): o traço do progresso corre sobre o fio do
  cabeçalho e a caneta acompanha a ponta, ligada à rolagem (sem animação própria; só a caneta
  aparece por opacidade, 0,2s). No celular, o traço acompanha o cabeçalho que some e volta (`top`,
  0,25s).

## Busca

- **A busca nasce do campo** (D44, `Busca.astro`, GSAP com Flip sob demanda): com clique, ⌘K ou
  Ctrl+K (o "/" saiu na D52, B06: em muitos teclados é a mesma tecla do "?" dos atalhos), a janela
  cresce a partir do campo do cabeçalho (no celular, do ícone) em 0,5s (`power3.out`), o conteúdo
  aparece depois de 0,2s e o véu escurece junto (`@starting-style`). Os resultados entram em
  sequência (0,3s, `stagger` 0,035s) e o termo buscado ganha um marca-texto que se estica em 0,45s,
  também no título do resultado. Esc, "Fechar" ou clique fora encolhem a janela de volta para o
  campo (0,35s, `power2.in`), e o foco volta para ele. Um marcador só (o fundo e o fio azul) desliza
  até o resultado da vez com as setas, o foco e o mouse (0,28s, `power3.out`, D49). Sem resultado, o
  termo ganha a ondinha de revisor na cor de Cuidado (0,45s) e a saída chega depois.

## Listas, filtro, cards e tags

- **Filtro por livro** (D47): a lista esmaece (0,18s) e os primeiros artigos chegam subindo (0,42s,
  40ms entre eles). O total e o de cada ano rodam como contador já no clique (D49, `contador.ts`):
  cada algarismo numa fita (0,55s, `power3.out`, as dezenas 0,05s depois), e a coluna que sobra
  fecha a largura (0,4s).
- **Troca Lista / Cards** (D42): a forma atual esmaece (0,12s) e a nova aparece subindo 8px (0,22s),
  com a Web Animations API (`SeletorModo`). Sem Flip e sem cascata nos cards. O azul do botão ativo
  é uma tinta só que escorre de um botão para o outro (D49): a borda da frente corre (0,2s,
  `power2.in`) e a de trás alcança (0,28s, `power3.out`); o texto troca de cor no meio (0,16s).
- **A caneta que marca** (D49, com mouse ou foco; `traco.css`): no hover de um artigo da lista, um
  colchete **preto** (D52, C04) na margem esquerda se escreve de cima para baixo (0,34s) e, ao sair,
  some por baixo (0,2s); nos números da paginação e no GitHub e no LinkedIn do cabeçalho, um círculo
  **preto** à mão (D52, C04; uma volta e 8%, 0,42s, `power2.inOut`) que some pela ponta ao sair
  (0,2s). As setas de "Anteriores" e "Mais artigos" avançam 3px no hover e, no clique, saem pela
  frente e voltam por trás (0,32s).
- **O ícone de tag inclina** (D52, B11) no hover ou no foco: 6° no cartão de `/tags/`, 8° na pílula
  (`PilulaTag`), 0,35 a 0,45s; parado com movimento reduzido.
- **A caneca** (D52, C04, classe `fumaca`): no hover do card, do item da lista ou do topo de um post
  da série Java, a fumaça de agora sobe e some pelo alto e uma nova se escreve de baixo (1,15s, a
  segunda 0,12s depois), uma vez; com movimento reduzido, a fumaça fica parada. O emblema da revista
  (a xícara da capa e da lombada) não anima: é livro, não caneta.

## Artigo

- **A ficha dos atalhos** (D52, B06, `Atalhos.astro`; só no artigo): a tecla do "?" (com ou sem
  Shift) abre a ficha, nunca a busca. Com o sumário lateral (≥ 1300px), ela sai de trás da folha do
  sumário e pousa ao lado, sem escurecer a página (0,34s, a curva da escrita do menu; volta em
  0,2s); sem a lateral, no meio da tela, com o `--veu` a 55%, subindo 10px (0,22s). O título,
  sublinhado à caneta azul (0,42s). Desligar os atalhos desliga também o "?" (WCAG 2.1.4).
- **Os minutos que faltam** (D49, sumário): rodam como contador quando mudam (0,4s); no fim, "faltam
  1 min" sobe e some e "chegou ao fim" sobe de baixo (0,3s).
- **O artigo de perto** (D49, protótipo E3, só CSS e Web Animations): nos links do texto, a tinta
  azul sobe de baixo até 42% da linha (0,3s, `--link-tinta`); o Copiar do código e o "Copiar link"
  fazem o mesmo gesto (a folha da frente do ícone desliza sobre a de trás em 0,16s, ou os elos se
  juntam; o visto da caneta em 0,3s; o rótulo rola letra por letra, 12ms entre elas, e a largura
  acompanha em 0,35s; em 1,6s, tudo volta); em anterior e próximo, a seta abre o próprio espaço
  (0,3s) e o canto de fora dobra (a orelha, 0,26s); o voltar ao topo entra subindo 14px e assenta
  (0,4s, a curva do back.out em `linear()`), sai em 0,25s e, no clique, a seta sai por cima e volta
  por baixo (0,44s).

## A 404

- **A 404** (D49): a folha da abertura da home, com o erro e a estante; a caneta rasura o endereço
  (0,35s e 0,25s, 0,3s depois de abrir) e, quando dá, a sugestão chega depois (0,3s).
