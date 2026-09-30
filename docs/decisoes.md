# Decisões

Registro curto das decisões do projeto. Cada entrada traz data, status, decisão, motivo e
alternativas. Os status possíveis são **proposta** (aguarda o Cesar), **aprovada** e **substituída
por Dn**. Decisão nova entra no fim e ganha uma linha no índice. As decisões de produto e design já fechadas estão em `docs/briefing.md` e não se repetem aqui.

## Índice

A coluna "Hoje" diz o que vale agora; o status de cada entrada é o do dia em que ela foi escrita
(de D27 a D33, "aguardando aprovação", foram aprovadas e publicadas na D34).

| # | Decisão | Hoje |
|---|---|---|
| D1 | Framework: continuar no Astro 7 | em vigor |
| D2 | Busca: Pagefind com interface própria (escolhido por medição) | em vigor |
| D3 | TypeScript 6, Node 24 e npm | em vigor |
| D4 | CSS próprio com tokens | em vigor |
| D5 | Fontes | em vigor |
| D6 | KaTeX servido pelo site | em vigor |
| D7 | URLs preservadas | em vigor |
| D8 | Validar e renderizar desenhos com `playwright-core` | em vigor |
| D9 | PDF da apresentação: gerador próprio + sharp no build | em vigor |
| D10 | Imagem de compartilhamento: página fotografada pelo Chrome no build | em vigor |
| D11 | Onde ficam ilustrações e lousas, e o formato da ilustração | em vigor (ilustrações e lousas) |
| D12 | Infográfico do NotebookLM não é portado | em vigor |
| D13 | Sem pré-visualização publicada por enquanto | mudou na D34 (publicado) |
| D14 | "Apresentação" sempre sem número | em vigor |
| D15 | Migração com o conteúdo como está | em vigor |
| D16 | Abertura da home com os textos do protótipo | em vigor |
| D17 | Ilustrações da série Java geradas por script | em vigor |
| D18 | Git só local | mudou na D34 (repositório no GitHub) |
| D19 | Bloqueio de edição no blog atual | em vigor |
| D20 | Onde os protótipos divergem do briefing (vale o briefing) | em vigor |
| D21 | Posts em MDX: RSS e "Apresentação" | em vigor |
| D22 | Contraste sem mudar os tokens | em vigor |
| D23 | Cor de destaque da série Java: a fita | em vigor |
| D24 | Tema: escolha guardada com a chave do blog atual | em vigor |
| D25 | Favicon novo | em vigor |
| D26 | Variação "A. Folhas claras": folhas, azul-tinta, IBM Plex Sans e desenhos com palco | em vigor |
| D27 | Lista e cards no formato do blog atual, e a home paginada | em vigor; a 1ª página com 11 artigos desde a D52 (C02) |
| D28 | Painel lateral da home com séries e categorias em pilhas de livros | o painel saiu da home na D44; a pilha lateral ficou nas páginas de livro (D46) |
| D29 | Página de categoria com o livro em pé e a transição do livro | em vigor |
| D30 | Livros no padrão da coleção (docs/capas): capas, estante, lateral e categorias novas | em vigor |
| D31 | Cabeçalho fixo, menu com Categorias e Séries, e as páginas de livros | em vigor |
| D32 | Categorias em "edição de estudo", séries em revista técnica, e /series/java/ | em vigor |
| D33 | Marca, cabeçalho e rodapé do blog atual, post-it das frases, livros invertidos no escuro e ilustrações maiores | em vigor, menos o post-it das frases (saiu na D39) |
| D34 | Publicação em blog.cesarschutz.com.br, num repositório próprio | em vigor |
| D35 | Processo único de posts, ferramentas do projeto e portabilidade | em vigor |
| D36 | Sumário sem números | em vigor |
| D37 | Auditoria de acabamento das páginas e dos componentes | em vigor |
| D38 | Post-it no fim do artigo, lombada que leva ao livro, tags como links e cabeçalho que se esconde | em vigor, menos o cabeçalho que se esconde (desfeito na D46) |
| D39 | Acabamento de design: livros de cor fixa, lombada única, tema direto, sem som | em vigor |
| D40 | Livros em movimento, com GSAP | em vigor; a ideia 3 foi substituída pela D43 |
| D41 | Caderno marcado, o desenho do destaque e a marca que abre | o caderno marcado foi substituído pela D48; ficaram o desenho do destaque e a marca que abre |
| D42 | Tema em círculo e Lista / Cards com esmaecer | em vigor |
| D43 | A gaveta volta ao sumário, e o livro sai da estante | em vigor |
| D44 | Ajustes da home: títulos em duas partes, busca que nasce do campo e mais | em vigor |
| D45 | A caneta que escreve o progresso da leitura | em vigor |
| D46 | Livros de lado, pilha que troca de livro, menu do celular e o artigo mais largo | em vigor |
| D47 | Marca em degrau, estante que só sobe, abertura do site e o movimento das páginas | em vigor |
| D48 | A caneta do caderno: marcações estáticas, azuis e com 20 tipos | em vigor (tipos e limites mudaram na D56) |
| D49 | As ideias de movimento revistas: sumário, estante, livros, cabeçalho, listas e artigo | em vigor |
| D50 | Ajustes de 27/09/2026: o traço da leitura, a troca de livro, o livro ampliado, o cabeçalho, o tema, a marca d'água e os atalhos | em vigor |
| D51 | As animações revistas: abertura, troca de tela e as trocas especiais | em vigor |
| D52 | Ajustes de 27/09/2026: acabamento das animações, a leitura, as listas, as tags e o destaque | em vigor |
| D53 | Faxina: docs só com documentos, dados dos livros em src/livros | em vigor |
| D54 | Caça aos bugs de 29/09/2026: 40 correções de interação, teclado, impressão, listas e RSS | em vigor |
| D56 | Caneta com 34 tipos e mais marcações por post | em vigor |
| D57 | Livros realistas: capa dura em todos os livros, estante e pilha com volume, livro deitado no "Do livro", livro aberto nos vazios e a série como livro | em vigor |

## D1 · Framework: continuar no Astro 7
- **Data:** 23/09/2026 · **Status:** aprovada (OK do Cesar para a Fase 1, 23/09/2026)
- **Decisão:** Astro 7 (7.3.x) como site estático, sem framework de UI. Scripts vanilla só nos
  componentes interativos, MDX só em posts com componente e Expressive Code para os blocos de código.
  Dependências que hoje chegam por tabela, como o `sharp`, passam a ser declaradas.
- **Motivo:**
  - Gera HTML sem JS por padrão, o que ajuda no Lighthouse e deixa o artigo funcionar sem JS.
  - O MDX permite componentes dentro do Markdown, que é o que as lousas precisam.
  - O Expressive Code já cobre título, linhas, diff e Copiar.
  - É a base do blog atual: plugins, dados, regras e armadilhas conhecidas vêm junto.
  - Tem `astro check` para os tipos.
- **Alternativas:**
  - Eleventy 3: sem schema tipado, e componentes no Markdown são menos práticos.
  - Hugo: diff, lousas e o porte teriam de ser refeitos em Go templates.
  - Next.js export e SvelteKit: runtime JS em toda página.
  - VitePress: voltado para documentação.

  Nenhuma traz ganho real.
- **A conferir:** se o Copiar do Expressive Code ignora as linhas `del`. Se não ignorar, basta um
  plugin pequeno do EC.

## D2 · Busca: Pagefind com interface própria (escolhido por medição)
- **Data:** 23/09/2026 (método) e 24/09/2026 (resultado) · **Status:** método aprovado (OK do Cesar para a
  Fase 1); resultado aplicado, para a revisão final do Cesar.
- **Ponto de partida:** o índice publicado hoje tem 718 KB (254 KB com gzip) com 26 posts. O GitHub
  Pages serve gzip por HTTP/2, com `max-age=600`. A 1,6 Mbps, só o download já leva ~1,3 s, então o
  porte fiel do índice atual já falha a meta de 1 s com os posts de hoje.
- **Candidatas** (mesma interface, mesmos campos, mesmos resultados com trecho):
  - (A) Índice próprio otimizado. Normaliza o texto uma vez só e não usa o array `map`. Faz
    `#tag`, baixa na abertura da busca e lista primeiro as frases exatas, **depois** os posts com
    todas as palavras. Hoje a segunda etapa só roda quando a frase não acha nada.
  - (B) Pagefind 1.5 com UI própria. Indexa só o corpo do artigo (`data-pagefind-body`), porque
    senão o aviso de IA casa com tudo. Normaliza acentos, pesa título > tags > descrição com
    `metaWeights`, usa filtros para `#tag` e divide o índice em fragmentos. Não tem frase exata
    nativa: a reordenação acontece no cliente, com o custo medido.
- **Dados:**
  - Os 26 posts reais e uma curva sintética com 100, 250, 500 e 1.000 posts, gerada com semente fixa
    e fora do conteúdo e do git.
  - Os sintéticos usam parágrafos reais, mas também injetam **vocabulário novo** para crescer como um
    blog de verdade. O tamanho segue a meta nova (1,5 a 3 mil palavras), com alguns posts longos.
  - Frases-marcadoras plantadas permitem conferir o ranking.
- **Ambiente:**
  - Build de produção servido por um servidor local com gzip.
  - Chrome do sistema via `playwright-core` e CDP.
  - Dois cenários: celular simulado (CPU 4× mais lenta, rede "Slow 4G") e sem limitação.
  - Conferir com um laço fixo, a 1× e a 4×, que a limitação de CPU vale também no Web Worker do Pagefind.
  - 10 ou mais rodadas intercaladas, com mediana e p90.
- **Cenários:**
  - abrir a busca e digitar em ritmo humano;
  - entrar por `/?q=` com cache frio;
  - latência por tecla com o índice já carregado;
  - visita repetida depois de 10 min, que obriga a revalidar os arquivos.
- **Métricas:**
  - bytes e número de requisições até o 1º resultado;
  - tempo até o 1º resultado;
  - bloqueio do thread principal ao digitar;
  - memória, incluindo a dos workers;
  - bytes baixados quando a busca nunca é aberta (tem de ser zero);
  - tempo de build e arquivos gerados.
- **Gabarito**, escrito antes de medir: acentos, singular e plural, frase exata primeiro, todas as
  palavras, título antes do corpo, identificadores de código (`AopUtils.getTargetClass`,
  `@Transactional`, `CLOSE_WAIT`, `JEP 444`), `#tag` sozinha e com texto (inclusive tag com espaço,
  como "Banco de Dados"), prefixo enquanto digita, `/?q=`, os atalhos ⌘K, Ctrl+K e `/`, e a relevância
  dos 26 reais misturados aos sintéticos.
- **Regra de decisão:**
  1. A candidata precisa passar no gabarito nas duas escalas (26 e 500 posts), ficar em até 1 s
     no celular e respeitar um limite de bytes.
  2. Entre as que passam, vence a mais rápida com 500 posts.
  3. Diferença de até 10% conta como empate, resolvido pela manutenção. Entra nessa conta se a
     busca funciona no `npm run dev`: o Pagefind exige build.
  4. Quando houver deploy, confirmar o resultado no GitHub Pages real.
- **Resultado (24/09/2026): Pagefind.** Tabela abaixo; dados em
  `scripts/bench-busca/resultados/2026-09-24.json` (índice próprio) e `2026-09-24-pagefind.json`.

  | Posts | Motor | 1º resultado no celular (mediana / p90) | Depois de digitar | Por tecla | Desktop | Baixado até o 1º | Índice |
  |---|---|---|---|---|---|---|---|
  | 26 | Próprio | 2,1 s / 2,1 s | 0,7 s | 3 ms | 25 ms | 247 KB | 0,7 MB |
  | 26 | Pagefind | 2,6 s / 3,0 s | 1,3 s | 18 ms | 116 ms | 223 KB | 0,8 MB |
  | 250 | Próprio | 10,4 s / 10,5 s | 9,1 s | 13 ms | 73 ms | 1,7 MB | 4,9 MB |
  | 250 | Pagefind | 2,8 s / 3,1 s | 1,5 s | 19 ms | 119 ms | 264 KB | 4,4 MB |
  | 500 | Próprio | 20,3 s / 20,4 s | 19,0 s | 25 ms | 130 ms | 3,4 MB | 9,8 MB |
  | 500 | Pagefind | 2,8 s / 3,2 s | 1,6 s | 23 ms | 119 ms | 257 KB | 8,7 MB |
  | 1.000 | Próprio | 39,3 s / 39,6 s | 38,3 s | 36 ms | 220 ms | 6,8 MB | 19,3 MB |
  | 1.000 | Pagefind | 2,7 s / 3,3 s | 1,6 s | 26 ms | 120 ms | 255 KB | 16,7 MB |

  - **A meta de 1 s não foi atingida por nenhum dos dois** no celular simulado com cache frio (Slow 4G:
    150 ms de latência e 1,6 Mbps). Só a latência das idas e voltas e o download já passam de 2 s. Pela
    regra, então, vale o critério seguinte: com 500 posts, o Pagefind leva 2,8 s e o índice próprio,
    20,3 s. O tempo do Pagefind quase não muda de 26 para 1.000 posts; o do índice próprio cresce em linha.
  - **Gabarito:** o Pagefind passa em tudo (14/14 com os posts reais, 5/5 com 500), com duas adaptações:
    1. Frase exata: o Pagefind 1.5.2 aceita busca entre aspas (não está na documentação do pacote), mas
       não ranqueia (todo resultado vem com nota 1). A busca exata diz quem tem a frase, e a ordem vem das
       notas da busca por todas as palavras.
    2. `#tag` sozinha: o filtro sem termo baixava o índice inteiro (4,2 MB e 24,5 s com 500 posts). Cada
       post indexa uma palavra por tag (`tagkubernetes`), e a busca procura essa palavra, em ordem de data.
  - **Outros ajustes medidos:** a busca espera 160 ms de pausa na digitação (antes, cada prefixo baixava
    índice à toa). Sem abrir a busca, a página baixa 0 byte dela. O build ganha de 0,6 a 3 s.
  - **Limites da medição:** o Chrome não limita a CPU de Web Workers, então a parte do Pagefind que roda
    no worker saiu em velocidade cheia no "celular". Foram 3 repetições por consulta no celular e 2 no
    desktop, menos que as 10 previstas. O servidor local não responde 304, então a "visita repetida" não
    é comparável e ficou fora da decisão. Os posts sintéticos reusam parágrafos reais.
  - **Custo aceito:** no `npm run dev` não há índice (a busca avisa); ela funciona no `npm run build` +
    `npm run preview`. O índice próprio saiu do site; os scripts de `scripts/bench-busca/` medem o Pagefind.
  - **Falta:** confirmar os números no GitHub Pages real quando houver deploy (regra 4).

## D3 · TypeScript 6, Node 24 e npm
- **Data:** 23/09/2026 · **Status:** aprovada (OK do Cesar para a Fase 1, 23/09/2026). Node 24 instalado.
- **Motivo:**
  - O `@astrojs/check` 0.9.10 só aceita TypeScript 5 ou 6 (o TypeScript 7.0.2 já saiu).
  - O Node 24 é o do CI atual e atende o mínimo do Astro (22.12).
  - O npm é o que o blog já usa.
- **Como usar:** o Node 24.21.0 foi instalado pelo fnm, mantendo o 22 como padrão global. O shell do
  Claude (bash) não carrega o fnm, então os comandos do projeto rodam com `fnm exec --using=24 …`.
- **Alternativas:** TypeScript 7, quando o `astro check` suportar; pnpm, sem ganho aqui.

## D4 · CSS próprio com tokens
- **Data:** 23/09/2026 · **Status:** aprovada (OK do Cesar para a Fase 1, 23/09/2026) e aplicada
- **Decisão:** variáveis CSS com os tokens do briefing (§4.2) nos dois temas e estilos com escopo por
  componente. A cor de cada categoria fica só em `src/data/taxonomia.ts`.
- **Fonte única:** os tokens ficam num arquivo TS que gera as variáveis CSS, o tema de cores do
  Expressive Code, as cores da imagem de compartilhamento e um teste de contraste. Assim, nada se repete.
- **Alternativas:** Tailwind. As classes utilitárias brigam com o visual editorial e com os tokens próprios.

## D5 · Fontes
- **Data:** 23/09/2026 · **Status:** aprovada (OK do Cesar para a Fase 1, 23/09/2026) e aplicada
- **Decisão:**
  - `@fontsource-variable/besley` (peso);
  - `@fontsource-variable/literata` (`opsz.css` e `opsz-italic.css`);
  - `@fontsource-variable/jetbrains-mono`.

  Pré-carregar só Besley e Literata normal (latin): 35,7 + 107,5 KB. Itálico e mono só baixam
  quando a página usa (o artigo completo chega a ~290 KB de fontes). A fonte de reserva é ajustada
  com `size-adjust` para a troca não deslocar o texto.
- **Motivo:** o briefing exige Literata com `opsz`. A versão só com peso teria 51 KB, mas perderia esse eixo.
- **Como ficou (Fase 1):**
  - O CSS do `@fontsource` é importado no layout.
  - O pré-carregamento aponta para os dois arquivos, via import `?url`, que são os mesmos que o CSS
    referencia. Conferido no build: não há download duplicado.
  - As reservas "Literata fallback" (Georgia) e "Besley fallback" (Georgia Bold) ficam em
    `src/styles/fontes.css`, com métricas do Capsize 4.3.0.
  - O `kbd` usa a monoespaçada do sistema, para o `⌘K` do cabeçalho não baixar a JetBrains Mono em toda página.
- **Alternativas:**
  - A API de fontes do Astro 7 gera reservas sozinha, mas o filtro de pré-carregamento do provedor
    local não separa `latin` de `latin-ext`, e acabaria pré-carregando os dois.
  - Um subconjunto próprio de glifos, na Fase 7, se o Lighthouse pedir.
- **Atualização em 24/09/2026 (D26):** entra a IBM Plex Sans na interface, pela
  `@fontsource-variable/ibm-plex-sans`, sem pré-carregamento e com reserva ajustada.
- **Atualização em 24/09/2026 (D30):** entram a Bitter (`@fontsource-variable/bitter`, 34 KB no
  latim) e a Newsreader itálica (`@fontsource-variable/newsreader`, `wght-italic`, 64 KB), só nos
  livros. Pedido do Cesar ("hospede as fontes Bitter e Newsreader no próprio site").

## D6 · KaTeX servido pelo site
- **Data:** 23/09/2026 · **Status:** proposta
- **Decisão:** CSS e fontes vêm do pacote `katex` e só carregam em post com fórmula.
- **Motivo:** hoje o KaTeX vem do jsDelivr, e o briefing pede tudo servido pelo site. Nenhum post
  atual tem fórmula, mas o recurso continua disponível.

## D7 · URLs preservadas
- **Data:** 23/09/2026 · **Status:** proposta
- **Categorias e tags** continuam com o **nome cru** na URL, como hoje (`/categories/Seguran%C3%A7a/`,
  `/tags/Banco%20de%20Dados/`). Mudar para slug exigiria 26 redirecionamentos.
- **Ids de título** iguais aos atuais (`rehype-slug`, no estilo github-slugger, com acento). São 199
  âncoras internas que dependem disso. Um script compara os ids antigos com os novos (meta: zero
  diferenças), e os títulos de seção migrados nunca mudam, nem quando o post vira MDX.
- **Âncora de `/sobre/`:** o slugger geraria `são` com acento, então o id
  `como-os-artigos-sao-produzidos` é fixado à mão.
- **Continuam existindo:** `/archive/`, `/categories/`, `/tags/`, `/series/`, `/java/`, `/rss.xml`
  (texto completo nos 10 mais recentes), `/og/<slug>.png`, `/og/default.png` (estão em cache nas
  redes sociais), `/sitemap-index.xml` e `/robots.txt`.
- **Redirecionamentos:**
  - `/posts/java-NN/` → `/posts/java-<LTS>/#java-NN`: os 14 atuais, mais `27: 29` por coerência
    (`/posts/java-27/` nunca existiu);
  - `/about/` → `/sobre/` (na D33, com a página Sobre removida, `/about/` passou a levar à home). O meta refresh não leva o `#site`, então a página de redirecionamento
    troca `#site` por `#como-os-artigos-sao-produzidos` com um script pequeno;
  - `/projects/` → `/`;
  - `/exercicios` → `/`;
  - `/2/` e `/3/` (paginação antiga da home) → `/archive/`, aprovado pelo Cesar em 23/09/2026.
    **Revisto em 24/09/2026 (D27):** a home voltou a ser paginada, e `/2/` e `/3/` voltaram a ser
    páginas, com o mesmo conteúdo de antes. Os dois redirecionamentos saíram.
  - **Acrescentado em 24/09/2026 (D30):** as categorias que mudaram de nome redirecionam para o
    livro novo: `/categories/Arquitetura/` → `/categories/Arquitetura de Software/`,
    `/categories/Java/` → `/categories/Desenvolvimento de Software/` e
    `/categories/Observabilidade/` → `/categories/SRE/` (`NOMES_ANTIGOS` em `src/data/taxonomia.ts`).

## D8 · Validar e renderizar desenhos com `playwright-core`
- **Data:** 23/09/2026 · **Status:** proposta. Instalar na Fase 5.
- **Motivo:** as ilustrações dependem de classes, variáveis CSS e filtros definidos no layout, e o
  sharp/librsvg não resolve isso. O `playwright-core` usa o Chrome já instalado, sem baixar outro
  navegador, e também serve para medir a busca (D2).
- **Alternativas:** Puppeteer, que é equivalente; ou sharp com o CSS resolvido à mão, que é frágil.

## D9 · PDF da apresentação: gerador próprio + sharp no build
- **Data:** 23/09/2026, revista em 24/09/2026 · **Status:** aplicada na Fase 4 (substitui a proposta
  com pdf-lib, que não chegou a ser instalada).
- **Decisão:** no build, o sharp converte cada slide WebP em JPEG (qualidade 85) e `src/lib/pdf.ts`
  monta o PDF: uma página por slide, do tamanho da imagem a 96 dpi, com o JPEG embutido como está
  (filtro DCTDecode). Rota: `/posts/<slug>/apresentacao.pdf`.
- **Motivo:** para "uma imagem JPEG por página" o formato PDF cabe em ~70 linhas, sem dependência
  nova. O sharp já vinha com o Astro e agora está declarado no `package.json` (D1).
- **Conferido:** o PDF de 13 slides tem 1,7 MB, a tabela de objetos bate e o leitor do macOS abre
  as páginas certas.
- **Alternativas:** pdf-lib (a proposta original), pdfkit ou jsPDF. Voltam à mesa se o PDF precisar
  de texto, links ou fontes.

## D10 · Imagem de compartilhamento: página fotografada pelo Chrome no build
- **Data:** 23/09/2026 (opções) e 24/09/2026 (decisão) · **Status:** aplicada na Fase 5.
- **Decisão:** cada post tem uma página `/og/<slug>/` (e `/og/default/` para as outras páginas),
  montada com os mesmos componentes do site (`CartaoCompartilhamento`, `Ilustracao`, a estante). No
  `postbuild`, `scripts/og.mjs` abre cada uma no Chrome via `playwright-core`, fotografa em 1200×630,
  grava `/og/<slug>.png` (comprimido pelo sharp) e apaga o HTML. As páginas ficam fora do sitemap e da busca.
- **Motivo:** sai idêntica ao site (Besley, Literata, tokens, tremor e hachura) sem dependência nova.
  O satori não aceita fonte variável nem WOFF2 (pediria `@fontsource` estático, satori e resvg: quatro
  pacotes a mais) e não lê as classes do desenho; o sharp (librsvg) não resolve variáveis CSS nem as
  fontes do site.
- **Medido:** 27 imagens em cerca de 2 s no build, 0,3 MB no total (60 KB as que têm desenho).
- **Custo:** o build precisa de um Chrome instalado. Os runners Ubuntu do GitHub Actions têm; sem
  Chrome, o build falha com mensagem clara, em vez de publicar sem imagem.

