#!/usr/bin/env node
/**
 * Confere o contraste dos tokens de cor (WCAG 2) nos dois temas, com as regras da D22 e da D26:
 * - texto: mínimo de 4,5:1 (falha o script), no fundo e na folha; o nome tingido das categorias
 *   (chip) e o texto dos desenhos, sobre a folha e sobre o painel tingido;
 * - `--ink-3`: só texto grande ou decorativo, e só sobre a folha: mínimo de 3:1 ali (falha o script);
 *   sobre o fundo, só avisa;
 * - elementos gráficos na cor da categoria (quadradinho do chip, barra de leitura, ícones): 3:1
 *   desejável, só avisa, porque são decorativos (o nome da categoria ou o rótulo sempre acompanha).
 *
 * Uso: npm run contraste. Lê os tokens e os cadastros direto dos .ts (Node 24).
 */
import { claro, escuro, misturar, BRANCO_NO_ESCURO, CHIP, LOUSA, MARCA_TEXTO, PAINEL } from "../src/styles/tokens.ts";
import { CATEGORIAS } from "../src/data/taxonomia.ts";
import { SERIES } from "../src/data/series.ts";
import { PAPEL, TINTA_PAPEL } from "../docs/capas/cores.js";

// ---------- cor: sRGB e luminância (WCAG); a mistura em oklab vem dos tokens ----------
const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
const linear = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const luminancia = (hex) => {
  const [r, g, b] = rgb(hex).map(linear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contraste = (a, b) => {
  const [claroL, escuroL] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (claroL + 0.05) / (escuroL + 0.05);
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
const CORES = [...CATEGORIAS.map((c) => [c.nome, c.cor]), ...SERIES.map((s) => [s.nome, s.destaque])];

for (const [tema, p] of Object.entries({ claro, escuro })) {
  const texto = `Texto, tema ${tema} (4,5:1)`;
  for (const fundo of ["paper", "paper-hi"]) {
    for (const t of ["ink", "ink-2", "acento"]) conferir(texto, `--${t} / --${fundo}`, p[t], p[fundo], 4.5, true);
  }
  conferir(texto, "--sobre-acento / --acento (botão, seletor)", p["sobre-acento"], p.acento, 4.5, true);
  for (const a of AVISOS) {
    const fundoAviso = misturar(p["paper-hi"], p[a], 7);
    conferir(texto, `rótulo do ${a} / fundo do aviso`, misturar(p[a], p.ink, 22), fundoAviso, 4.5, true);
    conferir(texto, `texto do ${a} / fundo do aviso`, p.ink, fundoAviso, 4.5, true);
  }
  // Nome no chip: a cor com branco (escuro) e depois com tinta (claro), como o color-mix do Chip.astro.
  const nomeNoChip = (cor) => misturar(misturar(cor, "#FFFFFF", CHIP[tema].branco), p.ink, CHIP[tema].tinta);
  for (const [nome, cor] of CORES) conferir(texto, `nome no chip, ${nome} / --paper-hi`, nomeNoChip(cor), p["paper-hi"], 4.5, true);
  // Texto dos desenhos (rótulos e anotações) sobre o painel tingido.
  for (const [nome, cor] of CORES) {
    const painel = misturar(p["paper-hi"], cor, PAINEL[tema]);
    conferir(texto, `--ink no painel de ${nome}`, p.ink, painel, 4.5, true);
    conferir(texto, `--ink-2 no painel de ${nome}`, p["ink-2"], painel, 4.5, true);
  }

  const grande = `Texto grande ou decorativo, tema ${tema} (3:1)`;
  conferir(grande, "--ink-3 / --paper-hi (texto na folha)", p["ink-3"], p["paper-hi"], 3, true);
  conferir(grande, "--ink-3 / --paper (só decorativo fora da folha)", p["ink-3"], p.paper, 3, false);

  const graficos = `Elementos gráficos, tema ${tema} (3:1 desejável)`;
  for (const a of AVISOS) conferir(graficos, `ícone e borda do ${a}`, p[a], misturar(p["paper-hi"], p[a], 7), 3, false);
  const naCor = (cor) => (tema === "escuro" ? misturar(cor, "#FFFFFF", BRANCO_NO_ESCURO) : cor);
  for (const [nome, cor] of CORES) conferir(graficos, `quadradinho e barra de ${nome}`, naCor(cor), p["paper-hi"], 3, false);
  for (const [nome, cor] of CORES) conferir(graficos, `nome no chip, ${nome} / --paper`, nomeNoChip(cor), p.paper, 4.5, false);
}

// Lousa (briefing §7): caneta e destaques sobre o vidro (tema claro) e o quadro (tema escuro).
for (const [tema, p] of Object.entries({ claro, escuro })) {
  const { mistura, canetaNoTraco, canetaNoTexto } = LOUSA[tema];
  const lousa = `Lousa, tema ${tema} (texto 4,5:1; traço 3:1)`;
  conferir(lousa, "caneta", p["lousa-caneta"], p.lousa, 4.5, true);
  conferir(lousa, "texto secundário (caneta a 72%)", misturar(p["lousa-caneta"], p.lousa, 28), p.lousa, 4.5, true);
  for (const [nome, cor] of CORES) {
    const destaque = misturar(cor, p["lousa-mistura"], mistura);
    conferir(lousa, `traço em destaque, ${nome}`, misturar(destaque, p["lousa-caneta"], canetaNoTraco), p.lousa, 3, true);
    conferir(lousa, `texto em destaque, ${nome}`, misturar(destaque, p["lousa-caneta"], canetaNoTexto), p.lousa, 4.5, true);
  }
}

// Livros (D30, D32): o título grande e o ícone sobre a cor do livro; o título da lombada, o número e o
// desenho no destaque sobre o papel; o texto da revista. As cores são as do padrão dos livros
// (docs/capas/cores.js, iguais às referências) e o livro é arte, com o texto de verdade no rótulo do
// link e na página. Por isso só avisa.
const livro = "Texto dos livros, arte com rótulo acessível (4,5:1 desejável)";
for (const c of CATEGORIAS) {
  conferir(livro, `${c.nome}: tinta / cor`, c.cores.tinta, c.cores.cor, 4.5, false);
  conferir(livro, `${c.nome}: destaque / papel`, c.cores.destaque, c.cores.papel, 4.5, false);
}
for (const s of SERIES) {
  conferir(livro, `${s.nome}: destaque / papel`, s.destaque, PAPEL, 4.5, false);
  conferir(livro, `${s.nome}: tinta do papel / papel`, TINTA_PAPEL, PAPEL, 4.5, false);
}

// Texto pequeno nas lombadas (D35): onde a cor do livro fica abaixo de 4,5:1, a lombada usa a
// variante (corTexto, destaqueTexto em docs/capas/livros.json). Texto de verdade: falha o script.
// Desde a D39 os livros não mudam com o tema: estes pares valem para o claro e para o escuro.
const pequeno = "Texto pequeno nas lombadas (4,5:1)";
for (const c of CATEGORIAS) {
  conferir(pequeno, `${c.nome}: tinta / cor da lombada`, c.cores.tinta, c.cores.corTexto ?? c.cores.cor, 4.5, true);
  conferir(pequeno, `${c.nome}: destaque / papel`, c.cores.destaque, c.cores.papel, 4.5, true);
}
for (const s of SERIES) {
  conferir(pequeno, `${s.nome}: destaque da lombada / papel`, s.destaqueTexto ?? s.destaque, PAPEL, 4.5, true);
}

// Sumário na cor do livro (D39): o trilho, o ponto atual e a barra de porcentagem usam o destaque do
// livro (com o branco dos desenhos no escuro) sobre a folha. Elemento gráfico: 3:1 (falha o script).
for (const [tema, p] of Object.entries({ claro, escuro })) {
  const grupo = `Sumário na cor do livro, tema ${tema} (3:1)`;
  const naFolha = (cor) => (tema === "escuro" ? misturar(cor, "#FFFFFF", BRANCO_NO_ESCURO) : cor);
  for (const c of CATEGORIAS) conferir(grupo, c.nome, naFolha(c.cores.destaque), p["paper-hi"], 3, true);
  for (const s of SERIES) conferir(grupo, s.nome, naFolha(s.destaque), p["paper-hi"], 3, true);
}

// Caderno marcado (D41): o texto sobre o marca-texto (a cor do livro, clareada no escuro, com a
// transparência da força por cima da folha; a composição do navegador é em sRGB) e a caneta (o
// sublinhado, o círculo e o colchete, na cor do sumário) sobre a folha.
const sobre = (fundo, cor, alfa) => {
  const [f, c] = [rgb(fundo), rgb(cor)];
  return "#" + f.map((v, i) => Math.round((v * (1 - alfa) + c[i] * alfa) * 255).toString(16).padStart(2, "0")).join("").toUpperCase();
};
for (const [tema, p] of Object.entries({ claro, escuro })) {
  const { branco, forca } = MARCA_TEXTO[tema];
  const grupo = `Caderno marcado, tema ${tema} (texto 4,5:1; caneta 3:1)`;
  // Na folha e, no celular, direto no fundo (o corpo do artigo fica sem cartão, D39).
  for (const papel of ["paper-hi", "paper"]) {
    for (const [nome, cor] of CORES) {
      const fundo = sobre(p[papel], misturar(cor, "#FFFFFF", branco), forca / 100);
      conferir(grupo, `--ink no marca-texto de ${nome} / --${papel}`, p.ink, fundo, 4.5, true);
      // O termo marcado é código: a pintura vai por cima do fundo do código (--well).
      if (papel === "paper-hi") conferir(grupo, `--ink no termo marcado de ${nome}`, p.ink, sobre(p.well, misturar(cor, "#FFFFFF", branco), forca / 100), 4.5, true);
    }
    const naFolha = (cor) => (tema === "escuro" ? misturar(cor, "#FFFFFF", BRANCO_NO_ESCURO) : cor);
    for (const c of CATEGORIAS) conferir(grupo, `caneta de ${c.nome} / --${papel}`, naFolha(c.cores.destaque), p[papel], 3, true);
    for (const s of SERIES) conferir(grupo, `caneta de ${s.nome} / --${papel}`, naFolha(s.destaque), p[papel], 3, true);
  }
}

// Visor e marca (D33): texto de verdade, com o mínimo de 4,5:1 (falha o script).
for (const [tema, p] of Object.entries({ claro, escuro })) {
  const grupo = `Visor e marca, tema ${tema} (4,5:1)`;
  conferir(grupo, "texto do visor / véu (88%) sobre o fundo", p["veu-tinta"], misturar(p.paper, p.veu, 88), 4.5, true);
  conferir(grupo, "contador do visor (78%) / véu", misturar(p["veu-tinta"], misturar(p.paper, p.veu, 88), 22), misturar(p.paper, p.veu, 88), 4.5, true);
  conferir(grupo, "letras da marca / capa da marca", p["marca-letra"], p.marca, 4.5, true);
}

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
