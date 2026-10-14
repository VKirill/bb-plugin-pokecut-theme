---
title: Decisions
type: decisions
created: 2026-10-14
updated: 2026-10-14
status: active
confidence: medium
tags: [decisions, theme, css]
sources:
  - scripts/build-theme.mjs
  - src/theme/base.css
  - src/theme/chat.css
  - src/theme/integrations.css
  - app.tsx
  - theme-active.ts
---

# Decisions

TL;DR: The plugin places the chat restyle in the selected theme stylesheet so it shares the theme lifecycle and can be removed when the user selects another theme.

## 001. Ship chat styling in the selected theme stylesheet

**Context:** BB's theme CSS is the plugin's app-wide stylesheet and exists while that theme is selected; the chat layer therefore needs to follow theme selection (`scripts/build-theme.mjs:1-4`).

**Decision:** Build one theme CSS file from base, chat, and integrations source files (`scripts/build-theme.mjs:9-17`). The chat layer is included in this selected-theme file (`src/theme/chat.css:1-5`). This choice appears in the commit that absorbed Beautiful Chat into the Pokecut theme (`cdf2f8a`).

**Status:** Active.

**Consequences:** Selecting another theme removes the theme CSS; app-side DOM enhancements are separately gated on the Pokecut theme marker and clean up when unmounted (`theme-active.ts:6-20`, `app.tsx:27-43`). CSS source edits require regenerating `themes/pokecut.css` (`scripts/build-theme.mjs:13-27`).

<!-- lane-pilot:backlinks -->
## Referenced by

- [Pokecut Theme for BB overview](overview.md)
