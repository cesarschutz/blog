# Revisão das animações (D52): gravações quadro a quadro

Build do commit `3193c0b` (worktree própria, `npm run build -- --force`), servido estático na porta 4391
(e uma cópia com 0,9s de atraso no HTML na 4392, para a rede lenta). Chrome headless próprio
(`playwright-core`, `channel: "chrome"`), com trace + screenshots (498px, todos os quadros) e screencast do
CDP (1440px) ao mesmo tempo; os tempos são **ms desde o clique** (ou a tecla, ou o recarregar). Tela a
1440×900 e 390×844 (celular com toque), tema claro e escuro (`cs-theme` + `cs-prefs-quando`). Cada cena
também registrou `pageswap`, `pagereveal`, `vt.ready` (com os tipos), `vt.finished`, `cs:pousou`,
`cs:chegou`, `cs:aberto` e `cs:desenhou`. O bfcache foi ligado para o "voltar" (o Playwright o desliga).

Depois deste commit, o C04 mudou o cabeçalho (ícones à caneta, busca, tema, assinatura). Isso não mexe
nas trocas de página, então as gravações continuam valendo.

As grades dos problemas estão em `scratchpad/revisao-anim-quadros/` (o número do arquivo é o do problema).
Os scripts, as gravações e todas as grades ficaram em `scratchpad/rev/`.

## Resultado por cena

| Cena | Veredito |
| --- | --- |
| 1. Abertura da home | Montagem, papel e B12 (sem legenda com o mouse parado) **bons**. **Problema:** o aceno do B13 vem cedo demais (5). No escuro, o fio da caneta quase não aparece (12). |
| 2. Abertura de outra tela | **Boa.** O caderno creme e pautado (A01) aparece nos dois temas e pousa na marca. Detalhe: no voo, o caderno passa por cima do nome (14). |
| 3. Trocas gerais | O A02 está **resolvido** (nada novo aparece antes de o antigo sair). **Problema novo:** a "mesa vazia" entre a saída e a chegada (2). O voltar (bfcache) é um corte seco, como decidido na D51. |
| 4. Artigo → próximo / anterior | O A03 está **resolvido**. A ordem é a de `/archive/` (27 de 27, nenhuma diferença) e o sumário chega zerado (também vindo do meio, com 2 seções lidas). **Problemas:** o rodapé fica por cima do título no anterior (3), o painel do desenho fica vazio (8) e a lateral cruza (9). |
| 5. `/categories/` ↔ categoria | O B10 está **bom**: o livro voa sem salto de ângulo (claro e escuro), e a volta tem o desfile. |
| 6. Pilha | O B01/B09 está **bom** a 1440 e 1600, claro e escuro: sem tremida na emenda. **Problema grave no celular** (1). Detalhe: o painel do topo fica vazio (10). |
| 7. Rede e CPU lentas | Com rede lenta, a caneta aparece em ~250ms e escreve o fio, e a chegada curta entra depois de 1s. **Problema:** com a CPU lenta, não aparece sinal nenhum (7). Detalhe: a caneta some de uma vez (13). |
| 8. Artigo | O B05 (caneta e fio azuis) e o B06 (ficha a 1440 sem véu; com véu a 1280 e a 390; Esc fecha) estão bons, e no A04 a imagem não fica mais branca no escuro. **Problemas:** o sumário salta e deixa um risco (4), e a imagem aparece dobrada ao fechar o visor (11). |
| 9. Lista ↔ Cards | **Boa**: esmaece em 120ms, troca, entra em 220ms subindo 8px. O destaque ocupa duas colunas nos cards e é o primeiro item maior na lista, sem salto (1440 e 390). |
| 10. Livro ampliado | O B02 está **bom**: cursor de link e sublinhado em "Ler o artigo" e "Abrir o próximo livro", e sublinhado de 2px em "Ver o livro inteiro". Virar a página é suave. **Problema:** pisca ao abrir e ao fechar (6). |

## Problemas, do mais grave ao menos grave

### 1. Pilha no celular: a transição é abortada e a troca vira um corte seco (alta)

