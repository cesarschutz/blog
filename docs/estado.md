# Estado do projeto

Painel, não diário: fase atual, próximos passos, perguntas abertas e riscos. O detalhe de cada rodada
fica em `docs/decisoes.md` (D1 a D76) e no histórico do git; controles de rodadas fechadas, em
`docs/historico/`.

## Fase atual

**No ar desde 25/09/2026 em <https://blog.cesarschutz.com.br>** (repositório `cesarschutz/blog`,
D34): todo push na `main` publica. O blog antigo continua em `cesarschutz.com.br` (`docs/virada.md`).

**O redesenho está no ar (D61, 02/10/2026):** a versão final do redesenho (D55, rodada 4, a `21-final`)
virou o site, com o visual "papel, tinta, latão e luz". O papel é quente no claro e marrom no escuro, e
tudo é papel (folhas, fichas de catálogo e papéis colados com fita). Há abajures de latão sobre os
livros, a cortina entre as páginas, o fichário de Tags, o rodapé de feltro com a cordinha, a aba "topo"
e o computador. Ela veio por cima da D59 e da D60, com os tokens dos desenhos recalibrados para o papel
quente. O resumo do visual está na seção "Papel e luz (D61)" do `DESIGN.md`, e o detalhe, em
`docs/redesenho/rodada-4/`. As quatro rodadas (10 modelos; 11 a 15; 16 a 20; a versão final com as
amostras) estão em `docs/redesenho/`. Os protótipos e as amostras ficaram só nesta máquina, fora do
git (`redesenho/`, no `.gitignore`).

**Ajustes do Cesar no site novo (D62, 02/10/2026):** as cores dos temas voltaram às de antes do
redesenho (o claro mais branco e o escuro preto esverdeado); a página de um livro mostra só os livros
na fileira e nos vizinhos, e a da série só as séries (com uma série só, fica sem fileira); e a fileira
que encolhe ao rolar, quebrada no ar pelo minificador do CSS, voltou a funcionar (a sombra do cabeçalho
ao rolar também).

**Formato dos posts (D63, 02/10/2026):** todo post, novo ou ajustado, começa por uma conversa com o
Cesar: detalhado (com o TL;DR recolhível no alto, do campo `tldr`) ou resumo (com um infográfico no
estilo dos guias do ByteByteGo, desenhado no nosso traço), a estrutura e as fontes (os links que ele
estudou ou fontes confiáveis); os links ficam ao longo do texto e em Fontes. Configurado nas skills
`post` e `figura`, na regra de posts e no briefing; o TL;DR de exemplo está em `/amostra/markdown/`.

Tudo até a D52 está commitado, inclusive o C04 (a caneta preta como identidade) e o C05 (a papelaria
de estudo: post-it "Neste artigo", ficha do livro, cola dos atalhos, commitado pelo Cesar em
28/09/2026, `da57524`). O push é do Cesar.

Faxina de 28/09/2026 (D53, sem commit): lixo local apagado (`.astro/depuracao`, `bench/`,
`.render/`), três exports sem uso removidos, os dados dos livros de `docs/capas/` para `src/livros/`,
controles fechados e protótipos superados em `docs/historico/`, índice no `docs/decisoes.md`, textos
que ainda descreviam a lousa de passos (D46) corrigidos, `CLAUDE-CODE.md` novo e este painel
reescrito. Depois, as sugestões do `CLAUDE-CODE.md` (regra de interface, CLAUDE.md mais curto,
Impeccable só no site, `npm run conferir`, `/amostra/lousas/`, `docs/movimento.md`). O que ainda é
decisão do Cesar está no fim do `CLAUDE-CODE.md`.

Revisão de interface de 28/09/2026 (skill `better-interface`, instalada em `.claude/skills/better-*`, sem
commit): aplicados o anel de foco dos cards, a marca do cabeçalho em 320–400px, os rótulos da lousa de
loop em tela estreita e o `aria-valuetext` do slider da lousa. **Ainda abertos** (o Cesar decide): campo
da busca sem anel de foco, medida do artigo em 1280/1600px (D46), `text-wrap: balance` nos títulos de
cards, foco fino da lombada e do bloco de código, `:hover` em "Ver a série" e "Todos os N", cores soltas
fora de token, `aria-pressed` redundante nos botões das lousas e "do Java" a 4,11:1.

