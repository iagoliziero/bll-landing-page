import { Logo } from "@/components/Logo";

// Abertura: tela verde em que a logo se desenha e a cabeça entra com overshoot.
// É toda em CSS e começa na primeira pintura, sem esperar o JavaScript do React.
// O script de src/app/layout.tsx põe a classe .intro-done no <html> quando a
// cabeça termina de entrar ou quando a pessoa rola, clica, toca ou usa o teclado.
// Sem JavaScript, ela não aparece.
export function Intro() {
  return (
    <div aria-hidden="true" className="intro">
      <Logo />
    </div>
  );
}
