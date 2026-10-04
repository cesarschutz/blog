# As cinco sugestões de coleção

Gerado de `colecoes.json` por `gerar-sugestoes.mjs`; não edite à mão. As capas e a estante de cada
sugestão estão na página `/amostra/colecoes/` (só no dev).

## Vale para todas

- Livro novo entra com o próximo número da coleção, como manda a regra dos livros (CAPAS.md): nenhum livro de hoje muda de volume.
- A casa de cada post é o que ele ensina; o exemplo vira tag. A chave de idempotência e o efeito externo ensinam técnicas que valem fora de pagamento ("A mesma técnica vale para webhooks, APIs públicas de pagamento e comandos consumidos de fila"; "banco mais fila, banco mais cache, banco mais índice de busca"), então ficam com a arquitetura, ou com Sistemas Distribuídos onde ele existe. Pagamentos começa com o ledger, que só existe porque há dinheiro.
- A tag Pagamentos (quatro posts) passa a ter o nome de um livro, e a regra das tags pede que tag não repita nome de categoria: ela sai do ledger, que vai para o livro, e muda de nome nos outros três (Cobrança, por exemplo), ou a regra ganha uma exceção.
- Carreira fica nas quatro primeiras (o livro existe, desenhado, e custa zero). Sem ela, qualquer sugestão fica com um livro a menos: a sugestão 1 vira oito livros.
- Os nomes da sugestão 3 (Java e Spring, Observabilidade) e o Backend da 5 servem em qualquer sugestão; trocar nome reabre a D30 e pede redirecionamento do endereço antigo.
- Pagamentos é livro e não série: série é uma leitura em ordem, com começo e fim (a do Java segue as LTS); Pagamentos vai receber posts soltos (Pix, cartões, conciliação).
- Integração e Eventos mantém o "e Eventos" do site de notícias: só "Integração" lembra integração contínua, e "Mensageria" é o nome de uma tag de quatro posts.
- Fica fora em todas: Frontend & Web (o blog não escreve sobre isso; se virar assunto, é um livro novo) e Green IT. O Bedrock, de Cloud, vai para IA; o service mesh, para Sistemas Distribuídos ou Arquitetura de Software.

## Sugestão 1 · Os oito e Pagamentos (9 livros)

A estante de hoje inteira, mais o livro do assunto que mais identifica o Cesar e que hoje some dentro de Arquitetura de Software: Pagamentos. Nada sai, nada muda de nome. As 16 categorias do site de notícias entram como itens do que cada livro abrange.

### 01 · Arquitetura de Software

*As decisões caras de desfazer.*

- **Abrange:** Decisões e trade-offs (ADRs, overengineering), DDD e bounded contexts, Clean e Hexagonal, padrões (GoF, Fowler), C4 e docs-as-code, microsserviços ou monólito modular, consistência entre serviços (idempotência, outbox, saga, CQRS), resiliência (timeout, retry, circuit breaker), mensageria e eventos (SQS, SNS, Kafka, AsyncAPI), design de API (REST, OpenAPI, GraphQL).
- **Vem de:** Arquitetura de Software de hoje, sem o ledger; do site de notícias, Design & Padrões, Sist. Distribuídos, Integração & Eventos e a estratégia técnica de Arq. Corporativa.
- **Posts (5):** CronJob ou endpoint + fila; Overhead vs overkill; Chave de idempotência; Efeito externo sem registro local; SNS MessageAttributes e Filter Policy.
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

- **Abrange:** Bancos relacionais (PostgreSQL), bloqueio otimista e pessimista, isolamento e MVCC, NoSQL (MongoDB, DynamoDB), modelagem e índices, migração de esquema (Flyway, Liquibase), CDC (Debezium), streaming (Kafka Streams, Flink), lake, warehouse e lakehouse (Iceberg, dbt, DuckDB), contratos de dados e Data Mesh, busca vetorial (pgvector).
- **Vem de:** Dados de hoje; do site de notícias, Dados & Streaming.
- **Posts (2):** Bloqueio otimista e pessimista; Data lake vs data warehouse.
- **Cor:** ameixa (`#5f4662`). O roxo das cópias do mimeógrafo a álcool, que copiou fichas, listas e registros por décadas.
- **Desenho:** gaveta de fichas. A ficha é o registro e a gaveta é o índice; a ficha que volta é o dado que anda.

### 04 · IA

*Software feito com IA e software que usa IA.*

- **Abrange:** LLMs e modelos (Claude, GPT, Gemini, abertos), programar com IA (Claude Code, AI coding em produção), agentes e MCP, RAG, prompts e contexto, evals e observabilidade de LLM (Langfuse, LangSmith), guardrails e prompt injection, LLM local (Ollama), Bedrock e fine-tuning.
- **Vem de:** IA de hoje; do site de notícias, IA & LLMs e AIOps & Agents (e o Bedrock, de Cloud).
- **Posts (0):** nenhum ainda.
- **Cor:** vinho (`#6e2f45`). O vermelho do marroquim das encadernações finas; não há convenção que ligue a cor ao assunto.
- **Desenho:** autômato escritor. O Escritor de Jaquet-Droz (1774) é uma máquina que escreve e se programa: um LLM do século XVIII.

### 05 · Segurança

*Quem pode o quê e como provar.*

- **Abrange:** Identidade e acesso (OAuth 2.0, OIDC, JWT, passkeys e WebAuthn), Zero Trust, criptografia em repouso e em trânsito (TLS, KMS), segredos (Vault, AWS Secrets Manager), OWASP e CVEs, cadeia de suprimentos (SBOM, SLSA, Sigstore), runtime security e segurança de IA, conformidade (PCI DSS, LGPD).
- **Vem de:** Segurança de hoje; do site de notícias, Segurança & IAM e o PCI DSS de Fintech & Pagamentos.
- **Posts (2):** Criptografia em repouso e em trânsito; JWT.
- **Cor:** oliva (`#606a37`). O verde-oliva das fardas (no Brasil desde 1931): a cor de quem guarda.
- **Desenho:** carta lacrada e sinete. O sinete prova quem mandou e o lacre prova que ninguém abriu: identidade e prova.

### 06 · DevOps

*O caminho do commit até a produção.*

