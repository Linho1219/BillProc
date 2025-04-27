import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";
import { visualizer } from "rollup-plugin-visualizer";
import { nodePolyfills } from "vite-plugin-node-polyfills";

import "dotenv/config";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith("s-"),
        },
      },
    }),
    nodePolyfills(),
    visualizer({
      gzipSize: true,
      brotliSize: true,
      emitFile: false,
      filename: "chunk-analysis.html",
    }),
  ],
  build: {
    chunkSizeWarningLimit: 1024,
    rollupOptions: {
      output: {
        manualChunks: {
          iconv: ["iconv-lite", "safer-buffer"],
        },
      },
    },
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: resolve(__dirname, "./src"),
      },
    ],
  },
  server: {
    allowedHosts: [process.env.DEVHOST ?? "localhost"],
  },
});
