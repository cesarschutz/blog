/**
 * O efeito "gênio" do Mac (C8; o do protótipo 14, refeito para a miniatura do Dock): a janela é sugada
 * para a vaga dela no Dock e vira uma miniatura dela mesma; restaurar é o mesmo caminho ao contrário.
 *
 * A janela é uma caixa só, então o gênio é montado com duas peças: um `transform` (translate + scale, com
 * a origem no canto) que leva a caixa até o contorno do funil a cada instante, e um `clip-path` com um
 * polígono de várias linhas que afunila os lados na direção do Dock. A borda de baixo da janela, perto do
 * Dock, afunila primeiro e a de cima chega por último. Os quadros são calculados aqui (a curva vai dentro
 * deles) e tocados pela Web Animations API em linha reta entre um e outro. Só transform, clip-path e
 * opacity.
 *
 * As coordenadas são as da tela do computador (a caixa das janelas), com a janela em (0, 0) no layout:
 * a posição dela é toda do transform.
 */

export interface Retangulo {
  x: number;
  y: number;
  w: number;
  h: number;
}

const LINHAS = 16;
const QUADROS = 30;
/** Quanto o último quadro abre o recorte para fora da caixa, para a sombra da janela aparecer. */
const FOLGA = 120;

const limitar = (v: number) => Math.min(1, Math.max(0, v));
const misturar = (a: number, b: number, t: number) => a + (b - a) * t;
const saida = (t: number) => 1 - (1 - t) ** 3;
const suave = (t: number) => t * t * (3 - 2 * t);
const entraESai = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

/** Um quadro, no progresso p (0: a miniatura no Dock; 1: a janela inteira). */
function quadro(p: number, j: Retangulo, m: Retangulo): Keyframe {
  // A borda de cima desce por último (sobe primeiro ao abrir); a de baixo, perto do Dock, vem antes.
  const topo = misturar(m.y, j.y, saida(limitar(p / 0.82)));
  const base = Math.max(topo + 2, misturar(m.y + m.h, j.y + j.h, entraESai(limitar((p - 0.08) / 0.92))));
  const esquerdas: number[] = [];
  const direitas: number[] = [];
  for (let k = 0; k <= LINHAS; k++) {
    const v = k / LINHAS;
    // Cada linha abre com um atraso proporcional à distância do topo: os lados viram uma curva em S.
    const q = suave(limitar((p - 0.5 * v) / 0.5));
    esquerdas.push(misturar(m.x, j.x, q));
    direitas.push(misturar(m.x + m.w, j.x + j.w, q));
  }
  const minX = Math.min(...esquerdas);
  const maxX = Math.max(...direitas);
  const largura = Math.max(1, maxX - minX);
  const altura = Math.max(1, base - topo);
  const ex = (X: number) => (((X - minX) / largura) * j.w).toFixed(2);
  const pontos: string[] = [];
  for (let k = 0; k <= LINHAS; k++) pontos.push(`${ex(esquerdas[k])}px ${((k / LINHAS) * j.h).toFixed(2)}px`);
  for (let k = LINHAS; k >= 0; k--) pontos.push(`${ex(direitas[k])}px ${((k / LINHAS) * j.h).toFixed(2)}px`);
  return {
    transform: `translate(${minX.toFixed(2)}px, ${topo.toFixed(2)}px) scale(${(largura / j.w).toFixed(5)}, ${(altura / j.h).toFixed(5)})`,
    clipPath: `polygon(${pontos.join(", ")})`,
  };
}

/** O último quadro: a janela no lugar, com o recorte folgado (a sombra aparece). */
function inteira(j: Retangulo): Keyframe {
  const pontos: string[] = [];
  const yDe = (k: number) => (k === 0 ? -FOLGA : k === LINHAS ? j.h + FOLGA : (k / LINHAS) * j.h);
  for (let k = 0; k <= LINHAS; k++) pontos.push(`${-FOLGA}px ${yDe(k).toFixed(2)}px`);
  for (let k = LINHAS; k >= 0; k--) pontos.push(`${j.w + FOLGA}px ${yDe(k).toFixed(2)}px`);
  return { transform: `translate(${j.x}px, ${j.y}px) scale(1, 1)`, clipPath: `polygon(${pontos.join(", ")})` };
}

/** Os quadros do progresso `de` até `ate` (minimizar: 1 → 0; restaurar: 0 → 1). */
export function quadrosDoGenio(janela: Retangulo, miniatura: Retangulo, de: number, ate: number): Keyframe[] {
  const quadros: Keyframe[] = [];
  for (let i = 0; i <= QUADROS; i++) {
    const p = misturar(de, ate, i / QUADROS);
    quadros.push(p >= 0.999 ? inteira(janela) : quadro(p, janela, miniatura));
  }
  return quadros;
}

/** A miniatura: a janela inteira, sem distorcer, dentro da caixa (encostada embaixo, no meio). */
export function caberNa(janela: { w: number; h: number }, caixa: Retangulo): Retangulo {
  const s = Math.min(caixa.w / janela.w, caixa.h / janela.h);
  const w = janela.w * s;
  const h = janela.h * s;
  return { x: caixa.x + (caixa.w - w) / 2, y: caixa.y + caixa.h - h, w, h };
}
