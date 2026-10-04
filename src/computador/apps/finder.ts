/**
 * O Finder (C3, C6): a pasta "Blog" da área de trabalho e o primeiro ícone do Dock. Como o do macOS 27
 * "Golden Gate": a barra lateral de vidro de ponta a ponta, com os semáforos em cima dela (Favoritos: Blog,
 * Livros, Séries e Recentes; Etiquetas: as tags do blog, com o ponto na cor do livro em que mais
 * aparecem), a barra de ferramentas com as cápsulas (voltar e avançar, o título, as visualizações e a
 * busca), e o conteúdo em colunas (o padrão, a do protótipo 14), ícones ou lista, com a barra de caminho
 * e a contagem embaixo.
 *
 * - Os livros e as séries são pastas; cada post é um PDF com o título no nome. Na coluna da pré-
 *   visualização, a imagem do post com o livro deitado no canto (C6), o nome, o tipo, as informações e os
 *   botões "Abrir" e "Ler no blog". O mouse sobre um PDF já troca a pré-visualização.
 * - Duplo clique (ou Enter) abre o PDF na Pré-Visualização; numa pasta, entra nela. Espaço é a Olhada
 *   Rápida (a imagem do post grande, por cima). Setas andam nas colunas (→ entra, ← volta).
 * - Várias janelas (Arquivo > Nova janela do Finder), cada uma com o seu lugar e o seu histórico.
 * - No celular, a barra lateral fica atrás do botão da barra de ferramentas e as colunas aparecem uma de
 *   cada vez, como no app Arquivos.
 */
import cssDoFinder from "../estilos/finder.css?inline";
import type { App, Janela, Menu, Sistema } from "../contexto";
import { desenhoDoPost, escapar, fotoDoLivro, indexar, type DadosM, type LivroM, type PostM, type TagM } from "../dados";
import { ARQUIVO_PDF, glifo, pasta, type Glifo } from "../icones";

type Vista = "colunas" | "icones" | "lista";

interface Pasta {
  tipo: "pasta";
  id: string;
  nome: string;
  livro?: LivroM;
  filhos: () => No[];
}

interface Pdf {
  tipo: "pdf";
  id: string;
  nome: string;
  post: PostM;
  livro?: LivroM;
}

type No = Pasta | Pdf;

interface Lugar {
  /** As pastas abertas, da raiz do lugar até a de dentro. */
  pilha: string[];
  /** O item escolhido na pasta de dentro (uma pasta ainda não aberta ou um PDF). */
  sel?: string;
}

interface Pedido {
  lugar?: "blog" | "livros" | "series" | "recentes" | "lixeira";
  livro?: string;
  slug?: string;
  nova?: boolean;
}

const LOCAIS: { id: string; nome: string; glifo: Glifo }[] = [
  { id: "blog", nome: "Blog", glifo: "arquivos" },
  { id: "livros", nome: "Livros", glifo: "livro" },
  { id: "series", nome: "Séries", glifo: "revista" },
  { id: "recentes", nome: "Recentes", glifo: "relogio" },
];

const TAGS_A_VISTA = 7;

/** A mola do livro (a do protótipo 12): passa um nada do lugar e volta. */
const MOLA = "linear(0, 0.384, 0.667, 0.863, 0.986, 1.05, 1.07, 1.061, 1.037, 1.012, 1)";

export function criar(s: Sistema): App {
  s.estilo("finder", cssDoFinder);
  const janelas = new Set<FinderJanela>();
  let ultima: FinderJanela | undefined;
  let vistaPadrao: Vista = "colunas";

  const app: App & { daFrente(): FinderJanela | undefined } = {
    id: "finder",
    nome: "Finder",
    daFrente() {
      const frente = [...janelas].filter((f) => !f.janela.minimizada);
      return frente.find((f) => f.janela.el.hasAttribute("data-ativa")) ?? ultima;
    },
    async abrir(pedido) {
      const p = (pedido ?? {}) as Pedido;
      const d = await s.dados();
      // Sem pedido e com janelas abertas: o sistema já trouxe à frente; aqui só abre a primeira.
      const existente = !p.nova && !p.lugar && !p.livro && !p.slug ? [...janelas].find((f) => !f.janela.minimizada) : undefined;
      if (existente) {
        existente.janela.ativar();
        return;
      }
      if ((p.livro || p.slug || p.lugar) && !p.nova) {
        // Mostrar algo num Finder já aberto (o "open" do Terminal, a Lixeira do Dock): o da frente vai até lá.
        const alvo = app.daFrente();
        if (alvo && !alvo.janela.minimizada) {
          alvo.ir(lugarDoPedido(d, p));
          alvo.janela.ativar();
          alvo.focar();
          return;
        }
      }
      const f = new FinderJanela(s, d, lugarDoPedido(d, p), vistaPadrao, {
        aoFechar: () => {
          janelas.delete(f);
          if (ultima === f) ultima = [...janelas].at(-1);
        },
        aoAtivar: (esta) => (ultima = esta),
        aoMudarVista: (v) => (vistaPadrao = v),
      });
      janelas.add(f);
      ultima = f;
    },
    menus(): Menu[] {
      const f = app.daFrente();
      const sel = f?.escolhido();
      const vista = f?.vista ?? vistaPadrao;
      return [
        {
          titulo: "Arquivo",
          itens: [
            { rotulo: "Nova janela do Finder", acao: () => void app.abrir({ nova: true, lugar: "livros" }) },
            { separador: true },
            { rotulo: "Abrir", atalho: "↵", desativado: !sel, acao: () => f?.abrirEscolhido() },
            { rotulo: "Abrir no Código", desativado: sel?.tipo !== "pdf", acao: () => sel?.tipo === "pdf" && void s.abrirApp("editor", { slug: sel.post.slug }) },
            {
              rotulo: "Novo Terminal na pasta",
              desativado: !f?.livroAberto(),
              acao: () => {
                const livro = f?.livroAberto();
                if (livro) void s.abrirApp("terminal", { livro: livro.id });
              },
            },
            { rotulo: "Ler no blog", desativado: sel?.tipo !== "pdf", acao: () => sel?.tipo === "pdf" && (location.href = sel.post.url) },
            { separador: true },
            { rotulo: "Olhada rápida", atalho: "espaço", desativado: sel?.tipo !== "pdf", acao: () => f?.olhadaRapida() },
            { rotulo: "Fechar janela", atalho: "esc", desativado: !f, acao: () => void f?.janela.fechar() },
          ],
        },
        { titulo: "Editar", itens: [{ rotulo: "Desfazer", desativado: true }, { separador: true }, { rotulo: "Copiar", desativado: true }, { rotulo: "Selecionar tudo", desativado: true }] },
        {
          titulo: "Visualizar",
          itens: [
            { rotulo: "Como ícones", marcado: vista === "icones", acao: () => f?.mudarVista("icones") },
            { rotulo: "Como lista", marcado: vista === "lista", acao: () => f?.mudarVista("lista") },
            { rotulo: "Como colunas", marcado: vista === "colunas", acao: () => f?.mudarVista("colunas") },
            { separador: true },
            { rotulo: "Barra lateral", marcado: f ? !f.semLateral : true, desativado: !f, acao: () => f?.alternarLateral() },
          ],
        },
        {
          titulo: "Ir",
          itens: [
            { rotulo: "Voltar", desativado: !f?.podeVoltar(), acao: () => f?.voltar() },
            { rotulo: "Avançar", desativado: !f?.podeAvancar(), acao: () => f?.avancar() },
            { separador: true },
            ...LOCAIS.map((l) => ({ rotulo: l.nome, acao: () => irOuAbrir({ lugar: l.id as Pedido["lugar"] }) })),
            { rotulo: "Lixeira", acao: () => irOuAbrir({ lugar: "lixeira" }) },
          ],
        },
      ];
    },
    menuDoApp: () => [{ rotulo: "Esvaziar a Lixeira…", desativado: true }],
    tecla(e) {
      return app.daFrente()?.tecla(e) ?? false;
    },
  };

  function irOuAbrir(p: Pedido) {
    void app.abrir(p);
  }

  return app;
}

