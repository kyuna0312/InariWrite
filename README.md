# InariWrite

**Монгол хөгжүүлэгчдийн нээлттэй эхийн Markdown редактор** · A modern, high-performance Markdown editor — open source and built for a global community, with a Mongolian-first spirit.

InariWrite aims for a **clean, modular, extensible** architecture: a UI-agnostic core, adapters for **Web** (React + Vite) and **CLI** (Node), and a contributor experience friendly to beginners.

## Status

**Shipped:** split-pane editor with **CodeMirror 6** (lazy-loaded chunk) + **live preview** (GFM via `@inariwrite/core`), **light/dark** themes, **Mongolian-first** UI (`@inariwrite/i18n`), **open/save**, **PWA / offline-capable** production build (`vite-plugin-pwa`), and **CLI** `preview` / `preview --watch` / `build` using the same HTML pipeline as the app.

## Documentation

| Document | Description |
|----------|-------------|
| [Architecture](docs/architecture.md) | Layers, tech stack, monorepo layout, features |
| [Roadmap](docs/roadmap.md) | MVP → production phases |
| [Internationalization](docs/internationalization.md) | Mongolian-first i18n strategy |
| [Open source & branding](docs/open-source-strategy.md) | License, community, Mongolian ecosystem positioning |
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
node apps/cli/dist/index.js build ./README.md -o ./dist-md
```

`preview` serves sanitized HTML and re-reads the file on each request. With **`--watch`**, the page polls the server and **reloads when the file’s modification time changes**. `build` writes `index.html` into the output directory.

## License

[MIT](LICENSE)

---

**English:** InariWrite is an open-source Markdown editor initiative. We welcome contributors worldwide and prioritize clear docs in both Mongolian and English.

**Монгол:** Төслийг олон улсын хөгжүүлэгчидтэй хамтран хөгжүүлнэ. Баримт бичгийг монгол болон англи хэл дээр нэгэн зэрэг хөтлөнө.
