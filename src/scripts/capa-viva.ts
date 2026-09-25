/**
 * Capas com profundidade (D40, ideia 5): na grade de categorias e séries, no "Do livro" e no topo da
 * página do livro, o livro 3D acompanha o mouse (até 11° em Y e 7° em X, em volta de 8° com o mouse em
 * cima; em repouso, 18°), com uma luz suave que segue o cursor, e a capa entreabre (-40°) mostrando
 * três camadas de página (-8,6°, -17,1°, -25,7°). O foco do teclado entreabre também. No toque, o primeiro toque entreabre e o
 * segundo segue o link (ou abre o livro ampliado, no topo da página do livro).
 *
 * Só transformações e opacidade: a luz é um brilho maior que a capa, que anda por `transform`.
 * Com movimento reduzido, nada disso acontece.
 */
import { adiantar, carregarGsap, movimentoReduzido, type GSAP } from "./gsap";
import { GIRO } from "../lib/livro-3d";

// Com o mouse em cima, o livro vira 10° para o leitor (a 8° da frente, como no protótipo): assim as
// camadas de página aparecem na borda quando a capa entreabre.
const COM_MOUSE = GIRO - 10;

// A capa entreabre a -40° (D40, aprovado depois dos -28° do protótipo), e as três camadas de página
// acompanham na mesma proporção dos -6°, -12° e -18° de lá.
const ENTREABRE = -40;
const CAMADAS = [-6, -12, -18].map((g) => (g * ENTREABRE) / -28);

function ligar(gsap: GSAP, area: HTMLElement) {
  const livro = area.querySelector<HTMLElement>(".livro-3d");
  if (!livro || area.dataset.capaViva === "ligada") return;
  area.dataset.capaViva = "ligada";
  const capa = livro.querySelector<HTMLElement>(".face-capa")!;
  const folhas = [...livro.querySelectorAll<HTMLElement>(".folha-livro")];
  const frente = livro.querySelector<HTMLElement>(".capa-frente")!;
  const luz = document.createElement("span");
  luz.className = "luz-capa";
  luz.setAttribute("aria-hidden", "true");
  frente.append(luz);

  gsap.set(livro, { rotationY: GIRO, rotationX: 0 });
  const ry = gsap.quickTo(livro, "rotationY", { duration: 0.6, ease: "power3.out" });
  const rx = gsap.quickTo(livro, "rotationX", { duration: 0.6, ease: "power3.out" });
  const lx = gsap.quickTo(luz, "xPercent", { duration: 0.4, ease: "power2.out" });
  const ly = gsap.quickTo(luz, "yPercent", { duration: 0.4, ease: "power2.out" });

  let entreaberta = false;
  const entreabrir = (sim: boolean) => {
    if (sim === entreaberta) return;
    entreaberta = sim;
    gsap.to(capa, { rotationY: sim ? ENTREABRE : 0, duration: sim ? 0.7 : 0.6, ease: sim ? "power3.out" : "power3.inOut", overwrite: "auto" });
    folhas.forEach((f, i) =>
      gsap.to(f, { rotationY: sim ? CAMADAS[i] : 0, duration: 0.7 + i * 0.08, ease: "power3.out", overwrite: "auto" }),
    );
    gsap.to(luz, { opacity: sim ? 0.9 : 0, duration: 0.4, overwrite: "auto" });
  };
  const repousar = () => {
    ry(GIRO);
    rx(0);
    entreabrir(false);
  };

  area.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    const r = area.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - 0.5;
    const dy = (e.clientY - r.top) / r.height - 0.5;
    ry(COM_MOUSE + dx * 22);
    rx(-dy * 14);
    lx(dx * 50);
    ly(dy * 50);
    entreabrir(true);
  });
  area.addEventListener("pointerleave", (e) => e.pointerType === "mouse" && repousar());
  area.addEventListener("focusin", () => {
    if (!area.matches(":focus-visible") && !area.querySelector(":focus-visible")) return;
    ry(COM_MOUSE);
    entreabrir(true);
  });
  area.addEventListener("focusout", repousar);

  // No toque: o primeiro toque entreabre; o segundo segue o link (ou o que o clique fizer).
  let toque = false;
  area.addEventListener("pointerdown", (e) => (toque = e.pointerType !== "mouse"));
  area.addEventListener(
    "click",
    (e) => {
      if (!toque || entreaberta) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      entreabrir(true);
    },
    true,
  );
  // Tocar fora fecha.
  document.addEventListener("pointerdown", (e) => {
    if (entreaberta && e.pointerType !== "mouse" && !area.contains(e.target as Node)) repousar();
  });
}

/** Liga as capas vivas de `[data-capa-viva]`, com o GSAP baixado pouco antes do uso. */
export function capasVivas(raiz: ParentNode = document) {
  if (movimentoReduzido.matches) return;
  for (const area of raiz.querySelectorAll<HTMLElement>("[data-capa-viva]")) {
    adiantar(area, () => carregarGsap().then((g) => ligar(g, area)));
  }
}
