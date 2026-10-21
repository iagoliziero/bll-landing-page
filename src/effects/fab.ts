import { ScrollTrigger } from "gsap/ScrollTrigger";
import { onFrame } from "@/lib/loop";

// O botão fixo aparece depois de 70% do hero e some quando o contato ocupa
// 60% da tela. No desktop, enquanto os tratamentos fixos estão na tela, ele fica
// escondido: cobriria o botão dos cards (cada card já tem o seu). Assim, no
// desktop ele aparece logo depois dos tratamentos, sem piscar no caminho.
export function initFab() {
  const fab = document.querySelector<HTMLElement>("[data-fab]");
  const hero = document.querySelector<HTMLElement>("[data-hero]");
  const contact = document.querySelector<HTMLElement>("[data-contact]");
  const treatments = document.querySelector<HTMLElement>("[data-treatments]");
  if (!fab || !hero || !contact || !treatments) return () => {};

  // Posições na página, medidas só quando o layout muda
  let heroHeight = 0;
  let contactTop = 0;
  let treatmentsTop = 0;
  let treatmentsBottom = 0;
  const measure = () => {
    const y = window.scrollY;
    heroHeight = hero.offsetHeight;
    const contactBox = contact.parentElement?.classList.contains("pin-spacer") ? contact.parentElement : contact;
    contactTop = contactBox.getBoundingClientRect().top + y;
    const treatmentsRect = treatments.getBoundingClientRect();
    treatmentsTop = treatmentsRect.top + y;
    treatmentsBottom = treatmentsRect.bottom + y;
  };

  const update = () => {
    const y = window.scrollY;
    const height = window.innerHeight;
    const passedHero = y > heroHeight * 0.7;
    const beforeContact = contactTop - y > height * 0.4;
    const overPinnedCards =
      treatments.hasAttribute("data-pinned") && treatmentsTop - y < height && treatmentsBottom - y > 0;
    fab.toggleAttribute("data-on", passedHero && beforeContact && !overPinnedCards);
  };

  // Calcula no quadro seguinte, depois dos pins
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
    fab.removeAttribute("data-on");
  };
}
