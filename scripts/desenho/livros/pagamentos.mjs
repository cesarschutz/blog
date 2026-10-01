/**
 * Pagamentos: caixa registradora mecânica, das de latão do fim do século XIX (inventada em 1879
 * contra a fraude: registra cada venda, guarda o dinheiro e fecha o caixa no fim do dia).
 *
 * Vista de frente e um pouco de cima, em projeção oblíqua como a gaveta de fichas do Dados: a frente
 * é plana e o fundo (z) foge para cima e para a direita. A luz vem do alto à esquerda: os lados
 * direitos da base e do gabinete ficam na sombra, e o ombro sob o beiral da cabeça também.
 * De baixo para cima: a base de madeira com a gaveta do dinheiro (puxador em concha e fechadura), o
 * gabinete que afina para cima, com o teclado em quatro degraus de teclas redondas sobre hastes, e a
 * cabeça abobadada com o visor em arco, onde três bandeirinhas estão levantadas (em branco); no lado
 * direito, a manivela. O fantasma é a gaveta que salta para a frente quando a venda é registrada.
 */

// O vetor de fundo: cada unidade de profundidade anda A para a direita e B para cima.
const A = 0.5;
const B = 0.36;
const P = (x, y, z = 0) => [x + A * z, y - B * z];
const rad = (g) => (g * Math.PI) / 180;

