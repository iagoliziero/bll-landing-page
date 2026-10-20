export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export function smoothstep(edge0: number, edge1: number, value: number) {
  const t = clamp((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

// Inverso de smoothstep(0, 1, t): o t que produz o valor pedido
export function inverseSmoothstep(value: number) {
  let low = 0;
  let high = 1;
  for (let i = 0; i < 24; i++) {
    const mid = (low + high) / 2;
    if (smoothstep(0, 1, mid) < value) low = mid;
    else high = mid;
  }
  return (low + high) / 2;
}

export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

export const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
