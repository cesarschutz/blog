# Coleções: a proposta do editor

Olhar de editor de uma coleção de livros técnicos: cada livro precisa ser um volume que o leitor tira
da estante sabendo o que vai encontrar, com título que caiba na lombada, uma frase na capa e um
instrumento de ofício no desenho. Cinco sugestões, de 8 a 12 livros, cada uma com uma ideia própria.

## A leitura

O blog é o caderno de estudo de um arquiteto que constrói sistemas de pagamento em Java e Spring,
rodando em Kubernetes na AWS. Os 21 posts de categoria são quase todos sobre um mecanismo específico,
com código testado e um critério de uso: proxies do Spring, bloqueio no Postgres, SIGTERM no pod,
filter policy do SNS, chave de idempotência na cobrança. O que ele vai escrever segue o mesmo
trabalho: mais pagamentos (Pix, PCI DSS, cartões), mais mensageria e consistência (outbox, SQS,
saga), mais JVM e Spring, Kubernetes e AWS, observabilidade, segurança e dados; e IA, que ele usa
todo dia e ainda não escreveu. O site de notícias acompanha o mercado inteiro; o blog cobre o que
passa pela mão dele. Isso pede uma coleção pequena, com volumes que o leitor reconheça pelo título
(o que ele digitou na busca), cada post com uma casa só, e lugar para os dois assuntos que hoje não
têm livro com o nome deles: pagamentos e integração por mensagens. Os livros vazios de hoje (IA e
Carreira) existem porque o Cesar quer escrever neles; mantenho os dois onde a ideia da sugestão
permite.

## O que vale para as cinco

- A numeração dos volumes é só a posição em `livros.json`: reordenar não custa nada, com uma exceção.
  A marca "cs" é a capa do Volume 01, na cor fixa `#2D4B46` de Arquitetura de Software
  (`src/styles/tokens.ts`, `marca`). Quando o Volume 01 muda de livro (sugestões 4 e 5), ou a marca
  é regerada com a cor nova (`scripts/marca.mjs`) ou a regra passa a ser "a capa de Arquitetura".
  É uma decisão do Cesar.
- Livro que muda só de nome e continua com o mesmo assunto mantém o desenho, a cor e, quando digo,
  a frase (regra do controle). Livro novo ganha desenho e cor novos; deixo uma ideia de instrumento
  para cada um, só como ponto de partida.
- Posts que podiam ficar em dois lugares, e a regra que usei em todas as sugestões: o Jackson que
  mascara o cartão fica com a técnica (o livro de código), não com o domínio; o logging estruturado
  em Spring Boot e o W3C Trace Context ficam com os logs, não com o framework nem com os
  microsserviços; o bloqueio otimista fica em Dados, como na D30.
- Frontend & Web, do site de notícias, não vira livro em nenhuma sugestão: o blog não escreve sobre
  isso. Um post sobre a construção do próprio blog (Astro, Pagefind) vai para IA, se for sobre fazer
  com IA, ou para o livro de código. Se virar assunto recorrente, aí sim é um volume novo.
- A série "Atualizações do Java" fica fora, como revista.
- Frases novas, todas com menos de 45 caracteres: cabem numa linha da capa.

## Sugestão 1 · Mesma estante, fichas novas (8 livros)

A ideia: os oito livros estão certos; o que faltava era a ficha de cada um dizendo o que cabe nele.
As 16 categorias do site de notícias entram nos oito sem mexer em nada. É a sugestão de custo zero,
e serve de base para medir as outras.

**01 · Arquitetura de Software** — *As decisões caras de desfazer.*
- Abrange: microsserviços e monolito, DDD e bounded contexts, Clean e Hexagonal, C4 e ADRs,
  consistência (saga, CQRS, event sourcing, outbox e inbox, idempotência), resiliência (retry,
  circuit breaker, bulkhead), EDA e mensageria (SNS e SQS, Kafka), API design (OpenAPI, AsyncAPI),
  trade-offs e overengineering, dívida técnica, ledger e conciliação.
