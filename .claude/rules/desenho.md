---
paths:
  - "src/ilustracoes/**"
  - "src/lousas/**"
  - "src/figuras/**"
  - "src/animacoes/**"
  - "src/marcas/**"
---

# Arquivos de desenho

Antes de criar ou alterar um desenho, leia `docs/estilo-desenho.md` (estilo). Depois, siga a skill
certa:
- `desenho`, para a capa do post (`src/ilustracoes/`), com o detalhe da capa viva (`mexe-*`);
- `lousa`, para as lousas (`src/lousas/`), com o componente `Lousa`;
- `figura`, para as figuras coloridas (`src/figuras/`), as animações com play (`src/animacoes/`, o
  SVG do quadro final e o `.ts` do movimento) e os logos das ferramentas (`src/marcas/`).

Todo desenho do corpo do post é apresentado no texto, que diz o que olhar nele (D58).

O que nunca pode:
- cor fixa, `style=`, `stroke-width`, degradê, sombra, `<image>`, `marker`, fonte de letra de mão,
  emoji ou texto demais;
- `id` ou `<defs>` próprios (filtros e padrões ficam definidos uma vez no layout);
- texto dentro do grupo que treme (`.tinta` na capa, nas figuras e nas lousas da D59; `.traco` só nas
  lousas antigas); nas figuras e nas animações, o que se move também fica fora dele (na capa, o
  `<g class="mexe-*">` fica dentro);
- lousa nova no estilo antigo do quadro: a `Lousa` usa o estilo das figuras (D59);
- numa figura com legenda, parte de um ator fora do grupo do tom dele, referência (o cabeçalho) fora de
  um `<g class="referencia">`, ou detalhe que se mexe animando `opacity` (o destaque da legenda deixaria
  de funcionar);
- nas figuras, um tom de fora dos seis `tom-*`, ou o vermelho num ator comum; na capa, mais de uma
  cor;
- aceitar o desenho sem passar no validador (`node scripts/desenho/validar.mjs <slug>`; os logos,
  `validar.mjs marcas`) e sem conferir o render ou a foto, claro e escuro;
- mostrar ao Cesar um desenho sem a revisão (D59): `node scripts/desenho/revisar.mjs <slug>` limpo e
  as fotos dele olhadas pelo checklist da skill `figura`, depois de terminar e depois de cada ajuste;
- logo de ferramenta (no texto ou num desenho) sem a regra de marca conferida e registrada em
  `src/marcas/regras.json` (D64), ou de um jeito que a regra não permite (redesenhar o que pede o
  arquivo oficial, mostrar o que pede só o nome). Marca nova: ler a política oficial do dono e registrar
  antes; já registrada e permitida, usar direto. Sem permissão, ícone genérico da casa.
