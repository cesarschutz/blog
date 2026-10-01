/**
 * Opção 3, "Caderno e caneta": os controles são o pé de uma página de caderno de espiral, presa embaixo
 * do desenho pelos furinhos e pelos arames. Na margem (antes da linha vermelha) ficam os botões; na pauta,
 * a caneta azul escreve a linha do tempo, e a ponta da caneta é o cursor. Os números dos passos estão
 * escritos sobre a linha: o da vez ganha um círculo à caneta, e os que ficaram para trás, um tique.
 * Embaixo: a lista de tarefas com caixinhas (passos), a frase (animação) ou o estado da vez numa linha
 * reservada (comparação).
 */
import type { Relogio } from "./relogio";
import { aoMudarDePasso, botaoRecomecar, botaoTocar, el, faixaDoTempo, listaDePassos } from "./comum";
import { circuloDeCaneta, contornoDeCaneta, vistoDeCaneta } from "../../lib/traco";

/* ---------- os traços à mão (sempre os mesmos para a mesma semente) ---------- */

type Ponto = [number, number];

/** Sorteio com semente (mulberry32), como em src/lib/traco.ts. */
function sorteio(semente: number) {
  let s = semente | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f = (n: number) => n.toFixed(2);

/** Curva suave pelos pontos (Catmull-Rom em Bézier). */
function curva(p: Ponto[]) {
  let d = `M${f(p[0][0])} ${f(p[0][1])}`;
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[i - 1] ?? p[i];
    const b = p[i];
    const c = p[i + 1];
    const e = p[i + 2] ?? c;
    d += ` C${f(b[0] + (c[0] - a[0]) / 6)} ${f(b[1] + (c[1] - a[1]) / 6)} ${f(c[0] - (e[0] - b[0]) / 6)} ${f(c[1] - (e[1] - b[1]) / 6)} ${f(c[0])} ${f(c[1])}`;
  }
  return d;
}

/**
 * A linha que a caneta escreve, de 0 a `w` px, em volta de y = 0: quase reta, com a onda lenta da mão
 * (uma a cada ~240px) e um tremor miúdo. Gerada na largura real, para a onda ser a mesma em toda tela.
 */
function linhaEscrita(w: number, semente: number) {
  const r = sorteio(semente);
  const n = Math.max(4, Math.round(w / 22));
  const fase = r() * Math.PI * 2;
  const ondas = Math.max(1, w / 240);
  const p: Ponto[] = [];
  for (let i = 0; i <= n; i++) {
    const y = Math.sin(fase + (i / n) * ondas * Math.PI * 2) * 0.75 + (r() - 0.5) * 0.7;
    p.push([(w * i) / n, i === 0 ? y - 0.4 : y]);
  }
  return curva(p);
}

/** A caixinha da tarefa, numa caixa de 16 × 16: quatro lados levemente embarrigados, e o fim passa um nada do começo. */
function caixinha(semente: number) {
  const r = sorteio(semente);
  const j = (a: number) => (r() - 0.5) * 2 * a;
  const p: Ponto[] = [
    [2.4 + j(0.35), 2.7 + j(0.35)],
    [13.7 + j(0.35), 2.3 + j(0.35)],
    [13.9 + j(0.3), 13.7 + j(0.35)],
    [2.3 + j(0.35), 13.9 + j(0.3)],
    [2.2 + j(0.2), 1.6 + j(0.2)],
  ];
  let d = `M${f(p[0][0])} ${f(p[0][1])}`;
  for (let i = 1; i < p.length; i++) {
    const [x0, y0] = p[i - 1];
    const [x1, y1] = p[i];
    const l = Math.hypot(x1 - x0, y1 - y0) || 1;
    const b = j(0.45);
    d += ` Q${f((x0 + x1) / 2 - ((y1 - y0) / l) * b)} ${f((y0 + y1) / 2 + ((x1 - x0) / l) * b)} ${f(x1)} ${f(y1)}`;
  }
  return d;
}

/* ---------- os desenhos fixos ---------- */

