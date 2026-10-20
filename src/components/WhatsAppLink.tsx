import type { ReactNode } from "react";
import { whatsappMessages } from "@/data/content";
import { whatsappReady, whatsappUrl } from "@/lib/whatsapp";

type WhatsAppLinkProps = {
  className?: string;
  children: ReactNode;
  magnetic?: boolean;
};

// Link de verdade para o wa.me, então funciona mesmo sem JavaScript.
// Sem número configurado, leva ao formulário (o aviso aparece lá).
export function WhatsAppLink({ className, children, magnetic }: WhatsAppLinkProps) {
  return (
    <a
      href={whatsappReady ? whatsappUrl(whatsappMessages.generic) : "#contato"}
      target={whatsappReady ? "_blank" : undefined}
      rel={whatsappReady ? "noopener" : undefined}
      data-wa
      data-magnetic={magnetic ? "" : undefined}
      className={className}
    >
      {children}
    </a>
  );
}
