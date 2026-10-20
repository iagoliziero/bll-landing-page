// Converte cada foto de assets/photos/ em WebP, uma versão para cada largura de
// src/config/image-widths.json, e salva em public/images/<nome>-<largura>.webp.
// Rode com: npm run images
import { mkdir, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const sourceDir = path.join(root, "assets", "photos");
const outputDir = path.join(root, "public", "images");
const widths = JSON.parse(
  await readFile(path.join(root, "src", "config", "image-widths.json"), "utf8"),
);

await mkdir(outputDir, { recursive: true });

const photos = (await readdir(sourceDir)).filter((file) => /\.(jpe?g|png|webp)$/i.test(file));

for (const file of photos) {
  const name = path.parse(file).name;
  const source = sharp(path.join(sourceDir, file));
  const { width: sourceWidth } = await source.metadata();

  for (const width of widths) {
    await source
      .clone()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 78, effort: 6 })
      .toFile(path.join(outputDir, `${name}-${width}.webp`));
  }

  const warning = sourceWidth < Math.max(...widths)
    ? ` (atenção: a original tem só ${sourceWidth}px de largura)`
    : "";
  console.log(`${file} → ${widths.length} versões${warning}`);
}
