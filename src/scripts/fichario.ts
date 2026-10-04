/**
 * O fichário de Tags (rodada 4, P19-2; o comportamento do 19, Biblioteca). O móvel (Fichario.astro) tem uma
 * gaveta por letra (as sem tag, apagadas) e a gaveta "Todas" na última; embaixo, as fichas das tags, de A
 * a Z, com o separador de letra na primeira de cada uma.
 *
 * - Puxar uma letra (clique, toque, Enter): as gavetas abertas voltam, a da letra sai (0,4s: a frente vem
 *   18px para perto do leitor, com a sombra e a borda de cima da gaveta à vista, pelo CSS); as fichas que
 *   estavam embaixo saem (0,18s) e as da letra caem de cima, uma a uma (fichas-caem.ts). Com poucas, elas
 *   ficam no meio da linha (P16-7, pelo CSS da página).
 * - "Todas": todas as gavetas com tag saem em cascata (40ms entre elas) e todas as fichas aparecem, com as
 *   letras dividindo a linha (a grade corre direto, o B começa na linha em que o A termina, e o separador
 *   pequeno marca onde cada letra começa). É o estado de chegada: depois que a página chega (a troca
 *   acabando, a abertura acabando ou a carga) e o móvel está à vista (ou quando ele chega à tela, ao rolar),
 *   as gavetas saem em cascata. As fichas chegam antes, pela troca (jogadas) ou caindo.
 * - Abaixo da dobra, as fichas caem quando entram na tela (15% à vista), nunca todas de uma vez.
 *
 * Sem JS, as gavetas são links para a primeira ficha da letra (#letra-B) e todas as fichas estão à vista.
 * Com movimento reduzido, as gavetas e as fichas trocam direto, sem cair. A gaveta escolhida leva
 * `aria-current`; o número de fichas à vista é anunciado (a placa do móvel, aria-live).
 */
import { fichasCaem, quandoAVista, soltarFichas } from "./fichas-caem";

const CASCATA = 40;
const SAI = 180;
const reduzido = matchMedia("(prefers-reduced-motion: reduce)");

/** Depois que a página chegou: a troca inteira (cs:chegou), a abertura (cs:aberto) ou, sem nenhuma, já. */
function quandoChegou(): Promise<void> {
  const raiz = document.documentElement;
  return new Promise((pronto) => {
    let foi = false;
    const ir = () => {
      if (foi) return;
      foi = true;
      pronto();
    };
    if (raiz.hasAttribute("data-abertura")) {
      addEventListener("cs:aberto", ir, { once: true });
      setTimeout(ir, 7600);
    } else if (raiz.hasAttribute("data-vai-chegar") || raiz.hasAttribute("data-chegando") || raiz.classList.contains("cortina")) {
      addEventListener("cs:chegou", ir, { once: true });
      setTimeout(ir, 2600);
    } else void quandoAVista().then(ir);
  });
}

