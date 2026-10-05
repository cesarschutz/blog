# Estado do projeto

Painel, não diário: fase atual, como ver, próximos passos, perguntas abertas e riscos. O detalhe de cada
rodada fica em `docs/decisoes.md` (D1 a D84, com o índice no alto) e no histórico do git; os controles
das rodadas fechadas e o diário que este painel tinha até 04/10/2026 (`estado-ate-2026-10-04.md`), em
`docs/historico/`.

## Fase atual

- **No ar desde 25/09/2026** em <https://blog.cesarschutz.com.br> (repositório `cesarschutz/blog`, D34):
  todo push na `main` publica. O blog antigo continua em `cesarschutz.com.br` (`docs/virada.md`).
- **O visual é "papel, tinta, latão e luz"** (D61, com as cores de antes, D62): o resumo está na seção
  "Papel e luz (D61)" do `DESIGN.md`, e o detalhe, em `docs/redesenho/rodada-4/`. Os protótipos ficam só
  nesta máquina (`redesenho/`, fora do git).
- **A coleção tem 13 livros** (D78), com a contracapa e a página As capas; **a home é uma estante de
  prateleiras de capas** (D84), com o nome menor e o "blog" carimbado sobre o Z.
- **Posts:** 33 publicados (10 em `.mdx`). Todo post segue a skill `post`: o formato combinado antes
  (D63), as regras de escrita e o post em partes (D71) e a caneta como última etapa (D48); a apresentação
  no estilo do blog sai pela skill `apresentacao` (D74, D77). Os sete posts com uma peça que acontece em
  ordem usam a figura em passos (D67, em prova), no estilo marca-texto; nenhum usa mais a `Lousa` nem a
  `Animacao`.
- **Última rodada: D84** (a home, a revisão geral das telas e a faxina do código e dos documentos),
  publicada em 05/10/2026; o controle está em `docs/historico/ajustes-d84/controle.md`. Nenhuma rodada em
  andamento: o próximo trabalho é post novo (skill `post`) e a revisão do Cesar no ar (pergunta 000).

## Como ver

- Dev: `fnm exec --using=24 npm run dev -- --host 127.0.0.1` (<http://127.0.0.1:4322>; a 4321 é de outra
  ferramenta); parar com `fnm exec --using=24 npx astro dev stop`. No dev, a busca avisa que não há índice.