Post novo de 29/09/2026: `criptografia-em-repouso-e-em-transito` (Segurança; tags Criptografia, Banco
de Dados e AWS), texto do Cesar adaptado pela skill `post`, com as 29 correções da revisão aprovadas
(PCI DSS 3.5.1.2, o *grant* do RDS na chave KMS, Nitro Enclaves, Terraform sem a chave declarada e
outras), a ilustração, duas lousas (envelope encryption e TLS com `require` × `verify-full`), a frase
em destaque e 12 marcações da caneta. O código foi rodado: AWS CLI e Terraform no moto, Postgres 16
com TLS, `pg_tde` no Percona 18, pgBackRest, JDBC, MongoDB 8.0 Community e Enterprise (TLS, KMIP e
Queryable Encryption). Ficou sem rodar: o `open`/`mount` do LUKS (o kernel da sessão na nuvem não tem
device-mapper) e o Atlas de verdade. O código está no `blog-exemplos`
(`criptografia-em-repouso-e-em-transito/`, 28 testes com Testcontainers: Postgres com TLS e um servidor
impostor, `pg_tde`, MongoDB com TLS, Enterprise em repouso, Queryable Encryption, AWS CLI e Terraform
no moto), e o post tem o campo `codigo`. O LocalStack ficou de fora: o RDS é pago (plano Base) e,
desde a 2026.03, toda imagem exige token.

Bug de 29/09/2026 (relatado pelo Cesar: no celular, a tela subia e descia sozinha durante a leitura):
era a `LousaTempo`. Depois do play, ela fica em loop mesmo fora da tela, e o texto do estado passava
de uma para duas linhas e voltava, a lousa crescia e encolhia ~25px (39px no Jackson) e o artigo abaixo
ia junto; no Safari do iPhone, sem ancoragem de rolagem, o salto aparecia até com a lousa longe. O dedo
que começava a rolar em cima do desenho também mudava o estado. Corrigido: os textos de todos os
estados ficam na mesma célula da grade, só o atual à vista e no `aria-live` (`LousaTempo.astro`,
`lousa.css`). A altura fica constante em todos os estados, de 320 a 1600px; onde algum estado ocupa
duas linhas, a lousa parada ganha a linha reservada embaixo do texto.

Caça aos bugs de 29/09/2026 (D54, publicada na `main` com o OK do Cesar, um commit por grupo):
cinco agentes varreram o site (artigos, acessibilidade e SEO, listas, home e navegação) e 40 bugs foram
corrigidos e conferidos no navegador: a marca do topo do artigo que abria o sumário, a página que
pulava ~450px com o foco no cabeçalho, o `#seção` perdido depois da abertura, o toque e a tecla que
pulavam a abertura e ainda agiam na página, a impressão (lousas, tema escuro, peças de tela), o
cabeçalho sem JS no celular, o tema que voltava errado pelo histórico, o foco perdido no visor, no
sumário, na gaveta e no livro ampliado, o pé da estante das listas, o RSS e outros. Lista completa,
arquivos e o que ficou para o Cesar decidir: `docs/ajustes-d54/controle.md`.

Segunda varredura de 29/09/2026 (D54, publicada na `main` com o OK do Cesar; antes guardada no branch
`d54-varredura-2`, que o Cesar apaga à mão): depois de dois bugs achados por ele (o desenho do topo que
aparecia e sumia ao recarregar e o livro que tomba na estante e perdia o desenho no celular), agentes
procuraram falhas passageiras quadro a quadro (gravação pelo CDP, CPU 4×, rede lenta) e as condições de
borda (tema, zoom, rede e scripts falhando, sem JS). Itens 41 a 67 do controle, corrigidos e
reconferidos no navegador. O item 42 (Safari do iPhone) não dá para testar aqui: conferir no aparelho.

Caneta com 34 tipos (D56, 29/09/2026, branch `amostra-caneta`): numa amostra, o Cesar viu um post
com os 20 tipos aplicados e escolheu, entre 20 propostos, 15 tipos novos; saiu o sinal ≠. Os limites
mudaram: sem teto de total, marca-texto até 3, o mesmo tipo até 5, nunca duas no mesmo parágrafo. O
catálogo `/amostra/caneta/` mostra os 34. Achado junto: o riscado com correção quebrava num espaço no
celular (corrigido). O post de criptografia foi remarcado pelas regras novas em 30/09/2026: 56
marcações (antes 12), conferidas em 320 a 1600px nos dois temas.

Livros realistas de 30/09/2026 (D57, aprovados pelo Cesar e levados à `main`; feitos na branch
`livros-realistas`, pasta `../blog-livros-realistas`): o livro 3D em capa dura (espessura das capas, seixa, lombada arredondada, cabeceado,
folhas) em todo livro em pé, com os movimentos mantidos; a gaveta da home sem sombra; a estante e a pilha
com volume; a série como livro de capa dura; na ficha "Do livro", o livro deitado com fita e uma
etiqueta por artigo (a amarela é o artigo aberto); o livro aberto em branco no livro sem artigos e na
busca sem resultado. Estudo e maquetes em `docs/prototipos/livros-realistas/` (galeria:
`node docs/prototipos/livros-realistas/ferramentas/servidor.mjs 4341`). Fotos das peças paradas:
`node scripts/livros/fotos.mjs` com o dev no ar. `check`, `build` e `links` passam.

