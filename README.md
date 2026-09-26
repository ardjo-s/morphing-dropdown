# Morphing Dropdown

Public interface study for **THEWHATIF.COMPANY**.

A dropdown whose trigger and panel share one surface. The capsule does not yield to a menu — it becomes the menu. Inspired by the vault morph from [@koppkev](https://x.com/koppkev/status/2103378630797595109).

Live playground variants:

- **Default** — single select
- **Multi-select** — checks accumulate, panel stays open
- **Nested sections** — grouped options; headers are not focus targets
- **Keyboard first** — typeahead search, arrow keys, Escape restores focus

## Stack

Vite · React 19 · TypeScript · Tailwind CSS 4 · Motion (Framer Motion)

## Local development

```bash
npm install
npm run dev
```

App: [http://localhost:5173](http://localhost:5173)

```bash
npm test          # accessibility + keyboard checks
npm run build     # production build to dist/
npm run preview   # serve the production build
```

## Using the component

```tsx
import { MorphDropdown } from "./components/MorphDropdown";

<MorphDropdown
  label="Workspace"
  options={[
    { id: "atlas", label: "Atlas Studio", description: "Primary workspace" },
  ]}
  value={value}
  onChange={setValue}
/>

<MorphDropdown
  multiple
  label="Disciplines"
  options={disciplines}
  value={selected}
  onChange={setSelected}
/>

<MorphDropdown
  searchable
  label="Library"
  sections={nestedLibrary}
  value={current}
  onChange={setCurrent}
/>
```

### Props

| Prop | Type | Notes |
| --- | --- | --- |
| `label` | `string` | Visible field caption and accessible name |
| `options` | `MorphOption[]` | Flat list |
| `sections` | `MorphSection[]` | Grouped list; takes precedence over `options` |
| `value` / `onChange` | `string \| null` or `string[]` | Discriminated by `multiple` |
| `multiple` | `boolean` | Keep the panel open while toggling |
| `searchable` | `boolean` | Filter field inside the morph |
| `placeholder` | `string` | Closed-state prompt |
| `panelWidth` | `number` | Open width in pixels (default `320`) |

### Accessibility

- Trigger: `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls`
- Panel: `role="listbox"`, options with `aria-selected`
- Focus trap while open; **Escape** closes and returns focus to the trigger
- **↓ / Enter / Space** open; **↑ ↓ Home End** move; type a letter to seek
- Click / pointer outside dismisses
- `prefers-reduced-motion` short-circuits the spring

## Cloudflare Pages

This repo is a static Vite SPA. Output directory is `dist/`.

### Option A — Git connected to Pages (permanent `*.pages.dev`)

1. Push `main` (already the production branch).
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Import a Git repository**.
3. Select `ardjo-s/morphing-dropdown`.
4. Build settings:

   | Field | Value |
   | --- | --- |
   | Framework preset | Vite |
   | Production branch | `main` |
   | Build command | `npm run build` |
   | Build output directory | `dist` |

5. Deploy. The production URL is `https://<project>.pages.dev`.

### Option B — Wrangler CLI (Pages)

Requires Cloudflare auth (`npx wrangler login` or `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`).

```bash
npx wrangler pages project create thewhatif-morphing-dropdown --production-branch main
npm run deploy
# same as:
# npm run build && npx wrangler pages deploy dist --project-name thewhatif-morphing-dropdown --branch main
```

### Option C — Temporary preview without an account

Wrangler 4.102+ can deploy static assets to a 60-minute preview account:

```bash
npm run deploy:preview
# same as: npm run build && npx wrangler deploy --temporary
```

Wrangler prints a live `*.workers.dev` URL and a **claim URL**. Open the claim URL within 60 minutes to attach the deploy to a real Cloudflare account. After claiming, connect the GitHub repo to Pages (Option A) for a stable `*.pages.dev` hostname.

`wrangler.jsonc` is already configured as a single-page application (`not_found_handling: "single-page-application"`). `public/_redirects` also SPA-fallbacks for classic Pages.

## Project map

```
src/components/MorphDropdown.tsx   shared morphing shell
src/App.tsx                        landing + four variants
src/hooks/                         focus trap + dismiss
wrangler.jsonc                     Workers / Pages static assets
```

THEWHATIF.COMPANY — what if a dropdown didn't pop?
