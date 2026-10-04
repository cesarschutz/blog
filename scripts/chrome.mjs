/** Permite usar o Chrome instalado ou o Chrome for Testing num ambiente de CI. */
export const opcoesDoChrome = {
  headless: true,
  ...(process.env.CHROME_EXECUTABLE_PATH
    ? { executablePath: process.env.CHROME_EXECUTABLE_PATH }
    : { channel: "chrome" }),
};
