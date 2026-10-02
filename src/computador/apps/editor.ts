/**
 * O Editor (C4): o VS Code do computador, simples, nas medidas e nas cores do Light Modern (tema claro do
 * blog) e do Dark Modern (escuro). Lê o blog como um repositório: `livros/<pasta>/` e `series/<pasta>/`,
 * com o Markdown cru de cada post (o arquivo do repositório, com o frontmatter). Só lê: nada se edita.
 *
 * - Barra de título de 35px: os semáforos, as setas de voltar e avançar, o "command center" (a cápsula
 *   "blog", que abre o Ir para arquivo) e os botões de layout.
 * - Barra de atividades de 48px: Explorer, Pesquisar e, embaixo, Gerenciar (a paleta de comandos).
 * - Explorer: a árvore (setas que giram, recuo por nível, guias no hover, a pasta do arquivo aberto sempre
 *   à vista) e a Estrutura de tópicos (os títulos do arquivo, seguindo o cursor). No hover (ou no foco do
 *   teclado) de um arquivo, o cartão com a imagem do post; no de um livro, a foto do livro.
 * - Abas que abrem e fecham: a aba "prévia" em itálico (clique simples) vira fixa no duplo clique; o × no
 *   hover e fixo na ativa; o clique do meio fecha; arrastar muda a ordem; as setas andam e Delete fecha.
 * - Editor: números de linha, a linha do cursor realçada, o Markdown realçado (com o código das cercas na
 *   cor da linguagem), sem quebrar linha (⌥Z quebra), o minimapa, a trilha de navegação (com o título em
 *   que o cursor está), Localizar (⌘F) e o aviso de somente leitura ao digitar.
 * - Ir para arquivo (⌘P), paleta de comandos (⇧⌘P ou ">"), ir para a linha (⌃G ou ":") e para um título
 *   (⇧⌘O ou "@"), como no VS Code.
 * - Barra de status de 22px: o item remoto, o ramo, os problemas, Ln/Col, os espaços, a codificação, o fim
 *   de linha e a linguagem.
 * - No celular, o Explorer abre por cima do editor, pelo botão da barra de atividades, sem minimapa.
 *
 * Nada de Monaco nem de CodeMirror: o arquivo vira uma string de HTML, montada de uma vez (innerHTML), e o
 * minimapa é um <canvas> desenhado uma vez por arquivo (e de novo só quando o tema muda).
 */
import css from "../estilos/editor.css?inline";
import { MARCA_SVG, MARCA_VIEWBOX } from "../../lib/marca";
import type { App, ItemDeMenu, Janela, Menu, Sistema } from "../contexto";
import { desenhoDoPost, escapar, fotoDoLivro, textoDoPost, type DadosM, type LivroM, type PostM } from "../dados";
import { glifo } from "../icones";

// =====================================================================================================
// Os ícones do Editor (desenhados aqui; nada dos Codicons nem do logo do VS Code)
// =====================================================================================================

const svg = (vb: string, corpo: string, classe = "ed-ico") =>
  `<svg class="${classe}" viewBox="${vb}" aria-hidden="true" focusable="false">${corpo}</svg>`;

const ICONE = {
  // Barra de atividades (24 × 24, traço de 1,5).
  arquivos: svg(
    "0 0 24 24",
    '<path d="M9.5 3.25h6.2l3.8 3.8v9.2a1.2 1.2 0 0 1-1.2 1.2"/><path d="M5.7 6.75h6.6l4 4v9.05a1.2 1.2 0 0 1-1.2 1.2H5.7a1.2 1.2 0 0 1-1.2-1.2V7.95a1.2 1.2 0 0 1 1.2-1.2Z"/><path d="M12.2 6.9v3.9h3.9"/>',
    "ed-ico ed-ico--24",
  ),
  lupa: svg("0 0 24 24", '<circle cx="10.4" cy="10.4" r="6.15"/><path d="m15 15 5.4 5.4"/>', "ed-ico ed-ico--24"),
  engrenagem: svg(
    "0 0 24 24",
    '<circle class="ed-dentes" cx="12" cy="12" r="8.35"/><circle cx="12" cy="12" r="6.3"/><circle cx="12" cy="12" r="2.45"/>',
    "ed-ico ed-ico--24",
  ),
  // 16 × 16.
  seta: svg("0 0 16 16", '<path d="m6 3.6 4.4 4.4L6 12.4"/>', "ed-ico ed-seta"),
  md: svg(
    "0 0 16 16",
    '<rect x="1.3" y="3.6" width="13.4" height="8.8" rx="1.8"/><path d="M3.7 10.2V5.8l1.75 2.1 1.75-2.1v4.4"/><path d="M11.1 5.8v4.3M9.5 8.6l1.6 1.6 1.6-1.6"/>',
    "ed-ico ed-ico-arquivo ed-ico-arquivo--md",
  ),
  mdx: svg(
    "0 0 16 16",
    '<rect x="1.3" y="3.6" width="13.4" height="8.8" rx="1.8"/><path d="M3.7 10.2V5.8l1.75 2.1 1.75-2.1v4.4"/><path d="m9.2 5.9 3.3 4.2M12.5 5.9l-3.3 4.2"/>',
    "ed-ico ed-ico-arquivo ed-ico-arquivo--mdx",
  ),
  voltar: svg("0 0 16 16", '<path d="M13 8H3.2M7.2 4 3.2 8l4 4"/>'),
  avancar: svg("0 0 16 16", '<path d="M3 8h9.8M8.8 4l4 4-4 4"/>'),
  lateral: svg("0 0 16 16", '<rect x="1.75" y="2.75" width="12.5" height="10.5" rx="1.6"/><path d="M6 2.75v10.5"/><path class="ed-preenche" d="M2.5 3.5h3v9h-3z"/>'),
  painel: svg("0 0 16 16", '<rect x="1.75" y="2.75" width="12.5" height="10.5" rx="1.6"/><path d="M1.75 9.6h12.5"/><path d="m4.4 11.5 1.1-.9-1.1-.9"/>'),
  recolher: svg("0 0 16 16", '<rect x="4.6" y="4.6" width="9" height="9" rx="1.4"/><path d="M2.4 11.4V3.6a1.2 1.2 0 0 1 1.2-1.2h7.8M6.8 9.1h4.6"/>'),
  limpar: svg("0 0 16 16", '<path d="M2.5 4h8M2.5 7.2h8M2.5 10.4h4.6M9.4 10.2l3.8 3.8M13.2 10.2l-3.8 3.8"/>'),
  previa: svg("0 0 16 16", '<rect x="1.75" y="2.75" width="12.5" height="10.5" rx="1.6"/><path d="M8 2.75v10.5"/><circle cx="11" cy="7.2" r="1.55"/><path d="m12.1 8.3 1.3 1.3"/>'),
  titulo: svg("0 0 16 16", '<path d="M6.2 2.8 5 13.2M11 2.8 9.8 13.2M2.8 6h10.6M2.4 10h10.6"/>', "ed-ico ed-ico-titulo"),
  cima: svg("0 0 16 16", '<path d="M8 13V3.4M3.8 7.4 8 3.2l4.2 4.2"/>'),
  baixo: svg("0 0 16 16", '<path d="M8 3v9.6M3.8 8.6 8 12.8l4.2-4.2"/>'),
  fechar: svg("0 0 16 16", '<path d="m4.4 4.4 7.2 7.2M11.6 4.4l-7.2 7.2"/>'),
  texto: svg(
    "0 0 16 16",
    '<path d="M9.2 1.9H4.4a1.1 1.1 0 0 0-1.1 1.1v10a1.1 1.1 0 0 0 1.1 1.1h7.2a1.1 1.1 0 0 0 1.1-1.1V5.4Z"/><path d="M9.2 1.9v3.5h3.5M5.4 8.2h5.2M5.4 10.6h3.6"/>',
    "ed-ico ed-ico-arquivo ed-ico-arquivo--texto",
  ),
};

// =====================================================================================================
// O realce: o Markdown linha a linha e, dentro das cercas, a linguagem do bloco
// =====================================================================================================

/** As cores do realce. O número vira a classe `k1`…`k11` e a cor do minimapa (ver CORES_DO_MAPA). */
const TX = 0, // o texto
  TI = 1, // títulos, chaves do YAML e tags (entity.name.tag)
  KW = 2, // palavras-chave, negrito e marcadores de lista
  CT = 3, // controle: if, return, import, as diretivas :::
  ST = 4, // strings, código em linha e o texto dos links
  NU = 5, // números e datas
  FN = 6, // funções, anotações e escapes
  TP = 7, // tipos e componentes
  VA = 8, // variáveis, propriedades e endereços
  CO = 9, // comentários e citações
  AT = 10, // atributos
  PO = 11; // pontuação

/** Os estilos que se somam à cor. */
const NEG = 1,
  ITA = 2,
  SUB = 4;

type Seg = [texto: string, cor: number, estilo: number];

interface Titulo {
  nivel: number;
  texto: string;
  linha: number;
}

interface Doc {
  linhas: string[];
  segs: Seg[][];
  titulos: Titulo[];
  html: string;
}

interface Lingua {
  tipo: "c" | "sh" | "yaml" | "json" | "xml" | "sql" | "ini" | "docker";
  kw?: Set<string>;
  ctl?: Set<string>;
  com?: string[];
  bloco?: boolean;
  aspas?: string;
  texto3?: boolean;
  anot?: boolean;
}

/** Prende o ponteiro no elemento (sem erro quando o ponteiro já foi embora). */
function capturar(el: Element, id: number) {
  try {
    el.setPointerCapture(id);
  } catch {}
}

const conjunto = (s: string) => new Set(s.split(/\s+/).filter(Boolean));

const JAVA_KW = conjunto(
  "abstract boolean byte char class const default double enum extends final float implements instanceof int interface long native new non-sealed null package permits private protected public record sealed short static strictfp super synchronized this transient var void volatile true false module requires exports opens uses provides with to transitive",
);
const JAVA_CTL = conjunto("assert break case catch continue do else finally for if import return switch throw throws try while yield when");
const KOTLIN_KW = conjunto(
  "fun val var class object interface data sealed enum companion open override private public protected internal abstract final inline suspend lateinit by is as in typealias init this super null true false const operator infix tailrec annotation constructor out reified vararg",
);
const JS_KW = conjunto(
  "const let var function class extends new this null undefined true false typeof instanceof async void type interface enum implements public private protected readonly declare keyof static get set satisfies as",
);
const JS_CTL = conjunto("if else for while do switch case break continue return throw try catch finally import export from default await yield of in");
const SH_CTL = conjunto("if then else elif fi for in do done while until case esac function return export local readonly declare unset source exit set");
const SQL_KW = conjunto(
  "select from where and or not insert into values update set delete create table index alter drop add primary key foreign references join left right inner outer full cross on as order by group having limit offset distinct null is in exists between like ilike case when then else end begin commit rollback transaction for share nowait skip locked returning default constraint unique check with union all asc desc true false integer int bigint smallint varchar char text numeric decimal timestamp timestamptz date boolean serial bigserial uuid lock row exclusive mode isolation level serializable read committed repeatable uncommitted show explain analyze grant revoke to cascade if replace view trigger function language returns declare do nothing conflict",
);
const HCL_KW = conjunto("resource data variable output module provider locals terraform true false null");

const LINGUAS: Record<string, Lingua> = {};
{
  const java: Lingua = { tipo: "c", kw: JAVA_KW, ctl: JAVA_CTL, com: ["//"], bloco: true, aspas: "\"'", texto3: true, anot: true };
  const kotlin: Lingua = { tipo: "c", kw: KOTLIN_KW, ctl: JAVA_CTL, com: ["//"], bloco: true, aspas: "\"'", texto3: true, anot: true };
  const groovy: Lingua = { tipo: "c", kw: new Set([...JAVA_KW, "def", "as", "in"]), ctl: JAVA_CTL, com: ["//"], bloco: true, aspas: "\"'", texto3: true, anot: true };
  const js: Lingua = { tipo: "c", kw: JS_KW, ctl: JS_CTL, com: ["//"], bloco: true, aspas: "\"'`", anot: true };
  const sh: Lingua = { tipo: "sh", ctl: SH_CTL };
  const json: Lingua = { tipo: "json", com: ["//"], bloco: true };
  const xml: Lingua = { tipo: "xml" };
  const yaml: Lingua = { tipo: "yaml" };
  const ini: Lingua = { tipo: "ini" };
  const hcl: Lingua = { tipo: "c", kw: HCL_KW, ctl: conjunto("for in if"), com: ["#", "//"], bloco: true, aspas: '"' };
  const sql: Lingua = { tipo: "sql", kw: SQL_KW };
  const docker: Lingua = { tipo: "docker", ctl: SH_CTL };
  const pares: [string, Lingua][] = [
    ["java", java],
    ["kotlin", kotlin],
    ["kt", kotlin],
    ["kts", kotlin],
    ["groovy", groovy],
    ["gradle", groovy],
    ["js", js],
    ["javascript", js],
    ["mjs", js],
    ["ts", js],
    ["typescript", js],
    ["jsx", js],
    ["tsx", js],
    ["bash", sh],
    ["sh", sh],
    ["shell", sh],
    ["zsh", sh],
    ["console", sh],
    ["json", json],
    ["jsonc", json],
    ["json5", json],
    ["xml", xml],
    ["html", xml],
    ["svg", xml],
    ["yaml", yaml],
    ["yml", yaml],
    ["properties", ini],
    ["ini", ini],
    ["toml", ini],
    ["env", ini],
    ["hcl", hcl],
    ["terraform", hcl],
    ["tf", hcl],
    ["sql", sql],
    ["dockerfile", docker],
    ["docker", docker],
  ];
  for (const [nome, l] of pares) LINGUAS[nome] = l;
}

/** O escape do texto (só &, < e >: o texto vai em nós de texto, nunca em atributos). */
const esc = (t: string) => (/[&<>]/.test(t) ? t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : t);

function htmlDaLinha(segs: Seg[]): string {
  if (!segs.length) return "<br>";
  let h = "";
  for (const [t, c, f] of segs) {
    if (!c && !f) {
      h += esc(t);
      continue;
    }
    let cl = c ? `k${c}` : "";
    if (f & NEG) cl += " b";
    if (f & ITA) cl += " i";
    if (f & SUB) cl += " u";
    h += `<span class="${cl.trim()}">${esc(t)}</span>`;
  }
  return h;
}

/** Junta um pedaço na linha, emendando no anterior quando a cor e o estilo são os mesmos. */
function por(out: Seg[], t: string, c = TX, f = 0) {
  if (!t) return;
  const u = out[out.length - 1];
  if (u && u[1] === c && u[2] === f) u[0] += t;
  else out.push([t, c, f]);
}

interface EstadoJsx {
  aberto: boolean;
  prof: number;
}

/** Strings com aspas (com o escape \"), a partir de i. Devolve o fim. */
function fimDaString(s: string, i: number): number {
  const q = s[i];
  let j = i + 1;
  while (j < s.length) {
    if (s[j] === "\\") j += 2;
    else if (s[j] === q) return j + 1;
    else j++;
  }
  return s.length;
}

const NUMERO = /^(?:0[xX][\da-fA-F_]+|\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?)[lLfFdD]?/;
const PALAVRA = /^[A-Za-z_$][\w$]*/;

/** Uma expressão de JavaScript dentro das chaves do JSX (até a chave que fecha, ou o fim da linha). */
function expressaoJs(s: string, i: number, out: Seg[], st: EstadoJsx): number {
  while (i < s.length) {
    const ch = s[i];
    if (ch === "{") {
      st.prof++;
      por(out, ch, PO);
      i++;
    } else if (ch === "}") {
      st.prof--;
      por(out, ch, st.prof === 0 ? KW : PO);
      i++;
      if (st.prof === 0) return i;
    } else if (ch === '"' || ch === "'" || ch === "`") {
      const f = fimDaString(s, i);
      por(out, s.slice(i, f), ST);
      i = f;
    } else if (/\d/.test(ch)) {
      const m = NUMERO.exec(s.slice(i));
      const t = m ? m[0] : ch;
      por(out, t, NU);
      i += t.length;
    } else if (/[A-Za-z_$]/.test(ch)) {
      const p = PALAVRA.exec(s.slice(i))![0];
      por(out, p, /^(true|false|null|undefined)$/.test(p) ? KW : VA);
      i += p.length;
    } else if (/\s/.test(ch)) {
      por(out, ch);
      i++;
    } else {
      por(out, ch, PO);
      i++;
    }
  }
  return i;
}

/** Os atributos de uma tag JSX ou HTML (que podem seguir pelas linhas de baixo). Devolve o fim da tag. */
function atributosJsx(s: string, i: number, out: Seg[], st: EstadoJsx): number {
  while (i < s.length) {
    if (st.prof > 0) {
      i = expressaoJs(s, i, out, st);
      continue;
    }
    const ch = s[i];
    if (ch === "/" && s[i + 1] === ">") {
      por(out, "/>", PO);
      st.aberto = false;
      return i + 2;
    }
    if (ch === ">") {
      por(out, ">", PO);
      st.aberto = false;
      return i + 1;
    }
    if (ch === "{") {
      por(out, "{", KW);
      st.prof = 1;
      i++;
    } else if (ch === '"' || ch === "'") {
      const f = fimDaString(s, i);
      por(out, s.slice(i, f), ST);
      i = f;
    } else if (/[A-Za-z_:@]/.test(ch)) {
      const m = /^[\w:@.-]+/.exec(s.slice(i))![0];
      por(out, m, AT);
      i += m.length;
    } else if (/\s/.test(ch)) {
      por(out, ch);
      i++;
    } else {
      por(out, ch, PO);
      i++;
    }
  }
  return i;
}

/** Abre uma tag (<Nome ou </nome) em i. Devolve o fim (ou -1 se não for uma tag). */
function tagJsx(s: string, i: number, out: Seg[], st: EstadoJsx): number {
  let j = i + 1;
  if (s[j] === "/") j++;
  const m = /^[A-Za-z][\w.:-]*/.exec(s.slice(j));
  if (!m) return -1;
  por(out, s.slice(i, j), PO);
  por(out, m[0], /^[A-Z]/.test(m[0]) ? TP : TI);
  st.aberto = true;
  st.prof = 0;
  return atributosJsx(s, j + m[0].length, out, st);
}

