---
paths:
  - "redesenho/**"
  - "docs/redesenho/**"
---

# Arquivos do redesenho (D55)

Rodada encerrada na D61 (02/10/2026): a versão final é o site, e ajuste no visual publicado é feito no
blog. Para uma rodada nova de protótipos, leia `docs/redesenho/README.md` (o pedido, o que vale em todo
modelo e as bibliotecas aprovadas) e siga a skill `redesenho`. A pasta `redesenho/` fica fora do git, só
nesta máquina.

- Os protótipos **não mudam o blog**: nada em `src/`, `public/`, `scripts/` nem na configuração da raiz
  (eles só leem essas pastas). Cada modelo fica na própria pasta (`src/modelos/NN-nome/`,
  `src/pages/NN-nome/`), e um modelo não mexe no outro.
- O `DESIGN.md` e o `docs/briefing.md` valem para o site no ar, não para os modelos: cada modelo segue a
  própria direção (`docs/redesenho/modelos/NN-nome.md`). Os desenhos dos livros e as ilustrações dos
  posts entram pelos componentes da base (`redesenho/src/comum`), idênticos aos do blog.