Recursos visuais novos (D58, 29 e 30/09/2026, **publicados em 30/09/2026**): capa viva, figuras
coloridas com detalhes que se mexem, a `Lousa` nova (passos e comparação; a `LousaLoop` sai dos posts
novos), a animação com play, os ícones das ferramentas, o print como evidência e a caneta da leitura
na cor do livro. Regras nas skills (`post`, `desenho`, `lousa` e a nova `figura`), no `DESIGN.md` e
nos docs. Os três primeiros posts foram revistos pelas regras novas e passaram pela caneta
(criptografia em repouso e em trânsito, filtros do Jackson e CronJob ou endpoint + fila); o Cesar
testa direto no site. Os dez artigos de exemplo ficaram fora da `main`, na branch local
`exemplos-arquivo` (pasta `../blog-exemplos`).

Lousa no estilo das figuras (D59, 30/09/2026, publicada): a `Lousa` usa o painel, o traço, os tons, os
selos e os logos das figuras, e uma canetinha colorida desenha; no celular, rola de lado como as
figuras, e o painel acompanha a canetinha. As quatro lousas dos três posts foram redesenhadas. O
destaque da legenda passou a apagar tudo o que não é da cor do mouse, menos a referência
(`<g class="referencia">` e os eixos). E todo desenho passa pela revisão antes de ir ao Cesar:
`node scripts/desenho/revisar.mjs <slug>` (bugs automáticos e fotos) e o checklist da skill `figura`,
com a tabela dos bugs que já aconteceram.

O escuro dos desenhos do corpo (D60, 01/10/2026, publicado): painel próprio, um pouco acima da folha e
mais neutro, caixas com o tom puro a 45% e tinta um pouco menos branca. A capa não mudou.

Protótipo dos controles dos desenhos (01/10/2026, no ar em `/prototipos/controles/`, com noindex e fora
do sitemap e da busca): cinco opções (régua e lápis, marca-texto, caderno e caneta, post-its e fita,
carimbo e numerador), cada uma resolvendo a animação com play, a lousa de passos e a de comparação num
cartão só, com os desenhos e o motor de verdade. Código em `src/amostra/controles/` (o relógio comum, os
auxiliares e uma opção por arquivo). Esperando o Cesar escolher; a escolhida vira os componentes `Lousa`
e `Animacao`, e a página sai.

Controles em prova nos posts (D65, 02/10/2026): as opções 2 (marca-texto), 3 (caderno) e 4 (post-it)
estão cada uma numa lousa de passos, numa de comparação e numa animação com play, pelo `controles=` da
`Lousa` e da `Animacao`. Opção 2: criptografia (passos e comparação) e Jackson (animação). Opção 3:
Jackson (passos), CronJob (comparação) e cobrança duplicada no retry (animação). Opção 4: cobrança
duplicada no retry (passos e comparação) e bloqueio otimista e pessimista (animação). A cobrança saiu do
estilo antigo (as três peças refeitas) e o bloqueio ganhou a animação. As nove peças (a lousa de passos, a de
comparação e a animação de cada opção) estão juntas em `/animacoes-test/` (noindex), para o Cesar ver no celular; a
página sai junto com a do protótipo quando ele escolher.

Marcas (D64, 02/10/2026): a regra de marca de cada logo foi conferida na política oficial do dono e
registrada em `src/marcas/regras.json`; o build quebra com logo sem registro ou proibido. Dos 14 logos
redesenhados, só o do Kubernetes pode ficar; os outros saíram dos três posts (no texto, só o nome; nos
desenhos, ícones genéricos da casa: banco, fila, tópico, aplicação, servidor).

Post novo de 02/10/2026 (D66, **publicado**): `claude-code-do-claude-md-ao-mod`, "Quanto custou cada
agente? — Do CLAUDE.md ao mod no Claude Code", o primeiro do livro IA, com as tags novas Claude Code e
Plugins (ícones novos). Formato detalhado, com o TL;DR: a linha do tempo das peças de extensão do Claude
Code (de 24/02/2025 a 01/10/2026, cada data conferida no changelog e no npm), cada peça num parágrafo,
o marketplace, os comandos, o mod e o csr-cockpit, do `claude-code-kit` do Cesar. Visuais: capa viva,
uma figura (onde cada peça age), uma lousa de passos (da instalação à atualização) e quatro prints
parados do cockpit (os desenhos do kit fotografados). O `Evidencia` ganhou `larga` e `foco`, para o
print de terminal rolar de lado no celular. A caneta entrou com 35 marcações, aplicadas sem a
aprovação prévia, a pedido dele: **o Cesar revê o post no ar** (o texto, a caneta, o TL;DR e os links ao
longo do texto, que é o lembrete da D63). Feito numa worktree
(`.claude/worktrees/post-do-claude-md-ao-mod`), porque havia outras sessões na pasta do projeto.

