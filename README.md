# InariWrite

**Монгол хөгжүүлэгчдийн нээлттэй эхийн Markdown редактор** · A modern, high-performance Markdown editor — open source and built for a global community, with a Mongolian-first spirit.

InariWrite aims for a **clean, modular, extensible** architecture: a UI-agnostic core, adapters for **Web** (React + Vite) and **CLI** (Node), and a contributor experience friendly to beginners.

## Status

**Shipped:** **Phase 3** — `MarkdownPlugin` + **`@inariwrite/plugin-sample`**, preview in a **Web Worker**, split-pane **CodeMirror 6** + **live preview**, **PWA**, **CLI** (`preview` / `build` / `check`, config + `--plugin`). **Phase 4 (baseline)** — a11y pass, **Dependabot**, **`pnpm audit`**, **gzip bundle budgets**, **Playwright smoke** (Chromium), [RELEASE.md](docs/RELEASE.md). See [docs/plugins.md](docs/plugins.md).

## Documentation

| Document | Description |
|----------|-------------|
| [Architecture](docs/architecture.md) | Layers, tech stack, monorepo layout, features |
| [Roadmap](docs/roadmap.md) | MVP → production phases |
| [Internationalization](docs/internationalization.md) | Mongolian-first i18n strategy |
| [Open source & branding](docs/open-source-strategy.md) | License, community, Mongolian ecosystem positioning |
| [Plugins](docs/plugins.md) | `MarkdownPlugin` API, sample package, worker preview |
| [Release / 1.0](docs/RELEASE.md) | Hardening summary and version checklist |
| [Contributing](CONTRIBUTING.md) | How to contribute |

## Quick start

### Prerequisites

- **Node.js 20+** (current LTS is ideal). Check with `node --version`.
- **pnpm 9.15.9** — this repo declares it in `package.json` as `packageManager`.

### First-time setup (from the repo root)

```bash
corepack enable
corepack prepare pnpm@9.15.9 --activate
pnpm install
```

If `corepack` is not available, use either `npm install -g pnpm@9.15.9` or a one-off `npx pnpm@9.15.9 install` instead of `pnpm install`.

### Run the web app

```bash
pnpm dev
```

Open the URL Vite prints (usually `http://localhost:5173`). Use **Open file** / **Save** in the toolbar for local Markdown.

### Optional

- **CLI** after a build: `pnpm build`, then e.g. `node apps/cli/dist/index.js preview ./README.md` (see [CLI](#cli) below).
- **Playwright smoke tests**: `pnpm --filter @inariwrite/web exec playwright install chromium`, then `pnpm run test:e2e` (needs `pnpm build` first; same as CI).

## CLI

After `pnpm build`:

```bash
node apps/cli/dist/index.js preview ./README.md
node apps/cli/dist/index.js preview ./README.md --watch
node apps/cli/dist/index.js preview ./README.md --watch --interval 750
node apps/cli/dist/index.js build ./README.md -o ./dist-md
node apps/cli/dist/index.js check ./README.md
node apps/cli/dist/index.js build ./README.md -o ./dist-md -c ./inariwrite.config.mjs
node apps/cli/dist/index.js preview ./README.md --plugin "./extra.mjs,@scope/other-plugin"
```

`check` fails with exit code **1** if any **relative** link to a `.md` / `.markdown` file is missing on disk (resolved from the Markdown file’s directory). **`--config`** / **`--plugin`** apply to `preview`, `build`, and `check` (see [docs/plugins.md](docs/plugins.md)). `preview` serves sanitized HTML and re-reads the file on each request. With **`--watch`**, the server uses **`fs.watch`** and pushes **`EventSource`** updates (`/__inariwrite/events`); the page **reloads on change**. If EventSource fails (or `fs.watch` is unavailable), it **falls back to polling** `/__inariwrite/mtime`. **`--interval`** sets the poll period in milliseconds (clamped 100–60000, default 500). `build` writes `index.html` into the output directory.

## License

[MIT](LICENSE)

---

**English:** InariWrite is an open-source Markdown editor initiative. We welcome contributors worldwide and prioritize clear docs in both Mongolian and English.

**Монгол:** Төслийг олон улсын хөгжүүлэгчидтэй хамтран хөгжүүлнэ. Баримт бичгийг монгол болон англи хэл дээр нэгэн зэрэг хөтлөнө.
