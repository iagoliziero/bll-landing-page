import { gpuTier, type Env } from "@/lib/env";
import type { HeroLiquid } from "@/scenes/heroLiquid";

// Liga a foto líquida do hero (src/scenes/heroLiquid.ts), carregada sob demanda.
// No toque, com reduced motion ou em GPU fraca, a foto fica estática.
// A cena só renderiza com o hero visível e só substitui a foto depois de
// desenhar o primeiro quadro.
export function initLiquidPhoto(env: Env) {
  const hero = document.querySelector<HTMLElement>("[data-hero]");
  const frame = document.querySelector<HTMLElement>("[data-hero-parallax]");
  const photo = frame?.querySelector("img");
  if (env.reducedMotion || !env.finePointer || !hero || !frame || !photo) return () => {};

  let cancelled = false;
  let scene: HeroLiquid | null = null;
  let canvas: HTMLCanvasElement | null = null;
  let observer: IntersectionObserver | null = null;

  const start = async () => {
    if (gpuTier() !== "high") return;
    if (!photo.complete) await new Promise((resolve) => photo.addEventListener("load", resolve, { once: true }));
    const { createHeroLiquid } = await import("@/scenes/heroLiquid");

    // A textura é a mesma versão que a foto escolheu no srcset (mesmo domínio).
    const texture = new Image();
    texture.src = photo.currentSrc || photo.src;
    await texture.decode();
    if (cancelled) return;

    canvas = document.createElement("canvas");
    canvas.className = "hero-media hero-canvas";
    canvas.setAttribute("aria-hidden", "true");
    photo.after(canvas);
    scene = createHeroLiquid({ canvas, image: texture, frame, position: [0.6, 0.6] });
    if (!scene) {
      canvas.remove();
      return;
    }

    const activeScene = scene;
    observer = new IntersectionObserver(([entry]) => activeScene.setVisible(entry.isIntersecting));
    observer.observe(hero);
    hero.setAttribute("data-gl", "");
  };

  start().catch(() => {});

  return () => {
    cancelled = true;
    observer?.disconnect();
    scene?.destroy();
    canvas?.remove();
    hero.removeAttribute("data-gl");
  };
}
