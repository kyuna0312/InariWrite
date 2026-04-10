# InariWrite

**Монгол хөгжүүлэгчдийн нээлттэй эхийн Markdown редактор** · A modern, high-performance Markdown editor — open source and built for a global community, with a Mongolian-first spirit.

InariWrite aims for a **clean, modular, extensible** architecture: a UI-agnostic core, adapters for **Web** (React + Vite) and **CLI** (Node), and a contributor experience friendly to beginners.

## Status

**Phase 0 (foundation) complete:** pnpm + Turborepo monorepo, `@inariwrite/core` with `parseMarkdown` + tests, Vite/React shell in `apps/web`, CLI `inariwrite` with `--version`, and CI on GitHub Actions. Phase 1 adds the real editor and i18n.

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

Open the URL Vite prints (usually `http://localhost:5173`). From the repo root after `pnpm build`, run `node apps/cli/dist/index.js --version` to verify the CLI (or install/link the `inariwrite` bin per `apps/cli/package.json`).

## License

[MIT](LICENSE)

---

**English:** InariWrite is an open-source Markdown editor initiative. We welcome contributors worldwide and prioritize clear docs in both Mongolian and English.

**Монгол:** Төслийг олон улсын хөгжүүлэгчидтэй хамтран хөгжүүлнэ. Баримт бичгийг монгол болон англи хэл дээр нэгэн зэрэг хөтлөнө.
