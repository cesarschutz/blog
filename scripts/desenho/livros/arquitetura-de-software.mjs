/**
 * Arquitetura de Software: a mesa de desenho. A prancheta inclinada uns 30° sobre um cavalete de
 * madeira (dois pés em A, de pernas abertas para a frente e para trás, ligados por uma travessa),
 * com a folha presa por quatro percevejos e a planta desenhada nela: o contorno em parede dupla,
 * duas paredes internas e uma porta com o arco do giro. A régua-tê encaixada na borda esquerda, a
 * cabeça saindo para fora e a lâmina atravessando a folha; o esquadro de 45° apoiado na lâmina. No
 * chão, à direita, um rolo de plantas amarrado. Vista de 3/4 pela frente-direita, em projeção
 * oblíqua como a caixa registradora (a frente plana, o fundo fugindo para cima e para a direita),
 * olho um pouco acima; luz do alto à esquerda: ficam na sombra a espessura do tampo (a frente e o
 * lado direito), as faces laterais dos dois pés do cavalete e o lado de baixo do rolo.
 * O fantasma é uma parede interna da planta na posição anterior, tracejada, ao lado da nova: a
 * decisão desfeita onde desfazer custou uma linha.
 */

// O vetor de fundo: cada unidade de profundidade anda A para a direita e B para cima.
const A = 0.5;
const B = 0.32;
const P = (x, y, z = 0) => [x + A * z, y - B * z];
const rad = (g) => (g * Math.PI) / 180;
const INCLINACAO = 30; // graus da prancheta em relação à mesa

