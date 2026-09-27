/*
 * A entrada direta numa tela que não é a home (a sugestão do protótipo 02, "vai para o cabeçalho"),
 * para os protótipos que mostram como uma tela chega quando a pessoa entra por ela: o caderno "cs"
 * carrega com a caneta, abre e fecha, e pousa na marca do cabeçalho. Quem chama decide como as folhas
 * da tela chegam (o `chegar(tl, t)` recebe a timeline e o instante em que o papel começa a sair).
 */
(() => {
  const CSS = `
  .abertura-c { position: absolute; inset: 0; z-index: 40; pointer-events: none; display: none; }
  .janela.abrindo-c .abertura-c { display: block; }
  .janela.abrindo-c .pagina { overflow: hidden; }
  .janela.abrindo-c .site-topo .marca .mc { visibility: hidden; }
  .abertura-c .papel { position: absolute; inset: 0; background: var(--paper); }
  .abertura-c .caderno { position: absolute; left: 0; top: 0; width: 84px; height: 109px; perspective: 520px; }
  .abertura-c .contra, .abertura-c .miolo-c, .abertura-c .capa-c { position: absolute; inset: 0; border-radius: 3px 5px 5px 3px; }
  .abertura-c .contra { background: var(--marca); filter: brightness(.82); box-shadow: 0 14px 22px -12px rgb(0 0 0 / .45); }
  .abertura-c .miolo-c { inset: 4px 3px 4px 6px; background: var(--livro-papel); border-radius: 1px 3px 3px 1px; display: grid; align-content: start; gap: 7px; padding: 16px 12px; }
  .abertura-c .miolo-c i { height: 1px; background: color-mix(in oklab, var(--livro-tinta) 22%, transparent); }
  .abertura-c .capa-c { transform-origin: 0 50%; transform-style: preserve-3d; }
  .abertura-c .frente, .abertura-c .verso { position: absolute; inset: 0; backface-visibility: hidden; border-radius: inherit; overflow: hidden; }
  .abertura-c .frente .mc { width: 100%; height: 100%; }
  .abertura-c .verso { transform: rotateY(180deg); background: color-mix(in oklab, var(--marca) 50%, var(--livro-papel)); }
  .abertura-c .barra { position: absolute; left: 0; top: 0; height: 1.4px; background: var(--ink); transform-origin: 0 50%; }
  .abertura-c .conta { position: absolute; left: 0; right: 0; margin: 0; text-align: center; font: 500 12.5px/1 var(--f-codigo); color: var(--ink-2); font-variant-numeric: tabular-nums; }`;
  document.head.insertAdjacentHTML("beforeend", `<style>${CSS}</style>`);

  let ov, papel, caderno, capa, barra, conta;
  function montar() {
    if (ov) return;
    const j = SITE.janela;
    j.insertAdjacentHTML("beforeend", `<div class="abertura-c" aria-hidden="true"><div class="papel"></div>
      <div class="caderno"><div class="contra"></div><div class="miolo-c"><i></i><i></i><i></i><i></i></div>
      <div class="capa-c"><div class="frente">${SITE.pecas.marcaSvg("mc")}</div><div class="verso"></div></div></div>
      <div class="barra"></div><p class="conta">0</p></div>`);
    ov = j.querySelector(".abertura-c");
    papel = ov.querySelector(".papel"); caderno = ov.querySelector(".caderno"); capa = ov.querySelector(".capa-c");
    barra = ov.querySelector(".barra"); conta = ov.querySelector(".conta");
  }
  function caixaJ(el) {
    const r = el.getBoundingClientRect(), j = SITE.janela.getBoundingClientRect();
    return { x: r.left - j.left, y: r.top - j.top, w: r.width, h: r.height, cx: r.left - j.left + r.width / 2, cy: r.top - j.top + r.height / 2 };
  }
  function limpar() {
    if (!ov) return;
    SITE.janela.classList.remove("abrindo-c");
    gsap.set([papel, caderno, capa, barra, conta], { clearProps: "all" });
  }

  /** Toca a entrada; `chegar(tl, t)` põe na timeline a chegada das folhas da tela. Devolve a timeline. */
  function tocar(chegar) {
    montar();
    limpar();
    const j = SITE.janela;
    j.classList.add("abrindo-c");
    const W = j.clientWidth, H = j.clientHeight;
    const cw = 84, ch = 109, cx = W / 2, cy = H * 0.42;
    const w = Math.min(240, W * 0.6);
    gsap.set(caderno, { x: cx - cw / 2, y: cy - ch / 2, opacity: 0, scale: 0.92 });
    gsap.set(barra, { left: cx - w / 2, top: cy + ch / 2 + 34, width: w, scaleX: 0 });
    gsap.set(conta, { top: cy + ch / 2 + 52 });
    const n = { v: 0 };
    const tl = gsap.timeline({ onComplete: limpar });
    tl.to(caderno, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }, 0)
      .to(n, { v: 100, duration: 0.8, ease: "power1.inOut", onUpdate: () => (conta.textContent = Math.round(n.v)) }, 0.15)
      .to(barra, { scaleX: 1, duration: 0.8, ease: "power1.inOut" }, 0.15)
      .to(capa, { rotationY: -150, duration: 0.4, ease: "power2.out" }, 1.0)
      .to(capa, { rotationY: 0, duration: 0.32, ease: "power2.in" }, 1.45)
      .to([barra, conta], { opacity: 0, duration: 0.2 }, 1.2);
    const t3 = 1.85;
    const ra = caixaJ(j.querySelector(".site-topo .marca .mc"));
    tl.to(caderno, { x: ra.cx - cw / 2, y: ra.cy - ch / 2, scale: ra.w / cw, duration: 0.65, ease: "power3.inOut" }, t3)
      .to(papel, { opacity: 0, duration: 0.4, ease: "power1.inOut" }, t3 + 0.1)
      .call(() => j.classList.remove("abrindo-c"), null, t3 + 0.65)
      .set(caderno, { opacity: 0 }, t3 + 0.65);
    chegar(tl, t3 + 0.2);
    return tl;
  }

  window.CADERNO = { tocar, limpar };
})();
