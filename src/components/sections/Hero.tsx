import Image from "next/image";
import {
  IconBrandWhatsapp,
  IconCertificate,
  IconClipboardCheck,
  IconHome,
  IconMapPin,
} from "@tabler/icons-react";
import { buttonClasses } from "@/components/buttonClasses";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { hero, painRegions } from "@/data/content";

const trustIcons = {
  certificate: IconCertificate,
  "clipboard-check": IconClipboardCheck,
  "map-pin": IconMapPin,
};

export function Hero() {
  const [firstLine, secondLine] = hero.title.lines;
  const [beforeStruck, afterStruck] = firstLine.split(hero.title.struck);

  return (
    <section
      id="inicio"
      data-hero
      data-nav-theme="dark"
      className="hero relative flex min-h-dvh flex-col overflow-hidden bg-verde"
    >
      <div data-hero-photo className="hero-photo absolute inset-0 overflow-hidden">
        <div data-hero-parallax className="absolute inset-x-0 -top-[6%] -bottom-[6%]">
          <Image
            src={hero.image.src}
            alt={hero.image.alt}
            fill
            preload
            fetchPriority="high"
            sizes="100vw"
            className="hero-media object-cover object-[60%_40%]"
          />
          <canvas data-hero-canvas aria-hidden="true" className="hero-media hero-canvas" />
        </div>
      </div>
      <div className="hero-overlay pointer-events-none absolute inset-0" />

      <div
        data-hero-content
        className="relative z-[2] px-page pt-[clamp(96px,16vh,170px)] pb-12 text-white"
      >
        <div className="sm:w-[min(660px,68vw)]">
          <p className="hero-fade inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/12 px-3 py-1.5 text-label font-semibold">
            <IconHome aria-hidden="true" className="size-4 text-verde-vivo" />
            {hero.badge}
          </p>
          <h1 className="headline mt-3.5 text-hero">
            <span className="hero-line">
              <span>
                {beforeStruck}
                <span data-struck className="hero-struck">
                  {hero.title.struck}
                  <i aria-hidden="true" />
                </span>
                {afterStruck}
              </span>
            </span>
            <span className="hero-line">
              <span>{secondLine}</span>
            </span>
          </h1>
          <p className="hero-fade hero-fade-1 mt-4 max-w-[470px] text-intro text-white/90">
            {hero.subtitle}
          </p>
          <div className="hero-fade hero-fade-2 mt-[22px] flex flex-wrap gap-2.5">
            <WhatsAppLink magnetic className={buttonClasses("accent", "lg")}>
              <IconBrandWhatsapp aria-hidden="true" />
              {hero.primaryCta}
            </WhatsAppLink>
            <a href="#tratamentos" data-magnetic className={buttonClasses("ghost", "lg")}>
              {hero.secondaryCta}
            </a>
          </div>
          <ul className="hero-fade hero-fade-3 mt-5 flex flex-wrap gap-x-[18px] gap-y-2">
            {hero.trust.map((item) => {
              const Icon = trustIcons[item.icon];
              return (
                <li key={item.text} className="flex items-center gap-[7px] text-label text-white/92">
                  <Icon aria-hidden="true" className="size-4 text-verde-vivo" />
                  {item.text}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="hero-fade hero-fade-3 absolute right-[clamp(20px,4vw,64px)] bottom-7 z-[2] hidden w-[clamp(184px,22vw,260px)] rounded-card-sm bg-white p-3.5 sm:block">
        <p className="text-card-title font-bold text-tinta">{hero.painCard.title}</p>
        <p className="mt-[3px] mb-2.5 text-caption text-secundario">{hero.painCard.text}</p>
        <ul className="flex flex-wrap gap-1.5">
          {hero.painCard.regions.map((id) => (
            <li key={id}>
              <a
                href="#onde-doi"
                data-region-link={id}
                className="block rounded-full bg-menta px-2.5 py-1.5 text-label font-semibold text-verde transition-colors duration-300 hover:bg-verde hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-verde"
              >
                {painRegions.find((region) => region.id === id)?.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
