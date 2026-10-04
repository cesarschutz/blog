# 07 · Galeria

Direção do modelo 07 do redesenho (D55). Quem constrói segue este arquivo, o
`docs/redesenho/README.md` e a API da base (`docs/redesenho/base.md`).

## Ideia

O blog como uma **galeria de arte**: parede branca, muito espaço, silêncio. As ilustrações dos posts
são as **obras**, emolduradas e penduradas com **etiqueta de parede** (título, técnica, livro, data e
tempo de leitura). A home é uma **sala que se percorre na horizontal**: a rolagem normal da página
move a parede para o lado, sem sequestrar a roda. O movimento é lento e calmo, como alguém que anda
pela sala: as luzes acendem, as obras são penduradas e o visitante chega perto de uma obra para lê-la.

Serve a este blog porque as ilustrações dele merecem ser vistas como obras, e o ritmo calmo convida a
ler.

## Cara

**Cores (tokens do modelo).**

| Token | Claro (principal, "cubo branco") | Escuro ("galeria à noite") | Uso |
|---|---|---|---|
| parede | `#F7F6F3` | `#1A1A19` | fundo |
| chao | `#ECEAE5` | `#121211` | faixa do chão sob a sala, rodapé |
| texto | `#1C1C1B` | `#ECEAE4` | texto |
| texto-2 | `#7A7873` | `#9A9791` | etiquetas, metadados |
| filete | texto a 10% | texto a 12% | filetes |
| moldura | `#FFFFFF` com borda de 1px a 12% | `#232322` com borda a 10% | o passe-partout das obras |
| acento | `#1C1C1B` | `#ECEAE4` | não há cor de acento: o destaque é pelo peso e pelo sublinhado |

A **única cor** do site vem das obras e dos livros. A interface é monocromática.

**Tipografia.**

- **Erode** (Fontshare, variável 300 a 700, com itálico) nos títulos, **só em itálico**: é a voz da
  galeria (o título de cada obra, os nomes das salas).
- **Bespoke Serif** (Fontshare, variável 300 a 800) no texto do artigo, em 1,125rem com 1,72 de
  entrelinha e medida de 62 caracteres. É calma, aberta e com bastante ar.
- **Switzer** (Fontshare, já baixada) nas etiquetas, na interface e nos metadados, **pequena**
  (0,75 a 0,8125rem), com tracking levemente aberto, em caixa normal.
- **Escala:** os títulos das salas em Erode itálico ~3,5rem; os nomes das obras em ~1,5rem. Tudo o
  mais é pequeno. **O tamanho grande é das obras, não do texto.**

**Forma.**

- As obras numa moldura branca (passe-partout) com uma sombra muito curta e baixa, como um quadro
  real na parede: `0 1px 2px` a 6% e `0 12px 24px -12px` a 12%. Só nas obras; em nada mais.
- Sem cantos arredondados.
- Etiquetas pequenas ao lado de cada obra, como as de museu.

**Ícones.** Quase não há. Os que há: seta fina, lupa e sol/lua, com traço de 1px. No hover, nada além
de uma leve mudança de opacidade.

**Cursor.** O cursor nativo, mais um **círculo de acompanhamento** (18px, borda de 1px) que segue com
leve atraso.

- Sobre uma obra, ele cresce (64px) e mostra **"Ver"** dentro, em Switzer pequeno.
- Sobre um livro, mostra **"Abrir"**.
- Sobre a sala horizontal, mostra **"← →"** enquanto ela rola.

Tudo por `transform`, com rAF só enquanto se move. Só com mouse fino; some no toque e com movimento
reduzido.

**Marca "cs".** "Cesar Schutz" em Erode itálico e, embaixo, "Galeria" em Switzer pequeno. No hover,
uma linha fina se desenha embaixo.

## Páginas

