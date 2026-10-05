# Movimento do site: o detalhe de cada animação

Este arquivo guarda o detalhe de cada animação: durações, curvas, ordem e as correções de cada
revisão. As regras gerais de movimento estão no `DESIGN.md` (seção Movimento), que vence em caso de
dúvida. Animação nova ou mudada: a regra vai para lá, o detalhe vem para cá. Quem conta é o código:
na dúvida sobre um número, vale o comentário do componente ou do script citado.

O detalhe das peças que saíram (a gaveta da home, a estante em repouso, a pilha lateral, o tema em
círculo, a abertura com a tábua) está em `docs/historico/movimento-ate-2026-10-04.md`.

## Abertura

- **Abertura do site** (D51; refeita na rodada 4 da D61, A1, E3 e E12, e na D84; `Abertura.astro`,
  GSAP; protótipos 01 e 02 de `docs/prototipos/animacoes/`): toca **ao chegar de fora e ao recarregar**
  (o script do `<head>` decide e põe `data-abertura` no `<html>`; se este script não assumir, ele o
  tira sozinho em 7s), sem movimento reduzido. Um clique, uma tecla ou a roda pulam para o fim: o nome
  à vista, a assinatura escrita, o carimbo no lugar, as luzes acesas, sem aceno, sem onda e sem brilho.
  Durante ela, as transições de CSS ficam desligadas, e a estante não responde ao mouse nem ao foco: o
  clique nela pula a abertura, em vez de navegar (D52, B12).
- **Na home**, em segundos desde o primeiro risco (`A1` no script; uma folha de papel cobre a página e a
  coleção de verdade vai para o meio da tela, levantada por cima dele):
  1. **0 a 0,28:** a caneta risca o fio da aresta da lâmina de vidro, da esquerda para a direita; com
     várias prateleiras (D84), uma linha por prateleira, de cima para baixo, e cada uma a mais empurra o
     resto 0,12s. A caneta sai girando e some (0,22s);
  2. **0,26 a 0,66:** as lâminas aparecem, crescendo do fio (0,4s), e os abajures, apagados;
  3. **0,62 a ~1,80:** os livros chegam um a um pela direita (85ms entre eles, 0,5s cada, `power3.out`;
     no celular, 80ms e 0,48s), inclinados pelo atrito e assentando um nada além do prumo, com a
     contagem embaixo ("Volume 01"… "Série");
  4. **~1,82 a ~2,26:** os livros param e os dois cadernos ("cs" do cabeçalho e o grande) acenam; a
     coleção desce para o lugar dela (0,44s, `power3.inOut`) e o papel sai (0,4s);
  5. **~1,96 a ~2,41:** o nome gigante entra da direita para a esquerda: a capa de papel, com a frente
     desfocada, anda e o descobre (0,45s, `power2.inOut`);
  6. **~2,46:** a abertura acaba, num momento parado (o quadro mais pesado, quando o CSS dela sai, não
     cai em cima de nada que corre);
  7. **~2,62:** a assinatura se escreve (0,7s, 0,8s depois do aceno, quando a capa dos cadernos começa
     a fechar) e, quando ela acaba (1,45s depois do aceno), o "blog" carimba sobre o Z (D84; 0,42s: desce
     a 1,6×, girado, passa um nada do tamanho e assenta em −13°);
  8. **~2,62 a ~4,9:** as luzes acendem uma a uma; depois, só a onda de molas e, depois dela, só o
     brilho (`estante-moderna.ts`, abaixo).
- **Chegando à home por dentro do site** (pela cortina): os cadernos acenam e a assinatura se escreve
  logo que a página chega (`cs:chegou`), com o carimbo depois dela; o CSS esconde a assinatura desde a
  primeira pintura (`data-vai-chegar`).
- **Nas outras páginas, o caderno "cs"** carrega (caneta e contagem até 100), abre e fecha (a capa tem
  frente e verso) e **voa em arco** até pousar na marca do cabeçalho, subindo por baixo dela e
  inclinando para o lado do voo (0,6s) — em linha reta, ele cortava por cima de "Cesar Schutz" (D52,
  revisão 14); o papel só esmaece depois que o caderno passou pelo título, e a marca de verdade entra
  quando o papel acaba de sumir; as folhas da página chegam do fundo (em Categorias, com o desfile e a
  pilha da página).

## Troca de página

