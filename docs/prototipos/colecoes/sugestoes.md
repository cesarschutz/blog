# As cinco sugestões de coleção

Gerado de `colecoes.json` por `gerar-sugestoes.mjs`; não edite à mão. As capas e a estante de cada
sugestão estão na página `/amostra/colecoes/` (só no dev).

## Sugestão 1 · Oito livros, um trocado (8 livros)

A estante de hoje, com os mesmos nomes, e uma troca só: entra Pagamentos, o assunto que mais identifica o Cesar e que hoje some dentro de Arquitetura de Software; sai Carreira, que não tem post nem par no site de notícias. As 16 categorias entram como itens do que cada livro abrange.

### 01 · Arquitetura de Software

*As decisões caras de desfazer.*

- **Abrange:** Decisões e trade-offs (ADRs, dívida técnica, overengineering), DDD e bounded contexts, Clean e Hexagonal, padrões (GoF, enterprise), C4 e docs-as-code, microsserviços ou monólito modular, consistência e resiliência (idempotência, outbox, saga, CQRS, circuit breaker), mensageria e eventos (SQS, SNS, Kafka, AsyncAPI), design de API (REST, OpenAPI, GraphQL), o papel do arquiteto e os times (Team Topologies).
- **Vem de:** Arquitetura de Software de hoje, sem os posts de cobrança, e o papel do arquiteto de Carreira; do site de notícias, Sist. Distribuídos, Design & Padrões, Integração & Eventos e Arq. Corporativa.
- **Posts (3):** CronJob ou endpoint + fila; Overhead vs overkill; SNS MessageAttributes e Filter Policy.
- **Cor:** verde-pátina (`#2d4b46`). A pátina que o cobre e o bronze ganham com o tempo nos prédios: a cor do que foi feito para durar.
- **Desenho:** arco e pedra angular. A pedra angular é a peça que segura o arco e não se tira depois: a decisão cara de desfazer.

### 02 · Desenvolvimento de Software

*O ofício dentro de cada serviço.*

- **Abrange:** Java, Spring e JVM, concorrência (threads, virtual threads, modelo de memória), performance (profiling, GC, JFR, p99), build (Gradle, Maven), serialização (Jackson), testes (JUnit, Testcontainers, contract testing), refatoração e padrões de código, o que roda por baixo (TCP, sinais, sistema operacional), web e front-end, quando aparecer.
- **Vem de:** Desenvolvimento de Software de hoje; do site de notícias, Backend & Runtimes, Testes & Qualidade, Fundamentos de Computação e Frontend & Web.
- **Posts (6):** AOP no Spring; AopUtils.getTargetClass(); AtomicBoolean; Gradle; Filtros de serialização no Jackson; Virtual threads no Java 21.
- **Cor:** tijolo (`#7a4430`). O vermelho do óxido de ferro (a argila queimada) e do zarcão, a primeira demão de toda peça de ferro da oficina.
- **Desenho:** paquímetro medindo uma peça. O instrumento de medir com precisão a peça que se fez: o ofício dentro de cada serviço.

### 03 · Dados

*Onde o dado mora e por onde ele anda.*

- **Abrange:** Bancos relacionais (PostgreSQL), travas e isolamento (lock otimista e pessimista, MVCC), NoSQL (MongoDB, DynamoDB), modelagem e índices, migração de esquema (Flyway, Liquibase), CDC (Debezium), streaming (Kafka Streams, Flink), lake, warehouse e lakehouse (Iceberg, dbt, DuckDB), contratos de dados e Data Mesh, busca vetorial (pgvector).
- **Vem de:** Dados de hoje; do site de notícias, Dados & Streaming.
- **Posts (2):** Bloqueio otimista e pessimista; Data lake vs data warehouse.
- **Cor:** ameixa (`#5f4662`). O roxo das cópias do mimeógrafo a álcool, que copiou fichas, listas e registros por décadas.
- **Desenho:** gaveta de fichas. A ficha é o registro e a gaveta é o índice; a ficha que volta é o dado que anda.

### 04 · Pagamentos

*Dinheiro não pode sumir nem dobrar.*

- **Abrange:** Ledger e partidas dobradas, saldo e conciliação, idempotência e retry na cobrança, efeito externo e outbox na cobrança, cartões e bandeiras (Visa, Mastercard, Elo), adquirência (autorização, captura, estorno, chargeback), Pix, Open Finance e Drex, cooperativas de crédito (Unicred, Sicoob, Sicredi), PCI DSS, fraude e risco.
- **Vem de:** Novo. Os três posts de cobrança de Arquitetura de Software; do site de notícias, Fintech & Pagamentos.
- **Posts (3):** Arquitetura de ledger; Chave de idempotência; Efeito externo sem registro local.
- **Cor:** verde-cédula (`#467866`). O verso verde das cédulas americanas desde 1861 e o verde do papel de razão dos contadores (um tom mais fundo, para a tinta clara ter mais contraste).
- **Desenho:** caixa registradora mecânica. Inventada em 1879 contra a fraude: registra cada venda, guarda o dinheiro e fecha o caixa no fim do dia, que é conciliação.

### 05 · IA

*Software feito com IA e software que usa IA.*

- **Abrange:** LLMs e modelos (Claude, GPT, Gemini, abertos), programar com IA (Claude Code, AI coding em produção), agentes e MCP, RAG e bancos vetoriais, prompts e contexto, evals e observabilidade de LLM (Langfuse, LangSmith), guardrails e prompt injection, LLM local (Ollama), fine-tuning e multimodal.
- **Vem de:** IA de hoje; do site de notícias, IA & LLMs e AIOps & Agents.
- **Posts (0):** nenhum ainda.
- **Cor:** vinho (`#6e2f45`). O vermelho do marroquim das encadernações finas; não há convenção que ligue a cor ao assunto.
- **Desenho:** autômato escritor. O Escritor de Jaquet-Droz (1774) é uma máquina que escreve e se programa: um LLM do século XVIII.

### 06 · Segurança

*Quem pode o quê e como provar.*

- **Abrange:** Identidade e acesso (OAuth 2.0, OIDC, JWT, passkeys e WebAuthn), Zero Trust, criptografia em repouso e em trânsito (TLS, KMS), segredos (Vault, AWS Secrets Manager), OWASP e CVEs, cadeia de suprimentos (SBOM, SLSA, Sigstore), runtime security, segurança de IA, LGPD e privacidade.
- **Vem de:** Segurança de hoje; do site de notícias, Segurança & IAM.
- **Posts (2):** Criptografia em repouso e em trânsito; JWT.
- **Cor:** oliva (`#606a37`). O verde-oliva das fardas (no Brasil desde 1931): a cor de quem guarda.
- **Desenho:** carta lacrada e sinete. O sinete prova quem mandou e o lacre prova que ninguém abriu: identidade e prova.

