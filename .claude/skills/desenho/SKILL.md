---
name: desenho
description: Cria ou altera a ilustração SVG de um post no estilo de docs/estilo-desenho.md, seguindo as regras técnicas (classes e variáveis CSS, sem id nem defs, recortes com área segura, alt) e validando antes de aceitar. Use ao desenhar ou corrigir a ilustração de um post.
---

# Desenho (ilustração do post)

Formato, definições globais e scripts prontos na Fase 5 (D11). Os lotes dos posts existentes
ficam para a Fase 6. Referência pronta: `src/ilustracoes/cobranca-duplicada-no-retry.svg`.

**Antes de desenhar, leia `docs/estilo-desenho.md`**, porque o estilo pode ter mudado.

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
| `papel` | preenchido com a superfície (tapa o que está atrás) |
| `cor` | a cor da categoria: cópia da forma com `transform="translate(7 6)"`, antes do contorno |
| `hachura` | sombra: cópia da forma deslocada (+14 objetos grandes, +7 caixas), antes do papel |
| `fantasma` | o que não acontece, alternativas e estados anteriores |
| `carimbo` | contorno na cor da categoria |
| `rotulo`, `valor`, `numero`, `codigo`, `carimbo-texto` | textos do desenho (poucos: até 60 caracteres) |
| `anotacao` | grupo das anotações, que só aparece no recorte largo |
| `nota`, `nota-pequena`, `chamada` | texto e linha de chamada das anotações |

Transformações (`translate`, `rotate`) e `fill-rule` são geometria e podem ficar no arquivo.

## Validar e conferir

```sh
fnm exec --using=24 node scripts/desenho/validar.mjs <slug>   # regras técnicas
fnm exec --using=24 node scripts/desenho/centrar.mjs <slug>   # recortes centrados no desenho (dev no ar)
fnm exec --using=24 node scripts/desenho/render.mjs <slug>    # folha num PNG (precisa do dev no ar)
```

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
