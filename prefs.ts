// Shared hook: the chat-layer preferences from the plugin server.
import { useCallback, useEffect, useState } from "react";
import { useRealtime, useRealtimeConnectionState, useRpc } from "@get-bb/plugin-sdk/app";
import { PREFS_CHANGED, rpcContract } from "./contract";
import type { Prefs } from "./settings";

/** Current preferences, refreshed on reconnect and whenever the server publishes a change. */
export function usePrefs() {
  const rpc = useRpc<typeof rpcContract>();
  const connection = useRealtimeConnectionState();
  const [prefs, setPrefs] = useState<Prefs | null>(null);
  const [error, setError] = useState(false);
  const refresh = useCallback(async () => {
    try {
      setPrefs(await rpc.call("getPrefs", {}));
      setError(false);
    } catch {
      setError(true);
    }
  }, [rpc]);
  useEffect(() => {
    if (connection === "connected") void refresh();
  }, [connection, refresh]);
  useRealtime(PREFS_CHANGED, () => void refresh());
  return { prefs, setPrefs, error, rpc };
}