/** O lugar inicial de um pedido; sem pedido, o livro da página aberta no blog (ou os Livros). */
function lugarDoPedido(d: DadosM, p: Pedido): Lugar {
  const ix = indexar(d);
  if (p.slug && ix.post.has(p.slug)) {
    const livro = ix.livroDoPost.get(p.slug);
    if (livro) return { pilha: [livro.serie ? "series" : "livros", livro.id], sel: `pdf:${p.slug}` };
  }
  if (p.livro && ix.livro.has(p.livro)) {
    const livro = ix.livro.get(p.livro)!;
    return { pilha: [livro.serie ? "series" : "livros", livro.id] };
  }
  if (p.lugar) return { pilha: [p.lugar] };
  // Do lugar de onde o leitor veio: o post aberto ou o livro aberto.
  const aqui = decodeURI(location.pathname);
  const post = d.posts.find((x) => decodeURI(x.url) === aqui);
  if (post) return lugarDoPedido(d, { slug: post.slug });
  const livro = d.livros.find((l) => decodeURI(l.href) === aqui);
  if (livro) return lugarDoPedido(d, { livro: livro.id });
  return { pilha: ["livros"] };
}

// ---------- o sistema de arquivos ----------

function arvore(d: DadosM) {
  const ix = indexar(d);
  const pdf = (post: PostM): Pdf => ({ tipo: "pdf", id: `pdf:${post.slug}`, nome: post.pdf, post, livro: ix.livroDoPost.get(post.slug) });
  const doLivro = (l: LivroM): Pasta => ({
    tipo: "pasta",
    id: l.id,
    nome: l.nome,
    livro: l,
    filhos: () => l.posts.map((s) => ix.post.get(s)).filter((x): x is PostM => Boolean(x)).map(pdf),
  });
  const livros: Pasta = { tipo: "pasta", id: "livros", nome: "Livros", filhos: () => d.livros.filter((l) => !l.serie).map(doLivro) };
  const series: Pasta = { tipo: "pasta", id: "series", nome: "Séries", filhos: () => d.livros.filter((l) => l.serie).map(doLivro) };
  const raizes = new Map<string, Pasta>([
    ["blog", { tipo: "pasta", id: "blog", nome: "Blog", filhos: () => [livros, series] }],
    ["livros", livros],
    ["series", series],
    ["recentes", { tipo: "pasta", id: "recentes", nome: "Recentes", filhos: () => [...d.posts].sort((a, b) => b.isoMod.localeCompare(a.isoMod) || b.iso.localeCompare(a.iso)).map(pdf) }],
    ["lixeira", { tipo: "pasta", id: "lixeira", nome: "Lixeira", filhos: () => [] }],
  ]);
  for (const t of d.tags) {
    raizes.set(`tag:${t.slug}`, {
      tipo: "pasta",
      id: `tag:${t.slug}`,
      nome: t.nome,
      filhos: () => t.posts.map((s) => ix.post.get(s)).filter((x): x is PostM => Boolean(x)).map(pdf),
    });
  }
  const todos = new Map<string, No>();
  const registrar = (n: No) => {
    todos.set(n.id, n);
    if (n.tipo === "pasta" && !n.id.startsWith("tag:") && n.id !== "recentes") n.filhos().forEach(registrar);
  };
  registrar(raizes.get("blog")!);
  for (const p of d.posts) if (!todos.has(`pdf:${p.slug}`)) todos.set(`pdf:${p.slug}`, pdf(p));
  for (const [id, r] of raizes) todos.set(id, r);
  return { raizes, todos, pdf };
}

// ---------- uma janela do Finder ----------

