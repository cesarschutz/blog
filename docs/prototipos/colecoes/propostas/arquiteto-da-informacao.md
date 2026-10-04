# Coleção de livros: proposta do arquiteto da informação

Cinco estantes, de 8 a 12 livros, montadas a partir do agrupamento dos 21 posts de categoria nas 16
categorias do dev-note. O olhar é o da arquitetura da informação: cada post com uma casa óbvia, pouca
sobreposição, equilíbrio entre os livros (quantos posts cada um teria hoje e o que tende a crescer), a
palavra que o leitor digita e o custo de migrar. A série do Java fica fora de tudo.

Medidas usadas no documento:

- **Assunto principal** e **de passagem**: a categoria que o post ensina e as que ele só toca.
- **Setembro**: quantos dos 7 posts de setembro de 2026 (os mais recentes) caem no livro. É a medida
  do ritmo, do que tende a crescer.
- **Post de fronteira**: post que, naquela estante, teria dois livros plausíveis e depende de uma regra
  de desempate (seção 1.4). Quanto mais livros, mais fronteiras.
- Títulos e frases medidos com `scripts/livros/titulo-da-capa.mjs` (Bitter 800 e Newsreader itálico
  do projeto): todas as frases cabem em uma linha da capa; o corpo do título de cada livro novo ou
  renomeado vai no cabeçalho dele.

## 1. A matriz

### 1.1 Os 21 posts nas 16 categorias

| Post | Mês | Livro de hoje | Assunto principal no dev-note | Também toca |
|---|---|---|---|---|
| AOP no Spring | mai | Desenvolvimento de Software | Backend & Runtimes | Design & Padrões (proxy, aspecto) |
| AopUtils.getTargetClass() | mai | Desenvolvimento de Software | Backend & Runtimes | — |
| Arquitetura de ledger | mai | Arquitetura de Software | Fintech & Pagamentos | Dados & Streaming (append-only, saldo materializado), Sist. Distribuídos (idempotência, conciliação) |
| AtomicBoolean | mai | Desenvolvimento de Software | Backend & Runtimes | Fundamentos (visibilidade entre threads), DevOps & Plataformas (SIGTERM no pod) |
| Bloqueio otimista e pessimista | set | Dados | Dados & Streaming | Fundamentos (concorrência), Sist. Distribuídos (consistência), Backend (Spring Data JPA) |
| Chave de idempotência | set | Arquitetura de Software | Sist. Distribuídos | Fintech (cobrança), Integração (cabeçalho `Idempotency-Key`), Dados (restrição única) |
| Criptografia em repouso e em trânsito | set | Segurança | Segurança & IAM | Cloud (KMS, RDS, Atlas), Dados (Postgres, MongoDB) |
| CronJob ou endpoint + fila | set | Arquitetura de Software | nenhuma exata: é decisão (a mais perto, Sist. Distribuídos) | DevOps (CronJob), Integração (SQS), Cloud |
| Data lake vs data warehouse | mar | Dados | Dados & Streaming | Cloud (AWS) |
| Efeito externo sem registro local | set | Arquitetura de Software | Sist. Distribuídos | Fintech (adquirente), Integração (outbox e relay), Dados (CDC) |
| Gradle | mai | Desenvolvimento de Software | Backend & Runtimes | — |
| Filtros no Jackson | set | Desenvolvimento de Software | Backend & Runtimes | Segurança (dado sensível em log), Fintech (número do cartão, CVV), Observabilidade (log) |
| JWT | abr | Segurança | Segurança & IAM | Integração (autenticação de API) |
| Kubernetes CronJob | mai | DevOps | DevOps & Plataformas | Fundamentos (concorrência) |
| Logging estruturado | mai | SRE | Observabilidade & SRE | Backend (Spring Boot 3.4) |
| Overhead vs overkill | mai | Arquitetura de Software | nenhuma exata: é decisão (a mais perto, Design & Padrões) | Arq. Corporativa (estratégia técnica), Sist. Distribuídos (microsserviços) |
| SIGTERM e SIGKILL | mai | DevOps | DevOps & Plataformas | Fundamentos (sinais, PID 1), Backend (graceful shutdown) |
| SNS Filter Policy | mai | Arquitetura de Software | Integração & Eventos | Cloud (SNS, SQS) |
| Virtual threads | set | Desenvolvimento de Software | Backend & Runtimes | Fundamentos (CLOSE_WAIT do TCP), Sist. Distribuídos (bulkhead, circuit breaker), Observabilidade (thread dump, JFR) |
| W3C Trace Context | mai | SRE | Observabilidade & SRE | Integração (traceparent na mensagem), Sist. Distribuídos |
| Wide events | mai | SRE | Observabilidade & SRE | Backend (filtro no Spring Boot) |

### 1.2 As 16 categorias e o peso delas no blog

| Categoria | Principal | De passagem | Setembro | Peso | Por quê |
|---|---|---|---|---|---|
| Backend & Runtimes | 6 | 4 | 3 | forte | Java, Spring e JVM são o chão do blog (e da série do Java) |
| Observabilidade & SRE | 3 | 2 | 2 | forte | logs, tracing e wide events, sempre do lado de quem escreve o serviço |
| Sist. Distribuídos | 2 (+1 mais perto) | 5 | 5 | forte | idempotência, outbox e retry: o miolo dos posts mais recentes |
| Dados & Streaming | 2 | 4 | 4 | forte | a tag Banco de Dados está em 5 posts (trava, restrição única, outbox no Postgres) |
| Segurança & IAM | 2 | 1 | 2 | forte | criptografia e JWT; PCI DSS e dado sensível em log |
| DevOps & Plataformas | 2 | 2 | 1 | forte | Kubernetes pelo lado da aplicação; CI/CD, IaC e GitOps ainda sem nada |
| Fintech & Pagamentos | 1 | 3 | 3 | forte | é o domínio do autor: cenário de 4 posts, assunto de 1 (o ledger) |
| Integração & Eventos | 1 | 5 | 3 | forte | mensageria em 4 posts (SNS, SQS, outbox, traceparent na mensagem) |
| Fundamentos de Computação | 0 | 5 | 2 | médio | concorrência, TCP e sinais estão por baixo de 5 posts, nunca como assunto |
| Cloud | 0 | 4 | 2 | médio | a AWS é o palco (SNS, SQS, RDS, KMS, S3), nunca o assunto |
| Design & Padrões | 0 (+1 mais perto) | 1 | 0 | médio | só Overhead vs overkill chega perto; DDD e refatoração estão nos temas de hoje, sem post |
| AIOps & Agents | 0 | 0 | 0 | médio | nenhum post, mas IA está na frase do blog e o blog é feito com o Claude Code |
| Arq. Corporativa | 0 | 1 | 0 | fraco | só "estratégia técnica" encosta em Overhead vs overkill; FinOps, landing zones e Team Topologies, nada |
| Testes & Qualidade | 0 | 0 | 0 | fraco | o teste é o método do blog (código e SQL testados), ainda não é assunto |
| IA & LLMs | 0 | 0 | 0 | fraco | modelos e pesquisa; o que importar para quem usa vai para o livro de IA |
| Frontend & Web | 0 | 0 | 0 | fraco | nada publicado; o blog é de backend e arquitetura |

