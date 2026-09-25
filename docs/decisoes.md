# Decisões

Registro curto das decisões do projeto. Cada entrada traz data, status, decisão, motivo e
alternativas. Os status possíveis são **proposta** (aguarda o Cesar), **aprovada** e **substituída
por Dn**. As decisões de produto e design já fechadas estão em `docs/briefing.md` e não se repetem aqui.

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
