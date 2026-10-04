/**
 * Fundamentos: o telégrafo de Morse (1844), a chave e o registrador. Em 24 de maio de 1844 a linha
 * Washington–Baltimore levou "What hath God wrought"; o registrador gravava pontos e traços em relevo
 * numa fita de papel, para um operador ler depois. É o computador com tudo à vista: o bit (o circuito
 * aberto ou fechado na chave), o código (ponto e traço), o protocolo (o tempo de cada um), a memória
 * (a fita).
 *
 * Vista de 3/4 pela frente-direita, na mesma projeção oblíqua da caixa registradora (a frente plana,
 * o fundo fugindo para cima e para a direita), luz do alto à esquerda. Uma tábua de madeira baixa e
 * larga (a caixa do desenho tem 1,0 × 0,75 da área). À esquerda, na frente, o manipulador: a placa de
 * latão, os dois montantes do pivô com os munhões (pontos cheios), a alavanca correndo para o fundo
 * (o operador fica na frente) com o botão redondo grande na ponta, o contato embaixo da frente (o
 * vão), a mola embaixo da parte de trás e dois bornes no fundo. À direita e atrás, o registrador: o
 * bastidor de latão em caixa com dois tambores na frente (o carretel com a fita enrolada, no alto à
 * esquerda, e o tambor do mecanismo de relojoaria, embaixo à direita, com a janela das engrenagens
 * entre eles); em cima, no fundo, as duas bobinas do eletroímã (dois cilindros em pé, lado a lado) e,
 * da frente ao fundo, o braço da armadura no pivô, com a ponta de aço descendo sobre a fita, que
 * passa pelo rolete na beira da frente. A fita sai do carretel, passa sob a ponta, corre pelo alto do
 * bastidor e cai pela ponta direita, pela beira da tábua, até o chão, com os pontos e traços da
 * mensagem (WHAT HATH, o começo da frase de 1844). O fantasma é a continuação da fita, no chão,
 * enrolando-se: a mensagem que ainda está chegando.
 *
 * Mudanças em relação à ficha: a fita sai pela beira direita da tábua, não pela da frente (a tábua
 * ocupa a base da área, e uma fita caindo pela frente sairia dela; pela direita ela cai inteira à
 * vista e o fantasma tem chão para se enrolar); as bobinas ficam em pé no fundo e o braço corre da
 * frente ao fundo, como no registrador real, porque deitadas sob um braço ao longo da frente elas
 * cruzavam a fita na imagem; os pontos e traços ficam na fita sólida (num traço tracejado eles não
 * se desenham); e o ícone leva os dois tambores, que são o que tira da chave o ar de grampeador.
 *
 * No ícone ficam a tábua, o manipulador (placa, montantes, alavanca e botão), o bastidor com os dois
 * tambores, as bobinas, o braço e o começo da fita (o trecho que corre pelo alto e dobra na ponta);
 * saem os bornes, a mola, o contato, a janela, os anéis da fita enrolada, as marcas e a fita pendurada.
 */

// O vetor de fundo: cada unidade de profundidade anda A para a direita e B para cima.
const A = 0.5;
const B = 0.36;
const P = (x, y, z = 0) => [x + A * z, y - B * z];
const rad = (g) => (g * Math.PI) / 180;
const graus = (r) => (r * 180) / Math.PI;
// Num círculo horizontal (0° à direita, 90° ao fundo), as tangentes de um cilindro em pé.
const AT = graus(Math.atan(A));
const AE = AT + 180;
// Num círculo de pé no plano y–z (0° embaixo, 90° ao fundo), as tangentes de um cilindro deitado ao longo de x.
const ABX = -graus(Math.atan(B));
const ACX = ABX + 180;
// Num círculo de frente (plano x–y), as tangentes de um tambor com o eixo em z: embaixo à direita e em cima à esquerda.
const AZ1 = graus(Math.atan2(-B, A)) + 90;
const AZ2 = AZ1 + 180;

