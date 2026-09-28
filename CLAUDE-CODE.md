# Configuração do Claude Code neste projeto

Análise de 28/09/2026, em três partes:

1. [Como o Claude Code está configurado](#camadas): camadas, hooks, regras, skills, agentes, MCPs e
   memória.
2. [Os recursos de escrita de post](#recursos-de-escrita-de-post): o que existe, onde está
   configurado e quando usar.
3. [Sugestões de melhoria](#sugestões-de-melhoria): o que ficou para decidir.

A configuração vale só quando o Claude Code é usado no projeto. Nada disto vai para o site publicado.

O Claude Code não "usa" o GSAP. O GSAP é uma biblioteca JavaScript do site (está no `package.json`) e
roda no navegador do leitor. O que está configurado no Claude são manuais (skills) que o ensinam a
escrever código GSAP do jeito certo. Vale o mesmo para o Impeccable, o SEO e as outras skills.

## Camadas

| Camada | Onde fica | O que faz |
|---|---|---|
| Global (todos os projetos) | `~/.claude/CLAUDE.md` e os hooks do Segundo Cérebro | Injeta as notas do cofre Obsidian antes de cada pedido e obriga o registro no cofre no fim. As preferências gerais do Cesar (nunca commitar sem pedir etc.) vêm daí. |
| Instruções do projeto | `CLAUDE.md` | Lido em toda sessão: regras (pt-BR, tokens, JS só onde há interação, nada com cara de IA), URLs que não podem quebrar, stack, comandos, mapa de pastas e armadilhas do ambiente. |
| Settings | `.claude/settings.json` | Bloqueia a edição do `../blog-atual`, desliga a telemetria, habilita os dois MCPs e define três hooks. |
| Settings pessoais | `.claude/settings.local.json` (fora do git) | Permissões desta máquina. |
| Regras por caminho | `.claude/rules/` | Só carregam quando o Claude abre certos arquivos. |
| Skills | `.claude/skills/` | Manuais carregados sob demanda: 6 próprias e 15 de terceiros. |
| Subagentes | `.claude/agents/` | Os 4 do Impeccable. |
| MCPs | `.mcp.json` | Servidores de ferramentas: `astro-docs` e `chrome-devtools`. |
| Memória automática | `~/.claude/projects/…/memory/` | Notas sobre como trabalhar neste projeto. |

## Hooks (`.claude/settings.json`)

Comandos que o Claude Code roda sozinho, sem o Claude decidir.

| Hook | Quando | O que roda |
|---|---|---|
| `SessionStart` | início de cada sessão | `scripts/verificar-ambiente.mjs --hook`: confere Node, dependências, skills, Chrome e o motor do Impeccable. Resposta "Ambiente OK" ou a lista do que falta. |
| `PostToolUse` (`Edit\|Write`) | a cada arquivo editado | o detector do Impeccable no arquivo alterado. |
| `Stop` | fim de cada resposta | o "Design deep pass" do Impeccable. |

Variáveis de ambiente: `DO_NOT_TRACK`, `IMPECCABLE_NO_TELEMETRY` e `DISABLE_TELEMETRY`.

Permissão negada: `Edit` em `../blog-atual/**`. A regra não cobre comandos no terminal. Por isso o
`CLAUDE.md` manda usar `git --no-optional-locks` lá.

## Regras por caminho (`.claude/rules/`)

| Arquivo | Vale para | Conteúdo |
|---|---|---|
| `posts.md` | `src/content/posts/**/*.{md,mdx}` | Tamanho, veracidade e `## Fontes`, frontmatter, categoria, escape de `$`. Aponta para a skill `post`. |
| `desenho.md` | `src/ilustracoes/**` e `src/lousas/**` | O que é proibido no SVG (cor fixa, `style=`, `id`, `<defs>`, degradê, sombra). Aponta para as skills `desenho` e `lousa`. |

## Skills

### Próprias

| Skill | Para quê |
|---|---|
| `post` | Processo único de todo post, com checklist de 10 passos, nos modos Novo e Adaptar, e a revisão em lote (`.claude/revisao-posts.md`). |
| `caneta` | As marcações à caneta: última etapa do post, só com o OK do Cesar, pelo guia `docs/marcacoes.md`. |
| `desenho` | A ilustração de cada post: o que desenhar, regras técnicas, recortes e validação. |
| `lousa` | Os diagramas animados (`LousaLoop`, `LousaTempo`) e a frase em destaque. |
| `apresentacao` | O PowerPoint do NotebookLM vira slides WebP e o PDF do post. |
| `serie-java` | As regras da série Atualizações do Java (só LTS). |

### De terceiros

Lidas antes de instalar (D35) e travadas por hash no `skills-lock.json`.

| Skill | Origem | Para quê |
|---|---|---|
| `impeccable` | Impeccable | Revisor de design (`polish`, `audit`, `critique`…), com motor próprio em `~/.impeccable`. O `DESIGN.md` vence sempre: "go all out", redesign e troca do `DESIGN.md` não valem aqui. |
| `gsap-core`, `gsap-timeline`, `gsap-plugins`, `gsap-performance`, `gsap-utils`, `gsap-scrolltrigger`, `gsap-react`, `gsap-frameworks` | `greensock/gsap-skills` | Os manuais oficiais do GSAP. As três últimas não se aplicam hoje (sem ScrollTrigger desde a D46; o site não usa React nem Vue). |
| `web-quality-audit`, `accessibility`, `performance`, `core-web-vitals`, `seo`, `best-practices` | `addyosmani/web-quality-skills` | Auditorias de qualidade web. |

## Subagentes (`.claude/agents/`)

Os quatro são do Impeccable e só entram dentro do fluxo dele.

| Agente | Papel |
|---|---|
| `impeccable-finish-reviewer` | Revisa o acabamento contra a direção aprovada e lista as correções. |
| `impeccable-documenter` | Registra o `DESIGN.md` a partir do que foi construído. |
| `impeccable-asset-producer` | Produz imagens a partir de referências aprovadas. |
| `impeccable-manual-edit-applier` | Aplica as edições de texto feitas no modo live. |

## MCPs (`.mcp.json`)

| Servidor | O que dá ao Claude |
|---|---|
| `astro-docs` | A documentação oficial do Astro (HTTP). |
| `chrome-devtools` | Um Chrome controlado para conferir tela, console, rede e performance (`chrome-devtools-mcp@1.10.1`, sem telemetria). É o único navegador para conferir o blog, sempre numa aba isolada. |

## Documentos que as skills mandam ler

Não são configuração do Claude Code, mas guiam o que ele faz.

| Documento | Papel |
|---|---|
| `DESIGN.md` | Fonte de verdade do visual. Vence qualquer ferramenta. |
| `PRODUCT.md` | Leitor, propósito e diferenciais, para o Impeccable. O briefing vence em caso de divergência. |
| `docs/briefing.md` | Decisões de produto e design (fonte da verdade). |
| `docs/decisoes.md` | Registro das decisões D1 a D52 (data, decisão, motivo). |
| `docs/estado.md` | Painel: fase, próximos passos, perguntas abertas. Lido no início da sessão. |
| `docs/marcacoes.md` | Guia vivo da caneta, com os ajustes do Cesar. |
| `docs/estilo-desenho.md` | Estilo das ilustrações e das lousas. |
| `docs/capas/CAPAS.md` | Livros, séries e ícones das tags. |
| `.claude/revisao-posts.md` | Lista e status da revisão em lote dos posts. |
| `.impeccable/config.json` | Ajustes do Impeccable e as exceções decididas pelo Cesar. |

## Memória automática

| Nota | Conteúdo |
|---|---|
| Navegador para páginas locais | O blog só pelo `chrome-devtools`, em aba isolada. |
| Preview sempre atualizado | Rebuild e reinício do preview na 4323 após cada mudança visível. |
| Animação quadro a quadro | Trace com screenshots e PIL para achar tremor e piscada. |
| Listas grandes com agentes | Controle em `docs/ajustes-dNN/`, commit por item, agentes em paralelo; ao fechar, controle para `docs/historico/`. |

## Recursos de escrita de post

Todos os recursos aparecem juntos no dev, em `/amostra/markdown/`, `/amostra/mdx/` e
`/amostra/caneta/`. O post de referência, com ilustração, as três lousas, a frase em destaque e a
caneta, é `/posts/cobranca-duplicada-no-retry/` ("Chave de idempotência").

### Visão geral

| Recurso | Onde está configurado | Quando usar |
|---|---|---|
| Caneta azul (20 tipos) | skill `caneta`, guia `docs/marcacoes.md`, plugin `src/plugins/marcacoes.mjs`, `src/styles/caneta.css` | Última etapa de todo post, depois de texto, desenhos e animações aprovados. |
| Marca-texto amarelo | é o tipo 1 da caneta (`:marca[…]`) | O essencial do post: a premissa ou a regra que o resume. No máximo 2. |
| Ilustração do post | skill `desenho`, `docs/estilo-desenho.md`, `src/ilustracoes/<slug>.svg` | Sempre, uma por post. |
| Lousas animadas | skill `lousa`, `LousaLoop` e `LousaTempo`, desenhos em `src/lousas/<slug>/` | Só onde há fluxo: sequência, passo a passo, antes e depois, linha do tempo. |
| Frase em destaque | `FraseDestaque` (skill `lousa`) | Rara: uma frase curta que merece ser lida duas vezes. |
| Avisos | `> [!DICA]`, `NOTA`, `IMPORTANTE`, `ATENCAO`, `CUIDADO` (`rehype-avisos.mjs`) | Alerta, dica ou ressalva que sai do fluxo do texto. |
| Notas laterais | nota de rodapé comum (`texto[^chave]`), `rehype-notas-laterais.mjs` | Comentário curto ao lado do parágrafo. Só parágrafos. |
| Código | Expressive Code: `title`, linhas `{3-5}`, `ins`/`del`, `showLineNumbers`, `collapse` | Todo bloco de código. O código é testado (rodado) antes de publicar. |
| Fórmulas | KaTeX (`$…$`, `$$…$$`) | Só em post com fórmula. `$` de texto precisa de escape (`US\$ 10`). |
| Imagens | Markdown comum, com `alt` descritivo; abrem no visor ao clicar | Print ou foto que é evidência (um erro no console, um painel real). O resto vira desenho. |
| Apresentação | skill `apresentacao`, `src/data/decks.json`, `public/posts/<slug>/deck/` | Quando o Cesar traz o `.pptx` do NotebookLM. A seção entra sozinha antes de `## Fontes`. |
| Código do artigo no GitHub | campo `codigo` no frontmatter | Quando o código está no repositório `blog-exemplos`, numa pasta com o nome do slug. |
| Ícone de tag | `scripts/desenho/tags.mjs`, `src/livros/tags/<slug>.svg` | Toda tag nova. Sem o ícone, o build quebra. |
| Animação GSAP sob medida | skill `post` (passo 6) e as skills `gsap-*` | Só quando nenhuma lousa serve. Com play/pause, importada só no post que a usa. |

### Caneta azul

- As marcações são **estáticas**: já vêm feitas, nada se desenha ao rolar. A caneta é azul em todos
  os livros e nunca pinta o texto. Só os traços e as notas à mão ficam azuis.
- Os 20 tipos: marca-texto, ondulado, círculo, colchete na margem, sublinhado duplo, caixa à mão, nota
  na margem, riscado com correção, asterisco, certo e errado, números circulados, chave agrupando,
  riscado simples, seta ligando, exclamação, interrogação com nota, sinal ≠, anotação no código,
  linhas marcadas no código e comentário do autor.
- O tipo é escolhido **pelo papel no texto**, nunca por rodízio. Exemplos: ondulado para a palavra que
  muda o sentido, círculo para o número que costuma ser confundido, exclamação para a armadilha que
  derruba produção.
- **Processo (skill `caneta`):**
  1. Ler o guia inteiro, inclusive os "Ajustes do Cesar".
  2. Ler o post inteiro.
  3. Propor uma tabela (seção, trecho, tipo, motivo) e esperar o OK.
  4. Aplicar sem mudar nenhuma palavra do texto.
  5. Testar em 320, 390, 768, 1280 e 1600px, nos dois temas.
  6. Entregar o relatório e atualizar a coluna "Caneta" do `.claude/revisao-posts.md`.
- **Limites (o build recusa o que passar):** de 6 a 12 por post, marca-texto no máximo 2, o mesmo tipo
  no máximo 3, nunca duas marcações no mesmo parágrafo, nada em títulos, trecho sem quebra de até 32
  caracteres, notas de até 40.
- O comentário do autor só entra com uma frase escrita ou aprovada pelo Cesar.
- Não se marca: aviso, nota lateral, frase em destaque, lousa, legenda e tabela de referência.
- Situação: só os pilotos (`cobranca-duplicada-no-retry` e `jwt-estrutura-e-campos`) estão marcados.

### Ilustração do post (a "capa")

- Cada post tem **uma** ilustração, que serve de capa em todos os lugares. Não existe um desenho de
  capa separado. A ilustração declara recortes:

  | Recorte | Proporção | Onde aparece |
  |---|---|---|
  | `largo` | 1100:468 | topo do artigo no computador, com as anotações |
  | `medio` | 3:2 | destaque, cards e topo no celular |
  | `quadrado` | 1:1 | miniatura da lista |
  | `og` | livre | imagem de compartilhamento (1200×630) |
  | `segura` | — | a área que cabe em todos; o protagonista fica dentro dela |

- As capas de livro são das **categorias** (`docs/capas/CAPAS.md`), não dos posts.
- **Estilo "A + C"**, dos protótipos em `docs/referencias/`. Não é ByteByteGo: não há nenhuma menção a
  ele no projeto.
  - Traço de caneta com leve tremor (filtro SVG global).
  - Hachura a 45° para sombra.
  - Linha fantasma (traço e ponto) para o que não acontece.
  - Uma cor só, a do livro, um pouco fora do registro.
  - O desenho fica num painel tingido pela cor da categoria.
- **Regras técnicas:** só classes e variáveis CSS; nada de cor fixa, `style=`, `id`, `<defs>`,
  `<image>`, degradê, sombra ou fonte de letra de mão.
- **O que desenhar:** um protagonista e de 2 a 4 elementos de apoio, ligados entre si. Tem de ser
  algo concreto do artigo, reconhecível em um segundo e legível na miniatura. Se o desenho serviria
  para outro artigo, está errado.
- **Validação:** `validar.mjs` (regras), `centrar.mjs` (recortes justos no desenho) e `render.mjs`
  (folha em PNG, claro e escuro, também em `/amostra/desenhos/?slug=<slug>`).
- A série Java não é desenhada à mão: sai de `node scripts/desenho/java.mjs`.
- No destaque da home e no topo do artigo, o desenho "se desenha" sozinho ao aparecer (D41, D51). Isso
  vem do site, não é configurado no post.

### Lousas animadas

As "três animações" são dois componentes. Post com lousa é `.mdx`.

| Uso | Componente | Como se comporta | Quando usar |
|---|---|---|---|
| O "videozinho" | `LousaLoop` | Anda sozinho quando aparece na tela, com Recomeçar e Pausar, uma barra de tempo com os eventos e uma pausa no fim. | Um evento curto que se repete: o problema acontecendo. No exemplo, a resposta se perde e o app reenvia. |
| Passos | `LousaTempo` com `passos.svg` | Começa parado. Com play ou arrastando, a caneta risca "1 de 5, 2 de 5…". A lista numerada dos passos fica logo abaixo, como texto do diagrama. | Uma sequência em que a ordem importa. É a antiga lousa de passos, que desenhava com a rolagem e virou esta na D46 (ficava pequena, com o texto passando ao lado). |
| Linha do tempo | `LousaTempo` com `tempo.svg` | O mesmo controle deslizante, com duas linhas lado a lado. | Comparar antes e depois, ou "com e sem", ao longo do tempo. |

- **Comportamento comum:** a caneta fica na ponta do traço e assume a cor do que desenha. Com
  `prefers-reduced-motion`, o desenho aparece completo e parado. Sem JavaScript também. Controles por
  teclado, texto em `aria-live`.
- **Desenho:** `src/lousas/<slug>/<nome>.svg`, viewBox de referência 560×430. O tempo de cada parte
  fica no próprio elemento (`data-traco`, `data-escrita`, `data-revela`, `data-aparece`,
  `data-some`, `data-esmaece`, `data-desloca`), de 0 a 1.
- **Estilo "Invertida, canetinha":** vidro escuro na página clara e quadro branco na página escura.
- **Nunca volta:** a lousa comandada pela rolagem saiu na D46, a pedido do Cesar.
- **Frase em destaque** (`FraseDestaque`): as palavras acendem com a rolagem. É o único recurso de
  post ligado à rolagem. Rara.

### O que o processo cobra (skill `post`)

1. Ler as regras: `DESIGN.md`, `CLAUDE.md`, `docs/estilo-desenho.md`.
2. **Plano, antes de mexer em arquivo, com o OK do Cesar:** livro ou série, tags (2 a 4), slug,
   inventário visual (cada imagem existente é redesenhada, vira lousa ou sai), a ilustração e onde
   entram as animações. No modo Adaptar, as sugestões de conteúdo vêm separadas.
3. **Texto:** no modo Novo, de 1.500 a 2.500 palavras. No modo Adaptar, o texto e a voz do Cesar
   ficam. Nada sem fonte conferida, código testado e `## Fontes` no fim.
4. Frontmatter completo e `draft: true` até o OK.
5. Desenhos (skills `desenho` e `lousa`).
6. Animações (só onde há fluxo).
7. Conferência no `chrome-devtools`: 1440 e 390px, dois temas, console limpo, movimento reduzido e
   trace de performance.
8. Qualidade: Impeccable até zero achados, `web-quality-audit`, `check`, `build`, `links`,
   `contraste`.
9. Caneta.
10. Relatório final.

## Sugestões de melhoria

Levantadas na análise de 28/09/2026, para o Cesar decidir. As já feitas estão no fim.

### Configuração do Claude Code

1. **CLAUDE.md mais enxuto.** São cerca de 310 linhas, lidas em toda sessão (a meta da Fase 0 era menos
   de 150). A lista de "onde pode JavaScript" tem 15 linhas de exceções. A seção dos livros e o
   histórico das frases de autores poderiam morar no `DESIGN.md` e no `CAPAS.md`, ficando no
   CLAUDE.md só as regras e os ponteiros.
2. **Hooks do Impeccable mais estreitos.** O detector roda a cada Edit/Write, até em `.md` e scripts,
   e o "Design deep pass" roda no fim de toda resposta. Limitar a `src/components`, `src/styles` e
   `src/pages` e rever o de fim de resposta.
3. **Remover as skills que não se aplicam:** `gsap-react` e `gsap-frameworks` (o site é Astro sem
   framework) e `gsap-scrolltrigger` (o ScrollTrigger saiu). Elas poluem a lista e podem induzir erro.
4. **Uma regra por caminho para interface** (`.claude/rules/interface.md`, para `src/components/**`,
   `src/styles/**` e `src/scripts/**`). As armadilhas de layout estão espalhadas entre o CLAUDE.md, a
   memória e o Segundo Cérebro:
   - sticky e âncoras descontando `--altura-topo`;
   - `clearProps` do GSAP;
   - especificidade do CSS com escopo;
   - movimento reduzido;
   - rebuild do preview na 4323.
5. **Três lugares de registro competindo:** docs do projeto, memória automática e Segundo Cérebro.
   Definir que as regras do projeto moram só nos docs, e que a memória e o cérebro guardam o "como
   trabalhar".
6. **`.claude/settings.local.json` com permissões velhas** (`java -version`, `~/.m2`, um `git diff`
   específico). Trocar por permissões úteis, como os comandos `fnm exec --using=24 npm run …`, para
   reduzir as perguntas de permissão.

### Criação de posts

7. **Guia de "qual recurso para qual conteúdo"** na skill `post`: quando usar loop, passos, linha do
   tempo, frase, aviso, nota lateral ou caneta. Hoje está espalhado em três skills.
8. **Script de conferência de post** (`npm run conferir <slug>`): larguras, temas, console, rolagem
   lateral e limites da caneta num comando. A skill `caneta` já recomenda, mas o script não existe.
9. **Folha de conferência das lousas** (`/amostra/lousas/`), com os quadros-chave de cada uma, como a
   que existe para as ilustrações. Os tempos (`data-traco="0.2 0.4"`) são escritos à mão e hoje só se
   conferem tocando a animação.
10. **`LousaTempo` "como passos" repete o texto:** os estados e a lista embaixo são escritos duas
    vezes. O componente poderia gerar a lista a partir dos estados.
11. **A revisão em lote parou:** 26 posts pendentes em `.claude/revisao-posts.md` e só 2 com caneta.
    Definir uma ordem (por exemplo, os mais lidos primeiro).
12. **Estilo dos diagramas:** se a ideia é algo mais próximo do ByteByteGo (mais limpo e colorido) nas
    lousas, é uma decisão nova, que muda o `docs/estilo-desenho.md`.

### Edição do site

13. **A seção "Movimento" do `DESIGN.md` tem cerca de 270 linhas** descrevendo cada animação em
    detalhe. Uma tabela curta (peça, ferramenta, duração, decisão) com o detalhe nas decisões deixaria
    o documento mais fácil de consultar.
14. As sugestões 2 e 4 também valem para a edição do site: menos ruído do Impeccable e as armadilhas
    carregadas só quando se mexe em interface.

### Pendentes de OK

- Apagar `.impeccable/review/` (192 MB, fora do git): relatórios e capturas das auditorias da D37 à
  D40, já aprovadas e publicadas. Não tem como recuperar depois.
- `Aviso.astro` só é usado em `/amostra/` (os avisos dos posts saem do plugin). Fica se a ideia for
  usá-lo em MDX.
- Nove funções exportadas são usadas só no próprio arquivo (`dividirTitulo`, `minutosDeLeitura`,
  `urlPost`, `canetaNoCodigo`, `rolarRotulo`, `lerEscolha`, `aplicarTema`, `PaginaJpeg`, `JavaLts`).
  Tirar o `export` é opcional.

### Já feito na faxina de 28/09/2026 (D53)

- Lixo local apagado (cerca de 3,7 GB): `.astro/depuracao/` (3,4 GB de quadros de depuração),
  `bench/`, `.render/` e `.DS_Store`. Um preview esquecido na porta 4324 foi parado.
- Três exports sem uso removidos (`textoDoFiltro`, `temDesenho`, `NomeIcone`).
- Dados dos livros de `docs/capas/` para `src/livros/`, porque o build lia de `docs/`.
- Controles de rodadas fechadas, o prompt da Fase 0 e os protótipos superados em `docs/historico/`.
- Índice com a coluna "Hoje" no topo do `docs/decisoes.md`.
- `docs/estado.md` reescrito como painel curto.
- Textos que ainda descreviam a lousa de passos (D46) e o ScrollTrigger corrigidos no CLAUDE.md, na
  skill `post`, no `DESIGN.md`, no `PRODUCT.md` e no `estilo-desenho.md`.
- Mapa de pastas do CLAUDE.md completado.
