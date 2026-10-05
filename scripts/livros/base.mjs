/**
 * A base das fotos dos livros (D57), copiada de docs/historico/livros-realistas/base/base.mjs: a capa,
 * a lombada e a capa da série, planas e iguais ao site (D39: categoria com o papel em cima e a cor do
 * livro embaixo; série sempre em papel claro). Os dados vêm de src/livros/livros.json e das medidas que
 * medir.mjs tira do dev (a linha de base e o início de cada texto das capas, os desenhos como o site
 * serve, os ícones e os artigos de cada livro): iniciarBase(medidas) antes de usar.
 *
 * Cada função devolve um fragmento SVG (sem a raiz <svg>, sem <style>, sem id), nas unidades da
 * referência: capa 480 × 720; lombada `largura` × 720. Os traços dos desenhos viram atributos (sem
 * classes), para o fragmento poder entrar várias vezes no mesmo documento.
 */
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const ler = (caminho) => JSON.parse(readFileSync(new URL(caminho, import.meta.url), "utf8"));
const dados = ler("../../src/livros/livros.json");

export const PAPEL = dados.papel; // #f2ede2
export const BITTER = "'Bitter Variable', Rockwell, Georgia, serif";
export const NEWSREADER = "'Newsreader Variable', Georgia, serif";

/** Deslocamento da linha de base alfabética em relação ao centro da coluna, no texto vertical (em). */
const central = (f) => (f.ascendente - f.descendente) / 2;

const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const n = (v) => String(Math.round(v * 100) / 100);

// ---------- os livros ----------

/** Métricas das fontes, os livros e a série: preenchidos por iniciarBase(). */
let M;
export let LIVROS = [];
export let REVISTA;

export function iniciarBase(medidas) {
  M = medidas.metricas;
  const capasMedidas = medidas.capas.filter((c) => !c.serie);
  LIVROS = dados.livros.map((l, i) => {
    const m = capasMedidas[i];
    const paginas = medidas.livros[l.slug];
    return {
      slug: l.slug,
      volume: l.volume,
      titulo: l.titulo,
      linhas: l.linhasDoTitulo,
      frase: l.frase,
      instrumento: l.instrumento,
      /** Cores do site (src/livros/cores.js, como o site calcula). */
      cor: m.cores.cor, // a cor do livro: parte de baixo da capa, contracapa
      tinta: m.cores.tinta, // texto e desenho sobre a cor
      destaque: m.cores.destaque, // título, linha do topo e ícone sobre o papel
      corDaLombada: m.cores["cor-texto"], // a Carreira usa uma cor mais escura na lombada (D35)
      papel: m.cores.papel,
      tintaPapel: m.cores["tinta-papel"],
      largura: l.lombadaEmPe.largura,
      altura: l.lombadaEmPe.altura,
      artigos: paginas.posts.length,
      posts: paginas.posts,
      _m: m,
      _icone: paginas.icone,
    };
  });
  const serieMedidas = medidas.capas.find((c) => c.serie);
  const serieDados = dados.series[0];
  REVISTA = {
    slug: "serie-java",
    titulo: serieDados.titulo,
    tituloPrincipal: serieDados.tituloPrincipal,
    complemento: serieDados.complemento,
    destaque: serieMedidas.cores.destaque, // #c24d1c: faixa, complemento, número
    destaqueTexto: serieMedidas.cores["destaque-texto"], // #b8481a: texto pequeno sobre o papel
    papel: serieMedidas.cores.papel,
    tinta: serieMedidas.cores["tinta-papel"],
    largura: serieDados.lombadaEmPe.largura, // 80
    altura: serieDados.lombadaEmPe.altura, // 700
    edicoes: medidas.livros["serie-java"].posts.length,
    posts: medidas.livros["serie-java"].posts,
    _m: serieMedidas,
    _emblema: medidas.livros["serie-java"].icone,
  };
}

export function livro(slug) {
  const l = LIVROS.find((x) => x.slug === slug);
  if (!l) throw new Error(`Livro desconhecido: ${slug} (use ${LIVROS.map((x) => x.slug).join(", ")})`);
  return l;
}

// ---------- texto ----------

