#!/usr/bin/env node
/**
 * Revisão dos desenhos de um post (D59): a etapa obrigatória depois de terminar qualquer desenho
 * (capa, figura, animação, lousa, print, ícones no texto), antes de mostrar ao Cesar. Abre o post no
 * dev, procura sozinho os bugs que já apareceram no blog e fotografa cada desenho em cada estado, para
 * a revisão a olho.
 *
 *   node scripts/desenho/revisar.mjs <slug> [--base http://127.0.0.1:4322] [--sem-fotos]
 *
 * O que ele acusa (sai 1 se achar problema; "aviso" não reprova, mas tem de ser olhado e explicado):
 *   - texto encostando em outro texto, ou cortado na borda do desenho (no fim, em cada passo ou estado
 *     da lousa e em vários instantes da animação), em 1280 e 390px;
 *   - texto pequeno demais na tela (menos de 10px), em 1280 e 390px;
 *   - figura com legenda: passando o mouse em cada cor, o que é de outra cor e não apaga, e o que é da
 *     cor e apaga (só a cor do mouse e a referência, `.referencia` e os eixos, ficam acesas, D59);
 *     animação que mexe em `opacity`; caixa pela metade (moldura sem tom com texto de cor, ou texto sem
 *     tom na caixa de uma cor); aviso para texto sem tom colado num texto com tom;
 *   - lousa: parte que atravessa a fronteira de um passo (o clique no passo mostraria meia parte; na
 *     comparação, o tempo é contínuo e pode), passo ou estado em que nada é desenhado, duas canetas no
 *     mesmo lugar durante o play;
 *   - capa viva: o detalhe (mexe-*) não se mexe com o mouse no topo, ou não volta ao lugar depois;
 *   - print sem texto alternativo, sem legenda ou sem link para a origem; ícone no texto sem link;
 *   - erro no console.
 * Fotos (em .astro/revisar/<slug>/): cada desenho em 1280 claro e escuro e em 390 claro; cada cor da
 * legenda com o mouse em cima; a lousa no fim de cada passo ou estado e em três instantes do play; a
 * animação em quatro instantes. OLHE todas antes de entregar: o script não vê cor errada, desenho que
 * não conta o que o texto diz, nem caneta na cor errada.
 */
import { mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import { opcoesDoChrome } from "../chrome.mjs";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith("--") && args[args.indexOf(a) - 1] !== "--base");
if (!slug) {
  console.error("Uso: node scripts/desenho/revisar.mjs <slug> [--base http://127.0.0.1:4322] [--sem-fotos]");
  process.exit(2);
}
const base = args.includes("--base") ? args[args.indexOf("--base") + 1] : "http://127.0.0.1:4322";
const comFotos = !args.includes("--sem-fotos");
const endereco = `${base}/posts/${encodeURIComponent(slug)}/`;
const pasta = join(raiz, ".astro", "revisar", slug);
rmSync(pasta, { recursive: true, force: true });
mkdirSync(pasta, { recursive: true });

const problemas = [];
const avisos = [];
const fotos = [];
const problema = (onde, texto) => problemas.push(`${onde}: ${texto}`);
const aviso = (onde, texto) => avisos.push(`${onde}: ${texto}`);

// ---------- funções que rodam na página ----------

/** Desenhos do corpo e a capa, com um nome para o relatório. */
function listarDesenhos() {
  const lista = [];
  const capa = document.querySelector("[data-desenhar-topo] svg");
  if (capa) lista.push({ tipo: "capa", indice: 0, seletor: "[data-desenhar-topo]" });
  document.querySelectorAll(".figura:not(.animacao)").forEach((_, i) => lista.push({ tipo: "figura", indice: i, seletor: ".figura:not(.animacao)" }));
  document.querySelectorAll(".animacao").forEach((_, i) => lista.push({ tipo: "animação", indice: i, seletor: ".animacao" }));
  // Os cartões dos controles em prova (D65): a animação com play num cartão.
  document.querySelectorAll('.cartao-proto[data-caso="animacao"]').forEach((_, i) =>
    lista.push({ tipo: "animação", indice: i, seletor: '.cartao-proto[data-caso="animacao"]' }),
  );
  document.querySelectorAll(".lousa-nova").forEach((_, i) => lista.push({ tipo: "lousa", indice: i, seletor: ".lousa-nova" }));
  return lista;
}

