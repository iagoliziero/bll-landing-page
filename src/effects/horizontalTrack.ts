import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Env } from "@/lib/env";
import { onFrame } from "@/lib/loop";
import { clamp, easeOutCubic, smoothstep } from "@/lib/math";
import { getSmoothScroller, registerScrollTarget } from "@/lib/scroll";
import { setCircle } from "./circleReveal";
import { registerNavThemeOverride } from "./navTheme";

// Círculo de entrada: 1,1 altura de tela de rolagem. O tempo é proposital,
// para o efeito ser visto.
const REVEAL_SCREENS = 1.1;
// Depois do círculo, a faixa anda 1px para cada 1px de rolagem: a página nunca
// parece presa.
const TRACK_FACTOR = 1;
// Pausa curta no último card antes de soltar a seção.
const HOLD_SCREENS = 0.15;
// Carrossel 3D: quanto cada card gira e recua por card de distância do centro
const ROTATE_PER_CARD = 22;
const DEPTH_PER_CARD = 110;

type Cleanup = () => void;

// Cada card guarda a posição do cursor sobre ele (-0,5 a 0,5), a inclinação
// suavizada que segue o cursor e o último estilo escrito (só reescreve o que muda)
type CardState = {
  card: HTMLElement;
  photo: HTMLElement | null;
  hoverX: number;
  hoverY: number;
  tiltX: number;
  tiltY: number;
  transform: string;
  photoTransform: string;
};

// Entrada dos cards junto com o círculo: um depois do outro, cada card sobe do
// fundo deitado para trás e se endireita
const entranceAt = (reveal: number, index: number) => easeOutCubic(clamp((reveal - 0.12 - index * 0.1) / 0.55));

