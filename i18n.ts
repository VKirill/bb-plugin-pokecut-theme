// UI strings follow BB's interface language (`<html lang>`); English by default.
// The Russian dictionary must carry every English key (checked by the type below).

const en = {
  sectionTitle: "Chat appearance",
  sectionDescription:
    "Pokecut styling for the chat: composer, messages, work rows and loaders. Applies while the Pokecut theme is selected.",
  themeInactive: "The Pokecut theme is not selected, so these options have no visible effect. Turn it on in Settings → Appearance.",
  loading: "Loading…",
  saveFailed: "Couldn't save the change. Try again.",
  loadFailed: "Couldn't load the chat settings.",
  reset: "Reset to defaults",
  language: "Language",
  languageAuto: "Auto",
  languageHint: "Auto follows BB's interface language, including the Russifier plugin.",
  groupComposer: "Composer",
  groupMessages: "Messages",
  groupWork: "Work rows and loading",
  loader: "Loading animation",
  loaderHint: "Icon on a pending work row.",
  loader_drive: "Pixel sweep",
  loader_dots: "Round pixels",
  loader_orbit: "Orbit",
  loader_coins: "Coins",
  loader_bb: "BB's own icon",
  toolChips: "Tool call rows",
  toolChipsHint: "How a single tool call row is drawn.",
  toolChips_surface: "Filled card",
  toolChips_outline: "Outline only",
  toolChips_plain: "Plain",
  promptBar: "Prompt bar",
  promptBarHint: "Raised composer, 28px controls, compact phone layout, chip row for project, machine and access.",
  minimizeWhileRunning: "Minimize prompt while generating",
  minimizeWhileRunningHint: "While a run is live and the box is empty, it shrinks to one line; typing grows it back.",
  mergedBanners: "Merged banner stack",
  mergedBannersHint: "Cards above the composer join into one card with hairline dividers.",
  userBubbles: "User message bubbles",
  userBubblesHint: "Your messages become soft filled bubbles.",
  codeChips: "Code chips",
  codeChipsHint: "Inline code as hairline chips, code blocks as cards.",
  messageActions: "Message actions",
  messageActionsHint: "Hover chips on message buttons and one tooltip that glides along a row of buttons.",
  selectionPill: "Selection pill",
  selectionPillHint: "Pill style for “Add to chat / Reply in side chat” on selected text.",
  streamingCaret: "Streaming caret",
  streamingCaretHint: "A caret at the end of the reply while it is being written.",
  approvalCard: "Approval cards",
  approvalCardHint: "Permission requests and agent questions as raised cards with pill buttons.",
  workRows: "Compact work rows",
  workRowsHint: "Pill row headers, monospace durations, smoother expand.",
  treeLines: "Tree lines",
  treeLinesHint: "Rows of an expanded work group are joined by a tree.",
  shimmer: "Label shimmer",
  shimmerHint: "Brighter, faster shimmer on “Thinking…” and “Running”.",
  unreadMarker: "Unread marker",
  unreadMarkerHint: "NEW after the first unread row's label instead of a separator line.",
};

export type I18nKey = keyof typeof en;

