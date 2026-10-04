#!/usr/bin/env node
/**
 * As fotos dos livros (D57): as imagens paradas que saem das pranchas 04 e 06 em
 * docs/prototipos/livros-realistas/, feitas com as capas de verdade do site.
 *
 * - public/livros/fotos/<id>-deitado.webp: cada livro (e a série) deitado na mesa, com a fita, para a
 *   ficha "Do livro" do artigo (Sumario.astro e RodapeArtigo.astro). Sem as etiquetas: os oito lugares
 *   delas vão para src/livros/fotos.json, e o site desenha por cima, em SVG, uma por artigo (FotoDoLivro).
 * - public/livros/fotos/<slug>-aberto.webp: o livro aberto com as páginas em branco, na cor de cada
 *   livro ainda sem artigos (página do livro e gaveta da home), e busca-aberto.webp (busca sem
 *   resultado), no livro da marca.
 *
 * Mede as capas no dev (medir.mjs), monta cada cena em SVG (deitado.mjs, aberto.mjs), fotografa no
 * Chrome em 2x e grava em WebP. Precisa do dev no ar:
 *
 *   node scripts/livros/fotos.mjs            (ENDERECO troca o dev; padrão http://127.0.0.1:4322)
 *
 * Rode de novo quando entrar livro novo, mudar uma capa ou a lombada, ou um livro passar a ter (ou a
 * não ter) artigos. O número de artigos da lombada entra na foto: artigo novo pede foto nova (o build
 * avisa quando a foto ficou para trás, src/lib/fotos.ts).
 */
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import { opcoesDoChrome } from "../chrome.mjs";
import sharp from "sharp";
import { LIVROS, REVISTA, capa, capaDaRevista, iniciarBase, lombada, lombadaDaRevista } from "./base.mjs";
import { medir } from "./medir.mjs";
import { livroDeitado } from "./deitado.mjs";
import { livroAberto } from "./aberto.mjs";

const RAIZ = fileURLToPath(new URL("../../", import.meta.url));
const PASTA = join(RAIZ, "public/livros/fotos");
const DADOS = join(RAIZ, "src/livros/fotos.json");
const endereco = process.env.ENDERECO ?? "http://127.0.0.1:4322";

/** Largura final de cada foto, em px de tela (o WebP sai com o dobro). */
const LARGURA = { deitado: 250, aberto: 200 };

// Conversões para a cor da fita da série: o laranja da faixa, mais escuro e menos saturado (como a
// fita dos livros sai da cor de cada um).
const linear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const gama = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
function escurecer(hex, fL, fC) {
  const [r, g, b] = [1, 3, 5].map((i) => linear(parseInt(hex.slice(i, i + 2), 16) / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = (0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s) * fL;
  const A = (1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s) * fC;
  const B = (0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s) * fC;
  const l2 = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m2 = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s2 = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  const rgb = [4.0767416621 * l2 - 3.3077115913 * m2 + 0.2309699292 * s2, -1.2684380046 * l2 + 2.6097574011 * m2 - 0.3413193965 * s2, -0.0041960863 * l2 - 0.7034186147 * m2 + 1.707614701 * s2];
  return "#" + rgb.map((v) => Math.round(Math.min(1, Math.max(0, gama(Math.max(0, v)))) * 255).toString(16).padStart(2, "0")).join("");
}

/** Fotografa um SVG (com as fontes dos livros) em 2x, com o fundo transparente, e grava em WebP. */
async function fotografar(pagina, { svg, largura, altura }, larguraFinal, arquivo) {
  const escala = larguraFinal / largura;
  const alturaFinal = Math.round(altura * escala);
  await pagina.setViewportSize({ width: larguraFinal, height: alturaFinal });
  // O SVG já traz as fontes dos livros (base.documento).
  await pagina.setContent(`<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:transparent}svg{display:block;width:${larguraFinal}px;height:${alturaFinal}px}</style>${svg}`);
  await pagina.evaluate(async () => {
    await Promise.all(["800 20px 'Bitter Variable'", "700 20px 'Bitter Variable'", "italic 400 20px 'Newsreader Variable'"].map((f) => document.fonts.load(f, "Aãç")));
    await document.fonts.ready;
  });
  await pagina.waitForTimeout(100);
  const png = await pagina.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: larguraFinal, height: alturaFinal } });
  const webp = await sharp(png).webp({ quality: 80, alphaQuality: 88, effort: 6, smartSubsample: true }).toBuffer();
  writeFileSync(arquivo, webp);
  return { largura: larguraFinal, altura: alturaFinal, bytes: webp.length };
}

