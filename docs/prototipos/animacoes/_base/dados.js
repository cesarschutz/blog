/* Dados do mini-site dos protótipos de animação (espelham o blog de 27/09/2026). Só protótipo. */
/* A marca "cs" (o traçado de src/lib/marca.ts, copiado do A3). */
const MARCA = `<rect class="marca-capa" width="40" height="52" rx="3.2"/><rect class="marca-dobra" x="4" width="1" height="52"/><g class="marca-letras" transform="translate(7.770 4.786) scale(0.04746)"><path transform="translate(19.0 505.0)" d="M 193.4 -354.9 C 224.8 -354.9 252.1 -347.2 275.2 -331.8 C 298.3 -316.4 309.8 -296.6 309.8 -272.5 C 309.8 -259.5 305.2 -248.3 296.1 -238.8 C 286.9 -229.2 275.3 -224.5 261.1 -224.5 C 251.6 -224.5 243.3 -226.7 236.2 -231.1 C 222.8 -238.9 216.1 -253.1 216.1 -273.6 C 216.1 -275.8 216.2 -279 216.4 -283.3 C 216.7 -287.5 216.8 -292.1 216.8 -297 C 216.8 -310.2 213.7 -319.2 207.6 -324.1 C 201.3 -329 194.1 -331.4 186 -331.4 C 162.8 -331.4 146.4 -318.7 136.6 -293.2 C 126.8 -267.6 122 -238.4 122 -205.4 C 122 -158.6 131.2 -119.3 149.8 -87.5 C 168.3 -55.8 193.4 -39.9 224.9 -39.9 C 244.6 -39.9 261.5 -44.3 275.4 -53.1 C 283.7 -58.2 293.9 -67.6 306.2 -81.3 L 320.1 -68.5 C 295.7 -34.5 267.1 -11.2 234.4 1.5 C 217 8.1 198.6 11.4 179.1 11.4 C 131 11.4 91.7 -5.9 61.2 -40.3 C 30.6 -74.7 15.4 -116.7 15.4 -166.3 C 15.4 -218.5 31.5 -263 63.9 -299.7 C 96.2 -336.5 139.4 -354.9 193.4 -354.9 Z M 176.5 -354.9 Z M 176.5 -354.9"/><path transform="translate(313.9 732.5)" d="M 19 -113.5 L 39.9 -113.5 C 47.2 -77.6 60.9 -52.3 80.9 -37.5 C 101 -22.8 121.5 -15.4 142.5 -15.4 C 161.7 -15.4 175.9 -19.7 184.9 -28.4 C 194 -37 198.5 -48.5 198.5 -62.6 C 198.5 -76.1 193.6 -87.5 183.8 -97 C 178.5 -102.2 169.8 -107.7 157.8 -113.5 L 102.2 -140.6 C 72.9 -155 51.9 -170.7 39.2 -187.5 C 26.3 -204.3 19.8 -224.2 19.8 -247.2 C 19.8 -276.2 29.9 -301.3 50.2 -322.4 C 70.4 -343.6 98.8 -354.1 135.1 -354.1 C 151 -354.1 167.8 -351.5 185.7 -346.2 C 203.5 -341 214.6 -338.4 219 -338.4 C 225.1 -338.4 229.4 -339.7 232 -342.2 C 234.6 -344.8 236.7 -348.4 238.4 -353 L 254.9 -353 L 254.9 -244.6 L 235.8 -244.6 C 228.8 -270 217.2 -290.4 201 -305.8 C 184.9 -321.2 166.1 -328.9 144.7 -328.9 C 128.1 -328.9 115.7 -324.2 107.5 -314.9 C 99.3 -305.7 95.2 -295.7 95.2 -284.9 C 95.2 -276.1 98.9 -267.3 106.2 -258.5 C 113.3 -249.5 126.7 -240.2 146.5 -230.7 L 187.5 -210.9 C 212.9 -198.7 231.5 -186.9 243.2 -175.4 C 262.7 -155.9 272.5 -131.8 272.5 -103.3 C 272.5 -75.4 262.4 -49.5 242.3 -25.5 C 222.1 -1.4 191.9 10.6 151.6 10.6 C 141.6 10.6 131.5 9.6 121.4 7.5 C 111.3 5.4 98.8 1.8 83.9 -3.3 L 71 -7.7 C 66.4 -9.4 63.5 -10.4 62.4 -10.6 C 61.3 -10.9 59.9 -11 58.2 -11 C 54.1 -11 50.5 -9.3 47.4 -6 C 44.4 -2.7 40.9 2.8 37 10.6 L 19 10.6 Z M 145.4 -354.9 Z M 145.4 -354.9"/></g>`;

