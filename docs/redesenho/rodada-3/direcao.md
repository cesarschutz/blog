# Direção de arte da rodada 3 (a final)

Diretor: Fable 5.1, 01/10/2026. Fonte: `retorno-cesar.md` desta rodada e da rodada 2, com os
números do `controle.md` (T, P, F, C, O, N, G). Pesquisa usada: `luz-realista.md` (lâmpada, brilho e
sombra) e `macos.md` (o computador). As capturas desta sessão estão em
`.astro/depuracao/redesenho/r3/direcao/` e são citadas pelo nome do arquivo quando a decisão depende
do que vi.

Quem lê isto é o construtor (Opus). Cada peça traz o objetivo, o resultado esperado (o que se vê e o
que se sente) e os números que definem o resultado. Como fazer é com o construtor, dentro das regras
do redesenho (`.claude/rules/redesenho.md`): dois temas, cor só por token, fontes do projeto,
`prefers-reduced-motion`, só `transform`, `opacity` e `clip-path` animados, nada de cara de IA.

Quando um pedido do Cesar e esta direção divergirem, vale o Cesar.

---

## 0. Decisões de partida

### A base é o 14

Confirmado. Ele chamou a home do 14 de "perfeita" e "linda", marcou a cortina da navegação interna
como "TEM QUE TER", disse que a página do livro ele "GOSTOU MUITO" e que o post "tá top". O 14 já tem
a largura certa do texto (medi: o parágrafo do post tem 948px a 1440 e a primeira linha termina em
"réplica", como ele exigiu em F13-4; o 13 tem 786px e quebra em "linha"). Nenhum outro protótipo
tem tanto "tem que ter" junto. A `r3-base` (porta 4430) está hoje idêntica ao 14 (`r3base-home-v.png`).

O que sai do 14 na base, por pedido dele: o cinza entre Carreira e a série e a linha cinza embaixo
dos livros (`14-home.png`, `14-livro-arq-topo.png`), o "Neste artigo" dentro do card do topo do
post (`14-post-topo-b.png`), a linha "© 2026 … CC BY 4.0" e a estrutura atual do rodapé
(`14-rodape-a.png`).

### O que entra na base, resumido

Tudo o que é obrigatório e comum aos cinco: os T1 a T14, os F que valem para todos, os O1 a O11 da
rodada 2 e o computador (C1 a C10). As cinco linhas (16 a 20) mudam a cara e a home; não mudam o
que está aqui. O que é "pode ter" (P) entra onde indicado, por linha.

### O que não entra em nenhum dos cinco

- Vermelho de destaque (N1), a troca de página colorida e piscando (N2), cores demais (N3).
- Texto do artigo abaixo de 900px de coluna a 1440 (N4; o 13 reprovou com 786).
- Telas mortas (N5) e telas cheias de linha (N6); rolagem lateral de livros (N7); a pré-visualização
  fixa trocando a imagem (N8); zoom de imagem no hover (N9); nome em peso fino (N10); qualquer peça
  que não cresça com mais livros, séries, tags e posts (N11); o 07 inteiro (N12).
- "Leitor: você" no rodapé e a linha de copyright (F11-1); a orelha que dobra no anterior e próximo
  (T10); o clipe das fichas do 12 ("o clipes ali que está mal"); a estante com todos os artigos (G25);
  o embaralhar em texto grande (F15-2); o "Neste artigo" duplicado no topo do post (F14-8); o cinza
  da prateleira do 14 (F14-1); a barra embaixo dos livros da página do livro (F14-6); a luz dos livros
  do 12 em Livros (T8: "não ficou legal"); a abertura com luz do 13 (F13-1); o pop-up pequeno da busca
  (F12-9); séries misturadas com livros (O10); o texto do post, a caneta, as lousas e os desenhos
  (O1: não se mexe).

---

## 1. Base comum, por áreas

Cada área é de um construtor, com os próprios arquivos. A ordem aqui não é de prioridade. Onde duas
áreas se tocam (por exemplo, a sombra quente dos livros e a prateleira), a regra está escrita nas duas.

### Área 1. Livros vivos (T4, T5 na parte do livro, T6, T9, T11, T14, P1, O6, O8)

Entrega: um único comportamento de hover para todo livro 3D do site (home, Livros, topo da página do
livro, filtro das listas, "Do livro" do post, gaveta, livro ampliado em repouso), com brilho realista,
sombra quente e o livro que acompanha o mouse. Hoje cada protótipo tem um pedaço; aqui vira um só.

O que se vê e o que se sente:

1. **O livro acompanha o mouse** (T9, o 02). Dentro da área do livro, o ponteiro inclina o livro até
   ±6° no eixo vertical e ±4° no horizontal a partir do giro de repouso, com 90ms de atraso (lerp
   0,12 por quadro), e volta ao repouso em 0,45s ao sair. No 02 isso existe em Categorias
   (`02-zoom-livro-escuro-h.png`: o livro sob o mouse está virado para ele); aqui vale em todo livro.
2. **Um só giro de hover, que resolve T11, T14 e o giro de hoje.** Repouso a 38° (como hoje). Ao
   entrar o mouse, o livro vai para 20° e sobe 6px em 0,55s com uma curva de mola suave (o `--mola`
   do 04: `spring` com `bounce` 0,35; ele passa do alvo uns 6% e volta). Essa passada e volta é
   exatamente o que ele descreveu no 04 como "duas viradinhas, uma para cada sentido" (verifiquei no
   código do 04: `translateY(-6px) rotate(-2deg)` com `--mola` no livro do artigo). A saída não tem
   mola: 0,4s, `power2.out`. O 08 (38° para 12° e sobe 12px, 0,45s) fica absorvido: 20° e 6px é o
   meio-termo que não esconde a lombada. Portanto: **não existem dois giros em lugares diferentes**;
   existe um, com mola, em todo lugar. Decisão em uma linha: dois giros diferentes no mesmo site
   seriam notados como inconsistência por quem repara em detalhe, e a mola já entrega as "viradinhas".
3. **Brilho realista na capa e na lateral** (T4, o 11 só na capa). Exatamente a seção 2 de
   `luz-realista.md`: a camada `.brilho` em cada face, a mancha especular grande movida por
   `transform` (verniz na capa: mancha de 300px, pico branco 0,95 caindo a 0,3 em 30%, `overlay`;
   fosco na lombada: 420px, `soft-light`, pico 0,85), o fresnel na quina capa/lombada (faixa de 5% da
   largura, `screen`, aparece em 0,4s no hover) e a varredura diagonal de 1s no `mouseenter`. A luz
   é quente (`255 236 200`) nos dois temas. O ponteiro define uma só direção de luz; a lombada acende
   quando o mouse vai para o lado dela, a capa quando vai para o lado da capa. Liga só no livro em
   hover; nos outros, a `.luz-capa` estática de hoje.
4. **O brilho de cima para baixo na estante** (T4, o 11 e o 13): nos livros em fileira (home, topo
   da página do livro, filtro), uma vez por carregamento, uma faixa de luz desce pela fileira inteira
   da esquerda para a direita, 1,2s, 60ms de atraso entre livros, 0,6s depois de a fileira pousar.
   Não repete no hover.
5. **Sombra quente** (T6, "as sombras desse livro ficaram muito boas"). Seção 3 de `luz-realista.md`:
   contato (elipse justa, marrom-âmbar `60 38 8` a 0,55) mais projetada (larga, 0,22, deslocada para
   longe da luz) no claro; no escuro, halo quente por baixo (`255 170 70` a 0,12, `screen`) com o
   núcleo de contato preto. No hover o halo cresce 8% e sobe para 0,22 (0,4s). **A sombra é o chão
   do livro em todo lugar em que não há tábua**: é ela que substitui a barra cinza do 14 na home e no
   topo da página do livro (ver áreas 4 e 10). No claro ela tem que ser visível a olho nu sobre o
   papel da página (`02-livro.png` é a referência do amarelado que ele gostou).
