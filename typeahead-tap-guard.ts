// Typeahead tap guard: BB applies a $ skill / @ mention on mousedown and the list
// unmounts at once, so on a phone the rest of the tap (the synthetic click) lands
// on whatever is under the finger now, the mic included. After a pick, this eats
// that one click when it falls outside the list.
const MENU = "[data-promptbox-typeahead-menu]";
const WINDOW_MS = 800;

export function isGhostClick(pickedAt: number, now: number, insideMenu: boolean): boolean {
  return pickedAt > 0 && !insideMenu && now - pickedAt <= WINDOW_MS;
}

export function mountTypeaheadTapGuard(): () => void {
  let pickedAt = 0;
  const inMenu = (event: Event) =>
    event.target instanceof Element && event.target.closest(MENU) !== null;
  const onMouseDown = (event: MouseEvent) => {
    pickedAt = inMenu(event) ? event.timeStamp : 0;
  };
  const onClick = (event: MouseEvent) => {
    if (isGhostClick(pickedAt, event.timeStamp, inMenu(event))) {
      event.preventDefault();
      event.stopPropagation();
    }
    pickedAt = 0;
  };
  document.addEventListener("mousedown", onMouseDown, true);
  document.addEventListener("click", onClick, true);
  return () => {
    document.removeEventListener("mousedown", onMouseDown, true);
    document.removeEventListener("click", onClick, true);
  };
}