// Tratamentos. No desktop: a seção fica fixa, abre em um círculo que nasce do
// cursor, e a faixa de cards corre na horizontal como um carrossel 3D: o card
// do centro fica de frente e os outros giram e recuam. No mobile: só o círculo
// fixa a seção, e a faixa rola de forma nativa com snap, com o mesmo giro 3D.
// Com mouse, o card sob o cursor inclina na direção dele. Com reduced motion:
// sem fixar, o círculo vira fade e a faixa rola de forma nativa, sem 3D.
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

  if (env.reducedMotion) {
    section.setAttribute("data-fade", "");
    const fade = ScrollTrigger.create({
      trigger: section,
      start: "top 75%",
      onEnter: () => section.setAttribute("data-visible", ""),
    });
    const onScroll = () => {
      const step = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : 1;
      setActive(clamp(Math.round(viewport.scrollLeft / step), 0, cards.length - 1));
    };
    viewport.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      fade.kill();
      viewport.removeEventListener("scroll", onScroll);
      section.removeAttribute("data-fade");
      section.removeAttribute("data-visible");
    };
  }

  const horizontal = !env.mobile;
  if (horizontal) section.setAttribute("data-pinned", "");

  let width = window.innerWidth;
  let height = window.innerHeight;
  let travel = 0;
  // Distância entre dois cards (largura + espaço) e recuo da faixa
  let step = 1;
  let padding = 0;
  let cardCenters: number[] = [];
  let pointerX = width / 2;
  let pointerY = height / 2;
  let originX = width / 2;
  let originY = height / 2;
  let lastScrolled = 0;
  let reveal = 0;
  // Posição da faixa no desktop, em cards (0 = primeiro card no centro)
  let position = 0;

  const revealDistance = () => height * REVEAL_SCREENS;
  const total = () => revealDistance() + (horizontal ? travel * TRACK_FACTOR + height * HOLD_SCREENS : 0);

  const measure = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    track.style.transform = "";
    travel = horizontal ? Math.max(0, track.scrollWidth - width) : 0;
    step = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : 1;
    padding = parseFloat(getComputedStyle(track).paddingLeft);
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
    reveal = smoothstep(0, 1, scrolled / revealDistance());
    setCircle(stage, reveal, originX, originY, width, height);
    if (horizontal && travel > 0) {
      // A faixa anda na mesma velocidade da rolagem, com um leve assentamento
      // em cada card (metade linear, metade smoothstep): desacelera perto do
      // centro de cada um sem nunca parar
      const steps = cards.length - 1;
      const linear = clamp((scrolled - revealDistance()) / (travel * TRACK_FACTOR)) * steps;
      const index = Math.min(Math.floor(linear), steps - 1);
      const t = linear - index;
      position = index + (t + smoothstep(0, 1, t)) / 2;
      setActive(Math.round(position));
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

  // Inclinação que segue o cursor sobre cada card
  const states: CardState[] = cards.map((card) => ({
    card,
    photo: card.querySelector<HTMLElement>(".treatment-photo img"),
    hoverX: 0,
    hoverY: 0,
    tiltX: 0,
    tiltY: 0,
    transform: "",
    photoTransform: "",
  }));
  if (env.finePointer) {
    states.forEach((state) => {
      const onMove = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        const rect = state.card.getBoundingClientRect();
        state.hoverX = (event.clientX - rect.left) / rect.width - 0.5;
        state.hoverY = (event.clientY - rect.top) / rect.height - 0.5;
      };
      const onLeave = () => {
        state.hoverX = 0;
        state.hoverY = 0;
      };
      state.card.addEventListener("pointermove", onMove);
      state.card.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        state.card.removeEventListener("pointermove", onMove);
        state.card.removeEventListener("pointerleave", onLeave);
      });
    });
  }

  // Mobile: o card no ponto de snap (a margem da página) é o ativo
  if (!horizontal) {
    const onScroll = () => setActive(clamp(Math.round(viewport.scrollLeft / step), 0, cards.length - 1));
    viewport.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    cleanups.push(() => viewport.removeEventListener("scroll", onScroll));
  }

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
  let trackTransform = "";
  const stopFrame = onFrame((_, deltaTime) => {
    if (!inView) return;
    const steps = Math.max(deltaTime * 60, 0.0001);
    const follow = 1 - Math.pow(0.86, steps);

    let trackX = 0;
    if (horizontal) {
      const delta = (window.scrollY - lastScrollY) / steps;
      lastScrollY = window.scrollY;
      velocity += (delta - velocity) * (1 - Math.pow(0.75, steps));
      skew += (clamp(velocity * 0.06, -3, 3) - skew) * (1 - Math.pow(0.88, steps));
      trackX = cards.length > 1 ? -(position / (cards.length - 1)) * travel : 0;
      const transform = `translate3d(${trackX.toFixed(1)}px, 0, 0) skewX(${(-skew).toFixed(2)}deg)`;
      if (transform !== trackTransform) {
        trackTransform = transform;
        track.style.transform = transform;
      }
    }
    // No mobile, a faixa nativa não tem perspectiva compartilhada: cada card leva a sua
    const prefix = horizontal ? "" : "perspective(1000px) ";
    const scrollLeft = horizontal ? 0 : viewport.scrollLeft;

    states.forEach((state, index) => {
      state.tiltX += (-state.hoverY * 12 - state.tiltX) * follow;
      state.tiltY += (state.hoverX * 14 - state.tiltY) * follow;

      // Distância do card até o centro (desktop) ou até o ponto de snap
      // (mobile), em cards
      const relative = horizontal
        ? (cardCenters[index] + trackX - width / 2) / step
        : (cards[index].offsetLeft - scrollLeft - padding) / step;
      const distance = clamp(relative, -2, 2);
      const enter = entranceAt(reveal, index);
      const rotateY = distance * (horizontal ? ROTATE_PER_CARD : 16) + state.tiltY;
      const rotateX = (1 - enter) * 26 + state.tiltX;
      const z = -Math.abs(distance) * (horizontal ? DEPTH_PER_CARD : 60) - (1 - enter) * 200;
      const y = (1 - enter) * 170;
      const transform = `${prefix}translate3d(0, ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotateY(${rotateY.toFixed(2)}deg) rotateX(${rotateX.toFixed(2)}deg)`;
      // A foto corre por dentro do card ao contrário do movimento (parallax) e
      // acompanha a inclinação
      const photoX = clamp(distance, -1, 1) * -20 - (state.tiltY / 14) * 14;
      const photoY = (state.tiltX / 12) * 10;
      const photoTransform = `scale(1.18) translate3d(${photoX.toFixed(1)}px, ${photoY.toFixed(1)}px, 0)`;

      if (transform !== state.transform) {
        state.transform = transform;
        state.card.style.transform = transform;
      }
      if (state.photo && photoTransform !== state.photoTransform) {
        state.photoTransform = photoTransform;
        state.photo.style.transform = photoTransform;
      }
    });
  });

  // Teclado no desktop: ao focar um card fora da tela, o navegador rolaria o
  // palco por dentro. Em vez disso, a página rola até o ponto em que o card fica
  // no centro.
  if (horizontal) {
    const onFocus = (event: FocusEvent) => {
      const card = (event.target as Element).closest<HTMLElement>("[data-treatments-card]");
      if (!card) return;
      stage.scrollLeft = 0;
      viewport.scrollLeft = 0;
      const index = cards.indexOf(card);
      const target = trigger.start + revealDistance() + (index / Math.max(1, cards.length - 1)) * travel * TRACK_FACTOR;
      const lenis = getSmoothScroller();
      if (lenis) lenis.scrollTo(target, { immediate: true });
      else window.scrollTo(0, target);
    };
    track.addEventListener("focusin", onFocus);
    cleanups.push(() => track.removeEventListener("focusin", onFocus));
  }

  return () => {
    cleanups.forEach((cleanup) => cleanup());
    stopFrame();
    visibility.kill();
    trigger.kill();
    window.removeEventListener("pointermove", onPointerMove);
    stage.style.clipPath = "";
    track.style.transform = "";
    states.forEach((state) => {
      state.card.style.transform = "";
      if (state.photo) state.photo.style.transform = "";
    });
    section.removeAttribute("data-pinned");
  };
}
