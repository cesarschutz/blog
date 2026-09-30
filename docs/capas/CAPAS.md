# Capas, lombadas e estante

Este é o padrão visual dos livros do blog. As categorias são livros de uma coleção no estilo "edição de estudo". As séries são livros também, fora da coleção, com a capa de revista técnica (D57; antes, D32, eram revistas). Tudo o que se mexe é montado em HTML e CSS com SVG inline, nunca como imagem pronta; desde a D57, as peças paradas (a ficha "Do livro", o livro aberto em branco) podem ser imagens geradas das pranchas.

As imagens em `referencia/` são o alvo visual:

- `capas.png`: as oito capas das categorias.
- `lombada-e-capa.png`: a lombada colada à capa, para a animação de girar.
- `estante.png`: as lombadas em pé, com a série depois do aparador.
- `lateral.png`: as lombadas deitadas na lateral do site (Séries e Categorias), em tamanho real e ampliadas.
- `serie.png`: a capa e a lombada da série Atualizações do Java.

**No site (D39):** as categorias usam os papéis de cor invertidos em relação às referências, sempre,
nos dois temas: o **papel em cima** (com o título, o ícone e a linha do topo no `destaque`) e a **cor
do livro embaixo** (com a frase, o desenho, o título da lombada e o número na `tinta`). As medidas
não mudam. A série continua como na referência, sempre papel claro. Nada disso muda com o tema.

## Arquivos

Desde a D53, os arquivos que o site lê ficam em `src/livros/`; aqui ficam só esta regra e as
imagens de `referencia/`.

- `livros.json`: dados de cada livro e da série. O campo `artigos` é só um exemplo, porque no site o número vem da contagem real de posts.
- `cores.js`: dá a `tinta` (texto sobre a cor do livro) e o `destaque` (a cor do livro escurecida até ter contraste sobre o papel). Use sempre ele, nunca cores fixas.
- `desenhos/<slug>.svg`: o desenho da parte clara da capa, já posicionado (viewBox `0 300 480 420`).
- `icones/<slug>.svg`: o ícone das lombadas (viewBox 120 × 160).
- `serie/xicara.svg`: o emblema da série Atualizações do Java.
- `tags/<slug>.svg`: o ícone de cada tag (D52), no mesmo traço dos ícones (seção "Tags", no fim).
- `grao.svg`: textura de grão de papel, em ladrilho de 180px, por cima de tudo.

Nos SVGs, o traço usa `currentColor`. Os preenchimentos usam `var(--capa-papel)` nos desenhos, `var(--lombada-cor)` nos ícones e `var(--serie-papel)` no emblema. Coloque os SVGs inline, porque com `<img>` a cor não é herdada. Eles são decorativos (`aria-hidden`). Títulos e números são sempre texto de verdade.

O papel é `#f2ede2`, e o texto comum sobre ele é `#1f1c18`. As fontes são Bitter (600, 700 e 800) e Newsreader itálico (400 e 500).

## O número

O número nas lombadas e na página de cada livro é o total de artigos da categoria ou da série, calculado pelos posts. Sem artigos, o número não aparece. O "VOLUME 01" da capa é outra coisa: é a posição do livro na coleção.

## Os livros

| Vol. | Título | Cor | Destaque | Título na capa | Frase | Instrumento |
|---|---|---|---|---|---|---|
| 01 | Arquitetura de Software | `#2d4b46` | `#2d4b46` | 73px | As decisões caras de desfazer. | arco e pedra angular |
| 02 | Desenvolvimento de Software | `#7a4430` | `#7a4430` | 50px | O ofício dentro de cada serviço. | paquímetro medindo uma peça |
| 03 | Dados | `#5f4662` | `#5f4662` | 108px | Onde o dado mora e por onde ele anda. | gaveta de fichas |
| 04 | IA | `#6e2f45` | `#6e2f45` | 108px | Software feito com IA e software que usa IA. | autômato escritor |
| 05 | Segurança | `#606a37` | `#606a37` | 82px | Quem pode o quê e como provar. | carta lacrada e sinete |
| 06 | DevOps | `#465976` | `#465976` | 108px | O caminho do commit até a produção. | guindaste de porto |
| 07 | SRE | `#c4a050` | `#836100` | 108px | O que mantém a produção de pé. | farol |
| 08 | Carreira | `#9a7650` | `#7f5b36` | 104px | O lado humano de construir software. | compasso |

