#!/usr/bin/env node
/**
 * Confere as regras de escrita de um post (D71, skill `post`, seção "Escrita"): o título que faz
 * sentido sozinho, a descrição, o TL;DR, a abertura, a primeira pessoa e os avisos de post em partes.
 *
 *   npm run escrita -- <slug> [<slug>…]   confere os posts dados; sai 1 se houver problema
 *   npm run escrita                        lista o que cada post do blog tem (não falha: os posts
 *                                          antigos não precisam ser corrigidos)
 *
 * "problema" é o que a regra proíbe; "aviso" é o que vale olhar e explicar no relatório. O script não
 * julga se o título é bom: só pega o que dá para pegar sozinho.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PASTA = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "content", "posts");

const LIMITES = { assunto: 45, tituloAlvo: 70, tituloTeto: 85, descricaoAlvo: 160, descricaoTeto: 200, pontoTldr: 40 };

/** Palavras que só existem na primeira pessoa do singular (as ambíguas, como "uso" e "vi", ficam de fora). */
const PRIMEIRA_PESSOA =
  /(?<![\p{L}\p{N}_-])(eu|meus?|minhas?|criei|testei|fiz|usei|rodei|escrevi|montei|aprendi|descobri|publiquei|percebi|decidi|precisei|conferi|comecei|demorei|encontrei|tentei|medi|abri|errei|troquei|estou|vou|acho|prefiro|recomendo|sei)(?![\p{L}\p{N}_-])/giu;

const palavras = (s) => (s.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) ?? []).length;

