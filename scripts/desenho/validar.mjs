#!/usr/bin/env node
/**
 * Valida os desenhos contra as regras técnicas (briefing §6 e §7, skills desenho e lousa):
 * - ilustrações (src/ilustracoes/): raiz com viewBox, texto alternativo e recortes nas proporções
 *   certas, com a área segura dentro de todos; pouco texto fora das anotações;
 * - lousas (src/lousas/<slug>/): atributos de tempo bem formados e sem data-traco em tracejado;
 * - nos dois: só as classes do traço (desenho.css, lousa.css), sem cor fixa, id, <defs>, estilo
 *   embutido, degradê, imagem ou emoji, e texto fora do grupo que treme.
 *
 *   node scripts/desenho/validar.mjs [slug…]   (sem slug, valida todos)
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "src");
const pasta = join(raiz, "ilustracoes");
const pastaDasLousas = join(raiz, "lousas");
const CLASSES_DA_LOUSA = new Set(["traco", "fino", "guia", "destaque", "fantasma", "tracejado", "hachura", "cheio", "secundario", "codigo"]);
const TEMPO = { traco: 2, escrita: 2, revela: 2, aparece: 2, some: 2, esmaece: 3, desloca: 4 };
const CLASSES = new Set([
  "tinta", "linha", "papel", "cor", "hachura", "fantasma", "carimbo",
  "rotulo", "valor", "numero", "codigo", "carimbo-texto", "anotacao", "nota", "nota-pequena", "chamada",
]);
const PROPORCOES = { largo: 1100 / 468, medio: 3 / 2, quadrado: 1 };
const PROIBIDOS = [
  [/\sid="/, "id próprio (as definições são globais)"],
  [/<defs\b/, "<defs> próprio"],
  [/<style\b|\sstyle="/, "estilo embutido (use as classes)"],
  [/\s(fill|stroke|color|stop-color)="(?!none")/, "cor fixa em atributo (use as classes)"],
  [/#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/i, "cor fixa"],
  [/<(linearGradient|radialGradient)\b/, "degradê"],
  [/<(image|foreignObject|script|filter|mask)\b/, "elemento proibido (imagem, filtro, script…)"],
  [/font-family=/, "fonte no desenho (a tipografia vem das classes)"],
  [/\p{Extended_Pictographic}/u, "emoji"],
];
const MAX_TEXTO = 60;
const MAX_BYTES = 40_000;

const numeros = (valor) => (valor ?? "").trim().split(/[\s,]+/).map(Number);
const caixa = (valor) => {
  const [x, y, w, h] = numeros(valor);
  return [x, y, w, h].every(Number.isFinite) && w > 0 && h > 0 ? { x, y, w, h } : undefined;
};
const contem = (fora, dentro, folga = 0.5) =>
  dentro.x >= fora.x - folga && dentro.y >= fora.y - folga && dentro.x + dentro.w <= fora.x + fora.w + folga && dentro.y + dentro.h <= fora.y + fora.h + folga;

function validar(arquivo) {
  const erros = [];
  const fonte = readFileSync(arquivo, "utf8");
  if (statSync(arquivo).size > MAX_BYTES) erros.push(`arquivo com mais de ${MAX_BYTES / 1000} KB`);
  const raiz = fonte.match(/<svg\b[^>]*>/)?.[0] ?? "";
  const atributo = (nome) => raiz.match(new RegExp(`\\s${nome}="([^"]*)"`))?.[1];
  const corpo = fonte.slice(fonte.indexOf(raiz) + raiz.length);

  if (!raiz.includes('xmlns="http://www.w3.org/2000/svg"')) erros.push("raiz sem xmlns do SVG");
  const tela = caixa(atributo("viewBox"));
  if (!tela) erros.push("raiz sem viewBox válido");
  const alt = atributo("aria-label") ?? "";
  if (alt.length < 20) erros.push("aria-label ausente ou curto demais (diga o que o desenho mostra, numa frase)");
  if (alt.length > 220) erros.push("aria-label longo demais (uma frase basta)");

  const segura = caixa(atributo("data-segura"));
  if (!segura) erros.push("falta data-segura (a área que sobrevive a todos os recortes)");
  for (const nome of ["largo", "medio", "quadrado", "og"]) {
    const r = caixa(atributo(`data-${nome}`));
    if (!r) {
      erros.push(`falta o recorte data-${nome}`);
      continue;
    }
    const alvo = PROPORCOES[nome];
    if (alvo && Math.abs(r.w / r.h / alvo - 1) > 0.01) erros.push(`data-${nome} fora da proporção (${(r.w / r.h).toFixed(3)}, esperado ${alvo.toFixed(3)})`);
    if (tela && !contem(tela, r)) erros.push(`data-${nome} sai do viewBox`);
    if (segura && !contem(r, segura)) erros.push(`a área segura não cabe em data-${nome}`);
  }

  for (const [padrao, motivo] of PROIBIDOS) if (padrao.test(corpo)) erros.push(motivo);
  for (const [, lista] of corpo.matchAll(/\sclass="([^"]*)"/g)) {
    for (const classe of lista.split(/\s+/)) if (!CLASSES.has(classe)) erros.push(`classe desconhecida: ${classe}`);
  }

  // Pilha de elementos: texto não pode ficar dentro do grupo que treme; conta o texto fora das anotações.
  const pilha = [];
  let caracteres = 0;
  let temTinta = false;
  for (const [, fecha, nome, attrs, auto, texto] of corpo.matchAll(/<(\/?)([a-zA-Z]+)([^>]*?)(\/?)>|([^<]+)/g)) {
    if (texto !== undefined) {
      const dentroDeTexto = pilha.at(-1)?.nome === "text" || pilha.at(-1)?.nome === "tspan";
      if (dentroDeTexto && !pilha.some((e) => e.classes.includes("anotacao"))) caracteres += texto.trim().length;
      continue;
    }
    if (fecha) {
      pilha.pop();
      continue;
    }
    const classes = (attrs.match(/\sclass="([^"]*)"/)?.[1] ?? "").split(/\s+/);
    if (classes.includes("tinta")) temTinta = true;
    if (nome === "text" && pilha.some((e) => e.classes.includes("tinta"))) erros.push("texto dentro do grupo .tinta (ficaria tremido)");
    if (!auto && nome !== "svg") pilha.push({ nome, classes });
  }
  if (!temTinta) erros.push('falta o grupo class="tinta" com os traços');
  if (caracteres > MAX_TEXTO) erros.push(`texto demais fora das anotações (${caracteres} caracteres; limite ${MAX_TEXTO})`);
  return erros;
}

function validarLousa(arquivo) {
  const erros = [];
  const fonte = readFileSync(arquivo, "utf8");
  const raiz = fonte.match(/<svg\b[^>]*>/)?.[0] ?? "";
  const corpo = fonte.slice(fonte.indexOf(raiz) + raiz.length);
  if (!raiz.includes('xmlns="http://www.w3.org/2000/svg"')) erros.push("raiz sem xmlns do SVG");
  if (!caixa(raiz.match(/\sviewBox="([^"]*)"/)?.[1])) erros.push("raiz sem viewBox válido");
  if (/\saria-label=/.test(raiz)) erros.push("o rótulo vem do componente (rotulo=), não do arquivo");
  for (const [padrao, motivo] of PROIBIDOS) if (padrao.test(corpo)) erros.push(motivo);
  const pilha = [];
  let temTraco = false;
  for (const [, fecha, nome, attrs, auto] of corpo.matchAll(/<(\/?)([a-zA-Z]+)([^>]*?)(\/?)>/g)) {
    if (fecha) {
      pilha.pop();
      continue;
    }
    const classes = (attrs.match(/\sclass="([^"]*)"/)?.[1] ?? "").split(/\s+/).filter(Boolean);
    for (const c of classes) if (!CLASSES_DA_LOUSA.has(c)) erros.push(`classe desconhecida: ${c}`);
    if (classes.includes("traco")) temTraco = true;
    if (nome === "text" && pilha.some((c) => c.includes("traco"))) erros.push("texto dentro do grupo .traco (ficaria tremido)");
    for (const [, atributo, valor] of attrs.matchAll(/\sdata-([a-z]+)="([^"]*)"/g)) {
      if (atributo === "de") {
        if (valor !== "direita") erros.push(`data-de="${valor}" (só existe "direita")`);
        continue;
      }
      const esperado = TEMPO[atributo];
      if (!esperado) {
        erros.push(`atributo desconhecido: data-${atributo}`);
        continue;
      }
      const n = valor.trim().split(/\s+/).map(Number);
      if (n.length !== esperado || n.some((x) => !Number.isFinite(x))) erros.push(`data-${atributo}="${valor}" (esperava ${esperado} números)`);
      else if (n[0] > n[1]) erros.push(`data-${atributo}="${valor}" termina antes de começar`);
      if (atributo === "traco" && classes.some((c) => c === "fantasma" || c === "tracejado")) {
        erros.push("data-traco em linha tracejada (o traçado usa o tracejado); use data-revela");
      }
    }
    if (!auto && nome !== "svg") pilha.push(classes);
  }
  if (!temTraco) erros.push('falta o grupo class="traco" com os traços');
  return erros;
}

const pedidos = process.argv.slice(2);
const pedido = (slug) => !pedidos.length || pedidos.includes(slug);
const alvos = [
  ...readdirSync(pasta)
    .filter((f) => f.endsWith(".svg") && pedido(f.replace(/\.svg$/, "")))
    .map((f) => ({ nome: `ilustracoes/${f}`, erros: validar(join(pasta, f)) })),
  ...(existsSync(pastaDasLousas) ? readdirSync(pastaDasLousas) : [])
    .filter((slug) => pedido(slug) && statSync(join(pastaDasLousas, slug)).isDirectory())
    .flatMap((slug) =>
      readdirSync(join(pastaDasLousas, slug))
        .filter((f) => f.endsWith(".svg"))
        .map((f) => ({ nome: `lousas/${slug}/${f}`, erros: validarLousa(join(pastaDasLousas, slug, f)) })),
    ),
];
let falhas = 0;
for (const { nome, erros } of alvos) {
  if (erros.length) falhas++;
  console.log(`${erros.length ? "✗" : "✓"} ${nome}${erros.length ? `\n    - ${erros.join("\n    - ")}` : ""}`);
}
console.log(`\n${alvos.length - falhas} de ${alvos.length} desenhos passaram.`);
process.exit(falhas ? 1 : 0);
