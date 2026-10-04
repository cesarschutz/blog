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
- Todo trabalho em post (criar, escrever, adaptar, importar, migrar, revisar) segue a skill **`post`**.
- **Formato do post (D63):** todo post, novo ou ajustado, começa por uma conversa com o Cesar:
  detalhado (com o TL;DR recolhível) ou resumo (com o infográfico), a estrutura do que entra e as
  fontes (os links que ele estudou ou, sem eles, fontes confiáveis). Os links ficam ao longo do texto
  e também em `## Fontes`.
- **Caneta do caderno (D48):** a última etapa de todo post é a passada de caneta (skill **`caneta`**):
  ler o guia vivo `docs/marcacoes.md` inteiro, propor as marcações (trecho, tipo, motivo), aplicar só
  com o OK do Cesar e testar em 320, 390, 768, 1280 e 1600px nos dois temas. Ajuste que o Cesar pedir
  nas marcações vai na hora para "Ajustes do Cesar" no guia, com a data.
- Posts para adaptar ficam em **`entrada/`** (fora do git).
- **Controles em prova (D65):** a `Lousa` e a `Animacao` aceitam `controles="marca-texto" | "caderno" |
  "post-it"` (as opções do protótipo `/prototipos/controles/`). Cada post da prova fica com a opção que
  recebeu (lista na D65); post novo fica sem `controles` até o Cesar escolher.
- **Figura em passos (D67, em prova):** um formato só no lugar da lousa de passos, da de comparação e da
  animação com play (`FiguraPassos`, regras na skill `figura`), na página `/animacoes-test-2/`. Até o
  Cesar decidir, post novo segue as regras de hoje.
- **Apresentação de um post (D74):** quando o Cesar pedir a apresentação (PPT, slides, deck) de um post,
  ela sai em `.pptx` no estilo do blog, com os desenhos, os prints e as marcações da caneta do próprio
  post e as notas do apresentador: skill **`apresentacao`**, modo Criar, com as ferramentas de
  `scripts/slides/`.
- **Nunca** instalar skill, MCP ou pacote de terceiros sem ler o código antes e reportar ao Cesar o que
  for suspeito (rede, variáveis de ambiente, credenciais, comandos destrutivos).

## Redesenho (D55, publicado na D61)

O visual do site é a versão final do redesenho: **papel, tinta, latão e luz** (D61, 02/10/2026). O
resumo está na seção "Papel e luz (D61)" do `DESIGN.md`, que vence as seções antigas dele (ainda das
"Folhas claras", D26) até a reescrita. O detalhe de cada peça, com os pedidos do Cesar numerados, está
em `docs/redesenho/rodada-4/`.

- **Os protótipos ficam só nesta máquina**, fora do git (`redesenho/`, no `.gitignore`):
  - os 10 modelos em <http://127.0.0.1:4400>;
  - as cópias das rodadas 2 a 4 em `redesenho/novos/` (portas 4411 a 4430);
  - a versão final com as amostras em <http://127.0.0.1:4421> (`/amostras/`).
- **Onde está cada coisa:** a história das quatro rodadas está em `docs/redesenho/`. O processo está na
  skill `redesenho`, e os agentes, em `.claude/agents/redesenho-*`.
- **Mudança de visual** agora é no blog, pelas regras de sempre. Uma rodada nova de protótipos segue a
  skill `redesenho`.

## Regras que valem sempre

- Tudo em pt-BR, com acentuação correta. Identificadores de código podem ficar em inglês.
- **Nunca** commitar, dar push, criar repositório ou publicar sem pedido explícito do Cesar.
- `../blog-atual` é **somente leitura**. Pode ler à vontade, mas nunca editar, instalar, buildar nem
  rodar git que escreva lá (use `git --no-optional-locks`). Para rodar algo dele, copie para o scratchpad.
  O `.claude/settings.json` bloqueia a edição de arquivos lá, mas não cobre comandos no terminal.
  Um `git status` comum já regrava o `.git/index` de lá. Ao delegar para subagentes, repasse essa regra.
