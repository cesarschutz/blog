# Revisão técnica e visual de frontend — 03/10/2026

Base: `9938819fa08eb18b1fa4f261cc52b4ee4108de1b` (`origin/main`, conferida novamente antes da revisão).
Branch local: `improve/frontend-performance-ux`. A main não recebeu alterações nem publicação.

## Escopo e método

Revisão do Astro 7/TypeScript, build, componentes, scripts de animação, CSS, fontes, imagens, SVGs,
acessibilidade e navegação. O Chrome instalado inicialmente não abria por uma restrição de socket do
ambiente. A solução foi o Chrome Headless Shell oficial, versão 154, controlado pelo Playwright e pelo
Chrome DevTools Protocol. O build completo, incluindo as imagens de compartilhamento e o Pagefind,
passou a funcionar. Não foi necessário modificar a política do ambiente.

A main foi construída em uma worktree separada. As versões original e corrigida foram abertas no mesmo
navegador, com o mesmo servidor estático local e compressão gzip. Os testes usam o HTML/JS de produção,
com exceção do teste isolado de FiguraPassos, que executa o motor real num fixture para reproduzir
precisamente a corrida entre etapas atrasadas.

A matriz final cobre 338 combinações: 39 rotas, temas claro/escuro, larguras 320, 375, 430, 699, 768,
1099, 1280, 1440 e 1920px. Inclui home, paginação, arquivo, livros, séries, tags, página 404 e todos
os 29 artigos canônicos em 375/1280px. Redirecionamentos antigos são verificados pelo teste de links.
Cada caso também mede a página depois de um resize de 17px. A matriz usa movimento reduzido para
estabilizar a inspeção de layout; os testes de interação, abertura e traces exercitam movimento normal.

Capturas em 375/1440px e inspeções de estados interativos cobrem cabeçalho, menu, estantes, cards,
artigos, imagens, figuras, tabelas, busca, livro ampliado e rodapé. A inspeção visual detalhada usa
páginas representativas dos diferentes componentes; a cobertura de todas as rotas/artigos é também
automatizada. Emulação de viewport em Chrome não equivale a executar num iPhone ou Safari físico.

## Bugs corrigidos e evidência

| Área | Problema confirmado | Correção e verificação |
|---|---|---|
| FiguraPassos | Ver tudo deixava uma animação atrasada com `fill: backwards`, mantendo texto invisível | Cancela somente os efeitos criados pela figura antes de mudar o estado. No fixture: 1 efeito pendente/opacity 0 → 0 efeitos/opacity 1 |
| FiguraPassos | Movimento reduzido ativado durante a etapa não interrompia efeitos e rolagens agendadas | Cancela efeitos, timers e indicação de término; transições CSS imediatas. Fixture: 2 efeitos → 0 |
| Teclado das figuras | Anterior desabilitado ou Ver tudo escondido podia perder o foco | Guarda o elemento focado antes de alterar os controles e transfere o foco para Próximo. Regressão por teclado passou |
| Layout do SVG | Confirmações de layout intercaladas com escritas por peça | Agrupa as peças imediatas antes de uma confirmação por lote. Fixture: 3 leituras → 2. Isto não é uma medida de Core Web Vitals |
| Tags | A → B → Todas em intervalos de 30ms deixava fichas transparentes por efeitos encerrados | Cancela saídas anteriores; limpa os efeitos mesmo em operações ultrapassadas; valida a versão também no frame de entrada. Antes havia quatro fichas com animação encerrada/opacity 0; depois nenhuma |
| Queda das fichas | Reentradas podiam sobrepor quedas e a preferência dinâmica não interrompia WAAPI | Registra efeitos por ficha, cancela ao reiniciar e ao reduzir movimento; remove referências concluídas. Testado em 375/768/1440px |
| ARIA das gavetas | `aria-current` sem valor não anunciava a seleção | Usa explicitamente `aria-current="true"` somente no controle atual |
| Desenhos GSAP | A preferência dinâmica não finalizava as timelines já iniciadas | Finaliza as timelines próprias, limpa seus efeitos e impede novas entradas pendentes. Amostra de 350ms após reduzir: 446 mutações de estilo/3 textos ocultos → 0/0 |
| Lista/Cards | A preferência dinâmica podia manter a troca WAAPI em andamento | Interrompe os efeitos, invalida a troca anterior e aplica diretamente o modo escolhido |
| Revelações | Redução de movimento/impressão liberava os elementos esperando, mas não os já animando | Cancela a fila, o frame e os efeitos ativos, mantendo os elementos legíveis |
| Capas no hover | O mesmo script aparecia 30 vezes no arquivo e o CDP confirmou 30 listeners pointerenter no mesmo card | Inicialização única no módulo global, WeakSet por alvo e montagem dos cards novos; comparação final nas evidências |
| Luz seguindo o mouse | Escritas nos discos precediam medidas dos papéis no mesmo frame | Lê todas as medidas antes das escritas; preserva o efeito e o lerp |
| Busca | Campo removia outline sem substituto | Adiciona anel no token de interação. Atalho, foco inicial, resultados e Escape testados |
| Citação animada | Palavras apagadas tinham contraste 2,97:1 no fundo claro, abaixo de 3:1 para texto grande | Usa `--ink-2`; com movimento reduzido, todas as palavras ficam acesas, sem transição |
| Tabelas | Matriz de criptografia tinha nomes de linha em `td`, sem cabeçalho associado | O plugin usa `scope="col"` nos cabeçalhos e `th scope="row"` na primeira coluna de matrizes com canto vazio. CSS preserva a aparência anterior |
| Livros da coleção | A arte decorativa repetida das capas estava exposta no conteúdo do link | Marca apenas a arte como decorativa. O link continua com título/volume e o nome visível adjacente; a lupa ampliável não é ocultada |
| Imagens SVG de artigos | 57 ocorrências em `img` não declaravam dimensões | Plugin lê o viewBox dos SVGs locais de public no build e adiciona width/height, lazy/async ao corpo do artigo. Nenhum path ou arquivo artístico foi alterado |

