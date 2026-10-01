# Estado do projeto

Painel, não diário: fase atual, próximos passos, perguntas abertas e riscos. O detalhe de cada rodada
fica em `docs/decisoes.md` (D1 a D60) e no histórico do git; controles de rodadas fechadas, em
`docs/historico/`.

## Fase atual

**No ar desde 25/09/2026 em <https://blog.cesarschutz.com.br>** (repositório `cesarschutz/blog`,
D34): todo push na `main` publica. O blog antigo continua em `cesarschutz.com.br` (`docs/virada.md`).

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

Coleções (01/10/2026, branch `claude/magical-einstein-tneg5o`): o Cesar viu as cinco sugestões
(<https://claude.ai/code/artifact/564ccedf-bf19-48f1-be36-cb247408a804>) e **decidiu (D61)**: a sugestão
5 mais Frontend, 13 livros, Carreira sai, os livros de hoje mantêm o nome, volumes em ordem alfabética,
a tag Pagamentos pode ser renomeada ou removida (vai virar Cobrança), e desenhos, cores, frases e textos
novos para os 13. **Pronto e aguardando o OK dele:** a página final
(<https://claude.ai/code/artifact/a08fa29f-5a3d-45ec-bcaf-7d0f13ab12a5>; no dev, `/amostra/colecoes/final/`),
com o conjunto novo de desenhos ("O mesmo problema, um século antes": a máquina que fazia o trabalho do
livro antes do software), as 13 cores, as frases e os textos. Cada desenho tem um texto em duas versões (completa e curta) com o que ele é, a
data e a relação com o assunto, para um possível hover no site. Controle, direção de arte, textos,
crítica e o passo a passo para aplicar no site em `docs/prototipos/colecoes/final/`. Já valem a regra
dos posts (conferir se a coleção ainda serve e avisar, na skill `post`) e os volumes em ordem
alfabética (`CAPAS.md`). Nada muda no site antes do OK na página final.

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

## Próximos passos

1. **Revisão em lote dos posts** (`.claude/revisao-posts.md`): 26 pendentes pela skill `post`, modo
   Adaptar, cada um terminando na caneta (skill `caneta`, com a proposta aprovada antes). Com a D58
   aprovada, a revisão troca `LousaTempo` e `LousaLoop` pela `Lousa` ou pela animação com play.
2. **Blog antigo (D34):** os dois têm os mesmos artigos. Decidir entre `noindex` no novo até a
   virada, o antigo redirecionando para o novo ou a virada do domínio (`docs/virada.md`).
3. **Medir no site publicado:** busca (regra 4 da D2) e Lighthouse (não medido desde a D26).
4. **Peso das páginas (B14):** 160 a 440 KB abertos, pelos SVGs embutidos; merece um item próprio.
5. **Página Sobre:** o Cesar escreve (D33). Até lá, `/about/` leva à home.
6. **`scripts/desenho/render.mjs` fotografa a abertura do site (D51)** em vez da folha de conferência:
   falta `reducedMotion: "reduce"` na página que ele abre (achado em 29/09/2026; contornado com uma
   cópia local).

## Perguntas abertas para o Cesar

00. **Coleções (D61):** aprovar a página final dos 13 livros
    (<https://claude.ai/code/artifact/a08fa29f-5a3d-45ec-bcaf-7d0f13ab12a5>) e responder o que ela
    deixa para ele: a marca "cs" acompanha a Arquitetura no azul ou fica verde; as seis frases de hoje
    que ficam (ou as alternativas); o Turco no IA. Depois, aplicar no site pelo passo a passo do fim de
    `docs/prototipos/colecoes/final/controle.md`.
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
10. **Lousa `tempo` da idempotência:** a linha que marca o instante passa por cima dos rótulos
    "pede", "cobra" e "tenta de novo" (achado pela `/amostra/lousas/`). Corrige?
11. **`LousaTempo` fora da tela e no toque (achados de 29/09/2026):** pausar o loop quando a lousa sai
    da tela, como a `LousaLoop` já faz (economiza bateria), e, no celular, só tomar o gesto do desenho
    depois de um movimento horizontal (hoje o toque que só queria rolar leva a lousa para outro
    instante). Faço? A `Lousa` da D58 já faz os dois; a pergunta vale para os posts antigos até serem
    revistos.
12. **Blocos de código com `content-visibility: auto`** (`prosa.css`): a altura estimada erra de −38 a
    +23px em 390px; depois de pular pelo sumário ou pelo "voltar ao topo" e rolar para cima, o Safari
    pode dar um salto único. Não é o sobe e desce que o Cesar viu. Troco por `contain-intrinsic-size`
    mais justo ou tiro o `content-visibility`?
13. **Logos das ferramentas (D58):** os de AWS, Kubernetes, Java e outros são redesenhados à mão, e a
    C04 (D52) deixou GitHub e LinkedIn com as marcas oficiais porque as regras das duas proíbem
    redesenhar. Conferir as regras de marca dessas ferramentas antes de publicar, ou manter assim?

## Riscos a acompanhar

- Tremor (`feTurbulence`) nas lousas animadas: 60 quadros por segundo no Chrome desta máquina com CPU
  4× e DPR 3; falta um iPhone de verdade. Plano B: gravar o tremor na geometria, no build.
- A imagem de compartilhamento precisa de Chrome no build (D10); os runners do GitHub Actions têm.
- `prerender` nas regras de especulação (B14) fica para depois: exigiria revisar os scripts que rodam
  ao carregar (abertura, desenhos, contagem de visitas).
