import Image from "next/image";
import { buttonClasses } from "@/components/buttonClasses";
import { treatments, treatmentsSection } from "@/data/content";

// No mobile, a faixa de cards rola na horizontal de forma nativa, com snap e
// contador. No tablet e no desktop, os quatro cards ficam à vista em grade (duas
// e quatro colunas). O efeito treatmentsReveal abre a seção em um círculo, acende
// a frase de abertura palavra por palavra e depois faz os cards entrarem.
// A frase só aparece com o efeito ligado (sem JavaScript ou com reduced motion,
// a seção abre direto nos cards).
export function Treatments() {
  return (
    <section
      id="tratamentos"
      tabIndex={-1}
      data-treatments
      data-nav-theme="light"
      aria-labelledby="tratamentos-titulo"
      className="relative bg-verde"
    >
      <div
        data-treatments-stage
        className="treatments-stage relative flex min-h-dvh flex-col overflow-hidden bg-fundo"
      >
        <div
          data-treatments-speech
          className="treatments-speech pointer-events-none absolute inset-x-0 top-0 z-2 h-dvh items-center px-page"
        >
          <p className="max-w-[22ch] text-[clamp(28px,4vw,60px)] leading-[1.12] font-bold tracking-[-0.03em] text-tinta">
            {treatmentsSection.statement}
          </p>
        </div>

        <div className="flex items-start justify-between gap-6 px-page pt-[clamp(76px,12vh,116px)]">
          <div>
            <h2 id="tratamentos-titulo" className="headline text-section text-tinta">
              <span data-elastic className="inline-block">
                {treatmentsSection.title}
              </span>
            </h2>
            <p data-reveal-lines className="mt-2 max-w-90 text-body text-secundario">
              {treatmentsSection.text}
            </p>
          </div>
          <p
            aria-hidden="true"
            data-treatments-counter
            className="hidden shrink-0 pt-2 text-right text-label text-secundario tabular-nums js:max-sm:block"
          >
            <b data-treatments-count className="font-bold text-tinta">
              1
            </b>{" "}
            {treatmentsSection.counterSeparator} {treatments.length}
            <span className="mt-2 block h-0.75 w-27.5 overflow-hidden rounded-xs bg-linha">
              <span
                data-treatments-progress
                className="block h-full origin-left bg-verde"
                style={{ transform: `scaleX(${1 / treatments.length})` }}
              />
            </span>
          </p>
        </div>

        <div
          data-treatments-viewport
          className="treatments-viewport mt-auto flex snap-x snap-mandatory overflow-x-auto pt-8 pb-24 sm:block sm:overflow-visible sm:pb-7.5"
        >
          <ul
            data-treatments-track
            className="treatments-track flex shrink-0 gap-4.5 px-page sm:grid sm:grid-cols-2 lg:grid-cols-4"
          >
            {treatments.map((treatment) => (
              <li
                key={treatment.id}
                data-treatments-card
                className="treatment-card relative flex w-[78vw] shrink-0 snap-start scroll-mx-[clamp(20px,4vw,64px)] flex-col overflow-hidden rounded-card border border-linha bg-white sm:w-auto"
              >
                <div data-treatments-photo className="treatment-photo relative aspect-16/10 overflow-hidden bg-menta">
                  <Image
                    src={treatment.image.src}
                    alt={treatment.image.alt}
                    fill
                    sizes="(max-width: 639px) 78vw, (max-width: 1023px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div data-treatments-body className="relative z-1 flex flex-1 flex-col px-4.5 pt-4 pb-4.5">
                  <h3 className="mb-2 text-card-heading font-extrabold tracking-[-0.03em] text-tinta">
                    {treatment.name}
                  </h3>
                  <p className="text-body text-secundario">{treatment.description}</p>
                  <p className="mt-2 mb-3.5 text-body text-tinta">
                    <b className="font-bold text-verde">{treatmentsSection.goalLabel}</b> {treatment.goal}
                  </p>
                  <a
                    href="#contato"
                    data-pick={treatment.name}
                    data-magnetic
                    className={buttonClasses("accent", "sm", "mt-auto self-start")}
                  >
                    {treatmentsSection.cta}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
