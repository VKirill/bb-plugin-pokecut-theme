# Pokecut Theme for BB

[![BB Compatibility](https://img.shields.io/badge/BB-%3E%3D0.44-blue.svg)](https://getbb.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A soft dashboard theme for BB after the [Pokecut](https://pokecut.rakibulism.space)
admin design: a flat gray shell, the content area as one raised rounded panel
with a hairline and a soft drop, white cards, the open thread as a raised pill,
and a pink-violet gradient on the send button. Light and dark.

[Русский](README.ru.md)

Only the visual language is reproduced. No Pokecut source, images or fonts are
bundled; BB already ships Inter.

## Install

```sh
bb plugin install https://github.com/VKirill/bb-plugin-pokecut-theme
bb theme set plugin:pokecut-theme:pokecut
```

Or pick **Pokecut** under Settings → Appearance. The theme follows BB's
light/dark mode.

Revert: `bb theme reset` (or choose another theme). Removing the plugin
removes the theme; nothing is written to BB's own files.

## What it changes

| Part | Light | Dark |
| --- | --- | --- |
| Shell (sidebar, frame) | `#EDEDED` | `#0E1014` |
| Content panel | `#FAFAFA`, 1px `#CFCFCF`, radius 20px, drop `0 8px 16px -4px` | `#16181D`, 1px `#3A3F49` |
| Cards, composer | `#FFFFFF`, radius 16px | `#1B1E24` |
| Ink / muted / subtle | `#393846` / `#5E5E5E` / `#6A6B73` | `#DCDDE2` / `#9B9EA6` / `#8A8D96` |
| Primary (links, focus) | `#9B4D8F` | `#D88BC4` |
| Send button | gradient `#D96D98 → #8C69C3` | same |

Shape rules use BB's stable markup only: `[data-sidebar="inset"]` for the
panel (from 768px wide), `.bb-sidebar-selected-row` and the project-folders
`.pf-thread.pf-active` for the open thread, `[data-app-composer]
form[data-promptbox]` and `[data-promptbox-send-menu]` for the composer.
Composer rules carry extra `:root` weight so they win over chat restylers such
as Beautiful Chat, whose colors already derive from the active theme.

## Source layout

| File | Contributes |
| --- | --- |
| `themes/pokecut.css` | The whole theme: palette in `:root, .light` and `.dark`, then shell, sidebar, composer, menus and code-block rules. |
| `package.json` | Declares the theme under `bb.themes` (id `pokecut`). |
| `server.ts` | Empty plugin entry; BB requires one. |

## Develop

```sh
npm install
npm run build          # tsc + bb plugin build
bb plugin install path:. --yes
bb plugin reload pokecut-theme   # after CSS edits
```

Theme Preview (built-in plugin) shows token contrast for both modes.

## License

MIT
