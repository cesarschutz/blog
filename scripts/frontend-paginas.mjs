#!/usr/bin/env node
/** Verifica o build de produção e guarda capturas, console e medições de laboratório. */
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, readdirSync } from 'node:fs';
import assert from 'node:assert/strict';
const pasta = '.astro/frontend-audit';
mkdirSync(pasta, { recursive: true });
const servidor = spawn(process.execPath, ['node_modules/astro/bin/astro.mjs', 'preview', '--host', '127.0.0.1', '--port', '4323'], { stdio: 'inherit' });
let browser;
const resultados = [];
try {
  let pronto = false;
  for (let n = 0; n < 100; n++) {
    try { pronto = (await fetch('http://127.0.0.1:4323/')).ok; } catch {}
    if (pronto) break;
    await new Promise(ok => setTimeout(ok, 200));
  }
  assert.ok(pronto, 'Preview não iniciou');
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  const rotas = ['/', '/2/', '/archive/', '/categories/', '/categories/Seguran%C3%A7a/', '/series/', '/series/java/', '/tags/', '/tags/AWS/', '/404.html', '/posts/criptografia-em-repouso-e-em-transito/', '/posts/claude-code-do-claude-md-ao-mod/', '/posts/cobranca-duplicada-no-retry/'];
  for (const tema of ['light', 'dark']) for (const largura of [320, 375, 430, 699, 768, 1099, 1280, 1440, 1920]) {
    const page = await browser.newPage({ viewport: { width: largura, height: largura < 768 ? 850 : 1080 }, reducedMotion: 'reduce' });
    await page.addInitScript(tema => {
      localStorage.setItem('cs-theme', tema);
      localStorage.setItem('cs-prefs-quando', String(Date.now()));
    }, tema);
    const artigos = [375, 1280].includes(largura) ? readdirSync('dist/posts', { withFileTypes: true }).filter(e => e.isDirectory()).map(e => `/posts/${e.name}/`) : [];
    for (const rota of new Set([...rotas, ...artigos])) {
      const erros = [];
      const erro = e => erros.push(e.message);
      page.on('pageerror', erro);
      const resposta = await page.goto('http://127.0.0.1:4323' + rota);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(200);
      const medida = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        semAlt: [...document.querySelectorAll('img:not([alt])')].map(i => i.src),
        titulo: document.title,
        h1: document.querySelectorAll('h1').length,
      }));
      resultados.push({ rota, tema, largura, status: resposta.status(), ...medida, erros });
      if ([375, 1440].includes(largura)) await page.screenshot({ path: `${pasta}/${tema}-${largura}-${rota.replaceAll('/', '_')}.png`, fullPage: true });
      page.off('pageerror', erro);
    }
    // A mudança entre breakpoints também pode deixar medidas antigas em scripts.
    await page.setViewportSize({ width: largura + 17, height: 900 });
    await page.close();
  }
  console.log(JSON.stringify(resultados.filter(r => r.overflow > 1 || r.erros.length || r.semAlt.length), null, 2));
  // A matriz registra problemas antigos para revisão; não esconde os achados num resultado "Tudo ok".
  assert.ok(resultados.every(r => r.semAlt.length === 0), 'Imagens sem alt: veja paginas.json');
  assert.ok(resultados.every(r => r.erros.length === 0), 'Erros JavaScript: veja paginas.json');
  assert.ok(resultados.every(r => r.status < 400 || r.rota === '/404.html'), 'Página não abriu');
} finally {
  writeFileSync(`${pasta}/paginas.json`, JSON.stringify(resultados, null, 2));
  await browser?.close();
  servidor.kill();
}