/** Textos que se encostam, textos cortados na borda e textos pequenos demais, num desenho. */
function medirTextos([seletor, indice, minimo]) {
  const caixa = document.querySelectorAll(seletor)[indice];
  const svg = caixa?.querySelector("svg");
  if (!svg) return { colisoes: [], cortados: [], pequenos: [] };
  // Até 700px a figura e a lousa rolam de lado: aí o limite é o próprio desenho (o resto aparece rolando).
  const pai = svg.parentElement;
  const rolando = pai.scrollWidth > pai.clientWidth + 1;
  const palco = rolando ? svg.getBoundingClientRect() : pai.getBoundingClientRect();
  const folga = rolando ? 8 : 1;
  const escala = svg.getBoundingClientRect().width / (svg.viewBox.baseVal?.width || svg.getBoundingClientRect().width);
  const visivel = (el) => {
    let o = 1;
    for (let e = el; e && e !== caixa; e = e.parentElement) {
      const s = getComputedStyle(e);
      if (s.display === "none" || s.visibility === "hidden") return 0;
      o *= Number(s.opacity);
    }
    return o;
  };
  const textos = [...svg.querySelectorAll("text")]
    .filter((t) => t.textContent.trim() && !t.closest(".marca, .caneta-desenho") && visivel(t) > 0.3)
    .map((t) => {
      const r = t.getBoundingClientRect();
      // Recorte da escrita (a lousa no meio de uma palavra): conta só o que já está à vista.
      const clip = t.getAttribute("clip-path");
      const corte = clip ? document.querySelector(clip.replace(/^url\(|\)$/g, ""))?.querySelector("rect")?.getBoundingClientRect() : null;
      const x1 = corte ? Math.max(r.left, corte.left) : r.left;
      const x2 = corte ? Math.min(r.right, corte.right) : r.right;
      return { texto: t.textContent.trim().slice(0, 40), x1, x2, y1: r.top, y2: r.bottom, tamanho: parseFloat(getComputedStyle(t).fontSize) * escala };
    })
    .filter((t) => t.x2 - t.x1 > 1);
  const colisoes = [];
  for (let i = 0; i < textos.length; i++) {
    for (let j = i + 1; j < textos.length; j++) {
      const a = textos[i];
      const b = textos[j];
      const largura = Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1);
      const altura = Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1);
      if (largura > 3 && altura > 0.35 * Math.min(a.y2 - a.y1, b.y2 - b.y1)) colisoes.push(`"${a.texto}" × "${b.texto}"`);
    }
  }
  const cortados = textos
    .filter((t) => t.x1 < palco.left - folga || t.x2 > palco.right + folga || t.y1 < palco.top - folga || t.y2 > palco.bottom + folga)
    .map((t) => `"${t.texto}"`);
  const pequenos = textos.filter((t) => t.tamanho < minimo).map((t) => `"${t.texto}" (${t.tamanho.toFixed(1)}px)`);
  return { colisoes, cortados, pequenos: [...new Set(pequenos)] };
}

/** As cores da legenda de cada figura. */
function coresDaLegenda([seletor, indice]) {
  const svg = document.querySelectorAll(seletor)[indice]?.querySelector("svg");
  if (!svg) return [];
  return [...svg.querySelectorAll(".legenda")].map((g) => [...g.classList].find((c) => c.startsWith("tom-"))).filter(Boolean);
}

