import { gsap } from "gsap";
import type { Env } from "@/lib/env";

// Como funciona: a linha se preenche conforme as etapas atravessam a tela. A
// bolinha corre na ponta, e cada ponto "salta" e acende a sua etapa ao ser
// alcançado. O scrub de 0,6s faz a linha alcançar a rolagem com suavidade.
// - Desktop (linha na horizontal): começa quando as etapas aparecem na base da
//   tela (topo da lista a 90%) e termina 0,68 tela depois, com a seção inteira
//   à vista.
// - Mobile (etapas em coluna, linha na vertical ao lado): a ponta da linha
//   acompanha a altura de 65% da tela, e cada etapa acende quando o seu número
//   chega lá.
export function initTimeline(env: Env) {
  const section = document.querySelector<HTMLElement>("[data-how-it-works]");
  const line = section?.querySelector<HTMLElement>("[data-timeline]");
  const fill = section?.querySelector<HTMLElement>("[data-timeline-fill]");
  const runner = section?.querySelector<HTMLElement>("[data-timeline-runner]");
  const list = section?.querySelector<HTMLElement>("[data-timeline-list]");
  if (!section || !line || !fill || !runner || !list) return () => {};
  const stops = [...section.querySelectorAll<HTMLElement>("[data-timeline-stop]")];
  const steps = [...section.querySelectorAll<HTMLElement>("[data-timeline-step]")];
  const vertical = env.mobile;

  // Posição de cada ponto na linha, de 0 a 1, e o comprimento da linha
  let positions: number[] = [];
  let length = 0;

  const measure = () => {
    if (vertical) {
      // A linha vai do número da primeira etapa ao da última, e cada ponto fica
      // na altura do número da sua etapa. offsetTop ignora o deslocamento das
      // etapas apagadas.
      const centers = steps.map((step) => {
        const number = step.querySelector<HTMLElement>(".timeline-number");
        return step.offsetTop + (number?.offsetHeight ?? 0) / 2;
      });
      const first = centers[0] ?? 0;
      length = Math.max(1, (centers[centers.length - 1] ?? 0) - first);
      line.style.top = `${first}px`;
      line.style.bottom = "auto";
      line.style.height = `${length}px`;
      positions = centers.map((center, index) => {
        stops[index]?.style.setProperty("--stop", `${center - first}px`);
        return (center - first) / length;
      });
    } else {
      length = line.clientWidth;
      positions = stops.map((stop) => Number(stop.dataset.timelineStop) / 100);
    }
  };

  const render = (progress: number) => {
    const distance = (progress * length).toFixed(1);
    fill.style.transform = vertical ? `scaleY(${progress.toFixed(4)})` : `scaleX(${progress.toFixed(4)})`;
    runner.style.transform = vertical ? `translate3d(0, ${distance}px, 0)` : `translate3d(${distance}px, 0, 0)`;
    positions.forEach((position, index) => {
      // O primeiro ponto do mobile fica no começo da linha (posição 0): só acende
      // quando a linha começa a andar
      const on = progress >= Math.max(position - 0.01, 0.001);
      stops[index]?.toggleAttribute("data-on", on);
      steps[index]?.toggleAttribute("data-on", on);
    });
  };

  const state = { progress: 0 };
  const tween = gsap.to(state, {
    progress: 1,
    ease: "none",
    onUpdate: () => render(state.progress),
    scrollTrigger: vertical
      ? { trigger: line, start: "top 65%", end: "bottom 65%", scrub: 0.6, onRefreshInit: measure }
      : {
          trigger: list,
          start: "top 90%",
          end: () => `+=${window.innerHeight * 0.68}`,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onRefreshInit: measure,
        },
  });
  measure();
  render(state.progress);

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
    fill.style.transform = "";
    runner.style.transform = "";
    line.style.top = "";
    line.style.bottom = "";
    line.style.height = "";
    if (vertical) stops.forEach((stop) => stop.style.setProperty("--stop", `${stop.dataset.timelineStop}%`));
    [...stops, ...steps].forEach((element) => element.setAttribute("data-on", ""));
  };
}
