#!/usr/bin/env node
/**
 * Confere o contraste dos tokens de cor (WCAG 2) nos dois temas, com as regras da D22:
 * - texto: mínimo de 4,5:1 (falha o script);
 * - `--ink-3`: só texto grande ou decorativo, mínimo de 3:1 (falha o script);
 * - elementos gráficos na cor da categoria (chip, barra de leitura, ícones): 3:1 desejável,
 *   só avisa, porque são decorativos (o nome da categoria ou o rótulo sempre acompanha).
 *
 * Uso: npm run contraste. Lê os tokens e os cadastros direto dos .ts (Node 24).
 */
import { claro, escuro, BRANCO_NO_ESCURO, LOUSA } from "../src/styles/tokens.ts";
import { CATEGORIAS } from "../src/data/taxonomia.ts";
import { SERIES } from "../src/data/series.ts";

// ---------- cor: sRGB, luminância (WCAG) e mistura em oklab (como o color-mix do CSS) ----------
const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
const paraHex = (c) =>
  "#" + c.map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, "0")).join("").toUpperCase();
const linear = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const gama = (v) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);
const luminancia = (hex) => {
  const [r, g, b] = rgb(hex).map(linear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contraste = (a, b) => {
  const [claroL, escuroL] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (claroL + 0.05) / (escuroL + 0.05);
};
const paraOklab = (hex) => {
  const [r, g, b] = rgb(hex).map(linear);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
};
const deOklab = ([L, A, B]) => {
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map(gama);
};
/** Igual a `color-mix(in oklab, a, b p%)`: `a` entra com (100 − p)% e `b` com p%. */
const misturar = (a, b, p) => {
  const x = paraOklab(a);
  const y = paraOklab(b);
  return paraHex(deOklab(x.map((v, i) => v * (1 - p / 100) + y[i] * (p / 100))));
};

// ---------- verificações ----------
const linhas = [];
let falhas = 0;
let alertas = 0;

function conferir(grupo, nome, frente, fundo, minimo, obrigatorio) {
  const razao = contraste(frente, fundo);
  const passou = razao >= minimo;
  if (!passou && obrigatorio) falhas++;
  if (!passou && !obrigatorio) alertas++;
  const marca = passou ? "✓" : obrigatorio ? "✗" : "!";
  linhas.push({ grupo, marca, razao, minimo, nome, par: `${frente} sobre ${fundo}` });
}

const AVISOS = ["aviso-nota", "aviso-dica", "aviso-importante", "aviso-atencao", "aviso-cuidado"];

for (const [tema, p] of Object.entries({ claro, escuro })) {
  const texto = `Texto, tema ${tema} (4,5:1)`;
  for (const fundo of ["paper", "paper-hi"]) {
    for (const t of ["ink", "ink-2", "link"]) conferir(texto, `--${t} / --${fundo}`, p[t], p[fundo], 4.5, true);
  }
  for (const a of AVISOS) {
    const fundoAviso = misturar(p["paper-hi"], p[a], 7);
    conferir(texto, `rótulo do ${a} / fundo do aviso`, misturar(p[a], p.ink, 22), fundoAviso, 4.5, true);
    conferir(texto, `texto do ${a} / fundo do aviso`, p.ink, fundoAviso, 4.5, true);
  }

  const grande = `Texto grande ou decorativo, tema ${tema} (3:1)`;
  for (const fundo of ["paper", "paper-hi"]) conferir(grande, `--ink-3 / --${fundo}`, p["ink-3"], p[fundo], 3, true);

  const graficos = `Elementos gráficos, tema ${tema} (3:1 desejável)`;
  for (const a of AVISOS) conferir(graficos, `ícone e borda do ${a}`, p[a], misturar(p["paper-hi"], p[a], 7), 3, false);
  const naCor = (cor) => (tema === "escuro" ? misturar(cor, "#FFFFFF", BRANCO_NO_ESCURO) : cor);
  for (const c of CATEGORIAS) conferir(graficos, `chip e barra de ${c.nome}`, naCor(c.tecido), p.paper, 3, false);
  for (const s of SERIES) conferir(graficos, `chip e barra de ${s.nome}`, naCor(s.destaque), p.paper, 3, false);
}

// Lousa (briefing §7): caneta e destaques sobre o vidro (tema claro) e o quadro (tema escuro).
for (const [tema, p] of Object.entries({ claro, escuro })) {
  const { mistura, canetaNoTraco, canetaNoTexto } = LOUSA[tema];
  const lousa = `Lousa, tema ${tema} (texto 4,5:1; traço 3:1)`;
  conferir(lousa, "caneta", p["lousa-caneta"], p.lousa, 4.5, true);
  conferir(lousa, "texto secundário (caneta a 72%)", misturar(p["lousa-caneta"], p.lousa, 28), p.lousa, 4.5, true);
  const destaques = [...CATEGORIAS.map((c) => [c.nome, c.tecido]), ...SERIES.map((s) => [s.nome, s.destaque])];
  for (const [nome, cor] of destaques) {
    const destaque = misturar(cor, p["lousa-mistura"], mistura);
    conferir(lousa, `traço em destaque, ${nome}`, misturar(destaque, p["lousa-caneta"], canetaNoTraco), p.lousa, 3, true);
    conferir(lousa, `texto em destaque, ${nome}`, misturar(destaque, p["lousa-caneta"], canetaNoTexto), p.lousa, 4.5, true);
  }
}

const tecido = "Texto sobre o tecido e a encadernação (4,5:1)";
for (const c of CATEGORIAS) conferir(tecido, c.nome, c.texto, c.tecido, 4.5, true);
for (const s of SERIES) conferir(tecido, s.nome, s.letras, s.encadernacao, 4.5, true);

// ---------- relatório ----------
let grupoAtual = "";
for (const l of linhas) {
  if (l.grupo !== grupoAtual) {
    grupoAtual = l.grupo;
    console.log(`\n${grupoAtual}`);
  }
  console.log(`  ${l.marca} ${l.razao.toFixed(2).padStart(5)}:1  ${l.nome}  (${l.par})`);
}
console.log(`\n${falhas} falha(s) obrigatória(s), ${alertas} alerta(s) em elementos decorativos.`);
process.exit(falhas > 0 ? 1 : 0);
