# Open source strategy and branding

How InariWrite stays healthy as a project and visible as a **Mongolian open-source initiative** without closing the door to global contributors.

## License

**Current choice: [MIT](../LICENSE)**

- Maximizes **adoption** and corporate use with minimal friction.
- Fits libraries and editor cores that others may embed.

**Alternative to document if you ever change strategy:** **MPL-2.0** — file-level copyleft that still allows proprietary combinations in many cases; sometimes easier for companies than strong GPL.

If the license changes, it requires **maintainer decision** and a clear migration note; avoid churn.

## Governance (lightweight)

- **MAINTAINERS.md** (add when you have multiple maintainers): who can merge, who cuts releases.
- **Semantic versioning** for published packages.
- **RFCs** or **`docs/adr/`** for large decisions (plugin ABI, sync protocol).

## Community channels

| Channel | Use |
|---------|-----|
| **GitHub Issues** | Tracked work, bugs, small features |
| **GitHub Discussions** | Ideas, Q&A, show-and-tell |
| **Pull requests** | Code review; keep scope reviewable |

Add **Discord or Matrix** only when someone can **moderate** regularly; until then, Discussions reduces fragmentation.

## Contribution experience

- **CONTRIBUTING.md** with exact commands (`pnpm install`, `pnpm test`, …).
- Label **`good first issue`** with **acceptance criteria** and file hints.
- **Conventional Commits** optional; helps automated changelogs.
- **Monthly changelog** or release post (Discussion or blog): low effort, high signal.

## Security and maintenance

- **SECURITY.md** with GitHub private advisories or a dedicated email.
- **Dependabot** (or Renovate) + `pnpm audit` in CI where appropriate.
- Pin critical actions in GitHub workflows for supply-chain hygiene.

## Branding as a Mongolian developer ecosystem project

Concrete, repeatable moves:

1. **README hero:** Bilingual tagline (MN + EN) stating the Mongolian open-source angle, as in the main README.
2. **Explicit welcome:** English text that says global contributors are wanted; Mongolian text that anchors local identity.
3. **Local community:** Reach Mongolian dev groups, meetups, universities; offer a **“first PR in 90 minutes”** workshop using a labeled good-first-issue.
4. **Talks:** One short slide deck: problem → architecture → how to contribute; submit to regional events.
5. **Partnerships:** Co-marketing with other MN OSS projects (mutual README links, shared office hours).
6. **Assets:** Simple logo + wordmark; consistent colors in the web app and docs.

## npm and plugins

- Scope: **`@inariwrite/*`** for official packages.
- Community plugins: encourage **`inariwrite-plugin-*`** on npm and a **curated list** in docs (not necessarily in-repo).

## Metrics that matter early

- Time to **green CI** for a new contributor
- Number of **external contributors** and **closed good-first-issues**
- **Issue response** time (set honest expectations in CONTRIBUTING)

Avoid optimizing only for stars; prioritize **repeat contributors** and **real issues closed**.