export default {
  instrumento: "caixa registradora mecânica",
  titulo: "Pagamentos",
  cor: "#467866",
  desenho({ t, hachura, chao, ponto, linha, poli, arco, retangulo, juntar }) {
    /** Face plana por pontos 3D [x, y, z], fechada. */
    const face = (pontos) => poli(pontos.map(([x, y, z]) => P(x, y, z)), true);
    /** Linha quebrada por pontos 3D, aberta. */
    const traco = (pontos) => poli(pontos.map(([x, y, z]) => P(x, y, z)));
    /** Aresta entre dois pontos 3D. */
    const aresta = (a, b) => linha(P(...a), P(...b));
    /** Arco de elipse num plano qualquer: centro 3D, dois vetores 3D (os semieixos), de a0 a a1 graus. */
    const elipse3 = (c, u, v, a0 = 0, a1 = 360) => {
      const n = Math.max(12, Math.ceil(((Math.abs(a1 - a0) / 360) * 2 * Math.PI * Math.max(Math.hypot(...u), Math.hypot(...v))) / 1.5));
      const pts = Array.from({ length: n + 1 }, (_, i) => {
        const a = rad(a0 + ((a1 - a0) * i) / n);
        return P(c[0] + u[0] * Math.cos(a) + v[0] * Math.sin(a), c[1] + u[1] * Math.cos(a) + v[1] * Math.sin(a), c[2] + u[2] * Math.cos(a) + v[2] * Math.sin(a));
      });
      return { pts, fechada: false };
    };
    const fechada = (forma) => ({ pts: forma.pts.slice(0, -1), fechada: true });

    const D = 90; // a profundidade da máquina
    const cm = 228; // o eixo do gabinete

    // ---------- a base de madeira, com a gaveta do dinheiro ----------
    const [bx0, bx1, by0, by1] = [126, 330, 604, 668];
    t(face([[bx0, by1, 0], [bx0, by0, 0], [bx0, by0, D], [bx1, by0, D], [bx1, by1, D], [bx1, by1, 0]]), { papel: true });
    t(aresta([bx0, by0, 0], [bx1, by0, 0]));
    t(aresta([bx1, by0, 0], [bx1, by1, 0]));
    hachura(face([[bx1, by0, 0], [bx1, by1, 0], [bx1, by1, D], [bx1, by0, D]]), { angulo: 60, passo: 4.2 });
    t(linha([130, 664], [326, 664]), { w: 3 }); // o friso do rodapé

    const [gx0, gx1, gy0, gy1] = [138, 318, 609, 634]; // a frente da gaveta
    t(retangulo(gx0, gy0, gx1 - gx0, gy1 - gy0, 2));
    const concha = juntar([arco([cm, 625.5], 10, 5.5, 0, 180), linha([cm - 10, 625.5], [cm + 10, 625.5])]);
    hachura(concha, { angulo: 60, passo: 2.8 });
    t(concha, { w: 2 });
    ponto([cm, 617], 2); // a fechadura

    // ---------- o fantasma: a gaveta que salta para a frente ----------
    {
      const p = 88; // quanto ela sai (ao longo do eixo de fundo, para a frente)
      const [tl, tr, bl, br] = [P(gx0, gy0, -p), P(gx1, gy0, -p), P(gx0, gy1, -p), P(gx1, gy1, -p)];
      const [otl, otr] = [[gx0, gy0], [gx1, gy0]];
      // Um traço só: a boca da gaveta, a frente dela e as duas arestas de cima (a da direita, ida e volta).
      t(poli([otl, tl, bl, br, tr, otr, tr, tl]), { fantasma: true });
    }

    // ---------- o gabinete, afinando para cima ----------
    const w = (y) => 92 - (16 * (604 - y)) / 160; // a meia largura, da base ao arranque do arco
    const E = (y, z) => [cm + w(y), y, z]; // um ponto do lado direito
    const Q = (y, z) => [cm - w(y), y, z]; // um ponto do lado esquerdo
    // O perfil do lado, da frente para trás: a saia, os quatro degraus do teclado, o ombro e a cabeça.
    const degraus = [0, 1, 2, 3].map((i) => ({ z: 10 + 11 * i, pe: 586 - 17 * i }));
    const perfil = [[10, 604], [10, 586]];
    for (const { z, pe } of degraus) perfil.push([z, pe - 17], [z + 11, pe - 17]);
    perfil.push([54, 504], [42, 504], [42, 444]);
    const [sy, sz] = [444, 42]; // o arranque do arco e a frente da cabeça
    const [rx, ry] = [w(sy), 24];
    const arcoFrente = (a0, a1, z) => elipse3([cm, sy, z], [rx, 0, 0], [0, -ry, 0], a0, a1);
    // Onde a silhueta da abóbada passa da frente para trás: a tangente paralela ao vetor de fundo.
    const at = 180 - (Math.atan2(ry * A, rx * B) * 180) / Math.PI;
    const tang = (z) => [cm + rx * Math.cos(rad(at)), sy - ry * Math.sin(rad(at)), z];

    t(
      juntar([
        traco(perfil.map(([z, y]) => Q(y, z))),
        arcoFrente(180, at, sz),
        aresta(tang(sz), tang(D)),
        arcoFrente(at, 0, D),
        aresta(E(sy, D), E(604, D)),
        aresta(E(604, D), E(604, 10)),
        aresta(E(604, 10), Q(604, 10)),
      ]),
      { papel: true },
    );
    t(arcoFrente(at, 0, sz)); // o resto do arco da frente
    t(traco([...perfil].reverse().map(([z, y]) => E(y, z)))); // a quina direita da frente
    t(aresta(E(sy, sz), E(sy, D))); // o alto do lado
    const lado = face([...perfil.map(([z, y]) => E(y, z)), E(sy, D), E(604, D)]);
    hachura(lado, { angulo: 60, passo: 4.2 });
    hachura(juntar([arcoFrente(0, 36, sz), arcoFrente(36, 0, D)]), { angulo: 60, passo: 5 }); // o flanco da abóbada

    // O teclado: os degraus e, em cada um, oito teclas redondas sobre hastes.
    for (const { z, pe } of degraus) {
      const y = pe - 17; // o piso do degrau
      t(aresta(Q(y, z), E(y, z)), { w: 2 });
      t(aresta(Q(y, z + 11), E(y, z + 11)), { w: 2, icone: false }); // no ícone, uma linha por degrau basta
      for (let j = 0; j < 8; j++) {
        const x = cm - 66.5 + 19 * j;
        t(aresta([x, y - 3, z + 5.5], [x, y, z + 5.5]), { w: 2, icone: false }); // a haste
        t(fechada(elipse3([x, y - 8, z + 5.5], [5.5, 0, 0], [0, -5.5, 0])), { w: 2, papel: true }); // a tecla
      }
    }
    t(aresta(Q(504, sz), E(504, sz))); // o beiral da cabeça
    hachura(face([Q(504, 54), E(504, 54), E(510, 54), Q(510, 54)]), { angulo: 60, passo: 3 }); // a sombra do beiral no ombro

    // O visor em arco, com as bandeirinhas levantadas.
    const [vr, vry, vy0, vy1] = [rx - 9, 17, 452, 496]; // meia largura, altura do arco, arranque e peitoril
    t(
      juntar([
        aresta([cm - vr, vy1, sz], [cm - vr, vy0, sz]),
        elipse3([cm, vy0, sz], [vr, 0, 0], [0, -vry, 0], 180, 360),
        aresta([cm + vr, vy0, sz], [cm + vr, vy1, sz]),
        aresta([cm + vr, vy1, sz], [cm - vr, vy1, sz]),
      ]),
      { w: 2 },
    );
    t(aresta([cm - vr + 4, 490, sz], [cm + vr - 4, 490, sz]), { w: 3 }); // o peitoril
    for (const dx of [-48, 4, 44]) {
      const [x, y] = P(cm + dx, 490, sz);
      t(juntar([linha([x - 6, y], [x - 6, y - 18]), arco([x, y - 18], 6, 6, 180, 360), linha([x + 6, y - 18], [x + 6, y])]), { w: 2, papel: true });
    }

    // ---------- a manivela, no lado direito ----------
    const [hy, hz] = [568, 56]; // o cubo
    const [ky, kz] = [536, 74]; // a ponta do braço
    const [ny, nz] = [2, 3.6]; // meia largura do braço, perpendicular a ele
    t(face([E(hy + ny, hz + nz), E(ky + ny, kz + nz), E(ky - ny, kz - nz), E(hy - ny, hz - nz)]), { w: 2, papel: true });
    t(fechada(elipse3(E(hy, hz), [0, 13, 0], [0, 0, 13])), { papel: true });
    t(fechada(elipse3(E(hy, hz), [0, 8, 0], [0, 0, 8])), { w: 3 }); // o anel do cubo
    ponto(P(...E(hy, hz)), 2.6);
    const [kx, kyy] = P(...E(ky, kz));
    t(retangulo(kx - 2, kyy - 5.5, 24, 11, 5.5), { papel: true }); // a maçaneta

    // ---------- a sombra no chão ----------
    chao(124, 332, 670);
    hachura(poli([[331, 669.5], [376, 637], [380, 641], [335, 673.5]], true), { angulo: 38, passo: 3.6, margem: 0.2 });
  },
};
