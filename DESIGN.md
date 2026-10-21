---
name: BLL Fisioterapia
description: Landing page da BLL, fisioterapia em domicílio
colors:
  verde: "#0b5d4b"
  verde-escuro: "#08473a"
  verde-vivo: "#2fd47f"
  verde-vivo-claro: "#5be39b"
  menta: "#ddf3ea"
  fundo: "#f4f8f6"
  tinta: "#10241f"
  secundario: "#4a5d58"
  cinza: "#7d8f8a"
  linha: "#dce6e2"
  dor: "#ff6b5b"
  erro: "#ffd0d0"
typography:
  display:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "clamp(44px, 8.2vw, 130px)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "clamp(32px, 4.6vw, 72px)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "clamp(20px, 2vw, 26px)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.4
rounded:
  button: "12px"
  panel: "14px"
  card: "16px"
  pill: "999px"
spacing:
  page-gutter: "clamp(20px, 4vw, 64px)"
  section-top: "clamp(90px, 14vh, 140px)"
  section-bottom: "clamp(70px, 10vh, 110px)"
  card-gap: "18px"
components:
  button-accent:
    backgroundColor: "{colors.verde-vivo}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.button}"
    padding: "14px 22px"
    height: "44px"
  button-accent-hover:
    backgroundColor: "{colors.verde-vivo-claro}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "#ffffff"
    rounded: "{rounded.button}"
    padding: "14px 22px"
    height: "44px"
  chip:
    backgroundColor: "{colors.menta}"
    textColor: "{colors.verde}"
    rounded: "{rounded.pill}"
    padding: "6px 10px"
  chip-hover:
    backgroundColor: "{colors.verde}"
    textColor: "#ffffff"
  region-button-pressed:
    backgroundColor: "#ffffff"
    textColor: "{colors.verde}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "44px"
  treatment-card:
    backgroundColor: "#ffffff"
    textColor: "{colors.tinta}"
    rounded: "{rounded.card}"
    width: "clamp(262px, min(32vw, 52vh), 400px)"
---

# Design System: BLL Fisioterapia

## Overview

**Creative North Star: "A visita que alivia"**

O site é a casa que recebe a BLL: um verde fundo e calmo que abre espaço, aos poucos, para fotos claras de atendimento e para uma linha fina que desenha o corpo. Cada seção chega por um gesto de abertura (um círculo que se expande, uma divisória que varre, uma linha que se preenche), como uma porta que se abre para a visita. A rolagem conduz o ritmo, e os efeitos sempre levam ao mesmo lugar: o botão verde vivo do WhatsApp.

A densidade é baixa e o contraste entre campos de cor é alto. Seções escuras (verde) e claras (fundo, branco, menta) se alternam em blocos inteiros, sem cartões flutuando sobre cinza. A tipografia é uma só, Figtree, em títulos muito pesados e apertados que viram a imagem da página, e em texto corrido leve e curto.

O movimento tem uma abertura orquestrada (a logo que se desenha e a foto que se abre em círculo) e, depois dela, efeitos ligados à rolagem. Nada se mexe sozinho além do corpo que "respira" no mapa de dor e do ponto que pulsa em alívio.

**Key Characteristics:**
- Campos de cor inteiros que se alternam entre verde, branco e menta
- Figtree 800 nos títulos, com tracking −0,04em e line-height 0,95
- Verde vivo como única cor de ação
- Traço fino de pontas arredondadas nas ilustrações (corpo, postura, linha do tempo)
- Revelações por círculo que levam pelo menos uma altura de tela de rolagem

## Colors

Uma família de verdes com um único acento vivo e um vermelho reservado à dor.

