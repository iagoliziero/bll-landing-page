# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Definido em `referencia/prompt.md`: Next.js (App Router) + TypeScript com `output: 'export'` (site 100% estático, Vercel ou Netlify), Tailwind CSS v4, GSAP + ScrollTrigger, Lenis e WebGL puro na foto do hero.

## Users

Pessoas de [cidade e região] com dor de cabeça tensional, DTM, dores no pescoço ou nas costas, e pessoas que treinam e precisam de recuperação muscular ou de mobilidade. Querem fisioterapia sem precisar se deslocar até uma clínica.

*Inferido do briefing: faixa etária, origem do tráfego e proporção de acesso pelo celular não foram informadas.*

## Product Purpose

A BLL Fisioterapia faz fisioterapia em domicílio. O site existe para a pessoa agendar uma avaliação pelo WhatsApp. Funciona quando, na primeira tela e sem rolar, dá para entender que é fisioterapia em casa, o que é tratado e como agendar, e quando a pessoa abre a conversa com a mensagem já pronta.

## Positioning

A BLL vai até a casa do paciente: a avaliação acontece na primeira visita, as sessões são na casa da pessoa e ela recebe orientações para o dia a dia e para o treino.

## Operating Context

- O agendamento acontece fora do site, no WhatsApp. O formulário só valida os campos, monta a mensagem e abre o `wa.me`.
- Não há agenda online, pagamento, login nem área do paciente.
- *Inferido:* boa parte das visitas vem do celular, muitas vezes de alguém que está com dor naquele momento.

## Capabilities and Constraints

- Site de uma página só, estático.
- Tratamentos: Cervical e DTM, Coluna e lombar, Recuperação muscular e Mobilidade.
- Regiões do mapa de dor: Mandíbula, Pescoço, Ombro, Costas, Joelho e Tornozelo, cada uma ligada a um tratamento.
- O número do WhatsApp e os demais dados de contato ficam em `src/config/site.ts`.
- Ainda não definidos (ficam como placeholders entre colchetes): número do CREFITO, cidade e bairros atendidos, WhatsApp, Instagram e a URL final do site.

## Brand Commitments

- A BLL é a empresa. É a BLL que atende e vai até a casa do paciente, e é ela que aparece nos textos.
- Luis Fernando é o fisioterapeuta responsável. Aparece só como credencial: no selo "Fisioterapeuta com CREFITO [número]" e como responsável técnico no rodapé.
- Tom direto, acolhedor e claro, falando com "você". Frases curtas e verbos de ação nos botões.
- Sem promessas de cura ou de resultado. Objetivos são escritos como objetivos.
- O protótipo aprovado pelo cliente (`referencia/index.html`) é a referência visual: logo (SVG sem alteração), cores, Figtree, ritmo de rolagem e efeitos.

## Evidence on Hand

- Protótipo aprovado: `referencia/index.html`. Especificação: `referencia/prompt.md`.
- Fotos de banco de imagens (Pexels), não do atendimento real da BLL. A foto do hero será trocada por uma do Luis atendendo.
- Não existem depoimentos, número de pacientes atendidos, avaliações, prêmios ou estudos. Nenhum deles pode ser inventado.
- Depoimentos e fotos de pacientes só entram com autorização por escrito e depois de conferir as regras de publicidade do COFFITO/CREFITO.

## Product Principles

1. Agendar pelo WhatsApp tem que estar sempre ao alcance, em qualquer ponto da página.
2. A BLL fala com o paciente. O Luis é a credencial que dá confiança, não o assunto.
3. Nada de promessa: o site descreve o que é tratado e qual é o objetivo de cada tratamento.
4. Os efeitos existem para mostrar cuidado e movimento. Nenhum deles pode esconder a informação ou atrasar o agendamento.

## Accessibility & Inclusion

WCAG 2.1 AA: contraste AA (inclusive texto sobre foto), foco visível, alvos de toque de pelo menos 44px, conteúdo visível sem JavaScript e `prefers-reduced-motion` respeitado sem congelar a página.
