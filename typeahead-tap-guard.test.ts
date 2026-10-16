import { test } from "node:test";
import assert from "node:assert/strict";
import { isGhostClick } from "./typeahead-tap-guard.ts";

test("eats the click that follows a pick, outside the list", () => {
  assert.equal(isGhostClick(1000, 1200, false), true);
});

test("leaves clicks inside the list, late clicks and clicks without a pick", () => {
  assert.equal(isGhostClick(1000, 1200, true), false);
  assert.equal(isGhostClick(1000, 2000, false), false);
  assert.equal(isGhostClick(0, 200, false), false);
});
