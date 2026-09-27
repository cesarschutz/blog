/*
 * A troca de tela geral (de qualquer tela para qualquer outra), nas variações do protótipo 03.
 * Os outros protótipos a usam para as trocas que não têm animação própria.
 *
 * Todas seguem o A2: as folhas da tela nova chegam do fundo, em perspectiva, e pousam no lugar, em
 * cascata (de cima para baixo). O que muda é como as da tela atual saem. O cabeçalho nunca se mexe;
 * o traço do menu desliza enquanto isso (site.js).
 *
 * Textos soltos (montagem "texto fora", data-texto): não voam em 3D (texto solto voando parece
 * aparecer do nada). Sobem por uma máscara, uma linha curta, junto com a folha que vem logo depois.
 */
(() => {
  const P = 1400; // a perspectiva de cada folha (transformPerspective)
  const rnd = gsap.utils.random;

  /** A origem das transformações no meio da parte da folha que está à vista (folhas altas, como o artigo). */
  function preparar(el, ctx) {
    const r = SITE.caixa(el);
    const topo = Math.max(0, -r.y), baixo = Math.min(r.h, ctx.H - r.y);
    gsap.set(el, { transformPerspective: P, transformOrigin: `50% ${Math.max(0, (topo + baixo) / 2)}px`, willChange: "transform, opacity" });
  }
  const eTexto = (el) => el.hasAttribute("data-texto");

  /** Texto solto que sai: sobe um pouco e some (rápido, antes das folhas). */
  function textoSai(tl, el, t) {
    tl.to(el, { y: -10, opacity: 0, duration: 0.2, ease: "power2.in" }, t);
  }
  /** Texto solto que chega: sobe por uma máscara, uma linha só. */
  function textoEntra(tl, el, t) {
    tl.fromTo(el, { y: 18, opacity: 0, clipPath: "inset(0 0 100% 0)" }, { y: 0, opacity: 1, clipPath: "inset(0 0 0% 0)", duration: 0.55, ease: "power3.out" }, t);
  }

  /** A2: a folha nova vem do fundo (em cima, à direita), girada, e pousa. Voltando, vem da frente. */
  function chegarDoFundo(tl, ctx, t0 = 0.2, { passo = 0.085, dur = 1.0 } = {}) {
    const { novas, W, H, celular } = ctx;
    const volta = ctx.sentido === "volta";
    novas.forEach((el, i) => {
      const t = t0 + i * passo;
      if (eTexto(el)) return textoEntra(tl, el, t + 0.05);
      preparar(el, ctx);
      let de;
      if (volta) {
        // de volta: a folha vem da frente (de perto do leitor) e assenta na mesa
        de = { z: 260, y: 40, rotationX: -8, opacity: 0 };
      } else {
        const z = celular ? -700 : -1600;
        const k = P / (P - z);
        de = celular
          ? { x: 0, y: (-H * 0.45) / k, z, rotationX: 22, rotationY: 0, rotationZ: -2, opacity: 0 }
          : { x: (W * 0.3) / k, y: (-H * 0.5) / k, z, rotationX: 16, rotationY: -30, rotationZ: rnd(-5, -2), opacity: 0 };
      }
      tl.fromTo(el, de, { x: 0, y: 0, z: 0, rotationX: 0, rotationY: 0, rotationZ: 0, duration: celular ? dur * 0.85 : dur, ease: "power3.out" }, t)
        .to(el, { opacity: 1, duration: 0.28, ease: "none" }, t);
    });
    return tl;
  }

  const SAIDAS = {
    /** 1. Segue em frente: a folha continua o caminho do A2, passa por perto do leitor e sai por baixo. */
    frente(tl, ctx) {
      const volta = ctx.sentido === "volta";
      [...ctx.velhas].reverse().forEach((el, i) => {
        const t = i * 0.035;
        if (eTexto(el)) return textoSai(tl, el, t);
        preparar(el, ctx);
        const para = volta
          ? { z: -900, x: ctx.celular ? 0 : ctx.W * 0.18, y: -ctx.H * 0.3, rotationX: 14, rotationY: ctx.celular ? 0 : -22, opacity: 0 }
          : { z: 420, x: ctx.celular ? 0 : -ctx.W * 0.1, y: ctx.H * 0.55, rotationX: 26, rotationY: ctx.celular ? 0 : -6, rotationZ: rnd(-6, 6), opacity: 0 };
        tl.to(el, { ...para, duration: 0.55, ease: "power2.in" }, t);
      });
      return 0.18;
    },
    /** 2. Volta para o fundo: faz o caminho do A2 ao contrário e some lá atrás, de onde as novas vêm. */
    fundo(tl, ctx) {
      [...ctx.velhas].forEach((el, i) => {
        const t = i * 0.03;
        if (eTexto(el)) return textoSai(tl, el, t);
        preparar(el, ctx);
        const z = ctx.celular ? -600 : -1300;
        tl.to(el, { z, x: ctx.celular ? 0 : -ctx.W * 0.22, y: -ctx.H * 0.2, rotationX: -10, rotationY: ctx.celular ? 0 : 26, opacity: 0, duration: 0.5, ease: "power2.in" }, t);
      });
      return 0.22;
    },
    /** 3. Cai da mesa: cada folha escorrega para baixo, com um giro pequeno, pelo peso. */
    cai(tl, ctx) {
      [...ctx.velhas].reverse().forEach((el, i) => {
        const t = i * 0.045;
        if (eTexto(el)) return textoSai(tl, el, t);
        preparar(el, ctx);
        tl.to(el, { y: ctx.H * 0.9, rotationZ: rnd(-7, 7), rotationX: -18, duration: 0.6, ease: "power2.in" }, t)
          .to(el, { opacity: 0, duration: 0.25, ease: "power1.in" }, t + 0.32);
      });
      return 0.2;
    },
    /** 4. Discreta: as folhas só se levantam e somem; as novas vêm do fundo sem girar para o lado. */
    discreta(tl, ctx) {
      [...ctx.velhas].forEach((el, i) => {
        const t = i * 0.025;
        if (eTexto(el)) return textoSai(tl, el, t);
        preparar(el, ctx);
        tl.to(el, { y: -18, z: 60, opacity: 0, duration: 0.28, ease: "power2.in" }, t);
      });
      return 0.16;
    },
  };

  /** Entrada discreta (par da saída 4): do fundo, em linha reta, sem o giro lateral do A2. */
  function chegarDiscreta(tl, ctx, t0) {
    ctx.novas.forEach((el, i) => {
      const t = t0 + i * 0.06;
      if (eTexto(el)) return textoEntra(tl, el, t);
      preparar(el, ctx);
      tl.fromTo(el, { z: -380, y: 46, rotationX: 10, opacity: 0 }, { z: 0, y: 0, rotationX: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, t);
    });
  }

  /** A troca geral: `saida` é uma das SAIDAS. */
  function geral(ctx, saida = ctx.variante || "frente") {
    const tl = gsap.timeline();
    const fn = SAIDAS[saida] || SAIDAS.frente;
    const t0 = fn(tl, ctx);
    if (saida === "discreta") chegarDiscreta(tl, ctx, t0);
    else chegarDoFundo(tl, ctx, t0);
    return tl;
  }

  window.GERAL = { geral, SAIDAS, chegarDoFundo, chegarDiscreta, preparar, textoEntra, textoSai, P };
})();