### 1.3 O que o agrupamento mostra

- **Peso.** Oito categorias são fortes no que o Cesar escreve, quatro são médias e quatro são fracas.
  As fortes são quase as oito casas de hoje, com uma diferença: Pagamentos e Integração aparecem com
  força e não têm livro; IA e Carreira têm livro e não têm post.
- **O dev-note não tem casa para decisão.** Overhead vs overkill e CronJob ou endpoint + fila
  comparam desenhos, e nenhuma das 16 serve de casa exata: o dev-note classifica notícia por
  tecnologia, e o blog também guarda estudo de decisão (a tag Trade-offs está em 5 posts). Por isso
  Arquitetura de Software, com "As decisões caras de desfazer.", continua nas cinco sugestões.
- **Arquitetura de Software é o livro menos previsível.** Junta 6 posts de 4 categorias: dois de
  sistemas distribuídos, dois de decisão, um de pagamento e um de mensageria.
- **Pagamentos é cenário de 4 posts e assunto de 1** (o ledger). Como o autor trabalha com
  pagamentos, quase todo post de técnica vai ter exemplo de cobrança; se o exemplo decidisse o livro,
  Pagamentos esvaziaria os outros. Daí a regra 1 (seção 1.4).
- **Os links mostram dois percursos que atravessam livros.** Consistência no banco: Bloqueio, Chave
  de idempotência, Efeito externo e Arquitetura de ledger (10 links entre eles). Batch no Kubernetes:
  Kubernetes CronJob, SIGTERM, AtomicBoolean e CronJob ou endpoint + fila (7 links). São sequências
  de leitura, não assuntos: ficam juntas pelos links e pelas tags (ou numa série, se o Cesar quiser),
  e o livro segue o assunto. O maior grupo que já coincide com um livro é o de observabilidade (SRE,
  6 links entre os três posts).
- **Concorrência (7 posts) e Trade-offs (5) atravessam tudo.** São facetas: bons índices, maus livros.
  Ficam como tags em todas as sugestões.
- **Ritmo.** Dos 7 posts de setembro, 5 tocam sistemas distribuídos, 4 tocam dados e 3 têm pagamento
  como cenário. DevOps, SRE e Integração não recebem post como assunto principal desde maio.

### 1.4 Regras para cada post ter uma casa só

1. **O livro é o que o post ensina; o exemplo vira tag.** Chave de idempotência ensina idempotência; a
   cobrança é o exemplo e fica na tag Pagamentos.
2. **Pagamentos fica com o que só existe porque há dinheiro:** ledger, conciliação, Pix, cartão,
   adquirência, regras das bandeiras e do Banco Central. O PCI DSS, que diz como proteger o dado,
   fica em Segurança.
3. **Ferramenta no título vai para o livro do ofício dela** (Jackson, Gradle e AtomicBoolean →
   Desenvolvimento de Software), a não ser que o assunto seja a produção (Logging estruturado → SRE).
4. **Comparação entre dois desenhos vai para Arquitetura de Software** (CronJob ou endpoint + fila,
   Overhead vs overkill), a não ser que os dois lados sejam do mesmo livro (Data lake vs data
   warehouse e Bloqueio otimista e pessimista ficam em Dados).
5. **Integração é o transporte e o contrato; a garantia quando algo falha é de Arquitetura de
   Software** (ou de Sistemas Distribuídos, onde ele existe). O filtro do SNS é transporte; o outbox
   é garantia.
6. **Fundamentos e Nuvem, onde existem, ficam só com o post cujo assunto é o fundamento ou o serviço
   em si**, não com o que os usa de palco.

Duas observações:

- **A regra do domínio, se o Cesar preferir a ela:** com "o que nasce de cobrança vai para
  Pagamentos", Chave de idempotência e Efeito externo vão para Pagamentos (que fica com 3 posts),
  Arquitetura de Software fica com 2 na S2 e na S3, e Sistemas Distribuídos começa vazio na S4 e na S5.
- **Livro e tag com o mesmo nome.** Pagamentos (S2 a S5) e Mensageria (S3) passam a nomear livro e
  tag, com contagens diferentes (o livro com 1, a tag com 4): a tag é o cenário, o livro é o assunto.
  Dá para conviver (as URLs são outras) ou dar ao livro um nome que não seja o da tag. "Meios de
  Pagamento" cabe na capa (duas linhas, 77px), mas deixa de fora o ledger e as cooperativas.

### 1.5 Como o leitor procura

| Título | O que o leitor costuma digitar | Faro do título |
|---|---|---|
| Arquitetura de Software | arquitetura de software, microsserviços, trade-off | bom |
| Desenvolvimento de Software | java, spring boot, jvm, backend | fraco: o título não diz Java nem backend |
| Backend (S3) | backend, java, spring boot | bom |
| Dados | banco de dados, postgres, lock otimista, data lake | médio: "banco de dados" é o termo, mas já é tag, e o livro cobre o data lake |
| Integração | mensageria, kafka, sqs, eventos, integração de sistemas | médio: o leitor digita "mensageria"; "integração" pode lembrar integração contínua |
| Mensageria (S3) | mensageria, filas, kafka, sqs | bom |
| Sistemas Distribuídos | sistemas distribuídos, idempotência, outbox, saga | bom |
| Pagamentos | pagamentos, pix, ledger, conciliação, meios de pagamento | bom |
| Segurança | criptografia, jwt, lgpd, owasp | bom |
| DevOps | kubernetes, k8s, devops, ci/cd | bom |
| SRE | observabilidade, logs, monitoramento, opentelemetry | fraco: SRE é cargo; o leitor digita observabilidade |
| Observabilidade (S3) | observabilidade, logs, tracing | bom |
| IA | ia, llm, agentes, claude code, mcp | bom |
| Fundamentos (S5) | concorrência, tcp, sistema operacional | médio: ninguém busca "fundamentos" |
| Nuvem (S5) | aws, cloud | fraco: o leitor digita AWS ou cloud, quase nunca nuvem |
| Carreira | carreira, arquiteto de software | médio |

Quem chega pela busca cai no post, não no livro: o título do livro trabalha no topo do post e na
estante, como faro de onde se está. Por isso, em todas as sugestões, o termo que o leitor digita entra
no "abrange" (lock otimista, mensageria, Pix, observabilidade, Spring Boot), que é o texto da página
do livro, e só a S3 troca títulos por ele. A coluna do meio é o vocabulário corrente das vagas, dos
cursos e dos fóruns brasileiros; não há medição de volume.

## 2. As cinco sugestões

**Ordem dos volumes.** A S1 mantém a de hoje. Nas outras, os livros de hoje mantêm a ordem entre si e
cada livro novo entra ao lado do parente: Sistemas Distribuídos e Integração depois de Arquitetura de
Software, Fundamentos depois de Desenvolvimento, Pagamentos depois de Dados e Nuvem antes de DevOps. Os
números mudam, mas é cosmético (a capa e a posição na estante).

Livro novo custa um desenho, um ícone, uma cor e as fotos; livro que sai ou muda de nome custa um
redirecionamento em `NOMES_ANTIGOS`. Em todas as sugestões, as frases de hoje ficam como estão.

