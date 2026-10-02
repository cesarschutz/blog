# Luz realista: a lâmpada do lustre e o brilho nos livros (T4, T6, T7)

Pesquisa e demos de 01/10/2026. Demos em `.astro/depuracao/redesenho/r3/luz/`:
`lampada.html` (teclas L e D, ou o botão), `livro.html`, `filmar.mjs`, `custo.mjs`, `custo.json`.
Filmes em `.../luz/filmes/`. Nada foi instalado e nada em `src/` mudou.

## Fontes (técnica, nenhum código copiado)

- Resposta térmica do filamento: artigo do Springer sobre lâmpadas miniatura (resposta de primeira
  ordem, uma exponencial com constante térmica τ): <https://link.springer.com/article/10.1007/s10762-014-0130-8>.
  Temperatura de cor: ~2700 K a plena carga, caindo para ~900 K (vermelho-brasa) quando quase apagada.
  Nenhuma fonte dá o tempo exato de uma lâmpada doméstica; os τ abaixo são **escolhidos a olho** dentro
  da faixa física (dezenas a poucas centenas de ms) e ajustados nos filmes.
- Brilho especular com `soft-light`/`overlay`, variáveis do ponteiro, `isolation: isolate`, perspectiva no
  contêiner: <https://chiubaca.com/holograpic-cards-pt-1/>, <https://robbowen.digital/wrote-about/css-blend-mode-shaders/>.
  Fresnel não tem receita pronta na web: é aproximação nossa (faixa que clareia na quina).

## 1. A lâmpada

### O que é físico e o que convence

1. **A luz sobe mais devagar que o clique e desce mais devagar ainda.** Filamento = massa térmica: T(t) é
   exponencial. Ligar `T = 1 − e^(−(t−atraso)/τ)`, com **τ = 75 ms e atraso de 25 ms** (95% em ~250 ms).
   Desligar `T = e^(−t/τ)` com **τ = 170 ms** (some em ~1 s).
2. **A luz visível não é linear em T**: cresce muito mais rápido que a temperatura (quase T^4 a T^5 no
   visível). Por isso cada camada usa um expoente diferente, e o expoente cria a **cor**:
   - brasa (vermelho-laranja, `255 92 20`): `T^0.8`. Chega primeiro e **é a última a sair** (o pós-brilho);
   - âmbar (`255 168 70`): `T^2`;
   - branco quente (`255 232 190`): `T^4.5`. Só aparece perto do fim e some logo ao apagar.
   Resultado nos filmes: ao ligar, laranja-escuro em ~40 ms, âmbar em ~100 ms, branco-creme em ~300 ms; ao
   apagar, o branco morre em ~100 ms e sobra uma brasa laranja até ~500 ms.
3. **O tremor da partida (só incandescente)**: ~150 ms de oscilação de ±20% que decai linearmente, uma soma
   de senos defasados (determinística, sem `Math.random`, para o filme ser repetível). Dá o "pisca" do
   contato ao ligar. Não repetir ao apagar.
4. **LED**: `τ liga = 14 ms`, sem atraso, com um pico de ~10% que assenta em ~60 ms; `τ desliga = 22 ms`,
   **sem brasa e sem tremor**. A luz é branco-fria direto. Se o Cesar quiser "de verdade", a incandescente é a
   que mostra o filamento; recomendo ela (mais bonita e conta mais história).
5. **Ordem no tempo (a parte que mais convence)**: o núcleo (vidro/filamento) acende **antes** do halo, o
   halo antes do cone, e a sala (o escuro do tema) por último. Nas demos todas leem o mesmo T, mas com
   expoentes crescentes: núcleo `T^4`, halo branco `T^4.5`, cone `T^2.6`, sala `1 − T^2.2`.

### Camadas (todas só `opacity`, em WAAPI, compositor)