- **O que acontece:** a 390px, em toda troca de livro pela pilha, a lombada puxada sai pela borda direita
  da tela (754–868ms). A página nova entra num corte seco (953ms), já no alto, sem transição nenhuma. O
  `vt.ready` é rejeitado com `InvalidStateError: … Viewport size changed`. O motivo: no fim da animação, o
  documento passa de 390 para 568px de largura (`scrollWidth` e `innerWidth` medidos quadro a quadro).
  Num celular de verdade, isso pode ainda fazer a página encolher ou rolar para o lado por um instante.
  A 768 e a 1024px (sem emular celular), a transição roda.
- **Gravidade:** alta. O Cesar notaria no celular: é a "troca de antes" prometida no B01, e ela não
  acontece.
- **Causa provável:** `src/components/PainelHome.astro`, no caminho sem voo (`voa = false`, topo fora da
  tela). A lombada anda por `transform` dentro da `.pilha ol` e passa da borda. O `html { overflow-x: clip }`
  (`src/styles/base.css:64`) não segura o viewport de layout do celular.
- **Correção (testada):** `body { overflow-x: clip; }` em `base.css`. Outra saída testada:
  `@media (max-width: 760px) { .painel-home { overflow-x: clip; } }`. Nos dois casos a transição roda
  (`vt: ok`). Não use a regra no `.painel-home` na tela grande: lá a lombada puxada passa da borda do
  painel de propósito.

### 2. Trocas gerais: 0,1 a 0,2s de mesa vazia no meio de toda troca (média-alta)

- **O que acontece:** as folhas antigas somem em ~0,35s, e as novas só ficam visíveis em ~0,5s. No meio,
  a tela fica só com o papel e o cabeçalho. Medido pelo conteúdo abaixo do cabeçalho (vazia = zero;
  quase vazia = menos de 6):

  | Troca | Vazia | Quase vazia |
  | --- | --- | --- |
  | Spring → JVM | 363–464ms (101ms) | 346–547ms |
  | Home → archive | 413–546ms (133ms) | 413–615ms |
  | Archive → tags | 382–466ms (84ms) | — |
  | Tags → Kubernetes | 361–479ms (118ms) | — |
  | Artigo → categorias | 368–460ms (92ms) | — |
  | Categoria → categorias | 399–483ms (84ms) | — |

  São 6 a 8 quadros de página em branco, que se leem como "piscou" ou "recarregou". O A02 corrigiu o
  contrário (o novo antes do velho) e passou do ponto.
- **Gravidade:** média-alta. Acontece em toda navegação, e o Cesar reclama de piscada.
- **Causa provável:** `src/scripts/troca.js`, com `SAIDA = 0.26` (linha 46). Além disso, `chegar()` (linhas
  353–354) começa cada folha em `z = -1600` (pequena, lá no fundo), com a opacidade de 0 a 1 **linear em
  280ms**: a folha nova só "aparece" 0,15 a 0,2s depois de começar.
- **Correção:** `SAIDA` de 0.26 para 0.18–0.20, e a opacidade da chegada em ~160ms com ease-out (ou
  começando em 0.25). Meta: no máximo 2 quadros de mesa vazia. O A02 não volta: as antigas caem para
  baixo, para fora da tela, e as novas chegam do fundo, pequenas, no alto. Elas não se cruzam no espaço.

### 3. Artigo anterior com a página no fim: o rodapé fica por cima do título novo (média-alta)

- **O que acontece:** entre 99 e 265ms, o rodapé do site da página antiga ("Cesar Schutz blog",
  "Conteúdo", "Autor", "© 2026…") fica nítido por cima de "SIGTERM e SIGKILL / O ciclo de término…" da
  página nova. É texto sobre texto por ~170ms. No próximo, o rodapé velho também passa por cima da
  lateral nova (166–286ms), mais discreto.
- **Gravidade:** média-alta. É a "sobreposição estranha" que o Cesar descreve. Ele disse que o anterior
  estava bom, mas com a página rolada até o rodapé isto aparece.
- **Causa provável:** `src/scripts/troca.js`, `trocarDeLado()`, linha 554. O `rodape-velho` esmaece em 200ms
  com `CUBIC_IN` (quase inteiro nos primeiros 100ms). No anterior, a página nova (a raiz, sem animação,
  `base.css:591`) já está inteira embaixo dele, e nada cobre aquela faixa.
