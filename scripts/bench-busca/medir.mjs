#!/usr/bin/env node
/**
 * Mede as variantes da busca (D2) no Chrome do sistema via playwright-core, com cache frio (um
 * contexto novo por amostra): celular simulado (CPU 4× mais lenta na página e rede "Slow 4G" imposta
 * pelo servidor: 150 ms de latência, 1,6 Mbps de banda compartilhada) e desktop sem limitação.
 *
 * Limites conhecidos, registrados na D2: o Chrome só limita a CPU da página, não a de Web Workers
 * (o Pagefind busca num worker, então no celular ele roda parte do trabalho em velocidade cheia).
 *
 * Cenários: entrar por /?q= (tempo, bytes e requisições até o 1º resultado, memória da página); abrir
 * e digitar em ritmo humano (espera depois da última tecla); latência por tecla com o índice carregado;
 * visita repetida com revalidação; bytes quando a busca nunca abre.
 * Uso: node scripts/bench-busca/medir.mjs [tamanhos]   (depois de construir.mjs)
 * Mede o Pagefind; o índice próprio (motor A) saiu depois da D2 e os números dele ficam em
 * resultados/2026-09-24.json. Os resultados novos vão para resultados/<data>-pagefind.json.
 */
import { chromium } from "playwright-core";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { servir } from "./servidor.mjs";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const bench = join(raiz, "bench");
const tamanhos = (process.argv[2] ?? "26,250,500,1000").split(",").map(Number);
const motores = ["pagefind"];
const CONSULTAS = ["idempotencia", "virtual threads", "#Kubernetes", "chave de idempotência", "JEP 444"];
const CONDICOES = [
  { nome: "celular", cpu: 4, rede: { latenciaMs: 150, bytesPorSegundo: 200_000 }, repeticoes: 3 },
  { nome: "desktop", cpu: 1, rede: {}, repeticoes: 2 },
];
const DA_BUSCA = /\/pagefind\/|\/_astro\/pagefind\.[^/]*\.js/;

const ordenar = (v) => [...v].sort((a, b) => a - b);
const mediana = (v) => (v.length ? ordenar(v)[Math.floor((v.length - 1) / 2)] : NaN);
const p90 = (v) => (v.length ? ordenar(v)[Math.min(v.length - 1, Math.ceil(v.length * 0.9) - 1)] : NaN);

async function abrirPagina(navegador, cond, contextoExistente) {
  const contexto = contextoExistente ?? (await navegador.newContext({ viewport: { width: 390, height: 844 } }));
  const pagina = await contexto.newPage();
  const cdp = await contexto.newCDPSession(pagina);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: cond.cpu });
  // Conta tudo o que a busca baixa, inclusive o que o worker do Pagefind pede.
  const terminadas = [];
  let revalidadas = 0;
  pagina.on("requestfinished", (r) => DA_BUSCA.test(r.url()) && terminadas.push(r));
  pagina.on("response", (r) => DA_BUSCA.test(r.url()) && r.status() === 304 && revalidadas++);
  const trafego = async () => {
    const tamanhos = await Promise.all(terminadas.map((r) => r.sizes().catch(() => ({ responseBodySize: 0, responseHeadersSize: 0 }))));
    return { bytes: tamanhos.reduce((s, t) => s + t.responseBodySize + t.responseHeadersSize, 0), requisicoes: terminadas.length, revalidadas };
  };
  const zerar = () => {
    terminadas.length = 0;
    revalidadas = 0;
  };
  return { contexto, pagina, cdp, trafego, zerar };
}

const esperarResultado = (pagina) =>
  pagina.waitForFunction(() => performance.getEntriesByName("busca:resultado").length > 0, null, { timeout: 180000 });
const tempoAteResultado = (pagina) =>
  pagina.evaluate(() => performance.getEntriesByName("busca:resultado")[0].startTime - performance.getEntriesByName("busca:aberta")[0].startTime);

async function entrarPorQ(navegador, base, consulta, cond) {
  const { contexto, pagina, cdp, trafego } = await abrirPagina(navegador, cond);
  await pagina.goto(`${base}/?q=${encodeURIComponent(consulta)}`);
  await esperarResultado(pagina);
  const ms = await tempoAteResultado(pagina);
  const t = await trafego();
  const heap = (await cdp.send("Runtime.getHeapUsage")).usedSize;
  await contexto.close();
  return { ms, bytes: t.bytes, requisicoes: t.requisicoes, heap };
}

