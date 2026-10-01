/**
 * Fundamentos: um ábaco (suanpan, 2 contas em cima e 5 embaixo, 7 varetas), de pé sobre a mesa, visto
 * um pouco de cima e da direita: a frente em verdadeira grandeza e a profundidade fugindo para cima e à
 * direita, como a gaveta de Dados. Está no meio de uma conta: algumas contas já encostadas na travessa.
 * O fantasma é a próxima conta a ser movida, tracejada já encostada na travessa.
 */

// A profundidade da moldura na projeção oblíqua, e a metade (onde ficam as varetas e as contas).
const D = [20, -12.5];
const M = [D[0] / 2, D[1] / 2];
const fundo = ([x, y], k = 1) => [x + D[0] * k, y + D[1] * k];

const b = 15; // a largura das réguas da moldura
const viga = 12; // a espessura da travessa
const n = 7; // varetas
const vao = 46; // o passo entre as varetas
const cw = 40; // a largura de uma conta
const ch = 21; // a altura de uma conta

const xL = 47;
const xR = xL + 2 * b + n * vao; // 383
const yB = 670;
const alturaCima = 3 * ch + 2; // 2 contas e o lugar de uma
const alturaBaixo = 6 * ch + 3; // 5 contas e o lugar de uma
const yT = yB - (2 * b + alturaCima + viga + alturaBaixo);
const [xIL, xIR, yIT, yIB] = [xL + b, xR - b, yT + b, yB - b];
const yVT = yIT + alturaCima; // o alto da travessa
const yVB = yVT + viga; // a base da travessa

/** O centro (na frente) da vareta i, de 0 a n-1. */
const xVareta = (i) => xIL + vao / 2 + i * vao;

/** Recorta uma forma (lista de pontos) por um semiplano: fica o que `dentro` aceita (Sutherland–Hodgman). */
function recortar(pts, dentro, cruza) {
  const saida = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const c = pts[(i + 1) % pts.length];
    const da = dentro(a);
    const dc = dentro(c);
    if (da) saida.push(a);
    if (da !== dc) saida.push(cruza(a, c));
  }
  return saida;
}
const cruzaY = (y) => (a, c) => [a[0] + ((y - a[1]) / (c[1] - a[1])) * (c[0] - a[0]), y];
const cruzaX = (x) => (a, c) => [x, a[1] + ((x - a[0]) / (c[0] - a[0])) * (c[1] - a[1])];
/** O que fica abaixo de y (inclusive). */
const abaixoDe = (pts, y) => recortar(pts, (p) => p[1] >= y, cruzaY(y));
/** O que fica à esquerda de x (inclusive). */
const aEsquerdaDe = (pts, x) => recortar(pts, (p) => p[0] <= x, cruzaX(x));

/**
 * Da forma recortada, tira o lado que ficou sobre a linha de corte (a borda da moldura, que já está
 * desenhada) e devolve a lista aberta, começando logo depois desse lado.
 */
function semOLado(pts, sobreALinha) {
  const i = pts.findIndex((p, k) => sobreALinha(p) && sobreALinha(pts[(k + 1) % pts.length]));
  if (i < 0) return pts;
  return [...pts.slice(i + 1), ...pts.slice(0, i + 1)];
}

