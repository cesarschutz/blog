# Direção de arte da coleção de 13

Para quem vai desenhar os 13 livros (etapa 5 do `controle.md`) e para a crítica (etapa 4). Define o
princípio do conjunto, o objeto e a composição de cada livro, o ícone da lombada, as 13 cores com o
motivo e a conferência. Não desenha os SVGs: diz o que desenhar com precisão suficiente para a caneta
de `scripts/desenho/livros.mjs` (linhas, arcos, elipses, curvas, retângulos, hachura, chão e um único
fantasma tracejado; manual em `../manual-desenho.md`).

Como ler: **fato** é o que foi conferido numa fonte (lista no fim; a pesquisa anterior,
`../pesquisa-cores-e-desenhos.md`, é citada como "pesquisa" onde ela já tinha conferido).
**Associação** é uma ligação sem história por trás, e está dita quando é só isso. Datas e nomes sem
fonte não entram. A foto da paleta montada na ordem da estante está em `.render/colecoes/paleta-final.png`.

## 1. O princípio do conjunto

### As três ideias

1. **Os instrumentos de latão do gabinete científico** (sextante, barômetro, cronômetro, teodolito,
   balança, galvanômetro, microscópio). Visualmente é a família mais coesa que existe: latão, vidro,
   madeira, mostradores. Mas as histórias são de medir a natureza, não de fazer um trabalho; metade
   dos objetos é um mostrador redondo (sextante, barômetro, cronômetro, galvanômetro), e na lombada
   quatro círculos lado a lado se confundem; e a balança e a lupa já são ícones de tag.
2. **O navio e o porto** (sextante, cronômetro, farol, guindaste, sino, barra, telégrafo de
   máquinas, bandeiras). É o mundo em que a coleção de hoje já pisa com um pé (guindaste e farol) e o
   clichê de todo blog com Kubernetes (barco, leme, âncora, contêiner); o leme e a âncora já são
   tags; e precisa de céu e de mar, o que quebra a escala (um farol ao lado de um sextante).
3. **O mesmo problema, um século antes.** Cada livro leva a máquina ou o instrumento que fazia, com
   ferro, latão, mola e papel, o trabalho que o livro faz com software, antes de existir computador:
   registrar cada venda, provar que ninguém mexeu, acertar dois relógios, ligar quem chama a quem
   atende, contar sessenta milhões de fichas, manter a máquina na rotação certa. Todos os objetos
   vêm de um mesmo mundo, a sala de trabalho (a oficina, o escritório, o balcão, a sala de
   máquinas) entre o relógio de pêndulo de Huygens (1657) e o cartão perfurado de Hollerith (1890):
   a era em que o trabalho humano começou a ser feito por mecanismo.

**Vence a 3.** É a única em que cada objeto tem uma data, um inventor e um motivo, e o motivo é o
problema do livro, não uma metáfora; o mundo é um só (dentro de uma sala, materiais de uma época),
o que dá uma gramática de desenho comum (bastidores de ferro fundido, peças de latão, bases de
madeira, papel) sem obrigar a desenhar coisas parecidas; a escala é a de uma sala (nada precisa de
céu, de mar ou de rua, o que tira o farol e o guindaste); e o tipo de história é sempre o mesmo: a
máquina no instante em que faz o seu trabalho, que é o que o fantasma tracejado mostra. Os dois
exemplos que o Cesar deu, a caixa registradora de 1879 e os relógios de Huygens, são exatamente
esse tipo de objeto: o princípio foi tirado deles.

### As regras do mundo (valem para os 13)

- **Dentro de uma sala.** Nenhum objeto precisa de céu, mar, rua ou horizonte. O chão é a bancada,
  a mesa, o piso da oficina. Saem: farol, guindaste, torre de Chappe, caixa d'água, eclusa.
- **A era do mecanismo, 1657–1890.** Ferro fundido, latão, madeira, vidro, papel, cordão. Nada de
  plástico, eletrônica, tela ou logotipo. A mais antiga é a observação de Huygens (1665); a mais nova,
  o tabulador de Hollerith (1890). O fio de prumo é a única exceção, por ser anterior a tudo (e
  estar em toda oficina dessa era), e está justificado no livro 13.
- **Uma data, um inventor, um motivo.** A ficha de cada livro conta a história com fonte. A frase e o
  texto da capa (etapa 3) podem usar essa história.
- **Mesmo ponto de vista.** Vista de 3/4 pela frente-direita (a frente plana, o fundo fugindo para
  cima e para a direita, como a caixa registradora e a gaveta de fichas), olho um pouco acima do
  objeto, luz do alto à esquerda (hachura nas faces da direita e de baixo), o objeto apoiado numa
  linha de chão com a faixa de sombra (`chao`). Objetos que são de parede (a fechadura) ficam de
  frente, com uma leve fuga.
- **Mesma escala na capa.** O objeto ocupa a área toda (x 36–444, y 384–678): a caixa do desenho
  tem de 70% a 100% da largura e de 80% a 100% da altura da área. Nada fino demais: a capa aparece
  com 150 a 270px de largura e o ícone com uns 30px.
- **Mesmo tipo de fantasma.** O único elemento tracejado é sempre a máquina no instante em que faz
  o seu trabalho: a gaveta que salta, o cartão que cai, a cápsula que voa, a folha que sai, a
  alavanca que sobe. Nunca uma seta, uma onda sonora ou uma legenda.
- **Mesma hierarquia de traço.** Contorno em w1, peças e detalhes em w2, o bem fino em w3; hachura
  só nas faces na sombra e numa faixa estreita de sombra no chão; pontos cheios em pinos, eixos e
  furos, poucos. `papel: true` em toda forma fechada que tapa o que está atrás.
- **O ícone é a mesma geometria reduzida** (a ferramenta faz isso): por isso cada ficha diz quais
  traços levam `icone: false` (detalhe que vira sujeira a 30px) e quais levam `icone: true` (um traço
  fino que faz falta na silhueta). O ícone tem de ler como uma silhueta: um contorno forte, de duas a
  quatro partes grandes, nada de grade densa.

### O que fica da rodada anterior e por quê

Quatro dos cinco desenhos novos da rodada anterior cabem no princípio melhor do que qualquer
alternativa e **ficam**: a **caixa registradora** (Pagamentos: é o exemplo do Cesar e o caso mais
puro de "o mesmo problema um século antes"), a **mesa telefônica** (Integração: 1878, dentro do
escritório, e a lâmpada que acende quando alguém tira o fone do gancho é o evento), os **relógios de
Huygens** (Sistemas Distribuídos: a primeira data do mundo da coleção, e a alternativa com história,
o aparelho de tabuleta de Tyer, ninguém reconhece) e o **fio de prumo** (Testes: as alternativas da
época, o nível de bolha de 1661 e o calibre passa/não-passa, são ou uma barra sem silhueta ou um
objeto que ninguém lê a 30px). O **ábaco** (Fundamentos) **sai**: é de antes das máquinas e não
conta história nenhuma; entra o telégrafo de Morse. Os sete livros de hoje trocam de objeto, como o
Cesar pediu. O motivo de cada um está na ficha.

### O quadro

| Vol. | Livro | Objeto | Data | O trabalho que ele fazia | Cor |
|---|---|---|---|---|---|
| 01 | Arquitetura de Software | prancheta com a planta e a régua-tê | séc. XVII; cópia em cianotipia desde 1870 | decidir no papel o que custa caro desfazer em tijolo | azul-de-cianotipia `#2d4f77` |
| 02 | Dados | tabulador de Hollerith | 1890 | contar 63 milhões de pessoas em cartões, seis meses em vez de sete anos | roxo-de-mimeógrafo `#624a72` |
| 03 | Desenvolvimento de Software | tear de Jacquard com a cadeia de cartões | 1804 | a máquina que lê o programa e faz o trabalho | garança `#82555a` |
| 04 | DevOps | estação de tubo pneumático | 1853 | levar a cápsula intacta do balcão até onde ela é usada, sem ninguém carregar | azul-pneumático `#92a6c2` |
| 05 | Frontend | prensa tipográfica de ferro (Albion) | c. 1820 | fazer a página que o leitor vê | negro-de-fumo `#2a2621` |
| 06 | Fundamentos | telégrafo de Morse: a chave e o registrador | 1844 | o bit, o código, o protocolo e a fita, com tudo à vista | azul-vitríolo `#26626a` |
| 07 | IA | fonógrafo de Edison | 1877 | a máquina que fala com a voz que ouviu | cera-marrom `#5d4128` |
| 08 | Integração e Eventos | mesa telefônica manual | 1878 | ligar quem chama a quem atende; a lâmpada que acende é o evento | verde-água `#71a49d` |
| 09 | Pagamentos | caixa registradora | 1879 | registrar cada venda contra o desvio e fechar o caixa | verde-cédula `#4f6f57` |
| 10 | Segurança | fechadura detectora de Chubb | 1818 | provar que alguém tentou abrir | vermelho-lacre `#7c322b` |
| 11 | Sistemas Distribuídos | os dois relógios de Huygens na mesma viga | 1665 | duas máquinas iguais que só se acertam pelo que as liga | azul-marinho `#202c4d` |
| 12 | SRE | regulador centrífugo de Watt | 1788 | manter a rotação quando a carga muda | latão `#b59353` |
| 13 | Testes | fio de prumo | antes de tudo | conferir contra a referência que não falha | cinza-chumbo `#3e4349` |

