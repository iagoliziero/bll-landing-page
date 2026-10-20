// Cursor de anel + ponto. Só aparece com mouse e sem reduced motion (efeito cursor).
export function Cursor() {
  return (
    <div aria-hidden="true">
      <div data-cursor-ring className="cursor-ring" />
      <div data-cursor-dot className="cursor-dot" />
    </div>
  );
}
