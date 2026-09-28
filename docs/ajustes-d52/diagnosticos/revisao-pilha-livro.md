# Revisão das animações (D52): pilha, livro ampliado e visor (problemas 1, 10, 6 e 11)

Agente Acabamento da pilha e do livro, 27/09/2026. Arquivos: `src/components/PainelHome.astro`,
`src/components/LivroAmpliado.astro` e `src/styles/visor.css` (`artigo.ts`, `paginas.css` e `base.css`
não foram tocados). Antes e depois gravados quadro a quadro num Chrome headless próprio (`playwright-core`,
`channel: "chrome"`, screencast do CDP em resolução cheia, HMR do dev silenciado) contra o dev
(<http://127.0.0.1:4322>); os tempos são ms desde o clique ou a tecla. As grades estão em
`scratchpad/revisao-pilha-livro-quadros/` (o número do arquivo é o do problema); os scripts e todas as
gravações, em `scratchpad/pl/`. Conferência final no MCP `chrome-devtools` (aba própria, fechada no fim),
sem erro no console. `npm run check`: 0 erros antes de cada commit.

## 1. Pilha no celular: a troca era abortada (commits `9cccaf4` e `c30dc21`)

- **Causa:** no caminho sem voo (topo fora da tela), a lombada puxada anda por `transform` e passa da borda
  direita. No celular, o `html { overflow-x: clip }` não segura o viewport de layout: o documento ia de 390
  para 568px no fim do puxão, e o navegador rejeitava a transição (`Viewport size changed`), com a página
  nova num corte seco (medido de novo antes da mudança: largura 399 → 568 entre 714 e 851ms, `vt.ready`
  rejeitado em 925ms).
- **Mudança:** `.painel-home { overflow-x: clip }` abaixo de 1100px (o painel embaixo do conteúdo, a mesma
  quebra do `ComPainel`): a lombada some na borda da folha. É o mais local, não cria rolagem e só corta
  para o lado (a pilha que tomba e a sombra da folha ficam inteiras). Na tela grande nada muda (lá a
  lombada passa da borda do painel de propósito). Com a transição rodando, apareceu um segundo defeito: a
  lombada do livro guardado levava o nome de transição dela e, como a página nova abre no alto (com a
  pilha lá embaixo), descia atravessando a pilha em dois quadros. Agora ela só tem o nome com o voo (a
  pilha da página nova no mesmo lugar); sem ele, esmaece com a página.
- **Depois:** a 320, a 390 (claro e escuro) e a 768 com toque, a largura fica igual do começo ao fim e a
  transição roda (`vt.ready` ok); a lombada escolhida vai até o livro do topo, e o resto esmaece. Com
  movimento reduzido, o clique só abre a página (42ms).

## 10. Pilha na tela grande: o topo ficava um bloco vazio (commits `d1217d2`, `20be2a5` e `67b6a11`)

- **Causa:** o título e a marca d'água do topo esmaeciam no clique, junto com os artigos, e o texto novo só
  entrava quando o livro novo chegava: de ~0,25 a ~1,4s, o topo era um retângulo colorido sem título e
  sem livro. Entre pousar o livro guardado e puxar o escolhido, a pilha ficava ~0,2s parada (no build do
  revisor, ~0,3s), somando a descida lenta do pouso ao começo lento do puxão (`power1.in`).
- **Mudança:** no clique só os artigos esmaecem. O título e a marca d'água ficam até o escolhido sair da
  pilha e aí trocam junto com a cor do palco: o velho sai em 0,18s, solto do fluxo no mesmo lugar e com a
  cor do livro dele (o quadradinho da contagem não troca de cor antes de sair); o novo entra logo depois,
  quase sem se cruzarem. O puxão começa 0,15s antes de o guardado pousar (`ANTECIPA`); a cópia no ar
  acompanha o atrito do bloco (um ou dois px) e pousa onde a lombada está, sem salto na troca. O puxão em
  si (o peso) é o mesmo.
- **Depois:** a 1440 e 1600, claro e escuro, e no arrasto: o título velho fica até ~1,0s e o novo está
  inteiro em ~1,4s; a pausa entre pousar e puxar caiu para ~0,1s. A emenda com a página nova continua sem
  tremer: diferença entre quadros na troca de documento igual à de antes (texto 0,00, pilha < 0,1, o palco
  continua o giro sem degrau).
- **Achado no caminho (`67b6a11`):** voltar pelo histórico (bfcache) depois de uma troca pela pilha trazia
  a pilha **vazia**, só a prateleira (também no preview da 4323). O `clearProps: "all"` do GSAP apagava o
  `style` inteiro das lombadas (cores e medidas). Agora só sai o que o GSAP pôs. Conferido: trocar,
  voltar (pilha, título e marca d'água no lugar) e trocar de novo.

## 6. Livro ampliado: piscava ao abrir e ao fechar (commit `7f1e450`)

- **Causa:** ao abrir, o `.visor[open] { animation: visor-entra }` também valia para o diálogo do livro: a
  cópia surgia a partir do transparente, enquanto a origem já tinha sumido (antes: painel vazio em 90ms,
  cópia quase transparente até ~190ms). Ao fechar, a origem só voltava no evento `close` (outra tarefa):
  sobrava um quadro com o painel vazio (antes: 7178ms).
- **Mudança:** `.visor-livro[open] { animation: none }` (só o véu esmaece). Até o GSAP pôr a cópia sobre a
  origem, ela e a legenda ficam invisíveis (com o GSAP ainda chegando, o livro grande aparecia no meio). A
  origem volta logo antes do `dialogo.close()`. O botão de fechar e a sombra no chão chegam com o livro e
  saem com o véu (a sombra ficava como uma mancha escura sobre o texto da página, no celular).
- **Depois:** a 1440 e 390, o livro fica à vista em todos os quadros da abertura e da volta; medido no MCP,
  zero quadros com o diálogo fechado e a origem invisível. Virar folha e o hover dos links (B02: "Ler o
  artigo" com cursor e sublinhado) continuam iguais. Com movimento reduzido, abre e fecha na hora.

## 11. Visor de imagem: as duas imagens juntas ao fechar (commit `2de479a`)

- **Causa:** o véu e a imagem esmaeciam juntos em 0,18s com ease-in (lento no começo): o diagrama do visor
  e o da página ficavam nítidos ao mesmo tempo por ~70ms (1130–1182ms no escuro).
- **Mudança** (só `visor.css`, sem tocar no `artigo.ts`): a imagem e os botões somem em 0,12s com ease-out,
  encolhendo até 0,94; o véu começa 0,05s depois e clareia devagar no começo (0,17s). O filtro do escuro
  (A04) continua na imagem.
- **Depois:** no escuro e no claro (Esc e o botão) e a 390: a imagem do visor já está quase invisível
  quando a página começa a aparecer; sobra um quadro com as duas bem fracas, que se lê como um esmaecer.
  Com movimento reduzido, fecha na hora.

## Ficou de fora

- **Celular e tablet, a lombada que vira o livro do topo:** agora que a troca roda, dá para ver o que ela
  faz. A imagem antiga (a lombada deitada, fina) é esticada na largura do livro em pé e aparece como uma
  faixa atravessando a capa por ~0,15s, enquanto esmaece. É a transição padrão dos livros (classe `livro`,
  D29), que também serve à grade de Categorias (B10). Mudar a imagem antiga dos livros (esmaecer mais
  depressa) é do agente das trocas.
- **A faixa da barra de rolagem atrás dos visores:** em sistemas com barra de rolagem fixa (Windows, ou o
  Mac com mouse), o `scrollbar-gutter: stable` deixa uma faixa clara à direita, fora do véu, enquanto o
  livro ampliado ou o visor estão abertos. Já estava no relatório do A04. No Mac com trackpad não aparece.

## Para registrar

- **`docs/decisoes.md` (D52, revisão 1, 6, 10 e 11):** no celular, a lombada puxada é cortada na borda
  da folha (`.painel-home { overflow-x: clip }` abaixo de 1100px), porque passar da borda da tela aborta
  a transição de página; a lombada guardada só tem nome de transição com o voo. Na tela grande, o título
  do topo fica até o livro novo sair da pilha e troca junto com a cor do palco; o puxão começa 0,15s
  antes do pouso. O livro ampliado não esmaece ao abrir (só o véu), e a origem volta antes do `close()`.
  O visor de imagem fecha com a imagem saindo antes do véu (0,12s ease-out; véu 0,05s depois).
- **`DESIGN.md` (movimento):** "Nada passa da borda da tela no celular (a transição de página é
  abortada se o documento alargar). Numa troca, o título só sai quando o que vai substituí-lo já está a
  caminho. Um diálogo que sai de um elemento da página não esmaece inteiro: só o véu."
- **`CLAUDE.md` (armadilhas):** no celular, `html { overflow-x: clip }` não impede que um `transform`
  além da borda alargue o viewport de layout, e isso aborta a View Transition (`Viewport size changed`):
  corte no contêiner. O `clearProps: "all"` do GSAP apaga o `style` inteiro do elemento (inclusive as
  variáveis CSS postas no HTML): use a lista das propriedades animadas.
