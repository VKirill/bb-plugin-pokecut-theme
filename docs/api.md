---
title: Plugin API
type: component
created: 2026-10-14
updated: 2026-10-14
status: active
confidence: medium
tags: [api, rpc, bb-plugin]
sources:
  - contract.ts
  - server.ts
  - prefs.ts
  - settings.ts
  - app.tsx
  - settings-section.tsx
  - file-preview-links.ts
  - message-times-collect.ts
  - message-times.ts
  - package.json
---

# Plugin API

TL;DR: The plugin registers five typed BB RPC methods for chat preferences, message timestamps, and thread environment roots; preference changes also publish a global realtime event.

## Purpose

The server registers handlers against `rpcContract` (`server.ts:21-54`). The contract declares five methods and their Zod input/output schemas (`contract.ts:24-36`). Calls are made by this plugin's app through the BB SDK (`prefs.ts:8-26`, `app.tsx:55-56`).

## How it works

1. BB invokes the plugin server entry point and provides `BbPluginApi` (`server.ts:1-13`).
2. The server registers handlers using the shared contract (`server.ts:21-22`).
3. The app obtains the typed RPC client through `useRpc` and calls methods from settings or mounted helpers (`prefs.ts:8-17`, `settings-section.tsx:37-47`).
4. Preference mutations write the normalized value before publishing `prefs-changed` globally (`server.ts:15-19`).

### Methods by area

| Method | Input | Output | Caller and purpose | Auth |
|---|---|---|---|---|
| `getPrefs` | Empty object | Complete `Prefs` | App preference hook reads plugin settings (`prefs.ts:8-17`) | BB plugin RPC; no method-specific authorization branch in handler (`server.ts:21-23`) |
| `setPrefs` | Partial `Prefs` | Complete `Prefs` | Settings UI saves a patch (`settings-section.tsx:37-47`) | BB plugin RPC; no method-specific authorization branch in handler (`server.ts:21-24`) |
| `resetPrefs` | Empty object | Complete `Prefs` | Settings UI restores defaults (`settings-section.tsx:107-109`) | BB plugin RPC; no method-specific authorization branch in handler (`server.ts:21-24`) |
| `messageTimes` | 1–8 nonempty thread IDs, each ≤200 chars; `includeHistory` boolean; strict object | Message records: id, numeric `createdAt`, direction `sent`/`received` | Thread view fetches timestamps (`app.tsx:51-59`) | BB plugin RPC; no method-specific authorization branch in handler (`contract.ts:28-31`, `server.ts:28-45`) |
| `threadRoot` | Nonempty `threadId` ≤200 chars; strict object | Environment id, host id, and path, or `null` | Thread header file-preview helper resolves path (`app.tsx:84-100`) | BB plugin RPC; no method-specific authorization branch in handler (`contract.ts:32-35`, `server.ts:48-53`) |

## Business rules

- `setPrefs` merges a patch with current stored values, then normalizes the merged object (`server.ts:13-17`).
- Preference writes publish `prefs-changed` with `{ global: true }` after storage succeeds (`server.ts:15-19`).
- `messageTimes` deduplicates repeated thread IDs and fetches one page unless history is requested; history stops when no older cursor exists or the page cap is reached (`server.ts:28-45`).
- Timestamp output includes only user and assistant conversation rows with IDs and numeric creation times (`message-times-collect.ts:20-35`).
- `threadRoot` returns `null` if the thread has no environment or the environment has no host/path (`server.ts:48-53`).

## Public API

| Contract export | File | Purpose |
|---|---|---|
| `rpcContract` | `contract.ts:24-36` | Five RPC method contracts |
| `PREFS_CHANGED` | `contract.ts:38-39` | Realtime event name |
| `prefsSchema`, `messageTimeSchema`, `MessageTime` | `contract.ts:10-22` | Validation and timestamp result type |

## Failure behavior

- Storage write errors prevent the realtime event because publish follows the awaited KV write (`server.ts:15-19`).
- `threadRoot` uses `null` for missing environment context; the caller falls back to BB's Alt-click behavior (`server.ts:48-53`, `file-preview-links.ts:54-59`).
- Timestamp errors propagate through RPC; the UI helper catches fetch failures and retries on a later refresh (`message-times.ts:80-92`).

## Gotchas

- There are no HTTP routes in this package's manifest or server registration; the exposed API is BB plugin RPC (`package.json:16-27`, `server.ts:21-54`).
- Auth is supplied by the BB plugin RPC runtime; handlers contain no per-method permission checks (`server.ts:21-54`).
- The history cap is a server constant and equals 12 timeline pages (`server.ts:10`, `server.ts:33-43`).

<!-- lane-pilot:backlinks -->
## Referenced by

- [Architecture](architecture.md)
- [Pokecut Theme for BB overview](overview.md)
