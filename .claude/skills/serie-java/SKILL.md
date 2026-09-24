---
name: serie-java
description: Regras da série Atualizações do Java (só LTS), com o esqueleto fixo dos posts java-NN, a linha Chegou em, as tabelas de JEPs, as versões absorvidas com seus redirecionamentos e a página /series/java/ (/java/ redireciona). Use ao criar ou atualizar um post java-NN ou o guia, ou quando sair uma versão nova do Java.
---

# Série "Atualizações do Java"

Esqueleto da Fase 0, portado do `CLAUDE.md` do blog atual. Ainda falta completar:
- dados, rotas e página `/series/java/` (Fase 2; D32 mudou de `/java/`, que redireciona);
- ilustrações da série (Fase 6).

## Estrutura da série

- No frontmatter: `series: java`, **sem** `category`. Na estante, é o livro de couro (`#3A2A22`,
  letras douradas `#D8B66C`, fita `#9E3B26`), cadastrado em `src/data/series.ts`.
- Um post por LTS: `java-8`, `java-11`, `java-17`, `java-21` e `java-25`. Além deles:
  - `java-29`, "Rumo à próxima LTS", atualizado a cada release intermediária;
  - `guia-atualizacoes-java`.
- Ordem de leitura: o guia é a Parte 1, e depois vêm as LTS em ordem crescente.
- Cada post reúne o que as versões intermediárias trouxeram desde a LTS anterior.

## Esqueleto fixo de cada post

- **Introdução** (data, período coberto, para quem migra de qual LTS) e `## Linha do tempo` com
  diagrama. Exceção: o Java 8, primeiro da série, usa `## Visão geral` e uma tabela com a coluna Área.
- **Seções por tema.** Em cada recurso vem a linha
  `**Chegou em:** Java 14 (preview, [JEP 359](…)) → Java 16 (final, [JEP 395](…))`,
  e depois explicação, código e diagrama quando ajudar. Rótulos permitidos: final, preview,
  2ª preview…, incubadora, experimental, depreciado, removido.
- **Recursos ainda em preview ou incubadora**, e cuidados de migração.
- **`## Todas as JEPs, versão a versão`**:
  - h3 **exatamente** `### Java NN`, porque as âncoras `#java-NN` são usadas pelos redirecionamentos;
  - tabela `| JEP | Título | Tipo |`;
  - célula JEP só com o número linkado e título oficial em inglês;
  - Tipo com vocabulário fechado: Final, Preview, Incubadora, Experimental, Depreciação, Remoção,
    Plataforma, Interno.
- **`## Fontes`**: toda afirmação sustentada por fonte oficial (openjdk.org/jeps, páginas do projeto
  JDK, release notes, Javadoc, roadmap da Oracle).

## Dados e redirecionamentos

- `src/data/java.ts` tem dois cadastros:
  - `JAVA_LTS`: versão, lançamento, o que cobre e `upcoming`;
  - `ABSORBED`: versão intermediária → LTS que a absorveu.
- `/posts/java-NN/` redireciona para `/posts/java-<LTS>/#java-NN`, gerado a partir de `ABSORBED`.
- Hoje falta `27: 29` em `ABSORBED`, embora o `java-29` já cubra o Java 27. Incluir na migração,
  por coerência (a URL `/posts/java-27/` nunca existiu).

## Procedimentos

- **Nova release intermediária** (por exemplo, Java 28):
  1. atualizar o `java-29` (seções e `### Java 28` na tabela);
  2. acrescentar `28: 29` em `ABSORBED`;
  3. ajustar o que o `JAVA_LTS` diz que o 29 cobre.
- **Nova LTS lançada** (por exemplo, Java 29):
  1. tirar `upcoming` em `JAVA_LTS`;
  2. revisar o `java-29` como LTS;
  3. criar o `java-33` como a próxima;
  4. atualizar a capa da revista em `docs/capas/livros.json` (série "Atualizações do Java"):
     `numeroDeCapa` ("29"), a lista `edicoes` (a nova no fim, que vira a edição atual) e a
     `guia.linha` ("do Java 8 ao 29, passo a passo"). O total de edições da capa sai dos posts.
- **Ilustrações da série:** não se desenha à mão. Elas saem de um script com padrão fixo
  (`scripts/desenho/java.mjs`, D17). A série é uma revista técnica (D32, `docs/capas/CAPAS.md`), com
  destaque `#c24d1c` e a xícara (`docs/capas/serie/xicara.svg`) como emblema.
