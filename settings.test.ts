// node --experimental-strip-types --test settings.test.ts
import assert from "node:assert/strict";
import test from "node:test";
import { DEFAULT_PREFS, normalizePrefs, rootAttributes } from "./settings.ts";

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
