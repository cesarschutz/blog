# Plano de virada: o domínio passa a servir o blog novo

> **Mudou em 25/09/2026 (D34):** o blog novo foi publicado num repositório próprio
> (`cesarschutz/blog`), em `blog.cesarschutz.com.br`, e o blog atual segue em `cesarschutz.com.br`.
> Este plano (levar o blog novo para o domínio principal) fica para quando o Cesar quiser aposentar o
> blog antigo; aí há também a opção mais simples de fazer o antigo redirecionar para o novo.

**Nada daqui é executado sem o OK do Cesar.** O blog atual (`cesarschutz/cesarschutz.github.io`,
servido em `cesarschutz.com.br`) continua no ar até a última etapa, e a volta atrás é um revert.

## Caminho recomendado: trocar o conteúdo do mesmo repositório

O repositório atual já tem o GitHub Pages por Actions, o domínio próprio e o certificado HTTPS.
Trocar o conteúdo dele mantém tudo isso sem mexer em DNS. A alternativa (repositório novo e mudar o
domínio de lugar) exige remover o domínio de um repositório e pôr no outro, com risco de o site ficar
sem HTTPS por algumas horas enquanto o certificado é reemitido.

## Antes da virada

1. **Conteúdo em dia.** A migração partiu do commit `0184562`. Conferir se o blog atual ganhou
   posts depois disso (`git -C <clone novo> log 0184562..origin/main`) e migrar os que faltarem.
2. **Validação final** (todos com `fnm exec --using=24`): `npm run check`, `npm run build`,
   `npm run links`, `npm run contraste`, `node scripts/desenho/validar.mjs` e os testes do frontend
   (`npm run frontend`, depois do build).

## A virada (com o OK do Cesar)

1. Num clone **novo** do repositório (nunca na pasta `../blog-atual`), criar a branch `blog-novo`
   e trocar o conteúdo pelo deste projeto, incluindo `.github/workflows/deploy.yml`.
   O workflow é o mesmo do blog atual (`withastro/action` com Node 24 e `deploy-pages`).
2. Abrir o PR, conferir que o job de build passa. Ele precisa do Chrome do runner para as imagens
   de compartilhamento (D10); sem Chrome, o build falha com mensagem clara.
3. Fazer o merge em `main`. O deploy leva alguns minutos. Se ficar preso na fila, cancelar e
   reexecutar o workflow (`gh run rerun`).

## Depois da virada (no mesmo dia)

- Conferir em `cesarschutz.com.br`: home, um post de cada tipo (Markdown, MDX com figuras,
  apresentação com PDF), `/rss.xml`, `/sitemap-index.xml`, `/og/<slug>.png`.
- Conferir os redirecionamentos, que são os do `astro.config.mjs` (o `npm run links` confere todos no
  `dist/`), e a lista do `CLAUDE.md` ("URLs que não podem quebrar"): `/about/`, `/projects/` e
  `/exercicios` → `/`; `/posts/java-NN/` → a LTS; `/java/` → `/series/java/`;
  `/categories/Arquitetura/`, `/Java/` e `/Observabilidade/` → o livro novo; `/categories/Carreira/` →
  `/categories/`; `/tags/Pagamentos/` → `/tags/Cobrança/`. `/2/` e `/3/` são páginas da home, não
  redirecionamentos.
- Medir a busca no Pages de verdade (regra 4 da D2) e rodar o Lighthouse no domínio.
- RSS: os links dos posts não mudaram, então leitores de feed não devem ver itens repetidos.
- Search Console: reenviar `sitemap-index.xml` e acompanhar os 404 da primeira semana.

## Volta atrás

Se algo essencial quebrar, reverter o merge em `main` (`git revert -m 1 <merge>`) e deixar o
workflow publicar o blog atual de novo. Nenhum dado se perde: o conteúdo antigo continua no
histórico do repositório.
