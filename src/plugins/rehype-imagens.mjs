/** Reserva a proporção dos SVGs de public usados no corpo dos artigos, antes de carregar a imagem. */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
const raiz = resolve("public");
const dimensoes = new Map();
function tamanho(src) {
  if (dimensoes.has(src)) return dimensoes.get(src);
  let medida;
  try {
    const arquivo = resolve(raiz, "." + decodeURIComponent(src));
    if (!arquivo.startsWith(raiz + "/")) return;
    const svg = readFileSync(arquivo, "utf8").match(/<svg\b[^>]*>/i)?.[0];
    const box = svg
      ?.match(/\bviewBox\s*=\s*["']([^"']+)["']/i)?.[1]
      .trim()
      .split(/[\s,]+/)
      .map(Number);
    if (
      box?.length === 4 &&
      box.every(Number.isFinite) &&
      box[2] > 0 &&
      box[3] > 0
    )
      medida = { width: box[2], height: box[3] };
  } catch {
    /* Sem medida confiável, mantém a marcação do autor. */
  }
  dimensoes.set(src, medida);
  return medida;
}
export function rehypeImagens() {
  const visitar = (no) => {
    if (no.type === "element" && no.tagName === "img") {
      const p = (no.properties ??= {});
      if (
        typeof p.src === "string" &&
        p.src.startsWith("/") &&
        /\.svg$/i.test(p.src) &&
        !p.width &&
        !p.height
      ) {
        const medida = tamanho(p.src);
        if (medida)
          Object.assign(p, medida, {
            loading: p.loading ?? "lazy",
            decoding: p.decoding ?? "async",
          });
      }
    }
    no.children?.forEach(visitar);
  };
  return visitar;
}
