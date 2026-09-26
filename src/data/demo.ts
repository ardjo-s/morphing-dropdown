import type { MorphOption, MorphSection } from "../lib/types";

export const destinations: MorphOption[] = [
  {
    id: "atlas",
    label: "Atlas Studio",
    description: "Primary workspace",
  },
  {
    id: "lumen",
    label: "Lumen Archive",
    description: "Research vault",
  },
  {
    id: "north",
    label: "Northwind Lab",
    description: "Prototype bench",
  },
  {
    id: "oriole",
    label: "Oriole Press",
    description: "Editorial desk",
  },
  {
    id: "kiln",
    label: "Kiln Foundry",
    description: "Type & motion",
  },
];

export const disciplines: MorphOption[] = [
  { id: "motion", label: "Motion design" },
  { id: "type", label: "Typography" },
  { id: "a11y", label: "Accessibility" },
  { id: "systems", label: "Design systems" },
  { id: "research", label: "Interface research" },
  { id: "sound", label: "Sound & haptics" },
];

export const nestedLibrary: MorphSection[] = [
  {
    id: "spaces",
    label: "Spaces",
    options: [
      { id: "gallery", label: "Public gallery", description: "Shipped studies" },
      { id: "night", label: "Night desk", description: "In progress" },
      { id: "greenhouse", label: "Greenhouse", description: "Seeds only" },
    ],
  },
  {
    id: "recent",
    label: "Recent",
    options: [
      { id: "capsule", label: "Capsule morph v3" },
      { id: "focus", label: "Focus trap notes" },
      { id: "spring", label: "Spring curve sheet" },
    ],
  },
];

export const commands: MorphOption[] = [
  { id: "new-file", label: "New file", description: "⌘ N" },
  { id: "new-folder", label: "New folder", description: "⇧ ⌘ N" },
  { id: "share", label: "Share selection", description: "⌘ ⇧ S" },
  { id: "inspect", label: "Inspect motion", description: "⌥ I" },
  { id: "prefs", label: "Preferences", description: "⌘ ," },
];