- **Correção:** o rodapé velho some em 90–100ms com ease-out (`cubic-bezier(0.33, 1, 0.68, 1)`). Ou, mais
  bonito no anterior: o rodapé sai junto com a folha tirada, com o mesmo `translate(W*0.6px, 20px)
  rotate(4deg)` do `artigo-velho`.

### 4. Sumário: a lista salta a cada seção nova e sobra um risco no lugar errado (média)

- **O que acontece:** a seção atual passa para o peso 600, e o nome dela quebra noutra linha.
  - Em 1376ms, "Por que logging estruturado" vira duas linhas e empurra a lista inteira ~11px para baixo.
  - Em 2656ms, a seção volta para uma linha, e a lista sobe.
  - O traço que está sendo apagado foi medido no layout de antes. Por ~100ms (2656–2690ms), ele fica como
    um **risco sobre "LogstashEnc…"**, a seção nova.
- **Gravidade:** média. O Cesar notaria, porque a lateral treme durante a leitura e o "risco" lembra o
  B04.
- **Causa provável:** `src/components/Sumario.astro`, `.secao > a[aria-current="true"] { font-weight: 600; }`
  (~linha 299). Soma-se a isso `src/scripts/artigo.ts`, `marcarSumario()`: o `apagarSublinhado` do link
  que sai usa o desenho medido antes da mudança de peso. As subseções que abrem na seção atual
  (`.secao:has(> a[aria-current]) > .subsecoes { display: block }`) fazem o mesmo nos posts com `###`.
- **Correção:** não mudar a métrica do texto.
  - Manter o peso 400 e marcar só com a cor e o sublinhado à caneta.
  - Para o "negrito", usar `-webkit-text-stroke: 0.3px currentColor` (ou `text-shadow: 0.35px 0
    currentColor`), que não muda a largura; ou reservar a largura em 600 com um `::after` invisível
    (`content: attr(data-texto); font-weight: 600; visibility: hidden; height: 0; display: block`).
  - Com o layout fixo, o risco some sozinho.

### 5. Abertura da home: o aceno vem antes do desenho, não depois (média)

- **O que acontece:**
  - Em 3151ms chega o `cs:aberto`.
  - Em 3563ms (0,4s depois), os dois cadernos acenam, juntos.
  - O desenho do destaque começa em ~3,3s e só termina em 5477ms (`cs:desenhou`).

  O B13 pede o aceno depois do desenho.
- **Gravidade:** média. É exatamente a ordem que o Cesar pediu.
- **Causa provável:** `src/components/Abertura.astro`, `acenoNoFim()`, com
  `document.querySelector("[data-desenhar] svg.ilustracao")`. Ele pega o primeiro no DOM, que é a
  miniatura da **lista** (`ItemLista`, `.item.destaque .miniatura`). No modo cards ela está escondida, com
  um retângulo 0×0 (medido). `r.bottom > 0` dá falso, o código cai no ramo "abaixo da dobra" e chama
  `setTimeout(acenar, 400)`.
- **Correção:** pegar o desenho visível:
  `[...document.querySelectorAll<HTMLElement>("[data-desenhar] svg.ilustracao")].find((s) => s.getClientRects().length > 0)`.

### 6. Livro ampliado: pisca ao abrir e ao fechar (média)

- **O que acontece:**
  - **Ao abrir:** em 87ms o livro some do painel (o painel fica vazio). A cópia no visor surge quase
    transparente e só fica opaca em ~190ms. O livro parece apagar e acender.
  - **Ao fechar:** um quadro com o painel vazio (553ms, gravado sem trace) entre o fim do voo de volta e
    a volta do livro de verdade.
- **Gravidade:** média. É a piscada no gesto principal do livro.
- **Causa provável:**
  - Ao abrir: `src/styles/visor.css:25–28`, com `.visor[open] { animation: visor-entra 0.22s }`, também vale
    para `.visor-livro`. O diálogo inteiro, com a cópia do livro, esmaece a partir de 0. Enquanto isso,
    `src/components/LivroAmpliado.astro` já fez `g.set(caixa, { opacity: 0 })` na origem.
  - Ao fechar: `fechar()` chama `dialogo.close()`, e a origem só volta à opacidade 1 no evento `close`
    (`caixaDeOrigem?.style.removeProperty("opacity")`), que é despachado depois, noutra tarefa.
