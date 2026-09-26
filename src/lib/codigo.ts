/**
 * Blocos de código (Expressive Code): temas feitos com os tokens do blog (briefing §5.3), o nome da
 * linguagem na barra do bloco e o botão Copiar levando a versão final, sem as linhas removidas (`del`).
 */
import { ExpressiveCodeTheme, pluginFramesTexts, setAlpha, type ExpressiveCodePlugin } from "astro-expressive-code";
import { claro, escuro, misturar, type Paleta } from "../styles/tokens";

pluginFramesTexts.addLocale("pt-BR", {
  terminalWindowFallbackTitle: "Janela do terminal",
  copyButtonTooltip: "Copiar",
  copyButtonCopied: "Copiado",
});

function tema(nome: string, tipo: "light" | "dark", p: Paleta): ExpressiveCodeTheme {
  // O bloco fica sobre a folha (D26): a superfície com um pouco de tinta, e a barra com um pouco mais.
  const fundo = p.well;
  const barra = misturar(p["paper-hi"], p.ink, 8);
  return new ExpressiveCodeTheme({
    name: nome,
    type: tipo,
    colors: {
      "editor.background": fundo,
      "editor.foreground": p.ink,
      "editorLineNumber.foreground": p["ink-3"],
      "editor.selectionBackground": setAlpha(p.acento, 0.25),
      "editorGroupHeader.tabsBackground": barra,
      "editorGroupHeader.tabsBorder": p.rule,
      "tab.activeBackground": fundo,
      "tab.activeForeground": p["ink-2"],
      "tab.inactiveBackground": barra,
      "tab.border": p.rule,
      "titleBar.activeBackground": barra,
      "titleBar.activeForeground": p["ink-2"],
      "titleBar.border": p.rule,
      "terminal.background": fundo,
    },
    tokenColors: [
      { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: p["ink-3"], fontStyle: "italic" } },
      {
        scope: ["keyword", "storage", "storage.type", "storage.modifier", "keyword.control", "keyword.operator.new", "constant.language"],
        settings: { foreground: p.acento },
      },
      { scope: ["string", "string.quoted", "markup.inline.raw"], settings: { foreground: p["aviso-dica"] } },
      { scope: ["constant.numeric", "constant.character", "constant.other"], settings: { foreground: p["aviso-importante"] } },
      {
        scope: ["entity.name.type", "entity.name.class", "support.class", "support.type", "entity.other.inherited-class"],
        settings: { foreground: p["aviso-nota"] },
      },
      {
        scope: ["storage.type.annotation", "meta.declaration.annotation", "punctuation.definition.annotation", "meta.decorator"],
        settings: { foreground: p["aviso-atencao"] },
      },
      { scope: ["entity.name.tag", "entity.name.tag.yaml", "support.type.property-name"], settings: { foreground: p.acento } },
      { scope: ["entity.other.attribute-name"], settings: { foreground: p["aviso-nota"] } },
      { scope: ["punctuation", "meta.brace"], settings: { foreground: p["ink-2"] } },
      { scope: ["markup.inserted"], settings: { foreground: p["aviso-dica"] } },
      { scope: ["markup.deleted"], settings: { foreground: p["aviso-cuidado"] } },
    ],
  });
}

export const temasDeCodigo = [tema("cs-claro", "light", claro), tema("cs-escuro", "dark", escuro)];

/** Cores das linhas marcadas, por tema: acréscimo e remoção tingidos, destaque na cor de nota. */
export const marcacoes = {
  insBackground: ({ theme }: { theme: ExpressiveCodeTheme }) => setAlpha(paleta(theme)["aviso-dica"], 0.14),
  insBorderColor: ({ theme }: { theme: ExpressiveCodeTheme }) => paleta(theme)["aviso-dica"],
  insDiffIndicatorColor: ({ theme }: { theme: ExpressiveCodeTheme }) => paleta(theme)["aviso-dica"],
  delBackground: ({ theme }: { theme: ExpressiveCodeTheme }) => setAlpha(paleta(theme)["aviso-cuidado"], 0.12),
  delBorderColor: ({ theme }: { theme: ExpressiveCodeTheme }) => paleta(theme)["aviso-cuidado"],
  delDiffIndicatorColor: ({ theme }: { theme: ExpressiveCodeTheme }) => paleta(theme)["aviso-cuidado"],
  markBackground: ({ theme }: { theme: ExpressiveCodeTheme }) => setAlpha(paleta(theme)["aviso-nota"], 0.14),
  markBorderColor: ({ theme }: { theme: ExpressiveCodeTheme }) => paleta(theme)["aviso-nota"],
};

