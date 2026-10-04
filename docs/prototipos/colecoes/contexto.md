# Contexto para as sugestões de coleção

Resumo para quem vai propor, criticar ou desenhar os livros. As regras completas ficam em
`CLAUDE.md`, `docs/briefing.md`, `docs/capas/CAPAS.md` e `DESIGN.md`; aqui está só o necessário.

## O blog e o autor

- Blog técnico pessoal de **Cesar Schutz**, arquiteto de soluções, em pt-BR
  (<https://blog.cesarschutz.com.br>). É só um blog: artigos, categorias, tags, séries, busca e RSS.
- Frase do próprio blog: "Publico aqui o que ando estudando — lançamento do Java, código, arquitetura,
  IA, o que me despertar interesse. Quando o estudo rende algo que vale guardar, vira artigo."
- Leitores: desenvolvedores que chegam por busca querendo entender um assunto; e o próprio Cesar, que
  usa o blog como caderno de estudo. Sucesso é o leitor entender de verdade e o Cesar manter a
  constância de estudo. Audiência e crescimento não são metas.
- Diferenciais: fonte primária conferida em toda afirmação; código e SQL testados antes de publicar;
  desenho próprio em cada post (ilustração, lousas, figuras, animações); série do Java por LTS; a
  organização em livros; transparência sobre o uso de IA.
- O que dá para ver do autor pelos posts: backend em **Java, Spring e JVM**; **Kubernetes** e **AWS**
  (SNS, SQS, RDS, KMS); **pagamentos** de verdade (ledger de partidas dobradas, chave de idempotência,
  cobrança duplicada no retry, efeito externo sem registro local, mascarar cartão em log, PCI DSS);
  **mensageria e eventos** (outbox, SNS filter policy, CronJob × fila); **observabilidade** (log
  estruturado, wide events, W3C Trace Context); **segurança** (criptografia em repouso e em trânsito,
  JWT); **dados** (bloqueio otimista e pessimista, data lake × warehouse); concorrência (virtual
  threads, AtomicBoolean, CLOSE_WAIT); decisões de arquitetura (overhead × overkill, trade-offs). Usa
  muito IA para trabalhar (o próprio blog é feito com o Claude Code), e o livro IA existe, ainda vazio.
- Escrita: profissional e direta, sem enchimento. **Não pode parecer feito por IA**: nada de frase de
  efeito vazia, metáfora rebuscada, título genérico, emoji, caixa alta.

## Os 28 posts de hoje

| Post | Livro de hoje | Tags |
|---|---|---|
| AOP no Spring — JDK Dynamic Proxy, CGLIB e aspects customizados | Desenvolvimento de Software | Spring, AOP |
| AopUtils.getTargetClass() — desembrulhando os proxies do Spring | Desenvolvimento de Software | Spring, AOP |
| Arquitetura de ledger — partidas dobradas, saldos e conciliação | Arquitetura de Software | Pagamentos, Banco de Dados, Idempotência |
| AtomicBoolean — o sinalizador thread-safe da parada graciosa | Desenvolvimento de Software | Concorrência, Kubernetes, JVM |
| Bloqueio otimista e pessimista — como funcionam e quando usar cada um | Dados | Banco de Dados, Concorrência, Spring, Trade-offs |
| Chave de idempotência — como impedir a cobrança duplicada no retry | Arquitetura de Software | Pagamentos, Idempotência, Banco de Dados |
| Criptografia em repouso e em trânsito — o que é e como ativar no Postgres e no MongoDB | Segurança | Criptografia, Banco de Dados, AWS |
| CronJob ou endpoint + fila — onde rodar o batch de uma API Spring Boot no Kubernetes | Arquitetura de Software | Kubernetes, Spring, Mensageria, Trade-offs |
| Data lake vs data warehouse — e onde entra o lakehouse | Dados | Trade-offs, AWS |
| Efeito externo sem registro local — a cobrança passou e o banco não gravou | Arquitetura de Software | Pagamentos, Mensageria, Banco de Dados |
| Gradle — quando usar implementation, api, compileOnly e as demais configurações | Desenvolvimento de Software | Gradle, Spring |
| Filtros de serialização no Jackson — mascarando número de cartão nos logs | Desenvolvimento de Software | Spring, Logs, Pagamentos |
| JWT — a estrutura e o significado de cada campo | Segurança | JWT, Criptografia |
| Kubernetes CronJob — concorrência, retries e tempo máximo de execução | DevOps | Kubernetes, Concorrência |
| Logging estruturado em Spring Boot — LogstashEncoder vs o suporte nativo do 3.4+ | SRE | Spring, Logs, Trade-offs |
| Overhead vs overkill — o custo de toda escolha e o exagero dela | Arquitetura de Software | Trade-offs, Microsserviços |
| SIGTERM e SIGKILL — o ciclo de término de um pod no Kubernetes | DevOps | Kubernetes, Spring |
| SNS MessageAttributes e Filter Policy — filtrando mensagens antes do SQS | Arquitetura de Software | AWS, Mensageria |
| Virtual threads no Java 21 — pinning e CLOSE_WAIT | Desenvolvimento de Software | Virtual Threads, Concorrência, JVM |
| W3C Trace Context — correlacionando logs entre microsserviços com o traceparent | SRE | Logs, Microsserviços, Mensageria |
| Wide events e canonical log lines — a evolução do logging estruturado | SRE | Logs, Spring |
| Guia de atualizações do Java + Java 8, 11, 17, 21, 25 e 29 (7 posts) | série "Atualizações do Java" (fora das categorias) | LTS, Linguagem, JVM, Migração, Concorrência, Criptografia |

Tags (20, com o número de posts): Spring 9, JVM 8, LTS 7, Concorrência 7, Trade-offs 5, Linguagem 5,
Banco de Dados 5, Pagamentos 4, Mensageria 4, Logs 4, Kubernetes 4, Criptografia 4, Migração 3, AWS 3,
Virtual Threads 2, Microsserviços 2, Idempotência 2, Gradle 2, AOP 2, JWT 1.

A série "Atualizações do Java" é uma revista, fora da coleção: não entra nas sugestões. Tags continuam
existindo independentemente dos livros (um post tem um livro e várias tags).

## Os 8 livros de hoje (a coleção "edição de estudo")

| Vol. | Livro | Frase da capa | Temas (subtítulo) | Cor | Desenho (instrumento) | Posts |
|---|---|---|---|---|---|---|
| 01 | Arquitetura de Software | As decisões caras de desfazer. | Microsserviços, domínios, eventos e consistência | `#2d4b46` verde-pátina | arco e pedra angular | 6 |
| 02 | Desenvolvimento de Software | O ofício dentro de cada serviço. | Java, Spring, testes e refatoração | `#7a4430` tijolo | paquímetro medindo uma peça | 6 |
| 03 | Dados | Onde o dado mora e por onde ele anda. | Bancos, modelagem, CDC e pipelines | `#5f4662` ameixa | gaveta de fichas | 2 |
| 04 | IA | Software feito com IA e software que usa IA. | LLMs, agentes, RAG e prompts | `#6e2f45` vinho | autômato escritor | 0 |
| 05 | Segurança | Quem pode o quê e como provar. | Identidade, segredos, criptografia e compliance | `#606a37` oliva | carta lacrada e sinete | 2 |
| 06 | DevOps | O caminho do commit até a produção. | Containers, Kubernetes, CI/CD e nuvem | `#465976` azul-ardósia | guindaste de porto | 2 |
| 07 | SRE | O que mantém a produção de pé. | Observabilidade, SLOs, alertas e incidentes | `#c4a050` ocre | farol | 3 |
| 08 | Carreira | O lado humano de construir software. | O papel do arquiteto, o estudo e o time | `#9a7650` couro | compasso | 0 |

## As 16 categorias do site de notícias do Cesar (dev-note)

Transcritas da página <https://dev-note-phi.vercel.app/#categories> (nome, grupo e o que abrange):

| Categoria | Grupo | O que abrange |
|---|---|---|
| AIOps & Agents | Transversal | LLMOps, AI Agents & MCP, RAG & Vector DBs, AI Coding em produção, LLM Evals & Observability (Langfuse, LangSmith), guardrails, agent orchestration, local LLM (Ollama). |
| Arq. Corporativa | Arquitetura | 3 eixos — Estrutura organizacional (Team Topologies, Platform Eng, DevEx/DORA/SPACE); Governança & custos (API Governance, FinOps, Landing Zones, Green IT); Estratégia técnica (Tech Debt, Tech Radar). |
| Backend & Runtimes | Desenvolvimento | Runtimes poliglotas, web frameworks, concurrency models, WebAssembly, performance engineering (profiling, GC, p99), build tools, server-side patterns. |
| Cloud | Plataforma | AWS, Azure e GCP — compute, dados, messaging, segurança, Bedrock, CDN & Edge (Cloudflare, Fastly), cloud networking (VPC/peering), Well-Architected, FinOps multi-cloud. |
| Dados & Streaming | Desenvolvimento | Relacionais, NoSQL, streaming (Flink), lakehouse (dbt), Iceberg, Vector DBs (pgvector, Pinecone), CDC, Data Contracts, Data Mesh, DuckDB. |
| Design & Padrões | Arquitetura | DDD & Bounded Contexts, padrões GoF/Enterprise, Clean/Hexagonal, C4 Model, ADRs, refactoring, docs-as-code. |
| DevOps & Plataformas | Plataforma | Containers & CNCF, GitOps, CI/CD, progressive delivery, IaC, IDPs & developer portals, Edge/Proxies (HTTP/3, QUIC), Developer Productivity, AI-augmented SDLC. |
| Fintech & Pagamentos | Domínio | Cartões & Redes (Visa, Mastercard, Elo), Cooperativas (Unicred, Sicoob, Sicredi), Pix/Open Finance/DREX, PCI DSS, Embedded Finance/BaaS, Payment Rails, Fraud & Risk. |
| Frontend & Web | Desenvolvimento | React/Vue/Svelte, meta-frameworks (Next/Nuxt/Astro), RSC & streaming SSR, Web Platform, design systems, Core Web Vitals, edge rendering, state, build tools, a11y/i18n, Mobile cross-platform. |
| Fundamentos de Computação | Fundação | SO, redes (TCP/IP, DNS), estruturas de dados, algoritmos, concorrência, memory models, teoria de filas, performance de hardware — a base eterna. |
| IA & LLMs | Transversal | Modelos & Pesquisa: fundacionais (OpenAI, Anthropic, Google, Meta, HF), fine-tuning, multimodal, benchmarks, AI Safety. Não inclui agentes/LLMOps — ver AIOps & Agents. |
| Integração & Eventos | Desenvolvimento | API design & API-First, OpenAPI, GraphQL & federation, MCP, AsyncAPI, EDA, messaging, schema evolution. |
| Observabilidade & SRE | Plataforma | Tracing (OTel), métricas, logs, APM, SLO/SLI & Error Budgets, Incident Management, eBPF & profiling, Alerting & Noise Reduction, Cost Observability. |
| Segurança & IAM | Transversal | CVEs, OWASP, Zero Trust & Identidade, Passkeys/WebAuthn, Supply Chain (SBOM/SLSA/Sigstore), AI Security, Runtime Security, Secrets Management (Vault, AWS Secrets Manager), LGPD & Privacidade. |
| Sist. Distribuídos | Arquitetura | Microsserviços, cloud-native, resiliência, service mesh, saga/CQRS/ES, caching, outbox/inbox/idempotência, consistency models, durable execution, serverless, multi-region, post-mortems. |
| Testes & Qualidade | Desenvolvimento | TDD/BDD, testing pyramid, contract testing (Pact), chaos engineering, performance, test data mgmt, AI-assisted testing. |

O site de notícias acompanha o mercado inteiro (16 é muito para um blog que é caderno de estudo); o
blog publica o que o Cesar estuda e testa. O Cesar acha 16 demais; um pouco mais de 8 pode.

## O que cada livro precisa ter (e os limites da capa e da lombada)

- **Título** curto, em pt-BR. Na capa: Bitter 800, linha de até 404px, corpo de até 108px (título
  curto fica enorme: "IA", "SRE", "Dados"; título longo quebra em duas linhas e encolhe:
  "Desenvolvimento / de Software" fica com 50px). Na lombada em pé: o título na vertical, Bitter 800
  30px, uma coluna por linha, com cerca de 300 unidades de altura: até ~16 caracteres por linha, no
  máximo duas linhas. Sem "&" no título (vira nome cru na URL `/categories/<Nome>/`).
- **Frase** da capa: Newsreader itálico 24px numa largura de 404px; o ideal é caber em **uma linha
  (até ~45 caracteres)**. Molde das de hoje: curta, concreta, dita como o Cesar diria ("As decisões
  caras de desfazer.", "Quem pode o quê e como provar.", "O caminho do commit até a produção.").
- **O que abrange**: a lista no formato do site de notícias (itens curtos, com os nomes técnicos de
  verdade), substituindo os "temas" de hoje. Serve à página do livro e ao subtítulo.
- **Desenho**: um instrumento de ofício (objeto de verdade, nunca logotipo) que represente o livro
  inteiro, desenhado à caneta com hachura e um elemento fantasma tracejado. Hoje: arco com pedra
  angular, paquímetro, gaveta de fichas, autômato escritor, carta lacrada com sinete, guindaste de
  porto, farol, compasso.
- **Cor**: tecido de capa de livro, sóbria (nada saturado), que funcione com a tinta clara `#efe8d8`
  (ou a escura `#29251b`, se a cor for clara) e, escurecida, sobre o papel `#f2ede2`. Todas as cores
  de uma sugestão precisam ser bem diferentes umas das outras lado a lado na estante.

## O que mudar de livro custa

- Os posts trocam de livro (o frontmatter `category`). Cada post precisa ter um livro.
- As URLs `/categories/<Nome>/` dos livros que mudam de nome ou saem continuam funcionando por
  redirecionamento (como `NOMES_ANTIGOS` fez com Arquitetura → Arquitetura de Software, D30).
- Livro vazio aparece na estante sem número ("Este livro ainda não tem artigos").