async function digitando(navegador, base, consulta, cond) {
  const { contexto, pagina } = await abrirPagina(navegador, cond);
  await pagina.goto(`${base}/`, { waitUntil: "load" });
  await pagina.evaluate(() => {
    window.__eventos = [];
    addEventListener("busca:resultado", (e) => window.__eventos.push({ c: e.detail.consulta, ms: e.detail.ms, t: performance.now() }));
    document.querySelector("[data-busca-campo]").addEventListener("input", () => (window.__ultima = performance.now()));
  });
  await pagina.keyboard.press("/");
  await pagina.keyboard.type(consulta, { delay: 90 });
  await pagina.waitForFunction((q) => window.__eventos.some((e) => e.c === q), consulta, { timeout: 180000 });
  const aposDigitar = await pagina.evaluate((q) => Math.max(0, window.__eventos.find((e) => e.c === q).t - window.__ultima), consulta);
  // Segunda digitação, com o índice já carregado: latência de cada tecla.
  await pagina.evaluate(() => (window.__eventos = []));
  await pagina.fill("[data-busca-campo]", "");
  await pagina.keyboard.type(consulta, { delay: 90 });
  await pagina.waitForFunction((q) => window.__eventos.some((e) => e.c === q), consulta, { timeout: 180000 });
  const porTecla = await pagina.evaluate(() => window.__eventos.map((e) => e.ms));
  await contexto.close();
  return { aposDigitar, porTecla };
}

async function visitaRepetida(navegador, base, cond) {
  const contexto = await navegador.newContext({ viewport: { width: 390, height: 844 } });
  const primeira = await abrirPagina(navegador, cond, contexto);
  await primeira.pagina.goto(`${base}/?q=idempotencia`);
  await esperarResultado(primeira.pagina);
  const segunda = await abrirPagina(navegador, cond, contexto);
  await segunda.pagina.goto(`${base}/archive/?q=threads`);
  await esperarResultado(segunda.pagina);
  const ms = await tempoAteResultado(segunda.pagina);
  const t = await segunda.trafego();
  await contexto.close();
  return { ms, ...t };
}

async function semAbrir(navegador, base) {
  const { contexto, pagina, trafego } = await abrirPagina(navegador, CONDICOES[1]);
  await pagina.goto(`${base}/`, { waitUntil: "load" });
  await pagina.waitForTimeout(1500);
  const { bytes } = await trafego();
  await contexto.close();
  return bytes;
}

const navegador = await chromium.launch({ channel: "chrome", headless: true });
const construcao = existsSync(join(bench, "construcao.json")) ? JSON.parse(readFileSync(join(bench, "construcao.json"), "utf8")) : [];
const resultados = {
  data: new Date().toISOString(),
  observacao: "CPU limitada só na página: o Chrome recusa limitar Web Workers (usado pelo Pagefind).",
  variantes: [],
};

let porta = 4600;
for (const total of tamanhos) {
  for (const motor of motores) {
    const pasta = join(bench, `dist-${motor}-${total}`);
    if (!existsSync(pasta)) continue;
    const variante = { total, motor, construcao: construcao.find((c) => c.total === total && c.motor === motor), condicoes: {} };
    for (const cond of CONDICOES) {
      const servidor = await servir(pasta, ++porta, cond.rede);
      const revalidando = await servir(pasta, ++porta, { ...cond.rede, maxAge: 0 });
      const base = `http://127.0.0.1:${servidor.address().port}`;
      if (cond.nome === "desktop") variante.bytesSemAbrir = await semAbrir(navegador, base);
      const q = [];
      const d = [];
      for (let r = 0; r < cond.repeticoes; r++) {
        for (const consulta of CONSULTAS) {
          q.push(await entrarPorQ(navegador, base, consulta, cond));
          d.push(await digitando(navegador, base, consulta, cond));
        }
      }
      const repetida = await visitaRepetida(navegador, `http://127.0.0.1:${revalidando.address().port}`, cond);
      const teclas = d.flatMap((x) => x.porTecla);
      variante.condicoes[cond.nome] = {
        primeiroResultadoMs: { mediana: mediana(q.map((x) => x.ms)), p90: p90(q.map((x) => x.ms)) },
        bytesAtePrimeiro: mediana(q.map((x) => x.bytes)),
        requisicoesAtePrimeiro: mediana(q.map((x) => x.requisicoes)),
        heapMB: mediana(q.map((x) => x.heap)) / 1048576,
        aposDigitarMs: { mediana: mediana(d.map((x) => x.aposDigitar)), p90: p90(d.map((x) => x.aposDigitar)) },
        porTeclaMs: { mediana: mediana(teclas), p90: p90(teclas) },
        visitaRepetida: repetida,
      };
      console.log(`${motor} ${total} ${cond.nome}:`, JSON.stringify(variante.condicoes[cond.nome]));
      servidor.close();
      revalidando.close();
    }
    resultados.variantes.push(variante);
  }
}
await navegador.close();

mkdirSync(join(raiz, "scripts/bench-busca/resultados"), { recursive: true });
const sufixo = "-pagefind";
const arquivo = join(raiz, "scripts/bench-busca/resultados", `${new Date().toISOString().slice(0, 10)}${sufixo}.json`);
writeFileSync(arquivo, JSON.stringify(resultados, null, 2));
console.log(`\nResultados em ${arquivo}`);
process.exit(0);
