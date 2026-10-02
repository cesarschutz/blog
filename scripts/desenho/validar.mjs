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
const pastas = [join(raiz, "ilustracoes")];
const pastasDasLousas = [join(raiz, "lousas")];
const pastasDasFiguras = [join(raiz, "figuras"), join(raiz, "animacoes")];
const pastaDasMarcas = join(raiz, "marcas");
// A regra de marca de cada logo (D64): sem registro, ou com "nao", o logo não entra.
const regrasDeMarca = JSON.parse(readFileSync(join(pastaDasMarcas, "regras.json"), "utf8"));
const regraDe = (nome) => (typeof regrasDeMarca[nome] === "object" ? regrasDeMarca[nome] : undefined);
/** Os marcadores de logo (data-marca) de um desenho, conferidos com a regra de marca para diagrama. */
function conferirMarcadores(corpo) {
  const erros = [];
  for (const [, nome] of corpo.matchAll(/\sdata-marca="([^"]+)"/g)) {
    const regra = regraDe(nome);
    if (!regra) erros.push(`logo "${nome}" sem regra de marca conferida (registre em src/marcas/regras.json, D64)`);
    else if (regra.diagrama === "nao") erros.push(`a marca ${regra.marca} não permite o logo em diagrama: use só o nome (src/marcas/regras.json)`);
  }
  return erros;
}
const CLASSES_DA_LOUSA = new Set(["traco", "fino", "guia", "destaque", "fantasma", "tracejado", "hachura", "cheio", "secundario", "codigo"]);
const TEMPO = { traco: 2, escrita: 2, revela: 2, aparece: 2, some: 2, esmaece: 3, desloca: 4 };
const CLASSES = new Set([
  "tinta", "linha", "fumaca", "papel", "cor", "hachura", "fantasma", "carimbo",
  "rotulo", "valor", "numero", "codigo", "carimbo-texto", "anotacao", "nota", "nota-pequena", "chamada",
  // A capa viva (D58, src/styles/capa-viva.css): o detalhe que se mexe no hover.
  "mexe-balanca", "mexe-gira", "mexe-pulsa", "mexe-pisca", "mexe-sobe", "mexe-desliza", "mexe-treme", "mexe-escreve", "mexe-enche",
]);
// Diagramas, gráficos e animações (D58, src/styles/figura.css): as classes da
// ilustração, os tons e as peças dos gráficos. As animações GSAP acham as peças por data-parte.
const CLASSES_DA_FIGURA = new Set([
  ...CLASSES,
  "tom-azul", "tom-verde", "tom-ambar", "tom-vermelho", "tom-roxo", "tom-petroleo",
  "lavado", "linha-tom", "cheio-tom", "texto-tom", "selo", "selo-texto", "titulo-caixa", "texto-caixa",
  "eixo", "grade", "serie", "area", "limite", "ponto", "valor-eixo", "titulo-eixo", "marca-texto",
  "fluxo", "pulsa", "pisca", "gira", "balanca", "anda", "formiga", "pacote", "legenda", "referencia", "traco-tom", "risco",
  "etapa-1", "etapa-2", "etapa-3", "etapa-4", "etapa-5", "etapa-6", "etapa-7",
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
  // A lousa no estilo das figuras (D59): o grupo .tinta e as classes das figuras, mais os atributos de
  // tempo e os logos (data-marca).
  const comoFigura = /<g\s+class="tinta"/.test(corpo);
  const grupo = comoFigura ? "tinta" : "traco";
  const conhecidas = comoFigura ? CLASSES_DA_FIGURA : CLASSES_DA_LOUSA;
  const pilha = [];
  let temTraco = false;
  for (const [, fecha, nome, attrs, auto] of corpo.matchAll(/<(\/?)([a-zA-Z]+)([^>]*?)(\/?)>/g)) {
    if (fecha) {
      pilha.pop();
      continue;
    }
    const classes = (attrs.match(/\sclass="([^"]*)"/)?.[1] ?? "").split(/\s+/).filter(Boolean);
    for (const c of classes) if (!conhecidas.has(c)) erros.push(`classe desconhecida: ${c}`);
    if (classes.includes(grupo)) temTraco = true;
    if (nome === "text" && pilha.some((c) => c.includes(grupo))) erros.push(`texto dentro do grupo .${grupo} (ficaria tremido)`);
    for (const [, atributo, valor] of attrs.matchAll(/\sdata-([a-z]+)="([^"]*)"/g)) {
      if (atributo === "marca" && comoFigura) continue;
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
      if (atributo === "traco" && classes.some((c) => c === "fantasma" || c === "tracejado" || c === "grade" || c === "limite")) {
        erros.push("data-traco em linha tracejada (o traçado usa o tracejado); use data-revela");
      }
    }
    if (!auto && nome !== "svg") pilha.push(classes);
  }
  if (!temTraco) erros.push('falta o grupo class="tinta" (estilo das figuras, D59) ou class="traco" (lousa antiga) com os traços');
  erros.push(...conferirMarcadores(corpo));
  return erros;
}