interface Ganchos {
  aoFechar(): void;
  aoAtivar(janela: FinderJanela): void;
  aoMudarVista(v: Vista): void;
}

class FinderJanela {
  readonly janela: Janela;
  vista: Vista;
  semLateral = false;
  private el: HTMLElement;
  private conteudo: HTMLElement;
  private lateral: HTMLElement;
  private caminhoEl: HTMLElement;
  private contaEl: HTMLElement;
  private tituloEl: HTMLElement;
  private busca: HTMLInputElement;
  private fs: ReturnType<typeof arvore>;
  private lugar: Lugar;
  private historico: Lugar[] = [];
  private futuro: Lugar[] = [];
  private colunaAtiva = 0;
  private sobre?: string;
  private todasAsTags = false;
  private termo = "";
  private olhada?: HTMLElement;

  constructor(
    private s: Sistema,
    private d: DadosM,
    lugar: Lugar,
    vista: Vista,
    private ganchos: Ganchos,
  ) {
    this.fs = arvore(d);
    this.lugar = lugar;
    this.vista = vista;
    this.colunaAtiva = lugar.sel ? lugar.pilha.length - 1 : Math.max(0, lugar.pilha.length - 2);
    this.el = document.createElement("div");
    this.el.className = "fd";
    this.el.innerHTML = `
      <nav class="mac-lateral fd-lateral" aria-label="Barra lateral do Finder"><div class="mac-lateral-rolagem" data-arrastar></div></nav>
      <div class="fd-principal">
        <div class="mac-ferramentas fd-ferramentas" data-arrastar>
          <div class="mac-capsula fd-so-estreito"><button type="button" data-acao="lateral" aria-label="Mostrar a barra lateral">${glifo("lateral")}</button></div>
          <div class="mac-capsula" role="group" aria-label="Histórico">
            <button type="button" data-acao="voltar" aria-label="Voltar">${glifo("voltar")}</button>
            <button type="button" data-acao="avancar" aria-label="Avançar">${glifo("avancar")}</button>
          </div>
          <h2 class="mac-ferramentas-titulo fd-titulo"><span></span></h2>
          <div class="fd-espaco"></div>
          <div class="mac-capsula fd-vistas" role="group" aria-label="Visualização">
            <button type="button" data-vista="icones" aria-label="Como ícones" aria-pressed="false">${glifo("icones")}</button>
            <button type="button" data-vista="lista" aria-label="Como lista" aria-pressed="false">${glifo("lista")}</button>
            <button type="button" data-vista="colunas" aria-label="Como colunas" aria-pressed="false">${glifo("colunas")}</button>
          </div>
          <label class="mac-busca-campo fd-busca">${glifo("busca")}<input type="search" placeholder="Buscar" aria-label="Buscar no blog" spellcheck="false" autocomplete="off"></label>
        </div>
        <div class="fd-conteudo"></div>
        <div class="fd-rodape"><ol class="fd-caminho" aria-label="Caminho"></ol><span class="fd-conta" aria-live="polite"></span></div>
      </div>`;
    this.lateral = this.el.querySelector(".mac-lateral-rolagem")!;
    this.conteudo = this.el.querySelector(".fd-conteudo")!;
    this.caminhoEl = this.el.querySelector(".fd-caminho")!;
    this.contaEl = this.el.querySelector(".fd-conta")!;
    this.tituloEl = this.el.querySelector(".fd-titulo span")!;
    this.busca = this.el.querySelector(".fd-busca input")!;

    this.janela = s.criarJanela({
      app: "finder",
      titulo: "Finder",
      classe: "mac-janela--finder",
      largura: 980,
      altura: 600,
      minLargura: 560,
      minAltura: 320,
      conteudo: this.el,
      semaforos: { x: 21, y: 21 },
      focar: () => this.focar(),
      aoFechar: () => ganchos.aoFechar(),
      aoAtivar: (ativa) => {
        if (ativa) ganchos.aoAtivar(this);
        this.el.classList.toggle("ativa", ativa);
      },
      aoMudarTamanho: () => this.mostrarUltimaColuna(),
    });
    this.ligar();
    this.desenharLateral();
    this.desenhar();
    requestAnimationFrame(() => this.focar());
  }

  // ---------- o estado ----------

  private pasta(id: string): Pasta | undefined {
    const n = this.fs.todos.get(id);
    return n?.tipo === "pasta" ? n : undefined;
  }

  private filhosDe(id: string): No[] {
    if (id === "busca") return this.resultados();
    return this.pasta(id)?.filhos() ?? [];
  }

  private nomeDe(id: string): string {
    if (id === "busca") return `Busca: "${this.termo}"`;
    return this.fs.todos.get(id)?.nome ?? "";
  }

  escolhido(): No | undefined {
    return this.lugar.sel ? this.fs.todos.get(this.lugar.sel) : undefined;
  }

  /** O livro (a pasta) aberto agora: o do PDF escolhido, ou a pasta de dentro. */
  livroAberto(): LivroM | undefined {
    const sel = this.escolhido();
    if (sel?.tipo === "pdf") return sel.livro;
    if (sel?.tipo === "pasta" && sel.livro) return sel.livro;
    return this.pasta(this.lugar.pilha[this.lugar.pilha.length - 1])?.livro;
  }

  podeVoltar() {
    if (this.s.estreito.matches && this.vista === "colunas") return Boolean(this.lugar.sel) || this.lugar.pilha.length > 1;
    return this.historico.length > 0;
  }

  podeAvancar() {
    return this.futuro.length > 0;
  }

  /** Vai a um lugar novo, guardando o atual no histórico. */
  ir(lugar: Lugar) {
    if (this.termo && lugar.pilha[0] !== "busca") this.limparBusca();
    this.historico.push(this.lugar);
    this.futuro = [];
    this.lugar = { pilha: [...lugar.pilha], sel: lugar.sel };
    this.colunaAtiva = this.lugar.sel ? this.lugar.pilha.length - 1 : Math.max(0, this.lugar.pilha.length - 2);
    this.desenhar();
  }

