import { ScrollTrigger } from "gsap/ScrollTrigger";

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

  const update = () => {
    const heroRect = hero.getBoundingClientRect();
    const passedHero = -heroRect.top > heroRect.height * 0.7;
    const beforeContact = contact.getBoundingClientRect().top > window.innerHeight * 0.4;
    const treatmentsRect = treatments.getBoundingClientRect();
    const overPinnedCards =
      treatments.hasAttribute("data-pinned") &&
      treatmentsRect.top < window.innerHeight &&
      treatmentsRect.bottom > 0;
    fab.toggleAttribute("data-on", passedHero && beforeContact && !overPinnedCards);
  };

  const trigger = ScrollTrigger.create({ start: 0, end: "max", onUpdate: update, onRefresh: update });
  update();
  return () => {
    trigger.kill();
    fab.removeAttribute("data-on");
  };
}
