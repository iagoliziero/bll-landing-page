import { ScrollTrigger } from "gsap/ScrollTrigger";
import { onFrame } from "@/lib/loop";

type Theme = "dark" | "light";

// Linha de leitura: a navbar assume o tema da seção que passa a 28px do topo.
const LINE = 28;
const overrides = new Map<string, (rect: DOMRect, line: number) => Theme>();

// Seções cujo fundo muda com um efeito (círculos de entrada) informam o tema
// conforme o próprio estado.
export function registerNavThemeOverride(sectionId: string, resolve: (rect: DOMRect, line: number) => Theme) {
  overrides.set(sectionId, resolve);
  return () => {
    if (overrides.get(sectionId) === resolve) overrides.delete(sectionId);
  };
}

export function initNavTheme() {
  const navbar = document.querySelector<HTMLElement>("[data-navbar]");
  const sections = [...document.querySelectorAll<HTMLElement>("[data-nav-theme]")];
  if (!navbar) return () => {};

  const update = () => {
    for (const section of sections) {
      // Uma seção fixada pelo ScrollTrigger ocupa também o espaço do pin-spacer
      const parent = section.parentElement;
      const box = parent?.classList.contains("pin-spacer") ? parent : section;
      const rect = box.getBoundingClientRect();
      if (rect.top <= LINE && rect.bottom > LINE) {
        const theme = overrides.get(section.id)?.(rect, LINE) ?? (section.dataset.navTheme as Theme);
        if (navbar.dataset.theme !== theme) navbar.dataset.theme = theme;
        return;
      }
    }
  };

  // A rolagem só marca o tema como desatualizado. O cálculo acontece no quadro
  // seguinte do ticker, depois que todos os gatilhos e pins já se atualizaram.
  let dirty = true;
  const markDirty = () => {
    dirty = true;
  };
  const trigger = ScrollTrigger.create({ start: 0, end: "max", onUpdate: markDirty, onRefresh: markDirty });
  const stopFrame = onFrame(() => {
    if (!dirty) return;
    dirty = false;
    update();
  });

  return () => {
    stopFrame();
    trigger.kill();
  };
}