---

### S1 · Os oito de hoje (8 livros)

**Lógica.** Nenhum livro muda de nome nem sai, e nenhum post troca de lugar: as 16 categorias do
dev-note entram como itens do "abrange" do livro mais próximo. É a régua de custo zero para medir as
outras.

**01 · Arquitetura de Software** — *As decisões caras de desfazer.*
- **Abrange:** Decisões e trade-offs (ADRs, débito técnico, overengineering), microsserviços e monólito
  modular, DDD e bounded contexts, Clean e Hexagonal, C4, consistência entre serviços (idempotência,
  outbox, saga, CQRS, event sourcing), resiliência (retry, circuit breaker, bulkhead), mensageria e
  eventos (SQS, SNS, Kafka, AsyncAPI), design e governança de API (REST, OpenAPI, GraphQL), sistemas de
  pagamento (ledger, conciliação, Pix, cartões).
- **Vem de:** Arquitetura de Software; dev-note: Sist. Distribuídos, Integração & Eventos, Design &
  Padrões (DDD, Clean, C4, ADRs), Fintech & Pagamentos (menos o PCI DSS), Arq. Corporativa (estratégia
  técnica, governança de API).
- **Posts (6 · setembro: 3):** Arquitetura de ledger, Chave de idempotência, CronJob ou endpoint + fila,
  Efeito externo sem registro local, Overhead vs overkill, SNS Filter Policy.

**02 · Desenvolvimento de Software** — *O ofício dentro de cada serviço.*
- **Abrange:** Java, Spring e JVM, frameworks e runtimes, concorrência (threads, virtual threads, modelo
  de memória), performance (JFR, GC, p99), build (Gradle, Maven), serialização (Jackson), testes
  (JUnit, Testcontainers, Pact), refatoração e padrões de código, o que roda por baixo (TCP, sinais,
  sistema operacional), web e front-end (Astro, Core Web Vitals).
- **Vem de:** Desenvolvimento de Software; dev-note: Backend & Runtimes, Testes & Qualidade (menos
  chaos engineering), Fundamentos de Computação, Frontend & Web, Design & Padrões (GoF, refatoração).
- **Posts (6 · setembro: 2):** AOP no Spring, AopUtils.getTargetClass(), AtomicBoolean, Gradle, Filtros
  no Jackson, Virtual threads.

**03 · Dados** — *Onde o dado mora e por onde ele anda.*
- **Abrange:** Bancos relacionais (PostgreSQL), travas e isolamento (lock otimista e pessimista), NoSQL
  (MongoDB, DynamoDB), modelagem, CDC (Debezium), streaming de dados (Kafka Streams, Flink), data lake,
  warehouse e lakehouse (Iceberg, dbt, DuckDB), contratos de dados e Data Mesh, busca vetorial
  (pgvector).
- **Vem de:** Dados; dev-note: Dados & Streaming.
- **Posts (2 · setembro: 1):** Bloqueio otimista e pessimista, Data lake vs data warehouse.

**04 · IA** — *Software feito com IA e software que usa IA.*
- **Abrange:** LLMs (Claude, GPT, Gemini, modelos abertos), programação com IA (Claude Code), agentes e
  MCP, RAG, prompts e contexto, avaliação e observabilidade de LLM (evals, Langfuse, LangSmith),
  guardrails e prompt injection, LLM local (Ollama).
- **Vem de:** IA; dev-note: AIOps & Agents, IA & LLMs (pelo lado de quem usa), AI Security (de
  Segurança & IAM), AI-augmented SDLC (de DevOps & Plataformas).
- **Posts (0):** nenhum; está na frase do blog ("lançamento do Java, código, arquitetura, IA").

**05 · Segurança** — *Quem pode o quê e como provar.*
- **Abrange:** Identidade e acesso (OAuth 2.0, OIDC, JWT, passkeys), criptografia (em repouso, em
  trânsito, KMS, TLS), segredos (Vault, AWS Secrets Manager), OWASP e CVEs, cadeia de suprimentos
  (SBOM, SLSA, Sigstore), Zero Trust, dado sensível em log, LGPD e PCI DSS.
- **Vem de:** Segurança; dev-note: Segurança & IAM (menos AI Security), PCI DSS (de Fintech &
  Pagamentos).
- **Posts (2 · setembro: 1):** Criptografia em repouso e em trânsito, JWT.

**06 · DevOps** — *O caminho do commit até a produção.*
- **Abrange:** Containers e Kubernetes (Jobs, CronJobs, ciclo de vida do pod), CI/CD (GitHub Actions),
  GitOps (Argo CD), infraestrutura como código (Terraform), nuvem AWS (computação, rede, landing
  zones), entrega progressiva (canary, feature flags), plataforma interna (IDP, Backstage), DORA e
  DevEx, FinOps.
- **Vem de:** DevOps; dev-note: DevOps & Plataformas, Cloud, Arq. Corporativa (Platform Engineering,
  DORA, FinOps, landing zones).
- **Posts (2 · setembro: 0):** Kubernetes CronJob, SIGTERM e SIGKILL.

**07 · SRE** — *O que mantém a produção de pé.*
- **Abrange:** Logs estruturados, tracing (OpenTelemetry, W3C Trace Context), métricas, wide events,
  SLOs e error budgets, alertas, incidentes e post-mortems, profiling contínuo e eBPF, custo de
  observabilidade, chaos engineering.
- **Vem de:** SRE; dev-note: Observabilidade & SRE, chaos engineering (de Testes & Qualidade).
- **Posts (3 · setembro: 0):** Logging estruturado, W3C Trace Context, Wide events.

**08 · Carreira** — *O lado humano de construir software.*
- **Abrange:** O papel do arquiteto, times e Team Topologies, decisões em grupo (RFCs), liderança
  técnica, estudo e escrita técnica.
- **Vem de:** Carreira; dev-note: Arq. Corporativa (estrutura organizacional).
- **Posts (0):** nenhum, e nada nos posts aponta para cá.

**Custo.** Nenhum livro muda de nome ou sai; nenhum post troca de livro; nenhum redirecionamento. Muda
só o texto ("temas" vira "abrange") no `livros.json`.
**O que fica pior.** Arquitetura de Software guarda três categorias fortes (Sist. Distribuídos,
Integração, Fintech) e continua o livro menos previsível: o filtro do SNS, um recurso da AWS, mora em
"as decisões caras de desfazer". Pagamentos, o que mais identifica o autor, não aparece na estante.
Dois livros vazios. Posts de fronteira: 5 (Arquitetura de ledger, CronJob ou endpoint + fila, SNS Filter
Policy, AtomicBoolean, Filtros no Jackson).

---

### S2 · O que os posts pedem (9 livros)

**Lógica.** Um livro para cada assunto que já tem post como tema principal, mais IA, que está na frase
do blog. Entram as duas categorias fortes que a estante não tem (Integração e Pagamentos); sai
Carreira, sem post e sem par no dev-note.

