---
name: desenho
description: Cria ou altera a ilustração SVG de um post (a capa) no estilo de docs/estilo-desenho.md, seguindo as regras técnicas (classes e variáveis CSS, sem id nem defs, recortes com área segura, alt), com o detalhe da capa viva (classes mexe-*, D58), e validando antes de aceitar. Use ao desenhar ou corrigir a ilustração de um post. Figuras, animações, logos e print do corpo do post ficam na skill figura; lousas, na skill lousa.
---

# Desenho (ilustração do post)

Formato, definições globais e scripts desde a Fase 5 (D11); os 27 posts têm ilustração. Referência:
`src/ilustracoes/cobranca-duplicada-no-retry.svg`.

**Antes de desenhar, leia `docs/estilo-desenho.md`**, porque o estilo pode ter mudado.

Esta skill é da capa. Os desenhos do corpo do post têm as suas: figuras (diagramas e gráficos
coloridos), animação com play, logos das ferramentas e print, na skill `figura`; lousas, na `lousa`.

## O que desenhar

Cada post tem **uma** ilustração, desenhada sobre algo concreto do artigo. Todos os lugares usam
recortes dessa mesma ilustração. Exemplo aprovado, no post de idempotência: a chave com a etiqueta
`abc-123` sobre o comprovante, com a segunda cobrança em linha fantasma.

- Quem leu o artigo reconhece o assunto em um segundo.
- Um protagonista e de 2 a 4 elementos de apoio, todos ligados entre si (encostados, apontando ou
  alinhados). Nada solto flutuando.
- Nada genérico. Se o desenho serviria para outro artigo, está errado. "N retângulos com listras"
  não é motivo.
- Legível na miniatura quadrada.

Exceção: os posts da série Java não são desenhados à mão. Eles saem de um script com padrão fixo (D17,
Fase 6; ver a skill `serie-java`).

Como trabalhar:
1. Ler o post inteiro.
2. Escrever para si, numa frase, a ideia que o leitor leva.
3. Escolher o motivo e desenhar.
4. Validar e **olhar o render**.
5. Corrigir e repetir.

Erros que o Cesar já reprovou no blog atual:
- desenho desalinhado, mais perto de uma borda do que da outra;
- elemento solto;
- motivo sem relação com o texto;
- formas genéricas.

## Regras técnicas (briefing §6)

- **Só classes e variáveis CSS.** Nenhuma cor fixa, `style=` ou `stroke-width` no arquivo: a
  espessura vem do CSS, conforme o tamanho em que o desenho aparece.
- **Filtros e padrões** (tremor, hachura) são definidos **uma vez** no layout. O desenho não declara
  `id` nem `<defs>`, porque vários desenhos convivem na mesma página e os ids colidiriam.
- **Recortes.** A ilustração declara seus recortes, com uma **área segura central** que sobrevive a
  todos eles:
  - topo do artigo largo (~2,35:1);
  - 3:2 (destaque, cards e topo no celular);
  - 1:1 (miniatura);
  - área da imagem de compartilhamento (1200×630).
- **`alt`** descritivo: o que o desenho mostra, em uma frase.
- O espaço entre dois `<tspan>` some ao embutir o SVG: use `&#160;`.

## Arquivo

`src/ilustracoes/<slug>.svg`, com esta raiz:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -40 1200 900"
  aria-label="O que o desenho mostra, numa frase."
  data-largo="80 158 1100 468" data-medio="200 100 900 600" data-quadrado="415 110 670 670"
  data-og="350 -40 740 883" data-segura="415 158 670 468">
