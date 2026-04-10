# Optional cloud (Phase 5)

**Doc index:** [README.md](README.md) · **Local-first promise:** [README](../README.md#local-first)

InariWrite is **local-first** today: web and CLI need **no** accounts, sync servers, or hosted AI. This page is about how **optional** cloud-style features could live **next to** the editor—not inside **`@inariwrite/core`** or the default apps.

## Principles

| # | Rule |
|---|------|
| 1 | **Nothing in this monorepo requires a server** for edit, preview, or static export. |
| 2 | **Sync, auth, AI** are optional **separate deployables** (your infra or a vendor). |
| 3 | **Core stays backend-agnostic**; future adapters might call HTTP you configure—defaults stay offline. |

## What “optional cloud” can mean

| Capability | Why a server? | Pattern |
|------------|---------------|---------|
| **Sync** | Multi-device / backup beyond the browser | E2EE or trusted store; CRDT/OT or snapshots—**never** required for local use |
| **Auth** | Teams, billing, shared drives | OIDC/OAuth to **your** IdP; tokens only for optional features |
| **Hosted AI** | Hide keys, quotas, policy | Thin **proxy** you run; editor talks to it only if the user opts in |

## Trust boundaries (sketch)

| Zone | Trust | Data |
|------|--------|------|
| **Device** | User | Markdown in memory, theme/locale in `localStorage`, files via browser APIs |
| **Default OSS build** | Published artifacts | Static JS/CSS; no in-repo telemetry |
| **Optional sync** | Your policy | Ciphertext or plaintext—**your** docs |
| **Optional AI proxy** | You + model vendor | Prompts/snippets only if enabled |

**Design risks if you add cloud:** token theft (short-lived tokens, HTTPS, least scope), **prompt injection** (treat model output as untrusted), **supply chain** (pin server deps; keep servers out of the default editor graph).

## Self-hosting a companion service

- Document **env**, **OAuth redirects**, **retention** in **that** repo—not here.  
- Prefer **stateless** gateways; durable state in DB/storage you control.  
- Do **not** bake a vendor hostname into the open editor build; use runtime config or user-supplied base URL.

## Scope of *this* repository

| In scope | Out of scope (by default) |
|----------|---------------------------|
| Markdown pipeline, web/CLI UX, plugins, docs, CI | User DBs, billing, model routing, team ACLs |

**CLI `publish`** is the in-repo **opt-in** hook: raw Markdown to **your** URL (see below). A full backend belongs in another repo/package.

## CLI: `publish` (opt-in)

```bash
inariwrite publish <file.md> -u https://example.com/hooks/md
```

- Body: **raw Markdown**, `Content-Type: text/markdown; charset=utf-8`.  
- Method: **POST** (default), **PUT**, or **PATCH** (`-m`).  
- Auth: optional **`Authorization: Bearer`** via **`--token`** or env **`INARIWRITE_PUBLISH_TOKEN`** (prefer env—avoids shell history).

No bundled server: you point at **your** webhook or API. Use **HTTPS** in production; treat URL and token as secrets.
