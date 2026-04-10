# Roadmap

High-level phases from **foundation** to **production**. Timelines are indicative; adjust as contributors and scope grow.

## Phase 0 — Foundation

**Goal:** A repo that others can clone and understand in minutes.

- [x] Monorepo scaffold (pnpm, Turborepo)
- [x] CI: lint, typecheck, test, build on every PR (`.github/workflows/ci.yml`)
- [x] `packages/core` with `parseMarkdown` → mdast and unit tests (Vitest)
- [x] `apps/web` Vite + React shell; `apps/cli` `inariwrite` with `--version`
- [x] Documentation linked from README

**Exit criteria:** Green CI on main; repo matches the layout in [architecture.md](architecture.md) for delivered packages (`core`, `web`, `cli`). Optional packages (`editor`, `react`, `i18n`) ship in later phases.

## Phase 1 — MVP editor

**Goal:** A credible daily-use Markdown editor.

- [x] Web: editor + live preview, GFM (`markdownToHtml` + `rehype-sanitize` in `@inariwrite/core`)
- [x] Themes (dark/light), persisted in `localStorage`
- [x] i18n: `mn` default + `en` via `@inariwrite/i18n` and `react-i18next`
- [x] File open/save (browser file picker + download)
- [x] README quick start for `pnpm dev`

**Exit criteria:** Someone can write a real note or doc page and save it; MN/EN UI works.

## Phase 2 — Open source readiness

**Goal:** Safe for strangers to contribute.

- GitHub issue/PR templates
- `good first issue` labels and 3–5 scoped tasks
- SECURITY.md and CoC contact placeholders filled in
- Optional docs site (VitePress/Astro) mirroring key pages
- Release workflow (e.g. Changesets) for packages

**Exit criteria:** First external PR merged with a clear process.

## Phase 3 — Extensibility and CLI

**Goal:** Same logic everywhere; plugins and CLI prove the architecture.

- [x] Stable **`MarkdownPlugin` API** in `@inariwrite/core` (`defineMarkdownPlugin`, remark/rehype stages) + **`@inariwrite/plugin-sample`** (`:inari:` → 🦊)
- [x] CLI: `preview` (local server), `build` (static HTML) via `markdownToHtmlDocument` in `@inariwrite/core`
- [x] Performance: **preview runs in a Web Worker** when available; Shiki/Mermaid left as optional future rehype plugins (see [plugins.md](plugins.md))

**Exit criteria:** Plugin and CLI documented; no duplicate markdown logic in apps.

## Phase 4 — Production hardening

**Goal:** Trust for real users and downstream projects.

- PWA/offline where feasible
- Accessibility audit (keyboard, screen readers, contrast)
- Dependency and security hygiene (Dependabot, audit in CI)
- Performance budgets optional in CI

**Exit criteria:** Explicit “1.0” criteria checklist published (in this doc or RELEASE.md).

## Phase 5 — Optional cloud

**Goal:** Only what needs a server.

- Sync, auth, or hosted AI — **optional**, self-host docs, clear threat model
- Never required for local editing

**Exit criteria:** Local-first path remains first-class in README.

---

## Version 1.0 suggestion checklist

When you are ready to call **1.0**:

- [ ] Stable `@inariwrite/core` API with semver discipline
- [ ] Web MVP + documented CLI paths
- [ ] MN + EN for all user-visible chrome
- [ ] LICENSE, CONTRIBUTING, SECURITY, CoC in use
- [ ] CI green; basic e2e smoke for web