- Busca e PDFs: `npm run build` e `npm run preview -- --host 127.0.0.1 --port 4323`
  (<http://127.0.0.1:4323>); parar com `npx astro preview stop`.
- Só no dev: as páginas `/amostra/` (a lista está no `CLAUDE.md`).
- Em prova (noindex, fora do sitemap e da busca): `/animacoes-test-2/` (a figura em passos, D67),
  `/animacoes-test-3/` (o estilo dos controles dela), `/animacoes-test/` e `/prototipos/controles/` (as
  peças antigas e os controles da D65).
- Post de referência com capa viva, figuras em passos, frase em destaque e caneta:
  `/posts/cobranca-duplicada-no-retry/`.
- Exemplos da D58 (só local): a branch `exemplos-arquivo` está presa a uma worktree de outra sessão,
  marcada como prunable (`git worktree prune` libera); depois, `git switch exemplos-arquivo` em
  `../blog-exemplos`, dev com `--port 4330` e <http://127.0.0.1:4330/exemplos/>.
- Redesenho (D55, fora do git desde a D61): os modelos em <http://127.0.0.1:4400>, as cópias das rodadas
  2 a 4 nas portas 4411 a 4430 e a versão final com as amostras em <http://127.0.0.1:4421> (`/amostras/`).
  Os comandos estão em `docs/redesenho/base.md`.

## O que existe (resumo)

O índice completo, com o que vale hoje de cada decisão, está no alto do `docs/decisoes.md`.

| Rodada | O quê |
|---|---|
| D1–D25 (Fases 0 a 7) | base Astro 7, tokens, fontes, 26 posts migrados, rotas e redirecionamentos, busca (Pagefind), artigo completo, ilustrações e lousas, Lighthouse, deploy |
| D26–D34 | lista e cards, home paginada, livros da coleção, cabeçalho fixo, edição de estudo e revista, marca "cs", publicação |
| D35–D47 | processo único de posts (skill `post`, `DESIGN.md`), sumário, livros em movimento (GSAP), caneta da leitura, livros de lado, menu do celular |
| D48, D56 | a caneta do caderno (34 tipos, guia `docs/marcacoes.md`, skill `caneta`) |
| D49–D54 | movimento revisto, abertura e troca de página, acabamento (tags com ícone, destaque na grade, campo `codigo`, C04, C05), faxina, caça aos bugs |
| D57 | livros realistas: capa dura, volume, livro deitado no "Do livro", livro aberto nos vazios |
| D58–D60 | capa viva, figuras coloridas, a lousa nova, animação com play, ícones das ferramentas, print; o escuro dos desenhos |
| D55, D61, D62 | o redesenho no ar (papel, tinta, latão e luz), com as cores de antes |
| D63–D68 | formato do post (detalhado ou resumo), marcas (D64), controles em prova (D65), post dos mods, figura em passos (D67, em prova), pedido que vira regra |
| D69–D73 | acessibilidade do Lighthouse (busca, Lista/Cards, nomes `.sr`), tabelas no celular, regras de escrita e post em partes |
| D74–D77 | apresentação no estilo do blog (e no post), post de Parquet, revisão técnica do frontend (PR #3) |
| D78 | a coleção de 13 livros, a contracapa e As capas |
| D79–D83 | posts: a parte 2 dos mods em dia com o cockpit (D79, D80 e, de outra sessão, D83), DNS (D81) e You should know (D82, de outra sessão) |
| D84 | a home em prateleiras de capas, o nome com o "blog" carimbado, o rodapé numa linha no celular, a revisão geral das telas e a faxina do código e dos documentos |

## Próximos passos

0. **Lembrete da D63:** o Cesar aprovou as duas partes do post dos mods (D71, publicadas); falta só ele
   dizer se o TL;DR recolhível e os links ao longo do texto ficam como estão. Com a resposta, tirar o
   lembrete da skill `post` e este item.
1. **Reescrever o `DESIGN.md` inteiro para "papel e luz"** (D61): hoje a seção da D61 vence as antigas,
   escritas para as "Folhas claras". Na faxina da D84, o briefing §4 a §7 e as contradições do
   `DESIGN.md` foram acertados; falta a reescrita das seções antigas (Overview a Components).
2. **Revisão em lote dos posts** (`.claude/revisao-posts.md`): 25 pendentes pela skill `post`, modo
   Adaptar, cada um terminando na caneta (a proposta aprovada antes). A ordem é pergunta (19).
3. **Blog antigo (D34):** os dois têm os mesmos artigos. Decidir entre `noindex` no novo até a virada, o
   antigo redirecionando para o novo ou a virada do domínio (`docs/virada.md`).
4. **Medir no site publicado:** a busca (regra 4 da D2) e o desempenho no Lighthouse (não medido desde a
   D26; acessibilidade, boas práticas e SEO foram medidos na D69 e na D73).
5. **No iPhone (Safari) e com INP real**, que a revisão da D76 não cobriu: o livro que tomba na estante
   (item 42 da D54), a troca Lista / Cards (D72) e uma tabela larga (D70; a do "O cockpit" serve).
7. **Peso das páginas (B14):** 160 a 440 KB abertos, pelos SVGs embutidos; merece um item próprio.
8. **Página Sobre:** o Cesar escreve (D33). Até lá, `/about/` leva à home.
9. **`scripts/desenho/render.mjs` fotografa a abertura do site (D51)** em vez da folha de conferência:
   falta `reducedMotion: "reduce"` na página que ele abre (achado em 29/09/2026; contornado com uma cópia
   local).

## Perguntas abertas para o Cesar

Escolhas feitas para não parar; todas voltam atrás com pouco trabalho. Os números são fixos (o
`docs/decisoes.md` cita alguns); as perguntas que saíram deixam o número vago.

- **00. A marca "cs" (D78):** acompanha a Arquitetura no azul (`#2d4f77`) ou fica no verde `#2D4B46`?
- **000. A home da D84** (você revê no ar): (1) em notebooks de 900 a 1280px, o ícone do computador
  cobre o primeiro livro da prateleira de baixo (a regra C2 o quer inteiro no canto): fica, ele afunda
  sobre um livro, ou a estante abre espaço (livros ~8% menores)? (2) os saltos de tamanho nas viradas de
  forma (599/600 e 899/900px) e o do nome gigante em 700/701px ficam? (3) as regiões de código sem nome,
  os avisos do mesmo tipo com o mesmo nome e a célula de canto vazia das tabelas de comparação pedem
  mexer no Expressive Code e nos plugins de Markdown (build sem cache, caches do deploy apagados): faço?
- **0. O que ficou da D54** (a seção "Para o Cesar decidir" de `docs/historico/ajustes-d54/controle.md`):
  a folha longa no celular lento, a volta sem bfcache, o desfile de Livros no celular, os
  redirecionamentos com o texto do Astro em inglês, a busca que volta aberta, o alt dos slides e a
  descrição das tags, os comportamentos para confirmar, o tema antigo por ~0,25s ao voltar, o clique
  duplo no tema (rever com o lustre), a fumaça da caneca, o `?livro=` com movimento reduzido e o toque
  que pula a abertura.
- **2. Literata com `opsz`** (107,5 KB) pesa no celular; a versão só com peso tem 51 KB e anteciparia o
  primeiro texto em ~0,5 s. Troca?
- **3. Tempos longos (D51):** o desfile de Livros (assenta até 3,5s do clique) fica? A navegação com a
  busca ou o livro ampliado abertos passa para a troca nova (hoje usa a folha de antes)?
- **4. Ícones das tags (B11):** as metáforas menos óbvias (semáforo para Concorrência, moedor de café
  para JVM, espeto de notas para AOP, âncora para LTS) e a marca d'água girada −8° na página da tag.
- **6. Caneta preta (C04):** o colchete da lista e o círculo da paginação em preto (podem voltar ao
  azul); o traço dos links do rodapé segue azul (manter, preto ou tirar?); o visto no calendário (pode
  ler como "já lido"); o traço embaixo do "blog" no hover da marca.
- **7. Home (C02):** a primeira página tem 11 artigos (o destaque vale dois lugares). Muda a D27: fica?
- **8. Papelaria (C05):** o amarelo do post-it (claro `#FFF1BE`, escuro `#39372D`) e a cola dos atalhos
  sem o sublinhado azul animado do título.
- **9. Carimbo "fontes conferidas em …"** no fim do artigo: pede um campo novo no frontmatter e a
  conferência post a post (sem ela, o carimbo mentiria).
- **11. Marcas (D64):** o Duke (licença BSD) redesenhado no lugar da xícara do Java? O arquivo oficial
  do MongoDB, do PostgreSQL e do Kafka no texto (baixar, com o seu OK)? Os ícones oficiais da AWS nos
  diagramas (só para cliente da AWS, sem alterar)? Uma nota de marcas no rodapé, que várias políticas
  pedem?
- **12. Os posts dos mods e os antigos (D66, D71, D79):** os títulos das duas partes e a capa nova da
  parte 1 ficam? A capa da parte 2 ainda mostra os custos da sessão antiga (D79). Os posts antigos fora
  das regras de escrita (descrições longas, os títulos do Java 25 e de criptografia, as aberturas de
  criptografia e de data lake) ficam para a revisão em lote? O campo `codigo` pode apontar para o
  `claude-code-kit` (hoje é só do `blog-exemplos`)?
- **13. Figura em passos (D67):** aprova o formato? Qual aviso de "o passo terminou" fica (no ar, o 5,
  os traços embaixo da figura; a sugestão era o 1, o Próximo que se enche, ou ele com o 5)? Aprovando, a
  figura em passos vira a `Figura` com `passos`, saem as páginas de prova (`/animacoes-test/`, `-2/`,
  `-3/` e `/prototipos/controles/`, com o que só elas usam), a D65 perde o objeto e o texto da lousa e
  da animação nas skills, no briefing e no `DESIGN.md` vira história.
- **14. Lighthouse fora do cabeçalho (D69):** ele mede o contraste no meio das animações de entrada
  (home, arquivo e Tags) e acusa valores que somem com a página assentada. Fica como está?
- **15. Ferramentas (D73):** o MCP `chrome-devtools` usa um perfil de Chrome só para todas as sessões
  (com várias abertas, só a primeira abre o navegador): ponho `--isolated` no `.mcp.json`? E você
  confirma a origem do repositório no app (Ajuda → Troubleshooting → Review Pinned Git Origins)? Sem isso,
  a ferramenta que traz a `main` para as worktrees recusa sempre que a `main` mexe em `.claude/skills`.
- **16. Tabelas no celular (D70; o detalhe na decisão):** (1) um degrau menor (6,5em) para a coluna de
  lista curta (a tabela do JWT cai de 674 para 534px, mas 3 tabelas a mais rolam em 360px)? (2) o piso de
  11em em qualquer largura, também no tablet? (3) as duas tabelas do `java-29` com parágrafo na célula
  viram texto ou lista? (4) "célula é para frase curta, e cabeçalho curto" entra na skill `post` (D68)?
  Quando ela fechar, sai a pasta `.astro/depuracao/tabelas/` da worktree `lucid-khayyam-cc18a1`.
- **17. A revisão de interface de 28/09** (skill `better-interface`), o que ficou: a medida do artigo em
  1280 e 1600px (D46), `text-wrap: balance` nos títulos dos cards, o foco fino da lombada e do bloco de
  código, o `:hover` em "Ver a série" e "Todos os N", cores soltas fora de token e "do Java" a 4,11:1 (a
  exceção da D35).
- **18. Os posts recentes:** toda apresentação nova entra no post sem perguntar, ou só quando você pedir
  (D77)? No You should know (D82, os pendentes na decisão): o print real da nota, o app Desktop, o link
  das partes 1 e 2 para ele e o ciclo da checagem como figura em passos; e o OK direto da proposta de
  caneta vale só para aquele post ou vira regra (D68)?
- **19. A ordem da revisão em lote** (próximo passo 2): os mais lidos primeiro (pede os números de
  acesso) ou os mais recentes primeiro (os mais próximos do formato de hoje)?
- **20. O tamanho do `CLAUDE.md`:** a meta da Fase 0 era menos de 150 linhas (briefing §9). Na faxina da
  D84, o mapa das pastas e as armadilhas raras foram para `docs/mapa.md`, e ele ficou com umas 300.
  Enxugar mais ou mudar a meta?
- **21. O prompt do modelo 06** (`docs/historico/prompt-06-terminal-dev-note.md`, escrito para o
  dev-note): ele já está no projeto dev-note? Se estiver, pode sair do blog.
- **22. Worktrees e branches** (nada foi apagado; a lista de 05/10/2026): já estão na `main` as branches
  `claude/kind-shaw-14748f` (D69, como `822ee8c`) e `claude/wonderful-pike-800bfd` (D73) e as worktrees
  `post-do-claude-md-ao-mod`, `post-you-should-know`, `post-dns`, `slides-no-estilo` e
  `amostra-caneta`: podem sair? `git worktree prune` limpa as prunable (`../blog-colecao`,
  `../blog-livros-realistas` e duas no `/private/tmp`). A pasta principal está na branch
  `post-claude-code-mod` (já na `main`, 120 commits atrás): volta para a `main`? A `lucid-khayyam-cc18a1`
  (outra branch, já na `main`) só sai depois de conferir se tem trabalho sem commit e da pergunta 16. A
  `exemplos-arquivo` não está na `main` e fica. A branch `claude/blog-review-home-improvements-ca8691`
  (a da D84, já na `main`) foi enviada ao GitHub sem querer no fim da rodada: pode sair de lá também.

## Riscos a acompanhar

- A `main` local da worktree `../blog-exemplos` ficou atrás da remota (a D61 foi publicada de outra
  branch, com push direto para a `origin/main`). Antes de mexer lá, `git pull`.
- Tremor (`feTurbulence`) nos desenhos que se mexem (os detalhes das figuras e a figura em passos): 60
  quadros por segundo no Chrome desta máquina com CPU 4× e DPR 3; falta um iPhone de verdade. Plano B:
  gravar o tremor na geometria, no build (`DESIGN.md`, Desenhos dos posts).
- Os protótipos do redesenho (`redesenho/`, fora do git, porta 4400) importam do `src/` do blog: a base
  reexporta a rota `src/pages/livros/[slug].svg`, que saiu na D84 (com o modo `desenho="adiado"` da
  `Capa`). Quando a pasta principal estiver na `main` nova, a base deles quebra; se for preciso subir os
  modelos de novo, a rota volta do git para dentro de `redesenho/`.
- A imagem de compartilhamento precisa de Chrome no build (D10); os runners do GitHub Actions têm.
- `prerender` nas regras de especulação (B14) fica para depois: exigiria revisar os scripts que rodam ao
  carregar (abertura, desenhos, contagem de visitas).
