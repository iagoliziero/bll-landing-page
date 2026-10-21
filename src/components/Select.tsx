"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type Ref } from "react";
import { IconCheck, IconChevronDown } from "@tabler/icons-react";
import { getSmoothScroller } from "@/lib/scroll";

type Option = { value: string; hint: string };

type SelectProps = {
  name: string;
  label: string;
  placeholder: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  describedBy?: string;
  ref?: Ref<HTMLDivElement>;
};

// Lista de escolha com o visual do formulário, no padrão "select-only combobox"
// do WAI-ARIA. Setas, Home/End, Enter/Espaço, Esc, Tab e a busca pela letra
// inicial funcionam como num select nativo, e o leitor de tela anuncia o item
// ativo. O valor vai para o formulário num input escondido.
export function Select({ name, label, placeholder, options, value, onChange, invalid, describedBy, ref }: SelectProps) {
  const id = useId();
  const labelId = `${id}-label`;
  const listId = `${id}-list`;
  const optionId = (index: number) => `${id}-option-${index}`;

  const rootRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typed = useRef({ text: "", time: 0 });
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const selectedIndex = options.findIndex((option) => option.value === value);
  const last = options.length - 1;

  const setBoxRef = (node: HTMLDivElement | null) => {
    boxRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  const openList = (index = Math.max(selectedIndex, 0)) => {
    setActive(index);
    setOpen(true);
  };
  const choose = (index: number) => {
    if (index >= 0) onChange(options[index].value);
    setOpen(false);
  };

  // Fecha ao tocar ou clicar fora
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Se a lista abrir abaixo da dobra (no celular), rola o suficiente para ela caber
  useEffect(() => {
    if (!open || !listRef.current) return;
    const overflow = listRef.current.getBoundingClientRect().bottom - (window.innerHeight - 16);
    if (overflow <= 0) return;
    const lenis = getSmoothScroller();
    if (lenis) lenis.scrollTo(window.scrollY + overflow, { duration: 0.5 });
    else window.scrollBy({ top: overflow, behavior: "smooth" });
  }, [open]);

  // Busca pela letra: digitar "m" vai para Mobilidade; "re" para Recuperação
  const findByTyping = (key: string) => {
    const now = Date.now();
    const state = typed.current;
    state.text = now - state.time > 700 ? key : state.text + key;
    state.time = now;
    const query = state.text.toLocaleLowerCase("pt-BR");
    const from = state.text.length === 1 ? (open ? active : selectedIndex) + 1 : Math.max(open ? active : selectedIndex, 0);
    for (let step = 0; step < options.length; step++) {
      const index = (from + step) % options.length;
      if (options[index].value.toLocaleLowerCase("pt-BR").startsWith(query)) return index;
    }
    return -1;
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const { key } = event;
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(key)) {
        event.preventDefault();
        openList();
      } else if (key === "Home" || key === "End") {
        event.preventDefault();
        openList(key === "Home" ? 0 : last);
      }
    } else if (key === "ArrowDown" || key === "ArrowUp") {
      event.preventDefault();
      if (key === "ArrowUp" && event.altKey) choose(active);
      else setActive((index) => Math.min(last, Math.max(0, index + (key === "ArrowDown" ? 1 : -1))));
      return;
    } else if (key === "Home" || key === "End") {
      event.preventDefault();
      setActive(key === "Home" ? 0 : last);
      return;
    } else if (key === "Enter" || key === " ") {
      event.preventDefault();
      choose(active);
      return;
    } else if (key === "Escape") {
      event.preventDefault();
      setOpen(false);
      return;
    } else if (key === "Tab") {
      choose(active);
      return;
    }

    if (key.length === 1 && key !== " " && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const index = findByTyping(key);
      if (index >= 0) openList(index);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <span id={labelId} className="mb-1 block text-caption text-white/72" onClick={() => boxRef.current?.focus()}>
        {label}
      </span>
      <div
        ref={setBoxRef}
        role="combobox"
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={labelId}
        aria-activedescendant={open && active >= 0 ? optionId(active) : undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onKeyDown={onKeyDown}
        onClick={() => (open ? setOpen(false) : openList())}
        className={`flex w-full cursor-pointer items-center justify-between gap-3 border-b border-white/35 py-2.5 text-left text-intro outline-none transition-[border-color,box-shadow] duration-300 select-none focus:border-verde-vivo focus:shadow-[0_1px_0_var(--color-verde-vivo)] aria-expanded:border-verde-vivo aria-invalid:border-erro ${
          selectedIndex >= 0 ? "text-white" : "text-menta/80"
        }`}
      >
        <span className="truncate">{selectedIndex >= 0 ? value : placeholder}</span>
        <IconChevronDown
          aria-hidden="true"
          className={`size-4 shrink-0 text-white/72 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </div>
      <input type="hidden" name={name} value={value} />

      <ul
        ref={listRef}
        id={listId}
        role="listbox"
        aria-labelledby={labelId}
        tabIndex={-1}
        data-open={open || undefined}
        data-lenis-prevent
        className="select-list absolute inset-x-0 top-full z-20 mt-2 rounded-panel border border-white/15 bg-verde-escuro p-1.5 lg:right-auto lg:w-[max(100%,21rem)]"
      >
        {options.map((option, index) => {
          const selected = index === selectedIndex;
          return (
            <li
              key={option.value}
              id={optionId(index)}
              role="option"
              aria-selected={selected}
              data-active={index === active || undefined}
              onPointerMove={() => setActive(index)}
              onPointerDown={(event) => event.preventDefault()}
              onClick={() => {
                choose(index);
                boxRef.current?.focus();
              }}
              className="flex cursor-pointer items-start justify-between gap-3 rounded-lg px-3.5 py-2.5 transition-colors duration-200 data-active:bg-white/10"
            >
              <span>
                <span className={`block text-lead text-white ${selected ? "font-semibold" : ""}`}>{option.value}</span>
                <span className="mt-0.5 block text-caption text-white/65">{option.hint}</span>
              </span>
              {selected && <IconCheck aria-hidden="true" className="mt-0.5 size-4.5 shrink-0 text-verde-vivo" />}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