- Antes de instalar qualquer biblioteca, proponha e espere o OK. Registre a decisão em `docs/decisoes.md`.
- Logo de marca alheia (ferramenta, produto, empresa) só como a regra de marca do dono permite (D64): a
  marca precisa estar conferida na política oficial e registrada em `src/marcas/regras.json` antes do
  primeiro uso; registrada e permitida, usa sempre. Sem registro, o build quebra.
- Cores só por tokens CSS (`var(--ink)`, `var(--cat)`…). Nada de hex solto em componente ou SVG.
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
- O caminho do projeto tem espaço (`novo site`): use aspas em todo comando e script.
- Frase de autor (saiu na D39) só volta com a fonte primária aberta e conferida.
- Se o Cesar corrigir a mesma coisa duas vezes, isso vira regra no lugar certo (skill, `.claude/rules/` ou aqui).
- **Pedido num post termina em pergunta (D68):** depois de fazer o que o Cesar pediu ou reclamou num
  post, pergunte se aquilo vira regra para os próximos posts, dizendo onde ela ficaria. Com o sim,
  registre na hora; com o não, vale só para aquele post (skill `post`, "Regra de aprendizado").

## Livros, séries e tags

Cada categoria é um livro de uma coleção numerada ("edição de estudo"); cada série é uma revista
técnica (cada post, uma edição). A regra é `docs/capas/CAPAS.md` (D30, D32); os dados, as cores e os
desenhos ficam em `src/livros/` (D53). Categoria ou série nova = pela seção "Livros novos" do
`CAPAS.md`, com o OK do Cesar. Os livros **não mudam com o tema** (D39). **Toda tag tem um ícone**
(D52): tag nova num post = ícone novo, pela seção "Tags" do `CAPAS.md`; sem ele, o build quebra.
Componentes e detalhes em `.claude/rules/interface.md`. Para conferir, `/amostra/livros/` e
`/amostra/tags/` (só no dev).

## URLs que não podem quebrar

- `/posts/<slug>/`, com as mesmas âncoras de título de hoje (ids no estilo github-slugger, com acento)
- `/archive/`, `/categories/`, `/tags/`, `/series/`, `/series/java/` (e `/java/`, que redireciona), `/rss.xml`, `/og/<slug>.png` e
  `/sitemap-index.xml`
- `/categories/<Nome>/` e `/tags/<Nome>/` com o **nome cru** na URL (maiúsculas, acentos e espaços)
- Redirecionamentos: `/categories/Arquitetura/`, `/Java/` e `/Observabilidade/` → o livro novo
  (`NOMES_ANTIGOS`, D30); `/posts/java-NN/` → `/posts/java-<LTS>/#java-NN` (vindo de `ABSORBED`),
  `/about/` → `/` (a página Sobre saiu na D33; o Cesar escreve depois), `/projects/` → `/` e
  `/exercicios` → `/`
- `/archive/?livro=<slug>` e `/tags/<Nome>/?livro=<slug>` abrem a lista já filtrada por um livro (D33)
- `/2/` e `/3/`: páginas da home paginada, 12 lugares por página (na primeira, o destaque vale dois:
  11 artigos em `/`, D52)

Detalhes e casos especiais estão em `docs/decisoes.md` (D7).

## Stack

Aprovada em 23/09/2026. Detalhes em `docs/decisoes.md`.

