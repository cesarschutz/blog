# Manual das pranchas (livros realistas)

Para quem desenha uma prancha. Leia inteiro antes de começar.

## O pedido

O Cesar quer os livros do blog **o mais realistas e elegantes possível**, com **as mesmas cores, os
mesmos desenhos e os mesmos textos** de hoje. A única coisa que muda é o realismo: forma, material,
luz, sombra e pequenas imperfeições. O design impresso da capa e da lombada não muda em nada.

São 10 pranchas, uma diferente da outra. Cada uma é um SVG (uma "fotografia" de livro) que ele vai
ver numa galeria e decidir se usa. Cada prancha tem uma direção própria (o seu pedido); este manual é
o comum a todas.

## Como os livros são hoje (não mude nada disto)

- Referências: `base/folha.svg` (todas as peças planas), `hoje/*.png` (o site hoje) e as imagens em
  `/Users/cesar.schutz/Downloads/blog/docs/capas/referencia/` (alvo original; atenção: as referências
  têm a cor em cima, o site hoje tem o **papel em cima**, D39).
- **Capa de categoria** (480 × 720): papel `#f2ede2` de 0 a 300, com "VOLUME 0N" e "CESAR SCHUTZ"
  e o título grande (Bitter 800) na cor de destaque do livro; a cor do livro de 300 a 720, com a
  frase (Newsreader itálico), o desenho do instrumento e "BLOG.CESARSCHUTZ.COM.BR", na tinta.
- **Lombada**: papel em cima com o ícone girado; a cor do livro embaixo com o título na vertical e o
  número de artigos no pé. No livro 3D, a divisão fica em 300 de 720 (alinhada com a capa); na
  estante, a cor ocupa os 400 de baixo (a divisão forma uma linha contínua na estante).
- **Revista** (série "Atualizações do Java"): sempre papel claro, faixa laranja `#c24d1c` no topo,
  número "25" grande, lista de edições, tarja escura, xícara no rodapé. Lombada fina (80) em papel.
- Os livros não mudam com o tema do site. O fundo da página muda: claro `#F1F0EB` (e a folha branca
  `#FFFFFE`, onde fica a estante da home) ou escuro `#111618`.

## Arquivos

```
fontes/          Bitter e Newsreader (as dos livros); a prancha já as carrega (base.documento)
base/base.mjs    as peças planas, iguais ao site, como fragmentos SVG (use sempre elas)
base/*.svg       as mesmas peças soltas, para olhar
ferramentas/cena.mjs    câmera, perspectiva, mapeamento em superfícies, luz, sombra, texturas
ferramentas/ver.mjs     renderiza um SVG em PNG (claro e escuro), com zoom e recorte
pranchas/_exemplo.mjs   exemplo mínimo e técnico da API (não é estilo a seguir)
pranchas/pNN-<nome>.mjs / .svg / .json   a sua prancha (só estes três arquivos são seus)
```

Rode sempre com o Node 24: `fnm exec --using=24 node <script>` (o `node` do shell é outro).

**Mexa só nos seus três arquivos** (`pranchas/pNN-*`). Não edite `base/`, `ferramentas/`, a galeria
nem as pranchas dos outros (há outros desenhistas trabalhando em paralelo). Precisa mudar uma função
comum? Copie para o seu script e mude lá; conte no relatório final. Nada de git que escreva (commit,
add, stash, checkout). Não toque em processos que você não criou (há servidores de outras sessões nas
portas 4321 a 4341).

## A base (`base/base.mjs`)

```js
import { LIVROS, livro, REVISTA, capa, partesDaCapa, lombada, lombadaDaEstante, contracapa,
         versoDaCapa, capaDaRevista, lombadaDaRevista, lombadaDaRevistaNaEstante,
         PAPEL, TINTA_PAPEL, BITTER, NEWSREADER, documento } from "../base/base.mjs";
```

- `livro(slug)`: `{ slug, volume, titulo, linhas, frase, cor, tinta, destaque, corDaLombada, papel,
  tintaPapel, largura (espessura/lombada), altura (na estante), deslocamento (na pilha), artigos,
  posts: [{ titulo, subtitulo, dia, data }] }`. Slugs: `arquitetura-de-software`,
  `desenvolvimento-de-software`, `dados`, `ia`, `seguranca`, `devops`, `sre`, `carreira`.
- `capa(slug, { fundo })`: a capa plana 480 × 720 (fragmento). `fundo: false` tira os retângulos de
  fundo, para você pintar o material por baixo.
- `partesDaCapa(slug)`: as camadas separadas (`papel`, `cor`, `desenho`, `desenhoSoTraco`, `topo`,
  `titulo`, `frase`, `assinatura`), para tratar cada material e cada impressão à parte.
