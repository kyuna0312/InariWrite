# InariWrite

**Монгол хөгжүүлэгчдийн нээлттэй эхийн Markdown редактор** · A modern, high-performance Markdown editor — open source and built for a global community, with a Mongolian-first spirit.

InariWrite aims for a **clean, modular, extensible** architecture: a UI-agnostic core, adapters for **Web** (React + Vite) and **CLI** (Node), and a contributor experience friendly to beginners.

## Status

**Phase 1 (MVP editor) delivered:** split-pane Markdown editor with **live preview** (GFM via `@inariwrite/core`), **light/dark** themes, **Mongolian-first** UI with English (`@inariwrite/i18n`), and **open/save** for `.md` files in the browser. Monorepo, CI, and CLI are from Phase 0.

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

Open the URL Vite prints (usually `http://localhost:5173`). Use **Open file** / **Save** in the toolbar for local Markdown. After `pnpm build`, run `node apps/cli/dist/index.js --version` to verify the CLI.

## License

[MIT](LICENSE)

---

**English:** InariWrite is an open-source Markdown editor initiative. We welcome contributors worldwide and prioritize clear docs in both Mongolian and English.

**Монгол:** Төслийг олон улсын хөгжүүлэгчидтэй хамтран хөгжүүлнэ. Баримт бичгийг монгол болон англи хэл дээр нэгэн зэрэг хөтлөнө.
