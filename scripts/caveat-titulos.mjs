#!/usr/bin/env node
/**
 * O subconjunto da Caveat 600 dos títulos à mão (C05, D52): só as letras de TITULOS_A_MAO
 * (src/data/mao.ts), com as alternativas de contexto da fonte (o "calt", que evita duas letras iguais
 * idênticas lado a lado) e sem as instruções de hinting. Sai em src/assets/caveat-titulos.woff (~11 KB;
 * a Caveat inteira, no latim, tem 51 KB).
 *
 * O corte é do `hb-subset` (HarfBuzz, do Homebrew, que vem com o poppler que a marca já usa). Ele não lê
 * WOFF, então o script abre o WOFF do @fontsource (cada tabela comprimida com zlib), corta a fonte e
 * fecha o resultado em WOFF de novo, só com o zlib do Node.
 *   node scripts/caveat-titulos.mjs
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync, inflateSync } from "node:zlib";
import { TITULOS_A_MAO } from "../src/data/mao.ts";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const ORIGEM = join(RAIZ, "node_modules/@fontsource/caveat/files/caveat-latin-600-normal.woff");
const DESTINO = join(RAIZ, "src/assets/caveat-titulos.woff");

const alinhar = (n) => (n + 3) & ~3;

/** WOFF 1.0 → as tabelas da fonte (tag, soma e dados já descomprimidos). */
function abrirWoff(b) {
  if (b.toString("latin1", 0, 4) !== "wOFF") throw new Error(`${ORIGEM} não é um WOFF 1.0`);
  const tipo = b.readUInt32BE(4);
  const tabelas = [];
  for (let i = 0; i < b.readUInt16BE(12); i++) {
    const o = 44 + i * 20;
    const [inicio, comprimida, original] = [b.readUInt32BE(o + 4), b.readUInt32BE(o + 8), b.readUInt32BE(o + 12)];
    const bruto = b.subarray(inicio, inicio + comprimida);
    tabelas.push({ tag: b.toString("latin1", o, o + 4), soma: b.readUInt32BE(o + 16), dados: comprimida < original ? inflateSync(bruto) : Buffer.from(bruto) });
  }
  return { tipo, tabelas };
}

/** As tabelas → uma fonte TrueType (sfnt), com o diretório em ordem de tag. */
function montarSfnt({ tipo, tabelas }) {
  tabelas.sort((a, b) => (a.tag < b.tag ? -1 : 1));
  const n = tabelas.length;
  let potencia = 1;
  let expoente = 0;
  while (potencia * 2 <= n) [potencia, expoente] = [potencia * 2, expoente + 1];
  let inicio = 12 + 16 * n;
  const saida = Buffer.alloc(inicio + tabelas.reduce((s, t) => s + alinhar(t.dados.length), 0));
  saida.writeUInt32BE(tipo, 0);
  saida.writeUInt16BE(n, 4);
  saida.writeUInt16BE(potencia * 16, 6);
  saida.writeUInt16BE(expoente, 8);
  saida.writeUInt16BE(n * 16 - potencia * 16, 10);
  tabelas.forEach((t, i) => {
    const r = 12 + i * 16;
    saida.write(t.tag, r, "latin1");
    saida.writeUInt32BE(t.soma, r + 4);
    saida.writeUInt32BE(inicio, r + 8);
    saida.writeUInt32BE(t.dados.length, r + 12);
    t.dados.copy(saida, inicio);
    inicio += alinhar(t.dados.length);
  });
  return saida;
}

/** Uma fonte TrueType → WOFF 1.0, cada tabela comprimida quando fica menor. */
function fecharWoff(s) {
  const tipo = s.readUInt32BE(0);
  const tabelas = [];
  for (let i = 0; i < s.readUInt16BE(4); i++) {
    const r = 12 + i * 16;
    const [inicio, tamanho] = [s.readUInt32BE(r + 8), s.readUInt32BE(r + 12)];
    const dados = s.subarray(inicio, inicio + tamanho);
    const z = deflateSync(dados, { level: 9 });
    tabelas.push({ tag: s.toString("latin1", r, r + 4), soma: s.readUInt32BE(r + 4), original: tamanho, dados: z.length < tamanho ? z : dados });
  }
  const n = tabelas.length;
  let inicio = 44 + 20 * n;
  const total = inicio + tabelas.reduce((a, t) => a + alinhar(t.dados.length), 0);
  const saida = Buffer.alloc(total);
  saida.write("wOFF", 0, "latin1");
  saida.writeUInt32BE(tipo, 4);
  saida.writeUInt32BE(total, 8);
  saida.writeUInt16BE(n, 12);
  saida.writeUInt32BE(12 + 16 * n + tabelas.reduce((a, t) => a + alinhar(t.original), 0), 16);
  saida.writeUInt16BE(1, 20);
  tabelas.forEach((t, i) => {
    const r = 44 + i * 20;
    saida.write(t.tag, r, "latin1");
    saida.writeUInt32BE(inicio, r + 4);
    saida.writeUInt32BE(t.dados.length, r + 8);
    saida.writeUInt32BE(t.original, r + 12);
    saida.writeUInt32BE(t.soma, r + 16);
    t.dados.copy(saida, inicio);
    inicio += alinhar(t.dados.length);
  });
  return saida;
}

const pasta = mkdtempSync(join(tmpdir(), "caveat-titulos-"));
try {
  const inteira = join(pasta, "caveat.ttf");
  const cortada = join(pasta, "titulos.ttf");
  writeFileSync(inteira, montarSfnt(abrirWoff(readFileSync(ORIGEM))));
  // Os pontos de código em hexadecimal: o hb-subset recusa texto com acento em alguns terminais.
  const letras = [...new Set(TITULOS_A_MAO.join(""))].sort();
  const pontos = letras.map((c) => c.codePointAt(0).toString(16)).join(",");
  execFileSync("hb-subset", ["--no-hinting", `--unicodes=${pontos}`, "-o", cortada, inteira]);
  const woff = fecharWoff(readFileSync(cortada));
  writeFileSync(DESTINO, woff);
  console.log(`${DESTINO}: ${(woff.length / 1024).toFixed(1)} KB, ${letras.length} caracteres (${letras.join("")})`);
} finally {
  rmSync(pasta, { recursive: true, force: true });
}
