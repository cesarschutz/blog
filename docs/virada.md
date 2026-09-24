# Plano de virada: o domínio passa a servir o blog novo

**Nada daqui é executado sem o OK do Cesar.** O blog atual (`cesarschutz/cesarschutz.github.io`,
servido em `cesarschutz.com.br`) continua no ar até a última etapa, e a volta atrás é um revert.

## Caminho recomendado: trocar o conteúdo do mesmo repositório

O repositório atual já tem o GitHub Pages por Actions, o domínio próprio e o certificado HTTPS.
Trocar o conteúdo dele mantém tudo isso sem mexer em DNS. A alternativa (repositório novo e mudar o
domínio de lugar) exige remover o domínio de um repositório e pôr no outro, com risco de o site ficar
sem HTTPS por algumas horas enquanto o certificado é reemitido.

## Antes da virada

1. **Revisão do Cesar** no dev (`npm run dev`) e no build (`npm run build` + `npm run preview`),
   com os ajustes que ele pedir.
2. **Conteúdo em dia.** A migração partiu do commit `0184562`. Conferir se o blog atual ganhou
   posts depois disso (`git -C <clone novo> log 0184562..origin/main`) e migrar os que faltarem.
3. **Validação final** (todos com `fnm exec --using=24`): `npm run check`, `npm run build`,
   `npm run links`, `npm run contraste`, `node scripts/desenho/validar.mjs`.
4. **Primeiro commit do projeto novo**, com a identidade pessoal (Cesar Schutz
   <cesarschutz340@gmail.com>), só quando o Cesar pedir.

## A virada (com o OK do Cesar)

1. Num clone **novo** do repositório (nunca na pasta `../blog-atual`), criar a branch `blog-novo`
   e trocar o conteúdo pelo deste projeto, incluindo `.github/workflows/deploy.yml`.
   O workflow é o mesmo do blog atual (`withastro/action` com Node 24 e `deploy-pages`).
2. Abrir o PR, conferir que o job de build passa. Ele precisa do Chrome do runner para as imagens
   de compartilhamento (D10); sem Chrome, o build falha com mensagem clara.
3. Fazer o merge em `main`. O deploy leva alguns minutos. Se ficar preso na fila, cancelar e
   reexecutar o workflow (`gh run rerun`).

## Depois da virada (no mesmo dia)

- Conferir em `cesarschutz.com.br`: home, um post de cada tipo (Markdown, MDX com lousas,
  apresentação com PDF), `/rss.xml`, `/sitemap-index.xml`, `/og/<slug>.png`.
- Conferir os 20 redirecionamentos (`/about/` → `/sobre/#como-os-artigos-sao-produzidos`,
  `/posts/java-NN/` → a LTS, `/2/` e `/3/` → `/archive/`, `/projects/`, `/exercicios`).
- Medir a busca no Pages de verdade (regra 4 da D2) e rodar o Lighthouse no domínio.
- RSS: os links dos posts não mudaram, então leitores de feed não devem ver itens repetidos.
- Search Console: reenviar `sitemap-index.xml` e acompanhar os 404 da primeira semana.

## Volta atrás

Se algo essencial quebrar, reverter o merge em `main` (`git revert -m 1 <merge>`) e deixar o
workflow publicar o blog atual de novo. Nenhum dado se perde: o conteúdo antigo continua no
histórico do repositório.
