## Problem (owner's screenshot, desktop, light theme)
At the top of the window the sidebar shows as its own lighter-gray block that starts higher (about 10px from the top) than the content panel (about 22px from the top). The block's top-left corner is rounded but its top-right corner, where it meets the content panel, is a sharp square corner. The content panel then starts lower, with its own 20px radius. The result: two surfaces with different top offsets, different radii and a hard angle between them. The page-header card inside the panel also uses its own offsets (8px margin, 14px radius) unrelated to the outer ones.

## Wanted
1. One grid for the desktop shell: a single gutter token (e.g. `--pk-gap: 12px`) used for the outer margin of the content panel, the sidebar panel and the right panel; and a radius scale where nested radii follow outer = inner + gap (e.g. shell panels 20px, header card / cards inside 20 - 8 = 12–14px, rows 10–12px). Define these as `--pk-*` tokens in the theme root (light and dark) and use them in base.css shell rules instead of loose numbers.
2. The sidebar surface tucks under the work area, the same idea as the composer footer tray (chat.css, version 0.5.2: the tray sits behind the composer, the composer card overlaps it with its rounded bottom and the tray shows as a frame around it). Concretely: if the sidebar keeps a visible surface of its own, it starts at the same top offset as the content panel, has the same radius on its outer corners, and extends to the right under the content panel (the content panel overlaps it by about one radius, with a higher z-index and its drop shadow), so its right edge is never visible and no square corner remains. If it is simpler and cleaner to make the sidebar background identical to the shell (no separate block), that also satisfies the owner, as long as there is no sharp corner and the offsets line up. First find in BB's markup which element paints the lighter block (look at `[data-sidebar="panel"]`, `[data-sidebar="sidebar"]`, `[data-variant]`/`[data-side]` attributes; BB uses shadcn sidebar markup) — the current theme only sets `border-right-color: transparent` on it.
3. Top edges align: sidebar surface, content panel and right panel (`#thread-detail-secondary-panel`) start at the same y; bottom gutters equal.
4. Keep collapsed-sidebar (`[data-collapsible="offcanvas"]`) behaviour: panel gets the left gutter, nothing overlaps.
5. Phones (<768px) are out of scope: do not change the mobile rules.
6. Dark theme gets the same geometry.

## Files
- Edit `src/theme/base.css` (shell, page header, right panel, sidebar sections); touch `src/theme/chat.css` only if the composer tray should reuse the new tokens.
- Regenerate `themes/pokecut.css` with `npm run build:theme`.
- Add/adjust assertions in `theme.test.ts` (e.g. the gap/radius tokens exist and the inset panel uses them).
- Bump version to 0.5.5 in package.json (and wherever the version string is pinned, grep for 0.5.4) with a short changelog line if the repo keeps one.

## Checks
`node scripts/build-theme.mjs --check`, `npm run typecheck`, `node --experimental-strip-types --test theme.test.ts`.

## Delivery status
- [x] Apply one desktop spacing and radius grid, with the sidebar tucked under the content panel and phone rules unchanged. Completed in `lprun_c29fe4e5bcb9445cbf627ea602a5d92c` (commit: see git log).
