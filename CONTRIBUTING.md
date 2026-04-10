# Contributing to InariWrite

Thank you for helping build InariWrite. This project values **clear scope**, **kind review**, and **small, reviewable PRs**.

## Before you start

1. Read [docs/architecture.md](docs/architecture.md) for layers and package boundaries.
2. Read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
3. Check [existing issues](https://github.com/OWNER/InariWrite/issues) or open one to discuss larger changes.

Replace `OWNER` with the actual GitHub org or username when the repository is published.

## Development (when the monorepo exists)

```bash
pnpm install
pnpm lint
pnpm test
pnpm build
```

Commands may vary slightly per `package.json`; the README will stay updated.

## Pull requests

- **One logical change per PR** when possible.
- **Update or add tests** for behavior changes in `packages/core` and `packages/editor`.
- **UI strings:** If you add user-visible text, update **both** `mn` and `en` catalogs when they exist, or note in the PR that a follow-up translation issue is needed.
- **Conventional Commits** are welcome (`feat:`, `fix:`, `docs:`) for clearer history and changelogs.

## Good first contributions

- Documentation fixes and translations (Mongolian / English).
- Tests for the markdown pipeline or editor transactions.
- CLI subcommands that reuse `@inariwrite/core` (e.g. `check` for broken links).
- Accessibility improvements in the web app (labels, focus, live regions for preview).

## Maintainer response time

We aim for a **first response within several days**. If a PR stalls, a polite ping in the thread is welcome.

## Security

Do not open public issues for vulnerabilities. See [SECURITY.md](SECURITY.md).
