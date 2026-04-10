# Platforms: web, desktop, mobile

One **React + Vite** UI lives in `apps/web`. You can ship it as a **browser/PWA**, a **Tauri** desktop app, or **Capacitor** Android/iOS shells.

**Doc map:** [docs/README.md](README.md) · **Architecture:** [architecture.md](architecture.md)

## Comparison

| Shape | Typical use | How |
|-------|-------------|-----|
| **Web** | Deploy to HTTPS; install as PWA on phones | `pnpm dev` / `pnpm build` → `apps/web/dist` |
| **Desktop** | Native window (Linux, macOS, Windows) | `pnpm desktop:dev` / `pnpm desktop:build` |
| **Mobile** | Store-ready shells around the same UI | Capacitor: add platform once, then `pnpm mobile:sync` |

## Web (browser + PWA)

- Default **`pnpm build`**: absolute asset paths, **service worker** + manifest.  
- Installable PWA when served over **HTTPS**.  
- Quick start: root [README](../README.md).

## Desktop (Tauri)

**Needs:** [Rust](https://www.rust-lang.org/tools/install) (stable); Linux: [WebKitGTK and deps](https://v2.tauri.app/start/prerequisites/#linux); macOS/Windows: per [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/).

From repo root:

```bash
pnpm install
pnpm desktop:dev     # Vite + native window
pnpm desktop:build   # installers → apps/desktop/src-tauri/target/release/bundle/
```

Uses **`build:embedded`** in `@inariwrite/web` (relative `base`, no real PWA — service worker stubbed).

## Mobile (Capacitor)

**Needs:** Android Studio + SDK (Android); macOS + Xcode (iOS).

**One-time** — creates `apps/web/android` and/or `apps/web/ios` (gitignored by default):

```bash
pnpm mobile:add:android
pnpm mobile:add:ios    # macOS only
```

**After UI or dependency changes:**

```bash
pnpm mobile:sync       # build:embedded + cap sync
```

Open IDEs:

```bash
pnpm --filter @inariwrite/web exec cap open android
pnpm --filter @inariwrite/web exec cap open ios
```

Same embedded build as Tauri (`base: './'`).

## Important: `dist/` and embedded builds

`pnpm run build:embedded` and **`pnpm mobile:sync`** overwrite **`apps/web/dist`**.

Before you **deploy the web app**, run **`pnpm build`** (or `pnpm --filter @inariwrite/web run build`).  
Before **`pnpm run budget`** or **`pnpm run test:e2e`**, use a **normal** web build, not embedded-only output.
