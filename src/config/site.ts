// Dados da BLL usados no site, no SEO e no link do WhatsApp.
// O que está entre colchetes ainda precisa ser preenchido.
export const site = {
  name: "BLL Fisioterapia",
  // Domínio final do site. Na Vercel ou no Netlify, defina NEXT_PUBLIC_SITE_URL.
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  // Só números: 55 + DDD + número. Exemplo: 5511912345678.
  whatsapp: "[55 + DDD + número]",
  // Usuário do Instagram, com @. Exemplo: @bllfisioterapia.
  instagram: "[Instagram]",
  city: "[cidade]",
  neighborhoods: "[bairros atendidos]",
  responsible: {
    name: "Luis Fernando",
    crefito: "[número]",
  },
};

export function isPlaceholder(value: string) {
  return value.startsWith("[") && value.endsWith("]");
}