/** Com o mouse numa cor: o que devia apagar e não apagou, e o que devia ficar e apagou. */
function conferirDestaque([seletor, indice, cor, antes]) {
  const caixa = document.querySelectorAll(seletor)[indice];
  const svg = caixa.querySelector("svg");
  const opacidade = (el) => {
    let o = 1;
    for (let e = el; e && e !== caixa; e = e.parentElement) {
      const s = getComputedStyle(e);
      if (s.display === "none" || s.visibility === "hidden") return 0;
      o *= Number(s.opacity);
    }
    return o;
  };
  // Os tons que valem para um elemento: os dele e os dos grupos em volta (o miolo de um logo conta
  // como o logo, que acompanha o grupo em que está).
  const tons = (el) => {
    const lista = [];
    let e = el.closest(".marca") ?? el;
    for (; e && e !== svg; e = e.parentElement) {
      const t = [...e.classList].filter((c) => c.startsWith("tom-"));
      if (t.length) lista.push(t);
    }
    return lista;
  };
  const folhas = [...svg.querySelectorAll("text, path, rect, circle, ellipse, line, polyline, polygon, g.marca")].filter(
    (el) => !el.closest(".legenda") && (el.matches("g.marca") || !el.closest(".marca")),
  );
  const nome = (el) => (el.matches("text") ? `"${el.textContent.trim().slice(0, 30)}"` : el.matches("g.marca") ? `logo ${[...el.classList].find((c) => c.startsWith("marca-"))?.slice(6)}` : `<${el.tagName}>`);
  const naoApagou = [];
  const apagou = [];
  // Fica acesa só a cor do mouse e a referência de todas as cores (.referencia e os eixos, D59); o que
  // não tem cor apaga junto com as outras cores.
  const referencia = (el) => Boolean(el.closest(".referencia")) || el.matches(".eixo, .grade, .valor-eixo, .titulo-eixo");
  folhas.forEach((el, i) => {
    if (antes[i] < 0.5) return; // já estava apagado (parte escondida de uma animação)
    const t = tons(el);
    const fica = referencia(el) || (t.length > 0 && t.every((grupo) => grupo.includes(cor)));
    const o = opacidade(el);
    if (fica && o < 0.5) apagou.push(nome(el));
    if (!fica && o > 0.5) naoApagou.push(nome(el));
  });
  return { naoApagou: [...new Set(naoApagou)], apagou: [...new Set(apagou)] };
}

function opacidadesAntes([seletor, indice]) {
  const caixa = document.querySelectorAll(seletor)[indice];
  const svg = caixa.querySelector("svg");
  const folhas = [...svg.querySelectorAll("text, path, rect, circle, ellipse, line, polyline, polygon, g.marca")].filter(
    (el) => !el.closest(".legenda") && (el.matches("g.marca") || !el.closest(".marca")),
  );
  return folhas.map((el) => {
    let o = 1;
    for (let e = el; e && e !== caixa; e = e.parentElement) o *= Number(getComputedStyle(e).opacity);
    return o;
  });
}

/** Animações CSS que mexem em opacity: o destaque da legenda (opacity) não consegue apagar quem pisca. */
function animacoesDeOpacidade([seletor, indice]) {
  const svg = document.querySelectorAll(seletor)[indice].querySelector("svg");
  const achados = [];
  for (const el of svg.querySelectorAll("*")) {
    for (const a of el.getAnimations?.() ?? []) {
      const quadros = a.effect?.getKeyframes?.() ?? [];
      if (quadros.some((q) => "opacity" in q)) achados.push(`<${el.tagName} class="${el.getAttribute("class")}"> (${a.animationName ?? "animação"})`);
    }
  }
  return [...new Set(achados)];
}

/** Texto sem tom colado num texto com tom (costuma ser do mesmo ator). */
function textosSemTom([seletor, indice]) {
  const svg = document.querySelectorAll(seletor)[indice].querySelector("svg");
  const temTom = (el) => Boolean(el.closest('[class*="tom-"]'));
  const textos = [...svg.querySelectorAll("text")].filter((t) => !t.closest(".legenda, .marca, .referencia") && t.textContent.trim());
  const caixas = textos.map((t) => ({ t, r: t.getBBox(), tom: temTom(t) }));
  const achados = [];
  for (const a of caixas) {
    if (a.tom) continue;
    const vizinhos = caixas.filter(
      (b) => b !== a && Math.abs(b.r.x - a.r.x) < 4 && Math.min(Math.abs(b.r.y - (a.r.y + a.r.height)), Math.abs(a.r.y - (b.r.y + b.r.height))) < a.r.height * 0.9,
    );
    if (vizinhos.length && vizinhos.every((b) => b.tom)) achados.push(`"${a.t.textContent.trim().slice(0, 30)}" (junto de "${vizinhos[0].t.textContent.trim().slice(0, 30)}")`);
  }
  // Caixas pela metade: a moldura sem tom com texto de uma cor dentro (a moldura fica acesa e o texto
  // apaga), e o texto sem tom dentro da caixa de uma cor (o texto fica aceso e a caixa apaga). E a
  // caixa inteira sem tom, que fica acesa em todo destaque: só vale se for a referência de todas as cores.
  const dentro = (r, x, y) => x >= r.x && x <= r.x + r.width && y >= r.y && y <= r.y + r.height;
  const centro = (c) => [c.r.x + c.r.width / 2, c.r.y + c.r.height / 2];
  const nomeDoTom = (el) => [...(el.closest('[class*="tom-"]')?.classList ?? [])].filter((c) => c.startsWith("tom-")).join(" ");
  for (const caixa of svg.querySelectorAll("rect.linha, rect.lavado, rect.papel")) {
    if (caixa.closest(".legenda, .marca")) continue;
    const r = caixa.getBBox();
    if (r.width < 60 || r.height < 40) continue;
    const deDentro = caixas.filter((c) => dentro(r, ...centro(c)));
    if (!deDentro.length) continue;
    if (caixa.closest(".referencia")) continue;
    if (!temTom(caixa)) {
      const comTom = deDentro.find((c) => c.tom);
      if (comTom) achados.push(`caixa sem tom com texto de cor dentro ("${comTom.t.textContent.trim().slice(0, 30)}", ${nomeDoTom(comTom.t)}): metade acende, metade apaga`);
    } else {
      const semTom = deDentro.find((c) => !c.tom);
      if (semTom) achados.push(`texto sem tom dentro da caixa ${nomeDoTom(caixa)} ("${semTom.t.textContent.trim().slice(0, 30)}"): o texto fica aceso quando a caixa apaga`);
    }
  }
  return [...new Set(achados)];
}

