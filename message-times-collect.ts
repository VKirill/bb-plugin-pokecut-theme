// Pure part of the message timestamps: walk BB timeline rows (nested included)
// and keep user/assistant conversation rows with their createdAt.
// Adapted from Chat Timestamps (https://github.com/pixexid/bb-plugin-chat-timestamps, MIT).
import type { MessageTime } from "./contract";

export type TimelineNode = {
  id?: string;
  kind?: string;
  role?: string;
  initiator?: string;
  createdAt?: number;
  children?: TimelineNode[] | null;
  childRows?: TimelineNode[] | null;
};

export function collectMessageTimes(
  rows: readonly TimelineNode[] | undefined,
  into = new Map<string, MessageTime>(),
): Map<string, MessageTime> {
  for (const row of rows ?? []) {
    if (
      row.kind === "conversation" &&
      (row.role === "user" || row.role === "assistant") &&
      typeof row.id === "string" &&
      typeof row.createdAt === "number"
    ) {
      into.set(row.id, {
        id: row.id,
        createdAt: row.createdAt,
        direction: row.role === "user" && row.initiator === "user" ? "sent" : "received",
      });
    }
    collectMessageTimes(row.children ?? undefined, into);
    collectMessageTimes(row.childRows ?? undefined, into);
  }
  return into;
}
