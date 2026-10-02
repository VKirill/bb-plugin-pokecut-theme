// node --experimental-strip-types --test timeline-marks.test.ts
import assert from "node:assert/strict";
import test from "node:test";
import { isErrorLabel } from "./timeline-marks.ts";

test("error labels, not durations", () => {
  assert.equal(isErrorLabel("1 error"), true);
  assert.equal(isErrorLabel("2 errors"), true);
  assert.equal(isErrorLabel("error"), true);
  assert.equal(isErrorLabel("3 ошибки"), true);
  assert.equal(isErrorLabel("1m 50s"), false);
  assert.equal(isErrorLabel("4s"), false);
  assert.equal(isErrorLabel(null), false);
});
