#!/usr/bin/env node
/**
 * Grava as peças planas da base (base/*.svg), para conferir com o site e para as pranchas verem o
 * ponto de partida: a capa, a lombada do livro 3D e a da estante de cada livro, a contracapa, o verso
 * da capa, a revista e a folha com tudo junto (base/folha.svg).
 *
 *   node ferramentas/gerar-base.mjs
 */
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { LIVROS, capa, lombada, lombadaDaEstante, contracapa, versoDaCapa, capaDaRevista, lombadaDaRevista, lombadaDaRevistaNaEstante, REVISTA, documento } from "../base/base.mjs";

const pasta = join(dirname(fileURLToPath(import.meta.url)), "..", "base");
const gravar = (nome, doc) => writeFileSync(join(pasta, nome), doc);

for (const l of LIVROS) {
  gravar(`capa-${l.slug}.svg`, documento({ largura: 480, altura: 720, titulo: `Capa: ${l.titulo}`, miolo: capa(l.slug) }));
  gravar(`lombada-${l.slug}.svg`, documento({ largura: l.largura, altura: 720, titulo: `Lombada (livro 3D): ${l.titulo}`, miolo: lombada(l.slug) }));
  gravar(`lombada-estante-${l.slug}.svg`, documento({ largura: l.largura, altura: l.altura, titulo: `Lombada (estante): ${l.titulo}`, miolo: lombadaDaEstante(l.slug) }));
}
gravar("capa-serie-java.svg", documento({ largura: 480, altura: 720, titulo: `Capa: ${REVISTA.titulo}`, miolo: capaDaRevista() }));
gravar("lombada-serie-java.svg", documento({ largura: REVISTA.largura, altura: 720, titulo: `Lombada (3D): ${REVISTA.titulo}`, miolo: lombadaDaRevista() }));
gravar("lombada-estante-serie-java.svg", documento({ largura: REVISTA.largura, altura: REVISTA.altura, titulo: `Lombada (estante): ${REVISTA.titulo}`, miolo: lombadaDaRevistaNaEstante() }));

// A folha: lombada colada à capa de cada livro (como /amostra/livros/), a estante plana e o verso.
const pecas = [];
let x = 0;
for (const l of [...LIVROS]) {
  pecas.push(`<g transform="translate(${x} 0)">${lombada(l.slug)}<g transform="translate(${l.largura} 0)">${capa(l.slug)}</g></g>`);
  x += l.largura + 480 + 40;
}
pecas.push(`<g transform="translate(${x} 0)">${lombadaDaRevista()}<g transform="translate(${REVISTA.largura} 0)">${capaDaRevista()}</g></g>`);
x += REVISTA.largura + 480 + 40;
const larguraFolha = x - 40;
// Estante plana: os livros em pé com 6 entre eles, alinhados pela base.
let ex = 0;
const altMax = Math.max(...LIVROS.map((l) => l.altura), REVISTA.altura);
const estante = [];
for (const l of LIVROS) {
  estante.push(`<g transform="translate(${ex} ${altMax - l.altura})">${lombadaDaEstante(l.slug)}</g>`);
  ex += l.largura + 6;
}
estante.push(`<g transform="translate(${ex + 40} ${altMax - REVISTA.altura})">${lombadaDaRevistaNaEstante()}</g>`);
const extras = `<g transform="translate(0 780)">${estante.join("")}</g><g transform="translate(${ex + 200} 780)">${contracapa("arquitetura-de-software")}</g><g transform="translate(${ex + 720} 780)">${versoDaCapa("arquitetura-de-software")}</g>`;
gravar("folha.svg", documento({ largura: larguraFolha, altura: 780 + altMax, titulo: "Folha da base: todas as peças planas", miolo: `<rect width="100%" height="100%" fill="#15191c"/>${pecas.join("")}${extras}` }));

console.log(`✓ base/: ${LIVROS.length * 3 + 3} peças e a folha`);
