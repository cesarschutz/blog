# Briefing — novo blog de Cesar Schutz

Este documento é a fonte das decisões de produto e design do novo blog. Ele foi fechado
com o Cesar depois de várias rodadas de protótipo. Não reabra decisões marcadas como
**decidido** sem perguntar; tudo o que estiver marcado como **a decidir por você** é seu
para propor, justificar e registrar em `docs/decisoes.md`.

Referências visuais e de comportamento, abertas no navegador (arquivos locais, sem build):

- `docs/referencias/prototipo-home-e-artigo.html`: home (estante, destaque, lista e cards,
  tags, busca) e página de artigo completa (abas no topo alternam as duas páginas)
- `docs/referencias/prototipo-lousas.html`: as lousas dos diagramas. **A escolhida é a aba
  "Invertida, canetinha"** (ver seção 7)
- `docs/referencias/prototipo-estilo-desenho.html`: estilo das ilustrações. **O escolhido é
  a aba "A + C"** (ver seção 6)

Os protótipos mostram aparência e comportamento aprovados. São referência, não código para
copiar: reescreva com a arquitetura certa, acessível e performática. Onde este briefing e um
protótipo divergirem, vale o briefing.

---

## 1. O que é o blog

- Blog técnico pessoal de **Cesar Schutz**, arquiteto de soluções. Idioma **pt-BR**.
  Domínio: `https://cesarschutz.com.br` (GitHub Pages).
- É **só um blog**: artigos, categorias, tags, séries, busca e RSS. Sai tudo o que existe
  hoje além disso: página de projetos, card de identidade com foto e números, frase do dia,
  ícones animados. A página "Sobre" completa virá depois; por enquanto existe só `/sobre/`
  com a seção "Como os artigos são produzidos" (texto no blog atual, em `src/pages/about.astro`).
- Os textos são escritos com apoio de IA e revisados pelo Cesar. Isso aparece no fim de cada
  post (seção 5.3) e em `/sobre/`.
- Aparência: editorial, de livro técnico bem diagramado. Não pode parecer feito por IA:
  nada de fontes genéricas, gradientes decorativos, cards com sombra genérica em tudo,
  animação de entrada em cada seção, rótulos em caixa alta, emojis.

## 2. Pontos de partida

- **Blog atual** (somente leitura): `https://github.com/cesarschutz/cesarschutz.github.io`.
  Clone em uma pasta irmã (`../blog-atual`) e **nunca** escreva nela. Leia o `CLAUDE.md`
  de lá antes de começar: ele tem regras valiosas que continuam valendo (fluxo de post,
  revisão contra fontes, série do Java, apresentações do NotebookLM, armadilhas do
  ambiente). Porte o que continuar fazendo sentido; não copie o que este briefing muda.
- **Pasta do projeto**: esta pasta, **fora do iCloud**. O blog atual documenta que
  `~/Documents` sincronizado pelo iCloud gera cópias "arquivo 2", ressuscita arquivos e
  deixa `node_modules` lento. Se perceber que está dentro de uma pasta sincronizada, avise
  antes de instalar dependências.
- **URLs existentes não podem quebrar**: `/posts/<slug>/`, `/archive/`, `/categories/<nome>/`,
  `/tags/<nome>/`, `/series/`, `/java/`, `/rss.xml`, e os redirecionamentos da série Java
  (`/posts/java-NN/` → `/posts/java-<LTS>/#java-NN`). Páginas que deixam de existir
  redirecionam: `/about/` → `/sobre/`, `/projects/` → `/`.

## 3. Stack e desempenho

**Decidido**
- Site estático, publicado no GitHub Pages por GitHub Actions, sem backend.
- Fontes servidas pelo próprio site (`@fontsource`), nunca Google Fonts em produção.
- JavaScript só onde há interação (estante, busca, lousas, apresentação, alternância
  lista/cards, tema). Página de artigo sem esses componentes deve funcionar sem JS.
- Respeitar `prefers-reduced-motion` em toda animação: com ele ligado, tudo aparece no
  estado final, sem prender a tela.

**A decidir por você** (proponha na Fase 0 e registre em `docs/decisoes.md`)
- Framework. O blog atual usa Astro 7 com Expressive Code e MDX; trocar só se houver ganho
  real. Critérios: desempenho, componentes interativos dentro do Markdown, blocos de código
  com diff, facilidade de manutenção pelo próprio Claude Code.
