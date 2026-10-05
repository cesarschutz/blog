#!/usr/bin/env node
/** Regressões de semântica das tabelas e proporção das imagens públicas no build. */
import assert from "node:assert/strict";
import { rehypeTabela } from "../../src/plugins/rehype-tabela.mjs";
import { rehypeImagens } from "../../src/plugins/rehype-imagens.mjs";
const el = (tagName, children = []) => ({
  type: "element",
  tagName,
  properties: {},
  children,
});
const celula = (tag, value) => el(tag, [{ type: "text", value }]);
for (const canto of ["", "Recurso"]) {
  const linha = el("tr", [celula("td", "Postgres"), celula("td", "Sim")]);
  const tabela = el("table", [
    el("thead", [el("tr", [celula("th", canto), celula("th", "Em repouso")])]),
    el("tbody", [linha]),
  ]);
  const arvore = { type: "root", children: [tabela] };
  rehypeTabela()(arvore);
  assert.equal(linha.children[0].tagName, canto ? "td" : "th");
  assert.equal(linha.children[1].tagName, "td");
  assert.equal(
    tabela.children[0].children[0].children[1].properties.scope,
    "col",
  );
  // Executar a transformação de novo não promove uma segunda célula a cabeçalho de linha.
  rehypeTabela()(arvore);
  assert.equal(linha.children[1].tagName, "td");
}
const imagem = el("img");
imagem.properties.src = "/posts/java-17/sealed-hierarquia.svg";
rehypeImagens()(imagem);
assert.equal(imagem.properties.width, 940);
assert.equal(imagem.properties.height, 610);
assert.equal(imagem.properties.loading, "lazy");
const explicita = el("img");
explicita.properties = {
  src: imagem.properties.src,
  width: 400,
  height: 250,
  loading: "eager",
};
rehypeImagens()(explicita);
assert.equal(explicita.properties.height, 250);
assert.equal(explicita.properties.loading, "eager");
console.log(
  "Plugins: semântica, repetição e preservação de dimensões explícitas passaram.",
);