- **Correção:**
  - `.visor-livro[open] { animation: none; }`. O véu (`::backdrop`) continua esmaecendo.
  - Em `fechar()`: `caixaDeOrigem?.style.removeProperty("opacity")` logo antes de `dialogo!.close()`.

### 7. CPU lenta: ~1,1s de tela congelada sem nenhum sinal, depois a coreografia inteira (média)

- **O que acontece:** com a CPU 4× mais lenta (home → artigo):
  - Em 7ms vem o `pageswap`, e a página antiga fica congelada até 1108ms. A caneta do carregando não
    aparece.
  - A chegada **não** é a curta (tipos = `folhas`), porque o `pagereveal` veio em 967ms, abaixo do
    `DEMORA` de 1000ms.
  - Somam-se mais 1,5s de coreografia: o `cs:chegou` só vem em 2494ms.

  Com 0,9s de atraso na **rede**, a caneta funciona.
- **Gravidade:** média. No celular fraco é o caso comum (o próprio B14 mediu ~900ms num artigo).
- **Causa provável:** `src/scripts/troca.js`.
  - O `pageswap` faz `clearTimeout(relogio)` (linha 209): a caneta só cobre a espera **antes** do
    `pageswap`. A demora aqui é depois dele: o parse e o render da página nova, com o
    `<link rel="expect" blocking="render">` e páginas de 160–440 KB.
  - O `curta` é medido no `pagereveal` (linha 449).
- **Correção:**
  - Guardar na sessão o tempo entre `pageswap` e `pagereveal`. Se passar de ~300ms, nas navegações
    seguintes mostrar a caneta **já no clique**, sem os 200ms: ela fica na última imagem congelada. E usar
    a chegada curta.
  - Baixar o `DEMORA` para ~700ms.
  - O peso das páginas (os SVGs embutidos) já estava apontado no B14 como item próprio.

### 8. Artigo anterior e próximo: o painel do desenho fica um bloco vazio por ~0,5 a 0,65s (média-baixa)

- **O que acontece:** a folha nova chega com o painel da ilustração vazio, um retângulo colorido:
  - no próximo, de ~350 a 870ms;
  - no anterior, de ~400 a 750ms.

  Só depois o desenho começa. Parece imagem que não carregou. Na troca geral, o desenho começa no pouso
  (~0,6s de voo), e o vazio fica em ~200ms.
- **Gravidade:** média-baixa.
- **Causa provável:** `src/scripts/troca.js`, `trocarDeLado()`, não dispara `cs:pousou`. O
  `desenharTopoDoArtigo` (`desenho-vivo.ts:180–181`) fica esperando o `cs:chegou`, que só vem no
  `vt.finished` (830ms).
- **Correção:** em `trocarDeLado`, `setTimeout(() => dispatchEvent(new CustomEvent("cs:pousou")), proximo ? 420 : 300)`
  no `vt.ready`. No próximo, é quando o `QUART_OUT` de 700ms já fez ~95% do caminho.

### 9. Artigo próximo: a lateral troca com as duas visíveis ao mesmo tempo (média-baixa)

- **O que acontece:** em 265–300ms, o livro SRE da lateral antiga (sticky, na posição rolada) e o "Neste
  artigo" novo aparecem juntos, a ~50%, no mesmo lugar.
- **Gravidade:** média-baixa.
- **Causa provável:** `src/scripts/troca.js`, linhas 539 e 556. A `lateral-velha` some em 200ms, e a nova
  começa com `delay: 180`.
- **Correção:** a nova começa em 220ms (depois de a velha sumir), ou a velha some em 140ms.

### 10. Pilha (tela grande): o painel do topo fica um retângulo vazio por ~1,1s (média-baixa)

- **O que acontece:** o título "DevOps" esmaece em 150–250ms. De ~250 a ~1390ms, o painel do topo fica
  um bloco colorido sem título e sem livro, enquanto a ação acontece na pilha pequena. Há ainda uma pausa
  de ~300ms entre guardar o livro aberto (553ms) e puxar o outro (854ms). Tudo o mais está limpo, sem
  tremida na emenda.
