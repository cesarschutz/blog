/**
 * O desenho se desenha (D41, ideia 3), com GSAP e DrawSVG sob demanda.
 *
 * - No destaque da home e no topo do post (`[data-desenhar]`): quando o desenho entra na tela, os
 *   traços aparecem uma vez, em sequência; depois vêm a cor, a hachura e os textos. Os tracejados
 *   (`.fantasma`) aparecem por opacidade, sem DrawSVG, para não perderem o tracejado. Até o script
 *   chegar, o CSS esconde o desenho (só com JS, na tela e sem movimento reduzido); se o GSAP não vier
 *   em 2,5s, o desenho aparece inteiro. Quem chega ao post pela transição do cartão já traz o desenho
 *   pronto (`data-chegada`, posto no <head> pelo `pagereveal`).
 * - Nos cartões das listas: ao passar o mouse (ou focar), o traço se refaz rápido (0,5s), no máximo
 *   uma vez por cartão por visita.
 */
import { adiantar, carregarTraco, movimentoReduzido, temMouse, type GSAP } from "./gsap";

const FORMAS = ":is(path, rect, circle, ellipse, line, polyline, polygon)";

function partes(svg: SVGSVGElement) {
  return {
    // O contorno: tudo o que é traço, menos cor, hachura e tracejado; as chamadas das anotações também.
    tracos: [...svg.querySelectorAll<SVGElement>(`.tinta ${FORMAS}:not(.cor, .hachura, .fantasma), .anotacao ${FORMAS}`)],
    tintas: [...svg.querySelectorAll<SVGElement>(".tinta :is(.cor, .hachura, .papel)")],
    textos: [...svg.querySelectorAll<SVGElement>("text, .tinta .fantasma")],
  };
}

function desenhar(gsap: GSAP, svg: SVGSVGElement, rapido = false) {
  const { tracos, tintas, textos } = partes(svg);
  gsap.killTweensOf([...tracos, ...tintas, ...textos]);
  // Muitos traços não passam de ~1,2s de sequência (0,6s no rápido).
  const passo = Math.min(rapido ? 0.03 : 0.09, (rapido ? 0.6 : 1.2) / Math.max(tracos.length, 1));
  const fim = () => gsap.set(tracos, { clearProps: "strokeDasharray,strokeDashoffset" });
  // O estado de partida vai direto, antes da primeira pintura da área.
  gsap.set(tintas, { fillOpacity: 0 });
  gsap.set(textos, { opacity: 0 });
  gsap.set(tracos, { drawSVG: "0%" });
  return gsap
    .timeline({ onComplete: fim })
    .to(tracos, { drawSVG: "100%", duration: rapido ? 0.5 : 1.1, stagger: passo, ease: "power1.inOut" })
    .to(tintas, { fillOpacity: 1, duration: rapido ? 0.3 : 0.6, stagger: 0.03, clearProps: "fillOpacity" }, rapido ? "-=0.25" : "-=0.4")
    .to(textos, { opacity: 1, duration: 0.4, stagger: 0.06, clearProps: "opacity" }, "<");
}

const mostrar = (area: HTMLElement) => area.setAttribute("data-desenhado", "");

/** O desenho de `[data-desenhar]` se desenha quando entra na tela, uma vez. */
export function desenharAoEntrar() {
  const areas = [...document.querySelectorAll<HTMLElement>("[data-desenhar]")];
  if (!areas.length) return;
  const direto = movimentoReduzido.matches || document.documentElement.dataset.chegada === "transicao";
  if (direto) return areas.forEach(mostrar);
  // Se o GSAP demorar, o desenho aparece inteiro.
  const reserva = window.setTimeout(() => areas.forEach(mostrar), 2500);
  const gsap = carregarTraco();
  gsap.then(() => clearTimeout(reserva), () => areas.forEach(mostrar));
  const olhar = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (!e.isIntersecting) continue;
        olhar.unobserve(e.target);
        const area = e.target as HTMLElement;
        gsap.then((g) => {
          // O topo do post tem dois recortes (largo e médio): desenha o que está à vista.
          const svg = [...area.querySelectorAll<SVGSVGElement>("svg.ilustracao")].find((s) => s.getBoundingClientRect().width > 0);
          if (area.hasAttribute("data-desenhado") || !svg) return mostrar(area);
          // Esconde as partes antes de mostrar a área, na mesma tarefa: nada pisca inteiro.
          desenhar(g, svg);
          mostrar(area);
        });
      }
    },
    { threshold: 0.3 },
  );
  areas.forEach((a) => olhar.observe(a));
}

/** Nos cartões das listas: o traço se refaz ao passar o mouse ou focar, uma vez por cartão. */
let ligado = false;
export function redesenharNoHover() {
  // A lista e os cards chamam os dois: liga uma vez só.
  if (ligado || movimentoReduzido.matches) return;
  ligado = true;
  const feitos = new WeakSet<Element>();
  const refazer = (e: Event) => {
    const item = (e.target as Element).closest?.(".lista-modo > li, .cartoes-modo > li");
    const painel = item?.querySelector<HTMLElement>(".miniatura, .ilustracao-cartao");
    if (!item || !painel || feitos.has(item)) return;
    if (e.type === "focusin" && !item.querySelector(":focus-visible")) return;
    feitos.add(item);
    const svg = painel.querySelector<SVGSVGElement>("svg.ilustracao");
    if (svg) carregarTraco().then((g) => desenhar(g, svg, true));
  };
  document.addEventListener("pointerover", (e) => (e as PointerEvent).pointerType === "mouse" && refazer(e));
  document.addEventListener("focusin", refazer);
  const lista = document.querySelector(".lista-modo, .cartoes-modo");
  if (lista && temMouse.matches) adiantar(lista, carregarTraco);
}
