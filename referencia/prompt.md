Você é um desenvolvedor front-end sênior especializado em landing pages imersivas, nível Awwwards. Sua tarefa é transformar o protótipo aprovado da BLL Fisioterapia em um site de produção.

Em /referencia/index.html/ use como base o codigo e melhore usando as skills criadas no projeto.

Faca em Next.js, Typesc

## Referências
- referencia/index.html é o protótipo funcional e aprovado pelo cliente (HTML, CSS e JS em um único arquivo). Ele é a fonte de verdade para layout, logo, cores, tipografia, textos, ritmo de rolagem e efeitos. Abra no navegador e leia o código inteiro antes de começar.
- Este arquivo (referencia/prompt.md) é a especificação do projeto final. Quando o protótipo e este documento divergirem, este documento vence.

## Skills do projeto
O projeto tem três skills baixadas em .claude/skills/: frontend-design, impeccable e copywriting. Se não estiverem lá, procure em .agents/skills/.
1. Antes de planejar, leia o SKILL.md de cada uma e os arquivos que ele referencia.
2. frontend-design: use em todas as decisões visuais e de implementação da interface (tipografia, espaçamento, hierarquia, estados, responsividade).
3. impeccable: use para revisar e polir cada seção assim que ela ficar pronta. No final, faça uma passada completa no site inteiro: detalhes visuais, acessibilidade, estados de hover e foco, consistência e desempenho.
4. copywriting: use para revisar todos os textos, incluindo botões, mensagens de erro e a mensagem pronta do WhatsApp, respeitando as regras de "Posicionamento e voz" abaixo.
5. O protótipo já foi aprovado. Use as skills para refinar e elevar a qualidade, não para trocar a direção. Se uma skill sugerir mudança grande (layout, paleta, conceito ou ordem das seções), coloque como sugestão no plano e espere minha aprovação.
6. No resumo final, liste o que cada skill mudou ou melhorou.

## Forma de trabalhar
1. Antes de escrever código, apresente um plano curto: estrutura de pastas, como cada efeito do protótipo será portado, dependências, como as skills serão aplicadas e a ordem das etapas. Espere minha aprovação.
2. Trabalhe em etapas pequenas e rode npm run check ao final de cada uma. Corrija tudo antes de seguir.
3. Ao terminar, rode npm run build, sirva a pasta out/ e confira o site em 1440×900 e 390×844, com e sem prefers-reduced-motion.
4. Nada de trechos do tipo "implementar depois".

## Posicionamento e voz
- A BLL é a empresa. É a BLL que atende e vai até a casa do paciente, e é ela que aparece nos textos ("a BLL leva a fisioterapia até a sua casa", "receba a BLL em casa").
- O Luis Fernando é o fisioterapeuta responsável da BLL. Ele aparece só como credencial: no selo "Fisioterapeuta com CREFITO [número]" e como responsável técnico no rodapé. Não escreva frases como "o Luis vai até você".
- Serviço: fisioterapia em domicílio para dor de cabeça tensional, DTM, dores no pescoço e nas costas, recuperação muscular de quem treina e mobilidade.
- Tom: direto, acolhedor e claro, falando com "você". Frases curtas e verbos de ação nos botões.
- Sem promessas de cura ou de resultado. Objetivos são escritos como objetivos.
- Dados do cliente ficam como placeholders entre colchetes: CREFITO, cidade e bairros atendidos, WhatsApp e Instagram.
- Depoimentos e fotos de pacientes só com autorização por escrito. Antes de publicar, confira as regras de publicidade do COFFITO/CREFITO.

