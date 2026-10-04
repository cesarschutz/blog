/**
 * Opção 2, "Marca-texto": a faixa do tempo é uma linha impressa em letra miúda (tracinhos cinza, como
 * palavras) e o progresso é uma passada de marca-texto amarelo por cima, com as pontas chanfradas e a tinta
 * mais forte onde a ponta parou. O cursor é o próprio marca-texto, deitado na linha, com a ponta encostada
 * no fim da passada. Os passos dividem a passada (a caneta levanta entre um e outro), e o texto embaixo do
 * desenho (a frase da animação, o passo ou o estado da vez) é grifado junto com o tempo.
 *
 * Na animação, os tracinhos da linha são as palavras da frase, em miniatura: quando a passada cobre um
 * tracinho, a palavra correspondente da frase fica grifada.
 */
import type { Estado, Relogio } from "./relogio";
import { aoMudarDePasso, botaoRecomecar, botaoTocar, el, faixaDoTempo, listaDePassos } from "./comum";

/** A falha entre dois passos na passada (a caneta levantou), em px. */
const FALHA = 4;
/** O deslize da passada num salto (clique num passo, setas, recomeçar), em ms. */
const DESLIZE = 480;
/** O deslize mais curto do primeiro toque na faixa (depois, o arrasto segue o dedo 1:1). */
const DESLIZE_TOQUE = 200;
/** O grifo que entra no passo (ou estado) da vez, da esquerda para a direita, em ms. */
const ENTRADA = 520;
/** O morph do play para a pausa, em ms. */
const MORPH = 240;
/** Palavras por passo na linha impressa (só o desenho da linha; o texto inteiro fica embaixo). */
const PALAVRAS_POR_PASSO = 12;

type Ponto = [number, number];
// O play e a pausa com os mesmos oito pontos (dois quadriláteros), para um virar o outro.
const PLAY: Ponto[] = [[11, 10], [18, 13.74], [18, 22.28], [11, 26], [18, 13.74], [26, 18], [26, 18], [18, 22.28]];
const PAUSA: Ponto[] = [[11, 10], [17, 10], [17, 26], [11, 26], [20, 10], [26, 10], [26, 26], [20, 26]];

// O marca-texto visto de cima, deitado, com a ponta (o feltro chanfrado) à esquerda e a tampa encaixada atrás.
const CANETA = `<svg class="m2-caneta" viewBox="0 0 54 24" aria-hidden="true">
  <path class="m2-c-bico" d="M9 5.4 L16 2.6 L16 21.4 L9 18.6 Z"/>
  <path class="m2-c-feltro" d="M0 19 L4 5 L9.6 5.6 L9.6 18.4 Z"/>
  <path class="m2-c-molhado" d="M0.5 18.4 L4.1 5.6"/>
  <rect class="m2-c-corpo" x="15.4" y="1.6" width="24.4" height="20.8" rx="3"/>
  <path class="m2-c-sombra" d="M18 19.6 H37"/>
  <rect class="m2-c-tampa" x="38.4" y="0.8" width="15" height="22.4" rx="4.5"/>
  <path class="m2-c-friso" d="M41.2 1.6 V22.4"/>
  <rect class="m2-c-clipe" x="32" y="10.5" width="20.4" height="3" rx="1.5"/>
  <path class="m2-c-brilho" d="M18.2 5 H36.4"/>
</svg>`;

const TOCAR = `<svg class="m2-anel" viewBox="0 0 56 56" aria-hidden="true"><circle cx="28" cy="28" r="26" pathLength="1"/></svg>
<svg class="m2-icone" viewBox="0 0 36 36" aria-hidden="true"><path class="m2-forma"/></svg>`;

const RECOMECAR = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.2 13.4 A7 7 0 1 0 7.4 7.2"/><path d="M6.6 3.6 L7.4 7.2 L3.8 8"/></svg>`;

const limitar = (v: number) => Math.min(1, Math.max(0, v));
/** in-out suave, para os deslizes da passada. */
const suave = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2);
const semMarcacao = (html: string) => html.replace(/<[^>]+>/g, "").replace(/&[a-z]+;/g, " ");