export default {
  instrumento: "ábaco",
  desenho({ t, hachura, chao, ponto, linha, poli, bezier, arco, juntar }) {
    // ----- as faces de dentro da moldura que aparecem: a da régua esquerda (sombra) e a da régua de baixo
    const xF = xIL + D[0]; // a aresta de trás da face de dentro da régua esquerda
    // A face esquerda, acima da travessa e abaixo dela (a travessa cobre o meio).
    const esqCima = [[xIL, yIT], [xF, yIT], [xF, yVT + D[1]], [xIL, yVT]];
    const esqBaixo = [[xIL, yVB], [xF, yVB], [xF, yIB + D[1]], [xIL, yIB]];
    t(linha([xF, yIT], [xF, yVT + D[1]]), { w: 2, icone: false });
    t(linha([xF, yVB], [xF, yIB + D[1]]), { w: 2, icone: false });
    t(linha([xIL, yIB], fundo([xIL, yIB])), { w: 2, icone: false }); // a quina entre a face esquerda e a de baixo
    t(linha(fundo([xIL, yIB]), [xIR, yIB + D[1]]), { w: 2, icone: false }); // a aresta de trás da face de baixo
    hachura(esqCima, { angulo: 60, passo: 4.2 });
    hachura(esqBaixo, { angulo: 60, passo: 4.2 });

    // ----- a travessa: a frente e a face de cima
    t(linha([xIL, yVT], fundo([xIL, yVT])), { w: 2, icone: false });
    t(linha(fundo([xIL, yVT]), [xIR, yVT + D[1]]), { w: 2, icone: false });
    t(linha([xIL, yVT], [xIR, yVT]));
    t(linha([xIL, yVB], [xIR, yVB]));

    // ----- a moldura: a silhueta (frente, face de cima e face da direita), as arestas da frente e o vão
    t(poli([[xL, yT], fundo([xL, yT]), fundo([xR, yT]), fundo([xR, yB]), [xR, yB], [xL, yB]], true));
    t(linha([xL, yT], [xR, yT]));
    t(linha([xR, yT], [xR, yB]));
    t(linha([xR, yT], fundo([xR, yT])), { w: 2 });
    t(poli([[xIL, yIT], [xIR, yIT], [xIR, yIB], [xIL, yIB]], true));
    // As juntas de meia-esquadria nos cantos da frente.
    for (const [c, i] of [[[xL, yT], [xIL, yIT]], [[xR, yT], [xIR, yIT]], [[xR, yB], [xIR, yIB]], [[xL, yB], [xIL, yIB]]]) t(linha(c, i), { w: 3 });
    // A face da direita fica na sombra.
    hachura([[xR, yT], fundo([xR, yT]), fundo([xR, yB]), [xR, yB]], { angulo: 60, passo: 4.2 });

    // ----- as varetas (no meio da profundidade): do alto até a travessa, e da travessa até a régua de baixo
    for (let i = 0; i < n; i++) {
      const x = xVareta(i) + M[0];
      t(linha([x, yIT], [x, yVT + M[1]]), { w: 2 });
      t(linha([x, yVB], [x, yIB + M[1]]), { w: 2 });
    }

    // ----- as contas: um bicone de pontas vivas e ombros suaves (a de cima e a de baixo são duas Béziers)
    const metadeConta = ([cx, cy], lado) =>
      bezier([cx - cw / 2, cy], [cx - cw * 0.22, cy + lado * ch * 0.64], [cx + cw * 0.22, cy + lado * ch * 0.64], [cx + cw / 2, cy]);
    const conta = (c) => juntar([metadeConta(c, -1), { pts: [...metadeConta(c, 1).pts].reverse(), fechada: false }]);
    // O aro: a frente do círculo maior da conta, visto um pouco de cima, de ponta a ponta.
    const equador = ([cx, cy]) => arco([cx, cy], cw / 2 - 0.6, ch * 0.22, 0, 180);

    /** Uma conta inteira: o contorno (tapando a vareta), o aro da frente e a sombra do crescente de baixo. */
    const desenharConta = (c, { teto, fantasma = false } = {}) => {
      let pts = conta(c).pts;
      let aberta = false;
      if (teto !== undefined && c[1] - ch / 2 < teto) {
        pts = abaixoDe(pts, teto);
        if (fantasma) {
          pts = semOLado(pts, (p) => Math.abs(p[1] - teto) < 0.01);
          aberta = true;
        }
      }
      if (c[0] + cw / 2 > xIR) {
        pts = aEsquerdaDe(pts, xIR);
        if (fantasma) {
          pts = semOLado(pts, (p) => Math.abs(p[0] - xIR) < 0.01);
          aberta = true;
        }
      }
      if (fantasma) {
        t({ pts, fechada: !aberta }, { fantasma: true });
        return;
      }
      t({ pts, fechada: true }, { papel: true });
      const aro = equador(c).pts.filter((p) => p[0] <= xIR);
      t({ pts: aro, fechada: false }, { w: 3 });
      // A sombra: o crescente entre o aro e o contorno de baixo, da ponta direita até passar do meio.
      const [cx] = c;
      const corte = cx - cw * 0.3;
      const baixo = metadeConta(c, 1).pts.filter((p) => p[0] >= corte && p[0] <= xIR).reverse(); // da ponta direita para a esquerda
      const volta = equador(c).pts.filter((p) => p[0] >= corte && p[0] <= xIR); // do aro, de volta para a direita
      hachura([...baixo, ...volta], { angulo: 60, passo: 3.4, margem: 0.5 });
    };

    // Os dígitos de cada vareta: [contas de cima encostadas na travessa, contas de baixo encostadas].
    const digitos = [
      [0, 0],
      [0, 2],
      [0, 0],
      [1, 3],
      [0, 0],
      [0, 0],
      [0, 1],
    ];
    const fantasmaNa = 5; // a vareta cuja conta de cima vai descer até a travessa (o fantasma)

    for (let i = 0; i < n; i++) {
      const [cima, baixo] = digitos[i];
      const x = xVareta(i) + M[0];
      // Deck de cima: as contas em repouso ficam no alto; as usadas descem até a travessa.
      const topo = yIT + M[1]; // onde a régua de cima toca a conta, no meio da profundidade
      for (let k = 0; k < 2 - cima; k++) desenharConta([x, topo + ch / 2 + k * ch], { teto: yIT });
      for (let k = 0; k < cima; k++) desenharConta([x, yVT + M[1] - ch / 2 - k * ch]);
      // Deck de baixo: as usadas sobem até a travessa; as outras ficam na régua de baixo.
      const base = yIB + M[1];
      for (let k = 0; k < baixo; k++) desenharConta([x, yVB + M[1] + ch / 2 + k * ch], { teto: yVB });
      for (let k = 0; k < 5 - baixo; k++) desenharConta([x, base - ch / 2 - k * ch]);
      if (i === fantasmaNa) desenharConta([x, yVT + M[1] - ch / 2], { fantasma: true });
    }

    // Os pontos da travessa, a cada três varetas (a marca das unidades).
    for (const i of [0, 3, 6]) ponto([xVareta(i), (yVT + yVB) / 2], 1.9);

    // A sombra no chão.
    chao(xL + 6, xR + D[0] + 2, yB + 1, { altura: 7, desvio: 5 });
  },
};
