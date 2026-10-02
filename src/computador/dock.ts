/**
 * O Dock (C2, C8): o vidro flutuante embaixo, com os apps fixos (Finder, Editor, Terminal), os abertos que
 * não são fixos (a Pré-Visualização), o separador, as janelas minimizadas (miniaturas vivas) e a Lixeira.
 *
 * - Ampliação no hover (só com mouse): cada ícone cresce pela distância ao ponteiro (curva de cosseno, pico
 *   de 1,5×, como a direção pede: 48px vão a 72px) e os vizinhos abrem espaço, tudo com `transform` (escala e translação). O vidro acompanha com
 *   `scaleX`, com o raio corrigido para os cantos não esticarem. O laço de quadros só roda enquanto há
 *   movimento e para quando assenta.
 * - O ponto embaixo do app aberto e o pulo ao abrir (translateY, dois saltos).
 * - Entrar e sair um ícone (um app que abre, uma janela que minimiza) é FLIP: os outros deslizam até o lugar
 *   novo e o vidro estica ou encolhe junto, em 0,32s.
 * - Teclado: uma parada só no Tab (role="toolbar"), setas para andar, Enter ou Espaço para abrir.
 *
 * As miniaturas das janelas minimizadas são as próprias janelas, encolhidas por cima da vaga delas (o
 * gerente de janelas as posiciona a cada quadro, por `aoMover`). Por isso o Dock não cria um contexto de
 * empilhamento: o vidro fica embaixo das miniaturas, e os botões, em cima.
 */
import type { AppId } from "./contexto";
import { iconeDoApp, LIXEIRA } from "./icones";

interface Item {
  tipo: "app" | "janela" | "lixeira";
  chave: string;
  el: HTMLElement;
  botao: HTMLButtonElement;
  ponto?: HTMLElement;
  escala: number;
  rotulo: string;
}

const MAXIMO = 1.5;
const CURVA_FLIP = "cubic-bezier(0.25, 0.8, 0.25, 1)";

export interface OpcoesDoDock {
  tela: HTMLElement;
  reduzido: MediaQueryList;
  /** Clique (ou Enter) num app, numa miniatura ou na Lixeira. */
  aoEscolher(tipo: Item["tipo"], chave: string): void;
  /** A cada quadro em que o Dock se mexe: as miniaturas acompanham as vagas. */
  aoMover(): void;
}

export class Dock {
  readonly el: HTMLElement;
  private fundo: HTMLElement;
  private faixa: HTMLElement;
  private separador: HTMLElement;
  private rotulo: HTMLElement;
  private itens: Item[] = [];
  private px = 0;
  private dentro = false;
  private quadro = 0;
  private flipAte = 0;
  private sobre?: Item;
  private ampliavel = matchMedia("(hover: hover) and (pointer: fine)");

  constructor(private op: OpcoesDoDock) {
    this.el = document.createElement("div");
    this.el.className = "mac-dock";
    this.el.setAttribute("role", "toolbar");
    this.el.setAttribute("aria-label", "Dock");
    this.el.innerHTML = '<div class="mac-dock-fundo" aria-hidden="true"></div><div class="mac-dock-faixa"></div><div class="mac-dock-rotulo" aria-hidden="true"></div>';
    this.fundo = this.el.querySelector(".mac-dock-fundo")!;
    this.faixa = this.el.querySelector(".mac-dock-faixa")!;
    this.rotulo = this.el.querySelector(".mac-dock-rotulo")!;
    this.separador = document.createElement("div");
    this.separador.className = "mac-dock-separador";
    this.separador.setAttribute("aria-hidden", "true");
    this.faixa.append(this.separador);
    this.lixeira();
    this.ligar();
  }

  // ---------- os itens ----------

  private novoItem(tipo: Item["tipo"], chave: string, rotulo: string, conteudo: string): Item {
    const el = document.createElement("div");
    el.className = `mac-dock-item mac-dock-item--${tipo}`;
    el.innerHTML =
      `<button type="button" class="mac-dock-botao" tabindex="-1"><span class="mac-dock-pulo">${conteudo}</span></button>` +
      (tipo === "app" ? '<span class="mac-dock-ponto" aria-hidden="true"></span>' : "");
    const botao = el.querySelector<HTMLButtonElement>(".mac-dock-botao")!;
    botao.setAttribute("aria-label", rotulo);
    botao.dataset.tipo = tipo;
    botao.dataset.chave = chave;
    const item: Item = { tipo, chave, el, botao, ponto: el.querySelector<HTMLElement>(".mac-dock-ponto") ?? undefined, escala: 1, rotulo };
    return item;
  }