6. **Pintar com o mouse** (P1, F14-5): em Livros, o card inteiro toma a cor do livro no hover, como o
   14 já faz (`14-livros-hover.png`), em 0,35s, com o texto passando para a tinta clara do livro. Isso
   vale também para o card de série em Séries e para a ficha "Do livro" do post (a ficha toma a cor;
   a foto do livro dá a mola do item 2).
7. **A caidinha** (O6): na estante de lombadas (onde ela existir: filtro das listas e, nas linhas
   16, 18 e 19, a home), o toque na cabeça de hoje (5°, 0,3s) continua como está.

Restrições: só `transform` e `opacity` dentro do livro 3D; nunca `filter` nem `opacity` animada num
ancestral do 3D (achata). Custo: a `.brilho` só no livro em hover; `will-change` só na mancha e só
durante o hover. Com movimento reduzido, tudo parado no estado final: o livro a 38°, a mancha fixa no
canto superior esquerdo a 60%.

### Área 2. Luz do fundo e lustre (T5, T7, T8, O7, O9)

Entrega: o fundo que acompanha o mouse, visível nos dois temas; o lustre do cabeçalho com a cordinha
e um acender e apagar de lâmpada incandescente de verdade; a luz em cima dos livros em Livros.

1. **O fundo colorido que acompanha o mouse** (T5). Uma mancha radial de 720px, âmbar, presa ao
   `<body>`, movida por `transform` com 120ms de atraso. No escuro: `255 190 110` a 10%, `screen`
   (`02-home-hover-escuro-hover1.png` é o efeito). No claro ela tem que aparecer (no 11 não aparecia,
   `11-home-hover-lampada.png`): a mesma mancha em `multiply` com um âmbar claro (`255 214 150` a
   16%) escurece levemente o papel em volta do mouse, e o centro leva um `soft-light` branco a 25%
   para dar o "ponto de luz" (`02-zoom-livro-claro-h.png` mostra o calor no papel claro do 02: é
   essa quantidade, não mais). Some em 0,6s quando o mouse sai da janela.
2. **O lustre** (T7, O9). O botão de tema é um lustre pendurado no fio do cabeçalho, à direita, com a
   cúpula, o bulbo e uma cordinha de 18px. O hover balança a cordinha (pêndulo que decai: 14°, −7°,
   3°, −1°, 1,2s) e acende um halo fraco em volta do bulbo (0,25s). O clique puxa a cordinha 6px para
   baixo (0,12s) e solta; a troca de tema começa na soltura. **O acender e apagar é a lâmpada
   incandescente da seção 1 de `luz-realista.md`**, e não um fade: ligar com τ = 75ms e 25ms de
   atraso, 150ms de tremor de partida; desligar com τ = 170ms, o branco morre em 100ms e sobra a brasa
   até ~500ms. Camadas em cores fixas com crossfade de opacidade (brasa, âmbar, branco quente), o
   núcleo antes do halo, o halo antes do cone, a sala por último. O halo é grande (760px) e fixo a
   partir do bulbo, por cima do cabeçalho e da página. Indo para o escuro, a sala escurece com a
   mesma curva; indo para o claro, acender a lâmpada é o que clareia a sala. A animação circular de
   hoje (D42) sai nesta base: o tema agora é a luz. Com movimento reduzido: um fade de 150ms.
3. **A luz em cima dos livros em Livros** (T8, o modelo é o 02, não o 12). Acima de cada card, um
   ponto de luz de 6px (latão no claro, âmbar aceso no escuro) e um cone de 60° que desce sobre o
   livro. Em repouso o cone está a 0,35 no escuro e a 0,12 no claro (`02-categorias-escuro.png`); no
   hover sobe a 0,9 e 0,5 em 0,4s, junto com a pintura do card (área 1, item 6). O ponto acende antes
   do cone (60ms). Fora de Livros, os pontos de luz só aparecem nas linhas que os pedem (18 e 20).

### Área 3. Rodapé (T1, F11-1, F12-2, F14-2, G30)

Entrega: a ficha de empréstimo do 12 e o "Cesar Schutz" gigante pela metade, juntos, na mesma
composição em todas as páginas.

O que se vê (de cima para baixo):

1. O conteúdo da página termina. Um respiro de 96px.
2. **A ficha de empréstimo do 12** ("está perfeita", `12-home-hover-rodape.png`), inteira como está:
   título "Ficha de empréstimo", "Cesar Schutz · Arquiteto de soluções" à direita, as colunas
   "Emprestado a: você", "Devolver: quando quiser", "Onde achar o autor" (GitHub, LinkedIn, RSS com
   os ícones e a animação de hoje do RSS) e "Na biblioteca" (Artigos, Livros, Séries, Tags), o carimbo
   "Biblioteca C.S. · data de hoje" (dinâmico, com a animação de bater o carimbo 0,6s depois de a ficha
   entrar na tela: cai de escala 1,25 a 1 em 0,18s e assenta) e o marcador de fita embaixo. Largura
   máxima 980px, centrada. Ela é a última coisa da página: **não há linha de copyright depois dela**
   (F11-1) e não há a logomarca repetida embaixo. Observação para a revisão: ele reprovou "Leitor:
   você" no 11 e aprovou a ficha do 12 inteira, que tem "Emprestado a: você"; mantenho porque é o
   que ele chamou de perfeito; se ele reclamar, troca-se por "Emprestado a: quem passar por aqui".
3. **O nome gigante atrás da ficha** (T1, F14-2). "Cesar Schutz" em Besley 800, tamanho
   `clamp(120px, 17vw, 260px)`, `letter-spacing` −0,02em, na tinta da página, cortado pela borda de
   baixo da janela de forma que **58% da altura das maiúsculas fique visível** (hoje é cerca de 50%; o
   pedido é "um pouco mais para cima, para ler melhor", `11-rodape-a.png`). A ficha fica por cima do
   nome, cobrindo a parte de cima das letras, com a sombra dela sobre as letras. O nome começa 36px
   acima da borda inferior da ficha.
4. **A respiração** (T1, do 08 sem o fino): o peso vai de 800 a 680 e volta, em 7s, `sine.inOut`,
   sem parar; nunca abaixo de 650 (N10). Só `font-variation-settings` do eixo `wght`, porque a Besley é
   variável. Com movimento reduzido, parado em 800.
5. **Tela pequena** (< 900px): as colunas da direita da ficha descem para baixo das da esquerda, a
   ficha ocupa a largura toda menos a margem, e o nome continua atrás dela, com o mesmo corte
   (`11-rodape-390-a.png` mostra o que não pode acontecer: o nome sumindo embaixo de um bloco solto).
6. A seta de voltar ao topo continua (G30), no canto, fora da ficha.

### Área 4. Página do livro (F11-3, F12-3, F14-6, F15-3, P2, A8, A9, T3, G7)

Entrega: o topo do 14 (todos os livros em cima, centralizados, a troca em que um sobe e o outro desce,
e eles encolhem ao rolar) com o painel do 15 (o livro grande à direita, as tags em volta, o texto à
esquerda), sem a barra cinza e sem vazio quando o livro tem poucos posts.

