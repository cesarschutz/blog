/*
 * A troca de página por folhas (D51, protótipo 03: "cai da mesa", texto fora), embutida no <head> de
 * toda página (Base.astro), antes da primeira pintura. Sem biblioteca: View Transitions entre
 * documentos, animadas pela Web Animations API.
 *
 * - Na página que sai (`pageswap`): cada folha à vista (as `.folha` de fora, ou `[data-unidade]`) e cada
 *   texto solto entre elas ganha um nome de transição (`sai-N`, classe `sai`), e o que a página nova
 *   precisa saber vai para a sessão (`cs-troca`). O clique navega na hora, sem esperar.
 * - Na página que chega (`pagereveal`): as folhas antigas caem da mesa (cada uma escorrega para baixo
 *   com um giro pequeno, pelo peso, de baixo para cima) e os textos antigos sobem um pouco e somem. As
 *   folhas novas, que são a página de verdade, chegam do fundo, em perspectiva e um pouco tortas, e
 *   pousam no lugar, de cima para baixo (o fim do A2); os textos novos sobem por uma máscara, uma linha
 *   curta. Voltando pelo histórico, as novas vêm da frente. Só o que está à vista anima.
 * - Os livros com o mesmo nome nas duas páginas voam de um lugar ao outro, fora das folhas (só o livro
 *   viaja, protótipo 07); a folha deles só esmaece. Livro sem par cai com a folha dele.
 * - Artigo anterior e próximo (protótipo 06, "na pilha"): o próximo é pousado por cima do atual, vindo
 *   da direita; o anterior aparece quando o de cima é tirado para a direita. O livro da lateral fica
 *   parado se for o mesmo.
 * - `data-chegada-passo` no <main> muda o intervalo entre as folhas (a tag: desfile direto, 60 ms);
 *   `data-chegada="propria"` deixa a chegada para o script da página (Categorias: desfile e pilha).
 * - Fica de fora: movimento reduzido, navegador sem View Transitions entre documentos, a troca de livro
 *   pela pilha (`data-troca-propria`, PainelHome) e a navegação com um diálogo aberto (busca, livro
 *   ampliado): elas usam a troca de página de antes (base.css).
 *
 * Outros scripts usam `window.csTroca` (unidades, chegar) e os eventos `cs:pousou` (a folha do desenho
 * do artigo pousou) e `cs:chegou` (a chegada acabou). `data-vai-chegar` no <html>, posto já no <head>,
 * avisa os módulos que a página vai chegar por uma troca, antes do `pagereveal`.
 */
