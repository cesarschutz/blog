/**
 * Linha do tempo das lousas (briefing §7). O desenho diz no próprio SVG quando cada parte aparece;
 * este cálculo diz como ela está num instante t. Serve ao servidor (o quadro parado, que vale sem
 * JS, com movimento reduzido e no RSS) e ao script que anima (src/scripts/lousa.ts).
 *
 * Atributos, com t em passos no passo a passo (0 a N) e de 0 a 1 na linha do tempo e no loop:
 *   data-traco="a b"      traça o caminho de a até b; a caneta vai na ponta (não serve para tracejado)
 *   data-escrita="a b"    escreve o texto da esquerda para a direita, com a caneta seguindo
 *   data-revela="a b"     descobre da esquerda para a direita (tracejados, grupos); data-de="direita" inverte
 *   data-aparece="a b"    opacidade de 0 a 1        data-some="a b"   de 1 a 0
 *   data-esmaece="a b v"  de 1 até v                data-desloca="a b dx dy"   anda (dx, dy)
 * Sem atributo, a parte já está no quadro desde o início ("o professor montou antes da aula").
 */
export const ATRIBUTOS = ["traco", "escrita", "revela", "aparece", "some", "esmaece", "desloca"] as const;
export type Atributo = (typeof ATRIBUTOS)[number];
export type Marcas = Partial<Record<Atributo, number[]>>;

export const numeros = (valor: string) => valor.trim().split(/\s+/).map(Number);

const progresso = (t: number, [a, b]: number[]) => (b <= a ? (t >= b ? 1 : 0) : Math.min(1, Math.max(0, (t - a) / (b - a))));

export interface Estado {
  /** Quanto do traço, do texto ou do recorte já apareceu, de 0 a 1 (1 quando não tem). */
  desenho: number;
  opacidade: number;
  dx: number;
  dy: number;
}

export function estado(m: Marcas, t: number): Estado {
  const faixa = m.traco ?? m.escrita ?? m.revela;
  let opacidade = 1;
  if (m.aparece) opacidade *= progresso(t, m.aparece);
  if (m.some) opacidade *= 1 - progresso(t, m.some);
  if (m.esmaece) opacidade *= 1 - (1 - (m.esmaece[2] ?? 0)) * progresso(t, m.esmaece);
  const anda = m.desloca ? progresso(t, m.desloca) : 0;
  return {
    desenho: faixa ? progresso(t, faixa) : 1,
    opacidade,
    dx: m.desloca ? (m.desloca[2] ?? 0) * anda : 0,
    dy: m.desloca ? (m.desloca[3] ?? 0) * anda : 0,
  };
}

/** O fim da linha do tempo: o maior instante citado nos atributos. */
export const fimDa = (todas: Marcas[]) => Math.max(0, ...todas.flatMap((m) => Object.values(m).map((v) => v[1] ?? 0)));
