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

Lista grande de ajustes: controle em `docs/ajustes-dNN/` (um commit por item, quando o Cesar pedir
commits), agentes em paralelo sem parar para perguntar e as decisões pendentes no fim. Ao fechar a
rodada, o controle vai para `docs/historico/` e o lixo de depuração (`.astro/depuracao/`, previews em
outras portas) sai.

## Posts, visual e ferramentas (D35)

- O **`DESIGN.md`** (raiz) é a fonte de verdade do visual. Ele vence qualquer ferramenta, inclusive o
  Impeccable (sem "go all out", redesign ou troca do `DESIGN.md`).
- Todo trabalho em post (criar, escrever, adaptar, importar, migrar, revisar) segue a skill **`post`**.
- **Caneta do caderno (D48):** a última etapa de todo post é a passada de caneta (skill **`caneta`**):
  ler o guia vivo `docs/marcacoes.md` inteiro, propor as marcações (trecho, tipo, motivo), aplicar só
  com o OK do Cesar e testar em 320, 390, 768, 1280 e 1600px nos dois temas. Ajuste que o Cesar pedir
  nas marcações vai na hora para "Ajustes do Cesar" no guia, com a data.
- Posts para adaptar ficam em **`entrada/`** (fora do git).
- **Nunca** instalar skill, MCP ou pacote de terceiros sem ler o código antes e reportar ao Cesar o que
  for suspeito (rede, variáveis de ambiente, credenciais, comandos destrutivos).

## Regras que valem sempre

- Tudo em pt-BR, com acentuação correta. Identificadores de código podem ficar em inglês.
- **Nunca** commitar, dar push, criar repositório ou publicar sem pedido explícito do Cesar.
- `../blog-atual` é **somente leitura**. Pode ler à vontade, mas nunca editar, instalar, buildar nem
  rodar git que escreva lá (use `git --no-optional-locks`). Para rodar algo dele, copie para o scratchpad.
  O `.claude/settings.json` bloqueia a edição de arquivos lá, mas não cobre comandos no terminal.
  Um `git status` comum já regrava o `.git/index` de lá. Ao delegar para subagentes, repasse essa regra.
- Antes de instalar qualquer biblioteca, proponha e espere o OK. Registre a decisão em `docs/decisoes.md`.
- Cores só por tokens CSS (`var(--ink)`, `var(--cat)`…). Nada de hex solto em componente ou SVG.
- Ícone novo de interface: função em `src/lib/traco.ts`, na caneta preta, nunca SVG solto (D52, C04).
- Toda animação respeita `prefers-reduced-motion`: com ele ligado, tudo aparece no estado final,
  sem prender a tela.
- JavaScript só onde há interação (estante, gaveta, busca, lousas, apresentação, lista/cards, menu de
  tema, filtro por livro, livro ampliado, o nome de transição do livro
  do painel e o menu do celular, D29, D33, D46; o desenho do destaque da home, D41; o lugar das notas
  da caneta, D48; o gesto de copiar, os contadores que rolam e a rasura e a sugestão da 404, D49; os
  atalhos de teclado do artigo e o livro da pilha que voa até o topo, D50; a troca de página por
  folhas, `troca.js` no `<head>`, a abertura em toda página, o desfile de Categorias e o desenho do
  topo do artigo, D51; a ficha dos atalhos, o hover do livro ampliado (o `:hover` nativo se perde na
  pilha 3D), a preferência de tema e de modo válida por 3 dias (o script anti-piscada do `<head>`), o
  aceno dos dois cadernos no fim da abertura da home e a caneta que escreve o fio do cabeçalho quando
  a página demora, a assinatura da home e a fumaça da caneca no hover, D52).
  Artigo sem esses componentes funciona sem JS (as marcações da caneta são estáticas).
