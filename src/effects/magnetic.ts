import type { Env } from "@/lib/env";
import { onFrame } from "@/lib/loop";

type Magnet = { el: HTMLElement; x: number; y: number; targetX: number; targetY: number };

// Botões magnéticos: puxados na direção do ponteiro enquanto ele está por cima
// (22% do deslocamento na horizontal e 28% na vertical) e voltam ao soltar.
export function initMagnetic(env: Env) {
  if (!env.finePointer || env.reducedMotion) return () => {};

  const magnets: Magnet[] = [...document.querySelectorAll<HTMLElement>("[data-magnetic]")].map((el) => ({
    el,
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  }));

  const listeners = magnets.map((magnet) => {
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = magnet.el.getBoundingClientRect();
      magnet.targetX = (event.clientX - rect.left - rect.width / 2) * 0.22;
      magnet.targetY = (event.clientY - rect.top - rect.height / 2) * 0.28;
    };
    const onLeave = () => {
      magnet.targetX = 0;
      magnet.targetY = 0;
    };
    magnet.el.addEventListener("pointermove", onMove);
    magnet.el.addEventListener("pointerleave", onLeave);
    return () => {
      magnet.el.removeEventListener("pointermove", onMove);
      magnet.el.removeEventListener("pointerleave", onLeave);
      magnet.el.style.transform = "";
    };
  });

  const stopFrame = onFrame((_, deltaTime) => {
    const follow = 1 - Math.pow(1 - 0.15, deltaTime * 60);
    for (const magnet of magnets) {
      const dx = magnet.targetX - magnet.x;
      const dy = magnet.targetY - magnet.y;
      if (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05) {
        if (magnet.targetX === 0 && magnet.targetY === 0 && magnet.x !== 0) {
          magnet.x = magnet.y = 0;
          magnet.el.style.transform = "";
        }
        continue;
      }
      magnet.x += dx * follow;
      magnet.y += dy * follow;
      magnet.el.style.transform = `translate3d(${magnet.x.toFixed(2)}px, ${magnet.y.toFixed(2)}px, 0)`;
    }
  });

  return () => {
    stopFrame();
    listeners.forEach((remove) => remove());
  };
}
