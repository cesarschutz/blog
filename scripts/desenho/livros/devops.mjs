/**
 * DevOps: a estação de tubo pneumático (1853). O tubo de Latimer Clark, em Londres, levava os
 * telegramas da central à Bolsa em bolsas de feltro puxadas pelo vácuo, para a companhia não precisar
 * de mensageiros correndo entre os dois prédios. A cápsula é o contêiner (o mesmo conteúdo chega
 * intacto onde vai ser usado), o tubo é o pipeline, a estação é o ambiente, e ninguém carrega nada.
 *
 * Vista de 3/4 pela frente-direita, na mesma projeção oblíqua da caixa registradora (a frente plana,
 * o fundo fugindo para cima e para a direita), luz do alto à esquerda. Sobre um balcão de madeira
 * (um bloco com o tampo, a frente e a ponta direita à vista), o terminal de latão: um cilindro em pé
 * sobre uma base com flange, com o colar em cima; na frente, a boca com a portinhola aberta para
 * baixo na dobradiça. Do colar sobe o tubo, de diâmetro menor, que faz o cotovelo e corre para a
 * direita até o engate na borda da capa (o pipeline continua). No balcão, à esquerda, a cápsula
 * deitada, com os dois anéis de feltro nas pontas, e um maço de cartões (os telegramas) na frente.
 * O fantasma é a cápsula dentro do tubo, depois do cotovelo: a caminho.
 *
 * No ícone ficam o terminal, a boca com a portinhola, o tubo com o cotovelo e o engate, e a cápsula
 * ao lado (um J invertido sobre um cilindro, com um cilindrinho ao lado). O balcão e os cartões saem.
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
  instrumento: "estação de tubo pneumático",
  titulo: "DevOps",
  cor: "#92a6c2",
  desenho({ t, hachura, chao, ponto, linha, poli, juntar }) {
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
    /** Face plana por pontos 3D [x, y, z], fechada. */
    const face = (pontos) => poli(pontos.map(([x, y, z]) => P(x, y, z)), true);
    /** Aresta entre dois pontos 3D. */
    const aresta = (a, b) => linha(P(...a), P(...b));
    /** p + v·s, em 3D. */
    const soma = (p, v, s = 1) => [p[0] + v[0] * s, p[1] + v[1] * s, p[2] + v[2] * s];

    /** As formas de um cilindro em pé (eixo em x = cx, profundidade z), do topo yT à base yB. */
    const formasCilindro = (cx, z, yT, yB, r) => {
      const horiz = (y, a0, a1) => elipse3([cx, y, z], [r, 0, 0], [0, 0, r], a0, a1);
      const em = (y, a) => P(cx + r * Math.cos(rad(a)), y, z + r * Math.sin(rad(a)));
      return {
        em,
        horiz,
        // a silhueta, a partir da tangente da direita, no alto: o fundo do aro de cima, o lado esquerdo, a frente do aro de baixo, o lado direito
        silhueta: () => juntar([horiz(yT, AT, AE), linha(em(yT, AE), em(yB, AE)), horiz(yB, AE, AT + 360), linha(em(yB, AT), em(yT, AT))]),
        aro: () => horiz(yT, AE, AT + 360), // a frente do aro de cima
        sombra: (de = 300) => juntar([horiz(yT, de, AT + 360), linha(em(yT, AT), em(yB, AT)), horiz(yB, AT + 360, de), linha(em(yB, de), em(yT, de))]),
      };
    };
    /** Desenha um cilindro em pé: a silhueta (que tapa o que ficou atrás), o aro de cima e a faixa de sombra à direita. */
    const cilindro = (cx, z, yT, yB, r, { w = 1, icone, sombra = true, passo = 4, de = 300 } = {}) => {
      const f = formasCilindro(cx, z, yT, yB, r);
      t(f.silhueta(), { w, papel: true, icone });
      t(f.aro(), { w, icone });
      if (sombra) hachura(f.sombra(de), { angulo: 60, passo });
      return f;
    };
    /**
     * Um cilindro deitado ao longo de x, de x0 a x1, com o eixo em y = cy (coordenadas da capa; a
     * profundidade já está embutida no eixo): a ponta da direita fica à vista.
     */
    const tubo = (x0, x1, cy, r, { w = 1, icone, sombra = true, passo = 4, de = 292 } = {}) => {
      const vert = (x, a0, a1) => elipse3([x, cy, 0], [0, r, 0], [0, 0, r], a0, a1);
      const em = (x, a) => P(x, cy + r * Math.cos(rad(a)), r * Math.sin(rad(a)));
      t(juntar([vert(x0, ACX, ABX + 360), linha(em(x0, ABX), em(x1, ABX)), vert(x1, ABX + 360, ACX + 360), linha(em(x1, ACX), em(x0, ACX))]), { w, papel: true, icone });
      t(vert(x1, ACX, ABX + 360), { w, icone }); // a frente do aro da ponta
      if (sombra) hachura(juntar([vert(x0, de, ABX + 360), linha(em(x0, ABX), em(x1, ABX)), vert(x1, ABX + 360, de), linha(em(x1, de), em(x0, de))]), { angulo: 60, passo });
      return { vert, em };
    };

    // ---------- medidas ----------
    const TOPO = 650; // o tampo do balcão (y, em 3D)
    const FUNDO = 678; // a base da frente do balcão
    const [BX0, BX1, BD] = [40, 370, 145]; // o balcão: esquerda, direita e profundidade
    const ESP = 8; // a espessura do tampo
    const Z = 80; // a profundidade em que o terminal e a cápsula estão apoiados
    const CX = 228; // o eixo do terminal (x, em 3D)
    const SX = CX + A * Z; // o mesmo eixo, na capa
    const RC = 46; // o corpo do terminal
    const [RF, RK] = [52, 50]; // a flange da base e o colar de cima
    const [YK0, YK1, YC1, YF1] = [518, 525, 643, TOPO]; // o colar, o corpo e a flange (y, em 3D)
    const RT = 19; // o tubo

    // ---------- o balcão: o tampo, a ponta direita (na sombra) e a frente ----------
    t(face([[BX0, TOPO, 0], [BX1, TOPO, 0], [BX1, TOPO, BD], [BX0, TOPO, BD]]), { papel: true, icone: false }); // o tampo
    const ponta = face([[BX1, TOPO, 0], [BX1, TOPO, BD], [BX1, FUNDO, BD], [BX1, FUNDO, 0]]);
    t(ponta, { papel: true, icone: false });
    hachura(ponta, { angulo: 60, passo: 4.2 });
    t(face([[BX0, TOPO, 0], [BX1, TOPO, 0], [BX1, FUNDO, 0], [BX0, FUNDO, 0]]), { papel: true, icone: false }); // a frente
    t(aresta([BX0, TOPO + ESP, 0], [BX1, TOPO + ESP, 0]), { w: 2, icone: false }); // a borda de baixo do tampo
    t(aresta([BX1, TOPO + ESP, 0], [BX1, TOPO + ESP, BD]), { w: 3, icone: false });
    hachura(face([[BX0, TOPO + ESP, 0], [BX1, TOPO + ESP, 0], [BX1, TOPO + ESP + 9, 0], [BX0, TOPO + ESP + 9, 0]]), { angulo: 60, passo: 3 }); // a sombra sob o tampo

    // ---------- o maço de cartões (os telegramas), na frente, à esquerda ----------
    for (const [i, dy] of [0, -1.6, -3.2].entries()) {
      const y = TOPO + dy;
      t(face([[52, y, 10], [100 + i * 0.6, y, 10 + i * 1.2], [100 + i * 0.6, y, 38 + i * 1.2], [52, y, 38]]), { w: 3, papel: true });
    }

    // ---------- a cápsula deitada no balcão, com os dois anéis de feltro ----------
    const cap = { x0: 40, x1: 140, r: 13, R: 15.5, f: 10 };
    const capY = TOPO - cap.R; // o eixo, em 3D
    const [cx0, cx1, ccy] = [cap.x0 + A * Z, cap.x1 + A * Z, capY - B * Z]; // na capa
    tubo(cx0, cx1, ccy, cap.r, { passo: 3.6, icone: false }); // o corpo
    tubo(cx0, cx0 + cap.f, ccy, cap.R, { passo: 3.2, icone: false }); // o anel da esquerda
    tubo(cx1 - cap.f, cx1, ccy, cap.R, { passo: 3.2, icone: false }); // o anel da direita, com a ponta à vista
    t(fechada(elipse3([cx1, ccy, 0], [0, cap.r, 0], [0, 0, cap.r])), { w: 2, icone: false }); // o corpo na ponta
    ponto(P(cx1, ccy, 0), 1.6);
    chao(cx0 - 2, cx1 + 6, TOPO - B * (Z - cap.R) + 1, { altura: 6 });
    // No ícone, a cápsula é a mesma, só que maior: a 30px, a de cima some, e é ela que diz o que o objeto é.
    {
      const g = { x0: 48, x1: 180, r: 17, R: 20.5, f: 13 };
      const vert = (x, rr, a0, a1) => elipse3([x, ccy, 0], [0, rr, 0], [0, 0, rr], a0, a1);
      const em = (x, rr, a) => P(x, ccy + rr * Math.cos(rad(a)), rr * Math.sin(rad(a)));
      const peca = (x0, x1, rr) => {
        t(juntar([vert(x0, rr, ACX, ABX + 360), linha(em(x0, rr, ABX), em(x1, rr, ABX)), vert(x1, rr, ABX + 360, ACX + 360), linha(em(x1, rr, ACX), em(x0, rr, ACX))]), { papel: true, soIcone: true });
        t(vert(x1, rr, ACX, ABX + 360), { soIcone: true });
      };
      peca(g.x0, g.x1, g.r);
      peca(g.x0, g.x0 + g.f, g.R);
      peca(g.x1 - g.f, g.x1, g.R);
      t(fechada(elipse3([g.x1, ccy, 0], [0, g.r, 0], [0, 0, g.r])), { w: 2, soIcone: true });
    }

    // ---------- o terminal: a flange, o corpo, o colar ----------
    cilindro(CX, Z, YC1, YF1, RF, { passo: 4.2 }); // a flange da base
    const corpo = cilindro(CX, Z, YK1, YC1, RC, { passo: 4 }); // o corpo
    t(corpo.horiz(YK1 + 14, AE, AT + 360), { w: 3, icone: false }); // a junta sob o colar
    const colar = cilindro(CX, Z, YK0, YK1, RK, { sombra: false }); // o colar de cima
    hachura(colar.sombra(320), { angulo: 60, passo: 3.2 });
    chao(SX - 1.118 * RF - 2, SX + 1.118 * RF + 2, TOPO - B * (Z - RF) + 1);

    // ---------- a boca, com a portinhola aberta para baixo ----------
    const [A0, A1] = [238, 302]; // os lados da boca, no círculo do corpo (270° é a frente)
    const [BY0, BY1] = [548, 598]; // a boca, de cima a baixo (y, em 3D)
    const boca = juntar([corpo.horiz(BY0, A0, A1), linha(corpo.em(BY0, A1), corpo.em(BY1, A1)), corpo.horiz(BY1, A1, A0), linha(corpo.em(BY1, A0), corpo.em(BY0, A0))]);
    t(boca, { w: 2, papel: true });
    hachura(boca, { angulo: 60, passo: 2.8, margem: 0.6 }); // o interior escuro
    {
      const HL = [CX + RC * Math.cos(rad(A0)), BY1, Z + RC * Math.sin(rad(A0))];
      const HR = [CX + RC * Math.cos(rad(A1)), BY1, Z + RC * Math.sin(rad(A1))];
      const teta = rad(125); // a abertura da portinhola, a partir de fechada
      const h = BY1 - BY0;
      const d = [0, -Math.cos(teta), -Math.sin(teta)]; // da dobradiça para a borda livre
      const [FL, FR] = [soma(HL, d, h), soma(HR, d, h)];
      t(face([HL, HR, FR, FL]), { w: 2, papel: true });
      t(aresta(soma(HL, d, h * 0.84), soma(HR, d, h * 0.84)), { w: 3 }); // o rebordo da borda livre
      ponto(P(...soma(soma(HL, [1, 0, 0], (HR[0] - HL[0]) / 2), d, h * 0.92)), 1.8); // o botão
      ponto(P(...HL), 1.6); // os pinos da dobradiça
      ponto(P(...HR), 1.6);
    }

    // ---------- o tubo: a subida, o cotovelo e a reta até o engate ----------
    const pe = formasCilindro(CX, Z, YK0, YK0, RT); // o pé do tubo, no colar
    const YE = 439; // onde a subida vira cotovelo (na capa)
    const RCO = 32; // o raio do cotovelo (pelo eixo)
    const YH = YE - RCO; // o eixo da reta
    const XF = 436; // onde a reta termina, dentro do engate
    const CE = [SX + RCO, YE]; // o centro do cotovelo
    // Meia largura da silhueta de um tubo cuja direção na capa tem a normal M: a seção redonda vira elipse.
    const meia = (M) => RT * Math.sqrt(1 + (A * M[0] - B * M[1]) ** 2);
    const [eV, eH] = [meia([1, 0]), meia([0, -1])];
    /** A borda do cotovelo, a k vezes a meia largura do eixo (k > 0: para fora, k < 0: para dentro), de a0 a a1 graus. */
    const bordaCotovelo = (k, a0, a1) => {
      const n = 28;
      const pts = Array.from({ length: n + 1 }, (_, i) => {
        const f = rad(a0 + ((a1 - a0) * i) / n);
        const M = [Math.cos(f), Math.sin(f)];
        const e = meia(M) * k;
        return [CE[0] + (RCO + e) * M[0], CE[1] + (RCO + e) * M[1]];
      });
      return { pts, fechada: false };
    };
    t(
      juntar([
        linha(pe.em(YK0, AE), [SX - eV, YE]), // o lado esquerdo da subida
        bordaCotovelo(1, 180, 270), // a borda de fora do cotovelo
        linha([SX + RCO, YH - eH], [XF, YH - eH]), // a borda de cima da reta
        linha([XF, YH - eH], [XF, YH + eH]), // (fica escondido pelo engate)
        linha([XF, YH + eH], [SX + RCO, YH + eH]), // a borda de baixo
        bordaCotovelo(-1, 270, 180), // a borda de dentro do cotovelo
        linha([SX + eV, YE], pe.em(YK0, AT)), // o lado direito da subida
        pe.horiz(YK0, AT + 360, AE), // o pé do tubo, na frente do colar
      ]),
      { papel: true },
    );
    {
      // a sombra: o lado direito da subida e o lado de baixo do cotovelo, numa faixa só
      const k = 0.38;
      const [yb, xr] = [pe.em(YK0, AT)[1], SX + RCO + 10];
      hachura(
        juntar([
          linha([SX + k * eV, yb], [SX + k * eV, YE]),
          bordaCotovelo(-k, 180, 270),
          linha([SX + RCO, YH + k * eH], [xr, YH + k * eH]),
          linha([xr, YH + k * eH], [xr, YH + eH]),
          linha([xr, YH + eH], [SX + RCO, YH + eH]),
          bordaCotovelo(-1, 270, 180),
          linha([SX + eV, YE], [SX + eV, yb]),
        ]),
        { angulo: 60, passo: 3.6, margem: 0.6 },
      );
    }
    // o engate, na borda da capa: o tubo continua
    const engate = tubo(430, 439, YH, 22, { passo: 3.8 });
    t(fechada(elipse3([439, YH, 0], [0, RT, 0], [0, 0, RT])), { w: 2, icone: false }); // o tubo visto na ponta do engate
    void engate;

    // ---------- o fantasma: a cápsula dentro do tubo, depois do cotovelo, a caminho ----------
    {
      const g = { x0: 310, x1: 410, r: 13, R: 15.5, f: 10 };
      const em = (x, rr, a) => P(x, YH + rr * Math.cos(rad(a)), rr * Math.sin(rad(a)));
      const vert = (x, rr, a0, a1) => elipse3([x, YH, 0], [0, rr, 0], [0, 0, rr], a0, a1);
      // Um traço só, do alto da ponta direita ao pé dela: a borda de cima (com os degraus dos anéis), a
      // ponta esquerda pela frente, a borda de baixo, e a ponta direita inteira (por trás e pela frente).
      t(
        juntar(
          [
            linha(em(g.x1, g.R, ACX), em(g.x1 - g.f, g.R, ACX)),
            linha(em(g.x1 - g.f, g.R, ACX), em(g.x1 - g.f, g.r, ACX)),
            linha(em(g.x1 - g.f, g.r, ACX), em(g.x0 + g.f, g.r, ACX)),
            linha(em(g.x0 + g.f, g.r, ACX), em(g.x0 + g.f, g.R, ACX)),
            linha(em(g.x0 + g.f, g.R, ACX), em(g.x0, g.R, ACX)),
            vert(g.x0, g.R, ACX, ABX + 360),
            linha(em(g.x0, g.R, ABX), em(g.x0 + g.f, g.R, ABX)),
            linha(em(g.x0 + g.f, g.R, ABX), em(g.x0 + g.f, g.r, ABX)),
            linha(em(g.x0 + g.f, g.r, ABX), em(g.x1 - g.f, g.r, ABX)),
            linha(em(g.x1 - g.f, g.r, ABX), em(g.x1 - g.f, g.R, ABX)),
            linha(em(g.x1 - g.f, g.R, ABX), em(g.x1, g.R, ABX)),
            vert(g.x1, g.R, ABX + 360, ACX + 360),
            vert(g.x1, g.R, ACX, ABX + 360),
          ],
          false,
        ),
        { fantasma: true },
      );
    }
  },
};
