#!/usr/bin/env node
/**
 * Leva a coleção de 13 (final/dados.json) para colecoes.json como a sugestão "final", que a página
 * /amostra/colecoes/final/ (só no dev) mostra com os componentes do site: a estante em ordem
 * alfabética (= volume) e as capas com os desenhos novos (src/livros/desenhos/novo-<slug>.svg; o livro
 * sem desenho entra com o lápis do rascunho).
 *
 *   node docs/prototipos/colecoes/final/montar.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const aqui = dirname(fileURLToPath(import.meta.url));
const arquivoColecoes = join(aqui, "..", "colecoes.json");
const colecoes = JSON.parse(readFileSync(arquivoColecoes, "utf8"));
const { livros } = JSON.parse(readFileSync(join(aqui, "dados.json"), "utf8"));

const ordenados = [...livros].sort((a, b) => a.titulo.localeCompare(b.titulo, "pt-BR"));
ordenados.forEach((l, i) => {
  if (l.volume !== i + 1) throw new Error(`dados.json: ${l.titulo} está como volume ${l.volume}, mas é o ${i + 1} na ordem alfabética.`);
});

const sobrescreve = {};
const posts = {};
for (const l of ordenados) {
  // O livro que ainda não existe em colecoes.json (Frontend) entra com o básico; o resto vem por cima.
  colecoes.livros[l.slug] ??= { titulo: l.titulo, linhas: l.linhas, frase: l.frase, abrange: l.abrange, cor: l.cor };
  sobrescreve[l.slug] = {
    titulo: l.titulo,
    linhas: l.linhas,
    corpo: l.corpo,
    entrelinha: l.entrelinha,
    frase: l.frase,
    abrange: l.abrange,
    vemDe: l.vemDe,
    cor: l.cor,
    nomeCor: l.nomeCor,
    motivoCor: l.motivoCor,
    instrumento: l.instrumento,
    motivoDesenho: [l.data, l.trabalho].filter(Boolean).join(" · "),
    desenho: l.desenho,
  };
  posts[l.slug] = l.posts;
}

const final = {
  id: "final",
  nome: "A coleção de 13",
  ideia:
    "A sugestão 5 com Frontend, escolhida pelo Cesar (D78): treze livros em ordem alfabética, que é a ordem dos volumes. Desenhos, cores, frases e textos novos; os livros de hoje mantêm o nome e Carreira sai.",
  livros: ordenados.map((l) => l.slug),
  posts,
  sobrescreve,
};
colecoes.sugestoes = colecoes.sugestoes.filter((s) => s.id !== "final");
colecoes.sugestoes.push(final);
writeFileSync(arquivoColecoes, `${JSON.stringify(colecoes, null, 2)}\n`);
console.log(`colecoes.json: sugestão final com ${ordenados.length} livros (${Object.values(posts).flat().length} posts).`);
