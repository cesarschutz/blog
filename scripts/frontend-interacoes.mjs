#!/usr/bin/env node
/** Estados reais do build: cliques concorrentes, busca, menu e movimento reduzido durante a queda. */
import assert from "node:assert/strict";
import { chromium } from "playwright-core";
import { opcoesDoChrome } from "./chrome.mjs";
import { servir } from "./frontend-servidor.mjs";
import { mkdirSync, writeFileSync } from "node:fs";
const pasta = ".astro/frontend-audit";
mkdirSync(pasta, { recursive: true });
const s = await servir(process.env.FRONTEND_DIST ?? "dist");
const b = await chromium.launch(opcoesDoChrome);
const resultados = [];
try {
  for (const largura of [375, 768, 1440]) {
    const page = await b.newPage({
      viewport: { width: largura, height: 900 },
      reducedMotion: "no-preference",
    });
    const erros = [];
    page.on("pageerror", (e) => erros.push(e.message));
    await page.goto(s.url + "/tags/");
    await page.waitForTimeout(8000);
    await page.locator('a[data-gaveta-letra="A"]').scrollIntoViewIfNeeded();
    await page.evaluate(async () => {
      for (const l of ["A", "B", "todas"]) {
        document.querySelector(`a[data-gaveta-letra="${l}"]`).click();
        await new Promise((ok) => setTimeout(ok, 30));
      }
    });
    await page.waitForTimeout(1200);
    const tags = await page.evaluate(() => ({
      presas: [
        ...document.querySelector("[data-fichas-caem]").children,
      ].flatMap((e) =>
        e
          .getAnimations()
          .filter((a) => a.playState === "finished")
          .map(() => e.textContent.slice(0, 30)),
      ),
      atual: document
        .querySelector('a[data-gaveta-letra="todas"]')
        .getAttribute("aria-current"),
    }));
    assert.deepEqual(
      tags.presas,
      [],
      "Troca rápida não pode manter opacidade zero por animação encerrada",
    );
    assert.equal(tags.atual, "true");
    await page.evaluate(() =>
      document.querySelector('a[data-gaveta-letra="A"]').click(),
    );
    await page.waitForTimeout(35);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForTimeout(100);
    const reduzido = await page.evaluate(
      () =>
        [...document.querySelector("[data-fichas-caem]").children].flatMap(
          (e) =>
            e.getAnimations().filter((a) => a.constructor.name === "Animation"),
        ).length,
    );
    assert.equal(reduzido, 0);
    await page.screenshot({ path: `${pasta}/tags-interacao-${largura}.png` });
    await page.goto(s.url + "/archive/");
    await page.evaluate(() => document.fonts.ready);
    await page.locator(".modo[data-pronto]").waitFor({ state: "visible" });
    await page.evaluate(() => {
      window.modoNormalAvisado = false;
      matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", e => { window.modoNormalAvisado = !e.matches; }, { once: true });
    });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.waitForFunction(() => window.modoNormalAvisado);
    await page.evaluate(() =>
      document.querySelector('.modo button[data-valor="list"]').click(),
    );
    await page.evaluate(() => {
      window.modoReduzidoAvisado = false;
      matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", e => { window.modoReduzidoAvisado = e.matches; }, { once: true });
    });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForFunction(() => window.modoReduzidoAvisado);
    assert.equal(
      await page.evaluate(() => document.documentElement.dataset.postView),
      "list",
    );
    assert.equal(
      await page.evaluate(
        () =>
          [...document.querySelectorAll(".lista-modo, .cartoes-modo")].flatMap(
            (e) =>
              e
                .getAnimations()
                .filter((a) => a.constructor.name === "Animation"),
          ).length,
      ),
      0,
    );
    await page.locator('.modo button[data-valor="list"]').click();
    assert.equal(
      await page.evaluate(
        () => document.documentElement.dataset.postView ?? "list",
      ),
      "list",
    );
    await page.locator('.modo button[data-valor="cards"]').click();
    assert.equal(
      await page.evaluate(() => document.documentElement.dataset.postView),
      "cards",
    );
    // Começa em Lista num documento novo: os cards inseridos depois também precisam do hover.
    await page.evaluate(() => localStorage.setItem("cs-post-view", "list"));
    await page.goto(s.url + "/archive/");
    await page.locator(".modo[data-pronto]").waitFor({ state: "visible" });
    await page.locator('.modo button[data-valor="cards"]').click();
    await page.evaluate(() => dispatchEvent(new Event("cartoes:prontos")));
    const cdp = await page.context().newCDPSession(page);
    const objeto = await cdp.send("Runtime.evaluate", { expression: 'document.querySelector(".cartao:has(.mexe-balanca, .mexe-pulsa, .mexe-pisca, .mexe-sobe, .mexe-treme, .mexe-escreve, .mexe-enche)")' });
    const { listeners } = await cdp.send("DOMDebugger.getEventListeners", { objectId: objeto.result.objectId });
    const hovers = listeners.filter(l => l.type === "pointerenter").length;
    assert.equal(hovers, 1, "Cada capa precisa de um só listener, inclusive quando montada depois");
    await cdp.detach();
    await page.keyboard.press("Control+k");
    await page.locator("dialog.busca[open]").waitFor();
    assert.equal(
      await page
        .locator("[data-busca-campo]")
        .evaluate((e) => document.activeElement === e),
      true,
    );
    await page.evaluate(() => {
      window.addEventListener("busca:resultado", (e) => {
        window.resultadoDaBusca = e.detail;
      });
    });
    await page.locator("[data-busca-campo]").fill("criptografia");
    await page.waitForFunction(
      () =>
        window.resultadoDaBusca?.consulta === "criptografia" &&
        window.resultadoDaBusca.n > 0,
    );
    assert.ok(
      (await page
        .locator('[data-busca-resultados] a[href*="criptografia-em-repouso"]')
        .count()) > 0,
    );
    await page.waitForTimeout(200);
    await page.screenshot({ path: `${pasta}/busca-interacao-${largura}.png` });
    await page.locator("[data-busca-campo]").fill("zzqwxk987654321");
    await page.waitForFunction(
      () =>
        window.resultadoDaBusca?.consulta === "zzqwxk987654321" &&
        window.resultadoDaBusca.n === 0,
    );
    await page.keyboard.press("Escape");
    assert.equal(
      await page.locator("dialog.busca").evaluate((e) => e.open),
      false,
    );
    if (largura === 375) {
      await page.locator("[data-botao-menu]").click();
      assert.equal(
        await page.locator("[data-botao-menu]").getAttribute("aria-expanded"),
        "true",
      );
      await page.keyboard.press("Escape");
      assert.equal(
        await page.locator("[data-botao-menu]").getAttribute("aria-expanded"),
        "false",
      );
    }
    await page.locator("[data-botao-tema]").click();
    await page.waitForFunction(
      () => document.documentElement.dataset.theme === "dark",
    );
    await page.locator("[data-botao-tema]").click();
    await page.waitForFunction(
      () => document.documentElement.dataset.theme === "light",
    );
    await page.goto(s.url + "/categories/Seguran%C3%A7a/");
    const ampliar = page.locator("[data-ampliar-livro] [data-ampliar]").first();
    await ampliar.click();
    await page.locator("dialog[data-livro-ampliado][open]").waitFor();
    await page.screenshot({ path: `${pasta}/livro-interacao-${largura}.png` });
    await page.keyboard.press("Escape");
    await page.waitForFunction(
      () => !document.querySelector("dialog[data-livro-ampliado]").open,
    );
    assert.equal(
      await ampliar.evaluate((e) => document.activeElement === e),
      true,
      "Fechar o livro devolve o foco à lupa",
    );
    await page.route(/\/posts\/java-17\/.*\.svg$/, async (route) => {
      await new Promise((ok) => setTimeout(ok, 1500));
      await route.continue();
    });
    await page.goto(s.url + "/posts/java-17/", {
      waitUntil: "domcontentloaded",
    });
    const reserva = await page
      .locator('.prose img[src$=".svg"]')
      .first()
      .evaluate((e) => ({
        width: e.getAttribute("width"),
        height: e.getAttribute("height"),
        caixa: e.getBoundingClientRect().height,
      }));
    assert.ok(
      Number(reserva.width) > 0 &&
        Number(reserva.height) > 0 &&
        reserva.caixa > 0,
      "SVG no corpo reserva espaço antes de baixar",
    );
    resultados.push({ largura, tags, reduzido, hovers, reserva, erros });
    assert.deepEqual(erros, []);
    await page.close();
  }
  console.log(JSON.stringify(resultados, null, 2));
} finally {
  writeFileSync(
    `${pasta}/interacoes.json`,
    JSON.stringify(resultados, null, 2),
  );
  await b.close();
  await s.close();
}
