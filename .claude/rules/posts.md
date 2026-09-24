---
paths:
  - "src/content/posts/**/*.{md,mdx}"
---

# Arquivos de post

Para criar, reescrever ou revisar um post, siga a skill `novo-post`. O essencial:

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
- **Categoria nova** só se nenhuma servir. Cadastre com cor distinta em `src/data/taxonomia.ts` e avise o Cesar.
- `$` em texto precisa de escape (`US\$ 10`).
- Post da série Java: siga a skill `serie-java`.
- Nunca commite nem publique sem pedido do Cesar.
