/**
 * O Terminal (C5): o Terminal do Mac, perfil Básico, com o blog como pastas, e um modo que o Terminal de
 * fábrica não tem, o suspenso, que desce do alto (⌃`, como o Quake, a "Hotkey Window" do iTerm2 e o "Quick
 * Terminal" do Ghostty).
 *
 * - Cada janela é uma sessão do zsh (o Terminal abre quantas o Cesar quiser; a cascata é do sistema). O
 *   título é o do Terminal: "pasta — -zsh — 80×24", com as colunas e as linhas pelo tamanho da janela, e a
 *   janela nova abre com 80×24, como no Mac. O prompt é o padrão do zsh no macOS (`%n@%m %1~ %#`).
 * - O suspenso é outra sessão, num painel de vidro da largura da tela, logo abaixo da barra de menus. Desce
 *   com uma mola leve e sobe rápido; a alça embaixo muda a altura (de 25% a 85% da tela). Some sozinho
 *   quando o foco vai para outro lugar (o clique fora, o Tab para fora, o `open` de um arquivo), como os
 *   terminais suspensos de verdade, e o foco volta para onde estava.
 * - O sistema de arquivos: ~/blog/livros/<livro>/<post>.md (ou .mdx) e ~/blog/series/<série>/…, mais o
 *   leia-me.md, e o .zshrc e o .zsh_history escondidos em ~. Os dados vêm de s.dados(); o texto de cada
 *   post é o .md cru do repositório (textoDoPost), lido só quando o `cat`, o `ls -l` ou o `open` pedem.
 * - Os comandos: help, ls (-1aAFhlrt), cd (com o cdpath: `cd dados` de qualquer lugar), pwd, tree
 *   (-a -d -L), cat (-n), open (-a, -R), code, clear, history, echo, date, whoami, which, man e exit;
 *   `;`, `&&`, `||`, aspas, `~`, `$VAR` e `*` funcionam. As mensagens do sistema são as do Mac (em inglês,
 *   como lá); as nossas (help, man, leia-me) são em português.
 * - Tab completa comandos e caminhos como o zsh (o começo comum; a lista embaixo da linha; o Tab de novo
 *   anda pela lista), ↑ ↓ andam no histórico (o mesmo em todas as sessões), ⌃C cancela, ⌃L limpa, ⌃A ⌃E ⌃U
 *   ⌃K editam a linha. As pastas e os arquivos da saída são botões: a pasta entra e lista, o arquivo abre.
 * - No hover (ou no foco) de um post listado, o desenho dele aparece num cartão ao lado da linha.
 * - O cursor é o bloco do Terminal, que pisca (1s, em degraus) só com a janela na frente e fica vazado com
 *   ela atrás. É CSS: nada de laço de quadros. Com movimento reduzido, não pisca e o suspenso não desliza.
 *
 * Teclado e leitor de tela: a saída é um role="log" (aria-live="polite"); o prompt é um <input> de verdade,
 * com rótulo escondido; o Tab completa e o Shift+Tab vai para a saída, onde as setas andam entre as pastas
 * e os arquivos. O clique num lugar vazio devolve o foco ao prompt, sem desfazer a seleção de texto.
 */
import css from "../estilos/terminal.css?inline";
import type { App, ItemDeMenu, Janela, Menu, Sistema } from "../contexto";
import { desenhoDoPost, escapar, indexar, textoDoPost, type DadosM, type LivroM, type PostM } from "../dados";
import { glifo } from "../icones";

// ---------- constantes ----------

const USUARIO = "cesar";
const MAQUINA = "MacBook-Pro";
const CASA = `/Users/${USUARIO}`;
const MAC = /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);
const DIAS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
/** Os tamanhos da fonte (px) do Visualizar › Aumentar e Diminuir. */
const TAMANHOS = [9, 10, 11, 12, 13, 14, 16, 18, 20, 24];
const TAMANHO_PADRAO = 13;
const TAMANHO_CELULAR = 14;
/** O espaço em volta do texto, em px: o da janela e o do suspenso. */
const MARGEM = { janela: { topo: 4, lado: 8, base: 8 }, suspenso: { topo: 10, lado: 16, base: 14 } } as const;
const BARRA_DA_JANELA = 28;
/** Quantas linhas a saída guarda antes de jogar fora as mais antigas (o "scrollback"). */
const LIMITE_DE_LINHAS = 10000;
/** O `cat` entra em pedaços deste tamanho, cada um pulado na pintura enquanto está fora da tela. */
const PEDACO = 160;
/** A altura do suspenso, em fração da tela: a padrão, a do celular e os limites da alça. */
const SUSPENSO = { padrao: 0.42, celular: 0.6, min: 0.25, max: 0.85 };
/** A descida do suspenso: uma mola leve (passa 1,8% e volta), que chega embaixo em ~0,22s de 0,46s. */
const MOLA =
  "linear(0, 0.106 3%, 0.218 6%, 0.365 10%, 0.501 14%, 0.621 18%, 0.722 22%, 0.821 27%, 0.895 32%, 0.954 38%, 0.99 44%, 1.008 50%, 1.017 57%, 1.017 65%, 1.012 75%, 1.006 87%, 1)";
const temLinear = CSS.supports("transition-timing-function", "linear(0, 1)");
const grosso = matchMedia("(pointer: coarse)");

const COMANDOS = ["cat", "cd", "clear", "code", "date", "echo", "exit", "help", "history", "ll", "ls", "man", "open", "pwd", "tree", "which", "whoami"];
const APLICATIVOS: Record<string, "finder" | "previa" | "editor" | "terminal"> = {
  finder: "finder",
  editor: "editor",
  codigo: "editor",
  código: "editor",
  code: "editor",
  "visual studio code": "editor",
  textedit: "editor",
  terminal: "terminal",
  "pré-visualização": "previa",
  "pre-visualizacao": "previa",
  preview: "previa",
};

// ---------- utilidades ----------

const normalizar = (t: string) =>
  t
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
const bytes = (t: string) => new TextEncoder().encode(t).length;
const dois = (n: number) => String(n).padStart(2, "0");
const contarLinhas = (t: string) => {
  let n = 1;
  for (let i = t.indexOf("\n"); i >= 0; i = t.indexOf("\n", i + 1)) n++;
  return n;
};

/** Um número de 0 a 1 que não muda para o mesmo texto (a hora de cada arquivo, que o blog não guarda). */
function sorteio(texto: string) {
  let h = 2166136261;
  for (let i = 0; i < texto.length; i++) h = Math.imul(h ^ texto.charCodeAt(i), 16777619);
  return ((h >>> 0) % 10000) / 10000;
}

/** "Last login: qua 1 out 14:32:10 on ttys000". */
const dataDoLogin = (d: Date) => `${DIAS[d.getDay()]} ${d.getDate()} ${MESES[d.getMonth()]} ${dois(d.getHours())}:${dois(d.getMinutes())}:${dois(d.getSeconds())}`;

/** O `date` do macOS em português: "qua  1 out 2026 14:32:10 -03". */
function dataDoDate(d: Date) {
  const fuso = -d.getTimezoneOffset();
  const h = Math.floor(Math.abs(fuso) / 60);
  const m = Math.abs(fuso) % 60;
  const zona = `${fuso < 0 ? "-" : "+"}${dois(h)}${m ? dois(m) : ""}`;
  return `${DIAS[d.getDay()]} ${String(d.getDate()).padStart(2)} ${MESES[d.getMonth()]} ${d.getFullYear()} ${dois(d.getHours())}:${dois(d.getMinutes())}:${dois(d.getSeconds())} ${zona}`;
}

/** A data do `ls -l`: a hora, se for dos últimos seis meses; o ano, se for mais antiga. */
function dataDoLs(d: Date, agora: Date) {
  const recente = Math.abs(agora.getTime() - d.getTime()) < 182 * 864e5;
  return `${String(d.getDate()).padStart(2)} ${MESES[d.getMonth()]} ${recente ? `${dois(d.getHours())}:${dois(d.getMinutes())}` : ` ${d.getFullYear()}`}`;
}

/** O tamanho do `ls -lh`: 512B, 4,0K, 89K, 1,2M (com o ponto, como o ls imprime). */
function humano(n: number) {
  if (n < 1024) return `${n}B`;
  const unidades = ["K", "M", "G"];
  let v = n / 1024;
  let i = 0;
  while (v >= 1024 && i < unidades.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v < 10 ? v.toFixed(1) : Math.round(v)}${unidades[i]}`;
}

/** "20 set 2026" (o `atualizado` dos dados) ou "2026-09-23" (o `iso`) numa Date, com a hora sorteada. */
function dataDoPost(p: PostM) {
  let d: Date | undefined;
  const m = p.atualizado?.match(/^(\d{1,2}) (\p{L}{3}) (\d{4})$/u);
  if (m) {
    const mes = MESES.indexOf(m[2].toLowerCase());
    if (mes >= 0) d = new Date(Number(m[3]), mes, Number(m[1]));
  }
  if (!d) {
    const [a, mes, dia] = p.iso.split("-").map(Number);
    d = new Date(a, (mes || 1) - 1, dia || 1);
  }
  const s = sorteio(p.slug);
  d.setHours(8 + Math.floor(s * 14), Math.floor(sorteio(`${p.slug}m`) * 60), Math.floor(sorteio(`${p.slug}s`) * 60));
  return d;
}

// ---------- o disco: o blog como pastas ----------

interface Base {
  nome: string;
  pai: Pasta | null;
  data: Date;
  oculto: boolean;
}

interface Pasta extends Base {
  tipo: "pasta";
  filhos: No[];
  livro?: LivroM;
}

interface Arquivo extends Base {
  tipo: "arquivo";
  post?: PostM;
  livro?: LivroM;
  conteudo(): Promise<string>;
}

type No = Pasta | Arquivo;

class Disco {
  readonly raiz: Pasta;
  readonly casa: Pasta;
  readonly blog: Pasta;
  readonly livros: Pasta;
  readonly series: Pasta;
  readonly dados: DadosM;
  private porSlug = new Map<string, Arquivo>();

  constructor(d: DadosM) {
    this.dados = d;
    const idx = indexar(d);
    const agora = new Date();
    const pasta = (nome: string, pai: Pasta | null, livro?: LivroM, oculto = false): Pasta => {
      const p: Pasta = { tipo: "pasta", nome, pai, filhos: [], livro, data: agora, oculto };
      pai?.filhos.push(p);
      return p;
    };
    const arquivo = (nome: string, pai: Pasta, conteudo: () => Promise<string>, data: Date, extra: Partial<Arquivo> = {}): Arquivo => {
      const a: Arquivo = { tipo: "arquivo", nome, pai, conteudo, data, oculto: nome.startsWith("."), ...extra };
      pai.filhos.push(a);
      return a;
    };
    this.raiz = pasta("", null);
    const users = pasta("Users", this.raiz);
    this.casa = pasta(USUARIO, users);
    this.blog = pasta("blog", this.casa);
    this.livros = pasta("livros", this.blog);
    this.series = pasta("series", this.blog);
    let maisAntiga = agora;
    for (const livro of d.livros) {
      const p = pasta(livro.pasta, livro.serie ? this.series : this.livros, livro);
      for (const slug of livro.posts) {
        const post = idx.post.get(slug);
        if (!post) continue;
        const data = dataDoPost(post);
        if (data < maisAntiga) maisAntiga = data;
        const a = arquivo(`${slug}.${post.ext}`, p, () => textoDoPost(slug), data, { post, livro });
        this.porSlug.set(slug, a);
      }
    }
    const leia = leiaMe(d);
    arquivo("leia-me.md", this.blog, () => Promise.resolve(leia), new Date(2026, 8, 30, 21, 7, 42));
    arquivo(".zshrc", this.casa, () => Promise.resolve(ZSHRC), new Date(2026, 8, 30, 21, 12, 5));
    arquivo(".zsh_history", this.casa, () => Promise.resolve(historico.map((l) => `${l}\n`).join("")), agora);
    // A data de cada pasta é a do arquivo mais novo dentro dela (a vazia fica com a do primeiro artigo).
    const datar = (p: Pasta): Date => {
      let maior: Date | undefined;
      for (const f of p.filhos) {
        const d2 = f.tipo === "pasta" ? datar(f) : f.data;
        if (!f.oculto && (!maior || d2 > maior)) maior = d2;
      }
      p.data = maior ?? maisAntiga;
      return p.data;
    };
    datar(this.blog);
    // A ordem do ls: a do byte (os escondidos primeiro), como o ls do macOS.
    const ordenar = (p: Pasta) => {
      p.filhos.sort((a, b) => (a.nome < b.nome ? -1 : a.nome > b.nome ? 1 : 0));
      p.filhos.forEach((f) => f.tipo === "pasta" && ordenar(f));
    };
    ordenar(this.raiz);
  }

  absoluto(no: No): string {
    const partes: string[] = [];
    for (let n: No | null = no; n && n.pai; n = n.pai) partes.unshift(n.nome);
    return `/${partes.join("/")}`;
  }

  /** O caminho com ~ no lugar da casa ("~/blog/livros"). */
  mostrar(no: No): string {
    const a = this.absoluto(no);
    return a === CASA ? "~" : a.startsWith(`${CASA}/`) ? `~${a.slice(CASA.length)}` : a;
  }

  /** O nome curto do prompt e do título (o %1~ do zsh): ~, /, ou o nome da pasta. */
  curto(no: No): string {
    return no === this.casa ? "~" : no === this.raiz ? "/" : no.nome;
  }

  /** Acha um caminho a partir de uma pasta (o ~ já veio trocado pela casa). */
  resolver(base: Pasta, caminho: string): No | null {
    if (!caminho) return null;
    let atual: No = caminho.startsWith("/") ? this.raiz : base;
    for (const parte of caminho.split("/")) {
      if (!parte || parte === ".") continue;
      if (atual.tipo !== "pasta") return null;
      if (parte === "..") {
        atual = atual.pai ?? atual;
        continue;
      }
      const filho: No | undefined = atual.filhos.find((f) => f.nome === parte);
      if (!filho) return null;
      atual = filho;
    }
    if (caminho.endsWith("/") && atual.tipo !== "pasta") return null;
    return atual;
  }

  pastaDe(caminho: string): Pasta {
    const no = this.resolver(this.raiz, caminho);
    return no?.tipo === "pasta" ? no : this.casa;
  }

  /** O atalho do cdpath (~/blog/livros e ~/blog/series): o livro pelo nome da pasta ou do livro. */
  peloCdpath(alvo: string): No | null {
    const [primeiro, ...resto] = alvo.split("/");
    const n = normalizar(primeiro);
    for (const base of [this.livros, this.series]) {
      const p = base.filhos.find((f) => f.nome === primeiro) ?? base.filhos.find((f) => f.tipo === "pasta" && (normalizar(f.nome) === n || (f.livro && normalizar(f.livro.nome) === n)));
      if (p?.tipo === "pasta") return resto.length ? this.resolver(p, resto.join("/")) : p;
    }
    return null;
  }

  /** Um post pelo nome, de qualquer lugar (o `cat`, o `open` e o `code` sem caminho). */
  post(nome: string): Arquivo | null {
    const slug = nome.split("/").pop()!.replace(/\.mdx?$/, "");
    return this.porSlug.get(slug) ?? null;
  }

  /** O caminho para mostrar a partir de uma pasta: relativo, se estiver dentro dela; com ~, se não. */
  relativo(no: No, de: Pasta): string {
    const a = this.absoluto(no);
    const b = this.absoluto(de);
    if (no === de) return ".";
    if (a.startsWith(`${b}/`)) return a.slice(b.length + 1);
    return this.mostrar(no);
  }
}

function leiaMe(d: DadosM): string {
  const livros = d.livros.filter((l) => !l.serie).length;
  const series = d.livros.length - livros;
  return [
    "# O blog do Cesar Schutz",
    "",
    "Este computador é de mentira, e o blog mora dentro dele.",
    "",
    "Cada categoria do blog é um livro da coleção, e cada série também é um livro.",
    "Aqui eles viram pastas, e os artigos, arquivos .md (ou .mdx, quando o",
    "artigo tem animação). O texto é o mesmo do repositório, com o cabeçalho.",
    "",
    `    livros/    os ${livros} livros, um por categoria`,
    `    series/    ${series === 1 ? "a série" : `as ${series} séries`} (os artigos de cada uma)`,
    "",
    "Para começar:",
    "",
    "    ls livros          os livros",
    "    cd dados           entra num livro, de qualquer lugar",
    "    tree               tudo de uma vez",
    "    cat <arquivo>      o texto cru do artigo",
    "    open <arquivo>     o artigo na Pré-Visualização",
    "    code <arquivo>     o artigo no Código",
    "",
    "Clique numa pasta para entrar e num arquivo para abrir.",
    "O blog de verdade fica em blog.cesarschutz.com.br.",
    "",
  ].join("\n");
}

const ZSHRC = [
  "# ~/.zshrc",
  "",
  "export LANG=pt_BR.UTF-8",
  "",
  "# o ls com cor e com a barra no fim das pastas",
  "alias ls='ls -GF'",
  "alias ll='ls -lh'",
  "",
  "# `cd dados` de qualquer lugar: o zsh procura também nestas pastas",
  "cdpath=(~/blog/livros ~/blog/series)",
  "",
  "# ⌃` desce o Terminal do alto. Não existe no Terminal de fábrica:",
  "# é um modo deste computador, como a Hotkey Window do iTerm2.",
  "",
].join("\n");

