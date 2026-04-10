# Architecture

This document describes how InariWrite is structured so the project stays **fast**, **modular**, and **easy to extend**.

## Product shape

InariWrite is built around a **core editing engine** that does not depend on React or the DOM:

- **Markdown parsing** and an internal **document / AST representation**
- **Commands and transactions** (including undo/redo)
- A **plugin host** with stable, versioned APIs

**Adapters** sit on top:

| Adapter | Role |
|---------|------|
| **Web** | React + Vite UI: panes, themes, file open/save UX |
| **CLI** | Node: `preview`, `build`, `check`, batch operations |

Optional later: **desktop** (e.g. Tauri) reusing the same `@inariwrite/core` and `@inariwrite/editor` packages.

## Do we need a backend?

**Not for MVP.** A client-only editor keeps onboarding simple, supports **offline** usage, and avoids hosting and auth complexity.

Add backend **only** when you need:

- Encrypted or multi-device **sync**
- **Team workspaces** with permissions
- **Server-side features** that must hide API keys (e.g. some AI flows)

Those should be **separate deployable services**, not baked into the editor core.

## Layers

```
┌─────────────────────────────────────────┐
│  apps/web (React + Vite)                │
│  apps/cli (Node)                        │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  packages/react (hooks, components)     │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  packages/editor (bindings, selection)  │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  packages/core (AST, pipeline, plugins) │
└─────────────────────────────────────────┘
```

**Dependency rule:** Dependencies flow **downward** only. `packages/core` must not import from `editor`, `react`, or `apps`. Enforce this in code review and optionally with **ESLint** `no-restricted-imports` or **dependency-cruiser**.

## Recommended tech stack

| Area | Choice | Notes |
|------|--------|--------|
| Language | **TypeScript** | Shared types across core, web, CLI |
| Monorepo | **pnpm** workspaces + **Turborepo** (or Nx) | Standard OSS layout |
| Web | **React** + **Vite** | Fast dev server, wide contributor pool |
| Markdown | **unified** + **remark** + **rehype** (or **micromark** for tighter control) | Rich plugin ecosystem |
| Code highlighting | **Shiki** (or **lowlight** if bundle size dominates) | Great for fenced code blocks |
| Optional | KaTeX, Mermaid | Lazy-load; keep default bundle lean |
| State in UI | **Zustand** or thin custom stores | Keep React out of `core` |
| Styling | **CSS Modules** or **Tailwind** | Pick one; document in CONTRIBUTING |
| Tests | **Vitest**; **Playwright** for web e2e | Aligns with Vite |
| Tooling | **ESLint** (flat config) + **Prettier** + **TypeScript strict** | |
| CLI | **Node 20+**, **commander** or **cac**; optional **Ink** for TUI | |
| Docs site | **VitePress** or **Astro + Starlight** | Markdown-native, i18n-friendly |

## Monorepo layout (target)

```
inariwrite/
├── apps/
│   ├── web/                 # Vite + React shell
│   └── cli/                 # Node CLI entry
├── packages/
│   ├── core/                # Document model, markdown pipeline, plugin host
│   ├── editor/              # Editor controller — no React
│   ├── react/               # React bindings
│   ├── plugins/             # First-party plugins (optional grouping)
│   └── i18n/                # Locales, helpers
├── docs/                    # Project docs (this folder) + optional VitePress site
├── .github/
│   ├── workflows/
│   ├── ISSUE_TEMPLATE/
│   └── pull_request_template.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
├── LICENSE
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

**Package names (example):** `@inariwrite/core`, `@inariwrite/editor`, `@inariwrite/react`, `@inariwrite/cli`.

Publish **`exports`** maps in each package’s `package.json` and avoid deep imports (`@inariwrite/core/internal/...`) for anything consumers rely on.

## Performance practices

- **Debounce** preview; run heavy work in a **Web Worker** where it helps.
- **Split preview cost:** cheap HTML first; **Shiki / Mermaid** behind lazy boundaries.
- Optional **CI bundle budget** (e.g. gzip limit for `apps/web`) to catch regressions.

## Core features (prioritized)

### MVP

- Editor + **live preview** (split or tabbed)
- **GitHub-flavored Markdown**
- Open/save (web: upload/download; CLI: paths)
- **Keyboard-first** shortcuts for common constructs
- Dark/light **themes**
- **mn** + **en** UI (see [internationalization.md](internationalization.md))
- At least one **documented plugin hook** in core

### Later

- **PWA / offline** (service worker; File System Access API where available)
- **Export** HTML/PDF; CLI `build` mirroring web preview
- **Plugin** ecosystem (`inariwrite-plugin-*` naming on npm)
- Optional **collaboration** (e.g. CRDT) after the document model is stable

## Public API and evolution

- Use **semantic versioning** for published packages.
- **Breaking changes** in `@inariwrite/core` deserve an RFC or short ADR under `docs/adr/` when the project matures.
- Consider **Changesets** for changelog-driven releases in the monorepo.

## First contribution ideas

- Wrap a **remark** plugin as `@inariwrite/plugin-*`.
- Add **tests** for parse → AST → serialize round-trips.
- CLI: `inariwrite check` for broken **internal** Markdown links.
- Web: **accessibility** for preview (`aria-live`, focus management).
