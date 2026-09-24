#!/usr/bin/env node
/**
 * Confere, no build (dist/), os links internos e as âncoras (D7): toda página apontada existe e toda
 * âncora (#id) existe na página de destino. Redirecionamentos contam como página existente, e a âncora
 * é conferida no destino final. Uso: npm run build && npm run links.
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const base = (process.env.BASE_PATH ?? "/").replace(/\/$/, "");

const paginas = [];
const varrer = (pasta) => {
  for (const nome of readdirSync(pasta)) {
    const caminho = join(pasta, nome);
    if (statSync(caminho).isDirectory()) varrer(caminho);
    else if (nome.endsWith(".html")) paginas.push(caminho);
  }
};
varrer(dist);

const html = new Map(paginas.map((p) => [p, readFileSync(p, "utf8")]));
const idsDe = (arquivo) => new Set([...(html.get(arquivo) ?? "").matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
const decodificar = (s) => {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
};

/** Resolve um caminho do site para o arquivo em dist/, seguindo redirecionamento de meta refresh. */
function resolver(caminho, profundidade = 0) {
  let limpo = decodificar(caminho.split("#")[0].split("?")[0]);
  if (base && limpo.startsWith(base)) limpo = limpo.slice(base.length) || "/";
  const candidatos = [join(dist, limpo, "index.html"), join(dist, limpo)];
  const arquivo = candidatos.find((c) => existsSync(c) && statSync(c).isFile());
  if (!arquivo) return undefined;
  const refresh = (html.get(arquivo) ?? "").match(/http-equiv="refresh" content="0;url=([^"]+)"/);
  if (refresh && profundidade < 3) {
    const destino = refresh[1];
    return { arquivo: resolver(destino, profundidade + 1)?.arquivo, ancora: destino.split("#")[1] };
  }
  return { arquivo };
}

const problemas = [];
let conferidos = 0;
for (const [arquivo, conteudo] of html) {
  const pagina = "/" + relative(dist, arquivo).replace(/index\.html$/, "");
  for (const [, href] of conteudo.matchAll(/<a\s[^>]*href="([^"]+)"/g)) {
    if (/^(https?:|mailto:|tel:|\/\/)/.test(href)) continue;
    conferidos++;
    const [alvo, ancora] = href.startsWith("#") ? [pagina, href.slice(1)] : href.split("#");
    const destino = alvo.startsWith("/") ? resolver(alvo) : resolver(new URL(alvo, `https://x${pagina}`).pathname);
    if (!destino?.arquivo) {
      problemas.push(`${pagina}: página inexistente ${href}`);
      continue;
    }
    const id = decodificar(ancora ?? destino.ancora ?? "");
    if (id && !idsDe(destino.arquivo).has(id)) problemas.push(`${pagina}: âncora inexistente ${href}`);
  }
}

// Todo redirecionamento precisa chegar a uma página e a uma âncora que existam (ex.: #java-9 no Java 11).
let redirecionamentos = 0;
for (const [arquivo, conteudo] of html) {
  const refresh = conteudo.match(/http-equiv="refresh" content="0;url=([^"]+)"/);
  if (!refresh) continue;
  redirecionamentos++;
  const origem = "/" + relative(dist, arquivo).replace(/index\.html$/, "");
  const destino = resolver(refresh[1]);
  const id = decodificar(refresh[1].split("#")[1] ?? "");
  if (!destino?.arquivo) problemas.push(`${origem}: redireciona para página inexistente ${refresh[1]}`);
  else if (id && !idsDe(destino.arquivo).has(id)) problemas.push(`${origem}: redireciona para âncora inexistente ${refresh[1]}`);
}

console.log(`${paginas.length} páginas, ${conferidos} links internos e ${redirecionamentos} redirecionamentos conferidos.`);
if (problemas.length) {
  console.log(`\n${problemas.length} problema(s):`);
  for (const p of [...new Set(problemas)]) console.log(`  ✗ ${p}`);
  process.exit(1);
}
console.log("Nenhum link ou âncora quebrada.");