1. **A fileira de cima** é a do 14 (`14-livro-arq-topo.png`): todos os livros 3D, centrados, o lugar
   do livro aberto vazio com o contorno tracejado, a troca animada (o aberto volta para o lugar, o
   escolhido desce para o painel: ~1,2s, `14-livro-arq-troca-t400.png` e `-t1200.png`) e o encolher ao
   rolar (`14-livro-seguranca-rolado.png`). A série fica nessa fileira também, à direita, com um vão
   de 24px antes dela. **A barra cinza sai**; o que segura os livros é a sombra quente de contato de
   cada um (área 1, item 5). Em tela pequena, a fileira vira lombadas (o giro do 14).
2. **O painel do livro é o do 15** (`15-livro-topo.png`, "GOSTEI MUITOOO"): à esquerda, "Livros /
   Volume 05", o nome, a frase, "N artigos · o último em 2026"; à direita, o livro grande (P2, até
   300px de largura a 1440) com as tags do livro em volta dele, em pílulas com ícone e contagem, no
   máximo seis à vista e "+N" que abre as demais (porque um livro vai ter muitas tags, G19); o clique
   numa tag abre a tag já filtrada por este livro (O5, G19). O botão de ampliar no canto do livro
   abre o livro ampliado de hoje (A9). A marca d'água do desenho continua no canto direito do painel.
3. **Anterior e próximo:** os dois livrinhos do 15 saem (seriam a segunda cópia dos mesmos livros que
   estão na fileira de cima, e ele reclamou de não ver todos: a fileira resolve). No lugar, sob a
   contagem, dois links de texto "← Vol. 04 IA" e "Vol. 06 DevOps →" (setas que andam 3px no hover,
   como as da paginação de hoje). Decisão em uma linha: a fileira de cima já mostra o anterior e o
   próximo fisicamente e anima a troca; repetir os livros embaixo poluiria.
4. **O contador** (T3): "N artigos" roda para cima ao entrar na página (o `contador.ts` de hoje, 0,55s,
   `power3.out`), inclusive quando se troca de livro pela fileira.
5. **Poucos posts sem vazio** (F11-3). Com 1 a 3 artigos em modo cards, a linha de cards fica
   centrada e os cards mantêm a largura normal; com 1 ou 2, abaixo deles entra uma linha "Deste livro
   também:" com as três tags mais usadas do livro como fichas pequenas (ícone, nome, contagem), só
   quando existirem. Nada de alargar card nem de encher com texto.
6. **Rolagem** (G7): ao rolar, a fileira encolhe para 60% e gruda sob o cabeçalho, como no 14.

### Área 5. Post (F12-6, F13-4, F14-8, F12-7, T10, T11, T14, O1 a O4, A12, G9)

Entrega: o post do 14 ("tá top") limpo e com os três acréscimos que ele pediu.

1. **A estrutura é a do 14** (`14-post-topo-a.png` e `-b.png`): a folha do topo com a ilustração na
   largura toda, o título abaixo dela, autor, data, tempo e "Código deste artigo"; depois, o corpo em
   uma folha de **948px de coluna a 1440** com o post-it "Neste artigo" à esquerda, alinhado ao topo da
   folha do corpo, e a ficha "Do livro" fixa embaixo dele (F13-4: "o livro fixo embaixo do neste
   artigo"). O post-it e a ficha são `sticky` e andam juntos. **Sai o "Neste artigo" de dentro do card
   do topo** (F14-8). A primeira linha do post de criptografia tem que terminar em "réplica".
2. **As cantoneiras** (F12-7): a ilustração fica 16px para dentro da folha do topo, com quatro
   cantoneiras de álbum de foto (triângulos na tinta, 22px) nos cantos; no hover da ilustração, as
   quatro se afastam 2px para fora e giram 3° em 0,3s, e voltam ao sair (`12-post-topo-hover.png`).
   A capa viva (D58) continua no hover do topo.
3. **Anterior e próximo com imagem** (T10): dois cards lado a lado no fim do artigo, cada um com a
   ilustração do post à esquerda (160px) e o rótulo, o título e o subtítulo à direita, como o 02
   (`02-post-fim-hover.png`), sem a orelha. No hover: a ilustração mexe o detalhe da capa viva, o card
   sobe 2px e a seta anda 3px. Quando não há próximo, o lugar fica com o quadro tracejado e a frase
   do 02 ("Este é o mais novo…"). No celular, um embaixo do outro.
4. **O livro do post** (T11, T14): a ficha "Do livro" é um papel colado (G28, o "adesivo"): fundo da
   folha, uma borda de fita no alto; no hover, a foto do livro dá a mola de 0,55s da área 1 e a ficha
   toma a cor do livro (P1). A marca d'água grande do desenho do livro continua no painel do título
   (O4).
5. O resto do artigo não se mexe (O1): texto, caneta, lousas, figuras, atalhos e a ficha dos atalhos
   (O2), a caneta da leitura no fio do cabeçalho (O3).

### Área 6. Tags e Livros (F11-2, F12-8, F13-3, F14-4, T8, T13, A10, A11, O5, G16)

Entrega: Livros como no 14 mais a luz do 02; Tags com as palavras grandes em cima, as fichas embaixo
caindo de cima, o ícone que se mexe, e a cortina.

**Livros** (`14-livros.png`): a grade do 14 com os cards 3D, a pintura no hover (área 1), a luz em
cima de cada livro (área 2, item 3), a cortina com "Livros" na navegação interna e os cards se
montando depois dela (área 7). "Ainda sem artigos" continua para os livros vazios. Séries em página
própria, igual ao 14 (`14-series.png`).

**Tags**:

1. **No alto, as palavras grandes** (F13-3, o 13, `13-tags.png`): a nuvem com o nome de cada tag em
   Besley, tamanho pela contagem (de 18px a 44px, com teto), o ícone da tag antes do nome e a contagem
   em expoente; os ícones são obrigatórios (G16). O hover inclina o ícone 8° e sublinha o nome com o
   traço de caneta.
2. **Embaixo, todas as tags como fichas** (F11-2, G27): o card de hoje vira ficha (a tira de cima com
   "Tag · N artigos" e a mini-estante dos livros em que ela aparece, os três últimos artigos e "Todos
   os N"); o ícone grande à direita **se mexe no hover do card inteiro** (inclina 8° e sobe 2px,
   0,35s), não só no hover do ícone.
3. **A entrada** (F12-8, F14-4): a cortina com "Tags" e, quando ela sai, as fichas caem de cima, uma a
   uma, da esquerda para a direita e de cima para baixo (36px de queda, 0,45s, 40ms entre elas, com um
   assentar de 2px), como no 11 (`11-tags-entrada-t500.png`). As fichas que estão abaixo da dobra
   caem quando entram na tela (T13), nunca todas de uma vez.
4. A ordem é por uso (como o 14), então a regra das letras dividindo a linha (F12-8) só se aplica onde
   houver agrupamento por letra: na linha 19 (as gavetas do 09).
5. **A página de uma tag** fica como no 14 (`14-tag.png`): a ficha do topo com o ícone como marca
   d'água (A11), "Aparece junto com", a estante pequena de filtro por livro à direita (O5; o filtro
   vale pela URL `?livro=`), e a lista ou os cards embaixo.

### Área 7. Transições e entradas (T2, T12, T13, F14-3, A1, A13, G5, G10, G21)

Entrega: a cortina do 14 na navegação interna, seguida da montagem das folhas que já existe; a
abertura de hoje ao chegar de fora; listas e cards que aparecem ao rolar; o menu que gira.

