# Revisão das trocas (D52): acabamento dos problemas 2, 3, 7, 8, 9, 13 e 15

Agente Acabamento das trocas, 27/09/2026. Arquivos: `src/scripts/troca.js` e `src/styles/base.css` (trechos
da troca e da caneta do carregando). `BarraLeitura.astro`, `Base.astro` e `PainelHome.astro` não foram
tocados.

**Como gravei.** Build de uma worktree própria (`astro build`, sem o postbuild), servido com gzip na porta
4395 (e na 4396 com 0,9s de atraso no HTML, para a rede lenta). Chrome headless próprio (`playwright-core`,
`channel: "chrome"`), com trace + screenshots e screencast do CDP a 1440px ao mesmo tempo, os scripts da
revisão (`scratchpad/rev/`) adaptados em `scratchpad/trocas/`. Tempos em **ms desde o clique**. Telas de
1440×900 e 390×844, claro e escuro (e 320, 768, 1280 e 1600 nas conferências). "Conteúdo" é o desvio da
luminância abaixo do cabeçalho, como na revisão: 0 é a mesa vazia; abaixo de 6, quase vazia. Para o
problema 2, os tempos foram escolhidos com um modelo das folhas (`scratchpad/trocas/modelo.py`: a posição
de cada folha na tela, com a perspectiva, e a opacidade a cada 4ms) e depois conferidos nos quadros.

## 2. Trocas gerais: a mesa vazia no meio da troca (commit 7e0806b)

**Causa.** As folhas novas começavam o voo e a opacidade juntos, 0,26s depois do `vt.ready`, com a
opacidade linear em 280ms. Mas as de cima saem do alto, fora da tela, e levam ~0,2s para entrar; as de
baixo vêm pequenas e quase transparentes. As antigas já tinham sumido em 0,3s, e sobrava 0,1s só com o
papel. **Mudança.** O voo das novas começa em 0,04s (`VOO`), ainda transparente, e nada novo fica visível
antes de 0,24s (`CHEGA`): a opacidade vem em 170ms, ease-out, a partir daí; os textos e a lista do desfile
também esperam `CHEGA`. As antigas começam a esmaecer 80ms depois de começar a cair (antes, 90ms). O
desfile de Categorias começa em `CHEGA` (antes, 0,26s). Assim, as novas aparecem, pequenas e lá no fundo,
quando as antigas já estão caindo e quase transparentes: no máximo um ou dois quadros de dissolução, com
as duas semitransparentes, e nenhum cartão novo nítido atrás de um antigo nítido (no modelo, sobreposição
de antiga e nova acima de 35% cada: zero). A troca inteira fica ~0,2s mais curta. **Antes e depois.**
Spring → JVM (1440): mesa vazia de 384 a 484ms (100ms), quase vazia de 367 a 550ms → nenhum quadro
abaixo de 5,7. Home → archive: vazia de 430 a 566ms (136ms) → mínimo 5,9 (escuro, cards: 4,5). Tags →
Kubernetes: vazia de 364 a 464ms (100ms) → mínimo 4,2. Archive → artigo: vazia de 449 a 484ms e quase
vazia até ~600ms → mínimo 8,7. A 390, o mínimo passou de ~1 para 11 a 13; a 320, 13,3; a 1280, 6,0; a 1600
no escuro, 3,5 (nunca zero).

## 3. Anterior e próximo: o rodapé sobre o título novo (commit aaa9579)

**Causa.** Com a página no fim, o rodapé do site (`rodape-velho`) esmaecia em 200ms com ease-in e ficava
quase inteiro nos primeiros 150ms, por cima da página nova, que já está inteira embaixo dele.
**Mudança.** Ele sai em 90ms, ease-out (`cubic-bezier(0.33, 1, 0.68, 1)`), no anterior e no próximo.
**Antes e depois.** Anterior a 1440 (claro e escuro): o rodapé nítido (acima de 50% do contraste) de 99 a
~250ms → nítido só no primeiro quadro da troca (96ms), 55% em 113ms, 27% em 131ms e fora em 147ms. A 390,
o texto sobre texto ia de 99 a ~267ms → some em 151ms.