**01 · Arquitetura de Software** — *As decisões caras de desfazer.*
- **Abrange:** Decisões e trade-offs (ADRs, débito técnico, overengineering), microsserviços e monólito
  modular, DDD e bounded contexts, Clean e Hexagonal, C4 e docs-as-code, consistência entre serviços
  (idempotência, outbox, saga, CQRS, event sourcing), resiliência (timeout, retry, circuit breaker,
  bulkhead), cache, o papel do arquiteto e o time (Team Topologies).
- **Vem de:** Arquitetura de Software (menos o ledger e o SNS) e o papel do arquiteto, de Carreira;
  dev-note: Sist. Distribuídos, Design & Padrões (DDD, Clean, C4, ADRs), Arq. Corporativa (estratégia
  técnica, estrutura organizacional).
- **Posts (4 · setembro: 3):** Chave de idempotência, CronJob ou endpoint + fila, Efeito externo sem
  registro local, Overhead vs overkill.

**02 · Integração** (novo; capa a 81px) — *Como um sistema fala com o outro.*
- **Abrange:** Mensageria (SQS, SNS, Kafka, RabbitMQ), pub/sub e filtros de mensagem, arquitetura
  orientada a eventos, webhooks, DLQ e redrive, design de API (REST, OpenAPI, GraphQL, gRPC), contratos
  e evolução de esquema (AsyncAPI, Schema Registry), governança de API.
- **Vem de:** Arquitetura de Software (o SNS e o tema "eventos"); dev-note: Integração & Eventos (menos
  o MCP, que fica em IA), Arq. Corporativa (governança de API).
- **Posts (1 · setembro: 0, mas a mensageria passa por 3 dos 7):** SNS Filter Policy.

**03 · Desenvolvimento de Software** — *O ofício dentro de cada serviço.*
- **Abrange:** Java, Spring e JVM, frameworks e runtimes, concorrência (threads, virtual threads, modelo
  de memória), performance (JFR, GC, p99), build (Gradle, Maven), serialização (Jackson), testes
  (JUnit, Testcontainers, Pact), refatoração e padrões de código, o que roda por baixo (TCP, sinais,
  sistema operacional).
- **Vem de:** Desenvolvimento de Software; dev-note: Backend & Runtimes, Testes & Qualidade (menos chaos
  engineering), Design & Padrões (GoF, refatoração), Fundamentos de Computação.
- **Posts (6 · setembro: 2):** AOP no Spring, AopUtils.getTargetClass(), AtomicBoolean, Gradle, Filtros
  no Jackson, Virtual threads.

**04 · Dados** — *Onde o dado mora e por onde ele anda.*
- **Abrange:** Bancos relacionais (PostgreSQL), travas e isolamento (lock otimista e pessimista), NoSQL
  (MongoDB, DynamoDB), modelagem, CDC (Debezium), streaming de dados (Kafka Streams, Flink), data lake,
  warehouse e lakehouse (Iceberg, dbt, DuckDB), contratos de dados e Data Mesh, busca vetorial
  (pgvector).
- **Vem de:** Dados; dev-note: Dados & Streaming.
- **Posts (2 · setembro: 1):** Bloqueio otimista e pessimista, Data lake vs data warehouse.

**05 · Pagamentos** (novo; capa a 70px) — *O dinheiro que entra, sai e precisa bater.*
- **Abrange:** Ledger e partidas dobradas, saldo e conciliação, adquirência e captura, cartões e
  bandeiras (Visa, Mastercard, Elo), Pix, Open Finance e Drex, cooperativas de crédito (Sicoob, Sicredi,
  Unicred), fraude e risco, BaaS e embedded finance, regras do Banco Central e das bandeiras.
- **Vem de:** Arquitetura de Software (o ledger); dev-note: Fintech & Pagamentos (o PCI DSS fica em
  Segurança).
- **Posts (1 · setembro: 0, mas é o cenário de 3 dos 7):** Arquitetura de ledger.

**06 · IA** — *Software feito com IA e software que usa IA.*
- **Abrange:** LLMs (Claude, GPT, Gemini, modelos abertos), programação com IA (Claude Code), agentes e
  MCP, RAG, prompts e contexto, avaliação e observabilidade de LLM (evals, Langfuse, LangSmith),
  guardrails e prompt injection, LLM local (Ollama).
- **Vem de:** IA; dev-note: AIOps & Agents, IA & LLMs (pelo lado de quem usa), AI Security (de
  Segurança & IAM), AI-augmented SDLC (de DevOps & Plataformas).
- **Posts (0):** nenhum; está na frase do blog.

**07 · Segurança** — *Quem pode o quê e como provar.*
- **Abrange:** Identidade e acesso (OAuth 2.0, OIDC, JWT, passkeys), criptografia (em repouso, em
  trânsito, KMS, TLS), segredos (Vault, AWS Secrets Manager), OWASP e CVEs, cadeia de suprimentos
  (SBOM, SLSA, Sigstore), Zero Trust, dado sensível em log, LGPD e PCI DSS.
- **Vem de:** Segurança; dev-note: Segurança & IAM (menos AI Security), PCI DSS (de Fintech &
  Pagamentos).
- **Posts (2 · setembro: 1):** Criptografia em repouso e em trânsito, JWT.

**08 · DevOps** — *O caminho do commit até a produção.*
- **Abrange:** Containers e Kubernetes (Jobs, CronJobs, ciclo de vida do pod), CI/CD (GitHub Actions),
  GitOps (Argo CD), infraestrutura como código (Terraform), nuvem AWS (computação, rede, landing
  zones), entrega progressiva (canary, feature flags), plataforma interna (IDP, Backstage), DORA e
  DevEx, FinOps.
- **Vem de:** DevOps; dev-note: DevOps & Plataformas, Cloud, Arq. Corporativa (Platform Engineering,
  DORA, FinOps, landing zones).
- **Posts (2 · setembro: 0):** Kubernetes CronJob, SIGTERM e SIGKILL.

**09 · SRE** — *O que mantém a produção de pé.*
- **Abrange:** Logs estruturados, tracing (OpenTelemetry, W3C Trace Context), métricas, wide events,
  SLOs e error budgets, alertas, incidentes e post-mortems, profiling contínuo e eBPF, custo de
  observabilidade, chaos engineering.
- **Vem de:** SRE; dev-note: Observabilidade & SRE, chaos engineering (de Testes & Qualidade).
- **Posts (3 · setembro: 0):** Logging estruturado, W3C Trace Context, Wide events.

**Sem casa.** Front-end (se aparecer, vai para Desenvolvimento de Software) e o resto de Carreira
(estudo, escrita, liderança): se aparecer um texto assim, Carreira volta com o desenho e a cor que já
tem.
**Custo.** Carreira sai (sem posts): `/categories/Carreira/` redireciona para Arquitetura de Software,
que fica com o papel do arquiteto (se Carreira voltar, o redirecionamento sai). Integração e Pagamentos
entram. Dois posts trocam de livro: SNS Filter Policy (para Integração) e Arquitetura de ledger (para
Pagamentos). Um redirecionamento novo; nenhum nome muda. Seis livros mudam de número de volume. A tag
Pagamentos (4 posts) passa a ter o nome de um livro (1 post). Posts de fronteira: 7 (Arquitetura de
ledger, Chave de idempotência, Efeito externo, CronJob ou endpoint + fila, SNS Filter Policy,
AtomicBoolean, Filtros no Jackson), todos resolvidos pelas regras 1 a 5.

