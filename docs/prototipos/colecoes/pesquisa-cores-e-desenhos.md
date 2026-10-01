# Pesquisa de cores e desenhos para os livros

Material para a etapa 5 e 6 do `controle.md`: para cada assunto que pode virar livro, dois ou três
instrumentos de ofício candidatos e duas ou três cores com fundamento, mais uma paleta recomendada
conferida inteira no `scripts/livros/conferir-cores.mjs`. Feito em 01/10/2026, antes de a lista final
de livros existir; vale para qualquer das cinco sugestões.

## Como ler

- **Fato** é o que foi conferido numa fonte (a lista está no fim). **Associação** é uma ligação sem
  história por trás: está dito quando é só isso. Os sites de referência (Wikipedia, Britannica,
  museus) estão bloqueados pelo proxy desta sessão; a conferência foi pelos trechos que a busca na
  web devolve de cada página, com o endereço anotado. Vale reler na fonte quando o proxy liberar.
- **Legível pequeno** é o ícone da lombada (uns 40px, só os traços principais, sem hachura nem
  fantasma). Um objeto que precisa de detalhe para ser reconhecido não serve.
- **Tinta**: a cor recebe a tinta clara `#efe8d8` quando é escura e a escura `#29251b` quando é
  clara (`cores.js` decide pela luminância; o limite cai perto de L 67 em OKLCh). Na capa, o desenho
  das cores claras sai no `destaque` (a cor escurecida), como no ocre do SRE.
- **Script**: `✓` passa; `!` é alerta (hoje o ocre tem um no quadradinho do chip e o couro tem a
  tinta em 3,39:1, "só texto grande"); `✗` é falha. Entre cores, ΔE em OKLab: hoje o par mais
  próximo é Dados × DevOps, 0,064, e abaixo de 0,05 as cores se confundem. Tomei 0,064 como piso para
  qualquer par novo.
- Os objetos que já são ícones de tag não entram (lista no `manual-desenho.md`). Objetos que
  aparecem em dois assuntos estão marcados: só um livro pode levar cada um.

## A paleta recomendada

Os oito de hoje ficam como estão. Os oito novos foram escolhidos olhando a estante inteira: cada um
ocupa um matiz ou uma luminosidade que ainda estava vazio. Com os dezesseis juntos, a estante fica
com três livros claros a mais (Integração, Nuvem e Fundamentos, de tinta escura como o SRE), um
quase preto (Testes) e um bem escuro (Sistemas Distribuídos).

| Assunto | Cor | Nome | Fundamento (curto) | Tinta | Desenho (1ª escolha) |
|---|---|---|---|---|---|
| Arquitetura de Software | `#2d4b46` | verde-pátina | fato: a pátina do cobre e do bronze na arquitetura | clara | arco e pedra angular (de hoje) |
| Sistemas Distribuídos | `#1c2c51` | azul-marinho | fato: o azul da Marinha (1748) e o cronômetro de marinha, que carregava a hora de referência | clara | dois relógios de bolso, um adiantado |
| Integração e Eventos | `#72aba5` | verde-água de isolador | fato: o vidro dos isoladores de telégrafo saía verde-água | escura | central telefônica manual |
| Pagamentos | `#527c6a` | verde-cédula | fato: o verso verde das cédulas americanas desde 1861 | clara | caixa registradora mecânica |
| Desenvolvimento / Backend | `#7a4430` | tijolo | fato: o vermelho da argila queimada (hematita) e o zarcão das peças de ferro | clara | paquímetro medindo uma peça (de hoje) |
| Testes e Qualidade | `#383532` | pedra de toque | fato: a pedra preta em que se risca o ouro para testar | clara | prumo contra a parede |
| Dados | `#5f4662` | ameixa | fato: o roxo das cópias do mimeógrafo a álcool | clara | gaveta de fichas (de hoje) |
| IA | `#6e2f45` | vinho | fato só do material: o vermelho do marroquim das encadernações; nada liga ao assunto | clara | autômato escritor (de hoje) |
| Segurança | `#606a37` | oliva | fato: o verde-oliva das fardas (EUA, 1902–1981; Brasil, desde 1931) | clara | carta lacrada e sinete (de hoje) |
| Nuvem | `#89a4c7` | azul-celeste | associação: o céu; o pigmento cerúleo leva o nome do céu | escura | torre de caixa d'água |
| DevOps / Plataforma | `#465976` | azul-ardósia | fato: o azul das camisas de trabalho que deu nome ao "colarinho azul" (1924) | clara | guindaste de porto (de hoje) |
| SRE / Observabilidade | `#c4a050` | ocre | fato: o ocre é dos pigmentos mais antigos e o amarelo é a cor da cautela na sinalização | escura | farol (de hoje) |
| Fundamentos de Computação | `#a69d91` | cinza-pedra | associação: a pedra fundamental, a primeira que se assenta | escura | régua de cálculo |
| Frontend e Web | `#9c666e` | rosa-garança | fato: a garança, o vermelho dos tecidos; "web" é tecido tramado | clara | tear de mão |
| Arquitetura Corporativa | `#43345c` | púrpura-tíria | fato: a púrpura como cor da autoridade, de Roma a Bizâncio | clara | sextante |
| Carreira / Liderança | `#9a7650` | couro | fato só do material: o couro de bezerro das encadernações; a ligação com o assunto é associação | clara | compasso (de hoje) |

Resultado do script com as dezesseis juntas (`node scripts/livros/conferir-cores.mjs …`, saída
colada; exit 0):

