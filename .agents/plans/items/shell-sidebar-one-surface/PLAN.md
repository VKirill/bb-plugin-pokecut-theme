## Measured facts (0.5.8 injected into the BB web UI at 1440x900, by a browser QA helper)
- Sidebar surface `[data-variant="sidebar"][data-side="left"] [data-sidebar="sidebar"]`: l12 r339 t0 b888, bg rgb(250,250,250) (`--pk-panel`), radius 20px 0 0 20px, margin-right -20px, padding-right 20px. Inset: l320 r1428 t0 b888. Bottoms and tops match; window gutters 12/12/12. Good.
- BUT `[data-sidebar="content"]` (the scrolling middle part of the sidebar: project list etc., l12 r319 t199 b834) keeps BB's own `bg-sidebar` = rgb(237,237,237), the shell gray. The theme sets no rule for it. So the light sidebar surface shows only behind the header (y 0–199, nav rows) and the footer (y 834–888), with a gray band between them flush with the shell gutter. The owner sees this as "no unity of spacing": the sidebar reads as separate light blocks (top nav, the footer/gear area) with the gray column between them, and their edges do not line up with the content panel.
- Footer tool card `[data-sidebar="footer"] > ul[data-sidebar="menu"]`: l20 r311 t842 b880. Spacing: 8px to the surface left edge, 8px to the surface bottom, but 9px to the visible right edge (the inset's left edge at x 320), because the surface's visible width is 308px (12..320) while its box is 327px with a 20px padding-right.

## Wanted
1. Desktop only (min-width 768px): `[data-variant="sidebar"][data-side="left"] [data-sidebar="content"]` gets `background-color: transparent` (also check `[data-sidebar="header"]` and any direct child wrappers of `[data-sidebar="sidebar"]` that carry `bg-sidebar`; make them transparent) so the whole sidebar is ONE light surface from top to bottom, one color, one rounded block. The project cards (`.pf-project`) and the New project field keep their own card styles on top of it.
2. Spacing unity inside the sidebar surface: one inner inset `--pk-gap-card` (8px) on left, right (measured to the visible right edge, i.e. the inset's left edge) and bottom for the footer card, and the same left/right inset for the content list and the nav rows. Because the surface extends 20px under the inset with `padding-right: var(--pk-radius-panel)`, compute the right inset so the visible gap equals the left one (e.g. right padding of the footer = `--pk-gap-card` and the surface's padding-right exactly equal to the tuck width, so visible spacing is 8/8; fix the 1px from the 12px left padding of the panel vs surface width rounding).
3. Keep everything else from 0.5.8: panel top untouched (BB places it under the macOS chrome row; never set top), `bottom: 0; height: auto`, surface height/margin, inset geometry, collapsed rules, phone rules.
4. Version 0.5.9. Add a test that `[data-sidebar="content"]` is made transparent in the desktop block.

## Checks
`node scripts/build-theme.mjs --check`, `npm run typecheck`, `node --experimental-strip-types --test theme.test.ts`.

## Delivery status
- [x] Make the desktop sidebar one light surface with even inner spacing. Completed in `lprun_c29fe4e5bcb9445cbf627ea602a5d92c` (commit: see git log).
