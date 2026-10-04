/**
 * Opção 5, "Carimbo e numerador": os controles são uma ficha de controle de escritório, presa embaixo do
 * desenho. O play é o cabo do carimbo (afunda ao clicar); um numerador de rodas, como o carimbo de
 * numeração automática, conta o passo, o estado ou o tempo, com os dígitos girando; a faixa do tempo é o
 * picote de um cartão de ponto, que o furador vai furando até o instante, com as colunas dos passos; e
 * cada passo alcançado leva um carimbo na ficha, na tinta da cor do livro.
 */
import type { Estado, Relogio } from "./relogio";
import { aoMudarDePasso, botaoRecomecar, botaoTocar, el, faixaDoTempo, listaDePassos } from "./comum";

const MOLA = "cubic-bezier(.34, 1.56, .64, 1)";
const SUAVE = "cubic-bezier(.16, 1, .3, 1)";
const dois = (n: number) => String(n).padStart(2, "0");
const relogioDe = (s: number) => `${dois(Math.floor(s / 60))}:${dois(s % 60)}`;

/* ---------- o cabo do carimbo: play e pausa, com os pontos do ícone indo de um ao outro com mola ---------- */

type Ponto = [number, number];
const PLAY: Ponto[] = [[11, 10], [18, 13.74], [18, 22.28], [11, 26], [18, 13.74], [26, 18], [26, 18], [18, 22.28]];
const PAUSA: Ponto[] = [[11, 10], [17, 10], [17, 26], [11, 26], [20, 10], [26, 10], [26, 26], [20, 26]];
const caminho = (p: Ponto[]) => {
  const s = ([x, y]: Ponto) => `${x.toFixed(2)} ${y.toFixed(2)}`;
  return `M${s(p[0])}L${s(p[1])}L${s(p[2])}L${s(p[3])}Z M${s(p[4])}L${s(p[5])}L${s(p[6])}L${s(p[7])}Z`;
};
/** Sai depressa e passa um pouco do ponto antes de assentar (a mola do ícone). */
const comSobra = (x: number) => 1 + 2.3 * (x - 1) ** 3 + 1.3 * (x - 1) ** 2;

function caboDoCarimbo(r: Relogio): HTMLButtonElement {
  const botao = el(
    "button",
    "r5-cabo",
    `<svg viewBox="0 0 36 36" aria-hidden="true"><path class="r5-icone" d="${caminho(PLAY)}"/></svg>`,
  );
  botaoTocar(botao, r);
  const icone = botao.querySelector("path")!;
  let atual = PLAY.map((p) => [...p] as Ponto);
  let alvo = PLAY;
  let quadro = 0;
  r.ouvir((e) => {
    const novo = e.tocando ? PAUSA : PLAY;
    if (novo === alvo) return;
    alvo = novo;
    cancelAnimationFrame(quadro);
    if (r.reduzido) {
      atual = novo.map((p) => [...p] as Ponto);
      icone.setAttribute("d", caminho(atual));
      return;
    }
    const de = atual.map((p) => [...p] as Ponto);
    const inicio = performance.now();
    const passo = (agora: number) => {
      const x = Math.min(1, (agora - inicio) / 340);
      const k = comSobra(x);
      atual = de.map(([px, py], i) => [px + (novo[i][0] - px) * k, py + (novo[i][1] - py) * k]);
      icone.setAttribute("d", caminho(atual));
      if (x < 1) quadro = requestAnimationFrame(passo);
    };
    quadro = requestAnimationFrame(passo);
  });
  return botao;
}

/* ---------- o numerador: rodas de 0 a 9 que giram, como num contador mecânico ---------- */

type Giro = "direto" | "frente" | "tras" | "zerar";
/** A fita de cada roda tem três voltas de 0 a 9: dá para girar sempre para a frente (9 → 0) e dar a volta de zerar. */
const VOLTAS = 3;

class Roda {
  readonly el = el("span", "r5-roda");
  private fita = el("span", "r5-fita");
  private digitos: HTMLElement[] = [];
  private pos = 0;

  constructor(private reduzido: boolean) {
    for (let i = 0; i < VOLTAS * 10; i++) {
      const d = el("i", undefined, String(i % 10));
      this.digitos.push(d);
      this.fita.append(d);
    }
    this.el.append(this.fita);
    this.fita.addEventListener("transitionend", () => this.assentar());
  }

  get valor() {
    return this.pos % 10;
  }

