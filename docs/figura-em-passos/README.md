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

A animação de verdade fica só para quando o movimento é o próprio assunto.
