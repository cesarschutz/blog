/**
 * Rodada 3 do redesenho (área A, T7): a lâmpada incandescente do lustre, que acende e apaga de verdade
 * (docs/redesenho/rodada-3/luz-realista.md, seção 1). Usada pela troca de tema (tema.ts).
 *
 * O filamento tem massa térmica: a temperatura T sobe e desce numa exponencial, mais devagar ao apagar.
 * A luz visível cresce muito mais rápido que T, e cada cor tem um expoente: a brasa (T^0,8) chega
 * primeiro e é a última a sair, o âmbar (T²) vem no meio, o branco quente (T^4,5) só perto do fim e
 * morre logo ao apagar. Ao ligar, um tremor de ~150ms (o contato), com senos defasados (sem acaso: o
 * filme repete). A ordem no tempo: o núcleo antes do halo, o halo antes do cone, a sala por último.
 *
 * Tudo vira keyframes de opacidade amostrados (um por quadro) e vai para o WAAPI, que roda no
 * compositor sem JavaScript por quadro: camadas de cor fixa que se cruzam, nunca cor animada.
 */

const LAMPADA = {
  /** Ligar: o atraso do contato e a constante térmica (95% em ~250ms). */
  atraso: 25,
  tauLiga: 75,
  /** Desligar: mais lento (some em ~1s); o branco morre em ~100ms e a brasa sobra até ~500ms. */
  tauDesliga: 170,
  /** O tremor da partida. */
  tremor: 150,
} as const;

/** A temperatura do filamento (0 a 1), t em ms desde o clique. */
function temperatura(t: number, liga: boolean): number {
  if (!liga) return Math.exp(-t / LAMPADA.tauDesliga);
  if (t < LAMPADA.atraso) return 0;
  return 1 - Math.exp(-(t - LAMPADA.atraso) / LAMPADA.tauLiga);
}

/** O tremor da partida (só ao ligar): ±22% que decai até ~150ms. */
export function tremor(t: number, liga: boolean): number {
  if (!liga) return 1;
  const k = Math.max(0, 1 - t / LAMPADA.tremor);
  if (k === 0) return 1;
  const onda = 0.5 + 0.5 * Math.sin(t * 0.19 + Math.sin(t * 0.07) * 3);
  return 1 - 0.22 * k * onda * Math.sign(Math.sin(t * 0.37) + 0.3);
}

/**
 * O quanto a sala está iluminada (0 escura, 1 clara): a última a acender (T^2,2); ao apagar, ela escurece
 * com a lâmpada, um nada mais devagar que o branco (T^1,7), e a brasa ainda sobra depois dela.
 */
export function sala(t: number, liga: boolean): number {
  const T = temperatura(t, liga);
  return Math.min(1, Math.pow(T, liga ? 2.2 : 1.7) * tremor(t, liga));
}

type Camada = "brasa" | "ambar" | "branco" | "cone" | "nucleo" | "nucleoBrasa" | "cupula";

/** A opacidade de cada camada da lâmpada no instante t. */
export function camada(nome: Camada, t: number, liga: boolean): number {
  const T = temperatura(t, liga);
  const f = tremor(t, liga);
  switch (nome) {
    case "nucleoBrasa":
      return Math.min(1, Math.pow(T, 0.9));
    case "nucleo":
      return Math.min(1, Math.pow(T, 4) * f);
    case "cupula":
      return Math.min(1, Math.pow(T, 2) * f);
    case "brasa":
      return Math.min(1, Math.pow(T, 0.8)) * 0.9;
    case "ambar":
      return Math.min(1, Math.pow(T, 2) * f);
    case "branco":
      return Math.min(1, Math.pow(T, 4.5) * f);
    case "cone":
      return Math.min(1, Math.pow(T, 2.6) * f);
  }
}

/** Uma curva amostrada em keyframes de opacidade (um por quadro de 60fps), para o WAAPI. */
export function amostrar(duracao: number, f: (t: number) => number): Keyframe[] {
  const passos = Math.max(2, Math.round(duracao / (1000 / 60)));
  const quadros: Keyframe[] = [];
  for (let i = 0; i <= passos; i++) {
    const t = (i / passos) * duracao;
    quadros.push({ opacity: Math.max(0, Math.min(1, f(t))).toFixed(4), offset: i / passos });
  }
  return quadros;
}

/**
 * Quando a sala já mudou o bastante (ms) para o desenho do lustre trocar de cor sem sumir no fundo: ao
 * apagar, com a página clara já a 30% da luz; ao acender, com ela a 40%.
 */
export function meioDaSala(liga: boolean): number {
  for (let t = 0; t < 1200; t += 4) {
    const s = sala(t, liga);
    if (liga ? s >= 0.4 : s <= 0.3) return t;
  }
  return 0;
}

/**
 * O piso do escuro: a página clara com 11% do brilho tem o fundo quase igual ao da página escura
 * (linha 18: o papel #F0EDE6 vira 26,26,25; o escuro é 27,29,31). Nesse ponto a troca entre as duas não
 * passa pelo cinza: o fundo é o mesmo, e só o texto troca.
 */
const PISO = 0.11;

/** A página clara apaga até o piso; a escura aparece depois, quando a clara já está no escuro. */
const APAGA = { troca: 270, fim: 560 };
/** A página escura some no escuro em 55ms (a brasa já está acendendo); depois a clara acende do piso. */
const ACENDE = { entra: 55, fim: 640 };

/** A duração da sala em cada sentido (a View Transition acaba com ela). */
export function duracaoDaSala(liga: boolean): number {
  return liga ? ACENDE.fim : APAGA.fim;
}

const suave = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

/**
 * A sala na View Transition do tema (tema.ts): o brilho e a opacidade da página clara a cada quadro.
 * Ao apagar, é a foto velha (clara) que escurece com a lâmpada, pelo `brightness`, e só no piso ela sai de
 * cima da nova (escura). Ao acender, a nova (clara) entra já no piso, por cima da velha (escura), e acende
 * com a lâmpada, tremor de partida incluído. Nunca as duas páginas misturadas com a clara acesa: era o
 * cinza lavado do fade.
 */
export function quadrosDaSala(liga: boolean): Keyframe[] {
  const duracao = duracaoDaSala(liga);
  const passos = Math.max(2, Math.round(duracao / (1000 / 60)));
  const quadros: Keyframe[] = [];
  for (let i = 0; i <= passos; i++) {
    const t = (i / passos) * duracao;
    const brilho = PISO + (1 - PISO) * sala(t, liga);
    const opacidade = liga ? suave(t / ACENDE.entra) : 1 - suave((t - APAGA.troca) / (APAGA.fim - APAGA.troca));
    quadros.push({ filter: `brightness(${brilho.toFixed(4)})`, opacity: opacidade.toFixed(4), offset: i / passos });
  }
  return quadros;
}
