import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    entry: "src/main.ts",
    platform: "node",
    format: "esm",
    dts: false,
    minify: true,
    shims: true,
    sourcemap: true,
    deps: {
      alwaysBundle: [/.*/],
      onlyBundle: false,
      // Features outside this sample load their optional integrations only when used.
      neverBundle: [
        "@apollo/gateway",
        "@apollo/subgraph",
        "@as-integrations/fastify",
        "@nestjs/microservices",
        "@nestjs/microservices/microservices-module.js",
        "@nestjs/platform-express",
        "@nestjs/websockets/socket-module.js",
        "class-transformer",
        "class-transformer/storage",
        "class-validator",
        "ts-morph",
      ],
    },
  },
});
