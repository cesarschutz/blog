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

- **Caderno marcado, desenho do destaque e marca que abre (D41, 25/09/2026), só local, sem push:** do
  pedido de animar o resto do site, o Cesar viu os lotes e pediu para desfazer tudo menos três coisas:
  a marca "cs" que abre como livro (só CSS), o desenho que se desenha só no destaque da home e o
  caderno marcado (diretivas `:marca`, `:sublinhado`, `:circulo`, `:::termos`, `:::colchete`, com
  `remark-directive`). Em 26/09/2026, marcações aplicadas nos 27 posts (de 12 a 30 cada, densidade de estudo; ficam depois de marcadas); posts novos as recebem pelo plano
  da skill `post` (guia em `docs/marcacoes.md`; coluna "Marcações" na revisão).

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

## Próximos passos

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

## Riscos a acompanhar

- Tremor (`feTurbulence`) nas lousas animadas: medido com CPU 4× e DPR 3 no Chrome desta máquina,
  60 quadros por segundo (2 quadros lentos em 259). Falta conferir num iPhone de verdade.
  Plano B, se pesar: gravar o tremor na própria geometria, no build.
- A imagem de compartilhamento precisa de Chrome no build (D10); os runners do GitHub Actions têm.
- A busca não foi medida no GitHub Pages real (regra 4 da D2): conferir no site publicado (D34).
