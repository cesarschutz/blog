/**
 * Desenvolvimento de Software: o tear de Jacquard (1804) com a cadeia de cartões perfurados. A
 * primeira máquina cujo comportamento vem de um programa trocável, separado da máquina: um cartão por
 * passada, furo levanta o fio, sem furo deixa embaixo.
 *
 * Vista de 3/4 pela frente-direita, na mesma projeção oblíqua da caixa registradora (a frente plana,
 * o fundo fugindo para cima e para a direita), olho um pouco acima, luz do alto à esquerda: as faces
 * da direita (montantes, travessas, a cabeça) ficam na sombra. O bastidor de madeira: quatro
 * montantes, as travessas de cima, as soleiras no chão; na frente, o órgão do peito com o pano saindo
 * por cima dele (três motivos do padrão) e enrolando no rolo de baixo; dentro, a urdidura fugindo para
 * o rolo de trás e os cordões do liço descendo da cabeça. Em cima, a cabeça de Jacquard, uma caixa; do
 * lado direito dela sai o prisma quadrado (o eixo para a direita, fora do bastidor), e nele pende a
 * cadeia de cartões: a faixa desce pela frente do prisma, faz a volta embaixo e sobe por trás (a
 * perna de trás aparece como uma tira à direita, mais alta). Cada cartão tem duas fileiras de furos,
 * uns furados e outros não: o programa. O fantasma é o próximo cartão chegando ao prisma, pairando
 * sobre a face de cima: a instrução que vem.
 *
 * No ícone ficam o bastidor da frente, a cabeça, o prisma, o contorno da cadeia, o órgão do peito e o
 * rolo: os montantes de trás, as faces que fogem, os cordões, a urdidura, os furos e o padrão viram
 * sujeira em 30px.
 */

// O vetor de fundo: cada unidade de profundidade anda A para a direita e B para cima.
const A = 0.5;
const B = 0.36;
const P = (x, y, z = 0) => [x + A * z, y - B * z];
const rad = (g) => (g * Math.PI) / 180;