/** A esferográfica de corpo transparente, deitada como na mão direita: a ponta na origem, o corpo subindo para a direita. */
const CANETA = `<svg class="c3-caneta-desenho" viewBox="-4 -48 76 54" width="76" height="54" aria-hidden="true"><g transform="rotate(-34)">
  <path class="c3-ponta" d="M0 0 L4.6 -1.25 L4.6 1.25 Z"/>
  <path class="c3-bico" d="M4.4 -1.5 C 8 -2.2 12 -3.8 15 -4.3 L15 4.3 C 12 3.8 8 2.2 4.4 1.5 Z"/>
  <rect class="c3-corpo" x="15" y="-4.3" width="50" height="8.6" rx="1.2"/>
  <path class="c3-carga" d="M7.5 0 H61"/>
  <path class="c3-aresta" d="M17.5 -1.9 H62"/>
  <rect class="c3-tampinha" x="64.2" y="-3.7" width="5.6" height="7.4" rx="1.6"/>
</g></svg>`;

/** O play e a pausa como dois quadriláteros que se transformam um no outro (caixa de 36). */
const PLAY: Ponto[] = [[11.5, 10], [18.5, 13.74], [18.5, 22.28], [11.5, 26], [18.5, 13.74], [26.5, 18], [26.5, 18], [18.5, 22.28]];
const PAUSA: Ponto[] = [[11, 10], [16.6, 10], [16.6, 26], [11, 26], [19.4, 10], [25, 10], [25, 26], [19.4, 26]];

const formaDoIcone = (k: number) => {
  const p = PLAY.map(([x, y], i) => [x + (PAUSA[i][0] - x) * k, y + (PAUSA[i][1] - y) * k]);
  const q = (a: number) => `${f(p[a][0])} ${f(p[a][1])}`;
  return `M${q(0)} L${q(1)} L${q(2)} L${q(3)} Z M${q(4)} L${q(5)} L${q(6)} L${q(7)} Z`;
};

const CONTORNO = contornoDeCaneta("caderno: tocar");
const TOCAR = `<svg class="c3-aro" viewBox="0 0 40 40" aria-hidden="true">
  <path class="c3-aro-base" d="${CONTORNO}"/>
  <path class="c3-aro-vivo" pathLength="1" d="${CONTORNO}"/>
</svg><svg class="c3-icone" viewBox="0 0 36 36" aria-hidden="true"><path d="${formaDoIcone(0)}"/></svg>`;

/** Recomeçar: a seta circular à caneta, no sentido de voltar. */
const RECOMECAR = `<svg viewBox="0 0 24 24" aria-hidden="true">
  <path class="c3-volta" pathLength="1" d="M4.7 12.6 C 4.9 16.8 8.3 19.9 12.4 19.7 C 16.7 19.5 19.9 15.9 19.6 11.7 C 19.3 7.5 15.8 4.4 11.7 4.6 C 9.3 4.7 7.3 5.8 5.8 7.7"/>
  <path class="c3-volta-ponta" pathLength="1" d="M5.1 3.4 C 5.3 5 5.5 6.4 5.8 8 C 7.3 7.9 8.7 7.7 10.3 7.4"/>
</svg>`;

/** A seta da margem que aponta a tarefa da vez. */
const SETA = `<svg viewBox="0 0 24 14" aria-hidden="true">
  <path class="c3-seta-haste" pathLength="1" d="M1.6 7.9 C 7 7 12.6 8 20.6 7.1"/>
  <path class="c3-seta-ponta" pathLength="1" d="M15.4 2.6 C 17.6 4.3 19.2 5.7 21.2 7.1 C 19.3 8.6 17.5 10 15.2 11.8"/>
</svg>`;

const circulo = (semente: string) =>
  `<svg class="c3-circulo" viewBox="0 0 48 48" aria-hidden="true"><path pathLength="1" d="${circuloDeCaneta(semente, 19.5, 17)}"/></svg>`;
const tique = (semente: string, classe = "c3-tique") =>
  `<svg class="${classe}" viewBox="0 0 14 14" aria-hidden="true"><path pathLength="1" d="${vistoDeCaneta(semente)}"/></svg>`;

/** Reinicia uma animação de CSS ligada a uma classe. */
function repetir(alvo: Element, classe: string) {
  alvo.classList.remove(classe);
  void (alvo as HTMLElement).offsetWidth;
  alvo.classList.add(classe);
}

