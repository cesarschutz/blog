#!/usr/bin/env node
/** Regressões do motor real de FiguraPassos; não precisa de servidor nem de build. */
import assert from 'node:assert/strict';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright-core';
import ts from 'typescript';

const pasta = '.astro/frontend-audit';
mkdirSync(pasta, { recursive: true });
const css = readFileSync('src/styles/figura-passos.css', 'utf8');
const atual = readFileSync('src/scripts/figura-passos.ts', 'utf8');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const resultados = {};

async function conferir(fonte, nome) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const erros = [];
  page.on('pageerror', e => erros.push(e.message));
  await page.setContent(`<style>${css}</style>
    <figure class="figura-passos" data-total="3" data-fim="segmentos">
      <div class="figura-palco" style="width:600px"><svg width="600" height="160" viewBox="0 0 600 160">
        ${[1, 2, 3].map(n => `<g data-passo="${n}"><rect x="${n * 120}" y="20" width="80" height="80"/><text class="etapa-3" x="${n * 120}" y="120">Etapa ${n}</text></g>`).join('')}
      </svg></div>
      <div class="passos-barra" hidden>
        <button class="passos-comecar">Passo a passo</button>
        <button class="passos-anterior">Anterior</button>
        <p class="passos-contador"><b>1</b></p>
        <button class="passos-proximo"><span>Próximo</span></button>
        <button class="passos-tudo">Ver tudo</button>
      </div>
      <ol class="passos-lista">${[1, 2, 3].map(n => `<li><span class="passos-texto">Passo ${n}</span></li>`).join('')}</ol>
    </figure>`);
  await page.evaluate(() => {
    window.leiturasSVG = 0;
    const original = SVGElement.prototype.getBoundingClientRect;
    SVGElement.prototype.getBoundingClientRect = function (...args) {
      window.leiturasSVG++;
      return original.apply(this, args);
    };
  });
  const js = ts.transpileModule(fonte, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
  await page.addScriptTag({ type: 'module', content: js + '\nmontarFigurasEmPassos();' });
  await page.waitForSelector('[data-pronto]');
  await page.locator('.passos-comecar').click();
  const leituras = await page.evaluate(() => window.leiturasSVG);
  await page.locator('.passos-tudo').click();
  const tudo = await page.evaluate(() => ({
    atrasadas: document.getAnimations().filter(a => a.constructor.name === 'Animation').length,
    opacidade: getComputedStyle(document.querySelector('.etapa-3')).opacity,
  }));
  await page.screenshot({ path: `${pasta}/${nome}-ver-tudo.png` });
  await page.locator('.passos-comecar').click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForTimeout(50);
  const reduzido = await page.evaluate(() => document.getAnimations().filter(a => a.constructor.name === 'Animation').length);
  await page.locator('.passos-proximo').click();
  await page.locator('.passos-anterior').click();
  const focoAnterior = await page.evaluate(() => document.activeElement.className);
  await page.locator('.passos-proximo').click();
  await page.locator('.passos-tudo').focus();
  await page.locator('.passos-tudo').press('ArrowRight');
  const focoFim = await page.evaluate(() => document.activeElement.className);
  await page.close();
  return { leituras, tudo, reduzido, focoAnterior, focoFim, erros };
}

try {
  // A comparação usa a main local, sem rede. Baseline só é registrada, não imposta à versão corrigida.
  const anterior = execFileSync('git', ['show', 'origin/main:src/scripts/figura-passos.ts'], { encoding: 'utf8' });
  resultados.antes = await conferir(anterior, 'antes');
  resultados.depois = await conferir(atual, 'depois');
  const r = resultados.depois;
  assert.equal(r.tudo.atrasadas, 0, 'Ver tudo precisa cancelar as animações atrasadas');
  assert.equal(Number(r.tudo.opacidade), 1, 'Texto não pode continuar invisível');
  assert.equal(r.reduzido, 0, 'Mudar para movimento reduzido precisa cancelar WAAPI');
  assert.match(r.focoAnterior, /passos-proximo/, 'Voltar ao passo 1 não pode deixar foco no botão desabilitado');
  assert.match(r.focoFim, /passos-proximo/, 'Chegar ao último passo não pode deixar foco em Ver tudo escondido');
  assert.ok(r.leituras < resultados.antes.leituras, 'As trocas imediatas precisam agrupar as leituras de layout');
  assert.deepEqual(r.erros, []);
  console.log(JSON.stringify(resultados, null, 2));
} finally {
  writeFileSync(`${pasta}/regressoes.json`, JSON.stringify(resultados, null, 2));
  await browser.close();
}
