# A coleção de 13: frase, temas, o que abrange e os posts de cada livro

Etapa 3 do `controle.md` (D61). Para cada um dos 13 livros, em ordem alfabética (= volume): a frase
da capa, os temas e o subtítulo completo no formato do site (`livros.json`: `frase`, `temas`,
`subtituloCompleto`), a lista do que o livro abrange (no formato do site de notícias, 6 a 10 itens, cada
assunto num livro só), de onde ele vem e os posts que vão para ele. No fim: para onde foi cada uma das
16 categorias do site de notícias, os posts de fronteira, a tag Pagamentos e a tabela de revisão.

Base: a sugestão 5 do `colecoes.json`, com os ajustes que o Cesar decidiu (Desenvolvimento de Software
e SRE mantêm o nome, Frontend entra, Carreira sai, volumes em ordem alfabética) e os pontos de texto da
`critica.md` (MCP, FinOps, PCI DSS e Team Topologies num livro só; "duplicar" no lugar de "dobrar";
"deve" no lugar de "diz"; "padrões (GoF, Fowler)"; "bloqueio otimista e pessimista" como título do post).

Todas as frases foram medidas com `node scripts/livros/titulo-da-capa.mjs --json …` (Newsreader
itálico 24/31px em 404px): **as 13 escolhidas cabem numa linha**, e as alternativas também. A única
candidata que ocupou duas linhas ("O que não muda quando a ferramenta muda.", 40 caracteres) saiu.

Os seis nomes novos ficam como o Cesar escolheu. Não há motivo forte para trocar nenhum: "Integração e
Eventos" mantém o "e Eventos" porque "Integração" sozinho lembra integração contínua e "Mensageria" já é
tag de quatro posts; "Fundamentos" é vago para busca, mas "Fundamentos de Computação" só ganha tamanho;
"Frontend" é a grafia do site de notícias e a palavra que o leitor digita.

## As regras de encaixe (valem para os 13 e para os posts que vierem)

1. **O livro é o que o post ensina; o exemplo vira tag.** A chave de idempotência ensina idempotência;
   a cobrança é o exemplo e fica na tag.
2. **Ferramenta no título vai para o livro do ofício dela** (Jackson, Gradle, AtomicBoolean →
   Desenvolvimento de Software), a não ser que o assunto seja a produção (Logging estruturado → SRE).
3. **Comparação entre dois desenhos vai para Arquitetura de Software** (CronJob ou endpoint + fila,
   Overhead vs overkill), a não ser que os dois lados sejam do mesmo livro (Data lake vs data warehouse
   e Bloqueio otimista e pessimista ficam em Dados).
4. **Integração e Eventos é o transporte e o contrato; a garantia quando algo falha é Sistemas
   Distribuídos.** O filtro do SNS é transporte; o outbox é garantia; a decisão de usar fila ou não é
   Arquitetura de Software.
5. **A AWS é palco, não assunto.** O serviço vai para o livro do que ele faz (SNS → Integração e
   Eventos; KMS → Segurança; RDS → Dados; Bedrock → IA). Conta, rede, custo e provisionamento ficam em
   DevOps.
6. **Fundamentos, Frontend e Testes só recebem o post cujo assunto é o fundamento, a tela ou o teste.**
   O post que os usa de palco (o PID 1 no SIGTERM, o CLOSE_WAIT nas virtual threads) fica no livro do
   que ensina.
7. **Pagamentos fica com o que só existe porque há dinheiro** (ledger, conciliação, cartões, Pix,
   adquirência, regras das bandeiras e do Banco Central). O PCI DSS, que diz como proteger o dado,
   fica em Segurança.
8. **Tag não repete nome de livro** (`.claude/rules/posts.md`): o único caso é a tag Pagamentos
   (seção própria, no fim).

## Os 13 livros

### 01 · Arquitetura de Software

- **Frase:** "As decisões caras de desfazer." (mantida; 30 caracteres, uma linha). É a melhor das
  frases de hoje, e o livro agora é só isso: as decisões, sem a consistência e a mensageria, que
  ganharam livro. Alternativa, se o Cesar quiser trocar: "Escolher sabendo o que cada escolha custa."
  (42, uma linha).
- **Temas:** Trade-offs, Domínios, Padrões, Microsserviços.
- **Subtítulo:** "Trade-offs, domínios, padrões e microsserviços: as decisões caras de desfazer."
- **Abrange:**
  - decisões e trade-offs (overhead e overkill, overengineering)
  - microsserviços ou monólito modular
  - DDD e bounded contexts
  - Clean, Hexagonal e os padrões de arquitetura corporativa (Fowler)
  - atributos de qualidade (custo, latência, disponibilidade)
  - C4, ADRs e docs-as-code
  - estratégia técnica (dívida técnica, Tech Radar)
  - estrutura dos times (Team Topologies, a lei de Conway)
  - o papel do arquiteto
