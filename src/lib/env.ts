// Condições do aparelho que decidem quais efeitos rodam.
export const queries = {
  reducedMotion: "(prefers-reduced-motion: reduce)",
  fullMotion: "(prefers-reduced-motion: no-preference)",
  mobile: "(width < 40rem)",
  desktop: "(width >= 40rem)",
  finePointer: "(pointer: fine)",
  coarsePointer: "(pointer: coarse)",
};

export type Env = {
  reducedMotion: boolean;
  mobile: boolean;
  finePointer: boolean;
};

let gpuCache: "high" | "low" | null = null;

// GPU fraca: sem WebGL, renderização por software (SwiftShader, llvmpipe) ou
// aparelho com pouca memória. Nesses casos a foto do hero fica estática.
export function gpuTier(): "high" | "low" {
  if (gpuCache) return gpuCache;
  let tier: "high" | "low" = "low";
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true });
    if (gl) {
      const info = gl.getExtension("WEBGL_debug_renderer_info");
      const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
      const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
      tier = /swiftshader|llvmpipe|software|basic render/i.test(renderer) || memory < 4 ? "low" : "high";
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    }
  } catch {
    tier = "low";
  }
  gpuCache = tier;
  return tier;
}
