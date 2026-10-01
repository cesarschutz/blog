# Coleções de livros: proposta do pesquisador

Cinco sugestões de coleção para o blog, cada uma tirada de um corte de assuntos que corpos de conhecimento e publicações técnicas já usam, com a pesquisa que as sustenta e uma recomendação. Feito em 01/10/2026 a partir de `docs/prototipos/colecoes/contexto.md`.

Em resumo: as cinco têm 8, 9, 10, 11 e 12 livros; nenhuma tem 16. Os oito livros de hoje já coincidem com o núcleo que as fontes repetem. O que as cinco discutem é o que fazer com a Arquitetura de Software (seis dos 21 posts, três assuntos misturados), se pagamentos ganha livro e se operações são um livro ou dois. Recomendo a sugestão 2 (seção 3).

## 1. O que a pesquisa mostrou

**Limite desta pesquisa.** O proxy de saída do ambiente bloqueou o WebFetch em quase todos os domínios; só o `raw.githubusercontent.com` abriu. Por isso SWEBOK, ACM, Thoughtworks, InfoQ, O'Reilly, Martin Fowler, AWS, Stripe, Nubank, Alura e as demais páginas foram conferidas pelo **resumo que o WebSearch faz da própria página** (os endereços estão na lista no fim desta seção), não pelo texto aberto. Só o OSSU, o ByteByteGo e o README do build-your-own-radar (os quadrantes do Radar) foram lidos direto, no GitHub. Os nomes de áreas e os números abaixo vêm desses resumos; o que é leitura minha está dito como tal. Antes de citar qualquer fonte em público, vale abrir o endereço.

**Quantos livros as fontes usam.** Quem escreve sozinho ou em equipe pequena fica entre 5 e 8 temas de topo: InfoQ 5 (as "personas"), O'Reilly 6 (na medição de uso da plataforma), Nubank 6, iFood cerca de 6, Alura 8, QuintoAndar 8 e o menu do Martin Fowler 8. Passa de 12 quando o objetivo é cobrir tudo: ACM CCS 13, Spotify 15, ByteByteGo 15, CS2023 17, SWEBOK v4 18. Os 16 do dev-note são desse segundo tipo, um agregador que acompanha o mercado; o dev-note já agrupa as 16 em seis grupos (Fundação, Arquitetura, Desenvolvimento, Plataforma, Domínio e Transversal), que é o tamanho das fontes pequenas. Para 21 posts de categoria, 8 livros dão 2,6 posts por livro e 12 dão 1,75. O próprio Fowler, com mais de 900 itens no site, diz no índice que as tags são o melhor jeito de explorar por assunto: livro largo, tag fina, que é o que o blog já faz com as 20 tags.

**Os cortes que se repetem e os que não.**

| Área | Repete? | Aparece como área própria em | Fica dentro de outra, ou não existe, em |
|---|---|---|---|
| Código (construção) | sim | SWEBOK v4 (Construction), InfoQ (Development), O'Reilly (software development), CS2023 (Software Development Fundamentals), Alura (Programação), iFood (Back-end) | em nenhuma |
| Arquitetura | sim | SWEBOK v4 (nova em 2024, "distinta de design"), InfoQ (Architecture & Design), Fowler (Architecture e Microservices), Builders' Library (Architecture), GitHub (Architecture & optimization) | CS2023 e ACM CCS (só como tópico dentro de engenharia de software) |
| Dados | sim | InfoQ, O'Reilly, Fowler, CS2023 (Data Management), ACM CCS (Information systems), Alura, Nubank, iFood, QuintoAndar, Spotify, ByteByteGo | SWEBOK v4 (só uma seção de Computing Foundations) |
| IA | sim | CS2023 (Artificial Intelligence), ACM CCS (Computing methodologies), Alura, Stripe (AI e Machine Learning), Nubank (AI Research), ByteByteGo | junto com dados no InfoQ e no O'Reilly; seção de Computing Foundations no SWEBOK |
| Segurança | sim, quase todas | SWEBOK v4 (nova em 2024), ACM CCS (Security and privacy), CS2023, O'Reilly (8% do uso), GitHub, Nubank, iFood, Spotify, Stripe, ByteByteGo | InfoQ (dentro de Architecture & Design) e Alura (dentro de DevOps) |
| Operações (DevOps, infra, entrega) | sim nas fontes de prática, não nas acadêmicas | SWEBOK v4 (nova em 2024: Operations), InfoQ (DevOps), O'Reilly (IT operations, 18%), Builders' Library (Software delivery & operations), Fowler (Delivery), Alura (DevOps), GitHub, Stripe e Spotify (Infrastructure), Nubank (Foundation & Infrastructure), QuintoAndar (SRE & Infra) | CS2023 e OSSU: nenhuma área tem operações, DevOps ou nuvem no nome |
| Pessoas e profissão | sim | SWEBOK v4 (Professional Practice, Management, Economics), InfoQ (Culture & Methods), O'Reilly (business, 13%), ACM CCS (Social and professional topics), CS2023 (Society, Ethics, and the Profession), Alura (Inovação & Gestão), QuintoAndar (Career), Spotify (People) | em nenhuma |
| Testes e qualidade | metade | SWEBOK v4 (Testing e Quality), Fowler (Testing), QuintoAndar (Quality), Stripe (tag Testing) | InfoQ (em Culture & Methods); nas demais não achei área própria |
| Fundamentos | só nas acadêmicas e no ByteByteGo | SWEBOK v4 (três capítulos), ACM CCS, CS2023, OSSU, ByteByteGo (Computer Fundamentals) | Fowler, InfoQ e os blogs de empresa não têm |
| Observabilidade e SRE à parte | não | CNCF (camada Observability and Analysis) e a literatura de SRE do Google | InfoQ (sub-tema de DevOps), SWEBOK (dentro de Operations), Alura, QuintoAndar ("SRE & Infra") |
| Nuvem à parte | não | CNCF (Provisioning, Runtime, Platform) e os fornecedores | InfoQ, O'Reilly, Alura e SWEBOK: dentro de DevOps ou Operações |
| Front-end e mobile | só em catálogo de curso e blog de empresa grande | Alura, Casa do Código, iFood, Spotify, O'Reilly (web e mobile) | SWEBOK, Fowler e InfoQ não têm |
| Domínio de negócio (pagamentos) | só em blog de empresa | Stripe (tag Payments), Nubank, ByteByteGo (Payment and Fintech) | ACM CCS (Applied computing > Electronic commerce); SWEBOK, CS2023, InfoQ e O'Reilly não têm |
| IA em dois livros | quase ninguém | Alura (IA para Programação e IA para Dados); Stripe tem tags separadas para AI, Machine Learning e Developer Productivity | Radar: IA é tema transversal |
| Linguagem ou fornecedor como livro | não | InfoQ (Development é, na prática, linguagens), Casa do Código (Programação > Java), Radar (quadrante Languages & Frameworks) | SWEBOK, ACM, CS2023, Fowler e os blogs de empresa: é tag ou subtema |

**O que isso diz para o blog do Cesar.**

