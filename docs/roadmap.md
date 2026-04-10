# Roadmap

How InariWrite grew from **scaffold** → **shippable editor** → **hardened OSS**. Timelines are flexible.

**Related:** [Doc index](README.md) · [Architecture](architecture.md) · [Platforms](platforms.md) · [Release / 1.0](RELEASE.md) · [Optional cloud](optional-cloud.md)

## How to use this page

- **Phase overview** — one-screen status of phases **0–5**.
- **Per-phase sections** — checklists and **exit** meaning for that milestone.
- **Version 1.0** — go to [RELEASE.md](RELEASE.md) for the **actionable** release checklist (not duplicated here).

---

## Phase overview

| Phase | Focus | Status |
|-------|--------|--------|
| **0** | Monorepo, CI, core + web + CLI skeleton | Shipped |
| **1** | Credible web editor (preview, i18n, files) | Shipped |
| **2** | Safe for external contributors | **Mostly shipped** — two items open (see Phase 2 below) |
| **3** | `MarkdownPlugin`, CLI `preview` / `build` / `check`, worker preview | Shipped |
| **4** | PWA, a11y baseline, audits, gzip budgets, Playwright | Shipped |
| **5** | Optional cloud stance + CLI `publish` | Shipped |

### Product surfaces (same UI, different shells)

| Surface | Location | Run / ship |
|---------|----------|------------|
| **Web + PWA** | `apps/web` | `pnpm dev` · deploy `dist/` |
| **Desktop** | `apps/desktop` (Tauri) | `pnpm desktop:dev` · `pnpm desktop:build` |
| **Mobile** | Capacitor from `apps/web` | `pnpm mobile:sync` (after `mobile:add:*`) |
| **CLI** | `apps/cli` | See [README](../README.md#cli) |

Details: [platforms.md](platforms.md).

---

## Phase 0 — Foundation

**Goal:** Clone the repo and understand it in minutes.

- [x] Monorepo (pnpm, Turborepo)
- [x] CI: lint, typecheck, test, build (`.github/workflows/ci.yml`)
- [x] `packages/core`: `parseMarkdown` → mdast + Vitest
- [x] `apps/web` (Vite + React); `apps/cli` with `--version`
- [x] Docs linked from README

**Exit:** Green CI on `main`; layout matches [architecture.md](architecture.md) for **core**, **web**, **cli** (planned: **editor** / **react** packages on top of core).

---

## Phase 1 — MVP editor

**Goal:** Daily-use Markdown in the browser.

- [x] Editor + live GFM preview (`markdownToHtml` + `rehype-sanitize` in `@inariwrite/core`)
- [x] Dark/light themes (`localStorage`)
- [x] i18n: `mn` default, `en` — `@inariwrite/i18n`, `react-i18next`
- [x] Open/save (file picker + download)
- [x] README: `pnpm dev` quick start

**Exit:** Real notes/docs can be written and saved; MN/EN UI works.

---

## Phase 2 — Open source readiness

**Goal:** Strangers can contribute with a clear process.

- [x] Issue + PR templates (`.github/ISSUE_TEMPLATE`, `pull_request_template.md`)
- [x] [good-first-issues.md](good-first-issues.md) (apply label **`good first issue`** when filing)
- [ ] **SECURITY.md** and **CoC** — replace contact **placeholders** before a wide public launch
- [ ] Optional **docs site** (VitePress / Astro) mirroring key pages
- [x] Changesets (`.changeset/config.json`; npm publish when registry/token ready)
- [x] Dependabot (npm + Actions — `.github/dependabot.yml`)

**Exit:** First external PR merged with a documented, repeatable flow.

> **Before a big announcement:** finish the two unchecked items above (contacts + optional docs site).

---

## Phase 3 — Extensibility and CLI

**Goal:** One pipeline in **core**; web and CLI prove it.

- [x] **`MarkdownPlugin`** (`defineMarkdownPlugin`, remark/rehype) + **`@inariwrite/plugin-sample`** — [plugins.md](plugins.md) · [plugins.mn.md](plugins.mn.md)
- [x] CLI **`preview`**, **`build`** (`markdownToHtmlDocument`); **same default plugins** as web
- [x] Web preview in a **Web Worker**; Shiki/Mermaid = optional future plugins
- [x] CLI **`check`** — relative `.md` / `.markdown` links resolve on disk

**Exit:** Plugins + CLI documented; no duplicate markdown pipeline in apps.

---

## Phase 4 — Production hardening

**Goal:** Trust for real users and embedders.

- [x] **PWA** — `vite-plugin-pwa` + Workbox (`apps/web`)
- [x] **A11y baseline** — skip link, `:focus-visible`, preview `role="alert"`, landmarks, labeled controls
- [x] **Supply chain** — Dependabot; `pnpm audit --audit-level=high` in CI; `pnpm.overrides` when needed
- [x] **Gzip budgets** + **Playwright smoke** — `pnpm run budget`, `pnpm run test:e2e` (after `pnpm build`)

**Exit:** **1.0-style** criteria live in [RELEASE.md](RELEASE.md).

---

## Phase 5 — Optional cloud

**Goal:** Servers only where they add clear value.

- [x] [optional-cloud.md](optional-cloud.md) — sync / auth / AI as **separate** services
- [x] CLI **`publish <file> -u <url>`** — raw Markdown to **your** endpoint (Bearer: `INARIWRITE_PUBLISH_TOKEN`)
- [x] Default **web + CLI** need **no** backend ([README](../README.md) **Local-first**)
- [x] **SECURITY.md** — scope for optional future services

**Exit:** Local-first stays obvious in README and docs.

---

## Horizon (not tied to a phase)

Ideas aligned with [architecture.md](architecture.md) **Later** / planned layers—prioritize by maintainer and user need.

| Theme | Examples |
|-------|----------|
| **Core / packages** | `packages/editor`, `packages/react` as thin layers over `@inariwrite/core` |
| **Editing UX** | Stronger keyboard shortcuts; deeper offline / File System Access API |
| **Output** | Export PDF; richer CLI `build` parity with web |
| **Ecosystem** | Curated **`inariwrite-plugin-*`** on npm |
| **Collaboration** | CRDT/OT **after** the document model is stable |

---

## Version 1.0

The **checklist** to **call** a release 1.0 lives only in **[RELEASE.md](RELEASE.md)** (semver, i18n completeness, maintainer contacts, CI, e2e, Changesets).

This roadmap records **history by phase**; **RELEASE.md** is **what to do next** to ship 1.0.
