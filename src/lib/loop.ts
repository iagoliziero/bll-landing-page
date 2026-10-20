import { gsap } from "gsap";

type FrameCallback = (time: number, deltaTime: number) => void;

// Todo efeito quadro a quadro assina o gsap.ticker por aqui. Nenhum outro
// requestAnimationFrame no site: Lenis, ScrollTrigger, WebGL, cursor e molas
// andam no mesmo quadro. time e deltaTime em segundos.
export function onFrame(callback: FrameCallback) {
  const tick = (time: number, deltaTimeMs: number) => callback(time, Math.min(deltaTimeMs / 1000, 0.05));
  gsap.ticker.add(tick);
  return () => gsap.ticker.remove(tick);
}
