/**
 * O desenho se desenha (D41), só no destaque da home, com GSAP e DrawSVG sob demanda: quando o
 * desenho entra na tela, os traços aparecem uma vez, em sequência; depois vêm a cor, a hachura e os
 * textos. Os tracejados (`.fantasma`) aparecem por opacidade, sem DrawSVG, para não perderem o
 * tracejado. Até o script chegar, o CSS esconde o desenho (só com JS, na tela e sem movimento
 * reduzido, desenho.css); se o GSAP não vier em 2,5s, o desenho aparece inteiro.
 */
import { carregarTraco, movimentoReduzido, type GSAP } from "./gsap";

const FORMAS = ":is(path, rect, circle, ellipse, line, polyline, polygon)";

function desenhar(gsap: GSAP, svg: SVGSVGElement) {
  // O contorno: tudo o que é traço, menos cor, hachura e tracejado.
  const tracos = [...svg.querySelectorAll<SVGElement>(`.tinta ${FORMAS}:not(.cor, .hachura, .fantasma)`)];
  const tintas = [...svg.querySelectorAll<SVGElement>(".tinta :is(.cor, .hachura, .papel)")];
  const textos = [...svg.querySelectorAll<SVGElement>("text, .tinta .fantasma")];
  // Muitos traços não passam de ~1,2s de sequência.
  const passo = Math.min(0.09, 1.2 / Math.max(tracos.length, 1));
  // O estado de partida vai direto, antes da primeira pintura da área.
  gsap.set(tintas, { fillOpacity: 0 });
  gsap.set(textos, { opacity: 0 });
  gsap.set(tracos, { drawSVG: "0%" });
  gsap
    .timeline({ onComplete: () => gsap.set(tracos, { clearProps: "strokeDasharray,strokeDashoffset" }) })
    .to(tracos, { drawSVG: "100%", duration: 1.1, stagger: passo, ease: "power1.inOut" })
    .to(tintas, { fillOpacity: 1, duration: 0.6, stagger: 0.03, clearProps: "fillOpacity" }, "-=0.4")
    .to(textos, { opacity: 1, duration: 0.4, stagger: 0.06, clearProps: "opacity" }, "<");
}

const mostrar = (area: Element) => area.setAttribute("data-desenhado", "");

/** O desenho de `[data-desenhar]` se desenha quando entra na tela, uma vez. */
export function desenharAoEntrar() {
  const areas = [...document.querySelectorAll("[data-desenhar]")];
  if (!areas.length) return;
  if (movimentoReduzido.matches) return areas.forEach(mostrar);
  const reserva = window.setTimeout(() => areas.forEach(mostrar), 2500);
  const gsap = carregarTraco();
  gsap.then(() => clearTimeout(reserva), () => areas.forEach(mostrar));
  const olhar = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (!e.isIntersecting) continue;
        olhar.unobserve(e.target);
        const area = e.target;
        gsap.then((g) => {
          const svg = area.querySelector<SVGSVGElement>("svg.ilustracao");
          if (!area.hasAttribute("data-desenhado") && svg) desenhar(g, svg);
          mostrar(area);
        });
      }
    },
    { threshold: 0.3 },
  );
  areas.forEach((a) => olhar.observe(a));
}
