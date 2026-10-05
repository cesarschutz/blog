/**
 * Mede as capas no dev do site (D57), para as fotos dos livros saírem iguais ao site: a linha de
 * base, o início e o estilo de cada linha de texto das capas (/amostra/livros/, na referência de
 * 480 × 720), as caixas da capa da série, os desenhos como o site serve e, de /livros/<id>.json, o
 * ícone de cada lombada e os artigos de cada livro. Copiado de
 * docs/historico/livros-realistas/ferramentas/medir.mjs.
 */
import { readFileSync } from "node:fs";

const dados = JSON.parse(readFileSync(new URL("../../src/livros/livros.json", import.meta.url), "utf8"));

/** Abre /amostra/livros/ no `endereco` (o dev no ar) e devolve as medidas para iniciarBase(). */
export async function medir(navegador, endereco) {
  const pagina = await navegador.newPage({ viewport: { width: 1400, height: 1000 }, deviceScaleFactor: 1 });
  const resposta = await pagina.goto(`${endereco}/amostra/livros/`, { waitUntil: "load" });
  if (!resposta?.ok()) throw new Error(`${endereco}/amostra/livros/: ${resposta?.status()} (o dev está no ar?)`);
  await pagina.evaluate(() => document.fonts.ready);
  await pagina.waitForTimeout(300);

  const capas = await pagina.evaluate(() => {
    const estilo = (el) => {
      const s = getComputedStyle(el);
      return {
        familia: s.fontFamily,
        peso: s.fontWeight,
        estilo: s.fontStyle,
        corpo: parseFloat(s.fontSize),
        espacamento: s.letterSpacing,
        variacao: s.fontVariationSettings,
        numeros: s.fontVariantNumeric,
        cor: s.color,
        opacidade: Number(s.opacity),
      };
    };
    /** As linhas de texto de um elemento: o texto, o início (x) e a linha de base (y), na unidade da capa. */
    function linhas(el, origem, k) {
      const nos = [];
      const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      while (w.nextNode()) if (w.currentNode.nodeValue.length) nos.push(w.currentNode);
      const chars = [];
      for (const n of nos) {
        for (let i = 0; i < n.nodeValue.length; i++) {
          const r = document.createRange();
          r.setStart(n, i);
          r.setEnd(n, i + 1);
          const b = r.getClientRects()[0];
          chars.push({ n, i, c: n.nodeValue[i], top: b ? b.top : null, el: n.parentElement });
        }
      }
      const grupos = [];
      for (const ch of chars) {
        const g = grupos[grupos.length - 1];
        if (ch.top === null || /\s/.test(ch.c)) {
          if (g) g.push(ch);
          continue;
        }
        const ref = g?.find((x) => x.top !== null && !/\s/.test(x.c));
        if (ref && Math.abs(ref.top - ch.top) < 3) g.push(ch);
        else grupos.push([ch]);
      }
      // Sem mexer no DOM: a caixa do caractere vai da linha de base menos a ascendente até a linha de
      // base mais a descendente da fonte (as mesmas métricas que o canvas devolve).
      const tela = document.createElement("canvas").getContext("2d");
      const descendente = (el) => {
        const s = getComputedStyle(el);
        tela.font = `${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;
        return tela.measureText("Hg").fontBoundingBoxDescent;
      };
      return grupos.map((g) => {
        const p = g.find((x) => !/\s/.test(x.c));
        const r = document.createRange();
        r.setStart(p.n, p.i);
        r.setEnd(p.n, p.i + 1);
        const b = r.getClientRects()[0];
        return {
          texto: g
            .map((x) => x.c)
            .join("")
            .replace(/\s+/g, " ")
            .trim(),
          x: +((b.left - origem.left) / k).toFixed(2),
          y: +((b.bottom - descendente(p.el) - origem.top) / k).toFixed(2),
          ...estilo(p.el),
        };
      });
    }
    const caixa = (el, origem, k) => {
      const r = el.getBoundingClientRect();
      return {
        x: +((r.left - origem.left) / k).toFixed(2),
        y: +((r.top - origem.top) / k).toFixed(2),
        w: +(r.width / k).toFixed(2),
        h: +(r.height / k).toFixed(2),
      };
    };

    return [...document.querySelectorAll(".capas > li")].map((li) => {
      const face = li.querySelector(".capa-face");
      const origem = face.getBoundingClientRect();
      const k = origem.width / 480;
      const serie = !!li.querySelector(".capa.de-serie");
      const cores = {};
      for (const v of [
        "--livro-cor",
        "--livro-tinta",
        "--livro-destaque",
        "--livro-papel",
        "--livro-tinta-papel",
        "--livro-cor-texto",
        "--livro-destaque-texto",
      ]) {
        cores[v.replace("--livro-", "")] = li.style.getPropertyValue(v).trim();
      }
      const texto = (sel) => {
        const el = face.querySelector(sel);
        return el ? linhas(el, origem, k) : null;
      };
      if (!serie) {
        const topo = face.querySelectorAll(".capa-topo span");
        return {
          serie,
          k,
          cores,
          textos: {
            volume: linhas(topo[0], origem, k),
            autor: linhas(topo[1], origem, k),
            titulo: texto(".capa-titulo"),
            frase: texto(".capa-frase"),
            assinatura: texto(".capa-assinatura"),
          },
          topoOpacidade: Number(getComputedStyle(face.querySelector(".capa-topo")).opacity),
          desenho: face.querySelector(".capa-desenho svg").innerHTML,
        };
      }
      const dados = [...face.querySelectorAll(".revista-dados span")].map((s) => linhas(s, origem, k));
      const edicoes = [...face.querySelectorAll(".revista-edicoes li")].map((li2) => {
        const em = li2.querySelector("em");
        const nome = li2.firstChild;
        // O nome é o texto antes do <em>: mede num span temporário.
        const s = document.createElement("span");
        li2.insertBefore(s, nome);
        s.appendChild(nome);
        return { caixa: caixa(li2, origem, k), atual: li2.classList.contains("atual"), nome: linhas(s, origem, k), nota: linhas(em, origem, k) };
      });
      const tarja = face.querySelector(".revista-tarja");
      const seta = face.querySelector(".revista-seta");
      const emblema = face.querySelector(".revista-emblema");
      return {
        serie,
        k,
        cores,
        textos: {
          titulo: texto(".revista-titulo"),
          complemento: texto(".revista-complemento"),
          dados,
          rotulo: texto(".revista-rotulo"),
          numero: texto(".revista-numero"),
          tarjaLinha: linhas(tarja.querySelector("p > span"), origem, k),
          tarjaTitulo: linhas(tarja.querySelector("p > strong"), origem, k),
          subtitulo: texto(".revista-subtitulo"),
          assinatura: texto(".capa-assinatura"),
        },
        edicoes,
        caixas: {
          dados: caixa(face.querySelector(".revista-dados"), origem, k),
          tarja: caixa(tarja, origem, k),
          seta: caixa(seta, origem, k),
          emblema: caixa(emblema, origem, k),
        },
        setaSvg: seta.querySelector("svg").innerHTML,
        emblema: emblema.querySelector("svg").outerHTML,
      };
    });
  });

  // A lombada colada à capa (Arquitetura, --u = 1px): onde fica a linha de base do texto vertical em
  // relação ao centro da coluna, e onde começa o título. Na vertical, a caixa do caractere vai da linha de
  // base menos a descendente (à esquerda) até a linha de base mais a ascendente (à direita).
  const lombada = await pagina.evaluate(() => {
    const face = document.querySelector(".colada .lombada-visual");
    const o = face.getBoundingClientRect();
    const tela = document.createElement("canvas").getContext("2d");
    const medir = (el) => {
      const s = getComputedStyle(el);
      tela.font = `${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;
      const m = tela.measureText("Hg");
      const nos = [];
      const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      while (w.nextNode()) nos.push(w.currentNode);
      const colunas = [];
      for (const n of nos)
        for (let i = 0; i < n.nodeValue.length; i++) {
          if (/\s/.test(n.nodeValue[i])) continue;
          const r = document.createRange();
          r.setStart(n, i);
          r.setEnd(n, i + 1);
          const b = r.getClientRects()[0];
          if (!b) continue;
          const c = colunas.find((x) => Math.abs(x.left - b.left) < 3);
          if (c) c.texto += n.nodeValue[i];
          else colunas.push({ left: b.left, right: b.right, top: b.top, texto: n.nodeValue[i] });
        }
      const el2 = el.getBoundingClientRect();
      return {
        caixa: { x: el2.left - o.left, y: el2.top - o.top, w: el2.width, h: el2.height },
        ascendente: m.fontBoundingBoxAscent,
        descendente: m.fontBoundingBoxDescent,
        colunas: colunas.map((c) => ({
          texto: c.texto,
          base: c.left + m.fontBoundingBoxDescent - o.left,
          inicio: c.top - o.top,
          esquerda: c.left - o.left,
          direita: c.right - o.left,
        })),
      };
    };
    return {
      largura: o.width,
      altura: o.height,
      papelH: parseFloat(getComputedStyle(face).getPropertyValue("--papel-h")) || null,
      titulo: medir(face.querySelector(".titulo-lombada")),
      numero: medir(face.querySelector(".numero-lombada")),
      icone: (() => {
        const r = face.querySelector(".icone-lombada").getBoundingClientRect();
        return { x: r.left - o.left, y: r.top - o.top, w: r.width, h: r.height };
      })(),
    };
  });

  // Métricas verticais das fontes (por em), para pôr a linha de base do texto vertical das lombadas.
  const metricas = await pagina.evaluate(() => {
    const tela = document.createElement("canvas").getContext("2d");
    const m = (fonte) => {
      tela.font = fonte;
      const r = tela.measureText("Hg");
      return { ascendente: r.fontBoundingBoxAscent / 1000, descendente: r.fontBoundingBoxDescent / 1000 };
    };
    return { bitter: m('normal 800 1000px "Bitter Variable"'), newsreaderItalico: m('italic 500 1000px "Newsreader Variable"') };
  });

  // Ícones das lombadas e artigos de cada livro, de /livros/<slug>.json (o ícone vem sem giro, com o viewBox justo).
  const ids = [...dados.livros.map((l) => l.slug), "serie-java"];
  const livros = {};
  for (const id of ids) {
    const r = await fetch(`${endereco}/livros/${id}.json`);
    if (!r.ok) throw new Error(`/livros/${id}.json: ${r.status}`);
    livros[id] = await r.json();
  }

  await pagina.close();
  return { metricas, capas, lombada, livros };
}
