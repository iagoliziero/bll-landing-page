import { ScrollTrigger } from "gsap/ScrollTrigger";

// O botão fixo aparece depois de 70% do hero e some quando o contato ocupa
// 60% da tela.
export function initFab() {
  const fab = document.querySelector<HTMLElement>("[data-fab]");
  const hero = document.querySelector<HTMLElement>("[data-hero]");
  const contact = document.querySelector<HTMLElement>("[data-contact]");
  if (!fab || !hero || !contact) return () => {};

  const update = () => {
    const heroRect = hero.getBoundingClientRect();
    const passedHero = -heroRect.top > heroRect.height * 0.7;
    const beforeContact = contact.getBoundingClientRect().top > window.innerHeight * 0.4;
    fab.toggleAttribute("data-on", passedHero && beforeContact);
  };

  const trigger = ScrollTrigger.create({ start: 0, end: "max", onUpdate: update, onRefresh: update });
  update();
  return () => {
    trigger.kill();
    fab.removeAttribute("data-on");
  };
}
