import { IconBrandWhatsapp } from "@tabler/icons-react";
import { buttonClasses } from "@/components/buttonClasses";
import { Logo } from "@/components/Logo";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { nav } from "@/data/content";

// data-theme="dark": texto branco sobre seções escuras; "light": texto em tinta.
// O efeito navTheme troca o tema conforme a seção que está embaixo da navbar.
export function Navbar() {
  return (
    <>
      <a
        href="#inicio"
        className="sr-only rounded-button bg-verde-vivo px-4 py-3 text-label font-bold text-tinta focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-80 focus:outline-2 focus:outline-offset-2 focus:outline-white"
      >
        {nav.skipLink}
      </a>
      <header
        data-navbar
        data-theme="dark"
        className="group fixed inset-x-0 top-0 z-30 flex items-center justify-between px-page py-3 text-tinta transition-colors duration-400 data-[theme=dark]:text-white"
      >
        <a
          href="#inicio"
          aria-label={nav.brandLabel}
          className="flex min-h-11 items-center gap-2.5 rounded-md text-verde transition-colors duration-400 group-data-[theme=dark]:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
        >
          <Logo className="h-5.5 w-auto" />
          <span className="hidden text-label font-bold tracking-[-0.01em] sm:inline">{nav.brandName}</span>
        </a>
        <nav aria-label="Seções" className="hidden sm:block">
          <ul className="flex gap-4.5">
            {nav.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="relative flex min-h-11 items-center rounded-md text-label font-medium opacity-80 transition-opacity duration-300 after:absolute after:inset-x-0 after:bottom-2.5 after:h-0.5 after:origin-right after:scale-x-0 after:rounded-full after:bg-verde-vivo after:transition-transform after:duration-350 after:ease-out-soft hover:opacity-100 hover:after:origin-left hover:after:scale-x-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <WhatsAppLink magnetic className={buttonClasses("accent")}>
          <IconBrandWhatsapp aria-hidden="true" />
          {nav.cta}
        </WhatsAppLink>
      </header>
    </>
  );
}
