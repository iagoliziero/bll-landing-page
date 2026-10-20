import { ScrollTrigger } from "gsap/ScrollTrigger";
import { easeInOutCubic, smoothstep } from "@/lib/math";

// Postura: a divisória varre da direita para a esquerda (de 312 até 8, no viewBox
// de 320) entre 30% e 68% da passagem da seção pela tela, trocando o antes
// pelo depois.
const START_X = 312;
const SWEEP = 304;

export function initPostureWipe() {
  const section = document.querySelector<HTMLElement>("[data-posture]");
  const before = section?.querySelector<SVGRectElement>("[data-posture-before]");
  const after = section?.querySelector<SVGRectElement>("[data-posture-after]");
  const divider = section?.querySelector<SVGLineElement>("[data-posture-divider]");
  const handle = section?.querySelector<SVGGElement>("[data-posture-handle]");
  if (!section || !before || !after || !divider || !handle) return () => {};

  const render = (progress: number) => {
    const x = (START_X - SWEEP * easeInOutCubic(smoothstep(0.3, 0.68, progress))).toFixed(1);
    before.setAttribute("width", x);
    after.setAttribute("x", x);
    after.setAttribute("width", (320 - Number(x)).toFixed(1));
    divider.setAttribute("x1", x);
    divider.setAttribute("x2", x);
    handle.setAttribute("transform", `translate(${x} 190)`);
  };

  const trigger = ScrollTrigger.create({
    trigger: section,
    start: "top bottom",
    end: "bottom top",
    onUpdate: (self) => render(self.progress),
    onRefresh: (self) => render(self.progress),
  });

  return () => {
    trigger.kill();
    before.setAttribute("width", "320");
    after.setAttribute("x", "0");
    after.setAttribute("width", "320");
  };
}