export default {
  instrumento: "prancheta de desenho com a planta e a régua-tê",
  titulo: "Arquitetura de Software",
  cor: "#2d4f77",
  desenho({ t, hachura, chao, cheio, linha, poli, curva, arco, circulo, retangulo, juntar }) {
    /** Face plana por pontos 3D [x, y, z], fechada. */
    const face = (pontos) => poli(pontos.map((p) => P(...p)), true);
    const [s, c] = [Math.sin(rad(INCLINACAO)), Math.cos(rad(INCLINACAO))];

    // ---------- as medidas da prancheta ----------
    const xL = 88; // a borda esquerda
    const W = 250; // a largura, ao longo da frente
    const L = 150; // o comprimento da rampa, da frente ao fundo
    const yF = 505; // a altura da borda da frente
    const TAU = 9; // a espessura do tampo
    const yChao = 668;
    const D = L * c; // a profundidade do tampo (z no fundo)
    /** Um ponto da prancheta em 3D: u ao longo da frente, v subindo a rampa, h para baixo da superfície. */
    const B3 = (u, v, h = 0) => [xL + u, yF - v * s + h * c, v * c + h * s];
    const Bp = (u, v, h = 0) => P(...B3(u, v, h));
    /** Uma forma desenhada no plano da prancheta (coordenadas u, v), levada para a capa. */
    const sobre = (forma) => ({ pts: forma.pts.map(([u, v]) => Bp(u, v)), fechada: forma.fechada });

    // ---------- o cavalete: dois pés em A e a travessa ----------
    const a = 10; // a espessura das peças, em x
    const ez = 11; // a largura das pernas, na profundidade
    const hTrav = 9; // a altura do travessão de cima, perpendicular ao tampo
    const [yT0, yT1] = [596, 604]; // a altura da barra do A e da travessa
    /** (z, y) de um ponto da rampa, para as peças que ficam no plano de um pé. */
    const zy = (v, h) => {
      const p = B3(0, v, h);
      return [p[2], p[1]];
    };
    const zNa = (p, q, y) => p[0] + ((q[0] - p[0]) * (y - p[1])) / (q[1] - p[1]);

    const pe = (xe, { sombra }) => {
      /** A face +x de uma peça (a que fica à vista, virada para a direita). */
      const lado = (zyPts) => poli(zyPts.map(([z, y]) => P(xe + a, y, z)), true);
      /** A face de uma aresta da peça, entre x = xe e x = xe + a. */
      const tira = (p, q) => poli([P(xe, p[1], p[0]), P(xe + a, p[1], p[0]), P(xe + a, q[1], q[0]), P(xe, q[1], q[0])], true);
      const peca = (zyPts, arestas, opcoes = {}) => {
        const l = lado(zyPts);
        t(l, { papel: true, ...opcoes });
        if (sombra) hachura(l, { angulo: 60, passo: 3.6 });
        for (const [i, j] of arestas) t(tira(zyPts[i], zyPts[j]), { papel: true, ...opcoes });
      };
      const perna = (vTopo, zPe) => {
        const [zt, yt] = zy(vTopo, TAU + hTrav);
        return [[zt - ez / 2, yt], [zt + ez / 2, yt], [zPe + ez / 2, yChao], [zPe - ez / 2, yChao]];
      };
      const frente = perna(18, -4); // a perna da frente, aberta um pouco para a frente
      const tras = perna(L - 18, D + 14); // a perna de trás, aberta para o fundo
      const barra = [[zNa(frente[1], frente[2], yT0), yT0], [zNa(tras[0], tras[3], yT0), yT0], [zNa(tras[0], tras[3], yT1), yT1], [zNa(frente[1], frente[2], yT1), yT1]];
      const travessao = [zy(6, TAU), zy(L - 6, TAU), zy(L - 6, TAU + hTrav), zy(6, TAU + hTrav)];
      return {
        tras: () => peca(tras, [[0, 3]]),
        barra: () => peca(barra, [[0, 1]], { icone: false }),
        frente: () => peca(frente, [[0, 3]]),
        travessao: () => peca(travessao, [[3, 0]], { icone: false }),
      };
    };
    const [xe1, xe2] = [110, 306];
    const esquerdo = pe(xe1, { sombra: true });
    const direito = pe(xe2, { sombra: true });
    esquerdo.tras();
    direito.tras();
    esquerdo.barra();
    direito.barra();
    {
      // a travessa que liga os dois pés, no meio da profundidade
      const zs = D / 2;
      const [x1, x2] = [xe1 + a, xe2];
      t(face([[x1, yT0, zs - 4], [x1, yT0, zs + 4], [x2, yT0, zs + 4], [x2, yT0, zs - 4]]), { papel: true, icone: false }); // o alto
      t(face([[x1, yT0, zs - 4], [x2, yT0, zs - 4], [x2, yT1, zs - 4], [x1, yT1, zs - 4]]), { papel: true, icone: false }); // a frente
    }
    esquerdo.frente();
    direito.frente();
    esquerdo.travessao();
    direito.travessao();

    // ---------- o tampo ----------
    const frenteTampo = face([B3(0, 0), B3(W, 0), B3(W, 0, TAU), B3(0, 0, TAU)]);
    const ladoTampo = face([B3(W, 0), B3(W, L), B3(W, L, TAU), B3(W, 0, TAU)]);
    t(frenteTampo, { papel: true });
    hachura(frenteTampo, { angulo: 60, passo: 4 });
    t(ladoTampo, { papel: true });
    hachura(ladoTampo, { angulo: 60, passo: 4 });
    t(face([B3(0, 0), B3(W, 0), B3(W, L), B3(0, L)]), { papel: true });

    // ---------- a cabeça da régua-tê, encaixada na borda esquerda ----------
    const [hw, hv0, hv1, hh0, hh1] = [20, 8, 90, 2.5, 13]; // largura, de v a v, do topo à base
    t(face([B3(-hw, hv0, hh0), B3(0, hv0, hh0), B3(0, hv0, hh1), B3(-hw, hv0, hh1)]), { w: 2, papel: true, icone: false }); // a ponta da frente
    t(face([B3(-hw, hv0, hh0), B3(0, hv0, hh0), B3(0, hv1, hh0), B3(-hw, hv1, hh0)]), { papel: true }); // o alto da cabeça

    // ---------- a folha, presa por quatro percevejos ----------
    const [fu0, fu1, fv0, fv1] = [12, W - 12, 12, L - 10];
    t(sobre(retangulo(fu0, fv0, fu1 - fu0, fv1 - fv0)), { w: 2, papel: true, icone: false });
    for (const [u, v] of [[fu0 + 5, fv0 + 5], [fu1 - 5, fv0 + 5], [fu0 + 5, fv1 - 5], [fu1 - 5, fv1 - 5]]) cheio(circulo(Bp(u, v), 2.2), { icone: false });

    // ---------- a planta ----------
    const [pu0, pu1, pv0, pv1] = [24, 158, 58, 134];
    const e = 3.5; // a espessura da parede externa
    t(sobre(retangulo(pu0, pv0, pu1 - pu0, pv1 - pv0)), { w: 2 }); // a parede externa, por fora (fica no ícone)
    t(sobre(retangulo(pu0 + e, pv0 + e, pu1 - pu0 - 2 * e, pv1 - pv0 - 2 * e)), { w: 2, icone: false }); // e por dentro
    const vParede = 95; // a parede interna que atravessa a planta
    const [du0, du1] = [112, 128]; // a abertura da porta
    t(sobre(linha([pu0 + e, vParede], [du0, vParede])), { w: 2, icone: false });
    t(sobre(linha([du1, vParede], [pu1 - e, vParede])), { w: 2, icone: false });
    t(sobre(linha([92, pv0 + e], [92, vParede])), { w: 2, icone: false }); // a parede que divide o cômodo da frente
    t(sobre(linha([du0, vParede], [du0, vParede + 16])), { w: 3, icone: false }); // a folha da porta, aberta
    t(sobre(arco([du0, vParede], 16, 16, 0, 90)), { w: 3, icone: false }); // o giro da porta
    // O fantasma: a mesma parede, onde estava antes de a decisão mudar.
    t(sobre(linha([pu0 + e, 119], [pu1 - e, 119])), { fantasma: true });

    // ---------- a lâmina da régua-tê e o esquadro de 45° ----------
    t(sobre(retangulo(-12, 38, W - 10 + 12, 13)), { papel: true });
    for (const v of [41.5, 47.5]) cheio(circulo(Bp(-6, v), 1.3), { icone: false }); // os parafusos da cabeça
    t(sobre(poli([[168, 52.5], [220, 52.5], [168, 104.5]], true)), { w: 2, papel: true, icone: false });
    t(sobre(poli([[176, 60.5], [200.7, 60.5], [176, 85.2]], true)), { w: 3, icone: false }); // o vazio do meio

    // ---------- o rolo de plantas, deitado no chão à direita ----------
    {
      const c1 = [406, 657];
      const r = 11;
      const comprimento = 46;
      const c2 = P(c1[0], c1[1], comprimento);
      const nl = Math.hypot(A, B);
      const n = [B / nl, A / nl]; // perpendicular ao eixo, para baixo e para a direita
      const em = (ctr, k) => [ctr[0] + k * r * n[0], ctr[1] + k * r * n[1]];
      const angN = (Math.atan2(n[1], n[0]) * 180) / Math.PI;
      const corpo = juntar([linha(em(c1, 1), em(c2, 1)), arco(c2, r, r, angN, angN - 180), linha(em(c2, -1), em(c1, -1))]);
      t(corpo, { w: 2, papel: true, icone: false });
      hachura(poli([em(c1, 1), em(c2, 1), em(c2, 0.2), em(c1, 0.2)], true), { angulo: 60, passo: 3.6 });
      const cm = P(c1[0], c1[1], comprimento / 2);
      t(arco(cm, r, r, angN, angN + 180), { w: 3, icone: false }); // o barbante
      t(circulo(c1, r), { w: 2, papel: true, icone: false }); // a ponta do rolo
      const espiral = Array.from({ length: 25 }, (_, i) => {
        const f = i / 24;
        const ang = rad(200 + 720 * f);
        const rr = (r - 2.5) * (1 - f) + 1.5 * f;
        return [c1[0] + rr * Math.cos(ang), c1[1] + rr * Math.sin(ang)];
      });
      t(curva(espiral), { w: 3, icone: false });
      chao(394, 420, 669, { altura: 5 });
    }

    // ---------- a sombra no chão, sob os pés da frente ----------
    chao(104, 322, 671);
  },
};
