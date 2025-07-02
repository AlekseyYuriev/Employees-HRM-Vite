// vitest.config.ts
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import { coverageConfigDefaults } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: [
        ...coverageConfigDefaults.exclude,
        "coverage/**",
        "dist/**",
        "**/node_modules/**",
        "**/*.d.ts",
        "**/*.config.{js,cjs,mjs,ts,cts,mts}",
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
