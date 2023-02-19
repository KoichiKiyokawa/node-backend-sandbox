import { AppType } from "@/pages/api/[...route]"
import { hc } from "hono/client"

export const client = hc<AppType>("http://localhost:3000/api")
