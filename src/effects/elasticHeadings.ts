import type { Env } from "@/lib/env";
import { onFrame } from "@/lib/loop";
import { clamp } from "@/lib/math";

// Títulos elásticos: os títulos das seções esticam (até 12% na vertical,
// encolhendo 22% disso na horizontal) conforme a velocidade da rolagem e voltam
// com mola amortecida (rigidez 170, amortecimento 13). A origem fica do lado do
// sentido da rolagem. Desligado com reduced motion.
const STIFFNESS = 170;
const DAMPING = 13;
const MAX_STRETCH = 0.12;

export function initElasticHeadings(env: Env) {
  const headings = [...document.querySelectorAll<HTMLElement>("[data-elastic]")];
  if (env.reducedMotion || !headings.length) return () => {};

  let lastScrollY = window.scrollY;
  let velocity = 0;
  let stretch = 0;
  let speed = 0;
  let resting = true;

  const stopFrame = onFrame((_, deltaTime) => {
    const steps = Math.max(deltaTime * 60, 0.0001);
    const delta = (window.scrollY - lastScrollY) / steps;
    lastScrollY = window.scrollY;
    velocity += (delta - velocity) * (1 - Math.pow(0.75, steps));

    const target = clamp(velocity * 0.0035, -MAX_STRETCH, MAX_STRETCH);
    speed += ((target - stretch) * STIFFNESS - speed * DAMPING) * deltaTime;
    stretch += speed * deltaTime;

    const amount = Math.abs(stretch);
    if (amount < 0.0008) {
      if (!resting) {
        headings.forEach((heading) => (heading.style.transform = ""));
        resting = true;
      }
      return;
    }
    resting = false;
    const origin = stretch > 0 ? "50% 0" : "50% 100%";
    const transform = `scaleY(${(1 + amount).toFixed(4)}) scaleX(${(1 - amount * 0.22).toFixed(4)})`;
    headings.forEach((heading) => {
      heading.style.transformOrigin = origin;
      heading.style.transform = transform;
    });
  });

  return () => {
    stopFrame();
    headings.forEach((heading) => {
      heading.style.transform = "";
      heading.style.transformOrigin = "";
    });
  };
}
