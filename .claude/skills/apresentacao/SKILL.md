---
name: apresentacao
description: A apresentação de um post, nos dois caminhos. Criar (D74, o padrão), o PowerPoint do post no estilo do blog (papel, fichas, fita, post-it, a caneta do caderno, as fontes do site e os desenhos e prints do próprio post), com notas do apresentador, pelas ferramentas de scripts/slides/. NotebookLM, o .pptx que o Cesar gera lá vira os slides WebP do post e o PDF do botão Baixar PDF, conferindo antes os erros nas imagens. Use quando o Cesar pedir uma apresentação, um PPT, slides ou um deck de um post, ou trouxer um .pptx.
---

# Apresentação de um post

Dois caminhos:

- **Criar** (D74, o padrão): o Cesar pede "faz a apresentação do post X" (ou o PPT, os slides, o deck), e
  sai um `.pptx` no estilo do blog, com os desenhos e as marcações do próprio post e as notas do
  apresentador. O modelo aprovado é o do post dos mods (`scripts/slides/posts/claude-code-do-claude-md-ao-mod.py`).
- **NotebookLM**: o Cesar traz o `.pptx` que gerou no NotebookLM, e ele vira a seção "Apresentação" do post
  (slides WebP e o botão Baixar PDF). Está no fim desta skill.

Esta skill vem antes da `pptx` genérica (anthropic-skills): dela, nada de pptxgenjs nem de paleta própria.

## Criar a apresentação (D74)

Não precisa combinar antes: fazer e entregar. Perguntar só se não estiver claro qual post.

### O roteiro

- **A ordem do post.** Cada seção vira um ou mais slides, cada slide com uma ideia só. O título do slide é
  a mensagem, numa frase, e não o nome da seção. O nome da seção vai no rótulo de cima, em mono.
- **Tamanho:** post detalhado, de 15 a 20 slides; resumo, de 8 a 12.
- **Abertura:** a capa do post colada com fita, com a tira da ficha ("Vol. NN · ficha N · nº NNN", a mesma do
  cartão do site), o título e o subtítulo do post, a data, o livro, a marca e as tags.
- **Fecho:** "Para ir além" (a recomendação final do post, com o visto), as fontes resumidas, a ficha "Do
  livro" e a marca.
- **Texto:** só o que está no post, encurtado, sem fato novo, e pelas regras de escrita da skill `post`.
  Número, data, versão e comando são copiados do post, nunca de memória.
- **Notas do apresentador em todos os slides:** de duas a cinco frases, tiradas do texto do post, para quem
  apresenta.
- **Desenhos:** os do próprio post, como estão no site: a capa, as figuras (paradas, em passos e o quadro
  final das animações), as lousas, os prints de `src/evidencias/<slug>/` e a ficha "Do livro". Nada de
  desenho novo nem de imagem de fora. O texto alternativo de cada imagem vem do post.
- **A caneta:** as marcações do próprio post, nos mesmos trechos e com os mesmos tipos (marca-texto, grifo,
  ondulado, círculo, duplo, caixa, colchete, chave, moldura, visto, carimbo, nota com seta e post-it), sem
  passar dos limites do guia `docs/marcacoes.md` (marca-texto no máximo três vezes). Uma nota à mão pode
  apontar o que importa num print ou num código, como no modelo. Sobre um print escuro, vai a caneta do
  tema escuro.
- **Ritmo:** variar a forma (texto com desenho, grade de fichas, escada ou linha do tempo, tabela, código
  com nota, números grandes, ficha pautada para lista de referência). Um ou dois slides escuros, só para as
  frases-chave.

### Como fica

- Quadro 16:9 (13,333 × 7,5 polegadas), margem de 0,75. Fundo de papel (`paper`) e as peças em folhas
  (`paper-hi`, borda `rule` e a sombra curta e quente). Nos slides escuros, as cores do tema escuro.
- Fontes do site: Besley nos títulos (de 34 a 46 pt, negrito), Literata no texto (de 14 a 20), IBM Plex Sans
  nos rótulos e legendas, JetBrains Mono no código, na tira da ficha e no número do slide, e a Caveat só nas
  notas à mão, sempre na cor da caneta.
- Cores só dos tokens, que o `estilo.py` lê de `src/styles/tokens.ts` e de `src/livros/livros.json`: a cor
  do livro do post nos fios das fichas e nos destaques, os tons dos diagramas para os papéis, o azul-tinta
  só em comando e endereço e a caneta só nos traços e nas notas.
- Não pode parecer feito por IA: nada de faixa colorida de ponta a ponta, sublinhado decorativo no título,
  gradiente, emoji ou rótulo em caixa alta.
- O título de cada slide fica no espaço reservado (para o sumário e a leitura em voz alta), e os slides se
  agrupam em seções do PowerPoint, uma por bloco do post.

### Passo a passo

1. **As fotos do post:** `node scripts/slides/capturar.mjs <slug>` (post no ar) ou, para um post novo, com o
   dev no ar, `--base http://127.0.0.1:<porta>`. Elas vão para `saida/slides/<slug>/img/` (fora do git),
   com a tira da ficha em `dados.json`.
2. **O roteiro:** `scripts/slides/posts/<slug>.py`, a partir do modelo e das peças de `scripts/slides/estilo.py`:
   `Deck` (slides, título, número, notas e seções), `escrever` (texto com as marcações `{id:trecho}`),
   `ficha`, `folha`, `fita`, `postit`, `ficha_pautada`, `codigo`, `tabela`, `aviso`, `numero_grande`,
   `escada`, `carimbo`, `nota`, `seta` e as marcas da caneta.
