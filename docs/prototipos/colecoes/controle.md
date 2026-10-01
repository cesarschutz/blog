# Coleções: cinco sugestões de livros (controle da rodada)

Pedido do Cesar em 01/10/2026: trocar os 8 livros (categorias) por uma coleção que junte os de hoje
com as 16 categorias do site de notícias dele (dev-note), levando em conta o que o blog publica e vai
publicar. Entregar **5 sugestões** (umas com mais livros, outras com menos; 16 é demais, um pouco
mais de 8 pode). Cada sugestão: a lista de livros, e de cada livro o título, **a frase** (como a da
capa de hoje) e **a lista do que abrange** (como no site de notícias). Depois, para cada livro de cada
sugestão, **um desenho e uma cor** com fundamento e ligados ao assunto, e os livros desenhados,
agrupados por sugestão, para o Cesar escolher uma. A mensagem dele termina em "apos criar essas 5"
(cortada): perguntar o que vem depois.

Branch: `claude/magical-einstein-tneg5o`. Nada vai para a `main` sem o OK do Cesar.

## Onde fica cada coisa

- `docs/prototipos/colecoes/controle.md`: este arquivo (status, bloqueios, como retomar).
- `docs/prototipos/colecoes/contexto.md`: o resumo para os agentes (blog, posts, tags, livros de hoje,
  regras da capa e da lombada).
- `docs/prototipos/colecoes/colecoes.json`: os livros (título, frase, abrange, cor, instrumento) e as
  cinco sugestões; a página `/amostra/colecoes/` (só no dev) lê daqui.
- `scripts/desenho/livros.mjs`: a caneta dos livros novos (desenho da capa e ícone da lombada a partir
  de geometria limpa, com tremor, hachura e fantasma). Cada livro: `scripts/desenho/livros/<slug>.mjs`.
  Grava `src/livros/desenhos/<slug>.svg` e `src/livros/icones/<slug>.svg`; `--ver` fotografa em
  `.render/livros/<slug>.png`.

## Etapas

| # | Etapa | Status |
|---|---|---|
| 1 | Levantar o material (blog, 28 posts, 20 tags, regras dos livros) | feito |
| 2 | As 16 categorias do dev-note | feito: o Cesar mandou as capturas da página (o domínio está fora da política de rede do ambiente e o clone do repositório foi negado); transcritas no `contexto.md` |
| 3 | Ferramenta de desenho dos livros (`scripts/desenho/livros.mjs`) | feito (testada com um desenho de teste) |
| 4 | Cinco sugestões (propostas independentes, crítica cruzada, síntese) | em andamento: três propostas independentes em `propostas/` (editor, arquiteto da informação, pesquisador) |
| 5 | Cor de cada livro (com o motivo) e contraste pelo `cores.js` | a fazer |
| 6 | Desenho e ícone de cada livro novo | a fazer |
| 7 | Página de comparação (`/amostra/colecoes/`) e artifact para o Cesar | a fazer |
| 8 | Registro: `docs/estado.md`, este controle; commit e push na branch | a fazer |

## Escolhas feitas para não parar

- Livro que continua igual numa sugestão (mesmo assunto) mantém o desenho e a cor de hoje: já foram
  aprovados. Livro novo ganha desenho e cor novos.
- O mesmo livro em sugestões diferentes tem o mesmo desenho e a mesma cor (a identidade não muda de
  uma sugestão para outra); só o que ele abrange pode mudar.

## Como retomar

Ler este arquivo e o `contexto.md`; ver a tabela de etapas; continuar da primeira que não está feita.
O dev: `npx astro dev --host 127.0.0.1 --port 4322` (no Linux da nuvem, o Chromium fica em
`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`).
