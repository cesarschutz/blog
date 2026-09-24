/**
 * Motor das lousas (briefing §7): lê do SVG quando cada parte aparece (src/lib/lousa-tempo.ts) e
 * desenha o instante que o componente pedir (rolagem, controle ou relógio). A caneta fica na ponta
 * do traço ou do texto que está sendo feito, na cor dele. Os recortes da escrita ganham ids únicos
 * aqui, na hora; o arquivo do desenho continua sem id nem <defs>.
 */
import { ATRIBUTOS, estado, fimDa, numeros, type Marcas } from "../lib/lousa-tempo";

const SVG = "http://www.w3.org/2000/svg";
const CANETA = `<g class="caneta-desenho" aria-hidden="true"><g transform="rotate(-52)">
  <path class="ponta" d="M0 0 L9 -3.4 L9 3.4 Z"/>
  <rect class="metal" x="9" y="-5" width="7" height="10" rx="1"/>
  <rect class="corpo" x="16" y="-7" width="52" height="14" rx="3"/>
  <rect class="tampa" x="46" y="-7.8" width="26" height="15.6" rx="3.5"/>
  <rect class="brilho" x="21" y="-3" width="18" height="6" rx="1"/>
</g></g>`;

interface Parte {
  el: SVGGraphicsElement;
  marcas: Marcas;
  tipo?: "traco" | "escrita" | "revela";
  inicio: number;
  comprimento: number;
  caixa?: DOMRect;
  recorte?: SVGRectElement;
  daDireita: boolean;
  destaque: boolean;
}

export interface Lousa {
  /** Último instante da linha do tempo. */
  fim: number;
  desenhar(t: number, comCaneta?: boolean): void;
}

let contador = 0;

export function prepararLousa(svg: SVGSVGElement): Lousa {
  const prefixo = `lousa-${++contador}`;
  const defs = document.createElementNS(SVG, "defs");
  svg.prepend(defs);
  const seletor = ATRIBUTOS.map((a) => `[data-${a}]`).join(",");
  const partes: Parte[] = [...svg.querySelectorAll<SVGGraphicsElement>(seletor)].map((el, i) => {
    const marcas: Marcas = {};
    for (const a of ATRIBUTOS) if (el.dataset[a]) marcas[a] = numeros(el.dataset[a]!);
    const tipo = marcas.traco ? "traco" : marcas.escrita ? "escrita" : marcas.revela ? "revela" : undefined;
    const parte: Parte = {
      el,
      marcas,
      tipo,
      inicio: (marcas.traco ?? marcas.escrita ?? marcas.revela ?? [0])[0],
      comprimento: 0,
      daDireita: el.dataset.de === "direita",
      destaque: Boolean(el.closest(".destaque")),
    };
    // O quadro parado veio do servidor; daqui em diante, quem manda é o script.
    for (const p of ["visibility", "opacity", "transform"]) el.style.removeProperty(p);
    if (tipo === "traco") {
      el.setAttribute("pathLength", "1");
      el.style.strokeDasharray = "1";
      parte.comprimento = (el as SVGGeometryElement).getTotalLength();
    } else if (tipo) {
      const recorte = document.createElementNS(SVG, "clipPath");
      recorte.id = `${prefixo}-${i}`;
      parte.recorte = document.createElementNS(SVG, "rect");
      recorte.append(parte.recorte);
      defs.append(recorte);
      el.setAttribute("clip-path", `url(#${recorte.id})`);
    }
    return parte;
  });
  svg.insertAdjacentHTML("beforeend", CANETA);
  const caneta = svg.lastElementChild as SVGGElement;

  // A caixa dos textos depende da fonte: mede de novo quando ela chega.
  const medir = () => {
    for (const p of partes) {
      if (!p.recorte) continue;
      p.caixa = p.el.getBBox();
      p.recorte.setAttribute("y", String(p.caixa.y - 4));
      p.recorte.setAttribute("height", String(p.caixa.height + 8));
    }
  };

  const naRaiz = (el: SVGGraphicsElement, x: number, y: number) => {
    const doElemento = el.getScreenCTM();
    const daRaiz = svg.getScreenCTM();
    if (!doElemento || !daRaiz) return { x, y };
    const ponto = new DOMPoint(x, y).matrixTransform(daRaiz.inverse().multiply(doElemento));
    return { x: ponto.x, y: ponto.y };
  };

  let ultimo = 0;
  let caneteando = true;
  function desenhar(t: number, comCaneta = true) {
    ultimo = t;
    caneteando = comCaneta;
    let ativa: { inicio: number; x: number; y: number; destaque: boolean } | undefined;
    for (const p of partes) {
      const e = estado(p.marcas, t);
      const s = p.el.style;
      s.opacity = e.opacidade < 1 ? String(e.opacidade) : "";
      s.transform = e.dx || e.dy ? `translate(${e.dx}px, ${e.dy}px)` : "";
      if (!p.tipo) continue;
      s.visibility = e.desenho > 0 ? "" : "hidden";
      let ponto: [number, number] | undefined;
      if (p.tipo === "traco") {
        s.strokeDashoffset = String(1 - e.desenho);
        if (e.desenho > 0 && e.desenho < 1) {
          const q = (p.el as SVGGeometryElement).getPointAtLength(e.desenho * p.comprimento);
          ponto = [q.x, q.y];
        }
      } else if (p.caixa && p.recorte) {
        const c = p.caixa;
        const largura = (c.width + 4) * e.desenho;
        p.recorte.setAttribute("width", String(largura));
        p.recorte.setAttribute("x", String(p.daDireita ? c.x + c.width + 2 - largura : c.x - 2));
        if (e.desenho > 0 && e.desenho < 1) {
          ponto = [p.daDireita ? c.x + c.width * (1 - e.desenho) : c.x + c.width * e.desenho, c.y + c.height * 0.8];
        }
      }
      if (ponto && e.opacidade > 0 && (!ativa || p.inicio >= ativa.inicio)) {
        ativa = { inicio: p.inicio, ...naRaiz(p.el, ...ponto), destaque: p.destaque };
      }
    }
    if (ativa && comCaneta) {
      caneta.setAttribute("transform", `translate(${ativa.x.toFixed(1)} ${ativa.y.toFixed(1)})`);
      caneta.style.setProperty("--tinta-da-caneta", ativa.destaque ? "var(--destaque)" : "var(--caneta)");
      caneta.classList.add("ativa");
    } else {
      caneta.classList.remove("ativa");
    }
  }

  medir();
  document.fonts?.ready.then(() => {
    medir();
    desenhar(ultimo, caneteando);
  });
  return { fim: fimDa(partes.map((p) => p.marcas)), desenhar };
}

/** Chama `aoMudar` quando a lousa entra ou sai da tela (para não trabalhar fora dela). */
export function quandoVisivel(el: Element, aoMudar: (visivel: boolean) => void) {
  new IntersectionObserver((entradas) => aoMudar(entradas[0].isIntersecting), { rootMargin: "200px 0px" }).observe(el);
}
