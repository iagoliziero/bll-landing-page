// O next/image só pede larguras que estão em image-widths.json (ver next.config.ts),
// e o script npm run images gera um WebP para cada uma delas.
// O src das fotos é o caminho sem extensão, por exemplo "/images/hero".
export default function imageLoader({ src, width }: { src: string; width: number }) {
  return `${src}-${width}.webp`;
}
