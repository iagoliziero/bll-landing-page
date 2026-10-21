import type { Env } from "@/lib/env";

// Holofote verde que segue o cursor em cada card de tratamento, e o brilho na
// foto (--mx/--my, em px a partir do canto do card, os mesmos para os dois). Só
// com mouse. A inclinação 3D e o movimento da foto vêm do efeito horizontalTrack.
export function initCardSpotlight(env: Env) {
  if (!env.finePointer) return () => {};
  const cards = [...document.querySelectorAll<HTMLElement>("[data-treatments-card]")];

  const removers = cards.map((card) => {
    const onMove = (event: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${(event.clientX - rect.left).toFixed(0)}px`);
      card.style.setProperty("--my", `${(event.clientY - rect.top).toFixed(0)}px`);
    };
    card.addEventListener("pointermove", onMove);
    return () => {
      card.removeEventListener("pointermove", onMove);
      ["--mx", "--my"].forEach((name) => card.style.removeProperty(name));
    };
  });

  return () => removers.forEach((remove) => remove());
}
