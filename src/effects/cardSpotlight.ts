import type { Env } from "@/lib/env";

// Holofote verde que segue o cursor em cada card de tratamento (--mx/--my), e a
// foto que se move por dentro do card (--ix/--iy). Só com mouse; com reduced
// motion o holofote fica e a foto não se move.
export function initCardSpotlight(env: Env) {
  if (!env.finePointer) return () => {};
  const cards = [...document.querySelectorAll<HTMLElement>("[data-treatments-card]")];

  const removers = cards.map((card) => {
    const onMove = (event: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      card.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
      card.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
      if (!env.reducedMotion) {
        card.style.setProperty("--ix", `${((x - 0.5) * -16).toFixed(1)}px`);
        card.style.setProperty("--iy", `${((y - 0.5) * -10).toFixed(1)}px`);
      }
    };
    const onLeave = () => {
      card.style.setProperty("--ix", "0px");
      card.style.setProperty("--iy", "0px");
    };
    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerleave", onLeave);
    return () => {
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerleave", onLeave);
      ["--mx", "--my", "--ix", "--iy"].forEach((name) => card.style.removeProperty(name));
    };
  });

  return () => removers.forEach((remove) => remove());
}
