/**
 * A estante viva (D40), com GSAP sob demanda:
 *
 * - ideia 1, a estante responde ao mouse (home e estante de filtro): o livro sob o mouse desliza 16px
 *   para cima, como puxado pela ponta; os dois vizinhos, encostados nele, sobem só 2px, pelo atrito,
 *   e um pouco depois (D47: nada inclina, porque o topo de um livro inclinado entrava no vizinho). Ao
 *   sair, tudo desce e assenta com um quique curto. Embaixo, a legenda mostra o nome e a contagem. O
 *   foco do teclado faz o mesmo. Só com mouse; no toque, a lombada abre o livro direto (Gaveta.astro).
 *
 * - ideia 2, a estante em repouso (só a home, `emRepouso`): depois de 3s sem mouse, toque, tecla ou
 *   rolagem, com a estante ao menos metade visível e a aba ativa, a cada 4 a 7s um livro sorteado dá
 *   uma espiadinha (a faixa de luz que atravessava as lombadas saiu na D44). Qualquer interação para
 *   tudo na hora e devolve os livros ao lugar. Desligada com movimento reduzido.
 *
 * A posição de repouso de cada lombada (o livro inclinado da home, 6°; a lombada escolhida no filtro,
 * 10px acima) é lida a cada movimento, porque o GSAP escreve o `transform` e o CSS não manda mais.
 * Só transformações. Com movimento reduzido, nada se move (a legenda continua).
 */
import { adiantar, carregarGsap, movimentoReduzido, temMouse, type GSAP } from "./gsap";

const SOBE = 16;
const VIZINHO_SOBE = 2;

/** Onde a lombada descansa: inclinada (a última da coleção, na home) e escolhida (no filtro). */
function repouso(el: HTMLElement) {
  return {
    y: el.getAttribute("aria-pressed") === "true" ? -10 : 0,
    rotation: el.classList.contains("inclinada") ? 6 : 0,
  };
}

const OCIOSO = 3000;

export function estanteViva(raiz: HTMLElement, { emRepouso = false } = {}) {
  const lombadas = [...raiz.querySelectorAll<HTMLElement>(".lombada")];
  const legenda = raiz.parentElement?.querySelector<HTMLElement>("[data-legenda-estante]");
  if (!lombadas.length) return;

  const mostrarLegenda = (el: HTMLElement | null) => {
    if (!legenda) return;
    legenda.innerHTML = el ? `<b>${el.dataset.titulo}</b> · ${el.dataset.conta}` : "";
  };

  let gsap: GSAP | null = null;
  let qy: ((v: number) => void)[] = [];
  let qv: ((v: number) => void)[] = [];
  let sobAtual: HTMLElement | null = null;

  const preparar = (g: GSAP) => {
    if (gsap) return;
    gsap = g;
    raiz.classList.add("viva");
    for (const el of lombadas) {
      const r = repouso(el);
      g.set(el, { ...r, transformOrigin: el.classList.contains("inclinada") ? "100% 100%" : "50% 100%" });
    }
    refazerQuick();
    // A lombada escolhida no filtro muda de repouso: vai para o lugar novo.
    new MutationObserver((mudancas) => {
      for (const m of mudancas) {
        const el = m.target as HTMLElement;
        if (el !== sobAtual) g.to(el, { ...repouso(el), duration: 0.45, ease: "power3.out", overwrite: "auto" });
      }
    }).observe(raiz, { subtree: true, attributes: true, attributeFilter: ["aria-pressed"] });
  };

  // Um tween com overwrite mata os quickTo das lombadas: refaz antes de usar de novo.
  let quickVelho = true;
  function refazerQuick() {
    if (!gsap || !quickVelho) return;
    quickVelho = false;
    qy = lombadas.map((el) => gsap!.quickTo(el, "y", { duration: 0.42, ease: "power3.out" }));
    // Os vizinhos vão atrás, mais devagar: o atrito leva um instante para puxar.
    qv = lombadas.map((el) => gsap!.quickTo(el, "y", { duration: 0.7, ease: "power2.out" }));
  }

  function mover(x: number) {
    if (!gsap) return;
    refazerQuick();
    const i = lombadas.findIndex((el) => {
      const caixa = el.getBoundingClientRect();
      return x >= caixa.left - 3 && x <= caixa.right + 3;
    });
    const sob = i >= 0 ? lombadas[i] : null;
    lombadas.forEach((el, n) => {
      const r = repouso(el);
      // Só sobe, na vertical; o inclinado continua apoiado no aparador, no mesmo ângulo.
      if (n === i) qy[n](r.y - SOBE);
      else if (i >= 0 && Math.abs(n - i) === 1) qv[n](r.y - VIZINHO_SOBE);
      else qv[n](r.y);
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
    // Desce e assenta: um quique curto, de livro que bate na prateleira (sem balançar de lado).
    for (const el of lombadas) gsap.to(el, { ...repouso(el), duration: 0.55, ease: "bounce.out", overwrite: true });
    quickVelho = true;
  }

  // ---------- ideia 2: em repouso ----------
  let relogio = 0;
  let visivel = false;
  let ativo = false;
  let espiada: gsap.core.Tween | null = null;

  function iniciarRepouso() {
    if (!gsap || ativo || !visivel || document.hidden || movimentoReduzido.matches || sobAtual) return;
    const g = gsap;
    ativo = true;
    const espiar = () => {
      const el = lombadas[Math.floor(Math.random() * lombadas.length)];
      const r = repouso(el);
      g.timeline()
        .to(el, { y: r.y - 10, duration: 0.7, ease: "power2.out" })
        .to(el, { y: r.y, duration: 0.55, ease: "bounce.out" }, "+=0.6");
      quickVelho = true;
      espiada = g.delayedCall(4 + Math.random() * 3, espiar);
    };
    espiada = g.delayedCall(1.6, espiar);
  }

  function pararRepouso() {
    if (!ativo || !gsap) return;
    ativo = false;
    espiada?.kill();
    espiada = null;
    if (!sobAtual) for (const el of lombadas) gsap.to(el, { ...repouso(el), duration: 0.35, overwrite: true });
    quickVelho = true;
  }

  // Qualquer interação para tudo na hora e recomeça a contar os 3 segundos.
  function mexeu() {
    pararRepouso();
    clearTimeout(relogio);
    if (visivel && !document.hidden) relogio = window.setTimeout(iniciarRepouso, OCIOSO);
  }

  if (emRepouso && !movimentoReduzido.matches) {
    new IntersectionObserver(
      ([e]) => {
        visivel = e.isIntersecting;
        mexeu();
      },
      { threshold: 0.5 },
    ).observe(raiz);
    for (const evento of ["pointermove", "pointerdown", "keydown", "wheel", "touchstart", "scroll"]) {
      addEventListener(evento, mexeu, { passive: true });
    }
    document.addEventListener("visibilitychange", mexeu);
    movimentoReduzido.addEventListener("change", mexeu);
    // Sem mouse, o GSAP vem quando a página fica ociosa, para o repouso poder começar.
    adiantar(raiz, () => carregarGsap().then((g) => {
      preparar(g);
      mexeu();
    }));
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
    el.addEventListener("blur", (e) => {
      // Indo para outra lombada, quem cuida é o foco dela: devolver tudo ao lugar atropelaria o movimento.
      if (lombadas.includes(e.relatedTarget as HTMLElement)) return;
      if (gsap && !movimentoReduzido.matches) soltar();
      else mostrarLegenda(null);
    });
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
