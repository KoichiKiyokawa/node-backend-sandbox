import { createYoga } from "graphql-yoga"
import fastify, { FastifyRequest, FastifyReply } from "fastify"

// This is the fastify instance you have created
const app = fastify({ logger: true })

const yoga = createYoga<{
  req: FastifyRequest
  reply: FastifyReply
}>({
  // Integrate Fastify logger
  logging: {
    debug: (...args) => args.forEach((arg) => app.log.debug(arg)),
    info: (...args) => args.forEach((arg) => app.log.info(arg)),
    warn: (...args) => args.forEach((arg) => app.log.warn(arg)),
    error: (...args) => args.forEach((arg) => app.log.error(arg)),
  },
  graphiql: process.env.NODE_ENV !== "production",
})

/**
 * We pass the incoming HTTP request to GraphQL Yoga
 * and handle the response using Fastify's `reply` API
 * Learn more about `reply` https://www.fastify.io/docs/latest/Reply/
 **/
app.route({
  url: "/graphql",
  method: ["GET", "POST", "OPTIONS"],
  handler: async (req, reply) => {
    // Second parameter adds Fastify's `req` and `reply` to the GraphQL Context
    const response = await yoga.handleNodeRequest(req, {
      req,
      reply,
    })
    response.headers.forEach((value, key) => {
      reply.header(key, value)
    })

    reply.status(response.status)

    reply.send(response.body)

    return reply
  },
})

app.listen({ port: Number(process.env.PORT || 4000) })