- Vem de: Arquitetura de Software de hoje; do site de notícias, Sist. Distribuídos, Design e Padrões,
  Integração e Eventos, Arq. Corporativa (governança e estratégia técnica) e Fintech e Pagamentos.
- Posts (6): Arquitetura de ledger, Chave de idempotência, CronJob ou endpoint + fila, Efeito externo
  sem registro local, Overhead vs overkill, SNS Filter Policy.

**02 · Desenvolvimento de Software** — *O ofício dentro de cada serviço.*
- Abrange: Java e JVM (memory model, GC, JFR, thread dump), concorrência (virtual threads, atomics,
  executors), Spring (Boot, AOP, Data JPA, Jackson), Gradle e Maven, testes (JUnit, Testcontainers,
  contract testing), refatoração, performance (profiling, p99).
- Vem de: Desenvolvimento de Software de hoje; do site de notícias, Backend e Runtimes, Testes e
  Qualidade e a parte de concorrência e memory models de Fundamentos de Computação.
- Posts (6): AOP no Spring, AopUtils.getTargetClass(), AtomicBoolean, Gradle, Filtros do Jackson,
  Virtual threads.

**03 · Dados** — *Onde o dado mora e por onde ele anda.*
- Abrange: PostgreSQL e MongoDB, bloqueios e isolamento, modelagem, índices e planos, migração de
  esquema (Flyway, Liquibase), CDC (Debezium), streaming (Kafka, Flink), lake, warehouse e lakehouse
  (Iceberg, dbt), pgvector, data contracts.
- Vem de: Dados de hoje; do site de notícias, Dados e Streaming.
- Posts (2): Bloqueio otimista e pessimista, Data lake vs data warehouse.

**04 · IA** — *Software feito com IA e software que usa IA.*
- Abrange: LLMs e modelos fundacionais, agentes e MCP, RAG e vector DBs, prompts e contexto, AI
  coding (Claude Code, Copilot) e o SDLC com IA, evals e observabilidade de LLM (Langfuse),
  guardrails, LLM local (Ollama), Bedrock.
- Vem de: IA de hoje; do site de notícias, IA e LLMs e AIOps e Agents.
- Posts: nenhum.

**05 · Segurança** — *Quem pode o quê e como provar.*
- Abrange: criptografia em repouso e em trânsito (TLS, KMS), JWT, OAuth2 e OIDC, Zero Trust,
  passkeys e WebAuthn, segredos (Vault, Secrets Manager), OWASP e CVEs, supply chain (SBOM, SLSA,
  Sigstore), PCI DSS e LGPD.
- Vem de: Segurança de hoje; do site de notícias, Segurança e IAM, mais o PCI DSS de Fintech e
  Pagamentos.
- Posts (2): Criptografia em repouso e em trânsito, JWT.

**06 · DevOps** — *O caminho do commit até a produção.*
- Abrange: containers e imagens, Kubernetes (pods, Jobs e CronJobs, probes, HPA), Helm, CI/CD
  (GitHub Actions), GitOps (Argo CD), IaC (Terraform), AWS (EKS, RDS, SQS, SNS, IAM), VPC e rede,
  Well-Architected, FinOps.
- Vem de: DevOps de hoje; do site de notícias, DevOps e Plataformas e Cloud.
- Posts (2): Kubernetes CronJob, SIGTERM e SIGKILL.

**07 · SRE** — *O que mantém a produção de pé.*
- Abrange: logs estruturados, tracing (OpenTelemetry, W3C Trace Context), métricas (Micrometer,
  Prometheus), wide events e cardinalidade, SLO, SLI e error budget, alertas, incidentes e
  post-mortems, profiling (JFR, eBPF).
- Vem de: SRE de hoje; do site de notícias, Observabilidade e SRE, mais os post-mortems de Sist.
  Distribuídos.
- Posts (3): Logging estruturado em Spring Boot, W3C Trace Context, Wide events.

**08 · Carreira** — *O lado humano de construir software.*
- Abrange: o papel do arquiteto, o estudo e o caderno, times e Team Topologies, DevEx (DORA,
  SPACE), platform engineering como organização, comunicação técnica (docs-as-code, o ADR como
  conversa).