## 7. CPU lenta: a tela congelada sem sinal nenhum (commit 83b6f0f)

**Causa.** A caneta só aparecia 0,2s depois do clique, e o `pageswap` cancelava o relógio dela: com a CPU
lenta, a resposta vem logo, e a demora (montar a página nova) é depois do `pageswap`, com a tela parada. A
chegada curta, com limite de 1s, falhava por pouco. **Mudança.** Cada troca guarda na sessão quanto a
página nova levou da resposta à primeira pintura (`pageswap` → `pagereveal`, chave `cs-troca-montagem`).
Se passou de 0,3s, a troca seguinte mostra a caneta **já no clique** (classe `no-clique`: sem esmaecer e
com um traço começado, para ela estar na imagem que fica parada) e usa a chegada curta. O limite da
chegada curta desceu para 0,7s. Com movimento reduzido nada muda (sem troca, nada é guardado).
**Antes e depois.** Nesta máquina, a CPU 4× monta as páginas em 150 a 220ms (abaixo de 0,3s); a CPU 8×
reproduz o caso da revisão. Segunda troca com CPU 8× (artigo → archive): antes, tela parada de 41 a ~780ms
sem sinal e a coreografia inteira (`cs:chegou` em 2266ms); depois, a caneta no primeiro quadro depois do
clique (27ms), parada na imagem congelada, e a chegada curta (`cs:chegou` em 1273ms). CPU 4× + Slow 4G pelo
CDP, primeira troca (tag → tag): `pagereveal` em 914ms, agora curta (antes, a coreografia inteira); segunda
troca (montagem anterior de 336ms): a caneta inteira em 15ms (antes, a partir de ~220ms, esmaecendo),
curta. Sem limite nenhum, nada
muda: a caneta não aparece, e a chegada é a inteira.

## 8. Anterior e próximo: o painel do desenho vazio (commit abea3f9)

**Causa.** A troca de lado não avisava `cs:pousou`, e o desenho do topo esperava o `cs:chegou` do fim da
troca (~0,85s). **Mudança.** Uma animação vazia, no relógio das outras da troca de lado, dispara
`cs:pousou` 420ms depois do `vt.ready` no próximo (a folha com ~95% do caminho feito) e 300ms no anterior
(a de cima já saindo). **Antes e depois.** Próximo a 1440: painel vazio de 399 a 866ms (~470ms) e o desenho
em ~883ms → `cs:pousou` em 513ms e os primeiros traços em 533ms (vazio de ~115ms, enquanto a folha pousa);
a 390, o primeiro traço em ~550ms (antes, depois de 850ms). No anterior, quando a folha de cima sai, o
desenho já está no meio (antes, o painel aparecia vazio e só então começava).

## 9. Próximo: as duas laterais juntas (commit 519cfaf)

**Causa.** A lateral nova começava em 180ms, com a antiga (200ms, ease-in) ainda a ~50%. E havia um
salto a mais: o livro da lateral nova tem nome de transição próprio, e o Chrome não pinta um elemento com
nome dentro de um pai na opacidade 0; ele surgia inteiro, de uma vez, em ~281ms. **Mudança.** A lateral
nova começa em 220ms, com a antiga quase fora. Quando o livro muda, o livro novo perde o nome durante a
troca (vem esmaecendo com a lateral) e o livro antigo (imagem à parte, nome guardado em `nomeLivro`) sai
com o mesmo movimento da lateral antiga. O mesmo livro continua parado, como antes. **Antes e depois.**
Próximo a 1440: as duas a ~50% no mesmo lugar em 265–300ms e o livro novo surgindo nítido em 281ms → a
antiga some até ~330ms, a nova entra a partir de ~350ms, sem salto (um quadro com a coluna vazia).
Anterior e escuro: igual.

