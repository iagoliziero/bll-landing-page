import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import type { Env } from "@/lib/env";

// Cores do texto da postura na leitura guiada (tokens secundario e tinta)
const READ_FROM = "#4a5d58";
const READ_TO = "#10241f";
// Nos tratamentos, o título sobe quando o círculo de entrada (1,1 tela) chega
// perto da metade, para a subida acontecer à vista.
const TREATMENTS_REVEAL_AT = 1.1 * 0.45;

type Cleanup = () => void;

// Efeitos nos textos ao rolar:
// - títulos das seções (data-elastic) sobem linha por linha de trás de uma máscara,
//   a mesma linguagem do título do hero;
// - introduções (data-reveal-lines) entram linha por linha logo depois;
// - o texto da postura (data-reveal-read) escurece palavra por palavra conforme
//   a rolagem, como uma leitura guiada, sempre entre duas cores com contraste AA;
// - os ângulos (data-count) contam de 0 até o valor.
// Com reduced motion, nada disso roda e o texto aparece pronto.
export function initTextReveal(env: Env) {
  if (env.reducedMotion) return () => {};
  gsap.registerPlugin(SplitText);

  const cleanups: Cleanup[] = [];
  const treatments = document.querySelector<HTMLElement>("[data-treatments]");

  // Onde cada texto começa a entrar: na própria posição, ou, dentro dos
  // tratamentos (fixos), pela rolagem do círculo de entrada.
  const triggerFor = (element: Element, start: string) =>
    treatments?.contains(element)
      ? { trigger: treatments, start: () => `top+=${window.innerHeight * TREATMENTS_REVEAL_AT} top`, once: true }
      : { trigger: element, start, once: true };

  const reveal = (selector: string, options: { linesClass: string; start: string; delay: number; stagger: number }) => {
    document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
      const split = SplitText.create(element, {
        type: "lines",
        mask: "lines",
        linesClass: options.linesClass,
        tag: "span",
        aria: "none",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 105,
            duration: 1,
            delay: options.delay,
            stagger: options.stagger,
            ease: "expo.out",
            // data-reveal-start troca o ponto de partida (ex.: o contato, que
            // espera o círculo do painel descobrir o texto)
            scrollTrigger: triggerFor(element, element.dataset.revealStart ?? options.start),
          }),
      });
      cleanups.push(() => split.revert());
    });
  };

  reveal("[data-elastic]", { linesClass: "reveal-title-line", start: "top 85%", delay: 0, stagger: 0.08 });
  reveal("[data-reveal-lines]", { linesClass: "reveal-text-line", start: "top 88%", delay: 0.15, stagger: 0.06 });

  // Leitura guiada do texto da postura
  document.querySelectorAll<HTMLElement>("[data-reveal-read]").forEach((element) => {
    const split = SplitText.create(element, {
      type: "words",
      tag: "span",
      aria: "none",
      autoSplit: true,
      onSplit: (self) =>
        gsap.fromTo(
          self.words,
          { color: READ_FROM },
          {
            color: READ_TO,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: { trigger: element, start: "top 80%", end: "bottom 45%", scrub: true },
          },
        ),
    });
    cleanups.push(() => split.revert());
  });

  // Números que contam até o valor (ex.: "42°")
  document.querySelectorAll<HTMLElement>("[data-count]").forEach((element) => {
    const final = element.textContent ?? "";
    const target = parseInt(final, 10);
    const suffix = final.replace(/^\d+/, "");
    if (Number.isNaN(target)) return;
    const counter = { value: 0 };
    const tween = gsap.to(counter, {
      value: target,
      duration: 1.4,
      ease: "expo.out",
      onUpdate: () => (element.textContent = `${Math.round(counter.value)}${suffix}`),
      scrollTrigger: { trigger: element, start: "top 85%", once: true },
    });
    element.textContent = `0${suffix}`;
    cleanups.push(() => {
      tween.scrollTrigger?.kill();
      tween.kill();
      element.textContent = final;
    });
  });

  ScrollTrigger.refresh();
  return () => cleanups.reverse().forEach((cleanup) => cleanup());
}
