# Good first issues (templates for maintainers)

Copy any item into a real GitHub issue and apply the **`good first issue`** label. Each has a clear scope and acceptance hint.

1. ~~**CLI: `check` command for broken internal links**~~ **Done** — `inariwrite check <file.md>` uses `listRelativeMarkdownFileLinks` in `@inariwrite/core`; see `apps/cli/src/check.ts` and tests.

2. **i18n: one missing key audit**  
   Script or test that fails CI if `mn` and `en` keys in `packages/i18n/src/resources.ts` diverge (same key set).  
   *Acceptance:* `pnpm` script runnable in CI; documents how to add keys in `CONTRIBUTING.md`.

3. **Web: focus trap or visible focus ring on toolbar**  
   Improve keyboard UX: all toolbar controls reachable with Tab; visible `:focus-visible` styles consistent with light/dark themes.  
   *Acceptance:* short note in PR describing Tab order; no regressions in lint/build.

4. **Core: one extra `MarkdownPlugin` test for rehype stage**  
   Add a tiny rehype plugin in `packages/core/src/plugins.test.ts` (e.g. add a `data-*` attribute on `p`) and assert it appears in `markdownToHtml` output before sanitize strips it—or extend sanitize schema in test only.  
   *Acceptance:* test documents rehype hook order vs `rehype-sanitize`.

5. **Docs: translate `docs/plugins.md` section into Mongolian**  
   Add `docs/plugins.mn.md` (or a bilingual section) explaining `MarkdownPlugin` for Mongolian-speaking contributors.  
   *Acceptance:* link from main `docs/plugins.md` or README docs table.

Maintainers: replace `OWNER` links in `.github/ISSUE_TEMPLATE` when the repository URL is final.
