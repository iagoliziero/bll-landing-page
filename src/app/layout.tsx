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
// - .js liga os estados iniciais dos efeitos (sem ela, tudo aparece pronto);
// - .intro-done encerra a abertura quando a cabeça da logo termina de entrar,
//   quando a pessoa rola, clica, toca ou usa o teclado, ou depois de 2,5s.
const bootScript = `(function(){
var d=document.documentElement,done=false;
d.classList.add("js");
function end(){if(done)return;done=true;d.classList.add("intro-done")}
if(location.hash)end();
document.addEventListener("animationend",function(e){if(e.animationName==="intro-head")end()});
["wheel","touchstart","pointerdown","keydown"].forEach(function(t){addEventListener(t,end,{once:true,passive:true})});
setTimeout(end,2500);
})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={figtree.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
