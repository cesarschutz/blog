/** robots.txt: tudo liberado e o endereço do sitemap. Na pré-visualização (D13), nada é indexado. */
import type { APIContext } from "astro";
import { url } from "../lib/url";

export function GET(contexto: APIContext) {
  const sitemap = new URL(url("/sitemap-index.xml"), contexto.site).href;
  const regra = process.env.PREVIEW === "true" ? "Disallow: /" : "Allow: /";
  return new Response(`User-agent: *\n${regra}\nSitemap: ${sitemap}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