/** A linha do tempo de uma lousa: fronteiras de passo atravessadas e passos vazios. */
function tempoDaLousa([indice]) {
  const figura = document.querySelectorAll(".lousa-nova")[indice];
  // Nos cartões dos controles em prova (D65), as marcas vêm em data-marcas, com o caso em data-caso.
  const doCartao = figura.dataset.marcas ? JSON.parse(figura.dataset.marcas) : null;
  const passos = doCartao ? (figura.dataset.caso === "passos" ? doCartao : []) : JSON.parse(figura.dataset.passos || "[]");
  const estados = doCartao ? (figura.dataset.caso === "comparacao" ? doCartao : []) : JSON.parse(figura.dataset.estados || "[]");
  const marcas = (passos.length ? passos : estados).map((p) => p.de);
  const nomes = ["traco", "escrita", "revela", "aparece", "some", "esmaece", "desloca"];
  const partes = [];
  for (const el of figura.querySelectorAll("svg *")) {
    for (const n of nomes) {
      const v = el.dataset?.[n];
      if (!v) continue;
      const [a, b] = v.trim().split(/\s+/).map(Number);
      partes.push({ a, b, quem: el.matches("text") ? `"${el.textContent.trim().slice(0, 30)}"` : `<${el.tagName} data-${n}="${v}">` });
    }
  }
  const fim = Math.max(0, ...partes.map((p) => p.b));
  const fronteiras = marcas.slice(1).map((m) => m * fim);
  const atravessa = [];
  for (const p of partes) for (const [k, f] of fronteiras.entries()) if (p.a < f - 0.002 && p.b > f + 0.002) atravessa.push(`${p.quem} atravessa o início do ${passos.length ? "passo" : "estado"} ${k + 2}`);
  const vazios = [];
  marcas.forEach((m, i) => {
    const de = m * fim;
    const ate = i + 1 < marcas.length ? marcas[i + 1] * fim : fim + 1;
    if (!partes.some((p) => p.a >= de - 0.002 && p.a < ate - 0.002)) vazios.push(i + 1);
  });
  return { marcas, atravessa, vazios, passos: passos.length > 0 };
}

/** Durante o play, as canetas à vista: duas no mesmo lugar é bug (uma caneta escrevendo em dois lugares). */
function canetasJuntas([indice]) {
  const figura = document.querySelectorAll(".lousa-nova")[indice];
  const ativas = [...figura.querySelectorAll(".caneta-desenho.ativa")].map((g) => g.getBoundingClientRect());
  for (let i = 0; i < ativas.length; i++)
    for (let j = i + 1; j < ativas.length; j++) if (Math.hypot(ativas[i].left - ativas[j].left, ativas[i].top - ativas[j].top) < 24) return true;
  return false;
}