- **Vem de:** Arquitetura de Software de hoje, só com as decisões (o ledger vai para Pagamentos, a
  idempotência e o outbox para Sistemas Distribuídos, o SNS para Integração e Eventos); o papel do
  arquiteto, de Carreira, que sai. Do site de notícias, Design & Padrões (menos a refatoração e os
  padrões GoF, que são de código) e, de Arq. Corporativa, a estrutura organizacional e a estratégia
  técnica.
- **Fronteiras:** os padrões de código (GoF) e a refatoração ficam em Desenvolvimento de Software; a
  governança de API vai com o design de API, em Integração e Eventos; Platform Engineering, DevEx e
  DORA ficam em DevOps (como o time se organiza é daqui; como a plataforma entrega é de lá).
- **Posts (2):** `cronjob-vs-endpoint-sqs` (CronJob ou endpoint + fila), `overhead-vs-overkill`
  (Overhead vs overkill).

### 02 · Dados

- **Frase:** "Onde o dado mora e por onde ele anda." (mantida; 37, uma linha). Diz as duas metades do
  livro, o banco e o pipeline. Alternativa: "Guardar, achar e mover o dado." (30).
- **Temas:** Bancos, Transações, Streaming, Lakehouse.
- **Subtítulo:** "Bancos, transações, streaming e lakehouse: onde o dado mora e por onde ele anda."
- **Abrange:**
  - bancos relacionais (PostgreSQL)
  - bloqueio otimista e pessimista, isolamento e MVCC
  - NoSQL (MongoDB, DynamoDB)
  - modelagem, índices e planos de execução
  - migração de esquema (Flyway, Liquibase)
  - CDC (Debezium)
  - streaming de dados (Kafka Streams, Flink)
  - lake, warehouse e lakehouse (Iceberg, dbt, DuckDB)
  - contratos de dados e Data Mesh
  - busca vetorial (pgvector)
- **Vem de:** Dados de hoje; do site de notícias, Dados & Streaming inteira.
- **Fronteiras:** o Kafka como broker (tópicos, partições, entrega) é de Integração e Eventos; o Kafka
  Streams e o Flink, que processam o dado, são daqui. O CDC como ferramenta de pipeline é daqui; o
  outbox que usa CDC como relay é de Sistemas Distribuídos. O RAG fica em IA; a busca vetorial no
  banco fica aqui. A criptografia do banco em repouso fica em Segurança.
- **Posts (2):** `bloqueio-otimista-e-pessimista` (Bloqueio otimista e pessimista),
  `data-lake-vs-data-warehouse` (Data lake vs data warehouse).

### 03 · Desenvolvimento de Software

- **Frase:** "Entre o seu código e a máquina." (nova; 31, uma linha). O livro é a camada que fica
  entre o que o Cesar escreve e o que roda: os proxies do Spring, os classpaths do Gradle, a leitura que
  o JIT reaproveita, o pinning das virtual threads, o filtro do Jackson. Os seis posts são sobre o que
  essa camada faz com o código. A frase faz par com a de Fundamentos (a máquina em si). O nome do livro
  não diz Java nem Spring (a crítica apontou); o subtítulo diz. Alternativas: "Entre o seu código e a
  JVM." (27; mais literal, mas fecha a porta para Kotlin ou Go) e a frase de hoje, "O ofício dentro de
  cada serviço." (32).
- **Temas:** Java, Spring, JVM, Concorrência.
- **Subtítulo:** "Java, Spring, JVM e concorrência: entre o seu código e a máquina."
- **Abrange:**
  - Java e a JVM (GC, JIT, memória, JFR, thread dump)
  - Spring Boot (autoconfiguração, AOP e proxies, Data JPA, Actuator)
  - concorrência em Java (virtual threads, atomics, executors, o modelo de memória do Java)
  - performance do serviço (profiling, p99)
  - build (Gradle, Maven)
  - serialização (Jackson)
  - padrões de código (GoF) e refatoração
  - outros runtimes e linguagens, quando aparecerem (Kotlin, Go, WebAssembly)
- **Vem de:** Desenvolvimento de Software de hoje, sem três itens que viraram livro: os testes (Testes),
  "o que roda por baixo (TCP, sinais, sistema operacional)" (Fundamentos) e "web e front-end, quando
  aparecer" (Frontend). Do site de notícias, Backend & Runtimes inteira e, de Design & Padrões, a
  refatoração e os padrões GoF.
- **Fronteiras:** o que está em `java.util.concurrent` e na JLS (volatile, happens-before) é daqui; a
  concorrência como conceito do sistema operacional (escalonamento, deadlock) é de Fundamentos; o
  bloqueio no banco é de Dados. O profiling que acha onde o tempo vai é daqui; o teste de carga que
  mede sob pressão é de Testes. O Gradle e o Maven são daqui; o Vite e os bundlers são de Frontend.
