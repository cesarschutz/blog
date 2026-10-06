# Blog de Cesar Schutz

Blog técnico pessoal de **Cesar Schutz**, arquiteto de soluções, em **pt-BR**. Publicado em
<https://blog.cesarschutz.com.br> pelo GitHub Pages do repositório `cesarschutz/blog` (D34): **todo
push na `main` publica o site** (workflow `deploy.yml`). É **só um blog**: artigos, categorias,
tags, séries, busca e RSS. O blog antigo continua em <https://cesarschutz.com.br>; mexer nele ou no
domínio principal só com o OK do Cesar (`docs/virada.md`).

As decisões de produto e design estão em `docs/briefing.md`, que é a fonte da verdade. Não reabra o
que está marcado como **decidido** sem perguntar. O que for decidido aqui vai para `docs/decisoes.md`.

**Ao começar uma sessão, leia `docs/estado.md`. Ao terminar um bloco de trabalho, atualize-o.**

**Toda decisão do Cesar vira registro na mesma hora**, sem ele precisar pedir, para a próxima sessão
continuar de onde parou: design ou produto no `docs/briefing.md` (e no `docs/estilo-desenho.md`, se for
de desenho); a decisão, o motivo e o que mudou no `docs/decisoes.md`; o andamento no `docs/estado.md`;
e, se mudar o jeito de trabalhar, aqui, na skill ou na regra (`.claude/`) certa.

**Onde fica cada coisa:** regra e decisão do projeto moram só nos documentos do projeto (este arquivo,
`.claude/`, `DESIGN.md` e `docs/`). A memória automática do Claude e o Segundo Cérebro guardam o jeito
de trabalhar e apontam para cá, sem copiar regra: se divergirem, vale o projeto.

Lista grande de ajustes: controle em `docs/ajustes-dNN/` (um commit por item, quando o Cesar pedir
commits), agentes em paralelo sem parar para perguntar e as decisões pendentes no fim. Ao fechar a
rodada, o controle vai para `docs/historico/` e o lixo de depuração (`.astro/depuracao/`, previews em
outras portas) sai.

## Posts, visual e ferramentas (D35)

- O **`DESIGN.md`** (raiz) é a fonte de verdade do visual. Ele vence qualquer ferramenta, inclusive o
  Impeccable (sem "go all out", redesign ou troca do `DESIGN.md`).
- Todo trabalho em post (criar, escrever, adaptar, importar, migrar, revisar) segue a skill **`post`**;
  o essencial dos arquivos de post (tamanho, frontmatter, fontes) está em `.claude/rules/posts.md`, que
  carrega ao abrir um post.
- **Formato do post (D63):** todo post, novo ou ajustado, começa por uma conversa com o Cesar:
  detalhado (com o TL;DR recolhível) ou resumo (com o infográfico), a estrutura do que entra e as
  fontes (os links que ele estudou ou, sem eles, fontes confiáveis). Os links ficam ao longo do texto
  e também em `## Fontes`.
- **Escrita do post (D71):** o título tem de fazer sentido sozinho ("Assunto — complemento", com o
  assunto dizendo do que o post trata; nunca pergunta, gancho ou o nome do exemplo); a abertura diz o
  assunto antes do exemplo; nunca a primeira pessoa ("criei", "testei", "fiz"); a descrição com o
  essencial em 160 caracteres. Assunto que não cabe vira **post em partes** (parte 1 e parte 2, dois
  posts ligados). Regras na skill `post` (seções "Escrita" e "Post em partes"), conferidas por
  `npm run escrita -- <slug>`; a pesquisa está em `docs/escrita/`.
- **Caneta do caderno (D48):** a última etapa de todo post é a passada de caneta (skill **`caneta`**):
  ler o guia vivo `docs/marcacoes.md` inteiro, propor as marcações (trecho, tipo, motivo), aplicar só
  com o OK do Cesar e testar em 320, 390, 768, 1280 e 1600px nos dois temas. Ajuste que o Cesar pedir
  nas marcações vai na hora para "Ajustes do Cesar" no guia, com a data.
