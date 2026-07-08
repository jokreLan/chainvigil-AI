FROM node:20-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps ./apps
COPY packages ./packages

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @chainvigil/admin... build

EXPOSE 3001

CMD ["pnpm", "--filter", "@chainvigil/admin", "start", "--", "--hostname", "0.0.0.0"]
