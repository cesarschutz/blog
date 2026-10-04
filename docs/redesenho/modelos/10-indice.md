# 10 · Índice

Direção do modelo 10 do redesenho (D55). Quem constrói segue este arquivo, o
`docs/redesenho/README.md` e a API da base (`docs/redesenho/base.md`).

## Ideia

O mais **minimalista** dos dez: o blog como **um índice**, numa coluna de texto pequeno, preciso e
silencioso, como o site pessoal de um bom tipógrafo. Quase não há imagens à vista: **a ilustração de
cada post aparece flutuando junto ao cursor** quando se passa por uma linha da lista, e some ao sair.
Os títulos e as linhas **embaralham e assentam** como um letreiro de aeroporto (split-flap) na
abertura e nas trocas. A cor só aparece no hover (a do livro). É elegância pela contenção.

Serve a este blog porque põe o conteúdo acima de tudo. Carrega rápido e se lê como um sumário.

## Cara

**Cores (tokens do modelo).**

| Token | Claro (principal) | Escuro | Uso |
|---|---|---|---|
| fundo | `#FAFAF8` | `#0F0F0E` | fundo |
| texto | `#161615` | `#EDECE8` | texto |
| texto-2 | `#8A8984` | `#7E7C77` | metadados, o que não está em foco |
| filete | texto a 8% | texto a 10% | filetes |
| cor-do-livro | a do livro do item sob o mouse | a mesma, clareada no escuro | **só no hover e no foco**: o ponto, o sublinhado e o número |

**Tipografia.**

- **Recia** (Fontshare, variável 300 a 700) em **tudo**: títulos, texto e interface. Usa numerais
  tabulares (`tnum`), estilo antigo (`onum`) no texto corrido e o zero cortado nos números.
- **Escala contida:**

  | Peça | Tamanho | Peso |
  |---|---|---|
  | texto da interface | 0,9375rem (15px) | 400 |
  | títulos das páginas | ~2rem | 500 |
  | título do artigo | ~2,6rem | 500 |
  | texto do artigo | 1,0625rem, com 1,7 de entrelinha e medida de 62 caracteres | 400 |
  | metadados | 0,8125rem | 400 |

  A hierarquia vem do peso (400 e 500), da cor (texto e texto-2) e do espaço.
- Código em JetBrains Mono (raiz), pequeno.

**Forma.** Uma coluna de ~640px alinhada à esquerda (com margem generosa à esquerda no computador, a
~18% da largura). Nada de caixas, cantos, sombras ou fundos: só filetes finos, quando necessários.

**Ícones.** Praticamente nenhum. Onde precisa, **caracteres**: "→", "↗", "↑", "×", "⌘K", "☾/☀" em
Recia. No hover, o caractere anda 2px.

**Marca "cs".** Só "Cesar Schutz" em Recia 500, com um ponto pequeno na cor de um livro sorteado a
cada visita. No hover, o ponto troca de cor (para a do próximo livro), numa troca curta.

## Páginas

**Cabeçalho.** Uma linha só no alto da coluna: "Cesar Schutz" à esquerda e "Índice · Livros · Tags ·
⌘K · ☾" à direita, pequenos. Não é fixo, sai com a rolagem, e uma pequena marca fixa "cs ↑" aparece no
canto quando o cabeçalho sai da tela.

**Home = o índice.**

- Uma frase de apresentação (a de hoje) em Recia, com texto-2 nas partes secundárias.
- **O índice de todos os artigos:** uma lista em que cada linha tem o **número** (028, em `tnum`), o
  **título** e, à direita, o livro em texto-2 e o ano.
  - Agrupada por ano ("2026", "2025") com o ano como marco.
  - **No hover numa linha:**
    - **a ilustração do post flutua junto ao cursor** (~280px de largura, no palco com a cor do livro,
      o recorte médio da base), seguindo com inércia (lerp com parada) e levemente girada no sentido
      do movimento (±3°);
    - a linha fica no texto, e **as outras linhas esmaecem** para o texto-2 (`:has()`);
    - o número e um ponto antes do título ganham a cor do livro.
  - Com o teclado, a ilustração aparece fixa à direita da linha em foco.
- **"Livros"**, embaixo: os 8 livros e a revista como **livros 3D pequenos** numa fileira discreta, com
  o nome embaixo. No hover, o livro **cresce** (até 2,2×, em direção ao centro da tela, com `scale` e
  `transform-origin` calculados) e se sobrepõe à página, como uma lupa. Os outros esmaecem.

**Artigo.**

- O número e o livro em texto-2 ("028 · Segurança"), o título em Recia 500 e o complemento em texto-2.
  Depois, a data e os minutos.
