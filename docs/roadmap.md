# Roadmap

High-level phases from **foundation** to **production**. Timelines are indicative; adjust as contributors and scope grow.

## Phase 0 — Foundation

**Goal:** A repo that others can clone and understand in minutes.

- Monorepo scaffold (pnpm, Turborepo or equivalent)
- CI: lint, typecheck, test, build on every PR
- `packages/core` with a minimal API (e.g. `parse(markdown) → ast`) and unit tests
- Empty `apps/web` shell and `apps/cli` with `--version`
- This documentation set linked from README

**Exit criteria:** Green CI on main; architecture doc matches the tree.

## Phase 1 — MVP editor

**Goal:** A credible daily-use Markdown editor.

- Web: editor + live preview, GFM
- Themes (dark/light)
- i18n: `mn` default + `en` fallback for UI chrome
- File open/save story (web-appropriate)
- README quick start accurate for `pnpm dev`

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

- Stable **plugin API** surface in core + one demo plugin
- CLI: `preview` (local server), `build` (static HTML) using shared pipeline
- Performance pass: worker, lazy Shiki/Mermaid

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
