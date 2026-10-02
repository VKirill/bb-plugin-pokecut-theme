// Light / dark / system switch in the sidebar footer, like Pokecut's segmented
// control. BB keeps the preference in localStorage ("bb.theme") behind a storage
// subscription that only listens to `storage` events, so writing the key and
// dispatching that event lets BB apply the mode with its own code — the
// Appearance settings page shows the same choice.
import { useSyncExternalStore } from "react";
import { t, type I18nKey } from "./i18n";

export type ThemeMode = "light" | "dark" | "system";
export const THEME_MODES: ThemeMode[] = ["light", "dark", "system"];
const KEY = "bb.theme";

export function readThemeMode(): ThemeMode {
  try {
    const value = localStorage.getItem(KEY);
    return value === "light" || value === "dark" ? value : "system";
  } catch {
    return "system";
  }
}

export function writeThemeMode(mode: ThemeMode): void {
  const oldValue = localStorage.getItem(KEY);
  localStorage.setItem(KEY, mode);
  window.dispatchEvent(new StorageEvent("storage", { key: KEY, oldValue, newValue: mode, storageArea: localStorage }));
}

function subscribe(listener: () => void): () => void {
  window.addEventListener("storage", listener);
  return () => window.removeEventListener("storage", listener);
}

export function ThemeModeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.8v1.7M12 19.5v1.7M2.8 12h1.7M19.5 12h1.7M5.5 5.5l1.2 1.2M17.3 17.3l1.2 1.2M5.5 18.5l1.2-1.2M17.3 6.7l1.2-1.2" />
      <path d="M12 7.8a4.2 4.2 0 0 0 0 8.4z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ThemeModeSwitch({ dismiss }: { dismiss(): void }) {
  const mode = useSyncExternalStore(subscribe, readThemeMode, () => "system" as ThemeMode);
  return (
    <div className="pk-mode" data-bb-ru-skip="">
      <div className="pk-mode-title">{t("themeMode")}</div>
      <div className="pk-segmented" role="radiogroup" aria-label={t("themeMode")}>
        {THEME_MODES.map((value) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={mode === value}
            className="pk-segment"
            onClick={() => {
              writeThemeMode(value);
              dismiss();
            }}
          >
            {t(`themeMode_${value}` as I18nKey)}
          </button>
        ))}
      </div>
    </div>
  );
}