- **Posts (6):** `aop-jdk-proxy-cglib` (AOP no Spring), `aoputils-gettargetclass`
  (AopUtils.getTargetClass()), `atomicboolean-parada-graciosa` (AtomicBoolean),
  `gradle-tipos-de-dependencia` (Gradle), `jackson-filtros-mascarando-cartao` (Filtros de
  serialização no Jackson), `virtual-threads-pinning-close-wait` (Virtual threads no Java 21).

### 04 · DevOps

- **Frase:** "O caminho do commit até a produção." (mantida; 35, uma linha). Continua certa com a nuvem
  e a plataforma dentro: é por esse caminho que elas entram. Alternativa: "Onde o serviço roda e como
  chega lá." (36).
- **Temas:** Kubernetes, CI/CD, Nuvem, Plataforma.
- **Subtítulo:** "Kubernetes, CI/CD, nuvem e plataforma: o caminho do commit até a produção."
- **Abrange:**
  - containers e Kubernetes (pods, Jobs e CronJobs, probes, ciclo de vida do pod, HPA)
  - CI/CD (GitHub Actions)
  - GitOps (Argo CD)
  - infraestrutura como código (Terraform)
  - entrega progressiva (canary, feature flags)
  - plataforma interna e Platform Engineering (IDP, Backstage)
  - DevEx e DORA
  - nuvem (AWS: contas e landing zones, rede, computação, Lambda; Azure e GCP quando aparecerem)
  - CDN, edge e proxies (HTTP/3, QUIC, Cloudflare)
  - Well-Architected e FinOps
- **Vem de:** DevOps de hoje; do site de notícias, DevOps & Plataformas (menos o AI-augmented SDLC, que
  é de IA), Cloud (menos o Bedrock, de IA, e menos cada serviço como mecanismo, regra 5) e, de Arq.
  Corporativa, Platform Engineering, DevEx, DORA, FinOps e landing zones.
- **Fronteiras:** o FinOps (a conta da nuvem) é daqui; o custo de observabilidade (a conta dos logs e
  das métricas) é de SRE. O serverless como serviço (Lambda) é daqui; o que acontece entre serviços
  quando a rede falha é de Sistemas Distribuídos. O CDN como infraestrutura é daqui; a renderização no
  edge é de Frontend. O graceful shutdown que o Kubernetes dispara é daqui; o `AtomicBoolean` que o
  recebe é de Desenvolvimento de Software.
- **Posts (2):** `kubernetes-cronjob-concorrencia` (Kubernetes CronJob), `sigterm-sigkill-kubernetes`
  (SIGTERM e SIGKILL).

### 05 · Frontend

- **Frase:** "Do servidor até a tela do usuário." (nova; 34, uma linha). O trajeto é o livro: o que o
  servidor manda (SSR, streaming, edge), o que o navegador monta e quanto demora (Core Web Vitals).
  "Tela" cobre o celular. Alternativa: "O que o usuário vê e com que rapidez." (37).
- **Temas:** Frameworks, SSR, Web Vitals, Acessibilidade.
- **Subtítulo:** "Frameworks, SSR, Web Vitals e acessibilidade: do servidor até a tela do usuário."
- **Abrange:**
  - frameworks (React, Vue, Svelte) e meta-frameworks (Next, Nuxt, Astro)
  - SSR, RSC e streaming
  - a plataforma web (HTML, CSS e as APIs do navegador)
  - design systems
  - Core Web Vitals e performance de página
  - renderização no edge
  - estado no cliente
  - build do front (Vite e bundlers)
  - acessibilidade e i18n
  - mobile multiplataforma
- **Vem de:** Novo. Era "web e front-end, quando aparecer", um item de Desenvolvimento de Software sem
  post. Do site de notícias, Frontend & Web inteira.
- **Fronteiras:** um post sobre a construção do próprio blog (Astro, Pagefind, View Transitions) é
  daqui; se o assunto for fazê-lo com o Claude Code, é de IA. O design de API que o front consome é de
  Integração e Eventos.
- **Posts (0):** nenhum ainda. Começa vazio ("Este livro ainda não tem artigos").

### 06 · Fundamentos

- **Frase:** "O que fica quando a ferramenta muda." (nova; 36, uma linha). O sistema operacional, o
  TCP e a fila não mudam quando o framework muda; é o que o leitor vai achar aqui. Alternativa: "O que
  todo framework esconde." (29).