export default {
  instrumento: "tear de Jacquard com a cadeia de cartões",
  titulo: "Desenvolvimento de Software",
  cor: "#82555a",
  desenho({ t, hachura, chao, ponto, cheio, linha, poli, curva, circulo, juntar }) {
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
     * Um bloco de madeira, de x0 a x1, y0 a y1 (para baixo) e z0 a z1 (para o fundo): a face da
     * direita (na sombra), o tampo e a frente, nessa ordem. `icone` vale para a frente; as faces que
     * fogem só entram no ícone com `iconeFaces`.
     */
    const bloco = (x0, x1, y0, y1, z0, z1, { sombra = true, tampo = true, direita = true, frente = true, passo = 4.2, icone = true, iconeFaces = false, w = 1 } = {}) => {
      if (direita) {
        const lado = face([[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]]);
        t(lado, { w, papel: true, icone: icone && iconeFaces });
        if (sombra) hachura(lado, { angulo: 60, passo });
      }
      if (tampo) t(face([[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]]), { w, papel: true, icone: icone && iconeFaces });
      if (frente) t(face([[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]]), { w, papel: true, icone });
    };
    /** O veio da madeira: uma linha ondulada fina, de a até b, com `n` ondas. */
    const veio = (a, b, n = 4, amp = 1.2) => {
      const pontos = [];
      for (let i = 0; i <= n; i++) {
        const s = i / n;
        const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
        const l = Math.hypot(dx, dy) || 1;
        const d = i === 0 || i === n ? 0 : (i % 2 ? amp : -amp);
        pontos.push([a[0] + dx * s - (dy / l) * d, a[1] + dy * s + (dx / l) * d]);
      }
      t(curva(pontos), { w: 3, icone: false });
    };

    // ---------- as medidas ----------
    const E = 18; // a espessura dos montantes
    const D = 84; // a profundidade do bastidor
    const [xl, xr] = [64, 294]; // a face esquerda do montante esquerdo e a do direito
    const topo = 466; // o alto do bastidor
    const chaoY = 668; // onde os montantes assentam
    const H = 14; // a altura das travessas
    const peito = 566; // o órgão do peito (onde o pano sai)

    // ---------- o fundo: os montantes de trás, a travessa de trás e o rolo da urdidura ----------
    bloco(xl, xl + E, topo, chaoY, D - E, D, { passo: 3.6, icone: false });
    bloco(xl + E, xr, topo, topo + H, D - H, D, { direita: false, icone: false });
    bloco(xr, xr + E, topo, chaoY, D - E, D, { passo: 3.6, icone: false });
    bloco(xl + E, xr, peito, peito + H, D - H, D, { direita: false, icone: false }); // o rolo da urdidura, atrás

    // As travessas dos lados, em cima, e as soleiras, embaixo (entre os montantes da frente e os de trás).
    for (const x of [xl, xr]) {
      bloco(x, x + E, topo, topo + H, E, D - E, { frente: false, passo: 3.6, icone: false });
      bloco(x, x + E, chaoY - 12, chaoY, E, D - E, { frente: false, passo: 3.6, icone: false });
    }

    // ---------- a urdidura (do peito ao rolo de trás) e os cordões do liço ----------
    const [ux0, ux1] = [102, 274];
    for (let i = 0; i <= 8; i++) {
      const x = ux0 + ((ux1 - ux0) * i) / 8;
      t(aresta([x, peito, H], [x, peito, D - H]), { w: 3, icone: false });
    }
    const zLico = 38; // os cordões descem no meio da cabeça
    for (let i = 0; i < 7; i++) {
      const x = 158 + 15 * i;
      t(aresta([x, topo, zLico], [x, peito, zLico]), { w: 3, icone: false });
    }
    // A lançadeira, pousada na urdidura, à esquerda: o casco em forma de barco (a face da frente, com
    // altura, e o tampo), com a bobina à vista no tampo.
    {
      const [lx, lz, meia, alt] = [134, 30, 5, 6]; // o centro, a meia largura e a altura
      const meio = [[-13, -0.62], [-7, -0.9], [0, -1], [7, -0.9], [13, -0.62]];
      const frente = [[-22, 0], ...meio, [22, 0]]; // a borda da frente, de ponta a ponta
      const tras = [...meio].reverse().map(([dx, dz]) => [dx, -dz]);
      const topo3 = (dx, dz) => [lx + dx, peito - alt, lz + dz * meia];
      const lados = frente.map(([dx, dz]) => P(...topo3(dx, dz)));
      t(poli([...lados, ...[...frente].reverse().map(([dx, dz]) => P(lx + dx, peito, lz + dz * meia))], true), { papel: true, icone: false }); // a face da frente
      t(poli([...frente, ...tras].map(([dx, dz]) => P(...topo3(dx, dz))), true), { papel: true, icone: false }); // o tampo
      t(poli([[-9, -0.45], [9, -0.45], [9, 0.45], [-9, 0.45]].map(([dx, dz]) => P(...topo3(dx, dz))), true), { w: 3, icone: false }); // a janela da bobina
      t(linha(P(...topo3(-9, 0)), P(...topo3(9, 0))), { w: 3, icone: false }); // a bobina
    }

    // ---------- a cabeça de Jacquard, em cima do bastidor ----------
    const [hx0, hx1, hy0, hz0, hz1] = [150, xr, 412, 10, 66];
    bloco(hx0, hx1, hy0, topo, hz0, hz1, { passo: 4.2, iconeFaces: true });
    t(aresta([hx0, hy0 + 16, hz0], [hx1, hy0 + 16, hz0]), { w: 2, icone: false }); // a tampa da caixa
    // O eixo do prisma, saindo pela face direita da cabeça (fica no ícone: é o que liga a fita à caixa).
    bloco(hx1, 314, 433, 441, 34, 42, { sombra: false, w: 2 });

    // ---------- o prisma quadrado e a cadeia de cartões ----------
    const [px0, px1, py0, py1, pz0, pz1] = [314, 384, 426, 448, 27, 49]; // o prisma: 70 de comprimento, 22 de lado
    const cartao = 17; // a altura de cada cartão na cadeia
    const n = 11; // cartões na perna da frente
    const fim = py0 + cartao * n; // onde a cadeia faz a volta
    const raio = (pz1 - pz0) / 2; // a volta de baixo: meio cilindro entre as duas pernas
    const cz = (pz0 + pz1) / 2;
    const volta = (a0, a1) => elipse3([px1, fim, cz], [0, 0, -raio], [0, raio, 0], a0, a1); // a=0 na frente, 180 atrás
    // A geratriz mais baixa da volta, vista de cima: onde y − B·z é máximo.
    const aBaixo = (Math.atan2(raio, B * raio) * 180) / Math.PI;
    const zBaixo = cz - raio * Math.cos(rad(aBaixo));
    const yBaixo = fim + raio * Math.sin(rad(aBaixo));

    // A perna de trás (quase toda escondida pela da frente) e a parte de trás da volta.
    t(face([[px0, py0, pz1], [px1, py0, pz1], [px1, fim, pz1], [px0, fim, pz1]]), { papel: true, icone: false });
    for (let k = 1; k < n; k++) t(aresta([px0, py0 + cartao * k, pz1], [px1, py0 + cartao * k, pz1]), { w: 2, icone: false });
    t(volta(aBaixo, 180), { w: 1, icone: false });

    // A face de cima e a face da ponta do prisma (o quadrado), com o eixo no meio.
    t(face([[px0, py0, pz0], [px1, py0, pz0], [px1, py0, pz1], [px0, py0, pz1]]), { papel: true });
    t(face([[px1, py0, pz0], [px1, py1, pz0], [px1, py1, pz1], [px1, py0, pz1]]), { papel: true });
    ponto(P(px1, (py0 + py1) / 2, cz), 2);

    // A perna da frente: a faixa inteira, do alto do prisma até a volta.
    t(face([[px0, py0, pz0], [px1, py0, pz0], [px1, fim, pz0], [px0, fim, pz0]]), { papel: true });
    // A volta embaixo: a parte que se vê (da frente até a geratriz mais baixa), na sombra.
    const curl = fechada(juntar([aresta([px0, fim, pz0], [px1, fim, pz0]), volta(0, aBaixo), aresta([px1, yBaixo, zBaixo], [px0, yBaixo, zBaixo])]));
    t(curl, { papel: true });
    hachura(curl, { angulo: 60, passo: 3.4, margem: 0.6 });
    // Os cartões emendados e os furos (uns furados, outros não: o programa).
    for (let k = 1; k < n; k++) t(aresta([px0, py0 + cartao * k, pz0], [px1, py0 + cartao * k, pz0]), { w: 2, icone: false });
    for (let k = 0; k < n; k++) {
      for (const fileira of [0, 1]) {
        const y = py0 + cartao * k + 5.5 + 6 * fileira;
        for (let j = 0; j < 6; j++) {
          const furado = (k * 5 + j * 3 + fileira * 7 + k * j) % 7 < 4;
          if (!furado) continue;
          cheio(circulo(P(322 + 10.8 * j, y, pz0), 1.4), { icone: false });
        }
      }
    }

    // No ícone, uma fileira de furos só, no meio da fita (os de verdade são finos demais lá).
    for (let k = 1; k < n; k += 2) t(circulo(P((px0 + px1) / 2, py0 + cartao * k + 8.5, pz0), 2.4), { w: 1, soIcone: true });

    // ---------- o fantasma: o próximo cartão chegando ao prisma ----------
    t(face([[px0, py0 - 12, pz0], [px1, py0 - 12, pz0], [px1, py0 - 12, pz1], [px0, py0 - 12, pz1]]), { fantasma: true });

    // ---------- a frente do bastidor ----------
    bloco(xl, xl + E, topo, chaoY, 0, E, { passo: 3.6 });
    bloco(xr, xr + E, topo, chaoY, 0, E, { passo: 3.6 });
    veio([xl + 8, topo + 14], [xl + 9, chaoY - 10], 6);
    veio([xr + 10, topo + 14], [xr + 8, chaoY - 10], 6);
    bloco(xl + E, xr, topo, topo + H, 0, H, { direita: false }); // a travessa de cima
    veio([xl + E + 8, topo + 7], [xr - 8, topo + 8], 5, 0.9);

    // O órgão do peito, o pano saindo por cima dele e descendo até o rolo, com o começo do padrão
    // (um ramo que serpenteia com as flores alternadas: o que o tear já teceu). No ícone, o pano são
    // duas linhas: o peito e o rolo.
    bloco(xl + E, xr, peito, peito + 12, 0, H, { direita: false, icone: false });
    t(aresta([xl + E, peito, 0], [xr, peito, 0]), { w: 1, soIcone: true });
    const [rz, ry, rr] = [-14, 622, 10]; // o rolo do pano: centro em z e y, raio
    t(face([[ux0, peito, 0], [ux1, peito, 0], [ux1, ry - rr, rz], [ux0, ry - rr, rz]]), { w: 2, papel: true, icone: false });
    {
      const zr = rz / 2;
      const ramo = [];
      for (let i = 0; i <= 10; i++) {
        const x = ux0 + 12 + ((ux1 - ux0 - 24) * i) / 10;
        ramo.push(P(x, 592 + (i % 2 === 0 ? -4 : 4), zr));
      }
      t(curva(ramo), { w: 3, icone: false });
      for (let i = 1; i < 10; i += 2) {
        const x = ux0 + 12 + ((ux1 - ux0 - 24) * i) / 10;
        const cy = 592 + (i % 4 === 1 ? -5 : 5) * 1.6;
        const [fx, fy] = P(x, cy, zr);
        t(poli([[fx, fy - 4.5], [fx + 5, fy], [fx, fy + 4.5], [fx - 5, fy]], true), { w: 3, icone: false }); // a flor
        t(aresta([x, 592 + (i % 4 === 1 ? -4 : 4), zr], [x, cy + (i % 4 === 1 ? 4.5 : -4.5), zr]), { w: 3, icone: false }); // o pé
      }
    }
    // O rolo: um cilindro na frente dos montantes, com a ponta da direita à vista e a barriga de baixo na sombra.
    const aCima = -(Math.atan2(rr, B * rr) * 180) / Math.PI; // a geratriz mais alta (vista de cima) e a mais baixa
    const geratriz = (a) => [ry + rr * Math.sin(rad(a)), rz + rr * Math.cos(rad(a))];
    const [ga, gb] = [geratriz(aCima), geratriz(aCima + 180)];
    const [rx0, rx1] = [68, 308];
    t(face([[rx0, ga[0], ga[1]], [rx1, ga[0], ga[1]], [rx1, gb[0], gb[1]], [rx0, gb[0], gb[1]]]), { papel: true, icone: false });
    t(aresta([rx0, ry, rz], [rx1, ry, rz]), { w: 1, soIcone: true });
    hachura(face([[rx0 + 3, ry + 1, rz - rr + 1], [rx1 - 3, ry + 1, rz - rr + 1], [rx1 - 3, gb[0] - 0.5, gb[1]], [rx0 + 3, gb[0] - 0.5, gb[1]]]), { angulo: 60, passo: 3.6 });
    t(fechada(elipse3([rx1, ry, rz], [0, 0, rr], [0, rr, 0])), { papel: true, icone: false });
    ponto(P(rx1, ry, rz), 2);

    // ---------- a sombra no chão ----------
    chao(xl, xr + E + 9, 670);
    const [sx, sy] = [xr + E + 9, 669.5];
    const [fx, fy] = [A * (D - E), -B * (D - E)];
    hachura(poli([[sx, sy], [sx + fx, sy + fy], [sx + fx + 4, sy + fy + 4], [sx + 4, sy + 4]], true), { angulo: 38, passo: 3.6, margem: 0.2 });
  },
};
