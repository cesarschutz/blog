/**
 * O desenho se desenha, com GSAP e DrawSVG sob demanda.
 *
 * - No destaque da home (D41): quando o desenho entra na tela, os traços aparecem uma vez, em sequência;
 *   depois vêm a cor, a hachura e os textos. Com a abertura na tela (D51), espera ela acabar.
 * - No topo do artigo (D51, protótipo 08, "depois de pousar"; a sequência do C1): quando a folha do
 *   artigo pousa (a troca de página avisa com `cs:pousou`, e o caderno da abertura ou o fim da troca,
 *   com `cs:chegou`), o desenho se
 *   desenha pelas camadas: os traços da caneta, em sequência; o papel ganha corpo e a cor "acerta o
 *   registro" (desliza até o lugar, como tinta impressa); as hachuras, os tracejados e os textos; o
 *   carimbo bate; por último, as anotações à mão, escritas da esquerda para a direita. Quem volta ao
 *   artigo pelo histórico, ou o abre com o topo fora da tela, vê o desenho pronto.
 *
 * Os tracejados (`.fantasma`) aparecem por opacidade, sem DrawSVG, para não perderem o tracejado. Até o
 * script chegar, o CSS esconde o desenho (desenho.css); se o GSAP não vier, o desenho aparece inteiro.
 */
import { carregarTraco, movimentoReduzido, type GSAP } from "./gsap";

const FORMAS = ":is(path, rect, circle, ellipse, line, polyline, polygon)";
const raiz = document.documentElement;

function desenhar(gsap: GSAP, svg: SVGSVGElement) {
  // O contorno: tudo o que é traço, menos cor, hachura e tracejado; no recorte anotado (o card largo do
  // destaque, D52), as linhas de chamada das anotações vêm por último.
  const tracos = [...svg.querySelectorAll<SVGElement>(`.tinta ${FORMAS}:not(.cor, .hachura, .fantasma), .com-anotacoes .anotacao .chamada`)];
  const tintas = [...svg.querySelectorAll<SVGElement>(".tinta :is(.cor, .hachura, .papel)")];
  const textos = [...svg.querySelectorAll<SVGElement>("text, .tinta .fantasma")];
  // Muitos traços não passam de ~1,2s de sequência.
  const passo = Math.min(0.09, 1.2 / Math.max(tracos.length, 1));
  // O estado de partida vai direto, antes da primeira pintura da área.
  gsap.set(tintas, { fillOpacity: 0 });
  gsap.set(textos, { opacity: 0 });
  gsap.set(tracos, { drawSVG: "0%" });
  gsap
    .timeline({
      onComplete: () => {
        gsap.set(tracos, { clearProps: "strokeDasharray,strokeDashoffset" });
        // O desenho do destaque terminou: depois da abertura, os cadernos da marca acenam (B13, D52).
        dispatchEvent(new CustomEvent("cs:desenhou"));
      },
    })
    .to(tracos, { drawSVG: "100%", duration: 1.1, stagger: passo, ease: "power1.inOut" })
    .to(tintas, { fillOpacity: 1, duration: 0.6, stagger: 0.03, clearProps: "fillOpacity" }, "-=0.4")
    .to(textos, { opacity: 1, duration: 0.4, stagger: 0.06, clearProps: "opacity" }, "<");
}