### 07 · DevOps

*O caminho do commit até a produção.*

- **Abrange:** Containers e Kubernetes (Jobs, CronJobs, ciclo de vida do pod), CI/CD (GitHub Actions), GitOps (Argo CD), infraestrutura como código (Terraform), entrega progressiva (canary, feature flags), plataforma interna (IDP, Backstage), nuvem AWS (EKS, rede, contas), edge e proxies (HTTP/3), FinOps.
- **Vem de:** DevOps de hoje; do site de notícias, DevOps & Plataformas e Cloud.
- **Posts (2):** Kubernetes CronJob; SIGTERM e SIGKILL.
- **Cor:** azul-ardósia (`#465976`). O azul das camisas de trabalho que deu nome ao colarinho azul: a cor da operação, do cais.
- **Desenho:** guindaste de porto. O guindaste do porto empilha contêineres, do navio até o pátio.

### 08 · SRE

*O que mantém a produção de pé.*

- **Abrange:** Logs estruturados, tracing (OpenTelemetry, W3C Trace Context), métricas e APM, wide events e cardinalidade, SLOs, SLIs e error budgets, alertas e ruído, incidentes e post-mortems, profiling contínuo e eBPF, chaos engineering, custo de observabilidade.
- **Vem de:** SRE de hoje; do site de notícias, Observabilidade & SRE.
- **Posts (3):** Logging estruturado em Spring Boot; W3C Trace Context; Wide events e canonical log lines.
- **Cor:** ocre (`#c4a050`). O ocre, dos pigmentos mais antigos, e o amarelo da cautela na sinalização.
- **Desenho:** farol. O farol fica aceso o tempo todo e avisa antes de o navio bater.

**O que muda:** Entra um livro novo (Pagamentos, com desenho e cor novos) e sai Carreira, que não tem posts (o endereço /categories/Carreira/ passa a levar para Arquitetura de Software). Três posts trocam de livro: o ledger, a chave de idempotência e o efeito externo vão de Arquitetura de Software para Pagamentos. Nenhum livro muda de nome.

Os 21 posts de categoria ficam distribuídos assim: Arquitetura de Software 3, Desenvolvimento de Software 6, Dados 2, Pagamentos 3, IA 0, Segurança 2, DevOps 2, SRE 3.

## Sugestão 2 · O que os posts pedem (9 livros)

Um livro para cada assunto que já é o tema principal de algum post, mais IA, que está na frase do blog. Além de Pagamentos, ganha livro a integração por mensagens, que passa por quatro posts sem ter casa. Sai Carreira.

### 01 · Arquitetura de Software

*As decisões caras de desfazer.*

- **Abrange:** Decisões e trade-offs (ADRs, dívida técnica, overengineering), DDD e bounded contexts, Clean e Hexagonal, padrões (GoF, enterprise), C4 e docs-as-code, microsserviços ou monólito modular, consistência entre serviços (idempotência, outbox, saga, CQRS), resiliência (timeout, retry, circuit breaker), o papel do arquiteto e os times (Team Topologies), Tech Radar.
- **Vem de:** Arquitetura de Software de hoje, sem a mensageria e os posts de cobrança, e o papel do arquiteto de Carreira; do site de notícias, Sist. Distribuídos, Design & Padrões e Arq. Corporativa.
- **Posts (2):** CronJob ou endpoint + fila; Overhead vs overkill.
- **Cor:** verde-pátina (`#2d4b46`). A pátina que o cobre e o bronze ganham com o tempo nos prédios: a cor do que foi feito para durar.
- **Desenho:** arco e pedra angular. A pedra angular é a peça que segura o arco e não se tira depois: a decisão cara de desfazer.

### 02 · Integração e Eventos

*Como um sistema fala com o outro.*

- **Abrange:** Mensageria (SQS, SNS, Kafka, RabbitMQ), pub/sub e filtros de mensagem, arquitetura orientada a eventos, webhooks, DLQ e redrive, ordem e entrega pelo menos uma vez, design de API e API-First (REST, OpenAPI, GraphQL, gRPC), contratos e evolução de esquema (AsyncAPI, Schema Registry), MCP como integração.
- **Vem de:** Novo. A mensageria de Arquitetura de Software; do site de notícias, Integração & Eventos.
- **Posts (1):** SNS MessageAttributes e Filter Policy.
- **Cor:** verde-água de isolador (`#72aba5`). O vidro dos isoladores das linhas de telégrafo e de telefone saía verde-água, pelo ferro da areia.
- **Desenho:** mesa telefônica manual, com jaques e cordões. A telefonista liga quem chama a quem atende: o roteamento e o contrato entre quem envia e quem recebe.

### 03 · Desenvolvimento de Software

*O ofício dentro de cada serviço.*

- **Abrange:** Java, Spring e JVM, concorrência (threads, virtual threads, modelo de memória), performance (profiling, GC, JFR, p99), build (Gradle, Maven), serialização (Jackson), testes (JUnit, Testcontainers, contract testing), refatoração e padrões de código, o que roda por baixo (TCP, sinais, sistema operacional), web e front-end, quando aparecer.
- **Vem de:** Desenvolvimento de Software de hoje; do site de notícias, Backend & Runtimes, Testes & Qualidade e Fundamentos de Computação.
- **Posts (6):** AOP no Spring; AopUtils.getTargetClass(); AtomicBoolean; Gradle; Filtros de serialização no Jackson; Virtual threads no Java 21.
- **Cor:** tijolo (`#7a4430`). O vermelho do óxido de ferro (a argila queimada) e do zarcão, a primeira demão de toda peça de ferro da oficina.
- **Desenho:** paquímetro medindo uma peça. O instrumento de medir com precisão a peça que se fez: o ofício dentro de cada serviço.

### 04 · Dados

*Onde o dado mora e por onde ele anda.*

- **Abrange:** Bancos relacionais (PostgreSQL), travas e isolamento (lock otimista e pessimista, MVCC), NoSQL (MongoDB, DynamoDB), modelagem e índices, migração de esquema (Flyway, Liquibase), CDC (Debezium), streaming (Kafka Streams, Flink), lake, warehouse e lakehouse (Iceberg, dbt, DuckDB), contratos de dados e Data Mesh, busca vetorial (pgvector).
- **Vem de:** Dados de hoje; do site de notícias, Dados & Streaming.
- **Posts (2):** Bloqueio otimista e pessimista; Data lake vs data warehouse.
- **Cor:** ameixa (`#5f4662`). O roxo das cópias do mimeógrafo a álcool, que copiou fichas, listas e registros por décadas.
- **Desenho:** gaveta de fichas. A ficha é o registro e a gaveta é o índice; a ficha que volta é o dado que anda.

