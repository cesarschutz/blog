/*
 * A troca de página por folhas (D51, protótipo 03: "cai da mesa", texto fora), embutida no <head> de
 * toda página (Base.astro), antes da primeira pintura. Sem biblioteca: View Transitions entre
 * documentos, animadas pela Web Animations API.
 *
 * - Na página que sai (`pageswap`): cada folha à vista (as `.folha` de fora, ou `[data-unidade]`) e cada
 *   texto solto entre elas ganha um nome de transição (`sai-N`, classe `sai`), e o que a página nova
 *   precisa saber vai para a sessão (`cs-troca`). O clique navega na hora, sem esperar.
 * - Na página que chega (`pagereveal`): as folhas antigas caem da mesa (cada uma escorrega para baixo
 *   com um giro pequeno, pelo peso, de baixo para cima) e os textos antigos sobem um pouco e somem. Só
 *   então (a mesa fica limpa antes, D52) as folhas novas, que são a página de verdade, chegam do fundo,
 *   em perspectiva e um pouco tortas, e pousam no lugar, de cima para baixo (o fim do A2); os textos novos sobem por uma máscara, uma linha
 *   curta. Voltando pelo histórico, as novas vêm da frente. Só o que está à vista anima.
 * - Os livros com o mesmo nome nas duas páginas voam de um lugar ao outro, fora das folhas (só o livro
 *   viaja, protótipo 07); a folha deles só esmaece. Livro sem par cai com a folha dele.
 * - Artigo anterior e próximo (protótipo 06, "na pilha"): o próximo é pousado por cima do atual, vindo
 *   da direita, e o atual some embaixo dele antes do pouso; o anterior aparece quando o de cima é tirado
 *   para a direita. O livro da lateral fica
 *   parado se for o mesmo.
 * - `data-chegada-passo` no <main> muda o intervalo entre as folhas (a tag: desfile direto, 60 ms);
 *   `data-chegada="propria"` deixa a chegada para o script da página (Categorias: desfile e pilha).
 * - Fica de fora: movimento reduzido, navegador sem View Transitions entre documentos, a troca de livro
 *   pela pilha (`data-troca-propria`, PainelHome) e a navegação com um diálogo aberto (busca, livro
 *   ampliado): elas usam a troca de página de antes (base.css).
 *
 * - Lentidão (D52, B14): se a página nova não vem em 0,2s, a caneta azul escreve o fio do cabeçalho até ela
 *   chegar; se a espera passou de 0,7s desde o clique, ou o aparelho não deu conta de uma troca anterior
 *   (mais de 50 ms por quadro) ou tem pouca memória, a chegada é a curta (as folhas só aparecem, ~0,4s).
 *   Se a última troca demorou para montar a página nova (mais de 0,3s entre a resposta e a primeira
 *   pintura), a próxima mostra a caneta já no clique e é a curta.
 *
 * Outros scripts usam `window.csTroca` (unidades, chegar, jogar) e os eventos `cs:pousou` (a folha do desenho
 * do artigo pousou), `cs:chegou` (a chegada acabou) e `cs:cortina-saindo` (rodada 3: a cortina começou a
 * sair, aos 0,62s da troca; `detail` = { volta, curta, duracao }). `data-vai-chegar` no <html>, posto já
 * no <head>, avisa os módulos que a página vai chegar por uma troca, antes do `pagereveal`.
 */
