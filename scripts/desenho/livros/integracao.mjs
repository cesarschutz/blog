/**
 * Integração e Eventos: mesa telefônica manual (a central de telefonista, fim do século XIX e
 * começo do XX), vista de frente e um pouco de cima, em projeção oblíqua (a profundidade sobe
 * para a direita, como a gaveta de fichas de Dados). Em cima, o painel em pé com as fileiras de
 * jaques e as réguas de número; embaixo, a mesa com os pares de cordões (plugues em pé nos furos),
 * as chavinhas na frente e, no vão de baixo, os cordões descendo até os contrapesos. Dois cordões
 * já ligam quem chamou a quem atende; um terceiro atendeu e o seu par, ainda na mesa, é o fantasma:
 * o cordão tracejado que a telefonista vai plugar no jaque de quem recebe.
 */

/** Projeção oblíqua: 1 unidade de profundidade anda (0,53, −0,282) na tela (28°, encurtada a 0,6). */
const OB = [0.53, -0.282];
const pr = (x, y, z = 0) => [x + z * OB[0], y + z * OB[1]];
/** Direção em que um plugue sai do painel para quem olha (o oposto da profundidade), por unidade de tela. */
const SAI = [-0.883, 0.47];
const LADO = [0.47, 0.883];

export default {
  instrumento: "mesa telefônica manual",
  cor: "#72aba5",
  desenho({ t, hachura, chao, ponto, linha, poli, bezier, elipse, circulo, retangulo }) {
    // ---------- medidas ----------
    const X0 = 94; // frente da mesa, esquerda
    const X1 = 324; // frente da mesa, direita
    const YS = 560; // tampo da mesa (frente)
    const YB = 666; // base, no chão
    const D = 100; // profundidade da mesa
    const ZP = 78; // onde o painel começa (fica no fundo do tampo)
    const HP = 132; // altura do painel
    const CH = 9; // cornija: altura
    const CS = 4; // cornija: quanto sobra para fora
    const [ox, oy] = pr(0, 0, ZP);
    const PX0 = X0 + ox;
    const PX1 = X1 + ox;
    const PYB = YS + oy; // pé do painel
    const PYT = PYB - HP; // topo do painel

    // ---------- a mesa (o tampo e o lado) ----------
    t(poli([[X1, YS], [X1, YB], pr(X1, YB, D), pr(X1, YS, D)], true), { papel: true });
    t(poli([pr(X0, YS), pr(X1, YS), pr(X1, YS, D), pr(X0, YS, D)], true), { papel: true });

    // ---------- o painel ----------
    t(poli([[PX1, PYT], [PX1, PYB], pr(X1, YS, D), pr(X1, YS - HP, D)], true), { papel: true });
    t(retangulo(PX0, PYT, X1 - X0, HP), { papel: true });
    // a cornija: o topo, a ponta direita e a frente
    const YC = YS - HP - CH;
    const zc = ZP - CS;
    t(poli([pr(X0 - CS, YC, zc), pr(X1 + CS, YC, zc), pr(X1 + CS, YC, D), pr(X0 - CS, YC, D)], true), { papel: true });
    t(poli([pr(X1 + CS, YC, zc), pr(X1 + CS, YC + CH, zc), pr(X1 + CS, YC + CH, D), pr(X1 + CS, YC, D)], true), { papel: true });
    const [cx, cy] = pr(X0 - CS, YC, zc);
    t(retangulo(cx, cy, X1 - X0 + 2 * CS, CH), { papel: true });

    // a moldura interna e o campo de jaques: 4 fileiras de 9, cada uma com a régua dos números
    const inset = 6;
    t(retangulo(PX0 + inset, PYT + inset, X1 - X0 - 2 * inset, HP - 2 * inset), { w: 2 });
    const colunas = 9;
    const fileiras = 4;
    const jx = (c) => PX0 + (X1 - X0) / 2 + (c - (colunas - 1) / 2) * 20;
    const jy = (f) => PYT + 36 + f * 24;
    // os jaques ocupados (os cordões já plugados) e o jaque que o fantasma vai receber
    const ocupados = [[2, 0], [0, 2], [5, 0]];
    const alvo = [8, 2];
    for (let f = 0; f < fileiras; f++) {
      t(retangulo(jx(0) - 10, jy(f) - 15, (colunas - 1) * 20 + 20, 4), { w: 3 });
      for (let c = 0; c < colunas; c++) {
        if (ocupados.some(([oc, of]) => oc === c && of === f)) continue;
        t(circulo([jx(c), jy(f)], 3), { w: 2, icone: false });
        ponto([jx(c), jy(f)], 1.3);
      }
    }

    // ---------- a mesa: chavinhas, furos e plugues ----------
    const pares = [132, 168, 204, 240, 276];
    const ZF = 34; // fileira da frente (os cordões de chamada)
    const ZT = 54; // fileira de trás (os cordões de atendimento)
    const ZK = 14; // as chavinhas
    // o que está plugado: [par, fileira (ZF ou ZT), jaque]
    const plugados = [[1, ZT, [2, 0]], [1, ZF, [0, 2]], [3, ZT, [5, 0]]];
    const estaPlugado = (i, z) => plugados.some(([p, pz]) => p === i && pz === z);

    const furo = (i, z) => pr(pares[i], YS, z);
    for (let i = 0; i < pares.length; i++) {
      // a chavinha: a base, a haste e o botão
      const [kx, ky] = pr(pares[i], YS, ZK);
      t(elipse([kx, ky], 3.2, 1.3), { w: 3 });
      t(linha([kx, ky], [kx, ky - 5]), { w: 2, icone: false });
      ponto([kx, ky - 6.2], 1.7);
      for (const z of [ZT, ZF]) {
        const [hx, hy] = furo(i, z);
        t(elipse([hx, hy], 5, 1.9), { w: 3 });
        if (estaPlugado(i, z)) continue;
        // o plugue em pé no furo: o cabo e a ponta de latão
        t(retangulo(hx - 3.5, hy - 14, 7, 14, 1), { w: 2, papel: true });
        t(linha([hx - 3.5, hy - 10], [hx + 3.5, hy - 10]), { w: 3 });
        t(retangulo(hx - 1.8, hy - 20.5, 3.6, 7, 1.6), { w: 2, papel: true });
      }
    }

    // ---------- os cordões plugados ----------
    const plugueNoJaque = ([c, f]) => {
      const J = [jx(c), jy(f)];
      const E = [J[0] + SAI[0] * 9, J[1] + SAI[1] * 9];
      t(poli([
        [J[0] + LADO[0] * 3, J[1] + LADO[1] * 3],
        [E[0] + LADO[0] * 3, E[1] + LADO[1] * 3],
        [E[0] - LADO[0] * 3, E[1] - LADO[1] * 3],
        [J[0] - LADO[0] * 3, J[1] - LADO[1] * 3],
      ], true), { w: 2, papel: true });
      return E;
    };
    for (const [i, z, jaque] of plugados) {
      const E = plugueNoJaque(jaque);
      const H = furo(i, z);
      t(bezier(E, [E[0] - 7, E[1] + 15], [H[0] - 1, H[1] - 30], H), { w: 1 });
    }

    // ---------- o vão de baixo: a frente, os cordões e os contrapesos ----------
    const YP = YB - 14; // o rodapé
    const YV = YS + 8; // embaixo da borda do tampo
    t(retangulo(X0, YS, X1 - X0, 8), { papel: true });
    t(retangulo(X0, YP, X1 - X0, YB - YP), { papel: true });
    t(retangulo(X0, YV, 10, YP - YV), { papel: true });
    t(retangulo(X1 - 10, YV, 10, YP - YV), { papel: true });
    for (let i = 0; i < pares.length; i++) {
      for (const z of [ZT, ZF]) {
        const [x] = pr(pares[i], 0, z);
        const topo = estaPlugado(i, z) ? YP - 54 : YP - 22;
        t(linha([x, YV], [x, topo]), { w: 2 });
        t(retangulo(x - 3.5, topo, 7, 16, 2), { w: 2, papel: true });
        t(linha([x - 3.5, topo + 4], [x + 3.5, topo + 4]), { w: 3 });
      }
    }

    // ---------- as sombras: o lado do painel, o lado da mesa, a ponta da cornija ----------
    hachura([[PX1, PYT], [PX1, PYB], pr(X1, YS, D), pr(X1, YS - HP, D)], { angulo: 60, passo: 4.2 });
    hachura([[X1, YS], [X1, YB], pr(X1, YB, D), pr(X1, YS, D)], { angulo: 60, passo: 4.2 });
    hachura([pr(X1 + CS, YC, zc), pr(X1 + CS, YC + CH, zc), pr(X1 + CS, YC + CH, D), pr(X1 + CS, YC, D)], { angulo: 60, passo: 4.2 });

    // a manivela do magneto, no lado direito da mesa
    const [mx, my] = pr(X1, 596, 56);
    t(elipse([mx, my], 3.2, 5, -12), { w: 2, papel: true, icone: false });
    t(linha([mx, my], [mx + 7, my + 11]), { w: 2, icone: false });
    t(retangulo(mx + 7, my + 9, 11, 4, 1.5), { w: 2, papel: true, icone: false });
    ponto([mx, my], 1.2);

    // ---------- o fantasma: o cordão que ainda vai ser plugado ----------
    const [gx, gy] = furo(3, ZF);
    const Jg = [jx(alvo[0]), jy(alvo[1])];
    const Eg = [Jg[0] + SAI[0] * 12, Jg[1] + SAI[1] * 12];
    t(bezier([gx, gy - 22], [gx - 2, gy - 56], [Eg[0] - 24, Eg[1] + 10], Eg), { fantasma: true });

    chao(X0 + 4, X1 + 24, YB + 2, { altura: 7, desvio: 5 });
  },
};
