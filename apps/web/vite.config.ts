import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
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
  ],
  build: {
    outDir: "dist",
  },
});
