# Mapa do projeto

O que mora em cada pasta e as armadilhas do ambiente que só aparecem de vez em quando. Saiu do
`CLAUDE.md` na faxina da D84, para ele ficar curto: lá ficam o resumo das pastas de quase toda tarefa e
as armadilhas de todo dia, com o ponteiro para cá. **Atualize quando mudar** (pasta nova, arquivo que
sai ou muda de lugar).

## Pastas

```
DESIGN.md                sistema visual (fonte de verdade do visual, formato DESIGN.md do Google)
PRODUCT.md               registro de produto do Impeccable (leitor, propósito, diferenciais); o
                         briefing vence em caso de divergência
astro.config.mjs         configuração do Astro: os plugins de Markdown e os redirecionamentos
                         (`redirecionamentos`, com NOMES_ANTIGOS e ABSORBED)
skills-lock.json         a origem e o hash das skills de terceiros
.impeccable/config.json  ajustes do Impeccable ("buildPath": "code")
.mcp.json                MCPs do projeto (astro-docs, chrome-devtools)
.node-version            o Node do projeto (24, pelo fnm)
entrada/                 posts trazidos para adaptar (fora do git)
saida/                   o que os scripts geram para entregar (fora do git): slides/<slug>/ (D74)
redesenho/               os protótipos do redesenho (fora do git, só nesta máquina, D61): projeto Astro
                         próprio, com os 10 modelos na porta 4400; as cópias do blog das rodadas 2 a 4
                         em novos/ (portas 4411 a 4430), e a versão final com as amostras na 4421
                         (/amostras/)

docs/briefing.md         decisões de produto e design (fonte da verdade)
docs/estado.md           painel: fase, pronto, próximos passos, perguntas
docs/decisoes.md         registro de decisões (data, decisão, motivo, alternativas)
docs/mapa.md             este arquivo
docs/estilo-desenho.md   estilo da capa (e da capa viva), das figuras coloridas e das lousas
docs/marcacoes.md        guia vivo da caneta do caderno: 34 tipos, limites, tela, ajustes do Cesar (D48, D56)
docs/movimento.md        o detalhe de cada animação (durações, curvas, ordem); as regras ficam no DESIGN.md
docs/capas/              a regra dos livros (CAPAS.md) e as imagens de referência (referencia/)
docs/virada.md           plano para o domínio passar ao blog novo (só com OK do Cesar)
docs/escrita/            a pesquisa das regras de escrita e de post em partes (D71), com as fontes e a
                         leitura dos posts de então
docs/figura-em-passos/   a figura em passos (D67, em prova): o pedido (README), a pesquisa e a auditoria
                         das peças animadas de 02/10/2026
docs/redesenho/          redesenho (D55, D61): pedido, regras e status (README), a direção de cada modelo
                         (modelos/), as rodadas 2 a 4 (rodada-N/: o texto do Cesar, a direção e o
                         controle), a API da base comum (base.md) e as referências
docs/referencias/        o protótipo aprovado da Fase 0 que ainda vale (o estilo dos desenhos)
docs/prototipos/         protótipos que ainda são referência: a caneta do caderno, as animações da D51
                         (animacoes/) e a rodada da coleção de 13 livros (colecoes/, D78, já aplicada:
                         as sugestões, e em final/ a direção de arte, a crítica, os textos e os dados)
docs/ajustes-dNN/        o controle da rodada de ajustes em andamento (vai para docs/historico/ ao fechar)
docs/historico/          rodadas fechadas e o que foi superado (lista no README de lá): o prompt da Fase
                         0, os controles da D46/D47, ajustes-d52/ e ajustes-d54/, a revisão do frontend
                         de 03/10/2026, a análise da configuração do Claude Code de 28/09/2026, o estudo
                         dos livros realistas (D57), os protótipos e as referências superados

src/content/posts/       posts; nome do arquivo = slug da URL
src/content.config.ts    o esquema do frontmatter dos posts
src/data/                taxonomia e series (leem src/livros), java, decks (apresentações), site
                         (autor, perfis e textos), mao (os títulos à mão da papelaria, C05)
src/livros/              o que o site lê dos livros (D53): livros.json, cores.js, grao.svg, desenhos/,
                         icones/, serie/, tags/ (um ícone por tag, D52) e fotos.json (as etiquetas do
                         livro deitado, D57)
src/amostra/             o conteúdo das páginas /amostra/ (recursos.md, recursos.mdx, caneta.md) e os
                         controles em prova da D65 (controles/, de /prototipos/controles/)
src/styles/tokens.ts     cores dos dois temas: fonte única, gera as variáveis CSS (D4)
src/styles/              base (folha, painel, papel colado, barra de rolagem, transição de página),
                         fontes, avisos, prosa, artigo (grade, notas), paginas (o miolo do livro
                         ampliado), estante e livro (lombada, livro 3D e capa), desenho (ilustrações),
                         capa-viva, figura (figuras, animações e logos, D58), figura-passos e
                         passos-estilo/ (a figura em passos e os três estilos dos controles, D67),
                         lousa-nova (a Lousa, em prova) e lousa (os controles dela e a frase em
                         destaque), caneta (marcações, D48), traco (traços à caneta, C04), visor,
                         contador e copiado (D49); da D61: luz e livro-vivo (a luz e o brilho dos
                         livros), vidro (a lâmina de vidro, o chão das fileiras), nicho (os abajures e a
                         estante com eles), catalogo (as fichas), ficha-do-livro e suave (a cortina da
                         troca de página e a entrada ao rolar)
src/assets/              caveat-titulos.woff: a Caveat 600 só com as letras dos títulos à mão (C05)
src/layouts/Base.astro   head, anti-piscada, cabeçalho, rodapé, busca e o nome de transição dos livros
src/components/          peças das páginas (estante, sumário, busca, fichas, cabeçalho, rodapé…) e dos
                         posts (Figura, FiguraPassos, FraseDestaque, Ferramenta, Evidencia, Tldr; a
                         Lousa e a Animacao só nas páginas em prova, D67); da D61: ColecaoHome (a
                         coleção da home em prateleiras, D84), Colecao e FileiraTopo (a fileira do alto
                         da página do livro), PontoDeLuz e Luz (abajures e luz), Fichario, NuvemTags e
                         FichasTags (Tags), Vizinhos e LivroDoArtigo (o fim do post), AbaTopo (voltar ao
                         topo) e TracoTitulo
src/computador/          o computador (D61): o ícone no canto, o macOS de mentira (sistema, janelas,
                         dock, menus) e os apps (Finder, editor, Terminal, Pré-Visualização, Sobre); os
                         dados vêm das rotas src/pages/mac/
src/pages/               rotas; a home é [...page].astro (paginada, D27); capas.astro (a história de
                         cada capa, D78); livros/[slug].json.ts (as páginas do livro ampliado, D49) e
                         livros/marca/[slug].svg.ts (a máscara da marca d'água, D39);
                         posts/[slug]/apresentacao.pdf.ts (PDF) e og/[slug] (imagem, D10); [amostra]/
                         (as páginas /amostra/, só no dev); as páginas em prova (animacoes-test*.astro e
                         prototipos/controles.astro, noindex)
src/plugins/             Markdown: avisos, notas laterais, apresentação, tabelas, imagens, matemática e
                         a caneta (marcacoes.mjs, D48)
src/lib/                 posts, formato, busca/ (Pagefind), codigo (Expressive Code), pdf, seo, url,
                         avisos, estante (livros), livros-svg (desenhos e ícones), livro-3d (medidas do
                         livro aberto), ficha e ficha-do-livro, marca (traçado da marca, gerado),
                         caderno (miolo do caderno "cs", D52), tags-svg (ícones das tags, D52), fotos
                         (as fotos paradas dos livros e o lugar das etiquetas, D57), icones, traco
                         (traços e ícones à caneta: colchete, círculo, rasura, ondinha, visto, ícones
                         de data, tempo, código, lupa e virar, contornos dos botões e a assinatura,
                         D52, C04), caneta e mao (as letras à mão), ilustracoes (as capas), figuras (lê
                         figuras, animações e logos, e troca `data-marca` pelo logo, D58), lousas e
                         lousa-tempo (as lousas em prova e a /amostra/lousas/)
src/scripts/artigo.ts    interações do artigo (barra, sumário, notas, visor, apresentação) e o aviso das
                         tabelas que passam da tela no celular (D70)
src/scripts/tema.ts      tema: a lâmpada do cabeçalho alterna claro e escuro, acendendo e apagando
                         (D39, D61; a lâmpada em lampada.ts)
src/scripts/             também: troca.js (a cortina e as chegadas), luz, livro-vivo, estante-moderna
                         e estante-viva, fichas-caem, fichario, revelar e embaralha (D61); doca (a doca
                         da coleção da home, D78, D84); figura-passos (D67); capa-viva e desenho-vivo;
                         caneta, contador e copiado; gsap (o GSAP sob demanda); lousa (em prova)
src/ilustracoes/         uma ilustração SVG por post (<slug>.svg), com os recortes na raiz (D11)
src/figuras/<slug>/      diagramas e gráficos coloridos do post e as figuras em passos (D58, D67)
src/lousas/<slug>/       os desenhos das lousas em prova (só /animacoes-test/ e /amostra/lousas/; os
                         posts não usam mais, D67)
src/animacoes/<slug>/    as animações com play em prova (só /animacoes-test/, D67): o quadro final
                         (<nome>.svg) e o movimento (<nome>.ts, GSAP)
src/marcas/              logos das ferramentas (viewBox 100×100) e ícones genéricos, reaproveitados em
                         todo post; regras.json, a regra de marca de cada um (D64)
src/evidencias/<slug>/   prints que provam algo do texto (PNG)
public/posts/<slug>/     diagramas antigos e slides das apresentações (deck/)
public/livros/fotos/     as fotos dos livros (D57): o deitado de cada livro e o aberto em branco

scripts/                 contraste, links, escrita (as regras de escrita do post, D71), conferir (o post
                         no navegador, D53), apresentacao, og, copiar-katex, marca, caveat-titulos
                         (subconjunto da Caveat, C05), verificar-ambiente (npm run setup e hook do
                         início da sessão), foto.mjs (foto de uma página ou peça, sem MCP, D58),
                         chrome.mjs (a única maneira de abrir o Chrome nos scripts: CHROME_PATH troca
                         o navegador, D84), servir.mjs (o servidor do dist/ do og.mjs e dos testes),
                         frontend/ (os testes do frontend, D76: plugins, regressao, interacoes, tema e
                         paginas), desenho/ (validar, revisar, centrar, render, java, tags e livros.mjs,
                         a caneta dos livros novos), livros/ (as fotos dos livros, D57; o título da
                         capa e a conferência de cores de livro novo), bench-busca/ (a medição da
                         busca, D2) e slides/ (as apresentações no estilo do blog, D74: estilo.py,
                         capturar.mjs, conferir.py, fontes.py e o roteiro de cada post em
                         posts/<slug>.py)

.github/workflows/       deploy.yml (publica no GitHub Pages a cada push na main, D34) e
                         frontend-review.yml (a conferência do frontend em cada PR, sem publicar, D76)
.claude/settings.json    permissões, MCPs habilitados, telemetria desligada e os hooks (o ambiente no
                         início da sessão e o Impeccable)
.claude/skills/          procedimentos (carregados sob demanda); as de terceiros são cópias lidas
.claude/rules/           regras por caminho (posts, desenhos, interface, redesenho)
.claude/agents/          subagentes: os do Impeccable e os do redesenho (redesenho-*)
.claude/revisao-posts.md lista e status da revisão em lote dos posts
```

