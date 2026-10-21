import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import { site } from "@/config/site";
import { meta } from "@/data/content";
import "@/styles/globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: meta.title,
  description: meta.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: site.name,
    title: meta.title,
    description: meta.description,
    images: [{ url: "/og.png", width: 1200, height: 630, type: "image/png", alt: meta.title }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export const viewport: Viewport = {
  themeColor: "#0B5D4B",
};

// Roda durante a leitura do HTML, antes da primeira pintura:
// - .js liga a abertura e os estados iniciais dos efeitos (sem ela, tudo
//   aparece pronto);
// - .intro-done tira a abertura da frente na hora se a pessoa rolar, clicar,
//   tocar ou usar o teclado, ou se chegar por um link para uma seção. Sem
//   isso, a abertura acaba sozinha, em CSS (src/styles/globals.css).
const bootScript = `(function(){
var d=document.documentElement;
d.classList.add("js");
function end(){d.classList.add("intro-done")}
if(location.hash)end();
["wheel","touchstart","pointerdown","keydown"].forEach(function(t){addEventListener(t,end,{once:true,passive:true})});
})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={figtree.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      {/* Extensões do navegador (ColorZilla, Grammarly...) põem atributos no
          <body> antes de o React carregar. Isso só silencia os atributos do
          próprio <body>; o conteúdo continua sendo conferido. */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
