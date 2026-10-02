/**
 * A Pré-Visualização (C7): o post como PDF, em páginas brancas com sombra numa mesa cinza, com as miniaturas
 * das páginas na barra lateral, à esquerda (como no Mac; o Cesar gostou do protótipo 14), o zoom e "Página N
 * de M". Uma janela por documento: abrir o mesmo post de novo traz a janela dele à frente.
 *
 * A primeira página traz o livro (a foto deitada), o título, o subtítulo, a data e a imagem do post; as outras,
 * o texto em tipografia de livro (Literata), com o cabeçalho corrido e o número da página. O texto vem de
 * /mac/pdf/<slug>.json (o Markdown em blocos, sem os componentes), buscado ao abrir. A paginação mede: cada
 * bloco entra na página enquanto cabe; o que não cabe é partido (parágrafo por palavras, lista por itens,
 * código por linhas, tabela por linhas) ou passa para a próxima, levando junto um título que ficaria
 * sozinho no pé. Tudo dentro da página é medido pela largura dela (cqi): a mesma paginação vale em qualquer
 * zoom, ao redimensionar a janela e nas miniaturas, que são cópias das páginas (a paginação é a do 14).
 *
 * O papel usa as cores do tema claro do blog (`papel`, de /mac/dados.json): impresso, não muda com o tema.
 */
import cssDaPrevia from "../estilos/previa.css?inline";
import type { App, Janela, Menu, Sistema } from "../contexto";
import { desenhoDoPost, escapar, fotoDoLivro, indexar, url, type DadosM, type LivroM, type PostM } from "../dados";
import { glifo } from "../icones";

type Bloco =
  | { t: "h2" | "h3" | "p" | "citacao"; html: string }
  | { t: "aviso"; tipo: string; html: string }
  | { t: "ul" | "ol"; itens: string[]; inicio?: number }
  | { t: "codigo"; linhas: string[]; titulo?: string; lingua?: string }
  | { t: "tabela"; cabeca: string[]; linhas: string[][] };

const ZOOMS = [0.6, 0.75, 1, 1.25, 1.5, 2];

const textos = new Map<string, Promise<Bloco[]>>();
function buscarBlocos(slug: string): Promise<Bloco[]> {
  let p = textos.get(slug);
  if (!p) {
    p = (async () => {
      const r = await fetch(url(`/mac/pdf/${encodeURIComponent(slug)}.json`));
      if (!r.ok) throw new Error(`/mac/pdf/${slug}.json: ${r.status}`);
      const d = (await r.json()) as { blocos: Bloco[] };
      return d.blocos;
    })();
    p.catch(() => textos.delete(slug));
    textos.set(slug, p);
  }
  return p;
}