1. **A cortina e a montagem, juntas** (T2, F14-3, G10). Na navegação interna, a sequência é:
   - 0 a 0,38s: uma folha inteira sobe de baixo para cima e cobre a tela (`cubic-bezier(.7,0,.2,1)`).
     No claro, azul-tinta escuro (um token `--cortina`, o azul do 14: `14-cortina-t500.png`) com o
     texto claro; no escuro, o papel claro com o texto em azul-tinta (`14-cortina-escuro-t500.png`).
     "Isso vai ter com certeza."
   - o nome do destino aparece duas vezes: pequeno no alto à esquerda, desde o começo; gigante
     (Besley 800, 160px) embaixo à esquerda, subindo 12% mais devagar que a folha (paralaxe), como no
     14 (`14-cortina-t200.png`).
   - 0,38 a 0,62s: a cortina segura, com o nome gigante terminando de assentar.
   - 0,62 a 0,98s: a cortina continua subindo e sai pelo alto. **Por baixo dela, a página nova já
     está montando**: as folhas da troca de hoje (`troca.js`, pouso em 1s com 85ms entre elas)
     começaram o voo em 0,5s, ainda cobertas, e quando a cortina descobre a tela elas estão pousando
     (é o "lead" que ele imaginou: a cortina esconde o começo, e o que se vê é a chegada). Em Livros
     e Tags, a montagem é a dos cards (`14-cortina-livros-montando-t1250.png`): eles chegam do canto
     direito, girados, e se arrumam.
   - total: cerca de 1,4s, menos que a troca de hoje (1,6s). O cabeçalho fica parado, por cima da
     cortina, com o traço do menu deslizando (A13).
   - voltar pelo histórico: a cortina desce em vez de subir. Tema trocado no meio: a cortina usa o
     tema de destino.
   - ao chegar de fora ou recarregar, **não há cortina**: é a abertura de hoje (a estante se monta na
     home, A1; o caderno voa nas outras páginas), que ele gosta. A da home nas linhas 16, 18 e 19
     monta a estante delas; a do 14 (17) monta a fileira de livros.
2. **O menu que gira** (T12): o texto do item do menu rola para cima e o mesmo texto entra por baixo,
   letra a letra (0,32s, 12ms entre letras), como no 14 (`14-home-hover-livro-menu.png`). Só no
   cabeçalho e no rodapé da ficha ("Na biblioteca"); nunca em títulos.
3. **Listas e cards que aparecem ao rolar** (T13, G21, "como na Apple"): todo card ou item de lista
   abaixo da dobra aparece quando 15% dele entra na tela: sobe 14px e vai de 0 a 1 em 0,5s,
   `cubic-bezier(.2,.7,.2,1)`, no máximo 60ms de escalonamento dentro da mesma linha, uma vez só. O
   que está acima da dobra já aparece com a página (ou com a montagem). Nada mais ganha animação de
   entrada: só listas e cards (o resto cairia na regra "animação de entrada em cada seção", que é
   cara de IA). Com movimento reduzido, tudo visível desde o início.
4. **Trocar de livro na página do livro, de página na paginação e de modo Lista/Cards** continuam com
   as animações de hoje (D49), sem cortina.

### Área 8. Busca (F12-9, A16, G11)

Entrega: uma busca de papelaria e biblioteca, grande, que nasce do campo e desce do cabeçalho, no lugar
do pop-up pequeno do 11, 12 e 14 (`12-busca-aberta.png`, `14-busca-aberta.png`).

1. **Nasce do campo e desce do cabeçalho** (G11): com clique, ⌘K ou Ctrl+K, uma folha cresce a partir
   do campo (o Flip de hoje, 0,5s, `power3.out`) até ocupar a largura do conteúdo (máximo 1320px) e
   até 70% da altura da janela (mínimo 420px), presa logo abaixo do cabeçalho; o véu escurece a página
   a 55%. Fecha encolhendo de volta ao campo (0,35s) com Esc, clique fora ou "Fechar".
2. **É uma ficha de consulta**: papel da folha com pauta (linhas horizontais a cada 36px, na cor da
   pauta do caderno), o campo de digitação é a primeira linha da pauta, com a lupa de caneta à
   esquerda e o cursor piscando. Sem borda de input.
3. **Os resultados são linhas da ficha** (até 8 à vista, rolagem fina para o resto): título em Besley,
   abaixo o livro e a data; o termo com o marca-texto que se estica (0,45s). No hover ou com as setas,
   **a caneta ao lado e a pintura** de hoje (A16): o colchete preto se escreve na margem e o fundo do
   item ganha a tinta azul que escorre do início para o fim (0,28s).
4. **À direita, a ficha do resultado** (em telas ≥ 1000px): a ilustração do post sob o mouse ou
   selecionado (G24: "a imagem do post que estou com o mouse") e, embaixo dela, o livro 3D pequeno,
   que gira com a mola quando troca, e "Vol. 05 · 22 min · 29 set 2026". Troca de resultado = a
   ilustração esmaece 0,12s e a nova aparece subindo 6px.
5. Sem resultado: o termo ganha a ondinha de revisor (hoje) e a frase "Nada com esse nome nas
   fichas. Tente o nome do livro ou uma #tag." Setas, Enter e Esc funcionam; o foco volta ao campo.
6. Em tela pequena, a folha ocupa a tela toda abaixo do cabeçalho e a ficha da direita some.

### Área 9. O computador (C1 a C10, O11)

É igual nos cinco e é construído uma vez. A direção está na seção "Computador", no fim, porque é
longa. Os pontos de contato com as outras áreas: o ícone fixo no canto inferior esquerdo em todas as
páginas (não pode encostar na seta de voltar ao topo, que fica à direita) e a entrada e saída com
zoom do 12.

### Área 10. Fichas: cards, lista e home do 14 (F12-1, F13-2, G13, A3, P7, T3, F14-1 na parte comum)

Entrega: os cards e a lista como fichas, com o volume e o número; o destaque com a imagem ao lado; a
home do 14 sem a prateleira cinza e com a gaveta de hoje de volta.

1. **Card = ficha** (F12-1, "a ficha com os números de cada um, muito legal"): a tira de cima em
   mono pequeno, "Vol. 05 · ficha 2" à esquerda e "nº 028" à direita (o nº é a ordem do post no blog, a
   ficha é a ordem dentro do livro; na série, "Coleção Java · ed. 7"), sobre um fio da cor do livro.
   **Sem o clipe.** Abaixo, a ilustração no painel do livro, o chip do livro, a data e o tempo com os
   ícones de caneta, o título, o subtítulo, o resumo e as tags com os ícones. Quatro por linha a
   1440 (G13). O hover é o de hoje (a folha sobe), mais a capa viva.
2. **O destaque** (F13-2, G14): o card "Mais recente" ocupa duas colunas com a **ilustração de um
   lado e o texto do outro** (no 13, a imagem à esquerda e o texto à direita: `13-home.png`; é isso),
   a tira de ficha no alto como os demais. A ilustração do destaque continua se desenhando ao entrar
   (D41).
3. **Lista = fichas separadas, horizontais** (F12-1): cada item é uma ficha própria (não uma folha
   contínua com fios), com a ilustração à esquerda (200px a 1440), a tira do volume e do número no
   alto, e o texto ao lado, como o 12 (`12-home-lista.png`); 12px entre fichas; o colchete de caneta
   no hover. Em telas pequenas a imagem fica em cima.
4. **A home do 14**: cabeçalho da home do 14 (o caderno, o nome gigante com a assinatura, o texto, os
   números 28 / 9 / 20 que rodam para cima ao entrar, T3, e o último artigo), "A coleção" com os
   livros 3D em fileira e **sem o aparador cinza entre Carreira e a série e sem a linha cinza
   embaixo** (F14-1, `14-home.png`): o que fica sob cada livro é a sombra quente (área 1). A série fica
   na mesma fileira, com 24px de vão. Em tela estreita os livros viram lombadas, como já fazem
   (`14-home-768.png`; ele adorou). As linhas 17 e 18 mexem só nessa fileira; o resto da home é comum.
