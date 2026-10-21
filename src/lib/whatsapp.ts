import { isPlaceholder, site } from "@/config/site";

const number = site.whatsapp.replace(/\D/g, "");

// Enquanto o número de src/config/site.ts for o placeholder, os botões do
// WhatsApp levam ao formulário e mostram um aviso em vez de abrir a conversa.
export const whatsappReady = !isPlaceholder(site.whatsapp) && /^\d{12,13}$/.test(number);

export function whatsappUrl(message: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

// DDD + número → "(11) 91234-5678" ou "(11) 3234-5678"
export function formatPhone(digits: string) {
  if (digits.length < 10 || digits.length > 11) return digits;
  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);
  return `(${ddd}) ${rest.slice(0, -4)}-${rest.slice(-4)}`;
}

// Número da BLL para exibir (sem o 55 do Brasil)
export function whatsappDisplay() {
  return whatsappReady ? formatPhone(number.slice(2)) : "[WhatsApp]";
}
