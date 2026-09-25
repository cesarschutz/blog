/**
 * Sons dos livros (D33), feitos na hora com Web Audio, sem arquivos e bem baixos:
 * - `tocarToque(altura)`: ao passar o mouse numa lombada, um toque de madeira; a nota sobe com a
 *   posição do livro, e varrer a estante toca uma escala;
 * - `tocarAbrir()` e `tocarFechar()`: o livro saindo da prateleira (um sopro de papel) e a capa
 *   assentando (um baque macio), e o contrário;
 * - `tocarPapel()`: o post-it das frases sendo arrancado.
 * O navegador só libera som depois de um clique ou tecla (no Chrome, vale o clique da página anterior
 * do site). O som vem desligado (D38): o menu de aparência do cabeçalho liga (`cs-som` = "on").
 */
const CHAVE = "cs-som";
let ctx: AudioContext | undefined;
let ruido: AudioBuffer | undefined;
let ultimoToque = 0;
// Sem armazenamento (navegação privada), a escolha vale só nesta página.
let escolhaDaPagina: boolean | undefined;

export function somLigado(): boolean {
  if (escolhaDaPagina !== undefined) return escolhaDaPagina;
  try {
    return localStorage.getItem(CHAVE) === "on";
  } catch {
    return false;
  }
}

export function ligarSom(ligado: boolean) {
  escolhaDaPagina = ligado;
  try {
    if (ligado) localStorage.setItem(CHAVE, "on");
    else localStorage.removeItem(CHAVE);
  } catch {
    // fica só a escolha da página
  }
  dispatchEvent(new CustomEvent("som:mudou"));
}

/**
 * O contexto de áudio. O navegador só deixa tocar depois de um clique ou tecla; o Chrome também deixa
 * quando o leitor clicou na página anterior do site (quem chega pelo livro do painel já ouve os
 * livros da página nova). Sem essa licença, o contexto nasce suspenso: aquele toque fica mudo e o
 * primeiro clique ou tecla o acorda.
 */
function criar(): AudioContext | undefined {
  if (ctx) return ctx;
  const Contexto = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Contexto) return;
  try {
    ctx = new Contexto();
  } catch {
    return;
  }
  const acordar = () => void ctx?.resume().catch(() => {});
  addEventListener("pointerdown", acordar, { capture: true });
  addEventListener("keydown", acordar, { capture: true });
  return ctx;
}

// Nas páginas com livros, o áudio é preparado no primeiro movimento do mouse: quando o navegador
// deixa, ele já está acordado quando o mouse chega à primeira lombada (e o primeiro toque soa).
addEventListener(
  "pointermove",
  (e) => {
    const temLivros = document.querySelector(".pilha, [data-estante], [data-estante-filtro], [data-grade-livros]");
    if (e.pointerType === "mouse" && temLivros && somLigado()) criar();
  },
  { once: true, passive: true },
);

function contexto(): AudioContext | undefined {
  if (!somLigado()) return;
  const c = criar();
  if (!c) return;
  if (c.state === "running") return c;
  void c.resume().catch(() => {});
  // Com o clique já dado nesta página, o contexto acorda em instantes e o som agendado sai junto.
  // Sem ele, fica mudo: os sons agendados sairiam todos de uma vez no primeiro clique.
  const ativacao = (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation;
  return ativacao?.hasBeenActive ? c : undefined;
}

function bufferDeRuido(c: AudioContext): AudioBuffer {
  if (!ruido) {
    ruido = c.createBuffer(1, Math.round(c.sampleRate * 0.8), c.sampleRate);
    const dados = ruido.getChannelData(0);
    for (let i = 0; i < dados.length; i++) dados[i] = Math.random() * 2 - 1;
  }
  return ruido;
}

/** Envelope: sobe até `pico` em `ataque` segundos e morre até `fim`. */
function envelope(c: AudioContext, inicio: number, pico: number, ataque: number, fim: number): GainNode {
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, inicio);
  g.gain.exponentialRampToValueAtTime(pico, inicio + ataque);
  g.gain.exponentialRampToValueAtTime(0.0001, inicio + fim);
  return g;
}

/** Ruído filtrado: `de` e `para` são as frequências do filtro no começo e no fim. */
function sopro(c: AudioContext, inicio: number, duracao: number, pico: number, de: number, para: number, q = 0.9) {
  const fonte = c.createBufferSource();
  fonte.buffer = bufferDeRuido(c);
  const filtro = c.createBiquadFilter();
  filtro.type = "bandpass";
  filtro.Q.value = q;
  filtro.frequency.setValueAtTime(de, inicio);
  filtro.frequency.exponentialRampToValueAtTime(para, inicio + duracao);
  fonte.connect(filtro).connect(envelope(c, inicio, pico, duracao * 0.3, duracao)).connect(c.destination);
  fonte.start(inicio, Math.random() * 0.3, duracao + 0.05);
}

/** Baque macio: um seno grave que cai de tom. */
function baque(c: AudioContext, inicio: number, pico: number, de = 150, para = 70) {
  const osc = c.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(de, inicio);
  osc.frequency.exponentialRampToValueAtTime(para, inicio + 0.16);
  osc.connect(envelope(c, inicio, pico, 0.006, 0.2)).connect(c.destination);
  osc.start(inicio);
  osc.stop(inicio + 0.22);
}

// Escala pentatônica (Ré maior), duas oitavas: soa bem em qualquer ordem.
const NOTAS = [587.3, 659.3, 740, 880, 987.8, 1174.7, 1318.5, 1480, 1760];

/** Toque de madeira ao passar o mouse numa lombada; `altura` de 0 (primeiro livro) a 1 (último). */
export function tocarToque(altura = 0.5) {
  const c = contexto();
  if (!c) return;
  // Varrer a estante depressa não vira metralhadora. Pelo relógio da página: o do áudio fica parado
  // enquanto ele acorda.
  const agora = performance.now();
  if (agora - ultimoToque < 50) return;
  ultimoToque = agora;
  const t = c.currentTime;
  const nota = NOTAS[Math.round(Math.min(1, Math.max(0, altura)) * (NOTAS.length - 1))];
  const osc = c.createOscillator();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(nota, t);
  osc.frequency.exponentialRampToValueAtTime(nota * 0.94, t + 0.09);
  osc.connect(envelope(c, t, 0.022, 0.003, 0.11)).connect(c.destination);
  osc.start(t);
  osc.stop(t + 0.12);
  sopro(c, t, 0.03, 0.012, 3500, 2600, 1.2);
}

/** O livro saindo da prateleira e a capa assentando. */
export function tocarAbrir() {
  const c = contexto();
  if (!c) return;
  const t = c.currentTime;
  sopro(c, t, 0.34, 0.045, 600, 2400);
  baque(c, t + 0.32, 0.07);
}

/** O contrário: a capa fechando e o livro voltando para o lugar. */
export function tocarFechar() {
  const c = contexto();
  if (!c) return;
  const t = c.currentTime;
  sopro(c, t, 0.26, 0.035, 2200, 700);
  baque(c, t + 0.24, 0.05, 120, 60);
}

/** O post-it sendo arrancado: papel rasgando, curto e agudo. */
export function tocarPapel() {
  const c = contexto();
  if (!c) return;
  const t = c.currentTime;
  sopro(c, t, 0.12, 0.03, 2600, 5200, 0.7);
  sopro(c, t + 0.05, 0.08, 0.018, 4200, 3000, 1.4);
}
