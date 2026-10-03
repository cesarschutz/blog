# Revisão de frontend — 03/10/2026

Base: `9938819` da main. Branch: `improve/frontend-performance-ux`.

## Problemas corrigidos

- `FiguraPassos`: as animações WAAPI de etapas atrasadas continuavam vivas depois de mudar de passo ou
  escolher Ver tudo. Com `fill: backwards`, mantinham textos em opacidade zero até acabar o atraso.
  Agora cada figura guarda somente as animações que criou e cancela as anteriores antes de mudar o
  estado. Animações concluídas saem do conjunto, sem acumular referências.
- A preferência por movimento reduzido era consultada somente ao clicar. Ligá-la durante um passo
  não cancelava os efeitos em andamento nem as rolagens agendadas. Agora cancela ambos e o aviso de
  término; o passo selecionado permanece legível e as transições CSS são imediatas.
- O motor alternava escrita de estilo e leitura de geometria em cada peça do SVG para confirmar as
  trocas sem transição. Agora confirma todas as peças imediatas juntas. Há uma confirmação adicional
  ao iniciar o modo passo a passo, necessária para preservar a entrada animada do primeiro passo.
- Uma tecla no botão Anterior podia desabilitar o próprio botão, e uma tecla em Ver tudo podia
  escondê-lo ao chegar ao último passo. O foco vai para Próximo nesses dois casos.
- `revelar.ts`: movimento reduzido ou impressão liberavam os elementos esperando, mas não cancelavam
  as revelações WAAPI já em andamento. Agora cancelam também a fila, o frame e os efeitos ativos.
- `luz.ts`: os discos eram escritos antes de medir os papéis locais a cada frame. As medidas passam
  a preceder as escritas. O efeito visual e o lerp permanecem iguais.
- Busca: o campo removia o outline sem substituí-lo. Recebe um anel no token de interação para
  navegação por teclado.

## Pesquisa e escolhas preservadas

Fontes primárias consultadas:

- https://web.dev/articles/animations-guide
- https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing
- https://developer.mozilla.org/en-US/docs/Web/API/Animation/cancel
- https://developer.mozilla.org/en-US/docs/Web/API/Element/getAnimations
- https://developer.mozilla.org/en-US/docs/Web/SVG/Guides/SVG_in_HTML
- https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries/Using_for_accessibility
- https://docs.astro.build/en/reference/modules/astro-assets/

SVGs continuam inline quando dependem dos tokens, recortes ou animação por peça. Os atributos
`data-passo`, classes de etapa, texto e geometria são parte do contrato do motor. Não se aplicou
SVGO em massa: remover esses dados ou mexer nos paths sem comparação visual arriscaria quebrar o
comportamento. Os filtros de traço e a arte das capas também ficaram intactos.

`Evidencia` já usa Image do Astro, dimensões intrínsecas, WebP, srcset e sizes; os prints largos
mantêm a rolagem prevista no mobile. O build processou 27 variantes. As fontes são locais e os dois
preloads correspondem às fontes do primeiro quadro. Não foram adicionadas bibliotecas, CDN, mudanças
editoriais nem um novo desenho.

## Validação e limites

Localmente:

- npm ci: passou, usando o lockfile existente.
- npm run check: zero erros e warnings; cinco hints preexistentes.
- npm run contraste: zero falhas obrigatórias; cinco alertas decorativos preexistentes.
- npm run links: nenhum link ou âncora quebrada.
- npx astro build: gera as 102 páginas e variantes de imagem.
- node --check nos dois scripts de auditoria e git diff --check: passaram.
- npm run build: a parte Astro termina; o postbuild falha ao abrir o Chrome, pois este ambiente
  impede o socket do navegador (`process_singleton_posix.cc`, Operation not permitted).
- npm run conferir e os testes novos precisam desse mesmo Chrome e não podem ser certificados
  localmente. Não existe script de lint ou suíte de testes unitários no package.json.

O navegador remoto permitiu observar a abertura da home e interagir com os controles de uma figura
no artigo de criptografia, em desktop. Isso é inspeção da versão publicada, não das alterações.
Não certifica fluidez, mobile ou a ausência de regressões na branch.

A workflow `Revisão do frontend` valida PRs sem publicar o site. Executa os checks existentes, o build
completo, as regressões do motor real em Chrome e uma matriz de produção em 320, 375, 430, 699, 768,
1099, 1280, 1440 e 1920px nos dois temas. Todos os artigos gerados entram em 375 e 1280px. Guarda
JSON e capturas em `frontend-audit`. A matriz registra overflow para inspeção, sem tratá-lo como
inexistente quando os outros asserts passam. Capturas precisam ser examinadas antes de considerar
concluída a revisão visual. A regressão compara a main e a branch no mesmo fixture, incluindo a
quantidade de leituras SVG e os efeitos pendentes após Ver tudo e movimento reduzido.

Não há números de Lighthouse, LCP, CLS, INP, TBT ou FPS medidos nesta execução. Contar leituras em
um fixture não mede Core Web Vitals nem prova ganho perceptível. O navegador local bloqueado também
impediu traces antes/depois, comparação visual das mudanças, testes de resize ao vivo e validação do
Safari. O teste de matriz faz resize, mas não certifica o layout após resize: esse caso segue manual.
A revisão integral de animações, de todos os estados interativos e dos layouts ainda precisa dessas
etapas; as correções acima são entregues para revisão com esse limite explícito.

## Entrega bloqueada no GitHub

O push HTTPS falhou porque o terminal não tem credencial. A criação da branch pelo conector
retornou 403, `Resource not accessible by integration`. Nenhuma branch remota ou PR foi criado,
e a workflow nova não executou. Os scripts de regressão e matriz continuam sem execução.
Os commits e o patch são locais, para aplicar e revisar num ambiente com Chrome e escrita no GitHub.
