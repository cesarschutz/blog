/**
 * SRE: o regulador centrífugo de Watt (1788). Quando a máquina acelera, as esferas abrem e sobem e
 * fecham a válvula do vapor; quando desacelera, descem e abrem. A máquina que mantém a rotação quando
 * a carga muda.
 *
 * Vista de 3/4 pela frente-direita, na mesma projeção oblíqua da caixa registradora (a frente plana,
 * o fundo fugindo para cima e para a direita), luz do alto à esquerda. De baixo para cima: a base com
 * flange, a coluna curta do pedestal, a polia da correia, o eixo vertical, a luva que desliza no eixo,
 * o cubo no alto com os dois braços descendo em V aberto, cada um terminando numa esfera; de cada
 * braço, um pouco acima da esfera, o tirante desce até o ombro da luva (é assim que o regulador de
 * Watt funciona: as esferas sobem, os tirantes puxam a luva para cima). Da luva, a alavanca para a
 * direita, apoiada num pivô, até a haste da válvula borboleta num pedaço de tubo deitado no chão,
 * com flanges, aberto na ponta da direita. O fantasma é a máquina acelerada: as esferas, os braços,
 * os tirantes e a luva na posição alta, tudo num traço só.
 *
 * No ícone ficam o pedestal, o eixo, a luva, o cubo, os braços, os tirantes e as esferas (a coluna
 * com o losango e as duas bolas). A polia, a alavanca, a válvula e o tubo saem.
 */

// O vetor de fundo: cada unidade de profundidade anda A para a direita e B para cima.
const A = 0.5;
const B = 0.36;
const P = (x, y, z = 0) => [x + A * z, y - B * z];
const rad = (g) => (g * Math.PI) / 180;
const graus = (r) => (r * 180) / Math.PI;
// Num círculo horizontal (0° à direita, 90° ao fundo), onde a silhueta de um cilindro em pé passa da
// frente para o fundo: a tangente da direita e a da esquerda.
const AT = graus(Math.atan(A));
const AE = AT + 180;
// Num círculo de pé no plano y–z (0° embaixo, 90° ao fundo), as tangentes de baixo e de cima de um
// cilindro deitado ao longo de x.
const ABX = -graus(Math.atan(B));
const ACX = ABX + 180;

