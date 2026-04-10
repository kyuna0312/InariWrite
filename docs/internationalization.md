# Internationalization (i18n)

**Doc index:** [README.md](README.md) · **Strings:** `packages/i18n/src/resources.ts`

InariWrite is **Mongolian-first** in spirit: positioning emphasizes Mongolia’s open-source ecosystem; **English** is supported so global contributors can ship without friction.

## Principles

| # | Guideline |
|---|-----------|
| 1 | **User Markdown** is language-agnostic. Only **app chrome** (menus, buttons, errors, onboarding) is translated. |
| 2 | Use **BCP 47** tags; today **`mn`** and **`en`**. If you add script-specific tags later, validate **fonts and layout** in real browsers early. |
| 3 | **Default locale `mn`** where the team agrees; always expose a clear switch to **`en`** (and document it). |

## Implementation (today)

- **Web:** **i18next** + **react-i18next** (`apps/web`).  
- **Catalog:** **`@inariwrite/i18n`** — `packages/i18n/src/resources.ts` exports `mn`, `en`, and `resources` for `i18next.init`.  
- **Alternative:** FormatJS/ICU if the project ever standardizes on ICU messages.

## Contributor workflow

- **New or changed UI string:** update **both** `mn` and `en` in **`resources.ts`**, or open a follow-up labeled **`i18n`**.  
- PRs: remind “chrome changed → locales updated?” (see [CONTRIBUTING](../CONTRIBUTING.md)).  
- At scale: Weblate/Crowdin—optional.

## Documentation languages

- A future docs site might use **`/mn/`** and **`/en/`** routes.  
- Mongolian pages need not mirror English 1:1; optimize clarity per audience.

## Mongolian script and UX

Traditional Mongolian script has **font and layout** constraints. If you target vertical or mixed layouts: test **Chrome, Firefox, Safari** with real content; track **font stack** and **CSS** (`writing-mode`, etc.) in dedicated issues—not unrelated PRs.

## CLI

Reuse the same catalogs (or a thin Node loader) so CLI messages stay aligned with the web app.
