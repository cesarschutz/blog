/**
 * Opção 4, "Post-its e fita": a faixa do tempo é uma fita adesiva (washi, na cor do livro, translúcida e
 * listrada) que se desenrola sobre uma linha de guia; o cursor é o rolo da fita, que gira conforme anda,
 * afina à medida que a fita sai e estica nas pontas ao ser arrastado. O play é um adesivo redondo. Os
 * passos são post-its pregados embaixo da fita, cada um no lugar onde o passo começa; o da vez se
 * descola, e o texto dele aparece num bilhete preso com um pedaço da mesma fita.
 */
import type { Relogio } from "./relogio";
import { aoMudarDePasso, botaoRecomecar, botaoTocar, el, faixaDoTempo, listaDePassos } from "./comum";

// O play e a pausa como dois pares de quadriláteros com os mesmos pontos (viewBox 36), para a troca
// ser uma transformação de um no outro.
type Pontos = [number, number][];
const PLAY: Pontos = [[11, 10], [18, 13.74], [18, 22.28], [11, 26], [18, 13.74], [26, 18], [26, 18], [18, 22.28]];
const PAUSA: Pontos = [[11, 10], [17, 10], [17, 26], [11, 26], [20, 10], [26, 10], [26, 26], [20, 26]];
const caminho = (p: Pontos) => `M${p[0]}L${p[1]}L${p[2]}L${p[3]}ZM${p[4]}L${p[5]}L${p[6]}L${p[7]}Z`;
const misturar = (k: number): Pontos => PLAY.map(([x, y], i) => [+(x + (PAUSA[i][0] - x) * k).toFixed(2), +(y + (PAUSA[i][1] - y) * k).toFixed(2)]);

const ICONE_TOCAR = `<svg class="r4-icone" viewBox="0 0 36 36" aria-hidden="true"><path d="${caminho(PLAY)}"/></svg>`;
const ICONE_RECOMECAR = `<svg class="r4-icone r4-seta" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.2 9.4 A7 7 0 1 1 5.6 14.6"/><path d="M5.4 4.6 L6.2 9.4 L11 8.6"/></svg>`;

// O rolo, visto de lado, com o centro na origem: as voltas de fita (que afinam conforme ela sai), a
// última volta com a ponta solta, o miolo de papelão com a marca impressa (as duas mostram o giro) e o furo.
const ROLO = `<svg class="r4-rolo-giro" viewBox="-20 -20 40 40" aria-hidden="true">
  <g class="r4-voltas">
    <circle class="r4-camada" r="18.6"/>
    <circle class="r4-veio" r="15.8"/>
    <circle class="r4-veio" r="13"/>
    <circle class="r4-ponta-solta" r="17.3" pathLength="100"/>
  </g>
  <circle class="r4-miolo" r="9.6"/>
  <path class="r4-impresso" d="M-4 -6.1 A7.3 7.3 0 0 1 4 -6.1 M-2.2 6.9 A7.3 7.3 0 0 0 2.2 6.9"/>
  <circle class="r4-furo" r="5.8"/>
</svg>`;

const TIQUE = `<svg class="r4-tique" viewBox="0 0 14 12" aria-hidden="true"><path pathLength="1" d="M1.8 6.6 L5.2 10 L12.2 1.8"/></svg>`;

// O post-it descola girando para um lado ou outro, e cada um está colado um pouco torto.
const GIROS = [-2.4, 1.6, -1.2, 2.2, -1.8, 1];

// Curvas: a mola (com sobra), a saída suave e a ida e volta (para a fita se recolher).
const mola = (p: number) => 1 + 2.2 * (p - 1) ** 3 + 1.2 * (p - 1) ** 2;
const suave = (p: number) => 1 - (1 - p) ** 4;
const idaEVolta = (p: number) => (p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2);

/** O raio do rolo (px): o giro é o caminho andado dividido por ele, como um rolo de verdade. */
const RAIO = 21;

