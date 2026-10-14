---
title: Chat appearance settings
type: component
created: 2026-10-14
updated: 2026-10-14
status: active
confidence: high
tags: [chat, settings, preferences]
sources:
  - settings.ts
  - contract.ts
  - server.ts
  - settings-section.tsx
  - prefs.ts
  - app.tsx
  - i18n.ts
  - src/theme/chat.css
  - app.css
  - context-meter.ts
  - settings.test.ts
---

# Chat appearance settings

TL;DR: A bilingual settings section stores validated chat style preferences through RPC; the app mirrors them to `<html>` attributes consumed by theme CSS.

## Purpose

The settings section lets a BB user choose a pending-row loader and tool-row appearance, toggle individual chat styling features, and reset to defaults (`settings-section.tsx:49-109`). The app translates those values into `data-pk-loader`, `data-pk-chips`, and `data-pk-off` attributes (`settings.ts:52-59`, `app.tsx:33-41`).

## How it works

1. The app hook calls `getPrefs` when the realtime connection is active and refreshes on `prefs-changed` (`prefs.ts:8-26`).
2. The settings view shows a loading state until preferences arrive, and an error if the initial request fails (`settings-section.tsx:21-35`).
3. Each control sends a partial patch through `setPrefs`; the UI updates optimistically and restores its previous state if the call fails (`settings-section.tsx:37-47`).
4. The server merges the patch with stored values, normalizes it, writes the complete record, then publishes the global event (`server.ts:13-19`).
5. The app maps disabled switches to space-separated CSS tokens and removes its attributes when the theme is inactive or the effect unmounts (`settings.ts:52-59`, `app.tsx:27-41`).
6. Reset calls `resetPrefs`, which writes normalized defaults (`settings-section.tsx:107-109`, `server.ts:22-24`).

### Modes and variants

| Setting | Values | Default | Effect |
|---|---|---|---|
| `loader` | `pokecut` (Gradient ring), `drive` (Pixel sweep), `dots` (Round pixels), `orbit`, `coins`, `bb` (BB's own icon) | `pokecut` | Changes the pending work-row icon (`settings.ts:4-6`, `i18n.ts:31-38`) |
| `toolChips` | `surface` (Filled card), `outline` (Outline only), `plain` | `surface` | Changes how a single tool-call row is drawn (`settings.ts:8-9`, `i18n.ts:39-43`) |
| Boolean feature toggles | `true` / `false` | `true` for all | False values become tokens in `data-pk-off` (`settings.ts:11-27`, `settings.ts:36-40`) |
| Settings locale | `auto`, `en`, `ru` | `auto` | Stored separately in browser local storage (`i18n.ts:145-152`, `i18n.ts:184-190`) |

Boolean fields: `promptBar`, `userBubbles`, `codeChips`, `messageActions`, `workRows`, `shimmer`, `streamingCaret`, `approvalCard`, `selectionPill`, `unreadMarker`, `mergedBanners`, `minimizeWhileRunning`, `treeLines`, and `messageTimes` (`settings.ts:12-27`).

| Toggle | Visible behavior when enabled |
|---|---|
| `promptBar` | Raised composer, compact controls and phone layout, project/machine/access chips (`i18n.ts:44-45`) |
| `minimizeWhileRunning` | Empty composer shrinks to one line during a live run; typing expands it (`i18n.ts:46-47`) |
| `mergedBanners` | Composer banners appear as one card with dividers (`i18n.ts:48-49`) |
| `userBubbles`, `codeChips` | Filled user-message bubbles; inline code chips and card-style code blocks (`i18n.ts:50-53`) |
| `messageActions`, `selectionPill`, `streamingCaret`, `approvalCard` | Hover action chips and tooltip, selection actions pill, streaming caret, approval/question cards (`i18n.ts:54-61`) |
| `workRows`, `treeLines`, `shimmer`, `unreadMarker` | Compact work-row headers, expanded-row tree, status-label shimmer, and `NEW` unread marker (`i18n.ts:62-69`) |
| `messageTimes` | Relative time on hover and exact date in the time tooltip (`i18n.ts:19-20`) |

The context meter marks usage below 60% as low, 60% through below 85% as mid, and 85% or higher as high (`context-meter.ts:19-20`).

### Failures

- Invalid stored or submitted enumerated values fall back to defaults; non-boolean toggle values are ignored (`settings.ts:42-49`).
- Initial preference load failure renders a translated error state; a failed save restores the prior client value and displays an error (`settings-section.tsx:34-46`).
- Reset failure sets the save-error flag without replacing the current client state (`settings-section.tsx:107-108`).
- If RPC is unavailable in the app layer, CSS defaults continue to apply until preferences are loaded (`app.tsx:33-41`).

## Business rules

- Only the six loader names and three tool-chip styles are accepted (`settings.ts:4-9`, `contract.ts:10-14`).
- Every boolean feature defaults to enabled (`settings.ts:36-40`).
- Unknown keys are not copied into the normalized preference object (`settings.ts:42-49`; verified by `settings.test.ts:64-70`).
- Settings controls are bilingual and locale selection is local to the browser (`settings-section.tsx:58-83`, `i18n.ts:145-190`).

## Public API

| Import or entry | File | Purpose |
|---|---|---|
| `DEFAULT_PREFS`, `normalizePrefs`, `rootAttributes`, preference types | `settings.ts:29-59` | Define defaults, sanitize input, and derive DOM attributes |
| `usePrefs` | `prefs.ts:8-26` | Read and subscribe to server preferences |
| `PokecutSettings` | `settings-section.tsx:17-112` | Render and update the settings UI |
| `prefsSchema`, `rpcContract`, `PREFS_CHANGED` | `contract.ts:10-39` | Validate RPC shapes and name the update event |

## Gotchas

- Browser locale preference and plugin chat preferences use different stores: local storage for locale, plugin KV for chat settings (`i18n.ts:145-152`, `server.ts:13-19`).
- `messageActions` also controls mounting the spatial tooltip helper (`app.tsx:64-65`).
- The theme's base chat CSS can be selected without the app attributes; the app waits for RPC preferences before writing those attributes (`app.tsx:33-41`).

<!-- lane-pilot:backlinks -->
## Referenced by

- [Architecture](../architecture.md)
- [Gotchas](../gotchas.md)
- [Pokecut Theme for BB overview](../overview.md)