  private por(pos: number, comTransicao: boolean) {
    if (!comTransicao) this.fita.style.transition = "none";
    this.pos = pos;
    this.fita.style.setProperty("--k", String(pos));
    if (!comTransicao) {
      void this.fita.offsetHeight;
      this.fita.style.transition = "";
    }
  }

  /** Depois de girar, a fita volta, sem ninguém ver, para a primeira volta (o mesmo dígito). */
  private assentar() {
    if (this.pos >= 10) this.por(this.pos % 10, false);
  }

  ir(v: number, giro: Giro, atraso = 0) {
    if (giro === "direto" || this.reduzido) {
      this.por(v, false);
      return;
    }
    if (v === this.valor) return;
    this.assentar();
    const a = this.pos;
    let destino = v;
    if (giro === "tras") {
      // Para trás passando pelo 0 (0 → 9): a fita começa uma volta acima e desce.
      if (v > a) this.por(a + 10, false);
    } else if (v <= a) destino = v + 10;
    if (giro === "zerar" && destino - a < 6) destino += 10;
    const zerar = giro === "zerar";
    const duracao = zerar ? 760 : 520;
    this.fita.style.transitionDuration = `${duracao}ms`;
    this.fita.style.transitionTimingFunction = zerar ? "cubic-bezier(.45, 0, .15, 1)" : MOLA;
    this.fita.style.transitionDelay = `${atraso}ms`;
    this.por(destino, true);
    // O dígito que chega entra inclinado, como na curva da roda, e assenta na janela.
    this.digitos[destino].animate(
      [
        { transform: "perspective(120px) rotateX(-40deg) translateY(3px)", filter: "blur(1.2px)", opacity: 0.35 },
        { transform: "none", filter: "blur(0)", opacity: 1 },
      ],
      { duration: 340, delay: atraso + duracao * (zerar ? 0.55 : 0.12), easing: SUAVE, fill: "backwards" },
    );
  }
}

function numerador(r: Relogio) {
  const caixa = el("span", "r5-numerador");
  caixa.setAttribute("aria-hidden", "true");
  const rotulo = el("span", "r5-num-rotulo", r.caso === "passos" ? "passo" : r.caso === "comparacao" ? "estado" : "tempo");
  const janela = el("span", "r5-janela");
  const total = el("span", "r5-num-total");
  const rodas: Roda[] = [];
  const quantas = r.caso === "animacao" ? 4 : 2;
  for (let i = 0; i < quantas; i++) {
    if (r.caso === "animacao" && i === 2) janela.append(el("b", "r5-dois-pontos", ":"));
    const roda = new Roda(r.reduzido);
    rodas.push(roda);
    janela.append(roda.el);
  }
  caixa.append(rotulo, janela, total);

  const valorDe = (e: Estado) =>
    r.caso === "animacao" ? Math.floor(e.t * r.duracao + 1e-6) : e.indice >= 0 ? e.indice + 1 : r.marcas.length;
  let anterior: { v: number; t: number } | null = null;
  r.ouvir((e) => {
    const texto = r.caso === "animacao" ? `de ${relogioDe(Math.round(r.duracao))}` : `de ${dois(r.marcas.length)}`;
    if (total.textContent !== texto) total.textContent = texto;
    const v = valorDe(e);
    if (anterior && v === anterior.v) {
      anterior.t = e.t;
      return;
    }
    const digitos = [...(r.caso === "animacao" ? relogioDe(v).replace(":", "") : dois(v))].map(Number);
    let giro: Giro = "direto";
    // Voltar ao começo depois do fim (recomeçar, ou a volta do play) zera o numerador: as rodas giram para a
    // frente até o zero, da direita para a esquerda. Arrastar para trás desce as rodas.
    if (anterior) giro = v > anterior.v ? "frente" : e.t < 0.001 && anterior.t > 0.97 ? "zerar" : "tras";
    rodas.forEach((roda, i) => roda.ir(digitos[i], giro, giro === "zerar" ? (rodas.length - 1 - i) * 70 : 0));
    anterior = { v, t: e.t };
  });
  return caixa;
}

/* ---------- os carimbos ---------- */

const GIROS = [-6, -3, -8.5, -4.5, -7.5, -2.5];

function carimbo(texto: string, i: number) {
  const c = el("span", "r5-carimbo", texto);
  c.setAttribute("aria-hidden", "true");
  carimboNaPosicao(c, i);
  return c;
}

