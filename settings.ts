// Chat-layer preferences → attributes on <html> that the theme CSS switches on.
// Pure so it can be tested; values arrive from plugin storage and are untrusted.

/** Pending-row loader. pokecut is the accent-gradient ring; drive/dots/orbit are
    BeautifulUI's variants, coins is Originkit's Coin Loader; bb keeps BB's own icon. */
export const LOADERS = ["pokecut", "drive", "dots", "orbit", "coins", "bb"] as const;

/** Tool call rows: filled chip, hairline only, or BB's plain row. */
export const CHIP_STYLES = ["surface", "outline", "plain"] as const;

/** Boolean preferences → the token the CSS looks for in `data-pk-off` when turned off. */
export const TOGGLES = {
  promptBar: "prompt",
  userBubbles: "bubbles",
  codeChips: "code",
  messageActions: "actions",
  workRows: "rows",
  shimmer: "shimmer",
  streamingCaret: "caret",
  approvalCard: "approval",
  selectionPill: "selection",
  unreadMarker: "unread",
  mergedBanners: "banners",
  minimizeWhileRunning: "minimize",
  treeLines: "tree",
} as const;

export type Loader = (typeof LOADERS)[number];
export type ChipStyle = (typeof CHIP_STYLES)[number];
export type ToggleKey = keyof typeof TOGGLES;
export const TOGGLE_KEYS = Object.keys(TOGGLES) as ToggleKey[];

export type Prefs = { loader: Loader; toolChips: ChipStyle } & Record<ToggleKey, boolean>;

export const DEFAULT_PREFS: Prefs = {
  loader: "pokecut",
  toolChips: "surface",
  ...(Object.fromEntries(TOGGLE_KEYS.map((key) => [key, true])) as Record<ToggleKey, boolean>),
};

/** Untrusted stored or submitted values → complete prefs; anything unknown falls back. */
export function normalizePrefs(values: Record<string, unknown> | null | undefined): Prefs {
  const v = values ?? {};
  const prefs: Prefs = { ...DEFAULT_PREFS };
  prefs.loader = LOADERS.find((option) => option === v.loader) ?? DEFAULT_PREFS.loader;
  prefs.toolChips = CHIP_STYLES.find((option) => option === v.toolChips) ?? DEFAULT_PREFS.toolChips;
  for (const key of TOGGLE_KEYS) if (typeof v[key] === "boolean") prefs[key] = v[key] as boolean;
  return prefs;
}

export function rootAttributes(values: Record<string, unknown>) {
  const prefs = normalizePrefs(values);
  return {
    loader: prefs.loader,
    chips: prefs.toolChips,
    off: TOGGLE_KEYS.filter((key) => !prefs[key]).map((key) => TOGGLES[key]),
  };
}
