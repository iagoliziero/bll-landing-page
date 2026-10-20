import { Fab } from "@/components/Fab";
import { JsonLd } from "@/components/JsonLd";
import { Navbar } from "@/components/Navbar";
import { Contact, Footer } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { PainMap } from "@/components/sections/PainMap";
import { Posture } from "@/components/sections/Posture";
import { Treatments } from "@/components/sections/Treatments";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Treatments />
        <PainMap />
        <HowItWorks />
        <Posture />
        <Contact />
      </main>
      <Footer />
      <Fab />
      <JsonLd />
    </>
  );
}
