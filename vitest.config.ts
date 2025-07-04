// vitest.config.ts
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import graphql from "@rollup/plugin-graphql";
import { coverageConfigDefaults } from "vitest/config";

export default defineConfig({
  plugins: [vue() as any, graphql()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    server: {
      deps: {
        inline: ["vuetify"],
      },
    },
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: [
        "**/*.d.ts",
        "**/node_modules/**",
        "**/*.config.{js,cjs,mjs,ts,cts,mts}",
        "public/**/*",
        "coverage/**",
        "dist/**",
        "**/types/**",
        "tests/**",
        "src/assets/**",
        "src/constants/**",
        "src/components/UI/index.ts",
        ...coverageConfigDefaults.exclude,
      ],
    },
    include: ["**/*.spec.ts"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