// ---------- o estado comum às sessões ----------

let sis: Sistema;
let disco: Promise<Disco> | undefined;
/** O histórico do zsh, um só para todas as sessões (o ~/.zsh_history). */
const historico: string[] = [];
let ultimoLogin: { quando: Date; tty: number } | undefined;
let proximoTty = 0;
let ultimaFocada: Sessao | undefined;
const sessoes = new Set<Sessao>();

function carregarDisco(s: Sistema): Promise<Disco> {
  disco ??= s.dados().then((d) => new Disco(d));
  disco.catch(() => (disco = undefined));
  return disco;
}

const metricas = new Map<number, { ch: number; lh: number }>();
document.fonts?.addEventListener?.("loadingdone", () => metricas.clear());

/** A largura de um caractere e a altura de uma linha, medidas na fonte do Terminal. */
function medirFonte(tam: number, onde: HTMLElement) {
  let m = metricas.get(tam);
  if (m) return m;
  const sonda = document.createElement("div");
  sonda.className = "mac-term-sonda";
  sonda.style.fontSize = `${tam}px`;
  sonda.textContent = `${"0".repeat(100)}${"\n0".repeat(9)}`;
  onde.append(sonda);
  const r = sonda.getBoundingClientRect();
  sonda.remove();
  if (!r.width) return { ch: tam * 0.6, lh: tam * 1.2 };
  m = { ch: r.width / 100, lh: r.height / 10 };
  metricas.set(tam, m);
  return m;
}

let barraDeRolagem: number | undefined;

/** A largura da barra de rolagem (zero no Mac, com as barras que somem; uns 10px no Windows). */
function larguraDaBarra(onde: HTMLElement) {
  if (barraDeRolagem !== undefined) return barraDeRolagem;
  const d = document.createElement("div");
  d.className = "mac-term-area";
  d.style.cssText = "position:absolute;visibility:hidden;width:100px;height:40px;overflow-y:scroll;flex:none";
  onde.append(d);
  barraDeRolagem = d.offsetWidth - d.clientWidth;
  d.remove();
  return barraDeRolagem;
}

// ---------- o cartão com o desenho do post ----------

const cartao = {
  el: undefined as HTMLElement | undefined,
  de: undefined as HTMLElement | undefined,
  slug: "",
  tempo: 0,
  /** O cartão mora onde a sessão mora: na tela do computador (as janelas) ou no poço do suspenso. */
  garantir(host: HTMLElement) {
    let el = this.el;
    if (!el) {
      el = document.createElement("div");
      el.className = "mac-term-cartao";
      el.setAttribute("aria-hidden", "true");
      this.el = el;
    }
    if (el.parentElement !== host) {
      el.classList.remove("visivel");
      host.append(el);
    }
    return el;
  },
  async mostrar(item: HTMLElement, ses: Sessao, imediato: boolean) {
    clearTimeout(this.tempo);
    if (ses.s.estreito.matches) return;
    const slug = item.dataset.post;
    if (!slug) return this.esconder();
    const d = await carregarDisco(ses.s).catch(() => undefined);
    const a = d?.post(slug);
    const post = a?.post;
    if (!post || !a.livro) return;
    const host = ses.hostDoCartao();
    const exibir = () => {
      if (!item.isConnected) return;
      const el = this.garantir(host);
      if (this.slug !== slug) {
        this.slug = slug;
        const livro = a.livro!;
        el.innerHTML =
          (post.imagem ? `<div class="painel mac-term-cartao-figura" style="--cor:${post.cor}">${desenhoDoPost(post, "medio")}</div>` : "") +
          `<div class="mac-term-cartao-texto"><span class="mac-term-cartao-titulo">${escapar(post.titulo)}</span>` +
          (post.subtitulo ? `<span class="mac-term-cartao-sub">${escapar(post.subtitulo)}</span>` : "") +
          `<span class="mac-term-cartao-livro"><span class="mac-term-cartao-cor" style="--cor:${livro.cor}"></span>${escapar(livro.nome)}</span>` +
          `<span class="mac-term-cartao-data">${escapar(post.data)} · ${post.minutos} min de leitura</span></div>`;
      }
      const visivel = el.classList.contains("visivel");
      this.de = item;
      this.posicionar(item, el, visivel, host, ses.tipo === "janela" ? 40 : 8);
      el.classList.add("visivel");
    };
    if (imediato || this.el?.classList.contains("visivel")) exibir();
    else this.tempo = window.setTimeout(exibir, 90);
  },
  /**
   * Ao lado da linha: fora da janela, se couber (à direita dela, ou à esquerda), para não cobrir o texto;
   * senão, ao lado do nome; e, sem lugar dos lados, embaixo da linha.
   */
  posicionar(item: HTMLElement, el: HTMLElement, deslizar: boolean, host: HTMLElement, topo: number) {
    const t = host.getBoundingClientRect();
    const r = item.getBoundingClientRect();
    const janela = item.closest(".mac-janela")?.getBoundingClientRect();
    const suspenso = item.closest(".mac-suspenso")?.getBoundingClientRect();
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const base = t.height - 12;
    const vao = 16;
    let x: number;
    let lado: string;
    if (suspenso && suspenso.width >= 720 && r.right - t.left + 40 + w <= suspenso.right - t.left - 56) {
      // No suspenso, que é largo, o cartão fica na beira direita (o texto mora à esquerda), como no 15.
      x = suspenso.right - t.left - 56 - w;
      lado = "direita";
    } else if (janela && janela.right - t.left + vao + w <= t.width - 12) {
      x = janela.right - t.left + vao;
      lado = "direita";
    } else if (janela && janela.left - t.left - vao - w >= 12) {
      x = janela.left - t.left - vao - w;
      lado = "esquerda";
    } else if (r.right - t.left + 22 + w <= t.width - 12) {
      x = r.right - t.left + 22;
      lado = "direita";
    } else if (r.left - t.left - 22 - w >= 12) {
      x = r.left - t.left - 22 - w;
      lado = "esquerda";
    } else {
      x = Math.max(12, Math.min(t.width - w - 12, r.left - t.left));
      lado = "baixo";
    }
    let y = lado === "baixo" ? r.bottom - t.top + 10 : r.top - t.top + r.height / 2 - h / 2;
    if (lado === "baixo" && y + h > base) y = r.top - t.top - 10 - h;
    y = Math.max(topo, Math.min(base - h, y));
    el.dataset.lado = lado;
    el.classList.toggle("deslizando", deslizar);
    el.style.translate = `${Math.round(x)}px ${Math.round(y)}px`;
  },
  esconder(depois = 0) {
    clearTimeout(this.tempo);
    const fazer = () => {
      this.el?.classList.remove("visivel");
      this.de = undefined;
    };
    if (depois) this.tempo = window.setTimeout(fazer, depois);
    else fazer();
  },
  /** Esconde se o cartão é de um item dentro deste elemento (a sessão que fechou ou ficou para trás). */
  esconderDe(el: HTMLElement) {
    if (this.de && el.contains(this.de)) this.esconder();
  },
  visivel() {
    return Boolean(this.el?.classList.contains("visivel"));
  },
};

// ---------- a linha de comando: palavras, aspas, variáveis e operadores ----------

interface Palavra {
  texto: string;
  /** Tem * ou ? fora das aspas. */
  glob: boolean;
}

interface Simples {
  palavras: Palavra[];
  /** O operador que vem depois (`;`, `&&`, `||`), ou nada no fim. */
  op: ";" | "&&" | "||" | null;
}

