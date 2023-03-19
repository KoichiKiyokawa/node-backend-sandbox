const path = require("path")

/** @type {import('@rspack/cli').Configuration} */
module.exports = {
  entry: {
    main: "./src/index.ts",
  },
  target: "node",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
}