export default {
  instrumento: "telégrafo de Morse: a chave e o registrador",
  titulo: "Fundamentos",
  cor: "#26626a",
  desenho({ t, hachura, chao, ponto, cheio, linha, poli, bezier, arco, circulo, juntar }) {
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
     * Uma caixa vista de frente-direita e de cima: o lado direito (na sombra), o tampo e a frente,
     * nessa ordem, cada face tapando o que ficou atrás.
     */
    const caixa = (x0, x1, y0, y1, z0, z1, { icone, sombra = true, passo = 4.2, w = 1 } = {}) => {
      const lado = face([[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]]);
      t(lado, { w, papel: true, icone });
      if (sombra) hachura(lado, { angulo: 60, passo });
      t(face([[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]]), { w, papel: true, icone });
      t(face([[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]]), { w, papel: true, icone });
    };
    /** Um cilindro em pé (eixo em x = cx, z = cz), do topo yT à base yB: a silhueta, o aro de cima e a sombra à direita. */
    const cilindro = (cx, cz, yT, yB, r, { w = 1, icone, sombra = true, passo = 3.6 } = {}) => {
      const horiz = (y, a0, a1) => elipse3([cx, y, cz], [r, 0, 0], [0, 0, r], a0, a1);
      const em = (y, a) => P(cx + r * Math.cos(rad(a)), y, cz + r * Math.sin(rad(a)));
      t(juntar([horiz(yT, AT, AE), linha(em(yT, AE), em(yB, AE)), horiz(yB, AE, AT + 360), linha(em(yB, AT), em(yT, AT))]), { w, papel: true, icone });
      t(horiz(yT, AE, AT + 360), { w, icone });
      if (sombra) hachura(juntar([horiz(yT, 300, AT + 360), linha(em(yT, AT), em(yB, AT)), horiz(yB, AT + 360, 300), linha(em(yB, 300), em(yT, 300))]), { angulo: 60, passo });
      return { horiz, em };
    };
    /** Um cilindro deitado ao longo de x (eixo em y = cy, z = cz), de x0 a x1: a ponta da direita fica à vista. */
    const tubo = (x0, x1, cy, cz, r, { w = 1, icone, sombra = true, passo = 3.6 } = {}) => {
      const vert = (x, a0, a1) => elipse3([x, cy, cz], [0, r, 0], [0, 0, r], a0, a1);
      const em = (x, a) => P(x, cy + r * Math.cos(rad(a)), cz + r * Math.sin(rad(a)));
      t(juntar([vert(x0, ACX, ABX + 360), linha(em(x0, ABX), em(x1, ABX)), vert(x1, ABX + 360, ACX + 360), linha(em(x1, ACX), em(x0, ACX))]), { w, papel: true, icone });
      t(vert(x1, ACX, ABX + 360), { w, icone });
      if (sombra) hachura(juntar([vert(x0, 292, ABX + 360), linha(em(x0, ABX), em(x1, ABX)), vert(x1, ABX + 360, 292), linha(em(x1, 292), em(x0, 292))]), { angulo: 60, passo });
      return { vert, em };
    };
    /** Um tambor com o eixo em z (visto de frente), da face da frente z0 à de trás z1: a silhueta, a face e a sombra na faixa do lado. */
    const tambor = (c, r, z0, z1, { w = 1, icone, sombra = true, passo = 3.4 } = {}) => {
      const em = (z, a) => P(c[0] + r * Math.cos(rad(a)), c[1] + r * Math.sin(rad(a)), z);
      const arcoEm = (z, a0, a1) => arco(P(c[0], c[1], z), r, r, a0, a1);
      t(juntar([arcoEm(z0, AZ1, AZ2), linha(em(z0, AZ2), em(z1, AZ2)), arcoEm(z1, AZ2, AZ1 + 360), linha(em(z1, AZ1), em(z0, AZ1))]), { w, papel: true, icone });
      t(circulo(P(c[0], c[1], z0), r), { w, papel: true, icone });
      if (sombra) hachura(juntar([arcoEm(z0, -20, AZ1), linha(em(z0, AZ1), em(z1, AZ1)), arcoEm(z1, AZ1, -20), linha(em(z1, -20), em(z0, -20))]), { angulo: 60, passo });
    };

    // ---------- medidas ----------
    const [TX0, TX1, TY, TE, TD] = [40, 330, 646, 22, 110]; // a tábua: de x, até x, o tampo, a espessura, a profundidade
    const chaoY = TY + TE; // 668

    // ---------- a tábua ----------
    caixa(TX0, TX1, TY, chaoY, 0, TD);
    t(linha([TX0 + 5, chaoY - 5], [TX1 - 5, chaoY - 5]), { w: 3 }); // o friso

    // ---------- o manipulador (a chave), na frente à esquerda ----------
    const [KX0, KX1, KZ0, KZ1] = [46, 188, 14, 66]; // a placa de latão
    const KY = TY - 3; // o alto da placa
    caixa(KX0, KX1, KY, TY, KZ0, KZ1, { sombra: false });
    const [LX0, LX1, LZ, LW, LE] = [60, 180, 36, 8, 5]; // a alavanca: da ponta do botão ao fundo, o eixo em z, a largura e a espessura
    const topo = (x) => 617 + (7 * (x - LX0)) / (LX1 - LX0); // em repouso a ponta do botão fica mais alta
    // a sombra da alavanca na placa, na frente dela
    hachura(face([[LX0 + 24, KY, LZ - 13], [LX1 - 2, KY, LZ - 13], [LX1 - 2, KY, LZ - 5], [LX0 + 24, KY, LZ - 5]]), { angulo: 60, passo: 3 });
    // os bornes, no fundo da placa
    for (const x of [KX0 + 16, KX1 - 16]) cilindro(x, KZ1 - 8, TY - 12, KY, 3.5, { w: 2, icone: false, sombra: false });
    // a mola, embaixo da parte de trás da alavanca
    {
      const x = 162;
      const [y0, y1] = [KY, topo(x) + LE];
      const pts = [];
      for (let i = 0; i <= 10; i++) pts.push(P(x + (i % 2 ? 3 : -3) * (i && i < 10 ? 1 : 0), y0 + ((y1 - y0) * i) / 10, LZ));
      t(poli(pts), { w: 3, icone: false });
    }
    // o contato, embaixo da frente: o vão entre ele e a alavanca é o circuito aberto
    cilindro(102, LZ, KY - 10, KY, 3, { w: 2, icone: false, sombra: false });
    // os montantes do pivô, com os munhões: o de trás, a alavanca, o da frente
    const PX = 128;
    caixa(PX, PX + 6, 620, KY, LZ + 6, LZ + 10, { w: 2, sombra: false });
    // a alavanca: o lado da frente (de pé, a espessura), o alto, a ponta do fundo
    t(face([[LX0, topo(LX0), LZ - LW / 2], [LX1, topo(LX1), LZ - LW / 2], [LX1, topo(LX1), LZ + LW / 2], [LX0, topo(LX0), LZ + LW / 2]]), { papel: true });
    t(face([[LX1, topo(LX1), LZ - LW / 2], [LX1, topo(LX1) + LE, LZ - LW / 2], [LX1, topo(LX1) + LE, LZ + LW / 2], [LX1, topo(LX1), LZ + LW / 2]]), { w: 2, papel: true });
    t(face([[LX0, topo(LX0), LZ - LW / 2], [LX1, topo(LX1), LZ - LW / 2], [LX1, topo(LX1) + LE, LZ - LW / 2], [LX0, topo(LX0) + LE, LZ - LW / 2]]), { papel: true });
    caixa(PX, PX + 6, 620, KY, LZ - 10, LZ - 6, { w: 2, sombra: false });
    ponto(P(PX + 3, 625, LZ - 10), 2.1);
    // o botão: a haste e o disco grande
    const BX = 76;
    cilindro(BX, LZ, topo(BX) - 6, topo(BX), 4.5, { w: 2, sombra: false });
    const RB = 20;
    const botao = cilindro(BX, LZ, topo(BX) - 13, topo(BX) - 6, RB, { passo: 3.2 });
    t(botao.horiz(topo(BX) - 13, 0, 360), { w: 3, icone: false }); // o aro de cima inteiro, fino, por cima da silhueta
    t(elipse3([BX, topo(BX) - 13, LZ], [RB * 0.6, 0, 0], [0, 0, RB * 0.6]), { w: 3, icone: false }); // a cúpula

    // ---------- o registrador: o bastidor em caixa, atrás à direita ----------
    const [RX0, RX1, RY, RZ0, RZ1] = [194, 300, 512, 58, 104];
    caixa(RX0, RX1, RY, TY, RZ0, RZ1);
    t(aresta([RX0 + 4, TY - 6, RZ0], [RX1 - 4, TY - 6, RZ0]), { w: 3 }); // a base do bastidor
    // a janela das engrenagens, embaixo à esquerda
    t(face([[RX0 + 8, 578, RZ0], [RX0 + 52, 578, RZ0], [RX0 + 52, 632, RZ0], [RX0 + 8, 632, RZ0]]), { w: 2, icone: false });
    for (const [cx, cy, r, n] of [[RX0 + 22, 596, 10, 14], [RX0 + 37, 617, 7, 10]]) {
      const c = P(cx, cy, RZ0);
      t(circulo(c, r), { w: 3 });
      for (let i = 0; i < n; i++) {
        const a = rad((360 * i) / n);
        t(linha([c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)], [c[0] + (r + 2.6) * Math.cos(a), c[1] + (r + 2.6) * Math.sin(a)]), { w: 3 });
      }
      cheio(circulo(c, 1.6), { icone: false });
    }
    // o carretel com a fita enrolada, no alto à esquerda, saindo acima do bastidor
    const carretel = { c: [221, 536], r: 31, z0: 44 };
    tambor(carretel.c, carretel.r, carretel.z0, RZ0);
    for (const r of [25, 19, 13]) t(circulo(P(...carretel.c, carretel.z0), r), { w: 3 });
    ponto(P(...carretel.c, carretel.z0), 2.4);
    // o tambor do mecanismo, embaixo à direita
    const tamb = { c: [274, 602], r: 22, z0: 46 };
    tambor(tamb.c, tamb.r, tamb.z0, RZ0);
    t(circulo(P(...tamb.c, tamb.z0), 16), { w: 2, icone: false });
    ponto(P(...tamb.c, tamb.z0), 2.4);

    // ---------- em cima do bastidor: as bobinas no fundo, o pivô, o braço da frente ao fundo, o rolete ----------
    const [AX, AY, AF, AT2, AW, AE2] = [258, 486, 50, 102, 8, 5]; // o braço (a armadura): o eixo em x, o alto, da frente ao fundo, a largura, a espessura
    const [CZ, CR, CT] = [90, 8, RY - 16]; // as bobinas do eletroímã, em pé, lado a lado no fundo, sob a armadura: o eixo em z, o raio, o alto
    for (const x of [AX - 13, AX + 13]) cilindro(x, CZ, CT, RY, CR, { w: 2, passo: 3.2 });
    cilindro(AX, 74, AY + AE2, RY, 3.5, { w: 2, icone: false, sombra: false }); // a coluna do pivô
    const [FZ0, FZ1] = [RZ0 - 6, RZ0 + 6]; // a fita corre na beira da frente do bastidor
    tambor([AX, 504], 6.5, FZ0, FZ1, { w: 2, icone: false, sombra: false }); // o rolete, sob a ponta
    // o braço: o lado direito, o alto, a ponta da frente
    t(face([[AX + AW / 2, AY, AF], [AX + AW / 2, AY + AE2, AF], [AX + AW / 2, AY + AE2, AT2], [AX + AW / 2, AY, AT2]]), { w: 2, papel: true });
    t(face([[AX - AW / 2, AY, AF], [AX + AW / 2, AY, AF], [AX + AW / 2, AY, AT2], [AX - AW / 2, AY, AT2]]), { papel: true });
    t(face([[AX - AW / 2, AY, AF], [AX + AW / 2, AY, AF], [AX + AW / 2, AY + AE2, AF], [AX - AW / 2, AY + AE2, AF]]), { papel: true });
    ponto(P(AX + AW / 2, AY + AE2 / 2, 74), 2); // o pivô
    t(aresta([AX, AY + AE2, AF + 5], [AX, 496, AF + 5]), { w: 2, icone: false }); // a ponta de aço, sobre a fita

    // ---------- a fita: do carretel, sob a ponta, pelo alto do bastidor, e caindo pela ponta direita ----------
    const FY = 497.5; // a altura da fita no alto
    const dobra = { x: RX1 }; // onde ela dobra para cair
    const fitaAlto = face([
      [carretel.c[0], carretel.c[1] - carretel.r, carretel.z0 + 1],
      [AX, FY, FZ0],
      [dobra.x, FY, FZ0],
      [dobra.x, FY, FZ1],
      [AX, FY, FZ1],
      [carretel.c[0], carretel.c[1] - carretel.r, RZ0 - 1],
    ]);
    t(fitaAlto, { w: 2, papel: true, icone: true });
    // a queda: a fita vira de frente para o leitor ao cair, 12 de largura, até o chão
    const [qe, qd] = [P(dobra.x, FY, FZ0), P(dobra.x, FY, FZ1)];
    const xq = 365; // o eixo da fita pendurada
    const yChaoQ = chaoY - B * RZ0; // o chão sob ela, na profundidade da fita
    const esq = bezier(qe, [qe[0] + 20, qe[1] + 1], [xq - 6, 530], [xq - 6, 622]);
    const dir = bezier(qd, [qd[0] + 28, qd[1] + 2], [xq + 6, 530], [xq + 6, 622]);
    t(
      juntar([esq, linha([xq - 6, 622], [xq - 6, yChaoQ]), linha([xq - 6, yChaoQ], [xq + 6, yChaoQ]), linha([xq + 6, yChaoQ], [xq + 6, 622]), { pts: [...dir.pts].reverse(), fechada: false }]),
      { w: 2, papel: true, icone: false },
    );
    // o começo da queda vai para o ícone (o trecho que sai do bastidor e dobra)
    t({ pts: esq.pts.slice(0, Math.round(esq.pts.length * 0.22)), fechada: false }, { w: 2, soIcone: true });
    t({ pts: dir.pts.slice(0, Math.round(dir.pts.length * 0.22)), fechada: false }, { w: 2, soIcone: true });
    // as marcas em relevo: WHAT HATH, o começo da mensagem de 1844 (ponto = 1, traço = 3; a pausa entre letras, 3; entre palavras, 7)
    {
      const meio = [...bezier([(qe[0] + qd[0]) / 2, (qe[1] + qd[1]) / 2], [qe[0] + 24, qe[1] + 1.5], [xq, 530], [xq, 622]).pts, [xq, yChaoQ]];
      const comp = [0];
      for (let i = 1; i < meio.length; i++) comp.push(comp[i - 1] + Math.hypot(meio[i][0] - meio[i - 1][0], meio[i][1] - meio[i - 1][1]));
      const em = (s) => {
        let i = comp.findIndex((c) => c >= s);
        if (i < 1) i = meio.length - 1;
        const f = (s - comp[i - 1]) / (comp[i] - comp[i - 1] || 1);
        const p = [meio[i - 1][0] + (meio[i][0] - meio[i - 1][0]) * f, meio[i - 1][1] + (meio[i][1] - meio[i - 1][1]) * f];
        const l = Math.hypot(meio[i][0] - meio[i - 1][0], meio[i][1] - meio[i - 1][1]) || 1;
        return { p, u: [(meio[i][0] - meio[i - 1][0]) / l, (meio[i][1] - meio[i - 1][1]) / l] };
      };
      const letras = [".--", "....", ".-", "-", " ", "....", ".-", "-", "...."];
      const U = 2.6;
      let s = 26;
      const fim = comp.at(-1) - 8;
      for (const letra of letras) {
        if (letra === " ") {
          s += 4 * U;
          continue;
        }
        for (const m of letra) {
          const l = m === "." ? U * 0.9 : 3 * U;
          if (s + l > fim) break;
          const a = em(s);
          const b = em(s + l);
          if (m === ".") cheio(circulo([(a.p[0] + b.p[0]) / 2, (a.p[1] + b.p[1]) / 2], 1.5), { icone: false });
          else t(linha(a.p, b.p), { w: 1, icone: false });
          s += l + U;
        }
        s += 2 * U;
      }
    }

    // ---------- o fantasma: a fita continua pelo chão e se enrola, a mensagem que ainda chega ----------
    {
      const [y0, y1] = [yChaoQ - 3.2, yChaoQ + 2.4]; // a fita deitada no chão, de lado: a largura foge para o fundo
      const x0 = xq + 6;
      const xf = 426;
      const cc = [xf, y0 - 12]; // o enrolar da ponta
      t(
        juntar(
          [
            linha([x0, y1], [xf - 5, y1]),
            arco(cc, 14.4, 14.4, 90, -175),
            arco(cc, 8, 8, 185, 70),
            linha([xf + 2.7, y0 - 4.5], [xf - 10, y0 - 1]),
            linha([xf - 10, y0 - 1], [x0 + 5, y0 - 1]),
          ],
          false,
        ),
        { fantasma: true },
      );
    }

    // ---------- a sombra no chão ----------
    chao(TX0 + 4, TX1 + 2, chaoY + 2);
    hachura(poli([[TX1 + 3, chaoY + 1.5], [TX1 + 22, chaoY - 12.2], [TX1 + 26, chaoY - 8.2], [TX1 + 7, chaoY + 5.5]], true), { angulo: 38, passo: 3.6, margem: 0.2 });
  },
};
