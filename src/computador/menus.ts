/**
 * A barra de menus (C1): a marca "cs" no lugar da maçã (o menu do sistema, com "Sair do computador"), o
 * nome do app da frente em negrito e os menus dele, o entalhe da câmera no meio (MacBook Pro) e, à
 * direita, a aparência (claro e escuro, o tema do blog), o Wi-Fi, a bateria e o relógio.
 *
 * Como no macOS: o clique abre; com um menu aberto, passar o mouse em outro troca na hora; Esc fecha; as
 * setas andam (← → entre os menus, ↑ ↓ nos itens); Enter escolhe. Os menus aparecem na hora e somem num
 * esmaecer curto. Os itens que não fazem nada ali ficam apagados, como no Mac.
 */
import type { ItemDeMenu, Menu } from "./contexto";
import { BATERIA, glifo, MARCA_DA_BARRA } from "./icones";

export interface OpcoesDaBarra {
  /** Os menus do app da frente: o do app (com o nome em negrito) e os outros. */
  menus(): { nomeDoApp: string; doApp: ItemDeMenu[]; resto: Menu[] };
  menuDoSistema(): ItemDeMenu[];
  alternarTema(origem: Element): void;
  temaEscuro(): boolean;
}

interface Aberto {
  botao: HTMLButtonElement;
  painel: HTMLElement;
  itens: ItemDeMenu[];
}

const DIAS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

export class BarraDeMenus {
  readonly el: HTMLElement;
  /**
   * Onde os menus abertos ficam: fora da barra (ela tem vidro, e um vidro dentro de outro só desfocaria
   * o que está dentro da barra), logo embaixo dela. O sistema a põe na tela junto com a barra.
   */
  readonly camada: HTMLElement;
  private esquerda: HTMLElement;
  private relogio: HTMLElement;
  private tema: HTMLButtonElement;
  private aberto?: Aberto;
  private tempo = 0;
  private menusAtuais: Menu[] = [];

  constructor(private op: OpcoesDaBarra) {
    this.el = document.createElement("div");
    this.el.className = "mac-barra";
    this.el.innerHTML =
      '<div class="mac-barra-menus" role="menubar" aria-label="Barra de menus"></div>' +
      '<div class="mac-entalhe" aria-hidden="true"><span></span></div>' +
      '<div class="mac-barra-extras">' +
      `<button type="button" class="mac-barra-extra mac-barra-tema" data-tema aria-label="Aparência escura">${glifo("lustreAceso", "mac-glifo g-aceso")}${glifo("lustreApagado", "mac-glifo g-apagado")}</button>` +
      `<span class="mac-barra-extra mac-so-largo" aria-hidden="true">${glifo("wifi")}</span>` +
      `<span class="mac-barra-extra mac-so-largo" aria-hidden="true">${BATERIA}</span>` +
      '<span class="mac-barra-relogio" data-relogio></span>' +
      "</div>";
    this.camada = document.createElement("div");
    this.camada.className = "mac-menus";
    this.esquerda = this.el.querySelector(".mac-barra-menus")!;
    this.relogio = this.el.querySelector("[data-relogio]")!;
    this.tema = this.el.querySelector("[data-tema]")!;
    this.tema.addEventListener("click", () => this.op.alternarTema(this.tema));
    this.ligar();
    this.refazer();
  }

  /** O relógio anda (a cada 15 s) só com o computador aberto. */
  ligarRelogio(ligado: boolean) {
    clearInterval(this.tempo);
    if (!ligado) return;
    this.marcarHora();
    this.tempo = window.setInterval(() => this.marcarHora(), 15000);
  }

