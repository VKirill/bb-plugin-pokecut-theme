// "Needs attention" tray in the sidebar footer, like the system tray of a
// taskbar: a bell with a count; it opens upward into the threads that wait for
// the user (a question, a failure, finished unread work). A row opens its thread.
import { useEffect, useState, useSyncExternalStore, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { experimental_useSidebarThreadActions, experimental_useSidebarThreads, useBbNavigate } from "@get-bb/plugin-sdk/app";
import {
  attentionThreads,
  getAttentionCount,
  setAttentionCount,
  subscribeAttentionCount,
} from "./attention";
import { formatRelative } from "./message-times";
import { t, type I18nKey } from "./i18n";
import { useThemeActive } from "./theme-active";

/** Overlay that keeps the footer badge in step with the live thread list. */
export function AttentionCounter() {
  const { threads } = experimental_useSidebarThreads();
  const count = attentionThreads(threads).length;
  useEffect(() => setAttentionCount(count), [count]);
  return null;
}

export function AttentionIcon({ className }: { className?: string }) {
  const count = useSyncExternalStore(subscribeAttentionCount, getAttentionCount, () => 0);
  return (
    <span className={`pk-attn-icon ${className ?? ""}`} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9.5a6 6 0 0 1 12 0c0 4.6 1.8 6.2 2.5 6.9H3.5c.7-.7 2.5-2.3 2.5-6.9z" />
        <path d="M10 19.6a2.2 2.2 0 0 0 4 0" />
      </svg>
      {count > 0 ? <span className="pk-attn-badge">{count > 9 ? "9+" : count}</span> : null}
    </span>
  );
}

// The mobile sidebar is a drawer that stays open over the thread we navigate
// to; tapping its backdrop is the host's own way to close it.
function closeMobileDrawer(): void {
  document.querySelector<HTMLElement>('[data-sidebar-mobile-backdrop][data-state="open"]')?.click();
}

export function AttentionTray({ dismiss }: { dismiss(): void }) {
  const { threads, projects } = experimental_useSidebarThreads();
  const navigate = useBbNavigate();
  const actions = experimental_useSidebarThreadActions();
  const [marking, setMarking] = useState(false);
  const items = attentionThreads(threads);
  // Every unread thread, sub-threads included, so their dots clear in the tree too.
  const unread = threads.filter((thread) => thread.isUnread && !thread.isHidden && !thread.isArchived);

  const readAll = async () => {
    setMarking(true);
    try {
      await Promise.allSettled(unread.map((thread) => actions.setRead(thread.id, true)));
    } finally {
      setMarking(false);
    }
  };
  const projectNames = new Map(projects.map((project) => [project.id, project.name]));

  const open = (event: MouseEvent<HTMLAnchorElement>, threadId: string) => {
    // Let modified clicks open a new tab or window through the href.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate.toThread(threadId);
    dismiss();
    closeMobileDrawer();
  };

  return (
    <div className="pk-attn" data-bb-ru-skip="">
      <div className="pk-attn-head">
        <div className="pk-mode-title">{t("attention")}</div>
        {unread.length > 0 ? (
          <button type="button" className="pk-attn-readall" disabled={marking} onClick={readAll}>
            {t("attentionReadAll")}
          </button>
        ) : null}
      </div>
      {items.length === 0 ? (
        <div className="pk-attn-empty">{t("attentionEmpty")}</div>
      ) : (
        <ul className="pk-attn-list">
          {items.map(({ thread, kind }) => {
            const label = t(`attention_${kind}` as I18nKey);
            const meta = [label, projectNames.get(thread.projectId), formatRelative(thread.latestAttentionAt)]
              .filter(Boolean)
              .join(" · ");
            return (
              <li key={thread.id}>
                <a
                  className="pk-attn-row"
                  href={thread.href}
                  data-kind={kind}
                  aria-label={`${thread.displayTitle} — ${label}`}
                  onClick={(event) => open(event, thread.id)}
                >
                  <span className="pk-attn-dot" aria-hidden="true" />
                  <span className="pk-attn-text">
                    <span className="pk-attn-title">{thread.displayTitle}</span>
                    <span className="pk-attn-meta">{meta}</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

const SLOT_CLASS = "pk-attn-slot";

// Pinned bell: BB fills the footer strip in its stored order up to the width
// that fits, so a plugin item late in that order lands in the "…" menu. While
// the theme is on, a bell of our own sits first in the strip and toggles the
// same disclosure; app.css hides BB's copy of the item while ours is there.
export function PinnedAttentionBell({ toggle }: { toggle(): void }) {
  const active = useThemeActive();
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  useEffect(() => {
    if (!active) return;
    const own = document.createElement("li");
    own.className = SLOT_CLASS;
    const attach = () => {
      if (own.isConnected) return;
      const strip = document.querySelector('[data-sidebar="footer"] > ul[data-sidebar="menu"]');
      if (!strip) return;
      strip.prepend(own);
      setSlot(own);
    };
    attach();
    const observer = new MutationObserver(attach);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      own.remove();
      setSlot(null);
    };
  }, [active]);
  if (!slot) return null;
  return createPortal(
    <button type="button" data-sidebar="menu-button" className="pk-attn-footer-btn" aria-label={t("attention")} title={t("attention")} onClick={toggle}>
      <AttentionIcon />
    </button>,
    slot,
  );
}