## 2. Cada livro

Em cada ficha: o objeto; a história e por que ele representa o livro inteiro; a composição (vista,
proporção, partes, hachura, chão, o fantasma); o que o ícone guarda; os riscos. "Área" é o retângulo
x 36–444, y 384–678 da capa. Proporções em largura × altura da caixa do objeto, como fração da área.

### 01 Arquitetura de Software: a prancheta com a planta e a régua-tê

**História.** A régua-tê é o instrumento do desenhista desde o século XVII (fato: coleção do
Smithsonian); o esquadro passou a ser usado com ela no começo do século XIX. A cópia da planta era
feita à mão por aprendizes ("tracing boys") até a cianotipia de Herschel (1842) ser adotada pelas
salas de desenho a partir da década de 1870: nos anos 1890, um "blueprint" custava um décimo da cópia
traçada à mão, e o processo foi o padrão de reprodução de plantas até os anos 1940 (fatos). O
blueprint não se corrige: muda-se o original e tira-se outra cópia.

**Por que é o livro inteiro.** A arquitetura é o que se decide na prancheta: domínios, limites,
padrões, consistência, o custo de cada escolha (ADRs). Na prancheta, desfazer custa uma linha;
construído, custa uma parede. "As decisões caras de desfazer" se tomam no único lugar em que desfazer
é barato. Serve a todos os posts do livro (microsserviços, overhead × overkill, CronJob × fila,
consistência) e serve igual se um dia o livro absorver arquitetura corporativa.

**Composição.** Vista de 3/4 pela frente-direita, olho acima. Caixa de 0,95 × 0,95 da área. A
mesa de desenho: um tampo (a prancheta) inclinado uns 20° (o lado de cima fugindo para trás), apoiado
num cavalete de madeira (duas pernas em A ligadas por uma travessa; a perna da direita mais à vista).
Na prancheta, a folha presa por quatro percevejos (pontos cheios), com a planta: o contorno externo
em parede dupla, duas paredes internas, uma abertura de porta com o arco do giro da porta (um arco
de 90°, w3). A régua-tê encaixada na borda esquerda da prancheta, a cabeça saindo para fora da borda
e a lâmina atravessando a folha na horizontal (w1); um esquadro de 45° apoiado sobre a lâmina (w2,
`papel: true`). Um rolo de plantas deitado no chão à direita da perna (um cilindro com a tampa, w2).
Hachura: a espessura da prancheta (a face de baixo do tampo), a face interna da perna direita, o lado
direito do rolo. Chão sob as pernas e sob o rolo. **Fantasma:** uma das paredes internas da planta
na posição anterior (tracejada, com pelo menos 70px de comprimento), ao lado da posição nova: a
decisão desfeita onde custou uma linha.

**Ícone.** A prancheta inclinada com a cabeça da régua-tê saindo à esquerda e a lâmina atravessando,
sobre as duas pernas do cavalete; da planta, só o contorno externo (`icone: true` nele; `icone: false`
nas paredes internas, no arco da porta, nos percevejos, no esquadro e no rolo). Silhueta:
paralelogramo inclinado sobre duas pernas, com um T.

**Riscos.** Sem as pernas e sem a cabeça da régua-tê, a prancheta inclinada vira um notebook (tela,
que o briefing proíbe). O fantasma é pequeno em relação ao objeto: a parede tracejada precisa de
comprimento e de distância da posição nova (uns 20px). Não desenhar arco de alvenaria na planta, para
não ecoar a capa de hoje.

### 02 Dados: o tabulador de Hollerith (1890)

**História.** O censo de 1880 dos EUA levou cerca de sete anos para ser apurado; para o de 1890 (63
milhões de pessoas) o Census Office fez um concurso em 1888, e a máquina de Hollerith apurou os dados
de teste em 72,5 horas contra 100,5 e 144,5 dos concorrentes (fatos: Census Bureau, Columbia). Cada
pessoa virou um cartão de papel manilha; a prensa de pinos fechava um circuito através dos furos (um
pino caía num copinho de mercúrio), os mostradores contavam e o separador abria a tampa do
compartimento certo. Hollerith deu ao cartão o tamanho da cédula de um dólar da época (3¼ × 7⅜ pol.)
para poder guardá-lo nas caixas do Tesouro (fato; as fontes divergem sobre o cartão do censo de 1890
ter já esse tamanho ou uma versão mais curta). A contagem de 1890 saiu em seis meses. A empresa de
Hollerith virou, em 1911, a que depois se chamou IBM.

**Por que é o livro inteiro.** O cartão é onde o dado mora (a posição do furo é a coluna: o esquema);
a prensa, os mostradores e o separador são por onde ele anda (ler, agregar, particionar: o pipeline
inteiro). Vale para bancos, modelagem, bloqueio otimista e pessimista, data lake × warehouse, CDC.

**Composição.** 3/4 pela frente-direita. Caixa de 0,95 × 0,95 da área. Um gabinete de carvalho
em forma de escrivaninha: o tampo à altura de uma mesa e, sobre ele, à esquerda e atrás, o painel
vertical dos mostradores. Os mostradores em grade de 4 linhas × 5 colunas (simplificação declarada
dos 40 da máquina), cada um um círculo com um ponteiro (w2; o círculo com `papel: true`). Na mesa, à
direita, a prensa de cartões: a caixa dos pinos levantada uns 35° numa dobradiça (como uma tampa
aberta), com o cabo de madeira na ponta, e um cartão deitado no leito (um retângulo com três fileiras
de furos pequenos em w3). Na ponta direita do tampo, o separador: uma caixa baixa com fileiras de
tampas, uma delas aberta. Hachura: a face direita do gabinete, a sombra sob o tampo, o interior da
tampa aberta do separador, o lado direito da caixa de pinos levantada. Chão sob o gabinete.
**Fantasma:** um cartão tracejado no ar, caindo no compartimento aberto do separador: o dado indo
para a gaveta certa.

**Ícone.** O gabinete com o painel e uma grade de 3 × 4 mostradores grandes (cada um com pelo menos
7% da largura do painel; o ponteiro leva `icone: false`), e a prensa levantada sobre a mesa; o
separador, os furos do cartão e as tampas levam `icone: false`. Silhueta: um bloco alto e largo com
uma aba levantada à direita.

**Riscos.** Painel de círculos ao lado de painel de jaques (a mesa telefônica, 08): não são vizinhos
na estante, mas a 30px os dois viram "caixa com pontinhos". A diferença fica nos cordões da mesa
telefônica e, aqui, nos mostradores grandes e na prensa levantada. O desenhista deve fotografar os
dois ícones lado a lado antes de fechar.

### 03 Desenvolvimento de Software: o tear de Jacquard (1804)

**História.** Jacquard patenteou em 1804 o mecanismo que lê uma cadeia de cartões perfurados, um
cartão por passada da lançadeira: furo levanta o fio, sem furo deixa embaixo; juntou as ideias de
Bouchon (1725), Falcon (1728) e Vaucanson (anos 1740) numa máquina que qualquer tecelão operava
(fatos). O retrato de Jacquard tecido em seda em 1839 pela Didier, Petit et Cie levou 24.000 cartões;
Babbage comprou um exemplar em 1840 e o pendurava na sala para explicar como a Máquina Analítica
receberia instruções por cartões; Ada Lovelace: "a Máquina Analítica tece padrões algébricos como o
tear de Jacquard tece flores e folhas" (fatos).

**Por que é o livro inteiro.** É a primeira máquina cujo comportamento vem de um programa trocável,
separado da máquina. O ofício de desenvolver é escrever os cartões: o framework (Spring) lê a
configuração e faz o trabalho (a ideia do editor na pesquisa, para Spring); a cadeia de cartões é o
build (Gradle); o proxy e o aspecto (AOP) são o que acontece entre o cartão e o fio. Cobre Java,
Spring, JVM, concorrência e o resto do livro sem ser nenhum deles.

**Composição.** 3/4 pela frente-direita. Caixa de 0,85 × 1,0 da área (é o objeto mais alto, mas
mais largo do que alto na caixa: proporção uns 0,8 de altura por largura). O bastidor de madeira:
dois montantes, a travessa de cima, o órgão do peito na frente (a barra horizontal onde o pano sai),
o pano enrolando no rolo da frente com o começo de um padrão (três motivos pequenos, w3). Em cima do
bastidor, a cabeça de Jacquard: uma caixa com o prisma quadrado saindo pelo lado direito. Do prisma,
a cadeia de cartões: uma faixa de cartões emendados que desce pela direita, faz uma volta embaixo e
sobe de novo (uma curva fechada), cada cartão com duas fileiras de furos (w3). Os fios da urdidura:
quatro ou cinco linhas finas da cabeça até o pano (w3). Hachura: a face interna do montante direito,
a sombra sob a cabeça, o lado de baixo do rolo do pano. Chão sob os pés. **Fantasma:** o próximo
cartão entrando no prisma, tracejado: a instrução que vem.

