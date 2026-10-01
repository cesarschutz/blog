/**
 * Motor das lousas (briefing §7): lê do SVG quando cada parte aparece (src/lib/lousa-tempo.ts) e
 * desenha o instante que o componente pedir (rolagem, controle ou relógio). A caneta fica na ponta
 * do traço ou do texto que está sendo feito, na cor dele. Os recortes da escrita ganham ids únicos
 * aqui, na hora; o arquivo do desenho continua sem id nem <defs>.
 *
 * Na lousa no estilo das figuras (D59, raiz .diagrama), a caneta é uma canetinha colorida: a ponta, o
 * anel e a tampa na cor do que está sendo desenhado (o traço, o texto ou o tom que está sendo pintado).
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

// A canetinha (D59): ponta de feltro, cone de plástico, corpo fino e tampa no fundo, no traço das
// figuras (contorno de tinta). Feita para um desenho de 1100 de largura; o script ajusta a escala.
const CANETINHA = `<g class="caneta-desenho canetinha" aria-hidden="true"><g transform="rotate(-52)">
  <path class="ponta" d="M0 0 C 1.5 -2.6 5 -3.6 8 -3.4 L8 3.4 C 5 3.6 1.5 2.6 0 0 Z"/>
  <path class="cone" d="M8 -3.6 L20 -7.2 L20 7.2 L8 3.6 Z"/>
  <rect class="anel" x="20" y="-7.6" width="6" height="15.2" rx="1.2"/>
  <rect class="corpo" x="26" y="-7.6" width="62" height="15.2" rx="2.4"/>
  <path class="brilho" d="M31 -3.4 H70"/>
  <rect class="tampa" x="84" y="-8.6" width="26" height="17.2" rx="4"/>
</g></g>`;
const LARGURA_DA_CANETINHA = 1100;

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

/** A cor da canetinha para uma parte: o traço que ela faz, o texto que escreve ou o tom que pinta. */
function corDaParte(p: Parte): string {
  const estilo = getComputedStyle(p.el);
  const tom = estilo.getPropertyValue("--tom").trim();
  if (p.tipo === "traco") return estilo.stroke !== "none" ? estilo.stroke : tom || estilo.fill;
  if (p.tipo === "escrita") return estilo.fill;
  if (tom) return tom;
  const primeiro = p.el.matches("g") ? p.el.querySelector<SVGGraphicsElement>("path, rect, circle, ellipse, line, polyline, polygon, text") : p.el;
  const doPrimeiro = primeiro ? getComputedStyle(primeiro) : estilo;
  return doPrimeiro.stroke !== "none" ? doPrimeiro.stroke : doPrimeiro.fill;
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
  // Até três canetas: quando duas partes são feitas ao mesmo tempo, cada uma tem a sua (uma caneta só
  // não escreve em dois lugares, pedido do Cesar).
  const comoFigura = svg.classList.contains("diagrama");
  const escala = comoFigura ? (svg.viewBox.baseVal?.width || LARGURA_DA_CANETINHA) / LARGURA_DA_CANETINHA : 1;
  const canetas = [0, 1, 2].map(() => {
    svg.insertAdjacentHTML("beforeend", comoFigura ? CANETINHA : CANETA);
    const g = svg.lastElementChild as SVGGElement;
    return { g, mao: g.firstElementChild as SVGGElement, parte: null as Parte | null };
  });

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
    const ativas: { parte: Parte; inicio: number; x: number; y: number; destaque: boolean; giro: number }[] = [];
    for (const p of partes) {
      const e = estado(p.marcas, t);
      const s = p.el.style;
      s.opacity = e.opacidade < 1 ? String(e.opacidade) : "";
      s.transform = e.dx || e.dy ? `translate(${e.dx}px, ${e.dy}px)` : "";
      if (!p.tipo) continue;
      s.visibility = e.desenho > 0 ? "" : "hidden";
      let ponto: [number, number] | undefined;
      let giro = 0;
      if (p.tipo === "traco") {
        s.strokeDashoffset = String(1 - e.desenho);
        if (e.desenho > 0 && e.desenho < 1) {
          const q = (p.el as SVGGeometryElement).getPointAtLength(e.desenho * p.comprimento);
          ponto = [q.x, q.y];
          // A mão acompanha o traço com um balanço leve, como quem desenha.
          giro = Math.sin(e.desenho * p.comprimento * 0.045) * 4;
        }
      } else if (p.caixa && p.recorte) {
        const c = p.caixa;
        const largura = (c.width + 4) * e.desenho;
        p.recorte.setAttribute("width", String(largura));
        p.recorte.setAttribute("x", String(p.daDireita ? c.x + c.width + 2 - largura : c.x - 2));
        if (e.desenho > 0 && e.desenho < 1) {
          const x = p.daDireita ? c.x + c.width * (1 - e.desenho) : c.x + c.width * e.desenho;
          if (p.tipo === "escrita") {
            // Escrevendo, a ponta sobe e desce a cada letra (uma letra ~ 0,55 da altura) e a mão gira um pouco.
            const letras = Math.max(1, c.width / (c.height * 0.55));
            const fase = e.desenho * letras * Math.PI * 2;
            ponto = [x + Math.cos(fase) * c.height * 0.08, c.y + c.height * (0.55 + Math.sin(fase) * 0.22)];
            giro = Math.sin(fase) * 6;
          } else {
            // Revelando (um tracejado, uma faixa de linhas): a caneta corre na frente, no meio, com um balanço leve.
            ponto = [x, c.y + c.height * 0.5];
            giro = Math.sin(e.desenho * c.width * 0.05) * 3;
          }
        }
      }
      if (ponto && e.opacidade > 0) ativas.push({ parte: p, inicio: p.inicio, ...naRaiz(p.el, ...ponto), destaque: p.destaque, giro });
    }
    ativas.sort((a, b) => b.inicio - a.inicio);
    canetas.forEach((caneta, i) => {
      const ativa = comCaneta ? ativas[i] : undefined;
      if (!ativa) {
        caneta.parte = null;
        return caneta.g.classList.remove("ativa");
      }
      caneta.g.setAttribute("transform", `translate(${ativa.x.toFixed(1)} ${ativa.y.toFixed(1)})`);
      caneta.mao.setAttribute("transform", `rotate(${(-52 + ativa.giro).toFixed(1)})${escala !== 1 ? ` scale(${escala.toFixed(3)})` : ""}`);
      if (!comoFigura) caneta.g.style.setProperty("--tinta-da-caneta", ativa.destaque ? "var(--destaque)" : "var(--caneta)");
      else if (caneta.parte !== ativa.parte) caneta.g.style.setProperty("--tinta-da-caneta", corDaParte(ativa.parte));
      caneta.parte = ativa.parte;
      caneta.g.classList.add("ativa");
    });
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