  voltar() {
    // No celular (uma coluna por vez), voltar é subir um nível: do PDF para a pasta, da pasta para a de cima.
    if (this.s.estreito.matches && this.vista === "colunas") {
      if (this.lugar.sel) this.lugar = { pilha: this.lugar.pilha };
      else if (this.lugar.pilha.length > 1) this.lugar = { pilha: this.lugar.pilha.slice(0, -1) };
      else return;
      this.colunaAtiva = Math.max(0, this.lugar.pilha.length - 1);
      this.desenhar();
      this.focar();
      return;
    }
    const l = this.historico.pop();
    if (!l) return;
    this.futuro.push(this.lugar);
    this.lugar = l;
    if (l.pilha[0] !== "busca" && this.termo) this.limparBusca();
    this.desenhar();
    this.focar();
  }

  avancar() {
    const l = this.futuro.pop();
    if (!l) return;
    this.historico.push(this.lugar);
    this.lugar = l;
    if (l.pilha[0] !== "busca" && this.termo) this.limparBusca();
    this.desenhar();
    this.focar();
  }

  mudarVista(v: Vista) {
    if (v === this.vista) return;
    this.vista = v;
    this.ganchos.aoMudarVista(v);
    this.desenhar();
    this.focar();
    this.s.atualizarMenus();
  }

  alternarLateral() {
    this.semLateral = !this.semLateral;
    this.el.classList.toggle("sem-lateral", this.semLateral);
    this.s.atualizarMenus();
  }

  /** Escolhe um item na coluna `k` (colunas) ou na pasta aberta (ícones e lista). */
  private escolher(k: number, id: string) {
    const n = this.fs.todos.get(id) ?? this.resultados().find((r) => r.id === id);
    if (!n) return;
    const pilha = this.vista === "colunas" ? this.lugar.pilha.slice(0, k + 1) : this.lugar.pilha;
    if (this.vista === "colunas" && n.tipo === "pasta") this.lugar = { pilha: [...pilha, n.id] };
    else this.lugar = { pilha, sel: n.id };
    this.colunaAtiva = k;
    this.desenhar();
  }

  /** Entra na pasta (ícones e lista) ou abre o PDF na Pré-Visualização. */
  private abrirItem(id: string) {
    const n = this.fs.todos.get(id) ?? this.resultados().find((r) => r.id === id);
    if (!n) return;
    if (n.tipo === "pdf") {
      void this.s.abrirApp("previa", { slug: n.post.slug });
      return;
    }
    if (this.vista === "colunas") {
      const k = this.lugar.pilha.indexOf(n.id);
      this.colunaAtiva = k >= 0 ? k : this.colunaAtiva;
      this.focar();
      return;
    }
    this.ir({ pilha: [...this.lugar.pilha, n.id] });
    this.focar();
  }

  abrirEscolhido() {
    const n = this.escolhido();
    if (n) this.abrirItem(n.id);
  }

  // ---------- a busca ----------

  private resultados(): Pdf[] {
    const t = this.termo.trim().toLocaleLowerCase("pt-BR");
    if (!t) return [];
    const sem = (x: string) => x.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
    const alvo = sem(t);
    return this.d.posts.filter((p) => sem(`${p.tituloCompleto} ${p.slug} ${p.tags.join(" ")}`).includes(alvo)).map((p) => this.fs.pdf(p));
  }

  private buscar(termo: string) {
    const antes = this.termo;
    this.termo = termo;
    if (!termo.trim()) {
      if (antes) this.voltar();
      return;
    }
    if (this.lugar.pilha[0] === "busca") {
      this.lugar = { pilha: ["busca"] };
      this.desenhar();
    } else this.ir({ pilha: ["busca"] });
  }

  private limparBusca() {
    this.termo = "";
    this.busca.value = "";
  }

  // ---------- desenhar ----------

  private desenharLateral() {
    const atual = this.lugar.pilha[0];
    const tags = [...this.d.tags];
    const visiveis = this.todasAsTags ? tags : tags.slice(0, TAGS_A_VISTA);
    const item = (id: string, conteudo: string, rotulo: string) =>
      `<button type="button" class="mac-lateral-item" data-local="${id}" aria-current="${id === atual}" title="${escapar(rotulo)}">${conteudo}</button>`;
    this.lateral.innerHTML =
      `<p class="mac-lateral-grupo">Favoritos</p>` +
      LOCAIS.map((l) => item(l.id, `${glifo(l.glifo)}<span>${l.nome}</span>`, l.nome)).join("") +
      `<p class="mac-lateral-grupo">Etiquetas</p>` +
      visiveis.map((t: TagM) => item(`tag:${t.slug}`, `<span class="mac-ponto-cor" style="--cor:${t.cor}"></span><span>${escapar(t.nome)}</span>`, t.nome)).join("") +
      (tags.length > TAGS_A_VISTA
        ? `<button type="button" class="mac-lateral-item fd-mais" data-todas>${glifo("etiqueta")}<span>${this.todasAsTags ? "Menos etiquetas" : "Todas as etiquetas…"}</span></button>`
        : "");
    this.lateral.setAttribute("aria-label", "Lugares");
  }

  private marcarLateral() {
    const atual = this.lugar.pilha[0];
    for (const b of this.lateral.querySelectorAll<HTMLElement>("[data-local]")) b.setAttribute("aria-current", String(b.dataset.local === atual));
  }