- Vem de: Carreira de hoje; do site de notícias, a parte de estrutura organizacional de Arq.
  Corporativa.
- Posts: nenhum.

**Custo:** nenhum livro muda de nome, nenhum sai, nenhum post troca de livro. O que fica mal
resolvido: Arquitetura de Software vira o livro de tudo (6 posts e cinco categorias do site de
notícias dentro dele), e "pagamentos", o assunto mais próprio do Cesar, não tem livro com esse nome.

## Sugestão 2 · O livro de Pagamentos (9 livros)

A ideia: falta um livro só na estante, o do domínio. Três dos seis posts de Arquitetura de Software
são sobre dinheiro (ledger, cobrança duplicada, cobrança que passou sem registro), e é o assunto com
mais futuro certo: Pix, PCI DSS, cartões, conciliação. O resto fica como está.

**01 · Arquitetura de Software** — *As decisões caras de desfazer.*
- Abrange: microsserviços e monolito, DDD e bounded contexts, Clean e Hexagonal, C4 e ADRs,
  consistência (saga, CQRS, event sourcing, outbox e inbox), resiliência (retry, circuit breaker,
  bulkhead), EDA e mensageria (SNS e SQS, Kafka), API design (OpenAPI, AsyncAPI), trade-offs e
  overengineering, dívida técnica.
- Vem de: Arquitetura de Software de hoje, sem a parte de pagamentos; do site de notícias, Sist.
  Distribuídos, Design e Padrões, Integração e Eventos e Arq. Corporativa (governança e estratégia).
- Posts (3): CronJob ou endpoint + fila, Overhead vs overkill, SNS Filter Policy.

**02 · Desenvolvimento de Software** — *O ofício dentro de cada serviço.*
- Abrange, vem de e posts (6): como na sugestão 1.

**03 · Dados** — *Onde o dado mora e por onde ele anda.*
- Abrange, vem de e posts (2): como na sugestão 1.

**04 · Pagamentos** — *Dinheiro não pode sumir nem dobrar.*
- Abrange: ledger e partidas dobradas, saldos e conciliação, idempotência na cobrança, efeito
  externo e outbox na cobrança, cartões e adquirência (autorização, captura, estorno, chargeback),
  Pix, Open Finance e DREX, PCI DSS (mascarar PAN, CVV fora do log), antifraude e risco, BaaS e
  cooperativas.
- Vem de: a parte de pagamentos de Arquitetura de Software; do site de notícias, Fintech e
  Pagamentos, mais o outbox e a idempotência de Sist. Distribuídos quando o assunto é dinheiro.
- Posts (3): Arquitetura de ledger, Chave de idempotência, Efeito externo sem registro local.
- Desenho (ideia): máquina de somar de manivela.

**05 · IA** (nenhum post), **06 · Segurança** (2), **07 · DevOps** (2), **08 · SRE** (3) e
**09 · Carreira** (nenhum): como na sugestão 1 (frase, abrange, origem e posts iguais; em Segurança,
o PCI DSS passa para Pagamentos).

**Regra de encaixe:** se o post é sobre cobrança, saldo ou cartão, é Pagamentos; a técnica genérica
fica onde está (o Jackson no Desenvolvimento, o outbox genérico na Arquitetura).

**Custo:** um livro novo (desenho e cor novos); três posts trocam de livro; nenhum livro muda de nome
nem sai. Pagamentos entra como Volume 04, depois de Dados, e os outros descem um número (só dado).

## Sugestão 3 · A estante do arquiteto (10 livros)

A ideia: a estante de quem faz sistemas de pagamento em Java na AWS, com cada frente do trabalho num
volume e o título dizendo o que está dentro. Além de Pagamentos, ganha livro a integração por
mensagens, que hoje aparece dentro de posts de outros livros (outbox em dois posts de pagamentos,
SNS, CronJob contra fila). Três livros trocam o nome genérico pelo nome do que o Cesar escreve.

**01 · Arquitetura de Software** — *As decisões caras de desfazer.*
- Abrange: trade-offs e overengineering, microsserviços e monolito, DDD e bounded contexts, Clean e
  Hexagonal, C4 e ADRs, consistência (saga, CQRS, event sourcing), resiliência (retry, circuit
  breaker, bulkhead), caching, dívida técnica e tech radar, governança de APIs, FinOps.
