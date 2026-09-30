#!/usr/bin/env node
/**
 * Renderiza um SVG da pasta (uma prancha, uma peça da base) num PNG, sobre o fundo da página do site,
 * para conferir de olho (com a ferramenta Read). Por padrão, claro e escuro lado a lado.
 *
 *   node ferramentas/ver.mjs <arquivo.svg> [opções]
 *     --largura N        largura do SVG na tela, em px (padrão: a do próprio SVG, até 1400)
 *     --tema claro|escuro|ambos   (padrão ambos)
 *     --fundo #hex       troca o fundo (padrão: #F1F0EB no claro e #111618 no escuro, os do site)
 *     --escala N         densidade de pixels (padrão 1; 2 para ver detalhe)
 *     --recorte x,y,w,h  só este retângulo, em px do SVG na tela (para ampliar um detalhe)
 *     --saida arq.png    (padrão .render/<nome>[-recorte].png)
 *
 * Mostra no terminal os erros do SVG (XML inválido, recurso que não carregou).
 */
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join, dirname, basename, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "./modulos.mjs";
import { servir } from "./servidor.mjs";

const PASTA = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const opcao = (nome, padrao) => {
  const i = args.indexOf(`--${nome}`);
  return i >= 0 ? args[i + 1] : padrao;
};
const arquivo = args.find((a, i) => !a.startsWith("--") && !args[i - 1]?.startsWith("--"));
if (!arquivo) {
  console.error("Uso: node ferramentas/ver.mjs <arquivo.svg> [--largura N] [--tema claro|escuro|ambos] [--escala N] [--recorte x,y,w,h] [--saida arq.png]");
  process.exit(1);
}
const caminho = relative(PASTA, resolve(process.cwd(), arquivo)).split("\\").join("/");
const tema = opcao("tema", "ambos");
const escala = Number(opcao("escala", 1));
const recorte = opcao("recorte")?.split(",").map(Number);
const fundoExtra = opcao("fundo");
const saida = opcao("saida") ?? join(PASTA, ".render", `${basename(caminho, ".svg")}${recorte ? "-recorte" : ""}${tema !== "ambos" ? `-${tema}` : ""}.png`);
mkdirSync(dirname(resolve(saida)), { recursive: true });

const servidor = await servir(0);
const base = `http://127.0.0.1:${servidor.address().port}`;
const navegador = await chromium.launch({ channel: "chrome", headless: true });
try {
  // O tamanho natural do SVG.
  const sonda = await navegador.newPage();
  const resp = await sonda.goto(`${base}/${caminho}`);
  if (!resp.ok()) throw new Error(`${caminho}: ${resp.status()}`);
  const natural = await sonda.evaluate(() => {
    const erro = document.querySelector("parsererror");
    if (erro) return { erro: erro.textContent };
    const s = document.documentElement;
    const vb = s.viewBox?.baseVal;
    return { w: vb?.width || s.width.baseVal.value, h: vb?.height || s.height.baseVal.value };
  });
  await sonda.close();
  if (natural.erro) throw new Error(`XML inválido em ${caminho}:\n${natural.erro}`);
  const largura = Number(opcao("largura", Math.min(1400, natural.w)));
  const altura = Math.round((largura * natural.h) / natural.w);
  const temas = tema === "ambos" ? ["claro", "escuro"] : [tema];
  const fundos = { claro: "#F1F0EB", escuro: "#111618" };
  const margem = 24;
  const html = `<!doctype html><meta charset="utf-8"><style>
    body{margin:0;display:flex}
    .p{padding:${margem}px;line-height:0}
    object{display:block;width:${largura}px;height:${altura}px}
  </style>${temas.map((t) => `<div class="p" style="background:${fundoExtra ?? fundos[t]}"><object type="image/svg+xml" data="${base}/${caminho}"></object></div>`).join("")}`;
  const pagina = await navegador.newPage({ viewport: { width: temas.length * (largura + 2 * margem), height: altura + 2 * margem }, deviceScaleFactor: escala });
  const avisos = [];
  pagina.on("console", (m) => (m.type() === "error" || m.type() === "warning") && avisos.push(m.text()));
  pagina.on("requestfailed", (r) => avisos.push(`falhou: ${r.url()}`));
  pagina.on("response", (r) => r.status() >= 400 && avisos.push(`${r.status()}: ${r.url()}`));
  // A moldura sai do mesmo servidor, para o <object> ser da mesma origem (contentDocument acessível).
  const moldura = join(PASTA, ".render", `_ver-${process.pid}.html`);
  mkdirSync(dirname(moldura), { recursive: true });
  writeFileSync(moldura, html);
  await pagina.goto(`${base}/.render/${basename(moldura)}`, { waitUntil: "load" });
  rmSync(moldura, { force: true });
  await pagina.evaluate(async () => {
    for (const o of document.querySelectorAll("object")) {
      if (!o.contentDocument || o.contentDocument.readyState !== "complete")
        await new Promise((ok) => {
          o.addEventListener("load", ok, { once: true });
          setTimeout(ok, 5000);
        });
      await o.contentDocument?.fonts?.ready;
    }
  });
  await pagina.waitForTimeout(250);
  const clip = recorte
    ? { x: margem + recorte[0], y: margem + recorte[1], width: recorte[2], height: recorte[3] }
    : undefined;
  if (recorte && temas.length === 2) {
    // Recorte nos dois temas: um ao lado do outro.
    const { sharp } = await import("./modulos.mjs");
    const a = await pagina.screenshot({ clip });
    const b = await pagina.screenshot({ clip: { ...clip, x: clip.x + largura + 2 * margem } });
    const w = Math.round(recorte[2] * escala);
    const h = Math.round(recorte[3] * escala);
    await sharp({ create: { width: 2 * w + 8, height: h, channels: 3, background: "#808080" } })
      .composite([{ input: a, left: 0, top: 0 }, { input: b, left: w + 8, top: 0 }])
      .png()
      .toFile(saida);
  } else {
    await pagina.screenshot({ path: saida, clip, fullPage: !clip });
  }
  if (avisos.length) console.log(`Avisos:\n  ${[...new Set(avisos)].join("\n  ")}`);
  console.log(`✓ ${relative(process.cwd(), resolve(saida))} (${largura}×${altura}${escala !== 1 ? ` ×${escala}` : ""}, ${temas.join(" e ")})`);
} finally {
  await navegador.close();
  servidor.close();
}