  /** Desenha tudo o que depende do lugar: o título, o conteúdo, o caminho e a contagem. */
  private desenhar() {
    const pilha = this.lugar.pilha;
    const dentro = pilha[pilha.length - 1];
    // Em colunas, o título é a pasta de onde as colunas partem; no celular (uma coluna por vez), a de dentro.
    const nomeDentro = this.nomeDe(this.vista === "colunas" && !this.s.estreito.matches ? pilha[0] : dentro);
    this.tituloEl.textContent = nomeDentro;
    this.janela.definirTitulo(`Finder — ${this.nomeDe(dentro)}`);
    this.marcarLateral();
    for (const b of this.el.querySelectorAll<HTMLButtonElement>("[data-vista]")) b.setAttribute("aria-pressed", String(b.dataset.vista === this.vista));
    this.el.querySelector<HTMLButtonElement>('[data-acao="voltar"]')!.disabled = !this.podeVoltar();
    this.el.querySelector<HTMLButtonElement>('[data-acao="avancar"]')!.disabled = !this.podeAvancar();
    this.el.dataset.modo = this.vista;
    if (this.vista === "colunas") this.desenharColunas();
    else if (this.vista === "icones") this.desenharIcones();
    else this.desenharLista();
    this.desenharCaminho();
    const n = this.filhosDe(dentro).length;
    this.contaEl.textContent = n === 0 ? "Nenhum item" : `${n} ${n === 1 ? "item" : "itens"}`;
    this.s.atualizarMenus();
  }

  private desenharCaminho() {
    const ids = [...this.lugar.pilha, ...(this.lugar.sel ? [this.lugar.sel] : [])];
    this.caminhoEl.innerHTML = ids
      .map((id) => {
        const n = this.fs.todos.get(id);
        const icone = n?.tipo === "pdf" ? `<span class="fd-icone-arquivo" style="--cor:${n.post.cor}">${ARQUIVO_PDF}</span>` : pasta("mac-pasta fd-mini-pasta");
        return `<li>${icone}<span>${escapar(this.nomeDe(id))}</span></li>`;
      })
      .join("");
  }

  private linha(n: No, escolhido: boolean, extra = "") {
    const icone =
      n.tipo === "pdf"
        ? `<span class="fd-icone-arquivo" style="--cor:${n.post.cor}">${ARQUIVO_PDF}</span>`
        : pasta("mac-pasta fd-mini-pasta");
    const cor = n.tipo === "pasta" && n.livro ? `<span class="fd-cor" style="--cor:${n.livro.cor}" aria-hidden="true"></span>` : "";
    const seta = n.tipo === "pasta" ? `<svg class="fd-seta" viewBox="0 0 10 10" aria-hidden="true"><path d="M3.5 1.5 7 5l-3.5 3.5"/></svg>` : "";
    return `<div class="fd-item" role="option" id="fd-${this.janela.id}-${n.id.replace(/[^\w-]/g, "_")}" data-item="${escapar(n.id)}" aria-selected="${escolhido}" tabindex="-1"${extra}>${icone}<span class="fd-nome">${escapar(n.nome)}</span>${cor}${seta}</div>`;
  }

  private desenharColunas() {
    const pilha = this.lugar.pilha;
    let trilho = this.conteudo.querySelector<HTMLElement>(".fd-trilho");
    if (!trilho) {
      this.conteudo.innerHTML = '<div class="fd-trilho"></div>';
      trilho = this.conteudo.querySelector<HTMLElement>(".fd-trilho")!;
    }
    const existentes = [...trilho.querySelectorAll<HTMLElement>(".fd-coluna")];
    pilha.forEach((id, k) => {
      const escolhido = k + 1 < pilha.length ? pilha[k + 1] : this.lugar.sel;
      let col = existentes[k];
      if (!col || col.dataset.pasta !== id) {
        const nova = document.createElement("div");
        nova.className = "fd-coluna";
        nova.setAttribute("role", "listbox");
        nova.dataset.pasta = id;
        nova.dataset.k = String(k);
        nova.setAttribute("aria-label", this.nomeDe(id));
        const filhos = this.filhosDe(id);
        nova.innerHTML = filhos.length ? filhos.map((n) => this.linha(n, n.id === escolhido)).join("") : `<p class="fd-vazia">${id === "lixeira" ? "A Lixeira está vazia" : id === "busca" ? "Nada encontrado" : "Pasta vazia"}</p>`;
        if (col) col.replaceWith(nova);
        else trilho!.insertBefore(nova, trilho!.querySelector(".fd-previa"));
        col = nova;
        existentes[k] = nova;
      } else {
        for (const i of col.querySelectorAll<HTMLElement>(".fd-item")) i.setAttribute("aria-selected", String(i.dataset.item === escolhido));
      }
      col.classList.toggle("ativa", k === Math.min(this.colunaAtiva, pilha.length - 1));
      // Uma parada de Tab por coluna: a escolhida (ou a primeira).
      const itens = [...col.querySelectorAll<HTMLElement>(".fd-item")];
      const foco = itens.find((i) => i.getAttribute("aria-selected") === "true") ?? itens[0];
      itens.forEach((i) => (i.tabIndex = i === foco ? 0 : -1));
    });
    for (const c of existentes.slice(pilha.length)) c?.remove();

    // A última coluna: a pré-visualização do PDF escolhido, ou do livro aberto.
    let previa = trilho.querySelector<HTMLElement>(".fd-previa");
    const sel = this.escolhido();
    const livro = sel?.tipo === "pdf" ? sel.livro : this.pasta(pilha[pilha.length - 1])?.livro;
    const assunto = sel?.tipo === "pdf" ? sel.id : livro ? livro.id : "";
    if (!assunto) {
      previa?.remove();
    } else {
      if (!previa) {
        previa = document.createElement("section");
        previa.className = "fd-previa";
        previa.setAttribute("aria-label", "Pré-visualização");
        trilho.append(previa);
      }
      if (previa.dataset.mostra !== assunto) this.desenharPrevia(previa, sel?.tipo === "pdf" ? sel : undefined, livro);
    }
    // No celular, só uma coluna à vista: a de dentro, ou a pré-visualização do PDF escolhido.
    const nivel = sel?.tipo === "pdf" ? pilha.length : pilha.length - 1;
    [...trilho.children].forEach((c, i) => c.classList.toggle("atual", i === nivel));
    this.mostrarUltimaColuna();
  }

