import { Fragment } from "react";
import { ContactForm } from "@/components/ContactForm";
import { isPlaceholder, site } from "@/config/site";
import { contact, footer, whatsappMessages } from "@/data/content";
import { whatsappDisplay, whatsappReady, whatsappUrl } from "@/lib/whatsapp";

// O título já sai dividido em letras para o efeito splitChars. Leitores de tela
// leem a cópia inteira em sr-only.
function SplitTitle({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <span aria-hidden="true" data-split>
      {words.map((word, wordIndex) => (
        <Fragment key={wordIndex}>
          <span className="split-word">
            {[...word].map((char, charIndex) => (
              <span key={charIndex} className="split-char">
                {char}
              </span>
            ))}
          </span>
          {wordIndex < words.length - 1 && " "}
        </Fragment>
      ))}
    </span>
  );
}

// O painel verde se abre em um círculo que nasce da base visível da seção
// (efeito circleReveal). O fundo menta da seção aparece em volta do círculo.
export function Contact() {
  return (
    <section
      id="contato"
      tabIndex={-1}
      data-contact
      data-nav-theme="dark"
      aria-labelledby="contato-titulo"
      className="relative bg-menta"
    >
      <div
        data-contact-panel
        className="contact-panel relative overflow-hidden bg-verde px-page pt-[clamp(100px,15vh,170px)] pb-[clamp(60px,10vh,120px)] text-white"
      >
        <h2 id="contato-titulo" className="headline text-contact">
          <span className="sr-only">{contact.title}</span>
          <SplitTitle text={contact.title} />
        </h2>
        <p className="mt-6 mb-7 max-w-115 text-intro text-white/85">{contact.text}</p>
        <ContactForm />
      </div>
    </section>
  );
}

export function Footer() {
  const instagram = isPlaceholder(site.instagram) ? null : site.instagram.replace(/^@/, "");
  const lineClass = "block leading-[1.6] text-white/72";
  const linkClass =
    "underline decoration-white/30 underline-offset-3 transition-colors hover:text-white hover:decoration-verde-vivo";

  return (
    <footer data-nav-theme="dark" className="bg-verde px-page text-white">
      <div className="grid grid-cols-2 gap-4.5 border-t border-white/20 pt-5.5 pb-8.5 text-label sm:grid-cols-3">
        <div>
          <b className="mb-1.5 block font-bold">{footer.service.title}</b>
          {footer.service.lines.map((line) => (
            <span key={line} className={lineClass}>
              {line}
            </span>
          ))}
        </div>
        <div>
          <b className="mb-1.5 block font-bold">{footer.contact.title}</b>
          <span className={lineClass}>
            {whatsappReady ? (
              <a href={whatsappUrl(whatsappMessages.generic)} target="_blank" rel="noopener" className={linkClass}>
                {whatsappDisplay()}
              </a>
            ) : (
              whatsappDisplay()
            )}
          </span>
          <span className={lineClass}>
            {instagram ? (
              <a href={`https://www.instagram.com/${instagram}/`} target="_blank" rel="noopener" className={linkClass}>
                @{instagram}
              </a>
            ) : (
              site.instagram
            )}
          </span>
        </div>
        <div>
          <b className="mb-1.5 block font-bold">{footer.responsible.title}</b>
          {footer.responsible.lines.map((line) => (
            <span key={line} className={lineClass}>
              {line}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
