# Release and “1.0” criteria

This file is the **explicit checklist** for calling a release production-ready. It complements [roadmap.md](roadmap.md).

## Phase 4 — production hardening (summary)

| Area | Status |
|------|--------|
| **PWA / offline** | Service worker via `vite-plugin-pwa` (`apps/web`); precaches built assets. Editing stays local-first; first load needs network unless the shell is already cached. |
| **Accessibility** | Skip link to main content, visible `:focus-visible` rings on controls, `role="alert"` for preview errors, semantic regions (`header` / `main` / `section`), labeled file input and selects. Screen-reader and full WCAG audits remain manual follow-ups. |
| **Dependency hygiene** | [Dependabot](../.github/dependabot.yml); **`pnpm audit --audit-level=high`** in [CI](../.github/workflows/ci.yml). Root **`pnpm.overrides`** may pin transitive fixes when advisories lag upstream. |
| **Performance budgets** | **Gzip budgets** on `apps/web/dist/assets` via `pnpm run budget` (after build); CI runs it on every PR. |

## Version 1.0 checklist

Ship when these are true (tick in [roadmap.md](roadmap.md) Version section as you go):

- [ ] **`@inariwrite/core` API** treated as semver-stable; breaking changes only on major bumps.
- [ ] **Web MVP** + **CLI** (`preview`, `build`, `check`, config/plugins) documented in README and [plugins.md](plugins.md).
- [ ] **MN + EN** for all user-visible chrome (`packages/i18n`).
- [ ] **LICENSE**, **CONTRIBUTING**, **SECURITY**, **CoC** — contact placeholders replaced for real maintainers.
- [ ] **CI green** on `main`; **Playwright** smoke (`pnpm run test:e2e`, Chromium) exercises load + editor + preview. Local runs need browsers once: `pnpm --filter @inariwrite/web exec playwright install chromium`.
- [ ] **Changeset** (or release notes process) agreed for user-facing package changes.

## Publishing

- Use **`pnpm changeset`** before merging user-visible library changes; run **`pnpm version-packages`** when cutting versions (see [CONTRIBUTING.md](../CONTRIBUTING.md)).
- Add **`NPM_TOKEN`** and a release workflow when packages are published to a registry.
