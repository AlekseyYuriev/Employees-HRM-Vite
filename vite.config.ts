import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import graphqlLoader from "vite-plugin-graphql-loader";

export default defineConfig({
  plugins: [vue(), graphqlLoader()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
        @import "@/assets/styles/reset.css";
        @import "@/assets/styles/global.scss";`,
      },
    },
  },
});
