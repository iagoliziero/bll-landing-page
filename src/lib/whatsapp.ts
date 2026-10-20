import { isPlaceholder, site } from "@/config/site";

const number = site.whatsapp.replace(/\D/g, "");

// Enquanto o número de src/config/site.ts for o placeholder, os botões do
// WhatsApp levam ao formulário e mostram um aviso em vez de abrir a conversa.
export const whatsappReady = !isPlaceholder(site.whatsapp) && /^\d{12,13}$/.test(number);

export function whatsappUrl(message: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

// "5511912345678" → "(11) 91234-5678"
export function whatsappDisplay() {
  if (!whatsappReady) return "[WhatsApp]";
  const local = number.slice(2);
  const ddd = local.slice(0, 2);
  const rest = local.slice(2);
  return `(${ddd}) ${rest.slice(0, rest.length - 4)}-${rest.slice(-4)}`;
}
