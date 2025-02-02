FROM node:22.12.0-alpine AS builder
WORKDIR /app

COPY pnpm-lock.yaml package.json ./
RUN npm install -g pnpm
RUN pnpm install --prod --frozen-lockfile

COPY . .
RUN pnpm run build
RUN pnpm run build:server

FROM node:22.12.0-alpine
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache curl
RUN adduser -D appuser

COPY --from=builder /app/build ./build
COPY --from=builder /app/index.mjs ./

EXPOSE 5773
USER appuser

CMD ["node", "index.mjs"]