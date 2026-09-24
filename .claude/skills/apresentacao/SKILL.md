---
name: apresentacao
description: Transforma o PowerPoint da apresentação que o Cesar gera no NotebookLM em slides WebP do post e no PDF do botão Baixar PDF, conferindo antes os erros de texto e código nas imagens. Use quando o Cesar trouxer um .pptx de apresentação.
---

# Apresentação do NotebookLM

Pronta na Fase 4: `npm run apresentacao`, o manifesto `src/data/decks.json`, a seção no post e o PDF
gerado no build (D9, sem biblioteca de PDF).

## De onde vem

Depois que o post está pronto, o Cesar gera a apresentação no NotebookLM e traz o **PowerPoint**
(`.pptx`). Os slides vêm como imagens inteiras dentro do arquivo, sem texto.

## Antes de aceitar o material

- **Confira texto e código em cada slide.** O NotebookLM já errou antes: `SIT` no lugar de `SET`,
  `stareId` no lugar de `storeId`, "reteamento", "malúsculas". Se houver erro, peça ao Cesar para
  gerar de novo. Não publique com erro, porque isso desmente a promessa de revisão da página Sobre.
- **Um deck por artigo.** Se vierem dois, escolha o de linguagem visual mais próxima do blog. Não
  misture slides de decks diferentes.
- **Os slides não substituem o texto.** Imagem não tem SEO nem leitor de tela, então o artigo
  precisa se sustentar sozinho.

## Conversão

```sh
fnm exec --using=24 npm run apresentacao -- <slug> --pptx "<arquivo.pptx>" --titulo "<título do deck>"
```

O script (`scripts/apresentacao.mjs`, porte do `deck-to-web.mjs` do blog atual):
1. extrai as imagens na ordem dos slides (`ppt/presentation.xml`, cruzado com as relações);
2. converte para WebP com 1376px de largura (sem ampliar) e qualidade 82, em
   `public/posts/<slug>/deck/NN.webp`;
3. registra `{ titulo, slides, largura, altura }` em `src/data/decks.json`.

O PDF sai no build, das mesmas imagens: `/posts/<slug>/apresentacao.pdf`, uma página por slide.

## No post

- A seção "Apresentação" entra logo antes de `## Fontes`, sem frase de apoio.
- O título é sempre "Apresentação", sem número, mesmo em post com h2 numerados (D14).
- Tem carrossel com setas e contador, tela cheia (galeria com ←/→) e o botão "Baixar PDF".
- Aparece sozinha para quem está no manifesto: nada a escrever no Markdown. Quem insere é
  `src/plugins/rehype-apresentacao.mjs`, que vale para `.md` e `.mdx` (D21). No RSS, a seção vira um link.
- Se o post não tiver `## Fontes`, o build falha, em vez de sumir com a seção em silêncio.
