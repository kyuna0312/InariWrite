# InariWrite

**Монгол хөгжүүлэгчдийн нээлттэй эхийн Markdown редактор** · A modern, high-performance Markdown editor — open source and built for a global community, with a Mongolian-first spirit.

InariWrite aims for a **clean, modular, extensible** architecture: a UI-agnostic core, adapters for **Web** (React + Vite) and **CLI** (Node), and a contributor experience friendly to beginners.

## Status

**Shipped:** **Phase 3** — `MarkdownPlugin` + **`@inariwrite/plugin-sample`**, preview in a **Web Worker**, plus split-pane **CodeMirror 6** (lazy-loaded) + **live preview** (GFM via `@inariwrite/core`), **light/dark** themes, **Mongolian-first** UI (`@inariwrite/i18n`), **open/save**, **PWA** build, and **CLI** `preview` / `--watch` / `build`. See [docs/plugins.md](docs/plugins.md).

## Documentation

| Document | Description |
|----------|-------------|
| [Architecture](docs/architecture.md) | Layers, tech stack, monorepo layout, features |
| [Roadmap](docs/roadmap.md) | MVP → production phases |
| [Internationalization](docs/internationalization.md) | Mongolian-first i18n strategy |
| [Open source & branding](docs/open-source-strategy.md) | License, community, Mongolian ecosystem positioning |
| [Plugins](docs/plugins.md) | `MarkdownPlugin` API, sample package, worker preview |
| [Contributing](CONTRIBUTING.md) | How to contribute |

## Quick start

```bash
pnpm install
pnpm dev
```

Open the URL Vite prints (usually `http://localhost:5173`). Use **Open file** / **Save** in the toolbar for local Markdown.

## CLI

After `pnpm build`:

```bash
node apps/cli/dist/index.js preview ./README.md
node apps/cli/dist/index.js preview ./README.md --watch
node apps/cli/dist/index.js preview ./README.md --watch --interval 750
node apps/cli/dist/index.js build ./README.md -o ./dist-md
```

`preview` serves sanitized HTML and re-reads the file on each request. With **`--watch`**, the server uses **`fs.watch`** and pushes **`EventSource`** updates (`/__inariwrite/events`); the page **reloads on change**. If EventSource fails (or `fs.watch` is unavailable), it **falls back to polling** `/__inariwrite/mtime`. **`--interval`** sets the poll period in milliseconds (clamped 100–60000, default 500). `build` writes `index.html` into the output directory.

## License

[MIT](LICENSE)

---

**English:** InariWrite is an open-source Markdown editor initiative. We welcome contributors worldwide and prioritize clear docs in both Mongolian and English.

**Монгол:** Төслийг олон улсын хөгжүүлэгчидтэй хамтран хөгжүүлнэ. Баримт бичгийг монгол болон англи хэл дээр нэгэн зэрэг хөтлөнө.