## Stack
- Next.js (App Router) + TypeScript com output: 'export' (site 100% estático, pronto para Vercel e Netlify) e images.unoptimized.
- GSAP + ScrollTrigger para os efeitos ligados à rolagem.
- Lenis para o scroll suave, dirigido pelo gsap.ticker e sincronizado com o ScrollTrigger.
- Cena WebGL do hero em WebGL puro ou Three.js, carregada sob demanda só no cliente, com o mesmo shader do protótipo.
- CSS puro em styles/tokens.css, base.css, effects.css e sections.css. Sem Tailwind.
- Fonte Figtree via next/font/google, auto-hospedada, pesos 400 a 800.
- Ícones: @tabler/icons-react.

## Arquitetura
src/
  app/             layout, page (monta as seções + JSON-LD), opengraph-image.tsx, icon.svg, robots.ts, sitemap.ts
  data/content.ts  todos os textos e os caminhos das fotos
  config/site.ts   nome, WhatsApp, Instagram, cidade e bairros, responsável técnico, CREFITO, URL
  components/      Logo, Intro, Navbar, Fab, Cursor, GlobalEffects, ContactForm
    sections/      Hero, Treatments, PainMap, HowItWorks, Posture, Contact (uma por arquivo)
  scenes/          heroLiquid.ts (WebGL do hero)
  effects/         smoothScroll, circleReveal, horizontalTrack, cardSpotlight, elasticHeadings, painMap, timeline, postureWipe, splitChars, magnetic, cursor
  lib/             loop.ts (assinaturas no gsap.ticker, nenhum outro requestAnimationFrame), env.ts (reduced motion, ponteiro, mobile, nível da GPU), whatsapp.ts (monta o link wa.me)
  styles/
public/images/     fotos otimizadas em WebP

Regras:
- Seções são Server Components com HTML semântico. Os efeitos rodam no cliente a partir de um único GlobalEffects.
- A cena WebGL só renderiza quando o hero está visível (IntersectionObserver), acompanha o tamanho dele (ResizeObserver) e faz dispose de tudo ao desmontar.

