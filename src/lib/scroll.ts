import type Lenis from "lenis";

let lenis: Lenis | null = null;
const targets = new Map<string, () => number>();

export function setSmoothScroller(instance: Lenis | null) {
  lenis = instance;
}

export function getSmoothScroller() {
  return lenis;
}

// Seções com efeito podem pedir um ponto de chegada diferente do topo, por
// exemplo os tratamentos, que pulam o círculo de entrada e param nos cards.
export function registerScrollTarget(id: string, getTop: () => number) {
  targets.set(id, getTop);
  return () => {
    if (targets.get(id) === getTop) targets.delete(id);
  };
}

export function scrollToSection(id: string, onArrive?: () => void) {
  const section = document.getElementById(id);
  if (!section) return;
  const top = targets.get(id)?.() ?? section.getBoundingClientRect().top + window.scrollY;
  const arrive = () => {
    section.focus({ preventScroll: true });
    onArrive?.();
  };

  if (lenis) {
    const distance = Math.abs(top - window.scrollY);
    lenis.scrollTo(top, {
      duration: Math.min(2, 0.9 + distance / 5000),
      easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2),
      onComplete: arrive,
    });
  } else {
    window.scrollTo(0, top);
    arrive();
  }
}
