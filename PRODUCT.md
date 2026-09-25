# Product

<!-- impeccable:product-schema 1 -->

<!-- Registro de produto do Impeccable (init de 25/09/2026, respostas do Cesar). Os títulos das seções
ficam em inglês porque o Impeccable os lê pelo nome; o conteúdo é pt-BR. As decisões de produto e design
continuam em docs/briefing.md (fonte da verdade) e o visual, no DESIGN.md: se este arquivo divergir
deles, valem eles, e este arquivo é corrigido. -->

## Platform

web

## Users

- **Principal: desenvolvedores que pesquisam um tema.** Pessoas que falam português e chegam de uma
  busca querendo entender um assunto específico (Java, arquitetura, IA, dados, segurança, DevOps, SRE,
  carreira).
- **O próprio Cesar, como caderno.** O blog é o registro do que ele estuda: "quando o estudo rende
  algo que vale guardar, vira artigo". Ele também é quem consulta os artigos antigos depois.

## Product Purpose

Blog técnico pessoal de Cesar Schutz, arquiteto de soluções, em pt-BR, em
<https://blog.cesarschutz.com.br>. É só um blog: artigos, categorias, tags, séries, busca e RSS.

Sucesso é:

- **o leitor entender o assunto de verdade** ao sair do artigo, com as fontes à mão para conferir;
- **constância de estudo:** o blog mantém o hábito de estudar e publicar.

Audiência, reputação e crescimento não são metas deste registro.

## Positioning

O que o blog faz e outro blog técnico em pt-BR não pode copiar sem mudar o jeito de trabalhar:

- **Rigor com fontes:** nenhuma afirmação técnica sem fonte primária aberta e conferida; `## Fontes`
  no fim de todo post; frase de autor só com a fonte primária aberta.
- **Código e SQL testados antes de publicar**, não só "que compila".
- **Explicação visual:** ilustração própria em cada post, lousas passo a passo e, quando existe, a
  apresentação em slides com o PDF.
- **Série Java por LTS:** um guia por versão LTS, com as versões intermediárias absorvidas, como
  referência de consulta.
- **Organização em livros:** cada categoria é um volume de uma coleção numerada e cada série é uma
  revista técnica (cada post, uma edição).
- **Transparência sobre IA:** os textos são escritos com apoio de IA e revisados pelo Cesar, e isso
  está dito no fim de cada post.

## Operating Context

- Leitura longa de artigo técnico, no computador e no celular, em tema claro ou escuro.
- O leitor chega pela busca externa ou pelo RSS e navega pela estante (categorias como livros), pelas
  tags, pelas séries e pela busca interna (⌘K, Ctrl+K, `/`, link `/?q=termo`).
- Posts novos e adaptados seguem a skill `post`; o Cesar traz textos para adaptar em `entrada/` e
  apresentações do NotebookLM em `.pptx`.
- Publicação: todo push na `main` publica o site (GitHub Pages).

## Capabilities and Constraints

- Site estático em Astro, sem backend. JavaScript só onde há interação; artigo sem esses componentes
  funciona sem JS.
- URLs existentes não podem quebrar (lista no `CLAUDE.md` e na D7 de `docs/decisoes.md`).
- Posts de 1.500 a 2.500 palavras (teto de ~3.000); assunto maior vira série.
- Frontmatter, categorias, tags e séries seguem `docs/briefing.md` §8.2 e `docs/capas/CAPAS.md`.
- Estatísticas (GoatCounter) e comentários (Giscus) estão prontos e **desligados**
  (`src/data/site.ts`); ligar é decisão do Cesar.
- **Em aberto:** a página Sobre (o Cesar escreve depois; `/about/` leva à home).

## Brand Commitments

- Autor: Cesar Schutz, arquiteto de soluções. Foto em `public/autor.webp`; perfis no GitHub e no
  LinkedIn (`src/data/site.ts`).
- Marca: o livro "cs" (`src/components/Marca.astro`, gerado por `scripts/marca.mjs`).
- Voz: profissional e direta, em pt-BR com acentuação correta, sem enchimento. Ao adaptar um texto do
  Cesar, a voz dele é preservada.
- Textos fixos do site em `TEXTOS` (`src/data/site.ts`) e o aviso sobre IA no fim de cada post
  (`docs/briefing.md` §5.3).
- Não pode parecer feito por IA (regras no `CLAUDE.md` e no `DESIGN.md`).

## Evidence on Hand

- 26 posts publicados em `src/content/posts/`, com as ilustrações em `src/ilustracoes/`, as lousas em
  `src/lousas/` e as apresentações em `public/posts/<slug>/deck/` (`src/data/decks.json`).
- **Não existem e não podem ser inventados:** depoimentos, números de audiência, métricas de leitura
  e benchmarks próprios sem medição.

## Product Principles

1. **Entender vem antes de impressionar.** Toda escolha serve para o leitor sair entendendo.
2. **Nada sem fonte, nada sem teste.** Afirmação conferida na fonte primária; código e SQL rodados
   antes de publicar. O que não deu para confirmar é dito no texto ou sai.
3. **Mostrar, não só descrever.** Quando há fluxo, sequência ou antes e depois, há desenho.
4. **O blog é um caderno que dura.** Estudo organizado em livros e séries, links que não quebram,
   artigos que continuam úteis para consulta.
5. **Honestidade sobre o processo.** O apoio de IA é declarado; a revisão é do Cesar.

## Accessibility & Inclusion

- Contraste mínimo dos tokens conferido por `npm run contraste` (D22), com 4,5:1 no texto pequeno;
  a Carreira e a série Java nos títulos grandes são exceção decidida na D35.
- Teclado e foco visível em tudo o que é interativo; `prefers-reduced-motion` respeitado em toda
  animação.
- Meta de Lighthouse ≥ 95 em desempenho, acessibilidade, boas práticas e SEO, no celular, na home e
  num artigo.
