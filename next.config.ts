import type { NextConfig } from "next";
import imageWidths from "./src/config/image-widths.json";

// As fotos são convertidas antes do build (npm run images) em uma versão WebP
// para cada largura de image-widths.json. O loader aponta o next/image para
// essas versões, então o srcset funciona mesmo com o site exportado como estático.
const nextConfig: NextConfig = {
  output: "export",
  images: {
    loader: "custom",
    loaderFile: "./src/lib/imageLoader.ts",
    deviceSizes: imageWidths.filter((width) => width >= 640),
    imageSizes: imageWidths.filter((width) => width < 640),
  },
};

export default nextConfig;
