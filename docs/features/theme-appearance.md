---
title: Theme appearance
type: component
created: 2026-10-14
updated: 2026-11-07
status: active
confidence: high
tags: [theme, css, appearance]
sources:
  - src/theme/base.css
  - src/theme/chat.css
  - src/theme/integrations.css
  - themes/pokecut.css
  - theme.test.ts
  - package.json
  - scripts/build-theme.mjs
  - theme-mode.tsx
  - theme-active.ts
  - app.tsx
  - NOTICE
---

# Theme appearance

TL;DR: The Pokecut theme combines light/dark palettes, BB shell layout rules, chat styling, and integration styling in a generated CSS file selected through BB's theme system.

## Purpose

The theme provides a gray shell, a raised content panel, card-based surfaces, and a pink-violet accent for BB's interface. The plugin manifest registers theme id `pokecut` and points it at `themes/pokecut.css` (`package.json:17-24`).

## How it works

1. BB loads `themes/pokecut.css` when Pokecut is selected (`package.json:17-24`).
2. The build script concatenates `base.css`, `chat.css`, and `integrations.css` in that order; `--check` compares generated content with the committed output (`scripts/build-theme.mjs:4-25`).
3. `base.css` defines `:root, .light` and `.dark` token blocks and shell selectors (`src/theme/base.css:14-35`, `src/theme/base.css:100-120`).
4. The app detects the selected theme through computed `--pk-theme`; it removes app-owned enhancements when another theme becomes active (`theme-active.ts:6-21`, `app.tsx:28-43`).
5. The sidebar footer theme switch writes `light`, `dark`, or `system` to BB's `bb.theme` local-storage key and dispatches a storage event (`theme-mode.tsx:9-26`, `theme-mode.tsx:43-67`).

### Modes

| Mode or surface | Difference | Source |
|---|---|---|
| Light | Uses `:root, .light` palette variables (`--canvas: #fafafa`, `--pk-shell: #ededed`, `--primary: #9b4d8f`) | `src/theme/base.css:14-98` |
| Dark | Uses `.dark` palette variables (`--canvas: #16181d`, `--pk-shell: #0e1014`, `--primary: #d88bc4`) | `src/theme/base.css:100-172` |
| System | Stored as `system`; BB resolves appearance using its own theme mechanism | `theme-mode.tsx:9-20` |
| Desktop browser shell | Gated by desktop media queries (`min-width: 768px`) and `:root:not(:has([data-framed]:not([data-framed="false"])))`; pads rail controls by 6px (`--bb-sidebar-rail-padding: 6px`) for a 36px rail (48px with gutter), translates the sidebar trigger overlay by `var(--pk-gap)` to align the toggle, rail icons, and settings on one column, and sizes collapsed panel to rail geometry | `src/theme/base.css:183-209`, `src/theme/base.css:509-528`, `theme.test.ts:454-458` |
| Framed window (`data-framed`) | Gated by `[data-framed]:not([data-framed="false"])`; strips frame lip, lifts `[data-sidebar="inset"]` by `calc(-1 * var(--bb-window-title-bar-height, 0px))` so the panel reaches the window top, keeps the header as a card level with window traffic lights with `app-region: no-drag` controls, and transparentizes framed footer body | `src/theme/base.css:552-569`, `src/theme/base.css:588-636`, `theme.test.ts:361-375`, `theme.test.ts:404-421` |
| Phone shell | Gated by narrow media queries (`max-width: 767px`); left drawer is shell, pushed thread is raised panel, right panel shelf is a rounded card, composer context row tightens chips, and shell rules keep literal radii | `src/theme/base.css:791-808`, `src/theme/base.css:1216-1307`, `theme.test.ts:384-390` |

## Visual surfaces

| Surface | Light token | Dark token | Evidence |
|---|---|---|---|
| Shell | `--pk-shell` (`#ededed`) | `--pk-shell` (`#0e1014`) | `src/theme/base.css:76-78`, `src/theme/base.css:155-157` |
| Main content panel | `--canvas` (`#fafafa`) | `--canvas` (`#16181d`) | `src/theme/base.css:17-19`, `src/theme/base.css:102-104` |
| Cards | `--pk-card` (`#ffffff`) | `--pk-card` (`#1b1e24`) | `src/theme/base.css:78-80`, `src/theme/base.css:157-159` |
| Primary accent | `--primary` (`#9b4d8f`) | `--primary` (`#d88bc4`) | `src/theme/base.css:19-21`, `src/theme/base.css:104-106` |
| Send action | `--pk-accent-gradient` | `--pk-accent-gradient` | `src/theme/base.css:85-88`, `src/theme/base.css:849-874` |