### 05 · Pagamentos

*Dinheiro não pode sumir nem dobrar.*

- **Abrange:** Ledger e partidas dobradas, saldo e conciliação, idempotência e retry na cobrança, efeito externo e outbox na cobrança, cartões e bandeiras (Visa, Mastercard, Elo), adquirência (autorização, captura, estorno, chargeback), Pix, Open Finance e Drex, cooperativas de crédito (Unicred, Sicoob, Sicredi), PCI DSS, fraude e risco.
- **Vem de:** Novo. Os três posts de cobrança de Arquitetura de Software; do site de notícias, Fintech & Pagamentos.
- **Posts (3):** Arquitetura de ledger; Chave de idempotência; Efeito externo sem registro local.
- **Cor:** verde-cédula (`#467866`). O verso verde das cédulas americanas desde 1861 e o verde do papel de razão dos contadores (um tom mais fundo, para a tinta clara ter mais contraste).
- **Desenho:** caixa registradora mecânica. Inventada em 1879 contra a fraude: registra cada venda, guarda o dinheiro e fecha o caixa no fim do dia, que é conciliação.

### 06 · IA

*Software feito com IA e software que usa IA.*

- **Abrange:** LLMs e modelos (Claude, GPT, Gemini, abertos), programar com IA (Claude Code, AI coding em produção), agentes e MCP, RAG e bancos vetoriais, prompts e contexto, evals e observabilidade de LLM (Langfuse, LangSmith), guardrails e prompt injection, LLM local (Ollama), fine-tuning e multimodal.
- **Vem de:** IA de hoje; do site de notícias, IA & LLMs e AIOps & Agents.
- **Posts (0):** nenhum ainda.
- **Cor:** vinho (`#6e2f45`). O vermelho do marroquim das encadernações finas; não há convenção que ligue a cor ao assunto.
- **Desenho:** autômato escritor. O Escritor de Jaquet-Droz (1774) é uma máquina que escreve e se programa: um LLM do século XVIII.

### 07 · Segurança

*Quem pode o quê e como provar.*

- **Abrange:** Identidade e acesso (OAuth 2.0, OIDC, JWT, passkeys e WebAuthn), Zero Trust, criptografia em repouso e em trânsito (TLS, KMS), segredos (Vault, AWS Secrets Manager), OWASP e CVEs, cadeia de suprimentos (SBOM, SLSA, Sigstore), runtime security, segurança de IA, LGPD e privacidade.
- **Vem de:** Segurança de hoje; do site de notícias, Segurança & IAM.
- **Posts (2):** Criptografia em repouso e em trânsito; JWT.
- **Cor:** oliva (`#606a37`). O verde-oliva das fardas (no Brasil desde 1931): a cor de quem guarda.
- **Desenho:** carta lacrada e sinete. O sinete prova quem mandou e o lacre prova que ninguém abriu: identidade e prova.

### 08 · DevOps

*O caminho do commit até a produção.*

- **Abrange:** Containers e Kubernetes (Jobs, CronJobs, ciclo de vida do pod), CI/CD (GitHub Actions), GitOps (Argo CD), infraestrutura como código (Terraform), entrega progressiva (canary, feature flags), plataforma interna (IDP, Backstage), nuvem AWS (EKS, rede, contas), edge e proxies (HTTP/3), FinOps.
- **Vem de:** DevOps de hoje; do site de notícias, DevOps & Plataformas e Cloud.
- **Posts (2):** Kubernetes CronJob; SIGTERM e SIGKILL.
- **Cor:** azul-ardósia (`#465976`). O azul das camisas de trabalho que deu nome ao colarinho azul: a cor da operação, do cais.
- **Desenho:** guindaste de porto. O guindaste do porto empilha contêineres, do navio até o pátio.

### 09 · SRE

*O que mantém a produção de pé.*

- **Abrange:** Logs estruturados, tracing (OpenTelemetry, W3C Trace Context), métricas e APM, wide events e cardinalidade, SLOs, SLIs e error budgets, alertas e ruído, incidentes e post-mortems, profiling contínuo e eBPF, chaos engineering, custo de observabilidade.
- **Vem de:** SRE de hoje; do site de notícias, Observabilidade & SRE.
- **Posts (3):** Logging estruturado em Spring Boot; W3C Trace Context; Wide events e canonical log lines.
- **Cor:** ocre (`#c4a050`). O ocre, dos pigmentos mais antigos, e o amarelo da cautela na sinalização.
- **Desenho:** farol. O farol fica aceso o tempo todo e avisa antes de o navio bater.

**O que muda:** Entram dois livros novos (Integração e Eventos e Pagamentos) e sai Carreira (o endereço dela passa a levar para Arquitetura de Software). Quatro posts trocam de livro: o SNS Filter Policy vai para Integração e Eventos; o ledger, a chave de idempotência e o efeito externo, para Pagamentos. Nenhum livro muda de nome.

Os 21 posts de categoria ficam distribuídos assim: Arquitetura de Software 2, Integração e Eventos 1, Desenvolvimento de Software 6, Dados 2, Pagamentos 3, IA 0, Segurança 2, DevOps 2, SRE 3.

## Sugestão 3 · O nome que o leitor procura (10 livros)

Os mesmos livros da sugestão 2, mais Carreira, que continua; e onde o nome de hoje não é a palavra que o leitor procura, o título passa a dizer o que tem dentro: Desenvolvimento de Software vira Java e Spring (todos os seis posts são de Java e Spring) e SRE vira Observabilidade (os três posts são de observabilidade).

### 01 · Arquitetura de Software

*As decisões caras de desfazer.*

- **Abrange:** Decisões e trade-offs (ADRs, dívida técnica, overengineering), DDD e bounded contexts, Clean e Hexagonal, padrões (GoF, enterprise), C4 e docs-as-code, microsserviços ou monólito modular, consistência entre serviços (idempotência, outbox, saga, CQRS), resiliência (timeout, retry, circuit breaker), Tech Radar e governança de API.
- **Vem de:** Arquitetura de Software de hoje, sem a mensageria e os posts de cobrança; do site de notícias, Sist. Distribuídos, Design & Padrões e Arq. Corporativa (estratégia técnica).
- **Posts (2):** CronJob ou endpoint + fila; Overhead vs overkill.
- **Cor:** verde-pátina (`#2d4b46`). A pátina que o cobre e o bronze ganham com o tempo nos prédios: a cor do que foi feito para durar.
- **Desenho:** arco e pedra angular. A pedra angular é a peça que segura o arco e não se tira depois: a decisão cara de desfazer.