- **Figura em passos (D67, em prova):** a sequência, a comparação no tempo e o sistema funcionando
  viram **figura em passos** (`FiguraPassos`, skill `figura`), com `estilo="marca-texto"` e
  `fim="segmentos"`, como em todos os posts com passos desde 02/10/2026 (o de DNS é o modelo mais novo).
  A `Lousa`, a `Animacao` e os `controles=` da D65 vivem só nas páginas de prova (`/animacoes-test/`,
  `/animacoes-test-2/`, `/animacoes-test-3/` e `/prototipos/controles/`, fora da busca) até o Cesar
  fechar a D67: post novo não usa. A frase em destaque (`FraseDestaque`, skill `lousa`) continua.
- **Apresentação de um post (D74):** quando o Cesar pedir a apresentação (PPT, slides, deck) de um post,
  ela sai em `.pptx` no estilo do blog, com os desenhos, os prints e as marcações da caneta do próprio
  post e as notas do apresentador: skill **`apresentacao`**, modo Criar, com as ferramentas de
  `scripts/slides/`.
- Posts para adaptar ficam em **`entrada/`** (fora do git).

## Redesenho (D55, publicado na D61)

O visual do site é a versão final do redesenho: **papel, tinta, latão e luz** (D61, 02/10/2026). O
resumo está na seção "Papel e luz (D61)" do `DESIGN.md`, que vence as seções antigas dele (ainda das
"Folhas claras", D26) até a reescrita; o detalhe de cada peça, com os pedidos do Cesar numerados, está
em `docs/redesenho/rodada-4/`. **Mudança de visual agora é no blog**, pelas regras de sempre. A história
das quatro rodadas está em `docs/redesenho/`; os protótipos ficam só nesta máquina, fora do git
(`redesenho/`, portas no `docs/mapa.md`), e uma rodada nova de protótipos segue a skill `redesenho`
(agentes em `.claude/agents/redesenho-*`).

## Regras que valem sempre

- Tudo em pt-BR, com acentuação correta. Identificadores de código podem ficar em inglês.
- **Nunca** commitar, dar push, criar repositório ou publicar sem pedido explícito do Cesar.
- O clone do blog antigo (`../blog-atual`, D19), se houver um (hoje não há nesta máquina), é **somente
  leitura**: pode ler à vontade, mas nunca editar, instalar, buildar nem rodar git que escreva lá (um
  `git status` comum já regrava o `.git/index`: use `git --no-optional-locks`). Para rodar algo dele,
  copie para o scratchpad. O bloqueio do `.claude/settings.json` ainda aponta para o caminho antigo e
  nunca cobriu comandos no terminal: não conte com ele. Ao delegar para subagentes, repasse essa regra.
- Biblioteca, skill, MCP ou pacote de terceiros: proponha e espere o OK. Antes de instalar, leia o
  código e reporte ao Cesar o que for suspeito (rede, variáveis de ambiente, credenciais, comandos
  destrutivos). Registre a decisão em `docs/decisoes.md` (D35).
- Logo de marca alheia (ferramenta, produto, empresa) só como a regra de marca do dono permite (D64): a
  marca precisa estar conferida na política oficial e registrada em `src/marcas/regras.json` antes do
  primeiro uso; registrada e permitida, usa sempre. Sem registro, o build quebra.
- Cores só por tokens CSS (`var(--ink)`, `var(--cat)`…, de `src/styles/tokens.ts`). Nada de hex solto
  em componente ou SVG.
- Toda animação respeita `prefers-reduced-motion`: com ele ligado, tudo aparece no estado final,
  sem prender a tela.
- JavaScript só onde há interação; a lista do que tem JS, os ícones, os livros e as armadilhas de
  CSS, View Transition e GSAP estão em `.claude/rules/interface.md` (carrega ao abrir componentes,
  estilos, scripts, páginas e `src/lib/`). Artigo sem componente interativo funciona sem JS.
- Fontes servidas pelo próprio site (`@fontsource`). Nunca Google Fonts nem CDN em produção.
- Para verificar o blog no navegador (visual, console, performance), use sempre o MCP
  `chrome-devtools`, nunca o `claude-in-chrome`.
- Não pode parecer feito por IA: nada de fonte genérica, gradiente decorativo, sombra genérica em
  tudo, animação de entrada em cada seção, rótulo em caixa alta ou emoji.
- Os protótipos em `docs/referencias/` e `docs/prototipos/` (os novos vão para esta, D40) mostram
  aparência e comportamento, mas não são código para copiar. Onde divergirem do briefing, vale o briefing.
- Caminhos entre aspas em todo comando e script (em outro computador, a pasta do projeto pode ter
  espaço no nome).