- `lombada(slug, { altura = 720, divisao = 300 })`: a lombada do livro 3D (largura × 720).
  `lombadaDaEstante(slug)`: a da estante (largura × altura de livros.json, cor nos 400 de baixo).
- `contracapa(slug)`: lisa, na cor do livro. `versoDaCapa(slug)`: o verso da capa como no site.
- `capaDaRevista()`, `lombadaDaRevista({ altura })`, `lombadaDaRevistaNaEstante()`, `REVISTA`.
- Os fragmentos não têm `id`, classe nem `<style>`: podem entrar quantas vezes quiser.

Na lombada, a arte vai de u = 0 (lado da contracapa) a u = largura (lado da capa); o texto corre de
cima para baixo, com o alto das letras virado para a capa (como num livro de verdade).

## A cena (`ferramentas/cena.mjs`)

Mundo em unidades da referência (capa 480 × 720; a espessura do livro é `livro(slug).largura`;
1 unidade ≈ 0,32 mm). X para a direita, Y para cima, Z para o observador. A tela do SVG tem y para
baixo.

- `new Prancha({ prefixo: "p01", largura, altura, titulo, descricao })`: o montador. `pr.simbolo(fragmento,
  { largura, altura, nome })` guarda uma arte plana e devolve o id; `pr.def(s)`, `pr.add(s)`,
  `pr.id(nome)`, `pr.salvar(caminho)` (grava com as fontes). Os ids saem com o prefixo.
- `camera({ olho, alvo, focal, centro, orto, escala })` e `enquadrar(cam, pontos3D, [x, y, w, h])`:
  perspectiva (ou ortográfica). `cam.p(ponto)` → `[x, y]` na tela; `cam.projetar(ponto)` → com a
  profundidade. Para cara de fotografia com teleobjetiva, ponha o olho longe (2500 a 6000 unidades)
  e deixe o `enquadrar` acertar o tamanho: perspectiva fraca, nada de grande-angular.
- `girar`, `girarX/Y/Z(p, graus, centro)`, `soma`, `sub`, `mul`, `dot`, `cross`, `normal`, `lerp`,
  `aleatorio(semente)` (sempre com semente: a prancha sai igual a cada vez).
- `superficie(pr, { ref, w, h, P, cam, nu, nv, costas, refCostas, ordenar, recorte })`: mapeia a arte
  plana `ref` (w × h) na superfície 3D `P(u, v) → [x, y, z]` (u para a direita e v para baixo na
  arte). Faz triângulos com afim exata nos cantos: sem costura e sem degrau. Fatie onde curva ou
  encurta (a capa em perspectiva: nu ≈ 8–12 e nv ≈ 8–12; a lombada arredondada: nu ≈ 24–32, nv = 1
  se a câmera não inclina muito). A face vista por trás some (`costas: "esconder"`) ou recebe
  `refCostas`. `ordenar: true` pinta do fundo para a frente (folha que se cobre). Devolve
  `{ svg, celulas }`.
- `plano(origem, eixoU, eixoV)`: o P(u, v) de uma face plana.
- `sombrearFace(pr, { P, w, h, cam, luz, ambiente, forca, brilho, especular: { forca, expoente } })`:
  a luz de uma superfície cuja normal só muda com u (face plana, lombada arredondada): um polígono só
  com gradiente pelo Lambert, sem costura. `luz` é a direção PARA a luz.
- `sombrear(celulas, …)`: luz por célula (para superfícies que curvam nas duas direções). Cuidado:
  as células se sobrepõem um pouco e a sobreposição escurece em linhas; use células pequenas, `folga`
  0 e confira no zoom, ou faça o seu gradiente.
- `contorno(cam, P, w, h)`: o polígono do contorno de uma superfície (para recortes e sombras).
- `sombra(pr, poligono, [{ desvio, opacidade, dx, dy }])`: sombra suave em camadas (contato,
  meia-sombra, ambiente). `filtroDesfoque(pr, desvio)`.
- `filtroGrao(pr, { base, oitavas, alfa, semente })`: ruído só com alfa (o grão do site é
  `base 0.85, oitavas 2, alfa 0.11`). Ponha num `<rect>` recortado pelo contorno da face.
- `gradiente(pr, p1, p2, paradas)`, `gradienteRadial(pr, c, r, paradas)`, `recortePoligono(pr, ps)`.
- `linhasDasFolhas(cam, [a, b, c, d], { quantas, opacidade, largura, semente })`: as linhas finas do
  corte das folhas num quadrilátero 3D (a→b ao longo da folha, a→d atravessando as folhas).
- `face(cam, pontos3D)`, `pontos(ps)`, `caminho(ps)`, `area(ps)`, `alargar(ps, d)`, `n(v)`.

