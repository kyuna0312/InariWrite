# Release and “1.0” criteria

**Doc index:** [README.md](README.md) · **Phases:** [roadmap.md](roadmap.md)

Explicit checklist for calling a release **production-ready**.

## Phase 4 — hardening (summary)

| Area | What shipped |
|------|----------------|
| **PWA** | `vite-plugin-pwa` precaches built assets; editing stays local-first; first visit needs network until shell is cached. |
| **Accessibility** | Skip link, `:focus-visible` on controls, `role="alert"` on preview errors, landmarks (`header` / `main` / `section`), labeled file input and selects. Full WCAG/screen-reader audits = manual follow-up. |
| **Dependencies** | [Dependabot](../.github/dependabot.yml); **`pnpm audit --audit-level=high`** in [CI](../.github/workflows/ci.yml); root **`pnpm.overrides`** for transitive fixes when needed. |
| **Bundle size** | Gzip **budgets** on `apps/web/dist/assets` via **`pnpm run budget`** (CI after build). |

## Version 1.0 checklist

Tick alongside [roadmap.md](roadmap.md) as you go.

- [ ] **`@inariwrite/core`** API treated as **semver-stable**; breaking changes only on **major**.  
- [ ] **Web MVP** + **CLI** (`preview`, `build`, `check`, config/plugins) documented in [README](../README.md) and [plugins.md](plugins.md).  
- [ ] **MN + EN** for all user-visible chrome (`packages/i18n`).  
- [ ] **LICENSE**, **CONTRIBUTING**, **SECURITY**, **CoC** — real contacts (no placeholders).  
- [ ] **CI green** on `main`; **Playwright** smoke (`pnpm run test:e2e`, Chromium) covers load + editor + preview. One-time: `pnpm --filter @inariwrite/web exec playwright install chromium`.  
- [ ] **Changesets** (or agreed release notes) for user-facing package changes.

## Publishing packages

- **`pnpm changeset`** before merging user-visible library changes; **`pnpm version-packages`** when cutting versions ([CONTRIBUTING](../CONTRIBUTING.md)).  
- Add **`NPM_TOKEN`** + a release workflow when publishing to npm.