## 13. Carregando: a caneta que sumia de uma vez (commit aa21d4e)

**Causa.** A caneta estava na raiz antiga, que as trocas por folhas escondem no primeiro quadro.
**Mudança.** `.carregando { view-transition-name: carregando }`, por cima do cabeçalho (grupo com z-index
101), e a imagem antiga dela esmaece em 0,2s, ease-out, desde o primeiro quadro da troca. **Antes e
depois.** Com a página atrasada 0,9s (tag → tag, 1440): a caneta sumia entre 928 e 1010ms, com a tela
parada até ~1076ms → esmaece de 1008 a ~1126ms e termina quando as folhas começam a cair. A 390: de 992 a
1074ms. No próximo artigo (chegada curta): de 1037 a 1140ms.

## 15. Pilha no celular e no tablet: a lombada esticada sobre a capa (commit ace7907)

**Causa.** Sem o voo da pilha (topo fora da tela, a 390 e a 768), a lombada puxada ficava com o nome de
transição que o script do `<head>` dá ao livro que leva à página nova, e fazia par com o livro em pé do
topo: a imagem fina dela era esticada até a largura do livro e cruzava a capa como uma faixa.
**Mudança.** No `pageswap`, a lombada deitada que leva à página nova perde o nome (com o voo, a pilha já o
tirava), e a página nova tira o nome do livro do topo durante a troca (e o devolve no fim), para ele não
aparecer por cima da página antiga. Sem morph: a lombada sai com a pilha, e o livro chega com a folha.
**Antes e depois.** A 390 (claro e escuro): a faixa sobre a capa de 969 a 1166ms → nenhuma; a página nova,
com o livro, entra junto. A 768: a faixa de ~1048 a 1148ms → nenhuma. A 1440, com o voo, os quadros ficaram
iguais aos de antes.

## Observações

- **Capturas brancas no Chrome automatizado.** No Chrome do MCP `chrome-devtools`, toda troca gravada
  mostrou as imagens antigas como retângulos brancos, sem conteúdo (até tag → tag). No headless, isso
  apareceu às vezes na segunda troca de uma visita, também com o código de antes (`da3970c`). Parece um
  problema de captura do Chrome automatizado (a janela do MCP fica oculta), não das trocas; vale o Cesar
  conferir no Chrome dele. As gravações deste relatório são as do headless com as capturas normais.
- **Slow 4G pelo CDP.** O limite de rede do CDP não vale para o pré-carregamento do navegador (as regras de
  especulação ao parar o ponteiro sobre o link). Para medir a rede lenta, o clique foi feito sem pairar.
- Nenhum erro no console nas gravações, no dev (4322) nem com movimento reduzido.

## Para registrar

- **decisoes.md (D52, revisão das trocas):** as folhas novas começam o voo em 0,04s, ainda transparentes,
  e só aparecem a partir de 0,24s (opacidade em 170ms, ease-out); as antigas esmaecem 80ms depois de
  começar a cair. No anterior e no próximo, o rodapé sai em 90ms, a lateral nova entra em 220ms (o livro
  dela vem junto) e o desenho do topo começa em 420ms (próximo) ou 300ms (anterior). A caneta do
  carregando tem imagem própria na troca e esmaece em 0,2s; depois de uma troca que levou mais de 0,3s
  para montar a página nova, a seguinte mostra a caneta já no clique e é a curta; o limite da chegada curta
  passou de 1s para 0,7s. Sem o voo da pilha, a lombada deitada não vira o livro em pé do topo pela View
  Transition (formas diferentes demais): sai com a pilha, e o livro chega com a folha.
- **DESIGN.md (movimento):** "As folhas novas aparecem enquanto as antigas somem, nunca com a mesa vazia
  entre elas." e "Quando a troca anterior demorou, a caneta aparece já no clique."
