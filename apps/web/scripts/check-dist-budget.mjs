#!/usr/bin/env node
/**
 * Fails if built assets exceed gzip budgets (catches large accidental regressions).
 * Run from repo root: pnpm --filter @inariwrite/web run budget
 * (after `pnpm build` / `turbo run build`).
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const webRoot = fileURLToPath(new URL("..", import.meta.url));
const assetsDir = join(webRoot, "dist", "assets");

function gzipBytes(buf) {
  return gzipSync(buf).length;
}

/** @type {{ test: (name: string) => boolean; maxGzip: number; label: string }[]} */
const rules = [
  {
    label: "main entry JS",
    test: (n) => /^index-[^/]+\.js$/.test(n) && !n.includes("workbox"),
    maxGzip: 220 * 1024,
  },
  {
    label: "Markdown editor lazy entry JS",
    test: (n) => /^MarkdownEditor-[^/]+\.js$/.test(n),
    maxGzip: 8 * 1024,
  },
  {
    label: "CodeMirror vendor JS",
    test: (n) => /^codemirror-vendor-[^/]+\.js$/.test(n),
    maxGzip: 300 * 1024,
  },
  {
    label: "React vendor JS",
    test: (n) => /^react-vendor-[^/]+\.js$/.test(n),
    maxGzip: 95 * 1024,
  },
  {
    label: "i18n vendor JS",
    test: (n) => /^i18n-vendor-[^/]+\.js$/.test(n),
    maxGzip: 28 * 1024,
  },
  {
    label: "preview worker JS",
    test: (n) => /^markdownPreview\.worker-[^/]+\.js$/.test(n),
    maxGzip: 230 * 1024,
  },
  {
    label: "workbox-window JS",
    test: (n) => /^workbox-window[^/]*\.js$/.test(n),
    maxGzip: 12 * 1024,
  },
  {
    label: "app CSS",
    test: (n) => /^index-[^/]+\.css$/.test(n),
    maxGzip: 48 * 1024,
  },
];

const defaultMaxGzip = 650 * 1024;

let stat;
try {
  stat = statSync(assetsDir);
} catch {
  console.error(`check-dist-budget: missing ${assetsDir} — run build first.`);
  process.exit(1);
}
if (!stat.isDirectory()) {
  console.error(`check-dist-budget: not a directory: ${assetsDir}`);
  process.exit(1);
}

const names = readdirSync(assetsDir).filter((n) => n.endsWith(".js") || n.endsWith(".css"));
let failed = false;

for (const name of names) {
  const full = join(assetsDir, name);
  const raw = readFileSync(full);
  const gz = gzipBytes(raw);
  const rule = rules.find((r) => r.test(name));
  const max = rule ? rule.maxGzip : defaultMaxGzip;
  const label = rule ? rule.label : "other asset";
  if (gz > max) {
    failed = true;
    console.error(
      `Budget exceeded: ${name} (${label}) gzip ${(gz / 1024).toFixed(1)} KiB > ${(max / 1024).toFixed(1)} KiB`,
    );
  }
}

if (failed) {
  process.exit(1);
}

console.log(`OK: gzip budgets passed for ${names.length} assets in dist/assets.`);
