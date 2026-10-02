# Rodada 4: a versão final (controle)

Pedido de 01/10/2026, texto inteiro em `retorno-cesar.md`. Ele olhou os protótipos 16 a 20 e disse o que
quer de cada um para montar a versão final.

## O pedido

- **A versão final** junta o que ele escolheu nos 16 a 20, mais as sugestões nossas.
- **Duas formas para o mesmo lugar:** quando ele gostou das duas, ou quando uma sugestão nossa muda um
  lugar, a melhor vai para o protótipo e as outras vão para uma **amostra**: uma página de exemplo com o
  antes e o depois, não um protótipo inteiro.
- **Quantidade:** pode haver mais de um protótipo e quantas amostras forem úteis.
- **A home é a do "Cesar Schutz" grande** (a do 14, 17, 18 e 20). Não é a parede (16) nem a biblioteca
  (19).
- **A amostra principal são os livros parados na home:** vários tipos, todos com o abajur em cima.
  Fora da amostra, os outros lugares ficam com o abajur como estão.

## Os pedidos, numerados

### Geral (G)

| # | Pedido |
|---|---|
| G1 | Home com o nome grande |
| G2 | Livros parados na home: gostou do 17 (nada embaixo), do 18 (a estante, mas "mais bonita e elegante") e do 20 (o "afundado", como um buraco onde os livros ficam) → amostra |
| G3 | "Gostei MUITO" dos abajures em cima dos livros (18) |
| G4 | Fundo claro: o do 20 |
| G5 | Escuro: o marrom do 19; "preto ou um azul tb deve ficar legal" → amostra |
| G6 | Sem nada embaixo, os livros parecem voar; com estante, fica estranho. Resolver em todas as formas, em especial na limpa |

### Animações (A)

| # | Pedido |
|---|---|
| A1 | Entrada na home: a sequência do 18, melhorada: primeiro os livros sobem e descem, depois só o brilho. O "Cesar Schutz" entra da direita para a esquerda depois que os livros aparecem (20) |
| A2 | Entrada nas outras páginas: a que todos têm (o caderno) |
| A3 | Entre páginas: a cortina azul com o nome grande, como está. Depois dela, a animação do blog atual: em Livros, o desfile; **principalmente em Tags**, os cards jogados do alto que se arrumam na grade; nas listas e em qualquer tela, a montagem do atual |

### Rodapé (R)

| # | Pedido |
|---|---|
| R1 | Ele gostou da madeira escura embaixo (16 e 19), com a ficha em cima e o nome pela metade sobre ela. Na final não há madeira, e sem nada a ficha "parece incompleto": pensar uma superfície → amostra |
| R2 | A cordinha do 19 para subir, "combina com o abajur". Quando ela aparece, saem a bolinha com a seta e a fita de subir da ficha |

### Por protótipo

| # | Pedido |
|---|---|
| P16-1 | "Artigos recentes" como papel colado (home); fazer parecido no botão Lista/Cards |
| P16-2 | Paginação como papel: um papel para tudo ou um papel por botão (1, 2, "Mais artigos") → amostra |
| P16-3 | As letras do menu girando no hover |
| P16-4 | Em Livros, a luz nos livros "podia ter o abajur igual na home" |
| P16-5 | Página do livro: os livros numa estante no alto, que diminui ao rolar; as tags em volta do livro |
| P16-6 | Gostou da tela de todas as tags (a da cortiça) |
| P16-7 | Cards centrados quando há menos de 4, em livros e em tags |
| P16-8 | Cards aparecendo ao rolar |
| P16-9 | Post: grande em cima, o "Neste artigo" embaixo; talvez os cards do post parecerem ficha ou papel → amostra |
| P17-1 | O traço embaixo de "A coleção" e de "Artigos recentes": "da identidade pro site!" |
| P17-2 | Livros sem nada embaixo: limpo, mas parecem voar (G6) |
| P18-1 | A estante da home mais bem feita: estava "simples demais" (G2) |
| P18-2 | O abajur em cima dos livros em Todos os artigos e em Livros: "gostei muito" |
| P18-3 | Ao tirar um livro no filtro de Todos os artigos, a luz do livro que saiu fica acesa |
| P19-1 | A cordinha (R2) |
| P19-2 | Tags: as gavetas com as letras, mas na vertical, ao lado da nuvem, em tela grande; em tela pequena, embaixo dela e na horizontal, como está |
| P19-3 | Página do livro: "Deste livro também" com as tags como papel |
| P19-4 | "Gostei muito" dos cards caindo de cima para baixo |
| P20-1 | O efeito afundado onde ficam os livros (G2) |
| P20-2 | A luz do 20 melhor que a do abajur, pelo menos na home: mais longe do livro, com os raios de luz mais à vista |

