# Crítica das cinco sugestões de coleção

Olhar de fora sobre `sugestoes.md` (gerado de `colecoes.json`), lido contra o `contexto.md`, as duas
propostas (`propostas/editor.md` e `propostas/arquiteto-da-informacao.md`; não há `pesquisador.md`),
a `pesquisa-cores-e-desenhos.md`, os posts de fronteira inteiros (Chave de idempotência, Efeito
externo, Arquitetura de ledger, AtomicBoolean, SNS Filter Policy, Jackson, CronJob ou endpoint +
fila) e as regras do projeto (`CLAUDE.md`, `.claude/rules/posts.md`, D30, `NOMES_ANTIGOS`). As cores
foram conferidas com `scripts/livros/conferir-cores.mjs --colecao … s1…s5`; os títulos e as frases
novas, medidos com `scripts/livros/titulo-da-capa.mjs`. As contas de posts por livro batem (21 em
todas). O resto está abaixo, do que muda a escolha ao miúdo de texto.

## 1. O que muda a escolha do Cesar

### 1.1 As cinco não são cinco escolhas: são uma escada com três decisões escondidas nos degraus

| | S1 (8) | S2 (9) | S3 (10) | S4 (11) | S5 (12) |
|---|---|---|---|---|---|
| Carreira | sai | sai | fica | fica | sai |
| Livros que mudam de nome | 0 | 0 | 2 | 0 | 3 |
| Chave de idempotência e Efeito externo | Pagamentos | Pagamentos | Pagamentos | Sist. Distribuídos | Sist. Distribuídos |
| Livros novos | Pagamentos | + Integração | + Integração | + Integração, Sist. Distribuídos | + Integração, Sist. Distribuídos, Testes, Fundamentos |

Três decisões independentes (manter Carreira, trocar nomes, a regra dos dois posts de cobrança)
andam em zigue-zague pelos degraus. Quem escolhe a S2 perde Carreira sem ter decidido isso; quem
quer os nomes novos é obrigado a ir para a S3 ou a S5; quem escolhe a S4 troca, sem perceber, a regra
de encaixe de dois posts. A S1 e a S2 diferem por um livro de um post. E a S1, a opção "barata",
já tira um livro que a D30 decidiu manter vazio: as duas propostas tinham como régua "os 8 de hoje
com as fichas novas", e o editor tinha "os 8 + Pagamentos" como passo seguinte; a síntese perdeu os
dois.

**Troca proposta:** uma escada em que cada degrau acrescenta uma ideia só, e duas perguntas fora
dela, que valem para qualquer degrau.

- S1 · 9 livros: os 8 de hoje + Pagamentos. Nada sai, nada muda de nome. É o mínimo de verdade. (Se
  o Cesar quiser ver um 8, é "hoje com as fichas novas", custo zero, só para comparar.)
- S2 · 10: S1 + Integração.
- S3 · 10: S2 com os nomes que o leitor procura (ver 1.4).
- S4 · 11: S2 + Sistemas Distribuídos.
- S5 · 12 (ou 11, ver 1.6): o espelho do site de notícias.
- Pergunta à parte 1: **Carreira fica?** Ficar custa zero (o livro existe, desenhado e colorido);
  sair custa um redirecionamento e deixa "o estudo e o caderno" sem casa.
- Pergunta à parte 2: **trocar nomes?** Vale em qualquer degrau e reabre a D30 (ver 1.4).