---

### S3 · O nome que o leitor digita (10 livros)

**Lógica.** O título é a palavra que o desenvolvedor brasileiro digita na busca. Onde o nome de hoje
não é essa palavra, ele muda (Desenvolvimento de Software vira Backend, SRE vira Observabilidade; Dados
fica, porque "banco de dados" já é tag e o livro também cobre o data lake), entram Mensageria e
Pagamentos, e nada sai.

**01 · Arquitetura de Software** — *As decisões caras de desfazer.*
- **Abrange:** Decisões e trade-offs (ADRs, débito técnico, overengineering), microsserviços e monólito
  modular, DDD e bounded contexts, Clean e Hexagonal, C4 e docs-as-code, consistência entre serviços
  (idempotência, outbox, saga, CQRS, event sourcing), resiliência (timeout, retry, circuit breaker,
  bulkhead), cache.
- **Vem de:** Arquitetura de Software (menos o ledger e o SNS); dev-note: Sist. Distribuídos, Design &
  Padrões (DDD, Clean, C4, ADRs), Arq. Corporativa (estratégia técnica).
- **Posts (4 · setembro: 3):** Chave de idempotência, CronJob ou endpoint + fila, Efeito externo sem
  registro local, Overhead vs overkill.

**02 · Mensageria** (novo; capa a 74px) — *Como um sistema fala com o outro.*
- **Abrange:** Filas e tópicos (SQS, SNS, Kafka, RabbitMQ), pub/sub e filtros de mensagem, arquitetura
  orientada a eventos, webhooks, entrega pelo menos uma vez, DLQ e redrive, ordem e partições,
  contratos de mensagem (AsyncAPI, Schema Registry).
- **Vem de:** Arquitetura de Software (o SNS e o tema "eventos"); dev-note: Integração & Eventos (a
  parte assíncrona; o design de API vai para Backend).
- **Posts (1 · setembro: 0):** SNS Filter Policy.

**03 · Backend** (hoje Desenvolvimento de Software; capa a 101px, hoje 50px) — *O ofício dentro de
cada serviço.*
- **Abrange:** Java, Spring e JVM, frameworks e runtimes, design de API (REST, OpenAPI, GraphQL, gRPC),
  concorrência (threads, virtual threads, modelo de memória), performance (JFR, GC, p99), build
  (Gradle, Maven), serialização (Jackson), testes (JUnit, Testcontainers, Pact), refatoração e padrões
  de código, o que roda por baixo (TCP, sinais, sistema operacional).
- **Vem de:** Desenvolvimento de Software (renomeado); dev-note: Backend & Runtimes, Integração &
  Eventos (design e governança de API), Testes & Qualidade (menos chaos engineering), Design & Padrões
  (GoF, refatoração), Fundamentos de Computação.
- **Posts (6 · setembro: 2):** AOP no Spring, AopUtils.getTargetClass(), AtomicBoolean, Gradle, Filtros
  no Jackson, Virtual threads.

**04 · Dados** — *Onde o dado mora e por onde ele anda.*
- **Abrange:** Bancos relacionais (PostgreSQL), travas e isolamento (lock otimista e pessimista), NoSQL
  (MongoDB, DynamoDB), modelagem, CDC (Debezium), streaming de dados (Kafka Streams, Flink), data lake,
  warehouse e lakehouse (Iceberg, dbt, DuckDB), contratos de dados e Data Mesh, busca vetorial
  (pgvector).
- **Vem de:** Dados; dev-note: Dados & Streaming.
- **Posts (2 · setembro: 1):** Bloqueio otimista e pessimista, Data lake vs data warehouse.

**05 · Pagamentos** (novo; capa a 70px) — *O dinheiro que entra, sai e precisa bater.*
- **Abrange:** Ledger e partidas dobradas, saldo e conciliação, adquirência e captura, cartões e
  bandeiras (Visa, Mastercard, Elo), Pix, Open Finance e Drex, cooperativas de crédito (Sicoob, Sicredi,
  Unicred), fraude e risco, BaaS e embedded finance, regras do Banco Central e das bandeiras.
- **Vem de:** Arquitetura de Software (o ledger); dev-note: Fintech & Pagamentos (o PCI DSS fica em
  Segurança).
- **Posts (1 · setembro: 0, mas é o cenário de 3 dos 7):** Arquitetura de ledger.

**06 · IA** — *Software feito com IA e software que usa IA.*
- **Abrange:** LLMs (Claude, GPT, Gemini, modelos abertos), programação com IA (Claude Code), agentes e
  MCP, RAG, prompts e contexto, avaliação e observabilidade de LLM (evals, Langfuse, LangSmith),
  guardrails e prompt injection, LLM local (Ollama).
- **Vem de:** IA; dev-note: AIOps & Agents, IA & LLMs (pelo lado de quem usa), AI Security (de
  Segurança & IAM), AI-augmented SDLC (de DevOps & Plataformas).
- **Posts (0):** nenhum; está na frase do blog.

**07 · Segurança** — *Quem pode o quê e como provar.*
- **Abrange:** Identidade e acesso (OAuth 2.0, OIDC, JWT, passkeys), criptografia (em repouso, em
  trânsito, KMS, TLS), segredos (Vault, AWS Secrets Manager), OWASP e CVEs, cadeia de suprimentos
  (SBOM, SLSA, Sigstore), Zero Trust, dado sensível em log, LGPD e PCI DSS.
- **Vem de:** Segurança; dev-note: Segurança & IAM (menos AI Security), PCI DSS (de Fintech &
  Pagamentos).
- **Posts (2 · setembro: 1):** Criptografia em repouso e em trânsito, JWT.

**08 · DevOps** — *O caminho do commit até a produção.*
- **Abrange:** Containers e Kubernetes (Jobs, CronJobs, ciclo de vida do pod), CI/CD (GitHub Actions),
  GitOps (Argo CD), infraestrutura como código (Terraform), nuvem AWS (computação, rede, landing
  zones), entrega progressiva (canary, feature flags), plataforma interna (IDP, Backstage), DORA e
  DevEx, FinOps.
- **Vem de:** DevOps; dev-note: DevOps & Plataformas, Cloud, Arq. Corporativa (Platform Engineering,
  DORA, FinOps, landing zones).
- **Posts (2 · setembro: 0):** Kubernetes CronJob, SIGTERM e SIGKILL.

**09 · Observabilidade** (hoje SRE; capa a 53px, hoje 108px) — *O que mantém a produção de pé.*
- **Abrange:** Logs estruturados, tracing (OpenTelemetry, W3C Trace Context), métricas e monitoramento,
  wide events, alertas, SLOs e error budgets, incidentes e post-mortems, profiling contínuo e eBPF,
  custo de observabilidade, chaos engineering.
- **Vem de:** SRE (renomeado; volta ao nome de antes da D30); dev-note: Observabilidade & SRE, chaos
  engineering (de Testes & Qualidade).
- **Posts (3 · setembro: 0):** Logging estruturado, W3C Trace Context, Wide events.