- **A cortina** (D61, rodada 3, T2; `troca.js`, `suave.css`): por dentro do site, a troca é a cortina
  azul-tinta com o nome do destino (no escuro, o papel claro com o texto azul). No relógio da troca:
  entra até 0,38s, segura até 0,62s e sai pelo alto até 0,98s (aos 0,62s, o evento `cs:cortina-saindo`
  avisa quem chega). **Por baixo dela** (rodada 4, A3), a montagem das folhas: as novas vêm do fundo e da
  direita, levemente giradas, em perspectiva, e pousam; começam aos 0,45s, ainda cobertas, voam 0,95s
  (`cubic-bezier(0.2, 0.72, 0.28, 1)`) e se espalham no máximo 0,15s: a última pousa por volta de 1,55s.
  Em Livros, o desfile começa ainda coberto, aos 0,42s, e assenta até 3,5s do clique; em Tags, as fichas
  acima da dobra chegam jogadas do alto à direita a partir de 0,36s (40ms entre elas, no máximo 0,16s
  entre a primeira e a última, 0,76s cada).
- **Troca de livro** (a fileira do topo da página do livro, rodada 2, G7): o livro grande volta para o
  vão dele na fileira e o escolhido desce para o painel; a fileira não acende de novo.
- **Troca de página por folhas** (D51, protótipo 03, "cai da mesa", texto fora; View Transitions entre
  documentos animadas pela Web Animations API, sem biblioteca): desde a cortina, vale no anterior e no
  próximo do artigo e onde a página pede. O cabeçalho fica parado e o traço do menu desliza; **a mesa
  fica limpa antes de a nova chegar** (D52, A02): as folhas à vista da página antiga caem da mesa em
  0,38s (cascata de 0,06s, de baixo para cima, acelerando desde o começo; a que tinha o livro que voa,
  primeiro) e começam a esmaecer 80ms depois de começar a cair, sumindo ainda em queda; os textos soltos
  sobem 10px e somem (200 ms). As da nova já começam o voo em 0,04s, ainda transparentes, mas só
  aparecem a partir de 0,24s — com as antigas quase sumidas —, com a opacidade em 170ms, ease-out (D52,
  revisão 2); pousam em 1s (`cubic-bezier(.25,1,.5,1)`, 85 ms entre elas, pela posição na tela, e a
  última no máximo 0,5s depois da primeira; textos novos sobem por uma máscara; ~1,6s ao todo).
  Voltando pelo histórico, as novas vêm da frente; da memória do navegador (bfcache), sem troca.
- **Os livros que voam:** livros à vista com par nas duas páginas voam por cima das folhas (só o livro
  viaja, protótipo 07), sem esmaecer de uma imagem na outra; a folha de destino só esmaece. Quando as
  duas pontas têm o mesmo livro 3D (D52, B10, ex.: Livros ↔ a página do livro), voa só a imagem nova,
  que continua o giro de onde estava (do hover para o parado) até o giro de parado (0,75s, pegar e
  pousar); nunca duas imagens do livro ao mesmo tempo. Em Livros, o livro chega no desfile, sem voar.
  Da coleção da home, o voo parte da pose da doca (D84).
- **Artigo anterior e próximo: na pilha** (protótipo 06): o atual esmaece e afunda 10px sob a folha
  nova, entre 0,14s e 0,4s, e some antes do pouso dela (D52, A03); o rodapé do site sai em 90ms,
  ease-out (D52, revisão 3: senão fica nítido por cima do título novo, com a página rolada até o fim; na
  D84, ele também esmaece na troca); a lateral nova (com o livro dela) só entra em 220ms, quando a
  antiga já está quase fora (D52, revisão 9); o desenho do topo do artigo começa com a folha quase
  pousada — em 420ms no próximo e 300ms no anterior (`cs:pousou`, D52, revisão 8).
- **Categorias: desfile e pilha** (protótipo 04, script da página; o desfile espera o GSAP por no máximo
  1,8s, D52, B14). **Tag: desfile direto** (60 ms). O desenho do topo do artigo se desenha **depois de
  pousar** (protótipo 08, a sequência do C1, ~2,1s), a partir de 60% da chegada da folha dele. A
  navegação com um diálogo aberto (busca, livro ampliado) e o movimento reduzido usam a folha de antes
  (a antiga sobe 6px e some, a nova sobe 18px).
- **Carregando, quando a página demora** (D52, B14): regras de especulação do navegador
  (`speculationrules`, JSON no `<head>`, sem biblioteca) pré-carregam o HTML dos links ao parar o
  ponteiro sobre eles (0,2s) ou ao toque. Se a página nova ainda assim não vem em 0,2s desde o clique, a
  caneta azul escreve um traço no fio do cabeçalho, cada vez mais devagar, até ela chegar (ela continua
  azul; a caneta da leitura passou à cor do livro na D58); nunca um spinner. A caneta tem nome de
  transição próprio e esmaece em 0,2s ao sumir (D52, revisão 13). Quando a espera passou de 0,7s (D52,
  revisão 7), quando o aparelho não deu conta de uma troca anterior nesta visita ou com pouca memória,
  a chegada é curta: as folhas antigas só somem, as novas sobem 12px e aparecem juntas, e o livro voa
  mais rápido (sem o desfile, em Livros). Se uma troca desta visita levou mais de 0,3s entre a resposta
  e a primeira pintura (CPU ou rede lentas), a seguinte já mostra a caneta **no clique**, sem esmaecer e
  com um traço começado (D52, revisão 7).

