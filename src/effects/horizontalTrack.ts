import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Env } from "@/lib/env";
import { onFrame } from "@/lib/loop";
import { clamp, inverseSmoothstep, smoothstep } from "@/lib/math";
import { getSmoothScroller, registerScrollTarget } from "@/lib/scroll";
import { setCircle } from "./circleReveal";
import { registerNavThemeOverride } from "./navTheme";

// Círculo de entrada: 1,1 altura de tela de rolagem. O tempo é proposital,
// para o efeito ser visto.
const REVEAL_SCREENS = 1.1;
// Depois do círculo, a faixa corre por 1,2 vez o quanto os cards passam da tela.
const TRACK_FACTOR = 1.2;
// Pausa no último card antes de soltar a seção.
const HOLD_SCREENS = 0.3;

type Cleanup = () => void;

// Tratamentos. No desktop: a seção fica fixa, abre em um círculo que nasce do
// cursor e depois a faixa de cards corre na horizontal, com inclinação 3D por
// card e skew pela velocidade da rolagem. No mobile: só o círculo fixa a seção
// e a faixa rola de forma nativa com snap. Com reduced motion: sem fixar, o
// círculo vira fade e a faixa rola de forma nativa.
export function initHorizontalTrack(env: Env) {
  const section = document.querySelector<HTMLElement>("[data-treatments]");
  const stage = section?.querySelector<HTMLElement>("[data-treatments-stage]");
  const viewport = section?.querySelector<HTMLElement>("[data-treatments-viewport]");
  const track = section?.querySelector<HTMLElement>("[data-treatments-track]");
  const count = section?.querySelector<HTMLElement>("[data-treatments-count]");
  const progressBar = section?.querySelector<HTMLElement>("[data-treatments-progress]");
  const cards = section ? [...section.querySelectorAll<HTMLElement>("[data-treatments-card]")] : [];
  if (!section || !stage || !viewport || !track || !count || !progressBar || !cards.length) return () => {};

  const cleanups: Cleanup[] = [];
  let active = -1;
  const setActive = (index: number) => {
    if (index === active) return;
    active = index;
    count.textContent = String(index + 1);
    progressBar.style.transform = `scaleX(${((index + 1) / cards.length).toFixed(3)})`;
  };

  // Contador quando a faixa rola de forma nativa: o card cuja borda esquerda
  // está mais perto do ponto de snap (a margem da página)
  const followNativeScroll = () => {
    const onScroll = () => {
      const snapPoint = viewport.getBoundingClientRect().left + parseFloat(getComputedStyle(track).paddingLeft);
      let nearest = 0;
      let best = Infinity;
      cards.forEach((card, index) => {
        const distance = Math.abs(card.getBoundingClientRect().left - snapPoint);
        if (distance < best) {
          best = distance;
          nearest = index;
        }
      });
      setActive(nearest);
    };
    viewport.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => viewport.removeEventListener("scroll", onScroll);
  };

  if (env.reducedMotion) {
    section.setAttribute("data-fade", "");
    const fade = ScrollTrigger.create({
      trigger: section,
      start: "top 75%",
      onEnter: () => section.setAttribute("data-visible", ""),
    });
    cleanups.push(followNativeScroll(), () => {
      fade.kill();
      section.removeAttribute("data-fade");
      section.removeAttribute("data-visible");
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  }

  const horizontal = !env.mobile;
  if (horizontal) section.setAttribute("data-pinned", "");
  else cleanups.push(followNativeScroll());

  let width = window.innerWidth;
  let height = window.innerHeight;
  let travel = 0;
  let cardCenters: number[] = [];
  let pointerX = width / 2;
  let pointerY = height / 2;
  let originX = width / 2;
  let originY = height / 2;
  let lastScrolled = 0;
  let trackProgress = 0;
  let trackX = 0;

  const revealDistance = () => height * REVEAL_SCREENS;
  const total = () => revealDistance() + (horizontal ? travel * TRACK_FACTOR + height * HOLD_SCREENS : 0);

  const measure = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    track.style.transform = "";
    travel = horizontal ? Math.max(0, track.scrollWidth - width) : 0;
    cardCenters = cards.map((card) => card.offsetLeft + card.offsetWidth / 2);
  };

  const render = (progress: number) => {
    const scrolled = progress * total();
    // O círculo nasce de onde o cursor está quando a seção chega ao topo
    // (do centro no toque) e fica ali até a seção sair por cima.
    if (scrolled <= 0 || lastScrolled <= 0) {
      originX = env.finePointer ? pointerX : width / 2;
      originY = env.finePointer ? pointerY : height / 2;
    }
    lastScrolled = scrolled;
    const reveal = smoothstep(0, 1, scrolled / revealDistance());
    setCircle(stage, reveal, originX, originY, width, height);
    if (horizontal) {
      trackProgress = smoothstep(0, 1, (scrolled - revealDistance()) / Math.max(1, travel * TRACK_FACTOR));
      trackX = -trackProgress * travel;
      // O contador segue o progresso da faixa: 1 de 4 no começo, 4 de 4 no fim
      setActive(Math.round(trackProgress * (cards.length - 1)));
    }
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
    onRefreshInit: measure,
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

  if (horizontal) {
    let inView = false;
    const visibility = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => {
        inView = self.isActive;
      },
    });

    let lastScrollY = window.scrollY;
    let velocity = 0;
    let skew = 0;
    const stopFrame = onFrame((_, deltaTime) => {
      if (!inView) return;
      const steps = Math.max(deltaTime * 60, 0.0001);
      const delta = (window.scrollY - lastScrollY) / steps;
      lastScrollY = window.scrollY;
      velocity += (delta - velocity) * (1 - Math.pow(0.75, steps));
      skew += (clamp(velocity * 0.08, -5, 5) - skew) * (1 - Math.pow(0.88, steps));
      track.style.transform = `translate3d(${trackX.toFixed(1)}px, 0, 0) skewX(${(-skew).toFixed(2)}deg)`;

      // Cada card inclina conforme a distância do centro da tela
      cards.forEach((card, index) => {
        const relative = (cardCenters[index] + trackX - width / 2) / width;
        card.style.transform = `rotateY(${(relative * -16).toFixed(2)}deg) translateZ(${(-Math.abs(relative) * 50).toFixed(1)}px)`;
      });
    });

    // Teclado: ao focar um card fora da tela, o navegador rolaria o palco por
    // dentro. Em vez disso, a página rola até o ponto em que o card fica no centro.
    const onFocus = (event: FocusEvent) => {
      const card = (event.target as Element).closest<HTMLElement>("[data-treatments-card]");
      if (!card) return;
      stage.scrollLeft = 0;
      viewport.scrollLeft = 0;
      const index = cards.indexOf(card);
      const progress = travel ? clamp((cardCenters[index] - width / 2) / travel) : 0;
      const target = trigger.start + revealDistance() + inverseSmoothstep(progress) * travel * TRACK_FACTOR;
      const lenis = getSmoothScroller();
      if (lenis) lenis.scrollTo(target, { immediate: true });
      else window.scrollTo(0, target);
    };
    track.addEventListener("focusin", onFocus);

    cleanups.push(() => {
      stopFrame();
      visibility.kill();
      track.removeEventListener("focusin", onFocus);
      track.style.transform = "";
      cards.forEach((card) => (card.style.transform = ""));
    });
  }

  return () => {
    cleanups.forEach((cleanup) => cleanup());
    trigger.kill();
    window.removeEventListener("pointermove", onPointerMove);
    stage.style.clipPath = "";
    section.removeAttribute("data-pinned");
  };
}