- Busca. Requisitos: ignora acentos; frase exata primeiro, depois todas as palavras;
  relevância título > tags > descrição > corpo; aceita `#tag`; link compartilhável `/?q=termo`;
  atalhos ⌘K, Ctrl+K e `/`; o índice só é baixado quando a busca abre; continua rápida com
  centenas de posts. Compare o índice próprio do blog atual com uma alternativa como o
  Pagefind (índice em fragmentos): meça com os 26 posts reais e com uns 500 posts sintéticos
  (tamanho baixado e tempo até o primeiro resultado) e escolha com números.
- Metas: Lighthouse ≥ 95 em desempenho, acessibilidade, boas práticas e SEO na home e num
  artigo, no celular.

## 4. Sistema visual (decidido)

### 4.1 Tipografia
- Títulos: **Besley** (700–900). Texto: **Literata** (com eixo `opsz`). Código: **JetBrains Mono**.
- Artigo: corpo 18,5px, entrelinha 1,72, coluna de texto com no máximo 680px.
  Números em estilo antigo (`oldstyle-nums`) no texto corrido.
- Sem fonte de "letra de mão" em lugar nenhum, inclusive nos desenhos e nas lousas.

### 4.2 Cores (tokens em variáveis CSS)
| Token | Claro | Escuro |
|---|---|---|
| `--paper` (fundo) | `#ECEEE9` | `#182022` |
| `--paper-hi` (superfícies) | `#F7F8F4` | `#1F282A` |
| `--well` | `#E0E3DC` | `#12181A` |
| `--ink` | `#1C2427` | `#E3E6DF` |
| `--ink-2` | `#56605E` | `#A7AFAB` |
| `--ink-3` | `#7A8381` | `#848D89` |
| `--rule` | `#C4CAC3` | `#343E40` |
| `--link` | `#244A8A` | `#9FB8E8` |
| aviso Nota | `#3F5878` | `#9DB3D4` |
| aviso Dica / linha adicionada | `#2F6B4F` | `#86C3A2` |
| aviso Importante | `#654262` | `#C7A3C2` |
| aviso Atenção | `#9A6B12` | `#E0B560` |
| aviso Cuidado / linha removida | `#A3432A` | `#E7957C` |

- Tema: segue o sistema, com alternância discreta (claro, escuro, sistema) guardada no
  navegador e script anti-piscada no `<head>`.
- **Cor de cada categoria** (tecido do livro, usada na lombada, na capa, no chip, na barra de
  leitura e no destaque dos desenhos). No tema escuro, o destaque dos desenhos usa a cor
  misturada com 42% de branco.

| Categoria | Tecido | Texto sobre o tecido |
|---|---|---|
| Arquitetura | `#1F4D4A` | `#EFEADF` |
| Java | `#7A3E25` | `#F2E7DA` |
| Observabilidade | `#C39A3E` | `#1C2427` |
| DevOps | `#3F5878` | `#E8ECF2` |
| Dados | `#654262` | `#F1E7EF` |
| Segurança | `#55612E` | `#EEF0E2` |

Categoria nova ganha cor distinta das demais, cadastrada num único arquivo de taxonomia.

- **Série "Atualizações do Java"**: encadernação de couro `#3A2A22`, letras douradas
  `#D8B66C`, fita marcadora `#9E3B26`. Cada série nova define a própria particularidade
  (encadernação, cor, ornamento) no cadastro de séries.

## 5. Páginas

### 5.1 Home
Referência: aba "Home" do protótipo.
- **Cabeçalho**: "Cesar Schutz" à esquerda; à direita Artigos, Tags, Buscar (com ⌘K) e RSS.
- **Abertura**: nome, uma frase em primeira pessoa e a linha curta sobre IA; ao lado, a
  **estante**. Em telas menores que ~860px a estante desce para baixo do texto.
- **Estante**:
  - Um livro por categoria. A **espessura da lombada acompanha o número de posts**
    (fórmula do protótipo: `min(104, 34 + 14·log2(1+n))` px). Título na vertical, faixas
    decorativas, número de posts no pé.
  - Depois das categorias, um **aparador de livros** e os livros de **série**
    (encadernação própria, fita marcadora saindo do topo).
  - O último livro de categoria fica inclinado. Na **primeira visita da sessão**, ele começa
    em pé e tomba devagar até apoiar no vizinho (uma vez só; `sessionStorage`).
  - Ao passar o mouse, a lombada sobe alguns pixels.
  - **Abrir um livro**: a lombada sai e deixa o espaço vazio na prateleira; abaixo da estante
    abre uma gaveta com o livro girando da lombada para a capa (3D) e, ao lado, o **sumário
    em lista com filtro** (ignora acentos; agrupado por ano; nas séries, em ordem de leitura
    com "Parte N"). **Trocar de livro** fecha o atual (gira de volta e volta para a
    prateleira) antes de abrir o próximo; cliques rápidos terminam a animação e abrem o
    último escolhido. Botão "Fechar livro" e tecla Esc.
  - No celular, as lombadas diminuem para caber todas na largura.
