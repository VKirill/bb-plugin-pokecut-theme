---
title: Chat and timeline enhancements
type: component
created: 2026-10-14
updated: 2026-10-14
status: active
confidence: high
tags: [chat, timeline, dom]
sources:
  - app.tsx
  - contract.ts
  - settings.ts
  - theme-active.ts
  - server.ts
  - context-meter.ts
  - timeline-marks.ts
  - message-times.ts
  - message-times-collect.ts
  - diff-paths.ts
  - file-preview-links.ts
  - spatial-tooltip.ts
  - coins-worklet.ts
  - i18n.ts
---

# Chat and timeline enhancements

TL;DR: While Pokecut is selected, the plugin observes BB's rendered DOM and adds context usage, error labels, timestamps, file links, path formatting, locale attributes, and tooltips.

## Purpose

The app overlay mounts DOM helpers only when Pokecut is active; feature toggles gate the context meter, timeline marks, timestamps, and tooltip enhancement (`app.tsx:27-65`). File preview links run from the thread header slot because BB accepts the preview intent from a component in the thread view (`app.tsx:84-105`).

## How it works

1. `useThemeActive` checks the computed `--pk-theme` marker and observes document changes (`theme-active.ts:6-20`).
2. The app mounts locale observation and diff-path splitting while active (`app.tsx:43`, `app.tsx:61`; `i18n.ts:206-245`, `diff-paths.ts:44-59`).
3. If `promptBar` is enabled, the context helper reads the percentage from BB's context button accessible label, clamps it to 0–100, and writes the percent and level to the composer footer (`app.tsx:45-46`, `context-meter.ts:11-41`).
4. If `workRows` is enabled, the timeline helper marks labels containing English `error(s)` or Russian `ошиб` text and marks their rows (`app.tsx:48-49`, `timeline-marks.ts:4-17`).
5. If `messageTimes` is enabled and a thread is open, the app asks the server for message times; the server pages BB timeline rows and recursively collects user and assistant conversation rows (`app.tsx:51-59`, `server.ts:28-45`, `message-times-collect.ts:16-36`).
6. The timestamp helper decorates matching rows, refreshes every 15 seconds, and reruns decoration when the DOM changes (`message-times.ts:54-70`, `message-times.ts:73-107`).
7. The file-preview helper extracts a path from a timeline row, resolves it against the thread root, and invokes BB's experimental file-preview navigation (`app.tsx:84-100`, `file-preview-links.ts:21-62`).
8. If `loader` is `coins`, the app attempts to register a CSS Paint Worklet; only a successful registration sets the readiness attribute (`app.tsx:67-80`, `coins-worklet.ts:41-54`).

### Modes, states, and limits

| Helper | Branch or limit | Result |
|---|---|---|
| Context meter | No parseable percentage means footer percentage attributes are removed; values clamp to 0–100 | CSS gets percentage and low/mid/high level (`context-meter.ts:11-40`) |
| Message history | First request includes history; server requests at most 12 pages | Returns collected timestamps (`message-times.ts:73-85`, `server.ts:10`, `server.ts:33-43`) |
| File target | Relative paths and paths inside thread root become workspace targets; outside paths become host targets | BB preview target (`file-preview-links.ts:31-39`) |
| File click | Plain left click opens preview; modifier clicks keep BB's default action | Preview navigation or Alt-click fallback (`file-preview-links.ts:46-59`) |
| Coins loader | Worklet registration success sets readiness; CSS fallback remains when unavailable | Animated worklet or fallback loader (`app.tsx:67-80`) |
| Locale | Explicit `en`/`ru` preference, BB document language, then Russifier detection | `data-pk-lang` on document root (`i18n.ts:172-178`, `i18n.ts:206-245`) |

### Failures

- Timestamp fetch failures leave existing decoration available and retry on a later refresh; no error is surfaced to the user (`message-times.ts:80-92`).
- If thread root lookup fails or BB rejects preview navigation, the helper retries the row click with Alt held (`file-preview-links.ts:54-59`).
- If no thread environment/path is available, the server returns `null` (`server.ts:48-53`); the helper then falls back to Alt-click behavior (`file-preview-links.ts:54-59`).
- If the context label has no percentage or the expected footer is absent, no percentage styling is applied (`context-meter.ts:23-41`).
- Every observer helper disconnects and removes its owned attributes when unmounted (`context-meter.ts:44-63`, `timeline-marks.ts:20-33`, `message-times.ts:101-107`).

## Business rules

- Only conversation rows with `user` or `assistant` role, a string id, and numeric `createdAt` are collected; nested `children` and `childRows` are included (`message-times-collect.ts:20-35`).
- A message is marked `sent` only when role is `user` and initiator is `user`; other included rows are `received` (`message-times-collect.ts:27-31`).
- Thread history pagination stops when no older rows/cursor remain or after the server page limit (`server.ts:10`, `server.ts:33-43`).
- File path prefixes use the current thread's environment root; files outside that root use host paths (`file-preview-links.ts:31-39`).

## Public API

| Export | File | Purpose |
|---|---|---|
| `parsePercent`, `levelOf`, `mountContextMeter` | `context-meter.ts:12-64` | Parse and mount context usage UI metadata |
| `mountTimelineMarks`, `isErrorLabel` | `timeline-marks.ts:7-34` | Mark error count labels and rows |
| `collectMessageTimes`, `TimelineNode` | `message-times-collect.ts:6-37` | Extract timestamp data from nested timeline rows |
| `formatRelative`, `mountMessageTimes` | `message-times.ts:15-108` | Decorate visible timeline rows with timestamps |
| `splitPath`, `mountDiffPaths` | `diff-paths.ts:9-59` | Split changed-file paths for styling |
| `fullPathFromTitle`, `targetFor`, `mountFilePreviewLinks` | `file-preview-links.ts:21-63` | Resolve timeline file links to preview targets |
| `mountSpatialTooltips` | `spatial-tooltip.ts:36-89` | Position tooltip decoration |
| `placeTip` | `spatial-tooltip.ts:15-23` | Compute tooltip placement |
| `FetchTimes`, `formatRelative` | `message-times.ts:13-24` | Timestamp fetch callback and relative-time formatting |
| `FileTarget`, `ThreadRoot` | `file-preview-links.ts:6-11` | File preview target and thread root shapes |
| `registerCoinsWorklet` | `coins-worklet.ts:41-54` | Register the coins paint worklet |
| `themeIsActive`, `useThemeActive` | `theme-active.ts:6-20` | Detect Pokecut selection and subscribe to changes |
| `detectLocale`, `storedPreference`, `setLocale`, `subscribeLocale`, `mountDocumentLocale`, `t`, `I18nKey`, `Locale`, `UiLocale` | `i18n.ts:72-249` | Detect, store, apply, and type the UI locale |

## Gotchas

- BB timeline DOM does not expose timestamps in the rendered rows; timestamps come from server SDK calls and are matched by row id (`message-times.ts:1-5`, `message-times.ts:54-66`).
- `messageTimes` accepts at most eight thread IDs per RPC request; the app requests one (`contract.ts:28-30`, `app.tsx:55-56`).
- File preview handling uses experimental BB navigation APIs and depends on timeline title markup (`app.tsx:84-100`, `file-preview-links.ts:13-29`).

<!-- lane-pilot:backlinks -->
## Referenced by

- [Architecture](../architecture.md)
- [Pokecut Theme for BB overview](../overview.md)
