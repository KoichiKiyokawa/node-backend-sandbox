import { defineBuildConfig } from "unbuild"
import { resolve } from "path"

export default defineBuildConfig({
  alias: {
    "~": resolve("./src"),
  },
  failOnWarn: false,
})