function analisar(linha: string, variavel: (nome: string) => string): Simples[] | { erro: string } {
  const lista: Simples[] = [];
  let palavras: Palavra[] = [];
  let atual: string | null = null;
  let glob = false;
  const fechar = () => {
    if (atual !== null) palavras.push({ texto: atual, glob });
    atual = null;
    glob = false;
  };
  const operador = (op: Simples["op"]) => {
    fechar();
    if (!palavras.length) return false;
    lista.push({ palavras, op });
    palavras = [];
    return true;
  };
  const lerVariavel = (i: number): [string, number] => {
    if (linha[i] === "{") {
      const fim = linha.indexOf("}", i);
      if (fim < 0) return ["", linha.length];
      return [variavel(linha.slice(i + 1, fim)), fim + 1];
    }
    const m = /^(\?|\$|0|[A-Za-z_][A-Za-z0-9_]*)/.exec(linha.slice(i));
    if (!m) return ["$", i];
    return [variavel(m[1]), i + m[1].length];
  };
  let i = 0;
  while (i < linha.length) {
    const c = linha[i];
    if (c === " " || c === "\t") {
      fechar();
      i++;
    } else if (c === "'") {
      const fim = linha.indexOf("'", i + 1);
      if (fim < 0) return { erro: "zsh: unmatched '" };
      atual = (atual ?? "") + linha.slice(i + 1, fim);
      i = fim + 1;
    } else if (c === '"') {
      let j = i + 1;
      let t = "";
      while (j < linha.length && linha[j] !== '"') {
        if (linha[j] === "\\" && /["\\$`]/.test(linha[j + 1] ?? "")) {
          t += linha[j + 1];
          j += 2;
        } else if (linha[j] === "$") {
          const [v, k] = lerVariavel(j + 1);
          t += v;
          j = k;
        } else t += linha[j++];
      }
      if (j >= linha.length) return { erro: 'zsh: unmatched "' };
      atual = (atual ?? "") + t;
      i = j + 1;
    } else if (c === "\\") {
      atual = (atual ?? "") + (linha[i + 1] ?? "");
      i += 2;
    } else if (c === "$") {
      const [v, k] = lerVariavel(i + 1);
      atual = (atual ?? "") + v;
      i = k;
    } else if (c === "~" && atual === null && (i + 1 === linha.length || /[\s/;&|]/.test(linha[i + 1]))) {
      atual = CASA;
      i++;
    } else if (c === ";") {
      if (!operador(";")) return { erro: "zsh: parse error near `;'" };
      i++;
    } else if (c === "&" && linha[i + 1] === "&") {
      if (!operador("&&")) return { erro: "zsh: parse error near `&&'" };
      i += 2;
    } else if (c === "|" && linha[i + 1] === "|") {
      if (!operador("||")) return { erro: "zsh: parse error near `||'" };
      i += 2;
    } else if (c === "|" || c === ">" || c === "<" || c === "&") {
      return { erro: `zsh: este Terminal não tem pipes nem redirecionamentos (${c})` };
    } else {
      if (c === "*" || c === "?") glob = true;
      atual = (atual ?? "") + c;
      i++;
    }
  }
  fechar();
  if (palavras.length) lista.push({ palavras, op: null });
  else if (lista.length && lista[lista.length - 1].op !== ";") return { erro: `zsh: parse error near \`${lista[lista.length - 1].op}'` };
  return lista;
}

/** As opções de um comando ("-lh" → l, h), até o primeiro argumento ou o "--". */
function opcoesDe(args: string[], validas: string, comValor = ""): { op: Set<string>; valores: Map<string, string>; resto: string[]; invalida?: string } {
  const op = new Set<string>();
  const valores = new Map<string, string>();
  let i = 0;
  for (; i < args.length; i++) {
    const a = args[i];
    if (a === "--") {
      i++;
      break;
    }
    if (!a.startsWith("-") || a === "-") break;
    for (let k = 1; k < a.length; k++) {
      const letra = a[k];
      if (comValor.includes(letra)) {
        const v = a.slice(k + 1) || args[++i] || "";
        valores.set(letra, v);
        break;
      }
      if (!validas.includes(letra)) return { op, valores, resto: [], invalida: letra };
      op.add(letra);
    }
  }
  return { op, valores, resto: args.slice(i) };
}

// ---------- a sessão (uma janela, ou o suspenso) ----------

type Tipo = "janela" | "suspenso";
let contador = 0;

interface Completar {
  /** O texto antes da palavra que está sendo completada, e depois do cursor. */
  antes: string;
  depois: string;
  opcoes: { valor: string; mostra: string; pasta: boolean; cor?: string }[];
  /** A posição no Tab de novo (o menu do zsh), ou -1 antes de começar. */
  indice: number;
  /** O valor do campo no último Tab (outra tecla no meio cancela o menu). */
  valor: string;
  listado: boolean;
}

class Sessao {
  readonly tipo: Tipo;
  /** O sistema de onde a sessão é: o do computador, ou o do blog (o suspenso de fora). */
  readonly s: Sistema;
  /** O suspenso dono da sessão (as janelas não têm). */
  readonly dono?: Suspenso;
  readonly el: HTMLElement;
  readonly area: HTMLElement;
  readonly saida: HTMLElement;
  readonly linha: HTMLElement;
  readonly prompt: HTMLElement;
  readonly entrada: HTMLInputElement;
  readonly cursor: HTMLElement;
  readonly opcoes: HTMLElement;
  readonly rotulo: HTMLElement;
  readonly titulo?: HTMLElement;
  janela?: Janela;
  ativa = false;
  tam: number;
  m = { ch: 7.2, lh: 14.4 };
  cols = 80;
  rows = 24;
  cwd = CASA;
  anterior = CASA;
  status = 0;
  tty = 0;
  pid = 0;
  private posHist = 0;
  private rascunho = "";
  private fila: Promise<void> = Promise.resolve();
  private executando = 0;
  private cancelado = false;
  private comp?: Completar;
  private linhasNaSaida = 0;
  private observador?: ResizeObserver;
  private quadroDoCursor = 0;

  constructor(tipo: Tipo, s: Sistema, dono?: Suspenso) {
    this.tipo = tipo;
    this.s = s;
    this.dono = dono;
    this.tam = s.estreito.matches ? TAMANHO_CELULAR : TAMANHO_PADRAO;
    const id = `mac-term-${++contador}`;
    const el = document.createElement(tipo === "janela" ? "div" : "section");
    el.className = `mac-term mac-term--${tipo}${tipo === "suspenso" ? " mac-suspenso" : ""}`;
    el.tabIndex = -1;
    if (tipo === "suspenso") el.setAttribute("aria-label", "Terminal suspenso");
    el.style.setProperty("--t-tam", String(this.tam));
    const margem = MARGEM[tipo];
    el.innerHTML =
      (tipo === "janela"
        ? `<div class="mac-titulo-simples mac-term-titulo" data-arrastar><span class="mac-term-titulo-texto" aria-hidden="true"><span class="mac-term-procuracao">${glifo("pasta")}</span><span data-titulo></span></span></div>`
        : "") +
      `<div class="mac-term-area" data-area tabindex="-1" style="padding:${margem.topo}px ${margem.lado}px ${margem.base}px">` +
      `<div class="mac-term-saida" role="log" aria-live="polite" aria-label="Saída do Terminal" data-saida></div>` +
      `<div class="mac-term-linha" data-linha><span class="mac-term-prompt" aria-hidden="true" data-prompt></span>` +
      `<span class="mac-term-campo"><label class="mac-term-oculto" for="${id}" data-rotulo>Comando</label>` +
      `<input id="${id}" class="mac-term-entrada" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="go" aria-describedby="${id}-dica">` +
      `<span class="mac-term-cursor" aria-hidden="true" data-cursor> </span></span></div>` +
      `<div class="mac-term-opcoes" data-opcoes hidden></div>` +
      `</div>` +
      `<p class="mac-term-oculto" id="${id}-dica">Tab completa os nomes; as setas para cima e para baixo andam no histórico; Shift+Tab vai para a saída, onde as setas andam entre as pastas e os arquivos.</p>`;
    this.el = el;
    this.area = el.querySelector("[data-area]")!;
    this.saida = el.querySelector("[data-saida]")!;
    this.linha = el.querySelector("[data-linha]")!;
    this.prompt = el.querySelector("[data-prompt]")!;
    this.entrada = el.querySelector("input")!;
    this.cursor = el.querySelector("[data-cursor]")!;
    this.opcoes = el.querySelector("[data-opcoes]")!;
    this.rotulo = el.querySelector("[data-rotulo]")!;
    this.titulo = el.querySelector<HTMLElement>("[data-titulo]") ?? undefined;
    this.ligar();
    this.iniciar();
    sessoes.add(this);
  }

  // ---------- começo, título e prompt ----------

  /** A sessão nova: o "Last login" (o do login anterior, como no Mac) e o prompt na casa. */
  iniciar() {
    const agora = new Date();
    this.tty = proximoTty++;
    this.pid = 4000 + Math.floor(sorteio(`${agora.getTime()}${this.tty}`) * 5000);
    const antes = ultimoLogin ?? { quando: agora, tty: this.tty };
    ultimoLogin = { quando: agora, tty: this.tty };
    this.saida.textContent = "";
    this.linhasNaSaida = 0;
    this.cwd = CASA;
    this.anterior = CASA;
    this.status = 0;
    this.posHist = historico.length;
    this.bloco(`Last login: ${dataDoLogin(antes.quando)} on ttys${String(antes.tty).padStart(3, "0")}`);
    this.bloco(`<span class="t-fraco">O blog está em ~/blog. Digite </span>${this.itemComando("help", "help")}<span class="t-fraco"> para ver os comandos.</span>`);
    this.atualizarPrompt();
  }

  get pastaCurta() {
    if (this.cwd === CASA) return "~";
    if (this.cwd === "/") return "/";
    return this.cwd.slice(this.cwd.lastIndexOf("/") + 1);
  }

  get pastaMostrada() {
    return this.cwd === CASA ? "~" : this.cwd.startsWith(`${CASA}/`) ? `~${this.cwd.slice(CASA.length)}` : this.cwd;
  }

  textoDoPrompt() {
    return `${USUARIO}@${MAQUINA} ${this.pastaCurta} % `;
  }

  atualizarPrompt() {
    this.prompt.textContent = this.textoDoPrompt();
    this.rotulo.textContent = `Comando, na pasta ${this.pastaMostrada}`;
    this.atualizarTitulo();
  }

  /** "blog — -zsh — 80×24": a pasta (o nome da casa, em ~), o processo e o tamanho. */
  textoDoTitulo() {
    const pasta = this.cwd === CASA ? USUARIO : this.pastaCurta;
    return `${pasta} — -zsh — ${this.cols}×${this.rows}`;
  }

  atualizarTitulo(menus = false) {
    if (!this.titulo) return;
    const t = this.textoDoTitulo();
    if (this.titulo.textContent !== t) {
      this.titulo.textContent = t;
      this.janela?.definirTitulo(t);
      if (menus) this.s.atualizarMenus();
    }
  }

  /** Mede a fonte e a área: as colunas e as linhas do título, e o lugar do cursor. */
  medir(menus = false) {
    this.m = medirFonte(this.tam, this.el);
    const margem = MARGEM[this.tipo];
    const largura = this.area.clientWidth - 2 * margem.lado;
    const altura = this.area.clientHeight - margem.topo - margem.base;
    if (largura > 0) this.cols = Math.max(1, Math.floor(largura / this.m.ch + 0.02));
    if (altura > 0) this.rows = Math.max(1, Math.floor(altura / this.m.lh + 0.02));
    this.el.style.setProperty("--t-ch", `${this.m.ch}px`);
    this.el.style.setProperty("--t-lh", `${this.m.lh}px`);
    this.atualizarTitulo(menus);
    this.posicionarCursor();
  }

  /** O tamanho da janela para 80×24 na fonte atual (o tamanho de fábrica do Terminal). */
  tamanhoDeFabrica(onde: HTMLElement) {
    const m = medirFonte(this.tam, onde);
    const margem = MARGEM.janela;
    return {
      largura: Math.ceil(80 * m.ch + 2 * margem.lado + larguraDaBarra(onde) + 1),
      altura: Math.ceil(24 * m.lh + margem.topo + margem.base + BARRA_DA_JANELA + 1),
    };
  }

  observar() {
    this.observador ??= new ResizeObserver(() => this.medir());
    this.observador.observe(this.area);
    this.medir();
  }

  destruir() {
    this.observador?.disconnect();
    cartao.esconderDe(this.el);
    sessoes.delete(this);
    if (ultimaFocada === this) ultimaFocada = undefined;
  }

  ativar(ativa: boolean) {
    this.ativa = ativa;
    this.el.classList.toggle("ativa", ativa);
    if (!ativa) {
      cartao.esconderDe(this.el);
      this.fecharOpcoes();
    }
    this.reiniciarPiscada();
  }

  // ---------- foco e cursor ----------

  focar() {
    // No toque, o teclado só sobe quando o Cesar toca no Terminal (abrir não cobre a tela com o teclado).
    if (grosso.matches) {
      this.el.focus({ preventScroll: true });
      return;
    }
    this.entrada.focus({ preventScroll: true });
    this.posicionarCursor();
  }

  /** O bloco do cursor em cima do caractere do cursor do campo (a fonte é monoespaçada). */
  posicionarCursor() {
    cancelAnimationFrame(this.quadroDoCursor);
    const e = this.entrada;
    const ini = e.selectionStart ?? e.value.length;
    const fim = e.selectionEnd ?? ini;
    const selecionado = ini !== fim && document.activeElement === e;
    this.cursor.hidden = selecionado;
    if (selecionado) return;
    const escala = e.offsetWidth ? e.getBoundingClientRect().width / e.offsetWidth : 1;
    const campo = e.parentElement!.clientWidth;
    const x = Math.max(0, Math.min(campo - this.m.ch, ini * this.m.ch - e.scrollLeft * escala));
    this.cursor.style.transform = `translateX(${x.toFixed(2)}px)`;
    const c = e.value[ini];
    this.cursor.textContent = c && c !== " " ? c : " ";
  }

  /** O cursor acende de novo a cada tecla (e só então volta a piscar), como no Mac. */
  reiniciarPiscada() {
    for (const a of this.cursor.getAnimations()) a.currentTime = 0;
  }

  depoisDaTecla() {
    cancelAnimationFrame(this.quadroDoCursor);
    this.quadroDoCursor = requestAnimationFrame(() => {
      this.posicionarCursor();
      this.reiniciarPiscada();
    });
  }

  rolarAoFim() {
    this.area.scrollTop = this.area.scrollHeight;
    // Os pedaços do `cat` têm a altura estimada até serem pintados: no quadro seguinte, de novo.
    requestAnimationFrame(() => (this.area.scrollTop = this.area.scrollHeight));
  }

  // ---------- a saída ----------

  bloco(html: string, classe = "", linhas = contarLinhas(html)) {
    const b = document.createElement("div");
    b.className = classe ? `t-bloco ${classe}` : "t-bloco";
    b.innerHTML = html;
    b.dataset.linhas = String(linhas);
    this.saida.append(b);
    this.contar(linhas);
    return b;
  }

  texto(t: string, classe = "") {
    const b = document.createElement("div");
    b.className = classe ? `t-bloco ${classe}` : "t-bloco";
    b.textContent = t;
    const n = contarLinhas(t);
    b.dataset.linhas = String(n);
    this.saida.append(b);
    this.contar(n);
    return b;
  }

  erro(t: string) {
    return this.texto(t, "t-erro");
  }

  /**
   * Um texto grande (o `cat`), de uma vez, em pedaços que o navegador só pinta quando entram na tela
   * (content-visibility), com a altura estimada pelas colunas: o `cat java-25.md` não trava.
   */
  textoLongo(t: string) {
    if (!t) return;
    let corpo = t.replace(/\r\n/g, "\n");
    const semFimDeLinha = !corpo.endsWith("\n");
    if (!semFimDeLinha) corpo = corpo.slice(0, -1);
    const linhas = corpo.split("\n");
    if (linhas.length <= PEDACO) {
      const b = this.texto(corpo);
      if (semFimDeLinha) b.insertAdjacentHTML("beforeend", '<span class="t-inverso t-sem-fim">%</span>');
      return;
    }
    const grupo = document.createElement("div");
    grupo.className = "t-bloco";
    const frag = document.createDocumentFragment();
    let total = 0;
    for (let i = 0; i < linhas.length; i += PEDACO) {
      const parte = linhas.slice(i, i + PEDACO);
      let estimadas = 0;
      for (const l of parte) estimadas += Math.max(1, Math.ceil(l.length / Math.max(20, this.cols)));
      total += estimadas;
      const p = document.createElement("div");
      p.className = "t-pedaco";
      p.style.containIntrinsicBlockSize = `auto ${Math.round(estimadas * this.m.lh)}px`;
      p.textContent = parte.join("\n");
      frag.append(p);
    }
    grupo.append(frag);
    if (semFimDeLinha) grupo.lastElementChild?.insertAdjacentHTML("beforeend", '<span class="t-inverso t-sem-fim">%</span>');
    grupo.dataset.linhas = String(total);
    this.saida.append(grupo);
    this.contar(total);
  }

  /** O "scrollback": passou do limite, as linhas mais antigas vão embora. */
  private contar(n: number) {
    this.linhasNaSaida += n;
    while (this.linhasNaSaida > LIMITE_DE_LINHAS && this.saida.childElementCount > 1) {
      const velho = this.saida.firstElementChild as HTMLElement;
      this.linhasNaSaida -= Number(velho.dataset.linhas) || 1;
      velho.remove();
    }
  }

  limpar() {
    this.saida.textContent = "";
    this.linhasNaSaida = 0;
    this.fecharOpcoes();
    cartao.esconderDe(this.el);
    this.area.scrollTop = 0;
  }

  /** Só os itens da saída mais nova entram no Tab (os outros, pelas setas). */
  private renovarItens() {
    const itens = this.saida.querySelectorAll<HTMLElement>(".t-item");
    for (const i of this.saida.querySelectorAll<HTMLElement>('.t-item[tabindex="0"]')) i.tabIndex = -1;
    const ultimo = itens[itens.length - 1];
    if (ultimo) ultimo.tabIndex = 0;
  }

  // ---------- os itens clicáveis da saída ----------

  itemComando(rotulo: string, inserir: string) {
    return `<span role="button" class="t-item t-cmd" tabindex="-1" data-inserir="${escapar(inserir)}">${escapar(rotulo)}</span>`;
  }

  /** Uma pasta ou um arquivo da saída: o botão (e o quadradinho da cor, nos livros). */
  item(d: Disco, no: No, rotulo: string, barra: boolean) {
    const caminho = escapar(d.absoluto(no));
    if (no.tipo === "pasta") {
      const cor = no.livro ? `<span class="t-cor" style="--cor:${no.livro.cor}" aria-hidden="true"></span>` : "";
      return `${cor}<span role="button" class="t-item t-pasta" tabindex="-1" data-caminho="${caminho}" data-tipo="pasta">${escapar(rotulo)}${barra ? "/" : ""}</span>`;
    }
    if (no.post) {
      return `<span role="button" class="t-item t-arquivo" tabindex="-1" data-caminho="${caminho}" data-tipo="post" data-post="${escapar(no.post.slug)}" aria-description="${escapar(no.post.tituloCompleto)}">${escapar(rotulo)}</span>`;
    }
    return `<span role="button" class="t-item t-arquivo" tabindex="-1" data-caminho="${caminho}" data-tipo="texto">${escapar(rotulo)}</span>`;
  }

  /** O tamanho na tela de um item (o quadradinho da cor vale duas colunas). */
  largura(no: No, rotulo: string, barra: boolean) {
    return rotulo.length + (barra && no.tipo === "pasta" ? 1 : 0) + (no.tipo === "pasta" && no.livro ? 2 : 0);
  }

  /** As colunas do ls (de cima para baixo e depois para o lado, como o ls do BSD). */
  colunas(celulas: { html: string; largura: number }[]) {
    if (!celulas.length) return "";
    const maior = Math.max(...celulas.map((c) => c.largura));
    const passo = maior + 2;
    let ncol = Math.max(1, Math.floor((this.cols + 2) / passo));
    const nlin = Math.ceil(celulas.length / ncol);
    ncol = Math.ceil(celulas.length / nlin);
    const linhas: string[] = [];
    for (let r = 0; r < nlin; r++) {
      let l = "";
      for (let c = 0; c < ncol; c++) {
        const i = c * nlin + r;
        const cel = celulas[i];
        if (!cel) break;
        const ultima = c === ncol - 1 || (c + 1) * nlin + r >= celulas.length;
        l += cel.html + (ultima ? "" : " ".repeat(passo - cel.largura));
      }
      linhas.push(l);
    }
    return linhas.join("\n");
  }

  // ---------- executar ----------

  /** Roda uma linha como se tivesse sido digitada (os cliques na saída). */
  rodar(linha: string) {
    this.fecharOpcoes();
    this.fila = this.fila.then(() => this.executar(linha, true));
    return this.fila;
  }

  private enviar() {
    const linha = this.entrada.value;
    this.entrada.value = "";
    this.rascunho = "";
    this.fecharOpcoes();
    this.posicionarCursor();
    this.fila = this.fila.then(() => this.executar(linha, true));
  }

  private async executar(linha: string, eco: boolean) {
    if (eco) this.bloco(`${escapar(this.textoDoPrompt())}${escapar(linha)}`, "t-eco");
    const limpa = linha.trim();
    if (limpa) {
      if (historico[historico.length - 1] !== limpa) historico.push(limpa);
    }
    this.posHist = historico.length;
    if (!limpa) return this.depois();
    this.cancelado = false;
    const marca = ++this.executando;
    // Comando demorado (a leitura de um arquivo): o prompt some até ele terminar, como no shell.
    const espera = window.setTimeout(() => marca === this.executando && this.linha.setAttribute("data-ocupada", ""), 120);
    try {
      const d = await carregarDisco(this.s);
      const lista = analisar(limpa, (nome) => this.variavel(nome));
      if ("erro" in lista) {
        this.erro(lista.erro);
        this.status = 1;
      } else {
        let anterior: Simples["op"] = null;
        for (const cmd of lista) {
          const pular = (anterior === "&&" && this.status !== 0) || (anterior === "||" && this.status === 0);
          anterior = cmd.op;
          if (pular) continue;
          if (this.cancelado) break;
          this.status = await this.rodarSimples(d, cmd.palavras);
        }
      }
    } catch {
      this.erro("zsh: não deu para ler o disco agora (os dados do blog não chegaram)");
      this.status = 1;
    } finally {
      clearTimeout(espera);
      if (marca === this.executando) this.linha.removeAttribute("data-ocupada");
    }
    this.depois();
  }

  private depois() {
    this.renovarItens();
    this.atualizarPrompt();
    this.rolarAoFim();
    this.posicionarCursor();
  }

  private variavel(nome: string): string {
    const v: Record<string, string> = {
      HOME: CASA,
      USER: USUARIO,
      LOGNAME: USUARIO,
      SHELL: "/bin/zsh",
      PWD: this.cwd,
      OLDPWD: this.anterior,
      TERM: "xterm-256color",
      TERM_PROGRAM: "Apple_Terminal",
      LANG: "pt_BR.UTF-8",
      PATH: "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin",
      HOST: MAQUINA,
      "?": String(this.status),
      "0": "-zsh",
      $: String(this.pid),
    };
    return v[nome] ?? "";
  }

  /** O * e o ? de uma palavra, na pasta dela. Sem nada, o erro do zsh. */
  private expandir(d: Disco, p: Palavra): string[] | null {
    if (!p.glob) return [p.texto];
    const barra = p.texto.lastIndexOf("/");
    const dir = barra >= 0 ? p.texto.slice(0, barra + 1) : "";
    const padrao = p.texto.slice(barra + 1);
    const base = dir ? d.resolver(d.pastaDe(this.cwd), dir) : d.pastaDe(this.cwd);
    if (!base || base.tipo !== "pasta") return null;
    const re = new RegExp(`^${padrao.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\?/g, ".")}$`);
    const achados = base.filhos.filter((f) => re.test(f.nome) && (!f.oculto || padrao.startsWith(".")));
    return achados.length ? achados.map((f) => `${dir}${f.nome}`) : null;
  }

  private async rodarSimples(d: Disco, palavras: Palavra[]): Promise<number> {
    const argv: string[] = [];
    for (const p of palavras) {
      const e = this.expandir(d, p);
      if (!e) {
        this.erro(`zsh: no matches found: ${p.texto}`);
        return 1;
      }
      argv.push(...e);
    }
    let [nome, ...args] = argv;
    if (nome === "ll") {
      nome = "ls";
      args = ["-lh", ...args];
    }
    const cmd = COMANDOS_DO_SHELL[nome];
    if (cmd) return cmd(this, d, args);
    if (nome.includes("/")) {
      const no = d.resolver(d.pastaDe(this.cwd), nome);
      if (no) {
        this.erro(`zsh: permission denied: ${nome}`);
        return 126;
      }
      this.erro(`zsh: no such file or directory: ${nome}`);
      return 127;
    }
    this.erro(`zsh: command not found: ${nome}`);
    return 127;
  }

  get foiCancelado() {
    return this.cancelado;
  }

  pasta(d: Disco) {
    return d.pastaDe(this.cwd);
  }

  irPara(d: Disco, p: Pasta) {
    const novo = d.absoluto(p);
    if (novo !== this.cwd) this.anterior = this.cwd;
    this.cwd = novo;
    this.atualizarPrompt();
  }

  /** ⌃C: a linha com "^C" na saída e um prompt novo (e o comando em andamento para). */
  interromper() {
    if (this.executando && this.linha.hasAttribute("data-ocupada")) {
      this.cancelado = true;
      this.bloco("^C");
      return;
    }
    this.bloco(`${escapar(this.textoDoPrompt())}${escapar(this.entrada.value)}^C`, "t-eco");
    this.entrada.value = "";
    this.rascunho = "";
    this.posHist = historico.length;
    this.fecharOpcoes();
    this.status = 130;
    this.renovarItens();
    this.rolarAoFim();
    this.depoisDaTecla();
  }

  // ---------- histórico ----------

  private andarNoHistorico(passo: number) {
    if (!historico.length) return;
    if (this.posHist === historico.length) this.rascunho = this.entrada.value;
    const nova = Math.max(0, Math.min(historico.length, this.posHist + passo));
    if (nova === this.posHist) return;
    this.posHist = nova;
    this.entrada.value = nova === historico.length ? this.rascunho : historico[nova];
    const fim = this.entrada.value.length;
    this.entrada.setSelectionRange(fim, fim);
    this.fecharOpcoes();
    this.depoisDaTecla();
  }

  // ---------- completar (Tab), como o zsh ----------

  private async completar() {
    const e = this.entrada;
    const valor = e.value;
    const c = this.comp;
    // O Tab de novo, sem mexer em nada: anda pela lista (o menu do zsh).
    if (c && c.valor === valor && c.opcoes.length > 1) {
      if (!c.listado) {
        c.listado = true;
        this.mostrarOpcoes(c);
        return;
      }
      c.indice = (c.indice + 1) % c.opcoes.length;
      const o = c.opcoes[c.indice];
      e.value = c.antes + o.valor + c.depois;
      const pos = (c.antes + o.valor).length;
      e.setSelectionRange(pos, pos);
      c.valor = e.value;
      this.mostrarOpcoes(c);
      this.depoisDaTecla();
      return;
    }
    const d = await carregarDisco(this.s).catch(() => undefined);
    if (!d || e.value !== valor) return;
    const pos = e.selectionStart ?? valor.length;
    const antesDoCursor = valor.slice(0, pos);
    const depois = valor.slice(pos);
    const inicio = Math.max(antesDoCursor.lastIndexOf(" "), antesDoCursor.lastIndexOf(";"), antesDoCursor.lastIndexOf("&")) + 1;
    const palavra = antesDoCursor.slice(inicio);
    const anteriores = antesDoCursor.slice(0, inicio).trim().split(/\s+/).filter(Boolean);
    const comando = anteriores[anteriores.length - 1] === "-a" ? "-a" : (anteriores.length ? anteriores[0] : "");
    let opcoes: Completar["opcoes"] = [];
    let base = antesDoCursor.slice(0, inicio);
    if (!anteriores.length || /[;&]$/.test(antesDoCursor.slice(0, inicio).trim())) {
      opcoes = COMANDOS.filter((n) => n.startsWith(palavra)).map((n) => ({ valor: n, mostra: n, pasta: false }));
    } else if (comando === "man" || comando === "which") {
      opcoes = COMANDOS.filter((n) => n.startsWith(palavra)).map((n) => ({ valor: n, mostra: n, pasta: false }));
    } else if (comando === "-a") {
      opcoes = ["Código", "Finder", "Pré-Visualização", "Terminal"].filter((n) => normalizar(n).startsWith(normalizar(palavra))).map((n) => ({ valor: n.includes(" ") ? `"${n}"` : n, mostra: n, pasta: false }));
    } else {
      const soPastas = comando === "cd";
      const barra = palavra.lastIndexOf("/");
      const dirDigitado = barra >= 0 ? palavra.slice(0, barra + 1) : "";
      const parcial = palavra.slice(barra + 1);
      const dirReal = dirDigitado.startsWith("~") ? CASA + dirDigitado.slice(1) : dirDigitado;
      const pasta = dirReal ? d.resolver(d.pastaDe(this.cwd), dirReal) : d.pastaDe(this.cwd);
      if (pasta?.tipo === "pasta") {
        for (const f of pasta.filhos) {
          if (f.oculto && !parcial.startsWith(".")) continue;
          if (soPastas && f.tipo !== "pasta") continue;
          if (!f.nome.startsWith(parcial)) continue;
          opcoes.push({ valor: dirDigitado + f.nome + (f.tipo === "pasta" ? "/" : ""), mostra: f.nome, pasta: f.tipo === "pasta", cor: f.tipo === "pasta" ? f.livro?.cor : undefined });
        }
      }
      // Sem caminho: o cd também acha os livros (o cdpath), e o cat, o open e o code, os posts de toda parte.
      if (!dirDigitado) {
        const nomes = new Set(opcoes.map((o) => o.mostra));
        if (soPastas) {
          for (const p of [...d.livros.filhos, ...d.series.filhos]) {
            if (p.tipo === "pasta" && p.nome.startsWith(parcial) && !nomes.has(p.nome)) {
              opcoes.push({ valor: `${p.nome}/`, mostra: p.nome, pasta: true, cor: p.livro?.cor });
              nomes.add(p.nome);
            }
          }
        } else if (["cat", "open", "code"].includes(comando)) {
          for (const p of [...d.livros.filhos, ...d.series.filhos]) {
            if (p.tipo !== "pasta") continue;
            for (const f of p.filhos) {
              if (f.nome.startsWith(parcial) && !nomes.has(f.nome)) {
                opcoes.push({ valor: f.nome, mostra: f.nome, pasta: false });
                nomes.add(f.nome);
              }
            }
          }
        }
      }
      base = antesDoCursor.slice(0, inicio);
    }
    opcoes.sort((a, b) => (a.mostra < b.mostra ? -1 : a.mostra > b.mostra ? 1 : 0));
    if (!opcoes.length) return this.sinal();
    if (opcoes.length === 1) {
      const o = opcoes[0];
      const fim = o.pasta ? "" : " ";
      e.value = base + o.valor + (depois.startsWith(" ") ? "" : fim) + depois;
      const p2 = (base + o.valor + (depois.startsWith(" ") ? "" : fim)).length;
      e.setSelectionRange(p2, p2);
      this.fecharOpcoes();
      this.depoisDaTecla();
      return;
    }
    // Várias: o começo comum; se ele não andar, a lista embaixo da linha.
    let comum = opcoes[0].valor;
    for (const o of opcoes) while (!o.valor.startsWith(comum)) comum = comum.slice(0, -1);
    const novo = { antes: base, depois, opcoes, indice: -1, valor: "", listado: false };
    if (comum.length > palavra.length) {
      e.value = base + comum + depois;
      const p2 = (base + comum).length;
      e.setSelectionRange(p2, p2);
      novo.valor = e.value;
      this.comp = novo;
      this.depoisDaTecla();
      return;
    }
    novo.valor = valor;
    novo.listado = true;
    this.comp = novo;
    this.mostrarOpcoes(novo);
  }

  /** O "bip" do Terminal sem som: a linha pisca de leve (o "sino visual" do Mac). */
  private sinal() {
    if (this.s.reduzido.matches) return;
    this.linha.animate([{ opacity: 0.45 }, { opacity: 1 }], { duration: 160, easing: "ease-out" });
  }

  private mostrarOpcoes(c: Completar) {
    const celulas = c.opcoes.map((o, i) => {
      const cor = o.cor ? `<span class="t-cor" style="--cor:${o.cor}" aria-hidden="true"></span>` : "";
      const rot = `${escapar(o.mostra)}${o.pasta ? "/" : ""}`;
      return {
        html: `${cor}<span role="button" class="t-item t-opcao${o.pasta ? " t-pasta" : ""}${i === c.indice ? " t-inverso" : ""}" tabindex="-1" data-opcao="${i}">${rot}</span>`,
        largura: o.mostra.length + (o.pasta ? 1 : 0) + (o.cor ? 2 : 0),
      };
    });
    this.opcoes.innerHTML = this.colunas(celulas);
    this.opcoes.hidden = false;
    this.rolarAoFim();
  }

  fecharOpcoes() {
    this.comp = undefined;
    if (!this.opcoes.hidden) {
      this.opcoes.hidden = true;
      this.opcoes.textContent = "";
    }
  }

  private escolherOpcao(i: number) {
    const c = this.comp;
    const o = c?.opcoes[i];
    if (!c || !o) return;
    const fim = o.pasta ? "" : " ";
    this.entrada.value = c.antes + o.valor + fim + c.depois;
    const p = (c.antes + o.valor + fim).length;
    this.fecharOpcoes();
    this.entrada.focus({ preventScroll: true });
    this.entrada.setSelectionRange(p, p);
    this.depoisDaTecla();
  }

  inserir(texto: string) {
    const e = this.entrada;
    const ini = e.selectionStart ?? e.value.length;
    const fim = e.selectionEnd ?? ini;
    e.value = e.value.slice(0, ini) + texto + e.value.slice(fim);
    const p = ini + texto.length;
    if (!grosso.matches || document.activeElement === e) e.focus({ preventScroll: true });
    e.setSelectionRange(p, p);
    this.fecharOpcoes();
    this.depoisDaTecla();
  }

  // ---------- fonte ----------

  mudarFonte(passo: number) {
    let i = TAMANHOS.indexOf(this.tam);
    if (i < 0) i = TAMANHOS.findIndex((t) => t > this.tam);
    const novo = passo === 0 ? (this.s.estreito.matches ? TAMANHO_CELULAR : TAMANHO_PADRAO) : TAMANHOS[Math.max(0, Math.min(TAMANHOS.length - 1, i + passo))];
    if (novo === undefined || novo === this.tam) return this.sinal();
    this.tam = novo;
    this.el.style.setProperty("--t-tam", String(novo));
    this.medir(true);
    this.rolarAoFim();
  }

  selecionarTudo() {
    this.area.focus({ preventScroll: true });
    const r = document.createRange();
    r.selectNodeContents(this.saida);
    const sel = getSelection();
    sel?.removeAllRanges();
    sel?.addRange(r);
  }

  temSelecao() {
    const sel = getSelection();
    return Boolean(sel && !sel.isCollapsed && this.el.contains(sel.anchorNode));
  }

  // ---------- teclas e cliques ----------

  /** Os atalhos que valem em qualquer lugar da sessão (o campo, a saída, a janela). */
  atalho(e: KeyboardEvent): boolean {
    const cmd = MAC ? e.metaKey : e.ctrlKey;
    if (cmd && !e.altKey) {
      const k = e.key.toLowerCase();
      if (k === "=" || k === "+") return this.feito(e, () => this.mudarFonte(1));
      if (k === "-" || k === "_") return this.feito(e, () => this.mudarFonte(-1));
      if (k === "0") return this.feito(e, () => this.mudarFonte(0));
      if (k === "k") return this.feito(e, () => this.limpar());
      if (k === "a" && !e.shiftKey) return this.feito(e, () => this.selecionarTudo());
    }
    if (e.ctrlKey && !e.metaKey && !e.altKey && e.key.toLowerCase() === "l") return this.feito(e, () => this.limpar());
    return false;
  }

  private feito(e: KeyboardEvent, fazer: () => void) {
    e.preventDefault();
    e.stopPropagation();
    fazer();
    return true;
  }

  /** Uma tecla de letra com o foco fora do campo: o foco volta para ele e a letra entra lá. */
  digitarFora(e: KeyboardEvent) {
    if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey || e.isComposing) return false;
    if ((e.target as Element).closest?.(".t-item, button") && (e.key === " " || e.key === "Enter")) return false;
    this.entrada.focus({ preventScroll: true });
    const fim = this.entrada.value.length;
    this.entrada.setSelectionRange(fim, fim);
    this.rolarAoFim();
    return true;
  }

  private teclaNoCampo(e: KeyboardEvent) {
    if (e.isComposing) return;
    const so = !e.metaKey && !e.altKey;
    if (e.key === "Enter" && so && !e.ctrlKey) {
      e.preventDefault();
      e.stopPropagation();
      this.enviar();
      return;
    }
    if (e.key === "Tab" && !e.shiftKey && so && !e.ctrlKey) {
      e.preventDefault();
      e.stopPropagation();
      void this.completar();
      return;
    }
    if ((e.key === "ArrowUp" || e.key === "ArrowDown") && so && !e.ctrlKey && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      this.andarNoHistorico(e.key === "ArrowUp" ? -1 : 1);
      return;
    }
    if (e.key === "Escape" && (!this.opcoes.hidden || cartao.visivel())) {
      e.preventDefault();
      e.stopPropagation();
      this.fecharOpcoes();
      cartao.esconder();
      return;
    }
    if (e.ctrlKey && so) {
      const k = e.key.toLowerCase();
      // ⌃C: no Windows e no Linux, com texto escolhido, é copiar.
      if (k === "c") {
        if (!MAC && this.temSelecao()) return;
        e.preventDefault();
        e.stopPropagation();
        this.interromper();
        return;
      }
      const fim = this.entrada.value.length;
      const pos = this.entrada.selectionStart ?? fim;
      const mover = (p: number) => {
        e.preventDefault();
        e.stopPropagation();
        this.entrada.setSelectionRange(p, p);
        this.depoisDaTecla();
      };
      if (k === "a") return mover(0);
      if (k === "e") return mover(fim);
      if (k === "u") {
        e.preventDefault();
        e.stopPropagation();
        this.entrada.value = this.entrada.value.slice(pos);
        return mover(0);
      }
      if (k === "k") {
        e.preventDefault();
        e.stopPropagation();
        this.entrada.value = this.entrada.value.slice(0, pos);
        return mover(pos);
      }
    }
    if (this.atalho(e)) return;
    this.depoisDaTecla();
  }

  /**
   * Os itens da saída (pastas, arquivos, comandos do help) são trechos do texto com role="button", e não
   * <button>: assim um nome comprido quebra no fim da linha, como no terminal. Enter e Espaço abrem; as
   * setas andam entre eles.
   */
  private teclaNaSaida(e: KeyboardEvent) {
    const alvo = (e.target as Element).closest<HTMLElement>(".t-item");
    if (!alvo) return false;
    if ((e.key === "Enter" || e.key === " ") && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      e.stopPropagation();
      alvo.click();
      return true;
    }
    const itens = [...this.saida.querySelectorAll<HTMLElement>(".t-item")];
    const i = itens.indexOf(alvo);
    let j = -1;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") j = Math.min(itens.length - 1, i + 1);
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") j = Math.max(0, i - 1);
    else if (e.key === "Home") j = 0;
    else if (e.key === "End") j = itens.length - 1;
    if (j < 0) return false;
    e.preventDefault();
    e.stopPropagation();
    alvo.tabIndex = -1;
    itens[j].tabIndex = 0;
    itens[j].focus();
    return true;
  }

  private ligar() {
    const e = this.entrada;
    e.addEventListener("keydown", (ev) => this.teclaNoCampo(ev));
    e.addEventListener("input", () => {
      if (this.comp && this.comp.valor !== e.value) this.fecharOpcoes();
      this.posHist = historico.length;
      this.depoisDaTecla();
    });
    e.addEventListener("scroll", () => this.posicionarCursor());
    e.addEventListener("focus", () => {
      this.posicionarCursor();
      if (grosso.matches) this.ajustarTeclado();
    });
    e.addEventListener("blur", () => this.posicionarCursor());
    e.addEventListener("select", () => this.posicionarCursor());

    this.el.addEventListener("keydown", (ev) => {
      if (ev.target === e) return;
      if (this.atalho(ev)) return;
      if (this.saida.contains(ev.target as Node) && this.teclaNaSaida(ev)) return;
      if (this.opcoes.contains(ev.target as Node) && this.teclaNaSaida(ev)) return;
      this.digitarFora(ev);
    });

    this.el.addEventListener("focusin", () => {
      ultimaFocada = this;
      if (this.tipo === "suspenso" && this.dono?.visivel) this.ativar(true);
    });

    // O colar com o foco na saída vai para o prompt.
    this.el.addEventListener("paste", (ev) => {
      if (ev.target === e) return;
      const t = ev.clipboardData?.getData("text/plain");
      if (!t) return;
      ev.preventDefault();
      this.inserir(t.replace(/\r?\n+$/, "").replace(/\r?\n/g, " "));
    });

    // O clique nos itens: a pasta entra e lista, o post abre, o texto mostra; o do help escreve no prompt.
    const clique = (ev: MouseEvent) => {
      const item = (ev.target as Element).closest<HTMLElement>(".t-item");
      if (!item) return false;
      if (item.dataset.opcao) {
        this.escolherOpcao(Number(item.dataset.opcao));
        return true;
      }
      // Os comandos do help: o help roda; os outros vão para o prompt, prontos para completar.
      const cmd = item.dataset.inserir;
      if (cmd) {
        if (cmd === "help") void this.rodar("help");
        else {
          this.entrada.value = "";
          this.inserir(`${cmd} `);
        }
        return true;
      }
      void this.abrirItem(item);
      return true;
    };
    this.saida.addEventListener("click", (ev) => void clique(ev));
    this.opcoes.addEventListener("click", (ev) => void clique(ev));

    // O clique num lugar vazio devolve o foco ao prompt (sem desfazer uma seleção de texto).
    this.el.addEventListener("click", (ev) => {
      const alvo = ev.target as Element;
      if (alvo.closest(".t-item, button, input, [role='separator'], [data-arrastar]")) return;
      if (getSelection()?.isCollapsed === false) return;
      this.entrada.focus({ preventScroll: true });
      if (grosso.matches) this.ajustarTeclado();
    });

    // O cartão com o desenho: no hover (mouse) e no foco (teclado).
    this.saida.addEventListener("pointerover", (ev) => {
      if (ev.pointerType === "touch") return;
      const item = (ev.target as Element).closest<HTMLElement>(".t-item[data-post]");
      if (item) void cartao.mostrar(item, this, false);
    });
    this.saida.addEventListener("pointerout", (ev) => {
      const de = (ev.target as Element).closest(".t-item[data-post]");
      const para = (ev.relatedTarget as Element | null)?.closest?.(".t-item[data-post]");
      if (de && !para) cartao.esconder(80);
    });
    this.saida.addEventListener("focusin", (ev) => {
      const item = (ev.target as Element).closest<HTMLElement>(".t-item[data-post]");
      if (item && item.matches(":focus-visible")) void cartao.mostrar(item, this, true);
      else cartao.esconderDe(this.el);
    });
    this.saida.addEventListener("focusout", (ev) => {
      const para = (ev.relatedTarget as Element | null)?.closest?.(".t-item[data-post]");
      if (!para) cartao.esconderDe(this.el);
    });
    this.area.addEventListener("scroll", () => cartao.esconderDe(this.el), { passive: true });
  }

  /** O que o clique num item faz: o comando aparece na saída, como se tivesse sido digitado. */
  private async abrirItem(item: HTMLElement) {
    const d = await carregarDisco(this.s).catch(() => undefined);
    if (!d) return;
    const no = d.resolver(d.raiz, item.dataset.caminho ?? "");
    if (!no) return;
    cartao.esconder();
    const rel = d.relativo(no, this.pasta(d));
    const tipo = item.dataset.tipo;
    if (tipo === "pasta") await this.rodar(rel === "." ? "ls" : `cd ${rel} && ls`);
    else if (tipo === "post") await this.rodar(`open ${rel}`);
    else await this.rodar(`cat ${rel}`);
    const aqui = this.tipo === "janela" ? this.janela?.el.hasAttribute("data-ativa") : this.dono?.visivel;
    if (aqui && !grosso.matches && this.el.isConnected && tipo !== "post") this.entrada.focus({ preventScroll: true });
  }

  /** Onde o cartão do desenho mora: a tela do computador (janelas) ou o poço do suspenso. */
  hostDoCartao(): HTMLElement {
    return this.dono?.poco ?? this.s.tela;
  }

  // ---------- celular: o teclado virtual não cobre o prompt ----------

  private ajustandoTeclado = false;

  ajustarTeclado() {
    const vv = window.visualViewport;
    if (!vv) return;
    const aplicar = () => {
      const base = MARGEM[this.tipo].base;
      if (document.activeElement !== this.entrada) {
        this.area.style.paddingBottom = `${base}px`;
        return;
      }
      const baixo = vv.offsetTop + vv.height;
      const r = this.area.getBoundingClientRect();
      const coberto = Math.max(0, r.bottom - baixo);
      this.area.style.paddingBottom = `${base + (coberto > 0 ? coberto + 8 : 0)}px`;
      this.area.scrollTop = this.area.scrollHeight;
    };
    aplicar();
    if (this.ajustandoTeclado) return;
    this.ajustandoTeclado = true;
    const pararSeSaiu = () => {
      if (document.activeElement === this.entrada) return;
      vv.removeEventListener("resize", aplicar);
      vv.removeEventListener("scroll", aplicar);
      this.entrada.removeEventListener("blur", pararSeSaiu);
      this.area.style.paddingBottom = `${MARGEM[this.tipo].base}px`;
      this.ajustandoTeclado = false;
    };
    vv.addEventListener("resize", aplicar);
    vv.addEventListener("scroll", aplicar);
    this.entrada.addEventListener("blur", pararSeSaiu);
  }
}