## Armadilhas do ambiente (as de vez em quando)

As de todo dia (Node 24 pelo fnm, `--host 127.0.0.1`, push pelo SSH, `node -e` com apóstrofo, o
`git status` antes do commit) estão no `CLAUDE.md`; as de interface, em `.claude/rules/interface.md`.

- **Renomear só a caixa de um arquivo:** o macOS não diferencia maiúsculas e o Linux do CI diferencia.
  Use `git mv` em dois passos.
- **Deploy preso na fila:** cancelar e reexecutar o workflow (o `gh` está instalado nesta máquina).
- **Mudou um token de cor?** O tema dos blocos de código sai dos tokens (`src/lib/codigo.ts`), e o deploy
  reaproveita o cache de conteúdo da execução anterior (`withastro/action`): os posts `.md` que não
  mudaram saem apontando para um `ec.*.css` que não existe mais (na D61, a série Java). Depois do push,
  apague os caches `astro-cache-*` do Actions (`gh cache delete`) e rode o deploy de novo (`gh run
  rerun`), ou confira o site no ar com a fumaça.
- **Mudou a configuração ou o tema do Expressive Code?** `npm run build -- --force`: o cache de conteúdo
  guarda o HTML dos posts apontando para o CSS antigo do EC, e os blocos de código perdem o estilo (D26).
  O dev tem o mesmo problema, e reiniciar não basta: pare o dev, apague `.astro/data-store.json` e suba
  de novo (o sintoma é o código sem moldura, com título e linguagem grudados, "Sem AOPJava", porque o
  HTML guardado aponta para um `ec.*.css` que não existe mais).