- **A ilustração vem logo abaixo, pequena** (na largura da coluna), e **cresce ao passar o mouse**
  (até a largura da tela, com o texto recuando). Por padrão, a leitura manda.
- O texto em Recia na coluna.
  - Os títulos em 500, com um número de seção pequeno em texto-2 na margem esquerda.
  - As notas laterais **na margem direita**, pequenas e alinhadas ao texto.
- **O sumário:** um índice pequeno fixo na margem esquerda (≥1280px), com a seção atual no texto e as
  outras em texto-2.
- **Fim:** "Anterior" e "Próximo" como duas linhas do índice. A ilustração também flutua junto ao
  cursor aqui.

**Livros (Categorias).**

- **Uma lista dos livros:** número do volume, nome, contagem e o último artigo.
- **No hover numa linha:**
  - o livro 3D **grande** (~380px) aparece, **fixo à direita** da coluna (não segue o cursor: o
    livro é grande demais para flutuar), girando de 50° para 24° e subindo 12px (0,4 s);
  - a linha ganha a cor do livro no número;
  - as outras esmaecem.
- **Clique:** abre a página do livro.
- **No celular,** cada linha tem o livro 3D médio embaixo, sem hover.

**Página do livro.**

- O **livro enorme** (~65vh), **fixo à esquerda** (no celular, em cima), e à direita, na coluna, o
  volume, o nome, a descrição, os números e **o índice dos artigos do livro**, no mesmo formato da home
  (com a ilustração flutuante).

**Tags.** Uma **lista alfabética densa**, em duas colunas: a tag e a contagem, em linhas. No hover, a
tag fica no texto e as outras esmaecem.

**Tag.**

- "Spring" e "9 artigos em 5 livros".
- **O filtro por livro são palavras sublinháveis numa frase:** "Mostrando **todos** · Arquitetura de
  Software · Desenvolvimento de Software · Dados · DevOps · SRE". Cada livro é uma palavra; a ativa é
  sublinhada na cor do livro e as outras ficam em texto-2.
- O índice filtrado, com a ilustração flutuante.

## Os três momentos

**1. A abertura da home: o letreiro.** Até ~2,2 s; clique, tecla ou rodinha pulam.

| Tempo | O que acontece |
|---|---|
| 0 a 0,3 s | só o cabeçalho |
| 0,2 a 1,6 s | **as linhas do índice à vista embaralham e assentam**, como um letreiro de aeroporto: cada título começa com caracteres aleatórios (letras e símbolos em Recia) que trocam a cada 40 ms e **assentam da esquerda para a direita**, caractere por caractere; as linhas começam com 60 ms de diferença entre si, de cima para baixo; os números (028, 027…) **rolam** como os dígitos de um painel (fitas de algarismos) |
| 1,4 a 2,2 s | a frase de apresentação aparece por opacidade, e os livros pequenos entram um a um |

- O texto real **já está no HTML**, com `aria-label` com o título inteiro. O embaralhar só troca o
  que se vê.
- Com movimento reduzido, tudo aparece pronto.
- **Só as linhas à vista** embaralham; as outras já estão prontas.

**2. A abertura das outras páginas.**

- **O título embaralha e assenta** (0,7 s) e o número rola.
- O resto aparece por opacidade.
- ~1 s.

**3. A troca de página: a linha vira o título.**

- **A linha clicada no índice vira o título da página nova**: elemento compartilhado da View
  Transition. O título da linha e o H1 do artigo têm o mesmo nome, dado só à linha clicada. O texto
  voa, cresce até o tamanho do título e **embaralha um instante** ao chegar.
- O resto da página antiga some numa **cortina de opacidade de cima para baixo** (uma máscara em
  gradiente que desce, 0,35 s).
- Nas outras navegações (menu), o título da página nova embaralha e o resto aparece.

## Categorias: o desfile e os livros grandes

**O desfile: os nomes embaralham.** Toca sempre que Livros aparece.

- Os nomes dos livros embaralham e assentam, um por linha (50 ms entre eles).
- **Ao mesmo tempo, o livro 3D grande à direita passa pelos 8 livros** (cada um aparece por 120 ms,
  girando levemente, como um folhear) **e para no primeiro**.
- ~1,4 s.

O hover está descrito em "Livros", acima.

## Filtro da tag

- A palavra do livro escolhido ganha o sublinhado na cor dele, que **desliza** da palavra anterior
  (um só sublinhado que anda por `translateX` e `scaleX`, 0,35 s).
- As linhas que saem esmaecem (0,2 s). As que ficam sobem (FLIP, 0,35 s). As que entram embaralham e
  assentam (rápido, 0,4 s).
- O total rola como número.

## Troca de tema

