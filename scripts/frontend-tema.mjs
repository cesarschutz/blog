#!/usr/bin/env node
/** Troca de tema durante uma etapa real, com animações normais e redução dinâmica. */
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { opcoesDoChrome } from './chrome.mjs';
import { servir } from './frontend-servidor.mjs';
const pasta = '.astro/frontend-audit';
mkdirSync(pasta, { recursive: true });
const s = await servir('dist');
const b = await chromium.launch(opcoesDoChrome);
const resultados = [];
try {
  for (const largura of [375, 1440]) {
    const p = await b.newPage({ viewport: { width: largura, height: 900 }, reducedMotion: 'no-preference' });
    const erros = [];
    p.on('pageerror', e => erros.push(e.message));
    await p.addInitScript(() => {
      localStorage.setItem('cs-theme', 'light');
      localStorage.setItem('cs-prefs-quando', String(Date.now()));
    });
    await p.goto(s.url + '/posts/criptografia-em-repouso-e-em-transito/');
    const figura = p.locator('.figura-passos').first();
    await figura.locator('.passos-comecar').click();
    await figura.locator('.passos-proximo').click();
    const emCurso = await figura.evaluate(e => e.getAnimations({subtree: true}).filter(a => a.playState === 'running').length);
    assert.ok(emCurso > 0, 'Precisa trocar o tema enquanto a etapa ainda anima');
    await p.locator('[data-botao-tema]').click({ force: true });
    await p.waitForFunction(() => document.documentElement.dataset.theme === 'dark');
    await p.waitForFunction(() => !document.documentElement.classList.contains('trocando-tema'));
    await p.screenshot({ path: `${pasta}/tema-etapa-dark-${largura}.png` });
    await figura.locator('.passos-tudo').click();
    const medir = () => figura.evaluate(e => ({
      efeitos: e.getAnimations({subtree:true}).filter(a => a.constructor.name === 'Animation').length,
      ocultos: [...e.querySelectorAll('svg text')].filter(t => t.getBoundingClientRect().width > 0 && getComputedStyle(t).opacity === '0').length,
    }));
    const aposTroca = await medir();
    assert.equal(aposTroca.efeitos, 0);
    assert.equal(aposTroca.ocultos, 0);
    await figura.locator('.passos-comecar').click();
    await figura.locator('.passos-proximo').click();
    await p.locator('[data-botao-tema]').click({ force: true });
    await p.waitForFunction(() => document.documentElement.dataset.theme === 'light');
    await p.waitForFunction(() => !document.documentElement.classList.contains('trocando-tema'));
    await p.emulateMedia({ reducedMotion: 'reduce' });
    await p.waitForFunction(() => document.querySelector('.figura-passos').getAnimations({subtree:true}).filter(a => a.constructor.name === 'Animation').length === 0);
    await figura.locator('.passos-tudo').click();
    const aposReducao = await medir();
    assert.equal(aposReducao.ocultos, 0);
    await p.screenshot({ path: `${pasta}/tema-etapa-light-${largura}.png` });
    assert.deepEqual(erros, []);
    resultados.push({ largura, emCurso, aposTroca, aposReducao, erros });
    await p.close();
  }
  console.log(JSON.stringify(resultados, null, 2));
} finally {
  writeFileSync(`${pasta}/tema-etapa.json`, JSON.stringify(resultados, null, 2));
  await b.close();
  await s.close();
}
