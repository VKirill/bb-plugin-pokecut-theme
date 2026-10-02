// Diff paths: BB's diff file cards print a changed file's path as one string.
// This splits it into a quiet folder part and a strong file name so a long list
// of files in the same folder reads by name. Re-applied when React re-renders.
const CARD = '.overflow-clip.rounded-lg.border:has(button[aria-label^="Copy path for"])';
const PATH = `${CARD} .font-mono.font-medium`;
const DONE = "data-pk-path";

/** "a/b/c.txt" → ["a/b/", "c.txt"]; no folder → ["", name]. */
export function splitPath(path: string): [string, string] {
  const cut = path.lastIndexOf("/");
  return cut < 0 ? ["", path] : [path.slice(0, cut + 1), path.slice(cut + 1)];
}

/** The element that actually holds the path text: BB may wrap it (link/button). */
function leafOf(el: HTMLElement): HTMLElement {
  let leaf = el;
  while (leaf.childElementCount === 1 && !leaf.hasAttribute(DONE)) {
    const child = leaf.firstElementChild as HTMLElement;
    if (child.hasAttribute("data-pk-path-dir") || child.hasAttribute("data-pk-path-name")) break;
    leaf = child;
  }
  return leaf;
}

function apply() {
  for (const el of Array.from(document.querySelectorAll<HTMLElement>(PATH))) {
    const leaf = leafOf(el);
    if (leaf.hasAttribute(DONE) && leaf.getAttribute(DONE) === leaf.textContent) continue;
    if (leaf.childElementCount > 0 && !leaf.hasAttribute(DONE)) continue; // someone else's markup
    const text = leaf.textContent ?? "";
    const [dir, name] = splitPath(text);
    if (!dir) continue;
    const dirSpan = document.createElement("span");
    dirSpan.setAttribute("data-pk-path-dir", "");
    dirSpan.textContent = dir;
    const nameSpan = document.createElement("span");
    nameSpan.setAttribute("data-pk-path-name", "");
    nameSpan.textContent = name;
    leaf.replaceChildren(dirSpan, nameSpan);
    leaf.setAttribute(DONE, text);
  }
}

export function mountDiffPaths(): () => void {
  let frame = 0;
  const observer = new MutationObserver(() => {
    if (!frame) frame = requestAnimationFrame(() => ((frame = 0), apply()));
  });
  observer.observe(document.body, { subtree: true, childList: true, characterData: true });
  apply();
  return () => {
    observer.disconnect();
    cancelAnimationFrame(frame);
    document.querySelectorAll<HTMLElement>(`[${DONE}]`).forEach((el) => {
      el.textContent = el.getAttribute(DONE);
      el.removeAttribute(DONE);
    });
  };
}
