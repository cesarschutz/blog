/**
 * Integração e Eventos: mesa telefônica manual (a central de telefonista, de New Haven, 1878, em
 * diante), vista de frente e um pouco de cima, em projeção oblíqua (a profundidade sobe para a
 * direita, como a caixa registradora de Pagamentos). Atrás, o painel em pé com o campo de jaques,
 * cada jaque com a lâmpada da linha por cima; na frente, o tampo com os pares de plugues em pé nos
 * furos e as chavinhas; embaixo do tampo, à vista, os cordões descem até os contrapesos, que puxam o
 * cordão de volta quando a ligação acaba. Um par de cordões já liga quem chamou a quem atende. Uma
 * lâmpada acesa é um assinante que tirou o fone do gancho: o evento. O fantasma é o cordão que ainda
 * vai ser encaixado, do plugue na prateleira ao jaque da lâmpada acesa.
 *
 * Coleção de 13 (direção de arte, ficha 08): o desenho da rodada anterior com as mudanças da ficha.
 * Menos jaques (6 fileiras × 8 colunas, cada um um círculo em w2 com a lâmpada menor por cima, em
 * w3, no lugar das réguas de tampinhas); uma lâmpada acesa (a única "luz" da coleção); só dois
 * cordões, em w1; quatro pares de plugues e quatro chaves na prateleira; o fantasma sem a seta (a
 * regra do mundo pede a máquina no instante do trabalho, nunca uma seta); e a mesa mais larga, para a
 * caixa do desenho chegar a 85% da largura da área. Hachura na face direita do gabinete, na sombra
 * sob a prateleira e na moldura interna do painel. No ícone: o gabinete, a prateleira, uma grade
 * rala de jaques (4 × 5) e as duas curvas dos cordões; as lâmpadas, as chaves, os plugues, os
 * contrapesos e a manivela ficam fora.
 */

/** Projeção oblíqua: 1 unidade de profundidade anda (0,53, −0,282) na tela (28°, encurtada a 0,6). */
const OB = [0.53, -0.282];
const pr = (x, y, z = 0) => [x + z * OB[0], y + z * OB[1]];
/** A direção em que um plugue sai do painel para quem olha (o oposto da profundidade), na tela. */
const SAI = [-0.883, 0.47];
const LADO = [0.47, 0.883];

