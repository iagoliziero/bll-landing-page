import { hero } from "@/data/content";

export default function Home() {
  return (
    <main className="grid min-h-dvh place-items-center bg-verde px-page text-white">
      <h1 className="headline text-hero">{hero.title.lines.join(" ")}</h1>
    </main>
  );
}