| Camada | O que é | Opacity |
|---|---|---|
| Sala (tema) | fundo escuro cobrindo a página, `opacity` de 1 a 0 | `1 − T^2.2 · tremor` |
| Halo brasa / âmbar / branco | 3 `radial-gradient` concêntricos de 520, 760 e 300 px, centrados no bulbo, `mix-blend-mode: screen` | veja acima |
| Cone | `conic-gradient` de 60° abrindo para baixo, máscara que some em 85% da altura | `T^2.6` |
| Núcleo | dois círculos no SVG (laranja `T^0.9` e creme `T^4`) sobre o vidro | idem |
| Cúpula iluminada por dentro | o `fill` da cúpula sobe do `--fundo` para `--luz` com o mesmo T (como é SVG, via opacity de uma cópia, não transição de fill) | `T^2` |

A técnica de ouro: **crossfade de camadas de cores fixas em vez de animar cor**. Nada de `filter`,
`box-shadow` nem `background` animado.

### O gerador (JS, roda uma vez por clique, não por quadro)

```js
const T = (t, liga, m) => liga
  ? (t < m.atraso ? 0 : 1 - Math.exp(-(t - m.atraso) / m.tauLiga))
  : Math.exp(-t / m.tauDesliga);
// amostra a ~60 pontos (1 por quadro) e entrega ao WAAPI como keyframes lineares:
const kf = []; for (let i = 0; i <= N; i++) kf.push({ opacity: f(T(i*dt, liga, m)), offset: i/N });
el.animate(kf, { duration: dur, fill: "forwards", easing: "linear" });
```

Por que amostrar em vez de `cubic-bezier`: uma exponencial com expoentes diferentes por camada não é uma
bézier; com 60 keyframes lineares o WAAPI roda no compositor sem JS por quadro. Para `prefers-reduced-motion`:
trocar por 1 keyframe (fade de 150 ms) ou nenhum, direto no estado final.

### Tamanho no cabeçalho do 02

O abajur hoje tem 40×64 px e o halo, 72 px: **pequeno demais para parecer luz**. Na demo o halo âmbar é de
760 px, ancorado no bulbo e `position: fixed` (transborda sobre o cabeçalho e a página); o cone, 620 px. Para o
blog, o halo grande vira uma camada no `<body>` (não no botão), com `pointer-events: none`. No tema claro o
"escuro" é o que some; no escuro, ligar acende o halo sobre a página sem clarear todo o fundo (usar halo +
cone, sem a camada "sala").

### Filmes

`filmes/tira-inc-liga.png` (0, 40, 80, 120, 200, 300, 450, 600 ms), `filmes/tira-inc-desliga.png` (0 a 1400 ms),
`filmes/tira-led-liga.png`, e os quadros soltos `lamp-*.png`. Foram feitos pausando as animações e fixando
`currentTime`, então são exatos.

## 2. O brilho no livro 3D

O livro do blog já tem `.luz-capa` (queda de luz estática, D57) dentro de `.face-capa > .capa-frente`, e a
lombada tem o gradiente de luz próprio. O brilho novo é **uma camada `.brilho` a mais** em cada face
(capa e `.face-lombada`), `position: absolute; inset: 0; overflow: hidden; pointer-events: none; isolation:
isolate`, **sem tocar** no desenho. A face é plana dentro do 3D, então o `mix-blend-mode` mistura só com o
próprio desenho (e não vaza para a página).

### Camadas e valores

1. **Mancha especular que segue o ponteiro** (a principal): um `<i class="spec">` **maior que a face** (420 px
   na capa de 240; 300 px no verniz), com um `radial-gradient` parado, movido por `transform:
   translate3d(var(--px)px, var(--py)px, 0)`. O JS só escreve `--px/--py` (−120..120 e −130..130 px) em um
   `requestAnimationFrame` no `pointermove`. Só `transform` e `opacity`: nenhum repaint do gradiente.