**Ícone.** O bastidor, a cabeça e a cadeia de cartões (a faixa em curva com uma fileira de pontos:
`icone: true` na faixa e nos furos de uma fileira só); o pano como duas linhas; os fios da urdidura e o
padrão do pano levam `icone: false`. Silhueta: um portal retangular com uma caixa em cima e uma fita
pendurada à direita.

**Riscos.** Sem a cadeia à vista, o bastidor vira uma janela ou uma forca. A cadeia é a assinatura
do objeto e precisa de peso (w1 no contorno da faixa). Não confundir com a prensa (05): o tear é
madeira, aberto, retangular, com fita; a prensa é ferro, maciça, com o topo em arco e a alavanca.

### 04 DevOps: a estação de tubo pneumático (1853)

**História.** O primeiro tubo pneumático prático foi o de Josiah Latimer Clark para a Electric
Telegraph Company, em Londres, 1853–54: um tubo de 1½ polegada, 220 jardas, da central de Lothbury
à Bolsa, os telegramas em bolsas de feltro puxadas pelo vácuo de uma máquina a vapor de 6 cv, porque
sem ele a companhia precisaria de mensageiros correndo entre os dois prédios; em 1880 Londres tinha
mais de 21 milhas de tubo (fatos). Paris ligou os telégrafos por tubos em 1866 e abriu o serviço ao
público em 1879; a carta-bilhete do "pneu" ficou conhecida como *petit bleu* porque entre 1897 e
1902 era de papel azul (fato); a rede chegou a 427 km em 1934 e fechou em 1984. Nas lojas, os
"cash carriers" de Lamson (patente de 1881) levavam o dinheiro e a nota do balcão ao caixa.

**Por que é o livro inteiro.** É o caminho do commit até a produção: a cápsula é o contêiner (o
mesmo conteúdo chega intacto onde vai ser usado), o tubo é o pipeline, a estação é o ambiente, e
ninguém carrega nada na mão. O motivo de 1853 é o motivo do DevOps: tirar o mensageiro do caminho.
Cobre CI/CD, containers, Kubernetes, infraestrutura como código e nuvem.

**Composição.** 3/4 pela frente-direita. Caixa de 0,8 × 1,0 da área. Sobre um balcão (o tampo e a
frente, cortados pela área), a estação: um terminal de latão, um cilindro vertical (uns 0,25 da
largura da área) sobre uma base com flange, com a boca na frente e a portinhola aberta para baixo
numa dobradiça (w2, `papel: true`). Do topo do terminal sobe o tubo, de diâmetro menor, que faz uma
curva (um cotovelo) e sai da área pelo alto à direita. No balcão, à esquerda do terminal, uma cápsula
deitada: um cilindro com os dois anéis de feltro nas pontas (w1, `papel: true`, anéis em w2) e um
maço de cartões ao lado (três retângulos em w3). Hachura: o lado direito do terminal, o interior da
portinhola aberta, o lado de baixo do cotovelo do tubo, a frente do balcão. Chão: a sombra do terminal
e da cápsula no tampo. **Fantasma:** uma cápsula tracejada dentro do tubo, acima do cotovelo, a
caminho.

**Ícone.** O terminal com a boca aberta, o tubo com o cotovelo e a cápsula deitada ao lado (`icone:
true` nos anéis da cápsula). Silhueta: um J invertido sobre um cilindro, com um cilindrinho ao lado.
Os cartões e a frente do balcão levam `icone: false`.

**Riscos.** É o objeto menos reconhecido da coleção: pode ler como cano, periscópio ou chaminé de
fogão. O que o salva é a cápsula com os anéis (é um objeto que o leitor viu em banco ou em loja) e a
portinhola aberta; a frase da capa deve dizer "tubo pneumático". Se na foto da lombada ele não ler,
a alternativa dentro do princípio é a máquina a vapor horizontal com o volante (a sala de máquinas
como plataforma), com a cor mantida: o azul-pneumático perde a história e vira associação.

### 05 Frontend: a prensa tipográfica de ferro (Albion, c. 1820)

**História.** A primeira prensa inteiramente de ferro foi a de Stanhope, por volta de 1800 (o
exemplar mais antigo que sobrevive é de 1804); a Columbian de Clymer veio em 1813; a Albion, de
Richard Whittaker Cope, Londres, por volta de 1820 (primeiro registro em 1822), com o mecanismo de
articulação ("toggle") que a tornava mais leve e de puxada mais curta, foi a prensa manual mais
popular da Grã-Bretanha e foi fabricada até os anos 1930; William Morris imprimiu a Kelmscott Press
numa Albion (fatos). A forma do bastidor e o remate em coroa a tornam reconhecível.

**Por que é o livro inteiro.** Frontend é a página que o leitor vê. A prensa é onde tipo, tinta e
papel viram página: a caixa de tipos é o design system, a forma fechada na rama é o layout, a
impressão é a renderização, a tiragem é a performance. Cobre frameworks, Web Platform, acessibilidade
e Core Web Vitals sem desenhar nenhuma tela.

**Composição.** 3/4 pela frente-esquerda (a única com a fuga para a esquerda, para a alavanca
ficar à direita e o tímpano abrir para a direita; a luz continua do alto à esquerda). Caixa de 0,9 ×
1,0 da área. O bastidor de ferro: dois montantes grossos unidos em cima por um arco achatado com o
remate em coroa (w1, `papel: true`); sob o arco, a platina (uma placa horizontal) pendurada pelo
mecanismo; à direita, a alavanca (a barra), um braço longo com o punho em bola (ponto cheio no eixo).
Em frente, no plano da mesa, o leito com os dois trilhos e, sobre o leito, a forma: um bloco baixo de
tipos (hachurado em w3, para parecer o preto dos tipos). O tímpano aberto para a direita, uns 70°,
com a folha presa (um retângulo em w2). Hachura: a face direita dos montantes, a face de baixo da
platina, o bloco de tipos, a sombra do leito. Chão sob a base. **Fantasma:** a folha impressa
levantada do tímpano, tracejada, com três linhas curtas de texto dentro (w3 tracejado conta como
parte do mesmo fantasma): a página que sai.

**Ícone.** O bastidor com o arco e a coroa, a platina, o leito e a alavanca (`icone: true` na
alavanca mesmo em w2); o tímpano, a folha e a hachura dos tipos levam `icone: false`. Silhueta: um
arco maciço sobre uma base, com um braço saindo à direita.

**Riscos.** O bastidor em arco ecoa o ícone do arco de pedra da capa de hoje (que sai); a coroa, a
alavanca e o leito saindo pela frente desfazem o eco. É o segundo "portal" da estante (o tear é o
outro); os dois estão a dois livros de distância e o tubo pneumático fica entre eles.

### 06 Fundamentos: o telégrafo de Morse, a chave e o registrador (1844)

**História.** Em 24 de maio de 1844 Morse mandou de Washington para Vail, em Baltimore, "What hath
God wrought" (o versículo escolhido por Annie Ellsworth); o registrador gravava pontos e traços em
relevo numa fita de papel, com uma ponta de aço que Vail pôs no lugar do lápis, para um operador ler
depois (fatos: Smithsonian, Library of Congress). Segundo o relato corrente, Vail contou os tipos da
caixa de uma tipografia para dar os códigos mais curtos às letras mais usadas (E é um ponto): está
em fontes secundárias e com "reportedly"; é dito aqui como relato, não como fato. As linhas eram
alimentadas por pilhas de gravidade (Callaud, anos 1860), potes de vidro com sulfato de cobre, o
"vitríolo azul", que viraram o padrão do telégrafo nos EUA e no Reino Unido (fato).

**Por que é o livro inteiro.** É o computador com tudo à vista: o bit (o circuito aberto ou
fechado), o código (Morse, de comprimento variável), o protocolo (o tempo do ponto e do traço), a
rede (de estação em estação, com repetidores), a memória (a fita). Fundamentos é "o que todo
framework esconde": sistema operacional, redes, codificação, concorrência, filas. O telégrafo não
esconde nada.

**Composição.** 3/4 pela frente-direita. Caixa de 1,0 × 0,75 da área (é o objeto mais baixo e
largo; apoiado na base da área). Uma base de madeira (uma tábua com espessura). À esquerda, na
frente, o manipulador: a alavanca de latão com o botão redondo na ponta (w1, `papel: true`, o botão
grande, uns 10% da largura da área), os munhões do pivô (ponto cheio), a mola embaixo da alavanca, o
contato e dois bornes (pequenos cilindros, w2). À direita e atrás, o registrador: um bastidor de latão
com dois carretéis (círculos, um com a fita enrolada), as duas bobinas do eletroímã (dois cilindros
deitados, lado a lado, w2) e o braço com a ponta sobre a fita; a fita sai do registrador para a
frente, passa pela beira da tábua e cai um pouco, com as marcas em relevo (traços curtos e pontos,
w3). Hachura: a face direita do bastidor do registrador, o lado da sombra das bobinas, embaixo da
alavanca, a espessura da tábua. Chão sob a tábua. **Fantasma:** a continuação da fita, tracejada,
com os pontos e traços da mensagem que ainda está chegando.

