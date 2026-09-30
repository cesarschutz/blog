# Livros realistas (protótipo)

Dez propostas de livros realistas para o blog: as mesmas capas, cores, desenhos e textos de hoje, com
forma, material, luz e sombra de objeto de verdade. Cada proposta é uma prancha SVG, e a galeria
(`index.html`) mostra as dez, cada uma com o seu texto.

Fica na branch `livros-realistas`, numa pasta separada do repositório (git worktree), para não
misturar com a `main`. Sem commit e sem push: só entra no site com o OK do Cesar.

## Como ver

```bash
cd docs/prototipos/livros-realistas
fnm exec --using=24 node ferramentas/servidor.mjs 4341
```

Abra <http://127.0.0.1:4341/>. O servidor é estático e só escuta em 127.0.0.1. A página precisa dele:
aberta como arquivo, ela não lê as pranchas.

- A galeria lê `pranchas/pNN-<nome>.svg` e, se existir, `pranchas/pNN-<nome>.json`. Os campos `nome`,
  `ideia`, `realismo`, `ondeEntra` e `notas` do JSON substituem os textos da lista fixa do `index.html`.
- Lê também as capturas de `hoje/` (`livro-3d.png`, `estante.png`, `pilha.png`); a que não existe fica
  de fora.
- Uma prancha que ainda não existe aparece como "Em produção", e a página confere de novo a cada 20 s.
  Prancha regravada: recarregue a página.
- Os controles do topo trocam o tema (claro ou escuro) e o fundo atrás das pranchas (a página ou a folha:
  no site, o livro 3D fica sobre a página e a estante, sobre uma folha branca). O `<object>` das pranchas
  tem `color-scheme: light`, senão o Chrome pinta um fundo opaco atrás do SVG transparente no tema escuro.
- O servidor responde 204 (e não 404) a um endereço com `?opcional` quando o arquivo não existe. É assim
  que a galeria descobre o que já foi gravado sem deixar erro no console.

## Como regenerar

1. Com o dev do blog no ar (padrão `http://127.0.0.1:4322`; `ENDERECO=…` troca):
   `fnm exec --using=24 node ferramentas/medir.mjs` grava `base/medidas.json`.
2. `fnm exec --using=24 node ferramentas/gerar-base.mjs` grava as peças planas em `base/`.
3. Cada prancha: `fnm exec --using=24 node pranchas/pNN-<nome>.mjs`. Para conferir:
   `fnm exec --using=24 node ferramentas/ver.mjs pranchas/pNN-<nome>.svg` (o PNG sai em `.render/`).

Sempre com `fnm exec --using=24` antes do `node`: o `node` do shell é outro. As ferramentas usam o
`playwright-core` e o `sharp` do `node_modules` do blog (`ferramentas/modulos.mjs`).

## Mapa da pasta

- `index.html`: a galeria (um arquivo só, CSS e JS inline, sem biblioteca).
- `fontes/`: Bitter e Newsreader (`fontes.css`, as que as pranchas carregam), Besley e IBM Plex Sans
  (`interface.css`, as da galeria) e as licenças.
- `base/`: as peças planas (capas, lombadas, folha com tudo), iguais ao site: `base.mjs` e `medidas.json`.
- `ferramentas/`: `servidor.mjs`, `ver.mjs`, `medir.mjs`, `gerar-base.mjs`, `cena.mjs` (câmera, luz e
  sombra das pranchas), `modulos.mjs` e `MANUAL.md` (o manual de quem desenha uma prancha).
- `pranchas/`: o `.mjs` (gerador), o `.svg` e o `.json` de cada prancha.
- `hoje/`: capturas do site como está hoje.
- `.render/`: PNGs de conferência (fora do git).
