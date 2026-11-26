// Phone start screen: a thread with sub-threads starts collapsed in Recents.
// BB keeps the collapsed ids in localStorage behind a `storage`-event
// subscription (as with the theme mode), so writing the key and dispatching
// the event lets BB's own list fold the rows. Each parent is folded once, the
// first time we see it with children, so a row the user opens stays open.

const BB_KEY = "bb.mobileRecents.collapsedThreads";
const SEEN_KEY = "pk.mobileRecents.defaultCollapsed";

export interface CollapseThreadInput {
  id: string;
  parentThreadId: string | null;
  isHidden: boolean;
}

/** Parents to fold now, and the seen list to keep (pruned to live threads). */
export function defaultCollapse(
  threads: readonly CollapseThreadInput[],
  seen: readonly string[],
): { fold: string[]; seen: string[] } {
  const ids = new Set(threads.map((thread) => thread.id));
  const parents = new Set(
    threads.flatMap((thread) =>
      !thread.isHidden && thread.parentThreadId !== null && ids.has(thread.parentThreadId) ? [thread.parentThreadId] : [],
    ),
  );
  const seenSet = new Set(seen);
  const fold = [...parents].filter((id) => !seenSet.has(id));
  return { fold, seen: [...seen.filter((id) => ids.has(id)), ...fold] };
}

function readList(key: string): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function applyDefaultCollapse(threads: readonly CollapseThreadInput[]): void {
  // An empty list is BB still loading; pruning against it would forget everything.
  if (threads.length === 0) return;
  const seen = readList(SEEN_KEY);
  const next = defaultCollapse(threads, seen);
  if (next.seen.length !== seen.length || next.fold.length > 0) localStorage.setItem(SEEN_KEY, JSON.stringify(next.seen));
  if (next.fold.length === 0) return;
  const oldValue = localStorage.getItem(BB_KEY);
  const collapsed = readList(BB_KEY);
  const newValue = JSON.stringify([...collapsed, ...next.fold.filter((id) => !collapsed.includes(id))]);
  localStorage.setItem(BB_KEY, newValue);
  window.dispatchEvent(new StorageEvent("storage", { key: BB_KEY, oldValue, newValue, storageArea: localStorage }));
}
