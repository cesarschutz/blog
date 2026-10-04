/**
 * Frontend: a prensa tipográfica de ferro (Albion, Londres, c. 1820). O bastidor de ferro fundido
 * em arco achatado, com o tambor da mola e o remate em coroa; a platina pendurada pelo nó da
 * articulação; a alavanca (a barra) com o punho em bola, à direita; e, na frente, o leito corrido
 * para fora sobre os trilhos, com a forma de tipos em cima e o tímpano aberto com a folha presa. A
 * máquina onde tipo, tinta e papel viram a página que o leitor vê.
 *
 * Vista de 3/4 pela frente-direita, na mesma projeção oblíqua da caixa registradora (a frente
 * plana, o fundo fugindo para cima e para a direita), olho um pouco acima, luz do alto à esquerda:
 * hachura nas faces da direita (o montante, o flanco do arco, a platina, o leito, a forma) e na
 * sombra do chão. A ficha pedia a fuga para a esquerda; aqui ela fica como nos outros doze, e o
 * leito sai para a frente-esquerda (como nas gravuras da Albion), com a alavanca à direita: a
 * composição equilibra sem inverter a projeção do conjunto.
 *
 * De trás para a frente: o bastidor (os dois montantes, a cabeça em arco, a travessa de baixo e a
 * base, com a língua que avança sob o leito), o tambor da mola com a coroa no ápice, o pistão com
 * o nó da articulação e a platina; os trilhos saindo do bastidor para a frente, com a perna na
 * ponta apoiada na língua; o leito sobre os trilhos, com a forma (a rama e o bloco de tipos,
 * hachurado cerrado); o tímpano aberto na ponta do leito, com a folha presa; a alavanca. O fantasma
 * é a folha impressa levantada do tímpano, com as linhas de texto dentro (tracejadas à mão em w3,
 * parte do mesmo fantasma): a página que sai.
 *
 * O ícone é chapado, como o do tear: o contorno do bastidor com a base e a abertura (traços só do
 * ícone), o tambor com a coroa, o pistão, a platina, o leito saindo para a frente (a frente e o
 * tampo) e a alavanca com a bola. As faces que fogem, os trilhos, a perna, a forma, o tímpano, a
 * folha e os parafusos saem: o livro é fino na estante e o ícone aparece com uns 20px.
 */

// O vetor de fundo: cada unidade de profundidade anda A para a direita e B para cima.
const A = 0.5;
const B = 0.36;
const P = (x, y, z = 0) => [x + A * z, y - B * z];
const rad = (g) => (g * Math.PI) / 180;
const graus = (r) => (r * 180) / Math.PI;
/** p + v·s, em 3D. */
const soma = (p, v, s = 1) => [p[0] + v[0] * s, p[1] + v[1] * s, p[2] + v[2] * s];