3. **Gerar:** `python3 scripts/slides/posts/<slug>.py` → `saida/slides/<slug>/<slug>.pptx`.
4. **Conferir:** `python3 scripts/slides/conferir.py <slug>` gera o PDF, uma imagem por slide e a folha de
   contato, e confere título, notas, forma fora do quadro, fonte que não é do site e a ordem do XML. Depois,
   olhar cada imagem: texto que estoura a peça, peças que se encostam, marcação fora do trecho, imagem
   cortada. Corrigir no roteiro e gerar de novo até ficar limpo.
5. **Entregar:** copiar o `.pptx` e o `.pdf` para `~/Downloads/` (sem sobrescrever) e mandar os dois ao Cesar.
   O PDF leva as fontes embutidas; o `.pptx` precisa delas instaladas na máquina onde for aberto.
6. **No post (D77):** a apresentação entra na seção "Apresentação", antes de `## Fontes`, com o PDF que o
   `conferir.py` gerou: `fnm exec --using=24 npm run apresentacao -- <slug> --pdf
   saida/slides/<slug>/<slug>.pdf --titulo "<título curto>"`. As páginas viram os slides WebP do post e a
   entrada em `src/data/decks.json`, como as do NotebookLM. Conferir a seção no dev antes do commit.
7. O roteiro, os slides WebP e o `decks.json` vão para o git quando o Cesar pedir o commit; a pasta `saida/`
   fica fora.

### Requisitos

- Python 3 com python-pptx, Pillow e lxml (no Mac do Cesar, o `python3` do sistema já tem; noutra máquina,
  `pip3 install python-pptx`, com o OK dele).
- LibreOffice (`soffice`) e o poppler (`pdftoppm` e `pdffonts`), para a conferência.
- As fontes do site em TTF estático (o `@fontsource` do site é WOFF2 variável, que o PowerPoint não usa):
  `python3 scripts/slides/fontes.py` confere, e `--instalar` baixa do Google Fonts (é download: pedir o OK).

### Armadilhas

- O texto é medido e quebrado no script, com as fontes, para cada marcação cair no trecho certo: escreva
  sempre com `escrever()` ou `diagramar()`. Linha de código longa demais: diminuir o corpo ou encurtar a
  descrição (o próprio post encurta).
- Com o espaçamento exato, a linha de base fica a 0,205 em do pé da linha (medido no LibreOffice). No
  PowerPoint e no Keynote as marcações podem andar um pouco: dizer isso ao Cesar na entrega.
- Imagem com fundo próprio (print escuro, figura no painel): cortar os cantos com `raio_px`, como no site.
- O validador da skill `pptx` pede Python 3.10 ou mais novo; o `conferir.py` cobre o essencial com o 3.9
  daqui.
- Refez o roteiro depois de mudar o post? Rode de novo o `conferir.py` e o `npm run apresentacao -- … --pdf`,
  senão o post fica com os slides antigos.

## NotebookLM: os slides no post

Pronta na Fase 4: `npm run apresentacao`, o manifesto `src/data/decks.json`, a seção no post e o PDF
gerado no build (D9, sem biblioteca de PDF).

### De onde vem

Depois que o post está pronto, o Cesar gera a apresentação no NotebookLM e traz o **PowerPoint**
(`.pptx`). Os slides vêm como imagens inteiras dentro do arquivo, sem texto.

### Antes de aceitar o material

- **Confira texto e código em cada slide.** O NotebookLM já errou antes: `SIT` no lugar de `SET`,
  `stareId` no lugar de `storeId`, "reteamento", "malúsculas". Se houver erro, peça ao Cesar para
  gerar de novo. Não publique com erro, porque isso desmente a promessa de revisão da página Sobre.
- **Um deck por artigo.** Se vierem dois, escolha o de linguagem visual mais próxima do blog. Não
  misture slides de decks diferentes.
- **Os slides não substituem o texto.** Imagem não tem SEO nem leitor de tela, então o artigo
  precisa se sustentar sozinho.

### Conversão

```sh
fnm exec --using=24 npm run apresentacao -- <slug> --pptx "<arquivo.pptx>" --titulo "<título do deck>"
```

O script (`scripts/apresentacao.mjs`, porte do `deck-to-web.mjs` do blog atual):
1. extrai as imagens na ordem dos slides (`ppt/presentation.xml`, cruzado com as relações);
2. converte para WebP com 1376px de largura (sem ampliar) e qualidade 82, em
   `public/posts/<slug>/deck/NN.webp`;
3. registra `{ titulo, slides, largura, altura }` em `src/data/decks.json`.

O PDF sai no build, das mesmas imagens: `/posts/<slug>/apresentacao.pdf`, uma página por slide.

### No post

- A seção "Apresentação" entra logo antes de `## Fontes`, sem frase de apoio.
- O título é sempre "Apresentação", sem número, mesmo em post com h2 numerados (D14).
- Tem carrossel com setas e contador, tela cheia (galeria com ←/→) e o botão "Baixar PDF".
- Aparece sozinha para quem está no manifesto: nada a escrever no Markdown. Quem insere é
  `src/plugins/rehype-apresentacao.mjs`, que vale para `.md` e `.mdx` (D21). No RSS, a seção vira um link.
- Se o post não tiver `## Fontes`, o build falha, em vez de sumir com a seção em silêncio.
