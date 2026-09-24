#!/usr/bin/env node
/**
 * Ilustrações da série "Atualizações do Java" (D17): não são desenhadas à mão. Este script gera o
 * padrão fixo no traço "A + C" para cada LTS de src/data/java.ts: a caneca na cor da série com
 * "JAVA" e a versão, o carimbo LTS (na próxima LTS, caneca e carimbo em linha fantasma) e, só no
 * recorte largo, o caminho desde a LTS anterior, com as versões do meio e a data. O guia (Parte 1)
 * leva a caneca e a linha das LTS. Saída em src/ilustracoes/; depois, valide e confira na folha.
 *
 *   node scripts/desenho/java.mjs        (todas)
 */
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { GUIA_JAVA, JAVA_LTS } from "../../src/data/java.ts";

const pasta = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "src", "ilustracoes");

// Recortes iguais aos do desenho de referência: a caneca fica na área segura.
const RAIZ = `viewBox="0 -40 1200 900" data-largo="80 158 1100 468" data-medio="200 100 900 600" data-quadrado="415 110 670 670" data-og="350 -40 740 883" data-segura="415 158 670 468"`;

const CORPO = "M0 0 H240 V120 A60 60 0 0 1 180 180 H60 A60 60 0 0 1 0 120 Z";
const ALCA = "M240 28 H282 A52 52 0 0 1 282 132 H240";

/** A caneca, com o canto superior esquerdo do corpo em (x, y). */
function caneca(x, y, { futura = false, texto = "" } = {}) {
  const linha = futura ? "fantasma" : "linha";
  const volume = futura
    ? ""
    : `<path d="${CORPO}" transform="translate(14 14)" class="hachura"/>
      <path d="${CORPO}" transform="translate(7 6)" class="cor"/>`;
  return {
    tinta: `<g transform="translate(${x} ${y})">
      <path d="M75 -48 C58 -80 92 -100 75 -132" class="linha"/>
      <path d="M155 -48 C138 -80 172 -100 155 -136" class="linha"/>
      ${volume}
      <path d="${CORPO}" class="${linha}"/>
      <path d="${ALCA}" class="${linha}"/>
      <path d="M-25 222 H265" class="linha"/>
    </g>`,
    texto: texto && `<g transform="translate(${x} ${y})">${texto}</g>`,
  };
}

/** Carimbo girado; o rótulo longo ("PRÓXIMA LTS") vai em 80% do corpo para caber na moldura. */
function carimbo(cx, cy, rotulo, futura) {
  const longo = rotulo.length > 4;
  const largura = longo ? 250 : 124;
  const escala = longo ? ` transform="translate(${cx} ${cy}) scale(0.8) translate(${-cx} ${-cy})"` : "";
  return {
    tinta: `<g transform="rotate(-12 ${cx} ${cy})"><rect x="${cx - largura / 2}" y="${cy - 27}" width="${largura}" height="54" rx="6" class="${futura ? "fantasma" : "carimbo"}"/></g>`,
    texto: `<g transform="rotate(-12 ${cx} ${cy})"><text x="${cx}" y="${cy + 11}" text-anchor="middle" class="carimbo-texto"${escala}>${rotulo}</text></g>`,
  };
}

/** Caminho desde a LTS anterior (só no recorte largo, nas anotações). */
function caminho(lts, anterior) {
  const de = anterior ?? lts.version - 1;
  const meio = Array.from({ length: lts.version - de - 1 }, (_, i) => de + 1 + i);
  const lancadas = new Set(lts.upcoming ? [...lts.covers.matchAll(/\d+/g)].map((m) => Number(m[0])) : meio);
  const [x0, x1, y] = [118, 372, 430];
  const passo = (x1 - x0) / (meio.length + 1);
  const pontos = meio
    .map((v, i) => {
      const x = x0 + passo * (i + 1);
      const saiu = lancadas.has(v);
      return `<circle cx="${x}" cy="${y}" r="6" class="chamada"/>
      <text x="${x}" y="${y + 36}" text-anchor="middle" class="nota-pequena">${v}${saiu ? "" : "?"}</text>`;
    })
    .join("\n      ");
  const quando = lts.upcoming ? `previsto para ${lts.release}` : `lançado em ${lts.release}`;
  return `<g class="anotacao">
      <text x="${x0 - 8}" y="${y - 44}" class="nota">desde o Java ${de}</text>
      <path d="M${x0} ${y} H${x1}" class="chamada"/>
      <path d="M${x1 - 10} ${y - 8} L${x1} ${y} L${x1 - 10} ${y + 8}" class="chamada"/>
      ${pontos}
      <text x="${x0 - 8}" y="${y + 88}" class="nota-pequena">${quando}</text>
    </g>`;
}