- Astro 7, site estático, com TypeScript 6 estrito (o `astro check` ainda não aceita o TS 7)
- Posts em Markdown (`.md`). `.mdx` só quando o post usa componente (lousa, figura, animação, ícone
  de ferramenta, print)
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
  configurações do Pages do repositório (DNS: `blog` CNAME `cesarschutz.github.io`, no registro.br)

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
npm run setup        # confere o ambiente (Node, dependências, skills, Chrome, motor do Impeccable)
npm run apresentacao -- <slug> --pptx <arquivo> --titulo "…"   # slides do NotebookLM
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
node scripts/marca.mjs                    # a marca e os ícones do navegador (precisa do pdftocairo)
node scripts/caveat-titulos.mjs           # a Caveat dos títulos à mão (título novo em src/data/mao.ts, C05)
node scripts/livros/fotos.mjs             # as fotos da ficha "Do livro" e dos vazios (D57), com o dev no ar
                                          # (outra porta: ENDERECO=http://127.0.0.1:NNNN): livro, capa, lombada ou nº de artigos novo
```

A porta 4321 desta máquina está ocupada por outra ferramenta do Cesar, que não deve ser tocada. O
Astro usa a próxima livre (4322). Só no dev: `/amostra/` (tokens, fontes, avisos),
`/amostra/markdown/` e `/amostra/mdx/` (recursos de Markdown e de MDX, de `src/amostra/`), `/amostra/caneta/` (os 34
tipos da caneta, de `src/amostra/caneta.md`), `/amostra/desenhos/` e
`/amostra/livros/` (as capas planas, para comparar com `docs/capas/referencia/`), `/amostra/tags/`
(os ícones das tags, lado a lado e da pílula à marca d'água) e `/amostra/lousas/` (os quadros-chave
de cada lousa, parados, no instante de cada marca, com o estado do post; `?lousa=<slug>/<nome>`,
`?tema=escuro`, `?quadros=todos`).

Medição da busca (D2): `scripts/bench-busca/` (construir, conferir, medir), com o dev parado.

## Mapa das pastas

Atualize quando mudar.

```
DESIGN.md                sistema visual (fonte de verdade do visual, formato DESIGN.md do Google)
CLAUDE-CODE.md           análise de 28/09/2026: a configuração do Claude Code, os recursos de post e as
                         sugestões de melhoria ainda por decidir
PRODUCT.md               registro de produto do Impeccable (leitor, propósito, diferenciais); o
                         briefing vence em caso de divergência
.impeccable/config.json  ajustes do Impeccable ("buildPath": "code")
entrada/                 posts trazidos para adaptar (fora do git)
saida/                   o que os scripts geram para entregar (fora do git): slides/<slug>/ (D74)
docs/briefing.md         decisões de produto e design (fonte da verdade)
docs/estado.md           painel: fase, pronto, próximos passos, perguntas
docs/decisoes.md         registro de decisões (data, decisão, motivo, alternativas)
docs/estilo-desenho.md   estilo da capa (e da capa viva), das figuras coloridas e das lousas
docs/marcacoes.md        guia vivo da caneta do caderno: 34 tipos, limites, tela, ajustes do Cesar (D48, D56)
docs/movimento.md        o detalhe de cada animação (durações, curvas, ordem); as regras ficam no DESIGN.md
docs/capas/              a regra dos livros (CAPAS.md) e as imagens de referência
src/livros/              o que o site lê dos livros (D53): livros.json, cores.js, grao.svg, desenhos/,
                         icones/, serie/, tags/ (um ícone por tag, D52) e fotos.json (as etiquetas do
                         livro deitado, D57)
docs/historico/          rodadas fechadas: o prompt da Fase 0, os controles da D46/D47, ajustes-d52/
                         (controle, regras dos agentes, diagnósticos, pesquisa e sugestões da D52) e
                         os protótipos superados
docs/virada.md           plano para o domínio passar ao blog novo (só com OK do Cesar)
docs/figura-em-passos/   a figura em passos (D67, em prova): o pedido (README), a pesquisa e a auditoria
                         das peças animadas de 02/10/2026
docs/redesenho/          redesenho (D55, D61): pedido, regras e status (README), a direção de cada modelo
                         (modelos/), as rodadas 2 a 4 (rodada-N/: o texto do Cesar, a direção e o
                         controle) e a API da base comum