- **Abrange:** Containers e Kubernetes (Jobs, CronJobs, ciclo de vida do pod), CI/CD (GitHub Actions), GitOps (Argo CD), infraestrutura como código (Terraform), entrega progressiva (canary, feature flags), plataforma interna (IDP, Backstage), nuvem AWS (EKS, rede, contas e landing zones), edge e proxies (HTTP/3), FinOps.
- **Vem de:** DevOps de hoje; do site de notícias, DevOps & Plataformas e Cloud.
- **Posts (2):** Kubernetes CronJob; SIGTERM e SIGKILL.
- **Cor:** azul-ardósia (`#465976`). O azul das camisas de trabalho que deu nome ao colarinho azul: a cor da operação, do cais.
- **Desenho:** guindaste de porto. O guindaste do porto empilha contêineres, do navio até o pátio.

### 07 · SRE

*O que mantém a produção de pé.*

- **Abrange:** Logs estruturados, tracing (OpenTelemetry, W3C Trace Context), métricas e APM, wide events e cardinalidade, SLOs, SLIs e error budgets, alertas e ruído, incidentes e post-mortems, profiling contínuo e eBPF, chaos engineering, custo de observabilidade.
- **Vem de:** SRE de hoje; do site de notícias, Observabilidade & SRE e o chaos engineering de Testes & Qualidade.
- **Posts (3):** Logging estruturado em Spring Boot; W3C Trace Context; Wide events e canonical log lines.
- **Cor:** ocre (`#c4a050`). O ocre, dos pigmentos mais antigos, e o amarelo da cautela na sinalização.
- **Desenho:** farol. O farol fica aceso o tempo todo e avisa antes de o navio bater.

### 08 · Carreira

*O lado humano de construir software.*

- **Abrange:** O papel do arquiteto, liderança técnica, times e Team Topologies, DevEx (DORA, SPACE), decisões em grupo (RFCs, o ADR como conversa), comunicação técnica, o estudo e o caderno.
- **Vem de:** Carreira de hoje; do site de notícias, a estrutura dos times de Arq. Corporativa (Team Topologies, DevEx).
- **Posts (0):** nenhum ainda.
- **Cor:** couro (`#9a7650`). O couro de bezerro das encadernações, a cor do caderno que envelhece com o uso.
- **Desenho:** compasso. O instrumento de quem traça o plano antes de construir.

### 09 · Pagamentos

*Dinheiro não pode sumir nem dobrar.*

- **Abrange:** Ledger e partidas dobradas, saldo e conciliação, cartões e bandeiras (Visa, Mastercard, Elo), adquirência (autorização, captura, estorno, chargeback), Pix, Open Finance e Drex, cooperativas de crédito (Unicred, Sicoob, Sicredi), payment rails, fraude e risco, regras das bandeiras e do Banco Central, BaaS e embedded finance.
- **Vem de:** Novo. O ledger de Arquitetura de Software; do site de notícias, Fintech & Pagamentos.
- **Posts (1):** Arquitetura de ledger.
- **Cor:** verde-cédula (`#467866`). O verso verde das cédulas americanas desde 1861 e, por tradição dos fabricantes, o verde do papel de razão; um tom mais fundo que o da pesquisa, para a tinta clara ter mais contraste.
- **Desenho:** caixa registradora mecânica. Inventada em 1879 contra a fraude: registra cada venda, guarda o dinheiro e fecha o caixa no fim do dia, que é conciliação.

**O que muda:** Entra um livro novo, Pagamentos, como Volume 09 (desenho e cor novos). Nenhum livro sai, muda de nome ou de número. Um post troca de livro: o ledger, de Arquitetura de Software para Pagamentos. É a menor mudança que dá livro ao domínio.

Os 21 posts de categoria ficam distribuídos assim: Arquitetura de Software 5, Desenvolvimento de Software 6, Dados 2, IA 0, Segurança 2, DevOps 2, SRE 3, Carreira 0, Pagamentos 1.

## Sugestão 2 · O que os posts pedem (10 livros)

Os oito e Pagamentos, mais o livro da mensageria: ela é tag de quatro posts e assunto de um (o filtro do SNS), e no site de notícias é uma categoria forte (Integração & Eventos). Com ela, Arquitetura de Software fica com as decisões e as garantias entre serviços, e a conversa entre sistemas ganha casa.

### 01 · Arquitetura de Software

*As decisões caras de desfazer.*

- **Abrange:** Decisões e trade-offs (ADRs, overengineering), DDD e bounded contexts, Clean e Hexagonal, padrões (GoF, Fowler), C4 e docs-as-code, microsserviços ou monólito modular, consistência entre serviços (idempotência, outbox, saga, CQRS), resiliência (timeout, retry, circuit breaker), estratégia técnica (dívida técnica, Tech Radar).
- **Vem de:** Arquitetura de Software de hoje, sem o ledger e sem a mensageria; do site de notícias, Design & Padrões, Sist. Distribuídos e a estratégia técnica de Arq. Corporativa.
- **Posts (4):** CronJob ou endpoint + fila; Overhead vs overkill; Chave de idempotência; Efeito externo sem registro local.
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

- **Abrange:** Bancos relacionais (PostgreSQL), bloqueio otimista e pessimista, isolamento e MVCC, NoSQL (MongoDB, DynamoDB), modelagem e índices, migração de esquema (Flyway, Liquibase), CDC (Debezium), streaming (Kafka Streams, Flink), lake, warehouse e lakehouse (Iceberg, dbt, DuckDB), contratos de dados e Data Mesh, busca vetorial (pgvector).
- **Vem de:** Dados de hoje; do site de notícias, Dados & Streaming.
- **Posts (2):** Bloqueio otimista e pessimista; Data lake vs data warehouse.
- **Cor:** ameixa (`#5f4662`). O roxo das cópias do mimeógrafo a álcool, que copiou fichas, listas e registros por décadas.
- **Desenho:** gaveta de fichas. A ficha é o registro e a gaveta é o índice; a ficha que volta é o dado que anda.

### 04 · IA

*Software feito com IA e software que usa IA.*

- **Abrange:** LLMs e modelos (Claude, GPT, Gemini, abertos), programar com IA (Claude Code, AI coding em produção), agentes e MCP, RAG, prompts e contexto, evals e observabilidade de LLM (Langfuse, LangSmith), guardrails e prompt injection, LLM local (Ollama), Bedrock e fine-tuning.
- **Vem de:** IA de hoje; do site de notícias, IA & LLMs e AIOps & Agents (e o Bedrock, de Cloud).
- **Posts (0):** nenhum ainda.
- **Cor:** vinho (`#6e2f45`). O vermelho do marroquim das encadernações finas; não há convenção que ligue a cor ao assunto.
- **Desenho:** autômato escritor. O Escritor de Jaquet-Droz (1774) é uma máquina que escreve e se programa: um LLM do século XVIII.

### 05 · Segurança

*Quem pode o quê e como provar.*

