import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useDismiss } from "../hooks/useDismiss";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { cn } from "../lib/cn";
import type { MorphOption, MorphSection } from "../lib/types";
import { CheckIcon, ChevronIcon, SearchIcon } from "./icons";

export type MorphDropdownBaseProps = {
  label: string;
  placeholder?: string;
  options?: MorphOption[];
  sections?: MorphSection[];
  searchable?: boolean;
  className?: string;
  panelWidth?: number;
};

export type MorphDropdownSingleProps = MorphDropdownBaseProps & {
  multiple?: false;
  value: string | null;
  onChange: (value: string) => void;
};

export type MorphDropdownMultiProps = MorphDropdownBaseProps & {
  multiple: true;
  value: string[];
  onChange: (value: string[]) => void;
};

export type MorphDropdownProps = MorphDropdownSingleProps | MorphDropdownMultiProps;

type FlatItem = MorphOption & { sectionId?: string };

const spring = { type: "spring" as const, stiffness: 420, damping: 34, mass: 0.78 };

function flatten(options: MorphOption[] | undefined, sections: MorphSection[] | undefined): FlatItem[] {
  if (sections?.length) {
    return sections.flatMap((section) =>
      section.options.map((option) => ({ ...option, sectionId: section.id })),
    );
  }
  return options ?? [];
}

function isSelected(multiple: boolean, value: string | string[] | null, id: string): boolean {
  if (multiple) {
    return Array.isArray(value) && value.includes(id);
  }
  return value === id;
}

