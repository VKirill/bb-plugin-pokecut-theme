// Message timestamps: a quiet relative time ("5 min ago") in a message's action
// strip, shown on hover/focus; the exact local date and direction in its title.
// BB's DOM has no message times, so they come from the plugin server
// (bb.sdk.threads.timeline) and are matched by data-timeline-row-id.
// Adapted from Chat Timestamps (https://github.com/pixexid/bb-plugin-chat-timestamps, MIT).
import type { MessageTime } from "./contract";
import { detectLocale, t } from "./i18n.ts";

const TIME_ATTR = "data-pk-time";
const ORIGINAL_TITLE_ATTR = "data-pk-time-title";
const REFRESH_MS = 15_000;

export type FetchTimes = (threadIds: string[], includeHistory: boolean) => Promise<MessageTime[]>;

export function formatRelative(timestamp: number, now = Date.now(), locale = detectLocale()): string {
  const seconds = Math.max(0, Math.floor((now - timestamp) / 1000));
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (seconds < 60) return t("timeJustNow", locale);
  if (minutes < 60) return t("timeMinutes", locale).replace("{n}", String(minutes));
  if (hours < 24) return t("timeHours", locale).replace("{n}", String(hours));
  return t("timeDays", locale).replace("{n}", String(days));
}

function formatExact(timestamp: number): string {
  try {
    return new Intl.DateTimeFormat(detectLocale() === "ru" ? "ru-RU" : undefined, {
      year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", second: "2-digit",
    }).format(new Date(timestamp));
  } catch {
    return new Date(timestamp).toISOString();
  }
}

/** The action strip under a message bubble, or the row header for other rows. */
function hostOf(row: HTMLElement): HTMLElement | null {
  const message = row.querySelector<HTMLElement>(".group\\/message");
  if (message) return message.querySelector<HTMLElement>(".relative.w-full > .absolute") ?? message;
  return row.querySelector<HTMLElement>(".group\\/timeline-row > button, .group\\/timeline-row > div");
}

function clearHost(host: HTMLElement) {
  const original = host.getAttribute(ORIGINAL_TITLE_ATTR);
  if (original !== null) {
    if (original) host.title = original;
    else host.removeAttribute("title");
    host.removeAttribute(ORIGINAL_TITLE_ATTR);
  }
  host.removeAttribute(TIME_ATTR);
}

function decorate(times: ReadonlyMap<string, MessageTime>) {
  const active = new Set<HTMLElement>();
  for (const row of Array.from(document.querySelectorAll<HTMLElement>("[data-timeline-row-id]"))) {
    const time = times.get(row.dataset.timelineRowId ?? "");
    if (!time) continue;
    const host = hostOf(row);
    if (!host) continue;
    if (!host.hasAttribute(ORIGINAL_TITLE_ATTR)) host.setAttribute(ORIGINAL_TITLE_ATTR, host.getAttribute("title") ?? "");
    const label = formatRelative(time.createdAt);
    if (host.getAttribute(TIME_ATTR) !== label) host.setAttribute(TIME_ATTR, label);
    const title = `${t(time.direction === "sent" ? "timeSent" : "timeReceived")} ${formatExact(time.createdAt)}`;
    if (host.title !== title) host.title = title;
    active.add(host);
  }
  for (const host of Array.from(document.querySelectorAll<HTMLElement>(`[${TIME_ATTR}]`))) {
    if (!active.has(host)) clearHost(host);
  }
}

export function mountMessageTimes(threadId: string, fetchTimes: FetchTimes): () => void {
  const times = new Map<string, MessageTime>();
  let stopped = false;
  let first = true;
  let inFlight = false;
  let frame = 0;

  const refresh = async () => {
    if (inFlight || stopped) return;
    inFlight = true;
    try {
      for (const time of await fetchTimes([threadId], first)) times.set(time.id, time);
      first = false;
    } catch {
      // Timestamps are decoration; a failed fetch just retries on the next tick.
    } finally {
      inFlight = false;
      if (!stopped) decorate(times);
    }
  };

  const observer = new MutationObserver(() => {
    if (!frame) frame = requestAnimationFrame(() => ((frame = 0), decorate(times)));
  });
  observer.observe(document.body, { childList: true, subtree: true });
  const timer = window.setInterval(() => void refresh(), REFRESH_MS);
  void refresh();

  return () => {
    stopped = true;
    observer.disconnect();
    cancelAnimationFrame(frame);
    window.clearInterval(timer);
    document.querySelectorAll<HTMLElement>(`[${TIME_ATTR}]`).forEach(clearHost);
  };
}
