# ⚔️ Sentinel

Marketplace and agent stack for contract factoring.

Sentinel V3 is a multi-app monorepo:
- `apps/web`: marketplace and operator UI (Next.js, TypeScript, Tailwind)
- `apps/agent`: FactorBridge AI service (Google ADK, LiteLLM, Supabase/PostgreSQL)
- `apps/chain`: Solana/Anchor vault program workspace

## Setup and run

Prerequisites: Bun 1.x, Python 3.10+, Docker (optional), root `.env.local`.

Full stack with Docker:

```bash
make up
make down
make logs
make ps
make reset
make test
```

Web app only:

```bash
cd apps/web
bun install
bun dev
```

## Development commands

Run from `apps/web`:

```bash
bun run generate
bun run generate:checkout
bun x tsc --noEmit
bun run build
bun test:run
```

Required env vars for web:

```bash
NEXT_PUBLIC_SALEOR_API_URL=https://your-instance.saleor.cloud/graphql/
NEXT_PUBLIC_DEFAULT_CHANNEL=your-channel-slug
```

Common optional vars: `NEXT_PUBLIC_STOREFRONT_URL`, `REVALIDATE_SECRET`, `SALEOR_WEBHOOK_SECRET`, `SALEOR_APP_TOKEN`, `SALEOR_MAX_CONCURRENT_REQUESTS`, `SALEOR_MIN_REQUEST_DELAY_MS`, `SALEOR_REQUEST_TIMEOUT_MS`, `NEXT_BUILD_RETRIES`.

Required env vars for agent: `POSTGRES_URL`, `MODEL_PROVIDER`, and `HUGGINGFACE_API_KEY` or `OPENROUTER_API_KEY`.

## Docs

- [AGENTS.md](/home/dubu/git/dev3pack3/AGENTS.md)
- [apps/agent/readme.md](/home/dubu/git/dev3pack3/apps/agent/readme.md)
- [apps/agent/docs/deployment_gcp.md](/home/dubu/git/dev3pack3/apps/agent/docs/deployment_gcp.md)
- [apps/agent/docs/model_providers.md](/home/dubu/git/dev3pack3/apps/agent/docs/model_providers.md)
- [apps/web/src/styles/readme.md](/home/dubu/git/dev3pack3/apps/web/src/styles/readme.md)
