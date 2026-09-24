/**
 * Corpus da medição da busca (D2): os 26 posts reais mais posts sintéticos até o total pedido,
 * com semente fixa. Os sintéticos embaralham parágrafos reais e trocam uma parte das palavras por
 * vocabulário novo (pseudo-palavras), para o vocabulário crescer como num blog de verdade. O tamanho
 * segue a meta nova (1,5 a 3 mil palavras), com alguns posts longos. Frases-marcadoras conferem o
 * ranking (ver gabarito.json). Títulos sintéticos não usam os assuntos reais, para não competir com eles.
 */
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

function semente(valor) {
  let s = valor >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SILABAS = ["ba", "ce", "di", "lo", "mu", "ra", "te", "xo", "vel", "tran", "qui", "zar", "nor", "pe", "sim", "cu", "fa", "gri", "lan", "mo"];

export function gerarCorpus(total, pastaReais, destino) {
  const aleatorio = semente(20260924);
  const escolher = (lista) => lista[Math.floor(aleatorio() * lista.length)];
  const inteiro = (min, max) => min + Math.floor(aleatorio() * (max - min + 1));

  rmSync(destino, { recursive: true, force: true });
  mkdirSync(destino, { recursive: true });
  const reais = readdirSync(pastaReais).filter((f) => f.endsWith(".md"));
  for (const f of reais) cpSync(join(pastaReais, f), join(destino, f));
  if (total <= reais.length) return destino;

  // Parágrafos e títulos de seção reais, sem código, tabela, imagem nem HTML.
  const paragrafos = [];
  const secoes = [];
  const tags = new Set();
  for (const f of reais) {
    const [, fm, ...resto] = readFileSync(join(pastaReais, f), "utf8").split(/^---$/m);
    (fm.match(/^tags:\s*\[(.*)\]/m)?.[1] ?? "").split(",").forEach((t) => t.trim() && tags.add(t.trim()));
    const corpo = resto.join("---").replace(/```[\s\S]*?```/g, "");
    for (const bloco of corpo.split(/\n{2,}/)) {
      const b = bloco.trim();
      if (/^##+\s/.test(b)) secoes.push(b.replace(/^#+\s*/, ""));
      else if (b.length > 120 && !/^[|!<>\-*\d]/.test(b)) paragrafos.push(b.replace(/\s+/g, " "));
    }
  }
  const vocabularioTags = [...tags];
  const categorias = ["Arquitetura", "Java", "Observabilidade", "DevOps", "Dados", "Segurança"];

  const usadas = new Set();
  const pseudoPalavra = () => {
    let p;
    do p = Array.from({ length: inteiro(3, 4) }, () => escolher(SILABAS)).join("");
    while (usadas.has(p));
    usadas.add(p);
    return p;
  };
  const global = [];
  const maiuscula = (p) => p.charAt(0).toUpperCase() + p.slice(1);

  for (let i = 1; i <= total - reais.length; i++) {
    const id = String(i).padStart(4, "0");
    const proprias = Array.from({ length: 20 }, pseudoPalavra);
    global.push(...proprias);
    const sorteio = aleatorio();
    const alvo = sorteio < 0.7 ? inteiro(1500, 3000) : sorteio < 0.95 ? inteiro(3000, 5000) : inteiro(8000, 11000);

    const blocos = [];
    let palavras = 0;
    while (palavras < alvo) {
      if (blocos.length % 6 === 0) blocos.push(`## ${maiuscula(escolher(proprias))} e ${escolher(secoes)}`);
      const texto = escolher(paragrafos)
        .split(" ")
        .map((w) => (aleatorio() < 0.04 ? (aleatorio() < 0.5 ? escolher(proprias) : escolher(global)) : w))
        .join(" ");
      blocos.push(texto);
      palavras += texto.split(" ").length;
    }

    let titulo = `${maiuscula(proprias[0])} e ${maiuscula(proprias[1])} — um estudo de ${proprias[2]}`;
    // Frases-marcadoras do gabarito (só aparecem quando o corpus é grande o bastante).
    if (id === "0042") {
      titulo = `Zarvelino — o termo no título`;
      blocos.push("O zarvelino aparece uma vez no corpo.");
    }
    if (Number(id) > 42 && Number(id) <= 72) blocos.push("zarvelino zarvelino zarvelino, citado de passagem.");
    if (id === "0077") blocos.push("Aqui a reconciliação tardia de lotes aparece como frase exata.");
    if (Number(id) > 100 && Number(id) <= 130) blocos.push("A reconciliação veio antes. Uma entrega tardia. Os lotes ficaram para depois.");
    if (id === "0099") blocos.push("Uma maçaneta, com cedilha e acento.");

    const descricao = blocos.find((b) => !b.startsWith("##")).slice(0, 180).replace(/["\\]/g, "");
    const escolhidas = [...new Set(Array.from({ length: inteiro(2, 4) }, () => escolher(vocabularioTags)))];
    while (escolhidas.length < 2) escolhidas.push(vocabularioTags.find((t) => !escolhidas.includes(t)));
    const data = new Date(Date.UTC(2019, 0, 1) + aleatorio() * (Date.UTC(2026, 8, 1) - Date.UTC(2019, 0, 1)));
    const frontmatter = [
      "---",
      `title: "${titulo}"`,
      `description: "${descricao}"`,
      `published: ${data.toISOString().slice(0, 10)}`,
      `category: ${escolher(categorias)}`,
      `tags: [${escolhidas.join(", ")}]`,
      "---",
    ].join("\n");
    writeFileSync(join(destino, `sintetico-${id}.md`), `${frontmatter}\n\n${blocos.join("\n\n")}\n`);
  }
  return destino;
}
