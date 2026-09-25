/**
 * A estante viva (D40), com GSAP sob demanda:
 *
 * - ideia 1, a estante responde ao mouse (home e estante de filtro): o livro sob o mouse sobe 16px;
 *   os vizinhos até 120px sobem até 5px e inclinam até 2,4° para longe do mouse; ao sair, tudo volta
 *   com um balanço. Embaixo, a legenda mostra o nome e a contagem. O foco do teclado faz o mesmo.
 *   Só com mouse; no toque, a lombada abre o livro direto (Gaveta.astro).
 *
 * - ideia 2, a estante em repouso (só a home, `emRepouso`): depois de 3s sem mouse, toque, tecla ou
 *   rolagem, com a estante ao menos metade visível e a aba ativa, uma faixa de luz suave atravessa as
 *   lombadas (3,6s, a cada ~9s) e, a cada 4 a 7s, um livro sorteado dá uma espiadinha. Qualquer
 *   interação para tudo na hora e devolve os livros ao lugar. Desligada com movimento reduzido.
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
    qy = lombadas.map((el) => gsap!.quickTo(el, "y", { duration: 0.45, ease: "power3.out" }));
    qr = lombadas.map((el) => gsap!.quickTo(el, "rotation", { duration: 0.6, ease: "power3.out" }));
  }

  function mover(x: number) {
    if (!gsap) return;
    refazerQuick();
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
    quickVelho = true;
  }

  // ---------- ideia 2: em repouso ----------
  // A luz: uma faixa dentro de cada lombada, deslocada pela posição dela na estante.
  let luzes: HTMLElement[] = [];
  const criarLuzes = () => {
    if (luzes.length || !emRepouso) return;
    luzes = lombadas.map((el) => {
      const caixa = document.createElement("span");
      caixa.className = "luz-lombada";
      caixa.setAttribute("aria-hidden", "true");
      const faixa = document.createElement("span");
      caixa.append(faixa);
      el.append(caixa);
      return faixa;
    });
  };
  let relogio = 0;
  let visivel = false;
  let ativo = false;
  let luz: gsap.core.Timeline | null = null;
  let espiada: gsap.core.Tween | null = null;

  function iniciarRepouso() {
    if (!gsap || ativo || !visivel || document.hidden || movimentoReduzido.matches || sobAtual) return;
    const g = gsap;
    ativo = true;
    criarLuzes();
    const estante = raiz.getBoundingClientRect();
    const faixa = Math.round(estante.width * 0.38);
    raiz.style.setProperty("--largura-luz", `${faixa}px`);
    // Cada luz anda a mesma distância no mesmo tempo, a partir da posição da lombada: é uma faixa só.
    const inicio = luzes.map((l) => -faixa - (l.parentElement!.parentElement!.getBoundingClientRect().left - estante.left));
    luz = g
      .timeline({ repeat: -1, repeatDelay: 5.4 })
      .set(luzes, { x: (i: number) => inicio[i], opacity: 1 })
      .to(luzes, { x: (i: number) => inicio[i] + estante.width + faixa, duration: 3.6, ease: "sine.inOut" })
      .set(luzes, { opacity: 0 });
    const espiar = () => {
      const el = lombadas[Math.floor(Math.random() * lombadas.length)];
      const r = repouso(el);
      g.timeline()
        .to(el, { y: r.y - 10, rotation: r.rotation - 1.2, duration: 0.7, ease: "power2.out" })
        .to(el, { y: r.y, rotation: r.rotation, duration: 1.1, ease: "elastic.out(1, 0.5)" }, "+=0.6");
      quickVelho = true;
      espiada = g.delayedCall(4 + Math.random() * 3, espiar);
    };
    espiada = g.delayedCall(1.6, espiar);
  }

  function pararRepouso() {
    if (!ativo || !gsap) return;
    ativo = false;
    luz?.kill();
    espiada?.kill();
    luz = espiada = null;
    if (luzes.length) gsap.set(luzes, { opacity: 0 });
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
