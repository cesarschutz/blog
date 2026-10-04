/**
 * O papel de parede do computador (rodada 3, C1): areia com dobras de seda, desenho original nosso, no
 * espírito do "Golden Gate" (nada da imagem da Apple). Um SVG por tema, gerado no build com as cores de
 * src/computador/cores.ts, e servido como imagem de fundo: o navegador o rasteriza uma vez só (sem filtro
 * de desfoque, só gradientes), e arrastar janelas por cima não o redesenha.
 */
import type { APIRoute, GetStaticPaths } from "astro";
import { claro, escuro } from "../../computador/cores";

export const getStaticPaths = (() => [{ params: { tema: "claro" } }, { params: { tema: "escuro" } }]) satisfies GetStaticPaths;

export const GET: APIRoute = ({ params }) => {
  const c = params.tema === "escuro" ? escuro : claro;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
<defs>
  <linearGradient id="fundo" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${c["parede-alto"]}"/>
    <stop offset="0.52" stop-color="${c["parede-meio"]}"/>
    <stop offset="1" stop-color="${c["parede-baixo"]}"/>
  </linearGradient>
  <radialGradient id="claridade" cx="0.22" cy="0.12" r="0.75">
    <stop offset="0" stop-color="${c["parede-luz"]}" stop-opacity="0.75"/>
    <stop offset="1" stop-color="${c["parede-luz"]}" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="seda-a" x1="0.3" y1="0.18" x2="0.62" y2="0.86">
    <stop offset="0" stop-color="${c["parede-luz"]}" stop-opacity="0.95"/>
    <stop offset="0.07" stop-color="${c["parede-luz"]}" stop-opacity="0.6"/>
    <stop offset="0.3" stop-color="${c["parede-dobra"]}" stop-opacity="0.32"/>
    <stop offset="0.68" stop-color="${c["parede-sombra"]}" stop-opacity="0.46"/>
    <stop offset="1" stop-color="${c["parede-sombra"]}" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="seda-b" x1="0.45" y1="0" x2="0.55" y2="1">
    <stop offset="0" stop-color="${c["parede-sombra"]}" stop-opacity="0"/>
    <stop offset="0.55" stop-color="${c["parede-sombra"]}" stop-opacity="0.3"/>
    <stop offset="0.86" stop-color="${c["parede-dobra"]}" stop-opacity="0.3"/>
    <stop offset="1" stop-color="${c["parede-luz"]}" stop-opacity="0.5"/>
  </linearGradient>
  <linearGradient id="seda-c" x1="0.2" y1="0" x2="0.5" y2="1">
    <stop offset="0" stop-color="${c["parede-luz"]}" stop-opacity="0.85"/>
    <stop offset="0.12" stop-color="${c["parede-luz"]}" stop-opacity="0.35"/>
    <stop offset="0.5" stop-color="${c["parede-dobra"]}" stop-opacity="0.25"/>
    <stop offset="1" stop-color="${c["parede-sombra"]}" stop-opacity="0.55"/>
  </linearGradient>
  <linearGradient id="fio" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="${c["parede-fio"]}" stop-opacity="0"/>
    <stop offset="0.3" stop-color="${c["parede-fio"]}" stop-opacity="0.85"/>
    <stop offset="0.75" stop-color="${c["parede-fio"]}" stop-opacity="0.7"/>
    <stop offset="1" stop-color="${c["parede-fio"]}" stop-opacity="0"/>
  </linearGradient>
  <radialGradient id="canto" cx="1" cy="1" r="0.7">
    <stop offset="0" stop-color="${c["parede-sombra"]}" stop-opacity="0.45"/>
    <stop offset="1" stop-color="${c["parede-sombra"]}" stop-opacity="0"/>
  </radialGradient>
</defs>
<rect width="1600" height="1000" fill="url(#fundo)"/>
<rect width="1600" height="1000" fill="url(#claridade)"/>
<path d="M-120 250 C 180 170 420 330 690 250 S 1130 10 1420 -120 L 1720 -120 L 1720 140 C 1400 250 1160 360 870 420 S 260 520 -120 640 Z" fill="url(#seda-b)"/>
<path d="M-140 860 C 280 790 540 470 900 360 S 1460 230 1740 40 L 1740 430 C 1420 500 1180 560 930 650 S 420 980 -140 1140 Z" fill="url(#seda-a)"/>
<path d="M-140 860 C 280 790 540 470 900 360 S 1460 230 1740 40" fill="none" stroke="url(#fio)" stroke-width="2.4"/>
<path d="M760 1120 C 980 900 1180 800 1740 720 L 1740 1120 Z" fill="url(#seda-c)"/>
<path d="M760 1120 C 980 900 1180 800 1740 720" fill="none" stroke="url(#fio)" stroke-width="1.6" opacity="0.8"/>
<rect width="1600" height="1000" fill="url(#canto)"/>
</svg>`;
  return new Response(svg, { headers: { "Content-Type": "image/svg+xml; charset=utf-8" } });
};
