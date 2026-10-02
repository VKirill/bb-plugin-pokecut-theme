// node --experimental-strip-types --test message-times.test.ts
import assert from "node:assert/strict";
import test from "node:test";
import { collectMessageTimes } from "./message-times-collect.ts";
import { formatRelative } from "./message-times.ts";

test("collects user and assistant messages, nested included", () => {
  const map = collectMessageTimes([
    { id: "a", kind: "conversation", role: "user", initiator: "user", createdAt: 1 },
    { id: "b", kind: "conversation", role: "assistant", createdAt: 2, children: [{ id: "c", kind: "conversation", role: "user", initiator: "agent", createdAt: 3 }] },
    { id: "d", kind: "command", createdAt: 4 },
  ]);
  assert.deepEqual([...map.keys()].sort(), ["a", "b", "c"]);
  assert.equal(map.get("a")?.direction, "sent");
  assert.equal(map.get("c")?.direction, "received");
});

test("relative time in both languages", () => {
  const now = 10_000_000;
  assert.equal(formatRelative(now - 20_000, now, "en"), "just now");
  assert.equal(formatRelative(now - 5 * 60_000, now, "en"), "5m ago");
  assert.equal(formatRelative(now - 5 * 60_000, now, "ru"), "5 мин назад");
  assert.equal(formatRelative(now - 3 * 3_600_000, now, "ru"), "3 ч назад");
  assert.equal(formatRelative(now - 2 * 86_400_000, now, "en"), "2d ago");
});