/* Ícones dos livros (24×24, traço), copiados do A3. */
const ICONES_LIVRO = {
  arq: `<path d="M5 20V12a7 7 0 0 1 14 0v8M9 20v-7a3 3 0 0 1 6 0v7M4 20h16M11 3.5h2v2.5h-2z"/>`,
  dev: `<path d="M7 3v18M7 5h10l-2.5 3H7M7 13h6M11 13v3.5"/>`,
  dados: `<ellipse cx="12" cy="6" rx="6" ry="2.4"/><path d="M6 6v12c0 1.3 2.7 2.4 6 2.4s6-1.1 6-2.4V6M6 12c0 1.3 2.7 2.4 6 2.4s6-1.1 6-2.4"/>`,
  ia: `<rect x="5" y="4" width="14" height="16" rx="1"/><path d="M8.5 16l3.5-8 3.5 8M9.8 13h4.4"/>`,
  seg: `<rect x="4" y="6" width="16" height="12" rx="1"/><path d="M4 7l8 6 8-6"/><circle cx="12" cy="15.5" r="1.8"/>`,
  devops: `<path d="M6 21V4M6 5h13M6 5l4-2M16 5v5M14.5 10h3v3h-3zM3 21h6"/>`,
  sre: `<path d="M10 21l1-11h2l1 11zM9 10h6M10.5 7h3v3h-3zM12 5V4M4 8l4 1M20 8l-4 1"/>`,
  carreira: `<path d="M12 3v3M12 6l-6 15M12 6l6 15M8.5 15h7"/><circle cx="12" cy="6" r="1.4"/>`,
  java: `<path d="M5 10h11v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4zM16 11.5h1.5a2 2 0 0 1 0 4H16M9 4c-1 1.2 1 2.2 0 3.6M12.5 4c-1 1.2 1 2.2 0 3.6"/>`,
};

