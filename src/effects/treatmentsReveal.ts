import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import type { Env } from "@/lib/env";
import { clamp, easeInOutCubic, easeOutCubic, smoothstep } from "@/lib/math";
import { registerScrollTarget } from "@/lib/scroll";
import { setCircle } from "./circleReveal";
import { registerNavThemeOverride } from "./navTheme";

// Linha do tempo da seção fixa, em alturas de tela de rolagem a partir do
// momento em que ela chega ao topo (a mesma linguagem do método no protótipo de
// dev-inspiracoes):
// - 0 a 0,5: o círculo abre a partir do cursor;
// - 0,28 a 0,5: a frase sobe e aparece, ainda apagada;
// - 0,45 a 1,3: as palavras acendem uma a uma;
// - 1,45 a 1,65: a frase sobe e sai;
// - 1,55: o título, a introdução e os cards entram;
// - 1,85: a seção é solta.
const CIRCLE_END = 0.5;
const SPEECH_IN: [number, number] = [0.28, 0.5];
const WORDS: [number, number] = [0.45, 1.3];
const SPEECH_OUT: [number, number] = [1.45, 1.65];
export const TREATMENTS_CONTENT_AT = 1.55;
const PIN_SCREENS = 1.85;
// Palavra ainda não lida
const WORD_DIM = 0.16;

// Tratamentos: a seção fica fixa enquanto o círculo abre, a frase de abertura
// acende palavra por palavra e sai, e então os cards entram em sequência: cada um
// sobe, a foto se descobre de baixo para cima desfazendo o zoom, e o texto vem
// logo depois. Ao subir de volta, os cards saem e entram de novo na próxima vez.
// No mobile, o contador acompanha a faixa nativa. Com reduced motion: sem fixar
// e sem a frase, o círculo vira fade e os cards aparecem prontos.
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

  // A frase em palavras, para acender uma a uma
  gsap.registerPlugin(SplitText);
  let words: HTMLElement[] = [];
  // Última leitura aplicada às palavras (só reescreve quando muda)
  let lastLit = -1;
  const split = SplitText.create(statement, {
    type: "words",
    tag: "span",
    aria: "none",
    autoSplit: true,
    onSplit: (self) => {
      words = self.words as HTMLElement[];
      words.forEach((word) => (word.style.opacity = String(WORD_DIM)));
      lastLit = -1;
    },
  });

  let width = window.innerWidth;
  let height = window.innerHeight;
  let pointerX = width / 2;
  let pointerY = height / 2;
  let originX = width / 2;
  let originY = height / 2;
  let lastScrolled = 0;
  const total = () => height * PIN_SCREENS;

  const render = (progress: number) => {
    const screens = (progress * total()) / height;
    // O círculo nasce de onde o cursor está quando a seção chega ao topo (do
    // centro no toque) e fica ali até a seção sair por cima
    if (screens <= 0 || lastScrolled <= 0) {
      originX = env.finePointer ? pointerX : width / 2;
      originY = env.finePointer ? pointerY : height / 2;
    }
    lastScrolled = screens;
    setCircle(stage, easeInOutCubic(clamp(screens / CIRCLE_END)), originX, originY, width, height);

    // A frase entra subindo, fica, e sai subindo
    const enter = smoothstep(SPEECH_IN[0], SPEECH_IN[1], screens);
    const leave = smoothstep(SPEECH_OUT[0], SPEECH_OUT[1], screens);
    statement.style.opacity = (enter * (1 - leave)).toFixed(3);
    statement.style.transform = `translate3d(0, ${((1 - enter) * 40 - leave * 40).toFixed(1)}px, 0)`;
    speech.style.visibility = enter > 0 && leave < 1 ? "visible" : "hidden";

    // Cada palavra acende quando a leitura chega nela, com 1 palavra de transição
    const reading = clamp((screens - WORDS[0]) / (WORDS[1] - WORDS[0])) * words.length;
    const lit = Math.round(reading * 100);
    if (lit === lastLit) return;
    lastLit = lit;
    words.forEach((word, index) => {
      word.style.opacity = (WORD_DIM + (1 - WORD_DIM) * easeOutCubic(clamp(reading - index))).toFixed(3);
    });
  };

  const onPointerMove = (event: PointerEvent) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
  };
  window.addEventListener("pointermove", onPointerMove, { passive: true });

  const trigger = ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: () => `+=${total()}`,
    pin: stage,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onRefreshInit: () => {
      width = window.innerWidth;
      height = window.innerHeight;
    },
    onRefresh: (self) => render(self.progress),
    onUpdate: (self) => render(self.progress),
  });

  // O tema da navbar fica claro quando o círculo passa de 60%. Calculado direto da
  // rolagem, porque o efeito navTheme atualiza antes deste no mesmo quadro.
  const circleAt = () => easeInOutCubic(clamp((window.scrollY - trigger.start) / (height * CIRCLE_END)));
  cleanups.push(
    registerNavThemeOverride("tratamentos", () => (circleAt() > 0.6 ? "light" : "dark")),
    // Os links para a seção param logo depois da frase, com os cards entrando
    registerScrollTarget("tratamentos", () => trigger.start + height * (TREATMENTS_CONTENT_AT + 0.05)),
  );

  // Entrada dos cards, uma linha do tempo que toca ao entrar e volta, mais
  // rápida, ao sair por cima de volta
  const photos = cards.map((card) => card.querySelector<HTMLElement>("[data-treatments-photo]"));
  const images = cards.map((card) => card.querySelector<HTMLElement>("[data-treatments-photo] img"));
  const bodies = cards.map((card) => card.querySelector<HTMLElement>("[data-treatments-body]"));
  const entrance = gsap
    .timeline({
      paused: true,
      defaults: { ease: "expo.out" },
      // O GSAP grava translate e scale inline nos elementos que anima, o que
      // anularia o hover do CSS (o card sobe, a foto aproxima). Ao terminar, sai.
      onComplete: () => gsap.set([...cards, ...images], { clearProps: "transform,translate,scale,rotate" }),
    })
    .fromTo(counter, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, 0)
    .fromTo(cards, { y: 90, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, stagger: 0.1 }, 0)
    .fromTo(
      photos,
      { clipPath: "inset(100% 0% 0% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, stagger: 0.1, ease: "power4.inOut" },
      0.05,
    )
    .fromTo(images, { scale: 1.35 }, { scale: 1.08, duration: 1.6, stagger: 0.1 }, 0.05)
    .fromTo(bodies, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.1 }, 0.35);

  const cardsTrigger = ScrollTrigger.create({
    trigger: section,
    start: () => `top+=${window.innerHeight * TREATMENTS_CONTENT_AT} top`,
    invalidateOnRefresh: true,
    onEnter: () => entrance.timeScale(1).play(),
    onLeaveBack: () => entrance.timeScale(2.2).reverse(),
  });
  // Recarregou a página já depois do ponto de entrada: cards prontos
  if (window.scrollY > cardsTrigger.start) entrance.progress(1, false);

  return () => {
    cleanups.forEach((cleanup) => cleanup());
    cardsTrigger.kill();
    entrance.revert();
    trigger.kill();
    split.revert();
    window.removeEventListener("pointermove", onPointerMove);
    stage.style.clipPath = "";
    speech.style.visibility = "";
    section.removeAttribute("data-pinned");
    section.removeAttribute("data-speech");
  };
}