## O que muda do protótipo para o projeto
- O protótipo rola dentro de um contêiner (#sc) com scroll suave escrito à mão. No projeto a rolagem é a da janela, com Lenis. Remova o contêiner e o código de wheel.
- No protótipo os trechos fixados usam position: sticky e o progresso é calculado à mão. No projeto use ScrollTrigger (pin com scrub, ou progress no onUpdate), mantendo as mesmas distâncias de rolagem descritas abaixo.
- Fotos: o protótipo puxa as imagens direto do Pexels. No projeto, baixe para public/images/, converta para WebP e use srcset com tamanhos responsivos. Servir do próprio domínio também evita o bloqueio de CORS na textura WebGL.
- WhatsApp: o protótipo usa a constante WA_NUMBER. No projeto o número vem de config/site.ts.

## Identidade visual
- Cores:
  - verde BLL #0B5D4B (fundo de hero, seções escuras e botões secundários)
  - verde escuro #08473A
  - verde vivo #2FD47F (CTAs de WhatsApp, destaques e o risco do "dor")
  - menta #DDF3EA
  - fundo claro #F4F8F6
  - tinta #10241F
  - texto secundário #4A5D58
  - linha #DCE6E2
  - vermelho de dor #FF6B5B (usado só no mapa de dor)
- Tipografia: Figtree. Títulos peso 800, tracking −0,04em, line-height 0,95, caixa normal, tamanhos fluidos com clamp(). Texto corrido peso 400.
- Botões com raio de 12px. O CTA principal de WhatsApp é sempre verde vivo com texto em tinta.
- Logo: copie o SVG do protótipo sem alterar (viewBox "0 2 84 42"). São três paths com traço 6, pontas e junções arredondadas, e a cabeça (círculo) em verde vivo. O L do meio é uma pessoa sentada se alongando. Na navbar, a logo vem ao lado de "Fisioterapia". Gere app/icon.svg só com o bonequinho.

## Fotos
- Hero: Pexels 20860579 (fisioterapeuta atendendo um paciente), com overlay verde à esquerda para manter contraste AA no texto.
- Cards de tratamento: 20860594 (Cervical e DTM), 20860598 (Coluna e lombar), 20860607 (Recuperação muscular) e 20860582 (Mobilidade).
- No futuro, a foto do hero será trocada por uma foto do Luis atendendo. Deixe o caminho dela em data/content.ts para a troca ser de uma linha.
- Todas as imagens com alt descritivo em português.

## Seções e efeitos, na ordem

Abertura:
- Tela verde. A logo se desenha em cerca de 0,7s e a cabeça entra com overshoot.
- Em seguida a tela some e a foto do hero aparece por um círculo que se abre do centro em 1,6s (cubic-bezier .77,0,.18,1), com zoom de 1,15 para 1.
- Some na hora se a pessoa rolar, clicar ou tocar. Do carregamento até o conteúdo legível, menos de 1,2s.

Navbar:
- Transparente sobre o hero, com texto branco. Muda para texto escuro sobre seções claras.
- Contém: logo, links (Tratamentos, Onde dói?, Como funciona, Contato) e um botão "Agendar" verde vivo, magnético.

Hero (altura da tela):
- Foto em tela cheia no fundo, com overlay verde em gradiente da esquerda para a direita.
- Conteúdo à esquerda:
  - selo "Fisioterapia em domicílio";
  - título "Menos dor. Mais movimento.", com as linhas subindo de trás de uma máscara;
  - subtítulo;
  - botões "Agendar avaliação pelo WhatsApp" e "Ver tratamentos";
  - três selos de confiança: CREFITO, avaliação na primeira visita e cidade.
- Cerca de 1,5s depois da entrada, um traço verde vivo risca a palavra "dor", que fica com 60% de opacidade.
- Cartão "Onde dói?" no canto inferior direito, com chips (Pescoço, Mandíbula, Costas, Ombro, Joelho). Cada chip seleciona a região no mapa e rola até ele.
- Foto líquida (WebGL):
  - Uma textura de rastro (180px de largura na proporção do hero) recebe a cada quadro um pincel radial na posição do cursor, com raio de 13% da largura e intensidade proporcional à velocidade, e esmaece 5,5% por quadro.
  - O shader desloca a foto pelo gradiente do rastro, soma uma ondulação senoidal leve, separa os canais RGB perto da onda e tinge de verde de leve.
  - No touch, com reduced motion ou em GPU fraca, a foto fica estática.
- Parallax na rolagem: a foto desce a 35% da velocidade e cresce até 8%, e o texto sobe a 18% e esmaece.

Tratamentos (fixado, fundo claro):
- Círculo de entrada: durante as primeiras 1,1 alturas de tela de rolagem, a seção se abre em um círculo que nasce da posição do cursor (do centro no touch), com smoothstep. Esse tempo é proposital, para o efeito ser visto.
- Depois do círculo, os quatro cards correm na horizontal, com distância de rolagem igual a 1,2 vez o quanto eles passam da tela.
- Cada card:
  - inclina em 3D conforme a distância do centro (rotateY de até 16° e translateZ negativo);
  - tem um holofote verde que segue o cursor e uma borda que acende;
  - a foto se move por dentro do card.
- A faixa de cards inclina levemente (skewX) conforme a velocidade da rolagem.
- Contador "1 de 4" com barra de progresso.
- Cada card tem o botão "Agendar avaliação", que já preenche o tratamento no formulário.
- No mobile (menos de 640px), troque o pin horizontal por rolagem horizontal nativa com scroll-snap e mantenha o círculo de entrada.

Onde dói? (fundo verde):
- Corpo em traço fino que se desenha ao entrar na tela e "respira" bem de leve.
- Chips das regiões: Mandíbula, Pescoço, Ombro, Costas, Joelho e Tornozelo.
- Ao selecionar uma região:
  - uma linha de escaneamento desliza até ela;
  - o ponto acende em vermelho com brilho e, depois de 1,1s, passa para verde vivo e começa a pulsar;
  - uma legenda "dor / alívio" fica embaixo do corpo.
- Painel ao lado com título, descrição, "Tratamento indicado" e o botão "Agendar para este caso".

Como funciona (fundo branco):
- Linha horizontal com quatro pontos, que se preenche conforme a seção atravessa a tela (começa quando o topo está 140px acima da base da tela e termina 0,7 tela depois).
- Uma bolinha verde corre na ponta da linha. Os pontos "saltam" ao serem alcançados e as quatro etapas acendem em sequência.

Postura que pesa no pescoço (fundo menta):
- Duas figuras sobrepostas, antes (cabeça projetada) e depois (eixo alinhado).
- Uma divisória varre da direita para a esquerda entre 30% e 68% da passagem da seção pela tela, trocando o antes pelo depois.
- Ângulos marcados como valores ilustrativos.

Contato e rodapé:
- Fundo menta, com o painel verde se abrindo em um círculo que nasce da base visível da seção. O círculo leva 1,3 altura de tela de rolagem, com smoothstep.
- O título "Agende sua avaliação e receba a BLL em casa." entra letra por letra, subindo e girando, depois que o círculo já abriu bem.
- Formulário com nome, WhatsApp com DDD e tratamento. Valida os campos e abre o wa.me com a mensagem montada.
- Botão "Chamar direto no WhatsApp".
- Rodapé com atendimento, contato e responsável técnico.

Global:
- Títulos elásticos: os títulos das seções esticam (até 12% na vertical, encolhendo 22% disso na horizontal) conforme a velocidade da rolagem e voltam com mola amortecida (rigidez 170, amortecimento 13). A origem fica do lado do sentido da rolagem.
- Cursor de anel + ponto com mix-blend-mode difference, que cresce sobre botões e links (desligado no touch).
- Botões magnéticos.
- Botão fixo "Agendar pelo WhatsApp", que aparece depois de 70% do hero e some ao chegar no contato. No mobile, ocupa a largura toda.

## Desempenho
- A foto do hero é a imagem LCP: priority, tamanho certo e WebP. A cena WebGL só substitui a foto depois que a textura carregar, sem piscar.
- Imagens dos cards com lazy loading.
- Anime só transform, opacity e clip-path.
- Mire Lighthouse acima de 90 em desempenho e acessibilidade no mobile.

## Acessibilidade e prefers-reduced-motion
- Reduzir sem congelar. Saem Lenis, pins, foto líquida, títulos elásticos, cursor, magnetismo e o skew. Os círculos viram fade e a horizontal dos tratamentos vira rolagem nativa.
- O ponto do mapa de dor fica direto no verde, sem pulsar.
- Conteúdo visível sem JavaScript.
- HTML semântico, foco visível, contraste AA (inclusive texto sobre foto) e alvos de toque de pelo menos 44px.

## SEO e entrega
- Metadata e Open Graph gerado: logo e "Menos dor. Mais movimento." sobre o verde.
- Sitemap, robots e JSON-LD MedicalBusiness com os dados de config/site.ts e areaServed com a cidade.
- URL definida por NEXT_PUBLIC_SITE_URL.
- Scripts: dev, build, lint, typecheck e check (os três em sequência).
- README em português: como rodar, editar textos e contatos, trocar a foto do hero pela do Luis e publicar na Vercel e no Netlify.

## Critérios de aceite
- Na primeira tela, sem rolar, dá para ver que é fisioterapia em domicílio, o que é tratado e como agendar.
- Cada efeito de círculo leva pelo menos 1 altura de tela de rolagem para abrir e é claramente visível.
- Em 1440×900 todas as seções se comportam como no protótipo.
- Em 390×844 não há rolagem horizontal da página e todos os textos cabem.
- Com prefers-reduced-motion o site continua vivo, sem pins e sem scroll suave.
- Os textos citam a BLL como quem atende, e o Luis só como fisioterapeuta responsável.
- npm run check e npm run build passam sem erros.