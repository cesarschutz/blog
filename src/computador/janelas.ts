/**
 * O gerente de janelas (C8): abrir, arrastar pela barra de título, redimensionar pelas bordas e cantos,
 * minimizar com o gênio para o Dock (e restaurar por ele), ampliar com o botão verde (ou o duplo clique na
 * barra), fechar, o foco e a ordem (a janela de trás fica com os semáforos cinza) e a cascata ao abrir
 * várias.
 *
 * Cada janela é um <section> na tela do computador, em (0, 0) no layout: a posição é toda do `transform`
 * (translate3d), e arrastar só muda ele. Redimensionar muda a largura e a altura (o app se refaz por dentro),
 * a cada quadro. No celular (tela estreita), as janelas ocupam a tela entre a barra de menus e o Dock, sem
 * arrastar nem redimensionar, e minimizam para o ícone do app.
 *
 * Com movimento reduzido: sem gênio nem escala; as janelas aparecem e somem num esmaecer curto.
 */
import type { AppId, Janela, OpcoesDeJanela } from "./contexto";
import type { Dock } from "./dock";
import { caberNa, quadrosDoGenio, type Retangulo } from "./genio";

const SINAIS = {
  fechar: '<path d="M2.2 2.2l3.6 3.6M5.8 2.2 2.2 5.8"/>',
  minimizar: '<path d="M1.6 4h4.8"/>',
  ampliar: '<path d="M1.9 3.9V1.9h2M6.1 4.1v2h-2" stroke-width="1.05"/><path d="M2.1 2.1l1.6 1.6M5.9 5.9 4.3 4.3" stroke-width="1.05"/>',
};

const ALCAS = ["n", "s", "e", "w", "ne", "nw", "se", "sw"] as const;
type Alca = (typeof ALCAS)[number];

const INTERATIVO = "button, a, input, textarea, select, summary, label, [role='tab'], [role='option'], [role='treeitem'], [role='slider'], [contenteditable], [data-nao-arrasta]";

const ABRE = "cubic-bezier(0.2, 0.9, 0.3, 1.06)";
const CURVA_AMPLIA = "cubic-bezier(0.3, 0.7, 0.3, 1)";

interface Estado extends Janela {
  op: OpcoesDeJanela;
  x: number;
  y: number;
  w: number;
  h: number;
  antes?: Retangulo;
  ocupada: boolean;
  fechada: boolean;
}

export interface OpcoesDoGerente {
  tela: HTMLElement;
  dock: Dock;
  reduzido: MediaQueryList;
  estreito: MediaQueryList;
  /** A altura da barra de menus (a área das janelas começa embaixo dela). */
  barra: () => number;
  /** A janela da frente mudou (ou nenhuma ficou na frente): a barra de menus troca de app. */
  aoMudarFrente(janela: Janela | undefined): void;
  /** A última janela de um app fechou. */
  aoFecharUltima(app: AppId): void;
  nomeDoApp(app: AppId): string;
  /** Sem janela nenhuma à vista, o foco volta para a área de trabalho (nunca fica fora do computador). */
  focarMesa(): void;
}

let proximoId = 1;

export class Janelas {
  /** Da de trás para a da frente. */
  private ordem: Estado[] = [];
  private frente?: Estado;
  private cascata = new Map<AppId, { x: number; y: number; n: number }>();

  constructor(private op: OpcoesDoGerente) {
    this.ligar();
    op.estreito.addEventListener("change", () => this.reajustarTodas());
    addEventListener("resize", () => this.reajustarTodas());
  }

  get todas(): Janela[] {
    return this.ordem;
  }

  get daFrente(): Janela | undefined {
    return this.frente;
  }

  doApp(app: AppId): Janela[] {
    return this.ordem.filter((j) => j.app === app && !j.fechada);
  }

  /** A área livre: entre a barra de menus e o Dock. */
  private area(): Retangulo {
    const t = this.op.tela;
    const topo = this.op.barra();
    const dock = this.op.dock.el;
    const baseDoDock = dock.offsetTop || t.clientHeight;
    return { x: 0, y: topo, w: t.clientWidth, h: Math.max(200, baseDoDock - 8 - topo) };
  }