/** Cada carimbada sai um pouco girada e com a tinta falhando num lugar diferente. */
function carimboNaPosicao(c: HTMLElement, i: number) {
  const giro = GIROS[i % GIROS.length];
  c.dataset.giro = String(giro);
  c.style.setProperty("--giro", `${giro}deg`);
  c.style.setProperty("--mx", `${(i * 41) % 110}px`);
  c.style.setProperty("--my", `${(i * 17) % 50}px`);
}

/** O "tum": o carimbo desce grande e desfocado, bate, passa um nada do ponto e assenta; o papel afunda junto. */
function bater(c: HTMLElement, atraso: number, papel?: HTMLElement) {
  const g = `rotate(${c.dataset.giro ?? -6}deg)`;
  for (const a of c.getAnimations()) a.cancel();
  c.animate(
    [
      { opacity: 0, transform: `${g} scale(1.45)`, filter: "blur(1.6px)" },
      { opacity: 1, transform: `${g} scale(.95)`, filter: "blur(0)", offset: 0.45 },
      { opacity: 1, transform: `${g} scale(1.025)`, filter: "blur(0)", offset: 0.72 },
      { opacity: 1, transform: `${g} scale(1)`, filter: "blur(0)" },
    ],
    { duration: 380, delay: atraso, easing: "cubic-bezier(.3, .6, .4, 1)", fill: "backwards" },
  );
  papel?.animate([{ transform: "none" }, { transform: "translateY(1.5px)", offset: 0.35 }, { transform: "none" }], {
    duration: 200,
    delay: atraso + 150,
    easing: "ease-out",
  });
}

/** Ao voltar no tempo, o carimbo sai: sobe um pouco e some. */
function levantar(c: HTMLElement, atraso = 0) {
  const g = `rotate(${c.dataset.giro ?? -6}deg)`;
  for (const a of c.getAnimations()) a.cancel();
  c.animate(
    [
      { opacity: 0.92, transform: `${g} scale(1)` },
      { opacity: 0, transform: `${g} scale(1.12) translateY(-2px)` },
    ],
    { duration: 220, delay: atraso, easing: "ease-in", fill: "backwards" },
  );
}

/* ---------- o picote: o cartão de ponto, que o furador vai furando ---------- */

const FURADOR = `<svg class="r5-furador-desenho" viewBox="0 0 24 36" aria-hidden="true">
  <path class="r5-guia" d="M12 29.4 V35"/>
  <g class="r5-cabeca">
    <path class="r5-cabeca-corpo" d="M3 9.5 V6.5 C3 2.8 7 1 12 1 C17 1 21 2.8 21 6.5 V9.5 Z"/>
    <rect class="r5-pino" x="10.25" y="9" width="3.5" height="10.2" rx="1"/>
  </g>
  <circle class="r5-anel" cx="12" cy="24" r="5.4"/>
</svg>`;