// ---------- os comandos ----------

type Comando = (ses: Sessao, d: Disco, args: string[]) => number | Promise<number>;

const AJUDA: [string, string][] = [
  ["ls [-l] [pasta]", "o que tem na pasta (com -l, a data e o tamanho)"],
  ["cd <pasta>", "entra na pasta (.. sobe, - volta, sem nada vai para ~)"],
  ["pwd", "onde você está"],
  ["tree [pasta]", "a árvore das pastas, com os artigos"],
  ["cat <arquivo>", "o texto cru do artigo, em Markdown"],
  ["open <arquivo>", "abre o artigo na Pré-Visualização"],
  ["open <pasta>", "abre a pasta no Finder (open . abre esta)"],
  ["code <arquivo>", "abre o artigo no Código"],
  ["history", "os comandos que você já digitou"],
  ["clear", "limpa a tela"],
  ["man <comando>", "o manual de cada comando"],
];

const MANUAIS: Record<string, { sinopse: string; nome: string; texto: string[] }> = {
  ls: {
    nome: "lista o que tem numa pasta",
    sinopse: "ls [-1AaFhlrt] [arquivo ...]",
    texto: [
      "Lista as pastas e os arquivos, em colunas. As pastas vêm em azul e com a",
      "barra no fim (o alias do ~/.zshrc). Com -l, uma linha por arquivo: as",
      "permissões, o dono, o tamanho em bytes e a data; com -h, o tamanho em K",
      "e M; -a mostra os escondidos; -t ordena pela data; -r inverte a ordem.",
      "O ll é o ls -lh.",
    ],
  },
  cd: {
    nome: "muda de pasta",
    sinopse: "cd [pasta | - | ~]",
    texto: [
      "Entra na pasta. Sem nada, volta para a casa (~); com -, volta para a",
      "pasta de antes; .. sobe uma. O cdpath do ~/.zshrc faz o cd achar os",
      "livros e as séries de qualquer lugar: cd dados, cd java.",
    ],
  },
  pwd: { nome: "mostra a pasta atual", sinopse: "pwd", texto: ["Imprime o caminho completo da pasta onde você está."] },
  tree: {
    nome: "mostra as pastas em árvore",
    sinopse: "tree [-ad] [-L nível] [pasta]",
    texto: ["Desenha a árvore da pasta, com os arquivos. -d mostra só as pastas; -L", "para no nível pedido; -a mostra os escondidos."],
  },
  cat: {
    nome: "mostra o conteúdo de um arquivo",
    sinopse: "cat [-n] arquivo ...",
    texto: [
      "Imprime o arquivo inteiro. Nos artigos, é o Markdown do repositório, com",
      "o cabeçalho (o frontmatter). Com -n, numera as linhas. O nome do artigo",
      "basta: o cat acha o arquivo em qualquer livro.",
    ],
  },
  open: {
    nome: "abre arquivos e pastas",
    sinopse: "open [-R] [-a aplicativo] arquivo ...",
    texto: [
      "Abre o artigo na Pré-Visualização e a pasta no Finder. Com -a, no",
      "aplicativo pedido (Código, Finder, Pré-Visualização ou Terminal); com",
      "-R, mostra o arquivo no Finder. Quando dá certo, não imprime nada.",
    ],
  },
  code: { nome: "abre no Código", sinopse: "code [arquivo | pasta]", texto: ["Abre o arquivo no Código, o editor do computador (o mesmo que", "open -a Código)."] },
  clear: { nome: "limpa a tela", sinopse: "clear", texto: ["Limpa a janela. O ⌃L faz o mesmo, sem apagar o que está digitado."] },
  history: { nome: "os comandos de antes", sinopse: "history [primeiro]", texto: ["Lista os últimos comandos, numerados. As setas ↑ e ↓ andam neles."] },
  echo: { nome: "escreve o que receber", sinopse: "echo [-n] [texto ...]", texto: ["Imprime o texto. Entende as variáveis: echo $HOME, echo $SHELL."] },
  date: { nome: "a data e a hora", sinopse: "date", texto: ["Imprime a data e a hora de agora, no fuso do computador."] },
  whoami: { nome: "quem está usando", sinopse: "whoami", texto: ["Imprime o nome do usuário."] },
  which: { nome: "onde fica um comando", sinopse: "which comando ...", texto: ["Mostra o caminho do programa, ou avisa que ele é do próprio shell."] },
  man: { nome: "os manuais", sinopse: "man comando", texto: ["Mostra o manual curto de um comando. help lista todos."] },
  help: { nome: "a lista dos comandos", sinopse: "help", texto: ["Lista os comandos deste Terminal, com um exemplo de cada."] },
  exit: { nome: "sai do shell", sinopse: "exit", texto: ["Fecha a janela. No Terminal suspenso, recolhe o painel e começa uma", "sessão nova da próxima vez."] },
};

