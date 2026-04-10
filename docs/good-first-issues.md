# Good first issues (templates)

**Doc index:** [README.md](README.md) · **Contributing:** [CONTRIBUTING](../CONTRIBUTING.md)

Copy any block into a GitHub issue and label **`good first issue`**. Each item has scope + acceptance hint.

---

### 1. ~~CLI: `check` for broken relative `.md` links~~ **Done**

Implemented: `inariwrite check <file.md>` via `listRelativeMarkdownFileLinks` in `@inariwrite/core`. See `apps/cli/src/check.ts` and tests.

---

### 2. i18n: key parity audit

**Idea:** Script or test that fails CI if `mn` and `en` keys in `packages/i18n/src/resources.ts` diverge.

**Acceptance:** `pnpm` script runnable in CI; [CONTRIBUTING](../CONTRIBUTING.md) documents how to add keys.

---

### 3. Web: toolbar keyboard UX

**Idea:** All toolbar controls reachable with **Tab**; consistent **`:focus-visible`** styles in light/dark.

**Acceptance:** Short PR note on tab order; lint/build green.

---

### 4. Core: rehype-stage `MarkdownPlugin` test

**Idea:** Tiny rehype plugin in `packages/core/src/plugins.test.ts` (e.g. add a `data-*` on `<p>`) and assert behavior vs **`markdownToHtml`** / **`rehype-sanitize`** order.

**Acceptance:** Test documents rehype vs sanitize ordering.

---

### 5. ~~Docs: `plugins.md` in Mongolian~~ **Done**

Shipped: [plugins.mn.md](plugins.mn.md), linked from [plugins.md](plugins.md) and [docs/README.md](README.md).

---

**Maintainers:** Replace `OWNER` in `.github/ISSUE_TEMPLATE` when the repo URL is final.
