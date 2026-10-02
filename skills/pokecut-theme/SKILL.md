---
name: pokecut-theme
description: "Explain or adjust the Pokecut theme plugin for BB: activate or reset the theme, toggle chat-layer features (composer, bubbles, code chips, work rows, loaders, approval cards, banners, tooltips), and know which BB markup each rule targets."
---

# Pokecut theme

The plugin contributes one app theme, `plugin:pokecut-theme:pokecut`, and a chat
layer that restyles BB's native chat. Both live in the theme CSS, so nothing
applies unless the theme is selected.

## Activate and revert

```sh
bb theme set plugin:pokecut-theme:pokecut
bb theme reset            # back to Default
```

## Chat-layer preferences

Stored in the plugin's storage and edited in Settings → Plugins → Pokecut Theme
(section "Chat appearance", English or Russian by BB's interface language).
The overlay mirrors them onto `<html>`:

| Preference | Values | `data-pk-*` effect |
| --- | --- | --- |
| `loader` | drive, dots, orbit, coins, bb | `data-pk-loader` |
| `toolChips` | surface, outline, plain | `data-pk-chips` |
| `promptBar` | on/off | off-token `prompt` |
| `minimizeWhileRunning` | on/off | `minimize` |
| `mergedBanners` | on/off | `banners` |
| `userBubbles` | on/off | `bubbles` |
| `codeChips` | on/off | `code` |
| `messageActions` | on/off | `actions` (also unmounts the spatial tooltip) |
| `selectionPill` | on/off | `selection` |
| `streamingCaret` | on/off | `caret` |
| `approvalCard` | on/off | `approval` |
| `workRows` | on/off | `rows` |
| `treeLines` | on/off | `tree` |
| `shimmer` | on/off | `shimmer` |
| `unreadMarker` | on/off | `unread` |

Off-tokens are space-separated in `data-pk-off`. All default to on.

## Design rules for plugin screens

Plugins that want the Pokecut look (Lane Pilot does, in its `app.css`) read the
theme's `--pk-*` tokens with a fallback to BB's palette, so they stay tidy under
any theme. Keep one radius scale:

| Element | Radius |
| --- | --- |
| Rows (nav, list, menu items), buttons, inputs, selects | 8px |
| Segment inside a segmented track | 6px (track 9px) |
| Inner white card, message bubble, code well | 12px |
| Single card, page header strip | 14px |
| Panel: gray well around a header and an inner card | 16px |
| Dialogs and the app content panel | 20px |

Selected row or segment: white `--pk-card` with an inset `--pk-outline` ring and
`--pk-drop`, never a larger radius than its siblings. Primary action: the
`--pk-accent-gradient`; secondary: white with `--pk-outline` and `--pk-drop`.
Statuses are soft tinted pills (fully rounded). The «?» help mark is a 14px
circle raised to the top of the title line, after its last word.

## Where the CSS lives

Edit `src/theme/base.css` (palette, shell, sidebar, composer chips, phone
drawers) and `src/theme/chat.css` (chat layer, ported from Beautiful Chat,
MIT). `npm run build` regenerates `themes/pokecut.css`; never edit that file.
After a CSS change on a path install: `bb plugin reload pokecut-theme`.

Beautiful Chat is superseded by this plugin; keep it disabled to avoid two
layers styling the same markup.