**10 · Carreira** — *O lado humano de construir software.*
- **Abrange:** O papel do arquiteto, times e Team Topologies, decisões em grupo (RFCs), liderança
  técnica, estudo e escrita técnica.
- **Vem de:** Carreira; dev-note: Arq. Corporativa (estrutura organizacional).
- **Posts (0):** nenhum.

**Sem casa.** Front-end: Backend não serve para ele; se aparecer, pede livro próprio.
**Custo.** Dois livros mudam de nome (Desenvolvimento de Software → Backend; SRE → Observabilidade),
com dois redirecionamentos novos e dois ajustes nos antigos: `/categories/Java/` passa a apontar direto
para Backend (sem cadeia), e o `Observabilidade → SRE` da D30 sai, porque a URL volta a ser a página do
livro (se ficasse, bateria com ela). Desenhos e cores ficam; mudam os slugs (arquivos do desenho, do
ícone e das fotos), e os endereços `?livro=desenvolvimento-de-software` e `?livro=sre` deixam de filtrar
(a lista abre inteira, D54). Nada sai. Mensageria e Pagamentos entram. Dois posts trocam de livro (SNS
Filter Policy, Arquitetura de ledger) e onze têm o `category` reescrito (os seis de Backend e os três
de Observabilidade, só pelo nome). Sete livros mudam de número. Mensageria e Pagamentos passam a nomear
livro e tag com contagens diferentes (1 e 4 nos dois casos). Posts de fronteira: 7, os mesmos da S2.

---

### S4 · A arquitetura em três (11 livros)

**Lógica.** O livro que mais mistura e mais recebe post, Arquitetura de Software, se abre em três: as
decisões, as garantias quando algo falha (Sistemas Distribuídos) e a conversa entre sistemas
(Integração). Pagamentos entra; nada sai e nada muda de nome.

**01 · Arquitetura de Software** — *As decisões caras de desfazer.*
- **Abrange:** Decisões e trade-offs (ADRs, débito técnico, overengineering), microsserviços e monólito
  modular, DDD e bounded contexts, Clean e Hexagonal, padrões de arquitetura, C4 e docs-as-code,
  atributos de qualidade (custo, latência, disponibilidade), Tech Radar.
- **Vem de:** Arquitetura de Software (as decisões); dev-note: Design & Padrões, Arq. Corporativa
  (estratégia técnica).
- **Posts (2 · setembro: 1):** CronJob ou endpoint + fila, Overhead vs overkill.

**02 · Sistemas Distribuídos** (novo; capa a 70px, duas linhas) — *Quando o timeout não diz o que
aconteceu.*
- **Abrange:** Idempotência e retry, escrita dupla, outbox e inbox, saga e compensação, CQRS e event
  sourcing, modelos de consistência, resiliência (timeout, circuit breaker, bulkhead), cache
  distribuído, execução durável (Temporal), multi-região.
- **Vem de:** Arquitetura de Software (a consistência); dev-note: Sist. Distribuídos.
- **Posts (2 · setembro: 2):** Chave de idempotência, Efeito externo sem registro local.

**03 · Integração** (novo; capa a 81px) — *Como um sistema fala com o outro.*
- **Abrange:** Mensageria (SQS, SNS, Kafka, RabbitMQ), pub/sub e filtros de mensagem, arquitetura
  orientada a eventos, webhooks, DLQ e redrive, design de API (REST, OpenAPI, GraphQL, gRPC), contratos
  e evolução de esquema (AsyncAPI, Schema Registry), governança de API.
- **Vem de:** Arquitetura de Software (o SNS e o tema "eventos"); dev-note: Integração & Eventos (menos
  o MCP, que fica em IA), Arq. Corporativa (governança de API).
- **Posts (1 · setembro: 0):** SNS Filter Policy.

**04 · Desenvolvimento de Software** — *O ofício dentro de cada serviço.*
- **Abrange:** Java, Spring e JVM, frameworks e runtimes, concorrência (threads, virtual threads, modelo
  de memória), performance (JFR, GC, p99), build (Gradle, Maven), serialização (Jackson), testes
  (JUnit, Testcontainers, Pact), refatoração e padrões de código, o que roda por baixo (TCP, sinais,
  sistema operacional).
- **Vem de:** Desenvolvimento de Software; dev-note: Backend & Runtimes, Testes & Qualidade (menos chaos
  engineering), Design & Padrões (GoF, refatoração), Fundamentos de Computação.
- **Posts (6 · setembro: 2):** AOP no Spring, AopUtils.getTargetClass(), AtomicBoolean, Gradle, Filtros
  no Jackson, Virtual threads.

**05 · Dados** — *Onde o dado mora e por onde ele anda.*
- **Abrange:** Bancos relacionais (PostgreSQL), travas e isolamento (lock otimista e pessimista), NoSQL
  (MongoDB, DynamoDB), modelagem, CDC (Debezium), streaming de dados (Kafka Streams, Flink), data lake,
  warehouse e lakehouse (Iceberg, dbt, DuckDB), contratos de dados e Data Mesh, busca vetorial
  (pgvector).
- **Vem de:** Dados; dev-note: Dados & Streaming.
- **Posts (2 · setembro: 1):** Bloqueio otimista e pessimista, Data lake vs data warehouse.

**06 · Pagamentos** (novo; capa a 70px) — *O dinheiro que entra, sai e precisa bater.*
- **Abrange:** Ledger e partidas dobradas, saldo e conciliação, adquirência e captura, cartões e
  bandeiras (Visa, Mastercard, Elo), Pix, Open Finance e Drex, cooperativas de crédito (Sicoob, Sicredi,
  Unicred), fraude e risco, BaaS e embedded finance, regras do Banco Central e das bandeiras.
- **Vem de:** Arquitetura de Software (o ledger); dev-note: Fintech & Pagamentos (o PCI DSS fica em
  Segurança).
- **Posts (1 · setembro: 0):** Arquitetura de ledger.

**07 · IA** — *Software feito com IA e software que usa IA.*
- **Abrange:** LLMs (Claude, GPT, Gemini, modelos abertos), programação com IA (Claude Code), agentes e
  MCP, RAG, prompts e contexto, avaliação e observabilidade de LLM (evals, Langfuse, LangSmith),
  guardrails e prompt injection, LLM local (Ollama).
- **Vem de:** IA; dev-note: AIOps & Agents, IA & LLMs (pelo lado de quem usa), AI Security (de
  Segurança & IAM), AI-augmented SDLC (de DevOps & Plataformas).
- **Posts (0):** nenhum; está na frase do blog.

**08 · Segurança** — *Quem pode o quê e como provar.*
- **Abrange:** Identidade e acesso (OAuth 2.0, OIDC, JWT, passkeys), criptografia (em repouso, em
  trânsito, KMS, TLS), segredos (Vault, AWS Secrets Manager), OWASP e CVEs, cadeia de suprimentos
  (SBOM, SLSA, Sigstore), Zero Trust, dado sensível em log, LGPD e PCI DSS.
- **Vem de:** Segurança; dev-note: Segurança & IAM (menos AI Security), PCI DSS (de Fintech &
  Pagamentos).
- **Posts (2 · setembro: 1):** Criptografia em repouso e em trânsito, JWT.

