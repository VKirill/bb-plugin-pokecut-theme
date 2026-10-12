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

test("desktop shell grid tokens live in both palettes and drive the inset", () => {
  const light = base.slice(base.indexOf(":root"), base.indexOf("\n.dark"));
  const dark = base.slice(base.indexOf("\n.dark"), base.indexOf("/* ── Shell"));
  for (const block of [light, dark]) {
    assert.match(block, /--pk-gap: 12px;/);
    assert.match(block, /--pk-gap-card: 8px;/);
    assert.match(block, /--pk-radius-panel: 20px;/);
    assert.match(block, /--pk-radius-window: 16px;/);
    assert.match(block, /--pk-radius-header: 14px;/);
    assert.match(block, /--pk-radius-card: 12px;/);
    assert.match(block, /--pk-radius-row: 10px;/);
  }
  assert.match(base, /\[data-sidebar="inset"\][\s\S]*margin: var\(--pk-gap\) var\(--pk-gap\) var\(--pk-gap\) 0/);
  assert.match(base, /\[data-sidebar="inset"\][\s\S]*border-radius: var\(--pk-radius-panel\)/);
  assert.match(base, /\[data-collapsible="offcanvas"\] ~ \[data-sidebar="inset"\][\s\S]*margin-left: var\(--pk-gap\)/);
});

test("desktop sidebar tucks under the content panel; collapsed drops the fill", () => {
  const desktop = base.slice(base.indexOf("@media (min-width: 768px)"), base.indexOf("@media (max-width: 767px)"));
  assert.match(desktop, /\[data-sidebar="panel"\]\[data-side="left"\][\s\S]*z-index: 0/);
  assert.match(desktop, /\[data-sidebar="inset"\][\s\S]*z-index: 1/);
  assert.match(
    desktop,
    /\[data-sidebar="panel"\]\[data-side="left"\] \[data-sidebar="sidebar"\][\s\S]*box-shadow: var\(--pk-radius-panel\) 0 0 0 var\(--pk-panel\)/,
  );
  assert.match(
    desktop,
    /\[data-collapsible="offcanvas"\] \[data-sidebar="panel"\]\[data-side="left"\] \[data-sidebar="sidebar"\][\s\S]*box-shadow: none/,
  );
});

test("phone shell rules keep literal radii", () => {
  const mobile = base.slice(base.lastIndexOf("@media (max-width: 767px)"));
  assert.match(mobile, /border-radius: 20px;/);
  assert.match(mobile, /border-radius: 10px;/);
  assert.match(mobile, /border-radius: 16px;/);
  assert.match(mobile, /border-radius: 18px;/);
});
