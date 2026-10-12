// node --experimental-strip-types --test settings.test.ts
import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import test from "node:test";
import { mountDocumentLocale } from "./i18n.ts";
import { DEFAULT_PREFS, normalizePrefs, rootAttributes } from "./settings.ts";

function withDocument(lang: string, run: () => void) {
  const attrs = new Map<string, string>();
  const root = {
    lang,
    setAttribute(name: string, value: string) {
      attrs.set(name, value);
    },
    getAttribute(name: string) {
      return attrs.get(name) ?? null;
    },
    removeAttribute(name: string) {
      attrs.delete(name);
    },
  };
  const previous = {
    document: globalThis.document,
    window: globalThis.window,
    localStorage: globalThis.localStorage,
  };
  const bus = new EventEmitter();
  globalThis.document = {
    documentElement: root,
    querySelector: () => null,
    querySelectorAll: () => [],
  } as unknown as Document;
  globalThis.window = {
    addEventListener: (type: string, listener: () => void) => bus.on(type, listener),
    removeEventListener: (type: string, listener: () => void) => bus.off(type, listener),
    dispatchEvent: (event: Event) => bus.emit(event.type),
  } as unknown as Window & typeof globalThis;
  globalThis.localStorage = {
    getItem: () => null,
    setItem() {},
    removeItem() {},
  } as unknown as Storage;
  try {
    run();
  } finally {
    globalThis.document = previous.document;
    globalThis.window = previous.window;
    globalThis.localStorage = previous.localStorage;
  }
}

test("defaults: pokecut loader, surface chips, nothing turned off", () => {
  assert.deepEqual(rootAttributes({}), { loader: "pokecut", chips: "surface", off: [] });
});

test("turned-off toggles become CSS tokens; unknown values fall back", () => {
  assert.deepEqual(
    rootAttributes({ loader: "orbit", toolChips: "plain", shimmer: false, streamingCaret: false, promptBar: true }),
    { loader: "orbit", chips: "plain", off: ["shimmer", "caret"] },
  );
  assert.deepEqual(rootAttributes({ loader: "surfer", toolChips: 3, workRows: "no" }), { loader: "pokecut", chips: "surface", off: [] });
});

test("normalizePrefs keeps only known keys with valid values", () => {
  assert.deepEqual(normalizePrefs(null), DEFAULT_PREFS);
  const prefs = normalizePrefs({ treeLines: false, evil: "<script>", loader: "coins" });
  assert.equal(prefs.treeLines, false);
  assert.equal(prefs.loader, "coins");
  assert.equal("evil" in prefs, false);
});

test("mountDocumentLocale writes data-pk-lang from detectLocale and clears it", () => {
  withDocument("ru-RU", () => {
    const stop = mountDocumentLocale();
    assert.equal(document.documentElement.getAttribute("data-pk-lang"), "ru");
    stop();
    assert.equal(document.documentElement.getAttribute("data-pk-lang"), null);
  });
  withDocument("en", () => {
    const stop = mountDocumentLocale();
    assert.equal(document.documentElement.getAttribute("data-pk-lang"), "en");
    stop();
  });
});