## D11 · Onde ficam ilustrações e lousas, e o formato da ilustração
- **Data:** 23/09/2026, formato em 24/09/2026 · **Status:** ilustração aplicada na Fase 5; lousas em andamento.
- **Decisão:**
  - Ilustração em `src/ilustracoes/<slug>.svg`, embutida no HTML porque depende do CSS da página.
    A raiz declara `aria-label` e os recortes `data-largo` (1100:468), `data-medio` (3:2),
    `data-quadrado` (1:1), `data-og` (livre) e `data-segura`, a área que cabe em todos. Cada lugar do
    site usa um recorte do mesmo arquivo (`Ilustracao.astro`, com `slice`; o de compartilhamento, `meet`).
  - O desenho só usa as classes de `src/styles/desenho.css`; tremor e hachura ficam definidos uma
    vez por página (`DefinicoesDesenho.astro`). `scripts/desenho/validar.mjs` confere as regras e
    `render.mjs` gera a folha de conferência (todos os recortes, claro e escuro) num PNG.
  - Lousas em `src/lousas/<slug>/`, usadas por componentes dentro de posts `.mdx`.
- **Alternativas:** uma pasta por post junto do Markdown, o que mudaria o formato dos 26 posts.

## D12 · Infográfico do NotebookLM não é portado
- **Data:** 23/09/2026 · **Status:** proposta
- **Motivo:** o briefing só prevê a apresentação. O infográfico já está desligado no blog atual e
  nenhum post tem um.

## D13 · Sem pré-visualização publicada por enquanto
- **Data:** 23/09/2026 · **Status:** aprovada (decisão do Cesar)
- **Decisão:** o site roda só na máquina (`npm run dev` e `npm run preview`). Isso substitui o item
  "deploy de pré-visualização" da Fase 1 do briefing até o Cesar pedir.

**Atualização em 23/09/2026:** o Cesar pediu para seguir as fases sem parar e acompanhar o site
rodando na máquina, e reafirmou que não quer nada no GitHub. O site aceita `BASE_PATH` e `PREVIEW`
(`src/lib/url.ts` e `astro.config.mjs`) caso um dia a pré-visualização vá para um subcaminho. Localmente,
nada muda.

## D14 · "Apresentação" sempre sem número
- **Data:** 23/09/2026 · **Status:** aprovada (decisão do Cesar)
- **Decisão:** o título da seção é sempre "Apresentação", mesmo nos 9 posts com h2 numerados. Hoje
  vira "8. Apresentação", mas "Fontes" também não tem número em nenhum post.

## D15 · Migração com o conteúdo como está
- **Data:** 23/09/2026 · **Status:** aprovada (decisão do Cesar)
- **Decisão:** as 6 citações e os parágrafos "Cuidado:" dos posts antigos não viram avisos. A
  migração só corrige o que quebraria no pipeline novo, como o `$$` no `alt` do `aoputils`.

## D16 · Abertura da home com os textos do protótipo
- **Data:** 23/09/2026 · **Status:** aprovada (decisão do Cesar)
- **Frase:** "Arquiteto de soluções. Aqui publico o que estudo sobre arquitetura de software, Java e
  sistemas de pagamento."
- **Linha sobre IA:** "Os textos são escritos com ajuda de IA e revisados por mim. Leia como anotações
  de estudo e confira antes de levar para produção."

## D17 · Ilustrações da série Java geradas por script
- **Data:** 23/09/2026 · **Status:** aprovada (decisão do Cesar)
- **Decisão:** padrão fixo, como o `java-covers.mjs` de hoje, adaptado ao estilo "A + C" na Fase 6.
  Ninguém desenha à mão os posts da série.

## D18 · Git só local
- **Data:** 23/09/2026 · **Status:** aprovada (decisão do Cesar)
- **Decisão:** `git init` na Fase 1. Sem commit, sem repositório remoto e sem push até o Cesar pedir.

## D19 · Bloqueio de edição no blog atual
- **Data:** 23/09/2026 · **Status:** aprovada e aplicada
- **Decisão:** `.claude/settings.json` nega `Edit(//Users/cesar.schutz/Downloads/novo site/blog-atual/**)`,
  o que vale para Edit, Write e NotebookEdit. Comandos no terminal continuam cobertos só pela regra
  do `CLAUDE.md`. A regra pode passar a valer só a partir da próxima sessão.

## D20 · Onde os protótipos divergem do briefing (vale o briefing)
- **Data:** 23/09/2026 · **Status:** proposta
- O protótipo repete o post em destaque na lista de recentes; o briefing não repete.
- O protótipo carrega as fontes do Google Fonts; o site serve as próprias.
- O vidro da lousa aparece como `#14191C`; vale o `#15191C` do briefing.
- Tags e lombadas são `<button>` no protótipo. No site, viram links para `/tags/<Nome>/` e
  `/categories/<Nome>/`, e o JS por cima abre a busca ou o livro. Assim tudo funciona sem JS.
- Faltam no protótipo: lightbox, `/?q=`, frase em destaque e sintaxe de avisos no Markdown. Seguem o briefing.

## D21 · Posts em MDX: RSS e "Apresentação"
- **Data:** 23/09/2026 · **Status:** aplicada ("Apresentação" na Fase 4, RSS do MDX na Fase 5).
- **Problema:** no blog atual, o RSS com texto completo e a "Apresentação" antes de `## Fontes`
  dependem de `post.rendered.html`, que não existe em `.mdx`. Justamente os posts novos com lousa quebrariam.
- **Feito:** a seção "Apresentação" entra por `src/plugins/rehype-apresentacao.mjs`, que vale para
  `.md` e `.mdx`. O cabeçalho dela entra no sumário, e o build falha se o post tiver deck sem `## Fontes`.
  No RSS, a seção vira um link para o site.
- **RSS do MDX:** `rss.xml.ts` renderiza o `.mdx` com a Container API do Astro (`locals.rss`). Nesse
  modo, cada lousa vira o seu rótulo com um link para o post, e os passos entram como parágrafos;
  scripts e estilos saem. Conferido no post de idempotência: texto completo, sem SVG nem script.
- **Plugins no MDX:** avisos, notas laterais, apresentação e Expressive Code valem no `.mdx` (o MDX
  estende a configuração do Markdown).

## D22 · Contraste sem mudar os tokens
- **Data:** 23/09/2026 · **Status:** aprovada (OK do Cesar) e aplicada no `npm run contraste`
- **Decisão:**
  - `--ink-3` só em texto grande ou decorativo; texto pequeno usa `--ink-2`.
  - No tema escuro, barra de leitura e chip usam a cor da categoria com 42% de branco, como os desenhos.
  - O rótulo dos avisos mistura a cor com a tinta (78%), como no protótipo, o que dá 5,4:1 ou mais.
  - Texto em destaque na lousa ganha variante mais escura quando não passar de 4,5:1 (Fase 5).
- **Regra do script:** texto a 4,5:1 e `--ink-3` a 3:1 fazem o script falhar. Elementos gráficos
  decorativos (chip, barra, ícone de aviso) só geram alerta.
- **Situação:** 0 falhas. Um alerta: o chip e a barra de Observabilidade no tema claro dão 2,24:1. São
  decorativos, porque o nome da categoria sempre acompanha.
- **Atualização em 24/09/2026 (D26):** com os tokens novos, `--ink-3` como texto só dentro das folhas
  (3,39:1; sobre o fundo dá 2,97:1, e o script só avisa). O script passou a conferir também o
  azul-tinta, o texto sobre ele, o nome tingido das categorias e o texto dos desenhos sobre os painéis.

## D23 · Cor de destaque da série Java: a fita
- **Data:** 23/09/2026 · **Status:** aprovada (OK do Cesar)
- **Decisão:** `#9E3B26` faz o papel da cor da categoria nos posts da série: barra, chip e desenho.
  Contrastes: 5,8:1 no claro, 6,1:1 no escuro com a mistura, 7,1:1 no vidro e 4,4:1 no quadro branco.
- **Alternativa descartada:** o dourado, que dá 1,7:1 no tema claro.

## D24 · Tema: escolha guardada com a chave do blog atual
- **Data:** 23/09/2026 · **Status:** aplicada (Fase 1); revista na D33: o site sempre abre no tema do
  sistema, e a escolha vale só na visita (`sessionStorage`)
- **Decisão:**
  - A escolha fica em `localStorage["cs-theme"]`, com `light` ou `dark`. Sem valor, o tema segue o sistema.
  - É a mesma chave do blog atual, no mesmo domínio, então quem já escolheu não perde a escolha na troca.
  - A alternância fica discreta no rodapé (Claro, Escuro, Sistema). O cabeçalho do briefing não tem
    esse item, e sem JS o seletor some.
  - O script anti-piscada é a primeira coisa do `<head>`.
- **Atualização em 24/09/2026 (D26):** o cabeçalho ganhou um botão com ícone que alterna claro e
  escuro; o rodapé continua com as três opções. Os dois usam `src/scripts/tema.ts` e ficam em sincronia.

## D25 · Favicon novo
- **Data:** 23/09/2026 · **Status:** proposta (aplicada na Fase 1, pode ser trocada)
- **Decisão:** três lombadas na prateleira, com a última inclinada, como a estante. Há o SVG, o PNG de
  180px para o iPhone e o ICO de 32px, gerados com `rsvg-convert`. As cores ficam fixas porque o favicon
  é uma imagem externa e não enxerga as variáveis do CSS.
- **Motivo:** o favicon atual é da identidade antiga, com degradê azul e "CS" em Inter.

## D26 · Variação "A. Folhas claras": folhas, azul-tinta, IBM Plex Sans e desenhos com palco
- **Data:** 24/09/2026 · **Status:** aprovada (pedido do Cesar, a partir de
  `docs/referencias/prototipo-mais-vida.html`); aplicada, aguardando a revisão visual dele.
- **Decisão:** muda só a camada visual (briefing §4, reescrito; §5.1, §5.3 e §6 ajustados onde a
  contradiziam). Estrutura, conteúdo, rotas e comportamento ficam como estavam, com as exceções abaixo.
  - **Tokens:** fundo, superfície, borda, texto e azul-tinta novos; `--acento` e `--sobre-acento`
    substituem o `--link`. Categorias, séries, avisos e diff continuam. `--well` passa a ser a
    superfície com 4% de tinta (código em linha, cabeçalho de tabela, fundo dos blocos de código); a
    barra dos blocos usa 8%, calculada em `src/lib/codigo.ts` com a mistura oklab que `tokens.ts`
    agora exporta (`misturar`).
  - **Folhas e painéis:** classes globais `.folha` e `.painel` em `base.css`; sombras e raios em
    variáveis (`--sombra-folha`, `--sombra-folha-alta`, `--raio-folha`, `--raio-painel`). As
    proporções do painel (11% e 20%) e do nome no chip ficam em `tokens.ts` (`PAINEL`, `CHIP`).
  - **Fonte da interface:** `@fontsource-variable/ibm-plex-sans`, pedida pelo Cesar. A versão
    variável tem um arquivo latino de 45,7 KB para 400, 500 e 600 (os três estáticos somariam
    71 KB). Sem pré-carregamento: o CSS vem embutido no HTML, então o pedido sai cedo, e a reserva
    "IBM Plex Sans fallback" (Arial com as métricas do Capsize) evita o deslocamento na troca.
  - **Cabeçalho:** a busca vira campo e entra o botão de tema, em sincronia com o seletor do rodapé
    (D24). Ordem: Artigos, Tags, RSS, busca, tema. O protótipo põe "Séries" no menu; o briefing não,
    e o menu ficou como estava. **Revisto em 24/09/2026 (D31):** o menu passou a Artigos,
    Categorias, Séries e Tags, e o cabeçalho ficou fixo.
  - **Artigo:** o topo e o corpo em folhas e, em telas ≥ 1300px, o sumário à esquerda, numa folha
    fixa (o protótipo o põe à direita; o Cesar pediu à esquerda na primeira revisão). A grade saiu do
    `[slug].astro` para `artigo.css`, que as amostras do dev também usam.
  - **Progresso no sumário:** pedido do Cesar na segunda revisão, a partir de um recorte de outro
    blog: embaixo da lista do sumário lateral, uma barra fina em azul-tinta e "NN% lido" em fonte de
    código. A barra de 3px do topo, na cor da categoria, continua. As duas usam a mesma conta
    (`artigo.ts`). Sem JS a barra fica escondida, porque não teria como andar. A folha virou coluna
    flexível: se a lista for longa, só ela rola, e o progresso não sai de vista.
  - **Largura:** a mesma do blog atual, conteúdo de até 1320px com margem lateral de 16 a 32px
    (`--largura` e `--pad` em `base.css`), pedido do Cesar. O protótipo usava 1024px. No topo do
    artigo, o painel ocupa a folha toda e o desenho fica em até 1100px, no centro.
  - **Notas laterais:** continuam na margem direita da folha do corpo a partir de 1180px, também com
    o sumário ao lado; o texto encosta à esquerda da folha e a nota passou de 200 para 180px, podendo
    avançar um pouco sobre o respiro. Nenhum post usa notas hoje.
  - **`LousaPassos`:** mede-se pela folha do corpo e avança 32px sobre o respiro de cada lado. Com a
    largura nova, fica maior que antes em todas as telas largas.
  - **Imagem de compartilhamento:** fundo da folha, título em Besley 700, chip novo e o desenho no
    painel tingido. As 27 imagens foram regeradas no build.
  - **Folha de conferência dos desenhos:** a classe `.folha` dela virou `.conferencia` (colidia com a
    nova; `render.mjs` e `centrar.mjs` acompanham) e os recortes aparecem nos painéis, como no site.
