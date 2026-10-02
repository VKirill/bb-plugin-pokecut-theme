import { defineRpcContract } from "@get-bb/plugin-sdk";
import { z } from "zod";
import { CHIP_STYLES, LOADERS, TOGGLE_KEYS } from "./settings";

const toggles = Object.fromEntries(TOGGLE_KEYS.map((key) => [key, z.boolean()])) as Record<
  (typeof TOGGLE_KEYS)[number],
  z.ZodBoolean
>;

export const prefsSchema = z.object({
  loader: z.enum(LOADERS),
  toolChips: z.enum(CHIP_STYLES),
  ...toggles,
});

export const messageTimeSchema = z.object({
  id: z.string(),
  createdAt: z.number(),
  direction: z.enum(["sent", "received"]),
});

export type MessageTime = z.infer<typeof messageTimeSchema>;

export const rpcContract = defineRpcContract({
  getPrefs: { input: z.object({}), output: prefsSchema },
  setPrefs: { input: prefsSchema.partial(), output: prefsSchema },
  resetPrefs: { input: z.object({}), output: prefsSchema },
  messageTimes: {
    input: z.object({ threadIds: z.array(z.string().min(1).max(200)).min(1).max(8), includeHistory: z.boolean() }).strict(),
    output: z.object({ messages: z.array(messageTimeSchema) }).strict(),
  },
});

/** Realtime event published after preferences change. */
export const PREFS_CHANGED = "prefs-changed";
