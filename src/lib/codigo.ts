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
 * Nome da linguagem à direita da barra do bloco (briefing §5.3 e protótipo). Blocos sem título
 * ganham a barra só com o nome; terminal e texto puro ficam como estão.
 */
export function pluginLinguagem(): ExpressiveCodePlugin {
  const classes = (no: NoHast) => (no.properties?.className as string[] | undefined) ?? [];
  const achar = (no: NoHast, teste: (n: NoHast) => boolean): NoHast | undefined =>
    teste(no) ? no : no.children?.map((filho) => achar(filho, teste)).find(Boolean);
  return {
    name: "linguagem",
    baseStyles: `
      .header .linguagem { margin-inline-start: auto; align-self: center; padding-inline: 0.9rem; font-family: var(--ec-codeFontFml);
        font-size: 0.8rem; color: var(--ec-frm-edTabBarFg, currentColor); opacity: 0.85; }
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
        cabecalho.children = [
          ...(cabecalho.children ?? []),
          { type: "element", tagName: "span", properties: { className: ["linguagem"] }, children: [{ type: "text", value: LINGUAGENS[id] ?? id }] },
        ];
      },
    },
  };
}