## Estante, doca e livros

Regras comuns dos livros em movimento (D40: GSAP sob demanda, só transformações e opacidade, o foco do
teclado igual ao mouse, Esc fecha, movimento reduzido): `DESIGN.md`, Movimento.

- **A chegada das fileiras com abajures** (D61, linha 18 e rodada 4, A1; `estante-moderna.ts`, Web
  Animations API): na coleção da home, na fileira do topo da página do livro e na estante de lombadas
  (o filtro e a 404), quando a fileira pousa (`cs:chegou`, ou na carga) e está à vista, **uma coisa de
  cada vez**: (1) os abajures acendem um a um, da esquerda para a direita, 60ms entre eles, com a curva
  da lâmpada do lustre (`lampada.ts`: a brasa da boca primeiro, o feixe com a poça logo depois, o branco
  quente por último, com o tremor do contato nos primeiros 150ms); (2) só na home, a onda de molas: cada
  livro sobe 6px e volta com a mola do hover (0,5s), 45ms depois do vizinho da esquerda; (3) só o
  brilho: a faixa de luz desce cada livro, um depois do outro (`livro-vivo.ts`, `ondaNaFileira`), quando
  a última mola acabou. Tudo nasce no mesmo instante, com atrasos, para a ordem valer com a CPU lenta.
  Uma vez por carga e por fileira; na home chegando de fora, quem chama é a abertura (`data-conduzida`).
  Com movimento reduzido, as luzes já nascem acesas e nada se mexe.
- **A doca da coleção da home** (D78, 04/10/2026, `doca.ts`; pedido do Cesar: "tipo o dock do Mac"; por
  prateleira desde a D84): só com mouse e sem movimento reduzido. O livro sob o mouse cresce até
  **1,14×** (era 1,5× quando os livros eram pequenos), de pé, pela base (a `.tomba`), e os vizinhos da
  mesma prateleira crescem menos, por um sino de cosseno de **2,2 lugares** para cada lado, medido do
  mouse ao meio de cada lugar. A prateleira abre espaço como a doca: cada livro anda para o lado com a
  soma do que os de antes cresceram, e os vãos fecham por igual o que ela cresceu, para não passar de onde
  vai o texto (as pontas saem no máximo 10px). O maior fica por cima (o `z-index` da `.tomba`). O
  crescimento para cima cabe no teto do lugar (onde fica o abajur). Segue o mouse de
  perto, sem mola (24% do caminho a cada 1/60 s, pelo tempo do quadro), e volta ao repouso no mesmo
  ritmo ao sair. No clique, a doca para onde está, e a viagem até a página do livro parte do tamanho
  que o leitor vê (D84: soltar tudo no clique fazia o livro encolher 14% e os vizinhos pularem antes do
  voo); voltando pelo histórico, ela volta ao repouso. O hover do livro vivo (a mola, o seguir o mouse)
  continua por dentro.
- **O livro vivo** (D61, rodada 3, T9, T11 e T14; `livro-vivo.ts`, `livro-vivo.css`): todo livro 3D
  do site. No hover (ou no foco, ou com o dedo em cima), o livro gira de 38° para 20°, sobe uns 6px e
  inclina −2° no plano, com a mola do 04 (passa uns 7% do alvo e volta); a saída é sem mola (0,4s,
  `power2.out`). Com o mouse, ele acompanha o ponteiro (até ±6° num eixo e ±4° no outro, a partir do
  giro da vez, com atraso de uns 90ms) e volta ao repouso em ~0,45s. Sem brilho no hover (rodada 4, H4:
  a luz quente amarelava o livro). Com movimento reduzido, fica parado a 38°.
- **O brilho nas lombadas** (D61, rodada 3, T4; `luz.ts`, `luz.css`): a camada do reflexo entra na
  lombada na primeira vez que o mouse passa nela, ou que ela recebe o foco; com movimento reduzido, só o
  foco a acende. A mancha quente que seguia o mouse pela página saiu em 04/10/2026 (D67).
- **A fileira do topo que encolhe** (D61, rodada 3, área 4, G7; `FileiraTopo.astro`): a partir de
  861px, a fileira gruda sob o cabeçalho e encolhe para 60% ao rolar; a folha clara atrás dela aparece no
  fim do encolher. Só CSS ligado à rolagem, só `transform` e `opacity` (a rolagem não é sequestrada).
  Abaixo de 861px, não gruda. Com movimento reduzido, não gruda nem encolhe.