/** Um <text> com o estilo do site. `vertical`: gira 90° no sentido horário (como vertical-rl). */
function texto(t, { x, y, familia, peso, corpo, espacamento = 0, italico = false, opsz, cor, opacidade = 1, numeros = "lining-nums", ancora, girado = false }) {
  const estilo = [
    `font-family:${familia}`,
    `font-weight:${peso}`,
    `font-size:${n(corpo)}px`,
    italico ? "font-style:italic" : "",
    espacamento ? `letter-spacing:${n(espacamento)}px` : "",
    opsz ? `font-variation-settings:'opsz' ${opsz}` : "",
    `font-variant-numeric:${numeros}`,
    // Sem ajuste ao pixel: a mesma letra tem de cair no mesmo lugar em todas as células do mapeamento.
    "text-rendering:geometricPrecision",
  ]
    .filter(Boolean)
    .join(";");
  const op = opacidade < 1 ? ` opacity="${opacidade}"` : "";
  const an = ancora ? ` text-anchor="${ancora}"` : "";
  if (girado) return `<text transform="translate(${n(x)} ${n(y)}) rotate(90)" fill="${cor}"${op}${an} style="${estilo}">${t}</text>`;
  return `<text x="${n(x)}" y="${n(y)}" fill="${cor}"${op}${an} style="${estilo}">${t}</text>`;
}

const px = (s) => parseFloat(s) || 0;

/** As linhas medidas no site (medidas.json), com o estilo medido. */
function linhasMedidas(lista, cor, extra = {}) {
  return lista
    .map((l) => {
      const italico = l.estilo === "italic";
      const opsz = /opsz"?\s*([\d.]+)/.exec(l.variacao)?.[1];
      return texto(esc(l.texto), {
        x: l.x,
        y: l.y,
        familia: italico ? NEWSREADER : BITTER,
        peso: l.peso,
        corpo: l.corpo,
        espacamento: px(l.espacamento),
        italico,
        opsz,
        cor,
        opacidade: l.opacidade,
        ...extra,
      });
    })
    .join("");
}

// ---------- traços dos desenhos e ícones ----------

/**
 * Converte as classes cz-* dos desenhos do site em atributos. `larguras`: w1, w2, w3, gh, ghs e
 * tracejado (na unidade do desenho). `papel`: a cor que tapa o que fica atrás (as variáveis
 * --capa-papel, --lombada-cor e --serie-papel do site).
 */
function tracos(marcacao, { larguras, papel }) {
  const { w1, w2, w3, gh, ghs, tracejado } = larguras;
  return marcacao
    .replace(/<svg\b[^>]*>|<\/svg>/g, "")
    .replace(/<(path|circle)\b([^>]*?)\s*(\/?)>/g, (_, tag, attrs, fecha) => {
      const a = {};
      for (const m of attrs.matchAll(/([\w:-]+)="([^"]*)"/g)) a[m[1]] = m[2];
      const classes = (a.class ?? "").split(/\s+/);
      const estilo = a.style ?? "";
      delete a.class;
      delete a.style;
      const p = {};
      if (classes.includes("cz-ln")) Object.assign(p, { fill: "none", stroke: "currentColor", "stroke-linecap": "round", "stroke-linejoin": "round" });
      if (classes.includes("cz-w1")) p["stroke-width"] = n(w1);
      if (classes.includes("cz-w2")) p["stroke-width"] = n(w2);
      if (classes.includes("cz-w3")) p["stroke-width"] = n(w3);
      if (classes.includes("cz-gh"))
        Object.assign(p, { fill: "none", stroke: "currentColor", "stroke-width": n(gh), "stroke-linecap": "round", "stroke-dasharray": tracejado, opacity: "0.8" });
      if (classes.includes("cz-ghs")) Object.assign(p, { fill: "none", stroke: "currentColor", "stroke-width": n(ghs), "stroke-linecap": "round", opacity: "0.8" });
      if (classes.includes("cz-fi")) Object.assign(p, { fill: "currentColor", stroke: "none" });
      if (/fill:\s*var\(/.test(estilo)) p.fill = papel;
      const todos = { ...a, ...p };
      return `<${tag} ${Object.entries(todos).map(([k, v]) => `${k}="${v}"`).join(" ")}${fecha ? "/" : ""}>`;
    });
}

/** A caixa de visão (viewBox) justa de um ícone do site. */
const caixaDoIcone = (svg) => /viewBox="([^"]+)"/.exec(svg)[1].split(/\s+/).map(Number);

