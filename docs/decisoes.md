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
  - `/about/` → `/sobre/`. O meta refresh não leva o `#site`, então a página de redirecionamento
    troca `#site` por `#como-os-artigos-sao-produzidos` com um script pequeno;
  - `/projects/` → `/`;
  - `/exercicios` → `/`;
  - `/2/` e `/3/` (paginação antiga da home) → `/archive/`, aprovado pelo Cesar em 23/09/2026.
    **Revisto em 24/09/2026 (D27):** a home voltou a ser paginada, e `/2/` e `/3/` voltaram a ser
    páginas, com o mesmo conteúdo de antes. Os dois redirecionamentos saíram.

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
- **Data:** 23/09/2026 · **Status:** aplicada (Fase 1)
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
    e o menu ficou como estava.
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
  gaveta.
- **Título:** o nome usa `clamp(24px, 10cqi, 56px)` na largura da coluna, para "Observabilidade"
  caber numa linha até em 320px.
- **Conferido:** `astro check` 0/0, build, links (0 quebrados), contraste (0 falhas), sem rolagem
  lateral, sem nome cortado na pilha e título numa linha nas seis categorias em 320, 390, 800, 1100
  e 1440px.