  // ---------- criar ----------

  criar(op: OpcoesDeJanela): Janela {
    const el = document.createElement("section");
    el.className = `mac-janela mac-janela--${op.app}${op.classe ? ` ${op.classe}` : ""}`;
    el.setAttribute("role", "group");
    el.setAttribute("aria-roledescription", "janela");
    el.setAttribute("aria-label", op.titulo);
    el.tabIndex = -1;
    if (op.fixa) el.dataset.fixa = "";
    el.style.setProperty("--sx", `${op.semaforos?.x ?? 13}px`);
    el.style.setProperty("--sy", `${op.semaforos?.y ?? 13}px`);
    el.innerHTML =
      '<div class="mac-janela-corpo"></div>' +
      `<div class="mac-semaforos" role="group" aria-label="Controles da janela">` +
      `<button type="button" class="mac-semaforo mac-semaforo--fechar" data-janela="fechar" aria-label="Fechar a janela"><svg viewBox="0 0 8 8" aria-hidden="true">${SINAIS.fechar}</svg></button>` +
      `<button type="button" class="mac-semaforo mac-semaforo--minimizar" data-janela="minimizar" aria-label="Minimizar para o Dock"><svg viewBox="0 0 8 8" aria-hidden="true">${SINAIS.minimizar}</svg></button>` +
      `<button type="button" class="mac-semaforo mac-semaforo--ampliar" data-janela="ampliar" aria-label="Ampliar a janela"${op.fixa ? " disabled" : ""}><svg viewBox="0 0 8 8" aria-hidden="true">${SINAIS.ampliar}</svg></button>` +
      "</div>" +
      (op.fixa ? "" : ALCAS.map((a) => `<div class="mac-alca mac-alca--${a}" data-alca="${a}" aria-hidden="true"></div>`).join(""));
    const corpo = el.querySelector<HTMLElement>(".mac-janela-corpo")!;
    corpo.append(op.conteudo);

    const gerente = this;
    const j: Estado = {
      id: proximoId++,
      app: op.app,
      el,
      corpo,
      titulo: op.titulo,
      minimizada: false,
      ampliada: false,
      op,
      x: 0,
      y: 0,
      w: 0,
      h: 0,
      ocupada: false,
      fechada: false,
      definirTitulo(t: string) {
        this.titulo = t;
        el.setAttribute("aria-label", t);
      },
      fechar: () => gerente.fechar(j),
      minimizar: () => gerente.minimizar(j),
      restaurar: () => gerente.restaurar(j),
      ampliar: () => gerente.ampliar(j),
      ativar: () => gerente.ativar(j),
    };
    el.dataset.janela = String(j.id);

    this.posicionarNova(j);
    this.op.tela.insertBefore(el, this.op.dock.el);
    this.ordem.push(j);
    this.aplicar(j);
    this.ativar(j);
    // O foco entra na janela nova (no lugar que o app escolhe), como no Mac.
    requestAnimationFrame(() => {
      if (!j.fechada && !j.minimizada && this.frente === j && !j.el.contains(document.activeElement)) this.focar(j);
    });
    if (!this.op.reduzido.matches) {
      // Abre crescendo de 0,6 a partir do ícone do app no Dock (a direção: 0,22s, com um nada de passada).
      const s = 0.6;
      const tela = this.op.tela.getBoundingClientRect();
      const icone = this.op.dock.retanguloDoApp(op.app);
      const ox = icone ? icone.left + icone.width / 2 - tela.left - j.x : j.w / 2;
      const oy = icone ? icone.top - tela.top - j.y : j.h / 2;
      const de = `translate3d(${j.x + (1 - s) * ox}px, ${j.y + (1 - s) * oy}px, 0) scale(${s})`;
      el.animate([{ opacity: 0, transform: de }, { opacity: 1, offset: 0.55 }, { opacity: 1, transform: this.base(j) }], { duration: 240, easing: ABRE });
    }
    return j;
  }