**Ícone.** O manipulador inteiro (alavanca, botão, pivô, base) e o bastidor do registrador com um
carretel e as duas bobinas; a fita de papel leva `icone: true` só no trecho que sai para a frente;
os bornes, a mola, as marcas da fita e o segundo carretel levam `icone: false`. Silhueta: uma tábua
com uma alavanca de botão redondo na frente e uma caixa com dois tambores atrás.

**Riscos.** A chave sozinha a 30px vira um grampeador (a pesquisa já tinha avisado). O botão
redondo grande, o vão sob a alavanca e os tambores do registrador tiram esse ar. A fita pode ecoar o
rolo de papel da tag Logs; ela é coadjuvante aqui, e o ícone a leva só no trecho curto.

### 07 IA: o fonógrafo de Edison (1877)

**História.** Edison fez o fonógrafo de folha de estanho em 1877. Em 1878, antes de a máquina
funcionar bem, escreveu "The Phonograph and Its Future" na *North American Review*, listando o que
ela faria: ditado de cartas, livros falados para cegos e doentes, ensino de elocução, música, o
registro da família, brinquedos, relógios que anunciam a hora, a preservação de línguas (fato). Os
cilindros de cera marrom (um sabão metálico de ácido esteárico e alumínio) são de 1888 a 1902, e os
primeiros clientes foram os donos de fonógrafos de ficha em salões e galerias (fatos).

**Por que é o livro inteiro.** É a máquina que fala com uma voz que não é a dela, feita do que ouviu;
e a lista de usos de 1878, escrita antes de a coisa funcionar, é a história de todo modelo de
linguagem. "Software feito com IA e software que usa IA": o fonógrafo grava (a entrada) e reproduz
(a saída). O desenho vale para LLMs, agentes, RAG e prompts.

**Composição.** 3/4 pela frente-direita. Caixa de 0,95 × 0,95 da área. A caixa de carvalho (o
corpo, com a manivela saindo pela face direita: braço e punho, ponto cheio no eixo). Sobre a caixa, o
mandril horizontal com o cilindro de cera (um cilindro deitado, w1, `papel: true`, com as estrias em
w3 só numa faixa), o eixo saindo nas pontas. Acima do cilindro, o carro com o reprodutor (uma caixinha
com a agulha) montado no fuso (uma barra horizontal sobre dois suportes). Do reprodutor sobe a
corneta: um cone reto e longo (sem o formato de flor, para a silhueta ficar limpa), subindo para a
esquerda e para cima, com a boca aberta para o leitor, à esquerda (uma elipse em w1 vista de 3/4; o
interior da boca com hachura em meia-lua). Hachura: dentro da boca da corneta, a face direita da caixa,
o lado de baixo do cilindro, o lado da sombra da corneta ao longo do cone. Chão sob a caixa.
**Fantasma:** o carro com o reprodutor tracejado na posição seguinte, mais adiante no cilindro: a
agulha avançando sobre o que foi gravado.

**Ícone.** A caixa, o cilindro, a corneta (a forma de cone inteira) e a manivela (`icone: true`); o
fuso, os suportes e as estrias levam `icone: false`. Silhueta: um cone saindo de uma caixa. É a
única forma cônica da estante.

**Riscos.** Lê "música" ou "gramofone" antes de ler "IA"; a frase da capa tem de fazer o resto. O
cone precisa de comprimento (pelo menos metade da largura da área) para não virar um funil em cima
de uma caixa. Dito com honestidade: o fonógrafo reproduz, não gera; a ligação é a voz emprestada e a
lista de promessas, e está dita assim.

### 08 Integração e Eventos: a mesa telefônica manual (1878)

**História.** A primeira central comercial é de New Haven, 1878, com 21 assinantes, cordões de
plugue nos jaques (pesquisa; a Western Electric lançou a mesa "Standard" em 1881). A partir do fim
dos anos 1890, com a bateria central, a lâmpada da linha acende quando o assinante tira o fone do
gancho, apaga quando a telefonista encaixa o plugue, e as lâmpadas de supervisão dizem quem desligou
(fatos: patentes e manuais da época, ver fontes).

**Por que é o livro inteiro.** A central é o broker: os jaques são endereços, o cordão é o roteamento,
a lâmpada que acende é o evento, a lâmpada que apaga é a confirmação, dois cordões no mesmo jaque é
o fan-out. "Integração" (ligar quem chama a quem atende, a API) e "eventos" (a lâmpada) no mesmo
objeto. Fica da rodada anterior porque cabe no mundo (1878, dentro do escritório) e porque as
alternativas são piores: a torre de Chappe precisa de céu, o sino vira ícone de notificação, e o tubo
pneumático foi para o DevOps, onde o que importa é o caminho.

**Composição.** 3/4 pela frente-direita, como o desenho da rodada anterior, com três mudanças: menos
jaques (uma grade de 6 linhas × 8 colunas, cada jaque um círculo pequeno em w2 com uma lâmpada
menor acima, em w3); **uma lâmpada acesa** (um círculo cheio, `cheio`, com três traços curtos de
brilho em w3: é o evento, e é a única "luz" da coleção); os dois cordões em w1, saindo da prateleira
de chaves e subindo em curva até os jaques (as curvas são a assinatura do objeto). Na prateleira
horizontal, os pares de plugues em pé nos furos e quatro chaves pequenas. Caixa de 0,85 × 1,0 da
área. Hachura: a face direita do gabinete, a sombra sob a prateleira, a moldura interna do painel.
Chão sob os pés. **Fantasma:** o cordão que ainda vai ser encaixado, tracejado, de um plugue na
prateleira ao jaque da lâmpada acesa (como na rodada anterior, agora com destino).

**Ícone.** O gabinete, a prateleira, uma grade rala de jaques (4 × 5, `icone: true` só nesses) e os
dois cordões (`icone: true` nas duas curvas); as lâmpadas, as chaves e os plugues levam `icone:
false`. Silhueta: um painel em pé sobre uma prateleira, cortado por duas curvas.

**Riscos.** O par com o tabulador (02), dito na ficha dele. Jaques densos a 30px viram uma mancha
cinza: por isso a grade rala no ícone. A pesquisa avaliou a legibilidade pequena como "média"; a foto
da lombada decide.

### 09 Pagamentos: a caixa registradora (1879)

