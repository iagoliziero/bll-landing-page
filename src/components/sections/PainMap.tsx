import { buttonClasses } from "@/components/buttonClasses";
import { painMapSection, painRegions, treatments, type RegionId } from "@/data/content";

// Posição de cada ponto no corpo (coordenadas do viewBox 0 0 200 430).
const markers: Record<RegionId, { x: number; y: number }> = {
  mandibula: { x: 100, y: 60 },
  pescoco: { x: 100, y: 84 },
  ombro: { x: 140, y: 100 },
  costas: { x: 100, y: 196 },
  joelho: { x: 114, y: 316 },
  tornozelo: { x: 114, y: 394 },
};

// Corpo em traço fino: cabeça, tronco, ombros, quadril, braços e pernas.
const bodyPaths = [
  "M100 68V222",
  "M60 100H140",
  "M80 222H120",
  "M60 100L50 170L44 238",
  "M140 100L150 170L156 238",
  "M88 222L86 316L86 398H74",
  "M112 222L114 316L114 398H126",
];

const treatmentName = (id: string) => treatments.find((treatment) => treatment.id === id)?.name ?? "";

// Sem JavaScript, as seis regiões aparecem em lista. Com JavaScript, o efeito
// painMap mostra uma por vez, escolhida pelos botões ou pelos pontos do corpo.
export function PainMap() {
  const selected = painMapSection.defaultRegion;
  const selectedLabel = painRegions.find((region) => region.id === selected)?.label;

  return (
    <section
      id="onde-doi"
      tabIndex={-1}
      data-pain-map
      data-nav-theme="dark"
      aria-labelledby="onde-doi-titulo"
      className="relative bg-verde px-page pt-[clamp(90px,14vh,140px)] pb-[clamp(70px,10vh,110px)] text-white"
    >
      <div>
        <h2 id="onde-doi-titulo" className="headline text-section">
          <span data-elastic className="inline-block">
            {painMapSection.title}
          </span>
        </h2>
        <p className="mt-2 text-body text-white/80">{painMapSection.text}</p>
      </div>

      <div className="mt-6 grid grid-cols-1 items-center gap-[clamp(24px,5vw,80px)] sm:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
        <div className="mx-auto w-full max-w-35 sm:max-w-47.5">
          <svg viewBox="0 0 200 430" aria-hidden="true" className="pain-figure block h-auto w-full overflow-visible">
            <defs>
              <radialGradient id="dor-halo">
                <stop offset="0" stopColor="#FF6B5B" stopOpacity="0.85" />
                <stop offset="1" stopColor="#FF6B5B" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="alivio-halo">
                <stop offset="0" stopColor="#2FD47F" stopOpacity="0.75" />
                <stop offset="1" stopColor="#2FD47F" stopOpacity="0" />
              </radialGradient>
            </defs>
            <g className="pain-body">
              <circle className="pain-body-path" pathLength={1} cx="100" cy="44" r="24" />
              {bodyPaths.map((d) => (
                <path key={d} className="pain-body-path" pathLength={1} d={d} />
              ))}
            </g>
            <g>
              {painRegions.map((region) => (
                <g
                  key={region.id}
                  data-pain-marker={region.id}
                  data-y={markers[region.id].y}
                  data-on={region.id === selected ? "" : undefined}
                  data-relief={region.id === selected ? "" : undefined}
                  className="pain-marker"
                  transform={`translate(${markers[region.id].x} ${markers[region.id].y})`}
                >
                  <circle className="pain-halo-red" r="22" fill="url(#dor-halo)" />
                  <circle className="pain-halo-green" r="22" fill="url(#alivio-halo)" />
                  <circle className="pain-hit" r="14" />
                  <circle className="pain-ring" r="9" />
                  <circle className="pain-dot" r="4.5" />
                </g>
              ))}
            </g>
            <g data-pain-scan transform={`translate(0 ${markers[selected].y})`}>
              <line className="pain-scan-line" x1="-24" y1="0" x2="224" y2="0" />
              <text data-pain-scan-label className="pain-scan-label" x="228" y="4">
                {selectedLabel}
              </text>
            </g>
          </svg>
          <div aria-hidden="true" className="mt-3.5 flex justify-center gap-3.5 text-caption text-white/75">
            <span className="flex items-center gap-1.5">
              <i className="block size-2 rounded-full bg-dor" />
              {painMapSection.legend.pain}
            </span>
            <span className="flex items-center gap-1.5">
              <i className="block size-2 rounded-full bg-verde-vivo" />
              {painMapSection.legend.relief}
            </span>
          </div>
        </div>

        <div>
          <div role="group" aria-label="Regiões do corpo" className="hidden flex-wrap gap-2 js:flex">
            {painRegions.map((region) => (
              <button
                key={region.id}
                type="button"
                data-pain-button={region.id}
                aria-pressed={region.id === selected}
                className="min-h-11 rounded-full border border-white/30 px-4 text-body font-semibold text-white/85 transition-colors duration-300 hover:border-white aria-pressed:border-white aria-pressed:bg-white aria-pressed:text-verde focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {region.label}
              </button>
            ))}
          </div>
          <p data-pain-live aria-live="polite" className="sr-only" />
          <div className="pain-panels mt-5.5 flex flex-col gap-10">
            {painRegions.map((region) => (
              <div
                key={region.id}
                data-pain-panel={region.id}
                data-on={region.id === selected ? "" : undefined}
                className="pain-panel"
              >
                <h3 className="headline mb-2 text-panel">{region.title}</h3>
                <p className="max-w-110 text-lead text-white/88">{region.description}</p>
                <p className="my-3.5 text-label text-white">
                  {painMapSection.treatmentLabel}{" "}
                  <b className="font-bold text-verde-vivo-claro">{treatmentName(region.treatment)}</b>
                </p>
                <a
                  href="#contato"
                  data-pick={treatmentName(region.treatment)}
                  data-magnetic
                  className={buttonClasses("accent")}
                >
                  {painMapSection.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