const ONDE: Record<string, string> = {
  ls: "/bin/ls",
  cat: "/bin/cat",
  date: "/bin/date",
  pwd: "pwd: shell built-in command",
  cd: "cd: shell built-in command",
  echo: "echo: shell built-in command",
  history: "history: shell built-in command",
  exit: "exit: shell built-in command",
  which: "which: shell built-in command",
  help: "help: shell built-in command",
  ll: "ll: aliased to ls -lh",
  open: "/usr/bin/open",
  clear: "/usr/bin/clear",
  whoami: "/usr/bin/whoami",
  man: "/usr/bin/man",
  tree: "/opt/homebrew/bin/tree",
  code: "/usr/local/bin/code",
};

/** O arquivo de um argumento: pelo caminho e, se não achar, pelo nome do post ou do livro (o atalho). */
function acharArquivo(ses: Sessao, d: Disco, alvo: string, atalho = true): No | null {
  return d.resolver(ses.pasta(d), alvo) ?? (atalho && !alvo.includes("/") ? (d.post(alvo) ?? d.peloCdpath(alvo)) : null);
}

/** O caminho que o Mac mostraria num erro (o absoluto, a partir da pasta atual). */
function absolutoDe(ses: Sessao, alvo: string) {
  if (alvo.startsWith("/")) return alvo;
  return `${ses.cwd === "/" ? "" : ses.cwd}/${alvo}`;
}