- **Destaque**: o post mais recente, com a ilustração em 3:2, categoria, data, tempo de
  leitura, título, subtítulo e tags. O post em destaque **não se repete** na lista abaixo.
- **Artigos recentes**: alternância **Lista / Cards** (guardada no navegador).
  Lista: data, título, subtítulo, categoria, tempo de leitura e miniatura quadrada à direita.
  Cards: grade com a ilustração em 3:2 no topo. Link para todos os artigos.
- **Tags**: nuvem com contagem; clicar abre a busca filtrada por `#tag`.
- Sem animação de entrada nas seções.

### 5.2 Páginas de apoio
Todos os artigos (`/archive/`), categoria, tag, série (ordem de leitura) e `/java/`
(página especial da série; porte do blog atual). Mesma linguagem visual, sem inventar
componentes novos.

### 5.3 Artigo
Referência: aba "Artigo" do protótipo.
- **Topo**: a ilustração vem **antes do título** (recorte largo no computador, 3:2 no celular),
  depois trilha "Artigos › Categoria" (ou "Séries › Nome"), título, subtítulo, data,
  "Atualizado em" quando houver, tempo de leitura.
- **Título e subtítulo**: o `title` do frontmatter usa " — " para separar; o que vem depois
  vira subtítulo.
- **Barra de progresso de leitura**: faixa de 3px no topo, na cor da categoria.
- **Sumário**: lateral fixo em telas ≥ 1300px (marca a seção atual); recolhível no início do
  texto nas menores. Só aparece com 3 ou mais seções.
- **Notas laterais**: notas de rodapé do Markdown viram notas na margem em telas ≥ 1180px e
  abrem no lugar, ao tocar no número, nas menores.
- **Avisos** (inspirados nos admonitions da documentação do Spring), cinco tipos com ícone
  de traço e cor própria, fundo levemente tingido, borda fina (nada de borda grossa à
  esquerda): **Nota, Dica, Importante, Atenção, Cuidado**. Sintaxe no Markdown estilo
  GitHub (`> [!NOTA]`, `> [!DICA]`, `> [!IMPORTANTE]`, `> [!ATENCAO]`, `> [!CUIDADO]`,
  aceitando também os nomes em inglês). Uso com moderação: aviso é conteúdo, não enfeite.
- **Código**: como o blog atual (Expressive Code): nome do arquivo no topo, linguagem, botão
  Copiar, linhas destacadas, números de linha opcionais, seções recolhíveis e **diff**
  (`ins`/`del`) com fundo tingido e `+`/`−` na margem. "Copiar" leva a versão final, sem as
  linhas removidas. Tema de cores feito com os tokens do blog nos dois temas.
- **Lousas** (seção 7) sempre que houver fluxo ou sequência a explicar.
- **Apresentação** (quando existir): seção logo antes de "Fontes", com o título
  "Apresentação" e sem frase de apoio. Carrossel com setas e contador, tela cheia (galeria
  com ←/→) e botão **Baixar PDF**.
- **Fontes**: sempre a última seção.
- **Rodapé do post**, nesta ordem: tags; "Compartilhar" (copiar link, LinkedIn, WhatsApp e o
  compartilhar nativo do celular quando existir); **aviso sobre IA** num bloco com ícone de
  atenção, com o texto atual:
  "Artigo escrito com apoio de IA, revisado pelo autor, com o código testado. Ainda assim pode
  conter imprecisões: confirme nas fontes citadas e na documentação oficial antes de aplicar.
  Saiba mais." (link para `/sobre/#como-os-artigos-sao-produzidos`); depois a navegação
  **Artigo anterior / Próximo artigo** (ou anterior/próxima dentro da série). Sem bloco de
  "artigos relacionados".
- Botão "voltar ao topo" depois de uma tela de rolagem. Comentários (Giscus) e estatísticas
  (GoatCounter) continuam opcionais e desligados.