- Fontes servidas pelo próprio site (`@fontsource`). Nunca Google Fonts nem CDN em produção.
- Para verificar o blog no navegador (visual, console, performance), use sempre o MCP
  `chrome-devtools`, nunca o `claude-in-chrome`.
- Não pode parecer feito por IA: nada de fonte genérica, gradiente decorativo, sombra genérica em
  tudo, animação de entrada em cada seção, rótulo em caixa alta ou emoji.
- Os protótipos em `docs/referencias/` e `docs/prototipos/` (os novos vão para esta, D40) mostram
  aparência e comportamento, mas não são código para copiar. Onde divergirem do briefing, vale o briefing.
- O caminho do projeto tem espaço (`novo site`): use aspas em todo comando e script.
- Se o Cesar corrigir a mesma coisa duas vezes, isso vira regra no lugar certo (skill, `.claude/rules/` ou aqui).

## Livros e séries: capas, lombadas e categorias

**A regra de capas, lombadas, estante, livros e séries novos é `docs/capas/CAPAS.md`** (D30, D32),
com as imagens de referência em `docs/capas/referencia/`. Cada categoria é um livro de uma coleção
numerada, no estilo "edição de estudo"; cada série é uma revista técnica (cada post, uma edição). Os
dados vêm de `src/livros/livros.json` e todas as cores, de `src/livros/cores.js` (nada de cor fixa).
Desenhos, ícones e emblemas ficam em `src/livros/desenhos/`, `icones/` e `serie/` (D53) e entram inline pelo
`src/lib/livros-svg.ts`; o desenho grande da capa e o emblema da revista só carregam quando o livro
abre na gaveta (`/livros/<slug>.svg`). O número das lombadas, da capa da revista e da página do livro
é o total de artigos, contado pelos posts (some quando é zero); o "VOLUME 01" da capa é a posição na
coleção. Categoria ou série nova = pela seção "Livros novos" do `CAPAS.md`, com o OK do Cesar. Os
componentes são `Capa`, `MioloLombada` (a lombada, em pé e, girada, deitada no `PainelHome`), `Estante` (também no modo
"filtro" do arquivo e das tags), `Gaveta`, `Livro3D`, `LivroEmPe`, `TopoLivro` e `GradeLivros`:
altere esses, sem criar outros em paralelo (`LivroAmpliado` copia o livro 3D para o visor e monta
nele as páginas de dentro, de `/livros/<slug>.json`, D49).
As peças usam os **papéis de cor** de `livro.css` (`--cima`, `--baixo`, `--revista-*`), nunca as
cores cruas `--livro-*`. Os livros **não mudam com o tema** (D39): a categoria sempre com o papel em
cima e a cor do livro embaixo, a série sempre clara. Para conferir, `/amostra/livros/` (só no dev).

**Toda tag tem um ícone** (D52), no traço dos ícones das lombadas: `src/livros/tags/<slug>.svg`,
escrito em `scripts/desenho/tags.mjs` e embutido por `src/lib/tags-svg.ts` (`IconeTag`, `PilulaTag`).
Tag nova num post = ícone novo, pela seção "Tags" do `CAPAS.md`; sem ele, o build quebra. Para
conferir, `/amostra/tags/` (só no dev).

A **marca** (D33) é o livro "cs": `Marca.astro` com o traçado de `src/lib/marca.ts`. Esse arquivo, o
`favicon.svg`, o `favicon.ico` e o `apple-touch-icon.png` saem de `node scripts/marca.mjs` (usa o
`pdftocairo`, do poppler do Homebrew, para tirar o contorno das letras da própria fonte). Não edite à
mão.

## Frases de autores