**História.** James Ritty, dono de bar em Dayton, patenteou em 1879 (patente 221.360, "o caixa
incorruptível") uma máquina que registra cada venda, guarda o dinheiro, toca o sino e fecha o caixa
no fim do dia: nasceu contra o desvio dos empregados e para a conciliação (pesquisa).

**Por que é o livro inteiro.** Registro de cada lançamento (o ledger), custódia, comprovante, fraude e
fechamento do dia num objeto só; e é o exemplo que o Cesar deu. Fica como está na rodada anterior
(`scripts/desenho/livros/pagamentos.mjs`): o desenho já segue o ponto de vista do conjunto (3/4 pela
frente-direita, projeção oblíqua, luz do alto à esquerda), e o fantasma (a gaveta que salta) é a
máquina fazendo o trabalho dela.

**Composição.** A de hoje. Um ajuste: a cabeça abobadada com o visor e as bandeirinhas é o que
diferencia a silhueta do teclado da mesa telefônica e do tabulador; manter a abóbada alta (não
achatar) e a gaveta larga na base.

**Ícone.** O de hoje: corpo, teclas em degraus, abóbada, gaveta. Silhueta: uma escada de teclas com
uma cúpula em cima e uma gaveta embaixo.

**Riscos.** Nenhum novo. A tag Pagamentos (pilha de moedas) é outro objeto.

### 10 Segurança: a fechadura detectora de Chubb (1818)

**História.** Depois de um roubo com chaves falsas no arsenal de Portsmouth em 1817, o governo
britânico abriu um concurso por uma fechadura que só a própria chave abrisse; Jeremiah Chubb ganhou
em 1818 com a fechadura detectora: se uma gazua ou uma chave errada levanta uma alavanca além do
ponto, o detector trava a fechadura e ela fica travada até a chave verdadeira ser girada ao contrário
(1824), e assim o dono fica sabendo que alguém tentou. Um presidiário que vivia de abrir fechaduras
não conseguiu em meses; a Chubb virou fornecedora dos Correios e das prisões. A fechadura só foi
aberta por outro em 1851, na Grande Exposição de Londres, por Alfred Hobbs, que em seguida abriu a
de Bramah, intacta havia 67 anos (fatos).

**Por que é o livro inteiro.** Segurança é "quem pode o quê e como provar": a chave é a credencial, as
alavancas são a verificação, o detector é o registro de auditoria que prova a tentativa, e Hobbs em
1851 é a lição de que nenhuma fechadura é inviolável. Cobre identidade, JWT, criptografia, segredos
e conformidade. É a mesma ideia do lacre (a prova de que ninguém mexeu) em ferro, e por isso a cor
do livro é a do lacre: o objeto e a cor contam uma história só, em dois materiais.

**Composição.** De frente, com uma fuga leve para a direita (é um objeto de porta). Caixa de 1,0 ×
0,75 da área, apoiada na base. A caixa da fechadura, retangular, mais larga que alta (uns 1,5 por 1),
com a tampa retirada: a chapa de fundo (hachura leve em w3 em toda ela, como o ferro na sombra), as
seis alavancas em leque em torno do pivô no alto à esquerda (cada uma um perfil estreito com a
janela, w2, `papel: true`, empilhadas com um pequeno deslocamento), a alavanca detectora por cima
delas, a mola do detector, o ferrolho saindo pela face direita da caixa (um bloco em w1, `papel: true`)
e o buraco da chave embaixo, no centro (um furo cheio). Ao lado, à esquerda, deitada na frente, a
chave grande: o anel, a haste e o palhetão (w1). Dois ou três parafusos na borda da caixa (pontos
cheios). Hachura: a chapa de fundo, a face direita do ferrolho, a sombra da chave na mesa. Chão sob a
caixa e sob a chave. **Fantasma:** a alavanca detectora na posição travada, levantada, tracejada: a
alavanca que sobe e fica, a prova da tentativa.

**Ícone.** A caixa, o ferrolho saindo à direita, o buraco da chave e a chave ao lado (a chave em w1);
as alavancas viram três perfis em w2 (`icone: true` em três, `icone: false` nas outras) e a hachura da
chapa some. Silhueta: um retângulo com um dente saindo à direita e uma chave deitada ao lado.

**Riscos.** Fechada, a fechadura vira o cadeado, o clichê que o briefing proíbe, e a tag Criptografia
já tem um cadeado. O mecanismo exposto é obrigatório; a caixa é retangular de porta, sem alça. Seis
alavancas em leque a 30px viram uma mancha, por isso o ícone leva só três.

### 11 Sistemas Distribuídos: os dois relógios de Huygens na mesma viga (1665)

**História.** Em fevereiro de 1665, de cama, Huygens notou que dois dos seus relógios de pêndulo,
pendurados na mesma viga, acabavam sempre oscilando em oposição de fase, por mais que os separasse:
"uma estranha simpatia". Contou ao pai em 26 de fevereiro e à Royal Society em 27 (a carta foi lida
em 1º de março); primeiro culpou o ar, dias depois achou a causa, a viga que ligava os dois. Os
relógios eram os seus relógios marítimos, feitos para a longitude e testados no mar entre 1662 e 1665
por Alexander Bruce e Robert Holmes; dois a bordo era redundância (se um parasse, o outro continuava).
A Royal Society leu a descoberta como um revés: se uma vibração tão pequena mudava a marcha, o
pêndulo não servia para o mar (fatos: Bennett et al., *Proc. R. Soc. A*, 2002; Willms et al., *R.
Soc. Open Sci.*, 2017; Mahoney).

**Por que é o livro inteiro.** Duas máquinas iguais, cada uma com a sua hora, que só se acertam pelo
que as liga: relógios, ordem, consenso, a rede como viga. E a ironia da Royal Society é a lição de
operação: o acoplamento que dá o acordo é o mesmo que tira a independência. Fica da rodada anterior:
é a primeira data do mundo da coleção, e a alternativa com história (o aparelho de tabuleta de Tyer,
1878, que impede dois trens na mesma via) ninguém reconhece a 30px.

**Composição.** A da rodada anterior (`sistemas-distribuidos.mjs`), com dois ajustes: as caixas dos
relógios maiores (cada caixa com uns 30% da largura da área, para o ícone ler) e os mostradores mais
simples (círculo, dois ponteiros, sem marcas). Os dois pêndulos em oposição. Hachura: a face direita
dos montantes, o lado de baixo da viga, o lado direito de cada caixa. Chão sob os montantes.
**Fantasma:** o pêndulo do segundo relógio na posição espelhada, tracejado (o de hoje).

**Ícone.** A viga, os dois montantes, as duas caixas com os mostradores e os dois pêndulos; os
ponteiros levam `icone: true`. Silhueta: um pórtico com duas caixas penduradas e duas hastes.

**Riscos.** Dois mostradores pequenos a 30px: as caixas grandes resolvem. O cabeçalho do artigo usa
um reloginho de caneta para o tempo de leitura (`traco`): é um círculo só, noutro contexto e tamanho;
não confunde, mas vale olhar os dois na mesma página.

### 12 SRE: o regulador centrífugo de Watt (1788)

**História.** Em 1788 Watt desenhou, por sugestão de Boulton, o regulador de esferas para as máquinas
rotativas: quando a máquina acelera, as esferas abrem e sobem e fecham a válvula do vapor; quando
desacelera, descem e abrem. A ideia veio dos reguladores de moinho (Huygens, século XVII). Em 1868
havia uns 75.000 reguladores de Watt na Inglaterra, e naquele ano Maxwell publicou "On Governors"
(*Proc. R. Soc.*), a primeira análise matemática de um sistema de realimentação, motivada pelo
"hunting", a oscilação do regulador que, em certos regimes, piorava a perturbação em vez de
corrigi-la. Wiener tirou daí o nome "cibernética", de *kubernetes*, o timoneiro, a mesma raiz de
"governor" (fatos). A mesma raiz de Kubernetes.

**Por que é o livro inteiro.** SRE é o que mantém a produção de pé: o SLO é a rotação de regime, o
alerta e o autoscaling são as esferas, o "hunting" de 1868 é o alerta que bate e volta e o
autoscaler que oscila, e a observabilidade é olhar as esferas para ler a carga. Cobre logs, tracing,
métricas, SLOs e incidentes.

**Composição.** 3/4 pela frente-direita. Caixa de 0,65 × 1,0 da área (é o objeto mais alto e
estreito). O pedestal: uma coluna curta sobre uma base com flange, com a polia da correia na base
(uma elipse em w2). O eixo vertical (w1). No alto, o cubo com os dois braços articulados descendo em
V aberto, uns 35° de cada lado, cada um terminando numa esfera (círculos em w1, `papel: true`, cada
esfera com pelo menos 12% da largura da área); de cada esfera, o tirante subindo até a luva que
desliza no eixo. Da luva, a alavanca horizontal para a direita, apoiada num pivô (ponto cheio), até a
válvula borboleta num pedaço de tubo (um cilindro deitado cortado pela área). Hachura: a metade
direita de cada esfera (em crescente), a face direita do pedestal, a sombra sob a luva, o lado de
baixo do tubo. Chão sob a base. **Fantasma:** as esferas e os braços na posição alta, com a luva
levantada, tracejados: a máquina acelerou, as esferas sobem e fecham o vapor.

**Ícone.** O pedestal, o eixo, os braços, as duas esferas e a luva; a alavanca, a válvula, o tubo e a
polia levam `icone: false`. Silhueta: um Y com duas bolas sobre uma coluna.

**Riscos.** Esferas pequenas viram um lustre ou um pêndulo duplo (e aí colidem com o 11). O tamanho
das esferas e o V aberto resolvem. A tag Kubernetes é um leme: objeto diferente, mesma raiz da
palavra, e a ficha pode brincar com isso.

### 13 Testes: o fio de prumo

**História.** O prumo é usado desde o Egito antigo para garantir a vertical: Petrie recolheu exemplares
desde a III dinastia; no túmulo do arquiteto Senedjem (c. 1280–1220 a.C.) havia um prumo e um nível
de esquadro; o "arquipêndulo", o nível em A com o fio de prumo no vértice, foi usado na Europa até
meados do século XIX; "prumo" vem de *plumbum*, chumbo, o material que substituiu a pedra no peso, e
dá o símbolo Pb e a palavra "aprumo" (fatos). Os primeiros arranha-céus ainda usavam prumos pesados
nos poços dos elevadores.

**Por que é o livro inteiro.** O teste não mede: compara com uma referência que não pode estar errada
(a gravidade). O prumo é o oráculo; a parede fora do prumo é o código; a vertical verdadeira é o
esperado. Cobre TDD, pirâmide de testes, testes de contrato, caos e performance. Fica da rodada
anterior porque, dentro do mundo da coleção, as alternativas são piores: o nível de bolha (Thévenot,
1661) é uma barra sem silhueta; o calibre passa/não-passa (o limite de tolerância virado objeto, a
melhor história para testes) não se reconhece a 30px; e o chumbo dá a cor. É a única exceção à data
de 1657, dita como exceção: o fundamento vem antes.

**Composição.** A da rodada anterior (`testes.mjs`), trazida para dentro: o fio pendurado num
suporte de madeira cravado no alto de um trecho de parede de tijolos (a parede da oficina, cortada
pela área, inclinada uns 3° para fora do prumo), o peso de chumbo (um cone com a cabeça cilíndrica e
a ponta para baixo, w1, `papel: true`) com pelo menos 22% da largura da área, para o ícone ler. Caixa
de 0,9 × 1,0 da área. Hachura: a metade direita do peso, a face lateral da parede, a sombra do
suporte. Chão sob a parede. **Fantasma:** a vertical verdadeira, tracejada, ao lado da parede que
saiu do prumo: o esperado ao lado do obtido.

**Ícone.** O peso, o fio e o suporte, mais a aresta da parede em duas linhas (`icone: true` nas duas
arestas que mostram a inclinação; `icone: false` nos tijolos). Silhueta: um cone pendurado ao lado de
uma barra inclinada.

**Riscos.** Um cone numa linha é pouco a 30px; o peso grande e a aresta da parede dão corpo. Não
desenhar um cadarço de prumo "moderno" (de plástico); a cabeça cilíndrica de latão é a de 1890.

## 3. Silhuetas na estante

Os 13 ícones ficam lado a lado em ordem alfabética, girados 90° na lombada em pé. A tabela descreve
cada silhueta e confere os vizinhos.

| Vol. | Livro | Silhueta do ícone | Forma |
|---|---|---|---|
| 01 | Arquitetura | prancheta inclinada sobre duas pernas, com a cabeça da régua-tê saindo | paralelogramo sobre pernas |
| 02 | Dados | gabinete alto com painel de mostradores e a prensa levantada à direita | bloco alto e largo com aba |
| 03 | Desenvolvimento | bastidor retangular aberto com a caixa em cima e a fita pendurada | portal com fita |
| 04 | DevOps | cilindro com um tubo em J saindo do alto e um cilindrinho ao lado | J sobre cilindro |
| 05 | Frontend | arco maciço de ferro sobre base, com braço à direita | arco cheio com braço |
| 06 | Fundamentos | tábua baixa com alavanca de botão redondo na frente e dois tambores atrás | baixo e largo |
| 07 | IA | cone longo saindo de uma caixa | cone |
| 08 | Integração | painel em pé sobre prateleira, cortado por duas curvas | painel com curvas |
| 09 | Pagamentos | escada de teclas com cúpula em cima e gaveta embaixo | escada com cúpula |
| 10 | Segurança | retângulo deitado com um dente saindo à direita e uma chave ao lado | retângulo com dente |
| 11 | Sist. Distribuídos | pórtico com duas caixas penduradas e duas hastes | pórtico com dois círculos |
| 12 | SRE | Y com duas bolas sobre uma coluna | Y alto |
| 13 | Testes | cone pendurado ao lado de uma barra inclinada | cone na linha |

Vizinhos: 01 inclinado × 02 bloco reto; 02 bloco cheio × 03 portal vazado; 03 vazado × 04 J fino;
04 fino × 05 arco cheio; 05 alto × 06 baixo; 06 baixo × 07 cone; 07 cone × 08 painel reto; 08 painel ×
09 escada com cúpula; 09 escada × 10 retângulo deitado com chave; 10 deitado × 11 pórtico; 11 pórtico
× 12 Y; 12 Y × 13 cone pendurado. Nenhum par vizinho repete a forma. Os pares não vizinhos que pedem
foto lado a lado antes de fechar: **02 × 08** (dois painéis com pontos: a diferença são os
mostradores grandes e a prensa de um lado, as curvas dos cordões do outro), **03 × 05** (dois
portais: madeira aberta com fita contra ferro maciço com braço), **07 × 13** (dois cones: um sai de
uma caixa, deitado; o outro pende de uma linha, de ponta para baixo), **11 × 12** (círculos
pendurados contra bolas em V: as bolas do 12 são maiores e estão nas pontas de um Y).

## 4. As 13 cores

### O princípio da paleta

Tecidos de uma série encadernada, não arco-íris de interface: luminosidade entre 27 e 72 (OKLCh),
croma entre 0,01 e 0,105 (só o lacre passa de 0,08, de propósito: é o único vermelho e o Cesar o
pediu), e três livros claros com a tinta escura (DevOps, Integração, SRE) nas posições 04, 08 e 12,
um a cada quatro, para a estante ter ritmo em vez de um bloco escuro. Dois quase neutros (o negro de
fumo em 05 e o cinza-chumbo em 13) seguram as pontas. A paleta pende para o frio (sete cores frias,
quatro quentes, dois neutros), como as bibliotecas de verdade. Cada cor vem do objeto, do material ou
de uma convenção do assunto, e a ficha diz qual dos três. Os valores foram definidos em OKLCh e
convertidos com a conta inversa do `cores.js`.

| Vol. | Livro | Cor | Hex | OKLCh (L, C, h) | Tinta | O motivo |
|---|---|---|---|---|---|---|
| 01 | Arquitetura de Software | azul-de-cianotipia | `#2d4f77` | 42, 0,078, 254 | clara | fato: Herschel (1842) chamava o azul do seu processo de azul da Prússia; o blueprint foi a cópia de toda planta das salas de desenho de 1870 aos anos 1940. A cor do que foi decidido no papel. |
| 02 | Dados | roxo-de-mimeógrafo | `#624a72` | 45, 0,070, 312 | clara | fato (pesquisa): as cópias do mimeógrafo a álcool (1923) eram roxas, de anilina, "o mais legível pelo maior número de cópias". A cor do registro copiado; é motivo do assunto, não do tabulador, e está dito. Um tom mais azul que a ameixa de hoje. |
| 03 | Desenvolvimento de Software | garança | `#82555a` | 50, 0,060, 12 | clara | fato (pesquisa): a garança é o vermelho dos tecidos desde a Antiguidade; a calça *garance* do exército francês (1829–1914) sustentou a indústria de Avignon. O pano que sai do tear. |
| 04 | DevOps | azul-pneumático | `#92a6c2` | 72, 0,047, 256 | escura | fato: a carta-bilhete do tubo pneumático de Paris era de papel azul (1897–1902) e ficou para sempre o *petit bleu* (Proust mandava os seus por ele). O papel que viaja na cápsula. |
| 05 | Frontend | negro-de-fumo | `#2a2621` | 27, 0,010, 70 | clara | fato: a tinta de Gutenberg era negro de fumo (a fuligem de lamparina) em verniz de óleo de linhaça, porque a tinta de escrever escorria do tipo de metal. A tinta de toda página impressa. |
| 06 | Fundamentos | azul-vitríolo | `#26626a` | 46, 0,062, 207 | clara | fato: as pilhas de gravidade (Callaud, anos 1860), potes de vidro com sulfato de cobre, o "vitríolo azul", em camada azul no fundo, alimentaram as linhas de telégrafo dos EUA e do Reino Unido. O que fica embaixo e ninguém vê. |
| 07 | IA | cera-marrom | `#5d4128` | 40, 0,055, 62 | clara | fato: os cilindros de cera marrom de Edison (1888–1902), do bege ao marrom escuro conforme a fornada. A memória da máquina que fala. |
| 08 | Integração e Eventos | verde-água | `#71a49d` | 68, 0,055, 186 | escura | fato (pesquisa): os isoladores de vidro das linhas de telégrafo e de telefone saíam verde-água por causa do ferro da areia. O vidro que segura o fio entre as estações. |
| 09 | Pagamentos | verde-cédula | `#4f6f57` | 51, 0,054, 152 | clara | fato (pesquisa): o verso verde das cédulas dos EUA desde 1861, mantido em 1929 por ser "durável e associado ao crédito forte e estável"; o papel de razão verde é tradição de fabricante. |
| 10 | Segurança | vermelho-lacre | `#7c322b` | 42, 0,105, 28 | clara | fato: o lacre era tingido de vermelho com cinábrio ou vermelhão desde a Idade Média, e a partir do século XVII, à base de goma-laca, mais quebradiço de propósito, "para mostrar com clareza se alguém mexeu na carta". A cor da prova de que ninguém abriu, como o Cesar sugeriu; a fechadura detectora é a mesma ideia. |
| 11 | Sistemas Distribuídos | azul-marinho | `#202c4d` | 30, 0,062, 268 | clara | fato (pesquisa): o azul escuro dos uniformes da Marinha britânica, fixado em 1748; e os dois relógios de Huygens eram relógios marítimos, feitos para a longitude. A cor do mar para relógios feitos para o mar. |
| 12 | SRE | latão | `#b59353` | 68, 0,092, 82 | escura | fato de convenção (pesquisa): o amarelo é a cor da cautela na sinalização (ANSI Z535; o âmbar dos semáforos desde 1914). Associação de material: o latão polido dos reguladores de mostra. Mantém o lugar claro e quente do ocre de hoje, com outro motivo. |
| 13 | Testes | cinza-chumbo | `#3e4349` | 38, 0,012, 250 | clara | fato: "prumo" vem de *plumbum*, chumbo, o metal do peso desde os romanos. A cor do oráculo. |

Comparado com hoje: saem o verde-pátina, o tijolo, o vinho e a oliva; a ameixa muda de tom; o
azul-ardósia do DevOps dá lugar a um azul claro; o ocre vira latão. As três cores da rodada anterior
que ficam (verde-água, verde-cédula, azul-marinho) ficam porque as histórias delas eram as melhores da
pesquisa e cabem no princípio.

### A conferência (saída final da ferramenta, exit 0)

```
node scripts/livros/conferir-cores.mjs "#2d4f77:Arquitetura" "#624a72:Dados" \
  "#82555a:Desenvolvimento" "#92a6c2:DevOps" "#2a2621:Frontend" "#26626a:Fundamentos" \
  "#5d4128:IA" "#71a49d:Integração" "#4f6f57:Pagamentos" "#7c322b:Segurança" \
  "#202c4d:Distribuídos" "#b59353:SRE" "#3e4349:Testes"

== Cores
Cor       Nome                          tinta/cor  chip(c/e)    L    C     h   Situação
#2d4f77  Arquitetura                    6.89:1  10.8/6.4    42 0.078  254   ✓
#624a72  Dados                          6.27:1  10.2/6.6    45 0.070  311   ✓
#82555a  Desenvolvimento                5.07:1  8.9/7.3    50 0.060   12   ✓
#92a6c2  DevOps                         6.15:1  4.7/10.7    72 0.047  257   ! quadradinho claro 2.48:1
#2a2621  Frontend                      12.31:1  15.5/4.8    27 0.011   73   ✓
#26626a  Fundamentos                    5.66:1  9.5/6.9    46 0.062  207   ✓
#5d4128  IA                             7.64:1  11.5/6.1    40 0.054   62   ✓
#71a49d  Integração                     5.46:1  5.1/10.1    68 0.055  185   ! quadradinho claro 2.80:1
#4f6f57  Pagamentos                     4.60:1  8.3/7.6    51 0.053  152   ✓
#7c322b  Segurança                      7.33:1  11.3/6.2    42 0.105   28   ✓
#202c4d  Distribuídos                  11.25:1  14.5/5.0    30 0.062  267   ✓
#b59353  SRE                            5.28:1  5.2/10.0    68 0.092   82   ! quadradinho claro 2.89:1
#3e4349  Testes                         8.18:1  12.0/5.9    38 0.012  253   ✓

Pares mais parecidos (ΔE OKLab; a coleção de hoje vai até 0,064; abaixo de 0,05 se confundem):
  ✓ 0.069  Arquitetura × Fundamentos
  ✓ 0.069  IA × Testes
  ✓ 0.070  IA × Segurança
  ✓ 0.071  DevOps × Integração
  ✓ 0.073  Fundamentos × Pagamentos
```

Tinta sobre a cor: todas acima de 4,5:1 (a menor é Pagamentos, 4,60:1; hoje o couro ficava em
3,39). Os três alertas de "quadradinho claro" são os das cores claras com tinta escura, do mesmo tipo
que o ocre do SRE tem hoje (2,47:1): o quadradinho do chip no tema claro fica abaixo de 3:1 sobre a
folha, o que a ferramenta trata como desejável, não obrigatório. Nenhum par abaixo de 0,069 (o piso
de hoje é 0,064).

Os vizinhos na ordem da estante, calculados com a mesma conta da ferramenta (todos os 78 pares foram
conferidos; os mais próximos estão acima):

| Vizinhos | ΔE |
|---|---|
| 01 Arquitetura × 02 Dados | 0,077 |
| 02 Dados × 03 Desenvolvimento | 0,083 |
| 03 Desenvolvimento × 04 DevOps | 0,237 |
| 04 DevOps × 05 Frontend | 0,452 |
| 05 Frontend × 06 Fundamentos | 0,202 |
| 06 Fundamentos × 07 IA | 0,127 |
| 07 IA × 08 Integração | 0,296 |
| 08 Integração × 09 Pagamentos | 0,174 |
| 09 Pagamentos × 10 Segurança | 0,168 |
| 10 Segurança × 11 Sist. Distribuídos | 0,189 |
| 11 Sist. Distribuídos × 12 SRE | 0,411 |
| 12 SRE × 13 Testes | 0,318 |

Os dois pares vizinhos mais próximos (01 × 02 e 02 × 03) estão acima do piso e são de matizes
diferentes (azul, roxo, rosa-garança); na foto da estante (`.render/colecoes/paleta-final.png`) os
três se separam. Se o Cesar quiser mais ar entre eles, o ajuste é o roxo de Dados um pouco mais claro
(L 47), sem mexer nos outros.

Dois pontos para o Cesar decidir, se quiser mexer:

- **A paleta tem cinco frias azuladas** (cianotipia, pneumático, vitríolo, verde-água, marinho), em
  luminosidades e matizes bem separados (42/72/46/68/30 e 254/256/207/186/268). Na estante elas
  ficam em 01, 04, 06, 08 e 11, nunca duas juntas. Se incomodar, a troca com menos perda de história
  é o vitríolo de Fundamentos por um cinza-pedra (`#8a8276`, associação com a pedra fundamental),
  que a pesquisa já tinha avaliado.
- **SRE fica na família do ocre de hoje.** É de propósito: é o lugar claro e quente que a estante
  precisa a cada quatro livros, e o motivo (a cautela, o latão) é honesto. Se o Cesar quiser que
  todos os sete de hoje mudem de família, a alternativa é o verde-de-máquina (Brunswick green, a
  tinta das máquinas e locomotivas vitorianas, convenção documentada em padrão britânico), mas ele
  cola no verde-cédula e tira o único claro do lado direito da estante.

## 5. A marca do site

A marca "cs" é desenhada como a capa do Volume 01 na cor `#2D4B46` (token `marca`), o verde-pátina da
Arquitetura de Software de hoje. A Arquitetura continua Volume 01, mas a cor nova é o
azul-de-cianotipia `#2d4f77`. Duas saídas, com o custo de cada uma:

- **A marca acompanha (recomendado).** A regra de hoje é que a marca *é* a capa do Volume 01; se o
  volume muda de cor e a marca não, a marca vira a capa de um livro que não existe na coleção. E o
  azul-de-cianotipia é uma cor de identidade melhor para um blog de arquiteto de soluções do que a
  pátina de telhado, cuja história era a do arco de pedra, que sai. O que muda: o token `marca` no
  `DESIGN.md` e em `tokens.ts`, a marca e os ícones do navegador (`scripts/marca.mjs`), as fotos da
  ficha "Do livro" (`scripts/livros/fotos.mjs`), e as imagens OG que levam a marca. O que conferir
  antes: a fita laranja da série (`marca-fita` `#C24D1C`) sobre o azul (contrasta bem, é o par
  clássico do blueprint); e a caneta azul do caderno (`caneta` `#1F4FB5`) na mesma tela que a marca:
  são dois azuis de famílias diferentes (um azul de caneta vivo, um azul de planta acinzentado), mas
  é o único ponto em que a marca passa a dividir o matiz com outra peça da interface.
- **A marca fica.** A regra passa a ser "a marca é o livro da casa, fora da numeração", e o verde
  `#2D4B46` continua sendo a cor de identidade do site, sem par na estante. Custo zero; perde-se a
  frase "a marca é a capa do Volume 01" e o verde deixa de ter o motivo que tinha (a pátina era a
  história do arco).

A decisão é do Cesar; a direção de arte não depende dela (nenhuma das 13 cores colide com o verde da
marca: o par mais próximo é o verde-cédula, ΔE 0,077).

## 6. O que a crítica deve olhar com cuidado

1. **O tubo pneumático (04).** É o objeto com menor reconhecimento; se a foto da lombada não ler, a
   alternativa está na ficha (a máquina a vapor), e a cor perde a história.
2. **Os dois painéis (02 × 08)** e **os dois portais (03 × 05)**: fotografar os ícones lado a lado
   antes de aprovar; a diferença está nos detalhes ditos nas fichas.
3. **A fechadura (10) e o clichê do cadeado.** O mecanismo exposto é condição; se a crítica achar que
   ainda lê como cadeado, a saída é a chave maior e as alavancas mais à vista, não trocar o objeto.
4. **O fonógrafo (07) lê "música".** A frase da capa precisa carregar o sentido; conferir na etapa 3.
5. **O relato de Vail (06)** sobre a caixa de tipos está marcado como relato; a frase e o texto não
   devem apresentá-lo como fato.
6. **As cinco frias azuladas** e a **continuidade do ocre no SRE**: as duas decisões estão
   justificadas na seção 4, mas são as que o Cesar pode ver de outro jeito na estante montada.
7. **O cartão de Hollerith (02):** as fontes divergem sobre o tamanho do cartão de 1890; o texto da
   capa deve dizer "do tamanho da cédula de um dólar" sem data precisa.
8. **A marca** (seção 5): a recomendação é acompanhar; o custo está listado.

## Fontes

Conferidas pela busca na web nesta sessão (as páginas em si estão bloqueadas pelo proxy; os trechos
devolvidos pela busca foram lidos e cruzados entre duas ou mais fontes quando possível). As histórias
marcadas "(pesquisa)" estão conferidas em `../pesquisa-cores-e-desenhos.md`, com as fontes lá.

Objetos
- Régua-tê desde o século XVII; esquadro com ela no começo do século XIX: Smithsonian, National
  Museum of American History, "T-Squares", <https://americanhistory.si.edu/collections/object-groups/squares-triangles/t-squares>.
- Cianotipia (Herschel, 1842; "azul da Prússia"; cópia de plantas desde os anos 1870 até os anos
  1940; um décimo do custo nos anos 1890): Mike Ware, "A Blueprint for Conserving Cyanotypes",
  <https://resources.culturalheritage.org/pmgtopics/2003-volume-ten/10_02_Ware.html>; Harry Ransom
  Center, <https://sites.utexas.edu/ransomcentermagazine/2010/12/07/from-blue-skies-to-blue-print-astronomer-john-herschels-invention-of-the-cyanotype/>;
  University of Houston, "Engines of Our Ingenuity", <https://uh.edu/engines/epi3269.htm>; Wikipedia,
  "Architectural reprography", <https://en.wikipedia.org/wiki/Architectural_reprography>.
- Hollerith (1880 em sete anos; concurso de 1888, 72,5 h; copos de mercúrio; seis meses; cartão do
  tamanho do dólar): U.S. Census Bureau, <https://www.census.gov/about/history/bureau-history/census-innovations/technology/hollerith-machine.html>;
  Columbia University Computing History, <https://www.columbia.edu/cu/computinghistory/census-tabulator.html>;
  Douglas W. Jones, <https://homepage.divms.uiowa.edu/~jones/cards/history.html>; Computer History
  Museum, <https://www.computerhistory.org/revolution/punched-cards/2/2>; IBM,
  <https://ibm.com/history/punched-card-tabulator>.
- Jacquard (1804; Bouchon, Falcon, Vaucanson; retrato de 1839 com 24.000 cartões; Babbage, 1840;
  Lovelace): Wikipedia, <https://en.wikipedia.org/wiki/Joseph_Marie_Jacquard>; Columbia,
  <https://www.columbia.edu/cu/computinghistory/jacquard.html>; Science History Institute, "The French
  Connection", <https://www.sciencehistory.org/stories/magazine/the-french-connection/>; The Henry
  Ford, <https://www.thehenryford.org/collections-and-research/digital-collections/artifact/219008/>;
  Computer History Museum, <https://computerhistory.org/blog/artifact-adopted-preserving-the-legend-of-j-m-jacquard/>.
- Tubo pneumático (Latimer Clark, 1853–54; 220 jardas; bolsas de feltro; 6 cv; 21 milhas em 1880):
  B. C. Batcheller, *The Pneumatic Despatch Tube System* (Project Gutenberg),
  <https://www.gutenberg.org/files/63952/63952-h/63952-h.htm>; Wikipedia, "Pneumatic tube",
  <https://en.wikipedia.org/wiki/Pneumatic_tube>, e "Josiah Latimer Clark",
  <https://en.wikipedia.org/wiki/Josiah_Latimer_Clark>; The Postal Museum,
  <https://www.postalmuseum.org/blog/the-beginnings-of-the-pneumatic-railway/>. Paris (1866, 1879,
  *petit bleu* em papel azul 1897–1902, 427 km em 1934, 1984): Wikipedia, "Paris pneumatic post",
  <https://en.wikipedia.org/wiki/Paris_pneumatic_post>; Warwick & Warwick, "The pneumatic posts of
  Europe", <https://www.warwickandwarwick.com/resources/articles-library/pneumatic-posts-of-europe>;
  <http://www.coppoweb.com/pneuma/book3.html>. Lamson (patente de 1881, Boston 1882): Wikipedia,
  "Cash carrier", <https://en.wikipedia.org/wiki/Cash_carrier>; Grace's Guide,
  <https://www.gracesguide.co.uk/Lamson_Store_Service_Co>; Atlas Obscura,
  <https://www.atlasobscura.com/articles/the-rise-and-fall-of-the-cash-railway>.
