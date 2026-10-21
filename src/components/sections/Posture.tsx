import { posture } from "@/data/content";

type Point = [number, number];
type Pose = Record<"c7" | "p1" | "p2" | "ear" | "sh" | "el" | "ha", Point>;

// Pontos das duas figuras (viewBox 0 0 320 360): C7, curva da coluna, orelha,
// ombro, cotovelo e mão. Antes: cabeça projetada. Depois: eixo alinhado.
const before: Pose = {
  c7: [146, 146],
  p1: [146, 280],
  p2: [118, 214],
  ear: [192, 104],
  sh: [140, 164],
  el: [146, 214],
  ha: [160, 256],
};
const after: Pose = {
  c7: [152, 146],
  p1: [158, 282],
  p2: [140, 214],
  ear: [184, 99],
  sh: [152, 164],
  el: [152, 216],
  ha: [158, 258],
};

// Sem JavaScript, as duas posturas aparecem sobrepostas (o antes em cinza claro)
// e a divisória fica escondida. Com JavaScript, o efeito postureWipe recorta as
// figuras e move a divisória de 312 até 8.
const DIVIDER_X = 312;

const f = (point: Point) => `${point[0].toFixed(1)} ${point[1].toFixed(1)}`;
const headAngle = (pose: Pose) => Math.atan2(pose.c7[1] - pose.ear[1], pose.ear[0] - pose.c7[0]);
const degrees = (pose: Pose) => `${Math.round((headAngle(pose) * 180) / Math.PI)}°`;

function Figure({ pose, className }: { pose: Pose; className: string }) {
  const angle = headAngle(pose);
  const [cx, cy] = pose.c7;
  return (
    <g className={className}>
      <path className="posture-line" d={`M150 330C${f(pose.p1)} ${f(pose.p2)} ${f(pose.c7)}`} />
      <path className="posture-line" d={`M${f(pose.c7)}L${f([pose.ear[0] - 10, pose.ear[1] + 14])}`} />
      <path className="posture-line" d={`M${f(pose.sh)}L${f(pose.el)}L${f(pose.ha)}`} />
      <circle
        className="posture-line"
        cx={(pose.ear[0] - 4).toFixed(1)}
        cy={(pose.ear[1] - 13).toFixed(1)}
        r="26"
      />
      <path className="posture-measure" d={`M${f(pose.c7)}H${(cx + 70).toFixed(1)}M${f(pose.c7)}L${f(pose.ear)}`} />
      <path
        className="posture-measure"
        d={`M${(cx + 34).toFixed(1)} ${cy.toFixed(1)}A34 34 0 0 0 ${(cx + 34 * Math.cos(angle)).toFixed(1)} ${(cy - 34 * Math.sin(angle)).toFixed(1)}`}
      />
    </g>
  );
}

export function Posture() {
  return (
    <section
      id="postura"
      tabIndex={-1}
      data-posture
      data-nav-theme="light"
      aria-labelledby="postura-titulo"
      className="relative bg-menta px-page py-[clamp(90px,14vh,140px)]"
    >
      <div className="grid grid-cols-1 items-center gap-[clamp(20px,4vw,70px)] sm:grid-cols-2">
        <div>
          <h2 id="postura-titulo" className="headline text-section-long text-tinta">
            <span data-elastic className="inline-block">
              {posture.title}
            </span>
          </h2>
          <p className="mt-3.5 max-w-90 text-lead text-secundario">{posture.text}</p>
          <dl className="mt-6 flex gap-7">
            <div>
              <dt className="text-caption text-secundario">{posture.before}</dt>
              <dd className="text-number leading-[1.05] font-extrabold tracking-[-0.04em] text-verde tabular-nums">
                {degrees(before)}
              </dd>
            </div>
            <div>
              <dt className="text-caption text-secundario">{posture.after}</dt>
              <dd className="text-number leading-[1.05] font-extrabold tracking-[-0.04em] text-verde tabular-nums">
                {degrees(after)}
              </dd>
            </div>
          </dl>
          <p className="mt-2.5 text-caption text-secundario">{posture.caption}</p>
        </div>

        <div>
          <svg
            viewBox="0 0 320 360"
            role="img"
            aria-label={posture.figureLabel}
            className="posture-figure block h-auto w-full overflow-visible"
          >
            <defs>
              <clipPath id="postura-antes">
                <rect data-posture-before x="0" y="0" width="320" height="360" />
              </clipPath>
              <clipPath id="postura-depois">
                <rect data-posture-after x="0" y="0" width="320" height="360" />
              </clipPath>
            </defs>
            <path className="posture-axis" d="M150 30V346" />
            <g clipPath="url(#postura-antes)">
              <Figure pose={before} className="posture-before" />
            </g>
            <g clipPath="url(#postura-depois)">
              <Figure pose={after} className="posture-after" />
            </g>
            <line
              data-posture-divider
              className="posture-divider hidden js:inline"
              x1={DIVIDER_X}
              y1="16"
              x2={DIVIDER_X}
              y2="350"
            />
            <g data-posture-handle className="hidden js:inline" transform={`translate(${DIVIDER_X} 190)`}>
              <circle r="12" className="fill-verde" />
              <path
                d="M-5 0H5M-5 0l3-3M-5 0l3 3M5 0l-3-3M5 0l-3 3"
                stroke="#fff"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
            </g>
            <text className="posture-label" x="6" y="22">
              {posture.before}
            </text>
            <text className="posture-label" x="314" y="22" textAnchor="end">
              {posture.after}
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}