  /** Onde a janela nova abre: centrada na primeira vez, e em cascata (24px para baixo e para a direita) depois. */
  private posicionarNova(j: Estado) {
    const a = this.area();
    if (this.op.estreito.matches) {
      Object.assign(j, { x: 0, y: a.y, w: a.w, h: a.h });
      return;
    }
    j.w = Math.round(Math.min(j.op.largura, a.w - 32));
    j.h = Math.round(Math.min(j.op.altura, a.h - 16));
    const anterior = this.cascata.get(j.app);
    const abertas = this.doApp(j.app).filter((o) => !o.minimizada);
    let x: number;
    let y: number;
    let n = 0;
    if (anterior && abertas.length) {
      n = anterior.n + 1;
      x = anterior.x + 24;
      y = anterior.y + 24;
      if (x + j.w > a.w - 8 || y + j.h > a.y + a.h) {
        n = 0;
        x = Math.max(8, (a.w - j.w) / 2 - 60);
        y = a.y + 10;
      }
    } else {
      // A primeira janela do app: no meio, um degrau abaixo e à direita de cada janela de outro app à vista
      // (para não cobrir uma janela inteira com outra).
      const outras = this.ordem.filter((o) => !o.fechada && !o.minimizada && o.app !== j.app).length;
      const passo = Math.min(outras, 4) * 28;
      x = Math.min((a.w - j.w) / 2 + passo, a.w - j.w - 8);
      y = Math.min(a.y + Math.max(8, (a.h - j.h) * 0.32) + passo, a.y + Math.max(8, a.h - j.h));
    }
    j.x = Math.round(x);
    j.y = Math.round(y);
    this.cascata.set(j.app, { x: j.x, y: j.y, n });
  }

  private base(j: Estado) {
    return `translate3d(${j.x}px, ${j.y}px, 0)`;
  }

  private aplicar(j: Estado) {
    j.el.style.width = `${j.w}px`;
    j.el.style.height = `${j.h}px`;
    if (!j.minimizada) j.el.style.transform = this.base(j);
  }

  // ---------- foco e ordem ----------

  ativar(j: Estado | undefined) {
    if (j && (j.minimizada || j.fechada)) return;
    if (j) {
      this.ordem = [...this.ordem.filter((o) => o !== j), j];
      this.ordem.forEach((o, i) => (o.el.style.zIndex = String(10 + i)));
    }
    if (this.frente === j) return;
    const antes = this.frente;
    this.frente = j;
    if (antes && !antes.fechada) {
      antes.el.removeAttribute("data-ativa");
      antes.op.aoAtivar?.(false);
    }
    if (j) {
      j.el.setAttribute("data-ativa", "");
      j.op.aoAtivar?.(true);
    }
    this.op.aoMudarFrente(j);
  }

  /** Nenhuma janela na frente (o clique na área de trabalho): os semáforos de todas ficam cinza. */
  desativar() {
    this.ativar(undefined);
  }

  /** A janela de cima que está à vista (para quando a da frente fecha ou minimiza). */
  private proximaDaFrente(): Estado | undefined {
    return [...this.ordem].reverse().find((o) => !o.minimizada && !o.fechada);
  }

  /** Põe o foco dentro da janela (no lugar que o app escolhe, ou nela mesma). */
  focar(j: Janela) {
    const e = j as Estado;
    if (e.op.focar) e.op.focar();
    else e.el.focus({ preventScroll: true });
  }

  // ---------- fechar ----------

