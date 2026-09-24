# Blog de Cesar Schutz

Blog técnico pessoal de **Cesar Schutz**, arquiteto de soluções, em **pt-BR**. Domínio final:
<https://cesarschutz.com.br> (GitHub Pages). É **só um blog**: artigos, categorias, tags, séries,
busca e RSS. O blog antigo continua no ar até a troca do domínio, que só acontece com o OK do Cesar.

As decisões de produto e design estão em `docs/briefing.md`, que é a fonte da verdade. Não reabra o
que está marcado como **decidido** sem perguntar. O que for decidido aqui vai para `docs/decisoes.md`.

**Ao começar uma sessão, leia `docs/estado.md`. Ao terminar um bloco de trabalho, atualize-o.**

Modo de trabalho combinado em 23/09/2026: seguir as fases do briefing **sem parar** para aprovação
(atualizando o `docs/estado.md` ao fechar cada uma) e deixar o site rodando **só na máquina**, para o
Cesar acompanhar. Ele revisa tudo no fim.

## Regras que valem sempre

- Tudo em pt-BR, com acentuação correta. Identificadores de código podem ficar em inglês.
- **Nunca** commitar, dar push, criar repositório ou publicar sem pedido explícito do Cesar.
- `../blog-atual` é **somente leitura**. Pode ler à vontade, mas nunca editar, instalar, buildar nem
  rodar git que escreva lá (use `git --no-optional-locks`). Para rodar algo dele, copie para o scratchpad.
  O `.claude/settings.json` bloqueia a edição de arquivos lá, mas não cobre comandos no terminal.
  Um `git status` comum já regrava o `.git/index` de lá. Ao delegar para subagentes, repasse essa regra.
- Antes de instalar qualquer biblioteca, proponha e espere o OK. Registre a decisão em `docs/decisoes.md`.
- Cores só por tokens CSS (`var(--ink)`, `var(--cat)`…). Nada de hex solto em componente ou SVG.
- Toda animação respeita `prefers-reduced-motion`: com ele ligado, tudo aparece no estado final,
  sem prender a tela.
- JavaScript só onde há interação (estante, busca, lousas, apresentação, lista/cards, tema).
  Artigo sem esses componentes funciona sem JS.
- Fontes servidas pelo próprio site (`@fontsource`). Nunca Google Fonts nem CDN em produção.
- Não pode parecer feito por IA: nada de fonte genérica, gradiente decorativo, sombra genérica em
  tudo, animação de entrada em cada seção, rótulo em caixa alta ou emoji.
- Os protótipos em `docs/referencias/` mostram aparência e comportamento, mas não são código para
  copiar. Onde divergirem do briefing, vale o briefing.
- O caminho do projeto tem espaço (`novo site`): use aspas em todo comando e script.
- Se o Cesar corrigir a mesma coisa duas vezes, isso vira regra no lugar certo (skill, `.claude/rules/` ou aqui).

## URLs que não podem quebrar

- `/posts/<slug>/`, com as mesmas âncoras de título de hoje (ids no estilo github-slugger, com acento)
- `/archive/`, `/categories/`, `/tags/`, `/series/`, `/java/`, `/rss.xml`, `/og/<slug>.png` e
  `/sitemap-index.xml`
- `/categories/<Nome>/` e `/tags/<Nome>/` com o **nome cru** na URL (maiúsculas, acentos e espaços)
- Redirecionamentos: `/posts/java-NN/` → `/posts/java-<LTS>/#java-NN` (vindo de `ABSORBED`),
  `/about/` → `/sobre/`, `/projects/` → `/`, `/exercicios` → `/` e `/2/` e `/3/` → `/archive/`

Detalhes e casos especiais estão em `docs/decisoes.md` (D7).

## Stack

Aprovada em 23/09/2026. Detalhes em `docs/decisoes.md`.

- Astro 7, site estático, com TypeScript 6 estrito (o `astro check` ainda não aceita o TS 7)
- Posts em Markdown (`.md`). `.mdx` só quando o post usa componente (lousa)
- Expressive Code para código (título, linhas destacadas, diff, Copiar). KaTeX só em post com fórmula
- CSS próprio com tokens, sem Tailwind e sem framework de UI
- Fontes: Besley (títulos), Literata com `opsz` (texto), JetBrains Mono (código)
- Busca com Pagefind e interface própria (D2, por medição): índice gerado no `postbuild`
- Node 24 (`.node-version`, instalado pelo fnm) e npm
- Por enquanto tudo roda só na máquina, sem pré-visualização publicada (D13). O deploy final será por
  GitHub Actions no GitHub Pages

## Comandos

Sempre com o Node 24: `fnm exec --using=24 <comando>`.

