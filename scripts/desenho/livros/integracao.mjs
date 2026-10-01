/**
 * Integração e Eventos: mesa telefônica manual (a central de telefonista magneto, fim do século XIX
 * e começo do XX, do tipo de mesa), vista de frente e um pouco de cima, em projeção oblíqua (a
 * profundidade sobe para a direita, como a gaveta de fichas de Dados). Atrás, o painel em pé com
 * as fileiras de jaques, cada uma com a régua das tampinhas anunciadoras por cima; na frente, o
 * tampo com os pares de cordões (os plugues em pé nos furos) e as chavinhas; embaixo do tampo,
 * à vista, os cordões descem até os contrapesos, que puxam o cordão de volta quando a ligação
 * acaba. Dois cordões já ligam quem chamou a quem atende; um terceiro atendeu, e o seu par, ainda
 * na mesa, é o fantasma: o cordão tracejado que a telefonista vai plugar no jaque de quem recebe.
 */

/** Projeção oblíqua: 1 unidade de profundidade anda (0,53, −0,282) na tela (28°, encurtada a 0,6). */
const OB = [0.53, -0.282];
const pr = (x, y, z = 0) => [x + z * OB[0], y + z * OB[1]];
/** A direção em que um plugue sai do painel para quem olha (o oposto da profundidade), na tela. */
const SAI = [-0.883, 0.47];
const LADO = [0.47, 0.883];