const ru: Record<I18nKey, string> = {
  sectionTitle: "Оформление чата",
  sectionDescription:
    "Стиль Pokecut для чата: поле ввода, сообщения, строки работы и индикаторы загрузки. Действует, пока выбрана тема Pokecut.",
  themeInactive: "Тема Pokecut не выбрана, поэтому эти параметры ничего не меняют. Включите её в «Настройки → Оформление».",
  loading: "Загрузка…",
  saveFailed: "Не удалось сохранить изменение. Попробуйте ещё раз.",
  loadFailed: "Не удалось загрузить настройки чата.",
  reset: "Сбросить по умолчанию",
  language: "Язык",
  languageAuto: "Авто",
  languageHint: "«Авто» следует языку интерфейса BB, включая плагин «Русификатор».",
  groupComposer: "Поле ввода",
  groupMessages: "Сообщения",
  groupWork: "Строки работы и загрузка",
  loader: "Анимация загрузки",
  loaderHint: "Значок у строки, которая ещё выполняется.",
  loader_drive: "Пиксельная волна",
  loader_dots: "Круглые пиксели",
  loader_orbit: "Орбита",
  loader_coins: "Монеты",
  loader_bb: "Значок BB",
  toolChips: "Строки вызовов инструментов",
  toolChipsHint: "Как рисуется отдельный вызов инструмента.",
  toolChips_surface: "Карточка с заливкой",
  toolChips_outline: "Только рамка",
  toolChips_plain: "Без оформления",
  promptBar: "Оформление поля ввода",
  promptBarHint: "Приподнятое поле, кнопки 28px, компактная раскладка на телефоне, чипы проекта, машины и доступа.",
  minimizeWhileRunning: "Сворачивать поле во время ответа",
  minimizeWhileRunningHint: "Пока идёт ответ и поле пустое, оно сжимается в одну строку; при наборе текста разворачивается.",
  mergedBanners: "Объединённые плашки",
  mergedBannersHint: "Карточки над полем ввода собираются в одну с тонкими разделителями.",
  userBubbles: "Пузыри ваших сообщений",
  userBubblesHint: "Ваши сообщения — мягкие залитые пузыри.",
  codeChips: "Код чипами",
  codeChipsHint: "Встроенный код — чипы с тонкой рамкой, блоки кода — карточки.",
  messageActions: "Кнопки сообщений",
  messageActionsHint: "Подложка при наведении и одна подсказка, которая скользит вдоль ряда кнопок.",
  selectionPill: "Плашка выделения",
  selectionPillHint: "«Добавить в чат / Ответить в боковом чате» на выделенном тексте — в виде таблетки.",
  streamingCaret: "Курсор печати",
  streamingCaretHint: "Курсор в конце ответа, пока он пишется.",
  approvalCard: "Карточки подтверждений",
  approvalCardHint: "Запросы разрешений и вопросы агента — приподнятые карточки с кнопками-таблетками.",
  workRows: "Компактные строки работы",
  workRowsHint: "Заголовки-таблетки, моноширинное время, плавное раскрытие.",
  treeLines: "Линии дерева",
  treeLinesHint: "Строки раскрытой группы работы соединены деревом.",
  shimmer: "Мерцание подписи",
  shimmerHint: "Яркое быстрое мерцание у «Думаю…» и «Выполняется».",
  unreadMarker: "Метка непрочитанного",
  unreadMarkerHint: "NEW после подписи первой непрочитанной строки вместо разделительной линии.",
};

export type Locale = "en" | "ru";
export type UiLocale = Locale | "auto";

const STORAGE_KEY = "pokecut-theme:locale";
const LANGUAGE_EVENT = "pokecut-theme:locale";
const RUSSIFIER_KEY = "bb-plugin-ru:enabled";

function storedLocale(): Locale | null {
  try {
    const value = globalThis.localStorage?.getItem(STORAGE_KEY);
    return value === "en" || value === "ru" ? value : null;
  } catch {
    return null;
  }
}

/** The Russifier plugin translates BB's English UI in place (a content script, no
    marker of its own) and leaves <html lang> alone. Its work is visible on BB's own
    chrome: the history and sidebar buttons' accessible names turn Cyrillic. */
function russifierActive(): boolean {
  try {
    if (globalThis.localStorage?.getItem(RUSSIFIER_KEY) === "off") return false;
  } catch {}
  const labels = globalThis.document?.querySelectorAll('[data-sidebar="sidebar"] button[aria-label], header button[aria-label]') ?? [];
  for (const button of Array.from(labels).slice(0, 12)) {
    if (/[А-Яа-яЁё]/.test(button.getAttribute("aria-label") ?? "")) return true;
  }
  return false;
}

export function detectLocale(): Locale {
  const stored = storedLocale();
  if (stored) return stored;
  const lang = globalThis.document?.documentElement?.lang ?? "";
  if (lang.toLowerCase().startsWith("ru")) return "ru";
  return russifierActive() ? "ru" : "en";
}

export function storedPreference(): UiLocale {
  return storedLocale() ?? "auto";
}

export function setLocale(locale: UiLocale): void {
  try {
    if (locale === "auto") localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, locale);
  } catch {}
  window.dispatchEvent(new Event(LANGUAGE_EVENT));
}

export function subscribeLocale(listener: () => void): () => void {
  window.addEventListener("storage", listener);
  window.addEventListener(LANGUAGE_EVENT, listener);
  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(LANGUAGE_EVENT, listener);
  };
}

export function t(key: I18nKey, locale: Locale = detectLocale()): string {
  return (locale === "ru" ? ru : en)[key];
}
