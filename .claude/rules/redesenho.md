---
paths:
  - "redesenho/**"
  - "docs/redesenho/**"
---

# Arquivos do redesenho (D55)

Protótipos de visual novo, feitos para o Cesar escolher. Leia `docs/redesenho/README.md` (o pedido, o
que fica em todo modelo e as regras) e siga a skill `redesenho`. Desde a D61 (02/10/2026), a versão
final é o site; a pasta `redesenho/` fica fora do git, só nesta máquina, e ajuste no visual publicado
é feito no blog.

- Os protótipos **não mudam o blog**: nada em `src/`, `public/`, `scripts/` nem na configuração da raiz.
  Eles só leem essas pastas.
- O `DESIGN.md` e o `docs/briefing.md` valem para o site no ar, não para os modelos. Cada modelo segue
  a própria direção (`docs/redesenho/modelos/NN-nome.md`).
- Os desenhos dos livros e as ilustrações dos posts entram pelos componentes da base
  (`redesenho/src/comum`), idênticos aos do blog.
- Continuam valendo:
  - os dois temas;
  - cores por token;
  - fontes servidas pelo projeto;
  - `prefers-reduced-motion`;
  - o conteúdo aparece sem JS;
  - animar só `transform`, `opacity` e `clip-path`;
  - GSAP e anime.js sob demanda;
  - nada de cara de IA.
- Bibliotecas aprovadas: GSAP, Fontsource, Fontshare e anime.js v4 (só no Cinético). Outra biblioteca
  só com o OK do Cesar.
- Cada modelo fica na própria pasta (`src/modelos/NN-nome/`, `src/pages/NN-nome/`). Um modelo não
  mexe no outro.