- **A estante de verdade** (D49; `Estante.astro`, `estante-viva.ts`): **nada flutua**: o livro ou está
  apoiado na prateleira, ou está na mão. A prateleira tem perspectiva (o olho um pouco acima dos livros,
  D57; medidas no `CAPAS.md`, "Estante"), e cada lombada tem a **cabeça** (o topo das páginas,
  `.cabeca`), que só aparece quando o livro tomba para a frente. O repouso de cada lombada (em pé; a
  escolhida no filtro, 10px acima) é escrito pelo GSAP, sempre em 3D (`force3D`, a constante `REPOUSO`
  do script): no Safari do celular, a lombada girada só em 2D, dentro da prateleira em 3D, perdia o
  desenho (D54).
- **O toque na cabeça** (o filtro de Todos os artigos e da tag, e a 404; só com mouse; D49, no lugar da
  subida de 16px da D47): o livro sob o mouse tomba **5°** para a frente pela borda de baixo (0,3s,
  `power2.out`) e cai de volta em pé ao sair (0,3s, `power2.in`); os vizinhos não se mexem. Embaixo, a
  legenda com o nome e a contagem. O foco do teclado faz o mesmo. A estante **não se mexe sozinha** com a
  página parada (rodada 4, H11: o livro sorteado tocado na cabeça a cada 4 a 7s saiu).
- **A contracapa** (D78, 04/10/2026, `LivroAmpliado.astro`): no livro ampliado fechado, "Virar o livro"
  gira o livro de 38° a 167° (o `rotationY` do `.livro-3d`, GSAP, 1,15s, `power2.inOut`), passando pela
  lombada; no meio da volta ele sobe 5% da altura e desce (um seno), e a vista desce até 60% do caminho da
  vista reta (`--aberto` 0,6), para o verso ficar de frente. A legenda troca para "Contracapa" no meio da
  volta. Desvirar faz o caminho de volta; fechar o visor virado desvira em 0,7s antes de o livro voltar ao
  lugar. Com movimento reduzido, troca na hora.

## Livro que gira e livro ampliado

- **Livro que gira** (D46, `data-livro-gira`, só CSS): na grade de Livros e de Séries, no painel da
  página do livro e no destaque de Séries, o livro gira para o leitor ao passar o mouse; desde a D61, é
  o giro com mola do livro vivo (acima). Na ficha "Do livro" do artigo, o livro é uma foto parada desde
  a D57. A capa que seguia o mouse, com a luz e a capa entreaberta (D40), saiu na D46.
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
  o livro de origem só some quando a cópia grande já está por cima dele, e só reaparece um instante
  antes de o diálogo fechar, para não haver um quadro vazio nem uma piscada (D52, revisão 6). As
  páginas não mudam com o tema (papel e tinta de papel).
- **Livro ampliado** (D47): cresce do livro de origem (0,7s, `power3.inOut`) e volta para ele ao
  fechar (0,55s), girando de volta a 38°, com o véu clareando.

## Home: destaque, assinatura e carimbo

- **O desenho do destaque da home** (D41, só ali): ao entrar na tela, os traços aparecem em
  sequência com DrawSVG (1,1s cada, sequência de até ~1,2s), depois a cor, a hachura (0,6s) e os
  textos (0,4s); tracejados só por opacidade. Desde a D52 (C02), o destaque é o primeiro card ou
  item de "Artigos recentes" (não um bloco à parte): o desenho corre uma vez por página, na forma à
  vista (cards ou lista), e a outra forma já aparece pronta ao trocar.
- **A assinatura** (D52, C04, `src/lib/traco.ts`, `assinaturaDeCaneta`): na home, embaixo de
  "Schutz", um traço de largura variável (contorno preenchido; entra fino, engrossa no meio e sobe
  afinando no fim) — o único traço grande do site, identidade e não enfeite. Com a abertura, ou chegando
  pela cortina, espera escondida e é escrita da esquerda para a direita em 0,7s, quando a capa dos
  cadernos começa a fechar (rodada 4, E12: antes ela esperava o fim da abertura e o desenho do destaque,
  e o Cesar achou demorado); andando pelo site sem passar pela chegada, já está pronta; com movimento
  reduzido, aparece pronta. No celular, o nome gigante fica em duas linhas, e a assinatura vai embaixo
  de "Schutz" do mesmo jeito.
- **O carimbo do "blog"** (D84, `Marca.astro`, `Abertura.astro`): o "blog" do nome gigante fica solto,
  inclinado −13° sobre o canto do Z. Com a abertura ou a chegada, ele espera a assinatura acabar e
  carimba (0,42s, `cubic-bezier(0.3, 0.6, 0.3, 1)`): desce a 1,6× e girado −1°, passa um nada do tamanho
  (0,95×, −14°) e assenta em −13°, terminando no ângulo do CSS (sem o tique de antes). Com movimento
  reduzido ou pulando a abertura, já está no lugar.

## Cabeçalho, marca e tema

