FROM node:20-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps ./apps
COPY packages ./packages

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @chainvigil/api... build

EXPOSE 4000

CMD ["pnpm", "--filter", "@chainvigil/api", "start"]
