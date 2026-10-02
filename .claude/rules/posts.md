---
paths:
  - "src/content/posts/**/*.{md,mdx}"
---

# Arquivos de post

Para criar, adaptar, reescrever ou revisar um post, siga a skill `post` (e o `DESIGN.md`). O essencial:

- **Formato (D63):** todo post, novo ou ajustado, começa por uma conversa com o Cesar: **detalhado**
  (1.500 a 2.500 palavras, teto de ~3.000, com o TL;DR) ou **resumo** (700 a 1.200, com o infográfico),
  a estrutura do que entra e as fontes (os links que ele estudou ou, sem eles, fontes confiáveis).
  Assunto maior vira série ou partes. Os posts migrados do blog atual não precisam ser encurtados.
- **Veracidade:** nenhuma afirmação técnica sem fonte confiável conferida. Nada inventado: versões,
  números, benchmarks, citações e APIs só entram se verificados. `## Fontes` é sempre a última seção.
- **Links ao longo do texto (D63):** cada fonte entra onde o texto fala do que ela diz (o link nas
  palavras do assunto) e também em `## Fontes`.
- **Frontmatter:**
  - `title`, com " — " separando o subtítulo;
  - `description` com até ~200 caracteres;
  - `published` e, se houver revisão relevante, `updated`;
  - `category` **ou** `series`;
  - `tags`: de 2 a 4, do vocabulário existente, sem repetir nome de categoria;
  - `formato` (`detalhado` ou `resumo`) e, no detalhado, `tldr` (de 3 a 5 pontos, **cada um entre
    aspas**);
  - `draft`.
- **Categoria** = um dos livros da coleção (`src/livros/livros.json`): Arquitetura de Software,
  Desenvolvimento de Software, Dados, IA, Segurança, DevOps, SRE ou Carreira. **Categoria nova** só se
  nenhuma servir: é um livro novo, pela seção "Livros novos" de `docs/capas/CAPAS.md` (cor, desenho,
  ícone, volume). Avise o Cesar antes.
- `$` em texto precisa de escape (`US\$ 10`).
- Post da série Java: siga a skill `serie-java`.
- Nunca commite nem publique sem pedido do Cesar.