As frases de autores (o post-it da home e dos artigos, D33) **saíram do blog na D39**, a pedido do
Cesar, com o arquivo delas. Se voltarem um dia, só com a **fonte primária aberta e conferida** (a
revisão de 24/09/2026 mostrou que a maioria das antigas era inventada ou atribuída sem base).

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
- Posts em Markdown (`.md`). `.mdx` só quando o post usa componente (lousa)
- Expressive Code para código (título, linhas destacadas, diff, Copiar). KaTeX só em post com fórmula
- CSS próprio com tokens, sem Tailwind e sem framework de UI. Visual "Folhas claras" (D26): folhas
  (`.folha`), painéis dos desenhos (`.painel`) e azul-tinta (`--acento`) no que é clicável
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
npm run setup        # confere o ambiente (Node, dependências, skills, Chrome, motor do Impeccable)
npm run apresentacao -- <slug> --pptx <arquivo> --titulo "…"   # slides do NotebookLM
node scripts/desenho/validar.mjs [slug]   # regras da ilustração e das lousas
node scripts/desenho/centrar.mjs <slug>   # centra os recortes no desenho (dev no ar)
node scripts/desenho/render.mjs [slug]    # folha da ilustração, claro e escuro (dev no ar)
node scripts/desenho/java.mjs             # as ilustrações da série Java (padrão fixo, D17)
node scripts/desenho/tags.mjs [slug]      # os ícones das tags (src/livros/tags/, D52)
node scripts/marca.mjs                    # a marca e os ícones do navegador (precisa do pdftocairo)
node scripts/caveat-titulos.mjs           # a Caveat dos títulos à mão (título novo em src/data/mao.ts, C05)
```

A porta 4321 desta máquina está ocupada por outra ferramenta do Cesar, que não deve ser tocada. O
Astro usa a próxima livre (4322). Só no dev: `/amostra/` (tokens, fontes, avisos),
`/amostra/markdown/` e `/amostra/mdx/` (recursos de Markdown e de MDX, de `src/amostra/`), `/amostra/caneta/` (os 20
tipos da caneta, de `src/amostra/caneta.md`), `/amostra/desenhos/` e
`/amostra/livros/` (as capas planas, para comparar com `docs/capas/referencia/`) e `/amostra/tags/`
(os ícones das tags, lado a lado e da pílula à marca d'água).

Medição da busca (D2): `scripts/bench-busca/` (construir, conferir, medir), com o dev parado.

## Mapa das pastas

"(planejado)" marca o que ainda não existe. Atualize quando mudar.

```
DESIGN.md                sistema visual (fonte de verdade do visual, formato DESIGN.md do Google)
CLAUDE-CODE.md           análise de 28/09/2026: a configuração do Claude Code, os recursos de post e as
                         sugestões de melhoria ainda por decidir
PRODUCT.md               registro de produto do Impeccable (leitor, propósito, diferenciais); o
                         briefing vence em caso de divergência
.impeccable/config.json  ajustes do Impeccable ("buildPath": "code")
entrada/                 posts trazidos para adaptar (fora do git)
docs/briefing.md         decisões de produto e design (fonte da verdade)
docs/estado.md           painel: fase, pronto, próximos passos, perguntas
docs/decisoes.md         registro de decisões (data, decisão, motivo, alternativas)
docs/estilo-desenho.md   estilo das ilustrações e das lousas
docs/marcacoes.md        guia vivo da caneta do caderno: 20 tipos, limites, tela, ajustes do Cesar (D48)
docs/capas/              a regra dos livros (CAPAS.md) e as imagens de referência
src/livros/              o que o site lê dos livros (D53): livros.json, cores.js, grao.svg, desenhos/,
                         icones/, serie/ e tags/ (um ícone por tag, D52)
docs/historico/          rodadas fechadas: o prompt da Fase 0, os controles da D46/D47 e ajustes-d52/
                         (controle, regras dos agentes, diagnósticos, pesquisa e sugestões da D52)
docs/virada.md           plano para o domínio passar ao blog novo (só com OK do Cesar)
docs/referencias/        protótipos aprovados
src/content/posts/       posts; nome do arquivo = slug da URL
src/data/                taxonomia e series (leem docs/capas), java, decks (apresentações), site
                         (autor, perfis e textos), mao (os títulos à mão da papelaria, C05)
