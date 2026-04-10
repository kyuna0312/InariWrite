# Plugins (`@inariwrite/core`)

InariWrite exposes a small, stable hook for **remark** and **rehype** plugins around the default GFM pipeline.

## `MarkdownPlugin`

```ts
import type { MarkdownPlugin } from "@inariwrite/core";

const myPlugin: MarkdownPlugin = {
  name: "my-org/my-plugin",
  remarkPlugins: [myRemarkPlugin, [myRemarkPluginWithOptions, { flag: true }]],
  rehypePlugins: [myRehypePlugin],
};
```

Each list item is a **unified `Pluggable`**: either a plugin function, or a `[plugin, options]` tuple. They are applied with `processor.use(pluggable)` in order.

- **`remarkPlugins`** — run **after** `remark-gfm` and **before** `remark-rehype`.
- **`rehypePlugins`** — run **after** `remark-rehype` and **before** `rehype-sanitize**.

Use `defineMarkdownPlugin()` for a typed helper; behavior is the same as returning the object.

## APIs that accept plugins

| Function | Option |
|----------|--------|
| `parseMarkdown(markdown, { plugins })` | remark stage only |
| `markdownToHtml(markdown, { plugins })` | remark + rehype |
| `markdownToHtmlDocument(markdown, { plugins, … })` | passed through to `markdownToHtml` |
| `listRelativeMarkdownFileLinks(markdown, { plugins })` | remark stage only; used by `inariwrite check` |

## CLI: config and extra plugins

`inariwrite preview`, `build`, and `check` share the same **default** plugins as the web app (`@inariwrite/plugin-sample` first). You can add more in two ways:

1. **Config file** in the current working directory: `inariwrite.config.mjs`, `inariwrite.config.js`, or `inariwrite.config.cjs`. Export either:
   - `export default { markdownPlugins: [myPlugin, …] }`, or
   - `export default myPlugin`, or
   - `export const markdownPlugins = […]`

2. **`--plugin <specs>`** — comma-separated module specifiers resolved like Node `import()`: npm package names (e.g. `@scope/pkg`) or relative paths (`./my-plugin.mjs`). Loaded **after** config plugins.

Use **`-c, --config <file>`** to point at a config file instead of auto-discovery.

## Sample package

**`@inariwrite/plugin-sample`** replaces `:inari:` in text with 🦊. It is wired into the **web preview worker** (and main-thread fallback) and is the **first** plugin for **`inariwrite preview` / `build` / `check`**; add more via **`inariwrite.config.*`** or **`--plugin`** (above).

## Performance: preview worker

The web app renders preview HTML in a **dedicated worker** when `Worker` is available, so the unified pipeline stays off the UI thread. The worker uses the same plugin list as the fallback path. If the worker does not respond within a few seconds, the app **falls back to the main thread** so preview still updates (helps PWA/preview edge cases and tests).

## Future: Shiki, Mermaid, heavy transforms

Syntax highlighting (e.g. Shiki) and diagrams (Mermaid) are **not** bundled by default to keep install size and main/worker payloads small. Recommended approach:

1. Add a dedicated **`MarkdownPlugin`** that wraps `rehype-shiki` or similar.
2. Load that plugin **only in the worker** (or via `import()` inside the plugin factory) so the initial shell stays lean.
3. Keep sanitization (`rehype-sanitize`) **after** your rehype plugins, or extend the sanitize schema carefully for the tags/classes you need.
