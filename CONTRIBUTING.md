# Contributing to InariWrite

Thank you for helping build InariWrite. This project values **clear scope**, **kind review**, and **small, reviewable PRs**.

## Before you start

1. Read [docs/architecture.md](docs/architecture.md) and [docs/plugins.md](docs/plugins.md) for layers and the `MarkdownPlugin` API.
2. Read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
3. Check [existing issues](https://github.com/OWNER/InariWrite/issues) or open one to discuss larger changes.

Replace `OWNER` with the actual GitHub org or username when the repository is published.

## Development

Requires **Node.js 20+** and [pnpm](https://pnpm.io/) 9 (see root `packageManager` in `package.json`).

```bash
pnpm install
pnpm dev          # Vite dev server (@inariwrite/web)
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm run budget   # gzip size caps on web dist (CI)
pnpm run test:e2e # Playwright smoke; requires `pnpm build` first
pnpm run audit    # high-severity threshold; matches CI
```

After a build, you can run `node apps/cli/dist/index.js preview <file.md>` (`--watch` uses SSE with polling fallback; `--interval` for poll ms), `… build <file.md> -o <dir>`, or `… check <file.md>` to verify relative Markdown links. Optional **`--config`** and comma-separated **`--plugin`** load extra `MarkdownPlugin` modules (see [docs/plugins.md](docs/plugins.md)).

Use `corepack enable` then `corepack prepare pnpm@9.15.9 --activate` if you do not have pnpm installed globally.

## Pull requests

- **One logical change per PR** when possible.
- **Update or add tests** for behavior changes in `packages/core`, `apps/web`, `apps/cli`, or other touched packages.
- **UI strings:** If you add user-visible text, update **both** `mn` and `en` in `packages/i18n/src/resources.ts`, or note in the PR that a follow-up translation issue is needed.
- **Conventional Commits** are welcome (`feat:`, `fix:`, `docs:`) for clearer history and changelogs.

## Good first contributions

See [docs/good-first-issues.md](docs/good-first-issues.md) for copy-paste issue templates maintainers can label **`good first issue`**.

- Documentation fixes and translations (Mongolian / English).
- Tests for the markdown pipeline or editor behavior.
- CLI subcommands that reuse `@inariwrite/core` (e.g. `check` for broken links).
- Accessibility improvements in the web app (labels, focus, live regions for preview).

## Changesets and versioning

Workspace packages use [Changesets](https://github.com/changesets/changesets). Before merging a PR that should appear in package changelogs, add a changeset:

```bash
pnpm changeset
```

To apply accumulated changesets and bump versions locally (maintainers):

```bash
pnpm version-packages
```

See [.changeset/README.md](.changeset/README.md). Automated `changeset publish` in CI can be added when packages are published to a registry (`NPM_TOKEN`).

## Before going public

Replace `OWNER` in issue templates, `CONTRIBUTING.md`, `SECURITY.md`, and related links with your GitHub org or username. Fill **`[INSERT SECURITY EMAIL]`** and **`[INSERT CONTACT EMAIL]`** in [SECURITY.md](SECURITY.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Maintainer response time

We aim for a **first response within several days**. If a PR stalls, a polite ping in the thread is welcome.

## Security

Do not open public issues for vulnerabilities. See [SECURITY.md](SECURITY.md).
