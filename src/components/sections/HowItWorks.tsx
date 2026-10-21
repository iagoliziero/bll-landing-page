import type { CSSProperties } from "react";
import { howItWorks } from "@/data/content";

// Posição de cada ponto na linha, em % da largura (centro de cada coluna).
const stops = [12.5, 37.5, 62.5, 87.5];

// A linha se preenche conforme as etapas atravessam a tela (efeito timeline).
// No desktop ela corre na horizontal, sobre as quatro colunas; no mobile, as
// etapas ficam em uma coluna e a linha corre na vertical, ao lado delas.
// Sem JavaScript, ela já aparece cheia e as quatro etapas acesas.
export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      tabIndex={-1}
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
        <p data-reveal-lines className="mt-2 text-body text-secundario">
          {howItWorks.text}
        </p>
      </div>

      <div className="relative mt-[clamp(36px,7vh,64px)] max-sm:pl-12">
        <div
          data-timeline
          aria-hidden="true"
          className="timeline absolute inset-y-0 left-2.5 w-0.75 rounded-xs bg-linha sm:relative sm:inset-auto sm:h-0.75 sm:w-auto"
        >
          <i data-timeline-fill className="timeline-fill" />
          {stops.map((stop) => (
            <b
              key={stop}
              data-timeline-stop={stop}
              data-on=""
              className="timeline-stop"
              style={{ "--stop": `${stop}%` } as CSSProperties}
            />
          ))}
          <em data-timeline-runner className="timeline-runner" />
        </div>

        <ol data-timeline-list className="grid gap-9 sm:mt-6.5 sm:grid-cols-4 sm:gap-4.5">
          {howItWorks.steps.map((step, index) => (
            <li key={step.title} data-timeline-step data-on="" className="timeline-step">
              <span
                aria-hidden="true"
                className="timeline-number block text-number leading-[0.9] font-extrabold tracking-[-0.04em] text-verde"
              >
                {index + 1}
              </span>
              <h3 className="timeline-title mt-2 mb-1.5 text-card-title font-bold tracking-[-0.02em] text-tinta">
                {step.title}
              </h3>
              <p className="text-body text-secundario">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
