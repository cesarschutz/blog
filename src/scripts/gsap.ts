/**
 * GSAP sob demanda (D35, D40): nenhuma página leva o GSAP no pacote inicial. Cada componente que anima
 * chama `carregarGsap()` (ou `carregarArrastar()`, que traz também Draggable e InertiaPlugin) quando
 * precisa, e `adiantar()` começa o download um pouco antes: ao passar o mouse, tocar ou receber o foco
 * no elemento, ou quando a página fica ociosa. O navegador guarda o arquivo, e as chamadas seguintes
 * reaproveitam a mesma promessa.
 */
import type { gsap as Gsap } from "gsap";

export type GSAP = typeof Gsap;

let nucleo: Promise<GSAP> | undefined;
let arrastar: Promise<{ gsap: GSAP; Draggable: typeof import("gsap/Draggable").Draggable }> | undefined;

export function carregarGsap(): Promise<GSAP> {
  nucleo ??= import("gsap").then((m) => m.gsap);
  return nucleo;
}

/** O GSAP com Draggable e InertiaPlugin (o livro ampliado, que gira com embalo). */
export function carregarArrastar() {
  arrastar ??= Promise.all([carregarGsap(), import("gsap/Draggable"), import("gsap/InertiaPlugin")]).then(
    ([gsap, { Draggable }, { InertiaPlugin }]) => {
      gsap.registerPlugin(Draggable, InertiaPlugin);
      return { gsap, Draggable };
    },
  );
  return arrastar;
}

/** O GSAP com Flip (a busca que nasce do campo, D44). */
let flip: Promise<{ gsap: GSAP; Flip: typeof import("gsap/Flip").Flip }> | undefined;
export function carregarFlip() {
  flip ??= Promise.all([carregarGsap(), import("gsap/Flip")]).then(([gsap, { Flip }]) => {
    gsap.registerPlugin(Flip);
    return { gsap, Flip };
  });
  return flip;
}

/** O GSAP com DrawSVG (o desenho do destaque que se desenha, D41). */
let traco: Promise<GSAP> | undefined;
export function carregarTraco() {
  traco ??= Promise.all([carregarGsap(), import("gsap/DrawSVGPlugin")]).then(([gsap, { DrawSVGPlugin }]) => {
    gsap.registerPlugin(DrawSVGPlugin);
    return gsap;
  });
  return traco;
}

/** O GSAP com ScrollTrigger e DrawSVG (o caderno marcado, D41). */
let rolagem: Promise<{ gsap: GSAP; ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger }> | undefined;
export function carregarRolagem() {
  rolagem ??= Promise.all([carregarTraco(), import("gsap/ScrollTrigger")]).then(([gsap, { ScrollTrigger }]) => {
    gsap.registerPlugin(ScrollTrigger);
    return { gsap, ScrollTrigger };
  });
  return rolagem;
}

/**
 * Começa o download antes do uso: no primeiro mouse, toque ou foco em `alvo`, ou quando a página
 * fica ociosa (no máximo em 4s).
 */
export function adiantar(alvo: Element, carregar: () => Promise<unknown> = carregarGsap) {
  const ja = () => void carregar();
  for (const evento of ["pointerenter", "pointerdown", "focusin"]) alvo.addEventListener(evento, ja, { once: true, passive: true });
  if ("requestIdleCallback" in window) requestIdleCallback(ja, { timeout: 4000 });
  else setTimeout(ja, 2500);
}

/** Movimento reduzido pedido pelo sistema: tudo direto no estado final. */
export const movimentoReduzido = matchMedia("(prefers-reduced-motion: reduce)");

/** Aparelho com mouse (o toque tem outros comportamentos). */
export const temMouse = matchMedia("(hover: hover) and (pointer: fine)");
