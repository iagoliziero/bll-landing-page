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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={figtree.variable}>
      <body>{children}</body>
    </html>
  );
}