redesenho/               os protótipos do redesenho (fora do git, D61): projeto Astro próprio, porta
                         4400, e as cópias do blog em novos/ (portas 4411 a 4430)
docs/referencias/        protótipos aprovados da Fase 0 (estilo dos desenhos, lousas, "Folhas claras")
docs/prototipos/         protótipos que ainda são referência (caneta, animações da D51)
src/content/posts/       posts; nome do arquivo = slug da URL
src/data/                taxonomia e series (leem src/livros), java, decks (apresentações), site
                         (autor, perfis e textos), mao (os títulos à mão da papelaria, C05)
src/amostra/             o conteúdo das páginas /amostra/ (recursos.md, recursos.mdx, caneta.md)
src/styles/tokens.ts     cores dos dois temas: fonte única, gera as variáveis CSS (D4)
src/styles/              base (folha, painel, papel colado, barra de rolagem, transição de página),
                         fontes, avisos, prosa, artigo (grade, notas), paginas, estante e livro (lombada,
                         livro 3D e capa), desenho (ilustrações), capa-viva, figura (figuras, animações
                         e logos, D58), lousa e lousa-nova, caneta (marcações, D48), traco (traços à
                         caneta, C04), visor, contador e copiado (D49); da D61: luz e livro-vivo (a luz
                         dos livros e do mouse), vidro e nicho (o chão das fileiras e os abajures),
                         catalogo (as fichas), gaveta, ficha-do-livro e suave (a entrada ao rolar)
src/assets/              caveat-titulos.woff: a Caveat 600 só com as letras dos títulos à mão (C05)
src/layouts/Base.astro   head, anti-piscada, cabeçalho, rodapé e busca
src/components/          peças das páginas (estante, gaveta, sumário, avisos, busca…) e dos posts (Lousa,
                         Figura, Animacao, Ferramenta, Evidencia; LousaTempo e LousaLoop só nos antigos);
                         da D61: Colecao (a fileira da home), FileiraTopo (o alto da página do livro),
                         PontoDeLuz e Luz (abajures e luz), Fichario, NuvemTags e FichasTags (Tags),
                         Vizinhos e LivroDoArtigo (o fim do post), AbaTopo (voltar ao topo) e TracoTitulo
src/computador/          o computador (D61): o ícone no canto, o macOS de mentira (sistema, janelas,
                         dock, menus) e os apps (Finder, editor, Terminal, Pré-Visualização, Sobre); os
                         dados vêm das rotas src/pages/mac/
src/pages/               rotas; a home é [...page].astro (paginada, D27); livros/[slug].svg (desenho
                         da capa, que a gaveta busca ao abrir o livro, D30);
                         posts/[slug]/apresentacao.pdf.ts (PDF) e og/[slug] (imagem, D10)
src/plugins/             Markdown: avisos, notas laterais, apresentação, tabelas, matemática e a
                         caneta (marcacoes.mjs, D48)
src/lib/                 posts, formatos, busca (Pagefind), código (Expressive Code), PDF, estante
                         (livros), livros-svg (desenhos e ícones), livro-3d (medidas do livro aberto),
                         marca (traçado da marca, gerado), caderno (miolo do caderno "cs", D52),
                         tags-svg (ícones das tags, D52), fotos (as fotos paradas dos livros e o lugar
                         das etiquetas, D57), traco (traços e ícones à caneta: menu,
                         colchete, círculo, rasura, ondinha, ícones de data, tempo, código, lupa, lua,
                         sol, contornos dos botões e a assinatura, D52, C04), figuras (lê figuras,
                         animações e logos, e troca `data-marca` pelo logo, D58)
src/scripts/artigo.ts    interações do artigo (barra, sumário, notas, visor, apresentação) e o aviso das
                         tabelas que passam da tela no celular (D70)
