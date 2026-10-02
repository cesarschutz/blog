# Prompt: o design "Terminal" para o dev-note

Este documento descreve, de ponta a ponta, um design de site que se parece com um **editor de código
elegante**. Foi construído como protótipo para um blog técnico (o do Cesar Schutz) e escrito para ser
reaproveitado no **dev-note**, um projeto de notas e artigos. Ele se sustenta sozinho: traz os valores
(cores, medidas, tempos, curvas, atalhos, comportamento) e não depende de nenhum arquivo do projeto de
origem.

Como usar: cole este documento no começo da conversa do dev-note e peça "construa a interface
seguindo este documento". O framework não está definido. Tudo aqui é HTML, CSS e JavaScript
puros e vale para qualquer um (Astro, Next, SvelteKit, Vite com React). Onde o texto diz "página",
leia "rota". Onde diz "livro", leia "a coleção a que a nota pertence" (caderno, projeto, área, o nome
que o dev-note usar). Onde diz "artigo", leia "nota". O protótipo foi feito com um site
multipágina (cada rota é um documento HTML) com View Transitions entre as páginas; se o dev-note for
uma SPA, as partes de transição e de abas ficam mais simples (indicadas abaixo).

Os nomes de classe e de atributo (`t-barra`, `data-paleta`…) são os do protótipo, em português. Podem
ser trocados à vontade, o que importa é o comportamento.

---

## 1. O conceito

O site é a **área de trabalho de um editor**, não um terminal de filme. Há uma barra de título, uma
árvore de arquivos à esquerda, abas das últimas páginas abertas, um editor no centro, uma barra de
status embaixo e uma **paleta de comandos** como navegação principal. Cada página é um arquivo ou uma
pasta de um repositório imaginário: a home é `~/blog/README.md`, uma nota é
`~/blog/livros/dados/bloqueio-otimista.md`, a página de categorias é a saída de `tree`, a lista de
uma pasta é a saída de `ls -la`, as tags são a saída de `grep -c`.

Princípios que mantêm o design elegante e fora do clichê:

- **Nada de terminal verde, brilho, varredura de CRT ou texto "hacker".** A paleta é grafite e âmbar, e
  é o refinamento de um bom editor moderno.
- **O texto longo não é mono.** A interface (árvore, abas, status, caminhos, listas) é monoespaçada; o
  corpo da nota é uma sans legível. Ler um artigo inteiro em mono cansa.
- **Teclado de primeira classe**, mas sem prender: atalhos de uma tecla podem ser desligados, e nunca
  valem dentro de um campo de texto.
- **Detalhes curtos.** Quase tudo dura de 0,12 a 0,25 s, anima só `transform`, `opacity` e `clip-path`,
  e **nada fica em laço infinito** (o cursor pisca 3 vezes e para).
- O texto que parece digitado **já está no HTML**. O efeito só esconde e revela.
- Painéis retos separados por filetes de 1px. Cantos de 6px apenas no que flutua (paleta, dica, folha
  de atalhos). Nenhuma sombra, exceto a da paleta de comandos, e só no tema escuro.

Estética em uma frase: grafite, âmbar, filetes finos, mono de qualidade, uma sans para ler, e um
marcador âmbar de 2px que aparece onde o foco está.

---

## 2. A moldura (em todas as páginas, a partir de 1024px)

A moldura é fixa. Só o miolo (o editor) rola, com a rolagem normal da janela, não de um contêiner
interno.

```
+--------------------------------------------------------------------------+
| [☰] cs@blog:~$ ▌   ~ / blog / livros / dados / x.md        [⌘K Comandos] ☀ |  barra de título 40px
+--------------+-----------------------------------------------------------+
| ~/blog   main| README.md | x.md | #spring |                               |  abas 36px
|--------------|-----------------------------------------------------------|
| ▸ README.md  |                                                           |
| ▸ artigos 28 |                    o editor (rola)                        |
| ▾ livros     |                                                           |
|   ▸ dados 3  |                                                           |
|   ▸ sre   5  |                                                           |
| ▸ revistas   |                                                           |
| ▸ tags    30 |                                                           |
+--------------+-----------------------------------------------------------+
| ⎇ main  ■ livros/dados  mensagem          Ln 120, 42%  12 min UTF-8 ⌨ ?  |  status 26px
+--------------------------------------------------------------------------+
```

### 2.1 Dimensões e camadas

| Medida | Valor |
|---|---|
| Barra de título | 40px (44px abaixo de 1024px) |
| Abas | 36px (0 abaixo de 1024px: somem) |
| Barra de status | 26px |
| Barra lateral | 264px de largura (0 recolhida, 0 abaixo de 1024px) |
| Calha dos números de linha | 56px (0 abaixo de 640px) |
| Respiro lateral do editor | `clamp(16px, 3vw, 40px)` |
| Medida do texto da nota | 70 caracteres (`36.5em` em Bespoke Sans a 1,0625rem) |

Variáveis: `--barra-h`, `--abas-h`, `--status-h`, `--lateral-w`, `--lateral-atual` (vale `--lateral-w`, ou
0 quando recolhida ou no celular), `--altura-topo` (= barra + abas). A área do editor tem
`padding: calc(var(--barra-h) + var(--abas-h)) 0 var(--status-h) var(--lateral-atual)`. Assim, ao
recolher a lateral, o conteúdo ocupa o espaço.

Camadas (`z-index`): barra de título e status 30, topo (botão `gg`) 25, barra lateral e abas 20, véu da
gaveta 19, dica flutuante 50, link "Pular para o conteúdo" 60. Para as âncoras não ficarem escondidas
sob a moldura: `html { scroll-padding-top: calc(var(--altura-topo) + 16px); scroll-padding-bottom: calc(var(--status-h) + 16px); }`.

Todas as barras fixas levam `contain: layout style` (a lateral também `paint`) para o navegador
isolar o custo.

### 2.2 Barra de título

Da esquerda para a direita, em `display:flex; align-items:center; gap:10px; padding:0 8px 0 6px`,
fundo `--painel`, filete inferior de 1px (`--filete`):