5. **A gaveta de volta na home** (P7, "seria legal principalmente na home"): clicar num livro da
   fileira tira o livro dela: ele vem para a frente e desce para uma gaveta que abre embaixo da fileira
   (0,9s, `power3.inOut`, o livro girando até 38° e crescendo até 180px), e o lugar dele na fileira
   fica vazio com o contorno tracejado. A gaveta (0,8s) traz o sumário do livro como hoje: os cinco
   últimos artigos, a contagem, "Ver o livro" e o botão de ampliar (A5). Clicar em outro livro guarda
   o primeiro (0,6s, de volta ao lugar) e tira o segundo; Esc guarda. Com movimento reduzido, o livro
   aparece na gaveta e o lugar fica vazio.
6. **Cards é o padrão na primeira visita** e a escolha é lembrada (G13), como hoje.

---

## 2. As cinco linhas

Todas partem da `r3-base` pronta. Cada linha muda a cara (tokens), a home, os detalhes listados e
nada mais; o que não está escrito é o da base. As duas paletas de cada linha estão em tokens novos ou
em sobrescrita dos de hoje (`tokens.ts`): a cor do livro, a caneta azul e os tons das figuras não
mudam (D58).

### 16. Parede

**Conceito.** A home é a parede do escritório de quem estuda: a estante de livros, um quadro com o
nome e o texto, e um quadro de cortiça com as fichas dos artigos presas por alfinetes de cabeça
redonda e colorida (F12-5, o protótipo que ele pediu para "ver"). O resto do site é a mesa debaixo
dessa parede: papel, cortiça e madeira clara.

**A cara.** Claro: parede em papel de parede quente (`--pagina: #ECE5D8`), folhas `#FFFEFA`, tinta
`#1E1F1C`, cortiça `#C7A574` com grão fino (um `radial-gradient` repetido de 3px, sem imagem), moldura
do quadro em madeira clara `#B48A5C`, azul-tinta `#2549B8`. Escuro (não tão escuro, G29): parede
`#1E1B18`, folhas `#2A2622`, tinta `#ECE6DC`, cortiça `#6E5236`, moldura `#7A5C3C`, azul `#93AEFF`.
Os alfinetes têm cinco cores, e **a cor da cabeça do alfinete é a cor do livro do artigo**: a tag de
cor vira objeto.

**A home.** De cima para baixo:

1. A parede ocupa a largura toda, sem folha em volta. À esquerda, um **quadro** com moldura fina de
   madeira e vidro (um reflexo diagonal estático a 6%): dentro, o caderno "cs", "Cesar Schutz", o texto
   de apresentação e os três números que rodam (T3). À direita, a **estante**: uma tábua de madeira
   clara com espessura (14px) presa à parede por dois suportes, com as lombadas de hoje (a caidinha,
   a legenda, a abertura em que a estante se monta); clicar tira o livro para a gaveta (área 10,
   item 5), que aqui abre como uma prateleira que desce. Em tela pequena, o quadro fica em cima e a
   estante embaixo.
2. **O quadro de cortiça** com "Artigos recentes" escrito numa etiqueta de papel presa com fita no
   canto. As fichas (área 10) estão presas por um alfinete cada, na borda de cima, levemente tortas
   (±1,5°, alternando), com a sombra curta de papel sobre cortiça. Cards e Lista continuam (a lista
   são fichas horizontais presas por dois alfinetes). Ao rolar, cada ficha é pregada quando entra na
   tela (T13): o alfinete chega de escala 1,6 e 0 de opacidade em 0,22s e, no toque, a ficha aparece
   embaixo dele (0,3s). No hover, a ficha endireita (0° em 0,3s), sobe 3px e a sombra cresce. O
   destaque é uma ficha dupla (duas colunas) com dois alfinetes.
3. **O rodapé é a mesa**: abaixo da cortiça, uma faixa de tampo de madeira (mais escura que a estante,
   `#8D6A45` / `#4E3A28`) na largura toda, de 220px de altura, vista de cima com a borda de frente; a
   ficha de empréstimo (área 3) está **deitada sobre a mesa**, levemente girada (−1°), e o nome
   gigante é **pintado na parede, atrás da mesa**, cortado pela borda da mesa (é a "metade" do T1: a
   mesa corta as letras). A respiração do peso continua. Esta foi a parte que ele pediu para imaginar.
4. A paginação (1, 2, 3 e "Mais artigos") fica numa etiqueta presa à cortiça no pé do quadro.

**Cards e lista.** Os da base, presos por alfinetes só na home e em Tags; nas outras páginas, as
fichas normais sobre a mesa (a parede continua de fundo).

**Post.** O da base. A folha do topo e a do corpo ficam sobre a parede; o post-it "Neste artigo" é
preso por um alfinete em vez de colado.

**Página do livro.** A da base; a fileira de cima está sobre uma tábua igual à da home.

**Tags e a tag.** O quadro de cortiça de novo: a nuvem de palavras no alto numa folha presa por quatro
alfinetes, e as fichas das tags pregadas, caindo de cima (área 6). A página da tag é a da base.

**Busca.** A ficha de consulta da base, presa ao topo por dois alfinetes.

**Rodapé.** O da home (a mesa) em todas as páginas.

**Detalhes só dela.** Os alfinetes (cabeça de 10px, haste de 1,5px, sombra de 2px) e a cor por livro;
a fita adesiva das etiquetas; a cortiça com grão.

**Os P que usa.** P1 (pintar), P2 (livro grande), P7 (a gaveta na home).

### 17. Grade suave

**Conceito.** A home "perfeita" do 14, com a fileira de livros limpa: sem aparador, sem linha, sem
prateleira nenhuma; os livros em pé no papel da página, cada um sobre a própria sombra quente, como
os do 02 no claro (`02-categorias.png`). É a linha mais próxima do 14 e, por isso, a mais próxima do
que ele já aprovou: tipografia grande, muito ar, o nome gigante em cima e embaixo. O que a diferencia
das outras é a economia: nenhum objeto que não seja papel, tinta e livro.

**A cara.** A paleta de hoje ("Folhas claras", `tokens.ts`), sem mudança: claro `#F1F0EB` / `#FFFFFE`
/ `#1A2124` / `#2549B8`; escuro `#111618` / `#1A2124` / `#E7E9E4` / `#93AEFF`. O que muda é a luz: a
mancha âmbar do mouse e o lustre dão o calor.

**A home.** A da área 10, com a fileira **sem nada embaixo**: nove livros 3D (oito volumes e a série,
com o vão de 24px), legendas "Vol. 01" em cima e nome embaixo, e a sombra quente de cada um sobre o
papel (contato e projetada). A onda de luz de cima para baixo passa pela fileira depois de montar
(área 1, item 4). O brilho de cima para baixo é o único enfeite.

**Cards e lista.** Os da base.

**Post.** O da base.

**Página do livro.** A da base.

**Tags e a tag.** As da base.

**Busca.** A da base.

**Rodapé.** O da base: a ficha e o nome gigante.

**Detalhes só dela.** A ausência de prateleira é a assinatura. Para compensar a limpeza, um detalhe
de papelaria no título de cada seção da home ("A coleção", "Artigos recentes"): o traço de caneta
preta que se escreve embaixo do título quando ele entra na tela (0,34s), uma vez.

**Os P que usa.** P1, P2, P7.

### 18. Estante moderna

**Conceito.** A mesma home do 14, mas os livros estão numa **estante moderna**: uma prateleira
flutuante de madeira escura, fina e com espessura, fixada na parede sem suportes à vista, com uma
régua de **luzes de quadro** em cima (os pontos de luz do 02, T8) iluminando cada livro. É o pedido
dele para "desenhar melhor para parecer uma estante daquelas modernas com os livros em cima", e a
preocupação dele ("mas aí a animação deles não sei se ia ficar legal") é resolvida: os livros giram
para lombada exatamente como no 14 quando a tela estreita, e a prateleira encolhe junto.