src/scripts/tema.ts      tema: a lâmpada do cabeçalho alterna claro e escuro, acendendo e apagando
                         (D39, D61; a lâmpada em lampada.ts)
src/scripts/             também: troca.js (a cortina e as chegadas), luz, estante-moderna, fichas-caem,
                         fichario, revelar e embaralha (D61)
scripts/                 contraste, links, apresentacao, og, copiar-katex, desenho/, bench-busca/,
                         marca, caveat-titulos (subconjunto da Caveat, C05), verificar-ambiente
                         (npm run setup e hook do início da sessão), livros/ (as fotos dos livros, D57),
                         foto.mjs (foto de uma página ou peça, sem MCP, D58), slides/ (as apresentações
                         no estilo do blog, D74: estilo.py, capturar.mjs, conferir.py, fontes.py e o
                         roteiro de cada post em posts/<slug>.py)
public/posts/<slug>/     diagramas antigos e slides das apresentações (deck/)
public/livros/fotos/     as fotos dos livros (D57): o deitado de cada livro e o aberto em branco
src/ilustracoes/         uma ilustração SVG por post (<slug>.svg), com os recortes na raiz (D11)
src/lousas/<slug>/       desenhos das lousas de cada post .mdx
src/figuras/<slug>/      diagramas e gráficos coloridos do post (D58)
src/animacoes/<slug>/    animações com play: o quadro final (<nome>.svg) e o movimento (<nome>.ts, GSAP)
src/marcas/              logos das ferramentas (viewBox 100×100) e ícones genéricos, reaproveitados em todo
                         post; regras.json, a regra de marca de cada um (D64)
src/evidencias/<slug>/   prints que provam algo do texto (PNG)
.github/workflows/       deploy no GitHub Pages (a cada push na main, D34)
.claude/skills/          procedimentos (carregados sob demanda); as de terceiros são cópias lidas
.claude/agents/          subagentes do Impeccable
.claude/revisao-posts.md lista e status da revisão em lote dos posts
.mcp.json                MCPs do projeto (astro-docs, chrome-devtools)
.claude/rules/           regras por caminho (posts, desenhos, interface)
```

## Skills

- `post`: todo post, nos modos Novo e Adaptar, com o checklist único e a revisão em lote
  (`.claude/revisao-posts.md`)
- `desenho`: a capa de cada post (o que desenhar, capa viva, regras técnicas, recortes, validação)
- `figura`: figuras coloridas, animação com play, logos das ferramentas e print como evidência (D58)
- `lousa`: a lousa (`Lousa`, de passos ou de comparação) e a frase em destaque; `LousaTempo` e
  `LousaLoop` só nos posts antigos
- `caneta`: a passada de caneta num post (a última etapa da skill `post`, ou sozinha: "passa a caneta
  no post X"), pelo guia `docs/marcacoes.md`
- `apresentacao`: a apresentação de um post; Criar (D74): o `.pptx` no estilo do blog, com os desenhos e
  a caneta do post; NotebookLM: o `.pptx` de lá vira os slides WebP e o PDF do post
- `redesenho`: os modelos de visual novo (D55): direção, construção por agente, conferência e entrega
  da URL ao Cesar; a versão final virou o site na D61
- `serie-java`: série "Atualizações do Java" (só LTS)
- De terceiros, lidas antes de instalar (D35): `impeccable` (revisão de design; o motor fica em
  `~/.impeccable`), `gsap-core`, `gsap-timeline`, `gsap-plugins`, `gsap-performance` e `gsap-utils` (animações; as de
  React, Vue e ScrollTrigger saíram na D53), `web-quality-audit`, `accessibility`, `performance`,
  `core-web-vitals`, `seo` e `best-practices`. Atualizar = ler a versão nova antes.
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

- O macOS não diferencia maiúsculas e o Linux do CI diferencia. Renomear só a caixa de um arquivo
  exige `git mv` em dois passos.
- `$` em texto de post precisa de escape (`US\$ 10`). Sem isso, dois `$` na mesma frase viram fórmula.
- O espaço entre dois `<tspan>` some ao embutir o SVG: use `&#160;`.
- Antes de commitar (quando pedido): `git status --untracked-files=all`, e nada com " 2" no nome.
- Deploy preso na fila: cancelar e reexecutar o workflow (o `gh` está instalado nesta máquina).
- Mudou um token de cor? O tema dos blocos de código sai dos tokens (`src/lib/codigo.ts`), e o deploy
  reaproveita o cache de conteúdo da execução anterior (`withastro/action`): os posts `.md` que não
  mudaram saem apontando para um `ec.*.css` que não existe mais (na D61, a série Java). Depois do
  push, apague os caches `astro-cache-*` do Actions (`gh cache delete`) e rode o deploy de novo (`gh
  run rerun`), ou confira o site no ar com a fumaça.