- Frase de autor (saiu na D39) só volta com a fonte primária aberta e conferida.
- Se o Cesar corrigir a mesma coisa duas vezes, isso vira regra no lugar certo (skill, `.claude/rules/` ou aqui).
- **Pedido num post termina em pergunta (D68):** depois de fazer o que o Cesar pediu ou reclamou num
  post, pergunte se aquilo vira regra para os próximos posts, dizendo onde ela ficaria. Com o sim,
  registre na hora; com o não, vale só para aquele post (skill `post`, "Regra de aprendizado").

## Livros, séries e tags

Cada categoria é um livro de uma coleção numerada ("edição de estudo"); cada série é uma revista
técnica (cada post, uma edição). A regra é `docs/capas/CAPAS.md` (D30, D32); os dados, as cores e os
desenhos ficam em `src/livros/` (D53). Categoria ou série nova = pela seção "Livros novos" do
`CAPAS.md`, com o OK do Cesar; os volumes seguem a ordem alfabética (D78). **Ao planejar todo post,
confira se a coleção ainda serve** (D78; o como está na skill `post`, passo 2): o normal é não mudar,
mas, se o post não couber bem em nenhum livro ou se valer criar, dividir ou renomear um livro, avise o
Cesar e sugira. Os livros **não mudam com o tema** (D39). **Toda tag tem um ícone** (D52): tag nova num
post = ícone novo, pela seção "Tags" do `CAPAS.md`; sem ele, o build quebra. Componentes e detalhes em
`.claude/rules/interface.md`. Para conferir, `/amostra/livros/` e `/amostra/tags/` (só no dev).

## URLs que não podem quebrar

- `/posts/<slug>/`, com as mesmas âncoras de título de hoje (ids no estilo github-slugger, com acento)
- `/archive/`, `/categories/`, `/tags/`, `/series/`, `/series/java/` (e `/java/`, que redireciona), `/capas/` (D78),
  `/rss.xml`, `/og/<slug>.png` e `/sitemap-index.xml`
- `/categories/<Nome>/` e `/tags/<Nome>/` com o **nome cru** na URL (maiúsculas, acentos e espaços)
- Redirecionamentos: `/categories/Arquitetura/`, `/Java/` e `/Observabilidade/` → o livro novo
  (`NOMES_ANTIGOS`, D30); `/posts/java-NN/` → `/posts/java-<LTS>/#java-NN` (vindo de `ABSORBED`),
  `/about/` → `/` (a página Sobre saiu na D33; o Cesar escreve depois), `/projects/` → `/`,
  `/exercicios` → `/`, `/categories/Carreira/` → `/categories/` e `/tags/Pagamentos/` →
  `/tags/Cobrança/` (o livro Carreira saiu e a tag virou Cobrança na coleção de 13, D78)
- `/archive/?livro=<slug>` e `/tags/<Nome>/?livro=<slug>` abrem a lista já filtrada por um livro (D33)
- `/2/` e `/3/`: páginas da home paginada, 12 lugares por página (na primeira, o destaque vale dois:
  11 artigos em `/`, D52)

Detalhes e casos especiais estão em `docs/decisoes.md` (D7).

## Stack

Aprovada em 23/09/2026. Detalhes em `docs/decisoes.md`.

- Astro 7, site estático, com TypeScript 6 estrito (o `astro check` ainda não aceita o TS 7)
- Posts em Markdown (`.md`). `.mdx` só quando o post usa componente (figura, figura em passos, frase em
  destaque, ícone de ferramenta, print, tela de aplicativo)
- Expressive Code para código (título, linhas destacadas, diff, Copiar). KaTeX só em post com fórmula
- CSS próprio com tokens, sem Tailwind e sem framework de UI. Visual "papel e luz" (D61): tudo é
  papel (`.folha`, fichas de catálogo e papéis colados com fita), latão e luz sobre os livros, painéis
  dos desenhos (`.painel`) e azul-tinta (`--acento`) no que é clicável
- Fontes: Besley (títulos), Literata com `opsz` (texto), IBM Plex Sans (interface), JetBrains Mono
  (código); nos livros, Bitter e Newsreader itálico (D30); nas notas da caneta, Caveat (D48)
- Busca com Pagefind e interface própria (D2, por medição): índice gerado no `postbuild`
- Pré-carregamento por regras de especulação do navegador (`<script type="speculationrules">`, JSON
  no `<head>` do `Base.astro`; `prefetch` com `eagerness: "moderate"`, sem `prerender` e sem
  biblioteca, D52)
