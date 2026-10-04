# Manual de quem desenha um livro novo

Para os agentes que desenham os livros das sugestões de coleção. Leia inteiro antes de começar.

## O pedido

O Cesar vai escolher uma entre cinco coleções de livros para as categorias do blog. Cada livro novo
precisa de **um desenho que tenha relação com o assunto** (o instrumento de ofício da capa) e de **uma
cor com fundamento**. Os desenhos vão ser vistos lado a lado com os oito de hoje, que já foram
aprovados: o novo tem de parecer da mesma coleção, feito pela mesma mão, e tão bom quanto eles.

## Os desenhos de hoje (o alvo)

- `docs/capas/referencia/capas.png`: as oito capas (referência original; no site o papel fica em
  cima e a cor do livro embaixo, D39).
- No dev, `/amostra/colecoes/livro/<slug>/` mostra qualquer livro do `colecoes.json` em tamanho real
  (capa de 480 × 720 com a lombada), como no site. Os de hoje: `arquitetura-de-software` (arco e pedra
  angular), `desenvolvimento-de-software` (paquímetro medindo uma peça), `dados` (gaveta de fichas),
  `ia` (autômato escritor), `seguranca` (carta lacrada e sinete), `devops` (guindaste de porto), `sre`
  (farol), `carreira` (compasso). Olhe todos antes de desenhar.

O que eles têm em comum:

- **Um objeto físico de ofício**, de antes do computador (ou que não depende dele), que é a metáfora
  do livro inteiro. Nunca logotipo, nunca ícone de interface, nunca tela, nunca texto.
- **Desenho técnico à caneta**: contornos firmes (1,8), detalhes (1,2) e o bem fino (0,7); leve tremor
  de mão; perspectiva simples ou vista de frente, sem exagero.
- **Hachura nas sombras**: linhas paralelas finas (0,7) a ~55–65°, só no lado que fica na sombra (a
  luz vem do alto à esquerda: sombra à direita e embaixo) e numa faixa estreita de sombra no chão.
- **Um único elemento fantasma tracejado** que conta algo: o movimento (o raio do farol, o círculo do
  compasso), a medida (a seta do paquímetro), o que falta ou vai chegar (o contêiner que o guindaste
  ainda vai pôr, a ficha que volta para a gaveta), o caminho (a carta que o sinete vai lacrar).
- **Pontos cheios** (pino, eixo, furo) pequenos e poucos.
- O objeto ocupa bem a área (de x 36 a 444 e de y 384 a 678), centrado, apoiado na base. Nada fino
  demais: a capa aparece pequena (150 a 270px de largura) e o ícone, minúsculo, na lombada.

Objetos que já são ícones das tags (não repita como desenho de livro): broto com folhas (Spring),
moedor de café (JVM), âncora (LTS), semáforo de ferrovia (Concorrência), carretel com agulha (Virtual
Threads), balança de pratos (Trade-offs), pena no tinteiro (Linguagem), pilha de moedas (Pagamentos),
caixa de correio (Mensageria), rolo de papel (Logs), leme (Kubernetes), barril (Banco de Dados), mala
(Migração), cadeado (Criptografia), favos de mel (Microsserviços), chave antiga com etiqueta
(Idempotência), bigorna e martelo (Gradle), nuvem (AWS), espeto de notas (AOP), ingresso (JWT).

## A ferramenta

Cada livro é um módulo `scripts/desenho/livros/<slug>.mjs`, em geometria limpa; o
`scripts/desenho/livros.mjs` passa a caneta (tremor com semente do slug: sai igual toda vez), gera a
hachura e grava `src/livros/desenhos/<slug>.svg` (a capa, viewBox `0 300 480 420`) e
`src/livros/icones/<slug>.svg` (o ícone da lombada, 120 × 160, a mesma geometria reduzida, sem a
hachura e sem o fantasma). Leia o cabeçalho do `scripts/desenho/livros.mjs` e o exemplo
`scripts/desenho/livros/_rascunho.mjs`.

