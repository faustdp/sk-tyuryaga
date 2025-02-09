FROM node:22.12.0-alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY . .
RUN npm install -g pnpm
RUN pnpm install
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=5777
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN chown -R nextjs:nodejs /app
USER nextjs
EXPOSE 5777
CMD ["sh", "-c", "pnpm run build && pnpm run start"]

# FROM node:22.13.1-alpine AS payload-cms

# FROM payload-cms AS deps
# RUN apk add --no-cache libc6-compat
# WORKDIR /app
# COPY package.json pnpm-lock.yaml* ./
# RUN npm install pnpm
# RUN pnpm i --frozen-lockfile

# FROM payload-cms AS builder
# WORKDIR /app
# COPY --from=deps /app/node_modules ./node_modules
# COPY . .
# ENV NEXT_TELEMETRY_DISABLED=1
# RUN npm install pnpm
# RUN pnpm run payload migrate
# RUN pnpm run build

# FROM payload-cms AS runner
# WORKDIR /app
# ENV NODE_ENV=production
# ENV NEXT_TELEMETRY_DISABLED=1
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs
# RUN mkdir .next
# RUN chown nextjs:nodejs .next
# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# USER nextjs
# EXPOSE 5777
# ENV PORT=5777
# CMD ["node", "server.js"]