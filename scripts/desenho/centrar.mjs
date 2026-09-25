#!/usr/bin/env node
/**
 * Centraliza os recortes de uma ilustração no desenho (sem mexer no desenho): mede no navegador a
 * caixa do conteúdo (traços e textos, sem as anotações) e reescreve na raiz do SVG data-medio,
 * data-quadrado e data-og centrados nela, e data-segura igual à caixa. Desde a D33, os recortes são
 * justos: o desenho ocupa até 86% da largura e 82% da altura do médio (destaque, cards e topo no
 * celular) e 90% do quadrado (miniatura da lista); antes, um mínimo de 900 e 670 deixava o desenho
 * pequeno no painel. No recorte largo,
 * a posição na horizontal fica (o protagonista à direita, as anotações à esquerda) e a altura é
 * centrada no desenho com as anotações. Precisa do `npm run dev` no ar.
 *
 *   node scripts/desenho/centrar.mjs <slug…>
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const endereco = process.env.ENDERECO ?? "http://127.0.0.1:4322";
const slugs = process.argv.slice(2);
if (!slugs.length) {
  console.error("uso: node scripts/desenho/centrar.mjs <slug…>");
  process.exit(1);
}

// Mede tudo antes de gravar: cada arquivo gravado faz o dev recarregar a página.
const navegador = await chromium.launch({ channel: "chrome", headless: true });
const pagina = await navegador.newPage({ viewport: { width: 1200, height: 900 } });
const medidas = [];
for (const slug of slugs) {
  await pagina.goto(`${endereco}/amostra/desenhos/?slug=${encodeURIComponent(slug)}`, { waitUntil: "load" });
  await pagina.evaluate(() => document.fonts.ready);
  medidas.push([slug, await pagina.evaluate((s) => {
    const svg = document.querySelector(`.conferencia[data-slug="${s}"] .largo svg`);
    if (!svg) return null;
    const paraDesenho = svg.getScreenCTM().inverse();
    const medir = (elementos) => {
      let [x1, y1, x2, y2] = [Infinity, Infinity, -Infinity, -Infinity];
      for (const el of elementos) {
        const r = el.getBoundingClientRect();
        if (!r.width && !r.height) continue;
        for (const [x, y] of [[r.left, r.top], [r.right, r.bottom]]) {
          const p = new DOMPoint(x, y).matrixTransform(paraDesenho);
          [x1, y1, x2, y2] = [Math.min(x1, p.x), Math.min(y1, p.y), Math.max(x2, p.x), Math.max(y2, p.y)];
        }
      }
      return { x1, y1, x2, y2 };
    };
    const desenho = [...svg.querySelectorAll(".tinta > *, :scope > text, :scope > g:not(.anotacao)")].filter((el) => !el.closest(".anotacao"));
    const conteudo = medir(desenho);
    const comNotas = medir([...desenho, ...svg.querySelectorAll(".anotacao > *")]);
    return { ...conteudo, notasY1: comNotas.y1, notasY2: comNotas.y2 };
  }, slug)]);
}
await navegador.close();

for (const [slug, caixa] of medidas) {
  if (!caixa) {
    console.error(`✗ ${slug}: não aparece na folha.`);
    continue;
  }
  const [cx, cy] = [(caixa.x1 + caixa.x2) / 2, (caixa.y1 + caixa.y2) / 2];
  const [w, h] = [caixa.x2 - caixa.x1, caixa.y2 - caixa.y1];
  // Recortes justos (D33): o desenho grande no painel, com um respiro em volta.
  const medioL = Math.max(w / 0.86, (h / 0.82) * 1.5);
  const quad = Math.max(w, h) / 0.9;
  const ogL = Math.max(740, w * 1.1);
  const ogA = Math.max(883, h * 1.2);
  const r = (v) => Math.round(v);
  const recorte = (l, a) => `${r(cx - l / 2)} ${r(cy - a / 2)} ${r(l)} ${r(a)}`;
  const arquivo = join(raiz, "src", "ilustracoes", `${slug}.svg`);
  let fonte = readFileSync(arquivo, "utf8");
  const trocar = (nome, valor) => {
    fonte = fonte.replace(new RegExp(`\\sdata-${nome}="[^"]*"`), ` data-${nome}="${valor}"`);
  };
  trocar("medio", recorte(medioL, medioL / 1.5));
  trocar("quadrado", recorte(quad, quad));
  trocar("og", recorte(ogL, ogA));
  trocar("segura", `${r(caixa.x1)} ${r(caixa.y1)} ${r(w)} ${r(h)}`);
  // Largo: mesma posição na horizontal; na vertical, centrado no desenho com as anotações, sem cortar o desenho.
  const largo = fonte.match(/\sdata-largo="([^"]*)"/)[1].split(/\s+/).map(Number);
  const folga = Math.max(0, Math.min(12, (largo[3] - h) / 2));
  let y = (caixa.notasY1 + caixa.notasY2) / 2 - largo[3] / 2;
  y = Math.min(Math.max(y, caixa.y2 + folga - largo[3]), caixa.y1 - folga);
  trocar("largo", `${largo[0]} ${r(y)} ${largo[2]} ${largo[3]}`);
  // O viewBox cresce se algum recorte passar dele.
  const vb = fonte.match(/\sviewBox="([^"]*)"/)[1].split(/\s+/).map(Number);
  const todos = [...fonte.matchAll(/\sdata-(?:largo|medio|quadrado|og)="([^"]*)"/g)].map((m) => m[1].split(/\s+/).map(Number));
  const nx1 = Math.min(vb[0], ...todos.map((c) => c[0]));
  const ny1 = Math.min(vb[1], ...todos.map((c) => c[1]));
  const nx2 = Math.max(vb[0] + vb[2], ...todos.map((c) => c[0] + c[2]));
  const ny2 = Math.max(vb[1] + vb[3], ...todos.map((c) => c[1] + c[3]));
  fonte = fonte.replace(/\sviewBox="[^"]*"/, ` viewBox="${nx1} ${ny1} ${nx2 - nx1} ${ny2 - ny1}"`);
  writeFileSync(arquivo, fonte);
  console.log(`✓ ${slug}: conteúdo ${r(caixa.x1)}–${r(caixa.x2)} × ${r(caixa.y1)}–${r(caixa.y2)}, centro (${r(cx)}, ${r(cy)})`);
}
