# Estado do projeto

Painel, não diário: fase atual, próximos passos, perguntas abertas e riscos. O detalhe de cada rodada
fica em `docs/decisoes.md` (D1 a D52) e no histórico do git; controles de rodadas fechadas, em
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

## Como ver

- Dev: `fnm exec --using=24 npm run dev -- --host 127.0.0.1` (<http://127.0.0.1:4322>); parar com
  `fnm exec --using=24 npx astro dev stop`. No dev a busca avisa que não há índice.
- Busca e PDFs: `npm run build` e `npm run preview -- --host 127.0.0.1 --port 4323`
  (<http://127.0.0.1:4323>); parar com `npx astro preview stop`.
- Só no dev: `/amostra/` (tokens, fontes, avisos), `/amostra/markdown/`, `/amostra/mdx/`,
  `/amostra/caneta/`, `/amostra/desenhos/`, `/amostra/livros/` e `/amostra/tags/`.
- Post de referência com ilustração, as lousas, a frase em destaque e a caneta:
  `/posts/cobranca-duplicada-no-retry/`.

## O que existe (resumo)

| Rodada | O quê |
|---|---|
| Fases 1 a 7 (D1–D25) | base Astro 7, tokens, fontes, 26 posts migrados, rotas e redirecionamentos, busca (Pagefind), artigo completo, ilustrações e lousas, Lighthouse, deploy |
| D26–D34 | "Folhas claras", lista e cards, home paginada, livros da coleção, cabeçalho fixo, edição de estudo e revista, marca "cs", publicação |
| D35 | configuração de posts: skill `post`, `DESIGN.md`, `entrada/`, skills de terceiros, MCPs, `npm run setup` |
| D36–D45 | sumário sem números, auditoria de acabamento, livros em movimento (GSAP), tema em círculo, gaveta, caneta da leitura |
| D46–D47 | livros de lado, pilha, menu do celular, sem a lousa de passos, abertura do site |
| D48 | a caneta do caderno (20 tipos de marcação, guia `docs/marcacoes.md`, skill `caneta`) |
| D49–D51 | ideias de movimento revistas, ajustes de 27/09, animações revistas (abertura, troca por folhas) |
| D52 | acabamento das animações, leitura, tags com ícone, destaque na grade, campo `codigo`, C04 e C05 |

## Próximos passos

1. **Revisão em lote dos posts** (`.claude/revisao-posts.md`): 26 pendentes pela skill `post`, modo
   Adaptar, cada um terminando na caneta (skill `caneta`, com a proposta aprovada antes).
2. **Blog antigo (D34):** os dois têm os mesmos artigos. Decidir entre `noindex` no novo até a
   virada, o antigo redirecionando para o novo ou a virada do domínio (`docs/virada.md`).
3. **Medir no site publicado:** busca (regra 4 da D2) e Lighthouse (não medido desde a D26).
4. **Peso das páginas (B14):** 160 a 440 KB abertos, pelos SVGs embutidos; merece um item próprio.
5. **Página Sobre:** o Cesar escreve (D33). Até lá, `/about/` leva à home.

## Perguntas abertas para o Cesar

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

## Riscos a acompanhar

- Tremor (`feTurbulence`) nas lousas animadas: 60 quadros por segundo no Chrome desta máquina com CPU
  4× e DPR 3; falta um iPhone de verdade. Plano B: gravar o tremor na geometria, no build.
- A imagem de compartilhamento precisa de Chrome no build (D10); os runners do GitHub Actions têm.
- `prerender` nas regras de especulação (B14) fica para depois: exigiria revisar os scripts que rodam
  ao carregar (abertura, desenhos, contagem de visitas).