- Vem de: Arquitetura de Software de hoje, sem pagamentos e sem mensageria; do site de notícias,
  Design e Padrões, Sist. Distribuídos (menos outbox, inbox e messaging) e Arq. Corporativa
  (governança e estratégia).
- Posts (2): CronJob ou endpoint + fila, Overhead vs overkill.

**02 · Pagamentos** — *Dinheiro não pode sumir nem dobrar.*
- Abrange, vem de, posts (3) e desenho: como na sugestão 2.

**03 · Integração e Eventos** — *O contrato entre quem envia e quem recebe.*
- Abrange: SNS e SQS (filter policy, DLQ, visibilidade), Kafka, outbox e inbox, idempotência no
  consumidor, EDA, AsyncAPI, API design e API-First (OpenAPI, versionamento), GraphQL, evolução de
  esquema (Avro, compatibilidade), webhooks, MCP como integração.
- Vem de: a mensageria de Arquitetura de Software de hoje; do site de notícias, Integração e Eventos
  e o outbox e inbox de Sist. Distribuídos.
- Posts (1): SNS Filter Policy.
- Desenho (ideia): manipulador de telégrafo.

**04 · Java e Spring** — *O ofício dentro de cada serviço.*
- Abrange: JVM (memory model, GC, JFR, thread dump), concorrência (virtual threads, atomics,
  executors), Spring Boot, AOP e proxies, Spring Data JPA, Jackson, Gradle e Maven, testes (JUnit,
  Testcontainers), refatoração, performance (profiling, p99).
- Vem de: Desenvolvimento de Software de hoje, com o nome do que há dentro; do site de notícias,
  Backend e Runtimes, Testes e Qualidade e a concorrência de Fundamentos de Computação.
- Posts (6): AOP no Spring, AopUtils.getTargetClass(), AtomicBoolean, Gradle, Filtros do Jackson,
  Virtual threads.
- Desenho e cor: os de hoje (paquímetro, tijolo); o assunto é o mesmo.

**05 · Dados** — *Onde o dado mora e por onde ele anda.*
- Abrange, vem de e posts (2): como na sugestão 1.

**06 · Kubernetes e AWS** — *O chão onde o serviço roda.*
- Abrange: pods, Deployments, Jobs e CronJobs, probes e ciclo de vida (SIGTERM, preStop),
  requests, limits e HPA, Helm, EKS, RDS, SQS e SNS como infraestrutura, IAM e IRSA, KMS, VPC, CI/CD
  (GitHub Actions), GitOps (Argo CD), IaC (Terraform), Well-Architected, custo.
- Vem de: DevOps de hoje, com o nome do que há dentro; do site de notícias, DevOps e Plataformas e
  Cloud.
- Posts (2): Kubernetes CronJob, SIGTERM e SIGKILL.
- Desenho e cor: os de hoje (guindaste de porto, azul-ardósia): o guindaste descarrega containers.

**07 · Observabilidade** — *Descobrir o que aconteceu em produção.*
- Abrange: logs estruturados (Logback, ECS), wide events e cardinalidade, tracing (OpenTelemetry,
  W3C Trace Context), métricas (Micrometer, Prometheus), APM, SLO, SLI e error budget, alertas e
  ruído, incidentes e post-mortems, profiling (JFR, eBPF), custo de observabilidade.
- Vem de: SRE de hoje, com o nome do que há dentro; do site de notícias, Observabilidade e SRE.
- Posts (3): Logging estruturado em Spring Boot, W3C Trace Context, Wide events.
- Desenho e cor: os de hoje (farol, ocre).

**08 · Segurança** — *Quem pode o quê e como provar.*
- Abrange, vem de e posts (2): como na sugestão 1, sem o PCI DSS (vai para Pagamentos).

**09 · IA** — *Software feito com IA e software que usa IA.*
- Abrange, vem de e posts: como na sugestão 1.