O teste de imagens atrasou respostas SVG em 1,5s e confirmou uma caixa com altura reservada antes do
carregamento em 375, 768 e 1440px. A reserva é evidência de estabilidade geométrica; não se atribui a
ela um ganho de CLS que não tenha aparecido nas medições.

## Performance de laboratório — evidências recuperadas

| Página / perfil | Performance | Acessibilidade | FCP (ms) | LCP (ms) | TBT (ms) | CLS |
|---|---:|---:|---:|---:|---:|---:|
| home / mobile | 73 → 73 | 96 → 96 | 3977 → 3976 | 4802 → 4801 | 40 → 27 | 0.0002 → 0.0002 |
| home / desktop | 97 → 97 | 96 → 96 | 781 → 782 | 921 → 922 | 0 → 0 | 0.0001 → 0.0001 |
| criptografia / mobile | 71 → 71 | 97 → 100 | 3601 → 3601 | 4801 → 4801 | 82 → 87 | 0.0038 → 0.0038 |
| criptografia / desktop | 97 → 97 | 100 → 100 | 741 → 741 | 941 → 941 | 0 → 0 | 0.0001 → 0.0001 |
| arquivo / mobile | 64 → 64 | 96 → 96 | 5403 → 5401 | 6153 → 6151 | 0 → 0 | 0.0001 → 0.0001 |
| arquivo / desktop | 96 → 96 | 100 → 96 | 1021 → 1001 | 1162 → 1122 | 0 → 0 | 0.0007 → 0.0007 |

Best Practices e SEO ficaram em 100 em todas as execuções. Performance ficou essencialmente
inalterada. A home mobile teve TBT mediano 40 → 27ms, enquanto o artigo teve 82 → 87ms; esses
resultados pequenos não sustentam um ganho geral de velocidade. No arquivo desktop, a mediana de
acessibilidade 100 → 96 vem do falso positivo intermitente de Lista/clip-path já existente, detalhado
abaixo. A melhoria confirmada de acessibilidade em criptografia mobile foi 97 → 100.

As 36 execuções desta seção foram recuperadas da conversa anterior, antes da última correção do hover.
Lighthouse 13.5.0, três navegações frias por combinação, nas rotas home, criptografia e arquivo,
com resultados mobile/desktop. A tabela usa medianas, e os JSON individuais guardam a variação.
Mobile usa o perfil padrão simulado do Lighthouse (CPU 4×/rede móvel); desktop usa 1440×900,
DPR 1, CPU 1×, RTT 40ms e throughput 10.240Kbps. O servidor local usa gzip e cache para assets
versionados. Os testes finais de cada versão são sequenciais.

LCP/FCP/TBT/CLS são métricas de laboratório. Não há telemetria de usuários, CrUX ou INP de campo nesta
entrega. TBT não substitui INP. Uma diferença pequena de nota ou tempo entre três execuções não prova
melhora perceptível; as correções de corrida, visibilidade e preferência dinâmica têm regressões
reproduzíveis independentemente da nota de carregamento.

