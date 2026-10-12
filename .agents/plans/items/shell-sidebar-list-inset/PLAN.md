## Measured (0.5.9 injected into the BB web UI, 1440x900, browser QA @thr_8u3wjqmgsb)
All good except one thing: nav rows (`[data-testid="plugin-nav-sidebar-items"]` buttons, e.g. «Новый тред») span x 20..312 — 8px from the sidebar surface's left edge (12) and from the inset's left edge (320), same as the footer card (20..312). But the project-folders list `.pf-tree` (container 20..312) has computed padding `8px 12px 16px` from the project-folders plugin's own CSS, so the «Новый проект» button (`.pf-tree > button:first-child`) and the `.pf-project` cards sit at 32..300 — 20px from each edge. Nav rows and the list use different insets.

## Fix
In the desktop media block of src/theme/base.css add `[data-sidebar="sidebar"] .pf-tree { padding-inline: 0; }` (keep its vertical padding), with enough specificity to beat the plugin's rule (e.g. `[data-variant="sidebar"][data-side="left"] [data-sidebar="sidebar"] .pf-tree`). Check that `.pf-tree > button:first-child` (currently `width: calc(100% - 4px); margin-inline: 2px` in base.css, and later `width: 100%`) ends up exactly at the same x as the nav rows (left inset 8px, right inset 8px to the inset edge): remove the 2px margin-inline so it lines up. `.pf-project` cards then span the same x as nav rows and the footer card. Do not change phone rules.
Version 0.5.10. Add a theme.test.ts assertion for the .pf-tree padding-inline rule.

## Checks
`node scripts/build-theme.mjs --check`, `npm run typecheck`, `node --experimental-strip-types --test theme.test.ts`.

## Delivery status
- [x] Align the project list's desktop inset with the nav rows and footer card. Completed in `lprun_c29fe4e5bcb9445cbf627ea602a5d92c` (commit: see git log).