```

- Recortes em "x y largura altura", no espaço do desenho: `largo` 1100:468 (topo no computador, com
  anotações), `medio` 3:2 (destaque, cards, topo no celular), `quadrado` 1:1 (lista, 108 e 76 px) e
  `og` livre (lado direito da imagem de compartilhamento, com `meet`). `data-segura` é a área que
  cabe em todos: o protagonista fica dentro dela.
- O desenho só aparece onde existe o arquivo: sem ele, topo, cards e lista ficam sem imagem.

Classes (definidas em `src/styles/desenho.css`; nenhuma outra passa no validador):

| Classe | Uso |
|---|---|
| `tinta` | grupo dos traços, o único que treme; texto nunca vai dentro dele |
| `linha` | traço sem preenchimento |
| `fumaca` | junto de `linha`, só na fumaça da caneca da série Java (o traço começa embaixo): no hover do cartão, do item da lista ou do topo, a fumaça sobe e uma nova se escreve (C04, D52) |
| `papel` | preenchido com a superfície (tapa o que está atrás) |
| `cor` | a cor da categoria: cópia da forma com `transform="translate(7 6)"`, antes do contorno |
| `hachura` | sombra: cópia da forma deslocada (+14 objetos grandes, +7 caixas), antes do papel |
| `fantasma` | o que não acontece, alternativas e estados anteriores |
| `carimbo` | contorno na cor da categoria |
| `rotulo`, `valor`, `numero`, `codigo`, `carimbo-texto` | textos do desenho (poucos: até 60 caracteres) |
| `sobre-cor` (junto da classe do texto) | texto escrito em cima de uma forma `.cor` (o número da caneca, a etiqueta): tinta no claro, papel no escuro; sem ela, a tinta quase branca some na cor clareada do escuro (D82) |
| `anotacao` | grupo das anotações, que só aparece no recorte largo |
| `nota`, `nota-pequena`, `chamada` | texto e linha de chamada das anotações |
| `mexe-*` | o detalhe da capa viva (abaixo), num `<g>` |

Transformações (`translate`, `rotate`) e `fill-rule` são geometria e podem ficar no arquivo.

## Capa viva (D58)

A capa continua parada, mas **um detalhe só**, que conta algo do assunto, se mexe quando o mouse
passa pelo topo do artigo, pelo card ou pelo item da lista (`src/styles/capa-viva.css` e
`src/scripts/capa-viva.ts`, carregados pelo `Ilustracao.astro`). Discreto, cerca de 1 s, uma vez. É a
fumaça da caneca da série Java (`fumaca`, D52) levada para toda capa. Escolha o detalhe pelo assunto:
o vapor que sobe, o ponteiro que gira, o envelope que desliza, o alarme que treme.

| Classe | Tipo | O que faz | Para |
|---|---|---|---|
| `mexe-balanca` | evento | balança pendurada pelo alto | etiqueta, placa, pêndulo |
| `mexe-pulsa` | evento | cresce um pouco e volta | luz, coração, alerta |
| `mexe-pisca` | evento | apaga e acende duas vezes | LED, cursor, status |
| `mexe-sobe` | evento | sobe e some, volta de baixo | vapor, bolha, mensagem que sai |
| `mexe-treme` | evento | treme rápido | alarme, erro, telefone |
| `mexe-escreve` | evento | o traço se escreve de novo (`pathLength="1"` no path) | assinatura, gráfico, seta |
| `mexe-enche` | evento | esvazia e enche de baixo para cima | barra, copo, medidor |
| `mexe-gira` | estado | gira 120° e fica; volta girando | engrenagem, ponteiro, roda |
| `mexe-desliza` | estado | anda 22 unidades para a direita e fica; volta deslizando | envelope, plugue, lupa |

- **Evento:** acontece e volta sozinho, com o mouse ainda em cima, e vai até o fim mesmo que o mouse
  saia no meio (o `capa-viva.ts` segura a classe `mexendo` por 1,4 s).
- **Estado:** muda e fica enquanto o mouse está em cima; ao tirar o mouse, volta animado, um pouco
  mais rápido que a ida. **Nada pode pular de volta.** Para deslizar em outra direção, gire o `<g>` de
  fora.
- **Onde pôr a classe:** num `<g>` **sem `transform` próprio**, dentro do grupo `.tinta` (se a peça já
  tem transform, ponha o `<g class="mexe-…">` por dentro dela, em volta do desenho). O giro e a escala usam o centro da própria peça
  (`transform-box: fill-box`; `mexe-balanca` gira pelo alto, `mexe-enche` cresce pela base). A classe
  nunca vai direto num `.cor` ou num `.papel` solto: ponha a peça inteira (cor, papel e linha) dentro
  do `<g>`, para ela se mexer junta.

```svg
<g class="tinta">
  …
  <g class="mexe-gira">
    <circle cx="671" cy="352" r="68" class="linha"/>
    <path d="M660.7 364.3 L710.9 304.5" class="linha"/>
  </g>
</g>
```

- Um detalhe por capa. Só `transform`, `opacity` e `stroke-dashoffset` (as classes já cuidam disso).
- Com movimento reduzido, nada se mexe. A série Java continua com a `fumaca` da caneca.
- Conferir: no dev, passe o mouse no topo do artigo, num card e num item da lista, e tire o mouse no
  meio do movimento (não pode pular). Foto: `node scripts/foto.mjs <url> <saida.png>
  --hover "[data-desenhar-topo]" --antes 7000 --esperar 500`.

## Validar e conferir

```sh
fnm exec --using=24 node scripts/desenho/validar.mjs <slug>   # regras técnicas
fnm exec --using=24 node scripts/desenho/centrar.mjs <slug>   # recortes centrados no desenho (dev no ar)
fnm exec --using=24 node scripts/desenho/render.mjs <slug>    # folha num PNG (precisa do dev no ar)
fnm exec --using=24 node scripts/desenho/revisar.mjs <slug> --base <dev>   # revisão do post inteiro (D59)
```

Terminou a capa (ou qualquer desenho do post)? Antes de mostrar ao Cesar, rode o `revisar.mjs` e olhe
as fotos dele pelo checklist da skill `figura` ("Validar, revisar e conferir"); na capa, confira também
o detalhe da capa viva no topo, no card e na lista: o evento vai até o fim mesmo que o mouse saia, e o
estado volta animado.

Depois de desenhar, rode o `centrar.mjs`: ele mede o conteúdo e reescreve `data-medio`,
`data-quadrado`, `data-og` e `data-segura` centrados nele (o largo só muda na altura). Desde a
D33, os recortes são **justos**: o desenho ocupa até 86% da largura e 82% da altura do médio e 90% do
quadrado, para aparecer grande no destaque, nos cards e na miniatura (com folga maior, ele ficava
pequeno no painel). Sem o `centrar.mjs`, o desenho fica fora do centro e pequeno nos recortes.
A série Java não se desenha: `node scripts/desenho/java.mjs` gera as oito a partir de `src/data/java.ts`;
depois, rode o `centrar.mjs` nelas (o guia e a próxima LTS têm outro desenho).

O render gera `.render/desenhos/<slug>.png` com todos os recortes nos tamanhos reais e a imagem de
compartilhamento, no claro e no escuro. A mesma folha abre no dev em `/amostra/desenhos/?slug=<slug>`.
Como no site, cada recorte aparece no painel tingido pela cor da categoria (D26): as áreas `papel`
ficam na cor do painel, e o traço, 20% mais grosso.
O desenho só é aceito depois de passar no validador **e** de ser conferido a olho no PNG: miniatura
legível, protagonista centrado, nada cortado no recorte largo, anotações longe das bordas.
