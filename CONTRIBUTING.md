# Contributing to InariWrite

Thank you for helping build InariWrite. We value **clear scope**, **kind review**, and **small, reviewable PRs**.

## Before you start

1. **[docs/architecture.md](docs/architecture.md)** — layers and dependency rules.  
2. **[docs/plugins.md](docs/plugins.md)** — `MarkdownPlugin` API.  
3. **[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)**.  
4. **[docs/README.md](docs/README.md)** — full doc map (platforms, i18n, release, etc.).  
5. Issues: check [existing issues](https://github.com/OWNER/InariWrite/issues) or open one for larger changes. Replace `OWNER` with the real org or username when the repo is public.

## Environment

- **Node.js 20+** and **pnpm 9** (root `packageManager` in `package.json`).  
- Optional: **Rust** + system deps for [desktop (Tauri)](docs/platforms.md); not required for web/CLI work.

```bash
corepack enable && corepack prepare pnpm@9.15.9 --activate   # if needed
pnpm install
```

## Commands

**Daily**

```bash
pnpm dev          # Vite — @inariwrite/web
pnpm lint
pnpm typecheck
pnpm test
```

**Before opening a PR** (matches CI)

```bash
pnpm build
pnpm run budget      # web dist gzip caps
pnpm run test:e2e    # needs pnpm build first
pnpm run audit       # high severity; same threshold as CI
```

**CLI** (after `pnpm build`): `node apps/cli/dist/index.js preview|build|check|publish …` — see root [README](README.md#cli) and [optional-cloud.md](docs/optional-cloud.md), [plugins.md](docs/plugins.md).

**Desktop / mobile** shells: [docs/platforms.md](docs/platforms.md).

## Pull requests

- **One logical change** per PR when possible.  
- **Tests** for behavior changes in touched packages (`packages/core`, `apps/web`, `apps/cli`, …).  
- **UI copy:** update **both** `mn` and `en` in `packages/i18n/src/resources.ts`, or note a follow-up translation in the PR.  
- **Conventional Commits** welcome (`feat:`, `fix:`, `docs:`).

## Good first contributions

See [docs/good-first-issues.md](docs/good-first-issues.md) for templates maintainers can label **good first issue**.

- Docs, translations (MN / EN).  
- Tests for the markdown pipeline or editor.  
- CLI features built on `@inariwrite/core`.  
- Web accessibility (labels, focus, live regions).

## Changesets and versioning

Workspace packages use [Changesets](https://github.com/changesets/changesets). For changelog-worthy changes:

```bash
pnpm changeset
```

Maintainers bump locally with `pnpm version-packages`. See [.changeset/README.md](.changeset/README.md). Add `changeset publish` in CI when publishing to npm (`NPM_TOKEN`).

## Before going public

Replace `OWNER` in issue templates, this file, **SECURITY.md**, and related links. Fill **`[INSERT SECURITY EMAIL]`** and **`[INSERT CONTACT EMAIL]`** in **SECURITY.md** and **CODE_OF_CONDUCT.md**.

## Maintainer response time

We aim for a **first response within several days**. If a PR stalls, a polite ping is welcome.

## Security

Do not open public issues for vulnerabilities. See [SECURITY.md](SECURITY.md).
