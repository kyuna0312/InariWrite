# Changesets

Maintainers use [Changesets](https://github.com/changesets/changesets) to record what changed before releasing workspace packages.

```bash
pnpm changeset   # interactive: pick packages + bump type + summary
```

After merging accumulated changesets, bump versions locally:

```bash
pnpm version-packages   # runs `changeset version`; updates package.jsons and changelog
```

Publishing to npm is optional while packages stay `private: true`. When you are ready to publish, add an `NPM_TOKEN` secret and wire `changeset publish` into CI (see root `CONTRIBUTING.md`).