**09 · DevOps** — *O caminho do commit até a produção.*
- **Abrange:** Containers e Kubernetes (Jobs, CronJobs, ciclo de vida do pod), CI/CD (GitHub Actions),
  GitOps (Argo CD), infraestrutura como código (Terraform), nuvem AWS (computação, rede, landing
  zones), entrega progressiva (canary, feature flags), plataforma interna (IDP, Backstage), DORA e
  DevEx, FinOps.
- **Vem de:** DevOps; dev-note: DevOps & Plataformas, Cloud, Arq. Corporativa (Platform Engineering,
  DORA, FinOps, landing zones).
- **Posts (2 · setembro: 0):** Kubernetes CronJob, SIGTERM e SIGKILL.

**10 · SRE** — *O que mantém a produção de pé.*
- **Abrange:** Logs estruturados, tracing (OpenTelemetry, W3C Trace Context), métricas, wide events,
  SLOs e error budgets, alertas, incidentes e post-mortems, profiling contínuo e eBPF, custo de
  observabilidade, chaos engineering.
- **Vem de:** SRE; dev-note: Observabilidade & SRE, chaos engineering (de Testes & Qualidade).
- **Posts (3 · setembro: 0):** Logging estruturado, W3C Trace Context, Wide events.

**11 · Carreira** — *O lado humano de construir software.*
- **Abrange:** O papel do arquiteto, times e Team Topologies, decisões em grupo (RFCs), liderança
  técnica, estudo e escrita técnica.
- **Vem de:** Carreira; dev-note: Arq. Corporativa (estrutura organizacional).
- **Posts (0):** nenhum.

**Custo.** Nada muda de nome, nada sai, nenhum redirecionamento. Sistemas Distribuídos, Integração e
Pagamentos entram. Quatro posts trocam de livro: Chave de idempotência e Efeito externo sem registro
local (para Sistemas Distribuídos), SNS Filter Policy (para Integração) e Arquitetura de ledger (para
Pagamentos). Sete livros mudam de número. Arquitetura de Software, o volume 01, cai de 6 posts para 2.
A fronteira entre os três (decidir, garantir, transportar) pede a regra 5 em quase todo post novo de
arquitetura: posts de fronteira, 9 (os 7 da S2, mais Virtual threads e Overhead vs overkill, que tocam
Sistemas Distribuídos).

---

### S5 · Espelho do dev-note (12 livros)

**Lógica.** Uma estante paralela ao site de notícias: cada categoria do dev-note que é forte ou média
no que o Cesar escreve vira livro (as duas de IA viram uma), e as quatro fracas viram itens de outro
livro. Carreira sai, por não ter par no dev-note nem post.

**01 · Arquitetura de Software** — *As decisões caras de desfazer.*
- **Abrange:** Decisões e trade-offs (ADRs, débito técnico, overengineering), microsserviços e monólito
  modular, DDD e bounded contexts, Clean e Hexagonal, padrões de arquitetura, C4 e docs-as-code, Tech
  Radar, o papel do arquiteto e o time (Team Topologies).
- **Vem de:** Arquitetura de Software (as decisões) e o papel do arquiteto, de Carreira; dev-note:
  Design & Padrões, Arq. Corporativa (estratégia técnica, estrutura organizacional).
- **Posts (2 · setembro: 1):** CronJob ou endpoint + fila, Overhead vs overkill.

**02 · Sistemas Distribuídos** (novo; capa a 70px, duas linhas) — *Quando o timeout não diz o que
aconteceu.*
- **Abrange:** Idempotência e retry, escrita dupla, outbox e inbox, saga e compensação, CQRS e event
  sourcing, modelos de consistência, resiliência (timeout, circuit breaker, bulkhead), cache
  distribuído, execução durável (Temporal), multi-região.
- **Vem de:** Arquitetura de Software (a consistência); dev-note: Sist. Distribuídos.
- **Posts (2 · setembro: 2):** Chave de idempotência, Efeito externo sem registro local.

**03 · Integração** (novo; capa a 81px) — *Como um sistema fala com o outro.*
- **Abrange:** Mensageria (SQS, SNS, Kafka, RabbitMQ), pub/sub e filtros de mensagem, arquitetura
  orientada a eventos, webhooks, DLQ e redrive, design de API (REST, OpenAPI, GraphQL, gRPC), contratos
  e evolução de esquema (AsyncAPI, Schema Registry), governança de API.
- **Vem de:** Arquitetura de Software (o SNS e o tema "eventos"); dev-note: Integração & Eventos (menos
  o MCP, que fica em IA), Arq. Corporativa (governança de API).
- **Posts (1 · setembro: 0):** SNS Filter Policy.

**04 · Desenvolvimento de Software** — *O ofício dentro de cada serviço.*
- **Abrange:** Java, Spring e JVM, frameworks e runtimes, virtual threads e concorrência na JVM,
  performance (JFR, GC, p99), build (Gradle, Maven), serialização (Jackson), testes (JUnit,
  Testcontainers, Pact), refatoração e padrões de código, web e front-end (Astro, Core Web Vitals).
- **Vem de:** Desenvolvimento de Software; dev-note: Backend & Runtimes, Testes & Qualidade (menos chaos
  engineering), Frontend & Web, Design & Padrões (GoF, refatoração).
- **Posts (6 · setembro: 2):** AOP no Spring, AopUtils.getTargetClass(), AtomicBoolean, Gradle, Filtros
  no Jackson, Virtual threads.

**05 · Fundamentos** (novo; capa a 63px) — *O que todo framework esconde.*
- **Abrange:** Concorrência e modelo de memória (visibilidade, happens-before), threads e escalonamento,
  processos e sinais (SIGTERM, PID 1), redes (TCP e estados da conexão, DNS, TLS), estruturas de dados
  e algoritmos, teoria das filas, desempenho de hardware (cache de CPU, memória).
- **Vem de:** nenhum livro (era item de Desenvolvimento de Software); dev-note: Fundamentos de
  Computação.
- **Posts (0):** AtomicBoolean, Virtual threads e SIGTERM e SIGKILL encostam, mas ensinam a ferramenta,
  não o fundamento (regras 3 e 6). É livro de aposta.

**06 · Dados** — *Onde o dado mora e por onde ele anda.*
- **Abrange:** Bancos relacionais (PostgreSQL), travas e isolamento (lock otimista e pessimista), NoSQL
  (MongoDB, DynamoDB), modelagem, CDC (Debezium), streaming de dados (Kafka Streams, Flink), data lake,
  warehouse e lakehouse (Iceberg, dbt, DuckDB), contratos de dados e Data Mesh, busca vetorial
  (pgvector).
- **Vem de:** Dados; dev-note: Dados & Streaming.
- **Posts (2 · setembro: 1):** Bloqueio otimista e pessimista, Data lake vs data warehouse.

**07 · Pagamentos** (novo; capa a 70px) — *O dinheiro que entra, sai e precisa bater.*
- **Abrange:** Ledger e partidas dobradas, saldo e conciliação, adquirência e captura, cartões e
  bandeiras (Visa, Mastercard, Elo), Pix, Open Finance e Drex, cooperativas de crédito (Sicoob, Sicredi,
  Unicred), fraude e risco, BaaS e embedded finance, regras do Banco Central e das bandeiras.