- Node 24 (`.node-version`, instalado pelo fnm) e npm
- Publicado por GitHub Actions no GitHub Pages, em `blog.cesarschutz.com.br` (D34): o `deploy.yml`
  roda a cada push na `main` (`withastro/action` e `deploy-pages`), e o domínio fica nas
  configurações do Pages do repositório (DNS: `blog` CNAME `cesarschutz.github.io`, no registro.br).
  Em cada PR para a `main`, o `frontend-review.yml` roda a conferência do frontend, sem publicar (D76)

## Comandos

Sempre com o Node 24: `fnm exec --using=24 <comando>`.

```bash
npm run dev -- --host 127.0.0.1   # o Astro 7 sobe o servidor em segundo plano e mostra o endereço
npx astro dev stop   # para o servidor (também: astro dev status, astro dev logs)
npm run build        # dist/; no postbuild, as imagens /og/*.png (Chrome, D10) e o índice do Pagefind
npm run check        # astro check: 0 erros antes de mostrar qualquer coisa ao Cesar
npm run preview      # serve o dist/; é onde a busca funciona (no dev não há índice)
npm run contraste    # contraste dos tokens (D22); falha se texto ficar abaixo do mínimo
npm run links        # confere links internos, âncoras e redirecionamentos do dist/
npm run conferir -- <slug> [--base URL] [--capturas]   # o post em 320–1600px × claro/escuro: rolagem
                     # lateral, console, rede, alt e marcas da caneta (D53); sai 1 com problema.
                     # Aceita um caminho no lugar do slug (/<caminho>/)
npm run escrita -- <slug>   # as regras de escrita do post (D71): título, descrição, TL;DR, abertura,
                     # primeira pessoa e os avisos de post em partes; sem slug, o levantamento de todos
npm run frontend:rapido   # os testes do frontend sem build: plugins de Markdown e o motor da figura em passos
npm run frontend     # o rápido mais interações, troca de tema e a matriz de páginas (D76; o CI roda os
                     # mesmos em cada PR); precisa do `npm run build` antes
npm run setup        # confere o ambiente (Node, dependências, skills, Chrome, motor do Impeccable)
npm run apresentacao -- <slug> --pptx <arquivo> --titulo "…"   # slides do NotebookLM
npm run apresentacao -- <slug> --pdf <arquivo> --titulo "…"    # os slides no post a partir do PDF (D77)
node scripts/slides/capturar.mjs <slug> [--base URL]   # as fotos do post para a apresentação (D74)
python3 scripts/slides/posts/<slug>.py                 # gera a apresentação do post em saida/slides/<slug>/
python3 scripts/slides/conferir.py <slug>              # PDF, imagens, folha de contato e checagens
python3 scripts/slides/fontes.py [--instalar]          # as fontes do site em TTF (instalar = download, com OK)
node scripts/desenho/validar.mjs [slug]   # regras da capa, das lousas, das figuras e das animações
node scripts/desenho/validar.mjs marcas   # os logos das ferramentas (src/marcas/) e a regra de marca (D64)
node scripts/desenho/revisar.mjs <slug> --base <dev>   # revisão dos desenhos do post (D59): bugs + fotos
node scripts/foto.mjs <url> <saida.png> [--seletor css] [--tema escuro] [--largura 390] …
                                          # foto de uma página ou de uma peça (Chrome próprio; opções no script)
node scripts/desenho/centrar.mjs <slug>   # centra os recortes no desenho (dev no ar)
node scripts/desenho/render.mjs [slug]    # folha da ilustração, claro e escuro (dev no ar)
node scripts/desenho/java.mjs             # as ilustrações da série Java (padrão fixo, D17)
node scripts/desenho/tags.mjs [slug]      # os ícones das tags (src/livros/tags/, D52)
node scripts/desenho/livros.mjs <slug> [--ver]   # desenho e ícone de livro novo (scripts/desenho/livros/<slug>.mjs)
node scripts/livros/titulo-da-capa.mjs "Linha|Linha" [--frase "…"]   # corpo do título na capa (e as linhas da frase)
node scripts/livros/conferir-cores.mjs "#hex:Nome" …   # cor de livro novo: contraste nos papéis do site e pares parecidos
node scripts/marca.mjs                    # a marca e os ícones do navegador (precisa do pdftocairo)
node scripts/caveat-titulos.mjs           # a Caveat dos títulos à mão (título novo em src/data/mao.ts, C05)
node scripts/livros/fotos.mjs             # as fotos da ficha "Do livro" e dos vazios (D57), com o dev no ar
                                          # (outra porta: ENDERECO=http://127.0.0.1:NNNN): livro, capa, lombada ou nº de artigos novo
```