## Capa de categoria (referência de 480 × 720px)

No site, declare `container-type: inline-size` na capa e escreva cada medida como `calc(N * 100cqw / 480)`, para tudo escalar junto.

- **Fundo e forma:** fundo no papel, cantos de 1px do lado da lombada e 3px do lado aberto, sombra `0 1px 1px rgba(0,0,0,.22), 0 18px 40px rgba(0,0,0,.24)`.
- **Bloco de cor:** de y 0 a 300, largura inteira, na cor do livro.
- **Linha do topo:** em y=34, de x=38 a 442. "VOLUME 01" à esquerda e "CESAR SCHUTZ" à direita, em Bitter 700 12px, letter-spacing 0.2em, na `tinta` com opacidade de 0,9.
- **Título:** Bitter 800 com letter-spacing −0.03em, sem quebra automática, na `tinta`. Fica num bloco a partir de x=36, com 420px de largura, alinhado pela base em y=278. O corpo é o que faz a linha mais longa ocupar 404px, com teto de 108px (valores na tabela). A entrelinha é igual ao corpo em títulos de uma linha e 0,97 do corpo em títulos de duas linhas. Títulos com "de Software" quebram antes do "de".
- **Frase:** em x=38 e y=324, com 404px de largura, em Newsreader itálico 24/31px, `text-wrap: balance`, na tinta do papel. É só a frase depois dos dois-pontos do subtítulo. Os temas não aparecem na capa.
- **Desenho:** o SVG de `desenhos/` ocupa a parte clara. O objeto fica centralizado na área de x 36 a 444 e de y 384 a 678, apoiado na base. O traço usa o `destaque`, e `--capa-papel` recebe o papel.
- **Assinatura:** "BLOG.CESARSCHUTZ.COM.BR", centralizado em y=694, em Bitter 600 10px, letter-spacing 0.14em, opacidade de 0,55.

## Lombada de categoria em pé (estante)

A ordem, de cima para baixo, é: ícone, título e número. O ícone e o número giram como o texto, então a lombada deitada é a mesma lombada rotacionada.

- **Medidas:** alturas e larguras em `livros.json`. A largura é cerca de um quarto da altura.
- **Duas partes:** em cima, a cor do livro. Embaixo, o papel, com 400px de altura medidos da base em todos os livros, para que a divisão forme uma linha contínua na estante. Na animação de girar, quando a lombada assume a altura da capa, o bloco de cor passa a ter 300 de 720, alinhado com a capa.
- **Forma e volume:** cantos de 3px em cima e 1px embaixo, grão e, desde a D57, a luz da lombada arredondada: um gradiente horizontal que escurece bem as beiradas e leva um brilho largo um pouco antes do meio (`rgba(0,0,0,.34) 0%, .16 5%, .05 14%`, branco `.04 28%, .13 43%, .09 56%`, preto `.02 70%, .12 87%, .32 100%`), um fio de luz no alto (4) e o pé um nada mais escuro (14). Na estante, a sombra é a de contato na tábua; os lados e a cabeça dão o volume (seção "Estante").
- **Ícone:** o SVG de `icones/` girado 90° no sentido horário (`transform: rotate(90deg)`), centralizado no bloco de cor, com cerca de 22px de margem lateral e 32px acima e abaixo. O traço usa a `tinta`, e `--lombada-cor` recebe a cor do livro.
- **Título:** 26px abaixo da divisão, em `writing-mode: vertical-rl`, Bitter 800 30/33px, letter-spacing −0.01em, no `destaque`. Cada linha do título vira uma coluna.
- **Número:** 26px acima da base, em `vertical-rl`, Bitter 700 28px, no `destaque`.

## Livro 3D: capa dura (D57)

O livro em pé (grade de Categorias e de Séries, topo da página do livro, livro ampliado e gaveta da home) é
um livro de capa dura de verdade, com as mesmas artes de capa e de lombada (`Livro3D.astro`, a parte
"livro 3D inteiro" de `src/styles/livro.css`; referência: a prancha 01 de
`docs/prototipos/livros-realistas/`). Medidas em unidades da referência (capa de 480 × 720):