  async fechar(j: Estado) {
    if (j.fechada) return;
    j.fechada = true;
    // Sem `inert` aqui: numa janela grande (o Código com o java-25), ele recalcularia o estilo de milhares
    // de nós no primeiro quadro da animação. A janela só para de receber o ponteiro e sai do DOM no fim.
    j.el.style.pointerEvents = "none";
    const eraFrente = this.frente === j;
    if (!this.op.reduzido.matches && !j.minimizada) {
      const s = 0.92;
      const para = `translate3d(${j.x + (j.w * (1 - s)) / 2}px, ${j.y + (j.h * (1 - s)) / 2}px, 0) scale(${s})`;
      await j.el
        .animate([{ opacity: 1, transform: this.base(j) }, { opacity: 0, transform: para }], { duration: 160, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "forwards" })
        .finished.catch(() => {});
    }
    if (j.minimizada) this.op.dock.removerMiniatura(String(j.id));
    j.el.remove();
    this.ordem = this.ordem.filter((o) => o !== j);
    j.op.aoFechar?.();
    if (eraFrente) {
      this.frente = undefined;
      const outra = this.proximaDaFrente();
      this.ativar(outra);
      if (outra) this.focar(outra);
      else this.op.aoMudarFrente(undefined);
    }
    if (!this.op.tela.contains(document.activeElement)) this.op.focarMesa();
    if (!this.doApp(j.app).length) this.op.aoFecharUltima(j.app);
  }

  // ---------- minimizar e restaurar (o gênio) ----------

  async minimizar(j: Estado) {
    if (j.minimizada || j.ocupada || j.fechada) return;
    j.ocupada = true;
    j.minimizada = true;
    // O foco sai da janela já (para a próxima ou para a mesa, logo abaixo); o `inert` só entra no fim do
    // gênio, para o recálculo de estilo de uma janela grande não pesar no primeiro quadro.
    const tinhaFoco = j.el.contains(document.activeElement);
    const noIcone = this.op.estreito.matches;
    const vaga = noIcone ? this.op.dock.retanguloDoApp(j.app) : this.op.dock.adicionarMiniatura(String(j.id), j.titulo, j.app);
    // A janela que sai deixa de ser a da frente já (a barra de menus troca), mas o visual de inativa (os
    // semáforos cinza) só entra no fim do gênio, junto com o `inert`: num conteúdo grande, cada troca de
    // estilo da janela é um recálculo caro, e no gênio ninguém vê os semáforos.
    const eraFrente = this.frente === j;
    if (eraFrente) {
      this.frente = undefined;
      this.ativar(this.proximaDaFrente());
      if (!this.frente) this.op.aoMudarFrente(undefined);
    }
    if (tinhaFoco) {
      if (this.frente) this.focar(this.frente);
      else this.op.focarMesa();
    }
    const tela = this.op.tela.getBoundingClientRect();
    const caixa: Retangulo = vaga ? { x: vaga.left - tela.left, y: vaga.top - tela.top, w: vaga.width, h: vaga.height } : { x: j.x + j.w / 2, y: tela.height, w: 1, h: 1 };
    const mini = noIcone ? { x: caixa.x + caixa.w * 0.2, y: caixa.y + caixa.h * 0.3, w: caixa.w * 0.6, h: caixa.h * 0.5 } : caberNa(j, caixa);
    j.el.classList.add("no-genio");
    // A miniatura fica por cima do vidro do Dock e embaixo dos botões dele.
    j.el.style.zIndex = "9001";
    if (!this.op.reduzido.matches) {
      const genio = j.el.animate(quadrosDoGenio(j, mini, 1, 0), { duration: 520, easing: "cubic-bezier(0.45, 0, 0.35, 1)", fill: "forwards" });
      await genio.finished.catch(() => {});
      j.el.style.transform = this.transformDaMiniatura(j, mini);
      genio.cancel();
    } else {
      j.el.style.transform = this.transformDaMiniatura(j, mini);
    }
    j.el.classList.remove("no-genio");
    j.el.classList.add(noIcone ? "escondida" : "minimizada");
    j.el.inert = true;
    if (eraFrente) {
      j.el.removeAttribute("data-ativa");
      j.op.aoAtivar?.(false);
    }
    j.ocupada = false;
    if (!this.op.tela.contains(document.activeElement) || j.el.contains(document.activeElement)) {
      if (this.frente) this.focar(this.frente);
      else this.op.focarMesa();
    }
  }