export default {
  instrumento: "prensa tipográfica de ferro (Albion)",
  titulo: "Frontend",
  cor: "#433123",
  desenho({ t, hachura, chao, ponto, cheio, linha, poli, arco, circulo, retangulo, mover, juntar }) {
    /** Face plana por pontos 3D [x, y, z], fechada. */
    const face = (pontos) => poli(pontos.map(([x, y, z]) => P(x, y, z)), true);
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
    /**
     * Um bloco de x0 a x1, y0 a y1 (para baixo) e z0 a z1 (para o fundo): a face da direita (na
     * sombra), o tampo e a frente, nessa ordem, cada uma tapando o que ficou atrás. `icone` vale
     * para a frente; o tampo e a face da direita só entram no ícone com `iconeTampo` e `iconeDireita`.
     */
    const bloco = (x0, x1, y0, y1, z0, z1, { sombra = true, tampo = true, direita = true, frente = true, passo = 4.2, icone = true, iconeTampo = false, iconeDireita = false, w = 1 } = {}) => {
      if (direita) {
        const lado = face([[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]]);
        t(lado, { w, papel: true, icone: iconeDireita });
        if (sombra) hachura(lado, { angulo: 60, passo });
      }
      if (tampo) t(face([[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]]), { w, papel: true, icone: iconeTampo });
      if (frente) t(face([[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]]), { w, papel: true, icone });
    };
    /** Uma barra reta de a a b (2D), com a espessura dada: um retângulo girado, fechado. */
    const barra = (a, b, e) => {
      const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      const n = [(-(b[1] - a[1]) / l) * (e / 2), ((b[0] - a[0]) / l) * (e / 2)];
      return poli([[a[0] + n[0], a[1] + n[1]], [b[0] + n[0], b[1] + n[1]], [b[0] - n[0], b[1] - n[1]], [a[0] - n[0], a[1] - n[1]]], true);
    };

    // ---------- as medidas ----------
    const E = 26; // a espessura do bastidor (em z)
    const cx = 252; // o eixo do bastidor
    const M = 26; // a largura de cada montante
    const rxF = 75; // meia largura do bastidor
    const [xl, xr] = [cx - rxF, cx + rxF - M]; // a face esquerda do montante esquerdo e a do direito
    const mola = 448; // a linha de arranque do arco
    const baseY = 620; // o alto da base
    const chaoY = 632; // o chão
    const ryF = 30; // a flecha do arco de fora (ápice em 418)
    const [rxD, ryD] = [rxF - M, 14]; // o arco de dentro (ápice em 434)
    const [wy0, wy1] = [566, 584]; // a travessa que segura os trilhos (o "inverno")
    const zf = -104; // a ponta da frente dos trilhos
    // o arco, no plano z: 0 à direita (a mola), 90 no ápice, 180 à esquerda
    const arcoF = (a0, a1, z) => elipse3([cx, mola, z], [rxF, 0, 0], [0, -ryF, 0], a0, a1);
    const arcoD = (a0, a1, z) => elipse3([cx, mola, z], [rxD, 0, 0], [0, -ryD, 0], a0, a1);

    // ---------- só no ícone: o contorno chapado do bastidor com a base, e a abertura ----------
    t(
      juntar([
        arcoF(180, 0, 0),
        poli([[cx + rxF, mola], [cx + rxF, baseY], [cx + rxF + 10, baseY], [cx + rxF + 10, chaoY], [cx - rxF - 10, chaoY], [cx - rxF - 10, baseY], [cx - rxF, baseY], [cx - rxF, mola]]),
      ]),
      { soIcone: true },
    );
    t(juntar([arcoD(180, 0, 0), poli([[cx + rxD, mola], [cx + rxD, wy0], [cx - rxD, wy0], [cx - rxD, mola]])]), { soIcone: true });

    // ---------- a base e a travessa de baixo, atrás de tudo ----------
    bloco(xl - 10, xr + M + 10, baseY, chaoY, -8, E + 10, { passo: 4.2, icone: false });
    // a língua da base, que avança sob o leito para a perna da ponta se apoiar
    bloco(cx - 26, cx + 16, baseY, chaoY, zf + 2, -8, { passo: 4.2, icone: false });
    bloco(xl + M, xr, wy0, wy1, 0, E, { direita: false, icone: false });

    // ---------- os montantes ----------
    bloco(xl, xl + M, mola, baseY, 0, E, { tampo: false, passo: 3.8, icone: false });
    // a face de dentro do montante esquerdo, que aparece pela abertura (vira para a direita: na sombra)
    const dentro = face([[xl + M, mola + 1, 0], [xl + M, mola + 1, E], [xl + M, wy0, E], [xl + M, wy0, 0]]);
    t(dentro, { w: 2, papel: true, icone: false });
    hachura(dentro, { angulo: 60, passo: 5, margem: 1 });
    bloco(xr, xr + M, mola, baseY, 0, E, { tampo: false, passo: 3.8, icone: false });

    // ---------- a cabeça: o arco achatado ----------
    // Onde a silhueta do arco passa da frente para o fundo: a tangente paralela ao vetor de fundo.
    const at = 180 - graus(Math.atan2(ryF * A, rxF * B));
    const noArco = (a, z) => [cx + rxF * Math.cos(rad(a)), mola - ryF * Math.sin(rad(a)), z];
    // o flanco do arco (a face que vira para a direita e para cima), fechado pela silhueta de trás
    t(fechada(juntar([arcoF(0, at, 0), aresta(noArco(at, 0), noArco(at, E)), arcoF(at, 0, E), aresta(noArco(0, E), noArco(0, 0))])), { papel: true, icone: false });
    hachura(fechada(juntar([arcoF(0, 50, 0), aresta(noArco(50, 0), noArco(50, E)), arcoF(50, 0, E), aresta(noArco(0, E), noArco(0, 0))])), { angulo: 60, passo: 4.2 });
    // a face da frente do arco: de fora, as linhas de arranque e o arco de dentro
    t(fechada(juntar([arcoF(180, 0, 0), aresta([cx + rxF, mola, 0], [cx + rxD, mola, 0]), arcoD(0, 180, 0), aresta([cx - rxD, mola, 0], [cx - rxF, mola, 0])])), { papel: true, icone: false });
    // a face de dentro do arco, à esquerda, que aparece pela abertura
    {
      const a1 = 112;
      const em = (z) => [cx + rxD * Math.cos(rad(a1)), mola - ryD * Math.sin(rad(a1)), z];
      t(fechada(juntar([arcoD(180, a1, 0), aresta(em(0), em(E)), arcoD(a1, 180, E), aresta([cx - rxD, mola, E], [cx - rxD, mola, 0])])), { w: 2, papel: true, icone: false });
    }

    // ---------- o tambor da mola no ápice, com a coroa em cima ----------
    const [tr, ty0] = [13.5, 407]; // o raio do tambor e o alto dele
    {
      const zc = E / 2;
      const horiz = (y, a0, a1) => elipse3([cx, y, zc], [tr, 0, 0], [0, 0, tr], a0, a1);
      const AT = graus(Math.atan(A)); // as tangentes de um cilindro em pé
      const AE = AT + 180;
      const em = (y, a) => P(cx + tr * Math.cos(rad(a)), y, zc + tr * Math.sin(rad(a)));
      const yb = 428; // a base do tambor, dentro da cabeça
      t(juntar([horiz(ty0, AT, AE), linha(em(ty0, AE), em(yb, AE)), horiz(yb, AE, AT + 360), linha(em(yb, AT), em(ty0, AT))]), { papel: true });
      t(horiz(ty0, AE, AT + 360), { icone: false }); // a frente do aro de cima
      hachura(juntar([horiz(ty0, 300, AT + 360), linha(em(ty0, AT), em(yb, AT)), horiz(yb, AT + 360, 300), linha(em(yb, 300), em(ty0, 300))]), { angulo: 60, passo: 3.6 });
    }
    // a coroa: a faixa, as pontas e as bolinhas
    {
      const [bx, by] = P(cx, ty0 - 1, E / 2); // o pé da coroa, no alto do tambor
      const pontas = [[-13, 0], [-13, -5], [-9, -12], [-5, -6], [0, -14], [5, -6], [9, -12], [13, -5], [13, 0]].map(([dx, dy]) => [bx + dx, by + dy]);
      t(poli(pontas, true), { w: 2, papel: true, icone: true });
      for (const [dx, dy] of [[-9, -12], [0, -14], [9, -12]]) cheio(circulo([bx + dx, by + dy], 1.5), { icone: false });
    }

    // ---------- o mecanismo: o pistão, o nó da articulação e a platina ----------
    const zm = E / 2; // o plano do meio do bastidor
    bloco(cx - 7, cx + 7, 432, 486, zm - 6, zm + 6, { passo: 3, tampo: false }); // o pistão
    bloco(cx - 15, cx + 15, 460, 474, zm - 10, zm + 10, { passo: 3.2, icone: false }); // o nó da articulação
    const [px0, px1, py0, py1] = [cx - 41, cx + 41, 486, 498]; // a platina
    bloco(px0, px1, py0, py1, 2, E - 2, { passo: 3.6 });
    hachura(face([[px0 + 2, py1, 2], [px1 - 2, py1, 2], [px1 - 2, py1 + 6, 2], [px0 + 2, py1 + 6, 2]]), { angulo: 60, passo: 3, margem: 0.5 }); // a sombra dela, embaixo

    // ---------- os trilhos, saindo do bastidor para a frente, e a perna na ponta ----------
    const [ty, te] = [558, 8]; // o alto dos trilhos e a altura deles
    for (const x of [cx - 32, cx + 20]) bloco(x, x + 12, ty, ty + te, zf, E - 4, { sombra: false, w: 2, icone: false });
    const [lx0, lx1, ly0, ly1] = [cx - 44, cx + 44, 540, ty]; // o leito
    // a perna, da ponta dos trilhos até a língua da base
    const [pz, pw] = [zf + 12, 9];
    bloco(cx - 5 - pw / 2, cx - 5 + pw / 2, ty + te, baseY + 0.5, pz - 4.5, pz + 4.5, { passo: 3, icone: false });

    // ---------- o leito sobre os trilhos, com a forma de tipos ----------
    bloco(lx0, lx1, ly0, ly1, zf, 0, { passo: 4, iconeTampo: true });
    // a forma: a rama (o caixilho) com o bloco de tipos dentro, hachurado cerrado (o preto do tipo)
    const [fx0, fx1, fy, fz0, fz1] = [cx - 16, cx + 42, ly0 - 12, -58, -6];
    bloco(fx0, fx1, fy, ly0, fz0, fz1, { passo: 3.4, icone: false });
    const tipos = face([[fx0 + 4, fy, fz0 + 4], [fx1 - 4, fy, fz0 + 4], [fx1 - 4, fy, fz1 - 4], [fx0 + 4, fy, fz1 - 4]]);
    t(tipos, { w: 2, icone: false });
    hachura(tipos, { angulo: 60, passo: 2.3, margem: 0.6 });

    // ---------- o tímpano aberto na ponta do leito, com a folha presa ----------
    const teta = 45; // aberto, caído para a frente
    const dT = [0, -Math.sin(rad(teta)), -Math.cos(rad(teta))]; // da dobradiça para a ponta
    const LT = 54;
    const h0 = [lx0, ly0, zf];
    const h1 = [lx1, ly0, zf];
    const noTimpano = (dx, s) => soma(soma(h0, [1, 0, 0], dx), dT, s); // um ponto do tímpano: dx da esquerda, s da dobradiça
    const LX = lx1 - lx0;
    t(face([h0, h1, noTimpano(LX, LT), noTimpano(0, LT)]), { papel: true, icone: false });
    t(face([noTimpano(7, 6), noTimpano(LX - 7, 6), noTimpano(LX - 7, LT - 6), noTimpano(7, LT - 6)]), { w: 2, icone: false }); // a folha presa
    t(aresta(h0, h1), { w: 2, icone: false }); // a dobradiça
    for (const x of [lx0 + 12, lx1 - 12]) cheio(circulo(P(x, ly0, zf), 1.6), { icone: false });

    // ---------- a alavanca (a barra), no lado direito, com o punho em bola ----------
    const eixo = P(xr + M, 462, zm);
    const bola = [438, 494];
    t(barra([eixo[0] + 5, eixo[1] + 2], bola, 6.5), { papel: true });
    t(circulo(eixo, 7.5), { papel: true });
    ponto(eixo, 2.2);
    t(circulo(bola, 8.5), { papel: true });
    hachura(juntar([arco(bola, 8.5, 8.5, -30, 150), arco([bola[0] - 4.5, bola[1] - 4.5], 8.5, 8.5, 150, -30)]), { angulo: 60, passo: 2.8, margem: 0.8 });

    // ---------- os parafusos onde a travessa prende nos montantes ----------
    for (const x of [xl + M / 2, xr + M / 2]) cheio(circulo(P(x, (wy0 + wy1) / 2, 0), 1.8), { icone: false });

    // ---------- a sombra no chão ----------
    chao(xl - 12, xr + M + 14, chaoY + 2);
    {
      const [sx, sy] = [xr + M + 14, chaoY + 1.5];
      const [dx, dy] = [A * (E + 10), -B * (E + 10)];
      hachura(poli([[sx, sy], [sx + dx, sy + dy], [sx + dx + 4, sy + dy + 4], [sx + 4, sy + 4]], true), { angulo: 38, passo: 3.6, margem: 0.2 });
    }
    chao(P(cx - 28, 0, zf + 2)[0], P(cx + 18, 0, zf + 2)[0], P(0, chaoY + 1, zf + 2)[1] + 1, { altura: 6 }); // sob a ponta da língua

    // ---------- o fantasma: a folha impressa levantada do tímpano, com as linhas de texto ----------
    {
      const [bx, by] = P(...noTimpano(2, LT)); // onde a folha se apoia: a beira de cima do tímpano, à esquerda
      const [LF, HF] = [66, 78]; // a folha
      const giro = -10; // levantada, pendendo um pouco para a esquerda
      const centro = [bx + LF, by];
      t(mover(retangulo(bx, by - HF, LF, HF, 1.5), { giro, centro }), { fantasma: true });
      // as linhas de texto, tracejadas à mão em w3 (parte do mesmo fantasma)
      for (const [i, comp] of [0.74, 0.86, 0.8, 0.88, 0.84, 0.52].entries()) {
        const y = by - HF + 15 + i * 10;
        const fim = bx + 9 + (LF - 18) * comp;
        for (let x = bx + 9; x < fim; x += 6.5) t(mover(linha([x, y], [Math.min(x + 3.2, fim), y]), { giro, centro }), { w: 3 });
      }
    }
  },
};
