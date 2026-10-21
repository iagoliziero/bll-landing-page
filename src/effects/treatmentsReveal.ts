import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import type { Env } from "@/lib/env";
import { clamp, easeInOutCubic } from "@/lib/math";
import { registerScrollTarget } from "@/lib/scroll";
import { setCircle } from "./circleReveal";
import { registerNavThemeOverride } from "./navTheme";

// Linha do tempo da seção fixa, em alturas de tela de rolagem a partir do
// momento em que ela chega ao topo:
// - 0 a 0,5: o círculo abre a partir do cursor;
// - 0,28 a 0,5: a frase sobe e aparece, ainda apagada;
// - 0,45 a 1,25: as palavras acendem uma a uma;
// - 1,35 a 1,52: a frase sobe e sai;
// - 1,55 a 1,97: o título, a introdução e os cards entram;
// - 2: a seção é solta.
// Tudo fica preso à rolagem (scrub), então subir é o espelho de descer: os cards
// saem, a frase volta e apaga, e o círculo fecha.
const CIRCLE_END = 0.5;
const SPEECH_IN = 0.28;
const WORDS: [number, number] = [0.45, 1.25];
const SPEECH_OUT = 1.35;
export const TREATMENTS_CONTENT_AT = 1.55;
const PIN_SCREENS = 2;
// Palavra ainda não lida
const WORD_DIM = 0.16;
// Atraso com que a animação alcança a rolagem, para nada saltar numa rolagem
// rápida (o círculo fecha à vista mesmo quando se sobe com força)
const SCRUB = 0.6;

