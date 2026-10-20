import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { queries, type Env } from "@/lib/env";
import { initActions } from "./actions";
import { initCardSpotlight } from "./cardSpotlight";
import { initCursor } from "./cursor";
import { initFab } from "./fab";
import { initHeroParallax } from "./heroParallax";
import { initHorizontalTrack } from "./horizontalTrack";
import { initLiquidPhoto } from "./liquidPhoto";
import { initMagnetic } from "./magnetic";
import { initNavTheme } from "./navTheme";
import { initSmoothScroll } from "./smoothScroll";

type Cleanup = () => void;

// Liga todos os efeitos. O gsap.matchMedia refaz tudo quando muda o tamanho
// (mobile ↔ desktop), o tipo de ponteiro ou a preferência de movimento.
export function initEffects(): Cleanup {
  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();

  mm.add(
    {
      reducedMotion: queries.reducedMotion,
      fullMotion: queries.fullMotion,
      mobile: queries.mobile,
      desktop: queries.desktop,
      finePointer: queries.finePointer,
    },
    (context) => {
      const conditions = context.conditions as Record<keyof typeof queries, boolean>;
      const env: Env = {
        reducedMotion: conditions.reducedMotion,
        mobile: conditions.mobile,
        finePointer: conditions.finePointer,
      };

      const cleanups: Cleanup[] = [
        initSmoothScroll(env),
        initActions(),
        initNavTheme(),
        initFab(),
        initHeroParallax(env),
        initLiquidPhoto(env),
        initHorizontalTrack(env),
        initCardSpotlight(env),
        initCursor(env),
        initMagnetic(env),
      ];

      ScrollTrigger.refresh();
      return () => cleanups.reverse().forEach((cleanup) => cleanup());
    },
  );

  return () => mm.revert();
}