/** Prints e ícones no texto. */
function conferirTexto() {
  const achados = [];
  document.querySelectorAll(".evidencia").forEach((f, i) => {
    const img = f.querySelector("img");
    if (!img?.getAttribute("alt")?.trim()) achados.push(`print ${i + 1}: sem texto alternativo`);
    if (!f.querySelector("figcaption")?.textContent.trim()) achados.push(`print ${i + 1}: sem a linha do que é e de onde`);
    if (!f.querySelector("a[href^='http']")) achados.push(`print ${i + 1}: sem link para a origem`);
  });
  document.querySelectorAll(".marca-no-texto").forEach((m, i) => {
    const a = m.querySelector("a");
    if (!a?.href) achados.push(`ícone no texto ${i + 1}: sem link`);
    else if (a.target !== "_blank") achados.push(`ícone no texto ${i + 1}: o link não abre em outra aba`);
  });
  return achados;
}

// ---------- o roteiro ----------

const navegador = await chromium.launch(opcoesDoChrome);
const SEM_CABECALHO = ".cabecalho, .barra-leitura { visibility: hidden !important; }";

async function abrir(largura, tema) {
  const contexto = await navegador.newContext({
    viewport: { width: largura, height: 1500 },
    deviceScaleFactor: largura < 700 ? 2 : 1,
    colorScheme: tema,
    hasTouch: largura < 700,
    isMobile: largura < 700,
  });
  await contexto.addInitScript((t) => {
    try {
      localStorage.setItem("cs-theme", t);
      localStorage.setItem("cs-prefs-quando", String(Date.now()));
    } catch {}
  }, tema);
  const pagina = await contexto.newPage();
  const erros = [];
  pagina.on("console", (m) => m.type() === "error" && erros.push(m.text()));
  pagina.on("pageerror", (e) => erros.push(e.message));
  // O dev pode recarregar no meio (um arquivo salvo): tenta de novo, até 3 vezes.
  for (let tentativa = 1; ; tentativa++) {
    try {
      const resposta = await pagina.goto(endereco, { waitUntil: "domcontentloaded", timeout: 60000 });
      if (!resposta?.ok()) erros.push(`a página respondeu ${resposta?.status()} (erro no build do post: veja o dev)`);
      await pagina.evaluate((t) => (document.documentElement.dataset.theme = t), tema);
      await pagina.addStyleTag({ content: SEM_CABECALHO });
      await pagina.waitForTimeout(2500);
      break;
    } catch (erro) {
      if (tentativa >= 3 || !/Execution context was destroyed|Target closed|detached|navigation/i.test(String(erro))) throw erro;
      await pagina.waitForTimeout(1500);
    }
  }
  return { contexto, pagina, erros };
}

async function foto(pagina, d, sufixo) {
  if (!comFotos) return;
  const nome = `${d.tipo.normalize("NFD").replace(/[^a-z]/g, "")}-${d.indice + 1}-${sufixo}.png`;
  await pagina.locator(d.seletor).nth(d.indice).screenshot({ path: join(pasta, nome) });
  fotos.push(nome);
}

const rotulo = (d) => `${d.tipo} ${d.indice + 1}`;

async function conferirTextos(pagina, d, quando, minimo) {
  const r = await pagina.evaluate(medirTextos, [d.seletor, d.indice, minimo]);
  for (const c of r.colisoes) problema(`${rotulo(d)} (${quando})`, `textos encostados: ${c}`);
  for (const c of r.cortados) problema(`${rotulo(d)} (${quando})`, `texto cortado na borda: ${c}`);
  if (r.pequenos.length) problema(`${rotulo(d)} (${quando})`, `texto pequeno demais: ${r.pequenos.slice(0, 4).join(", ")}${r.pequenos.length > 4 ? "…" : ""}`);
}