- Prensas de ferro (Stanhope c. 1800, exemplar de 1804; Columbian 1813; Albion c. 1820, registro de
  1822, "toggle", até os anos 1930, Kelmscott): Wikipedia, "Albion press",
  <https://en.wikipedia.org/wiki/Albion_press>, e "Columbian press",
  <https://en.wikipedia.org/wiki/Columbian_press>; Powerhouse Collection, "Stanhope printing press",
  <https://collection.powerhouse.com.au/object/238244>; American Printing History Association,
  <https://printinghistory.org/restoring-a-coisne-stanhope-hand-press/>.
- Telégrafo (24/05/1844; fita em relevo; a ponta de aço de Vail; o relato da caixa de tipos):
  Smithsonian, <https://www.si.edu/object/what-hath-god-wrought-telegraph-message:nmah_713485>;
  Library of Congress, <https://www.loc.gov/item/mcc.019/> e
  <https://www.loc.gov/static/collections/samuel-morse-papers/articles-and-essays/collection-highlights/invention-of-the-telegraph.html>;
  Smithsonian Institution Archives, <https://siarchives.si.edu/blog/forgotten-history-alfred-vail-and-samuel-morse>;
  Wikipedia, "Morse code", <https://en.wikipedia.org/wiki/Morse_code>, e "Alfred Vail",
  <https://en.wikipedia.org/wiki/Alfred_Vail>.
