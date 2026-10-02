/**
 * A luz do site no navegador (rodada 3 do redesenho, área A; Luz.astro, luz.css): o fundo âmbar que
 * acompanha o mouse nos dois temas (T5) e a camada do brilho nas lombadas da estante e da pilha (T4). O
 * livro 3D e a foto do livro têm o script deles (livro-vivo.ts).
 *
 * - Um requestAnimationFrame só, que dorme quando a luz chega ao mouse; escreve só o `transform` dos dois
 *   discos (o âmbar e o ponto de luz do meio), com atraso macio (lerp, uns 120ms).
 * - Só com mouse (`pointerType` "mouse" e um ponteiro fino); com movimento reduzido, nada acende.
 * - Linha 20: as luzes locais (`[data-luz-local]`, a cartolina do post e a do livro grande) são a mesma
 *   mancha vista num papel que fica por cima da mesa: o primeiro filho de cada uma vai para o ponto da mancha,
 *   em coordenadas dela, no mesmo quadro (e ao rolar, porque a mancha fica no lugar e o papel anda).
 */

const reduzido = matchMedia("(prefers-reduced-motion: reduce)");
const mouseFino = matchMedia("(hover: hover) and (pointer: fine)");

const mesa = document.querySelector<HTMLElement>(".luz-mesa");
const discos = mesa ? [...mesa.querySelectorAll<HTMLElement>(":scope > div")] : [];

const locais = [...document.querySelectorAll<HTMLElement>("[data-luz-local]")];

const ponteiro = { x: 0, y: 0 };
const luz = { x: 0, y: 0, acesa: false };
let pedido = 0;

/** As luzes locais: só as que estão perto da tela; a leitura do lugar vem antes de qualquer escrita. */
function posicionarLocais() {
  if (!locais.length) return;
  const lugares = locais.map((el) => el.getBoundingClientRect());
  locais.forEach((el, i) => {
    const r = lugares[i];
    if (r.bottom < -400 || r.top > innerHeight + 400) return;
    const mancha = el.firstElementChild as HTMLElement | null;
    if (mancha) mancha.style.transform = `translate3d(${(luz.x - r.left).toFixed(1)}px, ${(luz.y - r.top).toFixed(1)}px, 0)`;
  });
}

function posicionar() {
  const t = `translate3d(${luz.x.toFixed(1)}px, ${luz.y.toFixed(1)}px, 0)`;
  for (const d of discos) d.style.transform = t;
  posicionarLocais();
}

function acenderLocais(acesa: boolean) {
  for (const el of locais) el.classList.toggle("ligada", acesa);
}

function quadro() {
  pedido = 0;
  if (!luz.acesa) return;
  luz.x += (ponteiro.x - luz.x) * 0.13;
  luz.y += (ponteiro.y - luz.y) * 0.13;
  posicionar();
  if (Math.abs(ponteiro.x - luz.x) > 0.4 || Math.abs(ponteiro.y - luz.y) > 0.4) pedido = requestAnimationFrame(quadro);
}

addEventListener(
  "pointermove",
  (e) => {
    if (e.pointerType !== "mouse" || reduzido.matches || !mesa || !mouseFino.matches) return;
    ponteiro.x = e.clientX;
    ponteiro.y = e.clientY;
    if (!luz.acesa) {
      luz.acesa = true;
      luz.x = ponteiro.x;
      luz.y = ponteiro.y;
      posicionar();
      mesa.classList.add("ligada");
      acenderLocais(true);
    }
    if (!pedido) pedido = requestAnimationFrame(quadro);
  },
  { passive: true },
);

// O mouse saiu da janela: a luz apaga devagar (0,6s, luz.css).
document.addEventListener("mouseout", (e) => {
  if (e.relatedTarget) return;
  luz.acesa = false;
  mesa?.classList.remove("ligada");
  acenderLocais(false);
});

// Movimento reduzido ligado no meio da visita: a luz apaga.
reduzido.addEventListener("change", () => {
  if (!reduzido.matches) return;
  luz.acesa = false;
  mesa?.classList.remove("ligada");
  acenderLocais(false);
});

// Rolando, a mancha fica no lugar e o papel anda: as luzes locais se acertam no quadro seguinte.
let rolando = 0;
if (locais.length)
  addEventListener(
    "scroll",
    () => {
      if (!luz.acesa || rolando) return;
      rolando = requestAnimationFrame(() => {
        rolando = 0;
        posicionarLocais();
      });
    },
    { passive: true },
  );

/** A lombada da estante (ou da pilha) ganha a camada do brilho na primeira vez que o mouse passa nela. */
function brilhoNaLombada(el: Element) {
  const lombada = el.closest<HTMLElement>(".lombada, .deitado");
  if (!lombada) return;
  const visual = lombada.matches(".lombada-visual") ? lombada : lombada.querySelector<HTMLElement>(".lombada-visual");
  if (!visual || visual.querySelector(":scope > .luz-brilho")) return;
  const camada = document.createElement("span");
  camada.className = "luz-brilho";
  camada.setAttribute("aria-hidden", "true");
  visual.append(camada);
}

document.addEventListener(
  "pointerover",
  (e) => {
    if (e.pointerType === "mouse" && !reduzido.matches && e.target instanceof Element) brilhoNaLombada(e.target);
  },
  { passive: true },
);

// O teclado também acende o brilho da lombada (o reflexo passa no foco, luz.css).
document.addEventListener("focusin", (e) => {
  if (e.target instanceof Element) brilhoNaLombada(e.target);
});
