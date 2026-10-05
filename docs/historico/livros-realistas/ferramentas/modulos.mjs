/**
 * playwright-core e sharp vêm do node_modules do blog: o desta pasta (se a branch tiver o seu) ou o da
 * pasta irmã ../blog (a branch fica numa pasta separada, sem node_modules próprio).
 */
import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const aqui = dirname(fileURLToPath(import.meta.url));
const candidatos = [resolve(aqui, "../../../.."), resolve(aqui, "../../../../../blog")];
const raiz = candidatos.find((c) => existsSync(join(c, "node_modules", "playwright-core")));
if (!raiz) throw new Error("Não achei node_modules com playwright-core (rode npm install na raiz do blog).");
const require = createRequire(join(raiz, "package.json"));

export const { chromium } = require("playwright-core");
export const sharp = require("sharp");
export const RAIZ_DO_BLOG = raiz;