function validarFigura(arquivo, { marca = false } = {}) {
  const erros = [];
  const fonte = readFileSync(arquivo, "utf8");
  const raiz = fonte.match(/<svg\b[^>]*>/)?.[0] ?? "";
  const corpo = fonte.slice(fonte.indexOf(raiz) + raiz.length);
  if (!raiz.includes('xmlns="http://www.w3.org/2000/svg"')) erros.push("raiz sem xmlns do SVG");
  const vb = raiz.match(/\sviewBox="([^"]*)"/)?.[1];
  if (!caixa(vb)) erros.push("raiz sem viewBox válido");
  if (marca && vb?.trim() !== "0 0 100 100") erros.push('logo com viewBox diferente de "0 0 100 100"');
  if (!marca && !/\saria-label="[^"]{12,}"/.test(raiz)) erros.push("falta aria-label (o texto alternativo, uma frase)");
  for (const [padrao, motivo] of PROIBIDOS) if (padrao.test(corpo)) erros.push(motivo);
  const pilha = [];
  for (const [, fecha, nome, attrs, auto] of corpo.matchAll(/<(\/?)([a-zA-Z]+)([^>]*?)(\/?)>/g)) {
    if (fecha) {
      pilha.pop();
      continue;
    }
    const classes = (attrs.match(/\sclass="([^"]*)"/)?.[1] ?? "").split(/\s+/).filter(Boolean);
    for (const c of classes) if (!CLASSES_DA_FIGURA.has(c)) erros.push(`classe desconhecida: ${c}`);
    if (nome === "text" && pilha.some((c) => c.includes("tinta"))) erros.push("texto dentro do grupo .tinta (ficaria tremido)");
    for (const [, atributo] of attrs.matchAll(/\sdata-([a-z-]+)="/g)) {
      if (!["marca", "parte"].includes(atributo)) erros.push(`atributo desconhecido: data-${atributo} (só data-marca e data-parte)`);
    }
    if (!auto && nome !== "svg") pilha.push(classes);
  }
  if (marca) {
    // O redesenho à mão só existe se a regra de marca deixa redesenhar no texto ou no diagrama.
    const nome = arquivo.split("/").pop().replace(/\.svg$/, "");
    const regra = regraDe(nome);
    if (!regra) erros.push(`sem regra de marca em src/marcas/regras.json (confira a política oficial do dono antes de desenhar, D64)`);
    else if (regra.texto !== "redesenho" && regra.diagrama !== "redesenho")
      erros.push(`a regra de marca não permite redesenhar (texto: ${regra.texto}, diagrama: ${regra.diagrama}): apague este arquivo`);
  } else erros.push(...conferirMarcadores(corpo));
  return erros;
}

const pedidos = process.argv.slice(2);
const pedido = (slug) => !pedidos.length || pedidos.includes(slug);
const lista = (pasta) => (existsSync(pasta) ? readdirSync(pasta) : []);
const alvos = [
  ...pastas.flatMap((pasta) =>
    lista(pasta)
      .filter((f) => f.endsWith(".svg") && pedido(f.replace(/\.svg$/, "")))
      .map((f) => ({ nome: `${pasta.slice(raiz.length + 1)}/${f}`, erros: validar(join(pasta, f)) })),
  ),
  ...pastasDasLousas.flatMap((pastaDasLousas) =>
    lista(pastaDasLousas)
      .filter((slug) => pedido(slug) && statSync(join(pastaDasLousas, slug)).isDirectory())
      .flatMap((slug) =>
        readdirSync(join(pastaDasLousas, slug))
          .filter((f) => f.endsWith(".svg"))
          .map((f) => ({ nome: `${pastaDasLousas.slice(raiz.length + 1)}/${slug}/${f}`, erros: validarLousa(join(pastaDasLousas, slug, f)) })),
      ),
  ),
  ...pastasDasFiguras.flatMap((pastaDasFiguras) =>
    lista(pastaDasFiguras)
      .filter((slug) => pedido(slug) && statSync(join(pastaDasFiguras, slug)).isDirectory())
      .flatMap((slug) =>
        readdirSync(join(pastaDasFiguras, slug))
          .filter((f) => f.endsWith(".svg"))
          .map((f) => ({ nome: `${pastaDasFiguras.slice(raiz.length + 1)}/${slug}/${f}`, erros: validarFigura(join(pastaDasFiguras, slug, f)) })),
      ),
  ),
  ...lista(pastaDasMarcas)
    .filter((f) => f.endsWith(".svg") && (!pedidos.length || pedidos.includes("marcas") || pedidos.includes(f.replace(/\.svg$/, ""))))
    .map((f) => ({ nome: `marcas/${f}`, erros: validarFigura(join(pastaDasMarcas, f), { marca: true }) })),
];
let falhas = 0;
for (const { nome, erros } of alvos) {
  if (erros.length) falhas++;
  console.log(`${erros.length ? "✗" : "✓"} ${nome}${erros.length ? `\n    - ${erros.join("\n    - ")}` : ""}`);
}
console.log(`\n${alvos.length - falhas} de ${alvos.length} desenhos passaram.`);
process.exit(falhas ? 1 : 0);