// Tratamentos: a seção fica fixa enquanto o círculo abre, a frase de abertura
// acende palavra por palavra e sai, e então os cards entram em sequência: cada um
// sobe, a foto se descobre de baixo para cima desfazendo o zoom, e o texto vem
// logo depois. No mobile, o contador acompanha a faixa nativa. Com reduced
// motion: sem fixar e sem a frase, o círculo vira fade e os cards aparecem prontos.
export function initTreatmentsReveal(env: Env) {
  const section = document.querySelector<HTMLElement>("[data-treatments]");
  const stage = section?.querySelector<HTMLElement>("[data-treatments-stage]");
  const viewport = section?.querySelector<HTMLElement>("[data-treatments-viewport]");
  const count = section?.querySelector<HTMLElement>("[data-treatments-count]");
  const counter = section?.querySelector<HTMLElement>("[data-treatments-counter]");
  const progressBar = section?.querySelector<HTMLElement>("[data-treatments-progress]");
  const speech = section?.querySelector<HTMLElement>("[data-treatments-speech]");
  const statement = speech?.querySelector<HTMLElement>("p");
  const cards = section ? [...section.querySelectorAll<HTMLElement>("[data-treatments-card]")] : [];
  if (!section || !stage || !viewport || !count || !counter || !progressBar || !speech || !statement || !cards.length) {
    return () => {};
  }

  const cleanups: (() => void)[] = [];

  // Contador do mobile: o card no ponto de snap (a margem da página) é o ativo
  let active = -1;
  const onScroll = () => {
    const step = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : 1;
    const index = clamp(Math.round(viewport.scrollLeft / step), 0, cards.length - 1);
    if (index === active) return;
    active = index;
    count.textContent = String(index + 1);
    progressBar.style.transform = `scaleX(${((index + 1) / cards.length).toFixed(3)})`;
  };
  if (env.mobile) {
    viewport.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    cleanups.push(() => viewport.removeEventListener("scroll", onScroll));
  }

  if (env.reducedMotion) {
    section.setAttribute("data-fade", "");
    const fade = ScrollTrigger.create({
      trigger: section,
      start: "top 75%",
      onEnter: () => section.setAttribute("data-visible", ""),
    });
    return () => {
      cleanups.forEach((cleanup) => cleanup());
      fade.kill();
      section.removeAttribute("data-fade");
      section.removeAttribute("data-visible");
    };
  }

  // O botão fixo fica escondido enquanto a seção está na tela no desktop (efeito fab)
  if (!env.mobile) section.setAttribute("data-pinned", "");
  section.setAttribute("data-speech", "");

  // A frase em palavras, para acender uma a uma. Palavras não mudam com a
  // largura da tela, então não precisa redividir.
  gsap.registerPlugin(SplitText);
  const split = SplitText.create(statement, { type: "words", tag: "span", aria: "none" });
  const words = split.words as HTMLElement[];

  let width = window.innerWidth;
  let height = window.innerHeight;
  let pointerX = width / 2;
  let pointerY = height / 2;
  let originX = width / 2;
  let originY = height / 2;
  const onPointerMove = (event: PointerEvent) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
  };
  window.addEventListener("pointermove", onPointerMove, { passive: true });

  // O círculo nasce de onde o cursor está quando começa a abrir (do centro no
  // toque) e fica ali até fechar de novo
  const circle = { progress: 0 };
  let lastCircle = 0;
  const renderCircle = () => {
    if (circle.progress <= 0 || lastCircle <= 0) {
      originX = env.finePointer ? pointerX : width / 2;
      originY = env.finePointer ? pointerY : height / 2;
    }
    lastCircle = circle.progress;
    setCircle(stage, circle.progress, originX, originY, width, height);
  };

  const photos = cards.map((card) => card.querySelector<HTMLElement>("[data-treatments-photo]"));
  const images = cards.map((card) => card.querySelector<HTMLElement>("[data-treatments-photo] img"));
  const bodies = cards.map((card) => card.querySelector<HTMLElement>("[data-treatments-body]"));
  const wordStep = (WORDS[1] - WORDS[0]) / words.length;

  // Durações e posições em alturas de tela de rolagem
  const timeline = gsap
    .timeline({
      defaults: { ease: "none" },
      // O GSAP grava translate e scale inline nos elementos que anima, o que
      // anularia o hover do CSS (o card sobe, a foto aproxima). Com os cards
      // prontos, sai; se a rolagem voltar, a linha do tempo grava de novo.
      onComplete: () => gsap.set([...cards, ...images], { clearProps: "transform,translate,scale,rotate" }),
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${height * PIN_SCREENS}`,
        pin: stage,
        anticipatePin: 1,
        scrub: SCRUB,
        invalidateOnRefresh: true,
        onRefreshInit: () => {
          width = window.innerWidth;
          height = window.innerHeight;
        },
      },
    })
    .to(circle, { progress: 1, duration: CIRCLE_END, ease: "power2.inOut", onUpdate: renderCircle }, 0)
    .fromTo(statement, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.22, ease: "power2.out" }, SPEECH_IN)
    .fromTo(
      words,
      { opacity: WORD_DIM },
      { opacity: 1, duration: wordStep * 1.5, stagger: wordStep, ease: "power1.out" },
      WORDS[0],
    )
    .to(statement, { autoAlpha: 0, y: -40, duration: 0.17, ease: "power2.in" }, SPEECH_OUT)
    .fromTo(counter, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15 }, TREATMENTS_CONTENT_AT)
    .fromTo(
      cards,
      { y: 90, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.24, stagger: 0.035, ease: "power3.out" },
      TREATMENTS_CONTENT_AT,
    )
    .fromTo(
      photos,
      { clipPath: "inset(100% 0% 0% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 0.24, stagger: 0.035, ease: "power3.inOut" },
      TREATMENTS_CONTENT_AT + 0.01,
    )
    .fromTo(
      images,
      { scale: 1.35 },
      { scale: 1.08, duration: 0.3, stagger: 0.035, ease: "power2.out" },
      TREATMENTS_CONTENT_AT + 0.01,
    )
    .fromTo(
      bodies,
      { y: 24, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.18, stagger: 0.035, ease: "power3.out" },
      TREATMENTS_CONTENT_AT + 0.08,
    )
    // A linha do tempo dura exatamente o trecho fixo
    .set({}, {}, PIN_SCREENS);

  const trigger = timeline.scrollTrigger;
  cleanups.push(
    // A navbar fica clara quando o círculo passa de 60%. Vem direto da rolagem,
    // sem o atraso do scrub, porque o tema só é recalculado quando a página rola.
    registerNavThemeOverride("tratamentos", () => {
      const scrolled = trigger ? (window.scrollY - trigger.start) / (height * CIRCLE_END) : 0;
      return easeInOutCubic(clamp(scrolled)) > 0.6 ? "light" : "dark";
    }),
    // Os links para a seção param no fim do trecho fixo, com os cards prontos
    registerScrollTarget("tratamentos", () => (trigger ? trigger.end : section.offsetTop)),
  );

  return () => {
    cleanups.forEach((cleanup) => cleanup());
    trigger?.kill();
    timeline.revert();
    split.revert();
    window.removeEventListener("pointermove", onPointerMove);
    stage.style.clipPath = "";
    section.removeAttribute("data-pinned");
    section.removeAttribute("data-speech");
  };
}