const tamanhos = new Map<string, number>();

async function tamanhoDe(no: No): Promise<number> {
  if (no.tipo === "pasta") return 64 + 32 * no.filhos.length;
  const chave = no.post?.slug ?? no.nome;
  const ja = tamanhos.get(chave);
  if (ja !== undefined && no.nome !== ".zsh_history") return ja;
  let n: number;
  try {
    n = bytes(await no.conteudo());
  } catch {
    n = (no.post?.minutos ?? 1) * 1500;
  }
  tamanhos.set(chave, n);
  return n;
}

/** Abre um app pelo sistema e, do suspenso, recolhe o painel para mostrar a janela que abriu. */
async function abrirNoApp(ses: Sessao, app: "finder" | "previa" | "editor" | "terminal", pedido?: unknown) {
  // Fora do computador, quem decide o que cada open faz é o blog (o post abre na página, o resto entra no computador).
  if (ses.dono?.fora) {
    ses.dono.recolher(false);
    await ses.s.abrirApp(app, pedido);
    return;
  }
  if (app === "terminal") {
    if (ses.dono) ses.dono.recolher(false);
    abrirJanela(pedido as { cwd?: string } | undefined);
    return;
  }
  await ses.s.abrirApp(app, pedido);
  const j = ses.s.janelasDo(app).at(-1);
  if (ses.dono) ses.dono.recolher(false);
  if (j && !j.minimizada) {
    j.ativar();
    if (!j.el.contains(document.activeElement)) j.el.focus({ preventScroll: true });
  }
}

