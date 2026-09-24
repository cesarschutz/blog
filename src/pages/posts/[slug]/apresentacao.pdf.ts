/**
 * PDF da apresentação (briefing §8.3), gerado no build a partir dos slides em WebP de
 * public/posts/<slug>/deck/: cada slide vira uma página, em JPEG (sharp). O link "Baixar PDF" sai
 * de src/plugins/rehype-apresentacao.mjs.
 */
import type { APIContext } from "astro";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import decks from "../../../data/decks.json";
import { getPosts } from "../../../lib/posts";
import { pdfDeImagens } from "../../../lib/pdf";

type Deck = (typeof decks)[keyof typeof decks];

export async function getStaticPaths() {
  const posts = new Map((await getPosts()).map((p) => [p.id, p]));
  return Object.entries(decks as Record<string, Deck>)
    .filter(([slug]) => posts.has(slug))
    .map(([slug, deck]) => ({ params: { slug }, props: { deck } }));
}

export async function GET({ params, props }: APIContext<{ deck: Deck }>) {
  const { deck } = props;
  const paginas = await Promise.all(
    Array.from({ length: deck.slides }, async (_, i) => {
      const arquivo = join(process.cwd(), "public", "posts", params.slug!, "deck", `${String(i + 1).padStart(2, "0")}.webp`);
      const { data, info } = await sharp(await readFile(arquivo))
        .flatten({ background: "#ffffff" })
        .jpeg({ quality: 85 })
        .toBuffer({ resolveWithObject: true });
      return { jpeg: new Uint8Array(data), largura: info.width, altura: info.height };
    }),
  );
  return new Response(pdfDeImagens(paginas, deck.titulo), { headers: { "Content-Type": "application/pdf" } });
}
