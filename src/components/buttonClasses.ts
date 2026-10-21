// Classes dos botões. Todos têm pelo menos 44px de altura (alvo de toque).
const base =
  "inline-flex min-h-11 items-center gap-2 rounded-button border font-bold leading-[1.2] transition-[color,background-color,border-color] duration-300 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-verde-vivo [&_svg]:size-4.5 [&_svg]:shrink-0";

const variants = {
  // CTA de WhatsApp: sempre verde vivo com texto em tinta
  accent: "border-transparent bg-verde-vivo text-tinta hover:bg-verde-vivo-claro",
  ghost: "border-white/45 text-white hover:border-white",
};

const sizes = {
  sm: "px-3.5 text-label",
  md: "px-4.5 text-label",
  lg: "px-5.5 py-3.5 text-lead",
};

export function buttonClasses(
  variant: keyof typeof variants,
  size: keyof typeof sizes = "md",
  extra = "",
) {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`.trim();
}