1. **Botão da árvore** (30x28, ícone de painel dividido). Alterna a barra lateral. No celular abre a
   gaveta. Leva `aria-expanded` e um rótulo só para leitor de tela ("Recolher a barra lateral
   (⌘B)" / "Mostrar a barra lateral (⌘B)" / "Abrir os arquivos").
2. **Marca**: `cs@blog:~$` em 13px, peso 600. O `cs` em âmbar, o `@` e o `:~$` em texto-2 com peso
   400. Depois dela um **cursor em bloco** (0,55em x 1,05em, âmbar) que **pisca 3 vezes e para** (ver
   detalhes). Ao passar o mouse na marca, o cursor pisca mais uma vez. A marca é um link para a home.
3. **Migalhas do caminho** (ocupam o espaço que sobra, centradas): `~ / blog / livros / dados / x.md`
   em 12,5px, texto-2. Cada pedaço com página é um link: no hover vira texto cheio e ganha sublinhado
   âmbar de 1px (`text-underline-offset:4px`, a cor do sublinhado transiciona de transparente, 0,12 s).
   O último pedaço (a página atual) é texto normal com `aria-current="page"`. O separador `/` é
   desenhado por `::before` com opacidade 0,7. Abaixo de 1024px mostra só o último pedaço.
4. **"Comandos"**: botão com borda de 1px (`--filete-forte`), fundo `--fundo`, lupa, o texto
   "Comandos" e uma tecla `⌘K` (`Ctrl K` fora do Mac) no estilo `kbd`. No hover a borda vai a âmbar a
   50% e o `kbd` fica âmbar. No celular só a lupa.
5. **Tema**: botão 30px com sol e lua (mostra um dos dois conforme o tema).

Por cima das migalhas existe um elemento `.t-comando` (`position:absolute; inset:0`, escondido) que só
aparece durante a troca de página (seção 5.3).

### 2.3 Barra lateral (a árvore de arquivos)

- `position:fixed; top:var(--barra-h); bottom:var(--status-h); left:0; width:264px`, fundo
  `--painel`, filete à direita.
- **Cabeça** com a altura das abas (36px): `~/blog` à esquerda e, à direita, o ícone de ramo do git
  mais "main", em RX100 13px.
- **Árvore**: `ul` aninhada, cada linha com 24px de altura e recuo
  `padding-left: calc(6px + nivel * 12px)`. Estrutura de uma linha: uma "seta" de 18px (chevron de 12px
  que gira 90° quando aberta) + o nó (ícone, nome, contagem). Raízes:

  ```
  README.md
  artigos/            (28)   todos os artigos por data (montada só ao abrir)
  livros/                    uma pasta por livro, na cor dele, com os artigos dentro
  revistas/                  as séries
  tags/               (30)   uma entrada por tag, com a contagem
  ```

  No dev-note: troque `livros/` e `revistas/` pelas coleções do dev-note (cadernos, projetos).
- **Cor da pasta**: cada pasta de livro usa a cor dele, misturada com o texto do tema para manter o
  contraste: `--pasta: color-mix(in oklab, var(--cor), var(--texto) var(--pasta-mistura))`, com
  `--pasta-mistura: 0%` no claro e `48%` no escuro.
- **Hover**: a linha ganha o fundo `--painel-2`, o ícone vai a âmbar, e a **pasta abre** (a tampa gira
  20°, ver ícones). Foco por teclado: `box-shadow: inset 0 0 0 3px var(--ambar-25)`.
- **Página atual**: texto peso 600, fundo `--ambar-12` e uma barra âmbar de 2px na esquerda
  (`.t-marcador`, `position:absolute; inset:0 auto 0 0; width:2px`) com
  `view-transition-name: t-marcador`, de modo que, na troca de página, **ele desliza** do arquivo
  antigo ao novo (isso vem de graça das View Transitions com o mesmo nome; numa SPA, anime o
  `translateY` do marcador).
- **Abrir e fechar pastas**: clique na seta (ou na linha, nas pastas sem página). Os filhos entram por
  `clip-path: inset(0 0 100% 0)` para `inset(0)` em 0,2 s (`--curva`, classe temporária `t-abrindo`
  durante a animação).
- **Teclado** (padrão do editor, com "tabindex móvel": só um item da árvore fica na ordem do Tab, o
  último focado ou o atual): ↓ e ↑ andam; → abre a pasta (se já aberta, desce ao primeiro filho); ←
  fecha a pasta (se já fechada, sobe para a pasta de cima); Home e End vão ao primeiro e ao último.
- **Estado guardado**:
  - `sessionStorage["t-pastas"]`: `{ idDaPasta: 1|0 }`, as pastas que o leitor abriu ou fechou;
  - `sessionStorage["t-arvore-y"]`: o `scrollTop` da árvore (gravado com atraso de 120 ms);
  - `localStorage["t-arvore-fechada"]`: `"1"` se a lateral foi recolhida.
  Um script **no `<head>`**, antes da primeira pintura, lê o `localStorage` e põe `html.t-sem-arvore`;
  outro, logo depois da árvore, repõe pastas e rolagem. Assim a barra lateral não "pisca" nem pula
  entre uma página e outra.
- **Recolher (⌘B ou o botão)**: grava a escolha, mostra a mensagem `> barra lateral recolhida` na
  barra de status e usa `document.startViewTransition` (com a classe `t-alternando` no `<html>`): a
  lateral sai para a esquerda por `translateX(-100%)` em 0,22 s e o conteúdo se reacomoda. Sem View
  Transitions ou com movimento reduzido, troca direto. Recolhida: `visibility:hidden; transform:translateX(-100%)`.
- **Celular e tablet (menos de 1024px)**: a lateral vira **gaveta**:
  `width:min(86vw, 320px)`, `transform:translateX(-100%)` fechada, transição de 0,22 s ao abrir
  (`html.t-gaveta`). Um véu (`.t-veu`, fundo `--veu`, `z-index:19`) cobre o resto; clicar no véu ou
  apertar Esc fecha e devolve o foco ao botão. Ao abrir, o foco vai ao item atual da árvore.

### 2.4 Abas

- `position:fixed; top:var(--barra-h); left:var(--lateral-atual); right:0; height:36px`, fundo
  `--painel`, filete inferior. Lista em `display:flex; overflow-x:auto`, sem barra de rolagem.
- Cada aba: `max-width:260px`, altura 100% + 1px (a aba atual "fura" o filete), filete à direita. Dentro:
  ícone (arquivo, pasta ou tag) + nome truncado com reticências, `padding: 0 32px 0 12px`, 12,5px.
  - Inativa: texto-2; hover: texto cheio.
  - **Atual**: fundo `--fundo` (igual ao editor, para parecer "aberta"), texto cheio, ícone âmbar e um
    **filete âmbar de 2px no topo** (`.t-aba-luz`, `view-transition-name: t-aba-luz`).
  - **×**: botão 20x20 à direita (`right:7px`), oculto (`opacity:0; visibility:hidden`) até o hover ou
    o foco da aba; na aba atual fica sempre visível. Hover do ×: fundo `--painel-2`, ícone âmbar. Só
    existe quando há mais de uma aba.
- **O que entra**: as **últimas páginas visitadas na sessão**, no máximo **5**. A página atual entra
  à direita das que já estavam; se já estava, só se atualiza. Passando de 5, sai a mais antiga que não
  é a atual. Cada aba guarda `{ u: url, r: rótulo ("x.md", "dados/", "#spring"), t: tipo (md | pasta |
  tag), n: título }`, em `sessionStorage["t-abas"]`. O ícone vem do tipo. O script que monta a lista
  roda **antes da primeira pintura** (inline, logo depois do `<nav>` das abas), então não há salto.
- **Clicar** numa aba navega (no protótipo cada aba é uma página real). Clicar no meio fecha, como
  num editor.
- **Fechar** (×): a aba **encolhe para a esquerda** (`scaleX(1→0)` e `opacity` em 150 ms, com
  `transform-origin: 0 50%`, `fill:forwards`), é removida do DOM e as outras **deslizam para o lugar
  com FLIP** (mede `getBoundingClientRect().left` antes e depois; anima `translateX(dx)→none` em 180 ms
  com `--curva`). Fechar a aba atual navega para a vizinha (a da direita, ou a da esquerda se era a
  última). Mensagem no status: `> fechou x.md`. Quando sobra uma só, os × somem.
- **Trocar de aba pelo teclado**: `gt` vai à próxima e `gT` à anterior (circular); `⌃Tab` e
  `⌃⇧Tab` também, nos navegadores que deixam passar o evento (a maioria reserva o `⌃Tab`).
- Abaixo de 1024px as abas ficam ocultas (`display:none`).
- **Para uma SPA**: as abas seriam estado de verdade (rota + rolagem + o que mais houver). A aba é
  barata de implementar como uma lista de rotas visitadas; guarde-a em `sessionStorage` do mesmo jeito.

### 2.5 Barra de status

`position:fixed; bottom:0; height:26px; fundo --painel; filete superior;` fonte RX100 13px; cada item
é `inline-flex` com `padding:0 8px`. Os itens que são botões ganham fundo `--painel-2` e texto cheio no
hover, foco por dentro (`outline-offset:-2px`).

Esquerda:

1. ícone de ramo + `main` (texto cheio);
2. o **livro atual** (botão): quadrado de 8px na cor da pasta + `livros/dados`. Clicar abre a paleta
   já com o chip "Livro: Dados". Só existe em página que pertence a um livro;
3. a **mensagem** (`role="status" aria-live="polite"`): ver abaixo;
4. "pressione qualquer tecla para pular" (só durante o boot da home).

Direita:

5. só no artigo: `Ln 120, 42%` (números tabulares) e `12 min`;
6. `UTF-8` e `Markdown` (ou `Pasta`), que somem abaixo de 1024px;
7. botão de teclado com `?`, que abre a folha de atalhos (some abaixo de 1024px).

**A mensagem de status** é a "voz" do site. Aparece por 1,5 s (padrão) e depois some; entra com
`opacity:0, translateY(4px)` para o lugar em 0,2 s; em verde (`--verde`) quando é sucesso. As mensagens
do protótipo:

| Gatilho | Mensagem |
|---|---|
| trocar tema | `> tema escuro` / `> tema claro` (1,8 s) |
| recolher / mostrar a lateral | `> barra lateral recolhida` / `> barra lateral à vista` |
| fechar aba | `> fechou x.md` |
| `gg` / `G` | `gg · topo` / `G · fim` |
| `g` apertado uma vez | `g… (g: topo · t: próxima aba · T: anterior)` (1,4 s) |
| clicar no `##` de um título | `✓ copiado: #secao` (verde) |
| copiar bloco de código | `✓ 23 linhas copiadas` (verde, 1,8 s) |
| copiar o link pela paleta | `✓ link da página copiado` (verde) |
| filtro da tag | `> grep --livro=dados · 4 resultados` (2,2 s) |
| ligar/desligar atalhos | `> atalhos de uma tecla ligados` / `desligados` |

**Posição "Ln, %"** (só no artigo): a "linha" é o **número do bloco** (parágrafo, título, bloco de
código) que está no topo da janela, e o percentual é `scrollY / (scrollHeight - innerHeight)`. É
calculada assim: ao carregar (em `requestIdleCallback`, para não forçar layout no início) e quando
muda o tamanho do artigo ou as fontes chegam, mede-se o `top` de cada bloco uma vez; a cada
`scroll`, dentro de um `requestAnimationFrame`, faz-se uma **busca binária** no vetor de tops. O HTML
já nasce com `Ln 1, 0%`.

### 2.6 Rodapé: o "terminal integrado"

Dentro da área do editor, no fim da página, um `<details>` de borda de 1px e cantos de 6px, fundo
`--painel`. Fechado, é uma linha de 36px: ícone de terminal, "terminal" em texto cheio, o comando
`cs@blog:~$ echo "obrigado por ler"` e um chevron. Aberto (o conteúdo desce por `clip-path` em 0,25 s e
o cursor do último prompt pisca 3 vezes), mostra como saída de comando: o agradecimento, `cat
sobre.txt` com uma frase sobre o autor e `ls ~/links` com os links (GitHub, LinkedIn, RSS) em âmbar
com sublinhado pontilhado que vira sólido no hover. É HTML puro (`<details>`), sem JavaScript.

### 2.7 Botão `gg ↑`

Canto inferior direito (`right:16px; bottom: status + 14px`), 30px de altura, borda de 1px, cantos de
6px, texto "gg" e uma seta. Fica oculto (`visibility:hidden; opacity:0; translateY(6px)`) e aparece
depois de rolar 80% da altura da janela (`.t-visivel`, 0,18 s). No hover, a seta sobe 2px e a borda
fica âmbar. Clicar sobe com rolagem suave (`behavior:"auto"` com movimento reduzido) e põe o foco no
`<main>` (`tabindex="-1"`). Fica âmbar também quando o `g` foi apertado uma vez ("armado").

### 2.8 Celular (menos de 1024px)

Só a barra de título (44px, com o botão da árvore) e a barra de status. Sem abas. A lateral vira
gaveta. As migalhas mostram só o último pedaço. O botão "Comandos" vira só a lupa. Abaixo de 480px,
`gap` da barra cai para 4px, a marca vai a 12px e o tempo de leitura some do status.

---

## 3. As páginas

Todas começam com o prompt da página (`cs@blog:~$ comando`), em `h1` ou `h2` conforme o caso, com o
`$` e o nome do usuário em texto-2. Quando o `h1` visual é um comando, há um `<span class="sr">` com o
título real para leitores de tela, e o comando fica `aria-hidden`.

### 3.1 Home: o README

`~/blog/README.md`. Um README renderizado, com três blocos:

1. **Cabeçalho**: `# Nome` (o `#` em texto-2, `aria-hidden`), título em Tabular 600,
   `clamp(1.75rem, 1.2rem + 1.8vw, 2.5rem)`, `letter-spacing:-0.02em`. Abaixo, o cargo seguido de um
   comentário `// frase curta` em texto-2, e um parágrafo de apresentação em Bespoke Sans 1,0625rem /
   1,65, medida de 34em.
2. **`$ ls livros/ revistas/`**: o prompt (comando digitado no boot), depois uma lista de pastas em
   fluxo (`flex-wrap`, `gap: 2px 22px`). Cada item: ícone de pasta na cor do livro, `livros/dados/` e a
   contagem em RX100. Hover: fundo `--painel-2`, a pasta abre, o nome ganha sublinhado âmbar. Em seguida
   uma **fileira de capas** (no protótipo, os "livros 3D" do blog, 150px de altura, em
   `overflow-x:auto`, com `padding: 26px 8px 16px` e uma borda inferior tracejada). Cada capa sobe 4px
   no hover/foco (0,2 s) e mostra a **dica flutuante** do editor ("dados/ · 2 artigos") depois de 60 ms.
   No dev-note: use o cartão ou a capa da coleção. Fecha com `# 8 diretórios, 28 arquivos.` e um link
   `$ tree livros/ →` para Categorias.
3. **`$ git log --oneline`**: a lista de notas, **uma por linha**, mais nova primeiro. A linha é um
   link em grade:
   `grid-template-columns: 7ch 11.5ch minmax(0,max-content) minmax(0,1fr) auto; gap:16px; min-height:32px; padding:4px 10px; margin:0 -10px`.
   Colunas: hash curto, data, chip da coleção, título (truncado com reticências) e a dica "abrir ↵".
   - O **hash** são os 7 primeiros caracteres do SHA-1 do slug, em texto-2 e números tabulares.
   - O **chip** da coleção: 20px de altura, borda de 1px, quadrado de 8px na cor da pasta + o slug em
     RX100 13px.
   - **Hover/foco**: fundo `--painel-2`, uma barra âmbar de 2px na esquerda que cresce
     (`transform: scaleY(0)→none`, 0,15 s), o hash vira âmbar e "abrir ↵" aparece (`opacity` e
     `translateX(-4px)→none`, 0,12 s).
   - **A primeira nota vem expandida**: abaixo da linha, um corpo com borda esquerda tracejada
     (`margin-left: calc(7ch + 16px)`), em duas colunas (`minmax(0,340px) 1fr`): a ilustração da nota e,
     ao lado, uma linha `+ livros/dados/x.md` (o `+` em verde, como num diff), a descrição em
     Bespoke Sans 1rem e `tags: [spring, jpa] · 12 min`.
   - Abaixo de 760px a linha vira duas: hash, data e chip em cima; título embaixo (sem truncar).
   - Termina com um prompt vazio `cs@blog:~$ ▌`.

### 3.2 O arquivo aberto (a nota)

`~/blog/livros/dados/bloqueio-otimista.md`. É o coração do design: a nota parece um arquivo Markdown
aberto num editor.

- **Grade**: `grid-template-columns: minmax(0, calc(var(--calha) + 42rem)) 220px; gap: clamp(32px,4vw,64px)`.
  A segunda coluna é o outline. Abaixo de 1280px vira uma coluna e o outline some.
- **Números de linha**: o contêiner do texto tem `counter-reset: ln` e `padding-left: var(--calha)`.
  **Cada bloco** (front matter, título, resumo, parágrafo, título de seção, bloco de código) faz
  `counter-increment: ln` e mostra o número por `::before` em posição absoluta:
  `right: calc(100% + 18px); width: 4ch; text-align:right; opacity:.6; font: 400 11.5px/<altura da linha> var(--f-ui); font-variant-numeric: tabular-nums; user-select:none`.
  É **um número por bloco**, não por linha visual (o texto quebra em várias linhas e o número fica na
  primeira). Tabelas, figuras e fórmulas em bloco ficam sem número. Abaixo de 640px os números somem.
  A altura de linha de cada tipo de bloco entra por uma variável `--lh` para o número alinhar com a
  primeira linha do bloco.
- **Front matter** no alto, como YAML, em Tabular 13,5px com linhas de 24px:

  ```text
  ---
  title: "Bloqueio otimista com JPA"
  livro: ■ Dados  # volume 02
  tags: [Spring, JPA, Hibernate]
  publicado: 2026-04-12  # 12 abr 2026
  leitura: 12 min
  ---
  ```

  As chaves em texto-2; o título (string) em `--verde`; o número da leitura em âmbar; os comentários
  `# …` em texto-2; os valores clicáveis (livro, tags) em texto cheio com **sublinhado pontilhado**
  (1px, `text-underline-offset:4px`) que no hover fica sólido e âmbar. Os `---` são `aria-hidden`.
- **Título**: `# Título` em Tabular 600, `clamp(1.9rem, 1.3rem + 1.9vw, 2.75rem)`, `letter-spacing:-0.025em`,
  `text-wrap:balance`. Subtítulo opcional em bloco menor (0,5em, texto-2).
- **Resumo** em Bespoke Sans 1,1875rem / 1,6, texto-2.
- **Ilustração** da nota em um painel (`figure`), com margem de 28px / 36px.
- **Corpo** em Bespoke Sans 1,0625rem (17px), entrelinha 1,7 (1,68 abaixo de 640px), `text-wrap:pretty`,
  `font-feature-settings:"kern"`, medida de 36,5em. Detalhes de prosa:
  - títulos `h2/h3/h4` em Tabular 600 (1,375rem / 1,125rem / 1rem), `text-wrap:balance`, precedidos por
    `##`, `###`, `####` em texto-2 (ver abaixo);
  - listas: o marcador de `ul` vira `"- "` em mono texto-2;
  - citação: borda esquerda de 2px `--filete-forte`, itálico, texto-2;
  - código em linha: JetBrains Mono a 0,84em, borda de 1px `--filete`, fundo `--painel`, cantos de 4px;
  - tabelas em Tabular 13,5px, cabeçalhos texto-2 peso 500;
  - links do texto: **pontilhados** (cor do texto a 55%), no hover **sólidos e âmbar**; e uma dica com o
    destino (ver seção 6).
- **`##` nos títulos**: o marcador é **texto de verdade**, um `<a>` inserido no servidor antes do
  texto do título: `<h2 id="x"><a class="t-ancora" href="#x" aria-label="Link desta seção"
  title="copiar o link" data-ancora>##</a> Título</h2>`. Cor texto-2, vira âmbar quando o mouse passa no
  título inteiro. Sem JS, leva à âncora. Com JS, o clique **copia o endereço completo da seção**
  (`location.origin + pathname + #id`), troca o hash por `history.replaceState` e mostra
  `✓ copiado: #id` na barra de status; o `##` pisca (`opacity: .2` a 30% de 0,5 s).
- **Blocos de código** (no protótipo, Expressive Code; no dev-note use Shiki ou o que houver): JetBrains
  Mono, **ligaduras desligadas** (`font-variant-ligatures:none; font-feature-settings:"liga" 0,"calt" 0`),
  números de linha discretos (`counter-increment` por linha, `min-width:2.6em`, opacidade .55,
  tabulares). **No hover de uma linha**, ela ganha o fundo `--painel-2` e o número vira âmbar com
  opacidade 1. O botão `copiar` fica **sempre à vista no cabeçalho do bloco** (24px de altura, borda de
  1px, 12px de fonte), com hover âmbar; ao clicar vira `copiado ✓` em verde e a barra de status diz
  `✓ N linhas copiadas`. O nome do arquivo do bloco funciona como a aba de um arquivo.
- **Fim do arquivo**, no estilo do Vim: duas linhas com `~` e `"slug.md" [somente leitura]`, em texto-2,
  `aria-hidden`.
- **Anterior e próximo** como comandos, em duas caixas de borda de 1px (`gap:12px`, a segunda alinhada à
  direita): `← $ cd ../anterior` e `$ cd ./próximo →`, mais o título (15px, 600) e o caminho do arquivo
  (RX100). No hover: fundo `--painel`, borda âmbar a 50%, a seta anda 3px e **o comando é "digitado" de
  novo** (`clip-path` em degraus, 14 ms por caractere).
- **Outline** (o sumário à direita, só com 2 ou mais seções): `position:sticky; top: altura-topo + 28px`.
  Título "estrutura" em RX100. Uma lista de links em 12,5px (os `h3` com recuo de 12px e 12px de fonte), com
  uma linha vertical de 1px à esquerda e **uma barra âmbar de 2px** que **desliza** entre os itens: é um
  único elemento no trilho, movido por `transform: translateY(y) scaleY(altura)` com
  `transition: transform .25s var(--curva)`. A seção atual é a do último título cujo `top` já passou de
  `altura-topo + 30% da janela`. O link da seção atual leva `aria-current="location"` e vai a texto
  cheio; os outros em texto-2, hover âmbar.

### 3.3 Categorias: `tree`

`~/blog/livros/`. É a página que o Cesar mais gostou. Prompt `cs@blog:~$ tree livros/ revistas/`, uma
dica `# passe o mouse ou use ↑ ↓ para folhear` e duas colunas:
`grid-template-columns: minmax(0,1fr) minmax(340px,470px); gap: clamp(24px,4vw,56px)`.

**Coluna esquerda: a árvore** em Tabular 13,5px. Cada nível é uma linha de 28px (os arquivos, 25px):

```
livros/
├── dados/            vol. 02          3 artigos
│   ├── bloqueio-otimista.md
│   └── indices.md
├── sre/              vol. 05          5 artigos
│   └── ...
└── redes/            vol. 07          ainda vazio
revistas/
└── java/                              7 edições
8 diretórios, 28 arquivos
```

- Os traços `├── `, `└── ` e `│   ` são **texto de verdade** (`white-space:pre`, texto-2,
  `aria-hidden`), calculados no servidor (`│   ` para a coluna que continua e quatro espaços para a que
  acabou).
- A linha do livro: ícone de pasta na cor dele (a tampa já aberta, 20°), o nome em 600, e à direita o
  volume (`vol. 02`, RX100) e a contagem (`3 artigos`, RX100, alinhada à direita em 11ch). Os artigos
  são links com ícone de arquivo, em texto-2 (texto cheio no hover).
- **Hover/foco numa linha**: fundo `--painel-2` e a **barra âmbar de 2px** na esquerda
  (`scaleY(0)→none`, 0,15 s). ↑ ↓ Home End movem o foco entre as linhas.

**Coluna direita: o painel de pré-visualização** (`position:sticky; top: altura-topo + 24px`, borda de
1px, fundo `--painel`):

- cabeça de 32px: `preview: livros/dados/` (o caminho é redigitado ao trocar);
- **palco** com `height: clamp(340px, 30vw, 440px)`, fundo `--fundo`, `overflow:hidden`, onde mora o
  **livro 3D grande** (no protótipo, `clamp(280px, 27vw, 400px)` de altura). Há um elemento por livro,
  todos empilhados (`position:absolute; inset:0`), e só o ativo e o que está saindo existem
  (`display:none` nos outros);
- uma lista de definição: `nome`, `volume`, `sobre`, `artigos`, `último` (a rótula em RX100 texto-2,
  grade `8ch 1fr`);
- o botão `abrir livro →` (32px, borda âmbar a 50%, a seta anda 3px no hover).

**A troca da pré-visualização** (hover, foco ou setas numa linha): o livro atual **sai deslizando para
cima e esmaecendo** (`translateY(0→-36px)`, `opacity→0`, 0,3 s), o novo **entra de baixo**
(`translateY(36px→0)`, 0,35 s) e **gira de 30° para 24°** (a classe `t-assenta` no quadro seguinte
muda `--livro-giro`, e o livro 3D transiciona o ângulo). As informações trocam por **digitação rápida**
(8 a 10 ms por caractere); a descrição se revela por `clip-path` em degraus (`steps(12)`, 260 ms). O
link do botão e o `aria-label` são atualizados. As informações de todos os livros vêm num `data-info`
JSON no painel; só o painel muda, nada é buscado na rede.

**O desfile** (toca **toda vez** que a página aparece, não só na primeira): as linhas da árvore
aparecem de cima para baixo com 35 ms entre elas (`opacity`, 40 ms), o traço `├──` de cada uma se
desenha por `clip-path` em 4 degraus (140 ms), a tampa de cada pasta abre (`rotate(0→20deg)`, 220 ms,
com 90 ms de atraso) e, no painel, **os livros passam como slides**, 90 ms cada, do primeiro ao último,
e param no primeiro, como alguém apertando a seta para baixo. Dura cerca de 1,5 s. Detalhe técnico:
um script no `<head>` põe `html.t-desfile` antes da primeira pintura (as linhas nascem com `opacity:0`),
e outro tira a classe ao acabar, com uma trava de 4 s. Com movimento reduzido, nada disso: a página
nasce pronta.

**Celular**: sem painel. A árvore mostra, intercalado depois da linha de cada livro, o livro 3D em
tamanho médio (190px), com o recuo da árvore.

> **Mudança desejada para o dev-note** (pedido do Cesar): além do livro (a capa da coleção), mostrar
> também a **imagem da nota sob o mouse**. Ver seção 9.

### 3.4 A página de uma pasta: `ls -la`

`~/blog/livros/dados/`. Dois painéis: `grid-template-columns: minmax(300px,38%) minmax(0,1fr)`.

- **Esquerda**: o livro enorme (`clamp(300px, 34vw, 540px)` de altura), **parado enquanto a página
  rola** (`position:sticky; top: altura-topo; min-height: calc(100vh - altura-topo - status)`), em um
  painel de fundo `color-mix(in oklab, var(--pasta) 6%, var(--fundo))` com filete à direita, que vai de
  ponta a ponta na altura. Abaixo de 1024px vira um bloco acima do conteúdo.
- **Direita**: `livros/dados/README.md` em RX100 com ícone; `# Título`; uma linha com quadrado de cor,
  volume, contagem e a data do último; a descrição em Bespoke Sans (medida 34em); `tags: [a, b, c]`;
  depois o prompt `cs@blog:~/blog/livros/dados$ ls -la` e a lista.

A saída do `ls -la`:

```
total 3
drwxr-xr-x  cesar staff   -      12 abr 2026   ./
drwxr-xr-x  cesar staff   -                    ../  # categorias
-rw-r--r--  cesar staff   12min  12 abr 2026   Bloqueio otimista com JPA
```

Grade `10ch 11ch 5ch 11.5ch 1fr; gap:14px; min-height:30px; padding:5px 10px`. As permissões e o "dono"
são falsos e em texto-2 (o dono some abaixo de 1360px); o "tamanho" é o tempo de leitura em minutos, em
âmbar e alinhado à direita; a data em texto-2; o nome é o título (com o subtítulo numa linha pequena
embaixo). Hover: fundo `--painel-2`, barra âmbar de 2px, nome em âmbar. Abaixo de 760px a linha vira
duas (tamanho e data em cima, nome embaixo).

### 3.5 Tags: `grep -c`

`~/blog/tags/`. Prompt `grep -rc "#tag" livros/ | sort -rn` e a dica `# 30 tags, da mais usada para a
menos usada`. Cada linha é um link de 34px:
`grid-template-columns: 20px min(var(--nome), 17ch) 3ch 1fr; gap:14px`, onde `--nome` é a largura da
maior tag, em `ch`.

- ícone da tag (18px), nome, **contagem em âmbar** alinhada à direita (tabular) e uma **barra de
  caracteres `█`** com `3 × contagem` blocos, cor `--ambar-50`, `letter-spacing:-0.02em`,
  `white-space:pre`, `overflow:hidden`.
- A barra **cresce da esquerda** ao entrar na tela: `scaleX(0→1)`, 520 ms, `--curva`, 30 ms entre as
  linhas, **uma vez**. As que já estão visíveis crescem logo (com 380 ms de espera se a abertura da
  página estiver tocando); as de baixo nascem com `scaleX(0)` e crescem quando um
  `IntersectionObserver` as vê. Sem JS ou com movimento reduzido, as barras já estão lá.
- O texto lido por leitor de tela é o `aria-label` do link ("Spring, 9 artigos"); as colunas são
  `aria-hidden`.
- Hover: fundo `--painel-2`, barra âmbar de 2px (como as outras listas), ícone âmbar.

### 3.6 Uma tag: `grep` com flags e o diff

`~/blog/tags/spring`. Prompt `grep -rl "#spring" livros/`, o ícone grande da tag e `9 resultados em 5
livros`, mais um link `$ cd ../ # todas as tags`.

**A linha de comando editável visualmente**:

```
cs@blog:~$ grep --tag spring --livro=todos▌
[--livro=todos 9]  [■ --livro=dados 4]  [■ --livro=sre 3]  [■ --livro=redes 2]
```

- A linha de comando é uma caixa (borda de 1px, fundo `--painel`, 14px) com `aria-hidden`. A parte
  `todos` (ou o slug do livro) é um `<span class="t-cmd-livro">` âmbar, `display:inline-block;
  white-space:pre`, seguido de um cursor de bloco.
- Abaixo, **chips de flag** (30px, borda de 1px, cantos de 4px, 13px): ícone da pasta (na cor do livro,
  com a tampa aberta quando ativo), texto `--livro=dados` e a contagem em RX100. São botões com
  `aria-pressed`, **um ativo de cada vez** (clicar no ativo volta a "todos"). Ativo: borda âmbar, fundo
  `--ambar-12`, contagem âmbar. Só os livros que têm artigos nesta tag aparecem. Sem JS, os chips e a
  linha de comando ficam ocultos (`html:not([data-js])`) e a lista aparece inteira.
- O filtro sincroniza com `?livro=<slug>` na URL (lido ao abrir, escrito com `replaceState`, sem criar
  histórico).

**A lista é um diff.** Cada resultado: `grid-template-columns: 1.5ch minmax(0,max-content) 1fr;
gap:14px`, com uma coluna para o sinal (`+`/`-`, vazia em repouso), o caminho
(`livros/dados/` na cor da pasta + `slug.md` em texto-2) e o título.

Ao escolher uma flag:

1. a parte do livro no comando é **digitada de novo** (34 ms por caractere ± 8) com o cursor andando
   junto;
2. as linhas que **saem** ficam **vermelhas** (fundo `--vermelho-12`, texto e caminho vermelhos, `-` na
   coluna do sinal) e somem por `clip-path` (`inset(0)` para `inset(0 0 0 100%)`, 300 ms, 20 ms entre
   elas). O DOM só é alterado depois disso (cerca de 320 ms), com `hidden` nas que saíram;
3. as que **ficam** deslizam para o lugar com FLIP (`translateY(dy)→none`, 260 ms);
4. as que **entram** chegam **verdes** (`--verde-12`, `+`) reveladas por `clip-path` em degraus
   (`steps(10)`, 240 ms, 40 ms entre elas) e voltam à cor normal em cerca de 1 s (a cor tem
   `transition` de 0,6 s);
5. a barra de status diz `> grep --livro=dados · 4 resultados`.

Com movimento reduzido, a troca é direta. Fecha com `# aparece junto com: JPA (5), Hibernate (3)` (as
tags que mais aparecem junto) como links pontilhados.

---

## 4. A paleta de comandos

É a **navegação principal**. Um `<dialog>` aberto com `showModal()`.

- **Abrir**: `⌘K` (ou `Ctrl K`), o botão "Comandos", `/` (busca), `>` (direto nos comandos), clicar no
  livro da barra de status (já com o chip). `⌘K` com a paleta aberta fecha. **Fechar**: Esc, clique no
  véu, ou escolher um item. O foco volta a quem abriu. O Esc é tratado à mão (o `<input type="search">`
  limparia o texto no primeiro Esc).
- **Caixa**: `width:min(640px,100%)`, `margin: min(12vh,120px) auto 0`, borda de 1px `--filete-forte`,
  cantos de 6px, fundo `--painel`, `box-shadow: var(--sombra-paleta)` (nenhuma no claro; no escuro
  `0 18px 40px -12px rgb(0 0 0 / 70%)`). O `::backdrop` usa `--veu`.
- **Entrada**: a caixa vem de `opacity:0; transform: scale(.96) translateY(-4px)` para o lugar em
  0,18 s (`--curva`); o véu esmaece em 0,18 s.
- **Campo** (48px): lupa, o **chip de contexto** (quando houver), o cursor em bloco (visível só
  enquanto o campo está vazio, pisca 3 vezes ao abrir; com texto, vale o `caret-color` âmbar) e um
  `<input type="search">` de 15px com `role="combobox"`, `aria-controls`, `aria-activedescendant`,
  `autocomplete="off"`, `spellcheck="false"`. Placeholder: "Buscar artigos, livros e tags (> comandos)".
  À direita, um `kbd` "Esc".
- **Corpo**: `max-height:min(430px,56vh)`, com rolagem, `overscroll-behavior:contain`.
- **Rodapé** (12px, RX100): `↑↓ navegar · ↵ abrir · → entrar no livro · ⌫ sair`.

### 4.1 Grupos e itens

Quatro grupos, cada um com um título (RX100 13px, texto-2):

| Grupo | O que tem | Ícone | À direita |
|---|---|---|---|
| Artigos | as notas (no máximo 6 sem busca, 8 com) | arquivo | o caminho da pasta |
| Livros | as coleções (9) | pasta na cor do livro | `livros/dados/` |
| Tags | as tags (6 sem busca, 8 com) | tag | a contagem |
| Comandos | Tema escuro, Tema claro, Recolher/Mostrar a barra lateral (`⌘B`), Ir para o topo (`gg`), Copiar o link da página, Atalhos do teclado (`?`), Ir para o início, Ir para Categorias, Ir para Tags | variados | o atalho |

Cada item tem 34px, `padding:0 10px 0 12px`, 13,5px. O item da página atual leva "aberto" (ou "atual",
nos comandos de tema) em âmbar. Os dados vêm de um **índice pequeno embutido em toda página** (um
`<script type="application/json" id="t-dados">` com ~5 KB: para cada artigo `{u: url, t: título, c:
complemento, l: slug do livro, p: caminho de arquivo, d: data}`, para cada livro `{u, n: nome, s: slug,
p: pasta, k: contagem, cor, serie}`, para cada tag `{u, n, s: slug, k}`). **Nada é buscado na rede.** Se
o dev-note tiver muito mais notas, troque por um índice em arquivo carregado na primeira abertura da
paleta (ou o Pagefind/Fuse que já houver); o resto do comportamento é o mesmo.

### 4.2 A busca difusa

Própria, sem biblioteca. Normaliza (minúsculas, sem acento: `normalize("NFD")` e remove `\p{M}`).
Dois casos:

1. **Trecho contínuo**: se a consulta aparece inteira no texto, nota `100 + 30 (se começa uma palavra)
   - posição*0,2 - tamanho*0,02`, e marca as letras.
2. **Subsequência**: as letras da consulta (sem espaços) aparecem em ordem, não necessariamente
   coladas. Cada letra soma 1, +5 se vem logo depois da anterior, +8 se começa uma palavra; subtrai
   `primeira posição * 0,1` e `tamanho * 0,02`. Sem todas as letras, não casa.

Se não casar no texto, tenta no "extra" (o caminho) com nota ×0,6 e sem marcas (tags não casam pelo
extra). As **letras que casaram** vão em `<mark>` com `color: var(--ambar); font-weight:600; background:none`.
Sem consulta, mostra a lista inicial (limites por grupo acima); com consulta, ordena dentro do grupo
pela nota e **ordena os grupos pelo melhor achado**. Nada achado: `# nada para "xyz"`.

### 4.3 Prefixos e chip de contexto

- **`>` no começo**: só os Comandos. **`#` no começo**: só as Tags. Digitar `>` ou `#` "afunda" a
  caixa (ver abaixo). Aberta com `>` pelo atalho, a paleta já nasce com `>` no campo.
- **Chip de contexto** ("Livro: Dados"): um retângulo de 24px (borda de 1px âmbar a 50%, fundo
  `--ambar-12`, cantos de 4px) à esquerda do campo, com um × de 20px. Efeito: **filtra os artigos para
  aquele livro** (o grupo "Livros" some e o título do grupo de artigos ganha " · Dados").
  - **Entra**: com **→** ou **Tab** sobre um item de livro (se o cursor do campo está no fim); ao clicar
    no livro da barra de status; e já vem posto quando a paleta abre na página de um livro.
  - **Sai**: **Backspace** com o campo vazio, ou clicar no ×.
  - Ao entrar, o chip desliza (`opacity:0; translateX(-6px)` para o lugar, 0,2 s) e a caixa
    **"afunda"**: `scale(.98)` no meio (45%) de um keyframe de 0,22 s e volta.
- **Teclado na lista**: ↓ ↑ circulam; Enter abre o item marcado (ou o primeiro, se nenhum); no mouse,
  `pointermove` marca o item sob o cursor (sem rolar). Item de link navega; item de ação executa.

### 4.4 O marcador que desliza

Não há "fundo no item selecionado": há **um único elemento** absolutamente posicionado no corpo da
lista (`position:absolute; left:6px; right:6px; height:34px; border-radius:4px; background:var(--painel-2)`),
com uma barra âmbar de 2px dentro (`::before` com `inset: 8px auto 8px 0`). Para marcar o item `i`, ele
recebe `transform: translateY(item.offsetTop)` com `transition: transform .12s var(--curva)`. Na
primeira marcação (ou com movimento reduzido), o `transition` é suspenso para ele aparecer já no lugar.
Os itens têm `role="option"` e `aria-selected`, e o campo aponta o ativo por `aria-activedescendant`.
A lista é redesenhada por `innerHTML` a cada tecla (são poucas dezenas de itens) e o marcador volta ao
primeiro.

---

## 5. Os três momentos (mais a troca de tema)

Todas as animações são **cosméticas e puláveis**. O conteúdo está no HTML; o CSS só esconde o que o
JS vai revelar, sob um atributo no `<html>` que um script no `<head>` põe **antes da primeira
pintura** e que uma **trava de 4 s** remove sozinha se o JS falhar.

### 5.1 O boot da home (cerca de 2,3 s)

Toca **só quando o leitor chega de fora** (link externo, endereço digitado, recarregar). Navegar dentro
do site não toca (ali vale a troca de página). Nunca com `prefers-reduced-motion`. O script de cabeça
detecta isso (`performance.getEntriesByType("navigation")`, `document.referrer`) e põe
`html[data-abertura="home"]`. Qualquer toque, clique ou tecla (menos Tab e atalhos com modificador)
**pula** para o fim, e a barra de status mostra "pressione qualquer tecla para pular".

| Tempo | O que acontece |
|---|---|
| 0 a 0,5 s | A moldura se monta: a lateral desliza da esquerda (`translateX(-100%)→0`, 380 ms), o status sobe (`translateY(100%)→0`, 340 ms, atraso 60), a barra de título desce (`translateY(-100%)→0`, 340 ms, atraso 120), as abas surgem (`opacity`, 200 ms, atraso 300). O cabeçalho do README se revela em 6 degraus (`clip-path: inset(0 0 100% 0)→inset(0)`, 300 ms, atraso 240) |
| 0,5 a ~1,2 s | O prompt aparece (60 ms) e `ls livros/ revistas/` é **digitado**: 26 ms por caractere ± 8 de variação, começando em 560 ms, com um cursor em bloco andando junto. O cursor some 80 ms depois de acabar |
| ~1,2 a ~2,0 s | A saída: os nomes das pastas aparecem em fila (cada um revelado por `clip-path` em 4 degraus, 120 ms, 25 ms entre eles) e as capas **saltam para a fileira** uma a uma (`translateY(-18px)→2px→0`, 300 ms, `cubic-bezier(.3,.7,.3,1)`, 50 ms entre elas, com um "encaixe" de 2px no fim) |
| ~1,8 a ~2,4 s | `git log --oneline` é **digitado rápido** (13 ms por caractere) e as primeiras 14 linhas do log "rolam para dentro" (`opacity`, `translateY(10px)→0` e `clip-path` de baixo para cima, 160 ms, 12 ms entre elas). As linhas fora da tela aparecem quando a abertura acaba |

Observações de implementação: usa só a Web Animations API (`el.animate`), sem biblioteca, com
`fill:"forwards"`. O CSS escondia os elementos (`html[data-abertura="home"] .t-barra {transform:
translateY(-100%)}` etc.). Ao acabar (ou pular), o atributo sai e as animações são **canceladas**: o
estado final é o do CSS. Para evitar layout forçado no começo, **não se mede nada**: as animações usam
contagens e posições conhecidas, e só as primeiras linhas são animadas.

**A digitação** (a peça central): o texto real está no HTML, dentro de um `<span>` com
`display:inline-block; white-space:pre` e fonte **monoespaçada** (1ch por caractere). A função `digitar()`
anima `clip-path: inset(0 100% 0 0)` até `inset(0 calc(100% - Nch) 0 0)` em **degraus** (`easing:
"step-end"` em cada keyframe, um por caractere, com `offset` acumulado e uma pequena variação aleatória
de tempo), e anima o cursor com `translateX(-Nch)→0` nos mesmos offsets. Devolve as animações (para
terminar no pulo) e a duração total. Não há `setTimeout` por caractere. Com movimento reduzido não
anima nada. O elemento leva `aria-label` com o texto inteiro quando faz sentido.

### 5.2 Abrir o arquivo (as outras páginas, cerca de 1,2 s)

Também só quando se chega de fora. É a abertura das páginas internas (nota, categorias, tags…):
`html[data-abertura="pagina"]`.

- O caminho é **digitado na barra de título**: as migalhas se revelam por `clip-path: inset(0 100% 0
  0)→inset(0)` com `steps(N)`, onde N é o número de caracteres do caminho, 13 ms por caractere, com
  40 ms de atraso.
- A **aba nova desliza da direita**: `translateX(28px)→0` com `opacity` 0→1, 260 ms, atraso 90.
- O conteúdo "**carrega de cima para baixo**": os números de linha já estão lá e **cada bloco** do
  texto se revela por `clip-path: inset(0 100% 0 -120px)→inset(0 0 0 -120px)` em `steps(12)`, 280 ms,
  45 ms entre blocos, só os primeiros 16 (o `-120px` deixa a calha de números fora do corte). Termina
  em, no máximo, 1,4 s.

### 5.3 A troca de página: o comando

Ao navegar **dentro do site** (clique em link, aba, paleta), a moldura **fica parada** e só o miolo
muda, como se um comando tivesse sido executado.

- **View Transitions entre documentos**: `@view-transition { navigation: auto; }` (desligado em
  `prefers-reduced-motion: reduce`). A moldura recebe nomes próprios, e por isso não é animada (o
  navegador compara o "antes" e o "depois" e, sendo iguais, nada se move):
  `view-transition-name: t-barra` (título), `t-lateral`, `t-abas`, `t-status`, `t-marcador` (o marcador
  da árvore, que **desliza** até o arquivo novo) e `t-aba-luz` (o filete da aba atual).
  `::view-transition-group(*) { animation-duration: .3s; animation-timing-function: var(--curva); }`.
- **O comando na barra de título**: no evento `pagereveal` da página nova, se a navegação veio de outra
  página do site, o script põe `html.t-troca` (por ~1,1 s). O CSS mostra o `.t-comando` (já presente no
  HTML da página, escondido) por cima das migalhas: `$ cd ~/blog/livros/dados` ou `$ open
  bloqueio-otimista.md` (para o tipo de página: `cd ~/blog`, `tree livros/`, `cd ~/blog/livros/dados`,
  `open slug.md`, `grep -rl "#tag" livros/`). Ele é **digitado rápido**: 12 ms por caractere, com
  `clip-path` em `steps(N)` onde `N = número de caracteres` (passado pela variável `--n`), ~0,25 s.
  Fica legível por um instante, **some** em 0,2 s (com 0,78 s de atraso), e as migalhas voltam
  (`opacity` 0→1, 0,22 s, atraso 0,84 s).
- **O miolo**: o conteúdo antigo **rola para cima e sai** (`::view-transition-old(root)`:
  `translateY(0→-40px)` e `opacity→0`, 0,25 s, `--curva-sai`) e o novo **entra de baixo**
  (`::view-transition-new(root)`: `translateY(40px→0)`, `opacity 0→1`, 0,32 s, atraso 0,06 s, `--curva`),
  como saída de terminal. Isso só vale com `html.t-troca`.
- **Só dentro do site**: no `pagereveal`, se o `navigation.activation.from` for de outra origem ou
  fora do modelo, chama `viewTransition.skipTransition()` e a abertura (5.1 ou 5.2) é que toca.
- Fica um detalhe: a classe `t-troca` é removida depois de ~1,1 s e também no `pageshow` quando a
  página volta do cache (bfcache), para nunca deixar estado velho.
- **Para uma SPA**: o mesmo efeito é uma `document.startViewTransition()` em torno da troca de rota,
  com as mesmas animações em `::view-transition-old/new(root)` e a moldura com nomes próprios. O
  comando digitado vira um estado `t-troca` que o roteador liga na troca.

### 5.4 A troca de tema: a cortina em faixas

A troca é um **comando de tema**: ao clicar no botão (ou escolher "Tema: claro/escuro" na paleta), a
barra de status mostra `> tema claro` e o novo tema **varre a tela como um terminal que redesenha linha
a linha**.

- É uma `document.startViewTransition({ update, types: ["tema", "tema-claro"] })`. O `update` põe
  `html[data-theme]` e o `color-scheme`; antes disso, o script põe `html.trocando-tema` e remove os
  `view-transition-name` da moldura (`html.trocando-tema :is(.t-barra, .t-lateral, .t-abas, .t-status,
  .t-marcador, .t-aba-luz) { view-transition-name: none }`), para a moldura trocar junto com o resto.
- O `::view-transition-old(root)` fica sem animação e o `::view-transition-new(root)` anima
  `clip-path: inset(0 0 100% 0)→inset(0 0 0 0)` em **0,5 s com `steps(8, end)`**: uma cortina que desce
  de cima para baixo em **8 faixas**. `mix-blend-mode: normal` nos dois.
- O tema é guardado em `localStorage` (`redesenho-tema` no protótipo; use a chave do dev-note), e um
  script no `<head>` o aplica antes da primeira pintura (a escolha do leitor, ou
  `prefers-color-scheme` se não houver). Sem JS, o tema é o claro. Com movimento reduzido ou sem
  View Transitions, a troca é direta. Voltando do cache (bfcache), o tema é relido.

---

## 6. Detalhes e atalhos

### 6.1 Atalhos de teclado

| Tecla | Efeito |
|---|---|
| `⌘K` / `Ctrl K` | abre ou fecha a paleta (vale mesmo no meio de um campo) |
| `⌘B` / `Ctrl B` | recolhe ou mostra a barra lateral (no celular, abre a gaveta). Não vale com um diálogo aberto nem dentro de um campo |
| `/` | abre a paleta (busca) |
| `>` | abre a paleta já nos comandos |
| `?` | abre a folha de atalhos |
| `g` `g` | vai ao topo (rolagem suave) |
| `G` | vai ao fim |
| `j` / `k` | desce / sobe 96px (suave; com a tecla segurada, direto) |
| `g` `t` / `g` `T` | próxima aba / aba anterior |
| `⌃Tab` / `⌃⇧Tab` | próxima / anterior aba (quando o navegador deixa passar) |
| `↑ ↓ ← →`, Home, End | andam na árvore de arquivos, e nas listas de Categorias (↑ ↓) |
| Esc | fecha a paleta, a folha ou a gaveta |

**Regras que valem sempre**: os atalhos de uma tecla **nunca valem quando o foco está num campo de
texto** (input, textarea, select, contenteditable) nem com um `<dialog>` aberto, nem com `⌘`, `Ctrl` ou
`Alt` apertados. O `g` funciona como um "armado": apertar `g` liga um estado por 1,4 s (mostra a
mensagem de status e o botão `gg` fica âmbar); a próxima tecla decide (`g` sobe, `t`/`T` troca de aba)
e qualquer outra desarma. Os rótulos mostram `⌘` no Mac e `Ctrl` nos outros sistemas (detecção por
`navigator.platform`).

### 6.2 A folha de atalhos (e como desligá-los)

`?` abre um `<dialog>` com `width:min(520px,100%)`, cabeçalho `# atalhos.md` e uma lista de definição
(`dl`): cada linha em grade `9.5em 1fr`, com a(s) tecla(s) em `kbd` à esquerda, a descrição em texto-2
à direita e um filete tracejado entre as linhas. Cobre todos os atalhos da tabela acima. No fim há um
**interruptor** (`<input type="checkbox" role="switch">` visualmente escondido; trilho 30x16 com bola
de 10px que desliza 14px, âmbar quando ligado) que **liga e desliga os atalhos de uma tecla**
(`g j k / ? >`), guardado em `localStorage["t-atalhos"]` (`"0"` = desligados). Nota abaixo: "Os atalhos
nunca valem com o foco num campo de texto. Com eles desligados, só ⌘K, ⌘B e Esc continuam." Isso
atende a regra de atalhos de uma tecla do WCAG 2.1.4. Fecha com Esc, com o botão × ou clicando no véu.
A animação de abertura é a mesma da paleta.

### 6.3 O cursor que pisca 3 vezes

É um bloco `display:inline-block; width:.6em; height:1.15em; background:var(--ambar)` com
`animation: t-pisca 1.06s steps(1,end) 3`, em que o keyframe é `50% { visibility: hidden }`. **Três
piscadas e para**, no estado visível. Aparece na marca da barra de título, no prompt final da home, na
linha de comando da tag, no campo da paleta (reiniciado a cada abertura, trocando `animation: none` e
voltando) e no terminal do rodapé (só ao abrir). No hover da marca, uma piscada extra (`t-pisca-uma`,
0,7 s). Pisca por `visibility`, nunca por opacidade parcial.

### 6.4 A dica de destino nos links

Uma única dica flutuante (`.t-dica`, `position:fixed`, 12px, fundo `--painel-2`, borda de 1px, cantos
de 6px, `max-width:min(420px, 100vw - 24px)`, `pointer-events:none`) reaproveitada por tudo. Posição:
acima do alvo (8px), ou abaixo se não couber sob a barra de título; presa às bordas da janela (8px).
Movida por `transform: translate(var(--x), var(--y))`, aparece com `opacity` em 0,12 s.

- **Links do texto da nota** (`.prosa a`): depois de **400 ms** de hover (e também com o foco do
  teclado, quando `:focus-visible`), mostra `→ livros/sre/w3c-trace-context.md` (a seta em âmbar). O
  destino é resolvido pelo índice embutido (url → caminho de arquivo) para links internos; para links
  na mesma página mostra `# Texto do título`; para links externos mostra `host/caminho`. Só com
  ponteiro fino (`hover:hover and pointer:fine`). Some ao rolar.
- **Capas da fileira da home**: `dados/ · 2 artigos`, depois de 60 ms (atributo `data-dica-texto`).
- Esconde no `pointerout`/`focusout`/`scroll`.

### 6.5 Copiar com mensagem no status

Três lugares copiam e todos respondem na barra de status: o `##` do título (`✓ copiado: #secao`), o
botão `copiar` do bloco de código (`✓ 23 linhas copiadas`, contadas do texto copiado) e o comando
"Copiar o link da página" da paleta (`✓ link da página copiado`). Usa `navigator.clipboard.writeText`; se
falhar, a mensagem é "não deu para copiar" (sem verde).

### 6.6 Outros detalhes

- **Foco pelo teclado**: contorno âmbar de 1px mais um halo `box-shadow: 0 0 0 4px var(--ambar-25)`,
  cantos de 4px (`:focus-visible`). Nas listas e na árvore, o halo é interno (`inset`).
- **Seleção de texto**: `::selection { background: var(--ambar-25) }`.
- **Hover dos ícones**: mudam de cor para âmbar, sem movimento. Só a pasta tem animação: a tampa gira
  20° (0,2 s). A tampa do ícone é um segundo `path` com `transform-box: view-box; transform-origin:
  1.75px 13.25px; transition: transform .2s var(--curva)`.
- **Link "Pular para o conteúdo"**: fica fora da tela (`translateY(-200%)`), âmbar sobre fundo da página,
  e aparece com o foco.
- **Botões**: 28px de altura, 12,5px, texto-2; hover: fundo `--painel-2` e texto âmbar; `:active`:
  `translateY(1px)`.
- **`kbd`**: caixa de 1,7em x 1,7em, borda de 1px `--filete-forte`, cantos de 4px, fundo `--fundo`,
  texto-2, 11px.
- **Voltar do cache (bfcache)**: no `pageshow` com `persisted`, remove `t-troca`, `t-alternando`,
  `t-desfile` e desarma o `g`; a gaveta aberta fecha.

---

## 7. Os tokens

### 7.1 Cores

Um bloco no `:root` com os valores do claro e um `html[data-theme="dark"]` que sobrescreve. Nada de
cor solta nos componentes: tudo por variável. O escuro é o tema principal.

| Token | Escuro | Claro | Uso |
|---|---|---|---|
| `--fundo` | `#16171A` | `#F6F5F2` | área do editor |
| `--painel` | `#1C1D21` | `#EDECE7` | barra lateral, abas, barras de título e status, caixas |
| `--painel-2` | `#23252A` | `#E3E1DA` | seleção de linha, hover |
| `--texto` | `#E6E3DC` | `#1D1E21` | texto |
| `--texto-2` | `#8E8A82` | `#6A675F` | comentários, metadados, números de linha |
| `--filete` | texto a 9% | texto a 12% | divisões (`color-mix(in oklab, var(--texto) 9%, transparent)`) |
| `--filete-forte` | texto a 17% | texto a 22% | bordas de botões, caixas e `kbd` |
| `--ambar` | `#F2B45A` | `#A8610B` | o acento: cursor, aba ativa, seleção, foco, contagens |
| `--verde` | `#8FC98A` | `#3E7B39` | o `+` do diff, sucesso, strings do front matter |
| `--vermelho` | `#E7837A` | `#B4382D` | o `-` do diff, erro |
| `--veu` | `#000` a 55% | texto a 28% | fundo de modais e da gaveta |
| `--sombra-paleta` | `0 18px 40px -12px rgb(0 0 0 / 70%)` | `none` | só a paleta |
| `--pasta-mistura` | `48%` | `0%` | quanto a cor da pasta é clareada |

Derivados (também por `color-mix(in oklab, …, transparent)`): `--ambar-12`, `--ambar-25`, `--ambar-50`
(âmbar a 12%, 25% e 50%), `--verde-12` e `--vermelho-12` (14%). O contraste dos pares texto/fundo
nos dois temas deve ser conferido (o âmbar do claro, `#A8610B`, foi escolhido mais escuro justamente
para passar). As cores de cada livro (a "pasta") vêm de dados e entram como `--cor` no elemento; a cor
efetiva é `--pasta`. Para código e avisos, a prosa usa tokens próprios ligados a estes (`--aviso-nota`
`#2F5C93` / `#9CC2FF`, `--aviso-importante` `#6A4892` / `#CFB3F0`, e `--verde`, `--ambar`, `--vermelho`
nos demais tipos).

### 7.2 Fontes

| Papel | Fonte | Onde |
|---|---|---|
| Interface (árvore, abas, caminhos, paleta, listas, títulos da nota) | **Tabular** (Fontshare), mono sem serifa, variável de 300 a 700, com itálico | `--f-ui` |
| Rótulos pequenos e barra de status | **RX100** (Fontshare), mono condensada, peso 400 | `--f-rotulo` |
| Texto da nota (corpo, resumo, descrições) | **Bespoke Sans** (Fontshare), variável, com itálico | `--f-texto` |
| Código | **JetBrains Mono**, ligaduras desligadas | `--f-mono` |

Pilhas: `--f-ui: "Tabular", "Tabular reserva", ui-monospace, Menlo, monospace`;
`--f-rotulo: "RX100", "RX100 reserva", ui-monospace, Menlo, monospace`;
`--f-texto: "Bespoke Sans", "Bespoke reserva", "Helvetica Neue", Arial, sans-serif`;
`--f-mono: "JetBrains Mono Variable", ui-monospace, "SF Mono", Menlo, monospace`.

**De onde vêm e licença.** Tabular, RX100 e Bespoke Sans são fontes gratuitas do **Fontshare**
(fontshare.com), da Indian Type Foundry, sob a **ITF Free Font License (ITF FFL)**: uso pessoal e
comercial gratuito, inclusive em sites (a licença permite o self-hosting para a web), mas **não pode
redistribuir os arquivos das fontes** (por exemplo, colocá-los num repositório público que outras
pessoas possam baixar como pacote). Por isso, no projeto de origem os `.woff2` ficam fora do git e são
baixados por um script; faça o mesmo no dev-note (ou comite-os só se o repositório for privado, e leia
o texto atual da licença na página de cada fonte antes de decidir). Baixe o ZIP de cada família no
Fontshare, converta/use os `.woff2` variáveis e sirva do **próprio site** (nunca por CDN em produção).
JetBrains Mono é OFL e pode vir do `@fontsource-variable/jetbrains-mono`.

Arquivos usados: `Tabular-Variable.woff2` e `Tabular-VariableItalic.woff2` (peso 300 700),
`RX100-400.woff2`, `BespokeSans-Variable.woff2` e `BespokeSans-VariableItalic.woff2`, todos com
`font-display: swap`. **Pré-carregue** com `<link rel="preload" as="font" type="font/woff2"
crossorigin>` só a Tabular e a RX100 (são a moldura inteira) e a Bespoke Sans nas páginas com texto
(home, nota, página de pasta).

**Reservas com as métricas ajustadas** (para a troca de fonte não pular o layout): três `@font-face`
locais, sem baixar nada.
- "Tabular reserva": `src: local("Menlo"), local("SF Mono"), local("DejaVu Sans Mono"), local("Consolas")`;
  `size-adjust:99.7%; ascent-override:103.3%; descent-override:23.1%; line-gap-override:0%`.
- "RX100 reserva": mesmas fontes locais; `size-adjust:74.8%; ascent-override:129.7%; descent-override:34.8%; line-gap-override:0%`.
- "Bespoke reserva": `src: local("Arial"), local("Helvetica Neue"), local("Helvetica")`;
  `size-adjust:113%; ascent-override:86.7%; descent-override:23.9%; line-gap-override:0%`.

(A Tabular é mono de 0,600 em; a RX100 de 0,450 em; a Bespoke Sans, ~0,518 em por letra.)

### 7.3 Escala

Mono (interface): 11px (`kbd`, números de linha), 11,5px, 12px (outline, dica, rodapé da paleta),
12,5px (abas, migalhas, botões), 13px (status, árvore, rótulos), 13,5px (listas, itens da paleta, front
matter), 14px (corpo da interface, prompts, linha de comando), 15px (campo da paleta, prompt de página).
Títulos em Tabular 600: `h1` da home `clamp(1.75rem, 1.2rem + 1.8vw, 2.5rem)`, `h1` da nota
`clamp(1.9rem, 1.3rem + 1.9vw, 2.75rem)`, `h2` 1,375rem, `h3` 1,125rem, `h4` 1rem; `letter-spacing`
negativo nos grandes (-0,025em a -0,01em). Corpo em Bespoke Sans: 1,0625rem (17px), entrelinha 1,7;
resumo 1,1875rem / 1,6; descrições 1rem / 1,6.
Espaços: múltiplos de 2 e 4px (linhas de 24, 25, 28, 30, 32, 34, 36, 40px). Cantos: 3px (links em
linha), 4px (botões, chips, `kbd`), 6px (paleta, dica, folha, terminal do rodapé, ilustrações).
Ícones: grade de 16, **traço de 1,5px, ponta e junta quadradas** (`stroke-linecap:square;
stroke-linejoin:miter`), `stroke:currentColor`, `fill:none`.

### 7.4 Curvas e durações

| Nome | Valor | Uso |
|---|---|---|
| `--curva` | `cubic-bezier(.2, .8, .2, 1)` | quase tudo (entrada, hover, deslizes) |
| `--curva-sai` | `cubic-bezier(.4, 0, 1, 1)` | o conteúdo antigo que sai na troca de página |
| degraus | `steps(N, end)` ou `step-end` | digitação, revelações por `clip-path`, a cortina do tema |
| encaixe | `cubic-bezier(.3, .7, .3, 1)` | as capas que saltam no boot |

Durações: hover e cor 0,12 s; barras e marcadores 0,15 s; setas e ícones 0,15 a 0,2 s; abrir pasta 0,2 s;
status 0,2 s; paleta 0,18 s e marcador 0,12 s; "afundar" 0,22 s; fechar aba 0,15 s (FLIP 0,18 s); topo
0,18 s; gaveta e lateral 0,22 s; terminal do rodapé 0,25 s; pré-visualização 0,3 a 0,35 s; barras de
`█` 0,52 s; cortina de tema 0,5 s; troca de página 0,25 s (sai) e 0,32 s (entra); boot ~2,3 s;
abertura de arquivo ≤1,4 s; desfile ~1,5 s.

---

## 8. Acessibilidade e desempenho

**Acessibilidade**

- **O texto "digitado" já está no HTML.** O efeito (digitar, revelar) só esconde e revela por
  `clip-path`; leitor de tela e busca veem o texto sempre. Os prompts decorativos ficam `aria-hidden`
  e o título real fica em um `<span class="sr">`.
- **Movimento reduzido** (`prefers-reduced-motion: reduce`): nenhuma abertura toca, `@view-transition`
  vai a `navigation: none`, a troca de tema é direta, e um bloco global zera `animation-duration`,
  `animation-delay` e `transition-duration` (para 0,01 ms) e limita as iterações a 1. Tudo aparece no
  estado final, na hora.
- **Atalhos nunca valem num campo** de texto nem com diálogo aberto, não mexem com `⌘`/`Ctrl`/`Alt`
  (menos os que são o próprio atalho), e **podem ser desligados** numa chave guardada (WCAG 2.1.4).
- **Sem JS o site funciona**: o conteúdo, a lista de notas, os links e os `##` (como âncoras) estão no
  HTML; só somem coisas que precisam de script (chips de flag, paleta, abas). `html[data-js]` é posto
  pelo script de cabeça e esconde o que só serve com JS (`html:not([data-js]) .t-flags {display:none}`).
- **Teclado e leitor de tela**: `<dialog>` nativo para a paleta e a folha (foco preso, Esc, retorno
  do foco ao abrir/fechar); a paleta é um `combobox` com `listbox` e `aria-activedescendant`; a árvore
  usa tabindex móvel; os botões têm rótulo (`aria-label` ou `.sr`); a mensagem de status é
  `role="status" aria-live="polite"`; a página atual leva `aria-current="page"`, e a seção do outline
  `aria-current="location"`; o link "Pular para o conteúdo" existe.
- **Contraste**: confira cada par (texto, texto-2, âmbar, verde, vermelho sobre fundo, painel e
  painel-2) nos dois temas; texto-2 sobre painel-2 é o par mais apertado.

**Desempenho**

- **Só `transform`, `opacity` e `clip-path`** são animados. Nada anima `width`, `height`, `top` ou `left`.
  A altura ao abrir pasta, terminal ou lista é um `clip-path`, não uma altura.
- **Nada de laço infinito**: o cursor pisca 3 vezes e para; não há `requestAnimationFrame` rodando
  sem parar. O único `rAF` é o da rolagem, **coalescido** (um agendamento por quadro) e `passive`.
- **Sem layout forçado no começo**: nas aberturas não se mede nada; a posição de linha e o outline são
  medidos ociosos (`requestIdleCallback` com limite de 1,5 s, ou `setTimeout` de 600 ms) e
  recalculados só quando o tamanho do artigo muda (`ResizeObserver`) ou as fontes chegam
  (`document.fonts.ready`).
- **Sem biblioteca de animação**: tudo é CSS e Web Animations. (O projeto de origem tem GSAP
  disponível, mas este modelo não usa.)
- **A árvore monta a pasta "artigos" só ao abrir** (28+ itens que, fechados, não aparecem), a partir do
  JSON embutido. O JSON de ~5 KB vai em toda página; para milhares de notas, troque por um índice
  carregado sob demanda.
- As barras fixas têm `contain`; os ícones usam **sprite** `<symbol>`/`<use>` (um ícone por linha da
  árvore, sem repetir o caminho do SVG), com a pasta como exceção (a tampa precisa girar por CSS).
- Só a Tabular e a RX100 são pré-carregadas; as reservas têm as métricas ajustadas (sem salto).
- Pré-busca das páginas por `speculationrules` ou o que o framework do dev-note oferecer.

---

## 9. O que mudar no dev-note

O Cesar quer usar este design **no dev-note, mas não necessariamente em todo o site**. A parte que
ele mais gostou foi a estrutura de editor (abas, árvore à esquerda), a página de **Categorias**
(`tree` com o painel de pré-visualização), a página do **README** e a nota como arquivo `.md` com
números de linha. Sugestão de ordem de construção:

1. Tokens, fontes e a moldura (barra de título, árvore, barra de status). Tema claro e escuro.
2. A nota como arquivo (front matter, números por bloco, `##`, outline, código).
3. A página de Categorias com `tree` e a pré-visualização.
4. A paleta de comandos.
5. Abas, atalhos e os detalhes. Por fim, as três aberturas e a troca de tema.

**Mudança pedida: no `tree`, mostrar também a imagem da nota sob o mouse.**
Hoje, ao passar o mouse sobre uma **linha de livro**, o painel mostra o livro grande. Ao passar sobre
uma **linha de nota** (um arquivo `.md` da árvore), o painel continua mostrando o livro pai (a linha de
nota só aponta para o índice do livro). A mudança:

- Cada linha de nota ganha seu próprio estado de pré-visualização, que mostra a **imagem da nota**
  (a ilustração de capa ou a imagem de destaque) com o título e a data embaixo, no lugar do livro
  (ou ao lado dele: por exemplo, o livro menor no canto e a imagem da nota ocupando o palco; escolha
  a que ficar melhor). Passar de novo numa linha de livro volta ao livro grande.
- A troca usa a **mesma mecânica**: a imagem atual sai subindo e esmaecendo (`translateY(-36px)`,
  0,3 s) e a nova entra de baixo (`translateY(36px)`, 0,35 s); as informações trocam por digitação
  (nome do arquivo, minutos de leitura, data, descrição curta). O botão passa a ser `abrir nota →`.
  Foco do teclado (↑ ↓) faz o mesmo que o mouse.
- Para não pesar: renderize os dois tipos de pré-visualização no HTML e troque só as classes
  (`t-ativo`, `t-sai`), ou carregue a imagem da nota sob demanda no primeiro `pointerover`/`focusin`
  (com `loading="lazy"` e dimensões fixas para não haver salto). Use `decoding="async"` e uma versão
  pequena (≤ 800px de largura). Pré-aquecer com `pointerenter` ajuda a imagem estar pronta no clique.
- No desfile, continue percorrendo só os livros (não as notas).
- No celular, onde não há painel, a imagem da nota pode entrar intercalada abaixo da linha da nota,
  em tamanho pequeno, como já acontece com o livro.

**Outros pontos a decidir no dev-note**

- **Persistência das abas e do estado**: o protótipo usa `sessionStorage` (as abas somem ao fechar o
  navegador). O dev-note pode usar `localStorage` se quiser lembrar as abas entre visitas.
- **Escopo do estilo**: se o design for só uma área do dev-note (por exemplo, a biblioteca), aplique-o
  a um layout específico e deixe o resto do site no estilo geral; os tokens e as classes `t-` já são
  prefixados para isso.
- **Capas e livros**: o protótipo usa um "livro 3D" por categoria. No dev-note, troque pelo elemento
  visual da coleção (capa, ícone grande, cartão). O comportamento (cor da pasta, giro de 30° para 24°,
  entrada de baixo, saída por cima) vale igual.
- **Imagem dos livros como PDF** e o "terminal aberto em qualquer lugar do site", que o Cesar
  descreveu como ideia de extensão, são **outro trabalho** e não fazem parte deste design.

---

## 10. Esqueleto mínimo do HTML

Só para fixar a estrutura (a ordem dos elementos importa para o foco e para os nomes da View
Transition):

```html
<body>
  <a class="t-pular" href="#conteudo">Pular para o conteúdo</a>
  <header class="t-barra">   <!-- botão árvore, marca + cursor, migalhas + .t-comando, Comandos, tema -->
  <aside class="t-lateral">  <!-- cabeça (~/blog, main) + <nav> com <ul class="t-arvore"> -->
  <div class="t-veu" hidden></div>
  <nav class="t-abas"><ul class="t-abas-lista">…</ul></nav>   <!-- montado por script antes da pintura -->
  <div class="t-area">
    <main id="conteudo" class="t-editor" tabindex="-1"><!-- a página --></main>
    <footer class="t-rodape"><details class="t-terminal">…</details></footer>
  </div>
  <a class="t-topo" href="#conteudo">gg ↑</a>
  <footer class="t-status">…</footer>
  <dialog class="t-paleta">…</dialog>
  <dialog class="t-atalhos">…</dialog>
  <div class="t-dica" role="tooltip" aria-hidden="true"></div>
</body>
```

E o que a troca de página e o `<head>` precisam, em resumo:

```css
@view-transition { navigation: auto; }
.t-barra { view-transition-name: t-barra; }   /* idem t-lateral, t-abas, t-status */
html.t-troca::view-transition-old(root) { animation: t-vt-sai .25s var(--curva-sai) both; }
html.t-troca::view-transition-new(root) { animation: t-vt-entra .32s var(--curva) .06s both; }
@keyframes t-vt-sai   { to   { opacity: 0; transform: translateY(-40px); } }
@keyframes t-vt-entra { from { opacity: 0; transform: translateY(40px); } }
```

```js
// <head>, antes da primeira pintura: tema, lateral recolhida, abertura (com trava de 4 s) e a troca de página.
addEventListener("pagereveal", (e) => {
  const vt = e.viewTransition;
  if (!vt) return;
  const de = navigation.activation?.from?.url && new URL(navigation.activation.from.url);
  if (!de || de.origin !== location.origin) return vt.skipTransition();
  document.documentElement.classList.add("t-troca");
  setTimeout(() => document.documentElement.classList.remove("t-troca"), 1100);
});
```

---

## 11. O que não fazer (para não perder a identidade)

- Terminal de filme: verde fosforescente, CRT, brilho, texto "hacker".
- Texto de nota em mono.
- Grade à vista, números de índice enormes, formas e molas, cotas de desenho técnico.
- Animação de entrada em cada seção da página, ou animação que não possa ser pulada.
- Laço infinito (o cursor termina, o marcador e o outline só se movem a pedido).
- Sombra em tudo: a única é a da paleta no escuro.
- Atalho de uma tecla sem poder desligar, ou valendo dentro de um campo.