Os traces CDP guardam carregamento/abertura, movimento do mouse, rolagem, navegação interna e volta
pelo histórico, além dos controles de uma figura, em 375 e 1440px. Incluem Layout, Paint,
UpdateLayoutTree, tarefas longas e amostras de requestAnimationFrame. São evidência diagnóstica de uma
máquina de laboratório, não certificação de FPS em dispositivos reais; somas de eventos aninhados
não representam tempo total de CPU.

## Recuperação e revalidação final nesta conversa

O link da conversa anterior abriu sem autenticação e não exibiu suas mensagens. As instruções completas
foram recuperadas de Texto colado.txt, e o contexto pessoal confirmou os relatos finais. O diretório
original ainda continha o trabalho real: seis commits, sete arquivos modificados não commitados, quatro
scripts novos, relatórios e capturas. Uma cópia independente preservou tudo antes de continuar.

O ZIP anterior tinha somente três arquivos (patch de dois commits e documentos), não o projeto completo.
Todas as correções concretas relatadas foram encontradas no código posterior; nenhuma precisou ser
reinventada. O possível hover 30 vezes já estava resolvido pelo commit e0a5a8c. A base da main foi
consultada novamente e permanece 9938819. O código de aplicação/configuração/assets/lockfiles da pasta
baseline foi comparado byte a byte com a main: nenhuma divergência. Somente o lançador do navegador
para gerar as imagens OG usa o mesmo adaptador de ambiente das duas versões.

Nesta retomada, foram consolidados os scripts de Chrome, servidor local, regressões, plugins,
interações e CI que estavam fora dos commits. A matriz agora falha em overflow ou perda do h1 antes ou
depois do resize. O novo teste frontend-tema comprova a troca de tema enquanto uma etapa real está
animando, e a redução dinâmica posterior. A workflow inclui as capturas dentro de .astro no upload.
A aplicação mantém as correções recuperadas; os acréscimos desta etapa são validação e documentação.

### Nova medição completa, após a correção de hover

Foram executadas mais 36 navegações frias, com Lighthouse 13.5.0 e Chrome for Testing Headless Shell
154.0.8036.0: três rotas, dois perfis, duas versões e três amostras. As configurações de rede/CPU são as
mesmas descritas acima. O navegador recuperado anteriormente era 154.0.8037.97; a comparação nova usa
154.0.8036.0 para ambas as versões, por isso os valores novos são apresentados separadamente.

| Página / perfil | Performance | Acessibilidade | FCP (ms) | LCP (ms) | TBT (ms) | CLS |
|---|---:|---:|---:|---:|---:|---:|
| home / mobile | 73 → 73 | 96 → 96 | 3977 → 3976 | 4802 → 4801 | 23 → 35 | 0.0002 → 0.0002 |
| home / desktop | 98 → 98 | 96 → 96 | 781 → 821 | 921 → 961 | 0 → 0 | 0.0001 → 0.0001 |
| criptografia / mobile | 70 → 69 | 97 → 100 | 3676 → 3677 | 4801 → 4876 | 92 → 148 | 0.0038 → 0.0038 |
| criptografia / desktop | 95 → 96 | 100 → 100 | 742 → 741 | 942 → 941 | 0 → 0 | 0.0001 → 0.0001 |
| arquivo / mobile | 64 → 63 | 96 → 96 | 5402 → 5478 | 6302 → 6303 | 0 → 5 | 0.0001 → 0.0001 |
| arquivo / desktop | 96 → 96 | 100 → 96 | 1021 → 1002 | 1161 → 1163 | 0 → 0 | 0.0007 → 0.0007 |

Best Practices e SEO ficaram em 100 nas 36 amostras novas. A acessibilidade de criptografia mobile foi
97 na base e 100 na versão final em todas as amostras. A mediana da performance mobile do artigo
variou 70 → 69 e do arquivo 64 → 63; isso não é uma melhoria geral de carregamento.

O TBT do artigo mobile subiu de 92,5 para 148ms na rodada completa. A investigação dos relatórios
mostrou também aumento de duração em scripts não alterados (Computador/artigo/GSAP) e em layout.
Para testar a estabilidade do achado, outras seis navegações frias foram alternadas no mesmo Chrome,
entre servidores baseline/final, invertendo a ordem por par. Nelas, TBT mediano foi 178 → 135,5ms e
performance 66 → 70. As duas rodadas completas foram preservadas, sem escolher somente o resultado
favorável. A diferença não se manteve no pareamento; estes dados não isolam um ganho ou regressão
causado pelo patch. O custo estrutural do DOM/arte e o carregamento mobile continuam oportunidades.
Não se mede INP de campo e não se promete aceleração nem FPS garantido a partir deste laboratório.