  private desenharPrevia(previa: HTMLElement, pdf: Pdf | undefined, livro: LivroM | undefined, animar = false) {
    previa.dataset.mostra = pdf?.id ?? livro?.id ?? "";
    if (pdf) {
      const p = pdf.post;
      const l = pdf.livro;
      const foto = l ? `<span class="fd-livro-junto">${fotoDoLivro(l)}</span>` : "";
      previa.innerHTML = `<div class="fd-previa-corpo">
        <div class="fd-imagem painel" style="--cor:${p.cor}" role="img" aria-label="${escapar(p.imagem?.alt ?? p.titulo)}">${desenhoDoPost(p, "medio")}${foto}</div>
        <h3 class="fd-nome-previa">${escapar(p.pdf)}</h3>
        <p class="fd-tipo">Documento PDF · ${p.minutos} min de leitura</p>
        <div class="fd-acoes">
          <button type="button" class="fd-botao" data-abrir="${escapar(pdf.id)}">Abrir</button>
          <a class="fd-link" href="${p.url}">Ler no blog</a>
        </div>
        <div class="fd-info">
          <p class="fd-info-titulo">Informações</p>
          <dl>
            <dt>Título</dt><dd>${escapar(p.tituloCompleto)}</dd>
            ${l ? `<dt>Livro</dt><dd><span class="fd-cor" style="--cor:${l.cor}" aria-hidden="true"></span>${escapar(l.nome)}${l.volume ? ` · volume ${l.volume}` : ""}</dd>` : ""}
            <dt>Criado</dt><dd>${p.data}</dd>
            ${p.atualizado ? `<dt>Modificado</dt><dd>${p.atualizado}</dd>` : ""}
            ${p.tags.length ? `<dt>Etiquetas</dt><dd>${escapar(p.tags.join(", "))}</dd>` : ""}
          </dl>
        </div>
      </div>`;
    } else if (livro) {
      const n = livro.posts.length;
      previa.innerHTML = `<div class="fd-previa-corpo">
        <div class="fd-livro-grande">${fotoDoLivro(livro)}</div>
        <h3 class="fd-nome-previa">${escapar(livro.nome)}</h3>
        <p class="fd-tipo">Pasta · ${n === 0 ? "nenhum item" : `${n} ${n === 1 ? "item" : "itens"}`}</p>
        <p class="fd-descricao">${escapar(livro.descricao)}</p>
        <div class="fd-acoes"><a class="fd-link" href="${livro.href}">${livro.serie ? "Ver a série no blog" : "Ver o livro no blog"}</a></div>
      </div>`;
    }
    if (this.s.reduzido.matches) return;
    if (animar) previa.querySelector(".fd-previa-corpo")?.animate([{ opacity: 0.4 }, { opacity: 1 }], { duration: 140, easing: "ease-out" });
    // O livro deitado chega com uma mola, encostando no canto da imagem do post.
    previa.querySelector(".fd-livro-junto")?.animate(
      [
        { opacity: 0, transform: "translate(14px, 18px) rotate(9deg) scale(0.82)" },
        { opacity: 1, offset: 0.35 },
        { opacity: 1, transform: "none" },
      ],
      { duration: 560, easing: MOLA },
    );
  }

  /** As colunas rolam de lado para a última (e a pré-visualização) ficarem à vista. */
  private mostrarUltimaColuna() {
    const trilho = this.conteudo.querySelector<HTMLElement>(".fd-trilho");
    if (!trilho) return;
    requestAnimationFrame(() => {
      const fim = trilho.scrollWidth - trilho.clientWidth;
      if (fim > 0 && Math.abs(trilho.scrollLeft - fim) > 2) trilho.scrollTo({ left: fim, behavior: this.s.reduzido.matches ? "instant" : "smooth" });
    });
  }

  private desenharIcones() {
    const dentro = this.lugar.pilha[this.lugar.pilha.length - 1];
    const filhos = this.filhosDe(dentro);
    this.conteudo.innerHTML = filhos.length
      ? `<div class="fd-grade" role="listbox" aria-label="${escapar(this.nomeDe(dentro))}">${filhos
          .map((n) => {
            const figura =
              n.tipo === "pdf"
                ? `<span class="fd-folha" style="--cor:${n.post.cor}"><span class="fd-folha-imagem painel" style="--cor:${n.post.cor}">${desenhoDoPost(n.post, "medio", "miniatura")}</span><span class="fd-folha-linhas"></span></span>`
                : `${pasta("mac-pasta fd-pasta-grande")}${n.livro ? `<span class="fd-cor fd-cor-pasta" style="--cor:${n.livro.cor}"></span>` : ""}`;
            const escolhido = n.id === this.lugar.sel;
            return `<div class="fd-icone" role="option" data-item="${escapar(n.id)}" aria-selected="${escolhido}" tabindex="${escolhido ? 0 : -1}" title="${escapar(n.nome)}"><span class="fd-icone-figura">${figura}</span><span class="fd-icone-nome">${escapar(n.nome)}</span></div>`;
          })
          .join("")}</div>`
      : `<p class="fd-vazia">${dentro === "lixeira" ? "A Lixeira está vazia" : "Pasta vazia"}</p>`;
    const grade = this.conteudo.querySelector(".fd-grade");
    if (grade && !grade.querySelector('[tabindex="0"]')) grade.querySelector<HTMLElement>(".fd-icone")?.setAttribute("tabindex", "0");
  }