function paleta(theme: ExpressiveCodeTheme): Paleta {
  return theme.type === "dark" ? escuro : claro;
}

interface Anotacao {
  markerType?: string;
  inlineRange?: unknown;
}

/** O Copiar do Expressive Code leva o bloco inteiro; aqui ele passa a ignorar as linhas `del`. */
export function pluginCopiarSemRemovidas(): ExpressiveCodePlugin {
  return {
    name: "copiar-sem-removidas",
    hooks: {
      postprocessRenderedBlock: ({ codeBlock, renderData }) => {
        const linhas = codeBlock.getLines();
        const removida = (linha: (typeof linhas)[number]) =>
          linha.getAnnotations().some((a) => {
            const anotacao = a as unknown as Anotacao;
            return anotacao.markerType === "del" && !anotacao.inlineRange;
          });
        if (!linhas.some(removida)) return;
        const final = linhas
          .filter((l) => !removida(l))
          .map((l) => l.text)
          .join("\x7F");
        const trocar = (no: { properties?: Record<string, unknown>; children?: unknown[] }) => {
          if (no.properties && "dataCode" in no.properties) no.properties.dataCode = final;
          no.children?.forEach((filho) => trocar(filho as typeof no));
        };
        trocar(renderData.blockAst as Parameters<typeof trocar>[0]);
      },
    },
  };
}

/** Nome exibido de cada linguagem usada nos posts; o que não estiver aqui aparece como veio. */
const LINGUAGENS: Record<string, string> = {
  java: "Java",
  kotlin: "Kotlin",
  groovy: "Groovy",
  xml: "XML",
  html: "HTML",
  css: "CSS",
  json: "JSON",
  yaml: "YAML",
  yml: "YAML",
  toml: "TOML",
  properties: "Properties",
  sql: "SQL",
  js: "JavaScript",
  javascript: "JavaScript",
  ts: "TypeScript",
  typescript: "TypeScript",
  python: "Python",
  go: "Go",
  dockerfile: "Dockerfile",
  hcl: "HCL",
  http: "HTTP",
  markdown: "Markdown",
  md: "Markdown",
  diff: "Diff",
};
const SEM_NOME = new Set(["", "text", "txt", "plaintext", "plain", "ansi", "log", "output"]);

interface NoHast {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: NoHast[];
  value?: string;
}

/**
 * Nome da linguagem à direita da barra do bloco (briefing §5.3 e protótipo), como uma etiqueta
 * separada do título, que fica à esquerda (D39). Blocos sem título ganham a barra só com a etiqueta;
 * terminal e texto puro ficam como estão.
 */
export function pluginLinguagem(): ExpressiveCodePlugin {
  const classes = (no: NoHast) => (no.properties?.className as string[] | undefined) ?? [];
  const achar = (no: NoHast, teste: (n: NoHast) => boolean): NoHast | undefined =>
    teste(no) ? no : no.children?.map((filho) => achar(filho, teste)).find(Boolean);
  return {
    name: "linguagem",
    baseStyles: `
      .header .linguagem { flex: none; margin-inline: auto 0.75rem; align-self: center; padding: 0.05rem 0.55rem;
        border: 1px solid color-mix(in oklab, currentColor 28%, transparent); border-radius: 999px;
        font-family: var(--ec-uiFontFml); font-size: 0.75rem; line-height: 1.5; color: var(--ec-frm-edTabBarFg, currentColor); }
      .frame.sem-titulo .header::before { content: none; }
    `,
    hooks: {
      postprocessRenderedBlock: ({ codeBlock, renderData }) => {
        const id = codeBlock.language.toLowerCase();
        if (SEM_NOME.has(id)) return;
        const moldura = achar(renderData.blockAst as NoHast, (no) => no.tagName === "figure" && classes(no).includes("frame"));
        if (!moldura || classes(moldura).includes("is-terminal")) return;
        const cabecalho = achar(moldura, (no) => no.tagName === "figcaption");
        if (!cabecalho) return;
        if (!classes(moldura).includes("has-title")) moldura.properties!.className = [...classes(moldura), "has-title", "sem-titulo"];
        // O espaço antes da etiqueta separa o título da linguagem também no texto (leitor de tela, sem CSS).
        cabecalho.children = [
          ...(cabecalho.children ?? []),
          { type: "text", value: " " },
          { type: "element", tagName: "span", properties: { className: ["linguagem"] }, children: [{ type: "text", value: LINGUAGENS[id] ?? id }] },
        ];
      },
    },
  };
}