- **Temas:** Processos, Redes, Memória, Algoritmos.
- **Subtítulo:** "Processos, redes, memória e algoritmos: o que fica quando a ferramenta muda."
- **Abrange:**
  - sistema operacional (processos, threads, sinais, PID 1, memória virtual)
  - redes (TCP e os estados da conexão, DNS, HTTP)
  - concorrência e modelos de memória como conceito (escalonamento, locks, deadlock, visibilidade)
  - estruturas de dados e algoritmos
  - teoria das filas (lei de Little)
  - desempenho do hardware (cache de CPU, memória, disco)
- **Vem de:** Novo. Era "o que roda por baixo (TCP, sinais, sistema operacional)", um item de
  Desenvolvimento de Software. Do site de notícias, Fundamentos de Computação inteira, com uma
  ressalva: a concorrência da JVM (`java.util.concurrent`, o modelo de memória do Java) fica em
  Desenvolvimento de Software.
- **Fronteiras:** o TLS como protocolo de rede está aqui só de passagem; a criptografia em trânsito é
  de Segurança. Os relógios e a ordenação entre máquinas são de Sistemas Distribuídos.
- **Posts (0):** nenhum ainda. Três posts encostam (a visibilidade entre threads do AtomicBoolean, o
  CLOSE_WAIT das virtual threads, o PID 1 do SIGTERM), mas ensinam a ferramenta, e cada um fica no
  livro dela (regras 2 e 6). O primeiro post daqui será um que tenha o fundamento no título: os estados
  do TCP, o happens-before, o que o PID 1 faz com os sinais.

### 07 · IA

- **Frase:** "Software feito com IA e software que usa IA." (mantida; 44, uma linha). É a mais precisa
  das de hoje: diz os dois lados do livro, programar com o modelo e pôr o modelo dentro do sistema.
  Alternativa: "Usar o modelo e construir com ele." (34).
- **Temas:** LLMs, Agentes, RAG, Evals.
- **Subtítulo:** "LLMs, agentes, RAG e evals: software feito com IA e software que usa IA."
- **Abrange:**
  - LLMs e modelos (Claude, GPT, Gemini, abertos)
  - programar com IA (Claude Code, AI coding em produção, o SDLC com IA)
  - agentes e MCP
  - RAG
  - prompts e contexto
  - evals e observabilidade de LLM (Langfuse, LangSmith)
  - guardrails, prompt injection e segurança de IA
  - LLM local (Ollama)
  - Bedrock e fine-tuning
- **Vem de:** IA de hoje; do site de notícias, IA & LLMs e AIOps & Agents inteiras, mais o Bedrock (de
  Cloud), o MCP (de Integração & Eventos), o AI Security (de Segurança & IAM) e o AI-augmented SDLC
  (de DevOps & Plataformas).
- **Fronteiras:** o MCP mora só aqui (a crítica pediu; é o protocolo dos agentes, não uma integração
  entre sistemas). A observabilidade de LLM é daqui, não de SRE. O RAG é daqui; o pgvector é de Dados.
  Os testes com IA são de Testes. Como o blog é feito com o Claude Code, o post que contar isso é daqui.
- **Posts (0):** nenhum ainda; está na frase do blog.

### 08 · Integração e Eventos

- **Frase:** "Como um sistema fala com o outro." (nova; 33, uma linha). Cobre os dois lados do livro, a
  API síncrona e o evento assíncrono, com a palavra mais simples. Alternativa: "O contrato entre quem
  envia e quem recebe." (42).
- **Temas:** Mensageria, APIs, Pub/sub, Contratos.
- **Subtítulo:** "Mensageria, APIs, pub/sub e contratos: como um sistema fala com o outro."
- **Abrange:**
  - mensageria (SQS, SNS, Kafka, RabbitMQ)
  - pub/sub e filtros de mensagem
  - arquitetura orientada a eventos
  - webhooks
  - DLQ e redrive
  - entrega pelo menos uma vez, ordem e partições
  - design de API e API-First (REST, OpenAPI, GraphQL e federation, gRPC)
  - versionamento e governança de API
  - contratos e evolução de esquema (AsyncAPI, Schema Registry)
- **Vem de:** Novo. A mensageria de Arquitetura de Software (o SNS Filter Policy e o tema "eventos" do
  subtítulo de hoje); do site de notícias, Integração & Eventos (menos o MCP, que é de IA) e a
  governança de API de Arq. Corporativa.
- **Fronteiras:** regra 4. "Entrega pelo menos uma vez" é a garantia do transporte e fica aqui; o que o
  consumidor faz com a mensagem repetida (idempotência) é de Sistemas Distribuídos. O `traceparent`
  dentro da mensagem é de SRE. A autenticação da API (JWT, OAuth) é de Segurança.
- **Posts (1):** `sns-filter-policy` (SNS MessageAttributes e Filter Policy).

### 09 · Pagamentos