const COMANDOS_DO_SHELL: Record<string, Comando> = {
  help(ses) {
    const largura = Math.max(...AJUDA.map(([c]) => c.length)) + 3;
    // Na tela estreita (o celular), a explicação vai para a linha de baixo, em vez de quebrar no meio.
    const cabe = 2 + largura + Math.max(...AJUDA.map(([, o]) => o.length)) <= ses.cols;
    const linha = (c: string, o: string) => {
      const nome = c.split(" ")[0];
      const comando = `  ${ses.itemComando(nome, nome)}${escapar(c.slice(nome.length))}`;
      return cabe ? `${comando}${" ".repeat(largura - c.length)}<span class="t-fraco">${escapar(o)}</span>` : `${comando}\n      <span class="t-fraco">${escapar(o)}</span>`;
    };
    ses.bloco(
      [
        "O blog está em ~/blog: os livros e as séries são pastas, e os artigos, arquivos.",
        "",
        ...AJUDA.map(([c, o]) => linha(c, o)),
        linha("exit", ses.tipo === "suspenso" ? "recolhe o Terminal" : "fecha a janela"),
        "",
        `  <span class="t-fraco">E também:</span> ${["echo", "date", "whoami", "which"].map((n) => ses.itemComando(n, n)).join(", ")}<span class="t-fraco">.</span>`,
        "",
        ...(grosso.matches
          ? ['<span class="t-fraco">Toque numa pasta para entrar e num arquivo para abrir.</span>']
          : [
              '<span class="t-fraco">Tab completa os nomes; ↑ e ↓ andam no histórico; ⌃C cancela; ⌃L limpa.</span>',
              `<span class="t-fraco">${ses.dono?.fora ? "` ou esc recolhem o Terminal." : "⌃` desce o Terminal suspenso, do alto."} Clique numa pasta para entrar</span>`,
              '<span class="t-fraco">e num arquivo para abrir.</span>',
            ]),
      ].join("\n"),
    );
    return 0;
  },

  clear(ses) {
    ses.limpar();
    return 0;
  },

  pwd(ses) {
    ses.texto(ses.cwd);
    return 0;
  },

  whoami(ses) {
    ses.texto(USUARIO);
    return 0;
  },

  date(ses) {
    ses.texto(dataDoDate(new Date()));
    return 0;
  },

  echo(ses, _d, args) {
    let semFim = false;
    if (args[0] === "-n") {
      semFim = true;
      args = args.slice(1);
    }
    const b = ses.texto(args.join(" "));
    // Sem a quebra de linha no fim, o zsh marca com o % invertido (o PROMPT_SP).
    if (semFim) b.insertAdjacentHTML("beforeend", '<span class="t-inverso t-sem-fim">%</span>');
    return 0;
  },

  history(ses, _d, args) {
    const de = args[0] && /^-?\d+$/.test(args[0]) ? Number(args[0]) : historico.length - 15;
    const inicio = de < 0 ? Math.max(1, historico.length + de) : Math.max(1, de);
    const linhas: string[] = [];
    for (let i = inicio; i <= historico.length; i++) linhas.push(`${String(i).padStart(5)}  ${historico[i - 1]}`);
    if (linhas.length) ses.texto(linhas.join("\n"));
    return 0;
  },

  which(ses, _d, args) {
    let status = 0;
    const linhas: string[] = [];
    for (const a of args) {
      if (ONDE[a]) linhas.push(ONDE[a]);
      else {
        linhas.push(`${a} not found`);
        status = 1;
      }
    }
    if (linhas.length) ses.texto(linhas.join("\n"));
    return status;
  },

  man(ses, _d, args) {
    const nome = args[0];
    if (!nome) {
      ses.texto("What manual page do you want?\nFor example, try 'man man'.");
      return 1;
    }
    const m = MANUAIS[nome === "ll" ? "ls" : nome];
    if (!m) {
      ses.erro(`No manual entry for ${nome}`);
      return 1;
    }
    const cab = `${nome}(1)`;
    const meio = "Comandos gerais";
    const largura = Math.min(ses.cols, 78);
    const vao = Math.max(2, largura - cab.length * 2 - meio.length);
    const e = Math.floor(vao / 2);
    const recuo = (l: string) => `     ${escapar(l)}`;
    ses.bloco(
      [
        `${cab}${" ".repeat(e)}${meio}${" ".repeat(vao - e)}${cab}`,
        "",
        '<b class="t-negrito">Nome</b>',
        recuo(`${nome} – ${m.nome}`),
        "",
        '<b class="t-negrito">Sinopse</b>',
        recuo(m.sinopse),
        "",
        '<b class="t-negrito">Descrição</b>',
        ...m.texto.map(recuo),
        "",
        `<span class="t-fraco">macOS 27${" ".repeat(Math.max(2, largura - 8 - 20))}1 de outubro de 2026</span>`,
      ].join("\n"),
    );
    return 0;
  },

  cd(ses, d, args) {
    if (args.length > 1) {
      ses.erro(`cd: string not in pwd: ${args[0]}`);
      return 1;
    }
    const alvo = args[0];
    let no: No | null;
    let imprimir = false;
    if (alvo === undefined || alvo === "") no = d.casa;
    else if (alvo === "-") {
      no = d.resolver(d.raiz, ses.anterior);
      imprimir = true;
    } else {
      no = d.resolver(ses.pasta(d), alvo);
      // O cdpath: o zsh acha os livros e as séries de qualquer lugar, e mostra onde foi parar.
      if (!no && !alvo.startsWith("/") && !alvo.startsWith(".")) {
        no = d.peloCdpath(alvo);
        imprimir = Boolean(no);
      }
    }
    if (!no) {
      ses.erro(`cd: no such file or directory: ${alvo}`);
      return 1;
    }
    if (no.tipo !== "pasta") {
      ses.erro(`cd: not a directory: ${alvo}`);
      return 1;
    }
    ses.irPara(d, no);
    if (imprimir) ses.texto(d.mostrar(no));
    return 0;
  },

  async ls(ses, d, args) {
    const { op, resto, invalida } = opcoesDe(args, "1aAFGhlrt");
    if (invalida) {
      ses.erro(`ls: invalid option -- ${invalida}\nusage: ls [-1AaFGhlrt] [file ...]`);
      return 1;
    }
    const alvos = resto.length ? resto : ["."];
    const soltos: { no: No; nome: string }[] = [];
    const pastas: { no: Pasta; nome: string }[] = [];
    let status = 0;
    for (const a of alvos) {
      const no = d.resolver(ses.pasta(d), a);
      if (!no) {
        ses.erro(`ls: ${a}: No such file or directory`);
        status = 1;
      } else if (no.tipo === "pasta") pastas.push({ no, nome: a });
      else soltos.push({ no, nome: a });
    }
    const longo = op.has("l");
    const ordenar = (lista: { no: No; nome: string }[]) => {
      if (op.has("t")) lista.sort((a, b) => b.no.data.getTime() - a.no.data.getTime());
      if (op.has("r")) lista.reverse();
      return lista;
    };
    const escrever = async (lista: { no: No; nome: string }[], total: boolean) => {
      if (!lista.length) return;
      if (longo) {
        const agora = new Date();
        const tams = await Promise.all(lista.map((x) => tamanhoDe(x.no)));
        if (ses.foiCancelado) return;
        const links = lista.map((x) => (x.no.tipo === "pasta" ? x.no.filhos.length + 2 : 1));
        const textos = tams.map((t) => (op.has("h") ? humano(t) : String(t)));
        const wl = Math.max(...links.map((l) => String(l).length));
        const wt = Math.max(...textos.map((t) => t.length));
        const linhas = lista.map((x, i) => {
          const modo = x.no.tipo === "pasta" ? "drwxr-xr-x" : "-rw-r--r--";
          return `${modo}  ${String(links[i]).padStart(wl)} ${USUARIO}  staff  ${textos[i].padStart(wt)} ${dataDoLs(x.no.data, agora)} ${ses.item(d, x.no, x.nome, true)}`;
        });
        if (total) {
          const blocos = lista.reduce((s, x, i) => s + (x.no.tipo === "arquivo" ? Math.ceil(tams[i] / 4096) * 8 : 0), 0);
          linhas.unshift(`total ${blocos}`);
        }
        ses.bloco(linhas.join("\n"));
      } else if (op.has("1")) {
        ses.bloco(lista.map((x) => (x.no.tipo === "pasta" && x.no.livro ? "" : "") + ses.item(d, x.no, x.nome, true)).join("\n"));
      } else {
        ses.bloco(ses.colunas(lista.map((x) => ({ html: ses.item(d, x.no, x.nome, true), largura: ses.largura(x.no, x.nome, true) }))));
      }
    };
    await escrever(ordenar(soltos), false);
    for (const [i, p] of pastas.entries()) {
      if (ses.foiCancelado) break;
      if (alvos.length > 1) ses.texto(`${soltos.length || i ? "\n" : ""}${p.nome}:`);
      let filhos: { no: No; nome: string }[] = p.no.filhos.filter((f) => !f.oculto || op.has("a") || op.has("A")).map((f) => ({ no: f, nome: f.nome }));
      if (op.has("a")) filhos = [{ no: p.no, nome: "." }, { no: p.no.pai ?? p.no, nome: ".." }, ...filhos];
      if (!filhos.length) {
        if (longo) ses.texto("total 0");
        continue;
      }
      await escrever(ordenar(filhos), true);
    }
    return status;
  },

  tree(ses, d, args) {
    // O tree aceita as opções em qualquer lugar (tree ~/blog -L 2), ao contrário do ls do BSD.
    const opcoes: string[] = [];
    const resto: string[] = [];
    for (let i = 0; i < args.length; i++) {
      if (args[i].startsWith("-") && args[i] !== "-") {
        opcoes.push(args[i]);
        if (args[i] === "-L" && i + 1 < args.length) opcoes.push(args[++i]);
      } else resto.push(args[i]);
    }
    const { op, valores, invalida } = opcoesDe(opcoes, "ad", "L");
    if (invalida) {
      ses.erro(`tree: Invalid argument -\`${invalida}'.\nusage: tree [-ad] [-L level] [<directory list>]`);
      return 1;
    }
    const nivel = valores.has("L") ? Number(valores.get("L")) : Infinity;
    if (valores.has("L") && !(nivel > 0)) {
      ses.erro("tree: Invalid level, must be greater than 0.");
      return 1;
    }
    // Uma árvore por pasta pedida, e a conta de todas no fim (como o tree).
    let pastas = 0;
    let arquivos = 0;
    let status = 0;
    const linhas: string[] = [];
    const ramo = (ultimo: boolean) => `<span class="t-ramo">${ultimo ? "└── " : "├── "}</span>`;
    const cano = (ultimo: boolean) => (ultimo ? "    " : '<span class="t-ramo">│   </span>');
    const descer = (p: Pasta, prefixo: string, n: number) => {
      const filhos = p.filhos.filter((f) => (!f.oculto || op.has("a")) && (!op.has("d") || f.tipo === "pasta"));
      filhos.forEach((f, i) => {
        const ultimo = i === filhos.length - 1;
        linhas.push(`${prefixo}${ramo(ultimo)}${ses.item(d, f, f.nome, false)}`);
        if (f.tipo === "pasta") {
          pastas++;
          if (n < nivel) descer(f, prefixo + cano(ultimo), n + 1);
        } else arquivos++;
      });
    };
    for (const alvo of resto.length ? resto : ["."]) {
      const raiz = d.resolver(ses.pasta(d), alvo);
      if (!raiz || raiz.tipo !== "pasta") {
        linhas.push(`${escapar(alvo)}  [error opening dir]`);
        status = 2;
        continue;
      }
      linhas.push(ses.item(d, raiz, alvo, false));
      descer(raiz, "", 1);
    }
    linhas.push("", `${pastas} director${pastas === 1 ? "y" : "ies"}${op.has("d") ? "" : `, ${arquivos} file${arquivos === 1 ? "" : "s"}`}`);
    ses.bloco(linhas.join("\n"));
    return status;
  },

  async cat(ses, d, args) {
    const { op, resto, invalida } = opcoesDe(args, "n");
    if (invalida) {
      ses.erro(`cat: illegal option -- ${invalida}\nusage: cat [-n] [file ...]`);
      return 1;
    }
    if (!resto.length) {
      ses.erro("usage: cat [-n] [file ...]");
      return 1;
    }
    let status = 0;
    for (const a of resto) {
      const no = acharArquivo(ses, d, a);
      if (!no) {
        ses.erro(`cat: ${a}: No such file or directory`);
        status = 1;
        continue;
      }
      if (no.tipo === "pasta") {
        ses.erro(`cat: ${a}: Is a directory`);
        status = 1;
        continue;
      }
      let t: string;
      try {
        t = await no.conteudo();
      } catch {
        ses.erro(`cat: ${a}: Input/output error`);
        status = 1;
        continue;
      }
      if (ses.foiCancelado) return 130;
      if (op.has("n")) {
        const fim = t.endsWith("\n");
        const ls = (fim ? t.slice(0, -1) : t).split("\n");
        t = ls.map((l, i) => `${String(i + 1).padStart(6)}\t${l}`).join("\n") + (fim ? "\n" : "");
      }
      ses.textoLongo(t);
    }
    return status;
  },

  async open(ses, d, args) {
    const { op, valores, resto, invalida } = opcoesDe(args, "Re", "a");
    if (invalida || (!resto.length && !valores.has("a"))) {
      ses.erro(`${invalida ? `open: invalid option -- ${invalida}\n` : ""}Usage: open [-e] [-R] [-a <application>] [filenames]\nHelp: Open opens files from a shell.`);
      return 1;
    }
    let app: "finder" | "previa" | "editor" | "terminal" | undefined;
    if (op.has("e")) app = "editor";
    if (valores.has("a")) {
      const nome = valores.get("a")!;
      app = APLICATIVOS[normalizar(nome).replace(/\.app$/, "")] ?? APLICATIVOS[nome.toLowerCase().replace(/\.app$/, "")];
      if (!app) {
        ses.erro(`Unable to find application named '${nome}'`);
        return 1;
      }
    }
    if (!resto.length) {
      if (app === "terminal") await abrirNoApp(ses, "terminal");
      else if (app === "finder") await abrirNoApp(ses, "finder", { lugar: "blog" });
      else if (app) await abrirNoApp(ses, app);
      return 0;
    }
    let status = 0;
    for (const a of resto) {
      const no = acharArquivo(ses, d, a);
      if (!no) {
        ses.erro(`The file ${absolutoDe(ses, a)} does not exist.`);
        status = 1;
        continue;
      }
      if (app === "terminal") {
        await abrirNoApp(ses, "terminal", { cwd: no.tipo === "pasta" ? d.absoluto(no) : d.absoluto(no.pai!) });
        continue;
      }
      if (no.tipo === "pasta") {
        // O livro abre no Finder já nele; as pastas de cima, nos lugares da barra lateral do Finder.
        const pedido = no.livro ? { livro: no.livro.id } : no === d.livros ? { lugar: "livros" } : no === d.series ? { lugar: "series" } : { lugar: "blog" };
        if (app === "editor") await abrirNoApp(ses, "editor", no.livro ? { livro: no.livro.id } : undefined);
        else await abrirNoApp(ses, "finder", pedido);
        continue;
      }
      // -R (e -a Finder): o Finder com o arquivo escolhido, na pasta dele.
      if (op.has("R") || app === "finder") {
        await abrirNoApp(ses, "finder", no.post ? { slug: no.post.slug } : { lugar: "blog" });
        continue;
      }
      if (no.post) {
        await abrirNoApp(ses, app === "editor" ? "editor" : "previa", { slug: no.post.slug });
        continue;
      }
      // Um texto que não é artigo (o leia-me, o .zshrc): no Código, com o conteúdo.
      const texto = await no.conteudo().catch(() => "");
      await abrirNoApp(ses, "editor", { arquivo: { nome: no.nome, caminho: d.mostrar(no), texto } });
    }
    return status;
  },

  async code(ses, d, args) {
    if (!args.length) {
      await abrirNoApp(ses, "editor");
      return 0;
    }
    return COMANDOS_DO_SHELL.open(ses, d, ["-a", "Código", ...args]);
  },

  exit(ses) {
    if (ses.tipo === "janela") {
      void ses.janela?.fechar();
    } else {
      ses.dono?.recolher(true);
      // Da próxima vez, uma sessão nova (o shell saiu).
      window.setTimeout(() => ses.iniciar(), 200);
    }
    return 0;
  },
};


// ---------- as janelas (só dentro do computador) ----------

function abrirJanela(op: { cwd?: string; comando?: string } = {}) {
  const ses = new Sessao("janela", sis);
  if (op.cwd) {
    ses.cwd = op.cwd;
    ses.atualizarPrompt();
  }
  const { largura, altura } = ses.tamanhoDeFabrica(sis.tela);
  const j = sis.criarJanela({
    app: "terminal",
    titulo: ses.textoDoTitulo(),
    largura,
    altura,
    minLargura: 300,
    minAltura: 170,
    conteudo: ses.el,
    semaforos: { x: 13, y: 8 },
    focar: () => ses.focar(),
    aoAtivar: (a) => ses.ativar(a),
    aoMudarTamanho: () => ses.medir(true),
    aoFechar: () => {
      ses.destruir();
      // O sistema apaga o ponto do Dock quando a última janela fecha; com o suspenso aberto, ele volta.
      queueMicrotask(() => {
        if (dentro?.visivel && !sis.janelasDo("terminal").length) sis.marcarAberto("terminal", true);
      });
    },
  });
  ses.janela = j;
  ses.ativar(j.el.hasAttribute("data-ativa"));
  ses.observar();
  requestAnimationFrame(() => {
    if (j.el.hasAttribute("data-ativa")) ses.focar();
  });
  if (op.comando) void ses.rodar(op.comando);
  return ses;
}

// ---------- o suspenso ----------

/** A crase, também como tecla morta (no ABNT2, Shift + a tecla do acento agudo). */
const ehCrase = (e: KeyboardEvent) =>
  !e.ctrlKey && !e.metaKey && !e.altKey && (e.key === "`" || (e.key === "Dead" && ((e.code === "Backquote" && !e.shiftKey) || (e.code === "BracketLeft" && e.shiftKey))));

/**
 * O Terminal suspenso: um painel de vidro da largura da tela que desce do alto. Dentro do computador, ele
 * fica logo abaixo da barra de menus (⌃`); fora, por cima da página do blog (a tecla `, ligada pelo blog).
 */
class Suspenso {
  ses?: Sessao;
  poco?: HTMLElement;
  visivel = false;
  private animacao?: Animation;
  private focoAntes: HTMLElement | null = null;
  private fracao = 0;

  constructor(
    readonly s: Sistema,
    readonly fora: boolean,
  ) {}

  private alturaDaTela() {
    return this.fora ? innerHeight : this.s.tela.clientHeight;
  }

  private padrao() {
    return this.s.estreito.matches ? SUSPENSO.celular : SUSPENSO.padrao;
  }

  private guardar(f: number) {
    try {
      localStorage.setItem("mac-terminal-suspenso", String(Math.round(f * 1000) / 1000));
    } catch {}
  }

  private guardada() {
    try {
      const v = Number(localStorage.getItem("mac-terminal-suspenso"));
      if (v >= SUSPENSO.min && v <= SUSPENSO.max) return v;
    } catch {}
    return 0;
  }

