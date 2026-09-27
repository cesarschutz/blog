/*
 * O mini-site dos protótipos de animação: todas as telas do blog, as rotas e os controles comuns.
 * Cada protótipo chama SITE.iniciar({...}) com a transição dele. Só protótipo (GSAP pelo CDN).
 *
 * Unidades: tudo o que anima numa troca de tela tem `data-u`:
 *   "ambos"  : uma folha solta (o topo de uma página, a abertura, a lateral), nas duas montagens;
 *   "painel" : o bloco inteiro (título + conteúdo), na montagem "tudo em painel";
 *   "fora"   : o título do bloco (com data-texto) e as folhas dele, na montagem "texto fora".
 */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  /* ================= Peças ================= */
  const icone = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONES_LIVRO[k]}</svg>`;
  const marcaSvg = (cls = "mc") => `<svg class="${cls}" viewBox="0 0 40 52" aria-hidden="true">${MARCA}</svg>`;
  const contar = (k) => POSTS.filter((p) => (k === "java" ? p.serie : p.c === k && !p.serie)).length;
  const nArtigos = (n) => (n === 0 ? "Ainda sem artigos" : `${n} ${n === 1 ? "artigo" : "artigos"}`);
  const estiloLivro = (l) => `--w:${l.w};--h:${l.h};--cor:${l.cor};--tinta:${l.tinta};--dest:${l.dest};--c:${l.cor}`;

  function lombada(l) {
    const n = contar(l.k);
    return `<a class="lombada" href="#" data-ir="livro:${l.k}" data-livro="${l.k}" style="${estiloLivro(l)}" aria-label="${esc(l.nome)}">
      <div class="lb-cima">${icone(l.k)}</div>
      <div class="lb-baixo"><span class="lb-titulo">${l.linhas.join("<br>")}</span>${n ? `<span class="lb-num">${n}</span>` : "<span></span>"}</div>
    </a>`;
  }
  function estante(pequena = false) {
    return `<div class="prateleira">
      <div class="estante${pequena ? " pequena" : ""}">
        ${LIVROS.map(lombada).join("")}
        <div class="aparador"></div>
        <a class="revista" href="#" data-ir="serie" data-livro="java" style="--w:36;--h:98" aria-label="Atualizações do Java">
          <svg class="rv-icone" viewBox="0 0 24 24">${ICONES_LIVRO.java}</svg>
          <span class="rv-titulo">Atualizações <i>do Java</i></span>
          <span class="lb-num">${contar("java")}</span>
        </a>
      </div>
      <div class="tabua"></div>
    </div>`;
  }
  function livro3d(k, lw) {
    const l = livro(k);
    return `<div class="livro" data-livro="${k}" style="${estiloLivro(l)};--lw:${lw}px" aria-hidden="true">
      <div class="livro-corpo">
        <div class="face miolo-fundo"></div>
        <div class="face miolo"><i>${l.nome}</i><i></i><i></i><i></i><i></i><i></i></div>
        <div class="capa-pos"><div class="capa">
          <div class="capa-frente">
            <div class="capa-cima"><div class="capa-rotulos"><span>VOLUME ${l.vol}</span><span>CESAR SCHUTZ</span></div><strong class="capa-titulo">${l.nome}</strong></div>
            <div class="capa-baixo"><em class="capa-frase">${l.frase}</em>${icone(k)}</div>
            <div class="capa-pe">BLOG.CESARSCHUTZ.COM.BR</div>
          </div>
          <div class="capa-dentro"></div>
        </div></div>
        <div class="face lombada3d"><div class="l-topo">${icone(k)}</div><div class="l-titulo">${l.nome}</div><div class="l-num">${contar(k) || ""}</div></div>
      </div>
    </div>`;
  }
  const revistaCapa = (rw = 150) => `<div class="revista-capa" data-livro="java" style="--rw:${rw}px"><small>EDIÇÃO 29</small><b>Atualizações <i>do Java</i></b><svg viewBox="0 0 24 24">${ICONES_LIVRO.java}</svg></div>`;
  function pilhaDeitada(atual) {
    return [...LIVROS].reverse().filter((l) => l.k !== atual).map((l) =>
      `<a class="lombada-deitada" href="#" data-ir="livro:${l.k}" data-livro="${l.k}" style="${estiloLivro(l)}"><span class="l-icone">${icone(l.k)}</span><span>${l.nome}</span><span>${contar(l.k) || ""}</span></a>`).join("");
  }

  const chip = (p) => p.serie
    ? `<a class="chip" href="#" data-ir="serie" style="--c:${SERIE.cor}"><i></i>${SERIE.nome}</a>`
    : `<a class="chip" href="#" data-ir="livro:${p.c}" style="--c:${livro(p.c).cor}"><i></i>${livro(p.c).nome}</a>`;
  const tagsDe = (p) => p.tags.map((t) => `<a class="tag" href="#" data-ir="tag:${esc(t)}">#${esc(t)}</a>`).join("");
  const itemLista = (p) => `
    <li class="item" data-artigo="${p.id}" style="--c:${corDoPost(p)}">
      <div class="item-texto">
        <p class="meta">${chip(p)}<span>${p.dt}</span><span>${p.min} min</span></p>
        <h3><a href="#" data-ir="artigo:${p.id}">${p.t}</a></h3>
        <p class="sub">${p.s}</p>
        <p class="resumo">${p.r}</p>
        <div class="tags">${tagsDe(p)}</div>
      </div>
      <a class="miniatura painel" href="#" data-ir="artigo:${p.id}" tabindex="-1" aria-hidden="true" data-desenho="${p.id}">${svgDesenho(p.d)}</a>
    </li>`;
  const card = (p, u = "fora") => `
    <li class="folha card" data-u="${u}" data-artigo="${p.id}" style="--c:${corDoPost(p)}">
      <a class="painel" href="#" data-ir="artigo:${p.id}" tabindex="-1" aria-hidden="true" data-desenho="${p.id}">${svgDesenho(p.d)}</a>
      <p class="meta">${chip(p)}<span>${p.dt}</span></p>
      <h3><a href="#" data-ir="artigo:${p.id}">${p.t}</a></h3>
      <p>${p.s}</p>
    </li>`;
  /** Um bloco: título (fora do painel ou dentro dele, conforme a montagem) e o conteúdo. */
  const bloco = ({ titulo, sub, acoes = "", corpo, classe = "" }) => `
    <section class="bloco ${classe}" data-u="painel">
      ${titulo ? `<header class="bloco-cab" data-u="fora" data-texto><div><h2 class="h-sec">${titulo}</h2>${sub ? `<p class="sub-sec">${sub}</p>` : ""}</div>${acoes}</header>` : ""}
      <div class="bloco-corpo">${corpo}</div>
    </section>`;
  const seletor = () => `<div class="seletor" aria-hidden="true"><span class="ativo">Lista</span><span>Cards</span></div>`;
  const rodape = () => `<footer class="rodape"><div><b>Cesar Schutz</b> <i>blog</i><br>O que eu estudo virando artigo.</div><div>Artigos · Categorias · Séries · Tags · RSS</div></footer>`;

  /* ================= Telas ================= */
  const TEXTO = (p) => `
    <p>Este é um texto de exemplo, só para dar corpo à folha. ${p.r} O que importa aqui é como a página chega e como ela sai, não o assunto.</p>
    <p>Cada seção começa com um parágrafo curto, depois vem o código testado e, no fim, as fontes. A coluna tem a largura de leitura do site, em Literata.</p>
    <h2>Primeiro exemplo</h2>
    <p>O leitor que chegou pela lista quer continuar lendo sem perder o lugar. Por isso a troca é curta e o cabeçalho não se mexe.</p>
    <pre>@Bean
ObjectMapper logMapper() {
  return JsonMapper.builder()
      .addMixIn(Object.class, Mascara.class)
      .build();
}</pre>
    <p>Mais um parágrafo para a folha ficar longa. Role até o fim para usar "anterior / próximo".</p>
    <h2>Quando não usar</h2>
    <p>Toda escolha tem custo. Aqui o custo é pequeno, mas a regra do blog vale: nada sem fonte, nada sem teste.</p>`;

  const TELAS = {
    home(pag) {
      const n = Number(pag || 1);
      const lista = POSTS.filter((p) => p.id !== "jackson");
      const itens = lista.slice((n - 1) * 6, n * 6);
      const d = post("jackson");
      return `<div class="conteudo">
        ${n === 1 ? `<section class="folha abertura-home" data-u="ambos">
          <div class="identidade">
            <div class="topo-id">${marcaSvg("mc marca-grande")}<h1 class="nome" tabindex="-1"><span class="linha">Cesar</span><span class="linha">Schutz <i>blog</i></span></h1></div>
            <p class="frase">Publico aqui o que ando estudando — lançamento do Java, código, arquitetura, IA, o que me despertar interesse. Quando o estudo rende algo que vale guardar, vira&#160;artigo.</p>
          </div>
          ${estante()}
        </section>
        ${bloco({ titulo: "Em destaque", classe: "bloco-destaque", corpo: `
          <article class="folha destaque" data-u="fora" data-artigo="${d.id}" style="--c:${corDoPost(d)}">
            <a class="painel" href="#" data-ir="artigo:${d.id}" data-desenho="${d.id}" tabindex="-1" aria-hidden="true">${svgDesenho(d.d)}</a>
            <div class="dest-texto">
              <p class="meta">${chip(d)}<span>${d.dt}</span><span>${d.min} min de leitura</span></p>
              <h2 class="dest-titulo"><a href="#" data-ir="artigo:${d.id}">${d.t}</a></h2>
              <p class="dest-sub">${d.s}</p>
              <p class="dest-resumo">${d.r}</p>
            </div>
          </article>` })}` : `<h1 class="h-pagina" tabindex="-1" data-u="ambos" data-texto>Artigos recentes · página ${n}</h1>`}
        ${bloco({ titulo: "Artigos recentes", sub: `${POSTS.length} artigos publicados`, acoes: seletor(), corpo: `<ol class="lista folha" data-u="fora">${itens.map(itemLista).join("")}</ol>` })}
        <nav class="paginacao" data-u="ambos" data-texto>${n > 1 ? `<a href="#" data-ir="home${n - 1 > 1 ? ":" + (n - 1) : ""}">‹ Anteriores</a>` : `<span class="vazio">‹</span>`}<span>Página ${n} de 3</span>${n < 3 ? `<a href="#" data-ir="home:${n + 1}">Mais artigos ›</a>` : `<span class="vazio">›</span>`}</nav>
      </div>`;
    },
    artigos() {
      const anos = [2026, 2025];
      return `<div class="conteudo">
        <section class="folha topo-pagina" data-u="ambos">
          <div><h1 class="h-pagina" tabindex="-1">Todos os artigos</h1><p class="intro">${POSTS.length} artigos em 8 livros e 1 série, do mais recente ao mais antigo.</p></div>
          <div style="width:min(360px, 42cqi)">${estante(true)}</div>
        </section>
        ${anos.map((a) => {
          const doAno = POSTS.filter((p) => p.ano === a);
          return bloco({ titulo: String(a), sub: `${doAno.length} artigos`, acoes: a === 2026 ? seletor() : "", corpo: `<ol class="lista folha" data-u="fora">${doAno.map(itemLista).join("")}</ol>` });
        }).join("")}
      </div>`;
    },
    categorias() {
      return `<div class="conteudo">
        <section class="folha topo-pagina" data-u="ambos"><div><h1 class="h-pagina" tabindex="-1">Categorias</h1><p class="intro">Cada categoria é um livro da coleção. Abra um para ver os artigos dele.</p></div></section>
        ${bloco({ corpo: `<ul class="grade-livros">${LIVROS.map((l) => `
          <li class="folha cartao-livro" data-u="fora" data-cartao="${l.k}" style="--c:${l.cor}">
            <a class="painel" href="#" data-ir="livro:${l.k}" tabindex="-1" aria-hidden="true">${livro3d(l.k, 138)}</a>
            <p class="vol">Volume ${l.vol}</p>
            <h2><a href="#" data-ir="livro:${l.k}">${l.nome}</a></h2>
            <p class="desc">${l.desc}</p>
            <p class="meta"><span class="quadrado"></span>${nArtigos(contar(l.k))}</p>
          </li>`).join("")}</ul>`, classe: "bloco-grade" })}
      </div>`;
    },
    livro(k) {
      const l = livro(k) || LIVROS[0];
      const lista = POSTS.filter((p) => p.c === l.k && !p.serie);
      return `<div class="conteudo grade-lateral">
        <aside class="lateral"><div class="folha pilha-folha" data-u="ambos"><h2>Categorias</h2><div class="pilha">${pilhaDeitada(l.k)}</div><span class="rss">Assinar via RSS</span></div></aside>
        <div class="principal">
          <section class="folha topo-livro" data-u="ambos" style="--c:${l.cor}">
            <div class="painel topo-livro-painel" data-topo-livro="${l.k}">${livro3d(l.k, 180)}</div>
            <div class="topo-livro-texto">
              <p class="trilha"><a href="#" data-ir="categorias">Categorias</a></p>
              <h1 tabindex="-1">${l.nome}</h1>
              <p class="desc">${l.desc}</p>
              <p class="meta"><span class="quadrado"></span>${nArtigos(lista.length)} · o último em 2026</p>
            </div>
          </section>
          ${lista.length ? bloco({ titulo: "Artigos", sub: nArtigos(lista.length), acoes: seletor(), corpo: `<ol class="lista folha" data-u="fora">${lista.map(itemLista).join("")}</ol>` })
            : bloco({ corpo: `<div class="folha" data-u="fora" style="padding:22px 26px;font:16px var(--f-ui);color:var(--ink-2)">Este livro ainda não tem artigos.</div>` })}
        </div>
      </div>`;
    },
    series() {
      return `<div class="conteudo">
        <section class="folha topo-pagina" data-u="ambos"><div><h1 class="h-pagina" tabindex="-1">Séries</h1><p class="intro">Assuntos que pedem mais de um artigo, para ler em ordem.</p></div></section>
        <section class="folha serie-larga" data-u="ambos">
          <a class="painel" href="#" data-ir="serie" tabindex="-1" aria-hidden="true" style="--c:${SERIE.cor}">${revistaCapa(170)}</a>
          <div><p class="meta"><span class="quadrado" style="--c:${SERIE.cor}"></span>${contar("java")} edições</p><h2>${SERIE.nome}</h2><p>${SERIE.desc}</p><a href="#" data-ir="serie" style="font:500 15px var(--f-ui)">Ler a série →</a></div>
        </section>
      </div>`;
    },
    serie() {
      const eds = POSTS.filter((p) => p.serie);
      return `<div class="conteudo">
        <section class="folha serie-larga" data-u="ambos">
          <div class="painel" style="--c:${SERIE.cor}" data-topo-livro="java">${revistaCapa(180)}</div>
          <div><p class="meta"><a href="#" data-ir="series" style="color:var(--ink-2)">Séries</a></p><h1 class="h-pagina" tabindex="-1">${SERIE.nome}</h1><p>${SERIE.desc}</p></div>
        </section>
        ${bloco({ titulo: "Ordem de leitura", sub: `${eds.length} edições`, corpo: `<ol class="edicoes folha" data-u="fora">${eds.map((p, i) => `<li><span class="n">${String(i + 1).padStart(2, "0")}</span><div><a href="#" data-ir="artigo:${p.id}">${p.t}</a><small>${p.s}</small></div><span class="d">${p.dt}</span></li>`).join("")}</ol>` })}
      </div>`;
    },
    tags() {
      return `<div class="conteudo">
        <section class="folha topo-pagina" data-u="ambos"><div><h1 class="h-pagina" tabindex="-1">Tags</h1><p class="intro">${TAGS.length} assuntos que atravessam os livros.</p></div></section>
        ${bloco({ titulo: "Todas as tags", corpo: `<div class="nuvem" data-u="fora">${TAGS.map((t) => `<a class="pilula-tag" href="#" data-ir="tag:${esc(t.nome)}">#${esc(t.nome)} <small>${t.ids.length}</small></a>`).join("")}</div>` })}
        ${bloco({ titulo: "Artigos por tag", corpo: `<div class="grupo-tags">${TAGS.slice(0, 6).map((t) => `
          <section class="folha cartao-tag" data-u="fora">
            <h2><a href="#" data-ir="tag:${esc(t.nome)}">#${esc(t.nome)}</a><small>${t.ids.length}</small></h2>
            <ul>${t.ids.slice(0, 4).map((id) => { const p = post(id); return `<li><a href="#" data-ir="artigo:${p.id}" style="--c:${corDoPost(p)}"><i></i>${p.t}</a></li>`; }).join("")}</ul>
          </section>`).join("")}</div>` })}
      </div>`;
    },
    tag(nome) {
      const t = TAGS.find((x) => x.nome === nome) || TAGS[0];
      const ps = t.ids.map(post);
      return `<div class="conteudo">
        <section class="folha topo-tag" data-u="ambos">
          <p class="trilha"><a href="#" data-ir="tags">Tags</a></p>
          <h1 tabindex="-1"><span>#</span>${esc(t.nome)}</h1>
          <p class="intro">${nArtigos(ps.length)} com esta tag, em ${new Set(ps.map((p) => p.serie ? "java" : p.c)).size} livros.</p>
        </section>
        ${bloco({ titulo: "Artigos", sub: nArtigos(ps.length), acoes: `<div class="seletor" aria-hidden="true"><span>Lista</span><span class="ativo">Cards</span></div>`, corpo: `<ul class="cards">${ps.map((p) => card(p)).join("")}</ul>` })}
      </div>`;
    },
    artigo(id) {
      const p = post(id), i = POSTS.indexOf(p);
      const ant = POSTS[i + 1], prox = POSTS[i - 1];
      const l = p.serie ? null : livro(p.c);
      return `<div class="conteudo grade-artigo" style="--c:${corDoPost(p)}">
        <aside class="lateral">
          <nav class="folha sumario" data-u="ambos" aria-label="Neste artigo"><h2>Neste artigo</h2><ol><li>Primeiro exemplo</li><li>Juntando tudo</li><li>Quando não usar</li><li>Fontes</li></ol><div class="progresso"><span>0% lido</span><span>faltam ${p.min} min</span></div></nav>
          <div class="folha do-livro" data-u="ambos">
            ${l ? `<a class="painel livro-painel" href="#" data-ir="livro:${l.k}" style="--c:${l.cor}" data-lateral-livro="${l.k}">${livro3d(l.k, 110)}</a>
            <p class="rot">Do livro</p><p class="nome-livro">${l.nome}</p><a class="ver" href="#" data-ir="livro:${l.k}">Ver o livro →</a>`
            : `<a class="painel livro-painel" href="#" data-ir="serie" style="--c:${SERIE.cor}" data-lateral-livro="java">${revistaCapa(120)}</a><p class="rot">Da série</p><p class="nome-livro">${SERIE.nome}</p><a class="ver" href="#" data-ir="serie">Ver a série →</a>`}
          </div>
        </aside>
        <div class="principal">
          <article class="folha corpo-artigo" data-u="ambos" data-artigo="${p.id}">
            <div class="topo-desenho painel" data-desenho="${p.id}" data-topo-desenho>${svgDesenho(p.d)}</div>
            <div class="cab-artigo">
              <p class="trilha-artigo"><a href="#" data-ir="${p.serie ? "series" : "artigos"}">${p.serie ? "Séries" : "Artigos"}</a><span aria-hidden="true">›</span>${chip(p)}</p>
              <h1 tabindex="-1">${p.t}</h1>
              <p class="sub">${p.s}</p>
              <p class="lead">${p.r}</p>
              <p class="meta"><span>Cesar Schutz</span><span>${p.dt}</span><span>${p.min} min de leitura</span></p>
            </div>
            <div class="texto">${TEXTO(p)}</div>
            <nav class="vizinhos" aria-label="Outros artigos">
              ${ant ? `<a href="#" data-ir="artigo:${ant.id}" data-vizinho="anterior"><span class="rot">‹ Artigo anterior</span><b>${ant.t}</b></a>` : "<span></span>"}
              ${prox ? `<a class="prox" href="#" data-ir="artigo:${prox.id}" data-vizinho="proximo"><span class="rot">Próximo artigo ›</span><b>${prox.t}</b></a>` : ""}
            </nav>
          </article>
        </div>
      </div>`;
    },
  };
  const NOMES = { home: "Home", artigos: "Artigos", categorias: "Categorias", livro: "Livro", series: "Séries", serie: "Série", tags: "Tags", tag: "Tag", artigo: "Artigo" };
  const SECAO = { artigos: "artigos", categorias: "categorias", livro: "categorias", series: "series", serie: "series", tags: "tags", tag: "tags" };
  /** Profundidade de cada tela: entrar, voltar ou ir para o lado. */
  const NIVEL = { home: 0, artigos: 1, categorias: 1, series: 1, tags: 1, livro: 2, serie: 2, tag: 2, artigo: 3 };

  /* ================= O esqueleto da página do protótipo ================= */
  const TRACO_D = "M1 4.3C16 3.2 34 5 50 4.1S82 3.4 99 4.4";
  function montarJanela(cfg) {
    document.body.insertAdjacentHTML("beforeend", `
    <div class="demo">
      <section class="ficha-ideia">${cfg.ficha || ""}</section>
      <div class="controles" id="controles"></div>
      <p class="legenda" id="legenda" aria-live="polite">${cfg.legenda || "Clique nos links do mini-site ou nos botões acima."}</p>
      <div class="janela" id="janela">
        <header class="site-topo">
          <a class="marca" href="#" data-ir="home" aria-label="Cesar Schutz, blog: início">${marcaSvg()}<b>Cesar Schutz</b><i>blog</i></a>
          <nav class="site-nav" aria-label="Seções">
            <a href="#" data-ir="artigos" data-sec="artigos">Artigos</a><a href="#" data-ir="categorias" data-sec="categorias">Categorias</a><a href="#" data-ir="series" data-sec="series">Séries</a><a href="#" data-ir="tags" data-sec="tags">Tags</a>
            <svg class="traco-nav" viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden="true"><path d="${TRACO_D}"/></svg>
          </nav>
          <span class="busca-falsa" aria-hidden="true"><svg class="ico" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/></svg><span>Buscar</span><kbd>⌘K</kbd></span>
          <span class="redondo" aria-hidden="true"><svg class="ico" viewBox="0 0 24 24"><path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/></svg></span>
          <span class="redondo menu-cel" aria-hidden="true"><svg class="ico" viewBox="0 0 24 24"><path d="M5 8h14M5 16h14"/></svg></span>
        </header>
        <div class="palco" id="palco"><div class="voo" id="voo"></div></div>
      </div>
    </div>`);
  }

  /* ================= Estado, rotas e troca ================= */
  const S = { atual: null, emCurso: null, historico: [], simulaReduz: false, variante: null, montagem: "fora", cfg: null };
  const mqReduz = matchMedia("(prefers-reduced-motion: reduce)");
  const reduzido = () => S.simulaReduz || mqReduz.matches;
  let palco, janela, voo, legenda;
  const celular = () => janela.clientWidth < 700;
  const dizer = (html) => { legenda.innerHTML = html; };

  function lerRota(rota) { const i = rota.indexOf(":"); return i < 0 ? { tipo: rota, id: "", rota } : { tipo: rota.slice(0, i), id: rota.slice(i + 1), rota }; }
  function criarPagina(rota) {
    const r = lerRota(rota), el = document.createElement("div");
    el.className = `pagina pg-${r.tipo} entrando`;
    el.dataset.rota = rota;
    el.innerHTML = TELAS[r.tipo](r.id) + rodape();
    return el;
  }
  /** Retângulo de um elemento nas coordenadas do palco (com as transformações de agora). */
  function caixa(el) {
    const r = el.getBoundingClientRect(), p = palco.getBoundingClientRect();
    const x = r.left - p.left, y = r.top - p.top;
    return { x, y, w: r.width, h: r.height, cx: x + r.width / 2, cy: y + r.height / 2 };
  }
  const naTela = (el) => { const r = caixa(el); return r.w > 0 && r.y + r.h > 4 && r.y < palco.clientHeight - 4; };
  /** As unidades de uma página que estão à vista, na ordem de leitura (de cima para baixo, da esquerda para a direita). */
  function unidades(pg, todas = false) {
    const sel = S.montagem === "painel" ? '[data-u="painel"],[data-u="ambos"]' : '[data-u="fora"],[data-u="ambos"]';
    const us = $$(sel, pg).filter((el) => !el.parentElement.closest(sel));
    const vis = todas ? us : us.filter(naTela);
    return vis.sort((a, b) => { const ra = caixa(a), rb = caixa(b); return Math.abs(ra.y - rb.y) > 30 ? ra.y - rb.y : ra.x - rb.x; });
  }
  function sentido(de, para, voltando) {
    if (voltando) return "volta";
    if (de.tipo === para.tipo && (de.tipo === "artigo" || de.tipo === "home")) {
      const a = de.tipo === "artigo" ? POSTS.findIndex((p) => p.id === de.id) : Number(de.id || 1);
      const b = para.tipo === "artigo" ? POSTS.findIndex((p) => p.id === para.id) : Number(para.id || 1);
      return de.tipo === "artigo" ? (b < a ? "frente" : "tras") : b > a ? "frente" : "tras";
    }
    return NIVEL[para.tipo] < NIVEL[de.tipo] ? "volta" : "abre";
  }

  /* o traço de caneta do menu: desliza até a seção da tela nova (ou some, fora do menu) */
  function marcarNav(tipo, animar) {
    const sec = SECAO[tipo];
    const nav = $(".site-nav"), traco = $(".traco-nav");
    let alvo = null;
    $$(".site-nav a").forEach((a) => {
      const ativo = a.dataset.sec === sec;
      if (ativo) { a.setAttribute("aria-current", "page"); alvo = a; } else a.removeAttribute("aria-current");
    });
    if (!nav.offsetParent) return;
    const rn = nav.getBoundingClientRect();
    const d = reduzido() || !animar ? 0 : 0.42;
    if (alvo) {
      const ra = alvo.getBoundingClientRect();
      const x = ra.left - rn.left - 2, w = ra.width + 4;
      if (Number(gsap.getProperty(traco, "opacity")) === 0 || !traco.style.width) {
        gsap.set(traco, { x, width: w, opacity: 1, clipPath: "inset(0 100% 0 0)" });
        gsap.to(traco, { clipPath: "inset(0 0% 0 0)", duration: d ? 0.38 : 0, ease: "power2.out" });
      } else gsap.to(traco, { x, width: w, opacity: 1, clipPath: "inset(0 0% 0 0)", duration: d, ease: "power2.inOut" });
    } else if (traco.style.width) {
      gsap.to(traco, { clipPath: "inset(0 0 0 100%)", duration: d ? 0.2 : 0, ease: "power2.in", onComplete: () => gsap.set(traco, { opacity: 0, clearProps: "width" }) });
    }
  }

  function navegar(rota, origem, { voltando = false } = {}) {
    if (S.emCurso) S.emCurso.progress(1);
    if (S.atual && rota === S.atual.rota) return;
    const de = S.atual;
    const nova = criarPagina(rota);
    nova.style.zIndex = 1;
    palco.insertBefore(nova, voo);
    const para = { ...lerRota(rota), el: nova };
    marcarNav(para.tipo, !!de);
    if (de && !voltando) S.historico.push(de.rota);
    S.atual = para;
    const fim = () => {
      if (de) de.el.remove();
      nova.classList.remove("entrando");
      nova.style.zIndex = "";
      gsap.set(nova, { clearProps: "all" });
      $$("[data-u], [data-u] *", nova).forEach((el) => { if (el._gsap) gsap.set(el, { clearProps: "transform,opacity,visibility,clipPath,filter,zIndex,transformOrigin" }); });
      voo.innerHTML = "";
      S.emCurso = null;
      const h1 = nova.querySelector("h1");
      if (h1 && de) h1.focus({ preventScroll: true });
      S.cfg.depois?.({ de, para });
    };
    if (!de) { fim(); return; }
    if (reduzido()) { fim(); dizer(`<b>${NOMES[de.tipo]} → ${NOMES[para.tipo]}</b>: movimento reduzido, a tela só troca.`); return; }
    de.el.style.zIndex = 2;
    nova.classList.remove("entrando");
    const ctx = {
      de, para, origem, voltando,
      sentido: sentido(de, para, voltando),
      variante: S.variante, montagem: S.montagem,
      velhas: unidades(de.el), novas: unidades(nova),
      celular: celular(), W: palco.clientWidth, H: palco.clientHeight,
    };
    const tl = S.cfg.transicao(ctx) || gsap.timeline();
    tl.eventCallback("onComplete", fim);
    S.emCurso = tl;
  }

  /** Troca de tela sem animação (entrar no site, recarregar). */
  function irDireto(rota) {
    if (S.emCurso) S.emCurso.progress(1);
    $$(".pagina", palco).forEach((el) => el.remove());
    const nova = criarPagina(rota);
    nova.classList.remove("entrando");
    palco.insertBefore(nova, voo);
    S.atual = { ...lerRota(rota), el: nova };
    S.historico.length = 0;
    marcarNav(S.atual.tipo, false);
    return nova;
  }

  /* ================= Controles ================= */
  function montarControles(cfg) {
    const c = $("#controles");
    const linha1 = `<div class="linha"><span class="rot">Ir para</span>${cfg.telas.map(([rot], i) => `<button class="botao" type="button" data-atalho="${i}">${rot}</button>`).join("")}<button class="botao" type="button" data-voltar>← Voltar</button></div>`;
    const variantes = (cfg.variantes || []).map((g, gi) => `<div class="linha" data-grupo="${gi}"><span class="rot">${g.rotulo}</span>${g.opcoes.map((o) => `<button class="botao variante" type="button" data-var="${o.id}" aria-pressed="${o.id === g.padrao}" title="${esc(o.dica || "")}">${o.nome}</button>`).join("")}</div>`).join("");
    const montagem = cfg.montagem ? `<span class="rot">Montagem</span><button class="botao variante" type="button" data-montagem="fora" aria-pressed="true">Texto fora</button><button class="botao variante" type="button" data-montagem="painel" aria-pressed="false">Tudo em painel</button><span class="sep"></span>` : "";
    const extras = (cfg.extras || []).map((e, i) => `<button class="botao" type="button" data-extra="${i}">${e[0]}</button>`).join("");
    c.innerHTML = `${linha1}${variantes}<div class="linha">${montagem}${extras}${extras ? '<span class="sep"></span>' : ""}<button class="botao" type="button" id="lenta" aria-pressed="false">Câmera lenta</button><button class="botao" type="button" id="cel" aria-pressed="false">Celular</button><button class="botao" type="button" id="tema" aria-pressed="false">Tema escuro</button><button class="botao" type="button" id="reduz" aria-pressed="false">Movimento reduzido</button></div>`;
    (cfg.variantes || []).forEach((g) => { if (g.principal !== false && !S.variante) S.variante = g.padrao; });
    c.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.hasAttribute("data-voltar")) { const r = S.historico.pop(); if (r) navegar(r, null, { voltando: true }); return; }
      if (b.dataset.atalho) { const alvo = cfg.telas[b.dataset.atalho][1]; navegar(typeof alvo === "function" ? alvo() : alvo, null); return; }
      if (b.dataset.var) {
        const grupo = b.closest("[data-grupo]"), g = cfg.variantes[grupo.dataset.grupo];
        $$("button", grupo).forEach((x) => x.setAttribute("aria-pressed", x === b));
        if (g.principal === false) g.aoMudar?.(b.dataset.var); else S.variante = b.dataset.var;
        const o = g.opcoes.find((x) => x.id === b.dataset.var);
        if (o?.dica) dizer(`<b>${o.nome}</b>: ${o.dica}`);
        return;
      }
      if (b.dataset.montagem) {
        S.montagem = b.dataset.montagem;
        $$("[data-montagem]", c).forEach((x) => x.setAttribute("aria-pressed", x === b));
        janela.classList.toggle("em-painel", S.montagem === "painel");
        dizer(S.montagem === "painel" ? "<b>Tudo em painel</b>: cada bloco (título, seletor e lista) é uma folha; é ela que entra e sai inteira." : "<b>Texto fora</b>: os títulos ficam soltos na mesa, como hoje; entram e saem de outro jeito que as folhas.");
        return;
      }
      if (b.dataset.extra) { cfg.extras[b.dataset.extra][1](); return; }
      if (b.id === "lenta") { const on = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", on); gsap.globalTimeline.timeScale(on ? 0.25 : 1); }
      if (b.id === "reduz") { S.simulaReduz = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", S.simulaReduz); }
      if (b.id === "tema") { const on = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", on); document.documentElement.dataset.theme = on ? "dark" : "light"; }
      if (b.id === "cel") { const on = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", on); janela.classList.toggle("celular", on); setTimeout(() => marcarNav(S.atual?.tipo, false), 400); }
    });
    if (mqReduz.matches) { const r = $("#reduz"); r.setAttribute("aria-pressed", "true"); r.disabled = true; r.title = "O sistema já pede movimento reduzido"; }
  }

  /* ================= Início ================= */
  function iniciar(cfg) {
    S.cfg = cfg;
    montarJanela(cfg);
    palco = $("#palco"); janela = $("#janela"); voo = $("#voo"); legenda = $("#legenda");
    montarControles(cfg);
    document.addEventListener("click", (e) => {
      const a = e.target.closest("[data-ir]");
      if (!a || !janela.contains(a)) return;
      e.preventDefault();
      if (S.cfg.bloqueado?.()) return;
      navegar(a.dataset.ir, a);
    });
    document.fonts.ready.then(() => {
      navegar(cfg.inicial || "home");
      cfg.aoIniciar?.();
    });
  }

  window.SITE = {
    iniciar, navegar, irDireto, unidades, caixa, naTela, dizer, reduzido, celular, lerRota, criarPagina, marcarNav,
    pecas: { livro3d, lombada, estante, revistaCapa, marcaSvg, icone, svgDesenho: (id) => svgDesenho(post(id).d) },
    get palco() { return palco; }, get janela() { return janela; }, get voo() { return voo; },
    get atual() { return S.atual; }, get variante() { return S.variante; }, get montagem() { return S.montagem; },
    set bloqueio(fn) { S.cfg.bloqueado = fn; },
    NOMES, NIVEL,
  };
})();
