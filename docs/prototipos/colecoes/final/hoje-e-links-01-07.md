# A ligação com hoje e os links: livros 01 a 07

Pedido do Cesar (01/10/2026), a partir da frase do Frontend que ele gostou ("O vocabulário do CSS
vem dela"): conferir se ela é verdadeira, procurar em cada livro uma ligação **verdadeira** entre a
máquina antiga e algo que o desenvolvedor usa hoje (uma palavra, um nome, um padrão, uma
ferramenta, um número) e escolher **um único link** sobre cada máquina. Este arquivo cobre os
livros 01 a 07; os livros 08 a 13 estão com outro pesquisador. Os textos de partida são os de
`textos-desenho-v1.md`; a pesquisa anterior está em `direcao-de-arte.md` (seção 2) e `critica.md`.

Como foi feito: só pela busca na web (o acesso direto a sites está bloqueado neste ambiente). Todo
URL abaixo foi devolvido pela busca, com o título da página. Cada ligação está classificada como
**fato conferido** (está numa fonte que a busca devolveu), **relato** (está em fonte secundária com
"segundo se conta"; vai dito como relato) ou **só metáfora** (não há história por trás; vai dita
como metáfora). O que não se sustentou está na seção "O que foi descartado", no fim.

Regras dos textos: completo com até umas 5 frases e a última dizendo o que o traço tracejado
mostra; curto com 1 ou 2 frases, até uns 180 caracteres, para o hover. Sem travessão de aparte, sem
"não X, mas Y", sem frase de efeito. O que já estava bom ficou.

## Resumo

| Vol. | Livro | A ligação com hoje | Classificação | O link |
|---|---|---|---|---|
| 01 | Arquitetura de Software | a palavra **blueprint**: da cópia em cianotipia (1882) a "plano detalhado" (1926) e a nome de ferramenta (Flask Blueprints, EKS Blueprints) | fato conferido | Wikipedia, "Blueprint" |
| 02 | Dados | a empresa de Hollerith virou a IBM; o cartão IBM de **80 colunas** (1928) deu as 80 colunas do terminal e o limite de 79/80 caracteres dos guias de estilo (PEP 8) | fato conferido | U.S. Census Bureau, "The Hollerith Machine" |
| 03 | Desenvolvimento de Software | o cartão perfurado programou computadores até os anos 1970; o Java chamou de **Loom** (tear) o projeto das virtual threads (Java 21) | fato conferido (o nome); o trocadilho com threads é da comunidade, não de quem batizou | Science and Industry Museum, "Programming patterns: the story of the Jacquard loom" |
| 04 | DevOps | nenhuma verdadeira: cápsula = contêiner e tubo = pipeline são **só metáfora**, e as palavras de hoje vêm do navio (contêiner) e do processador (pipeline). O que é fato: o tubo ainda trabalha em hospitais e bancos. **Recomendo manter o tubo** | só metáfora (dita como metáfora) + fato (ainda em uso) | Wikipedia, "Pneumatic tube" |
| 05 | Frontend | **confirmado**: font, leading, kerning, em, uppercase e lowercase vêm da composição com tipos de metal, a oficina que alimentava a prensa (a CSS 2.1 chama de leading a diferença entre line-height e o corpo da fonte; `font-kerning` e `text-transform: uppercase` existem) | fato conferido | Wikipedia, "Albion press" |
| 06 | Fundamentos | o **baud** (de Baudot, engenheiro de telégrafo); o **ASCII** descende dos códigos de telégrafo impressor, e **CR e LF** entraram em 1901 para comandar o teleimpressor; o **@** entrou no código Morse em 2004, para e-mail | fato conferido | Smithsonian, "What Hath God Wrought" Telegraph Message |
| 07 | IA | o **Mechanical Turk** da Amazon (2005) tem o nome do Turco; **Babbage jogou contra ele em 1819** e perdeu; havia um enxadrista escondido | fato conferido | Wikipédia em português, "O Turco" |

Nenhum desenho precisa trocar. O único em que a troca foi avaliada a fundo é o DevOps (seção 04): os
candidatos com ligação verdadeira (canário, contêiner, pipeline) estão todos fora da janela de 1657
a 1890, e nenhum objeto da era, dentro de uma sala, dá nome a um termo de DevOps.

---

## 01 Arquitetura de Software: a prancheta com a planta e a régua-tê

### A ligação com hoje

**Fato conferido.** A palavra inglesa *blueprint* nasceu da cópia em cianotipia: o substantivo é de
1882 (*blue* + *print*), e o sentido figurado de "plano detalhado" está atestado desde 1926
(Etymonline). O próprio nome "cianotipia" é grego para "impressão azul" (*kyáneos*, azul-escuro;
*týpos*, marca). A cianotipia foi o processo de cópia de plantas e desenhos técnicos até os anos
1940; quando o diazo trocou o fundo para branco, o nome ficou (Wikipedia, "Blueprint"; Mike Ware,
AIC: "o processo deu à nossa língua uma palavra indelével: o blueprint"). Hoje a palavra é nome de
ferramenta de desenvolvedor: os **Blueprints do Flask** (a documentação oficial: "um blueprint de
como construir ou estender uma aplicação") e os **Amazon EKS Blueprints** para Terraform, da AWS,
além do uso corrente ("o blueprint da arquitetura").

Precisão: o blueprint é a cópia, não o desenho. O desenho se fazia na prancheta, com a régua-tê (em
uso desde o século XVII: Smithsonian, "T-Squares"); das salas de desenho saíam as cópias azuis. O
texto já dizia isso e continua dizendo.

Fontes: Etymonline, "Blueprint" (<https://www.etymonline.com/word/blueprint>); Wikipedia,
"Blueprint" (<https://en.wikipedia.org/wiki/Blueprint>); Wikipedia, "Cyanotype"
(<https://en.wikipedia.org/wiki/Cyanotype>); Mike Ware, "A Blueprint for Conserving Cyanotypes",
AIC (<https://resources.culturalheritage.org/pmgtopics/2003-volume-ten/10_02_Ware.html>); Flask,
"Modular Applications with Blueprints" (<https://flask.palletsprojects.com/en/stable/blueprints/>);
AWS, "Amazon EKS Blueprints for Terraform" (<https://aws-ia.github.io/terraform-aws-eks-blueprints/>);
Smithsonian, "T-Squares"
(<https://americanhistory.si.edu/collections/object-groups/squares-triangles/t-squares>).

### Textos revisados

**Completo:** A prancheta do desenhista, com a régua-tê (em uso desde o século XVII) e a planta
presa por percevejos. Das salas de desenho saíam as cópias em cianotipia, azuis, o blueprint, padrão
de 1870 aos anos 1940. A relação com o livro: arquitetura é decidir antes de construir; na
prancheta, mudar uma parede custa apagar uma linha, e depois da obra custa derrubar a parede. A
palavra blueprint sobreviveu ao processo: desde 1926 quer dizer plano detalhado, e hoje dá nome a
ferramenta de desenvolvedor (Flask Blueprints, EKS Blueprints). A parede tracejada na planta é uma
decisão desfeita ainda no papel.

**Curto:** Prancheta com régua-tê (século XVII): é no papel que se decide o que depois fica caro
desfazer. A cópia azul da planta deu a palavra blueprint, que hoje quer dizer plano.

### O link

**Wikipedia, "Blueprint"**: <https://en.wikipedia.org/wiki/Blueprint>. É a única página que conta a
coisa inteira numa só: Herschel (1842), a adoção nas salas de desenho, o padrão até os anos 1940 e a
palavra que sobreviveu ao processo. Alternativas: Smithsonian, "T-Squares" (só a régua-tê) e Harry
Ransom Center, "From blue skies to blue print" (só Herschel:
<https://sites.utexas.edu/ransomcentermagazine/2010/12/07/from-blue-skies-to-blue-print-astronomer-john-herschels-invention-of-the-cyanotype/>).

### Desenho

Fica.

---

## 02 Dados: o tabulador de Hollerith (1890)

### A ligação com hoje

**Fato conferido.** Hollerith fundou a Tabulating Machine Company em 1896, vendeu-a em 1911 para a
Computing-Tabulating-Recording Company, que em 1924 virou a IBM (Census Bureau; Smithsonian; IBM).
O cartão IBM de **80 colunas** (1928), descendente direto do cartão do censo, manteve o tamanho que
Hollerith tinha fixado, 7⅜ × 3¼ polegadas, o da cédula de dólar da época (Douglas W. Jones,
Columbia). Os primeiros terminais de vídeo adotaram 80 colunas para ficarem compatíveis com os
sistemas de cartão, e o VT100 e o modo texto do IBM PC (80 × 24 e 80 × 25) fixaram o padrão
(Wikipedia, "Characters per line"; Ken Shirriff: "a origem das linhas de 80 colunas é claramente o
cartão perfurado"). O **PEP 8** limita a linha a **79 caracteres** "para evitar a quebra em editores
com a janela de 80 colunas" (texto do PEP 8), e o Linux e o FreeBSD mantiveram 80 por décadas.

Precisão: o PEP 8 cita a janela de 80 colunas, não o cartão; o passo "terminal de 80 ← cartão de
80" é o que as fontes históricas (Shirriff, Wikipedia) confirmam. O cartão do censo de 1890 tinha
24 colunas e 3¼ × 6⅝ polegadas; o tamanho da cédula e as 80 colunas são da linhagem, não da
máquina de 1890. O texto diz "o cartão de 80 colunas que ela lançou em 1928" por isso.

Fontes: U.S. Census Bureau, "The Hollerith Machine"
(<https://www.census.gov/about/history/bureau-history/census-innovations/technology/hollerith-machine.html>);
Smithsonian, "From Herman Hollerith to IBM"
(<https://americanhistory.si.edu/collections/object-groups/tabulating-equipment/from-herman-hollerith-to-ibm>);
IBM, "The punched card tabulator" (<https://ibm.com/history/punched-card-tabulator>); Douglas W.
Jones, "Punched card history" (<https://homepage.divms.uiowa.edu/~jones/cards/history.html>);
Wikipedia, "Characters per line" (<https://en.wikipedia.org/wiki/Characters_per_line>); Ken
Shirriff, "IBM, sonic delay lines, and the history of the 80×24 display"
(<http://www.righto.com/2019/11/ibm-sonic-delay-lines-and-history-of.html>); PEP 8
(<https://peps.python.org/pep-0008/>); History of Information, "IBM Adopts the Eighty-Column
Punched Card" (<https://www.historyofinformation.com/detail.php?id=596>).

### Textos revisados

O completo de partida não tinha a frase do traço tracejado (o cartão caindo na gaveta certa, pela
direção de arte); entrou aqui.

**Completo:** O tabulador de Herman Hollerith apurou o censo dos Estados Unidos de 1890: o censo
anterior levou cerca de sete anos para ser contado, e com a máquina a contagem saiu em seis meses.
Cada pessoa virou um cartão perfurado: a prensa lia os furos, os mostradores somavam e o separador
mandava o cartão para a gaveta certa. A relação com o livro: o cartão é onde o dado mora (a posição
do furo é a coluna) e a máquina é por onde ele anda (ler, somar, separar). A empresa de Hollerith
virou a IBM, e o cartão de 80 colunas que ela lançou em 1928 é o motivo de o terminal ter 80 colunas
e de tanto guia de estilo ainda pedir linha de 79 ou 80 caracteres. O cartão tracejado está caindo
na gaveta certa.

**Curto:** Tabulador de Hollerith (1890): contou o censo americano lendo cartões perfurados. A
empresa virou a IBM, e das 80 colunas do cartão vêm as 80 do terminal e da linha de código.

### O link

**U.S. Census Bureau, "The Hollerith Machine"**:
<https://www.census.gov/about/history/bureau-history/census-innovations/technology/hollerith-machine.html>.
É a instituição para a qual a máquina foi feita contando a história dela: o concurso de 1888 (72,5
horas contra 100,5 e 144,5), como a prensa, os mostradores e o separador funcionavam, o uso até os
anos 1950 e o fim na IBM. Alternativa: Smithsonian, "From Herman Hollerith to IBM" (os objetos).

### Desenho

Fica. Reforça o pedido da crítica: o cartão com furos à vista no ícone, porque é o cartão (e não
os mostradores) que o desenvolvedor reconhece e que carrega a ligação com hoje.

---

## 03 Desenvolvimento de Software: o tear de Jacquard (1804)

### A ligação com hoje

Duas, com classificações diferentes:

1. **Fato conferido.** O cartão perfurado do tear virou o cartão de Babbage (c. 1830) e o de
   Hollerith (1890), e foi o meio principal de entrada e de programação dos computadores até os anos
   1970 (Computer History Museum: "até os anos 1970, os cartões perfurados continuaram o principal
   meio de entrada e armazenamento, de dados e depois de programas"; Columbia: "até meados dos anos
   1970, a maior parte do acesso a computadores era por cartões perfurados"). A linguagem **Ada**
   (1980, Departamento de Defesa dos EUA) tem o nome de Ada Lovelace, e a norma MIL-STD-1815 leva o
   ano em que ela nasceu (Wikipedia, "Ada (programming language)").
2. **Fato conferido (o nome); o motivo do nome é da comunidade, não de quem batizou.** O projeto do
   OpenJDK que trouxe as virtual threads (Java 21) chama-se **Project Loom**, tear; a proposta
   original de Ron Pressler (2017) se chamava "Project Loom: Fibers and Continuations for the Java
   Virtual Machine", e as threads leves se chamaram *fibers* (fibras) até virarem "virtual threads".
   A explicação de que o nome é o tear que tece threads é repetida pela comunidade (Hacker News:
   "é Loom porque um tear tece fios em pano") e é a única que faz sentido com *fibers*, mas não achei
   declaração de Pressler ou de Brian Goetz sobre a escolha do nome. O texto diz só o que é fato: o
   nome e o que ele trouxe, e que um tear tece threads. Não diz que o nome veio de Jacquard.

Para o texto da capa usei a 2, porque é um nome que o leitor deste blog usa (o post do Java 21 é
sobre as virtual threads) e porque é o tear em pessoa; a 1 entrou numa frase, para dar a linhagem.

Fontes: Computer History Museum, "Punched Cards & Paper Tape"
(<https://www.computerhistory.org/revolution/memory-storage/8/326>) e "Creating a Digital Code"
(<https://www.computerhistory.org/revolution/punched-cards/2/211>); Columbia, "IBM Punch Cards"
(<https://columbia.edu/cu/computinghistory/cards.html>); Wikipedia, "Ada (programming language)"
(<https://en.wikipedia.org/wiki/Ada_(programming_language)>); Ron Pressler, "Project Loom: Fibers
and Continuations for the Java Virtual Machine"
(<https://cr.openjdk.org/~rpressler/loom/Loom-Proposal.html>); OpenJDK Wiki, "Loom"
(<https://wiki.openjdk.org/spaces/loom/pages/37191722/Main>); Ron Pressler, "State of Loom" (o
porquê de "virtual threads" no lugar de "fibers":
<https://cr.openjdk.org/~rpressler/loom/loom/sol1_part1.html>); Hacker News, "Why Continuations Are
Coming to Java" (<https://news.ycombinator.com/item?id=20332262>).

### Textos revisados

**Completo:** O tear de Jacquard, patenteado em 1804, lê uma cadeia de cartões perfurados: cada
cartão diz quais fios levantar numa passada, e trocando os cartões a mesma máquina tece outro
desenho. Babbage se inspirou nele para a Máquina Analítica, e Ada Lovelace escreveu que ela tecia
padrões algébricos como o tear de Jacquard tece flores e folhas. A relação com o livro: é a primeira
máquina comandada por um programa separado dela, e escrever esse programa é o ofício do
desenvolvedor. O cartão perfurado continuou sendo o jeito de programar computadores até os anos
1970, e o Java chamou de Loom, tear, o projeto que trouxe as virtual threads no Java 21: um tear é o
que tece threads. O cartão tracejado é a próxima instrução chegando.

**Curto:** Tear de Jacquard (1804): a primeira máquina guiada por um programa em cartões perfurados,
trocável sem trocar a máquina. O Java chamou de Loom, tear, o projeto das virtual threads.

### O link

**Science and Industry Museum (Manchester), "Programming patterns: the story of the Jacquard
loom"**: <https://www.scienceandindustrymuseum.org.uk/objects-and-stories/jacquard-loom>. Página de
museu que explica o mecanismo como um desenvolvedor gosta: o padrão pintado em papel quadriculado,
o cartão furado linha a linha (furo levanta, sem furo deixa), o trabalho do "draw boy" que a máquina
substituiu, e a ideia de código binário dito com todas as letras. Alternativas: Computer History
Museum, "1801: Punched cards control Jacquard loom"
(<https://www.computerhistory.org/storageengine/punched-cards-control-jacquard-loom/>; usa a data da
demonstração, 1801, e não a da patente) e Columbia, "The Jacquard Loom"
(<https://www.columbia.edu/cu/computinghistory/jacquard.html>).

### Desenho

Fica.

---

## 04 DevOps: a estação de tubo pneumático (1853)

### A ligação com hoje

**Só metáfora, dita como metáfora.** A cápsula no papel do contêiner e o tubo no papel do pipeline
não têm história por trás, e as palavras de hoje vêm de outro lugar, com fonte:

- **Pipeline.** Jez Humble e David Farley, que cunharam "deployment pipeline" (*Continuous
  Delivery*, 2010), explicam numa caixa do livro, "The Origin of the Term 'Deployment Pipeline'",
  que o nome não veio de um líquido correndo num cano: veio do *pipelining* de instruções do
  processador. Farley repete isso no LinkedIn.
- **Contêiner.** O contêiner do Docker é o contêiner marítimo: Solomon Hykes apresentou o Docker em
  2013 com a analogia do contêiner padronizado, e "docker" é o estivador. O contêiner de McLean é
  de 1956 (o Ideal X, Newark). Tudo fora da janela de 1657 a 1890.
- **Canary release.** O canário das minas é prática de depois da janela: Haldane propôs animais
  sentinela depois do desastre de Tylorstown (1896), os primeiros relatos dele falam de camundongos,
  os canários entram em livros no começo do século XX, a lei britânica os exigiu em 1911 e eles
  saíram das minas em 1986 (Smithsonian Magazine, Mental Floss). Além da data, é um bicho numa
  mina, não uma máquina numa sala.

O que **é fato** e liga o objeto a hoje: o tubo pneumático ainda trabalha. Hospitais o usam para
levar amostras e remédios (o de Stanford tem uns 6 km de tubo e manda 7.000 amostras por dia), e
bancos ainda o têm no drive-through (Wikipedia, "Pneumatic tube"; HowStuffWorks; Hackaday). É o
objeto que o leitor viu funcionando.

**Recomendação: manter o tubo**, com a metáfora dita como metáfora e as palavras de hoje
atribuídas ao lugar certo numa frase. Motivos: (1) dentro do princípio da coleção ("a máquina que
fazia o trabalho do livro"), o trabalho do DevOps é levar a coisa de onde é feita até onde é usada
sem ninguém carregar, e o tubo faz exatamente isso, com a mesma motivação de 1853 (tirar o
mensageiro do caminho); (2) nenhum objeto de 1657 a 1890, dentro de uma sala, dá nome a um termo de
DevOps (conferi canário, contêiner, pipeline, Docker; o leme de Kubernetes é de navio, já é ícone da
tag Kubernetes e a raiz grega já está no regulador de Watt, no SRE); (3) a alternativa que a direção
deixou, a máquina a vapor com volante, lê "motor" e não "entrega", como a crítica já disse. A ligação
verdadeira deste livro é a mais modesta das sete, e é melhor dizer isso do que forçar uma.

Fontes: Jez Humble e David Farley, "Continuous Delivery: Anatomy of the Deployment Pipeline"
(InformIT, <https://www.informit.com/articles/article.aspx?p=1621865>); Dave Farley, "How To Build
A Deployment Pipeline" (<https://www.linkedin.com/pulse/how-build-deployment-pipeline-dave-farley>);
Forbes, "Docker Turns 3" (<https://www.forbes.com/sites/mikekavis/2016/03/18/docker-turns-3-what-a-ride-it-has-been/>);
Linux Foundation, "What is Docker, Really? Founder Solomon Hykes Explains"
(<https://www.linuxfoundation.org/blog/blog/what-is-docker-really-founder-solomon-hykes-explains>);
Smithsonian Magazine, "What Happened to the Canary in the Coal Mine?"
(<https://www.smithsonianmag.com/smart-news/what-happened-canary-coal-mine-story-how-real-life-animal-helper-became-just-metaphor-180961570/>);
Mental Floss, "The Dark History Behind the Phrase 'Canary in the Coal Mine'"
(<https://www.mentalfloss.com/language/canary-in-the-coal-mine-phrase-origins>); Wikipedia,
"Pneumatic tube" (<https://en.wikipedia.org/wiki/Pneumatic_tube>); HowStuffWorks, "How a Pneumatic
Tube Works" (<https://electronics.howstuffworks.com/everyday-tech/pneumatic-tubes.htm>); Hackaday,
"Tech In Plain Sight: Pneumatic Tubes" (<https://hackaday.com/2025/11/17/tech-in-plain-sight-pneumatic-tubes/>).

### Textos revisados

**Completo:** A estação de tubo pneumático: em 1853, em Londres, Latimer Clark ligou a central de
telégrafos à Bolsa por um tubo em que as mensagens viajavam numa cápsula puxada pelo ar, para não
depender de mensageiros correndo entre os prédios. Paris abriu a sua rede ao público em 1879, e o
tubo trabalha até hoje em hospitais e bancos. A relação com o livro: é o caminho automático do lugar
onde algo é feito até o lugar onde ele é usado, e ninguém carrega nada na mão. Como imagem, a
cápsula faz o papel do contêiner e o tubo, o do pipeline (as palavras de hoje vêm do navio e do
processador). A cápsula tracejada é a entrega a caminho.

**Curto:** Tubo pneumático (1853): a cápsula ia de uma estação a outra sem ninguém carregar, e ainda
vai, em hospitais e bancos. Como imagem, a cápsula é o contêiner e o tubo, o pipeline.

### O link

**Wikipedia, "Pneumatic tube"**: <https://en.wikipedia.org/wiki/Pneumatic_tube>. Cobre Latimer
Clark e a Electric Telegraph Company (1853), Paris, as lojas, e o uso de hoje em hospitais e bancos,
numa página só. Nenhuma página de museu que a busca devolveu cobre a história inteira (o Postal
Museum britânico trata só da ferrovia pneumática de Londres).

### Desenho

Fica, com as condições que a crítica já pôs (a cápsula grande no balcão, a fantasma dentro do tubo
e à vista). A troca foi avaliada acima e não compensa.

---

## 05 Frontend: a prensa tipográfica de ferro (Albion, c. 1820)

### A ligação com hoje

**Fato conferido, com uma precisão.** A frase é verdadeira: o vocabulário do CSS é o do tipógrafo.
A precisão: esse vocabulário vem da **composição com tipos móveis de metal** (a caixa de tipos, o
componedor, a rama), a oficina que alimentava a prensa, e não do mecanismo da prensa em si. A
Albion imprimia o tipo de metal composto à mão, então a prensa é da mesma oficina; o texto diz "o
tipo de metal que ela imprimia" para ficar exato. Palavra por palavra:

- **font**: do francês médio *fonte*, "fundição": o jogo completo de tipos de um corpo e um desenho,
  fundido de uma vez (Wikipedia, "Font"; Wordnik/AHD). Em CSS, `font-family`, `font-size`.
- **leading**: as tiras de chumbo (*lead*, daí a pronúncia "léding") que o compositor punha entre
  as linhas de tipo para afastá-las; a espessura da tira é o leading (Wikipedia, "Leading"). A
  **CSS 2.1, seção 10.8.1 "Leading and half-leading"**, chama de leading (L) a diferença entre
  `line-height` e a altura da fonte (A + D), e reparte metade acima e metade abaixo (W3C). O
  Tailwind chama as classes de `line-height` de `leading-*`.
- **kerning**: *kern* é, desde a década de 1680, "a parte do tipo de metal que sobra do corpo", como
  a cabeça do f ou a cauda do j, para encostar na letra vizinha (Etymonline; Wikipedia, "Kerning").
  Em CSS, `font-kerning` (MDN).
- **em**: a unidade é o corpo do tipo (o tamanho em pontos); a explicação "largura do M" é popular
  e os textos mais antigos (1683) não a usam (Wikipedia, "Em (typography)"). Em CSS, `em` e `rem`.
- **uppercase e lowercase**: as duas caixas de tipos do compositor, a de cima com as maiúsculas e a
  de baixo com as minúsculas, mais usadas e por isso mais perto da mão (Wikipedia, "Letter case";
  Snopes, "verdadeiro"). Em CSS, `text-transform: uppercase`.

Um detalhe que não entrou no texto, por ser de blog: Bert Bos e Håkon Lie chegaram a rascunhar uma
propriedade `font-leading` antes de decidirem pelo `line-height` com meio leading em cima e meio
embaixo (Matthias Ott, "The Thing With Leading in CSS"). Fica como curiosidade para o Cesar, não
como fato de capa.

Fontes: Wikipedia, "Font" (<https://en.wikipedia.org/wiki/Font>); Wordnik, "font"
(<https://www.wordnik.com/words/font>); Wikipedia, "Leading" (<https://en.wikipedia.org/wiki/Leading>);
W3C, CSS 2.1, "10 Visual formatting model details" (<https://www.w3.org/TR/CSS2/visudet.html>);
MDN, "Leading" (<https://developer.mozilla.org/en-US/docs/Glossary/Leading>); Tailwind, "line-height"
(<https://tailwindcss.com/docs/line-height>); Etymonline, "Kern" (<https://www.etymonline.com/word/kern>);
Wikipedia, "Kerning" (<https://en.wikipedia.org/wiki/Kerning>); MDN, "font-kerning"
(<https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-kerning>); Wikipedia,
"Em (typography)" (<https://en.wikipedia.org/wiki/Em_(typography)>); Wikipedia, "Letter case"
(<https://en.wikipedia.org/wiki/Letter_case>); Wikipedia, "Type case"
(<https://en.wikipedia.org/wiki/Type_case>); Snopes, "Why we call capitalized letters 'uppercase'"
(<https://www.snopes.com/fact-check/letters-capitalized-lowercase-uppercase/>); Matthias Ott, "The
Thing With Leading in CSS" (<https://matthiasott.com/notes/the-thing-with-leading-in-css>).

### Textos revisados

**Completo:** A prensa tipográfica de ferro Albion, criada em Londres por volta de 1820, a prensa
manual mais popular da Grã-Bretanha, fabricada até os anos 1930. Nela, tipo, tinta e papel viram a
página que o leitor vê. A relação com o livro: frontend é a página que chega à pessoa, e o
vocabulário do CSS vem da oficina que compunha o tipo de metal para a prensa. Font é o jogo de tipos
fundido de uma vez; leading é a tira de chumbo entre as linhas; kern é a parte do tipo que sobra do
corpo; em é o corpo do tipo; e uppercase e lowercase são as duas caixas em que o tipógrafo guardava
as letras, a de cima com as maiúsculas. A folha tracejada é a página saindo da prensa.

**Curto:** Prensa tipográfica Albion (c. 1820): tipo, tinta e papel viram a página que o leitor vê.
O vocabulário do CSS (font, leading, kerning, uppercase) vem do tipo de metal que ela imprimia.

### O link

**Wikipedia, "Albion press"**: <https://en.wikipedia.org/wiki/Albion_press>. Tem o que nenhuma
página de museu devolvida pela busca tem junto: Cope e a articulação (c. 1820), os sucessores
(Hopkinson & Cope, Harrild, Ullmer), a Kelmscott de William Morris, a fabricação até os anos 1930 e
as Albions que a Rochat ainda faz. Alternativa de museu: National Print Museum (Dublin), "Albion
Printing Press" (<https://www.nationalprintmuseum.ie/collections/albion-printing-press/>).

### Desenho

Fica. A ligação pede, como a crítica já pediu, a forma de tipos no leito e a folha impressa com
corpo: é o tipo que carrega o vocabulário.

---

## 06 Fundamentos: o telégrafo de Morse, a chave e o registrador (1844)

### A ligação com hoje

**Fato conferido.** Três coisas que o desenvolvedor usa hoje descem do telégrafo:

- **baud**: a unidade de taxa de símbolos (a das portas seriais, do `stty`, dos modems) foi definida
  em 1926 pelo CCITT em honra de Émile Baudot (1845–1903), engenheiro de telégrafo francês, autor do
  código de 5 bits de 1870 e do telégrafo impressor multiplexado (Wikipedia, "Baud" e "Émile
  Baudot").
- **ASCII, CR e LF**: o ASCII (1963) é o fim de uma linhagem de códigos de telégrafo impressor:
  Baudot (1870) → Murray (1901) → ITA2 (1932) → ASCII. Foi o código de Murray, em 1901, que
  introduziu os primeiros caracteres de controle, **CR** (carriage return) e **LF** (line feed), para
  posicionar a roda de impressão e avançar o papel do teleimpressor; o ITA2 também tinha **BEL**, que
  tocava a campainha (Wikipedia, "Baudot code"; Eric Fischer, "The Evolution of Character Codes,
  1874–1968"). O `\r\n` que todo desenvolvedor já brigou num arquivo de texto é uma ordem para uma
  máquina de 1901.
- **o @ no código Morse**: em 24 de maio de 2004, 160 anos depois de "What hath God wrought", a UIT
  acrescentou o @ ao código Morse (· — — · — ·, "commat"), a primeira mudança em pelo menos 60
  anos, porque os radioamadores precisavam passar endereços de e-mail (Wikipedia, "Morse code").

Precisão: o baud, o ASCII e o CR/LF vêm do **telégrafo impressor** (Baudot, Murray), a linhagem que
começa na linha elétrica de Morse e Vail, e não do registrador de 1844 em si. O texto diz "do
telégrafo vieram" e "códigos do telégrafo impressor". O @ é do código Morse mesmo.

O **relato de Vail** (ter contado os tipos de uma tipografia para dar os códigos mais curtos às
letras mais usadas) continua relato (a direção já tinha marcado) e não entrou no texto.

Fontes: Wikipedia, "Baud" (<https://en.wikipedia.org/wiki/Baud>); Wikipedia, "Émile Baudot"
(<https://en.wikipedia.org/wiki/%C3%89mile_Baudot>); Wikipedia, "Baudot code"
(<https://en.wikipedia.org/wiki/Baudot_code>); Eric Fischer, "The Evolution of Character Codes,
1874–1968" (<https://ia601805.us.archive.org/24/items/enf-ascii/ascii.pdf>); Tom Jennings,
"Annotated history of character codes" (<https://landley.net/history/mirror/ascii.html>);
Wikipedia, "Morse code" (<https://en.wikipedia.org/wiki/Morse_code>); Alex Chan, "The @ symbol was
added to Morse code in 2004" (<https://alexwlchan.net/notes/2025/arobase-in-morse-code/>).

### Textos revisados

A frase "O que os frameworks escondem, o telégrafo mostra" saiu: era frase de efeito, e a frase do
livro já mudou para "O que fica quando a ferramenta muda".

**Completo:** O telégrafo de Morse: a chave e o registrador. Em 24 de maio de 1844, Morse mandou de
Washington para Baltimore a mensagem "What hath God wrought", gravada em pontos e traços numa fita
de papel. A relação com o livro: é a computação com tudo à vista; o circuito aberto ou fechado é o
bit, o Morse é a codificação, o tempo do ponto e do traço é o protocolo, a linha de estação em
estação é a rede e a fita é a memória. Do telégrafo vieram o baud (de Émile Baudot, engenheiro de
telégrafo) e o ASCII, herdeiro dos códigos do telégrafo impressor, com o CR e o LF do fim de linha;
e o código Morse ganhou o @ em 2004, para os endereços de e-mail. A fita tracejada é a mensagem que
ainda está chegando.

**Curto:** Telégrafo de Morse (1844): o bit, o código, o protocolo, a rede e a memória à vista numa
só máquina. O baud e o CR e o LF do fim de linha vêm do telégrafo.

### O link

**Smithsonian, National Museum of American History, "What Hath God Wrought" Telegraph Message**:
<https://www.si.edu/object/what-hath-god-wrought-telegraph-message:nmah_713485>. É o objeto que o
tracejado do desenho mostra, a fita com os pontos e traços, com a história de 24 de maio de 1844
contada pelo museu (a verba do Congresso, a linha de 40 milhas, Annie Ellsworth, Morse no Capitólio e
Vail em Baltimore) e a nota de onde está cada fita original. Alternativas: Library of Congress,
"Invention of the Telegraph"
(<https://www.loc.gov/collections/samuel-morse-papers/articles-and-essays/collection-highlights/invention-of-the-telegraph/>)
e Smithsonian Institution Archives, "A Forgotten History: Alfred Vail and Samuel Morse" (a chave e o
registrador são de Vail: <https://siarchives.si.edu/blog/forgotten-history-alfred-vail-and-samuel-morse>).

### Desenho

Fica.

---

## 07 IA: o Turco, o autômato enxadrista de Kempelen (1770)

### A ligação com hoje

**Fato conferido.**

- O **Amazon Mechanical Turk** (2005), o serviço em que pessoas fazem, por tarefa, o que o
  computador ainda faz mal, tem o nome do Turco; a Amazon o chama de "artificial artificial
  intelligence", expressão que o diretor do produto atribui a Jeff Bezos (Wikipedia, "Amazon
  Mechanical Turk"). A própria página de ajuda do MTurk conta a história de Kempelen.
- **Babbage jogou contra o Turco e perdeu**: em 1819 (e de novo em 1820, pelos diários dele), em
  Londres, com Jacques Mouret escondido no gabinete; chamou de farsa, mas o encontro ficou com ele e
  anos depois ele escreveu que "todo jogo de habilidade pode ser jogado por um autômato" (IEEE
  Spectrum; Heinz Nixdorf MuseumsForum; Game Studies).
- **O enxadrista escondido**: a sequência de mestres que operaram a máquina é conhecida (Allgaier,
  Mouret, Schlumberger…); as portas da frente abertas antes de cada partida, com uma vela, eram
  parte do número (Wikipédia, "O Turco"; Linda Hall Library).

Datas: Kempelen começou a construir em 1769 e apresentou em Viena em 1770 (as fontes divergem só
nisso); a máquina queimou na Filadélfia em 1854. O texto mantém 1770, a data da apresentação.

Fontes: Wikipedia, "Amazon Mechanical Turk" (<https://en.wikipedia.org/wiki/Amazon_Mechanical_Turk>);
Amazon Mechanical Turk, "Help" (<https://www.mturk.com/help>); IEEE Spectrum, "Untold History of
AI: When Charles Babbage Played Chess With the Original Mechanical Turk"
(<https://spectrum.ieee.org/untold-history-of-ai-charles-babbage-and-the-turk>); Heinz Nixdorf
MuseumsForum, "Wolfgang von Kempelen's Chess Turk"
(<https://www.hnf.de/en/permanent-exhibition/exhibition-areas/the-mechanization-of-information-technology/early-automatons-miracles-of-technology/wolfgang-von-kempelens-chess-turk.html>);
Game Studies, "Games Built the Computer: Babbage, Lovelace and the Dawn of the Ludic Age"
(<https://gamestudies.org/2403/articles/pizelo>); Wikipédia, "O Turco"
(<https://pt.wikipedia.org/wiki/O_Turco>); Linda Hall Library, "Wolfgang von Kempelen"
(<https://www.lindahall.org/about/news/scientist-of-the-day/wolfgang-von-kempelen/>); Wikipedia,
"Jacques François Mouret" (<https://en.wikipedia.org/wiki/Jacques_Fran%C3%A7ois_Mouret>).

### Textos revisados

**Completo:** O Turco, o autômato enxadrista que Wolfgang von Kempelen apresentou em Viena em 1770:
um gabinete cheio de engrenagens e uma figura de turbante que jogava xadrez. Venceu Napoleão e
Benjamin Franklin, e Babbage jogou contra ele em 1819 e perdeu. Havia um enxadrista escondido no
gabinete. A relação com o livro: é a primeira máquina que parecia pensar, e a lembrança de que toda
IA tem gente dentro, nos dados com que aprende e em quem a usa; a Amazon chamou de Mechanical Turk,
em 2005, o serviço em que pessoas fazem o que o computador ainda faz mal. O braço tracejado está
movendo uma peça.

**Curto:** O Turco de Kempelen (1770): o autômato que jogava xadrez tinha um enxadrista escondido, e
toda IA tem gente dentro. Deu nome ao Mechanical Turk da Amazon.

### O link

**Wikipédia em português, "O Turco"**: <https://pt.wikipedia.org/wiki/O_Turco>. É a tradução do
artigo destacado em inglês, completo (Kempelen e Maria Teresa, o gabinete e as portas abertas, a
turnê, Maelzel, Poe, o incêndio de 1854), e está em português. A busca não devolveu página de museu
sobre o Turco tão completa quanto essa; a melhor de museu é a do Heinz Nixdorf MuseumsForum
(Paderborn), que tem uma reconstrução e cita a partida de Babbage
(<https://www.hnf.de/en/permanent-exhibition/exhibition-areas/the-mechanization-of-information-technology/early-automatons-miracles-of-technology/wolfgang-von-kempelens-chess-turk.html>).

### Desenho

Fica.

---

## O que foi descartado ou ficou como relato

- **Frontend, "largura do M" como origem do em**: explicação popular; o em é o corpo do tipo e os
  textos de 1683 não falam em M. O texto diz "o corpo do tipo".
- **Frontend, "vem da prensa"**: verdadeiro no espírito, impreciso na letra. O vocabulário é da
  composição com tipos de metal; o texto diz "do tipo de metal que ela imprimia".
- **Dados, PEP 8 → cartão**: o PEP 8 cita a janela de 80 colunas, não o cartão; a ponte terminal ←
  cartão é das fontes históricas (Shirriff, Wikipedia). Dito assim no texto ("é o motivo de o
  terminal ter 80 colunas e de tanto guia de estilo…").
- **Desenvolvimento, o nome Loom**: fato que o projeto se chama Loom e trouxe as virtual threads;
  a explicação "tece threads" é da comunidade. Não achei quem batizou dizendo o porquê. O texto
  afirma só o nome e o trocadilho, sem atribuir intenção.
- **DevOps, canário / contêiner / pipeline**: todos fora da janela (1896–1911–1986; 1956; o
  pipelining de processador), e o pipeline nem vem de cano. A cápsula e o tubo ficam como imagem.
- **Fundamentos, o relato de Vail** (contar os tipos da tipografia): continua relato; não entrou.
- **Fundamentos, CR e LF "do Morse"**: vêm do código de Murray (1901), do telégrafo impressor. O
  texto diz "códigos do telégrafo impressor".
- **IA, 1769 × 1770**: construção de 1769, apresentação em 1770; o texto fica com 1770.

## Medidas

Conferido por script: os sete completos têm 5 frases cada; os curtos têm 170 (01), 175 (02), 180
(03), 176 (04), 184 (05), 155 (06) e 154 (07) caracteres. Nenhum texto tem travessão de aparte nem
"não X, mas Y".

## Para o `dados.json`

Os sete pares (completo e curto) acima são os candidatos a `textoDesenho` e `textoDesenhoCurto`
dos livros 01 a 07, se o Cesar aprovar. Nada foi alterado em `dados.json`, `textos-desenho-v1.md`
ou em qualquer outro arquivo.