- Fonógrafo (1877; "The Phonograph and Its Future", 1878; cera marrom 1888–1902; fonógrafos de
  ficha): Edison, *North American Review* 126 (262), 1878, pp. 527–536,
  <https://archive.org/details/jstor-25110210>; UCSB Cylinder Audio Archive,
  <https://cylinders.library.ucsb.edu/history-wax.php>; Bill Klinger, Library of Congress,
  <https://www.loc.gov/static/programs/national-recording-preservation-board/documents/klinger.pdf>;
  Wikipedia, "Phonograph cylinder", <https://en.wikipedia.org/wiki/Phonograph_cylinder>.
- Mesa telefônica (lâmpada da linha com a bateria central, fim dos anos 1890; mesa "Standard" de
  1881): Wikipedia, "Telephone exchange", <https://en.wikipedia.org/wiki/Telephone_exchange>;
  Telephone Tribute, "Survey of Telephone Switching, Chapter 3",
  <https://www.telephonetribute.com/switches_survey_chapter_3.html>; patente US 817.867 (sinais de
  supervisão), <https://patents.google.com/patent/US817867A/en>.
- Fechadura detectora (1817, 1818, 1824, o presidiário, Correios e prisões, Hobbs em 1851):
  Wikipedia, "Chubb detector lock", <https://en.wikipedia.org/wiki/Chubb_detector_lock>, e "Chubb
  Locks", <https://en.wikipedia.org/wiki/Chubb_Locks>; <https://www.antiquebox.org/chubb-detector-lock/>;
  Mental Floss, <https://www.mentalfloss.com/article/501820/man-who-picked-victorian-londons-unpickable-lock>.
