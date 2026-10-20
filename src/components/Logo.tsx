// SVG do protótipo, sem alteração: três traços (B, a pessoa sentada se alongando
// e o L) com a cabeça em verde vivo.
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 2 84 42" aria-hidden="true" className={className}>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path pathLength={1} d="M6 9V37M6 9H15a6.5 6.5 0 0 1 0 13H6M6 22H17a7.5 7.5 0 0 1 0 15H6" />
        <path pathLength={1} d="M39 18L36 37H52V33" />
        <path pathLength={1} d="M64 9V37H78" />
      </g>
      <circle className="logo-head fill-verde-vivo" cx="40.6" cy="9.8" r="4.2" />
    </svg>
  );
}
