FROM node:22.12.0-alpine AS base
FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY . .
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN mkdir .next
RUN chown nextjs:nodejs .next
RUN apk add --no-cache curl
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 5777
ENV PORT=5777
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]

# FROM node:22.12.0-alpine
# RUN apk add --no-cache libc6-compat
# WORKDIR /app
# COPY migrations ./
# COPY src/ /app/src/ 
# COPY .prettierrc.json eslint.config.mjs next-env.d.ts next.config.mjs package.json pnpm-lock.yaml tsconfig.json ./
# RUN npm install -g pnpm
# RUN pnpm install --frozen-lockfile
# ENV NODE_ENV=production
# ENV NEXT_TELEMETRY_DISABLED=1
# ENV PORT=5777
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs
# RUN chown -R nextjs:nodejs /app
# RUN if [ "$RUN_PAYLOAD" = "true" ]; then pnpm run payload; fi
# RUN mkdir .next
# RUN chown nextjs:nodejs .next
# RUN pnpm run build
# USER nextjs
# EXPOSE 5777
# ENV HOSTNAME=0.0.0.0
# CMD ["node", ".next/standalone/server.js"]