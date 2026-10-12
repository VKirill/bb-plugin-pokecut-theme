## Owner's request
Put «Новый тред» and «Новый проект» on ONE line at the top of the sidebar: «Новый тред» on the left, shown in full (label not truncated, only as wide as its content); on the right of the same row a compact button «[folder-plus icon] Проект» (the existing New project button, shorter label). The project tree then starts right below that row, its cards aligned on the same left line as «Новый тред». In the owner's screenshot the top row has an empty area to the right of «Новый тред» — that is where «Проект» goes.

## DOM facts (live BB 0.46.0-vk.2, measured at 1440px; desktop media block)
- Top row: `div[data-testid="app-sidebar-top-reserve-row"]` (BB's own, x 72..312 after task shell-top-row-inset, y 0..48 in the browser; in the macOS app it is the first row of the sidebar under the window chrome). Holds the New thread button (`aria-label` starts «New thread» / «Новый тред», from `[data-testid="plugin-nav-sidebar-items"] [data-sidebar-navigation-item="__bb__/new-thread"] > button` styling in base.css) and, in the browser, Back/Forward buttons at its right end (252..312). In the macOS app the Back/Forward arrows live in the window chrome row instead, and the right part of this row is empty.
- New project button: `[data-sidebar="sidebar"] .pf-tree > button:first-child` (project-folders plugin DOM, inside the scrolling `[data-sidebar="content"]`), currently a full-width outlined field at x 72..312, y ~56..92, with an icon and the text «Новый проект» / «New project».
- `[data-sidebar="sidebar"]` is the surface (x 12..340, extends 20px under the inset with padding-right 20px). Ancestors between it and `.pf-tree` are not positioned in the theme today.

## Implementation (CSS only, src/theme/base.css desktop block; the theme cannot move DOM)
1. Make `[data-variant="sidebar"][data-side="left"] [data-sidebar="sidebar"]` the containing block (`position: relative`), and make sure no ancestor between it and `.pf-tree > button:first-child` is positioned (check the theme's own rules; if BB's classes position one, note it).
2. Take the New project button out of the flow: `position: absolute; top: <same y as the top row's buttons, vertically centered in the 48px row>; right: calc(var(--pk-radius-panel) + var(--pk-gap-card)); width: auto; height: 32px` (match the New thread button height), compact pill style consistent with the theme's outlined field (border `--pk-outline`, radius `--pk-radius-card`, background `--pk-panel`), icon + short label. Short label via CSS: hide the original text (`font-size: 0` on the button, keep the svg at its size) and add `::after { content: "Проект" }` for Russian (`:root:lang(ru)` or `html[lang^="ru"]`) and `"Project"` otherwise, at the button's normal font size/weight. Keep the button clickable and its accessible name (do not hide with display:none; keep aria from DOM).
3. When the browser shows Back/Forward at the right end of the top row, the Проект button must not overlap them: place it left of them (e.g. `right` = row right inset + back/forward group width) OR, simpler and acceptable, hide nothing and position the button just right of the New thread button with a `--pk-gap-card` gap. Choose the variant that works in both the macOS app (no arrows in the row) and the browser (arrows in the row) — the left-anchored variant (right after New thread) is the robust one; then New thread is content-width (`width: auto; flex: none`), and Проект sits at New thread's right edge + 8px.
4. New thread button: full label, `width: auto` (no truncation), left x = rail right + 8 (same as cards).
5. The tree's top padding: with the New project button out of flow, the first `.pf-project` card starts `--pk-gap-card` below the top row.
6. Scrolling the project list must not move the Проект button (it is positioned against the sidebar surface, not the scroller).
7. Phone (<768px) unchanged: the New project button stays where it is there.
Version 0.5.16 (or the next after the version on main). Tests: assert the absolute-positioned New project rule exists only inside the desktop block and the ::after labels.

## Checks
`node scripts/build-theme.mjs --check`, `npm run typecheck`, `node --experimental-strip-types --test theme.test.ts`.

## Delivery status
- [x] Put the full New thread button and compact New project button on one desktop row above the project tree. Completed in `lprun_c29fe4e5bcb9445cbf627ea602a5d92c` (commit: see git log).
