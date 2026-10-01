# A coleção de 13: controle da rodada

Pedido do Cesar em 01/10/2026, depois de ver as cinco sugestões: fica a **sugestão 5 com Frontend**
(13 livros). Para esses 13: **desenhos novos** (um conjunto novo, que combine, em todos, inclusive nos
livros de hoje), **cores novas** (com motivo; o exemplo dele: "faria mais sentido Segurança ser
vermelho, não?"), **frase e texto novos** (o que cada livro abrange), e uma **página com o resultado
final**. Criatividade: direção de arte e cores com um agente Fable. Depois: a **regra dos posts**
(ao escrever um post, pensar se a coleção ainda serve e avisar o Cesar se valer criar, dividir ou
renomear um livro) e os **volumes em ordem alfabética**.

Branch: `claude/magical-einstein-tneg5o`. Nada vai para a `main` nem muda no site antes do OK do
Cesar na página final.

## Decidido pelo Cesar (D61)

1. A coleção é a sugestão 5 mais Frontend: 13 livros.
2. Carreira sai (não tem post; `/categories/Carreira/` precisa de redirecionamento quando for para o site).
3. Os livros de hoje **mantêm o nome**: Desenvolvimento de Software e SRE não viram Backend e
   Observabilidade (a D30 fica como está). Só os livros novos têm nome novo.
4. A tag Pagamentos pode ser renomeada ou removida (ela passa a ter o nome de um livro).
5. Desenhos, cores, frases e textos novos para os 13.
6. Volumes em ordem alfabética (Volume 01 = o primeiro pelo nome).
7. Regra dos posts: a coleção não deve mudar à toa, mas, quando um post não couber bem (um de
   Carreira, que não tem livro; um de arquitetura corporativa, que pediria um livro novo ou trocar
   "Arquitetura de Software" por "Arquitetura"), o Claude avisa e sugere.

## Os 13, em ordem alfabética (= volume)

| Vol. | Livro | slug | Desenho novo grava em |
|---|---|---|---|
| 01 | Arquitetura de Software | arquitetura-de-software | `novo-arquitetura-de-software` |
| 02 | Dados | dados | `novo-dados` |
| 03 | Desenvolvimento de Software | desenvolvimento-de-software | `novo-desenvolvimento-de-software` |
| 04 | DevOps | devops | `novo-devops` |
| 05 | Frontend | frontend | `novo-frontend` |
| 06 | Fundamentos | fundamentos | `novo-fundamentos` |
| 07 | IA | ia | `novo-ia` |
| 08 | Integração e Eventos | integracao | `novo-integracao` |
| 09 | Pagamentos | pagamentos | `novo-pagamentos` |
| 10 | Segurança | seguranca | `novo-seguranca` |
| 11 | Sistemas Distribuídos | sistemas-distribuidos | `novo-sistemas-distribuidos` |
| 12 | SRE | sre | `novo-sre` |
| 13 | Testes | testes | `novo-testes` |

Os desenhos novos têm o prefixo `novo-` para não sobrescrever os que o site usa hoje
(`src/livros/desenhos/<slug>.svg`); quando o Cesar aprovar, viram `<slug>.svg`.

## Onde fica cada coisa

- `final/direcao-de-arte.md`: o conceito do conjunto, e de cada livro o objeto, o motivo, a
  composição, o ícone e a cor (com o motivo e a conferência).
- `final/textos.md`: de cada livro a frase, o que abrange, de onde vem e os posts que vão para ele.
- `final/critica.md`: a crítica de fora sobre os dois.
- `scripts/desenho/livros/novo-<slug>.mjs`: o desenho de cada livro (a caneta é `scripts/desenho/livros.mjs`).
- `colecoes.json`, sugestão `final`: os dados que a página `/amostra/colecoes/final/` lê.
- `final/gerar.mjs`: a página do resultado final para o Cesar (artifact).

## Etapas

| # | Etapa | Status |
|---|---|---|
| 1 | Decisões registradas (D61, estado, este controle) | feito |
| 2 | Direção de arte: conceito do conjunto, objeto e cor de cada livro (Fable) | feito: `direcao-de-arte.md` ("O mesmo problema, um século antes"; paleta em `paleta.png`) |
| 3 | Textos: frase, abrange, posts de cada livro (Fable) | feito: `textos.md` |
| 4 | Crítica dos dois e síntese | crítica em andamento (`critica.md`) |
| 5 | Os 13 desenhos e ícones | em andamento: Arquitetura, Dados, Desenvolvimento, Segurança, SRE e o ajuste dos quatro que ficam (Integração, Pagamentos, Sistemas Distribuídos, Testes); DevOps, Frontend, Fundamentos e IA esperam a crítica |
| 6 | Dados da página (`colecoes.json` → `final`), título na capa, conferência das cores | feito para os dados de agora: `final/dados.json` → `final/montar.mjs` → `colecoes.json`; refazer depois da crítica |
| 7 | Página final (dev e artifact) | a fazer |
| 8 | Regra dos posts (skill `post`, `.claude/rules/posts.md`, `CAPAS.md`, `CLAUDE.md`) | feito (falta ajustar no `CAPAS.md` o "instrumento de ofício" se o conjunto novo for de outra família) |
| 9 | Estado, commit e push na branch | a fazer |

## Como retomar

Ler este arquivo; continuar da primeira etapa que não está feita. O dev:
`npx astro dev --host 127.0.0.1 --port 4322` (no Linux da nuvem, o Chromium fica em
`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`; `CHROME_PATH` aponta para ele nos scripts).
