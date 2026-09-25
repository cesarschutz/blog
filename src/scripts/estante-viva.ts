/**
 * A estante viva (D40), com GSAP sob demanda:
 *
 * - ideia 1, a estante responde ao mouse (home e estante de filtro): o livro sob o mouse sobe 16px;
 *   os vizinhos até 120px sobem até 5px e inclinam até 2,4° para longe do mouse; ao sair, tudo volta
 *   com um balanço. Embaixo, a legenda mostra o nome e a contagem. O foco do teclado faz o mesmo.
 *   Só com mouse; no toque, a lombada abre o livro direto (Gaveta.astro).
 *
 * A posição de repouso de cada lombada (o livro inclinado da home, 6°; a lombada escolhida no filtro,
 * 10px acima) é lida a cada movimento, porque o GSAP escreve o `transform` e o CSS não manda mais.
 * Só transformações. Com movimento reduzido, nada se move (a legenda continua).
 */
import { adiantar, carregarGsap, movimentoReduzido, temMouse, type GSAP } from "./gsap";

const SOBE = 16;
const ALCANCE = 120;
const VIZINHO_SOBE = 5;
const VIZINHO_INCLINA = 2.4;

/** Onde a lombada descansa: inclinada (a última da coleção, na home) e escolhida (no filtro). */
function repouso(el: HTMLElement) {
  return {
    y: el.getAttribute("aria-pressed") === "true" ? -10 : 0,
    rotation: el.classList.contains("inclinada") ? 6 : 0,
  };
}

export function estanteViva(raiz: HTMLElement) {
  const lombadas = [...raiz.querySelectorAll<HTMLElement>(".lombada")];
  const legenda = raiz.parentElement?.querySelector<HTMLElement>("[data-legenda-estante]");
  if (!lombadas.length) return;

  const mostrarLegenda = (el: HTMLElement | null) => {
    if (!legenda) return;
    legenda.innerHTML = el ? `<b>${el.dataset.titulo}</b> · ${el.dataset.conta}` : "";
  };

  let gsap: GSAP | null = null;
  let qy: ((v: number) => void)[] = [];
  let qr: ((v: number) => void)[] = [];
  let sobAtual: HTMLElement | null = null;

  const preparar = (g: GSAP) => {
    if (gsap) return;
    gsap = g;
    raiz.classList.add("viva");
    for (const el of lombadas) {
      const r = repouso(el);
      g.set(el, { ...r, transformOrigin: el.classList.contains("inclinada") ? "100% 100%" : "50% 100%" });
    }
    qy = lombadas.map((el) => g.quickTo(el, "y", { duration: 0.45, ease: "power3.out" }));
    qr = lombadas.map((el) => g.quickTo(el, "rotation", { duration: 0.6, ease: "power3.out" }));
    // A lombada escolhida no filtro muda de repouso: vai para o lugar novo.
    new MutationObserver((mudancas) => {
      for (const m of mudancas) {
        const el = m.target as HTMLElement;
        if (el !== sobAtual) g.to(el, { ...repouso(el), duration: 0.45, ease: "power3.out", overwrite: "auto" });
      }
    }).observe(raiz, { subtree: true, attributes: true, attributeFilter: ["aria-pressed"] });
  };

  function mover(x: number) {
    if (!gsap) return;
    let sob: HTMLElement | null = null;
    lombadas.forEach((el, i) => {
      const caixa = el.getBoundingClientRect();
      const centro = caixa.left + caixa.width / 2;
      const dentro = x >= caixa.left - 1.5 && x <= caixa.right + 1.5;
      const r = repouso(el);
      const forca = Math.max(0, 1 - Math.abs(x - centro) / ALCANCE);
      if (dentro) sob = el;
      qy[i](r.y + (dentro ? -SOBE : -VIZINHO_SOBE * forca * forca));
      qr[i](dentro ? r.rotation * 0.4 : r.rotation + (centro < x ? -1 : 1) * VIZINHO_INCLINA * forca);
    });
    if (sob !== sobAtual) {
      sobAtual = sob;
      mostrarLegenda(sob);
    }
  }

  function soltar() {
    sobAtual = null;
    mostrarLegenda(null);
    if (!gsap) return;
    for (const el of lombadas) gsap.to(el, { ...repouso(el), duration: 1.1, ease: "elastic.out(1, 0.45)", overwrite: true });
    // Os quickTo foram sobrescritos: refaz na próxima vez.
    qy = lombadas.map((el) => gsap!.quickTo(el, "y", { duration: 0.45, ease: "power3.out" }));
    qr = lombadas.map((el) => gsap!.quickTo(el, "rotation", { duration: 0.6, ease: "power3.out" }));
  }

  // O foco do teclado faz o mesmo que o mouse; a legenda aparece mesmo com movimento reduzido.
  for (const el of lombadas) {
    el.addEventListener("focus", () => {
      if (!el.matches(":focus-visible")) return;
      const caixa = el.getBoundingClientRect();
      if (movimentoReduzido.matches) return mostrarLegenda(el);
      carregarGsap().then((g) => {
        preparar(g);
        if (document.activeElement === el) mover(caixa.left + caixa.width / 2);
      });
    });
    el.addEventListener("blur", () => (gsap && !movimentoReduzido.matches ? soltar() : mostrarLegenda(null)));
  }

  raiz.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    if (movimentoReduzido.matches) {
      mostrarLegenda((e.target as HTMLElement).closest<HTMLElement>(".lombada"));
      return;
    }
    if (gsap) mover(e.clientX);
    else carregarGsap().then(preparar);
  });
  raiz.addEventListener("pointerleave", (e) => {
    if (e.pointerType !== "mouse") return;
    if (movimentoReduzido.matches) mostrarLegenda(null);
    else soltar();
  });

  if (temMouse.matches && !movimentoReduzido.matches) adiantar(raiz, () => carregarGsap().then(preparar));
}