export function fichario(movel: HTMLElement, lista: HTMLElement) {
  const gavetas = [...movel.querySelectorAll<HTMLAnchorElement>("a[data-gaveta-letra]")];
  const comLetra = gavetas.filter((g) => g.dataset.gavetaLetra !== "todas");
  const todas = gavetas.find((g) => g.dataset.gavetaLetra === "todas");
  const fichas = [...lista.children] as HTMLElement[];
  const dica = movel.querySelector<HTMLElement>("[data-dica-fichario]");
  const dicaInicial = dica?.dataset.padrao ?? dica?.textContent ?? "";
  if (dica) dica.setAttribute("aria-live", "polite");
  let atual = "todas";
  let vez = 0;
  const saidas = new Set<Animation>();
  const cancelarSaidas = () => {
    saidas.forEach((a) => a.cancel());
    saidas.clear();
  };

  // As fichas que caem na chegada e ao rolar (o comportamento de Tags da base).
  fichasCaem(lista);

  /** Puxa as gavetas dadas (em cascata) e empurra as outras de volta. */
  function puxar(quais: HTMLElement[], cascata: boolean) {
    for (const g of gavetas) {
      if (quais.includes(g)) continue;
      g.classList.remove("puxada");
      g.style.removeProperty("transition-delay");
    }
    quais.forEach((g, i) => {
      g.style.setProperty("transition-delay", cascata && !reduzido.matches ? `${i * CASCATA}ms` : "0ms");
      g.classList.add("puxada");
    });
    for (const g of gavetas) {
      if (quais.includes(g) && (quais.length === 1 || g === todas)) g.setAttribute("aria-current", "true");
      else g.removeAttribute("aria-current");
    }
  }

  /** As fichas abaixo da dobra caem quando entram na tela. */
  let olho: IntersectionObserver | null = null;
  function cairAoVer(fichasNovas: HTMLElement[]) {
    olho?.disconnect();
    const H = innerHeight;
    const agora: HTMLElement[] = [];
    const depois: HTMLElement[] = [];
    for (const f of fichasNovas) (f.getBoundingClientRect().top < H - 40 ? agora : depois).push(f);
    soltarFichas(agora);
    if (!depois.length || !("IntersectionObserver" in window)) return void soltarFichas(depois);
    olho = new IntersectionObserver(
      (entradas) => {
        const chegaram = entradas.filter((e) => e.isIntersecting).map((e) => e.target as HTMLElement);
        chegaram.forEach((f) => olho?.unobserve(f));
        soltarFichas(chegaram);
      },
      { threshold: 0.15 },
    );
    depois.forEach((f) => olho!.observe(f));
  }

  /** Mostra as fichas de `letra` ("todas" mostra todas), trocando as que estão embaixo. */
  async function mostrar(letra: string) {
    if (letra === atual) return;
    atual = letra;
    const minha = ++vez;
    cancelarSaidas();
    const novas = fichas.filter((f) => letra === "todas" || f.dataset.letra === letra);
    const saindo = fichas.filter((f) => !f.hidden && !novas.includes(f));
    if (!reduzido.matches && saindo.length) {
      const anims = saindo
        .filter((f) => f.getBoundingClientRect().top < innerHeight && f.getBoundingClientRect().bottom > 0)
        .map((f) => f.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(-10px)" }], { duration: SAI, easing: "cubic-bezier(0.55, 0.085, 0.68, 0.53)", fill: "forwards" }));
      anims.forEach((a) => saidas.add(a));
      await Promise.all(anims.map((a) => a.finished.catch(() => {})));
      anims.forEach((a) => { a.cancel(); saidas.delete(a); });
      if (minha !== vez) return;
    }
    for (const f of fichas) {
      const fica = novas.includes(f);
      f.hidden = !fica;
      // As que vão aparecer caem de novo (a queda é das fichas sem `data-caiu`).
      if (fica && !reduzido.matches) {
        delete f.dataset.caiu;
        delete f.dataset.jogada;
      }
    }
    lista.toggleAttribute("data-uma-letra", letra !== "todas");
    if (dica) dica.textContent = letra === "todas" ? dicaInicial : `${novas.length} ${novas.length === 1 ? "ficha" : "fichas"} na gaveta ${letra}`;
    // Se das fichas à vista quase nada aparece na tela, a página desce até o começo delas ficar no meio (com
    // movimento reduzido, de uma vez).
    const topo = lista.getBoundingClientRect().top;
    if (innerHeight - topo < 200) scrollBy({ top: topo - innerHeight * 0.5, behavior: reduzido.matches ? "instant" : "smooth" });
    if (reduzido.matches) return;
    requestAnimationFrame(() => { if (minha === vez && !reduzido.matches) cairAoVer(novas); });
  }

  reduzido.addEventListener("change", () => {
    if (!reduzido.matches) return;
    cancelarSaidas();
    olho?.disconnect();
    fichas.forEach((f) => { f.dataset.caiu = ""; });
  });

  for (const g of gavetas) {
    g.addEventListener("click", (e) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      const letra = g.dataset.gavetaLetra!;
      if (letra === "todas") puxar([...comLetra, ...(todas ? [todas] : [])], true);
      else puxar([g], false);
      void mostrar(letra);
    });
  }

  // A chegada: "Todas" é o estado inicial. As gavetas saem em cascata quando a página acabou de chegar e o
  // móvel está à vista; abaixo da dobra, quando ele chega à tela.
  const tudo = [...comLetra, ...(todas ? [todas] : [])];
  if (reduzido.matches || !("IntersectionObserver" in window)) return void puxar(tudo, false);
  const gavetasDoMovel = movel.querySelector<HTMLElement>(".gavetas") ?? movel;
  void quandoChegou().then(() => {
    const olhoDoMovel = new IntersectionObserver(
      (entradas) => {
        if (!entradas.some((e) => e.isIntersecting && e.intersectionRatio >= 0.35)) return;
        olhoDoMovel.disconnect();
        // Se alguém já puxou uma gaveta antes de o móvel chegar à tela, vale o que ele escolheu.
        if (atual === "todas" && !gavetas.some((g) => g.classList.contains("puxada"))) puxar(tudo, true);
      },
      { threshold: [0, 0.35] },
    );
    olhoDoMovel.observe(gavetasDoMovel);
  });
}
