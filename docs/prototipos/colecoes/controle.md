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
| 4 | Cinco sugestões (propostas independentes, crítica cruzada, síntese) | feito: três propostas (`propostas/`: editor, arquiteto da informação, pesquisador), síntese em `colecoes.json` → `sugestoes.md`, crítica de fora em `critica.md`, aplicada (escada de 9 a 12; uma regra para os posts; livro novo com o próximo volume; Carreira e nomes como perguntas à parte; recomendação: a sugestão 2) |
| 5 | Cor de cada livro (com o motivo) e contraste pelo `cores.js` | feito: `pesquisa-cores-e-desenhos.md` (paleta de 16, com fontes); os oito de hoje ficam com a cor e o desenho; Pagamentos foi para `#467866` (tinta a 4,16:1); todas as sugestões passam no `conferir-cores.mjs` |
| 6 | Desenho e ícone de cada livro novo | Sistemas Distribuídos (relógios de Huygens), Fundamentos (ábaco), Testes (prumo) e Integração e Eventos (mesa telefônica) prontos; Pagamentos (caixa registradora) na última volta, com o retorno de direção de arte |
| 7 | Página de comparação (`/amostra/colecoes/`) e artifact para o Cesar | página do dev pronta; `capturar.mjs` (fotos) e `gerar-artifact.mjs` (página do app) prontos; falta publicar com os desenhos finais |
| 8 | Registro: `docs/estado.md`, este controle; commit e push na branch | a fazer |

## Escolhas feitas para não parar

- Livro que continua igual numa sugestão (mesmo assunto) mantém o desenho e a cor de hoje: já foram
  aprovados. Livro novo ganha desenho e cor novos.
- O mesmo livro em sugestões diferentes tem o mesmo desenho e a mesma cor (a identidade não muda de
  uma sugestão para outra); só o que ele abrange pode mudar. Livro renomeado (Java e Spring, Backend,
  Observabilidade, Plataforma) fica com o desenho e a cor do livro de hoje.
- A Arquitetura de Software é o Volume 01 em todas: a marca "cs" é a capa do Volume 01, na cor dela.
- As sugestões formam uma escada (8, 9, 10, 11 e 12 livros), cada degrau com uma ideia própria; a
  coleção de hoje aparece na página só para comparar.
- Regra da casa de cada post: o livro é o que o post ensina; o exemplo (a cobrança) vira tag. Onde não
  há Sistemas Distribuídos, os dois posts de cobrança (idempotência e efeito externo) vão para
  Pagamentos.
- Fundamentos leva o ábaco (e não a régua de cálculo da pesquisa): se lê no ícone pequeno, e a cor
  cinza-pedra conversa com ele (calculus é a pedrinha de contar).
- Depois da crítica: a casa de cada post é o que ele ensina, nas cinco (a chave de idempotência e o
  efeito externo ficam na arquitetura, ou em Sistemas Distribuídos onde ele existe; Pagamentos começa
  com o ledger); livro novo entra com o próximo número (nenhum livro de hoje muda de volume, regra do
  CAPAS.md); Carreira fica nas quatro primeiras; a S5 mantém DevOps (sem Plataforma); Pagamentos
  `#467866`; a frase de Testes virou "A prova de que o código faz o que deve.".

## Como retomar

Ler este arquivo e o `contexto.md`; ver a tabela de etapas; continuar da primeira que não está feita.
O dev: `npx astro dev --host 127.0.0.1 --port 4322` (no Linux da nuvem, o Chromium fica em
`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`).