const TAG_INTEIRA = /^<\/?[A-Za-z][\w.:-]*(?:\s+(?:[^<>"'{}]|"[^"]*"|'[^']*'|\{[^{}]*\})*?)?\s*\/?>/;

/** O Markdown dentro de uma linha: código, negrito, itálico, links, tags, diretivas e escapes. */
function emLinha(s: string, out: Seg[], c = TX, f = 0) {
  let i = 0;
  let ini = 0;
  const solta = (ate: number) => {
    if (ate > ini) por(out, s.slice(ini, ate), c, f);
  };
  while (i < s.length) {
    const ch = s[i];
    // \* \_ \$: o escape
    if (ch === "\\" && i + 1 < s.length && /[\\`*_{}[\]()#+\-.!$|<>:~"]/.test(s[i + 1])) {
      solta(i);
      por(out, s.slice(i, i + 2), FN, f);
      i += 2;
      ini = i;
      continue;
    }
    // `código` (com a mesma quantidade de crases para fechar)
    if (ch === "`") {
      let n = 1;
      while (s[i + n] === "`") n++;
      const marca = "`".repeat(n);
      let fim = s.indexOf(marca, i + n);
      while (fim > 0 && s[fim + n] === "`") fim = s.indexOf(marca, fim + n + 1);
      if (fim > 0) {
        solta(i);
        por(out, s.slice(i, fim + n), ST, f & ~ITA);
        i = fim + n;
        ini = i;
        continue;
      }
      i += n;
      continue;
    }
    // **negrito**, __negrito__, *itálico*, _itálico_
    if (ch === "*" || ch === "_") {
      const dupla = s[i + 1] === ch;
      const marca = dupla ? ch + ch : ch;
      const depois = s[i + marca.length];
      const antes = s[i - 1] ?? " ";
      if (depois && depois !== " " && depois !== ch && !(ch === "_" && /[\p{L}\d]/u.test(antes))) {
        let fim = s.indexOf(marca, i + marca.length + 1);
        while (fim > 0 && (s[fim - 1] === " " || (!dupla && s[fim + 1] === ch) || (ch === "_" && /[\p{L}\d]/u.test(s[fim + marca.length] ?? "")))) {
          fim = s.indexOf(marca, fim + marca.length);
        }
        if (fim > 0) {
          solta(i);
          const cor = dupla ? KW : c;
          const estilo = f | (dupla ? NEG : ITA);
          por(out, marca, cor, estilo);
          emLinha(s.slice(i + marca.length, fim), out, cor, estilo);
          por(out, marca, cor, estilo);
          i = fim + marca.length;
          ini = i;
          continue;
        }
      }
      i += marca.length;
      continue;
    }
    // [texto](endereço) e ![imagem](endereço)
    if (ch === "[" || (ch === "!" && s[i + 1] === "[")) {
      const abre = ch === "!" ? i + 1 : i;
      let prof = 0;
      let fecha = -1;
      for (let j = abre; j < s.length; j++) {
        if (s[j] === "\\") j++;
        else if (s[j] === "[") prof++;
        else if (s[j] === "]" && --prof === 0) {
          fecha = j;
          break;
        }
      }
      if (fecha > 0 && s[fecha + 1] === "(") {
        const fimUrl = s.indexOf(")", fecha + 2);
        if (fimUrl > 0) {
          solta(i);
          por(out, s.slice(i, abre + 1), PO, f);
          emLinha(s.slice(abre + 1, fecha), out, ST, f);
          por(out, "](", PO, f);
          const dentro = s.slice(fecha + 2, fimUrl);
          const m = /^(\S*)(.*)$/.exec(dentro)!;
          por(out, m[1], VA, f | SUB);
          por(out, m[2], ST, f);
          por(out, ")", PO, f);
          i = fimUrl + 1;
          ini = i;
          continue;
        }
      }
      i++;
      continue;
    }
    // <https://…>, <!-- … --> e as tags (só a tag inteira na mesma linha)
    if (ch === "<") {
      const auto = /^<https?:\/\/[^\s>]+>/.exec(s.slice(i));
      if (auto) {
        solta(i);
        por(out, "<", PO, f);
        por(out, auto[0].slice(1, -1), VA, f | SUB);
        por(out, ">", PO, f);
        i += auto[0].length;
        ini = i;
        continue;
      }
      if (s.startsWith("<!--", i)) {
        const fim = s.indexOf("-->", i + 4);
        const ate = fim < 0 ? s.length : fim + 3;
        solta(i);
        por(out, s.slice(i, ate), CO);
        i = ate;
        ini = i;
        continue;
      }
      const tag = TAG_INTEIRA.exec(s.slice(i));
      if (tag) {
        solta(i);
        const st: EstadoJsx = { aberto: false, prof: 0 };
        const fim = tagJsx(s.slice(0, i + tag[0].length), i, out, st);
        i = fim < 0 ? i + 1 : fim;
        ini = i;
        continue;
      }
    }
    // :diretiva[texto]{atributos}
    if (ch === ":" && /[a-z]/.test(s[i + 1] ?? "") && (i === 0 || /[\s(]/.test(s[i - 1]))) {
      const m = /^:([a-z][\w-]*)(?=[[{])/.exec(s.slice(i));
      if (m) {
        solta(i);
        por(out, m[0], CT, f);
        i += m[0].length;
        if (s[i] === "[") {
          let prof = 0;
          let fecha = -1;
          for (let j = i; j < s.length; j++) {
            if (s[j] === "[") prof++;
            else if (s[j] === "]" && --prof === 0) {
              fecha = j;
              break;
            }
          }
          if (fecha > 0) {
            por(out, "[", PO, f);
            emLinha(s.slice(i + 1, fecha), out, c, f);
            por(out, "]", PO, f);
            i = fecha + 1;
          }
        }
        if (s[i] === "{") {
          const fecha = s.indexOf("}", i);
          if (fecha > 0) {
            atributosDiretiva(s.slice(i, fecha + 1), out);
            i = fecha + 1;
          }
        }
        ini = i;
        continue;
      }
    }
    i++;
  }
  solta(s.length);
}

/** {texto="…" data="…"} das diretivas. */
function atributosDiretiva(s: string, out: Seg[]) {
  const re = /([\w-]+)|("[^"]*"|'[^']*')|(\s+)|([^\w\s"']+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    if (m[1]) por(out, m[1], AT);
    else if (m[2]) por(out, m[2], ST);
    else if (m[3]) por(out, m[3]);
    else por(out, m[4], PO);
  }
}

/** Uma linha de YAML (o frontmatter e as cercas yaml). */
function linhaYaml(s: string, out: Seg[]) {
  let com = -1;
  let aspas = "";
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (aspas) {
      if (ch === aspas) aspas = "";
    } else if (ch === '"' || ch === "'") aspas = ch;
    else if (ch === "#" && (i === 0 || /\s/.test(s[i - 1]))) {
      com = i;
      break;
    }
  }
  const corpo = com >= 0 ? s.slice(0, com) : s;
  const m = /^(\s*)(-\s+)?([^\s:#'"][^:#]*?|"[^"]*"|'[^']*')(\s*:)(?=\s|$)(.*)$/.exec(corpo);
  if (m) {
    por(out, m[1]);
    if (m[2]) por(out, m[2], PO);
    por(out, m[3], TI);
    por(out, m[4], PO);
    valorYaml(m[5], out);
  } else {
    const l = /^(\s*)(-(?:\s+|$))?(.*)$/.exec(corpo)!;
    por(out, l[1]);
    if (l[2]) por(out, l[2], PO);
    valorYaml(l[3], out);
  }
  if (com >= 0) por(out, s.slice(com), CO);
}

function valorYaml(v: string, out: Seg[]) {
  const m = /^(\s*)(.*?)(\s*)$/.exec(v)!;
  por(out, m[1]);
  const t = m[2];
  if (!t) {
    por(out, m[3]);
    return;
  }
  if (t.startsWith("[") || t.startsWith("{")) {
    const re = /("[^"]*"|'[^']*')|([[\]{},:])|(\s+)|([^[\]{},:\s"']+(?:\s+[^[\]{},:\s"']+)*)/g;
    let p: RegExpExecArray | null;
    while ((p = re.exec(t))) {
      if (p[1]) por(out, p[1], ST);
      else if (p[2]) por(out, p[2], PO);
      else if (p[3]) por(out, p[3]);
      else por(out, p[4], escalarYaml(p[4]));
    }
  } else if (/^[|>][-+]?$/.test(t)) por(out, t, PO);
  else por(out, t, escalarYaml(t));
  por(out, m[3]);
}

function escalarYaml(t: string): number {
  if (/^["']/.test(t)) return ST;
  if (/^(true|false|null|yes|no|on|off|~)$/i.test(t)) return KW;
  if (/^[-+]?(\d[\d_.:TZ+-]*|\.\d+)$/.test(t)) return NU;
  if (/^[&*][\w-]+$/.test(t)) return TP;
  return ST;
}

interface EstadoCodigo {
  bloco: boolean;
  texto3: boolean;
  comXml: boolean;
  tagXml: boolean;
}

/** Uma linha de código numa linguagem da família do C (Java, Kotlin, Groovy, JavaScript, HCL). */
function linhaC(s: string, L: Lingua, out: Seg[], st: EstadoCodigo) {
  let i = 0;
  const n = s.length;
  while (i < n) {
    if (st.bloco) {
      const fim = s.indexOf("*/", i);
      const ate = fim < 0 ? n : fim + 2;
      por(out, s.slice(i, ate), CO);
      i = ate;
      if (fim >= 0) st.bloco = false;
      continue;
    }
    if (st.texto3) {
      const fim = s.indexOf('"""', i);
      const ate = fim < 0 ? n : fim + 3;
      por(out, s.slice(i, ate), ST);
      i = ate;
      if (fim >= 0) st.texto3 = false;
      continue;
    }
    const ch = s[i];
    if (ch === " " || ch === "\t") {
      let j = i;
      while (s[j] === " " || s[j] === "\t") j++;
      por(out, s.slice(i, j));
      i = j;
      continue;
    }
    if (L.com?.some((p) => s.startsWith(p, i))) {
      por(out, s.slice(i), CO);
      return;
    }
    if (L.bloco && s.startsWith("/*", i)) {
      st.bloco = true;
      por(out, "/*", CO);
      i += 2;
      continue;
    }
    if (L.texto3 && s.startsWith('"""', i)) {
      st.texto3 = true;
      por(out, '"""', ST);
      i += 3;
      continue;
    }
    if (L.aspas?.includes(ch)) {
      const f = fimDaString(s, i);
      por(out, s.slice(i, f), ST);
      i = f;
      continue;
    }
    if (/\d/.test(ch) || (ch === "." && /\d/.test(s[i + 1] ?? ""))) {
      const m = NUMERO.exec(s.slice(i));
      const t = m ? m[0] : ch;
      por(out, t, NU);
      i += t.length;
      continue;
    }
    if (L.anot && ch === "@" && /[A-Za-z]/.test(s[i + 1] ?? "")) {
      const p = /^@[\w.]+/.exec(s.slice(i))![0];
      por(out, p, FN);
      i += p.length;
      continue;
    }
    if (/[A-Za-z_$]/.test(ch)) {
      const p = PALAVRA.exec(s.slice(i))![0];
      let cor = VA;
      if (L.kw?.has(p)) cor = KW;
      else if (L.ctl?.has(p)) cor = CT;
      else if (/^\s*\(/.test(s.slice(i + p.length))) cor = FN;
      else if (/^[A-Z][a-z0-9]/.test(p) || /^[A-Z]$/.test(p)) cor = TP;
      por(out, p, cor);
      i += p.length;
      continue;
    }
    por(out, ch, PO);
    i++;
  }
}

/** Uma linha de shell (bash, sh, o console). */
function linhaSh(s: string, L: Lingua, out: Seg[], docker = false) {
  let i = 0;
  let comando = true;
  if (docker) {
    const m = /^(\s*)([A-Z]+)(?=\s)/.exec(s);
    if (m) {
      por(out, m[1]);
      por(out, m[2], KW);
      i = m[0].length;
    }
  }
  const prompt = /^(\s*)(\$|#|>)(\s)/.exec(s);
  if (!docker && prompt && prompt[2] === "$") {
    por(out, prompt[1] + prompt[2], PO);
    por(out, prompt[3]);
    i = prompt[0].length;
  }
  while (i < s.length) {
    const ch = s[i];
    if (/\s/.test(ch)) {
      por(out, ch);
      i++;
    } else if (ch === "#" && (i === 0 || /\s/.test(s[i - 1]))) {
      por(out, s.slice(i), CO);
      return;
    } else if (ch === '"' || ch === "'") {
      const f = fimDaString(s, i);
      por(out, s.slice(i, f), ST);
      i = f;
      comando = false;
    } else if (ch === "$") {
      const m = /^\$(\{[^}]*\}|\w+|[@#?*!$-])?/.exec(s.slice(i))!;
      if (s[i + 1] === "(") {
        por(out, "$(", PO);
        i += 2;
        comando = true;
      } else {
        por(out, m[0], VA);
        i += m[0].length;
      }
    } else if (/[|&;()<>]/.test(ch)) {
      por(out, ch, PO);
      i++;
      if (/[|&;(]/.test(ch)) comando = true;
    } else if (ch === "\\") {
      por(out, s.slice(i, i + 2), FN);
      i += 2;
    } else {
      const m = /^[^\s|&;()<>"'$#\\]+/.exec(s.slice(i));
      const p = m ? m[0] : ch;
      if (comando) {
        if (L.ctl?.has(p)) por(out, p, CT);
        else if (/^\w+=/.test(p)) {
          const k = p.indexOf("=");
          por(out, p.slice(0, k), VA);
          por(out, "=", PO);
          por(out, p.slice(k + 1), ST);
        } else {
          por(out, p, FN);
          comando = false;
        }
      } else if (/^-?\d+$/.test(p)) por(out, p, NU);
      else por(out, p);
      i += p.length;
    }
  }
}

function linhaJson(s: string, L: Lingua, out: Seg[], st: EstadoCodigo) {
  let i = 0;
  while (i < s.length) {
    if (st.bloco) {
      const fim = s.indexOf("*/", i);
      const ate = fim < 0 ? s.length : fim + 2;
      por(out, s.slice(i, ate), CO);
      i = ate;
      if (fim >= 0) st.bloco = false;
      continue;
    }
    const ch = s[i];
    if (s.startsWith("//", i)) {
      por(out, s.slice(i), CO);
      return;
    }
    if (L.bloco && s.startsWith("/*", i)) {
      st.bloco = true;
      continue;
    }
    if (ch === '"') {
      const f = fimDaString(s, i);
      por(out, s.slice(i, f), /^\s*:/.test(s.slice(f)) ? VA : ST);
      i = f;
    } else if (/[-\d]/.test(ch)) {
      const m = /^-?\d+(\.\d+)?([eE][+-]?\d+)?/.exec(s.slice(i));
      const t = m ? m[0] : ch;
      por(out, t, m ? NU : PO);
      i += t.length;
    } else if (/[a-z]/.test(ch)) {
      const p = /^[a-z]+/.exec(s.slice(i))![0];
      por(out, p, KW);
      i += p.length;
    } else if (/\s/.test(ch)) {
      por(out, ch);
      i++;
    } else {
      por(out, ch, PO);
      i++;
    }
  }
}

function linhaXml(s: string, out: Seg[], st: EstadoCodigo) {
  let i = 0;
  while (i < s.length) {
    if (st.comXml) {
      const fim = s.indexOf("-->", i);
      const ate = fim < 0 ? s.length : fim + 3;
      por(out, s.slice(i, ate), CO);
      i = ate;
      if (fim >= 0) st.comXml = false;
      continue;
    }
    if (st.tagXml) {
      const ch = s[i];
      if (s.startsWith("/>", i) || s.startsWith("?>", i)) {
        por(out, s.slice(i, i + 2), PO);
        i += 2;
        st.tagXml = false;
      } else if (ch === ">") {
        por(out, ">", PO);
        i++;
        st.tagXml = false;
      } else if (ch === '"' || ch === "'") {
        const f = fimDaString(s, i);
        por(out, s.slice(i, f), ST);
        i = f;
      } else if (/[\w:-]/.test(ch)) {
        const p = /^[\w:.-]+/.exec(s.slice(i))![0];
        por(out, p, AT);
        i += p.length;
      } else {
        por(out, ch, /\s/.test(ch) ? TX : PO);
        i++;
      }
      continue;
    }
    if (s.startsWith("<!--", i)) {
      st.comXml = true;
      continue;
    }
    if (s[i] === "<" && /[/?!A-Za-z]/.test(s[i + 1] ?? "")) {
      const m = /^<([/?!]?)([\w:.-]*)/.exec(s.slice(i))!;
      por(out, "<" + m[1], PO);
      por(out, m[2], TI);
      i += m[0].length;
      st.tagXml = true;
      continue;
    }
    const fim = s.indexOf("<", i + 1);
    const ate = fim < 0 ? s.length : fim;
    const texto = s.slice(i, ate);
    const ent = /&[\w#]+;/g;
    let ultimo = 0;
    let m: RegExpExecArray | null;
    while ((m = ent.exec(texto))) {
      por(out, texto.slice(ultimo, m.index));
      por(out, m[0], FN);
      ultimo = m.index + m[0].length;
    }
    por(out, texto.slice(ultimo));
    i = ate;
  }
}

function linhaSql(s: string, L: Lingua, out: Seg[]) {
  const re = /(--.*$)|('(?:[^']|'')*'?)|("[^"]*")|(\d+(?:\.\d+)?)|([A-Za-z_][\w$]*)|(\s+)|(.)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    if (m[1]) por(out, m[1], CO);
    else if (m[2]) por(out, m[2], ST);
    else if (m[3]) por(out, m[3], VA);
    else if (m[4]) por(out, m[4], NU);
    else if (m[5]) {
      const p = m[5];
      if (L.kw?.has(p.toLowerCase())) por(out, p, KW);
      else if (/^\s*\(/.test(s.slice(re.lastIndex))) por(out, p, FN);
      else por(out, p);
    } else if (m[6]) por(out, m[6]);
    else por(out, m[7], PO);
  }
}

function linhaIni(s: string, out: Seg[]) {
  const com = /^(\s*)([#;!].*)$/.exec(s);
  if (com) {
    por(out, com[1]);
    por(out, com[2], CO);
    return;
  }
  const secao = /^(\s*)(\[[^\]]*\])(.*)$/.exec(s);
  if (secao) {
    por(out, secao[1]);
    por(out, secao[2], TP);
    por(out, secao[3]);
    return;
  }
  const kv = /^(\s*)([^=:\s]+)(\s*[=:]\s*)(.*)$/.exec(s);
  if (kv) {
    por(out, kv[1]);
    por(out, kv[2], VA);
    por(out, kv[3], PO);
    const v = kv[4];
    por(out, v, /^-?\d+(\.\d+)?$/.test(v) ? NU : /^(true|false)$/.test(v) ? KW : ST);
    return;
  }
  por(out, s);
}

function linhaDeCodigo(s: string, L: Lingua | null, out: Seg[], st: EstadoCodigo) {
  if (!L) return por(out, s);
  switch (L.tipo) {
    case "c":
      return linhaC(s, L, out, st);
    case "sh":
      return linhaSh(s, L, out);
    case "docker":
      return linhaSh(s, L, out, true);
    case "yaml":
      return linhaYaml(s, out);
    case "json":
      return linhaJson(s, L, out, st);
    case "xml":
      return linhaXml(s, out, st);
    case "sql":
      return linhaSql(s, L, out);
    case "ini":
      return linhaIni(s, out);
  }
}

/** O texto de um título, sem as marcas do Markdown (para a trilha e a Estrutura de tópicos). */
const textoDoTitulo = (t: string) =>
  t
    .replace(/\s*\{#[^}]*\}\s*$/, "")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/(\*\*|__)(.+?)\1/g, "$2")
    .replace(/(\*|_)(.+?)\1/g, "$2")
    .replace(/\s+#+\s*$/, "")
    .trim();

const BLOCO = 64;

/** Um arquivo que não é Markdown (o .zshrc, um .json): cada linha na linguagem dele. */
function realcarCodigo(texto: string, lingua: Lingua | null): Doc {
  const linhas = texto.replace(/\r\n?/g, "\n").replace(/\n$/, "").split("\n");
  const estado: EstadoCodigo = { bloco: false, texto3: false, comXml: false, tagXml: false };
  const segs: Seg[][] = [];
  let html = "";
  linhas.forEach((s, n) => {
    const out: Seg[] = [];
    linhaDeCodigo(s, lingua, out, estado);
    segs.push(out);
    if (n % BLOCO === 0) {
      const ate = Math.min(linhas.length, n + BLOCO);
      html += `${n ? "</div>" : ""}<div class="ed-bloco" style="contain-intrinsic-block-size:auto ${(ate - n) * 20}px;counter-reset:ed-linha ${n}">`;
    }
    html += `<div class="l">${htmlDaLinha(out)}</div>`;
  });
  if (linhas.length) html += "</div>";
  return { linhas, segs, titulos: [], html };
}

/** Os arquivos já realçados (abrir de novo uma aba fechada não refaz o realce). */
const DOCS = new Map<string, Doc>();

/** O arquivo inteiro, realçado: o HTML de todas as linhas (uma string) e os pedaços (para o minimapa). */
function realcar(texto: string, tipo: TipoDeArquivo): Doc {
  const mdx = tipo === "mdx";
  if (tipo !== "md" && tipo !== "mdx") return realcarCodigo(texto, tipo === "texto" ? null : LINGUAS[tipo === "sh" ? "bash" : tipo]);
  const linhas = texto.replace(/\r\n?/g, "\n").replace(/\n$/, "").split("\n");
  const segs: Seg[][] = [];
  const titulos: Titulo[] = [];
  let modo: "md" | "fm" | "cerca" | "jsx" | "com" = "md";
  let cerca = { char: "", n: 0, lingua: null as Lingua | null };
  let estado: EstadoCodigo = { bloco: false, texto3: false, comXml: false, tagXml: false };
  const jsx: EstadoJsx = { aberto: false, prof: 0 };
  let html = "";

  for (let n = 0; n < linhas.length; n++) {
    const s = linhas[n];
    const out: Seg[] = [];
    if (n === 0 && s.trim() === "---") {
      modo = "fm";
      por(out, s, PO);
    } else if (modo === "fm") {
      if (s.trim() === "---") {
        modo = "md";
        por(out, s, PO);
      } else linhaYaml(s, out);
    } else if (modo === "cerca") {
      const fecha = /^\s*(`{3,}|~{3,})\s*$/.exec(s);
      if (fecha && fecha[1][0] === cerca.char && fecha[1].length >= cerca.n) {
        modo = "md";
        por(out, s, PO);
      } else linhaDeCodigo(s, cerca.lingua, out, estado);
    } else if (modo === "com") {
      const fim = s.indexOf("-->");
      if (fim < 0) por(out, s, CO);
      else {
        por(out, s.slice(0, fim + 3), CO);
        emLinha(s.slice(fim + 3), out);
        modo = "md";
      }
    } else if (modo === "jsx") {
      const fim = atributosJsx(s, 0, out, jsx);
      if (!jsx.aberto) {
        modo = "md";
        emLinha(s.slice(fim), out);
      }
    } else {
      let m: RegExpExecArray | null;
      if (mdx && /^(import|export)\s/.test(s)) {
        linhaC(s, LINGUAS.js, out, estado);
      } else if ((m = /^(\s*)(`{3,}|~{3,})(.*)$/.exec(s))) {
        por(out, m[1]);
        por(out, m[2], PO);
        const info = /^(\s*)([\w#+.-]*)(.*)$/.exec(m[3])!;
        por(out, info[1]);
        por(out, info[2]);
        atributosDiretiva(info[3], out);
        modo = "cerca";
        cerca = { char: m[2][0], n: m[2].length, lingua: LINGUAS[info[2].toLowerCase()] ?? null };
        estado = { bloco: false, texto3: false, comXml: false, tagXml: false };
      } else if ((m = /^(\s{0,3})(#{1,6})(\s+.*|\s*)$/.exec(s))) {
        por(out, s, TI, NEG);
        titulos.push({ nivel: m[2].length, texto: textoDoTitulo(m[3]) || "(sem título)", linha: n });
      } else if (/^\s*<!--/.test(s)) {
        const ini = s.indexOf("<!--");
        const fim = s.indexOf("-->", ini + 4);
        por(out, s.slice(0, ini));
        if (fim < 0) {
          por(out, s.slice(ini), CO);
          modo = "com";
        } else {
          por(out, s.slice(ini, fim + 3), CO);
          emLinha(s.slice(fim + 3), out);
        }
      } else if (/^\s*<\/?[A-Za-z]/.test(s)) {
        const ini = s.indexOf("<");
        por(out, s.slice(0, ini));
        jsx.aberto = false;
        jsx.prof = 0;
        const fim = tagJsx(s, ini, out, jsx);
        if (jsx.aberto) modo = "jsx";
        else emLinha(s.slice(fim < 0 ? ini : fim), out);
      } else if ((m = /^(\s*)(:{3,})([\w-]*)(\{.*\})?(.*)$/.exec(s))) {
        por(out, m[1]);
        por(out, m[2], PO);
        por(out, m[3], CT);
        if (m[4]) atributosDiretiva(m[4], out);
        emLinha(m[5], out);
      } else if ((m = /^(\s*)(>+)(.*)$/.exec(s))) {
        por(out, m[1]);
        por(out, m[2], CO);
        emLinha(m[3], out, CO);
      } else if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(s)) {
        por(out, s, PO);
      } else if ((m = /^(\s*)([-*+]|\d{1,9}[.)])(\s+)(.*)$/.exec(s))) {
        por(out, m[1]);
        por(out, m[2], KW);
        por(out, m[3]);
        emLinha(m[4], out);
      } else if (/^\s*\|/.test(s)) {
        if (/^\s*\|?[\s:|-]+$/.test(s)) por(out, s, PO);
        else {
          // As barras fora do código em linha separam as células.
          const partes = s.split(/(`[^`]*`|\\\||\|)/);
          for (const p of partes) {
            if (p === "|") por(out, p, PO);
            else if (p) emLinha(p, out);
          }
        }
      } else emLinha(s, out);
    }
    segs.push(out);
    // Em blocos de 64 linhas com content-visibility: o navegador só mede e pinta os que estão à vista.
    if (n % BLOCO === 0) {
      const ate = Math.min(linhas.length, n + BLOCO);
      html += `${n ? "</div>" : ""}<div class="ed-bloco" style="contain-intrinsic-block-size:auto ${(ate - n) * 20}px;counter-reset:ed-linha ${n}">`;
    }
    html += `<div class="l">${htmlDaLinha(out)}</div>`;
  }
  if (linhas.length) html += "</div>";
  return { linhas, segs, titulos, html };
}

/** A cor de cada índice no minimapa (a variável CSS de onde ela vem). */
const CORES_DO_MAPA = [
  "--mac-ed-texto",
  "--mac-sx-titulo",
  "--mac-sx-chave",
  "--mac-sx-controle",
  "--mac-sx-texto",
  "--mac-sx-numero",
  "--mac-sx-funcao",
  "--mac-sx-tipo",
  "--mac-sx-variavel",
  "--mac-sx-comentario",
  "--mac-sx-atributo",
  "--mac-sx-pontuacao",
];

/** O Leia-me.md da raiz: o que é o repositório, as pastas e os atalhos (montado com os dados do blog). */
function textoDoLeiaMe(d: DadosM): string {
  const livros = d.livros.filter((l) => !l.serie);
  const series = d.livros.filter((l) => l.serie);
  const conta = (n: number, um: string, varios: string) => `${n} ${n === 1 ? um : varios}`;
  return [
    "# blog",
    "",
    "O blog aberto como um repositório: cada livro da coleção é uma pasta, e cada artigo, um arquivo",
    "Markdown (`.md`, ou `.mdx` quando o artigo usa um componente, como a lousa), com o frontmatter.",
    "",
    "## Pastas",
    "",
    `- \`livros/\`: ${conta(livros.length, "livro", "livros")} da coleção, em ordem de nome.`,
    `- \`series/\`: ${conta(series.length, "série", "séries")}, em que cada artigo é uma edição.`,
    "",
    "## Livros",
    "",
    "| Volume | Pasta | Livro | Artigos |",
    "| --- | --- | --- | --- |",
    ...livros.map((l) => `| ${l.volume ?? "-"} | \`${l.pasta}/\` | ${l.nome} | ${l.posts.length} |`),
    "",
    "## Séries",
    "",
    ...series.map((l) => `- \`${l.pasta}/\`: ${l.nome} (${conta(l.posts.length, "edição", "edições")})`),
    "",
    "## Atalhos",
    "",
    "- **⌘P**: ir para um arquivo pelo nome ou pelo título.",
    "- **⇧⌘F**: pesquisar no texto de todos os arquivos.",
    "- **⇧⌘P**: mostrar todos os comandos.",
    "- **⌘F**: localizar no arquivo aberto.",
    "- **⌃G**: ir para uma linha.",
    "- **⌥Z**: quebrar as linhas longas.",
    "",
    "> Os arquivos são só para leitura. Para ler um artigo com as imagens, use *Ler no blog*, no alto do",
    "> editor, ou abra o PDF dele na Pré-Visualização.",
    "",
  ].join("\n");
}

// =====================================================================================================
// A busca (sem acento e sem caixa) e o filtro "fuzzy" do Ir para arquivo
// =====================================================================================================

const normal = (t: string) => t.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

/** As letras da consulta, em ordem, dentro do nome (o filtro do Ir para arquivo). Devolve as posições. */
function casar(nome: string, consulta: string): number[] | null {
  const n = normal(nome);
  const q = normal(consulta).replace(/\s+/g, "");
  if (!q) return [];
  const junto = n.indexOf(q);
  if (junto >= 0) return Array.from({ length: q.length }, (_, k) => junto + k);
  const pos: number[] = [];
  let j = 0;
  for (let i = 0; i < n.length && j < q.length; i++) if (n[i] === q[j]) pos.push(i), j++;
  return j === q.length ? pos : null;
}

/** A nota de um achado: as letras juntas valem mais, e mais ainda no começo de uma palavra. */
function nota(pos: number[], nome: string): number {
  if (!pos.length) return 0;
  const juntas = pos[pos.length - 1] - pos[0] === pos.length - 1;
  const comecoDePalavra = pos[0] === 0 || /[\s:._/-]/.test(nome[pos[0] - 1]);
  return (juntas ? 1000 : 0) + (comecoDePalavra ? 500 : 0) - pos[0];
}

/** O nome com as letras achadas marcadas (<mark>). */
function marcar(nome: string, pos: number[]): string {
  if (!pos.length) return escapar(nome);
  const em = new Set(pos);
  let h = "";
  let dentro = false;
  for (let i = 0; i < nome.length; i++) {
    const quer = em.has(i);
    if (quer !== dentro) {
      h += quer ? "<mark>" : "</mark>";
      dentro = quer;
    }
    h += escapar(nome[i]);
  }
  return h + (dentro ? "</mark>" : "");
}

// =====================================================================================================
// O app
// =====================================================================================================

const MAC = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
const LINHA = 20;
/** No VS Code, o Markdown abre com a quebra de linha ligada; aqui o pedido foi o editor de código, que não quebra (⌥Z liga). */
const QUEBRA_PADRAO = false;
const colar = new Intl.Collator("pt-BR", { numeric: true, sensitivity: "base" });
let contador = 0;

/** Um arquivo da árvore: um post (em livros/ ou series/) ou o Leia-me.md da raiz (gerado aqui). */
interface Arquivo {
  slug: string;
  nome: string;
  /** A linguagem do arquivo (o realce, o ícone e o nome na barra de status). */
  ext: TipoDeArquivo;
  titulo: string;
  /** A pasta, a partir da raiz ("livros/dados"); vazio no Leia-me. */
  caminho: string;
  grupo?: "livros" | "series";
  post?: PostM;
  livro?: LivroM;
  /** O texto já pronto (o Leia-me); os posts vêm de textoDoPost. */
  texto?: string;
  /** Um texto de fora da árvore (o Terminal mandou abrir: o .zshrc, o leia-me de lá). */
  avulso?: boolean;
}

/** O que os outros apps pedem ao Código. */
interface PedidoDoCodigo {
  /** Um post: abre o arquivo dele. */
  slug?: string;
  /** "Leia-me.md" (o da raiz) ou um texto qualquer, com o nome, o caminho e o conteúdo. */
  arquivo?: string | { nome: string; caminho?: string; texto: string };
  /** O id de um livro: a pasta dele aberta e à vista no Explorer. */
  livro?: string;
}

type TipoDeArquivo = "md" | "mdx" | "sh" | "json" | "yaml" | "texto";

/** O tipo pelo nome (os textos que o Terminal manda abrir: o leia-me, o .zshrc). */
function tipoDoNome(nome: string): TipoDeArquivo {
  const n = nome.toLowerCase();
  if (n.endsWith(".mdx")) return "mdx";
  if (n.endsWith(".md")) return "md";
  if (/(^|\.)(zshrc|bashrc|profile|zsh_history|bash_history)$|\.(sh|zsh|bash)$/.test(n)) return "sh";
  if (n.endsWith(".json")) return "json";
  if (/\.ya?ml$/.test(n)) return "yaml";
  return "texto";
}

const NOME_DA_LINGUA: Record<TipoDeArquivo, string> = {
  md: "Markdown",
  mdx: "MDX",
  sh: "Shell Script",
  json: "JSON",
  yaml: "YAML",
  texto: "Texto sem formatação",
};

const iconeDo = (t: TipoDeArquivo) => (t === "mdx" ? ICONE.mdx : t === "md" ? ICONE.md : ICONE.texto);

/** O Leia-me da raiz (o arquivo da área de trabalho, na direção de arte, seção 3). */
const LEIA_ME = "Leia-me.md";

interface Vista {
  arquivo: Arquivo;
  el: HTMLElement;
  rolagem: HTMLElement;
  folha: HTMLElement;
  calha: HTMLElement;
  codigo: HTMLElement;
  numero: HTMLElement;
  cursor: HTMLElement;
  mapa: HTMLElement;
  canvas: HTMLCanvasElement;
  deslizador: HTMLElement;
  doc?: Doc;
  estado: "carregando" | "pronto" | "erro";
  linha: number;
  col: number;
  colDesejada: number;
  ancora?: { linha: number; col: number };
  topo: number;
  esquerda: number;
  mapaDesenhado: string;
  maiorLinha: number;
  linhaMarcada?: HTMLElement;
  /** As linhas do DOM, na ordem (ficam em blocos, então não são filhas diretas). */
  linhasEl: HTMLElement[];
}

interface Aba {
  slug: string;
  previa: boolean;
  vista: Vista;
}

interface TextoDaBusca {
  linhas: string[];
  /** Onde cada linha começa no texto inteiro. */
  inicios: number[];
  /** O texto sem acento e sem caixa (null se a normalização mudou o tamanho: aí a busca vai linha a linha). */
  normal: string | null;
}

/** Até quantos achados a Pesquisar mostra (o DOM fica leve mesmo com uma letra só). */
const LIMITE_DA_BUSCA = 500;

interface ItemRapido {
  rotulo: string;
  html?: string;
  descricao?: string;
  atalho?: string;
  icone?: string;
  grupo?: string;
  acao: () => void;
}

export function criar(s: Sistema): App {
  s.estilo("editor", css);
  let ed: Editor | undefined;

  return {
    id: "editor",
    nome: "Código",
    async abrir(pedido) {
      const p = pedido as PedidoDoCodigo | undefined;
      const slug = (typeof p?.arquivo === "string" && p.arquivo.toLowerCase() === LEIA_ME.toLowerCase()) || p?.slug === "leia-me" ? LEIA_ME : p?.slug;
      if (!ed) ed = new Editor(s, () => (ed = undefined));
      else if (ed.janela.minimizada) await ed.janela.restaurar();
      else ed.janela.ativar();
      await ed.pronto;
      if (slug) await ed.abrirArquivo(slug, { previa: false, focar: true });
      else if (p?.arquivo && typeof p.arquivo === "object") await ed.abrirTexto(p.arquivo);
      else if (p?.livro) ed.revelarLivro(p.livro);
      else if (!ed.janela.minimizada) ed.focarAgora();
    },
    menus: () => (ed ? ed.menus() : []),
    menuDoApp: () => (ed ? ed.menuDoApp() : []),
    tecla: (e) => (ed ? ed.tecla(e) : false),
  };
}

class Editor {
  readonly janela: Janela;
  readonly pronto: Promise<void>;
  private raiz: HTMLElement;
  private id = ++contador;
  private s: Sistema;
  private aoSair: () => void;

  private arquivos = new Map<string, Arquivo>();
  private livroPorPasta = new Map<string, LivroM>();
  private abas: Aba[] = [];
  private ativa: Aba | undefined;
  private recentes: string[] = [];
  private historico: { slug: string; linha: number }[] = [];
  private posHistorico = -1;
  private naFrente = true;
  private vistaLateral: "explorer" | "busca" = "explorer";
  private lateralVisivel = true;
  private minimapa = true;
  private quebra = QUEBRA_PADRAO;
  private larguraLateral = 240;
  private larguraCaractere = 7.8;
  private desligar: (() => void)[] = [];
  private observador: ResizeObserver;

  // As peças fixas.
  private el = {} as {
    lateral: HTMLElement;
    arvore: HTMLElement;
    topicos: HTMLElement;
    secaoBlog: HTMLElement;
    secaoTopicos: HTMLElement;
    busca: HTMLInputElement;
    resultados: HTMLElement;
    resumo: HTMLElement;
    progressoBusca: HTMLElement;
    barraAbas: HTMLElement;
    abas: HTMLElement;
    migalhas: HTMLElement;
    area: HTMLElement;
    boasvindas: HTMLElement;
    progresso: HTMLElement;
    localizar: HTMLElement;
    entradaLocalizar: HTMLInputElement;
    contagem: HTMLElement;
    aviso: HTMLElement;
    statusArquivo: HTMLElement;
    pos: HTMLElement;
    lingua: HTMLElement;
    cartao: HTMLElement;
    rapido: HTMLElement;
    entradaRapido: HTMLInputElement;
    listaRapido: HTMLElement;
    msgRapido: HTMLElement;
    ler: HTMLAnchorElement;
  };

  constructor(s: Sistema, aoSair: () => void) {
    this.s = s;
    this.aoSair = aoSair;
    this.raiz = this.montar();
    this.janela = s.criarJanela({
      app: "editor",
      titulo: "blog",
      largura: 1100,
      altura: 680,
      minLargura: 520,
      minAltura: 340,
      conteudo: this.raiz,
      semaforos: { x: 13, y: 11.5 },
      focar: () => this.focarAgora(),
      aoFechar: () => this.encerrar(),
      aoAtivar: (ativa) => this.aoAtivar(ativa),
      aoMudarTamanho: () => this.aoMudarTamanho(),
    });
    this.observador = new ResizeObserver(() => this.aoMudarTamanho());
    this.observador.observe(this.el.area);
    this.ligar();
    this.aplicarEstreito();
    this.pronto = this.carregar();
  }

  // ---------------------------------------------------------------------------------------------------
  // A montagem
  // ---------------------------------------------------------------------------------------------------

  private montar(): HTMLElement {
    const r = document.createElement("div");
    r.className = "ed";
    r.style.setProperty("--ed-lateral-w", `${this.larguraLateral}px`);
    const id = `ed${this.id}`;
    const tecla = (...t: string[]) => t.map((k) => `<kbd>${k}</kbd>`).join("");
    r.innerHTML = `
<header class="ed-titulo" data-arrastar>
  <div class="ed-titulo-meio">
    <button type="button" class="ed-botao ed-nav" data-acao="voltar" aria-label="Voltar" title="Voltar (⌃-)" disabled>${ICONE.voltar}</button>
    <button type="button" class="ed-botao ed-nav" data-acao="avancar" aria-label="Avançar" title="Avançar (⌃⇧-)" disabled>${ICONE.avancar}</button>
    <button type="button" class="ed-centro" data-acao="ir-arquivo" aria-label="Pesquisar no blog: ir para arquivo" title="Pesquisar no blog (⌘P)">${glifo("busca", "ed-ico")}<span>blog</span></button>
  </div>
  <div class="ed-titulo-dir">
    <button type="button" class="ed-botao" data-acao="lateral" aria-pressed="true" aria-label="Barra lateral principal" title="Alternar a barra lateral principal (⌘B)">${ICONE.lateral}</button>
    <button type="button" class="ed-botao" data-acao="terminal" aria-label="Abrir o Terminal" title="Abrir o Terminal">${ICONE.painel}</button>
  </div>
</header>
<div class="ed-corpo">
  <div class="ed-atividades" role="toolbar" aria-orientation="vertical" aria-label="Barra de atividades">
    <button type="button" class="ed-atividade" data-vista="explorer" aria-pressed="true" aria-label="Explorer" title="Explorer (⇧⌘E)">${ICONE.arquivos}</button>
    <button type="button" class="ed-atividade" data-vista="busca" aria-pressed="false" aria-label="Pesquisar" title="Pesquisar (⇧⌘F)" tabindex="-1">${ICONE.lupa}</button>
    <span class="ed-atividades-vao"></span>
    <button type="button" class="ed-atividade" data-acao="comandos" aria-label="Gerenciar: mostrar todos os comandos" title="Gerenciar (⇧⌘P)" tabindex="-1">${ICONE.engrenagem}</button>
  </div>
  <div class="ed-lateral" data-lateral>
    <section class="ed-vista" data-painel="explorer" aria-labelledby="${id}-t-exp">
      <div class="ed-lateral-cabeca"><h2 id="${id}-t-exp">Explorer</h2></div>
      <div class="ed-secao ed-secao--blog" data-secao="blog">
        <div class="ed-secao-cabeca">
          <button type="button" class="ed-secao-botao" aria-expanded="true">${ICONE.seta}<span>blog</span></button>
          <span class="ed-secao-acoes"><button type="button" class="ed-botao ed-botao--p" data-acao="recolher" aria-label="Recolher as pastas" title="Recolher as pastas no Explorer">${ICONE.recolher}</button></span>
        </div>
        <div class="ed-secao-corpo"><div class="ed-arvore" role="tree" aria-label="Arquivos do blog" data-arvore><p class="ed-vazio-lateral">Lendo a pasta do blog…</p></div></div>
      </div>
      <div class="ed-secao ed-secao--topicos fechada" data-secao="topicos">
        <div class="ed-secao-cabeca">
          <button type="button" class="ed-secao-botao" aria-expanded="false">${ICONE.seta}<span>Estrutura de tópicos</span></button>
        </div>
        <div class="ed-secao-corpo" hidden><div class="ed-topicos" role="tree" aria-label="Estrutura de tópicos" data-topicos></div></div>
      </div>
    </section>
    <section class="ed-vista" data-painel="busca" aria-labelledby="${id}-t-bus" hidden>
      <div class="ed-lateral-cabeca"><h2 id="${id}-t-bus">Pesquisar</h2>
        <span class="ed-secao-acoes ed-secao-acoes--sempre"><button type="button" class="ed-botao ed-botao--p" data-acao="limpar-busca" aria-label="Limpar os resultados da pesquisa" title="Limpar os resultados da pesquisa">${ICONE.limpar}</button></span>
      </div>
      <div class="ed-busca"><label class="ed-entrada">${glifo("busca", "ed-ico ed-entrada-ico")}<input type="text" data-busca placeholder="Pesquisar" aria-label="Pesquisar nos arquivos" spellcheck="false" autocomplete="off" enterkeyhint="search"></label></div>
      <div class="ed-progresso" data-progresso-busca hidden></div>
      <p class="ed-busca-resumo" data-resumo aria-live="polite"></p>
      <div class="ed-busca-lista" role="tree" aria-label="Resultados da pesquisa" data-resultados></div>
    </section>
    <div class="ed-sash" data-sash aria-hidden="true"></div>
  </div>
  <div class="ed-grupo">
    <div class="ed-abas-barra" data-barra-abas hidden>
      <div class="ed-abas" role="tablist" aria-label="Editores abertos" data-abas></div>
      <div class="ed-acoes-editor">
        <button type="button" class="ed-botao" data-acao="previa" aria-label="Abrir na Pré-Visualização" title="Abrir na Pré-Visualização">${ICONE.previa}</button>
        <a class="ed-botao" data-ler href="/" aria-label="Ler no blog" title="Ler no blog">${glifo("ler", "ed-ico")}</a>
      </div>
    </div>
    <nav class="ed-migalhas" data-migalhas aria-label="Trilha de navegação" hidden></nav>
    <div class="ed-area" data-area role="tabpanel" id="${id}-area">
      <div class="ed-boasvindas" data-boasvindas>
        <svg class="ed-marca" viewBox="${MARCA_VIEWBOX}" aria-hidden="true" focusable="false">${MARCA_SVG}</svg>
        <p class="ed-boasvindas-dica">Abra um arquivo no Explorer, à esquerda.</p>
        <div class="ed-dicas">
          <button type="button" data-acao="ir-arquivo"><span>Ir para arquivo</span><span class="ed-teclas">${tecla("⌘", "P")}</span></button>
          <button type="button" data-acao="pesquisar"><span>Pesquisar nos arquivos</span><span class="ed-teclas">${tecla("⇧", "⌘", "F")}</span></button>
          <button type="button" data-acao="comandos"><span>Mostrar todos os comandos</span><span class="ed-teclas">${tecla("⇧", "⌘", "P")}</span></button>
          <button type="button" data-acao="terminal-suspenso"><span>Alternar o terminal</span><span class="ed-teclas">${tecla("⌃", "`")}</span></button>
        </div>
      </div>
      <div class="ed-progresso ed-progresso--editor" data-progresso hidden></div>
      <div class="ed-localizar" data-localizar role="search" aria-label="Localizar" hidden>
        <label class="ed-entrada ed-entrada--localizar"><input type="text" data-entrada-localizar placeholder="Localizar" aria-label="Localizar" spellcheck="false" autocomplete="off">
          <button type="button" class="ed-opcao" data-opcao="caixa" aria-pressed="false" title="Diferenciar maiúsculas de minúsculas (⌥⌘C)" aria-label="Diferenciar maiúsculas de minúsculas">Aa</button>
          <button type="button" class="ed-opcao ed-opcao--palavra" data-opcao="palavra" aria-pressed="false" title="Coincidir palavra inteira (⌥⌘W)" aria-label="Coincidir palavra inteira">ab</button>
          <button type="button" class="ed-opcao" data-opcao="regex" aria-pressed="false" title="Usar expressão regular (⌥⌘R)" aria-label="Usar expressão regular">.*</button>
        </label>
        <span class="ed-localizar-conta" data-contagem aria-live="polite">Sem resultados</span>
        <button type="button" class="ed-botao" data-acao="achado-anterior" aria-label="Resultado anterior" title="Resultado anterior (⇧↵)">${ICONE.cima}</button>
        <button type="button" class="ed-botao" data-acao="achado-proximo" aria-label="Próximo resultado" title="Próximo resultado (↵)">${ICONE.baixo}</button>
        <button type="button" class="ed-botao" data-acao="fechar-localizar" aria-label="Fechar" title="Fechar (esc)">${ICONE.fechar}</button>
      </div>
      <div class="ed-aviso" data-aviso role="status" hidden>Não é possível editar no editor somente leitura.</div>
    </div>
  </div>
</div>
<footer class="ed-status">
  <div class="ed-status-esq">
    <span class="ed-status-item ed-status-remoto" title="Blog local">${glifo("remoto")}</span>
    <span class="ed-status-item" title="blog (Ramo)">${glifo("ramo")}<span>main</span></span>
    <span class="ed-status-item ed-so-largo" title="Nenhum problema">${glifo("erro")}<span>0</span>${glifo("aviso")}<span>0</span></span>
  </div>
  <div class="ed-status-dir">
    <span class="ed-status-arquivo" data-status-arquivo hidden>
      <button type="button" class="ed-status-item" data-acao="ir-linha" data-pos title="Ir para a linha/coluna (⌃G)">Ln 1, Col 1</button>
      <span class="ed-status-item ed-so-largo">Espaços: 2</span>
      <span class="ed-status-item ed-so-largo">UTF-8</span>
      <span class="ed-status-item ed-so-largo">LF</span>
      <span class="ed-status-item" data-lingua>Markdown</span>
    </span>
    <span class="ed-status-item" title="Nenhuma notificação nova">${glifo("sino")}</span>
  </div>
</footer>
<div class="ed-cartao" data-cartao id="${id}-cartao" role="tooltip" hidden></div>
<div class="ed-rapido" data-rapido role="dialog" aria-label="Ir para arquivo" hidden>
  <div class="ed-rapido-caixa">
    <label class="ed-entrada ed-entrada--rapido"><input type="text" data-entrada-rapido role="combobox" aria-expanded="true" aria-controls="${id}-lista" aria-autocomplete="list" spellcheck="false" autocomplete="off"></label>
    <p class="ed-rapido-msg" data-msg-rapido hidden></p>
    <div class="ed-rapido-lista" role="listbox" id="${id}-lista" aria-label="Resultados" data-lista-rapido></div>
  </div>
</div>`;
    const q = <T extends HTMLElement = HTMLElement>(sel: string) => r.querySelector<T>(sel)!;
    this.el = {
      lateral: q("[data-lateral]"),
      arvore: q("[data-arvore]"),
      topicos: q("[data-topicos]"),
      secaoBlog: q('[data-secao="blog"]'),
      secaoTopicos: q('[data-secao="topicos"]'),
      busca: q<HTMLInputElement>("[data-busca]"),
      resultados: q("[data-resultados]"),
      resumo: q("[data-resumo]"),
      progressoBusca: q("[data-progresso-busca]"),
      barraAbas: q("[data-barra-abas]"),
      abas: q("[data-abas]"),
      migalhas: q("[data-migalhas]"),
      area: q("[data-area]"),
      boasvindas: q("[data-boasvindas]"),
      progresso: q("[data-progresso]"),
      localizar: q("[data-localizar]"),
      entradaLocalizar: q<HTMLInputElement>("[data-entrada-localizar]"),
      contagem: q("[data-contagem]"),
      aviso: q("[data-aviso]"),
      statusArquivo: q("[data-status-arquivo]"),
      pos: q("[data-pos]"),
      lingua: q("[data-lingua]"),
      cartao: q("[data-cartao]"),
      rapido: q("[data-rapido]"),
      entradaRapido: q<HTMLInputElement>("[data-entrada-rapido]"),
      listaRapido: q("[data-lista-rapido]"),
      msgRapido: q("[data-msg-rapido]"),
      ler: q<HTMLAnchorElement>("[data-ler]"),
    };
    return r;
  }

  /** Os dados do blog viram a árvore (como o VS Code, em ordem de nome, com os números em ordem). */
  private async carregar() {
    let d: DadosM;
    try {
      d = await this.s.dados();
    } catch {
      this.el.arvore.innerHTML = `<p class="ed-vazio-lateral">Não deu para ler a pasta do blog. <button type="button" class="ed-link" data-acao="recarregar">Tentar de novo</button></p>`;
      return;
    }
    const posts = new Map(d.posts.map((p) => [p.slug, p]));
    for (const l of d.livros) {
      this.livroPorPasta.set(l.pasta, l);
      for (const slug of l.posts) {
        const post = posts.get(slug);
        if (!post || this.arquivos.has(slug)) continue;
        const grupo = l.serie ? "series" : "livros";
        this.arquivos.set(slug, { slug, nome: `${slug}.${post.ext}`, ext: post.ext, titulo: post.titulo, caminho: `${grupo}/${l.pasta}`, grupo, post, livro: l });
      }
    }
    this.arquivos.set(LEIA_ME, { slug: LEIA_ME, nome: LEIA_ME, ext: "md", titulo: "Leia-me", caminho: "", texto: textoDoLeiaMe(d) });
    this.montarArvore(d);
    // As fontes do código, antes do primeiro arquivo (as medidas do cursor dependem delas).
    void document.fonts?.load(`13px ${getComputedStyle(this.raiz).getPropertyValue("--ed-fonte").trim() || "monospace"}`).catch(() => {});
  }

  // ---------------------------------------------------------------------------------------------------
  // A árvore do Explorer
  // ---------------------------------------------------------------------------------------------------

  private montarArvore(d: DadosM) {
    const grupos = (["livros", "series"] as const)
      .map((g) => ({ nome: g, livros: d.livros.filter((l) => (g === "series") === l.serie).sort((a, b) => colar.compare(a.pasta, b.pasta)) }))
      .filter((g) => g.livros.length);
    const no = (nivel: number, pos: number, total: number, attrs: string, linha: string, filhos?: string) =>
      `<div role="treeitem" class="ed-no" tabindex="-1" aria-level="${nivel}" aria-setsize="${total}" aria-posinset="${pos}" aria-selected="false" ${attrs}>` +
      `<div class="ed-no-linha" style="--nivel:${nivel - 1}">${linha}</div>` +
      (filhos !== undefined ? `<div role="group" class="ed-no-filhos" style="--nivel:${nivel - 1}">${filhos}</div>` : "") +
      "</div>";
    const html = grupos
      .map((g, gi) => {
        const livros = g.livros
          .map((l, li) => {
            const arquivos = l.posts
              .map((slug) => this.arquivos.get(slug))
              .filter((a): a is Arquivo => Boolean(a))
              .sort((a, b) => colar.compare(a.nome, b.nome));
            const filhos = arquivos
              .map((a, ai) =>
                no(
                  3,
                  ai + 1,
                  arquivos.length,
                  `data-no="a:${escapar(a.slug)}" aria-label="${escapar(`${a.nome}, ${a.titulo}`)}"`,
                  `<span class="ed-seta-vaga"></span>${iconeDo(a.ext)}<span class="ed-no-nome">${escapar(a.nome)}</span>`,
                ),
              )
              .join("");
            return no(
              2,
              li + 1,
              g.livros.length,
              `data-no="l:${escapar(l.pasta)}" aria-expanded="false" aria-label="${escapar(`${l.pasta}, ${l.nome}`)}"`,
              `${ICONE.seta}<span class="ed-no-nome">${escapar(l.pasta)}</span>`,
              filhos,
            );
          })
          .join("");
        return no(1, gi + 1, grupos.length + 1, `data-no="g:${g.nome}" aria-expanded="true"`, `${ICONE.seta}<span class="ed-no-nome">${g.nome}</span>`, livros);
      })
      .join("");
    const leiaMe = no(1, grupos.length + 1, grupos.length + 1, `data-no="a:${LEIA_ME}"`, `<span class="ed-seta-vaga"></span>${ICONE.md}<span class="ed-no-nome">${LEIA_ME}</span>`);
    this.el.arvore.innerHTML = html + leiaMe;
    for (const f of this.el.arvore.querySelectorAll<HTMLElement>('[aria-expanded="false"] > [role="group"]')) f.hidden = true;
    const primeiro = this.el.arvore.querySelector<HTMLElement>('[role="treeitem"]');
    if (primeiro) primeiro.tabIndex = 0;
  }

  private itensVisiveis(arvore: HTMLElement): HTMLElement[] {
    return [...arvore.querySelectorAll<HTMLElement>('[role="treeitem"]')].filter((i) => !i.parentElement?.closest("[hidden]"));
  }

  private abrirPasta(item: HTMLElement, aberta: boolean) {
    if (!item.hasAttribute("aria-expanded")) return;
    if ((item.getAttribute("aria-expanded") === "true") === aberta) return;
    item.setAttribute("aria-expanded", String(aberta));
    const filhos = item.querySelector<HTMLElement>(':scope > [role="group"]');
    if (filhos) filhos.hidden = !aberta;
  }

  private moverFoco(arvore: HTMLElement, item: HTMLElement | undefined) {
    if (!item) return;
    for (const i of arvore.querySelectorAll<HTMLElement>('[role="treeitem"]')) i.tabIndex = i === item ? 0 : -1;
    item.focus({ preventScroll: true });
    (item.querySelector(":scope > .ed-no-linha, :scope > .ed-res-linha") ?? item).scrollIntoView({ block: "nearest" });
  }

  /** O teclado das árvores (o Explorer, a Estrutura de tópicos e os resultados da pesquisa), no padrão ARIA. */
  private teclasDaArvore(arvore: HTMLElement, ativar: (item: HTMLElement, fixar: boolean) => void) {
    arvore.addEventListener("keydown", (e) => {
      const item = (e.target as Element).closest<HTMLElement>('[role="treeitem"]');
      if (!item || e.metaKey || e.ctrlKey || e.altKey) return;
      const lista = this.itensVisiveis(arvore);
      const i = lista.indexOf(item);
      const pasta = item.hasAttribute("aria-expanded");
      const aberta = item.getAttribute("aria-expanded") === "true";
      switch (e.key) {
        case "ArrowDown":
          this.moverFoco(arvore, lista[Math.min(lista.length - 1, i + 1)]);
          break;
        case "ArrowUp":
          this.moverFoco(arvore, lista[Math.max(0, i - 1)]);
          break;
        case "Home":
          this.moverFoco(arvore, lista[0]);
          break;
        case "End":
          this.moverFoco(arvore, lista[lista.length - 1]);
          break;
        case "PageDown":
          this.moverFoco(arvore, lista[Math.min(lista.length - 1, i + 10)]);
          break;
        case "PageUp":
          this.moverFoco(arvore, lista[Math.max(0, i - 10)]);
          break;
        case "ArrowRight":
          if (pasta && !aberta) this.abrirPasta(item, true);
          else if (pasta) this.moverFoco(arvore, this.itensVisiveis(arvore)[i + 1]);
          else return;
          break;
        case "ArrowLeft":
          if (pasta && aberta) this.abrirPasta(item, false);
          else this.moverFoco(arvore, item.parentElement?.closest<HTMLElement>('[role="treeitem"]') ?? undefined);
          break;
        case "Enter":
          ativar(item, true);
          break;
        case " ":
          ativar(item, false);
          break;
        default:
          return;
      }
      e.preventDefault();
    });
  }

  private selecionarNaArvore(slug: string | undefined, revelar: boolean) {
    for (const i of this.el.arvore.querySelectorAll<HTMLElement>('[aria-selected="true"]')) i.setAttribute("aria-selected", "false");
    if (!slug) return;
    const item = this.el.arvore.querySelector<HTMLElement>(`[data-no="a:${CSS.escape(slug)}"]`);
    if (!item) return;
    item.setAttribute("aria-selected", "true");
    if (!revelar) return;
    // Como o "explorer.autoReveal" do VS Code: as pastas do arquivo abrem e ele fica à vista.
    let pai = item.parentElement?.closest<HTMLElement>('[role="treeitem"]');
    while (pai) {
      this.abrirPasta(pai, true);
      pai = pai.parentElement?.closest<HTMLElement>('[role="treeitem"]');
    }
    if (!this.el.arvore.contains(document.activeElement)) {
      for (const i of this.el.arvore.querySelectorAll<HTMLElement>('[role="treeitem"]')) i.tabIndex = i === item ? 0 : -1;
    }
    if (this.lateralVisivel && this.vistaLateral === "explorer") item.querySelector(".ed-no-linha")?.scrollIntoView({ block: "nearest" });
  }

  // ---------------------------------------------------------------------------------------------------
  // O cartão do hover (a imagem do post, ou a foto do livro)
  // ---------------------------------------------------------------------------------------------------

  private cartaoDe = "";
  private esperaCartao = 0;
  private someCartao = 0;
  private quenteAte = 0;

  private htmlDoCartao(no: string): string {
    if (no.startsWith("a:")) {
      const a = this.arquivos.get(no.slice(2));
      if (!a?.post || !a.livro) return "";
      const p = a.post;
      const livro = a.livro;
      const onde = livro.serie ? `Série ${livro.nome}` : `Volume ${livro.volume ?? ""} · ${livro.nome}`;
      return (
        (p.imagem ? `<div class="painel ed-cartao-painel" style="--cor:${escapar(p.cor)}">${desenhoDoPost(p, "medio")}</div>` : "") +
        `<div class="ed-cartao-texto"><p class="ed-cartao-titulo">${escapar(p.titulo)}</p>` +
        (p.subtitulo ? `<p class="ed-cartao-sub">${escapar(p.subtitulo)}</p>` : "") +
        `<p class="ed-cartao-livro"><span class="ed-cartao-cor" style="--cor:${escapar(livro.cor)}"></span>${escapar(onde)}</p>` +
        `<p class="ed-cartao-data">${escapar(p.data)} · ${p.minutos} min de leitura</p></div>`
      );
    }
    if (no.startsWith("l:")) {
      const l = this.livroPorPasta.get(no.slice(2));
      if (!l) return "";
      const foto = fotoDoLivro(l, "ed-cartao-foto");
      return (
        (foto ? `<div class="ed-cartao-livro-foto" style="--cor:${escapar(l.cor)}">${foto}</div>` : "") +
        `<div class="ed-cartao-texto"><p class="ed-cartao-titulo">${escapar(l.nome)}</p>` +
        `<p class="ed-cartao-sub">${escapar(l.descricao)}</p>` +
        `<p class="ed-cartao-livro"><span class="ed-cartao-cor" style="--cor:${escapar(l.cor)}"></span>${escapar(l.dados)}</p></div>`
      );
    }
    return "";
  }

  /** Mostra o cartão ao lado da linha (sem esperar quando ele já está aberto: só troca e acompanha). */
  private pedirCartao(item: HTMLElement, imediato = false) {
    const no = item.dataset.no ?? "";
    clearTimeout(this.someCartao);
    if (!no.startsWith("a:") && !no.startsWith("l:")) {
      this.esconderCartao();
      return;
    }
    clearTimeout(this.esperaCartao);
    const aberto = !this.el.cartao.hidden;
    if (aberto || imediato || performance.now() < this.quenteAte) this.mostrarCartao(item);
    else this.esperaCartao = window.setTimeout(() => this.mostrarCartao(item), 260);
  }

  private mostrarCartao(item: HTMLElement) {
    if (!item.isConnected || this.s.estreito.matches) return;
    const no = item.dataset.no ?? "";
    const c = this.el.cartao;
    const aberto = !c.hidden;
    if (this.cartaoDe !== no) {
      const html = this.htmlDoCartao(no);
      if (!html) return this.esconderCartao();
      c.innerHTML = html;
      c.classList.toggle("ed-cartao--livro", no.startsWith("l:"));
      this.cartaoDe = no;
    }
    const linha = item.querySelector<HTMLElement>(":scope > .ed-no-linha") ?? item;
    const base = this.raiz.getBoundingClientRect();
    const r = linha.getBoundingClientRect();
    const lat = this.el.lateral.getBoundingClientRect();
    if (aberto) c.classList.add("seguindo");
    c.hidden = false;
    const h = c.offsetHeight;
    const x = Math.round(lat.right - base.left + 6);
    const y = Math.round(Math.max(40, Math.min(r.top - base.top - 6, base.height - h - 30)));
    c.style.transform = `translate(${x}px, ${y}px)`;
    if (!aberto) {
      c.classList.remove("seguindo");
      if (!this.s.reduzido.matches) c.animate([{ opacity: 0, translate: "-4px 0" }, { opacity: 1, translate: "0 0" }], { duration: 140, easing: "cubic-bezier(0.2, 0.7, 0.3, 1)" });
    }
    item.setAttribute("aria-describedby", c.id);
  }

  private esconderCartao(depois = 0) {
    clearTimeout(this.esperaCartao);
    clearTimeout(this.someCartao);
    const fazer = () => {
      const c = this.el.cartao;
      if (c.hidden) return;
      c.hidden = true;
      c.classList.remove("seguindo");
      this.quenteAte = performance.now() + 400;
      this.raiz.querySelector(`[aria-describedby="${c.id}"]`)?.removeAttribute("aria-describedby");
    };
    if (depois) this.someCartao = window.setTimeout(fazer, depois);
    else fazer();
  }

  // ---------------------------------------------------------------------------------------------------
  // As abas
  // ---------------------------------------------------------------------------------------------------

  /** Abre o arquivo numa aba (a prévia, em itálico, é trocada pelo próximo clique simples). */
  async abrirArquivo(slug: string, op: { previa: boolean; focar: boolean; linha?: number; col?: number; selecionar?: number; historico?: boolean }) {
    await this.pronto;
    const arquivo = this.arquivos.get(slug);
    if (!arquivo) return;
    let aba = this.abas.find((a) => a.slug === slug);
    if (aba) {
      if (!op.previa) aba.previa = false;
    } else {
      const vista = this.criarVista(arquivo);
      aba = { slug, previa: op.previa, vista };
      const previa = this.abas.findIndex((a) => a.previa);
      if (op.previa && previa >= 0) {
        // A prévia é trocada no mesmo lugar.
        const velha = this.abas[previa];
        velha.vista.el.remove();
        this.abas[previa] = aba;
        this.recentes = this.recentes.filter((r) => r !== velha.slug);
      } else {
        const i = this.ativa ? this.abas.indexOf(this.ativa) + 1 : this.abas.length;
        this.abas.splice(i, 0, aba);
      }
      this.el.area.append(vista.el);
      void this.carregarVista(vista);
    }
    if (op.historico !== false) this.marcarHistorico(slug);
    this.ativar(aba);
    if (op.linha !== undefined) {
      await this.quandoPronta(aba.vista);
      this.irPara(aba.vista, op.linha, op.col ?? 0, { centro: true, selecionar: op.selecionar });
    }
    if (op.focar) {
      await this.quandoPronta(aba.vista);
      if (this.ativa === aba) aba.vista.rolagem.focus({ preventScroll: true });
    }
    if (this.s.estreito.matches) this.mostrarLateralNoCelular(false);
  }

  /** Um texto de fora da árvore (o leia-me e o .zshrc do Terminal), numa aba como os outros. */
  async abrirTexto(a: { nome: string; caminho?: string; texto: string }) {
    await this.pronto;
    const caminho = a.caminho ?? a.nome;
    const slug = `avulso:${caminho}`;
    const pasta = caminho.includes("/") ? caminho.slice(0, caminho.lastIndexOf("/")) : "";
    const arquivo: Arquivo = { slug, nome: a.nome, ext: tipoDoNome(a.nome), titulo: a.nome, caminho: pasta, texto: a.texto, avulso: true };
    this.arquivos.set(slug, arquivo);
    DOCS.delete(slug);
    // Já aberto: o texto pode ter mudado (o histórico do shell cresce), então a aba relê.
    const aberta = this.abas.find((x) => x.slug === slug);
    if (aberta && aberta.vista.arquivo.texto !== a.texto) {
      aberta.vista.arquivo = arquivo;
      void this.carregarVista(aberta.vista);
    }
    await this.abrirArquivo(slug, { previa: false, focar: true });
  }

  /** A pasta de um livro aberta e com o foco no Explorer (o Terminal: "open -a Código livros/dados"). */
  revelarLivro(id: string) {
    const livro = [...this.livroPorPasta.values()].find((l) => l.id === id || l.pasta === id);
    if (!livro) return this.focarAgora();
    this.mostrarVista("explorer", false);
    if (this.s.estreito.matches) this.mostrarLateralNoCelular(true);
    const item = this.el.arvore.querySelector<HTMLElement>(`[data-no="l:${CSS.escape(livro.pasta)}"]`);
    if (!item) return;
    let pai = item.parentElement?.closest<HTMLElement>('[role="treeitem"]');
    while (pai) {
      this.abrirPasta(pai, true);
      pai = pai.parentElement?.closest<HTMLElement>('[role="treeitem"]');
    }
    this.abrirPasta(item, true);
    this.moverFoco(this.el.arvore, item);
  }

  private quandoPronta(v: Vista): Promise<void> {
    if (v.estado !== "carregando") return Promise.resolve();
    return new Promise((r) => {
      const t = setInterval(() => {
        if (v.estado !== "carregando" || !v.el.isConnected) {
          clearInterval(t);
          r();
        }
      }, 30);
    });
  }

  private ativar(aba: Aba | undefined) {
    const antes = this.ativa;
    if (antes && antes !== aba) {
      antes.vista.topo = antes.vista.rolagem.scrollTop;
      antes.vista.esquerda = antes.vista.rolagem.scrollLeft;
      antes.vista.el.hidden = true;
    }
    this.ativa = aba;
    if (aba) {
      this.recentes = [aba.slug, ...this.recentes.filter((r) => r !== aba.slug)];
      aba.vista.el.hidden = false;
      if (antes !== aba && aba.vista.estado === "pronto") {
        aba.vista.rolagem.scrollTop = aba.vista.topo;
        aba.vista.rolagem.scrollLeft = aba.vista.esquerda;
        this.ajustarVista(aba.vista);
      }
    }
    // Primeiro o que aparece e some (as medidas da faixa de abas e da trilha dependem disso).
    this.el.boasvindas.hidden = Boolean(aba);
    this.el.barraAbas.hidden = !this.abas.length;
    this.el.migalhas.hidden = !aba;
    this.el.statusArquivo.hidden = !aba;
    this.desenharAbas();
    this.desenharMigalhas();
    this.desenharTopicos();
    this.atualizarStatus();
    this.selecionarNaArvore(aba?.slug, true);
    const post = aba?.vista.arquivo.post;
    this.el.ler.hidden = !post;
    if (post) this.el.ler.href = post.url;
    this.raiz.querySelector<HTMLElement>('[data-acao="previa"]')!.hidden = !post;
    const titulo = aba ? `${aba.vista.arquivo.nome} — blog` : "blog";
    this.janela?.definirTitulo(titulo);
    if (!this.el.localizar.hidden) this.localizar();
    else this.limparAchados();
    this.esconderAviso();
    this.menusMudaram();
  }

  private fecharAba(aba: Aba, focar = false) {
    const i = this.abas.indexOf(aba);
    if (i < 0) return;
    const nasAbas = this.el.abas.contains(document.activeElement);
    const tinhaFoco = nasAbas || aba.vista.el.contains(document.activeElement);
    this.abas.splice(i, 1);
    aba.vista.el.remove();
    this.recentes = this.recentes.filter((r) => r !== aba.slug);
    if (this.ativa === aba) {
      this.ativa = undefined;
      // Como o VS Code: volta para o usado por último.
      const proxima = this.recentes.map((r) => this.abas.find((a) => a.slug === r)).find(Boolean) ?? this.abas[Math.min(i, this.abas.length - 1)];
      this.ativar(proxima);
    } else this.desenharAbas();
    if (focar || tinhaFoco) {
      if (this.ativa && nasAbas) this.el.abas.querySelector<HTMLElement>('[aria-selected="true"]')?.focus();
      else if (this.ativa) this.ativa.vista.rolagem.focus({ preventScroll: true });
      else this.focarArvore();
    }
  }

  private fecharTodas() {
    for (const a of [...this.abas]) a.vista.el.remove();
    this.abas = [];
    this.recentes = [];
    this.ativar(undefined);
    this.focarArvore();
  }

  private desenharAbas() {
    const ativa = this.ativa;
    this.el.abas.innerHTML = this.abas
      .map((a) => {
        const sel = a === ativa;
        const n = a.vista.arquivo;
        return (
          `<div class="ed-aba${sel ? " ativa" : ""}${a.previa ? " previa" : ""}" role="tab" id="ed${this.id}-aba-${escapar(a.slug)}" aria-selected="${sel}" aria-controls="ed${this.id}-area" tabindex="${sel ? 0 : -1}" data-aba="${escapar(a.slug)}" title="${escapar(n.caminho ? `${n.caminho}/${n.nome}` : n.nome)}${a.previa ? " (prévia)" : ""}">` +
          `${iconeDo(n.ext)}<span class="ed-aba-nome">${escapar(n.nome)}</span>` +
          `<button type="button" class="ed-aba-fechar" tabindex="-1" data-fechar="${escapar(a.slug)}" aria-label="Fechar ${escapar(n.nome)}" title="Fechar">${ICONE.fechar}</button></div>`
        );
      })
      .join("");
    if (ativa) this.el.area.setAttribute("aria-labelledby", `ed${this.id}-aba-${ativa.slug}`);
    else this.el.area.removeAttribute("aria-labelledby");
    const el = this.el.abas.querySelector<HTMLElement>(".ed-aba.ativa");
    if (el) {
      const a = this.el.abas;
      if (el.offsetLeft < a.scrollLeft || el.offsetWidth >= a.clientWidth) a.scrollLeft = el.offsetLeft;
      else if (el.offsetLeft + el.offsetWidth > a.scrollLeft + a.clientWidth) a.scrollLeft = el.offsetLeft + el.offsetWidth - a.clientWidth;
    }
  }

  /** Arrastar uma aba muda a ordem (os vizinhos abrem espaço; ao soltar, ela fica no lugar). */
  private arrastarAba(aba: HTMLElement, e: PointerEvent) {
    const x0 = e.clientX;
    const y0 = e.clientY;
    let arrastando = false;
    const todas = () => [...this.el.abas.querySelectorAll<HTMLElement>(".ed-aba")];
    let caixas: DOMRect[] = [];
    let de = 0;
    let para = 0;
    const mover = (ev: PointerEvent) => {
      const dx = ev.clientX - x0;
      if (!arrastando) {
        if (Math.hypot(dx, ev.clientY - y0) < 6 || this.abas.length < 2) return;
        arrastando = true;
        capturar(aba, e.pointerId);
        caixas = todas().map((t) => t.getBoundingClientRect());
        de = todas().indexOf(aba);
        para = de;
        aba.classList.add("arrastada");
        this.el.abas.classList.add("arrastando");
      }
      const meio = caixas[de].left + caixas[de].width / 2 + dx;
      para = caixas.findIndex((c) => meio < c.left + c.width / 2);
      if (para < 0) para = caixas.length - 1;
      const w = caixas[de].width;
      todas().forEach((t, k) => {
        if (t === aba) t.style.transform = `translateX(${dx}px)`;
        else if (k > de && k <= para) t.style.transform = `translateX(${-w}px)`;
        else if (k < de && k >= para) t.style.transform = `translateX(${w}px)`;
        else t.style.transform = "";
      });
    };
    const soltar = () => {
      aba.removeEventListener("pointermove", mover);
      aba.removeEventListener("pointerup", soltar);
      aba.removeEventListener("pointercancel", soltar);
      if (!arrastando) return;
      for (const t of todas()) t.style.transform = "";
      this.el.abas.classList.remove("arrastando");
      const [mov] = this.abas.splice(de, 1);
      this.abas.splice(para, 0, mov);
      this.desenharAbas();
      this.ignorarClique = true;
      setTimeout(() => (this.ignorarClique = false), 0);
    };
    aba.addEventListener("pointermove", mover);
    aba.addEventListener("pointerup", soltar);
    aba.addEventListener("pointercancel", soltar);
  }

  private ignorarClique = false;
  /** O último HTML de cada peça que se refaz a cada movimento do cursor (para não refazer à toa). */
  private html = { migalhas: "" };

  // ---------------------------------------------------------------------------------------------------
  // A vista do arquivo (o editor de verdade)
  // ---------------------------------------------------------------------------------------------------

  private criarVista(arquivo: Arquivo): Vista {
    const el = document.createElement("div");
    el.className = "ed-vista-arquivo";
    el.hidden = true;
    el.innerHTML =
      `<div class="ed-rolagem" tabindex="0" role="region" aria-label="${escapar(arquivo.nome)}, somente leitura" aria-roledescription="editor">` +
      '<div class="ed-folha"><div class="ed-calha" aria-hidden="true"><div class="ed-calha-numeros"></div><div class="ed-numero-ativo"></div></div>' +
      '<div class="ed-codigo"><div class="ed-linha-atual" aria-hidden="true"></div><div class="ed-linhas"></div><div class="ed-cursor" aria-hidden="true"></div></div></div></div>' +
      '<div class="ed-mapa" aria-hidden="true"><canvas></canvas><div class="ed-mapa-deslizador"></div></div>' +
      '<div class="ed-sombra" aria-hidden="true"></div>';
    const q = (sel: string) => el.querySelector<HTMLElement>(sel)!;
    return {
      arquivo,
      el,
      rolagem: q(".ed-rolagem"),
      folha: q(".ed-folha"),
      calha: q(".ed-calha-numeros"),
      codigo: q(".ed-linhas"),
      numero: q(".ed-numero-ativo"),
      cursor: q(".ed-cursor"),
      mapa: q(".ed-mapa"),
      canvas: el.querySelector("canvas")!,
      deslizador: q(".ed-mapa-deslizador"),
      estado: "carregando",
      linha: 0,
      col: 0,
      colDesejada: 0,
      topo: 0,
      esquerda: 0,
      mapaDesenhado: "",
      maiorLinha: 0,
      linhasEl: [],
    };
  }

  private async carregarVista(v: Vista) {
    v.estado = "carregando";
    const progresso = window.setTimeout(() => {
      if (this.ativa?.vista === v && v.estado === "carregando") this.el.progresso.hidden = false;
    }, 120);
    let texto: string;
    try {
      texto = v.arquivo.texto ?? (await textoDoPost(v.arquivo.slug));
      await Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, 400))]);
    } catch {
      clearTimeout(progresso);
      this.el.progresso.hidden = true;
      v.estado = "erro";
      v.codigo.innerHTML = `<div class="ed-erro">Não deu para abrir ${escapar(v.arquivo.nome)}. <button type="button" class="ed-link" data-acao="tentar-de-novo">Tentar de novo</button></div>`;
      return;
    }
    clearTimeout(progresso);
    this.el.progresso.hidden = true;
    if (!v.el.isConnected) return;
    // O clique, o realce e a montagem em tarefas curtas separadas, no lugar de uma longa: o navegador
    // pinta a aba nova e respira entre uma e outra.
    const respirar = () => new Promise((r) => setTimeout(r, 0));
    let doc = DOCS.get(v.arquivo.slug);
    if (!doc) {
      await respirar();
      if (!v.el.isConnected) return;
      doc = realcar(texto.normalize("NFC"), v.arquivo.ext);
      DOCS.set(v.arquivo.slug, doc);
    }
    await respirar();
    if (!v.el.isConnected) return;
    v.doc = doc;
    v.maiorLinha = doc.linhas.reduce((m, l) => Math.max(m, l.includes("\t") ? l.replace(/\t/g, "    ").length : l.length), 0);
    // Tudo de uma vez: uma string para as linhas, outra para os números.
    v.codigo.innerHTML = doc.html;
    v.linhasEl = Array.from(v.codigo.querySelectorAll<HTMLElement>(".l"));
    // A largura vem da linha mais longa (em caracteres): sem medir o arquivo inteiro.
    v.folha.style.setProperty("--colunas", String(v.maiorLinha));
    let numeros = "";
    for (let n = 1; n <= doc.linhas.length; n++) numeros += `${n}\n`;
    v.calha.textContent = numeros;
    v.folha.style.setProperty("--digitos", String(Math.max(3, String(doc.linhas.length).length)));
    v.estado = "pronto";
    v.el.classList.toggle("quebra", this.quebra);
    if (this.ativa?.vista === v) {
      this.ajustarVista(v, false);
      // O minimapa depois do primeiro quadro do texto.
      requestAnimationFrame(() => setTimeout(() => this.ativa?.vista === v && this.desenharMapa(v), 0));
      this.desenharMigalhas();
      this.desenharTopicos();
      this.atualizarStatus();
      if (!this.el.localizar.hidden) this.localizar();
    }
  }

  /** O que depende do tamanho: a medida do caractere, o cursor e o minimapa. */
  private ajustarVista(v: Vista, mapa = true) {
    if (v.estado !== "pronto" || v.el.hidden) return;
    const amostra = document.createElement("span");
    amostra.className = "ed-amostra";
    amostra.textContent = "0".repeat(50);
    v.codigo.append(amostra);
    this.larguraCaractere = amostra.getBoundingClientRect().width / 50 || this.larguraCaractere;
    amostra.remove();
    this.posicionarCursor(v, false);
    if (mapa) this.desenharMapa(v);
    else v.el.classList.toggle("sem-mapa", !this.minimapaVisivel());
  }

  /** O topo da linha dentro do arquivo: a conta direta sem quebra (20px cada), a medida com quebra. */
  private topoDaLinha(v: Vista, n: number, quebra = this.quebra): number {
    if (!quebra) return n * LINHA;
    const el = this.linhaEl(v, n);
    return el ? el.getBoundingClientRect().top - v.codigo.getBoundingClientRect().top : n * LINHA;
  }

  private linhaEl(v: Vista, n: number): HTMLElement | undefined {
    return v.linhasEl[n];
  }

  /** O ponto (nó de texto e deslocamento) da coluna `col` na linha `n`. */
  private pontoDe(v: Vista, n: number, col: number): { no: Node; off: number } | undefined {
    const linha = this.linhaEl(v, n);
    if (!linha) return;
    const andar = document.createTreeWalker(linha, NodeFilter.SHOW_TEXT);
    let resto = col;
    let ultimo: Text | null = null;
    for (let t = andar.nextNode() as Text | null; t; t = andar.nextNode() as Text | null) {
      if (resto <= t.length) return { no: t, off: resto };
      resto -= t.length;
      ultimo = t;
    }
    return ultimo ? { no: ultimo, off: ultimo.length } : { no: linha, off: 0 };
  }

  /** A linha e a coluna de um ponto do DOM (o clique, a seleção). */
  private colunaDe(v: Vista, no: Node, off: number): { linha: number; col: number } | undefined {
    const el = no.nodeType === Node.ELEMENT_NODE ? (no as Element) : no.parentElement;
    const linha = el?.closest(".l");
    if (!linha || !v.codigo.contains(linha)) return;
    const n = v.linhasEl.indexOf(linha as HTMLElement);
    if (n < 0) return;
    if (no === linha) {
      let col = 0;
      for (let k = 0; k < off; k++) col += linha.childNodes[k]?.textContent?.length ?? 0;
      return { linha: n, col };
    }
    const r = document.createRange();
    r.setStart(linha, 0);
    r.setEnd(no, off);
    return { linha: n, col: r.toString().length };
  }

  private posicionarCursor(v: Vista, rolar: boolean) {
    const doc = v.doc;
    if (!doc) return;
    v.linha = Math.max(0, Math.min(doc.linhas.length - 1, v.linha));
    v.col = Math.max(0, Math.min(doc.linhas[v.linha].length, v.col));
    const linha = this.linhaEl(v, v.linha);
    if (!linha) return;
    const topo = this.topoDaLinha(v, v.linha);
    let x = 0;
    let y = topo;
    if (this.quebra || /[\t\u{1F000}-\u{1FFFF}]/u.test(doc.linhas[v.linha])) {
      const p = this.pontoDe(v, v.linha, v.col);
      if (p && p.no.nodeType === Node.TEXT_NODE) {
        const r = document.createRange();
        r.setStart(p.no, p.off);
        r.collapse(true);
        const caixa = r.getClientRects()[0] ?? r.getBoundingClientRect();
        const base = v.codigo.getBoundingClientRect();
        if (caixa && (caixa.width || caixa.height || caixa.left)) {
          x = caixa.left - base.left;
          y = caixa.top - base.top;
        }
      }
    } else x = v.col * this.larguraCaractere;
    v.cursor.style.transform = `translate(${x.toFixed(1)}px, ${y}px)`;
    const altura = this.quebra ? linha.getBoundingClientRect().height : LINHA;
    const realce = v.el.querySelector<HTMLElement>(".ed-linha-atual")!;
    realce.style.transform = `translateY(${topo}px)`;
    realce.style.height = `${altura}px`;
    if (v.linhaMarcada !== linha) {
      v.linhaMarcada?.classList.remove("atual");
      linha.classList.add("atual");
      v.linhaMarcada = linha;
    }
    v.numero.textContent = String(v.linha + 1);
    v.numero.style.transform = `translateY(${topo}px)`;
    // O cursor pisca de novo a cada movimento.
    v.cursor.classList.remove("pisca");
    void v.cursor.offsetWidth;
    v.cursor.classList.add("pisca");
    if (rolar) {
      const r = v.rolagem;
      const calha = (v.el.querySelector(".ed-calha") as HTMLElement).offsetWidth;
      const visivelAlto = r.clientHeight;
      if (topo < r.scrollTop) r.scrollTop = topo;
      else if (topo + altura > r.scrollTop + visivelAlto) r.scrollTop = topo + altura - visivelAlto;
      const mapa = this.minimapaVisivel() ? v.mapa.offsetWidth : 0;
      const largura = r.clientWidth - calha - mapa;
      if (x < r.scrollLeft + 4) r.scrollLeft = Math.max(0, x - 40);
      else if (x > r.scrollLeft + largura - 24) r.scrollLeft = x - largura + 60;
    }
    if (this.ativa?.vista === v) {
      this.atualizarStatus();
      this.desenharMigalhas();
      this.marcarTopicoAtual();
    }
  }

  /** Vai até a linha e a coluna (o cursor, a rolagem e, se pedir, a seleção de `selecionar` caracteres). */
  private irPara(v: Vista, linha: number, col: number, op: { centro?: boolean; selecionar?: number } = {}) {
    if (!v.doc) return;
    v.linha = linha;
    v.col = col;
    v.colDesejada = col;
    v.ancora = undefined;
    if (op.centro) v.rolagem.scrollTop = Math.max(0, this.topoDaLinha(v, Math.max(0, Math.min(v.doc.linhas.length - 1, linha))) - v.rolagem.clientHeight / 2 + LINHA);
    if (op.selecionar) {
      const a = this.pontoDe(v, linha, col);
      const b = this.pontoDe(v, linha, col + op.selecionar);
      if (a && b) getSelection()?.setBaseAndExtent(a.no, a.off, b.no, b.off);
      v.col = col + op.selecionar;
    } else getSelection()?.removeAllRanges();
    this.posicionarCursor(v, true);
  }

  /** O cursor pelo teclado (as setas, Home, End, Page Up e Down; com ⇧, a seleção). */
  private teclaNoEditor(v: Vista, e: KeyboardEvent): boolean {
    const doc = v.doc;
    if (!doc) return false;
    const mod = e.metaKey || (!MAC && e.ctrlKey);
    const total = doc.linhas.length;
    const pagina = Math.max(1, Math.floor(v.rolagem.clientHeight / LINHA) - 1);
    let { linha, col } = v;
    let vertical = false;
    switch (e.key) {
      case "ArrowLeft":
        if (mod) col = (doc.linhas[linha].match(/^\s*/)?.[0].length ?? 0) === col ? 0 : (doc.linhas[linha].match(/^\s*/)?.[0].length ?? 0);
        else if (e.altKey) col = this.palavra(doc.linhas[linha], col, -1);
        else if (col > 0) col--;
        else if (linha > 0) {
          linha--;
          col = doc.linhas[linha].length;
        }
        break;
      case "ArrowRight":
        if (mod) col = doc.linhas[linha].length;
        else if (e.altKey) col = this.palavra(doc.linhas[linha], col, 1);
        else if (col < doc.linhas[linha].length) col++;
        else if (linha < total - 1) {
          linha++;
          col = 0;
        }
        break;
      case "ArrowUp":
        if (mod) {
          linha = 0;
          col = 0;
        } else {
          linha = Math.max(0, linha - 1);
          vertical = true;
        }
        break;
      case "ArrowDown":
        if (mod) {
          linha = total - 1;
          col = doc.linhas[linha].length;
        } else {
          linha = Math.min(total - 1, linha + 1);
          vertical = true;
        }
        break;
      case "Home":
        if (mod) linha = 0;
        col = 0;
        break;
      case "End":
        if (mod) linha = total - 1;
        col = doc.linhas[linha].length;
        break;
      case "PageUp":
        linha = Math.max(0, linha - pagina);
        v.rolagem.scrollTop -= pagina * LINHA;
        vertical = true;
        break;
      case "PageDown":
        linha = Math.min(total - 1, linha + pagina);
        v.rolagem.scrollTop += pagina * LINHA;
        vertical = true;
        break;
      default:
        return false;
    }
    if (vertical) col = Math.min(v.colDesejada, doc.linhas[linha].length);
    else v.colDesejada = col;
    if (e.shiftKey) {
      v.ancora ??= { linha: v.linha, col: v.col };
      v.linha = linha;
      v.col = col;
      const a = this.pontoDe(v, v.ancora.linha, v.ancora.col);
      const b = this.pontoDe(v, linha, col);
      if (a && b) getSelection()?.setBaseAndExtent(a.no, a.off, b.no, b.off);
    } else {
      v.ancora = undefined;
      v.linha = linha;
      v.col = col;
      if (!getSelection()?.isCollapsed) getSelection()?.removeAllRanges();
    }
    this.posicionarCursor(v, true);
    return true;
  }

  private palavra(t: string, col: number, dir: number): number {
    let i = col;
    if (dir < 0) {
      while (i > 0 && /\s/.test(t[i - 1])) i--;
      while (i > 0 && /[\p{L}\d_]/u.test(t[i - 1])) i--;
      if (i === col && i > 0) i--;
    } else {
      while (i < t.length && /\s/.test(t[i])) i++;
      while (i < t.length && /[\p{L}\d_]/u.test(t[i])) i++;
      if (i === col && i < t.length) i++;
    }
    return i;
  }

  // ---------------------------------------------------------------------------------------------------
  // O minimapa: o arquivo em barrinhas, desenhado uma vez (e de novo só quando o tema muda)
  // ---------------------------------------------------------------------------------------------------

  private minimapaVisivel() {
    return this.minimapa && !this.s.estreito.matches && this.el.area.clientWidth >= 560;
  }

  private desenharMapa(v: Vista) {
    const mostrar = this.minimapaVisivel();
    v.el.classList.toggle("sem-mapa", !mostrar);
    if (!mostrar || !v.doc) return;
    const tema = document.documentElement.dataset.theme === "dark" ? "escuro" : "claro";
    const dpr = Math.min(2, devicePixelRatio || 1);
    const largura = v.mapa.clientWidth;
    const chave = `${tema}:${dpr}:${largura}`;
    if (v.mapaDesenhado !== chave) {
      v.mapaDesenhado = chave;
      const linhas = v.doc.segs;
      const altura = linhas.length * 2;
      const cv = v.canvas;
      cv.width = Math.round(largura * dpr);
      cv.height = Math.round(altura * dpr);
      cv.style.width = `${largura}px`;
      cv.style.height = `${altura}px`;
      const ctx = cv.getContext("2d");
      if (ctx) {
        const estilo = getComputedStyle(v.el);
        const cores = CORES_DO_MAPA.map((nome) => estilo.getPropertyValue(nome).trim() || estilo.color);
        const colunas = Math.floor(largura - 6);
        const alto = Math.max(1, Math.round(1.4 * dpr));
        ctx.clearRect(0, 0, cv.width, cv.height);
        for (let n = 0; n < linhas.length; n++) {
          let col = 0;
          const y = Math.round(n * 2 * dpr);
          for (const [t, c] of linhas[n]) {
            ctx.fillStyle = cores[c];
            ctx.globalAlpha = c === TX || c === PO ? 0.32 : 0.62;
            let ini = -1;
            for (let k = 0; k <= t.length && col + k <= colunas; k++) {
              const branco = k === t.length || t[k] === " " || t[k] === "\t";
              if (!branco && ini < 0) ini = k;
              else if (branco && ini >= 0) {
                ctx.fillRect(Math.round((col + ini) * dpr), y, Math.max(1, Math.round((k - ini) * dpr)), alto);
                ini = -1;
              }
            }
            col += t.length;
            if (col > colunas) break;
          }
        }
        ctx.globalAlpha = 1;
      }
    }
    this.acompanharMapa(v);
  }

  /** A rolagem do editor move o minimapa e o deslizador (só transform). */
  private acompanharMapa(v: Vista) {
    const r = v.rolagem;
    const total = (v.doc?.linhas.length ?? 0) * 2;
    const alto = v.mapa.clientHeight;
    const max = Math.max(1, r.scrollHeight - r.clientHeight);
    const p = Math.min(1, r.scrollTop / max);
    const desloca = total > alto ? p * (total - alto) : 0;
    const escala = this.quebra ? total / Math.max(1, r.scrollHeight) : 2 / LINHA;
    const h = Math.max(8, r.clientHeight * escala);
    const topo = this.quebra || total > alto ? p * (Math.min(alto, total) - h) : r.scrollTop * escala;
    v.canvas.style.transform = `translateY(${-desloca}px)`;
    v.deslizador.style.height = `${h}px`;
    v.deslizador.style.transform = `translateY(${Math.max(0, topo)}px)`;
    v.el.classList.toggle("rolado", r.scrollTop > 0);
  }

  private ligarMapa(v: Vista) {
    const mapa = v.mapa;
    mapa.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      const r = v.rolagem;
      const caixa = mapa.getBoundingClientRect();
      const desl = v.deslizador.getBoundingClientRect();
      const noDeslizador = e.clientY >= desl.top && e.clientY <= desl.bottom;
      if (!noDeslizador) {
        // O clique fora do deslizador leva até ali (o ponto fica no meio do editor).
        const total = (v.doc?.linhas.length ?? 0) * 2;
        const alto = mapa.clientHeight;
        const max = Math.max(1, r.scrollHeight - r.clientHeight);
        const desloca = total > alto ? (r.scrollTop / max) * (total - alto) : 0;
        const linha = (e.clientY - caixa.top + desloca) / 2;
        r.scrollTop = this.quebra ? (linha / Math.max(1, total / 2)) * r.scrollHeight - r.clientHeight / 2 : linha * LINHA - r.clientHeight / 2;
      }
      capturar(mapa, e.pointerId);
      mapa.classList.add("ativo");
      const y0 = e.clientY;
      const topo0 = r.scrollTop;
      const fator = (r.scrollHeight - r.clientHeight) / Math.max(1, Math.min(mapa.clientHeight, (v.doc?.linhas.length ?? 0) * 2) - v.deslizador.offsetHeight);
      const mover = (ev: PointerEvent) => (r.scrollTop = topo0 + (ev.clientY - y0) * fator);
      const soltar = () => {
        mapa.classList.remove("ativo");
        mapa.removeEventListener("pointermove", mover);
        mapa.removeEventListener("pointerup", soltar);
        mapa.removeEventListener("pointercancel", soltar);
      };
      mapa.addEventListener("pointermove", mover);
      mapa.addEventListener("pointerup", soltar);
      mapa.addEventListener("pointercancel", soltar);
    });
  }

  // ---------------------------------------------------------------------------------------------------
  // A trilha (migalhas), a Estrutura de tópicos e a barra de status
  // ---------------------------------------------------------------------------------------------------

  /** Os títulos em volta do cursor (do mais alto ao mais fundo). */
  private titulosDoCursor(v: Vista): Titulo[] {
    const cadeia: Titulo[] = [];
    for (const t of v.doc?.titulos ?? []) {
      if (t.linha > v.linha) break;
      while (cadeia.length && cadeia[cadeia.length - 1].nivel >= t.nivel) cadeia.pop();
      cadeia.push(t);
    }
    return cadeia;
  }

  private desenharMigalhas() {
    const v = this.ativa?.vista;
    if (!v) {
      this.el.migalhas.innerHTML = "";
      this.html.migalhas = "";
      return;
    }
    const a = v.arquivo;
    const sep = `<span class="ed-migalha-sep" aria-hidden="true">${ICONE.seta}</span>`;
    const botao = (attrs: string, conteudo: string) => `<button type="button" class="ed-migalha" tabindex="-1" ${attrs}>${conteudo}</button>`;
    const caminho = a.avulso
      ? [...a.caminho.split("/").filter(Boolean).map((p) => `<span class="ed-migalha">${escapar(p)}</span>`), `<span class="ed-migalha">${iconeDo(a.ext)}${escapar(a.nome)}</span>`]
      : [
          botao(`data-revelar="${a.grupo ? `g:${a.grupo}` : `a:${LEIA_ME}`}"`, "blog"),
          ...(a.grupo && a.livro ? [botao(`data-revelar="g:${a.grupo}"`, a.grupo), botao(`data-revelar="l:${escapar(a.livro.pasta)}"`, escapar(a.livro.pasta))] : []),
          botao(`data-revelar="a:${escapar(a.slug)}"`, `${iconeDo(a.ext)}${escapar(a.nome)}`),
        ];
    const partes = [...caminho, ...this.titulosDoCursor(v).map((t) => botao(`data-titulo="${t.linha}"`, `${ICONE.titulo}${escapar(t.texto)}`))];
    const html = partes.join(sep);
    if (this.html.migalhas === html) return;
    this.html.migalhas = html;
    this.el.migalhas.innerHTML = html;
    // Como no VS Code, o fim da trilha (o arquivo e o título) fica à vista quando ela não cabe.
    this.el.migalhas.scrollLeft = this.el.migalhas.scrollWidth;
  }

  private desenharTopicos() {
    const v = this.ativa?.vista;
    const titulos = v?.doc?.titulos ?? [];
    const base = titulos.length ? Math.min(...titulos.map((t) => t.nivel)) : 1;
    this.el.topicos.innerHTML = !v
      ? '<p class="ed-vazio-lateral">Nenhum editor aberto com a estrutura de tópicos.</p>'
      : !titulos.length
        ? `<p class="ed-vazio-lateral">${v.estado === "carregando" ? "Lendo o arquivo…" : "O arquivo não tem títulos."}</p>`
        : titulos
            .map(
              (t, k) =>
                `<div role="treeitem" class="ed-no ed-topico" tabindex="${k === 0 ? 0 : -1}" aria-level="${t.nivel - base + 1}" aria-selected="false" data-no="t:${t.linha}">` +
                `<div class="ed-no-linha" style="--nivel:${t.nivel - base}">${ICONE.titulo}<span class="ed-no-nome">${escapar(t.texto)}</span></div></div>`,
            )
            .join("");
    this.marcarTopicoAtual();
  }

  private marcarTopicoAtual() {
    const v = this.ativa?.vista;
    if (!v || this.el.secaoTopicos.querySelector(".ed-secao-corpo")?.hasAttribute("hidden")) return;
    const atual = this.titulosDoCursor(v).at(-1);
    for (const i of this.el.topicos.querySelectorAll<HTMLElement>('[aria-selected="true"]')) i.setAttribute("aria-selected", "false");
    if (!atual) return;
    const item = this.el.topicos.querySelector<HTMLElement>(`[data-no="t:${atual.linha}"]`);
    item?.setAttribute("aria-selected", "true");
    if (item && !this.el.topicos.contains(document.activeElement)) item.querySelector(".ed-no-linha")?.scrollIntoView({ block: "nearest" });
  }

  private atualizarStatus() {
    const v = this.ativa?.vista;
    if (!v) return;
    const sel = getSelection();
    let extra = "";
    if (sel && !sel.isCollapsed && v.codigo.contains(sel.anchorNode)) {
      const n = sel.toString().length;
      if (n) extra = ` (${n} ${n === 1 ? "selecionado" : "selecionados"})`;
    }
    this.el.pos.textContent = `Ln ${v.linha + 1}, Col ${v.col + 1}${extra}`;
    this.el.lingua.textContent = NOME_DA_LINGUA[v.arquivo.ext];
  }

  // ---------------------------------------------------------------------------------------------------
  // Localizar (⌘F), com o realce das ocorrências pela Custom Highlight API
  // ---------------------------------------------------------------------------------------------------

  private achados: { linha: number; col: number; tam: number }[] = [];
  private achadoAtual = -1;
  private opcoes = { caixa: false, palavra: false, regex: false };

  private abrirLocalizar() {
    const v = this.ativa?.vista;
    if (!v) return;
    const sel = getSelection()?.toString() ?? "";
    if (sel && !sel.includes("\n") && v.codigo.contains(getSelection()?.anchorNode ?? null)) this.el.entradaLocalizar.value = sel;
    this.el.localizar.hidden = false;
    this.el.entradaLocalizar.focus();
    this.el.entradaLocalizar.select();
    this.localizar();
  }

  private fecharLocalizar() {
    this.el.localizar.hidden = true;
    this.limparAchados();
    this.ativa?.vista.rolagem.focus({ preventScroll: true });
  }

  private limparAchados() {
    this.achados = [];
    this.achadoAtual = -1;
    const h = (CSS as unknown as { highlights?: Map<string, unknown> }).highlights;
    h?.delete("ed-achado");
    h?.delete("ed-achado-atual");
  }

  private expressao(consulta: string): RegExp | null {
    if (!consulta) return null;
    const flags = this.opcoes.caixa ? "g" : "gi";
    let fonte = this.opcoes.regex ? consulta : consulta.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (this.opcoes.palavra) fonte = `(?<![\\p{L}\\d_])(?:${fonte})(?![\\p{L}\\d_])`;
    try {
      return new RegExp(fonte, flags + "u");
    } catch {
      return null;
    }
  }

  private localizar(manterPosicao = false) {
    const v = this.ativa?.vista;
    this.limparAchados();
    const q = this.el.entradaLocalizar.value;
    const re = this.expressao(q);
    this.el.entradaLocalizar.parentElement!.classList.toggle("ed-entrada--erro", Boolean(q) && !re);
    if (!v?.doc || !re) {
      this.el.contagem.textContent = q && !re ? "Expressão inválida" : "Sem resultados";
      this.el.contagem.classList.toggle("vazio", Boolean(q));
      return;
    }
    // Sem diferenciar acento: a busca roda no texto sem acento (as posições não mudam no NFC).
    const semAcento = !this.opcoes.regex;
    const reNormal = semAcento ? this.expressao(normal(q)) : re;
    for (let n = 0; n < v.doc.linhas.length && this.achados.length < 5000; n++) {
      const t = semAcento ? (this.opcoes.caixa ? v.doc.linhas[n].normalize("NFD").replace(/\p{M}/gu, "") : normal(v.doc.linhas[n])) : v.doc.linhas[n];
      if (t.length !== v.doc.linhas[n].length) continue;
      const er = reNormal ?? re;
      er.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = er.exec(t))) {
        if (!m[0].length) {
          er.lastIndex++;
          continue;
        }
        this.achados.push({ linha: n, col: m.index, tam: m[0].length });
      }
    }
    if (!this.achados.length) {
      this.el.contagem.textContent = "Sem resultados";
      this.el.contagem.classList.toggle("vazio", Boolean(q));
      return;
    }
    this.el.contagem.classList.remove("vazio");
    // A ocorrência mais perto do cursor.
    let i = this.achados.findIndex((a) => a.linha > v.linha || (a.linha === v.linha && a.col >= (manterPosicao ? v.col : v.col - q.length)));
    if (i < 0) i = 0;
    this.realcarAchados(v);
    this.irAoAchado(i);
  }

  private realcarAchados(v: Vista) {
    const H = (globalThis as unknown as { Highlight?: new (...r: Range[]) => unknown }).Highlight;
    const mapa = (CSS as unknown as { highlights?: Map<string, unknown> }).highlights;
    if (!H || !mapa) return;
    const faixas: Range[] = [];
    for (const a of this.achados.slice(0, 2000)) {
      const ini = this.pontoDe(v, a.linha, a.col);
      const fim = this.pontoDe(v, a.linha, a.col + a.tam);
      if (!ini || !fim) continue;
      const r = new Range();
      r.setStart(ini.no, ini.off);
      r.setEnd(fim.no, fim.off);
      faixas.push(r);
    }
    mapa.set("ed-achado", new H(...faixas));
  }

  private irAoAchado(i: number) {
    const v = this.ativa?.vista;
    if (!v || !this.achados.length) return;
    this.achadoAtual = (i + this.achados.length) % this.achados.length;
    const a = this.achados[this.achadoAtual];
    this.el.contagem.textContent = `${this.achadoAtual + 1} de ${this.achados.length}${this.achados.length >= 5000 ? "+" : ""}`;
    const H = (globalThis as unknown as { Highlight?: new (...r: Range[]) => unknown }).Highlight;
    const mapa = (CSS as unknown as { highlights?: Map<string, unknown> }).highlights;
    const ini = this.pontoDe(v, a.linha, a.col);
    const fim = this.pontoDe(v, a.linha, a.col + a.tam);
    if (H && mapa && ini && fim) {
      const r = new Range();
      r.setStart(ini.no, ini.off);
      r.setEnd(fim.no, fim.off);
      mapa.set("ed-achado-atual", new H(r));
    }
    v.linha = a.linha;
    v.col = a.col + a.tam;
    v.colDesejada = v.col;
    const topo = this.topoDaLinha(v, a.linha);
    if (topo < v.rolagem.scrollTop + LINHA * 2 || topo > v.rolagem.scrollTop + v.rolagem.clientHeight - LINHA * 2) {
      v.rolagem.scrollTop = topo - v.rolagem.clientHeight / 2;
    }
    this.posicionarCursor(v, true);
  }

  // ---------------------------------------------------------------------------------------------------
  // Pesquisar (a barra de atividades): o nome, o título e o texto dos arquivos
  // ---------------------------------------------------------------------------------------------------

  private textos?: Promise<Map<string, TextoDaBusca>>;
  private esperaBusca = 0;
  private buscaFeita = "";

  /** O texto de todos os arquivos (baixado na primeira pesquisa), já sem acento e sem caixa, uma vez só. */
  private carregarTextos(): Promise<Map<string, TextoDaBusca>> {
    this.textos ??= Promise.all(
      [...this.arquivos.values()].map(async (a) => {
        const texto = (a.texto ?? (await textoDoPost(a.slug))).normalize("NFC").replace(/\r\n?/g, "\n");
        const linhas = texto.split("\n");
        const inicios: number[] = [];
        let pos = 0;
        for (const l of linhas) {
          inicios.push(pos);
          pos += l.length + 1;
        }
        const n = normal(texto);
        return [a.slug, { linhas, inicios, normal: n.length === texto.length ? n : null }] as const;
      }),
    ).then((pares) => new Map(pares));
    this.textos.catch(() => (this.textos = undefined));
    return this.textos;
  }

  private agendarBusca() {
    clearTimeout(this.esperaBusca);
    this.esperaBusca = window.setTimeout(() => void this.pesquisar(), 180);
  }

  private async pesquisar() {
    const q = this.el.busca.value.trim();
    if (q === this.buscaFeita) return;
    this.buscaFeita = q;
    const lista = this.el.resultados;
    if (!q) {
      lista.innerHTML = "";
      this.el.resumo.textContent = "";
      this.el.progressoBusca.hidden = true;
      return;
    }
    const nq = normal(q);
    const ordem = [...this.arquivos.values()].sort((a, b) => colar.compare(`${a.caminho}/${a.nome}`, `${b.caminho}/${b.nome}`));
    // Primeiro, na hora, o nome e o título.
    const rapidos = ordem.filter((a) => normal(a.nome).includes(nq) || normal(a.titulo).includes(nq));
    this.desenharResultados(rapidos.map((a) => ({ arquivo: a, linhas: [] })), q, false);
    this.el.progressoBusca.hidden = false;
    let textos: Map<string, TextoDaBusca>;
    try {
      textos = await this.carregarTextos();
    } catch {
      this.el.progressoBusca.hidden = true;
      this.el.resumo.textContent = "Não deu para ler todos os arquivos. Os resultados são só dos nomes e dos títulos.";
      return;
    }
    if (this.buscaFeita !== q) return;
    this.el.progressoBusca.hidden = true;
    const resultado: { arquivo: Arquivo; linhas: { n: number; col: number; t: string }[] }[] = [];
    let total = 0;
    for (const a of ordem) {
      const t = textos.get(a.slug);
      const achadas: { n: number; col: number; t: string }[] = [];
      if (t?.normal) {
        // Uma busca no texto inteiro; a linha de cada achado sai dos inícios (busca binária).
        let k = t.normal.indexOf(nq);
        while (k >= 0 && total < LIMITE_DA_BUSCA) {
          let lo = 0;
          let hi = t.inicios.length - 1;
          while (lo < hi) {
            const meio = (lo + hi + 1) >> 1;
            if (t.inicios[meio] <= k) lo = meio;
            else hi = meio - 1;
          }
          achadas.push({ n: lo, col: k - t.inicios[lo], t: t.linhas[lo] });
          total++;
          k = t.normal.indexOf(nq, k + Math.max(1, nq.length));
        }
      } else if (t) {
        for (let n = 0; n < t.linhas.length && total < LIMITE_DA_BUSCA; n++) {
          const nl = normal(t.linhas[n]);
          let k = nl.indexOf(nq);
          while (k >= 0 && total < LIMITE_DA_BUSCA) {
            achadas.push({ n, col: k, t: t.linhas[n] });
            total++;
            k = nl.indexOf(nq, k + nq.length);
          }
        }
      }
      if (achadas.length || normal(a.nome).includes(nq)) resultado.push({ arquivo: a, linhas: achadas });
    }
    this.desenharResultados(resultado, q, true);
  }

  private desenharResultados(res: { arquivo: Arquivo; linhas: { n: number; col: number; t: string }[] }[], q: string, completo: boolean) {
    const lista = this.el.resultados;
    const total = res.reduce((s, r) => s + r.linhas.length, 0);
    const arquivos = res.length;
    if (completo) {
      this.el.resumo.textContent = !arquivos
        ? "Nenhum resultado encontrado."
        : total >= LIMITE_DA_BUSCA
          ? `Os primeiros ${LIMITE_DA_BUSCA} resultados, em ${arquivos} ${arquivos === 1 ? "arquivo" : "arquivos"}. Refine a pesquisa para ver todos.`
          : total
          ? `${total} ${total === 1 ? "resultado" : "resultados"} em ${arquivos} ${arquivos === 1 ? "arquivo" : "arquivos"}`
          : `${arquivos} ${arquivos === 1 ? "arquivo" : "arquivos"} com esse nome`;
    } else this.el.resumo.textContent = arquivos ? "" : "Pesquisando…";
    const nq = normal(q);
    const trecho = (t: string, col: number) => {
      // Como no VS Code: um pouco antes do achado, cortado com reticências.
      const ini = col > 14 ? col - 9 : 0;
      const corte = t.slice(ini).trimStart();
      const desloca = t.length - ini - corte.length;
      const c = col - ini - desloca;
      const fim = c + q.length;
      return `${ini > 0 ? "…" : ""}${escapar(corte.slice(0, c))}<mark>${escapar(corte.slice(c, fim))}</mark>${escapar(corte.slice(fim, fim + 120))}`;
    };
    let primeiro = true;
    lista.innerHTML = res
      .map(({ arquivo: a, linhas }) => {
        const nomeMarcado = (() => {
          const k = normal(a.nome).indexOf(nq);
          return k < 0 ? escapar(a.nome) : marcar(a.nome, Array.from({ length: nq.length }, (_, j) => k + j));
        })();
        const filhos = linhas
          .map(
            (l, j) =>
              `<div role="treeitem" class="ed-no ed-res" tabindex="-1" aria-level="2" aria-setsize="${linhas.length}" aria-posinset="${j + 1}" aria-selected="false" data-no="r:${escapar(a.slug)}:${l.n}:${l.col}" aria-label="${escapar(`Linha ${l.n + 1}: ${l.t.trim().slice(0, 120)}`)}">` +
              `<div class="ed-no-linha ed-res-linha" style="--nivel:1"><span class="ed-res-texto">${trecho(l.t, l.col)}</span></div></div>`,
          )
          .join("");
        const html =
          `<div role="treeitem" class="ed-no" tabindex="${primeiro ? 0 : -1}" aria-level="1" aria-expanded="true" aria-selected="false" data-no="a:${escapar(a.slug)}" aria-label="${escapar(`${a.nome}, ${a.caminho}, ${linhas.length} ${linhas.length === 1 ? "resultado" : "resultados"}`)}">` +
          `<div class="ed-no-linha" style="--nivel:0">${ICONE.seta}${iconeDo(a.ext)}<span class="ed-no-nome">${nomeMarcado}</span><span class="ed-no-desc">${escapar(a.caminho || "blog")}</span>${linhas.length ? `<span class="ed-selo">${linhas.length}</span>` : ""}</div>` +
          `<div role="group" class="ed-no-filhos" style="--nivel:0">${filhos}</div></div>`;
        primeiro = false;
        return html;
      })
      .join("");
  }

  private abrirResultado(item: HTMLElement, fixar: boolean) {
    const no = item.dataset.no ?? "";
    const r = /^r:(.*):(\d+):(\d+)$/.exec(no);
    if (r) {
      const [, slug, n, col] = r;
      void this.abrirArquivo(slug, { previa: !fixar, focar: fixar, linha: Number(n), col: Number(col), selecionar: this.el.busca.value.trim().length });
    } else if (no.startsWith("a:")) {
      const primeira = item.querySelector<HTMLElement>('[role="group"] [role="treeitem"]');
      if (primeira) this.abrirResultado(primeira, fixar);
      else void this.abrirArquivo(no.slice(2), { previa: !fixar, focar: fixar });
    }
  }

  // ---------------------------------------------------------------------------------------------------
  // O Ir para arquivo (⌘P), com os modos > (comandos), : (linha) e @ (títulos)
  // ---------------------------------------------------------------------------------------------------

  private itensRapidos: ItemRapido[] = [];
  private ativoRapido = 0;
  private focoAntes: HTMLElement | null = null;

  private abrirRapido(prefixo = "") {
    const r = this.el.rapido;
    if (r.hidden) this.focoAntes = document.activeElement as HTMLElement | null;
    this.esconderCartao();
    r.hidden = false;
    this.el.entradaRapido.value = prefixo;
    this.filtrarRapido();
    this.el.entradaRapido.focus();
    const fim = prefixo.length;
    this.el.entradaRapido.setSelectionRange(fim, fim);
  }

  private fecharRapido(devolver = true) {
    if (this.el.rapido.hidden) return;
    this.el.rapido.hidden = true;
    if (devolver && this.focoAntes?.isConnected) this.focoAntes.focus({ preventScroll: true });
    this.focoAntes = null;
  }

  private comandos(): ItemRapido[] {
    const v = this.ativa?.vista;
    const c = (rotulo: string, acao: () => void, atalho?: string): ItemRapido => ({ rotulo, acao, atalho });
    const lista: ItemRapido[] = [
      c("Ir para arquivo…", () => this.abrirRapido(), "⌘P"),
      c("Ver: Mostrar Explorer", () => this.mostrarVista("explorer", true), "⇧⌘E"),
      c("Ver: Mostrar Pesquisar", () => this.mostrarVista("busca", true), "⇧⌘F"),
      c("Ver: Alternar a barra lateral principal", () => this.alternarLateral(), "⌘B"),
      c(`Ver: ${this.minimapa ? "Ocultar" : "Mostrar"} o minimapa`, () => this.alternarMinimapa()),
      c("Ver: Alternar a quebra automática de linha", () => this.alternarQuebra(), "⌥Z"),
      c("Explorer: Recolher as pastas", () => this.recolherPastas()),
      c("Terminal: Criar novo terminal", () => void this.s.abrirApp("terminal")),
    ];
    if (v?.arquivo.post) lista.push(c("Arquivo: Abrir na Pré-Visualização", () => this.abrirNaPrevia()), c("Arquivo: Ler no blog", () => this.lerNoBlog()));
    if (v) {
      lista.unshift(
        c("Ir para a linha/coluna…", () => this.abrirRapido(":"), "⌃G"),
        c("Ir para o símbolo no editor…", () => this.abrirRapido("@"), "⇧⌘O"),
        c("Localizar", () => this.abrirLocalizar(), "⌘F"),
        c("Editor: Fechar o editor", () => this.ativa && this.fecharAba(this.ativa, true)),
        c("Editor: Fechar todos os editores", () => this.fecharTodas()),
      );
    }
    return lista.sort((a, b) => colar.compare(a.rotulo, b.rotulo));
  }

  private filtrarRapido() {
    const valor = this.el.entradaRapido.value;
    const msg = this.el.msgRapido;
    msg.hidden = true;
    let itens: ItemRapido[] = [];
    let placeholder = "Pesquisar arquivos pelo nome (acrescente : para ir para a linha ou @ para ir para o símbolo)";
    const v = this.ativa?.vista;
    if (valor.startsWith(">")) {
      const q = valor.slice(1).trim();
      placeholder = "";
      itens = this.comandos()
        .map((c) => ({ c, pos: casar(c.rotulo, q) }))
        .filter((x): x is { c: ItemRapido; pos: number[] } => Boolean(x.pos))
        .sort((x, y) => nota(y.pos, y.c.rotulo) - nota(x.pos, x.c.rotulo))
        .map(({ c, pos }) => ({ ...c, html: marcar(c.rotulo, pos) }));
      if (!itens.length) {
        msg.hidden = false;
        msg.textContent = "Nenhum comando correspondente";
      }
    } else if (valor.startsWith(":")) {
      const total = v?.doc?.linhas.length ?? 0;
      if (!v?.doc) {
        msg.hidden = false;
        msg.textContent = "Abra um arquivo de texto antes de ir para uma linha.";
      } else {
        const m = /^:\s*(\d+)?(?:[:,]\s*(\d+))?/.exec(valor)!;
        const linha = m[1] ? Math.min(total, Math.max(1, Number(m[1]))) : 0;
        const col = m[2] ? Math.max(1, Number(m[2])) : 1;
        msg.hidden = false;
        msg.textContent = linha
          ? `Ir para a linha ${linha}${m[2] ? `, caractere ${col}` : ""}.`
          : `Linha atual: ${v.linha + 1}, caractere: ${v.col + 1}. Digite um número de linha entre 1 e ${total} para navegar até ela.`;
        if (linha)
          itens = [
            {
              rotulo: `Ir para a linha ${linha}`,
              acao: () => {
                this.irPara(v, linha - 1, col - 1, { centro: true });
                v.rolagem.focus({ preventScroll: true });
              },
            },
          ];
        this.itensRapidos = itens;
        this.ativoRapido = 0;
        this.el.listaRapido.innerHTML = "";
        this.el.entradaRapido.placeholder = "";
        this.el.listaRapido.hidden = true;
        return;
      }
    } else if (valor.startsWith("@")) {
      const q = valor.slice(1).trim();
      placeholder = "";
      const titulos = v?.doc?.titulos ?? [];
      itens = titulos
        .map((t) => ({ t, pos: casar(t.texto, q) }))
        .filter((x) => x.pos)
        .sort((x, y) => (q ? nota(y.pos!, y.t.texto) - nota(x.pos!, x.t.texto) : 0))
        .map(({ t, pos }) => ({
          rotulo: t.texto,
          html: `<span class="ed-rapido-recuo" style="--nivel:${t.nivel - 2}"></span>${marcar(t.texto, pos!)}`,
          descricao: `linha ${t.linha + 1}`,
          icone: ICONE.titulo,
          acao: () => {
            if (v) {
              this.irPara(v, t.linha, 0, { centro: true });
              v.rolagem.focus({ preventScroll: true });
            }
          },
        }));
      if (!v) {
        msg.hidden = false;
        msg.textContent = "Abra um arquivo para ver os títulos dele.";
      } else if (!itens.length) {
        msg.hidden = false;
        msg.textContent = titulos.length ? "Nenhum título correspondente" : "O arquivo não tem títulos.";
      }
    } else {
      const q = valor.trim();
      const todos = [...this.arquivos.values()];
      const aberto = (a: Arquivo) => this.recentes.indexOf(a.slug);
      const item = (a: Arquivo, pos: number[], grupo?: string): ItemRapido => ({
        rotulo: a.nome,
        html: marcar(a.nome, pos),
        descricao: a.caminho || "blog",
        icone: iconeDo(a.ext),
        grupo,
        acao: () => void this.abrirArquivo(a.slug, { previa: false, focar: true }),
      });
      if (!q) {
        const recentes = this.recentes.map((r) => this.arquivos.get(r)).filter((a): a is Arquivo => Boolean(a));
        const resto = todos.filter((a) => aberto(a) < 0).sort((a, b) => colar.compare(a.nome, b.nome));
        itens = [...recentes.map((a, k) => item(a, [], k === 0 ? "abertos recentemente" : undefined)), ...resto.map((a, k) => item(a, [], k === 0 && recentes.length ? "mais arquivos" : undefined))];
      } else {
        const pontuados = todos
          .map((a) => {
            const pos = casar(a.nome, q);
            const titulo = !pos && normal(a.titulo).includes(normal(q));
            if (!pos && !titulo) return null;
            const junto = pos && pos.length > 1 && pos[pos.length - 1] - pos[0] === pos.length - 1;
            const nota = (pos ? (junto ? 3 : 2) : 1) * 1000 - (pos?.[0] ?? 500) + (aberto(a) >= 0 ? 50 : 0);
            return { a, pos: pos ?? [], nota };
          })
          .filter((x): x is { a: Arquivo; pos: number[]; nota: number } => Boolean(x))
          .sort((x, y) => y.nota - x.nota || colar.compare(x.a.nome, y.a.nome));
        itens = pontuados.map((x, k) => {
          const it = item(x.a, x.pos, k === 0 ? "resultados de arquivos" : undefined);
          if (!x.pos.length) it.descricao = `${x.a.caminho} · ${x.a.titulo}`;
          return it;
        });
        if (!itens.length) {
          msg.hidden = false;
          msg.textContent = "Nenhum resultado correspondente";
        }
      }
    }
    this.el.entradaRapido.placeholder = placeholder;
    this.el.listaRapido.hidden = !itens.length;
    this.itensRapidos = itens;
    this.ativoRapido = 0;
    this.el.listaRapido.innerHTML = itens
      .map(
        (it, k) =>
          `<div role="option" class="ed-rapido-item${it.grupo && k > 0 ? " com-borda" : ""}" id="ed${this.id}-op-${k}" aria-selected="${k === 0}" data-k="${k}">` +
          (it.icone ?? "") +
          `<span class="ed-rapido-rotulo">${it.html ?? escapar(it.rotulo)}</span>` +
          (it.descricao ? `<span class="ed-rapido-desc">${escapar(it.descricao)}</span>` : "") +
          (it.grupo ? `<span class="ed-rapido-grupo">${escapar(it.grupo)}</span>` : "") +
          (it.atalho ? `<span class="ed-teclas">${[...it.atalho].map((t) => `<kbd>${escapar(t)}</kbd>`).join("")}</span>` : "") +
          "</div>",
      )
      .join("");
    this.marcarRapido(0);
  }

  private marcarRapido(k: number) {
    if (!this.itensRapidos.length) {
      this.el.entradaRapido.removeAttribute("aria-activedescendant");
      return;
    }
    this.ativoRapido = (k + this.itensRapidos.length) % this.itensRapidos.length;
    for (const o of this.el.listaRapido.querySelectorAll<HTMLElement>('[aria-selected="true"]')) o.setAttribute("aria-selected", "false");
    const op = this.el.listaRapido.querySelector<HTMLElement>(`[data-k="${this.ativoRapido}"]`);
    op?.setAttribute("aria-selected", "true");
    op?.scrollIntoView({ block: "nearest" });
    if (op) this.el.entradaRapido.setAttribute("aria-activedescendant", op.id);
  }

  private escolherRapido(k = this.ativoRapido) {
    const it = this.itensRapidos[k];
    if (!it) return;
    this.fecharRapido(false);
    it.acao();
    // A ação que não mexe no foco devolve ao lugar de antes.
    if (!this.raiz.contains(document.activeElement) || document.activeElement === this.raiz) this.focarAgora();
  }

  // ---------------------------------------------------------------------------------------------------
  // As ações (dos menus, dos botões e dos atalhos)
  // ---------------------------------------------------------------------------------------------------

  private mostrarVista(qual: "explorer" | "busca", focar: boolean) {
    this.vistaLateral = qual;
    if (!this.lateralVisivel) this.alternarLateral(true);
    for (const b of this.raiz.querySelectorAll<HTMLElement>(".ed-atividade[data-vista]")) b.setAttribute("aria-pressed", String(b.dataset.vista === qual));
    for (const p of this.raiz.querySelectorAll<HTMLElement>("[data-painel]")) p.hidden = p.dataset.painel !== qual;
    if (this.s.estreito.matches) this.mostrarLateralNoCelular(true);
    if (focar) {
      if (qual === "busca") {
        this.el.busca.focus();
        this.el.busca.select();
      } else this.focarArvore();
    }
    this.esconderCartao();
    this.menusMudaram();
  }

  private alternarLateral(forcar?: boolean) {
    if (this.s.estreito.matches) {
      this.mostrarLateralNoCelular(forcar ?? !this.raiz.classList.contains("lateral-aberta"));
      return;
    }
    this.lateralVisivel = forcar ?? !this.lateralVisivel;
    this.raiz.classList.toggle("sem-lateral", !this.lateralVisivel);
    this.raiz.querySelector('[data-acao="lateral"]')?.setAttribute("aria-pressed", String(this.lateralVisivel));
    for (const b of this.raiz.querySelectorAll<HTMLElement>(".ed-atividade[data-vista]")) b.setAttribute("aria-pressed", String(this.lateralVisivel && b.dataset.vista === this.vistaLateral));
    if (!this.lateralVisivel && this.el.lateral.contains(document.activeElement)) this.ativa?.vista.rolagem.focus({ preventScroll: true });
    this.esconderCartao();
    this.menusMudaram();
  }

  /** No celular, a barra lateral abre por cima do editor. */
  private mostrarLateralNoCelular(aberta: boolean) {
    if (!this.s.estreito.matches) return;
    this.raiz.classList.toggle("lateral-aberta", aberta);
    for (const b of this.raiz.querySelectorAll<HTMLElement>(".ed-atividade[data-vista]")) b.setAttribute("aria-pressed", String(aberta && b.dataset.vista === this.vistaLateral));
  }

  private alternarMinimapa() {
    this.minimapa = !this.minimapa;
    if (this.ativa) this.desenharMapa(this.ativa.vista);
    this.menusMudaram();
  }

  private alternarQuebra() {
    const v = this.ativa?.vista;
    // Mantém a linha do cursor no mesmo lugar da tela (medida antes da troca).
    const naTela = v?.doc ? this.topoDaLinha(v, v.linha) - v.rolagem.scrollTop : 0;
    this.quebra = !this.quebra;
    for (const a of this.abas) a.vista.el.classList.toggle("quebra", this.quebra);
    if (v?.doc) {
      v.rolagem.scrollLeft = 0;
      v.rolagem.scrollTop = this.topoDaLinha(v, v.linha) - naTela;
      this.ajustarVista(v);
      if (!this.el.localizar.hidden) this.localizar(true);
    }
    this.menusMudaram();
  }

  private recolherPastas() {
    for (const i of this.el.arvore.querySelectorAll<HTMLElement>('[aria-expanded="true"]')) this.abrirPasta(i, false);
    const primeiro = this.el.arvore.querySelector<HTMLElement>('[role="treeitem"]');
    if (primeiro) for (const i of this.el.arvore.querySelectorAll<HTMLElement>('[role="treeitem"]')) i.tabIndex = i === primeiro ? 0 : -1;
  }

  private abrirNaPrevia() {
    const a = this.ativa?.vista.arquivo;
    if (a?.post) void this.s.abrirApp("previa", { slug: a.slug });
  }

  private lerNoBlog() {
    const a = this.ativa?.vista.arquivo;
    if (a?.post) location.assign(a.post.url);
  }

  private marcarHistorico(slug: string) {
    const atual = this.historico[this.posHistorico];
    if (atual?.slug === slug) return;
    if (atual && this.ativa) atual.linha = this.ativa.vista.linha;
    this.historico = this.historico.slice(0, this.posHistorico + 1);
    this.historico.push({ slug, linha: 0 });
    if (this.historico.length > 50) this.historico.shift();
    this.posHistorico = this.historico.length - 1;
    this.atualizarNavegacao();
  }

  private navegar(passo: number) {
    const alvo = this.posHistorico + passo;
    const h = this.historico[alvo];
    if (!h) return;
    const atual = this.historico[this.posHistorico];
    if (atual && this.ativa?.slug === atual.slug) atual.linha = this.ativa.vista.linha;
    this.posHistorico = alvo;
    this.atualizarNavegacao();
    if (this.arquivos.has(h.slug)) void this.abrirArquivo(h.slug, { previa: false, focar: true, linha: h.linha, historico: false });
  }

  private atualizarNavegacao() {
    const voltar = this.raiz.querySelector<HTMLButtonElement>('[data-acao="voltar"]')!;
    const avancar = this.raiz.querySelector<HTMLButtonElement>('[data-acao="avancar"]')!;
    voltar.disabled = this.posHistorico <= 0;
    avancar.disabled = this.posHistorico >= this.historico.length - 1;
  }

  private mostrarAviso() {
    const v = this.ativa?.vista;
    if (!v) return;
    const a = this.el.aviso;
    const area = this.el.area.getBoundingClientRect();
    const c = v.cursor.getBoundingClientRect();
    a.hidden = false;
    const x = Math.max(8, Math.min(c.left - area.left - 12, area.width - a.offsetWidth - 8));
    const acima = c.top - area.top - a.offsetHeight - 6;
    const y = acima > 4 ? acima : c.bottom - area.top + 6;
    a.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
    this.avisoDesde = performance.now();
    clearTimeout(this.esperaAviso);
    this.esperaAviso = window.setTimeout(() => this.esconderAviso(), 2600);
  }

  private esperaAviso = 0;
  private avisoDesde = 0;

  private esconderAviso() {
    clearTimeout(this.esperaAviso);
    this.el.aviso.hidden = true;
  }

  focarAgora() {
    if (!this.el.rapido.hidden) return this.el.entradaRapido.focus();
    const v = this.ativa?.vista;
    if (v && v.estado === "pronto") return v.rolagem.focus({ preventScroll: true });
    if (this.lateralVisivel && this.vistaLateral === "busca") return this.el.busca.focus();
    this.focarArvore();
  }

  private focarArvore() {
    if (!this.lateralVisivel && !this.s.estreito.matches) {
      this.raiz.querySelector<HTMLElement>(".ed-atividade")?.focus();
      return;
    }
    const item = this.el.arvore.querySelector<HTMLElement>('[role="treeitem"][tabindex="0"]') ?? this.el.arvore.querySelector<HTMLElement>('[role="treeitem"]');
    if (item) item.focus({ preventScroll: true });
    else this.raiz.querySelector<HTMLElement>(".ed-atividade")?.focus();
  }

  // ---------------------------------------------------------------------------------------------------
  // Os menus da barra e os atalhos
  // ---------------------------------------------------------------------------------------------------

  private menusAgendados = false;

  /** Os menus da barra refeitos uma vez só, na tarefa seguinte (várias mudanças seguidas viram uma). */
  private menusMudaram() {
    if (!this.naFrente || this.menusAgendados) return;
    this.menusAgendados = true;
    setTimeout(() => {
      this.menusAgendados = false;
      if (this.naFrente && this.raiz.isConnected) this.s.atualizarMenus();
    }, 0);
  }

  menuDoApp(): ItemDeMenu[] {
    return [{ rotulo: "Mostrar todos os comandos", atalho: "⇧⌘P", acao: () => this.abrirRapido(">") }];
  }

  menus(): Menu[] {
    const v = this.ativa?.vista;
    const temArquivo = Boolean(v);
    const temPost = Boolean(v?.arquivo.post);
    return [
      {
        titulo: "Arquivo",
        itens: [
          { rotulo: "Abrir arquivo…", atalho: "⌘P", acao: () => this.abrirRapido() },
          { separador: true },
          { rotulo: "Abrir na Pré-Visualização", desativado: !temPost, acao: () => this.abrirNaPrevia() },
          { rotulo: "Ler no blog", desativado: !temPost, acao: () => this.lerNoBlog() },
          { separador: true },
          { rotulo: "Salvar", atalho: "⌘S", desativado: true },
          { separador: true },
          { rotulo: "Fechar o editor", desativado: !temArquivo, acao: () => this.ativa && this.fecharAba(this.ativa, true) },
          { rotulo: "Fechar todos os editores", desativado: !this.abas.length, acao: () => this.fecharTodas() },
        ],
      },
      {
        titulo: "Editar",
        itens: [
          { rotulo: "Desfazer", atalho: "⌘Z", desativado: true },
          { rotulo: "Refazer", atalho: "⇧⌘Z", desativado: true },
          { separador: true },
          { rotulo: "Copiar", atalho: "⌘C", desativado: !temArquivo, acao: () => this.copiar() },
          { separador: true },
          { rotulo: "Localizar", atalho: "⌘F", desativado: !temArquivo, acao: () => this.abrirLocalizar() },
          { rotulo: "Pesquisar nos arquivos", atalho: "⇧⌘F", acao: () => this.mostrarVista("busca", true) },
        ],
      },
      {
        titulo: "Seleção",
        itens: [
          { rotulo: "Selecionar tudo", atalho: "⌘A", desativado: !temArquivo, acao: () => this.selecionarTudo() },
          { rotulo: "Selecionar a linha", atalho: "⌘L", desativado: !temArquivo, acao: () => this.selecionarLinha() },
        ],
      },
      {
        titulo: "Ver",
        itens: [
          { rotulo: "Paleta de comandos…", atalho: "⇧⌘P", acao: () => this.abrirRapido(">") },
          { separador: true },
          { rotulo: "Explorer", atalho: "⇧⌘E", acao: () => this.mostrarVista("explorer", true) },
          { rotulo: "Pesquisar", atalho: "⇧⌘F", acao: () => this.mostrarVista("busca", true) },
          { separador: true },
          { rotulo: "Barra lateral principal", atalho: "⌘B", marcado: this.lateralVisivel, acao: () => this.alternarLateral() },
          { rotulo: "Minimapa", marcado: this.minimapa, acao: () => this.alternarMinimapa() },
          { rotulo: "Quebra automática de linha", atalho: "⌥Z", marcado: this.quebra, acao: () => this.alternarQuebra() },
        ],
      },
      {
        titulo: "Ir",
        itens: [
          { rotulo: "Voltar", atalho: "⌃-", desativado: this.posHistorico <= 0, acao: () => this.navegar(-1) },
          { rotulo: "Avançar", atalho: "⌃⇧-", desativado: this.posHistorico >= this.historico.length - 1, acao: () => this.navegar(1) },
          { separador: true },
          { rotulo: "Ir para arquivo…", atalho: "⌘P", acao: () => this.abrirRapido() },
          { rotulo: "Ir para o símbolo no editor…", atalho: "⇧⌘O", desativado: !temArquivo, acao: () => this.abrirRapido("@") },
          { rotulo: "Ir para a linha/coluna…", atalho: "⌃G", desativado: !temArquivo, acao: () => this.abrirRapido(":") },
          { separador: true },
          { rotulo: "Próximo editor", desativado: this.abas.length < 2, acao: () => this.trocarAba(1) },
          { rotulo: "Editor anterior", desativado: this.abas.length < 2, acao: () => this.trocarAba(-1) },
        ],
      },
      {
        titulo: "Terminal",
        itens: [
          { rotulo: "Novo terminal", acao: () => void this.s.abrirApp("terminal") },
          { rotulo: "Executar tarefa…", desativado: true },
        ],
      },
    ];
  }

  private trocarAba(passo: number) {
    if (!this.abas.length) return;
    const i = this.ativa ? this.abas.indexOf(this.ativa) : 0;
    this.ativar(this.abas[(i + passo + this.abas.length) % this.abas.length]);
    this.ativa?.vista.rolagem.focus({ preventScroll: true });
  }

  private selecionarTudo() {
    const v = this.ativa?.vista;
    if (!v?.doc) return;
    const r = document.createRange();
    r.selectNodeContents(v.codigo);
    getSelection()?.removeAllRanges();
    getSelection()?.addRange(r);
    v.linha = v.doc.linhas.length - 1;
    v.col = v.doc.linhas[v.linha].length;
    v.rolagem.focus({ preventScroll: true });
    this.posicionarCursor(v, false);
  }

  private selecionarLinha() {
    const v = this.ativa?.vista;
    if (!v?.doc) return;
    const el = this.linhaEl(v, v.linha);
    if (!el) return;
    const r = document.createRange();
    r.selectNodeContents(el);
    getSelection()?.removeAllRanges();
    getSelection()?.addRange(r);
    v.col = v.doc.linhas[v.linha].length;
    v.rolagem.focus({ preventScroll: true });
    this.posicionarCursor(v, false);
  }

  /** Os atalhos (quando a janela do Editor está na frente). Nada de ⌘W, ⌘T, ⌘N nem ⌘Q (são do navegador). */
  tecla(e: KeyboardEvent): boolean {
    if (e.key === "Escape") {
      if (!this.el.rapido.hidden) {
        this.fecharRapido();
        return true;
      }
      if (!this.el.localizar.hidden) {
        this.fecharLocalizar();
        return true;
      }
      if (!this.el.aviso.hidden) {
        this.esconderAviso();
        return true;
      }
      if (!this.el.cartao.hidden) {
        this.esconderCartao();
        return true;
      }
      if (this.raiz.classList.contains("lateral-aberta")) {
        this.mostrarLateralNoCelular(false);
        this.focarAgora();
        return true;
      }
      if (this.ativa?.vista.ancora || (getSelection() && !getSelection()!.isCollapsed && this.ativa?.vista.codigo.contains(getSelection()!.anchorNode))) {
        getSelection()?.removeAllRanges();
        if (this.ativa) this.ativa.vista.ancora = undefined;
        this.atualizarStatus();
        return true;
      }
      return false;
    }
    if (e.defaultPrevented) return false;
    const mod = e.metaKey || (!MAC && e.ctrlKey);
    const k = e.key.toLowerCase();
    const fazer = (f: () => void) => {
      e.preventDefault();
      f();
      return true;
    };
    if (mod && e.shiftKey && !e.altKey && k === "p") return fazer(() => this.abrirRapido(">"));
    if (e.key === "F1") return fazer(() => this.abrirRapido(">"));
    if (mod && !e.shiftKey && !e.altKey && k === "p") return fazer(() => this.abrirRapido());
    if (mod && e.shiftKey && k === "o") return fazer(() => this.abrirRapido("@"));
    if (e.ctrlKey && !e.metaKey && !e.shiftKey && k === "g") return fazer(() => this.abrirRapido(":"));
    if (mod && e.shiftKey && k === "f") return fazer(() => this.mostrarVista("busca", true));
    if (mod && e.shiftKey && k === "e") return fazer(() => this.mostrarVista("explorer", true));
    if (mod && !e.shiftKey && k === "b") return fazer(() => this.alternarLateral());
    if (mod && !e.shiftKey && k === "s") return fazer(() => {});
    if (e.altKey && !mod && e.code === "KeyZ") return fazer(() => this.alternarQuebra());
    if (e.ctrlKey && !e.metaKey && e.code === "Minus") return fazer(() => this.navegar(e.shiftKey ? 1 : -1));
    if (mod && e.altKey && (e.key === "ArrowRight" || e.key === "ArrowLeft") && this.abas.length > 1) return fazer(() => this.trocarAba(e.key === "ArrowRight" ? 1 : -1));
    const v = this.ativa?.vista;
    if (v) {
      if (mod && !e.shiftKey && k === "f") return fazer(() => this.abrirLocalizar());
      if (!this.el.localizar.hidden && (e.key === "F3" || (mod && k === "g"))) return fazer(() => this.irAoAchado(this.achadoAtual + (e.shiftKey ? -1 : 1)));
      if (v.rolagem.contains(e.target as Node)) {
        if (mod && !e.shiftKey && k === "a") return fazer(() => this.selecionarTudo());
        if (mod && !e.shiftKey && k === "l") return fazer(() => this.selecionarLinha());
      }
    }
    return false;
  }

  // ---------------------------------------------------------------------------------------------------
  // Os eventos
  // ---------------------------------------------------------------------------------------------------

  private ligar() {
    const r = this.raiz;

    // Os botões com data-acao (barra de título, Explorer, boas-vindas, Localizar, status).
    r.addEventListener("click", (e) => {
      const alvo = e.target as Element;
      const acao = alvo.closest<HTMLElement>("[data-acao]")?.dataset.acao;
      switch (acao) {
        case "voltar":
          return this.navegar(-1);
        case "avancar":
          return this.navegar(1);
        case "ir-arquivo":
          return this.abrirRapido();
        case "comandos":
          return this.abrirRapido(">");
        case "pesquisar":
          return this.mostrarVista("busca", true);
        case "lateral":
          return this.alternarLateral();
        case "terminal":
          return void this.s.abrirApp("terminal");
        case "terminal-suspenso":
          return void this.s.abrirApp("terminal", { suspenso: "alternar" });
        case "recolher":
          return this.recolherPastas();
        case "limpar-busca":
          this.el.busca.value = "";
          void this.pesquisar();
          return this.el.busca.focus();
        case "previa":
          return this.abrirNaPrevia();
        case "ir-linha":
          return this.abrirRapido(":");
        case "achado-anterior":
          return this.irAoAchado(this.achadoAtual - 1);
        case "achado-proximo":
          return this.irAoAchado(this.achadoAtual + 1);
        case "fechar-localizar":
          return this.fecharLocalizar();
        case "recarregar":
          return void (this as { pronto: Promise<void> }).pronto;
        case "tentar-de-novo": {
          const v = this.ativa?.vista;
          if (v) void this.carregarVista(v);
          return;
        }
      }
      const opcao = alvo.closest<HTMLElement>("[data-opcao]");
      if (opcao) {
        const nome = opcao.dataset.opcao as keyof Editor["opcoes"];
        this.opcoes[nome] = !this.opcoes[nome];
        opcao.setAttribute("aria-pressed", String(this.opcoes[nome]));
        this.localizar();
        this.el.entradaLocalizar.focus();
        return;
      }
      const revelar = alvo.closest<HTMLElement>("[data-revelar]");
      if (revelar) {
        const no = revelar.dataset.revelar!;
        this.mostrarVista("explorer", false);
        const item = this.el.arvore.querySelector<HTMLElement>(`[data-no="${CSS.escape(no)}"]`);
        if (item) {
          let pai = item.parentElement?.closest<HTMLElement>('[role="treeitem"]');
          while (pai) {
            this.abrirPasta(pai, true);
            pai = pai.parentElement?.closest<HTMLElement>('[role="treeitem"]');
          }
          this.moverFoco(this.el.arvore, item);
        }
        return;
      }
      const titulo = alvo.closest<HTMLElement>("[data-titulo]");
      if (titulo && this.ativa) {
        this.irPara(this.ativa.vista, Number(titulo.dataset.titulo), 0, { centro: true });
        this.ativa.vista.rolagem.focus({ preventScroll: true });
      }
    });

    // A barra de atividades: o clique na vista que já está aberta fecha a barra lateral (como no VS Code).
    const atividades = r.querySelector<HTMLElement>(".ed-atividades")!;
    atividades.addEventListener("click", (e) => {
      const b = (e.target as Element).closest<HTMLElement>("[data-vista]");
      if (!b) return;
      const qual = b.dataset.vista as "explorer" | "busca";
      if (this.s.estreito.matches) {
        const aberta = this.raiz.classList.contains("lateral-aberta");
        if (aberta && this.vistaLateral === qual) this.mostrarLateralNoCelular(false);
        else this.mostrarVista(qual, e.detail === 0);
        return;
      }
      if (this.lateralVisivel && this.vistaLateral === qual) this.alternarLateral(false);
      else this.mostrarVista(qual, e.detail === 0 || qual === "busca");
    });
    atividades.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "Home" && e.key !== "End") return;
      const botoes = [...atividades.querySelectorAll<HTMLButtonElement>("button")];
      const i = botoes.indexOf(document.activeElement as HTMLButtonElement);
      const j = e.key === "Home" ? 0 : e.key === "End" ? botoes.length - 1 : (i + (e.key === "ArrowDown" ? 1 : -1) + botoes.length) % botoes.length;
      e.preventDefault();
      botoes.forEach((b, k) => (b.tabIndex = k === j ? 0 : -1));
      botoes[j].focus();
    });

    // As seções do Explorer (blog e Estrutura de tópicos) abrem e fecham.
    for (const secao of [this.el.secaoBlog, this.el.secaoTopicos]) {
      const botao = secao.querySelector<HTMLButtonElement>(".ed-secao-botao")!;
      botao.addEventListener("click", () => {
        const aberta = botao.getAttribute("aria-expanded") !== "true";
        botao.setAttribute("aria-expanded", String(aberta));
        secao.querySelector<HTMLElement>(".ed-secao-corpo")!.hidden = !aberta;
        secao.classList.toggle("fechada", !aberta);
        if (aberta && secao === this.el.secaoTopicos) this.desenharTopicos();
      });
    }

    // A árvore: o clique simples abre a prévia; o duplo clique fixa a aba e passa o foco ao editor.
    const arvore = this.el.arvore;
    arvore.addEventListener("click", (e) => {
      const item = (e.target as Element).closest(".ed-no-linha")?.closest<HTMLElement>('[role="treeitem"]');
      if (!item) return;
      this.moverFoco(arvore, item);
      const no = item.dataset.no ?? "";
      if (no.startsWith("a:")) {
        this.esconderCartao();
        void this.abrirArquivo(no.slice(2), { previa: e.detail < 2, focar: e.detail >= 2 });
      } else this.abrirPasta(item, item.getAttribute("aria-expanded") !== "true");
    });
    this.teclasDaArvore(arvore, (item, fixar) => {
      const no = item.dataset.no ?? "";
      if (no.startsWith("a:")) void this.abrirArquivo(no.slice(2), { previa: !fixar, focar: fixar });
      else this.abrirPasta(item, item.getAttribute("aria-expanded") !== "true");
    });
    arvore.addEventListener("pointerover", (e) => {
      if (e.pointerType !== "mouse") return;
      const item = (e.target as Element).closest(".ed-no-linha")?.closest<HTMLElement>('[role="treeitem"]');
      if (item) this.pedirCartao(item);
    });
    arvore.addEventListener("pointerleave", () => this.esconderCartao(140));
    arvore.addEventListener("pointerdown", () => this.esconderCartao());
    arvore.addEventListener("focusin", (e) => {
      const item = (e.target as Element).closest<HTMLElement>('[role="treeitem"]');
      if (item && item.matches(":focus-visible")) this.pedirCartao(item, true);
    });
    arvore.addEventListener("focusout", (e) => {
      if (!arvore.contains(e.relatedTarget as Node)) this.esconderCartao();
    });
    r.querySelector(".ed-secao-corpo")!.addEventListener("scroll", () => this.esconderCartao(), { passive: true });

    // A Estrutura de tópicos leva ao título.
    const irAoTopico = (item: HTMLElement, focar: boolean) => {
      const v = this.ativa?.vista;
      const linha = Number((item.dataset.no ?? "").slice(2));
      if (!v || Number.isNaN(linha)) return;
      this.irPara(v, linha, 0, { centro: true });
      if (focar) v.rolagem.focus({ preventScroll: true });
      if (this.s.estreito.matches) this.mostrarLateralNoCelular(false);
    };
    this.el.topicos.addEventListener("click", (e) => {
      const item = (e.target as Element).closest<HTMLElement>('[role="treeitem"]');
      if (!item) return;
      this.moverFoco(this.el.topicos, item);
      irAoTopico(item, false);
    });
    this.teclasDaArvore(this.el.topicos, irAoTopico);

    // Pesquisar.
    this.el.busca.addEventListener("input", () => this.agendarBusca());
    this.el.busca.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        clearTimeout(this.esperaBusca);
        void this.pesquisar().then(() => {
          const primeiro = this.el.resultados.querySelector<HTMLElement>('[role="treeitem"]');
          if (primeiro) this.abrirResultado(primeiro, true);
        });
      } else if (e.key === "ArrowDown") {
        const primeiro = this.el.resultados.querySelector<HTMLElement>('[role="treeitem"]');
        if (primeiro) {
          e.preventDefault();
          this.moverFoco(this.el.resultados, primeiro);
        }
      }
    });
    this.el.resultados.addEventListener("click", (e) => {
      const linha = (e.target as Element).closest(".ed-no-linha");
      const item = linha?.closest<HTMLElement>('[role="treeitem"]');
      if (!item) return;
      this.moverFoco(this.el.resultados, item);
      if (item.hasAttribute("aria-expanded") && (e.target as Element).closest(".ed-seta")) {
        this.abrirPasta(item, item.getAttribute("aria-expanded") !== "true");
        return;
      }
      this.abrirResultado(item, e.detail >= 2);
    });
    this.teclasDaArvore(this.el.resultados, (item, fixar) => this.abrirResultado(item, fixar));

    // A borda da barra lateral muda a largura (duplo clique volta aos 240px).
    const sash = r.querySelector<HTMLElement>("[data-sash]")!;
    sash.addEventListener("pointerdown", (e) => {
      if (e.button !== 0 || this.s.estreito.matches) return;
      e.preventDefault();
      capturar(sash, e.pointerId);
      sash.classList.add("ativo");
      const x0 = e.clientX;
      const w0 = this.larguraLateral;
      let quadro = 0;
      const mover = (ev: PointerEvent) => {
        const max = Math.max(170, Math.min(500, r.clientWidth - 48 - 280));
        this.larguraLateral = Math.round(Math.max(170, Math.min(max, w0 + ev.clientX - x0)));
        if (!quadro)
          quadro = requestAnimationFrame(() => {
            quadro = 0;
            r.style.setProperty("--ed-lateral-w", `${this.larguraLateral}px`);
          });
      };
      const soltar = () => {
        sash.classList.remove("ativo");
        sash.removeEventListener("pointermove", mover);
        sash.removeEventListener("pointerup", soltar);
        sash.removeEventListener("pointercancel", soltar);
        r.style.setProperty("--ed-lateral-w", `${this.larguraLateral}px`);
      };
      sash.addEventListener("pointermove", mover);
      sash.addEventListener("pointerup", soltar);
      sash.addEventListener("pointercancel", soltar);
    });
    sash.addEventListener("dblclick", () => {
      this.larguraLateral = 240;
      r.style.setProperty("--ed-lateral-w", "240px");
    });

    // As abas: clique ativa, duplo clique fixa, o do meio fecha, o × fecha, arrastar muda a ordem.
    const abas = this.el.abas;
    abas.addEventListener("click", (e) => {
      if (this.ignorarClique) return;
      const alvo = e.target as Element;
      const fechar = alvo.closest<HTMLElement>("[data-fechar]");
      const aba = this.abas.find((a) => a.slug === (fechar ?? alvo.closest<HTMLElement>("[data-aba]"))?.dataset[fechar ? "fechar" : "aba"]);
      if (!aba) return;
      if (fechar) return this.fecharAba(aba);
      if (e.detail >= 2) {
        aba.previa = false;
        this.desenharAbas();
      } else if (aba !== this.ativa) this.ativar(aba);
      this.el.abas.querySelector<HTMLElement>('[aria-selected="true"]')?.focus({ preventScroll: true });
    });
    abas.addEventListener("mousedown", (e) => {
      if (e.button === 1) e.preventDefault();
    });
    abas.addEventListener("auxclick", (e) => {
      if (e.button !== 1) return;
      const aba = this.abas.find((a) => a.slug === (e.target as Element).closest<HTMLElement>("[data-aba]")?.dataset.aba);
      if (aba) {
        e.preventDefault();
        this.fecharAba(aba);
      }
    });
    abas.addEventListener("pointerdown", (e) => {
      if (e.button !== 0 || e.pointerType !== "mouse") return;
      const aba = (e.target as Element).closest<HTMLElement>("[data-aba]");
      if (aba && !(e.target as Element).closest("[data-fechar]")) this.arrastarAba(aba, e);
    });
    abas.addEventListener("dblclick", (e) => {
      // O duplo clique no espaço vazio da faixa (como o VS Code abre um arquivo novo): aqui, o Ir para arquivo.
      if (e.target === abas) this.abrirRapido();
    });
    abas.addEventListener("wheel", (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && abas.scrollWidth > abas.clientWidth) {
        abas.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    });
    abas.addEventListener("keydown", (e) => {
      const atual = (e.target as Element).closest<HTMLElement>("[data-aba]");
      if (!atual) return;
      const lista = [...abas.querySelectorAll<HTMLElement>("[data-aba]")];
      const i = lista.indexOf(atual);
      let j = -1;
      if (e.key === "ArrowRight") j = (i + 1) % lista.length;
      else if (e.key === "ArrowLeft") j = (i - 1 + lista.length) % lista.length;
      else if (e.key === "Home") j = 0;
      else if (e.key === "End") j = lista.length - 1;
      else if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        const aba = this.abas.find((a) => a.slug === atual.dataset.aba);
        if (aba) {
          const ativa = this.ativa === aba;
          this.fecharAba(aba, true);
          if (!ativa) abas.querySelector<HTMLElement>('[aria-selected="true"]')?.focus();
        }
        return;
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.ativa?.vista.rolagem.focus({ preventScroll: true });
        return;
      } else return;
      e.preventDefault();
      const aba = this.abas.find((a) => a.slug === lista[j].dataset.aba);
      if (aba) this.ativar(aba);
      abas.querySelector<HTMLElement>('[aria-selected="true"]')?.focus();
    });

    // O editor: o clique põe o cursor; a seleção conta os caracteres; digitar avisa que é só leitura.
    const area = this.el.area;
    area.addEventListener("pointerdown", (e) => {
      const v = this.vistaDe(e.target as Element);
      if (!v || !v.doc || e.button !== 0) return;
      const alvo = e.target as Element;
      // O clique no número seleciona a linha inteira (como no VS Code).
      if (alvo.closest(".ed-calha") && !this.quebra) {
        e.preventDefault();
        const n = Math.floor((e.clientY - v.codigo.getBoundingClientRect().top) / LINHA);
        if (n >= 0 && n < v.doc.linhas.length) {
          v.linha = n;
          v.rolagem.focus({ preventScroll: true });
          this.selecionarLinha();
        }
        return;
      }
      if (!alvo.closest(".ed-codigo")) return;
      this.esconderAviso();
      const ponto = this.pontoNaTela(e.clientX, e.clientY);
      let c = ponto ? this.colunaDe(v, ponto.no, ponto.off) : undefined;
      // Abaixo da última linha: o fim do arquivo.
      if (!c && e.clientY > v.codigo.getBoundingClientRect().bottom) c = { linha: v.doc.linhas.length - 1, col: v.doc.linhas[v.doc.linhas.length - 1].length };
      if (!c) return;
      if (e.shiftKey) return;
      v.ancora = undefined;
      v.linha = c.linha;
      v.col = c.col;
      v.colDesejada = c.col;
      this.posicionarCursor(v, false);
    });
    area.addEventListener("pointerup", () => this.seguirSelecao());
    area.addEventListener("keyup", (e) => {
      if (e.shiftKey) this.atualizarStatus();
    });
    area.addEventListener("keydown", (e) => {
      const v = this.vistaDe(e.target as Element);
      if (!v || e.target !== v.rolagem) return;
      if (!e.metaKey && !e.ctrlKey && this.teclaNoEditor(v, e)) {
        e.preventDefault();
        this.esconderAviso();
        return;
      }
      const mod = e.metaKey || e.ctrlKey || e.altKey;
      if (!mod && (e.key.length === 1 || e.key === "Backspace" || e.key === "Delete" || e.key === "Enter" || e.key === "Tab")) {
        if (e.key === "Tab") return;
        e.preventDefault();
        this.mostrarAviso();
      }
    });
    area.addEventListener("copy", (e) => {
      // A cópia sai como o arquivo, linha por linha (sem o que o HTML acrescenta).
      const texto = this.textoSelecionado(this.vistaDe(e.target as Element) ?? this.ativa?.vista);
      if (texto === undefined) return;
      e.clipboardData?.setData("text/plain", texto);
      e.preventDefault();
    });
    area.addEventListener("focusin", (e) => {
      const v = this.vistaDe(e.target as Element);
      if (v && e.target === v.rolagem) v.el.classList.add("focado");
    });
    area.addEventListener("focusout", (e) => {
      const v = this.vistaDe(e.target as Element);
      if (v && e.target === v.rolagem) v.el.classList.remove("focado");
    });
    area.addEventListener(
      "scroll",
      (e) => {
        const v = this.vistaDe(e.target as Element);
        if (!v || e.target !== v.rolagem) return;
        if (!this.quadroRolagem)
          this.quadroRolagem = requestAnimationFrame(() => {
            this.quadroRolagem = 0;
            this.acompanharMapa(v);
          });
        if (!this.el.aviso.hidden && performance.now() - this.avisoDesde > 200) this.esconderAviso();
      },
      { capture: true, passive: true },
    );
    // O minimapa de cada vista (ligado quando ela é criada).
    new MutationObserver((mudancas) => {
      for (const m of mudancas)
        for (const n of m.addedNodes) {
          if (!(n instanceof HTMLElement) || !n.classList.contains("ed-vista-arquivo") || n.dataset.ligada) continue;
          n.dataset.ligada = "";
          const v = this.abas.find((a) => a.vista.el === n)?.vista;
          if (v) this.ligarMapa(v);
        }
    }).observe(area, { childList: true });

    // Localizar.
    this.el.entradaLocalizar.addEventListener("input", () => this.localizar());
    this.el.entradaLocalizar.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.irAoAchado(this.achadoAtual + (e.shiftKey ? -1 : 1));
      } else if (e.altKey && (e.metaKey || e.ctrlKey) && ["KeyC", "KeyW", "KeyR"].includes(e.code)) {
        e.preventDefault();
        const nome = e.code === "KeyC" ? "caixa" : e.code === "KeyW" ? "palavra" : "regex";
        this.raiz.querySelector<HTMLElement>(`[data-opcao="${nome}"]`)?.click();
      }
    });

    // O Ir para arquivo.
    this.el.entradaRapido.addEventListener("input", () => this.filtrarRapido());
    this.el.entradaRapido.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        this.marcarRapido(this.ativoRapido + (e.key === "ArrowDown" ? 1 : -1));
      } else if (e.key === "PageDown" || e.key === "PageUp") {
        e.preventDefault();
        this.marcarRapido(Math.max(0, Math.min(this.itensRapidos.length - 1, this.ativoRapido + (e.key === "PageDown" ? 10 : -10))));
      } else if (e.key === "Enter") {
        e.preventDefault();
        this.escolherRapido();
      } else if (e.key === "Tab") {
        e.preventDefault();
      }
    });
    this.el.entradaRapido.addEventListener("blur", (e) => {
      if (!this.el.rapido.contains(e.relatedTarget as Node)) setTimeout(() => this.fecharRapido(false), 0);
    });
    this.el.listaRapido.addEventListener("pointerdown", (e) => e.preventDefault());
    this.el.listaRapido.addEventListener("click", (e) => {
      const op = (e.target as Element).closest<HTMLElement>("[data-k]");
      if (op) this.escolherRapido(Number(op.dataset.k));
    });
    this.el.listaRapido.addEventListener("pointermove", (e) => {
      const op = (e.target as Element).closest<HTMLElement>("[data-k]");
      if (op && e.pointerType === "mouse") {
        for (const o of this.el.listaRapido.querySelectorAll(".passa")) o.classList.remove("passa");
        op.classList.add("passa");
      }
    });

    // No celular: o toque fora da barra lateral (aberta por cima) a fecha.
    r.addEventListener("pointerdown", (e) => {
      if (!this.raiz.classList.contains("lateral-aberta")) return;
      const alvo = e.target as Element;
      if (!alvo.closest(".ed-lateral, .ed-atividades")) this.mostrarLateralNoCelular(false);
    });

    // A seleção pelo teclado do sistema (⇧ + clique, o duplo clique na palavra).
    const aoSelecionar = () => {
      if (this.ativa && this.raiz.contains(document.activeElement)) this.atualizarStatus();
    };
    document.addEventListener("selectionchange", aoSelecionar);
    this.desligar.push(() => document.removeEventListener("selectionchange", aoSelecionar));

    // O tema mudou: o minimapa é redesenhado com as cores novas.
    const aoTema = () => {
      for (const a of this.abas) a.vista.mapaDesenhado = "";
      requestAnimationFrame(() => this.ativa && this.desenharMapa(this.ativa.vista));
    };
    addEventListener("tema:mudou", aoTema);
    this.desligar.push(() => removeEventListener("tema:mudou", aoTema));
    const tema = new MutationObserver(aoTema);
    tema.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    this.desligar.push(() => tema.disconnect());

    const aoEstreito = () => this.aplicarEstreito();
    this.s.estreito.addEventListener("change", aoEstreito);
    this.desligar.push(() => this.s.estreito.removeEventListener("change", aoEstreito));
  }

  private quadroRolagem = 0;

  /** O texto selecionado no editor, como está no arquivo (as linhas inteiras, sem o HTML). */
  private textoSelecionado(v: Vista | undefined): string | undefined {
    const sel = getSelection();
    if (!v?.doc || !sel || sel.isCollapsed || !sel.rangeCount || !v.codigo.contains(sel.anchorNode)) return;
    const r = sel.getRangeAt(0);
    const a = this.colunaDe(v, r.startContainer, r.startOffset) ?? { linha: 0, col: 0 };
    const b = this.colunaDe(v, r.endContainer, r.endOffset) ?? { linha: v.doc.linhas.length - 1, col: v.doc.linhas.at(-1)!.length };
    if (a.linha === b.linha) return v.doc.linhas[a.linha].slice(a.col, b.col);
    const partes = v.doc.linhas.slice(a.linha, b.linha + 1);
    partes[0] = partes[0].slice(a.col);
    partes[partes.length - 1] = partes[partes.length - 1].slice(0, b.col);
    return partes.join("\n");
  }

  private copiar() {
    const v = this.ativa?.vista;
    const texto = this.textoSelecionado(v) ?? (v?.doc ? v.doc.linhas[v.linha] + "\n" : undefined);
    if (texto !== undefined) void navigator.clipboard?.writeText(texto).catch(() => {});
  }

  private vistaDe(alvo: Element | null): Vista | undefined {
    const el = alvo?.closest(".ed-vista-arquivo");
    return el ? this.abas.find((a) => a.vista.el === el)?.vista : undefined;
  }

  private pontoNaTela(x: number, y: number): { no: Node; off: number } | undefined {
    const d = document as unknown as {
      caretPositionFromPoint?(x: number, y: number): { offsetNode: Node; offset: number } | null;
      caretRangeFromPoint?(x: number, y: number): Range | null;
    };
    if (d.caretPositionFromPoint) {
      const p = d.caretPositionFromPoint(x, y);
      return p ? { no: p.offsetNode, off: p.offset } : undefined;
    }
    const r = d.caretRangeFromPoint?.(x, y);
    return r ? { no: r.startContainer, off: r.startOffset } : undefined;
  }

  /** Depois de selecionar com o mouse, o cursor vai para a ponta da seleção (e a barra de status conta). */
  private seguirSelecao() {
    const v = this.ativa?.vista;
    const sel = getSelection();
    if (!v || !sel || sel.isCollapsed || !sel.focusNode || !v.codigo.contains(sel.focusNode)) return;
    const c = this.colunaDe(v, sel.focusNode, sel.focusOffset);
    const a = sel.anchorNode ? this.colunaDe(v, sel.anchorNode, sel.anchorOffset) : undefined;
    if (!c) return;
    v.linha = c.linha;
    v.col = c.col;
    v.colDesejada = c.col;
    v.ancora = a;
    this.posicionarCursor(v, false);
  }

  private aplicarEstreito() {
    const estreito = this.s.estreito.matches;
    this.raiz.classList.toggle("estreito", estreito);
    if (!estreito) this.raiz.classList.remove("lateral-aberta");
    else if (!this.ativa) this.mostrarLateralNoCelular(true);
    this.esconderCartao();
    if (this.ativa) this.desenharMapa(this.ativa.vista);
  }

  private aoAtivar(ativa: boolean) {
    this.naFrente = ativa;
    if (!ativa) {
      this.esconderCartao();
      this.esconderAviso();
    }
  }

  private aoMudarTamanho() {
    this.esconderCartao();
    const max = Math.max(170, Math.min(500, this.raiz.clientWidth - 48 - 280));
    if (this.larguraLateral > max) {
      this.larguraLateral = max;
      this.raiz.style.setProperty("--ed-lateral-w", `${max}px`);
    }
    if (this.ativa) this.ajustarVista(this.ativa.vista);
  }

  private encerrar() {
    for (const d of this.desligar) d();
    this.observador.disconnect();
    clearTimeout(this.esperaCartao);
    clearTimeout(this.someCartao);
    clearTimeout(this.esperaAviso);
    this.limparAchados();
    this.aoSair();
  }
}
