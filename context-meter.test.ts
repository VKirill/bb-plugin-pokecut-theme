// node --experimental-strip-types --test context-meter.test.ts
import assert from "node:assert/strict";
import test from "node:test";
import { levelOf, parsePercent } from "./context-meter.ts";

test("reads the percentage from English and translated labels", () => {
  assert.equal(parsePercent("Context window 22% used"), 22);
  assert.equal(parsePercent("Контекстное окно: использовано 64,5 %"), 64.5);
  assert.equal(parsePercent("Context window"), null);
  assert.equal(parsePercent(null), null);
  assert.equal(parsePercent("140% used"), 100);
});

test("levels: quiet below 60, warning to 85, danger above", () => {
  assert.equal(levelOf(10), "low");
  assert.equal(levelOf(60), "mid");
  assert.equal(levelOf(85), "high");
});