- **Frase:** "Dinheiro não pode sumir nem duplicar." (nova; 37, uma linha). As duas falhas que os
  posts de cobrança perseguem: o saldo que não bate e a cobrança em dobro. "Duplicar", e não "dobrar",
  como a crítica pediu: os posts falam em "cobrança duplicada". Alternativa: "Cada centavo com origem e
  destino." (34, a partida dobrada).
- **Temas:** Ledger, Conciliação, Cartões, Pix.
- **Subtítulo:** "Ledger, conciliação, cartões e Pix: dinheiro não pode sumir nem duplicar."
- **Abrange:**
  - ledger e partidas dobradas
  - saldo e conciliação
  - cartões e bandeiras (Visa, Mastercard, Elo)
  - adquirência (autorização, captura, estorno, chargeback)
  - Pix, Open Finance e Drex
  - cooperativas de crédito (Unicred, Sicoob, Sicredi)
  - trilhos de pagamento (payment rails)
  - fraude e risco
  - regras das bandeiras e do Banco Central
  - BaaS e embedded finance
- **Vem de:** Novo. O ledger de Arquitetura de Software; do site de notícias, Fintech & Pagamentos
  (menos o PCI DSS, que é de Segurança).
- **Fronteiras:** regra 7. A cobrança como exemplo de idempotência e de outbox fica em Sistemas
  Distribuídos, com a tag; o número do cartão mascarado no log é o Jackson, em Desenvolvimento de
  Software. É livro, não série: vai receber posts soltos (Pix, cartões, conciliação), sem ordem de
  leitura.
- **Posts (1):** `arquitetura-de-ledger` (Arquitetura de ledger).

### 10 · Segurança

- **Frase:** "Quem pode o quê e como provar." (mantida; 30, uma linha). Autorização e autenticação
  numa frase. Alternativa: "Proteger o dado e provar quem é quem." (37).
- **Temas:** Identidade, Segredos, Criptografia, Conformidade ("conformidade" no lugar de
  "compliance", em pt-BR, e igual ao item da lista).
- **Subtítulo:** "Identidade, segredos, criptografia e conformidade: quem pode o quê e como provar."
- **Abrange:**
  - identidade e acesso (OAuth 2.0, OIDC, JWT, passkeys e WebAuthn)
  - Zero Trust
  - criptografia em repouso e em trânsito (TLS, KMS)
  - segredos (Vault, AWS Secrets Manager)
  - OWASP e CVEs
  - cadeia de suprimentos (SBOM, SLSA, Sigstore)
  - runtime security
  - conformidade (PCI DSS, LGPD)
- **Vem de:** Segurança de hoje; do site de notícias, Segurança & IAM (menos o AI Security, que é de
  IA) e o PCI DSS de Fintech & Pagamentos.
- **Fronteiras:** o PCI DSS mora só aqui (a crítica pediu): ele diz como proteger o dado do cartão, e
  os posts que o citam estão em Segurança e em Desenvolvimento de Software, não em Pagamentos. O
  mecanismo do Jackson que mascara o cartão fica com a ferramenta (regra 2); o que mascarar, e por
  quê, é daqui.
- **Posts (2):** `criptografia-em-repouso-e-em-transito` (Criptografia em repouso e em trânsito),
  `jwt-estrutura-e-campos` (JWT).

### 11 · Sistemas Distribuídos

- **Frase:** "Quando o timeout não diz o que aconteceu." (nova; 41, uma linha). É a primeira marcação
  da caneta no post Chave de idempotência ("Um timeout não diz se a operação aconteceu."), que agora
  está neste livro; a crítica a aprovou. Alternativa: "Correto mesmo quando a rede falha." (34).
- **Temas:** Idempotência, Outbox, Saga, Consistência.
- **Subtítulo:** "Idempotência, outbox, saga e consistência: quando o timeout não diz o que aconteceu."
- **Abrange:**
  - idempotência e retry
  - escrita dupla, outbox e inbox
  - saga e compensação
  - CQRS e event sourcing
  - modelos de consistência
  - resiliência (timeout, circuit breaker, bulkhead, backpressure)
  - cache distribuído
  - service mesh
  - execução durável (Temporal)
  - multi-região
- **Vem de:** Novo. A consistência de Arquitetura de Software (Chave de idempotência e Efeito externo
  sem registro local, que hoje estão lá); do site de notícias, Sist. Distribuídos, menos três itens
  que foram para onde moram: "microsserviços" como decisão (Arquitetura de Software), post-mortems
  (SRE) e serverless (DevOps).
- **Fronteiras:** regra 4 com Integração e Eventos; regra 1 com Pagamentos (os dois posts dizem que a
  técnica vale para webhooks, APIs públicas e comandos de fila: a cobrança é o exemplo). O bulkhead e o
  circuit breaker que aparecem no post das virtual threads são de passagem; o post fica em
  Desenvolvimento de Software.
