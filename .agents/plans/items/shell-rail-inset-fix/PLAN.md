## Measured on the owner's live BB with 0.5.13 (browser QA @thr_p7kc46y264, 1440px)
Tracker is visible now (good); right/bottom insets 8px (good). Three numeric defects, each with its exact cause in src/theme/base.css:

1. **Left inset doubled (27px instead of 8px).** Rail `div[data-testid="app-nav-rail"]` ends at x 64. The rule
   ```
   [data-variant="sidebar"][data-side="left"] [data-sidebar="sidebar"]:has([data-testid="app-nav-rail"])
     :is([data-testid="app-sidebar-top-reserve-row"], [data-testid="app-sidebar-body"], [data-sidebar="header"], [data-sidebar="content"], [data-sidebar="footer"]) {
     padding-left: calc(var(--pk-gap) + var(--pk-gap-card) - 1px);   /* 19px */
   }
   ```
   pads `app-sidebar-body` (left 53 → children at 72) AND again `[data-sidebar="content"]` / `[data-sidebar="footer"]` which are inside the body (→ 91). Fix: apply the 19px only to the outermost of these: add `:not([data-testid="app-sidebar-body"] *)` to the selector (or list only the top reserve row and the body), so New thread, New project, `.pf-project` cards and the footer card start at x 72 = rail + 8. Note `[data-sidebar="footer"]` also has `padding: var(--pk-gap-card)` from another rule; make sure its left edge lands on 72 for the card (`ul` at 72..312): if the footer is inside the body, its own padding-left must be 0 so the card starts at the body's content edge, matching `.pf-project` cards; if any is off by the footer's 8px, adjust so all four start at the same x 72.
2. **Collapsed rail gutter 1px instead of 12px.** Collapsed (`data-collapsible="rail"`): rail 12..64, BB's gap column ends at 53, inset at 65 with `[data-collapsible="rail"] ~ [data-sidebar="inset"] { margin-left: var(--pk-gap) }`. The inset's flow start is 53, the rail ends 11px later (panel padding-left 12 + rail 52 = 64). Fix: `margin-left: calc(var(--pk-gap) + var(--pk-gap) - 1px)` (= 23px → inset at 76 = rail right + 12). Prefer expressing it as (panel padding-left + rail width − gap column width + --pk-gap) with tokens/comments.
3. **Tree indent step 8/9/9.** Theme rule `.pf-tree .pf-children { margin-left: var(--pf-indent, 8px); padding-left: var(--pf-indent, 8px) }`; the plugin adds `.pf-folder > .pf-children { border-left: 1px solid var(--border) }`, so folder levels step 1px more than the project level. Fix: `[data-variant="sidebar"][data-side="left"] [data-sidebar="sidebar"] .pf-tree .pf-folder > .pf-children { padding-left: calc(var(--pf-indent, 8px) - 1px) }` so every level steps the same.
4. (low) Level-0 chevron graphic 15px from the card's left edge vs the last action icon graphic 18px from the right edge (button boxes are both 13px). Make the visible graphics symmetric: e.g. `.pf-project .pf-heading, .pf-project .pf-thread { padding-inline: 4px 1px }` or equivalent, so both icon graphics sit 15px from the card edges.

Everything else unchanged (tracker rule, panel top untouched, surface tuck, phone rules). Version 0.5.14. Tests: assert the rail padding selector excludes descendants of app-sidebar-body, the rail-collapsed inset margin, and the folder children padding rule.

## Checks
`node scripts/build-theme.mjs --check`, `npm run typecheck`, `node --experimental-strip-types --test theme.test.ts`.

## Delivery status
- [x] Fix the doubled rail inset, collapsed rail gutter, and project-tree indent step. Completed in `lprun_c29fe4e5bcb9445cbf627ea602a5d92c` (commit: see git log).