**Cabeçalho.** Mínimo, fixo e transparente sobre a parede: a marca à esquerda; à direita, "Salas"
(Categorias), "Índice" (Tags), a lupa e o tema, em Switzer pequeno. Ele some ao rolar para baixo e
volta ao subir (por `transform`, sem mexer no layout).

**Home = a sala principal.**

- **Entrada da sala:** o nome "Cesar Schutz" em Erode itálico grande à esquerda e a apresentação de
  hoje como **texto de parede** (o texto curatorial) em Bespoke Serif.
- **A parede que corre na horizontal:**
  - uma seção alta (a altura é a soma das obras) com um contêiner `position: sticky` dentro;
  - a parede anda para o lado conforme a página rola, por `animation-timeline: view()` ou `scroll()`,
    com `translateX`;
  - **as obras** (os artigos) penduradas em sequência, em alturas levemente diferentes e tamanhos
    variados (grande, médio, pequeno), como numa exposição de verdade, cada uma com a etiqueta ao
    lado;
  - no fim da parede, um banco (um retângulo baixo) e o texto "Fim da sala · 28 obras".
- **No celular** não há sala horizontal: as obras ficam **em coluna**, uma por tela, com a etiqueta
  embaixo, e a rolagem é a normal.
- **Depois da sala, "As salas":** os livros (as coleções), cada um num **pedestal**, com o livro 3D
  **médio** sobre um bloco branco (a base do pedestal) e o nome embaixo.

**Artigo = diante da obra.**

- **O topo** é a obra: a ilustração grande e centralizada, na moldura, com muito espaço em volta, e a
  etiqueta ao lado, com:
  - o título em Erode itálico;
  - "Ilustração, nanquim digital e cor do livro";
  - o livro;
  - a data;
  - "12 min de leitura".
- **O texto** numa coluna estreita e centrada, em Bespoke Serif.
- **As notas laterais** como pequenas etiquetas na margem.
- **O código** num bloco com o fundo do chão, discreto.
- **Os títulos** em Erode itálico.
- **O fim:** "Próxima obra" e "Obra anterior" como duas obras pequenas na parede, com a etiqueta.

**Categorias = o mapa das salas.**

- "Salas" em Erode itálico e o texto curatorial.
- **Cada livro num pedestal**, com o livro 3D **grande** (~360px em 1440) sobre um bloco branco com a
  sombra curta de pedestal. Numa fileira de 4 (2 e 1 nas telas menores), com o nome, a descrição e
  "6 obras nesta sala".

**Página do livro = uma sala.**

- **O livro numa vitrine:** o livro 3D **enorme** no centro, sobre o pedestal, com uma caixa de vidro
  desenhada em volta (filetes finos, com um reflexo diagonal muito suave e parado).
- O texto curatorial da sala ao lado.
- **As obras da sala** (os artigos do livro) numa **pequena sala horizontal**, como na home.

**Tags = o catálogo da exposição.** Uma lista de verbetes em duas colunas: a tag em Erode itálico, a
contagem ("9 obras") e uma linha com os títulos das obras. É sóbrio e editorial.

**Tag.**

- "Spring" em Erode itálico e "9 obras em 5 salas".
- **O filtro por livro é a planta da exposição:** um pequeno **mapa das salas**, com retângulos
  lado a lado, um por livro presente, com o tamanho proporcional à contagem. Cada sala tem a cor do
  livro a 20% e o nome. Clicar numa sala a "ilumina" (fica a 100%, e as outras voltam ao contorno) e
  filtra as obras. "Todas as salas" é a planta inteira.
- As obras na parede horizontal (no celular, em coluna).

## Os três momentos

**1. A abertura da home: as luzes acendem.** Até ~2,6 s; clique, tecla ou rodinha pulam.

