import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { painMapSection, painRegions, treatments } from "@/data/content";
import type { Env } from "@/lib/env";
import { onFrame } from "@/lib/loop";
import { clamp, easeOutCubic } from "@/lib/math";

// Depois de acender em vermelho, o ponto passa para verde vivo e pulsa.
const RELIEF_DELAY = 1.1;

// Onde dói? O corpo se desenha conforme a seção entra na tela. Ao escolher uma
// região (pelos botões, pelos pontos do corpo ou pelos chips do hero), a linha de
// escaneamento desliza até ela, o ponto acende em vermelho e, depois de 1,1s,
// passa para verde vivo. Com reduced motion, o ponto vai direto para o verde e
// a linha não desliza.
export function initPainMap(env: Env) {
  const section = document.querySelector<HTMLElement>("[data-pain-map]");
  const scan = section?.querySelector<SVGGElement>("[data-pain-scan]");
  const scanLabel = section?.querySelector<SVGTextElement>("[data-pain-scan-label]");
  const live = section?.querySelector<HTMLElement>("[data-pain-live]");
  if (!section || !scan || !scanLabel || !live) return () => {};

  const buttons = [...section.querySelectorAll<HTMLButtonElement>("[data-pain-button]")];
  const panels = [...section.querySelectorAll<HTMLElement>("[data-pain-panel]")];
  const markers = [...section.querySelectorAll<SVGGElement>("[data-pain-marker]")];
  const bodyPaths = [...section.querySelectorAll<SVGGeometryElement>(".pain-body-path")];

  const markerY = (id: string) => Number(markers.find((item) => item.dataset.painMarker === id)?.dataset.y ?? 0);

  let selected = painMapSection.defaultRegion as string;
  let scanY = markerY(selected);
  let relief: gsap.core.Tween | null = null;

  const select = (id: string) => {
    const region = painRegions.find((item) => item.id === id);
    if (!region) return;
    selected = id;
    buttons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.painButton === id)));
    panels.forEach((panel) => panel.toggleAttribute("data-on", panel.dataset.painPanel === id));
    markers.forEach((marker) => {
      marker.removeAttribute("data-relief");
      marker.toggleAttribute("data-on", marker.dataset.painMarker === id);
    });
    scanLabel.textContent = region.label;
    if (env.reducedMotion) scanY = markerY(id);

    relief?.kill();
    const marker = markers.find((item) => item.dataset.painMarker === id);
    relief = gsap.delayedCall(env.reducedMotion ? 0 : RELIEF_DELAY, () => marker?.setAttribute("data-relief", ""));

    const treatment = treatments.find((item) => item.id === region.treatment)?.name;
    live.textContent = `${region.title}. ${painMapSection.treatmentLabel} ${treatment}.`;
  };

  // Botões das regiões e pontos do corpo
  const onClick = (event: MouseEvent) => {
    const target = (event.target as Element).closest<HTMLElement | SVGGElement>("[data-pain-button], [data-pain-marker]");
    const id = target?.dataset.painButton ?? target?.dataset.painMarker;
    if (id) select(id);
  };
  // Chips do hero (efeito actions)
  const onSelectRegion = (event: Event) => select((event as CustomEvent<{ region: string }>).detail.region);

  section.addEventListener("click", onClick);
  document.addEventListener("bll:select-region", onSelectRegion);

  // O corpo se desenha traço por traço enquanto a seção entra na tela
  const draw = (progress: number) => {
    bodyPaths.forEach((path, index) => {
      path.style.strokeDashoffset = (1 - easeOutCubic(clamp(progress * 1.6 - index * 0.08))).toFixed(4);
    });
  };
  const drawTrigger = ScrollTrigger.create({
    trigger: section,
    start: "top bottom-=80",
    end: () => `+=${window.innerHeight * 0.6}`,
    onUpdate: (self) => draw(self.progress),
    onRefresh: (self) => draw(self.progress),
  });

  // A linha de escaneamento desliza até a região escolhida
  let inView = false;
  const visibility = ScrollTrigger.create({
    trigger: section,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => {
      inView = self.isActive;
    },
  });
  const stopFrame = onFrame((_, deltaTime) => {
    if (!inView) return;
    const target = markerY(selected);
    if (Math.abs(target - scanY) < 0.05) return;
    scanY += (target - scanY) * Math.min(1, deltaTime * 6);
    scan.setAttribute("transform", `translate(0 ${scanY.toFixed(1)})`);
  });

  return () => {
    stopFrame();
    relief?.kill();
    drawTrigger.kill();
    visibility.kill();
    section.removeEventListener("click", onClick);
    document.removeEventListener("bll:select-region", onSelectRegion);
    bodyPaths.forEach((path) => (path.style.strokeDashoffset = ""));
  };
}