At desktop widths, the sidebar tucks under the inset panel with real geometry (`src/theme/base.css:183-209`, `theme.test.ts:71-100`). Beside the icon rail, the sidebar body block fits its column (`left: 0; width: auto !important;`), ensuring project cards and the New project button preserve their 11px inset from the rail and align with the footer card (`src/theme/base.css:270-279`, `theme.test.ts:438-444`).

The 12px sidebar edge resize handle sits wholly on the sidebar side (`right: 0`), preventing the content panel and list scrollbar from obscuring drag targets (`src/theme/base.css:342-348`, `theme.test.ts:428-430`). The usage tracker details card escapes footer clipping on both `sidebar-footer-row` and BB 0.47+ `sidebar-footer-body` markup (`src/theme/base.css:306-316`, `src/theme/base.css:810-819`, `theme.test.ts:392-401`).

In the browser, the icon rail padding is set to 6px (`--bb-sidebar-rail-padding: 6px`) to produce a 36px rail (48px with gutter), the sidebar trigger overlay is translated by `--pk-gap` to align navigation on a single column, and the collapsed panel width sizes to the rail control and padding (`src/theme/base.css:509-528`, `theme.test.ts:454-458`).

In framed window mode (`data-framed`), the inset reaches the window top (`margin-top: calc(-1 * var(--bb-window-title-bar-height, 0px))`), the header card sits level with window controls with clickable buttons (`app-region: no-drag`), and framed sidebar footer bodies are transparentized (`src/theme/base.css:552-569`, `src/theme/base.css:588-643`, `theme.test.ts:361-375`, `theme.test.ts:404-421`).

Below 768px, the left drawer remains the shell, the pushed thread becomes the raised panel, the right panel content is drawn as a rounded card (`src/theme/base.css:1216-1253`), and the composer context row uses outlined chips with narrow-screen spacing adjustments (`src/theme/base.css:1159-1214`, `src/theme/base.css:1255-1301`).

The chat stylesheet styles BB's composer, user messages, code, work rows, loaders, approval cards, banners, and tooltips (`src/theme/chat.css:36-50`, `src/theme/chat.css:105-122`, `src/theme/chat.css:138-183`, `src/theme/chat.css:340-350`, `src/theme/chat.css:425-447`). Pending-label shimmer runs on the compositor via `pk-shimmer-pulse` opacity pulsing instead of main-thread `background-position` animations, avoiding frame drops and style recalculations during active runs (`src/theme/chat.css:304-320`, `theme.test.ts:423-426`).

The model picker provides provider tabs, a selected-model row, sparkle favorites, and segmented reasoning controls (`src/theme/base.css:926-1086`). The Lane Pilot composer action button is rendered as a 28px icon chip with the agents glyph while preserving its accessible label; it illuminates with accent tint when active (`data-lp-agent="lane-pilot" | "specialist"`, or for older versions lacking `data-lp-agent`, any label that is not an off label) (`src/theme/base.css:876-920`, `theme.test.ts:432-436`). The integration stylesheet recolors Git History through its `--gh-*` and `--git-ref-*` variables and styles BB's diff file cards (`src/theme/integrations.css:1-25`, `src/theme/integrations.css:74-90`).

The light and dark palettes are defined in the theme CSS (`src/theme/base.css:14-21`, `src/theme/base.css:100-108`). The [overview](../overview.md) describes the plugin parts, and [architecture](../architecture.md) shows their BB runtime boundary.

The chat layer and message timestamps carry upstream MIT attributions in [NOTICE](../../NOTICE) (`NOTICE:1-6`, `NOTICE:29-34`).

### Failures