export default function montar(r: Relogio, controles: HTMLElement, figura: HTMLElement) {
  figura.classList.add("c3");
  const semente = r.caso.length * 97 + r.marcas.length * 13;

  // A emenda com o desenho: os furinhos da espiral e os arames.
  const espiral = el("div", "c3-espiral");
  espiral.setAttribute("aria-hidden", "true");
  const pagina = el("div", "c3-pagina");
  pagina.append(espiral);
  controles.append(pagina);

  /* ---------- a linha do tempo: o play na margem e a linha escrita na pauta ---------- */

  const linhaDoTempo = el("div", "c3-tempo");
  const margem = el("div", "c3-margem");
  const tocar = el("button", "c3-tocar", TOCAR);
  margem.append(tocar);
  botaoTocar(tocar, r);

  const faixa = el("div", "c3-faixa");
  const trilho = el("div", "c3-trilho");
  const escrita = el(
    "div",
    "c3-escrita",
    `<svg aria-hidden="true"><path class="c3-ponta-inicio" d=""/><path class="c3-ponta-fim" d=""/><path class="c3-linha" d=""/></svg>`,
  );
  const caneta = el("div", "c3-caneta");
  const mao = el("div", "c3-mao", CANETA);
  caneta.append(mao);
  trilho.append(escrita, caneta);

  const numeros: HTMLElement[] = [];
  if (r.marcas.length) {
    const linhaNumeros = el("div", "c3-numeros");
    linhaNumeros.setAttribute("aria-hidden", "true");
    r.marcas.forEach((m, i) => {
      const n = el("span", "c3-numero", `<i>${i + 1}</i>${circulo(`caderno ${r.caso} ${i}`)}${tique(`caderno ${r.caso} ${i}`)}`);
      n.style.left = `${m.de * 100}%`;
      // O risquinho da marca cruza a linha; no começo, o risquinho do início já faz esse papel.
      if (m.de < 0.001) n.classList.add("c3-no-inicio");
      linhaNumeros.append(n);
      numeros.push(n);
    });
    trilho.append(linhaNumeros);
  } else {
    // Na animação, a pauta de baixo diz quanto a volta dura: 0 s no começo e a duração no fim.
    const linhaNumeros = el("div", "c3-numeros");
    linhaNumeros.setAttribute("aria-hidden", "true");
    const zero = el("span", "c3-numero c3-segundos c3-no-inicio", "<i>0 s</i>");
    const total = el("span", "c3-numero c3-segundos c3-no-inicio", "");
    zero.style.left = "0%";
    total.style.left = "100%";
    linhaNumeros.append(zero, total);
    trilho.append(linhaNumeros);
    r.ouvir(() => {
      const texto = `<i>${Math.round(r.duracao)} s</i>`;
      if (total.innerHTML !== texto) total.innerHTML = texto;
    });
  }
  faixa.append(trilho);
  faixaDoTempo(faixa, r, { area: trilho });
  linhaDoTempo.append(margem, faixa);
  pagina.append(linhaDoTempo);

  /* ---------- embaixo, na pauta: a frase, as tarefas ou o estado da vez ---------- */

  if (r.caso === "animacao") {
    const frase = el("div", "c3-frase");
    const recomecar = el("button", "c3-recomecar", RECOMECAR);
    botaoRecomecar(recomecar, r);
    recomecar.addEventListener("click", () => {
      if (!r.reduzido) repetir(recomecar, "c3-gira");
    });
    const lado = el("div", "c3-margem c3-margem-frase");
    lado.append(recomecar);
    frase.append(lado, el("p", "c3-texto-frase", figura.dataset.legenda ?? ""));
    pagina.append(frase);
  } else if (r.caso === "passos") {
    const lista = el("div", "c3-lista");
    const ol = el("ol", "c3-tarefas");
    const itens = r.marcas.map((m, i) => {
      const li = el("li");
      const botao = el(
        "button",
        "c3-tarefa",
        `<span class="c3-caixa"><svg class="c3-quadrado" viewBox="0 0 16 16" aria-hidden="true"><path d="${caixinha(semente + i * 31)}"/></svg>${tique(
          `tarefa ${i}`,
          "c3-tique c3-tique-caixa",
        )}</span><span class="c3-texto">${m.texto}</span>`,
      );
      botao.type = "button";
      li.append(botao);
      ol.append(li);
      return botao;
    });
    const seta = el("span", "c3-seta", SETA);
    seta.setAttribute("aria-hidden", "true");
    lista.append(ol, seta);
    pagina.append(lista);
    listaDePassos(itens, r);

    // A seta da margem: um indicador só, medido, que desliza até a tarefa da vez (com mola). Na primeira
    // aparição ela se escreve no lugar, sem deslizar; quando a lousa volta a ficar completa, some.
    let visivel = false;
    const posicionar = (i: number, direto: boolean) => {
      const alvo = itens[i];
      const y = alvo.offsetTop + Math.min(alvo.offsetHeight, parseFloat(getComputedStyle(alvo).lineHeight) || 28) / 2;
      if (direto) seta.classList.add("direto");
      seta.style.transform = `translateY(${f(y)}px)`;
      if (direto) {
        void seta.offsetWidth;
        seta.classList.remove("direto");
      }
    };
    let atual = -1;
    aoMudarDePasso(r, (i) => {
      atual = i;
      if (i < 0) {
        visivel = false;
        seta.classList.remove("visivel");
        return;
      }
      posicionar(i, !visivel);
      visivel = true;
      seta.classList.add("visivel");
    });
    new ResizeObserver(() => {
      if (atual >= 0) posicionar(atual, true);
    }).observe(ol);
  } else {
    // A comparação: o estado da vez numa linha reservada da pauta, com o número circulado na margem.
    const estado = el("div", "c3-estado");
    estado.setAttribute("aria-hidden", "true");
    const numero = el("span", "c3-margem c3-estado-numero", `<i></i>${circulo("caderno estado")}`);
    const texto = el("p", "c3-estado-texto");
    estado.append(numero, texto);
    pagina.append(estado);
    let mostrado = -2;
    r.ouvir((e) => {
      const i = e.indice >= 0 ? e.indice : r.marcas.length - 1;
      numero.classList.toggle("circulado", e.indice >= 0);
      if (i === mostrado) return;
      const primeira = mostrado === -2;
      mostrado = i;
      numero.querySelector("i")!.textContent = String(i + 1);
      texto.innerHTML = r.marcas[i]?.texto ?? "";
      if (!primeira && !r.reduzido) {
        repetir(numero, "trocou");
        repetir(texto, "escrevendo");
      }
    });
  }

  /* ---------- a linha escrita e a caneta acompanham o tempo ---------- */

  const svg = escrita.querySelector("svg")!;
  const linha = svg.querySelector<SVGPathElement>(".c3-linha")!;
  const inicio = svg.querySelector<SVGPathElement>(".c3-ponta-inicio")!;
  const fim = svg.querySelector<SVGPathElement>(".c3-ponta-fim")!;
  let largura = 0;
  let total = 0;
  let xs = new Float32Array(0);
  let ys = new Float32Array(0);
  let ls = new Float32Array(0);

  // A linha é gerada na largura real e amostrada: assim o traço escrito termina exatamente no x do
  // instante (o tempo é a posição na horizontal, não o comprimento da curva), e a caneta fica na ponta.
  const medir = () => {
    const w = Math.round(trilho.clientWidth);
    if (!w || w === largura) return;
    largura = w;
    svg.setAttribute("viewBox", `0 -8 ${w} 16`);
    svg.setAttribute("width", String(w));
    svg.setAttribute("height", "16");
    linha.setAttribute("d", linhaEscrita(w, semente));
    inicio.setAttribute("d", `M0.4 -4.2 C 0.1 -1.4 -0.1 1.6 0.3 4.4`);
    fim.setAttribute("d", `M${f(w - 0.2)} -4.6 C ${f(w + 0.2)} -1.6 ${f(w)} 1.4 ${f(w + 0.3)} 4.3`);
    total = linha.getTotalLength();
    const n = Math.max(24, Math.ceil(total / 3));
    xs = new Float32Array(n + 1);
    ys = new Float32Array(n + 1);
    ls = new Float32Array(n + 1);
    for (let i = 0; i <= n; i++) {
      const l = (total * i) / n;
      const p = linha.getPointAtLength(l);
      xs[i] = p.x;
      ys[i] = p.y;
      ls[i] = l;
    }
    linha.style.strokeDasharray = `${f(total)} ${f(total + 20)}`;
  };

  const aplicar = (t: number) => {
    if (!largura) return;
    const x = t * largura;
    let a = 0;
    let b = xs.length - 1;
    while (b - a > 1) {
      const m = (a + b) >> 1;
      if (xs[m] <= x) a = m;
      else b = m;
    }
    const k = xs[b] === xs[a] ? 0 : Math.min(1, Math.max(0, (x - xs[a]) / (xs[b] - xs[a])));
    const l = ls[a] + (ls[b] - ls[a]) * k;
    const y = ys[a] + (ys[b] - ys[a]) * k;
    linha.style.strokeDashoffset = f(total - l);
    // Ponta redonda só quando há traço (um traço de comprimento zero com ponta redonda vira um pingo).
    linha.style.strokeLinecap = l > 0.6 ? "round" : "butt";
    caneta.style.transform = `translate(${f(x)}px, ${f(y)}px)`;
  };

  // O instante desenhado (tv) persegue o do relógio (alvo). Tocando ou arrastando, segue junto (o arrasto
  // com uma suavização de poucos quadros, para o clique longe da caneta não teleportar); num salto (clique
  // num passo, setas, recomeçar, a volta do fim), a caneta desliza até lá em ~0,42 s, e ao voltar para o
  // início a linha se apaga recolhendo para dentro dela (~0,55 s).
  let tv = r.estado().t;
  let alvo = tv;
  let salto: { de: number; inicio: number; dur: number; volta: boolean } | null = null;
  let quadro = 0;
  const arrastando = () => faixa.classList.contains("arrastando");
  const suave = (p: number) => 1 - Math.pow(1 - p, 4);
  const emOnda = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  const laco = (agora: number) => {
    quadro = 0;
    if (salto) {
      const p = Math.min(1, (agora - salto.inicio) / salto.dur);
      tv = salto.de + (alvo - salto.de) * (salto.volta ? emOnda(p) : suave(p));
      if (p >= 1) {
        salto = null;
        tv = alvo;
        figura.classList.remove("c3-voltando");
      }
    } else if (arrastando() && Math.abs(alvo - tv) > 0.0015) {
      tv += (alvo - tv) * 0.45;
    } else {
      tv = alvo;
    }
    aplicar(tv);
    if (salto || Math.abs(alvo - tv) > 0.0005) quadro = requestAnimationFrame(laco);
  };
  r.ouvir((e) => {
    const antes = alvo;
    alvo = e.t;
    figura.classList.toggle("c3-escrevendo", e.tocando && !e.noFim);
    figura.classList.toggle("c3-no-fim", e.noFim);
    if (r.reduzido || !largura) {
      tv = alvo;
      aplicar(tv);
      return;
    }
    if (!arrastando() && Math.abs(alvo - antes) > 0.02) {
      const volta = alvo < tv - 0.25;
      salto = { de: tv, inicio: performance.now(), dur: volta ? 560 : 420, volta };
      figura.classList.toggle("c3-voltando", volta);
    }
    if (!quadro) quadro = requestAnimationFrame(laco);
  });
  new ResizeObserver(() => {
    medir();
    aplicar(tv);
  }).observe(trilho);
  medir();
  aplicar(tv);

  // Os números da linha: o da vez é circulado; os de trás ganham um tique. Tocando, a caneta dá um
  // pulinho ao passar por um número, como quem levanta a mão para circular.
  aoMudarDePasso(r, (i, antes) => {
    numeros.forEach((n, j) => {
      n.classList.toggle("atual", j === i);
      n.classList.toggle("passou", i >= 0 && j < i);
    });
    if (i > antes && antes >= 0 && r.estado().tocando && !r.reduzido) {
      mao.animate([{ translate: "0 0" }, { translate: "1px -5px", offset: 0.4 }, { translate: "0 0" }], {
        duration: 340,
        easing: "cubic-bezier(.34,1.56,.64,1)",
      });
    }
  });

  /* ---------- o play: o ícone se transforma (240 ms) e dá uma molinha ---------- */

  const icone = tocar.querySelector<SVGSVGElement>(".c3-icone")!;
  const forma = icone.querySelector("path")!;
  let k = 0;
  let quer = 0;
  let morfo = 0;
  r.ouvir((e) => {
    const novo = e.tocando ? 1 : 0;
    if (novo === quer) return;
    quer = novo;
    cancelAnimationFrame(morfo);
    if (r.reduzido) {
      k = quer;
      forma.setAttribute("d", formaDoIcone(k));
      return;
    }
    repetir(icone, "c3-mola");
    const de = k;
    const comeco = performance.now();
    const passo = (agora: number) => {
      const p = Math.min(1, (agora - comeco) / 240);
      k = de + (quer - de) * (1 - Math.pow(1 - p, 4));
      forma.setAttribute("d", formaDoIcone(k));
      if (p < 1) morfo = requestAnimationFrame(passo);
    };
    morfo = requestAnimationFrame(passo);
  });
}