**10 · Carreira** — *O lado humano de construir software.*
- Abrange, vem de e posts: como na sugestão 1.

**Regra de encaixe:** título com cobrança, saldo ou cartão é Pagamentos; o mecanismo (outbox, SNS,
AsyncAPI) é Integração e Eventos; a escolha entre dois desenhos é Arquitetura de Software; o recurso
do Kubernetes ou da AWS em si é Kubernetes e AWS. O ponto fraco é a palavra "idempotência", que
aparece em Pagamentos (o post) e em Integração (o conceito); a regra resolve, mas é bom saber.

**Custo:** dois livros novos (Pagamentos e Integração e Eventos, com desenho e cor novos); três
livros mudam de nome e mantêm desenho, cor e frase ou ganham frase nova (Desenvolvimento de
Software → Java e Spring, DevOps → Kubernetes e AWS, SRE → Observabilidade), com redirecionamento
das URLs antigas; quatro posts trocam de livro (três para Pagamentos, o SNS para Integração) e os
onze dos livros renomeados trocam só a string da categoria. Integração e Eventos começa com um post.
"Kubernetes e AWS" tem 16 caracteres, no limite de uma linha da lombada; "Observabilidade" é a
palavra mais longa da coleção e fica do tamanho de "Desenvolvimento" na capa.

## Sugestão 4 · Do metal à nuvem (11 livros)

A ideia: a ordem da estante é a ordem do estudo, de baixo para cima. Cada volume é uma camada do
sistema: o que o computador faz, a linguagem e a máquina dela, o framework, o dado, o que acontece
entre máquinas, o cluster, a nuvem, o que se vê de fora, o que protege, e, no alto, as decisões.
Não há livro de domínio: o ledger vai para a camada do dado, a idempotência para a camada da rede.
Carreira entra em Arquitetura, como o papel do arquiteto.

**01 · Fundamentos** — *O que não muda quando a ferramenta muda.*
- Abrange: processos e sinais (SIGTERM, PID 1), sockets e estados do TCP (CLOSE_WAIT, TIME_WAIT),
  DNS e HTTP, memória e memory models (volatile, happens-before), threads, locks e teoria de filas,
  estruturas de dados e algoritmos, latência e p99 no hardware.
- Vem de: nenhum livro de hoje; do site de notícias, Fundamentos de Computação.
- Posts: nenhum (o que há de fundamento hoje está dentro de posts de Java e de Kubernetes).
- Desenho (ideia): régua de cálculo.

**02 · Java e JVM** — *A linguagem e a máquina que a roda.*
- Abrange: a linguagem (records, sealed, pattern matching, generics), JVM (GC, JIT, memória, JFR,
  thread dump), concorrência (virtual threads, atomics, executors, structured concurrency), Gradle
  e Maven, JUnit, performance (profiling, p99), GraalVM.
- Vem de: metade de Desenvolvimento de Software; do site de notícias, Backend e Runtimes (runtimes,
  concurrency models, build tools, performance engineering).
- Posts (3): AtomicBoolean, Gradle, Virtual threads.
- Desenho e cor: os de hoje (paquímetro, tijolo), por ser a metade maior; Spring ganha desenho novo.

**03 · Spring** — *O que o framework faz sem você ver.*
- Abrange: Spring Boot (autoconfiguração, starters, Actuator), AOP e proxies (JDK, CGLIB), Spring
  Data JPA, Jackson e serialização, Spring Security, Spring Cloud AWS, testes de Spring (slices,
  Testcontainers), refatoração em serviços Spring.
- Vem de: a outra metade de Desenvolvimento de Software; do site de notícias, web frameworks e
  server-side patterns de Backend e Runtimes, e Testes e Qualidade.
- Posts (3): AOP no Spring, AopUtils.getTargetClass(), Filtros do Jackson.
- Desenho (ideia): mecanismo de relógio aberto.

**04 · Dados** — *Onde o dado mora e por onde ele anda.*
- Abrange: PostgreSQL e MongoDB, bloqueios e isolamento, modelagem (inclusive ledger: append-only,
  partidas dobradas, saldos materializados), índices e planos, migração de esquema, CDC (Debezium),
  streaming (Kafka, Flink), lake, warehouse e lakehouse (Iceberg, dbt), pgvector, data contracts.