Os scripts que abrem o Chrome usam o instalado; `CHROME_PATH` troca o navegador (`scripts/chrome.mjs`).

A porta 4321 desta máquina está ocupada por outra ferramenta do Cesar, que não deve ser tocada. O
Astro usa a próxima livre (4322). Só no dev: `/amostra/` (tokens, fontes, avisos), `/amostra/markdown/`
e `/amostra/mdx/` (recursos de Markdown e de MDX, de `src/amostra/`), `/amostra/caneta/` (os 34 tipos
da caneta, de `src/amostra/caneta.md`), `/amostra/desenhos/` (a folha de uma ilustração,
`?slug=<slug>`), `/amostra/livros/` (as capas planas, para comparar com `docs/capas/referencia/`),
`/amostra/tags/` (os ícones das tags, lado a lado e da pílula à marca d'água), `/amostra/lousas/` (os
quadros-chave de cada desenho de `src/lousas/`, parados, no instante de cada marca; `?lousa=<slug>/<nome>`,
`?tema=escuro`, `?quadros=todos`) e `/amostra/colecoes/` (as sugestões de coleção de livros e a final, a
de 13 da D78, de `docs/prototipos/colecoes/colecoes.json`; `/amostra/colecoes/livro/<slug>/` mostra um
livro em tamanho real).

Medição da busca (D2): `scripts/bench-busca/` (construir, conferir, medir), com o dev parado.

## Mapa das pastas

O mapa completo, pasta por pasta, está em **`docs/mapa.md`** (atualize-o quando mudar). As de quase
toda tarefa:

- `src/content/posts/` (os posts; nome do arquivo = slug da URL) e `src/content.config.ts` (o esquema);
- os desenhos do post: `src/ilustracoes/<slug>.svg` (a capa), `src/figuras/<slug>/` (figuras e figuras
  em passos), `src/marcas/` (logos e a regra de marca, D64) e `src/evidencias/<slug>/` (prints);
- `src/livros/` (dados, cores e desenhos dos livros, D53) e `src/data/` (taxonomia, séries, Java, decks
  e os textos do site);
- `src/components/`, `src/layouts/Base.astro`, `src/pages/`, `src/styles/` (`tokens.ts` é a fonte única
  das cores, D4), `src/scripts/`, `src/lib/` e `src/plugins/` (os plugins de Markdown);
- `docs/` (briefing, estado, decisões, estilo dos desenhos, guia da caneta, movimento, `capas/CAPAS.md`
  e o histórico) e `scripts/` (as ferramentas dos comandos acima);
- fora do git: `entrada/` (posts para adaptar), `saida/` (o que os scripts entregam) e `redesenho/` (os
  protótipos).

## Skills

- `post`: todo post, nos modos Novo e Adaptar, com o checklist único, as regras de escrita (título,
  descrição, TL;DR, abertura e voz, D71), o post em partes e a revisão em lote
  (`.claude/revisao-posts.md`)
- `desenho`: a capa de cada post (o que desenhar, capa viva, regras técnicas, recortes, validação)
- `figura`: figuras coloridas, figura em passos (D67), logos das ferramentas, print como evidência
  (D58) e tela de aplicativo como print, claro e escuro pelo tema do site (D86); a animação com play,
  em prova
