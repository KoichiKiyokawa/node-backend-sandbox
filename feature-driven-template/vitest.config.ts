import { defineConfig } from "vitest/config";
import { resolve } from "path";

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  resolve: {
    alias: {
      "~": resolve("./src"),
    },
  },
  test: {
    globals: true,
    globalSetup: "./test/setup.ts",
    coverage: {
      provider: "c8",
    },
  },
});