- Vem de: Dados de hoje e o ledger de Arquitetura de Software; do site de notícias, Dados e Streaming.
- Posts (3): Arquitetura de ledger, Bloqueio otimista e pessimista, Data lake vs data warehouse.

**05 · Sistemas Distribuídos** — *Correto mesmo quando a rede falha.*
- Abrange: consistência (saga, CQRS, event sourcing, 2PC), outbox e inbox, idempotência e retries,
  mensageria e EDA (os padrões, não o serviço), resiliência (timeout, circuit breaker, bulkhead,
  backpressure), caching, durable execution, multi-region, consenso, relógios e ordenação.
- Vem de: parte de Arquitetura de Software; do site de notícias, Sist. Distribuídos e a parte de EDA
  e messaging de Integração e Eventos.
- Posts (2): Chave de idempotência, Efeito externo sem registro local.
- Desenho (ideia): relógio de estação.

**06 · Kubernetes** — *A vida de um pod, da subida ao término.*
- Abrange: pods e Deployments, Jobs e CronJobs, probes, ciclo de vida (SIGTERM, grace period,
  preStop), requests, limits e HPA, ConfigMaps e Secrets, Helm e Kustomize, RBAC, Services e rede,
  GitOps (Argo CD), progressive delivery.
- Vem de: DevOps de hoje, estreitado; do site de notícias, DevOps e Plataformas (containers, CNCF,
  GitOps).
- Posts (2): Kubernetes CronJob, SIGTERM e SIGKILL.
- Desenho e cor: os de hoje (guindaste de porto, azul-ardósia).

**07 · Nuvem** — *O que a nuvem faz por você e o que não faz.*
- Abrange: AWS (SNS, SQS, RDS, KMS, EKS, Lambda, S3, IAM), rede (VPC, peering), CDN e edge,
  Well-Architected, FinOps, IaC (Terraform), serverless, Bedrock como serviço; Azure e GCP quando
  aparecerem.
- Vem de: o SNS de Arquitetura de Software; do site de notícias, Cloud e a IaC de DevOps e
  Plataformas.
- Posts (1): SNS Filter Policy.
- Desenho (ideia): barômetro.

**08 · Observabilidade** — *Descobrir o que aconteceu em produção.*
- Abrange, vem de, posts (3) e desenho: como na sugestão 3.

**09 · Segurança** — *Quem pode o quê e como provar.*
- Abrange, vem de e posts (2): como na sugestão 1 (com o PCI DSS).

**10 · Arquitetura** — *As decisões caras de desfazer.*
- Abrange: trade-offs e overengineering, microsserviços e monolito, DDD e bounded contexts, Clean e
  Hexagonal, C4 e ADRs, docs-as-code, dívida técnica e tech radar, API design e governança, Team
  Topologies, platform engineering, DevEx (DORA, SPACE), o papel do arquiteto.
- Vem de: Arquitetura de Software de hoje (nome curto) e Carreira; do site de notícias, Design e
  Padrões, Arq. Corporativa e o API design de Integração e Eventos.
- Posts (2): CronJob ou endpoint + fila, Overhead vs overkill.
- Desenho e cor: os de hoje (arco e pedra angular, verde-pátina).

**11 · IA** — *Software feito com IA e software que usa IA.*
- Abrange, vem de e posts: como na sugestão 1.

**Regra de encaixe:** o livro é a camada onde o mecanismo vive. Um recurso de um serviço gerenciado
da AWS é Nuvem; o padrão (outbox, idempotência) é Sistemas Distribuídos; o assunto vence o
framework (o logging em Spring Boot é Observabilidade; o bloqueio com Spring Data é Dados).

