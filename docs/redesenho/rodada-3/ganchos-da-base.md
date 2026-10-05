# Ganchos da base (r3-base) para as cinco linhas

> Histórico da rodada 3 (a base dos protótipos). No blog, alguns destes ganchos não existem mais (na
> faxina da D84: `.livro-na-gaveta`, `[data-lv-fileira]`, `window.csLivroVivo.onda`, `[data-foto-gira]`,
> `<LivroEmPe parado />` e `[data-luz-acesa]`; ficam o `data-livro-parado`, o `data-lv-ondou`, o
> `window.csLivroVivo.soltar` e a variável `--luz-acesa`): o que vale é o comentário de cada componente.

O que os construtores da fase 2 deixaram estável na `r3-base` para as linhas 16 a 20 mudarem a cara sem
reescrever a base. Cada linha parte de uma cópia da `r3-base` e usa estes ganchos. Se precisar mudar um
deles, mude na sua cópia e diga no relatório.

## Livro 3D, luz e tema (áreas 1 e 2)

- Estrutura do livro: `.livro-3d-caixa > .livro-3d-vista > .livro-vivo > .livro-3d`. Para achar a vista,
  `closest(".livro-3d-vista")`, nunca o `parentElement` do `.livro-3d`.
- O hover (mola, seguir o mouse, brilho) dispara em `[data-livro-gira]` (num cartão em volta),
  `.livro-colecao`, `.livro-em-pe` e `.livro-na-gaveta`. `data-lv-pose` na `.livro-3d-caixa` força a pose
  por script (a onda de molas da linha 18). `--livro-vira` muda o quanto ele vira (padrão −18°).
  `--lv-mola` e `--lv-sai` ficam no `:root` com as curvas.
- Desligar: `data-livro-parado` ou `<LivroEmPe parado />`.
- `window.csLivroVivo.onda(fileira)` dispara a onda de luz; `window.csLivroVivo.soltar(caixa)` solta o
  livro na hora. A onda corre sozinha em `.colecao .prateleira-livros`, `.estante .prateleira-livros` e
  `[data-lv-fileira]`, e marca `data-lv-ondou`.
- Pontos de luz: `<PontoDeLuz />` (`src/components/PontoDeLuz.astro`) dentro de um lugar com
  `position: relative`; `data-luz` no alvo do hover acende, `data-luz-acesa` deixa aceso;
  `--ponto-luz-topo` e `--ponto-luz-pe` ajustam o cone.
- A foto do livro deitado ("Do livro") dá a mola em `.do-livro`, `.livro-do-artigo` ou `[data-foto-gira]`.
- Tema: `trocarTema(valor, origem, pecas?)` (`src/scripts/tema.ts`); durante a troca, a raiz leva
  `luz-acende`, `luz-apaga` ou `luz-fade`, e `trocando-tema` fica cerca de 1,2s; a camada `.lustre-luz`
  tem o nome de transição `lustre-luz`. A lâmpada está em `src/scripts/lampada.ts`.
- Tokens novos (`tokens.ts`, nos dois temas): `luz-quente`, `sombra-quente`, `halo-quente`, `luz-mouse`,
  `lampada-brasa`, `lampada-ambar`, `lampada-branca`, `ponto-luz`.

## Página do livro (área 4)

- A fileira de cima: `.estante-topo` (com `data-fileira-topo`); o que encolhe ao rolar é
  `.estante-topo .chapa`; o chão é `.estante-topo .chao-fileira` (o `.tabua.chao-fileira` da `Colecao`,
  vazio na base: é ali que entram tábua, prateleira, madeira ou palco).
- O livro grande: a auréola atrás dele é `.topo-livro .anel::before` (a cartolina da linha 20 entra ali).
- Troca de livro: os links de texto têm `data-vizinho-livro` e põem `data-troca-livro` no `<html>`.
- Os artigos da página ficam em `[data-gira]` (o `revelar.ts` não mexe neles).

## Post (área 5)

- A ilustração do topo é uma foto colada: `.foto-colada` (com `--cor` e `isolation: isolate`; os
  `::before` e `::after` estão livres), 16px para dentro da folha. As cantoneiras são `.cantoneira.c1` a
  `.c4`, no sentido do relógio a partir do canto de cima à esquerda.
