import { Logo } from "@/components/Logo";

// Abertura: tela verde em que a logo se desenha e a cabeça entra com overshoot.
// É toda em CSS, com tempos fixos a partir da primeira pintura, sem esperar o
// JavaScript do React. O script de src/app/layout.tsx põe a classe .intro-done
// no <html> para tirá-la da frente quando a pessoa rola, clica, toca ou usa o
// teclado. Sem JavaScript, ela não aparece.
export function Intro() {
  return (
    <div aria-hidden="true" className="intro">
      <Logo />
    </div>
  );
}