export default {
  instrumento: "mesa telefônica manual",
  cor: "#72aba5",
  desenho({ t, hachura, chao, ponto, linha, poli, bezier, elipse, circulo, retangulo }) {
    // ---------- medidas ----------
    const X0 = 92; // a mesa, na frente: esquerda
    const X1 = 328; // e direita
    const YS = 574; // o tampo (na frente)
    const YB = 666; // o chão
    const D = 104; // a profundidade da mesa
    const ZP = 70; // onde o painel começa (no fundo do tampo)
    const HP = 150; // a altura do painel
    const CH = 9; // a cornija: altura
    const CS = 4; // a cornija: quanto sobra para fora
    const ET = 8; // a espessura do tampo
    const EA = 14; // a altura do avental, embaixo do tampo
    const EP = 10; // a largura dos pés
    const [ox, oy] = pr(0, 0, ZP);
    const PX0 = X0 + ox;
    const PX1 = X1 + ox;
    const PYB = YS + oy; // o pé do painel
    const PYT = PYB - HP; // o topo do painel

    // ---------- os pares de cordões ----------
    const pares = [128, 166, 204, 242, 280];
    const ZF = 36; // a fileira da frente (os cordões de chamada)
    const ZT = 50; // a fileira de trás (os cordões de atendimento), logo atrás
    const ZK = 14; // as chavinhas
    // o que está plugado: [par, fileira (ZF ou ZT), jaque [coluna, fileira]]
    const plugados = [[0, ZF, [0, 2]], [0, ZT, [2, 0]], [1, ZF, [2, 3]], [1, ZT, [4, 1]], [3, ZF, [6, 0]]];
    const estaPlugado = (i, z) => plugados.some(([p, pz]) => p === i && pz === z);
    const furo = (i, z) => pr(pares[i], YS, z);

    // ---------- embaixo do tampo: o pé de trás, os cordões e os contrapesos ----------
    const YV = YS + ET + EA; // embaixo do avental
    // o pé de trás da direita (o da esquerda fica escondido pelos cordões e contrapesos)
    const [px, py] = pr(X1 - EP, YS, D);
    t(retangulo(px, py + ET + EA, EP, YB - YS - ET - EA), { w: 2, papel: true });
    // os cordões descem do tampo até os contrapesos (os cordões plugados levantam o seu)
    for (let i = 0; i < pares.length; i++) {
      for (const z of [ZT, ZF]) {
        const [x] = pr(pares[i], 0, z);
        const topo = estaPlugado(i, z) ? YB - 66 : YB - 40;
        t(linha([x, YV], [x, topo]), { w: 2, icone: false });
        t(retangulo(x - 3, topo, 6, 20, 1.6), { w: 2, papel: true, icone: false });
        t(linha([x - 3, topo + 4], [x + 3, topo + 4]), { w: 3 });
      }
    }

    // ---------- a mesa: os pés da frente, a travessa, o tampo e o avental ----------
    t(retangulo(X0, YV, EP, YB - YV), { papel: true });
    t(retangulo(X1 - EP, YV, EP, YB - YV), { papel: true });
    t(retangulo(X0 + EP, YB - 16, X1 - X0 - 2 * EP, 6), { w: 2, papel: true });
    t(poli([[X1, YS], [X1, YV], pr(X1, YV, D), pr(X1, YS, D)], true), { papel: true });
    t(retangulo(X0, YS, X1 - X0, ET + EA), { papel: true });
    t(linha([X0, YS + ET], [X1, YS + ET]), { w: 2 });
    t(linha([X1, YS + ET], pr(X1, YS + ET, D)), { w: 2 });
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

    // a moldura interna e o campo de jaques: 4 fileiras de 10, cada uma com a régua das tampinhas por cima
    const inset = 6;
    t(retangulo(PX0 + inset, PYT + inset, X1 - X0 - 2 * inset, HP - 2 * inset), { w: 2 });
    const colunas = 11;
    const fileiras = 4;
    const passoX = 18;
    const jx = (c) => PX0 + (X1 - X0) / 2 + (c - (colunas - 1) / 2) * passoX;
    const jy = (f) => PYT + 41 + f * 27;
    const ocupados = plugados.map(([, , j]) => j);
    const caida = [9, 1]; // a tampinha que caiu: a próxima chamada esperando
    for (let f = 0; f < fileiras; f++) {
      t(retangulo(jx(0) - 9, jy(f) - 19.5, (colunas - 1) * passoX + 18, 7), { w: 3 });
      for (let c = 0; c < colunas; c++) {
        if (caida[0] === c && caida[1] === f) {
          // a tampinha aberta, pendurada pela dobradiça de baixo
          const aba = [[jx(c) - 4, jy(f) - 12], [jx(c) - 5.5, jy(f) - 6], [jx(c) + 2.5, jy(f) - 6], [jx(c) + 4, jy(f) - 12]];
          t(poli(aba, true), { w: 3, papel: true });
          hachura(aba, { angulo: 60, passo: 2.2, margem: 0.4 });
        } else t(retangulo(jx(c) - 3.5, jy(f) - 18.2, 7, 4.4, 0.6), { w: 3 });
        if (ocupados.some(([oc, of]) => oc === c && of === f)) continue;
        t(circulo([jx(c), jy(f)], 2.6), { w: 3 });
        ponto([jx(c), jy(f)], 1.3);
      }
    }

    // ---------- o tampo: chavinhas, furos e plugues ----------
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
    const plugueNoJaque = ([c, f], comprimento = 11) => {
      const J = [jx(c), jy(f)];
      const E = [J[0] + SAI[0] * comprimento, J[1] + SAI[1] * comprimento];
      const canto = (P, s) => [P[0] + LADO[0] * s, P[1] + LADO[1] * s];
      t(poli([canto(J, 3.4), canto(E, 3.4), canto(E, -3.4), canto(J, -3.4)], true), { w: 2, papel: true });
      const M = [J[0] + SAI[0] * 4, J[1] + SAI[1] * 4];
      t(linha(canto(M, 3.4), canto(M, -3.4)), { w: 3 });
      return E;
    };
    for (const [i, z, jaque] of plugados) {
      const E = plugueNoJaque(jaque);
      const H = furo(i, z);
      const d = Math.hypot(H[0] - E[0], H[1] - E[1]);
      const k = Math.min(1, d / 80);
      t(bezier(E, [E[0] - 6 * k, E[1] + 14 * k], [H[0], H[1] - 0.3 * d], H), { w: 1 });
    }

    // ---------- as sombras: o lado do painel, a ponta da cornija, o lado do avental ----------
    hachura([[PX1, PYT], [PX1, PYB], pr(X1, YS, D), pr(X1, YS - HP, D)], { angulo: 60, passo: 4.2 });
    hachura([pr(X1 + CS, YC, zc), pr(X1 + CS, YC + CH, zc), pr(X1 + CS, YC + CH, D), pr(X1 + CS, YC, D)], { angulo: 60, passo: 4.2 });
    hachura([[X1, YS + ET], [X1, YV], pr(X1, YV, D), pr(X1, YS + ET, D)], { angulo: 60, passo: 4.2 });

    // a manivela do magneto, no lado direito do painel, perto do tampo
    const [mx, my] = pr(X1, YS - 28, ZP + 14);
    t(elipse([mx, my], 3.4, 5.2, -12), { w: 2, papel: true, icone: false });
    t(linha([mx, my], [mx + 6, my + 12]), { w: 2, icone: false });
    t(retangulo(mx + 6, my + 10, 13, 4.4, 1.8), { w: 2, papel: true, icone: false });
    ponto([mx, my], 1.2);

    // ---------- o fantasma: o cordão que ainda vai ser plugado, com a seta de quem o leva ----------
    const [gx, gy] = furo(3, ZT);
    const alvo = [10, 2];
    const Jg = [jx(alvo[0]), jy(alvo[1])];
    const Eg = [Jg[0] + SAI[0] * 13, Jg[1] + SAI[1] * 13];
    t(bezier([gx, gy - 23], [gx - 6, gy - 78], [Eg[0] - 34, Eg[1] - 26], Eg), { fantasma: true });
    // a ponta da seta, no sentido em que o plugue entra no jaque
    const ENTRA = [-SAI[0], -SAI[1]];
    const seta = (s, l) => [Eg[0] - ENTRA[0] * l + LADO[0] * s, Eg[1] - ENTRA[1] * l + LADO[1] * s];
    t(poli([seta(3.6, 5.5), Eg, seta(-3.6, 5.5)]), { fantasma: "solido" });

    chao(X0 + 2, X1 + 30, YB + 2, { altura: 7, desvio: 5 });
  },
};
