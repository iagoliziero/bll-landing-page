import { whatsappReady } from "@/lib/whatsapp";
import { scrollToSection } from "@/lib/scroll";

// Cliques que atravessam a página, por delegação:
// - links internos (#secao) rolam suave até a seção e levam o foco para ela;
// - data-region-link escolhe a região no mapa de dor antes de rolar até ele;
// - data-pick preenche o tratamento no formulário e põe o foco no nome;
// - data-wa sem número configurado leva ao formulário e mostra o aviso.
export function initActions() {
  const form = () => document.querySelector<HTMLFormElement>("[data-contact-form]");

  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
    const link = (event.target as Element).closest<HTMLAnchorElement>("a[href]");
    if (!link) return;

    if (link.hasAttribute("data-wa") && whatsappReady) return;

    const href = link.getAttribute("href") ?? "";
    if (!href.startsWith("#") || href.length < 2) return;
    event.preventDefault();

    const regionId = link.dataset.regionLink;
    if (regionId) {
      document.dispatchEvent(new CustomEvent("bll:select-region", { detail: { region: regionId } }));
    }

    const treatment = link.dataset.pick;
    if (treatment) {
      form()?.dispatchEvent(new CustomEvent("bll:pick", { detail: { treatment } }));
      scrollToSection("contato", () => form()?.querySelector<HTMLInputElement>("input")?.focus({ preventScroll: true }));
      return;
    }

    if (link.hasAttribute("data-wa")) {
      form()?.dispatchEvent(new CustomEvent("bll:wa-unavailable"));
    }

    scrollToSection(href.slice(1));
  };

  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}
