## Regression in 0.5.7 (owner's screenshot, macOS BB desktop app)
Task shell-sidebar-seams added to the desktop rule `[data-side="left"] > [data-sidebar="panel"]`:
```
top: 0;
height: 100%;
bottom: auto;
```
This moved the fixed sidebar panel up to the very top of the window. Now the sidebar content sits under the macOS chrome row: the traffic lights overlap the "Новый тред" row, and the sidebar surface's lighter one-radius extension sticks out as a light vertical strip (about 18–20px wide) to the right of the sidebar, above the content panel's top (y 0–48) and below its bottom (the last ~25px of the window), because the content panel starts below the chrome row (~48px) and ends 12px above the window bottom while the sidebar surface now runs from 0 to the window bottom.

Before 0.5.7 BB itself placed the panel's top right below the chrome row (in 0.5.6 the sidebar surface started at y≈46, same as the content panel). The panel's height comes from BB's class `h-(--bb-shell-height)` (= 100dvh), so with that top it overflowed below the window bottom; that was the original bottom problem.

## Fix
1. In `[data-side="left"] > [data-sidebar="panel"]` (desktop media query) remove `top: 0` — never override the panel's top; keep BB's own top below the chrome row. Make it end at the window bottom instead of overflowing: `bottom: 0; height: auto;` (a fixed element with top and bottom set and height auto stretches between them).
2. Keep the rest of the 0.5.7 geometry: `[data-sidebar="sidebar"]` with `height: calc(100% - var(--pk-gap)); margin-bottom: var(--pk-gap)`, the one-radius width extension under the inset, left radii, footer padding. Result: sidebar surface top = content panel top (right below the chrome row), sidebar surface bottom = content panel bottom (12px above the window bottom); the extension is fully covered by the content panel, so no strip shows above or below it.
3. Collapsed state rules stay.
4. Version 0.5.8. Add a theme.test.ts assertion that the desktop panel rule does not set `top: 0` (regression guard) and sets `bottom: 0`.

## Checks
`node scripts/build-theme.mjs --check`, `npm run typecheck`, `node --experimental-strip-types --test theme.test.ts`.

## Delivery status
- [x] Restore the desktop sidebar below the macOS chrome row and align its bottom with the content panel. Completed in `lprun_c29fe4e5bcb9445cbf627ea602a5d92c` (commit: see git log).
