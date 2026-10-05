# Figura em passos (D67, em prova)

O pedido do Cesar, em 02/10/2026: as animações do blog estavam ruins de entender ("muita coisa, ou
animação com coisa sumindo"). Era para pesquisar técnicas de bons infográficos e apresentações, ver
quais peças estavam ruins e talvez trocar os três tipos (lousa de passos, lousa de comparação e animação
com play) por um só, bem feito, com regras bem definidas, tão claro quanto as figuras paradas.

- **O formato e as regras:** skill `figura`, seção "Figura em passos". O componente é
  `src/components/FiguraPassos.astro`, o motor `src/scripts/figura-passos.ts` e o estilo
  `src/styles/figura-passos.css`.
- **A prova:** `/animacoes-test-2/` (noindex), com as 9 peças da `/animacoes-test/` refeitas no formato
  novo.
- **O estilo dos controles:** em 04/10/2026, o Cesar escolheu o **marca-texto** entre três estilos
  (`/animacoes-test-3/`, noindex; os estilos em `src/styles/passos-estilo/`: `marca-texto.css`, o
  escolhido, e `lapis.css` e `fita.css`, que só aparecem na página de prova).
- **Nos posts:** desde 04/10/2026, todos os posts com uma peça que acontece em ordem usam a
  `FiguraPassos`, no estilo marca-texto (os sete `.mdx` com figura em passos), e nenhum usa mais a
  `Lousa` nem a `Animacao`. A D67 continua em prova: falta o Cesar aprovar o formato e escolher o aviso de
  fim de passo (as ideias estão no fim da `/animacoes-test-2/`; está no ar a dos traços embaixo da
  figura, `fim="segmentos"`).
- **`pesquisa.md`:** o que a pesquisa diz, com as fontes: Mayer, a informação que some (transient
  information), Tversky, small multiples, os builds das apresentações e os exemplos (Raft, ByteByteGo,
  Ciechanowski).
- **`auditoria.md`:** a revisão às cegas das 10 peças animadas que estavam no ar, com o veredito, o que
  atrapalhava em cada uma e os padrões que se repetiam.

Em resumo, as duas chegam ao mesmo lugar:
- **o leitor manda no ritmo**;
- **cada passo soma e nada some**;
- **uma coisa muda por vez**;
- **a comparação fica lado a lado**;
- **a figura inteira se explica sozinha.**

A animação de verdade fica só para quando o movimento é o próprio assunto. Quando a D67 fechar, esta
pasta vai para `docs/historico/`.