function svg(alt, tinta, textos) {
  return `<svg xmlns="http://www.w3.org/2000/svg" ${RAIZ}
  aria-label="${alt}">
  <g class="tinta">
    ${tinta.join("\n    ")}
  </g>
  ${textos.filter(Boolean).join("\n  ")}
</svg>
`;
}

const ordenadas = [...JAVA_LTS].sort((a, b) => a.version - b.version);
for (const [i, lts] of ordenadas.entries()) {
  const anterior = ordenadas[i - 1]?.version;
  const futura = Boolean(lts.upcoming);
  const c = caneca(590, 330, {
    futura,
    texto: `<text x="120" y="58" text-anchor="middle" class="codigo">JAVA</text>
      <text x="120" y="150" text-anchor="middle" class="numero">${lts.version}</text>`,
  });
  // Girado, o canto de baixo desce: o carimbo longo fica mais alto para não sair do recorte largo.
  const selo = futura ? carimbo(905, 565, "PRÓXIMA LTS", true) : carimbo(930, 585, "LTS", false);
  const alt = futura
    ? `Uma caneca em linha tracejada com JAVA ${lts.version} e o carimbo tracejado de próxima LTS: a versão ainda não saiu.`
    : `Uma caneca com JAVA ${lts.version} e o carimbo LTS, a versão de suporte longo lançada em ${lts.release}.`;
  writeFileSync(join(pasta, `java-${lts.version}.svg`), svg(alt, [c.tinta, selo.tinta], [c.texto, selo.texto, caminho(lts, anterior)]));
  console.log(`✓ java-${lts.version}.svg`);
}

// Guia: a caneca e a linha das LTS por baixo, com a próxima em linha fantasma.
const c = caneca(590, 290, { texto: `<text x="120" y="110" text-anchor="middle" class="codigo">JAVA</text>` });
const [x0, x1, y] = [470, 1030, 600];
const passo = (x1 - x0) / (ordenadas.length - 1);
const ultimaLancada = x0 + passo * (ordenadas.filter((l) => !l.upcoming).length - 1);
// Linha cheia até a última LTS lançada, tracejada até a próxima; os pontos tapam a linha.
const linhaDasLts = [
  `<path d="M${x0} ${y} H${ultimaLancada}" class="linha"/>`,
  `<path d="M${ultimaLancada} ${y} H${x1}" class="fantasma"/>`,
  ...ordenadas.map((lts, i) => `<circle cx="${x0 + passo * i}" cy="${y}" r="9" class="${lts.upcoming ? "fantasma" : "papel"}"/>`),
].join("\n    ");
const rotulos = ordenadas
  .map((lts, i) => `<text x="${x0 + passo * i}" y="${y - 22}" text-anchor="middle" class="codigo">${lts.version}</text>`)
  .join("\n  ");
writeFileSync(
  join(pasta, `${GUIA_JAVA}.svg`),
  svg(
    `Uma caneca com JAVA sobre a linha das versões LTS, do 8 ao ${ordenadas.at(-1).version}, com a próxima ainda tracejada.`,
    [c.tinta, linhaDasLts],
    [c.texto, rotulos],
  ),
);
console.log(`✓ ${GUIA_JAVA}.svg`);
