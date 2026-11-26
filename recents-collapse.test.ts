import { test } from "node:test";
import assert from "node:assert/strict";
import { defaultCollapse } from "./recents-collapse.ts";

const thread = (id: string, parentThreadId: string | null = null, isHidden = false) => ({ id, parentThreadId, isHidden });

test("folds each parent once, skips hidden-only children, prunes gone ids", () => {
  const threads = [thread("a"), thread("a1", "a"), thread("b"), thread("b1", "b", true), thread("c"), thread("c1", "c")];
  assert.deepEqual(defaultCollapse(threads, ["c", "gone"]), { fold: ["a"], seen: ["c", "a"] });
  // Already seen: the user's choice (expanded) is left alone.
  assert.deepEqual(defaultCollapse(threads, ["a", "c"]), { fold: [], seen: ["a", "c"] });
});
