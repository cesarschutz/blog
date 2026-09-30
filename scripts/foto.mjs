#!/usr/bin/env node
/**
 * Foto de uma página do dev (D58), para conferir um desenho sem depender do navegador de
 * outra sessão: abre o Chrome (playwright-core), espera a página assentar e salva um PNG.
 *
 *   node scripts/foto.mjs <url> <saida.png> [opções]
 *     --largura 1280        largura da janela (padrão 1280); --altura 900
 *     --tema claro|escuro   (padrão claro)
 *     --movimento-reduzido  liga prefers-reduced-motion
 *     --seletor ".figura"   fotografa só o elemento (o primeiro; --indice 2 pega o terceiro)
 *     --clicar ".tocar"     clica antes da foto (no elemento do --seletor, se couber nele)
 *     --arrastar 0.4        leva o controle da lousa (input range) para 0,4 antes da foto
 *     --hover ".painel"     passa o mouse antes da foto
 *     --esperar 1500        espera mais (ms) antes da foto (depois do clique ou do hover)
 *     --antes 7000          espera (ms) antes de clicar ou passar o mouse (o desenho do topo leva ~7 s)
 *     --pronto load         espera o evento load (o padrão é domcontentloaded: páginas com imagens preguiçosas e
 *                           as externas, como AWS e Kubernetes, às vezes nunca chegam ao load)
 *     --escala 2            densidade da foto (padrão: 2 abaixo de 700px, 1 acima)
 *     --inteira             a página inteira (rola antes, para carregar o que é preguiçoso)
 * Se o dev recarregar no meio (arquivo salvo), tenta de novo, até 3 vezes.
 */
import { chromium } from "playwright-core";

const [url, saida, ...resto] = process.argv.slice(2);
if (!url || !saida) {
  console.error("Uso: node scripts/foto.mjs <url> <saida.png> [--largura 1280] [--tema escuro] [--seletor css] …");
  process.exit(2);
}
const opcao = (nome, padrao) => {
  const i = resto.indexOf(nome);
  return i >= 0 ? resto[i + 1] : padrao;
};
const tem = (nome) => resto.includes(nome);

const largura = Number(opcao("--largura", 1280));
const altura = Number(opcao("--altura", 900));
const tema = opcao("--tema", "claro") === "escuro" ? "dark" : "light";
const seletor = opcao("--seletor");
const indice = Number(opcao("--indice", 0));

const navegador = await chromium.launch({ channel: "chrome", headless: true });
try {
  const contexto = await navegador.newContext({
    viewport: { width: largura, height: altura },
    deviceScaleFactor: Number(opcao("--escala", largura < 700 ? 2 : 1)),
    colorScheme: tema,
    reducedMotion: tem("--movimento-reduzido") ? "reduce" : "no-preference",
    hasTouch: largura < 700,
    isMobile: largura < 700,
  });
  // O tema escolhido, como o botão do cabeçalho guarda (src/scripts/tema.ts).
  await contexto.addInitScript((t) => {
    try {
      localStorage.setItem("cs-theme", t);
      localStorage.setItem("cs-prefs-quando", String(Date.now()));
    } catch {}
  }, tema);
  const erros = [];
  for (let tentativa = 1; ; tentativa++) {
    const pagina = await contexto.newPage();
    pagina.on("console", (m) => m.type() === "error" && erros.push(m.text()));
    pagina.on("pageerror", (e) => erros.push(e.message));
    try {
      await pagina.goto(url, { waitUntil: opcao("--pronto", "domcontentloaded"), timeout: 60000 });
      await pagina.evaluate((t) => (document.documentElement.dataset.theme = t), tema);
      await pagina.waitForTimeout(2500 + Number(opcao("--antes", 0)));
      const alvo = seletor ? pagina.locator(seletor).nth(indice) : null;
      if (alvo) await alvo.scrollIntoViewIfNeeded();
      const clicar = opcao("--clicar");
      if (clicar) await (alvo ? alvo.locator(clicar).first() : pagina.locator(clicar).first()).click();
      const arrastar = opcao("--arrastar");
      if (arrastar) {
        const faixa = alvo ? alvo.locator("input[type=range]").first() : pagina.locator("input[type=range]").first();
        await faixa.evaluate((el, v) => {
          el.value = String(Math.round(Number(v) * 1000));
          el.dispatchEvent(new Event("input", { bubbles: true }));
        }, arrastar);
      }
      const hover = opcao("--hover");
      if (hover) await pagina.locator(hover).first().hover();
      await pagina.waitForTimeout(Number(opcao("--esperar", 400)));
      if (tem("--inteira")) {
        await pagina.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += innerHeight / 2) {
            scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 120));
          }
          scrollTo(0, 0);
        });
        await pagina.waitForTimeout(600);
      }
      if (alvo) await alvo.screenshot({ path: saida });
      else await pagina.screenshot({ path: saida, fullPage: tem("--inteira") });
      break;
    } catch (erro) {
      const recarregou = /Execution context was destroyed|Target closed|detached/i.test(String(erro));
      if (!recarregou || tentativa >= 3) throw erro;
      await pagina.close();
      await new Promise((r) => setTimeout(r, 1500));
    }
  }
  console.log(`✓ ${saida}${erros.length ? `\n  erros no console:\n  - ${erros.join("\n  - ")}` : ""}`);
} finally {
  await navegador.close();
}