2. **Papel fosco x verniz** (a diferença que o Cesar pediu):
   - **Fosco (papel/tecido)**: mancha larga (420 px), `soft-light`, pico baixo (`.85` no centro, cai a `.25` em 38%).
     Escurece e clareia suave, sem ponto. Sobre papel creme `soft-light` quase não aparece: para fosco, subir
     o pico para branco puro ou usar `screen` com 8–12% de opacidade.
   - **Verniz (capa dura plastificada)**: mancha **pequena e intensa** (300 px, pico `rgb(255 255 255/.95)` caindo
     a `.3` em 30%), `overlay`. Cria o "ponto de luz" branco que corre. Mais a faixa diagonal (item 4).
   - Cada livro escolhe um: capa dura de pano = fosco; sobrecapa = verniz. Sugestão: **verniz na capa, fosco
     na lombada** (a lombada é o pano).
3. **Fresnel na quina capa/lombada e nas bordas**: três gradientes lineares finos na `.brilho` (quina esquerda
   `rgb(luz/.55) → 0` em 5% da largura; fio de luz de 2% no topo; 3% embaixo), `mix-blend-mode: screen`.
   Aparece com `opacity` de 0 a 1 em 0,4 s no hover. Ele **cresce com o giro**: como o livro vira de 30° a 20°
   no hover, a quina fica mais de frente para a luz (físico: Fresnel é maior em ângulos rasantes; aqui sobe
   no hover por esse motivo).
4. **Varredura do verniz**: uma faixa diagonal `linear-gradient(100deg, transparent 42%, #fff6 50%, transparent 58%)`
   que atravessa a capa uma vez no `mouseenter` (1 s, `cubic-bezier(.2,.7,.2,1)`), só `transform` e `opacity`.
   É o que já existe em `.foco-brilho`: manter, mas **junto** com a mancha, não no lugar dela.
5. **A lombada pega a luz em outro ângulo**: a mesma luz, mas a mancha da lombada se move **na vertical**
   (`--py`, ×0,9) e a faixa de brilho dela anda no eixo X com `--vx` (±40%). Quando o ponteiro vai para a
   esquerda (lado da lombada), a faixa dela acende; quando vai para a direita, a da capa. Truque: o ponteiro
   define uma só direção de luz (`--px`), e cada face usa a projeção dela.
6. **Cor da luz**: `--luz` **quente** (`255 236 200`) nos dois temas, não branco puro; no escuro, um pouco
   mais âmbar. Em livro de capa azul-escuro o `overlay` produz azul-claro limpo (ver `filmes/livro-b-0.3-0.3.png`).

### Custo medido (CPU 4× mais lenta, Chrome headless)

| Caso | Mediana | p95 | Layout | Tarefa (ms, 120 quadros) |
|---|---|---|---|---|
| Lâmpada liga+desliga, 1× | 16,7 ms | 16,8 | 2 | 24 |
| Lâmpada liga+desliga, 4× | 16,7 ms | 16,8 | 2 | 70 |
| Brilho verniz (transform), 1× | 16,7 ms | 16,8 (1 quadro de 100 ms no primeiro hover) | 0 | 69 |
| Brilho verniz (transform), 4× | 16,7 ms | 16,8 | 0 | 220 |
| Variante ingênua (gradiente reposicionado por variável, repinta), 4× | 16,7 ms | 16,8 | 1 | 242 |

Leitura: **60 fps mantidos em todos**, com a CPU 4× mais lenta. A versão por `transform` gasta ~10% menos
tarefa que a que repinta, e sobretudo não repinta a face (importa com 12 livros na tela e um deles com 3
camadas de blend). O único tranco é o primeiro hover (100 ms: o navegador promove as camadas); mitigação:
`will-change: transform, opacity` só na `.spec` e só enquanto há hover (ou no `pointerenter` anterior). Os
números de uma `.brilho` de 6 camadas valem para um livro; em Categorias, ligar o brilho **só no livro em hover**.

### Limites e armadilhas encontradas

