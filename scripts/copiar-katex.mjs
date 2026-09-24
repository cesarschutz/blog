#!/usr/bin/env node
/**
 * Copia o CSS e as fontes do KaTeX do pacote para public/katex/, para o site servir tudo sozinho
 * (D6). Roda antes do dev e do build; a pasta gerada fica fora do git.
 */
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const origem = join(dirname(createRequire(import.meta.url).resolve("katex/package.json")), "dist");
const destino = join(raiz, "public", "katex");

mkdirSync(destino, { recursive: true });
cpSync(join(origem, "katex.min.css"), join(destino, "katex.min.css"));
cpSync(join(origem, "fonts"), join(destino, "fonts"), { recursive: true });

if (!existsSync(join(destino, "katex.min.css"))) {
  console.error("Não consegui copiar o KaTeX para public/katex/.");
  process.exit(1);
}