### Primary
- **Verde BLL** (#0b5d4b): fundo do hero, das seções escuras (Onde dói?, painel do contato, rodapé) e do `html`. É a cor da marca e o chão da página.
- **Verde vivo** (#2fd47f): ação e destaque. CTAs do WhatsApp, botão "Agendar", traço que risca "dor", cabeça da logo, ponto em alívio, ícones sobre o verde.

### Secondary
- **Verde vivo claro** (#5be39b): hover dos CTAs e versão do verde vivo para texto pequeno sobre o verde, onde o verde vivo não passa no AA.
- **Menta** (#ddf3ea): seção da postura, fundo em volta do círculo do contato, chips do hero.
- **Verde escuro** (#08473a): trilho da barra de rolagem e variações do verde em sombra.

### Tertiary
- **Vermelho de dor** (#ff6b5b): só o ponto e o halo de dor no mapa, e o ponto da legenda "dor".

### Neutral
- **Tinta** (#10241f): títulos e texto principal sobre fundos claros, texto dos CTAs verde vivo.
- **Texto secundário** (#4a5d58): descrições e textos de apoio sobre fundos claros.
- **Cinza** (#7d8f8a): números das etapas que a linha do tempo ainda não alcançou.
- **Linha** (#dce6e2): bordas dos cards, trilho da linha do tempo e da barra de progresso.
- **Fundo claro** (#f4f8f6): palco dos tratamentos.
- **Erro** (#ffd0d0): mensagens de erro do formulário, sobre o verde.

### Named Rules
**A Regra da Cor de Ação.** O verde vivo marca o que se pode fazer ou o que alivia. Ele nunca é fundo de seção, e em texto menor que 18px sobre o verde vira verde vivo claro.

**A Regra do Vermelho Único.** O vermelho de dor só aparece no mapa de dor, e sempre passa para o verde. Ele não sinaliza erro nem alerta em nenhum outro lugar.

## Typography

**Display Font:** Figtree (com system-ui e sans-serif)
**Body Font:** Figtree (com system-ui e sans-serif)

**Character:** Uma família só, em dois registros bem separados: títulos em 800, grandes e apertados, que funcionam como imagem; texto corrido em 400, pequeno, curto e com bastante entrelinha.

### Hierarchy
- **Display** (800, clamp(44px, 8.2vw, 130px), 0,95): o título do hero e, numa escala próxima, o do contato (clamp(40px, 7.4vw, 124px)).
- **Headline** (800, clamp(32px, 4.6vw, 72px), 0,95): título de cada seção. A postura usa clamp(30px, 4.4vw, 68px) porque o título é mais longo.
- **Title** (800, clamp(20px, 2vw, 26px), 1,1): nome dos tratamentos nos cards. Os painéis do mapa de dor usam clamp(24px, 2.6vw, 36px), e as etapas, 17px em 700.
- **Body** (400, 14px, 1,5): textos dos cards, das etapas e das introduções de seção. Os textos mais longos sobem para 15px/1,55 (painéis, postura) e 16px/1,6 (subtítulo do hero, contato).
- **Label** (600–700, 13px, 1,4): links da navbar, botões menores, chips, contador, rodapé. Os rótulos do formulário e as legendas usam 12px.

### Named Rules
**A Regra do Título Apertado.** Títulos sempre em 800 com tracking de −0,04em e line-height 0,95. Nunca mais apertado que isso, e nunca em caixa alta.

**A Regra da Linha Equilibrada.** Títulos usam `text-wrap: balance` e parágrafos `text-wrap: pretty`: nenhuma palavra sozinha na última linha.

**A Regra da Máscara.** Texto grande entra subindo de trás de uma máscara, linha por linha: o título do hero, os títulos das seções e, logo depois deles, as introduções. O texto explicativo da postura escurece palavra por palavra com a rolagem, sempre entre duas cores com contraste AA (texto secundário → tinta). Títulos e introduções saem pelo lado em que deixam a tela (por cima ao descer, por baixo ao subir) e entram de novo quando a seção volta; os números da postura contam de novo a cada entrada. Com reduced motion, o texto aparece pronto.

## Layout

Página de uma coluna, em blocos de seção que ocupam a largura toda. A margem lateral é fluida (clamp(20px, 4vw, 64px)) e se repete em todas as seções. Os blocos de texto têm largura máxima curta: 360px nas introduções, 440–470px nos parágrafos de destaque. O espaçamento vertical das seções é clamp(90px, 14vh, 140px) em cima e clamp(70px, 10vh, 110px) embaixo.

O hero e o palco dos tratamentos ocupam exatamente uma tela (100dvh). Mapa de dor e postura usam grade de duas colunas no desktop (0,75fr / 1,25fr e 1fr / 1fr) e uma coluna no mobile. As etapas vão de quatro colunas no desktop, com a linha do tempo na horizontal por cima, para uma coluna no mobile, com a linha na vertical ao lado, e o formulário de três campos para um.

O ponto de quebra principal é 640px. Acima dele, os quatro tratamentos ficam à vista em grade (duas colunas no tablet, quatro a partir de 1024px). Abaixo, eles passam a uma faixa nativa com scroll-snap e contador, cada card com 78vw.

## Elevation & Depth

O sistema é plano, sem sombras. A profundidade vem dos campos de cor que se sobrepõem, das fotos, do overlay verde em degradê sobre a foto do hero (que se dissolve no verde da seção de baixo) e do movimento: a entrada dos cards em sequência (sobem 90px, a foto se descobre de baixo para cima desfazendo o zoom) e o card que sobe 6px no hover e os recortes circulares que revelam uma seção por cima da outra.

### Named Rules
**A Regra Sem Sombra.** Nenhum elemento tem sombra. Para separar, use cor de fundo ou borda de 1px na cor linha, nunca as duas coisas com sombra junto.

## Shapes

Cantos suaves e consistentes por função: botões com 12px, caixas de mensagem com 14px, cards e cartão do hero com 16px, chips e botões de região em pílula. As ilustrações são geometria em traço fino (2,2–2,5px), com pontas e junções arredondadas: o corpo do mapa de dor, as duas figuras da postura, a logo (traço 6 no viewBox da marca). O círculo é a forma recorrente dos efeitos: cabeça da logo, revelação da foto, dos tratamentos e do contato, pontos da linha do tempo e do mapa de dor.

## Components

### Buttons
- **Shape:** cantos suaves (12px), altura mínima de 44px, ícone de 18px à esquerda.
- **Primary (accent):** verde vivo com texto em tinta, peso 700, 13px (15px no tamanho grande).
- **Hover / Focus:** o fundo passa a verde vivo claro em 0,3s. Foco com contorno de 2px em verde vivo, afastado 3px. No desktop com mouse, os botões são magnéticos.
- **Ghost:** transparente, texto branco e borda de 1px em branco a 45%, que fica branca no hover. Usado ao lado de um botão verde vivo sobre fundo verde.

### Chips
- **Style:** pílula menta com texto verde em 13px/600 (cartão "Onde dói?" do hero). A área de toque é ampliada por um pseudo-elemento.
- **State:** no hover, fundo verde e texto branco.

### Region buttons (mapa de dor)
- **Style:** pílula com contorno branco a 30%, texto branco a 85%, 14px/600, altura de 44px.
- **State:** pressionado (`aria-pressed`), fundo branco com texto verde.

### Cards / Containers
- **Corner Style:** 16px.
- **Background:** branco, sobre o fundo claro do palco.
- **Shadow Strategy:** nenhuma (ver Elevation & Depth).
- **Border:** 1px na cor linha, verde vivo no hover, com um holofote verde radial que segue o cursor e um brilho branco suave sobre a foto.
- **Internal Padding:** 16px em cima, 18px nas laterais e embaixo. A foto fica em 16:10 no topo, aproxima no hover (de 1,08 para 1,14) e se move de leve por dentro do card com o cursor.

### Inputs / Fields
- **Style:** só sublinhado, 1px em branco a 35%, sobre o verde. Texto em 16px branco, placeholder em menta a 80%.
- **Focus:** o sublinhado passa para verde vivo com 2px de espessura.
- **Error:** sublinhado na cor erro e mensagem em erro abaixo do formulário.

### Select (Tratamento)
- **Style:** a caixa segue o campo sublinhado, com o texto do placeholder em menta a 80% e uma seta que gira ao abrir.
- **Lista:** painel verde escuro com 14px de raio e borda de 1px em branco a 15%. Cada item tem o nome em 15px e uma linha de apoio em 12px a 65% de branco, com fundo branco a 10% no item ativo e check verde vivo no escolhido.
- **Behavior:** padrão select-only combobox do WAI-ARIA (setas, Home/End, Enter, Espaço, Esc, Tab e busca pela letra).

### Navigation
- **Style:** barra fixa e transparente, com a logo e "Fisioterapia" à esquerda, links de 13px/500 a 80% de opacidade no centro e "Agendar" à direita.
- **Theme:** texto branco sobre seções escuras e tinta sobre as claras, trocando conforme a seção que passa a 28px do topo.
- **Hover:** um sublinhado verde vivo de 2px se desenha da esquerda para a direita.
- **Mobile:** abaixo de 640px ficam só a logo e o botão "Agendar".

### Revelação circular (assinatura)
Seções se abrem por um `clip-path: circle()` que cresce com a rolagem. Nos tratamentos, o círculo nasce do cursor e abre rápido (meia tela, easeInOutCubic); lá dentro, uma frase grande em 700 acende palavra por palavra (de 16% de opacidade para 100%) ao longo de quase uma tela, sobe e sai, e só então o título e os cards entram. No contato, ele nasce da base visível da seção e leva 1,3 tela. Com reduced motion, o círculo vira fade.

## Do's and Don'ts

### Do:
- **Do** usar o verde vivo (#2fd47f) só em ações e destaques, e verde vivo claro (#5be39b) para texto pequeno sobre o verde.
- **Do** manter os títulos em Figtree 800, tracking −0,04em, line-height 0,95.
- **Do** separar seções por campos de cor inteiros (verde, branco, menta, fundo claro).
- **Do** desenhar ilustrações em traço fino de 2,2–2,5px com pontas arredondadas.
- **Do** dar a todo alvo de toque pelo menos 44px.
- **Do** oferecer, para cada efeito, uma versão com reduced motion que mantém o conteúdo e a mudança de estado.

### Don't:
- **Don't** usar sombras, texto em degradê ou caixa alta em rótulos.
- **Don't** usar o vermelho de dor (#ff6b5b) fora do mapa de dor.
- **Don't** apagar texto por opacidade abaixo do contraste AA: para mostrar um estado inativo, troque a cor (tinta → texto secundário, verde → cinza).
- **Don't** usar raio maior que 16px em cards, nem pílula em blocos de conteúdo.