### 02 · Integração e Eventos

*Como um sistema fala com o outro.*

- **Abrange:** Mensageria (SQS, SNS, Kafka, RabbitMQ), pub/sub e filtros de mensagem, arquitetura orientada a eventos, webhooks, DLQ e redrive, ordem e entrega pelo menos uma vez, design de API e API-First (REST, OpenAPI, GraphQL, gRPC), contratos e evolução de esquema (AsyncAPI, Schema Registry), MCP como integração.
- **Vem de:** Novo. A mensageria de Arquitetura de Software; do site de notícias, Integração & Eventos.
- **Posts (1):** SNS MessageAttributes e Filter Policy.
- **Cor:** verde-água de isolador (`#72aba5`). O vidro dos isoladores das linhas de telégrafo e de telefone saía verde-água, pelo ferro da areia.
- **Desenho:** mesa telefônica manual, com jaques e cordões. A telefonista liga quem chama a quem atende: o roteamento e o contrato entre quem envia e quem recebe.

### 03 · Java e Spring

*O ofício dentro de cada serviço.*

- **Abrange:** JVM (GC, JIT, memória, JFR, thread dump), concorrência (virtual threads, atomics, executors), Spring Boot (autoconfiguração, AOP e proxies, Data JPA, Actuator), Jackson e serialização, build (Gradle, Maven), testes (JUnit, Testcontainers, slices do Spring), performance (profiling, p99), o que roda por baixo (TCP, sinais).
- **Vem de:** Desenvolvimento de Software de hoje, com o nome do que tem dentro; do site de notícias, Backend & Runtimes, Testes & Qualidade e Fundamentos de Computação.
- **Posts (6):** AOP no Spring; AopUtils.getTargetClass(); AtomicBoolean; Gradle; Filtros de serialização no Jackson; Virtual threads no Java 21.
- **Cor:** tijolo (`#7a4430`). O vermelho do óxido de ferro (a argila queimada) e do zarcão, a primeira demão de toda peça de ferro da oficina.
- **Desenho:** paquímetro medindo uma peça. O instrumento de medir com precisão a peça que se fez: o ofício dentro de cada serviço.

### 04 · Dados

*Onde o dado mora e por onde ele anda.*

- **Abrange:** Bancos relacionais (PostgreSQL), travas e isolamento (lock otimista e pessimista, MVCC), NoSQL (MongoDB, DynamoDB), modelagem e índices, migração de esquema (Flyway, Liquibase), CDC (Debezium), streaming (Kafka Streams, Flink), lake, warehouse e lakehouse (Iceberg, dbt, DuckDB), contratos de dados e Data Mesh, busca vetorial (pgvector).
- **Vem de:** Dados de hoje; do site de notícias, Dados & Streaming.
- **Posts (2):** Bloqueio otimista e pessimista; Data lake vs data warehouse.
- **Cor:** ameixa (`#5f4662`). O roxo das cópias do mimeógrafo a álcool, que copiou fichas, listas e registros por décadas.
- **Desenho:** gaveta de fichas. A ficha é o registro e a gaveta é o índice; a ficha que volta é o dado que anda.

### 05 · Pagamentos

*Dinheiro não pode sumir nem dobrar.*

- **Abrange:** Ledger e partidas dobradas, saldo e conciliação, idempotência e retry na cobrança, efeito externo e outbox na cobrança, cartões e bandeiras (Visa, Mastercard, Elo), adquirência (autorização, captura, estorno, chargeback), Pix, Open Finance e Drex, cooperativas de crédito (Unicred, Sicoob, Sicredi), PCI DSS, fraude e risco.
- **Vem de:** Novo. Os três posts de cobrança de Arquitetura de Software; do site de notícias, Fintech & Pagamentos.
- **Posts (3):** Arquitetura de ledger; Chave de idempotência; Efeito externo sem registro local.
- **Cor:** verde-cédula (`#467866`). O verso verde das cédulas americanas desde 1861 e o verde do papel de razão dos contadores (um tom mais fundo, para a tinta clara ter mais contraste).
- **Desenho:** caixa registradora mecânica. Inventada em 1879 contra a fraude: registra cada venda, guarda o dinheiro e fecha o caixa no fim do dia, que é conciliação.

### 06 · IA

*Software feito com IA e software que usa IA.*

- **Abrange:** LLMs e modelos (Claude, GPT, Gemini, abertos), programar com IA (Claude Code, AI coding em produção), agentes e MCP, RAG e bancos vetoriais, prompts e contexto, evals e observabilidade de LLM (Langfuse, LangSmith), guardrails e prompt injection, LLM local (Ollama), fine-tuning e multimodal.
- **Vem de:** IA de hoje; do site de notícias, IA & LLMs e AIOps & Agents.
- **Posts (0):** nenhum ainda.
- **Cor:** vinho (`#6e2f45`). O vermelho do marroquim das encadernações finas; não há convenção que ligue a cor ao assunto.
- **Desenho:** autômato escritor. O Escritor de Jaquet-Droz (1774) é uma máquina que escreve e se programa: um LLM do século XVIII.

### 07 · Segurança

*Quem pode o quê e como provar.*

- **Abrange:** Identidade e acesso (OAuth 2.0, OIDC, JWT, passkeys e WebAuthn), Zero Trust, criptografia em repouso e em trânsito (TLS, KMS), segredos (Vault, AWS Secrets Manager), OWASP e CVEs, cadeia de suprimentos (SBOM, SLSA, Sigstore), runtime security, segurança de IA, LGPD e privacidade.
- **Vem de:** Segurança de hoje; do site de notícias, Segurança & IAM.
- **Posts (2):** Criptografia em repouso e em trânsito; JWT.
- **Cor:** oliva (`#606a37`). O verde-oliva das fardas (no Brasil desde 1931): a cor de quem guarda.
- **Desenho:** carta lacrada e sinete. O sinete prova quem mandou e o lacre prova que ninguém abriu: identidade e prova.

### 08 · DevOps

*O caminho do commit até a produção.*

