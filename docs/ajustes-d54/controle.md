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