  private lixeira() {
    const item = this.novoItem("lixeira", "lixeira", "Lixeira", LIXEIRA);
    this.faixa.append(item.el);
    this.itens.push(item);
    this.tabParaOPrimeiro();
  }

  /** Os apps fixos, na ordem, antes do separador (uma vez, ao montar). */
  fixar(apps: { id: AppId; nome: string }[]) {
    for (const a of apps) {
      const item = this.novoItem("app", a.id, a.nome, iconeDoApp(a.id));
      item.el.dataset.fixo = "";
      this.faixa.insertBefore(item.el, this.separador);
      this.itens.splice(this.indiceDoSeparador(), 0, item);
    }
    this.tabParaOPrimeiro();
  }

  private indiceDoSeparador() {
    return this.itens.findIndex((i) => i.tipo !== "app");
  }

  private doApp(app: AppId) {
    return this.itens.find((i) => i.tipo === "app" && i.chave === app);
  }

  /** O app abriu (o ponto acende; se não é fixo, ele entra no Dock) ou fechou. */
  marcarAberto(app: AppId, nome: string, aberto: boolean) {
    let item = this.doApp(app);
    if (aberto && !item) {
      const novo = this.novoItem("app", app, nome, iconeDoApp(app));
      this.mudar(() => {
        this.faixa.insertBefore(novo.el, this.separador);
        this.itens.splice(this.indiceDoSeparador(), 0, novo);
      }, novo);
      item = novo;
    }
    if (!item) return;
    item.el.toggleAttribute("data-aberto", aberto);
    item.botao.setAttribute("aria-label", aberto ? `${nome}, aberto` : nome);
    if (!aberto && !item.el.hasAttribute("data-fixo")) {
      const sai = item;
      void this.tirar(sai);
    }
  }

  /** O pulo do ícone ao abrir: dois saltos, o primeiro mais alto. */
  pular(app: AppId) {
    const item = this.doApp(app);
    if (!item || this.op.reduzido.matches) return;
    const pulo = item.el.querySelector<HTMLElement>(".mac-dock-pulo")!;
    if (pulo.getAnimations().length) return;
    const h = item.botao.offsetHeight;
    pulo.animate(
      [
        { transform: "translateY(0)", easing: "cubic-bezier(0.2, 0.7, 0.35, 1)" },
        { transform: `translateY(${-h * 0.46}px)`, easing: "cubic-bezier(0.55, 0, 0.8, 0.35)", offset: 0.32 },
        { transform: "translateY(0)", easing: "cubic-bezier(0.2, 0.7, 0.35, 1)", offset: 0.62 },
        { transform: `translateY(${-h * 0.18}px)`, easing: "cubic-bezier(0.55, 0, 0.8, 0.35)", offset: 0.8 },
        { transform: "translateY(0)" },
      ],
      { duration: 860 },
    );
  }

  /** Uma vaga nova para a janela minimizada; devolve o retângulo do ícone (coordenadas da tela). */
  adicionarMiniatura(chave: string, rotulo: string, icone: AppId): DOMRect {
    const item = this.novoItem("janela", chave, rotulo, `<span class="mac-dock-vaga"></span>${iconeDoApp(icone, "mac-dock-selo")}`);
    const lixo = this.itens.find((i) => i.tipo === "lixeira")!;
    this.mudar(() => {
      this.faixa.insertBefore(item.el, lixo.el);
      this.itens.splice(this.itens.indexOf(lixo), 0, item);
    }, item);
    return this.retanguloDaVaga(chave)!;
  }

  removerMiniatura(chave: string) {
    const item = this.itens.find((i) => i.tipo === "janela" && i.chave === chave);
    if (item) void this.tirar(item, true);
  }

  /** O retângulo do botão da vaga sem o FLIP nem a ampliação (o lugar final), na tela. */
  retanguloDaVaga(chave: string): DOMRect | undefined {
    const item = this.itens.find((i) => i.tipo === "janela" && i.chave === chave);
    return item ? this.retanguloEmRepouso(item) : undefined;
  }

  retanguloDoApp(app: AppId): DOMRect | undefined {
    const item = this.doApp(app);
    return item ? this.retanguloEmRepouso(item) : undefined;
  }

  /** O retângulo do botão como está na tela agora (com a ampliação e o FLIP): onde a miniatura deve estar. */
  retanguloVisivel(chave: string): DOMRect | undefined {
    const item = this.itens.find((i) => i.tipo === "janela" && i.chave === chave);
    return item?.botao.getBoundingClientRect();
  }

