import { howItWorks } from "@/data/content";

// Posição de cada ponto na linha, em % da largura (centro de cada coluna).
const stops = [12.5, 37.5, 62.5, 87.5];

// A linha se preenche conforme a seção atravessa a tela (efeito timeline).
// Sem JavaScript, ela já aparece cheia e as quatro etapas acesas.
export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      data-how-it-works
      data-nav-theme="light"
      aria-labelledby="como-funciona-titulo"
      className="relative bg-white px-page pt-[clamp(90px,14vh,140px)] pb-[clamp(70px,10vh,110px)]"
    >
      <div>
        <h2 id="como-funciona-titulo" className="headline text-section text-tinta">
          <span data-elastic className="inline-block">
            {howItWorks.title}
          </span>
        </h2>
        <p className="mt-2 text-body text-secundario">{howItWorks.text}</p>
      </div>

      <div
        data-timeline
        aria-hidden="true"
        className="timeline relative mt-[clamp(36px,7vh,64px)] h-[3px] rounded-xs bg-linha"
      >
        <i data-timeline-fill className="timeline-fill" />
        {stops.map((stop) => (
          <b key={stop} data-timeline-stop data-on="" className="timeline-stop" style={{ left: `${stop}%` }} />
        ))}
        <em data-timeline-runner className="timeline-runner" />
      </div>

      <ol className="mt-[26px] grid grid-cols-2 gap-[18px] sm:grid-cols-4">
        {howItWorks.steps.map((step, index) => (
          <li key={step.title} data-timeline-step data-on="" className="timeline-step">
            <span
              aria-hidden="true"
              className="block text-number leading-[0.9] font-extrabold tracking-[-0.04em] text-verde"
            >
              {index + 1}
            </span>
            <h3 className="mt-2 mb-1.5 text-card-title font-bold tracking-[-0.02em] text-tinta">
              {step.title}
            </h3>
            <p className="text-body text-secundario">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