**A cara.** Claro: papel `#F0EDE6`, folhas `#FFFFFE`, tinta `#1A1F22`, madeira da prateleira
`#3F3127` com a face de cima `#5A473A`, latão das luzes `#B08D57`, azul `#2549B8`. Escuro (G29):
`#1B1D1F`, folhas `#242729`, tinta `#E6E7E2`, madeira `#2A211B`, latão aceso `#E0B46A`, azul
`#93AEFF`. A luz âmbar do mouse é um pouco mais forte aqui (12% no escuro).

**A home.** A da área 10 com a fileira sobre a prateleira: tábua de 16px de espessura, 1,5% mais larga
que a fileira de cada lado, com sombra projetada na parede embaixo (24px, difusa). Sobre cada livro,
uma luz de quadro: um braço curto de latão e a cúpula pequena, com o cone de luz descendo sobre o
livro (repouso 0,35 no escuro e 0,12 no claro; hover 0,9 e 0,5). Ao carregar, as luzes acendem uma a
uma da esquerda para a direita (60ms entre elas, com a curva de incandescente da área 2) **antes** de
a onda de luz passar pelos livros. Em tela estreita (< 1100px), os livros giram para lombada e a
prateleira encolhe para a largura deles; as luzes encolhem junto (uma a cada dois livros abaixo de
700px). Clicar num livro o tira para a gaveta (área 10, item 5), e a prateleira ganha o vão.

**Cards e lista.** Os da base.

**Post.** O da base.

**Página do livro.** A da base, com a fileira de cima sobre a mesma prateleira moderna, com as luzes;
ao rolar, a prateleira encolhe junto com os livros.

**Tags e a tag.** As da base; o filtro por livro da página da tag fica numa prateleira curta igual.

**Busca.** A da base.

**Rodapé.** O da base.

**Detalhes só dela.** As luzes de quadro em toda fileira de livros; a onda dos livros do 15 (F15-1): na
home, 0,35s depois de a fileira pousar, cada livro faz a mola do hover em sequência (75ms entre eles),
uma vez por carregamento, como no `estante-viva.ts` do 15.

**Os P que usa.** P1, P2, P7, e P6 só na tira "Vol. 05 · ficha 2" das fichas (embaralha 0,4s ao
entrar na tela).

### 19. Biblioteca

**Conceito.** O 09 "com chave de ouro": a biblioteca que ele disse ser a que mais combina com o atual,
sem as telas mortas. Madeira de verdade, fichário de catálogo, carimbos, cordinha, mas sobre a
estrutura e as animações do 14. A pergunta que guia cada tela é "o que a biblioteca teria aqui?",
e a resposta nunca pode ser "nada".

**A cara.** Claro: papel creme `#F2EBDD`, folhas `#FFFDF7`, tinta `#231F1A`, madeira `#7A5231` com a
face clara `#9C6E45`, metal das gavetas (puxador) `#8C7A5A`, azul-tinta `#2549B8` (nada de laranja ou
vermelho: N1). Escuro (G29, não tão escuro): `#241E19`, folhas `#2F2823`, tinta `#EEE6D8`, madeira
`#4A3324` / `#5E4330`, metal `#A89270`, azul `#93AEFF`. A combinação marrom e amarelo que ele
reprovou no 12 (F12-4) não existe aqui: a luz é âmbar fraca sobre creme, e o marrom é só madeira.

**A home.**

1. A **estante de madeira** da home de hoje, com uma só prateleira: os volumes e a série em lombada,
   com a caidinha, a legenda e a gaveta de hoje (P7, "principalmente na home") e a abertura em que a
   estante se monta (A1). Laterais e tábua com espessura e veio discreto (gradientes, sem imagem). A
   luz âmbar do mouse passeia pela madeira. **Não há a segunda prateleira com todos os artigos** (G25,
   N11).
2. Abaixo, o **balcão de catálogo**: um tampo de madeira baixo com a etiqueta "Recém-catalogados" e,
   sobre ele, as fichas dos artigos (área 10) **inclinadas num porta-fichas** (como no 09,
   `09-home-hover-a.png`), em cards ou em lista. O destaque é a primeira ficha, de pé, maior. Ao rolar,
   as fichas entram no porta-fichas uma a uma (T13). A paginação é "Fichas 1–11 de 28" com as setas.
3. O quadro com o nome e o texto fica na parede acima do balcão, à esquerda da estante, como um
   letreiro de latão com "Cesar Schutz" e, em mono pequeno, "Arquiteto de soluções".

**Cards e lista.** Fichas de catálogo: a tira de cima em mono com a cota ("QA76.9 · nº 028 · Vol. 05")
no lugar de "Vol. 05 · ficha 2"; o furo da ficha embaixo (o círculo do 12). O resto, a base.

