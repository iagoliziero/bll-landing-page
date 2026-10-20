import { ScrollTrigger } from "gsap/ScrollTrigger";

// Como funciona: a linha se preenche conforme a seção atravessa a tela. Começa
// quando o topo da seção está 140px acima da base da tela e termina 0,7 tela
// depois. A bolinha corre na ponta, e cada ponto "salta" e acende a sua etapa
// ao ser alcançado.
export function initTimeline() {
  const section = document.querySelector<HTMLElement>("[data-how-it-works]");
  const line = section?.querySelector<HTMLElement>("[data-timeline]");
  const fill = section?.querySelector<HTMLElement>("[data-timeline-fill]");
  const runner = section?.querySelector<HTMLElement>("[data-timeline-runner]");
  if (!section || !line || !fill || !runner) return () => {};
  const stops = [...section.querySelectorAll<HTMLElement>("[data-timeline-stop]")];
  const steps = [...section.querySelectorAll<HTMLElement>("[data-timeline-step]")];
  const positions = stops.map((stop) => parseFloat(stop.style.left) / 100);

  const render = (progress: number) => {
    fill.style.transform = `scaleX(${progress.toFixed(4)})`;
    runner.style.transform = `translate3d(${(progress * line.clientWidth).toFixed(1)}px, 0, 0)`;
    positions.forEach((position, index) => {
      const on = progress >= position - 0.01;
      stops[index].toggleAttribute("data-on", on);
      steps[index]?.toggleAttribute("data-on", on);
    });
  };

  const trigger = ScrollTrigger.create({
    trigger: section,
    start: "top bottom-=140",
    end: () => `+=${window.innerHeight * 0.7}`,
    onUpdate: (self) => render(self.progress),
    onRefresh: (self) => render(self.progress),
  });

  return () => {
    trigger.kill();
    fill.style.transform = "";
    runner.style.transform = "";
    [...stops, ...steps].forEach((element) => element.setAttribute("data-on", ""));
  };
}