function ler(slug) {
  const arquivo = [".mdx", ".md"].map((ext) => join(PASTA, slug + ext)).find(existsSync);
  if (!arquivo) return undefined;
  const texto = readFileSync(arquivo, "utf8");
  const fim = texto.indexOf("\n---\n", 4);
  const cabeca = texto.slice(4, fim);
  const corpo = texto.slice(fim + 5);
  const campo = (nome) => {
    const m = cabeca.match(new RegExp(`^${nome}:\\s*(.*)$`, "m"));
    return m ? m[1].trim().replace(/^(["'])(.*)\1$/, "$2") : "";
  };
  const tldr = [...cabeca.matchAll(/^\s+-\s+"(.*)"\s*$/gm)].map((m) => m[1]);
  return { slug, titulo: campo("title"), descricao: campo("description"), formato: campo("formato"), tldr, corpo, linhaDoCorpo: texto.slice(0, fim + 5).split("\n").length };
}

/** O texto sem o que não é prosa do autor: código, componentes, links (fica o texto), diretivas da caneta e citações entre aspas. */
function prosa(linha) {
  return linha
    .replace(/`[^`]*`/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\{[^}]*\}/g, " ")
    .replace(/"[^"]*"|“[^”]*”/g, " ");
}

function conferir(post) {
  const problemas = [];
  const avisos = [];
  const { titulo, descricao, tldr, corpo } = post;

  // Título
  const [assunto, ...resto] = titulo.split(" — ");
  const complemento = resto.join(" — ");
  if (titulo.includes("?")) problemas.push(`título com pergunta: "${titulo}" (o título afirma o assunto)`);
  if (!complemento) avisos.push("título sem complemento depois de \" — \" (o recorte do post)");
  if (assunto.length > LIMITES.assunto) avisos.push(`assunto do título com ${assunto.length} caracteres (até ~${LIMITES.assunto}): "${assunto}"`);
  if (titulo.length > LIMITES.tituloTeto) problemas.push(`título com ${titulo.length} caracteres (teto de ${LIMITES.tituloTeto})`);
  else if (titulo.replace(/\s*\(parte \d+ de \d+\)\s*$/i, "").length > LIMITES.tituloAlvo) avisos.push(`título com ${titulo.length} caracteres (alvo de ~65; o que importa nos primeiros 60)`);
  if (/[.!]$/.test(titulo)) problemas.push("título com ponto no fim");
  const parte = titulo.match(/\(parte (\d+) de (\d+)\)\s*$/i);
  if (/\bparte \d+\b/i.test(titulo) && !parte) problemas.push('post em partes: o título termina em "(parte N de M)"');
  if (parte && /\bparte \d+\b/i.test(assunto)) problemas.push('post em partes: "parte N" vai no fim do complemento, não no assunto');

  // Descrição
  const semMarcas = descricao.replace(/[`*]/g, "");
  if (!semMarcas) problemas.push("sem description");
  if (semMarcas.length > LIMITES.descricaoTeto) problemas.push(`description com ${semMarcas.length} caracteres (teto de ${LIMITES.descricaoTeto})`);
  else if (semMarcas.length > LIMITES.descricaoAlvo) avisos.push(`description com ${semMarcas.length} caracteres (o essencial tem de estar nos primeiros ${LIMITES.descricaoAlvo})`);
  if (semMarcas && !/[.?!…]$/.test(semMarcas)) avisos.push("description sem ponto final (uma ou duas frases completas)");
  if (/^(neste|nesse) (post|artigo)/i.test(semMarcas)) problemas.push('description começando por "Neste post"');

  // TL;DR
  if (post.formato === "detalhado") {
    if (tldr.length < 3 || tldr.length > 5) avisos.push(`TL;DR com ${tldr.length} pontos (de 3 a 5)`);
    tldr.forEach((p, i) => {
      const n = palavras(p.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1"));
      if (n > LIMITES.pontoTldr + 8) avisos.push(`ponto ${i + 1} do TL;DR com ${n} palavras (até ~${LIMITES.pontoTldr})`);
      if (/^(o|este|esse|neste) (post|artigo|texto)\b/i.test(p.replace(/[*`]/g, ""))) avisos.push(`ponto ${i + 1} do TL;DR parece item de índice ("${p.slice(0, 40)}…"): escreva a conclusão`);
    });
  }

  // Abertura: os dois primeiros blocos do corpo
  const linhas = corpo.split("\n");
  const blocos = [];
  let atual = [];
  let emCodigo = false;
  let emComponente = false;
  linhas.forEach((l, i) => {
    if (/^```/.test(l)) emCodigo = !emCodigo;
    if (emCodigo || /^import /.test(l)) return;
    if (/^<[A-Z]/.test(l)) emComponente = true;
    if (l.trim() === "") {
      if (atual.length) blocos.push(atual);
      atual = [];
      return;
    }
    atual.push({ texto: l, linha: post.linhaDoCorpo + i, componente: emComponente });
    if (emComponente && /\/>\s*$/.test(l)) emComponente = false;
  });
  if (atual.length) blocos.push(atual);
  const primeiro = blocos[0]?.map((x) => x.texto).join(" ") ?? "";
  if (/^<[A-Z]/.test(primeiro) || /^!\[/.test(primeiro)) problemas.push("o post abre por uma imagem ou desenho (primeiro vêm os dois parágrafos da abertura)");
  if (blocos[1] && /^<[A-Z]/.test(blocos[1][0].texto)) problemas.push("imagem ou desenho antes do segundo parágrafo da abertura");
  if (/\?/.test(prosa(primeiro))) problemas.push("o primeiro parágrafo tem pergunta (ele diz o assunto e por que importa)");
  if (/^(outro dia|um dia|certa vez|ontem|semana passada|esses dias)\b/i.test(primeiro)) problemas.push("o post abre por uma cena (o assunto vem primeiro; a história, depois)");
  if (/^#/.test(primeiro)) avisos.push("o post começa por um título de seção, sem abertura");

  // Primeira pessoa, linha a linha (fora do código, dos componentes e da seção de fontes)
  emCodigo = false;
  let emFontes = false;
  linhas.forEach((l, i) => {
    if (/^```/.test(l)) emCodigo = !emCodigo;
    if (/^## Fontes\s*$/.test(l)) emFontes = true;
    if (emCodigo || emFontes || /^import /.test(l)) return;
    const achados = [...prosa(l).matchAll(PRIMEIRA_PESSOA)].map((m) => m[1].toLowerCase());
    if (achados.length) problemas.push(`primeira pessoa na linha ${post.linhaDoCorpo + i}: ${[...new Set(achados)].join(", ")}`);
  });
  for (const texto of [titulo, descricao, ...tldr]) {
    const achados = [...prosa(texto).matchAll(PRIMEIRA_PESSOA)].map((m) => m[1].toLowerCase());
    if (achados.length) problemas.push(`primeira pessoa no frontmatter: ${[...new Set(achados)].join(", ")}`);
  }

  // Post em partes
  if (parte) {
    const [, n, m] = parte;
    if (!new RegExp(`\\[!NOTA\\]\\s*Parte ${n} de ${m}`, "i").test(corpo)) problemas.push(`post em partes: falta o aviso "> [!NOTA] Parte ${n} de ${m}" depois da abertura`);
    if (!/\]\(\/posts\/[a-z0-9-]+\/\)/.test(corpo)) problemas.push("post em partes: falta o link para a outra parte");
    if (post.formato === "detalhado" && !tldr.some((p) => /\/posts\//.test(p)) && Number(n) === 1) avisos.push("post em partes: o último ponto do TL;DR aponta a outra parte");
  }

  return { problemas, avisos };
}

const pedidos = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const slugs = pedidos.length ? pedidos : readdirSync(PASTA).filter((f) => /\.mdx?$/.test(f)).map((f) => f.replace(/\.mdx?$/, "")).sort();
let falhou = false;

for (const slug of slugs) {
  const post = ler(slug);
  if (!post) {
    console.error(`✗ ${slug}: não há src/content/posts/${slug}.md(x)`);
    falhou = true;
    continue;
  }
  const { problemas, avisos } = conferir(post);
  if (!problemas.length && !avisos.length) {
    console.log(`✓ ${slug}`);
    continue;
  }
  console.log(`${problemas.length ? "✗" : "·"} ${slug}`);
  for (const p of problemas) console.log(`    problema: ${p}`);
  for (const a of avisos) console.log(`    aviso:    ${a}`);
  if (problemas.length) falhou = true;
}

if (pedidos.length) {
  console.log(falhou ? "\nHá problema de escrita: corrija antes de seguir." : "\nEscrita ok.");
  process.exit(falhou ? 1 : 0);
}
console.log("\nLevantamento de todos os posts: os antigos não precisam ser corrigidos (D71).");
