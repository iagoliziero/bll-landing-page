import { ScrollTrigger } from "gsap/ScrollTrigger";
import { onFrame } from "@/lib/loop";

type Theme = "dark" | "light";
type Box = { top: number; bottom: number };

// Linha de leitura: a navbar assume o tema da seção que passa a 28px do topo.
const LINE = 28;
const overrides = new Map<string, (box: Box, line: number) => Theme>();

// Seções cujo fundo muda com um efeito (círculos de entrada) informam o tema
// conforme o próprio estado. box vem em coordenadas da tela.
export function registerNavThemeOverride(sectionId: string, resolve: (box: Box, line: number) => Theme) {
  overrides.set(sectionId, resolve);
  return () => {
    if (overrides.get(sectionId) === resolve) overrides.delete(sectionId);
  };
}

export function initNavTheme() {
  const navbar = document.querySelector<HTMLElement>("[data-navbar]");
  const sections = [...document.querySelectorAll<HTMLElement>("[data-nav-theme]")];
  if (!navbar) return () => {};

  // Posição de cada seção na página, medida só quando o layout muda (refresh do
  // ScrollTrigger). Medir a cada quadro obrigaria o navegador a recalcular o
  // layout no meio da animação.
  let boxes: (Box & { section: HTMLElement })[] = [];
  const measure = () => {
    boxes = sections.map((section) => {
      // Uma seção fixada pelo ScrollTrigger ocupa também o espaço do pin-spacer
      const parent = section.parentElement;
      const box = parent?.classList.contains("pin-spacer") ? parent : section;
      const rect = box.getBoundingClientRect();
      return { section, top: rect.top + window.scrollY, bottom: rect.bottom + window.scrollY };
    });
  };

  const update = () => {
    const y = window.scrollY + LINE;
    const match = boxes.find((box) => box.top <= y && box.bottom > y);
    if (!match) return;
    const onScreen = { top: match.top - window.scrollY, bottom: match.bottom - window.scrollY };
    const theme = overrides.get(match.section.id)?.(onScreen, LINE) ?? (match.section.dataset.navTheme as Theme);
    if (navbar.dataset.theme !== theme) navbar.dataset.theme = theme;
  };

  // A rolagem só marca o tema como desatualizado. O cálculo acontece no quadro
  // seguinte do ticker, depois que todos os gatilhos e pins já se atualizaram.
  let dirty = true;
  const markDirty = () => {
    dirty = true;
  };
  const onRefresh = () => {
    measure();
    dirty = true;
  };
  ScrollTrigger.addEventListener("refresh", onRefresh);
  const trigger = ScrollTrigger.create({ start: 0, end: "max", onUpdate: markDirty });
  measure();
  const stopFrame = onFrame(() => {
    if (!dirty) return;
    dirty = false;
    update();
  });

  return () => {
    stopFrame();
    trigger.kill();
    ScrollTrigger.removeEventListener("refresh", onRefresh);
  };
}
