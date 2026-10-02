// File preview links: in a "Created/Edited <file>" work row BB opens the file's
// diff in the right panel, which stays empty outside git. This sends a plain
// click to BB's shared file preview instead (the right-panel viewer). Modifier
// clicks keep BB's own behavior, so the diff is still one Alt-click away.

/** Live file target as accepted by BB's experimental_openFilePreview. */
export type FileTarget =
  | { kind: "workspace"; environmentId: string; path: string }
  | { kind: "host"; hostId: string; path: string };

export type ThreadRoot = { environmentId: string; hostId: string; path: string };

// The file segment of a work-row title: an interactive span with the file accent.
const FILE_SEGMENT = 'span[role="link"].text-timeline-accent';

/**
 * Pull the full changed path out of the row title. BB renders the title's plain
 * text as `<verb> <full path> <stats>` and the segment shows the file name only.
 * Moves read `a -> b`; the destination is the file that exists now.
 */
export function fullPathFromTitle(title: string, shown: string): string | null {
  if (!shown) return null;
  const arrow = title.lastIndexOf(" -> ");
  const from = arrow >= 0 ? arrow + 4 : title.indexOf(" ") + 1;
  const end = title.indexOf(shown, from);
  if (from <= 0 || end < 0) return null;
  const path = title.slice(from, end + shown.length).trim();
  return path || null;
}

/** Workspace-relative target when the file is inside the thread's folder. */
export function targetFor(path: string, root: ThreadRoot): FileTarget {
  const base = root.path.replace(/\/+$/, "");
  if (!path.startsWith("/")) return { kind: "workspace", environmentId: root.environmentId, path };
  if (path.startsWith(base + "/")) {
    return { kind: "workspace", environmentId: root.environmentId, path: path.slice(base.length + 1) };
  }
  return { kind: "host", hostId: root.hostId, path };
}

export function mountFilePreviewLinks(
  getRoot: () => Promise<ThreadRoot | null>,
  open: (target: FileTarget) => boolean,
): () => void {
  let root: Promise<ThreadRoot | null> | null = null;
  const onClick = (event: MouseEvent) => {
    if (event.button !== 0 || event.altKey || event.metaKey || event.ctrlKey || event.shiftKey) return;
    const segment = (event.target as Element | null)?.closest?.(FILE_SEGMENT);
    const title = segment?.closest("[title]")?.getAttribute("title");
    const path = title ? fullPathFromTitle(title, segment!.textContent?.trim() ?? "") : null;
    if (!path) return;
    event.preventDefault();
    event.stopPropagation();
    (root ??= getRoot().catch(() => null)).then((resolved) => {
      if (!resolved || !open(targetFor(path, resolved))) {
        root = null;
        segment!.dispatchEvent(new MouseEvent("click", { bubbles: true, altKey: true }));
      }
    });
  };
  document.addEventListener("click", onClick, true);
  return () => document.removeEventListener("click", onClick, true);
}