**Custo:** o mais alto das cinco até aqui. Quatro livros novos com desenho e cor (Fundamentos,
Spring, Sistemas Distribuídos, Nuvem); Desenvolvimento de Software se parte em dois; três mudam de
nome (Arquitetura de Software → Arquitetura, DevOps → Kubernetes, SRE → Observabilidade), com
redirecionamento; Carreira sai (a URL redireciona para Arquitetura); Pagamentos não tem livro. Dois
livros começam vazios (Fundamentos e IA) e um começa com um post (Nuvem): 21 posts em 11 livros é
pouco por livro, e a ideia aposta no que vem. O Volume 01 passa a ser Fundamentos, e a marca "cs"
(capa do Volume 01) precisa de decisão.

## Sugestão 5 · O espelho do site de notícias (12 livros)

A ideia: o blog e o site de notícias falam a mesma língua. As 16 categorias viram 12 livros com os
mesmos nomes (sem o "&") e os mesmos textos, só que lidos pelo que o Cesar faz: as duas de IA viram
uma, Arq. Corporativa entra em Arquitetura, Cloud e DevOps viram Plataforma, e Frontend e Web fica
de fora. A ordem segue os grupos do site: fundação, arquitetura, desenvolvimento, plataforma,
transversal e domínio. O site é o jornal; o blog, o estudo com o mesmo índice.

**01 · Fundamentos** — *O que não muda quando a ferramenta muda.*
- Abrange, vem de, posts e desenho: como na sugestão 4.

**02 · Arquitetura** — *As decisões caras de desfazer.*
- Abrange: DDD e bounded contexts, padrões GoF e enterprise, Clean e Hexagonal, C4, ADRs,
  docs-as-code, refatoração de arquitetura, trade-offs; e a parte corporativa: Team Topologies,
  platform engineering, DevEx (DORA, SPACE), governança de APIs, FinOps, dívida técnica e tech radar.
- Vem de: Arquitetura de Software de hoje (nome curto) e Carreira; do site de notícias, Design e
  Padrões e Arq. Corporativa.
- Posts (2): CronJob ou endpoint + fila, Overhead vs overkill.
- Desenho e cor: os de hoje (arco e pedra angular, verde-pátina).

**03 · Sistemas Distribuídos** — *Correto mesmo quando a rede falha.*
- Abrange: microsserviços e cloud-native, resiliência, service mesh, saga, CQRS e event sourcing,
  caching, outbox, inbox e idempotência, modelos de consistência, durable execution, serverless,
  multi-region, post-mortems.
- Vem de: parte de Arquitetura de Software; do site de notícias, Sist. Distribuídos.
- Posts (2): Chave de idempotência, Efeito externo sem registro local.
- Desenho (ideia): relógio de estação.

**04 · Backend** — *O ofício dentro de cada serviço.*
- Abrange: Java e JVM (GC, JIT, memória, JFR), Spring (Boot, AOP, Data, Jackson), concorrência
  (virtual threads, atomics), performance (profiling, p99), Gradle e Maven, server-side patterns;
  outras linguagens quando aparecerem (Kotlin, Go).
- Vem de: Desenvolvimento de Software de hoje, com o nome do site de notícias; de lá, Backend e
  Runtimes.
- Posts (6): AOP no Spring, AopUtils.getTargetClass(), AtomicBoolean, Gradle, Filtros do Jackson,
  Virtual threads.
- Desenho e cor: os de hoje (paquímetro, tijolo).

**05 · Integração e Eventos** — *O contrato entre quem envia e quem recebe.*
- Abrange: API design e API-First, OpenAPI, GraphQL e federation, MCP, AsyncAPI, EDA, mensageria
  (SNS e SQS, Kafka), evolução de esquema.
- Vem de: a mensageria de Arquitetura de Software; do site de notícias, Integração e Eventos.
- Posts (1): SNS Filter Policy.
- Desenho (ideia): manipulador de telégrafo.

**06 · Dados** — *Onde o dado mora e por onde ele anda.*
- Abrange, vem de e posts (2): como na sugestão 1.

**07 · Testes** — *A prova de que o código faz o que diz.*
- Abrange: TDD e BDD, pirâmide de testes, JUnit e Testcontainers, testes de slice do Spring,
  contract testing (Pact), testes de carga (k6, Gatling), chaos engineering, dados de teste, testes
  com IA.
- Vem de: a parte de testes de Desenvolvimento de Software; do site de notícias, Testes e Qualidade.
- Posts: nenhum.
- Desenho (ideia): nível de bolha.

