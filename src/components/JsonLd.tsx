import { isPlaceholder, site } from "@/config/site";
import { meta, treatments } from "@/data/content";
import { whatsappReady } from "@/lib/whatsapp";

// Dados estruturados (schema.org/MedicalBusiness) a partir de src/config/site.ts.
export function JsonLd() {
  const instagram = isPlaceholder(site.instagram) ? null : site.instagram.replace(/^@/, "");
  const data = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: site.name,
    description: meta.description,
    url: site.url,
    image: `${site.url}/og.png`,
    medicalSpecialty: "PhysicalTherapy",
    areaServed: { "@type": "City", name: site.city },
    ...(whatsappReady && { telephone: `+${site.whatsapp.replace(/\D/g, "")}` }),
    ...(instagram && { sameAs: [`https://www.instagram.com/${instagram}/`] }),
    availableService: treatments.map((treatment) => ({
      "@type": "MedicalTherapy",
      name: treatment.name,
    })),
    employee: {
      "@type": "Person",
      name: site.responsible.name,
      jobTitle: "Fisioterapeuta responsável técnico",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