- **Gravidade:** média-baixa. Parece "carregando" no centro da tela.
- **Causa provável:** `src/components/PainelHome.astro`, na sequência de trocar de livro: o texto sai no
  começo e o novo só entra quando o livro fica em pé.
- **Correção:** manter o título velho até o livro novo sair da pilha e trocar o texto junto com a cor do
  palco. Encurtar a pausa entre guardar e puxar para ~150ms.

### 11. Visor de imagem: ao fechar, aparecem duas imagens juntas (baixa)

- **O que acontece:** em 1402–1488ms, o diagrama do visor (grande, no centro) e o mesmo diagrama na página
  (em outro lugar e tamanho) aparecem sobrepostos. No escuro, isso fica bem visível.
- **Gravidade:** baixa (~0,1s).
- **Causa provável:** `src/styles/visor.css:54–70`. A opacidade leva 180ms com ease-in (lenta no começo) e
  o `scale` vai só até 0.97.
- **Correção:** fechar em ~120ms com ease-out e `scale` 0.94, para sair antes de a página aparecer. Ou
  voltar a imagem até o lugar dela (FLIP), como o livro ampliado faz.

### 12. Abertura no escuro: o fio da caneta quase não aparece (baixa)

- **O que acontece:** nos primeiros ~0,9s, só a caneta anda numa tela vazia.
  - No escuro, a tinta do fio é RGB 38,46,49 sobre 18,21,26 (~1,3:1).
  - No claro, é 183,184,179 sobre 242,241,237 (~1,7:1).
- **Gravidade:** baixa. O escuro só aparece para quem o escolheu (C01).
- **Causa provável:** `src/components/Abertura.astro`,
  `[data-modo="estante"] .fio-tinta { stroke: var(--tabua-borda) }`.
- **Correção:** o fio em `--ink-2` enquanto é traço de caneta, passando para `--tabua-borda` quando
  engrossa e vira a tábua.

### 13. Carregando: a caneta some de uma vez antes de as folhas caírem (baixa)

- **O que acontece:** a caneta some de um quadro para o outro (876 → 891ms, com a página atrasada), e a
  tela fica parada ~130ms antes de a queda começar.
- **Gravidade:** baixa.
- **Causa provável:** a `.carregando` está na raiz antiga, que o tipo `folhas` esconde
  (`base.css:587`, `::view-transition-old(root) { display: none }`).
- **Correção:** `view-transition-name: carregando` na `.carregando`, esmaecendo a imagem antiga dela em
  ~150ms dentro de `cair()`. Ou completar o traço até o fim antes de sumir.

### 14. Abertura com o caderno: no voo, ele passa por cima do nome (baixa)

- **O que acontece:** o caderno vai do centro até a marca em linha reta e cruza "Cesar Schutz" no
  cabeçalho (2173–2207ms) antes de pousar à esquerda do nome.
- **Gravidade:** baixa.
- **Causa provável:** `src/components/Abertura.astro`, `caderno()`. O `x` e o `y` andam com o mesmo
  `power2.inOut`.
- **Correção:** fazer um arco, com o `y` em `power2.out` e o `x` em `power2.inOut` (ele sobe primeiro e
  chega por baixo da marca), ou ancorar o fim do voo na borda esquerda do nome.

## Observações (sem defeito, para o Cesar decidir)

- **Desfile de Categorias:** leva ~3,3s até a grade ficar pronta, toda vez (decidido na D51: "sempre").
  Na segunda visita da sessão, poderia ser o desfile curto.
- **Duração da troca geral:** a chegada termina em 1,6 a 1,9s (`cs:chegou`), sem estalo no pouso (a
  desaceleração medida é contínua). Os últimos ~0,5s são ajustes finos. Se o Cesar achar lento, a duração
  da folha (1000ms) pode ir para ~750ms.
- **Ficha dos atalhos a 1280px:** abaixo de 1300px (sem o sumário ao lado), ela usa o véu escuro, a regra
  do celular. Notebooks comuns de 1280px verão o véu.
- **Rede lenta pelo CDP:** o `Network.emulateNetworkConditions` não atrasou a navegação. Por isso usei o
  servidor com 0,9s de atraso no HTML (`scratchpad/rev/servidor-lento.py`).
