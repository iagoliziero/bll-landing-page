"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { IconBrandWhatsapp, IconCalendarCheck, IconChevronDown } from "@tabler/icons-react";
import { buttonClasses } from "@/components/buttonClasses";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { contact, treatments, whatsappMessages } from "@/data/content";
import { formatPhone, whatsappReady, whatsappUrl } from "@/lib/whatsapp";

type Field = "name" | "phone" | "treatment";

// Eventos disparados no formulário pelos botões do resto da página (efeito actions):
// "bll:pick" escolhe o tratamento e "bll:wa-unavailable" mostra o aviso de número
// não configurado.
export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<{ field: Field; message: string } | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const onPick = (event: Event) => {
      const { treatment } = (event as CustomEvent<{ treatment: string }>).detail;
      const select = form.elements.namedItem("treatment") as HTMLSelectElement;
      select.value = treatment;
      setError(null);
      setNotice("");
    };
    const onUnavailable = () => {
      setError(null);
      setNotice(contact.notConfigured);
    };

    form.addEventListener("bll:pick", onPick);
    form.addEventListener("bll:wa-unavailable", onUnavailable);
    return () => {
      form.removeEventListener("bll:pick", onPick);
      form.removeEventListener("bll:wa-unavailable", onUnavailable);
    };
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").replace(/\D/g, "");
    const treatment = String(data.get("treatment") ?? "");

    const invalid: Field | null = !name ? "name" : phone.length < 10 ? "phone" : !treatment ? "treatment" : null;
    if (invalid) {
      setError({ field: invalid, message: contact.errors[invalid] });
      setNotice("");
      (form.elements.namedItem(invalid) as HTMLElement).focus();
      return;
    }

    setError(null);
    const message = whatsappMessages.form({ name, treatment, phone: formatPhone(phone) });
    if (whatsappReady) {
      window.open(whatsappUrl(message), "_blank", "noopener");
      setNotice(contact.sent);
    } else {
      setNotice(contact.draft(message));
    }
  }

  const clearError = () => setError(null);
  const fieldProps = (field: Field) => ({
    name: field,
    "aria-invalid": error?.field === field ? true : undefined,
    "aria-describedby": error?.field === field ? "contato-erro" : undefined,
    onInput: clearError,
  });

  const labelClass = "mb-1 block text-caption text-white/72";
  const inputClass =
    "block w-full border-b border-white/35 bg-transparent py-2.5 pr-6 text-intro text-white caret-verde-vivo outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-white/45 focus:border-verde-vivo focus:shadow-[0_1px_0_var(--color-verde-vivo)] aria-invalid:border-erro";

  return (
    <>
      <form
        ref={formRef}
        data-contact-form
        noValidate
        onSubmit={handleSubmit}
        className="grid max-w-[860px] grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-3"
      >
        <label className="relative block">
          <span className={labelClass}>{contact.fields.name.label}</span>
          <input
            {...fieldProps("name")}
            autoComplete="name"
            placeholder={contact.fields.name.placeholder}
            className={inputClass}
          />
        </label>
        <label className="relative block">
          <span className={labelClass}>{contact.fields.phone.label}</span>
          <input
            {...fieldProps("phone")}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder={contact.fields.phone.placeholder}
            className={inputClass}
          />
        </label>
        <label className="relative block">
          <span className={labelClass}>{contact.fields.treatment.label}</span>
          <select
            {...fieldProps("treatment")}
            onChange={clearError}
            defaultValue=""
            className={`${inputClass} cursor-pointer appearance-none`}
          >
            <option value="" className="text-tinta">
              {contact.fields.treatment.placeholder}
            </option>
            {treatments.map((treatment) => (
              <option key={treatment.id} className="text-tinta">
                {treatment.name}
              </option>
            ))}
          </select>
          <IconChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute right-0 bottom-3 size-4 text-white/72"
          />
        </label>
        <div className="col-span-full mt-2 flex flex-wrap items-center gap-3">
          <button type="submit" data-magnetic className={buttonClasses("accent", "lg")}>
            <IconCalendarCheck aria-hidden="true" />
            {contact.submit}
          </button>
          <WhatsAppLink magnetic className={buttonClasses("ghost", "lg")}>
            <IconBrandWhatsapp aria-hidden="true" />
            {contact.direct}
          </WhatsAppLink>
        </div>
      </form>
      <p id="contato-erro" role="alert" className="mt-2.5 min-h-[18px] text-label text-erro">
        {error?.message}
      </p>
      <div role="status" className="mt-2.5 max-w-[560px]">
        {notice && (
          <p className="rounded-panel border border-white/25 px-4 py-3.5 text-body text-white/92">
            {notice}
          </p>
        )}
      </div>
    </>
  );
}
