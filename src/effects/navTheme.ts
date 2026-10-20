import { ScrollTrigger } from "gsap/ScrollTrigger";

type Theme = "dark" | "light";

// Linha de leitura: a navbar assume o tema da seção que passa a 28px do topo.
const LINE = 28;
const overrides = new Map<string, (rect: DOMRect) => Theme>();

// Seções cujo fundo muda com um efeito (círculos de entrada) informam o tema
// conforme o próprio estado.
export function registerNavThemeOverride(sectionId: string, resolve: (rect: DOMRect) => Theme) {
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
      const rect = section.getBoundingClientRect();
      if (rect.top <= LINE && rect.bottom > LINE) {
        const theme = overrides.get(section.id)?.(rect) ?? (section.dataset.navTheme as Theme);
        if (navbar.dataset.theme !== theme) navbar.dataset.theme = theme;
        return;
      }
    }
  };

  const trigger = ScrollTrigger.create({ start: 0, end: "max", onUpdate: update, onRefresh: update });
  update();
  return () => trigger.kill();
}