- **Capas de papelão de 8** (`--papelao`): a capa é uma placa, com a arte por fora e o verso por dentro, e a
  borda de cima forrada na cor impressa no alto dela (o papel; na série, a faixa laranja). A contracapa é
  lisa, na cor de baixo do livro (na série, o papel), com a borda de cima na mesma cor e, por dentro, a
  dobra do material (18) e a guarda em papel.
- **Seixa de 9** (`--seixa`): o miolo é 9 menor que as capas no alto, no pé e na frente. A página de dentro,
  as folhas do livro ampliado e o alto do miolo seguem a seixa.
- **Lombada arredondada:** a arte da lombada (a mesma da estante) numa face plana 0,1 da espessura para
  fora das capas, com só o meio dela à vista (de 15% a 85%); dos dois lados, duas facetas que fazem a curva
  até as capas, nas mesmas duas cores, divididas na mesma altura. A luz corre pela curva: o lado de trás
  escurece, a frente leva um brilho largo e suave e cai um pouco na quina com a capa.
- **O alto:** o miolo em creme (o papel clareado), com as linhas das folhas (mais marcadas a cada caderno)
  e a sombra das capas nas beiradas; na lombada, a borda do material, o oco escuro e o **cabeceado**, um
  fio listrado em papel e na cor do livro escurecida (um SVG deitado, gerado em `Livro3D.astro`).
- **Na capa:** o vinco da dobradiça a 22 da lombada, de alto a baixo; a queda suave da luz da lombada para
  a frente e do alto para o pé; um brilho acetinado largo e fraco; as bordas arredondadas (fio de luz no
  alto, escuro na frente e no pé). Tudo em camadas pretas e brancas translúcidas, por cima do grão.
- **A vista e a sombra:** o olho um pouco acima do livro (a vista gira 15° em X, fora do giro do livro),
  para o alto aparecer. No chão, a sombra de contato, justa, e a projetada, larga e fraca, para a direita
  (a luz vem do alto à esquerda). A gaveta da home não tem a sombra no chão.
- **Os movimentos continuam:** girar no mouse (38° → 24°), a capa que abre no livro ampliado (com o verso e
  as folhas), o voo da estante para a gaveta e da pilha para o topo, e as trocas de página. Só o `rotateY`
  do livro se mexe; nada de `filter` nas peças (achataria o 3D).
- **O livro ampliado aberto:** enquanto a capa abre, a vista se endireita (`--aberto`, `livro.css`) e o
  livro fica de frente, um livro só: a capa aberta à esquerda e, atrás das folhas da direita, a guarda da
  contracapa (`.guarda-de-tras`, `paginas.css`), as duas na cor do livro (na série, no papel) e passando o
  miolo pela seixa. A sombra no chão sai; a do palco fica.

## Estante

- **Livros e prateleira:** livros em pé com 6px entre eles, sobre uma prateleira de 20px em `#b5bab4` (14 até a D57, que deu a ela a face de cima e a borda da frente) com borda inferior de 6px em `#9ba19b`.
- **Livro inclinado:** o último livro da coleção fica inclinado 6°, girando pelo canto de baixo do lado direito, com o topo apoiado no alto do aparador.
- **Aparador:** uma barra de 12 × 470px (gradiente `#6f7775`, `#9aa19f`, `#7a8280`) com base de 48 × 9px. Ele separa as categorias das séries, que vêm depois dele.
- **Com volume (D57, prancha 07):** o olho fica um pouco acima dos livros (190 acima do mais alto), e cada
  lombada é um livro em 3D: a cabeça (as bordas das capas, o miolo e o cabeceado) e o começo dos dois
  lados (60, escuros), que deixam os vãos entre os livros no fundo escuro; a prateleira é um espaço 3D só,
  e os vizinhos se tapam de verdade. A lombada tem a luz correndo pela curva. A tábua tem espessura (a face
  de cima, um pouco na frente dos livros e subindo atrás deles, a borda da frente com um fio de luz, a de
  baixo e a sombra na folha), e cada livro faz a sombra de contato nela. O aparador é uma haste de metal
  redonda, com a ponta arredondada, sobre uma base redonda.
