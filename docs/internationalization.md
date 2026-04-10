# Internationalization (i18n)

InariWrite is **Mongolian-first** in spirit: the project home and community story emphasize Mongolia’s open-source ecosystem, while **English** is supported so global contributors can use and ship features without friction.

## Principles

1. **User-authored Markdown** is language-agnostic. Only **application chrome** (menus, buttons, errors, onboarding) is translated.
2. Use **BCP 47** locale tags: start with `mn` and `en`. If you later need script-specific tags (e.g. Mongolian script considerations), validate **browser and font** behavior early.
3. **Default UI locale:** `mn` where the product team agrees it makes sense; always provide a clear way to switch to `en` (and document it).

## Suggested libraries

- **i18next** + **react-i18next** for the web app, **or**
- **FormatJS** if the team prefers ICU messages everywhere

Keep message files in a dedicated package or folder, for example:

```
packages/i18n/
├── locales/
│   ├── mn.json
│   └── en.json
└── src/
    └── index.ts
```

## Contributor workflow

- Adding a string: update **both** `mn.json` and `en.json`, or open a follow-up issue labeled `i18n`.
- PR template reminder: “UI change → locales updated?”
- At scale: connect **Weblate** or **Crowdin**; not required on day one.

## Documentation languages

- **Docs site:** routes or prefixes like `/mn/` and `/en/`.
- Mongolian pages do not need to mirror English 1:1 initially; prioritize clarity for the primary audience you choose per page.

## Mongolian script and UX

Traditional Mongolian script has **layout and font** constraints in browsers. If you target vertical script or mixed layouts:

- Test on **Chrome, Firefox, Safari** with real content early.
- File dedicated issues for **font stack** and **CSS** (e.g. `writing-mode`) rather than bolting fixes into unrelated PRs.

## CLI

- Reuse the same message catalogs or a thin Node loader so CLI errors and help text stay consistent with the web app.
