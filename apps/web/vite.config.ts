import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { VitePWA } from "vite-plugin-pwa";

/** Desktop (Tauri) and mobile (Capacitor) load assets from `file:` / app schemes — need relative URLs. */
const isEmbedded =
  Boolean(process.env.TAURI_ENV_PLATFORM) || process.env.VITE_EMBEDDED === "1";

/** `vite-plugin-pwa` is off for embedded builds; Rollup still must resolve this id. */
function pwaRegisterStub(): Plugin {
  const virtual = "\0inari:virtual-pwa-register";
  return {
    name: "inari-pwa-register-stub",
    resolveId(id) {
      if (isEmbedded && id === "virtual:pwa-register") {
        return virtual;
      }
      return undefined;
    },
    load(id) {
      if (id === virtual) {
        return "export function registerSW(){}";
      }
      return undefined;
    },
  };
}

/** Split heavy vendors for parallel fetch + long cache lifetimes on deploy. */
function manualChunks(id: string): string | undefined {
  if (!id.includes("node_modules")) return undefined;
  if (id.includes("@codemirror") || id.includes("@lezer")) {
    return "codemirror-vendor";
  }
  if (/[/\\]node_modules[/\\](?:react-dom|react|scheduler)[/\\]/.test(id)) {
    return "react-vendor";
  }
  if (id.includes("i18next") || id.includes("react-i18next")) {
    return "i18n-vendor";
  }
  return undefined;
}

export default defineConfig({
  base: isEmbedded ? "./" : "/",
  plugins: [
    ...(isEmbedded ? [pwaRegisterStub()] : []),
    tailwindcss(),
    react(),
    ...(isEmbedded
      ? []
      : [
          VitePWA({
            registerType: "autoUpdate",
            includeAssets: [],
            manifest: {
              name: "InariWrite",
              short_name: "InariWrite",
              description: "Markdown editor",
              start_url: "/",
              display: "standalone",
              background_color: "#f8fafc",
              theme_color: "#2563eb",
              lang: "mn",
            },
            workbox: {
              globPatterns: ["**/*.{js,css,html,ico,svg,woff2}"],
            },
          }),
        ]),
  ],
  build: {
    outDir: "dist",
    target: "es2022",
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks,
      },
    },
  },
});
