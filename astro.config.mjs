// @ts-check
import { defineConfig } from "astro/config";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import expressiveCode from "astro-expressive-code";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { remarkTemMatematica } from "./src/plugins/remark-tem-matematica.mjs";
import { rehypeTabela } from "./src/plugins/rehype-tabela.mjs";
import { rehypeAvisos } from "./src/plugins/rehype-avisos.mjs";
import { rehypeNotasLaterais } from "./src/plugins/rehype-notas-laterais.mjs";
import { rehypeApresentacao } from "./src/plugins/rehype-apresentacao.mjs";
import { marcacoes, pluginAlturaEstimada, pluginCopiarSemRemovidas, pluginLinguagem, temasDeCodigo } from "./src/lib/codigo.ts";
import { ABSORBED } from "./src/data/java.ts";
import { NOMES_ANTIGOS } from "./src/data/taxonomia.ts";

// A pré-visualização (D13) rodaria com BASE_PATH=/novo-blog e PREVIEW=true; em produção, base "/".
const base = process.env.BASE_PATH ?? "/";
/** @param {string} caminho */
const comBase = (caminho) => `${base.replace(/\/$/, "")}${caminho}`;

// Data de modificação de cada post (updated ou published) para o <lastmod> do sitemap.
// PASTA_POSTS e OUT_DIR só mudam na medição da busca (scripts/bench-busca).
const PASTA_POSTS = process.env.PASTA_POSTS ?? "./src/content/posts";
const modificadoEm = Object.fromEntries(
  readdirSync(PASTA_POSTS)
    .filter((f) => /^[^_].*\.mdx?$/.test(f))
    .map((f) => {
      const fm = readFileSync(`${PASTA_POSTS}/${f}`, "utf8").split("---")[1] ?? "";
      const data = fm.match(/^updated:\s*(\S+)/m)?.[1] ?? fm.match(/^published:\s*(\S+)/m)?.[1];
      return [f.replace(/\.mdx?$/, ""), data];
    }),
);

// URLs antigas que continuam valendo (D7). A página Sobre saiu (D33): /about/ leva à home, até o Cesar
// escrever a dele.
// /2/ e /3/ voltaram a ser as páginas da home (D27). As categorias que viraram livros com outro nome
// (D30) levam ao livro novo.
const redirecionamentos = {
  "/about": comBase("/"),
  "/projects": comBase("/"),
  "/exercicios": comBase("/"),
  // A página da série Java passou para /series/java/, como as categorias (D32).
  "/java": comBase("/series/java/"),
  ...Object.fromEntries(
    Object.entries(NOMES_ANTIGOS).map(([antigo, novo]) => [
      `/categories/${antigo}`,
      // Sem codificar: o Astro codifica o destino do redirecionamento (com %20 aqui, sairia %2520).
      comBase(`/categories/${novo}/`),
    ]),
  ),
  ...Object.fromEntries(
    Object.entries(ABSORBED)
      .filter(([v]) => !existsSync(`${PASTA_POSTS}/java-${v}.md`))
      .map(([v, lts]) => [`/posts/java-${v}`, comBase(`/posts/java-${lts}/#java-${v}`)]),
  ),
};

export default defineConfig({
  site: process.env.SITE_URL ?? "https://blog.cesarschutz.com.br",
  base,
  outDir: process.env.OUT_DIR ?? "./dist",
  trailingSlash: "ignore",
  // CSS embutido no HTML: no celular, os arquivos .css separados atrasavam o primeiro texto (LCP) em
  // cerca de 1 s no Lighthouse; embutidos, somam ~6 KB com gzip por página.
  build: { inlineStylesheets: "always" },
  devToolbar: { enabled: false },
  // Os builds da medição da busca (bench/) têm milhares de arquivos: o dev não precisa vigiá-los.
  vite: { server: { watch: { ignored: ["**/bench/**"] } } },
  redirects: redirecionamentos,
  integrations: [
    // O Expressive Code precisa vir antes do MDX.
    expressiveCode({
      themes: temasDeCodigo,
      // Sem data-theme, segue o sistema; com data-theme, a escolha do leitor manda (D24).
      useDarkModeMediaQuery: true,
      themeCssRoot: ":root",
      themeCssSelector: (tema) => (tema.type === "dark" ? "[data-theme='dark']" : "[data-theme='light']"),
      defaultLocale: "pt-BR",
      plugins: [pluginLineNumbers(), pluginCollapsibleSections(), pluginCopiarSemRemovidas(), pluginLinguagem(), pluginAlturaEstimada()],
      defaultProps: { showLineNumbers: false },
      minSyntaxHighlightingColorContrast: 5.5,
      styleOverrides: {
        borderRadius: "10px",
        borderColor: "var(--rule)",
        codeFontFamily: "var(--font-codigo)",
        codeFontSize: "14px",
        codeLineHeight: "1.65",
        uiFontFamily: "var(--font-ui)",
        uiFontSize: "14px",
        frames: {
          shadowColor: "transparent",
          editorActiveTabIndicatorTopColor: "transparent",
          editorActiveTabIndicatorBottomColor: "transparent",
          tooltipSuccessBackground: "var(--ink)",
          tooltipSuccessForeground: "var(--paper)",
        },
        textMarkers: marcacoes,
      },
    }),
    mdx(),
    sitemap({
      filter: (pagina) => !/\/og\//.test(pagina),
      serialize(item) {
        const slug = item.url.match(/\/posts\/([^/]+)\/?$/)?.[1];
        const data = slug && modificadoEm[slug];
        if (data) item.lastmod = new Date(data).toISOString();
        return item;
      },
    }),
  ],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath, remarkTemMatematica],
      rehypePlugins: [rehypeKatex, rehypeTabela, rehypeAvisos, rehypeNotasLaterais, [rehypeApresentacao, { base: comBase("/") }]],
    }),
  },
});
