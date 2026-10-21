import type { Env } from "@/lib/env";
import { onFrame } from "@/lib/loop";

const INTERACTIVE = "a, button, input, select, label, [role=combobox], [role=option], [data-pain-marker]";

// Cursor de anel + ponto (mix-blend-mode difference). O anel segue o ponteiro
// com atraso e cresce sobre botões e links. Só com mouse e sem reduced motion.
export function initCursor(env: Env) {
  const ring = document.querySelector<HTMLElement>("[data-cursor-ring]");
  const dot = document.querySelector<HTMLElement>("[data-cursor-dot]");
  if (!env.finePointer || env.reducedMotion || !ring || !dot) return () => {};

  const root = document.documentElement;
  root.classList.add("has-cursor");
  let x = 0;
  let y = 0;
  let ringX = 0;
  let ringY = 0;
  let visible = false;

  const onMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    x = event.clientX;
    y = event.clientY;
    if (!visible) {
      visible = true;
      ringX = x;
      ringY = y;
      root.classList.add("cursor-visible");
    }
  };
  const onLeave = () => {
    visible = false;
    root.classList.remove("cursor-visible");
  };
  const onOver = (event: PointerEvent) => {
    ring.toggleAttribute("data-big", Boolean((event.target as Element).closest(INTERACTIVE)));
  };

  const stopFrame = onFrame((_, deltaTime) => {
    if (!visible) return;
    const follow = 1 - Math.pow(1 - 0.16, deltaTime * 60);
    ringX += (x - ringX) * follow;
    ringY += (y - ringY) * follow;
    ring.style.transform = `translate3d(${ringX.toFixed(1)}px, ${ringY.toFixed(1)}px, 0)`;
    dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  });

  document.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerover", onOver, { passive: true });
  root.addEventListener("pointerleave", onLeave);

  return () => {
    stopFrame();
    document.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerover", onOver);
    root.removeEventListener("pointerleave", onLeave);
    root.classList.remove("has-cursor", "cursor-visible");
  };
}