- **Contraste (D22):** 0 falha no `npm run contraste`. O `--ink-3` claro (#868D8A) passa sobre a folha
  (3,39:1) e não sobre o fundo (2,97:1); o nome tingido de Observabilidade passa sobre a folha (4,53:1)
  e não sobre o fundo (3,97:1). Os dois só aparecem como texto dentro das folhas.
- **Armadilha do build:** o cache de conteúdo do Astro (`.astro/data-store.json`) guarda o HTML dos
  posts com o link do CSS do Expressive Code. Depois de mudar a configuração ou o tema do EC, rode
  `npm run build -- --force`; sem isso, os posts apontam para um CSS que não existe mais e os blocos de
  código perdem o estilo. No CI não há cache.
- **Alternativa:** a variação "B. Página aberta" do mesmo protótipo, sem caixas em volta do conteúdo.

## D27 · Lista e cards no formato do blog atual, e a home paginada
- **Data:** 24/09/2026 · **Status:** feito, aguardando aprovação junto com a D26.
- **Pedido do Cesar:** deixar a lista e os cards "igual ao antigo, com aquele texto grande e o título
  maior" e paginar a home em vez do link para todos os artigos.
- **O que mudou:**
  - `ItemLista.astro` e `Cartao.astro`: em cima, a linha nova `MetaItem.astro` (chip, data, relógio e
    minutos); o título inteiro do frontmatter (`tituloCompleto` no `Resumo`; antes só a parte antes
    do "—"); a descrição completa, em IBM Plex Sans; até 4 tags em `#tag`, em JetBrains Mono, só
    texto. O link do título cobre o item todo (`::after`), com o chip por cima. Título da lista entre
    21 e 25px (o antigo ia até 23px); miniatura de 104 a 148px, como no antigo.
  - Cards em até 3 colunas (mínimo de 340px), como no antigo; antes cabiam 4 e os títulos quebravam
    demais. As tags descem até o pé do card.
  - O `ItemLista` completo vale também para categoria, tag e série (no antigo, as quatro páginas usam
    o mesmo feed). O arquivo por ano ficou como estava: `<ItemLista compacto />`.
  - Home paginada: `src/pages/index.astro` virou `src/pages/[...page].astro` (o `paginate` do Astro
    exige o parâmetro `page`), 12 por página, `Paginacao.astro` no lugar do link "Todos os N
    artigos". Página 2 em diante: sem abertura, destaque e tags; título "Artigos — página N" em h1.
  - `/2/` e `/3/` deixaram de redirecionar para `/archive/` (D7) e voltaram a ser as páginas da home.
    Com 26 posts: 12, 12 e 1, igual ao blog atual.
- **Conferido:** `astro check` 0/0, build, links (80 páginas, 0 quebrados, 18 redirecionamentos),
  contraste (0 falhas), sem rolagem lateral em 320 e 390px (home, página 2 e categoria, lista e cards).
- **Mantido do visual novo (D26):** fontes, cores, folhas, painéis tingidos e as ilustrações em 3:2
  nos cards (o antigo usava 2:1).

## D28 · Painel lateral da home com séries e categorias em pilhas de livros
- **Data:** 24/09/2026 · **Status:** feito, aguardando aprovação (com a D26 e a D27).
- **Pedido do Cesar:** ter no blog novo o painel lateral do blog atual (séries, categorias, tags,
  RSS), mas com séries e categorias "semelhante à estante de livros, só que os livros deitados, um em
  cima do outro". O clique ainda não precisa fazer nada de novo: as telas de categoria, tag e série
  serão pensadas depois.
- **A ideia:** são os mesmos livros da estante, agora deitados. Tecido, trama, cor das letras e fita
  da série vêm de `montarLivros()`; o comprimento é a altura da lombada na estante (o livro é o mesmo)
  e a espessura acompanha o número de posts, como a largura da lombada. O mais comprido fica embaixo,
  como numa pilha de verdade; cada livro tem um recuo pequeno e diferente; todos ficam retos (o de
  cima chegou a ficar torto, como o livro inclinado da estante, mas o Cesar achou que parecia
  voando); a pilha fica num tampo da madeira da estante. A série
  mantém o couro, as nervuras, o itálico e a fita, que sai pela ponta do livro.
- **Onde:** `src/components/PainelHome.astro`, na home e nas páginas 2 e 3: à esquerda da lista em
  telas ≥ 1100px (272px, alinhado com a folha da lista) e depois dela nas menores (no HTML, vem depois
  da lista, que é o principal). Na tela larga, fica parado enquanto a lista rola (`sticky`, pedido do
  Cesar, como no blog atual) e, se a janela for mais baixa que ele, rola por dentro. Os cards voltaram ao mínimo de 290px, o mesmo do blog atual, para
  caberem 3 colunas ao lado do painel.
- **Tags:** as 10 mais usadas (o antigo mostrava 8) e "Todas as tags →" (`/tags/`). A nuvem de tags
  do pé da home saiu (`NuvemTags.astro` apagado), porque o painel já cumpre esse papel.
- **Clique:** cada livro é um link para a página que já existe (`/categories/<Nome>/`, `/java/`),
  com rótulo acessível ("Arquitetura, 7 artigos"). Um link morto seria pior para teclado e leitor
  de tela.
- **Outros:** `--tecido-trama` passou de `estante.css` para `base.css`, porque as páginas 2 e 3 não
  têm estante; ícone `rss` em `icones.ts`.
- **Conferido:** `astro check` 0/0, build, links (0 quebrados), contraste (0 falhas; as cores de
  letra e tecido são as da estante), sem rolagem lateral e sem nome cortado em 320, 390, 1100 e
  1280px.

## D29 · Página de categoria com o livro em pé e a transição do livro
- **Data:** 24/09/2026 · **Status:** feito, aguardando aprovação (com D26 a D28).
- **Pedido do Cesar:** fazer a tela de categoria (a de série fica para depois): ao clicar no livro,
  uma animação o leva até um painel elegante no topo da página da categoria, "tipo na home quando
  clicamos nele lá em cima", e embaixo os artigos daquela categoria, com o painel lateral como no
  blog atual.
- **Página:** `src/pages/categories/[categoria].astro` com `ComPainel.astro` (o painel lateral e o
  `sticky`, agora compartilhados com a home), `TopoCategoria.astro` (folha com o livro e o texto) e a
  lista `Recentes.astro` (paginação e subtítulo ficaram opcionais). No painel, o livro da categoria
  aberta fica só como contorno (`retirado`, `aria-current="page"`), como o lugar vazio da estante.
- **O livro em pé:** `LivroEmPe.astro` usa o livro 3D da gaveta parado a 62° (lombada à esquerda,
  capa de frente), na escala de 250px de altura, com a lombada mais escura. O CSS da lombada, do
  livro 3D e da capa saiu de `estante.css` para `livro.css` (a estante o importa), para a página de
  categoria não carregar a estante e a gaveta.
- **Transição:** View Transitions entre documentos (`@view-transition { navigation: auto }` em
  `base.css`), sem biblioteca. O livro em pé tem `view-transition-name` igual ao id do livro. Na
  pilha, o nome vai só no livro que leva à página nova (`pageswap`) ou que veio da anterior
  (`pagereveal`), por um script pequeno no `<head>` (Base.astro); com o nome em todos, a pilha
  inteira voava junto, porque ela fica em alturas diferentes nas duas páginas. A raiz não anima: o
  resto da página troca na hora, como antes. Duração de 0,7s; as duas imagens com `object-fit:
  contain`, para o livro deitado não esticar ao virar o livro em pé. Chrome 126+ e Safari 18.2+;
  nos outros, e com `prefers-reduced-motion`, a página só abre. Conferido em câmera lenta
  (home → categoria e categoria → categoria).
- **Gaveta:** na home, os links de categoria abriam o livro na gaveta (inclusive os do painel). Agora
  os livros do painel ficam de fora e vão para a página da categoria; os chips continuam abrindo a
  gaveta. (Na D33, a pedido do Cesar, os chips também passaram a levar à página da categoria; só as
  lombadas da estante abrem a gaveta.)
- **Título:** o nome usa `clamp(24px, 10cqi, 56px)` na largura da coluna, para "Observabilidade"
  caber numa linha até em 320px.
- **Conferido:** `astro check` 0/0, build, links (0 quebrados), contraste (0 falhas), sem rolagem
  lateral, sem nome cortado na pilha e título numa linha nas seis categorias em 320, 390, 800, 1100
  e 1440px.

## D30 · Livros no padrão da coleção (docs/capas): capas, estante, lateral e categorias novas
- **Revisto em 24/09/2026 (D32):** o visual dos livros mudou de novo (categorias em "edição de
  estudo", séries em revista técnica). O que vale hoje está na D32; o resto desta decisão
  (categorias, posts, fonte única, SVGs, gaveta, redirecionamentos) continua.
- **Data:** 24/09/2026 · **Status:** feito, aguardando a conferência do Cesar.
- **Pedido do Cesar:** o padrão visual dos livros foi atualizado em `docs/capas/` (regra em
  `CAPAS.md`, dados em `livros.json`, cores em `cores.js`, desenhos, ícones, grão e quatro imagens de
  referência). Capas, estante e lateral deviam ficar exatamente nesse padrão, sem mudar o
  comportamento (estante, gaveta girando a lombada, sumário, troca de livro); o livro aberto na home
  devia ficar em três quartos, como na página da categoria; e cada post devia ir para uma das
  categorias novas (as vazias podem ficar).
- **Categorias novas e posts:** as oito da coleção. Quase tudo mudou só de nome: Arquitetura →
  Arquitetura de Software (6), Java → Desenvolvimento de Software (5), Observabilidade → SRE (3);
  Dados, DevOps e Segurança continuam. Exceção: "Bloqueio otimista e pessimista" foi para **Dados**
  (é sobre trava de linha, coluna de versão e níveis de isolamento no banco). IA e Carreira ficam
  vazias: aparecem na estante e na lateral sem número e têm página ("Este livro ainda não tem
  artigos."). As URLs antigas redirecionam (D7).
- **Fonte única:** `src/data/taxonomia.ts` e `src/data/series.ts` leem `docs/capas/livros.json` e
  calculam as cores com `docs/capas/cores.js` (o `cores` já calculado do JSON não é usado). A cor
  principal do livro é também a cor da categoria no site. Prateleira e aparador viraram tokens
  (`--tabua`, `--tabua-borda`, `--aparador*`), com os valores do `CAPAS.md` no tema claro.
- **SVGs:** `src/lib/livros-svg.ts` lê desenhos e ícones de `docs/capas`, tira o `<style>` e o
  comentário (as classes `cz-*` têm espessuras diferentes no desenho e no ícone e brigariam na mesma
  página; as regras ficam em `livro.css`, presas a `.desenho-capa` e `.icone-livro`), simplifica os
  traços em 0,1 unidade (Ramer–Douglas–Peucker; os arquivos caem para cerca de um terço sem mudança
  visível) e dá ao ícone o viewBox justo do desenho (os arquivos têm 120 × 160 com muita sobra, e o
  ícone não caberia bem na ponta da lombada deitada). O traço não escala (`non-scaling-stroke`): na
  capa, as espessuras da regra na escala da capa, com piso; nos ícones, 0,8px na estante e 1px na
  lateral, para o desenho pequeno não virar borrão nem fio de cabelo. Na lateral (30px de altura),
  só os traços principais (`cz-w1`), como na referência: os finos viravam ruído. O grão vem de `grao.svg` como
  `--grao` (Base.astro).
- **Capa** (`Capa.astro`, `livro.css`): 480 × 720 em container query (`--k = 100cqw / 480`), com as
  medidas do `CAPAS.md`; conferida lado a lado com `referencia/capas.png` em `/amostra/livros/`
  (só no dev). A série ganhou uma capa própria: couro com grão, moldura de fios dourados, "Série",
  título em Newsreader itálico, descrição, "7 partes" e a fita saindo do alto.
- **Lombada em pé** (`MioloLombada.astro`): ícone girado, título na vertical e número, faixa de 362
  a partir da base (na estante, a divisão forma uma linha contínua). No livro 3D, a lombada tem a
  altura da capa e a faixa passa a 388 de 720.
- **Estante:** ordem dos volumes, 6 entre os livros, prateleira de 14 com borda de 6, aparador de
  12 × 470 com base; escala por container query com teto de 0,42px por unidade (o livro mais alto
  fica com uns 280px). O último livro (Carreira) inclina 6° para a direita, pelo canto de baixo, e
  encosta no alto do aparador; o tombo da primeira visita continua, agora sem o quique (ele
  atravessaria o aparador).
- **Gaveta:** mesmo comportamento; o livro gira da lombada até **62°** (três quartos), como na
  página do livro (`src/lib/livro-3d.ts` calcula as medidas e o centro para as duas). O desenho da
  capa só é buscado quando o livro abre (`/livros/<slug>.svg`, gerado no build) e entra inline; o
  ícone da lombada do livro 3D é copiado da lombada da estante, para a home não levar uma terceira
  cópia de cada ícone. A home ficou com 275 KB (60 KB com gzip).
- **Lateral:** lombadas deitadas pelo `CAPAS.md` (ponta do ícone com 1,32 da espessura, título a 9 da
  ponta, número a 10 do fim, vincos a 3,5 e 4,5), volume 1 embaixo, medidas no tamanho real de uma
  pilha de 238px, escalando por container query.
- **Página do livro:** o mesmo livro 3D, em três quartos, com o desenho inline (a página já abre com
  o livro aberto).
- **Contraste:** o chip passou a 34% de tinta no claro (o dourado do SRE dava 4,33:1 com 30%). As
  cores dos livros são as do `cores.js` e das referências; dois pares ficam abaixo de 4,5:1 — o
  título claro sobre a faixa do SRE (2,91:1) e o texto claro sobre a cor da Carreira (3,39:1) — e o
  `npm run contraste` os marca como alerta, porque o livro é arte com o texto de verdade no rótulo
  acessível e na página. Se o Cesar quiser, basta mudar o limiar de luminância no `cores.js`.
- **Conferido:** `astro check` 0/0, build, links (85 páginas, 0 quebrados, 21 redirecionamentos),
  contraste (0 falhas), validador (29 de 29), estante, gaveta, lateral e página do livro nos dois
  temas, no celular, com movimento reduzido, o tombo e a transição da pilha para a página.

## D31 · Cabeçalho fixo, menu com Categorias e Séries, e as páginas de livros
- **Revisto em 24/09/2026 (D32):** a página da série passou de `/java/` para `/series/java/`.
- **Data:** 24/09/2026 · **Status:** feito, aguardando a conferência do Cesar.
- **Pedido do Cesar:** o cabeçalho (com a busca) fixo; no menu, Artigos, Tags, Séries e Categorias;
  a página de categorias com os livros lado a lado, grandes; a de séries só com o livro da série do
  Java; e a página "Atualizações do Java" com o livro no topo, como as categorias.
- **Cabeçalho:** `position: sticky` num contêiner de largura total (`.topo-fixo`), fundo da página a
  94% com desfoque (a 86%, o botão azul da lista aparecia como mancha atrás do nome no celular) e o
  fio embaixo por animação ligada à rolagem (sem JS; onde não houver suporte, fica sem fio). Menu:
  Artigos, Categorias, Séries e Tags, com o item atual marcado. O **RSS saiu do menu**, para caber no
  celular: continua no painel lateral e no rodapé. No celular, a busca vira só o ícone (com
  `aria-label`) na linha do nome. `--altura-topo` (60px; 104px no celular, medidos) é descontada por
  `scroll-padding-top` (âncoras), pelo sumário do artigo, pelo painel lateral e pelas lousas fixas.
- **Categorias e Séries:** `GradeLivros.astro`, cartões com o livro 3D em três quartos
  (`LivroEmPe` a 270px, desenho da capa inline, porque o livro já aparece aberto), "Volume 0N" ou
  "Série", nome, subtítulo e contagem. Em Séries, um cartão só (340px), sem esticar pela linha.
- **Página do Java:** `ComPainel` com o livro da série fora da pilha e `TopoLivro` (o antigo
  `TopoCategoria`, agora com trilha, descrição e um espaço para os números das LTS).
- **Transição:** o livro da grade também voa até o topo da página dele. O script do `<head>` passou a
  procurar qualquer `[data-vt]` cujo link leve à página nova (antes, só os livros da pilha).
- **Conferido:** `astro check` 0/0, build, links, larguras de 320 a 1440px, a âncora do artigo abaixo
  do cabeçalho, o sumário e o painel parados abaixo dele, e a transição da grade para a página e de
  volta.

## D32 · Categorias em "edição de estudo", séries em revista técnica, e /series/java/
- **Data:** 24/09/2026 · **Status:** feito, aguardando a conferência do Cesar.
- **Pedido do Cesar:** a série em `/series/java/`, como as categorias; e o visual novo dos livros em
  `docs/capas` (regra, dados, cores, desenhos, emblema e cinco referências): categorias no estilo
  "edição de estudo" e séries como revista técnica, com a tarja do guia de atualização na capa do
  Java. Alterar os componentes que já existem, sem criar outros; o mesmo comportamento da estante,
  do giro, do sumário e da troca de livro.
- **Endereço da série:** `src/pages/java.astro` virou `src/pages/series/java.astro`; `urlSerie` dá
  sempre `/series/<chave>/` (o campo `url` do cadastro virou `paginaPropria`); `/java/` redireciona
  para `/series/java/`; o único link interno para `/java/` (no guia de atualizações) foi corrigido.
- **Dados:** `taxonomia.ts` lê os campos novos (`corpoDoTitulo`, `entrelinhaDoTitulo`, `frase`,
  `subtituloCompleto`, `temas`) e as cores do `cores.js` novo (`cor`, `tinta`, `destaque`, mais
  `PAPEL` e `TINTA_PAPEL`). `series.ts` lê a revista (título dividido, número, destaque, número de
  capa, edições, guia, emblema). A cor da série no site (chip, barra de leitura) passou a ser o
  destaque laranja `#c24d1c`. A lista de edições da capa vem do `livros.json`, como pede a regra
  (confirmado com o Cesar); o total de edições ("7 EDIÇÕES") e os números das lombadas saem dos posts.
- **Capa** (`Capa.astro`, `livro.css`): categoria com o bloco de cor até y 300 ("VOLUME 0N",
  "CESAR SCHUTZ" e o título pela base em y 278) e o papel com a frase (y 324) e o desenho no destaque
  (viewBox `0 300 480 420`). Revista com faixa, título e complemento, linha de dados, "Última
  edição" e o número de capa, a lista de edições (a atual no destaque), a tarja escura do guia com a
  seta, a xícara, o subtítulo e a assinatura. Conferidas lado a lado com `referencia/capas.png` e
  `serie.png` em `/amostra/livros/`.
- **Dois acertos de fonte para bater com as referências:** a Newsreader passou a ser a versão com o
  eixo de tamanho óptico (`opsz-italic`), com o `opsz` fixo no corpo da referência (sem ele, a frase
  de IA quebrava em duas linhas); e o número de capa usa algarismos proporcionais (na Bitter, os
  alinhados são de largura fixa, e o "25" invadia a lista de edições).
- **Lombada em pé** (`MioloLombada.astro`): categoria com o ícone no bloco de cor e o papel de 400 da
  base com o título e o número no destaque (no livro 3D, o bloco de cor ia a 300 de 720; na D33, passou
  a ter a mesma divisão da lombada da estante); série fina
  (80), papel com a faixa no topo, a xícara girada, o título com o complemento em itálico e o número.
  A fita e os fios dourados saíram. O traço dos ícones acompanha a escala da lombada (mínimo 0,75px).
- **Lombada deitada** (`PainelHome.astro`): ponta de cor com o ícone (traço de 0,9 e 0,6px, sem a
  hachura), corpo em papel, título e número no destaque; a série com a barra no destaque, a xícara,
  o título e o número.
- **Carregamento:** o desenho grande da capa e o emblema da revista só vêm quando o livro abre na
  gaveta (`/livros/<slug>.svg` e `/livros/serie-java.svg`); na página do livro, que já abre com o livro
  aberto, entram inline. Home: 295 KB (68 KB com gzip).
- **Contraste:** dois alertas de arte, como nas referências: o texto claro sobre a cor da Carreira
  (3,39:1) e o laranja da série sobre o papel (4,11:1). O "SRE" claro na faixa, que era alerta na D30,
  deixou de existir (o texto da lombada agora é o destaque sobre o papel, 4,89:1).
- **Conferido:** `astro check` 0/0, build, links (86 páginas, 0 quebrados, 22 redirecionamentos),
  contraste (0 falhas), validador (29 de 29), estante, gaveta (categoria e série), lateral, página de
  categoria e da série nos dois temas e no celular, sem rolagem lateral de 320 a 1440px.


## D33 · Marca, cabeçalho e rodapé do blog atual, post-it das frases, livros invertidos no escuro e ilustrações maiores
- **Data:** 24/09/2026 · **Status:** feito, aguardando a conferência do Cesar.
- **Pedido do Cesar:** uma lista de ajustes na home, no artigo, em "Todos os artigos" e extras (tags,
  tema, som, logo, frases), feitos um a um e conferidos; depois, no meio do trabalho, o livro ampliado
  num visor, os livros invertidos no tema escuro, a lombada do livro grande igual à da estante, os bugs
  da apresentação e das imagens do post, as ilustrações ocupando melhor o espaço e a revisão das frases.
- **Marca** (`Marca.astro`, `src/lib/marca.ts`, `scripts/marca.mjs`): o livro "cs" (a capa do Volume
  01, com a fita laranja da série saindo por baixo), "Cesar Schutz" e "blog" em Newsreader itálico.
  As letras são traçado extraído da própria Besley 800 e da Newsreader (o Chrome imprime num PDF e o
  `pdftocairo` converte), para não depender da fonte nem baixar a Newsreader inteira só pelo "blog".
  Aparece no cabeçalho, no rodapé e grande na abertura da home (no lugar do nome). O ícone do navegador
  é o mesmo livro num quadrado de papel (`favicon.svg`, `favicon.ico` com 16/32/48 e
  `apple-touch-icon.png`), trocando os livrinhos. Tokens `--marca`, `--marca-letra` e `--marca-fita`,
  iguais nos dois temas, como os livros. Alternativas desenhadas e descartadas: capa de duas cores,
  quadrado com fita, duas lombadas com "C" e "S".
- **Cabeçalho:** GitHub e LinkedIn só com os ícones, ao lado da aparência (somem abaixo de 520px e
  ficam no rodapé); a busca vira só o ícone até 1100px; o cabeçalho vai para duas linhas até 860px
  (`--altura-topo` de 104px). O botão de tema virou o **menu de aparência** (`SeletorTema.astro`):
  Claro, Escuro e Sistema (o ícone do botão mostra a escolha) e a chave do **som dos livros**. O
  seletor de tema saiu do rodapé.
- **Rodapé** como o do blog atual: a marca, "O que eu estudo virando artigo — arquitetura, código,
  Java, IA e o que mais aparecer." e "Assinar via RSS"; Conteúdo (Artigos, Categorias, Séries, Tags) e
  Autor (LinkedIn, GitHub, sem Sobre e sem Projetos); embaixo, "© 2026 Cesar Schutz · Conteúdo sob CC
  BY 4.0".
- **Home:** a abertura com menos espaço em cima (a estante perdeu o respiro alto), a marca, a
  apresentação do blog atual ("Publico aqui o que ando estudando — …") e o **post-it** das frases; a
  linha sobre IA saiu da abertura (fica no fim de cada artigo). A primeira versão (post-it solto ao
  lado da estante, ou embaixo dela no celular) o Cesar achou horrível nas larguras intermediárias
  (vazio grande à direita, post-it sozinho). Ficou a **cena**: a estante e o post-it viram uma peça
  só, com o post-it colado na parede ao lado dos livros, a borda esquerda atrás da revista, e uma
  prateleira única por baixo dos dois. A partir de 1360px, identidade (marca e texto) à esquerda e a
  cena à direita, no centro da altura uma da outra (a marca ocupa a largura da coluna, até 52px); até
  1359px, a cena desce para baixo do texto, centralizada, com a marca grande; até 640px, o post-it
  sobe para a parede acima dos livros, com a ponta de baixo atrás da revista. Seletor
  Lista / Cards com os ícones do blog atual (`SeletorModo.astro`, compartilhado), "26 artigos
  publicados" abaixo de "Artigos recentes" e o painel lateral começando na altura desse título (sem o
  recuo). O destaque com o título inteiro e a descrição, sem o subtítulo separado.
- **Data e tempo de leitura** com o calendário e o relógio do blog atual em todo lugar
  (`DataLeitura.astro`: lista, cards, destaque, topo do artigo, arquivo).
- **Artigo:** o topo como no blog atual: o título inteiro (não mais dividido em título e subtítulo), a
  descrição, e a assinatura com a foto (a do GitHub, baixada para `public/autor.webp` com o OK do
  Cesar, para não pedir nada a outro domínio a cada artigo), o nome, a data e o tempo; e,
  no canto, a **marca d'água** com o desenho da capa do livro do artigo (a xícara, na série). Coluna de
  texto de 680 para **760px**; as notas laterais só vão para a margem quando a folha tem espaço
  (consulta de contêiner). O **sumário** virou um trilho: número da seção num marco (ponto nas sem
  número), as lidas e a atual pintadas, as subseções da atual abertas, a atual sempre à vista, e
  embaixo "NN% lido" com o tempo que falta; o post-it das frases vem embaixo do sumário (telas de
  720px de altura ou mais). No fim do artigo: o aviso de IA sem o "Saiba mais" e com o ícone
  alinhado; o cartão **"Do livro"** com o livro 3D da categoria (ou a revista da série), que voa até
  a página do livro; o post-it (quando o do sumário não está à vista); e anterior/próximo com o título
  inteiro.
- **Página Sobre removida** (pedido do Cesar; ele escreve depois): `/about/` leva à home.
- **Todos os artigos e tags** (`ListaFiltrada.astro`): no formato da lista da home (título inteiro,
  descrição, tags e a ilustração), com Lista / Cards; o arquivo por ano (#y2026 continua), sem a coluna
  de datas. No topo, uma **estante de filtro** (`Estante` em modo "filtro"): só os livros com artigos
  na página, com o número deles; clicar num livro mostra só os artigos dele (e a URL ganha
  `?livro=<slug>`). A página de tag mostra por quais livros ela passa e as tags que aparecem junto. As
  pílulas de tag agora levam à página da tag (antes abriam a busca). Os chips de categoria da lista,
  dos cards e do destaque também levam à página da categoria (antes, na home, abriam o livro na gaveta).
- **Frases de autores** (`PostIt.astro`, `src/data/frases.json`, `/frases.json`): as do blog atual,
  num bloquinho de post-it amarelo apagado, torto, com a frase em Newsreader itálico e o autor levando
  à fonte; "outra frase", riscado à mão, arranca a folha de cima (ela sai voando) e mostra outra ao
  acaso, sem repetir na sessão, com um som de papel. **A cada visita, a frase é sorteada** (pedido do
  Cesar): o script busca `/frases.json` ao carregar e escolhe uma sem repetir a última mostrada
  (`cs-frase-ultima`, no navegador) nem as vistas na sessão; enquanto sorteia, o texto fica invisível
  e aparece num fade curto. Sem JavaScript, fica a frase do HTML (na home, a primeira do arquivo; em
  cada artigo, uma escolhida pelo nome dele). Quatro tamanhos de letra pelo tamanho da frase, para o
  papel ficar quase quadrado.
- **Tema sempre do sistema** (pedido do Cesar, 25/09/2026): o site abre sempre no tema do sistema. A
  escolha do menu de aparência passou de `localStorage` para `sessionStorage` (`cs-theme`): vale de
  página em página enquanto a aba está aberta e some ao fechar. O script do `<head>` apaga a escolha
  antiga guardada para sempre (inclusive a do blog atual, que usa a mesma chave). O som dos livros
  continua guardado (`cs-som`).
- **Revisão das frases:** as 132 frases do blog atual foram conferidas uma a uma contra a fonte
  (quatro revisores em paralelo). Só 7 estavam certas; a maioria era **inventada ou atribuída sem
  base** (frases que o autor nunca escreveu, links 404, livros sem a frase). Cada uma foi trocada pela
  citação real do mesmo autor, traduzida com fidelidade e com o link para onde ela está (117); 8 saíram
  (sem origem, falas fracas, um ditado anônimo e duas repetidas) e entraram 3 novas (Parnas, Lampson e
  Spolsky): 127 frases, a primeira a de Ralph Johnson citada por Fowler em "Who Needs an
  Architect?". Links: 119 respondem 200 a robôs; os da ACM Queue, O'Reilly e Last Week in AWS
  bloqueiam robôs, mas abrem no navegador (conferido). Depois, a pedido do Cesar, saíram as duas com
  link para o dl.acm.org (Bender e Gebru, "Stochastic Parrots"; Tony Hoare, "The Emperor's Old
  Clothes"), que abre atrás de uma verificação do Cloudflare: **125 frases**. A regra para frase nova
  ficou no `CLAUDE.md`.
- **Livro ampliado** (`LivroAmpliado.astro`, `visor.css`): clicar no livro aberto da gaveta ou do topo
  da página do livro (ou na lupa do canto) abre o livro grande sobre a página escurecida, com o nome e
  o volume, "Ver o livro" (fora da página dele), botão de fechar, Esc e clique fora; arrastar ou ←/→
  gira o livro entre a lombada e a capa.
- **Livros no tema escuro invertidos** (pedido do Cesar): no claro, como a regra; no escuro, o papel
  em cima (título e ícone na cor do livro) e a cor do livro embaixo (título, número e desenho na tinta
  dela). A revista fica em papel escuro com a tinta clara e o laranja clareado (4,6:1). Feito com
  papéis de cor em `livro.css` (`--cima`, `--baixo`, `--revista-*`), que capa, lombada em pé e lombada
  deitada usam no lugar das cores cruas.
- **Lombada do livro grande igual à da estante:** a divisão de cor passou a ser a mesma da lombada da
  estante (400 da altura dela, em proporção; não precisa bater com a da capa), a sombra da lombada
  virada caiu de 22% para 8% e o giro de 62° para 52°, para o título dela ficar legível.
- **Som dos livros** (`src/scripts/som.ts`, Web Audio, sem arquivos): um toque de madeira ao passar o
  mouse numa lombada (a nota sobe de um livro ao outro), o livro saindo da prateleira e a capa
  assentando ao abrir, o contrário ao fechar, e o papel do post-it. Só depois do primeiro clique na
  página (regra dos navegadores); no Chrome, vale também o clique da página anterior do site, e o
  áudio é preparado no primeiro movimento do mouse nas páginas com livros, para o primeiro toque soar
  (o painel ficava mudo depois de chegar a uma categoria pelo clique num livro). Desliga no menu de
  aparência (`cs-som`).
- **Bugs corrigidos:** a apresentação (carrossel, tela cheia) e o visor de imagens tinham perdido o CSS
  numa reescrita do `artigo.css` (os slides apareciam empilhados e a imagem ampliada não aparecia); o
  carrossel voltou, e o visor foi refeito com a página escurecida, fechar no alto, setas e contador. O
  emblema da revista (xícara) não aparecia em `/series/` e `/series/java/` (ficava "adiado" sem quem o
  buscasse); agora vem inline.
- **Ilustrações maiores:** os recortes médio (destaque, cards, topo no celular) e quadrado (miniatura)
  eram folgados demais (um mínimo de 900 e 670 unidades deixava o desenho com 45% a 70% da largura).
  O `centrar.mjs` agora faz recortes justos (até 86% da largura e 82% da altura no médio; 90% no
  quadrado) e foi rodado nos 26 desenhos; o `java.mjs` já gera com os recortes novos. No destaque, o
  painel acompanha a altura do texto e mostra o desenho inteiro; até 960px o desenho vai para cima. O
  recorte largo (topo do artigo, com as anotações) foi conferido nos 26 e ficou como estava.
- **Conferido:** `astro check` 0/0, contraste (0 falhas; alertas só nas artes dos livros),
  validador (29 de 29) e cada tela nos dois temas e no celular.

## D34 · Publicação em blog.cesarschutz.com.br, num repositório próprio
- **Data:** 25/09/2026 · **Status:** feito, a pedido do Cesar.
- **Pedido do Cesar:** subir o projeto no repositório público `cesarschutz/blog` (criado por ele);
  no Pages, a fonte "GitHub Actions" (`withastro/action`); no `astro.config.mjs`,
  `site: 'https://blog.cesarschutz.com.br'` sem `base`; o domínio `blog.cesarschutz.com.br` nas
  configurações do Pages, com HTTPS obrigatório.
- **Feito:** o `site` passou para o subdomínio (o `base` fica no padrão, `/`; a variável
  `BASE_PATH` só existe para uma eventual pré-visualização); o Pages foi ligado com build por
  workflow; o projeto subiu para a `main` (o `deploy.yml`, que já existia, publica a cada push); o
  domínio foi configurado no Pages. O DNS já estava pronto no registro.br (`blog` CNAME
  `cesarschutz.github.io`). O certificado saiu logo depois do primeiro deploy e o HTTPS obrigatório
  foi ligado.
- **Como o push sai desta máquina:** pelo remoto SSH (`git@github.com:cesarschutz/blog.git`). Pelo
  HTTPS, com o token do `gh`, o GitHub recusa: o token não tem o escopo `workflow`, exigido para
  enviar `.github/workflows/deploy.yml`.
- **Primeiro deploy (25/09/2026):** build e publicação passaram no Actions, com as imagens de
  compartilhamento geradas pelo Chrome do runner e o índice do Pagefind; home, posts, `/og/`,
  `/pagefind/` e `/frases.json` respondendo em `https://blog.cesarschutz.com.br`.
- **Consequência:** todo push na `main` publica o site. A assinatura das capas, "BLOG.CESARSCHUTZ.COM.BR"
  (D30), que era pergunta aberta, agora bate com o endereço.
- **Em aberto:** o blog antigo continua em `cesarschutz.com.br` com os mesmos artigos, o que é
  conteúdo duplicado para os buscadores. Opções: o novo fora do Google (`noindex`, já previsto no
  layout pela variável `PREVIEW`) até o antigo sair; o antigo redirecionando para o novo; ou a virada
  do domínio principal (`docs/virada.md`).

## D35 · Processo único de posts, ferramentas do projeto e portabilidade
- **Data:** 25/09/2026 · **Status:** aprovado pelo Cesar; em execução na branch `configuracao-posts`.
- **Pedido do Cesar:** todo post (novo ou adaptado) segue o mesmo processo e o mesmo estilo, e tudo
  funciona igual num clone em outro computador: skills, MCPs e hooks versionados no projeto, um
  `DESIGN.md` na raiz, a pasta `entrada/` (fora do git) e uma skill única `post`.
- **Segurança (lido antes de instalar, relatório na conversa de 25/09/2026):** gsap-skills e
  web-quality-skills são só Markdown (o `analyze.sh` só lê HTML). O Impeccable roda um motor
  compilado em Rust (o código é aberto, o binário vem do GitHub Releases com SHA-256); os hooks rodam a
  cada edição de arquivo de interface e no fim de cada resposta, sem rede nesse caminho; alguns
  comandos (`shape`, `generate`, `live`) usam a rede só quando chamados. O chrome-devtools-mcp coleta
  uso por padrão e manda URLs à API CrUX. Aceito pelo Cesar com estas condições:
  - **Motor do Impeccable** baixado para `~/.impeccable/bin/` no primeiro uso (não versionado; seriam
    ~74 MB no git). O `scripts/verificar-ambiente.mjs` confere se ele está lá.
  - **Telemetria desligada:** `DO_NOT_TRACK=1`, `IMPECCABLE_NO_TELEMETRY=1` e `DISABLE_TELEMETRY=1` no
    `env` do `.claude/settings.json`; o chrome-devtools-mcp com `--no-usage-statistics` e
    `--no-performance-crux`.
  - **Versão fixa:** `chrome-devtools-mcp@1.10.1` (a que foi lida), atualizada à mão.
  - **As decisões do blog vencem o Impeccable:** o "go all out", o redesign e a troca do `DESIGN.md`
    que a skill dele sugere não valem aqui (escrito no `DESIGN.md` e na skill `post`).
- **Desenhos:** continua o método atual (SVG desenhado à mão, tremor por `feTurbulence`, D11 e
  `docs/estilo-desenho.md`). **O Rough.js não entra**, embora estivesse no pedido original. Na
  conferência no navegador, olhar o custo do filtro no trace de performance, principalmente nos
  desenhos animados.
- **Bibliotecas:** `gsap` (animações das lousas novas, carregado só no post que usa). Rough.js recusado
  (acima).
- **Movimento na home (pergunta respondida em 25/09/2026):** o livro inclinado não tomba mais na
  primeira visita da sessão; ele já aparece apoiado no aparador. Na home, nenhum livro cai e nenhum
  texto muda de cor. A frase em destaque que acende é um recurso raro **dos posts**, não da home.
  Código mudado: `Base.astro` (script do `<head>`), `Gaveta.astro` e `estante.css`.
- **Contraste da Carreira e da série (pendência de D32, decidida em 25/09/2026):** as cores atuais
  continuam nas capas e nos títulos grandes (acima de 3:1, texto grande), como exceção decidida.
  Texto pequeno nessas cores usa sempre uma variante escura: Carreira `#816342` (4,53:1 com a tinta
  clara) e série Java `#b8481a` (4,52:1 sobre o papel), em `docs/capas/livros.json` (`corTexto`,
  `destaqueTexto`). Conferido onde elas eram texto pequeno: só nas lombadas (em pé na estante e
  deitadas na lateral), o complemento e o número da série no claro e o título e o número da Carreira
  no escuro. Mudado: `taxonomia.ts`, `series.ts`, `estante.ts` (`--livro-cor-texto`,
  `--livro-destaque-texto`), `livro.css`, `PainelHome.astro`; o `npm run contraste` passou a exigir
  4,5:1 no texto pequeno das lombadas. No escuro, a lombada da Carreira no livro 3D fica um tom mais
  escura que a capa ao lado, igual à da estante.
- **Plugin `frontend-design` removido (pedido do Cesar em 25/09/2026):** primeiro foi desligado só
  neste projeto, pelo `enabledPlugins` do `.claude/settings.json`. Depois o Cesar decidiu não usá-lo em
  nenhum projeto: ele foi desinstalado do escopo do usuário (`claude plugin uninstall`) e a linha saiu
  do `.claude/settings.json`. O plugin `warp` segue ligado (só manda notificações ao terminal Warp,
  sem rede).
- **Conferência do blog no navegador (pedido do Cesar em 25/09/2026):** visual, console e performance
  sempre pelo MCP `chrome-devtools`, nunca pelo `claude-in-chrome` (regra no `CLAUDE.md`).
- **Registro de produto do Impeccable (`/impeccable init`, 25/09/2026):** `PRODUCT.md` na raiz, com as
  respostas do Cesar. Leitor principal: devs que chegam pesquisando um tema, e o próprio Cesar (o blog
  como caderno do estudo). Sucesso: o leitor entender o assunto e manter a constância de estudo (sem
  meta de audiência). Diferenciais: rigor com fontes, código e SQL testados, explicação visual, série
  Java por LTS, organização em livros e transparência sobre IA. O `PRODUCT.md` não decide nada novo:
  se divergir do briefing ou do `DESIGN.md`, valem eles. Os títulos das seções ficam em inglês porque
  o Impeccable os lê pelo nome. Em `.impeccable/config.json`, `"buildPath": "code"`: trabalho visual
  novo vai direto ao código seguindo o `DESIGN.md`, sem gerar imagem antes.
- **Código e SQL testados antes de publicar (Cesar, 25/09/2026):** mais forte que o "código que
  compila" de antes, e alinhado ao aviso de IA de cada post ("com o código testado"). Mudado: skill
  `post` (checklist, "Nos dois modos") e `docs/briefing.md` §8.2.
- **Pasta `.impeccable/` no git (Cesar, 25/09/2026):** o `config.json` é versionado, para o
  `buildPath` valer em outro computador. No `.gitignore`, a pasta toda fica fora, menos os registros
  do projeto (`config.json`, `design.json`, `surfaces/` e `live/config.json`). Cache e pendências do
  hook, `config.local.json` (de cada máquina), `build/`, `mocks/`, `review/`, as sessões do modo live
  e a pasta `.impeccable-live/` continuam fora.
- **Ferramenta de cada animação (Cesar, 25/09/2026, no `DESIGN.md`, "Movimento"):** CSS para estados
  simples (hover, foco, aparecer e sumir); View Transitions para trocar de página; GSAP para sequências,
  rolagem e objetos interativos (abrir, fechar e girar os livros), carregado só nos componentes que
  usam. Trocar uma animação existente por GSAP só com trace de performance, ganho concreto e aprovação
  do Cesar. Nas transições entre páginas, o Cesar escolheu manter as **nativas entre documentos**
  (D29), e não o `<ClientRouter />` do Astro, que poria JavaScript em toda página.
- **GSAP sob demanda baixado antes do uso (Cesar, 25/09/2026, no `DESIGN.md`, "Movimento"):** o
  download começa ao passar o mouse, ao tocar ou quando a página fica ociosa, para a primeira animação
  não atrasar. Acrescentado também o foco do teclado, para quem navega sem mouse ter o mesmo ganho.

## D36 · Sumário sem números
- **Data:** 25/09/2026 · **Status:** aprovado pelo Cesar (pedido dele).
- **Decisão:** o trilho do sumário lateral mostra só um ponto em cada seção, sem o número no marco
  redondo, em todos os posts. O "3. " de um título numerado também sai do nome, no sumário lateral e
  no recolhível. Os títulos dentro do artigo e as âncoras não mudam (D7).
- **Motivo:** o Cesar preferiu o trilho sem números.
- **Mudado:** `src/components/Sumario.astro` e `docs/briefing.md` (§5.3, Sumário). Substitui o
  "número de cada seção num marco" da D33.

## D37 · Auditoria de acabamento das páginas e dos componentes
- **Data:** 25/09/2026 · **Status:** aprovada pelo Cesar; em execução, um commit por lote.
- **Pedido do Cesar:** acabamento profissional nas páginas e nos componentes (não no conteúdo dos
  posts), com um relatório antes de mexer. O relatório (fase 1) ficou em
  `.impeccable/review/auditoria/relatorio.md` (fora do git), com screenshots, traces e Lighthouse.
- **Lotes aprovados, nesta ordem:** 1 quebras visíveis (rolagem lateral do "Do livro", as quatro
  imagens de compartilhamento quebradas, `<wbr>` nos títulos das listas, barra dupla da busca);
  2 acessibilidade (nome das lombadas, dois contrastes, h1→h3 da `/2/`, 404 sem canonical e com
  `noindex`, alvos de toque, foco do Copiar); 3 busca (cortar os resultados sem relação e mostrar
  "nada encontrado"); 5 DOM e peso (cards num `<template>`, `content-visibility` nos blocos de
  código); 4 post-it por tema (campo `temas` nas frases, sorteio só entre as do assunto do post) e
  altura do papel reservada; 6 SEO e metadados; 8 DESIGN.md e textos da interface, com o ícone do
  aviso de IA passando de Atenção para Nota (muda o briefing §5.3).
- **Fora:** o lote 7 (topo do post mais baixo e miniatura menor no celular), que mexia na
  densidade da D27 e da D33.
- **D36:** commitada à parte antes dos lotes.

## D38 · Post-it no fim do artigo, lombada que leva ao livro, tags como links e cabeçalho que se esconde
- **Data:** 25/09/2026 · **Status:** aprovada pelo Cesar; implementar num lote próprio, depois dos
  lotes da D37.
- **Pedido do Cesar (a partir das "decisões para reconsiderar" da auditoria):**
  - **Post-it (muda a D33):** o texto aparece desde o início, sem ficar invisível enquanto a frase é
    sorteada; o som dos livros passa a vir **desligado** por padrão; nos posts, o post-it sai da
    lateral (embaixo do sumário) e vai para o **fim do artigo, antes do aviso de IA**, fechando a
    leitura com a frase; no tema escuro, o papel fica mais apagado.
  - **Lombada (muda a D29 e a D33):** a lombada **sempre leva à página do livro**, em todo lugar; na
    home, a gaveta abre pela capa.
  - **Tags da lista (muda a D27):** as tags da lista e dos cards viram links para a página da tag.
  - **Celular (muda a D31 e a D33):** o cabeçalho some ao rolar para baixo e volta ao rolar para
    cima; a abertura da home fica mais curta; os quatro botões de compartilhar viram um só, com o
    compartilhamento nativo do sistema.
- **Definido depois, com o Cesar (25/09/2026):** na home, a lombada continua abrindo a gaveta, e a
  capa aberta dentro dela leva à página do livro; nas outras páginas, a lombada leva ao livro. A
  abertura mais curta é, até 640px, sem a marca grande (ela já está no cabeçalho). A estante de
  filtro do arquivo e das tags continua filtrando (e `/archive/?livro=` continua valendo), mas, para
  não confundir com a lombada que leva ao livro: o rótulo "Filtrar por livro" acima dela, a lombada
  escolhida visivelmente marcada, um "Limpar filtro", e as lombadas como botões com `aria-pressed`,
  não como links.
- **Textos aprovados no lote 8 da D37:** descrição padrão do blog e da imagem de compartilhamento
  padrão a partir da frase do rodapé (D33); na gaveta, "Neste livro" no lugar de "Sumário"; no filtro,
  "Escolha um livro"; o livro vazio numa folha, com saídas; "N artigos · o último em AAAA"; descrição
  própria das páginas 2 e 3.
- **Motivo:** o post-it invisível atrasava o LCP da home e, fixo ao lado do texto, era o elemento
  mais claro da tela no escuro; som ligado por padrão não combina com um blog de leitura; a mesma
  lombada fazia três coisas diferentes; o "#tag" da lista parecia link e não era; no celular, o
  cabeçalho de 104px ocupava 12% da tela e a abertura, a primeira tela inteira.

## D39 · Acabamento de design: livros de cor fixa, lombada única, tema direto, sem som
- **Data:** 25/09/2026 · **Status:** aprovada e aplicada, em oito lotes (um commit cada), sem push.
  Os itens 2, 6 e 9 passaram antes por propostas em screenshots: o 6 e o 9 foram aprovados como
  propostos, e o 2 virou a retirada das frases.
- **Substitui**, no que houver em contrário: a D27, a D29, a D33, a D38 e o lote 4 da D37 (frases por
  tema). O `DESIGN.md` foi atualizado junto.
- **Pedido do Cesar (1 a 10) e da revisão de designer (A a G):**
  1. **Livros com cor fixa, sem depender do tema.** Categorias sempre com o papel em cima e a cor do
     livro embaixo (o que antes era só o escuro); a série sempre clara (o que antes era só o claro).
     Vale para lombadas, pilha, livro 3D, capas da grade, gaveta e livro ampliado. Os papéis
     `--cima`/`--baixo` de `livro.css` deixam de ter versão escura; o contraste das lombadas é o
     mesmo nos dois temas (`npm run contraste`).
  2. **Frases de autores fora do blog:** o pedido era o post-it só na home, menor e com alfinete; o
     Cesar viu as duas propostas (no canto do painel e junto do texto), não gostou de nenhuma e
     decidiu **tirar as frases do blog por enquanto**, com tudo o que era delas: o post-it da home e
     dos artigos, `src/data/frases.json`, `/frases.json`, o sorteio por tema (lote 4 da D37), as cores
     `postit` e as chaves guardadas no navegador.
  3. **Livro escolhido escurecido, sem contorno azul:** o lugar do livro que foi para a gaveta mostra
     o próprio livro escurecido (como os não escolhidos do filtro), e o livro da página atual aparece
     escurecido na pilha, em vez do lugar vazio. O contorno azul da lombada escolhida no filtro (D38)
     sai; o foco pelo teclado (`:focus-visible`) continua, mais discreto.
  4. **Uma lombada só:** a pilha lateral usa a mesma lombada da estante (`MioloLombada` dentro de
     `.lombada-visual`), com as mesmas proporções, ícone, tipografia e contagem, só que deitada
     (girada 90° para a esquerda). A lombada deitada própria do `PainelHome` saiu.
  5. **Livro grande quase de frente:** o livro 3D aberto (gaveta, topo da categoria e da série, livro
     ampliado) gira 72° a partir da lombada (`GIRO` em `lib/livro-3d.ts`): a capa fica a 18° da frente
     e a lombada vira uma faixa. "Arrastar para girar" continua.
  6. **Lousa de passos:** no desktop (≥ 1024px), lousa fixa ao lado e os passos mais próximos (uns
     40% da tela entre eles), todos visíveis, o ativo inteiro e os outros esmaecidos; no celular,
     tablet e com movimento reduzido, passo a passo com a lousa em cima, o texto embaixo e
     "◀ 2/5 ▶" com pontos e deslizar. Aprovado como proposto.
  7. **"Neste artigo" na cor do livro:** a linha que preenche, o ponto ativo e a barra de porcentagem
     na cor do livro do post; abaixo do painel, em tela larga, um "Do livro" compacto (capa pequena,
     nome e "Ver o livro"), que sai do fim do artigo no desktop e continua lá no celular.
  8. **Sem rolagem feia:** o sumário não rola para o lado (quebra depois dos pontos) e todas as áreas
     com rolagem interna usam uma barra fina nas cores do tema.
  9. **Texto mais largo e marca d'água em outro lugar:** coluna de uns 70 a 72 caracteres, menos
     espaço lateral no cartão, código, tabelas, diagramas e lousas na largura do cartão; no celular,
     o corpo do artigo sem cartão; a marca d'água sai do topo do artigo e vai para o topo das páginas de categoria e de série e para o
     fim do artigo, atrás de "anterior / próximo" (os dois lugares propostos, aprovados).
  10. **Tema e som:** o site abre no tema do sistema; o botão alterna direto entre claro e escuro
      (sol ou lua), sem painel; a escolha vale até fechar o site (`sessionStorage`); trocar o tema não
      mexe na posição da página; o som sai por completo (`som.ts`, a opção do menu e as referências).
  - A. Título do bloco de código à esquerda e a linguagem como etiqueta à direita.
  - B. Código nas tabelas quebra depois dos pontos, nunca no meio do nome.
  - C. Diagramas antigos com fundo branco num quadro neutro que funciona nos dois temas.
  - D. Títulos com `text-wrap: balance` e o travessão preso à palavra seguinte.
  - E. No celular, topo e corpo do post sem a margem interna dupla (junto com o item 9).
  - F. Página Séries: um destaque largo da série, com capa, descrição, edições e "Começar pelo guia".
  - G. Página Tags: cada tag com a contagem e os artigos mais recentes, agrupadas pela cor do livro.
- **Motivo:** o livro que muda de cor com o tema deixava de ser o mesmo objeto; a lombada desenhada
  de dois jeitos também; o contorno azul e o lugar vazio chamavam mais atenção que o livro; o livro
  aberto em três quartos escondia a capa; o som e o painel de aparência eram peso sem uso.

## D40 · Livros em movimento, com GSAP
- **Data:** 25/09/2026 · **Status:** aprovada e aplicada, um lote por ideia (cinco commits), sem push.
- **Pedido do Cesar:** animar os livros com GSAP, tendo como guia de movimento, tempos e ângulos o
  protótipo `docs/historico/prototipos/livros-em-movimento.html` (peças reais do blog; não é código para
  copiar), a partir do acabamento da D39 (cor fixa, lombada única, 18°, livro escurecido). Esta
  decisão é a aprovação pedida pela D35 para trocar animações existentes por GSAP; cada lote leva
  um trace de performance no celular com CPU 4×.
- **Regras gerais:** GSAP só nos componentes que usam, baixado sob demanda um pouco antes do uso (ao
  passar o mouse, tocar, receber o foco ou com a página ociosa); só transformações e opacidade, nada
  de `filter` no elemento 3D; com `prefers-reduced-motion`, tudo direto no estado final; o foco do
  teclado faz o mesmo que o mouse, e Esc fecha o que abriu.
- **As cinco ideias:**
  1. **A estante responde ao mouse** (home e estante de filtro): o livro sob o mouse sobe 16px; os
     vizinhos até 120px sobem até 5px e inclinam até 2,4° para longe do mouse (`quickTo`: y em 0,45s,
     rotação em 0,6s, `power3.out`); ao sair, tudo volta com `elastic.out(1, 0.45)` em 1,1s; embaixo,
     uma legenda com o nome e a contagem. Só com mouse (`hover: hover`).
  2. **A estante em repouso** (só a home): depois de 3s sem mouse, toque, tecla ou rolagem, com a
     estante ao menos metade visível e a aba ativa, uma faixa de luz suave atravessa as lombadas em
     3,6s (a cada ~9s) e, a cada 4 a 7s, um livro sorteado sobe 10px, inclina 1,2°, espera 0,6s e
     volta com `elastic`. Qualquer interação para tudo. Desligada com movimento reduzido.
  3. **Tirar da estante e abrir** (a gaveta da home): o livro sobe 40px e o lugar fica escurecido; um
     livro 3D sai da posição da lombada e vai para a gaveta girando até 18° (1,05s, `power3.inOut`);
     a capa abre (-165°) enquanto o livro desliza e gira até 4°; na página da direita, os artigos
     mais recentes (até 6, com `stagger` de 0,05s), "Ver todos os N artigos" e "Ver o livro"; o verso
     da capa leva a assinatura do blog. Fechar ("Guardar o livro", Esc ou clique no lugar escurecido)
     faz o caminho de volta 1,5× mais rápido; outro livro fecha o atual e abre o novo; no celular, o
     livro aberto cabe na largura da tela.
  4. **A pilha lateral** (páginas de livro): ao passar o mouse, o livro sai 14px da pilha e volta com
     `elastic`; o clique continua levando à página do livro, com a View Transition nativa (lombada da
     pilha → capa do topo); na chegada, o livro atual é puxado 46px, volta a 10px com `back.out` e
     fica escurecido.
  5. **Capas com profundidade** (grade de categorias e séries, "Do livro" e topo da página do livro):
     a capa acompanha o mouse (até 11° em Y e 7° em X) com uma luz radial suave; no hover, entreabre
     -28° com três camadas de página (-6°, -12°, -18°; depois, -40° em proporção, ver os ajustes); no toque, entreabre no primeiro e abre o link
     no segundo. No livro ampliado, arrastar gira com embalo (Draggable + InertiaPlugin) e, ao soltar,
     o livro volta a 18° com `elastic`.
- **Ajustes aprovados pelo Cesar depois dos lotes (25/09/2026):** a página do livro aberto ganha
  "Próximas ▸", que vira a folha com a mesma animação da capa e mostra os próximos 6 artigos (o link
  para ver todos continua, e funciona pelo teclado); a capa entreaberta da ideia 5 abre a -40°, com as
  camadas de página em proporção; as lombadas deitadas ficam 12% mais grossas só na pilha, para o
  título chegar a uns 11 ou 12px. A lombada do livro que voa fica como está. O protótipo fica no git,
  e os próximos também vão para `docs/prototipos/`.
- **Consequência técnica:** o `Livro3D` passa a ser o livro inteiro, como no protótipo (contracapa,
  lombada, bordas das páginas, página de dentro e capa com verso), para a capa poder abrir e
  entreabrir. Continua sendo o único componente de livro 3D.

## D41 · Caderno marcado, o desenho do destaque e a marca que abre
- **Data:** 25/09/2026 · **Status:** aplicada, sem push. O caderno marcado (item 3) foi **substituído
  pela D48** (a caneta do caderno, estática e azul).
- **Pedido do Cesar:** animar o resto do site a partir de `docs/historico/prototipos/site-em-movimento.html` e
  `docs/historico/prototipos/caderno-marcado.html` (lista, cards e filtro com Flip; do cartão ao artigo com View
  Transitions; o desenho que se desenha; a busca que nasce do campo; o caderno marcado; o tema em
  círculo; o Copiar e a marca "cs"). Os lotes foram feitos e mostrados; depois de ver, o Cesar **não
  gostou do conjunto** e pediu para desfazer tudo, ficando só três coisas:
  1. **A marca "cs" abre como livro** (cabeçalho e rodapé, `Marca.astro`): ao passar o mouse ou
     focar, a capa entreabre 38° sobre as páginas e a fita balança até 14° com `elastic`. Só CSS: o
     livro são duas camadas do mesmo traçado (páginas e fita atrás, capa na frente), e as curvas
     `elastic.out` do GSAP vão em `linear()`, sem baixar o GSAP no cabeçalho.
  2. **O desenho se desenha só no destaque da home** (`desenho-vivo.ts`, DrawSVG): quando entra na
     tela, os traços aparecem uma vez, em sequência, e depois a cor, a hachura e os textos; os
     tracejados, por opacidade. Em nenhum outro lugar (nem topo do post, nem cards, nem lista).
  3. **O caderno marcado** nos artigos (`src/plugins/marcacoes.mjs`, `src/scripts/caderno.ts`):
     marca-texto, sublinhado à caneta, só o termo, círculo e colchete na margem, na cor do livro,
     escritos em Markdown com diretivas. A marcação acontece quando o topo do trecho chega a 80% da
     tela e fica (ajuste do Cesar: voltar a rolagem não apaga; a página abre sempre limpa). Guia em
     `docs/marcacoes.md`; a skill `post` propõe as marcações no plano (trecho, tipo, motivo), nos dois
     modos; a revisão em lote ganhou a coluna "Marcações". **Aplicado só no post do Jackson** (o mais
     recente), a pedido do Cesar; os outros recebem quando forem revisados ou escritos. Depois do
     piloto com 7, o Cesar achou pouco e pediu marcação "como alguém estudando mesmo": o Jackson ficou
     com 24, e a regra passou a ser ~uma por parágrafo que ensina algo (o build recusa mais de 30).
     Em 26/09/2026, o Cesar pediu as marcações em **todos os posts**, um de cada vez, aplicadas direto
     (sem o plano prévio da skill): os 27 posts têm de 12 a 30 marcações (um commit por post), com
     o texto visível de cada um conferido letra a letra contra o de antes. Os demais passos da revisão
     em lote (`.claude/revisao-posts.md`) continuam pendentes.
- **Desfeito** (o código dos lotes fica no histórico do git, nos commits entre `e30c0ec` e este):
  lista ⇄ cards e filtro com Flip, View Transitions do cartão ao artigo, desenho no topo do post e no
  hover dos cards, busca com Flip e marca-texto, tema em círculo com a lua virando sol, e o Copiar
  virando visto.
- **Biblioteca nova:** `remark-directive` 4.0.0 (com `mdast-util-directive` e
  `micromark-extension-directive`), pedida pelo Cesar para as diretivas. Código lido antes de instalar:
  sem scripts de instalação, rede, variáveis de ambiente ou comandos; dos mesmos autores do
  unified/micromark que o Astro já usa.
- **Cuidados técnicos:**
  - A pintura do marca-texto e do termo é uma camada de fundo própria (`background-image`,
    animada pelo `background-size`), só com propriedades longas; o código em linha passou a usar
    `background-color` (e não o atalho `background`), para o termo de código ficar pintado.
  - A cor: no claro, a cor do livro a 32%; no escuro, clareada (60% de branco) e mais forte (36%), o
    máximo em que o texto por cima passa de 4,5:1 em todos os livros, também sobre o fundo do
    código (SRE, o limite, dá 4,60:1). O `npm run contraste` confere o texto sobre o marca-texto
    (folha, fundo e código) e a caneta (na cor do sumário) sobre a folha e o fundo.
  - As diretivas de texto pegariam coisas como "03:00" (vira a diretiva `00`): as que não são
    marcações voltam a ser texto, e o texto alternativo das imagens é refeito do Markdown original.
    Conferido: os outros 26 posts saem com o texto idêntico ao de antes.
  - O build recusa mais de 30 marcações por artigo, duas no mesmo parágrafo e marcação em título.
  - Com movimento reduzido, sem JS ou na impressão, tudo aparece já marcado (e o desenho, inteiro).

## D42 · Tema em círculo e Lista / Cards com esmaecer
- **Data:** 26/09/2026 · **Status:** aplicada, sem push.
- **Pedido do Cesar:** as duas animações que ficaram faltando: a da troca de tema e a da troca entre
  Lista e Cards. Ele escolheu entre três propostas para o tema (círculo a partir do botão, folha que
  desce, esmaecer) e duas para a lista (artigos se rearrumando, esmaecer).
- **Decisão:**
  1. **Tema:** o tema novo se espalha em círculo a partir do botão (0,55s,
     `cubic-bezier(0.65, 0, 0.35, 1)`), com `document.startViewTransition` do tipo "tema" e o
     `clip-path` no `::view-transition-new(root)` (`trocarTema` em `tema.ts`, regras em `base.css`).
     Durante a troca, nenhum outro elemento tem nome de transição, para a página virar inteira. É o
     mesmo mecanismo do lote 6 da D41 (desfeito), **sem a lua virando sol** (o ícone só troca, sem
     MorphSVG nem GSAP no cabeçalho).
  2. **Lista / Cards:** a forma atual esmaece em 0,12s e a nova aparece subindo 8px em 0,22s (Web
     Animations, no `SeletorModo`). Um clique no meio da troca cancela a anterior; o botão marca o
     destino na hora. Não é o Flip da D41 (desfeito).
- **Por quê:** as duas trocas eram secas. As versões escolhidas são curtas e só mexem em cor e
  opacidade, sem biblioteca: o navegador sem View Transitions com tipos troca o tema direto.
- **Movimento reduzido:** as duas trocas ficam diretas, como antes.

## D43 · A gaveta volta ao sumário, e o livro sai da estante
- **Data:** 26/09/2026 · **Status:** aplicada, sem push.
- **Pedido do Cesar:** na home, ao tirar o livro da estante, ele deve **sair** (o lugar fica vazio),
  e não aparecer escurecido; e o livro não abre mais: a gaveta volta a ser como antes da D40 (livro
  fechado à esquerda e, à direita, "Neste livro" com o filtro e a lista por ano).
- **Decisão:** substitui a ideia 3 da D40 (o livro que abria, a página com os 6 mais recentes,
  "Próximas ▸", a assinatura no verso e "Guardar o livro").
  1. O voo continua com GSAP: o livro 3D começa sobre a lombada (lombada de frente, mesma altura),
     sobe 40px e vem para a gaveta girando até 38° da frente (1,05s, `power3.inOut`), fechado; ao
     pousar, o sumário aparece subindo 8px. Fechar faz o caminho de volta 1,5× mais rápido.
     **Ajuste do Cesar, com imagem de referência:** primeiro ficou a 18° (o `GIRO` do site, D39);
     ele pediu "mais de lado", como antes da D39, e a gaveta passou a 38° (o antigo 52° a partir da
     lombada). Só na gaveta: o topo da categoria e o livro ampliado continuam a 18°, e o ampliado
     não herda o giro da gaveta.
  2. O livro que voa é o próprio livro da gaveta, já no lugar final, levado por transformações (não
     há mais cópia absoluta sobre a folha). O ponto de partida desconta a subida do hover da estante,
     para o livro voltar exatamente ao lugar.
  3. A lombada retirada fica com opacidade 0: o espaço continua, os vizinhos não se mexem, e ela
     segue clicável (clicar no lugar vazio guarda o livro).
  4. O sumário e a lupa do livro ampliado (D33) são os de antes da D40 (commit `33e5fa0^`), sem a
     gaveta sanfonada: o sumário entra pelo GSAP.
  5. **Ajuste do Cesar (26/09/2026):** clicar no livro da gaveta não leva mais à categoria: abre o
     livro ampliado, como a lupa (a capa deixou de ser link; substitui a D38 na gaveta). O filtro
     "Filtrar neste livro" saiu; na linha do título ficam **Ver o livro** ("Ver a série", botão
     principal com seta, leva à página do livro) e **Fechar livro**. No celular, os botões vão para a
     linha de baixo, alinhados com o título.
- **Mantido:** o `Livro3D` inteiro (usado também pela capa viva e pelo livro ampliado); a página
  dele (slot "pagina") e o verso da capa só não aparecem mais na gaveta.
- **Movimento reduzido:** o livro aparece direto na gaveta e o lugar fica vazio, sem voo.

## D44 · Ajustes da home: títulos em duas partes, busca que nasce do campo e mais
- **Data:** 26/09/2026 · **Status:** aplicada, sem push.
- **Pedido do Cesar** (lista de ajustes na home), e o que mudou:
  1. **Sem o brilho da estante:** a faixa de luz que atravessava as lombadas em repouso saiu
     (`estante-viva.ts` e o CSS `.luz-lombada`). As espiadinhas (um livro que sobe de leve) ficam.
  2. **Tema que abre e fecha:** indo para o escuro, o círculo abre a partir do botão (como na D42);
     voltando ao claro, o escuro se fecha de fora para dentro até o botão (tipo "tema-fecha": a
     imagem antiga fica por cima e o `clip-path` encolhe, com a mesma curva ao contrário).
  3. **Sem o painel lateral na home:** séries, categorias e tags saíram da esquerda da lista; a lista
     e os cards ocupam a largura toda. O painel continua na página de categoria e na da série (o livro
     da pilha que vira o topo da página, D29, depende dele).
  4. **Títulos em duas partes:** "Assunto — complemento" vira o assunto, como estava, e o complemento
     na linha de baixo, sem o travessão, menor (dois terços; 0,56 no topo do artigo), na fonte do texto
     (Literata, sem negrito, `--ink-2`), nunca abaixo de 17px, para ficar maior que o resumo. Na
     lista, nos cards (em todas as páginas que os mostram), no destaque e no topo do artigo
     (`tituloEmPartes` em `formato.ts`, `.titulo-sub` em `base.css`). O texto continua o original,
     letra por letra: o travessão fica escondido (leitor de tela e busca leem o título inteiro) e a
     inicial maiúscula do complemento é só visual (`::first-letter`); a primeira versão usava o
     subtítulo já com maiúscula, e o título indexado pela busca saía "— Como…".
  5. **A busca nasce do campo** (protótipo `docs/historico/prototipos/site-em-movimento.html`): o lote 4 da
     D41, que tinha sido desfeito, voltou como era (janela com Flip a partir do campo, resultados em
     sequência, marca-texto no termo, fechar de volta para o campo). `carregarFlip` voltou ao
     `gsap.ts`.
  6. **Fio embaixo do cabeçalho:** um fio fino na largura toda, na cor `--rule`, sempre à vista (por
     `box-shadow` por dentro, sem mudar a altura do cabeçalho); depois de rolar, soma-se a sombra
     suave que já existia.
- **Movimento reduzido:** o tema e a busca abrem e fecham direto; o resto não anima.

## D45 · A caneta que escreve o progresso da leitura
- **Data:** 26/09/2026 · **Status:** aplicada, sem push.
- **Pedido do Cesar:** a linha de progresso do post, que ficava no alto da tela, passa para baixo do
  cabeçalho (onde está a busca), com uma caneta indo fazendo a linha.
- **Decisão:** o traço (2px, na cor da categoria, clareado no escuro) corre exatamente sobre o fio do
  cabeçalho da D44, e uma caneta de 22px vai na ponta dele, com a ponta encostada no fim do traço
  (corpo em `--paper-hi` com contorno `--ink`, ponta na cor da categoria). A caneta só aparece depois
  que a leitura começa. O script põe `--lido` (0 a 1) e a classe `escrevendo`; a caneta anda por
  `translateX` em `cqw` (a barra é um contêiner), sem mexer no layout. Com o cabeçalho escondido no
  celular (D38), o traço sobe para o alto da tela (e a caneta, que fica acima dele, sai de vista até o
  cabeçalho voltar). Primeiro a caneta tinha 16px: parecia um risco, e foi para 22px.
- **Por quê:** o fio do cabeçalho vira o caderno onde a leitura é escrita, na linguagem do caderno
  marcado (D41), sem uma faixa solta no topo da tela.
- **Movimento reduzido:** o traço e a caneta seguem a rolagem (não são animação); só as transições
  curtas saem.

## D46 · Livros de lado, pilha que troca de livro, menu do celular e o artigo mais largo
- **Data:** 26/09/2026 · **Status:** aplicada e publicada (parte 1 da lista de 26/09/2026,
  `docs/historico/controle-parte1.md`).
- **Pedido do Cesar e o que mudou:**
  1. **Lista:** a descrição dos artigos ia só até 68ch e deixava um vão até a miniatura; agora vai até
     perto dela, em toda lista (`ItemLista`).
  2. **Livro de lado em todo lugar:** o livro 3D fica a **38°** da frente (era 18° fora da gaveta),
     com a perspectiva proporcional à altura do livro (`calc(var(--bh) * 4.7)`, a da gaveta), para a
     grade, o topo da página do livro, o livro do artigo e o livro ampliado terem a cara do da gaveta.
  3. **Sem a capa que segue o mouse** (`capa-viva.ts`, D40, apagado): volta o efeito de antes, só CSS
     (`data-livro-gira`): o livro gira de 38° para 24° ao passar o mouse. A capa entreaberta e a luz
     saíram junto.
  4. **Painel lateral só do tipo da página:** na categoria, só as categorias; na série, só as séries;
     sem tags (o RSS fica). O livro aberto sai da pilha. Com uma série só, a prateleira fica vazia com
     "Outras séries aparecem aqui." (escolha do Cesar entre três opções). O painel perdeu a rolagem
     por dentro (e com ela a rolagem lateral que aparecia na página da série).
  5. **Pilha que troca de livro:** clicar puxa o livro para fora e os de cima caem no lugar dele; a
     página nova abre e a transição leva o que estava aberto ao topo da pilha. A ordem da pilha fica
     na sessão (`cs-pilha-categorias`, `cs-pilha-series`): um script inline, logo depois da lista, a
     aplica antes da primeira pintura e põe no topo o livro da página anterior (pelo `referrer`).
  6. **Livros deitados menos gordos:** a espessura passou de 112% para 62% da escala do comprimento;
     o título e o número ganharam corpo próprio (~10px) para continuarem legíveis.
  7. **Cabeçalho do celular sempre à vista** (desfaz o esconder da D38), numa linha, com um botão de
     menu que abre as seções numa folha com nota curta em cada uma, os perfis e um véu.
  8. **Sem a lousa de passos** (a caneta desenhando enquanto o texto rola): os dois posts que a
     tinham (`cobranca-duplicada-no-retry` e `jackson-filtros-mascarando-cartao`) passaram a usar a
     linha do tempo de arrastar, com um estado por passo e os passos numa lista embaixo. Os
     componentes `LousaPassos` e `Passo` e o CSS deles foram apagados; a skill `lousa` proíbe a volta.
     A caneta do fio do cabeçalho (D45) fica (confirmado pelo Cesar).
  9. **Artigo:** a coluna da esquerda ("Neste artigo") começa no topo, ao lado da ilustração; o topo e
     o corpo têm a mesma largura; o texto ocupa a folha, na largura do código (fim da coluna de
     720px da D39); o topo usa a largura toda para o título e o resumo; embaixo do sumário, o livro do
     artigo grande e de lado, com a lupa (no lugar do "Do livro" compacto); posts com menos de 3
     seções têm a coluna só com o livro.
- **Por quê:** pedidos diretos do Cesar ao revisar o site; o livro de lado e o efeito antigo já tinham
  sido aprovados na gaveta e antes da D40.
- **Alternativas:** para a série única, mostrar a própria série puxada ou tirar a lateral (recusadas).
- **Movimento reduzido:** a pilha não anima (o clique só abre a página), o livro não gira, o menu
  abre e fecha direto.

## D47 · Marca em degrau, estante que só sobe, abertura do site e o movimento das páginas
- **Data:** 26/09/2026 · **Status:** aplicada **só local, sem commit**, aguardando o Cesar validar
  (parte 2 da lista de 26/09/2026, `docs/historico/controle-parte2.md`).
- **Pedido do Cesar e o que mudou:**
  1. **Marca "cs":** o "c" 5,4 acima e o "s" 5,4 abaixo do centro da capa, um pouco maiores, e **sem a
     fita** (gerador `scripts/marca.mjs`, favicon e ícone do iPhone regerados; saiu o token
     `--marca-fita`). Na abertura da home, o livro tem a altura das duas linhas do nome, com "Cesar" e
     "Schutz" empilhados e o "blog" depois do sobrenome; o livro grande abre ao passar o mouse. O nome
     fica sem acento, como em todo o site.
  2. **Estante realista:** o livro puxado só desliza para cima (16px); os dois vizinhos sobem 2px pelo
     atrito, um pouco depois; nada inclina (o topo inclinado entrava no livro ao lado); ao soltar,
     desce e assenta com `bounce.out`. As espiadinhas em repouso também só sobem.
  3. **Abertura do site** (`Abertura.astro`, inspirada em clevante.cz): na primeira visita da sessão,
     só na home e sem movimento reduzido, uma folha de papel cobre a página com o livro "cs" e o fio
     escrito pela caneta (a da leitura, D45) com a contagem até 100; quando a página e as fontes estão
     prontas (no mínimo ~1,2s, no máximo ~2,6s), o livro voa até o livro grande da abertura (no
     celular, até o do cabeçalho), a folha sobe e o site chega: o destaque, a folha da abertura, o nome
     linha a linha, os livros descendo para a prateleira um a um e, por último, o cabeçalho. No celular,
     sem os livros um a um. O script do `<head>` decide e tira sozinho a abertura depois de 7s.
  4. **Troca de páginas, a mesma de qualquer página para qualquer outra** (base.css): o cabeçalho fica
     parado; a página antiga sai subindo 6px e sumindo (0,2s) e a nova chega subindo 18px (0,5s), como
     uma folha posta na mesa; os livros voam quando estão nas duas páginas (e o que não tem par sai com
     a folha, em vez de sumir por cima de tudo, o problema da categoria para o post); o desenho do
     artigo na lista, nos cards e no destaque vira o desenho do topo do post.
  5. **Gaveta que cresce:** abre crescendo (0,8s) com o conteúdo de baixo descendo junto, recolhe ao
     fechar e, na troca de livro, vai da altura de um para a do outro.
  6. **Livro ampliado:** cresce a partir do livro de onde saiu (que some do lugar) e, ao fechar (botão,
     Esc ou clique fora), volta para ele, girando de volta a 38°, com o véu clareando.
  7. **Filtro por livro** (arquivo e tags): a lista esmaece e os artigos escolhidos chegam subindo em
     sequência.
  8. **Rolagem suave** nos links do sumário e nas âncoras.
- **Movimento reduzido:** sem abertura, sem transição de página, a gaveta e o livro ampliado abrem
  direto, o filtro troca direto.


## D48 · A caneta do caderno: marcações estáticas, azuis e com 20 tipos
- **Data:** 26/09/2026 · **Status:** aprovada e **publicada** em 26/09/2026 (o Cesar aprovou a
  proposta dos pilotos e pediu o push e a publicação ao terminar). Substitui a parte do caderno
  marcado da D41 (a marca "cs" e o desenho do destaque da D41 continuam).
- **Pedido do Cesar:** refazer o caderno marcado a partir de `docs/prototipos/caneta-do-caderno.html`,
  o catálogo com todas as marcações nos dois temas, já com a caneta azul escolhida.
- **Decisão:**
  1. **Estáticas:** as marcações já vêm feitas, como se o texto tivesse sido riscado à caneta antes
     de publicar. Saíram a animação por rolagem (`src/scripts/caderno.ts`, ScrollTrigger e DrawSVG
     do caderno; o `carregarRolagem` do `gsap.ts`) e a variável `--caneta-livro` do artigo.
  2. **Caneta azul fixa** em todos os livros: token `caneta`, #1F4FB5 no claro e #8FA8FF no escuro.
     Para não confundir com os links, **a caneta nunca pinta o texto**: o texto marcado fica na cor
     normal; só os traços e as notas à mão ficam azuis, e as notas não têm sublinhado.
  3. **Marca-texto amarelo** (`--marca-texto`: #FFE27A; no escuro, rgb(255 214 90 / 0.3)), no lugar
     da cor do livro, com o texto sempre em `--ink`; no máximo uma ou duas vezes por post.
  4. **20 tipos**, cada um com um papel (`docs/marcacoes.md`): marca-texto, ondulado, círculo,
     colchete, duplo, caixa, nota na margem, riscado com correção, asterisco, certo e errado, números
     circulados, chave, riscado simples, seta ligando, exclamação, interrogação com nota, sinal entre
     termos, anotação no código, linhas marcadas no código e comentário do autor (só com frase dele).
     A "caixa numa definição" do catálogo ficou de fora da lista do Cesar e não entrou.
  5. **A pintura dos termos das listas (`:::termos`) saiu**; no lugar, a caixa à mão (`:::caixas`).
  6. **Letra à mão:** Caveat 600, auto-hospedada, declarada só nos posts com nota escrita.
  7. **Limites cobrados no build:** até 12 marcações por post (o guia pede de 6 a 12), marca-texto
     até 2, o mesmo tipo até 3 (fora os de lista), nunca duas no mesmo parágrafo, nada em títulos,
     traço sem quebra até 32 caracteres e nota até 40.
  8. **Telas:** marcas de margem no respiro da folha a partir de 940px e no recuo do parágrafo abaixo
     disso; notas acima da palavra abrem espaço na própria linha e vão para depois da palavra quando
     não cabem; notas no código ao lado da linha quando cabem e embaixo dela (paradas na esquerda do
     bloco) quando não, e sempre no celular.
  9. **A caneta é a última etapa** de todo post: skill nova `caneta` (ler o guia, ler o post, propor,
     aplicar, testar em 320, 390, 768, 1280 e 1600px nos dois temas, relatório). A skill `post` a
     chama no fim (passo 9); o Cesar também pode chamá-la sozinha. As marcações saíram do plano do
     passo 2 da skill `post`.
  10. **Guia vivo:** `docs/marcacoes.md` reescrito, com a seção "Ajustes do Cesar", onde entra, com a
      data, todo ajuste que ele pedir nas marcações.
  11. **As marcações da D41 saíram dos 27 posts** (texto idêntico, conferido pelo Markdown antes e
      depois). Os outros 25 recebem a caneta na revisão pelo `.claude/revisao-posts.md` (coluna
      "Caneta").
  12. **Pilotos** (26/09/2026, pela skill `caneta`, proposta aprovada pelo Cesar sem ajustes): o JWT e a
      chave de idempotência com 12 marcações cada (tabelas em `docs/marcacoes.md`, "Exemplos"),
      texto idêntico ao de antes. Testados pelo `chrome-devtools` em 320, 390, 768, 1280 e 1600px, nos
      dois temas: sem rolagem lateral, sem marca cortada, sem nota cobrindo a linha de cima, notas do
      código visíveis; console sem erros. Antes e depois em `.impeccable/review/caneta/` (fora do git).
  13. **Ajustes que os testes pediram:** no celular, a folha do artigo passa 12px do texto de cada lado
      (a borda cortava o sublinhado de uma palavra que abria a linha); a nota acima da palavra abre
      1,3em e desce 0,25em (a ponta inclinada chegava perto das letras de cima) e, quando passaria da
      margem direita, termina sobre a palavra em vez de ir para depois dela; o círculo tem folga
      proporcional ao trecho e, acima de 12 caracteres, se cruza no alto (cortava o "4" de
      `422 Unprocessable Content`); a seta ligando fica mais perto do próprio trecho (parecia sublinhar
      a linha de cima); o círculo no código quase não abre espaço dos lados (a vírgula se afastava do
      número).
- **Motivo:** o Cesar escolheu o catálogo; a cor do livro no marca-texto escondia o texto em algumas
  cores, a animação chamava atenção demais, e as marcações da D41 (de 12 a 30 por post) eram
  densas demais para destacar o que importa.
- **Técnica:**
  - `src/plugins/marcacoes.mjs` gera o HTML dos 20 tipos direto no remark (nós com `hName`,
    `hProperties` e `hChildren`), sem o passo de rehype da D41; os nomes antigos (`:sublinhado`,
    `:::termos`) dão erro no build. `src/lib/codigo.ts` ganhou o `pluginCaneta` do Expressive Code
    (atributos `anotar` e `linhas` da cerca); o Copiar continua levando só o código.
  - `src/styles/caneta.css` (novo) tem o visual; `src/scripts/caneta.ts` só decide se a nota acima
    da palavra cabe (sem JS, ela fica acima). Traços SVG decorativos (`aria-hidden`); notas lidas
    entre parênteses; sinal ≠ lido "diferente de"; riscado em `<s>`; alto contraste e impressão
    cobertos.
  - `npm run contraste` confere o texto sobre o amarelo (folha e fundo) e a caneta sobre a folha, o
    fundo e o código, a 4,5:1, nos dois temas: 12,75:1 e 5,92:1 no amarelo; a caneta, de 6,47:1 a
    8,00:1.
  - Catálogo no dev em `/amostra/caneta/` (`src/amostra/caneta.md`, fora dos limites de propósito).
- **Biblioteca nova:** `@fontsource/caveat` 5.3.0 (pedida pelo Cesar: Caveat auto-hospedada). Código
  lido antes de instalar: só CSS, woff2, metadados e a licença OFL; sem scripts de instalação, rede,
  variáveis de ambiente ou comandos. Um peso só (600, 51 KB no latim), em vez da variável (75 KB).
- **Alternativas:** manter a animação só no marca-texto (o Cesar pediu tudo estático); a caneta na
  cor do livro, vermelha ou grafite (comparadas no catálogo; ficou o azul); a Caveat variável.

## D49 · As ideias de movimento revistas: sumário, estante, livros, cabeçalho, listas e artigo
- **Data:** 26/09/2026 · **Status:** aprovada pelo Cesar (item a item, abaixo), **feita e publicada
  na `main`** em 26/09/2026, a pedido dele (um commit por item, do C2 ao E4; o C3 ficou de fora).
- **Pedido do Cesar:** aplicar os protótipos revistos em `docs/historico/prototipos/ideias/ja feitas ou
  reprovadas/`, na ordem, a partir do C2, com as observações dele em cada um, e no fim listar o que
  foi feito.
- **Decisões do Cesar, item a item:**
  - **C2, o sumário que acompanha:** aplicar. E o botão de voltar ao topo, embaixo, **em todas as
    páginas longas** (resposta dele à pergunta).
  - **C3, o código que responde:** **não aplicar**.
  - **D1, a estante de verdade:** aplicar; e, se possível, levar a mesma ideia aos livros das
    categorias, mais realista: primeiro guardar o livro aberto, depois puxar o outro.
  - **D2, o livro que abre:** aplicar, **só no livro ampliado** (resposta dele à pergunta).
  - **D3, a pilha com peso:** aplicar, mas sem um livro passando por cima do outro: primeiro o livro
    aberto volta para a pilha, depois o outro é puxado, o mais realista possível.
  - **E1, cabeçalho e rodapé:** 1, o traço de caneta do menu com a transição "desliza" (View
    Transition); 2, a tecla ⌘K que afunda; 3, o sol e a lua, propostas A e B; 4, o sinal do RSS e os
    fios do rodapé.
  - **E2, lista, cards e paginação:** 1, a pílula que escorre; 2, o colchete no item da lista; 3, o
    círculo e a seta da paginação (e, se ficar bom, o mesmo círculo nos ícones do LinkedIn e do
    GitHub do cabeçalho); 4, o contador que rola no filtro.
  - **E3, o artigo de perto:** 1, a tinta do link; 2, o "Copiar" do código em sequência, e corrigir a
    etiqueta da linguagem nos blocos sem título (ela ficava colada e mal desenhada à direita, como no
    segundo bloco do post do Jackson); 3, copiar o link do título; 4, a seta e a orelha do anterior e
    próximo; 5, a animação do voltar ao topo.
  - **E4, busca e 404:** 1, o 404 com a rasura e a sugestão, numa página mais elegante, com algo dos
    livros (a de hoje está "muito morta"); 2, o sublinhado ondulado da busca vazia; 3, o marcador que
    desliza; 4, os minutos que rolam.
- **Feito:**
  1. **C2** (sumário e voltar ao topo): o trilho do sumário lateral ganhou o fio de tinta que desce
     com a leitura, o visto em cada seção lida e o marca-texto na cor do livro na seção atual; no
     celular e no tablet, o cabeçalho mostra "N de M · seção" no lugar da marca (entra por baixo ao
     descer e por cima ao subir) e abre o sumário numa folha que desce do cabeçalho, com as cores do
     livro. O voltar ao topo (`VoltarTopo.astro`) saiu do artigo e foi para o `Base.astro`: aparece em
     toda página depois de uma tela de rolagem e devolve o foco ao título. Contraste da seção atual
     no `npm run contraste` (o menor: 4,94:1).
  2. **D1** (a estante de verdade, `src/scripts/estante-gesto.ts`, `estante-viva.ts`,
     `Gaveta.astro`, `estante.css`): o mouse na lombada não levanta mais o livro (16px, D47): ele tomba
     5° para a frente pela borda de baixo e mostra a cabeça (o topo das páginas, `.cabeca`), sem mexer
     os vizinhos; as espiadinhas da home viraram o mesmo toque. Tirar um livro (clique, toque ou
     Enter): ele tomba pela cabeça dentro do próprio vão, vem para a frente (e o vizinho da direita,
     sem apoio, tomba até encostar no outro, pela geometria real das lombadas) e só então vira o livro
     3D da gaveta, que anda até ela girando. Guardar: o livro volta até a frente do lugar dele, entra
     empurrando o vizinho de volta e assenta; a inclinada volta a se apoiar no aparador. Trocar de
     livro guarda o aberto antes de tirar o outro. Com mouse, dá para puxar a cabeça do livro e
     arrastá-lo (Draggable e InertiaPlugin): solto abaixo da prateleira, vai para a gaveta; no ar,
     volta; sem chegar a 22°, cai de volta em pé. No celular, o gesto é 20% mais rápido e sem arrasto.
     Com movimento reduzido, tudo direto no estado final (o vizinho já aparece tombado). Na estante
     de filtro do arquivo e das tags, o mesmo toque na cabeça.
  3. **D2** (o livro que abre, só no livro ampliado; `LivroAmpliado.astro`, `paginas.css`,
     `src/pages/livros/[slug].json.ts`): no lugar do livro que girava com embalo (D40), o livro
     ampliado abre. A capa dura gira pela lombada e o livro vira de frente enquanto abre; dentro, a
     guarda na cor do livro com o ex-libris (o ícone do livro, "Cesar Schutz" e o endereço), o
     sumário de verdade ("Ordem de leitura" na série), uma página por artigo (número, título,
     subtítulo, descrição, "Ler o artigo →" e a data), uma página de notas quando o número de artigos
     é ímpar, o fim do volume e, dentro da contracapa, o próximo livro da coleção (na ordem da
     estante; depois da série, o volume 01). As folhas curvam ao virar (duas metades, a de fora 24°
     atrás) e a capa é pesada (sai devagar, bate e assenta). Arrastar vira ou volta (a velocidade do
     arrasto decide, InertiaPlugin); também os botões embaixo, as setas e um clique na página. No
     celular, a vista corre para a página da vez e as folhas viram retas. Fechar o visor fecha o livro
     antes de ele voltar para o de origem. As páginas vêm de `/livros/<slug>.json`, buscadas ao abrir
     (e antes, na lupa). O livro é desenho (aria-hidden, links sem foco): a legenda diz a página da vez
     (e os títulos, para o leitor de tela), e o livro inteiro está em "Ver o livro". Correções em
     relação ao protótipo: o link das páginas em tinta de papel (o azul do escuro não passava no papel),
     a duração da inércia dentro do `inertia` (fora dele, valia 1,2s) e a emenda das duas metades num
     pixel inteiro (as letras que a cruzavam se partiam).
  4. **D3** (a pilha com peso, `PainelHome.astro`; é também o pedido do D1 para os livros das
     categorias): trocar de livro pela pilha agora **guarda o aberto antes de puxar o outro**. O livro
     do topo da página vira de lado (a lombada para o leitor), voa até a pilha deitando-se e é pousado
     em cima dela (vem por cima, desce por gravidade, afunda 1px e para), no espaço que a pilha passou a
     guardar em cima (`--folga`, a espessura do livro aberto). Só então o escolhido é puxado: os de cima
     vão junto nos primeiros 6px pelo atrito; quando a ponta dele passa do centro de massa do bloco, o
     bloco tomba sobre a quina (até 25°, apoiado no livro de baixo); quando ele sai inteiro, o bloco cai
     no lugar com um baque. Aí a página nova abre, e a View Transition leva só o puxado ao topo (o antigo
     já está na pilha: nada se cruza no ar). O mouse em cima tira o livro 8px e arrasta o bloco 1,5px
     (sem a mola de antes). Com mouse, dá para puxar o livro: solto depois da metade (a velocidade
     conta), ele sai, espera ao lado enquanto o aberto é guardado e a página abre; antes, volta
     perdendo velocidade. No celular, sem arrasto; se o topo estiver fora da tela, o livro aberto só
     chega por cima da pilha. Voltar pelo histórico devolve a pilha e o topo como estavam.
  5. **E1** (cabeçalho e rodapé; `src/lib/traco.ts`, `traco.css`, `Cabecalho.astro`,
     `Rodape.astro`, `SeletorTema.astro`): o sublinhado reto da seção atual virou um **traço de
     caneta**, torto de um jeito próprio em cada item (o tremor sai de uma semente tirada do nome, e
     fica igual em toda visita), e **desliza de um item para o outro** na troca de página (View
     Transition `traco-do-menu`); de uma página fora do menu, ele se escreve, e para uma, some pela
     direita. O mouse escreve um traço leve (0,32s) que, ao sair, termina de passar e some pela
     direita, como a caneta que segue adiante. No celular, o traço da seção atual se escreve quando a
     folha do menu termina de descer (no lugar do tracinho de 14px). A lupa inclina no hover; a tecla
     ⌘K afunda 1,5px por 120ms quando é usada (pelo atalho ou pelo clique) e o campo dá um toque
     quando a busca nasce dele. **Sol e lua** (propostas A e B; **a B reabre a D44**, em que o ícone só
     trocava): no hover, o sol gira 22° e a lua balança 14°; na troca, a lua se enche até virar o miolo
     do sol (MorphSVG, 0,4s) e os raios se escrevem de dentro para fora; de volta ao claro, os raios
     recolhem e a lua é "mordida" de volta. O botão fica por cima do círculo da troca, com o ícone
     animando. O MorphSVG e o DrawSVG vêm no pacote do GSAP (sem instalar nada) e só são baixados ao
     passar o mouse, tocar ou focar o botão. No rodapé, o RSS dá o sinal (os arcos se escrevem a partir
     do ponto, um depois do outro) e os links ganham o mesmo traço leve do menu. Com movimento
     reduzido, os traços aparecem prontos e o ícone troca seco.
  6. **E2** (lista, cards e paginação; `SeletorModo.astro`, `ItemLista.astro`, `Paginacao.astro`,
     `ListaFiltrada.astro`, `src/scripts/contador.ts`): no seletor Lista / Cards, o azul virou uma
     **tinta só**, atrás dos dois botões, que **escorre** de um para o outro (a borda da frente corre
     em 0,2s e a de trás alcança em 0,28s; só CSS, o script mede). No hover de um artigo da lista (ou
     com o foco no título), a caneta escreve um **colchete na margem** (0,34s, de cima para baixo) e,
     ao sair, ele some por baixo; o tremor é o de cada título. Na paginação, a caneta **circula o
     número** (uma volta e 8%, 0,42s) e a seta de "Mais artigos" e de "Anteriores" avança 3px no hover
     e, no clique, sai pela frente e volta por trás. O mesmo círculo foi para o **GitHub e o LinkedIn
     do cabeçalho**, no lugar do fundo cinza (o Cesar deixou a meu critério; ficou bom e une o
     cabeçalho à paginação). No filtro por livro, o total e o de cada ano **rodam como contador**, já
     no clique, cada algarismo numa fita (0,55s; as dezenas fecham quando o número perde um
     algarismo); o leitor de tela ouve só o valor final. O colchete e o círculo só aparecem com mouse
     (ou foco); com movimento reduzido, tudo troca seco. Correção em relação ao protótipo: o traço
     parado fica no meio do vão (`stroke-dasharray: 1 2`), longe da ponta, senão a ponta redonda
     deixava um ponto no começo do círculo (o mesmo acerto foi para o sinal do RSS).
  7. **E3** (o artigo de perto; `prosa.css`, `src/lib/codigo.ts`, `copiado.ts` e `copiado.css`,
     `RodapeArtigo.astro`, `VoltarTopo.astro`): **a tinta do link**: nos links do texto, o sublinhado
     em repouso fica mais leve e, com o mouse ou o foco, a tinta azul sobe de baixo até 42% da linha
     (0,3s; `--link-tinta`, 16% no claro e 18% no escuro, e não os 24% do protótipo: com eles, o link
     passava a 4,1:1 sobre os avisos; `npm run contraste` confere). **O Copiar do código**: no lugar
     do ícone e do balão preto do Expressive Code, as duas folhas do ícone se decalcam, somem e a
     caneta faz o visto, enquanto o botão abre para a esquerda e "Copiado" sobe letra por letra; em
     1,6s, tudo volta. Quem copia continua sendo o Expressive Code (o aviso dele vai para o leitor de
     tela, escondido da tela). **A etiqueta da linguagem**, pedido do Cesar: nos blocos sem título, a
     barra ficava da altura da etiqueta (21px, contra 35px da barra com título) e o "Java" ficava
     espremido no alto, à direita, como no segundo bloco do post do Jackson; agora a barra tem sempre
     a mesma altura, com a etiqueta no meio dela. **Copiar link**: o mesmo gesto (os elos se juntam,
     o visto, "Link copiado" rolando), e a pílula cresce sem pular, com as vizinhas andando junto.
     **Anterior e próximo**: a seta abre o próprio espaço apontando para onde se vai, e o canto de
     fora do cartão dobra (a orelha de 16px, com o verso levemente azul). **Voltar ao topo**: entra
     subindo 14px e assenta (a curva do back.out, em CSS `linear()`), sai mais depressa e, no
     clique, a seta sai por cima e volta por baixo enquanto a página sobe; escondido, sai do Tab. Tudo
     em CSS e Web Animations, sem GSAP (o artigo não o carrega): o SplitText do protótipo virou letras
     em `span` com a animação no CSS, que voltam a ser um texto só no fim (as letras soltas perdem o
     kerning). Com movimento reduzido, tudo troca seco.
  8. **E4** (busca, 404 e números; `src/pages/404.astro`, `Busca.astro`, `Sumario.astro` e
     `artigo.ts`): **a 404 ganhou vida com os livros**, como o Cesar pediu: é a folha da abertura da
     home, com o erro de um lado e a estante inteira do outro ("os livros continuam no lugar"; cada
     lombada leva ao livro). A caneta rasura o endereço pedido (dois traços, 0,3s depois de abrir;
     um par por linha quando ele quebra) e, quando ele se parece com o de um artigo, de um livro ou de
     uma tag (`/posts/java21`, `/posts/idempotencia/`, `/categories/Arquitetura de Sofware/`), a
     página diz "Talvez seja este:" num cartão com o livro (o quadradinho na cor dele), o título e
     "Ler o artigo →". A lista dos endereços vem na página e a comparação é por distância de edição e
     por trecho do título. **Na busca**, um marcador só (o fundo e o fio azul) desliza até o resultado
     da vez, seguindo as setas, o foco e o mouse (0,28s); o primeiro já vem marcado e o Enter no campo
     abre o marcado. Sem resultado, o termo ganha **a ondinha de revisor** na cor de Cuidado (0,45s) e
     embaixo vem a saída: "Tente um termo mais curto ou veja todas as tags". **No sumário**, os
     minutos que faltam rodam como contador (o mesmo do filtro, 0,4s) e, no fim, "faltam 1 min" sobe e
     dá lugar a "chegou ao fim". Correção em relação ao protótipo: a dica da busca vazia chega só por
     opacidade (deslocada, passava do fim da janela e a barra de rolagem piscava). Nada disso usa
     GSAP (a rasura e a ondinha são traçados de comprimento 1 com animação de CSS; o marcador, uma
     transição que só muda de destino). Com movimento reduzido, tudo aparece pronto.
- **Conferido:** `npm run check` sem erros, `npm run contraste` sem falhas (com a tinta do link),
  `npm run build -- --force` e `npm run links` (86 páginas, nenhum link quebrado) e 100 combinações
  de página (home, arquivo filtrado, categorias, categoria, série, tag, dois artigos, página 2 e 404),
  largura (320, 390, 768, 1280 e 1600px) e tema (claro e escuro) no preview, sem rolagem lateral e
  sem erro no console. Cada item também foi conferido quadro a quadro no Chrome (MCP), no celular
  e com movimento reduzido.
- **Motivo:** o Cesar revisou os protótipos um a um e escolheu o que entra.

## D50 · Ajustes de 27/09/2026: o traço da leitura, a troca de livro, o livro ampliado, o cabeçalho, o tema, a marca d'água e os atalhos
- **Data:** 27/09/2026 · **Status:** aplicada **só local, sem commit**, aguardando o Cesar ver no
  localhost (ele pediu para ver antes de commitar).
- **Pedido do Cesar e o que mudou:**
  1. **O traço da leitura voltou a ser fino.** Causa: a regra global `.traco` do traço de caneta do
     menu (E1, `traco.css`) também pegava o traço da barra de leitura (a mesma classe) e o deixava com
     8px de altura. A barra passou a usar `.risco`, e a regra do menu vale só para `svg.traco` (ela
     também pegava os `<g class="traco">` das lousas).
  2. **Trocar de livro pela pilha leva o livro até o lugar dele**, como na home: depois de o aberto
     ser guardado e o escolhido puxado (D49, D3), o escolhido se põe em pé, voa até o topo da página
     com a lombada para o leitor e gira até ficar de lado; só então a página nova abre, com ele já no
     lugar. Antes, a transição de página esticava a lombada deitada até o livro grande, esmaecendo uma
     imagem na outra ("some e aparece grande"). O livro que gira é o da página nova: o clique busca o
     HTML dela (`fetch`) e tira de lá o `.livro-em-pe` do topo, que entra no lugar do antigo; a
     transição encontra os dois no mesmo lugar e não mexe mais nele. Se o HTML não chegar em 1,5s, ou
     se o topo estiver fora da tela (a pilha fica embaixo do conteúdo no celular), a troca é a de antes.
  3. **Os links do livro ampliado funcionam.** Causa: as folhas ficam empilhadas em 3D a décimos de
     pixel uma da outra, e o navegador entregava o clique a outra folha (a de baixo ou a metade da
     vizinha); só "Ver o livro inteiro", na última folha, acertava. Agora quem decide o link é o
     estado do livro: as páginas à vista (a guarda, as costas da última folha virada, a frente da
     próxima ou a página do próximo livro) e o retângulo de cada link. A animação: um artigo abre na
     hora, com a troca de página do site (o livro de origem não voa por baixo do visor); o próximo
     livro fecha este, que volta ao lugar, e, se o outro estiver na pilha ao lado, a troca é a da pilha
     (guarda, puxa e leva ao topo); o próprio livro ("Ver o livro inteiro" na página dele) só fecha.
     Cmd ou Ctrl abrem numa aba nova.
  4. **O cabeçalho não treme na troca de página.** Duas causas, medidas quadro a quadro: o botão de
     tema nascia escondido (`hidden`) até o script dele rodar, e o menu inteiro ficava 40px à direita
     no primeiro quadro; e, no primeiro quadro da página nova, a fonte da interface ainda não estava
     pronta (o menu aparecia na fonte de reserva, mais larga). O botão agora aparece já na primeira
     pintura (um script inline logo depois dele põe o ícone certo; sem JS, o `data-js` do `<head>`
     o esconde), e o cabeçalho antigo fica à vista por 0,12s antes do novo, trocando de uma vez (o
     traço da seção atual desliza por cima o tempo todo).
  5. **A troca de tema, nos dois sentidos:** indo para o escuro, a página clara fica parada embaixo do
     círculo (ela esmaecia, o padrão do navegador, e deixava ver o fundo já escuro antes de o círculo
     crescer); voltando ao claro, o botão guarda as cores do escuro até o escuro se fechar nele (ficava
     branco antes da animação); o círculo nasce do tamanho do botão (e morre nele), e não de um
     ponto; a barra de rolagem da página vira no fim, com o círculo (o `color-scheme` fica parado na
     troca); cliques seguidos desfazem a troca anterior antes da próxima.
  6. **A marca d'água saiu do fim do artigo** (ficava atrás de "anterior / próximo") e foi para o
     canto de baixo do painel do título, cortada pela borda, como no topo das páginas de categoria e
     de série (a segunda opção do Cesar; perto das Fontes ela ficaria atrás dos links da lista). No
     celular, menor (300px).
  7. **Atalhos de teclado no artigo** (`Atalhos.astro`): Espaço, a próxima seção; Shift + Espaço, a
     anterior (depois da última, ou antes da primeira, o Espaço rola a página como sempre); T, o topo
     (pelo botão do canto, com a animação e o foco dele); ← e →, o artigo anterior e o próximo; ?, a
     lista. Onde aparecem: "Atalhos ?" discreto embaixo do progresso do sumário lateral, só com mouse e
     teclado, que abre um cartão (popover nativo) com a lista e a opção de desligar os atalhos
     (WCAG 2.1.4, `cs-atalhos` no navegador). Quietos com o foco num campo, botão, bloco de código,
     lousa ou elemento que usa o teclado, com um diálogo aberto e com o sumário do celular aberto.
- **Movimento reduzido:** a pilha e o livro ampliado seguem direto (sem voo), o tema troca seco, e os
  atalhos rolam sem suavidade.
- **Conferido:** `npm run check` sem erros, `npm run contraste` sem falhas, build e `npm run links`
  (86 páginas, nenhum link quebrado); cada item gravado quadro a quadro no Chrome (MCP) no dev e no
  preview; o celular (390px) no artigo e na categoria.

## D51 · As animações revistas: abertura, troca de tela e as trocas especiais (em escolha)
- **Data:** 27/09/2026 · **Status:** escolhida pelo Cesar; **em aplicação**, só local, sem commit
  (protótipos em `docs/prototipos/animacoes/`).
- **Pedido do Cesar:** a abertura da home vira o A3 (com o fio da caneta num risco só, e não em três) e
  toca sempre ao entrar no site; nas outras telas, entrada direta com o caderno; uma troca de tela
  geral no estilo do fim do A2 (as folhas chegam do fundo), com o que sai também animado, e duas
  montagens para comparar (texto fora dos painéis e tudo em painel); trocas especiais para
  Categorias (os livros em desfile, pousando numa pilha e depois cada um no seu lugar), para a página
  de uma tag, para artigo anterior e próximo (B1), para livro e artigo (B3, mais discreto) e o desenho
  do artigo que se desenha (C1).
- **Decidido pelo Cesar (27/09/2026):** a abertura toca **ao chegar de fora** (link, endereço
  digitado, favorito) **e ao recarregar**; andando por dentro do site (clicar na marca, por exemplo),
  vale a troca de tela geral. Hoje ela tocava uma vez por aba (`cs-aberto` na sessão), e por isso não
  voltava ao recarregar.
- **Escolhas do Cesar (27/09/2026, sobre os protótipos):** 01, abertura da home **como no A3** (a
  estante volta para a folha dela e o papel esmaece, mostrando o site de uma vez); 02, entrada direta
  noutra tela: o caderno **vai para o cabeçalho**; 03, troca geral: saída **cai da mesa**, montagem
  **texto fora** (o layout de hoje); 04, Categorias: **desfile e pilha** (sempre); 05, página de uma
  tag: **desfile direto**; 06, artigo anterior e próximo: **na pilha**; 07, livro e artigo: **só o
  livro viaja**; 08, o desenho do artigo: **depois de pousar**. Pediu para aplicar como escolheu, com
  a revisão de acabamento por agentes, e para ver no localhost antes do commit.
- **Como ficou no site (27/09/2026):**
  - **Troca por folhas** (`src/scripts/troca.js`, embutido no `<head>` pelo `Base.astro`): sem atrasar
    o clique. No `pageswap`, cada folha à vista (as `.folha` de fora, ou `[data-unidade]`) e cada texto
    solto entre elas ganha um nome de View Transition (`sai-N`, classe `sai`); no `pagereveal`, a página
    nova anima as imagens antigas pela Web Animations API (caem da mesa) e as próprias folhas (chegam
    do fundo). A raiz não anima (tipos "folhas" e "lado" em `base.css`). O conteúdo só é pintado depois
    de lido (`<link rel="expect" blocking="render">`), para as folhas à vista serem medidas certo.
  - **Só o livro viaja:** os nomes de livro de antes (D29) continuam; com par, o livro voa fora das
    folhas e a folha dele só esmaece; sem par na página nova, o nome sai e ele chega com a folha; sem
    par na antiga, ele cai com a folha.
  - **Na pilha:** entre artigo e o anterior ou o próximo (os links `rel="prev"`/`"next"`), a folha do
    artigo inteira (`.artigo-principal`) é o que se move; a lateral fica parada se o livro é o mesmo.
  - **Desenho do artigo:** `desenharTopoDoArtigo` (desenho-vivo.ts) espera `cs:chegou` (a última folha
    pousou) e desenha pela sequência do C1; pelo histórico, ou com o topo fora da tela, ele já está
    pronto. O desenho da lista que voava para o topo do post (D47) saiu.
  - **Categorias:** a página cuida da própria chegada (`chegada={{ propria: true }}`); o desfile vem
    de outra página ou depois do caderno (um pouco mais curto depois do caderno).
  - **Tag:** `chegada={{ passo: 0.06 }}`; a folha da lista chega primeiro e cada artigo dela, sozinho.
  - **Abertura:** decidida no `<head>` (`reload`, ou `navigate` com o `referrer` de fora); a estante
    (home) ou o caderno (as outras páginas), em `Abertura.astro`, agora no layout de todas as páginas.
  - **Fica de fora da troca por folhas:** a troca de livro pela pilha (`data-troca-propria`, a animação
    da D50) e a navegação com um diálogo aberto (busca, livro ampliado): a folha de antes.
- **Revisão de acabamento (agentes, 27/09/2026) e o que mudou por ela:** as peças da abertura e os
  livros da estante escondidos até o script montar a cena (apareciam por um instante); a ficha do
  desfile embaixo no celular (cobria o título); os cartões opacos em 0,12s (três translúcidos se
  sobrepunham); `overflow-x: clip` na raiz (a barra lateral aparecia durante as chegadas); o caderno
  refeito como no protótipo (contracapa, miolo pautado e verso no papel dos livros, igual nos dois
  temas; no escuro ele sumia) e mais curto (de ~3,6s para ~2,6s, sem o tempo parado antes do voo);
  pular também durante o carregamento; a tag desfilando artigo por artigo; a contagem da estante no
  livro que está entrando (e só a partir do primeiro); o aparador só com a revista; o papel sai depois
  de a estante passar pelo nome; o fio da estante na cor da borda da tábua; a sombra do caderno some no
  voo; a trava de 7s do `<head>` cancelada quando a abertura assume; a rolagem do navegador devolvida
  no fim.
- **Segunda revisão de acabamento (trocas gerais, agente com 16 gravações, 27/09/2026) e o que mudou
  por ela:** a saída comprimida (a cascata toda em 0,16s, a queda em 0,48s e o esmaecer a partir de
  0,18s; antes, com 12 folhas, a de cima só começava a cair em 0,54s e cobria a página nova); a folha
  que tinha o livro que voa cai primeiro; o livro que viaja voa por cima das folhas (antes passava por
  baixo da folha do artigo e sumia no meio do voo) e sem esmaecer de uma imagem na outra (ficava meio
  transparente): a imagem antiga fica inteira e a nova aparece com a folha de destino, que esmaece
  desde o começo; em Categorias, o livro da página anterior não voa (encostava no cabeçalho e descia
  com a pilha) e chega no desfile, com os outros; só voam livros à vista (no celular, o da lateral
  subia de baixo da tela); a chegada pela posição na tela (de cima para baixo, da esquerda para a
  direita) e com teto (a última folha sai até 0,55s depois da primeira); no artigo anterior e no
  próximo, o rodapé esmaece (sumia de uma vez); voltando pela memória do navegador (bfcache), um corte
  limpo (a página restaurada aparecia pronta e a antiga voltava por cima); o desenho do topo não sai
  mais pronto por acaso (o `troca.js` marca `data-vai-chegar` já no `<head>`, antes dos módulos) e
  começa quando a folha do artigo está quase pousada (`cs:pousou`), mais curto (~2,1s, como no
  protótipo 08), com o papel antes da cor (a cor aparecia como um bloco inteiro); o nome de transição
  que o livro já tinha volta depois da troca; as rotações na ordem do GSAP, como nos protótipos.
  Testado e descartado: deixar a página nova por cima das folhas que caem (com o fundo transparente, o
  Chrome captura a página nova com fundo branco opaco e esconde tudo). Ficaram como estão: a cor do
  menu muda antes de o traço chegar (0,12s) e a nitidez do texto no fim da chegada.
- **Achado:** os três riscos do A3 vinham do `vector-effect: non-scaling-stroke` num SVG esticado: o
  DrawSVG media o traço numa escala e o navegador pintava noutra, e o tracejado se repetia. Nos
  protótipos, o caminho do fio é refeito em pixels, sem o `vector-effect`.

## D52 · Ajustes de 27/09/2026: acabamento das animações, a leitura, as listas, as tags e o destaque

- **Data:** 27/09/2026 · **Status:** aplicada, **commitada item a item, sem push** (cada item com o
  próprio commit; o controle está em `docs/historico/ajustes-d52/controle.md`, com os diagnósticos de cada
  agente em `docs/historico/ajustes-d52/diagnosticos/`).
- **Pedido do Cesar:** três folhas de ajustes depois da D51 (animações da abertura, das trocas de
  tela e da pilha; bugs de interação no artigo, no livro ampliado e nas listas; a lentidão em rede e
  CPU fracas) e três novidades (tema e modo padrão na primeira visita, o destaque da home dentro da
  grade, o código-fonte dos artigos). Vários agentes trabalharam ao mesmo tempo na mesma árvore
  (`docs/historico/ajustes-d52/regras.md`), cada um com um item ou um grupo pequeno de itens.
- **O que mudou** (na ordem do `controle.md`; hash do commit entre parênteses):
  - **A01** (`bc01200`): o caderno "cs" abria branco no claro e escuro no escuro, porque a página de
    trás da capa era um retângulo em `--paper-hi` (segue o tema). Um desenho só
    (`src/lib/caderno.ts`, `MIOLO_SVG`) passa a desenhar o miolo do caderno em papel dos livros
    (`--marca-letra`) com pauta de caderno na página inteira, com o token novo `--caderno-pauta`
    (`#BEBAB0`, igual nos dois temas), usado na marca do cabeçalho, na marca grande da home e no
    caderno da abertura das outras páginas. No cabeçalho, só a pauta, a 0,5px (as 12 linhas a 1px
    viravam uma escada cinza).
  - **A02** (`5e42b33`): na troca de tela por folhas, os cartões da página nova apareciam por baixo
    dos que ainda estavam caindo, porque o relógio da chegada (0,2s fixo) não esperava a saída, que
    além disso demorava a sair do lugar (a cascata de cima só se movia depois de 0,35s). Agora a
    saída cabe em 0,3s (cascata de 0,06s, queda de 0,38s que acelera desde o começo) e a chegada só
    começa quando a mesa já está limpa; a troca inteira continua em ~1,6s.
  - **A03** (`6912291`): no artigo, ao avançar para o próximo com a página rolada, sobrava um pedaço
    da folha antiga acima da nova por 0,6 a 0,8s (a nova chegava ~30px abaixo do cabeçalho e a antiga
    só esmaecia depois do pouso). Agora a antiga afunda 10px e some entre 0,14s e 0,4s, antes do
    pouso da nova; o anterior (que já saía inteiro para a direita) não mudou.
  - **A04** (`776f8dd`): no escuro, os diagramas antigos abriam **brancos** no visor de imagens,
    porque o filtro de inversão da prosa (D39) não valia lá (o visor tinha o próprio quadro, sempre
    branco). O visor passa a aplicar a mesma inversão, com a sombra dentro do filtro (`drop-shadow`
    depois da inversão); e o visor esmaece ao fechar (0,18s), em vez de sumir de uma vez. O livro
    ampliado (que não muda com o tema) mantém a volta própria.
  - **B01 e B09** (`2463a34`): trocar de livro pela pilha (Categorias) tremia no fim por cinco causas
    somadas: a página inteira caindo na transição padrão do `base.css` (a troca da pilha ficava fora
    do `troca.js`); o giro 3D do livro brigando com a `transition` CSS do palco; as fontes da página
    nova ainda não carregadas no primeiro quadro; a pilha da página antiga 1 a 8px diferente da nova;
    e a imagem do livro esmaecendo de uma para a outra. A animação foi refeita como uma sequência só
    (~2,3s, antes ~3,7s): o livro aberto gira até a lombada e voa num arco até a pilha, deitando-se no
    caminho; o escolhido é puxado e, com o embalo do puxão, segue em arco até o palco, ficando em pé
    e girando ainda na descida; o livro no ar é o livro 3D inteiro, numa camada própria, com sombra
    que cresce com a altura e some no pouso; a página antiga já toma a cor, o texto e a pilha da nova
    antes de abrir, e a nova abre a 70% do giro e o continua (tipo `pilha`, sem deslocar a raiz).
    **Regra geral que sai daqui:** uma transição de página entre duas páginas quase iguais não pode
    deslocar a raiz (qualquer `translate` vira tremida), e quem troca as animações padrão da View
    Transition precisa repor o `mix-blend-mode: plus-lighter` (senão a página clareia).
  - **B02** (`3774b8f`, diagnóstico em `bc72023`): no livro ampliado, "Ler o artigo" e "Abrir o
    próximo livro" não mostravam cursor de link nem sublinhado no hover (só a primeira e a última
    página funcionavam), porque o `:hover` nativo se perde nas folhas empilhadas a décimos de pixel
    em 3D — o mesmo motivo do bug de clique da D50. Um `mousemove` no palco usa o mesmo cálculo do
    clique (`linkNoPonto`) para marcar `.sob-o-mouse` no link certo; "Ver o livro inteiro" ganhou o
    sublinhado mais forte no hover.
  - **B03** (`c039c64`, diagnóstico em `08f5032`): anterior/próximo usava a **ordem de leitura da
    série** para posts de série (`getPostsDaSerie`), não a data — na série Java, o guia vem primeiro
    na leitura mas foi publicado depois dos `java-8/11/17/21/25`, e por isso a navegação podia voltar
    no tempo. Agora `getVizinhos` usa sempre `getResumos()`, a mesma ordem cronológica de "Todos os
    artigos", sem olhar série ou categoria; o rodapé perdeu o rótulo "na série" (não fazia mais
    sentido fora da ordem de leitura).
  - **B04** (`f5d4fac`): "Neste artigo" chegava com **tudo marcado como lido** (o visto em cada
    seção e a última como atual), porque a posição dos títulos era medida com `getBoundingClientRect`
    no meio da animação de chegada das folhas (D51): a folha do texto ainda estava pequena e no alto
    da tela, então todo título parecia estar acima da linha de leitura. Agora a medição usa o layout
    (`offsetTop`, que a animação não desloca); e o visto passou a ser de quem leu: uma seção só o
    ganha depois de ter sido a atual por 0,6s (`TEMPO_DE_LEITURA`) e ter ficado para trás. Substitui
    o "a que ficou para trás ganha um visto" do C2 (D49).
  - **B05** (`8048648`): a cor do livro aparecia repetida quatro vezes na leitura (o fio do
    cabeçalho, o fio e os vistos do trilho, o marca-texto da seção atual e a barra de porcentagem),
    virando ruído. A leitura passa a ser escrita com **uma caneta só, a azul** (`--caneta`): o fio do
    cabeçalho e a caneta na ponta, o fio, os vistos e o ponto do trilho, e a seção atual sublinhada à
    mão (o mesmo traço do menu, um traço por linha do nome); a barra de porcentagem saiu (ficam "NN%
    lido" e os minutos). Sai o token `SUMARIO_MARCA`. De quebra: o nome das seções, que uma regra do
    "Do livro" deixava em 12,5px e `--ink-2` mesmo na atual, volta aos 14px do CSS. Muda a D39 (item
    7, sumário na cor do livro), a D45 (o traço da barra de leitura na cor da categoria) e o C2 da D49
    (marca-texto na cor do livro).
  - **B06** (`2788f33`): o "?" abria a busca em qualquer tela, porque, em muitos teclados (o ABNT2
    inclusive), "/" e "?" são a mesma tecla, e a busca também abria com "/" (D44). A busca passa a
    abrir só com ⌘K/Ctrl+K (o "/" saiu); a tecla do "?" (com ou sem Shift) só abre os atalhos, e só no
    artigo. A ficha dos atalhos foi redesenhada: com o sumário lateral (≥ 1300px), sai de trás da
    folha do sumário e pousa ao lado, sem escurecer a página; sem a lateral, no meio da tela, com a
    página escurecida. Desligar os atalhos desliga o "?" também (WCAG 2.1.4). Muda a D44 (o "/" da
    busca) e o item 7 da D50 (o cartão de atalhos).
  - **B07** (`6353c1d`): o topo de "Todos os artigos" e das tags tinha o texto centrado boiando num
    vão grande (380px em 1280px, ~500px no celular, com a estante descendo sozinha abaixo de 860px).
    Virou uma composição apoiada no pé da folha: título e descrição no alto à esquerda; no pé, na
    mesma linha da tábua, os índices ("por assunto", com as tags mais usadas, e "por ano"); a estante
    de filtro à direita, com "Filtrar por livro"/"Só \<livro\>" e "Limpar filtro" no próprio pé. A
    altura caiu de 380 para 324px em 1280px, de 533 para 278px em 768px e de ~500 para 359px em
    390px.
  - **B08** (`975885c`): uma linha branca aparecia entre a lombada e a capa em todo livro de lado
    (`Livro3D`), por dois defeitos de montagem: a capa 0,6px à frente da lombada (a fresta deixava
    ver o que estava atrás) e o miolo no mesmo plano da lombada (o Chrome cortava a lombada nas
    emendas das páginas). A lombada passa a avançar 1,5px por baixo da capa (`::before`) e o miolo
    recua 1px (`--recuo-miolo`), com o verso da capa cobrindo a calha no livro aberto. Vale para todo
    `Livro3D` (Categorias, Séries, topo do livro, livro do artigo, gaveta e livro ampliado).
  - **B10** (`59eab79`): decisão — **melhorar, não tirar** o voo do livro entre `/categories/` e a
    página do livro. Ele tinha salto de ângulo no primeiro quadro (o livro do cartão virado no hover
    contra o livro parado do topo), ficava vazio (ou pálido) no começo (a folha de destino esmaecendo
    a partir de opacidade 0, e o Chrome não pinta nada dentro de um elemento a opacidade 0) e perdia a
    classe de transição depois de uma troca. Corrigido: quando as duas pontas têm o mesmo livro 3D,
    voa só a imagem nova (viva), que continua o giro de onde estava até o giro de parado (0,75s,
    `cubic-bezier(0.65, 0, 0.35, 1)`, pegar e pousar); nunca duas imagens do livro ao mesmo tempo.
  - **B11** (`e6fd634`): toda tag ganhou um ícone próprio — um objeto de ofício desenhado à mão
    (nunca logotipo), no traço dos ícones das lombadas, em `docs/capas/tags/<slug>.svg`, escrito por
    `scripts/desenho/tags.mjs`; **tag sem ícone quebra o build** (a regra fica em `docs/capas/CAPAS.md`
    e na skill `post`). Entra nos cartões de `/tags/` (com uma estante em miniatura dos livros de onde
    vêm os artigos e o ícone que inclina 6° no hover), como marca d'água no topo da página da tag
    (360px, tinta a 8,5%, girada −8°) e nas pílulas de tag (`PilulaTag.astro`, novo, com o ícone a
    18–21px). Não entra nas listas de artigos (ruído numa lista de 27).
  - **B12** (`e950bfc`): durante a abertura da home, a estante de verdade (a mesma da home viva)
    respondia ao mouse e ao foco — tombava o livro, mostrava a legenda por cima da contagem da
    coleção — e o clique nela pulava a abertura em vez de navegar. Agora ela fica sem
    `pointer-events` até o fim da abertura, e a estante viva (hover, legenda, repouso) só começa no
    `cs:aberto`. Achado no caminho: a estante piscava no fim da abertura (a opacidade dos livros saía
    antes do `data-abertura`); corrigido na ordem da limpeza.
  - **B13** (`3ac42db`, `c6addd8`): no fim da abertura da home, depois que o desenho do destaque
    termina (evento `cs:desenhou`, de `desenho-vivo.ts`), o caderno do cabeçalho e o caderno grande
    abrem um pouco e fecham **juntos, uma vez**, com o mesmo movimento do hover (38°, 0,5s); o que
    estiver sob o mouse continua aberto. Sem desenho no destaque (post sem ilustração, ou sem
    destaque), o aceno vem 0,4s depois do fim da abertura; com o destaque abaixo da dobra numa tela
    baixa, o aceno vem logo depois da estante, sem esperar o leitor rolar.
  - **B14** (`2d4bbb6`): medido com rede lenta e CPU 4×, o tempo entre o clique e o começo da troca
    passava de ~580ms (tag) a ~900ms (artigo), com a tela parada e nenhum sinal de que algo ia
    acontecer; em Categorias, a página podia ficar vazia esperando o GSAP (carregado sob demanda) para
    o desfile. Agora: regras de especulação do navegador (`<script type="speculationrules">` no
    `<head>` do `Base.astro`, JSON, sem biblioteca) fazem `prefetch` do HTML com `eagerness:
    "moderate"` (0,2s de ponteiro parado sobre o link, ou o toque), o que baixou o tempo até ~180ms
    (tag) e ~440ms (artigo) na mesma rede lenta; se a página nova não chega em 0,2s, a caneta azul da
    leitura escreve um traço no fio do cabeçalho, cada vez mais devagar, até ela chegar (nunca um
    spinner); se a espera passou de 1s, se uma troca anterior nesta visita passou de 50ms por quadro
    (guardado em `cs-troca-leve` na sessão) ou com pouca memória (≤ 2GB), a chegada é curta (as folhas
    só aparecem, ~0,4s, sem desfile); em Categorias, o desfile espera o GSAP por no máximo 1,8s, e
    sem ele a troca fica só com as folhas paradas (antes, podia ficar vazia). Sem biblioteca nova.
  - **C01** (`10912bc`, diagnóstico em `f1a592d`): o padrão do site passa a ser **sempre tema claro e
    artigos em cards** (o tema deixa de seguir o sistema, mudando a D24/D39). A escolha do leitor
    (tema e/ou modo de lista) fica guardada no navegador por **3 dias** a partir da última troca de
    qualquer uma das duas (`cs-theme`, `cs-post-view` e a data em `cs-prefs-quando`, uma chave só para
    as duas escolhas); vencida, as três chaves são apagadas pelo script do `<head>` antes da primeira
    pintura, e tudo volta ao padrão. `cs-theme` passou de `sessionStorage` para `localStorage`.
  - **C02** (`ef241f1`): o bloco "Em destaque" (com "Ler artigo") saiu; o post mais recente passa a
    ser o **primeiro item de "Artigos recentes"**, só em `/`. Em cards com duas colunas ou mais, ele
    ocupa o lugar de dois (`grid-column: span 2`, decidido por uma consulta ao contêiner, não à
    largura da tela), com o recorte largo e anotado e o título de 26 a 32px; com uma coluna, o card de
    sempre com o rótulo "Mais recente" (traço de caneta embaixo, sem Caveat) e título maior; em lista,
    o item maior com o desenho em 3:2 à direita. O desenho que se desenha (D41) roda uma vez por
    página, na forma à vista. **Muda a paginação da D27:** toda página passa a ter 12 lugares, e a
    primeira mostra **11 artigos** (o destaque vale dois): `/` 11, `/2/` 12, `/3/` 4 (com os 27 posts
    de hoje); as URLs continuam as mesmas.
  - **C03** (`3dcad52`): campo novo no frontmatter, **`codigo`** (URL `https://`, opcional; o nome
    evita confundir com `## Fontes` e com as fontes tipográficas), preenchido no post do Jackson com o
    repositório `cesarschutz/blog-exemplos` (uma pasta por artigo). No topo do artigo, a pílula
    "Código deste artigo no GitHub" na linha da assinatura; nas listas e nos cards, o sinal `</>`
    "código-fonte" na linha da data (não é link); o sinal curto (só o ícone) na gaveta e no
    anterior/próximo; na busca, "código-fonte" na linha do resultado (metadado novo do Pagefind); no
    livro ampliado, "Ler o artigo → · Código no GitHub ↗". A skill `post` ganhou a regra de quando e
    como preencher o campo.
  - **C04** (`1881e62`, `a32985a`, `8b38e51`, `b054b9a`, `aa8c961`, `43fa97d`): identidade da caneta —
    **a caneta preta desenha; a azul marca**. O preto é a tinta de sempre (`--ink`; no escuro, a tinta
    clara); o azul (`--caneta`) fica só no estado: a seção e a página atuais, a caneta da leitura, as
    marcações da D48. Todo traço novo sai de `src/lib/traco.ts` (semente pelo texto, Catmull-Rom, sem
    filtro), gerado no build, com `currentColor` ou tokens e sem `id`; com movimento reduzido, todo
    traço aparece pronto. Por lote: (1, `1881e62`) o calendário (bloquinho com argolas e o dia
    marcado), o relógio e o `</>` desenhados à mão, na tinta a 78%, traço 1,7, parados — aparecem
    dezenas de vezes por tela, então nada de movimento; de quebra, o sinal do código-fonte ficou preso
    ao tempo de leitura e, abaixo de 340px de linha, passou a mostrar só o ícone (o título do card
    voltou a alinhar). (2, `a32985a`) o traço do hover do menu do cabeçalho em preto (a seção atual
    segue azul); GitHub e LinkedIn com as marcas oficiais preenchidas, em preto (as regras das duas
    proíbem redesenhar o logotipo), com o círculo à mão do hover também preto; o colchete da lista e o
    círculo da paginação passam a preto, por coerência com "todo rascunho do mouse é preto". (3,
    `8b38e51`) o botão de tema sem borda de CSS: um contorno a lápis (tinta a 42%) que a caneta cobre
    no hover, com a lua e o sol desenhados à mão (`luaDeCaneta`, `solDeCaneta`); a animação da troca
    segue a mesma (MorphSVG, DrawSVG, o espalhar em círculo da D42, o botão na primeira pintura), com
    dois acertos: a lua corre no sentido do miolo (sem o rabisco fino de antes) e o círculo do hover
    fica desenhado durante a troca. (4, `b054b9a`) a busca com o contorno à mão a lápis (210 × 40
    fixos, para o traço não esticar) que escurece no hover, e a lupa à caneta (o Flip e o ⌘K seguem);
    os botões redondos do cabeçalho (busca até 1100px, menu no celular) com o mesmo contorno, e os dois
    traços do menu viram um X de caneta; abaixo de 360px, a marca cai para 16px e os botões para 36px
    (a marca pedia 184px e sobravam 155, e a busca ficava espremida a 32px sobre o "blog"). (5,
    `aa8c961`) a assinatura: um traço de largura variável embaixo de "Schutz" (contorno preenchido,
    `assinaturaDeCaneta`), o único traço grande do site — na home com abertura, escrito da esquerda
    para a direita em 0,9s depois do aceno dos cadernos (B13); sem abertura, já pronta; e um traço
    curto opcional embaixo do "blog" no hover da marca do cabeçalho. (6, `43fa97d`) a caneca das
    ilustrações da série Java: no hover do card, da lista ou do topo do artigo, a fumaça de agora sobe
    e some pelo alto e uma nova se escreve de baixo (classe `fumaca`, 1,15s), sem tocar o emblema da
    revista (que é livro, não caneta). Sem caneta: o rodapé (pedido do Cesar, "ali é profissionalismo",
    o traço azul dos links da D49 continua), o corpo do texto e código (caneta azul da D48), os botões
    cheios, tags e chips, e os livros, capas e a marca "cs" (desenho e tipografia próprios, `CAPAS.md`).
  - **Alternativas descartadas (C04):** a busca como "linha de caderno" (deixava o campo menos óbvio);
    GitHub e LinkedIn redesenhados à mão (contraria as regras das duas marcas); a assinatura por
    máscara com DrawSVG (pede `id`; o recorte de um traço quase horizontal já basta); o contorno da
    busca redesenhado no hover (movimento demais num campo muito usado — ficou só o escurecer).
  - **Revisão de acabamento das animações (depois do C04):** um agente gravou as dez cenas da D52
    juntas, quadro a quadro, num Chrome headless próprio (`playwright-core`), a 1440 e 390px, claro e
    escuro, e achou 15 problemas de acabamento (`docs/historico/ajustes-d52/diagnosticos/revisao-animacoes.md`);
    três agentes corrigiram, um commit por correção ("D52 revisão N"), com os relatórios em
    `revisao-trocas.md`, `revisao-pilha-livro.md` e `revisao-sumario-abertura.md`:
    1. pilha no celular: a lombada puxada passava da borda da folha, o documento alargava e a View
       Transition era abortada (corte seco). `.painel-home { overflow-x: clip }` abaixo de 1100px
       (`9cccaf4`, `c30dc21`).
    2. trocas gerais: 85 a 135ms de "mesa vazia" entre a saída da folha antiga e a chegada da nova (a
       opacidade da chegada começava junto com o voo, linear em 280ms). O voo da chegada passa a
       começar em 0,04s, ainda transparente, e só aparece a partir de 0,24s (opacidade em 170ms,
       ease-out); a saída esmaece 80ms depois de começar a cair (`7e0806b`).
    3. artigo anterior com a página no fim: o rodapé do site ficava nítido por cima do título do
       artigo novo (esmaecia em 200ms, ease-in). Passa a sair em 90ms, ease-out (`aaa9579`).
    4. sumário: a seção atual em peso 600 quebrava a linha e a lista saltava ~11px, deixando um risco
       sobre a seção errada. A seção atual fica no peso 400, com contorno fino da própria cor
       (`-webkit-text-stroke: 0,35px`); as subseções da atual se desdobram em 0,34s (`49616bb`).
    5. o aceno dos cadernos (B13) vinha antes do fim do desenho do destaque, porque pegava a miniatura
       escondida da lista (modo cards). Passa a buscar o desenho que está de fato visível (`46a06c7`).
    6. livro ampliado: piscava ao abrir (a cópia surgia do transparente enquanto a origem já tinha
       sumido) e sobrava um quadro vazio ao fechar. `.visor-livro[open] { animation: none }`, e a
       origem volta antes do `dialogo.close()` (`7f1e450`).
    7. CPU lenta: a página congelava ~1,1s sem sinal (a caneta do carregando só cobria a espera antes
       do `pageswap`) e vinha a coreografia inteira em vez da chegada curta. Agora a sessão guarda
       quanto a troca anterior levou entre a resposta e a primeira pintura; passado 0,3s, a seguinte já
       mostra a caneta no clique e usa a chegada curta (limite descido de 1s para 0,7s) (`83b6f0f`).
    8. artigo anterior/próximo: o painel do desenho ficava vazio por 0,5 a 0,65s (o desenho do topo
       esperava o fim inteiro da troca). `cs:pousou` passa a disparar a 420ms (próximo) ou 300ms
       (anterior) do `vt.ready` (`abea3f9`).
    9. artigo próximo: a lateral velha e a nova apareciam juntas, a ~50%, no mesmo lugar (e o livro da
       lateral nova, com nome de transição próprio, surgia inteiro de repente). A lateral nova passa a
       entrar em 220ms, com a antiga já quase fora (`519cfaf`).
    10. pilha na tela grande: o título e a marca d'água do topo esmaeciam junto com os artigos no
        clique, e o painel ficava um retângulo vazio por ~1,1s. Agora só os artigos esmaecem no
        clique; o título e a marca d'água ficam até o livro escolhido sair da pilha, trocando junto
        com a cor do palco; o puxão começa 0,15s antes do pouso do guardado (`d1217d2`, `20be2a5`,
        `67b6a11`).
    11. visor de imagem: ao fechar, o diagrama do visor e o da página ficavam nítidos juntos por
        ~0,1s. A imagem passa a sair em 0,12s, ease-out, encolhendo a 0,94, com o véu começando 0,05s
        depois (`2de479a`).
    12. abertura no escuro: o fio da caneta quase não aparecia (contraste 1,39:1, na cor da borda da
        tábua). O fio passa a ser escrito em `--ink-2`, passando para `--tabua` quando engrossa
        (`4545e75`).
    13. carregando: a caneta sumia de um quadro para o outro antes de as folhas caírem (ficava na
        raiz antiga, escondida pela troca por folhas). Ganhou `view-transition-name` própria e
        esmaece em 0,2s (`aa21d4e`).
    14. abertura com o caderno: o voo em linha reta cruzava "Cesar Schutz". Virou um arco (curva de
        Bézier), subindo por baixo da marca; o papel só sai depois que o caderno passou pelo título
        (`5d6dd1f`).
    15. pilha no celular e no tablet, já com a troca animando: a lombada deitada, esticada até o livro
        do topo, cruzava a capa como uma faixa por ~0,15s (o nome de transição do livro guardado
        descia atravessando a pilha). Sem o voo, a lombada guardada perde o nome de transição: sai com
        a pilha, e o livro chega com a folha, sem o morph (`ace7907`).

    De quebra, no caminho do problema 10: voltar pelo histórico (bfcache) depois de uma troca pela
    pilha trazia a pilha **vazia**, só a prateleira — o `clearProps: "all"` do GSAP, no `pageshow`,
    apagava o `style` inline inteiro das lombadas (cores e medidas), não só o que a animação tinha
    mexido (`67b6a11`).

    **Ficou de fora:** os dois quadros de cruzamento semitransparente na troca geral, quando a antiga
    já está quase sumindo e a nova ainda pequena e translúcida (aceito como parte do efeito, não uma
    piscada); o arco "por cima do nome" no voo do caderno (problema 14), que não cabe no espaço acima
    de "Cesar Schutz" (12px até a borda da tela) — por isso o voo passa por baixo; a faixa clara da
    barra de rolagem fixa atrás dos visores (livro ampliado e imagem), em sistemas com
    `scrollbar-gutter` estável (Windows, ou Mac com mouse; não aparece no Mac com trackpad), já
    apontada no relatório do A04; e a caneta já no clique (problema 7), que só entra a partir da
    segunda troca lenta da visita — a primeira ainda não tem o tempo de montagem guardado na sessão,
    então continua sem o sinal.
  - **C05 (a identidade de papelaria) continua além do controle:** B14 e C04 entraram nesta rodada
    (C04 com a pesquisa e as sugestões de `docs/historico/ajustes-d52/pesquisa.md` como ponto de partida); C05
    ficou na árvore de trabalho para o Cesar avaliar (`docs/historico/ajustes-d52/controle.md`) e foi
    **commitado por ele em 28/09/2026** (`da57524`): o post-it "Neste artigo", a ficha do livro com o
    clipe, a cola dos atalhos e os vistos à mão, com os quatro títulos curtos em Caveat 600 (subconjunto
    `src/assets/caveat-titulos.woff`, gerado por `node scripts/caveat-titulos.mjs` a partir da lista de
    `src/data/mao.ts`). O carimbo "fontes conferidas em …", as abas de fichário e a busca como ficheiro
    ficaram de fora.
- **Pesquisa (agente Pesquisa, `docs/historico/ajustes-d52/pesquisa.md`):** levantamento do showcase do GSAP
  (tudo gratuito desde a 3.13), da ordem de pintura das View Transitions, de princípios de movimento
  com número (Material "fade through", Emil Kowalski, Josh Comeau, os limites de resposta da
  Nielsen), de Speculation Rules, de traço à mão (Rough Notation, perfect-freehand) e das regras de
  marca do GitHub e do LinkedIn, com recomendações por item (B06, B09, B14) e duas propostas em HTML
  (`docs/historico/ajustes-d52/sugestoes/c04-caneta.html` e `c05-papelaria.html`) para o C04 e o C05. Sem
  alteração de código do site.
- **Movimento reduzido:** cada item novo segue a regra do site (estado final, sem prender a tela); em
  particular, a ficha dos atalhos (B06) e o aceno dos cadernos (B13) não fazem nada com ele ligado, e
  a caneta do carregando (B14) vira um fio mais claro, sem a caneta.
- **Conferido:** cada item, quadro a quadro (Chrome headless próprio ou trace com screenshots no MCP
  `chrome-devtools`, sempre numa aba isolada) em 320, 390, 768, 1280 e 1600px, claro e escuro, e
  `fnm exec --using=24 npm run check` sem erros antes do commit do item.

## D53 · Faxina: docs só com documentos, dados dos livros em src/livros
- **Data:** 28/09/2026 · **Status:** aprovada (pedido do Cesar: "arrume o projeto removendo lixo")
- **Decisão:** o que o build lê de `docs/capas/` (`livros.json`, `cores.js`, `grao.svg`, `desenhos/`,
  `icones/`, `serie/` e `tags/`) passa para `src/livros/`; em `docs/capas/` ficam só o `CAPAS.md` e as
  imagens de `referencia/`. Controles de rodadas fechadas (D46/D47, `ajustes-d52/`), o prompt da Fase
  0 e os protótipos superados (home e artigo da Fase 0, movimento da D40/D41, caderno marcado, ideias
  da D49) vão para `docs/historico/`. Este arquivo ganha um índice no topo. Junto: lixo local
  apagado (`.astro/depuracao/` com 3,4 GB, `bench/`, `.render/`), três exports sem uso removidos,
  `docs/estado.md` reescrito como painel e os textos que ainda descreviam a lousa de passos (D46)
  corrigidos; diagrama animado de post nunca é comandado pela rolagem (DESIGN.md, skill `post`).
- **Motivo:** apagar um "documento" de `docs/` quebrava o build; o histórico misturado com o que vale
  hoje confundia as sessões seguintes.
- **Mudado:** `src/livros/`, `src/lib/livros-svg.ts`, `src/lib/tags-svg.ts`, `src/lib/estante.ts`,
  `src/data/taxonomia.ts`, `src/data/series.ts`, `src/pages/[amostra].astro`,
  `src/pages/[amostra]/tags.astro`, `scripts/contraste.mjs`, `scripts/desenho/tags.mjs`, `CLAUDE.md`,
  `CLAUDE-CODE.md` (novo: a configuração do Claude Code no projeto), `docs/capas/CAPAS.md`, skills e
  regras.
- **Depois, no mesmo dia, as sugestões do `CLAUDE-CODE.md`** (pedido do Cesar: "aplicar as melhorias
  que você sugeriu"):
  - `.claude/rules/interface.md` (nova, por caminho): a lista do que tem JS, os livros, as armadilhas
    de CSS, View Transition e GSAP e como conferir saíram do `CLAUDE.md` (de ~320 para ~280 linhas);
    no `CLAUDE.md`, a regra "onde fica cada coisa" (o projeto vence a memória e o Segundo Cérebro).
  - Impeccable: o detector ignora `scripts/**`, `docs/**` e `.claude/**` e fica quieto quando está
    limpo (`hook.quiet`); os `.md` ele já pulava.
  - Saíram as skills `gsap-react`, `gsap-frameworks` e `gsap-scrolltrigger` (o site é Astro sem
    framework e não usa mais ScrollTrigger).
  - `npm run conferir -- <slug>` (`scripts/conferir.mjs`): o post em 320 a 1600px nos dois temas.
  - `/amostra/lousas/`: os quadros-chave de cada lousa, parados, com o estado do post.
  - `DESIGN.md`, Movimento: ficam as regras e uma tabela das peças; o detalhe foi, sem cortes, para
    `docs/movimento.md`.
  - Skill `post`: a tabela "Qual recurso para qual conteúdo".
  - Permissões locais trocadas pelos comandos do projeto; `.impeccable/review/` apagado; `export` tirado
    de oito funções usadas só no próprio arquivo.
  - Descartada: gerar a lista dos passos da `LousaTempo` a partir dos estados (são textos diferentes).

## D54 · Caça aos bugs de 29/09/2026
- **Data:** 29/09/2026 · **Status:** aplicada e publicada (pedido do Cesar: "procure bugs nesse site
  [...] arrume se achar"; publicar: "Pública"). Um commit por grupo do controle.
- **Decisão:** corrigir os 40 bugs confirmados pela varredura (cinco agentes: artigos, acessibilidade
  e SEO, listas, home e navegação), cada um reproduzido antes e conferido depois no navegador. A
  lista, os arquivos e o que ficou para o Cesar decidir estão em `docs/ajustes-d54/controle.md`.
- **O que muda no jeito de fazer:**
  - Âncoras e foco sob o cabeçalho fixo: sai o `scroll-padding-top` do `html` (ele fazia o navegador
    rolar a página ~450px quando o foco ia para o próprio cabeçalho); entra `--folga-ancora` (base.css)
    como `scroll-margin-top` nos alvos dentro do `main`, e os títulos da prosa somam 24px (pouso em
    100px, como antes).
  - Os tokens do tema escuro valem só na tela (`@media screen`): impresso, o site sai sempre claro.
    Na impressão, as lousas desenham o estado final, sem controles, e os `<details>` abrem.
  - A abertura (D51): clique, toque, tecla e agora a roda do mouse pulam; o clique do toque que pula é
    engolido; a tecla que pula não rola; ela fica antes do marcador `#fim-do-conteudo` (primeira
    pintura já com o papel); a trava de 7s do `<head>` também avisa `cs:aberto`.
  - Voltando pelo histórico (bfcache), o script do `<head>` relê tema e modo (`preferencias:relidas`).
  - Sem JS, até 860px, as seções do menu ficam numa linha embaixo da marca; o botão "Buscar" some (como
    o do tema).
  - Foco nos painéis: a folha do sumário recebe o foco dois quadros depois de abrir (antes, os itens
    ainda herdavam o `visibility: hidden` e o Chrome recusava); o Tab que sai dela devolve o foco ao
    botão da seção; seta desabilitada no visor passa o foco para a outra.
- **Mudado:** `src/components/` (Abertura, Atalhos, Busca, Cabecalho, Gaveta, ListaFiltrada,
  LivroAmpliado, LousaLoop, LousaTempo, MetaItem, RodapeArtigo, SeletorModo, TopoLivro),
  `src/layouts/Base.astro`, `src/pages/404.astro`, `src/pages/rss.xml.ts`, `src/pages/tags/[tag].astro`,
  `src/plugins/rehype-tabela.mjs`, `src/scripts/` (artigo, estante-viva, tema), `src/styles/` (base,
  estante, lousa, paginas, prosa, tokens) e `.impeccable/config.json` (o `<img>` vazio do molde do visor
  é falso positivo do detector).
- **Depois, no mesmo dia (achado pelo Cesar):** ao recarregar um artigo, o desenho do topo aparecia
  pronto e sumia antes de se desenhar. A abertura acaba (e tira o `data-abertura`) ~0,1 a 0,6s antes de
  a folha pousar; o desenho agora espera pelo `data-desenhar-espera`, posto pelo `desenho-vivo.ts`
  (item 41 do controle). Também achados pelo Cesar e por mim: o vizinho que tomba na estante perdia o
  desenho no celular (lombadas agora sempre em transformação 3D, `EM_3D`, item 42) e o livro inclinado
  terminava a abertura afundado na tábua (item 43).
- **Segunda varredura (29/09/2026, itens 44 a 67, publicada com o OK do Cesar; as condições de borda,
  itens 62 a 67, estão só no controle):**
  sem o realce de toque do navegador (no `html`); pular a abertura antes de a cena montar termina na
  hora (e avisa `cs:chegou`); a estante espera as fontes no máximo 2,2s e a trava de 7s só sai com a
  cena montada; girar a tela pula a abertura; a abertura vai ao `#seção` antes de as folhas chegarem;
  na troca, a imagem antiga do cabeçalho fica por baixo até o fim; com diálogo aberto, o cabeçalho sai
  com a página; a folha do menu some antes da troca; as animações de chegada terminam antes do bfcache;
  "mesmo livro" no anterior/próximo só com a lateral no mesmo lugar; o atalho ⌘K/Ctrl K é decidido no
  `<head>`; o contador tem o vazio antes do 0; o seletor Lista/Cards reserva o lugar desde a primeira
  pintura; nota da caneta e frase em destaque medem de novo no fim da chegada; a `LousaTempo` com
  movimento reduzido começa no estado final.
- **Alternativas descartadas:** cabeçalho `position: fixed` em vez de `sticky` (mexia no layout de
  todas as páginas); fechar a busca e o livro ampliado ao voltar pelo histórico (a busca que reabre
  com os resultados parece intencional; só o foco foi corrigido).

## D56 · Caneta com 34 tipos e mais marcações por post
- **Data:** 29/09/2026 · **Status:** aprovada pelo Cesar ("é isso mesmo que você falou"). O número D55
  ficou para o redesenho, em outra sessão.
- **Contexto:** numa amostra (branch `amostra-caneta`), um post com os 20 tipos aplicados de uma vez
  mostrou ao Cesar o que ele quer: posts bem marcados. O limite de 12 marcações "limita muito".
- **Decisão:**
  - Limites: sem teto de total e sem mínimo fixo; marca-texto até 3 por post (antes 2); o mesmo tipo
    até 5 (antes 3), fora os de lista. Continua proibido duas marcações no mesmo parágrafo, o que deixa
    o post denso sem ficar poluído.
  - Tipos: de 20 foram para 34. Entram 15 (marca-texto baixo, aspas à mão, parênteses à mão, chave por
    baixo, seta de tendência, ressalva com asterisco, moldura, visto na margem, validade, novo na
    atualização, post-it, carimbo, opção escolhida, números no código e linha riscada no código),
    escolhidos entre 20 propostos. Sai o sinal ≠, que abria um vão entre as palavras.
  - A numeração do guia passa a ir de 1 a 34 (os antigos na mesma ordem, sem o ≠; depois os novos).
- **Alternativas descartadas:** sublinhado pontilhado, círculo tracejado, troca ⇄, equivalência = e
  estrela na margem (vistos na amostra e recusados); manter o teto de 12.
- **Achado junto:** no celular, e quando a nota vai para depois da palavra, o riscado com correção
  quebrava o trecho num espaço e o traço se partia; o trecho riscado e a palavra da nota agora não
  quebram (`caneta.css`).
- **Mudado:** `src/plugins/marcacoes.mjs`, `src/styles/caneta.css`, `src/lib/codigo.ts`,
  `src/amostra/caneta.md` (o catálogo com os 34), `docs/marcacoes.md`, `DESIGN.md`, `docs/briefing.md`,
  as skills `caneta` e `post`, `CLAUDE.md` e `CLAUDE-CODE.md`.

## D57 · Livros realistas
- **Data:** 30/09/2026 · **Status:** aprovada pelo Cesar e levada à `main` em 30/09/2026 (feita na
  branch `livros-realistas`, pasta irmã `../blog-livros-realistas`). D55 (redesenho) e D56 (caneta)
  são de outras sessões.
- **Pedido do Cesar:** os livros o mais realistas possível, com as mesmas cores, desenhos e textos. Dez
  pranchas de estudo em `docs/prototipos/livros-realistas/` (galeria, maquetes e `DIRECAO.md`); ele
  escolheu as que valem e onde cada uma entra.
- **Decidido:**
  - **Capa dura realista (prancha 01) em todo livro em pé:** grade de Categorias, topo da página do livro,
    livro ampliado, "Do livro" e a **gaveta da home**, esta sem sombra no chão. Construção de capa dura
    (espessura das capas, seixa, lombada arredondada com luz, vinco da dobradiça, cabeceado, folhas,
    grão).
  - **Os movimentos continuam** (girar no mouse, capa que abre, livro que voa da estante, arrastar no
    ampliado): o livro 3D é refeito com a construção da 01, e não trocado por uma imagem parada.
  - **Estante (07) e pilha (08) com volume:** lombadas arredondadas com luz, cabeceado, alto do miolo,
    prateleira com espessura e sombras de contato.
  - **Livro deitado com fita e etiquetas (04) na ficha "Do livro" do artigo**, girado para o outro
    lado: cada etiqueta é um artigo do livro, a amarela é o artigo aberto.
  - **Livro aberto com as páginas em branco (06), pequeno:** no livro ainda sem artigos e na busca sem
    resultado.
  - **A série vira livro, fora da coleção** (muda a D32): a capa de hoje (título, o 25, a lista das
    versões, a tarja, a xícara) numa capa dura, com lombada própria em papel e a faixa laranja.
  - **Saem:** a luz de janela (10), a brochura (03), o tecido e papel (02) e a capa entreaberta (05).
  - **Muda a regra do CAPAS.md (D30, "nunca como imagem pronta"):** o livro deitado da ficha e o livro
    aberto podem ser imagens (WebP) geradas das pranchas, com o texto de verdade nos rótulos e nas
    páginas.
- **Motivo:** o livro 3D de hoje é uma caixa com gradiente; a construção de capa dura dá a cara de
  objeto sem mudar o design. As peças paradas (ficha, vazios) ficam mais leves e fiéis como imagem.
- **Como ficaram as peças paradas (ficha e vazios):** `node scripts/livros/fotos.mjs` (com o dev no ar)
  mede as capas, monta as cenas das pranchas 04 e 06 (copiadas para `scripts/livros/`) e grava WebP 2x
  em `public/livros/fotos/`. O livro deitado gira para o outro lado (câmera refeita, `GIRO` 19°: a
  lombada vira para o leitor). As etiquetas não entram na imagem: o gerador grava os oito lugares delas
  (contorno, luz, sombra) em `src/livros/fotos.json`, e o site desenha por cima, em SVG, uma por artigo
  na ordem de leitura (`FotoDoLivro`); a do artigo aberto é a amarela (`--etiqueta`, o amarelo do post-it,
  igual nos dois temas) e sai um pouco mais puxada. Artigo novo ganha a etiqueta sozinho; só o número da
  lombada, que está na foto, pede rodar o script de novo (o build avisa). Na ficha sai o livro que
  girava, a lupa do livro ampliado e o voo até a página do livro; o texto "este é o Nº" vai para o leitor
  de tela. O livro aberto vazio usa a cor do livro; na busca, o da marca (Volume 01).

- **Como ficou o livro 3D, a estante e a pilha:** o livro 3D (`Livro3D.astro`, `livro.css`) virou uma
  capa dura montada em CSS (placas de papelão de 8, seixa de 9, lombada em facetas com a arte no meio,
  o alto com o miolo e o cabeceado em SVG, o vinco da dobradiça, a luz em camadas e a sombra no chão),
  vista de um pouco acima (`.livro-3d-vista`, 15° em X, fora do giro). Os movimentos são os mesmos: o
  GSAP e as trocas de página mexem só no `rotateY` do `.livro-3d`; o voo da gaveta passou a medir a
  lombada na tela (a lombada saliente e a vista de cima mudam onde ela aparece), e o livro ampliado põe
  as folhas abaixo do verso da capa (uma espessura de papelão) e com a seixa. A série usa o mesmo livro,
  com a capa de revista e a lombada de papel com a faixa. Na estante, a prateleira virou um espaço 3D só,
  com o olho acima dos livros: cada lombada mostra a cabeça (bordas das capas, miolo, cabeceado) e o
  começo dos lados, escuros, nos vãos; a tábua e a base do aparador ganharam espessura e luz, e cada livro
  a sombra de contato. O filtro apaga os outros livros com um véu do papel (`--apagado`), porque a
  opacidade achatava o 3D. Na pilha, a luz da curva vem de cima, cada livro mostra a capa de cima e faz
  sombra no de baixo, e a prateleira tem espessura. Medido: HTML de 2 a 3 kB a mais (gzip) nas páginas
  com livros; quadros de 16,7 ms (mediana e p95) no hover da grade, no voo da gaveta e na troca pela
  pilha, com a CPU 4× mais lenta.
- **Revisão antes do push (30/09/2026):** conferência (fotos de 320 a 1600px, dois temas, movimento
  reduzido, `conferir` em quatro posts) e revisão de código. Corrigido: o livro ampliado aberto (a vista
  se endireita ao abrir, as duas capas passam o miolo, sem a ponta da lombada no vinco), o livro do topo
  da página do livro centrado, a pilha que pousava 18px fora, o livro puxado da estante que flutuava, a
  prateleira sozinha em "Séries", o esmaecer da lista que rola na gaveta, a classe `.capa-topo`
  duplicada (virou `.capa-borda`) e código morto. Ficam como estão: cabeceado e seixa quase invisíveis
  no ampliado (1,5px com a vista a 15°) e a curva da cabeça na estante.
