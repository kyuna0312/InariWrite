# Architecture

How InariWrite stays **fast**, **modular**, and **easy to extend**.  
**Related:** [Platforms](platforms.md) (web / Tauri / Capacitor) · [Plugins](plugins.md) · [Doc index](README.md)

## Product shape

InariWrite is built around a **core editing engine** that does not depend on React or the DOM:

- **Markdown parsing** and an internal **document / AST representation**
- **Commands and transactions** (including undo/redo)
- A **plugin host** with stable, versioned APIs

**Adapters** sit on top:

| Adapter | Role |
|---------|------|
| **Web** | React + Vite UI: panes, themes, file open/save UX, PWA |
| **Desktop** | Tauri shell in `apps/desktop` loading the same web build (see [platforms.md](platforms.md)) |
| **Mobile** | Capacitor shells (Android / iOS) loading `apps/web/dist` (see [platforms.md](platforms.md)) |
| **CLI** | Node: `preview`, `build`, `check`, `publish` (HTTP hook for raw Markdown), batch operations |

## Do we need a backend?

**Not for MVP.** A client-only editor keeps onboarding simple, supports **offline** usage, and avoids hosting and auth complexity.

Add backend **only** when you need:

- Encrypted or multi-device **sync**
- **Team workspaces** with permissions
- **Server-side features** that must hide API keys (e.g. some AI flows)

Those should be **separate deployable services**, not baked into the editor core. Phase 5 documents this stance and a light **threat-model sketch** in [optional-cloud.md](optional-cloud.md).

## Layers

```
┌──────────────────────────────────────────┐
│  apps/web (React + Vite)                 │
│  apps/desktop (Tauri)                    │
│  apps/cli (Node)                         │
└──────────────────┬───────────────────────┘
                   │
┌──────────────────▼───────────────────────┐
│  packages/react (hooks, components)      │
└──────────────────┬───────────────────────┘
                   │
┌──────────────────▼───────────────────────┐
│  packages/editor (bindings, selection)   │
└──────────────────┬───────────────────────┘
                   │
┌──────────────────▼───────────────────────┐
│  packages/core (AST, pipeline, plugins)  │
└──────────────────────────────────────────┘
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
| Styling | **Tailwind CSS v4** | `@tailwindcss/vite`; `apps/web/src/index.css` + `@apply` for editor/preview; class-based `dark:` (`theme/storage.ts`); panes stack below **`lg`**, split side-by-side from **`lg`** |
| Tests | **Vitest**; **Playwright** smoke (`apps/web/e2e`) after `vite preview` | Aligns with Vite |
| Tooling | **ESLint** (flat config) + **Prettier** + **TypeScript strict** | |
| CLI | **Node 20+**, **commander** or **cac**; optional **Ink** for TUI | |
| Docs site | **VitePress** or **Astro + Starlight** | Markdown-native, i18n-friendly |

## Monorepo layout

**Shipped now:** `packages/core`, `packages/i18n`, `packages/plugin-sample`, `apps/web`, `apps/desktop` (Tauri), and `apps/cli`. `packages/editor` and `packages/react` remain planned (thin React-specific editor layer on top of core). See [plugins.md](plugins.md) for the `MarkdownPlugin` contract and sample package.

**Target tree:**

```
inariwrite/
├── apps/
│   ├── web/                 # Vite + React shell (PWA; Capacitor host)
│   ├── desktop/             # Tauri shell → web dist
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

**Published / workspace names include:** `@inariwrite/core`, `@inariwrite/web`, `@inariwrite/desktop`, `@inariwrite/cli`, `@inariwrite/i18n`, `@inariwrite/plugin-sample`. Planned: `@inariwrite/editor`, `@inariwrite/react`.

Publish **`exports`** maps in each package’s `package.json` and avoid deep imports (`@inariwrite/core/internal/...`) for anything consumers rely on.

## Performance practices

- **Debounce** preview; run heavy work in a **Web Worker** where it helps.
- **Split preview cost:** cheap HTML first; **Shiki / Mermaid** behind lazy boundaries.
- **Vite production chunks:** `codemirror-vendor`, `react-vendor`, and `i18n-vendor` are split in `apps/web/vite.config.ts` so the app shell parses less JS up front and static assets cache better across releases.
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

- **PWA / offline** — baseline shipped (`vite-plugin-pwa`); deeper offline editing / File System Access API optional
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
- Web **a11y** improvements (shortcuts, landmarks, screen-reader polish); see [RELEASE.md](RELEASE.md).
- Web: **accessibility** for preview (`aria-live`, focus management).
