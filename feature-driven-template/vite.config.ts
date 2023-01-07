import { resolve } from "path";
import { defineConfig } from "vitest/config";

const packageJson = require("./package.json");

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  resolve: {
    alias: {
      "~": resolve("./src"),
    },
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      external: Object.keys(packageJson.dependencies),
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
