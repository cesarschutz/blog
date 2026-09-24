#!/usr/bin/env node
/**
 * Constrói as variantes da medição da busca (D2): o site com Pagefind com 26, 250, 500 e 1.000
 * posts (os reais mais sintéticos). Saída em bench/ (fora do git). Registra o tempo de build e o
 * tamanho do índice. O índice próprio (motor A) saiu do site depois da D2; os números dele ficam
 * em resultados/2026-09-24.json.
 * Uso: node scripts/bench-busca/construir.mjs [tamanhos separados por vírgula]
 * Com o `npm run dev` parado: o build troca o cache de conteúdo do Astro, que o dev também usa.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { gerarCorpus } from "./sinteticos.mjs";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const bench = join(raiz, "bench");
const tamanhos = (process.argv[2] ?? "26,250,500,1000").split(",").map(Number);
const motores = ["pagefind"];
const npx = (args, env = {}) =>
  execFileSync("npx", args, { cwd: raiz, env: { ...process.env, ...env }, stdio: ["ignore", "ignore", "inherit"] });

function tamanhoDaPasta(caminho) {
  if (!existsSync(caminho)) return 0;
  if (statSync(caminho).isFile()) return statSync(caminho).size;
  return readdirSync(caminho).reduce((soma, nome) => soma + tamanhoDaPasta(join(caminho, nome)), 0);
}

const arquivoDoRegistro = join(bench, "construcao.json");
const anterior = existsSync(arquivoDoRegistro) ? JSON.parse(readFileSync(arquivoDoRegistro, "utf8")) : [];
const registro = anterior.filter((l) => !(tamanhos.includes(l.total) && motores.includes(l.motor)));
for (const total of tamanhos) {
  const conteudo = gerarCorpus(total, join(raiz, "src/content/posts"), join(bench, `conteudo-${total}`));
  for (const motor of motores) {
    const saida = join(bench, `dist-${motor}-${total}`);
    rmSync(saida, { recursive: true, force: true });
    // O cache de conteúdo do Astro guarda a coleção anterior; limpar evita misturar corpora.
    rmSync(join(raiz, "node_modules/.astro"), { recursive: true, force: true });
    rmSync(join(raiz, ".astro/data-store.json"), { force: true });
    const inicio = Date.now();
    npx(["astro", "build"], { PASTA_POSTS: conteudo, OUT_DIR: saida });
    const build = Date.now() - inicio;
    const antes = Date.now();
    npx(["pagefind", "--site", saida]);
    const extra = Date.now() - antes;
    const indice = ["pagefind.js", "wasm.pt-br.pagefind", "wasm.unknown.pagefind", "pagefind-entry.json", "index", "fragment", "filter"]
      .map((n) => tamanhoDaPasta(join(saida, "pagefind", n)))
      .reduce((a, b) => a + b, 0);
    const linha = { total, motor, buildMs: build, indiceMs: extra, indiceBytes: indice };
    registro.push(linha);
    console.log(JSON.stringify(linha));
  }
}
writeFileSync(arquivoDoRegistro, JSON.stringify(registro, null, 2));
