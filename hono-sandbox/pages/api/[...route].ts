import { Hono } from "hono"
import { handle } from "hono/nextjs"

export const config = {
  runtime: "edge",
}

const app = new Hono()

const r1 = app.get("/users", (c) => {
  return c.jsonT([
    { id: 1, name: "John" },
    { id: 2, name: "Jane" },
  ])
})

const r2 = app.get("/users/:id", (c) => {
  return c.jsonT({ id: c.req.param("id"), name: "John" })
})

export type AppType = typeof r1 | typeof r2

export default handle(app, "/api")