- **Abrange:** Identidade e acesso (OAuth 2.0, OIDC, JWT, passkeys e WebAuthn), Zero Trust, criptografia em repouso e em trânsito (TLS, KMS), segredos (Vault, AWS Secrets Manager), OWASP e CVEs, cadeia de suprimentos (SBOM, SLSA, Sigstore), runtime security e segurança de IA, conformidade (PCI DSS, LGPD).
- **Vem de:** Segurança de hoje; do site de notícias, Segurança & IAM e o PCI DSS de Fintech & Pagamentos.
- **Posts (2):** Criptografia em repouso e em trânsito; JWT.
- **Cor:** oliva (`#606a37`). O verde-oliva das fardas (no Brasil desde 1931): a cor de quem guarda.
- **Desenho:** carta lacrada e sinete. O sinete prova quem mandou e o lacre prova que ninguém abriu: identidade e prova.

### 06 · DevOps

*O caminho do commit até a produção.*

- **Abrange:** Containers e Kubernetes (Jobs, CronJobs, ciclo de vida do pod), CI/CD (GitHub Actions), GitOps (Argo CD), infraestrutura como código (Terraform), entrega progressiva (canary, feature flags), plataforma interna (IDP, Backstage), nuvem AWS (EKS, rede, contas e landing zones), edge e proxies (HTTP/3), FinOps.
- **Vem de:** DevOps de hoje; do site de notícias, DevOps & Plataformas e Cloud.
- **Posts (2):** Kubernetes CronJob; SIGTERM e SIGKILL.
- **Cor:** azul-ardósia (`#465976`). O azul das camisas de trabalho que deu nome ao colarinho azul: a cor da operação, do cais.
- **Desenho:** guindaste de porto. O guindaste do porto empilha contêineres, do navio até o pátio.

### 07 · SRE

*O que mantém a produção de pé.*

- **Abrange:** Logs estruturados, tracing (OpenTelemetry, W3C Trace Context), métricas e APM, wide events e cardinalidade, SLOs, SLIs e error budgets, alertas e ruído, incidentes e post-mortems, profiling contínuo e eBPF, chaos engineering, custo de observabilidade.
- **Vem de:** SRE de hoje; do site de notícias, Observabilidade & SRE e o chaos engineering de Testes & Qualidade.
- **Posts (3):** Logging estruturado em Spring Boot; W3C Trace Context; Wide events e canonical log lines.
- **Cor:** ocre (`#c4a050`). O ocre, dos pigmentos mais antigos, e o amarelo da cautela na sinalização.
- **Desenho:** farol. O farol fica aceso o tempo todo e avisa antes de o navio bater.

### 08 · Carreira

*O lado humano de construir software.*

- **Abrange:** O papel do arquiteto, liderança técnica, times e Team Topologies, DevEx (DORA, SPACE), decisões em grupo (RFCs, o ADR como conversa), comunicação técnica, o estudo e o caderno.
- **Vem de:** Carreira de hoje; do site de notícias, a estrutura dos times de Arq. Corporativa (Team Topologies, DevEx).
- **Posts (0):** nenhum ainda.
- **Cor:** couro (`#9a7650`). O couro de bezerro das encadernações, a cor do caderno que envelhece com o uso.
- **Desenho:** compasso. O instrumento de quem traça o plano antes de construir.

### 09 · Pagamentos

*Dinheiro não pode sumir nem dobrar.*

- **Abrange:** Ledger e partidas dobradas, saldo e conciliação, cartões e bandeiras (Visa, Mastercard, Elo), adquirência (autorização, captura, estorno, chargeback), Pix, Open Finance e Drex, cooperativas de crédito (Unicred, Sicoob, Sicredi), payment rails, fraude e risco, regras das bandeiras e do Banco Central, BaaS e embedded finance.
- **Vem de:** Novo. O ledger de Arquitetura de Software; do site de notícias, Fintech & Pagamentos.
- **Posts (1):** Arquitetura de ledger.
- **Cor:** verde-cédula (`#467866`). O verso verde das cédulas americanas desde 1861 e, por tradição dos fabricantes, o verde do papel de razão; um tom mais fundo que o da pesquisa, para a tinta clara ter mais contraste.
- **Desenho:** caixa registradora mecânica. Inventada em 1879 contra a fraude: registra cada venda, guarda o dinheiro e fecha o caixa no fim do dia, que é conciliação.

### 10 · Integração e Eventos

*Como um sistema fala com o outro.*

- **Abrange:** Mensageria (SQS, SNS, Kafka, RabbitMQ), pub/sub e filtros de mensagem, arquitetura orientada a eventos, webhooks, DLQ e redrive, ordem e entrega pelo menos uma vez, design de API e API-First (REST, OpenAPI, GraphQL, gRPC), contratos e evolução de esquema (AsyncAPI, Schema Registry).
- **Vem de:** Novo. A mensageria de Arquitetura de Software; do site de notícias, Integração & Eventos.
- **Posts (1):** SNS MessageAttributes e Filter Policy.
- **Cor:** verde-água de isolador (`#72aba5`). O vidro dos isoladores das linhas de telégrafo e de telefone saía verde-água, pelo ferro da areia.
- **Desenho:** mesa telefônica manual, com jaques e cordões. A telefonista liga quem chama a quem atende: o roteamento e o contrato entre quem envia e quem recebe.

**O que muda:** Entram dois livros novos, Pagamentos (Volume 09) e Integração e Eventos (Volume 10). Nenhum livro sai, muda de nome ou de número. Dois posts trocam de livro: o ledger vai para Pagamentos e o SNS Filter Policy para Integração e Eventos. Os dois livros novos começam com um post cada.

Os 21 posts de categoria ficam distribuídos assim: Arquitetura de Software 4, Desenvolvimento de Software 6, Dados 2, IA 0, Segurança 2, DevOps 2, SRE 3, Carreira 0, Pagamentos 1, Integração e Eventos 1.

## Sugestão 3 · Os nomes do que tem dentro (10 livros)

Os mesmos livros da sugestão 2, com dois nomes trocados pelo que está dentro deles, a palavra que o leitor procura: Desenvolvimento de Software vira Java e Spring (os seis posts são de Java e Spring) e SRE vira Observabilidade (os três posts são de observabilidade). Reabre a D30, de 24/09.

### 01 · Arquitetura de Software

*As decisões caras de desfazer.*

