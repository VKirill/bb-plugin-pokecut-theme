// Context meter: BB shows context use as a ring button at the end of the
// composer's context row ("Context window 22% used"). The theme replaces it with
// a fill line along the composer's bottom edge; hovering it shows the number.
// The percentage only exists in the ring's accessible name, so this reads it and
// hands it to CSS on the footer. The ring itself stays (invisible, stretched
// over the line) so BB's own detail popover still opens from it.

const RING = '[data-follow-up-composer-footer] button.rounded-full[aria-haspopup="dialog"]';
const ATTRS = ["data-pk-ctx", "data-pk-ctx-level"];

/** "Context window 22% used" (or a translated label) → 22; null when there is no number. */
export function parsePercent(label: string | null): number | null {
  const match = label?.match(/(\d+(?:[.,]\d+)?)\s*%/);
  if (!match) return null;
  const value = Number(match[1].replace(",", "."));
  return Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : null;
}

export function levelOf(percent: number): "low" | "mid" | "high" {
  return percent >= 85 ? "high" : percent >= 60 ? "mid" : "low";
}

function sync() {
  for (const ring of Array.from(document.querySelectorAll<HTMLElement>(RING))) {
    const footer = ring.closest<HTMLElement>("[data-follow-up-composer-footer]");
    const percent = parsePercent(ring.getAttribute("aria-label"));
    if (!footer) continue;
    ring.setAttribute("data-pk-ctx-ring", "");
    // Native hover hint on the invisible strip: the ring's own label.
    const label = ring.getAttribute("aria-label");
    if (label && ring.getAttribute("title") !== label) ring.setAttribute("title", label);
    if (percent === null) {
      ATTRS.forEach((name) => footer.removeAttribute(name));
      continue;
    }
    const rounded = String(Math.round(percent));
    if (footer.getAttribute("data-pk-ctx") === rounded) continue;
    footer.setAttribute("data-pk-ctx", rounded);
    footer.style.setProperty("--pk-ctx", `${percent}%`);
    footer.setAttribute("data-pk-ctx-level", levelOf(percent));
  }
}

export function mountContextMeter(): () => void {
  let frame = 0;
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(() => ((frame = 0), sync()));
  };
  const observer = new MutationObserver(schedule);
  observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["aria-label"] });
  sync();
  return () => {
    observer.disconnect();
    cancelAnimationFrame(frame);
    document.querySelectorAll("[data-pk-ctx-ring]").forEach((el) => {
      el.removeAttribute("data-pk-ctx-ring");
      el.removeAttribute("title");
    });
    document.querySelectorAll<HTMLElement>("[data-pk-ctx]").forEach((el) => {
      ATTRS.forEach((name) => el.removeAttribute(name));
      el.style.removeProperty("--pk-ctx");
    });
  };
}
