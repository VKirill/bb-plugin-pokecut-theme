// node --experimental-strip-types --test diff-paths.test.ts
import assert from "node:assert/strict";
import test from "node:test";
import { splitPath } from "./diff-paths.ts";

test("splits folder and file name", () => {
  assert.deepEqual(splitPath(".agents/prototypes/x/README.md"), [".agents/prototypes/x/", "README.md"]);
  assert.deepEqual(splitPath("package.json"), ["", "package.json"]);
});
