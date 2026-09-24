#!/usr/bin/env node
/**
 * Confere a busca (Pagefind, D2) contra o gabarito: 'real' com os 26 posts, 'escala' com 500.
 * Cada consulta entra por /?q=, espera o resultado e compara as URLs com o esperado.
 * Uso: node scripts/bench-busca/conferir.mjs   (depois de construir.mjs)
 */
import { chromium } from "playwright-core";
import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { servir } from "./servidor.mjs";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const gabarito = JSON.parse(readFileSync(join(raiz, "scripts/bench-busca/gabarito.json"), "utf8"));

function avaliar(urls, espera) {
  const falhas = [];
  if (espera.primeiro && urls[0] !== espera.primeiro) falhas.push(`primeiro era ${urls[0] ?? "nada"}`);
  for (const u of espera.noTopo3 ?? []) if (!urls.slice(0, 3).includes(u)) falhas.push(`${u} fora do top 3`);
  if (espera.algumNoTopo3 && !espera.algumNoTopo3.some((u) => urls.slice(0, 3).includes(u))) falhas.push("nenhum esperado no top 3");
  for (const u of espera.contem ?? []) if (!urls.includes(u)) falhas.push(`faltou ${u}`);
  if (espera.dentro) for (const u of urls) if (!espera.dentro.includes(u)) falhas.push(`sobrou ${u}`);
  if (espera.exatamente) {
    const a = [...urls].sort().join();
    const b = [...espera.exatamente].sort().join();
    if (a !== b) falhas.push(`veio [${urls.join(", ")}]`);
  }
  if (espera.minimo && urls.length < espera.minimo) falhas.push(`só ${urls.length} resultado(s)`);
  return falhas;
}

const navegador = await chromium.launch({ channel: "chrome", headless: true });
let porta = 4800;
let totalFalhas = 0;
for (const [grupo, total] of [
  ["real", 26],
  ["escala", 500],
]) {
  for (const motor of ["pagefind"]) {
    const pasta = join(raiz, "bench", `dist-${motor}-${total}`);
    if (!existsSync(pasta)) continue;
    const servidor = await servir(pasta, ++porta);
    let passaram = 0;
    console.log(`\n${motor}, ${total} posts (${grupo}):`);
    for (const caso of gabarito[grupo]) {
      const contexto = await navegador.newContext();
      const pagina = await contexto.newPage();
      await pagina.goto(`http://127.0.0.1:${porta}/?q=${encodeURIComponent(caso.consulta)}`);
      await pagina.waitForFunction(() => performance.getEntriesByName("busca:resultado").length > 0, null, { timeout: 60000 });
      const urls = await pagina.$$eval("[data-busca-resultados] .resultado", (as) => as.map((a) => new URL(a.href).pathname));
      await contexto.close();
      const falhas = avaliar(urls, caso.espera);
      if (falhas.length) totalFalhas++;
      else passaram++;
      console.log(`  ${falhas.length ? "✗" : "✓"} ${caso.consulta.padEnd(30)} ${caso.criterio}${falhas.length ? ` — ${falhas.join("; ")}` : ""}`);
    }
    console.log(`  ${passaram}/${gabarito[grupo].length} no gabarito`);
    servidor.close();
  }
}
await navegador.close();
process.exit(totalFalhas ? 1 : 0);
