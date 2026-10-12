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
    desktopBlocks,
    /li\.usage-tracker-sidebar\s*\{[^}]*container-type: normal/,
  );
  assert.match(
    base,
    /@media \(max-width: 767px\) \{[\s\S]*?li\.usage-tracker-sidebar \{[^}]*flex-shrink: 1/,
  );
});

test("desktop content column insets from the app-nav-rail", () => {
  const desktopBlocks = [...base.matchAll(/@media \(min-width: 768px\) \{[\s\S]*?\n\}/g)]
    .map((m) => m[0])
    .join("\n");
  assert.match(
    desktopBlocks,
    /:has\(\[data-testid="app-nav-rail"\]\)[\s\S]*:not\(\[data-testid="app-sidebar-body"\] \*\)[\s\S]*padding-left: calc\(var\(--pk-gap\) \+ var\(--pk-gap-card\) - 1px\)/,
  );
  assert.match(
    desktopBlocks,
    /\[data-collapsible="rail"\] ~ \[data-sidebar="inset"\][\s\S]*margin-left: calc\(var\(--pk-gap\) \+ var\(--pk-gap\) - 1px\)/,
  );
  assert.match(
    desktopBlocks,
    /\[data-sidebar="sidebar"\] \.pf-tree \.pf-folder > \.pf-children\s*\{[^}]*padding-left: calc\(var\(--pf-indent, 8px\) - 1px\)/,
  );
  assert.match(
    desktopBlocks,
    /\[data-sidebar="sidebar"\] \.pf-project\s*\{[^}]*padding: 4px var\(--pk-gap-card\)/,
  );
});

test("desktop top reserve row matches the card inset", () => {
  const desktopBlocks = [...base.matchAll(/@media \(min-width: 768px\) \{[\s\S]*?\n\}/g)]
    .map((m) => m[0])
    .join("\n");
  assert.match(
    desktopBlocks,
    /:has\(\[data-testid="app-nav-rail"\]\)\s*\[data-testid="app-sidebar-top-reserve-row"\]\s*\{[^}]*padding-left: calc\(104px \+ var\(--pk-gap-card\)\)/,
  );
  assert.match(
    desktopBlocks,
    /:has\(\[data-testid="app-nav-rail"\]\)\s*\[data-testid="app-sidebar-top-reserve-row"\]\s*\{[^}]*padding-right: var\(--pk-gap-card\)/,
  );
});

