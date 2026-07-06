import { resolve } from "path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@kosmesis/cli": resolve(__dirname, "packages/cli/src/index.ts"),
    },
  },
  test: {
    environment: "node",
    include: ["packages/**/src/__tests__/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: ["packages/**/src/**/*.{ts,tsx}"],
      exclude: ["packages/**/src/__tests__/**", "packages/**/src/index.ts"],
    },
  },
});