| Tempo | O que acontece |
|---|---|
| 0 a 0,4 s | a sala no escuro (a parede num tom 30% mais escuro), com as molduras apagadas (só o contorno) |
| 0,3 a 1,8 s | **as luzes acendem da esquerda para a direita**, obra por obra: para cada obra à vista, um foco (um gradiente elíptico suave sobre a parede, acima da obra) acende em 0,6 s e a obra aparece dentro da moldura (opacidade e um "pendurar": cai 6px e assenta, 0,5 s), com 180 ms entre as obras |
| 1,2 a 2,2 s | a parede inteira clareia até o tom normal, e o nome e o texto de parede aparecem por opacidade |
| 2,0 a 2,6 s | o cabeçalho e o cursor de acompanhamento aparecem |

**2. A abertura das outras páginas: a obra é pendurada.**

- A obra (a ilustração, ou o livro na página do livro) desce 8px e assenta na moldura (0,7 s,
  `cubic-bezier(.22,.9,.3,1)`).
- A etiqueta desliza da direita (12px) e aparece.
- O texto aparece por opacidade.
- ~1,2 s, tudo lento e suave.

**3. A troca de página: chegar perto da obra.**

- Ao clicar numa obra, **a ilustração clicada cresce e vira o topo do artigo** (elemento
  compartilhado da View Transition: a obra da home e a obra do artigo com o mesmo
  `view-transition-name`, dado só à obra clicada). A parede em volta esmaece.
- Ao ir para um livro, o livro do pedestal voa até a vitrine.
- Nas outras navegações (menu), um **esmaecer lento** da página inteira (0,5 s).
- Técnica: View Transitions entre documentos. O nome é posto só no elemento clicado (e o slug vai no
  `sessionStorage` para a página nova pôr o mesmo nome na obra do topo).

## Categorias: o desfile e os livros grandes

**O desfile: os pedestais sobem.** Toca sempre que as Salas aparecem.

- Os pedestais (os blocos brancos) **sobem do chão** (`translateY` de 40px e `clip-path` de baixo
  para cima, 0,7 s), da esquerda para a direita, com 110 ms entre eles.
- Sobre cada pedestal, **o livro é colocado**: desce 10px e assenta (0,5 s), girando de 44° para os
  38° de repouso.
- Os textos por último, por opacidade. ~1,7 s.

**Hover num pedestal:**

- o cursor de acompanhamento vira "Abrir";
- o livro gira de 38° para 24° e sobe 4px;
- a sombra do pedestal se estende um pouco;
- os outros pedestais baixam a opacidade para 75%.

## Filtro da tag

- **Sala clicada:** o retângulo acende (a cor do livro de 20% para 100% de preenchimento em 0,4 s) e
  os outros voltam ao contorno.
- **As obras que saem** "são retiradas da parede": sobem 6px e esmaecem (0,3 s). As que ficam
  deslizam para o lugar (FLIP, 0,6 s, lento). As que entram são "penduradas", com 90 ms entre elas.
- O "9 obras" conta até o valor novo.

## Troca de tema

**A galeria fecha à noite:** as luzes da sala **se apagam** da direita para a esquerda (uma faixa de
sombra que varre, `clip-path`, 0,8 s, lenta). No claro, elas se acendem da esquerda para a direita.
O ícone é um interruptor de parede simples, e no hover a tecla desce 1px.

## Catálogo de detalhes

Todos também com o foco do teclado. Movimento lento: 0,4 a 0,8 s, `cubic-bezier(.22,.9,.3,1)`.

1. **Cursor de acompanhamento:** "Ver" nas obras, "Abrir" nos livros e "← →" na sala horizontal
   (veja acima).
2. **Obra:** no hover, a moldura se eleva 2px (a sombra cresce por uma camada com opacidade) e a
   ilustração faz uma **paralaxe leve** dentro do passe-partout, seguindo o mouse (±6px, por
   `transform`).
3. **Etiqueta:** no hover da obra, a etiqueta dela ganha um filete fino à esquerda, que se desenha de
   cima para baixo.
4. **A sala horizontal:**
   - um pequeno **indicador de posição** embaixo ("obra 7 de 28") com um filete de progresso;
   - as setas ← e → do teclado andam uma obra de cada vez (rolando a página até a obra);
   - a obra no centro da tela fica 100% nítida, e as das pontas a 85% de opacidade (por
     `animation-timeline: view(inline)`, só CSS).
