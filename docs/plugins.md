# Plugins (`@inariwrite/core`)

**Монгол тайлбар:** [plugins.mn.md](plugins.mn.md)  
**Doc index:** [README.md](README.md) · **Architecture:** [architecture.md](architecture.md) · **CLI usage:** root [README](../README.md#cli)

InariWrite exposes a small, stable hook for **remark** and **rehype** plugins on top of the default **GFM** pipeline.

## `MarkdownPlugin`

```ts
import type { MarkdownPlugin } from "@inariwrite/core";

const myPlugin: MarkdownPlugin = {
  name: "my-org/my-plugin",
  remarkPlugins: [myRemarkPlugin, [myRemarkPluginWithOptions, { flag: true }]],
  rehypePlugins: [myRehypePlugin],
};
```

Each entry is a **unified `Pluggable`**: a plugin function, or a **`[plugin, options]`** tuple. Applied with `processor.use(pluggable)` in list order.

`defineMarkdownPlugin()` is a typed helper; behavior matches a plain object.

### Where plugins run

| Field | Stage |
|-------|--------|
| **`remarkPlugins`** | After **remark-gfm**, before **remark-rehype** |
| **`rehypePlugins`** | After **remark-rehype**, before **rehype-sanitize** |

## APIs that accept `{ plugins }`

| API | Plugins affect |
|-----|----------------|
| `parseMarkdown(markdown, { plugins })` | Remark only |
| `markdownToHtml(markdown, { plugins })` | Remark + rehype |
| `markdownToHtmlDocument(markdown, { plugins, … })` | Same as `markdownToHtml` |
| `listRelativeMarkdownFileLinks(markdown, { plugins })` | Remark only; powers **`inariwrite check`** |

## CLI: config and `--plugin`

`inariwrite preview`, **`build`**, and **`check`** use the same default plugins as the web app (**`@inariwrite/plugin-sample`** first). Add more via:

| Mechanism | Details |
|-----------|---------|
| **Config file** (cwd) | `inariwrite.config.mjs` / `.js` / `.cjs` — `export default { markdownPlugins: […] }` or `export default onePlugin` or `export const markdownPlugins = […]` |
| **`--plugin <specs>`** | Comma-separated specifiers for dynamic `import()` (npm scope or `./path.mjs`). Loaded **after** config plugins. |
| **`-c, --config <file>`** | Use that file instead of auto-discovery. |

## Sample: `@inariwrite/plugin-sample`

Replaces `:inari:` with 🦊. Wired into the **web preview worker** (and main-thread fallback) and loaded **first** for CLI **`preview` / `build` / `check`**. Add others via config or **`--plugin`**.

## Web preview worker

Preview HTML runs in a **Web Worker** when `Worker` exists, so the unified pipeline stays off the UI thread. Plugin list matches the fallback path. If the worker does not answer within a few seconds, the app **falls back to the main thread** (helps PWA edge cases and tests).

## Heavy plugins (Shiki, Mermaid, …)

Not bundled by default (install + payload size). Suggested pattern:

1. Ship a **`MarkdownPlugin`** that wraps e.g. `rehype-shiki`.
2. Lazy-load inside the plugin (or **worker-only**) so the shell stays small.
3. Keep **`rehype-sanitize` after** your rehype plugins, or extend the sanitize schema deliberately for any new tags/classes.
