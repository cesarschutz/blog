#!/usr/bin/env node
/**
 * Converte a apresentação do NotebookLM (.pptx) nos slides que o site publica: WebP em
 * public/posts/<slug>/deck/ e a entrada em src/data/decks.json. O PDF do "Baixar PDF" sai no build,
 * das mesmas imagens (src/pages/posts/[slug]/apresentacao.pdf.ts). Porte do deck-to-web.mjs do blog
 * atual, sem o infográfico (D12).
 *
 *   npm run apresentacao -- <slug> --pptx <arquivo.pptx> --titulo "…"
 *
 * Os slides do NotebookLM são imagens inteiras (não há texto no arquivo): viram imagem, e o artigo
 * continua valendo por si só. Confira o texto de cada slide antes (skill apresentacao).
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";

const args = process.argv.slice(2);
const slug = args[0];
const opcao = (nome) => {
  const i = args.indexOf(`--${nome}`);
  return i > 0 ? args[i + 1] : undefined;
};
if (!slug || !opcao("pptx") || !opcao("titulo")) {
  console.error('uso: npm run apresentacao -- <slug> --pptx <arquivo.pptx> --titulo "…"');
  process.exit(1);
}
if (!existsSync(`src/content/posts/${slug}.md`) && !existsSync(`src/content/posts/${slug}.mdx`)) {
  console.error(`Não existe post com o slug "${slug}" em src/content/posts/.`);
  process.exit(1);
}

// Largura nativa das imagens do NotebookLM: ampliar não acrescenta nada.
const LARGURA = 1376;
const pasta = `public/posts/${slug}/deck`;

/** Imagens na ordem dos slides: cada slide aponta para a sua imagem pelo arquivo de relações. */
function imagensDosSlides(pptx, temporaria) {
  execFileSync("unzip", ["-qq", "-o", pptx, "-d", temporaria]);
  const ordem = readFileSync(join(temporaria, "ppt/presentation.xml"), "utf8");
  const relacoes = readFileSync(join(temporaria, "ppt/_rels/presentation.xml.rels"), "utf8");
  return [...ordem.matchAll(/<p:sldId[^>]*r:id="([^"]+)"/g)].map(([, id]) => {
    const alvo = relacoes.match(new RegExp(`Id="${id}"[^>]*Target="([^"]+)"`))[1];
    const nome = alvo.split("/").pop();
    const doSlide = readFileSync(join(temporaria, `ppt/slides/_rels/${nome}.rels`), "utf8");
    const imagem = doSlide.match(/Target="\.\.\/media\/([^"]+)"/);
    if (!imagem) throw new Error(`Slide sem imagem: ${nome}`);
    return join(temporaria, "ppt/media", imagem[1]);
  });
}

const temporaria = mkdtempSync(join(tmpdir(), `apresentacao-${slug}-`));
try {
  const imagens = imagensDosSlides(opcao("pptx"), temporaria);
  rmSync(pasta, { recursive: true, force: true });
  mkdirSync(pasta, { recursive: true });
  let bytes = 0;
  let medidas;
  for (const [i, origem] of imagens.entries()) {
    const destino = `${pasta}/${String(i + 1).padStart(2, "0")}.webp`;
    const info = await sharp(origem).resize({ width: LARGURA, withoutEnlargement: true }).webp({ quality: 82 }).toFile(destino);
    medidas ??= { largura: info.width, altura: info.height };
    bytes += info.size;
  }
  const manifesto = existsSync("src/data/decks.json") ? JSON.parse(readFileSync("src/data/decks.json", "utf8")) : {};
  manifesto[slug] = { titulo: opcao("titulo"), slides: imagens.length, ...medidas };
  writeFileSync("src/data/decks.json", `${JSON.stringify(manifesto, null, 2)}\n`);
  console.log(`${slug}: ${imagens.length} slides, ${(bytes / 1048576).toFixed(1)} MB em ${pasta}/`);
} finally {
  rmSync(temporaria, { recursive: true, force: true });
}