  private transformDaMiniatura(j: Estado, m: Retangulo) {
    return `translate3d(${m.x.toFixed(2)}px, ${m.y.toFixed(2)}px, 0) scale(${(m.w / j.w).toFixed(5)})`;
  }

  /** O Dock se mexeu (ampliação, FLIP): cada miniatura vai para cima da vaga dela. */
  acompanharMiniaturas() {
    const tela = this.op.tela.getBoundingClientRect();
    for (const j of this.ordem) {
      if (!j.minimizada || j.ocupada || !j.el.classList.contains("minimizada")) continue;
      const r = this.op.dock.retanguloVisivel(String(j.id));
      if (!r) continue;
      const mini = caberNa(j, { x: r.left - tela.left, y: r.top - tela.top, w: r.width, h: r.height });
      j.el.style.transform = this.transformDaMiniatura(j, mini);
    }
  }

  async restaurar(j: Estado) {
    if (!j.minimizada || j.ocupada || j.fechada) return;
    j.ocupada = true;
    const noIcone = j.el.classList.contains("escondida");
    const tela = this.op.tela.getBoundingClientRect();
    let mini: Retangulo;
    if (noIcone) {
      const r = this.op.dock.retanguloDoApp(j.app);
      const c = r ? { x: r.left - tela.left, y: r.top - tela.top, w: r.width, h: r.height } : { x: j.x, y: tela.height, w: 1, h: 1 };
      mini = { x: c.x + c.w * 0.2, y: c.y + c.h * 0.3, w: c.w * 0.6, h: c.h * 0.5 };
    } else {
      const r = this.op.dock.retanguloVisivel(String(j.id));
      mini = r ? caberNa(j, { x: r.left - tela.left, y: r.top - tela.top, w: r.width, h: r.height }) : { x: j.x, y: tela.height, w: j.w * 0.05, h: j.h * 0.05 };
      this.op.dock.removerMiniatura(String(j.id));
    }
    j.el.classList.remove("minimizada", "escondida");
    j.el.classList.add("no-genio");
    j.minimizada = false;
    this.ativar(j);
    j.el.style.zIndex = "9001";
    if (this.estreitoMudou(j)) this.posicionarNova(j);
    this.aplicar(j);
    if (!this.op.reduzido.matches) {
      j.el.style.transform = this.transformDaMiniatura(j, mini);
      const genio = j.el.animate(quadrosDoGenio(j, mini, 0, 1), { duration: 500, easing: "cubic-bezier(0.45, 0, 0.35, 1)" });
      await genio.finished.catch(() => {});
    }
    // O `inert` sai só agora, com a janela parada (numa janela grande, ele recalcula o estilo de milhares
    // de nós): durante o gênio, ela já não recebe o ponteiro (.no-genio).
    j.el.inert = false;
    j.el.style.transform = this.base(j);
    j.el.classList.remove("no-genio");
    this.ordem.forEach((o, i) => (o.minimizada ? null : (o.el.style.zIndex = String(10 + i))));
    j.ocupada = false;
    this.focar(j);
  }

  private estreitoMudou(j: Estado) {
    const a = this.area();
    return this.op.estreito.matches ? j.w !== a.w || j.h !== a.h : false;
  }

  // ---------- ampliar ----------

  ampliar(j: Estado) {
    if (j.op.fixa || j.minimizada || j.fechada || this.op.estreito.matches) return;
    const antes = { x: j.x, y: j.y, w: j.w, h: j.h };
    if (j.ampliada && j.antes) {
      Object.assign(j, j.antes);
      j.ampliada = false;
    } else {
      j.antes = antes;
      const a = this.area();
      Object.assign(j, { x: 0, y: a.y, w: a.w, h: a.h + 8 - 4 });
      j.ampliada = true;
    }
    this.aplicar(j);
    j.el.querySelector(".mac-semaforo--ampliar")?.setAttribute("aria-label", j.ampliada ? "Voltar ao tamanho de antes" : "Ampliar a janela");
    j.el.toggleAttribute("data-ampliada", j.ampliada);
    if (!this.op.reduzido.matches) {
      j.el.animate(
        [
          { transform: `translate3d(${antes.x}px, ${antes.y}px, 0) scale(${antes.w / j.w}, ${antes.h / j.h})` },
          { transform: this.base(j) },
        ],
        { duration: 250, easing: CURVA_AMPLIA },
      );
    }
    j.op.aoMudarTamanho?.();
  }

