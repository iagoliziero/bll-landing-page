import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import type { Env } from "@/lib/env";
import { TREATMENTS_CONTENT_AT } from "./treatmentsReveal";

// Cores do texto da postura na leitura guiada (tokens secundario e tinta)
const READ_FROM = "#4a5d58";
const READ_TO = "#10241f";
// Linhas escondidas abaixo (105) ou acima (-105) da máscara
const BELOW = 105;
const ABOVE = -105;

type Cleanup = () => void;
type LineOptions = { linesClass: string; start: string; delay: number; stagger: number };

// Efeitos nos textos ao rolar:
// - títulos das seções (data-elastic) sobem linha por linha de trás de uma máscara,
//   a mesma linguagem do título do hero;
// - introduções (data-reveal-lines) entram linha por linha logo depois;
// - os dois saem pelo lado em que deixam a tela (por cima ao descer, por baixo
//   ao subir) e entram de novo quando a seção volta;
// - o texto da postura (data-reveal-read) escurece palavra por palavra conforme
//   a rolagem, como uma leitura guiada, sempre entre duas cores com contraste AA;
// - os ângulos (data-count) contam de 0 até o valor, toda vez que entram.
// Com reduced motion, nada disso roda e o texto aparece pronto.
export function initTextReveal(env: Env) {
  if (env.reducedMotion) return () => {};
  gsap.registerPlugin(SplitText);

  const cleanups: Cleanup[] = [];
  const treatments = document.querySelector<HTMLElement>("[data-treatments]");

  // Trecho da rolagem em que cada texto fica à vista. Fora dos tratamentos: do
  // topo a 85% da tela até a base a 15% (perto do topo). Nos tratamentos, que
  // ficam fixos: de quando a frase de abertura sai até o palco subir 25% da tela.
  const rangeFor = (element: Element, start: string) =>
    treatments?.contains(element)
      ? {
          trigger: treatments,
          start: () => `top+=${window.innerHeight * TREATMENTS_CONTENT_AT} top`,
          // O título fica perto do topo do palco: sai quando chega à borda de cima
          end: "bottom 75%",
        }
      : { trigger: element, start, end: "bottom 15%" };

  const revealLines = (selector: string, options: LineOptions) => {
    document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
      let trigger: ScrollTrigger | undefined;
      const split = SplitText.create(element, {
        type: "lines",
        mask: "lines",
        linesClass: options.linesClass,
        tag: "span",
        aria: "none",
        autoSplit: true,
        // Roda na primeira divisão e de novo quando a largura muda (as linhas
        // são outras). As linhas novas continuam de onde as antigas estavam.
        onSplit: (self) => {
          const previous = trigger;
          trigger?.kill();
          const lines = self.lines;
          const show = () =>
            gsap.to(lines, {
              yPercent: 0,
              duration: 1,
              delay: options.delay,
              stagger: options.stagger,
              ease: "expo.out",
              overwrite: true,
            });
          const hide = (yPercent: number) =>
            gsap.to(lines, { yPercent, duration: 0.55, stagger: options.stagger / 2, ease: "power3.in", overwrite: true });

          trigger = ScrollTrigger.create({
            // data-reveal-start troca o ponto de partida (ex.: o contato, que
            // espera o círculo do painel descobrir o texto)
            ...rangeFor(element, element.dataset.revealStart ?? options.start),
            onEnter: show,
            onEnterBack: show,
            onLeave: () => hide(ABOVE),
            onLeaveBack: () => hide(BELOW),
          });

          // Estado de partida: à vista (sobe agora, ou já pronto se é uma
          // redivisão), já passou (acima) ou ainda não chegou (abaixo)
          if (trigger.isActive) {
            if (previous) gsap.set(lines, { yPercent: 0, overwrite: true });
            else {
              gsap.set(lines, { yPercent: BELOW });
              show();
            }
          } else gsap.set(lines, { yPercent: trigger.progress === 1 ? ABOVE : BELOW, overwrite: true });
        },
      });
      cleanups.push(() => {
        trigger?.kill();
        split.revert();
      });
    });
  };

  revealLines("[data-elastic]", { linesClass: "reveal-title-line", start: "top 85%", delay: 0, stagger: 0.08 });
  revealLines("[data-reveal-lines]", { linesClass: "reveal-text-line", start: "top 88%", delay: 0.15, stagger: 0.06 });

  // Leitura guiada do texto da postura. O scrub de 0,5s faz as palavras
  // alcançarem a rolagem com suavidade, em vez de saltar junto com ela.
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
            scrollTrigger: { trigger: element, start: "top 80%", end: "bottom 45%", scrub: 0.5 },
          },
        ),
    });
    cleanups.push(() => split.revert());
  });

  // Números que contam até o valor (ex.: "42°") toda vez que entram na tela
  document.querySelectorAll<HTMLElement>("[data-count]").forEach((element) => {
    const final = element.textContent ?? "";
    const target = parseInt(final, 10);
    const suffix = final.replace(/^\d+/, "");
    if (Number.isNaN(target)) return;
    const counter = { value: 0 };
    let counted = false;
    const write = () => (element.textContent = `${Math.round(counter.value)}${suffix}`);
    const run = () => {
      if (counted) return;
      counted = true;
      gsap.to(counter, { value: target, duration: 1.4, ease: "expo.out", onUpdate: write, overwrite: true });
    };
    // Zera só depois que o número sai da tela por inteiro, para ninguém vê-lo
    // voltar a 0
    const reset = () => {
      gsap.killTweensOf(counter);
      counted = false;
      counter.value = 0;
      write();
    };
    const count = ScrollTrigger.create({
      trigger: element,
      start: "top 85%",
      end: "bottom top",
      onEnter: run,
      onEnterBack: run,
    });
    const offscreen = ScrollTrigger.create({
      trigger: element,
      start: "top bottom",
      end: "bottom top",
      onLeave: reset,
      onLeaveBack: reset,
    });
    if (count.isActive) run();
    else write();
    cleanups.push(() => {
      count.kill();
      offscreen.kill();
      gsap.killTweensOf(counter);
      element.textContent = final;
    });
  });

  ScrollTrigger.refresh();
  return () => cleanups.reverse().forEach((cleanup) => cleanup());
}