- **Abrange:** Decisões e trade-offs (ADRs, overengineering), DDD e bounded contexts, Clean e Hexagonal, padrões (GoF, Fowler), C4 e docs-as-code, microsserviços ou monólito modular, consistência entre serviços (idempotência, outbox, saga, CQRS), resiliência (timeout, retry, circuit breaker), estratégia técnica (dívida técnica, Tech Radar).
- **Vem de:** Arquitetura de Software de hoje, sem o ledger e sem a mensageria; do site de notícias, Design & Padrões, Sist. Distribuídos e a estratégia técnica de Arq. Corporativa.
- **Posts (4):** CronJob ou endpoint + fila; Overhead vs overkill; Chave de idempotência; Efeito externo sem registro local.
- **Cor:** verde-pátina (`#2d4b46`). A pátina que o cobre e o bronze ganham com o tempo nos prédios: a cor do que foi feito para durar.
- **Desenho:** arco e pedra angular. A pedra angular é a peça que segura o arco e não se tira depois: a decisão cara de desfazer.

### 02 · Java e Spring

*O ofício dentro de cada serviço.*

- **Abrange:** JVM (GC, JIT, memória, JFR, thread dump), concorrência (virtual threads, atomics, executors), Spring Boot (autoconfiguração, AOP e proxies, Data JPA, Actuator), Jackson e serialização, build (Gradle, Maven), testes (JUnit, Testcontainers, slices do Spring), performance (profiling, p99), o que roda por baixo (TCP, sinais).
- **Vem de:** Desenvolvimento de Software de hoje, com o nome do que tem dentro (era Java até a D30); do site de notícias, Backend & Runtimes, Testes & Qualidade e Fundamentos de Computação.
- **Posts (6):** AOP no Spring; AopUtils.getTargetClass(); AtomicBoolean; Gradle; Filtros de serialização no Jackson; Virtual threads no Java 21.
- **Cor:** tijolo (`#7a4430`). O vermelho do óxido de ferro (a argila queimada) e do zarcão, a primeira demão de toda peça de ferro da oficina.
- **Desenho:** paquímetro medindo uma peça. O instrumento de medir com precisão a peça que se fez: o ofício dentro de cada serviço.

### 03 · Dados

*Onde o dado mora e por onde ele anda.*

- **Abrange:** Bancos relacionais (PostgreSQL), bloqueio otimista e pessimista, isolamento e MVCC, NoSQL (MongoDB, DynamoDB), modelagem e índices, migração de esquema (Flyway, Liquibase), CDC (Debezium), streaming (Kafka Streams, Flink), lake, warehouse e lakehouse (Iceberg, dbt, DuckDB), contratos de dados e Data Mesh, busca vetorial (pgvector).
- **Vem de:** Dados de hoje; do site de notícias, Dados & Streaming.
- **Posts (2):** Bloqueio otimista e pessimista; Data lake vs data warehouse.
- **Cor:** ameixa (`#5f4662`). O roxo das cópias do mimeógrafo a álcool, que copiou fichas, listas e registros por décadas.
- **Desenho:** gaveta de fichas. A ficha é o registro e a gaveta é o índice; a ficha que volta é o dado que anda.

### 04 · IA

*Software feito com IA e software que usa IA.*

- **Abrange:** LLMs e modelos (Claude, GPT, Gemini, abertos), programar com IA (Claude Code, AI coding em produção), agentes e MCP, RAG, prompts e contexto, evals e observabilidade de LLM (Langfuse, LangSmith), guardrails e prompt injection, LLM local (Ollama), Bedrock e fine-tuning.
- **Vem de:** IA de hoje; do site de notícias, IA & LLMs e AIOps & Agents (e o Bedrock, de Cloud).
- **Posts (0):** nenhum ainda.
- **Cor:** vinho (`#6e2f45`). O vermelho do marroquim das encadernações finas; não há convenção que ligue a cor ao assunto.
- **Desenho:** autômato escritor. O Escritor de Jaquet-Droz (1774) é uma máquina que escreve e se programa: um LLM do século XVIII.

### 05 · Segurança

*Quem pode o quê e como provar.*

- **Abrange:** Identidade e acesso (OAuth 2.0, OIDC, JWT, passkeys e WebAuthn), Zero Trust, criptografia em repouso e em trânsito (TLS, KMS), segredos (Vault, AWS Secrets Manager), OWASP e CVEs, cadeia de suprimentos (SBOM, SLSA, Sigstore), runtime security e segurança de IA, conformidade (PCI DSS, LGPD).
- **Vem de:** Segurança de hoje; do site de notícias, Segurança & IAM e o PCI DSS de Fintech & Pagamentos.
- **Posts (2):** Criptografia em repouso e em trânsito; JWT.
- **Cor:** oliva (`#606a37`). O verde-oliva das fardas (no Brasil desde 1931): a cor de quem guarda.
- **Desenho:** carta lacrada e sinete. O sinete prova quem mandou e o lacre prova que ninguém abriu: identidade e prova.

### 06 · DevOps

*O caminho do commit até a produção.*

- **Abrange:** Containers e Kubernetes (Jobs, CronJobs, ciclo de vida do pod), CI/CD (GitHub Actions), GitOps (Argo CD), infraestrutura como código (Terraform), entrega progressiva (canary, feature flags), plataforma interna (IDP, Backstage), nuvem AWS (EKS, rede, contas e landing zones), edge e proxies (HTTP/3), FinOps.
- **Vem de:** DevOps de hoje; do site de notícias, DevOps & Plataformas e Cloud.
- **Posts (2):** Kubernetes CronJob; SIGTERM e SIGKILL.
- **Cor:** azul-ardósia (`#465976`). O azul das camisas de trabalho que deu nome ao colarinho azul: a cor da operação, do cais.
- **Desenho:** guindaste de porto. O guindaste do porto empilha contêineres, do navio até o pátio.

### 07 · Observabilidade

*Descobrir o que aconteceu em produção.*

- **Abrange:** Logs estruturados, tracing (OpenTelemetry, W3C Trace Context), métricas e APM, wide events e cardinalidade, SLOs, SLIs e error budgets, alertas e ruído, incidentes e post-mortems, profiling contínuo e eBPF, chaos engineering, custo de observabilidade.
- **Vem de:** SRE de hoje, com o nome que tinha até a D30; do site de notícias, Observabilidade & SRE e o chaos engineering de Testes & Qualidade.
- **Posts (3):** Logging estruturado em Spring Boot; W3C Trace Context; Wide events e canonical log lines.
- **Cor:** ocre (`#c4a050`). O ocre, dos pigmentos mais antigos, e o amarelo da cautela na sinalização.
- **Desenho:** farol. O farol fica aceso o tempo todo e avisa antes de o navio bater.

### 08 · Carreira

*O lado humano de construir software.*

