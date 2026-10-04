---
paths:
  - "src/content/posts/**/*.{md,mdx}"
---

# Arquivos de post

Para criar, adaptar, reescrever ou revisar um post, siga a skill `post` (e o `DESIGN.md`). O essencial:

- **Formato (D63):** todo post, novo ou ajustado, começa por uma conversa com o Cesar: **detalhado**
  (1.500 a 2.500 palavras, teto de ~3.000, com o TL;DR) ou **resumo** (700 a 1.200, com o infográfico),
  a estrutura do que entra e as fontes (os links que ele estudou ou, sem eles, fontes confiáveis).
  Assunto maior vira post em partes. Os posts migrados do blog atual não precisam ser encurtados.
- **Escrita (D71, skill `post`, seção "Escrita"):** confira com `npm run escrita -- <slug>`.
  - **Título:** "Assunto — complemento". O assunto, sozinho, diz do que o post trata, com o termo que o
    leitor procuraria na frente (a tecnologia e o tema). Nunca pergunta, trocadilho, gancho, nem o nome
    de um projeto que só o Cesar conhece. O título é do assunto do post, não do exemplo. Alvo de ~65
    caracteres, teto de 85.
  - **Descrição:** uma ou duas frases com verbo, o essencial nos primeiros 160 caracteres (teto de
    200), sem repetir o título.
  - **Abertura:** o primeiro parágrafo diz o assunto e por que importa; o segundo, o que o post cobre e
    para quem. O exemplo, a história e a imagem vêm depois. Sem pergunta ao leitor na abertura.
  - **Voz:** nunca a primeira pessoa ("eu", "criei", "testei", "fiz", "meu"), nem "nós". O sujeito é a
    coisa, ou o infinitivo, ou "você". O que foi rodado vira fato com data.
  - **TL;DR:** cada ponto é uma conclusão que se entende sozinha, do mais importante para o menos.
- **Post em partes (D71, skill `post`):** assunto que passa do teto e tem dois temas que se sustentam
  sozinhos vira dois posts ligados. Cada parte com o assunto próprio no título e "(parte N de M)" no
  fim, o aviso `> [!NOTA] Parte N de M` depois da abertura com o link da outra, e a parte 2 com a
  recapitulação. Publicadas juntas.
- **Veracidade:** nenhuma afirmação técnica sem fonte confiável conferida. Nada inventado: versões,
  números, benchmarks, citações e APIs só entram se verificados. `## Fontes` é sempre a última seção.
- **Links ao longo do texto (D63):** cada fonte entra onde o texto fala do que ela diz (o link nas
  palavras do assunto) e também em `## Fontes`.
- **Frontmatter:**
  - `title`, com " — " separando o subtítulo (o assunto antes, o recorte depois);
  - `description`, com o essencial nos primeiros 160 caracteres;
  - `published` e, se houver revisão relevante, `updated`;
  - `category` **ou** `series`;
  - `tags`: de 2 a 4, do vocabulário existente, sem repetir nome de categoria;
  - `formato` (`detalhado` ou `resumo`) e, no detalhado, `tldr` (de 3 a 5 pontos, **cada um entre
    aspas**);
  - `draft`.
- **Categoria** = um dos livros da coleção (`src/livros/livros.json`), o do que o post ensina.
  **A coleção ainda serve? (D78)** Em todo post, pense se os livros continuam bons com ele: o normal é
  não mudar, mas se o post não cabe bem em nenhum livro, ou se a coleção ficaria melhor com um livro
  novo, dividido ou renomeado, avise o Cesar e sugira (skill `post`, passo 2). Livro novo segue a seção
  "Livros novos" de `docs/capas/CAPAS.md` (cor, desenho, ícone, volume em ordem alfabética), só com o OK
  dele.
- `$` em texto precisa de escape (`US\$ 10`).
- Post da série Java: siga a skill `serie-java`.
- Nunca commite nem publique sem pedido do Cesar.