/** A capa viva: o detalhe se mexe com o mouse no topo e, sem o mouse, volta ao lugar (sem pular). */
async function conferirCapaViva(pagina, alvo, d) {
  const DETALHE = '[data-desenhar-topo] [class*="mexe-"]';
  const tipos = await pagina.evaluate((s) => [...document.querySelectorAll(s)].map((e) => [...e.classList].find((c) => c.startsWith("mexe-"))), DETALHE);
  if (!tipos.length) return aviso("capa", "sem o detalhe da capa viva (classe mexe-*)");
  // O desenho do topo se desenha ao abrir (até ~7 s): espera ele terminar antes de passar o mouse.
  await pagina.waitForTimeout(6000);
  const mexendo = (s) =>
    [...document.querySelectorAll(s)].some((e) => {
      const c = getComputedStyle(e);
      const fora = (v) => v && v !== "none" && !/^0(deg|px)?( 0(px)?)?$/.test(v);
      return e.getAnimations({ subtree: true }).some((a) => a.playState === "running") || fora(c.rotate) || fora(c.translate);
    });
  await alvo.hover();
  await pagina.waitForTimeout(450);
  const mexeu = await pagina.evaluate(mexendo, DETALHE);
  await foto(pagina, d, "1280-claro-mouse");
  if (!mexeu) problema("capa", `o detalhe da capa viva (${tipos.join(", ")}) não se mexe com o mouse no topo`);
  await pagina.mouse.move(0, 0);
  await pagina.waitForTimeout(1800);
  if (await pagina.evaluate(mexendo, DETALHE)) problema("capa", "o detalhe da capa viva não voltou ao lugar 1,8 s depois de o mouse sair");
}

async function lousaNoInstante(pagina, d, valor) {
  // O cartão dos controles em prova (D65) expõe o relógio; a lousa de sempre, a faixa (input range).
  await pagina.locator(d.seletor).nth(d.indice).evaluate((el, v) => {
    if (el.relogio) return el.relogio.ir(v);
    const faixa = el.querySelector("input[type=range]");
    faixa.value = String(Math.round(v * 1000));
    faixa.dispatchEvent(new Event("input", { bubbles: true }));
  }, valor);
  await pagina.waitForTimeout(350);
}

/** O botão de tocar: o da lousa de sempre (.tocar) ou o dos cartões em prova (o que tem aria-pressed). */
const botaoDeTocar = (alvo) => alvo.locator(".tocar, button[aria-pressed]").first();

