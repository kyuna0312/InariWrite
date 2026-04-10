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

- [x] GitHub issue/PR templates (`.github/ISSUE_TEMPLATE`, `pull_request_template.md`)
- [x] `good first issue` ideas: [good-first-issues.md](good-first-issues.md) (apply label in GitHub when filing)
- [ ] SECURITY.md and CoC contact placeholders filled in before wide announcement
- [ ] Optional docs site (VitePress/Astro) mirroring key pages
- [x] Changesets: CLI + `.changeset/config.json` (automated publish when registry is ready)
- [x] Dependabot: npm + GitHub Actions (`.github/dependabot.yml`)

**Exit criteria:** First external PR merged with a clear process.

## Phase 3 — Extensibility and CLI

**Goal:** Same logic everywhere; plugins and CLI prove the architecture.

- [x] Stable **`MarkdownPlugin` API** in `@inariwrite/core` (`defineMarkdownPlugin`, remark/rehype stages) + **`@inariwrite/plugin-sample`** (`:inari:` → 🦊)
- [x] CLI: `preview` (local server), `build` (static HTML) via `markdownToHtmlDocument` in `@inariwrite/core`, with the **same default plugins** as the web preview (`plugin-sample`)
- [x] Performance: **preview runs in a Web Worker** when available; Shiki/Mermaid left as optional future rehype plugins (see [plugins.md](plugins.md))
- [x] CLI: **`check`** — validate relative `.md` / `.markdown` link targets on disk (same remark plugins as preview)

**Exit criteria:** Plugin and CLI documented; no duplicate markdown logic in apps.

## Phase 4 — Production hardening

**Goal:** Trust for real users and downstream projects.

- [x] PWA/offline where feasible — **Vite PWA** + Workbox precache (`apps/web`)
- [x] Accessibility baseline — **skip link**, **`:focus-visible`** on toolbar controls, **`role="alert"`** for preview errors, **`main`** landmark, **ARIA labels** on file input / theme / language
- [x] Dependency and security hygiene — **Dependabot**; **`pnpm audit --audit-level=high`** in CI; **`pnpm.overrides`** when needed for transitive advisories
- [x] **Gzip bundle budgets** + **Playwright smoke** (`apps/web` `pnpm run budget`, `pnpm run test:e2e`; root `pnpm run budget` / `pnpm run test:e2e`)

**Exit criteria:** Explicit “1.0” criteria checklist published — see [RELEASE.md](RELEASE.md).

## Phase 5 — Optional cloud

**Goal:** Only what needs a server.

- Sync, auth, or hosted AI — **optional**, self-host docs, clear threat model
- Never required for local editing

**Exit criteria:** Local-first path remains first-class in README.

---

## Version 1.0 suggestion checklist

When you are ready to call **1.0** (mirror of [RELEASE.md](RELEASE.md)):

- [ ] Stable `@inariwrite/core` API with semver discipline
- [ ] Web MVP + documented CLI paths
- [ ] MN + EN for all user-visible chrome
- [ ] LICENSE, CONTRIBUTING, SECURITY, CoC in use (contacts filled)
- [ ] CI green; basic e2e smoke for web
