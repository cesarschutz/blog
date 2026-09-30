#!/usr/bin/env node
/**
 * Servidor estático mínimo (sem dependências) para a pasta do protótipo: a galeria (index.html), as
 * pranchas e as fontes. Usado pelo ver.mjs (numa porta livre qualquer) e para o Cesar ver a galeria.
 *
 *   node ferramentas/servidor.mjs [porta]      (padrão 4341; só em 127.0.0.1)
 *
 * Um endereço com ?opcional responde 204 (e não 404) quando o arquivo não existe: é assim que a
 * galeria descobre quais pranchas e capturas já foram gravadas, sem encher o console de erros.
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const PASTA = join(dirname(fileURLToPath(import.meta.url)), "..");
const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".webp": "image/webp",
  ".md": "text/plain; charset=utf-8",
};

export function servir(porta = 0, pasta = PASTA) {
  const servidor = createServer(async (req, res) => {
    try {
      let caminho = decodeURIComponent(new URL(req.url, "http://x").pathname);
      if (caminho.endsWith("/")) caminho += "index.html";
      const arquivo = normalize(join(pasta, caminho));
      if (!arquivo.startsWith(pasta)) throw Object.assign(new Error("fora"), { code: "ENOENT" });
      const info = await stat(arquivo);
      if (info.isDirectory()) {
        res.writeHead(301, { Location: `${caminho}/` });
        return res.end();
      }
      res.writeHead(200, { "Content-Type": TIPOS[extname(arquivo)] ?? "application/octet-stream", "Cache-Control": "no-store" });
      res.end(await readFile(arquivo));
    } catch {
      // Com ?opcional, o arquivo pode não existir ainda (a galeria confere se a prancha já foi gravada):
      // 204 em vez de 404, para o navegador não registrar um erro no console a cada conferência.
      if (new URL(req.url, "http://x").searchParams.has("opcional")) {
        res.writeHead(204, { "Cache-Control": "no-store" });
        return res.end();
      }
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Não encontrado");
    }
  });
  return new Promise((ok) => servidor.listen(porta, "127.0.0.1", () => ok(servidor)));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const porta = Number(process.argv[2] ?? 4341);
  const s = await servir(porta);
  console.log(`Galeria dos livros realistas: http://127.0.0.1:${s.address().port}/`);
}