5. **Faixa de tags corrida** (a ideia do kinetics): no fim da sala, uma faixa lenta com as tags,
   com as pontas esmaecidas por `mask-image`, que **para no hover**, suavemente (a velocidade cai,
   não para seco).
6. **Menu:** no hover, o item ganha um sublinhado de 1px que se desenha da esquerda (0,4 s). O atual
   fica em Erode itálico.
7. **Busca:** a lupa abre um campo que se estende no próprio cabeçalho (a largura por `clip-path`),
   e os resultados aparecem abaixo como etiquetas de obra (título em Erode itálico e livro). Com as
   setas, um filete à esquerda indica o resultado.
8. **Links do texto:** sublinhado fino na cor do texto a 30%. No hover, ele se enche até a cor do
   texto, da esquerda para a direita, lento (0,5 s).
9. **Títulos do artigo:** no hover, um pequeno "¶" aparece à esquerda, e o clique copia o link, com
   "Link copiado" em Switzer pequeno.
10. **Progresso:** um filete fino à esquerda da tela, vertical, que cresce com a rolagem (só CSS).
11. **Copiar código:** "Copiar" em Switzer pequeno, que vira "Copiado" com um ponto.
12. **Próxima obra:** no hover, a obra pequena se eleva e a paralaxe acontece.
13. **Voltar ao topo:** "Voltar à entrada" em Switzer, com a seta fina que sobe.
14. **Pedestais:** o livro gira e os outros baixam (veja acima).
15. **Vitrine:** na página do livro, o reflexo do vidro se move um nada com o mouse (±10px, bem
    suave).
16. **Planta da exposição:** no hover numa sala, ela ganha o contorno mais forte e o nome aparece
    completo numa etiqueta.
17. **Catálogo de tags:** no hover num verbete, os títulos das obras dele passam do texto-2 ao texto.
18. **Seleção de texto:** um cinza quente a 20%.
19. **Foco pelo teclado:** um contorno de 1px na cor do texto, com 4px de afastamento, e um
    sublinhado nos links.
20. **Rodapé = a saída da galeria:** "Obrigado pela visita." em Erode itálico, os horários ("aberto
    sempre") e os contatos em Switzer pequeno, sobre o chão.

## Técnica

- **Sala horizontal só com CSS** (`position: sticky` e `animation-timeline: scroll()` ou `view()`,
  com `translateX`), protegida por `@supports`. Sem suporte, a sala vira uma coluna vertical normal.
  **Nunca** sequestrar a roda: a rolagem é a da página.
- **A altura da seção** é calculada para a largura da parede (uma variável CSS com o número de obras,
  ou uma medida uma vez no carregamento e no `resize`).
- **Cursor de acompanhamento:** rAF com lerp e parada.
- **Elemento compartilhado:** `view-transition-name` só no elemento clicado, nunca em todos (senão a
  transição fica pesada).
- **GSAP** não deve ser necessário.

## Referências usadas

`docs/redesenho/referencias.md`:

- o cursor com rótulo por contexto do uiable e do soralabs;
- o lerp com parada e a faixa corrida com máscara do kinetics;
- o esmaecer das pontas de rolagem do uiable;
- a troca de página do soralabs, só como ideia de calma;
- as fontes Erode, Bespoke Serif e Switzer, do Fontshare.

## O que não fazer (para não virar outro modelo)

- **Tipografia:** nada de tipografia grande, a não ser os títulos das salas (Grade e Revista).
- **Cor:** nada de cor na interface (Cinético).
- **Luz:** a luz aqui é só na abertura e na troca de tema; nada de luz seguindo o cursor (Noturno).
- **3D:** nada de sala em 3D ou câmera (Biblioteca). A sala é uma parede plana que corre.

## Retorno do Cesar

(vazio)