- **Vem de:** Arquitetura de Software (o ledger); dev-note: Fintech & Pagamentos (o PCI DSS fica em
  Segurança).
- **Posts (1 · setembro: 0):** Arquitetura de ledger.

**08 · IA** — *Software feito com IA e software que usa IA.*
- **Abrange:** LLMs (Claude, GPT, Gemini, modelos abertos), programação com IA (Claude Code), agentes e
  MCP, RAG, prompts e contexto, avaliação e observabilidade de LLM (evals, Langfuse, LangSmith),
  guardrails e prompt injection, LLM local (Ollama).
- **Vem de:** IA; dev-note: AIOps & Agents, IA & LLMs (pelo lado de quem usa), AI Security (de
  Segurança & IAM), AI-augmented SDLC (de DevOps & Plataformas).
- **Posts (0):** nenhum; está na frase do blog.

**09 · Segurança** — *Quem pode o quê e como provar.*
- **Abrange:** Identidade e acesso (OAuth 2.0, OIDC, JWT, passkeys), criptografia (em repouso, em
  trânsito, KMS, TLS), segredos (Vault, AWS Secrets Manager), OWASP e CVEs, cadeia de suprimentos
  (SBOM, SLSA, Sigstore), Zero Trust, dado sensível em log, LGPD e PCI DSS.
- **Vem de:** Segurança; dev-note: Segurança & IAM (menos AI Security), PCI DSS (de Fintech &
  Pagamentos).
- **Posts (2 · setembro: 1):** Criptografia em repouso e em trânsito, JWT.

**10 · Nuvem** (novo; capa a 108px) — *O que se aluga e quanto custa.*
- **Abrange:** AWS, Azure e GCP, computação (EC2, ECS, Lambda), rede (VPC, peering, PrivateLink),
  armazenamento e bancos gerenciados (S3, RDS, Aurora), CDN e edge (CloudFront, Cloudflare), contas e
  landing zones, Well-Architected, FinOps.
- **Vem de:** DevOps (o tema "nuvem"); dev-note: Cloud, Arq. Corporativa (FinOps, landing zones).
- **Posts (0):** o SNS Filter Policy encosta, mas ensina filtro de mensagem (Integração, regra 6). É
  livro de aposta.

**11 · DevOps** — *O caminho do commit até a produção.*
- **Abrange:** Containers e Kubernetes (Jobs, CronJobs, ciclo de vida do pod), CI/CD (GitHub Actions),
  GitOps (Argo CD), infraestrutura como código (Terraform), entrega progressiva (canary, feature
  flags), plataforma interna (IDP, Backstage), DORA e DevEx.
- **Vem de:** DevOps (menos a nuvem); dev-note: DevOps & Plataformas, Arq. Corporativa (Platform
  Engineering, DORA).
- **Posts (2 · setembro: 0):** Kubernetes CronJob, SIGTERM e SIGKILL.

**12 · SRE** — *O que mantém a produção de pé.*
- **Abrange:** Logs estruturados, tracing (OpenTelemetry, W3C Trace Context), métricas, wide events,
  SLOs e error budgets, alertas, incidentes e post-mortems, profiling contínuo e eBPF, custo de
  observabilidade, chaos engineering.
- **Vem de:** SRE; dev-note: Observabilidade & SRE, chaos engineering (de Testes & Qualidade).
- **Posts (3 · setembro: 0):** Logging estruturado, W3C Trace Context, Wide events.

**Sem casa.** Estudo e escrita técnica (o resto de Carreira).
**Custo.** Nada muda de nome. Carreira sai (`/categories/Carreira/` redireciona para Arquitetura de
Software). Cinco livros entram: Sistemas Distribuídos, Integração, Fundamentos, Pagamentos e Nuvem.
Quatro posts trocam de livro (os mesmos da S4). Um redirecionamento novo. Seis livros mudam de número.
São 12 livros para 21 posts: três começam vazios (Fundamentos, IA, Nuvem) e dois com um post. Nuvem
cruza com Integração, DevOps, Segurança e Dados (a AWS está em todos) e Fundamentos com
Desenvolvimento: posts de fronteira, 13 (os 9 da S4, mais Bloqueio, SIGTERM, Criptografia e Data lake).

---

### Quadro comparativo

| | S1 | S2 | S3 | S4 | S5 |
|---|---|---|---|---|---|
| Livros | 8 | 9 | 10 | 11 | 12 |
| Posts por livro, do maior ao menor | 6 6 3 2 2 2 0 0 | 6 4 3 2 2 2 1 1 0 | 6 4 3 2 2 2 1 1 0 0 | 6 3 2 2 2 2 2 1 1 0 0 | 6 3 2 2 2 2 2 1 1 0 0 0 |
| Livros vazios | 2 | 1 | 2 | 2 | 3 |
| Categorias fortes no mesmo livro (no máximo) | 3 | 1 | 1 | 1 | 1 |
| Posts de fronteira | 5 | 7 | 7 | 9 | 13 |
| Livros de hoje que mudam de nome | 0 | 0 | 2 | 0 | 0 |
| Livros de hoje que saem | 0 | 1 (Carreira) | 0 | 0 | 1 (Carreira) |
| Livros novos | 0 | 2 | 2 | 3 | 5 |
| Posts que trocam de livro | 0 | 2 | 2 | 4 | 4 |
| Posts com o `category` reescrito | 0 | 2 | 11 | 4 | 4 |
| Redirecionamentos novos | 0 | 1 | 2 (e 2 ajustes) | 0 | 1 |
| Livros de hoje que mudam de número | 0 | 6 | 7 | 7 | 6 |

A S1 tem menos fronteiras porque um livro faz o papel de gaveta de tudo; a partir da S2, cada livro a
mais acrescenta fronteira, e as regras da seção 1.4 passam a decidir mais casos.

## 3. Recomendação: S2

Recomendo a **S2, O que os posts pedem (9 livros)**:

- É a mais barata entre as que resolvem o problema de hoje: Arquitetura de Software junta três
  categorias fortes e seis posts que não se parecem. Na S2, nenhum livro guarda mais de uma categoria
  forte, e só IA começa vazio, porque está na frase do blog.
- Põe na estante o que mais identifica o autor e hoje some dentro de Arquitetura (Pagamentos) e a
  mensageria, que passa por quatro posts sem ter casa (Integração), sem trocar nome nenhum: sai um
  livro vazio, dois posts mudam de lugar, entra um redirecionamento.
- Fica em "um pouco mais de 8" e cresce sem desfazer nada: quando Arquitetura de Software passar de uns
  10 posts, com 4 ou mais de consistência (o ritmo de setembro aponta para isso), Sistemas Distribuídos
  sai dele e a estante vira a S4; se a AWS virar assunto, e não palco, Nuvem sai de DevOps.

Dois ajustes independentes, se o Cesar quiser: manter Carreira (10 livros, custo zero, porque o livro
já existe) se houver texto de carreira ou de estudo na fila; e, da S3, a única troca de nome que paga o
custo, SRE → Observabilidade (os três posts são de observabilidade, e o farol continua servindo).
