/**
 * GSAP sob demanda (D35, D40): nenhuma página leva o GSAP no pacote inicial. Cada componente que anima
 * chama `carregarGsap()` (ou `carregarArrastar()`, que traz também Draggable e InertiaPlugin) quando
 * precisa, e `adiantar()` começa o download um pouco antes: ao passar o mouse, tocar ou receber o foco
 * no elemento, ou quando a página fica ociosa. O navegador guarda o arquivo, e as chamadas seguintes
 * reaproveitam a mesma promessa. Se o download falhar (a rede caiu, ou o HTML guardado de antes de um
 * deploy pede um arquivo que não existe mais), a promessa é esquecida e a próxima chamada tenta de novo;
 * quem chama cai no caminho sem animação (D54).
 */
import type { gsap as Gsap } from "gsap";

export type GSAP = typeof Gsap;

let nucleo: Promise<GSAP> | undefined;
let arrastar:
  | Promise<{
      gsap: GSAP;
      Draggable: typeof import("gsap/Draggable").Draggable;
      InertiaPlugin: typeof import("gsap/InertiaPlugin").InertiaPlugin;
    }>
  | undefined;

/** A promessa guardada, esquecida se falhar. */
function guardada<T>(promessa: Promise<T>, esquecer: () => void): Promise<T> {
  return promessa.catch((erro) => {
    esquecer();
    throw erro;
  });
}

export function carregarGsap(): Promise<GSAP> {
  nucleo ??= guardada(
    import("gsap").then((m) => m.gsap),
    () => (nucleo = undefined),
  );
  return nucleo;
}

/**
 * O GSAP com Draggable e InertiaPlugin (o livro ampliado, que gira com embalo, e o livro puxado pela
 * cabeça na estante da home, D49).
 */
export function carregarArrastar() {
  arrastar ??= guardada(
    Promise.all([carregarGsap(), import("gsap/Draggable"), import("gsap/InertiaPlugin")]).then(([gsap, { Draggable }, { InertiaPlugin }]) => {
      gsap.registerPlugin(Draggable, InertiaPlugin);
      return { gsap, Draggable, InertiaPlugin };
    }),
    () => (arrastar = undefined),
  );
  return arrastar;
}

/** O GSAP com Flip (a busca que nasce do campo, D44). */
let flip: Promise<{ gsap: GSAP; Flip: typeof import("gsap/Flip").Flip }> | undefined;
export function carregarFlip() {
  flip ??= guardada(
    Promise.all([carregarGsap(), import("gsap/Flip")]).then(([gsap, { Flip }]) => {
      gsap.registerPlugin(Flip);
      return { gsap, Flip };
    }),
    () => (flip = undefined),
  );
  return flip;
}

/** O GSAP com DrawSVG (o desenho do destaque que se desenha, D41). */
let traco: Promise<GSAP> | undefined;
export function carregarTraco() {
  traco ??= guardada(
    Promise.all([carregarGsap(), import("gsap/DrawSVGPlugin")]).then(([gsap, { DrawSVGPlugin }]) => {
      gsap.registerPlugin(DrawSVGPlugin);
      return gsap;
    }),
    () => (traco = undefined),
  );
  return traco;
}

/** O GSAP com MorphSVG e DrawSVG (o sol e a lua do botão de tema, D49). */
let morfo: Promise<GSAP> | undefined;
export function carregarMorfo() {
  morfo ??= guardada(
    Promise.all([carregarGsap(), import("gsap/MorphSVGPlugin"), import("gsap/DrawSVGPlugin")]).then(([gsap, { MorphSVGPlugin }, { DrawSVGPlugin }]) => {
      gsap.registerPlugin(MorphSVGPlugin, DrawSVGPlugin);
      return gsap;
    }),
    () => (morfo = undefined),
  );
  return morfo;
}

/**
 * Começa o download antes do uso: no primeiro mouse, toque ou foco em `alvo`, ou quando a página
 * fica ociosa (no máximo em 4s).
 */
export function adiantar(alvo: Element, carregar: () => Promise<unknown> = carregarGsap) {
  // Só adiantar: se falhar aqui, quem usar tenta de novo (e trata a falha).
  const ja = () => void carregar().catch(() => {});
  for (const evento of ["pointerenter", "pointerdown", "focusin"]) alvo.addEventListener(evento, ja, { once: true, passive: true });
  if ("requestIdleCallback" in window) requestIdleCallback(ja, { timeout: 4000 });
  else setTimeout(ja, 2500);
}

/** Movimento reduzido pedido pelo sistema: tudo direto no estado final. */
export const movimentoReduzido = matchMedia("(prefers-reduced-motion: reduce)");

/** Aparelho com mouse (o toque tem outros comportamentos). */
export const temMouse = matchMedia("(hover: hover) and (pointer: fine)");