function picote(r: Relogio, figura: HTMLElement) {
  const faixa = el("div", "r5-picote");
  const quadro = el("div", "r5-quadro");
  const banda = el("span", "r5-banda");
  const colunaAtual = el("span", "r5-coluna-atual");
  const colunas = el("span", "r5-colunas");
  const furosEl = el("span", "r5-furos");
  const furador = el("span", "r5-furador", FURADOR);
  const mira = el("span", "r5-mira");
  for (const x of [banda, colunaAtual, colunas, furosEl, mira, furador]) x.setAttribute("aria-hidden", "true");
  quadro.append(banda, colunaAtual, colunas, furosEl, mira, furador);
  faixa.append(quadro);
  faixaDoTempo(faixa, r, { area: quadro });
  const cabeca = furador.querySelector<SVGGElement>(".r5-cabeca")!;
  const anel = furador.querySelector<SVGCircleElement>(".r5-anel")!;

  // As colunas do cartão: uma por passo (ou estado); na animação, uma por segundo.
  let limites: number[] = [];
  let rotulos: HTMLElement[] = [];
  let duracaoMontada = 0;
  const montarColunas = () => {
    if (r.duracao === duracaoMontada) return;
    duracaoMontada = r.duracao;
    const segundos = Math.max(1, Math.round(r.duracao));
    const novos = r.caso === "animacao" ? Array.from({ length: segundos }, (_, s) => s / segundos) : r.marcas.map((m) => m.de);
    if (novos.join() === limites.join()) return;
    limites = novos;
    colunas.replaceChildren();
    rotulos = limites.map((de, i) => {
      if (de > 0) {
        const fio = el("i", "r5-fio");
        fio.style.left = `${de * 100}%`;
        colunas.append(fio);
      }
      const n = el("b", "r5-col-num", r.caso === "animacao" ? `${i}<small>s</small>` : String(i + 1));
      n.style.left = `${de * 100}%`;
      colunas.append(n);
      return n;
    });
  };
  montarColunas();

  // Os furos: tantos quantos cabem (um a cada 11px), refeitos quando a largura muda.
  let furos: HTMLElement[] = [];
  let furados = 0;
  const furar = (f: HTMLElement, atraso: number, bolinha: boolean) => {
    for (const a of f.getAnimations({ subtree: true })) a.cancel();
    f.firstElementChild!.animate(
      [
        { opacity: 0, transform: "scale(.25)" },
        { opacity: 1, transform: "scale(1)" },
      ],
      { duration: 260, delay: atraso, easing: MOLA, fill: "backwards" },
    );
    // A bolinha de papel que sai do furo e cai (num arrasto rápido, não: viraria confete).
    if (!bolinha) return;
    f.animate(
      [
        { opacity: 1, transform: "translate(0, 0) rotate(0deg)" },
        { opacity: 1, transform: "translate(.6px, 3px) rotate(30deg)", offset: 0.3 },
        { opacity: 0, transform: "translate(2.5px, 13px) rotate(110deg)" },
      ],
      { duration: 460, delay: atraso, easing: "cubic-bezier(.4, 0, .9, .5)", fill: "backwards", pseudoElement: "::after" },
    );
  };
  const tapar = (f: HTMLElement, atraso: number) => {
    for (const a of f.getAnimations({ subtree: true })) a.cancel();
    f.firstElementChild!.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, delay: atraso, easing: "ease-out", fill: "backwards" });
  };
  const aplicar = (t: number, animar: boolean, escalonar: boolean) => {
    const n = furos.length;
    if (!n) return;
    const k = Math.min(n, Math.max(0, Math.floor(t * n + 0.5)));
    if (k === furados) return;
    const de = furados;
    furados = k;
    const passo = escalonar ? Math.min(14, 420 / Math.abs(k - de)) : 0;
    if (k > de) {
      for (let i = de; i < k; i++) {
        furos[i].classList.add("furado");
        if (animar) furar(furos[i], (i - de) * passo, escalonar || k - de <= 2);
      }
    } else {
      for (let i = de - 1; i >= k; i--) {
        furos[i].classList.remove("furado");
        if (animar) tapar(furos[i], (de - 1 - i) * passo);
      }
    }
  };
  const montarFuros = () => {
    const n = Math.max(12, Math.round(quadro.clientWidth / 11));
    if (n === furos.length) return;
    furosEl.replaceChildren();
    furos = Array.from({ length: n }, (_, i) => {
      const f = el("span", "r5-furo", "<b></b>");
      f.style.left = `${((i + 0.5) / n) * 100}%`;
      furosEl.append(f);
      return f;
    });
    furados = 0;
    aplicar(r.estado().t, false, false);
  };
  new ResizeObserver(montarFuros).observe(quadro);

  // A mira: com o mouse sobre o picote, um aro tracejado marca o furo onde o clique vai chegar.
  faixa.addEventListener("pointermove", (ev) => {
    if (ev.pointerType !== "mouse" || !furos.length) return;
    const c = quadro.getBoundingClientRect();
    const n = furos.length;
    const i = Math.min(n - 1, Math.max(0, Math.floor(((ev.clientX - c.left) / c.width) * n)));
    mira.style.left = `${((i + 0.5) / n) * 100}%`;
    mira.classList.add("visivel");
  });
  faixa.addEventListener("pointerleave", () => mira.classList.remove("visivel"));

  // A coluna da vez fica levemente tingida; o tingido corre de uma coluna para a outra.
  let colunaDaVez = -2;
  const marcarColuna = (i: number) => {
    if (i === colunaDaVez) return;
    const antes = colunaDaVez;
    colunaDaVez = i;
    rotulos.forEach((n, j) => n.classList.toggle("atual", j === i));
    if (i < 0) {
      colunaAtual.classList.remove("visivel");
      return;
    }
    const fim = limites[i + 1] ?? 1;
    if (antes < 0) colunaAtual.classList.add("direto");
    colunaAtual.style.left = `${limites[i] * 100}%`;
    colunaAtual.style.width = `${(fim - limites[i]) * 100}%`;
    if (antes < 0) {
      void colunaAtual.offsetWidth;
      colunaAtual.classList.remove("direto");
    }
    colunaAtual.classList.add("visivel");
    // Tocando, a cada coluna nova o furador bate (o "tum" do furo da coluna).
    if (!r.reduzido && r.estado().tocando && i > antes && antes >= 0) {
      cabeca.animate([{ transform: "none" }, { transform: "translateY(3px)", offset: 0.4 }, { transform: "none" }], {
        duration: 220,
        easing: "ease-out",
      });
      anel.animate([{ transform: "scale(1)" }, { transform: "scale(.7)", offset: 0.4 }, { transform: "scale(1)" }], {
        duration: 260,
        easing: MOLA,
      });
    }
  };

  let tAnterior = r.estado().t;
  r.ouvir((e) => {
    montarColunas();
    faixa.style.setProperty("--t", String(e.t));
    const arrastando = faixa.classList.contains("arrastando");
    // Tocando ou arrastando, os furos acompanham um a um; num salto (passo, setas), abrem em sequência.
    const salto = Math.abs(e.t - tAnterior) > 0.04 && !arrastando;
    aplicar(e.t, !r.reduzido, salto && !(e.tocando && e.t === 0));
    tAnterior = e.t;
    const coluna =
      r.caso === "animacao"
        ? e.mexeu || e.tocando
          ? Math.min(limites.length - 1, Math.floor(e.t * limites.length))
          : -1
        : e.indice;
    marcarColuna(coluna);
    figura.classList.toggle("r5-tocando", e.tocando && !e.noFim);
  });
  return faixa;
}

