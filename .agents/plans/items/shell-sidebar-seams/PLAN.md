## Context
0.5.6 (task shell-grid-fix-live) is live in the owner's BB desktop app. The top corner is mostly right, but three seams remain, all caused by the "tuck fill" being a `box-shadow: var(--pk-radius-panel) 0 0 0 var(--pk-panel)` on `[data-sidebar="sidebar"]` (a copy of the sidebar shape shifted 20px right) and by the sidebar surface not sharing the inset's bottom gutter.

Current rules (src/theme/base.css, desktop media query):
```
[data-side="left"] > [data-sidebar="panel"] { z-index:0; padding:0 0 0 var(--pk-gap); background-color:var(--pk-shell); overflow:visible }
[data-variant="sidebar"][data-side="left"] [data-sidebar="sidebar"] { background-color:var(--pk-panel); border-radius:var(--pk-radius-panel) 0 0 var(--pk-radius-panel); box-shadow:var(--pk-radius-panel) 0 0 0 var(--pk-panel); overflow:visible }
[data-sidebar="inset"] { position:relative; z-index:1; height:calc(100% - var(--pk-gap)); align-self:stretch; margin:0 var(--pk-gap) var(--pk-gap) 0; ... }
```
BB markup facts (from BB's bundle): the desktop panel is `position:fixed; inset-y-0; height: var(--bb-shell-height); width: var(--sidebar-width)`; inside it `[data-sidebar="sidebar"]` is `flex h-full w-full flex-col`; the sidebar footer is `[data-sidebar="footer"]` with `flex flex-col gap-2 p-2`; a `[data-sidebar="gap"]` div reserves the sidebar width in the flow. The macOS app has a ~46–48px chrome row at the top (`--bb-app-chrome-row-height: 3rem`).

## What the owner's screenshots show
1. Top-left join: the sidebar's lighter fill ends in a straight vertical edge right next to the inset's rounded top-left corner, and the pocket behind that corner is a different gray than the sidebar, so a seam and a faint ghost curve are visible.
2. Bottom: the inset ends with its rounded corners and a bottom gutter, but the sidebar surface (and the shifted shadow copy) run down to the window bottom with square ends, so a lighter strip sticks out below the inset's bottom-left corner.
3. Bottom-left of the sidebar: the left column (with the settings gear) has its own lighter block whose rounded bottom-right corner sits lower than the inset's bottom; the sidebar footer tool card (phone icon, …, usage meter "23% +5", refresh) ends at a different height than the inset's bottom; the bottoms of the rail block, footer card and inset do not line up.

## Wanted
1. Drop the box-shadow tuck fill. Build the tuck with real geometry: the sidebar surface (`[data-sidebar="sidebar"]`, desktop only) gets the same top and bottom edges as the inset (top right below the chrome row exactly where the inset starts; bottom margin `--pk-gap`, the same as the inset), rounded on its left corners with `--pk-radius-panel`, and extends to the right under the inset by one `--pk-radius-panel` (e.g. `width: calc(100% + var(--pk-radius-panel)); margin-right: calc(-1 * var(--pk-radius-panel))` with matching padding-right so sidebar content is not covered). One single color for the whole sidebar surface including the part under the inset: no seam, no pocket of another gray.
2. Bottoms line up: sidebar surface bottom = inset bottom. The footer card sits inside the sidebar surface with the same inner spacing (`--pk-gap-card`) on its bottom as on its sides, so its bottom edge is a consistent distance above the shared bottom line. If the gear/left column has its own surface, it ends on the same bottom line (or blends into the sidebar surface); no block may extend below the inset's bottom.
3. Collapsed sidebar (`[data-collapsible="offcanvas"]`): nothing of the extended surface peeks; inset keeps its left gutter.
4. Light and dark identical in geometry. Phones (<768px) untouched.
5. Version 0.5.7.

## Checks
`node scripts/build-theme.mjs --check`, `npm run typecheck`, `node --experimental-strip-types --test theme.test.ts`. Update theme.test.ts: assert no `box-shadow: var(--pk-radius-panel) 0 0 0` remains and the desktop sidebar surface has the `--pk-gap` bottom margin.

## Delivery status
- [x] Align the sidebar surface's real geometry and bottom edge with the content panel without a shadow seam. Completed in `lprun_c29fe4e5bcb9445cbf627ea602a5d92c` (commit: see git log).
