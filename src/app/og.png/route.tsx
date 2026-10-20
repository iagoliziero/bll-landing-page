import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { hero } from "@/data/content";

export const dynamic = "force-static";

const ogImageSize = { width: 1200, height: 630 };

// Imagem de compartilhamento (Open Graph) gerada no build: logo e o título do hero
// sobre o verde. É um route handler em /og.png, e não o opengraph-image.tsx do
// Next, porque na exportação estática esse arquivo sai sem extensão e algumas
// hospedagens o servem com o tipo errado.
export async function GET() {
  const figtree = await readFile(
    path.join(process.cwd(), "node_modules/@fontsource/figtree/files/figtree-latin-800-normal.woff"),
  );
  const [firstLine, secondLine] = hero.title.lines;
  const [beforeStruck, afterStruck] = firstLine.split(hero.title.struck);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "76px 84px",
          background: "#0B5D4B",
          color: "#fff",
          fontFamily: "Figtree",
        }}
      >
        <svg width="176" height="88" viewBox="0 2 84 42">
          <g fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9V37M6 9H15a6.5 6.5 0 0 1 0 13H6M6 22H17a7.5 7.5 0 0 1 0 15H6" />
            <path d="M39 18L36 37H52V33" />
            <path d="M64 9V37H78" />
          </g>
          <circle cx="40.6" cy="9.8" r="4.2" fill="#2FD47F" />
        </svg>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 132,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 0.95,
          }}
        >
          <div style={{ display: "flex" }}>
            <span>{beforeStruck.trimEnd()}</span>
            <span style={{ position: "relative", display: "flex", marginLeft: 32, opacity: 0.6 }}>
              {hero.title.struck}
              <span
                style={{
                  position: "absolute",
                  top: "54%",
                  left: -8,
                  right: -8,
                  height: 13,
                  borderRadius: 6,
                  background: "#2FD47F",
                }}
              />
            </span>
            <span>{afterStruck}</span>
          </div>
          <span>{secondLine}</span>
        </div>
      </div>
    ),
    { ...ogImageSize, fonts: [{ name: "Figtree", data: figtree, weight: 800, style: "normal" }] },
  );
}
