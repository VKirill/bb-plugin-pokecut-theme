## Bug (measured on live BB with 0.5.19, browser QA @thr_ie4fw8an2p, 1440px)
With Back/Forward («Назад»/«Вперёд», x 252..312) in the sidebar top row, the Проект button is still the full pill x 72..166.7 and overlaps New thread (x 140.5..248) by 26px, covering its icon; a click at x 145 hits Проект. The icon-only rules in src/theme/base.css (around lines 390–425) never apply because they nest `:has()` inside `:has()`:
```
[data-variant="sidebar"][data-side="left"]:has(
    [data-testid="app-sidebar-top-reserve-row"]:has(button[aria-label^="Back"], ...)
  ) [data-sidebar="sidebar"] .pf-tree > button:first-child { width: 32px; ... }
```
CSS forbids `:has()` inside `:has()`; the browser drops the whole rule. Same for the `::after { content: none }` rule.

## Fix
Flatten both selectors to a single `:has()` with descendant combinators, e.g.
```
[data-variant="sidebar"][data-side="left"]:has(
  [data-testid="app-sidebar-top-reserve-row"] button[aria-label^="Back"],
  [data-testid="app-sidebar-top-reserve-row"] button[aria-label^="Forward"],
  [data-testid="app-sidebar-top-reserve-row"] button[aria-label^="Назад"],
  [data-testid="app-sidebar-top-reserve-row"] button[aria-label^="Вперёд"]
) [data-sidebar="sidebar"] .pf-tree > button:first-child { ... }
```
Grep the whole theme (src/theme/*.css) for any other `:has(` nested inside `:has(` and flatten those too. Also the reserve row rule uses `padding-left: calc(anchor-size(--pk-project width) + ...)` — anchor-size() only works in properties of anchor-positioned elements; in a padding of a normal box it is invalid and the declaration is dropped (the preceding 104px fallback then applies). Keep the plain fallback only (remove the anchor-size line) to avoid confusion.
Add a theme.test.ts check that fails if any selector in the generated CSS contains `:has(` inside another `:has(` (simple paren-depth scan per selector).
Result to reach: with Back/Forward present, Проект is a 32px icon-only square at x 72..104 and New thread starts ≥ 8px after it; without them (macOS app), Проект shows icon + «Проект» and New thread sits at the row's right end, no overlap.
Version: next patch after main.

## Checks
`node scripts/build-theme.mjs --check`, `npm run typecheck`, `node --experimental-strip-types --test theme.test.ts`.

## Delivery status
- [x] Flatten nested `:has()` selectors so the Project button becomes icon-only beside Back/Forward without overlapping New thread. Completed in `lprun_c29fe4e5bcb9445cbf627ea602a5d92c` (commit: see git log).
