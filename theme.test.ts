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
  assert.match(base, /\[data-sidebar="inset"\][\s\S]*margin: 0 var\(--pk-gap\) var\(--pk-gap\) 0/);
  assert.match(base, /\[data-sidebar="inset"\][\s\S]*border-radius: var\(--pk-radius-panel\)/);
  assert.match(base, /\[data-collapsible="offcanvas"\] ~ \[data-sidebar="inset"\][\s\S]*margin-left: var\(--pk-gap\)/);
});

test("desktop sidebar targets the real group markup; inset height fits the parent", () => {
  const desktopBlocks = [...base.matchAll(/@media \(min-width: 768px\) \{[\s\S]*?\n\}/g)]
    .map((m) => m[0])
    .join("\n");
  assert.doesNotMatch(desktopBlocks, /\[data-sidebar="panel"\]\[data-side="left"\]/);
  assert.match(desktopBlocks, /\[data-side="left"\] > \[data-sidebar="panel"\][\s\S]*z-index: 0/);
  assert.match(desktopBlocks, /\[data-sidebar="inset"\][\s\S]*z-index: 1/);
  assert.match(
    desktopBlocks,
    /\[data-sidebar="inset"\]\s*\{[^}]*height: calc\(100% - var\(--pk-gap\)\)/,
  );
  assert.doesNotMatch(
    desktopBlocks,
    /\[data-sidebar="inset"\]\s*\{[^}]*--bb-shell-height/,
  );
});

test("desktop sidebar tucks with real geometry, shared bottom, no shadow copy", () => {
  const desktopBlocks = [...base.matchAll(/@media \(min-width: 768px\) \{[\s\S]*?\n\}/g)]
    .map((m) => m[0])
    .join("\n");
  assert.doesNotMatch(base, /box-shadow:\s*var\(--pk-radius-panel\)\s+0\s+0\s+0/);
  assert.match(
    desktopBlocks,
    /\[data-variant="sidebar"\]\[data-side="left"\] \[data-sidebar="sidebar"\]\s*\{[^}]*margin-bottom: var\(--pk-gap\)/,
  );
  assert.match(
    desktopBlocks,
    /\[data-variant="sidebar"\]\[data-side="left"\] \[data-sidebar="sidebar"\]\s*\{[^}]*width: calc\(100% \+ var\(--pk-radius-panel\)\)/,
  );
  assert.match(
    desktopBlocks,
    /\[data-variant="sidebar"\]\[data-side="left"\] \[data-sidebar="footer"\]\s*\{[^}]*padding: var\(--pk-gap-card\)/,
  );
  assert.match(
    desktopBlocks,
    /\[data-collapsible="offcanvas"\]\[data-side="left"\] \[data-sidebar="sidebar"\]\s*\{[^}]*width: 100%/,
  );
  assert.match(
    desktopBlocks,
    /\[data-side="left"\] > \[data-sidebar="panel"\]\s*\{[^}]*bottom: 0/,
  );
  assert.match(
    desktopBlocks,
    /\[data-side="left"\] > \[data-sidebar="panel"\]\s*\{[^}]*height: auto/,
  );
  assert.doesNotMatch(
    desktopBlocks,
    /\[data-side="left"\] > \[data-sidebar="panel"\]\s*\{[^}]*top:\s*0/,
  );
});

test("desktop sidebar is one light surface with even inner inset", () => {
  const desktopBlocks = [...base.matchAll(/@media \(min-width: 768px\) \{[\s\S]*?\n\}/g)]
    .map((m) => m[0])
    .join("\n");
  assert.match(
    desktopBlocks,
    /\[data-variant="sidebar"\]\[data-side="left"\] \[data-sidebar="content"\][\s\S]*?background-color: transparent/,
  );
  assert.match(
    desktopBlocks,
    /\[data-variant="sidebar"\]\[data-side="left"\] \[data-sidebar="header"\],\s*\[data-variant="sidebar"\]\[data-side="left"\] \[data-sidebar="content"\]\s*\{[^}]*padding-inline: var\(--pk-gap-card\)/,
  );
  assert.match(
    desktopBlocks,
    /\[data-variant="sidebar"\]\[data-side="left"\] \[data-sidebar="footer"\]\s*\{[^}]*padding: var\(--pk-gap-card\)/,
  );
  assert.match(
    desktopBlocks,
    /\[data-variant="sidebar"\]\[data-side="left"\] \[data-sidebar="sidebar"\] \.pf-tree\s*\{[^}]*padding-inline: 0/,
  );
});

test("desktop footer card sizes the usage tracker by content", () => {
  const desktopBlocks = [...base.matchAll(/@media \(min-width: 768px\) \{[\s\S]*?\n\}/g)]
    .map((m) => m[0])
    .join("\n");
  assert.match(
    desktopBlocks,
    /li\.usage-tracker-sidebar\s*\{[^}]*flex: 0 0 auto/,
  );
  assert.match(
    desktopBlocks,
    /li\.usage-tracker-sidebar\s*\{[^}]*width: auto/,
  );
  assert.match(
    base,
    /@media \(max-width: 767px\) \{[\s\S]*?li\.usage-tracker-sidebar \{[^}]*flex-shrink: 1/,
  );
});

test("plugin version is 0.5.12", () => {
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  assert.equal(pkg.version, "0.5.12");
});

test("phone shell rules keep literal radii", () => {
  const mobile = base.slice(base.lastIndexOf("@media (max-width: 767px)"));
  assert.match(mobile, /border-radius: 20px;/);
  assert.match(mobile, /border-radius: 10px;/);
  assert.match(mobile, /border-radius: 16px;/);
  assert.match(mobile, /border-radius: 18px;/);
});