/**
 * Número de linhas do bloco em `--linhas` na moldura (D37): o CSS (prosa.css) estima com ele a altura
 * do bloco que ainda não foi desenhado (`content-visibility: auto`), para a página não pular. No
 * java-25 (36 blocos), o layout completo com CPU 4× cai de 57 para 20 ms.
 */
export function pluginAlturaEstimada(): ExpressiveCodePlugin {
  const classes = (no: NoHast) => (no.properties?.className as string[] | undefined) ?? [];
  const achar = (no: NoHast): NoHast | undefined =>
    no.tagName === "figure" && classes(no).includes("frame") ? no : no.children?.map(achar).find(Boolean);
  return {
    name: "altura-estimada",
    hooks: {
      postprocessRenderedBlock: ({ codeBlock, renderData }) => {
        const moldura = achar(renderData.blockAst as NoHast);
        if (!moldura) return;
        const estilo = moldura.properties!.style ? `${moldura.properties!.style};` : "";
        moldura.properties!.style = `${estilo}--linhas:${codeBlock.getLines().length}`;
      },
    },
  };
}

/*
 * A caneta nos blocos de código (D48; guia em docs/marcacoes.md, visual em src/styles/caneta.css):
 *   anotar="1789564500|15 min depois"   o valor circulado, com a nota à mão ao lado
 *   linhas="2-3|o banco decide"          um traço à mão nas linhas 2 a 3, com o motivo
 * A nota fica na mesma linha quando cabe (linha curta) e embaixo dela quando não cabe; no celular,
 * sempre embaixo, parada na esquerda do bloco, para a rolagem lateral do código não cortá-la. O Copiar
 * leva só o código (ele usa o texto original, não o desenhado).
 */
const CABE_NA_LINHA = 58;
const CANETA = {
  circulo: ["0 0 100 44", ["M10 25 C 5 10, 38 3, 68 5 C 94 7, 99 27, 80 35 C 55 43, 12 40, 6 26 C 4 17, 16 9, 30 7"]],
  circuloLongo: ["0 0 100 44", ["M58 3.5 C 82 3.5, 98.5 10, 98 22 C 97.5 34, 77 41.5, 50 41 C 23 40.5, 1.5 34, 2 21.5 C 2.5 10, 24 3, 47 3.2 C 57 3.3, 66 4.5, 73 7"]],
  seta: ["0 0 20 12", ["M19 6.5 C 13 5.5, 8 6.5, 2 6", "M6 2 L 1.5 6 L 6 10"]],
  barra: ["0 0 8 100", ["M4 2 C 5 30, 3 70, 4 98"]],
} as const;

function tracoDaCaneta(nome: keyof typeof CANETA, classe: string): NoHast {
  const [viewBox, caminhos] = CANETA[nome];
  return {
    type: "element",
    tagName: "svg",
    properties: { className: ["caneta-svg", classe], viewBox, preserveAspectRatio: "none", ariaHidden: "true", focusable: "false" },
    children: caminhos.map((d) => ({ type: "element", tagName: "path", properties: { d }, children: [] })),
  };
}

const lidoNoCodigo = (value: string): NoHast => ({
  type: "element",
  tagName: "span",
  properties: { className: ["caneta-sr"] },
  children: [{ type: "text", value }],
});

