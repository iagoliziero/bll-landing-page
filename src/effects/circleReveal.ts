// Recorte circular que nasce em (x, y) e cresce até cobrir um elemento de
// width × height. Usado na entrada dos tratamentos e no painel do contato.
export function setCircle(
  element: HTMLElement,
  progress: number,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  if (progress >= 1) {
    element.style.clipPath = "none";
    return;
  }
  const full = Math.hypot(Math.max(x, width - x), Math.max(y, height - y)) * 1.02;
  element.style.clipPath = `circle(${(progress * full).toFixed(1)}px at ${x.toFixed(0)}px ${y.toFixed(0)}px)`;
}
