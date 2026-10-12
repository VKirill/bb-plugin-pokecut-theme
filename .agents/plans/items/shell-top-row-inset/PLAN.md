## Measured on live BB with 0.5.14 (browser QA @thr_rk484nsxas, 1440px)
All passes (tree steps 8/8/8, chevron/action 15/15, collapsed gutter 12, tracker visible, New project / .pf-project / footer card at x 72..312 = rail right 64 + 8 .. inset left 320 − 8) except the top row: `div[data-testid="app-sidebar-top-reserve-row"]` spans 72..320 and has BB's own `px-2` (padding-inline 8px), so the «New thread» button sits at 80..248 (hover highlight 80..248) instead of starting at 72, and the row's right edge reaches 320 instead of 312.

## Fix (src/theme/base.css, desktop block, where the rail-aware padding rule lives)
For `[data-variant="sidebar"][data-side="left"] [data-sidebar="sidebar"]:has([data-testid="app-nav-rail"]) [data-testid="app-sidebar-top-reserve-row"]`: set `padding-left` so its content starts at the same x as `[data-testid="app-sidebar-body"]`'s content (x 72 — i.e. the row's own px-2 must not add on top of the rail-aware padding; padding-left equal to the body's resolved padding), and `padding-right: var(--pk-gap-card)` so the back/forward buttons end at x 312 like the cards. Result: New thread button left x 72; row content right edge 312. Do not touch anything else. Version 0.5.15; extend theme.test.ts for the top row rule.

## Checks
`node scripts/build-theme.mjs --check`, `npm run typecheck`, `node --experimental-strip-types --test theme.test.ts`.

## Delivery status
- [x] Align the desktop top sidebar row with the project cards and footer card. Completed in `lprun_c29fe4e5bcb9445cbf627ea602a5d92c` (commit: see git log).