- **Mudou o HTML que um plugin de Markdown gera (`src/plugins/`)?** O mesmo cache guarda o HTML dos
  posts `.md` e não percebe a mudança no código do plugin: no build e no deploy, os posts que não mudaram
  saem com o HTML antigo (os `.mdx` são refeitos). As opções do plugin no `astro.config.mjs` contam: o
  `rehype-tabela` tem a opção `saida` (D70); suba o número dela e o cache se refaz sozinho, aqui e no
  deploy. Plugin sem essa opção: `npm run build -- --force` e, depois do push, apagar os caches
  `astro-cache-*`.
- **Campo novo no esquema do conteúdo (`content.config.ts`):** o dev já aberto não relê sozinho e
  descarta o campo até reiniciar. Sem tirar o dev principal do ar, suba por uns segundos um segundo dev
  noutra porta (`--ignore-lock`), que refaz o armazenamento de conteúdo com o esquema novo, e pare-o
  (D52, C03).
- **Dev com erro 504 "Outdated Optimize Dep"** (o GSAP não carrega, "Failed to fetch dynamically
  imported module", e as peças com GSAP sob demanda param: o desenho do topo do artigo não se desenha, as
  lombadas da estante não tombam): o cache de dependências do Vite ficou velho, em geral depois de mover
  arquivos importados com o dev no ar. Pare o dev, apague `node_modules/.vite` e suba de novo.