/** A sequência do C1, pelas camadas das ilustrações do site. */
function desenharPorCamadas(gsap: GSAP, svg: SVGSVGElement, celular: boolean) {
  const todos = (s: string) => [...svg.querySelectorAll<SVGGraphicsElement>(s)];
  const tracos = todos(`.tinta ${FORMAS}:not(.cor, .hachura, .fantasma, .carimbo)`);
  const papeis = todos(".tinta .papel");
  const cor = todos(".tinta .cor");
  const hachuras = todos(".tinta .hachura");
  const fantasmas = todos(".tinta .fantasma");
  const textos = todos("text:not(.carimbo-texto)").filter((t) => !t.closest(".anotacao"));
  const carimbo = todos(".carimbo, .carimbo-texto");
  const chamadas = todos(".anotacao .chamada");
  const notas = todos(".anotacao text");
  const t = celular ? 0.65 : 1;
  // O carimbo (moldura e texto no mesmo espaço de coordenadas) bate em volta do meio da moldura.
  const moldura = svg.querySelector<SVGGraphicsElement>(".carimbo");
  let centro = "0 0";
  if (moldura) {
    const b = moldura.getBBox();
    centro = `${b.x + b.width / 2} ${b.y + b.height / 2}`;
  }
  const limpar = () => {
    const tudo = [...tracos, ...chamadas, ...papeis, ...cor, ...hachuras, ...fantasmas, ...textos, ...carimbo, ...notas];
    if (tudo.length) gsap.set(tudo, { clearProps: "strokeDasharray,strokeDashoffset,fillOpacity,opacity,clipPath" });
  };
  // Só as camadas que o desenho tem (o GSAP avisa quando o alvo é uma lista vazia).
  const tl = gsap.timeline({ defaults: { ease: "power1.inOut" }, onComplete: limpar });
  const se = (lista: SVGGraphicsElement[], fazer: () => void) => { if (lista.length) fazer(); };
  // O ponto de partida vai direto, antes da primeira pintura da área.
  se(papeis, () => gsap.set(papeis, { fillOpacity: 0 }));
  se([...hachuras, ...fantasmas, ...textos, ...carimbo], () => gsap.set([...hachuras, ...fantasmas, ...textos, ...carimbo], { opacity: 0 }));
  se(notas, () => gsap.set(notas, { clipPath: "inset(0 100% 0 0)" }));
  se(carimbo, () => gsap.set(carimbo, { svgOrigin: centro, scale: 1.45 }));
  // 1. os traços, em sequência
  se(tracos, () => tl.fromTo(tracos, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.8 * t, stagger: { amount: 0.5 * t } }, 0));
  se(fantasmas, () => tl.to(fantasmas, { opacity: 1, duration: 0.5 * t }, 0.3 * t));
  // 2. o papel ganha corpo e, com ele já opaco, a cor acerta o registro (desliza até o deslocamento
  //    dela): só a lasca deslocada fica à vista, não um bloco de cor inteiro
  se(papeis, () => tl.to(papeis, { fillOpacity: 1, duration: 0.3 * t }, 0.9 * t));
  se(cor, () => tl.from(cor, { x: "+=20", y: "+=16", opacity: 0, duration: 0.6 * t, ease: "power3.out" }, 1.1 * t));
  se(hachuras, () => tl.to(hachuras, { opacity: 0.75, duration: 0.5 * t }, 1.15 * t));
  se(textos, () => tl.to(textos, { opacity: 1, duration: 0.35 * t, stagger: 0.05 }, 1.25 * t));
  // 3. o carimbo bate: cai de cima e assenta com um tranco curto
  const tc = 1.45 * t;
  se(carimbo, () => {
    tl.to(carimbo, { opacity: 1, duration: 0.08 }, tc)
      .to(carimbo, { scale: 1, duration: 0.24, ease: "power4.in" }, tc)
      .to(carimbo, { keyframes: [{ scale: 0.97, duration: 0.07 }, { scale: 1, duration: 0.18, ease: "power2.out" }] }, tc + 0.24);
  });
  // 4. as anotações à mão: primeiro a chamada, depois o texto, da esquerda para a direita
  const ta = carimbo.length ? tc + 0.25 : tc;
  se(chamadas, () => tl.fromTo(chamadas, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.4, stagger: 0.2 }, ta));
  se(notas, () => tl.to(notas, { clipPath: "inset(0 0% 0 0)", duration: 0.6, ease: "none", stagger: 0.15 }, ta + 0.2));
}

const mostrar = (area: Element) => area.setAttribute("data-desenhado", "");

// O destaque da home existe nas duas formas, lista e cards (D52): só a que está à vista se desenha, e
// uma vez por página; a outra, quando aparecer (na troca Lista / Cards), já vem pronta.
let desenhou = false;

/**
 * O script assume a área: desliga a reserva do CSS (desenho.css), que mostra o desenho inteiro em 4s se o
 * script não chegar. Se ele chegou depois disso, o desenho já está à vista e fica como está (D54).
 */
function assumir(area: Element) {
  if (area.hasAttribute("data-desenhado") || area.hasAttribute("data-desenho-vivo")) return;
  const svg = area.querySelector("svg.ilustracao");
  if (!movimentoReduzido.matches && svg && getComputedStyle(svg).visibility === "visible") mostrar(area);
  else area.setAttribute("data-desenho-vivo", "");
}

