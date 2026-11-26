// Which threads ask for the user right now, for the sidebar-footer tray. Kept
// free of React and the SDK runtime so the rules run under `node --test`.

export type AttentionKind = "ask" | "error" | "done";

export interface AttentionThreadInput {
  id: string;
  isHidden: boolean;
  isArchived: boolean;
  isUnread: boolean;
  hasPendingInteraction: boolean;
  indicator: string;
  latestAttentionAt: number;
}

const ORDER: Record<AttentionKind, number> = { ask: 0, error: 1, done: 2 };

export function attentionKind(thread: AttentionThreadInput): AttentionKind | null {
  if (thread.isHidden || thread.isArchived) return null;
  if (thread.hasPendingInteraction || thread.indicator === "waiting-for-input") return "ask";
  if (thread.indicator === "unread-error" || thread.indicator === "queued-failed") return "error";
  if (thread.isUnread) return "done";
  return null;
}

/** Threads that need a look: questions first, then failures, then finished
 *  unread work; newest first inside each group. */
export function attentionThreads<T extends AttentionThreadInput>(
  threads: readonly T[],
): { thread: T; kind: AttentionKind }[] {
  return threads
    .flatMap((thread) => {
      const kind = attentionKind(thread);
      return kind ? [{ thread, kind }] : [];
    })
    .sort((a, b) => ORDER[a.kind] - ORDER[b.kind] || b.thread.latestAttentionAt - a.thread.latestAttentionAt);
}

// The footer icon renders outside any plugin slot, where SDK hooks have no
// context; the overlay (inside one) publishes the count here for it.
let count = 0;
const listeners = new Set<() => void>();

export function setAttentionCount(next: number): void {
  if (next === count) return;
  count = next;
  listeners.forEach((listener) => listener());
}

export function getAttentionCount(): number {
  return count;
}

export function subscribeAttentionCount(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
