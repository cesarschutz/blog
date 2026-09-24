/**
 * Esquema do frontmatter dos posts (briefing §8.2). Arquivo com "_" na frente fica fora (modelos).
 */
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { CATEGORIAS } from "./data/taxonomia";
import { SERIES } from "./data/series";

const categorias = CATEGORIAS.map((c) => c.nome);
const series = SERIES.map((s) => s.chave);

const posts = defineCollection({
  // PASTA_POSTS só é usada pela medição da busca (scripts/bench-busca), com posts sintéticos.
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: process.env.PASTA_POSTS ?? "./src/content/posts" }),
  schema: z
    .object({
      /** "Assunto — complemento": o que vem depois de " — " vira subtítulo. */
      title: z.string(),
      /** Até ~200 caracteres; aceita `código` e **negrito**. */
      description: z.string(),
      published: z.coerce.date(),
      /** Última revisão relevante: aparece como "Atualizado em" e no sitemap. */
      updated: z.coerce.date().optional(),
      category: z
        .string()
        .refine((c) => categorias.includes(c), { message: "Categoria fora de src/data/taxonomia.ts" })
        .optional(),
      series: z
        .string()
        .refine((s) => series.includes(s), { message: "Série fora de src/data/series.ts" })
        .optional(),
      tags: z.array(z.string()).min(2).max(4),
      draft: z.boolean().default(false),
    })
    .refine((d) => Boolean(d.category) !== Boolean(d.series), {
      message: "Use category ou series, nunca os dois (e nunca nenhum).",
    }),
});

export const collections = { posts };