- **Livro escolhido no filtro:** os outros apagam com um véu do papel da folha a 62% (`--apagado`), e não
  com opacidade e filtro, que achatariam o 3D e deixariam a tábua aparecer através deles.

## Lombada deitada (lateral)

Desde a D39, é **a mesma lombada em pé** (`MioloLombada` dentro de `.lombada-visual`), com as mesmas
proporções, ícone, tipografia e contagem, girada 90° para a esquerda: o ícone fica na ponta
esquerda e o título e o número correm na horizontal. A escala da pilha faz o livro mais longo caber
na largura da lateral (teto de 0,42px por unidade, o da estante). Só na pilha, a lombada fica 12%
mais grossa que isso, com o texto na mesma proporção, para o título chegar a uns 11 ou 12px (D40);
o comprimento e a divisão do papel não mudam. O volume 1 fica embaixo, cada livro
deslocado pelo `deslocamento` de `livros.json` (em unidades da lombada em pé), com uma prateleira
embaixo na cor da estante. **Com volume (D57, prancha 08):** a luz da curva vem de cima; em cima de
cada livro, a capa vista de um pouco acima (uma faixa fina, inclinada, que foge para trás, nas cores
impressas), que o livro de cima tapa onde ele é mais longo; embaixo, a sombra que ele faz no de baixo; a
prateleira com espessura, como a da estante. Os campos `comprimento` e `espessura` de `lombadaDeitada`
não são mais usados. O livro aberto no topo da página não fica na pilha (D46): ao trocar de livro, ele
volta para o alto dela.

## Séries: livro com capa de revista (D57)

Desde a D57 (muda a D32), a série é um livro de capa dura como os outros, fora da coleção: a capa é a de
revista técnica descrita abaixo, a lombada é de papel com a faixa laranja no alto (e a borda de cima da
capa, também na faixa), e a contracapa é de papel. Continua sem se confundir com as categorias, que têm o
papel e a cor divididos na capa: cada post é uma edição. De uma série para outra mudam a cor de destaque, o título, o emblema, o número de capa, a lista de edições e a tarja (os dados estão em `livros.json`).

**Capa (480 × 720):**

- **Papel e faixa:** papel com grão e cantos quase retos. Uma faixa de 14px no destaque atravessa o topo.
- **Cabeçalho:** `tituloPrincipal` em Bitter 800 64/64px, letter-spacing −0.03em, em x=36 e y=40, na tinta do papel. Logo abaixo, em x=38 e y=104, o `complemento` em Newsreader itálico 500, 44/48px, no destaque.
- **Linha de dados:** em y=168, com 408px de largura, fio de 2px em cima e 1px embaixo, 8px de respiro. "SÉRIE 01", "CESAR SCHUTZ" e "7 EDIÇÕES", em Bitter 700 12px com letter-spacing 0.16em.
- **Número de capa:** o `rotuloDoNumero` em Newsreader itálico 18px em y=232. Logo abaixo, o `numeroDeCapa` enorme, em Bitter 800 250/250px, letter-spacing −0.06em, no destaque, em x=26 e y=238.
- **Lista de edições:** à direita do número, em x=300, y=262, com 144px de largura. Cada linha tem fio em cima, o nome em Bitter 600 17px e uma nota em Newsreader itálico 15px à direita ("arquivo" ou "edição atual"). A edição atual fica em Bitter 800, no destaque.
- **Tarja:** opcional, é o material especial da série. Uma faixa escura de largura inteira, em y=498, com 78px de altura, na tinta do papel, com uma barra de 10px no destaque à esquerda. O `guia.titulo` vai em Bitter 800 25/28px no papel, e a `guia.linha` em Newsreader itálico 19/24px em `#e9a27a` (o destaque clareado). À direita, uma seta num círculo de 36px com borda de 2px no destaque.
- **Rodapé:** o emblema na tinta do papel, na área de x 36 a 150 e de y 588 a 694. Ao lado, em x=172 e y=598, o `subtitulo` em Newsreader itálico 20/27px, com 272px de largura. Embaixo dele, em y=668, "BLOG.CESARSCHUTZ.COM.BR" em 10px.

**Lombada em pé:**