  private desenharLista() {
    const dentro = this.lugar.pilha[this.lugar.pilha.length - 1];
    const filhos = this.filhosDe(dentro);
    const linha = (n: No, i: number) => {
      const escolhido = n.id === this.lugar.sel;
      const icone = n.tipo === "pdf" ? `<span class="fd-icone-arquivo" style="--cor:${n.post.cor}">${ARQUIVO_PDF}</span>` : pasta("mac-pasta fd-mini-pasta");
      const data = n.tipo === "pdf" ? (n.post.atualizado ?? n.post.data) : "—";
      const tamanho = n.tipo === "pdf" ? `${Math.max(1, Math.round(n.post.minutos * 18))} KB` : n.livro ? `${n.livro.posts.length} itens` : "—";
      const tipo = n.tipo === "pdf" ? "Documento PDF" : "Pasta";
      return `<div class="fd-linha${i % 2 ? " listra" : ""}" role="row" data-item="${escapar(n.id)}" aria-selected="${escolhido}" tabindex="${escolhido ? 0 : -1}"><span role="gridcell" class="fd-l-nome">${icone}<span>${escapar(n.nome)}</span></span><span role="gridcell">${data}</span><span role="gridcell" class="fd-l-num">${tamanho}</span><span role="gridcell">${tipo}</span></div>`;
    };
    this.conteudo.innerHTML = filhos.length
      ? `<div class="fd-tabela" role="grid" aria-label="${escapar(this.nomeDe(dentro))}"><div class="fd-cabeca" role="row"><span role="columnheader">Nome</span><span role="columnheader"${dentro === "recentes" ? ' aria-sort="descending"' : ""}>Data de modificação</span><span role="columnheader" class="fd-l-num">Tamanho</span><span role="columnheader">Tipo</span></div>${filhos.map(linha).join("")}</div>`
      : `<p class="fd-vazia">${dentro === "lixeira" ? "A Lixeira está vazia" : "Pasta vazia"}</p>`;
    const tabela = this.conteudo.querySelector(".fd-tabela");
    if (tabela && !tabela.querySelector('[tabindex="0"]')) tabela.querySelector<HTMLElement>(".fd-linha")?.setAttribute("tabindex", "0");
  }