/** Guarda --p (de 0 a 1) num grifo só quando muda, para não escrever estilo a cada quadro à toa. */
function grifar(alvo: HTMLElement, p: number) {
  const v = p > 0.995 ? 1 : Math.round(p * 1000) / 1000;
  if (alvo.dataset.p === String(v)) return;
  alvo.dataset.p = String(v);
  alvo.style.setProperty("--p", String(v));
}

/** O play que vira pausa (e volta) por morph dos pontos, com um aperto de mola no toque. */
function iconeTocar(botao: HTMLButtonElement, r: Relogio) {
  const forma = botao.querySelector<SVGPathElement>(".m2-forma")!;
  let atual: Ponto[] = PLAY.map(([x, y]) => [x, y]);
  let quadro = 0;
  const desenhar = (p: Ponto[]) => {
    const q = (i: number) => `${p[i][0].toFixed(2)} ${p[i][1].toFixed(2)}`;
    forma.setAttribute("d", `M${q(0)} L${q(1)} L${q(2)} L${q(3)} Z M${q(4)} L${q(5)} L${q(6)} L${q(7)} Z`);
  };
  const ir = (alvo: Ponto[]) => {
    cancelAnimationFrame(quadro);
    if (r.reduzido) {
      atual = alvo.map(([x, y]) => [x, y]);
      return desenhar(atual);
    }
    const de = atual.map(([x, y]) => [x, y] as Ponto);
    const inicio = performance.now();
    const passo = () => {
      const p = limitar((performance.now() - inicio) / MORPH);
      const k = 1 - (1 - p) ** 4;
      atual = de.map(([x, y], i) => [x + (alvo[i][0] - x) * k, y + (alvo[i][1] - y) * k]);
      desenhar(atual);
      if (p < 1) quadro = requestAnimationFrame(passo);
    };
    quadro = requestAnimationFrame(passo);
  };
  desenhar(atual);
  let tocando = false;
  r.ouvir((e) => {
    if (e.tocando === tocando) return;
    tocando = e.tocando;
    ir(tocando ? PAUSA : PLAY);
    botao.classList.remove("aperta");
    void botao.offsetWidth;
    botao.classList.add("aperta");
  });
}