- **Posts (2):** `cobranca-duplicada-no-retry` (Chave de idempotência),
  `efeito-externo-sem-registro-local` (Efeito externo sem registro local).

### 12 · SRE

- **Frase:** "O que mantém a produção de pé." (mantida; 30, uma linha). Com o nome SRE mantido, a
  frase de hoje é a certa: cobre os SLOs, os alertas e os incidentes, não só os logs (a crítica
  apontou que "Descobrir o que aconteceu em produção." cobre só metade). O subtítulo põe a palavra
  que o leitor digita, "observabilidade". Alternativa: "Descobrir o que aconteceu em produção." (38).
- **Temas:** Observabilidade, Logs, SLOs, Incidentes.
- **Subtítulo:** "Observabilidade, logs, SLOs e incidentes: o que mantém a produção de pé."
- **Abrange:**
  - logs estruturados
  - tracing (OpenTelemetry, W3C Trace Context)
  - métricas e APM (Micrometer, Prometheus)
  - wide events e cardinalidade
  - SLOs, SLIs e error budgets
  - alertas e ruído
  - incidentes, on-call e post-mortems
  - profiling contínuo e eBPF
  - custo de observabilidade
- **Vem de:** SRE de hoje; do site de notícias, Observabilidade & SRE inteira e os post-mortems de
  Sist. Distribuídos. O chaos engineering, que as sugestões anteriores punham aqui, vai para Testes
  (é de onde ele vem no site de notícias, e Testes precisa dele mais do que SRE).
- **Fronteiras:** o logging em Spring Boot e o filtro de wide events são daqui, não de Desenvolvimento
  de Software: o assunto é a produção (regra 2). O JFR como ferramenta de diagnóstico da JVM é de
  Desenvolvimento de Software; o profiling contínuo em produção é daqui. A observabilidade de LLM é de
  IA.
- **Posts (3):** `logging-estruturado-spring-boot` (Logging estruturado em Spring Boot),
  `w3c-trace-context` (W3C Trace Context), `wide-events-canonical-log-lines` (Wide events e canonical
  log lines).

### 13 · Testes

- **Frase:** "Antes que a produção descubra." (nova; 30, uma linha). É para isso que o teste existe,
  e é do jeito que o Cesar fala ("a cobrança passou e o banco não gravou"). Alternativa, mais literal:
  "A prova de que o código faz o que deve." (39; repete o "provar" de Segurança).
- **Temas:** TDD, Pirâmide, Testcontainers, Carga.
- **Subtítulo:** "TDD, pirâmide, Testcontainers e carga: antes que a produção descubra."
- **Abrange:**
  - TDD e BDD
  - pirâmide de testes (unitário, integração, ponta a ponta)
  - JUnit e Testcontainers
  - testes de slice do Spring (@WebMvcTest, @DataJpaTest)
  - contract testing (Pact)
  - testes de carga e de performance (k6, Gatling)
  - chaos engineering
  - dados de teste e massa
  - testes com IA
- **Vem de:** Novo. Os testes de Desenvolvimento de Software (o item "testes (JUnit, Testcontainers,
  contract testing)" e o tema "testes" do subtítulo de hoje); do site de notícias, Testes & Qualidade
  inteira, inclusive o chaos engineering e os testes com IA.
- **Fronteiras:** o contract testing (Pact) é daqui; o contrato em si (OpenAPI, AsyncAPI) é de
  Integração e Eventos. O teste de carga é daqui; o profiling é de Desenvolvimento de Software.
- **Posts (0):** nenhum ainda. O teste é o método do blog (código e SQL testados antes de publicar),
  ainda não é assunto.

## Para onde foi cada categoria do site de notícias

| Categoria do site de notícias | Livro | O que foi para outro livro |
|---|---|---|
| AIOps & Agents | IA | — |
| Arq. Corporativa | Arquitetura de Software (estrutura dos times, estratégia técnica) | Platform Engineering, DevEx, DORA, SPACE, FinOps e landing zones → DevOps; governança de API → Integração e Eventos; **Green IT fica de fora** |
| Backend & Runtimes | Desenvolvimento de Software | — |
| Cloud | DevOps (contas, rede, computação, CDN e edge, Well-Architected, FinOps) | Bedrock → IA; cada serviço como mecanismo vai para o livro do assunto (SNS e SQS → Integração e Eventos; KMS → Segurança; RDS → Dados) |
| Dados & Streaming | Dados | — |
| Design & Padrões | Arquitetura de Software | refatoração e padrões GoF → Desenvolvimento de Software |
| DevOps & Plataformas | DevOps | AI-augmented SDLC → IA |
| Fintech & Pagamentos | Pagamentos | PCI DSS → Segurança |
| Frontend & Web | Frontend | — |
| Fundamentos de Computação | Fundamentos | a concorrência da JVM → Desenvolvimento de Software |
| IA & LLMs | IA | — |
| Integração & Eventos | Integração e Eventos | MCP → IA |
| Observabilidade & SRE | SRE | — |
| Segurança & IAM | Segurança | AI Security → IA |
| Sist. Distribuídos | Sistemas Distribuídos | microsserviços como decisão → Arquitetura de Software; post-mortems → SRE; serverless → DevOps |
| Testes & Qualidade | Testes (inteira, com o chaos engineering, que as sugestões anteriores punham em SRE) | — |