- **Abrange:** Containers e Kubernetes (Jobs, CronJobs, ciclo de vida do pod), CI/CD (GitHub Actions), GitOps (Argo CD), infraestrutura como código (Terraform), entrega progressiva (canary, feature flags), plataforma interna (IDP, Backstage), nuvem AWS (EKS, rede, contas), edge e proxies (HTTP/3), FinOps.
- **Vem de:** DevOps de hoje; do site de notícias, DevOps & Plataformas e Cloud.
- **Posts (2):** Kubernetes CronJob; SIGTERM e SIGKILL.
- **Cor:** azul-ardósia (`#465976`). O azul das camisas de trabalho que deu nome ao colarinho azul: a cor da operação, do cais.
- **Desenho:** guindaste de porto. O guindaste do porto empilha contêineres, do navio até o pátio.

### 09 · Observabilidade

*Descobrir o que aconteceu em produção.*

- **Abrange:** Logs estruturados, tracing (OpenTelemetry, W3C Trace Context), métricas e APM, wide events e cardinalidade, SLOs, SLIs e error budgets, alertas e ruído, incidentes e post-mortems, profiling contínuo e eBPF, custo de observabilidade.
- **Vem de:** SRE de hoje, com o nome que tinha antes da D30; do site de notícias, Observabilidade & SRE.
- **Posts (3):** Logging estruturado em Spring Boot; W3C Trace Context; Wide events e canonical log lines.
- **Cor:** ocre (`#c4a050`). O ocre, dos pigmentos mais antigos, e o amarelo da cautela na sinalização.
- **Desenho:** farol. O farol fica aceso o tempo todo e avisa antes de o navio bater.

### 10 · Carreira

*O lado humano de construir software.*

- **Abrange:** O papel do arquiteto, liderança técnica, times e Team Topologies, DevEx (DORA, SPACE), decisões em grupo (RFCs, o ADR como conversa), comunicação técnica, o estudo e o caderno.
- **Vem de:** Carreira de hoje; do site de notícias, a estrutura dos times de Arq. Corporativa.
- **Posts (0):** nenhum ainda.
- **Cor:** couro (`#9a7650`). O couro de bezerro das encadernações, a cor do caderno que envelhece com o uso.
- **Desenho:** compasso. O instrumento de quem traça o plano antes de construir.

**O que muda:** Entram dois livros novos (Integração e Eventos e Pagamentos); nenhum sai. Dois livros mudam de nome e ficam com o desenho e a cor de hoje: Desenvolvimento de Software → Java e Spring e SRE → Observabilidade (os endereços antigos passam a levar para os novos). Quatro posts trocam de livro (os mesmos da sugestão 2) e nove só trocam o nome do livro.

Os 21 posts de categoria ficam distribuídos assim: Arquitetura de Software 2, Integração e Eventos 1, Java e Spring 6, Dados 2, Pagamentos 3, IA 0, Segurança 2, DevOps 2, Observabilidade 3, Carreira 0.

## Sugestão 4 · A arquitetura em três (11 livros)

O livro que mais mistura assuntos, Arquitetura de Software, se abre em três: as decisões, as garantias quando algo falha (Sistemas Distribuídos) e a conversa entre sistemas (Integração e Eventos). Entra Pagamentos, com o domínio; nenhum livro de hoje muda de nome nem sai.

### 01 · Arquitetura de Software

*As decisões caras de desfazer.*

- **Abrange:** Decisões e trade-offs (ADRs, dívida técnica, overengineering), DDD e bounded contexts, Clean e Hexagonal, padrões (GoF, enterprise), C4 e docs-as-code, microsserviços ou monólito modular, atributos de qualidade (custo, latência, disponibilidade), Tech Radar e governança de API.
- **Vem de:** As decisões de Arquitetura de Software de hoje; do site de notícias, Design & Padrões e Arq. Corporativa (estratégia técnica).
- **Posts (2):** CronJob ou endpoint + fila; Overhead vs overkill.
- **Cor:** verde-pátina (`#2d4b46`). A pátina que o cobre e o bronze ganham com o tempo nos prédios: a cor do que foi feito para durar.
- **Desenho:** arco e pedra angular. A pedra angular é a peça que segura o arco e não se tira depois: a decisão cara de desfazer.

### 02 · Sistemas Distribuídos

*Quando o timeout não diz o que aconteceu.*

- **Abrange:** Idempotência e retry, escrita dupla, outbox e inbox, saga e compensação, CQRS e event sourcing, modelos de consistência, resiliência (timeout, circuit breaker, bulkhead, backpressure), cache distribuído, execução durável (Temporal), multi-região e serverless.
- **Vem de:** Novo. A consistência de Arquitetura de Software; do site de notícias, Sist. Distribuídos.
- **Posts (2):** Chave de idempotência; Efeito externo sem registro local.
- **Cor:** azul-marinho (`#1c2c51`). O azul dos uniformes da Marinha (1748) e o cronômetro de marinha, que carregava a hora do porto para comparar com a hora local.
- **Desenho:** dois relógios de pêndulo na mesma viga. Cada máquina tem o seu relógio; os de Huygens (1665) se acertavam só pela viga que os ligava: ordem, tempo e acordo entre nós.

### 03 · Integração e Eventos

*Como um sistema fala com o outro.*

- **Abrange:** Mensageria (SQS, SNS, Kafka, RabbitMQ), pub/sub e filtros de mensagem, arquitetura orientada a eventos, webhooks, DLQ e redrive, ordem e entrega pelo menos uma vez, design de API e API-First (REST, OpenAPI, GraphQL, gRPC), contratos e evolução de esquema (AsyncAPI, Schema Registry), MCP como integração.
- **Vem de:** Novo. A mensageria de Arquitetura de Software; do site de notícias, Integração & Eventos.
- **Posts (1):** SNS MessageAttributes e Filter Policy.
- **Cor:** verde-água de isolador (`#72aba5`). O vidro dos isoladores das linhas de telégrafo e de telefone saía verde-água, pelo ferro da areia.
- **Desenho:** mesa telefônica manual, com jaques e cordões. A telefonista liga quem chama a quem atende: o roteamento e o contrato entre quem envia e quem recebe.

### 04 · Desenvolvimento de Software

*O ofício dentro de cada serviço.*