export function criar(s: Sistema): App {
  s.estilo("previa", cssDaPrevia);
  const documentos = new Map<string, Documento>();
  let ultimo: Documento | undefined;

  const daFrente = () => [...documentos.values()].find((d) => d.janela.el.hasAttribute("data-ativa")) ?? ultimo;

  const app: App = {
    id: "previa",
    nome: "Pré-Visualização",
    async abrir(pedido) {
      const slug = (pedido as { slug?: string } | undefined)?.slug;
      if (!slug) {
        await s.abrirApp("finder", { lugar: "recentes" });
        return;
      }
      const aberto = documentos.get(slug);
      if (aberto) {
        if (aberto.janela.minimizada) await aberto.janela.restaurar();
        else aberto.janela.ativar();
        aberto.focar();
        return;
      }
      const d = await s.dados();
      const ix = indexar(d);
      const post = ix.post.get(slug);
      if (!post) return;
      const doc = new Documento(s, d, post, ix.livroDoPost.get(slug), {
        aoFechar: () => {
          documentos.delete(slug);
          if (ultimo === doc) ultimo = [...documentos.values()].at(-1);
        },
        aoAtivar: (esta) => (ultimo = esta),
      });
      documentos.set(slug, doc);
      ultimo = doc;
    },
    menus(): Menu[] {
      const doc = daFrente();
      return [
        {
          titulo: "Arquivo",
          itens: [
            { rotulo: "Abrir no Código", desativado: !doc, acao: () => doc && void s.abrirApp("editor", { slug: doc.post.slug }) },
            { rotulo: "Mostrar no Finder", desativado: !doc, acao: () => doc && void s.abrirApp("finder", { slug: doc.post.slug }) },
            { rotulo: "Ler no blog", desativado: !doc, acao: () => doc && (location.href = doc.post.url) },
            { separador: true },
            { rotulo: "Fechar janela", atalho: "esc", desativado: !doc, acao: () => void doc?.janela.fechar() },
          ],
        },
        { titulo: "Editar", itens: [{ rotulo: "Copiar", desativado: true }, { rotulo: "Selecionar tudo", desativado: true }] },
        {
          titulo: "Visualizar",
          itens: [
            { rotulo: "Miniaturas", marcado: doc ? doc.comMiniaturas : true, desativado: !doc, acao: () => doc?.alternarMiniaturas() },
            { separador: true },
            { rotulo: "Tamanho real", atalho: "0", desativado: !doc, acao: () => doc?.zoomEm(1) },
            { rotulo: "Aumentar", atalho: "+", desativado: !doc || !doc.podeAumentar(), acao: () => doc?.mudarZoom(1) },
            { rotulo: "Diminuir", atalho: "−", desativado: !doc || !doc.podeDiminuir(), acao: () => doc?.mudarZoom(-1) },
          ],
        },
        {
          titulo: "Ir",
          itens: [
            { rotulo: "Página anterior", atalho: "←", desativado: !doc, acao: () => doc?.irParaPagina(doc.pagina - 1) },
            { rotulo: "Próxima página", atalho: "→", desativado: !doc, acao: () => doc?.irParaPagina(doc.pagina + 1) },
            { separador: true },
            { rotulo: "Primeira página", desativado: !doc, acao: () => doc?.irParaPagina(1) },
            { rotulo: "Última página", desativado: !doc, acao: () => doc?.irParaPagina(doc.total) },
          ],
        },
        { titulo: "Ferramentas", itens: [{ rotulo: "Anotar", desativado: true }, { rotulo: "Mostrar o inspetor", desativado: true }] },
      ];
    },
    tecla(e) {
      return daFrente()?.tecla(e) ?? false;
    },
  };
  return app;
}

interface Ganchos {
  aoFechar(): void;
  aoAtivar(doc: Documento): void;
}

class Documento {
  readonly janela: Janela;
  comMiniaturas = true;
  pagina = 1;
  total = 0;
  private el: HTMLElement;
  private mesa: HTMLElement;
  private folhas: HTMLElement;
  private miniaturas: HTMLElement;
  private indicador: HTMLElement;
  private zoom = 1;
  private vivo = true;
  private quadro = 0;