### Lugares com mais de uma forma (vão para amostra)

| # | Lugar | As formas |
|---|---|---|
| D1 | Livros na home | limpo (17), estante elegante (18), afundado (20); a luz do abajur (18) ou a luz mais alta, com raios (20) |
| D2 | Escuro | marrom (19), preto, azul |
| D3 | Tags | a cortiça (16) ou as gavetas (19); a chegada com os cards jogados do atual ou as fichas caindo (19) |
| D4 | Paginação | um papel ou um papel por botão |
| D5 | Rodapé | a superfície sob a ficha |
| D6 | Post | os cards como hoje ou como ficha ou papel |

## Pesquisa do orquestrador

Filmado no blog de hoje (cópia 11, http://127.0.0.1:4411):

- **Tags:** os cards de tag chegam jogados do alto à direita, espalhados e tortos, e se arrumam na grade
  entre 0,55 e 1,4s.
- **Livros:** o desfile. Os cards se empilham à direita com o nome de cada livro grande à esquerda e se
  espalham na grade (cerca de 3,5s).

Na base da rodada 3, Tags mostra a nuvem e as fichas caem ao rolar. As capturas estão em
`scratchpad` da sessão; o diretor refaz as que precisar.

## Fases

1. **Direção (Fable):** `direcao.md`, com a versão final (decidindo os conflitos pelo texto dele), a
   lista das amostras e as sugestões do diretor.
2. **Construção:**
   - o protótipo final (`redesenho/novos/21-final`, porta 4421) por áreas em paralelo;
   - as amostras como páginas dentro dele (`/amostras/`), com componentes de verdade, para dar para
     passar o mouse.
3. **Revisão e entrega:** revisão final do diretor (Fable, contexto novo) contra este texto; correções;
   conferência; entrega com as URLs.

## Status

| Peça | Status |
|---|---|
| texto do Cesar | salvo |
| controle | este arquivo |
| direção | pronta (Fable), `direcao.md`: parte da 18; livros da home no nicho afundado (V1) com os abajures mais altos; 7 variantes na amostra; rodapé de feltro verde; Tags com fichário de aço vertical |
| 21-final | **pronta para o Cesar revisar** (01/10/2026): as cinco partes e as amostras feitas; `astro check` 0 erros, build 103 páginas, fumaça limpa em 19 páginas (com as amostras) nos dois temas a 390 e 1440. A revisão do diretor (Fable) ficou para depois do retorno do Cesar, numa rodada só de correções |
| amostras | prontas em `/amostras/` (livros-home V1 a V7, escuro, tags, paginacao, rodape, post, sugestoes) |

### Construção: quem faz o quê na `21-final`

Todos `redesenho-construtor-max` (Opus xhigh), em paralelo, cada um dono dos próprios arquivos.

| Construtor | Itens da direção | Amostras |
|---|---|---|
| A, nicho e abajures | G2, G3, G6, P20-2, P18-3, P16-5 (nicho na home, no topo do livro e no filtro), A1 (a entrada da home), a gaveta saindo do nicho | — |
| B, cara e home | G4, G5 (paleta), P17-1 (traço), P16-1 (etiqueta e Lista/Cards de papel), P16-2 (paginação de papel) | D2 escuro, D4 paginação, o índice `/amostras/` |
| C, Tags, Livros e trocas | P19-2 (fichário de aço), P19-3, P19-4, P16-4, P18-2, A3 (cortina e as animações do atual) | D3 tags |
| D, rodapé e post | R1 (feltro), R2 (cordinha; saem a seta e a fita), P16-9 (anterior e próximo como fichas) | D5 rodapé, D6 post |
| E, amostra dos livros | — | D1 livros da home (V1 a V7), S sugestões |

Combinados: o chão das fileiras é trocável por `chao` (`data-chao`) no `Colecao`, no `FileiraTopo` e no
`Estante` (padrão "nicho", do A); a E pinta as outras variantes por CSS em `src/amostras/`; o A publica o
nicho como classes e variáveis estáveis.

## Decisões do Cesar sobre a versão final e as amostras (01/10/2026)

Texto inteiro em `retorno-cesar-2.md`.

| # | Decisão |
|---|---|
| E1 | Corrigir o nome gigante do rodapé: o alto das letras está cortado |
| E2 | Corrigir a cortina: o pé do texto grande está cortado |
| E3 | Livros da home: **V2** (a lâmina de vidro, a forma limpa do 17) com a luz do **V4**: no hover ou na escolha de um livro, além do cone de cima, acende a luz embaixo do livro, na prateleira. Vale na home, no topo do livro e no filtro |
| E4 | Escuro: **A** (marrom), como está |
| E5 | Tags: como está no protótipo |
| E6 | Paginação: **B** (um papel por botão); "Artigos recentes" e Lista/Cards como no protótipo |
| E7 | Rodapé: como está (feltro) |
| E8 | Fim do post: anterior e próximo na forma **B** (ficha) com a **fita do C**; a ficha "Do livro" como no protótipo |
| E9 | S1, o carimbo "Novo" no destaque: entra, com dois defeitos corrigidos: na lista ele cobria o "nº 028" (tem de ficar embaixo, sem pegar texto, como no card); e no hover do card o carimbo ficava parado (tem de acompanhar o card) |
| E10 | S2: não entra |
| E11 | S3: em vez de virar placa, a frase "8 livros e uma série · Ver os livros" sai |
| E12 | Entrada da home: ele achou demorados o caderno abrindo e a assinatura sob "Schutz" (vinham a 2,95s e 3,75 a 4,7s, encadeados no fim). Passam a acontecer quando os livros param |
| E13 | Os sites 16 a 20 e as amostras continuam no ar |
| E14 | (pedido seguinte) O post ganha a moldura da imagem do 20: a cartolina da cor do livro atrás da ilustração do topo, 12px maior de cada lado, com a luz do mouse passando nela. Levada do 20 por patch (`TopoArtigo.astro` e a luz local do `luz.ts`) |

**Feito em 01/10/2026:** E1 a E13 aplicados na `21-final` e conferidos (`astro check` 0 erros e 0 avisos, build com 103 páginas, fumaça limpa em 19 páginas nos dois temas a 390 e 1440; capturas da home com a luz embaixo do livro, da cortina com o nome inteiro e do rodapé com o alto das letras). As marcas "no protótipo" das amostras foram atualizadas (V2 com a luz da V4, paginação B, ficha com fita, S1). O dev da `21-final` foi reiniciado limpo (cache do Expressive Code e do Vite) e o `astro.config.mjs` dela pré-carrega o GSAP (`optimizeDeps.include`). Falta o Cesar validar.

## Terceira lista do Cesar sobre a versão final (02/10/2026)

Texto inteiro em `retorno-cesar-3.md`.

| # | Pedido | Quem faz |
|---|---|---|
| H1 | A mancha âmbar que segue o mouse, um pouco mais fraca ("tá muito forte") | construtor da luz (rodada 3, área A) |
| H2 | Na entrada da home, sai "E a revista": a série é livro também | construtor do nicho/vidro (rodada 4, A) |
| H3 | Na home, clicar num livro não abre mais a gaveta: vai para a página do livro com ele escolhido, com uma animação boa na mudança | construtor do nicho/vidro (rodada 4, A) |
| H4 | Sai a luz amarela que cobre o livro no hover (em todo lugar; pior no livro grande da página do livro) | construtor da luz (rodada 3, área A) |
| H5 | Tudo o que ainda é painel ou card vira papel, elegante e discreto, com ou sem fita, com ou sem pauta: o painel da página do livro, o topo e a folha do texto do post, o topo de Todos os artigos, a nuvem de Tags e o que mais houver | direção do Fable (`direcao-papel.md`), depois construtores |
| H6 | Uma barra de rolagem elegante nos dois temas, a mesma em todo lugar que rola | construtor da cara (rodada 4, B) |
| H7 | Em lista (Todos os artigos, home), em tela grande com espaço vazio à direita: o livro à direita de cada artigo, virado para o texto (o contrário de hoje) ou como a foto do "Do livro"; ver qual fica melhor | construtor da cara (rodada 4, B) |
| H8 | Paginação: o círculo de caneta do hover, menor e mais perto do número, como o disco do 1 | construtor da cara (rodada 4, B) |
| H9 | Na página de uma tag, o livro à direita de cada artigo fica como está | construtor da cara (rodada 4, B) |
| H10 | Na home, sai o "Vol. 04" em cima dos livros | construtor do nicho/vidro (rodada 4, A) |
| H11 | "Se fica sem mexer no site na home, ele faz a animação de novo": sai o cochilo (um livro sorteado tomba sozinho a cada 4 a 7s com a página parada) e qualquer outra animação que toque sozinha; animação só ao chegar de fora ou ao atualizar, ou como resposta ao leitor. (Enquanto os construtores salvam arquivos, o Vite recarrega a página aberta e a abertura toca de novo; isso é só do dev.) | construtor do nicho/vidro (rodada 4, A) |

**Feito em 02/10/2026:** H1 a H11 aplicados na `21-final`. A mancha do mouse caiu cerca de um terço (30% no claro, 10,5% no escuro); a luz amarela do hover saiu de todo livro (a onda da entrada ficou branca e fraca); a série é "Série" e "artigos" em todo texto visível; o clique no livro da home voa até a página do livro, sem cortina, e a gaveta saiu da home; os "Vol. NN" e o cochilo saíram; tudo o que era painel ou card virou papel pela `direcao-papel.md` (fichas de catálogo, folhas lisas e etiquetas, com canto de 2px ou 6px e a sombra curta), e as últimas pílulas redondas (botões, "Limpar filtro", o campo de busca) também; a barra de rolagem é uma só; o livro 3D espelhado entrou à direita nas listas a partir de 1100px (a foto do "Do livro" ficou na amostra `/amostras/lista/`); o círculo da paginação tem o tamanho do disco. Conferido: `astro check` 0 erros e 0 avisos, build com 104 páginas, fumaça limpa em 20 páginas nos dois temas a 390 e 1440. Falta o Cesar validar.

**Ajustes seguintes (02/10/2026):** a mancha do mouse caiu de novo (21% no claro, 7,5% no escuro); a barra de rolagem foi refeita: as regras `::-webkit-scrollbar` saíram de trás do `@supports selector(...)` (no navegador dele ela voltava a ser a do sistema), o polegar é uma pílula fina na tinta azul da caneta sobre um fio de pauta, e a da página começa embaixo do cabeçalho (`::-webkit-scrollbar-track` com `margin-top`; com `:root::` ou `html::` o Chrome não aplica); o caderno "cs" grande não mostra mais o miolo pautado na borda (só quando a capa abre); o campo de busca virou etiqueta de papel, sem a pílula a lápis.

## Como retomar

Ler este arquivo e o `retorno-cesar.md`, ver o status e seguir da fase em que parou. As regras de
sempre valem: nada de commit nem push, e nada no Segundo Cérebro.

**02/10/2026, mais três:** a barra de rolagem passou do azul para o verde do caderno "cs" (a marca; no escuro, um nada mais claro), sem o fio de trilho e com o polegar mais fino; o fio de baixo do cabeçalho vai até a borda da janela, por cima da barra (o fundo da barra da janela desenha o papel e o fio na altura do cabeçalho); e o "voltar ao topo" para páginas longas, que some quando a cordinha aparece, está com o construtor do rodapé.

**Voltar ao topo (02/10/2026):** uma aba de fichário de papel na borda direita, embaixo (`AbaTopo.astro`), com a seta à caneta e "topo"; só em página com mais de 3 telas, depois de 1,5 tela; some no topo e quando a cordinha do rodapé entra na tela; no celular, menor e só ao rolar para cima.

**Publicado (02/10/2026, D61):** a pedido do Cesar ("pode passar para main e publicar no git"), a
`21-final` foi levada para o `src/` do blog, por cima da D59 e da D60, sem as amostras, e publicada. Os
protótipos e as amostras continuam nesta máquina, fora do git. O que entrou e o que foi conferido está
na D61 (`docs/decisoes.md`).