- **Abrange:** Java, Spring e JVM, concorrência (threads, virtual threads, modelo de memória), performance (profiling, GC, JFR, p99), build (Gradle, Maven), serialização (Jackson), testes (JUnit, Testcontainers, contract testing), refatoração e padrões de código, o que roda por baixo (TCP, sinais, sistema operacional), web e front-end, quando aparecer.
- **Vem de:** Desenvolvimento de Software de hoje; do site de notícias, Backend & Runtimes, Testes & Qualidade e Fundamentos de Computação.
- **Posts (6):** AOP no Spring; AopUtils.getTargetClass(); AtomicBoolean; Gradle; Filtros de serialização no Jackson; Virtual threads no Java 21.
- **Cor:** tijolo (`#7a4430`). O vermelho do óxido de ferro (a argila queimada) e do zarcão, a primeira demão de toda peça de ferro da oficina.
- **Desenho:** paquímetro medindo uma peça. O instrumento de medir com precisão a peça que se fez: o ofício dentro de cada serviço.

### 05 · Dados

*Onde o dado mora e por onde ele anda.*

- **Abrange:** Bancos relacionais (PostgreSQL), travas e isolamento (lock otimista e pessimista, MVCC), NoSQL (MongoDB, DynamoDB), modelagem e índices, migração de esquema (Flyway, Liquibase), CDC (Debezium), streaming (Kafka Streams, Flink), lake, warehouse e lakehouse (Iceberg, dbt, DuckDB), contratos de dados e Data Mesh, busca vetorial (pgvector).
- **Vem de:** Dados de hoje; do site de notícias, Dados & Streaming.
- **Posts (2):** Bloqueio otimista e pessimista; Data lake vs data warehouse.
- **Cor:** ameixa (`#5f4662`). O roxo das cópias do mimeógrafo a álcool, que copiou fichas, listas e registros por décadas.
- **Desenho:** gaveta de fichas. A ficha é o registro e a gaveta é o índice; a ficha que volta é o dado que anda.

### 06 · Pagamentos

*Dinheiro não pode sumir nem dobrar.*

- **Abrange:** Ledger e partidas dobradas, saldo e conciliação, cartões e bandeiras (Visa, Mastercard, Elo), adquirência (autorização, captura, estorno, chargeback), Pix, Open Finance e Drex, cooperativas de crédito (Unicred, Sicoob, Sicredi), payment rails, PCI DSS, fraude e risco, BaaS e embedded finance.
- **Vem de:** Novo. O ledger de Arquitetura de Software; do site de notícias, Fintech & Pagamentos.
- **Posts (1):** Arquitetura de ledger.
- **Cor:** verde-cédula (`#467866`). O verso verde das cédulas americanas desde 1861 e o verde do papel de razão dos contadores (um tom mais fundo, para a tinta clara ter mais contraste).
- **Desenho:** caixa registradora mecânica. Inventada em 1879 contra a fraude: registra cada venda, guarda o dinheiro e fecha o caixa no fim do dia, que é conciliação.

### 07 · IA

*Software feito com IA e software que usa IA.*

- **Abrange:** LLMs e modelos (Claude, GPT, Gemini, abertos), programar com IA (Claude Code, AI coding em produção), agentes e MCP, RAG e bancos vetoriais, prompts e contexto, evals e observabilidade de LLM (Langfuse, LangSmith), guardrails e prompt injection, LLM local (Ollama), fine-tuning e multimodal.
- **Vem de:** IA de hoje; do site de notícias, IA & LLMs e AIOps & Agents.
- **Posts (0):** nenhum ainda.
- **Cor:** vinho (`#6e2f45`). O vermelho do marroquim das encadernações finas; não há convenção que ligue a cor ao assunto.
- **Desenho:** autômato escritor. O Escritor de Jaquet-Droz (1774) é uma máquina que escreve e se programa: um LLM do século XVIII.

### 08 · Segurança

*Quem pode o quê e como provar.*

- **Abrange:** Identidade e acesso (OAuth 2.0, OIDC, JWT, passkeys e WebAuthn), Zero Trust, criptografia em repouso e em trânsito (TLS, KMS), segredos (Vault, AWS Secrets Manager), OWASP e CVEs, cadeia de suprimentos (SBOM, SLSA, Sigstore), runtime security, segurança de IA, LGPD e privacidade.
- **Vem de:** Segurança de hoje; do site de notícias, Segurança & IAM.
- **Posts (2):** Criptografia em repouso e em trânsito; JWT.
- **Cor:** oliva (`#606a37`). O verde-oliva das fardas (no Brasil desde 1931): a cor de quem guarda.
- **Desenho:** carta lacrada e sinete. O sinete prova quem mandou e o lacre prova que ninguém abriu: identidade e prova.

### 09 · DevOps

*O caminho do commit até a produção.*

- **Abrange:** Containers e Kubernetes (Jobs, CronJobs, ciclo de vida do pod), CI/CD (GitHub Actions), GitOps (Argo CD), infraestrutura como código (Terraform), entrega progressiva (canary, feature flags), plataforma interna (IDP, Backstage), nuvem AWS (EKS, rede, contas), edge e proxies (HTTP/3), FinOps.
- **Vem de:** DevOps de hoje; do site de notícias, DevOps & Plataformas e Cloud.
- **Posts (2):** Kubernetes CronJob; SIGTERM e SIGKILL.
- **Cor:** azul-ardósia (`#465976`). O azul das camisas de trabalho que deu nome ao colarinho azul: a cor da operação, do cais.
- **Desenho:** guindaste de porto. O guindaste do porto empilha contêineres, do navio até o pátio.

### 10 · SRE

*O que mantém a produção de pé.*

- **Abrange:** Logs estruturados, tracing (OpenTelemetry, W3C Trace Context), métricas e APM, wide events e cardinalidade, SLOs, SLIs e error budgets, alertas e ruído, incidentes e post-mortems, profiling contínuo e eBPF, chaos engineering, custo de observabilidade.
- **Vem de:** SRE de hoje; do site de notícias, Observabilidade & SRE.
- **Posts (3):** Logging estruturado em Spring Boot; W3C Trace Context; Wide events e canonical log lines.
- **Cor:** ocre (`#c4a050`). O ocre, dos pigmentos mais antigos, e o amarelo da cautela na sinalização.
- **Desenho:** farol. O farol fica aceso o tempo todo e avisa antes de o navio bater.

### 11 · Carreira

*O lado humano de construir software.*

- **Abrange:** O papel do arquiteto, liderança técnica, times e Team Topologies, DevEx (DORA, SPACE), decisões em grupo (RFCs, o ADR como conversa), comunicação técnica, o estudo e o caderno.
- **Vem de:** Carreira de hoje; do site de notícias, a estrutura dos times de Arq. Corporativa.
- **Posts (0):** nenhum ainda.
- **Cor:** couro (`#9a7650`). O couro de bezerro das encadernações, a cor do caderno que envelhece com o uso.
- **Desenho:** compasso. O instrumento de quem traça o plano antes de construir.