  private aplicarAltura() {
    if (!this.ses) return;
    const f = this.fracao || this.guardada() || this.padrao();
    this.ses.el.style.setProperty("--t-altura", `${Math.round(f * this.alturaDaTela())}px`);
    const alca = this.ses.el.querySelector<HTMLElement>("[data-alca]");
    alca?.setAttribute("aria-valuenow", String(Math.round(f * 100)));
    alca?.setAttribute("aria-valuetext", `${Math.round(f * 100)}% da tela`);
  }

  private montar(): Sessao {
    if (this.ses && this.poco) return this.ses;
    const poco = document.createElement("div");
    poco.className = `mac-term-poco${this.fora ? " mac-term-poco--fora" : ""}`;
    poco.hidden = true;
    const ses = new Sessao("suspenso", this.s, this);
    ses.el.insertAdjacentHTML(
      "beforeend",
      `<button type="button" class="mac-term-recolher" data-recolher aria-label="Recolher o Terminal" title="Recolher (${this.fora ? "`" : "⌃`"})"><svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M4 10l4-4 4 4"/></svg></button>` +
        `<div class="mac-term-alca" data-alca role="separator" tabindex="0" aria-orientation="horizontal" aria-label="Altura do Terminal suspenso" aria-valuemin="${SUSPENSO.min * 100}" aria-valuemax="${SUSPENSO.max * 100}"></div>`,
    );
    poco.append(ses.el);
    this.s.tela.append(poco);
    this.ses = ses;
    this.poco = poco;

    ses.el.querySelector("[data-recolher]")!.addEventListener("click", () => this.recolher(true));
    this.ligarAlca(ses);

    // Como os terminais suspensos de verdade: o clique fora (ou o foco que sai) recolhe. A barra de menus
    // do computador não conta (o menu Shell liga e desliga o próprio suspenso).
    const alvoDoClique = this.fora ? document : this.s.raiz;
    alvoDoClique.addEventListener(
      "pointerdown",
      (e) => {
        if (!this.visivel) return;
        const alvo = e.target as Element;
        if (ses.el.contains(alvo) || alvo.closest?.(".mac-barra")) return;
        this.recolher(false);
      },
      { capture: true },
    );
    ses.el.addEventListener("focusout", (e) => {
      const para = e.relatedTarget as Element | null;
      if (!this.visivel || !para || ses.el.contains(para) || para.closest(".mac-barra")) return;
      this.recolher(false);
    });

    // Fora do computador: o painel cuida do próprio teclado (` e Esc recolhem) e nenhuma tecla vaza para a
    // página (os atalhos do blog e o ⌘K da busca não disparam enquanto se digita).
    if (this.fora) {
      ses.el.addEventListener("keydown", (e) => {
        e.stopPropagation();
        if (e.defaultPrevented) return;
        if (e.key === "Escape" || (ehCrase(e) && !(e.target as Element).closest("[data-alca]"))) {
          e.preventDefault();
          this.recolher(true);
        }
      });
    }

    addEventListener("resize", () => this.visivel && this.aplicarAltura());
    this.s.estreito.addEventListener("change", () => {
      this.fracao = 0;
      if (this.visivel) this.aplicarAltura();
    });
    return ses;
  }

  /** A alça embaixo: arrastar muda a altura (25% a 85% da tela); as setas também; o duplo clique volta. */
  private ligarAlca(ses: Sessao) {
    const alca = ses.el.querySelector<HTMLElement>("[data-alca]")!;
    alca.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      try {
        alca.setPointerCapture(e.pointerId);
      } catch {}
      const topo = this.poco!.getBoundingClientRect().top;
      const altura = this.alturaDaTela();
      let quadro = 0;
      ses.el.classList.add("arrastando");
      const mover = (ev: PointerEvent) => {
        this.fracao = Math.max(SUSPENSO.min, Math.min(SUSPENSO.max, (ev.clientY - topo) / altura));
        if (!quadro)
          quadro = requestAnimationFrame(() => {
            quadro = 0;
            this.aplicarAltura();
          });
      };
      const soltar = () => {
        alca.removeEventListener("pointermove", mover);
        alca.removeEventListener("pointerup", soltar);
        alca.removeEventListener("pointercancel", soltar);
        cancelAnimationFrame(quadro);
        ses.el.classList.remove("arrastando");
        this.aplicarAltura();
        if (this.fracao) this.guardar(this.fracao);
        ses.rolarAoFim();
      };
      alca.addEventListener("pointermove", mover);
      alca.addEventListener("pointerup", soltar);
      alca.addEventListener("pointercancel", soltar);
    });
    alca.addEventListener("dblclick", () => {
      this.fracao = this.padrao();
      this.guardar(this.fracao);
      this.aplicarAltura();
      ses.rolarAoFim();
    });
    alca.addEventListener("keydown", (e) => {
      const atual = this.fracao || this.guardada() || this.padrao();
      const passo = e.key === "ArrowDown" ? 0.05 : e.key === "ArrowUp" ? -0.05 : 0;
      if (!passo && e.key !== "Home" && e.key !== "End") return;
      e.preventDefault();
      e.stopPropagation();
      this.fracao = e.key === "Home" ? SUSPENSO.min : e.key === "End" ? SUSPENSO.max : Math.max(SUSPENSO.min, Math.min(SUSPENSO.max, atual + passo));
      this.guardar(this.fracao);
      this.aplicarAltura();
    });
  }

  descer() {
    const ses = this.montar();
    if (this.visivel || !this.poco) return;
    this.visivel = true;
    const ativo = document.activeElement as HTMLElement | null;
    this.focoAntes = ativo && ativo !== document.body && !ativo.closest(".mac-barra") ? ativo : null;
    if (!this.fora && !this.s.janelasDo("terminal").length) this.s.marcarAberto("terminal", true);
    this.animacao?.cancel();
    this.poco.hidden = false;
    this.aplicarAltura();
    ses.observar();
    ses.ativar(true);
    ses.rolarAoFim();
    if (this.s.reduzido.matches) {
      this.animacao = ses.el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 110, easing: "ease-out" });
    } else {
      ses.el.classList.add("movendo");
      const a = ses.el.animate([{ transform: "translateY(-100%)" }, { transform: "translateY(0)" }], {
        duration: temLinear ? 460 : 240,
        easing: temLinear ? MOLA : "cubic-bezier(0.2, 0.8, 0.2, 1)",
      });
      this.animacao = a;
      void a.finished.then(
        () => a === this.animacao && ses.el.classList.remove("movendo"),
        () => {},
      );
    }
    ses.focar();
    if (!this.fora) this.s.atualizarMenus();
  }

  /** Sobe o suspenso. Com `devolver`, o foco volta para onde estava antes de ele descer. */
  recolher(devolver = true) {
    const ses = this.ses;
    const poco = this.poco;
    if (!this.visivel || !ses || !poco) return;
    this.visivel = false;
    cartao.esconderDe(ses.el);
    ses.fecharOpcoes();
    ses.ativar(false);
    const tinhaFoco = ses.el.contains(document.activeElement);
    this.animacao?.cancel();
    let a: Animation;
    if (this.s.reduzido.matches) {
      a = ses.el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 90, easing: "ease-in", fill: "forwards" });
    } else {
      ses.el.classList.add("movendo");
      a = ses.el.animate([{ transform: "translateY(0)" }, { transform: "translateY(-100%)" }], { duration: 150, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "forwards" });
    }
    this.animacao = a;
    void a.finished.then(
      () => {
        if (a !== this.animacao || this.visivel) return;
        poco.hidden = true;
        ses.el.classList.remove("movendo");
        a.cancel();
      },
      () => {},
    );
    if (tinhaFoco) {
      const volta = devolver && this.focoAntes?.isConnected && !this.focoAntes.closest("[inert]") ? this.focoAntes : null;
      if (volta) volta.focus({ preventScroll: true });
      else if (devolver || ses.el.contains(document.activeElement)) (document.activeElement as HTMLElement | null)?.blur?.();
    }
    this.focoAntes = null;
    if (!this.fora) {
      if (!this.s.janelasDo("terminal").length) this.s.marcarAberto("terminal", false);
      this.s.atualizarMenus();
    }
  }

  alternar(modo: "alternar" | "abrir" | "recolher" = "alternar") {
    if (modo === "recolher" || (modo === "alternar" && this.visivel)) this.recolher(true);
    else this.descer();
  }
}

/** O suspenso de dentro do computador (o do blog, fora, é outro: `suspensoNoBlog`). */
let dentro: Suspenso | undefined;

// ---------- o app ----------

/** A sessão que recebe os itens do menu: a última com o foco (o suspenso, se está aberto) ou a janela da frente. */
function sessaoAlvo(): Sessao | undefined {
  const u = ultimaFocada;
  if (u && sessoes.has(u) && u.s === sis && (u.tipo === "janela" || u.dono?.visivel)) return u;
  for (const x of sessoes) if (x.janela?.el.hasAttribute("data-ativa")) return x;
  return undefined;
}

export function criar(s: Sistema): App & { suspensoAberto(): boolean; recolher(): void } {
  sis = s;
  s.estilo("terminal", css);
  void carregarDisco(s).catch(() => {});

  return {
    id: "terminal",
    nome: "Terminal",

    abrir(pedido) {
      const p = (pedido ?? {}) as { suspenso?: "alternar" | "abrir" | "recolher"; livro?: string; caminho?: string; comando?: string };
      if (p.suspenso) {
        dentro ??= new Suspenso(s, false);
        dentro.alternar(p.suspenso);
        return;
      }
      if (p.livro || p.caminho) {
        // Uma janela já na pasta pedida (o "Novo Terminal na pasta" do Finder).
        return carregarDisco(s).then(
          (d) => {
            const livro = p.livro ? d.dados.livros.find((l) => l.id === p.livro) : undefined;
            const alvo = livro
              ? [...d.livros.filhos, ...d.series.filhos].find((f) => f.tipo === "pasta" && f.livro === livro)
              : p.caminho
                ? d.resolver(d.casa, p.caminho.replace(/^~\/?/, `${CASA}/`))
                : null;
            abrirJanela({ cwd: alvo?.tipo === "pasta" ? d.absoluto(alvo) : undefined, comando: p.comando });
          },
          () => void abrirJanela({ comando: p.comando }),
        );
      }
      abrirJanela({ comando: p.comando });
    },

    // O menu Terminal (o do nome do app) também liga o suspenso: no celular, é o único menu à vista.
    menuDoApp: () => [
      { rotulo: "Nova janela", acao: () => void abrirJanela() },
      { rotulo: "Terminal suspenso", atalho: "⌃`", marcado: Boolean(dentro?.visivel), acao: () => (dentro ??= new Suspenso(s, false)).alternar() },
    ],

    menus(): Menu[] {
      const alvo = sessaoAlvo();
      const frente = [...sessoes].find((x) => x.janela?.el.hasAttribute("data-ativa"));
      const editar: ItemDeMenu[] = [
        {
          rotulo: "Copiar",
          atalho: "⌘C",
          desativado: !alvo?.temSelecao(),
          acao: () => {
            const t = getSelection()?.toString();
            if (t) void navigator.clipboard?.writeText(t).catch(() => {});
          },
        },
        {
          rotulo: "Colar",
          atalho: "⌘V",
          desativado: !alvo || !navigator.clipboard?.readText,
          acao: () => {
            void navigator.clipboard
              ?.readText()
              .then((t) => alvo?.inserir(t.replace(/\r?\n+$/, "").replace(/\r?\n/g, " ")))
              .catch(() => {});
          },
        },
        { rotulo: "Selecionar tudo", atalho: "⌘A", desativado: !alvo, acao: () => alvo?.selecionarTudo() },
      ];
      return [
        {
          titulo: "Shell",
          itens: [
            { rotulo: "Nova janela", acao: () => void abrirJanela() },
            { rotulo: "Terminal suspenso", atalho: "⌃`", marcado: Boolean(dentro?.visivel), acao: () => (dentro ??= new Suspenso(s, false)).alternar() },
            { separador: true },
            { rotulo: "Limpar a tela", atalho: "⌃L", desativado: !alvo, acao: () => alvo?.limpar() },
            { separador: true },
            { rotulo: "Fechar a janela", atalho: "esc", desativado: !frente, acao: () => void frente?.janela?.fechar() },
          ],
        },
        { titulo: "Editar", itens: editar },
        {
          titulo: "Visualizar",
          itens: [
            { rotulo: "Aumentar a fonte", atalho: "⌘+", desativado: !alvo, acao: () => alvo?.mudarFonte(1) },
            { rotulo: "Diminuir a fonte", atalho: "⌘−", desativado: !alvo, acao: () => alvo?.mudarFonte(-1) },
            { rotulo: "Tamanho padrão", atalho: "⌘0", desativado: !alvo, acao: () => alvo?.mudarFonte(0) },
          ],
        },
      ];
    },

    tecla(e) {
      // O Esc fica com o sistema (fecha a janela ou recolhe o suspenso). Quando ele só fecha a lista do Tab
      // ou o cartão, o campo já o segurou (stopPropagation) e ele nem chega aqui.
      if (e.key === "Escape") return false;
      const ses = [...sessoes].find((x) => x.janela?.el.contains(e.target as Node));
      if (!ses || ses.el.contains(e.target as Node)) return e.defaultPrevented;
      // O foco na moldura da janela (não no conteúdo): os atalhos e as letras vão para o prompt.
      if (ses.atalho(e)) return true;
      return ses.digitarFora(e);
    },

    suspensoAberto: () => Boolean(dentro?.visivel),
    recolher: () => dentro?.recolher(true),
  };
}

/**
 * O Terminal suspenso por cima do blog, fora do computador (a tecla ` em qualquer página, como no 15).
 * `host` é o `<div class="mac-fora">` com as variáveis do computador; `s` é o Sistema que o blog monta
 * (dados, estilo, reduzido, estreito e abrirApp; o resto não faz nada ali).
 */
export function suspensoNoBlog(host: HTMLElement, s: Sistema): { alternar(): void; aberto(): boolean; recolher(): void } {
  s.estilo("terminal", css);
  void carregarDisco(s).catch(() => {});
  void host;
  const fora = new Suspenso(s, true);
  return {
    alternar: () => fora.alternar(),
    aberto: () => fora.visivel,
    recolher: () => fora.recolher(true),
  };
}
