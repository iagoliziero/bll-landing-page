import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Env } from "@/lib/env";
import { smoothstep } from "@/lib/math";
import { registerScrollTarget } from "@/lib/scroll";
import { registerNavThemeOverride } from "./navTheme";

// O painel do contato abre ao longo de 1,3 altura de tela de rolagem.
const CONTACT_SCREENS = 1.3;
// Os links para o contato param 0,45 tela para dentro da seção, com o painel
// já aberto e o formulário à vista.
const CONTACT_LANDING = 0.45;

// Recorte circular que nasce em (x, y) e cresce até cobrir um elemento de
// width × height. Usado na entrada dos tratamentos e no painel do contato.
export function setCircle(
  element: HTMLElement,
  progress: number,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  if (progress >= 1) {
    element.style.clipPath = "none";
    return;
  }
  const full = Math.hypot(Math.max(x, width - x), Math.max(y, height - y)) * 1.02;
  element.style.clipPath = `circle(${(progress * full).toFixed(1)}px at ${x.toFixed(0)}px ${y.toFixed(0)}px)`;
}

// Contato: sobre o fundo menta, o painel verde se abre em um círculo que nasce da
// base visível da seção, com smoothstep. Com reduced motion, o círculo vira fade.
export function initContactReveal(env: Env) {
  const section = document.querySelector<HTMLElement>("[data-contact]");
  const panel = section?.querySelector<HTMLElement>("[data-contact-panel]");
  if (!section || !panel) return () => {};

  const sectionTop = () => section.getBoundingClientRect().top + window.scrollY;
  const removeTarget = registerScrollTarget("contato", () => sectionTop() + window.innerHeight * CONTACT_LANDING);

  if (env.reducedMotion) {
    section.setAttribute("data-fade", "");
    const fade = ScrollTrigger.create({
      trigger: section,
      start: "top 75%",
      onEnter: () => section.setAttribute("data-visible", ""),
    });
    return () => {
      removeTarget();
      fade.kill();
      section.removeAttribute("data-fade");
      section.removeAttribute("data-visible");
    };
  }

  // Quanto da seção já está à vista, de 0 até 1,3 tela
  const progressAt = (visible: number) => smoothstep(0, 1, visible / (window.innerHeight * CONTACT_SCREENS));
  const render = (visible: number) => {
    const width = panel.offsetWidth;
    const height = panel.offsetHeight;
    setCircle(panel, progressAt(visible), width / 2, Math.min(height, Math.max(0, visible)), width, height);
  };

  const trigger = ScrollTrigger.create({
    trigger: section,
    start: "top bottom",
    end: () => `+=${window.innerHeight * CONTACT_SCREENS}`,
    onUpdate: (self) => render(self.progress * window.innerHeight * CONTACT_SCREENS),
    onRefresh: (self) => render(self.progress * window.innerHeight * CONTACT_SCREENS),
  });

  // A página acaba antes de 1,3 tela de rolagem quando o painel é mais baixo que
  // isso. Nesse caso, a seção fica fixa com a base no fim da tela pelo que falta,
  // o círculo termina de abrir e só então o rodapé entra.
  const pin = ScrollTrigger.create({
    trigger: section,
    start: "bottom bottom",
    end: () => `+=${Math.max(0, window.innerHeight * CONTACT_SCREENS - section.offsetHeight)}`,
    pin: true,
    invalidateOnRefresh: true,
  });

  // A navbar fica clara sobre o menta e escurece quando o círculo cobre a linha
  // de leitura no centro da tela. Usa a posição real do painel, que fica parado
  // no fim da tela enquanto a seção está fixa.
  const removeOverride = registerNavThemeOverride("contato", (_, line) => {
    const panelRect = panel.getBoundingClientRect();
    const lineInPanel = line - panelRect.top;
    if (lineInPanel < 0) return "light";
    const visible = window.scrollY - trigger.start;
    const progress = progressAt(visible);
    if (progress >= 1) return "dark";
    const originY = Math.min(panelRect.height, visible);
    const full = Math.hypot(panelRect.width / 2, Math.max(originY, panelRect.height - originY)) * 1.02;
    return progress * full >= originY - lineInPanel ? "dark" : "light";
  });

  return () => {
    removeTarget();
    removeOverride();
    pin.kill();
    trigger.kill();
    panel.style.clipPath = "";
  };
}
