# Estado do projeto

Este arquivo é um painel, não um diário: fase atual, o que está pronto, próximos passos e perguntas
abertas. O que for aprovado sai daqui e fica no histórico do git e em `docs/decisoes.md`.

## Fase atual

**Fases 1 a 7 prontas em 24/09/2026, só local. Aguardando a revisão do Cesar.** A virada do domínio
(`docs/virada.md`) só acontece com o OK dele; nada foi commitado nem publicado.

## Como ver

- `fnm exec --using=24 npm run dev`: o Astro 7 sobe em segundo plano (hoje <http://127.0.0.1:4322>).
  Para parar: `fnm exec --using=24 npx astro dev stop`. No dev a busca avisa que não há índice.
- Busca e PDFs: `npm run build` e `npm run preview -- --host 127.0.0.1 --port 4323` (hoje no ar em
  <http://127.0.0.1:4323>; para parar, `npx astro preview stop`).
- Só no dev: `/amostra/` (tokens, fontes, avisos), `/amostra/markdown/` e `/amostra/mdx/` (recursos
  de Markdown) e `/amostra/desenhos/` (folha das ilustrações).
- Post de referência com ilustração e as três lousas: `/posts/cobranca-duplicada-no-retry/`.

## Pronto

- **Fases 1 a 3:** base Astro 7 + TS 6, tokens (D4), fontes (D5), tema (D24); os 26 posts migrados
  como estão (D15), rotas, RSS, sitemap e redirecionamentos (D7); busca com Pagefind (D2: 2,7 s no
  celular simulado com 26 ou 1.000 posts; gabarito 14/14 e 5/5); home com estante, gaveta, destaque,
  recentes e tags.
- **Fase 4:** artigo com sumário lateral ou recolhível, notas laterais, avisos em Markdown, nome da
  linguagem no código, barra de leitura, voltar ao topo, visor de imagens e apresentação com PDF (D9).
- **Fase 5:** ilustração num SVG por post com recortes (D11), validador, centralizador e folha de
  conferência; imagem de compartilhamento pelo Chrome no build (D10); as três lousas e a frase em
  destaque, com quadro parado sem JS e no RSS (D21); post de idempotência refeito em MDX.
- **Fase 6:** os 26 posts com ilustração: a de referência, os 8 da série Java gerados pelo script de
  padrão fixo (D17, `scripts/desenho/java.mjs`) e 17 desenhados um a um, cada um sobre um objeto do
  texto (cadeados, token cortado em três, cronômetro do grace period, funil de envelopes, tachinha
  da carrier, livro-razão, maquininha sem registro…). Recortes centrados pelo `centrar.mjs`.
- **Fase 7:** Lighthouse no celular (build de produção): home 94, posts 89 a 91, arquivo 99 em
  desempenho; 100 em acessibilidade, boas práticas e SEO. CSS embutido no HTML (o LCP caiu ~0,2 s);
  passos da lousa com contraste. Teclado: ordem de foco lógica e contorno visível em tudo. Revisão
  visual de todas as páginas nos dois temas e no celular. Workflow de deploy pronto e plano de virada.
- Conferido: `astro check` 0/0/0, build, `npm run links` (80 páginas, 1.940 links, 0 quebrados),
  `npm run contraste` (0 falhas), validador (29 de 29 desenhos) e nenhuma rolagem lateral em 390 e 320 px.

## Próximos passos

1. Revisão do Cesar e os ajustes que ele pedir.
2. Com o OK dele: primeiro commit (identidade pessoal) e a virada, seguindo `docs/virada.md`.

## Perguntas abertas para o Cesar

1. O blog atual vai receber posts durante o projeto? A migração parte do commit `0184562` (conferido
   hoje: ainda é o último).
2. Confira no app do Google Drive se `~/Downloads` não está em "Backup de pastas do computador".
3. Desempenho no celular: o que mais pesa agora é a Literata com o eixo `opsz` (107,5 KB), exigida
   pelo briefing. A versão só com peso tem 51 KB e anteciparia o primeiro texto em ~0,5 s. Troca?

## Riscos a acompanhar

- Tremor (`feTurbulence`) nas lousas animadas: medido com CPU 4× e DPR 3 no Chrome desta máquina,
  60 quadros por segundo (2 quadros lentos em 259). Falta conferir num iPhone de verdade.
  Plano B, se pesar: gravar o tremor na própria geometria, no build.
- A imagem de compartilhamento precisa de Chrome no build (D10); os runners do GitHub Actions têm.
- A busca não foi medida no GitHub Pages real (regra 4 da D2): conferir quando houver deploy.