```
Cor       Nome                          tinta/cor  chip(c/e)    L    C     h   Situação
#2d4b46  Arquitetura                    7.80:1  11.7/6.0    39 0.037  183   ✓
#7a4430  Desenvolvimento                6.38:1  10.3/6.6    45 0.081   41   ✓
#5f4662  Dados                          6.78:1  10.7/6.4    43 0.055  323   ✓
#6e2f45  IA                             7.98:1  11.9/6.0    40 0.093    0   ✓
#606a37  Segurança                      4.76:1  8.5/7.4    50 0.074  118   ✓
#465976  DevOps                         5.83:1  9.8/6.9    46 0.053  259   ✓
#c4a050  SRE                            6.18:1  4.7/10.7    72 0.108   85   ! quadradinho claro 2.47:1
#9a7650  Carreira                       3.39:1  6.7/8.6    59 0.070   67   ! tinta sobre a cor 3.39:1 (só texto grande)
#527c6a  Pagamentos                     3.87:1  7.4/8.1    55 0.055  166   ! tinta sobre a cor 3.87:1 (só texto grande)
#72aba5  Integração                     5.88:1  4.9/10.5    70 0.060  188   ! quadradinho claro 2.60:1
#1c2c51  Distribuídos                  11.26:1  14.6/5.0    30 0.071  265   ✓
#89a4c7  Nuvem                          5.96:1  4.8/10.5    71 0.060  255   ! quadradinho claro 2.56:1
#a69d91  Fundamentos                    5.71:1  5.0/10.3    70 0.020   75   ! quadradinho claro 2.67:1
#383532  Testes                         9.98:1  13.6/5.3    33 0.007   68   ✓
#9c666e  Frontend                       3.79:1  7.3/8.2    57 0.070   10   ! tinta sobre a cor 3.79:1 (só texto grande)
#43345c  Corporativa                    9.13:1  12.8/5.6    36 0.069  300   ✓

Pares mais parecidos (ΔE OKLab; a coleção de hoje vai até 0,064; abaixo de 0,05 se confundem):
  ✓ 0.064  Dados × DevOps
  ✓ 0.067  Integração × Nuvem
  ✓ 0.068  Dados × IA
  ✓ 0.069  Arquitetura × Testes
  ✓ 0.070  Integração × Fundamentos
```

Os pares seguintes (calculados com a mesma conta do script, todos os 120 pares): Carreira × Frontend
0,071; Segurança × Pagamentos 0,072; Distribuídos × Corporativa 0,074; Dados × Corporativa 0,077;
Testes × Corporativa 0,079; Nuvem × Fundamentos 0,080; Distribuídos × Testes 0,083. Nenhum par novo
fica abaixo do piso de hoje; os alertas são do mesmo tipo dos que o ocre e o couro já têm.

Dois pontos para o Cesar decidir, se quiser mexer:

- **Pagamentos e Frontend** ficam com a tinta clara em 3,8:1, como o couro de hoje (3,39:1): a
  frase da capa tem 24px e passa, mas é menos folga que os outros. Escurecer o verde-cédula esbarra
  na oliva (em L 52 o ΔE cai para 0,044); escurecer o rosa esbarra no vinho. É o preço de dois matizes
  que a estante ainda não tinha.
