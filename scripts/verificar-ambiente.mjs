// Confere se esta máquina tem o que o blog precisa (D35). Sem dependências: roda em Windows, macOS e
// Linux, antes mesmo do npm install. Usado pelo `npm run setup` e pelo hook SessionStart do Claude
// Code (com --hook, a saída vira contexto da sessão e o script nunca falha a sessão).
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { homedir, platform, arch } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const modoHook = process.argv.includes('--hook');
const windows = platform() === 'win32';
const faltas = [];
const avisos = [];

// Mensagens de andamento vão para o stderr: no hook, o stdout é só o resultado final.
const log = (msg) => process.stderr.write(`${msg}\n`);

// 1. Node: o pedido era 20.19+, mas o Astro 7 exige 22.12+ (engines do astro), e o projeto usa o 24
const [maior, menor] = process.versions.node.split('.').map(Number);
if (maior < 22 || (maior === 22 && menor < 12)) {
  faltas.push(`Node ${process.versions.node} é antigo: o Astro 7 exige o 22.12 ou mais novo, e o projeto usa o 24 (.node-version). Instale pelo https://nodejs.org ou pelo fnm/nvm.`);
} else if (maior < 24) {
  avisos.push(`Node ${process.versions.node} funciona, mas o projeto é testado no 24 (.node-version).`);
}

// 2. Dependências
if (!existsSync(join(raiz, 'node_modules'))) {
  log('node_modules não existe: rodando npm install…');
  const r = spawnSync(windows ? 'npm.cmd' : 'npm', ['install'], { cwd: raiz, stdio: ['ignore', 'pipe', 'pipe'], shell: windows });
  if (r.status !== 0) {
    faltas.push(`npm install falhou (código ${r.status ?? r.error?.message}). Rode "npm install" no projeto e veja o erro.`);
  }
}

// 3. Skills do projeto (versionadas em .claude/skills)
const skills = join(raiz, '.claude', 'skills');
const temSkill = (nome) => existsSync(join(skills, nome, 'SKILL.md'));
const nomes = existsSync(skills) ? readdirSync(skills) : [];
const exigidas = [
  ['post', temSkill('post')],
  ['impeccable', temSkill('impeccable')],
  ['gsap (gsap-core e outras)', nomes.some((n) => n.startsWith('gsap-') && temSkill(n))],
  ['web quality (web-quality-audit)', temSkill('web-quality-audit')],
];
for (const [nome, ok] of exigidas) {
  if (!ok) faltas.push(`Skill ${nome} não está em .claude/skills. Rode "git status" e "git checkout -- .claude/skills" (elas são versionadas).`);
}

// 4. Motor do Impeccable, que fica fora do repositório em ~/.impeccable (D35)
const versaoArq = join(skills, 'impeccable', 'scripts', 'VERSION');
if (existsSync(versaoArq)) {
  const versao = readFileSync(versaoArq, 'utf8').trim();
  const exe = windows ? 'impeccable.exe' : 'impeccable';
  const base = process.env.IMPECCABLE_HOME || join(homedir(), '.impeccable');
  const alvo = join(base, 'bin', versao, exe);
  if (!existsSync(alvo) && !(process.env.IMPECCABLE_BIN && existsSync(process.env.IMPECCABLE_BIN))) {
    const lancador = windows ? '.claude\\skills\\impeccable\\scripts\\impeccable.cmd' : '.claude/skills/impeccable/scripts/impeccable';
    faltas.push(`Motor do Impeccable ${versao} não está em ${alvo}. Rode "${lancador} engine-probe" no terminal: ele baixa o binário (${platform()}-${arch()}) do GitHub e confere o SHA-256.`);
  }
}

// 5. Chrome (imagens de compartilhamento no build, D10, e o chrome-devtools-mcp)
const candidatos = {
  darwin: ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', join(homedir(), 'Applications/Google Chrome.app/Contents/MacOS/Google Chrome')],
  win32: [process.env.PROGRAMFILES, process.env['PROGRAMFILES(X86)'], process.env.LOCALAPPDATA]
    .filter(Boolean).map((p) => join(p, 'Google', 'Chrome', 'Application', 'chrome.exe')),
  linux: ['/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/opt/google/chrome/chrome'],
}[platform()] ?? [];
const noPath = () => ['google-chrome', 'google-chrome-stable'].some((c) => spawnSync(c, ['--version'], { stdio: 'ignore' }).status === 0);
if (!candidatos.some((c) => existsSync(c)) && !(process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) && !(platform() === 'linux' && noPath())) {
  faltas.push('Google Chrome não foi encontrado. Instale em https://www.google.com/chrome/ (ou aponte CHROME_PATH para ele).');
}

// Resultado
const linhas = faltas.length === 0
  ? ['Ambiente OK', ...avisos.map((a) => `Aviso: ${a}`)]
  : ['Falta no ambiente do blog:', ...faltas.map((f) => `- ${f}`), ...avisos.map((a) => `Aviso: ${a}`)];
const texto = linhas.join('\n');

if (modoHook) {
  const contexto = faltas.length === 0
    ? texto
    : `${texto}\n\nResolva isto antes de qualquer tarefa ou diga ao Cesar o que ele precisa fazer (CLAUDE.md, "Em outro computador").`;
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: contexto }, systemMessage: texto }));
  process.exit(0);
}
console.log(texto);
process.exit(faltas.length === 0 ? 0 : 1);