**"☾" e "☀":** o tema troca por uma **cortina de opacidade** muito rápida (View Transition,
esmaecer de 0,3 s). O caractere do botão embaralha entre ☾ e ☀. É quase nada, de propósito.

## Catálogo de detalhes

Todos também com o foco do teclado.

1. **Ilustração que flutua junto ao cursor** no índice (home, livro, tag, anterior/próximo): lerp com
   parada, inclinação no sentido do movimento, fade de 0,2 s ao entrar e sair.
2. **As outras linhas esmaecem** no hover, por `:has()`.
3. **O número da linha** ganha a cor do livro; um ponto aparece antes do título.
4. **Livros da home** crescem como lupa no hover.
5. **Livros (Categorias):** o livro grande à direita troca com o hover (veja acima).
6. **Marca:** o ponto troca para a cor do próximo livro.
7. **"cs ↑" fixo:** aparece quando o cabeçalho sai da tela e leva ao topo.
8. **Busca** (⌘K):
   - a própria coluna vira o campo de busca, com uma linha de texto em Recia no alto ("Buscar…") e o
     índice abaixo **filtrando ao vivo**;
   - as linhas que não casam esmaecem e depois somem (FLIP);
   - as letras que casam ficam no texto e o resto em texto-2;
   - Esc volta ao índice completo.
9. **Tema:** o caractere embaralha.
10. **Links do texto:** sublinhado em texto-2; no hover, o sublinhado **se desenha de novo da
    esquerda** na cor do livro do post (0,3 s).
11. **Títulos do artigo:** no hover, o número de seção da margem fica no texto, e o clique copia o link
    ("copiado" embaralha e assenta ao lado).
12. **Sumário na margem:** a seção atual fica no texto.
13. **Progresso:** um número pequeno "42" no canto de baixo, em texto-2 (`tnum`), que **rola** a cada
    1% (fitas de algarismos por CSS com `@property`, sem JS).
14. **Ilustração do artigo:** cresce no hover (veja acima).
15. **Copiar código:** "copiar" em texto-2, no canto do bloco; no clique, "copiado" embaralha e
    assenta.
16. **Anterior e próximo:** linhas do índice, com a ilustração flutuante.
17. **Voltar ao topo:** "↑ topo" no fim; o "↑" sobe 2px no hover.
18. **Tags:** as outras esmaecem no hover.
19. **Filtro:** o sublinhado desliza (veja acima).
20. **Seleção de texto:** a cor de um livro a 20% (o livro da página, ou o sorteado da marca).
21. **Foco pelo teclado:** sublinhado de 2px na cor do texto, com 3px de afastamento.
22. **Rodapé:** uma linha só, "Cesar Schutz · GitHub · LinkedIn · RSS · 2026", pequena.

## Técnica

- **Embaralhar:** um utilitário próprio que troca o texto visível de um `span` `aria-hidden` sobre o
  texto real (o real fica com `aria-label`). Ele troca a cada 40 ms e assenta caractere por caractere,
  e tem limite: só nas linhas à vista e **no máximo 12 linhas ao mesmo tempo**. É caro (reescreve o
  texto): meça com a CPU 4× mais lenta e, se pesar, reduza para "por palavra" ou para as primeiras 6
  linhas.
- **Largura reservada:** cada linha que embaralha tem a largura do texto real, usando o texto
  fantasma ou `ch` fixo na mono. Na Recia, reserve pelo texto real invisível na mesma célula da grade,
  para nada andar.
- **Ilustração flutuante:** um único elemento fixo, que troca de conteúdo (a ilustração do item, que
  vem de um `<template>` por linha, inline só quando usada) e é movido por `transform`, com rAF só
  enquanto o mouse se move.
- **Elemento compartilhado:** o nome só na linha clicada.
- **Movimento reduzido:** nada embaralha, nada flutua (a ilustração aparece fixa ao lado, só com o
  teclado ou o hover) e os números aparecem prontos.

## Referências usadas

`docs/redesenho/referencias.md`:

- a decodificação (scramble) e o seguir com parada do kinetics;
- o foco numa linha (as outras esmaecem) do soralabs;
- o chip de citação do kobra (para as notas);
- o sublinhado que desliza do microkit;
- a fonte Recia, do Fontshare.

## O que não fazer (para não virar outro modelo)

- **Tamanho:** nada de tipografia grande nem de blocos de cor (Tipo Vivo e Grade).
- **Terminal:** nada de mono na interface nem de metáfora de terminal (Terminal).
- **Cursor:** nada de cursor personalizado. A ilustração flutua, mas o cursor é o do sistema
  (Galeria).
- **Sombras e texturas:** nenhuma.

## Retorno do Cesar

(vazio)