Veja `pranchas/_exemplo.mjs`: livro em pé, capa plana e lombada arredondada mapeadas, luz por
gradiente, topo do miolo e sombra. É só o esqueleto técnico: o seu trabalho começa onde ele para.

## Conferir (sempre)

```bash
fnm exec --using=24 node pranchas/pNN-nome.mjs
fnm exec --using=24 node ferramentas/ver.mjs pranchas/pNN-nome.svg --largura 1100
fnm exec --using=24 node ferramentas/ver.mjs pranchas/pNN-nome.svg --largura 1100 --escala 2 --recorte x,y,w,h
```

O PNG sai em `.render/` (claro e escuro lado a lado); olhe com a ferramenta Read. Olhe de longe (a
prancha inteira) e de perto (recortes em escala 2: emendas, texto, bordas, sombras). O `ver.mjs`
avisa erro de XML e recurso que não carregou. Itere até ficar convincente: compare mentalmente com
uma fotografia de livro de verdade, e desconfie do que parece "mockup 3D".

## O padrão de qualidade

**Realismo vem de:**

- **Construção física certa.** Capa dura: papelão de ~8 unidades de espessura, forrado pelo papel
  impresso que dobra nas bordas; seixa (a capa passa ~9 unidades do miolo no alto, no pé e na
  frente); lombada arredondada (saliência de 12 a 18% da espessura); vinco da dobradiça na capa, a
  ~20–26 unidades da lombada, de alto a baixo; cabeceado (~6 unidades) no alto e no pé da lombada;
  miolo em papel creme com as folhas à vista no corte.
- **Luz de estúdio suave e coerente**: uma luz principal grande (janela ou softbox) do alto à
  esquerda, preenchimento fraco, e a mesma direção de luz em todas as faces e sombras. A face que
  encara a luz clareia, a que foge escurece; a curva da lombada leva um brilho largo e suave.
- **Sombras em camadas**: contato (justa e mais escura, onde o livro toca o chão), meia-sombra e
  oclusão ambiente larga e fraca. Preto translúcido, nunca preto chapado nem colorido. Elas têm de
  funcionar no claro (`#F1F0EB`), na folha (`#FFFFFE`) e no escuro (`#111618`).
- **Material**: grão de papel, trama de tecido, brilho de couché, conforme o pedido. Tudo sutil.
- **Imperfeição mínima**: cantos um pouco arredondados, folhas não perfeitamente alinhadas, uma leve
  ondulação. Livro bem cuidado, não estragado (a não ser que o pedido diga outra coisa).

**Evite (é o que denuncia o "3D falso"):** perspectiva de grande-angular; brilho plástico; bisel;
gradiente que não corresponde a nenhuma luz; sombra dura, preta ou grande demais; textura grossa
demais; costura ou degrau entre células; texto deformado ou borrado; bordas serrilhadas; excesso de
detalhe competindo com a capa. Elegância é contenção: a capa continua sendo a estrela.

**Regras fixas:**

- As cores do livro não mudam. Luz e sombra são camadas translúcidas por cima (preto e branco; um
  toque quente ou frio só se o seu pedido pedir, e fraco).
- Os textos são os da base, com as fontes da base (Bitter e Newsreader). Texto novo que o pedido
  peça (folha de rosto, sumário) usa as mesmas fontes, em pt-BR com acentos, e dados reais
  (`livro(slug).posts`).
- **Fundo transparente**: sem retângulo de fundo. Só o livro, o que ele toca (mesa só se o pedido
  pedir, e mesmo assim sem pintar um fundo chapado) e as sombras.
- SVG puro que o Chrome, o Safari e o Firefox renderizam: sem `<foreignObject>`, sem imagem raster,
  sem script, sem recurso externo (as fontes já vêm pelo `documento`). Filtros SVG podem.
- Tamanho: largura do viewBox em torno de 1200 (a estante pode ter 1600), altura de 800 a 1100,
  com respiro nas bordas para a sombra. Arquivo até ~1,5 MB; o `ver.mjs` deve levar poucos segundos.
- Ids todos com o prefixo da prancha (o `Prancha` já faz).

## O que entregar

1. `pranchas/pNN-<nome>.mjs` (o gerador, legível e comentado em pt-BR),
2. `pranchas/pNN-<nome>.svg` (a prancha),
3. `pranchas/pNN-<nome>.json` para a galeria:
   `{ "nome": "…", "ideia": "uma frase", "realismo": ["…", "…"], "ondeEntra": "uma frase", "notas": "opcional, curto" }`,
4. no relatório final: o que fez para o realismo, as limitações que ficaram, e os caminhos dos PNGs
   finais em `.render/` (a prancha inteira nos dois temas e pelo menos um recorte em escala 2).