- **Marca "cs"** (D41, D47, só CSS): no hover ou foco, a capa entreabre 38° sobre as páginas (0,5s),
  mostrando o miolo creme e pautado do caderno (D52, A01: papel `--marca-letra` com a pauta
  `--caderno-pauta`, igual nos dois temas). A fita saiu na D47; o "c" fica acima e o "s" abaixo, em
  degrau. **O aceno** (D52, B13; rodada 4, E12): quando os livros da abertura param (ou logo que a home
  chega pela cortina), o caderno do cabeçalho e o grande da home abrem e fecham juntos, uma vez, com a
  mesma curva do hover (a classe `acena`, por 0,75s); o que estiver sob o mouse continua aberto. **No
  hover do cabeçalho** (D52, C04), junto com a capa que entreabre, um traço curto de caneta preta passa
  embaixo do "blog" (só ali; o livro não se risca).
- **Cabeçalho no celular** (até 860px, D46): sempre à vista. O botão de menu abre as seções numa
  folha que desce do cabeçalho por `clip-path` (0,46s), com os itens chegando em sequência (8px,
  50ms entre eles) e um véu de 32% sobre a página; fecha mais rápido (0,34s). Com a folha aberta, a
  página de baixo não rola (D84). **Nenhum livro cai** (o tombo do livro inclinado saiu na D35) e
  **nenhum texto muda de cor**. Sem animação de entrada nas seções.
- **Troca de tema: a lâmpada** (D61, rodada 3, T7, no lugar do círculo da D42 e da lua e do sol da D49;
  `SeletorTema.astro`, `tema.ts`, `lampada.ts`, o halo em `Luz.astro`): o botão é o lustre do
  cabeçalho, e o tema é a luz. Puxar a cordinha apaga a lâmpada como uma incandescente de verdade (o
  branco morre logo e a brasa sobra por meio segundo) e a sala escurece com ela (~1,15s); puxar de novo
  acende (a brasa, o âmbar, o branco quente, com o tremor do contato) e a sala clareia (~0,95s). As
  camadas são keyframes de opacidade amostrados (um por quadro) no Web Animations API, sem cor animada,
  e a página vira dentro de uma View Transition do documento (os livros perdem o nome de transição
  durante a troca). O hover balança a cordinha (um pêndulo que decai: 14°, −7°, 3°, −1°, em 1,2s) e
  acende um halo fraco em volta do bulbo (0,25s); o clique puxa a cordinha 6px (0,12s) e solta com mola,
  e a troca começa na soltura; dá também para puxar arrastando para baixo (até 14px). Com movimento
  reduzido, nada balança e a troca é um esmaecer de 150ms.
- **A caneta que navega** (D49, `traco.css`, `src/lib/traco.ts`): a seção atual do menu é sublinhada
  por um traço de caneta (2,2px, azul-tinta), torto de um jeito próprio em cada item e sempre igual;
  na troca de página, ele desliza de um item para o outro (View Transition `traco-do-menu`, 0,42s);
  sem par, se escreve (0,38s) ou some pela direita (0,2s). No menu do cabeçalho, o mouse escreve um
  traço leve **preto** (1,5px, 55%, D52, C04) da esquerda para a direita (0,32s) e, ao sair, ele
  termina de passar e some pela direita (0,22s); os links do rodapé continuam com o mesmo traço leve
  **azul**, como antes da D52 (ali é a navegação de sempre, não a caneta nova). No celular, o traço
  da seção atual se escreve quando a folha do menu termina de descer. A lupa inclina 14° no hover, a
  tecla ⌘K afunda 1,5px por 120ms quando é usada e o campo dá um toque (98,5% para 100%) quando a
  busca nasce dele.
- **Caneta da leitura** (D45, `BarraLeitura.astro`; na cor do livro desde a D58): o traço do
  progresso corre sobre o fio do cabeçalho e a caneta acompanha a ponta, ligada à rolagem (sem
  animação própria; só a caneta aparece por opacidade, 0,2s). O cabeçalho fica sempre à vista (D46).

## Busca

- **A busca nasce do campo** (D44, D49; rodada 3 da D61, G11; `Busca.astro`, Web Animations API): com
  clique, ⌘K ou Ctrl+K (o "/" saiu na D52, B06: em muitos teclados é a mesma tecla do "?" dos atalhos),
  a ficha de consulta nasce do botão que a abriu (pelo atalho, do campo do cabeçalho; D84): um pedaço de
  papel do tamanho do campo, em cima dele, que cresce e desce até a largura do conteúdo e até 70% da
  altura da janela, logo abaixo do cabeçalho, em 0,5s (`cubic-bezier(0.215, 0.61, 0.355, 1)`), só por
  `clip-path` e `transform`, sem esticar o papel nem a letra; o conteúdo aparece em 0,26s, 0,17s depois.
  O véu escurece a página a 55%; o cabeçalho fica à vista. Esc, "Fechar" ou clique fora encolhem a
  ficha de volta ao botão (0,35s), e o foco volta para ele.
