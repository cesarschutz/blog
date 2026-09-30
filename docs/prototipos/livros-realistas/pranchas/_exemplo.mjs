#!/usr/bin/env node
/**
 * Exemplo mínimo da API (não é uma das pranchas): um livro em pé, em três quartos, com a capa e a
 * lombada arredondada mapeadas, o topo do miolo, a luz por célula e a sombra no chão. Serve de
 * ponto de partida técnico; o acabamento de cada prancha é outro trabalho.
 *
 *   node pranchas/_exemplo.mjs  →  pranchas/_exemplo.svg
 */
import { fileURLToPath } from "node:url";
import { capa, lombada, livro } from "../base/base.mjs";
import { Prancha, camera, enquadrar, superficie, sombrearFace, girarY, sombra, linhasDasFolhas, face, pontos } from "../ferramentas/cena.mjs";

const L = livro("arquitetura-de-software");
const W = 480, H = 720, T = L.largura; // espessura = largura da lombada
const giro = 38; // a lombada vira para o observador (como no site)
const g = (p) => girarY(p, giro, [W / 2, 0, 0]);

const pr = new Prancha({ prefixo: "ex", largura: 900, altura: 900, titulo: "Exemplo da API" });
const artCapa = pr.simbolo(capa(L.slug), { largura: W, altura: H, nome: "capa" });
const artLombada = pr.simbolo(lombada(L.slug), { largura: T, altura: H, nome: "lombada" });

const cam = camera({ olho: [-900, 1100, 2600], alvo: [W / 2, H / 2, 0], focal: 1000, centro: [450, 450] });
const cantos = [];
for (const x of [0, W]) for (const y of [0, H]) for (const z of [-T / 2, T / 2]) cantos.push(g([x, y, z]));
enquadrar(cam, cantos, [120, 60, 660, 780]);

// Sombra no chão: a pegada do livro.
const pegada = [g([0, 0, -T / 2]), g([W, 0, -T / 2]), g([W, 0, T / 2]), g([0, 0, T / 2])].map((p) => cam.p(p));
pr.add(sombra(pr, pegada, [{ desvio: 22, opacidade: 0.18, dx: 30, dy: 6 }, { desvio: 4, opacidade: 0.35, dx: 3, dy: 1 }]));

// Capa (plana), em z = +T/2.
const capaP = (u, v) => g([u, H - v, T / 2]);
const c = superficie(pr, { ref: artCapa, w: W, h: H, P: capaP, cam, nu: 10, nv: 10 });
pr.add(c.svg);
pr.add(sombrearFace(pr, { P: capaP, w: W, h: H, cam, luz: [-0.6, 0.7, 0.4], ambiente: 0.55, forca: 0.5 }));

// Lombada arredondada: arco que passa por z = ±T/2 em x = 0 e sai b para fora.
const b = T * 0.16;
const xc = (T * T / 4 - b * b) / (2 * b), R = xc + b, phi = Math.asin(T / 2 / R);
const lombP = (u, v) => {
  const th = Math.PI + phi - 2 * phi * (u / T);
  return g([xc + R * Math.cos(th), H - v, R * Math.sin(th)]);
};
const l = superficie(pr, { ref: artLombada, w: T, h: H, P: lombP, cam, nu: 24, nv: 1 });
pr.add(l.svg);
pr.add(sombrearFace(pr, { P: lombP, w: T, h: H, cam, luz: [-0.6, 0.7, 0.4], ambiente: 0.45, forca: 0.6, especular: { forca: 0.18, expoente: 30 } }));

// Topo do miolo (papel com as linhas das folhas), um pouco abaixo do alto da capa.
const s = 9; // seixa
const topo = [g([4, H - s, T / 2 - 8]), g([W - s, H - s, T / 2 - 8]), g([W - s, H - s, -T / 2 + 8]), g([4, H - s, -T / 2 + 8])];
pr.add(`<polygon points="${pontos(face(cam, topo))}" fill="${L.papel}"/>`);
pr.add(linhasDasFolhas(cam, [topo[0], topo[1], topo[2], topo[3]], { quantas: 50, opacidade: 0.14 }));

const saida = fileURLToPath(new URL("./_exemplo.svg", import.meta.url));
pr.salvar(saida);
console.log("✓", saida);