```js
export default {
  instrumento: "caixa registradora mecânica",
  desenho({ t, hachura, chao, ponto, cheio, linha, poli, curva, bezier, arco, elipse, circulo, retangulo, mover, juntar }) {
    t(retangulo(150, 470, 180, 200, 6), { papel: true });  // contorno (w1), tapa o que ficou atrás
    t(linha([170, 520], [310, 520]), { w: 2 });             // detalhe (w2)
    t(linha([175, 600], [300, 600]), { w: 3 });             // bem fino (w3)
    hachura(retangulo(300, 470, 30, 200), { angulo: 60, passo: 4.2 }); // sombra (w3, fica fora do ícone)
    t(arco([240, 430], 60, 20, 180, 360), { fantasma: true });         // o único fantasma (tracejado)
    ponto([240, 560], 2.2);                                 // ponto cheio
    chao(140, 350, 671);                                    // a sombra no chão, embaixo da base
  },
};
```

- **Coordenadas** da capa: x de 0 a 480, y de 300 a 720 (o desenho fica de y 384 a 678). Ângulos em
  graus, 0 para a direita e 90 para baixo, como no SVG.
- **Formas**: `linha(a, b)`, `poli(pontos, fechada)`, `curva(pontos, fechada)` (Catmull-Rom),
  `bezier(p0, p1, p2, p3)`, `arco(c, rx, ry, a0, a1, giro)`, `elipse(c, rx, ry, giro)`,
  `circulo(c, r)`, `retangulo(x, y, w, h, raio)`, `mover(forma, { giro, centro, dx, dy, escala })`,
  `juntar([formas], fechada)` (contorno feito de partes).
- **Caneta**: `t(forma, { w: 1 | 2 | 3, papel, fantasma, icone, soIcone })`. Ordem de pintura: o que
  vem depois fica por cima; `papel: true` (só forma fechada) preenche com a cor do fundo e tapa o que
  ficou atrás. `fantasma: true` = tracejado; `fantasma: "solido"` = contínuo e fraco. `icone: false`
  tira um traço do ícone; `icone: true` põe no ícone um traço fino que faz falta nele.
- **Hachura**: `hachura(formaFechadaOuPontos, { angulo: 55–65, passo: 3.6–5, margem })`.
  `chao(x0, x1, y, { altura, desvio, angulo, passo })`: a faixa de sombra no chão.
- **Pontos e manchas**: `ponto(c, r)`, `cheio(formaFechada)`.

## Conferir (obrigatório antes de entregar)

```bash
node scripts/desenho/livros.mjs <slug> --ver --cor '#hex'
```

Grava os dois SVGs e a foto `.render/livros/<slug>.png`: a parte de baixo da capa em 2× sobre a cor do
livro (como no site), a mesma sobre o papel e o ícone. Abra a foto e olhe de verdade: proporção,
perspectiva, se o objeto se reconhece, peso dos traços igual ao dos outros, hachura no lado certo,
nada cortado. Depois, a capa inteira com a lombada, como no site (o dev já está no ar na porta 4322):

```bash
CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome node scripts/foto.mjs \
  "http://127.0.0.1:4322/amostra/colecoes/livro/<slug>/" .render/livros/<slug>-capa.png --seletor ".um-livro" --largura 1100
```

(o livro precisa estar no `docs/prototipos/colecoes/colecoes.json`; se não estiver, use só a foto do
`--ver`). Compare com um desenho de hoje na mesma página (`/amostra/colecoes/livro/sre/`, por exemplo):
se o seu parece mais pobre, mais grosso, mais "clip-art" ou mais genérico, refaça.

## Limites

- Mexa só nos arquivos dos seus livros: `scripts/desenho/livros/<slug>.mjs`,
  `src/livros/desenhos/<slug>.svg`, `src/livros/icones/<slug>.svg` e `.render/livros/<slug>*.png`.
  Não edite a ferramenta, a página, o `colecoes.json` nem os desenhos dos outros (há outros agentes
  desenhando ao mesmo tempo). Precisa de uma função a mais? Escreva no seu módulo.
- Nada de git que escreva (commit, add, checkout, stash). Não pare nem reinicie o servidor do dev, e
  não mexa em processos que você não criou.
- Rode com o `node` do sistema (o Node 22 desta máquina serve).