export default {
  instrumento: "regulador centrífugo de Watt",
  titulo: "SRE",
  cor: "#b59353",
  desenho({ t, hachura, chao, ponto, cheio, linha, poli, arco, circulo, juntar }) {
    /** Arco de elipse num plano qualquer: centro 3D, dois vetores 3D (os semieixos), de a0 a a1 graus. */
    const elipse3 = (c, u, v, a0 = 0, a1 = 360) => {
      const n = Math.max(12, Math.ceil(((Math.abs(a1 - a0) / 360) * 2 * Math.PI * Math.max(Math.hypot(...u), Math.hypot(...v))) / 1.5));
      const pts = Array.from({ length: n + 1 }, (_, i) => {
        const a = rad(a0 + ((a1 - a0) * i) / n);
        return P(c[0] + u[0] * Math.cos(a) + v[0] * Math.sin(a), c[1] + u[1] * Math.cos(a) + v[1] * Math.sin(a), c[2] + u[2] * Math.cos(a) + v[2] * Math.sin(a));
      });
      return { pts, fechada: false };
    };
    /** Uma barra reta de a a b, com a espessura dada (um retângulo girado, fechado). */
    const barra = (a, b, e) => {
      const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      const n = [(-(b[1] - a[1]) / l) * (e / 2), ((b[0] - a[0]) / l) * (e / 2)];
      return poli([[a[0] + n[0], a[1] + n[1]], [b[0] + n[0], b[1] + n[1]], [b[0] - n[0], b[1] - n[1]], [a[0] - n[0], a[1] - n[1]]], true);
    };

    /** As formas de um cilindro em pé (eixo em x = cx), do topo yT à base yB. */
    const formasCilindro = (cx, yT, yB, r) => {
      const horiz = (y, a0, a1) => elipse3([cx, y, 0], [r, 0, 0], [0, 0, r], a0, a1);
      const em = (y, a) => P(cx + r * Math.cos(rad(a)), y, r * Math.sin(rad(a)));
      return {
        em,
        horiz,
        // a silhueta, a partir da tangente da direita, no alto: o fundo do aro de cima, o lado esquerdo, a frente do aro de baixo, o lado direito
        silhueta: () => juntar([horiz(yT, AT, AE), linha(em(yT, AE), em(yB, AE)), horiz(yB, AE, AT + 360), linha(em(yB, AT), em(yT, AT))]),
        aro: () => horiz(yT, AE, AT + 360), // a frente do aro de cima
        sombra: () => juntar([horiz(yT, 300, AT + 360), linha(em(yT, AT), em(yB, AT)), horiz(yB, AT + 360, 300), linha(em(yB, 300), em(yT, 300))]),
      };
    };
    /** Desenha um cilindro em pé: a silhueta (que tapa o que ficou atrás), o aro de cima e a faixa de sombra à direita. */
    const cilindro = (cx, yT, yB, r, { w = 1, icone, sombra = true, passo = 4 } = {}) => {
      const f = formasCilindro(cx, yT, yB, r);
      t(f.silhueta(), { w, papel: true, icone });
      t(f.aro(), { w, icone });
      if (sombra) hachura(f.sombra(), { angulo: 60, passo });
      return f;
    };
    /** Um cilindro deitado ao longo de x, de x0 a x1, com o eixo em y = cy: a ponta da direita fica à vista. */
    const tubo = (x0, x1, cy, r, { w = 1, icone = false, sombra = true, passo = 4 } = {}) => {
      const vert = (x, a0, a1) => elipse3([x, cy, 0], [0, r, 0], [0, 0, r], a0, a1);
      const em = (x, a) => P(x, cy + r * Math.cos(rad(a)), r * Math.sin(rad(a)));
      t(juntar([vert(x0, ACX, ABX + 360), linha(em(x0, ABX), em(x1, ABX)), vert(x1, ABX + 360, ACX + 360), linha(em(x1, ACX), em(x0, ACX))]), { w, papel: true, icone });
      t(vert(x1, ACX, ABX + 360), { w, icone }); // a frente do aro da ponta
      if (sombra) hachura(juntar([vert(x0, 292, ABX + 360), linha(em(x0, ABX), em(x1, ABX)), vert(x1, ABX + 360, 292), linha(em(x1, 292), em(x0, 292))]), { angulo: 60, passo });
      return { vert, em };
    };
    /** A sombra de uma esfera: a lua entre o disco e o mesmo disco deslocado para a luz (alto, à esquerda). */
    const sombraEsfera = (c, r, d = [-8, -8]) => {
      const f = graus(Math.acos(Math.hypot(...d) / (2 * r)));
      const longe = graus(Math.atan2(-d[1], -d[0]));
      hachura(juntar([arco(c, r, r, longe - (180 - f), longe + (180 - f)), arco([c[0] + d[0], c[1] + d[1]], r, r, longe + f, longe - f)]), { angulo: 60, passo: 3.8, margem: 1 });
    };

    const ex = 186; // o eixo do regulador
    const chaoY = 670; // onde a base e o tubo encostam no chão

    // ---------- o pedestal: a base com flange, a coluna curta, o eixo e a polia ----------
    const base = { r: 44, yT: 645, yB: 654 };
    cilindro(ex, base.yT, base.yB, base.r, { passo: 4.2 });
    cilindro(ex, 605, base.yT, 13, { passo: 3.8 }); // a coluna
    const eixo = { x0: ex - 3.5, x1: ex + 3.5 };
    t(poli([[eixo.x0, 402], [eixo.x1, 402], [eixo.x1, 600], [eixo.x0, 600]], true), { papel: true }); // o eixo vertical
    cilindro(ex, 597, 605, 26, { w: 2, icone: false, passo: 4 }); // a polia da correia

    // ---------- a luva que desliza no eixo ----------
    const luva = { r: 9, yT: 559, yB: 577 };
    const fl = cilindro(ex, luva.yT, luva.yB, luva.r, { passo: 3.4 });
    hachura(poli([[eixo.x0, luva.yB + 3], [eixo.x1, luva.yB + 3], [eixo.x1, luva.yB + 12], [eixo.x0, luva.yB + 12]], true), { angulo: 60, passo: 3, margem: 0.3 }); // a sombra dela no eixo
    const ombro = { E: fl.em(luva.yT, AE), D: fl.em(luva.yT, AT) }; // onde os tirantes se prendem

    // ---------- o cubo no alto e os braços com as esferas ----------
    const pivo = [ex, 398];
    cilindro(ex, 390, 402, 8, { sombra: false });
    const L = 118; // o braço, do pivô ao centro da esfera
    const R = 28; // a esfera
    const RECUO = 8; // o pino do tirante fica um pouco acima da esfera
    const braco = (lado, angulo) => {
      const u = [lado * Math.sin(rad(angulo)), Math.cos(rad(angulo))];
      const em = (s) => [pivo[0] + s * u[0], pivo[1] + s * u[1]];
      return { esfera: em(L), pino: em(L - R - RECUO), entrada: em(L - R) };
    };
    const repouso = 34; // os braços em repouso, de cada lado da vertical
    const esq = braco(-1, repouso);
    const dir = braco(1, repouso);
    for (const b of [esq, dir]) t(barra(pivo, b.esfera, 6), { papel: true }); // os braços
    ponto(pivo, 2.4);
    t(barra(esq.pino, ombro.E, 3.6), { w: 2, papel: true }); // os tirantes
    t(barra(dir.pino, ombro.D, 3.6), { w: 2, papel: true });
    for (const b of [esq, dir]) {
      t(circulo(b.esfera, R), { papel: true });
      sombraEsfera(b.esfera, R);
      ponto(b.pino, 1.8);
    }

    // ---------- o tubo com a válvula borboleta, deitado no chão à direita ----------
    const tb = { x0: 300, x1: 430, r: 15, R: 21 };
    const tcy = chaoY - 1.063 * tb.R; // o eixo do tubo, com os flanges no chão
    const topoTubo = tcy - 1.063 * tb.r;
    tubo(tb.x0, tb.x0 + 6, tcy, tb.R, { sombra: false }); // o flange da esquerda
    tubo(tb.x0 + 6, tb.x1 - 6, tcy, tb.r, { passo: 3.8 }); // o corpo
    const fd = tubo(tb.x1 - 6, tb.x1, tcy, tb.R, { passo: 3.8 }); // o flange da direita, com a face à vista
    t(elipse3([tb.x1, tcy, 0], [0, tb.r - 3, 0], [0, 0, tb.r - 3]), { w: 2, icone: false }); // o furo
    t(linha(fd.em(tb.x1, 135), fd.em(tb.x1, 315)), { w: 2, icone: false }); // a borboleta, de canto, dentro do furo

    // ---------- a alavanca, do ombro da luva até a válvula ----------
    const ya = 568; // a alavanca, na altura da luva
    const pivoAl = [336, ya];
    const pontaAl = [386, ya];
    const haste = { x: 404, yT: ya + 38 }; // a haste da válvula, de pé sobre o tubo
    const manivela = [pontaAl[0], haste.yT - 13]; // a ponta da manivela, para onde o tirante desce
    t(poli([[pivoAl[0] - 3, ya], [pivoAl[0] + 3, ya], [pivoAl[0] + 3, topoTubo + 1], [pivoAl[0] - 3, topoTubo + 1]], true), { w: 2, papel: true, icone: false }); // o suporte do pivô
    t(poli([[haste.x - 2.5, haste.yT], [haste.x + 2.5, haste.yT], [haste.x + 2.5, topoTubo + 1], [haste.x - 2.5, topoTubo + 1]], true), { w: 2, papel: true, icone: false }); // a haste
    t(barra([haste.x, haste.yT], manivela, 4), { w: 2, papel: true, icone: false }); // a manivela, inclinada
    t(barra(pontaAl, manivela, 3), { w: 2, papel: true, icone: false }); // o tirante da válvula
    t(barra([ex + luva.r + 1, ya], pontaAl, 5), { papel: true, icone: false }); // a alavanca
    cheio(circulo(pivoAl, 2.4), { icone: false }); // o pivô
    cheio(circulo(pontaAl, 1.8), { icone: false });
    cheio(circulo(manivela, 1.8), { icone: false });
    cheio(circulo([haste.x, haste.yT], 2), { icone: false });

    // ---------- a sombra no chão, da base ao tubo ----------
    chao(ex - 1.118 * base.r, tb.x1 + 10, chaoY + 1, { altura: 7 });

    // ---------- o fantasma: a máquina acelerada, as esferas e os braços na posição alta e a luva levantada ----------
    {
      const alto = 66;
      const e2 = braco(-1, alto);
      const d2 = braco(1, alto);
      // Os tirantes têm o comprimento que têm: a luva sobe até onde eles deixam.
      const comp = (b, o) => Math.hypot(o[0] - b.pino[0], o[1] - b.pino[1]);
      const sobe = (b, b2, o) => o[1] - (b2.pino[1] + Math.sqrt(comp(b, o) ** 2 - (o[0] - b2.pino[0]) ** 2));
      const subida = (sobe(esq, e2, ombro.E) + sobe(dir, d2, ombro.D)) / 2;
      const f2 = formasCilindro(ex, luva.yT - subida, luva.yB - subida, luva.r);
      const [oE, oD] = [f2.em(luva.yT - subida, AE), f2.em(luva.yT - subida, AT)];
      const volta = (b) => {
        const a0 = graus(Math.atan2(b.entrada[1] - b.esfera[1], b.entrada[0] - b.esfera[0]));
        return arco(b.esfera, R, R, a0, a0 + 360);
      };
      t(
        juntar(
          [
            volta(d2), // a esfera da direita, a partir de onde o braço entra nela
            linha(d2.entrada, d2.pino),
            linha(d2.pino, pivo),
            linha(pivo, e2.pino),
            linha(e2.pino, e2.entrada),
            volta(e2), // a esfera da esquerda
            linha(e2.entrada, e2.pino),
            linha(e2.pino, oE), // o tirante da esquerda
            linha(oE, f2.em(luva.yB - subida, AE)), // a luva: o lado esquerdo, a frente de baixo, o lado direito, o fundo de cima, a frente de cima
            f2.horiz(luva.yB - subida, AE, AT + 360),
            linha(f2.em(luva.yB - subida, AT), oD),
            f2.horiz(luva.yT - subida, AT, AE),
            f2.aro(),
            linha(oD, d2.pino), // o tirante da direita
            linha(d2.pino, d2.entrada),
          ],
          false,
        ),
        { fantasma: true },
      );
    }
  },
};