Escrita dos posts e post em partes (D71, 02/10/2026, **publicado em 03/10/2026**): o Cesar leu o post dos mods no ar e não gostou do título (não dizia do que o post
trata), da abertura (já saía falando do cockpit, que é o exemplo) e da primeira pessoa. Entraram na
skill `post` as regras de escrita (o título que faz sentido sozinho, a descrição com o essencial em 160
caracteres, o TL;DR de conclusões, a abertura pelo assunto e a voz sem primeira pessoa) e a do post em
partes, com a pesquisa em `docs/escrita/pesquisa.md` e o `npm run escrita -- <slug>` para conferir. O
post dos mods virou dois: a parte 1, na URL de sempre ("Mods do Claude Code — o que são e as peças que
vieram antes"), e a parte 2, nova ("Um mod do Claude Code na prática — instalação, testes e limites",
`claude-code-csr-cockpit`), cada uma com cerca de 1.950 palavras, sem primeira pessoa; a
parte 1 ganhou uma capa nova. O roteiro da apresentação do post dos mods (D74) foi feito para o post
único: para gerar de novo, ele lê os prints do slug da parte 2.

Figura em passos (D67, 02/10/2026, **em prova** em `/animacoes-test-2/`): o Cesar achou as animações
ruins de entender ("muita coisa, ou animação com coisa sumindo"). Uma auditoria às cegas das 10 peças
animadas (1 clara, 5 médias, 4 ruins) e uma pesquisa (Mayer, informação que some, small multiples)
estão em `docs/figura-em-passos/`. A proposta é um formato só no lugar dos três: uma figura parada que
o leitor pode montar passo a passo, em que cada passo soma, nada some e nada anda sozinho (regras na
skill `figura`, componente `FiguraPassos`). As 9 peças da `/animacoes-test/` (que segue no ar como
estava) foram refeitas nele e, a pedido dele, já estão nos cinco posts, com o aviso dos traços embaixo
da figura (`fim="segmentos"`). Também ficou a regra da D68: todo pedido dele num post termina na pergunta
"vira regra para os próximos posts?".

Botão da busca do cabeçalho (D69, 02/10/2026, **publicado**): o Lighthouse apontava, no desktop, que o
`aria-label` "Buscar" não continha o texto da tela ("Buscar ⌘K"). O nome passou a vir do texto: saiu o
`aria-label`, a tecla desenhada ganhou `aria-hidden` e, até 1100px, o "Buscar" sai só da vista em vez de
`display: none` (sem isso, a lupa ficaria sem nome). A auditoria passa no desktop e no celular, no dev e
no build, e o cabeçalho ficou idêntico pixel a pixel nos dois temas, de 320 a 1600px. Feito na worktree
`.claude/worktrees/kind-shaw-14748f` (branch `claude/kind-shaw-14748f`) e publicado a pedido do Cesar.

Tabelas no celular (D70, 02/10/2026, **publicado** em 03/10/2026): a pergunta que o post dos mods
deixou (as colunas encolhiam até uma palavra por linha antes de a tabela rolar) foi medida nas 69 tabelas
dos posts e resolvida com as escolhas do Cesar. Até 700px, a coluna de texto tem piso de 11em, o respiro
das células cai para 10px, a tabela do `<details>` vai de borda a borda da caixa, e a tabela que passa da
tela ganha o aviso "Arraste para o lado" (o script do artigo mede). Em 390px, das 59 tabelas de três
colunas ou mais, as com texto a duas palavras por linha caem de 42 para 14, e as que rolam ficam em 35
(antes 36). Feito na worktree `.claude/worktrees/lucid-khayyam-cc18a1`; o estudo e as fotos estão em
`.astro/depuracao/tabelas/` de lá (fora do git), até a pergunta 16 fechar.

Tinta do seletor Lista / Cards (D72, 02/10/2026, **publicada**): o Lighthouse dava 96 de acessibilidade
na home, no arquivo, na página de um livro e na de uma tag, por um falso positivo de contraste no botão
solto do seletor. A caixa azul da tinta cobria a tira inteira, recortada por `clip-path`, e o axe não
enxerga o recorte. Agora a caixa fica só em volta do botão ativo e salta na troca (cresce no clique e
encolhe quando a tinta chegou); a cada quadro, quem anima continua sendo só o recorte. A nota voltou a 100
nas quatro páginas, no desktop e no celular, no dev e no build, e o seletor ficou igual, parado e em
movimento, nos dois temas. Era o segundo item da pergunta 14, que saiu de lá. Falta olhar a troca no
Safari do iPhone.

