## Problem
The compact New project button shows «Project» to the owner whose BB is in Russian. base.css switches the `::after` label with `:root:lang(ru)` / `html[lang^="ru"]`, but BB's `<html lang>` stays `en`: the Russian UI comes from the Russifier plugin, which translates text in place and leaves `<html lang>` alone (see the comment in i18n.ts above `russifierActive()`). The theme already has the right detection: `detectLocale()` in i18n.ts (stored preference `pokecut-theme:locale` → `<html lang>` → Russifier heuristic on Cyrillic aria-labels in the sidebar/header), and `subscribeLocale()` for changes.

## Fix
1. app.tsx (`PokecutChatLayer`, next to the existing root attributes `data-pk-loader` / `data-pk-chips` / `data-pk-off`): while the theme is active, set `data-pk-lang` on `document.documentElement` to `detectLocale()`; update it on `subscribeLocale` events, and re-detect a few times shortly after mount (the Russifier translates after first paint), e.g. a MutationObserver on the sidebar limited to `aria-label` attribute changes, disconnected once the value settles, or a short timer sequence (0.5s, 2s, 5s). Remove the attribute on cleanup like the other root attributes (add it to ROOT_ATTRIBUTES or its own cleanup).
2. base.css: switch the Проект label on `html[data-pk-lang="ru"]` (keep the `:lang(ru)` selectors as a fallback): content «Проект»; default «Project».
3. Unit test (node test, no DOM framework needed if the existing tests stub document): a test that the CSS contains the `html[data-pk-lang="ru"]` selector with content «Проект», and, if feasible with the existing test helpers, that the attribute logic picks `ru` when detectLocale returns ru.
Version: next patch after main's version (0.5.19 if 0.5.18 is on main).

## Checks
`node scripts/build-theme.mjs --check`, `npm run typecheck`, `node --experimental-strip-types --test theme.test.ts settings.test.ts`.

## Delivery status
- [x] Make the compact Project label follow BB's detected interface language, including Russian via Russifier. Completed in `lprun_c29fe4e5bcb9445cbf627ea602a5d92c` (commit: see git log).
