---
title: Pokecut Theme for BB
updated: 2026-10-18
sources:
  - package.json
  - server.ts
  - app.tsx
  - typeahead-tap-guard.ts
  - settings.ts
  - docs/architecture.md
  - docs/gotchas.md
---

# Pokecut Theme for BB

## Identity

- BB plugin package: `bb-plugin-pokecut-theme`; manifest name: `Pokecut Theme` (`package.json:2-3`, `package.json:10-12`).
- Provides a selectable theme plus a plugin app and server (`package.json:16-27`).
- BB compatibility: `>=0.44`; plugin SDK compatibility: `>=0.5.0` (`package.json:6-9`).
- Start with [overview](docs/overview.md); system boundaries are in [architecture](docs/architecture.md).

## Entry points

- Plugin server and typed RPC handlers: `server.ts:13-55`; API details: [api](docs/api.md).
- Plugin app slots and DOM enhancements: `app.tsx:24-117`; behavior: [chat enhancements](docs/features/chat-enhancements.md).
- Theme manifest points to `themes/pokecut.css`: `package.json:17-23`; authored CSS is under `src/theme/`.
- Build scripts and local install steps: [deployment](docs/deployment.md).

## Critical invariants

- The generated theme stylesheet is composed from `src/theme/base.css`, `src/theme/chat.css`, and `src/theme/integrations.css`; edit sources and regenerate (`scripts/build-theme.mjs:4-25`). See [theme appearance](docs/features/theme-appearance.md).
- Preference input is normalized to known loader, chip, and boolean values before use (`settings.ts:42-49`); field meanings are in [data model](docs/data-model.md).
- DOM enhancements, including the typeahead tap guard, are gated on Pokecut being the active theme (`app.tsx:27-30`, `app.tsx:64`, `theme-active.ts:6-9`). See [chat enhancements](docs/features/chat-enhancements.md).

## Conventions

- Strict TypeScript, ES2022 target, bundler module resolution, no emitted JS (`tsconfig.json:1-19`).
- Keep preference field names and their CSS tokens synchronized across `settings.ts`, `contract.ts`, and `src/theme/chat.css`; see [chat appearance](docs/features/chat-appearance.md).
- Treat `themes/pokecut.css` as generated output, not an authoring source (`themes/pokecut.css:1`).

## Common gotchas

- A second chat restyler can compete for the same BB markup; see [gotchas](docs/gotchas.md#high).
- The coins loader needs CSS Paint Worklet support and falls back if registration fails (`app.tsx:70-83`).
- File-preview behavior depends on a thread environment root and BB's experimental preview API (`app.tsx:84-100`).

## Useful commands

- `npm install` — install dependencies.
- `npm run build:theme` — regenerate the bundled stylesheet.
- `npm run typecheck` — run TypeScript checking.
- `npm test` — run Node's test runner over `*.test.ts`.
- `npm run build` — run theme generation, typecheck, tests, and `bb plugin build .` (`package.json:34-38`).
- `bb plugin install path:. --yes` — install the working tree into BB.
- `bb plugin reload pokecut-theme` — reload an installed plugin after CSS changes.

See [deployment](docs/deployment.md) for the command sequence and requirements.