/* ---------- as fichas: passos, comparação e animação ---------- */

function fichaDePassos(r: Relogio) {
  const ficha = el("div", "r5-ficha r5-ficha-passos");
  const cabecalho = el("div", "r5-cabecalho", "<span>nº</span><span>passo</span><span>visto</span>");
  cabecalho.setAttribute("aria-hidden", "true");
  const corpo = el("div", "r5-corpo");
  const marcador = el("span", "r5-marcador");
  marcador.setAttribute("aria-hidden", "true");
  const lista = el("ol", "r5-passos");
  const linhas: HTMLElement[] = [];
  const carimbos: HTMLElement[] = [];
  const itens = r.marcas.map((m, i) => {
    const li = el("li");
    const botao = el("button", "r5-passo", `<span class="r5-n">${dois(i + 1)}</span><span class="r5-texto">${m.texto}</span>`);
    botao.type = "button";
    const visto = el("span", "r5-visto");
    const c = carimbo("feito", i);
    visto.append(c);
    botao.append(visto);
    li.append(botao);
    lista.append(li);
    linhas.push(botao);
    carimbos.push(c);
    return botao;
  });
  corpo.append(marcador, lista);
  ficha.append(cabecalho, corpo);
  listaDePassos(itens, r);

  // Feito: os passos que ficaram para trás e, no fim do tempo, todos (a lousa completa é a ficha toda
  // carimbada).
  let carimbados = new Set<number>();
  let primeira = true;
  r.ouvir((e) => {
    const quer = new Set(r.marcas.map((_, i) => i).filter((i) => e.indice > i || e.t >= 1 - 1e-6));
    const novos = [...quer].filter((i) => !carimbados.has(i)).sort((a, b) => a - b);
    const sairam = [...carimbados].filter((i) => !quer.has(i)).sort((a, b) => b - a);
    if (!novos.length && !sairam.length) return;
    novos.forEach((i, k) => {
      linhas[i].classList.add("carimbado");
      if (!primeira && !r.reduzido) bater(carimbos[i], k * 110, linhas[i]);
    });
    sairam.forEach((i, k) => {
      linhas[i].classList.remove("carimbado");
      if (!primeira && !r.reduzido) levantar(carimbos[i], k * 45);
    });
    carimbados = quer;
    primeira = false;
  });

  // A linha da vez fica marcada: uma faixa só, medida, que corre de uma linha para a outra.
  let daVez = -1;
  const posicionar = (direto: boolean) => {
    if (daVez < 0) return;
    const li = itens[daVez].parentElement!;
    if (direto) marcador.classList.add("direto");
    marcador.style.transform = `translateY(${li.offsetTop}px)`;
    marcador.style.height = `${li.offsetHeight}px`;
    if (direto) {
      void marcador.offsetWidth;
      marcador.classList.remove("direto");
    }
  };
  aoMudarDePasso(r, (i, antes) => {
    daVez = i;
    marcador.classList.toggle("visivel", i >= 0);
    posicionar(antes < 0);
  });
  new ResizeObserver(() => posicionar(true)).observe(lista);
  return ficha;
}

