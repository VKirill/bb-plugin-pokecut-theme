import { test } from "node:test";
import assert from "node:assert/strict";
import { attentionThreads, type AttentionThreadInput } from "./attention.ts";

const base: AttentionThreadInput = {
  id: "",
  parentThreadId: null,
  isHidden: false,
  isArchived: false,
  isUnread: false,
  hasPendingInteraction: false,
  indicator: "none",
  latestAttentionAt: 0,
};

test("root chats only: questions, then failures, then finished unread work, newest first", () => {
  const threads = [
    { ...base, id: "done-old", isUnread: true, indicator: "unread-success", latestAttentionAt: 1 },
    { ...base, id: "quiet", latestAttentionAt: 9 },
    { ...base, id: "done-new", isUnread: true, latestAttentionAt: 5 },
    { ...base, id: "error", isUnread: true, indicator: "unread-error", latestAttentionAt: 2 },
    { ...base, id: "ask", hasPendingInteraction: true, latestAttentionAt: 0 },
    { ...base, id: "hidden", isHidden: true, isUnread: true },
    { ...base, id: "archived", isArchived: true, hasPendingInteraction: true },
    { ...base, id: "sub", parentThreadId: "ask", isUnread: true, latestAttentionAt: 99 },
  ];
  assert.deepEqual(
    attentionThreads(threads).map(({ thread, kind }) => `${kind}:${thread.id}`),
    ["ask:ask", "error:error", "done:done-new", "done:done-old"],
  );
});