  private retanguloEmRepouso(item: Item): DOMRect {
    const tela = this.op.tela.getBoundingClientRect();
    let x = 0;
    let y = 0;
    for (let n: HTMLElement | null = item.botao; n && n !== this.op.tela; n = n.offsetParent as HTMLElement | null) {
      x += n.offsetLeft;
      y += n.offsetTop;
    }
    return new DOMRect(x + tela.left, y + tela.top, item.botao.offsetWidth, item.botao.offsetHeight);
  }

  /** Tira um item com a animação de saída e o FLIP dos outros. */
  private async tirar(item: Item, rapido = false) {
    if (item.el.dataset.saindo !== undefined) return;
    item.el.dataset.saindo = "";
    if (!this.op.reduzido.matches) {
      await item.el
        .animate([{ opacity: 1, transform: "scale(1)" }, { opacity: 0, transform: "scale(0.4)" }], { duration: rapido ? 140 : 200, easing: "ease-in", fill: "forwards" })
        .finished.catch(() => {});
    }
    this.mudar(() => {
      item.el.remove();
      this.itens = this.itens.filter((i) => i !== item);
    });
    if (this.sobre === item) this.sobre = undefined;
    this.tabParaOPrimeiro();
  }

  /** FLIP: mede antes, muda, mede depois e anima os itens e o vidro do lugar velho para o novo. */
  private mudar(alterar: () => void, novo?: Item) {
    const antes = new Map(this.itens.map((i) => [i.el, i.el.getBoundingClientRect().left]));
    const largura = this.el.offsetWidth;
    alterar();
    this.centros = undefined;
    const depois = this.el.offsetWidth;
    if (this.op.reduzido.matches) return this.agendar();
    for (const i of this.itens) {
      if (i === novo) continue;
      const x = antes.get(i.el);
      if (x === undefined) continue;
      const dx = x - i.el.getBoundingClientRect().left;
      if (Math.abs(dx) > 0.5) i.el.animate([{ transform: `translateX(${dx}px)` }, { transform: "translateX(0)" }], { duration: 320, easing: CURVA_FLIP });
    }
    if (novo) {
      novo.el.animate([{ opacity: 0, transform: "scale(0.3)" }, { opacity: 1, transform: "scale(1)" }], { duration: 320, easing: CURVA_FLIP });
    }
    if (largura && depois && Math.abs(largura - depois) > 0.5) {
      const r = this.raio();
      const s = largura / depois;
      this.fundo.animate(
        [
          { transform: `scaleX(${s})`, borderRadius: `${r / s}px / ${r}px` },
          { transform: "scaleX(1)", borderRadius: `${r}px / ${r}px` },
        ],
        { duration: 320, easing: CURVA_FLIP },
      );
    }
    this.flipAte = performance.now() + 360;
    this.agendar();
  }

  private r = 0;
  private centros?: number[];

  /** O raio do vidro (lido uma vez por tamanho de tela: ele muda com o tamanho dos ícones). */
  private raio() {
    if (!this.r) this.r = parseFloat(getComputedStyle(this.fundo).borderTopLeftRadius) || 22;
    return this.r;
  }

  // ---------- a ampliação ----------

