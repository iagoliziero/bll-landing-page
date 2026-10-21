import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Env } from "@/lib/env";
import { clamp, smoothstep } from "@/lib/math";
import { registerScrollTarget } from "@/lib/scroll";
import { setCircle } from "./circleReveal";
import { registerNavThemeOverride } from "./navTheme";

// Círculo de entrada: 1,1 altura de tela de rolagem. O tempo é proposital,
// para o efeito ser visto.
const REVEAL_SCREENS = 1.1;
// Os cards começam a entrar quando o círculo chega a 40%
const CARDS_AT = 0.4;

// Tratamentos: a seção fica fixa enquanto abre em um círculo que nasce do cursor
// (do centro no toque), e os cards entram em sequência: cada um sobe, a foto se
// descobre de baixo para cima enquanto desfaz o zoom, e o texto vem logo depois.
// Ao subir de volta antes do círculo, os cards saem e entram de novo na próxima
// vez. No mobile, o contador acompanha a faixa nativa. Com reduced motion: sem
// fixar, o círculo vira fade e os cards aparecem prontos.
export function initTreatmentsReveal(env: Env) {
  const section = document.querySelector<HTMLElement>("[data-treatments]");
  const stage = section?.querySelector<HTMLElement>("[data-treatments-stage]");
  const viewport = section?.querySelector<HTMLElement>("[data-treatments-viewport]");
  const count = section?.querySelector<HTMLElement>("[data-treatments-count]");
  const progressBar = section?.querySelector<HTMLElement>("[data-treatments-progress]");
  const cards = section ? [...section.querySelectorAll<HTMLElement>("[data-treatments-card]")] : [];
  if (!section || !stage || !viewport || !count || !progressBar || !cards.length) return () => {};

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

  let width = window.innerWidth;
  let height = window.innerHeight;
  let pointerX = width / 2;
  let pointerY = height / 2;
  let originX = width / 2;
  let originY = height / 2;
  let lastScrolled = 0;
  const revealDistance = () => height * REVEAL_SCREENS;

  const render = (progress: number) => {
    const scrolled = progress * revealDistance();
    // O círculo nasce de onde o cursor está quando a seção chega ao topo e fica
    // ali até a seção sair por cima
    if (scrolled <= 0 || lastScrolled <= 0) {
      originX = env.finePointer ? pointerX : width / 2;
      originY = env.finePointer ? pointerY : height / 2;
    }
    lastScrolled = scrolled;
    setCircle(stage, smoothstep(0, 1, progress), originX, originY, width, height);
  };

  const onPointerMove = (event: PointerEvent) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
  };
  window.addEventListener("pointermove", onPointerMove, { passive: true });

  const trigger = ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: () => `+=${revealDistance()}`,
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
  const revealAt = () => smoothstep(0, 1, (window.scrollY - trigger.start) / revealDistance());
  cleanups.push(
    registerNavThemeOverride("tratamentos", () => (revealAt() > 0.6 ? "light" : "dark")),
    registerScrollTarget("tratamentos", () => trigger.start + revealDistance()),
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
    start: () => `top+=${revealDistance() * CARDS_AT} top`,
    invalidateOnRefresh: true,
    onEnter: () => entrance.timeScale(1).play(),
    onLeaveBack: () => entrance.timeScale(2.2).reverse(),
  });
  // Recarregou a página já depois do ponto de entrada: cards prontos
  if (cardsTrigger.progress > 0 || window.scrollY > cardsTrigger.start) entrance.progress(1, false);

  return () => {
    cleanups.forEach((cleanup) => cleanup());
    cardsTrigger.kill();
    entrance.revert();
    trigger.kill();
    window.removeEventListener("pointermove", onPointerMove);
    stage.style.clipPath = "";
    section.removeAttribute("data-pinned");
  };
}