/**
 * Um ícone do site (sem giro, viewBox justo) numa caixa, como o CSS do site: `meet`, centrado.
 * `girado`: 90° no sentido horário (lombada em pé). `traco`: o traço principal em px da referência
 * (o site usa traço que não escala; aqui ele é convertido para a unidade do ícone, para escalar junto).
 */
function iconeNaCaixa(svg, { x, y, w, h, girado, cor, papel, traco, gh = 0.7, ghs = 0.6, tracejado = [1.25, 2.75] }) {
  const [vx, vy, vw, vh] = caixaDoIcone(svg);
  const [cw, ch] = girado ? [vh, vw] : [vw, vh];
  const s = Math.min(w / cw, h / ch);
  const corpo = tracos(svg, {
    larguras: { w1: traco / s, w2: (traco * 0.67) / s, w3: (traco * 0.5) / s, gh: gh / s, ghs: ghs / s, tracejado: tracejado.map((v) => n(v / s)).join(" ") },
    papel,
  });
  const vb = girado ? `${n(-(vy + vh))} ${n(vx)} ${n(vh)} ${n(vw)}` : `${n(vx)} ${n(vy)} ${n(vw)} ${n(vh)}`;
  const miolo = girado ? `<g transform="rotate(90)">${corpo}</g>` : corpo;
  return `<svg x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" viewBox="${vb}" preserveAspectRatio="xMidYMid meet" overflow="visible" color="${cor}">${miolo}</svg>`;
}

// ---------- categoria ----------

/**
 * A capa plana (480 × 720), como no site: o papel de 0 a 300 com "VOLUME 0N", "CESAR SCHUTZ" e o
 * título no destaque; a cor do livro de 300 a 720 com a frase, o desenho e a assinatura na tinta.
 * `fundo: false` tira os dois retângulos de fundo (para a prancha pintar o material por baixo).
 */
export function capa(slug, { fundo = true } = {}) {
  const l = livro(slug);
  const t = l._m.textos;
  const desenho = tracos(l._m.desenho, { larguras: { w1: 1.8, w2: 1.2, w3: 0.7, gh: 1.3, ghs: 1.1, tracejado: "2.5 5.5" }, papel: l.cor });
  return [
    fundo ? `<rect width="480" height="300" fill="${l.papel}"/><rect y="300" width="480" height="420" fill="${l.cor}"/>` : "",
    `<g color="${l.tinta}">${desenho}</g>`,
    `<g opacity="${l._m.topoOpacidade}">${linhasMedidas(t.volume, l.destaque)}${linhasMedidas(t.autor, l.destaque)}</g>`,
    linhasMedidas(t.titulo, l.destaque),
    linhasMedidas(t.frase, l.tinta),
    linhasMedidas(t.assinatura, l.tinta),
  ].join("");
}

/**
 * A lombada plana, como no site: o papel em cima com o ícone (girado) no destaque; a cor do livro
 * embaixo com o título na vertical (26 abaixo da divisão) e o número de artigos (26 acima da base),
 * na tinta. `altura` e `divisao` em unidades da referência:
 * - no livro 3D, 720 de altura e a divisão em 300, alinhada com a da capa (padrão);
 */
export function lombada(slug, { altura = 720, divisao = 300, fundo = true } = {}) {
  const l = livro(slug);
  const w = l.largura;
  const b = M.bitter;
  const partes = [];
  if (fundo) partes.push(`<rect width="${w}" height="${n(divisao)}" fill="${l.papel}"/><rect y="${n(divisao)}" width="${w}" height="${n(altura - divisao)}" fill="${l.corDaLombada}"/>`);
  partes.push(iconeNaCaixa(l._icone, { x: 22, y: 32, w: w - 44, h: divisao - 64, girado: true, cor: l.destaque, papel: l.papel, traco: 1.3 }));
  // Título: uma coluna por linha, a primeira à direita (vertical-rl), 33 de entrelinha, centradas.
  const total = l.linhas.length * 33;
  const esquerda = w / 2 - total / 2;
  l.linhas.forEach((linha, j) => {
    const centro = esquerda + total - (j + 0.5) * 33;
    partes.push(texto(esc(linha), { x: centro - central(b) * 30, y: divisao + 26, familia: BITTER, peso: 800, corpo: 30, espacamento: -0.3, cor: l.tinta, girado: true }));
  });
  if (l.artigos > 0)
    partes.push(texto(String(l.artigos), { x: w / 2 - central(b) * 28, y: altura - 26, familia: BITTER, peso: 700, corpo: 28, cor: l.tinta, ancora: "end", girado: true }));
  return partes.join("");
}