  private ligar() {
    this.el.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse" || !this.ampliavel.matches || this.op.reduzido.matches) return;
      this.px = e.clientX;
      this.dentro = true;
      this.marcarSobre(e.target as Element);
      this.agendar();
    });
    this.el.addEventListener("pointerleave", () => {
      this.dentro = false;
      this.marcarSobre(null);
      this.agendar();
    });

    this.el.addEventListener("click", (e) => {
      const botao = (e.target as Element).closest<HTMLButtonElement>(".mac-dock-botao");
      if (!botao) return;
      this.op.aoEscolher(botao.dataset.tipo as Item["tipo"], botao.dataset.chave!);
    });

    // Teclado: uma parada no Tab, setas para andar (tabindex móvel), Home e End.
    this.el.addEventListener("keydown", (e) => {
      const botoes = this.itens.map((i) => i.botao);
      const i = botoes.indexOf(document.activeElement as HTMLButtonElement);
      if (i < 0) return;
      let j = i;
      if (e.key === "ArrowRight") j = Math.min(botoes.length - 1, i + 1);
      else if (e.key === "ArrowLeft") j = Math.max(0, i - 1);
      else if (e.key === "Home") j = 0;
      else if (e.key === "End") j = botoes.length - 1;
      else return;
      e.preventDefault();
      this.focar(botoes[j]);
    });
    this.el.addEventListener("focusin", (e) => {
      const item = this.itens.find((i) => i.botao === e.target);
      if (item) {
        for (const i of this.itens) i.botao.tabIndex = i === item ? 0 : -1;
        if (item.botao.matches(":focus-visible")) this.mostrarRotulo(item);
      }
    });
    this.el.addEventListener("focusout", () => {
      if (!this.dentro) this.mostrarRotulo(undefined);
    });
  }

  private focar(botao: HTMLButtonElement) {
    for (const i of this.itens) i.botao.tabIndex = i.botao === botao ? 0 : -1;
    botao.focus();
  }

  private tabParaOPrimeiro() {
    if (this.itens.some((i) => i.botao.tabIndex === 0 && i.el.isConnected)) return;
    this.itens.forEach((i, n) => (i.botao.tabIndex = n === 0 ? 0 : -1));
  }

  private marcarSobre(alvo: Element | null) {
    const botao = alvo?.closest(".mac-dock-botao");
    const item = botao ? this.itens.find((i) => i.botao === botao) : undefined;
    if (item === this.sobre) return;
    this.sobre = item;
    this.mostrarRotulo(item);
  }

  private mostrarRotulo(item: Item | undefined) {
    if (!item) {
      this.rotulo.classList.remove("visivel");
      return;
    }
    this.rotulo.textContent = item.rotulo.replace(/, aberto$/, "");
    this.rotulo.classList.add("visivel");
    this.posicionarRotulo();
  }

  private posicionarRotulo() {
    const item = this.sobre ?? this.itens.find((i) => i.botao === document.activeElement);
    if (!item || !this.rotulo.classList.contains("visivel")) return;
    const r = item.botao.getBoundingClientRect();
    const d = this.el.getBoundingClientRect();
    this.rotulo.style.transform = `translate(${(r.left + r.width / 2 - d.left).toFixed(1)}px, ${(r.top - d.top).toFixed(1)}px) translate(-50%, calc(-100% - 10px))`;
  }

  private agendar() {
    if (!this.quadro) this.quadro = requestAnimationFrame(this.passo);
  }

  /** Recalcula as vagas (depois de mudar o tamanho da tela). */
  medir() {
    this.r = 0;
    this.centros = undefined;
    this.agendar();
  }

  private passo = () => {
    this.quadro = 0;
    const tamanho = this.itens[0]?.botao.offsetWidth || 50;
    const alcance = tamanho * 2.7;
    let mexendo = false;
    const centros = (this.centros ??= this.itens.map((i) => {
      const r = this.retanguloEmRepouso(i);
      return r.left + r.width / 2;
    }));
    // Escala de cada item: a curva de cosseno pela distância ao ponteiro, suavizada a cada quadro.
    this.itens.forEach((item, n) => {
      const d = Math.abs(this.px - centros[n]);
      const alvo = this.dentro && d < alcance ? 1 + (MAXIMO - 1) * ((Math.cos((Math.PI * d) / alcance) + 1) / 2) : 1;
      const novo = item.escala + (alvo - item.escala) * 0.32;
      item.escala = Math.abs(alvo - novo) < 0.002 ? alvo : novo;
      if (item.escala !== alvo) mexendo = true;
    });
    // O espaço extra de cada um, e a translação que abre caminho para os dois lados, a partir do centro.
    const extras = this.itens.map((i) => (i.escala - 1) * tamanho);
    const total = extras.reduce((a, b) => a + b, 0);
    let acumulado = 0;
    const sepAntes = this.indiceDoSeparador();
    this.itens.forEach((item, n) => {
      const dx = acumulado + extras[n] / 2 - total / 2;
      acumulado += extras[n];
      item.botao.style.transform = item.escala === 1 && Math.abs(dx) < 0.01 ? "" : `translateX(${dx.toFixed(2)}px) scale(${item.escala.toFixed(4)})`;
      if (item.ponto) item.ponto.style.transform = Math.abs(dx) < 0.01 ? "" : `translateX(${dx.toFixed(2)}px)`;
      if (n === sepAntes - 1) {
        // O separador fica entre o último app e o primeiro item da direita: anda com o meio deles.
        const dxSep = acumulado - total / 2;
        this.separador.style.transform = Math.abs(dxSep) < 0.01 ? "" : `translateX(${dxSep.toFixed(2)}px)`;
      }
    });
    const largura = this.el.offsetWidth || 1;
    const s = 1 + total / largura;
    const r = this.raio();
    if (s === 1) {
      this.fundo.style.transform = "";
      this.fundo.style.borderRadius = "";
    } else {
      this.fundo.style.transform = `scaleX(${s.toFixed(4)})`;
      this.fundo.style.borderRadius = `${(r / s).toFixed(2)}px / ${r}px`;
    }
    this.posicionarRotulo();
    this.op.aoMover();
    if (mexendo || performance.now() < this.flipAte) this.agendar();
  };
}
