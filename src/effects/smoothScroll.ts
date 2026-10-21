import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Env } from "@/lib/env";
import { onFrame } from "@/lib/loop";
import { setSmoothScroller } from "@/lib/scroll";

// Scroll suave da janela com Lenis, dirigido pelo gsap.ticker e sincronizado com
// o ScrollTrigger. Com reduced motion, a rolagem fica nativa.
export function initSmoothScroll(env: Env) {
  if (env.reducedMotion) return () => {};

  const lenis = new Lenis({ autoRaf: false, lerp: 0.1 });
  lenis.on("scroll", ScrollTrigger.update);
  const stopFrame = onFrame((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  setSmoothScroller(lenis);

  return () => {
    stopFrame();
    setSmoothScroller(null);
    lenis.destroy();
    gsap.ticker.lagSmoothing(500, 33);
  };
}
