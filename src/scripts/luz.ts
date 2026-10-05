/**
 * O brilho nas lombadas da estante (rodada 3 do redesenho, área A, T4; Luz.astro, luz.css): a camada do
 * reflexo entra na lombada na primeira vez que o mouse passa nela, ou que ela recebe o foco. O livro 3D e a
 * foto do livro têm o script deles (livro-vivo.ts). Com movimento reduzido, o mouse não acende o brilho (o
 * foco do teclado, sim).
 */

const reduzido = matchMedia("(prefers-reduced-motion: reduce)");

/** A lombada da estante ganha a camada do brilho na primeira vez que o mouse passa nela. */
function brilhoNaLombada(el: Element) {
  const lombada = el.closest<HTMLElement>(".lombada");
  if (!lombada) return;
  const visual = lombada.matches(".lombada-visual") ? lombada : lombada.querySelector<HTMLElement>(".lombada-visual");
  if (!visual || visual.querySelector(":scope > .luz-brilho")) return;
  const camada = document.createElement("span");
  camada.className = "luz-brilho";
  camada.setAttribute("aria-hidden", "true");
  visual.append(camada);
}

document.addEventListener(
  "pointerover",
  (e) => {
    if (e.pointerType === "mouse" && !reduzido.matches && e.target instanceof Element) brilhoNaLombada(e.target);
  },
  { passive: true },
);

// O teclado também acende o brilho da lombada (o reflexo passa no foco, luz.css).
document.addEventListener("focusin", (e) => {
  if (e.target instanceof Element) brilhoNaLombada(e.target);
});
