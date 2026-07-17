# syntax=docker/dockerfile:1

FROM node:20-bookworm-slim AS build
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps ./apps
COPY packages ./packages
RUN pnpm install --frozen-lockfile \
  && pnpm --filter @chainvigil/api... build

FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable \
  && groupadd --system --gid 1001 chainvigil \
  && useradd --system --uid 1001 --gid chainvigil chainvigil
COPY --from=build --chown=chainvigil:chainvigil /app /app
USER chainvigil
EXPOSE 4000
CMD ["sh", "-c", "pnpm db:deploy && pnpm --filter @chainvigil/api start"]
