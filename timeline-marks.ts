// Timeline marks: BB prints "1 error" / "2 errors" as a small mono label next to
// a row's label or duration, with no attribute of its own, so CSS cannot find it. This marks those labels (and the
// rows that carry them) so the theme can draw a red chip and a red status dot.
const LABEL = '[data-timeline-row-list] [data-timeline-row-id] span:is(.tabular-nums, .font-mono)';
const ERROR_TEXT = /\berrors?\b|ошиб/i;

export function isErrorLabel(text: string | null): boolean {
  return ERROR_TEXT.test(text ?? "");
}

function sync() {
  for (const span of Array.from(document.querySelectorAll<HTMLElement>(LABEL))) {
    const error = isErrorLabel(span.textContent);
    if (error !== span.hasAttribute("data-pk-err")) span.toggleAttribute("data-pk-err", error);
    const row = span.closest<HTMLElement>("[data-timeline-row-id]");
    if (row && error && !row.hasAttribute("data-pk-err-row")) row.setAttribute("data-pk-err-row", "");
  }
}

export function mountTimelineMarks(): () => void {
  let frame = 0;
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(() => ((frame = 0), sync()));
  };
  const observer = new MutationObserver(schedule);
  observer.observe(document.body, { subtree: true, childList: true, characterData: true });
  sync();
  return () => {
    observer.disconnect();
    cancelAnimationFrame(frame);
    document.querySelectorAll("[data-pk-err]").forEach((el) => el.removeAttribute("data-pk-err"));
    document.querySelectorAll("[data-pk-err-row]").forEach((el) => el.removeAttribute("data-pk-err-row"));
  };
}