- **Abrange:** O papel do arquiteto, liderança técnica, times e Team Topologies, DevEx (DORA, SPACE), decisões em grupo (RFCs, o ADR como conversa), comunicação técnica, o estudo e o caderno.
- **Vem de:** Carreira de hoje; do site de notícias, a estrutura dos times de Arq. Corporativa (Team Topologies, DevEx).
- **Posts (0):** nenhum ainda.
- **Cor:** couro (`#9a7650`). O couro de bezerro das encadernações, a cor do caderno que envelhece com o uso.
- **Desenho:** compasso. O instrumento de quem traça o plano antes de construir.

### 09 · Pagamentos

*Dinheiro não pode sumir nem dobrar.*

- **Abrange:** Ledger e partidas dobradas, saldo e conciliação, cartões e bandeiras (Visa, Mastercard, Elo), adquirência (autorização, captura, estorno, chargeback), Pix, Open Finance e Drex, cooperativas de crédito (Unicred, Sicoob, Sicredi), payment rails, fraude e risco, regras das bandeiras e do Banco Central, BaaS e embedded finance.
- **Vem de:** Novo. O ledger de Arquitetura de Software; do site de notícias, Fintech & Pagamentos.
- **Posts (1):** Arquitetura de ledger.
- **Cor:** verde-cédula (`#467866`). O verso verde das cédulas americanas desde 1861 e, por tradição dos fabricantes, o verde do papel de razão; um tom mais fundo que o da pesquisa, para a tinta clara ter mais contraste.
- **Desenho:** caixa registradora mecânica. Inventada em 1879 contra a fraude: registra cada venda, guarda o dinheiro e fecha o caixa no fim do dia, que é conciliação.

### 10 · Integração e Eventos

*Como um sistema fala com o outro.*

- **Abrange:** Mensageria (SQS, SNS, Kafka, RabbitMQ), pub/sub e filtros de mensagem, arquitetura orientada a eventos, webhooks, DLQ e redrive, ordem e entrega pelo menos uma vez, design de API e API-First (REST, OpenAPI, GraphQL, gRPC), contratos e evolução de esquema (AsyncAPI, Schema Registry).
- **Vem de:** Novo. A mensageria de Arquitetura de Software; do site de notícias, Integração & Eventos.
- **Posts (1):** SNS MessageAttributes e Filter Policy.
- **Cor:** verde-água de isolador (`#72aba5`). O vidro dos isoladores das linhas de telégrafo e de telefone saía verde-água, pelo ferro da areia.
- **Desenho:** mesa telefônica manual, com jaques e cordões. A telefonista liga quem chama a quem atende: o roteamento e o contrato entre quem envia e quem recebe.

**O que muda:** Os livros da sugestão 2, com dois nomes trocados (reabre a D30): Desenvolvimento de Software → Java e Spring e SRE → Observabilidade, os dois com o desenho, a cor e o volume de hoje; Observabilidade troca também a frase ("O que mantém a produção de pé." → "Descobrir o que aconteceu em produção."). Os endereços antigos passam a levar aos novos; o redirecionamento Java → Desenvolvimento de Software passa a apontar direto para Java e Spring, e o Observabilidade → SRE da D30 sai, porque o endereço volta a ser a página do livro. Dois posts trocam de livro (os da sugestão 2) e nove só trocam o nome do livro. Frontend & Web fica de fora (o blog não escreve sobre isso).

Os 21 posts de categoria ficam distribuídos assim: Arquitetura de Software 4, Java e Spring 6, Dados 2, IA 0, Segurança 2, DevOps 2, Observabilidade 3, Carreira 0, Pagamentos 1, Integração e Eventos 1.

## Sugestão 4 · A arquitetura em três (11 livros)

O livro que mais mistura assuntos, Arquitetura de Software, se abre em três: as decisões (Arquitetura de Software), as garantias quando algo falha (Sistemas Distribuídos) e a conversa entre sistemas (Integração e Eventos). Mais Pagamentos, com o domínio; nenhum nome muda.

### 01 · Arquitetura de Software

*As decisões caras de desfazer.*

- **Abrange:** Decisões e trade-offs (ADRs, overengineering), DDD e bounded contexts, Clean e Hexagonal, padrões (GoF, Fowler), C4 e docs-as-code, microsserviços ou monólito modular, atributos de qualidade (custo, latência, disponibilidade), estratégia técnica (dívida técnica, Tech Radar), governança de API.
- **Vem de:** As decisões de Arquitetura de Software de hoje; do site de notícias, Design & Padrões e a estratégia técnica de Arq. Corporativa.
- **Posts (2):** CronJob ou endpoint + fila; Overhead vs overkill.
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

- **Abrange:** Bancos relacionais (PostgreSQL), bloqueio otimista e pessimista, isolamento e MVCC, NoSQL (MongoDB, DynamoDB), modelagem e índices, migração de esquema (Flyway, Liquibase), CDC (Debezium), streaming (Kafka Streams, Flink), lake, warehouse e lakehouse (Iceberg, dbt, DuckDB), contratos de dados e Data Mesh, busca vetorial (pgvector).
- **Vem de:** Dados de hoje; do site de notícias, Dados & Streaming.
- **Posts (2):** Bloqueio otimista e pessimista; Data lake vs data warehouse.
- **Cor:** ameixa (`#5f4662`). O roxo das cópias do mimeógrafo a álcool, que copiou fichas, listas e registros por décadas.
- **Desenho:** gaveta de fichas. A ficha é o registro e a gaveta é o índice; a ficha que volta é o dado que anda.

### 04 · IA

*Software feito com IA e software que usa IA.*

- **Abrange:** LLMs e modelos (Claude, GPT, Gemini, abertos), programar com IA (Claude Code, AI coding em produção), agentes e MCP, RAG, prompts e contexto, evals e observabilidade de LLM (Langfuse, LangSmith), guardrails e prompt injection, LLM local (Ollama), Bedrock e fine-tuning.
- **Vem de:** IA de hoje; do site de notícias, IA & LLMs e AIOps & Agents (e o Bedrock, de Cloud).
- **Posts (0):** nenhum ainda.
- **Cor:** vinho (`#6e2f45`). O vermelho do marroquim das encadernações finas; não há convenção que ligue a cor ao assunto.
- **Desenho:** autômato escritor. O Escritor de Jaquet-Droz (1774) é uma máquina que escreve e se programa: um LLM do século XVIII.

### 05 · Segurança

*Quem pode o quê e como provar.*