/* Desenhos grandes (1040×440, traço de caneta), copiados do B1. */
function hach(x, y, w, h) {
  let d = "";
  for (let yy = y + 14; yy < y + h + 12; yy += 13) d += `M${x + w + 4} ${yy} l12 -12 `;
  for (let xx = x + 12; xx < x + w + 16; xx += 13) d += `M${xx} ${y + h + 16} l12 -12 `;
  return `<path class="h" d="${d}"/>`;
}
function seta(x, y, ang) {
  const a = (ang * Math.PI) / 180, r = 17;
  const p = (s) => `${(x - r * Math.cos(a + s)).toFixed(1)} ${(y - r * Math.sin(a + s)).toFixed(1)}`;
  return `<path class="t" d="M${p(-0.5)} L${x} ${y} L${p(0.5)}"/>`;
}
const DESENHOS = {
  fila: () => `
    ${hach(420, 170, 150, 100)}
    <rect class="tf" x="420" y="170" width="150" height="100" rx="10"/>
    <text class="a" x="470" y="215">app</text><path class="t" d="M446 238 H546 M446 254 H520"/>
    <circle class="c" cx="728" cy="126" r="62"/><circle class="t" cx="720" cy="120" r="62"/>
    <path class="t" d="M720 120 V84 M720 120 L748 138"/><text class="m" x="800" y="128">CronJob</text>
    <path class="t" d="M572 196 C610 180 630 164 652 150"/>${seta(652, 150, -33)}
    ${hach(640, 300, 260, 76)}
    <rect class="tf" x="640" y="300" width="260" height="76" rx="38"/>
    <path class="t" d="M676 318 h54 v40 h-54 z M676 318 l27 20 l27 -20 M744 318 h54 v40 h-54 z M744 318 l27 20 l27 -20 M812 318 h54 v40 h-54 z M812 318 l27 20 l27 -20"/>
    <text class="m" x="742" y="414">SQS</text>
    <path class="t" d="M572 252 C604 288 616 312 634 328"/>${seta(634, 328, 42)}
    <text class="a" x="80" y="150">A: CronJob com o perfil batch</text><text class="a2" x="80" y="182">a mesma imagem, agendada</text>
    <text class="a" x="80" y="300">B: endpoint que enfileira</text><text class="a2" x="80" y="332">e a própria API consome</text>`,
  cartao: () => `
    ${hach(620, 60, 220, 320)}
    <rect class="tf" x="620" y="60" width="220" height="320" rx="4"/>
    <path class="t" d="M650 104 H800 M650 136 H770 M650 168 H806 M650 200 H760 M650 232 H800 M650 264 H742 M650 296 H790 M650 328 H770"/>
    <g transform="rotate(-6 470 260)">
      ${hach(290, 150, 370, 220)}
      <rect class="tf" x="290" y="150" width="370" height="220" rx="24"/>
      <rect class="t" x="326" y="188" width="62" height="48" rx="8"/><path class="t" d="M326 212 H388 M357 188 V236"/>
      <text class="m" x="326" y="306">5502 09</text><rect class="c" x="456" y="280" width="92" height="34" rx="4"/><text class="m" x="558" y="306">7890</text>
      <text class="m" x="326" y="350" style="font-size:24px">CESAR</text>
    </g>
    <g transform="rotate(-5 230 360)"><rect class="g" x="150" y="330" width="160" height="62" rx="8"/><text class="m" x="172" y="370" style="font-size:24px">cvv 123</text><path class="t" d="M168 362 H292"/></g>
    <text class="a" x="80" y="74">o número vai mascarado</text><text class="a2" x="80" y="104">550209******7890 no log</text>
    <path class="t" d="M330 118 C370 126 400 140 420 158" style="stroke-width:2.5"/>
    <text class="a" x="870" y="200">o log</text><text class="a2" x="870" y="230">só no logMapper</text>`,
  chave: () => `
    ${hach(110, 120, 190, 62)}
    <rect class="tf" x="110" y="120" width="190" height="62" rx="8"/><text class="m" x="134" y="161">POST</text>
    <rect class="g" x="110" y="270" width="190" height="62" rx="8"/><text class="m" x="134" y="311">POST</text>
    <path class="t" d="M302 151 C360 151 400 160 450 176"/>${seta(450, 176, 18)}
    <path class="g" d="M302 301 C360 301 400 284 450 266"/>${seta(450, 266, -20)}
    ${hach(460, 110, 220, 230)}
    <rect class="tf" x="460" y="110" width="220" height="230" rx="12"/>
    <circle class="c" cx="536" cy="206" r="30"/><circle class="t" cx="530" cy="200" r="30"/>
    <path class="t" d="M560 200 H646 M616 200 V224 M636 200 V218 M492 290 H648 M492 312 H610"/>
    <path class="t" d="M682 225 H790"/>${seta(790, 225, 0)}
    <rect class="tf" x="800" y="182" width="170" height="86" rx="8"/><text class="a" x="818" y="234">1 cobrança</text>
    <text class="a2" x="480" y="385">a mesma chave, uma vez só</text><text class="a2" x="112" y="370">o retry</text>`,
  banco: () => `
    ${hach(400, 120, 240, 200)}
    <path class="tf" d="M400 120 V320 A120 34 0 0 0 640 320 V120"/>
    <ellipse class="tf" cx="520" cy="120" rx="120" ry="34"/>
    <path class="t" d="M400 190 A120 34 0 0 0 640 190 M400 255 A120 34 0 0 0 640 255"/>
    <rect class="c" x="494" y="214" width="58" height="44" rx="6"/><rect class="t" x="488" y="208" width="58" height="44" rx="6"/>
    <path class="t" d="M498 208 V194 A19 19 0 0 1 536 194 V208"/>
    <rect class="tf" x="110" y="170" width="170" height="70" rx="8"/><text class="m" x="130" y="215">T1 · v=7</text>
    <rect class="g" x="780" y="170" width="170" height="70" rx="8"/><text class="m" x="800" y="215">T2 · v=7</text>
    <path class="t" d="M282 205 H392"/>${seta(392, 205, 0)}
    <path class="g" d="M778 205 H650"/><path class="t" d="M700 190 l22 30 M722 190 l-22 30"/>
    <text class="a2" x="110" y="290">quem grava primeiro</text><text class="a2" x="110" y="318">leva a versão 8</text>
    <text class="a2" x="780" y="290">a outra relê</text><text class="a2" x="780" y="318">e tenta de novo</text>`,
  razao: () => `
    <path class="tf" d="M180 110 Q350 88 520 122 V360 Q350 330 180 350 Z"/>
    <path class="tf" d="M520 122 Q690 88 860 110 V350 Q690 330 520 360 Z"/>
    ${hach(520, 122, 340, 230)}
    <path class="t" d="M520 122 V360"/>
    <text class="a2" x="240" y="160">débito</text><text class="a2" x="590" y="160">crédito</text>
    <path class="t" d="M220 186 H480 M220 236 H480 M220 286 H480 M560 186 H820 M560 236 H820 M560 286 H820" style="stroke-width:2.5"/>
    <rect class="c" x="236" y="198" width="110" height="30" rx="4"/><rect class="c" x="576" y="248" width="110" height="30" rx="4"/>
    <text class="m" x="244" y="222">100,00</text><text class="m" x="584" y="272">100,00</text>
    <path class="g" d="M346 214 C430 214 470 262 572 262"/>
    <text class="a" x="300" y="412">os dois lados somam zero</text>`,
  fios: () => `
    <path class="t" d="M380 120 H930 M380 220 H930 M380 320 H930"/>
    <text class="a2" x="760" y="100">threads do sistema</text>
    <circle class="c" cx="470" cy="120" r="18"/><circle class="t" cx="466" cy="116" r="18"/>
    <circle class="c" cx="640" cy="120" r="18"/><circle class="t" cx="636" cy="116" r="18"/>
    <circle class="c" cx="560" cy="320" r="18"/><circle class="t" cx="556" cy="316" r="18"/>
    <circle class="c" cx="790" cy="320" r="18"/><circle class="t" cx="786" cy="316" r="18"/>
    <rect class="c" x="598" y="196" width="54" height="48" rx="6"/><rect class="t" x="592" y="190" width="54" height="48" rx="6"/>
    <path class="t" d="M602 190 V176 A17 17 0 0 1 636 176 V190"/>
    <path class="g" d="M660 220 H900"/>
    <path class="t" d="M470 250 C520 262 560 250 584 232" style="stroke-width:2.5"/>
    <text class="a" x="80" y="220">a virtual thread presa</text><text class="a2" x="80" y="252">synchronized com I/O dentro</text>`,
};
const svgDesenho = (id) => `<svg class="des" viewBox="0 0 1040 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">${DESENHOS[id]()}</svg>`;

