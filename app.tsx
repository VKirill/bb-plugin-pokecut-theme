// bb-plugin-pokecut-theme — app side of the chat layer. The styling itself is in
// the theme CSS (themes/pokecut.css), switched per feature by attributes on <html>
// that mirror the stored preferences. The overlay renders nothing; the settings
// section is the bilingual editor for those preferences.
import "./app.css";
import { useEffect } from "react";
import { definePluginApp, useBbContext, useBbNavigate } from "@get-bb/plugin-sdk/app";
import { usePrefs } from "./prefs";
import { useThemeActive } from "./theme-active";
import { rootAttributes } from "./settings";
import { registerCoinsWorklet } from "./coins-worklet";
import { mountSpatialTooltips } from "./spatial-tooltip";
import { mountContextMeter } from "./context-meter";
import { mountTimelineMarks } from "./timeline-marks";
import { mountMessageTimes } from "./message-times";
import { mountDiffPaths } from "./diff-paths";
import { mountFilePreviewLinks } from "./file-preview-links";
import { PokecutSettings } from "./settings-section";
import { ThemeModeIcon, ThemeModeSwitch } from "./theme-mode";
import { t } from "./i18n";

const ROOT_ATTRIBUTES = ["data-pk-loader", "data-pk-chips", "data-pk-off"];

function PokecutChatLayer() {
  const { prefs, rpc } = usePrefs();
  const { threadId } = useBbContext();
  // Everything below touches BB's DOM, so it runs only while the Pokecut theme is
  // selected; with any other theme the plugin leaves the interface alone.
  const active = useThemeActive();
  const { loader, chips, off } = rootAttributes(prefs ?? {});
  const offList = off.join(" ");

  useEffect(() => {
    // Until prefs arrive the CSS defaults apply, which match the preference defaults.
    if (!prefs || !active) return;
    const root = document.documentElement;
    root.setAttribute("data-pk-loader", loader);
    root.setAttribute("data-pk-chips", chips);
    root.setAttribute("data-pk-off", offList);
    return () => ROOT_ATTRIBUTES.forEach((name) => root.removeAttribute(name));
  }, [prefs, active, loader, chips, offList]);

  const meter = active && !off.includes("prompt");
  useEffect(() => (meter ? mountContextMeter() : undefined), [meter]);

  const rows = active && !off.includes("rows");
  useEffect(() => (rows ? mountTimelineMarks() : undefined), [rows]);

  const times = active && !off.includes("times") && !!threadId;
  useEffect(
    () =>
      times && threadId
        ? mountMessageTimes(threadId, async (threadIds, includeHistory) =>
            (await rpc.call("messageTimes", { threadIds, includeHistory })).messages)
        : undefined,
    [times, threadId, rpc],
  );

  useEffect(() => (active ? mountDiffPaths() : undefined), [active]);


  const tooltips = active && !off.includes("actions");
  useEffect(() => (tooltips ? mountSpatialTooltips() : undefined), [tooltips]);

  // The coins loader paints through a CSS Paint Worklet; until it is registered (or if
  // it can't be) the CSS keeps showing the drive loader instead of a blank icon.
  const coins = active && loader === "coins";
  useEffect(() => {
    if (!coins) return;
    let current = true;
    registerCoinsWorklet().then((ready) => {
      if (current && ready) document.documentElement.setAttribute("data-pk-coins-ready", "");
    });
    return () => {
      current = false;
      document.documentElement.removeAttribute("data-pk-coins-ready");
    };
  }, [coins]);
  return null;
}

// BB accepts file-preview intents only from components rendered inside the thread
// view, so this lives in a (render-nothing) thread header slot, not the overlay.
function FilePreviewLinks() {
  const { rpc } = usePrefs();
  const { threadId } = useBbContext();
  const active = useThemeActive();
  const navigate = useBbNavigate();
  useEffect(
    () =>
      active && threadId
        ? mountFilePreviewLinks(
            () => rpc.call("threadRoot", { threadId }),
            (target) => navigate.experimental_openFilePreview({ target, location: null }),
          )
        : undefined,
    [active, threadId, rpc, navigate],
  );
  return null;
}

export default definePluginApp((app) => {
  app.slots.experimental_threadHeaderAction({ id: "file-preview-links", title: "Pokecut file links", component: FilePreviewLinks });
  app.slots.experimental_appOverlay({ id: "pokecut-chat-layer", component: PokecutChatLayer });
  // The heading is rendered inside the section so it follows the live language.
  app.slots.settingsSection({ id: "chat", component: PokecutSettings });
  app.experimental_icons.register({ name: "pokecut-theme/SunMoon", component: ThemeModeIcon });
  app.experimental_sidebarFooter.register({
    kind: "disclosure",
    id: "theme-mode",
    label: t("themeMode"),
    icon: "pokecut-theme/SunMoon",
    component: ThemeModeSwitch,
  });
});