- Imagens do corpo abrem num lightbox. Tabelas rolam na horizontal no celular.
  Matemática com KaTeX, carregado só em posts que usam.

### 5.4 SEO e distribuição
JSON-LD (`BlogPosting` nos posts, `WebSite` na home), sitemap com `lastmod`, RSS com texto
completo dos posts recentes, canonical, Open Graph e Twitter. **Imagem de compartilhamento**
PNG 1200×630 gerada no build: título e subtítulo à esquerda, ilustração do post à direita,
nome do blog e categoria.

## 6. Ilustrações dos posts (decidido: estilo "A + C")

Cada post tem **uma ilustração** (SVG), desenhada sobre algo concreto do artigo (no exemplo
de idempotência: a chave com a etiqueta `abc-123` sobre o comprovante, com a segunda cobrança
em linha fantasma). Todos os lugares usam **recortes da mesma ilustração**; não existem mais
os quatro arquivos por post do blog atual.

A **regra de estilo** fica num arquivo separado, `docs/estilo-desenho.md`, para o Cesar poder
trocar o estilo sem mexer na regra do que desenhar. Conteúdo inicial desse arquivo:

- Traço de caneta com leve tremor de mão (filtro SVG global de deslocamento), terminais
  arredondados, desenho **de frente** (nada de perspectiva isométrica).
- **Hachura** a 45° para sombras e volume; **linha fantasma** (traço e ponto) para o que não
  acontece, alternativas e estados anteriores.
- **Uma cor só**, a da categoria do post, aplicada como preenchimento levemente fora do
  registro (deslocado alguns pixels do contorno). O resto em tinta.
- **Sem fundo próprio**: o desenho fica direto sobre a página; as áreas preenchidas usam a cor
  da superfície onde ele aparece (`var(--fig-bg, var(--paper))`), então funciona igual nos
  dois temas e dentro dos slides.
- **Espessura do traço definida pelo CSS conforme o tamanho em que o desenho aparece**
  (mais grossa na miniatura, mais fina no topo do artigo).
- Anotações em Literata itálica com linha de chamada, só nos recortes grandes; somem no
  celular e nas miniaturas.
- Proibido: cores fixas no SVG, degradês, sombras, `<image>`, fontes de letra de mão,
  emojis, texto demais.

**Regras técnicas** (ficam na skill de desenho, não no arquivo de estilo):
- SVG usa só classes e variáveis CSS. Filtros e padrões (tremor, hachura) ficam definidos
  **uma vez** no layout; o desenho não declara `id` nem `<defs>` próprios (vários desenhos
  convivem na mesma página e ids colidiriam).
- A ilustração declara seus recortes, com uma área segura central que sobrevive a todos:
  topo do artigo largo (~2,35:1), 3:2 (destaque, cards, topo no celular), 1:1 (miniatura da
  lista) e a área usada na imagem de compartilhamento.
- `alt` descritivo: o que o desenho mostra, em uma frase.
- Scripts de validação no espírito dos do blog atual (`check-cover.mjs`, `render-cover.mjs`):
  um que valida as regras acima e outro que renderiza todos os recortes, claro e escuro, num
  PNG só, para conferência visual antes de aceitar o desenho.

## 7. Lousas: diagramas que explicam (decidido)

Os diagramas de explicação dentro do post aparecem numa **lousa**. A lousa é sempre o
**contrário da página**:
- Página no tema claro: **lousa de vidro escura** (`#15191C`, reflexo diagonal sutil, borda
  `#2C3438`), traço de caneta clara (`#F4F6F5`), destaque na cor da categoria clareada
  (`color-mix(in oklab, cor, #9ff5dc 55%)`).
- Página no tema escuro: **quadro branco suavizado** (`#CFD5D1`, borda de alumínio
  `#8F989D`), caneta escura (`#16212B`), destaque na cor da categoria escurecida
  (`color-mix(in oklab, cor, #0b6f58 35%)`). Nunca branco puro, para não ofuscar.
- Traço de **canetinha** nas duas (sem giz), com leve tremor. Rótulos na mesma Literata
  itálica do blog; nada de letra de mão.
- **A caneta aparece desenhando**: enquanto uma seta é traçada, a caneta fica na ponta do
  traço e acompanha o desenho; textos são escritos da esquerda para a direita com a caneta
  seguindo. A caneta assume a cor do que está desenhando (cor da categoria nos destaques).
  Parou de rolar, a caneta para; rolou para cima, o desenho se apaga.
