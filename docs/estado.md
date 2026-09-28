# Estado do projeto

Este arquivo é um painel, não um diário: fase atual, o que está pronto, próximos passos e perguntas
abertas. O que for aprovado sai daqui e fica no histórico do git e em `docs/decisoes.md`.

## Fase atual

**Publicado em 25/09/2026 em <https://blog.cesarschutz.com.br>** (repositório `cesarschutz/blog`,
D34): todo push na `main` publica o site. O blog antigo continua em `cesarschutz.com.br`.

**Fases 1 a 7 prontas em 24/09/2026, só local.** No mesmo dia entrou o ajuste visual "Folhas claras"
(D26, briefing §4) e, depois, a lista e os cards no formato antigo com a home paginada (D27) e o
painel lateral com as pilhas de livros (D28), a página de categoria (D29) e os livros no padrão da
coleção de `docs/capas` (D30), o cabeçalho fixo com Categorias e Séries e as páginas de livros
(D31), e as categorias em "edição de estudo" com a série como revista em `/series/java/` (D32).
Por último, a lista de ajustes da D33: marca "cs", cabeçalho e rodapé do blog atual, menu de
aparência com som, post-it das frases, topo do artigo como no antigo (título inteiro, descrição, foto),
sumário em trilho, texto mais largo, "Todos os artigos" e tags com a estante de filtro, livro ampliado,
livros invertidos no escuro, ilustrações maiores e os bugs da apresentação e do visor corrigidos.
Tudo isso **aguarda a aprovação do Cesar** (antes e depois mostrados a ele). A virada do
domínio (`docs/virada.md`) só acontece com o OK dele; nada foi commitado nem publicado.

**Configuração de posts (D35), 25/09/2026, na branch `configuracao-posts`:** processo único de post
(skill `post`, modos Novo e Adaptar), `DESIGN.md` na raiz, pasta `entrada/`, skills Impeccable, GSAP
e web quality lidas e instaladas, MCPs `astro-docs` e `chrome-devtools`, `npm run setup` com hook no
início da sessão, revisão em lote em `.claude/revisao-posts.md` (26 posts pendentes). Junto: o livro
inclinado não tomba mais e as lombadas da Carreira e da série usam a variante de texto pequeno.
Depois, também em 25/09/2026: plugin `frontend-design` desinstalado, conferência do blog só pelo
MCP `chrome-devtools`, `PRODUCT.md` do Impeccable (`/impeccable init`, fluxo "direto no código") e a
regra de código e SQL testados antes de publicar (skill `post`) e a regra de qual ferramenta
anima o quê (CSS, View Transitions nativas, GSAP), no `DESIGN.md`.

## Como ver