  private marcarHora() {
    const agora = new Date();
    const hora = `${String(agora.getHours()).padStart(2, "0")}:${String(agora.getMinutes()).padStart(2, "0")}`;
    this.relogio.textContent = `${DIAS[agora.getDay()]} ${agora.getDate()} de ${MESES[agora.getMonth()]}  ${hora}`;
    this.relogio.setAttribute("aria-label", agora.toLocaleString("pt-BR", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }));
  }

  atualizarTema() {
    const escuro = this.op.temaEscuro();
    this.tema.setAttribute("aria-label", escuro ? "Aparência clara" : "Aparência escura");
    this.tema.title = escuro ? "Mudar para a aparência clara" : "Mudar para a aparência escura";
  }

  /** Refaz os títulos dos menus (o app da frente mudou). */
  refazer() {
    const { nomeDoApp, resto } = this.op.menus();
    this.menusAtuais = resto;
    const foco = this.esquerda.contains(document.activeElement);
    const tituloFocado = (document.activeElement as HTMLElement | null)?.dataset?.menu;
    this.fechar(false);
    this.esquerda.innerHTML =
      `<button type="button" class="mac-barra-item mac-barra-marca" role="menuitem" aria-haspopup="menu" aria-expanded="false" aria-label="Menu do computador" data-menu="sistema">${MARCA_DA_BARRA}</button>` +
      `<button type="button" class="mac-barra-item mac-barra-app" role="menuitem" aria-haspopup="menu" aria-expanded="false" data-menu="app">${nomeDoApp}</button>` +
      resto.map((m, i) => `<button type="button" class="mac-barra-item mac-so-largo-${i < 2 ? "medio" : "largo"}" role="menuitem" aria-haspopup="menu" aria-expanded="false" data-menu="${i}">${m.titulo}</button>`).join("");
    // Sem medir aqui (o filtro dos títulos à vista mede o layout): refazer acontece a cada troca de janela.
    const botoes = [...this.esquerda.querySelectorAll<HTMLButtonElement>(".mac-barra-item")];
    botoes.forEach((b, i) => (b.tabIndex = i === 0 ? 0 : -1));
    if (foco) (botoes.find((b) => b.dataset.menu === tituloFocado) ?? botoes[0])?.focus();
    this.atualizarTema();
  }

  private titulos() {
    return [...this.esquerda.querySelectorAll<HTMLButtonElement>(".mac-barra-item")].filter((b) => b.offsetParent !== null || b.classList.contains("mac-barra-marca"));
  }

  private itensDe(chave: string): ItemDeMenu[] {
    if (chave === "sistema") return this.op.menuDoSistema();
    if (chave === "app") return this.op.menus().doApp;
    return this.menusAtuais[Number(chave)]?.itens ?? [];
  }

  get estaAberto() {
    return Boolean(this.aberto);
  }

  abrir(botao: HTMLButtonElement, focarPrimeiro = false) {
    if (this.aberto?.botao === botao) return;
    this.fechar(false);
    const itens = this.itensDe(botao.dataset.menu!);
    const painel = document.createElement("div");
    painel.className = "mac-menu";
    painel.tabIndex = -1;
    painel.setAttribute("role", "menu");
    painel.setAttribute("aria-label", botao.getAttribute("aria-label") ?? botao.textContent ?? "");
    painel.innerHTML = itens
      .map((it, i) => {
        if ("separador" in it) return '<div class="mac-menu-separador" role="separator"></div>';
        const marcado = it.marcado !== undefined;
        return (
          `<button type="button" class="mac-menu-item" role="${marcado ? "menuitemcheckbox" : "menuitem"}" tabindex="-1" data-i="${i}"` +
          `${it.desativado ? ' aria-disabled="true"' : ""}${marcado ? ` aria-checked="${it.marcado ? "true" : "false"}"` : ""}>` +
          `<span class="mac-menu-marca" aria-hidden="true">${it.marcado ? "✓" : ""}</span>` +
          `<span class="mac-menu-rotulo">${it.rotulo}</span>` +
          (it.atalho ? `<span class="mac-menu-atalho" aria-hidden="true">${it.atalho}</span>` : "") +
          "</button>"
        );
      })
      .join("");
    this.camada.append(painel);
    const r = botao.getBoundingClientRect();
    const d = this.el.getBoundingClientRect();
    const largura = painel.offsetWidth;
    const x = Math.max(6, Math.min(r.left - d.left, this.el.clientWidth - largura - 6));
    painel.style.transform = `translateX(${x}px)`;
    botao.setAttribute("aria-expanded", "true");
    botao.classList.add("aberto");
    this.aberto = { botao, painel, itens };
    if (focarPrimeiro) this.moverNoMenu(1);
    else painel.focus({ preventScroll: true });
  }

  /** Fecha o menu aberto (com o esmaecer de 0,12 s) e, se pedir, devolve o foco ao título. */
  fechar(devolverFoco = true) {
    const a = this.aberto;
    if (!a) return;
    this.aberto = undefined;
    a.botao.setAttribute("aria-expanded", "false");
    a.botao.classList.remove("aberto");
    a.painel.style.pointerEvents = "none";
    const anim = matchMedia("(prefers-reduced-motion: reduce)").matches ? null : a.painel.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, easing: "ease-out", fill: "forwards" });
    if (anim) void anim.finished.then(() => a.painel.remove(), () => a.painel.remove());
    else a.painel.remove();
    if (devolverFoco) a.botao.focus();
  }

  private escolher(i: number) {
    const a = this.aberto;
    const it = a?.itens[i];
    if (!a || !it || "separador" in it || it.desativado) return;
    this.fechar(false);
    a.botao.blur();
    it.acao?.();
  }

  private moverNoMenu(passo: number) {
    const a = this.aberto;
    if (!a) return;
    const itens = [...a.painel.querySelectorAll<HTMLButtonElement>(".mac-menu-item")];
    const i = itens.indexOf(document.activeElement as HTMLButtonElement);
    let j = i;
    for (let n = 0; n < itens.length; n++) {
      j = i < 0 ? (passo > 0 ? n : itens.length - 1 - n) : (j + passo + itens.length) % itens.length;
      if (itens[j].getAttribute("aria-disabled") !== "true") break;
    }
    itens[j]?.focus();
  }

  private ligar() {
    this.esquerda.addEventListener("click", (e) => {
      const botao = (e.target as Element).closest<HTMLButtonElement>(".mac-barra-item");
      if (!botao) return;
      if (this.aberto?.botao === botao) this.fechar(false);
      else this.abrir(botao, e.detail === 0);
    });
    // Com um menu aberto, o mouse em outro título troca na hora.
    this.esquerda.addEventListener("pointerover", (e) => {
      if (!this.aberto || e.pointerType !== "mouse") return;
      const botao = (e.target as Element).closest<HTMLButtonElement>(".mac-barra-item");
      if (botao && botao !== this.aberto.botao) this.abrir(botao);
    });
    this.camada.addEventListener("click", (e) => {
      const item = (e.target as Element).closest<HTMLElement>(".mac-menu-item");
      if (item) this.escolher(Number(item.dataset.i));
    });
    // O item sob o mouse ganha o foco (o realce azul é o do foco, como no Mac).
    this.camada.addEventListener("pointermove", (e) => {
      const item = (e.target as Element).closest<HTMLButtonElement>(".mac-menu-item");
      if (item && document.activeElement !== item && item.getAttribute("aria-disabled") !== "true") item.focus({ preventScroll: true });
    });
    this.camada.addEventListener("pointerleave", () => {
      const ativo = document.activeElement;
      if (this.aberto && ativo instanceof HTMLElement && ativo.classList.contains("mac-menu-item")) this.aberto.painel.focus({ preventScroll: true });
    });

    const teclas = (e: KeyboardEvent) => {
      const titulos = this.titulos();
      const noTitulo = (e.target as Element).closest(".mac-barra-item") as HTMLButtonElement | null;
      const i = this.aberto ? titulos.indexOf(this.aberto.botao) : noTitulo ? titulos.indexOf(noTitulo) : -1;
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        if (i < 0) return;
        e.preventDefault();
        const j = (i + (e.key === "ArrowRight" ? 1 : -1) + titulos.length) % titulos.length;
        titulos.forEach((b, n) => (b.tabIndex = n === j ? 0 : -1));
        if (this.aberto) this.abrir(titulos[j], true);
        else titulos[j].focus();
        return;
      }
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        if (!this.aberto && noTitulo) this.abrir(noTitulo, true);
        else this.moverNoMenu(e.key === "ArrowDown" ? 1 : -1);
        return;
      }
      if ((e.key === "Enter" || e.key === " ") && (e.target as Element).closest(".mac-menu-item")) {
        e.preventDefault();
        this.escolher(Number((e.target as HTMLElement).dataset.i));
        return;
      }
      if (e.key === "Tab" && this.aberto) this.fechar(false);
    };
    this.el.addEventListener("keydown", teclas);
    this.camada.addEventListener("keydown", teclas);

    // Clique fora fecha.
    document.addEventListener(
      "pointerdown",
      (e) => {
        const alvo = e.target as Node;
        if (this.aberto && !this.el.contains(alvo) && !this.camada.contains(alvo)) this.fechar(false);
      },
      { capture: true },
    );
  }
}
