"use client";

import { useEffect } from "react";

// Único ponto de entrada dos efeitos no cliente. O código dos efeitos (GSAP,
// Lenis, WebGL) carrega à parte, depois da hidratação, para não pesar na
// primeira pintura.
export function GlobalEffects() {
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    import("@/effects").then(({ initEffects }) => {
      if (!cancelled) cleanup = initEffects();
    });
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return null;
}
