module.exports = {
  root: true,
  plugins: ["@typescript-eslint", "deprecation"],
  extends: ["plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "test/tsconfig.json"],
  },
  overrides: [
    {
      files: ["src/**/*.ts", "test/**/*.ts"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/no-inferrable-types": "off",
        "@typescript-eslint/no-namespace": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-var-requires": "off",
        "deprecation/deprecation": "error",
      },
    },
  ],
};