### Checks e inspeção final repetidos

- npm ci com o mesmo lockfile; nenhuma dependência de aplicação foi adicionada.
- npm run check: zero erros, zero warnings, cinco hints preexistentes.
- npm run contraste: zero falhas obrigatórias, cinco alertas decorativos preservados.
- node scripts/desenho/validar.mjs: 63 de 63 desenhos passaram; nenhuma arte foi alterada.
- Plugins, regressões das figuras, interações e tema durante uma etapa: passaram.
- Build completo: 102 páginas Astro, 30 imagens OG e Pagefind com 29 artigos.
- Links no build desta rodada: 116 HTML, 5.763 links e 22 redirecionamentos; nenhuma quebra. A
  contagem inclui HTMLs auxiliares OG, diferindo da saída anterior; as 39 rotas da matriz permanecem.
- Matriz repetida: 338 casos, 39 rotas, nove larguras, dois temas e resize; zero overflow, zero
  imagens sem alt, um h1 e zero erros JavaScript em todos os casos.
- Três artigos (criptografia, Claude Code e Java 17): 320/390/768/1280/1600px nos dois temas,
  incluindo movimento reduzido; zero cortes de caneta, sobreposições, erros de rede/console.
- 57 SVGs no corpo dos artigos com dimensões no HTML. Reserva antes da resposta atrasada foi
  confirmada em 375/768/1440px; nenhum ganho de CLS foi inventado.
- Em 375/1440px, o teste do tema registrou 11/10 efeitos em curso antes do clique; depois de Ver
  tudo e após reduzir movimento, zero efeitos presos e zero textos ocultos.
- Hover dos cards montados depois: um pointerenter por alvo, inclusive após repetir cartoes:prontos.
- Novos traces de abertura, mouse, scroll, navegação/histórico e figura em 375/1440px, sem exceções.
- Home e criptografia também abertas em development, com reload e sem exceções. O processo CLI
  anunciado não ficou acessível ao processo de teste neste ambiente; dev e Chrome no mesmo
  instrumento pela API de Astro resolveram. A primeira otimização Vite exigiu aquecimento/reload.
- Capturas de viewport e páginas inteiras revistas; o código Java 17 também foi conferido na
  viewport, pois content-visibility pode omitir a pintura fora dela em uma captura inteira.
- node --check nos scripts e git diff --check passaram. O diff completo foi revisado; src/content,
  public, package.json e package-lock.json não têm alterações em relação à base.

São 31 arquivos alterados e oito commits locais contra a main: os seis recuperados e dois de
consolidação/documentação. O inventário forense inicial, hashes, patches, histórico e evidências estão
no pacote. As limitações físicas de Safari/iOS, leitores de tela e INP real continuam as descritas.

## SVGs, imagens, fontes e bundles

- SVGs animados continuam inline porque dependem de tokens, recortes e endereçamento das peças por
  classes/atributos. viewBox e as regiões responsivas foram preservados. Ícones e arte decorativa
  usam alternativas ARIA; figuras informativas mantêm texto e legendas.
- Não se aplicou SVGO indiscriminadamente: remover `data-passo`, classes, ids, recortes, texto ou
  alterar paths quebraria o motor ou a fidelidade. A reserva dos SVGs externos foi feita no HTML.
- `Evidencia` já usa Image do Astro, WebP, srcset, sizes e dimensões. O build processa 27 variantes;
  prints largos mantêm a rolagem interna prevista para ler texto pequeno no mobile.
- Fontes são locais, variáveis, com unicode-range/font-display; os dois preloads correspondem à
  tipografia inicial. O navegador escolhe os subsets usados. Não se adicionou CDN ou preload especulativo.
- GSAP e plugins permanecem em imports dinâmicos. Não há hidratação React/Vue a reduzir. Pagefind é
  carregado pela busca. Nenhuma dependência de aplicação nem o lockfile foi alterado; Lighthouse e
  formatação foram ferramentas temporárias de auditoria.
- Home e arquivo têm DOM/HTML grandes por causa das capas, desenhos e cards: antes, aproximadamente
  1,07MB/1,75MB sem compressão, 259KB/385KB gzip, e 4.846/9.169 elementos no HTML estático
  (templates incluídos). Isto segue sendo uma oportunidade estrutural, sobretudo no arquivo mobile.
  Reescrever a coleção/capas ou remover arte mudaria contratos e interações; esta entrega não vende
  pequenas alterações como solução para esse custo.
