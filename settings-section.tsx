// Bilingual editor for the chat-layer preferences, rendered on the plugin's
// Settings page. BB's declarative settings form has no translations, so the
// preferences live in plugin storage and this section edits them over RPC.
import { useEffect, useState, useSyncExternalStore } from "react";
import { usePrefs } from "./prefs";
import { themeIsActive } from "./theme-active";
import { detectLocale, setLocale, storedPreference, subscribeLocale, t, type I18nKey, type UiLocale } from "./i18n";
import { CHIP_STYLES, LOADERS, type Prefs, type ToggleKey } from "./settings";

const GROUPS: { title: I18nKey; toggles: ToggleKey[] }[] = [
  { title: "groupComposer", toggles: ["promptBar", "minimizeWhileRunning", "mergedBanners"] },
  { title: "groupMessages", toggles: ["messageTimes", "userBubbles", "codeChips", "messageActions", "selectionPill", "streamingCaret", "approvalCard"] },
  { title: "groupWork", toggles: ["workRows", "treeLines", "shimmer", "unreadMarker"] },
];


export function PokecutSettings() {
  // Re-render on language change; t() reads the current locale itself.
  useSyncExternalStore(subscribeLocale, detectLocale, () => "en");
  const preference = useSyncExternalStore(subscribeLocale, storedPreference, () => "auto" as UiLocale);
  const { prefs, setPrefs, error, rpc } = usePrefs();
  const [saveError, setSaveError] = useState(false);
  const [active, setActive] = useState(themeIsActive);
  const [, setTick] = useState(0);
  useEffect(() => {
    // Theme and Russifier state change outside React; re-check periodically.
    const id = window.setInterval(() => {
      setActive(themeIsActive());
      setTick((tick) => tick + 1);
    }, 1500);
    return () => window.clearInterval(id);
  }, []);

  if (error && !prefs) return <p className="pk-settings-error" data-bb-ru-skip="">{t("loadFailed")}</p>;
  if (!prefs) return <p className="pk-settings-muted" data-bb-ru-skip="">{t("loading")}</p>;

  const save = async (patch: Partial<Prefs>) => {
    const previous = prefs;
    setPrefs({ ...prefs, ...patch });
    try {
      setPrefs(await rpc.call("setPrefs", patch));
      setSaveError(false);
    } catch {
      setPrefs(previous);
      setSaveError(true);
    }
  };

  return (
    <div className="pk-settings" data-bb-ru-skip="">
      <div className="pk-settings-heading">
        <h3>{t("sectionTitle")}</h3>
        <p>{t("sectionDescription")}</p>
      </div>
      {!active && <p className="pk-settings-note">{t("themeInactive")}</p>}
      {saveError && <p className="pk-settings-error" role="alert">{t("saveFailed")}</p>}

      <div className="pk-settings-group">
        <Choice
          label={t("language")}
          hint={t("languageHint")}
          value={preference}
          options={[
            { value: "auto", label: t("languageAuto") },
            { value: "en", label: "English" },
            { value: "ru", label: "Русский" },
          ]}
          onChange={(value) => setLocale(value as UiLocale)}
        />
        <Choice
          label={t("loader")}
          hint={t("loaderHint")}
          value={prefs.loader}
          options={LOADERS.map((value) => ({ value, label: t(`loader_${value}` as I18nKey) }))}
          onChange={(loader) => void save({ loader: loader as Prefs["loader"] })}
        />
        <Choice
          label={t("toolChips")}
          hint={t("toolChipsHint")}
          value={prefs.toolChips}
          options={CHIP_STYLES.map((value) => ({ value, label: t(`toolChips_${value}` as I18nKey) }))}
          onChange={(toolChips) => void save({ toolChips: toolChips as Prefs["toolChips"] })}
        />
      </div>

      {GROUPS.map((group) => (
        <fieldset key={group.title} className="pk-settings-group">
          <legend>{t(group.title)}</legend>
          {group.toggles.map((key) => (
            <label key={key} className="pk-settings-row">
              <span className="pk-settings-text">
                <span className="pk-settings-label">{t(key)}</span>
                <span className="pk-settings-hint">{t(`${key}Hint` as I18nKey)}</span>
              </span>
              <input
                type="checkbox"
                role="switch"
                className="pk-switch"
                checked={prefs[key]}
                onChange={(event) => void save({ [key]: event.currentTarget.checked } as Partial<Prefs>)}
              />
            </label>
          ))}
        </fieldset>
      ))}

      <button type="button" className="pk-settings-reset" onClick={() => void rpc.call("resetPrefs", {}).then(setPrefs, () => setSaveError(true))}>
        {t("reset")}
      </button>
    </div>
  );
}

function Choice(props: {
  label: string;
  hint: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="pk-settings-row">
      <span className="pk-settings-text">
        <span className="pk-settings-label">{props.label}</span>
        <span className="pk-settings-hint">{props.hint}</span>
      </span>
      <select className="pk-select" value={props.value} onChange={(event) => props.onChange(event.currentTarget.value)}>
        {props.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
