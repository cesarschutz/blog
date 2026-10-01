/**
 * IA: o Turco, o autômato enxadrista de Wolfgang von Kempelen (1770). Um gabinete com um tabuleiro
 * em cima e uma figura vestida à turca que movia as peças; antes de cada partida Kempelen abria as
 * portas da frente para mostrar as engrenagens. A máquina que parecia pensar tinha gente dentro.
 *
 * Coleção de 13 (crítica, "07 IA, o fonógrafo: troca", com o ajuste de que o autômato aparece).
 * Vista de 3/4 pela frente-direita, na mesma projeção oblíqua da caixa registradora (a frente
 * plana, o fundo fugindo para cima e para a direita), luz do alto à esquerda. Atrás do gabinete, o
 * autômato: o busto com o turbante, a cabeça em 3/4 só com o nariz e o bigode, o robe com a gola em
 * V; o braço esquerdo dele (o da direita de quem olha) vem para a frente sobre o gabinete e descansa
 * com a mão na almofada, ao lado do tabuleiro, como no original. O gabinete é uma cômoda baixa e
 * larga com as duas portas da frente abertas, uma para cada lado, mostrando as engrenagens e os
 * eixos à vista (w2); embaixo, a gaveta comprida das peças. Em cima, o tabuleiro de 8 × 8 com as
 * casas escuras em hachura e seis peças. O fantasma é o braço do autômato no instante do trabalho:
 * o antebraço e a mão sobre o tabuleiro, levantando uma peça.
 *
 * Duas portas, não três: a terceira (a folha interna da porta dupla do compartimento largo) ficaria
 * de pé no meio da frente e, nesta projeção, taparia o compartimento ao lado; com duas asas a frente
 * fica vazada inteira, que é o que separa o Turco da mesa telefônica e da registradora na estante.
 *
 * No ícone ficam o gabinete, as duas portas com o almofadado, as bocas dos compartimentos, o
 * tabuleiro (o contorno e um quadriculado de 4 × 4 só dele), o braço e o busto com o turbante. As
 * engrenagens, as paredes de dentro, a gaveta, as casas, as peças, a almofada, as voltas do
 * turbante e o rosto ficam de fora.
 */

// O vetor de fundo: cada unidade de profundidade anda A para a direita e B para cima.
const A = 0.5;
const B = 0.36;
const P = (x, y, z = 0) => [x + A * z, y - B * z];
const rad = (g) => (g * Math.PI) / 180;

