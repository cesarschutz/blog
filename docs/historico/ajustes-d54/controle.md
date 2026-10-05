# Caça aos bugs (D54, 29/09/2026)

Pedido do Cesar: "procure bugs nesse site, olhe todas as telas, navegação, enfim, veja se acha bug e
arrume se achar, no final me dê a relação dos bugs que você arrumou".

Varredura com cinco agentes (artigos, acessibilidade e SEO, listas, home e navegação), no build de
produção, em 320 a 1600px, nos dois temas, com e sem movimento reduzido, sem JS, pelo teclado, pelo
toque e na impressão. Cada item foi reproduzido antes e conferido depois no navegador (scripts em
`.astro/depuracao/correcoes/`). No fim: `astro check` sem erros, `npm run links` e `npm run contraste`
limpos, `npm run conferir` ok em cinco posts (cobrança, Jackson, criptografia, Java 21 e SNS) e as 86
páginas do `dist/` sem erro no console, sem recurso 404 e sem rolagem lateral em 1280 e 390px.

Publicado na `main` com o OK do Cesar ("Pública"), um commit por grupo abaixo. Alguns arquivos têm itens
de mais de um grupo e foram no commit do grupo em que a maior parte deles está (anotado em cada commit).

## Corrigidos

### Artigo e leitura

| # | Bug | Onde |
|---|---|---|
| 1 | No topo do artigo (< 1300px), clicar na marca do cabeçalho abria o sumário em vez de ir para a home | `artigo.ts` |
| 2 | A página pulava ~450px para cima quando um controle do cabeçalho recebia foco (tema, busca e Esc, links; no celular, o botão da seção) | `base.css`, `prosa.css`, `Atalhos.astro` |
| 3 | Abrir ou recarregar um artigo com `#seção` no endereço voltava ao topo depois da abertura | `Abertura.astro` |
| 4 | O Espaço (atalho de seção) pulava a seção "Apresentação" | `Atalhos.astro` |
| 5 | As imagens do texto não abriam no visor pelo teclado; clicar na faixa "n de N" não fechava o visor | `artigo.ts` |
| 6 | Visor e apresentação: no último slide, o botão com o foco ficava desabilitado, o foco caía no `<body>` e as setas paravam | `artigo.ts` |
| 7 | Apresentação: cliques rápidos em Próximo perdiam passos (5 cliques levavam ao slide 3) | `artigo.ts` |
| 8 | Sumário em folha: Enter no botão da seção não levava o foco para dentro; o Tab que saía dela ia para o rodapé e a página rolava até o fim | `artigo.ts` |
| 9 | Lousa de linha do tempo: a seta do teclado andava 0,1%; agora vai de um estado ao vizinho | `LousaTempo.astro` |
| 10 | Lousa tocando sozinha anunciava cada estado ao leitor de tela, em loop, mesmo fora da tela | `LousaTempo.astro` |
| 11 | A legenda da lousa mandava apertar o play sem JS (não há controles) e falava da roda do mouse no celular | `LousaTempo.astro`, `lousa.css` |
| 12 | Impressão: lousas no quadro 0 (a de loop vazia) com os controles, giz claro sumindo, tema escuro imprimindo texto cinza-claro, cabeçalho, compartilhar, anterior/próximo e voltar-ao-topo no papel, blocos `<details>` fechados fora e a frase em destaque cinza | `artigo.ts`, `LousaTempo.astro`, `LousaLoop.astro`, `lousa.css`, `tokens.ts`, `base.css`, `prosa.css` |

### Home e abertura

| # | Bug | Onde |
|---|---|---|
| 13 | O toque que pula a abertura também acionava o que estava embaixo (abria o livro da gaveta, navegava) | `Abertura.astro` |
| 14 | A tecla que pula a abertura rolava a página (Espaço, PageDown, End, setas) | `Abertura.astro` |
| 15 | A roda do mouse não pulava a abertura: a página ficava presa até ela acabar (o dedo que rola no celular já pulava) | `Abertura.astro` |
| 16 | Com o GSAP chegando depois da trava de 7s, a abertura tocava por cima da página já à vista | `Abertura.astro` |
| 17 | Sem o script da abertura, o desenho do destaque da home ficava escondido para sempre | `Base.astro` |
| 18 | Em rede lenta, a página aparecia sem o papel por um instante antes da abertura | `Base.astro` |
| 19 | Fechar o livro da gaveta com o mouse ou o dedo perdia o foco (ia para o `<body>`) | `Gaveta.astro` |
| 20 | 404: a rasura do endereço e a sugestão aconteciam escondidas atrás da abertura | `404.astro` |

