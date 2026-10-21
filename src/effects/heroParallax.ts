import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Env } from "@/lib/env";
import { smoothstep } from "@/lib/math";

// Parallax na rolagem do hero: a foto desce a 35% da velocidade e cresce até 8%,
// e o texto sobe a 18% e esmaece. Com reduced motion, só o esmaecimento fica.
export function initHeroParallax(env: Env) {
  const hero = document.querySelector<HTMLElement>("[data-hero]");
  const photo = document.querySelector<HTMLElement>("[data-hero-parallax]");
  const content = document.querySelector<HTMLElement>("[data-hero-content]");
  if (!hero || !photo || !content) return () => {};

  // Altura do hero medida só no refresh, não a cada quadro
  let heroHeight = hero.offsetHeight;
  const apply = (progress: number) => {
    const scrolled = progress * heroHeight;
    if (!env.reducedMotion) {
      photo.style.transform = `translate3d(0, ${(scrolled * 0.35).toFixed(1)}px, 0) scale(${(1 + progress * 0.08).toFixed(4)})`;
      content.style.transform = `translate3d(0, ${(-scrolled * 0.18).toFixed(1)}px, 0)`;
    }
    content.style.opacity = (1 - smoothstep(0.25, 0.8, progress)).toFixed(3);
  };

  const trigger = ScrollTrigger.create({
    trigger: hero,
    start: "top top",
    end: "bottom top",
    onUpdate: (self) => apply(self.progress),
    onRefresh: (self) => {
      heroHeight = hero.offsetHeight;
      apply(self.progress);
    },
  });

  return () => {
    trigger.kill();
    photo.style.transform = "";
    content.style.transform = "";
    content.style.opacity = "";
  };
}
