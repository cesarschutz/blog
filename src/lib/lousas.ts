/**
 * Desenhos das lousas (briefing §7, D11): src/lousas/<slug>/<nome>.svg, usados pelos componentes
 * Lousa (D58) e, nos posts antigos, LousaTempo e LousaLoop. Aqui o SVG ganha rótulo acessível e o
 * quadro parado (estilos do instante escolhido), que é o que aparece sem JS, com movimento reduzido
 * e no RSS; com JS, src/scripts/lousa.ts assume a partir dele.
 *
 * A lousa no estilo das figuras (D59) tem o grupo <g class="tinta"> em vez de <g class="traco">: usa as
 * classes e os tons das figuras (figura.css) e pode ter logos (data-marca), como elas.
 */
import { ATRIBUTOS, estado, fimDa, numeros, type Marcas } from "./lousa-tempo";
import { comMarcas } from "./figuras";

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

/** A lousa está no estilo das figuras (D59)? */
export const noEstiloDasFiguras = (fonte: string) => /<g\s+class="tinta"/.test(fonte);

/**
 * O SVG da lousa no instante t (por padrão, o fim), com role="img" e o rótulo. No estilo das figuras,
 * a raiz ganha as classes da figura e os marcadores de logo viram o desenho do logo.
 */
export function quadroDaLousa(nome: string, rotulo: string, t?: number): { svg: string; fim: number; figura: boolean } {
  const original = arquivos[`../lousas/${nome}.svg`];
  if (!original) throw new Error(`Não existe a lousa src/lousas/${nome}.svg.`);
  const figura = noEstiloDasFiguras(original);
  const fonte = figura ? comMarcas(original.replace(/<svg\b/, '<svg class="ilustracao diagrama lousa-desenho"')) : original;
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
  return { svg, fim, figura };
}
