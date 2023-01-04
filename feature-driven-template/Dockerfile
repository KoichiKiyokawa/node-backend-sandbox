FROM node:16 AS builder
WORKDIR /workspace
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install
COPY . .
RUN pnpm prisma generate && pnpm build && pnpm prune --prod

FROM gcr.io/distroless/nodejs16-debian11
WORKDIR /app
COPY --from=builder /workspace/dist /app/dist
COPY --from=builder /workspace/node_modules /app/node_modules
CMD [ "dist/index.mjs" ]
