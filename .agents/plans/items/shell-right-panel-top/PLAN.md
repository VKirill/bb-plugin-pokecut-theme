## Owner: the right panel (tabs block) has too large a gap at the top
In the thread view with the right panel open (`#thread-detail-secondary-panel`), there is an empty band above the panel's tab row (ⓘ, tab pills like «Self-hosted all-in-one Do…», «+», expand button). The left page header card (`[data-testid="app-page-header-content-row"]`, `margin: var(--pk-gap-card) var(--pk-gap-card) 0`, i.e. 8px from the inset's top) sits higher, so the two top rows do not line up.
Cause (src/theme/base.css, desktop block, since 0.5.5):
```
#thread-detail-secondary-panel > aside { padding: var(--pk-gap) var(--pk-gap) var(--pk-gap) 0; background-color: var(--pk-shell); }
```
The 12px top padding stacks on top of BB's own top area of the panel (its first child row `#thread-detail-secondary-panel > aside > div > div:first-child` holding the tabs, which has its own height/padding sized to match the page header row).

## Fix
- Remove the top padding of the aside (`padding: 0 var(--pk-gap) var(--pk-gap) 0`), keep right/bottom 12px so the panel card keeps its gutters.
- Align the tab row with the left header card: the tab row's vertical center must equal the header card's vertical center (header card top = inset top + 8). If BB's tab row is a fixed-height row (like `h-(--bb-app-chrome-row-height)` = 48px), give it the same top offset/height as the left header row so both centers match; do not add extra margin. The panel body card (`> div > div:last-child`) starts `--pk-gap-card` (8px) below the tab row.
- Phone rules (secondary panel shelf under max-width 767px) unchanged.
Version: next patch after main (0.5.20). Test: assert the aside no longer has top padding in the desktop block.

## Checks
`node scripts/build-theme.mjs --check`, `npm run typecheck`, `node --experimental-strip-types --test theme.test.ts`.

## Delivery status
- [x] Align the desktop right-panel tab row with the page header and preserve the panel body gutters. Completed in `lprun_c29fe4e5bcb9445cbf627ea602a5d92c` (commit: see git log).