- Os rótulos e caixas iniciais do cenário podem já estar desenhados ("o professor montou o
  quadro antes da aula").

Três componentes, todos na lousa, com a mesma linguagem:

1. **Passo a passo com a rolagem**: o texto rola à esquerda em parágrafos; a lousa fica fixa
   à direita e avança um passo por parágrafo (o parágrafo atual fica em destaque). No
   celular a lousa fica fixa no topo (até ~40% da altura) e os parágrafos passam por baixo em
   cartões. Se o desenho não couber legível no celular, a versão pequena vira quadros
   parados, um por passo, junto de cada parágrafo.
2. **Linha do tempo de arrastar**: comparação que avança no tempo (ex.: "com e sem a chave").
   Controle deslizante + **botão play/pausa** à esquerda (percorre em ~7 s, para 1,5 s no
   resultado e recomeça). Também responde a arrastar sobre o desenho e à roda do mouse (com
   ou sem Shift); nas pontas, a roda volta a rolar a página. Qualquer gesto manual pausa a
   reprodução. Texto do estado atual com `aria-live`.
3. **Animação curta em loop**: poucos segundos, com **barra de tempo** por baixo (marcas de
   início, eventos e fim), botões **Recomeçar** e **Pausar**, e uma pausa perceptível no fim
   antes de reiniciar.

Existe também um recurso raro, a **frase em destaque**: uma citação cujas palavras acendem
com a rolagem. Use no máximo de vez em quando; o Cesar pode removê-la.

## 8. Conteúdo

### 8.1 Migração
- Migre os **26 posts** do blog atual mantendo slug, datas, categoria/série, tags e o
  conteúdo. Mantenha os recursos de Markdown que eles usam (código com `ins`/`del`, títulos
  de arquivo, KaTeX, `<details>`, tabelas).
- Série Java: porte o cadastro e as regras específicas do `CLAUDE.md` atual (um post por LTS,
  esqueleto fixo, redirecionamentos das versões intermediárias, página `/java/`).
- Apresentações existentes (`public/posts/<slug>/deck/*.webp` e `src/data/decks.json`):
  migre como estão.
- Diagramas antigos dentro dos posts (`public/posts/<slug>/*.svg`, fundo branco fixo):
  na migração, mostre-os num quadro claro para não brigar com o tema escuro; redesenhá-los
  como lousa é uma fase posterior, post a post.
- Ilustrações novas para os 26 posts: fase própria, em lotes, cada lote conferido com o
  render antes de seguir.

### 8.2 Regras de todo post novo (vão para a skill de post e para uma regra por caminho)
- **Tamanho**: posts mais curtos que os de hoje. Meta de **1.500 a 2.500 palavras**
  (8 a 12 min de leitura), teto de ~3.000. Assunto maior vira **série** ou é dividido em
  partes. Sem enchimento. Os posts existentes não precisam ser encurtados.
- **Veracidade**: nenhuma afirmação técnica sem fonte confiável e conferida (documentação
  oficial, especificações, JEPs, RFCs, release notes). Nada inventado: versões, números,
  benchmarks, citações e APIs só se verificados. Se não der para confirmar, diga isso no
  texto ou tire. Código que compila e faz sentido; exemplo grande linka o código completo.
  Links conferidos. **`## Fontes`** no fim, sempre.
- **Estrutura**: introdução com o problema concreto em 2 ou 3 frases; seções `##` claras;
  pelo menos **uma lousa** quando houver fluxo, sequência, antes/depois ou linha do tempo
  (post simples fica sem); avisos só quando ajudam; diff quando mostrar antes e depois.
- **Frontmatter**: `title` (com " — " para o subtítulo), `description` até ~200 caracteres,
  `published`, `updated` opcional, `category` **ou** `series`, `tags` (2 a 4, reaproveitando o
  vocabulário existente, sem repetir nome de categoria), `draft`.
- **Categoria**: encaixe numa existente; se nenhuma servir de verdade, pode criar uma nova
  dentro do escopo do blog, com cor distinta, e avise o Cesar.
- **Fluxo** (vale para post do zero e para texto que o Cesar traz pronto): classificar →
  escrever ou melhorar → revisar contra fontes → desenhar ilustração e lousas → validar
  (build, claro e escuro, celular) → mostrar ao Cesar. **Nunca** commitar nem publicar sem
  pedido explícito dele.

### 8.3 Apresentação do NotebookLM
- O Cesar gera a apresentação no NotebookLM e traz o **PowerPoint** (.pptx). Os slides vêm
  como imagens inteiras dentro do arquivo: extraia na ordem, converta para WebP (como o
  `scripts/deck-to-web.mjs` atual faz) e **gere no build um PDF a partir dessas imagens**
  para o botão "Baixar PDF". Proponha a biblioteca antes de instalar.
- Antes de aceitar o material, confira erros de texto e código nas imagens (o NotebookLM
  já errou palavras e nomes); se houver erro, peça para gerar de novo. Um deck por artigo.
  Os slides não substituem o texto.

## 9. Como organizar o conhecimento do projeto (para retomar em qualquer sessão)

Siga a recomendação da documentação do Claude Code: `CLAUDE.md` curto, procedimentos em
skills (carregadas sob demanda) e regras por caminho em `.claude/rules/`. Importar arquivos
com `@` organiza, mas não economiza contexto; o que economiza é skill e regra com `paths`.

- `CLAUDE.md` (**menos de 150 linhas**): o que é o projeto, stack, comandos, mapa das pastas,
  regras que valem sempre (pt-BR, não commitar sem pedido, não mexer em `../blog-atual`,
  movimento reduzido, tokens em vez de cores fixas), e a instrução:
  **"Ao começar uma sessão, leia `docs/estado.md`. Ao terminar um bloco de trabalho,
  atualize-o."** Aponte para as skills e para os docs; não copie o conteúdo deles.
- `docs/estado.md` (**até ~60 linhas**): fase atual, o que está pronto, próximos passos,
  perguntas abertas para o Cesar. É um painel, não um diário: o que ficou pronto sai daqui.
- `docs/decisoes.md`: registro curto de decisões (data, decisão, motivo, alternativas).
- `docs/estilo-desenho.md`: o estilo das ilustrações e das lousas (seções 6 e 7).
- `docs/briefing.md`: este arquivo.
- Skills em `.claude/skills/<nome>/SKILL.md` (com `name` e `description` no frontmatter),
  por exemplo: `novo-post` (fluxo completo e checklist da seção 8.2), `desenho` (regras
  técnicas da seção 6, lendo `docs/estilo-desenho.md`, e os scripts de validação), `lousa`
  (como montar os três componentes da seção 7), `apresentacao` (seção 8.3), `serie-java`.
- Regras em `.claude/rules/` com `paths`: uma para os arquivos de post (tamanho, fontes,
  frontmatter) e uma para os arquivos de desenho (aponta para o estilo e para a skill).
- Quando o Cesar corrigir a mesma coisa duas vezes, isso vira regra no lugar certo.

## 10. Fases

Trabalhe por fases. **No fim de cada fase, pare**: mostre o que foi feito, como ver
(`npm run dev` e as páginas para abrir), o que ficou pendente, e espere o Cesar aprovar
antes de seguir. Atualize `docs/estado.md` ao fechar cada fase.

0. **Preparação**: ler este briefing, as referências e o `CLAUDE.md` do blog atual; clonar o
   blog atual em `../blog-atual`; propor stack e plano de busca com critérios; criar
   `CLAUDE.md`, `docs/estado.md`, `docs/decisoes.md`, `docs/estilo-desenho.md`, as skills e as
   regras (esqueleto, completados ao longo das fases). Listar dúvidas.
1. **Base**: projeto, tokens, fontes, layout, cabeçalho, rodapé, tema com anti-piscada,
   página `/sobre/` mínima, deploy de pré-visualização configurado (sem trocar o domínio).
2. **Conteúdo e rotas**: migração dos 26 posts, esquema do frontmatter, categorias, tags,
   séries, `/java/`, todos os artigos, redirecionamentos, RSS, sitemap, JSON-LD, busca.
3. **Home**: estante completa, destaque, lista e cards, tags.
4. **Artigo**: topo, sumário, notas laterais, avisos, código, barra de leitura,
   compartilhar, aviso de IA, navegação, apresentação, lightbox.
5. **Desenho e lousas**: definições globais, recortes, imagem de compartilhamento, scripts de
   validação e render, os três componentes de lousa e a frase em destaque. Recriar o artigo
   de idempotência com ilustração e lousas como post de referência.
6. **Ilustrações dos posts existentes**, em lotes conferidos.
7. **Qualidade e publicação**: Lighthouse, acessibilidade (teclado, foco visível, contraste,
   leitores de tela), `astro check` (ou equivalente) sem erros, revisão visual claro/escuro e
   celular, links. Plano para apontar o domínio para o novo site, **executado só com o
   OK do Cesar**.
