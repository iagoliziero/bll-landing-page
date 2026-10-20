import Image from "next/image";
import { buttonClasses } from "@/components/buttonClasses";
import { treatments, treatmentsSection } from "@/data/content";

// Sem JavaScript, no mobile e com reduced motion, a faixa de cards rola na
// horizontal de forma nativa. No desktop, o efeito horizontalTrack fixa a seção
// (depois do círculo de entrada) e move a faixa conforme a rolagem.
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
        <div className="flex items-start justify-between gap-6 px-page pt-[clamp(76px,12vh,116px)]">
          <div>
            <h2 id="tratamentos-titulo" className="headline text-section text-tinta">
              <span data-elastic className="inline-block">
                {treatmentsSection.title}
              </span>
            </h2>
            <p className="mt-2 max-w-[360px] text-body text-secundario">{treatmentsSection.text}</p>
          </div>
          <p
            aria-hidden="true"
            className="hidden shrink-0 pt-2 text-right text-label text-secundario tabular-nums js:block"
          >
            <b data-treatments-count className="font-bold text-tinta">
              1
            </b>{" "}
            {treatmentsSection.counterSeparator} {treatments.length}
            <span className="mt-2 block h-[3px] w-[110px] overflow-hidden rounded-xs bg-linha">
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
          className="treatments-viewport mt-auto flex snap-x snap-mandatory overflow-x-auto pt-8 pb-[30px]"
        >
          <ul
            data-treatments-track
            className="treatments-track flex shrink-0 gap-[18px] px-page"
          >
            {treatments.map((treatment) => (
              <li
                key={treatment.id}
                data-treatments-card
                className="treatment-card relative flex w-[78vw] shrink-0 snap-start scroll-mx-[clamp(20px,4vw,64px)] flex-col overflow-hidden rounded-card border border-linha bg-white transition-colors duration-300 hover:border-verde-vivo sm:w-[clamp(262px,min(32vw,52vh),400px)]"
              >
                <div className="treatment-photo relative aspect-[16/10] overflow-hidden bg-menta">
                  <Image
                    src={treatment.image.src}
                    alt={treatment.image.alt}
                    fill
                    sizes="(max-width: 639px) 78vw, 400px"
                    className="object-cover"
                  />
                </div>
                <div className="relative z-[1] flex flex-1 flex-col px-[18px] pt-4 pb-[18px]">
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