src/amostra/             o conteúdo das páginas /amostra/ (recursos.md, recursos.mdx, caneta.md)
src/styles/tokens.ts     cores dos dois temas: fonte única, gera as variáveis CSS (D4)
src/styles/              base (folha, painel, transição de página), fontes, avisos, prosa, artigo (grade,
                         notas), paginas, estante e livro (lombada, livro 3D e capa), desenho
                         (ilustrações), lousa, caneta (marcações, D48), traco (traços à caneta, C04),
                         visor, contador e copiado (D49)
src/assets/              caveat-titulos.woff: a Caveat 600 só com as letras dos títulos à mão (C05)
src/layouts/Base.astro   head, anti-piscada, cabeçalho, rodapé e busca
src/components/          peças das páginas (estante, gaveta, sumário, avisos, busca…)
src/pages/               rotas; a home é [...page].astro (paginada, D27); livros/[slug].svg (desenho
                         da capa, que a gaveta busca ao abrir o livro, D30);
                         posts/[slug]/apresentacao.pdf.ts (PDF) e og/[slug] (imagem, D10)
src/plugins/             Markdown: avisos, notas laterais, apresentação, tabelas, matemática e a
                         caneta (marcacoes.mjs, D48)
src/lib/                 posts, formatos, busca (Pagefind), código (Expressive Code), PDF, estante
                         (livros), livros-svg (desenhos e ícones), livro-3d (medidas do livro aberto),
                         marca (traçado da marca, gerado), caderno (miolo do caderno "cs", D52),
                         tags-svg (ícones das tags, D52), traco (traços e ícones à caneta: menu,
                         colchete, círculo, rasura, ondinha, ícones de data, tempo, código, lupa, lua,
                         sol, contornos dos botões e a assinatura, D52, C04)
src/scripts/artigo.ts    interações do artigo (barra, sumário, notas, visor, apresentação)
src/scripts/tema.ts      tema: o botão do cabeçalho alterna claro e escuro (D39)
scripts/                 contraste, links, apresentacao, og, copiar-katex, desenho/, bench-busca/,
                         marca, caveat-titulos (subconjunto da Caveat, C05), verificar-ambiente
                         (npm run setup e hook do início da sessão)
