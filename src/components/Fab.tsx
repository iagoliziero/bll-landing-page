import { IconBrandWhatsapp } from "@tabler/icons-react";
import { buttonClasses } from "@/components/buttonClasses";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { fab } from "@/data/content";

// Aparece depois de 70% do hero e some ao chegar no contato (efeito fab).
// Sem JavaScript fica escondido: o botão "Agendar" da navbar já cobre esse papel.
export function Fab() {
  return (
    <div data-fab className="fab fixed right-[clamp(20px,4vw,64px)] bottom-4.5 left-[clamp(20px,4vw,64px)] z-40 hidden sm:left-auto js:block">
      <WhatsAppLink magnetic className={buttonClasses("accent", "lg", "w-full justify-center sm:w-auto")}>
        <IconBrandWhatsapp aria-hidden="true" />
        {fab.cta}
      </WhatsAppLink>
    </div>
  );
}
