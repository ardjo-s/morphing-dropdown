import type { ReactNode } from "react";

export type MorphOption = {
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  disabled?: boolean;
};

export type MorphSection = {
  id: string;
  label: string;
  options: MorphOption[];
};

export type DemoVariant = "default" | "multi" | "nested" | "keyboard";

export function variantCopy(variant: DemoVariant): {
  eyebrow: string;
  title: string;
  body: string;
} {
  switch (variant) {
    case "default":
      return {
        eyebrow: "01 — Single select",
        title: "Default",
        body: "One choice. The capsule expands, the list arrives, the trigger label becomes the selection.",
      };
    case "multi":
      return {
        eyebrow: "02 — Collection",
        title: "Multi-select",
        body: "Keep the panel open. Checks accumulate. The trigger reports the set without collapsing the morph.",
      };
    case "nested":
      return {
        eyebrow: "03 — Groups",
        title: "Nested sections",
        body: "Section labels stay inert. Arrow keys skip them. The surface grows to hold the hierarchy.",
      };
    case "keyboard":
      return {
        eyebrow: "04 — Hands on keys",
        title: "Keyboard first",
        body: "Open with ↓. Move with arrows. Type to seek. Escape restores focus to the trigger.",
      };
    default: {
      const _exhaustive: never = variant;
      return _exhaustive;
    }
  }
}