/* Os livros da coleção (docs/capas/livros.json) e a revista da série. As cores não mudam com o tema (D39). */
const LIVROS = [
  { k: "arq", nome: "Arquitetura de Software", linhas: ["Arquitetura", "de Software"], vol: "01", w: 62, h: 92, cor: "#2d4b46", tinta: "#efe8d8", dest: "#2d4b46", frase: "As decisões caras de desfazer.", desc: "Microsserviços, domínios, eventos e consistência: as decisões caras de desfazer." },
  { k: "dev", nome: "Desenvolvimento de Software", linhas: ["Desenvolvimento", "de Software"], vol: "02", w: 60, h: 88, cor: "#7a4430", tinta: "#efe8d8", dest: "#7a4430", frase: "O ofício dentro de cada serviço.", desc: "Java, Spring, testes e refatoração: o ofício dentro de cada serviço." },
  { k: "dados", nome: "Dados", linhas: ["Dados"], vol: "03", w: 54, h: 85, cor: "#5f4662", tinta: "#efe8d8", dest: "#5f4662", frase: "Onde o dado mora e por onde ele anda.", desc: "Bancos, modelagem, CDC e pipelines: onde o dado mora e por onde ele anda." },
  { k: "ia", nome: "IA", linhas: ["IA"], vol: "04", w: 50, h: 82, cor: "#6e2f45", tinta: "#efe8d8", dest: "#6e2f45", frase: "Software feito com IA e software que usa IA.", desc: "LLMs, agentes, RAG e prompts: software feito com IA e software que usa IA." },
  { k: "seg", nome: "Segurança", linhas: ["Segurança"], vol: "05", w: 58, h: 90, cor: "#606a37", tinta: "#efe8d8", dest: "#606a37", frase: "Quem pode o quê e como provar.", desc: "Autenticação, autorização, tokens e criptografia: quem pode o quê e como provar." },
  { k: "devops", nome: "DevOps", linhas: ["DevOps"], vol: "06", w: 54, h: 84, cor: "#465976", tinta: "#efe8d8", dest: "#465976", frase: "O caminho do commit até a produção.", desc: "Containers, Kubernetes, CI/CD e nuvem: o caminho do commit até a produção." },
  { k: "sre", nome: "SRE", linhas: ["SRE"], vol: "07", w: 52, h: 86, cor: "#c4a050", tinta: "#29251b", dest: "#836100", frase: "O que mantém a produção de pé.", desc: "Observabilidade, SLOs, alertas e incidentes: o que mantém a produção de pé." },
  { k: "carreira", nome: "Carreira", linhas: ["Carreira"], vol: "08", w: 58, h: 89, cor: "#9a7650", tinta: "#efe8d8", dest: "#7f5b36", frase: "O lado humano de construir software.", desc: "O papel do arquiteto, o estudo e o time: o lado humano de construir software." },
];
const SERIE = { k: "java", nome: "Atualizações do Java", cor: "#c24d1c", texto: "#b8481a", desc: "Cada versão LTS do Java, do 8 ao 29: o que mudou, o que chegou e o que saiu. Uma edição por versão, para ler em ordem." };
const livro = (k) => LIVROS.find((l) => l.k === k);