### Cabeçalho, busca e navegação

| # | Bug | Onde |
|---|---|---|
| 21 | Sem JS, até 860px, o menu não abria e as seções sumiam; o "Buscar" não fazia nada em nenhuma largura | `Cabecalho.astro` |
| 22 | Busca: o primeiro Esc só limpava o campo | `Busca.astro` |
| 23 | Busca: o texto de exemplo do campo com contraste 3,5:1 no escuro | `Busca.astro` |
| 24 | Voltar ou avançar pelo histórico trazia o tema e o modo Lista/Cards de antes da troca | `Base.astro`, `tema.ts`, `SeletorModo.astro` |
| 25 | Voltando pelo histórico com o livro ampliado ou a busca abertos, o foco ficava no `<body>` (setas e Esc sem efeito) | `LivroAmpliado.astro`, `Busca.astro` |
| 26 | A busca indexava os textos do livro ampliado ("Voltar a página", "Fechado") em todos os artigos | `LivroAmpliado.astro` |

### Listas (arquivo, categorias, séries e tags)

| # | Bug | Onde |
|---|---|---|
| 27 | A trilha acima do título ("Categorias", "Tags", "Séries") não pegava o clique no meio | `TopoLivro.astro`, `ListaFiltrada.astro` |
| 28 | Tags com 1 ou 2 livros, de 641 a 1280px: "Só <livro> · Limpar filtro" cobria as pílulas "Aparece junto com" | `ListaFiltrada.astro` |
| 29 | "Limpar filtro" cortado pela folha em 320 e 360px | `ListaFiltrada.astro` |
| 30 | O Tab pulava "Limpar filtro"; com movimento reduzido, a legenda da estante ficava presa | `estante.css`, `estante-viva.ts` |
| 31 | `?livro=` inválido mostrava tudo sem tirar o parâmetro; com maiúsculas não filtrava | `ListaFiltrada.astro` |
| 32 | O título da tag quebrava "#Microsservi/ços" sem hífen em 320 e 360px | `ListaFiltrada.astro` |
| 33 | A descrição da página da tag contava a série como livro | `tags/[tag].astro` |
| 34 | Tarefa longa (~0,7s com CPU 4×) na carga de "Todos os artigos": o seletor Lista/Cards media cedo demais | `SeletorModo.astro` |
| 35 | Em 320px, o sinal de código-fonte ficava entre as linhas da data e do tempo de leitura | `MetaItem.astro` |

### Acessibilidade e RSS

| # | Bug | Onde |
|---|---|---|
| 36 | Livro ampliado: fólio e data com contraste 4,38:1 | `paginas.css` |
| 37 | Tabelas roláveis entravam no Tab sem nome nem papel | `rehype-tabela.mjs` |
| 38 | As setas da ficha de atalhos não tinham nome para o leitor de tela | `Atalhos.astro` |
| 39 | Links de compartilhar ("LinkedIn", "WhatsApp") ambíguos e sem aviso de nova aba | `RodapeArtigo.astro` |
| 40 | RSS: links de nota relativos (quebravam nos leitores) e ícones SVG gigantes no texto | `rss.xml.ts` |

### Depois da publicação (achado pelo Cesar)

| # | Bug | Onde |
|---|---|---|
| 41 | Ao recarregar um artigo, o desenho do topo aparecia pronto, sumia e só então se desenhava: a abertura tira o `data-abertura` (que o escondia) antes de a folha pousar. Agora o script marca a área com `data-desenhar-espera` e ela fica escondida até a sequência começar; a reserva conta 2s do fim da abertura (antes, 4s da carga, o que numa carga lenta repetia o salto) | `desenho-vivo.ts`, `desenho.css` |
| 42 | No celular, ao abrir um livro da estante, o vizinho que tomba para o lado perdia o desenho. Toda lombada parada tem transformação 3D (o `rotateX(0deg)` do CSS), mas o GSAP terminava o tombo numa rotação só 2D, e o Safari do celular não pintava o desenho nesse caso. Agora as lombadas ficam sempre em 3D (`force3D`, `EM_3D` em `estante-gesto.ts`). Conferido no Chrome (nenhum quadro com lombada girada só em 2D); o Safari de verdade não dá para testar aqui | `estante-gesto.ts` |
| 43 | Depois da abertura da home, o livro inclinado (Carreira) ficava 1,6 a 2,9px afundado na tábua: a abertura o girava pelo meio da base, e não pelo canto de baixo à direita, como no CSS | `Abertura.astro` |