  constructor(
    private s: Sistema,
    private d: DadosM,
    readonly post: PostM,
    private livro: LivroM | undefined,
    ganchos: Ganchos,
  ) {
    this.el = document.createElement("div");
    this.el.className = "pv";
    this.el.innerHTML = `
      <nav class="mac-lateral pv-lateral" aria-label="Miniaturas das páginas"><div class="pv-miniaturas" data-arrastar></div></nav>
      <div class="pv-principal">
        <div class="mac-ferramentas pv-ferramentas" data-arrastar>
          <div class="mac-capsula"><button type="button" data-acao="miniaturas" aria-pressed="true" aria-label="Miniaturas das páginas">${glifo("lateral")}</button></div>
          <div class="pv-titulo"><strong>${escapar(post.pdf)}</strong><span data-indicador aria-live="polite">Abrindo…</span></div>
          <div class="pv-espaco"></div>
          <div class="mac-capsula pv-zoom" role="group" aria-label="Zoom">
            <button type="button" data-zoom="-1" aria-label="Diminuir">${glifo("menos")}</button>
            <span class="mac-capsula-divisa" aria-hidden="true"></span>
            <button type="button" data-zoom="1" aria-label="Aumentar">${glifo("mais")}</button>
          </div>
          <div class="mac-capsula pv-so-largo"><button type="button" data-acao="editor" aria-label="Abrir no Código" title="Abrir no Código">${glifo("explorer")}</button></div>
          <div class="mac-capsula"><a class="mac-capsula-texto" href="${post.url}" aria-label="Ler “${escapar(post.titulo)}” no blog">Ler no blog</a></div>
        </div>
        <div class="pv-mesa" tabindex="0" role="document" aria-label="Páginas de ${escapar(post.pdf)}"><div class="pv-folhas"></div></div>
      </div>`;
    this.mesa = this.el.querySelector(".pv-mesa")!;
    this.folhas = this.el.querySelector(".pv-folhas")!;
    this.miniaturas = this.el.querySelector(".pv-miniaturas")!;
    this.indicador = this.el.querySelector("[data-indicador]")!;
    this.folhas.setAttribute("style", d.papel);
    this.folhas.style.setProperty("--zoom", "1");
    this.folhas.innerHTML = `<p class="pv-carregando">Abrindo ${escapar(post.pdf)}…</p>`;
    if (s.estreito.matches) this.alternarMiniaturas(false);

    const area = s.tela.clientHeight;
    this.janela = s.criarJanela({
      app: "previa",
      titulo: post.pdf,
      classe: "mac-janela--previa",
      largura: 900,
      altura: Math.max(480, area - 130),
      minLargura: 420,
      minAltura: 320,
      conteudo: this.el,
      semaforos: { x: 21, y: 21 },
      focar: () => this.focar(),
      aoFechar: () => {
        this.vivo = false;
        ganchos.aoFechar();
      },
      aoAtivar: (ativa) => {
        if (ativa) ganchos.aoAtivar(this);
        this.el.classList.toggle("ativa", ativa);
      },
      aoMudarTamanho: () => this.marcarPagina(),
    });
    this.ligar();
    void this.carregar();
  }

  focar() {
    this.mesa.focus({ preventScroll: true });
  }

  private async carregar() {
    let blocos: Bloco[];
    try {
      [blocos] = await Promise.all([buscarBlocos(this.post.slug), fontesProntas()]);
    } catch {
      if (this.vivo) this.folhas.innerHTML = `<p class="pv-carregando">Não deu para abrir o arquivo agora. <a href="${this.post.url}">Ler no blog</a></p>`;
      this.indicador.textContent = "";
      return;
    }
    if (!this.vivo) return;
    this.folhas.innerHTML = "";
    const paginas = await this.paginar(blocos);
    if (!paginas) return;
    this.total = paginas.length;
    this.folhas.classList.add("paginado");
    this.montarMiniaturas(paginas);
    this.marcarPagina();
    this.s.atualizarMenus();
  }

  // ---------- os controles ----------

  alternarMiniaturas(mostrar = !this.comMiniaturas) {
    this.comMiniaturas = mostrar;
    this.el.classList.toggle("sem-miniaturas", !mostrar);
    this.el.querySelector('[data-acao="miniaturas"]')?.setAttribute("aria-pressed", String(mostrar));
    this.s.atualizarMenus();
  }

  podeAumentar() {
    return this.zoom < ZOOMS[ZOOMS.length - 1];
  }

  podeDiminuir() {
    return this.zoom > ZOOMS[0];
  }

  mudarZoom(passo: number) {
    const i = ZOOMS.indexOf(this.zoom);
    this.zoomEm(ZOOMS[Math.max(0, Math.min(ZOOMS.length - 1, (i < 0 ? 2 : i) + passo))]);
  }

  zoomEm(novo: number) {
    if (novo === this.zoom) return;
    // A página atual fica no lugar.
    const proporcao = this.mesa.scrollTop / Math.max(1, this.mesa.scrollHeight);
    this.zoom = novo;
    this.folhas.style.setProperty("--zoom", String(novo));
    this.mesa.scrollTop = proporcao * this.mesa.scrollHeight;
    this.el.querySelector<HTMLButtonElement>('[data-zoom="-1"]')!.disabled = !this.podeDiminuir();
    this.el.querySelector<HTMLButtonElement>('[data-zoom="1"]')!.disabled = !this.podeAumentar();
    this.s.atualizarMenus();
  }