- Relógios de Huygens (cartas de 22, 24, 26 e 27/02/1665; relógios marítimos; provas no mar
  1662–1665; a Royal Society): Bennett, Schatz, Rockwood e Wiesenfeld, "Huygens's clocks", *Proc. R.
  Soc. A* 458 (2002), <https://cdanfort.w3.uvm.edu/courses/266/huygens.pdf>; Willms, Kitanov e
  Langford, "Huygens' clocks revisited", *R. Soc. Open Sci.* 4 (2017),
  <https://royalsocietypublishing.org/doi/abs/10.1098/rsos.170777>; Mahoney, "Christian Huygens: The
  Measurement of Time and of Longitude at Sea",
  <http://www.princeton.edu/~hos/Mahoney/articles/huygens/timelong/timelong.html.old>; American
  Scientist, <https://www.americanscientist.org/article/huygenss-clocks-revisited>.
- Regulador de Watt (1788; Boulton; moinhos; 75.000 em 1868; Maxwell 1868; "hunting"; Wiener e
  *kubernetes*): F. L. Lewis, "A Brief History of Feedback Control", <https://lewisgroup.uta.edu/history.htm>;
  Manhattan Rare Book Company, "On Governors", <https://www.manhattanrarebooks.com/pages/books/958/james-clerk-maxwell/on-governors>;
  Wikipedia, "Feedback", <https://en.wikipedia.org/wiki/Feedback>.
- Fio de prumo (Egito, III dinastia; Senedjem; arquipêndulo; *plumbum*): Wikipedia, "Plumb bob",
  <https://en.wikipedia.org/wiki/Plumb_bob>; Britannica, "Plumb line",
  <https://www.britannica.com/technology/plumb-line>; Sparavigna, "The architect Kha's protractor",
  <https://arxiv.org/pdf/1107.4946>.
- Caixa registradora, central de New Haven: pesquisa.

Cores
- Lacre vermelho (cinábrio e vermelhão; goma-laca no século XVII; quebradiço para mostrar a
  violação; de autenticação a segurança a partir do século XIII): Shannon Selin, "Of Sealing Wax and
  Emperor Francis", <https://shannonselin.com/2018/03/sealing-wax-emperor-francis/>; Scriptum, "Of
  shoes and ships and sealing wax", <https://www.scriptum.co.uk/blogs/scriptumblog/11718681-of-shoes-and-ships-and-sealing-wax>;
  <https://codycalligraphy.com/blog/wax-seals-history/>.
- Negro de fumo e óleo de linhaça: National Diet Library (Japão), "Art of printing",
  <https://www.ndl.go.jp/incunabula/e/chapter1/chapter1_01.html>; Winsor & Newton, "Lamp Black",
  <https://www.winsornewton.com/blogs/articles/lamp-black>; Wikipedia, "Ink",
  <https://en.wikipedia.org/wiki/Ink>.
- Vitríolo azul e a pilha de gravidade: Telegraph & Scientific Instrument Museums (W1TP), "Early
  batteries", <https://qsl.net/w1tp/imbatt.htm>; Wikipedia, "Daniell cell",
  <https://en.wikipedia.org/wiki/Daniell_cell>.
- *Petit bleu*, cera marrom, cianotipia, chumbo: as mesmas fontes dos objetos.
- Verde-de-máquina (Brunswick green; BS 381C 225–227): CAMEO (MFA Boston),
  <https://cameo.mfa.org/wiki/Brunswick_green>; Paragon Paints, <https://www.paragonpaints.co.uk/Stationary-Engine-Colours.html>.
- Roxo de mimeógrafo, garança, verde-água, verde-cédula, azul-marinho, amarelo de cautela: pesquisa.