// ---------- revista (série) ----------

/** A capa da revista (480 × 720), como no site: faixa, título, dados, número, edições, tarja e rodapé. */
export function capaDaRevista({ fundo = true } = {}) {
  const r = REVISTA;
  const m = r._m;
  const t = m.textos;
  const c = m.caixas;
  const partes = [];
  if (fundo) partes.push(`<rect width="480" height="720" fill="${r.papel}"/>`);
  partes.push(`<rect width="480" height="14" fill="${r.destaque}"/>`);
  partes.push(linhasMedidas(t.titulo, r.tinta), linhasMedidas(t.complemento, r.destaque));
  // Linha de dados: fio de 2 em cima e de 1 embaixo.
  partes.push(`<rect x="${c.dados.x}" y="${c.dados.y}" width="${c.dados.w}" height="2" fill="${r.tinta}"/>`);
  partes.push(`<rect x="${c.dados.x}" y="${n(c.dados.y + c.dados.h - 1)}" width="${c.dados.w}" height="1" fill="${r.tinta}"/>`);
  for (const d of t.dados) partes.push(linhasMedidas(d, r.tinta));
  partes.push(linhasMedidas(t.rotulo, r.tinta));
  partes.push(linhasMedidas(t.numero, r.destaque, { numeros: "lining-nums proportional-nums" }));
  // Edições: fio de 1 em cima de cada uma, na cor do texto a 28%.
  for (const e of m.edicoes) {
    const cor = e.atual ? r.destaque : r.tinta;
    partes.push(`<rect x="${e.caixa.x}" y="${e.caixa.y}" width="${e.caixa.w}" height="1" fill="${cor}" fill-opacity="0.28"/>`);
    partes.push(linhasMedidas(e.nome, cor), linhasMedidas(e.nota, cor));
  }
  // A tarja: faixa escura, barra de 10 no destaque, título, linha e a seta num círculo.
  partes.push(`<rect x="0" y="${c.tarja.y}" width="480" height="${c.tarja.h}" fill="${r.tinta}"/>`);
  partes.push(`<rect x="0" y="${c.tarja.y}" width="10" height="${c.tarja.h}" fill="${r.destaque}"/>`);
  partes.push(linhasMedidas(t.tarjaTitulo, r.papel), linhasMedidas(t.tarjaLinha, corDaLinhaDaTarja()));
  const cx = c.seta.x + c.seta.w / 2;
  const cy = c.seta.y + c.seta.h / 2;
  partes.push(`<circle cx="${n(cx)}" cy="${n(cy)}" r="17" fill="none" stroke="${r.destaque}" stroke-width="2"/>`);
  const lado = c.seta.w * 0.52;
  partes.push(
    `<svg x="${n(cx - lado / 2)}" y="${n(cy - lado / 2)}" width="${n(lado)}" height="${n(lado)}" viewBox="0 0 24 24" overflow="visible"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="${r.destaque}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  );
  // Rodapé: o emblema, o subtítulo e a assinatura.
  partes.push(iconeNaCaixa(r._emblema, { ...c.emblema, girado: false, cor: r.tinta, papel: r.papel, traco: 1.2, gh: 1.3, ghs: 1.1, tracejado: [2.5, 5.5] }));
  partes.push(linhasMedidas(t.subtitulo, r.tinta), linhasMedidas(t.assinatura, r.tinta));
  return partes.join("");
}

/** A linha da tarja: color-mix(in oklab, destaque, papel 42%), como no site. */
function corDaLinhaDaTarja() {
  const m = /oklab\(([-\d.]+) ([-\d.]+) ([-\d.]+)\)/.exec(REVISTA._m.textos.tarjaLinha[0].cor);
  if (!m) return REVISTA._m.textos.tarjaLinha[0].cor;
  const [L, a, b] = m.slice(1).map(Number);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const mm = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const lin = [4.0767416621 * l - 3.3077115913 * mm + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * mm - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * mm + 1.707614701 * s];
  const srgb = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
  return "#" + lin.map((v) => Math.round(Math.min(1, Math.max(0, srgb(Math.max(0, v)))) * 255).toString(16).padStart(2, "0")).join("");
}

/**
 * A lombada da revista, como no site: papel, fina (80), a faixa de 14 no destaque no topo, o emblema
 * girado, o título na vertical (a palavra principal e o complemento em itálico no destaque) e o
 * número de edições no pé. `altura`: 720 no livro 3D (padrão); 700 na estante.
 */
export function lombadaDaRevista({ altura = 720, fundo = true } = {}) {
  const r = REVISTA;
  const w = r.largura;
  const b = M.bitter;
  const ni = M.newsreaderItalico;
  const partes = [];
  if (fundo) partes.push(`<rect width="${w}" height="${altura}" fill="${r.papel}"/>`);
  partes.push(`<rect width="${w}" height="14" fill="${r.destaque}"/>`);
  partes.push(iconeNaCaixa(r._emblema, { x: 12, y: 40, w: w - 24, h: 60, girado: true, cor: r.tinta, papel: r.papel, traco: 1.3 }));
  // Título: uma coluna de 26 centrada; a parte em itálico fica no mesmo eixo central (outra fonte,
  // outra linha de base alfabética).
  const bxBitter = w / 2 - central(b) * 26;
  const desvio = (central(b) - central(ni)) * 26; // o itálico sobe (para a direita, na lombada)
  partes.push(
    `<text transform="translate(${n(bxBitter)} 130) rotate(90)" style="font-family:${BITTER};font-weight:800;font-size:26px;font-variant-numeric:lining-nums;text-rendering:geometricPrecision" fill="${r.tinta}">${esc(r.tituloPrincipal)} <tspan dy="${n(-desvio)}" style="font-family:${NEWSREADER};font-style:italic;font-weight:500;font-variation-settings:'opsz' 26" fill="${r.destaqueTexto}">${esc(r.complemento)}</tspan></text>`,
  );
  partes.push(texto(String(r.edicoes), { x: w / 2 - central(b) * 26, y: altura - 28, familia: BITTER, peso: 800, corpo: 26, cor: r.destaqueTexto, ancora: "end", girado: true }));
  return partes.join("");
}

// ---------- documento ----------

/**
 * As fontes dos livros (Bitter e Newsreader itálico, as do site, de @fontsource-variable), embutidas
 * em data: URIs: o SVG é aberto pelo Chrome de medir.mjs sem servidor.
 */
const requerer = createRequire(import.meta.url);
const woff2 = (pacote, arquivo) => `url(data:font/woff2;base64,${readFileSync(requerer.resolve(`@fontsource-variable/${pacote}/files/${arquivo}`)).toString("base64")}) format("woff2-variations")`;
const LATIM = "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";
const LATIM_EXT = "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF";
export const FONTES = `<style>
@font-face{font-family:"Bitter Variable";font-style:normal;font-weight:100 900;font-display:block;src:${woff2("bitter", "bitter-latin-wght-normal.woff2")};unicode-range:${LATIM}}
@font-face{font-family:"Bitter Variable";font-style:normal;font-weight:100 900;font-display:block;src:${woff2("bitter", "bitter-latin-ext-wght-normal.woff2")};unicode-range:${LATIM_EXT}}
@font-face{font-family:"Newsreader Variable";font-style:italic;font-weight:200 800;font-display:block;src:${woff2("newsreader", "newsreader-latin-opsz-italic.woff2")};unicode-range:${LATIM}}
@font-face{font-family:"Newsreader Variable";font-style:italic;font-weight:200 800;font-display:block;src:${woff2("newsreader", "newsreader-latin-ext-opsz-italic.woff2")};unicode-range:${LATIM_EXT}}
</style>`;

/** Um documento SVG inteiro, com as fontes, um título acessível e o miolo. */
export function documento({ largura, altura, titulo, descricao = "", miolo, defs = "" }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${n(largura)} ${n(altura)}" width="${n(largura)}" height="${n(altura)}" role="img" aria-labelledby="titulo descricao">
<title id="titulo">${esc(titulo)}</title>${descricao ? `<desc id="descricao">${esc(descricao)}</desc>` : ""}
${FONTES}
<defs>${defs}</defs>
${miolo}
</svg>
`;
}
