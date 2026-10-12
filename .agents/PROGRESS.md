## Now
- Applies the Pokecut light/dark visual theme across the shell, with a token-based desktop grid, a single light sidebar surface tucked under the content panel below the macOS chrome row, rail-aligned sidebar and project-tree spacing, a content-sized usage tracker fully visible in its footer card, and responsive drawers.
- Restyles BB's native chat, including the composer, messages, work rows, loaders, approval cards, and banners.
- Lets users configure chat appearance features in bilingual plugin settings, with preferences stored by the plugin.
- Adds theme mode controls, a context meter, Git History styling, and BB diff path styling.

## Blocked
- none

## Next
- [ ] Review the 0.5.13 shell layout in live BB in light and dark modes, with the sidebar expanded and collapsed.

## Last verify
- command: `node scripts/build-theme.mjs --check`; `npm run typecheck`; `node --experimental-strip-types --test theme.test.ts` (Lane Pilot receipt)
- result: green
- when: 2026-10-12

## Pointers
- Open todos: none (`.agents/todos/INDEX.md` is absent).
- Active plans: none (all thirteen shell plans are complete).
- Changelog: `.agents/CHANGELOG.md`.
