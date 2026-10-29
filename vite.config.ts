import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalized = id.replaceAll("\\", "/");
          if (/\/node_modules\/(react|react-dom|scheduler)\//.test(normalized)) {
            return "vendor-react";
          }
          if (normalized.includes("/node_modules/")) {
            return "vendor";
          }
          if (normalized.endsWith("/src/data/locales.mjs")) {
            return "locales";
          }
          if (normalized.includes("/src/data/")) {
            return "content";
          }
        },
      },
    },
  },
}));