- Push sempre pelo remoto SSH (`origin` = `git@github.com:cesarschutz/blog.git`): pelo HTTPS com o
  token do `gh`, o GitHub recusa qualquer push que mexa em `.github/workflows/` (falta o escopo
  `workflow`). E lembre: push na `main` publica o site (D34).
- O shell do Claude é bash, e o fnm só está configurado no zsh: aqui, `node` é o 25 do Homebrew.
  Rode tudo do projeto com o Node 24: `fnm exec --using=24 npm run dev` (vale para npm, npx e node).
- Mudou a configuração ou o tema do Expressive Code? `npm run build -- --force`: o cache de conteúdo
  guarda o HTML dos posts apontando para o CSS antigo do EC, e os blocos de código perdem o estilo (D26).
  O dev tem o mesmo problema, e reiniciar não basta: pare o dev, apague `.astro/data-store.json` e
  suba de novo (o sintoma é o código sem moldura, com título e linguagem grudados, "Sem AOPJava",
  porque o HTML guardado aponta para um `ec.*.css` que não existe mais).
- Mudou o HTML que um plugin de Markdown gera (`src/plugins/`)? O mesmo cache guarda o HTML dos posts
  `.md` e não percebe a mudança no código do plugin: no build e no deploy, os posts que não mudaram saem
  com o HTML antigo (os `.mdx` são refeitos). As opções do plugin no `astro.config.mjs` contam: o
  `rehype-tabela` tem a opção `saida` (D70); suba o número dela e o cache se refaz sozinho, aqui e no
  deploy. Plugin sem essa opção: `npm run build -- --force` e, depois do push, apagar os caches
  `astro-cache-*`.
- Suba o dev com `npm run dev -- --host 127.0.0.1`. Sem isso ele escuta só em `localhost` (IPv6), e o
  endereço <http://127.0.0.1:4322> que o Cesar usa não abre.
- No bash do Claude, `node -e '…'` quebra com apóstrofo no texto ("d'água"): escreva o script num
  arquivo do scratchpad e rode o arquivo.
- Campo novo no esquema do conteúdo (`content.config.ts`): o dev já aberto não relê sozinho e
  descarta o campo até reiniciar. Sem tirar o dev principal do ar, suba por uns segundos um segundo
  dev noutra porta (`--ignore-lock`), que refaz o armazenamento de conteúdo com o esquema novo, e
  pare-o (D52, C03).
- Dev com erro 504 "Outdated Optimize Dep" (o GSAP não carrega, "Failed to fetch dynamically imported
  module", a gaveta não arrasta): o cache de dependências do Vite ficou velho, em geral depois de
  mover arquivos importados com o dev no ar. Pare o dev, apague `node_modules/.vite` e suba de novo.
- As armadilhas de interface (cabeçalho fixo, CSS com escopo, quebra de linha em `.astro`, Vite com
  CSS velho, View Transition e GSAP) estão em `.claude/rules/interface.md`.