export function MorphDropdown(props: MorphDropdownProps) {
  const {
    label,
    placeholder = "Select…",
    options,
    sections,
    searchable = false,
    className,
    panelWidth = 320,
    multiple = false,
    value,
  } = props;

  const reactId = useId();
  const listboxId = `${reactId}-listbox`;
  const triggerId = `${reactId}-trigger`;
  const searchId = `${reactId}-search`;

  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [height, setHeight] = useState(48);

  const items = useMemo(() => flatten(options, sections), [options, sections]);

  const visibleItems = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return items;
    }
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(needle) ||
        item.description?.toLowerCase().includes(needle),
    );
  }, [items, query]);

  const visibleSections = useMemo(() => {
    if (!sections?.length) {
      return null;
    }
    return sections
      .map((section) => ({
        ...section,
        options: section.options.filter((option) => visibleItems.some((item) => item.id === option.id)),
      }))
      .filter((section) => section.options.length > 0);
  }, [sections, visibleItems]);

  const selectedLabels = useMemo(() => {
    if (multiple && Array.isArray(value)) {
      return items.filter((item) => value.includes(item.id)).map((item) => item.label);
    }
    if (!multiple && typeof value === "string") {
      const match = items.find((item) => item.id === value);
      return match ? [match.label] : [];
    }
    return [];
  }, [items, multiple, value]);

  const triggerText =
    selectedLabels.length === 0
      ? placeholder
      : multiple
        ? selectedLabels.length === 1
          ? selectedLabels[0]
          : `${selectedLabels.length} selected`
        : selectedLabels[0];

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  }, []);

  const openPanel = useCallback(() => {
    setOpen(true);
    const firstEnabled = visibleItems.find((item) => !item.disabled);
    setActiveId(firstEnabled?.id ?? null);
  }, [visibleItems]);

  useDismiss(open, rootRef, close);
  useFocusTrap(open, panelRef);

  useLayoutEffect(() => {
    const node = measureRef.current;
    if (!node) {
      return;
    }
    const next = open ? node.scrollHeight : 48;
    setHeight(next);
  }, [open, query, visibleItems, selectedLabels.length]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const target = searchable ? searchRef.current : panelRef.current?.querySelector<HTMLElement>('[role="option"]');
    target?.focus();
  }, [open, searchable]);

  const selectItem = useCallback(
    (item: FlatItem) => {
      if (item.disabled) {
        return;
      }

      if (props.multiple) {
        const current = props.value;
        const next = current.includes(item.id)
          ? current.filter((id) => id !== item.id)
          : [...current, item.id];
        props.onChange(next);
        return;
      }

      props.onChange(item.id);
      close();
    },
    [close, props],
  );

  const moveActive = useCallback(
    (delta: number) => {
      if (visibleItems.length === 0) {
        return;
      }
      const enabled = visibleItems.filter((item) => !item.disabled);
      if (enabled.length === 0) {
        return;
      }
      const currentIndex = enabled.findIndex((item) => item.id === activeId);
      const nextIndex =
        currentIndex === -1
          ? delta > 0
            ? 0
            : enabled.length - 1
          : (currentIndex + delta + enabled.length) % enabled.length;
      setActiveId(enabled[nextIndex].id);
    },
    [activeId, visibleItems],
  );

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) {
          openPanel();
        } else {
          moveActive(1);
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!open) {
          openPanel();
        } else {
          moveActive(-1);
        }
        break;
      case "Enter":
      case " ": {
        event.preventDefault();
        if (!open) {
          openPanel();
          break;
        }
        const current = visibleItems.find((item) => item.id === activeId);
        if (current) {
          selectItem(current);
        }
        break;
      }
      default:
        break;
    }
  };

  const onPanelKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveActive(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveActive(-1);
        break;
      case "Home":
        event.preventDefault();
        setActiveId(visibleItems.find((item) => !item.disabled)?.id ?? null);
        break;
      case "End": {
        event.preventDefault();
        const last = [...visibleItems].reverse().find((item) => !item.disabled);
        setActiveId(last?.id ?? null);
        break;
      }
      case "Enter":
      case " ": {
        if (event.target instanceof HTMLInputElement && event.key === " ") {
          return;
        }
        event.preventDefault();
        const current = visibleItems.find((item) => item.id === activeId);
        if (current) {
          selectItem(current);
        }
        break;
      }
      default: {
        if (event.key.length === 1 && !searchable && !event.metaKey && !event.ctrlKey) {
          const needle = event.key.toLowerCase();
          const match = visibleItems.find((item) => item.label.toLowerCase().startsWith(needle));
          if (match) {
            setActiveId(match.id);
          }
        }
        break;
      }
    }
  };

  const transition = reduceMotion ? { duration: 0.01 } : spring;

  const renderOption = (item: FlatItem) => {
    const selected = isSelected(Boolean(multiple), value, item.id);
    const active = activeId === item.id;
    return (
      <div
        key={item.id}
        id={`${reactId}-opt-${item.id}`}
        role="option"
        tabIndex={-1}
        aria-selected={selected}
        aria-disabled={item.disabled || undefined}
        className={cn(
          "mx-1.5 flex cursor-pointer items-center gap-3 rounded-[12px] px-2.5 py-2 outline-none transition-colors",
          item.disabled && "cursor-not-allowed opacity-40",
          active && "bg-white/8",
          selected && !active && "bg-white/[0.04]",
        )}
        onMouseEnter={() => setActiveId(item.id)}
        onClick={() => selectItem(item)}
      >
        <span
          className={cn(
            "grid h-5 w-5 shrink-0 place-items-center rounded-md border border-white/12 text-[11px]",
            selected && "border-transparent bg-[var(--accent)] text-[var(--ink)]",
          )}
          aria-hidden
        >
          <AnimatePresence initial={false}>
            {selected ? (
              <motion.span
                key="check"
                initial={reduceMotion ? false : { scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.4, opacity: 0 }}
              >
                <CheckIcon />
              </motion.span>
            ) : null}
          </AnimatePresence>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14px] font-medium tracking-[-0.01em] text-[var(--paper)]">
            {item.label}
          </span>
          {item.description ? (
            <span className="block truncate text-[12px] text-[var(--mute)]">{item.description}</span>
          ) : null}
        </span>
      </div>
    );
  };

  return (
    <div ref={rootRef} className={cn("relative inline-block text-left", className)}>
      <motion.div
        ref={panelRef}
        animate={{ height, width: open ? panelWidth : 240 }}
        transition={transition}
        className="morph-shell relative z-20 overflow-hidden"
        onKeyDown={onPanelKeyDown}
      >
        <div ref={measureRef}>
          <button
            ref={triggerRef}
            id={triggerId}
            type="button"
            className="flex h-12 w-full items-center justify-between gap-3 px-3.5 text-left"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-label={label}
            onClick={() => (open ? close() : openPanel())}
            onKeyDown={onTriggerKeyDown}
          >
            <span className="min-w-0">
              <span className="block text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--mute)]">
                {label}
              </span>
              <span
                className={cn(
                  "block truncate text-[14px] font-medium tracking-[-0.015em]",
                  selectedLabels.length ? "text-[var(--paper)]" : "text-[var(--mute)]",
                )}
              >
                {triggerText}
              </span>
            </span>
            <motion.span
              aria-hidden
              animate={{ rotate: open ? 180 : 0 }}
              transition={transition}
              className="grid h-7 w-7 place-items-center rounded-full bg-white/6 text-[var(--paper)]"
            >
              <ChevronIcon />
            </motion.span>
          </button>

          {open ? (
              <motion.div
                key="body"
                initial={reduceMotion ? false : { opacity: 0, filter: "blur(6px)", y: -6 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{ duration: reduceMotion ? 0.01 : 0.22, delay: reduceMotion ? 0 : 0.04 }}
              >
                <div className="mx-3 h-px bg-white/8" />
                {searchable ? (
                  <label className="mx-3 mt-2 flex items-center gap-2 rounded-[12px] bg-white/5 px-2.5 py-2 text-[var(--mute)]">
                    <SearchIcon />
                    <span className="sr-only">Filter options</span>
                    <input
                      ref={searchRef}
                      id={searchId}
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Type to seek…"
                      className="w-full bg-transparent text-[13px] text-[var(--paper)] outline-none placeholder:text-[var(--mute)]"
                    />
                  </label>
                ) : null}

                <div
                  id={listboxId}
                  role="listbox"
                  aria-labelledby={triggerId}
                  aria-multiselectable={multiple || undefined}
                  aria-activedescendant={activeId ? `${reactId}-opt-${activeId}` : undefined}
                  className="max-h-72 overflow-auto py-1.5"
                >
                  {visibleSections
                    ? visibleSections.map((section) => (
                        <div key={section.id} role="group" aria-label={section.label} className="pb-1">
                          <div className="px-4 pb-1 pt-2 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--mute)]">
                            {section.label}
                          </div>
                          {section.options.map((option) => renderOption(option))}
                        </div>
                      ))
                    : visibleItems.map((item) => renderOption(item))}
                  {visibleItems.length === 0 ? (
                    <p className="px-4 py-3 text-[13px] text-[var(--mute)]">No matches.</p>
                  ) : null}
                </div>
              </motion.div>
            ) : null}
        </div>
      </motion.div>
    </div>
  );
}