### Segunda varredura (29/09/2026, depois dos achados do Cesar)

Quatro agentes, quadro a quadro (gravação pelo CDP), com CPU 4× e rede lenta, atrás de falhas passageiras:
peça que aparece e some, piscada, camada errada, salto.

| # | Bug | Onde |
|---|---|---|
| 44 | No celular, o toque pintava o realce azul do navegador por uns quadros: a tela inteira ao pular a abertura, e a lombada, a pilha, os cartões, o menu e os botões | `base.css` |
| 45 | Pular a abertura antes de o GSAP chegar não pulava: o papel ficava até o GSAP, a curva e as fontes chegarem (1,7 a 2,5s com a rede lenta). Agora termina na hora; no artigo, o desenho do topo começa em seguida | `Abertura.astro` |
| 46 | Com a fonte lenta, o papel da abertura da home ficava 11s ou mais: a trava de 7s saía antes das esperas, e a estante esperava as fontes sem limite (agora 2,2s, como o caderno) | `Abertura.astro` |
| 47 | O seletor Lista/Cards aparecia depois da primeira pintura e empurrava a lista 58px no meio da chegada (celular); com movimento reduzido, a pílula nascia do lado errado | `SeletorModo.astro` |
| 48 | Girar o celular no meio do gesto da gaveta deixava o livro no tamanho de celular | `Gaveta.astro` |
| 49 | Girar o celular no meio da abertura deixava ~1s de papel vazio (ou o caderno cortado): girar agora pula | `Abertura.astro` |
| 50 | O cabeçalho inteiro sumia por 1 a 3 quadros no meio da troca de página (no computador, em até metade das trocas): a imagem antiga saía antes de a nova ser pintada | `base.css` |
| 51 | Seguindo um link com a busca ou o livro ampliado abertos, o cabeçalho saía "aceso", sem o véu, por cima do diálogo | `troca.js` |
| 52 | No celular, a folha do menu aberto ia junto com o cabeçalho e ficava congelada por cima da troca | `troca.js`, `Cabecalho.astro` |
| 53 | Busca: fechando logo depois de abrir, o conteúdo voltava enquanto a janela encolhia | `Busca.astro` |
| 54 | O contador que rola passava por números maiores quando uma coluna sumia (22 → 2 mostrava 32, 42… 92) | `contador.ts` |
| 55 | Voltando pelo histórico a uma página deixada no meio da chegada, ela aparecia por um quadro congelada no meio do voo | `troca.js`, `categories/index.astro` |
| 56 | Fora do Mac, a tecla da busca trocava de "⌘K" para "Ctrl K" depois da primeira pintura, e o campo alargava | `Base.astro`, `Cabecalho.astro` |
| 57 | Anterior/próximo do mesmo livro, em telas de 1300px ou mais: a ficha "Do livro" duplicava, o livro escorregava de uma para a outra e a lateral velha sumia num corte | `troca.js` |
| 58 | Recarregar um artigo com `#seção` em 1600 e 768px parava longe do título (às vezes fora da tela): a abertura media com as folhas em voo; agora vai ao título antes de elas chegarem | `Abertura.astro` |
| 59 | A nota à mão da caneta mudava de lugar conforme a maneira de chegar ao artigo | `caneta.ts` |
| 60 | A frase em destaque ficava com as palavras acesas erradas depois de rolar durante a chegada | `FraseDestaque.astro` |
| 61 | Com movimento reduzido, a lousa de linha do tempo começava vazia, e não no estado final | `LousaTempo.astro` |
| 62 | Com o armazenamento do navegador bloqueado, a página seguia o tema do sistema, abria em Lista e o primeiro clique no tema não fazia nada | `Base.astro` |
| 63 | O desenho do destaque da home dependia do script: com a rede muito lenta ficava vazio por segundos, e com o script falhando (um HTML guardado de antes de um deploy) nunca aparecia. Agora aparece inteiro em 4s se o script não assumir | `desenho-vivo.ts`, `desenho.css` |
| 64 | No celular, com o livro aberto na gaveta, girar para deitado e voltar deixava o livro acima da tela, embaixo do cabeçalho | `Gaveta.astro` |
| 65 | Se a busca falhasse uma vez (a rede caiu), o "Tente de novo" repetia a falha para sempre | `pagefind.ts` |
| 66 | Se o GSAP não carregasse, os livros ficavam mortos: a lombada não abria nem navegava, a pilha não trocava e o filtro mudava os números mas não a lista. Agora cada um cai no caminho sem animação (o link, a lista direta), e a próxima tentativa baixa de novo | `gsap.ts`, `Gaveta.astro`, `PainelHome.astro`, `ListaFiltrada.astro`, `estante-viva.ts`, `categories/index.astro` |
| 67 | Com a rede lenta, o papel da abertura aparecia segundos antes do script dela, e tocar, clicar ou apertar uma tecla não pulava nada até a trava de 7s. Agora o script do `<head>` já pula (engole o clique e não rola com as teclas) e vai ao `#seção` | `Base.astro`, `Abertura.astro` |