- **Os resultados** são linhas da ficha: o termo buscado ganha o marca-texto que se estica (0,45s). No
  hover, no foco ou nas setas, o fundo azul desliza até o resultado (0,28s; da primeira vez, a tinta
  escorre do começo ao fim da linha) e a caneta preta escreve o colchete na margem (0,34s). Na ficha do
  resultado (a partir de 1000px), a ilustração velha esmaece em 0,12s e a nova chega subindo 6px, e o
  livro 3D pequeno gira com a mola quando o livro muda. Sem resultado, o termo ganha a ondinha de
  revisor na cor de Cuidado (0,45s). Com movimento reduzido, abre e fecha direto, sem deslizar nem
  escrever.

## Listas, filtro, cards e tags

- **Filtro por livro** (D47): a lista esmaece (0,18s) e os primeiros artigos chegam subindo (0,42s,
  40ms entre eles). O total e o de cada ano rodam como contador já no clique (D49, `contador.ts`):
  cada algarismo numa fita (0,55s, `power3.out`, as dezenas 0,05s depois), e a coluna que sobra
  fecha a largura (0,4s).
- **Troca Lista / Cards** (D42): a forma atual esmaece (0,12s) e a nova aparece subindo 8px (0,22s),
  com a Web Animations API (`SeletorModo`). Sem Flip e sem cascata nos cards. O azul do botão ativo
  é uma tinta só que escorre de um botão para o outro (D49): a borda da frente corre (0,2s,
  `power2.in`) e a de trás alcança (0,28s, `power3.out`); o texto troca de cor no meio (0,16s). Quem
  anima é o recorte (`clip-path`, pelas bordas `--tinta-l` e `--tinta-r`, D61). A caixa da tinta não
  anima: parada, fica só em volta do botão ativo; no clique, cresce para cobrir os dois botões e, 0,48s
  depois, encolhe para o botão novo (dois saltos por troca, `--caixa-l` e `--caixa-r`, D72). Cobrindo a
  tira inteira, ela fazia o Lighthouse acusar contraste baixo no botão solto.
- **As listas que aparecem ao rolar** (D61, rodada 3, T13; `revelar.ts`): o card ou item que está
  **abaixo da dobra** quando a página chega espera escondido e aparece quando 15% dele entra na tela:
  sobe 14px e vai de 0 a 1 em 0,5s (`cubic-bezier(.2,.7,.2,1)`), com 60ms entre os da mesma linha (no
  máximo 180ms numa linha; uma linha que chega junto com outra espera mais 70ms). Uma vez só. O que está
  à vista na chegada não espera nem anima (a página, a cortina e a abertura cuidam dele); sem JS ou com
  movimento reduzido, tudo à vista desde o começo.
- **A tira que embaralha** (D61, linha 18, P6; `embaralha.ts`): a tira em mono da ficha ("Vol. 05 ·
  ficha 2") embaralha ao entrar na tela, uma vez: por 0,4s as letras e os números viram outros (uma
  troca a cada 45ms) e cada um assenta no lugar, da esquerda para a direita. Só a chamada da tira, nunca
  texto grande. Na chegada, espera a página pousar. Com movimento reduzido, nada embaralha.
- **As fichas que caem** (D61, rodada 3, área 6; `fichas-caem.ts`): numa lista com `data-fichas-caem`
  (Tags), cada ficha cai 36px, uma a uma, 40ms entre elas, em 0,45s, com um assentar de 2px e um nada
  de giro que se endireita no pouso, quando a cortina começa a sair (ou quando a abertura termina, ou na
  carga). As de baixo da dobra caem quando 15% delas entra na tela.
- **O fichário de Tags** (D61, rodada 4, P19-2; `fichario.ts`): puxar uma letra (clique, toque ou Enter)
  devolve as gavetas abertas e tira a da letra (0,4s: a frente vem 18px para perto do leitor); as fichas
  que estavam embaixo saem (0,18s) e as da letra caem de cima. "Todas" puxa as gavetas com tag em
  cascata (40ms entre elas), que é também o estado de chegada. Com movimento reduzido, as gavetas e as
  fichas trocam direto.
- **A caneta que marca** (D49, com mouse ou foco; `traco.css`): no hover de um artigo da lista, um
  colchete **preto** (D52, C04) na margem esquerda se escreve de cima para baixo (0,34s) e, ao sair,
  some por baixo (0,2s); nos números da paginação e no GitHub e no LinkedIn do cabeçalho, um círculo
  **preto** à mão (D52, C04; uma volta e 8%, 0,42s, `power2.inOut`) que some pela ponta ao sair
  (0,2s). As setas de "Anteriores" e "Mais artigos" avançam 3px no hover e, no clique, saem pela
  frente e voltam por trás (0,32s).