Uma terceira pergunta que o Cesar vai fazer e a síntese não antecipa: **Pagamentos é livro ou é
série?** Os três posts de cobrança são uma sequência de leitura (o Efeito externo abre com "É a
continuação de Chave de idempotência"; o ledger fecha a sequência), que é o que uma revista da
coleção faz. Uma série tira os posts das categorias (como a do Java). Basta um parágrafo dizendo por
que a síntese escolheu livro.

### 1.2 A regra dos dois posts de cobrança muda da S3 para a S4 sem aviso, e nas S1–S3 Arquitetura de Software anuncia o que está em Pagamentos

Nas S1–S3, Chave de idempotência e Efeito externo vão para Pagamentos ("os três posts de cobrança");
nas S4–S5 vão para Sistemas Distribuídos, e o "O que muda" da S4 explica: "é o que eles ensinam; a
cobrança fica como tag". Esse argumento vale igual para as S1–S3, e o documento não diz por que lá
ele não vale. Pior: nas S1–S3 o "abrange" de Arquitetura de Software lista "consistência entre
serviços (idempotência, outbox, saga, CQRS)" e o livro não tem nenhum post disso; os dois posts que
ensinam idempotência e outbox estão em Pagamentos, que lista "idempotência e retry na cobrança,
efeito externo e outbox na cobrança". O leitor abre o livro que anuncia o assunto e não acha.

Os posts dizem o que ensinam. Chave de idempotência: "A mesma técnica vale para webhooks, APIs
públicas de pagamento e comandos consumidos de fila." Efeito externo: "A forma é sempre a mesma,
mude o que mudar de nome: banco mais fila, banco mais cache, banco mais índice de busca, banco mais
API de terceiro." A cobrança é o exemplo; o mecanismo é genérico. O ledger, ao contrário, só existe
porque há dinheiro (partidas dobradas, saldo, conciliação).

**Troca proposta:** uma regra só nas cinco, dita no começo do documento. Recomendo a da técnica
(regra 1 do arquiteto da informação): os dois posts ficam em Arquitetura de Software nas S1–S3 (como
hoje) e vão para Sistemas Distribuídos nas S4–S5; Pagamentos começa com o ledger em todas e cresce
com o que vier (Pix, cartões, conciliação). Fica honesto (Pagamentos com 1 post, não com 3
emprestados) e reduz o problema da tag (1.3) a um post. Se o Cesar preferir a regra do domínio, ela
tem de valer também nas S4–S5 (Sistemas Distribuídos começa vazio, como o arquiteto da informação
já avisou) e o "abrange" de Arquitetura nas S1–S3 muda de "consistência entre serviços
(idempotência, outbox, saga, CQRS)" para "consistência entre serviços (saga, CQRS, event sourcing)",
com a nota "idempotência e outbox na cobrança: ver Pagamentos".

### 1.3 O livro Pagamentos bate na tag Pagamentos, e nenhum "O que muda" fala disso

`.claude/rules/posts.md`: "`tags`: de 2 a 4, do vocabulário existente, **sem repetir nome de
categoria**". A tag Pagamentos (ícone pilha de moedas) está em quatro posts: ledger, Chave de
idempotência, Efeito externo e Jackson. Nas cinco sugestões existe um livro Pagamentos, logo:

- com a regra do domínio (S1–S3), três posts perdem a tag e ela fica com um (o Jackson);
- com a regra da técnica (S4–S5, ou as cinco, ver 1.2), só o ledger perde a tag e ela fica com três;
- em todas, `/tags/Pagamentos/` e `/categories/Pagamentos/` passam a existir com o mesmo nome e
  contagens diferentes (o arquiteto da informação apontou; a síntese calou).

O mesmo acontece com "Mensageria", se a S3 adotar esse nome (1.4): o SNS perde a tag.

**Troca proposta:** acrescentar ao "O que muda" das cinco: "A tag Pagamentos sai dos posts que vão
para o livro Pagamentos (regra de `posts.md`) e continua nos outros, como cenário; a página da tag e
a do livro passam a ter o mesmo nome." E decidir, de uma vez, se o blog aceita livro e tag homônimos
("a tag é o cenário, o livro é o assunto") ou se a tag muda de nome.

### 1.4 A S3 contradiz a própria ideia e, com a S5, reabre a D30 sem dizer

- A ideia da S3 é "o título passa a dizer o que tem dentro", "o nome que o leitor procura". Mas o
  livro da mensageria se chama "Integração e Eventos" nas quatro sugestões, e o arquiteto da
  informação avaliou justamente isso (tabela "Como o leitor procura"): o leitor digita "mensageria";
  "integração" lembra integração contínua; por isso a S3 dele se chamava "Mensageria" (a palavra que já é tag de 4 posts). **Troca:**
  na S3, "Integração e Eventos" → "Mensageria" (10 caracteres, uma linha na capa e uma coluna na
  lombada), com o design de API indo para "Java e Spring", como ele fez; ou tirar da ideia a frase
  "o nome que o leitor procura".
- A D30 (24/09/2026, uma semana atrás) renomeou Java → Desenvolvimento de Software e Observabilidade
  → SRE por decisão do Cesar. A S3 desfaz as duas e a S5 desfaz três (mais DevOps → Plataforma).
  `CLAUDE.md`: não reabrir o que está decidido sem perguntar. A síntese só diz, de passagem, "com o
  nome que tinha antes da D30" para Observabilidade. **Troca:** na ideia e no "O que muda" da S3 e da
  S5: "Reabre a D30: desfaz Java → Desenvolvimento de Software e Observabilidade → SRE."
- O redirecionamento não é só "os endereços antigos passam a levar para os novos".
  `NOMES_ANTIGOS` hoje tem `Observabilidade: "SRE"`. Com um livro chamado Observabilidade, essa
  entrada **sai** (senão a página de redirecionamento e a página do livro disputam
  `/categories/Observabilidade/`) e entra `SRE: "Observabilidade"`; e `Java` precisa apontar direto
  para o nome novo (hoje aponta para Desenvolvimento de Software, que viraria ela mesma uma página de
  meta refresh: duas em cadeia). A S5 não fala de redirecionamento nenhum (ver 1.5).
- "Java e Spring" passa a conviver com a revista "Atualizações do Java" (7 posts) e com a tag Spring
  (9 posts, 3 fora do livro). Não é impedimento; é para constar no custo.

### 1.5 "O que muda" está incompleto nas cinco

Faltam, com a frase a acrescentar:

- **Numeração.** Em todas, livros de hoje mudam de número (o "VOLUME 0N" da capa e da lombada; as
  fotos da ficha "Do livro" e dos vazios se refazem com `scripts/livros/fotos.mjs`): S1, 4 livros;
  S2, 6; S3, 7; S4, 7; S5, 6. Nenhuma sugestão diz.
- **Tag Pagamentos** (1.3), em todas.
- **Frase nova em livro renomeado.** A S3 e a S5 dizem que Observabilidade (e, na S5, Plataforma)
  "ficam com o desenho e a cor de hoje"; a frase também muda ("O que mantém a produção de pé." →
  "Descobrir o que aconteceu em produção."; "O caminho do commit até a produção." → "O chão onde o
  serviço roda."). A regra do controle era manter a frase quando o assunto é o mesmo; se muda, diga.
- **`?livro=<slug>`** (D33): `/archive/?livro=desenvolvimento-de-software` e `?livro=sre` deixam de
  filtrar se o slug seguir o nome (no `colecoes.json`, Observabilidade mantém `desenho: "sre"`; é uma
  resposta, mas está implícita).
- **S5:** nenhum redirecionamento mencionado. São quatro (Desenvolvimento de Software → Backend,
  DevOps → Plataforma, SRE → Observabilidade, Carreira → ?) mais os dois ajustes de `Java` e
  `Observabilidade` (1.4). E o destino de `/categories/Carreira/` na S5 não está dito.
- **S4:** dizer que dois livros começam vazios (IA e Carreira), como a S5 faz.
- **S1, S2, S5:** "o estudo e o caderno" (de Carreira) fica sem casa; a S5 do arquiteto da
  informação diz isso; a síntese não.
- **Itens das 16 que somem sem aviso:** Bedrock (de Cloud; vai para IA), service mesh (de Sist.
  Distribuídos), landing zones nas S1–S4 ("contas", em DevOps, é o único rastro), Green IT. Uma linha
  "ficam fora de propósito: …" resolve.

### 1.6 Na S5, Fundamentos (e Testes) são livros descritos por posts que estão em outros livros

O "abrange" de Fundamentos é, item por item, o conteúdo de três posts de Backend e Plataforma:
"sistema operacional (processos, sinais, PID 1)" é a seção "A pegadinha do PID 1" de SIGTERM e
SIGKILL; "redes (TCP e os estados da conexão…)" é o CLOSE_WAIT das Virtual threads; "concorrência e
modelo de memória (visibilidade, happens-before)" é a seção "Por que não usar um `boolean` comum?" do
AtomicBoolean (JLS §17.4, *happens-before*, o teste com `volatile`). O leitor abre Fundamentos e não
acha nada; abre Backend e acha. A matriz do arquiteto da informação mostra 0 posts com um fundamento
como assunto principal. Testes é o mesmo caso em menor grau: o teste é o método do blog, não um
assunto; três livros vazios em doze (Testes, IA, Fundamentos) é um quarto da estante sem nada.

**Troca proposta:** tirar Fundamentos da S5 (fica com 11; os itens voltam para Backend como "o que
roda por baixo (TCP, sinais, sistema operacional)", igual às S1–S4). Alternativa, se o Cesar quiser
o espelho inteiro: mover AtomicBoolean e SIGTERM e SIGKILL para Fundamentos (Backend fica com 5,
Plataforma com 1), dizendo que a regra "ferramenta no título → livro do ofício" foi quebrada de
propósito. Testes só fica se houver post de testes na fila; senão, cai pelo mesmo motivo.

### 1.7 Carreira: o motivo de sair está errado, e sair não é decisão da síntese

- S1: "sai Carreira, que não tem post nem par no site de notícias". Tem par: a estrutura
  organizacional de Arq. Corporativa (Team Topologies, DevEx/DORA/SPACE), como o "Vem de" da S3 e da
  S4 diz com todas as letras.
- A D30 registra "IA e Carreira ficam vazias": estado decidido. As duas propostas mantêm Carreira
  onde a ideia permite; a síntese tira em três de cinco sem critério visível (a S2 tira, a S3 mantém,
  a S4 mantém, a S5 tira).

**Troca:** Carreira vira pergunta à parte (1.1) e a frase da S1 vira "Carreira, sem post, fica ou
sai; se sair, o papel do arquiteto e os times vão para Arquitetura de Software e
`/categories/Carreira/` leva para lá."

## 2. As listas do que abrange: sobreposições e itens no livro errado

- **MCP em dois livros** (S2–S5): Integração ("MCP como integração") e IA ("agentes e MCP"). O
  arquiteto da informação deixou só em IA. **Troca:** tirar "MCP como integração" de Integração.
- **FinOps duas vezes na S5:** Arquitetura ("governança e custo (governança de API, FinOps, landing
  zones)") e Plataforma ("FinOps"). **Troca:** em Arquitetura, "governança e custo (governança de
  API, FinOps, landing zones)" → "governança de API".
- **Times em dois livros na S5:** Arquitetura ("estrutura dos times (Team Topologies, Platform
  Engineering, DevEx, DORA)") contra Plataforma ("plataforma interna (IDP, Backstage)",
  "produtividade do desenvolvedor"). **Troca:** Arquitetura fica com "estrutura dos times (Team
  Topologies)"; Platform Engineering, DevEx e DORA ficam em Plataforma.
- **PCI DSS só em Pagamentos, e Segurança perdeu o "compliance"** (o subtítulo de hoje é
  "Identidade, segredos, criptografia e compliance"). Os posts que citam a norma estão em outros
  livros: Jackson (5 menções, Desenvolvimento), Criptografia em repouso e em trânsito (2, Segurança);
  o ledger cita uma vez; os dois posts de cobrança, nenhuma. PCI DSS diz como proteger o dado do
  cartão: é Segurança (regra 2 do arquiteto da informação). **Troca:** Segurança, "LGPD e
  privacidade" → "conformidade (PCI DSS, LGPD)"; Pagamentos, "PCI DSS" → "regras das bandeiras e do
  Banco Central".
- **Idempotência e outbox em Arquitetura e em Pagamentos** (S1–S3): ver 1.2.
- **Busca vetorial em Dados ("busca vetorial (pgvector)") e em IA ("RAG e bancos vetoriais").**
  Aceitável se a divisão for dita; o mais simples: em IA, "RAG e bancos vetoriais" → "RAG".
- **Chaos engineering sem casa na S3:** a lista de Observabilidade tirou o item e não há Testes.
  **Troca:** devolver "chaos engineering" a Observabilidade na S3.
- **Front-end:** na S3 não tem casa ("Java e Spring" não serve) e a sugestão não diz, ao contrário
  da S5 ("Frontend & Web fica de fora"). Nas S2 e S4, o "abrange" de Desenvolvimento diz "web e
  front-end, quando aparecer", mas o "Vem de" não cita Frontend & Web. **Troca:** na S3, uma linha
  como a da S5; nas S2 e S4, acrescentar "e Frontend & Web" ao "Vem de".
- **Termos:** "travas e isolamento (lock otimista e pessimista, MVCC)" → "bloqueio otimista e
  pessimista, isolamento e MVCC" (é o título do post e a palavra que o leitor digita); "padrões (GoF,
  enterprise)" → "padrões (GoF, Fowler)" ("enterprise" sozinho não diz nada); na S2, "Tech Radar"
  sozinho como item → "estratégia técnica (dívida técnica, Tech Radar)", como na S5.
- **Formato:** cada "abrange" sai numa linha corrida de 300 caracteres com parênteses dentro dos
  itens; o site de notícias usa itens curtos em lista. Vale gerar como lista (ou separar os itens
  com ponto e vírgula) no `gerar-sugestoes.mjs`, senão o Cesar não compara duas listas sem se perder.

## 3. Títulos

Nenhum tem "&"; todos cabem na lombada (as duas linhas mais longas, "Desenvolvimento" e
"Observabilidade", têm 15 caracteres) e na capa (medido: Pagamentos 72px, Sistemas Distribuídos 72
em duas linhas, Integração e Eventos 82 em duas, Observabilidade 54, Fundamentos 63, Testes no teto
de 108).

- **"Integração e Eventos"** → **"Integração"** nas S2, S4 e S5: "e Eventos" não acrescenta palavra
  que o leitor digite, e o título cai para uma linha na capa e uma coluna na lombada. Na S3,
  "Mensageria" (1.4).
- **"Plataforma"** (S5): ninguém busca "plataforma" (medição do arquiteto da informação) e a
  palavra é ambígua (platform engineering? a plataforma do blog?). A troca DevOps → Plataforma só
  compra um redirecionamento; "DevOps" é a palavra do leitor e a do próprio site de notícias
  ("DevOps & Plataformas"). **Troca:** manter "DevOps" na S5 (um nome e um redirecionamento a menos,
  e a frase de hoje fica). Se o ponto é dizer que Cloud entra aqui, o "abrange" já diz.
- **"Java e Spring"** (S3): é a palavra do leitor; convive com a revista e a tag (1.4), e não
  comporta outra linguagem se aparecer (o "abrange" não prevê). **"Backend"** (S5): esconde Java e
  Spring (o editor avisou), o "abrange" compensa. Os dois servem; são escolhas, não erros.
- **"Fundamentos":** vago, ninguém busca; moot se 1.6 valer.

## 4. Frases

Todas as novas cabem numa linha (medido). Nenhuma tem cara de texto de máquina, com uma ressalva.

- "Dinheiro não pode sumir nem dobrar." → **"Dinheiro não pode sumir nem duplicar."** "Dobrar" é
  dobrar a esquina, dobrar o papel; os posts falam em "cobrança duplicada" e "cobrar duas vezes". 37
  caracteres, uma linha.
- "A prova de que o código faz o que diz." → **"A prova de que o código faz o que deve."** Código não
  "diz"; e é a frase mais genérica das sete. (Repete o "provar" de Segurança, "Quem pode o quê e como
  provar."; se incomodar, "Antes que a produção descubra.", 31 caracteres.)
- "Descobrir o que aconteceu em produção." serve, mas cobre só metade da lista (logs, tracing,
  métricas); SLOs, error budgets e incidentes são "o que mantém a produção de pé". Se o livro vira
  Observabilidade, a frase nova é a certa; é só registrar a troca (1.5).
- "O chão onde o serviço roda." não cobre CI/CD, GitOps e entrega progressiva, que são caminho, não
  chão. Com "DevOps" mantido (seção 3), fica a frase de hoje.
- "Quando o timeout não diz o que aconteceu." ecoa a primeira marcação do post Chave de idempotência
  ("Um timeout não diz se a operação aconteceu."), que nas S4–S5 está nesse livro: certa. "Como um sistema fala com o outro." e "O que todo framework
  esconde." estão bem.

## 5. Cores e desenhos: os motivos estão honestos?

- **Pagamentos `#467866`.** A síntese escureceu o `#527c6a` da pesquisa "para a tinta clara ter mais
  contraste". Conferido: tinta 4,16:1 (alerta "só texto grande", como o couro de Carreira em 3,39) e
  ΔE 0,066 com a oliva de Segurança, 0,002 acima do piso de 0,064. Passa nos números. O que os
  números não mostram: da S2 em diante, a estante tem quatro verdes em nove (pátina h183, água h188,
  cédula h169, oliva h118), e a água de Integração é o mesmo matiz da pátina de Arquitetura, só
  clara; lado a lado leem como a mesma família. Não tem solução pronta (a pesquisa não achou cor
  não verde para Integração, e o cobre de Pagamentos colide com o couro); o Cesar precisa ver a
  estante montada antes de escolher.
- **Motivo da cor de Pagamentos:** "o verde do papel de razão dos contadores" é, segundo a própria
  pesquisa, "tradição de fabricante, sem estudo por trás, e está dito como tal"; a síntese tirou a
  ressalva. **Troca:** "…desde 1861 e, por tradição dos fabricantes, o verde do papel de razão".
- **Sistemas Distribuídos:** o motivo da cor conta o cronômetro de marinha (a hora do porto contra a
  hora local: um relógio de referência e um local), que é a história do primeiro desenho da pesquisa
  (dois relógios de bolso, um adiantado). O desenho escolhido é o segundo (os pêndulos de Huygens na
  mesma viga, que é sincronização por acoplamento): outra história. E dois relógios de pêndulo numa
  viga a 40px de lombada são mais difíceis de ler que dois mostradores. **Troca:** um par só, ou
  relógios de bolso + cronômetro, ou pêndulos + um motivo sobre sincronia. E "da Marinha (1748)" →
  "da Marinha britânica (1748)".
- **Fundamentos:** o motivo "calculus é a pedrinha de contar" é trocadilho sobre a cor; a pesquisa
  classificou o cinza-pedra como associação ("a pedra fundamental"). Dizer "associação", ou cai com
  1.6.
- IA ("não há convenção que ligue a cor ao assunto"), Testes (pedra de toque) e Integração
  (isolador) estão honestos. O ícone da mesa telefônica foi avaliado "médio" para legibilidade
  pequena na pesquisa: precisa da foto da lombada que o manual exige antes de fechar.
- O cabeçalho do `sugestoes.md` promete "as capas e a estante de cada sugestão" em
  `/amostra/colecoes/`. A página existe, mas `src/livros/desenhos/` só tem os oito de hoje e o
  `_rascunho`: as capas novas ainda não estão lá. Não prometer até a etapa 6 estar feita.

## 6. O que falta e o que sobra

- **Falta:** a de 9 livros "hoje + Pagamentos" (1.1); a resposta a "livro ou série?" (1.1); e uma
  recomendação. O editor recomendou a S3; o arquiteto da informação, a S2 (com SRE → Observabilidade
  como ajuste); a síntese não recomenda nada. O Cesar pediu cinco para escolher, mas uma linha "se
  fosse eu, a S2, porque…" é o que ele vai perguntar primeiro. Se a neutralidade é de propósito,
  dizer.
- **Sobra:** S1 e S2 como estão (um livro de um post de diferença); Fundamentos e, provavelmente,
  Testes na S5 (1.6).

## 7. Miúdos de texto

- Ideia da S1: "o assunto que mais identifica o Cesar e que hoje some dentro de Arquitetura de
  Software" fica; "sai Carreira, que não tem post nem par no site de notícias" → ver 1.7.
- Ideia da S2: "a integração por mensagens, que passa por quatro posts sem ter casa" → "a
  mensageria, que é tag de quatro posts e assunto de um (o SNS)". O livro nasce com um post; a frase
  atual faz parecer quatro.
- Ideia da S3: "todos os seis posts são de Java e Spring" está certo (AtomicBoolean, Gradle e
  Virtual threads são Java sem Spring; os outros três são Spring). Acrescentar "(reabre a D30)".
- "Vem de" de Observabilidade na S3: "com o nome que tinha antes da D30" → "desfazendo a D30
  (Observabilidade → SRE, 24/09)".
- "O que muda" da S4: acrescentar "IA e Carreira começam vazios".
- "O que muda" da S5: acrescentar os redirecionamentos (1.4, 1.5) e o destino de Carreira.
- Pagamentos, "Vem de" nas S1–S3: "Os três posts de cobrança de Arquitetura de Software" → com a
  regra da técnica (1.2), "O ledger de Arquitetura de Software", como nas S4–S5.
- Em todas: "Os 21 posts de categoria ficam distribuídos assim" está certo (somas conferidas).

## Antes de ir para o Cesar

1. Refazer a escada (1.1): S1 = hoje + Pagamentos; Carreira e os nomes viram duas perguntas à parte.
2. Uma regra só para os posts de cobrança nas cinco (1.2), e o "abrange" de Arquitetura coerente com
   ela.
3. Dizer da tag Pagamentos, da numeração, das frases trocadas e dos redirecionamentos da S3 e da S5
   em cada "O que muda" (1.3, 1.4, 1.5), com "reabre a D30" onde couber.
4. Tirar Fundamentos da S5 ou mover os dois posts (1.6); "Integração" sem "e Eventos" e "Mensageria"
   na S3 (3); "DevOps" no lugar de "Plataforma" (3).
5. "duplicar" no lugar de "dobrar", "deve" no lugar de "diz" (4); um par só de desenho e motivo em
   Sistemas Distribuídos e a ressalva do papel de razão (5); MCP, FinOps, times e PCI DSS num livro
   só (2).
