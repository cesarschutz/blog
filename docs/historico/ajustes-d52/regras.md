# Regras de trabalho da D52 (para mim e para os agentes)

Quem coordena é a sessão principal. Os agentes recebem um item (ou uma pesquisa) e seguem isto.

## Antes de mexer

- Ler `CLAUDE.md` (raiz), o trecho do `DESIGN.md` que toca o item e o item em [controle.md](controle.md).
- O caminho tem espaço (`novo site`): aspas em todo comando.
- Node 24 sempre: `fnm exec --using=24 <comando>` (o `node` do bash é o 25 do Homebrew).
- `../blog-atual` é **somente leitura** (nem `git status` comum lá; use `git --no-optional-locks`).

## Como os agentes se dividem (decidido em 27/09/2026)

Vários agentes trabalham ao mesmo tempo **na mesma árvore** (o dev da 4322 recarrega com as edições de
todos). O esforço de cada um é escolhido pelo modelo: Opus para o que pede criatividade e diagnóstico
difícil (animação, design), Sonnet para execução bem definida, Haiku para conferência mecânica.

| Agente | Itens | Arquivos principais |
| --- | --- | --- |
| Pesquisa | referências (GSAP e outras) | só `docs/historico/ajustes-d52/` |
| Trocas | A02, A03, B10 | `src/scripts/troca.js`, `base.css` (trechos da troca) |
| Pilha | B01, B09 | `PainelHome.astro` e o que a troca da pilha usar |
| Abertura | A01, B12, B13 | `Abertura.astro`, `Marca.astro`, `estante-viva.ts` |
| Artigo | B04, B05, B06 | `Sumario.astro`, `BarraLeitura.astro`, `artigo.ts`, `Atalhos.astro`, `Busca.astro` |
| Livros e visor | A04, B08 | `visor.css`, `livro.css`, `Livro3D.astro` |
| Simples | B02, B03, C01 | `LivroAmpliado.astro` (links), `lib/posts.ts`, `tema.ts`, `SeletorModo.astro` |
| Listas | B07, B11 | `archive.astro`, `tags/*`, `ListaFiltrada.astro`, ícones das tags |
| Home | C02, C03 | `[...page].astro`, `Destaque.astro`, `Cartao.astro`, `ItemLista.astro`, `TopoArtigo.astro` |

C04 e C05 vêm depois, quando os outros terminarem (mexem no site todo).

## Enquanto mexe

- **Um commit por item, só com os arquivos do item**, sem push: `git add` não; use
  `git commit -m "D52 <item>: <resumo>" -- <arquivo1> <arquivo2> …` (commit por caminho, que não leva
  o que outro agente deixou no stage). Mensagem em pt-BR, terminando com a linha
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Se o git reclamar de `index.lock`, espere
  uns segundos e repita. **Não editar `docs/historico/ajustes-d52/controle.md`** (a sessão principal marca).
- Não mexer em `docs/decisoes.md`, `docs/estado.md` nem `DESIGN.md`: o que precisar ser registrado vai
  no relatório, na seção "Para registrar" (a sessão principal junta tudo na D52). Exceção: regra de
  processo que o próprio item cria (ex.: o ícone de tag nova no `CAPAS.md` e na skill `post`).
- Mexer só no que o item pede. Se precisar tocar um arquivo de outro agente (tabela acima), fazer
  edições pequenas e localizadas com o Edit (nunca reescrever o arquivo inteiro com Write) e dizer no
  relatório. Erro de `npm run check` em arquivo que você não tocou: é de outro agente no meio do
  trabalho; espere e confira de novo.
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
- Navegador: **o MCP `chrome-devtools`**, sempre numa **aba própria** (`new_page` com
  `isolatedContext` com o nome do agente, e o `pageId` dela em toda chamada), fechada no fim. O Cesar
  usa as mesmas abas do Chrome. Com vários agentes, a aba de um fica oculta quando outro traz a dele
  para a frente, e aba oculta não roda `requestAnimationFrame` (animação parada é artefato disso):
  antes de gravar, traga a sua para a frente (`select_page` com `bringToFront`) e, se os quadros
  vierem parados, repita. Para gravar animação quadro a quadro sem disputar a janela, vale também um
  Chrome **headless próprio** por script com o `playwright-core` do projeto
  (`chromium.launch({ channel: "chrome", headless: true })`, como em `scripts/og.mjs`), com o script
  no scratchpad ou em `.astro/depuracao/<agente>/`. A conferência visual final é no MCP.
- A máquina está carregada (vários agentes, checks e gravações ao mesmo tempo): julgue os quadros pelo
  que aparece (ordem, sobreposição, tremor), não pelo FPS.
- Bug de animação (treme, pisca, some e aparece): gravar trace com screenshots e ver os quadros (ver a
  memória "animacao-quadro-a-quadro": `performance_start_trace` com `reload: false, autoStop: false`,
  disparar por `evaluate_script` com `setTimeout`, `performance_stop_trace` com `filePath` em
  `.astro/depuracao/`, tirar os `Screenshot` com Python e montar grades com PIL). Congelar a View
  Transition engana.
- Larguras: 320, 390, 768, 1280 e 1600px; os dois temas; sem rolagem lateral; console sem erro.
- `fnm exec --using=24 npm run check` sem erros antes de devolver.

## Relatório do agente

Escrever em `docs/historico/ajustes-d52/diagnosticos/<item>.md` (curto): causa ou proposta, o que mudou (arquivos),
como conferiu, o que ficou de fora e por quê.