- **O ícone de tag inclina** (D52, B11) no hover ou no foco: 6° no cartão de `/tags/`, 8° na pílula
  (`PilulaTag`) e na nuvem, 0,35 a 0,45s; parado com movimento reduzido.
- **A caneca** (D52, C04, classe `fumaca`): no hover do card, do item da lista ou do topo de um post
  da série Java, a fumaça de agora sobe e some pelo alto e uma nova se escreve de baixo (1,15s, a
  segunda 0,12s depois), uma vez; com movimento reduzido, a fumaça fica parada. O emblema da revista
  (a xícara da capa e da lombada) não anima: é livro, não caneta. A capa viva (D58, abaixo) leva o
  mesmo gesto para toda capa.

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
  acompanha em 0,35s; em 1,6s, tudo volta). No anterior e no próximo (fichas de catálogo com fita desde
  a D61), a ficha sobe 4px com a sombra, o título fica azul-tinta, a seta anda 3px para onde se vai e o
  detalhe da capa viva se mexe.

## Desenhos do artigo (D58)

- **Capa viva** (`capa-viva.css`, `capa-viva.ts`): no hover do topo do artigo, do card ou do item da
  lista, o detalhe `mexe-*` da capa se mexe. **Eventos**, até 1,3s, uma vez: balança 1,3s (7°,
  −4,5°, 2°, pendurado pelo alto), pulsa 0,9s (até 1,14), pisca 1s (duas vezes, a 15%), sobe 1,2s
  (sobe 40 unidades e some, volta de 18 abaixo), treme 0,6s (±3), escreve 1,1s e enche 1,2s (esvazia
  até 20% da altura e enche de novo, pela base). O script põe a classe `mexendo` por 1,4s no primeiro
  `pointerenter`, para o evento ir até o fim mesmo que o mouse saia no meio. **Estados:** ida de 1 a
  1,3s (gira 120° em 1,3s, `cubic-bezier(0.3, 0, 0.2, 1)`; desliza 22 unidades em 1s,
  `cubic-bezier(0.45, 0, 0.25, 1)`) e volta, sem o mouse, de 0,6 a 0,75s (desliza 0,6s, gira 0,75s,
  `cubic-bezier(0.3, 0, 0.25, 1)`); a volta é a transição de base, então nunca pula. Com movimento
  reduzido, nada.
  - **O relógio** (a variante do `mexe-gira` com `data-relogio`, na capa de Parquet e snapshots;
    03/10/2026, D75): os ponteiros não giram juntos pelo centro da caixa dos traços. O grupo contém dois
    paths: `data-ponteiro="minutos"`, vertical para cima, e `data-ponteiro="horas"`, horizontal para a
    direita; a origem de cada giro é a base do ponteiro, no centro do mostrador. No hover, avançam cinco
    minutos (30° e 2,5°, a proporção 12:1), na mesma curva e em 1,3s; voltam suavemente em 0,75s. O
    mostrador não gira.
- **Detalhes das figuras** (`figura.css`), só com a figura na tela (`data-na-tela`, posto por um
  observador com 80px de folga) e nunca com movimento reduzido:
  - `pacote`: um ponto só percorre a linha na vez da etapa dele (`etapa-1` a `etapa-7`), **1,2s por
    etapa**, num ciclo de **8,4s** (a etapa N começa (N − 1) × 1,2s depois); ele aparece em 1,5% do
    ciclo, corre até 13% e some em 14,3%. Linhas da mesma etapa andam juntas;
  - `fluxo`: pontinhos (0,1 a cada 26) correndo sem parar, 1,4s por passo do tracejado, linear;
  - `formiga`: tracejado de 10 e 12 andando, 1,2s por passo, linear;
  - `pulsa` 2,4s (até 1,12), `pisca` 2s (até 25%), `gira` 9s por volta, `balanca` 3,2s (±4°) e `anda`
    2,6s (±6px), todos em laço.
- **Legenda que destaca** (`figura.css`, só nas figuras com legenda): com o mouse numa cor da legenda
  ou no componente, tudo o que não é daquela cor apaga a 22% em 0,3s, menos a referência
  (`.referencia` e os eixos, D59).
- **A figura em passos** (D67, em prova; `FiguraPassos.astro`, `figura-passos.ts`, `figura-passos.css`
  e o estilo dos controles em `src/styles/passos-estilo/`): abre inteira, parada. "Passo a passo" volta à
  base, e cada passo só soma: ao avançar, o que entra aparece em ordem (até três tempos, `etapa-1` a
  `etapa-3`, 1s entre eles), o selo do passo acende, um ponto percorre o trajeto (`.trajeto`) uma vez e
  os passos anteriores esmaecem um pouco. No último passo, ou em "Ver tudo", a figura volta inteira.
  Nada anda sozinho, nada repete, nada some (só ao voltar um passo, o passo desfeito sai). Com movimento
  reduzido, as trocas são imediatas.
