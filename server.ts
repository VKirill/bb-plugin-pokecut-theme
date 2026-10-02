// bb-plugin-pokecut-theme — the theme itself lives in themes/pokecut.css
// (contributed through `bb.themes`, built from src/theme/). The server keeps the
// chat-layer preferences in plugin storage and serves them to the app overlay
// and the bilingual settings section over RPC, plus message timestamps.
import type { BbPluginApi } from "@get-bb/plugin-sdk";
import { PREFS_CHANGED, rpcContract, type MessageTime } from "./contract";
import { collectMessageTimes, type TimelineNode } from "./message-times-collect";
import { normalizePrefs, type Prefs } from "./settings";

const PREFS_KEY = "prefs";
const MAX_HISTORY_PAGES = 12;

export default async function plugin(bb: BbPluginApi) {
  const read = async (): Promise<Prefs> => normalizePrefs(await bb.storage.kv.get<Record<string, unknown>>(PREFS_KEY));
  const write = async (prefs: Prefs) => {
    await bb.storage.kv.set(PREFS_KEY, prefs);
    bb.realtime.publish(PREFS_CHANGED, { global: true });
    return prefs;
  };

  bb.rpc.register(rpcContract, {
    getPrefs: () => read(),
    setPrefs: async (patch) => write(normalizePrefs({ ...(await read()), ...patch })),
    resetPrefs: () => write(normalizePrefs({})),
    // Message timestamps for the visible threads; BB's timeline rows carry
    // createdAt, the DOM does not. First call per thread walks older pages.
    messageTimes: async ({ threadIds, includeHistory }) => {
      const messages = new Map<string, MessageTime>();
      for (const threadId of new Set(threadIds)) {
        let beforeAnchorSeq: string | undefined;
        let beforeAnchorId: string | undefined;
        for (let page = 0; page < (includeHistory ? MAX_HISTORY_PAGES : 1); page += 1) {
          const timeline = await bb.sdk.threads.timeline({
            threadId,
            includeNestedRows: "true",
            ...(beforeAnchorSeq && beforeAnchorId ? { beforeAnchorSeq, beforeAnchorId } : {}),
          });
          collectMessageTimes(timeline.rows as TimelineNode[], messages);
          const older = timeline.timelinePage.olderCursor;
          if (!timeline.timelinePage.hasOlderRows || !older) break;
          beforeAnchorSeq = String(older.anchorSeq);
          beforeAnchorId = older.anchorId;
        }
      }
      return { messages: Array.from(messages.values()) };
    },
  });
}
