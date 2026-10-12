## URGENT regression in 0.5.16 (owner: the project tree no longer scrolls)
Task shell-top-row-new-project added in src/theme/base.css (desktop block):
```
[data-variant="sidebar"][data-side="left"] [data-sidebar="content"],
[data-variant="sidebar"][data-side="left"] [data-sidebar="sidebar"] .pf-tree {
  overflow: visible;
}
```
`[data-sidebar="content"]` is BB's scroll container for the project list; `overflow: visible` kills scrolling. It is also unnecessary: the New project button is `position: absolute` with its containing block on `[data-sidebar="sidebar"]` (`position: relative`), which is OUTSIDE the scroller, so the button escapes the scroller's clipping anyway (an absolutely positioned box is clipped only by overflow on ancestors up to its containing block). REMOVE that whole rule (do not set overflow on `[data-sidebar="content"]` or `.pf-tree` at all). Add a theme.test.ts guard: the desktop block must not set `overflow: visible` on `[data-sidebar="content"]`.

## Owner's correction: swap the order
Left: the compact «[icon] Проект» button (New project). Right: «Новый тред», full label.
- Anchor the Проект button to the icon rail instead of to New thread: put `anchor-name: --pk-rail` on `[data-variant="sidebar"][data-side="left"] [data-testid="app-nav-rail"]`, and on `.pf-tree > button:first-child` use `position-anchor: --pk-rail; left: calc(anchor(right) + var(--pk-gap-card));` keep `top` vertically centered on the top row: anchor the top to the New thread button's center (keep `anchor-name: --pk-new-thread` on New thread and use `top: anchor(--pk-new-thread center); translate: 0 -50%`). Remove the `left: calc(anchor(right) ...)` that pointed at New thread.
- New thread button: `margin-left: auto` inside `div[data-testid="app-sidebar-top-reserve-row"]` so it sits at the right end of the row (before Back/Forward when the browser shows them; at the row's right content edge, x = inset left − 8, in the macOS app where the arrows are in the window chrome). Keep `width: auto; flex: none; min-width: max-content` (full label).
- Guarantee no overlap: the row must leave room on its left for the Проект button — give the top row's first child (or New thread) enough left space, e.g. `min-width` for the gap, or simply rely on margin-left:auto pushing New thread right; if the row is too narrow (sidebar resized small), New thread may overlap Проект — then let New thread shrink with its label ellipsized rather than overlap (`min-width: 0; overflow: hidden; text-overflow: ellipsis` only below a breakpoint is fine; at the default 320px sidebar width both fit fully: Проект ≈ 95px, New thread ≈ 120px, row 240px).
- Everything else from 0.5.16 stays (compact pill style, ::after «Проект»/«Project», tree padding-top, phone rules untouched).
Version 0.5.17.

## Delivery status
- [x] Restore project-list scrolling and place the compact Project button left of the full New thread button. Completed in `lprun_c29fe4e5bcb9445cbf627ea602a5d92c` (commit: see git log).

## Checks
`node scripts/build-theme.mjs --check`, `npm run typecheck`, `node --experimental-strip-types --test theme.test.ts`.