- **Abrange:** Identidade e acesso (OAuth 2.0, OIDC, JWT, passkeys e WebAuthn), Zero Trust, criptografia em repouso e em trânsito (TLS, KMS), segredos (Vault, AWS Secrets Manager), OWASP e CVEs, cadeia de suprimentos (SBOM, SLSA, Sigstore), runtime security e segurança de IA, conformidade (PCI DSS, LGPD).
- **Vem de:** Segurança de hoje; do site de notícias, Segurança & IAM e o PCI DSS de Fintech & Pagamentos.
- **Posts (2):** Criptografia em repouso e em trânsito; JWT.
- **Cor:** oliva (`#606a37`). O verde-oliva das fardas (no Brasil desde 1931): a cor de quem guarda.
- **Desenho:** carta lacrada e sinete. O sinete prova quem mandou e o lacre prova que ninguém abriu: identidade e prova.

### 06 · DevOps

*O caminho do commit até a produção.*

- **Abrange:** Containers e Kubernetes (Jobs, CronJobs, ciclo de vida do pod), CI/CD (GitHub Actions), GitOps (Argo CD), infraestrutura como código (Terraform), entrega progressiva (canary, feature flags), plataforma interna (IDP, Backstage), nuvem AWS (EKS, rede, contas e landing zones), edge e proxies (HTTP/3), FinOps.
- **Vem de:** DevOps de hoje; do site de notícias, DevOps & Plataformas e Cloud.
- **Posts (2):** Kubernetes CronJob; SIGTERM e SIGKILL.
- **Cor:** azul-ardósia (`#465976`). O azul das camisas de trabalho que deu nome ao colarinho azul: a cor da operação, do cais.
- **Desenho:** guindaste de porto. O guindaste do porto empilha contêineres, do navio até o pátio.

### 07 · SRE

*O que mantém a produção de pé.*

- **Abrange:** Logs estruturados, tracing (OpenTelemetry, W3C Trace Context), métricas e APM, wide events e cardinalidade, SLOs, SLIs e error budgets, alertas e ruído, incidentes e post-mortems, profiling contínuo e eBPF, chaos engineering, custo de observabilidade.
- **Vem de:** SRE de hoje; do site de notícias, Observabilidade & SRE e o chaos engineering de Testes & Qualidade.
- **Posts (3):** Logging estruturado em Spring Boot; W3C Trace Context; Wide events e canonical log lines.
- **Cor:** ocre (`#c4a050`). O ocre, dos pigmentos mais antigos, e o amarelo da cautela na sinalização.
- **Desenho:** farol. O farol fica aceso o tempo todo e avisa antes de o navio bater.

### 08 · Carreira

*O lado humano de construir software.*

- **Abrange:** O papel do arquiteto, liderança técnica, times e Team Topologies, DevEx (DORA, SPACE), decisões em grupo (RFCs, o ADR como conversa), comunicação técnica, o estudo e o caderno.
- **Vem de:** Carreira de hoje; do site de notícias, a estrutura dos times de Arq. Corporativa (Team Topologies, DevEx).
- **Posts (0):** nenhum ainda.
- **Cor:** couro (`#9a7650`). O couro de bezerro das encadernações, a cor do caderno que envelhece com o uso.
- **Desenho:** compasso. O instrumento de quem traça o plano antes de construir.

### 09 · Pagamentos

*Dinheiro não pode sumir nem dobrar.*

- **Abrange:** Ledger e partidas dobradas, saldo e conciliação, cartões e bandeiras (Visa, Mastercard, Elo), adquirência (autorização, captura, estorno, chargeback), Pix, Open Finance e Drex, cooperativas de crédito (Unicred, Sicoob, Sicredi), payment rails, fraude e risco, regras das bandeiras e do Banco Central, BaaS e embedded finance.
- **Vem de:** Novo. O ledger de Arquitetura de Software; do site de notícias, Fintech & Pagamentos.
- **Posts (1):** Arquitetura de ledger.
- **Cor:** verde-cédula (`#467866`). O verso verde das cédulas americanas desde 1861 e, por tradição dos fabricantes, o verde do papel de razão; um tom mais fundo que o da pesquisa, para a tinta clara ter mais contraste.
- **Desenho:** caixa registradora mecânica. Inventada em 1879 contra a fraude: registra cada venda, guarda o dinheiro e fecha o caixa no fim do dia, que é conciliação.

### 10 · Integração e Eventos

*Como um sistema fala com o outro.*

- **Abrange:** Mensageria (SQS, SNS, Kafka, RabbitMQ), pub/sub e filtros de mensagem, arquitetura orientada a eventos, webhooks, DLQ e redrive, ordem e entrega pelo menos uma vez, design de API e API-First (REST, OpenAPI, GraphQL, gRPC), contratos e evolução de esquema (AsyncAPI, Schema Registry).
- **Vem de:** Novo. A mensageria de Arquitetura de Software; do site de notícias, Integração & Eventos.
- **Posts (1):** SNS MessageAttributes e Filter Policy.
- **Cor:** verde-água de isolador (`#72aba5`). O vidro dos isoladores das linhas de telégrafo e de telefone saía verde-água, pelo ferro da areia.
- **Desenho:** mesa telefônica manual, com jaques e cordões. A telefonista liga quem chama a quem atende: o roteamento e o contrato entre quem envia e quem recebe.

### 11 · Sistemas Distribuídos

*Quando o timeout não diz o que aconteceu.*

- **Abrange:** Idempotência e retry, escrita dupla, outbox e inbox, saga e compensação, CQRS e event sourcing, modelos de consistência, resiliência (timeout, circuit breaker, bulkhead, backpressure), cache distribuído, service mesh, execução durável (Temporal), multi-região e serverless.
- **Vem de:** Novo. A consistência de Arquitetura de Software; do site de notícias, Sist. Distribuídos.
- **Posts (2):** Chave de idempotência; Efeito externo sem registro local.
- **Cor:** azul-marinho (`#1c2c51`). O azul dos uniformes da Marinha britânica (1748); os relógios de pêndulo de Huygens nasceram para achar a longitude no mar, comparando a hora de bordo com a do porto.
- **Desenho:** dois relógios de pêndulo na mesma viga. Em 1665, Huygens viu que dois relógios pendurados na mesma viga acabavam balançando em sincronia, acertados só pelo que os ligava: cada máquina com o seu relógio e um meio comum entre elas.

**O que muda:** Entram três livros novos: Pagamentos (Volume 09), Integração e Eventos (10) e Sistemas Distribuídos (11). Nenhum livro sai, muda de nome ou de número. Quatro posts trocam de livro: a chave de idempotência e o efeito externo vão para Sistemas Distribuídos (é o que eles ensinam), o SNS Filter Policy para Integração e Eventos e o ledger para Pagamentos. Arquitetura de Software, o Volume 01, fica com os dois posts de decisão. IA e Carreira continuam sem posts.

