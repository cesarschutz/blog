# As fases do começo do projeto (antiga seção 10 do briefing)

A seção 10 do `docs/briefing.md` até a faxina da D84 (05/10/2026). As fases 0 a 7 terminaram com o blog
publicado (D1 a D25; publicação na D34). O texto fica aqui como estava, só para consulta; as regras que
continuam valendo (mostrar o que foi feito ao fim de cada bloco, a virada só com o OK do Cesar) estão
na seção 10 do briefing, no `CLAUDE.md` e no `docs/virada.md`.

## Fases

Trabalhe por fases. **No fim de cada fase, pare**: mostre o que foi feito, como ver
(`npm run dev` e as páginas para abrir), o que ficou pendente, e espere o Cesar aprovar
antes de seguir. Atualize `docs/estado.md` ao fechar cada fase.

0. **Preparação**: ler este briefing, as referências e o `CLAUDE.md` do blog atual; clonar o
   blog atual em `../blog-atual`; propor stack e plano de busca com critérios; criar
   `CLAUDE.md`, `docs/estado.md`, `docs/decisoes.md`, `docs/estilo-desenho.md`, as skills e as
   regras (esqueleto, completados ao longo das fases). Listar dúvidas.
1. **Base**: projeto, tokens, fontes, layout, cabeçalho, rodapé, tema com anti-piscada,
   página `/sobre/` mínima, deploy de pré-visualização configurado (sem trocar o domínio).
2. **Conteúdo e rotas**: migração dos 26 posts, esquema do frontmatter, categorias, tags,
   séries, `/java/`, todos os artigos, redirecionamentos, RSS, sitemap, JSON-LD, busca.
3. **Home**: estante completa, destaque, lista e cards, tags.
4. **Artigo**: topo, sumário, notas laterais, avisos, código, barra de leitura,
   compartilhar, aviso de IA, navegação, apresentação, lightbox.
5. **Desenho e lousas**: definições globais, recortes, imagem de compartilhamento, scripts de
   validação e render, os três componentes de lousa e a frase em destaque. Recriar o artigo
   de idempotência com ilustração e lousas como post de referência.
6. **Ilustrações dos posts existentes**, em lotes conferidos.
7. **Qualidade e publicação**: Lighthouse, acessibilidade (teclado, foco visível, contraste,
   leitores de tela), `astro check` (ou equivalente) sem erros, revisão visual claro/escuro e
   celular, links. Plano para apontar o domínio para o novo site, **executado só com o
   OK do Cesar**.
