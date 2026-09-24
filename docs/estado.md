# Estado do projeto

Este arquivo é um painel, não um diário: fase atual, o que está pronto, próximos passos e perguntas
abertas. O que for aprovado sai daqui e fica no histórico do git e em `docs/decisoes.md`.

## Fase atual

**Fases 1 a 7 prontas em 24/09/2026, só local.** No mesmo dia entrou o ajuste visual "Folhas claras"
(D26, briefing §4) e, depois, a lista e os cards no formato antigo com a home paginada (D27) e o
painel lateral com as pilhas de livros (D28) e a página de categoria (D29). Tudo isso **aguarda a
aprovação do Cesar** (antes e depois mostrados a ele). A virada do
domínio (`docs/virada.md`) só acontece com o OK dele; nada foi commitado nem publicado.

## Como ver

- `fnm exec --using=24 npm run dev -- --host 127.0.0.1`: o Astro 7 sobe em segundo plano (hoje <http://127.0.0.1:4322>).
  Para parar: `fnm exec --using=24 npx astro dev stop`. No dev a busca avisa que não há índice.
- Busca e PDFs: `npm run build` e `npm run preview -- --host 127.0.0.1 --port 4323` (hoje no ar em
  <http://127.0.0.1:4323>; para parar, `npx astro preview stop`).
- Só no dev: `/amostra/` (tokens, fontes, avisos), `/amostra/markdown/` e `/amostra/mdx/` (recursos
  de Markdown) e `/amostra/desenhos/` (folha das ilustrações).
- Post de referência com ilustração e as três lousas: `/posts/cobranca-duplicada-no-retry/`.

## Pronto

- **Fases 1 a 3:** base Astro 7 + TS 6, tokens (D4), fontes (D5), tema (D24); os 26 posts migrados
  (D15), rotas, RSS, sitemap e redirecionamentos (D7); busca com Pagefind (D2); home com estante,
  gaveta, destaque, recentes e tags.
- **Fase 4:** artigo com sumário, notas laterais, avisos, código, barra de leitura, voltar ao topo,
  visor de imagens e apresentação com PDF (D9).
- **Fase 5:** ilustração com recortes (D11), validador, centralizador e folha de conferência; imagem
  de compartilhamento pelo Chrome (D10); as três lousas e a frase em destaque (D21).
- **Fase 6:** os 26 posts com ilustração (8 da série Java por script, D17; 17 desenhados um a um).
- **Fase 7:** Lighthouse no celular: home 94, posts 89 a 91, arquivo 99 em desempenho; 100 no resto.
  Teclado, foco visível, revisão nos dois temas e no celular. Deploy e plano de virada prontos.
- **Ajuste visual (D26):** tokens novos, folhas, azul-tinta no que é clicável, IBM Plex Sans na
  interface, desenhos em painéis tingidos, busca como campo, botão de tema, sumário à esquerda com a
  barra "NN% lido" embaixo, largura do blog atual (1320px) e as 27 imagens de compartilhamento
  regeradas. Conferido: `astro check` 0/0/0, build (`--force`), links (0 quebrados), contraste
  (0 falhas), validador (29 de 29), sem rolagem lateral em 390 e 320 px.
- **Lista, cards e paginação (D27):** no formato do blog atual (título inteiro e grande, descrição
  completa, tags) e a home paginada de 12 em 12 (`/`, `/2/`, `/3/`), no lugar do link para todos os
  artigos.
- **Painel lateral da home (D28):** séries e categorias em pilhas de livros deitados (os mesmos da
  estante), as 10 tags mais usadas e o RSS, à esquerda da lista, parado enquanto a lista rola.
- **Página de categoria (D29):** o livro em pé no topo, que chega da pilha do painel por transição
  de página; embaixo, os artigos com Lista / Cards.

## Próximos passos

1. Aprovação do ajuste visual (D26 a D29) e retoques; depois, medir o Lighthouse de novo (a
   fonte da interface soma 45,7 KB, e ele não foi medido depois do ajuste).
2. Pensar com o Cesar as telas de série e de tag (a de categoria está pronta, D29).
3. Revisão geral do Cesar; com o OK dele, primeiro commit e a virada (`docs/virada.md`).

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