**Post.** O da base, com o "Do livro" como ficha de empréstimo pequena colada na lateral ("Retirado
de: Segurança, Vol. 05") e o carimbo da data de publicação.

**Página do livro.** A da base; a fileira de cima está numa prateleira de madeira da estante da home.

**Tags e a tag.** **As gavetas do 09** (G27, "gostei muito das gavetas com as letras"): no alto, a
nuvem de palavras da base (F13-3) e, abaixo, o móvel de fichário com uma gaveta por letra (puxador de
metal e etiqueta), mais a gaveta "Todas" na ponta. Clicar numa letra puxa a gaveta (0,4s, `power2.out`,
a frente da gaveta sai 18px com a sombra) e as fichas daquela letra caem na área embaixo (área 6,
item 3). "Todas" puxa todas as gavetas em cascata (40ms entre elas) e mostra todas as fichas, **com as
letras dividindo a linha** (F12-8: terminou o A com espaço sobrando na linha, o B começa ali mesmo, com
um separador de letra pequeno à esquerda da primeira ficha de cada letra). Letras sem tag ficam com a
gaveta apagada. A página da tag é a da base, com a ficha do topo como ficha de catálogo.

**Busca.** A ficha de consulta da base, mas o painel desce de uma gaveta do fichário no cabeçalho: a
folha sai de trás de uma frente de gaveta de madeira de 24px que fica no topo da busca, e volta para
ela ao fechar.

**Rodapé.** A ficha de empréstimo (área 3) sobre o tampo do balcão, com a cordinha de voltar ao topo
pendurada à direita (G30: "a cordinha com efeito"), que balança no hover e, ao puxar, sobe a página.
O nome gigante na parede atrás, cortado pelo balcão.

**Detalhes só dela.** A cota das fichas; as gavetas; o letreiro de latão; o carimbo em mais lugares
(a data de publicação no post).

**Os P que usa.** P1, P2, P5 (é ela), P7.

### 20. Noturno

**Conceito.** A luz do 02 (o segundo preferido dele, antes do 01) sobre a estrutura do 14. A home do
14 ganha o palco do 02: os livros em pé numa superfície escura, cada um sob o próprio ponto de luz, e
a abertura do 02 (P3, "muito boa, elegante") no lugar da estante que se monta. É a linha em que a
lâmpada manda: o fundo que segue o mouse, as sombras quentes e o lustre são protagonistas, e a
"cartolina" do 08 aparece como o papel grosso da cor do livro sob a luz.

**A cara.** Claro (o 02 claro, que ele viu bonito nos dois temas): papel quente `#EFEAE2`, folhas
`#FFFDF9`, tinta `#1B1A18`, luz `#D9A85B`, azul `#2549B8`. Escuro: tinta-de-noite `#0E1114`, folhas
`#171B1F`, tinta `#ECE7DE`, luz `#E6B46A`, azul `#93AEFF`. A luz âmbar do mouse é a mais forte das
cinco (14% no escuro, 18% `multiply` no claro).

**A home.** A da área 10, com a fileira dos livros sobre um **palco**: uma faixa horizontal mais
escura que a página (no claro, o papel a 6% de tinta; no escuro, preto quente), com a borda de frente
e **um ponto de luz acima de cada livro**, cone descendo (área 2, item 3), que acende forte no hover
do livro (`02-categorias-hover-escuro-h1.png`). A **abertura do 02** (P3) ao chegar de fora: a sala
escura, o lustre acende com a curva de incandescente, a luz revela a fileira de livros um a um, e o
nome gigante do 14 aparece quando a luz chega nele; no claro, a mesma sequência com a sala quase
clara (a lâmpada acende e só o calor muda). Depois dela, a página de sempre.

**Cards e lista.** Os da base; a ilustração do card tem a cantoneira de luz: um reflexo diagonal
estático a 8% no painel.

**Post.** O da base, mais a **cartolina** (T14, o 08): atrás da ilustração do topo, um papel grosso
da cor do livro, 12px maior que a ilustração de cada lado, com a sombra de papel (é a cartolina que
ele descreveu: "um papel mais grosso da cor do livro no header do post"); o texto do título continua
na folha branca abaixo. A cartolina ganha a luz do mouse (a mancha passa por ela).

**Página do livro.** A da base, com a cartolina atrás do livro grande (a mesma cor do livro) e o ponto
de luz sobre ele, fixo e aceso; a fileira de cima sobre o palco com um ponto de luz por livro.

**Tags e a tag.** As da base; na página da tag, a marca d'água do ícone fica sob um cone de luz fixo.

**Busca.** A da base, com o papel da ficha iluminado pela lâmpada (um gradiente fixo do alto, 6%).

**Rodapé.** O da base; o lustre do cabeçalho projeta o cone até o rodapé no escuro (um gradiente
fixo), e o nome gigante fica no limite da luz.

**Detalhes só dela.** O palco e os pontos de luz na home; a cartolina; a abertura do 02; a sala que
escurece de verdade na troca de tema.

**Os P que usa.** P1, P2, P3, P7; P4 não (a cor do livro em toda a tela, ele mesmo duvidou que combine).

---

## 3. O computador (C1 a C10)

Alto nível, porque a pesquisa visual está em `macos.md`, que o construtor segue para medidas,
cores de janela, barra de menus, Dock e a licença do que pode ou não ser copiado (nada da Apple:
papel de parede, ícones, maçã, fonte empacotada). O foco desta rodada é a experiência de entrar,
usar e sair, e as animações (C10); o conteúdo de dentro melhora depois.

### Entrar e sair (C2, C9)

- **O ícone** é o computador desenhado do 12 (o Mac antigo a caneta, `12-home-hover-ficha.png`),
  fixo no canto inferior esquerdo, 64px, em todas as páginas. Ao rolar para baixo ele desce 60% e
  fica espiando (0,3s); ao rolar para cima, ao parar 1s ou ao passar o mouse, volta inteiro (C2: "ele
  aparece inteiro e quando rolo ele vai para baixo e some um pouco"). No hover, a tela dele acende
  (um retângulo claro em 0,2s). Rótulo para leitor de tela: "Abrir o computador".
- **Entrar** é a animação do 12 (`12-pc-t600.png`): a página inteira cresce em direção ao ícone e
  desfoca (escala 1,6 e `opacity` para 0 em 0,7s, `power3.in`; o desfoque é uma camada por cima, não
  `filter` na página) enquanto um MacBook Pro cresce do ícone até ocupar a janela (0,9s,
  `power3.inOut`): primeiro se vê o notebook inteiro (tampa, tela com o entalhe, base) por uns 0,3s,
  e a "câmera" continua entrando até a tela dele ser a janela toda (0,6s). Total ~1,5s. A tela já
  está ligada com a área de trabalho. Com movimento reduzido, corta direto.
- **Sair** (C9): não é fechar um app. Há dois jeitos: o item "Sair do computador" no menu "cs" (o menu
  que fica onde a maçã ficaria, com o símbolo do caderno) e um atalho ⌘⇧Q; o caminho de volta é o
  inverso (a câmera recua, o notebook encolhe para o ícone, a página volta a nítida). O Esc fecha a
  janela da frente; sem janela, não faz nada (para ninguém sair sem querer).

### A área de trabalho (C1, C3)

- **Papel de parede próprio** nos dois temas (segue o tema do blog), nas cores do `macos.md` (areia
  e curvas claras no claro; carvão e marrom no escuro), feito em SVG inline, sem imagem.
- **Barra de menus** no alto, transparente sobre o papel: o menu "cs", o nome do app em foco em negrito
  e os menus dele (mudam com o app em foco: é o que vende o realismo), e à direita a data e a hora de
  verdade e o botão de tema (o mesmo lustre em miniatura, para o tema do blog e do computador andarem
  juntos).
- **Dock** embaixo, de vidro, com quatro apps (Finder, Terminal, "Código" e Pré-Visualização), um
  separador e a Lixeira; o aumento no hover (ícone de 48px vai a 72px, os vizinhos a 60px, 0,18s) e o
  pulo ao abrir (dois pulos, 0,9s). Os ícones são desenhos nossos, no estilo das pastas e janelas do
  macOS, nunca os da Apple.
- **Na área de trabalho**, uma pasta "Livros" (duplo clique abre o Finder nela) e um arquivo
  "Leia-me.md" (abre no Código).

### As janelas (C8)

- Toda janela tem os três botões (fechar, minimizar, ampliar), a barra de título, cantos de 12px, a
  sombra do macOS (grande e difusa) e o vidro na barra lateral. **Arrastar** pela barra de título,
  **redimensionar** pelas bordas e cantos (mínimo 480×320), **ampliar** ocupa a área toda menos a
  barra e o Dock (0,25s), **minimizar** é o gênio para o ícone do Dock (0,45s, a janela se estica em
  curva para dentro do ícone, como o 14), e clicar no ícone traz de volta pelo caminho inverso.
  **Fechar** encolhe a 0,92 e esmaece em 0,16s. Abrir cresce de 0,6 a 1 com `opacity` em 0,22s a
  partir do ícone do Dock. Janelas em pilha: a clicada vem para a frente; a da frente tem os botões
  coloridos, as outras os têm cinza. Se travar (CPU 4× abaixo de 50fps no arrasto), tiram-se o vidro
  e a sombra grande primeiro, nunca o arrasto.

### Os quatro apps (C4 a C7)

- **Finder** (C6): colunas, como o 14 (`14-pc2-dentro.png`): barra lateral com Livros e Séries,
  coluna da pasta com os posts como `.pdf` (ícone de PDF próprio), e a coluna de pré-visualização com
  a **ilustração do post e o livro** (3D pequeno, com a mola) e os dados; a barra de caminho embaixo.
  Duplo clique ou Enter abre o PDF na Pré-Visualização.
- **Pré-Visualização** (C7): barra lateral com as **miniaturas das páginas** à esquerda (o 14:
  "igual no Mac mesmo"), a página grande à direita, o zoom, e as setas. O PDF é o do blog (o `.pdf.ts`
  de hoje) renderizado como páginas brancas com sombra; a primeira página traz a ilustração do post.
- **Terminal** (C5): o do 15 (`15-terminal-help.png`), que ele chamou de "excelente", com `help`,
  `ls`, `tree`, `cd`, `cat`, `open`, `clear`, `exit`, Tab e histórico, dentro de uma janela normal do
  macOS (fundo escuro, texto claro, o prompt `cs@blog:~$`). Como o modo "de cima para baixo" não
  existe no Mac de fábrica, ele fica como uma preferência do app ("Janela suspensa"), e o atalho `` ` ``
  fora do computador continua abrindo esse terminal suspenso por cima do blog, como no 15, porque ele
  gostou de abrir assim.
- **Código** (C4): parecido com o VS Code e simples (o 11, "o mais parecido com o VS Code possível,
  mas simples"): barra de atividades à esquerda, o explorador com a árvore Livros → posts `.md`, abas
  em cima que abrem e fecham (com o ponto de não salvo nunca; são só leitura), o editor com números de
  linha e o Markdown do post em cores do tema do VS Code (MIT), e a barra de status azul. `⌘P` abre o
  "ir para arquivo" com busca. O hover num arquivo da árvore mostra a ilustração do post num balão.

### O que o computador não faz nesta rodada

Nada de som, de notificações, de apps além dos quatro, de janelas que saem da tela, de persistência
entre visitas. O conteúdo de cada app pode ser raso; o que tem que estar certo é a sensação de macOS
e as animações de entrar, abrir, minimizar, fechar e sair.

---

## 4. Critérios de aceite (por protótipo)

Cada item é verificável com uma captura ou com um comportamento disparado; o conferente registra sim
ou não, nos dois temas, em 390, 768, 1280 e 1440px, com e sem movimento reduzido, CPU 4× nas animações
longas.

Comum aos cinco:

1. Navegação interna entre páginas de lista tem a cortina (azul com texto claro no claro; claro com
   texto azul no escuro) **e** a montagem das folhas ou dos cards depois dela, em até 1,5s. Chegar de
   fora não tem cortina, tem a abertura.
2. Em todo livro 3D, o hover gira com mola (passa do alvo e volta), o livro acompanha o mouse, o brilho
   corre na capa e na lateral conforme o lado do mouse, e a sombra quente é visível nos dois temas.
3. O fundo âmbar segue o mouse **no claro e no escuro**.
4. O lustre balança no hover, a cordinha puxa no clique, e a lâmpada acende e apaga com inércia (a
   brasa sobra ao apagar); a troca de tema acompanha a luz.
5. Em Livros, cada card tem o ponto de luz e o cone, que ficam mais fortes no hover; o card pinta com a
   cor do livro.
6. O rodapé é a ficha de empréstimo com o nome gigante atrás, cortado com 58% das maiúsculas à vista,
   respirando de peso sem afinar; sem copyright, sem "Leitor: você"; em 390px as colunas descem e o
   nome continua atrás.
7. A página do livro tem a fileira de todos os livros em cima, centrada, sem barra, com a troca que
   sobe e desce, encolhendo ao rolar; o painel tem o livro grande com as tags em volta; a tag leva à
   tag filtrada pelo livro; "N artigos" roda para cima; com 2 posts, não há vazio à direita.
8. O post tem 948px de coluna a 1440 e a primeira linha de criptografia termina em "réplica"; sem
   "Neste artigo" no card do topo; post-it e "Do livro" fixos, alinhados ao topo da folha do corpo;
   cantoneiras que se mexem; anterior e próximo com imagem e sem orelha; o texto, a caneta e as lousas
   idênticos aos do blog.
9. Tags tem a nuvem com ícones em cima e as fichas embaixo caindo de cima; o ícone se mexe no hover do
   card inteiro; a página da tag filtra por livro.
10. Cards e lista são fichas com "Vol. · ficha · nº", sem clipe; o destaque tem a imagem ao lado; a lista
    é de fichas separadas com a imagem à esquerda; quatro cards por linha a 1440.
11. Listas e cards abaixo da dobra aparecem ao rolar, uma vez, em até 0,5s; nada acima da dobra espera.
12. A busca desce do cabeçalho na largura do conteúdo, com a pauta, os resultados como linhas com a
    caneta e a pintura no hover, e a ficha do resultado com a ilustração e o livro à direita.
13. O menu gira no hover; os números da home rodam ao entrar.
14. O computador: o ícone espia ao rolar; entrar e sair com o zoom; barra de menus que muda com o app;
    Dock com aumento e pulo; quatro apps que abrem, arrastam, redimensionam, minimizam com gênio e
    fecham; Finder em colunas com imagem e livro; Pré-Visualização com miniaturas; Terminal com
    `help`; Código com abas; "Sair do computador" no menu "cs" e ⌘⇧Q.
15. Nada do que está em "O que não entra" aparece. Sem rolagem lateral em 320 e 390px. Sem erro no
    console. Com movimento reduzido, tudo no estado final e nada se mexe sozinho.
16. Em CPU 4×, a cortina, o brilho e a lâmpada mantêm 60fps (medir como em `luz-realista.md`).

Por linha:

- **16.** Parede visível em toda página; cortiça na home e em Tags; cada ficha com alfinete da cor do
  livro, pregada ao entrar na tela, endireitando no hover; o quadro com o nome e a estante com tábua;
  a mesa do rodapé com a ficha deitada e o nome pintado na parede atrás.
- **17.** A fileira da home sem aparador, sem linha e sem prateleira: só livros e sombras quentes; a
  paleta é a de hoje; a onda de luz passa pela fileira ao carregar.
- **18.** A prateleira moderna com espessura e sombra na parede, as luzes de quadro acendendo uma a
  uma antes da onda, os livros girando para lombada e a prateleira encolhendo junto em 768px; a mesma
  prateleira no topo da página do livro; a onda dos livros do 15 uma vez.
- **19.** A estante de madeira com a gaveta na home; o balcão com as fichas inclinadas; as gavetas por
  letra em Tags, com "Todas" abrindo em cascata e as letras dividindo a linha; a cota nas fichas; a
  busca saindo da gaveta; a cordinha do voltar ao topo; nenhum amarelo saturado sobre o marrom.
- **20.** O palco com um ponto de luz por livro na home; a abertura do 02 ao chegar de fora; a
  cartolina da cor do livro atrás da ilustração do post e do livro grande; a sala que escurece de
  verdade na troca de tema.

---

## 5. Evidências desta sessão e o que não verifiquei

Verifiquei em captura, nesta sessão, tudo o que está citado por nome de arquivo acima; e, no código,
o giro com mola do 04 (`.artigo-livro:hover .ilha-livro` com `--mola`), o hover da home do 08
(`--livro-giro: 12deg` e `translateY(-12px)`, 0,45s), a onda do 15 (`estante-viva.ts`, 0,35s +
75ms por livro) e a largura do texto do post nos cinco protótipos (medição por script: 11, 14 e 15
com 948px e "réplica" no fim da primeira linha; 12 com 946 e "de"; 13 com 786 e "linha").

Não verifiquei, e o construtor deve conferir ao fazer:

- a duração exata da cortina do 14 (vi os quadros a 200, 500 e 1100ms; os tempos que escrevi são a
  direção, não a medição);
- o comportamento do 14 ao clicar num livro da home (vi o ícone de ampliar no hover,
  `14-home-hover-livro-a.png`; a gaveta desta direção é nova);
- a animação de entrar no computador do 14 e do 12 quadro a quadro (vi um quadro do zoom do 12 e o
  Finder aberto do 14), e o gênio de minimizar do 14;
- o fundo âmbar do 11 no tema claro em movimento (vi só que, parado, não aparece);
- a luz da abertura do 13 (a captura mostrou a sala escura sem o detalhe); fica de fora por pedido
  dele, então não pesa;
- o desempenho de qualquer peça nova (os números de `luz-realista.md` valem para as demos, não para
  a página cheia).
