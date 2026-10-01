---
paths:
  - "src/content/posts/**/*.{md,mdx}"
---

# Arquivos de post

Para criar, adaptar, reescrever ou revisar um post, siga a skill `post` (e o `DESIGN.md`). O essencial:

- **Tamanho:** de 1.500 a 2.500 palavras (8 a 12 min), com teto de ~3.000. Assunto maior vira série
  ou partes. Os posts migrados do blog atual não precisam ser encurtados.
- **Veracidade:** nenhuma afirmação técnica sem fonte confiável conferida. Nada inventado: versões,
  números, benchmarks, citações e APIs só entram se verificados. `## Fontes` é sempre a última seção.
- **Frontmatter:**
  - `title`, com " — " separando o subtítulo;
  - `description` com até ~200 caracteres;
  - `published` e, se houver revisão relevante, `updated`;
  - `category` **ou** `series`;
  - `tags`: de 2 a 4, do vocabulário existente, sem repetir nome de categoria;
  - `draft`.
- **Categoria** = um dos livros da coleção (`src/livros/livros.json`), o do que o post ensina.
  **A coleção ainda serve? (D61)** Em todo post, pense se os livros continuam bons com ele: o normal é
  não mudar, mas se o post não cabe bem em nenhum livro, ou se a coleção ficaria melhor com um livro
  novo, dividido ou renomeado, avise o Cesar e sugira (skill `post`, passo 2). Livro novo segue a seção
  "Livros novos" de `docs/capas/CAPAS.md` (cor, desenho, ícone, volume em ordem alfabética), só com o OK
  dele.
- `$` em texto precisa de escape (`US\$ 10`).
- Post da série Java: siga a skill `serie-java`.
- Nunca commite nem publique sem pedido do Cesar.