const arred = (v, casas = 3) => Math.round(v * 10 ** casas) / 10 ** casas;
/** Uma etiqueta para o fotos.json: as paradas da luz com três casas. */
const compacta = (e) => ({
  contorno: e.contorno,
  luz: { de: e.luz.de, ate: e.luz.ate, pretas: e.luz.pretas.map(([s, a]) => [arred(s), arred(a)]), brancas: e.luz.brancas.map(([s, a]) => [arred(s), arred(a)]) },
  veu: e.veu,
  dobra: e.dobra,
  sombra: { contorno: e.sombra.contorno, desvio: arred(e.sombra.desvio, 1) },
});

const navegador = await chromium.launch(opcoesDoChrome);
try {
  iniciarBase(await medir(navegador, endereco));
  mkdirSync(PASTA, { recursive: true });
  for (const nome of readdirSync(PASTA)) if (nome.endsWith(".webp")) rmSync(join(PASTA, nome));
  const pagina = await navegador.newPage({ deviceScaleFactor: 2 });
  const dados = { deitado: {}, aberto: {} };
  let total = 0;

  const livros = [
    ...LIVROS.map((l) => ({
      id: l.slug,
      artigos: l.artigos,
      cena: { capa: capa(l.slug), lombada: lombada(l.slug), espessura: l.largura, cor: l.cor, papel: l.papel },
      aberto: l.artigos === 0 ? { cor: l.cor, papel: l.papel } : null,
    })),
    {
      // A série (D57): a capa de hoje numa capa dura toda em papel, com a lombada própria (a faixa laranja).
      id: REVISTA.slug,
      artigos: REVISTA.edicoes,
      cena: {
        capa: capaDaRevista(),
        lombada: lombadaDaRevista(),
        espessura: REVISTA.largura,
        cor: REVISTA.papel,
        papel: REVISTA.papel,
        divisao: Infinity,
        corFita: escurecer(REVISTA.destaque, 0.8, 0.8),
      },
      aberto: null,
    },
  ];

  for (const l of livros) {
    const cena = livroDeitado(l.cena);
    const foto = await fotografar(pagina, cena, LARGURA.deitado, join(PASTA, `${l.id}-deitado.webp`));
    total += foto.bytes;
    dados.deitado[l.id] = {
      artigos: l.artigos,
      largura: foto.largura,
      altura: foto.altura,
      caixa: [cena.largura, cena.altura],
      capa: cena.capa,
      livro: cena.livro,
      etiquetas: cena.etiquetas.map(compacta),
      puxadas: cena.puxadas.map(compacta),
    };
    console.log(`  ${l.id}-deitado.webp (${(foto.bytes / 1024).toFixed(1)} KB)`);
    if (l.aberto) {
      const fotoA = await fotografar(pagina, livroAberto(l.aberto), LARGURA.aberto, join(PASTA, `${l.id}-aberto.webp`));
      total += fotoA.bytes;
      dados.aberto[l.id] = { largura: fotoA.largura, altura: fotoA.altura };
      console.log(`  ${l.id}-aberto.webp (${(fotoA.bytes / 1024).toFixed(1)} KB)`);
    }
  }
  // A busca sem resultado: o livro da marca, na cor do "cs" (o token `marca` de tokens.ts). Desde a D78
  // a marca não é mais, por definição, a cor do Volume 01 (os volumes seguem a ordem alfabética).
  const corDaMarca = /\bmarca: "(#[0-9a-fA-F]{6})"/.exec(readFileSync(join(RAIZ, "src/styles/tokens.ts"), "utf8"))?.[1];
  if (!corDaMarca) throw new Error("src/styles/tokens.ts: não achei o token marca");
  const fotoB = await fotografar(pagina, livroAberto({ cor: corDaMarca, papel: LIVROS[0].papel }), LARGURA.aberto, join(PASTA, "busca-aberto.webp"));
  total += fotoB.bytes;
  dados.aberto.busca = { largura: fotoB.largura, altura: fotoB.altura };
  console.log(`  busca-aberto.webp (${(fotoB.bytes / 1024).toFixed(1)} KB)`);

  writeFileSync(DADOS, JSON.stringify(dados) + "\n");
  console.log(`✓ public/livros/fotos/ (${(total / 1024).toFixed(0)} KB) e src/livros/fotos.json`);
} finally {
  await navegador.close();
}
