FROM node:22.12.0-alpine AS builder
WORKDIR /app
COPY pnpm-lock.yaml package.json ./
RUN npm install -g pnpm
RUN pnpm install --prod --frozen-lockfile
COPY . .
RUN pnpm run build
# :deployed
RUN pnpm run build:server

FROM node:22.12.0-alpine
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache curl
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/build ./build
COPY --from=builder /app/index.mjs ./
RUN chown -R nextjs:nodejs /app
USER nextjs
CMD ["node", "index.mjs"]