  /** O foco vai para o item escolhido da coluna ativa (ou da grade, ou da lista). */
  focar() {
    const alvo =
      this.vista === "colunas"
        ? (this.conteudo.querySelector<HTMLElement>(".fd-coluna.ativa .fd-item[tabindex='0']") ?? this.conteudo.querySelector<HTMLElement>(".fd-item"))
        : this.conteudo.querySelector<HTMLElement>("[data-item][tabindex='0']");
    (alvo ?? this.lateral.querySelector<HTMLElement>("[aria-current='true']") ?? this.janela.el).focus({ preventScroll: true });
    if (alvo) alvo.scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  // ---------- a Olhada Rápida (Espaço) ----------

  olhadaRapida() {
    const n = this.escolhido();
    if (this.olhada) return this.fecharOlhada();
    if (n?.tipo !== "pdf") return;
    const p = n.post;
    const el = document.createElement("div");
    el.className = "fd-olhada";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-label", `Olhada rápida: ${p.pdf}`);
    el.tabIndex = -1;
    el.innerHTML = `<div class="fd-olhada-barra"><button type="button" class="fd-olhada-fechar" data-fechar-olhada aria-label="Fechar a olhada rápida">${glifo("fechar")}</button><span>${escapar(p.pdf)}</span><button type="button" class="fd-olhada-abrir" data-abrir="${escapar(n.id)}">Abrir com Pré-Visualização</button></div><div class="fd-olhada-imagem painel" style="--cor:${p.cor}">${desenhoDoPost(p, "largo", "topo")}</div><p class="fd-olhada-titulo">${escapar(p.titulo)}</p>${p.subtitulo ? `<p class="fd-olhada-sub">${escapar(p.subtitulo)}</p>` : ""}`;
    this.el.append(el);
    this.olhada = el;
    if (!this.s.reduzido.matches) el.animate([{ opacity: 0, transform: "scale(0.96)" }, { opacity: 1, transform: "scale(1)" }], { duration: 200, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" });
    el.focus({ preventScroll: true });
  }

  private fecharOlhada() {
    const el = this.olhada;
    if (!el) return;
    this.olhada = undefined;
    const fim = () => el.remove();
    if (this.s.reduzido.matches) fim();
    else el.animate([{ opacity: 1, transform: "scale(1)" }, { opacity: 0, transform: "scale(0.97)" }], { duration: 120, easing: "ease-in" }).finished.then(fim, fim);
    this.focar();
  }

  // ---------- as teclas e os cliques ----------

  tecla(e: KeyboardEvent): boolean {
    if (e.key === "Escape" && this.olhada) {
      this.fecharOlhada();
      return true;
    }
    if (e.key === "Escape" && this.termo && document.activeElement === this.busca) {
      this.limparBusca();
      this.buscar("");
      return true;
    }
    return false;
  }

  private ligar() {
    this.el.addEventListener("click", (e) => {
      const alvo = e.target as Element;
      const local = alvo.closest<HTMLElement>("[data-local]");
      if (local) {
        this.ir({ pilha: [local.dataset.local!] });
        this.el.classList.remove("lateral-aberta");
        return;
      }
      if (alvo.closest("[data-todas]")) {
        this.todasAsTags = !this.todasAsTags;
        this.desenharLateral();
        this.marcarLateral();
        return;
      }
      const acao = alvo.closest<HTMLElement>("[data-acao]")?.dataset.acao;
      if (acao === "voltar") return this.voltar();
      if (acao === "avancar") return this.avancar();
      if (acao === "lateral") {
        this.el.classList.toggle("lateral-aberta");
        return;
      }
      const vista = alvo.closest<HTMLElement>("button[data-vista]");
      if (vista) return this.mudarVista(vista.dataset.vista as Vista);
      if (alvo.closest("[data-fechar-olhada]")) return this.fecharOlhada();
      const abrir = alvo.closest<HTMLElement>("[data-abrir]");
      if (abrir) {
        this.fecharOlhada();
        return this.abrirItem(abrir.dataset.abrir!);
      }
      const item = alvo.closest<HTMLElement>("[data-item]");
      if (item) {
        const col = item.closest<HTMLElement>(".fd-coluna");
        const k = col ? Number(col.dataset.k) : 0;
        const toque = (e as PointerEvent).pointerType === "touch";
        // No toque, o segundo toque no mesmo PDF abre (e a pasta, em ícones e lista, abre no primeiro).
        if (toque && (item.getAttribute("aria-selected") === "true" || (this.vista !== "colunas" && this.fs.todos.get(item.dataset.item!)?.tipo === "pasta"))) {
          this.abrirItem(item.dataset.item!);
          return;
        }
        this.escolher(k, item.dataset.item!);
        this.focar();
      }
    });

    this.el.addEventListener("dblclick", (e) => {
      const item = (e.target as Element).closest<HTMLElement>("[data-item]");
      if (item) this.abrirItem(item.dataset.item!);
    });

    // O mouse sobre um PDF já troca a pré-visualização; ao sair da coluna, volta a do escolhido.
    this.el.addEventListener("pointerover", (e) => {
      if (e.pointerType !== "mouse" || this.vista !== "colunas") return;
      const item = (e.target as Element).closest<HTMLElement>(".fd-coluna [data-item]");
      const id = item?.dataset.item;
      if (!id || id === this.sobre) return;
      const n = this.fs.todos.get(id) ?? this.resultados().find((r) => r.id === id);
      if (n?.tipo !== "pdf") return;
      this.sobre = id;
      const previa = this.conteudo.querySelector<HTMLElement>(".fd-previa");
      if (previa && previa.dataset.mostra !== id) this.desenharPrevia(previa, n, n.livro, true);
    });
    this.el.addEventListener("pointerout", (e) => {
      if (e.pointerType !== "mouse" || !this.sobre) return;
      const para = (e.relatedTarget as Element | null)?.closest?.(".fd-coluna [data-item]");
      if (para) return;
      this.sobre = undefined;
      const previa = this.conteudo.querySelector<HTMLElement>(".fd-previa");
      const sel = this.escolhido();
      const livro = sel?.tipo === "pdf" ? sel.livro : this.pasta(this.lugar.pilha[this.lugar.pilha.length - 1])?.livro;
      const assunto = sel?.tipo === "pdf" ? sel.id : (livro?.id ?? "");
      if (previa && previa.dataset.mostra !== assunto) this.desenharPrevia(previa, sel?.tipo === "pdf" ? sel : undefined, livro, true);
    });

    this.busca.addEventListener("input", () => this.buscar(this.busca.value));
    this.busca.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const primeiro = this.resultados()[0];
        if (primeiro) {
          this.escolher(0, primeiro.id);
          this.focar();
        }
      }
    });

    this.el.addEventListener("keydown", (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === " " && !(e.target as Element).closest("input")) {
        e.preventDefault();
        return this.olhadaRapida();
      }
      const item = (e.target as Element).closest<HTMLElement>("[data-item]");
      if (!item) return;
      if (this.vista === "colunas") return this.teclaNaColuna(e, item);
      return this.teclaNaGrade(e, item);
    });
  }

  private teclaNaColuna(e: KeyboardEvent, item: HTMLElement) {
    const col = item.closest<HTMLElement>(".fd-coluna")!;
    const k = Number(col.dataset.k);
    const itens = [...col.querySelectorAll<HTMLElement>("[data-item]")];
    const i = itens.indexOf(item);
    const mover = (j: number) => {
      const novo = itens[Math.max(0, Math.min(itens.length - 1, j))];
      if (!novo || novo === item) return;
      this.escolher(k, novo.dataset.item!);
      this.focar();
    };
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        return mover(i + 1);
      case "ArrowUp":
        e.preventDefault();
        return mover(i - 1);
      case "Home":
        e.preventDefault();
        return mover(0);
      case "End":
        e.preventDefault();
        return mover(itens.length - 1);
      case "ArrowRight": {
        e.preventDefault();
        const n = this.fs.todos.get(item.dataset.item!);
        if (n?.tipo !== "pasta") return;
        if (this.lugar.pilha[k + 1] !== n.id) this.escolher(k, n.id);
        const primeiro = this.filhosDe(n.id)[0];
        if (primeiro) this.escolher(k + 1, primeiro.id);
        this.colunaAtiva = k + 1;
        this.desenhar();
        this.focar();
        return;
      }
      case "ArrowLeft": {
        e.preventDefault();
        if (k === 0) return;
        this.lugar = { pilha: this.lugar.pilha.slice(0, k + 1) };
        this.colunaAtiva = k - 1;
        this.desenhar();
        this.focar();
        return;
      }
      case "Enter":
        e.preventDefault();
        return this.abrirItem(item.dataset.item!);
    }
  }

  private teclaNaGrade(e: KeyboardEvent, item: HTMLElement) {
    const itens = [...this.conteudo.querySelectorAll<HTMLElement>("[data-item]")];
    const i = itens.indexOf(item);
    let colunas = 1;
    if (this.vista === "icones") {
      const topo = itens[0]?.offsetTop ?? 0;
      colunas = Math.max(1, itens.filter((x) => x.offsetTop === topo).length);
    }
    const passo: Record<string, number> = { ArrowRight: this.vista === "icones" ? 1 : 0, ArrowLeft: this.vista === "icones" ? -1 : 0, ArrowDown: colunas, ArrowUp: -colunas };
    let j = i;
    if (e.key in passo) j = i + passo[e.key];
    else if (e.key === "Home") j = 0;
    else if (e.key === "End") j = itens.length - 1;
    else if (e.key === "Enter") {
      e.preventDefault();
      return this.abrirItem(item.dataset.item!);
    } else if (e.key === "Backspace" || (e.key === "ArrowUp" && e.metaKey)) {
      e.preventDefault();
      return this.voltar();
    } else return;
    e.preventDefault();
    const novo = itens[Math.max(0, Math.min(itens.length - 1, j))];
    if (!novo) return;
    this.escolher(0, novo.dataset.item!);
    this.focar();
  }
}