Os 21 posts de categoria ficam distribuídos assim: Arquitetura de Software 2, Desenvolvimento de Software 6, Dados 2, IA 0, Segurança 2, DevOps 2, SRE 3, Carreira 0, Pagamentos 1, Integração e Eventos 1, Sistemas Distribuídos 2.

## Sugestão 5 · O espelho do site de notícias (12 livros)

O blog com o mesmo índice do site de notícias: as 16 categorias viram 12 livros, com os nomes de lá sem o "&". As duas de IA viram uma; Design & Padrões e Arq. Corporativa entram em Arquitetura de Software; Cloud entra em DevOps; Frontend & Web fica de fora. Carreira, que não é categoria lá, sai.

### 01 · Arquitetura de Software

*As decisões caras de desfazer.*

- **Abrange:** DDD e bounded contexts, padrões (GoF, Fowler), Clean e Hexagonal, C4, ADRs e docs-as-code, decisões e trade-offs (overengineering), microsserviços ou monólito modular, estrutura dos times (Team Topologies), governança de API, estratégia técnica (dívida técnica, Tech Radar), o papel do arquiteto.
- **Vem de:** Arquitetura de Software de hoje e o papel do arquiteto, de Carreira; do site de notícias, Design & Padrões e Arq. Corporativa.
- **Posts (2):** CronJob ou endpoint + fila; Overhead vs overkill.
- **Cor:** verde-pátina (`#2d4b46`). A pátina que o cobre e o bronze ganham com o tempo nos prédios: a cor do que foi feito para durar.
- **Desenho:** arco e pedra angular. A pedra angular é a peça que segura o arco e não se tira depois: a decisão cara de desfazer.

### 02 · Backend

*O ofício dentro de cada serviço.*

- **Abrange:** Java, Spring e JVM, runtimes e frameworks web, modelos de concorrência (threads, virtual threads, reativo), performance (profiling, GC, JFR, p99), build (Gradle, Maven), serialização (Jackson), padrões do lado do servidor, outras linguagens e WebAssembly, quando aparecerem.
- **Vem de:** Desenvolvimento de Software de hoje, com o nome do site de notícias; de lá, Backend & Runtimes.
- **Posts (6):** AOP no Spring; AopUtils.getTargetClass(); AtomicBoolean; Gradle; Filtros de serialização no Jackson; Virtual threads no Java 21.
- **Cor:** tijolo (`#7a4430`). O vermelho do óxido de ferro (a argila queimada) e do zarcão, a primeira demão de toda peça de ferro da oficina.
- **Desenho:** paquímetro medindo uma peça. O instrumento de medir com precisão a peça que se fez: o ofício dentro de cada serviço.

### 03 · Dados

*Onde o dado mora e por onde ele anda.*

- **Abrange:** Bancos relacionais (PostgreSQL), bloqueio otimista e pessimista, isolamento e MVCC, NoSQL (MongoDB, DynamoDB), modelagem e índices, migração de esquema (Flyway, Liquibase), CDC (Debezium), streaming (Kafka Streams, Flink), lake, warehouse e lakehouse (Iceberg, dbt, DuckDB), contratos de dados e Data Mesh, busca vetorial (pgvector).
- **Vem de:** Dados de hoje; do site de notícias, Dados & Streaming.
- **Posts (2):** Bloqueio otimista e pessimista; Data lake vs data warehouse.
- **Cor:** ameixa (`#5f4662`). O roxo das cópias do mimeógrafo a álcool, que copiou fichas, listas e registros por décadas.
- **Desenho:** gaveta de fichas. A ficha é o registro e a gaveta é o índice; a ficha que volta é o dado que anda.

### 04 · IA

*Software feito com IA e software que usa IA.*

- **Abrange:** LLMs e modelos (Claude, GPT, Gemini, abertos), programar com IA (Claude Code, AI coding em produção), agentes e MCP, RAG, prompts e contexto, evals e observabilidade de LLM (Langfuse, LangSmith), guardrails e prompt injection, LLM local (Ollama), Bedrock e fine-tuning.
- **Vem de:** IA de hoje; do site de notícias, IA & LLMs e AIOps & Agents (e o Bedrock, de Cloud).
- **Posts (0):** nenhum ainda.
- **Cor:** vinho (`#6e2f45`). O vermelho do marroquim das encadernações finas; não há convenção que ligue a cor ao assunto.
- **Desenho:** autômato escritor. O Escritor de Jaquet-Droz (1774) é uma máquina que escreve e se programa: um LLM do século XVIII.

### 05 · Segurança

*Quem pode o quê e como provar.*

- **Abrange:** Identidade e acesso (OAuth 2.0, OIDC, JWT, passkeys e WebAuthn), Zero Trust, criptografia em repouso e em trânsito (TLS, KMS), segredos (Vault, AWS Secrets Manager), OWASP e CVEs, cadeia de suprimentos (SBOM, SLSA, Sigstore), runtime security e segurança de IA, conformidade (PCI DSS, LGPD).
- **Vem de:** Segurança de hoje; do site de notícias, Segurança & IAM e o PCI DSS de Fintech & Pagamentos.
- **Posts (2):** Criptografia em repouso e em trânsito; JWT.
- **Cor:** oliva (`#606a37`). O verde-oliva das fardas (no Brasil desde 1931): a cor de quem guarda.
- **Desenho:** carta lacrada e sinete. O sinete prova quem mandou e o lacre prova que ninguém abriu: identidade e prova.

### 06 · DevOps

*O caminho do commit até a produção.*

- **Abrange:** Containers e Kubernetes, CI/CD e GitOps, entrega progressiva, infraestrutura como código (Terraform), plataforma interna e Platform Engineering (IDP, Backstage), DevEx e DORA, nuvem (AWS, Azure, GCP: computação, rede, landing zones), CDN e edge, Well-Architected e FinOps.
- **Vem de:** DevOps de hoje; do site de notícias, DevOps & Plataformas, Cloud e a parte de Platform Engineering e DevEx de Arq. Corporativa.
- **Posts (2):** Kubernetes CronJob; SIGTERM e SIGKILL.
- **Cor:** azul-ardósia (`#465976`). O azul das camisas de trabalho que deu nome ao colarinho azul: a cor da operação, do cais.
- **Desenho:** guindaste de porto. O guindaste do porto empilha contêineres, do navio até o pátio.

### 07 · Observabilidade

*Descobrir o que aconteceu em produção.*