**O que muda:** Entram três livros novos (Sistemas Distribuídos, Integração e Eventos e Pagamentos); nenhum muda de nome nem sai, e não há redirecionamento novo. Quatro posts trocam de livro: a chave de idempotência e o efeito externo vão para Sistemas Distribuídos (é o que eles ensinam; a cobrança fica como tag), o SNS Filter Policy para Integração e Eventos e o ledger para Pagamentos. Arquitetura de Software, o Volume 01, fica com dois posts.

Os 21 posts de categoria ficam distribuídos assim: Arquitetura de Software 2, Sistemas Distribuídos 2, Integração e Eventos 1, Desenvolvimento de Software 6, Dados 2, Pagamentos 1, IA 0, Segurança 2, DevOps 2, SRE 3, Carreira 0.

## Sugestão 5 · O espelho do site de notícias (12 livros)

O blog e o site de notícias com o mesmo índice: as 16 categorias viram 12 livros, com os nomes de lá sem o "&". As duas de IA viram uma, Design & Padrões e Arq. Corporativa entram em Arquitetura de Software, Cloud entra em Plataforma, e Frontend & Web fica de fora (o blog não escreve sobre isso). Carreira sai.

### 01 · Arquitetura de Software

*As decisões caras de desfazer.*

- **Abrange:** DDD e bounded contexts, padrões (GoF, enterprise), Clean e Hexagonal, C4, ADRs e docs-as-code, decisões e trade-offs (overengineering), microsserviços ou monólito modular, estrutura dos times (Team Topologies, Platform Engineering, DevEx, DORA), governança e custo (governança de API, FinOps, landing zones), estratégia técnica (dívida técnica, Tech Radar).
- **Vem de:** Arquitetura de Software de hoje e o papel do arquiteto de Carreira; do site de notícias, Design & Padrões e Arq. Corporativa.
- **Posts (2):** CronJob ou endpoint + fila; Overhead vs overkill.
- **Cor:** verde-pátina (`#2d4b46`). A pátina que o cobre e o bronze ganham com o tempo nos prédios: a cor do que foi feito para durar.
- **Desenho:** arco e pedra angular. A pedra angular é a peça que segura o arco e não se tira depois: a decisão cara de desfazer.

### 02 · Sistemas Distribuídos

*Quando o timeout não diz o que aconteceu.*

- **Abrange:** Idempotência e retry, escrita dupla, outbox e inbox, saga e compensação, CQRS e event sourcing, modelos de consistência, resiliência (timeout, circuit breaker, bulkhead, backpressure), cache distribuído, execução durável (Temporal), multi-região e serverless.
- **Vem de:** Novo. A consistência de Arquitetura de Software; do site de notícias, Sist. Distribuídos.
- **Posts (2):** Chave de idempotência; Efeito externo sem registro local.
- **Cor:** azul-marinho (`#1c2c51`). O azul dos uniformes da Marinha (1748) e o cronômetro de marinha, que carregava a hora do porto para comparar com a hora local.
- **Desenho:** dois relógios de pêndulo na mesma viga. Cada máquina tem o seu relógio; os de Huygens (1665) se acertavam só pela viga que os ligava: ordem, tempo e acordo entre nós.

### 03 · Integração e Eventos

*Como um sistema fala com o outro.*

- **Abrange:** Mensageria (SQS, SNS, Kafka, RabbitMQ), pub/sub e filtros de mensagem, arquitetura orientada a eventos, webhooks, DLQ e redrive, ordem e entrega pelo menos uma vez, design de API e API-First (REST, OpenAPI, GraphQL, gRPC), contratos e evolução de esquema (AsyncAPI, Schema Registry), MCP como integração.
- **Vem de:** Novo. A mensageria de Arquitetura de Software; do site de notícias, Integração & Eventos.
- **Posts (1):** SNS MessageAttributes e Filter Policy.
- **Cor:** verde-água de isolador (`#72aba5`). O vidro dos isoladores das linhas de telégrafo e de telefone saía verde-água, pelo ferro da areia.
- **Desenho:** mesa telefônica manual, com jaques e cordões. A telefonista liga quem chama a quem atende: o roteamento e o contrato entre quem envia e quem recebe.

### 04 · Backend

*O ofício dentro de cada serviço.*

- **Abrange:** Java, Spring e JVM, runtimes e frameworks web, modelos de concorrência (threads, virtual threads, reativo), performance (profiling, GC, JFR, p99), build (Gradle, Maven), serialização (Jackson), padrões do lado do servidor, outras linguagens e WebAssembly, quando aparecerem.
- **Vem de:** Desenvolvimento de Software de hoje, com o nome do site de notícias; de lá, Backend & Runtimes.
- **Posts (6):** AOP no Spring; AopUtils.getTargetClass(); AtomicBoolean; Gradle; Filtros de serialização no Jackson; Virtual threads no Java 21.
- **Cor:** tijolo (`#7a4430`). O vermelho do óxido de ferro (a argila queimada) e do zarcão, a primeira demão de toda peça de ferro da oficina.
- **Desenho:** paquímetro medindo uma peça. O instrumento de medir com precisão a peça que se fez: o ofício dentro de cada serviço.

### 05 · Dados

*Onde o dado mora e por onde ele anda.*

- **Abrange:** Bancos relacionais (PostgreSQL), travas e isolamento (lock otimista e pessimista, MVCC), NoSQL (MongoDB, DynamoDB), modelagem e índices, migração de esquema (Flyway, Liquibase), CDC (Debezium), streaming (Kafka Streams, Flink), lake, warehouse e lakehouse (Iceberg, dbt, DuckDB), contratos de dados e Data Mesh, busca vetorial (pgvector).
- **Vem de:** Dados de hoje; do site de notícias, Dados & Streaming.
- **Posts (2):** Bloqueio otimista e pessimista; Data lake vs data warehouse.
- **Cor:** ameixa (`#5f4662`). O roxo das cópias do mimeógrafo a álcool, que copiou fichas, listas e registros por décadas.
- **Desenho:** gaveta de fichas. A ficha é o registro e a gaveta é o índice; a ficha que volta é o dado que anda.

### 06 · Testes

*A prova de que o código faz o que diz.*