- **Os oito de hoje já são o núcleo que as fontes repetem.** São as cinco personas do InfoQ (com Dados e IA separados) mais Segurança e SRE, e o SWEBOK v4 acrescentou em 2024 justamente Arquitetura, Operações e Segurança como áreas próprias. Nenhuma fonte pede para tirar um dos oito.
- **O que ele vem escrevendo.** Dos sete posts de categoria publicados desde 10/09/2026, três são de pagamentos (idempotência, efeito externo, Jackson com cartão), dois de concorrência (virtual threads; bloqueio otimista e pessimista), um de arquitetura (CronJob × fila) e um de segurança (criptografia). Os dez posts de 19 e 20/05 (Spring, Kubernetes, logs, SNS, trace) chegaram juntos, o que parece o lote do blog antigo (leitura minha), e DevOps e SRE não têm post novo desde então.
- **O problema é interno.** A Arquitetura de Software carrega seis dos 21 posts e três coisas diferentes: decisão (overhead × overkill, CronJob × fila), técnica de sistemas distribuídos (idempotência, efeito externo, SNS) e domínio (ledger, cobrança). Os posts de ledger, idempotência e efeito externo (os três com as tags Pagamentos e Banco de Dados) formam o grupo mais coeso do blog, e cada corte dá um nome a ele: Pagamentos (blogs de empresa), Sistemas Distribuídos (Fowler, Kleppmann, Builders' Library) ou Design e Padrões (SWEBOK e o próprio dev-note). Escolher esse nome é a decisão central das cinco sugestões.
- **Domínio só existe onde há empresa.** Nenhuma norma ou currículo separa pagamentos; Stripe, Nubank e o ByteByteGo separam. Para um blog em que Pagamentos é a única tag de domínio (4 dos 21 posts) e o assunto de 3 dos 7 posts mais recentes, isso pesa a favor de um livro de domínio, mas a pesquisa não o exige.
- **DevOps e SRE: as fontes gerais juntam, a literatura de SRE separa.** SWEBOK, InfoQ, O'Reilly e a Builders' Library têm uma área só (o capítulo de Operations do SWEBOK tem planejamento, entrega e controle, o que leio como as duas metades, DevOps e SRE); o livro de SRE do Google e o CNCF tratam observabilidade e confiabilidade como disciplina própria. A sugestão 1 junta, as outras mantêm os dois.
- **Currículo acadêmico esquece operações.** O CS2023 e o OSSU não têm área com DevOps, nuvem ou observabilidade no nome (o SWEBOK v4, que é de engenharia e não de currículo, tem), e o blog tem cinco dos 21 posts nessa área. Na sugestão 5, que parte de ACM CCS e CS2023, completei com as camadas do CNCF.
- **IA é o assunto em movimento.** Os quatro temas da edição 33 do Radar da Thoughtworks (nov/2025) e três dos quatro da 34 (abr/2026) são sobre IA e agentes; o quarto da 34 é uma reação a eles. A Alura já separa IA para Programação de IA para Dados, e a frase de hoje do livro IA ("Software feito com IA e software que usa IA") já tem as duas metades. Só a sugestão 4 as separa; a regra de bolso é dividir quando o livro passar de uns seis posts.
- **Tecnologia e fornecedor ficam como tag.** Java, Spring, AWS, Kubernetes e Gradle são tag ou subtema em quase todas as fontes de referência. O livro é o assunto (o que se estuda) e a tag é a tecnologia (onde se aplica), como o blog já faz; "SNS Filter Policy" é de mensageria, com a tag AWS.
- **Carreira ao lado de Arquitetura tem precedente.** O livro de referência de arquitetura (Richards e Ford, Fundamentals of Software Architecture) tem uma parte inteira de técnicas e soft skills e, na 1ª edição, termina num capítulo sobre carreira.

**Cortes que testei e descartei.**

- **Os quatro quadrantes do Radar** (Techniques, Platforms, Tools, Languages & Frameworks) dividem por tipo de coisa, não por assunto: "AOP no Spring" é técnica e framework ao mesmo tempo. Servem para decidir o que adotar, não para achar um post.
- **Os seis pilares do Well-Architected** (excelência operacional, segurança, confiabilidade, eficiência de desempenho, otimização de custos, sustentabilidade): ótimos para revisar um sistema, ruins para uma lombada. "Confiabilidade" não diz se o post é de Kubernetes, de banco ou de código, e Gradle e AOP não têm pilar.
- **Os formatos do Pragmatic Engineer** (Deepdives, The Pulse, Real-world engineering challenges) dividem por tipo de texto, que o blog já cobre com as séries. Não achei lista oficial de seções; é leitura do que a newsletter publica.
- **TabNews**, a comunidade brasileira que olhei, não tem taxonomia oficial, só tags; Alura, Casa do Código, iFood e QuintoAndar seguem o mesmo desenho das fontes internacionais.

**Fontes e endereços.** "Lido" é o texto aberto no GitHub; "resumo" é o resumo do WebSearch da página (ver o limite no início).

| Fonte | Endereço | O que usei | Conferência |
|---|---|---|---|
| SWEBOK v4 (IEEE Computer Society) | https://www.computer.org/education/bodies-of-knowledge/software-engineering | 18 áreas, 3 novas (Architecture, Operations, Security); capítulos | resumo |
| SEBoK, visão do SWEBOK | https://sebokwiki.org/wiki/An_Overview_of_the_SWEBOK_Guide | Architecture distinta de Design; tópicos de Architecture, Operations e Security | resumo |
| ACM CCS 2012 | https://dl.acm.org/ccs (introdução: https://www.acm.org/publications/class-2012-intro) | 13 conceitos de topo; Security and privacy; Information systems; Software and its engineering | resumo |
| ACM DL, "Secure electronic transactions" | https://dl.acm.org/doi/10.5555/886329.886339 | pagamentos indexados em Applied computing > Electronic commerce | resumo |
| CS2023 (ACM, IEEE-CS, AAAI) | https://csed.acm.org/knowledge-areas/ | 17 áreas | resumo |
| Thoughtworks Technology Radar | https://www.thoughtworks.com/radar; quadrantes e anéis conferidos em https://raw.githubusercontent.com/thoughtworks/build-your-own-radar/master/README.md | Techniques, Platforms, Tools, Languages & Frameworks | lido (quadrantes) |
| Radar v33 (nov/2025) | https://www.thoughtworks.com/en-us/insights/podcasts/technology-podcasts/themes-technology-radar-33 | os quatro temas | resumo |
| Radar v34 (abr/2026) | https://www.thoughtworks.com/en-us/insights/podcasts/technology-podcasts/themes-technology-radar-34 | os quatro temas | resumo |
| InfoQ | https://www.infoq.com/ (páginas https://www.infoq.com/ai-ml-data-eng/ e https://www.infoq.com/design/) | cinco personas e seus subtemas | resumo |
| O'Reilly | https://www.oreilly.com/radar/technology-trends-for-2023/ e https://www.oreilly.com/search/topics/ | divisão do uso por tema (2022) | resumo |
| Martin Fowler | https://martinfowler.com/tags/ e https://www.martinfowler.com/tags/index.html | menu de oito temas; índice com 913 itens | resumo |
| The Pragmatic Engineer | https://newsletter.pragmaticengineer.com/about | formatos e eixos de assunto | resumo |
| Amazon Builders' Library | https://aws.amazon.com/builders-library/ e https://aws.amazon.com/blogs/aws/check-out-the-amazon-builders-library-this-is-how-we-do-it/ | duas categorias no lançamento (podem ter mudado) | resumo |
| AWS Well-Architected | https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html | seis pilares | resumo |
| Google, Site Reliability Engineering | https://sre.google/sre-book/table-of-contents/ | cinco partes; capítulos | resumo |
| Kleppmann, Designing Data-Intensive Applications | https://dataintensive.net/ | três partes (Foundations, Distributed Data, Derived Data) | resumo |
| Richards e Ford, Fundamentals of Software Architecture | https://www.oreilly.com/library/view/fundamentals-of-software/9781098175504/ | três partes; capítulo de carreira na 1ª edição | resumo |
| DORA | https://dora.dev/capabilities/ | capacidades técnicas e culturais | resumo |
| CNCF Landscape | https://landscapeapp.cncf.io/cncf/guide | camadas | resumo |
| Stripe Engineering | https://stripe.com/blog/engineering | tags da engenharia | resumo |
| Building Nubank | https://building.nubank.com/engineering/ | seções e subseções | resumo |
| GitHub Blog | https://github.blog/category/ | categorias de Engineering e Security | resumo |
| Spotify Engineering | https://engineering.atspotify.com/ | 15 categorias (pode ser snapshot antigo) | resumo |
| iFood Tech | https://tech.ifood.com.br/ | categorias do blog | resumo |
| QuintoAndar Tech Blog | https://medium.com/quintoandar-tech-blog | seções (lista pode estar defasada) | resumo |
| Alura | https://www.alura.com.br/ | oito categorias; IA para Programação e IA para Dados | resumo |
| Casa do Código | https://www.casadocodigo.com.br/ | catálogo por área | resumo |
| TabNews | https://www.tabnews.com.br/ | sem taxonomia oficial (só tags) | resumo |
| OSSU Computer Science | https://github.com/ossu/computer-science (lido em https://raw.githubusercontent.com/ossu/computer-science/master/README.md) | seções do currículo (Core programming, systems, theory, security, applications, ethics) | lido |
| ByteByteGo, System Design 101 | https://github.com/ByteByteGoHq/system-design-101 (lido em https://raw.githubusercontent.com/ByteByteGoHq/system-design-101/main/README.md) | 15 seções, entre elas Payment and Fintech | lido |

## 2. As cinco sugestões

### Como ler as sugestões

- **Posts.** Os 21 posts de categoria de hoje, pelo nome curto (a legenda vem no fim da seção). A série do Java fica fora.
- **Ordem dos volumes.** Cada lista segue a ordem dos volumes proposta; a regra da ordem está em "Ordem" de cada sugestão.
- **Frase.** Até 44 caracteres, uma linha na capa (Newsreader itálico 24px em 404px). Livro com o mesmo título tem a mesma frase em todas as sugestões, para o desenho e a cor poderem ser os mesmos; a exceção é o IA da sugestão 4, que encolhe de escopo.
- **Abrange.** Itens em ordem de importância (os quatro primeiros bastam de subtítulo), com os nomes técnicos como o Cesar escreve no dev-note.
- **Regra de casa.** O livro é o assunto principal do post; tecnologia, serviço e fornecedor são tag. Nas sugestões com Pagamentos (1, 2 e 5), o livro recebe os posts que já levam a tag Pagamentos (ledger, idempotência, efeito externo e Jackson com cartão). Sem livro de domínio (3 e 4), cada um volta para o livro da técnica. A tabela "Posts de fronteira", no fim da seção, lista os posts que mudam de casa de uma sugestão para outra.
- **Novo.** Marco "livro novo" onde é preciso desenho e cor; os de hoje mantêm os seus.

### Quadro geral

| Sugestão | Livros | Corte | Sem posts hoje | Livros novos |
|---|---|---|---|---|
| 1 · Núcleo (8) | 01 Arquitetura de Software; 02 Desenvolvimento de Software; 03 Dados; 04 IA; 05 Segurança; 06 Operações; 07 Pagamentos; 08 Carreira | Áreas de conhecimento (InfoQ, O'Reilly, SWEBOK v4) | 2 | Operações e Pagamentos |
| 2 · Os oito e o domínio (9) | 01 Arquitetura de Software; 02 Desenvolvimento de Software; 03 Dados; 04 IA; 05 Segurança; 06 DevOps; 07 SRE; 08 Pagamentos; 09 Carreira | Blog de empresa de pagamentos sobre o desenho do InfoQ (Stripe, Nubank, ByteByteGo) | 2 | Pagamentos |
| 3 · Corpo de conhecimento (10) | 01 Arquitetura de Software; 02 Design e Padrões; 03 Desenvolvimento de Software; 04 Testes e Qualidade; 05 DevOps; 06 SRE; 07 Segurança; 08 Carreira; 09 Dados; 10 IA | Capítulos do SWEBOK v4 | 3 | Design e Padrões e Testes e Qualidade |
| 4 · Praticante (11) | 01 Arquitetura de Software; 02 Sistemas Distribuídos; 03 Desenvolvimento de Software; 04 Testes e Qualidade; 05 Dados; 06 IA; 07 Código com IA; 08 Segurança; 09 DevOps; 10 SRE; 11 Carreira | Temas de praticante (Fowler, Kleppmann, Radar, Alura) | 4 | Sistemas Distribuídos, Testes e Qualidade e Código com IA |
| 5 · Camadas (12) | 01 Fundamentos; 02 Desenvolvimento de Software; 03 Dados; 04 Sistemas Distribuídos; 05 Arquitetura de Software; 06 Nuvem; 07 DevOps; 08 SRE; 09 Segurança; 10 IA; 11 Pagamentos; 12 Carreira | Camadas (ACM CCS, CS2023, CNCF) | 4 | Fundamentos, Sistemas Distribuídos, Nuvem e Pagamentos |

### Para onde vai cada uma das 16 categorias do dev-note

Frontend & Web fica fora das cinco: não há post nem tag, e as fontes de uso geral (SWEBOK, Fowler, InfoQ) também não a separam. "Dobrada" quer dizer que a categoria não ganha livro e seus assuntos se espalham por outros.

| Categoria do dev-note | 1 Núcleo | 2 Os oito e o domínio | 3 Corpo de conhecimento | 4 Praticante | 5 Camadas |
|---|---|---|---|---|---|
| AIOps & Agents | IA | IA | IA | IA e Código com IA | IA |
| Arq. Corporativa | Carreira (+ Arquitetura, Operações) | Carreira (+ Arquitetura, DevOps) | Carreira (+ Arquitetura, DevOps) | Carreira (+ Arquitetura, DevOps) | Carreira (+ Arquitetura, Nuvem) |
| Backend & Runtimes | Desenvolvimento | Desenvolvimento | Desenvolvimento | Desenvolvimento | Desenvolvimento |
| Cloud | Operações | DevOps | DevOps | DevOps | Nuvem |
| Dados & Streaming | Dados | Dados | Dados | Dados | Dados |
| Design & Padrões | Arquitetura | Arquitetura | Design e Padrões | Arquitetura | Arquitetura |
| DevOps & Plataformas | Operações | DevOps | DevOps | DevOps | DevOps |
| Fintech & Pagamentos | Pagamentos | Pagamentos | dobrada em Design e Padrões e Segurança | dobrada em Sistemas Distribuídos e Segurança | Pagamentos |
| Frontend & Web | fora | fora | fora | fora | fora |
| Fundamentos de Computação | Desenvolvimento | Desenvolvimento | Desenvolvimento | Desenvolvimento | Fundamentos |
| IA & LLMs | IA | IA | IA | IA | IA |
| Integração & Eventos | Arquitetura | Arquitetura | Arquitetura | Sistemas Distribuídos | Sistemas Distribuídos |
| Observabilidade & SRE | Operações | SRE | SRE | SRE | SRE |
| Segurança & IAM | Segurança | Segurança | Segurança | Segurança | Segurança |
| Sist. Distribuídos | Arquitetura | Arquitetura | Arquitetura (+ Design e Padrões) | Sistemas Distribuídos | Sistemas Distribuídos |
| Testes & Qualidade | Desenvolvimento | Desenvolvimento | Testes e Qualidade | Testes e Qualidade | Desenvolvimento |

### O que separa as cinco

| Decisão | 1 Núcleo | 2 Os oito e o domínio | 3 Corpo de conhecimento | 4 Praticante | 5 Camadas |
|---|---|---|---|---|---|
| Livro de domínio (Pagamentos) | sim | sim | não | não | sim |
| DevOps e SRE | um livro (Operações) | dois | dois | dois | dois, mais Nuvem |
| Sistemas distribuídos fora de Arquitetura | não | não | em parte (os padrões vão para Design e Padrões) | sim | sim |
| Design e Padrões com livro | não | não | sim | não | não |
| Testes e Qualidade com livro | não | não | sim | sim | não |
| Fundamentos com livro | não | não | não | não | sim |
| Nuvem com livro | não | não | não | não | sim |
| IA | um livro | um | um | dois | um |

### Sugestão 1 · Núcleo (8 livros)

**Ideia.** Só as áreas que as fontes de uso geral repetem, mais o domínio do autor. DevOps e SRE viram um livro só, Operações (o grupo Plataforma do dev-note), e Pagamentos tira da Arquitetura de Software o que não é decisão de arquitetura.

**Corte e fonte.** Áreas de conhecimento. Vem do InfoQ (cinco áreas, com Segurança dentro de Architecture & Design e Observability dentro de DevOps), do O'Reilly (software development, IT operations, data, business, security) e do SWEBOK v4, que em 2024 acrescentou Architecture, Operations e Security como áreas próprias. O domínio vem de Stripe, Nubank e ByteByteGo.

**Ordem.** A de hoje, com Operações no lugar de DevOps e SRE e Pagamentos antes de Carreira (tecnologia primeiro, domínio e gente no fim).

**Números.** Média de 2,6 posts por livro. Sem posts hoje: IA e Carreira. Com um ou dois posts: Dados e Segurança. Livros novos, que precisam de desenho e cor: Operações e Pagamentos. Livros de hoje que somem: DevOps e SRE (viram Operações).

**Custo e risco.** Perde dois livros já aprovados (o guindaste do DevOps e o farol do SRE), e Operações fica com a lista mais larga da sugestão (15 itens).

| Vol. | Livro | Posts hoje |
|---|---|---|
| 01 | Arquitetura de Software | 3 |
| 02 | Desenvolvimento de Software | 5 |
| 03 | Dados | 2 |
| 04 | IA | 0 |
| 05 | Segurança | 2 |
| 06 | Operações | 5 |
| 07 | Pagamentos | 4 |
| 08 | Carreira | 0 |

- **01 · Arquitetura de Software** (3 posts)
  - Frase: *As decisões caras de desfazer.*
  - Abrange: Trade-offs e estilos (monolito modular, microsserviços), DDD e bounded contexts, mensageria e EDA, modelos de consistência, resiliência e service mesh, saga/CQRS/event sourcing, outbox/inbox, API-First (OpenAPI, GraphQL, AsyncAPI), schema evolution, Clean/Hexagonal e padrões GoF/enterprise, C4 Model e ADRs, serverless e multi-region, governança de API, dívida técnica e Tech Radar.
  - Vem de: hoje, Arquitetura de Software (sem os três posts de pagamento); dev-note, Design & Padrões, Sist. Distribuídos, Integração & Eventos e parte de Arq. Corporativa (governança de API, dívida técnica, Tech Radar).
  - Posts: Overhead vs overkill; CronJob ou endpoint + fila; SNS Filter Policy.
- **02 · Desenvolvimento de Software** (5 posts)
  - Frase: *O ofício dentro de cada serviço.*
  - Abrange: Java, Spring e JVM, concorrência e modelos de memória, performance engineering (profiling, GC, p99, teoria de filas), testes (TDD/BDD, Testcontainers, contract testing), refatoração, build tools (Gradle, Maven), web frameworks e runtimes, AOP/proxies/serialização, estruturas de dados e algoritmos, SO e redes, WebAssembly.
  - Vem de: hoje, Desenvolvimento de Software (sem o post de Jackson e cartão); dev-note, Backend & Runtimes, Testes & Qualidade, Fundamentos de Computação.
  - Posts: AOP no Spring; AopUtils.getTargetClass(); AtomicBoolean e a parada graciosa; Gradle: tipos de dependência; Virtual threads: pinning e CLOSE_WAIT.
- **03 · Dados** (2 posts)
  - Frase: *Onde o dado mora e por onde ele anda.*
  - Abrange: Bancos relacionais (PostgreSQL, transações e bloqueios), NoSQL (MongoDB, DynamoDB), modelagem de dados, CDC, pipelines, streaming (Kafka, Flink), data lake/warehouse/lakehouse (Iceberg, dbt), Data Contracts e Data Mesh, DuckDB, bancos vetoriais (pgvector).
  - Vem de: hoje, Dados; dev-note, Dados & Streaming.
  - Posts: Bloqueio otimista e pessimista; Data lake vs data warehouse.
- **04 · IA** (sem posts hoje)
  - Frase: *Software feito com IA e software que usa IA.*
  - Abrange: LLMs e prompts, RAG e embeddings, agentes e orquestração de agentes, MCP, IA no código (AI coding, Claude Code), evals e observabilidade de LLM (Langfuse, LangSmith), guardrails, LLMOps, modelos locais (Ollama), fine-tuning, multimodal e benchmarks, AI Safety.
  - Vem de: hoje, IA; dev-note, AIOps & Agents, IA & LLMs e o AI-augmented SDLC de DevOps & Plataformas.
  - Posts: nenhum hoje.
- **05 · Segurança** (2 posts)
  - Frase: *Quem pode o quê e como provar.*
  - Abrange: Identidade e acesso (OAuth 2.0, OIDC, JWT), criptografia (em repouso, em trânsito, KMS, TLS), segredos (Vault, AWS Secrets Manager), Zero Trust, passkeys e WebAuthn, OWASP e CVEs, cadeia de suprimentos (SBOM, SLSA, Sigstore), segurança em runtime, LGPD, privacidade e compliance, segurança de IA.
  - Vem de: hoje, Segurança; dev-note, Segurança & IAM (o PCI DSS vai para Pagamentos).
  - Posts: Criptografia em repouso e em trânsito; JWT: estrutura e campos.
- **06 · Operações** (5 posts; livro novo)
  - Frase: *Colocar no ar e manter no ar.*
  - Abrange: Containers e Kubernetes, CI/CD e GitOps, observabilidade (OpenTelemetry: traces, métricas, logs), SLI/SLO e error budgets, alertas, incidentes e post-mortems, logging estruturado e wide events, nuvem (AWS, Azure, GCP) e Well-Architected, IaC (Terraform) e progressive delivery, platform engineering e IDPs, FinOps, landing zones e Green IT, eBPF, profiling e chaos engineering, edge e proxies (HTTP/3, QUIC).
  - Vem de: hoje, DevOps e SRE juntos; dev-note, DevOps & Plataformas, Cloud, Observabilidade & SRE e parte de Arq. Corporativa (FinOps, landing zones, Green IT).
  - Posts: Kubernetes CronJob; SIGTERM e SIGKILL; Logging estruturado no Spring Boot; W3C Trace Context; Wide events e canonical log lines.
  - Cresce: Cabe tudo o que acontece depois do commit. Risco: é a lista mais larga da sugestão (15 itens) e pode virar o novo livro-gaveta.
  - Outra opção: título Plataforma (nome do grupo no dev-note) ou a frase “Do commit ao plantão”.
- **07 · Pagamentos** (4 posts; livro novo)
  - Frase: *Dinheiro que não pode sumir nem duplicar.*
  - Abrange: Cartões e redes (Visa, Mastercard, Elo), Pix, Open Finance e DREX, ledger e partidas dobradas, conciliação, idempotência de cobrança, consistência entre gateway e banco, payment rails, PCI DSS e dados de cartão (mascaramento, tokenização), fraude e risco, cooperativas (Unicred, Sicoob, Sicredi), Embedded Finance e BaaS.
  - Vem de: hoje, quatro posts de Arquitetura de Software e Desenvolvimento de Software (os da tag Pagamentos); dev-note, Fintech & Pagamentos.
  - Posts: Arquitetura de ledger; Chave de idempotência; Efeito externo sem registro local; Jackson: filtros que mascaram cartão.
  - Cresce: Quatro eixos que rendem posts por conta própria (cartões e redes, Pix e Open Finance, ledger e conciliação, PCI DSS e fraude). É onde o Cesar mais escreveu nos últimos meses: três dos sete posts publicados desde 10/09/2026 são de pagamentos, e Pagamentos é a única tag de domínio entre as 20.
  - Outra opção: a frase “Cobrar uma vez e registrar sempre” ou o título Fintech, se o Cesar quiser cobrir também crédito e BaaS.
- **08 · Carreira** (sem posts hoje)
  - Frase: *O lado humano de construir software.*
  - Abrange: O papel do arquiteto de soluções, estudo e aprendizado, comunicação e escrita técnica, liderança técnica e mentoria, Team Topologies, DevEx (DORA, SPACE).
  - Vem de: hoje, Carreira; dev-note, parte de Arq. Corporativa (Team Topologies, DevEx, DORA e SPACE).
  - Posts: nenhum hoje.

### Sugestão 2 · Os oito e o domínio (9 livros)

**Ideia.** Os oito de hoje, sem mexer em nenhum, mais Pagamentos. Alivia a Arquitetura de Software (de seis para três posts) com um livro que já nasce com quatro.

**Corte e fonte.** Blog de empresa de pagamentos sobre o desenho do InfoQ. O Stripe tem Payments entre as tags da engenharia, o Nubank separa o domínio e o ByteByteGo tem Payment and Fintech entre os 15 temas. DevOps e SRE continuam dois porque são duas literaturas, DORA e o livro de SRE do Google.

**Ordem.** A de hoje, com Pagamentos antes de Carreira.

**Números.** Média de 2,3 posts por livro. Sem posts hoje: IA e Carreira. Com um ou dois posts: Dados, Segurança e DevOps. Livros novos, que precisam de desenho e cor: Pagamentos.

**Custo e risco.** Fronteira Pagamentos × Arquitetura em idempotência e outbox (regra em “Como ler”).

| Vol. | Livro | Posts hoje |
|---|---|---|
| 01 | Arquitetura de Software | 3 |
| 02 | Desenvolvimento de Software | 5 |
| 03 | Dados | 2 |
| 04 | IA | 0 |
| 05 | Segurança | 2 |
| 06 | DevOps | 2 |
| 07 | SRE | 3 |
| 08 | Pagamentos | 4 |
| 09 | Carreira | 0 |

- **01 · Arquitetura de Software** (3 posts)
  - Frase: *As decisões caras de desfazer.*
  - Abrange: Trade-offs e estilos (monolito modular, microsserviços), DDD e bounded contexts, mensageria e EDA, modelos de consistência, resiliência e service mesh, saga/CQRS/event sourcing, outbox/inbox, API-First (OpenAPI, GraphQL, AsyncAPI), schema evolution, Clean/Hexagonal e padrões GoF/enterprise, C4 Model e ADRs, serverless e multi-region, governança de API, dívida técnica e Tech Radar.
  - Vem de: hoje, Arquitetura de Software (sem os três posts de pagamento); dev-note, Design & Padrões, Sist. Distribuídos, Integração & Eventos e parte de Arq. Corporativa (governança de API, dívida técnica, Tech Radar).
  - Posts: Overhead vs overkill; CronJob ou endpoint + fila; SNS Filter Policy.
- **02 · Desenvolvimento de Software** (5 posts)
  - Frase: *O ofício dentro de cada serviço.*
  - Abrange: Java, Spring e JVM, concorrência e modelos de memória, performance engineering (profiling, GC, p99, teoria de filas), testes (TDD/BDD, Testcontainers, contract testing), refatoração, build tools (Gradle, Maven), web frameworks e runtimes, AOP/proxies/serialização, estruturas de dados e algoritmos, SO e redes, WebAssembly.
  - Vem de: hoje, Desenvolvimento de Software (sem o post de Jackson e cartão); dev-note, Backend & Runtimes, Testes & Qualidade, Fundamentos de Computação.
  - Posts: AOP no Spring; AopUtils.getTargetClass(); AtomicBoolean e a parada graciosa; Gradle: tipos de dependência; Virtual threads: pinning e CLOSE_WAIT.
- **03 · Dados** (2 posts)
  - Frase: *Onde o dado mora e por onde ele anda.*
  - Abrange: Bancos relacionais (PostgreSQL, transações e bloqueios), NoSQL (MongoDB, DynamoDB), modelagem de dados, CDC, pipelines, streaming (Kafka, Flink), data lake/warehouse/lakehouse (Iceberg, dbt), Data Contracts e Data Mesh, DuckDB, bancos vetoriais (pgvector).
  - Vem de: hoje, Dados; dev-note, Dados & Streaming.
  - Posts: Bloqueio otimista e pessimista; Data lake vs data warehouse.
- **04 · IA** (sem posts hoje)
  - Frase: *Software feito com IA e software que usa IA.*
  - Abrange: LLMs e prompts, RAG e embeddings, agentes e orquestração de agentes, MCP, IA no código (AI coding, Claude Code), evals e observabilidade de LLM (Langfuse, LangSmith), guardrails, LLMOps, modelos locais (Ollama), fine-tuning, multimodal e benchmarks, AI Safety.
  - Vem de: hoje, IA; dev-note, AIOps & Agents, IA & LLMs e o AI-augmented SDLC de DevOps & Plataformas.
  - Posts: nenhum hoje.
- **05 · Segurança** (2 posts)
  - Frase: *Quem pode o quê e como provar.*
  - Abrange: Identidade e acesso (OAuth 2.0, OIDC, JWT), criptografia (em repouso, em trânsito, KMS, TLS), segredos (Vault, AWS Secrets Manager), Zero Trust, passkeys e WebAuthn, OWASP e CVEs, cadeia de suprimentos (SBOM, SLSA, Sigstore), segurança em runtime, LGPD, privacidade e compliance, segurança de IA.
  - Vem de: hoje, Segurança; dev-note, Segurança & IAM (o PCI DSS vai para Pagamentos).
  - Posts: Criptografia em repouso e em trânsito; JWT: estrutura e campos.
- **06 · DevOps** (2 posts)
  - Frase: *O caminho do commit até a produção.*
  - Abrange: Containers e CNCF, Kubernetes (CronJob, probes, ciclo de vida do pod), CI/CD e GitOps, nuvem (AWS, Azure, GCP), IaC (Terraform), progressive delivery, platform engineering e IDPs, redes na nuvem (VPC, peering) e CDN, Well-Architected e landing zones, FinOps e Green IT, edge e proxies (HTTP/3, QUIC).
  - Vem de: hoje, DevOps; dev-note, DevOps & Plataformas, Cloud e parte de Arq. Corporativa (FinOps, landing zones, Green IT).
  - Posts: Kubernetes CronJob; SIGTERM e SIGKILL.
- **07 · SRE** (3 posts)
  - Frase: *O que mantém a produção de pé.*
  - Abrange: Observabilidade (OpenTelemetry: traces, métricas, logs), logging estruturado e wide events, SLI/SLO e error budgets, alertas e redução de ruído, gestão de incidentes e post-mortems, APM, eBPF e profiling, chaos engineering, custo de observabilidade.
  - Vem de: hoje, SRE; dev-note, Observabilidade & SRE.
  - Posts: Logging estruturado no Spring Boot; W3C Trace Context; Wide events e canonical log lines.
- **08 · Pagamentos** (4 posts; livro novo)
  - Frase: *Dinheiro que não pode sumir nem duplicar.*
  - Abrange: Cartões e redes (Visa, Mastercard, Elo), Pix, Open Finance e DREX, ledger e partidas dobradas, conciliação, idempotência de cobrança, consistência entre gateway e banco, payment rails, PCI DSS e dados de cartão (mascaramento, tokenização), fraude e risco, cooperativas (Unicred, Sicoob, Sicredi), Embedded Finance e BaaS.
  - Vem de: hoje, quatro posts de Arquitetura de Software e Desenvolvimento de Software (os da tag Pagamentos); dev-note, Fintech & Pagamentos.
  - Posts: Arquitetura de ledger; Chave de idempotência; Efeito externo sem registro local; Jackson: filtros que mascaram cartão.
  - Cresce: Quatro eixos que rendem posts por conta própria (cartões e redes, Pix e Open Finance, ledger e conciliação, PCI DSS e fraude). É onde o Cesar mais escreveu nos últimos meses: três dos sete posts publicados desde 10/09/2026 são de pagamentos, e Pagamentos é a única tag de domínio entre as 20.
  - Outra opção: a frase “Cobrar uma vez e registrar sempre” ou o título Fintech, se o Cesar quiser cobrir também crédito e BaaS.
- **09 · Carreira** (sem posts hoje)
  - Frase: *O lado humano de construir software.*
  - Abrange: O papel do arquiteto de soluções, estudo e aprendizado, comunicação e escrita técnica, liderança técnica e mentoria, Team Topologies, DevEx (DORA, SPACE).
  - Vem de: hoje, Carreira; dev-note, parte de Arq. Corporativa (Team Topologies, DevEx, DORA e SPACE).
  - Posts: nenhum hoje.

### Sugestão 3 · Corpo de conhecimento (10 livros)

**Ideia.** Os capítulos do SWEBOK v4 aplicados ao blog: arquitetura separada de projeto, Testes e Qualidade com livro e Operações dividida nas duas metades do capítulo 6, entrega (DevOps) e controle (SRE). Sem livro de domínio.

**Corte e fonte.** SWEBOK v4 (IEEE Computer Society): capítulos 2 (Architecture), 3 (Design), 4 (Construction), 5 e 12 (Testing e Quality), 6 (Operations: planejamento, entrega e controle), 13 (Security), 14 e 15 (Professional Practice e Economics) e 16 (Computing Foundations, onde ficam as seções de bancos de dados e de IA). O SEBoK registra que Architecture virou área própria por ser disciplina distinta de Design. Ledger, idempotência e efeito externo viram Design e Padrões.

**Ordem.** A dos capítulos do SWEBOK (2, 3, 4, 5 e 12, 6, 13, 14 e 15, 16).

**Números.** Média de 2,1 posts por livro. Sem posts hoje: Testes e Qualidade, Carreira e IA. Com um ou dois posts: DevOps, Segurança e Dados. Livros novos, que precisam de desenho e cor: Design e Padrões e Testes e Qualidade.

**Custo e risco.** A fronteira Arquitetura × Design e Padrões é a mais difícil de explicar a um leitor: arquitetura é estrutura, estilo e decisão; design é a solução repetível dentro dela. Fintech & Pagamentos, do dev-note, perde visibilidade.

| Vol. | Livro | Posts hoje |
|---|---|---|
| 01 | Arquitetura de Software | 3 |
| 02 | Design e Padrões | 3 |
| 03 | Desenvolvimento de Software | 6 |
| 04 | Testes e Qualidade | 0 |
| 05 | DevOps | 2 |
| 06 | SRE | 3 |
| 07 | Segurança | 2 |
| 08 | Carreira | 0 |
| 09 | Dados | 2 |
| 10 | IA | 0 |

- **01 · Arquitetura de Software** (3 posts)
  - Frase: *As decisões caras de desfazer.*
  - Abrange: Trade-offs e estilos (monolito modular, microsserviços), sistemas distribuídos (resiliência e modelos de consistência), mensageria e EDA, API-First (OpenAPI, GraphQL, AsyncAPI), schema evolution, service mesh e cloud-native, serverless e multi-region, avaliação de arquitetura, governança de API, dívida técnica e Tech Radar.
  - Vem de: hoje, Arquitetura de Software (sem os três posts de padrões); dev-note, Sist. Distribuídos, Integração & Eventos e parte de Arq. Corporativa (governança de API, dívida técnica, Tech Radar).
  - Posts: Overhead vs overkill; CronJob ou endpoint + fila; SNS Filter Policy.
- **02 · Design e Padrões** (3 posts; livro novo)
  - Frase: *As soluções que já têm nome.*
  - Abrange: DDD (estratégico e tático), padrões GoF e enterprise, Clean e Hexagonal, idempotência/outbox/inbox/saga/ledger, CQRS e event sourcing, C4 Model e ADRs, refatoração, docs-as-code.
  - Vem de: hoje, três posts de Arquitetura de Software (ledger, idempotência, efeito externo); dev-note, Design & Padrões e a parte de padrões de Sist. Distribuídos (saga, CQRS/ES, outbox/inbox, idempotência).
  - Posts: Arquitetura de ledger; Chave de idempotência; Efeito externo sem registro local.
  - Cresce: Padrões não acabam (GoF, enterprise, de consistência). Risco: a fronteira com Arquitetura, que fica com estrutura, estilo e decisão.
- **03 · Desenvolvimento de Software** (6 posts)
  - Frase: *O ofício dentro de cada serviço.*
  - Abrange: Java, Spring e JVM, concorrência e modelos de memória, performance engineering (profiling, GC, p99, teoria de filas), build tools (Gradle, Maven), web frameworks e runtimes, AOP/proxies/serialização, estruturas de dados e algoritmos, SO e redes, WebAssembly.
  - Vem de: hoje, Desenvolvimento de Software; dev-note, Backend & Runtimes, Fundamentos de Computação.
  - Posts: AOP no Spring; AopUtils.getTargetClass(); AtomicBoolean e a parada graciosa; Gradle: tipos de dependência; Jackson: filtros que mascaram cartão; Virtual threads: pinning e CLOSE_WAIT.
- **04 · Testes e Qualidade** (sem posts hoje; livro novo)
  - Frase: *Como saber que ainda funciona.*
  - Abrange: TDD e BDD, pirâmide de testes, testes de integração (Testcontainers), contract testing (Pact), mutation testing, testes de performance e carga, test data management, testes assistidos por IA, qualidade de código e revisão.
  - Vem de: hoje, nenhum (“testes e refatoração” só aparece hoje no subtítulo de Desenvolvimento); dev-note, Testes & Qualidade (o chaos engineering vai para SRE).
  - Posts: nenhum hoje.
  - Cresce: Assunto de sobra para quem escreve Java e Spring (Testcontainers, contract testing, mutation testing); o Radar v34 recolocou testes em cena como freio para agentes de código. Hoje vazio.
- **05 · DevOps** (2 posts)
  - Frase: *O caminho do commit até a produção.*
  - Abrange: Containers e CNCF, Kubernetes (CronJob, probes, ciclo de vida do pod), CI/CD e GitOps, nuvem (AWS, Azure, GCP), IaC (Terraform), progressive delivery, platform engineering e IDPs, redes na nuvem (VPC, peering) e CDN, Well-Architected e landing zones, FinOps e Green IT, edge e proxies (HTTP/3, QUIC).
  - Vem de: hoje, DevOps; dev-note, DevOps & Plataformas, Cloud e parte de Arq. Corporativa (FinOps, landing zones, Green IT).
  - Posts: Kubernetes CronJob; SIGTERM e SIGKILL.
- **06 · SRE** (3 posts)
  - Frase: *O que mantém a produção de pé.*
  - Abrange: Observabilidade (OpenTelemetry: traces, métricas, logs), logging estruturado e wide events, SLI/SLO e error budgets, alertas e redução de ruído, gestão de incidentes e post-mortems, APM, eBPF e profiling, chaos engineering, custo de observabilidade.
  - Vem de: hoje, SRE; dev-note, Observabilidade & SRE.
  - Posts: Logging estruturado no Spring Boot; W3C Trace Context; Wide events e canonical log lines.
- **07 · Segurança** (2 posts)
  - Frase: *Quem pode o quê e como provar.*
  - Abrange: Identidade e acesso (OAuth 2.0, OIDC, JWT), criptografia (em repouso, em trânsito, KMS, TLS), segredos (Vault, AWS Secrets Manager), Zero Trust, passkeys e WebAuthn, OWASP e CVEs, cadeia de suprimentos (SBOM, SLSA, Sigstore), segurança em runtime, LGPD, privacidade e compliance, PCI DSS, fraude e risco, segurança de IA.
  - Vem de: hoje, Segurança; dev-note, Segurança & IAM e o lado de segurança de Fintech & Pagamentos (PCI DSS, fraude e risco).
  - Posts: Criptografia em repouso e em trânsito; JWT: estrutura e campos.
- **08 · Carreira** (sem posts hoje)
  - Frase: *O lado humano de construir software.*
  - Abrange: O papel do arquiteto de soluções, estudo e aprendizado, comunicação e escrita técnica, liderança técnica e mentoria, Team Topologies, DevEx (DORA, SPACE).
  - Vem de: hoje, Carreira; dev-note, parte de Arq. Corporativa (Team Topologies, DevEx, DORA e SPACE).
  - Posts: nenhum hoje.
- **09 · Dados** (2 posts)
  - Frase: *Onde o dado mora e por onde ele anda.*
  - Abrange: Bancos relacionais (PostgreSQL, transações e bloqueios), NoSQL (MongoDB, DynamoDB), modelagem de dados, CDC, pipelines, streaming (Kafka, Flink), data lake/warehouse/lakehouse (Iceberg, dbt), Data Contracts e Data Mesh, DuckDB, bancos vetoriais (pgvector).
  - Vem de: hoje, Dados; dev-note, Dados & Streaming.
  - Posts: Bloqueio otimista e pessimista; Data lake vs data warehouse.
- **10 · IA** (sem posts hoje)
  - Frase: *Software feito com IA e software que usa IA.*
  - Abrange: LLMs e prompts, RAG e embeddings, agentes e orquestração de agentes, MCP, IA no código (AI coding, Claude Code), evals e observabilidade de LLM (Langfuse, LangSmith), guardrails, LLMOps, modelos locais (Ollama), fine-tuning, multimodal e benchmarks, AI Safety.
  - Vem de: hoje, IA; dev-note, AIOps & Agents, IA & LLMs e o AI-augmented SDLC de DevOps & Plataformas.
  - Posts: nenhum hoje.

### Sugestão 4 · Praticante (11 livros)

**Ideia.** Os temas de quem escreve sobre prática: Sistemas Distribuídos fora de Arquitetura, Testes e Qualidade com livro e IA em dois (sistemas com IA; código com IA). Sem livro de domínio.

**Corte e fonte.** Martin Fowler (o menu do site separa Architecture de Microservices e tem Testing próprio), Kleppmann (a parte II do DDIA, Distributed Data, é só sobre o que dá errado entre máquinas), Radar v33 e v34 (os temas giram em torno de IA e agentes) e Alura (IA para Programação e IA para Dados são duas subáreas). A frase de hoje do livro IA já tem as duas metades.

**Ordem.** Da decisão ao código, ao dado, à IA, ao que protege e ao que opera; gente por último.

**Números.** Média de 1,9 posts por livro. Sem posts hoje: Testes e Qualidade, IA, Código com IA e Carreira. Com um ou dois posts: Dados, Segurança e DevOps. Livros novos, que precisam de desenho e cor: Sistemas Distribuídos, Testes e Qualidade e Código com IA.

**Custo e risco.** Fintech & Pagamentos perde visibilidade. Distribuídos e Arquitetura se tocam em resiliência e consistência: Arquitetura fica com estilo, domínio e decisão.

| Vol. | Livro | Posts hoje |
|---|---|---|
| 01 | Arquitetura de Software | 3 |
| 02 | Sistemas Distribuídos | 3 |
| 03 | Desenvolvimento de Software | 6 |
| 04 | Testes e Qualidade | 0 |
| 05 | Dados | 2 |
| 06 | IA | 0 |
| 07 | Código com IA | 0 |
| 08 | Segurança | 2 |
| 09 | DevOps | 2 |
| 10 | SRE | 3 |
| 11 | Carreira | 0 |

- **01 · Arquitetura de Software** (3 posts)
  - Frase: *As decisões caras de desfazer.*
  - Abrange: Trade-offs e estilos (monolito modular, microsserviços), DDD e bounded contexts, Clean e Hexagonal, padrões GoF e enterprise, C4 Model/ADRs/docs-as-code, estudos de caso (ledger e conciliação), governança de API, dívida técnica e Tech Radar.
  - Vem de: hoje, Arquitetura de Software (sem os posts de sistemas distribuídos); dev-note, Design & Padrões e parte de Arq. Corporativa (governança de API, dívida técnica, Tech Radar).
  - Posts: Arquitetura de ledger; CronJob ou endpoint + fila; Overhead vs overkill.
- **02 · Sistemas Distribuídos** (3 posts; livro novo)
  - Frase: *O que acontece entre um serviço e outro.*
  - Abrange: Resiliência (timeout, retry, circuit breaker), idempotência, outbox/inbox, saga/CQRS/event sourcing, modelos de consistência, mensageria e EDA, API-First (OpenAPI, GraphQL, AsyncAPI), schema evolution, service mesh e cloud-native, caching, serverless e multi-region, durable execution.
  - Vem de: hoje, três posts de Arquitetura de Software (idempotência, efeito externo, SNS); dev-note, Sist. Distribuídos e Integração & Eventos (o MCP vai para IA).
  - Posts: Chave de idempotência; Efeito externo sem registro local; SNS Filter Policy.
  - Cresce: Os problemas se repetem em todo serviço (retry, idempotência, mensageria, consistência) e a literatura é farta (Kleppmann, Builders' Library, livro de SRE do Google).
  - Outra opção: a frase “Quando a chamada não volta”.
- **03 · Desenvolvimento de Software** (6 posts)
  - Frase: *O ofício dentro de cada serviço.*
  - Abrange: Java, Spring e JVM, concorrência e modelos de memória, performance engineering (profiling, GC, p99, teoria de filas), refatoração, build tools (Gradle, Maven), web frameworks e runtimes, AOP/proxies/serialização, estruturas de dados e algoritmos, SO e redes, WebAssembly.
  - Vem de: hoje, Desenvolvimento de Software; dev-note, Backend & Runtimes, Fundamentos de Computação.
  - Posts: AOP no Spring; AopUtils.getTargetClass(); AtomicBoolean e a parada graciosa; Gradle: tipos de dependência; Jackson: filtros que mascaram cartão; Virtual threads: pinning e CLOSE_WAIT.
- **04 · Testes e Qualidade** (sem posts hoje; livro novo)
  - Frase: *Como saber que ainda funciona.*
  - Abrange: TDD e BDD, pirâmide de testes, testes de integração (Testcontainers), contract testing (Pact), mutation testing, testes de performance e carga, test data management, qualidade de código e revisão.
  - Vem de: hoje, nenhum (“testes e refatoração” só aparece hoje no subtítulo de Desenvolvimento); dev-note, Testes & Qualidade (o chaos engineering vai para SRE; os testes assistidos por IA, para Código com IA).
  - Posts: nenhum hoje.
  - Cresce: Assunto de sobra para quem escreve Java e Spring (Testcontainers, contract testing, mutation testing); o Radar v34 recolocou testes em cena como freio para agentes de código. Hoje vazio.
- **05 · Dados** (2 posts)
  - Frase: *Onde o dado mora e por onde ele anda.*
  - Abrange: Bancos relacionais (PostgreSQL, transações e bloqueios), NoSQL (MongoDB, DynamoDB), modelagem de dados, CDC, pipelines, streaming (Kafka, Flink), data lake/warehouse/lakehouse (Iceberg, dbt), Data Contracts e Data Mesh, DuckDB, bancos vetoriais (pgvector).
  - Vem de: hoje, Dados; dev-note, Dados & Streaming.
  - Posts: Bloqueio otimista e pessimista; Data lake vs data warehouse.
- **06 · IA** (sem posts hoje)
  - Frase: *O software que fica em volta do modelo.*
  - Mudança: frase nova, porque a metade “software feito com IA” vai para Código com IA.
  - Abrange: LLMs e prompts, RAG e embeddings, agentes e orquestração de agentes, MCP, evals e observabilidade de LLM (Langfuse, LangSmith), guardrails, LLMOps, modelos locais (Ollama), fine-tuning, multimodal e benchmarks, AI Safety.
  - Vem de: hoje, IA (a metade “software que usa IA”); dev-note, IA & LLMs e AIOps & Agents (LLMOps, RAG, agentes, MCP, evals).
  - Posts: nenhum hoje.
- **07 · Código com IA** (sem posts hoje; livro novo)
  - Frase: *O que o agente escreve e quem confere.*
  - Abrange: Agentes de código (Claude Code), engenharia de contexto, spec-driven development, Agent Skills e subagentes, revisão do código gerado, testes assistidos por IA e mutation testing, permissões e guardrails de agentes, AI-augmented SDLC, dívida cognitiva.
  - Vem de: hoje, IA (a metade “software feito com IA”); dev-note, AIOps & Agents (AI Coding em produção), DevOps & Plataformas (AI-augmented SDLC), Testes & Qualidade (AI-assisted testing).
  - Posts: nenhum hoje.
  - Cresce: O Cesar já trabalha assim todo dia, e a frase de hoje do livro IA já tem as duas metades. Só vale separar quando IA passar de uns seis posts. Hoje vazio.
  - Outra opção: a frase “Programar com agente sem largar o volante”.
- **08 · Segurança** (2 posts)
  - Frase: *Quem pode o quê e como provar.*
  - Abrange: Identidade e acesso (OAuth 2.0, OIDC, JWT), criptografia (em repouso, em trânsito, KMS, TLS), segredos (Vault, AWS Secrets Manager), Zero Trust, passkeys e WebAuthn, OWASP e CVEs, cadeia de suprimentos (SBOM, SLSA, Sigstore), segurança em runtime, LGPD, privacidade e compliance, PCI DSS, fraude e risco, segurança de IA.
  - Vem de: hoje, Segurança; dev-note, Segurança & IAM e o lado de segurança de Fintech & Pagamentos (PCI DSS, fraude e risco).
  - Posts: Criptografia em repouso e em trânsito; JWT: estrutura e campos.
- **09 · DevOps** (2 posts)
  - Frase: *O caminho do commit até a produção.*
  - Abrange: Containers e CNCF, Kubernetes (CronJob, probes, ciclo de vida do pod), CI/CD e GitOps, nuvem (AWS, Azure, GCP), IaC (Terraform), progressive delivery, platform engineering e IDPs, redes na nuvem (VPC, peering) e CDN, Well-Architected e landing zones, FinOps e Green IT, edge e proxies (HTTP/3, QUIC).
  - Vem de: hoje, DevOps; dev-note, DevOps & Plataformas, Cloud e parte de Arq. Corporativa (FinOps, landing zones, Green IT).
  - Posts: Kubernetes CronJob; SIGTERM e SIGKILL.
- **10 · SRE** (3 posts)
  - Frase: *O que mantém a produção de pé.*
  - Abrange: Observabilidade (OpenTelemetry: traces, métricas, logs), logging estruturado e wide events, SLI/SLO e error budgets, alertas e redução de ruído, gestão de incidentes e post-mortems, APM, eBPF e profiling, chaos engineering, custo de observabilidade.
  - Vem de: hoje, SRE; dev-note, Observabilidade & SRE.
  - Posts: Logging estruturado no Spring Boot; W3C Trace Context; Wide events e canonical log lines.
- **11 · Carreira** (sem posts hoje)
  - Frase: *O lado humano de construir software.*
  - Abrange: O papel do arquiteto de soluções, estudo e aprendizado, comunicação e escrita técnica, liderança técnica e mentoria, Team Topologies, DevEx (DORA, SPACE).
  - Vem de: hoje, Carreira; dev-note, parte de Arq. Corporativa (Team Topologies, DevEx, DORA e SPACE).
  - Posts: nenhum hoje.

### Sugestão 5 · Camadas (12 livros)

**Ideia.** De baixo para cima: o que roda por baixo (Fundamentos), o que se constrói, o que se opera e o que se aplica. É a ordem de uma edição de estudo e a mais completa: só Frontend & Web fica fora.

**Corte e fonte.** ACM CCS 2012 (13 áreas, de hardware e redes até Applied computing e Social and professional topics), CS2023 (17 áreas, entre elas Systems Fundamentals, Operating Systems, Networking and Communication e Parallel and Distributed Computing) e as camadas do CNCF Landscape (Provisioning, Runtime, Orchestration & Management, App Definition and Development, Observability and Analysis, Platform). A ordem de estudo lembra o OSSU, que põe Core systems antes de Core applications. Pagamentos entra como Applied computing.

**Ordem.** De baixo para cima, do que roda por baixo ao que se aplica.

**Números.** Média de 1,8 posts por livro. Sem posts hoje: Fundamentos, Nuvem, IA e Carreira. Com um ou dois posts: Dados, Sistemas Distribuídos, Arquitetura de Software, DevOps e Segurança. Livros novos, que precisam de desenho e cor: Fundamentos, Sistemas Distribuídos, Nuvem e Pagamentos.

| Vol. | Livro | Posts hoje |
|---|---|---|
| 01 | Fundamentos | 0 |
| 02 | Desenvolvimento de Software | 5 |
| 03 | Dados | 2 |
| 04 | Sistemas Distribuídos | 1 |
| 05 | Arquitetura de Software | 2 |
| 06 | Nuvem | 0 |
| 07 | DevOps | 2 |
| 08 | SRE | 3 |
| 09 | Segurança | 2 |
| 10 | IA | 0 |
| 11 | Pagamentos | 4 |
| 12 | Carreira | 0 |

- **01 · Fundamentos** (sem posts hoje; livro novo)
  - Frase: *O que roda debaixo de todo serviço.*
  - Abrange: Sistemas operacionais (processos, sinais, memória), redes (TCP/IP, DNS), estruturas de dados, algoritmos, modelos de memória e atomicidade, teoria de filas, performance de hardware.
  - Vem de: hoje, nenhum (os conceitos aparecem hoje espalhados em Desenvolvimento e DevOps); dev-note, Fundamentos de Computação.
  - Posts: nenhum hoje.
  - Cresce: A base não envelhece, e concorrência é assunto recorrente: 4 dos 21 posts levam a tag Concorrência e dois dos sete de setembro (virtual threads e bloqueio) são dela. Candidatos entre os posts de hoje: SIGTERM e SIGKILL, CLOSE_WAIT e AtomicBoolean (ver “Posts de fronteira”). Hoje vazio.
  - Outra opção: a frase “A base debaixo de qualquer framework”.
- **02 · Desenvolvimento de Software** (5 posts)
  - Frase: *O ofício dentro de cada serviço.*
  - Abrange: Java, Spring e JVM, concorrência na JVM (virtual threads, atomics), performance engineering (profiling, GC, p99), testes (TDD/BDD, Testcontainers, contract testing), refatoração, build tools (Gradle, Maven), web frameworks e runtimes, AOP/proxies/serialização, WebAssembly.
  - Vem de: hoje, Desenvolvimento de Software (sem o post de Jackson e cartão); dev-note, Backend & Runtimes e Testes & Qualidade.
  - Posts: AOP no Spring; AopUtils.getTargetClass(); AtomicBoolean e a parada graciosa; Gradle: tipos de dependência; Virtual threads: pinning e CLOSE_WAIT.
- **03 · Dados** (2 posts)
  - Frase: *Onde o dado mora e por onde ele anda.*
  - Abrange: Bancos relacionais (PostgreSQL, transações e bloqueios), NoSQL (MongoDB, DynamoDB), modelagem de dados, CDC, pipelines, streaming (Kafka, Flink), data lake/warehouse/lakehouse (Iceberg, dbt), Data Contracts e Data Mesh, DuckDB, bancos vetoriais (pgvector).
  - Vem de: hoje, Dados; dev-note, Dados & Streaming.
  - Posts: Bloqueio otimista e pessimista; Data lake vs data warehouse.
- **04 · Sistemas Distribuídos** (1 post; livro novo)
  - Frase: *O que acontece entre um serviço e outro.*
  - Abrange: Resiliência (timeout, retry, circuit breaker), idempotência (a técnica geral; a de cobrança fica em Pagamentos), outbox/inbox, saga/CQRS/event sourcing, modelos de consistência, mensageria e EDA, API-First (OpenAPI, GraphQL, AsyncAPI), schema evolution, service mesh e cloud-native, caching, multi-region, durable execution.
  - Vem de: hoje, um post de Arquitetura de Software (SNS); dev-note, Sist. Distribuídos e Integração & Eventos (o MCP vai para IA).
  - Posts: SNS Filter Policy.
  - Cresce: Os problemas se repetem em todo serviço (retry, idempotência, mensageria, consistência) e a literatura é farta (Kleppmann, Builders' Library, livro de SRE do Google).
  - Outra opção: a frase “Quando a chamada não volta”.
- **05 · Arquitetura de Software** (2 posts)
  - Frase: *As decisões caras de desfazer.*
  - Abrange: Trade-offs e estilos (monolito modular, microsserviços), DDD e bounded contexts, Clean e Hexagonal, padrões GoF e enterprise, C4 Model/ADRs/docs-as-code, governança de API, dívida técnica e Tech Radar.
  - Vem de: hoje, Arquitetura de Software (o que sobra de decisão); dev-note, Design & Padrões e parte de Arq. Corporativa (governança de API, dívida técnica, Tech Radar).
  - Posts: Overhead vs overkill; CronJob ou endpoint + fila.
- **06 · Nuvem** (sem posts hoje; livro novo)
  - Frase: *O que alugar e quanto custa.*
  - Abrange: AWS, Azure e GCP (compute, dados, mensageria, segurança), serverless (Lambda), redes na nuvem (VPC, peering), CDN e Edge (Cloudflare, Fastly), Bedrock e IA gerenciada, Well-Architected, landing zones, FinOps multi-cloud, Green IT.
  - Vem de: hoje, a parte de nuvem do DevOps; dev-note, Cloud e parte de Arq. Corporativa (FinOps, landing zones, Green IT).
  - Posts: nenhum hoje.
  - Cresce: A AWS é a plataforma do autor (SNS, SQS, RDS, KMS; a tag AWS está em 3 posts) e post sobre um serviço específico ficaria aqui. Risco: sobrepor DevOps e Sistemas Distribuídos. Hoje vazio.
- **07 · DevOps** (2 posts)
  - Frase: *O caminho do commit até a produção.*
  - Abrange: Containers e CNCF, Kubernetes (CronJob, probes, ciclo de vida do pod), CI/CD e GitOps, IaC (Terraform), progressive delivery, platform engineering e IDPs, proxies e protocolos (HTTP/3, QUIC).
  - Vem de: hoje, DevOps; dev-note, DevOps & Plataformas.
  - Posts: Kubernetes CronJob; SIGTERM e SIGKILL.
- **08 · SRE** (3 posts)
  - Frase: *O que mantém a produção de pé.*
  - Abrange: Observabilidade (OpenTelemetry: traces, métricas, logs), logging estruturado e wide events, SLI/SLO e error budgets, alertas e redução de ruído, gestão de incidentes e post-mortems, APM, eBPF e profiling, chaos engineering, custo de observabilidade.
  - Vem de: hoje, SRE; dev-note, Observabilidade & SRE.
  - Posts: Logging estruturado no Spring Boot; W3C Trace Context; Wide events e canonical log lines.
- **09 · Segurança** (2 posts)
  - Frase: *Quem pode o quê e como provar.*
  - Abrange: Identidade e acesso (OAuth 2.0, OIDC, JWT), criptografia (em repouso, em trânsito, KMS, TLS), segredos (Vault, AWS Secrets Manager), Zero Trust, passkeys e WebAuthn, OWASP e CVEs, cadeia de suprimentos (SBOM, SLSA, Sigstore), segurança em runtime, LGPD, privacidade e compliance, segurança de IA.
  - Vem de: hoje, Segurança; dev-note, Segurança & IAM (o PCI DSS vai para Pagamentos).
  - Posts: Criptografia em repouso e em trânsito; JWT: estrutura e campos.
- **10 · IA** (sem posts hoje)
  - Frase: *Software feito com IA e software que usa IA.*
  - Abrange: LLMs e prompts, RAG e embeddings, agentes e orquestração de agentes, MCP, IA no código (AI coding, Claude Code), evals e observabilidade de LLM (Langfuse, LangSmith), guardrails, LLMOps, modelos locais (Ollama), fine-tuning, multimodal e benchmarks, AI Safety.
  - Vem de: hoje, IA; dev-note, AIOps & Agents, IA & LLMs e o AI-augmented SDLC de DevOps & Plataformas.
  - Posts: nenhum hoje.
- **11 · Pagamentos** (4 posts; livro novo)
  - Frase: *Dinheiro que não pode sumir nem duplicar.*
  - Abrange: Cartões e redes (Visa, Mastercard, Elo), Pix, Open Finance e DREX, ledger e partidas dobradas, conciliação, idempotência de cobrança, consistência entre gateway e banco, payment rails, PCI DSS e dados de cartão (mascaramento, tokenização), fraude e risco, cooperativas (Unicred, Sicoob, Sicredi), Embedded Finance e BaaS.
  - Vem de: hoje, quatro posts de Arquitetura de Software e Desenvolvimento de Software (os da tag Pagamentos); dev-note, Fintech & Pagamentos.
  - Posts: Arquitetura de ledger; Chave de idempotência; Efeito externo sem registro local; Jackson: filtros que mascaram cartão.
  - Cresce: Quatro eixos que rendem posts por conta própria (cartões e redes, Pix e Open Finance, ledger e conciliação, PCI DSS e fraude). É onde o Cesar mais escreveu nos últimos meses: três dos sete posts publicados desde 10/09/2026 são de pagamentos, e Pagamentos é a única tag de domínio entre as 20.
  - Outra opção: a frase “Cobrar uma vez e registrar sempre” ou o título Fintech, se o Cesar quiser cobrir também crédito e BaaS.
- **12 · Carreira** (sem posts hoje)
  - Frase: *O lado humano de construir software.*
  - Abrange: O papel do arquiteto de soluções, estudo e aprendizado, comunicação e escrita técnica, liderança técnica e mentoria, Team Topologies, DevEx (DORA, SPACE).
  - Vem de: hoje, Carreira; dev-note, parte de Arq. Corporativa (Team Topologies, DevEx, DORA e SPACE).
  - Posts: nenhum hoje.

### Posts de fronteira

Os posts que têm mais de uma casa defensável. Os números são as sugestões.

| Post | Casa nas sugestões | Outra casa possível |
|---|---|---|
| Jackson: filtros que mascaram cartão | Pagamentos (1, 2, 5); Desenvolvimento (3, 4) | Segurança, por ser dado sensível em log |
| Chave de idempotência | Pagamentos (1, 2, 5); Design e Padrões (3); Sistemas Distribuídos (4) | Arquitetura |
| Efeito externo sem registro local | a mesma de Chave de idempotência | Dados, por ser consistência entre dois sistemas |
| Arquitetura de ledger | Pagamentos (1, 2, 5); Design e Padrões (3); Arquitetura (4) | Dados, pela modelagem de saldos |
| CronJob ou endpoint + fila | Arquitetura (todas) | DevOps, por ser Kubernetes; Sistemas Distribuídos, pela fila |
| SNS Filter Policy | Arquitetura (1, 2, 3); Sistemas Distribuídos (4, 5) | Nuvem (5), se o post for sobre o serviço e não sobre mensageria |
| Bloqueio otimista e pessimista | Dados | Desenvolvimento (JPA e @Version); Fundamentos (5) |
| AtomicBoolean e a parada graciosa | Desenvolvimento | DevOps, pela parada graciosa; Fundamentos (5) |
| Virtual threads: pinning e CLOSE_WAIT | Desenvolvimento | Fundamentos (5), pelo TCP |
| SIGTERM e SIGKILL | DevOps (Operações na 1) | Fundamentos (5), por serem sinais de SO |
| W3C Trace Context | SRE (Operações na 1) | Sistemas Distribuídos (4, 5), por tratar de microsserviços |
| AOP no Spring e AopUtils | Desenvolvimento | Design e Padrões (3), por serem o padrão Proxy |
| Criptografia em repouso e em trânsito | Segurança | Dados (Postgres e MongoDB) e Nuvem (KMS) |

### Legenda dos posts

| Nome curto | Arquivo em `src/content/posts/` | Livro de hoje |
|---|---|---|
| AOP no Spring | `aop-jdk-proxy-cglib` | Desenvolvimento de Software |
| AopUtils.getTargetClass() | `aoputils-gettargetclass` | Desenvolvimento de Software |
| Arquitetura de ledger | `arquitetura-de-ledger` | Arquitetura de Software |
| AtomicBoolean e a parada graciosa | `atomicboolean-parada-graciosa` | Desenvolvimento de Software |
| Bloqueio otimista e pessimista | `bloqueio-otimista-e-pessimista` | Dados |
| Chave de idempotência | `cobranca-duplicada-no-retry` | Arquitetura de Software |
| Criptografia em repouso e em trânsito | `criptografia-em-repouso-e-em-transito` | Segurança |
| CronJob ou endpoint + fila | `cronjob-vs-endpoint-sqs` | Arquitetura de Software |
| Data lake vs data warehouse | `data-lake-vs-data-warehouse` | Dados |
| Efeito externo sem registro local | `efeito-externo-sem-registro-local` | Arquitetura de Software |
| Gradle: tipos de dependência | `gradle-tipos-de-dependencia` | Desenvolvimento de Software |
| Jackson: filtros que mascaram cartão | `jackson-filtros-mascarando-cartao` | Desenvolvimento de Software |
| JWT: estrutura e campos | `jwt-estrutura-e-campos` | Segurança |
| Kubernetes CronJob | `kubernetes-cronjob-concorrencia` | DevOps |
| Logging estruturado no Spring Boot | `logging-estruturado-spring-boot` | SRE |
| Overhead vs overkill | `overhead-vs-overkill` | Arquitetura de Software |
| SIGTERM e SIGKILL | `sigterm-sigkill-kubernetes` | DevOps |
| SNS Filter Policy | `sns-filter-policy` | Arquitetura de Software |
| Virtual threads: pinning e CLOSE_WAIT | `virtual-threads-pinning-close-wait` | Desenvolvimento de Software |
| W3C Trace Context | `w3c-trace-context` | SRE |
| Wide events e canonical log lines | `wide-events-canonical-log-lines` | SRE |

## 3. Recomendação

**A sugestão 2: os oito livros de hoje mais Pagamentos, nove ao todo.**

- **Resolve o problema que as fontes não resolvem sozinhas.** Os oito de hoje já são o núcleo que InfoQ, O'Reilly e SWEBOK v4 repetem; o que pesa é a Arquitetura de Software ter seis dos 21 posts e três assuntos misturados. Com Pagamentos ela cai para três (decisão e integração) e o livro novo nasce com quatro, todos já marcados com a tag Pagamentos. Cada um dos 21 posts tem casa óbvia; os poucos de fronteira estão na tabela.
- **Custa pouco.** Os oito desenhos e cores já aprovados continuam; só Pagamentos é novo.
- **O livro novo é o único que a pesquisa não impõe e o conteúdo pede.** Nenhuma norma ou currículo separa domínio, mas Stripe, Nubank e ByteByteGo separam; Fintech & Pagamentos é a única categoria de domínio do dev-note, Pagamentos é a única tag de domínio do blog e três dos sete posts publicados desde 10/09/2026 são de pagamentos. Cresce para os dois lados: a técnica (ledger, idempotência, consistência entre gateway e banco) e o mercado (Pix, cartões, Open Finance, cooperativas, PCI DSS).
- **Mantém DevOps e SRE separados, por pouco.** As fontes de uso geral juntam os dois; o livro de SRE do Google e o CNCF tratam observabilidade como disciplina própria, e os dois livros já existem, desenhados, com dois e três posts. Mas não há post novo de DevOps ou SRE desde 20/05: se o Cesar não pretende voltar a escrever nessas áreas, a sugestão 1 é a mais enxuta, ao custo de um livro de operações com 15 itens, a lista mais larga da sugestão.
- **Deixa a porta aberta sem encher a estante de vazios.** Sistemas Distribuídos, Testes e Qualidade, Código com IA, Fundamentos e Nuvem (sugestões 3 a 5) nasceriam sem post. A regra para dividir depois é: quando um livro passar de uns seis posts (Desenvolvimento, sem o post de Jackson, está em cinco) ou quando um assunto novo juntar três. As três divisões que a sugestão 4 faz (Sistemas Distribuídos, Testes e Qualidade, Código com IA) são as mais prováveis. Como as URLs de categoria antigas redirecionam, dividir depois custa pouco.
- **Risco a vigiar.** A fronteira Pagamentos × Arquitetura (idempotência, outbox, saga). Para os posts de hoje a tag Pagamentos decide; para os futuros vale o mesmo critério: se o texto só faz sentido com dinheiro no meio, é Pagamentos; se serve a qualquer sistema, é Arquitetura.

Se o Cesar pensar diferente: o mínimo de livros é a sugestão 1; ver as fontes acadêmicas aplicadas, a 3; o mapa completo desde já, a 5.
