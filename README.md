# InariWrite

**Монгол хөгжүүлэгчдийн нээлттэй эхийн Markdown редактор** · A modern Markdown editor — open source, Mongolian-first, built for a global community.

**Stack at a glance:** UI-agnostic **`@inariwrite/core`** · **Web** (React + Vite + PWA) · **Desktop** (Tauri) · **Mobile** (Capacitor) · **CLI** (Node).

## Status (shipped)

| Phase | Highlights |
|-------|------------|
| **3** | `MarkdownPlugin`, `@inariwrite/plugin-sample`, preview **Web Worker**, CodeMirror + live preview, **PWA**, CLI `preview` / `build` / `check` + config / `--plugin` |
| **4** | A11y baseline, Dependabot, `pnpm audit`, **gzip budgets**, **Playwright** smoke — see [docs/RELEASE.md](docs/RELEASE.md) |
| **5** | Optional cloud stance + CLI **`publish`** (HTTP hook) — [docs/optional-cloud.md](docs/optional-cloud.md) |

No server or account required for the default editor. Plugins: [docs/plugins.md](docs/plugins.md) · [Монгол](docs/plugins.mn.md).

## Documentation

**Index:** [docs/README.md](docs/README.md) — all guides in one table.

| Doc | Description |
|-----|-------------|
| [Architecture](docs/architecture.md) | Layers, stack, monorepo |
| [Platforms](docs/platforms.md) | Web vs Tauri vs Capacitor |
| [Roadmap](docs/roadmap.md) | Phases and criteria |
| [Plugins](docs/plugins.md) · [MN](docs/plugins.mn.md) | `MarkdownPlugin` API |
| [i18n](docs/internationalization.md) | Mongolian-first locales |
| [Optional cloud](docs/optional-cloud.md) | Opt-in sync / hooks |
| [Release](docs/RELEASE.md) | Version checklist |
| [Contributing](CONTRIBUTING.md) | PRs, tests, Changesets |

## Quick start

**Prerequisites:** Node **20+**, **pnpm 9.15.9** (see root `packageManager`).

```bash
corepack enable && corepack prepare pnpm@9.15.9 --activate
pnpm install
```

### Run the app

| Target | Command | Notes |
|--------|---------|--------|
| **Web** | `pnpm dev` | Opens Vite (usually `http://localhost:5173`). Toolbar: **Open** / **Save**. |
| **Desktop** | `pnpm desktop:dev` | Needs [Rust](https://www.rust-lang.org/tools/install) + [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/). |
| **Mobile** | `pnpm mobile:add:android` then `pnpm mobile:sync` | One-time platform add; [details](docs/platforms.md). |

Production desktop bundles: `pnpm desktop:build` → `apps/desktop/src-tauri/target/release/bundle/`.

### Local-first

You do **not** need an account, API key, or InariWrite-hosted server. Future sync / auth / hosted AI would be **optional** and self-hostable — [docs/optional-cloud.md](docs/optional-cloud.md).

### Optional: CLI and tests

After `pnpm build`:

```bash
node apps/cli/dist/index.js preview ./README.md
node apps/cli/dist/index.js check ./README.md
```

More flags and `publish`: see [CLI](#cli) below and [docs/plugins.md](docs/plugins.md).

**E2E:** `pnpm --filter @inariwrite/web exec playwright install chromium`, then `pnpm build` and `pnpm run test:e2e` (same order as CI).

## CLI

After `pnpm build`:

```bash
node apps/cli/dist/index.js preview ./README.md
node apps/cli/dist/index.js preview ./README.md --watch
node apps/cli/dist/index.js preview ./README.md --watch --interval 750
node apps/cli/dist/index.js build ./README.md -o ./dist-md
node apps/cli/dist/index.js check ./README.md
node apps/cli/dist/index.js publish ./README.md -u https://example.com/hooks/md -m PUT
node apps/cli/dist/index.js build ./README.md -o ./dist-md -c ./inariwrite.config.mjs
node apps/cli/dist/index.js preview ./README.md --plugin "./extra.mjs,@scope/other-plugin"
```

- **`check`** — exit **1** if a relative link to `.md` / `.markdown` is missing (resolved from the file’s directory).
- **`publish`** — POST/PUT raw Markdown to your URL; see [optional-cloud.md](docs/optional-cloud.md).
- **`--config`** / **`--plugin`** — apply to `preview`, `build`, `check`; see [plugins.md](docs/plugins.md).
- **`preview`** — sanitized HTML; **`--watch`** uses `fs.watch` + **EventSource** (`/__inariwrite/events`), reload on change; falls back to polling `/__inariwrite/mtime`. **`--interval`** sets poll ms (100–60000, default 500).
- **`build`** — writes `index.html` into `-o`.

## License

[MIT](LICENSE)

---

**English:** Open-source Markdown editor; contributors welcome worldwide; docs in Mongolian and English.

**Монгол:** Төслийг олон улсын хөгжүүлэгчидтэй хамтран хөгжүүлнэ. Баримт бичгийг монгол болон англи хэл дээр нэгэн зэрэг хөтлөнө.