(function () {
  var raiz = document.documentElement;
  var CHAVE = "cs-troca";
  var P = 1400;
  var QUART_OUT = "cubic-bezier(0.25, 1, 0.5, 1)";
  var CUBIC_IN = "cubic-bezier(0.32, 0, 0.67, 0)";
  var QUAD_IN = "cubic-bezier(0.55, 0.085, 0.68, 0.53)";
  var reduzido = matchMedia("(prefers-reduced-motion: reduce)");
  var celular = function () { return innerWidth <= 640; };
  var rnd = function (a, b) { return a + Math.random() * (b - a); };
  var FOLHA = ".folha, [data-unidade]";

  /** O fim do cabeçalho fixo: o que está embaixo dele não está à vista. */
  function topoVisivel() {
    var t = document.querySelector(".topo-fixo");
    return t ? t.getBoundingClientRect().bottom : 0;
  }

  /**
   * As unidades à vista do <main>, na ordem da página: as folhas de fora (nunca uma folha dentro de
   * outra) e, entre elas, cada trecho sem folha nenhuma (um título, uma frase, o seletor), que é texto.
   */
  function unidades() {
    var m = document.getElementById("conteudo");
    if (!m) return [];
    var lista = [];
    // No desfile (a página de uma tag), a folha da lista chega primeiro e cada artigo dela, sozinho.
    var desfile = !!m.dataset.chegadaPasso;
    (function andar(el) {
      for (var c = el.firstElementChild; c; c = c.nextElementSibling) {
        if (/^(SCRIPT|STYLE|TEMPLATE|DIALOG|LINK|META)$/.test(c.tagName) || c.hidden || c.hasAttribute("data-fora-da-troca")) continue;
        if (desfile && c.matches(".lista-artigos")) {
          lista.push({ el: c, texto: false, soEsmaece: true });
          for (var li = c.firstElementChild; li; li = li.nextElementSibling) lista.push({ el: li, texto: false });
        } else if (c.matches(FOLHA)) lista.push({ el: c, texto: false });
        else if (c.querySelector(FOLHA)) andar(c);
        else lista.push({ el: c, texto: true });
      }
    })(m);
    var topo = topoVisivel(), H = innerHeight;
    return lista.filter(function (u) {
      var r = u.el.getBoundingClientRect();
      if (!(r.width > 0 && r.height > 0 && r.bottom > topo + 2 && r.top < H - 2)) return false;
      var s = getComputedStyle(u.el);
      if (s.visibility === "hidden" || s.position === "fixed" || Number(s.opacity) === 0) return false;
      u.r = r;
      // O meio da parte à vista: é em volta dele que a folha gira (as altas, como o artigo, também).
      u.oy = Math.round((Math.max(0, -r.top) + Math.min(r.height, H - r.top)) / 2);
      return true;
    }).sort(function (a, b) {
      // Pela tela, não pelo DOM: de cima para baixo e, na mesma linha, da esquerda para a direita.
      return Math.round(a.r.top / 48) - Math.round(b.r.top / 48) || a.r.left - b.r.left;
    });
  }

  /** Os livros com nome de transição no <main> (o do topo, fixo; o que leva à página nova, data-vt). */
  function livrosNomeados(soAVista) {
    var fora = [];
    var els = document.querySelectorAll("#conteudo .livro-em-pe, #conteudo [data-vt]");
    var topo = topoVisivel(), H = innerHeight;
    for (var i = 0; i < els.length; i++) {
      var n = els[i].style.viewTransitionName || getComputedStyle(els[i]).viewTransitionName;
      if (!n || n === "none") continue;
      // Livro fora da tela não voa (no celular, o da lateral subia de baixo da tela por cima do artigo).
      var r = els[i].getBoundingClientRect();
      if (soAVista && !(r.bottom > topo && r.top < H)) nomear(els[i], "none");
      else fora.push({ el: els[i], n: n });
    }
    return fora;
  }

  /** Tira os nomes da troca e devolve o que cada elemento tinha antes (o livro do painel tem o dele). */
  function limparNomes() {
    var els = document.querySelectorAll("[data-troca-nome]");
    for (var i = 0; i < els.length; i++) {
      els[i].style.viewTransitionName = els[i].getAttribute("data-troca-nome");
      els[i].style.viewTransitionClass = "";
      els[i].removeAttribute("data-troca-nome");
    }
  }
  function nomear(el, nome, classe) {
    if (!el.hasAttribute("data-troca-nome")) el.setAttribute("data-troca-nome", el.style.viewTransitionName || "");
    el.style.viewTransitionName = nome;
    if (classe) el.style.viewTransitionClass = classe;
  }

  function animarPseudo(pseudo, quadros, opcoes) {
    opcoes.fill = "both";
    opcoes.pseudoElement = pseudo;
    try { return raiz.animate(quadros, opcoes); } catch (e) { return null; }
  }
  var T3 = function (x, y, z, rx, ry, rz) {
    return "perspective(" + P + "px) translate3d(" + x + "px," + y + "px," + z + "px) rotateZ(" + rz + "deg) rotateY(" + ry + "deg) rotateX(" + rx + "deg)";
  };
  var PARADO = T3(0, 0, 0, 0, 0, 0);

  /* ================= A página que sai ================= */
  addEventListener("pageswap", function (e) {
    limparNomes();
    try { sessionStorage.removeItem(CHAVE); } catch (err) {}
    if (!e.viewTransition || reduzido.matches) return;
    if (raiz.hasAttribute("data-troca-propria") || document.querySelector("dialog[open]")) return;
    var destino = e.activation && e.activation.entry && e.activation.entry.url;
    if (!destino) return;
    var para = new URL(destino).pathname;
    var dados = { t: Date.now(), de: location.pathname, para: para, W: innerWidth, H: innerHeight };

    // Artigo anterior ou próximo: a folha do artigo inteira, e a lateral.
    var ehPost = function (c) { return /\/posts\//.test(c); };
    if (ehPost(location.pathname) && ehPost(para)) {
      var prox = document.querySelector('.vizinhos a[rel="next"]'), ant = document.querySelector('.vizinhos a[rel="prev"]');
      var lado = prox && new URL(prox.href).pathname === para ? "proximo" : ant && new URL(ant.href).pathname === para ? "anterior" : "";
      var folha = document.querySelector("#conteudo .artigo-principal");
      if (lado && folha) {
        nomear(folha, "artigo-velho");
        var lateral = document.querySelector("#conteudo .lateral");
        if (lateral && lateral.getBoundingClientRect().width > 0) nomear(lateral, "lateral-velha");
        // O rodapé do site, se estiver à vista, esmaece (sem nome, sumiria de uma vez com a raiz).
        var rodape = document.querySelector("body > .rodape");
        if (rodape && rodape.getBoundingClientRect().top < innerHeight) nomear(rodape, "rodape-velho");
        var sobre = document.querySelector("#conteudo .lateral a.sobre");
        dados.tipo = "lado";
        dados.lado = lado;
        dados.livro = sobre ? new URL(sobre.href).pathname : "";
        guardar(dados);
        return;
      }
    }

    // A troca geral: cada unidade à vista vira uma imagem que cai.
    var us = unidades();
    dados.tipo = "folhas";
    dados.sai = us.map(function (u, i) {
      nomear(u.el, "sai-" + i, "sai");
      return { n: "sai-" + i, texto: u.texto, oy: u.oy };
    });
    // Os livros nomeados: se a página nova tiver o mesmo, ele voa; senão, cai com a folha dele.
    dados.livros = livrosNomeados(true).map(function (l) {
      var dono = -1;
      for (var i = 0; i < us.length; i++) if (us[i].el.contains(l.el)) dono = i;
      return { n: l.n, u: dono };
    });
    guardar(dados);
  });
  function guardar(dados) {
    try { sessionStorage.setItem(CHAVE, JSON.stringify(dados)); } catch (err) {}
  }
  // Voltar pelo histórico (bfcache) traz a página como ficou: sem os nomes da troca. E sem a troca: a
  // página restaurada aparecia pronta num quadro e a antiga voltava por cima; um corte limpo é melhor.
  var restaurada = false;
  addEventListener("pageshow", function (e) {
    if (!e.persisted) return;
    limparNomes();
    restaurada = true;
  });

  /* ================= A página que chega ================= */
  function lerDados() {
    try {
      var bruto = sessionStorage.getItem(CHAVE);
      sessionStorage.removeItem(CHAVE);
      var d = bruto && JSON.parse(bruto);
      if (!d || Date.now() - d.t > 6000 || d.para !== location.pathname) return null;
      var de = window.navigation && navigation.activation && navigation.activation.from;
      if (de && new URL(de.url).pathname !== d.de) return null;
      return d;
    } catch (err) { return null; }
  }
  // Já no <head>, antes dos módulos: a página vai chegar por uma troca? (O desenho do topo do artigo
  // precisa saber antes do `pagereveal`, que às vezes vem depois dos módulos.)
  try {
    var espia = JSON.parse(sessionStorage.getItem(CHAVE) || "null");
    if (espia && espia.para === location.pathname && Date.now() - espia.t < 6000 && !reduzido.matches) raiz.dataset.vaiChegar = "";
  } catch (err) {}

  function voltando() {
    var a = window.navigation && navigation.activation;
    return !!a && a.navigationType === "traverse";
  }

  /**
   * As folhas novas chegam do fundo e pousam (o fim do A2); os textos sobem por uma máscara. `t0` em
   * segundos. Devolve quando a última termina (ms).
   */
  function chegar(novas, opcoes) {
    opcoes = opcoes || {};
    var W = innerWidth, H = innerHeight, cel = celular();
    var m = document.getElementById("conteudo");
    var passo = Number(opcoes.passo || (m && m.dataset.chegadaPasso) || 0.085);
    // Com muitas folhas, a última sai no máximo 0,55s depois da primeira (a troca fecha em ~1,5s).
    passo = Math.min(passo, 0.55 / Math.max(1, novas.length - 1));
    var t0 = opcoes.t0 || 0, fim = 0;
    var desenho = document.querySelector("[data-desenhar-topo]");
    novas.forEach(function (u, i) {
      var el = u.el, t = (t0 + i * passo) * 1000;
      if (u.texto) {
        el.animate(
          [{ transform: "translateY(18px)", opacity: 0, clipPath: "inset(0 0 100% 0)" }, { transform: "none", opacity: 1, clipPath: "inset(0 0 0% 0)" }],
          { duration: 550, delay: t + 50, easing: QUART_OUT, fill: "backwards" },
        );
        fim = Math.max(fim, t + 600);
        return;
      }
      if (u.soEsmaece) {
        // A folha que recebe o livro que voa esmaece já no começo: o livro novo aparece com ela, e tem de
        // estar inteiro quando pousa (0,7s).
        if (u.comLivro) t = 0;
        el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 450, delay: t, easing: "linear", fill: "backwards" });
        fim = Math.max(fim, t + 450);
        return;
      }
      var origem = "50% " + (u.oy || 0) + "px";
      var de;
      if (opcoes.volta) de = T3(0, 40, 260, -8, 0, 0);
      else {
        var z = cel ? -700 : -1600, k = P / (P - z);
        de = cel ? T3(0, (-H * 0.45) / k, z, 22, 0, -2) : T3((W * 0.3) / k, (-H * 0.5) / k, z, 16, -30, rnd(-5, -2));
      }
      var dur = cel ? 850 : 1000;
      // A folha do desenho do artigo: ele começa quando ela está quase pousada (protótipo 08).
      if (desenho && el.contains(desenho)) setTimeout(function () { dispatchEvent(new CustomEvent("cs:pousou")); }, t + dur * 0.6);
      el.animate([{ transform: de, transformOrigin: origem }, { transform: PARADO, transformOrigin: origem }], { duration: dur, delay: t, easing: QUART_OUT, fill: "backwards" });
      el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 280, delay: t, easing: "linear", fill: "backwards" });
      fim = Math.max(fim, t + dur);
    });
    return fim;
  }

  /** As folhas antigas caem da mesa (de baixo para cima); os textos antigos sobem e somem. */
  function cair(d, comPar) {
    var H = innerHeight, fim = 0, giro = {};
    // A folha que tinha o livro que voou cai primeiro e some logo (senão, fica o buraco dele à vista).
    var donos = {};
    (d.livros || []).forEach(function (l) { if (comPar[l.n] && l.u >= 0) donos["sai-" + l.u] = true; });
    // Toda a cascata cabe em 0,16s, por mais folhas que a página tenha.
    var passo = Math.min(45, 160 / Math.max(1, d.sai.length - 1));
    d.sai.slice().reverse().forEach(function (s, j) {
      var alvo = "::view-transition-old(" + s.n + ")";
      if (s.texto) {
        animarPseudo(alvo, [{ transform: "none", opacity: 1 }, { transform: "translateY(-10px)", opacity: 0 }], { duration: 200, delay: j * passo * 0.8, easing: CUBIC_IN });
        return;
      }
      var dono = donos[s.n];
      var t = dono ? 0 : j * passo, rz = rnd(-7, 7), o = "50% " + s.oy + "px";
      giro[s.n] = { t: t, rz: rz };
      animarPseudo(alvo, [{ transform: PARADO, transformOrigin: o }, { transform: T3(0, H * 0.9, 0, -18, 0, rz), transformOrigin: o }], { duration: 480, delay: t, easing: CUBIC_IN });
      animarPseudo(alvo, [{ opacity: 1 }, { opacity: 0 }], { duration: 200, delay: t + (dono ? 120 : 180), easing: QUAD_IN });
      fim = Math.max(fim, t + 480);
    });
    return { fim: fim, giro: giro };
  }

  function avisarChegada() {
    limparNomes();
    delete raiz.dataset.chegando;
    delete raiz.dataset.vaiChegar;
    dispatchEvent(new CustomEvent("cs:chegou"));
  }

  addEventListener("pagereveal", function (e) {
    limparNomes();
    var d = lerDados();
    var vt = e.viewTransition;
    if (restaurada) {
      restaurada = false;
      if (vt) {
        vt.ready.catch(function () {});
        vt.skipTransition();
      }
      d = null;
    }
    if (!d || !vt || reduzido.matches) {
      // Não vai ter troca: quem esperava por ela (o desenho do artigo) segue na hora.
      if (raiz.hasAttribute("data-vai-chegar")) avisarChegada();
      return;
    }
    raiz.dataset.chegando = "";
    try { vt.types.add(d.tipo); } catch (err) {}

    if (d.tipo === "lado") {
      trocarDeLado(vt, d);
      vt.finished.finally(avisarChegada);
      return;
    }

    // Os livros: com par, voam (e a folha deles só esmaece); sem par na página nova, chegam com a folha.
    var velhos = {};
    (d.livros || []).forEach(function (l) { velhos[l.n] = l; });
    var volta = voltando();
    var m = document.getElementById("conteudo");
    var propria = m && m.dataset.chegada === "propria" && !volta;
    var novosLivros = livrosNomeados();
    var comPar = {};
    novosLivros.forEach(function (l) {
      // Numa chegada própria (o desfile de Categorias), todo livro chega no desfile: o que veio da página
      // antiga cai com a folha dele (voando, ele encostava no cabeçalho e depois descia com a pilha).
      if (velhos[l.n] && !propria) comPar[l.n] = true;
      else nomear(l.el, "none");
    });
    var novas = unidades();
    novas.forEach(function (u) {
      for (var i = 0; i < novosLivros.length; i++) if (comPar[novosLivros[i].n] && u.el.contains(novosLivros[i].el)) u.soEsmaece = u.comLivro = true;
    });

    if (propria) {
      // A página anima a chegada dela (Categorias); até o script dela chegar, as folhas esperam escondidas.
      novas.forEach(function (u) { u.el.style.opacity = "0"; });
      window.csChegada = { novas: novas, inicio: performance.now() };
      setTimeout(function () {
        if (!window.csChegada) return;
        novas.forEach(function (u) { u.el.style.opacity = ""; });
        window.csChegada = null;
      }, 1800);
    }
    var fimDaChegada = propria ? 0 : chegar(novas, { volta: volta, t0: 0.2 });

    vt.ready.then(function () {
      var r = cair(d, comPar);
      // O livro que não tem par cai com a folha dele.
      (d.livros || []).forEach(function (l) {
        if (comPar[l.n] || l.u < 0) return;
        var g = r.giro["sai-" + l.u];
        if (!g) return;
        var alvo = "::view-transition-old(" + l.n + ")";
        animarPseudo(alvo, [{ transform: PARADO }, { transform: T3(0, innerHeight * 0.9, 0, -18, 0, g.rz) }], { duration: 480, delay: g.t, easing: CUBIC_IN });
        animarPseudo(alvo, [{ opacity: 1 }, { opacity: 0 }], { duration: 200, delay: g.t + 180, easing: QUAD_IN });
      });
    }, function () {});
    // A chegada acabou quando a troca acabou e a última folha nova pousou (o desenho do artigo espera isso).
    var pousou = new Promise(function (r) { setTimeout(r, fimDaChegada); });
    Promise.all([vt.finished.catch(function () {}), pousou]).then(avisarChegada);
  });

  /* Artigo anterior e próximo (protótipo 06, "na pilha"). */
  function trocarDeLado(vt, d) {
    var W = innerWidth;
    var folha = document.querySelector("#conteudo .artigo-principal");
    var lateral = document.querySelector("#conteudo .lateral");
    var sobre = document.querySelector("#conteudo .lateral a.sobre");
    var mesmoLivro = !!d.livro && !!sobre && new URL(sobre.href).pathname === d.livro;
    var proximo = d.lado === "proximo";
    if (proximo && folha) nomear(folha, "artigo-novo");
    else if (folha) folha.animate([{ opacity: 0.55, transform: "scale(0.99)" }, { opacity: 1, transform: "none" }], { duration: 500, delay: 150, easing: QUART_OUT, fill: "backwards" });
    if (lateral && !mesmoLivro) lateral.animate([{ opacity: 0, transform: "translateX(" + (proximo ? 16 : -16) + "px)" }, { opacity: 1, transform: "none" }], { duration: 400, delay: 180, easing: QUART_OUT, fill: "backwards" });
    vt.ready.then(function () {
      if (proximo) {
        // o próximo vem da direita, um pouco torto, e é pousado por cima do atual, que some no fim
        animarPseudo("::view-transition-new(artigo-novo)", [{ transform: "translate(" + W * 0.55 + "px, 26px) rotate(3.5deg)" }, { transform: "none" }], { duration: 700, delay: 50, easing: QUART_OUT });
        animarPseudo("::view-transition-old(artigo-velho)", [{ opacity: 1 }, { opacity: 0 }], { duration: 200, delay: 600, easing: "linear" });
      } else {
        // o anterior: o de cima é tirado para a direita e mostra o que estava embaixo
        animarPseudo("::view-transition-old(artigo-velho)", [{ transform: "none" }, { transform: "translate(" + W * 0.6 + "px, 20px) rotate(4deg)" }], { duration: 600, easing: CUBIC_IN });
      }
      // A lateral: o mesmo livro fica parado (a antiga só sai no fim); outro livro troca junto.
      animarPseudo("::view-transition-old(rodape-velho)", [{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: CUBIC_IN });
      if (mesmoLivro) animarPseudo("::view-transition-old(lateral-velha)", [{ opacity: 1 }, { opacity: 1 }], { duration: 650 });
      else animarPseudo("::view-transition-old(lateral-velha)", [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateX(" + (proximo ? -16 : 16) + "px)" }], { duration: 200, easing: CUBIC_IN });
    }, function () {});
  }

  window.csTroca = { unidades: unidades, chegar: chegar };
})();