/** O desenho de `[data-desenhar]` (o destaque da home) se desenha quando entra na tela, uma vez. */
export function desenharAoEntrar() {
  const areas = [...document.querySelectorAll("[data-desenhar]")];
  if (!areas.length) return;
  areas.forEach(assumir);
  if (movimentoReduzido.matches) return areas.forEach(mostrar);
  // Com a abertura na tela, o desenho espera ela acabar (senão, se desenharia debaixo do papel).
  if (raiz.hasAttribute("data-abertura")) {
    addEventListener("cs:aberto", desenharAoEntrar, { once: true });
    return;
  }
  const reserva = window.setTimeout(() => areas.forEach(mostrar), 2500);
  const gsap = carregarTraco();
  gsap.then(() => clearTimeout(reserva), () => areas.forEach(mostrar));
  const olhar = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (!e.isIntersecting) continue;
        olhar.unobserve(e.target);
        const area = e.target;
        if (desenhou) {
          mostrar(area);
          continue;
        }
        desenhou = true;
        gsap.then(
          (g) => {
            // O recorte à vista (o card do destaque traz o largo e o médio, e mostra um só).
            const svg = [...area.querySelectorAll<SVGSVGElement>("svg.ilustracao")].find((s) => s.getBoundingClientRect().width > 0);
            if (!area.hasAttribute("data-desenhado") && svg) desenhar(g, svg);
            mostrar(area);
          },
          () => mostrar(area),
        );
      }
    },
    { threshold: 0.3 },
  );
  areas.forEach((a) => olhar.observe(a));
  // Os cards chegam do <template> na primeira troca para Cards (SeletorModo, D37).
  addEventListener("cartoes:prontos", () =>
    document.querySelectorAll("[data-desenhar]:not([data-desenhado])").forEach((a) => {
      assumir(a);
      if (desenhou) mostrar(a);
      else olhar.observe(a);
    }),
  );
}

/**
 * O desenho do topo do artigo (`[data-desenhar-topo]`) se desenha quando a folha pousa: só quando a
 * página chega por uma troca (data-vai-chegar, posto no <head> pelo troca.js, ou data-chegando) ou pela
 * abertura (data-abertura). Nos outros casos, ele já está inteiro.
 */
export function desenharTopoDoArtigo() {
  const area = document.querySelector("[data-desenhar-topo]");
  if (!area) return;
  const nav = (window as unknown as { navigation?: { activation?: { navigationType?: string } } }).navigation;
  const pelaHistoria = nav?.activation?.navigationType === "traverse";
  const vai = !pelaHistoria && ["data-chegando", "data-vai-chegar", "data-abertura"].some((a) => raiz.hasAttribute(a));
  if (!vai || movimentoReduzido.matches) return mostrar(area);
  // Escondido até a sequência começar (desenho.css), mesmo depois que a abertura tira o data-abertura do
  // <html>: ela acaba antes de a folha pousar, e o desenho pronto aparecia e sumia nesse meio (D54).
  area.setAttribute("data-desenhar-espera", "");
  let foi = false;
  // Se a sequência não começar, o desenho aparece inteiro: 4s depois de abrir ou, com a abertura (que
  // numa carga lenta passa dos 4s), 2s depois de ela acabar.
  let reserva = 0;
  const reservar = (ms: number) => (reserva = window.setTimeout(() => mostrar(area), ms));
  if (raiz.hasAttribute("data-abertura")) addEventListener("cs:aberto", () => foi || reservar(2000), { once: true });
  else reservar(4000);
  const gsap = carregarTraco();
  gsap.catch(() => mostrar(area));
  // O primeiro aviso que vier: a folha pousou (troca) ou a chegada acabou (abertura, ou troca sem folha).
  const comecar = () => {
    if (foi) return;
    foi = true;
    gsap.then((g) => {
      clearTimeout(reserva);
      // O desenho à vista (no celular, o recorte médio) e com o topo na tela; senão, pronto.
      const svg = [...area.querySelectorAll<SVGSVGElement>("svg.ilustracao")].find((s) => s.getBoundingClientRect().width > 0);
      const r = area.getBoundingClientRect();
      if (svg && r.bottom > 0 && r.top < innerHeight) desenharPorCamadas(g, svg, innerWidth <= 640);
      mostrar(area);
    });
  };
  addEventListener("cs:pousou", comecar, { once: true });
  addEventListener("cs:chegou", comecar, { once: true });
}