  // ---------- arrastar e redimensionar ----------

  private ligar() {
    const tela = this.op.tela;

    // O toque em qualquer ponto traz a janela à frente.
    tela.addEventListener(
      "pointerdown",
      (e) => {
        const el = (e.target as Element).closest<HTMLElement>(".mac-janela");
        const j = el && this.ordem.find((o) => o.el === el);
        if (!j || j.minimizada) return;
        this.ativar(j);
        // Clique num lugar que não recebe foco (a barra de título, o fundo): o foco vem para a janela.
        if (!(e.target as Element).closest("button, a, input, textarea, select, [tabindex]:not([tabindex='-1'])") && !j.el.contains(document.activeElement)) {
          requestAnimationFrame(() => j.el.focus({ preventScroll: true }));
        }
      },
      { capture: true },
    );

    tela.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      const alvo = e.target as Element;
      const alca = alvo.closest<HTMLElement>("[data-alca]");
      const el = alvo.closest<HTMLElement>(".mac-janela");
      const j = el && this.ordem.find((o) => o.el === el);
      if (!j || j.minimizada || j.ocupada) return;
      if (alca) return this.redimensionar(j, alca.dataset.alca as Alca, e);
      if (alvo.closest("[data-arrastar]") && !alvo.closest(INTERATIVO)) this.arrastar(j, e);
    });

    tela.addEventListener("dblclick", (e) => {
      const alvo = e.target as Element;
      if (!alvo.closest("[data-arrastar]") || alvo.closest(INTERATIVO)) return;
      const el = alvo.closest<HTMLElement>(".mac-janela");
      const j = el && this.ordem.find((o) => o.el === el);
      if (j) this.ampliar(j);
    });

    tela.addEventListener("click", (e) => {
      const botao = (e.target as Element).closest<HTMLElement>("[data-janela]");
      if (!botao) return;
      const el = botao.closest<HTMLElement>(".mac-janela");
      const j = el && this.ordem.find((o) => o.el === el);
      if (!j) return;
      const acao = botao.dataset.janela;
      if (acao === "fechar") void this.fechar(j);
      else if (acao === "minimizar") void this.minimizar(j);
      else if (acao === "ampliar") this.ampliar(j);
    });
  }

  private arrastar(j: Estado, e: PointerEvent) {
    if (this.op.estreito.matches) return;
    e.preventDefault();
    const alvo = e.target as HTMLElement;
    try {
      alvo.setPointerCapture(e.pointerId);
    } catch {}
    const x0 = j.x;
    const y0 = j.y;
    const px = e.clientX;
    const py = e.clientY;
    let quadro = 0;
    let movido = false;
    const mover = (ev: PointerEvent) => {
      if (ev.pointerId !== e.pointerId) return;
      const dx = ev.clientX - px;
      const dy = ev.clientY - py;
      if (!movido && Math.hypot(dx, dy) < 3) return;
      if (!movido) {
        movido = true;
        j.el.classList.add("arrastando");
      }
      const t = this.op.tela;
      j.x = Math.round(Math.min(t.clientWidth - 80, Math.max(80 - j.w, x0 + dx)));
      j.y = Math.round(Math.min(t.clientHeight - 36, Math.max(this.op.barra(), y0 + dy)));
      if (!quadro)
        quadro = requestAnimationFrame(() => {
          quadro = 0;
          j.el.style.transform = this.base(j);
        });
    };
    const soltar = (ev: PointerEvent) => {
      if (ev.pointerId !== e.pointerId) return;
      alvo.removeEventListener("pointermove", mover);
      alvo.removeEventListener("pointerup", soltar);
      alvo.removeEventListener("pointercancel", soltar);
      if (quadro) cancelAnimationFrame(quadro);
      j.el.style.transform = this.base(j);
      j.el.classList.remove("arrastando");
      if (movido && j.ampliada) {
        j.ampliada = false;
        j.el.removeAttribute("data-ampliada");
      }
    };
    alvo.addEventListener("pointermove", mover);
    alvo.addEventListener("pointerup", soltar);
    alvo.addEventListener("pointercancel", soltar);
  }

  private redimensionar(j: Estado, alca: Alca, e: PointerEvent) {
    if (this.op.estreito.matches) return;
    e.preventDefault();
    const alvo = e.target as HTMLElement;
    try {
      alvo.setPointerCapture(e.pointerId);
    } catch {}
    const r0 = { x: j.x, y: j.y, w: j.w, h: j.h };
    const px = e.clientX;
    const py = e.clientY;
    const minW = j.op.minLargura ?? 480;
    const minH = j.op.minAltura ?? 320;
    const t = this.op.tela;
    let quadro = 0;
    j.el.classList.add("redimensionando");
    const mover = (ev: PointerEvent) => {
      if (ev.pointerId !== e.pointerId) return;
      const dx = ev.clientX - px;
      const dy = ev.clientY - py;
      let { x, y, w, h } = r0;
      if (alca.includes("e")) w = Math.max(minW, Math.min(t.clientWidth - x, r0.w + dx));
      if (alca.includes("s")) h = Math.max(minH, Math.min(t.clientHeight - y, r0.h + dy));
      if (alca.includes("w")) {
        w = Math.max(minW, r0.w - dx);
        x = r0.x + r0.w - w;
      }
      if (alca.includes("n")) {
        const topo = Math.max(this.op.barra(), r0.y + dy);
        h = Math.max(minH, r0.y + r0.h - topo);
        y = r0.y + r0.h - h;
      }
      Object.assign(j, { x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h) });
      if (!quadro)
        quadro = requestAnimationFrame(() => {
          quadro = 0;
          this.aplicar(j);
        });
    };
    const soltar = (ev: PointerEvent) => {
      if (ev.pointerId !== e.pointerId) return;
      alvo.removeEventListener("pointermove", mover);
      alvo.removeEventListener("pointerup", soltar);
      alvo.removeEventListener("pointercancel", soltar);
      if (quadro) cancelAnimationFrame(quadro);
      this.aplicar(j);
      j.el.classList.remove("redimensionando");
      if (j.ampliada) {
        j.ampliada = false;
        j.el.removeAttribute("data-ampliada");
      }
      j.op.aoMudarTamanho?.();
    };
    alvo.addEventListener("pointermove", mover);
    alvo.addEventListener("pointerup", soltar);
    alvo.addEventListener("pointercancel", soltar);
  }

  /** A tela mudou de tamanho (ou passou a ser de celular): cada janela volta para dentro dela. */
  private reajustarTodas() {
    const a = this.area();
    for (const j of this.ordem) {
      if (j.fechada) continue;
      if (this.op.estreito.matches) {
        Object.assign(j, { x: 0, y: a.y, w: a.w, h: a.h });
      } else {
        if (j.ampliada) Object.assign(j, { x: 0, y: a.y, w: a.w, h: a.h + 4 });
        // A tela encolheu: a janela cabe nela de novo (menor, se preciso) e volta para dentro.
        j.w = Math.max(Math.min(j.w, a.w), Math.min(j.op.minLargura ?? 480, a.w));
        j.h = Math.max(Math.min(j.h, a.h + 4), Math.min(j.op.minAltura ?? 320, a.h));
        j.x = Math.max(0, Math.min(j.x, a.w - j.w));
        j.y = Math.max(a.y, Math.min(j.y, a.y + a.h + 4 - j.h));
      }
      if (j.minimizada) {
        j.el.style.width = `${j.w}px`;
        j.el.style.height = `${j.h}px`;
      } else this.aplicar(j);
      j.op.aoMudarTamanho?.();
    }
    this.op.dock.medir();
  }
}
