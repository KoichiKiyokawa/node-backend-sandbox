const optionalPackages = new Set([
  "@apollo/gateway",
  "@apollo/subgraph",
  "@as-integrations/fastify",
  "@nestjs/platform-express",
  "ts-morph",
]);

module.exports = (options, rspack) => ({
  ...options,
  mode: "production",
  // Bundle the installed runtime dependencies. Keep Node's built-ins external.
  externals: [],
  externalsPresets: { node: true },
  output: { ...options.output, clean: true },
  plugins: [
    ...options.plugins,
    new rspack.IgnorePlugin({
      checkResource(resource) {
        if (!optionalPackages.has(resource)) return false;

        try {
          require.resolve(resource);
          return false;
        } catch (error) {
          if (error.code !== "MODULE_NOT_FOUND") throw error;
          return true;
        }
      },
    }),
  ],
});