(function () {
  var raiz = document.documentElement;
  var CHAVE = "cs-troca";
  var P = 1400;
  var QUART_OUT = "cubic-bezier(0.25, 1, 0.5, 1)";
  var CUBIC_IN = "cubic-bezier(0.32, 0, 0.67, 0)";
  var QUAD_IN = "cubic-bezier(0.55, 0.085, 0.68, 0.53)";
  // A queda: acelera desde o começo (quad), para a folha sair do lugar logo e não ficar parada na mesa.
  var QUEDA = "cubic-bezier(0.11, 0, 0.5, 0)";
  var SAI_LOGO = "cubic-bezier(0.33, 1, 0.68, 1)";
  var reduzido = matchMedia("(prefers-reduced-motion: reduce)");
  // A mesa fica limpa antes (D52, A02): as folhas novas só aparecem (CHEGA, 0,24s) quando as antigas já
  // estão caindo e quase transparentes; antes, apareciam atrás das antigas ainda paradas. E sem mesa
  // vazia no meio (revisão 2): o voo delas começa antes (VOO), ainda transparentes, porque as de cima
  // saem do alto, fora da tela, e levam ~0,2s para entrar; com o voo e a opacidade juntos em 0,26s, a
  // tela ficava ~0,1s só com o papel entre a saída e a chegada.
  var VOO = 0.04;
  var CHEGA = 0.24;
  // Lentidão (D52, B14): a caneta escreve o fio do cabeçalho se a página nova não vier em 0,2s; se a
  // espera passou de 0,7s (ou o aparelho não dá conta da coreografia), a chegada é a curta. Com a CPU
  // lenta, a demora vem depois da resposta (montar a página nova, com a tela parada): se a última troca
  // levou mais de 0,3s entre a resposta e a primeira pintura (`pageswap` → `pagereveal`), a próxima já
  // mostra a caneta no clique e usa a chegada curta (revisão 7). Antes, a tela congelava ~1,1s sem sinal
  // nenhum e a chegada curta (limite de 1s) falhava por pouco.
  var ESPERA = 200;
  var DEMORA = 700;
  var MONTAGEM_LENTA = 300;
  var CHAVE_MONTAGEM = "cs-troca-montagem";
  function montagemAnterior() {
    try { return Number(sessionStorage.getItem(CHAVE_MONTAGEM)) || 0; } catch (err) { return 0; }
  }
  var celular = function () { return innerWidth <= 640; };
  var rnd = function (a, b) { return a + Math.random() * (b - a); };
  var FOLHA = ".folha, [data-unidade]";
  // Protótipo 14 (G10): a troca de página é a cortina com o nome do destino; a das folhas fica para o
  // anterior e o próximo do artigo (na pilha) e para quem a pedir.
  var CORTINA = true;
  // Rodada 3 (área 7, T2): os tempos da cortina, em ms, no relógio da troca (vt.ready = 0). Ela entra até
  // 0,38s (suave.css), segura até 0,62s e sai pelo alto até 0,98s.
  // Rodada 4 (A3): por baixo dela, a montagem das folhas do blog de hoje (o 11): as folhas novas vêm do
  // fundo e da direita, levemente giradas, em perspectiva, e pousam. Começam aos 0,45s, ainda cobertas,
  // voam 0,95s com uma curva mais macia que a de hoje (para o fim do voo, que é o que a cortina deixa ver,
  // ainda andar) e se espalham no máximo 0,15s: a última pousa por volta de 1,55s (até 1,7s do clique).
  var CORTINA_ENTRA = 380;
  var CORTINA_SEGURA = 620;
  var CORTINA_SAI = 360;
  var CORTINA_VOO = 450;
  var CORTINA_POUSO = 950;
  var CORTINA_ESPALHA = 150;
  var CORTINA_CURVA = "cubic-bezier(0.2, 0.72, 0.28, 1)";
  // O desfile de Livros (a chegada própria, o desfile do blog de hoje) começa ainda coberto, aos 0,42s:
  // os cartões chegam à pilha enquanto a cortina sai, e tudo assenta até 3,5s do clique.
  var CORTINA_DESFILE = 420;
  // As fichas de Tags (rodada 4, A3, "principalmente tag"): jogadas do alto à direita a partir de 0,36s,
  // 40ms entre elas (no máximo 0,16s entre a primeira e a última), 0,76s cada: assentam até ~1,28s.
  var JOGA_T0 = 360;
  var JOGA_PASSO = 40;
  var JOGA_ESPALHA = 160;
  var JOGA_DUR = 760;

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
      // A classe também volta (o livro em pé tem "livro" no HTML; antes, ela se perdia depois da troca).
      els[i].style.viewTransitionClass = els[i].getAttribute("data-troca-classe") || "";
      els[i].removeAttribute("data-troca-nome");
      els[i].removeAttribute("data-troca-classe");
    }
  }
  function nomear(el, nome, classe) {
    if (!el.hasAttribute("data-troca-nome")) {
      el.setAttribute("data-troca-nome", el.style.viewTransitionName || "");
      el.setAttribute("data-troca-classe", el.style.viewTransitionClass || "");
    }
    el.style.viewTransitionName = nome;
    if (classe) el.style.viewTransitionClass = classe;
  }

  /**
   * O giro do livro 3D (LivroEmPe) dentro de `el`, em graus, como está na tela agora (no cartão de
   * Categorias, o hover o vira para o leitor, no meio da transição dele); null se não houver livro 3D.
   */
  function giroDe(el) {
    var l3 = el.querySelector(".livro-3d");
    if (!l3) return null;
    try {
      var mt = new DOMMatrix(getComputedStyle(l3).transform);
      return Math.round((Math.atan2(-mt.m13, mt.m11) * 180) / Math.PI * 10) / 10;
    } catch (err) { return null; }
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

  /* ================= Enquanto a página nova não vem (D52, B14) ================= */
  // O clique navega na hora; se a página nova demora mais de 0,2s (rede ou aparelho lentos), a caneta
  // azul começa a escrever o fio do cabeçalho, cada vez mais devagar, até ela chegar. Ela fica na última
  // imagem da página antiga (enquanto a nova termina de carregar, a tela fica parada) e some com ela.
  var CANETA = '<svg class="caneta" viewBox="0 0 24 24" focusable="false"><path class="corpo" d="M8.2 13.2 17.4 4a1.4 1.4 0 0 1 2 0l.6.6a1.4 1.4 0 0 1 0 2l-9.2 9.2Z"/><path class="anel" d="m15.6 5.8 2.6 2.6"/><path class="ponta" d="M8.2 13.2 10.8 15.8 4 20Z"/></svg>';
  var carga = null, relogio = 0, largou = 0, inicioNav = 0;
  function mostrarCarga(noClique) {
    relogio = 0;
    if (carga || !document.body) return;
    carga = document.createElement("div");
    // No clique (a última troca demorou para montar), ela já aparece inteira e com um traço começado: a
    // tela pode parar na próxima imagem, e ela tem de estar nela.
    carga.className = noClique === true ? "carregando no-clique" : "carregando";
    carga.setAttribute("aria-hidden", "true");
    carga.innerHTML = '<div class="risco"></div>' + CANETA;
    document.body.append(carga);
    raiz.setAttribute("data-carregando", "");
    // Se nada chegar (a pessoa parou o carregamento), a caneta some sozinha.
    largou = setTimeout(esconderCarga, 20000);
  }
  function esconderCarga() {
    clearTimeout(relogio);
    clearTimeout(largou);
    relogio = largou = 0;
    if (carga) carga.remove();
    carga = null;
    raiz.removeAttribute("data-carregando");
  }
  function vaiNavegar(url) {
    esconderCarga();
    var d;
    try { d = new URL(url, location.href); } catch (err) { return; }
    if (d.origin !== location.origin || (d.pathname === location.pathname && d.search === location.search)) return;
    inicioNav = Date.now();
    if (montagemAnterior() > MONTAGEM_LENTA) mostrarCarga(true);
    else relogio = setTimeout(mostrarCarga, ESPERA);
  }
  if (window.navigation && navigation.addEventListener) {
    navigation.addEventListener("navigate", function (e) {
      if (e.hashChange || e.downloadRequest || e.navigationType === "reload" || (e.destination && e.destination.sameDocument)) return;
      vaiNavegar(e.destination.url);
    });
  } else {
    addEventListener("click", function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target && e.target.closest && e.target.closest("a[href]");
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      vaiNavegar(a.href);
    });
  }

  /* ================= A página que sai ================= */
  addEventListener("pageswap", function (e) {
    // A caneta fica na tela até a página nova chegar; só o relógio para (não aparece mais depois disto:
    // daqui até a página nova ser pintada, a tela fica parada na última imagem desta).
    clearTimeout(relogio);
    terminarChegada();
    limparNomes();
    try { sessionStorage.removeItem(CHAVE); } catch (err) {}
    if (!e.viewTransition || reduzido.matches) return;
    naoEsticarALombada(e);
    // No celular, a folha do menu (fechando, ou fechada) sai da imagem do cabeçalho: ela ia junto com ele
    // e ficava congelada por cima da troca (D54). Volta no pageshow, se a página voltar do bfcache.
    raiz.setAttribute("data-troca-sem-menu", "");
    if (document.querySelector("dialog[open]")) {
      // Com a busca ou o livro ampliado abertos, a página sai inteira, com o véu: o cabeçalho e o traço da
      // seção não saem à parte, acesos por cima dela (D54).
      var topo = document.querySelector(".topo-fixo");
      if (topo) nomear(topo, "none");
      var traco = document.querySelector(".cabecalho .traco-atual");
      if (traco) nomear(traco, "none");
      // Os livros com nome (o de origem do livro ampliado, os da página) também: a lupa do livro de origem
      // aparecia acesa por cima do véu (D54).
      var nomeados = document.querySelectorAll('.livro-em-pe, [data-vt], [style*="view-transition-name"]');
      for (var k = 0; k < nomeados.length; k++) if (!nomeados[k].closest("dialog[open]")) nomear(nomeados[k], "none");
      return;
    }
    if (raiz.hasAttribute("data-troca-propria")) return;
    var destino = e.activation && e.activation.entry && e.activation.entry.url;
    if (!destino) return;
    var para = new URL(destino).pathname;
    var dados = { t: Date.now(), clique: inicioNav, de: location.pathname, para: para, W: innerWidth, H: innerHeight };

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
        // Onde o livro da lateral está (no fim do artigo, a lateral grudada sobe junto com ele; no alto, o
        // post-it de cima tem a altura do sumário de cada artigo): ele só fica parado se o novo estiver no
        // mesmo lugar.
        var livroNaLateral = lateral && lateral.getBoundingClientRect().width > 0 && lateral.querySelector(".livro-em-pe");
        dados.livroTopo = livroNaLateral ? livroNaLateral.getBoundingClientRect().top : null;
        // O livro da lateral vai na imagem dela, sem nome próprio (D54): com a imagem à parte, ele saía depois
        // da lateral e passava por cima da ficha nova. Parado no mesmo lugar, a imagem da lateral velha, com
        // ele dentro, fica por cima da nova até o fim, e dá no mesmo.
        var livroLateral = lateral && lateral.querySelector(".livro-em-pe");
        if (livroLateral) nomear(livroLateral, "none");
        guardar(dados);
        return;
      }
    }

    // Rodada 2 (protótipo 14, G7): a troca de livro pela estante do topo. O livro grande volta para o vão
    // dele na estante e o escolhido sai da estante e abre grande; o resto da página só troca.
    if (raiz.hasAttribute("data-troca-livro")) {
      raiz.removeAttribute("data-troca-livro");
      dados.tipo = "livro";
      livrosNomeados(false).forEach(function (l) { nomear(l.el, l.n, l.el.hasAttribute("data-vt") ? "livro vem" : "livro vai"); });
      guardar(dados);
      return;
    }
    // Rodada 2 (protótipo 14, G10): a cortina. Ela passa por cima da página com o nome do destino, e a
    // página nova monta embaixo dela; nenhum livro voa por cima da cortina. Rodada 3 (área 7, item 4): entre
    // as páginas da home (/, /2/, /3/, a paginação), continua a troca de hoje, a das folhas, sem cortina.
    var paginaDaHome = function (c) { return /^\/(\d+\/)?$/.test(c); };
    // Rodada 4 (H3): da home, o livro clicado na fileira (ou o nome dele) abre a página do livro sem a
    // cortina: o livro é a transição. A troca é a das folhas, com o par do livro (o da fileira e o grande do
    // painel, Base.astro dá o nome aos dois): ele voa, crescendo e girando até a pose de lá ("mesmo"), e o
    // resto da página antiga cai enquanto a nova monta. Colecao.astro marca `data-abre-livro` com o destino.
    var abreLivro = raiz.dataset.abreLivro === para;
    raiz.removeAttribute("data-abre-livro");
    if (abreLivro) dados.abreLivro = true;
    if (CORTINA && !abreLivro && !(paginaDaHome(location.pathname) && paginaDaHome(para))) {
      dados.tipo = "cortina";
      livrosNomeados(false).forEach(function (l) { nomear(l.el, "none"); });
      guardar(dados);
      return;
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
      return { n: l.n, u: dono, g: giroDe(l.el) };
    });
    guardar(dados);
  });
  /**
   * A lombada deitada da pilha (PainelHome) não vira, pela View Transition, o livro em pé do topo da
   * página dela (D52, revisão 15). O script do <head> dá o nome dela quando ela leva à página nova; sem o
   * voo da pilha (no celular e no tablet, com o topo fora da tela), a imagem fina dela era esticada até a
   * largura do livro e cruzava a capa como uma faixa. Com formas tão diferentes, não há morph: ela sai
   * com a pilha, e o livro chega com a folha da página nova (que também tira o nome dele, abaixo, para
   * ele não aparecer por cima da página antiga). Com o voo, a pilha já tira o nome da lombada.
   */
  var SEM_PAR = "cs-troca-sem-par";
  function naoEsticarALombada(e) {
    var destino = e.activation && e.activation.entry && e.activation.entry.url;
    if (!destino) return;
    var para = new URL(destino).pathname;
    var deitados = document.querySelectorAll(".deitado[data-vt]");
    for (var i = 0; i < deitados.length; i++) {
      var link = deitados[i].closest("a[href]");
      var nome = deitados[i].style.viewTransitionName;
      if (!link || new URL(link.href).pathname !== para || !nome || nome === "none") continue;
      deitados[i].style.viewTransitionName = "none";
      try { sessionStorage.setItem(SEM_PAR, JSON.stringify({ n: nome, para: para, t: Date.now() })); } catch (err) {}
    }
  }
  /** Na página nova: o livro que teria o par com a lombada chega com a folha, sem nome (e o recebe de volta no fim). */
  function livroSemPar(vt) {
    var d;
    try {
      d = JSON.parse(sessionStorage.getItem(SEM_PAR) || "null");
      sessionStorage.removeItem(SEM_PAR);
    } catch (err) { return; }
    if (!d || d.para !== location.pathname || Date.now() - d.t > 6000) return;
    var els = document.querySelectorAll(".livro-em-pe");
    for (var i = 0; i < els.length; i++) if (els[i].style.viewTransitionName === d.n) nomear(els[i], "none");
    vt.finished.finally(limparNomes);
  }
  function guardar(dados) {
    try { sessionStorage.setItem(CHAVE, JSON.stringify(dados)); } catch (err) {}
  }
  // As animações de chegada ainda no ar. A página que sai no meio delas termina a chegada antes (no
  // pageswap, ainda a tempo de o navegador pintar e guardar a imagem dela): senão, voltando pelo bfcache, ela
  // aparecia por um quadro congelada no meio do voo (D54). No pagehide, de novo, para a saída sem troca.
  var emCurso = [];
  // A página está saindo (pageswap, ou pagehide para o bfcache): o que terminar agora não avisa ninguém
  // (o aviso da saída da cortina, por exemplo, não dispara na página que vai embora).
  var encerrando = false;
  function terminarChegada() {
    encerrando = true;
    emCurso.forEach(function (a) { try { a.finish(); } catch (err) {} });
    emCurso = [];
    dispatchEvent(new CustomEvent("cs:congelar"));
  }
  addEventListener("pagehide", function (e) {
    if (e.persisted) terminarChegada();
  });
  // Voltar pelo histórico (bfcache) traz a página como ficou: sem os nomes da troca. E sem a troca: a
  // página restaurada aparecia pronta num quadro e a antiga voltava por cima; um corte limpo é melhor.
  var restaurada = false;
  addEventListener("pageshow", function (e) {
    if (!e.persisted) return;
    encerrando = false;
    esconderCarga();
    limparNomes();
    raiz.removeAttribute("data-troca-sem-menu");
    raiz.removeAttribute("data-troca-livro");
    raiz.classList.remove("cortina", "cortina-volta");
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
   * segundos. Devolve quando a última termina (ms). Com `opcoes.anims`, as animações criadas vão para
   * essa lista (a troca as recomeça juntas quando a View Transition fica pronta); `opcoes.visivel`
   * (segundos) segura a opacidade das novas até lá, mesmo com o voo já começado.
   */
  function chegar(novas, opcoes) {
    emCurso = emCurso.filter(function (a) { return a.playState !== "finished"; });
    opcoes = opcoes || {};
    var W = innerWidth, H = innerHeight, cel = celular();
    var m = document.getElementById("conteudo");
    var passo = Number(opcoes.passo || (m && m.dataset.chegadaPasso) || 0.085);
    // Com muitas folhas, a última sai no máximo 0,5s depois da primeira (a troca fecha em ~1,6s; sob a
    // cortina, `opcoes.espalha`); na chegada curta (a página demorou, B14), em 0,1s.
    passo = Math.min(opcoes.curta ? 0.02 : passo, (opcoes.curta ? 0.1 : opcoes.espalha || 0.5) / Math.max(1, novas.length - 1));
    var curta = !!opcoes.curta;
    var t0 = opcoes.t0 || 0, fim = 0;
    // Nada novo fica visível antes disto (ms): o voo pode começar antes, ainda transparente (revisão 2).
    var visivel = (opcoes.visivel || 0) * 1000;
    var anims = opcoes.anims || [];
    var animar = function (el, quadros, tempo) {
      var a = el.animate(quadros, tempo);
      anims.push(a);
      emCurso.push(a);
      return a;
    };
    var desenho = document.querySelector("[data-desenhar-topo]");
    novas.forEach(function (u, i) {
      var el = u.el, t = (t0 + i * passo) * 1000;
      // Protótipo 14 (G5): os artigos da página do livro giram ao entrar, pelo script da página.
      if (!u.texto && el.closest("[data-gira]")) return;
      if (u.texto) {
        animar(el,
          [{ transform: "translateY(18px)", opacity: 0, clipPath: "inset(0 0 100% 0)" }, { transform: "none", opacity: 1, clipPath: "inset(0 0 0% 0)" }],
          { duration: curta ? 280 : 550, delay: Math.max(t + 50, visivel), easing: QUART_OUT, fill: "backwards" },
        );
        fim = Math.max(fim, Math.max(t + 50, visivel) + (curta ? 280 : 550));
        return;
      }
      if (u.soEsmaece) {
        // A folha que recebe o livro que voa esmaece antes das outras, e tem de estar inteira quando ele
        // pousa (0,75s). Ela nunca fica em zero: com opacidade 0, o Chrome não pinta nada dentro dela, e a
        // imagem nova do livro (viva) sumia no começo do voo.
        if (u.comLivro) t = curta ? 0 : 120;
        else t = Math.max(t, visivel);
        var dm = curta ? 250 : 450;
        animar(el, [{ opacity: u.comLivro ? 0.01 : 0 }, { opacity: 1 }], { duration: dm, delay: t, easing: "linear", fill: "backwards" });
        fim = Math.max(fim, t + dm);
        return;
      }
      if (curta) {
        // A chegada curta: a folha só sobe um pouco e aparece, sem o voo do fundo.
        if (desenho && el.contains(desenho)) animar(el, [], { duration: t + 180 }).finished.then(function () { dispatchEvent(new CustomEvent("cs:pousou")); }, function () {});
        animar(el, [{ transform: "translateY(12px)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 300, delay: t, easing: QUART_OUT, fill: "backwards" });
        fim = Math.max(fim, t + 300);
        return;
      }
      var origem = "50% " + (u.oy || 0) + "px";
      // Rodada 3 (área 7): a folha muito mais alta que a tela (o corpo do artigo) não voa em 3D, só sobe e
      // assenta. Em perspectiva, o Chrome rasteriza a camada dela quase inteira (milhares de pixels de
      // altura); com a CPU 4× e o tema escuro, faltava memória de ladrilho e a cortina por cima dela nem era
      // pintada (filmado: arquivo → artigo, escuro, 1440).
      if (u.r && u.r.height > H * 1.5) {
        var durAlta = opcoes.dur ? Math.round(opcoes.dur * (cel ? 0.88 : 1)) : cel ? 850 : 1000;
        if (desenho && el.contains(desenho)) animar(el, [], { duration: t + durAlta * 0.6 }).finished.then(function () { dispatchEvent(new CustomEvent("cs:pousou")); }, function () {});
        animar(el, [{ transform: "translateY(" + (opcoes.volta ? -40 : 72) + "px)" }, { transform: "none" }], { duration: durAlta, delay: t, easing: QUART_OUT, fill: "backwards" });
        animar(el, [{ opacity: 0 }, { opacity: 1 }], { duration: 240, delay: Math.max(t, visivel), easing: SAI_LOGO, fill: "backwards" });
        fim = Math.max(fim, t + durAlta);
        return;
      }
      var de;
      if (opcoes.plano) {
        // Sob a cortina (rodada 3, área 7), o mesmo pouso no plano: a folha vem do alto à direita, menor e um
        // pouco torta, e assenta. Só se vê o fim do voo (o começo está coberto), que é igual ao da perspectiva;
        // em 2D, o Chrome rasteriza a folha uma vez, na escala final, e a saída da cortina não engasga (em 3D,
        // ele refazia o desenho das ilustrações a cada escala: quadros de 70 a 110ms com a CPU 4×).
        if (opcoes.volta) de = "translate(0px, 18px) scale(1.05)";
        else de = cel ? "translate(0px, " + Math.round(-H * 0.14) + "px) rotate(-2deg) scale(0.88)" : "translate(" + Math.round(W * 0.1) + "px, " + Math.round(-H * 0.16) + "px) rotate(" + rnd(-4, -2).toFixed(2) + "deg) scale(0.84)";
      } else if (opcoes.volta) de = T3(0, 40, 260, -8, 0, 0);
      else {
        var z = cel ? -700 : -1600, k = P / (P - z);
        de = cel ? T3(0, (-H * 0.45) / k, z, 22, 0, -2) : T3((W * 0.3) / k, (-H * 0.5) / k, z, 16, -30, rnd(-5, -2));
      }
      // O voo: 1s (0,85s no celular); sob a cortina, `opcoes.dur` (rodada 3, área 7).
      var dur = opcoes.dur ? Math.round(opcoes.dur * (cel ? 0.88 : 1)) : cel ? 850 : 1000;
      // A folha do desenho do artigo: ele começa quando ela está quase pousada (protótipo 08). Uma animação
      // vazia marca o tempo, para andar junto com as outras (e recomeçar com elas).
      if (desenho && el.contains(desenho)) animar(el, [], { duration: t + dur * 0.6 }).finished.then(function () { dispatchEvent(new CustomEvent("cs:pousou")); }, function () {});
      // A origem do giro vai no estilo durante o voo, e não nos quadros-chave: com `transform-origin` nos
      // quadros, o Chrome não leva a animação para o compositor e cada quadro dependia da thread principal
      // (rodada 3: com a CPU 4×, a saída da cortina engasgava enquanto as folhas voavam embaixo dela).
      var origemAntes = el.style.transformOrigin;
      el.style.transformOrigin = origem;
      var devolverOrigem = (function (alvo, valor, antes) {
        return function () { if (alvo.style.transformOrigin === valor) alvo.style.transformOrigin = antes; };
      })(el, el.style.transformOrigin, origemAntes);
      animar(el, [{ transform: de }, { transform: opcoes.plano ? "none" : PARADO }], { duration: dur, delay: t, easing: opcoes.curva || QUART_OUT, fill: "backwards" }).finished.then(devolverOrigem, devolverOrigem);
      // A opacidade vem logo (ease-out, 170ms), não antes de `visivel`: a folha aparece ainda pequena, lá no
      // fundo, enquanto as antigas somem, e a mesa nunca fica vazia.
      animar(el, [{ opacity: 0 }, { opacity: 1 }], { duration: 170, delay: Math.max(t, visivel), easing: SAI_LOGO, fill: "backwards" });
      fim = Math.max(fim, t + dur);
    });
    return fim;
  }

  /**
   * As folhas antigas caem da mesa (de baixo para cima, numa cascata curta); os textos antigos sobem e
   * somem. Tudo some em 0,3s; as folhas novas aparecem no fim disso (CHEGA): a queda acelera logo (o
   * peso) e a folha some na segunda metade dela, ainda caindo.
   */
  function cair(d, comPar, curta) {
    var H = innerHeight, fim = 0, giro = {};
    if (curta) {
      // A saída curta (a página demorou, B14): as folhas antigas só somem.
      d.sai.forEach(function (s) { animarPseudo("::view-transition-old(" + s.n + ")", [{ opacity: 1 }, { opacity: 0 }], { duration: 140, easing: CUBIC_IN }); });
      return { fim: 140, giro: giro };
    }
    // A folha que tinha o livro que voou cai primeiro e some logo (senão, fica o buraco dele à vista).
    var donos = {};
    (d.livros || []).forEach(function (l) { if (comPar[l.n] && l.u >= 0) donos["sai-" + l.u] = true; });
    // Toda a cascata cabe em 0,06s, por mais folhas que a página tenha.
    var passo = Math.min(25, 60 / Math.max(1, d.sai.length - 1));
    d.sai.slice().reverse().forEach(function (s, j) {
      var alvo = "::view-transition-old(" + s.n + ")";
      if (s.texto) {
        animarPseudo(alvo, [{ transform: "none", opacity: 1 }, { transform: "translateY(-10px)", opacity: 0 }], { duration: 180, delay: j * passo * 0.8, easing: CUBIC_IN });
        return;
      }
      var dono = donos[s.n];
      var t = dono ? 0 : j * passo, rz = rnd(-7, 7), o = "50% " + s.oy + "px";
      giro[s.n] = { t: t, rz: rz };
      animarPseudo(alvo, [{ transform: PARADO, transformOrigin: o }, { transform: T3(0, H * 0.8, 0, -18, 0, rz), transformOrigin: o }], { duration: 380, delay: t, easing: QUEDA });
      animarPseudo(alvo, [{ opacity: 1 }, { opacity: 0 }], { duration: 150, delay: t + (dono ? 40 : 80), easing: QUAD_IN });
      fim = Math.max(fim, t + 380);
    });
    return { fim: fim, giro: giro };
  }

  /**
   * O aparelho não dá conta da coreografia (D52, B14): pouca memória, ou uma troca anterior nesta visita
   * que passou de 50 ms por quadro, em média. Daí em diante, as trocas são as curtas.
   */
  var LENTO = "cs-troca-leve";
  function aparelhoLento() {
    if (navigator.deviceMemory && navigator.deviceMemory <= 2) return true;
    try { return sessionStorage.getItem(LENTO) === "1"; } catch (err) { return false; }
  }
  function medirQuadros(vt) {
    var n = 0, primeiro = 0, ultimo = 0, acabou = false;
    function quadro(t) {
      if (!primeiro) primeiro = t;
      ultimo = t;
      n++;
      if (!acabou) requestAnimationFrame(quadro);
    }
    vt.ready.then(function () { requestAnimationFrame(quadro); }, function () {});
    vt.finished.then(function () {
      acabou = true;
      // Aba oculta não conta (o navegador não pinta, e os quadros param).
      if (document.visibilityState !== "visible" || n < 4) return;
      if ((ultimo - primeiro) / (n - 1) > 50) {
        try { sessionStorage.setItem(LENTO, "1"); } catch (err) {}
      }
    });
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
    if (vt && !restaurada) livroSemPar(vt);
    var lenta = montagemAnterior() > MONTAGEM_LENTA;
    if (restaurada) {
      restaurada = false;
      // Rodada 3 (área 7): voltando pelo histórico para uma página guardada no bfcache, a cortina também
      // desce (a página volta como ficou, coberta por ela, e as folhas assentam de novo embaixo).
      if (vt && d && d.tipo === "cortina" && !reduzido.matches) {
        raiz.dataset.chegando = "";
        try { vt.types.add("cortina"); } catch (err) {}
        passarCortina(vt, false, true);
        return;
      }
      if (vt) {
        vt.ready.catch(function () {});
        vt.skipTransition();
      }
      d = null;
    }
    // Quanto esta página levou da resposta à primeira pintura (a próxima troca usa isso).
    if (d) try { sessionStorage.setItem(CHAVE_MONTAGEM, String(Date.now() - d.t)); } catch (err) {}
    if (!d || !vt || reduzido.matches) {
      // Não vai ter troca: quem esperava por ela (o desenho do artigo) segue na hora.
      if (raiz.hasAttribute("data-vai-chegar")) avisarChegada();
      return;
    }
    raiz.dataset.chegando = "";
    try { vt.types.add(d.tipo); } catch (err) {}
    // A chegada curta (D52, B14): a pessoa já esperou mais de 0,7s desde o clique (rede ou aparelho lentos),
    // a troca anterior demorou para montar (revisão 7), ou este aparelho não deu conta da coreografia numa
    // troca anterior (aparelhoLento).
    var curta = Date.now() - (d.clique || d.t) > DEMORA || lenta || aparelhoLento();
    if (curta) {
      try { vt.types.add("curta"); } catch (err) {}
    } else medirQuadros(vt);

    if (d.tipo === "lado") {
      trocarDeLado(vt, d);
      vt.finished.finally(avisarChegada);
      return;
    }
    if (d.tipo === "cortina") {
      passarCortina(vt, curta);
      return;
    }
    if (d.tipo === "livro") {
      // Linha 18: a fileira de cima é a mesma; as luzes dela não acendem de novo (estante-moderna.ts).
      raiz.dataset.chegouPorLivro = "";
      trocarDeLivro(vt, curta);
      return;
    }

    // Os livros: com par, voam (e a folha deles só esmaece); sem par na página nova, chegam com a folha.
    var velhos = {};
    (d.livros || []).forEach(function (l) { velhos[l.n] = l; });
    var volta = voltando();
    var m = document.getElementById("conteudo");
    var propria = m && m.dataset.chegada === "propria" && !volta && !curta;
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
    // O mesmo livro 3D nas duas pontas (o cartão de Categorias e o topo do livro, D52 B10): voa só a imagem
    // nova, que é viva, e o livro continua o giro de onde estava (virado para o leitor pelo hover) até o
    // giro de parado. Antes, a imagem antiga (virada) ficava embaixo da nova (de lado): o livro pulava de
    // ângulo no primeiro quadro e as bordas das duas apareciam juntas no voo.
    var anims = [];
    novosLivros.forEach(function (l) {
      var v = velhos[l.n];
      var g = comPar[l.n] && v && v.g != null ? giroDe(l.el) : null;
      if (g == null) return;
      nomear(l.el, l.n, "livro mesmo");
      if (Math.abs(v.g - g) > 1) anims.push(l.el.querySelector(".livro-3d").animate([{ transform: "rotateY(" + v.g + "deg)" }, { transform: "rotateY(" + g + "deg)" }], { duration: curta ? 350 : 750, easing: "cubic-bezier(0.65, 0, 0.35, 1)", fill: "backwards" }));
    });

    if (propria) {
      // A página anima a chegada dela (Categorias); até o script dela chegar, as folhas esperam escondidas.
      novas.forEach(function (u) { u.el.style.opacity = "0"; });
      var chegada = (window.csChegada = { novas: novas, inicio: performance.now(), t0: CHEGA });
      // Se o script dela (ou o GSAP, que ele carrega sob demanda) não vier em 1,8s, as folhas aparecem paradas.
      setTimeout(function () {
        if (chegada.comecou) return;
        chegada.revelada = true;
        novas.forEach(function (u) { u.el.style.opacity = ""; });
        if (window.csChegada === chegada) window.csChegada = null;
      }, 1800);
    }
    // As folhas novas ficam escondidas desde o primeiro quadro, mas o relógio delas começa junto com a
    // queda das antigas (vt.ready, que pode vir alguns quadros depois deste evento).
    var fimDaChegada = propria ? 0 : chegar(novas, { volta: volta, t0: curta ? 0.06 : VOO, visivel: curta ? 0 : CHEGA, anims: anims, curta: curta });
    anims.forEach(function (a) { if (emCurso.indexOf(a) < 0) emCurso.push(a); });
    var comecou = vt.ready.then(function () {
      anims.forEach(function (a) { a.currentTime = 0; });
    }, function () {});

    vt.ready.then(function () {
      var r = cair(d, comPar, curta);
      // O livro que não tem par cai com a folha dele (na saída curta, só some, pelo CSS).
      (d.livros || []).forEach(function (l) {
        if (curta || comPar[l.n] || l.u < 0) return;
        var g = r.giro["sai-" + l.u];
        if (!g) return;
        var alvo = "::view-transition-old(" + l.n + ")";
        animarPseudo(alvo, [{ transform: PARADO }, { transform: T3(0, innerHeight * 0.8, 0, -18, 0, g.rz) }], { duration: 380, delay: g.t, easing: QUEDA });
        animarPseudo(alvo, [{ opacity: 1 }, { opacity: 0 }], { duration: 150, delay: g.t + 80, easing: QUAD_IN });
      });
    }, function () {});
    // A chegada acabou quando a troca acabou e a última folha nova pousou (o desenho do artigo espera isso).
    var pousou = comecou.then(function () { return new Promise(function (r) { setTimeout(r, fimDaChegada); }); });
    Promise.all([vt.finished.catch(function () {}), pousou]).then(avisarChegada);
  });

  /*
   * As fichas jogadas (rodada 4, A3; o blog de hoje em Tags): numa lista com `data-jogadas` (as fichas de
   * Tags, que ficam fora da troca e caem ao rolar, fichas-caem.ts), as que estão acima da dobra chegam
   * jogadas do alto à direita, por baixo da cortina: cada uma sai de cima e da direita, menor e torta (de
   * 5 a 12°), pousa espalhada perto do lugar dela (até 26px fora e girada até 6°) e se arruma na grade.
   * Só `transform` e `opacity`, no plano (o Chrome rasteriza cada ficha uma vez). A troca as marca com
   * `data-caiu` e `data-jogada`, para a queda (fichas-caem.ts) não passar por cima delas. Devolve quando a
   * última assenta (ms, no relógio da troca); fica de fora na chegada curta e na volta (aí elas caem).
   */
  function jogarFichas(anims, curta, volta) {
    if (curta || volta) return 0;
    var listas = document.querySelectorAll("#conteudo [data-jogadas]");
    if (!listas.length) return 0;
    var H = innerHeight, topo = topoVisivel();
    var fichas = [];
    for (var i = 0; i < listas.length; i++) {
      for (var f = listas[i].firstElementChild; f; f = f.nextElementSibling) {
        if (f.hidden) continue;
        var r = f.getBoundingClientRect();
        if (r.width > 0 && r.bottom > topo + 2 && r.top < H - 40) fichas.push(f);
      }
    }
    return jogar(fichas, { t0: JOGA_T0, anims: anims });
  }
  /**
   * Joga as fichas dadas (o gesto acima; a amostra D3 o usa sem a troca). `opcoes.t0` em ms; as animações
   * vão para `opcoes.anims`, se houver. Devolve quando a última assenta (ms, contando de agora + t0).
   */
  function jogar(fichas, opcoes) {
    opcoes = opcoes || {};
    var anims = opcoes.anims || [];
    var W = innerWidth, H = innerHeight, cel = celular();
    var lista = fichas.map(function (el) { return { el: el, r: el.getBoundingClientRect() }; });
    lista.sort(function (a, b) { return Math.round(a.r.top / 48) - Math.round(b.r.top / 48) || a.r.left - b.r.left; });
    var passo = Math.min(JOGA_PASSO, JOGA_ESPALHA / Math.max(1, lista.length - 1));
    var fim = 0, t0 = opcoes.t0 || 0;
    lista.forEach(function (x, i) {
      var el = x.el;
      el.dataset.caiu = "";
      el.dataset.jogada = "";
      var t = t0 + i * passo;
      var de = cel
        ? "translate(" + Math.round(rnd(10, 40)) + "px, " + Math.round(-H * 0.16 + rnd(-20, 20)) + "px) rotate(" + rnd(-9, -4).toFixed(2) + "deg) scale(0.84)"
        : "translate(" + Math.round(W * 0.12 + rnd(-30, 50)) + "px, " + Math.round(-H * 0.2 + rnd(-40, 30)) + "px) rotate(" + rnd(-12, -5).toFixed(2) + "deg) scale(0.8)";
      var pousa = "translate(" + Math.round(rnd(-26, 26)) + "px, " + Math.round(rnd(-20, 8)) + "px) rotate(" + rnd(-6, 5).toFixed(2) + "deg) scale(0.985)";
      var a = el.animate(
        [
          { transform: de, easing: "cubic-bezier(0.18, 0.7, 0.3, 1)" },
          { transform: pousa, offset: 0.56, easing: "cubic-bezier(0.45, 0, 0.25, 1)" },
          { transform: "none" },
        ],
        { duration: JOGA_DUR, delay: t, fill: "backwards" },
      );
      var o = el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 140, delay: t, easing: SAI_LOGO, fill: "backwards" });
      anims.push(a, o);
      fim = Math.max(fim, t + JOGA_DUR);
    });
    return fim;
  }

  /*
   * A cortina (protótipo 14, G10; rodada 3, área 7: T2, F14-3): a do 01, no azul-tinta escuro no claro e no
   * papel no escuro, com o nome do destino. Os tempos, no relógio da troca (vt.ready = 0):
   * - 0 a 0,38s: entra de baixo por cima da página antiga (a nova fica escondida; a animação é do CSS, em
   *   suave.css), com o nome pequeno no alto desde o começo e o gigante subindo pela máscara, mais devagar
   *   que a folha (a paralaxe), até assentar aos 0,6s;
   * - 0,38 a 0,62s: segura (a cortina de verdade, o mesmo painel já na página nova);
   * - 0,62s: avisa `cs:cortina-saindo` (detalhe: volta, curta, duracao da saída em ms), e sai pelo alto até
   *   0,98s, com o nome subindo um pouco junto;
   * - por baixo dela, a página nova já está montando (rodada 4, A3: as animações do blog de hoje): as
   *   folhas vêm do fundo e da direita, em perspectiva, a partir de 0,45s, ainda cobertas, e pousam até
   *   ~1,55s; em Tags, as fichas de cima chegam jogadas do alto (`jogarFichas`, de 0,36 a ~1,28s); em Livros
   *   (a chegada própria), o desfile do blog de hoje começa aos 0,42s (`window.csChegada.t0`) e assenta até
   *   ~2,7s com quatro cartões à vista (~3,4s com oito).
   * Voltando pelo histórico (também do bfcache, `restaurada`), tudo de cima para baixo. Na chegada curta (a
   * página demorou, B14), ela não segura e as folhas só aparecem.
   */
  function passarCortina(vt, curta, restaurada) {
    var volta = voltando() || !!restaurada;
    var painel = document.querySelector(".cortina-painel");
    var nome = painel && painel.querySelector(".cortina-nome");
    var m = document.getElementById("conteudo");
    raiz.classList.add("cortina");
    if (volta) raiz.classList.add("cortina-volta");
    livrosNomeados().forEach(function (l) { nomear(l.el, "none"); });
    var SAI_EM = curta ? CORTINA_ENTRA : CORTINA_SEGURA;
    var SAI_DUR = curta ? 280 : CORTINA_SAI;
    var anims = [];
    var novas = unidades();
    var propria = m && m.dataset.chegada === "propria" && !volta && !curta;
    var chegada = null;
    if (propria) {
      novas.forEach(function (u) { u.el.style.opacity = "0"; });
      chegada = window.csChegada = { novas: novas, inicio: performance.now(), t0: CORTINA_DESFILE / 1000 };
      setTimeout(function () {
        if (chegada.comecou) return;
        chegada.revelada = true;
        novas.forEach(function (u) { u.el.style.opacity = ""; });
        if (window.csChegada === chegada) window.csChegada = null;
      }, 1800 + SAI_EM);
    }
    var fimDaChegada = propria ? 0 : chegar(novas, {
      volta: volta,
      t0: (curta ? SAI_EM : CORTINA_VOO) / 1000,
      dur: CORTINA_POUSO,
      espalha: CORTINA_ESPALHA / 1000,
      curva: CORTINA_CURVA,
      anims: anims,
      curta: curta,
    });
    if (!propria) fimDaChegada = Math.max(fimDaChegada, jogarFichas(anims, curta, volta));
    // O aviso da saída: uma animação vazia marca o tempo, no relógio das outras (recomeça com elas).
    var aviso = raiz.animate([], { duration: SAI_EM });
    anims.push(aviso);
    aviso.finished.then(function () {
      if (encerrando) return;
      dispatchEvent(new CustomEvent("cs:cortina-saindo", { detail: { volta: volta, curta: curta, duracao: SAI_DUR } }));
    }, function () {});
    var saida = null, sobeNome = null;
    if (painel && painel.animate) {
      saida = painel.animate(
        [{ clipPath: "inset(0 0 0 0)" }, { clipPath: volta ? "inset(100% 0 0 0)" : "inset(0 0 100% 0)" }],
        { duration: SAI_DUR, delay: SAI_EM, easing: "cubic-bezier(0.7, 0, 0.2, 1)", fill: "both" },
      );
      anims.push(saida);
      // Na saída, o nome gigante vai um pouco junto com a folha (a paralaxe da saída): sem preencher antes,
      // para não brigar com a subida dele pela máscara (CSS).
      if (nome && !curta) {
        sobeNome = nome.animate([{ transform: "none" }, { transform: "translateY(" + (volta ? 9 : -9) + "vh)" }], { duration: SAI_DUR, delay: SAI_EM, easing: "cubic-bezier(0.55, 0, 0.35, 1)", fill: "forwards" });
        anims.push(sobeNome);
      }
    }
    emCurso.push.apply(emCurso, anims);
    vt.ready.then(function () {
      anims.forEach(function (a) { a.currentTime = 0; });
      // O desfile de Livros conta do começo da troca, não do pagereveal (com a CPU lenta, ~0,2s antes).
      if (chegada) chegada.inicio = performance.now();
    }, function () {});
    var recolheu = false;
    var recolher = function () {
      if (recolheu) return;
      recolheu = true;
      raiz.classList.remove("cortina", "cortina-volta");
      [saida, sobeNome].forEach(function (a) { if (a) try { a.cancel(); } catch (err) {} });
    };
    if (saida) saida.finished.then(recolher, recolher);
    else vt.finished.then(recolher, recolher);
    setTimeout(recolher, 4000);
    var pousou = vt.ready.then(function () { return new Promise(function (r) { setTimeout(r, Math.max(fimDaChegada, SAI_EM + SAI_DUR)); }); }, function () {});
    Promise.all([vt.finished.catch(function () {}), pousou]).then(avisarChegada);
  }

  /*
   * A troca de livro pela estante do topo (protótipo 14, G7): o livro grande da página antiga volta para o
   * vão dele na estante (classe "vai") e o escolhido sai da estante e cresce até o lugar do grande ("vem"),
   * um pouco depois. Os nomes vêm do script do <head> (Base.astro) e do HTML; aqui só as classes. Depois do
   * pouso, os artigos do livro novo chegam girando (G5).
   */
  function trocarDeLivro(vt, curta) {
    livrosNomeados().forEach(function (l) { nomear(l.el, l.n, l.el.hasAttribute("data-vt") ? "livro vai" : "livro vem"); });
    var anims = [];
    var fim = 900;
    emCurso.push.apply(emCurso, anims);
    vt.ready.then(function () { anims.forEach(function (a) { a.currentTime = 0; }); }, function () {});
    var pousou = vt.ready.then(function () { return new Promise(function (r) { setTimeout(r, fim); }); }, function () {});
    Promise.all([vt.finished.catch(function () {}), pousou]).then(avisarChegada);
  }

  /* Artigo anterior e próximo (protótipo 06, "na pilha"). */
  function trocarDeLado(vt, d) {
    var W = innerWidth;
    var folha = document.querySelector("#conteudo .artigo-principal");
    var lateral = document.querySelector("#conteudo .lateral");
    var sobre = document.querySelector("#conteudo .lateral a.sobre");
    // O mesmo livro, e no mesmo lugar: aí ele fica parado. Em outro lugar (saindo do fim de um artigo, a
    // lateral estava empurrada para cima; ou o post-it de cima tem outra altura), a ficha duplicava e o livro
    // escorregava de uma para a outra: troca como se fosse outro livro (D54).
    var livroNovo = lateral && lateral.querySelector(".livro-em-pe");
    var mesmoLugar = !!livroNovo && d.livroTopo != null && Math.abs(livroNovo.getBoundingClientRect().top - d.livroTopo) <= 2;
    var mesmoLivro = mesmoLugar && !!d.livro && !!sobre && new URL(sobre.href).pathname === d.livro;
    var proximo = d.lado === "proximo";
    // As animações da página nova andam no relógio das imagens (recomeçam no vt.ready, como na troca geral).
    var anims = [];
    if (proximo && folha) nomear(folha, "artigo-novo");
    else if (folha) anims.push(folha.animate([{ opacity: 0.55, transform: "scale(0.99)" }, { opacity: 1, transform: "none" }], { duration: 500, delay: 150, easing: QUART_OUT, fill: "backwards" }));
    // O livro novo vem com a lateral, sem o nome dele: com nome, a imagem dele (viva) não era pintada
    // enquanto a lateral estava na opacidade 0 e aparecia de uma vez; e o velho também não tem mais nome.
    if (lateral) {
      var livrosNovos = lateral.querySelectorAll(".livro-em-pe");
      for (var i = 0; i < livrosNovos.length; i++) {
        var n = getComputedStyle(livrosNovos[i]).viewTransitionName;
        if (n && n !== "none") nomear(livrosNovos[i], "none");
      }
    }
    if (lateral && !mesmoLivro) {
      // Outro livro: a lateral nova só entra quando a antiga está quase fora (0,22s; revisão 9). Antes, em
      // 0,18s, as duas ficavam a ~50% no mesmo lugar.
      anims.push(lateral.animate([{ opacity: 0, transform: "translateX(" + (proximo ? 16 : -16) + "px)" }, { opacity: 1, transform: "none" }], { duration: 400, delay: 220, easing: QUART_OUT, fill: "backwards" }));
    }
    // O desenho do topo começa com a folha quase pousada (revisão 8): no próximo, com ~95% do caminho feito;
    // no anterior, quando a de cima já está saindo. Antes, esperava o fim da troca (cs:chegou, ~0,85s), e o
    // painel ficava um bloco vazio por 0,5s. Uma animação vazia marca o tempo, no relógio das outras.
    if (folha && folha.querySelector("[data-desenhar-topo]")) {
      var pouso = raiz.animate([], { duration: proximo ? 420 : 300 });
      anims.push(pouso);
      pouso.finished.then(function () { dispatchEvent(new CustomEvent("cs:pousou")); }, function () {});
    }
    emCurso.push.apply(emCurso, anims);
    vt.ready.then(function () {
      anims.forEach(function (a) { a.currentTime = 0; });
      if (proximo) {
        // O próximo vem da direita, um pouco torto, e é pousado por cima do atual. O atual vai para baixo da
        // pilha enquanto é coberto: afunda um pouco e some antes de o próximo pousar (D52, A03). Antes, ele
        // ficava inteiro até 0,6s, e o pedaço dele que o próximo não cobre (com a página rolada, o fim do
        // artigo, acima do topo do novo) sumia devagar no fim.
        animarPseudo("::view-transition-new(artigo-novo)", [{ transform: "translate(" + W * 0.55 + "px, 26px) rotate(3.5deg)" }, { transform: "none" }], { duration: 700, delay: 50, easing: QUART_OUT });
        animarPseudo("::view-transition-old(artigo-velho)", [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(10px)" }], { duration: 260, delay: 140, easing: "cubic-bezier(0.33, 0, 0.67, 1)" });
      } else {
        // o anterior: o de cima é tirado para a direita e mostra o que estava embaixo
        animarPseudo("::view-transition-old(artigo-velho)", [{ transform: "none" }, { transform: "translate(" + W * 0.6 + "px, 20px) rotate(4deg)" }], { duration: 600, easing: CUBIC_IN });
      }
      // O rodapé do site (com a página no fim) sai logo, em 90ms (revisão 3): a página nova já está inteira
      // embaixo dele, e com 200ms em ease-in ele ficava nítido sobre o título do artigo novo até ~0,25s.
      animarPseudo("::view-transition-old(rodape-velho)", [{ opacity: 1 }, { opacity: 0 }], { duration: 90, easing: SAI_LOGO });
      // A lateral: o mesmo livro fica parado (a antiga só sai no fim); outro livro troca junto.
      if (mesmoLivro) animarPseudo("::view-transition-old(lateral-velha)", [{ opacity: 1 }, { opacity: 1 }], { duration: 650 });
      else {
        var saiLateral = [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateX(" + (proximo ? -16 : 16) + "px)" }];
        animarPseudo("::view-transition-old(lateral-velha)", saiLateral, { duration: 200, easing: CUBIC_IN });
      }
    }, function () {});
  }

  window.csTroca = { unidades: unidades, chegar: chegar, jogar: jogar };
})();
