#!/usr/bin/env node
/**
 * Fotos das sugestões de coleção, para o artifact (gerar-artifact.mjs): com o dev no ar, abre
 * /amostra/colecoes/ e grava em .render/colecoes/:
 * - estante-<id>.webp: a estante de cada sugestão (as lombadas, o aparador e a revista);
 * - capa-<id>-<slug>.webp: a capa plana de cada livro de cada sugestão (com o volume dela).
 *
 *   node docs/prototipos/colecoes/capturar.mjs [id…]      (ENDERECO=http://127.0.0.1:4322 por padrão;
 *                                                          sem id, todas as sugestões)
 *   CHROME_PATH=… troca o navegador.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import sharp from "sharp";

const aqui = dirname(fileURLToPath(import.meta.url));
const raiz = join(aqui, "..", "..", "..");
const saida = join(raiz, ".render", "colecoes");
mkdirSync(saida, { recursive: true });
const base = process.env.ENDERECO ?? "http://127.0.0.1:4322";
const dados = JSON.parse(readFileSync(join(aqui, "colecoes.json"), "utf8"));

const caminhos = [process.env.CHROME_PATH, "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"].filter((c) => c && existsSync(c));
const navegador = await chromium.launch(caminhos.length ? { executablePath: caminhos[0] } : { channel: "chrome" });
const contexto = await navegador.newContext({ viewport: { width: 1240, height: 1000 }, deviceScaleFactor: 3, reducedMotion: "reduce" });
const pagina = await contexto.newPage();

// O tamanho de cada peça na página (em px de CSS), para o artifact mostrar as estantes na mesma escala:
// a de 12 livros fica mais larga que a de 8, como na home.
const arquivoMedidas = join(saida, "medidas.json");
const medidas = existsSync(arquivoMedidas) ? JSON.parse(readFileSync(arquivoMedidas, "utf8")) : {};
const ids = process.argv.slice(2);

async function gravar(local, arquivo, largura, transparente = false) {
  const caixa = await local.boundingBox();
  medidas[arquivo] = { largura: Math.round(caixa.width), altura: Math.round(caixa.height) };
  const png = await local.screenshot({ animations: "disabled", omitBackground: transparente });
  await sharp(png).resize({ width: largura, withoutEnlargement: true }).webp({ quality: 88, alphaQuality: 90 }).toFile(join(saida, arquivo));
  console.log(arquivo);
}

for (const s of dados.sugestoes.filter((x) => !ids.length || ids.includes(x.id))) {
  await pagina.goto(`${base}/amostra/colecoes/${s.id}/`, { waitUntil: "networkidle" });
  await pagina.evaluate(() => document.fonts.ready);
  // A estante sai com o fundo transparente (a folha e a página somem só na foto), para servir nos
  // dois temas do artifact; as sombras ficam translúcidas.
  await pagina.addStyleTag({ content: "html, body, .folha, .sugestao { background: transparent !important; box-shadow: none !important; }" });
  await pagina.waitForTimeout(400);
  await gravar(pagina.locator(".estante").first(), `estante-${s.id}.webp`, 2400, true);
  const capas = pagina.locator(".livros > li .capa-pequena");
  // A coleção final aparece com as capas maiores no artifact.
  for (let i = 0; i < s.livros.length; i++) await gravar(capas.nth(i), `capa-${s.id}-${s.livros[i]}.webp`, s.id === "final" ? 540 : 480);
}
writeFileSync(arquivoMedidas, JSON.stringify(medidas, null, 1));

await navegador.close();