public/posts/<slug>/     diagramas antigos e slides das apresentações (deck/)
src/ilustracoes/         uma ilustração SVG por post (<slug>.svg), com os recortes na raiz (D11)
src/lousas/<slug>/       desenhos das lousas de cada post .mdx
.github/workflows/       deploy no GitHub Pages (a cada push na main, D34)
.claude/skills/          procedimentos (carregados sob demanda); as de terceiros são cópias lidas
.claude/agents/          subagentes do Impeccable
.claude/revisao-posts.md lista e status da revisão em lote dos posts
.mcp.json                MCPs do projeto (astro-docs, chrome-devtools)
.claude/rules/           regras por caminho (posts, desenhos)
```

## Skills

- `post`: todo post, nos modos Novo e Adaptar, com o checklist único e a revisão em lote
  (`.claude/revisao-posts.md`)
- `desenho`: a ilustração de cada post (o que desenhar, regras técnicas, recortes, validação)
- `lousa`: diagramas na lousa (linha do tempo de arrastar, também para passos, e animação curta em
  loop) e frase em destaque
- `caneta`: a passada de caneta num post (a última etapa da skill `post`, ou sozinha: "passa a caneta
  no post X"), pelo guia `docs/marcacoes.md`
- `apresentacao`: PowerPoint do NotebookLM → slides WebP e PDF
- `serie-java`: série "Atualizações do Java" (só LTS)
- De terceiros, lidas antes de instalar (D35): `impeccable` (revisão de design; o motor fica em
  `~/.impeccable`), `gsap-*` (animações), `web-quality-audit`, `accessibility`, `performance`,
  `core-web-vitals`, `seo` e `best-practices`. Atualizar = ler a versão nova antes.
- MCPs do projeto (`.mcp.json`): `astro-docs` (documentação do Astro) e `chrome-devtools`
  (`chrome-devtools-mcp@1.10.1`, sem telemetria), usados na conferência dos posts.

## Em outro computador

- **Instalar à mão:** Node 22.12 ou mais novo (o Astro 7 exige; o projeto usa o 24, `.node-version`),
  o Google Chrome e o Claude Code. O `pdftocairo` (poppler) só para regerar a marca.
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
- Em `.astro`, uma quebra de linha colada a um elemento embutido (antes ou depois) some por inteiro:
  "mim e" + `<strong>` vira "mim ea". Mantenha o elemento na mesma linha das palavras vizinhas.
- Antes de commitar (quando pedido): `git status --untracked-files=all`, e nada com " 2" no nome.
- Deploy preso na fila: cancelar e reexecutar o workflow (o `gh` está instalado nesta máquina).
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
- Suba o dev com `npm run dev -- --host 127.0.0.1`. Sem isso ele escuta só em `localhost` (IPv6), e o
  endereço <http://127.0.0.1:4322> que o Cesar usa não abre.
- O cabeçalho é fixo (D31): peça nova com `position: sticky` ou âncora que role até o topo precisa
  descontar `--altura-topo` (base.css), senão fica escondida atrás dele.
- Instalar dependência com o dev no ar faz o Vite reiniciar, e componentes editados nesse meio-tempo
  podem ficar com o CSS velho: salve-os de novo (um `touch` basta). O mesmo acontece quando um script
  reescreve o arquivo inteiro (Write ou `writeFileSync`): se o CSS novo não aparecer, `touch` no
  arquivo ou reinicie o dev antes de concluir que a regra está errada.
- O CSS com escopo do Astro põe um atributo em **cada parte** do seletor, e isso soma especificidade:
  `.menu button span` (três partes) vence `.menu .chave` (duas), mesmo vindo antes. Estado de um
  elemento dentro de outro (aria-checked, aria-current) precisa de um seletor pelo menos tão longo
  quanto o da regra de base (D33).
- No bash do Claude, `node -e '…'` quebra com apóstrofo no texto ("d'água"): escreva o script num
  arquivo do scratchpad e rode o arquivo.
- Campo novo no esquema do conteúdo (`content.config.ts`): o dev já aberto não relê sozinho e
  descarta o campo até reiniciar. Sem tirar o dev principal do ar, suba por uns segundos um segundo
  dev noutra porta (`--ignore-lock`), que refaz o armazenamento de conteúdo com o esquema novo, e
  pare-o (D52, C03).
- No primeiro quadro de uma página nova (View Transition entre documentos), nenhuma fonte está
  carregada (`document.fonts` todas `unloaded` no `pagereveal`): título, capas e menu aparecem na
  fonte de reserva por um instante. No GSAP, `power2` é uma curva cúbica (`power1` é a quadrática), o
  que muda a conta ao emendar uma curva na outra (D52, B01 e B09).
- O Chrome não pinta um elemento com `view-transition-name` dentro de um pai com opacidade 0: ele só
  aparece de repente quando o pai volta a 1. Para animar o elemento chegando, tire o nome dele (ou do
  pai) enquanto a opacidade estiver em zero, e devolva depois (D52, revisão de acabamento das
  animações).
- O `clearProps: "all"` do GSAP apaga o `style` inline **inteiro** do elemento, inclusive o que não
  foi o próprio GSAP quem pôs ali (cores e medidas em variáveis CSS escritas no HTML, por exemplo):
  passe a lista das propriedades que a animação de fato mexeu, nunca `"all"` num elemento com estilo
  próprio (D52, revisão 10b: `clearProps: "all"` no `pageshow` apagava o estilo das lombadas da pilha).