/* Os artigos (títulos, livros e datas reais; tags e desenhos só para o protótipo). */
const POSTS = [
  { id: "jackson", c: "dev", t: "Filtros de serialização no Jackson", s: "Mascarando número de cartão nos logs", dt: "25 set 2026", ano: 2026, min: 12, d: "cartao", tags: ["Spring", "Logs", "Pagamentos"], r: "Como usar @JsonFilter, PropertyFilter e um mixin em Object para mascarar o número do cartão e remover o CVV só no mapper de log." },
  { id: "cronjob", c: "arq", t: "CronJob ou endpoint + fila", s: "Onde rodar o batch de uma API Spring Boot no Kubernetes", dt: "23 set 2026", ano: 2026, min: 40, d: "fila", tags: ["Kubernetes", "Spring", "AWS", "Mensageria"], r: "Uma API precisa de uma rotina agendada: CronJob com a mesma imagem ou um endpoint que enfileira e a própria API consome?" },
  { id: "java-29", c: "java", serie: true, t: "Java 29 (próxima LTS)", s: "O que o Java 26 e o 27 já trouxeram", dt: "16 set 2026", ano: 2026, min: 18, d: "fios", tags: ["Java"], r: "As JEPs que já chegaram no caminho até a próxima LTS e o que muda para quem está no 25." },
  { id: "bloqueio", c: "dados", t: "Bloqueio otimista e pessimista", s: "Como funcionam e quando usar cada um", dt: "13 set 2026", ano: 2026, min: 19, d: "banco", tags: ["Banco de Dados", "Concorrência", "Spring"], r: "Coluna de versão ou trava da linha: o que cada um custa quando duas transações disputam o mesmo registro." },
  { id: "virtual", c: "dev", t: "Virtual threads no Java 21", s: "Pinning e CLOSE_WAIT", dt: "12 set 2026", ano: 2026, min: 14, d: "fios", tags: ["Java", "Concorrência"], r: "Quando a thread virtual fica presa à thread do sistema e o pool de conexões para de responder." },
  { id: "efeito", c: "arq", t: "Efeito externo sem registro local", s: "A cobrança passou e o banco não gravou", dt: "11 set 2026", ano: 2026, min: 16, d: "chave", tags: ["Pagamentos", "Microsserviços"], r: "O gateway cobrou, a transação local caiu. Como reconciliar sem cobrar duas vezes." },
  { id: "idempotencia", c: "arq", t: "Chave de idempotência", s: "Como impedir a cobrança duplicada no retry", dt: "10 set 2026", ano: 2026, min: 18, d: "chave", tags: ["Pagamentos", "Spring", "Microsserviços"], r: "O cliente repete a chamada e o servidor precisa reconhecer a repetição. Onde guardar a chave e por quanto tempo." },
  { id: "ledger", c: "arq", t: "Arquitetura de ledger", s: "Partidas dobradas, saldos e conciliação", dt: "28 mai 2026", ano: 2026, min: 22, d: "razao", tags: ["Pagamentos", "Banco de Dados"], r: "Um ledger não atualiza saldo: anota lançamentos que se anulam, e o saldo sai da soma." },
  { id: "w3c", c: "sre", t: "W3C Trace Context", s: "Correlacionando logs entre microsserviços com o traceparent", dt: "20 mai 2026", ano: 2026, min: 11, d: "fila", tags: ["Observabilidade", "Logs", "Microsserviços"], r: "O cabeçalho traceparent, o que vai em cada campo e como o Spring o propaga." },
  { id: "sns", c: "arq", t: "SNS MessageAttributes e Filter Policy", s: "Filtrando mensagens antes do SQS", dt: "20 mai 2026", ano: 2026, min: 9, d: "fila", tags: ["AWS", "Mensageria"], r: "Filtrar no tópico, e não no consumidor: os atributos, a política e os limites." },
  { id: "wide", c: "sre", t: "Wide events e canonical log lines", s: "A evolução do logging estruturado", dt: "19 mai 2026", ano: 2026, min: 13, d: "razao", tags: ["Observabilidade", "Logs"], r: "Uma linha por requisição, com tudo o que importa: o que muda na investigação de incidentes." },
  { id: "sigterm", c: "devops", t: "SIGTERM e SIGKILL", s: "O ciclo de término de um pod no Kubernetes", dt: "19 mai 2026", ano: 2026, min: 12, d: "fios", tags: ["Kubernetes", "Spring"], r: "O que acontece entre o SIGTERM e o SIGKILL, e como a aplicação termina o que estava fazendo." },
  { id: "logging", c: "sre", t: "Logging estruturado em Spring Boot", s: "LogstashEncoder vs o suporte nativo do 3.4+", dt: "19 mai 2026", ano: 2026, min: 10, d: "cartao", tags: ["Spring", "Logs"], r: "O que o Boot 3.4 passou a fazer sozinho e quando o encoder ainda vale a pena." },
  { id: "k8s-cron", c: "devops", t: "Kubernetes CronJob", s: "Concorrência, retries e tempo máximo de execução", dt: "19 mai 2026", ano: 2026, min: 11, d: "fila", tags: ["Kubernetes"], r: "concurrencyPolicy, backoffLimit e activeDeadlineSeconds, e o que cada um garante." },
  { id: "gradle", c: "dev", t: "Gradle", s: "Quando usar implementation, api, compileOnly e as demais", dt: "19 mai 2026", ano: 2026, min: 9, d: "razao", tags: ["Gradle", "Java"], r: "As configurações de dependência, uma a uma, e o que cada uma vaza para quem depende do módulo." },
  { id: "atomic", c: "dev", t: "AtomicBoolean", s: "O sinalizador thread-safe da parada graciosa", dt: "19 mai 2026", ano: 2026, min: 7, d: "fios", tags: ["Java", "Concorrência"], r: "Por que um boolean comum não serve para avisar a outra thread que é hora de parar." },
  { id: "aoputils", c: "dev", t: "AopUtils.getTargetClass()", s: "Desembrulhando os proxies do Spring", dt: "19 mai 2026", ano: 2026, min: 8, d: "chave", tags: ["Spring", "AOP"], r: "Quando o bean é um proxy e você precisa da classe de verdade." },
  { id: "aop", c: "dev", t: "AOP no Spring", s: "JDK Dynamic Proxy, CGLIB e aspects customizados", dt: "19 mai 2026", ano: 2026, min: 14, d: "chave", tags: ["Spring", "AOP"], r: "Como o Spring aplica log, transação e métricas fora da regra de negócio, e a pegadinha da self-invocation." },
  { id: "overhead", c: "arq", t: "Overhead vs overkill", s: "O custo de toda escolha e o exagero dela", dt: "16 mai 2026", ano: 2026, min: 8, d: "razao", tags: ["Trade-offs"], r: "Toda solução custa alguma coisa. O problema é quando o custo passa do tamanho do problema." },
  { id: "jwt", c: "seg", t: "JWT", s: "A estrutura e o significado de cada campo", dt: "12 abr 2026", ano: 2026, min: 13, d: "cartao", tags: ["Segurança", "Spring"], r: "Cabeçalho, corpo e assinatura: o que cada campo quer dizer e o que nunca pôr lá." },
  { id: "lake", c: "dados", t: "Data lake vs data warehouse", s: "E onde entra o lakehouse", dt: "31 mar 2026", ano: 2026, min: 6, d: "banco", tags: ["Banco de Dados", "AWS"], r: "Esquema na escrita ou na leitura, e o que o lakehouse tenta juntar dos dois." },
  { id: "java-25", c: "java", serie: true, t: "Java 25 (LTS)", s: "Arquivos-fonte compactos, Scoped Values e cache AOT", dt: "2 jul 2025", ano: 2025, min: 21, d: "fios", tags: ["Java"], r: "A LTS de 2025: o que chegou desde o 21 e o que muda para o dia a dia." },
  { id: "java-21", c: "java", serie: true, t: "Java 21 (LTS)", s: "Virtual threads, pattern matching e Sequenced Collections", dt: "2 jul 2025", ano: 2025, min: 19, d: "fios", tags: ["Java", "Concorrência"], r: "A LTS das virtual threads, e o resto que veio com ela." },
  { id: "java-17", c: "java", serie: true, t: "Java 17 (LTS)", s: "Records, sealed classes, text blocks e switch expressions", dt: "2 jul 2025", ano: 2025, min: 17, d: "fios", tags: ["Java"], r: "A LTS que mudou o jeito de escrever classes de dados." },
];
const post = (id) => POSTS.find((p) => p.id === id) || POSTS[0];
const corDoPost = (p) => (p.serie ? SERIE.cor : livro(p.c).cor);
const nomeDoLivro = (p) => (p.serie ? SERIE.nome : livro(p.c).nome);
const TAGS = (() => {
  const m = new Map();
  POSTS.forEach((p) => p.tags.forEach((t) => m.set(t, [...(m.get(t) || []), p.id])));
  return [...m.entries()].sort((a, b) => b[1].length - a[1].length).map(([nome, ids]) => ({ nome, ids }));
})();
