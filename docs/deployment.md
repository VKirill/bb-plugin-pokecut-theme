---
title: Development and deployment
type: deployment
created: 2026-10-14
updated: 2026-10-14
status: active
confidence: high
tags: [deployment, build, development]
sources:
  - package.json
  - scripts/build-theme.mjs
  - tsconfig.json
  - server.ts
  - settings-section.tsx
  - app.tsx
  - theme-mode.tsx
---

# Development and deployment

TL;DR: Install Node dependencies, run the package build, then install the plugin into BB and select the Pokecut theme.

## Prerequisites

- Node.js with support for `--experimental-strip-types`, used by the test command (`package.json:37`).
- npm and the BB CLI; the build invokes `bb plugin build .` (`package.json:38`).
- BB 0.44 or newer and plugin SDK 0.5.0 or newer (`package.json:6-9`).

## Build and verify

1. Install locked dependencies:

   ```sh
   npm install
   ```

2. Generate the bundled theme CSS:

   ```sh
   npm run build:theme
   ```

3. Check TypeScript:

   ```sh
   npm run typecheck
   ```

4. Run the repository tests:

   ```sh
   npm test
   ```

5. Build the BB plugin package:

   ```sh
   bb plugin build .
   ```

The `npm run build` script executes those steps in order (`package.json:34-38`).

## Install and activate

1. Install from the working tree:

   ```sh
   bb plugin install path:. --yes
   ```

2. Select the theme:

   ```sh
   bb theme set plugin:pokecut-theme:pokecut
   ```

The plugin manifest registers the theme and its stylesheet path (`package.json:17-23`).

## Configure

Open Settings → Plugins → Pokecut Theme → Chat appearance to change chat preferences (`settings-section.tsx:49-109`). Select light, dark, or system in the plugin's sidebar footer control (`app.tsx:109-117`, `theme-mode.tsx:43-65`).

## Verify and reload

- `npm run build` verifies theme generation, TypeScript, tests, and BB packaging (`package.json:34-38`).
- After editing CSS in an installed working tree, reload the plugin:

  ```sh
  bb plugin reload pokecut-theme
  ```

- To verify generated CSS without rewriting it, run `node scripts/build-theme.mjs --check` (`scripts/build-theme.mjs:18-25`).

## Roll back

1. Select the default appearance:

   ```sh
   bb theme reset
   ```

2. Remove the plugin through BB's plugin management if the plugin itself must be removed. The repository does not define a custom uninstall script (`package.json:34-38`).

<!-- lane-pilot:backlinks -->
## Referenced by

- [Pokecut Theme for BB overview](overview.md)