Revisão técnica do frontend (D76, 03/10/2026, **aprovada no PR #3**): as animações cancelam a
anterior a cada troca (nada preso invisível), o movimento reduzido ligado com a página aberta vale na
hora, a capa viva liga o hover uma vez por página (eram 13 cópias do script na home), os SVGs dos posts
ganham medidas e as tabelas de comparação, cabeçalhos de linha. Só a palavra apagada da frase em destaque
muda (`--ink-2`). Vem com os testes `scripts/frontend-*.mjs` e o workflow que os roda em cada PR.
Relatório em `docs/revisao-frontend-2026-10-03.md`.

Nome acessível dos livros, dos vizinhos, das tags e de Séries (D73, 02/10/2026, **publicado**): o resto
do achado do Lighthouse da D69 (`label-content-name-mismatch`). Nos 9 livros da home, nos vizinhos da
página de um livro, nas 22 tags da nuvem e no livro de Séries, o `aria-label` saiu e o mesmo texto entrou
num `.sr` dentro do link: o leitor de tela ouve o mesmo nome. Na home, o `content-visibility` dos dois
primeiros quadros desceu do link para o livro (senão o link ficava sem nome até o script chegar) e o link
ganhou `position: relative` (sem ele, o `.sr` mexia na suavização de um livro). Os quatro lugares saem da
auditoria no dev e no build, a `link-name` passa, os nomes na árvore de acessibilidade são os mesmos e
nenhuma das 104 fotos (seis peças, de 320 a 1600px, dois temas, mouse e foco) muda. A regra nova está em
`.claude/rules/interface.md`. Feito na worktree `.claude/worktrees/wonderful-pike-800bfd` (branch
`claude/wonderful-pike-800bfd`) e publicado a pedido do Cesar; o primeiro item da pergunta 14 saiu.

Apresentação de um post (D74, 02/10/2026, **publicado**): o Cesar gostou da apresentação do post dos mods,
feita no estilo do blog, e pediu que toda apresentação saia assim. Ela sai em `.pptx` (e PDF), com os
desenhos, os prints e as marcações da caneta do próprio post e as notas do apresentador: skill
`apresentacao` (modo Criar) e as ferramentas de `scripts/slides/` (a biblioteca do estilo, as fotos do
post, a conferência, as fontes em TTF e o roteiro de cada post, a começar pelo dos mods). O que sai fica
em `saida/`, fora do git.

Post de Parquet e snapshots (D75, 03/10/2026): `parquet-snapshot-banco-de-dados`, no livro Dados,
formato resumo, com infográfico de quatro quadros, capa viva, sete marcações da caneta e fontes
conferidas. Distingue formato colunar, consistência da extração e recuperação por backup.
A seção de pronúncia e as fontes de dicionários foram removidas a pedido do Cesar em 04/10/2026.
Revisado antes da publicação na `main`, solicitada expressamente pelo Cesar.
`check`, `build`, `links`, contraste, validação dos SVGs e conferência nas dez combinações de
largura/tema passaram; movimento reduzido também. A foto do livro Dados agora registra três artigos.
Relógio da capa corrigido em 03/10/2026 a pedido do Cesar: eixo fixo no centro, ponteiros separados
e avanço proporcional de cinco minutos no hover, com retorno suave. `check`, `build`, `links`,
validador e revisão dos desenhos passaram; eixo e proporção conferidos no navegador durante o
movimento e com movimento reduzido, com trace de CPU 4× sem tarefas longas durante o giro.

## Como ver

- Dev: `fnm exec --using=24 npm run dev -- --host 127.0.0.1` (<http://127.0.0.1:4322>); parar com
  `fnm exec --using=24 npx astro dev stop`. No dev a busca avisa que não há índice.
- Busca e PDFs: `npm run build` e `npm run preview -- --host 127.0.0.1 --port 4323`
  (<http://127.0.0.1:4323>); parar com `npx astro preview stop`.
- Só no dev: `/amostra/` (tokens, fontes, avisos), `/amostra/markdown/`, `/amostra/mdx/`,
  `/amostra/caneta/`, `/amostra/desenhos/`, `/amostra/livros/` e `/amostra/tags/`.
- Post de referência com ilustração, as lousas, a frase em destaque e a caneta:
  `/posts/cobranca-duplicada-no-retry/`.
- Exemplos da D58 (só local): `git switch exemplos-arquivo` em `../blog-exemplos`, dev com
  `--port 4330` e <http://127.0.0.1:4330/exemplos/>.
- Redesenho (D55, fora do git desde a D61): os modelos em <http://127.0.0.1:4400>, as cópias das
  rodadas 2 a 4 nas portas 4411 a 4430 e a versão final com as amostras em <http://127.0.0.1:4421>
  (`/amostras/`). Os comandos estão em `docs/redesenho/base.md`.

## O que existe (resumo)

| Rodada | O quê |
|---|---|
| Fases 1 a 7 (D1–D25) | base Astro 7, tokens, fontes, 26 posts migrados, rotas e redirecionamentos, busca (Pagefind), artigo completo, ilustrações e lousas, Lighthouse, deploy |
| D26–D34 | "Folhas claras", lista e cards, home paginada, livros da coleção, cabeçalho fixo, edição de estudo e revista, marca "cs", publicação |
| D35 | configuração de posts: skill `post`, `DESIGN.md`, `entrada/`, skills de terceiros, MCPs, `npm run setup` |
| D36–D45 | sumário sem números, auditoria de acabamento, livros em movimento (GSAP), tema em círculo, gaveta, caneta da leitura |
| D46–D47 | livros de lado, pilha, menu do celular, sem a lousa de passos, abertura do site |
| D48, D56 | a caneta do caderno (34 tipos de marcação, guia `docs/marcacoes.md`, skill `caneta`) |
| D49–D51 | ideias de movimento revistas, ajustes de 27/09, animações revistas (abertura, troca por folhas) |
| D52 | acabamento das animações, leitura, tags com ícone, destaque na grade, campo `codigo`, C04 e C05 |
| D58 | capa viva, figuras coloridas, `Lousa` nova, animação com play, ícones das ferramentas, print; os três primeiros posts revistos |
| D59 | a lousa no estilo das figuras (canetinha colorida), o destaque da legenda revisto e a revisão de todo desenho (`revisar.mjs`) |
| D60 | o escuro dos desenhos do corpo: painel um pouco acima da folha, caixas com cor, tinta menos branca |
| D55, D61 | o redesenho: 10 modelos, mais três rodadas e a versão final no ar (papel, tinta, latão e luz) |
| D62 | as cores dos temas de antes do redesenho, livros e séries separados nas páginas de um livro, a fileira que encolhe consertada |
| D63 | post detalhado (com TL;DR recolhível) ou resumo (com infográfico), combinado antes de escrever, e links ao longo do texto |
| D64 | as marcas: regra de marca de cada logo conferida e registrada; só o Kubernetes redesenhado; ícones genéricos no lugar dos outros |
| D65 | os controles em prova nos posts: marca-texto, caderno e post-it, cada um numa lousa de passos, numa de comparação e numa animação |
| D66 | o post dos mods ("Quanto custou cada agente?"), o primeiro do livro IA: prints parados do cockpit, tags Claude Code e Plugins, e o print largo que rola de lado no celular |
| D67 | figura em passos (em prova): um formato só no lugar da lousa de passos, da de comparação e da animação com play |
| D68 | pedido do Cesar num post termina na pergunta "vira regra para os próximos posts?" |
| D69 | o botão da busca do cabeçalho com o nome vindo do texto "Buscar" (sem `aria-label`), para a auditoria de nome do Lighthouse passar sem mudar a aparência |
| D70 | tabelas no celular: piso de 11em na coluna de texto, respiro menor, a tabela do `<details>` de borda a borda e o aviso "Arraste para o lado" |
| D71 | as regras de escrita do post (título, descrição, TL;DR, abertura, sem primeira pessoa), o post em partes e o post dos mods dividido em parte 1 e parte 2 |
| D72 | a tinta do seletor Lista / Cards com a caixa só em volta do botão ativo, para o falso positivo de contraste do Lighthouse sumir (nota 100) sem mudar a aparência nem o movimento |
| D73 | o nome dos livros da home, dos vizinhos, das tags e do livro de Séries vindo de um texto `.sr`, sem `aria-label`, com o `content-visibility` da home no livro, e não no link |
| D74 | a apresentação de um post no estilo do blog: `.pptx` com os desenhos e a caneta do próprio post e as notas do apresentador (skill `apresentacao`, `scripts/slides/`) |
| D76 | a revisão técnica do frontend (PR #3): animações que cancelam a anterior, movimento reduzido na hora, a capa viva uma vez por página, medidas dos SVGs, cabeçalhos de linha nas tabelas e os testes `frontend-*` |

## Próximos passos

0. **Lembrete da D63:** o Cesar aprovou as duas partes do post dos mods (D71, publicadas); falta só
   ele dizer se o TL;DR recolhível e os links ao longo do texto ficam como estão. Com a resposta, tirar
   o lembrete da skill `post` e este item.
1. **Documentos do visual novo (D61):** reescrever o `DESIGN.md` inteiro para "papel e luz" (hoje a
   seção da D61 vence as antigas, e no resto só os valores mudaram) e o `docs/briefing.md` §4 a §7 no
   mesmo passo; conferir também `docs/movimento.md` (a abertura, a cortina e as chegadas mudaram).
2. **Revisão em lote dos posts** (`.claude/revisao-posts.md`): 26 pendentes pela skill `post`, modo
   Adaptar, cada um terminando na caneta (skill `caneta`, com a proposta aprovada antes). Com a D58
   aprovada, a revisão troca `LousaTempo` e `LousaLoop` pela `Lousa` ou pela animação com play.
3. **Blog antigo (D34):** os dois têm os mesmos artigos. Decidir entre `noindex` no novo até a
   virada, o antigo redirecionando para o novo ou a virada do domínio (`docs/virada.md`).
4. **Medir no site publicado:** busca (regra 4 da D2) e Lighthouse (o desempenho não é medido desde a
   D26; acessibilidade, boas práticas e SEO foram medidos no build na D69, em dez tipos de página, e na
   D73, nas 73 páginas, no desktop e no celular; os achados que sobraram estão na pergunta 14).
5. **Peso das páginas (B14):** 160 a 440 KB abertos, pelos SVGs embutidos; merece um item próprio.
6. **Página Sobre:** o Cesar escreve (D33). Até lá, `/about/` leva à home.
7. **`scripts/desenho/render.mjs` fotografa a abertura do site (D51)** em vez da folha de conferência:
   falta `reducedMotion: "reduce"` na página que ele abre (achado em 29/09/2026; contornado com uma
   cópia local).
8. **Tabelas no celular (D70, publicado):** olhar uma tabela larga no iPhone (o Safari não foi
   testado; a do "O cockpit", no post dos mods, serve). Quando a pergunta 16 fechar, apagar
   `.astro/depuracao/tabelas/` e a worktree `lucid-khayyam-cc18a1`.

## Perguntas abertas para o Cesar

0. **D54:** as perguntas do fim de `docs/ajustes-d54/controle.md` (chegada da folha longa no celular
   lento, voltar sem bfcache, trava de rolagem do menu, desfile de Categorias no celular,
   redirecionamentos em inglês, busca que volta aberta, textos dos slides e das tags, comportamentos
   novos e, da segunda varredura, a fonte padrão maior do navegador, o tema antigo por ~0,25s ao voltar
   pelo histórico, o clique duplo no tema e as menores). Respondidas, o controle vai para
   `docs/historico/`. E conferir no iPhone o livro que tomba na estante (item 42).

Escolhas feitas para não parar; todas voltam atrás com pouco trabalho.

1. **Capa na gaveta:** a referência tinha a cor do livro em cima; hoje, pela D39, o papel fica em
   cima. E o título em duas partes vale também na gaveta e no "anterior / próximo"?
2. **Literata com `opsz`** (107,5 KB) pesa no celular; a versão só com peso tem 51 KB e anteciparia o
   primeiro texto em ~0,5 s. Troca?
3. **Tempos longos (D51):** o desfile de Categorias (~3,3 s) fica? A troca pela pilha da home e a
   navegação com a busca ou o livro ampliado abertos passam para a troca nova?
4. **Ícones das tags (B11):** as metáforas menos óbvias (semáforo para Concorrência, moedor de café
   para JVM, espeto de notas para AOP, âncora para LTS) e a marca d'água girada −8° na página da tag.
5. **Aceno dos cadernos (B13):** com o destaque abaixo da dobra, o aceno vem logo depois da estante.
6. **Caneta preta (C04):** o colchete da lista e o círculo da paginação em preto (podem voltar ao
   azul); o traço dos links do rodapé segue azul (manter, preto ou tirar?); o visto no calendário
   (pode ler como "já lido"); o traço embaixo do "blog" no hover da marca; a assinatura ~5 s depois
   de abrir a home.
7. **Home (C02):** a primeira página tem 11 artigos (o destaque vale dois lugares). Muda a D27.
8. **Papelaria (C05):** o amarelo do post-it (claro `#FFF1BE`, escuro `#39372D`) e a cola dos
   atalhos sem o sublinhado azul animado do título.
9. **Carimbo "fontes conferidas em …"** no fim do artigo: pede um campo novo no frontmatter e a
   conferência post a post.
10. **Blocos de código com `content-visibility: auto`** (`prosa.css`): a altura estimada erra de −38 a
    +23px em 390px; depois de pular pelo sumário ou pelo "voltar ao topo" e rolar para cima, o Safari
    pode dar um salto único. Não é o sobe e desce que o Cesar viu. Troco por `contain-intrinsic-size`
    mais justo ou tiro o `content-visibility`?
11. **Marcas (D64), o que ficou para decidir:** o mascote Duke (licença BSD) redesenhado no lugar da
    xícara do Java? O arquivo oficial do MongoDB, do PostgreSQL e do Kafka no texto (precisa baixar os
    arquivos, com o seu OK)? Os ícones oficiais da AWS nos diagramas (só para cliente da AWS e sem
    alterar tamanho, cor ou forma)? Uma nota de marcas no rodapé ("os nomes de produtos citados são marcas
    dos respectivos donos; este blog não tem vínculo com eles"), que várias políticas pedem?
12. **Post dos mods (D66 e D71), o que ficou para decidir:**
    - os títulos das duas partes e a capa nova da parte 1 (a escada das peças): ficam?
    - os posts antigos fora das regras novas de escrita (as descrições acima de 160 caracteres, o título
      do Java 25 e o de criptografia acima do teto, a abertura de criptografia e a de data lake): ficam
      para a revisão em lote ou não se mexe?
    - o campo `codigo` do post apontando para o `claude-code-kit` (hoje ele é só do `blog-exemplos`)?
    - a branch local `post-claude-code-mod` (vazia, criada na pasta do projeto antes da worktree) e a
      worktree `.claude/worktrees/post-do-claude-md-ao-mod` podem ser apagadas depois da publicação.
13. **Figura em passos (D67):** aprova o formato (`/animacoes-test-2/`)? Se sim, ele vira a `Figura` com
    `passos`, as lousas e animações dos posts são refeitas nele pela revisão dos posts e as páginas de
    teste e a dos controles (D65) saem do ar. A lousa da instalação do post dos mods, que a auditoria
    julgou ruim (três histórias numa peça), não está entre as 9: refaço também? E qual aviso de "o
    passo terminou" fica, das cinco ideias no fim da página (a sugestão é a 1, o Próximo que se enche,
    ou ela com a 5, os traços embaixo da figura)?
14. **Lighthouse fora do cabeçalho (achados da D69, que já estão no ar):**
    - o Lighthouse mede o contraste no meio das animações de entrada (home, arquivo e Tags) e acusa
      valores que somem com a página assentada. Fica como está?
    - a worktree `.claude/worktrees/kind-shaw-14748f` (a da D69) pode ser apagada: a D69 já está na `main`.
15. **Nome acessível (D73), o que ficou para decidir:**
    - o link do nome embaixo de cada livro da home leva ao mesmo lugar que o livro (dois links por livro
      para o teclado e o leitor de tela, desde que a gaveta saiu da home) e o Chrome calcula o nome dele
      com um espaço antes da vírgula ("Vol. 01: Arquitetura de Software , página do livro"). Tiro o nome
      do caminho do teclado e do leitor de tela (`tabindex="-1"` e `aria-hidden`, como o ícone das fichas
      de Tags), ou fica como está?
    - o MCP `chrome-devtools` usa um perfil de Chrome só para todas as sessões: com várias abertas, só a
      primeira abre o navegador (em 02/10/2026, a da D69 prendeu o perfil e duas sessões contornaram).
      Ponho `--isolated` no `.mcp.json`, para cada sessão abrir o seu?
    - você confirma a origem do repositório no app (Ajuda → Troubleshooting → Review Pinned Git Origins)?
      Sem isso, a ferramenta que traz a `main` para as worktrees recusa sempre que a `main` mexe em
      `.claude/skills`.
    - a worktree `.claude/worktrees/wonderful-pike-800bfd` (a da D73) pode ser apagada: a D73 já está na
      `main`.
16. **Tabelas no celular (D70), o que ficou para decidir:**
    - a coluna de lista curta: o piso do texto tira largura da coluna vizinha. Na tabela do JWT, em 430
      e 480px, a coluna `alg` (`HS256 / HS384 / HS512`) fica com um item por linha, e a tabela sobe de
      580 para 674px. Um degrau menor (6,5em) para a coluna com menos de 30 letras e 4 palavras ou mais
      leva essa tabela a 534px, mas mexe em 21 colunas e faz 3 tabelas a mais rolarem em 360px. Entra?
    - o tablet: em 768px, quatro tabelas largas (duas de quatro colunas, a de cinco e a de sete)
      continuam rolando com coluna de texto abaixo de 160px, porque o piso só vale até 700px (ele
      melhoraria três delas). Estendo o piso para qualquer largura?
    - o conteúdo: duas tabelas do `java-29` têm célula com parágrafo (219 e 463 letras), e a linha
      continua com 253 e 417px. Viram texto ou lista na revisão do post?
    - a regra para os próximos posts (D68): "célula de tabela é para frase curta, e cabeçalho curto"
      entra na skill `post`, em Recursos de Markdown?

## Riscos a acompanhar

- A `main` local da worktree `../blog-exemplos` ficou atrás da remota: a D61 foi publicada de outra
  branch (`redesenho-final`), com push direto para a `origin/main`. Antes de mexer lá, `git pull`.

- Tremor (`feTurbulence`) nas lousas animadas: 60 quadros por segundo no Chrome desta máquina com CPU
  4× e DPR 3; falta um iPhone de verdade. Plano B: gravar o tremor na geometria, no build.
- A imagem de compartilhamento precisa de Chrome no build (D10); os runners do GitHub Actions têm.
- `prerender` nas regras de especulação (B14) fica para depois: exigiria revisar os scripts que rodam
  ao carregar (abertura, desenhos, contagem de visitas).
