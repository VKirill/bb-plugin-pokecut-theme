// node --experimental-strip-types --test theme.test.ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(join(root, "themes/pokecut.css"), "utf8");
const base = readFileSync(join(root, "src/theme/base.css"), "utf8");
const chat = readFileSync(join(root, "src/theme/chat.css"), "utf8");
const integrations = readFileSync(join(root, "src/theme/integrations.css"), "utf8");

test("generated theme is base + chat and fits BB's theme limit", () => {
  assert.ok(css.includes(base.trimEnd()));
  assert.ok(css.includes(chat.trimEnd()));
  assert.ok(css.includes(integrations.trimEnd()));
  assert.ok(Buffer.byteLength(css) < 256_000);
});

test("palette blocks stay first so BB tooling reads them", () => {
  const body = css.replace(/\/\*[\s\S]*?\*\//g, "").trimStart();
  assert.match(body, /^:root,\s*\.light\s*\{/);
  assert.match(css, /\n\.dark\s*\{/);
  assert.match(css, /--pk-theme: pokecut;/);
});

test("no Beautiful Chat names leak, so both plugins can run side by side", () => {
  assert.doesNotMatch(css, /bui-|data-bui/);
});

test("phone context row: chips for project/machine/access, plain icon controls", () => {
  assert.match(base, /\[data-option-display\][\s\S]*button\[data-promptbox-shrinkable-control\]/);
  assert.doesNotMatch(base, /\[data-follow-up-composer-footer\] :is\(button\[aria-haspopup\]/);
});
