// bb-plugin-pokecut-theme — the theme itself lives in themes/pokecut.css
// (contributed through `bb.themes`, built from src/theme/). The server keeps the
// chat-layer preferences in plugin storage and serves them to the app overlay
// and the bilingual settings section over RPC.
import type { BbPluginApi } from "@get-bb/plugin-sdk";
import { PREFS_CHANGED, rpcContract } from "./contract";
import { normalizePrefs, type Prefs } from "./settings";

const PREFS_KEY = "prefs";

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
  });
}