Fica de fora, de propósito: **Green IT** (de Arq. Corporativa) e, de Carreira, **o estudo e o caderno**
(a liderança técnica, a comunicação técnica): se vier um texto assim, não tem livro, e a regra dos
posts (D61, item 7) manda avisar o Cesar.

## Os posts: o que muda e os de fronteira

**Quatro posts trocam de livro**, todos saindo de Arquitetura de Software: Chave de idempotência e
Efeito externo sem registro local → Sistemas Distribuídos; SNS MessageAttributes e Filter Policy →
Integração e Eventos; Arquitetura de ledger → Pagamentos. Os outros 17 ficam onde estão (os nomes dos
livros de hoje não mudam). **Quatro livros começam vazios:** Frontend, Fundamentos, IA e Testes.

Distribuição: Arquitetura de Software 2, Dados 2, Desenvolvimento de Software 6, DevOps 2, Frontend 0,
Fundamentos 0, IA 0, Integração e Eventos 1, Pagamentos 1, Segurança 2, Sistemas Distribuídos 2, SRE 3,
Testes 0. Total: 21.

Os posts que tinham dois livros plausíveis, e a regra que decidiu:

| Post | Livro | Por quê |
|---|---|---|
| CronJob ou endpoint + fila | Arquitetura de Software | compara dois desenhos (regra 3); o Kubernetes e a fila ficam nas tags |
| Overhead vs overkill | Arquitetura de Software | é critério de decisão; não cabe em nenhuma das 16 do site de notícias |
| Chave de idempotência | Sistemas Distribuídos | ensina idempotência; "a mesma técnica vale para webhooks, APIs públicas e comandos de fila" (regra 1) |
| Efeito externo sem registro local | Sistemas Distribuídos | ensina escrita dupla e outbox; "banco mais fila, banco mais cache, banco mais índice" (regra 1) |
| Arquitetura de ledger | Pagamentos | só existe porque há dinheiro (regra 7) |
| SNS Filter Policy | Integração e Eventos | é transporte (regra 4); a AWS é palco (regra 5) |
| AtomicBoolean | Desenvolvimento de Software | ferramenta no título (regra 2); o SIGTERM é o cenário e o happens-before é da JLS |
| SIGTERM e SIGKILL | DevOps | o assunto é o que o Kubernetes faz com o pod; o PID 1 é fundamento de passagem (regra 6) |
| Virtual threads | Desenvolvimento de Software | ferramenta no título; o CLOSE_WAIT é o rastro, o bulkhead é de passagem |
| Filtros no Jackson | Desenvolvimento de Software | ferramenta no título (regra 2); o cartão é o cenário e vira tag |
| Bloqueio otimista e pessimista | Dados | os dois lados são do banco (regra 3; como na D30) |
| Logging estruturado em Spring Boot | SRE | o assunto é a produção, não o framework (regra 2) |
| W3C Trace Context | SRE | o `traceparent` na mensagem é cenário; a tag Mensageria fica |
| Criptografia em repouso e em trânsito | Segurança | o RDS, o Atlas e o KMS são palco (regra 5) |

Fundamentos começa vazio de propósito. A alternativa da crítica (mover AtomicBoolean e SIGTERM para lá)
quebraria a regra 2 em dois posts que têm a ferramenta no título, e o leitor que abre "AtomicBoolean"
procura Java, não sistema operacional.

## A tag Pagamentos

A tag Pagamentos (ícone: pilha de moedas) está em quatro posts: `arquitetura-de-ledger` [Pagamentos,
Banco de Dados, Idempotência], `cobranca-duplicada-no-retry` [Pagamentos, Idempotência, Banco de
Dados], `efeito-externo-sem-registro-local` [Pagamentos, Mensageria, Banco de Dados] e
`jackson-filtros-mascarando-cartao` [Spring, Logs, Pagamentos]. Com o livro Pagamentos, ela passa a
repetir o nome de uma categoria, o que `.claude/rules/posts.md` proíbe. O ledger vai para o livro e
perde a tag de qualquer jeito (fica com Banco de Dados e Idempotência, duas, o mínimo). Sobram três
posts em outros livros, em que o pagamento é o cenário. As opções, com a recomendação na primeira:

1. **Renomear para "Cobrança"** (recomendado). É a palavra dos dois posts que mais usam a tag ("cobrança
   duplicada", "a cobrança passou e o banco não gravou"; 30 e 22 menções) e o que o leitor lembra
   deles. A tag passa a dizer o que é: o post usa uma cobrança como exemplo, mas ensina outra coisa. O
   ícone de hoje (a pilha de moedas) continua servindo: só o arquivo muda de nome
   (`src/livros/tags/pagamentos.svg` → `cobranca.svg`). No Jackson a tag fica frouxa (o post fala em
   "cartão" 12 vezes e em "cobrança" uma; o cenário é o log de um sistema de cartões), mas é o mesmo
   cenário de pagamento, e tirar a tag dele deixaria o post com duas (Spring e Logs), o que é
   permitido.
2. **Renomear para "Cartões".** Encaixa melhor no Jackson e vale nos outros dois (a captura é no
   adquirente de cartão). Mas "cartões" é também um assunto do livro Pagamentos (bandeiras,
   adquirência), e a tag ficaria dentro e fora do livro ao mesmo tempo; e a pilha de moedas não
   desenha cartão: pede ícone novo.
3. **Remover.** A regra fica limpa sem exceção, mas o blog perde o único índice que junta os três
   posts de cobrança espalhados por dois livros (eles se ligam por links, mas o leitor que chega pela
   página do livro Pagamentos vê só o ledger). Não recomendo.
4. **Abrir exceção na regra** ("a tag é o cenário, o livro é o assunto"), mantendo a tag nos quatro.
   `/tags/Pagamentos/` (4) e `/categories/Pagamentos/` (1) passariam a ter o mesmo nome com contagens
   diferentes, o que confunde quem chega pela busca. Não recomendo.

O que renomear custa, em qualquer das duas primeiras: o `tags` de três posts; o arquivo do ícone; e
**`/tags/Pagamentos/` é URL viva** (`CLAUDE.md`, "URLs que não podem quebrar"), e o `astro.config.mjs`
só redireciona categorias (`NOMES_ANTIGOS`): precisa de uma entrada nova, `/tags/Pagamentos` →
`/tags/Cobrança/` (ou para o livro, `/categories/Pagamentos/`, se o Cesar preferir que "pagamentos"
leve ao livro). A decisão é do Cesar.

## Tabela para revisão rápida

| Vol. | Livro | Frase | Temas | Posts |
|---|---|---|---|---|
| 01 | Arquitetura de Software | As decisões caras de desfazer. (mantida) | Trade-offs, domínios, padrões e microsserviços | 2 |
| 02 | Dados | Onde o dado mora e por onde ele anda. (mantida) | Bancos, transações, streaming e lakehouse | 2 |
| 03 | Desenvolvimento de Software | Entre o seu código e a máquina. | Java, Spring, JVM e concorrência | 6 |
| 04 | DevOps | O caminho do commit até a produção. (mantida) | Kubernetes, CI/CD, nuvem e plataforma | 2 |
| 05 | Frontend | Do servidor até a tela do usuário. | Frameworks, SSR, Web Vitals e acessibilidade | 0 |
| 06 | Fundamentos | O que fica quando a ferramenta muda. | Processos, redes, memória e algoritmos | 0 |
| 07 | IA | Software feito com IA e software que usa IA. (mantida) | LLMs, agentes, RAG e evals | 0 |
| 08 | Integração e Eventos | Como um sistema fala com o outro. | Mensageria, APIs, pub/sub e contratos | 1 |
| 09 | Pagamentos | Dinheiro não pode sumir nem duplicar. | Ledger, conciliação, cartões e Pix | 1 |
| 10 | Segurança | Quem pode o quê e como provar. (mantida) | Identidade, segredos, criptografia e conformidade | 2 |
| 11 | Sistemas Distribuídos | Quando o timeout não diz o que aconteceu. | Idempotência, outbox, saga e consistência | 2 |
| 12 | SRE | O que mantém a produção de pé. (mantida) | Observabilidade, logs, SLOs e incidentes | 3 |
| 13 | Testes | Antes que a produção descubra. | TDD, pirâmide, Testcontainers e carga | 0 |

Seis frases de hoje ficam (Arquitetura de Software, Dados, DevOps, IA, Segurança e SRE), porque
nenhuma alternativa disse melhor o que o livro tem; cada uma tem uma alternativa medida no bloco do
livro, caso o Cesar queira trocar. Desenvolvimento de Software é o único livro de
hoje com frase nova, porque o conteúdo dele mudou (saíram os testes, os fundamentos e o front). Na
estante, três frases falam em "produção" (DevOps leva até ela, SRE a mantém de pé, Testes chega antes
dela): é a sequência de uma entrega, lida da esquerda para a direita, e não uma repetição a corrigir.
