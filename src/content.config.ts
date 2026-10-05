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
      /**
       * O código-fonte do artigo (D52, C03): a pasta dele no repositório de exemplos
       * (https://github.com/cesarschutz/blog-exemplos/tree/main/<pasta>). Aparece no topo do artigo e
       * como sinal nas listas, nos cards, no anterior / próximo e na busca.
       */
      codigo: z.url({ protocol: /^https$/, message: "codigo: o endereço do código, com https://" }).optional(),
      /**
       * O formato combinado com o Cesar antes de escrever (D63): "detalhado" (o post completo, com o TL;DR)
       * ou "resumo" (mais curto, com o infográfico). Os posts de antes da D63 não têm o campo.
       */
      formato: z.enum(["detalhado", "resumo"]).optional(),
      /**
       * O TL;DR (D63): de 2 a 6 pontos curtos, cada um uma frase (aceitam `código`, **negrito** e links).
       * Aparece fechado no alto do texto; o leitor clica para abrir (Tldr.astro). Cada ponto vai entre
       * aspas: com ": " no meio, o YAML lê o ponto como um objeto.
       */
      tldr: z
        .array(z.string({ message: 'tldr: escreva cada ponto entre aspas (com ": " no meio, o YAML lê o ponto como objeto)' }).min(1))
        .min(2)
        .max(6)
        .optional(),
      draft: z.boolean().default(false),
    })
    .refine((d) => Boolean(d.category) !== Boolean(d.series), {
      message: "Use category ou series, nunca os dois (e nunca nenhum).",
    }),
});

export const collections = { posts };
