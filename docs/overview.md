---
title: Pokecut Theme for BB overview
type: overview
created: 2026-10-14
updated: 2026-10-18
status: active
confidence: medium
tags: [bb-plugin, theme, overview]
sources:
  - package.json
  - server.ts
  - app.tsx
  - settings-section.tsx
  - settings.ts
  - contract.ts
  - theme-active.ts
  - prefs.ts
  - scripts/build-theme.mjs
  - src/theme/chat.css
  - src/theme/integrations.css
  - theme-active.ts
  - src/theme/base.css
  - src/theme/chat.css
  - src/theme/integrations.css
  - tsconfig.json
---

# Pokecut Theme for BB overview

TL;DR: This BB plugin registers a selectable Pokecut theme and an app layer that adds configurable chat styling and small DOM enhancements.

## What it is

The package contributes a theme with id `pokecut`, backed by `themes/pokecut.css`, and registers a plugin app and server (`package.json:10-27`). The theme stylesheet defines base shell styling, chat styling, and integrations styling; the build script joins those source files into the stylesheet BB loads (`scripts/build-theme.mjs:4-25`).

The app registers a renderless overlay, a settings section, a thread-header file-preview helper, and a sidebar-footer theme-mode control (`app.tsx:104-117`). The server reads and writes chat preferences in plugin key-value storage and provides timeline timestamps and thread-root information over RPC (`server.ts:13-54`).

People use the Pokecut theme through BB's appearance selection. Chat appearance options are edited in the plugin settings section and apply when Pokecut is the active theme (`settings-section.tsx:17-35`, `app.tsx:27-43`).

## Stack

- TypeScript targeting ES2022 with strict checking (`tsconfig.json:1-17`).
- React app integration through `@get-bb/plugin-sdk` 0.5.29 (`package.json:52-54`).
- Zod 4 schemas for plugin RPC contracts (`package.json:52-54`, `contract.ts:1-3`).
- CSS source files compiled by a Node script; package scripts run TypeScript, Node tests, and BB's plugin builder (`package.json:34-38`).

## Quick start

```sh
npm install
npm run build
bb plugin install path:. --yes
bb theme set plugin:pokecut-theme:pokecut
```

The build steps and prerequisites are in [deployment](deployment.md).

## Main parts

- **Theme CSS:** palette, shell, chat components, and supported integrations; see [theme appearance](features/theme-appearance.md) (`src/theme/base.css:1-35`, `src/theme/chat.css:1-30`).
- **Chat preferences:** validated loader, tool-row style, and feature toggles; see [chat appearance](features/chat-appearance.md) (`settings.ts:4-27`, `contract.ts:10-14`).
- **Chat enhancements:** context meter, error marks, message timestamps, diff paths, file previews, locale, tooltips, and typeahead tap protection; see [chat enhancements](features/chat-enhancements.md) (`app.tsx:43-83`).
- **RPC server:** preference storage and BB SDK timeline/environment lookups; see [API](api.md) (`server.ts:13-54`).

## Where to look next

- [Architecture](architecture.md) for runtime boundaries and calls.
- [Decisions](decisions.md) for the recorded stylesheet lifecycle decision.
- [API](api.md) for all RPC methods and input/output behavior.
- [Data model](data-model.md) for the stored preference record.
- [Deployment](deployment.md) for build and install commands.
- [Gotchas](gotchas.md) for integration constraints.

<!-- lane-pilot:backlinks -->
## Referenced by

- [Theme appearance](features/theme-appearance.md)
