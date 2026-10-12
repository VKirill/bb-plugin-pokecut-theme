## Measured (0.5.10 injected into BB web UI at 1440px, browser QA @thr_ta7et49en6)
Desktop footer tool card `[data-sidebar="footer"] > ul[data-sidebar="menu"]` spans x 20..312 (8px insets, correct). With more footer tools present, its last item `li.usage-tracker-sidebar` is squeezed to 15px (clientWidth 15, scrollWidth 61): `span.usage-tracker-sidebar__reading` («100%») spans 306..338 and `span.usage-tracker-sidebar__summary-count` («+5») 342..355, past the card's right edge (312) and clipped under the content panel. Only the `max-width: 767px` rule in base.css (footer `gap: 0; flex-wrap: nowrap`, 32px square tool buttons, `li.usage-tracker-sidebar { flex-shrink: 1; min-width: 0; margin-left: auto }`) handles crowding; desktop has none.

## Fix (desktop media block, src/theme/base.css)
Keep the card on one row and everything inside it: the usage tracker item must not shrink below its content (`flex-shrink: 0`, `margin-left: auto`), and the icon tool buttons take the squeeze instead (compact square 28–32px buttons with `padding-inline: 0; justify-content: center`, `gap` 2–4px, `min-width: 0`). The card keeps `overflow: hidden` as a last resort so nothing paints past its rounded edge. Card left/right/bottom insets stay 8px. Phone rules unchanged. Version 0.5.11; add a theme.test.ts assertion for the desktop usage-tracker flex-shrink rule.

## Checks
`node scripts/build-theme.mjs --check`, `npm run typecheck`, `node --experimental-strip-types --test theme.test.ts`.

## Delivery status
- [x] Keep the desktop usage tracker inside the sidebar footer card while tool buttons compact. Completed in `lprun_c29fe4e5bcb9445cbf627ea602a5d92c` (commit: see git log).
