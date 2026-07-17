# syntax=docker/dockerfile:1

FROM node:20-bookworm-slim AS build
WORKDIR /app
ARG NEXT_PUBLIC_APP_BASE_URL=http://localhost:3000
ARG NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_APP_BASE_URL=$NEXT_PUBLIC_APP_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps ./apps
COPY packages ./packages
RUN pnpm install --frozen-lockfile \
  && pnpm --filter @chainvigil/web... build

FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable \
  && groupadd --system --gid 1001 chainvigil \
  && useradd --system --uid 1001 --gid chainvigil chainvigil
COPY --from=build --chown=chainvigil:chainvigil /app /app
USER chainvigil
EXPOSE 3000
CMD ["pnpm", "--filter", "@chainvigil/web", "start", "--", "--hostname", "0.0.0.0"]