- **A lousa** (nenhum post a usa desde 04/10/2026; fica nas páginas de prova; `Lousa.astro`, motor
  `src/scripts/lousa.ts`): começa no fim, completa e parada. O play vai do início ao fim em **7s** por
  padrão (`duracao`, em segundos), para **5s** no quadro final sem caneta e recomeça. Fora da tela
  (200px de folga), pausa e volta a tocar se tocava. A rolagem horizontal sobre a lousa anda 0,0012 da
  volta por pixel (0,03 por linha, com Shift e a roda); no toque, o arrasto só começa depois de 8px de
  lado (o dedo que sobe ou desce rola a página); até 700px o desenho rola de lado no painel, e o dedo e
  a rolagem de lado são dele (D59). A canetinha (D59) aparece e some por opacidade (0,2s), na ponta do
  que está sendo feito, na cor do que faz; na escrita, sobe e desce 22% da altura do texto a cada letra
  e gira até 6°; no traço, gira até 4°; pintando (`data-revela`), corre no meio da caixa e gira até 3°;
  até três canetas ao mesmo tempo, a mais recente com a primeira.
  - **Marcador dos passos** (lista embaixo da lousa de passos, como o da busca, D49): desliza até o
    passo sob o mouse ou o foco em **0,28s** (`cubic-bezier(0.215, 0.61, 0.355, 1)`, altura junto) e
    aparece ou some em 0,2s; na primeira vez, aparece direto no lugar. O passo da vez acende na cor do
    livro (fundo e número, 0,25s).
  - **Clique num passo:** leva a lousa ao fim daquele passo, com a caneta. O mouse na lista só move o
    marcador (a prévia da lousa no hover saiu em 30/09/2026).
- **A animação com play** (nenhum post a usa desde 04/10/2026; `Animacao.astro`, GSAP sob demanda):
  **6 a 12s** por volta, **5s** parada no quadro final (`repeatDelay`) e recomeça. Abre tocando quando
  35% dela aparece na tela (com movimento reduzido, só com o play); fora da tela, pausa. O anel do botão
  acompanha o andamento da volta, quadro a quadro; nos 5s do fim, cheio, pulsa de 100% a 35% de
  opacidade em 1,6s. O GSAP é baixado quando o mouse ou o foco chegam ao botão, ou no primeiro play. Na
  impressão, o quadro final.
- Com movimento reduzido: a lousa e a animação continuam começando no quadro final, a animação não
  abre tocando (só com o play), a caneta da lousa não aparece e o marcador dos passos vai direto, sem
  deslizar.

## Rodapé e voltar ao topo

- **A cordinha** (D61, rodada 4, R2; `Rodape.astro`): no hover (ou no foco do teclado), ela balança
  como um pêndulo que perde força (14°, −7°, 3°, −1°, em 1,2s) e mostra "Puxe para subir". O clique (ou
  Enter, Espaço, a tecla T dos atalhos e o toque) estica o fio 10px em 0,12s, solta com mola, e a página
  sobe; dá também para puxar arrastando para baixo.
- **A ficha e o nome do rodapé** (D61, rodada 3, área 3): o carimbo "Biblioteca C.S." bate 0,6s depois
  de a ficha de empréstimo entrar na tela; o nome gigante respira o peso, de 800 a 680 e de volta em 7s
  (nunca abaixo de 650), só enquanto está à vista e nunca com movimento reduzido.
- **A aba "topo"** (D61, rodada 4; `AbaTopo.astro`): só em página longa (mais de três telas), depois de
  rolar uma tela e meia; desliza para dentro (0,42s) e mostra 44px; com o mouse ou o foco, sai mais 6px e
  a seta sobe um nada; no clique, a seta dá um pulinho para cima e a página sobe, com o foco no título.
  Some perto do topo e quando a cordinha entra na tela. No celular (até 760px), só aparece quando o
  leitor rola para cima, e volta a se esconder quando ele desce de novo ou depois de 4s parado. Com
  movimento reduzido, aparece e some sem deslizar e a subida é instantânea.

## O computador

- **O computador** (D61, rodada 3, C1 a C10; `src/computador/`, carregado sob demanda pelo ícone): a
  câmera vai até a tela do ícone e volta (View Transition do documento, tipos "mac-entra" e "mac-sai");
  sem View Transitions, a tela cresce do retângulo do ícone (`clip-path`). As janelas, a doca e os menus
  usam a Web Animations API. Com movimento reduzido, sem câmera nem gênio: aparece e some num esmaecer
  curto.

## A 404

- **A 404** (D49): a caneta rasura o endereço (0,35s e 0,25s, 0,3s depois de abrir) e, quando dá, a
  sugestão chega depois (0,3s). Com movimento reduzido, sem a rasura (D84).
