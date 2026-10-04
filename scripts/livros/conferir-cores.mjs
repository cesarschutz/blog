#!/usr/bin/env node
/**
 * Confere as cores de livros novos antes de entrarem na coleção: cada cor nos papéis em que ela
 * aparece no site (pelas mesmas contas de src/livros/cores.js e de scripts/contraste.mjs) e as cores
 * de uma coleção lado a lado (se ficam bem diferentes umas das outras na estante).
 *
 * Em cada cor:
 * - a tinta sobre a cor (a frase e o desenho da capa, o título da lombada): 4,5:1 bom; abaixo de 3:1
 *   falha (a frase tem 24px, texto grande);
 * - o nome no chip, nos dois temas, sobre a folha: 4,5:1 (obrigatório no site);
 * - a tinta e a tinta 2 sobre o painel tingido, nos dois temas: 4,5:1 (obrigatório no site);
 * - o quadradinho do chip: 3:1 desejável.
 * Entre as cores: a distância em OKLab (ΔE) dos pares mais parecidos. Na coleção de hoje, o par mais
 * próximo (Dados × DevOps) tem 0,064 e ainda se distingue bem na estante; abaixo de 0,05 as cores se
 * confundem.
 *
 *   node scripts/livros/conferir-cores.mjs "#2d4b46:Arquitetura" "#7a4430:Desenvolvimento" …
 *   node scripts/livros/conferir-cores.mjs --colecao docs/prototipos/colecoes/colecoes.json [id]
 */
import { readFileSync } from "node:fs";
import { claro, escuro, misturar, BRANCO_NO_ESCURO, CHIP, PAINEL } from "../../src/styles/tokens.ts";
import { coresDoLivro } from "../../src/livros/cores.js";

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
const linear = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const luminancia = (hex) => {
  const [r, g, b] = rgb(hex).map(linear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contraste = (a, b) => {
  const [l1, l2] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};
function oklab(hex) {
  const [r, g, b] = rgb(hex).map(linear);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}
const deltaE = (a, b) => Math.hypot(...oklab(a).map((v, i) => v - oklab(b)[i]));
/** Matiz (graus), croma e luminosidade em OKLCh, para descrever a cor. */
function oklch(hex) {
  const [L, a, b] = oklab(hex);
  return { L: L * 100, C: Math.hypot(a, b), h: ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360 };
}

export function conferirCor(cor) {
  const { tinta, destaque } = coresDoLivro(cor);
  const temas = { claro, escuro };
  const r = {
    cor,
    tinta,
    destaque,
    "tinta/cor": contraste(tinta, cor),
    "destaque/papel": contraste(destaque, "#f2ede2"),
  };
  for (const [tema, p] of Object.entries(temas)) {
    const chip = misturar(misturar(cor, "#FFFFFF", CHIP[tema].branco), p.ink, CHIP[tema].tinta);
    const painel = misturar(p["paper-hi"], cor, PAINEL[tema]);
    const quadradinho = tema === "escuro" ? misturar(cor, "#FFFFFF", BRANCO_NO_ESCURO) : cor;
    r[`chip ${tema}`] = contraste(chip, p["paper-hi"]);
    r[`ink-2 no painel ${tema}`] = contraste(p["ink-2"], painel);
    r[`quadradinho ${tema}`] = contraste(quadradinho, p["paper-hi"]);
  }
  const falhas = [];
  const alertas = [];
  if (r["tinta/cor"] < 3) falhas.push(`tinta sobre a cor ${r["tinta/cor"].toFixed(2)}:1`);
  else if (r["tinta/cor"] < 4.5) alertas.push(`tinta sobre a cor ${r["tinta/cor"].toFixed(2)}:1 (só texto grande)`);
  for (const k of ["chip claro", "chip escuro", "ink-2 no painel claro", "ink-2 no painel escuro"]) if (r[k] < 4.5) falhas.push(`${k} ${r[k].toFixed(2)}:1`);
  for (const k of ["quadradinho claro", "quadradinho escuro"]) if (r[k] < 3) alertas.push(`${k} ${r[k].toFixed(2)}:1`);
  return { ...r, falhas, alertas, ...oklch(cor) };
}

function relatorio(itens) {
  let falhou = false;
  console.log("Cor       Nome                          tinta/cor  chip(c/e)    L    C     h   Situação");
  for (const { nome, cor } of itens) {
    const r = conferirCor(cor);
    if (r.falhas.length) falhou = true;
    const situacao = r.falhas.length ? `✗ ${r.falhas.join("; ")}` : r.alertas.length ? `! ${r.alertas.join("; ")}` : "✓";
    console.log(
      `${cor}  ${nome.padEnd(28).slice(0, 28)}  ${r["tinta/cor"].toFixed(2).padStart(5)}:1  ${r["chip claro"].toFixed(1)}/${r["chip escuro"].toFixed(1)}  ${r.L.toFixed(0).padStart(4)} ${r.C.toFixed(3)} ${r.h.toFixed(0).padStart(4)}   ${situacao}`,
    );
  }
  // Os pares mais parecidos.
  const pares = [];
  for (let i = 0; i < itens.length; i++)
    for (let j = i + 1; j < itens.length; j++) pares.push({ a: itens[i], b: itens[j], d: deltaE(itens[i].cor, itens[j].cor) });
  pares.sort((x, y) => x.d - y.d);
  console.log("\nPares mais parecidos (ΔE OKLab; a coleção de hoje vai até 0,064; abaixo de 0,05 se confundem):");
  for (const { a, b, d } of pares.slice(0, 5)) console.log(`  ${d < 0.05 ? "✗" : d < 0.06 ? "!" : "✓"} ${d.toFixed(3)}  ${a.nome} × ${b.nome}`);
  return falhou;
}

const args = process.argv.slice(2);
const c = args.indexOf("--colecao");
let grupos = [];
if (c >= 0) {
  const dados = JSON.parse(readFileSync(args[c + 1], "utf8"));
  const id = args[c + 2];
  for (const s of dados.sugestoes.filter((s) => !id || s.id === id))
    grupos.push({ titulo: `${s.id}: ${s.nome}`, itens: s.livros.map((slug) => ({ nome: dados.livros[slug].titulo, cor: dados.livros[slug].cor })) });
} else {
  grupos = [{ titulo: "Cores", itens: args.map((a) => ({ cor: a.split(":")[0], nome: a.split(":")[1] ?? a.split(":")[0] })) }];
}
let falhou = false;
for (const g of grupos) {
  console.log(`\n== ${g.titulo}`);
  falhou = relatorio(g.itens) || falhou;
}
process.exitCode = falhou ? 1 : 0;
