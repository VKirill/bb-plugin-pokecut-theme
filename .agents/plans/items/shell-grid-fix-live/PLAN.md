## Context
Task shell-grid-sidebar-tuck (0.5.5) shipped but on the owner's desktop app nothing visible changed except that the composer and its context chips are pushed below the window bottom. Reason: the new sidebar rules use selectors that do not match BB's desktop markup, and the inset height formula does not account for the app's top chrome row.

## Facts from BB's shipped frontend (bb.app bundle, quoted; do not look for it in this repo)
Desktop sidebar markup:
```
<div class="group peer text-sidebar-foreground" data-state data-collapsible data-variant="sidebar" data-side="left">
  <div data-sidebar="gap" class="relative hidden h-full w-(--sidebar-width) bg-transparent ... md:block group-data-[collapsible=offcanvas]:w-0"/>
  <div data-sidebar="panel" class="fixed inset-y-0 z-10 flex h-(--bb-shell-height) w-(--sidebar-width) flex-col bg-sidebar ... left-0 ...">
    <div data-sidebar="sidebar" class="flex h-full w-full flex-col bg-sidebar pt-[env(safe-area-inset-top)] ...">…</div>
  </div>
</div>
<main data-sidebar="inset" class="relative flex h-full min-h-0 min-w-0 flex-1 flex-col bg-background max-md:z-30 ...">
```
- On desktop `data-side="left"` is on the OUTER group div, not on `[data-sidebar="panel"]` (only the phone drawer puts data-side on the panel itself). So every desktop rule written as `[data-sidebar="panel"][data-side="left"] …` in base.css does not apply. Use `[data-side="left"] > [data-sidebar="panel"]` / `[data-variant="sidebar"][data-side="left"] [data-sidebar="sidebar"]`, inside the min-width:768px media query, and make sure phone rules (which do use `[data-sidebar="panel"][data-side="left"]`) stay untouched.
- The desktop panel is `position: fixed; z-index: 10`, so it paints ABOVE the inset (z-index 1). A box-shadow "tuck fill" therefore cannot be covered by the inset.
- `:root { --bb-app-chrome-row-height: 3rem; --bb-shell-height: 100dvh }`. The macOS desktop app has a draggable chrome row (traffic lights, back/forward, sidebar toggle) about 46–48px tall at the top.

## What the owner's screenshot shows (2056px-wide CSS window, light theme, BB desktop app on macOS)
- y 0–46: chrome row on shell gray (traffic lights, nav arrows). A narrow icon rail (home, layers, …) on the far left x 0–50.
- The sidebar surface (lighter gray, `bg-sidebar`) starts at y≈46, x≈50–395, top-left rounded, top-right still a SQUARE corner at (395, 46).
- The content panel `[data-sidebar="inset"]` starts at y≈58 (46 + 12px margin) and x≈395; its rounded top-left corner sits 12px below the sidebar's square corner — exactly the defect the owner reported.
- The inset's bottom border and bottom gutter are not visible: the panel runs past the window bottom, and the composer's chip row (project / machine / access mode) is cut at the bottom edge. Its height is `calc(var(--bb-shell-height) - 2*gap)` = full window height minus 24px, but it starts ~58px down, so it overflows by ~34px.

## Wanted
1. Inset height must fit the space it actually gets: derive it from its flex parent (e.g. `height: auto; align-self: stretch` with vertical margins, or `height: calc(100% - 2 * var(--pk-gap))` relative to the parent, or `max-height`), never from the window height. Bottom gutter = `--pk-gap`, composer and its chip row fully visible.
2. The content panel's top must not sit lower than needed: its top edge aligns with the top of the sidebar surface, right below the chrome row (top gutter equals the other gutters only where there is no chrome row; do not add 12px on top of the chrome row if that makes it misaligned with the sidebar).
3. No square corner at the sidebar/inset join. Pick the robust option that works with the fixed z-10 panel: either (a) the sidebar surface gets the shell color (`--pk-shell`, no separate block; the project cards and New project field remain the visible cards), or (b) the sidebar surface keeps a lighter fill, starts at the same y as the inset, has a rounded top-right/bottom-right edge too, and the inset overlaps it by one radius with a z-index above the panel — only if you can do that without covering sidebar content and without breaking the collapsed (offcanvas) state. The owner's wish is "the sidebar looks like it sits under the work area, like the composer footer tray"; (b) is preferred if robust, (a) is the fallback.
4. Same geometry in dark theme. Collapsed sidebar: inset keeps the left gutter. Phones (<768px) untouched.
5. Remove the now-dead desktop rules that used `[data-sidebar="panel"][data-side="left"]` in the desktop media query (keep the phone ones).
6. Bump version to 0.5.6.

## Checks
`node scripts/build-theme.mjs --check`, `npm run typecheck`, `node --experimental-strip-types --test theme.test.ts`. Add test assertions that the desktop selectors target `[data-side="left"] > [data-sidebar="panel"]` (or the group form) and that the inset rule does not use `--bb-shell-height` for its height.

## Delivery status
- [x] Correct desktop selectors, align the inset below the chrome row, and size it to fit the available window space. Completed in `lprun_c29fe4e5bcb9445cbf627ea602a5d92c` (commit: see git log).