export default function montar(r: Relogio, controles: HTMLElement, figura: HTMLElement) {
  figura.classList.add("m2");
  const reduzido = r.reduzido;

  // ---------- a linha: o play (e o recomeçar), a faixa do tempo e o lugar do marca-texto no fim ----------
  const linha = el("div", "m2-linha");
  const botoes = el("div", "m2-botoes");
  const tocar = el("button", "m2-tocar", TOCAR);
  botoes.append(tocar);
  botaoTocar(tocar, r);
  iconeTocar(tocar, r);
  if (r.caso === "animacao") {
    const recomecar = el("button", "m2-recomecar", RECOMECAR);
    botoes.append(recomecar);
    botaoRecomecar(recomecar, r);
    recomecar.addEventListener("click", () => {
      recomecar.classList.remove("gira");
      void recomecar.offsetWidth;
      recomecar.classList.add("gira");
    });
  }

  const faixa = el("div", "m2-faixa");
  const numeros = el("div", "m2-numeros");
  const trilho = el("div", "m2-trilho");
  const previa = el("div", "m2-previa");
  const cursor = el("div", "m2-cursor", CANETA);
  faixa.append(numeros, trilho);
  linha.append(botoes, faixa);
  controles.append(linha);

  // As palavras da frase (animação) ou de cada passo (lousas), para os tracinhos da linha impressa.
  const frase = (figura.dataset.legenda ?? "").split(/\s+/).filter(Boolean);
  const fronteiras = r.marcas.length ? r.marcas.map((m) => m.de) : [0];
  const palavrasDe = (i: number) =>
    r.caso === "animacao" ? frase : semMarcacao(r.marcas[i].texto).split(/\s+/).filter(Boolean).slice(0, PALAVRAS_POR_PASSO);

  const segmentos = fronteiras.map((de, i) => {
    const ate = fronteiras[i + 1] ?? 1;
    const falha = i < fronteiras.length - 1 ? FALHA : 0;
    const seg = el("div", "m2-seg vazio");
    seg.style.left = `${de * 100}%`;
    seg.style.width = falha ? `calc(${(ate - de) * 100}% - ${falha}px)` : `${(ate - de) * 100}%`;
    const palavras = el("div", "m2-palavras");
    for (const p of palavrasDe(i)) {
      const tracinho = el("i", "m2-palavra");
      tracinho.style.flexGrow = String(p.length);
      palavras.append(tracinho);
    }
    const tinta = el("div", "m2-tinta");
    seg.append(palavras, tinta);
    trilho.append(seg);
    return { de, ate, falha, seg, tinta, f: -1 };
  });
  trilho.prepend(previa);
  trilho.append(cursor);
  faixaDoTempo(faixa, r, { area: trilho });

  // Os números dos passos (ou estados) sobre a linha, no começo de cada trecho; o da vez acende.
  const numerosDaFaixa = r.marcas.map((m, i) => {
    const n = el("span", "m2-n", String(i + 1));
    n.style.left = `${m.de * 100}%`;
    numeros.append(n);
    return n;
  });
  if (!numerosDaFaixa.length) faixa.classList.add("sem-numeros");

  // ---------- o texto embaixo: a frase, os passos ou o estado da vez ----------
  const texto = el("div", "m2-texto");
  let palavrasDaFrase: HTMLElement[] = [];
  let grifosDosPassos: HTMLElement[] = [];
  let grifosDosEstados: HTMLElement[] = [];
  let estados: HTMLElement[] = [];

  if (r.caso === "animacao") {
    const legenda = el("p", "m2-legenda");
    palavrasDaFrase = frase.map((p, i) => {
      const s = el("span", "m2-grifo");
      s.textContent = i < frase.length - 1 ? `${p} ` : p;
      legenda.append(s);
      return s;
    });
    texto.append(legenda);
  } else if (r.caso === "passos") {
    const lista = el("ol", "m2-passos");
    const itens = r.marcas.map((m, i) => {
      const li = el("li");
      const botao = el(
        "button",
        "m2-passo",
        `<span class="m2-passo-n">${i + 1}</span><span class="m2-passo-texto"><span class="m2-grifo">${m.texto}</span></span>`,
      );
      botao.type = "button";
      li.append(botao);
      lista.append(li);
      return botao;
    });
    grifosDosPassos = itens.map((b) => b.querySelector<HTMLElement>(".m2-grifo")!);
    texto.append(lista);
    listaDePassos(itens, r);
  } else {
    // Os estados empilhados no mesmo lugar: a altura é a do mais alto, e não muda na troca.
    const pilha = el("div", "m2-estados");
    pilha.setAttribute("aria-hidden", "true");
    estados = r.marcas.map((m, i) => {
      const p = el("p", "m2-estado", `<span class="m2-n m2-n-texto">${i + 1}</span> <span class="m2-grifo">${m.texto}</span>`);
      pilha.append(p);
      return p;
    });
    grifosDosEstados = estados.map((p) => p.querySelector<HTMLElement>(".m2-grifo")!);
    texto.append(pilha);
  }
  controles.append(texto);

  // ---------- o tempo mostrado: segue o relógio, mas desliza nos saltos ----------
  let estado: Estado = r.estado();
  let alvo = estado.t;
  let mostrado = alvo;
  let deslize: { de: number; inicio: number; dur: number } | null = null;
  let entradaInicio = -Infinity;
  let primeiroToque = false;
  let largura = 0;
  let inicios: number[] = [];
  let xFim = 0;
  let pairando: number | null = null;

  const fracao = (i: number) => limitar((mostrado - segmentos[i].de) / (segmentos[i].ate - segmentos[i].de));
  const entrada = () => (reduzido ? 1 : suave(limitar((performance.now() - entradaInicio) / ENTRADA)));

  const pintarPrevia = () => {
    if (pairando === null) return previa.classList.remove("visivel");
    previa.classList.add("visivel");
    const avanca = pairando >= xFim;
    previa.classList.toggle("recua", !avanca);
    previa.style.left = `${Math.min(pairando, xFim)}px`;
    previa.style.width = `${Math.abs(pairando - xFim)}px`;
  };

  const pintar = () => {
    if (deslize) {
      const p = limitar((performance.now() - deslize.inicio) / deslize.dur);
      mostrado = deslize.de + (alvo - deslize.de) * suave(p);
      if (p >= 1) deslize = null;
    } else mostrado = alvo;

    // A passada: cada trecho com a sua tinta; a caneta parada deixa a tinta mais forte na ponta.
    let k = 0;
    segmentos.forEach((s, i) => {
      if (mostrado >= s.de - 1e-6) k = i;
      const f = fracao(i);
      if (f !== s.f) {
        s.f = f;
        s.tinta.style.width = `${f * 100}%`;
        s.seg.classList.toggle("vazio", f <= 0);
        s.seg.classList.toggle("cheio", f >= 1);
      }
    });
    segmentos.forEach((s, i) => s.seg.classList.toggle("da-vez", i === k));
    const s = segmentos[k];
    xFim = s.de * largura + fracao(k) * ((s.ate - s.de) * largura - s.falha);
    cursor.style.transform = `translateX(${xFim.toFixed(2)}px)`;
    pintarPrevia();

    // O texto grifado junto com o tempo.
    if (palavrasDaFrase.length) {
      palavrasDaFrase.forEach((p, i) => {
        const a = inicios[i] ?? i / palavrasDaFrase.length;
        const b = inicios[i + 1] ?? (i + 1 < palavrasDaFrase.length ? (i + 1) / palavrasDaFrase.length : 1);
        grifar(p, limitar((mostrado - a) / Math.max(1e-6, b - a)));
      });
    }
    const i = estado.indice;
    grifosDosPassos.forEach((g, j) => grifar(g, j === i ? Math.min(fracao(j), entrada()) : i >= 0 && j < i ? 1 : 0));
    grifosDosEstados.forEach((g, j) => grifar(g, j === i ? Math.min(fracao(j), entrada()) : 0));
  };

  let laco = 0;
  const animando = () => deslize !== null || (!reduzido && performance.now() - entradaInicio < ENTRADA);
  const quadro = () => {
    laco = 0;
    pintar();
    if (animando()) laco = requestAnimationFrame(quadro);
  };
  const acordar = () => {
    if (!laco) laco = requestAnimationFrame(quadro);
  };

  r.ouvir((e) => {
    estado = e;
    const salto = Math.abs(e.t - alvo) > 0.02;
    if (salto) {
      const arrastando = faixa.classList.contains("arrastando");
      // O arrasto segue o dedo 1:1; o primeiro toque, os cliques, as setas e o recomeçar deslizam.
      if (!reduzido && largura > 0 && (!arrastando || primeiroToque)) {
        deslize = { de: mostrado, inicio: performance.now(), dur: arrastando ? DESLIZE_TOQUE : DESLIZE };
      }
      primeiroToque = false;
    }
    alvo = e.t;
    figura.classList.toggle("m2-tocando", e.tocando && !e.noFim);
    figura.classList.toggle("m2-no-fim", e.noFim);
    pintar();
    if (animando()) acordar();
  });

  aoMudarDePasso(r, (i) => {
    numerosDaFaixa.forEach((n, j) => n.classList.toggle("aceso", j === i));
    if (i >= 0) entradaInicio = performance.now();
    if (estados.length) {
      const vez = i >= 0 ? i : estados.length - 1;
      estados.forEach((p, j) => p.classList.toggle("vez", j === vez));
    }
    pintar();
    if (animando()) acordar();
  });

  faixa.addEventListener("pointerdown", () => (primeiroToque = true), { capture: true });
  for (const tipo of ["pointerup", "pointercancel"]) faixa.addEventListener(tipo, () => (primeiroToque = false));

  // A prévia com o mouse: até onde a passada iria (para a frente) ou o trecho que sairia (para trás).
  faixa.addEventListener("pointermove", (ev) => {
    if (ev.pointerType !== "mouse" || faixa.classList.contains("arrastando")) pairando = null;
    else pairando = Math.min(largura, Math.max(0, ev.clientX - trilho.getBoundingClientRect().left));
    pintarPrevia();
  });
  faixa.addEventListener("pointerleave", () => {
    pairando = null;
    pintarPrevia();
  });

  // A largura da linha (o marca-texto anda em px) e, na animação, onde começa cada tracinho.
  const medir = () => {
    const caixa = trilho.getBoundingClientRect();
    largura = caixa.width;
    if (palavrasDaFrase.length && caixa.width) {
      const tracinhos = segmentos[0].seg.querySelectorAll<HTMLElement>(".m2-palavra");
      inicios = [...tracinhos].map((t) => (t.getBoundingClientRect().left - caixa.left) / caixa.width);
    }
    pintar();
  };
  new ResizeObserver(medir).observe(trilho);
}
