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