/**
 * A única maneira de abrir o Chrome nos scripts (D84): `chromium.launch(opcoesDoChrome)`.
 *
 * Qual navegador abrir, nesta ordem:
 *   1. CHROME_PATH (o nome documentado no CLAUDE.md e no verificar-ambiente.mjs);
 *   2. CHROME_EXECUTABLE_PATH (apelido, de quando só os testes do frontend liam a variável);
 *   3. o Chromium da sessão na nuvem, se existir na máquina;
 *   4. o Chrome instalado (`channel: "chrome"`), o caso do Mac do Cesar e dos runners do GitHub Actions.
 *
 * Uma variável definida vale como está: com o caminho errado o Playwright reclama, em vez de o script
 * cair em outro navegador sem avisar.
 */
import { existsSync } from "node:fs";

const CHROMIUM_DA_NUVEM = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

const executavel =
  process.env.CHROME_PATH ||
  process.env.CHROME_EXECUTABLE_PATH ||
  (existsSync(CHROMIUM_DA_NUVEM) ? CHROMIUM_DA_NUVEM : undefined);

export const opcoesDoChrome = {
  headless: true,
  ...(executavel ? { executablePath: executavel } : { channel: "chrome" }),
};
