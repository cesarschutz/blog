/**
 * Opção 1, "Régua e lápis": a faixa do tempo é uma régua; um lápis risca o progresso ao longo dela e
 * circula o número do passo da vez. Embaixo, uma ficha pautada: os passos (lousa de passos), a frase
 * (animação) ou o estado da vez (comparação). Recomeçar é a borracha.
 */
import type { Relogio } from "./relogio";
import { aoMudarDePasso, botaoRecomecar, botaoTocar, el, faixaDoTempo, listaDePassos } from "./comum";

const LAPIS = `<svg class="r1-lapis-desenho" viewBox="0 0 74 12" aria-hidden="true">
  <path class="r1-grafite" d="M0 6 L6 4.4 L6 7.6 Z"/>
  <path class="r1-madeira" d="M6 4.4 L17 0.6 L17 11.4 L6 7.6 Z"/>
  <rect class="r1-corpo" x="17" y="0.6" width="40" height="10.8"/>
  <path class="r1-faceta" d="M17 4.2 H57 M17 7.8 H57"/>
  <rect class="r1-virola" x="57" y="0.2" width="7" height="11.6" rx="1"/>
  <path class="r1-virola-friso" d="M59.3 0.6 V11.4 M61.7 0.6 V11.4"/>
  <rect class="r1-borracha" x="64" y="0.6" width="9.4" height="10.8" rx="2.4"/>
</svg>`;

const CIRCULO = `<svg class="r1-circulo" viewBox="0 0 40 30" aria-hidden="true"><path pathLength="1" d="M27 4.5 C 20 1.5 8 3 5 11 C 2 19 10 27 20 26.5 C 31 26 37 18 35 11 C 33.5 6 27 3 19 4"/></svg>`;
const VISTO = `<svg class="r1-visto" viewBox="0 0 16 14" aria-hidden="true"><path pathLength="1" d="M2 8 L6 12 L14 2"/></svg>`;
const TOCAR = `<svg class="r1-icone" viewBox="0 0 24 24" aria-hidden="true">
  <path class="r1-play" d="M8.5 5.5 L18.5 12 L8.5 18.5 Z"/>
  <path class="r1-pausa" d="M7.5 5.5 H10.5 V18.5 H7.5 Z M13.5 5.5 H16.5 V18.5 H13.5 Z"/>
</svg><svg class="r1-contorno" viewBox="0 0 48 48" aria-hidden="true"><path d="M24 3.5 C 36 3 45 11.5 44.5 24 C 44 36 35.5 44.8 23.5 44.5 C 11.5 44.2 3.2 35.5 3.5 23.5 C 3.8 12 12.5 4 24 3.5"/></svg>`;
const BORRACHA = `<svg viewBox="0 0 24 24" aria-hidden="true"><path class="r1-borracha-corpo" d="M5 15.5 L13.5 7 L19 12.5 L10.5 21 H6.8 L4 18.2 Z"/><path class="r1-borracha-ponta" d="M5 15.5 L8.6 19.2"/><path class="r1-farelo" d="M14 20.5 h1.4 M17.5 18.8 h1.2 M19.5 20.6 h1"/></svg>`;

export default function montar(r: Relogio, controles: HTMLElement, figura: HTMLElement) {
  figura.classList.add("r1");
  const base = el("div", "r1-base");
  const tocar = el("button", "r1-tocar", TOCAR);
  base.append(tocar);
  botaoTocar(tocar, r);

  if (r.caso === "animacao") {
    const recomecar = el("button", "r1-recomecar", BORRACHA);
    base.append(recomecar);
    botaoRecomecar(recomecar, r);
    recomecar.addEventListener("click", () => {
      recomecar.classList.remove("apagando");
      void recomecar.offsetWidth;
      recomecar.classList.add("apagando");
    });
  }

  // A régua: a escala (mm e cm), os números (passos, estados ou segundos), o risco do lápis e o lápis.
  const regua = el("div", "r1-regua");
  const escala = el("div", "r1-escala");
  const risco = el(
    "div",
    "r1-risco",
    `<svg viewBox="0 0 1000 12" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M0 6 C 120 5 240 7.2 360 6 S 600 4.8 720 6.2 S 900 6.8 1000 5.6"/></svg>`,
  );
  const numeros = el("div", "r1-numeros");
  const lapis = el("div", "r1-lapis", LAPIS);
  regua.append(risco, escala, numeros, lapis);
  base.append(regua);

  const marcasDaRegua: HTMLElement[] = [];
  if (r.caso === "animacao") {
    // Na animação, a régua conta segundos, como uma régua conta centímetros.
    const segundos = Math.max(1, Math.round(r.duracao));
    for (let s = 0; s <= segundos; s += 2) {
      const n = el("span", "r1-numero r1-segundo", `${s}<small>s</small>`);
      n.style.left = `${(s / segundos) * 100}%`;
      numeros.append(n);
    }
  } else {
    r.marcas.forEach((m, i) => {
      const n = el("span", "r1-numero", r.caso === "passos" ? `<b>${i + 1}</b>${CIRCULO}` : `<i></i>${CIRCULO}`);
      n.style.left = `${m.de * 100}%`;
      numeros.append(n);
      marcasDaRegua.push(n);
    });
  }
  faixaDoTempo(regua, r, { area: escala });

  controles.append(base);

  // A ficha pautada embaixo.
  const ficha = el("div", "r1-ficha");
  if (r.caso === "passos") {
    const lista = el("ol", "r1-passos");
    const itens = r.marcas.map((m, i) => {
      const li = el("li");
      const botao = el("button", "r1-passo", `<span class="r1-num">${i + 1}${CIRCULO}${VISTO}</span><span class="r1-texto">${m.texto}</span>`);
      botao.type = "button";
      li.append(botao);
      lista.append(li);
      return botao;
    });
    ficha.append(lista);
    listaDePassos(itens, r);
  } else if (r.caso === "animacao") {
    ficha.append(el("p", "r1-nota", figura.dataset.legenda ?? ""));
  } else {
    const nota = el("p", "r1-nota r1-estado");
    nota.setAttribute("aria-hidden", "true");
    ficha.append(nota);
    r.ouvir((e) => {
      const i = e.indice >= 0 ? e.indice : r.marcas.length - 1;
      const texto = r.marcas[i]?.texto ?? "";
      if (nota.dataset.i !== String(i)) {
        nota.dataset.i = String(i);
        nota.innerHTML = `<span class="r1-rotulo">${i + 1}</span> ${texto}`;
        nota.classList.remove("trocou");
        void nota.offsetWidth;
        nota.classList.add("trocou");
      }
    });
  }
  controles.append(ficha);

  // O lápis acompanha o tempo; o risco cresce com ele. Tocando, o lápis "escreve" (balança).
  r.ouvir((e) => {
    regua.style.setProperty("--t", String(e.t));
    figura.classList.toggle("r1-tocando", e.tocando && !e.noFim);
    figura.classList.toggle("r1-no-fim", e.noFim);
  });
  // O número do passo da vez é circulado a lápis na régua.
  aoMudarDePasso(r, (i) => {
    marcasDaRegua.forEach((m, j) => m.classList.toggle("circulado", j === i));
  });
}