export default {
  instrumento: "o Turco, autômato enxadrista de Kempelen",
  titulo: "IA",
  cor: "#5d4128",
  desenho({ t, hachura, chao, ponto, cheio, linha, poli, curva, arco, elipse, circulo, retangulo, juntar }) {
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
    /**
     * O contorno de um tubo (a manga de um braço) a partir da linha do meio e da meia largura em cada
     * ponto: os dois lados deslocados pela normal, fechados numa curva suave.
     */
    const tubo = (meio, larguras) => {
      const n = meio.length;
      const esq = [];
      const dir = [];
      for (let i = 0; i < n; i++) {
        const a = meio[Math.max(0, i - 1)];
        const b = meio[Math.min(n - 1, i + 1)];
        const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
        const nx = -(b[1] - a[1]) / l;
        const ny = (b[0] - a[0]) / l;
        esq.push([meio[i][0] + nx * larguras[i], meio[i][1] + ny * larguras[i]]);
        dir.push([meio[i][0] - nx * larguras[i], meio[i][1] - ny * larguras[i]]);
      }
      return { esq, dir, fechada: curva([...esq, ...dir.reverse()], true) };
    };
    /** Uma engrenagem: a roda dentada (um zigue-zague fechado) com o cubo e o eixo. */
    const engrenagem = (c, r, dentes, { w = 2, icone = false } = {}) => {
      const pts = [];
      for (let i = 0; i < dentes * 2; i++) {
        const a = rad((360 * i) / (dentes * 2));
        const rr = i % 2 ? r - 2.2 : r;
        pts.push([c[0] + rr * Math.cos(a), c[1] + rr * Math.sin(a)]);
      }
      t(poli(pts, true), { w, papel: true, icone });
      t(circulo(c, r * 0.45), { w: 3 });
      cheio(circulo(c, 1.5), { icone: false });
    };

    // ---------- medidas ----------
    const [X0, L, D] = [118, 232, 125]; // o gabinete: a esquerda, a largura e a profundidade
    const X1 = X0 + L;
    const [YT, YB] = [566, 650]; // o tampo (na frente) e o chão: uma cômoda baixa
    const E = 8; // os montantes da frente
    const [O1a, O1b] = [X0 + E, X0 + E + 76]; // o compartimento estreito, do mecanismo
    const [O2a, O2b] = [O1b + E, X1 - E]; // o compartimento largo
    const [OY0, OY1] = [YT + 8, YB - 26]; // as bocas dos compartimentos
    const cx = X0 + 116; // o eixo do gabinete e do autômato, em 3D
    const hx = cx + A * (D + 10); // o eixo do autômato na tela (ele fica atrás do gabinete)

    // ---------- o autômato, atrás do gabinete (o tampo tapa o que fica abaixo da cintura) ----------
    // o tronco: os ombros caídos de um robe largo
    const tronco = curva([[hx - 54, 476], [hx - 36, 466], [hx - 14, 462], [hx + 14, 462], [hx + 36, 466], [hx + 54, 476], [hx + 60, 500], [hx + 62, 540], [hx - 62, 540], [hx - 60, 500]], true);
    t(tronco, { papel: true });
    // a manga direita dele (a esquerda de quem olha), caída ao lado do corpo
    t(curva([[hx - 50, 478], [hx - 62, 492], [hx - 68, 512], [hx - 66, 540], [hx - 52, 540], [hx - 50, 512], [hx - 44, 494]], true), { w: 2, papel: true });
    // a sombra do lado direito do tronco
    hachura(curva([[hx + 34, 467], [hx + 54, 476], [hx + 60, 500], [hx + 62, 540], [hx + 44, 540], [hx + 44, 500]], true), { angulo: 60, passo: 4 });
    // a gola em V do robe
    t(poli([[hx - 20, 465], [hx, 490], [hx + 20, 465]]), { w: 2, icone: false });
    t(poli([[hx - 13, 463], [hx, 482], [hx + 13, 463]]), { w: 3 });
    t(linha([hx, 490], [hx, 540]), { w: 3 }); // a abertura do robe
    // o pescoço
    t(retangulo(hx - 9, 452, 18, 20, 3), { papel: true });
    // a cabeça, em 3/4: só o nariz e o bigode
    const cabeca = elipse([hx, 440], 18, 22);
    t(cabeca, { papel: true });
    hachura(juntar([arco([hx, 440], 18, 22, -30, 80), arco([hx - 4, 438], 18, 22, 80, -30)]), { angulo: 60, passo: 3.8, margem: 1 });
    t(poli([[hx - 3, 436], [hx - 8, 447], [hx - 2, 448]]), { w: 2, icone: false }); // o nariz
    t(curva([[hx - 1, 451], [hx - 7, 449.5], [hx - 13, 452], [hx - 15, 458]]), { w: 2, icone: false }); // o bigode, caído
    t(curva([[hx - 1, 451], [hx + 5, 449.5], [hx + 11, 452], [hx + 13, 458]]), { w: 2, icone: false });
    // o turbante, numa silhueta só: largo no rolo que assenta na testa, afinando para a cúpula; a
    // borda de cima do rolo mergulha no meio (é uma volta horizontal vista um pouco de cima), com
    // as torcidas do pano entre as duas bordas, e as voltas em diagonal sobem pela cúpula
    const turbante = curva([[hx, 440], [hx + 21, 437], [hx + 30, 428], [hx + 30, 412], [hx + 22, 395], [hx, 387], [hx - 22, 395], [hx - 30, 412], [hx - 30, 428], [hx - 21, 437]], true);
    t(turbante, { papel: true });
    hachura(juntar([curva([[hx + 30, 428], [hx + 30, 412], [hx + 22, 395], [hx, 387]]), curva([[hx - 6, 389], [hx + 12, 396], [hx + 20, 412], [hx + 21, 428]])]), { angulo: 60, passo: 3.8, margem: 1 });
    t(curva([[hx - 30, 427], [hx - 14, 432], [hx, 433.5], [hx + 14, 432], [hx + 30, 427]]), { w: 2, icone: false }); // a borda de cima do rolo
    for (const dx of [-21, -11, -1, 9, 19]) t(linha([hx + dx + 2.5, 433 - Math.abs(dx) * 0.12], [hx + dx - 2.5, 439 - Math.abs(dx) * 0.2]), { w: 3 }); // as torcidas
    t(curva([[hx - 28, 419], [hx - 8, 422], [hx + 12, 414], [hx + 24, 400]]), { w: 2, icone: false }); // as voltas do pano na cúpula
    t(curva([[hx - 24, 405], [hx - 5, 408], [hx + 12, 400], [hx + 17, 391]]), { w: 2, icone: false });
    t(curva([[hx - 14, 394], [hx + 1, 395], [hx + 9, 390]]), { w: 3 });

    // ---------- o gabinete: o lado direito, o tampo e a frente ----------
    const lado = face([[X1, YT, 0], [X1, YB, 0], [X1, YB, D], [X1, YT, D]]);
    t(lado, { papel: true });
    hachura(lado, { angulo: 60, passo: 4.2 });
    t(face([[X0, YT, 0], [X1, YT, 0], [X1, YT, D], [X0, YT, D]]), { papel: true }); // o tampo
    t(face([[X0, YT, 0], [X1, YT, 0], [X1, YB, 0], [X0, YB, 0]]), { papel: true }); // a frente
    hachura(face([[X0 + 1, YT + 1, 0], [X1 - 1, YT + 1, 0], [X1 - 1, YT + 6, 0], [X0 + 1, YT + 6, 0]]), { angulo: 60, passo: 3 }); // a sombra do tampo na frente

    // os dois compartimentos abertos: a boca, a parede de dentro à esquerda (na sombra) e o piso
    const PROF = 18; // quanto se vê para dentro
    for (const [xa, xb] of [[O1a, O1b], [O2a, O2b]]) {
      const parede = face([[xa, OY0, 0], [xa, OY0, PROF], [xa, OY1, PROF], [xa, OY1, 0]]);
      t(parede, { w: 2, icone: false });
      hachura(parede, { angulo: 60, passo: 3.4, margem: 0.5 });
      t(face([[xa, OY1, 0], [xb, OY1, 0], [xb, OY1, PROF], [xa, OY1, PROF]]), { w: 2, icone: false }); // o piso
      t(face([[xa, OY0, 0], [xb, OY0, 0], [xb, OY1, 0], [xa, OY1, 0]])); // a boca
    }

    // o mecanismo: no compartimento estreito, as engrenagens apertadas; no largo, a roda grande e o tambor
    {
      const g1 = [O1a + 26, OY0 + 27];
      const g2 = [O1a + 57, OY0 + 9];
      const g3 = [O1a + 60, OY0 + 38];
      t(aresta([g2[0], OY0, 9], [g2[0], g2[1], 9]), { w: 2, icone: false }); // o eixo vertical que desce do tampo
      t(linha([g1[0], g1[1]], [O2a + 30, g1[1]]), { w: 2, icone: false }); // o eixo que atravessa a divisória
      engrenagem(g1, 17, 16);
      engrenagem(g2, 11, 12);
      engrenagem(g3, 8, 10);
      engrenagem([O1a + 14, OY0 + 5], 7, 9);
      // a roda grande com os raios
      const R = [O2a + 30, OY0 + 25];
      t(circulo(R, 22), { w: 2, papel: true, icone: false });
      t(circulo(R, 18), { w: 3 });
      for (let i = 0; i < 6; i++) t(linha([R[0] + 4 * Math.cos(rad(60 * i)), R[1] + 4 * Math.sin(rad(60 * i))], [R[0] + 18 * Math.cos(rad(60 * i)), R[1] + 18 * Math.sin(rad(60 * i))]), { w: 3 });
      cheio(circulo(R, 2), { icone: false });
      // o tambor deitado, com o eixo saindo para a parede da direita
      const [tx0, tx1, ty, tr] = [O2a + 62, O2a + 108, OY0 + 29, 12];
      const vert = (x, a0, a1) => elipse3([x, ty, 0], [0, tr, 0], [0, 0, tr], a0, a1);
      const em = (x, a) => P(x, ty + tr * Math.cos(rad(a)), tr * Math.sin(rad(a)));
      const AB = -(Math.atan(B) * 180) / Math.PI;
      t(juntar([vert(tx0, AB + 180, AB + 360), linha(em(tx0, AB), em(tx1, AB)), vert(tx1, AB + 360, AB + 540), linha(em(tx1, AB + 180), em(tx0, AB + 180))]), { w: 2, papel: true, icone: false });
      t(vert(tx1, AB + 180, AB + 360), { w: 2, icone: false });
      hachura(juntar([vert(tx0, 300, AB + 360), linha(em(tx0, AB), em(tx1, AB)), vert(tx1, AB + 360, 300), linha(em(tx1, 300), em(tx0, 300))]), { angulo: 60, passo: 3.6 });
      t(linha([tx1 + 3, ty], [O2b - 2, ty]), { w: 2, icone: false });
      t(linha([R[0] + 22, ty - 1], [tx0 - 2, ty - 1]), { w: 2, icone: false });
      cheio(circulo([tx1 + 3, ty], 1.6), { icone: false });
      // a alavanca de pé, perto da porta
      t(linha([O2b - 14, OY1 - 2], [O2b - 10, OY0 + 14]), { w: 2, icone: false });
      cheio(circulo([O2b - 10, OY0 + 14], 1.6), { icone: false });
    }

    // a gaveta comprida das peças, embaixo dos compartimentos, e o friso do rodapé
    t(retangulo(X0 + E, OY1 + 6, L - 2 * E, 14, 1.5), { w: 2, icone: false });
    for (const x of [X0 + 48, X1 - 48]) cheio(circulo([x, OY1 + 13], 1.8), { icone: false });
    t(linha([X0 + 3, YB - 4], [X1 - 3, YB - 4]), { w: 3 });

    // ---------- o tabuleiro, em cima ----------
    const [TX0, TX1, TZ0, TZ1] = [X0 + 41, X0 + 191, 14, 118];
    const casa = (c, l) => [TX0 + ((TX1 - TX0) * c) / 8, TZ0 + ((TZ1 - TZ0) * l) / 8];
    t(face([[TX0, YT, TZ0], [TX1, YT, TZ0], [TX1, YT, TZ1], [TX0, YT, TZ1]]), { papel: true });
    t(face([[TX0, YT, TZ0], [TX1, YT, TZ0], [TX1, YT + 3, TZ0], [TX0, YT + 3, TZ0]]), { w: 2, papel: true, icone: false }); // a espessura, na frente
    t(aresta([TX1, YT, TZ0], [TX1, YT, TZ1]), { w: 2 }); // a espessura, do lado
    for (let i = 1; i < 8; i++) {
      t(aresta([casa(i, 0)[0], YT, TZ0], [casa(i, 0)[0], YT, TZ1]), { w: 3 });
      t(aresta([TX0, YT, casa(0, i)[1]], [TX1, YT, casa(0, i)[1]]), { w: 3 });
    }
    for (let c = 0; c < 8; c++) {
      for (let l = 0; l < 8; l++) {
        if ((c + l) % 2 === 0) continue;
        const [xa, za] = casa(c, l);
        const [xb, zb] = casa(c + 1, l + 1);
        hachura(face([[xa, YT, za], [xb, YT, za], [xb, YT, zb], [xa, YT, zb]]), { angulo: 75, passo: 2.6, margem: 0.4 });
      }
    }
    // no ícone, o quadriculado é de 4 × 4, cheio: a 30px, 32 casas hachuradas viram um borrão
    for (let c = 0; c < 4; c++) {
      for (let l = 0; l < 4; l++) {
        if ((c + l) % 2 === 0) continue;
        const [xa, za] = casa(2 * c, 2 * l);
        const [xb, zb] = casa(2 * c + 2, 2 * l + 2);
        t(face([[xa, YT, za], [xb, YT, za], [xb, YT, zb], [xa, YT, zb]]), { w: 3, soIcone: true });
      }
    }

    // as peças: a base, o corpo e a cabeça de cada uma, numa silhueta só
    const peca = (c, l, tipo) => {
      const [xa, za] = casa(c + 0.5, l + 0.5);
      const [x, y] = P(xa, YT, za);
      const corpo = {
        peao: [[-5, 0], [-2.5, -4], [-2.5, -9], [-4.5, -10.5], [-3.5, -14.5], [0, -17], [3.5, -14.5], [4.5, -10.5], [2.5, -9], [2.5, -4], [5, 0]],
        torre: [[-5.5, 0], [-3, -4], [-3, -13], [-5, -13], [-5, -19], [-2.5, -19], [-2.5, -16.5], [-0.8, -16.5], [-0.8, -19], [0.8, -19], [0.8, -16.5], [2.5, -16.5], [2.5, -19], [5, -19], [5, -13], [3, -13], [3, -4], [5.5, 0]],
        bispo: [[-5.5, 0], [-2.5, -4], [-2.5, -11], [-4, -13], [-3, -19], [0, -23], [3, -19], [4, -13], [2.5, -11], [2.5, -4], [5.5, 0]],
        rainha: [[-6, 0], [-3, -4], [-3, -12], [-5.5, -15], [-5, -23], [-2.5, -20], [0, -24.5], [2.5, -20], [5, -23], [5.5, -15], [3, -12], [3, -4], [6, 0]],
        rei: [[-6, 0], [-3, -4], [-3, -12], [-5.5, -15], [-5, -21], [-1.2, -21], [-1.2, -24.5], [-3.5, -24.5], [-3.5, -26.5], [-1.2, -26.5], [-1.2, -29], [1.2, -29], [1.2, -26.5], [3.5, -26.5], [3.5, -24.5], [1.2, -24.5], [1.2, -21], [5, -21], [5.5, -15], [3, -12], [3, -4], [6, 0]],
        cavalo: [[-5.5, 0], [-3, -4], [-3, -9], [-6, -12], [-5, -17], [-1, -22], [3, -22], [5.5, -18], [5, -14], [1.5, -14], [4, -9], [3, -4], [5.5, 0]],
      }[tipo];
      const base = juntar([arco([x, y], 6.6, 2.3, 0, 180), linha([x - 6.6, y], [x + 6.6, y])]);
      t(base, { w: 2, papel: true, icone: false });
      t(poli(corpo.map(([dx, dy]) => [x + dx * 1.15, y + dy * 1.15]), true), { w: 2, papel: true, icone: false });
    };
    peca(0, 7, "torre");
    peca(2, 6, "peao");
    peca(4, 7, "rei");
    peca(6, 5, "peao");
    peca(1, 2, "bispo");
    peca(5, 1, "rainha");
    peca(3, 4, "cavalo"); // a peça que o fantasma vai levantar

    // ---------- o braço esquerdo do autômato, em repouso: a mão na almofada ao lado do tabuleiro ----------
    const ombro = [hx + 46, 480];
    const cotovelo = P(X0 + 206, YT, 92); // apoiado no tampo, à direita do tabuleiro, atrás
    const almofada = P(X0 + 210, YT, 18);
    // a almofada
    t(face([[X0 + 196, YT, 8], [X0 + 228, YT, 8], [X0 + 228, YT, 30], [X0 + 196, YT, 30]]), { w: 2, papel: true, icone: false });
    t(aresta([X0 + 196, YT + 4, 8], [X0 + 228, YT + 4, 8]), { w: 2, icone: false });
    t(aresta([X0 + 196, YT, 8], [X0 + 196, YT + 4, 8]), { w: 2, icone: false });
    t(aresta([X0 + 228, YT, 8], [X0 + 228, YT + 4, 8]), { w: 2, icone: false });
    // a manga de cima, do ombro ao cotovelo
    const braco = tubo([ombro, [ombro[0] + 12, ombro[1] + 22], cotovelo], [12, 11, 9]);
    t(braco.fechada, { papel: true });
    // o antebraço, do cotovelo até o punho, e a mão pousada na almofada
    const punho = [almofada[0] + 4, almofada[1] - 9];
    const ante = tubo([cotovelo, [(cotovelo[0] + punho[0]) / 2 + 3, (cotovelo[1] + punho[1]) / 2 - 2], punho], [11, 10, 8]);
    t(ante.fechada, { papel: true });
    const mao = [punho[0] - 4, punho[1] + 2];
    t(curva([[mao[0] - 4, mao[1] - 8], [mao[0] + 6, mao[1] - 9], [mao[0] + 10, mao[1] - 2], [mao[0] + 4, mao[1] + 5], [mao[0] - 8, mao[1] + 4], [mao[0] - 12, mao[1] - 2]], true), { w: 2, papel: true });
    t(linha([mao[0] - 6, mao[1] + 1], [mao[0] + 3, mao[1] + 2]), { w: 3 }); // os dedos
    t(linha([mao[0] - 5, mao[1] - 2], [mao[0] + 5, mao[1] - 1]), { w: 3 });
    hachura(curva([braco.dir[0], braco.dir[1], braco.dir[2], [braco.dir[2][0] - 5, braco.dir[2][1] - 3], [braco.dir[1][0] - 5, braco.dir[1][1] - 2], [braco.dir[0][0] - 5, braco.dir[0][1]]], true), { angulo: 60, passo: 3.6, margem: 0.6 });

    // ---------- a sombra no chão (antes das portas, que ficam na frente dela) ----------
    chao(X0 - 2, X1 + 2, YB + 2);
    hachura(poli([[X1 + 2, YB + 1.5], [X1 + A * D, YB - B * D + 1], [X1 + A * D + 4, YB - B * D + 5], [X1 + 6, YB + 5.5]], true), { angulo: 38, passo: 3.6, margem: 0.2 });

    // ---------- as duas portas da frente, abertas para os lados ----------
    const porta = (hx0, w, teta, lado) => {
      // a dobradiça em x = hx0; a porta gira teta graus para quem olha; lado = 1 abre para a direita, -1 para a esquerda
      const livre = [hx0 - lado * w * Math.cos(rad(teta)), -w * Math.sin(rad(teta))];
      const [ya, yb] = [OY0 - 4, OY1 + 4];
      const painel = face([[hx0, ya, 0], [livre[0], ya, livre[1]], [livre[0], yb, livre[1]], [hx0, yb, 0]]);
      t(painel, { papel: true });
      // o almofadado da porta
      const u = [(livre[0] - hx0) * 0.14, livre[1] * 0.14];
      t(face([[hx0 + u[0], ya + 7, u[1]], [livre[0] - u[0], ya + 7, livre[1] - u[1]], [livre[0] - u[0], yb - 7, livre[1] - u[1]], [hx0 + u[0], yb - 7, u[1]]]), { w: 3, icone: true });
      return painel;
    };
    // Abertas além de 90°, é a face de dentro das portas que se vê: a da esquerda aponta para a direita (na sombra).
    const pe = porta(O1a - 2, 76, 112, -1); // a do compartimento estreito, aberta para a esquerda
    hachura(pe, { angulo: 60, passo: 4.6, margem: 1 });
    porta(O2b + 2, 132, 142, 1); // a do compartimento largo, aberta para a direita, encostando no lado

    // ---------- o fantasma: o antebraço e a mão sobre o tabuleiro, levantando o cavalo ----------
    {
      const [xa, za] = casa(3.5, 4.5);
      const [px, py] = P(xa, YT, za); // onde a peça estava
      const alvo = [px + 1, py - 5]; // a peça, levantada da casa
      const m = [alvo[0] + 1, alvo[1] - 24]; // o centro da mão, fechada na cabeça da peça
      const g = tubo([cotovelo, [(cotovelo[0] + m[0]) / 2 + 4, (cotovelo[1] + m[1]) / 2 - 6], [m[0] + 12, m[1] - 2]], [11, 10, 8]);
      const corpo = [[-5.5, 0], [-3, -4], [-3, -9], [-6, -12], [-5, -17], [-1, -22], [3, -22], [5.5, -18], [5, -14], [1.5, -14], [4, -9], [3, -4], [5.5, 0]].map(([dx, dy]) => [alvo[0] + dx * 1.15, alvo[1] + dy * 1.15]);
      t(
        juntar(
          [
            curva(g.esq), // o alto do antebraço, do cotovelo ao punho
            curva([g.esq.at(-1), [m[0] + 10, m[1] - 10], [m[0], m[1] - 11], [m[0] - 9, m[1] - 6], [m[0] - 10, m[1] + 3], [m[0] - 5, m[1] + 7]]), // a mão, por cima e pelo lado de fora
            poli([[m[0] - 5, m[1] + 7], ...corpo.slice(0, 2), corpo[0], corpo.at(-1), corpo.at(-2), [m[0] + 8, m[1] + 6]]), // a peça embaixo da mão: a base e os dois lados
            curva([[m[0] + 8, m[1] + 6], [m[0] + 12, m[1] + 2], g.dir.at(-1)]), // a volta ao antebraço
            curva([...g.dir].reverse()), // o lado de baixo do antebraço, até o cotovelo
          ],
          true,
        ),
        { fantasma: true },
      );
    }
  },
};