  irParaPagina(n: number) {
    const alvo = Math.max(1, Math.min(this.total || 1, n));
    const pg = this.folhas.querySelector<HTMLElement>(`.pdf-pagina[data-pagina="${alvo}"]`);
    if (!pg) return;
    this.mesa.scrollTo({ top: pg.offsetTop - 18, behavior: this.s.reduzido.matches ? "instant" : "smooth" });
  }

  tecla(e: KeyboardEvent): boolean {
    if (!this.mesa.contains(document.activeElement) && document.activeElement !== this.mesa) return false;
    if (e.metaKey || e.ctrlKey || e.altKey) return false;
    if (e.key === "+" || e.key === "=") {
      e.preventDefault();
      this.mudarZoom(1);
      return true;
    }
    if (e.key === "-") {
      e.preventDefault();
      this.mudarZoom(-1);
      return true;
    }
    if (e.key === "0") {
      e.preventDefault();
      this.zoomEm(1);
      return true;
    }
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      this.irParaPagina(this.pagina + (e.key === "ArrowRight" ? 1 : -1));
      return true;
    }
    return false;
  }

  private ligar() {
    this.el.addEventListener("click", (e) => {
      const alvo = e.target as Element;
      const acao = alvo.closest<HTMLElement>("[data-acao]")?.dataset.acao;
      if (acao === "miniaturas") return this.alternarMiniaturas();
      if (acao === "editor") return void this.s.abrirApp("editor", { slug: this.post.slug });
      const z = alvo.closest<HTMLElement>("[data-zoom]");
      if (z) return this.mudarZoom(Number(z.dataset.zoom));
      const mini = alvo.closest<HTMLElement>(".pv-mini");
      if (mini) {
        this.irParaPagina(Number(mini.dataset.pagina));
        if (this.s.estreito.matches) this.alternarMiniaturas(false);
      }
    });
    this.miniaturas.addEventListener("keydown", (e) => {
      const mini = (e.target as Element).closest<HTMLElement>(".pv-mini");
      if (!mini || (e.key !== "ArrowDown" && e.key !== "ArrowUp")) return;
      e.preventDefault();
      const todas = [...this.miniaturas.querySelectorAll<HTMLElement>(".pv-mini")];
      const j = todas.indexOf(mini) + (e.key === "ArrowDown" ? 1 : -1);
      const proxima = todas[j];
      if (proxima) {
        proxima.focus();
        this.irParaPagina(Number(proxima.dataset.pagina));
      }
    });
    // Redimensionando a janela, as páginas ficam na largura de antes (nada se refaz a cada quadro) e se
    // ajustam uma vez, quando o tamanho para de mudar.
    let largura = 0;
    let pausa = 0;
    new ResizeObserver(() => {
      const w = this.mesa.clientWidth;
      if (!largura) {
        largura = w;
        return;
      }
      if (w === largura && !this.folhas.classList.contains("congelado")) return;
      if (!this.folhas.classList.contains("congelado")) {
        const pagina = this.folhas.querySelector<HTMLElement>(".pdf-pagina");
        if (pagina) {
          this.folhas.style.setProperty("--pv-largura", `${pagina.offsetWidth}px`);
          this.folhas.classList.add("congelado");
        }
      }
      clearTimeout(pausa);
      pausa = window.setTimeout(() => {
        largura = this.mesa.clientWidth;
        this.folhas.classList.remove("congelado");
        this.marcarPagina();
      }, 180);
    }).observe(this.mesa);
    this.mesa.addEventListener(
      "scroll",
      () => {
        if (this.quadro) return;
        this.quadro = requestAnimationFrame(() => {
          this.quadro = 0;
          this.marcarPagina();
        });
      },
      { passive: true },
    );
  }

  // ---------- a paginação (a do protótipo 14) ----------

  /**
   * Pagina o texto. A cada poucas páginas devolve a vez ao navegador: o começo aparece logo, e um post
   * longo (os do Java) não trava a janela.
   */
  private async paginar(blocos: Bloco[]): Promise<HTMLElement[] | null> {
    const paginas: HTMLElement[] = [];
    let corpo!: HTMLElement;
    const nova = () => {
      const n = paginas.length + 1;
      const pg = document.createElement("article");
      pg.className = "pdf-pagina";
      pg.dataset.pagina = String(n);
      pg.setAttribute("aria-label", `Página ${n}`);
      pg.innerHTML =
        '<div class="pdf-miolo">' +
        (n === 1
          ? this.capa()
          : `<header class="pdf-cabeca" aria-hidden="true"><span>${escapar(this.livro?.nome ?? "Cesar Schutz")}</span><span>${escapar(this.post.titulo)}</span></header>`) +
        `<div class="pdf-corpo"></div><footer class="pdf-pe" aria-hidden="true">${n}</footer></div>`;
      this.folhas.append(pg);
      paginas.push(pg);
      corpo = pg.querySelector(".pdf-corpo")!;
    };
    const cabe = () => corpo.scrollHeight <= corpo.clientHeight + 0.5;
    nova();
    let jaMostradas = 1;
    for (const b of blocos) {
      if (paginas.length - jaMostradas >= 2) {
        jaMostradas = paginas.length;
        this.indicador.textContent = `Página 1 de ${paginas.length}…`;
        await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
        if (!this.vivo) return null;
      }
      let el: HTMLElement | null = elemento(b);
      while (el) {
        corpo.append(el);
        if (cabe()) break;
        el.remove();
        const vazia = corpo.childElementCount === 0;
        const partes = partir(el, corpo, cabe);
        if (partes) {
          corpo.append(partes[0]);
          el = partes[1];
          nova();
          continue;
        }
        if (vazia) {
          corpo.append(el);
          break;
        }
        const ultimo = corpo.lastElementChild;
        const levar = ultimo && /^H[23]$/.test(ultimo.tagName) && corpo.childElementCount > 1 ? ultimo : null;
        nova();
        if (levar) corpo.append(levar);
      }
    }
    const ultima = paginas.at(-1)!;
    if (!ultima.querySelector(".pdf-corpo")!.childElementCount && paginas.length > 1) {
      ultima.remove();
      paginas.pop();
    }
    const total = paginas.length;
    for (const pg of paginas) pg.setAttribute("aria-label", `Página ${pg.dataset.pagina} de ${total}`);
    return paginas;
  }

  private capa(): string {
    const { post, livro } = this;
    const qual = livro ? (livro.serie ? "Série" : livro.volume ? `Volume ${livro.volume}` : "") : "";
    return `<header class="pdf-capa">
      <div class="pdf-livro">${livro ? fotoDoLivro(livro) : ""}<span><strong>${escapar(livro?.nome ?? "Cesar Schutz")}</strong>${qual ? `${qual} · ` : ""}Cesar Schutz</span></div>
      <h1 class="pdf-titulo">${escapar(post.titulo)}</h1>
      ${post.subtitulo ? `<p class="pdf-subtitulo">${escapar(post.subtitulo)}</p>` : ""}
      <p class="pdf-meta">${post.data} · ${post.minutos} min de leitura · blog.cesarschutz.com.br</p>
      ${post.imagem ? `<div class="pdf-figura painel" style="--cor:${post.cor}" role="img" aria-label="${escapar(post.imagem.alt)}">${desenhoDoPost(post, "largo", "topo")}</div>` : ""}
    </header>`;
  }

  // ---------- as miniaturas e a página atual ----------

  private montarMiniaturas(paginas: HTMLElement[]) {
    const total = paginas.length;
    this.miniaturas.innerHTML = "";
    for (const pg of paginas) {
      const n = pg.dataset.pagina!;
      const b = document.createElement("button");
      b.type = "button";
      b.className = "pv-mini";
      b.dataset.pagina = n;
      b.setAttribute("aria-label", `Página ${n} de ${total}`);
      const papel = document.createElement("div");
      papel.className = "pv-mini-papel";
      papel.setAttribute("aria-hidden", "true");
      papel.setAttribute("style", this.d.papel);
      const copia = pg.cloneNode(true) as HTMLElement;
      copia.removeAttribute("aria-label");
      copia.removeAttribute("data-pagina");
      copia.querySelector("[role='img']")?.removeAttribute("role");
      papel.append(copia);
      const rotulo = document.createElement("span");
      rotulo.textContent = n;
      rotulo.setAttribute("aria-hidden", "true");
      b.append(papel, rotulo);
      this.miniaturas.append(b);
    }
  }

  private marcarPagina() {
    const paginas = [...this.folhas.querySelectorAll<HTMLElement>(".pdf-pagina")];
    if (!paginas.length || !this.total) return;
    const linha = this.mesa.scrollTop + this.mesa.clientHeight * 0.35;
    let atual = paginas[0];
    for (const pg of paginas) if (pg.offsetTop <= linha) atual = pg;
    const n = Number(atual.dataset.pagina);
    this.indicador.textContent = `Página ${n} de ${paginas.length}`;
    if (n === this.pagina && this.miniaturas.querySelector(".pv-mini.atual")) return;
    this.pagina = n;
    for (const m of this.miniaturas.querySelectorAll<HTMLElement>(".pv-mini")) {
      const e = Number(m.dataset.pagina) === n;
      m.classList.toggle("atual", e);
      if (e) {
        m.setAttribute("aria-current", "page");
        const rm = m.getBoundingClientRect();
        const rc = this.miniaturas.getBoundingClientRect();
        if (rm.top < rc.top + 50) this.miniaturas.scrollTop -= rc.top + 50 - rm.top;
        else if (rm.bottom > rc.bottom - 8) this.miniaturas.scrollTop += rm.bottom - (rc.bottom - 8);
      } else m.removeAttribute("aria-current");
    }
  }
}

