# A ligação com hoje e o link de cada máquina: livros 08 a 13

Pedido do Cesar em 01/10/2026, a partir da frase do Frontend ("o vocabulário do CSS vem dela"): para
cada livro, achar uma ligação **verdadeira** entre a máquina antiga e algo que o desenvolvedor usa
hoje, revisar os textos (completo e curto) e escolher **um único link** sobre a máquina. Este arquivo
cobre os livros 08 a 13; os livros 01 a 07 ficam com o outro pesquisador. Os textos de partida são os
de `textos-desenho-v1.md`; a pesquisa anterior está na seção 2 de `direcao-de-arte.md` e em `critica.md`.

Como foi feito: só pela busca na web (o acesso direto às páginas está bloqueado neste ambiente). Todo
URL abaixo foi devolvido pela busca, com o título da página. Classificação de cada ligação:
**fato conferido** (duas fontes ou uma fonte primária), **relato** (uma pessoa conta; vai dito como
relato) ou **metáfora** (só uma semelhança; vai dita como metáfora). O que não se sustentou está
registrado como descartado, com o motivo.

## Resumo

| Vol. | Livro | A ligação com hoje | Classe | O link |
|---|---|---|---|---|
| 08 | Integração e Eventos | a central telefônica em inglês é *telephone exchange*; *exchange* é a peça do AMQP e do RabbitMQ que recebe cada mensagem e a encaminha às filas | fato (a mesma palavra; não há fonte de que um nome veio do outro) | Wikipedia, "Telephone switchboard" |
| 09 | Pagamentos | a empresa que comprou a patente de Ritty virou em 1884 a National Cash Register, a NCR de hoje (caixas eletrônicos e ponto de venda), onde Thomas J. Watson aprendeu o ofício antes de dirigir a empresa que virou a IBM | fato | Smithsonian (NMAH), "Ritty Model 1 Cash Register" |
| 10 | Segurança | Hobbs abriu a fechadura em 1851 e, em 1853, defendeu discutir as falhas em público porque os ladrões já as conhecem: o argumento do debate atual sobre divulgar vulnerabilidades | fato (a citação e a autoria conferidas; o uso no debate de hoje é documentado) | Wikipedia, "Chubb detector lock" |
| 11 | Sistemas Distribuídos | o artigo mais citado de Lamport, de 1978, se chama "Time, Clocks, and the Ordering of Events in a Distributed System", e os relógios lógicos levam o nome dele | fato | American Scientist, "Huygens's Clocks Revisited" |
| 12 | SRE | Wiener batizou a cibernética (1948) citando o "On Governors" de Maxwell (1868) e lembrando que *governor* vem do grego *kybernetes*, a palavra que em 2014 deu nome ao Kubernetes | fato | Wikipedia, "Centrifugal governor" |
| 13 | Testes | prumo vem de *plumbum*, chumbo, a raiz de *plumber* (encanador); o *smoke test*, segundo uma das explicações, vem do teste de fumaça dos encanadores (a outra o traz da eletrônica) | fato (etimologia) + "segundo uma das explicações" (smoke test) | Wikipedia, "Plumb bob" |

Nenhum desenho precisa trocar: nos seis livros a ligação mais forte é com o objeto que já está na
coleção (seção "Trocar algum desenho?", no fim).

## 08 Integração e Eventos: a mesa telefônica manual (1878)

### A ligação com hoje