```bash
npm run dev          # o Astro 7 sobe o servidor em segundo plano e mostra o endereço
npx astro dev stop   # para o servidor (também: astro dev status, astro dev logs)
npm run build        # dist/; no postbuild, as imagens /og/*.png (Chrome, D10) e o índice do Pagefind
npm run check        # astro check: 0 erros antes de mostrar qualquer coisa ao Cesar
npm run preview      # serve o dist/; é onde a busca funciona (no dev não há índice)
npm run contraste    # contraste dos tokens (D22); falha se texto ficar abaixo do mínimo
npm run links        # confere links internos, âncoras e redirecionamentos do dist/
npm run apresentacao -- <slug> --pptx <arquivo> --titulo "…"   # slides do NotebookLM
node scripts/desenho/validar.mjs [slug]   # regras da ilustração e das lousas
node scripts/desenho/centrar.mjs <slug>   # centra os recortes no desenho (dev no ar)
node scripts/desenho/render.mjs [slug]    # folha da ilustração, claro e escuro (dev no ar)
node scripts/desenho/java.mjs             # as ilustrações da série Java (padrão fixo, D17)
```

A porta 4321 desta máquina está ocupada por outra ferramenta do Cesar, que não deve ser tocada. O
Astro usa a próxima livre (4322). Só no dev: `/amostra/` (tokens, fontes, avisos),
`/amostra/markdown/` (recursos de Markdown, de `src/amostra/recursos.md`) e `/amostra/desenhos/`.

Medição da busca (D2): `scripts/bench-busca/` (construir, conferir, medir), com o dev parado.

## Mapa das pastas

"(planejado)" marca o que ainda não existe. Atualize quando mudar.

```
docs/briefing.md         decisões de produto e design (fonte da verdade)
docs/estado.md           painel: fase, pronto, próximos passos, perguntas
docs/decisoes.md         registro de decisões (data, decisão, motivo, alternativas)
docs/estilo-desenho.md   estilo das ilustrações e das lousas
docs/virada.md           plano para o domínio passar ao blog novo (só com OK do Cesar)
docs/referencias/        protótipos aprovados
src/content/posts/       posts; nome do arquivo = slug da URL
src/data/                taxonomia (categorias e cores), series, java, decks (apresentações), site
src/styles/tokens.ts     cores dos dois temas: fonte única, gera as variáveis CSS (D4)
src/styles/              base, fontes, avisos, prosa, artigo (notas, apresentação, visor), estante
src/layouts/Base.astro   head, anti-piscada, cabeçalho, rodapé e busca
src/components/          peças das páginas (estante, gaveta, sumário, avisos, busca…)
src/pages/               rotas; posts/[slug]/apresentacao.pdf.ts (PDF) e og/[slug] (imagem, D10)
src/plugins/             Markdown: avisos, notas laterais, apresentação, tabelas, matemática
src/lib/                 posts, formatos, busca (Pagefind), código (Expressive Code), PDF
src/scripts/artigo.ts    interações do artigo (barra, sumário, notas, visor, apresentação)
scripts/                 contraste, links, apresentacao, og, copiar-katex, desenho/, bench-busca/
public/posts/<slug>/     diagramas antigos e slides das apresentações (deck/)
src/ilustracoes/         uma ilustração SVG por post (<slug>.svg), com os recortes na raiz (D11)
src/lousas/<slug>/       desenhos das lousas de cada post .mdx
.github/workflows/       deploy no GitHub Pages (preparado; roda só depois da virada)
.claude/skills/          procedimentos (carregados sob demanda)
.claude/rules/           regras por caminho (posts, desenhos)
```

## Skills

- `novo-post`: criar, reescrever, revisar ou migrar um artigo (fluxo e checklist)
- `desenho`: a ilustração de cada post (o que desenhar, regras técnicas, recortes, validação)
- `lousa`: diagramas na lousa (passo a passo, linha do tempo, loop) e frase em destaque
- `apresentacao`: PowerPoint do NotebookLM → slides WebP e PDF
- `serie-java`: série "Atualizações do Java" (só LTS)

## Armadilhas do ambiente

- O macOS não diferencia maiúsculas e o Linux do CI diferencia. Renomear só a caixa de um arquivo
  exige `git mv` em dois passos.
- `$` em texto de post precisa de escape (`US\$ 10`). Sem isso, dois `$` na mesma frase viram fórmula.
- O espaço entre dois `<tspan>` some ao embutir o SVG: use `&#160;`.
- Em `.astro`, uma quebra de linha colada a um elemento embutido (antes ou depois) some por inteiro:
  "mim e" + `<strong>` vira "mim ea". Mantenha o elemento na mesma linha das palavras vizinhas.
- Antes de commitar (quando pedido): `git status --untracked-files=all`, e nada com " 2" no nome.
- Deploy preso na fila: cancelar e reexecutar o workflow (o `gh` está instalado nesta máquina).
- O shell do Claude é bash, e o fnm só está configurado no zsh: aqui, `node` é o 25 do Homebrew.
  Rode tudo do projeto com o Node 24: `fnm exec --using=24 npm run dev` (vale para npm, npx e node).
