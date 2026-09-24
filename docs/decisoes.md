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

## D25 · Favicon novo
- **Data:** 23/09/2026 · **Status:** proposta (aplicada na Fase 1, pode ser trocada)
- **Decisão:** três lombadas na prateleira, com a última inclinada, como a estante. Há o SVG, o PNG de
  180px para o iPhone e o ICO de 32px, gerados com `rsvg-convert`. As cores ficam fixas porque o favicon
  é uma imagem externa e não enxerga as variáveis do CSS.
- **Motivo:** o favicon atual é da identidade antiga, com degradê azul e "CS" em Inter.