**Escolhida: a palavra *exchange*.** Em inglês, a central telefônica se chama *telephone exchange*
(a Wikipedia abre o verbete com "A telephone exchange, telephone switch, or central office is a
telecommunications system…"). No AMQP 0-9-1 e no RabbitMQ, *exchange* é o nome da peça que recebe
cada mensagem publicada e a encaminha a zero ou mais filas pelas regras de *binding* ("Exchanges are
AMQP 0-9-1 entities where messages are sent to. Exchanges take a message and route it into zero or
more queues"). É exatamente o trabalho da telefonista: receber a chamada e encaixar o cordão no jaque
certo. **Classe: fato conferido para "a mesma palavra".** Não achei fonte dizendo que o AMQP tirou o
nome da telefonia; a própria especificação compara a exchange a um MTA de e-mail, não a uma central.
Por isso o texto diz "a mesma palavra" e nada mais.

- Wikipedia, "Telephone exchange": <https://en.wikipedia.org/wiki/Telephone_exchange>
- RabbitMQ, "AMQP 0-9-1 Model Explained": <https://www.rabbitmq.com/tutorials/amqp-concepts>
- RabbitMQ, "Exchanges": <https://www.rabbitmq.com/docs/exchanges>

**Conferidas e deixadas de reserva:**

- *SIGHUP*, "hang up": o sinal que o Unix manda ao processo quando o terminal fecha tem esse nome
  porque, no tempo dos terminais por linha serial e modem, ele avisava que a linha caiu, em geral
  porque o usuário "desligou o telefone" (Wikipedia, "SIGHUP",
  <https://en.wikipedia.org/wiki/SIGHUP>; Eric S. Raymond, "Things Every Hacker Once Knew",
  <http://www.catb.org/~esr/faqs/things-every-hacker-once-knew/>). Fato conferido, mas fala do
  telefone, não da central, e fica melhor em DevOps ou Fundamentos do que aqui.
- *Switch* / comutação: a Wikipedia chama a central também de *telephone switch*; o switch de rede
  é da mesma família de palavra. Verdadeiro, mas mais fraco do que *exchange*, que o desenvolvedor
  de mensageria escreve no código.
- *Operator*: a telefonista é a *operator*; o Operator do Kubernetes é outra coisa, e a ligação é só
  a palavra. Descartado.

**Datas e nuances conferidas:** a central de George Coy abriu em 28 de janeiro de 1878 no Boardman
Building, em New Haven, com 21 assinantes; a mesa foi feita de "carriage bolts, handles from teapot
lids and bustle wire" e atendia duas conversas ao mesmo tempo (Connecticut History,
<https://connecticuthistory.org/the-first-commercial-telephone-exchange-today-in-history/>;
Wikipedia, "First Telephone Exchange", <https://en.wikipedia.org/wiki/First_Telephone_Exchange>).
A Wikipedia registra que houve uma central estatal em Friedrichsberg, perto de Berlim, em novembro de
1877, e uma experimental da Bell em Boston em 1877; "a primeira central comercial" continua sendo o
jeito como as fontes falam de New Haven. A lâmpada de linha é do fim dos anos 1890, com a bateria
central (a primeira mesa a bateria é de 1894, Lexington): o "mais tarde" do texto está certo.

### Os textos revisados

**Completo:** A mesa telefônica manual. A primeira central comercial abriu em New Haven, nos Estados
Unidos, em 1878, com 21 assinantes. A telefonista ligava quem chama a quem atende encaixando um cordão
nos jaques; mais tarde, uma lâmpada passou a acender quando alguém tirava o fone do gancho. Em inglês
a central é a telephone exchange, e exchange é a palavra que o AMQP e o RabbitMQ usam até hoje para
a peça que recebe cada mensagem e a encaminha às filas. A relação com o livro: a central é o
intermediário entre os sistemas; os jaques são os endereços, o cordão é o roteamento e a lâmpada que
acende é o evento. O cordão tracejado é a ligação sendo feita.

**Curto:** Mesa telefônica (1878): a telefonista ligava quem chama a quem atende. Em inglês a central
é a exchange, a palavra que o RabbitMQ usa até hoje para quem encaminha a mensagem à fila.

### O link

**Wikipedia, "Telephone switchboard"**: <https://en.wikipedia.org/wiki/Telephone_switchboard>

Por quê: é a página sobre a máquina em si (jaques, cordões, lâmpadas, a telefonista), de 1878 até a
última mesa manual, e não só sobre o evento de New Haven. A Smithsonian tem mesas na coleção, mas as
que a busca devolveu são de 1908 em diante (Kellogg), e a Britannica ("Switchboard") é curta demais.

## 09 Pagamentos: a caixa registradora (1879)

### A ligação com hoje

**Escolhida: a NCR e o Watson da IBM.** Ritty vendeu o negócio em 1881 a Jacob Eckert, que formou a
National Manufacturing Company; em 1884 John H. Patterson comprou a empresa e as patentes e a
renomeou National Cash Register Company. É a NCR, que existe até hoje: em outubro de 2023 ela se
dividiu em NCR Voyix (ponto de venda, autoatendimento de loja) e NCR Atleos (caixas eletrônicos, mais
de 80 mil pontos em 140 países). Thomas J. Watson entrou na NCR como vendedor em 1895, chegou a
gerente geral de vendas em Dayton, foi demitido por Patterson em 1913/1914 e em 1914 assumiu a CTR,
que em 1924 virou a IBM; ele mesmo disse que "quase tudo o que sei sobre construir uma empresa veio do
sr. Patterson". **Classe: fato conferido** (Wikipedia, SEC, Encyclopedia.com, EBSCO).

- Wikipedia, "Cash register": <https://en.wikipedia.org/wiki/Cash_register>
- Wikipedia, "James Ritty": <https://en.wikipedia.org/wiki/James_Ritty>
- Wikipedia, "NCR Voyix": <https://en.wikipedia.org/wiki/NCR_Voyix>
- NCR Voyix, Form 10-K 2023 (a separação em 16/10/2023):
  <https://www.sec.gov/Archives/edgar/data/70866/000007086624000014/ncr-20231231.htm>
- Wikipedia, "Thomas J. Watson": <https://en.wikipedia.org/wiki/Thomas_J._Watson>
- Encyclopedia.com, "Thomas John Watson":
  <https://www.encyclopedia.com/people/social-sciences-and-law/business-leaders/thomas-john-watson>

**Conferida e deixada de reserva: o *journal*.** O rolo de papel que grava cada venda em ordem se
chama *journal tape* (ou *detail tape*, *audit tape*); a Wikipedia diz que Patterson, ao acrescentar o
rolo, criou "the journal for internal bookkeeping purposes, and the receipt for external bookkeeping
purposes". *Journal* é também o nome do log de transações em software: o *rollback journal* do SQLite
(o arquivo `-journal`), o *journal* do MongoDB (WiredTiger) e o *journal* do ext4 (jbd2). Fato
conferido, e é bonito: o rolo da registradora e o journal do banco são o mesmo objeto, o registro em
ordem de tudo o que aconteceu. Ficou de fora do texto porque **as fontes divergem sobre quando o rolo
entrou**: a Wikipedia o atribui a Patterson em 1884; o grupo de objetos da Smithsonian diz que já o
primeiro modelo comercial dos Ritty, o "Incorruptible Cashier", trocou o mecanismo de registro por
uma fita de papel. A máquina da patente de 1879 (US 221.360) tinha teclas, mostrador, discos
contadores internos e sino, sem papel. Se o Cesar quiser o journal no texto, a frase segura é "o rolo
de papel que grava cada venda em ordem, o journal, chegou nos primeiros anos da máquina".

- Wikipedia, "Cash register" (Patterson e o journal): <https://en.wikipedia.org/wiki/Cash_register>
- Smithsonian, grupo "Cash and Credit Registers":
  <https://americanhistory.si.edu/collections/object-groups/cash-and-credit-registers>
- SQLite, "Temporary Files Used By SQLite" (rollback journal): <https://www.sqlite.org/tempfiles.html>
- MongoDB, "Journaling": <https://www.mongodb.com/docs/manual/core/journaling/>
- Linux kernel, "Journal (jbd2)": <https://www.kernel.org/doc/html/latest/filesystems/ext4/journal.html>
- "What is a cash register journal tape?":
  <http://sam4scashregisters.blogspot.com/2013/01/what-is-cash-register-journal-tape.html>

**Datas conferidas:** patente US 221.360 de 4 de novembro de 1879, de James e John Ritty; Ritty
dono de bar (saloon) em Dayton; a inspiração foi um contador de voltas da hélice num navio; o nome
"Ritty's Incorruptible Cashier" é do modelo comercial; a venda a Eckert em 1881; Patterson em 1884.

### Os textos revisados

**Completo:** A caixa registradora. James Ritty, dono de um bar em Dayton, nos Estados Unidos,
patenteou em 1879 o "caixa incorruptível": uma máquina que registra cada venda, guarda o dinheiro e
permite fechar o caixa no fim do dia. Ela nasceu para acabar com o desvio de dinheiro pelos
funcionários, e a empresa que comprou a patente virou em 1884 a National Cash Register, a NCR de
hoje, dos caixas eletrônicos e dos sistemas de ponto de venda, onde Thomas J. Watson aprendeu o
ofício antes de dirigir a empresa que virou a IBM. A relação com o livro: cada venda vira um
lançamento registrado, e no fim do dia o dinheiro tem de bater com o registro: o ledger e a
conciliação, os dois assuntos centrais de pagamentos. A gaveta tracejada é a que salta quando a venda
é registrada.

**Curto:** Caixa registradora (1879): inventada contra o desvio de dinheiro, registra cada venda e
fecha o caixa. Quem comprou a patente virou a NCR, a dos caixas eletrônicos de hoje.

### O link

**Smithsonian, National Museum of American History, "Ritty Model 1 Cash Register, Possibly a
Replica"**: <https://americanhistory.si.edu/collections/object/nmah_694231>

Por quê: é a primeira máquina dos Ritty (ou a réplica que a própria NCR fez dela para a feira de
St. Louis de 1904), no museu, com a história em meia página: os balconistas estranhos que ficavam
com parte do dinheiro, o mostrador grande, o compartimento trancado que somava, a compra pela NCR.
Museu, objeto certo, texto curto e seguro.

## 10 Segurança: a fechadura detectora de Chubb (1818)

### A ligação com hoje

**Escolhida: o argumento de Hobbs sobre discutir falhas em público.** Alfred Charles Hobbs, serralheiro
americano da Day & Newell, abriu a fechadura detectora de Chubb na Grande Exposição de Londres em
1851 (avisou a Chubb em 21 de julho e abriu no dia seguinte; a Wikipedia o dá como o primeiro a abrir
a fechadura de seis alavancas) e em seguida a de Bramah, intacta desde 1790, em 51 horas de trabalho
ao longo de 16 dias. Em 1853 saiu em Londres *Locks and Safes: The Construction of Locks*, "compiled
from the papers of A. C. Hobbs" e editado por Charles Tomlinson (Virtue and Co.; segunda edição em
1868). A introdução responde a quem achava que discutir as fraquezas das fechaduras era "um prêmio
à desonestidade": "Rogues are very keen in their profession, and know already much more than we can
teach them respecting their several kinds of roguery." A frase é atribuída a Hobbs pela Wikipedia e
pelo Matt Blaze, que a mantém numa página própria como o argumento mais antigo que conhece a favor
da divulgação de vulnerabilidades, e nota a ironia de que a segurança de computadores aceitou o
argumento e o mundo das fechaduras voltou atrás. **Classe: fato conferido** (citação, livro e
autoria; o uso no debate atual, documentado pelo Blaze e por páginas de segurança).

- Wikipedia, "Alfred Charles Hobbs": <https://en.wikipedia.org/wiki/Alfred_Charles_Hobbs>
- Matt Blaze, "On the discussion of security vulnerabilities" (o trecho de Hobbs):
  <https://www.mattblaze.org/hobbs.html>
- Matt Blaze, "Some references from my talk on 'Safecracking, Secrecy and Science'" (a referência
  bibliográfica completa do livro): <https://www.mattblaze.org/blog/safecracking_and_science/>
- Wikipedia, "Chubb detector lock": <https://en.wikipedia.org/wiki/Chubb_detector_lock>
- Wikipedia, "Bramah lock" (51 horas, 16 dias): <https://en.wikipedia.org/wiki/Bramah_lock>

**Nuance de autoria:** o livro não é "de Hobbs" no sentido estrito; foi montado dos papéis dele por
Tomlinson. No texto fica "Hobbs escreveu", que é como a Wikipedia e o Blaze o citam; a ficha diz a
forma completa. **Reserva:** o princípio de Kerckhoffs (1883, "o sistema não deve exigir segredo")
é a versão da criptografia do mesmo argumento, trinta anos depois; não entrou para não dobrar a
ideia.

### Os textos revisados

**Completo:** A fechadura detectora de Jeremiah Chubb, de 1818, vencedora do concurso que o governo
britânico abriu depois de um roubo com chaves falsas no arsenal de Portsmouth. Quando alguém tenta
abri-la com uma gazua ou com a chave errada, ela trava e fica travada, e o dono fica sabendo que
houve a tentativa. Só foi aberta em 1851, por Alfred Hobbs, que em 1853 escreveu que discutir as
falhas das fechaduras em público não ensina nada aos ladrões, que já as conhecem: o argumento que o
debate sobre divulgar vulnerabilidades repete até hoje. A relação com o livro: segurança é controlar
quem pode entrar e conseguir provar o que aconteceu; a chave é a credencial, as alavancas são a
verificação e o detector é o registro de auditoria. A alavanca tracejada é o detector disparado.

**Curto:** Fechadura de Chubb (1818): com a chave errada, trava e o dono fica sabendo. Hobbs a abriu
em 1851 e defendeu discutir as falhas em público: o debate de hoje sobre vulnerabilidades.

### O link

**Wikipedia, "Chubb detector lock"**: <https://en.wikipedia.org/wiki/Chubb_detector_lock>

Por quê: é a página da própria fechadura: o roubo de 1817, o concurso, o mecanismo de alavancas com o
detector que trava e avisa, a chave reguladora de 1824, Hobbs em 1851. O Science Museum tem o
modelo funcional seccionado ("Working model of Chubb detector lock",
<https://collection.sciencemuseumgroup.org.uk/objects/co50408/working-model-of-chubb-detector-lock>),
mas a ficha é de uma linha.

## 11 Sistemas Distribuídos: os dois relógios de Huygens na mesma viga (1665)

### A ligação com hoje

**Escolhida: o artigo de Lamport, "Time, Clocks, and the Ordering of Events in a Distributed
System".** *Communications of the ACM*, julho de 1978. É o artigo mais citado de Lamport (segundo a
própria ACM, no perfil do Prêmio Turing), ganhou o prêmio de artigo influente do PODC em 2000 (hoje
Prêmio Dijkstra) e o Hall of Fame da SIGOPS em 2007; os relógios lógicos que ele propõe são
chamados de *Lamport clocks* ou *Lamport timestamps*, e são a base dos *vector clocks* do Dynamo e
de outros bancos distribuídos. A ideia central é a mesma dos relógios de Huygens: cada processo tem
o seu relógio, e só a mensagem que passa de um a outro (a viga) os põe em ordem. **Classe: fato
conferido.** A ligação de conteúdo (viga = rede) continua metáfora, e o texto a mantém como "como
serviços que…".

- ACM, "Leslie Lamport, A.M. Turing Award Laureate" (o artigo mais citado, os relógios lógicos):
  <https://amturing.acm.org/award_winners/lamport_1205376.cfm>
- ACM Digital Library, o artigo: <https://dl.acm.org/doi/10.1145/359545.359563>
- Lamport, o PDF do artigo: <https://lamport.azurewebsites.net/pubs/time-clocks.pdf>
- Wikipedia, "Lamport timestamp": <https://en.wikipedia.org/wiki/Lamport_timestamp>

**Conferida e deixada de reserva: a palavra "sincronização".** A observação de 1665 é tratada na
literatura de física como a primeira descrição científica de uma sincronização ("the first time that
synchronization effects have been described scientifically"; "what may be the first recorded instance
of spontaneous synchronization"), e o fenômeno leva o nome dele, *Huygens synchronization*. É a
palavra do `synchronized`, do `async` e do `sync` de todo dia. Classe: relato da literatura (os
físicos o dizem com "may be"). Não entrou no texto para não passar de cinco frases; se o Cesar
preferir esta ligação à de Lamport, a frase é: "É tida como a primeira sincronização descrita pela
ciência, e o fenômeno leva o nome dele até hoje."

- Royal Society Open Science, Willms, Kitanov e Langford, "Huygens' clocks revisited" (2017):
  <https://royalsocietypublishing.org/rsos/article/4/9/170777/93669/Huygens-clocks-revisitedHuygens-Clocks-Revisited>
- arXiv, Dilão, "On the problem of synchronization of identical dynamical systems: The Huygens's
  clocks": <https://arxiv.org/abs/0804.3162>

**Datas conferidas:** carta a De Sluse em 22 de fevereiro de 1665 ("the sympathy of two clocks"), ao
pai em 26, à Royal Society (Moray) em 27, lida em 1º de março; primeiro culpou o ar, depois a viga;
eram os relógios marítimos para a longitude; a Royal Society leu como revés.

### Os textos revisados

**Completo:** Os relógios de pêndulo de Christiaan Huygens, feitos para medir a longitude no mar. Em
1665, ele notou que dois deles, pendurados na mesma viga, acabavam balançando sempre no mesmo ritmo
e em sentidos opostos, e voltavam a isso mesmo depois de ele desacertar um; dias depois achou a
causa: a viga que ligava os dois. Três séculos depois o problema é o mesmo: o artigo mais citado de
Lamport, de 1978, se chama "Time, Clocks, and the Ordering of Events in a Distributed System", e os
relógios lógicos que ele propôs levam o nome dele. A relação com o livro: são duas máquinas iguais,
cada uma com a sua hora, que só se acertam pelo que as liga, como serviços que dependem da rede
para concordar sobre tempo, ordem e estado. O pêndulo tracejado é o do segundo relógio, no lado
oposto.

**Curto:** Relógios de Huygens (1665): pendurados na mesma viga, se acertavam sozinhos pelo que os
ligava. O problema segue o mesmo: o artigo clássico de Lamport (1978) se chama Time, Clocks.

### O link

**American Scientist, "Huygens's Clocks Revisited"** (Erica Klarreich, julho–agosto de 2002):
<https://www.americanscientist.org/article/huygenss-clocks-revisited>

Por quê: conta a história inteira em linguagem de revista (a cama, a "odd kind of sympathy", a
esperança de que dois relógios se corrigissem no mar, a Royal Society perdendo a fé no pêndulo) e
explica a causa, a viga, pelo experimento da Georgia Tech publicado pela Royal Society em 2002. O
artigo da Royal Society (Bennett et al., *Proc. R. Soc. A*, 2002) é a fonte primária moderna, mas é
matemática; este é a melhor página para um leitor.

## 12 SRE: o regulador centrífugo de Watt (1788)

### A ligação com hoje

**Escolhida: a raiz de *governor* e de Kubernetes, pela mão de Wiener.** Na introdução de
*Cybernetics* (1948), Wiener escreve: "We have decided to call the entire field of control and
communication theory, whether in the machine or in the animal, by the name Cybernetics, which we
form from the Greek κυβερνήτης or steersman. In choosing this term, we wish to recognize that the
first significant paper on feed-back mechanisms is an article on governors, which was published by
Clerk Maxwell in 1868, and that governor is derived from a Latin corruption of κυβερνήτης." Ou
seja: a cibernética foi batizada a partir do regulador de Watt, pelo artigo de Maxwell, e com a
palavra grega que já tinha dado *governor* (grego *kybernetes*, timoneiro → latim *gubernator* →
francês antigo *gouverneur* → inglês *governor*; Wiktionary). O Kubernetes foi anunciado pelo Google
em junho de 2014 (primeiro commit em 6 de junho, keynote na DockerCon em 10), e a Wikipedia abre o
verbete com: "The name Kubernetes comes from the Ancient Greek term κυβερνήτης, kubernḗtēs
(helmsman, pilot), which is also the origin of the words cybernetics and (through Latin) governor."
**Classe: fato conferido** (Wiener na fonte primária citada; Wiktionary; Wikipedia; blog do
Kubernetes).

- Wikipedia, "Cybernetics: Or Control and Communication in the Animal and the Machine":
  <https://en.wikipedia.org/wiki/Cybernetics:_Or_Control_and_Communication_in_the_Animal_and_the_Machine>
- Language Log, "And now the cyber is so big" (cita a primeira edição de 1948):
  <https://languagelog.ldc.upenn.edu/nll/?p=27973>
- Wiktionary, "governor": <https://en.wiktionary.org/wiki/governor>
- Wikipedia, "Kubernetes": <https://en.wikipedia.org/wiki/Kubernetes>
- Kubernetes Blog, "10 Years of Kubernetes": <https://kubernetes.io/blog/2024/06/06/10-years-of-kubernetes/>
- Maxwell, "On Governors", *Proc. R. Soc. London* 16 (1868), pp. 270–283, e o reconhecimento tardio
  (só depois de Wiener): IEEE, Kang, "Origin of Stability Analysis: 'On Governors' by J.C. Maxwell",
  <https://ieeexplore.ieee.org/document/7569049/>; Clerk Maxwell Foundation,
  <https://clerkmaxwellfoundation.org/Governors.pdf>

**Conferida e deixada de fora: o *daemon* e o demônio de Maxwell.** Corbató contou em 2002 ao site
*Take Our Word for It* que a equipe do Project MAC (CTSS, c. 1963) começou a chamar os processos de
fundo de *daemon* por causa do demônio de Maxwell, "que trabalha sem parar nos bastidores"; o Unix
herdou. É relato (de quem deu o nome, mas uma só fonte), e é o mesmo Maxwell do "On Governors", o
que daria ao DaemonSet do Kubernetes duas pontas no regulador. Fica de fora do texto: é um passo a
mais do que o leitor aguenta numa capa, e o Kubernetes já basta. Fonte: Wikipedia, "Daemon
(computing)", <https://en.wikipedia.org/wiki/Daemon_(computing)>.

**Datas conferidas:** o regulador é de 1788 (a Lap Engine do Science Museum, "the first to be fitted
with the centrifugal governor"); a Britannica diz 1769 no verbete "Flyball governor", o que
contraria todas as outras fontes (1769 é a patente do condensador separado): fica 1788. O regulador
já era usado em moinhos desde o século XVII (Huygens), o que a Wikipedia registra. Maxwell 1868.

### Os textos revisados

**Completo:** O regulador centrífugo que James Watt adotou em 1788 nas máquinas a vapor: duas
esferas giram com a máquina; se ela acelera, as esferas sobem e fecham a válvula do vapor; se
desacelera, descem e abrem. Em 1868, Maxwell publicou "On Governors", a primeira análise matemática
desse controle por realimentação. Ao batizar a cibernética em 1948, Wiener citou esse artigo e
lembrou que governor vem do grego kybernetes, o timoneiro, a mesma palavra que em 2014 deu nome ao
Kubernetes. A relação com o livro: SRE é manter o sistema no ritmo certo quando a carga muda; a
rotação certa é o SLO, e as esferas que sobem são o sinal de que algo saiu do normal. As esferas
tracejadas são a máquina acelerada.

**Curto:** Regulador de Watt (1788): se a máquina acelera, as esferas sobem e fecham o vapor.
Governor vem do grego kybernetes, o timoneiro, a palavra que deu nome ao Kubernetes.

### O link

**Wikipedia, "Centrifugal governor"**: <https://en.wikipedia.org/wiki/Centrifugal_governor>

Por quê: é a página do mecanismo (as esferas, a luva, a válvula), com a origem nos moinhos, Watt em
1788 e Maxwell em 1868, e o desenho clássico. O objeto físico está no Science Museum de Londres, na
Lap Engine de 1788, a primeira máquina com regulador ("Rotative Steam Engine by Boulton and Watt,
1788", <https://collection.sciencemuseumgroup.org.uk/objects/co50948/rotative-steam-engine-by-boulton-and-watt-1788-beam-engine-steam-engine>),
mas a ficha é da máquina a vapor, não do regulador. A Britannica ("Flyball governor") tem a data
errada.

## 13 Testes: o fio de prumo

### A ligação com hoje

**Escolhida: prumo, *plumber* e o *smoke test*.** Duas camadas, cada uma na sua classe:

1. **Etimologia (fato conferido).** "Prumo" vem do latim *plumbum*, chumbo (Infopédia; Wiktionary,
   "plumb"). *Plumber*, encanador, vem de *plumbarius*, o que trabalha com chumbo, porque os canos
   romanos e medievais eram de chumbo (Wikipedia, "Plumber"). Mesma raiz do símbolo Pb e, em
   português, de "aprumo".
2. **O *smoke test* (dito como "segundo uma das explicações").** A Wikipedia diz que a expressão
   "provavelmente foi usada primeiro no encanamento", no teste em que se enche a tubulação de fumaça
   sob leve pressão para achar vazamentos (em uso desde 1875), e passou por extensão à eletrônica.
   O livro de referência da área de testes, *Lessons Learned in Software Testing* (Kaner, Bach e
   Pettichord), dá a origem na eletrônica: "You plug in a new board and turn on the power. If you
   see smoke coming from the board, turn off the power. You don't have to do any more testing." As
   duas versões convivem, e o texto diz isso.

- Wiktionary, "plumb": <https://en.wiktionary.org/wiki/plumb>
- Wikipedia, "Plumber": <https://en.wikipedia.org/wiki/Plumber>
- Infopédia, "fio de prumo" (de *plumbum*): <https://www.infopedia.pt/dicionarios/lingua-portuguesa/fio%20de%20prumo>
- Wikipedia, "Smoke testing (software)": <https://en.wikipedia.org/wiki/Smoke_testing_(software)>
- Wikipedia, "Smoke testing (mechanical)" (encanamento, 1875): <https://en.wikipedia.org/wiki/Smoke_testing_(mechanical)>
- Wikipedia, "Smoke testing (electrical)": <https://en.wikipedia.org/wiki/Smoke_testing_(electrical)>
- Real Python, "smoke test" (resume as duas origens):
  <https://realpython.com/ref/software-engineering-glossary/smoke-test/>

**Datas conferidas:** o prumo é usado desde o Egito antigo (o Met tem um de travertino de c.
1850–1700 a.C.); a parede torta do fantasma e a exceção de época ficam como estão.

### Os textos revisados

**Completo:** O fio de prumo, usado desde o Egito antigo para conferir se uma parede está na
vertical. A palavra vem do latim plumbum, chumbo, o metal do peso, a mesma raiz de plumber, o
encanador dos canos de chumbo; e o smoke test, a conferência de que o sistema ao menos liga,
segundo uma das explicações tem o nome do teste em que o encanador enche os canos de fumaça para
achar vazamentos (a outra o traz da eletrônica: ligar a placa e ver se sai fumaça). É o objeto mais
antigo da coleção, a única exceção de época, e está aqui por ser o instrumento de conferência por
excelência. A relação com o livro: o prumo não dá opinião, compara com uma referência que não erra,
a gravidade; no teste, o resultado esperado é o prumo e o código é a parede. A linha tracejada é a
vertical verdadeira, ao lado da parede torta.

**Curto:** Fio de prumo (Egito antigo): confere a parede contra a referência que não erra, a
gravidade. Prumo vem de plumbum, chumbo, a raiz de plumber e, por uma das explicações, do smoke test.

### O link

**Wikipedia, "Plumb bob"**: <https://en.wikipedia.org/wiki/Plumb_bob>

Por quê: tem a história (Egito, os construtores, o uso até os poços de elevador dos primeiros
arranha-céus), a etimologia de *plumbum* e os usos de hoje, numa página só. A Britannica ("Plumb
line") é um parágrafo; a Wikipédia em português ("Fio de prumo") só fala de topografia. Se o Cesar
quiser um objeto de museu, o prumo egípcio do Met (c. 1850–1700 a.C.):
<https://www.metmuseum.org/art/collection/search/546810>.

## Trocar algum desenho?

Não. Nos seis livros, a ligação mais forte com o dia a dia do desenvolvedor está no objeto que a
coleção já tem:

- **08**: a palavra *exchange* é da central, não de outro objeto.
- **09**: a NCR e o Watson vêm da registradora; nenhum outro objeto de pagamentos tem uma empresa
  viva e a IBM na história.
- **10**: Hobbs e o argumento da divulgação são da fechadura de Chubb (e da de Bramah, que é a
  mesma história). O lacre, a alternativa de cor, não tem nada equivalente.
- **11**: Lamport fala de relógios; a alternativa que a direção já descartou (o aparelho de tabuleta
  de Tyer) não tem ligação com hoje.
- **12**: a cadeia governor → Wiener → Kubernetes é do regulador, literalmente: Wiener o cita.
- **13**: prumo → plumbum → plumber → smoke test é do prumo. O arquipêndulo (o nível em A com o
  prumo no vértice), que a crítica deixou como opção para datar o objeto, continua compatível, já
  que o prumo está nele.

## O que não se sustentou ou ficou de fora

- "O AMQP tirou o nome *exchange* da telefonia": sem fonte; a especificação compara a exchange a um
  MTA de e-mail. Vai como "a mesma palavra".
- "A registradora de 1879 tinha o rolo de papel": a patente de 1879 tinha discos contadores e sino;
  o rolo chegou depois (as fontes divergem entre o modelo comercial dos Ritty e Patterson em 1884).
- "A NCR existe até hoje" sem nuance: existe, dividida desde 2023 em NCR Voyix e NCR Atleos.
- "Watson dirigiu a IBM ao sair da NCR": assumiu a CTR em 1914; o nome IBM é de 1924.
- "Hobbs escreveu o livro": o livro foi montado dos papéis dele por Tomlinson (1853); a frase é
  atribuída a Hobbs.
- "O artigo de Lamport é o mais citado da área": a ACM diz "o mais citado de Lamport"; o texto usa
  essa forma.
- "Watt inventou o regulador": adaptou às máquinas a vapor em 1788 (vinha dos moinhos); o texto já
  dizia "adotou". A data 1769 da Britannica é erro.
- "Smoke test vem dos encanadores" sem ressalva: a referência da área de testes diz eletrônica; vai
  "segundo uma das explicações".
- SIGHUP, *switch*, *operator*, o *journal*, a palavra "sincronização" e o *daemon*: conferidos e
  registrados acima como reservas, cada um com o motivo de não entrar.
