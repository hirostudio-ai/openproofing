# =============================================================================
# OpenProofing Dockerfile
# Multi-stage build for production deployment
# =============================================================================

# --- Stage 1: Install dependencies ---
FROM node:22-alpine AS deps
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod=false

# --- Stage 2: Build the application ---
FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN pnpm exec prisma generate

# Build Next.js
RUN pnpm build

# --- Stage 3: Production runner ---
FROM node:22-alpine AS runner
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 openproofing && \
    adduser --system --uid 1001 openproofing

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=openproofing:openproofing /app/.next/standalone ./
COPY --from=builder --chown=openproofing:openproofing /app/.next/static ./.next/static

# Copy Prisma schema and migrations for runtime migration support
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.pnpm/@prisma+client*/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/node_modules/.pnpm/prisma*/node_modules/prisma ./node_modules/prisma

USER openproofing

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
