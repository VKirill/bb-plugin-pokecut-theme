---
title: Theme appearance
type: component
created: 2026-10-14
updated: 2026-10-18
status: active
confidence: medium
tags: [theme, css, appearance]
sources:
  - package.json
  - src/theme/base.css
  - src/theme/chat.css
  - src/theme/integrations.css
  - scripts/build-theme.mjs
  - themes/pokecut.css
  - theme.test.ts
  - theme-mode.tsx
  - theme-active.ts
  - app.tsx
  - NOTICE
---

# Theme appearance

TL;DR: The Pokecut theme combines light/dark palettes, BB shell layout rules, chat styling, and integration styling in a generated CSS file selected through BB's theme system.

## Purpose

The theme provides a gray shell, a raised content panel, card-based surfaces, and a pink-violet accent for BB's interface. The plugin manifest registers theme id `pokecut` and points it at `themes/pokecut.css` (`package.json:17-23`).

## How it works

1. BB loads `themes/pokecut.css` when Pokecut is selected (`package.json:17-23`).
2. The build script concatenates `base.css`, `chat.css`, and `integrations.css` in that order; `--check` compares generated content with the committed output (`scripts/build-theme.mjs:4-25`).
3. `base.css` defines `:root, .light` and `.dark` token blocks and shell selectors (`src/theme/base.css:1-35`).
4. The app detects the selected theme through computed `--pk-theme`; it removes app-owned enhancements when another theme becomes active (`theme-active.ts:1-20`, `app.tsx:27-43`).
5. The sidebar footer theme switch writes `light`, `dark`, or `system` to BB's `bb.theme` local-storage key and dispatches a storage event (`theme-mode.tsx:9-30`, `theme-mode.tsx:43-65`).

### Modes

| Mode or surface | Difference | Source |
|---|---|---|
| Light | Uses `:root, .light` palette variables | `src/theme/base.css:1-25` |
| Dark | Uses `.dark` palette variables | `src/theme/base.css:100-172` |
| System | Stored as `system`; BB resolves appearance using its own theme mechanism | `theme-mode.tsx:9-25` |
| Desktop shell | Shell rules are gated by desktop media queries and BB sidebar markup | `src/theme/base.css:190-220` |
| Phone shell | Phone drawer and composer rules are gated by narrow-width media queries | `src/theme/base.css:670-700`, `src/theme/base.css:1072-1090` |

## Visual surfaces

| Surface | Light | Dark | Evidence |
|---|---|---|---|
| Shell | `#EDEDED` | `#0E1014` | `src/theme/base.css:54-59`, `src/theme/base.css:139-144`, `src/theme/base.css:156-160` |
| Main content panel | `#FAFAFA`, with a 20px radius | `#16181D`, with a 20px radius | `src/theme/base.css:14-20`, `src/theme/base.css:90-97`, `src/theme/base.css:100-108`, `src/theme/base.css:165-171` |
| Cards | `#FFFFFF` | `#1B1E24` | `src/theme/base.css:23-25`, `src/theme/base.css:108-110` |
| Primary accent | `#9B4D8F` | `#D88BC4` | `src/theme/base.css:18-21`, `src/theme/base.css:103-106` |
| Send action | Pink-to-violet gradient | Same gradient | `src/theme/base.css:85-88`, `src/theme/base.css:707-714` |

At desktop widths, the sidebar inset becomes a raised content panel with a separate header card (`src/theme/base.css:183-220`, `src/theme/base.css:515-531`). Below 768px, the left drawer remains the shell, the pushed thread becomes the raised panel, and the right panel content is drawn as a rounded card (`src/theme/base.css:1072-1109`). The composer context row uses outlined chips and adjusts spacing for narrow screens (`src/theme/base.css:1015-1044`, `src/theme/base.css:1111-1145`).

The chat stylesheet styles BB's composer, user messages, code, work rows, loaders, approval cards, banners, and tooltips; loader and feature switches are controlled by preference attributes (`src/theme/chat.css:1-13`, `src/theme/chat.css:37-45`, `src/theme/chat.css:105-122`, `src/theme/chat.css:138-183`, `src/theme/chat.css:336-345`, `src/theme/chat.css:425-447`). The model picker uses provider tabs, a selected-model row, sparkle favorites, and segmented reasoning controls (`src/theme/base.css:782-794`, `src/theme/base.css:844-878`, `src/theme/base.css:906-930`). The Lane Pilot composer action is shown as an icon while preserving its accessible label (`src/theme/base.css:736-780`). The integration stylesheet recolors Git History through its `--gh-*` and `--git-ref-*` variables and styles BB's diff file cards (`src/theme/integrations.css:1-25`, `src/theme/integrations.css:74-90`).

The light and dark palettes are defined in the theme CSS (`src/theme/base.css:14-21`, `src/theme/base.css:100-108`). The [overview](../overview.md) describes the plugin parts, and [architecture](../architecture.md) shows their BB runtime boundary. The chat layer and message timestamps carry upstream MIT attributions in [NOTICE](../../NOTICE) (`NOTICE:1-6`, `NOTICE:29-34`).

### Failures

- If the generated CSS is stale, `node scripts/build-theme.mjs --check` exits with an error; rerun `npm run build:theme` (`scripts/build-theme.mjs:18-25`).
- If writing the theme mode to local storage throws, `readThemeMode` falls back to `system`; `writeThemeMode` itself does not catch storage errors (`theme-mode.tsx:13-25`).
- When Pokecut is not active, app-driven DOM enhancements are unmounted; CSS theme rules are no longer selected by BB (`theme-active.ts:6-20`, `app.tsx:27-43`).

## Business rules

- The generated output order is base, chat, integrations (`scripts/build-theme.mjs:4-11`).
- Palette blocks remain at the beginning of the output for BB theme tooling (`theme.test.ts:21-26`).
- CSS is constrained below 256,000 bytes by the theme test (`theme.test.ts:14-19`).

## Public API

| Import or entry | File | Purpose |
|---|---|---|
| `themeIsActive`, `useThemeActive` | `theme-active.ts:6-20` | Detect theme selection and subscribe to changes |
| `THEME_MODES`, `readThemeMode`, `writeThemeMode`, `ThemeModeIcon`, `ThemeModeSwitch` | `theme-mode.tsx:9-65` | Read and edit BB's light/dark/system preference |
| Theme manifest entry | `package.json:17-23` | Expose theme CSS to BB |

## Gotchas

- Edit the three files under `src/theme/`; the bundled `themes/pokecut.css` is generated (`themes/pokecut.css:1`, `scripts/build-theme.mjs:4-25`).
- CSS targets BB's DOM attributes and classes; markup changes can invalidate selectors, as evidenced by selector-specific regression tests (`theme.test.ts:32-72`).
- The theme-mode switch shares BB's `bb.theme` preference, rather than a Pokecut-specific setting (`theme-mode.tsx:1-25`).

<!-- lane-pilot:backlinks -->
## Referenced by

- [Architecture](../architecture.md)
- [Pokecut Theme for BB overview](../overview.md)