- **Abrange:** TDD e BDD, pirâmide de testes, JUnit e Testcontainers, testes de slice do Spring, contract testing (Pact), testes de carga e de performance (k6, Gatling), chaos engineering, dados de teste, testes com IA.
- **Vem de:** Novo. Os testes de Desenvolvimento de Software; do site de notícias, Testes & Qualidade.
- **Posts (0):** nenhum ainda.
- **Cor:** pedra de toque (`#383532`). A pedra preta em que se risca o ouro para conferir a pureza: "pedra de toque" é, ao pé da letra, o teste.
- **Desenho:** fio de prumo diante da parede. O prumo não mede, compara com uma referência que não falha; o fantasma é a vertical verdadeira ao lado da parede que saiu do prumo.

### 07 · Plataforma

*O chão onde o serviço roda.*

- **Abrange:** Containers e Kubernetes, CI/CD e GitOps, entrega progressiva, infraestrutura como código (Terraform), plataforma interna (IDP, Backstage), nuvem (AWS, Azure, GCP: computação, rede, VPC), CDN e edge, Well-Architected, FinOps, produtividade do desenvolvedor.
- **Vem de:** DevOps de hoje, com o nome do grupo do site de notícias; de lá, DevOps & Plataformas e Cloud.
- **Posts (2):** Kubernetes CronJob; SIGTERM e SIGKILL.
- **Cor:** azul-ardósia (`#465976`). O azul das camisas de trabalho que deu nome ao colarinho azul: a cor da operação, do cais.
- **Desenho:** guindaste de porto. O guindaste do porto empilha contêineres, do navio até o pátio.

### 08 · Observabilidade

*Descobrir o que aconteceu em produção.*

- **Abrange:** Logs estruturados, tracing (OpenTelemetry, W3C Trace Context), métricas e APM, wide events e cardinalidade, SLOs, SLIs e error budgets, alertas e ruído, incidentes e post-mortems, profiling contínuo e eBPF, custo de observabilidade.
- **Vem de:** SRE de hoje, com o nome do site de notícias (e o de antes da D30); de lá, Observabilidade & SRE.
- **Posts (3):** Logging estruturado em Spring Boot; W3C Trace Context; Wide events e canonical log lines.
- **Cor:** ocre (`#c4a050`). O ocre, dos pigmentos mais antigos, e o amarelo da cautela na sinalização.
- **Desenho:** farol. O farol fica aceso o tempo todo e avisa antes de o navio bater.

### 09 · Segurança

*Quem pode o quê e como provar.*

- **Abrange:** Identidade e acesso (OAuth 2.0, OIDC, JWT, passkeys e WebAuthn), Zero Trust, criptografia em repouso e em trânsito (TLS, KMS), segredos (Vault, AWS Secrets Manager), OWASP e CVEs, cadeia de suprimentos (SBOM, SLSA, Sigstore), runtime security, segurança de IA, LGPD e privacidade.
- **Vem de:** Segurança de hoje; do site de notícias, Segurança & IAM.
- **Posts (2):** Criptografia em repouso e em trânsito; JWT.
- **Cor:** oliva (`#606a37`). O verde-oliva das fardas (no Brasil desde 1931): a cor de quem guarda.
- **Desenho:** carta lacrada e sinete. O sinete prova quem mandou e o lacre prova que ninguém abriu: identidade e prova.

### 10 · IA

*Software feito com IA e software que usa IA.*

- **Abrange:** LLMs e modelos (Claude, GPT, Gemini, abertos), programar com IA (Claude Code, AI coding em produção), agentes e MCP, RAG e bancos vetoriais, prompts e contexto, evals e observabilidade de LLM (Langfuse, LangSmith), guardrails e prompt injection, LLM local (Ollama), fine-tuning e multimodal.
- **Vem de:** IA de hoje; do site de notícias, IA & LLMs e AIOps & Agents.
- **Posts (0):** nenhum ainda.
- **Cor:** vinho (`#6e2f45`). O vermelho do marroquim das encadernações finas; não há convenção que ligue a cor ao assunto.
- **Desenho:** autômato escritor. O Escritor de Jaquet-Droz (1774) é uma máquina que escreve e se programa: um LLM do século XVIII.

### 11 · Pagamentos

*Dinheiro não pode sumir nem dobrar.*

- **Abrange:** Ledger e partidas dobradas, saldo e conciliação, cartões e bandeiras (Visa, Mastercard, Elo), adquirência (autorização, captura, estorno, chargeback), Pix, Open Finance e Drex, cooperativas de crédito (Unicred, Sicoob, Sicredi), payment rails, PCI DSS, fraude e risco, BaaS e embedded finance.
- **Vem de:** Novo. O ledger de Arquitetura de Software; do site de notícias, Fintech & Pagamentos.
- **Posts (1):** Arquitetura de ledger.
- **Cor:** verde-cédula (`#467866`). O verso verde das cédulas americanas desde 1861 e o verde do papel de razão dos contadores (um tom mais fundo, para a tinta clara ter mais contraste).
- **Desenho:** caixa registradora mecânica. Inventada em 1879 contra a fraude: registra cada venda, guarda o dinheiro e fecha o caixa no fim do dia, que é conciliação.

### 12 · Fundamentos

*O que todo framework esconde.*

- **Abrange:** Sistema operacional (processos, sinais, PID 1), redes (TCP e os estados da conexão, DNS, TLS), concorrência e modelo de memória (visibilidade, happens-before), estruturas de dados e algoritmos, teoria das filas, desempenho do hardware (cache de CPU, memória).
- **Vem de:** Novo. O que hoje é item de Desenvolvimento de Software; do site de notícias, Fundamentos de Computação.
- **Posts (0):** nenhum ainda.
- **Cor:** cinza-pedra (`#a69d91`). O cinza da pedra: calculus, em latim, é a pedrinha de contar que deu nome ao cálculo.
- **Desenho:** ábaco. O instrumento de contar mais antigo ainda em uso: cada conta é um registro, e o cálculo acontece sem nenhuma camada por cima.

**O que muda:** O maior custo das cinco. Entram cinco livros novos (Sistemas Distribuídos, Integração e Eventos, Testes, Pagamentos e Fundamentos) e sai Carreira. Três livros mudam de nome e ficam com o desenho e a cor de hoje: Desenvolvimento de Software → Backend, DevOps → Plataforma e SRE → Observabilidade. Quatro posts trocam de livro (os mesmos da sugestão 4) e onze só trocam o nome do livro. Três livros começam vazios (Testes, IA e Fundamentos) e dois com um post (Integração e Eventos e Pagamentos).

Os 21 posts de categoria ficam distribuídos assim: Arquitetura de Software 2, Sistemas Distribuídos 2, Integração e Eventos 1, Backend 6, Dados 2, Testes 0, Plataforma 2, Observabilidade 3, Segurança 2, IA 0, Pagamentos 1, Fundamentos 0.