export default {
  instrumento: "mesa telefônica manual",
  titulo: "Integração e Eventos",
  cor: "#71a49d",
  desenho({ t, hachura, chao, cheio, linha, poli, bezier, elipse, circulo, retangulo }) {
    // ---------- medidas ----------
    const X0 = 70; // a mesa, na frente: esquerda
    const X1 = 350; // e direita
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

    // ---------- o campo de jaques: 6 fileiras × 8 colunas ----------
    const colunas = 8;
    const fileiras = 6;
    const passoX = 30;
    const passoY = 20;
    const jx = (c) => PX0 + (X1 - X0) / 2 + (c - (colunas - 1) / 2) * passoX;
    const jy = (f) => PYT + 30 + f * passoY;
    const acesa = [6, 1]; // o jaque cuja lâmpada acendeu: alguém tirou o fone do gancho

    // ---------- os pares de cordões ----------
    const pares = [118, 182, 246, 310];
    const ZF = 36; // a fileira da frente (os cordões de chamada)
    const ZT = 50; // a fileira de trás (os cordões de atendimento), logo atrás
    const ZK = 14; // as chavinhas
    // a ligação em curso: [par, fileira (ZF ou ZT), jaque [coluna, fileira]]
    const plugados = [[1, ZF, [0, 1]], [1, ZT, [4, 0]]]; // quem chamou, à esquerda; quem atende, no alto: as duas curvas cortam o painel
    const aguarda = [2, ZF]; // o plugue na prateleira cujo cordão é o fantasma
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
    // a sombra sob a prateleira: o avental, embaixo da beira do tampo
    hachura([[X0 + 1, YS + ET + 1.5], [X1 - 1, YS + ET + 1.5], [X1 - 1, YV - 1.5], [X0 + 1, YV - 1.5]], { angulo: 60, passo: 5 });

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

    // a moldura interna: o campo dos jaques é rebaixado, e a sombra cai no alto e à esquerda dele
    const inset = 8;
    const [mx0, my0, mw, mh] = [PX0 + inset, PYT + inset, X1 - X0 - 2 * inset, HP - 2 * inset];
    t(retangulo(mx0, my0, mw, mh), { w: 2 });
    hachura([[mx0 + 1, my0 + 1], [mx0 + mw - 1, my0 + 1], [mx0 + mw - 1, my0 + 5.5], [mx0 + 1, my0 + 5.5]], { angulo: 60, passo: 3.2, margem: 0.4 });
    hachura([[mx0 + 1, my0 + 5.5], [mx0 + 5.5, my0 + 5.5], [mx0 + 5.5, my0 + mh - 1], [mx0 + 1, my0 + mh - 1]], { angulo: 60, passo: 3.2, margem: 0.4 });

    // o campo de jaques: cada jaque um círculo (w2) com o furo, e a lâmpada da linha por cima (w3)
    const ocupados = plugados.map(([, , j]) => j);
    for (let f = 0; f < fileiras; f++) {
      for (let c = 0; c < colunas; c++) {
        const J = [jx(c), jy(f)];
        const lamp = [J[0], J[1] - 8.5];
        if (acesa[0] === c && acesa[1] === f) {
          // a lâmpada acesa: o evento
          cheio(circulo(lamp, 2.9), { icone: false });
          for (const a of [-125, -90, -55]) {
            const [ux, uy] = [Math.cos((a * Math.PI) / 180), Math.sin((a * Math.PI) / 180)];
            t(linha([lamp[0] + 4.6 * ux, lamp[1] + 4.6 * uy], [lamp[0] + 8 * ux, lamp[1] + 8 * uy]), { w: 3 });
          }
        } else t(circulo(lamp, 1.8), { w: 3 });
        if (ocupados.some(([oc, of]) => oc === c && of === f)) continue;
        t(circulo(J, 3.4), { w: 2, icone: false });
        cheio(circulo(J, 1.2), { icone: false });
      }
    }
    // no ícone, uma grade rala (4 × 5) no mesmo campo: a 30px, a grade cheia vira uma mancha
    for (let f = 0; f < 4; f++) for (let c = 0; c < 5; c++) t(circulo([jx(0) + (c * (colunas - 1) * passoX) / 4, jy(0) + (f * (fileiras - 1) * passoY) / 3], 4), { w: 2, soIcone: true });

    // ---------- o tampo: chavinhas, furos e plugues ----------
    for (let i = 0; i < pares.length; i++) {
      // a chavinha: a base, a haste e o botão
      const [kx, ky] = pr(pares[i], YS, ZK);
      t(elipse([kx, ky], 3.2, 1.3), { w: 3 });
      t(linha([kx, ky], [kx, ky - 5]), { w: 2, icone: false });
      cheio(circulo([kx, ky - 6.2], 1.7), { icone: false });
      for (const z of [ZT, ZF]) {
        const [hx, hy] = furo(i, z);
        t(elipse([hx, hy], 5, 1.9), { w: 3 });
        if (estaPlugado(i, z)) continue;
        // o plugue em pé no furo: o cabo e a ponta de latão
        t(retangulo(hx - 3.5, hy - 14, 7, 14, 1), { w: 2, papel: true, icone: false });
        t(linha([hx - 3.5, hy - 10], [hx + 3.5, hy - 10]), { w: 3 });
        t(retangulo(hx - 1.8, hy - 20.5, 3.6, 7, 1.6), { w: 2, papel: true, icone: false });
      }
    }

    // ---------- os cordões plugados: a ligação em curso ----------
    const plugueNoJaque = ([c, f], comprimento = 11) => {
      const J = [jx(c), jy(f)];
      const E = [J[0] + SAI[0] * comprimento, J[1] + SAI[1] * comprimento];
      const canto = (P, s) => [P[0] + LADO[0] * s, P[1] + LADO[1] * s];
      t(poli([canto(J, 3.4), canto(E, 3.4), canto(E, -3.4), canto(J, -3.4)], true), { w: 2, papel: true, icone: false });
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
    cheio(circulo([mx, my], 1.2), { icone: false });

    // ---------- o fantasma: o cordão que ainda vai ser encaixado, do plugue ao jaque da lâmpada acesa ----------
    const [gx, gy] = furo(...aguarda);
    const Jg = [jx(acesa[0]), jy(acesa[1])];
    const Eg = [Jg[0] + SAI[0] * 12, Jg[1] + SAI[1] * 12];
    t(bezier([gx, gy - 22], [gx - 5, gy - 84], [Eg[0] + SAI[0] * 34, Eg[1] + SAI[1] * 34], Eg), { fantasma: true });

    chao(X0 + 2, X1 + 30, YB + 2, { altura: 7, desvio: 5 });
  },
};