test("desktop top row pins a compact New project button after New thread", () => {
  const desktopBlocks = [...base.matchAll(/@media \(min-width: 768px\) \{[\s\S]*?\n\}/g)]
    .map((m) => m[0])
    .join("\n");
  const mobile = base.slice(base.lastIndexOf("@media (max-width: 767px)"));
  assert.match(
    desktopBlocks,
    /\.pf-tree > button:first-child\s*\{[^}]*position: absolute/,
  );
  assert.match(
    desktopBlocks,
    /\.pf-tree > button:first-child\s*\{[^}]*position-anchor: --pk-rail/,
  );
  assert.match(
    desktopBlocks,
    /\[data-testid="app-nav-rail"\]\s*\{[^}]*anchor-name: --pk-rail/,
  );
  assert.match(
    desktopBlocks,
    /\.pf-tree > button:first-child::after\s*\{[^}]*content: "Project"/,
  );
  assert.match(
    desktopBlocks,
    /html\[data-pk-lang="ru"\][\s\S]*?content: "Проект"/,
  );
  assert.match(
    desktopBlocks,
    /\[data-sidebar-navigation-item="__bb__\/new-thread"\] > button[\s\S]*width: auto/,
  );
  assert.match(
    desktopBlocks,
    /\[data-sidebar-navigation-item="__bb__\/new-thread"\] > button[\s\S]*margin-left: auto/,
  );
  assert.doesNotMatch(
    desktopBlocks,
    /\[data-sidebar="content"\][^\{]*\{[^}]*overflow:\s*visible/,
  );
  assert.doesNotMatch(
    mobile,
    /\.pf-tree > button:first-child\s*\{[^}]*position: absolute/,
  );
});

test("plugin version is 0.5.24", () => {
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  assert.equal(pkg.version, "0.5.24");
});

function nestedHasSnippets(source: string): string[] {
  const stripped = source.replace(/\/\*[\s\S]*?\*\//g, "");
  const hits: string[] = [];
  let from = 0;
  while (from < stripped.length) {
    const start = stripped.indexOf(":has(", from);
    if (start === -1) break;
    let depth = 1;
    let i = start + 5;
    while (i < stripped.length && depth > 0) {
      if (stripped.startsWith(":has(", i)) {
        hits.push(stripped.slice(start, i + 5).replace(/\s+/g, " "));
        break;
      }
      if (stripped[i] === "(") depth += 1;
      else if (stripped[i] === ")") depth -= 1;
      i += 1;
    }
    from = start + 5;
  }
  return hits;
}

test("theme CSS does not nest :has() inside :has()", () => {
  assert.deepEqual(nestedHasSnippets(css), []);
  assert.deepEqual(nestedHasSnippets(base), []);
  assert.deepEqual(nestedHasSnippets(chat), []);
  assert.deepEqual(nestedHasSnippets(integrations), []);
});

test("icon-only Проект uses a flat :has() for Back/Forward in the top row", () => {
  const desktopBlocks = [...base.matchAll(/@media \(min-width: 768px\) \{[\s\S]*?\n\}/g)]
    .map((m) => m[0])
    .join("\n");
  assert.doesNotMatch(base, /anchor-size\(/);
  assert.match(
    desktopBlocks,
    /\[data-side="left"\]:has\(\s*\[data-testid="app-sidebar-top-reserve-row"\] button\[aria-label\^="Back"\],\s*\[data-testid="app-sidebar-top-reserve-row"\] button\[aria-label\^="Forward"\],\s*\[data-testid="app-sidebar-top-reserve-row"\] button\[aria-label\^="Назад"\],\s*\[data-testid="app-sidebar-top-reserve-row"\] button\[aria-label\^="Вперёд"\]\s*\)/,
  );
});

test("desktop right panel tab row aligns with the page header card", () => {
  const desktopBlocks = [...base.matchAll(/@media \(min-width: 768px\) \{[\s\S]*?\n\}/g)]
    .map((m) => m[0])
    .join("\n");
  const mobile = base.slice(base.lastIndexOf("@media (max-width: 767px)"));
  assert.match(
    desktopBlocks,
    /#thread-detail-secondary-panel > aside\s*\{[^}]*padding: 0 var\(--pk-gap\) var\(--pk-gap\) 0/,
  );
  assert.doesNotMatch(
    desktopBlocks,
    /#thread-detail-secondary-panel > aside\s*\{[^}]*padding: var\(--pk-gap\) var\(--pk-gap\) var\(--pk-gap\) 0/,
  );
  assert.match(
    desktopBlocks,
    /#thread-detail-secondary-panel > aside > div > div:first-child\s*\{[^}]*margin: var\(--pk-gap-card\) 0 0/,
  );
  assert.match(
    desktopBlocks,
    /#thread-detail-secondary-panel > aside > div > div:first-child\s*\{[^}]*height: calc\(var\(--bb-app-chrome-row-height, 48px\) - var\(--pk-gap-card\)\)/,
  );
  assert.match(
    desktopBlocks,
    /#thread-detail-secondary-panel > aside > div > div:last-child\s*\{[^}]*margin: var\(--pk-gap-card\) 0 0/,
  );
  assert.doesNotMatch(
    mobile,
    /#thread-detail-secondary-panel > aside\s*\{[^}]*padding: 0 var\(--pk-gap\) var\(--pk-gap\) 0/,
  );
  assert.match(
    mobile,
    /\[data-testid="secondary-panel-shelf"\] aside > :not\(\[data-testid="thread-secondary-panel-top-chrome"\]\)\s*\{[^}]*margin: 0 8px 8px/,
  );
});

test("desktop top row, surface wrappers, and resize handle hide overlap artifacts", () => {
  const desktopBlocks = [...base.matchAll(/@media \(min-width: 768px\) \{[\s\S]*?\n\}/g)]
    .map((m) => m[0])
    .join("\n");
  const mobile = base.slice(base.lastIndexOf("@media (max-width: 767px)"));
  assert.match(
    desktopBlocks,
    /\[data-testid="app-sidebar-top-reserve-row"\],\s*\[data-variant="sidebar"\]\[data-side="left"\] \[data-testid="app-sidebar-body"\]\s*\{[^}]*background-color: transparent/,
  );
  assert.match(
    desktopBlocks,
    /\[data-sidebar="sidebar"\] > \*:not\(\[data-testid="app-nav-rail"\]\)\s*\{[^}]*background-color: transparent/,
  );
  assert.match(
    desktopBlocks,
    /\[data-sidebar="rail"\]\s*\{[^}]*bottom: var\(--pk-gap\)/,
  );
  assert.match(
    desktopBlocks,
    /\[data-sidebar="rail"\]\s*\{[^}]*background: transparent/,
  );
  assert.match(
    desktopBlocks,
    /\[data-sidebar="gap"\]\s*\{[^}]*background: transparent/,
  );
  assert.match(
    desktopBlocks,
    /\[data-testid="app-sidebar-top-reserve-row"\]:has\(\s*button\[aria-label\^="Back"\],\s*button\[aria-label\^="Forward"\],\s*button\[aria-label\^="Назад"\],\s*button\[aria-label\^="Вперёд"\]\s*\)/,
  );
  assert.match(
    desktopBlocks,
    /button:first-child\s*\{[^}]*width: 32px/,
  );
  assert.match(
    desktopBlocks,
    /button:first-child::after\s*\{[^}]*content: none/,
  );
  assert.match(
    desktopBlocks,
    /padding-left: calc\(32px \+ var\(--pk-gap-card\)\)/,
  );
  assert.doesNotMatch(
    desktopBlocks,
    /\[data-sidebar="content"\][^\{]*\{[^}]*overflow:/,
  );
  assert.doesNotMatch(
    mobile,
    /\[data-testid="app-sidebar-top-reserve-row"\]:has\(/,
  );
});

test("macOS framed window drops BB's own frame lip and gray sidebar card", () => {
  const desktop = base.slice(0, base.indexOf("/* ── Page header"));
  assert.match(
    desktop,
    /\[data-framed\]:not\(\[data-framed="false"\]\) \{[^}]*padding-bottom: 0;[^}]*background-image: none;/,
  );
  assert.match(
    desktop,
    /\[data-testid="nav-rail-sidebar-body"\] \{[^}]*background-color: transparent;/,
  );
  assert.match(
    base,
    /:has\(> \[data-testid="app-page-header-content-row"\]\) \{[^}]*padding-inline: 0;/,
  );
});

test("collapsed icon rail is a fully rounded card", () => {
  assert.match(
    base,
    /\[data-collapsible="rail"\]\[data-side="left"\] \[data-sidebar="sidebar"\] \{[^}]*border-radius: var\(--pk-radius-panel\);/,
  );
});

test("phone shell rules keep literal radii", () => {
  const mobile = base.slice(base.lastIndexOf("@media (max-width: 767px)"));
  assert.match(mobile, /border-radius: 20px;/);
  assert.match(mobile, /border-radius: 10px;/);
  assert.match(mobile, /border-radius: 16px;/);
  assert.match(mobile, /border-radius: 18px;/);
});