- **Base:** papel, fina (80px de largura na estante), com a faixa de 14px no destaque no topo.
- **Conteúdo:** o emblema girado 90°, o título na vertical em Bitter 800 26px, com o complemento em Newsreader itálico no destaque, e o número no pé em Bitter 800 26px, no destaque.

**Lombada deitada:** a lombada em pé girada, como nas categorias (D39).

## Livros novos

- **Categoria:** escolha um instrumento de ofício que represente a categoria inteira e desenhe no estilo do projeto, com traço de 1,8, 1,2 e 0,7px, leve tremor, hachura nas sombras e um único elemento fantasma tracejado. Gere o ícone da lombada com só os traços principais. A frase segue o molde do subtítulo, e o volume é o próximo número.
- **Série:** um livro de capa dura com a capa de revista. Defina a cor de destaque, o título (palavra principal e complemento em itálico), o emblema no mesmo traço, o número de capa, a lista de edições e, se houver material especial, a tarja.

## Tags (D52)

Cada tag tem um ícone, no traço dos ícones das lombadas. Ele aparece nos cartões de `/tags/`, grande
como marca d'água no topo da página da tag (na tinta, bem suave, cortado pela borda da folha) e
pequeno nas pílulas de tag (`PilulaTag.astro`: as vizinhas na página da tag, "Por assunto" em "Todos
os artigos" e as mais usadas no topo da página do livro).

- **Arquivo:** `tags/<slug>.svg`, com o nome da tag sem acento, minúsculo e com hífen ("Banco de
  Dados" → `banco-de-dados.svg`, "Concorrência" → `concorrencia.svg`). Caixa fixa de 120 × 120, com o
  desenho centrado, mais ou menos entre 14 e 106, e o mesmo peso dos outros (o que é redondo ou largo,
  um pouco menor).
- **Traço:** o dos ícones das lombadas: `cz-ln` com `cz-w1` (contorno, 1,3), `cz-w2` (detalhe, 0,85)
  e `cz-w3` (bem fino, 0,7), pontas redondas e um leve tremor gravado no próprio traço (como nos
  ícones, e não o filtro dos desenhos dos posts: o ícone aparece muitas vezes na mesma página). O que
  tem volume leva `style="fill: var(--tag-papel)"`, que tapa o que fica atrás; no máximo um elemento
  fantasma (`cz-gh`). Só `currentColor` e variáveis: sem cor fixa, sem `id`, sem `defs` e sem texto.
- **O que desenhar:** um objeto de ofício que seja a metáfora da tag, **nunca o logotipo** de um
  produto ou de uma marca. Os de hoje: broto com duas folhas (Spring), moedor de café de manivela
  (JVM), âncora (LTS), semáforo de ferrovia (Concorrência), carretel de linha com agulha (Virtual
  Threads), balança de pratos (Trade-offs), pena no tinteiro (Linguagem), pilha de moedas
  (Pagamentos), caixa de correio com a bandeira levantada (Mensageria), rolo de papel com as linhas do
  registro (Logs), leme de navio (Kubernetes), barril (Banco de Dados), mala de viagem (Migração),
  cadeado de segredo (Criptografia), favos de mel com uma célula por fazer (Microsserviços), chave
  antiga com etiqueta (Idempotência), bigorna e martelo (Gradle), nuvem (AWS), espeto de notas (AOP) e
  ingresso com canhoto (JWT).

### Tags novas

1. Escolha o objeto (a metáfora, no espírito dos de cima) e escreva o desenho em `DESENHOS` de
   `scripts/desenho/tags.mjs`, à mão, em coordenadas (linhas, arcos, curvas e retângulos, na ordem de
   pintura). O script passa a caneta, com o tremor dos ícones e uma semente tirada do nome (sai igual
   a cada vez).
2. Grave: `node scripts/desenho/tags.mjs <slug>` (com o Node 24: `fnm exec --using=24`).
3. Confira em `/amostra/tags/` (só no dev): lado a lado com os outros e em cinco tamanhos, da pílula
   à marca d'água, nos dois temas (`?tema=escuro`). O novo tem de ter o mesmo peso dos vizinhos.
4. **Sem o ícone, o build quebra:** a página `/tags/` desenha o ícone de toda tag usada num post, e
   `src/lib/tags-svg.ts` para com o caminho do arquivo que falta.