**08 · Plataforma** — *O chão onde o serviço roda.*
- Abrange: containers e CNCF, Kubernetes, GitOps, CI/CD, progressive delivery, IaC, IDPs e portais,
  edge e proxies (HTTP/3, QUIC), AWS, Azure e GCP (compute, dados, messaging, rede),
  Well-Architected, FinOps.
- Vem de: DevOps de hoje, com o nome do grupo do site de notícias; de lá, DevOps e Plataformas e
  Cloud.
- Posts (2): Kubernetes CronJob, SIGTERM e SIGKILL.
- Desenho e cor: os de hoje (guindaste de porto, azul-ardósia).

**09 · Observabilidade** — *Descobrir o que aconteceu em produção.*
- Abrange, vem de, posts (3) e desenho: como na sugestão 3.

**10 · Segurança** — *Quem pode o quê e como provar.*
- Abrange: CVEs e OWASP, Zero Trust e identidade (OAuth2, OIDC, JWT), passkeys e WebAuthn, supply
  chain (SBOM, SLSA, Sigstore), AI security, runtime security, segredos (Vault, Secrets Manager),
  criptografia em repouso e em trânsito, LGPD e privacidade.
- Vem de: Segurança de hoje; do site de notícias, Segurança e IAM.
- Posts (2): Criptografia em repouso e em trânsito, JWT.

**11 · IA** — *Software feito com IA e software que usa IA.*
- Abrange, vem de e posts: como na sugestão 1.

**12 · Pagamentos** — *Dinheiro não pode sumir nem dobrar.*
- Abrange: cartões e redes (Visa, Mastercard, Elo), cooperativas (Unicred, Sicoob, Sicredi), Pix,
  Open Finance e DREX, PCI DSS, embedded finance e BaaS, payment rails, fraude e risco; e o ledger
  (partidas dobradas, saldos, conciliação).
- Vem de: o ledger de Arquitetura de Software; do site de notícias, Fintech e Pagamentos.
- Posts (1): Arquitetura de ledger.
- Desenho (ideia): máquina de somar de manivela.

**Regra de encaixe:** a do site de notícias, lida ao pé da letra: outbox e idempotência são Sist.
Distribuídos (os dois posts de cobrança vão para lá), e Pagamentos fica com o que é do domínio
(ledger, cartões, Pix, PCI). A técnica fica com Backend.

**Custo:** o mais alto das cinco. Cinco livros novos com desenho e cor (Fundamentos, Sistemas
Distribuídos, Integração e Eventos, Testes, Pagamentos); quatro mudam de nome (Arquitetura de
Software → Arquitetura, Desenvolvimento de Software → Backend, DevOps → Plataforma, SRE →
Observabilidade), com redirecionamento; Carreira sai. Três livros começam vazios (Fundamentos,
Testes, IA) e dois com um post (Integração e Eventos, Pagamentos). O Volume 01 passa a ser
Fundamentos, e a marca "cs" precisa de decisão. "Backend" é o único título que esconde a palavra
que o leitor digita (Java, Spring).

## Recomendação

A sugestão 3, **A estante do arquiteto**, com 10 livros. É a única em que todo título diz o que o
leitor vai achar dentro (Java e Spring, Kubernetes e AWS, Observabilidade, Pagamentos) e em que os
dois assuntos que mais crescem dentro dos posts de hoje, pagamentos e integração por mensagens,
ganham o volume deles. Custa pouco de verdade: dois desenhos novos, três nomes trocados com
redirecionamento e os desenhos de hoje continuando onde estão (o guindaste descarrega containers, o
farol vê de longe). Integração e Eventos começa com um post, como IA e Carreira começaram com
nenhum; a regra de encaixe para a palavra "idempotência" está escrita acima. Se o Cesar não quiser
trocar nome nenhum, a sugestão 2 dá o maior ganho pelo menor custo: só o livro de Pagamentos. As
sugestões 4 e 5 são boas coleções para um blog com o dobro de posts; hoje deixariam metade da
estante com um post ou nenhum.