- `fnm exec --using=24 npm run dev -- --host 127.0.0.1`: o Astro 7 sobe em segundo plano (hoje <http://127.0.0.1:4322>).
  Para parar: `fnm exec --using=24 npx astro dev stop`. No dev a busca avisa que não há índice.
- Busca e PDFs: `npm run build` e `npm run preview -- --host 127.0.0.1 --port 4323` (hoje no ar em
  <http://127.0.0.1:4323>; para parar, `npx astro preview stop`).
- Só no dev: `/amostra/` (tokens, fontes, avisos), `/amostra/markdown/` e `/amostra/mdx/` (recursos
  de Markdown) e `/amostra/desenhos/` (folha das ilustrações).
- Post de referência com ilustração e as três lousas: `/posts/cobranca-duplicada-no-retry/`.

## Pronto

- **Fases 1 a 3:** base Astro 7 + TS 6, tokens (D4), fontes (D5), tema (D24); os 26 posts migrados
  (D15), rotas, RSS, sitemap e redirecionamentos (D7); busca com Pagefind (D2); home com estante,
  gaveta, destaque, recentes e tags.
- **Fase 4:** artigo com sumário, notas laterais, avisos, código, barra de leitura, voltar ao topo,
  visor de imagens e apresentação com PDF (D9).
- **Fase 5:** ilustração com recortes (D11), validador, centralizador e folha de conferência; imagem
  de compartilhamento pelo Chrome (D10); as três lousas e a frase em destaque (D21).
- **Fase 6:** os 26 posts com ilustração (8 da série Java por script, D17; 17 desenhados um a um).
- **Fase 7:** Lighthouse no celular: home 94, posts 89 a 91, arquivo 99 em desempenho; 100 no resto.
  Teclado, foco visível, revisão nos dois temas e no celular. Deploy e plano de virada prontos.
- **Ajuste visual (D26):** tokens novos, folhas, azul-tinta no que é clicável, IBM Plex Sans na
  interface, desenhos em painéis tingidos, busca como campo, botão de tema, sumário à esquerda com a
  barra "NN% lido" embaixo, largura do blog atual (1320px) e as 27 imagens de compartilhamento
  regeradas. Conferido: `astro check` 0/0/0, build (`--force`), links (0 quebrados), contraste
  (0 falhas), validador (29 de 29), sem rolagem lateral em 390 e 320 px.
- **Lista, cards e paginação (D27):** no formato do blog atual (título inteiro e grande, descrição
  completa, tags) e a home paginada de 12 em 12 (`/`, `/2/`, `/3/`), no lugar do link para todos os
  artigos.
- **Painel lateral da home (D28):** séries e categorias em pilhas de livros deitados (os mesmos da
  estante), as 10 tags mais usadas e o RSS, à esquerda da lista, parado enquanto a lista rola.
- **Página de categoria (D29):** o livro em pé no topo, que chega da pilha do painel por transição
  de página; embaixo, os artigos com Lista / Cards.
- **Livros da coleção (D30):** capas, estante, lateral e página do livro pela regra de
  `docs/capas/CAPAS.md`; oito categorias novas (IA e Carreira ainda vazias), posts reclassificados,
  URLs antigas redirecionando; o livro aberto na gaveta fica em três quartos; fontes Bitter e
  Newsreader.
- **Cabeçalho e páginas de livros (D31):** cabeçalho fixo com Artigos, Categorias, Séries e Tags;
  `/categories/` e `/series/` com os livros lado a lado; `/java/` com o livro da série no topo.
- **Edição de estudo e revista (D32):** capas, lombadas em pé e deitadas no visual novo de
  `docs/capas`; a série como revista técnica, com a tarja do guia; a página da série em
  `/series/java/` (`/java/` redireciona).

- **Lista de ajustes da D33:** marca "cs" (cabeçalho, rodapé, abertura e ícone do navegador),
  GitHub e LinkedIn no cabeçalho, menu de aparência (claro, escuro, sistema e som), rodapé do blog
  atual, abertura com o texto do antigo e o post-it das frases, Lista / Cards com ícones, "26 artigos
  publicados", calendário e relógio em todas as datas, topo do artigo como no antigo (título inteiro,
  descrição, foto e nome) com a marca d'água do livro, sumário em trilho, texto em 760px, aviso de IA
  sem "Saiba mais", cartão "Do livro", Sobre removida, "Todos os artigos" e tags com a estante de
  filtro, livro ampliado, som dos livros, livros invertidos no escuro com a lombada do livro grande
  igual à da estante, ilustrações com recortes justos, apresentação e visor de imagens consertados.
  Depois, no mesmo dia: a abertura refeita como cena (estante e post-it juntos), a frase sorteada a
  cada visita, as 132 frases revisadas contra a fonte (125 ficaram, todas com origem), os chips de
  categoria levando à página da categoria e o som do painel funcionando também depois de navegar.
- **Primeiro post novo pela skill `post` (25/09/2026):** `/posts/jackson-filtros-mascarando-cartao/`,
  adaptado de `entrada/` (Desenvolvimento de Software; Spring, Logs, Pagamentos), com ilustração e
  uma lousa de passos. Código rodado com Jackson 3.2.3 e 2.21.0 e com Spring Boot 4.1.1. Entraram
  as quatro sugestões aprovadas (PCI DSS, `JsonMapper.Builder` do Boot, frase do mapper padrão
  conferida, Fontes).
- **Sumário sem números (D36, 25/09/2026):** só um ponto no trilho de cada seção, em todos os posts.
- **Auditoria de acabamento (D37, D38, 25/09/2026), só local, sem push:** relatório em
  `.impeccable/review/auditoria/relatorio.md` (fora do git, com screenshots, traces e Lighthouse) e
  oito lotes, um commit cada: quebras visíveis (rolagem lateral em 375 e 320px, 4 imagens de
  compartilhamento, quebra depois do ponto, barra dupla da busca); acessibilidade (rótulos das
  lombadas, contrastes, títulos da página 2, 404 sem índice, alvos de 24px, foco do Copiar); busca
  sem resultados falsos; DOM e peso (cards em `<template>`, blocos de código com
  `content-visibility`); post-it por tema (`temas` nas frases) e com altura fixa; metadados (JSON-LD,
  `og:image:alt`, RSS); DESIGN.md e textos aprovados. Depois, a D38: post-it no fim do artigo e visível
  desde o início, som desligado, capa da gaveta levando ao livro, filtro com botões e "Limpar filtro",
  tags da lista como links, cabeçalho que se esconde no celular, abertura mais curta e um só botão de
  compartilhar no celular. Lighthouse no celular: 100 em acessibilidade, boas práticas e SEO nas 7
  páginas medidas; sem rolagem lateral em 120 combinações de página, largura e tema.

- **Acabamento de design (D39, 25/09/2026), só local, sem push:** cinco lotes, um commit cada:
  1 livros de cor fixa (categoria sempre com o papel em cima, série sempre clara), a pilha lateral
  com a mesma lombada da estante, o livro escolhido escurecido (sem contorno azul) e o livro aberto a
  72°; 2 botão de tema direto (lua ou sol), o som removido e a troca de tema sem pulo (a borda da
  lousa mudava de 1 para 3px); 3 barras de rolagem finas, sumário sem rolagem lateral, `<wbr>` no
  código em linha, etiqueta da linguagem no código, diagramas antigos escuros por filtro, travessão
  preso; 4 sumário na cor do livro e "Do livro" compacto embaixo dele; 5 Séries com destaque largo e
  Tags com os artigos de cada tag. Depois do OK às propostas: 6 as frases de autores e o post-it
  saíram do blog (o Cesar não gostou das duas propostas); 7 lousa de passos com passos próximos no
  desktop e "◀ 2 de 5 ▶" no celular, tablet e movimento reduzido; 8 texto em 720px (~72
  caracteres), blocos largos na largura do cartão, corpo sem cartão no celular e a marca d'água no
  topo da categoria e da série e no fim do artigo. Antes e depois em
  `.impeccable/review/acabamento/index.html` (fora do git).

- **Livros em movimento (D40, 25/09/2026), só local, sem push:** GSAP sob demanda
  (`src/scripts/gsap.ts`) e cinco lotes: 1 a estante responde ao mouse (home e filtro, com legenda);
  2 a estante em repouso (luz e espiadinhas, só a home); 3 a pilha lateral (sai 14px, o atual puxado
  na chegada); 4 tirar da estante e abrir (a gaveta nova, com o `Livro3D` inteiro: contracapa, lombada,
  bordas, página e capa com verso); 5 capas com profundidade e o livro ampliado com embalo. Capturas e
  traces do celular (CPU 4×) em `.impeccable/review/movimento/index.html` (fora do git).

- **Desenho do destaque e marca que abre (D41, 25/09/2026):** do pedido de animar o resto do site
  ficaram a marca "cs" que abre como livro (só CSS) e o desenho que se desenha só no destaque da
  home. O caderno marcado da D41 foi substituído pela caneta do caderno (D48).

- **Tema em círculo e Lista / Cards com esmaecer (D42, 26/09/2026), só local, sem commit:** o tema
  novo se espalha em círculo a partir do botão (View Transition do documento) e a troca Lista / Cards
  esmaece uma forma e traz a outra subindo 8px. Conferido no dev (desktop e 390px, os dois temas,
  cliques rápidos), `astro check` sem erros e console limpo. Aguarda o Cesar ver.
- **A gaveta volta ao sumário (D43, 26/09/2026), só local, sem commit:** o livro sai da estante (o
  lugar fica vazio) e voa fechado até a gaveta, ao lado do sumário de antes da D40 (filtro e lista
  por ano). Conferido no dev: voo medido quadro a quadro, troca de livro, clique durante o fechamento,
  a mesma lombada guardando, celular (390px) e mudança de largura com o livro aberto.
- **Ajustes da home (D44, 26/09/2026), só local, sem commit:** sem o brilho da estante, tema que
  fecha ao voltar ao claro, home sem o painel lateral, títulos em duas partes (lista, cards, destaque
  e artigo), a busca que nasce do campo e o fio embaixo do cabeçalho. Conferido no dev e no preview.
- **Caneta da leitura (D45, 26/09/2026), só local, sem commit:** o progresso do post passou para o fio
  do cabeçalho, escrito por uma caneta. Conferido nos dois temas e no celular (cabeçalho escondido).

- **Parte 1 da lista de 26/09/2026 (D46), publicada:** controle em `docs/controle-parte1.md`. Livro
  3D a 38° em todo lugar, sem a capa que segue o mouse, pilha lateral só do tipo da página (o livro
  aberto fora dela, puxar e os de cima caírem, ordem na sessão), livros deitados mais finos,
  cabeçalho do celular sempre à vista com botão de menu, sem a lousa de passos (cobrança e Jackson
  agora com a linha do tempo de arrastar), artigo com a coluna da esquerda desde o topo, texto na
  largura da folha e o livro grande embaixo do sumário.

- **Caneta do caderno (D48, 26/09/2026), publicada:** marcações estáticas, caneta
  azul fixa que não pinta o texto, marca-texto amarelo, os 20 tipos do catálogo
  `docs/prototipos/caneta-do-caderno.html` em diretivas e nos blocos de código, Caveat só nos posts
  com nota, limites cobrados no build, `npm run contraste` com a caneta e o amarelo, catálogo em
  `/amostra/caneta/`, skill `caneta` (a última etapa da skill `post`) e o guia vivo
  `docs/marcacoes.md` com "Ajustes do Cesar". As marcações da D41 saíram dos 27 posts (texto
  idêntico). Os pilotos (JWT e chave de idempotência) têm 12 marcações cada, pela proposta aprovada,
  testados em 320, 390, 768, 1280 e 1600px nos dois temas; antes e depois em
  `.impeccable/review/caneta/index.html` (fora do git).

- **As ideias de movimento revistas (D49, 26/09/2026), publicada:** os protótipos de
  `docs/prototipos/ideias/ja feitas ou reprovadas/`, na ordem, um commit cada, com as observações do
  Cesar: C2 (o sumário que acompanha a leitura e o voltar ao topo em toda página longa); D1 (a estante
  de verdade: o livro tomba pela cabeça, sai da prateleira e o vizinho tomba; dá para puxá-lo com o
  mouse); D2 (o livro ampliado que abre, com as páginas de dentro); D3 (a pilha com peso: o livro
  aberto volta para a pilha antes de o outro ser puxado); E1 (o traço de caneta que desliza no menu, a
  tecla ⌘K que afunda, o sol e a lua animados e o sinal do RSS); E2 (a pílula que escorre, o colchete
  na lista, o círculo na paginação e no GitHub e LinkedIn, o contador que rola no filtro); E3 (a tinta
  do link, o "Copiado" no código e no link, a etiqueta da linguagem corrigida nos blocos sem título, a
  seta e a orelha de anterior e próximo, o voltar ao topo que assenta); E4 (a 404 com a estante, a
  rasura e a sugestão; o marcador e a ondinha da busca; os minutos que rolam). O C3 (o código que
  responde) ficou de fora, a pedido do Cesar. Conferido: check, contraste, build, links e 100
  combinações de página, largura e tema, sem rolagem lateral nem erro no console.

- **Ajustes de 27/09/2026 (D50), só local, sem commit:** o traço da leitura fino de novo, a troca de
  livro pela pilha levando o livro até o topo (como na home), os links do livro ampliado, o cabeçalho
  sem tremer na troca de página, a troca de tema sem o fundo escuro antes e sem o botão branco, a
  marca d'água no painel do título do artigo e os atalhos de teclado no artigo. Commitados pelo
  Cesar (131085e), sem push.

- **Animações revistas (D51, 27/09/2026), aplicadas e commitadas (sem push):** o Cesar escolheu nos
  protótipos de `docs/prototipos/animacoes/` (abertura A3, caderno que vai para o cabeçalho, troca
  "cai da mesa" com texto fora, desfile e pilha em Categorias, desfile direto na tag, "na pilha" no
  artigo vizinho, só o livro viaja, desenho depois de pousar). Aplicado no site, com duas revisões de
  acabamento por agentes (abertura/Categorias e trocas gerais) e as correções delas conferidas quadro
  a quadro. Commitado pelo Cesar (6ffbc45, a441fdd, 32d5a28, 8e708fd).

- **Ajustes de 27/09/2026 (D52), commitados item a item, sem push:** três folhas de pedidos do Cesar
  depois da D51 (`docs/ajustes-d52/controle.md`), com vários agentes na mesma árvore. Acabamento das
  animações (abertura sem responder ao mouse e sem piscar, o caderno pautado, a mesa que se limpa
  antes da chegada, o livro anterior/próximo, a pilha de Categorias sem tremer no fim, o voo do livro
  entre Categorias e a página dele, o aceno dos cadernos, os diagramas escuros no visor); bugs do
  artigo e do livro ampliado (sumário que chega zerado, a leitura só na caneta azul, "?" só para os
  atalhos no artigo — com a ficha redesenhada —, anterior/próximo pela data, o hover do livro
  ampliado, a linha entre lombada e capa); o topo de "Todos os artigos" e das tags (com o ícone por
  tag, obrigatório); a lentidão em rede e CPU fracas (pré-carregar por Speculation Rules, a caneta do
  carregando, a chegada curta); e três novidades — tema claro e cards como padrão, válido por 3 dias;
  o destaque dentro da grade da home (paginação de 12 lugares, o destaque valendo dois); o
  código-fonte dos artigos (campo `codigo`, pílula no topo, sinal nas listas). Detalhe item a item em
  `docs/decisoes.md` (D52). **Falta o C05** (ver "Próximos passos").

- **Revisão de acabamento das animações da D52 (depois do C04), 27/09/2026, commitada correção a
  correção, sem push:** um agente gravou as dez cenas da D52 juntas, quadro a quadro, e achou 15
  problemas de acabamento (piscadas, "mesa vazia" nas trocas, sumário que saltava, painéis vazios,
  pilha travando no celular, caneta do carregando…); três agentes corrigiram, um commit por correção
  ("D52 revisão N"), mais o bug de quebra achado no caminho (a pilha vazia ao voltar pelo histórico,
  `clearProps: "all"` do GSAP). Detalhe em `docs/decisoes.md` (D52) e nos relatórios de
  `docs/ajustes-d52/diagnosticos/`.

- **C04 (a caneta em preto como identidade), 27/09/2026, commitado em seis lotes, sem push:** a regra
  **a caneta preta desenha; a azul marca** (o preto é a tinta de sempre, `--ink`; o azul fica só no
  estado). Ícones de data, tempo e código-fonte à mão; o rascunho do mouse (menu, colchete da lista,
  círculo da paginação) em preto; GitHub e LinkedIn com as marcas oficiais; o botão de tema e a busca
  redesenhados sem perder a animação; a caneca da série Java com a fumaça que se escreve de novo no
  hover; e a assinatura embaixo de "Schutz" na home. Nada no rodapé. Detalhe em `docs/decisoes.md`
  (D52) e no relatório `docs/ajustes-d52/diagnosticos/C04.md`.

## Próximos passos

000. **D52:** falta o **C05** (a papelaria de estudo: post-it, ficha do livro, a cola dos atalhos e o
     carimbo das fontes) — **sem commit**: o Cesar avalia no localhost antes de decidir. O **C04** (a
     caneta em preto como identidade) entrou nesta rodada. As perguntas que a pesquisa e os
     diagnósticos deixaram estão em "Perguntas abertas".

00. **Caneta (D48):** os outros 25 posts recebem a caneta na revisão (`.claude/revisao-posts.md`,
    coluna "Caneta"), pela skill `caneta`, com a proposta aprovada pelo Cesar antes de aplicar.

0. A D42 a D45 foram publicadas junto com a D46 (26/09/2026). Pendente de resposta: as cores da capa na gaveta (a referência dele tinha a cor do livro em cima;
   hoje, pela D39, o papel fica em cima) e se o título em duas partes vale também na gaveta e no
   "anterior / próximo".
0.0. Publicar a D39, a D40 e a D41: o Cesar dá o push quando revisar. Os ajustes pedidos depois da D40 já
   entraram: "Próximas ▸" virando a folha, capa entreaberta a -40° e a pilha mais grossa.
0.1. Publicar a auditoria de acabamento (D37, D38): o Cesar dá o push quando revisar. Fora dela ficou
   o lote 7 (topo do post e miniatura da lista mais compactos no celular), que mexe na densidade da
   D27 e da D33.
1. Aprovação do ajuste visual (D26 a D33) e retoques; depois, medir o Lighthouse de novo (a
   fonte da interface soma 45,7 KB, e ele não foi medido depois do ajuste).
2. A página Sobre: o Cesar escreve depois (D33). Até lá, `/about/` leva à home.
3. Decidir com o Cesar o que fazer com o blog antigo (D34): os dois têm os mesmos artigos. Ou o novo
   fica fora dos buscadores (`noindex`) até o antigo sair, ou o antigo passa a redirecionar para o
   novo, ou a virada do domínio principal (`docs/virada.md`).
4. Medir a busca e o Lighthouse no site publicado (regra 4 da D2).

## Perguntas abertas para o Cesar

1. O blog atual vai receber posts durante o projeto? A migração parte do commit `0184562` (conferido
   hoje: ainda é o último).
2. Confira no app do Google Drive se `~/Downloads` não está em "Backup de pastas do computador".
3. Desempenho no celular: o que mais pesa agora é a Literata com o eixo `opsz` (107,5 KB), exigida
   pelo briefing. A versão só com peso tem 51 KB e anteciparia o primeiro texto em ~0,5 s. Troca?
4. D51: o desfile de Categorias (~3 s) fica assim ou encurta? O desfile mais curto depois do caderno
   da abertura fica? A troca de livro pela pilha da home e a navegação com a busca ou o livro ampliado
   abertos (que seguem com a troca antiga, a folha que sobe e some) passam para a troca nova?
5. D52, B11: os 20 objetos dos ícones de tag ficam (principalmente os menos óbvios: semáforo de
   ferrovia para Concorrência, moedor de café para JVM, espeto de notas para AOP, âncora para LTS)? E
   a marca d'água da tag girada −8° (a dos livros não gira)?
6. D52, B13: com o destaque abaixo da dobra (tela baixa ou celular), o aceno dos cadernos espera o
   leitor rolar até o desenho. Prefere assim, ou o aceno sempre logo depois da estante?
7. D52, pesquisa: GitHub e LinkedIn no cabeçalho — manter os ícones à mão de hoje (Lucide, não os
   logotipos oficiais) ou trocar pelas marcas oficiais em preto (as duas proíbem redesenhar a marca,
   mas aceitam o preto)?
8. D52, pesquisa (para o C05): a Caveat (a letra de mão das notas da caneta, D48) sai das notas para
   os títulos curtos da papelaria de estudo ("Neste artigo", "Do livro", "Atalhos do teclado")?
9. D52, pesquisa: um campo novo no frontmatter com a data em que as fontes do post foram conferidas,
   para um carimbo "conferidas em \<data\>" no fim do artigo, ao lado de "Fontes"?
10. D52, C04: o traço leve dos links do rodapé continua azul (D49). Mantém, passa a preto como o
    cabeçalho, ou tira ("ali é profissionalismo")?
11. D52, C04: o colchete da lista e o círculo da paginação foram para o preto, além do que foi pedido
    (coerência com "todo rascunho do mouse é preto"). Ficam assim, ou voltam ao azul?
12. D52, C04: o visto dentro do calendário ("o dia marcado") dá cara de bloquinho, mas pode ser lido
    como "artigo já lido". Mantém, ou o calendário fica sem marca?
13. D52, C04: o traço curto embaixo do "blog", no hover da marca do cabeçalho, é opcional e discreto.
    Fica ou sai?
14. D52, C04: a assinatura entra uns 5s depois de abrir a home (depois da estante, do desenho do
    destaque e do aceno). Cedo demais, ou tarde? Se parecer tarde, pode vir junto com o aceno. No
    celular (390px), a home não mostra o nome grande, então não há assinatura ali.

## Riscos a acompanhar

- Tremor (`feTurbulence`) nas lousas animadas: medido com CPU 4× e DPR 3 no Chrome desta máquina,
  60 quadros por segundo (2 quadros lentos em 259). Falta conferir num iPhone de verdade.
  Plano B, se pesar: gravar o tremor na própria geometria, no build.
- A imagem de compartilhamento precisa de Chrome no build (D10); os runners do GitHub Actions têm.
- A busca não foi medida no GitHub Pages real (regra 4 da D2): conferir no site publicado (D34).
- D52, B14: o `prerender` (página pronta antes do clique, troca instantânea) fica como ideia para
  depois — exigiria revisar todos os scripts que rodam ao carregar (abertura, desenhos, contagem de
  visitas) para esperar a ativação.