- CSS inline e content-visibility dos blocos de código são decisões existentes, preservadas. Filtros
  de tremor, sombras e 3D foram inspecionados sem remover a identidade visual para buscar nota.
  Medidas necessárias ao desenho de traços continuam existindo; a revisão não promete zero reflow.

## Validação final

- `npm ci` com o lockfile existente.
- `npm run check`: zero erros, zero warnings, cinco hints preexistentes.
- `npm run contraste`: zero falhas obrigatórias; cinco alertas decorativos preexistentes.
- `npm run build`: Astro, 102 páginas, imagens OG e índice de 29 artigos passaram.
- `npm run links`: 119 HTML, 5.772 links internos e 22 redirecionamentos; nenhum link/âncora quebrado.
- `node scripts/frontend-plugins.mjs`: semântica de tabelas, idempotência e dimensões explícitas preservadas.
- `node scripts/frontend-regressao.mjs`: comparação main/branch, visibilidade, cancelamento,
  leitura de layout e foco por teclado passaram.
- `node scripts/frontend-interacoes.mjs`: Tags concorrentes, redução durante a queda, Lista/Cards,
  busca pelo teclado, foco, Escape, menu mobile, tema, livro ampliado/foco de retorno e imagens
  atrasadas passaram em 375/768/1440px, sem erros JavaScript.
- `node scripts/frontend-paginas.mjs`: 338 casos e resize, zero overflow horizontal da página,
  zero imagens sem alt, um h1 por página e zero erros JavaScript. Tabelas/figuras/prints podem rolar
  dentro de seus próprios contêineres, como previsto no design.
- `npm run conferir`: resultados adicionais nas evidências, em movimento normal e reduzido.
- `node --check` nos scripts novos e `git diff --check` passaram.
- Não há script de lint ou suíte unitária geral no package.json. Não foram afrouxadas regras para
  passar checks. A workflow adicionada é somente de revisão, sem publicação, e ainda não rodou no GitHub.

## Achados preservados e limites

O contraste de Lista no Lighthouse é um falso positivo confirmado por captura e clip-path computado:
a tinta azul cobre somente Cards, e Lista está sobre o papel. A decoração não foi redesenhada para
silenciar o auditor. Alguns contrastes podem ser capturados durante transições; os relatórios brutos
permitem conferir o elemento e o momento. O alerta experimental de label-content-name-mismatch das capas continua nos relatórios: o auditor considera o texto visual, mesmo com a arte fora da árvore ARIA e o link nomeado pelo título. Alertas experimentais não são omitidos dos relatórios.

A inspeção não equivale a uma certificação completa WCAG por leitor de tela, nem a uma medição de
memória/FPS em hardware mobile. Safari/iOS físicos e dados reais de INP continuam exigindo esse
ambiente. Não foram alterados textos dos artigos, arte dos SVGs, desenhos dos livros ou decisões de
produto pendentes.

## Entrega

Nesta recuperação, o GitHub voltou a aceitar a criação da branch improve/frontend-performance-ux e
os commits foram enviados com as mesmas árvores Git da cópia validada. Os metadados de publicação
mudam os SHAs remotos; a correspondência com os commits locais recuperados fica nas evidências.
O ZIP novo contém o projeto completo versionado, relatório consolidado, recuperação forense, diff,
histórico e evidências antigas/novas. node_modules, caches, credenciais e dist são reproduzíveis e não
entram no pacote. A main não foi alterada nem publicada. A execução da workflow no GitHub é informada
separadamente no PR; as aprovações descritas aqui são resultados locais.

## Fontes técnicas primárias

- https://developer.chrome.com/blog/chrome-headless-shell
- https://developer.chrome.com/docs/lighthouse/performance/
- https://web.dev/articles/animations-guide
- https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing
- https://web.dev/articles/optimize-cls
- https://developer.mozilla.org/en-US/docs/Web/API/Animation/cancel
- https://developer.mozilla.org/en-US/docs/Web/API/Element/getAnimations
- https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-current
- https://developer.mozilla.org/en-US/docs/Web/SVG/Guides/SVG_in_HTML
- https://docs.astro.build/en/reference/modules/astro-assets/
- https://gsap.com/docs/v3/GSAP/Timeline/progress()/
- https://gsap.com/docs/v3/GSAP/Timeline/kill()/
- https://www.w3.org/WAI/tutorials/tables/two-headers/
- https://www.w3.org/WAI/tutorials/images/functional/

- https://github.com/actions/upload-artifact#uploading-hidden-files