- If the generated CSS is stale, `node scripts/build-theme.mjs --check` exits with an error; rerun `npm run build:theme` (`scripts/build-theme.mjs:22-25`).
- If the stylesheet size exceeds 256,000 bytes during build, the theme build script throws an error (`scripts/build-theme.mjs:18-19`).
- If the stylesheet size exceeds 256,000 bytes, the test suite asserts failure (`theme.test.ts:14-19`).
- If writing the theme mode to local storage throws, `readThemeMode` falls back to `system`; `writeThemeMode` itself does not catch storage errors (`theme-mode.tsx:13-26`).
- When Pokecut is not active, app-driven DOM enhancements are unmounted; CSS theme rules are no longer selected by BB (`theme-active.ts:6-21`, `app.tsx:28-43`).

## Business rules

- The generated output order is base, chat, integrations (`scripts/build-theme.mjs:4-11`).
- Palette blocks remain at the beginning of the output for BB theme tooling (`theme.test.ts:21-26`).
- The generated stylesheet size is constrained below 256,000 bytes by the build script (`scripts/build-theme.mjs:11-19`).
- The test suite asserts that the bundled theme size remains under 256,000 bytes (`theme.test.ts:14-19`).
- Browser rail navigation maintains a single icon column by sizing the rail padding to 6px, translating the sidebar trigger overlay by `var(--pk-gap)`, and sizing the collapsed panel to rail geometry (`src/theme/base.css:509-528`, `theme.test.ts:454-458`).
- The sidebar edge resize handle is anchored to the sidebar (`right: 0`) to keep all 12px grabbable without panel interference (`src/theme/base.css:342-348`, `theme.test.ts:428-430`).
- Sidebar body containers beside the rail fit their column (`left: 0; width: auto !important;`) so project cards and the New project button preserve their 11px gap from the icon rail (`src/theme/base.css:276-279`, `theme.test.ts:439-444`).
- The Lane Pilot composer action is lit only when Lane Pilot or an agent is active (`data-lp-agent="lane-pilot"` or `"specialist"`, or for older versions lacking `data-lp-agent`, any label that is not an off label) (`src/theme/base.css:914-920`, `theme.test.ts:432-436`).
- Pending-label shimmer runs on the compositor using opacity pulsing (`pk-shimmer-pulse`) rather than background-position text animation loops (`src/theme/chat.css:309-319`, `theme.test.ts:423-426`).
- In framed windows (`data-framed`), interactive controls in the title-bar header row are marked `app-region: no-drag` so they remain clickable within the window-drag area (`src/theme/base.css:630-636`, `theme.test.ts:413-416`).

## Public API

| Import or entry | File | Purpose |
|---|---|---|
| `themeIsActive`, `useThemeActive` | `theme-active.ts:6-21` | Detect theme selection and subscribe to changes |
| `THEME_MODES`, `readThemeMode`, `writeThemeMode`, `ThemeModeIcon`, `ThemeModeSwitch` | `theme-mode.tsx:9-67` | Read and edit BB's light/dark/system preference |
| Theme manifest entry | `package.json:17-24` | Expose theme CSS to BB |

## Gotchas

- Edit the three files under `src/theme/`; the bundled `themes/pokecut.css` is generated (`themes/pokecut.css:1`, `scripts/build-theme.mjs:4-25`).
- CSS targets BB's DOM attributes and classes; markup changes can invalidate selectors, as evidenced by selector-specific regression tests (`theme.test.ts:32-458`).
- The theme-mode switch shares BB's `bb.theme` preference, rather than a Pokecut-specific setting (`theme-mode.tsx:1-26`).
- In framed windows (`data-framed`), the page header occupies the window title-bar drag region; interactive controls in that row must explicitly specify `app-region: no-drag` to remain clickable (`src/theme/base.css:630-636`, `theme.test.ts:413-416`).
- Animating `background-position` on clipped text forces main-thread style recalculations every frame during live runs; pending-label animations use compositor-friendly `opacity` pulsing instead (`src/theme/chat.css:305-320`, `theme.test.ts:423-426`).
- BB 0.47 updated sidebar structures (dropping footer row wrappers for `sidebar-footer-body` and sizing `nav-rail-sidebar-body` as a right-aligned block); rules must account for both structures so cards and usage popups do not clip or under-run the rail (`src/theme/base.css:270-279`, `src/theme/base.css:303-316`, `src/theme/base.css:810-819`, `theme.test.ts:392-401`, `theme.test.ts:439-444`).

<!-- lane-pilot:backlinks -->
## Referenced by

- [Architecture](../architecture.md)
- [Pokecut Theme for BB overview](../overview.md)
