# Revisão final da rodada 3 (diretor, Fable 5.1, 01/10/2026)

Fonte: `retorno-cesar.md` desta rodada e da rodada 2, `controle.md` e a seção 4 de `direcao.md`. Toda
afirmação abaixo vem de captura ou medição desta sessão, em `.astro/depuracao/redesenho/r3/revisao/`
(`estatico/`: as páginas a 1440 e 390 nos dois temas; `dinamico/`: rolagem, hovers, cortina, abertura,
tema, gaveta, busca e computador; `folhas/`: as folhas de contato que cito). O que não vi está na seção 6.

## 1. Veredito

As cinco linhas estão inteiras e entregam o que ele marcou com ênfase: a cortina com o nome na
navegação interna e a abertura ao chegar de fora, o azul com texto claro e o claro com texto azul, a
página do livro do 14 com os livros em cima e a troca que sobe e desce, o post largo com "réplica" no
fim da primeira linha, o lustre que balança e apaga com brasa, o brilho e o livro que segue o mouse, a
ficha de empréstimo com o nome gigante atrás, a busca de papelaria e o computador com macOS. Os dois
formatos obrigatórios estão lá (a parede no 16; a home do 14 no 17 e no 18, e também no 20).

Há três erros comuns que mudam o que ele vai sentir e precisam sair antes da entrega: a mancha âmbar do
mouse é invisível no tema claro (ele reclamou disso no 11); o ícone do computador passa a maior parte
do tempo fora da tela a 1280 e 1440 (ele pediu o ícone inteiro que afunda um pouco); e no 17, 18 e 20
o nome gigante do rodapé está mais coberto do que ele pediu ("um pouco mais para cima, para ler
melhor"). Depois disso, a montagem dos cards de Livros e Tags, que demora de 3,5 a 4s depois do clique,
e um aviso de console na gaveta da home.

## 2. Os formatos obrigatórios

| Formato | Linha | Evidência | Está bom? |
|---|---|---|---|
| Home de parede: estante, quadro com nome e texto, cortiça com fichas presas por alfinetes de cabeça redonda e colorida | 16 | `estatico/16-home-1440-claro-v.png`, `folhas/16-rola.png`, `folhas/16-zoom-cards.png` (as cabeças dos alfinetes têm a cor do livro da ficha), `folhas/768.png` e `folhas/16-390-recortes.png` | Sim. A mesa de madeira no rodapé com a ficha deitada e o nome pintado na parede atrás resolve "onde entra o rodapé" (`folhas/zoom-rodape.png`, 16 a 1440 e a 390). |
| Home do 14, diferente na prateleira (dois) | 17 (sem prateleira, só sombras) e 18 (prateleira moderna com luzes de latão) | `estatico/17-home-1440-claro-v.png`, `estatico/18-home-1440-claro-v.png`, `folhas/18-filmes.png` (as luzes acendem uma a uma na abertura) | Sim. O 20 é a terceira variação (palco com um ponto de luz por livro, `estatico/20-home-1440-escuro-v.png`). O cinza do aparador e a linha de baixo sumiram nas três. |

## 3. Os pedidos, por linha

Legenda: ✓ atendido; ✗ falta ou errado; ~ parcial; ? não verifiquei. Onde não há diferença entre as linhas, a célula vale para as cinco.

| Pedido | 16 | 17 | 18 | 19 | 20 | Evidência e observação |
|---|---|---|---|---|---|---|
| T1 nome pela metade, mais para cima, respirando | ✓ | ~ | ~ | ✓ | ~ | `folhas/zoom-rodape.png`. No 16 e no 19 o nome fica na parede acima da mesa, com mais da metade à vista. No 17, 18 e 20 a ficha cobre o topo das letras e a janela corta o pé: sobra uma faixa fina (correção comum 3). A respiração existe: o peso medido variou entre 711 e 787 (`dinamico/medidas.txt`), nunca abaixo de 650. |
| T2 cortina com o nome, azul/claro e claro/azul, montagem depois | ✓ | ✓ | ✓ | ✓ | ✓ | `folhas/16-cortina.png`, `17-filmes`, `18-filmes`, `19-filmes`, `20-filmes`. Ao chegar de fora não há cortina: é a abertura. A montagem dos cards assenta tarde (correção comum 4). |
| T3 número que gira para cima | ✓ | ✓ | ✓ | ✓ | ✓ | Os 28 / 9 / 20 da home rodam na abertura (`folhas/16-abertura.png`, t3000 a t4200). O "N artigos" da página do livro não filmei (seção 6). |
| T4 brilho na capa e na lateral, onda na estante | ~ | ~ | ~ | ~ | ~ | A mancha de verniz corre pela capa conforme o lado do mouse (`folhas/16-zoom-hover.png`, `17-zoom`, `18-zoom`, `19-zoom`, `20-zoom`, pares esq/dir). Não distingui a lombada acendendo nem a onda de cima para baixo na fileira (seção 6). |
| T5 fundo que acompanha o mouse nos dois temas | ✗ claro | ✗ claro | ✗ claro | ✗ claro | ✗ claro | `folhas/ambar.png`. Medido por diferença de pixels entre mouse perto e longe (região 500×300 ao lado do título de Livros): escuro, máximo 22 a 34 níveis (visível); claro, máximo 10 a 13 (invisível a olho nu). Correção comum 1. |
| T6 sombra quente, também a de baixo | ✓ | ✓ | ✓ | ✓ | ✓ | `folhas/17-paginas-claro.png` (Livros claro: sombra amarelada sob cada livro), `folhas/ambar.png` (escuro: halo quente). |
| T7 lustre: balanço, cordinha, acender e apagar realistas | ✓ | ✓ | ✓ | ✓ | ✓ | Balanço medido: a corda gira 11,6° a 100ms, 6,9° a 250ms, −6,4° a 450ms, −1,5° a 700ms (sonda nesta sessão). A sala escurece antes de o tema virar e clareia ao acender (`folhas/16-tema.png`, `folhas/20-tema.png`); no 20 a brasa sobra (`folhas/20-zoom.png`, apaga-t1500). |
| T8 luz em cima dos livros em Livros, mais forte no hover | ✓ | ✓ | ✓ | ✓ | ✓ | `folhas/16-hover.png` (repouso × t650), `folhas/ambar.png`. |
| T9 livro acompanha o mouse | ✓ | ✓ | ✓ | ✓ | ✓ | Os pares esq/dir das folhas de zoom: o livro vira para o lado do mouse. |
| T10 anterior e próximo com imagem, sem orelha | ✓ | ✓ | ✓ | ✓ | ✓ | `folhas/16-hover-post.png` (vizinho), `17-hover`, `18-hover`, `19-hover`, `20-hover`. "Este é o mais novo…" no lugar do próximo. |
| T11/T14 giro com mola, "cartolina" | ? | ? | ? | ? | ✓ cartolina | O hover gira o livro (`folhas/17-hover.png`); a passada e volta da mola eu não filmei quadro a quadro. A cartolina do 20 está atrás da ilustração do post e atrás do livro grande (`folhas/20-paginas.png`, `folhas/20-hover.png` troca-t0500: a cartolina aparece quando o livro sai). |
| T12 menu que gira | ✓ | ✓ | ✓ | ✓ | ✓ | `folhas/16-zoom-hover.png`, `folhas/17-zoom.png` (menu-t120: as letras rolando). |
| T13 listas e cards aparecem ao rolar | ? | ✓ | ✓ | ✓ | ✓ | Sonda nesta sessão: no 17, 11 fichas abaixo da dobra esperando e revelando ao rolar; no 19, as opacidades sobem ao rolar. No 16 as fichas já estão a 1 antes de rolar (o mecanismo de pregar age em outro elemento; não comprovei, seção 6). Os 18 e 20 herdam o 17. |
| P1 pintar com o mouse | ✓ | ✓ | ✓ | ✓ | ✓ | Os cards de Livros e a ficha "Do livro" tomam a cor (`folhas/19-zoom.png`, `folhas/20-zoom.png`). |
| P2 livro grande | ✓ | ✓ | ✓ | ✓ | ✓ | Página do livro, nas cinco. |
| P3 abertura do 02 | – | – | – | – | ✓ | `folhas/20-filmes.png`: sala escura, lustre acende, livros revelados um a um, nome depois, nos dois temas e a 390. |
| P5 o 09 com chave de ouro | – | – | – | ✓ | – | `estatico/19-home-1440-claro-v.png`, `folhas/19-pecas.png`. |
| P6 embaralhar só em detalhe | ✓ | ✓ | ? | ✓ | ✓ | Nenhum texto grande embaralha. Não vi a tira das fichas do 18 embaralhar (seção 6). |
| P7 gaveta na home | ✓ | ✓ (aviso) | ✓ (aviso) | ✓ | ✓ (aviso) | `folhas/16-gaveta.png`, `folhas/gaveta-ia.png` (livro vazio: "Este livro ainda não tem artigos"). Aviso de console no 17, 18 e 20 (correção comum 5). |
| F11-1 rodapé sem copyright, nome atrás, 390 | ✓ | ✓ | ✓ | ✓ | ✓ | `folhas/zoom-rodape.png`, `folhas/768.png` (390). Sem "Leitor: você"; ficou "Emprestado a: você", que é o texto do 12 (conferi no código do 12). |
| F11-2 tags como fichas, ícone se mexe no hover | ✓ | ✓ | ✓ | ✓ | ✓ | `folhas/16-zoom-cards.png` (tags-hover-ficha), `folhas/17-rola.png`. |
| F11-3 livro com 2 posts sem vazio | ✓ | ✓ | ✓ | ✓ | ✓ | `folhas/16-rola.png` (seg-y900: cards centrados e "Deste livro também"). |
| F12-1 fichas com volume e número, destaque com imagem ao lado | ✓ | ✓ | ✓ | ✓ (cota) | ✓ | `folhas/16-zoom-cards.png`, `folhas/19-390-recortes.png` ("QA76.9.A25 · nº 028"). A lista como fichas separadas eu não abri (seção 6). |
| F12-2 ficha de empréstimo | ✓ | ✓ | ✓ | ✓ | ✓ | Com o carimbo "Biblioteca C.S. · 1 out 2026". |
| F12-3 outros livros em cima | ✓ | ✓ | ✓ | ✓ | ✓ | Página do livro, nas cinco. |
| F12-4 marrom sem amarelo forte | – | – | – | ✓ | – | `estatico/19-home-1440-escuro-v.png`: madeira e luz âmbar fraca. |
| F12-5 home de parede | ✓ | – | – | – | – | Seção 2. |
| F12-6, F13-4 post largo com a lateral abaixo da imagem | ✓ | ✓ | ✓ | ✓ | ✓ | 948px de coluna a 1440 (`dinamico/medidas.txt`); a primeira linha termina em "réplica" (`folhas/19-rodapes.png`, post @900). Post-it e "Do livro" fixos à esquerda, alinhados ao topo da folha do corpo. |
| F12-7 cantoneiras que se mexem | ✓ | ✓ | ✓ | ✓ | ✓ | `folhas/16-zoom-canto.png` (parado × hover: afastam e giram). |
| F12-8 entrada das fichas de Tags caindo; letras dividindo a linha | ? | ? | ? | ✓ | ? | A queda eu não filmei (seção 6). No 19, "Todas" mostra B na linha do A, com o separador de letra (`folhas/19-pecas.png`, todas-rolado). |
| F12-9 busca de papelaria | ✓ | ✓ | ✓ | ✓ | ✓ | `folhas/busca.png`: desce do cabeçalho na largura do conteúdo, pauta, caneta e pintura no hover, ficha à direita com ilustração e livro; a 390 ocupa a tela. No 19 sai de uma frente de gaveta (`folhas/19-pecas.png`). |
| F13-1 sem a abertura com luz do 13 | ✓ | ✓ | ✓ | ✓ | ✓ (a do 02) | Aberturas filmadas nas cinco. |
| F13-2 destaque com imagem ao lado | ✓ | ✓ | ✓ | ✓ | ✓ | `folhas/16-rola.png`, `17-rola`. |
| F13-3 nuvem em cima, fichas embaixo | ✓ | ✓ | ✓ | ✓ | ✓ | `folhas/16-paginas-claro.png`, `folhas/20-paginas.png`. |
| F14-1 home do 14 sem o cinza | – | ✓ | ✓ | – | ✓ | Seção 2. |
| F14-2 ficha e nome juntos | ✓ | ✓ | ✓ | ✓ | ✓ | Ver T1. |
| F14-3 abertura ao carregar, cortina interna | ✓ | ✓ | ✓ | ✓ | ✓ | Ver T2. |
| F14-4 Livros: cor e cards montando; Tags igual | ✓ | ✓ | ✓ | ✓ | ✓ | `folhas/zoom-montagem.png`. Em Tags não filmei a queda (seção 6). |
| F14-5 pintar em todos os livros | ✓ | ✓ | ✓ | ✓ | ✓ | Ver P1. |
| F14-6 página do livro: fileira em cima, sobe e desce, encolhe ao rolar, sem barra | ✓ | ✓ | ✓ | ✓ | ✓ | `folhas/16-hover-post.png` (troca t200/t500/t900 e rolado), `17-hover`, `18-hover`, `19-hover`, `20-hover`. O chão é a tábua (16), nada (17), a prateleira (18), a madeira (19) e o palco (20). |
| F14-7 menu animado | ✓ | ✓ | ✓ | ✓ | ✓ | Ver T12. |
| F14-8 sem "Neste artigo" no card do topo | ✓ | ✓ | ✓ | ✓ | ✓ | `estatico/*-post-1440-claro-v.png`. |
| F15-1 onda dos livros | – | – | ? | – | – | Não filmei (seção 6). |
| F15-2 embaralhar só pequeno | ✓ | ✓ | ✓ | ✓ | ✓ | Ver P6. |
| F15-3 tags em volta do livro, anterior e próximo, todos os livros | ✓ | ✓ | ✓ | ✓ | ✓ | Página do livro: pílulas com ícone e contagem, "+3", links "← Vol. 04 IA" e "Vol. 06 DevOps →". |
| C1 macOS | ✓ | ✓ | ✓ | ✓ | ✓ | `folhas/pc2-zoom.png`: mesa, barra de menus com o app em foco, Dock de vidro, janelas com os três botões. É o mesmo computador nas cinco. |
| C2 ícone inteiro que afunda ao rolar | ✗ | ✗ | ✗ | ✗ | ✗ | `folhas/pc-icone.png`, `computador/icone/medicao.txt`. A 1280 em Artigos ele fica escondido em 12 de 13 paradas; a 1440 na home, inteiro em 1 de 6; só a 1600 fica inteiro. Correção comum 2. |
| C3 IDE, Terminal, pasta e PDF | ✓ | ✓ | ✓ | ✓ | ✓ | `folhas/pc2-zoom.png`: Finder, Código, Terminal e Pré-Visualização no Dock; pasta Blog e Leia-me na mesa. |
| C4 Código como VS Code | ✓ | ✓ | ✓ | ✓ | ✓ | Explorador com a árvore Livros → posts, barra de atividades, editor com atalhos. Abas abrindo e fechando eu não cliquei (seção 6). |
| C5 Terminal com help, ls, tree; suspenso de cima | ✓ | ✓ | ✓ | ✓ | ✓ | `folhas/pc2-zoom.png` (help, tree), `pc2-crase-suspenso` (a crase desce o Terminal por cima do blog). |
| C6 Finder em colunas com imagem e livro | ✓ | ✓ | ✓ | ✓ | ✓ | `folhas/pc-construtor.png` (arrastar-meio: a coluna de pré-visualização com a ilustração e os dados do PDF). |
| C7 Pré-Visualização com miniaturas | ✓ | ✓ | ✓ | ✓ | ✓ | `folhas/pc-construtor.png` (v2-previa). |
| C8 janelas movem, redimensionam, minimizam com gênio, fecham | ✓ | ✓ | ✓ | ✓ | ✓ | `folhas/pc-construtor.png` (genio-filme, arrastar-meio, redimensionar-meio, ampliar-fim), capturas do construtor que vi nesta sessão. |
| C9 abrir e fechar apps; sair por outro jeito | ✓ | ✓ | ✓ | ✓ | ✓ | `folhas/pc2-zoom.png` (menu "cs" com "Sair do computador ⌃⌥Q"); o atalho recua a câmera e devolve a página (`folhas/pc2.png`, sair t200 a t1500). |

## 4. Os critérios de aceite (seção 4 da direção)

Comuns (sim nas cinco, salvo indicação):

| # | Critério | Resultado |
|---|---|---|
| 1 | Cortina interna com a montagem em até 1,5s; abertura ao chegar de fora | Sim para a cortina (sai pelo alto em ~1s); não para a montagem dos cards de Livros, que assenta a 3,5–4s (`folhas/zoom-montagem.png`: a 2s e a 3s ainda em voo nas cinco). As folhas das outras páginas chegam em ~1,5s. |
| 2 | Hover com mola, livro segue o mouse, brilho conforme o lado, sombra quente nos dois temas | Sim para seguir o mouse, brilho na capa e sombra; a mola e a lombada eu não isolei. |
| 3 | Fundo âmbar no claro e no escuro | Não: só no escuro. |
| 4 | Lustre balança, cordinha puxa, lâmpada com inércia e brasa, a troca acompanha a luz | Sim. O puxão no clique eu não isolei em quadro, mas a troca começa depois do clique e a sala escurece antes do tema. |
| 5 | Livros: ponto, cone, mais forte no hover, card pinta | Sim. |
| 6 | Rodapé: ficha, nome com 58% à vista, respirando, sem copyright, 390 | Sim no 16 e no 19; não no 17, 18 e 20 (menos da metade das maiúsculas à vista, `folhas/zoom-rodape.png`). |
| 7 | Página do livro | Sim. O giro do "N artigos" não filmei. |
| 8 | Post: 948px, "réplica", sem "Neste artigo" no topo, post-it e "Do livro" fixos, cantoneiras, vizinhos com imagem | Sim. |
| 9 | Tags: nuvem com ícones, fichas caindo, ícone no hover, filtro por livro | Sim para a nuvem, o hover e o filtro (`estatico/*-tagfiltro-*`: "Só Desenvolvimento de Software · Limpar filtro", 4 artigos); a queda não filmei. |
| 10 | Fichas com "Vol. · ficha · nº", destaque com imagem ao lado, lista como fichas, quatro por linha | Sim para cards e destaque (quatro por linha a 1440 em todas); a lista não abri. |
| 11 | Revelação ao rolar | Sim no 17, 18, 19 e 20; no 16 não comprovei. |
| 12 | Busca | Sim. |
| 13 | Menu gira; números rodam | Sim. |
| 14 | Computador | Sim em tudo, menos "o ícone espia ao rolar": ele some (critério não atendido). |
| 15 | Nada do proibido; sem rolagem lateral; sem erro no console; movimento reduzido no estado final | Sem rolagem lateral em nenhuma das 329 cenas a 390 e 1440 (`registro.txt`). Console: um aviso do GSAP na gaveta da home do 17, 18 e 20 (correção comum 5). Movimento reduzido: página inteira e parada a 300ms nas cinco (`*-reduzido-home-t300.png`). |
| 16 | 60fps com CPU 4× na cortina, no brilho e na lâmpada | Não medi a página cheia. Nas demos do construtor (`luz/custo.json`) a lâmpada e o verniz ficam em 16,7ms de mediana a 4×. |

Por linha:

| Linha | Critério | Resultado |
|---|---|---|
| 16 | parede em toda página; cortiça na home e em Tags; alfinete da cor do livro; endireita no hover; quadro e tábua; mesa com a ficha deitada e o nome atrás | Sim, exceto "pregada ao entrar na tela" e "endireita no hover", que não comprovei. A parede aparece em Livros, no post e na busca (`folhas/16-paginas-claro.png`, `folhas/16-busca.png`). |
| 17 | sem aparador, linha ou prateleira; paleta de hoje; onda de luz ao carregar | Sim para a fileira limpa e a paleta; a onda não isolei. |
| 18 | prateleira com espessura e sombra; luzes acendem uma a uma antes da onda; lombadas a 768 com a prateleira encolhendo; a mesma prateleira no topo do livro; onda do 15 | Sim para a prateleira, as luzes acendendo em sequência (`folhas/18-filmes.png`, t1100 a t1800), as lombadas a 768 e a 390 (`folhas/768.png`) e o topo do livro (`folhas/18-hover.png`); a onda do 15 não isolei. |
| 19 | estante com gaveta; balcão com fichas inclinadas; gavetas por letra com "Todas" em cascata e letras dividindo a linha; cota; busca da gaveta; cordinha; sem amarelo saturado | Sim, exceto "fichas inclinadas num porta-fichas": as fichas estão planas sobre o balcão (`folhas/19-rola.png`); e o balanço da cordinha no hover não comprovei (o puxão sobe a página: `folhas/19-pecas.png`). |
| 20 | palco com um ponto por livro; abertura do 02; cartolina atrás da ilustração e do livro grande; sala que escurece | Sim. |

## 5. As decisões dos construtores (manter ou mudar)

| Decisão | Veredito | Motivo, do ponto de vista dele |
|---|---|---|
| O ícone do computador se esconde quando a margem é estreita (390, 768, boa parte de 1280 e 1440) e volta pelo canto quente, pelo Tab e pelo menu do celular | **Mudar** | Ele descreveu o que quer com precisão (C2): "ele aparece inteiro e quando rolo ele vai para baixo e some um pouco". A regra de nunca cobrir conteúdo foi do construtor, e o resultado é um ícone que ninguém com um laptop de 1280 ou 1440 vê (`computador/icone/medicao.txt`: 354 paradas escondidas em 604). Em telas de 768 para cima o ícone nunca sai da tela: fica inteiro parado e afunda 60% ao rolar, por cima do que estiver no canto, com a folga de papel que ele já tem; no celular continua no menu. Uma lasca de card sob um ícone de 64px no canto é um custo menor do que o computador não existir. |
| O nome gigante do rodapé ajustado à largura do conteúdo (191px a 1440), em duas linhas no celular | **Manter o tamanho e mudar a altura** | O tamanho cabe e as duas linhas a 390 leem bem (`folhas/768.png`, `folhas/zoom-rodape.png`). O que falta é o pedido dele de ler melhor: no 17, 18 e 20 a ficha cobre o topo das letras e a janela corta o pé (correção comum 3). No 16 e no 19 está certo. |
| ⌃⌥Q em vez de ⌘⇧Q | **Manter** | ⌘⇧Q encerra a sessão do Mac: um site que capturasse isso seria pior do que não ter atalho. O atalho aparece no menu "cs" ao lado de "Sair do computador" (`folhas/pc2-zoom.png`), que é o caminho que ele vai usar. |
| Terminal no perfil Básico do Mac (claro) em vez do fundo escuro com `cs@blog:~$` | **Manter** | Ele pediu "o Terminal do Mac mesmo" e "o mais parecido possível com o Mac"; o Básico é o padrão de fábrica e segue a aparência: no escuro ele vem cinza-escuro com texto claro (`folhas/pc2-zoom.png`, escuro-terminal-ls). O `help`, o `ls` e o `tree` do 15 estão lá, que era o que ele elogiou. |
| No 20, no escuro, a lâmpada fica na brasa | **Manter** | É a lâmpada incandescente que ele pediu: a brasa é o que sobra ao apagar, e é o que deixa o lustre achável no escuro (`folhas/20-zoom.png`, apaga-t1500). Está discreta. |
| No 18, o cone em repouso no claro a 0,2 | **Manter** | A 0,12 o cone não apareceria sobre o papel; a 0,2 ele aparece sem pesar (`estatico/18-home-1440-claro-v.png`). |
| No 19, o escuro mais fundo e as fichas de Tags de A a Z | **Manter** | O escuro continua marrom e "não tão escuro" (`estatico/19-home-1440-escuro-v.png`), e a madeira precisa do contraste. O fichário de A a Z com as gavetas vazias apagadas é o que um fichário real tem (`folhas/19-pecas.png`). |
| A montagem dos cards em Livros assenta em 3,5 a 4s depois da cortina (é a do 14) | **Mudar** | Ele gostou da montagem, mas a cortina foi pedida como "lead" para "a animação dos cards não travar", com a ressalva "se fica muito pesado eu removo depois". Quatro segundos a cada ida a Livros ou Tags é pesado. A coreografia fica; o tempo cai: tudo assentado em até 2,5s depois do clique (correção comum 4). |
| No post, abaixo de 1300px a lateral sai e o texto ocupa a folha (1120px a 1280) | **Manter nesta rodada** | É o comportamento do blog de hoje e do 14, que ele aprovou; a 1280 o "Neste artigo" vira um bloco recolhido no topo (`folhas/1280-series.png`). Ele valoriza a lateral "sempre à vista", mas trocar isso agora abriria um layout novo numa largura que ele não reviu. Fica registrado para depois da escolha. |
| Quadros de 200 a 300ms com CPU 4× na carga e ~100ms no fim da troca de tema | **Manter** | A 4× isso corresponde a 50 a 75ms reais, na mesma régua do blog de hoje (~210ms a 4×), e acontece uma vez por carga. Não é o que ele vai sentir. Não medi eu mesmo (seção 6). |

## 6. Correções

### Comuns (base, nas cinco linhas)

1. **Errado. A mancha âmbar do mouse não aparece no tema claro.** Em toda página, 1440, claro.
   O que se vê: com o mouse parado ao lado do título de Livros e depois no canto oposto, as duas
   capturas são iguais a olho nu (`folhas/ambar.png`; diferença máxima de 10 a 13 níveis em 255 nas
   cinco linhas, contra 22 a 34 no escuro). É exatamente o que ele reprovou no 11 ("no claro não
   aparece, podia melhorar"). O que deveria se ver: um calor visível no papel em volta do ponteiro,
   como o do 02 no claro, da mesma ordem de presença que o escuro tem hoje (diferença máxima de
   uns 30 a 40 níveis na região da mancha), sem sujar o texto. No 20 um pouco mais, como a direção
   pede.
2. **Errado. O ícone do computador some em vez de afundar.** Toda página, 1280 e 1440, dois temas.
   O que se vê: a 1280 em Artigos o ícone está fora da tela em 12 das 13 paradas de rolagem e só
   aparece quando o mouse encosta no canto (`folhas/pc-icone.png`, `folhas/pc-icone-zoom.png`); a
   1440 na home, inteiro em 1 de 6 paradas; a 390, nunca. O que deveria se ver (C2): em 768px para
   cima, o ícone inteiro no canto inferior esquerdo com a página parada; ao rolar para baixo ele
   afunda 60% na borda e fica espiando; ao rolar para cima, parar ou aproximar o mouse, volta inteiro.
   Ele nunca sai da tela nessas larguras, mesmo que cubra uma lasca do conteúdo. No celular continua
   escondido, com o item "Computador" no menu (`folhas/pc2.png`, 390-menu).
3. **Errado. O nome gigante do rodapé está coberto demais no 17, 18 e 20.** Rodapé de toda página,
   1440 e 1280, dois temas. O que se vê: a ficha cobre o alto das letras e a janela corta o pé;
   sobra uma faixa em que "Cesar Schutz" se adivinha mais do que se lê (`folhas/zoom-rodape.png`,
   17/18/20 × 16/19). O que deveria se ver: o nome subindo até que 58% da altura das maiúsculas fique
   à vista abaixo da ficha, com a ficha cobrindo no máximo o topo das letras, como no 16 e no 19,
   onde a leitura é confortável. A 390 fica como está (duas linhas, "Schutz" cortado).
4. **Acabamento. A montagem dos cards em Livros e em Tags demora demais.** Navegação interna para
   Livros (e Tags), 1440, dois temas; e a chegada de fora em Livros. O que se vê: a cortina sai a ~1s,
   mas os cards ainda estão voando a 2s e a 3s e só assentam entre 3,5 e 4s (`folhas/zoom-montagem.png`,
   as cinco linhas; `folhas/16-cortina.png`, t3000 × t4000). Chegando de fora no 16, a 4s os cards
   ainda estavam empilhados (`dinamico/16-hover-livros-repouso.png`). O que deveria se ver: a mesma
   coreografia (chegam do canto, girados, e se arrumam), com tudo assentado até 2,5s depois do clique
   e até 3,5s depois da chegada de fora; o que está abaixo da dobra pode esperar a rolagem (T13) em
   vez de entrar na fila.
5. **Errado. Aviso de console na gaveta da home.** Home do 17, 18 e 20, ao clicar num livro da fileira,
   dois temas. O que se vê: `[warning] Invalid property giro set to 54.03… Missing plugin?
   gsap.registerPlugin()` (`dinamico/registro.txt`, cenas `17-gaveta`, `18-gaveta`, `20-gaveta-ia`,
   `17-gaveta-ia2`, `18-gaveta-ia2`); a gaveta abre, mas algum tween recebe `giro` como propriedade
   em vez do ângulo. O que deveria se ver: console limpo (critério 15) e o giro do livro que vai para
   a gaveta de fato animado.
6. **Acabamento, a conferir contra o blog de hoje. A anotação da direita da ilustração do post sai
   cortada.** Topo do post de criptografia, 1440, dois temas, nas cinco. O que se vê: "o menos com /
   cifrado até…" cortado pela borda direita da ilustração (`estatico/20-post-1440-escuro-v.png`,
   `folhas/zoom-post-topo.png`). É o recorte largo da própria ilustração (`data-largo`), não o
   protótipo; o texto dos posts e os desenhos não se mexem (O1). Só conferir se o blog de hoje corta
   igual: se cortar, não é desta rodada; se não cortar, o recorte largo está sendo aplicado diferente.

### Por linha

**16 Parede**

- Acabamento. Não comprovei a pregagem ao entrar na tela nem o endireitar no hover das fichas da
  cortiça: as fichas já estão com opacidade 1 antes de rolar (sonda desta sessão). Se o alfinete e a
  ficha não estiverem de fato esperando a rolagem, é T13 faltando aqui; o construtor confere e, se
  faltar, faz a pregagem (o alfinete chega de escala 1,6 e a ficha aparece embaixo dele).

**17 Grade suave**

- Nada além das comuns. É a linha mais limpa e a mais perto do que ele chamou de perfeita
  (`estatico/17-home-1440-claro-v.png`).

**18 Estante moderna**

- Acabamento. A 390 há uma luz de quadro por lombada, nove luzes sobre nove lombadas estreitas
  (`folhas/18-filmes.png`, 390-t3200). Cabe, mas fica apinhado: abaixo de 700px, uma luz a cada dois
  livros, como a direção pede.

**19 Biblioteca**

- Acabamento. As fichas do balcão estão planas e alinhadas como nas outras linhas, sem o porta-fichas
  inclinado do 09 (`folhas/19-rola.png`). Não é pedido dele, é da direção; vale fazer só se não
  comprometer a leitura dos cards. Se ficar, que seja uma inclinação pequena da base (uns 4°) com a
  sombra na madeira, não o card tombado.

**20 Noturno**

- Acabamento. No claro o palco quase não se lê: a faixa é só um cinza muito claro com o fio das luzes
  (`estatico/20-home-1440-claro-v.png`). Dois ou três por cento a mais de tinta e a borda de frente
  marcada resolvem; no escuro está certo.

## 7. O que não verifiquei

- A mola do giro (passar do alvo e voltar), a lombada acendendo quando o mouse vai para o lado dela
  e a onda de luz de cima para baixo na fileira: vi só o estado em hover, não o quadro a quadro.
- O contador "N artigos" girando na página do livro e na troca de livro.
- A queda das fichas em Tags depois da cortina (vi a nuvem montada; as fichas estavam abaixo da dobra
  nas capturas).
- A pregagem e o endireitar das fichas do 16; a onda dos livros do 15 no 18; o embaralhar da tira
  das fichas no 18; o balanço da cordinha de voltar ao topo do 19 no hover (o clique sobe a página).
- A lista (modo Lista) como fichas separadas com a imagem à esquerda, em qualquer linha.
- O puxão da cordinha do lustre no clique, isolado em quadro.
- O desempenho com CPU 4× nas páginas inteiras (a cortina, o brilho e a lâmpada): usei só o
  `luz/custo.json` do construtor, que mede as demos.
- 320px e 768px no post e nas páginas de lista (vi 768 só na home das linhas 16, 18, 19 e 20 e na
  página do livro do 18 a 390).
- Dentro do computador: as abas do Código abrindo e fechando, o Finder abrindo um PDF por duplo
  clique, o zoom e as setas da Pré-Visualização, e o arrastar, o redimensionar e o gênio ao vivo
  (vi as capturas do construtor em `computador/`).
- O texto, a caneta, as lousas e os atalhos dentro do post (O1, O2): não comparei com o blog de hoje.
- Se o blog de hoje corta a anotação da ilustração do post do mesmo jeito (correção comum 6).

## 8. Correções aplicadas depois desta revisão (orquestrador, 01/10/2026)

| Correção | O que foi feito | Evidência |
|---|---|---|
| Comum 1, mancha âmbar no claro | Força da mancha numa variável por tema (`--luz-mouse-forca`): base com `multiply` a 42% no claro e `screen` a 13% no escuro; 18 com 46%/15% e 20 com 48%/15%. Diferença máxima perto × longe: base 35 (claro) e 31 (escuro), 18 com 37/34, 20 com 37/36 (antes, 10 a 13 no claro). | `r3/base-a/ambar/`, `r3/18-estante-moderna/ambar-4418-*.png`, `r3/20-noturno/tira-ambar20.png` |
| Comum 2, ícone do computador | De 768px para cima nunca sai da tela: inteiro parado, afunda 60% ao rolar para baixo, volta inteiro ao subir, ao parar (0,6s) ou com o mouse perto; 52px abaixo de 1440 e 64px a partir dela. Abaixo de 768, escondido onde cobriria conteúdo, com o item "Computador" no menu. 400 paradas medidas: 400 inteiro parado, 344 de 344 espiando ao rolar. | `r3/computador/icone/medicao.txt`, `filmes/c2-*.png` |
| Comum 3, nome do rodapé | Na base (17, 18 e 20): 58,1 a 58,2% das maiúsculas à vista abaixo da ficha a 1280, 1440 e 1600 (antes ~33%); a ficha cobre no máximo 14px. A 390 e a 768, como estava. O cone do rodapé da 20 continua certo. | `r3/base-e/rodape-r4-*.png`, `r3/20-noturno/rodape-final-*` |
| Comum 4, montagem de Livros | A mesma coreografia em menos tempo; os cards abaixo da dobra esperam a rolagem. Pela cortina: 2,1s (CPU 1×) e 2,3s (CPU 4×); chegando de fora: 3,2s e 3,5s (antes, 3,8 a 5,1s). Tags já estava dentro (1,4 a 1,6s por dentro). | `r3/base-e/f-livros-montagem-folha.png`; nas linhas, `filmes/f-livros-*` |
| Comum 5, aviso do `giro` na gaveta | O voo da gaveta recebia o objeto inteiro com `giro`; agora só posição e escala. Console limpo ao abrir a gaveta no 17, 18 e 20. | `gaveta-fileira.ts`, nas seis cópias |
| Comum 6, anotação cortada no post | Não reproduzido: no blog de hoje (11) e nas linhas, "o menos comum / cifrado até na memória" aparece inteiro a 1440. | capturas do orquestrador |
| 16, pregagem e hover | Sem mudança de código: o `li` fica com opacidade 1 de propósito (o alfinete é filho dele); papel, alfinete e texto esperam a rolagem. Filmado em câmera lenta; o hover endireita de 1,1° para 0° e sobe 3px. | `r3/16-parede/prova-pregar/` |
| 18, luzes no celular | Já era uma luz a cada dois livros abaixo de 700px (5 luzes para 9 livros); a peça encolheu para não apinhar. | `r3/18-estante-moderna/r-colecao-390-claro.png` |
| 19, porta-fichas | As fichas do balcão se apoiam inclinadas 4° para trás, com a borda de trás, o tampo, a fenda e a sombra; texto de frente; o hover puxa a ficha. | `r3/19-biblioteca/porta/` |
| 20, palco no claro | A faixa foi de 6% para 9% de tinta, com a borda da frente marcada por um fio de sombra quente. | `r3/20-noturno/palco-final-claro-1440.png` |

Conferência final nas cinco linhas: `astro check` com 0 erros e 0 avisos; build com 95 páginas; fumaça em
11 páginas × 2 temas × 390 e 1440 sem erro ou aviso no console e sem rolagem lateral.