- `lousa`: a frase em destaque e a `Lousa` das páginas em prova (D67)
- `caneta`: a passada de caneta num post (a última etapa da skill `post`, ou sozinha: "passa a caneta
  no post X"), pelo guia `docs/marcacoes.md`
- `apresentacao`: a apresentação de um post; Criar (D74): o `.pptx` no estilo do blog, com os desenhos e
  a caneta do post; NotebookLM: o `.pptx` de lá vira os slides WebP e o PDF do post
- `redesenho`: os modelos de visual novo (D55): direção, construção por agente, conferência e entrega
  da URL ao Cesar; a versão final virou o site na D61
- `serie-java`: série "Atualizações do Java" (só LTS)
- De terceiros, lidas antes de instalar (D35): `impeccable` (revisão de design; o motor fica em
  `~/.impeccable`), `gsap-core`, `gsap-timeline`, `gsap-plugins`, `gsap-performance` e `gsap-utils`
  (animações; as de React, Vue e ScrollTrigger saíram na D53), `web-quality-audit`, `accessibility`,
  `performance`, `core-web-vitals`, `seo` e `best-practices`, e as sete `better-*` de jakubkrehel/skills
  (MIT, 28/09/2026): `better-interface`, que junta as outras numa revisão só, `better-accessibility`,
  `better-layout`, `better-typography`, `better-colors`, `better-ui` e `better-writing`. Atualizar = ler
  a versão nova antes.
- MCPs do projeto (`.mcp.json`): `astro-docs` (documentação do Astro) e `chrome-devtools`
  (`chrome-devtools-mcp@1.10.1`, sem telemetria), usados na conferência dos posts.

## Em outro computador

- **Instalar à mão:** Node 22.12 ou mais novo (o Astro 7 exige; o projeto usa o 24, `.node-version`),
  o Google Chrome e o Claude Code. O `pdftocairo` (poppler) só para regerar a marca. Para as
  apresentações (D74): Python 3 com python-pptx, o LibreOffice, o poppler e as fontes do site em TTF
  (`python3 scripts/slides/fontes.py`).
- **Depois do clone:** `npm run setup` (`scripts/verificar-ambiente.mjs`). Ele roda o `npm install`
  se faltar `node_modules`, confere as skills em `.claude/skills`, o Chrome e o **motor do
  Impeccable**, que não fica no git: é baixado para `~/.impeccable/bin/<versão>/` no primeiro uso
  (`.claude/skills/impeccable/scripts/impeccable engine-probe` baixa e confere o SHA-256). Termina
  com "Ambiente OK" ou com a lista do que falta e como resolver.
- O mesmo script roda sozinho no início de cada sessão do Claude Code (hook `SessionStart`). **Se ele
  apontar falta, resolva antes de qualquer tarefa ou diga ao Cesar o que ele precisa fazer.**
- Ao abrir o projeto, o Claude Code pede para aprovar os MCPs do `.mcp.json` (eles já estão
  habilitados no `.claude/settings.json`) e os hooks do projeto: aprove.
- Telemetria desligada no `env` do `.claude/settings.json` (`DO_NOT_TRACK`, `IMPECCABLE_NO_TELEMETRY`,
  `DISABLE_TELEMETRY`).

## Armadilhas do ambiente

- O shell do Claude é bash, e o fnm só está configurado no zsh: aqui, `node` é o 25 do Homebrew.
  Rode tudo do projeto com o Node 24: `fnm exec --using=24 npm run dev` (vale para npm, npx e node).
- Suba o dev com `npm run dev -- --host 127.0.0.1`. Sem isso ele escuta só em `localhost` (IPv6), e o
  endereço <http://127.0.0.1:4322> que o Cesar usa não abre.
- No bash do Claude, `node -e '…'` quebra com apóstrofo no texto ("d'água"): escreva o script num
  arquivo do scratchpad e rode o arquivo.
- Antes de commitar (quando pedido): `git status --untracked-files=all`, e nada com " 2" no nome.
- Push sempre pelo remoto SSH (`origin` = `git@github.com:cesarschutz/blog.git`): pelo HTTPS com o
  token do `gh`, o GitHub recusa qualquer push que mexa em `.github/workflows/` (falta o escopo
  `workflow`). E lembre: push na `main` publica o site (D34).
- As de vez em quando, com o sintoma e a saída, estão em `docs/mapa.md`: renomear só a caixa de um
  arquivo (macOS × Linux do CI), deploy preso na fila, token de cor ou plugin de Markdown que mudou e os
  posts `.md` que saem com o HTML velho (o cache `astro-cache-*` do deploy), o código sem moldura depois
  de mexer no Expressive Code, o campo novo do esquema que o dev descarta e o erro 504 "Outdated
  Optimize Dep" do Vite.
- O `$` em texto de post está em `.claude/rules/posts.md`; o espaço entre `<tspan>`, em
  `.claude/rules/desenho.md`; as armadilhas de interface (cabeçalho fixo, CSS com escopo, quebra de linha
  em `.astro`, Vite com CSS velho, View Transition e GSAP), em `.claude/rules/interface.md`.
