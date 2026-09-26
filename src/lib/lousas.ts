/**
 * Desenhos das lousas (briefing §7, D11): src/lousas/<slug>/<nome>.svg, usados pelos componentes
 * LousaTempo e LousaLoop dentro de posts .mdx (a lousa de passos saiu na D46). Aqui o SVG ganha rótulo acessível e o
 * quadro parado (estilos do instante escolhido), que é o que aparece sem JS, com movimento reduzido
 * e no RSS; com JS, src/scripts/lousa.ts assume a partir dele.
 */
import { ATRIBUTOS, estado, fimDa, numeros, type Marcas } from "./lousa-tempo";

const arquivos = import.meta.glob<string>("../lousas/**/*.svg", { query: "?raw", import: "default", eager: true });

const COM_TEMPO = new RegExp(`\\sdata-(${ATRIBUTOS.join("|")})="`);

function marcasDe(atributos: string): Marcas {
  const marcas: Marcas = {};
  for (const a of ATRIBUTOS) {
    const valor = atributos.match(new RegExp(`\\sdata-${a}="([^"]*)"`))?.[1];
    if (valor) marcas[a] = numeros(valor);
  }
  return marcas;
}

/** O SVG da lousa no instante t (por padrão, o fim), com role="img" e o rótulo. */
export function quadroDaLousa(nome: string, rotulo: string, t?: number): { svg: string; fim: number } {
  const fonte = arquivos[`../lousas/${nome}.svg`];
  if (!fonte) throw new Error(`Não existe a lousa src/lousas/${nome}.svg.`);
  const todas = [...fonte.matchAll(/<\w+\b([^>]*)>/g)].filter(([, a]) => COM_TEMPO.test(a)).map(([, a]) => marcasDe(a));
  const fim = fimDa(todas);
  const instante = t ?? fim;
  const escapar = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  const svg = fonte
    .replace(/<svg\b/, `<svg role="img" aria-label="${escapar(rotulo)}" focusable="false"`)
    .replace(/<(\w+)\b([^>]*?)(\/?)>/g, (tag, nomeDaTag: string, atributos: string, fecha: string) => {
      if (!COM_TEMPO.test(atributos)) return tag;
      const marcas = marcasDe(atributos);
      const e = estado(marcas, instante);
      const estilos = [];
      if ((marcas.traco || marcas.escrita || marcas.revela) && e.desenho <= 0) estilos.push("visibility:hidden");
      if (e.opacidade < 1) estilos.push(`opacity:${Number(e.opacidade.toFixed(3))}`);
      if (e.dx || e.dy) estilos.push(`transform:translate(${e.dx}px,${e.dy}px)`);
      return estilos.length ? `<${nomeDaTag}${atributos} style="${estilos.join(";")}"${fecha}>` : tag;
    });
  return { svg, fim };
}
