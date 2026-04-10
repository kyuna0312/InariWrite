# Open source strategy and branding

**Doc index:** [README.md](README.md) · **Contributing:** [CONTRIBUTING](../CONTRIBUTING.md)

How InariWrite stays healthy as a project and visible as a **Mongolian open-source initiative** while welcoming global contributors.

## License

**Current: [MIT](../LICENSE)** — maximizes adoption and embedding with low friction.

**If you ever reconsider:** **MPL-2.0** (file-level copyleft, still combinable in many cases). License changes need a **maintainer decision** and a clear migration note.

## Governance (light)

- **`MAINTAINERS.md`** when multiple people merge and release.  
- **Semver** for published packages.  
- **RFCs** or **`docs/adr/`** for large calls (plugin ABI, sync protocol).

## Channels

| Channel | For |
|---------|-----|
| **GitHub Issues** | Bugs, tracked work, small features |
| **GitHub Discussions** | Ideas, Q&A, show-and-tell |
| **Pull requests** | Review; keep diffs small |

Add **Discord/Matrix** only with **active moderation**; until then, Discussions reduces fragmentation.

## Contributor experience

- **[CONTRIBUTING](../CONTRIBUTING.md)** with exact commands.  
- **`good first issue`** + clear acceptance criteria ([good-first-issues.md](good-first-issues.md)).  
- **Conventional Commits** optional; helps automated changelogs.  
- **Monthly changelog** or release post: low effort, high signal.

## Security and maintenance

- **[SECURITY.md](../SECURITY.md)** — advisories or dedicated email.  
- **Dependabot** + **`pnpm audit`** in CI where appropriate.  
- Pin critical **GitHub Actions** revisions.

## Branding (Mongolian ecosystem)

1. **README:** Bilingual hero (MN + EN) stating the Mongolian OSS angle.  
2. **Welcome:** EN invites global contributors; MN anchors local identity.  
3. **Local outreach:** Dev groups, meetups, universities; e.g. **“first PR in 90 minutes”** using a labeled good-first-issue.  
4. **Talks:** Short deck: problem → architecture → contribute.  
5. **Partnerships:** Cross-links and office hours with other MN OSS projects.  
6. **Assets:** Logo + wordmark; align with web app colors.

## npm and plugins

- Official scope: **`@inariwrite/*`**.  
- Community: encourage **`inariwrite-plugin-*`** on npm and a **curated list** (may live outside this repo).

## Metrics (early)

- Time to **green CI** for a new contributor.  
- **External contributors** and **closed good-first-issues**.  
- **Issue response** time (set expectations in CONTRIBUTING).

Prioritize **repeat contributors** and **closed real issues** over stars alone.