/** As fontes do papel, antes de medir (no máximo 1,5 s). */
function fontesProntas(): Promise<unknown> {
  const fontes = ['1em "Literata Variable"', 'italic 1em "Literata Variable"', '600 1em "Besley Variable"', '1em "JetBrains Mono Variable"', '600 1em "IBM Plex Sans Variable"'];
  return Promise.race([Promise.all(fontes.map((f) => document.fonts.load(f).catch(() => []))), new Promise((r) => setTimeout(r, 1500))]);
}

function elemento(b: Bloco): HTMLElement {
  switch (b.t) {
    case "h2":
    case "h3":
    case "p": {
      const el = document.createElement(b.t);
      el.innerHTML = b.html;
      return el;
    }
    case "citacao": {
      const el = document.createElement("blockquote");
      el.innerHTML = b.html;
      return el;
    }
    case "aviso": {
      const el = document.createElement("div");
      el.className = "pdf-aviso";
      el.innerHTML = `<span class="rotulo">${escapar(b.tipo)}</span>${b.html}`;
      return el;
    }
    case "ul":
    case "ol": {
      const el = document.createElement(b.t);
      if (b.t === "ol" && b.inicio && b.inicio !== 1) (el as HTMLOListElement).start = b.inicio;
      el.innerHTML = b.itens.map((i) => `<li>${i}</li>`).join("");
      return el;
    }
    case "codigo": {
      const el = document.createElement("figure");
      el.className = "pdf-codigo";
      if (b.titulo) {
        const t = document.createElement("figcaption");
        t.textContent = b.titulo;
        el.append(t);
      }
      const pre = document.createElement("pre");
      const code = document.createElement("code");
      code.textContent = b.linhas.join("\n");
      pre.append(code);
      el.append(pre);
      return el;
    }
    case "tabela": {
      const el = document.createElement("table");
      el.className = "pdf-tabela";
      el.innerHTML =
        `<thead><tr>${b.cabeca.map((c) => `<th>${c}</th>`).join("")}</tr></thead>` +
        `<tbody>${b.linhas.map((l) => `<tr>${l.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody>`;
      return el;
    }
  }
}

interface Partes {
  minimo: number;
  maximo: number;
  montar: (k: number) => [HTMLElement, HTMLElement];
}

/** O maior pedaço do bloco que cabe no resto da página, e o que sobra. */
function partir(el: HTMLElement, corpo: HTMLElement, cabe: () => boolean): [HTMLElement, HTMLElement] | null {
  const partes = partesDe(el);
  if (!partes) return null;
  let lo = partes.minimo;
  let hi = partes.maximo;
  let melhor = -1;
  while (lo <= hi) {
    const k = (lo + hi) >> 1;
    const [cabeca] = partes.montar(k);
    corpo.append(cabeca);
    const ok = cabe();
    cabeca.remove();
    if (ok) {
      melhor = k;
      lo = k + 1;
    } else hi = k - 1;
  }
  return melhor < 0 ? null : partes.montar(melhor);
}

function partesDe(el: HTMLElement): Partes | null {
  const tag = el.tagName;
  if (tag === "P" || tag === "BLOCKQUOTE" || (tag === "DIV" && el.classList.contains("pdf-aviso"))) return porPalavras(el);
  if (tag === "UL" || tag === "OL") {
    const itens = [...el.children];
    if (itens.length < 2) return null;
    const inicio = tag === "OL" ? (el as HTMLOListElement).start || 1 : 1;
    return {
      minimo: 1,
      maximo: itens.length - 1,
      montar: (k) => {
        const a = el.cloneNode(false) as HTMLElement;
        const b = el.cloneNode(false) as HTMLElement;
        itens.forEach((li, i) => (i < k ? a : b).append(li.cloneNode(true)));
        if (tag === "OL") (b as HTMLOListElement).start = inicio + k;
        return [a, b];
      },
    };
  }
  if (tag === "FIGURE") {
    const linhas = (el.querySelector("code")?.textContent ?? "").split("\n");
    if (linhas.length < 6) return null;
    const legenda = el.querySelector("figcaption");
    const fazer = (texto: string, comLegenda: boolean) => {
      const f = el.cloneNode(false) as HTMLElement;
      if (comLegenda && legenda) f.append(legenda.cloneNode(true));
      const pre = document.createElement("pre");
      const code = document.createElement("code");
      code.textContent = texto;
      pre.append(code);
      f.append(pre);
      return f;
    };
    return { minimo: 3, maximo: linhas.length - 3, montar: (k) => [fazer(linhas.slice(0, k).join("\n"), true), fazer(linhas.slice(k).join("\n"), false)] };
  }
  if (tag === "TABLE") {
    const cabeca = el.querySelector("thead");
    const linhas = [...el.querySelectorAll("tbody tr")];
    if (linhas.length < 2) return null;
    const fazer = (de: number, ate: number) => {
      const t = el.cloneNode(false) as HTMLElement;
      if (cabeca) t.append(cabeca.cloneNode(true));
      const corpo = document.createElement("tbody");
      for (const l of linhas.slice(de, ate)) corpo.append(l.cloneNode(true));
      t.append(corpo);
      return t;
    };
    return { minimo: 1, maximo: linhas.length - 1, montar: (k) => [fazer(0, k), fazer(k, linhas.length)] };
  }
  return null;
}

/** Parte um bloco de texto entre duas palavras, guardando a marcação (negrito, código) dos dois lados. */
function porPalavras(el: HTMLElement): Partes | null {
  const cortes: { no: Text; em: number }[] = [];
  const andar = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let no = andar.nextNode() as Text | null; no; no = andar.nextNode() as Text | null) {
    for (const m of no.data.matchAll(/\s+/g)) if (m.index! > 0 || cortes.length) cortes.push({ no, em: m.index! });
  }
  const palavras = cortes.length + 1;
  if (palavras < 14) return null;
  return {
    minimo: 8,
    maximo: palavras - 5,
    montar: (k) => {
      const corte = cortes[k - 1];
      const r1 = document.createRange();
      r1.selectNodeContents(el);
      r1.setEnd(corte.no, corte.em);
      const r2 = document.createRange();
      r2.selectNodeContents(el);
      r2.setStart(corte.no, corte.em);
      const a = el.cloneNode(false) as HTMLElement;
      const b = el.cloneNode(false) as HTMLElement;
      a.append(r1.cloneContents());
      b.append(r2.cloneContents());
      a.classList.add("cortado");
      b.classList.add("continua");
      return [a, b];
    },
  };
}