function fichaDeComparacao(r: Relogio) {
  const ficha = el("div", "r5-ficha r5-ficha-comparacao");
  const cabecalho = el("div", "r5-cabecalho", "<span>nº</span><span>estado</span>");
  cabecalho.setAttribute("aria-hidden", "true");
  const linha = el("div", "r5-linha carimbado");
  linha.setAttribute("aria-hidden", "true");
  const n = el("span", "r5-n");
  const selo = carimbo("", 0);
  selo.classList.add("r5-selo");
  n.append(selo);
  // Todos os estados no mesmo lugar (só o da vez aparece): a linha tem a altura do mais longo.
  const estados = el("span", "r5-estados");
  const textos = r.marcas.map((m) => {
    const p = el("span", "r5-estado", m.texto);
    estados.append(p);
    return p;
  });
  linha.append(n, estados);
  ficha.append(cabecalho, linha);

  let mostrado = -1;
  aoMudarDePasso(r, (i, antes) => {
    const k = i >= 0 ? i : r.marcas.length - 1;
    if (k === mostrado) return;
    mostrado = k;
    selo.innerHTML = `<small>nº</small>${dois(k + 1)}`;
    carimboNaPosicao(selo, k);
    textos.forEach((p, j) => p.classList.toggle("atual", j === k));
    if (antes === -2 || r.reduzido) return;
    // O numerador carimba o número do estado, e o texto sai datilografado.
    bater(selo, 0, linha);
    textos[k].animate([{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }], {
      duration: 560,
      delay: 120,
      easing: "steps(28, end)",
      fill: "backwards",
    });
  });
  return ficha;
}

function fichaDaAnimacao(r: Relogio, figura: HTMLElement) {
  const ficha = el("div", "r5-ficha r5-ficha-animacao");
  const cabecalho = el("div", "r5-cabecalho", "<span>legenda</span><span>visto</span>");
  cabecalho.setAttribute("aria-hidden", "true");
  const linha = el("div", "r5-linha");
  const texto = el("p", "r5-texto", figura.dataset.legenda ?? "");
  const visto = el("span", "r5-visto");
  const fim = carimbo("fim", 2);
  visto.append(fim);
  linha.append(texto, visto);
  ficha.append(cabecalho, linha);

  // No fim da volta, a ficha leva o carimbo "fim"; quando recomeça, o carimbo sai.
  let carimbado: boolean | undefined;
  r.ouvir((e) => {
    const quer = e.t >= 1 - 1e-6;
    if (quer === carimbado) return;
    const primeira = carimbado === undefined;
    carimbado = quer;
    linha.classList.toggle("carimbado", quer);
    if (primeira || r.reduzido) return;
    if (quer) bater(fim, 60, linha);
    else levantar(fim);
  });
  return ficha;
}

/* ---------- a montagem ---------- */

const ZERAR = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.4 13.6 A6.6 6.6 0 1 1 16.3 7.2"/><path d="M17.6 3.6 L17 8 L12.7 7.3"/></svg>`;

export default function montar(r: Relogio, controles: HTMLElement, figura: HTMLElement) {
  figura.classList.add("r5");
  const painel = el("div", "r5-painel");
  const cabo = caboDoCarimbo(r);
  cabo.classList.add("r5-area-cabo");

  // O contador: o numerador e, na animação, o botão de zerar (o de recomeçar), como num contador de mão.
  const contador = el("div", "r5-contador");
  contador.append(numerador(r));
  if (r.caso === "animacao") {
    const zerar = el("button", "r5-zerar", ZERAR);
    botaoRecomecar(zerar, r);
    zerar.addEventListener("click", () => {
      if (r.reduzido) return;
      zerar.querySelector("svg")!.animate(
        [{ transform: "rotate(0deg)" }, { transform: "rotate(-25deg)", offset: 0.2 }, { transform: "rotate(360deg)" }],
        { duration: 900, easing: "cubic-bezier(.65, 0, .35, 1)" },
      );
    });
    contador.append(zerar);
  }

  painel.append(cabo, picote(r, figura), contador);
  controles.append(painel);

  if (r.caso === "passos") controles.append(fichaDePassos(r));
  else if (r.caso === "comparacao") controles.append(fichaDeComparacao(r));
  else controles.append(fichaDaAnimacao(r, figura));

  r.ouvir((e) => figura.classList.toggle("r5-no-fim", e.noFim));
}