async function rodada(largura, tema) {
  const { contexto, pagina, erros } = await abrir(largura, tema);
  const tag = `${largura}-${tema === "dark" ? "escuro" : "claro"}`;
  const completa = largura === 1280 && tema === "light";
  const desenhos = await pagina.evaluate(listarDesenhos);
  for (const d of desenhos) {
    const alvo = pagina.locator(d.seletor).nth(d.indice);
    await alvo.scrollIntoViewIfNeeded();
    await pagina.mouse.move(0, 0);
    if (d.tipo === "animação") {
      for (const ms of [1200, 2400, 3600, 5200]) {
        await pagina.waitForTimeout(ms === 1200 ? 1200 : ms === 5200 ? 1600 : 1200);
        if (largura === 1280) await conferirTextos(pagina, d, `${tag}, ${(ms / 1000).toFixed(1)} s`, 10);
        if (tema === "light" && largura === 1280) await foto(pagina, d, `${tag}-${ms}ms`);
      }
      if (largura < 700) await conferirTextos(pagina, d, tag, 10);
      if (largura < 700 || tema === "dark") await foto(pagina, d, tag);
      continue;
    }
    if (d.tipo === "capa") {
      await foto(pagina, d, tag);
      if (completa) await conferirCapaViva(pagina, alvo, d);
      continue;
    }
    await pagina.waitForTimeout(500);
    await conferirTextos(pagina, d, tag, 10);
    await foto(pagina, d, tag);

    if (d.tipo === "figura" && completa) {
      const cores = await pagina.evaluate(coresDaLegenda, [d.seletor, d.indice]);
      if (cores.length) {
        for (const t of await pagina.evaluate(textosSemTom, [d.seletor, d.indice]))
          if (/metade acende|fica aceso quando a caixa apaga/.test(t)) problema(rotulo(d), t);
          else aviso(rotulo(d), `texto sem tom colado num texto com tom (apaga quando a cor do vizinho acende; se é do mesmo ator, vai no grupo dele): ${t}`);
        for (const a of await pagina.evaluate(animacoesDeOpacidade, [d.seletor, d.indice]))
          problema(rotulo(d), `animação que mexe em opacity numa figura com legenda (use fill-opacity ou stroke-opacity): ${a}`);
        const antes = await pagina.evaluate(opacidadesAntes, [d.seletor, d.indice]);
        for (const cor of cores) {
          const item = alvo.locator(`.legenda.${cor}`).first();
          await item.hover();
          // Mede duas vezes: uma animação que mexe em opacity só aparece em parte do ciclo.
          let pior = { naoApagou: [], apagou: [] };
          for (const espera of [450, 1300]) {
            await pagina.waitForTimeout(espera);
            const r = await pagina.evaluate(conferirDestaque, [d.seletor, d.indice, cor, antes]);
            pior = { naoApagou: [...new Set([...pior.naoApagou, ...r.naoApagou])], apagou: [...new Set([...pior.apagou, ...r.apagou])] };
          }
          if (pior.naoApagou.length) problema(`${rotulo(d)}, mouse em ${cor}`, `não apagou: ${pior.naoApagou.slice(0, 6).join(", ")}${pior.naoApagou.length > 6 ? "…" : ""}`);
          if (pior.apagou.length) problema(`${rotulo(d)}, mouse em ${cor}`, `apagou o que é da cor: ${pior.apagou.slice(0, 6).join(", ")}`);
          await foto(pagina, d, `${tag}-mouse-${cor.slice(4)}`);
          await pagina.mouse.move(0, 0);
          await pagina.waitForTimeout(400);
        }
      }
    }

    if (d.tipo === "lousa") {
      const tempo = await pagina.evaluate(tempoDaLousa, [d.indice]);
      if (completa) {
        // Nos passos, o clique leva ao fim do passo: parte que atravessa a fronteira apareceria pela metade.
        // Na comparação, o tempo é contínuo e não há clique por estado: atravessar é normal.
        if (tempo.passos) for (const a of tempo.atravessa) problema(rotulo(d), a);
        for (const v of tempo.vazios) problema(rotulo(d), `o ${tempo.passos ? "passo" : "estado"} ${v} não desenha nada`);
      }
      // O fim do passo, um pouco antes do seguinte (a faixa tem 1000 posições: 0,2495 arredondaria para 0,250).
      const fins = tempo.marcas.map((_, i) => (i + 1 < tempo.marcas.length ? tempo.marcas[i + 1] - 0.002 : 1));
      for (const [i, f] of fins.entries()) {
        await lousaNoInstante(pagina, d, f);
        await conferirTextos(pagina, d, `${tag}, fim do ${tempo.passos ? "passo" : "estado"} ${i + 1}`, 10);
        if (completa) await foto(pagina, d, `${tag}-ate-${i + 1}`);
      }
      if (completa) {
        // O play inteiro, de 80 em 80 ms: duas canetas no mesmo lugar é bug.
        const duracao = Number(await alvo.getAttribute("data-duracao")) * 1000;
        await botaoDeTocar(alvo).click();
        let juntas = 0;
        const fotosDoPlay = [0.25, 0.5, 0.75].map((f) => Math.round((f * duracao) / 80));
        for (let k = 0; k * 80 < duracao; k++) {
          await pagina.waitForTimeout(80);
          if (await pagina.evaluate(canetasJuntas, [d.indice])) juntas++;
          if (fotosDoPlay.includes(k)) await foto(pagina, d, `${tag}-play-${Math.round((k * 80) / 100) / 10}s`);
        }
        if (juntas > 1) problema(rotulo(d), `duas canetas no mesmo lugar em ${juntas} quadros do play`);
        await botaoDeTocar(alvo).click();
        await lousaNoInstante(pagina, d, 1);
      }
    }
  }
  if (completa) for (const a of await pagina.evaluate(conferirTexto)) problema("texto", a);
  for (const e of new Set(erros)) problema(`console (${tag})`, e);
  await contexto.close();
  return desenhos.length;
}

try {
  const quantos = await rodada(1280, "light");
  await rodada(1280, "dark");
  await rodada(390, "light");
  console.log(`\nRevisão de ${endereco}: ${quantos} desenho(s).`);
  if (comFotos) console.log(`Fotos (${fotos.length}) em ${pasta.slice(raiz.length + 1)}/: olhe todas antes de entregar.`);
  if (avisos.length) console.log(`\nAvisos (olhe e explique):\n- ${avisos.join("\n- ")}`);
  if (problemas.length) {
    console.log(`\nProblemas:\n- ${problemas.join("\n- ")}`);
    process.exitCode = 1;
  } else console.log("\n✓ Nenhum problema automático.");
} finally {
  await navegador.close();
}