- Dentro de `transform-style: preserve-3d`, o `mix-blend-mode` da camada mistura com o conteúdo da própria
  face (que é achatada) — funciona. Mas se o ancestral `.livro-3d-vista` ganhasse `filter` ou `opacity < 1`,
  o 3D acharia (flatten). Não pôr `filter` nem `opacity` animada nesses ancestrais.
- A demo tem a lombada soltando (geometria simplificada); o efeito, não a geometria, é o que vale. No blog a
  lombada é a `.face-lombada` do `Livro3D.astro`, com `clip-path: inset(0 14.7%)`: a `.brilho` dela deve
  respeitar o recorte (ficar dentro da face).
- `soft-light` em fundo claro fica fraco (ver `livro-a-*.png`). Comparar sempre nos dois tipos de capa
  (papel claro em cima, cor embaixo, D39).
- Sem `prefers-reduced-motion: no-preference`, a mancha fica **parada** na posição padrão
  (canto superior esquerdo, 60% de opacidade) e sem varredura; é a luz do `.luz-capa` estática que já existe.

## 3. Sombra quente (T6, o amarelado do 02)

Sombra física: contato (justa, escura, 1–3 px) + projetada (larga, fraca, deslocada para longe da luz), as
duas **tingidas com o tom quente**, nunca preto puro:

```css
--sombra-q: 60 38 8;               /* marrom-âmbar, claro */
--sombra-q-escuro: 255 170 70;     /* no escuro, a "sombra" é a luz quente refletida em volta */
.livro-chao {
  background:
    radial-gradient(ellipse 50% 14% at 46% 8%, rgb(var(--sombra-q) / .55), transparent 70%),   /* contato */
    radial-gradient(ellipse 80% 38% at 54% 14%, rgb(var(--sombra-q) / .22), transparent 75%);  /* projetada */
}
```

- **Tema claro**: o chão do livro recebe o marrom-âmbar acima, `multiply` opcional. O "amarelado" vem de a
  sombra ser **marrom quente, não cinza**.
- **Tema escuro**: sombra preta não se vê. O que dá a sensação é um **brilho quente por baixo** (o halo sob o
  livro, `rgb(255 170 70 / .12)` com `mix-blend-mode: screen`, mais forte no hover) mais um núcleo preto
  justo de contato embaixo. Isso é "a sombra amarelada de baixo" do 02 no escuro.
- Animação: só `opacity` e `transform: scale` dessas camadas no hover (o halo cresce ~8% e sobe de .12 a .22).

## 4. O que evitar

- Animar `filter: brightness/drop-shadow/blur` e `box-shadow` no hover: repinta a cada quadro.
- Trocar `background-position` ou o ponto do gradiente por variável a cada `pointermove`: funciona, mas
  repinta a face (medido: +10% de tarefa e 1 layout); use a mancha grande movida por `transform`.
- Um halo de 760 px com `blur` (CSS `filter`): o gradiente com stops largos já faz o falloff.
- Tremor com `Math.random`: filme e testes não repetem. Use senos defasados.
- `mix-blend-mode` em ancestral do 3D (flatten) e brilho em todos os 12 livros ao mesmo tempo.
- Exagerar: lâmpada com explosão branca. O branco é só o último 15% do T.
- LED como padrão: sem inércia, parece interruptor de app; o pedido é "lâmpada mesmo".

## 5. Próximos passos sugeridos (para o construtor)

1. 02: trocar o `.abajur-luz` de 72 px por halo grande no `<body>`, 3 camadas, WAAPI amostrado (T7).
2. `.brilho` em `.face-capa` e `.face-lombada` com mancha (`transform`), fresnel e varredura; fosco ou verniz
   por livro (T4); ligar só no livro em hover.
3. Sombra quente de contato e projetada, com o par claro/escuro acima (T6).
4. Conferir com o `redesenho-conferente` (CPU 4×, movimento reduzido, dois temas).
