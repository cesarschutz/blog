# Regras de trabalho da D52 (para mim e para os agentes)

Quem coordena é a sessão principal. Os agentes recebem um item (ou uma pesquisa) e seguem isto.

## Antes de mexer

- Ler `CLAUDE.md` (raiz), o trecho do `DESIGN.md` que toca o item e o item em [controle.md](controle.md).
- O caminho tem espaço (`novo site`): aspas em todo comando.
- Node 24 sempre: `fnm exec --using=24 <comando>` (o `node` do bash é o 25 do Homebrew).
- `../blog-atual` é **somente leitura** (nem `git status` comum lá; use `git --no-optional-locks`).

## Enquanto mexe

- **Não commitar e não dar push.** Quem commita é a sessão principal, um item por commit, depois de
  conferir. O agente devolve a lista de arquivos que mudou e o que conferiu.
- Mexer só no que o item pede. Se precisar tocar um arquivo que outro item também toca (`troca.js`,
  `base.css`, `livro.css`, `Sumario.astro`, `artigo.ts`), fazer edições pequenas e localizadas (nunca
  reescrever o arquivo inteiro) e dizer no relatório.
- Cores só por tokens CSS (`var(--ink)`, `var(--acento)`…). Nada de hex solto em componente ou SVG.
- Toda animação respeita `prefers-reduced-motion` (estado final, sem prender a tela) e é mais leve
  no celular.
- JavaScript só onde há interação (lista no `CLAUDE.md`); artigo sem componente funciona sem JS.
- Não pode parecer feito por IA: nada de fonte genérica, gradiente decorativo, sombra genérica,
  animação de entrada em cada seção, rótulo em caixa alta ou emoji.
- O cabeçalho é fixo: âncora ou `sticky` descontam `--altura-topo`.
- CSS com escopo do Astro soma especificidade por parte do seletor (ver `CLAUDE.md`).
- Texto em pt-BR com acentuação correta.

## Para conferir

- O dev já está no ar em <http://127.0.0.1:4322> (não parar nem reiniciar sem avisar; outros agentes
  usam). O preview do Cesar fica na 4323 (só a sessão principal rebuilda e reinicia).
- Navegador: **só o MCP `chrome-devtools`**, sempre numa **aba própria** (`new_page` com
  `isolatedContext`), fechada no fim. O Cesar usa as mesmas abas do Chrome.
- Bug de animação (treme, pisca, some e aparece): gravar trace com screenshots e ver os quadros (ver a
  memória "animacao-quadro-a-quadro": `performance_start_trace` com `reload: false, autoStop: false`,
  disparar por `evaluate_script` com `setTimeout`, `performance_stop_trace` com `filePath` em
  `.astro/depuracao/`, tirar os `Screenshot` com Python e montar grades com PIL). Congelar a View
  Transition engana.
- Larguras: 320, 390, 768, 1280 e 1600px; os dois temas; sem rolagem lateral; console sem erro.
- `fnm exec --using=24 npm run check` sem erros antes de devolver.

## Relatório do agente

Escrever em `docs/ajustes-d52/diagnosticos/<item>.md` (curto): causa ou proposta, o que mudou (arquivos),
como conferiu, o que ficou de fora e por quê.
