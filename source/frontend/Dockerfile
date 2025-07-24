# Step 1: Build stage
FROM node:18 AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY tailwind.config.js ./
COPY postcss.config.mjs ./
COPY tsconfig.json ./
COPY next.config.ts ./
COPY public/ ./public
COPY app/ ./app
COPY components/ ./components
COPY utils/ ./utils

RUN corepack enable
RUN pnpm install
RUN pnpm run build

# Step 2: Production stage
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/app ./app
COPY --from=builder /app/components ./components
COPY --from=builder /app/utils ./utils
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/next.config.ts ./

ENV NODE_ENV=production
EXPOSE 3000

RUN corepack enable

CMD ["pnpm", "start"]