- **Nuvem e Integração** são as duas claras mais próximas (0,067). Se os dois livros entrarem na
  mesma sugestão e incomodarem lado a lado, a Nuvem pode ir para um cinza-zinco (`#9ea6ab`, o
  material da caixa d'água), mas aí ela cola no cinza-pedra de Fundamentos (0,037). Só dá para ter um
  cinza claro na estante.

## Os oito livros de hoje

Para cada um: se o desenho continua servindo com o assunto como as sugestões o definem, e o
fundamento que achei para a cor que já têm.

### Arquitetura de Software (ou só "Arquitetura")

- **Desenho (arco e pedra angular): continua.** A pedra angular é a peça que segura tudo e que não
  se tira depois: é a decisão cara de desfazer. Serve para DDD, padrões e ADRs, e serve igual se o
  livro absorver a Arquitetura Corporativa (sugestões 4 e 5) ou se perder a parte de sistemas
  distribuídos. Se um dia o blog tiver um livro de Sistemas Distribuídos ao lado, o arco continua
  sendo o da arquitetura: os relógios (abaixo) são outra metáfora.
- **Cor `#2d4b46`, verde-pátina: fato.** É a cor que o cobre e o bronze ganham na arquitetura com
  o tempo: a Estátua da Liberdade foi inaugurada em 1886 cor de moeda nova e estava verde por volta
  de 1906–1920; um telhado de cobre leva de 10 a 30 anos para esverdear, e a pátina protege o metal
  em vez de corroer. É a cor do que foi construído para durar: combina com "as decisões caras de
  desfazer". (Fontes: ACS, Copper Development Association, fabricantes de telhado.)

### Desenvolvimento de Software (Backend, Java e Spring, Java e JVM)

- **Desenho (paquímetro medindo uma peça): continua.** O instrumento de medir com precisão a peça
  que se fez é o ofício dentro de cada serviço. Com o nome "Java e Spring" ou "Backend" não muda
  nada. Um cuidado: se Testes e Qualidade virar livro, o instrumento dele não pode ser outro de
  medir (micrômetro, calibrador), senão os dois livros parecem o mesmo; por isso Testes leva abaixo um
  instrumento de conferir (prumo, nível, esquadro), não de medir.
- **Cor `#7a4430`, tijolo: fato, duas vezes.** O vermelho do tijolo vem do ferro da argila: com 4 a
  8% de óxido de ferro, a queima em forno com oxigênio forma hematita, que tinge a peça de vermelho.
  E o zarcão (tetróxido de chumbo, do árabe *zarqun*, "cor de fogo") foi até o fim do século XX a
  primeira demão de toda peça de ferro e aço contra a ferrugem: a cor da oficina, do cavalete de
  máquina, do navio recém-pintado. A peça que o paquímetro mede sai de uma oficina assim.
- **Se o livro se partir em Java e JVM + Spring (sugestão 4):** Java e JVM fica com o paquímetro e o
  tijolo. Para Spring, dois pontos de partida: o **mecanismo de relógio aberto** (a ideia do editor:
  o que o framework faz sem você ver; fantasma: a engrenagem que falta) e o **tear de Jacquard com os
  cartões** (a máquina que lê a configuração e faz o trabalho; mas o tear é o candidato de Frontend,
  então só um dos dois). A cor precisaria de um décimo sétimo lugar na paleta, e as margens já
  estão em 0,064–0,07: o cobre `#9a5d3b` (o metal das engrenagens de relógio) é o que sobra sem
  colidir (0,063 com o couro, 0,067 com o rosa; tinta em 4,30:1).

### Dados

- **Desenho (gaveta de fichas): continua.** A ficha é o registro, a gaveta é o índice, a ficha que
  volta é o fantasma. Vale para bancos, CDC, streaming e lakehouse ("onde o dado mora e por onde ele
  anda").
- **Cor `#5f4662`, ameixa: fato, com a ligação por associação.** As cópias do mimeógrafo a álcool
  (o *spirit duplicator*, 1923, o "Ditto" das escolas e escritórios por décadas) eram roxas:
  a cera das matrizes era de roxo de anilina, "barato, durável e o mais legível pelo maior número de
  cópias". A cópia roxa de um registro, de uma lista, de uma prova, é a imagem da ficha copiada que
  vai para a gaveta. A ligação entre o roxo e "dados" é essa, não uma convenção da área.

### IA

- **Desenho (autômato escritor): continua.** O Escritor de Jaquet-Droz (1768–1774, 6.000 peças, 40
  cames que são o programa, texto de até 40 letras trocável) é a máquina que escreve e que se
  programa: um LLM de 1774. Para "agentes e MCP" continua certo: o autômato age sozinho.
- **Cor `#6e2f45`, vinho: não há fundamento ligado ao assunto.** Procurei a roupa do Escritor: as
  fontes falam em veludo, uma legenda de foto fala em casaco vermelho, e a réplica de 1997 veste
  azul; o museu de Neuchâtel não descreve a cor. Não vale como fato. O que há é um fundamento de
  material, não de assunto: o marroquim (couro de cabra tingido com sumagre, no vermelho escuro que
  deu fama às encadernações finas desde o século XVI) é a cor de capa de livro mais tradicional que
  existe. Se o Cesar quiser um motivo escrito na ficha, é esse; se quiser um motivo sobre IA, não
  achei e é melhor dizer que é uma escolha.

### Segurança

- **Desenho (carta lacrada e sinete): continua.** O sinete prova quem mandou, o lacre prova que
  ninguém abriu: identidade, segredo e prova, como diz a frase da capa. Serve para JWT, criptografia,
  supply chain e LGPD.
- **Cor `#606a37`, oliva: fato (convenção).** O verde-oliva é a cor da farda: o *olive drab* foi a
  cor do uniforme de campanha do Exército dos EUA de 1902 até 1981 (OD33, OD7, depois OG-107), e o
  Exército Brasileiro usa o verde-oliva desde 1931, a ponto de a cor ser o nome da instituição. A
  cor de quem guarda. É convenção militar, não da segurança da informação; a ligação é essa.

### DevOps (Plataforma, Kubernetes e AWS, Kubernetes)

- **Desenho (guindaste de porto): continua.** O guindaste empilha contêineres: é a imagem mais
  literal da estante inteira, e vale igual com o nome "Plataforma" ou "Kubernetes e AWS" (o editor
  já notou). Se Nuvem virar livro separado, o guindaste fica com o DevOps e a Nuvem leva a caixa
  d'água (abaixo).
- **Cor `#465976`, azul-ardósia: fato (convenção).** "Colarinho azul" vem das camisas de brim e
  chambray azuis dos trabalhadores manuais, em oposição à camisa branca do escritório; a primeira
  menção impressa é de 1924, num jornal de Alden, Iowa. O azul escondia graxa e sujeira, por isso é
  a cor do macacão e do *bleu de travail* francês. O trabalho de operação, do cais, do chão de
  fábrica. A ardósia (a pedra de telhado) dá o tom cinzento.

### SRE (Observabilidade)

- **Desenho (farol): continua.** Fica aceso o tempo todo, avisa de longe e vê o que ninguém vê:
  serve para "o que mantém a produção de pé" e para "descobrir o que aconteceu em produção". Uma
  alternativa, só se o livro for renomeado para Observabilidade e o Cesar quiser trocar: o
  **estetoscópio** (ouvir por dentro sem abrir), legível pequeno, sem colisão.
- **Cor `#c4a050`, ocre: fato, duas vezes.** O ocre amarelo (goethita, óxido de ferro hidratado) é
  dos pigmentos mais antigos da humanidade, com uso datado em mais de 300 mil anos e pinturas de
  caverna ainda inteiras: o que fica de pé. E o amarelo é a cor da cautela nas convenções de
  sinalização: na ANSI Z535.1 o amarelo é "caution" (abaixo do laranja e do vermelho), e o âmbar é
  o sinal de "prepare-se" nos semáforos (Cleveland, 1914) e nos giroflex. O farol avisa antes de o
  navio bater.

### Carreira (Liderança)

- **Desenho (compasso): continua.** O instrumento do arquiteto, de quem traça o plano e forma o
  time. Cuidado só com a bússola, candidata da Arquitetura Corporativa: em inglês as duas são
  *compass* e na lombada um mostrador redondo e um compasso aberto não se confundem, mas é bom não
  ter as duas na mesma sugestão.
- **Cor `#9a7650`, couro: fato do material, associação com o assunto.** O couro de bezerro foi o
  material mais comum das encadernações na primeira metade da era da imprensa, em tons naturais de
  bege e marrom; é a cor do caderno que envelhece com o uso. Não há convenção que ligue couro a
  carreira: é a associação do caderno de estudo, e é boa.

## Os assuntos novos

### Sistemas Distribuídos

**Desenho**

1. **Dois relógios de bolso, um adiantado.** Dois nós, cada um com a sua hora: ordenação de
   eventos, relógios lógicos, a rede entre eles. É a imagem do campo inteiro (Lamport). Fantasma: os
   ponteiros do segundo relógio, tracejados, na hora que o outro acha que é. Legível pequeno: sim,
   dois mostradores lado a lado; o ícone fica com os dois círculos e os ponteiros. Variante com
   história: os dois relógios de pêndulo na mesma viga de Huygens (1665), que sincronizam em
   oposição de fase pela vibração da viga, a primeira sincronização descrita cientificamente;
   fantasma: o pêndulo do segundo relógio na posição espelhada. Cuidado: o cabeçalho do artigo usa
   um reloginho para o tempo de leitura (`traco`); é outro contexto e outro tamanho, mas é bom ver
   os dois juntos antes de fechar.
2. **Torre de telégrafo óptico de Chappe.** Cada estação repete o sinal da anterior para a seguinte
   (10 a 15 km, uma luneta para cada lado), e o operador seguinte confere cada sinal antes de
   repassar: a primeira rede de retransmissão, 1794. Fantasma: a próxima torre, pequena, no horizonte, repetindo
   os braços. Legível pequeno: sim, a torre com o regulador e os dois indicadores em cima; mas é
   parente do semáforo de ferrovia da tag Concorrência (poste com um braço): o desenho precisa
   mostrar a torre inteira, não só os braços. Também é candidata de Integração e Eventos: só um dos
   dois pode levar.
3. **Talha (moitão com cabos).** A carga repartida por várias roldanas e cabos: redundância,
   balanceamento, o cabo que arrebenta e os outros seguram. Fantasma: a carga erguida na posição
   seguinte. Legível pequeno: mais ou menos; duas roldanas e três cabos ainda se leem, mais que isso
   vira emaranhado.

**Cor**

1. `#1c2c51` **azul-marinho** (L 30, tinta clara, 11,3:1). Fato: o azul-marinho é o azul escuro dos
   uniformes de oficiais da Marinha britânica, fixado nas primeiras regras de uniforme de 1748
   (chamado *marine blue* antes de *navy blue*). E o cronômetro de marinha de Harrison (H4, anos
   1760) resolveu a longitude carregando a hora do porto de partida para comparar com o meio-dia
   local: cada hora de diferença são 15 graus; um relógio de referência e um relógio local, o
   problema de sincronia de relógios antes de haver rede. Junto com os dois relógios do desenho, é
   a cor com mais história da paleta. Na estante: 0,074 com a púrpura de Arq. Corporativa, 0,083
   com o preto de Testes, 0,16 com o azul-ardósia.
2. `#59758d` **azul-aço** (L 55, tinta clara, 3,95:1, alerta). Fato de material: ponteiros e
   parafusos de relógio são azulados pelo calor (290–300 °C), uma camada de óxido que protege e
   tempera o aço, tradição de cinco séculos (os ponteiros Breguet). Mas o aço azulado de verdade é
   escuro; este foi clareado para não colar no azul-ardósia, e fica com a ligação enfraquecida. Na
   estante: 0,067 com o verde-cédula. Serve se o Cesar preferir a Arq. Corporativa de azul-marinho
   (aí os dois trocam de lugar).
3. `#5f3f31` **mogno** (L 40, tinta clara, 7,7:1). A madeira da caixa do cronômetro. Associação;
   e cola no tijolo (0,056): não recomendo.

### Integração e Eventos

**Desenho**

1. **Central telefônica manual (mesa com jaques e cordões).** A telefonista liga quem chama a quem
   atende: o contrato entre quem envia e quem recebe, o broker, o roteamento por nome. A primeira
   central comercial é de 1878 (New Haven, 21 assinantes, cordões de plugue nos jaques). Fantasma: o
   cordão que ainda vai ser plugado, tracejado, do jaque de quem chama ao de quem recebe. Legível
   pequeno: médio; o ícone fica com o painel, duas fileiras de jaques e dois cordões. Não tem
   colisão com tag.
2. **Torre de telégrafo de Chappe.** O mesmo objeto do item 2 de Sistemas Distribuídos, lido como
   mensagem que atravessa estações. Para Integração a mensagem é o assunto; para Distribuídos, a
   falha entre estações. Fica com o livro que existir na sugestão escolhida; se os dois existirem,
   Distribuídos leva os relógios e Integração pode levar a torre.
3. **Sino com a corda (sino de bordo ou de torre).** Toca uma vez e todo mundo que está ouvindo
   reage: o evento publicado, o fan-out. Fantasma: as ondas do som, três arcos tracejados. Legível
   pequeno: muito. O risco é parecer o ícone de notificação de interface, que o briefing proíbe; a
   corda, o badalo e a hachura do bronze tiram esse ar, mas o Cesar precisa ver antes.

Descartado: corneta de postilhão (anuncia a chegada, legível, mas parece megafone pequena) e chave
de telégrafo Morse (a ideia do editor: é o emissor, não a integração; e com 40px vira um grampeador).

**Cor**

1. `#72aba5` **verde-água de isolador** (L 70, tinta escura, 5,9:1; alerta no quadradinho do chip,
   como o ocre). Fato: os isoladores de vidro das linhas de telégrafo e de telefone (desde os anos
   1850; Hemingray, Muncie, 1900–1930) saíam verde-água por causa do ferro da areia, porque ninguém
   gastava para descolorir um objeto utilitário; "aqua" é a cor padrão do vidro de telégrafo. É o
   vidro que segura o fio que liga as estações. Na estante: 0,067 com a Nuvem, 0,070 com o
   cinza-pedra.
2. `#517e7b` **verde-água escuro** (L 56, tinta clara, 3,7:1, alerta). O mesmo vidro, mais fechado
   (os isoladores "Hemingray blue"). Só serve se Pagamentos não for verde-cédula: os dois ficam a
   0,025.
3. `#e2b84a` **amarelo-postal** (L 80). Associação com a corneta de postilhão e com os correios
   europeus; não conferi a história aqui, e de qualquer jeito falha no chip (3,78:1) e senta ao
   lado do ocre do SRE. Descartada.

### Pagamentos / Fintech

**Desenho**

1. **Caixa registradora mecânica.** Registra cada venda, guarda o dinheiro, imprime o comprovante e
   toca o sino; foi inventada em 1879 por um dono de bar de Dayton que suspeitava dos empregados ("o
   caixa incorruptível", patente 221.360): nasceu contra a fraude e para fechar o caixa no fim do
   dia, que é conciliação. É o livro inteiro (ledger, comprovante, custódia, fraude) num objeto só.
   Fantasma: a gaveta aberta, ou o comprovante saindo, tracejado. Legível pequeno: sim; o ícone
   fica com o corpo, as teclas e a gaveta. É o nome usado como exemplo no `manual-desenho.md`, por
   coincidência; não há conflito.
2. **Ábaco.** O instrumento de contar e conferir, legível em qualquer tamanho (a moldura e as
   fileiras de contas). Fantasma: as contas da próxima linha na posição seguinte. É também candidato
   de Fundamentos de Computação; só um leva.
3. **Máquina de somar de manivela com fita de papel** (a ideia do editor). A fita é a trilha do
   ledger; a manivela, o lançamento. Fantasma: a fita com o total saindo. Legível pequeno: médio,
   uma caixa com teclas, manivela e fita; parece máquina de escrever se o traço não cuidar da fita.

Descartados: balança (tag Trade-offs), pilha de moedas (tag Pagamentos), cofre (lê-se como
segurança), cunho de moeda (não se reconhece pequeno).

**Cor**

1. `#527c6a` **verde-cédula** (L 55, tinta clara, 3,9:1, alerta "só texto grande"). Fato: as
   cédulas dos EUA levam o verso verde desde 1861 (os *greenbacks*), escolhido contra a falsificação
   por fotografia, que só via preto e branco; na padronização de 1929 o governo manteve o verde por
   ser "abundante, durável e associado ao crédito forte e estável do governo", segundo o Bureau of
   Engraving and Printing. Reforço do ofício: o papel de razão e as folhas de lançamento contábil
   são verdes ("Eye-Ease", pelo menos desde 1951) e o contador usava viseira verde; isso é tradição de
   fabricante, sem estudo por trás, e está dito como tal. Na estante: 0,072 com a oliva, 0,16 com
   o verde-pátina.
2. `#243f2a` **verde-garrafa** (L 34, tinta clara, 9,5:1). O mesmo fundamento, no tom da tinta
   verde-preta do verso das cédulas. Cola no preto de Testes (0,050) e no verde-pátina (0,055):
   só se Testes mudar de cor.
3. `#9a5d3b` **cobre** (L 54, tinta clara, 4,3:1). O metal das moedas; associação. Fica a 0,063 do
   couro e a 0,067 do rosa: no limite.

### Testes e Qualidade

**Desenho**

1. **Fio de prumo contra a parede.** O instrumento mais antigo de conferir (Egito, dinastia III em
   diante): não mede, compara com a referência que não falha, a gravidade. Fantasma: a vertical
   verdadeira tracejada ao lado da parede que saiu do prumo: o teste que mostra o desvio. Legível
   pequeno: sim, um peso pontudo pendurado num fio.
2. **Nível de bolha** (a ideia do editor; inventado por Thévenot antes de 1661). A bolha no meio diz
   que está certo. Fantasma: a bolha deslocada, onde ela estaria se a peça estivesse torta.
   Legível pequeno: sim, uma barra com a janelinha.
3. **Esquadro de carpinteiro encostado na peça.** Confere o ângulo; o fantasma é a fresta entre o
   esquadro e a peça (o que está fora). Legível pequeno: sim, um L.

Pensados e deixados de lado: pedra de toque (dá a cor, mas desenhada é uma laje preta com um
risco), calibrador passa/não-passa (é o "teste" mais puro, mas não se reconhece pequeno),
micrômetro (colide com o paquímetro), lupa (ícone da busca no `traco`), diapasão (bonito, mas
ninguém lê "teste" nele).

**Cor**

1. `#383532` **pedra de toque** (L 33, tinta clara, 10:1). Fato: a pedra de toque é uma pedra
   preta de grão fino (lidita, "pedra lídia", ou ardósia negra) em que se risca o ouro e se compara o
   risco com o das agulhas de toque de pureza conhecida; usada no vale do Indo (2600–1900 a.C.), na
   Grécia e pelos lídios da primeira cunhagem; o ácido só entrou no século XIX. "Pedra de toque" é
   literalmente "o teste". Um quase preto quente, único na estante. Na estante: 0,069 com o
   verde-pátina, 0,079 com a púrpura, 0,083 com o azul-marinho.
2. `#646a70` **cinza-aço** (L 52, tinta clara, 4,5:1, alerta). O aço do esquadro e do calibrador;
   associação. Fica a 0,062 do verde-cédula e a 0,073 do azul-ardósia: abaixo do piso.
3. Não há terceira que valha: azul de giz de carpinteiro (o giz da linha é azul) cai em cima do
   azul-ardósia, e o amarelo-esverdeado do líquido dos níveis modernos é cor de interface.

### Nuvem (AWS, serviços gerenciados, redes, custos)

**Desenho**

1. **Torre de caixa d'água.** O serviço de utilidade: a água chega pelo cano, você paga o que usa
   e a torre é de outro. É a imagem com que a computação em nuvem foi anunciada antes de existir:
   "a computação pode um dia ser organizada como um serviço público, como o sistema telefônico;
   cada assinante paga só pela capacidade que usa" (John McCarthy, centenário do MIT, 1961). Fantasma:
   o cano tracejado da torre até a casa, ou o nível da água dentro do tanque. Legível pequeno: sim,
   o tanque sobre as pernas.
2. **Cata-vento com os pontos cardeais.** O céu e a direção do vento: a região, a zona, o que a
   nuvem faz sem você ver. Fantasma: a seta do vento ou a posição seguinte do galo. Legível pequeno:
   muito. Associação mais fraca com "serviços gerenciados" do que a torre.
3. **Barômetro aneroide** (a ideia do editor). O instrumento do céu. Fantasma: o ponteiro indo para
   "chuva". Legível pequeno: é um mostrador redondo e colide com os relógios de Sistemas
   Distribuídos; só se Distribuídos não levar os relógios.

Descartados: nuvem (ícone da tag AWS), balão (não é instrumento).

**Cor**

1. `#89a4c7` **azul-celeste** (L 71, tinta escura, 6:1; alerta no quadradinho do chip, como o
   ocre). Associação com o céu, dita como tal. O que há de fato é o nome: o azul cerúleo (estanato
   de cobalto, à venda para pintores desde cerca de 1860) vem do latim *caeruleus*, de *caelum*, céu,
   e foi o azul dos céus dos impressionistas. Na estante: 0,067 com o verde-água, 0,080 com o
   cinza-pedra, 0,25 com o azul-ardósia. Uma versão mais clara (`#99b1ca`) falha no chip do tema
   claro (4,3:1): este é o limite.
2. `#9ea6ab` **cinza-zinco** (L 72, tinta escura, 6,2:1). O aço galvanizado da caixa d'água; fato
   de material, mas colide com o cinza-pedra de Fundamentos (0,037). Só se Fundamentos não entrar.
3. Não há terceira sem cair em outro azul: o azul-petróleo (`#2f5a66`) fica a 0,041 do azul-ardósia.

### Fundamentos de Computação

**Desenho**

1. **Régua de cálculo** (a ideia do editor). O instrumento de calcular de antes do computador:
   logaritmos de Napier (1614), escalas de Gunter, duas escalas deslizantes de Oughtred (1622), em
   uso em todo projeto de engenharia até a HP-35 (1972) aposentá-la em um ano. É "a base eterna" com
   data de validade, o que é honesto. Fantasma: o cursor de vidro na posição seguinte, ou a régua
   do meio puxada. Legível pequeno: médio; é uma barra comprida e fina, e na lombada ela fica
   deitada no ícone girado; o traço precisa de corpo, régua do meio e cursor bem marcados.
2. **Ábaco.** Legível em qualquer tamanho; é também candidato de Pagamentos. Se Pagamentos levar a
   caixa registradora, o ábaco pode vir para cá.
3. **Alavanca sobre o fulcro erguendo uma pedra.** A máquina mais simples, Arquimedes, o fundamento
   de todas as outras. Fantasma: o arco que a pedra vai percorrer. Legível pequeno: sim, uma barra
   sobre um triângulo e um bloco.

Descartados: ampulheta (ícone de espera), engrenagem (ícone de configurações), diapasão.

**Cor**

1. `#a69d91` **cinza-pedra** (L 70, tinta escura, 5,7:1; alerta no quadradinho do chip). Associação:
   a pedra fundamental, "a primeira pedra assentada numa fundação de alvenaria; todas as outras são
   postas em referência a ela", e por isso virou cerimônia (a do Capitólio, 1793). Um cinza quente de
   granito. Na estante: 0,070 com o verde-água, 0,080 com o celeste, 0,091 com o ocre.
2. `#3e4348` **cinza-lousa** (L 38, tinta clara, 8,2:1). A ardósia do quadro-negro, onde os
   fundamentos são ensinados (a lousa é inclusive o nome dos diagramas do blog). Colide com o
   verde-pátina (0,035) e com o preto de Testes (0,052). O verde-lousa dos quadros de 1930–1960 cai
   entre o verde-pátina e a oliva (0,037 do verde-pátina, pela mesma conta). Descartadas.
3. `#dccda6` **marfim de régua** (L 85). A celuloide marfim das réguas de cálculo (e o amarelo
   "Eye-Saver" da Pickett, uma alegação de marketing da própria fábrica). Falha no chip (3,3:1) e fica
   do lado do ocre. Descartada.

### Frontend e Web

O editor deixa este livro fora de todas as sugestões (o blog não escreve sobre isso). Fica aqui o
material, caso entre.

**Desenho**

1. **Tear de mão com o tecido em andamento.** "Web" é, na origem, tecido tramado: do inglês antigo
   *webb*, "tecido, obra tecida", da mesma raiz de *weave*. A urdidura é a estrutura, a trama é o
   conteúdo, e a página é o pano que o usuário vê. Fantasma: a lançadeira atravessando, ou a próxima
   passada da trama. Legível pequeno: médio; o ícone fica com a moldura e poucos fios.
2. **Componedor com tipos e a caixa de tipos.** A tipografia e a montagem da página. Fantasma: o
   tipo seguinte entrando no componedor. Legível pequeno: fraco (uma régua com blocos miúdos); o
   ícone teria de ser só o componedor.
3. **Lanterna mágica.** O projetor de antes do cinema: o que aparece na tela sem ser a tela.
   Fantasma: o feixe tracejado até a imagem projetada. Legível pequeno: sim, caixa, chaminé e lente.

Descartados: vitrine (não é instrumento), régua T (vizinha do compasso de Carreira), monitor (tela).

**Cor**

1. `#9c666e` **rosa-garança** (L 57, tinta clara, 3,8:1, alerta "só texto grande"). Fato: a
   garança (*Rubia tinctorum*) é o vermelho vegetal dos tecidos desde a Antiguidade (lã, algodão,
   seda, com mordente de alúmen; o "vermelho-turco" de vinte etapas); a calça *garance* do exército
   francês, de 1829 a 1914, foi adotada para sustentar a indústria de garança de Avignon. A cor do
   tecelão, empoeirada. Na estante: 0,071 com o couro, 0,067 com o cobre se ele entrar.
2. `#2b3259` **índigo** (L 33, tinta clara, 10:1). O azul dos tecidos e do brim. Colide com o
   azul-marinho de Distribuídos (0,033) e com a púrpura (0,043). Só se os dois não existirem.
3. `#cbbfa0` **linho cru** (L 81). O tecido sem tingir. Falha no chip (3,7:1). Descartada.

### Arquitetura Corporativa / Estratégia técnica

**Desenho**

1. **Sextante.** Mede o ângulo do sol com o horizonte e dá a latitude: é com ele que se traça o
   rumo do navio inteiro, não o de uma rua (Hadley, 1731; o sextante de 120° a partir de 1757). A
   governança e a estratégia são o rumo. Fantasma: o raio tracejado do sol até o espelho. Legível
   pequeno: sim, um setor de círculo com o braço; não se confunde com o compasso de Carreira (um V
   aberto) nem com nenhuma tag.
2. **Luneta de capitão.** Ver longe: o radar de tecnologia, a dívida que vem. Fantasma: o cone do
   campo de visão. Legível pequeno: sim, um tubo cônico; cuidado para não virar garrafa.
3. **Teodolito.** Levantar o terreno inteiro antes de construir: times, custos, governança.
   Fantasma: a linha de visada até a baliza. Legível pequeno: médio, um tripé com a luneta em cima.

Pensado e deixado de lado: bússola (boa para "rumo", mas em inglês é *compass*, como o compasso de
Carreira), peça de xadrez (é objeto, não instrumento, e vira clipe de "estratégia"), ampulheta.

**Cor**

1. `#43345c` **púrpura-tíria** (L 36, tinta clara, 9,1:1). Fato (convenção): a púrpura de Tiro,
   tirada de milhares de múrices por grama, custava mais que o ouro e foi reservada por leis
   suntuárias aos magistrados (a faixa púrpura do senador, a toga do triunfo) e, no século IV, só ao
   imperador; em Bizâncio os herdeiros nasciam "na púrpura". É a cor da autoridade e do governo, e
   governança é o assunto. Na estante: 0,074 com o azul-marinho, 0,077 com a ameixa de Dados (um
   roxo mais claro e mais rosado), 0,079 com o preto de Testes.
2. `#1e2c4e` **azul-marinho** (L 30, tinta clara, 11,3:1). O rumo, a Marinha, o sextante. Só
   funciona se Sistemas Distribuídos levar o azul-aço em vez do marinho; nessa troca a estante fica
   com quatro azuis (celeste, aço, ardósia, marinho), todos acima do piso (0,067 e 0,078 os pares
   mais próximos), mas é azul demais numa estante de dezesseis.
3. `#5f3f31` **mogno** (L 40, tinta clara, 7,7:1). A mesa da diretoria; associação, e cola no
   tijolo (0,056). Descartada. O cáqui (`#8d8764`) falha na tinta (3:1) e cola no couro (0,047).

## Colisões entre assuntos (resumo)

- **Ábaco:** Pagamentos (2ª escolha) e Fundamentos (2ª escolha). Um só.
- **Torre de Chappe:** Sistemas Distribuídos (2ª) e Integração (2ª). Um só; e cuidado com o semáforo
  da tag Concorrência.
- **Relógios × barômetro:** os dois são mostradores redondos; se Distribuídos levar os relógios, a
  Nuvem não leva o barômetro (a torre d'água é a primeira escolha de qualquer jeito).
- **Sextante/bússola × compasso:** o sextante não se confunde com o compasso de Carreira; a bússola,
  pelo nome em inglês, é melhor evitar.
- **Tear:** Frontend (1ª) e um eventual livro de Spring (Jacquard). Um só.
- **Paquímetro × instrumentos de Testes:** Testes não leva instrumento de medir.
- **Azul-marinho:** Distribuídos (1ª) ou Arq. Corporativa (2ª), nunca os dois. **Índigo** (Frontend)
  não cabe junto com o marinho nem com a púrpura. **Cinza-zinco** (Nuvem) não cabe junto com o
  cinza-pedra. **Verde-garrafa** (Pagamentos) não cabe junto com o preto de Testes.

## Como refazer a conferência

```bash
node scripts/livros/conferir-cores.mjs \
  "#2d4b46:Arquitetura" "#7a4430:Desenvolvimento" "#5f4662:Dados" "#6e2f45:IA" \
  "#606a37:Segurança" "#465976:DevOps" "#c4a050:SRE" "#9a7650:Carreira" \
  "#527c6a:Pagamentos" "#72aba5:Integração" "#1c2c51:Distribuídos" "#89a4c7:Nuvem" \
  "#a69d91:Fundamentos" "#383532:Testes" "#9c666e:Frontend" "#43345c:Corporativa"
```

O script mostra só os cinco pares mais próximos; os outros ΔE citados aqui foram calculados com a
mesma função `oklab` do script, para todos os pares. As cores foram definidas em OKLCh (L, C, h) e
convertidas com a conversão inversa do `cores.js`, para controlar luminosidade e croma de cada uma
em relação às oito de hoje.

## Fontes

Conferidas pelos trechos devolvidos pela busca (os sites estão bloqueados pelo proxy da sessão).

Cores de hoje
- Pátina do cobre: American Chemical Society, "Statue of Liberty: a patina 20 years in the making",
  <https://www.acs.org/content/dam/acsorg/pressroom/reactions/infographics/statue-of-liberty-became-green.pdf>;
  Copper Development Association, <https://copper.org/education/liberty/liberty_reclothed1.php>;
  tempo de pátina em telhados, <https://bakerroofing.com/when-does-copper-patina/>.
- Tijolo (hematita): "Some notes on the firing colour of clay bricks",
  <https://www.sciencedirect.com/science/article/pii/016913178790007X>; patente US 5562765 (teor de
  ferro e cor), <https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/5562765>.
- Zarcão/minium: CAMEO (MFA Boston), <https://cameo.mfa.org/wiki/Red_lead>; Wikipedia,
  <https://en.wikipedia.org/wiki/Lead(II,IV)_oxide>; etimologia e uso em pt,
  <https://www.infopedia.pt/dicionarios/lingua-portuguesa/zarc%C3%B5es>,
  <https://www.resolquimica.com.br/blog/zarcao-o-que-e-para-que-serve-e-como-aplicar-este-primer-tradicional/>.
- Cópias roxas do mimeógrafo a álcool: Wikipedia, <https://en.wikipedia.org/wiki/Spirit_duplicator>;
  <https://www.desiquintans.com/dittomachine>.
- Autômato Escritor: Wikipedia, <https://en.wikipedia.org/wiki/Jaquet-Droz_automata>; Linda Hall
  Library, <https://www.lindahall.org/about/news/scientist-of-the-day/pierre-jaquet-droz/>; a réplica
  de 1997 e a roupa, <https://lacotedesmontres.com/Enchere-No_16304.htm>.
- Marroquim e couro de bezerro nas encadernações: Wikipedia, <https://en.wikipedia.org/wiki/Morocco_leather>;
  Bauman Rare Books, <https://www.baumanrarebooks.com/blog/the-secret-language-of-rare-books-morocco/>;
  AbeBooks, <https://www.abebooks.com/books/rarebooks/collecting-guide/understanding-rare-books/understanding-bindings.shtml>.
- Verde-oliva: Wikipedia, <https://en.wikipedia.org/wiki/Olive_(color)>,
  <https://en.wikipedia.org/wiki/United_States_Army_uniforms_in_World_War_II>; Exército Brasileiro,
  <https://3bpe.eb.mil.br/index.php/111/423-a-farda-verde-oliva-2>,
  <https://eblog.eb.mil.br/en/w/a-alma-da-farda-o-que-representa-o-uniforme-para-o-militar-brasileiro>.
- Colarinho azul: Wikipedia, <https://en.wikipedia.org/wiki/Blue-collar_worker>; The Conversation,
  <https://theconversation.com/fashioning-blue-collars-chambray-shirts-and-indigo-dyed-workwear-24603>;
  Wiktionary, <https://en.wiktionary.org/wiki/blue-collar>.
- Ocre amarelo: ColourLex, <https://colourlex.com/project/yellow-ochre/>; Discover,
  <https://www.discovermagazine.com/prehistoric-use-of-ochre-can-tell-us-about-the-evolution-of-humans-1775>;
  Wikipedia, <https://en.wikipedia.org/wiki/Ochre>.
- Amarelo = cautela: ANSI Z535.1, <https://www.safetysign.com/what-is-ansiz5351>,
  <https://www.seton.com/ansi-z535-safety-sign-standards>; âmbar nos semáforos, Wikipedia,
  <https://en.wikipedia.org/wiki/Traffic_light>.

Cores novas
- Cédulas verdes: History, <https://www.history.com/articles/why-is-american-currency-green>;
  The Conversation, <https://theconversation.com/why-are-dollar-bills-green-121394>; Mental Floss,
  <https://www.mentalfloss.com/history/government-politics/why-us-currency-green>.
- Papel de razão verde e viseira: National "Eye-Ease" (1951),
  <https://www.ebay.com/itm/275269302696>; Office Depot (papel colunar verde antirreflexo),
  <https://www.officedepot.com/b/columnar-pads/Product_Type--Ledger_Sheet/N-516223>; viseira verde,
  Wikipedia, <https://en.wikipedia.org/wiki/Green_eyeshade>.
- Isoladores de vidro verde-água: Collectors Weekly (entrevista com Ian Macky),
  <https://www.collectorsweekly.com/articles/an-interview-with-antique-glass-insulator-collector-ian-macky/>;
  <https://www.hemingray.net/articles/hemingray-blue/>; <https://glassbottlemarks.com/hemingray-glass-company/>.
- Azul-marinho: Wikipedia, <https://en.wikipedia.org/wiki/Navy_blue>; National Portrait Gallery,
  <https://www.npg.org.uk/collections/explore/an-officer-and-a-gentleman-naval-uniform-and-male-fashion-in-the-eighteenth-century>.
- Cronômetro de marinha e longitude: Wikipedia, <https://en.wikipedia.org/wiki/Marine_chronometer>,
  <https://en.wikipedia.org/wiki/John_Harrison>; USNI,
  <https://www.usni.org/magazines/naval-history-magazine/2019/october/john-harrison-and-longitude-problem>.
- Aço azulado dos ponteiros: <https://www.the1916company.com/blog/what-is-heat-bluing.html>;
  <https://watchesbysjx.com/2015/02/explained-how-to-blue-steel-screws-the-traditional-way-with-a-flame-and-lots-of-patience.html>.
- Pedra de toque: Britannica, <https://www.britannica.com/technology/touchstone-metallurgy>;
  Wikipedia, <https://en.wikipedia.org/wiki/Touchstone_(assaying_tool)>;
  <https://www.vandijk-toetsstenen.nl/en/cms/the-natural-touchstone/>.
- Garança: Wikipedia, <https://en.wikipedia.org/wiki/Rubia_tinctorum>,
  <https://en.wikipedia.org/wiki/Pantalon_rouge>; <https://blog.imagesmusicales.be/the-battle-of-the-red-pants/>.
- "Web" = tecido: Etymonline, <https://www.etymonline.com/word/web>; Wiktionary,
  <https://en.wiktionary.org/wiki/web>.
- Púrpura de Tiro: Wikipedia, <https://en.wikipedia.org/wiki/Tyrian_purple>,
  <https://en.wikipedia.org/wiki/Born_in_the_purple>;
  <https://www.ancient-origins.net/history-ancient-traditions/only-roman-elite-could-wear-tyrian-purple-keep-peasants-their-place-021060>.
- Azul cerúleo: ColourLex, <https://colourlex.com/project/cerulean-blue/>; WebExhibits,
  <https://www.webexhibits.org/pigments/indiv/overview/ceruleanblue.html>; Wikipedia,
  <https://en.wikipedia.org/wiki/Cerulean>.
- Pedra fundamental: Wikipedia, <https://en.wikipedia.org/wiki/Cornerstone>,
  <https://en.wikipedia.org/wiki/United_States_Capitol_cornerstone_laying>.
- Quadro verde (1930–1960): Mental Floss, <https://www.mentalfloss.com/article/504699/why-are-so-many-blackboards-green>;
  Harvard Ed. Magazine, <https://www.gse.harvard.edu/news/ed/17/08/tools-chalk>.
- Amarelo "Eye-Saver" da Pickett: <https://www.sliderule.ca/pickett.htm>;
  <https://sliderulemuseum.com/Pickett.shtml>.

Desenhos
- Relógios de Huygens (1665): <https://phys.org/news/2016-03-huygens-pendulum-synchronization.html>;
  "Huygens' clocks revisited", Royal Society Open Science,
  <https://royalsocietypublishing.org/rsos/article/4/9/170777/93669/Huygens-clocks-revisitedHuygens-Clocks-Revisited>.
- Telégrafo de Chappe (braços pretos, distâncias, 1794): Wikipedia,
  <https://en.wikipedia.org/wiki/Chappe_telegraph>; ETHW, <https://ethw.org/Telegraph>;
  <https://shannonselin.com/2020/05/chappe-semaphore-telegraph/>.
- Central telefônica (New Haven, 1878): Wikipedia, <https://en.wikipedia.org/wiki/Telephone_switchboard>,
  <https://en.wikipedia.org/wiki/George_Willard_Coy>; History,
  <https://www.history.com/articles/rise-fall-telephone-switchboard-operators>.
- Caixa registradora de Ritty (1879): Wikipedia, <https://en.wikipedia.org/wiki/James_Ritty>,
  <https://en.wikipedia.org/wiki/Cash_register>; <https://www.sparkmuseum.org/to-catch-a-thief/>;
  <https://www.retailbrew.com/stories/2022/05/20/tools-of-the-trade-how-an-ohio-saloonkeeper-came-up-with-the-cash-register>.
- Prumo e nível de bolha: Wikipedia, <https://en.wikipedia.org/wiki/Plumb_bob>,
  <https://en.wikipedia.org/wiki/Spirit_level>, <https://en.wikipedia.org/wiki/Melchis%C3%A9dech_Th%C3%A9venot>;
  <https://www.johnsonlevel.com/News/HistoryoftheLevelHowtheBu>.
- Computação como serviço público (McCarthy, 1961): MIT Technology Review,
  <https://www.technologyreview.com/2011/10/03/190237/the-cloud-imperative/>; Arcitura,
  <https://patterns.arcitura.com/cloud-computing-patterns/basics/origins-and-influences/a_brief_history>.
- Régua de cálculo (1622–1972): MacTutor, <https://mathshistory.st-andrews.ac.uk/SH/oughtred_sh.pdf>;
  Whipple Museum, <https://www.whipplemuseum.cam.ac.uk/explore-whipple-collections/calculating-devices/slide-rules>;
  ETHW (HP-35), <https://ethw.org/Milestones:Development_of_the_HP-35,_the_First_Handheld_Scientific_Calculator,_1972>.
- Sextante (Hadley, 1731): Linda Hall Library, <https://www.lindahall.org/about/news/scientist-of-the-day/john-hadley/>;
  Britannica, <https://www.britannica.com/technology/octant>; USNI,
  <https://www.usni.org/magazines/proceedings/1936/november/evolution-sextant>.
