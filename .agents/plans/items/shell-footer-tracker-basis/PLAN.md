## Regression from 0.5.11 (measured)
The desktop rule (src/theme/base.css ~line 244)
`[data-variant="sidebar"][data-side="left"] [data-sidebar="footer"] > ul[data-sidebar="menu"] > li.usage-tracker-sidebar { flex-shrink: 0; margin-left: auto; ... }`
combines with the usage-tracker plugin's own basis `--usage-sidebar-width: 11.25rem` (180px). The li became `flex: 0 0 180px`, spans x 248..428 inside a card that ends at x 312, and the card's `overflow: hidden` clips it: the usage reading («100% +5») is now invisible. Before 0.5.11 the li was 68px wide (its content width).

## Fix
For the desktop footer card, size the tracker by its content, not the plugin's 180px basis: `flex: 0 0 auto; width: auto; min-width: max-content; max-width: none;` (override `flex-basis`), keep `margin-left: auto` so it sits at the right end. Let the icon buttons be the part that compacts (they already are square). The tracker's reading and count must be fully inside the card. Keep the card's 8px insets and `overflow: hidden` as a last resort. Phone rules unchanged. Version 0.5.12; update the theme.test.ts assertion to require `flex: 0 0 auto` (or flex-basis auto) on the desktop tracker rule.

## Checks
`node scripts/build-theme.mjs --check`, `npm run typecheck`, `node --experimental-strip-types --test theme.test.ts`.

## Delivery status
- [x] Size the desktop usage tracker by its content and keep its reading and count visible inside the footer card. Completed in `lprun_c29fe4e5bcb9445cbf627ea602a5d92c` (commit: see git log).
