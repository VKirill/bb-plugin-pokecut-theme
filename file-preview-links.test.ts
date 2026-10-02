import { test } from "node:test";
import assert from "node:assert/strict";
import { fullPathFromTitle, targetFor } from "./file-preview-links.ts";

const root = { environmentId: "env_1", hostId: "host_1", path: "/Users/me/proj" };

test("full path from a work-row title", () => {
  assert.equal(fullPathFromTitle("Created /Users/me/proj/docs/SUMMARY.md +40", "SUMMARY.md"), "/Users/me/proj/docs/SUMMARY.md");
  assert.equal(fullPathFromTitle("Edited src/a b/file.ts +2 -1", "file.ts"), "src/a b/file.ts");
  assert.equal(fullPathFromTitle("Moved old/x.md -> new/y.md", "y.md"), "new/y.md");
  assert.equal(fullPathFromTitle("Created", "x.md"), null);
});

test("target inside the thread folder is workspace-relative", () => {
  assert.deepEqual(targetFor("/Users/me/proj/docs/a.md", root), { kind: "workspace", environmentId: "env_1", path: "docs/a.md" });
  assert.deepEqual(targetFor("docs/a.md", root), { kind: "workspace", environmentId: "env_1", path: "docs/a.md" });
  assert.deepEqual(targetFor("/tmp/a.md", root), { kind: "host", hostId: "host_1", path: "/tmp/a.md" });
});