- O post-it "Neste artigo" é `.post-it` (os `::before` e `::after` estão livres, para um alfinete).
- A ficha "Do livro": `.ficha-colada` (na `.do-livro` da lateral e na `.livro-do-artigo` do fim). A fita
  é o `<span class="fita">`. O `::before` é a pintura (z-index 0); o `::after` está livre (carimbo, z-index
  1 ou mais). Atributos: `data-livro-nome`, `data-volume`, `data-publicado` (data por extenso, para
  `attr()`). Variáveis: `--pinta`, `--sobre-pinta`. Classes: `.cabeca-ficha > span`, `.foto`, `.sobre`
  (ou `.corpo-ficha` e `.sobre-livro` na ficha do fim), `.dados`, `.nome-livro`, `.ver`.
- Anterior e próximo: `.vizinhos a[rel=prev|next]` com as classes `vizinho anterior|proximo`; o quadro
  vazio é `p.vizinho-vazio`.

## Tags e busca (áreas 6 e 8)

- Tags: `.nuvem-tags` (a nuvem, numa `.folha`), `.fichas-tags` > `.ficha-tag` (com `.tira-ficha`,
  `.mini-estante`, `.pauta-ficha`). Cada ficha leva `data-letra` (a inicial sem acento) e `data-n`. A
  lista leva `data-fichas-caem` e `data-fora-da-troca`; o script marca `data-caem` na lista e `data-caiu`
  em cada ficha. `src/scripts/fichas-caem.ts` exporta `fichasCaem(lista)` e `soltarFichas(fichas)`, para
  reaproveitar a queda (gavetas por letra da 19, alfinetes da 16).
- Busca (`src/components/Busca.astro`): `.busca`, `.ficha-consulta`, `.ficha-resultado`,
  `[data-busca-ficha]`, `[data-busca-livro]` e as classes de antes (`.caixa`, `.campo`, `.resultados`,
  `.resultado`…). O seletor do script é `dialog.busca[data-busca]`. Os livros 3D da ficha chegam por
  fetch de `/busca/livros/`; a busca importa `livro.css` e `livro-vivo.css`.

## Transições, entradas e rodapé (áreas 7 e 3)

- A cortina dispara `cs:cortina-saindo` no `window` quando começa a sair (0,62s; 0,38s na chegada curta),
  com `detail = { volta, curta, duracao }`. Os outros eventos: `cs:chegou`, `cs:pousou`, `cs:aberto`.
- Entrada ao rolar: todo `#conteudo [data-revelar]` (cards e itens de lista) aparece uma vez ao entrar
  na tela (`src/scripts/revelar.ts`). Quem tem entrada própria marca o contêiner com
  `data-fora-da-troca` (ou `chegada={{ propria: true }}` com `window.csChegada`).
- Rodapé (`src/components/Rodape.astro`): o nome gigante mora em `.rodape-parede` e a ficha em
  `.rodape-chao`, empilhados na mesma célula da grade do `.rodape`. Variáveis: `--nome`,
  `--nome-visivel`, `--nome-sob-ficha`.

## Fichas e home (área 10)

- Fichas: `.ficha` (card), `.ficha-lista` (item de lista) e `.tira-ficha`, com `--fio-ficha` e
  `--raio-ficha`; o texto da tira vem de `chamadaDe(post)` em `src/lib/ficha.ts`. O hover usa a
  propriedade `translate` (o `transform` fica livre para a entrada ao rolar).
- A fileira da home: `.colecao.colecao-home[data-colecao="home"]` > `.fileira` > `.prateleira-livros` +
  `.tabua.chao-fileira` (o chão, vazio na base, com a altura de uma tábua; a abertura risca o fio nele).
  Cada lugar é `.livro-colecao[data-livro-colecao]`, com `a.tomba[data-tirar]`, `.vol`, `.vao-marca` e
  `.nome-livro`. Estados: `.livro-colecao.retirado`; na coleção, `data-gaveta="movendo"` ou `"aberta"`.
- A gaveta: `<Gaveta modo="fileira">` (`.gaveta-fileira[data-gaveta="fileira"]`, `.gaveta-tampo`); a prop
  `modo` aceita `"fileira"` ou `"estante"` (a de lombadas, do blog de hoje) e `nivel`. A de lombadas
  ainda anima a altura: quem a usar converte com `depoisDe` e `semPulo`, de
  `src/scripts/gaveta-fileira.ts`.

## Computador (área 9)

- Tudo em `src/computador/` e `src/pages/mac/`; as cores em `src/computador/cores.ts` (tokens `--mac-*`).
  O ícone é o do 12; a entrada e a saída são a câmera do 12. Sair: menu "cs" › "Sair do computador",
  ⌃⌥Q ou o Voltar do navegador. A tecla ` desce o Terminal por cima do blog.
