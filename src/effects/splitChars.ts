import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Env } from "@/lib/env";
import { clamp, easeOutCubic } from "@/lib/math";

// O título do contato entra letra por letra, subindo e girando, depois que o
// círculo do painel já abriu bem: de 0,55 a 1,15 tela da seção à vista.
// As letras já vêm divididas do servidor (Contact.tsx).
export function initSplitChars(env: Env) {
  const section = document.querySelector<HTMLElement>("[data-contact]");
  const chars = section ? [...section.querySelectorAll<HTMLElement>("[data-split] .split-char")] : [];
  if (!section || !chars.length || env.reducedMotion) return () => {};

  const render = (progress: number) => {
    const visible = progress * window.innerHeight * 1.3;
    const entrance = clamp((visible - window.innerHeight * 0.55) / (window.innerHeight * 0.6));
    chars.forEach((char, index) => {
      const q = easeOutCubic(clamp((entrance - (index / chars.length) * 0.5) / 0.5));
      char.style.transform = q >= 1 ? "none" : `translate3d(0, ${((1 - q) * 110).toFixed(1)}%, 0) rotate(${((1 - q) * 12).toFixed(2)}deg)`;
    });
  };

  const trigger = ScrollTrigger.create({
    trigger: section,
    start: "top bottom",
    end: () => `+=${window.innerHeight * 1.3}`,
    onUpdate: (self) => render(self.progress),
    onRefresh: (self) => render(self.progress),
  });

  return () => {
    trigger.kill();
    chars.forEach((char) => (char.style.transform = ""));
  };
}