A reconferência no navegador achou pontos ainda falhando nos itens 51, 53, 55, 57 e 58, e eles foram
refeitos e conferidos de novo: o cabeçalho sai sem o desfoque durante a troca e, com diálogo aberto, os
livros saem sem nome (a lupa acesa); o conteúdo da busca fica escondido enquanto ela fecha; a chegada
termina já no `pageswap`, e o desfile de Categorias assenta sem a transição dos cartões; no
anterior/próximo, o livro da lateral vai dentro da imagem dela (não sai mais à parte, por cima da ficha
nova) e o "mesmo livro" compara a posição do livro; a trava de 7s também vai ao `#seção`. Duas
regressões das próprias correções também saíram antes de publicar: os livros da estante esmaecendo
depois de pular a abertura cedo, e o "VOLUME 01" solto no alto do papel no começo da abertura da home.

## Para o Cesar decidir (não mexi)

1. **Chegada da folha longa no celular lento:** no Java 21 com CPU 4×, a folha que chega do fundo em 3D
   trava em tarefas de 0,4 a 1,1s (o navegador desenha os blocos de código a cada quadro). Proposta:
   folha mais alta que duas telas usa a chegada curta (sobe 12px e aparece). Máquina sem GPU: vale
   medir num celular de verdade.
2. **Voltar sem bfcache:** a página que estava no topo volta rolada 12 a 18px (o deslocamento inicial
   da chegada). Proposta: na volta, só opacidade e máscara, sem deslocar.
3. **Menu do celular aberto:** a página por trás continua rolando (não há trava de rolagem).
4. **Desfile de Categorias no celular:** por ~1s os cartões passam por cima da ficha do livro.
5. **Páginas de redirecionamento** (`/about/`, `/java/`, `/categories/Arquitetura/`…): o texto é o
   modelo do Astro, em inglês, visível por um instante.
6. **Busca que volta aberta:** voltando de um resultado, a busca reabre com os resultados (o `?q=` no
   endereço). Deixei assim, por parecer intencional; só o foco passou a voltar ao campo.
7. Já abertos no `estado.md`: `content-visibility` nos blocos de código (pergunta 12) e `aria-pressed`
   nos botões das lousas. Novos, de conteúdo: o texto alternativo dos slides das apresentações
   ("Slide 3 de 15") e a descrição curta das páginas de tag.
8. **Comportamentos novos para confirmar:** a roda do mouse pula a abertura (item 15); sem JS, o botão
   "Buscar" some (item 21, como o do tema); no visor, ao chegar ao último slide pelo teclado, o foco
   passa para "Anterior" (item 6).
9. **Da segunda varredura** (não mexi):
   - **Fonte padrão maior do navegador** (acessibilidade): não tem efeito, porque os tamanhos de texto
     estão em px (o `DESIGN.md` fixa 17px). Passar para `rem` é uma mudança grande.
   - **Voltar pelo histórico depois de trocar o tema em outra página:** a página aparece no tema antigo por
     ~0,25s e vira (o navegador mostra a imagem guardada antes do `pageshow`). Tirá-la do bfcache quando
     a preferência muda resolve, mas a volta passa a recarregar a página.
   - **Clique duplo rápido no tema:** o segundo clique do mouse é ignorado; pelo teclado, o segundo Enter
     pula a primeira troca e a tela escurece de uma vez num quadro.
   - **Fumaça da caneca:** saindo com o mouse no meio da animação, ela volta ao lugar de uma vez.
   - **Com movimento reduzido, `?livro=`** mostra a lista inteira por um quadro antes de filtrar.
   - **Desfile de Categorias:** 80 a 160ms de mesa vazia entre a saída da página e o primeiro cartão.
   - **O toque que pula a abertura** deixa em hover o que está sob o dedo (o título do card fica azul).
   - **Trocar o tema com o livro voando para a gaveta:** o livro some até o círculo passar.
