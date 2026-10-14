---
title: Gotchas
type: gotchas
created: 2026-10-14
updated: 2026-10-14
status: active
confidence: medium
tags: [gotchas, integration, maintenance]
sources:
  - themes/pokecut.css
  - src/theme/chat.css
  - src/theme/base.css
  - skills/pokecut-theme/SKILL.md
  - skills/pokecut-theme/SKILL.md
  - scripts/build-theme.mjs
  - app.tsx
  - server.ts
  - package.json
  - context-meter.ts
  - timeline-marks.ts
  - theme-active.ts
  - file-preview-links.ts
  - theme-mode.tsx
  - i18n.ts
  - contract.ts
  - message-times.ts
  - settings.ts
---

# Gotchas

TL;DR: The main maintenance risks are generated CSS drift, DOM coupling to BB markup, and helper behavior that depends on browser storage or experimental BB APIs.

## Critical

No critical gotcha was confirmed from the server entry points inspected (`server.ts:13-54`).

## High

### Another chat restyler can compete for the same BB selectors

**Problem:** The chat stylesheet is ported from Beautiful Chat, and base composer rules explicitly account for competing chat-restyling plugins (`src/theme/chat.css:1-5`, `src/theme/base.css:693-700`).

**Risk:** Both plugins can style the same elements and produce conflicting appearance.

**Workaround:** Disable Beautiful Chat when using Pokecut's chat layer; the plugin skill gives this instruction (`skills/pokecut-theme/SKILL.md:73-74`).

### File preview depends on experimental BB navigation and DOM title text

**Problem:** File targets are parsed from timeline title strings and opened through `experimental_openFilePreview` (`file-preview-links.ts:13-29`, `app.tsx:91-97`).

**Risk:** Changes to BB's row markup or experimental navigation contract can prevent preview opening.

**Workaround:** Keep the title parsing and target conversion aligned with the current row structure; the helper falls back to a synthetic Alt-click when target lookup or navigation fails (`file-preview-links.ts:46-59`).

## Medium

### The theme stylesheet is generated

**Problem:** `themes/pokecut.css` is generated from the three files in `src/theme/` (`themes/pokecut.css:1`, `scripts/build-theme.mjs:4-15`).

**Risk:** Editing generated output directly is overwritten on the next build.

**Workaround:** Edit source CSS, run `npm run build:theme`, and use `--check` to identify drift (`package.json:35`, `scripts/build-theme.mjs:18-25`).

### DOM helpers must clean up their markers

**Problem:** Helpers annotate BB DOM nodes and observe mutations; their returned cleanup functions remove attributes and stop observers (`context-meter.ts:44-63`, `timeline-marks.ts:20-33`, `message-times.ts:101-107`).

**Risk:** Skipping cleanup when adding a helper leaves stale marker state after changing themes or toggles.

**Workaround:** Return a cleanup function and gate mounting on the active theme state (`app.tsx:27-30`, `theme-active.ts:11-20`).

### RPC preference fields have paired schema and CSS tokens

**Problem:** Preference fields and tokens are defined in `settings.ts`, accepted by `prefsSchema`, then consumed by CSS selectors (`settings.ts:11-27`, `contract.ts:10-14`).

**Risk:** A new toggle that is missing from any layer appears in settings without affecting styling, or is rejected by RPC.

**Workaround:** Update the settings map, schema path, UI grouping, and CSS rule together; see [chat appearance](features/chat-appearance.md).

## Low

### Locale and theme mode use browser local storage

**Problem:** Locale writes `pokecut-theme:locale`; the mode switch writes BB's `bb.theme` (`i18n.ts:145-152`, `theme-mode.tsx:9-25`).

**Risk:** Local-storage restrictions can block persistence; locale catches storage errors while `writeThemeMode` does not (`i18n.ts:184-190`, `theme-mode.tsx:22-25`).

**Workaround:** Keep storage access behavior in mind when debugging locale or theme-mode controls.

<!-- lane-pilot:backlinks -->
## Referenced by

- [Architecture](architecture.md)
- [Pokecut Theme for BB overview](overview.md)
