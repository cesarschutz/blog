/**
 * As frases do post-it (D33) para o botão "outra frase": [texto, autor, contexto, url], na ordem de
 * src/data/frases.json. Estático, gerado no build; o navegador guarda em cache entre as páginas.
 */
import type { APIRoute } from "astro";
import { FRASES } from "../lib/frases";

export const GET: APIRoute = () =>
  new Response(JSON.stringify(FRASES.map((f) => [f.texto, f.autor, f.contexto, f.url])), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
