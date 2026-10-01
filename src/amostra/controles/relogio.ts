/**
 * Protótipo dos controles (/amostra/controles/, só no dev): o relógio comum aos três casos. Ele guarda o
 * tempo (0 a 1), toca, pausa, recomeça e leva a um passo, e desenha o instante no desenho de verdade: nas
 * lousas, pelo motor das lousas (src/scripts/lousa.ts, com a canetinha); na animação, pela linha do tempo
 * GSAP do post. Cada opção de controles só ouve o relógio e chama os métodos dele.
 *
 * Como no site: a lousa começa completa e parada; a animação abre tocando quando aparece na tela (nunca
 * com movimento reduzido); no fim, 5 s parado no quadro final e recomeça; fora da tela, pausa.
 */
import { prepararLousa } from "../../scripts/lousa";
import { carregarGsap, type GSAP } from "../../scripts/gsap";

export type Caso = "animacao" | "passos" | "comparacao";

export interface Marca {
  de: number;
  /** HTML curto (o texto do passo, com `código` e **negrito** já convertidos). */
  texto: string;
}

export interface Estado {
  /** O instante, de 0 a 1. */
  t: number;
  tocando: boolean;
  /** Parado no quadro final, esperando para recomeçar (os 5 s do fim). */
  noFim: boolean;
  /** O passo (ou estado) da vez; -1 antes de a pessoa mexer (a lousa começa completa, sem passo aceso). */
  indice: number;
  /** A pessoa já mexeu (play, arrasto, clique). */
  mexeu: boolean;
}

export interface Relogio {
  caso: Caso;
  marcas: Marca[];
  /** Uma volta, em segundos. */
  duracao: number;
  reduzido: boolean;
  estado(): Estado;
  tocar(): void;
  pausar(): void;
  alternar(): void;
  recomecar(): void;
  /** Um gesto (arrasto, clique na faixa): pausa e leva ao instante t, com a canetinha desenhando. */
  ir(t: number): void;
  /** O clique num passo: o fim dele, com tudo o que a linha diz já desenhado. */
  irParaPasso(i: number): void;
  /** Recebe o estado a cada quadro e a cada mudança. Devolve a função que para de ouvir. */
  ouvir(fn: (e: Estado) => void): () => void;
}

const PAUSA_NO_FIM = 5000;
type Montar = (gsap: GSAP, svg: SVGSVGElement) => gsap.core.Timeline;
const animacoes = import.meta.glob<{ default: Montar }>("../../animacoes/**/*.ts");

export function criarRelogio(figura: HTMLElement, svg: SVGSVGElement): Relogio {
  const caso = figura.dataset.caso as Caso;
  const marcas: Marca[] = JSON.parse(figura.dataset.marcas ?? "[]");
  const reduzido = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let duracao = Number(figura.dataset.duracao ?? 7);

  // O desenho: a lousa pelo motor; a animação pela linha do tempo GSAP (carregada na primeira vez).
  let desenhar: (t: number, caneta: boolean) => void;
  let preparar: () => Promise<void> = () => Promise.resolve();
  if (caso === "animacao") {
    let linha: gsap.core.Timeline | undefined;
    const carregar = animacoes[`../../animacoes/${figura.dataset.animacao}.ts`];
    let carregando: Promise<void> | undefined;
    const garantir = () =>
      (carregando ??= Promise.all([carregarGsap(), carregar()]).then(([gsap, modulo]) => {
        linha = modulo.default(gsap, svg);
        linha.pause();
        duracao = linha.duration();
      }));
    desenhar = (t) => {
      if (linha) linha.progress(t);
      else void garantir().then(() => linha!.progress(t));
    };
    // O tocar espera a linha do tempo existir.
    preparar = garantir;
  } else {
    const lousa = prepararLousa(svg);
    desenhar = (t, caneta) => lousa.desenhar(t * lousa.fim, caneta);
  }

  const ouvintes = new Set<(e: Estado) => void>();
  const e: Estado = { t: 1, tocando: false, noFim: false, indice: -1, mexeu: false };
  const indiceDe = (t: number) => (e.mexeu ? marcas.findLastIndex((m) => t >= m.de - 1e-6) : -1);
  const avisar = () => {
    e.indice = indiceDe(e.t);
    for (const fn of ouvintes) fn({ ...e });
  };
  const mostrar = (t: number, caneta: boolean) => {
    e.t = Math.min(1, Math.max(0, t));
    desenhar(e.t, caneta && !reduzido);
    avisar();
  };

  let quadro = 0;
  let anterior = 0;
  let segurarAte = 0;
  const passo = (agora: number) => {
    if (!e.tocando) return;
    const dt = anterior ? Math.min(agora - anterior, 64) : 0;
    anterior = agora;
    if (segurarAte) {
      if (agora >= segurarAte) {
        segurarAte = 0;
        e.noFim = false;
        mostrar(0, true);
      }
    } else {
      mostrar(e.t + dt / (duracao * 1000), true);
      if (e.t >= 1) {
        segurarAte = agora + PAUSA_NO_FIM;
        e.noFim = true;
        mostrar(1, false);
      }
    }
    quadro = requestAnimationFrame(passo);
  };

  let querTocar = false;
  const tocar = () => {
    querTocar = true;
    e.mexeu = true;
    void preparar().then(() => {
      if (e.t >= 1 || e.noFim) {
        e.noFim = false;
        segurarAte = 0;
        mostrar(0, true);
      }
      e.tocando = true;
      anterior = 0;
      cancelAnimationFrame(quadro);
      quadro = requestAnimationFrame(passo);
      avisar();
    });
  };
  const pausar = () => {
    e.tocando = false;
    e.noFim = false;
    segurarAte = 0;
    cancelAnimationFrame(quadro);
    desenhar(e.t, false);
    avisar();
  };
  const relogio: Relogio = {
    caso,
    marcas,
    get duracao() {
      return duracao;
    },
    reduzido,
    estado: () => ({ ...e, indice: indiceDe(e.t) }),
    tocar,
    pausar: () => {
      querTocar = false;
      pausar();
    },
    alternar: () => (e.tocando ? relogio.pausar() : tocar()),
    recomecar: () => {
      e.t = 0;
      e.noFim = false;
      tocar();
    },
    ir: (t) => {
      querTocar = false;
      e.mexeu = true;
      if (e.tocando) pausar();
      mostrar(t, true);
    },
    irParaPasso: (i) => {
      querTocar = false;
      e.mexeu = true;
      if (e.tocando) pausar();
      mostrar(i + 1 < marcas.length ? marcas[i + 1].de - 0.0005 : 1, false);
    },
    ouvir: (fn) => {
      ouvintes.add(fn);
      fn(relogio.estado());
      return () => ouvintes.delete(fn);
    },
  };

  // Começa no quadro final, completo e parado; a animação abre tocando quando aparece (como no site).
  desenhar(1, false);
  new IntersectionObserver(
    ([entrada]) => {
      if (!entrada.isIntersecting && e.tocando) pausar();
      else if (entrada.isIntersecting && !e.tocando && (querTocar || (caso === "animacao" && !reduzido && !e.mexeu))) tocar();
    },
    { threshold: 0.35 },
  ).observe(figura);
  return relogio;
}