- **Abrange:** Logs estruturados, tracing (OpenTelemetry, W3C Trace Context), métricas e APM, wide events e cardinalidade, SLOs, SLIs e error budgets, alertas e ruído, incidentes e post-mortems, profiling contínuo e eBPF, custo de observabilidade.
- **Vem de:** SRE de hoje, com o nome do site de notícias (e o que tinha até a D30); de lá, Observabilidade & SRE.
- **Posts (3):** Logging estruturado em Spring Boot; W3C Trace Context; Wide events e canonical log lines.
- **Cor:** ocre (`#c4a050`). O ocre, dos pigmentos mais antigos, e o amarelo da cautela na sinalização.
- **Desenho:** farol. O farol fica aceso o tempo todo e avisa antes de o navio bater.

### 08 · Sistemas Distribuídos

*Quando o timeout não diz o que aconteceu.*

- **Abrange:** Idempotência e retry, escrita dupla, outbox e inbox, saga e compensação, CQRS e event sourcing, modelos de consistência, resiliência (timeout, circuit breaker, bulkhead, backpressure), cache distribuído, service mesh, execução durável (Temporal), multi-região e serverless.
- **Vem de:** Novo. A consistência de Arquitetura de Software; do site de notícias, Sist. Distribuídos.
- **Posts (2):** Chave de idempotência; Efeito externo sem registro local.
- **Cor:** azul-marinho (`#1c2c51`). O azul dos uniformes da Marinha britânica (1748); os relógios de pêndulo de Huygens nasceram para achar a longitude no mar, comparando a hora de bordo com a do porto.
- **Desenho:** dois relógios de pêndulo na mesma viga. Em 1665, Huygens viu que dois relógios pendurados na mesma viga acabavam balançando em sincronia, acertados só pelo que os ligava: cada máquina com o seu relógio e um meio comum entre elas.

### 09 · Integração e Eventos

*Como um sistema fala com o outro.*

- **Abrange:** Mensageria (SQS, SNS, Kafka, RabbitMQ), pub/sub e filtros de mensagem, arquitetura orientada a eventos, webhooks, DLQ e redrive, ordem e entrega pelo menos uma vez, design de API e API-First (REST, OpenAPI, GraphQL, gRPC), contratos e evolução de esquema (AsyncAPI, Schema Registry).
- **Vem de:** Novo. A mensageria de Arquitetura de Software; do site de notícias, Integração & Eventos.
- **Posts (1):** SNS MessageAttributes e Filter Policy.
- **Cor:** verde-água de isolador (`#72aba5`). O vidro dos isoladores das linhas de telégrafo e de telefone saía verde-água, pelo ferro da areia.
- **Desenho:** mesa telefônica manual, com jaques e cordões. A telefonista liga quem chama a quem atende: o roteamento e o contrato entre quem envia e quem recebe.

### 10 · Pagamentos

*Dinheiro não pode sumir nem dobrar.*

- **Abrange:** Ledger e partidas dobradas, saldo e conciliação, cartões e bandeiras (Visa, Mastercard, Elo), adquirência (autorização, captura, estorno, chargeback), Pix, Open Finance e Drex, cooperativas de crédito (Unicred, Sicoob, Sicredi), payment rails, fraude e risco, regras das bandeiras e do Banco Central, BaaS e embedded finance.
- **Vem de:** Novo. O ledger de Arquitetura de Software; do site de notícias, Fintech & Pagamentos.
- **Posts (1):** Arquitetura de ledger.
- **Cor:** verde-cédula (`#467866`). O verso verde das cédulas americanas desde 1861 e, por tradição dos fabricantes, o verde do papel de razão; um tom mais fundo que o da pesquisa, para a tinta clara ter mais contraste.
- **Desenho:** caixa registradora mecânica. Inventada em 1879 contra a fraude: registra cada venda, guarda o dinheiro e fecha o caixa no fim do dia, que é conciliação.

### 11 · Testes

*A prova de que o código faz o que deve.*

- **Abrange:** TDD e BDD, pirâmide de testes, JUnit e Testcontainers, testes de slice do Spring, contract testing (Pact), testes de carga e de performance (k6, Gatling), chaos engineering, dados de teste, testes com IA.
- **Vem de:** Novo. Os testes de Desenvolvimento de Software; do site de notícias, Testes & Qualidade.
- **Posts (0):** nenhum ainda.
- **Cor:** pedra de toque (`#383532`). A pedra preta em que se risca o ouro para conferir a pureza: "pedra de toque" é, ao pé da letra, o teste.
- **Desenho:** fio de prumo diante da parede. O prumo não mede, compara com uma referência que não falha; o fantasma é a vertical verdadeira ao lado da parede que saiu do prumo.

### 12 · Fundamentos

*O que todo framework esconde.*

- **Abrange:** Sistema operacional (processos, threads, sinais), redes (TCP, DNS, TLS), concorrência e modelo de memória, estruturas de dados e algoritmos, teoria das filas, desempenho do hardware (cache de CPU, memória).
- **Vem de:** Novo. O que hoje é item de Desenvolvimento de Software; do site de notícias, Fundamentos de Computação.
- **Posts (0):** nenhum ainda.
- **Cor:** cinza-pedra (`#a69d91`). Associação: o cinza da pedra; calculus, em latim, é a pedrinha de contar que deu nome ao cálculo.
- **Desenho:** ábaco. O instrumento de contar mais antigo ainda em uso: cada conta é um registro, e o cálculo acontece sem nenhuma camada por cima.

**O que muda:** Entram cinco livros novos, com os números depois dos de hoje: Sistemas Distribuídos (08), Integração e Eventos (09), Pagamentos (10), Testes (11) e Fundamentos (12). Sai Carreira: o papel do arquiteto vai para Arquitetura de Software, e /categories/Carreira/ leva para lá. Dois nomes trocados, reabrindo a D30: Desenvolvimento de Software → Backend e SRE → Observabilidade, com os redirecionamentos e os ajustes da sugestão 3. Quatro posts trocam de livro (os da sugestão 4) e nove só trocam o nome do livro. Três livros começam sem posts (IA, Testes e Fundamentos): o fundamento que já aparece no blog (o PID 1, o CLOSE_WAIT, a visibilidade entre threads) está dentro de posts que ensinam a ferramenta, em Backend e em DevOps.

Os 21 posts de categoria ficam distribuídos assim: Arquitetura de Software 2, Backend 6, Dados 2, IA 0, Segurança 2, DevOps 2, Observabilidade 3, Sistemas Distribuídos 2, Integração e Eventos 1, Pagamentos 1, Testes 0, Fundamentos 0.
