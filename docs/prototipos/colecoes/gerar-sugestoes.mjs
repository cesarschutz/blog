#!/usr/bin/env node
/**
 * Gera docs/prototipos/colecoes/sugestoes.md a partir de colecoes.json (a fonte única das sugestões):
 * cada sugestão com a ideia, os livros na ordem dos volumes (título, frase, o que abrange, de onde vem,
 * os posts, a cor e o desenho, com o motivo) e o que muda.
 *
 *   node docs/prototipos/colecoes/gerar-sugestoes.mjs
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const aqui = dirname(fileURLToPath(import.meta.url));
const raiz = join(aqui, "..", "..", "..");
const dados = JSON.parse(readFileSync(join(aqui, "colecoes.json"), "utf8"));

// O título de cada post (a parte antes do travessão), lido do frontmatter.
const pastaPosts = join(raiz, "src", "content", "posts");
const titulos = Object.fromEntries(
  readdirSync(pastaPosts).map((arquivo) => {
    const texto = readFileSync(join(pastaPosts, arquivo), "utf8");
    const titulo = /^title:\s*"?(.*?)"?\s*$/m.exec(texto)?.[1] ?? arquivo;
    return [arquivo.replace(/\.mdx?$/, ""), titulo.split(" — ")[0]];
  }),
);

const maiuscula = (t) => `${t.charAt(0).toUpperCase()}${t.slice(1)}`;

const frase = (lista) => {
  const t = lista.join(", ");
  return `${t.charAt(0).toUpperCase()}${t.slice(1)}.`;
};

const linhas = [
  "# As cinco sugestões de coleção",
  "",
  "Gerado de `colecoes.json` por `gerar-sugestoes.mjs`; não edite à mão. As capas e a estante de cada",
  "sugestão estão na página `/amostra/colecoes/` (só no dev).",
  "",
  "## Vale para todas",
  "",
  ...(dados.valeParaTodas ?? []).map((t) => `- ${t}`),
  "",
];

let n = 0;
for (const s of dados.sugestoes) {
  if (s.id === "hoje") continue;
  n++;
  const total = Object.values(s.posts ?? {}).flat().length;
  linhas.push(`## Sugestão ${n} · ${s.nome} (${s.livros.length} livros)`, "", s.ideia, "");
  s.livros.forEach((slug, i) => {
    const l = { ...dados.livros[slug], ...(s.sobrescreve?.[slug] ?? {}) };
    const posts = (s.posts?.[slug] ?? []).map((p) => titulos[p] ?? p);
    linhas.push(`### ${String(i + 1).padStart(2, "0")} · ${l.titulo}`, "", `*${l.frase}*`, "");
    linhas.push(`- **Abrange:** ${frase(l.abrange)}`);
    if (l.vemDe) linhas.push(`- **Vem de:** ${l.vemDe}`);
    linhas.push(`- **Posts (${posts.length}):** ${posts.length ? `${posts.join("; ")}.` : "nenhum ainda."}`);
    linhas.push(`- **Cor:** ${l.nomeCor ?? "cor"} (\`${l.cor}\`).${l.motivoCor ? ` ${maiuscula(l.motivoCor)}.` : ""}`);
    linhas.push(`- **Desenho:** ${l.instrumento}.${l.motivoDesenho ? ` ${maiuscula(l.motivoDesenho)}.` : ""}`);
    linhas.push("");
  });
  linhas.push(`**O que muda:** ${s.custo}`, "", `Os ${total} posts de categoria ficam distribuídos assim: ${s.livros.map((b) => `${dados.livros[b].titulo} ${(s.posts?.[b] ?? []).length}`).join(", ")}.`, "");
}

writeFileSync(join(aqui, "sugestoes.md"), `${linhas.join("\n").trimEnd()}\n`);
console.log("docs/prototipos/colecoes/sugestoes.md");