function notaNoCodigo(texto: string, abaixo: boolean): NoHast {
  return {
    type: "element",
    tagName: "span",
    properties: { className: ["caneta-escrita", "caneta-nota-codigo", ...(abaixo ? ["abaixo"] : [])] },
    children: [tracoDaCaneta("seta", "caneta-seta-codigo"), lidoNoCodigo(" (nota: "), { type: "text", value: texto }, lidoNoCodigo(")")],
  };
}

export function pluginCaneta(): ExpressiveCodePlugin {
  const classes = (no: NoHast) => (no.properties?.className as string[] | undefined) ?? [];
  const linhasDoBloco = (no: NoHast, lista: NoHast[] = []) => {
    if (no.tagName === "div" && classes(no).includes("ec-line")) lista.push(no);
    else no.children?.forEach((filho) => linhasDoBloco(filho, lista));
    return lista;
  };
  const codigoDaLinha = (linha: NoHast) => linha.children?.find((c) => c.tagName === "div" && classes(c).includes("code"));
  const erro = (mensagem: string) => {
    throw new Error(`Caneta no código (docs/marcacoes.md): ${mensagem}`);
  };

  /** Envolve a primeira ocorrência de `valor` num nó de texto da linha com o círculo. */
  function circular(no: NoHast, valor: string): boolean {
    const filhos = no.children ?? [];
    for (let i = 0; i < filhos.length; i++) {
      const filho = filhos[i];
      if (filho.type === "text" && filho.value?.includes(valor)) {
        const [antes, ...resto] = filho.value.split(valor);
        const circulo: NoHast = {
          type: "element",
          tagName: "span",
          properties: { className: ["caneta-codigo-circulo", ...(valor.length > 12 ? ["longo"] : [])] },
          children: [{ type: "text", value: valor }, tracoDaCaneta(valor.length > 12 ? "circuloLongo" : "circulo", "caneta-traco")],
        };
        const novos = [antes ? { type: "text", value: antes } : null, circulo, resto.join(valor) ? { type: "text", value: resto.join(valor) } : null];
        filhos.splice(i, 1, ...(novos.filter(Boolean) as NoHast[]));
        return true;
      }
      if (circular(filho, valor)) return true;
    }
    return false;
  }

  return {
    name: "caneta",
    hooks: {
      postprocessRenderedBlock: ({ codeBlock, renderData }) => {
        const anotar = codeBlock.metaOptions.getStrings("anotar");
        const trechos = codeBlock.metaOptions.getStrings("linhas");
        if (!anotar.length && !trechos.length) return;
        const textos = codeBlock.getLines().map((l) => l.text);
        const linhas = linhasDoBloco(renderData.blockAst as NoHast);

        for (const pedido of anotar) {
          const [valor, nota] = pedido.split("|").map((s) => s.trim());
          const i = textos.findIndex((texto) => texto.includes(valor));
          if (i < 0) erro(`anotar="${pedido}": "${valor}" não aparece no bloco`);
          const codigo = codigoDaLinha(linhas[i]);
          if (!codigo || !circular(codigo, valor)) erro(`anotar="${pedido}": "${valor}" está partido entre cores do código; circule um trecho menor`);
          codigo!.children!.push(notaNoCodigo(nota, textos[i].trimEnd().length + nota.length > CABE_NA_LINHA));
        }

        for (const pedido of trechos) {
          const [faixa, nota] = pedido.split("|").map((s) => s.trim());
          const [de, ate = de] = faixa.split("-").map(Number);
          if (!(de >= 1 && ate >= de && ate <= linhas.length)) erro(`linhas="${pedido}": o bloco tem ${linhas.length} linhas`);
          const primeira = linhas[de - 1];
          primeira.properties!.className = [...classes(primeira), "caneta-linhas-inicio"];
          const estilo = primeira.properties!.style ? `${primeira.properties!.style};` : "";
          primeira.properties!.style = `${estilo}--caneta-n:${ate - de + 1}`;
          codigoDaLinha(primeira)!.children!.unshift(tracoDaCaneta("barra", "caneta-linhas-barra"));
          codigoDaLinha(linhas[ate - 1])!.children!.push(notaNoCodigo(nota, textos[ate - 1].trimEnd().length + nota.length > CABE_NA_LINHA));
        }
      },
    },
  };
}
