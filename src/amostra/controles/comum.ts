/**
 * Protótipo dos controles: o comportamento comum às cinco opções, para todas terem o mesmo teclado, o
 * mesmo leitor de tela e o mesmo arrasto. Cada opção cuida só da aparência e das animações.
 */
import type { Relogio, Estado } from "./relogio";

const semMarcacao = (html: string) => html.replace(/<[^>]+>/g, "").replace(/&quot;/g, '"').replace(/&amp;/g, "&");

/** O que o leitor de tela ouve no controle: o passo (ou estado) da vez, ou "Desenho completo". */
export function textoDoInstante(r: Relogio, e: Estado): string {
  if (r.caso === "animacao") return `${Math.round(e.t * 100)}% da animação`;
  if (e.indice < 0) return "Desenho completo";
  const m = r.marcas[e.indice];
  return r.caso === "passos" ? `Passo ${e.indice + 1} de ${r.marcas.length}: ${semMarcacao(m.texto)}` : semMarcacao(m.texto);
}

/**
 * O botão de tocar e pausar: aria-pressed, o rótulo e as classes `tocando` e `no-fim` (para a aparência
 * e as animações da opção).
 */
export function botaoTocar(botao: HTMLButtonElement, r: Relogio) {
  botao.type = "button";
  botao.addEventListener("click", () => r.alternar());
  r.ouvir((e) => {
    botao.setAttribute("aria-pressed", String(e.tocando));
    const rotulo = e.tocando ? "Pausar" : e.t >= 1 || !e.mexeu ? "Reproduzir desde o início" : "Continuar";
    if (botao.getAttribute("aria-label") !== rotulo) botao.setAttribute("aria-label", rotulo);
    botao.classList.toggle("tocando", e.tocando);
    botao.classList.toggle("no-fim", e.noFim);
  });
}

/** O botão de recomeçar (a animação com play). */
export function botaoRecomecar(botao: HTMLButtonElement, r: Relogio) {
  botao.type = "button";
  botao.setAttribute("aria-label", "Recomeçar do início");
  botao.addEventListener("click", () => r.recomecar());
}

/**
 * A faixa do tempo, num elemento qualquer (a régua, a fita, o picote…): vira um controle deslizante
 * acessível (role="slider", foco, setas de um passo ao vizinho, Home e End) e arrastável (mouse, caneta
 * e dedo; o dedo só depois de um movimento de lado). `area` é onde se mede a posição (por padrão, a
 * própria faixa). Devolve a função que converte um x da tela em t.
 */
export function faixaDoTempo(faixa: HTMLElement, r: Relogio, opcoes: { area?: HTMLElement; rotulo?: string } = {}) {
  const area = opcoes.area ?? faixa;
  faixa.setAttribute("role", "slider");
  faixa.tabIndex = 0;
  faixa.setAttribute("aria-label", opcoes.rotulo ?? (r.caso === "animacao" ? "Tempo da animação" : "Tempo da lousa"));
  faixa.setAttribute("aria-valuemin", "0");
  faixa.setAttribute("aria-valuemax", "100");
  faixa.style.touchAction = "pan-y";
  const paraT = (x: number) => {
    const c = area.getBoundingClientRect();
    return Math.min(1, Math.max(0, (x - c.left) / c.width));
  };
  r.ouvir((e) => {
    faixa.setAttribute("aria-valuenow", String(Math.round(e.t * 100)));
    const texto = textoDoInstante(r, e);
    if (faixa.getAttribute("aria-valuetext") !== texto) faixa.setAttribute("aria-valuetext", texto);
  });

  let arrastando = false;
  let inicio: { x: number; y: number; id: number } | null = null;
  const comecar = (ev: PointerEvent) => {
    arrastando = true;
    faixa.classList.add("arrastando");
    faixa.setPointerCapture(ev.pointerId);
    r.ir(paraT(ev.clientX));
  };
  faixa.addEventListener("pointerdown", (ev) => {
    if (ev.pointerType === "mouse" && ev.button !== 0) return;
    if (ev.pointerType === "touch") inicio = { x: ev.clientX, y: ev.clientY, id: ev.pointerId };
    else comecar(ev);
  });
  faixa.addEventListener("pointermove", (ev) => {
    if (arrastando) return r.ir(paraT(ev.clientX));
    if (!inicio || ev.pointerId !== inicio.id) return;
    const dx = Math.abs(ev.clientX - inicio.x);
    if (dx > 8 && dx > Math.abs(ev.clientY - inicio.y)) {
      inicio = null;
      comecar(ev);
    }
  });
  for (const tipo of ["pointerup", "pointercancel", "lostpointercapture"]) {
    faixa.addEventListener(tipo, () => {
      inicio = null;
      arrastando = false;
      faixa.classList.remove("arrastando");
    });
  }

  // As setas vão de um passo (ou estado) ao vizinho; sem marcas (a animação), de 5% em 5%.
  faixa.addEventListener("keydown", (ev) => {
    const t = r.estado().t;
    const pontos = r.marcas.length ? [...new Set([...r.marcas.map((m) => m.de), 1])].sort((a, b) => a - b) : null;
    let alvo: number | undefined;
    if (ev.key === "ArrowRight" || ev.key === "ArrowUp") alvo = pontos ? pontos.find((m) => m > t + 0.001) : Math.min(1, t + 0.05);
    else if (ev.key === "ArrowLeft" || ev.key === "ArrowDown") alvo = pontos ? pontos.findLast((m) => m < t - 0.001) : Math.max(0, t - 0.05);
    else if (ev.key === "Home") alvo = 0;
    else if (ev.key === "End") alvo = 1;
    else if (ev.key === " " || ev.key === "Enter") {
      ev.preventDefault();
      return r.alternar();
    }
    if (alvo === undefined) return;
    ev.preventDefault();
    r.ir(alvo);
  });
  return paraT;
}

/**
 * A lista dos passos: cada item é um botão que leva a lousa ao fim do passo; o item da vez ganha
 * aria-current="step" e a classe `atual`; os anteriores, a classe `feito`.
 */
export function listaDePassos(itens: HTMLElement[], r: Relogio) {
  itens.forEach((item, i) => {
    item.addEventListener("click", () => r.irParaPasso(i));
  });
  r.ouvir((e) => {
    itens.forEach((item, i) => {
      const atual = i === e.indice;
      if (atual) item.setAttribute("aria-current", "step");
      else item.removeAttribute("aria-current");
      item.classList.toggle("atual", atual);
      item.classList.toggle("feito", e.indice >= 0 && i < e.indice);
    });
  });
}

/** Chama `fn` só quando o passo (ou estado) da vez muda, com o anterior. */
export function aoMudarDePasso(r: Relogio, fn: (indice: number, anterior: number) => void) {
  let anterior = -2;
  r.ouvir((e) => {
    if (e.indice === anterior) return;
    const antes = anterior;
    anterior = e.indice;
    fn(e.indice, antes);
  });
}

/** Cria um elemento com classe e atributos (atalho para montar os controles). */
export function el<K extends keyof HTMLElementTagNameMap>(tag: K, classe?: string, html?: string): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (classe) e.className = classe;
  if (html !== undefined) e.innerHTML = html;
  return e;
}