export default function montar(r: Relogio, controles: HTMLElement, figura: HTMLElement) {
  figura.classList.add("r4");
  const reduzido = r.reduzido;
  const base = el("div", "r4-base");

  // ---------- os adesivos: tocar (e recomeçar, na animação) ----------
  const botoes = el("div", "r4-botoes");
  const tocar = el("button", "r4-adesivo r4-tocar", ICONE_TOCAR);
  botoes.append(tocar);
  botaoTocar(tocar, r);
  trocarIcone(tocar.querySelector("path")!, r);

  if (r.caso === "animacao") {
    const recomecar = el("button", "r4-adesivo r4-recomecar", ICONE_RECOMECAR);
    botoes.append(recomecar);
    botaoRecomecar(recomecar, r);
    const seta = recomecar.querySelector("svg")!;
    recomecar.addEventListener("click", () => {
      if (reduzido) return;
      // Antecipação (volta um pouco) e o giro inteiro.
      seta.animate([{ rotate: "0deg" }, { rotate: "-28deg", offset: 0.2 }, { rotate: "360deg" }], {
        duration: 900,
        easing: "cubic-bezier(.65,0,.35,1)",
      });
    });
  }
  base.append(botoes);

  // ---------- a fita ----------
  const fita = el("div", "r4-fita");
  const trilho = el("div", "r4-trilho");
  const colada = el("div", "r4-colada");
  const rolo = el("div", "r4-rolo", `<div class="r4-rolo-mola">${ROLO}</div>`);
  const mola2 = rolo.firstElementChild as HTMLElement;

  // Os alfinetes: onde cada passo (ou estado) começa. Ficam embaixo da fita, que passa por cima deles.
  const alfinetes = r.marcas.map((m) => {
    const a = el("span", "r4-alfinete");
    a.style.setProperty("--de", String(m.de));
    trilho.append(a);
    return a;
  });
  trilho.append(colada, rolo);
  fita.append(trilho);
  base.append(fita);

  // O arrasto: o primeiro toque leva o rolo até o dedo com uma passada curta; depois, ele segue 1:1.
  // Além das pontas, o rolo anda só 32% do excesso (o elástico) e volta com mola ao soltar.
  // (Este ouvinte vem antes do de faixaDoTempo, para marcar o começo do arrasto antes do r.ir.)
  let comecoDoArrasto = false;
  fita.addEventListener("pointerdown", () => (comecoDoArrasto = true));
  fita.addEventListener("pointermove", (ev) => {
    if (!fita.classList.contains("arrastando") || reduzido) return;
    const c = trilho.getBoundingClientRect();
    const x = ev.clientX - c.left;
    const excesso = x < 0 ? x : x > c.width ? x - c.width : 0;
    const estica = Math.sign(excesso) * Math.min(Math.abs(excesso) * 0.32, 18);
    fita.style.setProperty("--r4-estica", estica.toFixed(1));
  });
  for (const tipo of ["pointerup", "pointercancel", "lostpointercapture"]) {
    fita.addEventListener(tipo, () => {
      comecoDoArrasto = false;
      fita.style.setProperty("--r4-estica", "0");
    });
  }
  faixaDoTempo(fita, r, { area: trilho });

  // ---------- os post-its dos passos ----------
  let abas: HTMLButtonElement[] = [];
  const caixaAbas = el("div", "r4-abas");
  if (r.caso === "passos") {
    abas = r.marcas.map((m, i) => {
      const aba = el("button", "r4-aba", `<span class="r4-aba-n">${i + 1}</span>${TIQUE}`);
      aba.type = "button";
      aba.setAttribute("aria-label", `Passo ${i + 1} de ${r.marcas.length}`);
      aba.style.setProperty("--de", String(m.de));
      aba.style.setProperty("--giro", `${GIROS[i % GIROS.length]}deg`);
      caixaAbas.append(aba);
      return aba;
    });
    listaDePassos(abas, r);
    base.append(caixaAbas);
  }
  controles.append(base);

  // ---------- o bilhete, preso com um pedaço da fita ----------
  const bilhete = el("div", "r4-bilhete");
  const textos: HTMLElement[] = [];
  if (r.caso === "animacao") {
    bilhete.append(el("p", "r4-frase", figura.dataset.legenda ?? ""));
  } else {
    // Todos os textos ficam empilhados na mesma célula: a altura é a do maior, e só o da vez aparece.
    const pilha = el("div", "r4-pilha");
    if (r.caso === "passos") {
      const n = r.marcas.length;
      pilha.append(el("p", "r4-texto r4-convite", `${n} passos: toque no play ou escolha um post-it.`));
    }
    r.marcas.forEach((m, i) => {
      const p = el("p", "r4-texto", `<span class="r4-n">${i + 1}</span>${m.texto}`);
      pilha.append(p);
      textos.push(p);
    });
    bilhete.append(pilha);
    const convite = pilha.querySelector<HTMLElement>(".r4-convite");
    aoMudarDePasso(r, (i) => {
      // Na comparação, a lousa completa é o último estado; nos passos, antes de mexer, o convite.
      const vez = i >= 0 ? i : r.caso === "comparacao" ? r.marcas.length - 1 : -1;
      textos.forEach((t, j) => t.classList.toggle("ativo", j === vez));
      convite?.classList.toggle("ativo", vez < 0);
      alfinetes.forEach((a, j) => a.classList.toggle("atual", j === i));
    });
  }
  controles.append(bilhete);

  // ---------- o tempo na fita ----------
  // O que aparece segue o relógio, mas os saltos (um passo clicado, as setas, o recomeço) viram uma
  // passada do rolo em vez de um pulo: o desvio entre o que aparece e o relógio some com uma curva.
  let mostrado = r.estado().t;
  let ultimo = mostrado;
  let alvo = mostrado;
  let desvio = 0;
  let inicio = 0;
  let duracao = 0;
  let curva = suave;
  let quadro = 0;
  const aplicar = (v: number) => fita.style.setProperty("--r4-t", v.toFixed(4));
  const seguir = (agora: number) => {
    const p = Math.min(1, (agora - inicio) / duracao);
    mostrado = alvo + desvio * (1 - curva(p));
    aplicar(mostrado);
    if (p < 1) quadro = requestAnimationFrame(seguir);
    else quadro = 0;
  };
  const passada = (ms: number, c: (p: number) => number) => {
    desvio = mostrado - alvo;
    inicio = performance.now();
    duracao = ms;
    curva = c;
    if (!quadro) quadro = requestAnimationFrame(seguir);
  };

  let noFimAntes = false;
  r.ouvir((e) => {
    alvo = e.t;
    const salto = e.t - ultimo;
    ultimo = e.t;
    figura.classList.toggle("r4-tocando", e.tocando && !e.noFim);
    figura.classList.toggle("r4-no-fim", e.noFim);
    if (e.noFim && !noFimAntes && !reduzido) assentar();
    noFimAntes = e.noFim;
    if (reduzido) {
      mostrado = e.t;
      return aplicar(e.t);
    }
    const arrastando = fita.classList.contains("arrastando");
    if (arrastando && comecoDoArrasto) {
      comecoDoArrasto = false;
      if (Math.abs(salto) > 0.01) passada(240, suave);
    } else if (!arrastando && salto < -0.012 && e.t < 0.02) {
      // A volta ao início (recomeçar, o play depois do fim, a tecla Home): a fita se recolhe no rolo,
      // que volta rolando, mais demorado quanto mais fita há para enrolar.
      passada(320 + 420 * -salto, idaEVolta);
    } else if (!arrastando && !e.tocando && Math.abs(salto) > 0.012) {
      passada(520, mola);
    }
    if (!quadro) {
      mostrado = e.t;
      aplicar(e.t);
    }
  });

  // Ao parar no fim, o rolo ainda gira um pouco por inércia e assenta.
  function assentar() {
    mola2.animate([{ rotate: "0deg" }, { rotate: "14deg", offset: 0.35 }, { rotate: "-4deg", offset: 0.7 }, { rotate: "0deg" }], {
      duration: 520,
      easing: "ease-out",
    });
  }

  // O giro depende do comprimento da fita: um rolo de raio R gira (caminho ÷ R) radianos.
  // Os post-its ficam no lugar de cada passo; se não couberem (muitos passos, tela estreita), ficam em fila.
  new ResizeObserver(() => {
    const largura = trilho.clientWidth;
    fita.style.setProperty("--r4-voltas", `${((largura / RAIO) * 180) / Math.PI}deg`);
    if (abas.length) {
      const espaco = Math.min(...r.marcas.slice(1).map((m, i) => (m.de - r.marcas[i].de) * caixaAbas.clientWidth));
      caixaAbas.classList.toggle("r4-em-fila", espaco < 44);
    }
  }).observe(trilho);

  // Sem transições na primeira aparição: elas só valem depois do primeiro quadro.
  requestAnimationFrame(() => requestAnimationFrame(() => figura.classList.add("r4-vivo")));
}

/** O ícone do adesivo de tocar: o triângulo se transforma nas duas barras (e volta) com mola. */
function trocarIcone(path: SVGPathElement, r: Relogio) {
  let atual = 0;
  let alvo = 0;
  let quadro = 0;
  r.ouvir((e) => {
    const quer = e.tocando ? 1 : 0;
    if (quer === alvo) return;
    alvo = quer;
    cancelAnimationFrame(quadro);
    if (r.reduzido) {
      atual = alvo;
      path.setAttribute("d", caminho(misturar(atual)));
      return;
    }
    const de = atual;
    const inicio = performance.now();
    const passo = (agora: number) => {
      const p = Math.min(1, (agora - inicio) / 380);
      atual = de + (alvo - de) * mola(p);
      path.setAttribute("d", caminho(misturar(atual)));
      if (p < 1) quadro = requestAnimationFrame(passo);
      else atual = alvo;
    };
    quadro = requestAnimationFrame(passo);
  });
}
